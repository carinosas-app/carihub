/**
 * Category Watermark — ilustración tenue por sector (registro-perfil, tarjetas de categoría).
 * Elemento decorativo en el lado derecho de cada tarjeta; no sustituye el thumb izquierdo.
 */
(function (global) {
  'use strict';

  var BASE = 'img/home/sectores/';
  var HERO = 'img/home/';

  var WATERMARKS = {
    adultos: {
      src: HERO + 'hero-bar-neon.png',
      pos: 'center center',
      opacity: 0.22
    },
    bienestar: {
      src: HERO + 'hero-spa-interior.png',
      pos: 'center center',
      opacity: 0.2
    },
    eventos: {
      src: BASE + 'sector-09-eventos.png',
      pos: 'center center',
      opacity: 0.2
    },
    restaurantes: {
      src: 'img/home/sector-cards/restaurantes.png',
      pos: 'center top',
      opacity: 0.2
    },
    salud: {
      src: BASE + 'sector-03-salud.png',
      pos: 'center center',
      opacity: 0.2
    },
    profesionales: {
      src: BASE + 'sector-04-profesionales.png',
      pos: 'center center',
      opacity: 0.19
    },
    tecnologia: {
      src: HERO + 'hero-negocios-grid-noche.png',
      pos: 'center center',
      opacity: 0.2
    },
    'bienes-raices': {
      src: BASE + 'sector-08-bienes-raices.png',
      pos: 'center center',
      opacity: 0.2
    },
    educacion: {
      src: BASE + 'sector-11-educacion.png',
      pos: 'center center',
      opacity: 0.19
    },
    mascotas: {
      src: BASE + 'sector-14-mascotas.png',
      pos: 'center center',
      opacity: 0.2
    },
    industria: {
      src: BASE + 'sector-15-industria.png',
      pos: 'center center',
      opacity: 0.19
    },
    automotriz: {
      src: BASE + 'sector-05-automotriz.png',
      pos: 'center center',
      opacity: 0.2
    },
    hogar: {
      src: BASE + 'sector-06-hogar.png',
      pos: 'center center',
      opacity: 0.2
    },
    comercio: {
      src: HERO + 'hero-calle-negocios-dia.png',
      pos: 'center center',
      opacity: 0.19
    },
    transporte: {
      src: BASE + 'sector-10-transporte.png',
      pos: 'center center',
      opacity: 0.2
    }
  };

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function get(sectorId) {
    return WATERMARKS[String(sectorId || '')] || null;
  }

  function buildFromSrc(src, opts) {
    opts = opts || {};
    if (!src) return '';
    var opacity = opts.opacity != null ? opts.opacity : 0.2;
    var pos = opts.pos || 'center center';
    var extraClass = opts.subcat ? ' rp-sector-watermark--subcat' : '';
    return (
      '<span class="rp-sector-watermark' + extraClass + '" aria-hidden="true" style="--rp-wm-opacity:' + opacity + '">' +
        '<img class="rp-sector-watermark__img" src="' + esc(src) + '" alt="" ' +
          'loading="lazy" decoding="async" style="object-position:' + esc(pos) + '">' +
        '<span class="rp-sector-watermark__fade"></span>' +
      '</span>'
    );
  }

  function buildHtml(sectorId) {
    var wm = get(sectorId);
    if (!wm || !wm.src) return '';
    return buildFromSrc(wm.src, { pos: wm.pos, opacity: wm.opacity });
  }

  global.CariHubSectorCategoryWatermarks = {
    WATERMARKS: WATERMARKS,
    get: get,
    buildHtml: buildHtml,
    buildFromSrc: buildFromSrc
  };
})(typeof window !== 'undefined' ? window : globalThis);
