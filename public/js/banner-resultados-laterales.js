/**
 * Laterales horizontales en pantalla de resultados (con perfiles):
 * resultados_estados · resultados_libe — vista previa con fotos reales.
 */
(function (global) {
  'use strict';

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

  function slotLateral(Q, lado) {
    var suf = lado === 'libe' ? 'libe' : 'estados';
    return prefijoSlots(Q) + suf;
  }

  var LABELS = {
    estados: 'Estado publicado',
    libe: 'En vivo · LIBE'
  };

  function labelForSlot(slotId) {
    if (/_libe$/.test(String(slotId || ''))) return LABELS.libe;
    return LABELS.estados;
  }

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function linkRegistro(slotId) {
    return 'registro-banner.html?slot=' + encodeURIComponent(slotId);
  }

  function obtenerRentals(Q) {
    var n = nivelBusqueda(Q);
    if (n === 'pais') return global.CARIHUB_RESULTADOS_PAIS_RENTALS || {};
    if (n === 'estado') return global.CARIHUB_RESULTADOS_ESTADO_RENTALS || {};
    return global.CARIHUB_RESULTADOS_LATERALES_RENTALS || {};
  }

  function obtenerRenta(slotId, Q) {
    var rentals = obtenerRentals(Q || queryFromLocation());
    return rentals[String(slotId || '')] || null;
  }

  function previewImg(kind) {
    var p = global.CariHubSlotPreviewImages;
    if (p && p.get) return p.get(kind);
    return kind === 'libe' ? 'img/live-en-vivo-libe.png' : 'img/estado-publicado-libe.png';
  }

  function buildEstadoMockSlide() {
    return (
      '<div class="pb-slot__slide is-active res-midband__mock res-midband__mock--estado" aria-hidden="false">' +
        '<img class="res-midband__mock-estado-photo" src="' + esc(previewImg('estados')) + '" alt="Estado publicado — Mi estado" width="380" height="188" decoding="async">' +
        '<span class="res-sr-vacant-msg">Anúnciate aquí</span>' +
      '</div>'
    );
  }

  function buildLiveMockSlide() {
    return (
      '<div class="pb-slot__slide is-active res-midband__mock res-midband__mock--live" aria-hidden="false">' +
        '<img class="res-midband__mock-live-photo" src="' + esc(previewImg('libe')) + '" alt="Transmisión en vivo — valeria.music" width="380" height="188" decoding="async">' +
        '<span class="res-sr-vacant-msg">Anúnciate aquí</span>' +
      '</div>'
    );
  }

  function buildVacantSlide(slotId) {
    if (/_libe$/.test(String(slotId || ''))) return buildLiveMockSlide();
    return buildEstadoMockSlide();
  }

  function buildBannerHTML(slotId, Q) {
    var rental = obtenerRenta(slotId, Q);
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
    } else {
      slides = buildVacantSlide(slotId);
    }

    return (
      '<a class="pb-slot res-midband__banner' + vacantClass + '" href="' + esc(href) + '" data-resultados-slot="' + esc(slotId) + '" aria-label="' + esc(label) + '">' +
        '<div class="pb-slot__stage" data-pb-stage>' + slides + '</div>' +
      '</a>'
    );
  }

  function esPaginaSinResultados() {
    var list = document.getElementById('profilesList');
    return !!(list && list.classList.contains('res-lista--vacio'));
  }

  function mount(opts) {
    opts = opts || {};
    if (!opts.force && esPaginaSinResultados()) return;

    var Q = opts.Q || queryFromLocation();
    var map = {
      resMidEstados: slotLateral(Q, 'estados'),
      resMidLibe: slotLateral(Q, 'libe')
    };

    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.innerHTML = buildBannerHTML(map[id], Q);
    });
  }

  global.CARIHUB_RESULTADOS_LATERALES_RENTALS = global.CARIHUB_RESULTADOS_LATERALES_RENTALS || {};
  global.CARIHUB_RESULTADOS_PAIS_RENTALS = global.CARIHUB_RESULTADOS_PAIS_RENTALS || {};
  global.CARIHUB_RESULTADOS_ESTADO_RENTALS = global.CARIHUB_RESULTADOS_ESTADO_RENTALS || {};

  global.CariHubBannerResultadosLaterales = {
    slotLateral: slotLateral,
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
