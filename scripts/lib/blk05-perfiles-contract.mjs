/**
 * BLK-05-R0 — Frozen perfiles/{perfilId} contract (emulator + ETL alignment).
 * Single source of truth for estadoPublicacion, public predicate, ownership, denylist.
 *
 * DO NOT deploy. Used by rules tests, ETL dry-run, and contract-alignment QA.
 */

/** Canonical write states — never persist compatibility aliases as new docs. */
export const ESTADOS_CANONICOS = Object.freeze([
  'borrador',
  'pendiente',
  'publicado',
  'suspendido',
  'vencido',
  'eliminado'
]);

/**
 * Read-only compatibility aliases (legacy / draft rules / pre-freeze data).
 * ETL and new writes MUST NOT emit these.
 */
export const ESTADOS_COMPAT_LECTURA = Object.freeze({
  activo: 'publicado',
  aprobado: 'pendiente',
  correccion_solicitada: 'pendiente',
  actualizacion_pendiente: 'pendiente'
});

export const FORBIDDEN_PERFIL_FIELDS = Object.freeze([
  'verificacion', 'ine', 'ineFrente', 'ineReverso', 'selfie', 'selfieVerificacion',
  'documentos', 'documentosPrivados', 'documentosInternos', 'curp', 'rfc', 'fiscal',
  'datosFiscales', 'cuentaBancaria', 'clabe', 'payment', 'pagos', 'contratos',
  'renovaciones', 'vencimientos', 'adeudos', 'comprobantes', 'referenciasPago',
  'facturacion', 'datosBancarios', 'tokens', 'secrets', 'token', 'refreshToken',
  'apiKey', 'password', 'perfilesDetalle', 'perfilesVinculados',
  'nombreReal', 'fechaNacimiento', 'domicilio', 'correoPrivado', 'telefonoPrivado',
  'kyc', 'notasAdmin', 'email', 'estadoPago', 'pagado', 'primerMesGratis',
  'auditoria', 'decisionAdmin', 'revisadoPor', 'metadatosRevision'
]);

export const PERFIL_REQUIRED_FIELDS = Object.freeze([
  'perfilId', 'ownerUid', 'usuarioId', 'estadoPublicacion',
  'visible', 'publicado', 'tienePerfilPublico',
  'suspendido', 'eliminado', 'vencido'
]);

export const OWNER_PUBLIC_UPDATE_FIELDS = Object.freeze([
  'alias', 'slug', 'categoria', 'ciudad', 'estado', 'pais',
  'descripcionPublica', 'fotoPrincipalPublica', 'fotosPublicas',
  'serviciosPublicos', 'horario', 'zona', 'modalidad',
  'precioPublico', 'contactosPublicos', 'nombre', 'descripcion', 'fotos', 'geo',
  'updatedAt'
]);

/** Phase-1 admin transitions (frozen). */
export const TRANSICIONES_ADMIN = Object.freeze([
  { de: 'borrador', a: 'pendiente' },
  { de: 'pendiente', a: 'publicado' },
  { de: 'pendiente', a: 'borrador' },
  { de: 'publicado', a: 'suspendido' },
  { de: 'suspendido', a: 'publicado' },
  { de: 'vencido', a: 'publicado' },
  { de: '*', a: 'eliminado' }
]);

export const TRANSICIONES_OWNER = Object.freeze([
  { de: 'borrador', a: 'pendiente' },
  { de: 'pendiente', a: 'borrador' }
]);

/** BLK-05 W1 — atomic public visibility bundle after admin publish. */
export const ADMIN_PUBLISH_VISIBILITY_FIELDS = Object.freeze([
  'estadoPublicacion', 'visible', 'publicado', 'tienePerfilPublico', 'suspendido', 'vencido'
]);

export function normalizeEstadoPublicacionLectura(estado) {
  if (estado == null) return 'borrador';
  const s = String(estado).trim();
  if (ESTADOS_CANONICOS.includes(s)) return s;
  return ESTADOS_COMPAT_LECTURA[s] || s;
}

