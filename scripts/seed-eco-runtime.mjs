#!/usr/bin/env node
/**
 * Seed runtime ECO (emulador únicamente) — B3 Fase 0.
 * Uso: FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node scripts/seed-eco-runtime.mjs
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const require = createRequire(import.meta.url);

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  console.error('[seed-eco-runtime] Requiere FIRESTORE_EMULATOR_HOST. No ejecutar contra producción.');
  process.exit(1);
}

const admin = require('firebase-admin');
if (!admin.apps.length) {
  admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT || 'carihub-seed-local' });
}

const db = admin.firestore();

const entitlementsSeed = JSON.parse(
  readFileSync(join(ROOT, 'scripts/seed-config-plan-entitlements.json'), 'utf8')
);
const preciosFixture = JSON.parse(
  readFileSync(join(ROOT, 'functions/payments/fixtures/config-precios-fixture.json'), 'utf8')
);
const publicidadSeed = JSON.parse(
  readFileSync(join(ROOT, 'scripts/seed-configuracion-publicidad.json'), 'utf8')
);

async function seed() {
  await db.collection('config_plan_entitlements').doc('global').set({
    version: entitlementsSeed.version,
    planes: entitlementsSeed.planes,
    actualizadoEn: admin.firestore.FieldValue.serverTimestamp(),
    origen: 'seed-eco-runtime',
  }, { merge: true });

  await db.collection('config_precios_perfiles').doc('global').set({
    version: preciosFixture.version || 'fixture-eco015',
    moneda: preciosFixture.moneda || 'MXN',
    planes: preciosFixture.planes,
    actualizadoEn: admin.firestore.FieldValue.serverTimestamp(),
    origen: 'seed-eco-runtime',
  }, { merge: true });

  await db.collection('configuracion_publicidad').doc('precios_banners').set({
    ivaIncluido: publicidadSeed.ivaIncluido,
    moneda: publicidadSeed.moneda,
    slots: publicidadSeed.slots,
    actualizadoEn: admin.firestore.FieldValue.serverTimestamp(),
    origen: 'seed-eco-runtime',
  }, { merge: true });

  console.log('[seed-eco-runtime] OK — config_plan_entitlements/global, config_precios_perfiles/global, configuracion_publicidad/precios_banners');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
