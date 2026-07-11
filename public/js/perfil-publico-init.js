/**
 * Perfil público — query de búsqueda, volver a resultados y carga Firestore.
 * BLK-01 Phase 1C-a/1C-c: resolver wiring + owner-hint provider (inactive by default).
 */
(function (global) {
  'use strict';

  var AUTH_HINT_LISTENER_BOUND = false;
  var LAST_AUTH_UID = undefined;

  var VERIFIED_CACHE_SOURCES = {
    perfiles: true,
    usuarios_perfilesDetalle: true,
    usuarios_legacy_flat: true
  };

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

  function resolverStackAvailable() {
    var R = global.CariHubProfileResolver;
    return !!(R && typeof R.resolveProfile === 'function' && typeof R.isResolverActive === 'function');
  }

  function deepSanitizeAvailable() {
    var S = global.CariHubBlk01ProfileSanitize;
    return !!(S && typeof S.sanitizePublicProfileDeep === 'function');
  }

  function firestoreErrorKind(err) {
    if (!err) return 'unknown';
    var code = String((err && err.code) || (err && err.message) || err).toLowerCase();
    if (code.indexOf('permission') >= 0) return 'permission_denied';
    if (code.indexOf('unavailable') >= 0) return 'unavailable';
    if (code.indexOf('deadline') >= 0 || code.indexOf('timeout') >= 0) return 'timeout';
    return 'unknown';
  }

  function createResolverFirestoreDeps(fs, telemetry) {
    telemetry = telemetry || { perfilesReads: 0, usuariosReads: 0, errors: [] };

    function wrapGet(promise, meta) {
      return promise.then(function (doc) {
        return {
          exists: !!(doc && doc.exists),
          id: doc && doc.id != null ? doc.id : meta.id,
          data: doc && doc.exists && typeof doc.data === 'function' ? doc.data() : null,
          error: null
        };
      }).catch(function (err) {
        telemetry.errors.push({ path: meta.path, kind: firestoreErrorKind(err) });
        return { exists: false, id: meta.id, data: null, error: firestoreErrorKind(err) };
      });
    }

    return {
      getPerfilDoc: function (perfilId) {
        telemetry.perfilesReads += 1;
        return wrapGet(
          fs.collection('perfiles').doc(String(perfilId)).get(),
          { path: 'perfiles/' + perfilId, id: perfilId }
        );
      },
      getUsuarioDoc: function (uid) {
        telemetry.usuariosReads += 1;
        return wrapGet(
          fs.collection('usuarios').doc(String(uid)).get(),
          { path: 'usuarios/' + uid, id: uid }
        );
      },
      telemetry: telemetry
    };
  }

  function shouldFallbackToLegacyAfterResolver(result, telemetry) {
    if (!result) return true;
    if (result.error === 'invalid_perfil_id') return false;
    if (result.found && result.profile) return false;
    if (result.active && !result.found) return false;
    if (telemetry && telemetry.errors && telemetry.errors.length) {
      return telemetry.errors.some(function (e) {
        return e.kind === 'permission_denied' || e.kind === 'unavailable' || e.kind === 'timeout';
      });
    }
    return false;
  }

  function cargarPerfilFirestoreLegacy(id) {
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

  function normalizarDesdeResolver(resolverResult) {
    var RR = global.CariHubResultadosRegistrados;
    if (RR && typeof RR.normalizarFromBlk01Resolver === 'function') {
      return RR.normalizarFromBlk01Resolver(resolverResult);
    }
    return null;
  }

  function ownerHintProviderAvailable() {
    var P = global.CariHubOwnerHintProvider;
    return !!(P && typeof P.deriveOwnerHint === 'function' && typeof P.setOwnerHint === 'function');
  }

  function deriveOwnerHintForResolve(perfilId) {
    if (!ownerHintProviderAvailable()) return null;
    return global.CariHubOwnerHintProvider.deriveOwnerHint(perfilId, { explicitHint: null }) || null;
  }

  function isVerifiedResolverSource(source) {
    return !!(source && VERIFIED_CACHE_SOURCES[source]);
  }

  function maybeCacheVerifiedOwnerHint(perfilId, result) {
    if (!ownerHintProviderAvailable() || !result || !result.found || !result.profile) return;
    if (!isVerifiedResolverSource(result.source)) return;
    var usuarioId = result.usuarioId
      || (result.profile && (result.profile.usuarioId || result.profile.ownerUid || result.profile.uid));
    if (!usuarioId) return;
    global.CariHubOwnerHintProvider.setOwnerHint(perfilId, String(usuarioId).trim());
  }

  function maybeInvalidateOwnerHint(perfilId, hintUsed, result) {
    if (!ownerHintProviderAvailable() || !hintUsed || !perfilId) return;
    if (!result || !result.active || result.found) return;
    global.CariHubOwnerHintProvider.clearOwnerHint(perfilId);
  }

  function bindAuthHintCleanupOnce() {
    if (AUTH_HINT_LISTENER_BOUND || !ownerHintProviderAvailable()) return;
    if (!global.firebase || typeof global.firebase.auth !== 'function') return;
    var auth = global.firebase.auth();
    if (!auth || typeof auth.onAuthStateChanged !== 'function') return;
    AUTH_HINT_LISTENER_BOUND = true;
    auth.onAuthStateChanged(function (user) {
      var nextUid = user && user.uid ? String(user.uid) : null;
      if (LAST_AUTH_UID === undefined) {
        LAST_AUTH_UID = nextUid;
        return;
      }
      if (nextUid !== LAST_AUTH_UID) {
        global.CariHubOwnerHintProvider.clearAll();
        LAST_AUTH_UID = nextUid;
      }
    });
  }

  function cargarPerfilFirestore(id, q) {
    q = q || queryPerfilPublico();
    if (!id || esIdDemo(id)) return Promise.resolve(null);
    var fs = firestoreDb();
    if (!fs) return Promise.resolve(null);

    if (!resolverStackAvailable()) {
      return cargarPerfilFirestoreLegacy(id);
    }

    var Resolver = global.CariHubProfileResolver;
    if (!Resolver.isResolverActive()) {
      return cargarPerfilFirestoreLegacy(id);
    }

    if (!deepSanitizeAvailable()) {
      return cargarPerfilFirestoreLegacy(id);
    }

    bindAuthHintCleanupOnce();

    var telemetry = { perfilesReads: 0, usuariosReads: 0, errors: [] };
    var firestoreDeps = createResolverFirestoreDeps(fs, telemetry);
    var hintUsed = deriveOwnerHintForResolve(id);
    var resolveDeps = {
      firestore: firestoreDeps,
      sanitize: global.CariHubBlk01ProfileSanitize
    };
    if (hintUsed) resolveDeps.hintUsuarioId = hintUsed;

    return Resolver.resolveProfile(id, resolveDeps).then(function (result) {
      if (result.error === 'invalid_perfil_id') {
        return null;
      }
      if (result.found && result.profile) {
        maybeCacheVerifiedOwnerHint(id, result);
        var normalized = normalizarDesdeResolver(result);
        if (normalized) return normalized;
        return cargarPerfilFirestoreLegacy(id);
      }
      if (result.active && !result.found) {
        maybeInvalidateOwnerHint(id, hintUsed, result);
        return null;
      }
      if (shouldFallbackToLegacyAfterResolver(result, telemetry)) {
        return cargarPerfilFirestoreLegacy(id);
      }
      return null;
    }).catch(function () {
      return cargarPerfilFirestoreLegacy(id);
    });
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
