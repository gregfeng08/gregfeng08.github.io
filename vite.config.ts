import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Frontend build. Output goes to dist/ and is served by the Express server
// (server/index.js) in production on Cloud Run. In dev, Vite runs on 5173 and
// proxies /api to the Express server on 8080.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: { outDir: "dist" },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
