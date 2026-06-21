/**
 * Retomar intenciones post-registro/login (mensajes, gratificar, reservar, agendar).
 */
(function (global) {
  'use strict';

  var KEYS = {
    mensajes: 'chMensajesIntencion',
    gratificar: 'chGratIntencion',
    reservar: 'chReservarIntencion',
    agendar: 'chAgendarIntencion',
    favoritos: 'chFavoritosIntencion',
    notificaciones: 'chNotificacionesIntencion'
  };

  var TTL_MS = 30 * 60 * 1000;

  function authUser() {
    if (global.auth && global.auth.currentUser) return global.auth.currentUser;
    if (global.CariHubAuth && CariHubAuth.currentUser) return CariHubAuth.currentUser;
    return null;
  }

  function cuentaReal() {
    var user = authUser();
    return !!(user && !user.isAnonymous);
  }

  function guardar(key, data) {
    try {
      global.sessionStorage.setItem(key, JSON.stringify(data));
    } catch (e) { /* opcional */ }
  }

  function leer(key) {
    try {
      var raw = global.sessionStorage.getItem(key);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (data && data.ts && Date.now() - data.ts > TTL_MS) {
        global.sessionStorage.removeItem(key);
        return null;
      }
      return data;
    } catch (e) {
      return null;
    }
  }

  function limpiar(key) {
    try { global.sessionStorage.removeItem(key); } catch (e) { /* noop */ }
  }

  function perfilHref(id, extra) {
    id = String(id || '').trim();
    if (!id) return 'index.html';
    var p = new URLSearchParams(extra || {});
    if (!p.get('id')) p.set('id', id);
    if (!p.get('from')) p.set('from', 'intencion');
    return 'perfil-publico.html?' + p.toString();
  }

  function capturarDesdeUrl() {
    var params;
    try {
      params = new URLSearchParams(global.location.search);
    } catch (e) {
      return;
    }
    var abrir = params.get('abrir') || '';
    var intencion = params.get('intencion') || '';
    var perfil = params.get('perfil') || '';
    var ts = Date.now();

    if (abrir === 'mensajes' && perfil) {
      guardar(KEYS.mensajes, {
        perfil: perfil,
        texto: params.get('texto') || '',
        ts: ts,
        reanudar: true
      });
    }

    if (abrir === 'registro' && intencion) {
      if (intencion === 'gratificar') {
        guardar(KEYS.gratificar, {
          perfil: perfil,
          amount: Number(params.get('monto')) || 0,
          source: params.get('gratSource') || params.get('source') || 'perfil',
          ts: ts,
          reanudar: true
        });
      } else if (intencion === 'reservar') {
        guardar(KEYS.reservar, { perfil: perfil, ts: ts, reanudar: true });
      } else if (intencion === 'agendar_cita') {
        guardar(KEYS.agendar, { perfil: perfil, ts: ts, reanudar: true });
      } else if (intencion === 'favoritos') {
        guardar(KEYS.favoritos, { perfil: perfil, ts: ts, reanudar: true });
      } else if (intencion === 'notificaciones') {
        guardar(KEYS.notificaciones, { perfil: perfil, ts: ts, reanudar: true });
      }
    }
  }

  function retomarMensajes() {
    var data = leer(KEYS.mensajes);
    if (!data || !data.reanudar) return false;
    data.reanudar = false;
    guardar(KEYS.mensajes, data);
    if (global.CariHubHomeMensajes && CariHubHomeMensajes.abrir) {
      global.CariHubHomeMensajes.abrir({ perfil: data.perfil, texto: data.texto });
      return true;
    }
    return false;
  }

  function retomarGratificar() {
    var data = leer(KEYS.gratificar);
    if (!data || !data.perfil) return false;
    limpiar(KEYS.gratificar);
    var p = new URLSearchParams();
    p.set('id', data.perfil);
    p.set('from', 'intencion');
    p.set('gratificar', '1');
    if (data.amount) p.set('monto', String(data.amount));
    if (data.source) p.set('gratSource', String(data.source));
    global.location.href = perfilHref(data.perfil, Object.fromEntries(p.entries()));
    return true;
  }

  function retomarReservar() {
    var data = leer(KEYS.reservar);
    if (!data || !data.perfil) return false;
    limpiar(KEYS.reservar);
    global.location.href = perfilHref(data.perfil, {
      id: data.perfil,
      accion: 'reservar',
      from: 'intencion'
    });
    return true;
  }

  function retomarAgendar() {
    var data = leer(KEYS.agendar);
    if (!data || !data.reanudar) return false;
    limpiar(KEYS.agendar);
    if (data.perfil) {
      global.location.href = perfilHref(data.perfil, { accion: 'agendar', from: 'intencion' });
      return true;
    }
    return false;
  }

  function retomarFavoritos() {
    var data = leer(KEYS.favoritos);
    if (!data || !data.reanudar) return false;
    limpiar(KEYS.favoritos);
    if (typeof global.abrirFavoritos === 'function') {
      global.abrirFavoritos();
      return true;
    }
    return false;
  }

  function retomarNotificaciones() {
    var data = leer(KEYS.notificaciones);
    if (!data || !data.reanudar) return false;
    limpiar(KEYS.notificaciones);
    if (typeof global.abrirMiPerfil === 'function') {
      global.abrirMiPerfil();
      return true;
    }
    return false;
  }

  function retomarPostAuth(opts) {
    opts = opts || {};
    if (!cuentaReal() && !opts.force) return false;

    if (retomarMensajes()) return true;
    if (retomarGratificar()) return true;
    if (retomarReservar()) return true;
    if (retomarAgendar()) return true;
    if (retomarFavoritos()) return true;
    if (retomarNotificaciones()) return true;

    return false;
  }

  function marcarReanudar(tipo) {
    var key = KEYS[tipo];
    if (!key) return;
    var data = leer(key) || {};
    data.reanudar = true;
    data.ts = data.ts || Date.now();
    guardar(key, data);
  }

  function bindAuth() {
    var auth = global.auth || global.CariHubAuth;
    if (!auth || typeof auth.onAuthStateChanged !== 'function') return;
    auth.onAuthStateChanged(function (user) {
      if (!user || user.isAnonymous) return;
      global.setTimeout(function () {
        retomarPostAuth();
      }, 600);
    });
  }

  global.CariHubHomeIntenciones = {
    KEYS: KEYS,
    guardar: guardar,
    leer: leer,
    limpiar: limpiar,
    capturarDesdeUrl: capturarDesdeUrl,
    retomarPostAuth: retomarPostAuth,
    marcarReanudar: marcarReanudar,
    cuentaReal: cuentaReal
  };

  capturarDesdeUrl();

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', bindAuth);
  } else {
    bindAuth();
  }
})(typeof window !== 'undefined' ? window : globalThis);
