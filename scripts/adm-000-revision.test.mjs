import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const COLA_PATH = join(ROOT, 'public/js/admin-revision-cola.js');

function loadCola() {
  const sandbox = { window: {}, globalThis: {} };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.runInNewContext(readFileSync(COLA_PATH, 'utf8'), sandbox, { filename: COLA_PATH });
  return sandbox.AdminRevisionCola;
}

describe('ADM-000 revision cola', () => {
  const Cola = loadCola();

  test('normaliza estados legacy banner', () => {
    assert.equal(Cola.normalizeEstadoBanner({ estado: 'pendiente' }), 'enviado_revision');
    assert.equal(Cola.normalizeEstadoBanner({ estado: 'autorizado_pago' }), 'autorizado_para_pago');
    assert.equal(Cola.normalizeEstadoBanner({ estado: 'activo' }), 'publicado');
  });

  test('transiciones permitidas en enviado_revision', () => {
    const acc = Cola.getAccionesPermitidas('banner', 'enviado_revision');
    assert.ok(acc.some((a) => a.id === 'autorizar_pago'));
    assert.ok(acc.some((a) => a.id === 'rechazar'));
    assert.equal(Cola.puedeTransicionar('banner', 'enviado_revision', 'publicar'), false);
  });

  test('publicar solo desde pago_confirmado o revision_post_pago', () => {
    assert.equal(Cola.puedeTransicionar('banner', 'pago_confirmado', 'publicar'), true);
    assert.equal(Cola.puedeTransicionar('banner', 'enviado_revision', 'publicar'), false);
    const pub = Cola.resolverAccion('banner', 'pago_confirmado', 'publicar');
    assert.equal(pub.syncBanner, true);
  });

  test('buildColaItems mezcla perfiles y banners pendientes', () => {
    const items = Cola.buildColaItems(
      [{ id: 'u1', nombre: 'Ana', estadoRevision: 'registro_pendiente' }],
      [{ id: 'b1', nombre: 'Hotel', estado: 'pendiente', slotId: 'home_izquierda' }]
    );
    assert.equal(items.length, 2);
    assert.equal(items[0].tipo, 'perfil');
    assert.equal(items[1].tipo, 'banner');
  });

  test('payload transicion incluye estadoRevision schema', () => {
    const acc = Cola.resolverAccion('banner', 'enviado_revision', 'autorizar_pago');
    const payload = Cola.buildPayloadTransicionBanner(acc, 'admin@test.local', 'ok');
    assert.equal(payload.estado, 'autorizado_pago');
    assert.equal(payload.estadoRevision, 'autorizado_para_pago');
  });
});
