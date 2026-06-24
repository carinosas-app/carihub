'use strict';

const { resolvePrice } = require('./pricing-resolver');
const { resolveEntitlements } = require('./entitlements-resolver');
const { resolvePromo } = require('./promo-resolver');
const { assertPlanMinimo } = require('./plan-minimo');
const { validateOrdenSchema } = require('./validate-orden-schema');

function buildOrdenPagoSnapshot(input) {
  input = input || {};
  const tipoProducto = input.tipoProducto || 'perfil';
  const planId = input.planId;
  const uid = input.uid;
  if (!uid) throw new Error('UID_REQUERIDO');

  const pricing = input.precioResuelto || resolvePrice({
    tipoProducto,
    planId,
    formularioId: input.formularioId,
    periodo: input.periodo || 'mensual',
    config: input.configPrecios,
    overrides: input.overridesPrecio,
    scope: input.scope,
    precioBannerBase: input.precioBannerBase,
    precioUnitarioBase: input.precioUnitarioBase,
    incluyeVideo: input.incluyeVideo,
  });

  const entitlements = input.entitlementsResueltos || (planId ? resolveEntitlements({
    planId: planId === 'trial_profesional' ? 'trial_profesional' : planId,
    config: input.configEntitlements,
    overridesCategoria: input.overridesCategoria,
    excepcionPerfil: input.excepcionPerfil,
    scope: input.scope,
  }) : null);

  const promo = input.promoResuelta !== undefined
    ? input.promoResuelta
    : resolvePromo({
      tipoProducto,
      config: input.configPromos,
      scope: input.scope,
      esAprobacionAdmin: input.esAprobacionAdmin,
      tieneCodigoReferido: input.tieneCodigoReferido,
      diasContratados: input.diasContratados,
    });

  let planMinimo = { ok: true, planMinimoRequerido: null };
  if (tipoProducto === 'perfil' && planId && planId !== 'trial_profesional') {
    planMinimo = assertPlanMinimo(planId, {
      formularioId: input.formularioId,
      sectorId: input.scope && input.scope.sectorId,
      subcategoriaId: input.scope && input.scope.subcategoriaId,
      overridesCategoria: input.overridesCategoria,
    });
  }

  const montoFinal = promo && promo.precioFinal != null ? promo.precioFinal : pricing.montoFinal;

  const snapshot = {
    ordenId: input.ordenId || 'ord_local_' + Date.now(),
    uid,
    tipoProducto,
    estado: 'pendiente',
    montoMXN: montoFinal,
    moneda: 'MXN',
    planId: planId || null,
    periodo: input.periodo || 'mensual',
    scopedPerfilId: input.perfilId || null,
    scopedBannerId: input.bannerId || input.solicitudId || null,
    scopedSlotId: input.slotId || null,
    origenPlan: (promo && promo.origenPlan) || (planId === 'trial_profesional' ? 'trial' : 'pago'),
    planMinimoRequerido: planMinimo.planMinimoRequerido,
    planMinimoOk: planMinimo.ok,
    precioSnapshot: {
      precioContratado: montoFinal,
      versionPrecio: pricing.versionPrecio,
      overrideAplicado: pricing.overrideAplicado,
      desglose: pricing.desglose,
      congeladoEn: new Date().toISOString(),
    },
    promocionSnapshot: promo ? {
      promocionId: promo.promocionId,
      versionPromocion: promo.versionPromocion,
      tipo: promo.tipo,
      diasGratis: promo.diasGratis || null,
      diasTotales: promo.diasTotales || null,
      congelada: true,
    } : null,
    entitlementsSnapshot: entitlements ? {
      planId: entitlements.planId,
      entitlementsPlanId: entitlements.entitlementsPlanId,
      limites: entitlements.limites,
      versionEntitlements: entitlements.versionEntitlements,
      congeladoEn: new Date().toISOString(),
    } : null,
    proveedor: null,
    webhookId: null,
    createdAt: new Date().toISOString(),
    _bloque1: { persistido: false, nota: 'Snapshot en memoria — sin Firestore' },
  };

  if (tipoProducto === 'perfil' && planId && !planMinimo.ok) {
    snapshot.estado = 'pendiente';
    snapshot.planMinimoBlocked = true;
    snapshot.planMinimoCode = planMinimo.code;
  }

  const validation = validateOrdenSchema(snapshot);
  snapshot.schemaValid = validation.ok;
  if (!validation.ok) snapshot.schemaErrors = validation.errors;

  return snapshot;
}

module.exports = {
  buildOrdenPagoSnapshot,
};