export function hasForbiddenPerfilField(obj) {
  if (!obj || typeof obj !== 'object') return false;
  return FORBIDDEN_PERFIL_FIELDS.some((k) => Object.prototype.hasOwnProperty.call(obj, k));
}

export function forbiddenFieldsOnPerfil(obj) {
  if (!obj || typeof obj !== 'object') return [];
  return FORBIDDEN_PERFIL_FIELDS.filter((k) => Object.prototype.hasOwnProperty.call(obj, k));
}

/**
 * JS mirror of Firestore isPerfilPublico() — used by ETL alignment tests.
 * @param {object} perfil
 * @param {number} [nowMs] epoch ms for fechaVencimiento check
 */
export function adminTransitionTargetsPublicado(fromEstado, toEstado) {
  const from = normalizeEstadoPublicacionLectura(fromEstado);
  const to = normalizeEstadoPublicacionLectura(toEstado);
  return to === 'publicado' && from !== 'publicado';
}

export function adminTransitionTargetsSuspendido(fromEstado, toEstado) {
  const from = normalizeEstadoPublicacionLectura(fromEstado);
  const to = normalizeEstadoPublicacionLectura(toEstado);
  return to === 'suspendido' && from !== 'suspendido';
}

/** Invariant: admin transition TO publicado must leave doc publicly consistent. */
export function isAdminPublishBundle(perfil) {
  if (!perfil || typeof perfil !== 'object') return false;
  return perfil.estadoPublicacion === 'publicado'
    && perfil.visible === true
    && perfil.publicado === true
    && perfil.tienePerfilPublico === true
    && perfil.suspendido === false
    && perfil.vencido === false;
}

/** Invariant: admin transition TO suspendido must hide public visibility. */
export function isAdminSuspendBundle(perfil) {
  if (!perfil || typeof perfil !== 'object') return false;
  return perfil.estadoPublicacion === 'suspendido'
    && perfil.visible === false
    && perfil.publicado === false
    && perfil.tienePerfilPublico === false
    && perfil.suspendido === true;
}

/**
 * Validates admin update result for estado transition side-effects (W1).
 * @param {string} fromEstado
 * @param {string} toEstado
 * @param {object} nextDoc post-update document shape
 */
export function validateAdminTransitionBundle(fromEstado, toEstado, nextDoc) {
  if (adminTransitionTargetsPublicado(fromEstado, toEstado)) {
    return isAdminPublishBundle(nextDoc) ? [] : [{ code: 'admin_publish_bundle_incomplete' }];
  }
  if (adminTransitionTargetsSuspendido(fromEstado, toEstado)) {
    return isAdminSuspendBundle(nextDoc) ? [] : [{ code: 'admin_suspend_bundle_incomplete' }];
  }
  return [];
}

export function isPerfilPublicoPredicate(perfil, nowMs) {
  if (!perfil || typeof perfil !== 'object') return false;
  if (hasForbiddenPerfilField(perfil)) return false;
  if (perfil.suspendido === true || perfil.eliminado === true || perfil.vencido === true) return false;
  if (perfil.visible !== true || perfil.publicado !== true || perfil.tienePerfilPublico !== true) return false;

  const estado = normalizeEstadoPublicacionLectura(perfil.estadoPublicacion);
  if (estado !== 'publicado') return false;

  if (perfil.fechaVencimiento != null && nowMs != null) {
    const v = perfil.fechaVencimiento;
    const ms = typeof v === 'number' ? v : (v.toMillis ? v.toMillis() : Date.parse(v));
    if (!Number.isNaN(ms) && ms <= nowMs) return false;
  }
  return true;
}

export function esPerfilPublicoLegacy(data, nowMs) {
  if (!data || typeof data !== 'object') return false;
  const venc = data.fechaVencimiento;
  let vigente = true;
  if (venc != null && nowMs != null) {
    const ms = typeof venc === 'number' ? venc : (venc.toMillis ? venc.toMillis() : Date.parse(venc));
    vigente = Number.isNaN(ms) || ms > nowMs;
  }
  return data.aprobado === true && data.activo === true && data.vencido !== true && vigente;
}

