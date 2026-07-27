// Content context: fetches projects + blog posts once and shares them across
// the site, with refresh() hooks so admin edits update every view immediately.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { projectsApi, postsApi } from "./api";
import type { BlogPost, Project } from "../types";

interface ContentValue {
  projects: Project[];
  projectsLoading: boolean;
  refreshProjects: () => Promise<void>;
  posts: BlogPost[];
  postsLoading: boolean;
  refreshPosts: () => Promise<void>;
}

const ContentContext = createContext<ContentValue | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const refreshProjects = useCallback(async () => {
    try {
      const data = await projectsApi.list();
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  const refreshPosts = useCallback(async () => {
    try {
      const data = await postsApi.list();
      setPosts(data);
    } catch (err) {
      console.error("Failed to load posts", err);
    } finally {
      setPostsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProjects();
    refreshPosts();
  }, [refreshProjects, refreshPosts]);

  return (
    <ContentContext.Provider
      value={{
        projects,
        projectsLoading,
        refreshProjects,
        posts,
        postsLoading,
        refreshPosts,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): ContentValue {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
