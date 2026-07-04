/**
 * Banners activos públicos — configuracion_publicidad/banners_activos
 * (snapshot seguro; admin sincroniza al activar solicitudes).
 */
(function (global) {
  'use strict';

  var _slots = {};
  var _loaded = false;
  var _loading = null;

  function db() {
    if (global.CariHubDB) return global.CariHubDB;
    if (global.firebase && typeof firebase.firestore === 'function') return firebase.firestore();
    return null;
  }

  function normalizarSlot(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var imagen = String(raw.imagen || raw.imagenURL || '').trim();
    if (!imagen || !/^https?:\/\//i.test(imagen)) return null;
    return {
      imagen: imagen,
      url: String(raw.url || raw.link || '').trim(),
      titulo: String(raw.titulo || raw.nombre || '').trim(),
      solicitudId: raw.solicitudId || ''
    };
  }

  function pickSlots(slots, pattern) {
    var out = {};
    Object.keys(slots || {}).forEach(function (slotId) {
      if (pattern.test(slotId)) out[slotId] = slots[slotId];
    });
    return out;
  }

  function aplicarSlots(slots) {
    var normalized = {};
    _slots = {};

    Object.keys(slots || {}).forEach(function (slotId) {
      var n = normalizarSlot(slots[slotId]);
      if (!n) return;
      normalized[slotId] = n;
      _slots[slotId] = n;
    });

    global.CARIHUB_PUBLICIDAD_ACTIVA = Object.assign({}, normalized);
    global.CARIHUB_HERO_BANNER_RENTALS = pickSlots(normalized, /^home_hero_\d+$/);
    global.CARIHUB_HOME_SLOT_RENTALS = pickSlots(normalized, /^home_(izquierda|derecha|inferior|categorias|estados|libe)$/);
    global.CARIHUB_HERO_RENTALS = (function () {
      var known = /^home_(hero_\d+|izquierda|derecha|inferior|categorias|estados|libe)$/;
      var out = {};
      Object.keys(normalized).forEach(function (slotId) {
        if (slotId.indexOf('home_') === 0 && !known.test(slotId)) out[slotId] = normalized[slotId];
      });
      return out;
    })();
    global.CARIHUB_RESULTADOS_LATERALES_RENTALS = pickSlots(normalized, /^resultados_(estados|libe)$/);
    global.CARIHUB_RESULTADOS_RENTALS = pickSlots(normalized, /^resultados_(izquierda|centro|derecha|inferior)$/);
    global.CARIHUB_RESULTADOS_PAIS_RENTALS = pickSlots(normalized, /^resultados_pais_/);
    global.CARIHUB_RESULTADOS_ESTADO_RENTALS = pickSlots(normalized, /^resultados_estado_/);
    global.CARIHUB_SIN_RESULTADOS_RENTALS = pickSlots(normalized, /^sin_resultados_/);
    global.CARIHUB_PERFIL_RENTALS = pickSlots(normalized, /^perfil_/);
    global.CARIHUB_REGISTRO_BANNER_RENTALS = pickSlots(normalized, /^registro_/);
  }

  function cargar(force) {
    if (_loading && !force) return _loading;
    if (_loaded && !force) return Promise.resolve(_slots);

    var firestore = db();
    if (!firestore) {
      _loaded = true;
      return Promise.resolve(_slots);
    }

    _loading = firestore.collection('configuracion_publicidad').doc('banners_activos').get()
      .then(function (doc) {
        if (doc.exists) {
          var data = doc.data() || {};
          aplicarSlots(data.slots || data);
        }
        _loaded = true;
        return _slots;
      })
      .catch(function (err) {
        console.warn('[CariHubPublicidadActiva]', err);
        _loaded = true;
        return _slots;
      })
      .finally(function () {
        _loading = null;
      });

    return _loading;
  }

  function obtenerSlot(slotId) {
    return _slots[String(slotId || '')] || null;
  }

  function remontarLateralesResultados(opts) {
    if (global.CariHubBannerResultadosLaterales && global.CariHubBannerResultadosLaterales.mount) {
      global.CariHubBannerResultadosLaterales.mount(opts || {});
    }
  }

  function remontarPrincipalesResultados(opts) {
    if (global.CariHubBannerResultadosPrincipales && global.CariHubBannerResultadosPrincipales.mount) {
      global.CariHubBannerResultadosPrincipales.mount(opts || {});
    }
  }

  function esPaginaResultados() {
    return !!document.querySelector('.resultados-wrap');
  }

  function esListaVaciaResultados() {
    var list = document.getElementById('profilesList');
    return !!(list && list.classList.contains('res-lista--vacio'));
  }

  function syncBannersResultados(esVacio, opts) {
    opts = opts || {};
    if (!esPaginaResultados()) return;

    /* Lista vacía = misma shell de resultados; no intercambiar a inventario sin-resultados. */
    if (global.CariHubBannerSinResultados && global.CariHubBannerSinResultados.syncResultadosPage) {
      global.CariHubBannerSinResultados.syncResultadosPage(false);
    }
    remontarPrincipalesResultados(opts);
    remontarLateralesResultados(opts);

    if (global.CariHubResultadosBanners && global.CariHubResultadosBanners.start) {
      global.CariHubResultadosBanners.start();
    }
  }

  function queryResultadosQ() {
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

  function remontarResultados() {
    if (!esPaginaResultados()) return;
    var Q = queryResultadosQ();
    try {
      if (global.CariHubResultadosSector && Q && Q.categoria) {
        global.CariHubResultadosSector.aplicarTemaSector(Q.categoria);
      }
    } catch (e) { /* tema opcional */ }
    syncBannersResultados(esListaVaciaResultados(), { Q: Q, force: true });
  }

  function remontarHomeLaterales() {
    if (global.CariHubBannerHomeLaterales && global.CariHubBannerHomeLaterales.mount) {
      global.CariHubBannerHomeLaterales.mount();
    }
  }

  function remontarHome() {
    if (global.CariHubHomeUI && typeof global.CariHubHomeUI.remontarPublicidad === 'function') {
      global.CariHubHomeUI.remontarPublicidad();
    }
    remontarHomeLaterales();
  }

  function remontarPerfil() {
    if (!document.getElementById('bannersSuperioresCariHub') && !document.querySelector('.pb')) return;
    if (global.CariHubBannerPerfil && global.CariHubBannerPerfil.mount) {
      global.CariHubBannerPerfil.mount();
    }
    if (global.CariHubBannerPerfilLaterales && global.CariHubBannerPerfilLaterales.mount) {
      global.CariHubBannerPerfilLaterales.mount();
    }
  }

  function remontarRegistro() {
    if (!document.querySelector('[data-registro-banner-slot]')) return;
    if (global.CariHubBannerRegistro && global.CariHubBannerRegistro.remount) {
      global.CariHubBannerRegistro.remount();
    }
    if (global.CariHubHomeCatPromoRail && document.querySelector('.home-cat-promo-rail')) {
      var sectorId = document.body.getAttribute('data-rp-sector') || '';
      if (sectorId && document.body.classList.contains('rp-subcat-screen')) {
        global.CariHubHomeCatPromoRail.refreshForSector(sectorId, '');
      } else {
        global.CariHubHomeCatPromoRail.refreshGeneric();
      }
    }
  }

  function remontarPagina() {
    remontarResultados();
    remontarHome();
    remontarPerfil();
    remontarRegistro();
  }

  function boot() {
    return cargar().then(remontarPagina);
  }

  global.CariHubPublicidadActiva = {
    cargar: cargar,
    boot: boot,
    obtenerSlot: obtenerSlot,
    slots: function () { return Object.assign({}, _slots); },
    aplicarSlots: aplicarSlots,
    remontarPagina: remontarPagina,
    remontarResultados: remontarResultados,
    syncBannersResultados: syncBannersResultados,
    remontarLateralesResultados: remontarLateralesResultados,
    remontarPrincipalesResultados: remontarPrincipalesResultados,
    remontarHome: remontarHome,
    remontarHomeLaterales: remontarHomeLaterales,
    remontarPerfil: remontarPerfil,
    remontarRegistro: remontarRegistro
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(typeof window !== 'undefined' ? window : this);
