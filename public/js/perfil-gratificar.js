/**
 * Flujo de gratificación — cuenta social obligatoria, límites e historial (fase inicial).
 */
(function (global) {
  'use strict';

  function indexHref(params) {
    var path = global.location.pathname || '';
    var base = path.indexOf('/preview/') >= 0 ? '../index.html' : 'index.html';
    var q = params || {};
    var p = new URLSearchParams();
    if (q.abrir) p.set('abrir', q.abrir);
    if (q.intencion) p.set('intencion', q.intencion);
    if (q.perfil) p.set('perfil', q.perfil);
    if (q.monto) p.set('monto', q.monto);
    if (q.source) p.set('gratSource', q.source);
    var qs = p.toString();
    return qs ? base + '?' + qs : base;
  }

  function cuentaReal() {
    if (global.CariHubGratificaciones && CariHubGratificaciones.cuentaReal) {
      return CariHubGratificaciones.cuentaReal();
    }
    if (global.CariHubCuentaSocial && CariHubCuentaSocial.cuentaReal) {
      return CariHubCuentaSocial.cuentaReal();
    }
    return false;
  }

  function confirmar(state) {
    state = state || {};
    var perfil = String(state.perfil || '').trim();
    var amount = Number(state.amount) || 0;
    var source = String(state.source || 'perfil').trim();
    if (!perfil || amount < 1) {
      global.alert('Elige un monto para gratificar.');
      return false;
    }

    if (global.CariHubGratificaciones) {
      var validacion = CariHubGratificaciones.validarMonto(amount);
      if (!validacion.ok) {
        global.alert(validacion.mensaje);
        return false;
      }
    }

    if (cuentaReal() && global.CariHubGratificaciones) {
      var resultado = CariHubGratificaciones.registrarMovimiento({
        monto: amount,
        destinatarioPerfil: perfil,
        destinatarioNombre: state.nombre || '',
        source: source
      });
      if (resultado.ok) {
        global.alert(resultado.mensaje);
        return 'done';
      }
      if (resultado.mensaje) global.alert(resultado.mensaje);
      return false;
    }

    try {
      global.sessionStorage.setItem('chGratIntencion', JSON.stringify({
        perfil: perfil,
        amount: amount,
        source: source,
        ts: Date.now()
      }));
    } catch (e) { /* opcional */ }

    global.location.href = indexHref({
      abrir: 'registro',
      intencion: 'gratificar',
      perfil: perfil,
      monto: String(amount),
      source: source
    });
    return 'redirect';
  }

  global.CariHubPerfilGratificar = {
    indexHref: indexHref,
    confirmar: confirmar,
    cuentaReal: cuentaReal
  };
})(typeof window !== 'undefined' ? window : globalThis);
