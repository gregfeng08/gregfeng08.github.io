// Shared data shapes for the portfolio + blog.

// A single item in a project's figure gallery. `src` is a path under public/
// (leading slash), e.g. "/projects/mxr-metrology/demo.mp4".
export interface MediaItem {
  type: "image" | "video";
  src: string;
  poster?: string; // optional poster frame for a video
  alt?: string;
}

export interface Project {
  id: string;
  title: string;
  short: string;
  blurb: string;
  tags: string[];
  when: string; // e.g. "Nov 2025 – Present"
  role: string; // e.g. "Lead engineer · Celano Lab"
  image?: string; // single image (legacy / simple case)
  media?: MediaItem[]; // gallery of images + video; cycles with dots
  featured?: boolean;
  order?: number; // manual sort (lower = higher on the page)
}

// The blog is a single reverse-chron stream of two kinds of entry:
//  - "post"    — a short, casual update rendered inline in the stream.
//  - "article" — a long piece shown as a preview card that links out to its
//                own page (/blog/<slug>).
export type Topic = "Graphics" | "XR" | "Systems" | "Life";

interface FeedBase {
  id: string;
  kind: "post" | "article";
  topic: Topic;
  date: string; // ISO — "2026-03-14" or "2026-03-14T18:30" — sorted newest first
  published?: boolean;
}

export interface Post extends FeedBase {
  kind: "post";
  body: string; // short markdown, rendered inline
  image?: string; // optional attached image (WIP render, screenshot, meme)
}

export interface Article extends FeedBase {
  kind: "article";
  slug: string;
  title: string;
  blurb: string;
  readingTime?: string; // e.g. "8 min"
  body: string; // full markdown, shown on the article page
}

export type FeedEntry = Post | Article;

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
