// Firebase Web SDK init (auth only). Config values are safe to expose in the
// client — they identify the project, they are not secrets. Provide them via
// Vite env vars (see .env.example). If not configured, auth is simply disabled
// and the site runs read-only (useful for local dev without a Firebase project).

import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  type Auth,
} from "firebase/auth";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(config.apiKey && config.authDomain && config.projectId);

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

if (firebaseEnabled) {
  app = initializeApp(config);
  auth = getAuth(app);
}

export const googleProvider = new GoogleAuthProvider();
export { app, auth };
