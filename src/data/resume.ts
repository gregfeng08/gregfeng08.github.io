// Static résumé-derived content (final copy from Gregory Feng's résumé).
// Projects and the blog feed live in src/data/content.ts. Everything here is
// edited by changing code + rebuilding.

import type { Person, WorkEntry, Education, SkillGroup } from "../types";

export const PERSON: Person = {
  name: "Gregory Feng",
  handle: "gregfeng08",
  email: "gregfeng08@gmail.com",
  phone: "503-889-6283",
  linkedin: "in/gregory-feng",
  github: "github.com/gregfeng08",
  location: "Tempe, Arizona",
};

// Hero right-column info cells: [label, value, subline]
export const HERO_INFO: [string, string, string][] = [
  ["STATUS", "Open to opportunities", "XR · graphics · systems"],
  ["CURRENTLY", "Building XR at SemiXR", "Co-founder · immersive editor"],
  ["EDUCATION", "B.S. + M.S. Computer Science", "ASU Barrett · 3.93 / 3.97"],
  ["REACH", "gregfeng08@gmail.com", "github.com/gregfeng08"],
];

// Personal "About" copy — warm, first-person. The lead line lives in About.tsx
// (it carries inline markup); these are the body paragraphs.
export const ABOUT = {
  paragraphs: [
    "I studied Computer Science at Arizona State University (Barrett Honors) as an accelerated 4+1 B.S./M.S. student, with a thesis year in XR, graphics, and systems. My work lives at the seam between the headset and everything behind it: the meshes, the shaders, and the cloud plumbing that keeps a Quest 3 honest.",
    "Outside of work I'm usually building something of my own: a toy renderer, a shader I saw once and had to understand, some XR idea that wouldn't leave me alone. That's the part I like most, and a lot of it ends up on the blog.",
    "I finished at ASU in May 2026 and I'm building XR at SemiXR now. I'm also actively open to roles in XR / graphics / systems. If you're building something in that space, I'd love to talk. Nice to meet you.",
  ],
};

export const WORK: WorkEntry[] = [
  {
    company: "SemiXR",
    role: "Technical Co-founder",
    when: "Jun 2026 – Present",
    where: "Tempe, AZ",
    bullets: [
      "Represented SemiXR at the LEAP East conference in Hong Kong, hardening the Quest 3 build for live floor use and demoing the training platform to prospective semiconductor clients.",
      "Designing a website-embedded immersive XR editor: object-hierarchy tracking, an inspector panel for per-object properties, and a simplified UI for first-time users.",
      "QA-testing and bugfixing existing Unity simulation environments across XR interactions and display.",
    ],
  },
  {
    company: "Celano Lab",
    role: "Graduate Research Assistant",
    when: "Nov 2025 – Jun 2026",
    where: "Tempe, AZ",
    bullets: [
      "Built the full cloud-to-Quest pipeline: secure transfer between a Cloud Run TypeScript dashboard and a Unity mixed-reality training experience on Meta Quest 3 / 3s.",
      "Developed Unity 6 UI for visualizing and manipulating ~500k–1M face 3D models, using mesh preprocessing, quadric edge decimation, and sampled convex mesh generation to stay interactive on-headset.",
      "Created an annotation tool to import, label, and describe 3D models, exporting them in a localized, parseable state for downstream processing.",
    ],
  },
  {
    company: "Meteor Studio",
    role: "Extended Reality Developer",
    when: "May 2024 – Dec 2025",
    where: "Tempe, AZ",
    bullets: [
      "Led a real-time performance analytics pipeline for a VR medic-training simulation on Meta Quest, capturing team-behavior data at 60 FPS across concurrent trainees in Unity / C#.",
      "Created the Team Performance Architecture, a 5-layer framework capturing movement, view-frustum visual activity, and team-coordination metrics.",
      "Engineered multiprocessed data-collection pipelines streaming through Kafka into MongoDB for downstream team-performance analysis.",
      "Built interaction systems for a pre-veterinary VR training experience focused on interactivity and retention.",
    ],
  },
];

export const EDUCATION: Education = {
  school: "Arizona State University",
  program: "Barrett, The Honors College",
  when: "May 2026",
  degrees: [
    { name: "M.S. Computer Science · Media Arts & Engineering", gpa: "3.97" },
    { name: "B.S. Computer Science", gpa: "3.93" },
  ],
  awards: [
    "Best in Track, ReMIX the Future Hackathon",
    "Community Award, ReMIX the Future Hackathon",
    "New American Scholar",
    "Summa Cum Laude",
  ],
};

export const SKILLS: SkillGroup[] = [
  {
    group: "XR / Graphics",
    items: ["Unity 6", "Meta All-In-One SDK", "Halfedge Data Structures", "HLSL", "GLSL"],
  },
  {
    group: "Backend & Data",
    items: ["Google Cloud Run", "SQLite", ".NET", "Flask"],
  },
  {
    group: "Languages",
    items: ["C#", "C++", "Java", "Python", "SQL", "JavaScript"],
  },
];

// Contact rows for the footer. `href` optional; last row is the résumé CTA.
export const CONTACT: { k: string; v: string; href?: string; cta?: boolean }[] = [
  { k: "MAIL", v: PERSON.email, href: `mailto:${PERSON.email}` },
  { k: "GITHUB", v: PERSON.github, href: `https://${PERSON.github}` },
  { k: "LINKEDIN", v: PERSON.linkedin, href: `https://linkedin.com/${PERSON.linkedin}` },
  { k: "PHONE", v: PERSON.phone, href: `tel:${PERSON.phone.replace(/[^0-9+]/g, "")}` },
  { k: "RÉSUMÉ", v: "GREG_FENG_2026.PDF ↓", href: "/resume.pdf", cta: true },
];
