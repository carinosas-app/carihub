/**
 * Laterales horizontales en pantalla de resultados (con perfiles):
 * resultados_estados · resultados_libe — vista previa con fotos reales.
 */
(function (global) {
  'use strict';

  var SLOTS = {
    estados: 'resultados_estados',
    libe: 'resultados_libe'
  };

  var LABELS = {
    resultados_estados: 'Estado publicado',
    resultados_libe: 'En vivo · LIBE'
  };

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function linkRegistro(slotId) {
    return 'registro-banner.html?slot=' + encodeURIComponent(slotId);
  }

  function obtenerRenta(slotId) {
    var rentals = global.CARIHUB_RESULTADOS_LATERALES_RENTALS || {};
    return rentals[String(slotId || '')] || null;
  }

  function buildEstadoMockSlide() {
    return (
      '<div class="pb-slot__slide is-active res-midband__mock res-midband__mock--estado" aria-hidden="false">' +
        '<img class="res-midband__mock-estado-photo" src="img/resultados-demo/estado-publicado-libe.png" alt="Estado publicado — Mi estado" width="380" height="188" decoding="async">' +
        '<span class="res-sr-vacant-msg">Anúnciate aquí</span>' +
      '</div>'
    );
  }

  function buildLiveMockSlide() {
    return (
      '<div class="pb-slot__slide is-active res-midband__mock res-midband__mock--live" aria-hidden="false">' +
        '<img class="res-midband__mock-live-photo" src="img/resultados-demo/live-en-vivo-libe.png" alt="Transmisión en vivo — valeria.music" width="380" height="188" decoding="async">' +
        '<span class="res-sr-vacant-msg">Anúnciate aquí</span>' +
      '</div>'
    );
  }

  function buildVacantSlide(slotId) {
    if (slotId === SLOTS.libe) return buildLiveMockSlide();
    return buildEstadoMockSlide();
  }

  function buildBannerHTML(slotId) {
    var rental = obtenerRenta(slotId);
    var href = linkRegistro(slotId);
    var label = LABELS[slotId] || '';
    var vacantClass = ' res-midband__banner--vacant';
    var slides = '';
    var w = 380;
    var h = 188;

    if (rental && rental.imagen) {
      href = rental.url || href;
      vacantClass = ' res-midband__banner--rented';
      slides =
        '<div class="pb-slot__slide is-active" aria-hidden="false">' +
          '<img class="res-midband__preview-img" src="' + esc(rental.imagen) + '" alt="' + esc(rental.titulo || label) + '" width="' + w + '" height="' + h + '" decoding="async">' +
        '</div>';
    } else {
      slides = buildVacantSlide(slotId);
    }

    return (
      '<a class="pb-slot res-midband__banner' + vacantClass + '" href="' + esc(href) + '" data-resultados-slot="' + esc(slotId) + '" aria-label="' + esc(label) + '">' +
        '<div class="pb-slot__stage" data-pb-stage>' + slides + '</div>' +
      '</a>'
    );
  }

  function mount() {
    var map = {
      resMidEstados: SLOTS.estados,
      resMidLibe: SLOTS.libe
    };

    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.innerHTML = buildBannerHTML(map[id]);
    });
  }

  global.CARIHUB_RESULTADOS_LATERALES_RENTALS = global.CARIHUB_RESULTADOS_LATERALES_RENTALS || {};

  global.CariHubBannerResultadosLaterales = {
    SLOTS: SLOTS,
    mount: mount,
    linkRegistro: linkRegistro
  };

  function boot() {
    mount();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  global.addEventListener('load', mount);
})(typeof window !== 'undefined' ? window : globalThis);
