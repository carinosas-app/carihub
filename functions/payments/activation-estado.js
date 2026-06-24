'use strict';

function buildEstadoActivationWrites(orden, contexto, vigencia, solicitud) {
  const scopedId = orden.scopedEstadoId || orden.scopedBannerId;
  const now = new Date();
  return {
    solicitudPath: 'solicitudes_anuncios/' + scopedId,
    mirrorSolicitud: {
      estadoRevision: 'publicado',
      activo: true,
      pagado: true,
      estadoPago: 'confirmado',
      fechaVencimiento: vigencia.fechaVencimiento,
      ultimaOrdenActivacionId: orden.ordenId,
      actualizadoEn: now,
      actualizadoPor: contexto.actorId || contexto.origen,
    },
    auditNote: 'ESTADO_MVP_STUB',
  };
}

function validateEstadoPreconditions(orden, solicitud) {
  const scopedId = orden.scopedEstadoId || orden.scopedBannerId;
  if (!scopedId) {
    return { ok: false, code: 'SCOPED_INVALIDO', error: 'scopedEstadoId requerido' };
  }
  if (!solicitud) {
    return { ok: false, code: 'SCOPED_INVALIDO', error: 'solicitud estado no encontrada' };
  }
  return { ok: true };
}

module.exports = {
  buildEstadoActivationWrites,
  validateEstadoPreconditions,
};
