#!/usr/bin/env node
/**
 * Minimal Emulator Suite smoke for E2E prep.
 * Invoked via: firebase emulators:exec --only auth,firestore,storage "node scripts/e2e-emulator-smoke.mjs"
 */
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const require = createRequire(import.meta.url);

function assertLocal(name, value) {
  if (!value) {
    console.error(`[e2e-emulator-smoke] ABORT: ${name} missing`);
    process.exit(1);
  }
  const v = String(value).toLowerCase();
  if (!v.includes('127.0.0.1') && !v.includes('localhost')) {
    console.error(`[e2e-emulator-smoke] ABORT: ${name}="${value}" is not local`);
    process.exit(1);
  }
}

assertLocal('FIRESTORE_EMULATOR_HOST', process.env.FIRESTORE_EMULATOR_HOST);
if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
  assertLocal('FIREBASE_AUTH_EMULATOR_HOST', process.env.FIREBASE_AUTH_EMULATOR_HOST);
}
// Storage host is injected as FIREBASE_STORAGE_EMULATOR_HOST on recent CLI versions.
if (process.env.FIREBASE_STORAGE_EMULATOR_HOST) {
  assertLocal('FIREBASE_STORAGE_EMULATOR_HOST', process.env.FIREBASE_STORAGE_EMULATOR_HOST);
}

let admin;
try {
  admin = require('firebase-admin');
} catch {
  const nested = join(ROOT, 'functions', 'node_modules', 'firebase-admin');
  if (!existsSync(nested)) {
    console.error('[e2e-emulator-smoke] ABORT: firebase-admin missing');
    process.exit(1);
  }
  admin = require(nested);
}

const projectId = process.env.GCLOUD_PROJECT || 'carihub-app';
if (!admin.apps.length) {
  admin.initializeApp({ projectId });
}

const db = admin.firestore();
const smokeId = `e2e_smoke_${Date.now()}`;
const ref = db.collection('_e2e_smoke').doc(smokeId);
await ref.set({ ok: true, at: new Date().toISOString(), origen: 'e2e-emulator-smoke' });
const snap = await ref.get();
if (!snap.exists || snap.data()?.ok !== true) {
  console.error('[e2e-emulator-smoke] ABORT: write/read failed');
  process.exit(1);
}
await ref.delete();

console.log(
  JSON.stringify(
    {
      ok: true,
      projectId,
      firestore: process.env.FIRESTORE_EMULATOR_HOST,
      auth: process.env.FIREBASE_AUTH_EMULATOR_HOST,
      storage: process.env.FIREBASE_STORAGE_EMULATOR_HOST || null
    },
    null,
    2
  )
);
