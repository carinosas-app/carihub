'use strict';

const PLAN_ORDER = ['basico', 'destacado', 'premium', 'vip'];

const DEFAULT_MATRIX = {
  adultos: 'vip',
  persona_creador: 'vip',
  negocio_venue: 'vip',
  eventos: 'premium',
};

const SECTOR_MIN = {
  adultos: 'vip',
  eventos: 'premium',
};

/**
 * @param {string} planId
 * @param {object} ctx — formularioId, sectorId, subcategoriaId, overrides from config
 */
function assertPlanMinimo(planId, ctx, matrix) {
  ctx = ctx || {};
  matrix = matrix || DEFAULT_MATRIX;

  let required = null;
  if (ctx.subcategoriaId && matrix[ctx.subcategoriaId]) {
    required = matrix[ctx.subcategoriaId];
  } else if (ctx.sectorId && SECTOR_MIN[ctx.sectorId]) {
    required = SECTOR_MIN[ctx.sectorId];
  } else if (ctx.formularioId === 'adultos') {
    required = 'vip';
  }

  if (Array.isArray(ctx.overridesCategoria)) {
    for (const o of ctx.overridesCategoria) {
      if (!o.planMinimoRequerido) continue;
      if (o.scope && o.scope.sectorId && o.scope.sectorId !== ctx.sectorId) continue;
      if (o.scope && o.scope.subcategoriaId && o.scope.subcategoriaId !== ctx.subcategoriaId) continue;
      required = o.planMinimoRequerido;
    }
  }

  if (!required) {
    return { ok: true, planMinimoRequerido: null, planId };
  }

  const planIdx = PLAN_ORDER.indexOf(planId === 'trial_profesional' ? 'destacado' : planId);
  const reqIdx = PLAN_ORDER.indexOf(required);
  if (planIdx < 0 || reqIdx < 0) {
    return { ok: false, planMinimoRequerido: required, planId, code: 'PLAN_UNKNOWN' };
  }

  return {
    ok: planIdx >= reqIdx,
    planMinimoRequerido: required,
    planId,
    code: planIdx >= reqIdx ? 'OK' : 'PLAN_BELOW_MINIMUM',
  };
}

module.exports = {
  PLAN_ORDER,
  assertPlanMinimo,
};
