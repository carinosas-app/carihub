'use strict';

const { montoEsSuficiente, calcularVigencia, toDate } = require('./activation-utils');
const {
  buildPerfilActivationWrites,
  validatePerfilPreconditions,
} = require('./activation-perfil');
const {
  buildBannerActivationWrites,
  validateBannerPreconditions,
} = require('./activation-banner');
const {
  buildEstadoActivationWrites,
  validateEstadoPreconditions,
} = require('./activation-estado');
const {
  buildLiveActivationWrites,
  validateLivePreconditions,
} = require('./activation-live');

function fail(code, error, retryable) {
  return {
    ok: false,
    codigo: code,
    error: error || code,
    retryable: retryable === true,
  };
}

function success(payload) {
  return Object.assign({ ok: true }, payload);
}

async function activateFromOrden(store, ordenId, contextoActivacion) {
  contextoActivacion = contextoActivacion || {};
  if (!store || typeof store.getOrden !== 'function') {
    return fail('ERROR_TRANSACCION', 'store invalido');
  }
  if (!ordenId) return fail('ORDEN_NO_ENCONTRADA', 'ordenId requerido');
  if (!contextoActivacion.origen || !contextoActivacion.idempotencyKey) {
    return fail('ERROR_TRANSACCION', 'contextoActivacion incompleto');
  }

  const orden = await store.getOrden(ordenId);
  if (!orden) return fail('ORDEN_NO_ENCONTRADA', 'orden no existe');

  if (orden.estado !== 'pagado') {
    return fail('ORDEN_NO_PAGADA', 'orden debe estar pagada');
  }

  if (orden.activacionCompleta === true) {
    if (orden.ultimaActivacionIdempotencyKey === contextoActivacion.idempotencyKey) {
      return success({
        codigo: 'YA_ACTIVADO',
        ordenId: ordenId,
        tipoProducto: orden.tipoProducto,
        contratoId: orden.contratoId || null,
        scopedId: orden.scopedPerfilId || orden.scopedBannerId,
        mirrorActualizado: true,
      });
    }
    return success({
      codigo: 'YA_ACTIVADO',
      ordenId: ordenId,
      tipoProducto: orden.tipoProducto,
      contratoId: orden.contratoId,
      scopedId: orden.scopedPerfilId || orden.scopedBannerId,
      mirrorActualizado: false,
    });
  }

  if (!montoEsSuficiente(orden, contextoActivacion.montoConfirmadoMXN)) {
    return fail('MONTO_INSUFICIENTE', 'monto confirmado menor al snapshot');
  }

  const tipo = orden.tipoProducto;
  let plan = null;
  let auditWarning = null;

  if (tipo === 'perfil') {
    const usuario = await store.getDoc('usuarios/' + orden.uid);
    const pre = validatePerfilPreconditions(orden, usuario);
    if (!pre.ok) return fail(pre.code, pre.error);
    const vig = calcularVigencia(orden, pre.perfilDetalle && pre.perfilDetalle.fechaVencimiento);
    if (!vig.ok) return fail(vig.code, 'conflicto vigencia perfil');
    plan = buildPerfilActivationWrites(orden, contextoActivacion, vig);
  } else if (tipo === 'banner') {
    const solicitud = await store.getDoc('solicitudes_anuncios/' + orden.scopedBannerId);
    const pre = validateBannerPreconditions(orden, solicitud);
    if (!pre.ok) return fail(pre.code, pre.error);
    const vig = calcularVigencia(orden, solicitud && solicitud.fechaVencimiento);
    if (!vig.ok) return fail(vig.code, 'conflicto vigencia banner');
    plan = buildBannerActivationWrites(orden, contextoActivacion, vig, solicitud);
    auditWarning = plan.auditWarning;
  } else if (tipo === 'estado') {
    const scopedId = orden.scopedEstadoId || orden.scopedBannerId;
    const solicitud = await store.getDoc('solicitudes_anuncios/' + scopedId);
    const pre = validateEstadoPreconditions(orden, solicitud);
    if (!pre.ok) return fail(pre.code, pre.error);
    const vig = calcularVigencia(orden, solicitud && solicitud.fechaVencimiento);
    if (!vig.ok) return fail(vig.code, 'conflicto vigencia estado');
    plan = buildEstadoActivationWrites(orden, contextoActivacion, vig, solicitud);
    auditWarning = plan.auditNote;
  } else if (tipo === 'live') {
    const scopedId = orden.scopedLiveId || orden.scopedBannerId;
    const solicitud = await store.getDoc('solicitudes_anuncios/' + scopedId);
    const pre = validateLivePreconditions(orden, solicitud);
    if (!pre.ok) return fail(pre.code, pre.error);
    const vig = calcularVigencia(orden, solicitud && solicitud.fechaFin || solicitud && solicitud.fechaVencimiento);
    if (!vig.ok) return fail(vig.code, 'conflicto vigencia live');
    plan = buildLiveActivationWrites(orden, contextoActivacion, vig, solicitud);
    auditWarning = plan.auditNote;
  } else {
    return fail('SCOPED_INVALIDO', 'tipoProducto desconocido');
  }

  const activacionId = 'act_' + ordenId;
  const ordenPatch = {
    activacionCompleta: true,
    activadoEn: new Date(),
    activadoPor: contextoActivacion.origen,
    contratoId: plan.contratoId || null,
    ultimaActivacionIdempotencyKey: contextoActivacion.idempotencyKey,
    fechaVencimientoAplicada: plan.contrato && plan.contrato.fechaVencimiento
      || (plan.mirrorSolicitud && plan.mirrorSolicitud.fechaVencimiento),
    tipoOperacionAplicada: orden.tipoOperacion || 'alta',
  };

  try {
    await store.runActivationTransaction({
      ordenId,
      ordenPrecondition: { activacionCompleta: false },
      ordenPatch,
      plan,
      tipo,
      activacionId,
      contextoActivacion,
      auditWarning,
    });
  } catch (e) {
    if (e && e.code === 'YA_ACTIVADO') {
      return success({
        codigo: 'YA_ACTIVADO',
        ordenId,
        tipoProducto: tipo,
        contratoId: orden.contratoId,
        mirrorActualizado: false,
      });
    }
    return fail('ERROR_TRANSACCION', e.message, true);
  }

  return success({
    codigo: orden.tipoOperacion === 'renovacion' ? 'RENOVADO' : 'ACTIVADO',
    ordenId,
    tipoProducto: tipo,
    contratoId: plan.contratoId || null,
    scopedId: orden.scopedPerfilId || orden.scopedBannerId || orden.scopedEstadoId || orden.scopedLiveId,
    fechaVencimiento: ordenPatch.fechaVencimientoAplicada,
    activacionId,
    mirrorActualizado: true,
    auditWarning: auditWarning || null,
  });
}

module.exports = {
  activateFromOrden,
};
