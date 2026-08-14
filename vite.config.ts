import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

// This is a purely static site. `npm run build` emits to docs/, which GitHub
// Pages serves for gregfeng08.github.io (Settings → Pages → Branch: main /docs).
// Because it's a client-routed SPA, GitHub Pages needs a 404.html fallback so
// deep links like /blog/<slug> still boot the app instead of 404ing — we just
// ship a copy of index.html under that name.
function spaFallback(outDir: string): Plugin {
  return {
    name: "spa-404-fallback",
    apply: "build",
    closeBundle() {
      const out = resolve(__dirname, outDir);
      copyFileSync(resolve(out, "index.html"), resolve(out, "404.html"));
    },
  };
}

const OUT_DIR = "docs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), spaFallback(OUT_DIR)],
  // User site is served at the domain root, so base is "/".
  base: "/",
  build: { outDir: OUT_DIR, emptyOutDir: true },
  server: { port: 5173 },
});
