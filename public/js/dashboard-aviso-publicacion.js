/**
 * Avisos superiores del dashboard: textos, temas por sector y notificaciones de activación.
 */
(function (global) {
  'use strict';

  var AVISO_VISTO_KEY = 'carihub_aviso_publicacion_visto';
  var NOTIF_ENVIADA_KEY = 'carihub_notif_publicacion_enviada';

  var SECTOR_IDS = [
    'adultos', 'salud', 'bienestar', 'profesionales', 'automotriz', 'hogar', 'comercio',
    'bienes-raices', 'eventos', 'transporte', 'industria', 'tecnologia', 'mascotas',
    'educacion', 'restaurantes'
  ];

  function leerJson(key, fallback) {
    try {
      var raw = global.localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function guardarJson(key, val) {
    try {
      global.localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { /* ignore */ }
  }

  function sectorDePublicacion(pub) {
    if (!pub) return 'default';
    var r = pub._raw || pub;
    if (r.sectorId && SECTOR_IDS.indexOf(r.sectorId) >= 0) return r.sectorId;
    var cat = String(pub.categoria || r.categoria || r.subcategoria || '').toLowerCase();
    if (/escort|adult|strip|sw|sex|dominatrix|masaje sensual/.test(cat)) return 'adultos';
    if (/médic|doctor|salud|enfermer|clínica|dent/.test(cat)) return 'salud';
    if (/spa|bienestar|yoga|fitness|wellness/.test(cat)) return 'bienestar';
    if (/abogad|contador|notar|profesion/.test(cat)) return 'profesionales';
    if (/restaur|bar|antro|comida|caf/.test(cat)) return 'restaurantes';
    if (/plom|electric|hogar|limpie/.test(cat)) return 'hogar';
    if (/auto|mecánic|refacc/.test(cat)) return 'automotriz';
    return 'default';
  }

  function formatearVencimiento(raw) {
    if (!raw) return 'consulta tu plan en el dashboard';
    var d = raw;
    if (raw && typeof raw.toDate === 'function') d = raw.toDate();
    else if (!(d instanceof Date)) d = new Date(d);
    if (isNaN(d.getTime())) return 'fecha por confirmar';
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function metaPublicacion(pub) {
    if (!pub) return { nombre: 'Tu publicación', categoria: '', geo: '', vence: '' };
    var r = pub._raw || pub;
    var nombre = pub.nombrePublico || r.nombre || r.alias || 'Tu publicación';
    var categoria = pub.categoria || r.categoria || r.subcategoria || 'Sin categoría';
    var partes = [pub.pais || r.pais, pub.estado || r.estado, pub.ciudad || r.ciudad].filter(Boolean);
    var geo = partes.length ? partes.join(', ') : 'ubicación pendiente';
    var vence = formatearVencimiento(r.fechaVencimiento || pub.plan && pub.plan.fechaVencimiento);
    return { nombre: nombre, categoria: categoria, geo: geo, vence: vence };
  }

  function avisoFueVisto(contextoId, tipo) {
    if (!contextoId) return false;
    var store = leerJson(AVISO_VISTO_KEY, {});
    return !!(store[contextoId] && store[contextoId][tipo]);
  }

  function marcarAvisoVisto(contextoId, tipo) {
    if (!contextoId || !tipo) return;
    var store = leerJson(AVISO_VISTO_KEY, {});
    if (!store[contextoId]) store[contextoId] = {};
    store[contextoId][tipo] = Date.now();
    guardarJson(AVISO_VISTO_KEY, store);
  }

  function notifYaEnviada(contextoId, clave) {
    var store = leerJson(NOTIF_ENVIADA_KEY, {});
    return store[contextoId + '::' + clave] === true;
  }

  function marcarNotifEnviada(contextoId, clave) {
    var store = leerJson(NOTIF_ENVIADA_KEY, {});
    store[contextoId + '::' + clave] = true;
    guardarJson(NOTIF_ENVIADA_KEY, store);
  }

  function perfilEstaActivo(pub) {
    if (!pub) return false;
    var r = pub._raw || pub;
    if (pub.tipo === 'banner' || pub.origen === 'solicitudes_anuncios') {
      return r.activo === true || r.estado === 'activo';
    }
    return r.activo === true && (r.aprobado === true || String(r.estadoRevision || '').toLowerCase() === 'aprobado');
  }

  function perfilEstaPendiente(pub) {
    if (!pub || pub.tipo !== 'perfil') return false;
    var rev = (pub.estadoPublicacion && pub.estadoPublicacion.revision) ||
      ((pub._raw && (pub._raw.estadoRevision || pub._raw.estadoAdmin)) || '');
    var txt = String(rev || '').toLowerCase();
    return txt.includes('pendiente') || txt.includes('revision') ||
      txt === 'registro_pendiente' || txt === 'actualizacion_pendiente';
  }

  function resolverAvisoPublicacion(pub, Pagos) {
    if (!pub) return null;
    var contextoId = pub.perfilId || pub.id || pub.bannerId;
    if (!contextoId) return null;
    var sectorId = sectorDePublicacion(pub);
    var esBanner = pub.tipo === 'banner' || pub.origen === 'solicitudes_anuncios';
    var meta = metaPublicacion(pub);

    if (!esBanner && Pagos && Pagos.perfilRequierePago(pub)) {
      var cot = Pagos.cotizarDesdePublicacion(pub);
      return {
        tipo: 'pago_pendiente',
        contextoId: contextoId,
        perfilId: contextoId,
        esBanner: false,
        sectorId: sectorId,
        esPerfilAdicional: cot.esAdicional,
        descuentoPct: cot.descuentoPct,
        meta: meta
      };
    }

    if (esBanner && Pagos && Pagos.bannerRequierePago(pub)) {
      var cotB = Pagos.cotizar({ tipo: 'banner', periodo: 'mes', esAdicional: true });
      return {
        tipo: 'pago_pendiente',
        contextoId: contextoId,
        bannerId: contextoId,
        esBanner: true,
        sectorId: sectorId,
        descuentoPct: cotB.descuentoPct,
        meta: meta
      };
    }

    if (perfilEstaActivo(pub) && !avisoFueVisto(contextoId, 'activado')) {
      var r = pub._raw || {};
      return {
        tipo: 'publicacion_activa',
        contextoId: contextoId,
        perfilId: esBanner ? null : contextoId,
        bannerId: esBanner ? contextoId : null,
        esBanner: esBanner,
        sectorId: sectorId,
        recienPagado: r.pagado === true && r.estadoPago === 'pagado',
        primerMesGratis: r.primerMesGratis !== false && !r.perfilAdicional,
        meta: meta
      };
    }

    if (!esBanner && perfilEstaPendiente(pub)) {
      var raw = pub._raw || {};
      return {
        tipo: 'solicitud_enviada',
        contextoId: contextoId,
        perfilId: contextoId,
        esBanner: false,
        sectorId: sectorId,
        esPerfilAdicional: raw.perfilAdicional === true || raw.primerMesGratis === false,
        meta: meta
      };
    }

    return null;
  }

  function textoAviso(aviso) {
    if (!aviso) return '';
    var m = aviso.meta || {};
    var etiqueta = aviso.esBanner ? 'banner' : 'perfil';
    var nombre = m.nombre || ('Tu ' + etiqueta);

    if (aviso.tipo === 'publicacion_activa') {
      if (aviso.recienPagado) {
        return '¡Tu ' + etiqueta + ' ya está circulando! «' + nombre + '» está publicado en ' +
          m.categoria + ' · ' + m.geo + '. Vigente hasta ' + m.vence + '.';
      }
      if (aviso.primerMesGratis) {
        return '¡Tu ' + etiqueta + ' ya está activo! «' + nombre + '» visible en ' +
          m.categoria + ' · ' + m.geo + '. Mes de prueba gratis hasta ' + m.vence + '.';
      }
      return '¡Tu ' + etiqueta + ' ya está activo! «' + nombre + '» en ' +
        m.categoria + ' · ' + m.geo + '. Vigente hasta ' + m.vence + '.';
    }

    if (aviso.tipo === 'pago_pendiente') {
      var pct = aviso.descuentoPct || 50;
      if (aviso.esPerfilAdicional || aviso.esBanner) {
        return '¡Administración aprobó tu ' + etiqueta + ' adicional! «' + nombre + '» · ' +
          m.categoria + ' · ' + m.geo + '. Completa el pago para publicarlo (' + pct + '% OFF el primer periodo).';
      }
      return '¡Aprobado por administración! Completa el pago para publicar «' + nombre + '» (' + pct + '% OFF).';
    }

    if (aviso.esPerfilAdicional) {
      return 'Solicitud enviada para «' + nombre + '» (' + m.categoria + ' · ' + m.geo +
        '). Pendiente de aprobación. Al aprobarse deberás pagar (50% OFF el primer periodo).';
    }

    return 'Solicitud enviada para «' + nombre + '» (' + m.categoria + ' · ' + m.geo +
      '). Pendiente de aprobación. Si se aprueba, recibirás tu mes de prueba gratis.';
  }

  function etiquetaBoton(aviso) {
    if (!aviso) return '';
    if (aviso.tipo === 'pago_pendiente') return 'Continuar al pago';
    if (aviso.tipo === 'publicacion_activa') return 'Ver publicación';
    return '';
  }

  function aplicarTemaAviso(wrap, btnEl, aviso) {
    if (!wrap) return;
    wrap.classList.remove(
      'dash-aviso--ok', 'dash-aviso--pay', 'dash-aviso--activo'
    );
    SECTOR_IDS.forEach(function (s) {
      wrap.classList.remove('dash-aviso--sector-' + s);
    });
    wrap.classList.remove('dash-aviso--sector-default');

    var sector = (aviso && aviso.sectorId) || 'default';
    wrap.classList.add('dash-aviso--sector-' + (SECTOR_IDS.indexOf(sector) >= 0 ? sector : 'default'));

    if (!aviso) return;
    if (aviso.tipo === 'solicitud_enviada') wrap.classList.add('dash-aviso--ok');
    else if (aviso.tipo === 'pago_pendiente') wrap.classList.add('dash-aviso--pay');
    else if (aviso.tipo === 'publicacion_activa') wrap.classList.add('dash-aviso--activo');

    if (btnEl) {
      btnEl.style.background = '';
      btnEl.style.borderColor = '';
    }
  }

  function urlBotonAviso(aviso) {
    if (!aviso) return null;
    if (aviso.tipo === 'pago_pendiente') {
      if (aviso.esBanner && aviso.bannerId) {
        return 'cuenta-pago-publicacion.html?tipo=banner&bannerId=' + encodeURIComponent(aviso.bannerId);
      }
      if (aviso.perfilId) {
        return 'cuenta-pago-publicacion.html?tipo=perfil&perfilId=' + encodeURIComponent(aviso.perfilId);
      }
    }
    if (aviso.tipo === 'publicacion_activa' && window.DashModuleNav) {
      return null;
    }
    return null;
  }

  async function asegurarNotificacionActivacion(cuentaUid, pub, aviso) {
    if (!aviso || aviso.tipo !== 'publicacion_activa' || !global.DashAvisos || !DashAvisos.crear) return;
    var ctxId = aviso.contextoId;
    var clave = aviso.recienPagado ? 'circulando' : (aviso.primerMesGratis ? 'activo_gratis' : 'activo');
    if (notifYaEnviada(ctxId, clave)) return;

    var m = aviso.meta || metaPublicacion(pub);
    var titulo = aviso.esBanner ? 'Banner activado' : 'Perfil activado';
    if (aviso.recienPagado) titulo = aviso.esBanner ? 'Tu banner ya circula' : 'Tu perfil ya circula';

    var texto = aviso.esBanner
      ? ('«' + m.nombre + '» publicado. ' + m.categoria + ' · ' + m.geo + '. Vence ' + m.vence + '.')
      : ('«' + m.nombre + '» activo en ' + m.categoria + ' · ' + m.geo + '. Vence ' + m.vence + '.');

    await DashAvisos.crear(cuentaUid, {
      contextoTipo: aviso.esBanner ? 'banner' : 'perfil',
      contextoId: ctxId,
      tipo: 'revision',
      titulo: titulo,
      texto: texto,
      dedupeKey: clave + '_' + ctxId
    });
    marcarNotifEnviada(ctxId, clave);
  }

  global.DashAvisoPublicacion = {
    sectorDePublicacion: sectorDePublicacion,
    metaPublicacion: metaPublicacion,
    resolverAvisoPublicacion: resolverAvisoPublicacion,
    textoAviso: textoAviso,
    etiquetaBoton: etiquetaBoton,
    aplicarTemaAviso: aplicarTemaAviso,
    urlBotonAviso: urlBotonAviso,
    avisoFueVisto: avisoFueVisto,
    marcarAvisoVisto: marcarAvisoVisto,
    asegurarNotificacionActivacion: asegurarNotificacionActivacion,
    perfilEstaActivo: perfilEstaActivo
  };
})(typeof window !== 'undefined' ? window : globalThis);
