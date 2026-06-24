import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const payRoot = join(__dirname, '../functions/payments');

const { activateFromOrden } = require(join(payRoot, 'activation-service.js'));
const { confirmManualPago } = require(join(payRoot, 'admin-confirm-manual.js'));
const { createMemoryActivationStore } = require(join(payRoot, 'activation-store-memory.js'));

function ctx(extra) {
  return Object.assign({
    origen: 'webhook_stripe',
    actorId: 'evt_test_1',
    idempotencyKey: 'stripe:evt_test_1',
    montoConfirmadoMXN: 499,
    timestamp: new Date(),
  }, extra || {});
}

function ordenPerfilPagada(overrides) {
  return Object.assign({
    ordenId: 'ord_perfil_1',
    uid: 'uid_owner',
    tipoProducto: 'perfil',
    tipoOperacion: 'alta',
    estado: 'pagado',
    montoMXN: 499,
    moneda: 'MXN',
    planId: 'destacado',
    periodo: 'mensual',
    scopedPerfilId: 'perfil_a',
    activacionCompleta: false,
    precioSnapshot: { precioContratado: 499 },
    entitlementsSnapshot: {
      planId: 'destacado',
      entitlementsPlanId: 'destacado',
      limites: { fotosMax: 12 },
    },
  }, overrides || {});
}

function seedPerfilStore(orden) {
  return createMemoryActivationStore({
    ordenes: { [orden.ordenId]: orden },
    docs: {
      'usuarios/uid_owner': {
        uid: 'uid_owner',
        perfilesDetalle: {
          perfil_a: {
            nombre: 'Ana',
            autorizadoParaPago: true,
            estadoRevision: 'autorizado_para_pago',
          },
        },
      },
    },
  });
}

