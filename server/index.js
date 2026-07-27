// Express server for Cloud Run. Serves the built React app (dist/) and a small
// JSON API for projects + blog posts backed by the datastore. Writes require a
// verified admin (see auth.js). One container, one port.

import express from "express";
import compression from "compression";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initStore, listAll, getById, upsert, remove } from "./store.js";
import { initAdmin, requireAdmin, optionalAdmin } from "./auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "..", "dist");
const PORT = process.env.PORT || 8080;

const app = express();
app.use(compression());
app.use(express.json({ limit: "1mb" }));

initAdmin();

// ---- helpers --------------------------------------------------------------
function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}
function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
const str = (v) => (typeof v === "string" ? v : "");
const bool = (v) => v === true;

// ===========================================================================
// Projects
// ===========================================================================
const sanitizeProject = (b) => ({
  title: str(b.title).trim(),
  short: str(b.short).trim(),
  blurb: str(b.blurb).trim(),
  role: str(b.role).trim(),
  when: str(b.when).trim(),
  tags: Array.isArray(b.tags) ? b.tags.map((t) => str(t).trim()).filter(Boolean) : [],
  image: str(b.image).trim() || null,
  featured: bool(b.featured),
  order: Number.isFinite(Number(b.order)) ? Number(b.order) : 999,
});

app.get("/api/projects", async (_req, res) => {
  const items = await listAll("projects");
  items.sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.title.localeCompare(b.title));
  res.json(items);
});

app.post("/api/projects", requireAdmin, async (req, res) => {
  const data = sanitizeProject(req.body);
  if (!data.title) return res.status(400).json({ error: "Title is required" });
  const item = { id: uid("proj"), ...data };
  await upsert("projects", item);
  res.status(201).json(item);
});

app.put("/api/projects/:id", requireAdmin, async (req, res) => {
  const existing = await getById("projects", req.params.id);
  if (!existing) return res.status(404).json({ error: "Project not found" });
  const item = { ...existing, ...sanitizeProject(req.body), id: existing.id };
  await upsert("projects", item);
  res.json(item);
});

app.delete("/api/projects/:id", requireAdmin, async (req, res) => {
  await remove("projects", req.params.id);
  res.status(204).end();
});

// ===========================================================================
// Blog posts
// ===========================================================================
const VALID_CATS = ["Graphics", "XR Devlog", "Systems", "Notes"];
const sanitizePost = (b) => {
  const category = VALID_CATS.includes(b.category) ? b.category : "Notes";
  return {
    title: str(b.title).trim(),
    slug: slugify(b.slug || b.title),
    category,
    date: /^\d{4}-\d{2}-\d{2}$/.test(str(b.date)) ? b.date : new Date().toISOString().slice(0, 10),
    readingTime: str(b.readingTime).trim() || "1 min",
    blurb: str(b.blurb).trim(),
    body: str(b.body),
    featured: bool(b.featured),
    published: b.published !== false,
  };
};

app.get("/api/posts", optionalAdmin, async (req, res) => {
  let items = await listAll("posts");
  if (!req.isAdmin) items = items.filter((p) => p.published !== false);
  items.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  res.json(items);
});

app.get("/api/posts/:slug", optionalAdmin, async (req, res) => {
  const items = await listAll("posts");
  const post = items.find((p) => p.slug === req.params.slug || p.id === req.params.slug);
  if (!post) return res.status(404).json({ error: "Post not found" });
  if (post.published === false && !req.isAdmin)
    return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

app.post("/api/posts", requireAdmin, async (req, res) => {
  const data = sanitizePost(req.body);
  if (!data.title) return res.status(400).json({ error: "Title is required" });
  // Ensure slug uniqueness.
  const items = await listAll("posts");
  if (items.some((p) => p.slug === data.slug)) data.slug = `${data.slug}-${Date.now().toString(36)}`;
  const item = { id: uid("post"), ...data };
  await upsert("posts", item);
  res.status(201).json(item);
});

app.put("/api/posts/:id", requireAdmin, async (req, res) => {
  const existing = await getById("posts", req.params.id);
  if (!existing) return res.status(404).json({ error: "Post not found" });
  const data = sanitizePost(req.body);
  // Keep slug unique against *other* posts.
  const items = await listAll("posts");
  if (items.some((p) => p.slug === data.slug && p.id !== existing.id))
    data.slug = `${data.slug}-${Date.now().toString(36)}`;
  const item = { ...existing, ...data, id: existing.id };
  await upsert("posts", item);
  res.json(item);
});

app.delete("/api/posts/:id", requireAdmin, async (req, res) => {
  await remove("posts", req.params.id);
  res.status(204).end();
});

// ===========================================================================
// Static app + SPA fallback
// ===========================================================================
app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use(express.static(DIST, { maxAge: "1h", index: false }));

// SPA fallback: any non-API route serves index.html so client routing works.
app.get(/^(?!\/api\/).*/, (_req, res) => {
  res.sendFile(path.join(DIST, "index.html"));
});

async function main() {
  await initStore();
  app.listen(PORT, () => console.log(`[server] listening on :${PORT}`));
}
main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
