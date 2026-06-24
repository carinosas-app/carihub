'use strict';

const { validateOrdenSchema } = require('./validate-orden-schema');

function prepareOrdenForPersist(snapshot, ordenId) {
  snapshot = Object.assign({}, snapshot || {});
  const id = ordenId || snapshot.ordenId;
  if (!id) throw new Error('ORDEN_ID_REQUERIDO');

  delete snapshot._bloque1;
  delete snapshot.schemaValid;
  delete snapshot.schemaErrors;

  snapshot.ordenId = id;
  snapshot.tipoOperacion = snapshot.tipoOperacion || 'alta';
  snapshot.activacionCompleta = snapshot.activacionCompleta === true;
  snapshot.proveedor = snapshot.proveedor || null;
  snapshot.webhookId = snapshot.webhookId || null;

  if (typeof snapshot.createdAt === 'string') {
    snapshot.createdAt = new Date(snapshot.createdAt);
  }
  if (!snapshot.createdAt) {
    snapshot.createdAt = new Date();
  }

  const validation = validateOrdenSchema(snapshot);
  if (!validation.ok) {
    const err = new Error('ORDEN_SCHEMA_INVALIDA');
    err.code = 'ORDEN_SCHEMA_INVALIDA';
    err.details = validation.errors;
    throw err;
  }

  return snapshot;
}

function markOrdenPagada(orden, patch) {
  patch = patch || {};
  return Object.assign({}, orden, {
    estado: 'pagado',
    paidAt: patch.paidAt || new Date(),
    proveedor: patch.proveedor || orden.proveedor,
    webhookId: patch.webhookId != null ? patch.webhookId : orden.webhookId,
    idTransaccionPasarela: patch.idTransaccionPasarela || orden.idTransaccionPasarela || null,
  });
}

module.exports = {
  prepareOrdenForPersist,
  markOrdenPagada,
};
