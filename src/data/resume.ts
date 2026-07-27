// Static résumé-derived content (final copy from Gregory Feng's résumé).
// Projects and blog posts are NOT here — they are dynamic and served by the
// backend (Firestore), so they can be edited live from the admin UI.
// Everything in this file is edited by changing code + redeploying.

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
  ["STATUS", "Open to new-grad roles", "XR · graphics · systems"],
  ["CURRENTLY", "Celano Lab — GRA", "Cloud Run ↔ Quest 3"],
  ["GRADUATING", "May 2026", "B.S. 3.93 · M.S. 4.00 · ASU Barrett"],
  ["REACH", "gregfeng08@gmail.com", "github.com/gregfeng08"],
];

// Personal "About" copy — carries the warmer first-person voice from the
// original site, restyled into the editorial system.
export const ABOUT = {
  lead: "Hi — I'm Greg. I build mixed-reality systems for headsets that have to actually work.",
  paragraphs: [
    "I'm an accelerated B.S. + M.S. Computer Science student at Arizona State University (Barrett Honors), doing my thesis year in XR, graphics, and systems. My work lives at the seam between the headset and everything behind it — the meshes, the shaders, and the cloud plumbing that keeps a Quest 3 honest.",
    "I'm graduating in May 2026 and looking for new-grad roles in XR / graphics / systems. If you're building something in that space, I'd love to talk. Nice to meet you.",
  ],
};

export const NOW: string[] = [
  "Wiring a Cloud Run dashboard ↔ Quest 3 pipeline for the Celano Lab semiconductor metrology project.",
  "Decimating 500k–1M face meshes to run smoothly on-headset without losing annotation fidelity.",
  "Reading Lengyel on mesh skinning + finishing a small HLSL toy renderer on the side.",
];

export const WORK: WorkEntry[] = [
  {
    company: "Celano Lab",
    role: "Graduate Research Assistant",
    when: "Nov 2025 — Present",
    where: "Tempe, AZ",
    bullets: [
      "Architected the end-to-end Cloud Run ↔ Meta Quest 3 system for an MR semiconductor-metrology training app, enabling secure asynchronous data and 3D-model transfer between web and headset.",
    ],
  },
  {
    company: "Meteor Studio",
    role: "Extended Reality Developer",
    when: "May 2024 — Dec 2025",
    where: "Tempe, AZ",
    bullets: [
      "Led development of a real-time performance analytics pipeline for a VR medic training simulation on Meta Quest — capturing team-behavior data at 60 FPS across multiple concurrent trainees in Unity / C#.",
      "Built interaction systems for a pre-veterinary training experience targeting modern processes for evaluating pets in VR.",
    ],
  },
];

export const EDUCATION: Education = {
  school: "Arizona State University",
  program: "Barrett, The Honors College",
  when: "Expected May 2026",
  degrees: [
    { name: "B.S. Computer Science", gpa: "3.93" },
    { name: "M.S. Computer Science · Media Arts & Engineering", gpa: "4.00" },
  ],
  awards: [
    "Best in Track — ReMIX the Future Hackathon",
    "Community Award — ReMIX the Future Hackathon",
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
    items: ["C#", "C++", "Java", "Python", "SQL", "JavaScript", "HTML"],
  },
  {
    group: "Tools",
    items: ["Git", "PowerBI", "PowerApps", "VS Code", "Claude Code"],
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

export const BLOG_CATEGORIES = ["All", "Graphics", "XR Devlog", "Systems", "Notes"] as const;
