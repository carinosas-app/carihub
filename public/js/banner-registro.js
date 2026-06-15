/**
 * Banner registro_superior — perfil, cuenta, funnel publicidad (Opción A, precio único).
 */
(function (global) {
  'use strict';

  var SLOT_ID = 'registro_superior';
  var ROTATE_MS = 5200;

  var PLACEHOLDERS = [
    'img/home/banners/ad-banner-pink-01.png',
    'img/home/banners/ad-banner-black-01.png',
    'img/home/banners/ad-banner-pink-02.png'
  ];

  var TEXTO_COBERTURA =
    'Tu anuncio aparece arriba en todas las pantallas de registro: perfil, cuenta y solicitud de publicidad.';

  var timers = [];

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function linkRegistro() {
    return 'registro-banner.html?slot=' + encodeURIComponent(SLOT_ID);
  }

  function obtenerRenta() {
    var rentals = global.CARIHUB_REGISTRO_BANNER_RENTALS || {};
    return rentals[SLOT_ID] || null;
  }

  function buildDots(count) {
    var html = '<div class="registro-pb__dots" aria-hidden="true">';
    for (var i = 0; i < count; i++) {
      html += '<span class="registro-pb__dot' + (i === 0 ? ' is-on' : '') + '"></span>';
    }
    return html + '</div>';
  }

  function slideImagen(src, alt) {
    return (
      '<div class="registro-pb__slide is-active" aria-hidden="false">' +
        '<img src="' + esc(src) + '" alt="' + esc(alt) + '" decoding="async">' +
      '</div>'
    );
  }

  function slideVacante() {
    return (
      '<div class="registro-pb__slide is-active" aria-hidden="false">' +
        '<span class="registro-pb__vacant-title">Anúnciate aquí</span>' +
        '<span class="registro-pb__vacant-hint">Banner superior · todas las pantallas de registro</span>' +
      '</div>'
    );
  }

  function buildHtml() {
    var rental = obtenerRenta();
    var href = linkRegistro();
    var vacant = ' registro-pb--vacant';
    var slides = '';
    var dots = '';

    if (rental && rental.imagen) {
      vacant = '';
      slides = slideImagen(rental.imagen, rental.titulo || 'Anuncio en registro');
    } else if (PLACEHOLDERS.length > 1) {
      vacant = ' registro-pb--vacant';
      PLACEHOLDERS.forEach(function (src, i) {
        slides +=
          '<div class="registro-pb__slide' + (i === 0 ? ' is-active' : '') + '" aria-hidden="' + (i === 0 ? 'false' : 'true') + '">' +
            '<img src="' + esc(src) + '" alt="" decoding="async" aria-hidden="true">' +
            '<span class="registro-pb__vacant-title">Anúnciate aquí</span>' +
            '<span class="registro-pb__vacant-hint">Espacio disponible · registro</span>' +
          '</div>';
      });
      dots = buildDots(PLACEHOLDERS.length);
    } else {
      slides = slideVacante();
    }

    return (
      '<a class="registro-pb' + vacant + '" href="' + esc(href) + '" data-registro-slot="' + esc(SLOT_ID) + '" aria-label="Espacio publicitario en pantallas de registro">' +
        '<div class="registro-pb__stage" data-registro-pb-stage>' + slides + dots + '</div>' +
      '</a>'
    );
  }

  function goSlide(stage, nextIdx) {
    if (!stage) return 0;
    var slides = stage.querySelectorAll('.registro-pb__slide');
    var dots = stage.querySelectorAll('.registro-pb__dot');
    if (!slides.length) return 0;
    var idx = ((nextIdx % slides.length) + slides.length) % slides.length;
    slides.forEach(function (sl, i) {
      var on = i === idx;
      sl.classList.toggle('is-active', on);
      sl.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-on', i === idx);
    });
    return idx;
  }

  function stopRotation() {
    timers.forEach(function (t) { clearInterval(t); });
    timers = [];
  }

  function startRotation(root) {
    stopRotation();
    var stages = (root || document).querySelectorAll('[data-registro-pb-stage]');
    stages.forEach(function (stage) {
      var slides = stage.querySelectorAll('.registro-pb__slide');
      if (slides.length < 2) return;
      var state = { idx: 0 };
      var loop = setInterval(function () {
        state.idx = goSlide(stage, state.idx + 1);
      }, ROTATE_MS);
      timers.push(loop);
    });
  }

  function mount(el) {
    if (!el) return;
    el.innerHTML = buildHtml();
    el.dataset.registroBannerMounted = '1';
  }

  function boot() {
    document.querySelectorAll('[data-registro-banner-slot]').forEach(function (el) {
      delete el.dataset.registroBannerMounted;
      mount(el);
    });
    startRotation();
  }

  global.CariHubBannerRegistro = {
    SLOT_ID: SLOT_ID,
    TEXTO_COBERTURA: TEXTO_COBERTURA,
    remount: boot,
    start: startRotation,
    stop: stopRotation
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  global.addEventListener('load', function () { startRotation(); });
})(typeof window !== 'undefined' ? window : globalThis);
