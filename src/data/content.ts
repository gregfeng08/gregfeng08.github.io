// Static site content. Projects and the blog feed are compiled straight into
// the bundle — to add or edit content, change this file and rebuild
// (`npm run build`). There is no CMS.

import type { Article, FeedEntry, Post, Project } from "../types";

// Selected projects, shown on the home page. `order` controls placement
// (lower = higher on the page).
export const PROJECTS: Project[] = [
  {
    id: "mxr-metrology",
    title: "Mixed Reality Semiconductor Metrology",
    short: "Cloud-to-Quest pipeline for 500k–1M face 3D models",
    tags: ["Unity 6", "C#", "Cloud Run", "Mixed Reality"],
    when: "Nov 2025 – Jun 2026",
    role: "Lead engineer · Celano Lab",
    blurb:
      "Built the full cloud-to-Quest pipeline: a Cloud Run TypeScript dashboard pushes scan data and 3D models to a Unity-based MR experience on Quest 3 / 3s. Quadric edge decimation + sampled convex mesh generation keep ~500k–1M face models interactive on-headset. Includes a supplementary annotation tool that exports localized, parseable label data for the downstream app.",
    featured: true,
    order: 0,
  },
  {
    id: "stock-sim",
    title: "Educational Stock Trading Simulation",
    short: "Historically-grounded trading sim with NPC dialogues",
    tags: ["Flask", "SQLite", "Unity", "C#"],
    when: "Mar 2025 – Jul 2026",
    role: "Applied project",
    blurb:
      "Teaches investing fundamentals through real financial data and procedurally-generated NPC dialogues. Flask + SQLite backend handles persistence and dynamic market events; Unity gameplay layer surfaces SMA50/RSI indicators on interactive trading terminals and runs a knowledge graph that reacts to the player's decisions.",
    featured: true,
    order: 1,
  },
  {
    id: "steel",
    title: "Steel Team Cognition: Performance Metrics",
    short: "Real-time team-behavior capture for VR medic training at 60 FPS",
    tags: ["Unity", "C#", "Kafka", "MongoDB"],
    when: "May 2024 – Dec 2025",
    role: "XR Developer · Meteor Studio",
    blurb:
      "Designed the Team Performance Architecture, a 5-layer framework that captures movement, view-frustum visual activity, and team-coordination metrics during a Quest-based VR medic training sim. Multiprocessed collection pipelines stream data through Kafka into MongoDB for downstream analysis.",
    featured: true,
    order: 2,
  },
  {
    id: "rag-ta",
    title: "Canvas RAG Teaching Assistant",
    short: "Ingestion layer for a GPT-3.5-powered TA bot",
    tags: ["Python", "Whisper", "scikit-learn", "PyTorch"],
    when: "Aug 2024 – May 2025",
    role: "Course project",
    blurb:
      "Built the data ingestion layer: scrapes Canvas assignments, discussions, due dates, and announcements; handles pagination + normalization; keeps a current searchable knowledge base feeding a GPT-3.5-turbo RAG pipeline.",
    order: 3,
  },
  {
    id: "conformal",
    title: "Spherical Conformal Harmonic Map Calculator",
    short: "Brain-mesh → unit-sphere parameterization in C++",
    tags: ["C++", "Halfedge", "Numerical Methods"],
    when: "Aug 2024 – Dec 2024",
    role: "Graphics research",
    blurb:
      "Projects brain meshes onto the unit sphere via Gauss-map init, then minimizes Tuette energy through gradient descent on the mesh Laplacian with tangent-plane projection for a topology-preserving base map. Refines into a conformal parameterization via harmonic-energy minimization with cotangent weights, area-weighted recentering for numerical stability.",
    order: 4,
  },
];

// ---- Blog feed -----------------------------------------------------------
// Short "posts" render inline in the stream. Long "articles" show a preview
// card that links to their own page. Both are edited here.

// No posts yet. Add short updates here; they render inline in the stream.
// Example shape:
//   {
//     id: "unique-id",
//     kind: "post",
//     topic: "Graphics",          // Graphics | XR | Systems | Life
//     date: "2026-08-20T14:00",   // include a time so same-day posts order right
//     body: "Short **Markdown** update. Inline math like $a^2 + b^2 = c^2$ works.",
//     // image: "/optional.jpg",  // optional attached image
//   },
const posts: Post[] = [];

// No articles yet. Add your long-form pieces here. Example shape:
//   {
//     id: "unique-id",
//     kind: "article",
//     slug: "my-article",          // URL becomes /blog/my-article
//     topic: "Graphics",           // Graphics | XR | Systems | Life
//     date: "2026-08-20",
//     readingTime: "6 min",        // optional
//     title: "My article title",
//     blurb: "One-line teaser shown on the stream card.",
//     body: "## Heading\n\nFull Markdown body goes here...",
//   },
const articles: Article[] = [];

// The full feed, newest first. Edit `posts` and `articles` above.
export const FEED: FeedEntry[] = [...posts, ...articles]
  .filter((e) => e.published !== false)
  .sort((a, b) => b.date.localeCompare(a.date));

// Projects sorted for display (by `order`, then original position).
export const sortedProjects = (): Project[] =>
  [...PROJECTS].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

// Look up a single article by slug (for the article page).
export const articleBySlug = (slug: string | undefined): Article | undefined =>
  FEED.find((e): e is Article => e.kind === "article" && e.slug === slug);
