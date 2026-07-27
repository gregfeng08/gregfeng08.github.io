# Gregory Feng — Portfolio & Dev Blog

Personal portfolio + "Field notes." dev blog in an **Editorial × Brutalist** direction
(cream paper, hard hairline grid, Cormorant serif display, mono labels). Built to the
`design_handoff_portfolio_site` spec.

It is a **full-stack app**, not a static site:

- **Frontend** — React 19 + TypeScript + Vite SPA (React Router).
- **Backend** — a small Express API (`server/`) serving the built SPA plus a JSON API for
  projects and blog posts.
- **Data** — Firestore in the cloud; a local JSON file (`server/.data/db.json`) in dev, so
  the site runs with zero GCP setup while developing.
- **Auth / CMS** — sign in with Google as the admin (`ADMIN_EMAIL`) to create/edit/delete
  projects and posts directly in the browser. Firebase Auth on the client; the Express
  server independently verifies the Firebase ID token on every write (the real security
  boundary — see `server/auth.js`).

Because it needs a Node server + database + server-side auth, it **cannot run on GitHub
Pages** (static only). It is designed to deploy to **Google Cloud Run** — see
[`DEPLOY.md`](./DEPLOY.md).

## Stack

| Layer    | Tech                                                            |
| -------- | -------------------------------------------------------------- |
| UI       | React 19, TypeScript, Vite, React Router 7                     |
| Content  | react-markdown + remark-gfm (blog post bodies)                 |
| API      | Express 4, compression                                         |
| Data     | Firestore (prod) / local JSON (dev), via `server/store.js`     |
| Auth     | Firebase Auth (client) + firebase-admin token verify (server) |
| Deploy   | Docker → Cloud Build → Cloud Run                              |

## Project layout

```
src/
  pages/            Home, Blog, BlogPost
  components/
    home/           Hero, About, Now, Projects, Work, Education, Skills
    layout/         Header, Footer, SectionHead, Figure
    admin/          AdminFab, Modal, ProjectForm, PostForm  (in-browser CMS)
  lib/              api, auth (Firebase), content (data fetching), firebase
  data/resume.ts    Static résumé content (hero, work, education, skills, categories)
  styles/           editorial.css  (the design system)
  theme/tokens.ts   Design tokens mirrored from the CSS
server/
  index.js          Express app: serves dist/ + /api, SPA fallback
  store.js          Firestore | local-JSON datastore abstraction
  auth.js           Firebase ID-token verification + admin gate
  seed.js           Seed projects + placeholder blog posts
Dockerfile          Multi-stage build → slim Cloud Run runtime
cloudbuild.yaml     Build → push → deploy pipeline
```

## Local development

Requires Node ≥ 20.

```bash
npm install
cp .env.example .env.local     # fill in Firebase values, or leave blank for read-only
npm run dev                    # Vite on :5173, Express API on :8080 (proxied)
```

- **No Firebase config?** The site runs fine read-only against the local JSON store; the
  admin login button is simply hidden (`firebaseEnabled` is false).
- **Test the admin/CMS UI offline** without a Firebase project: set `DEV_OPEN_ADMIN=true`
  in `.env.local`. This bypasses auth on write endpoints — **local only, never in prod.**

### Scripts

| Command             | Does                                                        |
| ------------------- | ---------------------------------------------------------- |
| `npm run dev`       | Vite + Express together (concurrently)                     |
| `npm run dev:web`   | Vite only                                                  |
| `npm run dev:api`   | Express only (`node --watch`)                              |
| `npm run build`     | `tsc -b && vite build` → `dist/`                           |
| `npm start`         | Run the production Express server (serves `dist/`)         |
| `npm run lint`      | ESLint                                                     |

## Deployment

Deploys to **Google Cloud Run**. Full step-by-step (GCP project, Firebase, Firestore,
Cloud Build trigger, custom domain) is in **[`DEPLOY.md`](./DEPLOY.md)**.

## Content

- **Static résumé copy** lives in `src/data/resume.ts`.
- **Projects and blog posts** are managed through the in-browser CMS once deployed (or
  seeded from `server/seed.js` on first run).
- **To do before launch:** add real project screenshots (5 placeholder figure slots),
  wire up the résumé PDF, and replace the placeholder blog posts.
