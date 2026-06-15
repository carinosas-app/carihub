/**
 * Banners superiores e inferior — pantalla de resultados (con perfiles).
 * Slots: resultados_* · resultados_pais_* · resultados_estado_*
 */
(function (global) {
  'use strict';

  var ESPACIOS = ['izquierda', 'centro', 'derecha'];
  var SLOT_INFERIOR = 'inferior';

  var PLACEHOLDERS = {
    izquierda: [
      'banners/resultados/resultados-es-nueva-izq.png',
      'banners/resultados/resultados1.webp',
      'banners/resultados/resultados3.webp'
    ],
    centro: [
      'banners/resultados/resultados-crecer-centro.png',
      'banners/resultados/resultados-centro-1.png',
      'banners/resultados/resultados-centro-2.png',
      'banners/resultados/resultados-centro-3.png'
    ],
    derecha: [
      'banners/resultados/resultados-es-nueva-der.png',
      'banners/resultados/resultados2.webp',
      'banners/resultados/resultados1.webp'
    ]
  };

  var LABELS = {
    izquierda: '¿Eres nueva? Regístrate ahora',
    centro: 'Haz crecer tu negocio',
    derecha: '¿Eres nueva? Regístrate ahora',
    inferior: 'Anuncia tu perfil en Cariñosas'
  };

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function queryFromLocation() {
    if (global.CariHubResultadosDemo && global.CariHubResultadosDemo.queryFromLocation) {
      return global.CariHubResultadosDemo.queryFromLocation();
    }
    try {
      var p = new URL(global.location.href).searchParams;
      return {
        categoria: p.get('categoria') || 'Escort',
        pais: p.get('pais') || 'México',
        estado: p.get('estado') || '',
        ciudad: p.get('ciudad') || ''
      };
    } catch (e) {
      return { categoria: 'Escort', pais: 'México', estado: '', ciudad: '' };
    }
  }

  function nivelBusqueda(Q) {
    if (global.CariHubResultadosDemo && global.CariHubResultadosDemo.nivelBusqueda) {
      return global.CariHubResultadosDemo.nivelBusqueda(Q);
    }
    Q = Q || {};
    if (Q.ciudad) return 'ciudad';
    if (Q.estado) return 'estado';
    if (Q.pais) return 'pais';
    return 'ciudad';
  }

  function prefijoSlots(Q) {
    var n = nivelBusqueda(Q);
    if (n === 'pais') return 'resultados_pais_';
    if (n === 'estado') return 'resultados_estado_';
    return 'resultados_';
  }

  function slotId(prefijo, espacio) {
    return prefijo + espacio;
  }

  function obtenerRentals(Q) {
    var n = nivelBusqueda(Q);
    if (n === 'pais') return global.CARIHUB_RESULTADOS_PAIS_RENTALS || {};
    if (n === 'estado') return global.CARIHUB_RESULTADOS_ESTADO_RENTALS || {};
    return global.CARIHUB_RESULTADOS_RENTALS || {};
  }

  function obtenerRenta(Q, espacio) {
    var rentals = obtenerRentals(Q);
    return rentals[slotId(prefijoSlots(Q), espacio)] || null;
  }

  function linkRegistro(slotId) {
    return 'registro-banner.html?slot=' + encodeURIComponent(slotId);
  }

  function imagenesPlaceholder(espacio) {
    return (PLACEHOLDERS[espacio] || PLACEHOLDERS.izquierda).slice();
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
        '<img src="' + esc(src) + '" alt="' + esc(alt) + '" width="' + width + '" height="' + height + '" decoding="async">' +
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

  function buildPbSlides(Q, espacio, opts) {
    opts = opts || {};
    var prefijo = prefijoSlots(Q);
    var id = slotId(prefijo, espacio);
    var rental = obtenerRenta(Q, espacio);
    var alt = opts.alt || LABELS[espacio] || 'Espacio publicitario';
    var w = opts.center ? 620 : 380;
    var h = 158;
    var slides = '';
    var href = linkRegistro(id);
    var vacantClass = '';

    if (rental && rental.imagen) {
      slides = slideRentado(rental, alt, w, h);
      href = rental.url || href;
    } else {
      var imgs = imagenesPlaceholder(espacio);
      imgs.forEach(function (src, i) {
        var active = i === 0 ? ' is-active' : '';
        var hidden = i === 0 ? 'false' : 'true';
        slides +=
          '<div class="pb-slot__slide' + active + '" aria-hidden="' + hidden + '">' +
            '<img src="' + esc(src) + '" alt="' + esc(alt) + '" width="' + w + '" height="' + h + '" decoding="async">' +
          '</div>';
      });
    }

    return {
      slotId: id,
      slides: slides,
      count: rental && rental.imagen ? 1 : imagenesPlaceholder(espacio).length,
      href: href,
      vacantClass: vacantClass,
      alt: alt
    };
  }

  function buildPbSlotHTML(Q, espacio, opts) {
    opts = opts || {};
    var built = buildPbSlides(Q, espacio, opts);
    var extraClass = (opts.center ? ' pb--center' : '') + built.vacantClass;
    return (
      '<a class="pb-slot' + extraClass + '" href="' + esc(built.href) + '" data-resultados-slot="' + esc(built.slotId) + '" aria-label="' + esc(built.alt) + '">' +
        '<div class="pb-slot__stage" data-pb-stage>' + built.slides + buildDots(built.count) + '</div>' +
      '</a>'
    );
  }

  function aplicarInferior(Q) {
    var bottom = document.querySelector('.resultados-wrap .res-bottom');
    if (!bottom) return;

    var prefijo = prefijoSlots(Q);
    var id = slotId(prefijo, SLOT_INFERIOR);
    var rental = obtenerRenta(Q, SLOT_INFERIOR);

    bottom.href = rental && rental.url ? rental.url : linkRegistro(id);
    bottom.setAttribute('data-resultados-slot', id);
    bottom.classList.toggle('res-bottom--sr-vacant', !(rental && rental.imagen));

    var photo = bottom.querySelector('.res-bottom__photo img');
    if (photo) {
      if (rental && rental.imagen) {
        photo.src = rental.imagen;
        photo.alt = rental.titulo || LABELS.inferior;
      } else if (!photo.getAttribute('data-default-src')) {
        photo.setAttribute('data-default-src', photo.src || 'img/resultados-demo/violeta-2.png');
      } else if (!rental) {
        photo.src = photo.getAttribute('data-default-src');
        photo.alt = '';
      }
    }

    if (rental && rental.titulo) {
      var h = bottom.querySelector('.res-bottom__h');
      if (h) h.textContent = rental.titulo;
    }
  }

  function esPaginaSinResultados() {
    var list = document.getElementById('profilesList');
    return !!(list && list.classList.contains('res-lista--vacio'));
  }

  function mount(opts) {
    opts = opts || {};
    if (!opts.force && esPaginaSinResultados()) return;

    var wrap = document.querySelector('.resultados-wrap');
    if (!wrap) return;

    var Q = opts.Q || queryFromLocation();
    var pb = wrap.querySelector('.pb');
    if (pb) {
      pb.innerHTML =
        buildPbSlotHTML(Q, 'izquierda', { alt: LABELS.izquierda }) +
        buildPbSlotHTML(Q, 'centro', { alt: LABELS.centro, center: true }) +
        buildPbSlotHTML(Q, 'derecha', { alt: LABELS.derecha });
    }

    aplicarInferior(Q);

    if (global.CariHubResultadosBanners && global.CariHubResultadosBanners.start) {
      global.CariHubResultadosBanners.start();
    }
  }

  global.CARIHUB_RESULTADOS_RENTALS = global.CARIHUB_RESULTADOS_RENTALS || {};
  global.CARIHUB_RESULTADOS_PAIS_RENTALS = global.CARIHUB_RESULTADOS_PAIS_RENTALS || {};
  global.CARIHUB_RESULTADOS_ESTADO_RENTALS = global.CARIHUB_RESULTADOS_ESTADO_RENTALS || {};

  global.CariHubBannerResultadosPrincipales = {
    ESPACIOS: ESPACIOS,
    prefijoSlots: prefijoSlots,
    slotId: slotId,
    obtenerRenta: obtenerRenta,
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
})(typeof window !== 'undefined' ? window : globalThis);
