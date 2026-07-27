// Design tokens for the "Editorial × Brutalist" direction.
// Cream paper + hard black hairline grid + Cormorant serif display + mono labels.
// No gradients, no glow, no rounded corners, no shadows.
// These mirror the CSS custom properties declared in src/styles/editorial.css —
// keep the two in sync. Exported here for the rare inline-style case.

export const tokens = {
  // Layout
  contentWidth: 1280,

  // Colors
  paper: "#f7f4ed", // page background
  ink: "#111008", // text, hard rules, inverted blocks
  mute: "#5a5248", // secondary text
  ruleSoft: "#d9d2c4", // hairline internal borders
  accent: "oklch(0.5 0.12 45)", // ~#8c4f2b terracotta
  accentDark: "oklch(0.8 0.1 50)", // ~#dfa476 accent-on-dark (footer)
  figBg: "#efe9dd", // figure placeholder background
  hover: "#efe9dd", // hover-tinted cream

  // Type families
  serif: '"Cormorant Garamond", Georgia, serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
  sans: '"IBM Plex Sans", system-ui, sans-serif',
} as const;

export type Tokens = typeof tokens;
