#!/usr/bin/env node
/**
 * BLK-01 — CARGADOR DE SEED (solo EMULADOR)
 * Parte de PLAN-CONSTRUCCION-BLK-01-MIGRACION-PERFILID v1.0.0
 *
 * Propósito: cargar scripts/blk01-seed-emulador.json EXCLUSIVAMENTE en el
 * Firestore Emulator, para luego validar blk01-inventario.mjs y
 * blk01-dryrun-migracion.mjs. Convierte los marcadores {"$timestamp": ISO}
 * del seed a Firestore Timestamp y genera un reporte local de carga.
 *
 * ┌────────────────────────────────────────────────────────────────────────┐
 * │  SALVAGUARDAS ANTI-PRODUCCIÓN (todas deben cumplirse para escribir):     │
 * │   1. FIRESTORE_EMULATOR_HOST DEBE estar definido (si no → ABORTA).       │
 * │   2. El host debe ser local (127.0.0.1 / localhost) (si no → ABORTA).    │
 * │   3. GCLOUD_PROJECT DEBE ser exactamente "demo-carihub" (si no → ABORTA).│
 * │   4. El projectId "carihub-app" se rechaza explícitamente.               │
 * │   5. Modo por defecto = DRY-RUN. Para escribir se exige el flag --commit.│
 * │   6. NO usa applicationDefault() ni credenciales reales.                 │
 * └────────────────────────────────────────────────────────────────────────┘
 *
 * Uso (cuando el PO autorice y con el emulador ya corriendo):
 *   # 1) Validación + simulación, SIN escribir (por defecto):
 *   $env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
 *   $env:GCLOUD_PROJECT="demo-carihub"
 *   node scripts/blk01-seed-loader.mjs            # dry-run
 *
 *   # 2) Carga real al EMULADOR (requiere flag explícito):
 *   node scripts/blk01-seed-loader.mjs --commit
 *
 * Requiere: firebase-admin (ya instalado en la raíz).
 *
 * NOTA: Artefacto de apoyo. NO ejecutar contra producción. La ejecución real
 * requiere autorización runtime del PO y el emulador ya iniciado.
 */

import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SEED_PATH = join(__dirname, 'blk01-seed-emulador.json');
const REPORT_PATH = join(__dirname, '_blk01-seed-load-report.json');
const PROJECT_REQUERIDO = 'demo-carihub';
const PROJECT_PROHIBIDO = 'carihub-app';

const COMMIT = process.argv.includes('--commit');
const MODO = COMMIT ? 'COMMIT' : 'DRY_RUN';

// ── Salvaguardas anti-producción ──────────────────────────────────────────
function assertEmuladorYProyecto() {
  const host = process.env.FIRESTORE_EMULATOR_HOST;
  const project = process.env.GCLOUD_PROJECT;
  const errores = [];

  if (!host) {
    errores.push('FIRESTORE_EMULATOR_HOST no está definido. Este cargador es SOLO para el emulador.');
  } else if (!/^(127\.0\.0\.1|localhost|\[::1\]):\d+$/i.test(host)) {
    errores.push(`FIRESTORE_EMULATOR_HOST="${host}" no es local. Debe apuntar a 127.0.0.1/localhost.`);
  }

  if (project !== PROJECT_REQUERIDO) {
    errores.push(`GCLOUD_PROJECT debe ser exactamente "${PROJECT_REQUERIDO}" (actual: "${project ?? '(sin definir)'}").`);
  }
  if (project === PROJECT_PROHIBIDO) {
    errores.push(`GCLOUD_PROJECT="${PROJECT_PROHIBIDO}" está PROHIBIDO. Nunca cargar contra el proyecto real.`);
  }

  if (errores.length > 0) {
    console.error('\n[ABORTADO] Salvaguardas anti-producción no satisfechas:');
    for (const e of errores) console.error('  - ' + e);
    console.error(
      '\nDefine el entorno seguro antes de ejecutar:\n' +
        '  $env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"\n' +
        `  $env:GCLOUD_PROJECT="${PROJECT_REQUERIDO}"\n`
    );
    process.exit(1);
  }

  console.log('[OK] Anti-producción confirmado:');
  console.log(`     FIRESTORE_EMULATOR_HOST = ${host}`);
  console.log(`     GCLOUD_PROJECT          = ${project}`);
  console.log(`     Modo                    = ${MODO}${COMMIT ? '' : ' (no escribe; usa --commit para cargar)'}`);
}

// ── Conversión de timestamps {"$timestamp": ISO} → Firestore Timestamp ─────
let timestampsConvertidos = 0;
function convertirTimestamps(valor) {
  if (Array.isArray(valor)) return valor.map(convertirTimestamps);
  if (valor && typeof valor === 'object') {
    if (typeof valor.$timestamp === 'string') {
      const d = new Date(valor.$timestamp);
      if (Number.isNaN(d.getTime())) {
        throw new Error(`Timestamp inválido en seed: "${valor.$timestamp}"`);
      }
      timestampsConvertidos += 1;
      return Timestamp.fromDate(d);
    }
    const out = {};
    for (const [k, v] of Object.entries(valor)) out[k] = convertirTimestamps(v);
    return out;
  }
  return valor;
}

