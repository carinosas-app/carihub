/**
 * Monta el rail superior (Estados · banner categorías · LIBE) en pantallas de categorías Home.
 */
(function (global) {
  'use strict';

  var SLOT_CATEGORIAS = 'home_categorias';
  var CAT_RAIL_BG_DEFAULT = 'img/home/banners/ad-banner-categorias-explora-01.png';

  var CAT_RAIL_BG_BY_SECTOR = {
    bienestar: 'img/home/banners/ad-banner-bienestar-01.png',
    eventos: 'img/home/banners/ad-banner-eventos-01.png',
    restaurantes: 'img/home/banners/ad-banner-restaurantes-01.png',
    salud: 'img/home/banners/ad-banner-salud-01.png',
    profesionales: 'img/home/banners/ad-banner-profesionales-01.png',
    tecnologia: 'img/home/banners/ad-banner-tecnologia-01.png',
    automotriz: 'img/home/banners/ad-banner-automotriz-01.png',
    transporte: 'img/home/banners/ad-banner-transporte-01.png',
    comercio: 'img/home/banners/ad-banner-comercio-01.png',
    hogar: 'img/home/banners/ad-banner-hogar-01.png',
    mascotas: 'img/home/banners/ad-banner-mascotas-01.png',
    'bienes-raices': 'img/home/banners/ad-banner-bienes-raices-01.png',
    educacion: 'img/home/banners/ad-banner-educacion-01.png',
    industria: 'img/home/banners/ad-banner-industria-01.png'
  };

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function linkCategorias() {
    return 'registro-banner.html?slot=' + encodeURIComponent(SLOT_CATEGORIAS);
  }

  function obtenerRentaCategorias() {
    var rentals = global.CARIHUB_HOME_SLOT_RENTALS || {};
    return rentals[SLOT_CATEGORIAS] || null;
  }

  function railBgForSector(sectorId) {
    if (sectorId && CAT_RAIL_BG_BY_SECTOR[sectorId]) {
      return CAT_RAIL_BG_BY_SECTOR[sectorId];
    }
    return CAT_RAIL_BG_DEFAULT;
  }

  function buildCenterRailHtml(opts) {
    opts = opts || {};
    var rental = obtenerRentaCategorias();
    var href = linkCategorias();
    var sectorHint = opts.sectorName ? esc(opts.sectorName) + ' · ' : '';
    var subHint = opts.subcatName ? esc(opts.subcatName) + ' · ' : '';
    var hint = subHint + sectorHint + 'Banner selector de categorías';
    var railBg = railBgForSector(opts.sectorId);

    if (rental && rental.imagen) {
      href = rental.url || href;
      return (
        '<a class="registro-pb registro-pb--rail-cat" href="' + esc(href) + '" data-registro-slot="' + esc(SLOT_CATEGORIAS) + '" aria-label="' + esc(rental.titulo || 'Anuncio en selector de categorías') + '">' +
          '<div class="registro-pb__stage">' +
            '<div class="registro-pb__slide is-active" aria-hidden="false">' +
              '<img src="' + esc(rental.imagen) + '" alt="' + esc(rental.titulo || 'Banner categorías') + '" decoding="async">' +
            '</div>' +
          '</div>' +
        '</a>'
      );
    }

    var themed = !opts.sectorId || !!CAT_RAIL_BG_BY_SECTOR[opts.sectorId];

    return (
      '<a class="registro-pb registro-pb--rail-cat registro-pb--rail-vacant' +
        (themed ? ' registro-pb--rail-themed' : '') +
        (opts.sectorId ? ' registro-pb--rail-vacant-' + esc(opts.sectorId) : '') +
        '" href="' + esc(href) + '" data-registro-slot="' + esc(SLOT_CATEGORIAS) + '" aria-label="Anúnciate aquí — banner selector de categorías">' +
        '<div class="registro-pb__stage">' +
          '<div class="registro-pb__slide is-active registro-pb__slide--rail-vacant" aria-hidden="false">' +
            '<img class="registro-pb__rail-bg" src="' + esc(railBg) + '" alt="" decoding="async">' +
            '<span class="registro-pb__rail-shade" aria-hidden="true"></span>' +
            '<span class="registro-pb__rail-copy">' +
              '<span class="registro-pb__rail-title">Anúnciate aquí</span>' +
              '<span class="registro-pb__rail-hint">' + hint + '</span>' +
            '</span>' +
          '</div>' +
        '</div>' +
      '</a>'
    );
  }

  function mountSideSlots(rail) {
    if (!global.CariHubSlotDock || !global.CariHubSlotDock.mountDock) return;
    var map = {};
    rail.querySelectorAll('[data-promo-slot]').forEach(function (el) {
      var slotId = el.getAttribute('data-promo-slot');
      if (el.id && slotId) map[el.id] = slotId;
    });
    if (!Object.keys(map).length) return;
    global.CariHubSlotDock.mountDock({
      rentals: global.CARIHUB_HOME_SLOT_RENTALS || {},
      map: map,
      layout: 'rail'
    });
  }

  function mountCenterBanner(rail, opts) {
    opts = opts || {};
    var slot = rail.querySelector('[data-registro-banner-slot="' + SLOT_CATEGORIAS + '"]');
    if (!slot) return;
    slot.innerHTML = buildCenterRailHtml(opts);
    slot.dataset.registroBannerMounted = '1';
  }

  function mountRail(rail, opts) {
    if (!rail) return;
    mountSideSlots(rail);
    mountCenterBanner(rail, opts || {});
    if (opts && opts.sectorId) {
      rail.setAttribute('data-rp-sector', opts.sectorId);
    } else {
      rail.removeAttribute('data-rp-sector');
    }
    rail.dataset.promoMounted = '1';
  }

  function mountAll(opts) {
    document.querySelectorAll('.home-cat-promo-rail').forEach(function (rail) {
      mountRail(rail, opts);
    });
  }

  function refreshForSector(sectorId, sectorName) {
    document.querySelectorAll('.home-cat-promo-rail').forEach(function (rail) {
      if (rail.closest('[hidden]')) return;
      mountRail(rail, { sectorId: sectorId, sectorName: sectorName || '' });
    });
  }

  function refreshGeneric() {
    document.querySelectorAll('.home-cat-promo-rail').forEach(function (rail) {
      if (rail.closest('[hidden]')) return;
      mountRail(rail, {});
    });
  }

  global.CariHubHomeCatPromoRail = {
    mountRail: mountRail,
    mountAll: mountAll,
    refreshForSector: refreshForSector,
    refreshGeneric: refreshGeneric
  };

  function boot() {
    mountAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(typeof window !== 'undefined' ? window : globalThis);
