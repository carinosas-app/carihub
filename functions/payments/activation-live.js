'use strict';

function buildLiveActivationWrites(orden, contexto, vigencia, solicitud) {
  const scopedId = orden.scopedLiveId || orden.scopedBannerId;
  const now = new Date();
  return {
    solicitudPath: 'solicitudes_anuncios/' + scopedId,
    mirrorSolicitud: {
      estadoRevision: 'publicado',
      activo: true,
      pagado: true,
      estadoPago: 'confirmado',
      fechaFin: vigencia.fechaVencimiento,
      ultimaOrdenActivacionId: orden.ordenId,
      actualizadoEn: now,
      actualizadoPor: contexto.actorId || contexto.origen,
    },
    auditNote: 'LIVE_MVP_STUB',
  };
}

function validateLivePreconditions(orden, solicitud) {
  const scopedId = orden.scopedLiveId || orden.scopedBannerId;
  if (!scopedId) {
    return { ok: false, code: 'SCOPED_INVALIDO', error: 'scopedLiveId requerido' };
  }
  if (!solicitud) {
    return { ok: false, code: 'SCOPED_INVALIDO', error: 'solicitud live no encontrada' };
  }
  return { ok: true };
}

module.exports = {
  buildLiveActivationWrites,
  validateLivePreconditions,
};
