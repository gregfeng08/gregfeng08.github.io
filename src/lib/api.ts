// Thin client for the backend JSON API. Reads are public; writes require a
// verified admin. When the user is signed in, a Firebase ID token is attached
// to every request (harmless on reads — the server treats it as "optional
// admin", which lets the admin also receive unpublished drafts).

import type { BlogPost, Project } from "../types";

type TokenGetter = () => Promise<string | null>;

let tokenGetter: TokenGetter | null = null;

// Registered by AuthProvider once Firebase auth is wired up.
export function setTokenGetter(fn: TokenGetter | null) {
  tokenGetter = fn;
}

async function req<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string> | undefined),
  };
  if (tokenGetter) {
    try {
      const token = await tokenGetter();
      if (token) headers.Authorization = `Bearer ${token}`;
    } catch {
      /* not signed in — proceed unauthenticated */
    }
  }
  const res = await fetch(`/api${path}`, { ...opts, headers });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ---- Projects ----
export const projectsApi = {
  list: () => req<Project[]>("/projects"),
  create: (body: Partial<Project>) =>
    req<Project>("/projects", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: Partial<Project>) =>
    req<Project>(`/projects/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  remove: (id: string) =>
    req<void>(`/projects/${id}`, { method: "DELETE" }),
};

// ---- Blog posts ----
export const postsApi = {
  list: () => req<BlogPost[]>("/posts"),
  get: (slug: string) => req<BlogPost>(`/posts/${slug}`),
  create: (body: Partial<BlogPost>) =>
    req<BlogPost>("/posts", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: Partial<BlogPost>) =>
    req<BlogPost>(`/posts/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  remove: (id: string) =>
    req<void>(`/posts/${id}`, { method: "DELETE" }),
};
