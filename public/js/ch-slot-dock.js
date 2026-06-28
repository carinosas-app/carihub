/**
 * Utilidad compartida — mini-banners laterales (Estados · LIBE) en dock flotante.
 */
(function (global) {
  'use strict';

  var PREVIEW = global.CariHubSlotPreviewImages || {};
  var PH = global.CariHubMediaPlaceholders || {};
  function mockSrc(kind) {
    if (PH.url) return PH.url(kind);
    if (PREVIEW.get) return PREVIEW.get(kind);
    return kind === 'libe' ? 'assets/placeholders/live-placeholder.webp' : 'assets/placeholders/estado-placeholder.webp';
  }
  var MOCKS = {
    estados: {
      src: mockSrc('estados'),
      alt: 'Estados — renta espacio publicitario',
      label: 'Estado',
      vacantMsg: 'Anúnciate aquí',
      vacantHint: 'Estados y zonas'
    },
    libe: {
      src: mockSrc('libe'),
      alt: 'En vivo — transmisión LIBE',
      label: 'LIBE',
      vacantMsg: 'Anúnciate aquí',
      vacantHint: 'Transmite en vivo'
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

  function buildBannerHTML(slotId, rental, opts) {
    opts = opts || {};
    var kind = mockKind(slotId);
    var mock = MOCKS[kind];
    var href = linkRegistro(slotId);
    var vacantClass = ' ch-slot-dock__banner--vacant';
    var slide = '';
    var isRail = opts.layout === 'rail';
    var ariaLabel = rental && rental.titulo ? rental.titulo : (mock.alt + ' — Anúnciate aquí');

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
          '<span class="ch-slot-dock__mock-bg ch-slot-dock__mock-bg--' + kind + '" aria-hidden="true"></span>' +
          '<img class="ch-slot-dock__img ch-slot-dock__img--mock" src="' + esc(mock.src) + '" alt="' + esc(mock.alt) + '" decoding="async">' +
          '<span class="ch-slot-dock__slot-kind">' + esc(mock.label) + '</span>' +
          '<span class="ch-slot-dock__vacant">' + esc(mock.vacantMsg) + '</span>' +
          (isRail ? '<span class="ch-slot-dock__vacant-hint">' + esc(mock.vacantHint) + '</span>' : '') +
        '</div>';
    }

    return (
      '<a class="ch-slot-dock__banner' + vacantClass + (isRail ? ' ch-slot-dock__banner--rail' : '') + '" href="' + esc(href) + '" data-ch-slot="' + esc(slotId) + '" aria-label="' + esc(ariaLabel) + '">' +
        (!isRail ? '<span class="ch-slot-dock__label">' + esc(mock.label) + '</span>' : '') +
        '<div class="ch-slot-dock__stage">' + slide + '</div>' +
      '</a>'
    );
  }

  function mountDock(config) {
    config = config || {};
    var rentals = config.rentals || {};
    var map = config.map || {};
    var layout = config.layout || '';

    Object.keys(map).forEach(function (elId) {
      var slotId = map[elId];
      var el = document.getElementById(elId);
      if (!el) return;
      el.className = 'ch-slot-dock__item' + (layout === 'rail' ? ' ch-slot-dock__item--rail' : '');
      el.innerHTML = buildBannerHTML(slotId, rentals[slotId] || null, { layout: layout });
    });
  }

  global.CariHubSlotDock = {
    buildBannerHTML: buildBannerHTML,
    mountDock: mountDock,
    linkRegistro: linkRegistro
  };
})(typeof window !== 'undefined' ? window : globalThis);
