// Static site content. This replaces the old server + Firestore datastore:
// projects and blog posts are now compiled straight into the bundle. To add or
// edit content, change this file and rebuild (`npm run build`) — there is no
// in-browser CMS on the static build.

import type { BlogPost, Project } from "../types";

// Selected projects, shown on the home page. `order` controls placement
// (lower = higher on the page).
export const PROJECTS: Project[] = [
  {
    id: "mxr-metrology",
    title: "Mixed Reality Semiconductor Metrology",
    short: "Cloud-to-Quest pipeline for 500k–1M face 3D models",
    tags: ["Unity 6", "C#", "Cloud Run", "Mixed Reality"],
    when: "Nov 2025 — Present",
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
    when: "Mar 2025 — Present",
    role: "Applied project",
    blurb:
      "Teaches investing fundamentals through real financial data and procedurally-generated NPC dialogues. Flask + SQLite backend handles persistence and dynamic market events; Unity gameplay layer surfaces SMA50/RSI indicators on interactive trading terminals and runs a knowledge graph that reacts to the player's decisions.",
    featured: true,
    order: 1,
  },
  {
    id: "steel",
    title: "Steel Team Cognition — Performance Metrics",
    short: "Real-time team-behavior capture for VR medic training at 60 FPS",
    tags: ["Unity", "C#", "Kafka", "MongoDB"],
    when: "May 2024 — Dec 2025",
    role: "XR Developer · Meteor Studio",
    blurb:
      "Designed the Team Performance Architecture — a 5-layer framework that captures movement, view-frustum visual activity, and team-coordination metrics during a Quest-based VR medic training sim. Multiprocessed collection pipelines stream data through Kafka into MongoDB for downstream analysis.",
    featured: true,
    order: 2,
  },
  {
    id: "rag-ta",
    title: "Canvas RAG Teaching Assistant",
    short: "Ingestion layer for a GPT-3.5-powered TA bot",
    tags: ["Python", "Whisper", "scikit-learn", "PyTorch"],
    when: "Aug 2024 — May 2025",
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
    when: "Aug 2024 — Dec 2024",
    role: "Graphics research",
    blurb:
      "Projects brain meshes onto the unit sphere via Gauss-map init, then minimizes Tuette energy through gradient descent on the mesh Laplacian with tangent-plane projection for a topology-preserving base map. Refines into a conformal parameterization via harmonic-energy minimization with cotangent weights, area-weighted recentering for numerical stability.",
    order: 4,
  },
];

// Placeholder body for the seed field notes. Swap these out with real writing
// as posts go live (each entry's `body` is Markdown).
const placeholderBody = [
  "This entry is a placeholder — the full write-up is on the way.",
  "",
  "## What this will cover",
  "",
  "The notes are written in Markdown, so `inline code`, lists, links, and fenced",
  "code blocks all render:",
  "",
  "```csharp",
  "// example",
  "void Update() { /* ... */ }",
  "```",
  "",
  "> Filed by hand, newest first.",
].join("\n");

// Field notes / dev blog, newest first. Only published entries ship on the
// static build.
export const POSTS: BlogPost[] = [
  {
    id: "post-decimating",
    slug: "decimating-a-million-face-mesh",
    title: "Decimating a million-face mesh without lying about it",
    category: "Graphics",
    date: "2026-03-14",
    readingTime: "8 min",
    blurb:
      "Notes on quadric edge decimation, sampled convex hulls, and what actually breaks on-headset.",
    body: placeholderBody,
    featured: true,
    published: true,
  },
  {
    id: "post-hlsl-renderer",
    slug: "a-small-renderer-in-hlsl",
    title: "A small renderer in HLSL, from scratch",
    category: "Graphics",
    date: "2026-02-20",
    readingTime: "12 min",
    blurb:
      "Lambert → Cook-Torrance → IBL. The minimum viable PBR stack that still teaches you something.",
    body: placeholderBody,
    published: true,
  },
  {
    id: "post-async-handshake",
    slug: "cloud-run-quest-async-handshake",
    title: "Cloud Run ↔ Quest 3: an async handshake that survives bad wifi",
    category: "XR Devlog",
    date: "2026-02-05",
    readingTime: "9 min",
    blurb:
      "Designing the transfer layer for the metrology app — retries, resumable uploads, and why polling won.",
    body: placeholderBody,
    published: true,
  },
  {
    id: "post-celano",
    slug: "what-im-learning-at-celano-lab",
    title: "What I'm learning at Celano Lab",
    category: "Notes",
    date: "2026-01-18",
    readingTime: "5 min",
    blurb: "Research notes from my first months as a Graduate Research Assistant.",
    body: placeholderBody,
    published: true,
  },
  {
    id: "post-halfedge",
    slug: "halfedge-data-structures-paper-and-scissors",
    title: "Halfedge data structures, explained with paper and scissors",
    category: "Graphics",
    date: "2025-12-09",
    readingTime: "10 min",
    blurb: "The mental model that finally made mesh traversal click for me.",
    body: placeholderBody,
    published: true,
  },
  {
    id: "post-kafka-vr",
    slug: "kafka-in-a-vr-training-sim",
    title: "Kafka in a VR training sim: streaming 60 FPS of team behavior",
    category: "Systems",
    date: "2025-11-22",
    readingTime: "11 min",
    blurb:
      "How the Steel Team Cognition pipeline moves multiplayer telemetry without dropping frames.",
    body: placeholderBody,
    published: true,
  },
  {
    id: "post-npc-dialogue",
    slug: "teaching-npcs-to-talk-about-1987",
    title: "Devlog: teaching NPCs to talk about the 1987 crash",
    category: "XR Devlog",
    date: "2025-10-15",
    readingTime: "7 min",
    blurb: "Procedural dialogue + a knowledge graph for the stock trading sim.",
    body: placeholderBody,
    published: true,
  },
  {
    id: "post-grad-school",
    slug: "grad-school-with-a-headset-on",
    title: "Grad school with a headset on",
    category: "Notes",
    date: "2025-09-03",
    readingTime: "4 min",
    blurb: "Balancing an M.S., research assistantship, and shipping real builds.",
    body: placeholderBody,
    published: true,
  },
];

// Projects sorted for display (by `order`, then original position).
export const sortedProjects = (): Project[] =>
  [...PROJECTS].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

// Published posts, newest first.
export const publishedPosts = (): BlogPost[] =>
  POSTS.filter((p) => p.published !== false).sort((a, b) =>
    b.date.localeCompare(a.date),
  );
