'use strict';

const PERIODOS = { semanal: 0.35, quincenal: 0.65, mensual: 1 };
const REDONDEO = 50;

function roundTo50(n) {
  return Math.round(Number(n) / REDONDEO) * REDONDEO;
}

function specificityScore(scope, ctx) {
  if (!scope || !ctx) return 0;
  let score = 0;
  if (scope.subcategoriaId && scope.subcategoriaId === ctx.subcategoriaId) score += 64;
  if (scope.sectorId && scope.sectorId === ctx.sectorId) score += 32;
  if (scope.formularioId && scope.formularioId === ctx.formularioId) score += 16;
  if (scope.ciudad && scope.ciudad === ctx.ciudad) score += 8;
  if (scope.estado && scope.estado === ctx.estado) score += 4;
  if (scope.pais && scope.pais === ctx.pais) score += 2;
  return score;
}

function pickBestOverride(overrides, ctx, planId) {
  if (!Array.isArray(overrides) || !overrides.length) return null;
  let best = null;
  let bestScore = -1;
  for (const o of overrides) {
    if (!o || o.activo === false) continue;
    if (o.planId && o.planId !== planId) continue;
    const score = specificityScore(o.scope, ctx);
    if (score > bestScore) {
      bestScore = score;
      best = o;
    }
  }
  return bestScore > 0 ? best : null;
}

function baseMensual(config, formularioId, planId) {
  const porForm = config.preciosBase && config.preciosBase.porFormulario;
  const global = config.preciosBase && config.preciosBase.global;
  if (porForm && formularioId && porForm[formularioId] && porForm[formularioId][planId] != null) {
    return porForm[formularioId][planId];
  }
  if (global && global[planId] != null) return global[planId];
  throw new Error('PRICE_BASE_NOT_FOUND: ' + planId + ' / ' + formularioId);
}

/**
 * @param {object} input
 * @param {'perfil'|'banner'|'estado'|'live'} input.tipoProducto
 * @param {string} [input.planId]
 * @param {string} [input.formularioId]
 * @param {string} [input.periodo]
 * @param {object} input.config — precios fixture
 * @param {object[]} [input.overrides]
 * @param {object} [input.scope]
 * @param {number} [input.precioBannerBase] — banner slot base MXN
 * @param {boolean} [input.incluyeVideo] — estado/live: precio ×2
 */
function resolvePrice(input) {
  input = input || {};
  const tipo = input.tipoProducto || 'perfil';
  const periodo = input.periodo || 'mensual';
  const factor = PERIODOS[periodo];
  if (factor == null) throw new Error('PERIODO_INVALIDO: ' + periodo);

  let base = 0;
  let overrideAplicado = null;

  if (tipo === 'perfil') {
    const planId = input.planId;
    if (!planId) throw new Error('PLAN_ID_REQUERIDO');
    if (planId === 'trial_profesional') {
      return {
        montoFinal: 0,
        moneda: 'MXN',
        planId,
        periodo,
        formularioId: input.formularioId || null,
        overrideAplicado: null,
        versionPrecio: input.config.versionPrecio || 'fixture',
        desglose: { baseMensual: 0, factorPeriodo: factor, redondeo: REDONDEO, ivaIncluido: true },
      };
    }
    base = baseMensual(input.config, input.formularioId, planId);
    overrideAplicado = pickBestOverride(input.overrides, input.scope || {}, planId);
    if (overrideAplicado) {
      if (overrideAplicado.modoPrecio === 'manual' && overrideAplicado.precioMensualBase != null) {
        base = overrideAplicado.precioMensualBase;
      } else if (overrideAplicado.precioMensualBase != null) {
        base = overrideAplicado.precioMensualBase;
      }
    }
  } else if (tipo === 'banner') {
    base = Number(input.precioBannerBase);
    if (!Number.isFinite(base) || base <= 0) throw new Error('PRECIO_BANNER_REQUERIDO');
  } else if (tipo === 'estado' || tipo === 'live') {
    base = Number(input.precioUnitarioBase);
    if (!Number.isFinite(base) || base <= 0) throw new Error('PRECIO_UNITARIO_REQUERIDO');
    if (input.incluyeVideo) base *= 2;
  } else {
    throw new Error('TIPO_PRODUCTO_INVALIDO: ' + tipo);
  }

  const bruto = base * factor;
  const montoFinal = factor === 1 ? base : roundTo50(bruto);

  return {
    montoFinal,
    moneda: 'MXN',
    planId: input.planId || null,
    periodo,
    formularioId: input.formularioId || null,
    overrideAplicado: overrideAplicado ? overrideAplicado.id || 'override' : null,
    versionPrecio: input.config.versionPrecio || 'fixture',
    desglose: {
      baseMensual: base,
      factorPeriodo: factor,
      bruto,
      redondeo: REDONDEO,
      ivaIncluido: true,
      videoMultiplicador: input.incluyeVideo ? 2 : 1,
    },
  };
}

module.exports = {
  PERIODOS,
  REDONDEO,
  roundTo50,
  resolvePrice,
};
