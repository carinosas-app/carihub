/**
 * Monta el rail superior (Estados · banner categorías · LIBE) en pantallas de categorías Home.
 * Adultos: vacant center banner rota fotos LGBT del inventario Home (pride / antro LGBT).
 */
(function (global) {
  'use strict';

  var SLOT_CATEGORIAS = 'home_categorias';
  /* Default Adultos/registro; «Ver otras categorías» usa surface + banners de sector. */
  var CAT_RAIL_BG_DEFAULT = 'img/home/banners/ad-banner-pink-01.png';
  var OTROS_CATS_BANNER_DEFAULT = 'img/home/banners/ad-banner-categorias-explora-01.png';
  var OTROS_CATS_BANNER_ROTATE = [
    'img/home/banners/ad-banner-categorias-explora-01.png',
    'img/home/banners/ad-banner-restaurantes-01.png',
    'img/home/banners/ad-banner-profesionales-01.png'
  ];

  var CAT_RAIL_BG_BY_SECTOR = {
    restaurantes: 'img/home/banners/ad-banner-restaurantes-01.png',
    eventos: 'img/home/banners/ad-banner-eventos-01.png',
    salud: 'img/home/banners/ad-banner-salud-01.png',
    bienestar: 'img/home/banners/ad-banner-bienestar-01.png',
    automotriz: 'img/home/banners/ad-banner-automotriz-01.png',
    profesionales: 'img/home/banners/ad-banner-profesionales-01.png',
    hogar: 'img/home/banners/ad-banner-hogar-01.png',
    comercio: 'img/home/banners/ad-banner-comercio-01.png',
    mascotas: 'img/home/banners/ad-banner-mascotas-01.png',
    educacion: 'img/home/banners/ad-banner-educacion-01.png',
    tecnologia: 'img/home/banners/ad-banner-tecnologia-01.png',
    transporte: 'img/home/banners/ad-banner-transporte-01.png',
    industria: 'img/home/banners/ad-banner-industria-01.png',
    'bienes-raices': 'img/home/banners/ad-banner-bienes-raices-01.png'
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
    if (!sectorId || sectorId === 'adultos') return '';
    var RS = global.CariHubResultadosSector;
    if (RS && typeof RS.bannerDeSector === 'function') {
      var fromRs = RS.bannerDeSector(sectorId);
      if (fromRs) return fromRs;
    }
    if (CAT_RAIL_BG_BY_SECTOR[sectorId]) return CAT_RAIL_BG_BY_SECTOR[sectorId];
    return OTROS_CATS_BANNER_DEFAULT;
  }

  function hashStr(s) {
    var h = 0;
    var str = String(s || '');
    var i;
    for (i = 0; i < str.length; i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }

  function officialAdultSrc(subcatId) {
    if (!subcatId || !global.CariHubCategoriaImagenes || !global.CariHubCategoriaImagenes.get) return '';
    var meta = global.CariHubCategoriaImagenes.get(subcatId);
    return meta && meta.src ? meta.src : '';
  }

  /**
   * Adultos (Elegir categoría): banners LGBT.
   * Ver otras categorías: creativas de sector (nunca pink/hot Adultos).
   */
  function thematicRailImages(opts) {
    opts = opts || {};
    var out = [];
    var seen = {};
    function push(src) {
      if (!src || seen[src]) return;
      seen[src] = true;
      out.push(src);
    }

    if (opts.sectorId === 'adultos') {
      push('img/home/banners/ad-banner-lgbt-resultados-01.png');
      push('img/home/banners/ad-banner-lgbt-resultados-02.png');
      push('img/home/banners/ad-banner-lgbt-resultados-03.png');
      return out.slice(0, 3);
    }

    if (opts.surface === 'otros-categorias') {
      if (opts.sectorId) {
        push(railBgForSector(opts.sectorId));
        if (!out.length) push(OTROS_CATS_BANNER_DEFAULT);
        return out.slice(0, 1);
      }
      OTROS_CATS_BANNER_ROTATE.forEach(push);
      return out.slice(0, 3);
    }

    if (opts.sectorId) {
      push(railBgForSector(opts.sectorId));
    }
    if (!out.length) out.push(CAT_RAIL_BG_DEFAULT);
    return out.slice(0, 1);
  }

  function buildVacantSlidesHtml(images) {
    return images
      .map(function (src, i) {
        return (
          '<div class="registro-pb__slide' +
          (i === 0 ? ' is-active' : '') +
          ' registro-pb__slide--rail-vacant" aria-hidden="' +
          (i === 0 ? 'false' : 'true') +
          '">' +
          '<img class="registro-pb__rail-bg" src="' +
          esc(src) +
          '" alt="" decoding="async">' +
          '</div>'
        );
      })
      .join('');
  }

  function buildCenterRailHtml(opts) {
    opts = opts || {};
    var rental = obtenerRentaCategorias();
    var href = linkCategorias();

    if (rental && rental.imagen) {
      href = rental.url || href;
      return (
        '<a class="registro-pb registro-pb--rail-cat" href="' +
        esc(href) +
        '" data-registro-slot="' +
        esc(SLOT_CATEGORIAS) +
        '" aria-label="' +
        esc(rental.titulo || 'Anuncio en selector de categorías') +
        '">' +
        '<div class="registro-pb__stage">' +
        '<div class="registro-pb__slide is-active" aria-hidden="false">' +
        '<img src="' +
        esc(rental.imagen) +
        '" alt="' +
        esc(rental.titulo || 'Banner categorías') +
        '" decoding="async">' +
        '</div>' +
        '</div>' +
        '</a>'
      );
    }

    /* Sin texto HTML encima: la creativa LGBT ya incluye el copy. */
    var images = thematicRailImages(opts);
    var slides = buildVacantSlidesHtml(images);

    return (
      '<a class="registro-pb registro-pb--rail-cat registro-pb--rail-vacant' +
      (opts.sectorId ? ' registro-pb--rail-vacant-' + esc(opts.sectorId) : '') +
      '" href="' +
      esc(href) +
      '" data-registro-slot="' +
      esc(SLOT_CATEGORIAS) +
      '" aria-label="Anúnciate aquí — banner selector de categorías">' +
      '<div class="registro-pb__stage" data-rail-rotate="' +
      images.length +
      '">' +
      slides +
      '</div>' +
      '</a>'
    );
  }

  function startRailRotate(slot) {
    var stage = slot && slot.querySelector('.registro-pb__stage[data-rail-rotate]');
    if (!stage) return;
    var n = Number(stage.getAttribute('data-rail-rotate') || 0);
    if (n < 2) return;
    if (stage._railTimer) clearInterval(stage._railTimer);
    var idx = 0;
    var slides = stage.querySelectorAll('.registro-pb__slide');
    /* Asegurar estado inicial: solo la primera visible. */
    slides.forEach(function (slide, i) {
      var on = i === 0;
      slide.classList.toggle('is-active', on);
      slide.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    stage._railTimer = setInterval(function () {
      slides = stage.querySelectorAll('.registro-pb__slide');
      if (slides.length < 2) return;
      slides[idx].classList.remove('is-active');
      slides[idx].setAttribute('aria-hidden', 'true');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('is-active');
      slides[idx].setAttribute('aria-hidden', 'false');
    }, 3500);
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
    startRailRotate(slot);
  }

  function mountRail(rail, opts) {
    if (!rail) return;
    opts = Object.assign({}, opts || {});
    /* Conservar sector ya montado si un remount genérico no lo pasa (p. ej. Adultos). */
    if (!opts.sectorId) {
      opts.sectorId = rail.getAttribute('data-rp-sector') || '';
    }
    if (!opts.sectorName) {
      opts.sectorName = rail.getAttribute('data-rp-sector-name') || '';
    }
    mountSideSlots(rail);
    mountCenterBanner(rail, opts);
    if (opts.sectorId) {
      rail.setAttribute('data-rp-sector', opts.sectorId);
    } else {
      rail.removeAttribute('data-rp-sector');
    }
    if (opts.sectorName) {
      rail.setAttribute('data-rp-sector-name', opts.sectorName);
    }
    if (opts.subcatId) {
      rail.setAttribute('data-rp-subcat', opts.subcatId);
    } else {
      rail.removeAttribute('data-rp-subcat');
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
