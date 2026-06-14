/**
 * Inventario propio: banners en pantallas sin resultados (global, aparte de Home).
 */
(function (global) {
  'use strict';

  var SLOTS = [
    'sin_resultados_izquierda',
    'sin_resultados_centro',
    'sin_resultados_derecha',
    'sin_resultados_inferior',
    'sin_resultados_estados',
    'sin_resultados_libe'
  ];

  var TEXTO_COBERTURA =
    'Tu anuncio aparece en todas las pantallas del sitio donde un usuario busque y no encuentre resultados (cualquier categoría, país, estado, ciudad u otro filtro).';

  var PLACEHOLDERS = {
    sin_resultados_izquierda: [
      'img/home/banners/ad-banner-pink-01.png',
      'img/home/banners/ad-banner-black-01.png',
      'img/home/banners/ad-banner-pink-02.png'
    ],
    sin_resultados_centro: [
      'banners/resultados/resultados-crecer-centro.png',
      'banners/resultados/resultados-centro-1.png'
    ],
    sin_resultados_derecha: [
      'img/home/banners/ad-banner-black-02.png',
      'img/home/banners/ad-banner-pink-03.png',
      'img/home/banners/ad-banner-black-03.png'
    ],
    sin_resultados_inferior: [
      'img/home/banners/ad-banner-pink-01.png',
      'img/home/banners/ad-banner-black-02.png',
      'img/home/banners/ad-banner-pink-03.png'
    ]
  };

  var estadoResultados = { guardado: false, pbHTML: '', bottomHTML: '', bottomParent: null };

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function esSlotSinResultados(slotId) {
    return SLOTS.indexOf(String(slotId || '')) >= 0 || /^sin_resultados_/.test(String(slotId || ''));
  }

  function linkRegistro(slotId) {
    return 'registro-banner.html?slot=' + encodeURIComponent(slotId);
  }

  function obtenerRenta(slotId) {
    var rentals = global.CARIHUB_SIN_RESULTADOS_RENTALS || {};
    return rentals[String(slotId || '')] || null;
  }

  function imagenesPlaceholder(slotId) {
    return (PLACEHOLDERS[slotId] || PLACEHOLDERS.sin_resultados_izquierda).slice();
  }

  function buildDots(count) {
    var html = '<div class="pb-slot__dots" aria-hidden="true">';
    for (var i = 0; i < count; i++) {
      html += '<span class="pb-slot__dot' + (i === 0 ? ' is-on' : '') + '"></span>';
    }
    return html + '</div>';
  }

  function slideVacante(src, alt, width, height) {
    return (
      '<div class="pb-slot__slide is-active" aria-hidden="false">' +
        '<img src="' + esc(src) + '" alt="" width="' + width + '" height="' + height + '" decoding="async" aria-hidden="true">' +
        '<span class="res-sr-vacant-msg">Anúnciate aquí</span>' +
        '<span class="res-sr-vacant-hint">Espacio sin resultados</span>' +
      '</div>'
    );
  }

  function slideRentado(rental, alt, width, height) {
    return (
      '<div class="pb-slot__slide is-active" aria-hidden="false">' +
        '<img src="' + esc(rental.imagen) + '" alt="' + esc(rental.titulo || alt) + '" width="' + width + '" height="' + height + '" decoding="async">' +
      '</div>'
    );
  }

  function buildPbSlides(slotId, opts) {
    opts = opts || {};
    var rental = obtenerRenta(slotId);
    var alt = opts.alt || 'Espacio sin resultados';
    var w = opts.center ? 620 : 380;
    var h = 158;
    var slides = '';
    var href = linkRegistro(slotId);
    var vacantClass = ' pb-slot--sr-vacant';

    if (rental && rental.imagen) {
      slides = slideRentado(rental, alt, w, h);
      href = rental.url || href;
      vacantClass = '';
    } else {
      var imgs = imagenesPlaceholder(slotId);
      imgs.forEach(function (src, i) {
        var active = i === 0 ? ' is-active' : '';
        var hidden = i === 0 ? 'false' : 'true';
        slides +=
          '<div class="pb-slot__slide' + active + '" aria-hidden="' + hidden + '">' +
            '<img src="' + esc(src) + '" alt="" width="' + w + '" height="' + h + '" decoding="async" aria-hidden="true">' +
            '<span class="res-sr-vacant-msg">Anúnciate aquí</span>' +
            '<span class="res-sr-vacant-hint">Espacio sin resultados</span>' +
          '</div>';
      });
    }

    return {
      slides: slides,
      count: rental && rental.imagen ? 1 : imagenesPlaceholder(slotId).length,
      href: href,
      vacantClass: vacantClass
    };
  }

  function buildPbSlotHTML(slotId, opts) {
    opts = opts || {};
    var built = buildPbSlides(slotId, opts);
    var extraClass = (opts.center ? ' pb--center' : '') + built.vacantClass;
    return (
      '<a class="pb-slot' + extraClass + '" href="' + esc(built.href) + '" data-sin-resultados-slot="' + esc(slotId) + '" aria-label="' + esc(opts.alt || 'Sin resultados') + '">' +
        '<div class="pb-slot__stage" data-pb-stage>' + built.slides + buildDots(built.count) + '</div>' +
      '</a>'
    );
  }

  function renderLateralHTML(lado) {
    var slotId = lado === 'izq' ? 'sin_resultados_estados' : 'sin_resultados_libe';
    var label = lado === 'izq' ? 'Estados y zonas' : 'LIBE';
    var rental = obtenerRenta(slotId);
    var href = rental && rental.url ? rental.url : linkRegistro(slotId);
    var vacantClass = rental && rental.imagen ? '' : ' res-vacio-side__banner--vacant';

    if (rental && rental.imagen) {
      return (
        '<a class="res-vacio-side__banner" href="' + esc(href) + '" data-sin-resultados-slot="' + esc(slotId) + '" aria-label="Anuncio ' + esc(label) + '">' +
          '<span class="res-vacio-side__label">' + esc(label) + '</span>' +
          '<img src="' + esc(rental.imagen) + '" alt="' + esc(rental.titulo || label) + '" width="160" height="320" decoding="async">' +
        '</a>'
      );
    }

    return (
      '<a class="res-vacio-side__banner res-vacio-side__banner--vacant" href="' + esc(href) + '" data-sin-resultados-slot="' + esc(slotId) + '" aria-label="Anúnciate aquí — ' + esc(label) + '">' +
        '<span class="res-vacio-side__label">' + esc(label) + '</span>' +
        '<span class="res-sr-vacant-msg res-sr-vacant-msg--lateral">Anúnciate aquí</span>' +
        '<span class="res-sr-vacant-hint res-sr-vacant-hint--lateral">Sin resultados</span>' +
      '</a>'
    );
  }

  function guardarOriginales(wrap) {
    if (estadoResultados.guardado) return;
    var pb = wrap.querySelector('.pb');
    var bottom = wrap.querySelector('.res-bottom');
    estadoResultados.pbHTML = pb ? pb.innerHTML : '';
    estadoResultados.bottomHTML = bottom ? bottom.outerHTML : '';
    estadoResultados.bottomParent = bottom ? bottom.parentNode : null;
    estadoResultados.guardado = true;
  }

  function aplicarInferior(bottom) {
    if (!bottom) return;
    var slotId = 'sin_resultados_inferior';
    var rental = obtenerRenta(slotId);
    bottom.href = rental && rental.url ? rental.url : linkRegistro(slotId);
    bottom.setAttribute('data-sin-resultados-slot', slotId);
    bottom.classList.toggle('res-bottom--sr-vacant', !(rental && rental.imagen));

    var photo = bottom.querySelector('.res-bottom__photo img');
    if (photo && rental && rental.imagen) {
      photo.src = rental.imagen;
      photo.alt = rental.titulo || 'Anuncio sin resultados';
    }

    var vacantMsg = bottom.querySelector('.res-sr-vacant-msg--bottom');
    if (!vacantMsg && !(rental && rental.imagen)) {
      var span = document.createElement('span');
      span.className = 'res-sr-vacant-msg res-sr-vacant-msg--bottom';
      span.textContent = 'Anúnciate aquí';
      bottom.querySelector('.res-bottom__main')?.appendChild(span);
    } else if (vacantMsg) {
      vacantMsg.style.display = rental && rental.imagen ? 'none' : '';
    }

    if (rental && rental.titulo) {
      var h = bottom.querySelector('.res-bottom__h');
      if (h) h.textContent = rental.titulo;
    }
  }

  function restaurar(wrap) {
    if (!estadoResultados.guardado) return;
    var pb = wrap.querySelector('.pb');
    if (pb && estadoResultados.pbHTML) pb.innerHTML = estadoResultados.pbHTML;
    var bottom = wrap.querySelector('.res-bottom');
    if (!bottom && estadoResultados.bottomHTML && estadoResultados.bottomParent) {
      estadoResultados.bottomParent.insertAdjacentHTML('beforeend', estadoResultados.bottomHTML);
    }
    if (global.CariHubResultadosBanners && global.CariHubResultadosBanners.start) {
      global.CariHubResultadosBanners.start();
    }
  }

  function syncResultadosPage(esSinResultados) {
    var wrap = document.querySelector('.resultados-wrap');
    if (!wrap) return;

    if (!esSinResultados) {
      restaurar(wrap);
      return;
    }

    guardarOriginales(wrap);
    var pb = wrap.querySelector('.pb');
    if (pb) {
      pb.innerHTML =
        buildPbSlotHTML('sin_resultados_izquierda', { alt: 'Sin resultados — izquierda' }) +
        buildPbSlotHTML('sin_resultados_centro', { alt: 'Sin resultados — centro', center: true }) +
        buildPbSlotHTML('sin_resultados_derecha', { alt: 'Sin resultados — derecha' });
    }
    aplicarInferior(wrap.querySelector('.res-bottom'));

    if (global.CariHubResultadosBanners && global.CariHubResultadosBanners.start) {
      global.CariHubResultadosBanners.start();
    }
  }

  function textoCoberturaParaSlot(slotId) {
    return esSlotSinResultados(slotId) ? TEXTO_COBERTURA : '';
  }

  global.CARIHUB_SIN_RESULTADOS_RENTALS = global.CARIHUB_SIN_RESULTADOS_RENTALS || {};

  global.CariHubBannerSinResultados = {
    SLOTS: SLOTS,
    TEXTO_COBERTURA: TEXTO_COBERTURA,
    esSlotSinResultados: esSlotSinResultados,
    obtenerRenta: obtenerRenta,
    renderLateralHTML: renderLateralHTML,
    syncResultadosPage: syncResultadosPage,
    textoCoberturaParaSlot: textoCoberturaParaSlot,
    linkRegistro: linkRegistro
  };
})(typeof window !== 'undefined' ? window : globalThis);
