/**
 * Catálogo slots publicidad — sincronizado con scripts/seed-configuracion-publicidad.json (BAN-010).
 */
(function (global) {
  'use strict';

  var SLOTS = {
    home_izquierda: { capacidadMaxima: 2, mvpCore: true, tier: 'standard', activo: true },
    home_derecha: { capacidadMaxima: 2, mvpCore: true, tier: 'standard', activo: true },
    home_inferior: { capacidadMaxima: 3, mvpCore: true, tier: 'standard', activo: true },
    home_categorias: { capacidadMaxima: 1, mvpCore: true, tier: 'standard', activo: true },
    home_hero_1: { capacidadMaxima: 1, mvpCore: false, tier: 'premium', activo: true },
    home_hero_2: { capacidadMaxima: 1, mvpCore: false, tier: 'premium', activo: true },
    home_hero_3: { capacidadMaxima: 1, mvpCore: false, tier: 'premium', activo: true },
    home_hero_4: { capacidadMaxima: 1, mvpCore: false, tier: 'premium', activo: true },
    home_hero_5: { capacidadMaxima: 1, mvpCore: false, tier: 'premium', activo: true },
    sin_resultados_izquierda: { capacidadMaxima: 3, mvpCore: true, tier: 'standard', activo: true },
    sin_resultados_centro: { capacidadMaxima: 2, mvpCore: true, tier: 'standard', activo: true },
    sin_resultados_derecha: { capacidadMaxima: 3, mvpCore: true, tier: 'standard', activo: true },
    sin_resultados_inferior: { capacidadMaxima: 3, mvpCore: true, tier: 'standard', activo: true },
    resultados_izquierda: { capacidadMaxima: 3, mvpCore: true, tier: 'standard', activo: true },
    resultados_centro: { capacidadMaxima: 2, mvpCore: true, tier: 'standard', activo: true },
    resultados_derecha: { capacidadMaxima: 3, mvpCore: true, tier: 'standard', activo: true },
    resultados_inferior: { capacidadMaxima: 3, mvpCore: true, tier: 'standard', activo: true },
    perfil_izquierda: { capacidadMaxima: 3, mvpCore: true, tier: 'standard', activo: true },
    perfil_centro: { capacidadMaxima: 2, mvpCore: true, tier: 'standard', activo: true },
    perfil_derecha: { capacidadMaxima: 3, mvpCore: true, tier: 'standard', activo: true },
    perfil_inferior: { capacidadMaxima: 3, mvpCore: true, tier: 'standard', activo: true },
    registro_superior: { capacidadMaxima: 3, mvpCore: true, tier: 'standard', activo: true }
  };

  function validar(slotId) {
    var id = String(slotId || '').trim();
    if (!id) return { ok: false, error: 'slotId requerido' };
    var cfg = SLOTS[id];
    if (!cfg) return { ok: false, error: 'slotId no reconocido' };
    if (cfg.activo === false) return { ok: false, error: 'slot inactivo' };
    return { ok: true, slot: cfg };
  }

  function capacidadMaxima(slotId) {
    var v = validar(slotId);
    return v.ok ? v.slot.capacidadMaxima : 1;
  }

  global.CARIHUB_SLOTS_CATALOG = {
    SLOTS: SLOTS,
    ALL_IDS: Object.keys(SLOTS),
    validar: validar,
    capacidadMaxima: capacidadMaxima
  };
})(typeof window !== 'undefined' ? window : globalThis);
