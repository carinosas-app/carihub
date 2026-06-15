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

  function aplicarSlots(slots) {
    _slots = {};
    Object.keys(slots || {}).forEach(function (slotId) {
      var n = normalizarSlot(slots[slotId]);
      if (n) _slots[slotId] = n;
    });
    global.CARIHUB_RESULTADOS_LATERALES_RENTALS = Object.assign({}, _slots);
    global.CARIHUB_PUBLICIDAD_ACTIVA = _slots;
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

  function remontarLateralesResultados() {
    if (global.CariHubBannerResultadosLaterales && CariHubBannerResultadosLaterales.mount) {
      CariHubBannerResultadosLaterales.mount();
    }
  }

  function boot() {
    return cargar().then(function () {
      remontarLateralesResultados();
    });
  }

  global.CariHubPublicidadActiva = {
    cargar: cargar,
    boot: boot,
    obtenerSlot: obtenerSlot,
    slots: function () { return Object.assign({}, _slots); },
    remontarLateralesResultados: remontarLateralesResultados
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(typeof window !== 'undefined' ? window : this);
