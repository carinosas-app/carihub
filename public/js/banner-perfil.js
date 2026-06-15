/**
 * Banners publicitarios en perfil.html — slots perfil_* desde Firestore.
 * Solo reemplaza el HTML demo cuando hay renta activa con imagen https.
 */
(function (global) {
  'use strict';

  var SLOTS = [
    { id: 'perfil_izquierda', root: '.top-banners .banner-slot--side:first-of-type' },
    { id: 'perfil_centro', root: '.top-banners .banner-slot--center' },
    { id: 'perfil_derecha', root: '.top-banners .banner-slot--side:last-of-type' },
    { id: 'perfil_inferior', root: '.banner-bottom-wrap .banner-slot' }
  ];

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function linkRegistro(slotId) {
    var base = (global.location && global.location.pathname.indexOf('/preview/') >= 0)
      ? '../registro-banner.html'
      : 'registro-banner.html';
    return base + '?slot=' + encodeURIComponent(slotId);
  }

  function obtenerRenta(slotId) {
    var rentals = global.CARIHUB_PERFIL_RENTALS || {};
    return rentals[String(slotId || '')] || null;
  }

  function buildRentedStage(rental, opts) {
    opts = opts || {};
    var wrapClass = opts.wide ? 'side-ad side-ad--img side-ad--img-wide' : 'side-ad side-ad--img';
    return (
      '<div class="banner-slot__slide is-active" data-res-ad-type="image" aria-hidden="false">' +
        '<div class="' + wrapClass + '">' +
          '<img class="side-ad__img" src="' + esc(rental.imagen) + '" alt="' + esc(rental.titulo || 'Anuncio') + '" decoding="async">' +
        '</div>' +
      '</div>'
    );
  }

  function buildRentedPbStage(rental) {
    return (
      '<div class="pb-slot__slide is-active" aria-hidden="false">' +
        '<img src="' + esc(rental.imagen) + '" alt="' + esc(rental.titulo || 'Anuncio') + '" decoding="async">' +
      '</div>'
    );
  }

  function aplicarRentaPbSlot(anchor, slotId) {
    if (!anchor) return false;
    var rental = obtenerRenta(slotId);
    if (!rental || !rental.imagen) return false;

    anchor.href = rental.url || linkRegistro(slotId);
    anchor.setAttribute('data-perfil-slot', slotId);
    anchor.classList.add('pb-slot--rented');
    anchor.setAttribute('aria-label', rental.titulo || anchor.getAttribute('aria-label') || 'Anuncio');

    var stage = anchor.querySelector('.pb-slot__stage');
    if (stage) stage.innerHTML = buildRentedPbStage(rental);
    return true;
  }

  function mountPreviewPb() {
    var pb = document.querySelector('.pb');
    if (!pb) return false;

    var ids = ['perfil_izquierda', 'perfil_centro', 'perfil_derecha'];
    var changed = false;
    var idx = 0;

    pb.querySelectorAll('.pb-slot').forEach(function (anchor) {
      if (anchor.classList.contains('pb-slot--bottom')) return;
      if (ids[idx] && aplicarRentaPbSlot(anchor, ids[idx])) changed = true;
      idx += 1;
    });

    document.querySelectorAll('.pb-slot--bottom').forEach(function (anchor) {
      if (aplicarRentaPbSlot(anchor, 'perfil_inferior')) changed = true;
    });

    return changed;
  }

  function aplicarRenta(anchor, slotId) {
    if (!anchor) return false;
    var rental = obtenerRenta(slotId);
    if (!rental || !rental.imagen) return false;

    anchor.href = rental.url || linkRegistro(slotId);
    anchor.setAttribute('data-perfil-slot', slotId);
    anchor.classList.add('banner-slot--rented');
    anchor.setAttribute('aria-label', rental.titulo || anchor.getAttribute('aria-label') || 'Anuncio');

    var stage = anchor.querySelector('.banner-slot__stage');
    if (!stage) return true;

    stage.innerHTML = buildRentedStage(rental, {
      wide: anchor.classList.contains('banner-slot--bottom')
    });
    return true;
  }

  function mount() {
    var changed = false;
    SLOTS.forEach(function (cfg) {
      var anchor = document.querySelector(cfg.root);
      if (aplicarRenta(anchor, cfg.id)) changed = true;
    });
    if (mountPreviewPb()) changed = true;
    return changed;
  }

  global.CARIHUB_PERFIL_RENTALS = global.CARIHUB_PERFIL_RENTALS || {};

  global.CariHubBannerPerfil = {
    SLOTS: SLOTS,
    mount: mount,
    mountPreviewPb: mountPreviewPb,
    aplicarRenta: aplicarRenta,
    linkRegistro: linkRegistro
  };
})(typeof window !== 'undefined' ? window : globalThis);
