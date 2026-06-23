import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const payRoot = join(__dirname, '../functions/payments');

const {
  resolvePrice,
  resolveEntitlements,
  resolvePromo,
  buildOrdenPagoSnapshot,
  assertPlanMinimo,
  validateUpload,
  TRIAL_ENTITLEMENTS_PLAN,
} = require(join(payRoot, 'index.js'));

const preciosFixture = JSON.parse(
  readFileSync(join(payRoot, 'fixtures/config-precios-fixture.json'), 'utf8')
);
const entitlementsFixture = JSON.parse(
  readFileSync(join(payRoot, 'fixtures/config-entitlements-fixture.json'), 'utf8')
);
const promosPerfilFixture = JSON.parse(
  readFileSync(join(payRoot, 'fixtures/config-promos-perfiles-fixture.json'), 'utf8')
);
const promosBannerFixture = JSON.parse(
  readFileSync(join(payRoot, 'fixtures/config-promos-banners-fixture.json'), 'utf8')
);

describe('ECO-015 PricingResolver', () => {
  it('precio persona_independiente × 4 planes mensual', () => {
    const plans = ['basico', 'destacado', 'premium', 'vip'];
    const expected = [249, 499, 799, 1199];
    plans.forEach((planId, i) => {
      const r = resolvePrice({
        tipoProducto: 'perfil',
        planId,
        formularioId: 'persona_independiente',
        periodo: 'mensual',
        config: preciosFixture,
      });
      assert.equal(r.montoFinal, expected[i], planId);
    });
  });

  it('trial_profesional precio $0', () => {
    const r = resolvePrice({
      tipoProducto: 'perfil',
      planId: 'trial_profesional',
      formularioId: 'persona_independiente',
      periodo: 'mensual',
      config: preciosFixture,
    });
    assert.equal(r.montoFinal, 0);
  });
});

describe('ECO-015 EntitlementsResolver', () => {
  it('trial_profesional entitlements = destacado', () => {
    const trial = resolveEntitlements({ planId: 'trial_profesional', config: entitlementsFixture });
    const dest = resolveEntitlements({ planId: 'destacado', config: entitlementsFixture });
    assert.equal(trial.entitlementsPlanId, TRIAL_ENTITLEMENTS_PLAN);
    assert.deepEqual(trial.limites.fotosMax, dest.limites.fotosMax);
    assert.deepEqual(trial.limites.adjuntosChatMesMax, dest.limites.adjuntosChatMesMax);
  });

  it('Básico opción B vs Premium cupos', () => {
    const basico = resolveEntitlements({ planId: 'basico', config: entitlementsFixture });
    const premium = resolveEntitlements({ planId: 'premium', config: entitlementsFixture });
    assert.equal(basico.limites.fotosMax, 6);
    assert.equal(basico.limites.adjuntosChatMesMax, 10);
    assert.ok(premium.limites.fotosMax > basico.limites.fotosMax);
    assert.ok(premium.limites.adjuntosChatMesMax > basico.limites.adjuntosChatMesMax);
  });
});

describe('ECO-015 plan mínimo', () => {
  it('adultos bloquea basico', () => {
    const r = assertPlanMinimo('basico', {
      formularioId: 'adultos',
      sectorId: 'adultos',
      overridesCategoria: entitlementsFixture.overridesCategoria,
    });
    assert.equal(r.ok, false);
    assert.equal(r.planMinimoRequerido, 'vip');
  });
});

describe('ECO-015 PromoResolver', () => {
  it('promo congelada no cambia snapshot tras cambio admin simulado', () => {
    const promo1 = resolvePromo({
      tipoProducto: 'perfil',
      config: promosPerfilFixture,
      scope: { formularioId: 'persona_independiente' },
      esAprobacionAdmin: true,
    });
    const snapshot = buildOrdenPagoSnapshot({
      uid: 'uid_test',
      perfilId: 'perfil_test',
      tipoProducto: 'perfil',
      planId: 'trial_profesional',
      formularioId: 'persona_independiente',
      configPrecios: preciosFixture,
      configEntitlements: entitlementsFixture,
      configPromos: promosPerfilFixture,
      esAprobacionAdmin: true,
      promoResuelta: promo1,
    });
    const configPromosAlterada = JSON.parse(JSON.stringify(promosPerfilFixture));
    configPromosAlterada.promociones[0].beneficio.diasGratis = 999;
    const promo2 = resolvePromo({
      tipoProducto: 'perfil',
      config: configPromosAlterada,
      scope: { formularioId: 'persona_independiente' },
      esAprobacionAdmin: true,
    });
    assert.notEqual(promo2.diasGratis, snapshot.promocionSnapshot.diasGratis);
    assert.equal(snapshot.promocionSnapshot.diasGratis, 30);
    assert.equal(snapshot.promocionSnapshot.congelada, true);
  });

  it('referido +7 días trial invitado', () => {
    const promoRef = resolvePromo({
      tipoProducto: 'perfil',
      config: promosPerfilFixture,
      scope: { formularioId: 'persona_independiente' },
      esAprobacionAdmin: true,
      tieneCodigoReferido: true,
    });
    assert.equal(promoRef.diasGratis, 37);
    assert.equal(promoRef.origenPlan, 'referido');
  });
});

describe('ECO-015 ContractFactory', () => {
  it('buildOrdenPagoSnapshot objeto válido', () => {
    const snap = buildOrdenPagoSnapshot({
      uid: 'uid_abc',
      perfilId: 'perfil_xyz',
      tipoProducto: 'perfil',
      planId: 'destacado',
      formularioId: 'persona_independiente',
      periodo: 'mensual',
      configPrecios: preciosFixture,
      configEntitlements: entitlementsFixture,
      configPromos: promosPerfilFixture,
    });
    assert.equal(snap.estado, 'pendiente');
    assert.equal(snap.montoMXN, 499);
    assert.equal(snap.uid, 'uid_abc');
    assert.equal(snap.scopedPerfilId, 'perfil_xyz');
    assert.ok(snap.precioSnapshot.congeladoEn);
    assert.ok(snap.entitlementsSnapshot.limites);
    assert.equal(snap._bloque1.persistido, false);
  });
});

describe('ECO-015 uploadGate (puro)', () => {
  it('bloquea foto cuando cupo agotado', () => {
    const ent = resolveEntitlements({ planId: 'basico', config: entitlementsFixture });
    const r = validateUpload({
      contextoUpload: 'perfil_galeria',
      entitlements: ent.limites,
      usage: { fotosUsadas: 6 },
      archivoBytes: 1024 * 1024,
      mimeType: 'image/jpeg',
    });
    assert.equal(r.allowed, false);
    assert.equal(r.code, 'FOTOS_MAX');
  });

  it('chat adjunto reservado — cálculo OK con cupo', () => {
    const ent = resolveEntitlements({ planId: 'basico', config: entitlementsFixture });
    const r = validateUpload({
      contextoUpload: 'chat_adjunto',
      entitlements: ent.limites,
      usage: { adjuntosChatMes: 0 },
      mimeType: 'image/jpeg',
    });
    assert.equal(r.allowed, true);
    assert.equal(r.code, 'OK');
  });
});
