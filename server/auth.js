// Server-side admin gate. Verifies the Firebase ID token sent by the client and
// checks the email against ADMIN_EMAIL. This is the real security boundary —
// the client's "isAdmin" only controls UI.

import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "gregfeng08@gmail.com").toLowerCase();
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
// Escape hatch for local dev without a Firebase project. NEVER set in prod.
const DEV_OPEN_ADMIN = process.env.DEV_OPEN_ADMIN === "true";

let authAvailable = false;

export function initAdmin() {
  if (DEV_OPEN_ADMIN) {
    console.warn("[auth] DEV_OPEN_ADMIN=true — write endpoints are UNPROTECTED (dev only)");
    return;
  }
  if (getApps().length) {
    authAvailable = true;
    return;
  }
  try {
    // On Cloud Run this uses the service account via ADC. Locally it needs
    // `gcloud auth application-default login` or GOOGLE_APPLICATION_CREDENTIALS.
    initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
    authAvailable = true;
    console.log("[auth] firebase-admin initialized");
  } catch (err) {
    console.warn("[auth] firebase-admin not initialized — writes will be rejected:", err.message);
  }
}

function bearer(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
}

// Returns { ok, email } | { ok:false, status, error }. Never throws.
export async function verifyAdmin(req) {
  if (DEV_OPEN_ADMIN) return { ok: true, email: ADMIN_EMAIL };
  if (!authAvailable) return { ok: false, status: 503, error: "Auth not configured on server" };
  const token = bearer(req);
  if (!token) return { ok: false, status: 401, error: "Missing auth token" };
  try {
    const decoded = await getAuth().verifyIdToken(token);
    const email = (decoded.email || "").toLowerCase();
    if (!decoded.email_verified || email !== ADMIN_EMAIL) {
      return { ok: false, status: 403, error: "Not authorized" };
    }
    return { ok: true, email };
  } catch {
    return { ok: false, status: 401, error: "Invalid or expired token" };
  }
}

// Strict middleware — rejects non-admins.
export async function requireAdmin(req, res, next) {
  const result = await verifyAdmin(req);
  if (!result.ok) return res.status(result.status).json({ error: result.error });
  req.admin = { email: result.email };
  next();
}

// Lenient middleware — sets req.isAdmin but never rejects (used on reads so the
// admin can also receive unpublished drafts).
export async function optionalAdmin(req, _res, next) {
  const result = await verifyAdmin(req);
  req.isAdmin = result.ok;
  next();
}
