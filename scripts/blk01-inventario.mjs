#!/usr/bin/env node
/**
 * BLK-01 — Fase 0: INVENTARIO (solo lectura)
 * Parte de PLAN-CONSTRUCCION-BLK-01-MIGRACION-PERFILID v1.0.0
 *
 * Propósito: medir el estado real del monolito usuarios/{uid} ANTES de cualquier
 * migración: conteos, campos poblados, favoritos huérfanos y equivalencia
 * isPublicProfile(). Cierra los vacíos VAC-01 / VAC-05 / VAC-06.
 *
 * GARANTÍAS:
 *   - SOLO LECTURA. No escribe en Firestore. No borra. No migra.
 *   - SOLO EMULADOR. Aborta si FIRESTORE_EMULATOR_HOST no está definido.
 *   - El único efecto local es escribir un reporte JSON en scripts/.
 *
 * Uso (cuando el PO autorice y con el emulador corriendo):
 *   $env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
 *   $env:GCLOUD_PROJECT="<projectId>"
 *   node scripts/blk01-inventario.mjs
 *
 * Requiere: npm i firebase-admin
 *
 * NOTA: Este archivo es un artefacto de apoyo documental. NO debe ejecutarse
 * contra producción. La ejecución real requiere autorización runtime del PO.
 */

import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Guardas de seguridad ────────────────────────────────────────────────
function assertEmulator() {
  const host = process.env.FIRESTORE_EMULATOR_HOST;
  if (!host) {
    console.error(
      '\n[ABORTADO] FIRESTORE_EMULATOR_HOST no está definido.\n' +
        'Este script es SOLO para el emulador. Define la variable antes de ejecutar:\n' +
        '  PowerShell:  $env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"\n'
    );
    process.exit(1);
  }
  console.log(`[OK] Emulador detectado en ${host}. Modo solo-lectura.`);
}

// ── Campos canónicos del monolito (ver firestore.rules + acta migración) ──
const CAMPOS_CUENTA = ['uid', 'email'];
const CAMPOS_PUBLICACION = ['aprobado', 'activo', 'vencido', 'estadoRevision', 'fechaPublicacion'];
const CAMPOS_COMERCIAL = ['estadoPago', 'pagado', 'primerMesGratis', 'fechaVencimiento'];
const CAMPOS_KYC = ['verificacion'];
const CAMPOS_PERFIL_PUBLICO = [
  'nombre', 'geo', 'formularioId', 'sectorId', 'subcategoriaId',
  'arquetipo', 'tipoPerfil', 'descripcion', 'fotos',
];
const TODOS_LOS_CAMPOS = [
  ...CAMPOS_CUENTA, ...CAMPOS_PUBLICACION, ...CAMPOS_COMERCIAL,
  ...CAMPOS_KYC, ...CAMPOS_PERFIL_PUBLICO, 'actualizacionPendiente',
];

// Equivalencia exacta de isPublicProfile() en firestore.rules.
function esPerfilPublicoLegacy(data, ahora) {
  const venc = data.fechaVencimiento;
  const vigente =
    venc == null ||
    !(venc instanceof Timestamp) ||
    venc.toMillis() > ahora.toMillis();
  return data.aprobado === true && data.activo === true && data.vencido !== true && vigente;
}

function tieneDatosDePerfil(data) {
  return CAMPOS_PERFIL_PUBLICO.some((c) => data[c] !== undefined && data[c] !== null);
}