/** Map legacy usuarios/{uid} monolith → canonical perfiles/{perfilId} shape (ETL). */
export function mapLegacyUsuarioToPerfil(uid, data, opts) {
  opts = opts || {};
  const nowMs = opts.nowMs != null ? opts.nowMs : Date.now();
  const esPublico = esPerfilPublicoLegacy(data, nowMs);
  const estadoPublicacion = mapLegacyEstadoPublicacion(data);
  const visible = esPublico;
  const publicado = esPublico;
  const tienePerfilPublico = esPublico;

  const perfil = {
    perfilId: uid,
    usuarioId: uid,
    ownerUid: uid,
    alias: data.nombre ?? null,
    tipoPerfil: data.tipoPerfil ?? null,
    arquetipo: data.arquetipo ?? null,
    sectorId: data.sectorId ?? null,
    subcategoriaId: data.subcategoriaId ?? null,
    formularioId: data.formularioId ?? null,
    geo: data.geo ?? null,
    descripcion: data.descripcion ?? null,
    fotos: data.fotos ?? null,
    estadoPublicacion,
    visible,
    publicado,
    tienePerfilPublico,
    suspendido: false,
    eliminado: false,
    vencido: estadoPublicacion === 'vencido' || data.vencido === true,
    schemaVersion: data.schemaVersion ?? 'blk05-perfil@1.0.0',
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null
  };

  if (data.fechaVencimiento != null) {
    perfil.fechaVencimiento = data.fechaVencimiento;
  }

  return perfil;
}

export function mapLegacyEstadoPublicacion(data) {
  if (!data || typeof data !== 'object') return 'borrador';
  if (data.vencido === true) return 'vencido';
  if (data.aprobado === true && data.activo === true) return 'publicado';
  if (data.estadoRevision === 'actualizacion_pendiente') return 'pendiente';
  if (data.estadoRevision === 'registro_pendiente') return 'borrador';
  const rev = data.estadoRevision;
  if (rev === 'correccion_solicitada' || rev === 'actualizacion_pendiente') return 'pendiente';
  return rev ?? 'borrador';
}

export function validatePerfilContract(perfil) {
  const issues = [];
  if (!perfil || typeof perfil !== 'object') {
    return [{ code: 'invalid_doc', message: 'not an object' }];
  }
  for (const f of PERFIL_REQUIRED_FIELDS) {
    if (perfil[f] === undefined || perfil[f] === null) {
      issues.push({ code: 'required_missing', field: f });
    }
  }
  if (perfil.perfilId != null && perfil.ownerUid != null && perfil.usuarioId != null) {
    if (String(perfil.ownerUid) !== String(perfil.usuarioId)) {
      issues.push({ code: 'owner_usuario_mismatch' });
    }
  }
  const forbidden = forbiddenFieldsOnPerfil(perfil);
  if (forbidden.length) {
    issues.push({ code: 'forbidden_field', fields: forbidden });
  }
  if (perfil.estadoPublicacion != null && !ESTADOS_CANONICOS.includes(perfil.estadoPublicacion)) {
    if (!ESTADOS_COMPAT_LECTURA[perfil.estadoPublicacion]) {
      issues.push({ code: 'invalid_estado', value: perfil.estadoPublicacion });
    }
  }
  return issues;
}

export function hubBridgeFlatOwnsPerfil(hubData, perfilId) {
  if (!hubData || typeof hubData !== 'object' || !perfilId) return false;
  const detalle = hubData.perfilesDetalle;
  if (!detalle || typeof detalle !== 'object') return false;
  if (!Object.prototype.hasOwnProperty.call(detalle, perfilId)) return false;
  if (hubData.perfilActivoId === perfilId) return true;
  return Object.prototype.hasOwnProperty.call(detalle, perfilId);
}

export function hubBridgeNestedOwnsPerfil(hubData, perfilId) {
  if (!hubData || typeof hubData !== 'object' || !perfilId) return false;
  const perfil = hubData.perfil;
  if (!perfil || typeof perfil !== 'object') return false;
  if (perfil.perfilPrincipalId === perfilId) return true;
  const ids = perfil.perfilIds;
  return Array.isArray(ids) && ids.includes(perfilId);
}
