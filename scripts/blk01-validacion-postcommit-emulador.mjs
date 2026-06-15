#!/usr/bin/env node
/**
 * BLK-01 — VALIDACIÓN POST-COMMIT (solo lectura, solo EMULADOR)
 * Parte de PLAN-CONSTRUCCION-BLK-01-MIGRACION-PERFILID v1.0.0
 *
 * Propósito: verificar que la migración aditiva quedó correctamente aplicada
 * en el Firestore Emulator: colección perfiles/, integridad de bridge en
 * usuarios/, ausencia de KYC/datos privados en perfiles públicos, legacy
 * intacto y favoritos huérfanos sin modificar.
 *
 * GARANTÍAS:
 *   - SOLO LECTURA. No escribe, no crea, no borra, no modifica.
 *   - SOLO EMULADOR. Aborta sin FIRESTORE_EMULATOR_HOST / proyecto != demo-carihub.
 *   - El único efecto local es un reporte JSON en scripts/.
 *
 * Uso (con emulador corriendo):
 *   $env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
 *   $env:GCLOUD_PROJECT="demo-carihub"
 *   node scripts/blk01-validacion-postcommit-emulador.mjs
 */

import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPORT_PATH = join(__dirname, '_blk01-validacion-postcommit-report.json');
const PROJECT_REQUERIDO = 'demo-carihub';
const PROJECT_PROHIBIDO = 'carihub-app';

// Campos públicos legacy (presencia => el usuario tenía perfil).
const CAMPOS_PERFIL_PUBLICO = [
  'nombre', 'geo', 'formularioId', 'sectorId', 'subcategoriaId',
  'arquetipo', 'tipoPerfil', 'descripcion', 'fotos', 'fechaPublicacion',
];
// Campos que NUNCA deben aparecer en perfiles/ (públicos).
const CAMPOS_SENSIBLES = [
  'verificacion', 'ineFrente', 'ineReverso', 'selfieVerificacion',
  'nombreReal', 'fechaNacimiento', 'domicilio', 'correoPrivado',
  'telefonoPrivado', 'kyc', 'notasAdmin', 'email',
];
// Obligatorios mínimos del perfil migrado.
const PERFIL_REQUERIDOS = ['perfilId', 'usuarioId', 'ownerUid', 'slug', 'estadoPublicacion'];

function assertEntornoSeguro() {
  const host = process.env.FIRESTORE_EMULATOR_HOST;
  const project = process.env.GCLOUD_PROJECT;
  const errores = [];
  if (!host) errores.push('FIRESTORE_EMULATOR_HOST no definido (solo emulador).');
  else if (!/^(127\.0\.0\.1|localhost|\[::1\]):\d+$/i.test(host)) errores.push(`Host no local: ${host}`);
  if (project !== PROJECT_REQUERIDO) errores.push(`GCLOUD_PROJECT debe ser "${PROJECT_REQUERIDO}" (actual: "${project ?? '(sin definir)'}").`);
  if (project === PROJECT_PROHIBIDO) errores.push(`"${PROJECT_PROHIBIDO}" PROHIBIDO.`);
  if (errores.length > 0) {
    console.error('\n[ABORTADO] Salvaguardas anti-producción no satisfechas:');
    for (const e of errores) console.error('  - ' + e);
    process.exit(1);
  }
  console.log(`[OK] Emulador ${host} / proyecto ${project}. Modo SOLO LECTURA.`);
}

function tieneDatosDePerfil(data) {
  return CAMPOS_PERFIL_PUBLICO.some((c) => data[c] !== undefined && data[c] !== null);
}

