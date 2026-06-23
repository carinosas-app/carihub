'use strict';

function filterActivePromos(promos, ctx) {
  if (!Array.isArray(promos)) return [];
  return promos.filter((p) => {
    if (!p || p.activo === false) return false;
    const scope = p.scope || {};
    if (scope.formularioId && scope.formularioId !== ctx.formularioId) return false;
    if (scope.sectorId && scope.sectorId !== ctx.sectorId) return false;
    if (scope.subcategoriaId && scope.subcategoriaId !== ctx.subcategoriaId) return false;
    return true;
  });
}

/**
 * Perfil promos: trial, referido invitado (+7d).
 * @param {object} input
 * @param {object} input.config — promos fixture
 * @param {object} input.scope — formularioId, etc.
 * @param {boolean} [input.esAprobacionAdmin]
 * @param {boolean} [input.tieneCodigoReferido]
 */
function resolvePromoPerfil(input) {
  input = input || {};
  const ctx = input.scope || {};
  const activas = filterActivePromos(input.config && input.config.promociones, ctx);
  const trial = activas.find((p) => p.tipo === 'primer_mes_gratis' || p.promocionId === 'primer_mes_gratis');
  if (!trial || !input.esAprobacionAdmin) return null;

  let diasGratis = (trial.beneficio && trial.beneficio.diasGratis) || 30;
  const promocionId = trial.promocionId || 'primer_mes_gratis';
  const extras = [];

  if (input.tieneCodigoReferido) {
    const refInv = activas.find((p) => p.promocionId === 'referido_invitado' || p.tipo === 'dias_extra_trial');
    if (refInv) {
      const extra = refInv.diasExtra || 7;
      diasGratis += extra;
      extras.push({ promocionId: 'referido_invitado', diasExtra: extra });
    }
  }

  return {
    promocionId,
    versionPromocion: trial.version || 'fixture',
    tipo: 'primer_mes_gratis',
    planIdContrato: trial.planIdContrato || 'trial_profesional',
    planEfectivo: trial.planEfectivo || 'destacado',
    diasGratis,
    precioFinal: 0,
    origenPlan: input.tieneCodigoReferido ? 'referido' : 'trial',
    extras,
    congelada: true,
  };
}

/**
 * Banner promos: duplicar tiempo, etc.
 */
function resolvePromoBanner(input) {
  input = input || {};
  const promos = (input.config && input.config.promociones) || [];
  const activa = promos.find((p) => p.activo !== false && p.tipo === 'duplicar_tiempo');
  if (!activa) return null;
  const diasContratados = Number(input.diasContratados) || 30;
  const row = (activa.tabla || []).find((r) => r.diasContratados === diasContratados);
  const diasBonificados = row ? row.diasBonificados : diasContratados;
  return {
    promocionId: activa.id || 'banner_tiempo_igual_gratis',
    versionPromocion: activa.version || 'fixture',
    tipo: 'duplicar_tiempo',
    diasPagados: diasContratados,
    diasBonificados,
    diasTotales: diasContratados + diasBonificados,
    congelada: true,
  };
}

/**
 * Referidor reward schema-only (acreditación ECO-030).
 */
function resolveReferidorRecompensaSchema(input) {
  input = input || {};
  return {
    promocionId: 'referido_referidor',
    diasExtraVigencia: 15,
    topesAnuales: { recompensasMax: 6, diasMax: 90 },
    ventanaPrimerPagoDias: 90,
    estado: input.estado || 'pendiente',
    acreditacion: 'ECO-030',
    nota: 'Sin acreditación en Bloque 1',
  };
}

function resolvePromo(input) {
  const tipo = (input && input.tipoProducto) || 'perfil';
  if (tipo === 'banner') return resolvePromoBanner(input);
  return resolvePromoPerfil(input);
}

module.exports = {
  resolvePromo,
  resolvePromoPerfil,
  resolvePromoBanner,
  resolveReferidorRecompensaSchema,
};
