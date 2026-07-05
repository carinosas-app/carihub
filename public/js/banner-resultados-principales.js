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
        categoria: p.get('categoria') || 'Cariñosas',
        pais: p.get('pais') || 'México',
        estado: p.get('estado') || '',
        ciudad: p.get('ciudad') || ''
      };
    } catch (e) {
      return { categoria: 'Cariñosas', pais: 'México', estado: '', ciudad: '' };
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

  function imagenesPlaceholder(espacio, Q) {
    Q = Q || queryFromLocation();
    var sectorMod = global.CariHubResultadosSector;
    if (sectorMod && sectorMod.bannersDeSector) {
      var imgs = sectorMod.bannersDeSector(Q.categoria);
      if (imgs && imgs.length) {
        /* Cada slot (izq/centro/der) arranca en un banner distinto para que roten los 3. */
        var slotOffset = { izquierda: 0, centro: 1, derecha: 2, inferior: 0 };
        var off = slotOffset[espacio] || 0;
        var out = [];
        for (var i = 0; i < imgs.length; i++) {
          out.push(imgs[(i + off) % imgs.length]);
        }
        return out;
      }
    }
    if (sectorMod && sectorMod.bannerDeSector) {
      var sectorImg = sectorMod.bannerDeSector(Q.categoria);
      if (sectorImg) return [sectorImg];
    }
    return (PLACEHOLDERS[espacio] || PLACEHOLDERS.izquierda).slice();
  }

  function labelsDeSector(Q) {
    Q = Q || queryFromLocation();
    var sectorMod = global.CariHubResultadosSector;
    if (sectorMod && sectorMod.esSubcategoriaLgbt && sectorMod.esSubcategoriaLgbt(Q.categoria)) {
      return Object.assign({}, LABELS, global.CARIHUB_LGBT_BANNER_LABELS || {
        izquierda: 'Anúnciate aquí',
        centro: 'Anúnciate aquí',
        derecha: 'Anúnciate aquí',
        inferior: 'Promociona tu perfil — Anúnciate aquí'
      });
    }
    if (!sectorMod || !sectorMod.sectorDeCategoria) return LABELS;
    var sector = sectorMod.sectorDeCategoria(Q.categoria);
    if (sector === 'adultos') return LABELS;
    var custom = global.CARIHUB_SECTOR_BANNER_LABELS;
    if (custom && custom[sector]) {
      return Object.assign({}, LABELS, custom[sector]);
    }
    return {
      izquierda: 'Anuncia tu negocio aquí',
      centro: 'Destaca tu servicio en CariHub',
      derecha: 'Registra tu perfil profesional',
      inferior: 'Promociona tu servicio en CariHub'
    };
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
    var labels = labelsDeSector(Q);
    var alt = opts.alt || labels[espacio] || LABELS[espacio] || 'Espacio publicitario';
    var w = opts.center ? 620 : 380;
    var h = 158;
    var slides = '';
    var href = linkRegistro(id);
    var vacantClass = '';

    if (rental && rental.imagen) {
      slides = slideRentado(rental, alt, w, h);
      href = rental.url || href;
    } else {
      var imgs = imagenesPlaceholder(espacio, Q);
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
      count: rental && rental.imagen ? 1 : imagenesPlaceholder(espacio, Q).length,
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

    var sectorMod = global.CariHubResultadosSector;
    var photo = bottom.querySelector('.res-bottom__photo img');
    if (photo) {
      if (rental && rental.imagen) {
        photo.src = rental.imagen;
        photo.alt = rental.titulo || LABELS.inferior;
      } else {
        var sectorModInner = sectorMod;
        var sectorImg = sectorModInner && sectorModInner.bannerDeSector
          ? sectorModInner.bannerDeSector(Q.categoria)
          : null;
        if (sectorImg) {
          photo.src = sectorImg;
          photo.alt = (labelsDeSector(Q).inferior) || LABELS.inferior;
        } else if (!photo.getAttribute('data-default-src')) {
          photo.setAttribute('data-default-src', photo.src || 'img/resultados-demo/violeta-2.png');
        } else if (!rental) {
          photo.src = photo.getAttribute('data-default-src');
          photo.alt = '';
        }
      }
    }

    if (rental && rental.titulo) {
      var h = bottom.querySelector('.res-bottom__h');
      if (h) h.textContent = rental.titulo;
    } else {
      var labels = labelsDeSector(Q);
      var h2 = bottom.querySelector('.res-bottom__h');
      if (h2 && labels.inferior && sectorMod && sectorMod.bannerDeSector(Q.categoria)) {
        h2.textContent = labels.inferior;
      }
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
    var labels = labelsDeSector(Q);
    var pb = wrap.querySelector('.pb');
    if (pb) {
      pb.innerHTML =
        buildPbSlotHTML(Q, 'izquierda', { alt: labels.izquierda }) +
        buildPbSlotHTML(Q, 'centro', { alt: labels.centro, center: true }) +
        buildPbSlotHTML(Q, 'derecha', { alt: labels.derecha });
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

  /* Montaje coordinado desde resultados.html (refreshQ) para respetar ?categoria= de la URL. */
})(typeof window !== 'undefined' ? window : globalThis);
