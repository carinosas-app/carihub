import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const slotInventory = require('../functions/payments/slot-inventory.js');

describe('BAN-010 slot inventory', () => {
  test('seed expone 22 slots', () => {
    assert.equal(slotInventory.ALL_SLOT_IDS.length, 22);
  });

  test('17 slots MVP core (sin hero premium)', () => {
    assert.equal(slotInventory.MVP_CORE_SLOT_IDS.length, 17);
    assert.equal(slotInventory.PREMIUM_SLOT_IDS.length, 5);
  });

  test('slotId invalido rechazado', () => {
    const r = slotInventory.assertSlotIdValido('slot_inexistente');
    assert.equal(r.ok, false);
  });

  test('slot valido aceptado', () => {
    const r = slotInventory.assertSlotIdValido('home_izquierda');
    assert.equal(r.ok, true);
    assert.equal(r.slot.capacidadMaxima, 2);
  });

  test('anti overbooking cuando cupo lleno', () => {
    const cap = slotInventory.getSlotConfig('home_categorias').capacidadMaxima;
    const r = slotInventory.assertSlotDisponible('home_categorias', cap);
    assert.equal(r.ok, false);
  });

  test('disponibilidad cuando hay cupo', () => {
    const r = slotInventory.assertSlotDisponible('registro_superior', 1);
    assert.equal(r.ok, true);
    assert.ok(r.disponibles >= 1);
  });
});
