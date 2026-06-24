'use strict';

const ESTADOS = ['pendiente', 'pagado', 'fallido', 'vencido', 'cancelado'];
const TIPOS = ['perfil', 'banner', 'estado', 'live'];

function validateOrdenSchema(doc) {
  doc = doc || {};
  const errors = [];

  if (!doc.uid || typeof doc.uid !== 'string') errors.push('uid requerido');
  if (!doc.tipoProducto || TIPOS.indexOf(doc.tipoProducto) < 0) {
    errors.push('tipoProducto invalido');
  }
  if (!doc.estado || ESTADOS.indexOf(doc.estado) < 0) errors.push('estado invalido');
  if (typeof doc.montoMXN !== 'number' || doc.montoMXN < 0) errors.push('montoMXN invalido');
  if (doc.moneda && doc.moneda !== 'MXN') errors.push('moneda debe ser MXN');
  if (doc.tipoProducto === 'perfil' && doc.planId == null && doc.estado === 'pendiente') {
    errors.push('planId recomendado para perfil');
  }
  if (doc.tipoProducto === 'banner' && !doc.scopedSlotId && !doc.scopedBannerId) {
    errors.push('banner requiere scopedSlotId o scopedBannerId');
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

function toFirestoreOrdenDoc(snapshot) {
  snapshot = snapshot || {};
  const out = Object.assign({}, snapshot);
  delete out._bloque1;
  if (typeof out.createdAt === 'string') {
    out.createdAt = out.createdAt;
  }
  return out;
}

module.exports = {
  ESTADOS,
  TIPOS,
  validateOrdenSchema,
  toFirestoreOrdenDoc,
};
