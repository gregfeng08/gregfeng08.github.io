// Auto-discovered project media.
//
// Drop image/video files into:   src/assets/projects/<project-id>/
// and they embed automatically. No code changes needed — just add files and
// rebuild. Notes:
//   • Order = filename order, so prefix with 01-, 02-, 03- to arrange them.
//   • Videos: .mp4 / .webm / .mov / .m4v. Everything else is treated as image.
//   • <project-id> is the project's `id` in content.ts (e.g. "mxr-metrology").
//
// Vite reads the folder at build time via import.meta.glob and turns each file
// into a hashed URL in the final bundle.

import type { MediaItem } from "../types";

const files = import.meta.glob(
  "../assets/projects/**/*.{png,PNG,jpg,JPG,jpeg,JPEG,gif,GIF,webp,avif,svg,mp4,MP4,webm,mov,MOV,m4v}",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

const VIDEO_RE = /\.(mp4|webm|mov|m4v)$/i;

const byProject: Record<string, MediaItem[]> = {};
for (const path of Object.keys(files).sort()) {
  const match = path.match(/\/projects\/([^/]+)\//);
  if (!match) continue;
  const id = match[1];
  (byProject[id] ??= []).push({
    type: VIDEO_RE.test(path) ? "video" : "image",
    src: files[path],
  });
}

// Media for a project: an explicit `media` array in content.ts wins; otherwise
// whatever was dropped in that project's folder.
export function projectMedia(id: string, override?: MediaItem[]): MediaItem[] {
  if (override && override.length) return override;
  return byProject[id] ?? [];
}
