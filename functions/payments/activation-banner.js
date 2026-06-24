'use strict';

const { assertSlotIdValido } = require('./slot-inventory');
const {
  contratoIdFor,
  normalizeEstadoBanner,
  imagenPublicaBanner,
  urlPublicaBanner,
} = require('./activation-utils');

function buildBannerActivationWrites(orden, contexto, vigencia, solicitud) {
  const contratoId = contratoIdFor(orden);
  const now = new Date();
  const slotId = orden.scopedSlotId || solicitud.slotId;

  const contrato = {
    usuarioId: orden.uid,
    anuncianteId: solicitud.uidAnunciante || orden.uid,
    solicitudId: orden.scopedBannerId,
    slotId: slotId,
    periodoContratado: orden.periodo,
    estadoContrato: 'activo',
    fechaInicio: vigencia.fechaInicio,
    fechaVencimiento: vigencia.fechaVencimiento,
    ordenActivacionId: orden.ordenId,
    precioContratado: orden.precioSnapshot && orden.precioSnapshot.precioContratado,
    promocionSnapshot: orden.promocionSnapshot || null,
    activadoPor: contexto.origen,
    ultimaActivacionIdempotencyKey: contexto.idempotencyKey,
    creadoEn: now,
    actualizadoEn: now,
  };

  const mirrorSolicitud = {
    estado: 'activo',
    estadoRevision: 'publicado',
    estadoPago: 'confirmado',
    activo: true,
    aprobado: true,
    autorizadoParaPago: false,
    fechaVencimiento: vigencia.fechaVencimiento,
    contratoActivoId: contratoId,
    ultimaOrdenActivacionId: orden.ordenId,
    actualizadoEn: now,
    actualizadoPor: contexto.actorId || contexto.origen,
  };

  const imagen = imagenPublicaBanner(solicitud);
  let bannersActivosPatch = null;
  let auditWarning = null;

  if (imagen && slotId) {
    bannersActivosPatch = {
      path: 'configuracion_publicidad/banners_activos',
      merge: true,
      data: {
        slots: {},
        actualizadoEn: now,
        actualizadoPor: contexto.actorId || 'activation-service',
      },
    };
    bannersActivosPatch.data.slots[slotId] = {
      imagen: imagen,
      url: urlPublicaBanner(solicitud),
      titulo: solicitud.nombreNegocio || solicitud.nombre || '',
      solicitudId: orden.scopedBannerId,
      actualizadoEn: now,
    };
  } else {
    auditWarning = 'BANNER_SIN_IMAGEN_PUBLICA';
  }

  return {
    contratoId,
    contratoPath: 'contratos_banners/' + contratoId,
    contrato,
    solicitudPath: 'solicitudes_anuncios/' + orden.scopedBannerId,
    mirrorSolicitud,
    bannersActivosPatch,
    auditWarning,
  };
}

function validateBannerPreconditions(orden, solicitud) {
  if (!orden.scopedBannerId) {
    return { ok: false, code: 'SCOPED_INVALIDO', error: 'scopedBannerId requerido' };
  }
  if (!solicitud) {
    return { ok: false, code: 'SCOPED_INVALIDO', error: 'solicitud no encontrada' };
  }
  const uid = solicitud.uidAnunciante || solicitud.uid;
  if (uid && uid !== orden.uid) {
    return { ok: false, code: 'SCOPED_INVALIDO', error: 'uid no coincide' };
  }
  const slotId = orden.scopedSlotId || solicitud.slotId;
  if (slotId) {
    const slotVal = assertSlotIdValido(slotId);
    if (!slotVal.ok) {
      return { ok: false, code: 'SLOT_INVALIDO', error: slotVal.error };
    }
  }
  const norm = normalizeEstadoBanner(solicitud);
  const okEstados = ['autorizado_para_pago', 'pago_confirmado'];
  if (orden.tipoOperacion !== 'renovacion' && okEstados.indexOf(norm) < 0) {
    return { ok: false, code: 'PRODUCTO_NO_AUTORIZADO_PAGO', error: 'banner no autorizado para pago' };
  }
  if (orden.tipoOperacion === 'alta' && solicitud.activo === true && solicitud.estado === 'activo') {
    const venc = solicitud.fechaVencimiento && solicitud.fechaVencimiento.toDate
      ? solicitud.fechaVencimiento.toDate()
      : new Date(solicitud.fechaVencimiento);
    if (venc > new Date()) {
      return { ok: false, code: 'CONFLICTO_VIGENCIA', error: 'banner ya activo' };
    }
  }
  return { ok: true, solicitud };
}

module.exports = {
  buildBannerActivationWrites,
  validateBannerPreconditions,
};
