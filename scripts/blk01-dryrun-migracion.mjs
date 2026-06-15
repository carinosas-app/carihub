#!/usr/bin/env node
/**
 * BLK-01 — Fase 1/2 DRY-RUN: mapeo usuarios/{uid} → perfiles/{uid} + hub
 * Parte de PLAN-CONSTRUCCION-BLK-01-MIGRACION-PERFILID v1.0.0
 *
 * Propósito: simular la extracción del monolito hacia el modelo objetivo
 * (hub usuarios + perfiles) aplicando la matriz de campos (sección 5 del plan),
 * SIN escribir nada. Reporta divergencias, campos obligatorios faltantes,
 * mezcla de KYC en campos públicos y equivalencia de estado de publicación.
 *
 * GARANTÍAS:
 *   - DRY-RUN. No escribe en Firestore. No crea perfiles/. No migra.
 *   - SOLO EMULADOR. Aborta si FIRESTORE_EMULATOR_HOST no está definido.
 *   - El único efecto local es escribir un reporte JSON en scripts/.
 *
 * Uso (cuando el PO autorice y con el emulador corriendo):
 *   $env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
 *   $env:GCLOUD_PROJECT="<projectId>"
 *   node scripts/blk01-dryrun-migracion.mjs
 *
 * Requiere: npm i firebase-admin
 *
 * NOTA: Artefacto de apoyo documental. NO ejecutar contra producción.
 */

import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function assertEmulator() {
  const host = process.env.FIRESTORE_EMULATOR_HOST;
  if (!host) {
    console.error(
      '\n[ABORTADO] FIRESTORE_EMULATOR_HOST no está definido.\n' +
        'Este script es SOLO para el emulador (dry-run). Define la variable antes de ejecutar.\n'
    );
    process.exit(1);
  }
  console.log(`[OK] Emulador detectado en ${host}. Modo DRY-RUN (sin escritura).`);
}

// Campos públicos que deben terminar en perfiles/{perfilId}.
const CAMPOS_PERFIL_PUBLICO = [
  'nombre', 'geo', 'formularioId', 'sectorId', 'subcategoriaId',
  'arquetipo', 'tipoPerfil', 'descripcion', 'fotos', 'fechaPublicacion',
];
// Campos obligatorios del documento perfiles/{perfilId} (config-cuentas-usuario-schema).
const PERFIL_OBLIGATORIOS = [
  'usuarioId', 'perfilId', 'formularioId', 'sectorId', 'subcategoriaId',
  'arquetipo', 'tipoPerfil', 'estadoRevision', 'tienePerfilPublico',
  'schemaVersion', 'componenteResultados', 'componentePerfil',
  'createdAt', 'updatedAt',
];
// Campos sensibles que NUNCA deben copiarse a campos públicos del perfil.
const CAMPOS_KYC = ['verificacion'];

function esPerfilPublicoLegacy(data, ahora) {
  const venc = data.fechaVencimiento;
  const vigente =
    venc == null ||
    !(venc instanceof Timestamp) ||
    venc.toMillis() > ahora.toMillis();
  return data.aprobado === true && data.activo === true && data.vencido !== true && vigente;
}

// Mapea aprobado/activo/vencido/estadoRevision legacy → estadoRevision canónico.
function mapearEstadoRevision(data) {
  if (data.vencido === true) return 'vencido';
  if (data.aprobado === true && data.activo === true) return 'publicado';
  if (data.estadoRevision === 'actualizacion_pendiente') return 'actualizacion_pendiente';
  if (data.estadoRevision === 'registro_pendiente') return 'borrador';
  return data.estadoRevision ?? 'borrador';
}

// Construye los documentos objetivo SIN escribirlos (bridge perfilId = uid).
function construirObjetivo(uid, data) {
  const estadoRevision = mapearEstadoRevision(data);
  const tienePerfilPublico = esPerfilPublicoLegacy(data, Timestamp.now());

  const perfil = {
    usuarioId: uid,
    perfilId: uid, // BRIDGE-MIG-01
    formularioId: data.formularioId ?? null,
    sectorId: data.sectorId ?? null,
    subcategoriaId: data.subcategoriaId ?? null,
    arquetipo: data.arquetipo ?? null,
    tipoPerfil: data.tipoPerfil ?? null,
    estadoRevision,
    tienePerfilPublico,
    schemaVersion: data.schemaVersion ?? '1.0.0',
    componenteResultados: data.componenteResultados ?? null,
    componentePerfil: data.componentePerfil ?? null,
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
    fechaPublicacion: data.fechaPublicacion ?? null,
    nombre: data.nombre ?? null,
    geo: data.geo ?? null,
    descripcion: data.descripcion ?? null,
    fotos: data.fotos ?? null,
  };

  const hubPatch = {
    'perfil.perfilPrincipalId': uid,
    'perfil.perfilIds': [uid],
    'perfil.tienePerfilPublico': tienePerfilPublico,
    'perfil.estadoPublicacion': estadoRevision,
    'comercial.estadoPago': data.estadoPago ?? null,
    'comercial.fechaVencimiento': data.fechaVencimiento ?? null,
    'comercial.pagado': data.pagado ?? null,
    'comercial.primerMesGratis': data.primerMesGratis ?? null,
    'verificacion.estadoVerificacion': data.verificacion?.estado ?? 'sin_enviar',
  };

  return { perfil, hubPatch };
}