async function main() {
  assertEmulator();

  if (getApps().length === 0) {
    initializeApp({ credential: applicationDefault() });
  }
  const db = getFirestore();
  const ahora = Timestamp.now();

  const reporte = {
    generadoEn: new Date().toISOString(),
    fuente: 'usuarios/{uid} (emulador)',
    modo: 'SOLO_LECTURA',
    totales: { usuarios: 0, conDatosPerfil: 0, perfilPublicoEquivalente: 0 },
    porEstadoRevision: {},
    porEstadoPago: {},
    flagsPublicacion: { aprobado: 0, activo: 0, vencido: 0 },
    camposPoblados: Object.fromEntries(TODOS_LOS_CAMPOS.map((c) => [c, 0])),
    kyc: { conVerificacion: 0 },
    favoritos: { totalRefs: 0, huerfanos: 0, ejemplosHuerfanos: [] },
    advertencias: [],
  };

  // 1) Recorrer usuarios (paginado para escalar).
  const idsUsuarios = new Set();
  let last = null;
  const PAGE = 500;
  /* eslint-disable no-await-in-loop */
  while (true) {
    let q = db.collection('usuarios').orderBy('__name__').limit(PAGE);
    if (last) q = q.startAfter(last);
    const snap = await q.get();
    if (snap.empty) break;

    for (const doc of snap.docs) {
      const data = doc.data();
      idsUsuarios.add(doc.id);
      reporte.totales.usuarios += 1;

      for (const c of TODOS_LOS_CAMPOS) {
        if (data[c] !== undefined && data[c] !== null) reporte.camposPoblados[c] += 1;
      }
      if (data.aprobado === true) reporte.flagsPublicacion.aprobado += 1;
      if (data.activo === true) reporte.flagsPublicacion.activo += 1;
      if (data.vencido === true) reporte.flagsPublicacion.vencido += 1;

      const er = data.estadoRevision ?? '(sin_estado)';
      reporte.porEstadoRevision[er] = (reporte.porEstadoRevision[er] ?? 0) + 1;
      const ep = data.estadoPago ?? '(sin_estado)';
      reporte.porEstadoPago[ep] = (reporte.porEstadoPago[ep] ?? 0) + 1;

      if (data.verificacion != null) reporte.kyc.conVerificacion += 1;
      if (tieneDatosDePerfil(data)) reporte.totales.conDatosPerfil += 1;
      if (esPerfilPublicoLegacy(data, ahora)) reporte.totales.perfilPublicoEquivalente += 1;
    }
    last = snap.docs[snap.docs.length - 1];
    if (snap.size < PAGE) break;
  }

  // 2) Favoritos huérfanos: con bridge perfilId=uid, un favorito apunta a un
  //    perfil válido si su id existe como usuario (futuro: como perfiles/{id}).
  last = null;
  while (true) {
    let q = db.collectionGroup('favoritos').orderBy('__name__').limit(PAGE);
    if (last) q = q.startAfter(last);
    const snap = await q.get();
    if (snap.empty) break;

    for (const doc of snap.docs) {
      reporte.favoritos.totalRefs += 1;
      const perfilId = doc.id;
      if (!idsUsuarios.has(perfilId)) {
        reporte.favoritos.huerfanos += 1;
        if (reporte.favoritos.ejemplosHuerfanos.length < 20) {
          reporte.favoritos.ejemplosHuerfanos.push({ path: doc.ref.path, perfilId });
        }
      }
    }
    last = snap.docs[snap.docs.length - 1];
    if (snap.size < PAGE) break;
  }
  /* eslint-enable no-await-in-loop */

  // 3) Advertencias documentales para Fase 1/2.
  if (reporte.totales.conDatosPerfil !== reporte.totales.perfilPublicoEquivalente) {
    reporte.advertencias.push(
      'Hay usuarios con datos de perfil que NO cumplen isPublicProfile(): revisar mapeo de estados (VAC-06).'
    );
  }
  if (reporte.favoritos.huerfanos > 0) {
    reporte.advertencias.push(
      `${reporte.favoritos.huerfanos} favoritos huérfanos: deben resolverse antes de validar favoritos contra perfiles/.`
    );
  }

  const out = join(__dirname, '_blk01-inventario-report.json');
  writeFileSync(out, JSON.stringify(reporte, null, 2), 'utf8');

  console.log('\n── INVENTARIO BLK-01 (solo lectura) ─────────────────────────');
  console.log(`Usuarios totales:              ${reporte.totales.usuarios}`);
  console.log(`Con datos de perfil:           ${reporte.totales.conDatosPerfil}`);
  console.log(`Perfil público equivalente:    ${reporte.totales.perfilPublicoEquivalente}`);
  console.log(`Con verificación (KYC):        ${reporte.kyc.conVerificacion}`);
  console.log(`Favoritos (refs / huérfanos):  ${reporte.favoritos.totalRefs} / ${reporte.favoritos.huerfanos}`);
  console.log(`Estados revisión:              ${JSON.stringify(reporte.porEstadoRevision)}`);
  console.log(`Advertencias:                  ${reporte.advertencias.length}`);
  console.log(`Reporte escrito en:            ${out}`);
  console.log('─────────────────────────────────────────────────────────────\n');
}

main().catch((err) => {
  console.error('[ERROR inventario]', err);
  process.exit(1);
});
