/**
 * Cuenta social (Tipo A) — auth mínima para mensajes, favoritos, gratificaciones.
 */
(function (global) {
  'use strict';

  function auth() {
    if (global.CariHubAuth) return global.CariHubAuth;
    if (global.auth) return global.auth;
    if (global.firebase && typeof global.firebase.auth === 'function') return global.firebase.auth();
    return null;
  }

  function authUser() {
    var a = auth();
    return a && a.currentUser ? a.currentUser : null;
  }

  function cuentaReal() {
    var user = authUser();
    return !!(user && !user.isAnonymous);
  }

  function abrirAuthSocial(modo) {
    if (modo === 'crear') {
      if (typeof global.abrirCuentaPersonal === 'function') {
        global.abrirCuentaPersonal();
        return;
      }
    }
    if (typeof global.abrirMiPerfil === 'function') {
      global.abrirMiPerfil();
    }
  }

  function indexHref(params) {
    var p = new URLSearchParams();
    var q = params || {};
    Object.keys(q).forEach(function (k) {
      if (q[k] != null && q[k] !== '') p.set(k, String(q[k]));
    });
    var qs = p.toString();
    return qs ? 'index.html?' + qs : 'index.html';
  }

  function requiereCuentaSocial(opts) {
    opts = opts || {};
    if (cuentaReal()) return true;

    if (opts.intencion && global.CariHubHomeIntenciones && CariHubHomeIntenciones.guardar && CariHubHomeIntenciones.KEYS) {
      var key = CariHubHomeIntenciones.KEYS[opts.intencion];
      if (key) {
        CariHubHomeIntenciones.guardar(key, {
          perfil: opts.perfil || '',
          ts: Date.now(),
          reanudar: true
        });
      }
    }

    var enIndex = /index\.html$/i.test(global.location.pathname || '') ||
      (global.location.pathname || '').endsWith('/');

    if (enIndex) {
      abrirAuthSocial(opts.modo || 'entrar');
      return false;
    }

    global.location.href = indexHref({
      abrir: 'registro',
      intencion: opts.intencion || '',
      perfil: opts.perfil || ''
    });
    return false;
  }

  global.CariHubCuentaSocial = {
    auth: auth,
    authUser: authUser,
    cuentaReal: cuentaReal,
    abrirAuthSocial: abrirAuthSocial,
    requiereCuentaSocial: requiereCuentaSocial,
    indexHref: indexHref
  };
})(typeof window !== 'undefined' ? window : globalThis);