// ── Validación previa del seed ─────────────────────────────────────────────
function validarSeed(seed) {
  const issues = [];
  if (!seed || typeof seed !== 'object') issues.push('seed no es un objeto JSON válido');

  const usuarios = seed.usuarios ?? {};
  const favoritos = seed.favoritos ?? [];

  if (typeof usuarios !== 'object' || Object.keys(usuarios).length === 0) {
    issues.push('seed.usuarios vacío o ausente');
  }
  if (!Array.isArray(favoritos) || favoritos.length === 0) {
    issues.push('seed.favoritos vacío o ausente');
  }

  for (const [uid, data] of Object.entries(usuarios)) {
    if (!data || typeof data !== 'object') issues.push(`usuario ${uid}: no es objeto`);
    else if (data.uid && data.uid !== uid) issues.push(`usuario ${uid}: campo uid="${data.uid}" no coincide con la clave`);
  }

  for (const [i, fav] of favoritos.entries()) {
    if (!fav.ownerUid) issues.push(`favorito[${i}]: falta ownerUid`);
    if (!fav.perfilId) issues.push(`favorito[${i}]: falta perfilId`);
  }

  // Cobertura de casos mínimos (informativo, no bloqueante).
  const tieneValido = favoritos.some((f) => usuarios[f.perfilId] !== undefined);
  const tieneHuerfano = favoritos.some((f) => usuarios[f.perfilId] === undefined);
  const cobertura = {
    usuarios: Object.keys(usuarios).length,
    favoritos: favoritos.length,
    favoritoValido: tieneValido,
    favoritoHuerfano: tieneHuerfano,
  };

  return { issues, cobertura };
}

async function main() {
  console.log('\n── CARGADOR SEED BLK-01 (solo emulador) ─────────────────────');
  assertEmuladorYProyecto();

  const seedRaw = JSON.parse(readFileSync(SEED_PATH, 'utf8'));
  const { issues, cobertura } = validarSeed(seedRaw);

  const reporte = {
    generadoEn: new Date().toISOString(),
    modo: MODO,
    entorno: {
      FIRESTORE_EMULATOR_HOST: process.env.FIRESTORE_EMULATOR_HOST,
      GCLOUD_PROJECT: process.env.GCLOUD_PROJECT,
    },
    seed: SEED_PATH,
    validacion: { issues, cobertura },
    escrituras: { usuarios: 0, favoritos: 0 },
    timestampsConvertidos: 0,
  };

  if (issues.length > 0) {
    console.error(`[ABORTADO] Validación del seed falló (${issues.length}):`);
    for (const e of issues) console.error('  - ' + e);
    writeFileSync(REPORT_PATH, JSON.stringify(reporte, null, 2), 'utf8');
    process.exit(1);
  }
  console.log(`[OK] Seed válido. usuarios=${cobertura.usuarios} favoritos=${cobertura.favoritos} ` +
    `(válido=${cobertura.favoritoValido}, huérfano=${cobertura.favoritoHuerfano})`);

  // Preparar documentos (convirtiendo timestamps) sin escribir todavía.
  const usuarios = convertirTimestamps(seedRaw.usuarios ?? {});
  const favoritos = convertirTimestamps(seedRaw.favoritos ?? []);
  reporte.timestampsConvertidos = timestampsConvertidos;

  if (!COMMIT) {
    console.log(`[DRY-RUN] Se escribirían ${Object.keys(usuarios).length} usuarios y ${favoritos.length} favoritos.`);
    console.log('[DRY-RUN] No se escribió nada. Usa --commit para cargar al emulador.');
    writeFileSync(REPORT_PATH, JSON.stringify(reporte, null, 2), 'utf8');
    console.log(`Reporte: ${REPORT_PATH}`);
    console.log('─────────────────────────────────────────────────────────────\n');
    return;
  }

  // COMMIT: escribir SOLO en el emulador (garantizado por las salvaguardas).
  if (getApps().length === 0) {
    initializeApp({ projectId: process.env.GCLOUD_PROJECT });
  }
  const db = getFirestore();
  const batch = db.batch();

  for (const [uid, data] of Object.entries(usuarios)) {
    batch.set(db.collection('usuarios').doc(uid), data, { merge: false });
    reporte.escrituras.usuarios += 1;
  }
  for (const fav of favoritos) {
    const ref = db.collection('usuarios').doc(fav.ownerUid).collection('favoritos').doc(fav.perfilId);
    batch.set(ref, fav, { merge: false });
    reporte.escrituras.favoritos += 1;
  }

  await batch.commit();

  console.log(`[COMMIT] Escritos ${reporte.escrituras.usuarios} usuarios y ${reporte.escrituras.favoritos} favoritos en el EMULADOR.`);
  writeFileSync(REPORT_PATH, JSON.stringify(reporte, null, 2), 'utf8');
  console.log(`Reporte: ${REPORT_PATH}`);
  console.log('─────────────────────────────────────────────────────────────\n');
}

main().catch((err) => {
  console.error('[ERROR seed-loader]', err);
  process.exit(1);
});
