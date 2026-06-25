/**

 * Monta el rail superior (Estados · banner categorías · LIBE) en pantallas de categorías Home.

 */

(function (global) {

  'use strict';



  var SLOT_CATEGORIAS = 'home_categorias';

  var CAT_RAIL_BG = 'img/home/banners/ad-banner-pink-01.png';



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



  function buildCenterRailHtml(opts) {

    opts = opts || {};

    var rental = obtenerRentaCategorias();

    var href = linkCategorias();

    var sectorHint = opts.sectorName ? esc(opts.sectorName) + ' · ' : '';

    var hint = sectorHint + 'Banner selector de categorías';



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



    return (

      '<a class="registro-pb registro-pb--rail-cat registro-pb--rail-vacant" href="' + esc(href) + '" data-registro-slot="' + esc(SLOT_CATEGORIAS) + '" aria-label="Anúnciate aquí — banner selector de categorías">' +

        '<div class="registro-pb__stage">' +

          '<div class="registro-pb__slide is-active registro-pb__slide--rail-vacant" aria-hidden="false">' +

            '<img class="registro-pb__rail-bg" src="' + esc(CAT_RAIL_BG) + '" alt="" decoding="async">' +

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


