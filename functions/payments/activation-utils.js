'use strict';

const MAP_BANNER_LEGACY = {
  pendiente: 'enviado_revision',
  en_revision: 'enviado_revision',
  requiere_correccion: 'correccion_solicitada',
  autorizado_pago: 'autorizado_para_pago',
  activo: 'publicado',
  rechazado: 'rechazado',
  vencido: 'vencido',
  revision_soporte: 'enviado_revision',
  sin_revisar: 'enviado_revision',
  pago_confirmado: 'pago_confirmado',
};

function diasPorPeriodo(periodo) {
  const p = String(periodo || 'mensual').toLowerCase();
  if (p === 'semanal' || p === 'semana') return 7;
  if (p === 'quincenal' || p === 'quincena') return 15;
  return 30;
}

function addDays(date, days) {
  const d = new Date(date.getTime());
  d.setDate(d.getDate() + days);
  return d;
}

function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value.toDate === 'function') return value.toDate();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function calcularVigencia(orden, vigenciaActual) {
  const now = new Date();
  const actual = toDate(vigenciaActual);
  const base = orden.tipoOperacion === 'renovacion' && actual && actual > now ? actual : now;
  if (orden.tipoOperacion !== 'renovacion' && actual && actual > now) {
    return { ok: false, code: 'CONFLICTO_VIGENCIA' };
  }
  const fin = addDays(base, diasPorPeriodo(orden.periodo));
  return { ok: true, fechaInicio: now, fechaVencimiento: fin };
}

function contratoIdFor(orden) {
  const scoped = orden.tipoProducto === 'perfil'
    ? orden.scopedPerfilId
    : (orden.scopedBannerId || orden.scopedEstadoId || orden.scopedLiveId);
  return orden.tipoProducto + '_' + scoped + '_' + orden.ordenId;
}

function normalizeEstadoBanner(doc) {
  doc = doc || {};
  const raw = doc.estadoRevision || doc.estadoSolicitud || doc.estadoAdmin || doc.estado || '';
  return MAP_BANNER_LEGACY[raw] || raw;
}

function imagenPublicaBanner(solicitud) {
  const u = String(solicitud.imagenURL || solicitud.imagenPrincipalURL || '').trim();
  if (/^https?:\/\//i.test(u)) return u;
  return '';
}

function urlPublicaBanner(solicitud) {
  const link = String(solicitud.link || '').trim();
  if (/^https?:\/\//i.test(link)) return link;
  const cp = solicitud.contactoPublico || {};
  const web = String(cp.sitioWeb || cp.url || '').trim();
  if (/^https?:\/\//i.test(web)) return web;
  const wa = String(cp.whatsapp || solicitud.whatsapp || '').replace(/\D/g, '');
  if (wa) return 'https://wa.me/' + wa;
  return '';
}

function montoEsSuficiente(orden, montoConfirmadoMXN) {
  if (montoConfirmadoMXN == null) return true;
  const esperado = orden.precioSnapshot && orden.precioSnapshot.precioContratado != null
    ? orden.precioSnapshot.precioContratado
    : orden.montoMXN;
  return Number(montoConfirmadoMXN) >= Number(esperado);
}

module.exports = {
  MAP_BANNER_LEGACY,
  diasPorPeriodo,
  addDays,
  toDate,
  calcularVigencia,
  contratoIdFor,
  normalizeEstadoBanner,
  imagenPublicaBanner,
  urlPublicaBanner,
  montoEsSuficiente,
};
