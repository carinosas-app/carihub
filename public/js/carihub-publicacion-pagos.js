/**
 * Precios, descuentos y checkout de publicaciones (perfil / banner).
 * Stripe / Mercado Pago: placeholders listos para conectar webhook real.
 */
(function (global) {
  'use strict';

  var PRECIOS = {
    perfil_mes: 999,
    perfil_quincena: 599,
    perfil_semana: 349,
    banner_mes: 1499,
    banner_quincena: 899,
    banner_semana: 499
  };

  var DESCUENTO_PERFIL_ADICIONAL = 0.5;
  var DESCUENTO_BANNER_ADICIONAL = 0.5;
  var DIAS_VIGENCIA = 30;

  function db() {
    if (global.CariHubDB) return global.CariHubDB;
    if (global.firebase && global.firebase.firestore) return global.firebase.firestore();
    return null;
  }

  function auth() {
    if (global.CariHubAuth) return global.CariHubAuth;
    if (global.firebase && global.firebase.auth) return global.firebase.auth();
    return null;
  }

  function formatMxn(n) {
    return '$' + Number(n || 0).toLocaleString('es-MX') + ' MXN';
  }

  function periodoLabel(periodo) {
    var map = { mes: '1 mes', quincena: '15 días', semana: '7 días' };
    return map[periodo] || '1 mes';
  }

  function precioBase(tipo, periodo) {
    periodo = periodo || 'mes';
    var key = (tipo === 'banner' ? 'banner_' : 'perfil_') + periodo;
    return PRECIOS[key] || (tipo === 'banner' ? PRECIOS.banner_mes : PRECIOS.perfil_mes);
  }

  function cotizar(opts) {
    opts = opts || {};
    var tipo = opts.tipo === 'banner' ? 'banner' : 'perfil';
    var periodo = opts.periodo || 'mes';
    var base = precioBase(tipo, periodo);
    var adicional = opts.esAdicional === true || opts.perfilAdicional === true || opts.bannerAdicional === true;
    var descuento = adicional ? (tipo === 'banner' ? DESCUENTO_BANNER_ADICIONAL : DESCUENTO_PERFIL_ADICIONAL) : 0;
    var final_ = descuento > 0 ? Math.round(base * (1 - descuento)) : base;
    return {
      tipo: tipo,
      periodo: periodo,
      periodoLabel: periodoLabel(periodo),
      precioLista: base,
      descuentoPct: Math.round(descuento * 100),
      precioFinal: final_,
      esAdicional: adicional,
      primerMesGratis: !adicional && tipo === 'perfil' && opts.primerMesGratis !== false,
      precioListaFmt: formatMxn(base),
      precioFinalFmt: formatMxn(final_)
    };
  }

  function leerRawPerfil(pub) {
    if (!pub) return {};
    return pub._raw || pub;
  }

  function perfilRequierePago(pub) {
    if (!pub || pub.tipo !== 'perfil') return false;
    var r = leerRawPerfil(pub);
    if (r.pagado === true && r.activo === true) return false;
    if (r.primerMesGratis === true && r.aprobado === true && r.activo === true) return false;
    if (r.estadoPago === 'gratis_30_dias' && r.activo === true) return false;
    var rev = String(r.estadoRevision || '').toLowerCase();
    var aprobado = r.aprobado === true || rev === 'aprobado';
    if (!aprobado && r.autorizadoParaPago !== true) return false;
    if (r.autorizadoParaPago === true && r.pagado !== true) return true;
    if (aprobado && r.primerMesGratis === false && r.pagado !== true && r.activo !== true) return true;
    return false;
  }

  function bannerRequierePago(banner) {
    if (!banner) return false;
    var r = leerRawPerfil(banner);
    if (r.pagado === true && r.activo === true) return false;
    if (r.autorizadoParaPago === true && r.pagado !== true) return true;
    var rev = String(r.estadoRevision || r.estado || '').toLowerCase();
    return (rev === 'aprobado' || rev === 'autorizado_pago') && r.pagado !== true && r.activo !== true;
  }

  function buildPagoUrl(params) {
    params = params || {};
    var qs = new URLSearchParams();
    if (params.tipo) qs.set('tipo', params.tipo);
    if (params.perfilId) qs.set('perfilId', params.perfilId);
    if (params.bannerId) qs.set('bannerId', params.bannerId);
    if (params.periodo) qs.set('periodo', params.periodo);
    var s = qs.toString();
    return 'cuenta-pago-publicacion.html' + (s ? '?' + s : '');
  }

  function cotizarDesdePublicacion(pub) {
    if (!pub) return cotizar({});
    var r = leerRawPerfil(pub);
    var tipo = pub.tipo === 'banner' || pub.origen === 'solicitudes_anuncios' ? 'banner' : 'perfil';
    var periodo = (r.periodoPublicidad || r.periodo || 'mes').toLowerCase();
    if (periodo.indexOf('15') >= 0 || periodo.indexOf('quinc') >= 0) periodo = 'quincena';
    else if (periodo.indexOf('7') >= 0 || periodo.indexOf('sem') >= 0) periodo = 'semana';
    else periodo = 'mes';
    return cotizar({
      tipo: tipo,
      periodo: periodo,
      esAdicional: r.perfilAdicional === true || r.primerMesGratis === false,
      primerMesGratis: r.primerMesGratis
    });
  }

  function addDays(date, days) {
    var d = new Date(date.getTime());
    d.setDate(d.getDate() + days);
    return d;
  }

  function diasPorPeriodo(periodo) {
    if (periodo === 'semana') return 7;
    if (periodo === 'quincena') return 15;
    return DIAS_VIGENCIA;
  }

  function completarPagoPerfil(cuentaUid, perfilId, cotizacion, metodo) {
    var firestore = db();
    if (!firestore || !cuentaUid || !perfilId) {
      return Promise.reject(new Error('No se pudo registrar el pago.'));
    }
    var ahora = new Date();
    var dias = diasPorPeriodo(cotizacion.periodo);
    var vence = addDays(ahora, dias);
    var patch = {
      pagado: true,
      activo: true,
      aprobado: true,
      vencido: false,
      autorizadoParaPago: false,
      estadoPago: 'pagado',
      estadoRevision: 'aprobado',
      actualizacionPendiente: false,
      fechaPublicacion: ahora,
      fechaVencimiento: vence,
      ultimoPagoMonto: cotizacion.precioFinal,
      ultimoPagoMetodo: metodo || 'demo',
      ultimoPagoFecha: ahora.toISOString()
    };
    var updates = {};
    Object.keys(patch).forEach(function (k) {
      updates['perfilesDetalle.' + perfilId + '.' + k] = patch[k];
    });
    updates.perfilActivoId = perfilId;

    return firestore.collection('usuarios').doc(cuentaUid).get().then(function (snap) {
      var data = snap.exists ? (snap.data() || {}) : {};
      var vinc = Array.isArray(data.perfilesVinculados) ? data.perfilesVinculados.slice() : [];
      var idx = vinc.findIndex(function (v) { return v && v.perfilId === perfilId; });
      if (idx >= 0) {
        vinc[idx] = Object.assign({}, vinc[idx], { activo: true });
        updates.perfilesVinculados = vinc;
      }
      return firestore.collection('usuarios').doc(cuentaUid).update(updates);
    }).then(function () {
      return firestore.collection('pagos').add({
        cuentaUid: cuentaUid,
        perfilId: perfilId,
        tipo: 'perfil',
        monto: cotizacion.precioFinal,
        montoLista: cotizacion.precioLista,
        descuentoPct: cotizacion.descuentoPct,
        periodo: cotizacion.periodo,
        metodo: metodo || 'demo',
        estado: 'completado',
        fecha: ahora
      });
    });
  }

  function completarPagoBanner(cuentaUid, bannerId, cotizacion, metodo) {
    var firestore = db();
    if (!firestore || !bannerId) {
      return Promise.reject(new Error('No se pudo registrar el pago del banner.'));
    }
    var ahora = new Date();
    var dias = diasPorPeriodo(cotizacion.periodo);
    var vence = addDays(ahora, dias);
    return firestore.collection('solicitudes_anuncios').doc(bannerId).update({
      pagado: true,
      activo: true,
      aprobado: true,
      autorizadoParaPago: false,
      estadoPago: 'pagado',
      estado: 'activo',
      estadoRevision: 'aprobado',
      fechaPublicacion: ahora,
      fechaVencimiento: vence,
      ultimoPagoMonto: cotizacion.precioFinal,
      ultimoPagoMetodo: metodo || 'demo',
      ultimoPagoFecha: ahora.toISOString()
    }).then(function () {
      return firestore.collection('pagos').add({
        cuentaUid: cuentaUid || '',
        bannerId: bannerId,
        tipo: 'banner',
        monto: cotizacion.precioFinal,
        montoLista: cotizacion.precioLista,
        descuentoPct: cotizacion.descuentoPct,
        periodo: cotizacion.periodo,
        metodo: metodo || 'demo',
        estado: 'completado',
        fecha: ahora
      });
    });
  }

  global.CariHubPublicacionPagos = {
    PRECIOS: PRECIOS,
    DESCUENTO_PERFIL_ADICIONAL: DESCUENTO_PERFIL_ADICIONAL,
    DESCUENTO_BANNER_ADICIONAL: DESCUENTO_BANNER_ADICIONAL,
    cotizar: cotizar,
    cotizarDesdePublicacion: cotizarDesdePublicacion,
    formatMxn: formatMxn,
    buildPagoUrl: buildPagoUrl,
    perfilRequierePago: perfilRequierePago,
    bannerRequierePago: bannerRequierePago,
    completarPagoPerfil: completarPagoPerfil,
    completarPagoBanner: completarPagoBanner
  };
})(typeof window !== 'undefined' ? window : globalThis);
