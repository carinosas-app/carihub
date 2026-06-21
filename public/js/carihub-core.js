/**
 * CariHub Core — init Firebase único para todo el sitio.
 * Requiere scripts compat de Firebase cargados antes de este archivo.
 */
(function (global) {
  'use strict';

  var FIREBASE_CONFIG = {
    apiKey: 'AIzaSyCp68DynjT63T9wHorCLxwBGkSEo_mYPUI',
    authDomain: 'carihub-app.firebaseapp.com',
    projectId: 'carihub-app',
    storageBucket: 'carihub-app.firebasestorage.app',
    messagingSenderId: '236894758884',
    appId: '1:236894758884:web:5713e39a26c71f025a49f1'
  };

  var state = {
    ready: false,
    initError: null,
    app: null,
    auth: null,
    db: null,
    storage: null
  };

  function logInitError(msg, err) {
    console.error('[CariHub Core] ' + msg, err || '');
    if (global.console && global.console.trace) {
      global.console.trace('[CariHub Core] init stack');
    }
  }

  function initFirebase() {
    if (state.ready) return state;
    if (state.initError) return state;

    if (!global.firebase) {
      state.initError = new Error(
        'Firebase SDK no cargado. Incluye firebase-app-compat.js antes de carihub-core.js'
      );
      logInitError(state.initError.message);
      return state;
    }

    try {
      if (!global.firebase.apps.length) {
        global.firebase.initializeApp(FIREBASE_CONFIG);
      }

      state.app = global.firebase.app();
      state.db = global.firebase.firestore();
      state.auth = global.firebase.auth();
      if (typeof global.firebase.storage === 'function') {
        state.storage = global.firebase.storage();
      }
      state.ready = true;

      global.CariHubDB = state.db;
      global.CariHubAuth = state.auth;
      if (state.storage) global.CariHubStorage = state.storage;
    } catch (err) {
      state.initError = err;
      logInitError('initFirebase falló', err);
    }

    return state;
  }

  function requireAuth(callback, options) {
    options = options || {};
    var core = initFirebase();

    if (!core.ready || !core.auth) {
      var err = core.initError || new Error('Firebase Auth no disponible');
      logInitError('requireAuth', err);
      if (typeof options.onError === 'function') options.onError(err);
      else if (options.redirect) global.location.href = options.redirect;
      return;
    }

    core.auth.onAuthStateChanged(function (user) {
      if (!user) {
        if (typeof options.onUnauthenticated === 'function') options.onUnauthenticated();
        else if (options.redirect) global.location.href = options.redirect;
        else console.warn('[CariHub Core] requireAuth: sin sesión activa');
        return;
      }
      callback(user, core);
    });
  }

  function onAuthStateChanged(callback) {
    var core = initFirebase();
    if (!core.ready || !core.auth) {
      logInitError('onAuthStateChanged: Auth no disponible', core.initError);
      return function () {};
    }
    return core.auth.onAuthStateChanged(callback);
  }

  initFirebase();

  global.CariHubCore = {
    config: FIREBASE_CONFIG,
    initFirebase: initFirebase,
    requireAuth: requireAuth,
    onAuthStateChanged: onAuthStateChanged,
    get ready() { return initFirebase().ready; },
    get initError() { return initFirebase().initError; },
    get app() { return initFirebase().app; },
    get auth() { return initFirebase().auth; },
    get db() { return initFirebase().db; },
    get storage() { return initFirebase().storage; }
  };
})(typeof window !== 'undefined' ? window : this);
