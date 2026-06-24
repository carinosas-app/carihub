'use strict';

const path = require('path');
const fs = require('fs');

const SEED_PATH = path.join(__dirname, '../../scripts/seed-configuracion-publicidad.json');
const seed = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));

const ALL_SLOT_IDS = Object.keys(seed.slots || {});
const PREMIUM_SLOT_IDS = ALL_SLOT_IDS.filter((id) => /^home_hero_\d+$/.test(id));
const MVP_CORE_SLOT_IDS = ALL_SLOT_IDS.filter((id) => {
  const cfg = seed.slots[id];
  if (cfg && cfg.mvpCore === false) return false;
  if (cfg && cfg.mvpCore === true) return true;
  return PREMIUM_SLOT_IDS.indexOf(id) < 0;
});

function getSlotConfig(slotId) {
  return seed.slots[slotId] || null;
}

function assertSlotIdValido(slotId) {
  const cfg = getSlotConfig(slotId);
  if (!cfg) {
    return { ok: false, error: 'slotId desconocido: ' + slotId };
  }
  if (cfg.activo === false) {
    return { ok: false, error: 'slot inactivo: ' + slotId };
  }
  return { ok: true, slot: cfg };
}

function assertSlotDisponible(slotId, ocupacionActual) {
  const valid = assertSlotIdValido(slotId);
  if (!valid.ok) return valid;
  const cap = Math.max(1, Number(valid.slot.capacidadMaxima) || 1);
  const occ = Math.max(0, Number(ocupacionActual) || 0);
  if (occ >= cap) {
    return { ok: false, error: 'slot lleno', capacidadMaxima: cap, ocupacionActual: occ };
  }
  return { ok: true, capacidadMaxima: cap, ocupacionActual: occ, disponibles: cap - occ };
}

function esSlotMvpCore(slotId) {
  return MVP_CORE_SLOT_IDS.indexOf(slotId) >= 0;
}

module.exports = {
  ALL_SLOT_IDS,
  MVP_CORE_SLOT_IDS,
  PREMIUM_SLOT_IDS,
  getSlotConfig,
  assertSlotIdValido,
  assertSlotDisponible,
  esSlotMvpCore,
};
