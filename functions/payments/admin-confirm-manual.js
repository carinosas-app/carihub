'use strict';

const { markOrdenPagada } = require('./persist-orden');
const { activateFromOrden } = require('./activation-service');

async function confirmManualPago(store, ordenId, adminContext) {
  adminContext = adminContext || {};
  const adminEmail = adminContext.adminEmail || adminContext.actorId;
  if (!adminEmail) {
    return { ok: false, codigo: 'ERROR_TRANSACCION', error: 'adminEmail requerido' };
  }
  if (!store || typeof store.getOrden !== 'function') {
    return { ok: false, codigo: 'ERROR_TRANSACCION', error: 'store invalido' };
  }

  const orden = await store.getOrden(ordenId);
  if (!orden) {
    return { ok: false, codigo: 'ORDEN_NO_ENCONTRADA', error: 'orden no existe' };
  }

  if (orden.estado === 'pendiente') {
    const pagada = markOrdenPagada(orden, {
      proveedor: 'manual_admin',
      paidAt: new Date(),
    });
    await store.setOrden(ordenId, pagada);
  } else if (orden.estado !== 'pagado') {
    return {
      ok: false,
      codigo: 'ORDEN_NO_PAGADA',
      error: 'orden en estado ' + orden.estado,
    };
  }

  const idempotencyKey = adminContext.idempotencyKey || ('admin:' + ordenId);
  return activateFromOrden(store, ordenId, {
    origen: 'admin_manual',
    actorId: adminEmail,
    idempotencyKey: idempotencyKey,
    montoConfirmadoMXN: adminContext.montoConfirmadoMXN != null
      ? adminContext.montoConfirmadoMXN
      : orden.montoMXN,
    timestamp: new Date(),
  });
}

module.exports = {
  confirmManualPago,
};
