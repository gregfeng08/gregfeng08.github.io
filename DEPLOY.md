# Deploying to Google Cloud Run

This app is a Node/Express server + Firestore + Firebase Auth, so it runs on **Cloud Run**,
not GitHub Pages. This guide takes you from nothing to a live `*.run.app` URL, then
(optionally) a custom domain.

> **GitHub Pages vs. Cloud Run:** these are separate, mutually exclusive origins. Pages
> serves static files only and cannot run this backend. You cannot "link" Pages to Cloud
> Run — pick one. A custom domain can point at either via DNS. The repo being named
> `gregfeng08.github.io` does not force you to use Pages; it's just a repo.

---

## What you'll set up

1. A **Google Cloud project** (billing enabled).
2. **Firebase** on that project — Google sign-in (admin login) + a **Firestore** database
   (projects & blog posts).
3. A first **deploy** (manual), then an automated **Cloud Build trigger** on git push.

You need the [gcloud CLI](https://cloud.google.com/sdk/docs/install) installed and to have
run `gcloud auth login`. (In this Claude Code session you can run an interactive login by
typing `! gcloud auth login` at the prompt.)

---

## 1. Create the GCP project + enable APIs

```bash
# Pick a globally-unique project id.
gcloud projects create gregfeng-portfolio --name="Portfolio"
gcloud config set project gregfeng-portfolio

# Link billing (find your account id with: gcloud billing accounts list)
gcloud billing projects link gregfeng-portfolio --billing-account=XXXXXX-XXXXXX-XXXXXX

# Enable the APIs this app uses.
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  firestore.googleapis.com \
  firebase.googleapis.com \
  identitytoolkit.googleapis.com
```

Cloud Run scales to zero, so at portfolio traffic your bill is effectively **$0** (within
the free tier).

## 2. Create the Artifact Registry repo

The image is pushed to a repo named `web` (matches `_REPO` in `cloudbuild.yaml`):

```bash
gcloud artifacts repositories create web \
  --repository-format=docker \
  --location=us-west1 \
  --description="Portfolio container images"
```

> `us-west1` matches `_REGION` in `cloudbuild.yaml`. If you change the region, change it in
> both places (and step 6).

## 3. Set up Firebase (auth + Firestore)

1. Go to the [Firebase console](https://console.firebase.google.com/) → **Add project** →
   choose the **existing** GCP project `gregfeng-portfolio`.
2. **Authentication** → Get started → **Sign-in method** → enable **Google**.
3. **Authentication → Settings → Authorized domains** → add your Cloud Run domain once you
   have it (e.g. `portfolio-xxxxx-uw.a.run.app`) and any custom domain. `localhost` is
   already allowed for dev.
4. **Firestore Database** → Create database → **Production mode** → region (e.g.
   `us-west1`). Collections `projects` and `posts` are seeded automatically on first run
   (see `server/store.js` / `server/seed.js`).
5. **Register a Web app**: Project settings (gear) → *Your apps* → **Web** (`</>`). Copy
   the config — you need `apiKey`, `authDomain`, `projectId`, `appId`.

### Firestore security rules

The **Express server** is the only writer (via a service account); the browser never talks
to Firestore directly. So lock client access down completely — in Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} { allow read, write: if false; }
  }
}
```

## 4. Grant the Cloud Run service account Firestore access

Cloud Run uses the project's default compute service account with Application Default
Credentials. Give it Firestore access:

```bash
PROJECT_ID=gregfeng-portfolio
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/datastore.user"
```

(Verifying Firebase ID tokens needs no extra IAM — only `FIREBASE_PROJECT_ID`, which the
deploy sets.)

## 5. First deploy (manual, from source)

The fastest way to get live. Fill in the four Firebase web values (safe to expose — they
identify the project, they aren't secrets) so they get baked into the client bundle:

```bash
gcloud run deploy portfolio \
  --source . \
  --region us-west1 \
  --allow-unauthenticated \
  --set-env-vars "ADMIN_EMAIL=gregfeng08@gmail.com,FIREBASE_PROJECT_ID=gregfeng-portfolio,USE_FIRESTORE=true" \
  --set-build-env-vars "VITE_FIREBASE_API_KEY=...,VITE_FIREBASE_AUTH_DOMAIN=gregfeng-portfolio.firebaseapp.com,VITE_FIREBASE_PROJECT_ID=gregfeng-portfolio,VITE_FIREBASE_APP_ID=...,VITE_ADMIN_EMAIL=gregfeng08@gmail.com"
