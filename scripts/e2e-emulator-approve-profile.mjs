#!/usr/bin/env node
/**
 * E2E helper — approve a profile document against Firestore Emulator ONLY.
 *
 * Mirrors admin.html aprobarGratis fields (aprobado + activo + 30 días).
 * Bypasses security rules via Admin SDK (emulator only).
 *
 * Usage:
 *   $env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
 *   $env:GCLOUD_PROJECT="carihub-app"   # optional; default carihub-app
 *   node scripts/e2e-emulator-approve-profile.mjs --uid=<docId>
 *
 * Hard-fails without a local FIRESTORE_EMULATOR_HOST (never production).
 */
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const require = createRequire(import.meta.url);

function assertLocalEmulatorHost() {
  const host = process.env.FIRESTORE_EMULATOR_HOST;
  if (!host) {
    console.error(
      '[e2e-emulator-approve] ABORT: FIRESTORE_EMULATOR_HOST is required.\n' +
        '  Example: $env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"'
    );
    process.exit(1);
  }
  const normalized = String(host).toLowerCase();
  if (
    !normalized.startsWith('127.0.0.1:') &&
    !normalized.startsWith('localhost:')
  ) {
    console.error(
      `[e2e-emulator-approve] ABORT: FIRESTORE_EMULATOR_HOST="${host}" is not local.`
    );
    process.exit(1);
  }
  return host;
}

function parseUid(argv) {
  for (const arg of argv) {
    if (arg.startsWith('--uid=')) return arg.slice('--uid='.length).trim();
    if (arg === '--uid') {
      const idx = argv.indexOf(arg);
      return (argv[idx + 1] || '').trim();
    }
  }
  return '';
}

function loadAdmin() {
  try {
    return require('firebase-admin');
  } catch {
    const nested = join(ROOT, 'functions', 'node_modules', 'firebase-admin');
    if (!existsSync(nested)) {
      console.error(
        '[e2e-emulator-approve] ABORT: firebase-admin not found.\n' +
          '  Install under functions/: cd functions && npm install'
      );
      process.exit(1);
    }
    return require(nested);
  }
}

assertLocalEmulatorHost();

const uid = parseUid(process.argv.slice(2));
if (!uid) {
  console.error(
    '[e2e-emulator-approve] ABORT: --uid=<docId> is required.\n' +
      '  Example: node scripts/e2e-emulator-approve-profile.mjs --uid=abc123'
  );
  process.exit(1);
}

const projectId = process.env.GCLOUD_PROJECT || 'carihub-app';
const admin = loadAdmin();

if (!admin.apps.length) {
  admin.initializeApp({ projectId });
}

const db = admin.firestore();
const hoy = new Date();
const vencimiento = new Date();
vencimiento.setDate(hoy.getDate() + 30);

const patch = {
  aprobado: true,
  activo: true,
  vencido: false,
  primerMesGratis: true,
  perfilAdicional: false,
  pagado: false,
  autorizadoParaPago: false,
  estadoPago: 'gratis_30_dias',
  actualizacionPendiente: false,
  estadoRevision: 'aprobado',
  fechaPublicacion: hoy,
  fechaVencimiento: vencimiento
};

const ref = db.collection('usuarios').doc(uid);
const snap = await ref.get();
if (!snap.exists) {
  console.error(
    `[e2e-emulator-approve] ABORT: usuarios/${uid} does not exist in emulator.`
  );
  process.exit(1);
}

await ref.update(patch);

const after = await ref.get();
const data = after.data() || {};
console.log('[e2e-emulator-approve] OK');
console.log(
  JSON.stringify(
    {
      uid,
      projectId,
      emulator: process.env.FIRESTORE_EMULATOR_HOST,
      aprobado: data.aprobado,
      activo: data.activo,
      vencido: data.vencido,
      estadoRevision: data.estadoRevision,
      estadoPago: data.estadoPago
    },
    null,
    2
  )
);