function detectarDivergencias(uid, data, objetivo) {
  const issues = [];

  for (const campo of PERFIL_OBLIGATORIOS) {
    const v = objetivo.perfil[campo];
    if (v === null || v === undefined) {
      issues.push({ tipo: 'campo_obligatorio_faltante', campo });
    }
  }

  // KYC nunca debe quedar en campos públicos del perfil.
  for (const k of CAMPOS_KYC) {
    if (objetivo.perfil[k] !== undefined) {
      issues.push({ tipo: 'kyc_en_perfil_publico', campo: k });
    }
  }

  // Coherencia de estado de publicación.
  const publicoLegacy = esPerfilPublicoLegacy(data, Timestamp.now());
  if (publicoLegacy && objetivo.perfil.tienePerfilPublico !== true) {
    issues.push({ tipo: 'incoherencia_publicacion', detalle: 'legacy público pero objetivo no' });
  }
  if (publicoLegacy && !['publicado', 'aprobado'].includes(objetivo.perfil.estadoRevision)) {
    issues.push({ tipo: 'estado_revision_ambiguo', estado: objetivo.perfil.estadoRevision });
  }

  return issues;
}

async function main() {
  assertEmulator();

  if (getApps().length === 0) {
    initializeApp({ credential: applicationDefault() });
  }
  const db = getFirestore();

  const reporte = {
    generadoEn: new Date().toISOString(),
    modo: 'DRY_RUN_SIN_ESCRITURA',
    bridge: 'perfilId = usuarioId (BRIDGE-MIG-01)',
    totales: { usuarios: 0, sinDivergencias: 0, conDivergencias: 0 },
    divergenciasPorTipo: {},
    ejemplos: [],
    muestraMapeo: [],
  };

  let last = null;
  const PAGE = 500;
  /* eslint-disable no-await-in-loop */
  while (true) {
    let q = db.collection('usuarios').orderBy('__name__').limit(PAGE);
    if (last) q = q.startAfter(last);
    const snap = await q.get();
    if (snap.empty) break;

    for (const doc of snap.docs) {
      const uid = doc.id;
      const data = doc.data();
      reporte.totales.usuarios += 1;

      const objetivo = construirObjetivo(uid, data);
      const issues = detectarDivergencias(uid, data, objetivo);

      if (issues.length === 0) {
        reporte.totales.sinDivergencias += 1;
      } else {
        reporte.totales.conDivergencias += 1;
        for (const it of issues) {
          reporte.divergenciasPorTipo[it.tipo] = (reporte.divergenciasPorTipo[it.tipo] ?? 0) + 1;
        }
        if (reporte.ejemplos.length < 30) {
          reporte.ejemplos.push({ uid, issues });
        }
      }

      if (reporte.muestraMapeo.length < 5) {
        reporte.muestraMapeo.push({ uid, perfil: objetivo.perfil, hubPatch: objetivo.hubPatch });
      }
    }
    last = snap.docs[snap.docs.length - 1];
    if (snap.size < PAGE) break;
  }
  /* eslint-enable no-await-in-loop */

  const out = join(__dirname, '_blk01-dryrun-report.json');
  writeFileSync(out, JSON.stringify(reporte, null, 2), 'utf8');

  console.log('\n── DRY-RUN MIGRACIÓN BLK-01 (sin escritura) ─────────────────');
  console.log(`Usuarios procesados:     ${reporte.totales.usuarios}`);
  console.log(`Sin divergencias:        ${reporte.totales.sinDivergencias}`);
  console.log(`Con divergencias:        ${reporte.totales.conDivergencias}`);
  console.log(`Divergencias por tipo:   ${JSON.stringify(reporte.divergenciasPorTipo)}`);
  console.log(`Reporte escrito en:      ${out}`);
  console.log('─────────────────────────────────────────────────────────────\n');
}

main().catch((err) => {
  console.error('[ERROR dry-run]', err);
  process.exit(1);
});
