/**
 * Gratificaciones — fase inicial: cuenta social, historial local, límites configurables.
 * Sin pagos reales ni retiros (fase avanzada pendiente de revisión legal/fiscal).
 */
(function (global) {
  'use strict';

  var CONFIG = {
    comision: 0.20,
    limitePorOperacion: 2000,
    limiteDiario: 5000,
    montosPreset: [50, 100, 200, 500, 1000, 2000]
  };

  var LEDGER_KEY = 'chGratificacionesLedger';

  function authUser() {
    if (global.CariHubCuentaSocial && CariHubCuentaSocial.authUser) {
      return CariHubCuentaSocial.authUser();
    }
    if (global.CariHubAuth && global.CariHubAuth.currentUser) return global.CariHubAuth.currentUser;
    if (global.auth && global.auth.currentUser) return global.auth.currentUser;
    return null;
  }

  function cuentaReal() {
    var user = authUser();
    return !!(user && !user.isAnonymous);
  }

  function formatMXN(n) {
    return '$' + Number(n || 0).toLocaleString('es-MX', { maximumFractionDigits: 0 });
  }

  function leerLedger() {
    try {
      var raw = global.localStorage.getItem(LEDGER_KEY);
      if (!raw) return [];
      var data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function guardarLedger(items) {
    try {
      global.localStorage.setItem(LEDGER_KEY, JSON.stringify(items.slice(0, 200)));
    } catch (e) { /* opcional */ }
  }

  function movimientosHoy(uid) {
    var hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return leerLedger().filter(function (m) {
      if (m.uid !== uid) return false;
      var ts = Number(m.ts) || 0;
      return ts >= hoy.getTime();
    });
  }

  function sumaMontos(items) {
    return items.reduce(function (acc, m) {
      return acc + (Number(m.monto) || 0);
    }, 0);
  }

  function calcularComision(monto) {
    return Math.round(Number(monto || 0) * CONFIG.comision);
  }

  function validarMonto(monto, uid) {
    monto = Number(monto) || 0;
    if (monto < 1) {
      return { ok: false, mensaje: 'Elige un monto válido para gratificar.' };
    }
    if (monto > CONFIG.limitePorOperacion) {
      return {
        ok: false,
        mensaje: 'El máximo por gratificación es ' + formatMXN(CONFIG.limitePorOperacion) +
          '. Para montos mayores se requiere verificación reforzada (próximamente).'
      };
    }
    uid = uid || (authUser() && authUser().uid) || '';
    if (uid) {
      var hoy = movimientosHoy(uid);
      var totalHoy = sumaMontos(hoy) + monto;
      if (totalHoy > CONFIG.limiteDiario) {
        return {
          ok: false,
          mensaje: 'Superaste el límite diario de ' + formatMXN(CONFIG.limiteDiario) +
            '. Intenta mañana o solicita verificación reforzada.'
        };
      }
    }
    return { ok: true, comision: calcularComision(monto), neto: monto - calcularComision(monto) };
  }

  function registrarMovimiento(data) {
    data = data || {};
    var user = authUser();
    if (!cuentaReal()) {
      return { ok: false, mensaje: 'Debes iniciar sesión con tu cuenta social para gratificar.' };
    }

    var monto = Number(data.monto) || 0;
    var validacion = validarMonto(monto, user.uid);
    if (!validacion.ok) return validacion;

    var comision = validacion.comision;
    var neto = validacion.neto;
    var item = {
      id: 'grat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      uid: user.uid,
      email: user.email || '',
      monto: monto,
      comision: comision,
      neto: neto,
      destinatarioPerfil: String(data.destinatarioPerfil || data.perfil || '').trim(),
      destinatarioNombre: String(data.destinatarioNombre || '').trim(),
      source: String(data.source || 'perfil').trim(),
      estado: 'registrado_demo',
      ts: Date.now()
    };

    var ledger = leerLedger();
    ledger.unshift(item);
    guardarLedger(ledger);

    return {
      ok: true,
      item: item,
      mensaje: 'Gratificación registrada (demo): ' + formatMXN(monto) +
        ' · Comisión CariHub: ' + formatMXN(comision) +
        ' · Entrega al perfil: ' + formatMXN(neto) +
        '\n\nLos pagos reales se habilitarán tras revisión legal/fiscal.'
    };
  }

  function historial(uid) {
    uid = uid || (authUser() && authUser().uid) || '';
    if (!uid) return [];
    return leerLedger().filter(function (m) { return m.uid === uid; });
  }

  global.CariHubGratificaciones = {
    CONFIG: CONFIG,
    formatMXN: formatMXN,
    calcularComision: calcularComision,
    validarMonto: validarMonto,
    registrarMovimiento: registrarMovimiento,
    historial: historial,
    cuentaReal: cuentaReal
  };
})(typeof window !== 'undefined' ? window : globalThis);
