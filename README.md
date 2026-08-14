# Gregory Feng — Portfolio & Dev Blog

Personal portfolio + "Field notes." dev blog in an **Editorial × Brutalist** direction
(cream paper, hard hairline grid, Cormorant serif display, mono labels). Built to the
`design_handoff_portfolio_site` spec.

It is a **static site**: a React 19 + TypeScript + Vite SPA with no backend. Projects and
blog posts are compiled straight into the bundle from `src/data/content.ts`, so it deploys
as plain files to **GitHub Pages** at [gregfeng08.github.io](https://gregfeng08.github.io/).

## Stack

| Layer   | Tech                                              |
| ------- | ------------------------------------------------- |
| UI      | React 19, TypeScript, Vite, React Router 7        |
| Content | react-markdown + remark-gfm (blog post bodies)    |
| Data    | Static TS modules (`src/data/`)                   |
| Deploy  | GitHub Pages (built output committed to `docs/`)  |

## Project layout

```
src/
  pages/            Home, Blog, BlogPost
  components/
    home/           Hero, About, Now, Projects, Work, Education, Skills
    layout/         Header, Footer, SectionHead, Figure
  data/
    resume.ts       Static résumé content (hero, work, education, skills, categories)
    content.ts      Projects + blog posts (edit here, then rebuild)
  styles/           editorial.css  (the design system)
  theme/tokens.ts   Design tokens mirrored from the CSS
docs/               Built static site served by GitHub Pages (committed)
```

## Local development

Requires Node ≥ 20.

```bash
npm install
npm run dev        # Vite dev server on :5173
```

### Scripts

| Command          | Does                                             |
| ---------------- | ------------------------------------------------ |
| `npm run dev`    | Vite dev server                                  |
| `npm run build`  | `tsc -b && vite build` → `docs/`                 |
| `npm run preview`| Preview the production build locally             |
| `npm run lint`   | ESLint                                           |

## Deployment

GitHub Pages serves this user site from **`main` branch, `/docs` folder**
(Settings → Pages). `npm run build` emits the site into `docs/`, including a `404.html`
copy of `index.html` so client-side deep links (e.g. `/blog/<slug>`) resolve, and a
`.nojekyll` marker. Commit the rebuilt `docs/` and push `main` to publish.

## Content

- **Static résumé copy** lives in `src/data/resume.ts`.
- **Projects and blog posts** live in `src/data/content.ts` — edit that file and rebuild.
- **To do before launch:** add real project screenshots (5 placeholder figure slots),
  wire up the résumé PDF, and replace the placeholder blog posts.