async function main() {
  console.log('\n── VALIDACIÓN POST-COMMIT BLK-01 (solo lectura) ─────────────');
  assertEntornoSeguro();

  if (getApps().length === 0) initializeApp({ projectId: process.env.GCLOUD_PROJECT });
  const db = getFirestore();

  const reporte = {
    generadoEn: new Date().toISOString(),
    modo: 'SOLO_LECTURA',
    projectId: process.env.GCLOUD_PROJECT,
    emulatorHost: process.env.FIRESTORE_EMULATOR_HOST,
    totales: { usuarios: 0, perfiles: 0 },
    perfiles: {
      conPerfilId: 0, conUsuarioId: 0, conOwnerUid: 0, conSlug: 0,
      conEstado: 0, requeridosCompletos: 0, conSensibleExpuesto: 0,
    },
    estadosDetectados: {},
    slugs: [],
    bridge: { usuariosConPerfil: 0, bridgeCorrecto: 0, sinPerfilMarcado: 0, bridgeIncorrecto: [] },
    legacy: { intacto: true, ejemplos: [] },
    favoritosHuerfanos: { totalRefs: 0, huerfanos: 0, ejemplos: [] },
    kycExpuesto: false,
    camposPrivadosExpuestos: false,
    errores: [],
    advertencias: [],
    veredicto: 'PENDIENTE',
  };

  // 1) perfiles/
  let snapPerfiles;
  try {
    snapPerfiles = await db.collection('perfiles').orderBy('__name__').get();
  } catch (e) {
    reporte.errores.push('lectura_perfiles_fallo: ' + e.message);
    reporte.veredicto = 'FAIL';
    writeFileSync(REPORT_PATH, JSON.stringify(reporte, null, 2), 'utf8');
    console.error('[FAIL] No se pudo leer perfiles/.', e.message);
    process.exit(1);
  }
  reporte.totales.perfiles = snapPerfiles.size;

  for (const doc of snapPerfiles.docs) {
    const p = doc.data();
    if (p.perfilId) reporte.perfiles.conPerfilId += 1;
    if (p.usuarioId) reporte.perfiles.conUsuarioId += 1;
    if (p.ownerUid) reporte.perfiles.conOwnerUid += 1;
    if (p.slug) { reporte.perfiles.conSlug += 1; reporte.slugs.push({ perfilId: doc.id, slug: p.slug }); }
    if (p.estadoPublicacion) {
      reporte.perfiles.conEstado += 1;
      reporte.estadosDetectados[p.estadoPublicacion] = (reporte.estadosDetectados[p.estadoPublicacion] ?? 0) + 1;
    }
    const completos = PERFIL_REQUERIDOS.every((c) => p[c] !== undefined && p[c] !== null);
    if (completos) reporte.perfiles.requeridosCompletos += 1;

    const sensibles = CAMPOS_SENSIBLES.filter((s) => p[s] !== undefined && p[s] !== null);
    if (sensibles.length > 0) {
      reporte.perfiles.conSensibleExpuesto += 1;
      reporte.kycExpuesto = reporte.kycExpuesto || sensibles.includes('verificacion') || sensibles.includes('kyc') || sensibles.some((s) => s.startsWith('ine') || s === 'selfieVerificacion');
      reporte.camposPrivadosExpuestos = true;
      reporte.errores.push(`perfiles/${doc.id} expone campos sensibles: ${sensibles.join(', ')}`);
    }
    // Coherencia bridge: ownerUid/usuarioId/perfilId == id del doc.
    if (p.perfilId !== doc.id || p.usuarioId !== doc.id || p.ownerUid !== doc.id) {
      reporte.advertencias.push(`perfiles/${doc.id}: perfilId/usuarioId/ownerUid no coinciden con el id del doc.`);
    }
  }

  // 2) usuarios/ — bridge + legacy intacto
  const snapUsuarios = await db.collection('usuarios').orderBy('__name__').get();
  reporte.totales.usuarios = snapUsuarios.size;

  for (const doc of snapUsuarios.docs) {
    const uid = doc.id;
    const u = doc.data();
    const perfilBridge = u.perfil ?? {};
    const tienePerfil = tieneDatosDePerfil(u);

    if (tienePerfil) {
      reporte.bridge.usuariosConPerfil += 1;
      const ok =
        perfilBridge.perfilPrincipalId === uid &&
        Array.isArray(perfilBridge.perfilIds) && perfilBridge.perfilIds.includes(uid) &&
        perfilBridge.migradoBlk01 === true &&
        perfilBridge.estadoBridge === 'migrado';
      if (ok) reporte.bridge.bridgeCorrecto += 1;
      else reporte.bridge.bridgeIncorrecto.push({ uid, perfil: perfilBridge });

      // Legacy intacto: los campos públicos legacy siguen presentes en usuarios/.
      const legacyPresente = CAMPOS_PERFIL_PUBLICO.some((c) => u[c] !== undefined && u[c] !== null);
      if (!legacyPresente) {
        reporte.legacy.intacto = false;
        reporte.legacy.ejemplos.push({ uid, motivo: 'campos legacy ausentes tras migración' });
      } else if (reporte.legacy.ejemplos.length < 5) {
        reporte.legacy.ejemplos.push({ uid, legacyOk: true });
      }
    } else {
      if (perfilBridge.estadoBridge === 'sin_perfil') reporte.bridge.sinPerfilMarcado += 1;
      else reporte.bridge.bridgeIncorrecto.push({ uid, perfil: perfilBridge, motivo: 'sin perfil pero estadoBridge != sin_perfil' });
    }
  }

  // 3) favoritos huérfanos (solo lectura, sin modificar)
  try {
    const idsUsuarios = new Set(snapUsuarios.docs.map((d) => d.id));
    const favSnap = await db.collectionGroup('favoritos').get();
    for (const fav of favSnap.docs) {
      reporte.favoritosHuerfanos.totalRefs += 1;
      if (!idsUsuarios.has(fav.id)) {
        reporte.favoritosHuerfanos.huerfanos += 1;
        if (reporte.favoritosHuerfanos.ejemplos.length < 20) {
          reporte.favoritosHuerfanos.ejemplos.push({ path: fav.ref.path, perfilId: fav.id });
        }
      }
    }
  } catch (e) {
    reporte.advertencias.push('No se pudieron leer favoritos: ' + e.message);
  }

  // 4) Veredicto
  const checks = {
    perfilesCreados: reporte.totales.perfiles > 0,
    requeridosCompletos: reporte.perfiles.requeridosCompletos === reporte.totales.perfiles,
    sinSensiblesExpuestos: reporte.perfiles.conSensibleExpuesto === 0,
    bridgeOk: reporte.bridge.bridgeIncorrecto.length === 0,
    legacyIntacto: reporte.legacy.intacto === true,
    sinErrores: reporte.errores.length === 0,
  };
  const pass = Object.values(checks).every(Boolean);
  reporte.checks = checks;
  reporte.veredicto = pass ? 'PASS' : 'FAIL';

  writeFileSync(REPORT_PATH, JSON.stringify(reporte, null, 2), 'utf8');

  console.log(`Usuarios: ${reporte.totales.usuarios} | Perfiles: ${reporte.totales.perfiles}`);
  console.log(`Perfiles requeridos completos: ${reporte.perfiles.requeridosCompletos}/${reporte.totales.perfiles}`);
  console.log(`Sensibles expuestos en perfiles: ${reporte.perfiles.conSensibleExpuesto}`);
  console.log(`Bridge correcto: ${reporte.bridge.bridgeCorrecto}/${reporte.bridge.usuariosConPerfil} | sin_perfil: ${reporte.bridge.sinPerfilMarcado}`);
  console.log(`Legacy intacto: ${reporte.legacy.intacto}`);
  console.log(`Favoritos huérfanos: ${reporte.favoritosHuerfanos.huerfanos}/${reporte.favoritosHuerfanos.totalRefs}`);
  console.log(`Estados: ${JSON.stringify(reporte.estadosDetectados)}`);
  console.log(`VEREDICTO: ${reporte.veredicto}`);
  console.log(`Reporte: ${REPORT_PATH}`);
  console.log('─────────────────────────────────────────────────────────────\n');
}

main().catch((err) => {
  console.error('[ERROR validacion-postcommit]', err);
  process.exit(1);
});
