#!/usr/bin/env node
/**
 * BLK-01 — MIGRACIÓN ADITIVA (solo EMULADOR)
 * Parte de PLAN-CONSTRUCCION-BLK-01-MIGRACION-PERFILID v1.0.0
 *
 * Propósito: migrar de forma ADITIVA usuarios/{uid} → perfiles/{perfilId} + bridge
 * en el hub usuarios/{uid}, EXCLUSIVAMENTE contra el Firestore Emulator.
 * NO borra legacy. NO toca producción. Bridge: perfilId = usuarioId (BRIDGE-MIG-01).
 *
 * ┌────────────────────────────────────────────────────────────────────────┐
 * │  SALVAGUARDAS ANTI-PRODUCCIÓN (todas deben cumplirse para escribir):     │
 * │   1. FIRESTORE_EMULATOR_HOST definido (si no → ABORTA).                  │
 * │   2. Host local (127.0.0.1 / localhost / [::1]) (si no → ABORTA).        │
 * │   3. GCLOUD_PROJECT === "demo-carihub" exacto (si no → ABORTA).          │
 * │   4. "carihub-app" rechazado explícitamente.                            │
 * │   5. Modo por defecto = DRY-RUN. Escritura solo con --commit.            │
 * │   6. Commit exige ADEMÁS --confirm-emulator.                            │
 * │   7. NO usa applicationDefault() ni credenciales reales.                 │
 * │   8. Aborta si el emulador no responde / no hay usuarios/ / vacío.       │
 * │   9. Aborta si detecta datos potencialmente reales (no-demo).            │
 * └────────────────────────────────────────────────────────────────────────┘
 *
 * Uso (FASE FUTURA, con autorización y emulador corriendo):
 *   # Dry-run (por defecto, no escribe):
 *   $env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
 *   $env:GCLOUD_PROJECT="demo-carihub"
 *   node scripts/blk01-migracion-emulador.mjs
 *
 *   # Commit en EMULADOR (doble confirmación obligatoria):
 *   node scripts/blk01-migracion-emulador.mjs --commit --confirm-emulator
 *
 * Requiere: firebase-admin (ya instalado en la raíz).
 * NOTA: Artefacto de apoyo. NO ejecutar contra producción.
 */

import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import {
  mapLegacyUsuarioToPerfil,
  mapLegacyEstadoPublicacion,
  esPerfilPublicoLegacy as esPerfilPublicoLegacyContract,
  validatePerfilContract
} from './lib/blk05-perfiles-contract.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPORT_PATH = join(__dirname, '_blk01-migracion-emulador-report.json');

const PROJECT_REQUERIDO = 'demo-carihub';
const PROJECT_PROHIBIDO = 'carihub-app';
const SCHEMA_VERSION = '1.0.0';
const MIGRACION_VERSION = 'BLK-01-emulador-1.0.0';
const MAX_OPS_POR_BATCH = 400;

const COMMIT = process.argv.includes('--commit');
const CONFIRM_EMULATOR = process.argv.includes('--confirm-emulator');
const MODO = COMMIT ? 'COMMIT' : 'DRY_RUN';

// Campos públicos legacy que se migran al perfil.
const CAMPOS_PERFIL_PUBLICO = [
  'nombre', 'geo', 'formularioId', 'sectorId', 'subcategoriaId',
  'arquetipo', 'tipoPerfil', 'descripcion', 'fotos', 'fechaPublicacion',
];
// Obligatorios del documento perfiles/{perfilId}.
const PERFIL_OBLIGATORIOS = [
  'usuarioId', 'perfilId', 'formularioId', 'sectorId', 'subcategoriaId',
  'arquetipo', 'tipoPerfil', 'estadoPublicacion', 'tienePerfilPublico',
  'schemaVersion', 'createdAt', 'updatedAt',
];
// Campos sensibles que NUNCA deben aparecer en el perfil público.
const CAMPOS_SENSIBLES = [
  'verificacion', 'ineFrente', 'ineReverso', 'selfieVerificacion',
  'nombreReal', 'fechaNacimiento', 'domicilio', 'correoPrivado',
  'telefonoPrivado', 'kyc', 'notasAdmin', 'email',
];

