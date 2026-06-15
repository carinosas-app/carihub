/**
 * Utilidad compartida — mini-banners laterales (Estados · LIBE) en dock flotante.
 */
(function (global) {
  'use strict';

  var MOCKS = {
    estados: {
      src: 'img/resultados-demo/estado-publicado-libe.png',
      alt: 'Estado publicado',
      label: 'Estado'
    },
    libe: {
      src: 'img/resultados-demo/live-en-vivo-libe.png',
      alt: 'En vivo LIBE',
      label: 'LIBE'
    }
  };

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function linkRegistro(slotId) {
    return 'registro-banner.html?slot=' + encodeURIComponent(slotId);
  }

  function mockKind(slotId) {
    return /_libe$/.test(String(slotId || '')) ? 'libe' : 'estados';
  }

  function buildBannerHTML(slotId, rental) {
    var kind = mockKind(slotId);
    var mock = MOCKS[kind];
    var href = linkRegistro(slotId);
    var vacantClass = ' ch-slot-dock__banner--vacant';
    var slide = '';

    if (rental && rental.imagen) {
      href = rental.url || href;
      vacantClass = ' ch-slot-dock__banner--rented';
      slide =
        '<div class="ch-slot-dock__slide is-active" aria-hidden="false">' +
          '<img class="ch-slot-dock__img" src="' + esc(rental.imagen) + '" alt="' + esc(rental.titulo || mock.alt) + '" decoding="async">' +
        '</div>';
    } else {
      slide =
        '<div class="ch-slot-dock__slide is-active ch-slot-dock__mock ch-slot-dock__mock--' + kind + '" aria-hidden="false">' +
          '<img class="ch-slot-dock__img" src="' + esc(mock.src) + '" alt="' + esc(mock.alt) + '" decoding="async">' +
          '<span class="ch-slot-dock__vacant">Anúnciate</span>' +
        '</div>';
    }

    return (
      '<a class="ch-slot-dock__banner' + vacantClass + '" href="' + esc(href) + '" data-ch-slot="' + esc(slotId) + '" aria-label="' + esc(mock.alt) + '">' +
        '<span class="ch-slot-dock__label">' + esc(mock.label) + '</span>' +
        '<div class="ch-slot-dock__stage">' + slide + '</div>' +
      '</a>'
    );
  }

  function mountDock(config) {
    config = config || {};
    var rentals = config.rentals || {};
    var map = config.map || {};

    Object.keys(map).forEach(function (elId) {
      var slotId = map[elId];
      var el = document.getElementById(elId);
      if (!el) return;
      el.className = 'ch-slot-dock__item';
      el.innerHTML = buildBannerHTML(slotId, rentals[slotId] || null);
    });
  }

  global.CariHubSlotDock = {
    buildBannerHTML: buildBannerHTML,
    mountDock: mountDock,
    linkRegistro: linkRegistro
  };
})(typeof window !== 'undefined' ? window : globalThis);
