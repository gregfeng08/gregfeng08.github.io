// Datastore abstraction. Uses Firestore when running on Cloud Run (or when
// USE_FIRESTORE=true), otherwise a local JSON file so the site runs with zero
// GCP setup during development. Same interface either way.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SEED_PROJECTS, SEED_POSTS } from "./seed.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const USE_FIRESTORE =
  process.env.USE_FIRESTORE === "true" || Boolean(process.env.K_SERVICE);

// ---------------------------------------------------------------------------
// Firestore backend
// ---------------------------------------------------------------------------
let db = null;
async function firestore() {
  if (db) return db;
  const { getFirestore } = await import("firebase-admin/firestore");
  db = getFirestore();
  return db;
}

async function seedCollectionIfEmpty(name, docs) {
  const fdb = await firestore();
  const col = fdb.collection(name);
  const snap = await col.limit(1).get();
  if (!snap.empty) return;
  const batch = fdb.batch();
  for (const d of docs) batch.set(col.doc(d.id), d);
  await batch.commit();
}

// ---------------------------------------------------------------------------
// Local JSON backend
// ---------------------------------------------------------------------------
const DATA_DIR = path.join(__dirname, ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");

async function readLocal() {
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    const seed = { projects: SEED_PROJECTS, posts: SEED_POSTS };
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_FILE, JSON.stringify(seed, null, 2));
    return seed;
  }
}

async function writeLocal(data) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

// ---------------------------------------------------------------------------
// Public API — collections: "projects" | "posts"
// ---------------------------------------------------------------------------
export async function initStore() {
  if (USE_FIRESTORE) {
    await seedCollectionIfEmpty("projects", SEED_PROJECTS);
    await seedCollectionIfEmpty("posts", SEED_POSTS);
    console.log("[store] using Firestore");
  } else {
    await readLocal(); // ensures the seed file exists
    console.log(`[store] using local JSON at ${DB_FILE}`);
  }
}

export async function listAll(collection) {
  if (USE_FIRESTORE) {
    const fdb = await firestore();
    const snap = await fdb.collection(collection).get();
    return snap.docs.map((d) => d.data());
  }
  const data = await readLocal();
  return data[collection] ?? [];
}

export async function getById(collection, id) {
  if (USE_FIRESTORE) {
    const fdb = await firestore();
    const doc = await fdb.collection(collection).doc(id).get();
    return doc.exists ? doc.data() : null;
  }
  const data = await readLocal();
  return (data[collection] ?? []).find((x) => x.id === id) ?? null;
}

export async function upsert(collection, item) {
  if (USE_FIRESTORE) {
    const fdb = await firestore();
    await fdb.collection(collection).doc(item.id).set(item, { merge: true });
    return item;
  }
  const data = await readLocal();
  const arr = data[collection] ?? [];
  const idx = arr.findIndex((x) => x.id === item.id);
  if (idx >= 0) arr[idx] = { ...arr[idx], ...item };
  else arr.push(item);
  data[collection] = arr;
  await writeLocal(data);
  return item;
}

export async function remove(collection, id) {
  if (USE_FIRESTORE) {
    const fdb = await firestore();
    await fdb.collection(collection).doc(id).delete();
    return;
  }
  const data = await readLocal();
  data[collection] = (data[collection] ?? []).filter((x) => x.id !== id);
  await writeLocal(data);
}