// ── Salvaguardas anti-producción ──────────────────────────────────────────
function assertEntornoSeguro() {
  const host = process.env.FIRESTORE_EMULATOR_HOST;
  const project = process.env.GCLOUD_PROJECT;
  const errores = [];

  if (!host) {
    errores.push('FIRESTORE_EMULATOR_HOST no está definido. Este script es SOLO para el emulador.');
  } else if (!/^(127\.0\.0\.1|localhost|\[::1\]):\d+$/i.test(host)) {
    errores.push(`FIRESTORE_EMULATOR_HOST="${host}" no es local. Debe apuntar a 127.0.0.1/localhost.`);
  }
  if (project !== PROJECT_REQUERIDO) {
    errores.push(`GCLOUD_PROJECT debe ser exactamente "${PROJECT_REQUERIDO}" (actual: "${project ?? '(sin definir)'}").`);
  }
  if (project === PROJECT_PROHIBIDO) {
    errores.push(`GCLOUD_PROJECT="${PROJECT_PROHIBIDO}" PROHIBIDO. Nunca migrar contra el proyecto real.`);
  }
  if (COMMIT && !CONFIRM_EMULATOR) {
    errores.push('--commit requiere ADEMÁS --confirm-emulator. Abortado por seguridad.');
  }

  if (errores.length > 0) {
    console.error('\n[ABORTADO] Salvaguardas anti-producción no satisfechas:');
    for (const e of errores) console.error('  - ' + e);
    console.error(
      '\nEntorno seguro requerido:\n' +
        '  $env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"\n' +
        `  $env:GCLOUD_PROJECT="${PROJECT_REQUERIDO}"\n`
    );
    process.exit(1);
  }

  console.log('[OK] Anti-producción confirmado:');
  console.log(`     FIRESTORE_EMULATOR_HOST = ${host}`);
  console.log(`     GCLOUD_PROJECT          = ${project}`);
  console.log(`     Modo                    = ${MODO}${COMMIT ? ' (--confirm-emulator OK)' : ' (no escribe; usa --commit --confirm-emulator)'}`);
}

// Detecta indicios de datos NO ficticios (potencialmente reales) para abortar.
function pareceDatoReal(uid, data) {
  const email = typeof data.email === 'string' ? data.email : '';
  // El seed usa @example.test y uids demo_*. Cualquier otra cosa es sospechosa.
  const emailDemo = email === '' || /@example\.test$/i.test(email);
  const uidDemo = /^demo[_-]/i.test(uid);
  return !(emailDemo && uidDemo);
}

// ── Slug seguro desde nombre/alias, sin librerías externas ─────────────────
function generarSlug(nombre, perfilId) {
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') return perfilId;
  const slug = nombre
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // sin acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // no alfanumérico → guion
    .replace(/^-+|-+$/g, '')      // sin guiones extremos
    .replace(/-{2,}/g, '-');      // sin guiones repetidos
  return slug === '' ? perfilId : slug;
}

function tieneDatosDePerfil(data) {
  return CAMPOS_PERFIL_PUBLICO.some((c) => data[c] !== undefined && data[c] !== null);
}

function esPerfilPublicoLegacy(data, ahora) {
  return esPerfilPublicoLegacyContract(data, ahora.toMillis());
}

function mapearEstadoPublicacion(data) {
  return mapLegacyEstadoPublicacion(data);
}

// ── Construcción del perfil objetivo (sin escribir) ────────────────────────
function construirPerfil(uid, data, ahora, camposOmitidos) {
  const perfilBase = mapLegacyUsuarioToPerfil(uid, data, { nowMs: ahora.toMillis() });
  const nombre = data.nombre ?? null;
  const slug = generarSlug(nombre, uid);

  for (const s of CAMPOS_SENSIBLES) {
    if (data[s] !== undefined && data[s] !== null) camposOmitidos.add(s);
  }

  const perfil = {
    ...perfilBase,
    alias: nombre,
    slug,
    schemaVersion: data.schemaVersion ?? SCHEMA_VERSION,
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
    migracion: {
      origen: 'usuarios',
      blk: 'BLK-01',
      version: MIGRACION_VERSION,
      migradoEn: ahora,
      modo: MODO,
    },
  };

  const contractIssues = validatePerfilContract(perfil);
  if (contractIssues.length) {
    for (const issue of contractIssues) {
      if (issue.code === 'forbidden_field') camposOmitidos.add('contract:' + issue.fields.join(','));
    }
  }

  return perfil;
}

function hubPatchConPerfil(uid, ahora) {
  return {
    'perfil.perfilPrincipalId': uid,
    'perfil.perfilIds': FieldValue.arrayUnion(uid), // sin duplicados
    'perfil.migradoBlk01': true,
    'perfil.migradoEn': ahora,
    'perfil.estadoBridge': 'migrado',
    'perfil.schemaVersion': SCHEMA_VERSION,
  };
}

