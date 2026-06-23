'use strict';

const TRIAL_PLAN_ID = 'trial_profesional';
const TRIAL_ENTITLEMENTS_PLAN = 'destacado';

function deepMerge(base, delta) {
  if (!delta) return base;
  const out = Object.assign({}, base);
  for (const key of Object.keys(delta)) {
    const v = delta[key];
    if (v && typeof v === 'object' && !Array.isArray(v) && typeof out[key] === 'object' && out[key]) {
      out[key] = deepMerge(out[key], v);
    } else {
      out[key] = v;
    }
  }
  return out;
}

function planLimitsFromConfig(config, planId) {
  const planes = config.planesBase || config.planes || {};
  let effectivePlanId = planId;
  if (planId === TRIAL_PLAN_ID) {
    const trial = planes[TRIAL_PLAN_ID];
    if (trial && trial.limites) return Object.assign({}, trial.limites);
    effectivePlanId = TRIAL_ENTITLEMENTS_PLAN;
  }
  const plan = planes[effectivePlanId];
  if (!plan || !plan.limites) throw new Error('PLAN_ENTITLEMENTS_NOT_FOUND: ' + planId);
  return Object.assign({}, plan.limites);
}

function pickCategoryOverride(overrides, ctx) {
  if (!Array.isArray(overrides)) return null;
  let best = null;
  let bestScore = -1;
  for (const o of overrides) {
    if (!o || !o.scope) continue;
    let score = 0;
    const s = o.scope;
    if (s.subcategoriaId && s.subcategoriaId === ctx.subcategoriaId) score += 64;
    else if (s.subcategoriaId) continue;
    if (s.sectorId && s.sectorId === ctx.sectorId) score += 32;
    else if (s.sectorId) continue;
    if (s.formularioId && s.formularioId === ctx.formularioId) score += 16;
    else if (s.formularioId) continue;
    if (s.arquetipo && s.arquetipo === ctx.arquetipo) score += 8;
    if (score > bestScore) {
      bestScore = score;
      best = o;
    }
  }
  return best;
}

/**
 * @param {object} input
 * @param {string} input.planId
 * @param {object} input.config — entitlements fixture
 * @param {object[]} [input.overridesCategoria]
 * @param {object} [input.excepcionPerfil]
 * @param {object} [input.scope]
 */
function resolveEntitlements(input) {
  input = input || {};
  const planId = input.planId;
  if (!planId) throw new Error('PLAN_ID_REQUERIDO');

  let limites = planLimitsFromConfig(input.config, planId);
  const catOverride = pickCategoryOverride(input.overridesCategoria, input.scope || {});
  if (catOverride && catOverride.limitesDelta) {
    limites = deepMerge(limites, catOverride.limitesDelta);
  }
  if (input.excepcionPerfil && input.excepcionPerfil.limitesDelta) {
    limites = deepMerge(limites, input.excepcionPerfil.limitesDelta);
  }

  const entitlementsPlanId = planId === TRIAL_PLAN_ID ? TRIAL_ENTITLEMENTS_PLAN : planId;

  return {
    planId,
    entitlementsPlanId,
    limites,
    planMinimoRequerido: catOverride && catOverride.planMinimoRequerido
      ? catOverride.planMinimoRequerido
      : null,
    overrideCategoriaId: catOverride ? catOverride.id || null : null,
    versionEntitlements: input.config.version || 'fixture',
  };
}

module.exports = {
  TRIAL_PLAN_ID,
  TRIAL_ENTITLEMENTS_PLAN,
  deepMerge,
  resolveEntitlements,
};