describe('ECO-030 activation-service (Fase 0)', () => {
  it('U01 alta perfil happy path', async () => {
    const orden = ordenPerfilPagada();
    const store = seedPerfilStore(orden);
    const r = await activateFromOrden(store, orden.ordenId, ctx());
    assert.equal(r.ok, true);
    assert.equal(r.codigo, 'ACTIVADO');
    const snap = store.snapshot();
    assert.ok(snap.docs['contratos_perfiles/perfil_perfil_a_ord_perfil_1']);
    assert.equal(snap.docs['usuarios/uid_owner'].perfilesDetalle.perfil_a.pagado, true);
    assert.equal(snap.docs['usuarios/uid_owner'].perfilesDetalle.perfil_a.activo, true);
    assert.ok(snap.docs['perfiles/perfil_a/usage/current']);
  });

  it('U02 alta banner happy path', async () => {
    const orden = {
      ordenId: 'ord_banner_1',
      uid: 'uid_adv',
      tipoProducto: 'banner',
      tipoOperacion: 'alta',
      estado: 'pagado',
      montoMXN: 1499,
      scopedBannerId: 'sol_b1',
      scopedSlotId: 'home_izquierda',
      periodo: 'mensual',
      activacionCompleta: false,
      precioSnapshot: { precioContratado: 1499 },
    };
    const store = createMemoryActivationStore({
      ordenes: { [orden.ordenId]: orden },
      docs: {
        'solicitudes_anuncios/sol_b1': {
          uidAnunciante: 'uid_adv',
          slotId: 'home_izquierda',
          estado: 'autorizado_pago',
          estadoRevision: 'autorizado_para_pago',
          imagenURL: 'https://example.com/b.jpg',
          nombreNegocio: 'Hotel',
        },
      },
    });
    const r = await activateFromOrden(store, orden.ordenId, ctx({ idempotencyKey: 'stripe:evt_b1', montoConfirmadoMXN: 1499 }));
    assert.equal(r.ok, true);
    assert.equal(r.codigo, 'ACTIVADO');
    const snap = store.snapshot();
    assert.equal(snap.docs['solicitudes_anuncios/sol_b1'].estado, 'activo');
    assert.equal(snap.docs['solicitudes_anuncios/sol_b1'].estadoRevision, 'publicado');
    assert.ok(snap.docs['configuracion_publicidad/banners_activos'].slots.home_izquierda);
  });

  it('U03 renovación perfil extiende vigencia', async () => {
    const futuro = new Date();
    futuro.setDate(futuro.getDate() + 10);
    const orden = ordenPerfilPagada({
      ordenId: 'ord_renov_1',
      tipoOperacion: 'renovacion',
    });
    const store = seedPerfilStore(orden);
    store.snapshot().docs['usuarios/uid_owner'].perfilesDetalle.perfil_a.fechaVencimiento = futuro;
    await store.setDoc('usuarios/uid_owner', store.snapshot().docs['usuarios/uid_owner'], false);

    const r = await activateFromOrden(store, orden.ordenId, ctx({ idempotencyKey: 'stripe:evt_renov' }));
    assert.equal(r.ok, true);
    assert.equal(r.codigo, 'RENOVADO');
    const venc = store.snapshot().docs['usuarios/uid_owner'].perfilesDetalle.perfil_a.fechaVencimiento;
    assert.ok(new Date(venc) > futuro);
  });

  it('U06 YA_ACTIVADO segunda llamada', async () => {
    const orden = ordenPerfilPagada();
    const store = seedPerfilStore(orden);
    const c = ctx({ idempotencyKey: 'stripe:dup' });
    const r1 = await activateFromOrden(store, orden.ordenId, c);
    const r2 = await activateFromOrden(store, orden.ordenId, c);
    assert.equal(r1.codigo, 'ACTIVADO');
    assert.equal(r2.codigo, 'YA_ACTIVADO');
    assert.equal(Object.keys(store.snapshot().docs).filter((k) => k.startsWith('contratos_perfiles')).length, 1);
  });

  it('U08 orden pendiente rechazada', async () => {
    const orden = ordenPerfilPagada({ estado: 'pendiente' });
    const store = seedPerfilStore(orden);
    const r = await activateFromOrden(store, orden.ordenId, ctx());
    assert.equal(r.ok, false);
    assert.equal(r.codigo, 'ORDEN_NO_PAGADA');
  });

  it('U10 monto insuficiente', async () => {
    const orden = ordenPerfilPagada();
    const store = seedPerfilStore(orden);
    const r = await activateFromOrden(store, orden.ordenId, ctx({ montoConfirmadoMXN: 1 }));
    assert.equal(r.ok, false);
    assert.equal(r.codigo, 'MONTO_INSUFICIENTE');
  });

  it('U12 banner slot inválido', async () => {
    const orden = {
      ordenId: 'ord_bad_slot',
      uid: 'uid_adv',
      tipoProducto: 'banner',
      estado: 'pagado',
      scopedBannerId: 'sol_x',
      scopedSlotId: 'slot_falso',
      activacionCompleta: false,
      precioSnapshot: { precioContratado: 100 },
    };
    const store = createMemoryActivationStore({
      ordenes: { [orden.ordenId]: orden },
      docs: {
        'solicitudes_anuncios/sol_x': {
          uidAnunciante: 'uid_adv',
          estadoRevision: 'autorizado_para_pago',
        },
      },
    });
    const r = await activateFromOrden(store, orden.ordenId, ctx({ montoConfirmadoMXN: 100 }));
    assert.equal(r.codigo, 'SLOT_INVALIDO');
  });

  it('U13 banner sin imagen — contrato OK sin banners_activos', async () => {
    const orden = {
      ordenId: 'ord_no_img',
      uid: 'uid_adv',
      tipoProducto: 'banner',
      estado: 'pagado',
      scopedBannerId: 'sol_ni',
      scopedSlotId: 'registro_superior',
      activacionCompleta: false,
      precioSnapshot: { precioContratado: 500 },
    };
    const store = createMemoryActivationStore({
      ordenes: { [orden.ordenId]: orden },
      docs: {
        'solicitudes_anuncios/sol_ni': {
          uidAnunciante: 'uid_adv',
          estadoRevision: 'autorizado_para_pago',
          slotId: 'registro_superior',
        },
      },
    });
    const r = await activateFromOrden(store, orden.ordenId, ctx({ montoConfirmadoMXN: 500 }));
    assert.equal(r.ok, true);
    assert.equal(r.auditWarning, 'BANNER_SIN_IMAGEN_PUBLICA');
    assert.equal(store.snapshot().docs['configuracion_publicidad/banners_activos'], undefined);
  });

  it('U15 admin manual usa mismo activador', async () => {
    const orden = ordenPerfilPagada({ estado: 'pendiente' });
    const store = seedPerfilStore(orden);
    const r = await confirmManualPago(store, orden.ordenId, { adminEmail: 'admin@test.local' });
    assert.equal(r.ok, true);
    assert.equal(r.codigo, 'ACTIVADO');
    assert.equal(store.snapshot().ordenes[orden.ordenId].proveedor, 'manual_admin');
  });

  it('U18 estado MVP stub', async () => {
    const orden = {
      ordenId: 'ord_est_1',
      uid: 'uid_o',
      tipoProducto: 'estado',
      scopedEstadoId: 'sol_est',
      estado: 'pagado',
      activacionCompleta: false,
      periodo: 'mensual',
      precioSnapshot: { precioContratado: 0 },
    };
    const store = createMemoryActivationStore({
      ordenes: { [orden.ordenId]: orden },
      docs: { 'solicitudes_anuncios/sol_est': { uidAnunciante: 'uid_o' } },
    });
    const r = await activateFromOrden(store, orden.ordenId, ctx({ montoConfirmadoMXN: 0 }));
    assert.equal(r.ok, true);
    assert.equal(store.snapshot().docs['solicitudes_anuncios/sol_est'].estadoRevision, 'publicado');
  });
});