function hubPatchSinPerfil(ahora) {
  return {
    'perfil.perfilPrincipalId': null,
    'perfil.perfilIds': [],
    'perfil.migradoBlk01': true,
    'perfil.migradoEn': ahora,
    'perfil.estadoBridge': 'sin_perfil',
    'perfil.schemaVersion': SCHEMA_VERSION,
  };
}

function divergenciasPerfil(perfil) {
  const issues = [];
  for (const campo of PERFIL_OBLIGATORIOS) {
    if (perfil[campo] === null || perfil[campo] === undefined) {
      issues.push({ tipo: 'campo_obligatorio_faltante', campo });
    }
  }
  for (const s of CAMPOS_SENSIBLES) {
    if (perfil[s] !== undefined) issues.push({ tipo: 'sensible_en_perfil_publico', campo: s });
  }
  return issues;
}

async function main() {
  console.log('\n── MIGRACIÓN ADITIVA BLK-01 (solo emulador) ─────────────────');
  assertEntornoSeguro();

  if (getApps().length === 0) {
    initializeApp({ projectId: process.env.GCLOUD_PROJECT });
  }
  const db = getFirestore();
  const ahora = Timestamp.now();

  const reporte = {
    generadoEn: new Date().toISOString(),
    modo: MODO,
    projectId: process.env.GCLOUD_PROJECT,
    emulatorHost: process.env.FIRESTORE_EMULATOR_HOST,
    bridge: 'perfilId = usuarioId (BRIDGE-MIG-01)',
    usuariosProcesados: 0,
    perfilesSimulados: 0,
    perfilesCreados: 0,
    usuariosParchados: 0,
    usuariosSinPerfil: 0,
    perfilesOmitidos: 0,
    divergencias: {},
    advertencias: [],
    colisiones: [],
    kycDetectado: 0,
    camposOmitidosPorPrivacidad: [],
    slugsGenerados: [],
    favoritosHuerfanos: { totalRefs: 0, huerfanos: 0, ejemplos: [] },
    batches: 0,
    operacionesEstimadas: 0,
    operacionesEjecutadas: 0,
    errores: [],
    veredicto: 'PENDIENTE',
  };

  // 1) Verificar que el emulador responde y que existe usuarios/ con datos.
  let snapUsuarios;
  try {
    snapUsuarios = await db.collection('usuarios').orderBy('__name__').limit(1000).get();
  } catch (e) {
    console.error('[ABORTADO] El emulador no responde o falló la lectura de usuarios/.', e.message);
    reporte.errores.push('emulador_no_responde: ' + e.message);
    reporte.veredicto = 'ABORTADO';
    writeFileSync(REPORT_PATH, JSON.stringify(reporte, null, 2), 'utf8');
    process.exit(1);
  }
  if (snapUsuarios.empty) {
    console.error('[ABORTADO] La colección usuarios/ está vacía en el emulador. Cargue el seed primero.');
    reporte.errores.push('dataset_vacio');
    reporte.veredicto = 'ABORTADO';
    writeFileSync(REPORT_PATH, JSON.stringify(reporte, null, 2), 'utf8');
    process.exit(1);
  }

  // 2) Guardia anti-datos-reales: cualquier doc no-demo aborta.
  for (const doc of snapUsuarios.docs) {
    if (pareceDatoReal(doc.id, doc.data())) {
      console.error(`[ABORTADO] Documento potencialmente real detectado: usuarios/${doc.id}. Solo se permite dataset demo.`);
      reporte.errores.push(`dato_no_demo: usuarios/${doc.id}`);
      reporte.veredicto = 'ABORTADO';
      writeFileSync(REPORT_PATH, JSON.stringify(reporte, null, 2), 'utf8');
      process.exit(1);
    }
  }

  const camposOmitidos = new Set();
  const operaciones = []; // {tipo, ref, data|patch, merge}

  // 3) Procesar cada usuario.
  for (const doc of snapUsuarios.docs) {
    const uid = doc.id;
    const data = doc.data();
    reporte.usuariosProcesados += 1;

    if (data.verificacion != null) reporte.kycDetectado += 1;

    if (tieneDatosDePerfil(data)) {
      const perfil = construirPerfil(uid, data, ahora, camposOmitidos);
      reporte.perfilesSimulados += 1;
      reporte.slugsGenerados.push({ uid, slug: perfil.slug });

      const issues = divergenciasPerfil(perfil);
      for (const it of issues) {
        reporte.divergencias[it.tipo] = (reporte.divergencias[it.tipo] ?? 0) + 1;
      }

      // Idempotencia: ¿ya existe perfiles/{perfilId}?
      const perfilRef = db.collection('perfiles').doc(uid);
      // eslint-disable-next-line no-await-in-loop
      const existe = await perfilRef.get();
      if (existe.exists) {
        reporte.colisiones.push({ perfilId: uid, accion: 'omitido_existe' });
        reporte.perfilesOmitidos += 1;
      } else {
        operaciones.push({ tipo: 'create_perfil', ref: perfilRef, data: perfil });
      }

      // Bridge en el hub (arrayUnion evita duplicados en perfilIds).
      operaciones.push({
        tipo: 'patch_usuario',
        ref: db.collection('usuarios').doc(uid),
        patch: hubPatchConPerfil(uid, ahora),
      });
    } else {
      reporte.usuariosSinPerfil += 1;
      operaciones.push({
        tipo: 'patch_usuario_sin_perfil',
        ref: db.collection('usuarios').doc(uid),
        patch: hubPatchSinPerfil(ahora),
      });
    }
  }

  // 4) Favoritos huérfanos: SOLO detectar y reportar, nunca modificar.
  try {
    const idsUsuarios = new Set(snapUsuarios.docs.map((d) => d.id));
    const favSnap = await db.collectionGroup('favoritos').limit(2000).get();
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
    reporte.advertencias.push('No se pudieron leer favoritos (collectionGroup): ' + e.message);
  }

  // 5) Cálculo de batches/operaciones.
  reporte.operacionesEstimadas = operaciones.length;
  reporte.batches = Math.ceil(operaciones.length / MAX_OPS_POR_BATCH) || 0;
  reporte.camposOmitidosPorPrivacidad = [...camposOmitidos];
  if (reporte.favoritosHuerfanos.huerfanos > 0) {
    reporte.advertencias.push(`${reporte.favoritosHuerfanos.huerfanos} favoritos huérfanos detectados (no se modifican; fase posterior).`);
  }

  if (!COMMIT) {
    reporte.veredicto = 'DRY_RUN_OK';
    writeFileSync(REPORT_PATH, JSON.stringify(reporte, null, 2), 'utf8');
    console.log(`[DRY-RUN] usuarios=${reporte.usuariosProcesados} perfilesSim=${reporte.perfilesSimulados} ` +
      `sinPerfil=${reporte.usuariosSinPerfil} colisiones=${reporte.colisiones.length} ` +
      `opsEstimadas=${reporte.operacionesEstimadas} batches=${reporte.batches}`);
    console.log('[DRY-RUN] No se escribió nada. Usa --commit --confirm-emulator para migrar en emulador.');
    console.log(`Reporte: ${REPORT_PATH}`);
    console.log('─────────────────────────────────────────────────────────────\n');
    return;
  }

  // 6) COMMIT — escritura por batches SOLO en emulador.
  let batch = db.batch();
  let opsEnBatch = 0;
  for (const op of operaciones) {
    if (op.tipo === 'create_perfil') {
      batch.set(op.ref, op.data, { merge: false });
      reporte.perfilesCreados += 1;
    } else {
      batch.set(op.ref, {}, { merge: true }); // asegura doc
      batch.update(op.ref, op.patch);
      reporte.usuariosParchados += op.tipo === 'patch_usuario_sin_perfil' ? 0 : 1;
    }
    reporte.operacionesEjecutadas += 1;
    opsEnBatch += 1;
    if (opsEnBatch >= MAX_OPS_POR_BATCH) {
      // eslint-disable-next-line no-await-in-loop
      await batch.commit();
      batch = db.batch();
      opsEnBatch = 0;
    }
  }
  if (opsEnBatch > 0) await batch.commit();

  reporte.veredicto = 'COMMIT_OK';
  writeFileSync(REPORT_PATH, JSON.stringify(reporte, null, 2), 'utf8');
  console.log(`[COMMIT] perfilesCreados=${reporte.perfilesCreados} usuariosParchados=${reporte.usuariosParchados} ` +
    `omitidos=${reporte.perfilesOmitidos} opsEjecutadas=${reporte.operacionesEjecutadas}`);
  console.log(`Reporte: ${REPORT_PATH}`);
  console.log('─────────────────────────────────────────────────────────────\n');
}

main().catch((err) => {
  console.error('[ERROR migracion-emulador]', err);
  process.exit(1);
});
