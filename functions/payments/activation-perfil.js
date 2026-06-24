'use strict';

const { contratoIdFor, calcularVigencia, toDate } = require('./activation-utils');

function buildPerfilActivationWrites(orden, contexto, vigencia) {
  const perfilId = orden.scopedPerfilId;
  const uid = orden.uid;
  const contratoId = contratoIdFor(orden);
  const now = new Date();

  const contrato = {
    usuarioId: uid,
    perfilId: perfilId,
    planContratado: orden.planId,
    periodoContratado: orden.periodo,
    estadoContrato: 'activo',
    origenPlan: orden.origenPlan,
    fechaInicio: vigencia.fechaInicio,
    fechaVencimiento: vigencia.fechaVencimiento,
    ordenActivacionId: orden.ordenId,
    precioContratado: orden.precioSnapshot && orden.precioSnapshot.precioContratado,
    versionPrecio: orden.precioSnapshot && orden.precioSnapshot.versionPrecio,
    promocionSnapshot: orden.promocionSnapshot || null,
    entitlementsSnapshot: orden.entitlementsSnapshot || null,
    activadoPor: contexto.origen,
    ultimaActivacionIdempotencyKey: contexto.idempotencyKey,
    creadoEn: now,
    actualizadoEn: now,
  };

  const mirrorPatch = {
    pagado: true,
    activo: true,
    aprobado: true,
    vencido: false,
    autorizadoParaPago: false,
    estadoPago: 'pagado',
    estadoRevision: 'aprobado',
    actualizacionPendiente: false,
    fechaPublicacion: orden.tipoOperacion === 'renovacion' ? undefined : now,
    fechaVencimiento: vigencia.fechaVencimiento,
    planIdActivo: orden.planId,
    contratoActivoId: contratoId,
    ultimaOrdenActivacionId: orden.ordenId,
    ultimoPagoMonto: orden.montoMXN,
    ultimoPagoMetodo: contexto.origen,
    ultimoPagoFecha: now.toISOString(),
  };

  Object.keys(mirrorPatch).forEach((k) => {
    if (mirrorPatch[k] === undefined) delete mirrorPatch[k];
  });

  const usagePath = 'perfiles/' + perfilId + '/usage/current';
  const usageDoc = {
    planId: orden.entitlementsSnapshot && orden.entitlementsSnapshot.planId,
    entitlementsPlanId: orden.entitlementsSnapshot && orden.entitlementsSnapshot.entitlementsPlanId,
    limites: orden.entitlementsSnapshot && orden.entitlementsSnapshot.limites,
    versionEntitlements: orden.entitlementsSnapshot && orden.entitlementsSnapshot.versionEntitlements,
    initDesdeOrden: orden.ordenId,
    actualizadoEn: now,
  };

  return {
    contratoId,
    contratoPath: 'contratos_perfiles/' + contratoId,
    contrato,
    usuarioPath: 'usuarios/' + uid,
    perfilId,
    mirrorPatch,
    usagePath,
    usageDoc,
  };
}

function validatePerfilPreconditions(orden, usuarioDoc) {
  if (!orden.scopedPerfilId) {
    return { ok: false, code: 'SCOPED_INVALIDO', error: 'scopedPerfilId requerido' };
  }
  if (!usuarioDoc) {
    return { ok: false, code: 'SCOPED_INVALIDO', error: 'usuario no encontrado' };
  }
  const det = (usuarioDoc.perfilesDetalle || {})[orden.scopedPerfilId];
  if (!det) {
    return { ok: false, code: 'SCOPED_INVALIDO', error: 'perfil no en cuenta' };
  }
  if (orden.tipoOperacion === 'alta') {
    const venc = toDate(det.fechaVencimiento);
    if (det.activo === true && det.pagado === true && venc && venc > new Date()) {
      return { ok: false, code: 'CONFLICTO_VIGENCIA', error: 'perfil ya activo' };
    }
  }
  const puedePagar = det.autorizadoParaPago === true
    || det.estadoRevision === 'autorizado_para_pago'
    || det.estadoRevision === 'autorizado_pago';
  if (orden.tipoOperacion !== 'renovacion' && !puedePagar) {
    return { ok: false, code: 'PRODUCTO_NO_AUTORIZADO_PAGO', error: 'perfil no autorizado para pago' };
  }
  return { ok: true, perfilDetalle: det };
}

module.exports = {
  buildPerfilActivationWrites,
  validatePerfilPreconditions,
};
