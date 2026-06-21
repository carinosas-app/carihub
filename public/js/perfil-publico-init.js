/**
 * Perfil público — query de búsqueda, volver a resultados y carga Firestore.
 */
(function (global) {
  'use strict';

  var VISTAS_RESULTADOS = {
    'con-resultados': true,
    'con-resultados-4': true,
    'sin-resultados': true
  };

  function isPreviewPath() {
    return (global.location.pathname || '').indexOf('/preview/') >= 0;
  }

  function assetBase() {
    return isPreviewPath() ? '../' : '';
  }

  function queryPerfilPublico() {
    try {
      var p = new URL(global.location.href).searchParams;
      return {
        id: p.get('id') || '',
        vista: p.get('vista') || '',
        resVista: p.get('resVista') || '',
        from: p.get('from') || '',
        previewSource: p.get('previewSource') || '',
        categoria: p.get('categoria') || '',
        pais: p.get('pais') || '',
        estado: p.get('estado') || '',
        ciudad: p.get('ciudad') || ''
      };
    } catch (e) {
      return { id: '', vista: '', resVista: '', from: '', previewSource: '', categoria: '', pais: '', estado: '', ciudad: '' };
    }
  }

  function resultadosVolverHref(q) {
    q = q || queryPerfilPublico();
    if (global.CariHubNavQuick && CariHubNavQuick.resultadosHrefFromQuery) {
      return CariHubNavQuick.resultadosHrefFromQuery(q);
    }
    var base = isPreviewPath() ? '../resultados.html' : 'resultados.html';
    var params = new URLSearchParams();
    if (q.categoria) params.set('categoria', q.categoria);
    if (q.pais) params.set('pais', q.pais);
    if (q.estado) params.set('estado', q.estado);
    if (q.ciudad) params.set('ciudad', q.ciudad);
    var modoRes = q.resVista || (VISTAS_RESULTADOS[q.vista] ? q.vista : '');
    if (modoRes) params.set('vista', modoRes);
    var qs = params.toString();
    return qs ? base + '?' + qs : base;
  }

  function demoAssetPath(src) {
    var s = String(src || '').trim();
    if (!s) return s;
    if (/^(\.\.|\/|https?:|data:)/.test(s)) return s;
    return assetBase() + s.replace(/^\.\//, '');
  }

  function esIdDemo(id) {
    return /^demo-/i.test(String(id || ''));
  }

  function firestoreDb() {
    if (global.CariHubDB) return global.CariHubDB;
    if (global.firebase && typeof global.firebase.firestore === 'function') {
      return global.firebase.firestore();
    }
    return null;
  }

  function cargarPerfilFirestore(id, q) {
    q = q || queryPerfilPublico();
    if (!id || esIdDemo(id)) return Promise.resolve(null);
    var fs = firestoreDb();
    if (!fs) return Promise.resolve(null);
    return fs.collection('usuarios').doc(String(id)).get()
      .then(function (doc) {
        if (!doc.exists) return null;
        if (global.CariHubResultadosRegistrados && CariHubResultadosRegistrados.normalizar) {
          return global.CariHubResultadosRegistrados.normalizar(doc);
        }
        return null;
      })
      .catch(function () { return null; });
  }

  function initFirebaseIfNeeded() {
    if (global.CariHubCore && typeof global.CariHubCore.initFirebase === 'function') {
      global.CariHubCore.initFirebase();
      return;
    }
    if (!global.firebase || global.firebase.apps.length) return;
    console.error('[CariHub] perfil-publico-init: falta carihub-core.js');
  }

  function leerPreviewRegistro() {
    try {
      var raw = global.sessionStorage.getItem('carihub_rp_public_preview');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  global.CariHubPerfilPublico = {
    queryPerfilPublico: queryPerfilPublico,
    resultadosVolverHref: resultadosVolverHref,
    demoAssetPath: demoAssetPath,
    esIdDemo: esIdDemo,
    cargarPerfilFirestore: cargarPerfilFirestore,
    initFirebaseIfNeeded: initFirebaseIfNeeded,
    isPreviewPath: isPreviewPath,
    assetBase: assetBase,
    leerPreviewRegistro: leerPreviewRegistro
  };
})(typeof window !== 'undefined' ? window : globalThis);
