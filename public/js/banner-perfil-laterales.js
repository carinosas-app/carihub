/**
 * Perfil — laterales midband perfil_estados · perfil_libe
 * (misma estructura visual que Resultados; slots de inventario de perfil).
 */
(function (global) {
  'use strict';

  var MAP = {
    perfilMidEstados: 'perfil_estados',
    perfilMidLibe: 'perfil_libe'
  };

  var LABELS = {
    estados: 'Estado publicado',
    libe: 'En vivo · LIBE'
  };

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function linkRegistro(slotId) {
    return 'registro-banner.html?slot=' + encodeURIComponent(slotId);
  }

  function labelForSlot(slotId) {
    if (/_libe$/.test(String(slotId || ''))) return LABELS.libe;
    return LABELS.estados;
  }

  function previewImg(kind) {
    var p = global.CariHubSlotPreviewImages;
    if (p && p.get) return p.get(kind);
    var ph = global.CariHubMediaPlaceholders;
    if (ph && ph.url) return ph.url(kind);
    return kind === 'libe'
      ? 'assets/placeholders/live-placeholder.webp'
      : 'assets/placeholders/estado-placeholder.webp';
  }

  function buildEstadoMockSlide() {
    return (
      '<div class="pb-slot__slide is-active res-midband__mock res-midband__mock--estado" aria-hidden="false">' +
        '<img class="res-midband__mock-estado-photo ch-media-ph ch-media-ph--estado" src="' + esc(previewImg('estados')) + '" alt="Estado publicado — Mi estado" width="380" height="188" decoding="async">' +
        '<span class="res-sr-vacant-msg">Anúnciate aquí</span>' +
      '</div>'
    );
  }

  function buildLiveMockSlide() {
    return (
      '<div class="pb-slot__slide is-active res-midband__mock res-midband__mock--live" aria-hidden="false">' +
        '<img class="res-midband__mock-live-photo ch-media-ph ch-media-ph--live" src="' + esc(previewImg('libe')) + '" alt="Transmisión en vivo — LIBE" width="380" height="188" decoding="async">' +
        '<span class="res-sr-vacant-msg">Anúnciate aquí</span>' +
      '</div>'
    );
  }

  function buildBannerHTML(slotId) {
    var rentals = global.CARIHUB_PERFIL_RENTALS || {};
    var rental = rentals[String(slotId || '')] || null;
    var href = linkRegistro(slotId);
    var label = labelForSlot(slotId);
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
    } else if (/_libe$/.test(String(slotId || ''))) {
      slides = buildLiveMockSlide();
    } else {
      slides = buildEstadoMockSlide();
    }

    return (
      '<a class="pb-slot res-midband__banner' + vacantClass + '" href="' + esc(href) + '" data-perfil-slot="' + esc(slotId) + '" aria-label="' + esc(label) + '">' +
        '<div class="pb-slot__stage" data-pb-stage>' + slides + '</div>' +
      '</a>'
    );
  }

  function mount() {
    Object.keys(MAP).forEach(function (elId) {
      var el = document.getElementById(elId);
      if (!el) return;
      el.innerHTML = buildBannerHTML(MAP[elId]);
    });
  }

  global.CariHubBannerPerfilLaterales = {
    mount: mount
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
