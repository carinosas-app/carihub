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
        categoria: p.get('categoria') || '',
        pais: p.get('pais') || '',
        estado: p.get('estado') || '',
        ciudad: p.get('ciudad') || ''
      };
    } catch (e) {
      return { id: '', vista: '', resVista: '', from: '', categoria: '', pais: '', estado: '', ciudad: '' };
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
    if (!global.firebase || global.firebase.apps.length) return;
    var cfg = {
      apiKey: 'AIzaSyCp68DynjT63T9wHorCLxwBGkSEo_mYPUI',
      authDomain: 'carihub-app.firebaseapp.com',
      projectId: 'carihub-app',
      storageBucket: 'carihub-app.firebasestorage.app',
      messagingSenderId: '236894758884',
      appId: '1:236894758884:web:5713e39a26c71f025a49f1'
    };
    global.firebase.initializeApp(cfg);
    global.CariHubDB = global.firebase.firestore();
    if (typeof global.firebase.auth === 'function') {
      global.CariHubAuth = global.firebase.auth();
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
    assetBase: assetBase
  };
})(typeof window !== 'undefined' ? window : globalThis);
