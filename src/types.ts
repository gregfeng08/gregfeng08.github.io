// Shared data shapes for the portfolio + blog.

export interface Project {
  id: string;
  title: string;
  short: string;
  blurb: string;
  tags: string[];
  when: string; // e.g. "Nov 2025 — Present"
  role: string; // e.g. "Lead engineer · Celano Lab"
  image?: string; // optional URL to a real screenshot/capture
  featured?: boolean;
  order?: number; // manual sort (lower = higher on the page)
}

export type BlogCategory = "Graphics" | "XR Devlog" | "Systems" | "Notes";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: BlogCategory;
  date: string; // ISO "2026-03-14" — sorted newest first
  readingTime: string; // e.g. "8 min"
  blurb: string;
  body: string; // markdown
  featured?: boolean;
  published?: boolean;
}

export interface WorkEntry {
  company: string;
  role: string;
  when: string;
  where: string;
  bullets: string[];
}

export interface Degree {
  name: string;
  gpa: string;
}

export interface Education {
  school: string;
  program: string;
  when: string;
  degrees: Degree[];
  awards: string[];
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface Person {
  name: string;
  handle: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  location: string;
}