```

When it finishes it prints a **Service URL** (`https://portfolio-….run.app`). Open it.
Then go back to **Firebase → Auth → Authorized domains** and add that hostname so Google
sign-in works.

Verify:

- Site loads, Home + Blog render.
- Visit `/api/health` → `{"ok":true}`.
- Click the admin login, sign in as `gregfeng08@gmail.com`, confirm the edit affordances
  appear and you can create/edit a project or post.

> **Note on env vars:** `VITE_*` values are needed at **build** time (they're compiled into
> the JS bundle), which is why they go in `--set-build-env-vars`. `ADMIN_EMAIL`,
> `FIREBASE_PROJECT_ID`, `USE_FIRESTORE` are needed at **runtime** and go in
> `--set-env-vars`.

## 6. Automate: Cloud Build trigger on push (optional but recommended)

Once the manual deploy works, wire up `cloudbuild.yaml` so every push to the default branch
redeploys.

1. Connect the repo: Cloud Build → **Triggers** → **Connect repository** → GitHub →
   authorize → pick `gregfeng08/gregfeng08.github.io`.
2. **Create trigger**:
   - Event: **Push to a branch**, branch `^main$`.
   - Configuration: **Cloud Build configuration file** → `cloudbuild.yaml`.
   - **Substitution variables** — set the public Firebase values (these feed the build
     args; see the `substitutions:` block in `cloudbuild.yaml`):
     - `_VITE_FIREBASE_API_KEY`
     - `_VITE_FIREBASE_AUTH_DOMAIN` = `gregfeng-portfolio.firebaseapp.com`
     - `_VITE_FIREBASE_PROJECT_ID` = `gregfeng-portfolio`
     - `_VITE_FIREBASE_APP_ID`
     - (`_ADMIN_EMAIL`, `_REGION`, `_REPO`, `_SERVICE` already have defaults.)
3. Grant the **Cloud Build service account** permission to deploy to Cloud Run and act as
   the runtime service account:

   ```bash
   PROJECT_ID=gregfeng-portfolio
   PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
   for ROLE in roles/run.admin roles/iam.serviceAccountUser roles/artifactregistry.writer; do
     gcloud projects add-iam-policy-binding $PROJECT_ID \
       --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
       --role="$ROLE"
   done
   ```

4. Push to `main` → watch the build in Cloud Build → History. It builds the image, pushes
   to Artifact Registry, and deploys.

## 7. Custom domain (optional)

Cloud Run → your service → **Custom domains** → add mapping (e.g. `gregfeng.com`), then add
the DNS records it gives you at your registrar. Add the custom domain to **Firebase → Auth
→ Authorized domains** too.

---

## Troubleshooting

| Symptom                                   | Fix                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------ |
| Login popup: "unauthorized domain"        | Add the run.app / custom domain in Firebase Auth → Authorized domains |
| Writes fail with **503**                  | Server didn't init firebase-admin — check `FIREBASE_PROJECT_ID` env |
| Writes fail with **403**                  | Signed-in email ≠ `ADMIN_EMAIL`                                     |
| Writes fail with **500**, Firestore errors | Runtime service account missing `roles/datastore.user` (step 4)    |
| Admin button never appears                | `VITE_FIREBASE_*` weren't set at **build** time (step 5)           |
| Build trigger deploy fails on `run deploy` | Cloud Build SA missing `run.admin` / `iam.serviceAccountUser` (step 6) |

## What's left before a real launch

- Real project screenshots (5 placeholder figure slots on Home).
- Résumé PDF wired to the footer download CTA.
- Replace the placeholder seed blog posts with real entries.
