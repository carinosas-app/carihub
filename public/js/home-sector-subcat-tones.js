/**
 * Tonos de fondo por imagen de subcategoría (Home — Explora otras categorías).
 */
(function (global) {
  'use strict';

  var SECTOR_HUE = {
    mascotas: { h: 125, s: 38, l: 90 },
    transporte: { h: 168, s: 42, l: 89 },
    bienestar: { h: 158, s: 32, l: 91 },
    salud: { h: 338, s: 38, l: 92 },
    eventos: { h: 28, s: 42, l: 91 },
    educacion: { h: 215, s: 38, l: 91 },
    tecnologia: { h: 262, s: 36, l: 91 },
    automotriz: { h: 218, s: 40, l: 90 },
    profesionales: { h: 212, s: 34, l: 90 },
    comercio: { h: 278, s: 32, l: 91 },
    hogar: { h: 42, s: 44, l: 90 },
    'bienes-raices': { h: 132, s: 34, l: 90 },
    industria: { h: 24, s: 36, l: 90 },
    restaurantes: { h: 32, s: 46, l: 90 }
  };

  function hashStr(s) {
    var h = 0;
    var i;
    s = String(s || '');
    for (i = 0; i < s.length; i++) {
      h = ((h << 5) - h) + s.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }

  function toneForImage(src, sectorId, catId, index) {
    var base = SECTOR_HUE[sectorId] || { h: 200, s: 30, l: 91 };
    var seed = hashStr((src || '') + ':' + (catId || '') + ':' + (index || 0));
    var hue = (base.h + (seed % 36) - 18 + 360) % 360;
    var sat = Math.min(52, base.s + (seed % 7));
    var lit = Math.min(94, base.l + (seed % 5));
    return 'hsl(' + hue + ', ' + sat + '%, ' + lit + '%)';
  }

  function sectorThemeBg(sectorId, fallback) {
    if (global.CariHubSectorCardImages && global.CariHubSectorCardImages.getSectorCardImage) {
      var cfg = global.CariHubSectorCardImages.getSectorCardImage(sectorId);
      if (cfg && cfg.bg) return cfg.bg;
    }
    return fallback || '#eef2f6';
  }

  global.CariHubHomeSectorSubcatTones = {
    toneForImage: toneForImage,
    sectorThemeBg: sectorThemeBg
  };
})(typeof window !== 'undefined' ? window : globalThis);
