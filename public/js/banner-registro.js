/**
 * Banner registro_superior — perfil, cuenta, funnel publicidad (Opción A, precio único).
 */
(function (global) {
  'use strict';

  var SLOT_ID = 'registro_superior';
  var ROTATE_MS = 5200;

  var FORM_NEON_SLIDES = [
    {
      variant: 1,
      title: 'Publica en CariHub',
      hint: 'Perfiles y negocios en directorio premium',
      cta: 'Anuncia tu perfil',
      bg: 'img/home/banners/registro-neon-city-01.png',
      scrim: 'reference'
    },
    {
      variant: 2,
      title: 'Tu espacio visible',
      hint: 'Resultados, perfil y contacto configurable',
      cta: 'Completa tu registro',
      bg: 'img/home/banners/registro-neon-city-02.png'
    },
    {
      variant: 3,
      title: 'Mes de prueba gratis',
      hint: 'Solicitud revisada por administración',
      cta: 'Enviar solicitud',
      bg: 'img/home/banners/registro-neon-city-03.png'
    }
  ];
  var NEON_SLIDES = [
    {
      variant: 1,
      title: '¡PUBLICA EN CARIÑOSAS!',
      hint: 'Perfiles y negocios en un directorio premium',
      cta: 'Anuncia tu perfil',
      bg: 'img/home/banners/registro-neon-city-01.png',
      scrim: 'reference'
    },
    {
      variant: 2,
      title: 'DIRECTORIO PARA TODO NEGOCIO',
      hint: 'Adultos, bienestar, servicios y mucho más',
      cta: 'Publica tu local',
      bg: 'img/home/banners/registro-neon-city-02.png'
    },
    {
      variant: 3,
      title: 'RENTA TU VISIBILIDAD',
      hint: 'Espacios publicitarios para perfiles y marcas',
      cta: 'Ver planes premium',
      bg: 'img/home/banners/registro-neon-city-03.png'
    }
  ];

  var TEXTO_COBERTURA =
    'Renta espacio publicitario en el directorio Cariñosas: perfiles, negocios y solicitud de banners premium.';

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
    return slideNeon(NEON_SLIDES[0], true);
  }

  function slideNeon(config, active) {
    var scrimClass = config.scrim ? ' registro-pb__neon-scrim--' + config.scrim : '';
    return (
      '<div class="registro-pb__slide registro-pb__slide--neon registro-pb__slide--neon-' + config.variant +
      (active ? ' is-active' : '') + '" aria-hidden="' + (active ? 'false' : 'true') + '">' +
        '<div class="registro-pb__neon-bg" aria-hidden="true">' +
          '<img class="registro-pb__neon-photo" src="' + esc(config.bg) + '" alt="" decoding="async" fetchpriority="' +
          (config.variant === 1 ? 'high' : 'low') + '">' +
          '<span class="registro-pb__neon-scrim' + scrimClass + '"></span>' +
          '<span class="registro-pb__neon-vignette"></span>' +
          '<span class="registro-pb__neon-grain"></span>' +
        '</div>' +
        '<div class="registro-pb__neon-content">' +
          '<span class="registro-pb__neon-title">' + esc(config.title) + '</span>' +
          (config.hint ? '<span class="registro-pb__neon-hint">' + esc(config.hint) + '</span>' : '') +
          '<span class="registro-pb__neon-cta">' + esc(config.cta) + '</span>' +
        '</div>' +
      '</div>'
    );
  }

  function buildHtml() {
    var rental = obtenerRenta();
    var href = linkRegistro();
    var extraClass = ' registro-pb--neon';
    var slides = '';
    var dots = '';

    if (rental && rental.imagen) {
      extraClass = '';
      href = rental.url || href;
      slides = slideImagen(rental.imagen, rental.titulo || 'Anuncio en registro');
    } else if (NEON_SLIDES.length > 1) {
      NEON_SLIDES.forEach(function (config, i) {
        slides += slideNeon(config, i === 0);
      });
      dots = buildDots(NEON_SLIDES.length);
    } else {
      slides = slideVacante();
    }

    return (
      '<a class="registro-pb' + extraClass + '" href="' + esc(href) + '" data-registro-slot="' + esc(SLOT_ID) + '" aria-label="Renta de espacio publicitario en el directorio Cariñosas para perfiles y negocios">' +
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

  function mountNeonSlides(el, slides, extraClass, sectorAttr) {
    if (!el || !slides || !slides.length) return;
    var href = linkRegistro();
    var html = '';
    slides.forEach(function (config, i) {
      html += slideNeon(config, i === 0);
    });
    el.innerHTML =
      '<a class="registro-pb registro-pb--neon' + (extraClass || '') + '" href="' + esc(href) + '"' +
      (sectorAttr ? ' data-registro-sector="' + esc(sectorAttr) + '"' : '') +
      ' aria-label="Espacio publicitario del registro CariHub">' +
        '<div class="registro-pb__stage" data-registro-pb-stage>' + html + buildDots(slides.length) + '</div>' +
      '</a>';
    el.dataset.registroBannerMounted = '1';
  }

  function truncateBannerText(text, max) {
    text = String(text || '').trim();
    if (text.length <= max) return text;
    return text.slice(0, max - 1).trim() + '…';
  }

  function sectorBannerSlides(sectorId, subcatId, subcatName, forForm) {
    var picker = global.CariHubSectorSubcatPicker;
    var imgs = [];
    var i;
    for (i = 0; i < 3; i++) {
      if (picker && picker.imageForSubcat) {
        imgs.push(picker.imageForSubcat(sectorId, subcatId || sectorId, i));
      }
    }
    if (!imgs.length) imgs = ['img/home/sectores/sector-03-salud.png'];
    var subLabel = truncateBannerText(subcatName || 'Tu perfil', forForm ? 28 : 42);
    var titles = forForm
      ? [subLabel, 'Directorio CariHub', 'Completa tu registro']
      : [(subcatName || 'Tu perfil') + ' en CariHub', 'Directorio profesional', 'Publica tu servicio'];
    var hints = forForm
      ? ['Visible en resultados', 'Contacto desde panel', 'Foto y galería']
      : ['Datos públicos visibles en resultados', 'Contacto configurable desde tu panel', 'Imagen principal y galería'];
    var ctas = forForm
      ? ['Datos públicos', 'Tu categoría', 'Continuar']
      : ['Completar registro', 'Ver mi categoría', 'Continuar paso 3'];
    return imgs.slice(0, 3).map(function (bg, idx) {
      return {
        variant: idx + 1,
        title: titles[idx] || titles[0],
        hint: hints[idx] || hints[0],
        cta: ctas[idx] || ctas[0],
        bg: bg,
        scrim: 'reference'
      };
    });
  }

  function mountForSector(el, sectorId, subcatId, subcatName, forForm) {
    if (!el) return;
    if (!sectorId || sectorId === 'adultos') {
      if (forForm) mountFormPageBanner(el);
      else mount(el);
      return;
    }
    mountNeonSlides(
      el,
      sectorBannerSlides(sectorId, subcatId, subcatName, !!forForm),
      ' registro-pb--sector',
      sectorId
    );
  }

  function mountFormPageBanner(el) {
    mountNeonSlides(el, FORM_NEON_SLIDES, ' registro-pb--form');
  }

  function refreshFormPageBanners(sectorId, subcatId, subcatName) {
    document.querySelectorAll('.rp-banner-form [data-registro-banner-slot="' + SLOT_ID + '"]').forEach(function (el) {
      delete el.dataset.registroBannerMounted;
      mountForSector(el, sectorId, subcatId, subcatName, true);
    });
    startRotation(document);
  }

  function refreshSectorBanners(sectorId, subcatId, subcatName) {
    document.querySelectorAll('[data-registro-banner-slot="' + SLOT_ID + '"]').forEach(function (el) {
      if (el.closest('.rp-banner-form')) return;
      delete el.dataset.registroBannerMounted;
      if (sectorId && sectorId !== 'adultos') {
        mountForSector(el, sectorId, subcatId, subcatName, false);
      } else {
        mount(el);
      }
    });
    startRotation();
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
    mountForSector: mountForSector,
    refreshSectorBanners: refreshSectorBanners,
    refreshFormPageBanners: refreshFormPageBanners,
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
