#!/usr/bin/env node
/**
 * Seed a usuarios/{uid} doc + approve via e2e-emulator-approve-profile.mjs
 * against Firestore Emulator only (invoked under emulators:exec).
 */
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const require = createRequire(import.meta.url);

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  console.error('[approve-roundtrip] ABORT: FIRESTORE_EMULATOR_HOST required');
  process.exit(1);
}

let admin;
try {
  admin = require('firebase-admin');
} catch {
  admin = require(join(ROOT, 'functions', 'node_modules', 'firebase-admin'));
}

const projectId = process.env.GCLOUD_PROJECT || 'carihub-app';
if (!admin.apps.length) admin.initializeApp({ projectId });

const uid = `e2e_approve_${Date.now()}`;
const db = admin.firestore();
await db.collection('usuarios').doc(uid).set({
  uid,
  email: 'e2e.approve@example.com',
  nombre: 'E2E Approve',
  aprobado: false,
  activo: false,
  vencido: false,
  estadoRevision: 'registro_pendiente',
  estadoPago: 'pendiente_aprobacion',
  actualizacionPendiente: false,
  origen: 'e2e-emulator-approve-roundtrip'
});

const approveScript = join(ROOT, 'scripts', 'e2e-emulator-approve-profile.mjs');
if (!existsSync(approveScript)) {
  console.error('[approve-roundtrip] ABORT: approve script missing');
  process.exit(1);
}

const result = spawnSync(process.execPath, [approveScript, `--uid=${uid}`], {
  env: process.env,
  encoding: 'utf8'
});
process.stdout.write(result.stdout || '');
process.stderr.write(result.stderr || '');
if (result.status !== 0) {
  process.exit(result.status || 1);
}

const after = await db.collection('usuarios').doc(uid).get();
const data = after.data() || {};
if (data.aprobado !== true || data.activo !== true || data.vencido === true) {
  console.error('[approve-roundtrip] ABORT: flags not set as expected', data);
  process.exit(1);
}

await db.collection('usuarios').doc(uid).delete();
console.log(JSON.stringify({ ok: true, uid, aprobado: data.aprobado, activo: data.activo }, null, 2));
