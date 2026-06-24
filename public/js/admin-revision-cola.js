/**
 * ADM-000 — Cola de revisión unificada + transiciones schema (sin rediseño admin).
 */
(function (global) {
  'use strict';

  var MAP_BANNER_LEGACY = {
    pendiente: 'enviado_revision',
    en_revision: 'enviado_revision',
    requiere_correccion: 'correccion_solicitada',
    autorizado_pago: 'autorizado_para_pago',
    activo: 'publicado',
    rechazado: 'rechazado',
    vencido: 'vencido',
    revision_soporte: 'enviado_revision',
    sin_revisar: 'enviado_revision'
  };

  var MAP_PERFIL_LEGACY = {
    registro_pendiente: 'enviado_revision',
    actualizacion_pendiente: 'enviado_revision',
    aprobado: 'publicado',
    no_aprobado: 'rechazado',
    vencido: 'vencido',
    autorizado_pago: 'autorizado_para_pago'
  };

  var ACCIONES_BANNER = {
    enviado_revision: [
      { id: 'solicitar_correccion', label: 'Solicitar corrección', estadoLegacy: 'requiere_correccion', estadoRevision: 'correccion_solicitada' },
      { id: 'autorizar_pago', label: 'Autorizar pago', estadoLegacy: 'autorizado_pago', estadoRevision: 'autorizado_para_pago' },
      { id: 'rechazar', label: 'Rechazar', estadoLegacy: 'rechazado', estadoRevision: 'rechazado' }
    ],
    correccion_solicitada: [
      { id: 'autorizar_pago', label: 'Autorizar pago', estadoLegacy: 'autorizado_pago', estadoRevision: 'autorizado_para_pago' },
      { id: 'rechazar', label: 'Rechazar', estadoLegacy: 'rechazado', estadoRevision: 'rechazado' }
    ],
    autorizado_para_pago: [
      { id: 'confirmar_pago', label: 'Confirmar pago recibido', estadoLegacy: 'autorizado_pago', estadoRevision: 'pago_confirmado', nota: 'Pago confirmado manualmente (MVP)' },
      { id: 'rechazar', label: 'Rechazar', estadoLegacy: 'rechazado', estadoRevision: 'rechazado' }
    ],
    pago_confirmado: [
      { id: 'publicar', label: 'Publicar banner', estadoLegacy: 'activo', estadoRevision: 'publicado', syncBanner: true },
      { id: 'solicitar_correccion', label: 'Enviar a revisión post-pago', estadoLegacy: 'requiere_correccion', estadoRevision: 'revision_post_pago' }
    ],
    revision_post_pago: [
      { id: 'publicar', label: 'Aprobar publicación', estadoLegacy: 'activo', estadoRevision: 'publicado', syncBanner: true },
      { id: 'solicitar_correccion', label: 'Solicitar corrección', estadoLegacy: 'requiere_correccion', estadoRevision: 'correccion_solicitada' },
      { id: 'rechazar', label: 'Rechazar', estadoLegacy: 'rechazado', estadoRevision: 'rechazado' }
    ],
    publicado: [
      { id: 'marcar_vencido', label: 'Marcar vencido', estadoLegacy: 'vencido', estadoRevision: 'vencido', syncBanner: true }
    ],
    rechazado: [],
    vencido: []
  };

  var ACCIONES_PERFIL = {
    enviado_revision: [
      { id: 'aprobar_gratis', label: 'Aprobar + 30 días gratis', handler: 'aprobarGratis' },
      { id: 'autorizar_pago', label: 'Autorizar pago', handler: 'aprobarPendientePago' },
      { id: 'rechazar', label: 'Quitar aprobación', handler: 'quitarAprobacion' }
    ],
    correccion_solicitada: [
      { id: 'aprobar_cambios', label: 'Aprobar cambios', handler: 'aprobarCambios' },
      { id: 'rechazar', label: 'Quitar aprobación', handler: 'quitarAprobacion' }
    ]
  };

  var ESTADOS_COLA_BANNER = ['enviado_revision', 'correccion_solicitada', 'autorizado_para_pago', 'pago_confirmado', 'revision_post_pago'];
  var ESTADOS_COLA_PERFIL = ['enviado_revision', 'correccion_solicitada'];

  function normalizeEstadoBanner(solicitud) {
    solicitud = solicitud || {};
    var raw = solicitud.estadoRevision || solicitud.estadoSolicitud || solicitud.estadoAdmin || solicitud.estado || 'pendiente';
    return MAP_BANNER_LEGACY[raw] || raw;
  }

  function normalizeEstadoPerfil(usuario) {
    usuario = usuario || {};
    var raw = usuario.estadoRevision || 'sin_revision';
    if (usuario.actualizacionPendiente && raw !== 'vencido') return 'enviado_revision';
    return MAP_PERFIL_LEGACY[raw] || raw;
  }

  function getAccionesPermitidas(tipo, estadoNormalizado) {
    if (tipo === 'banner') return (ACCIONES_BANNER[estadoNormalizado] || []).slice();
    if (tipo === 'perfil') return (ACCIONES_PERFIL[estadoNormalizado] || []).slice();
    return [];
  }

  function puedeTransicionar(tipo, estadoNormalizado, accionId) {
    return getAccionesPermitidas(tipo, estadoNormalizado).some(function (a) { return a.id === accionId; });
  }

  function resolverAccion(tipo, estadoNormalizado, accionId) {
    return getAccionesPermitidas(tipo, estadoNormalizado).find(function (a) { return a.id === accionId; }) || null;
  }

  function buildColaItems(usuarios, solicitudes) {
    usuarios = usuarios || [];
    solicitudes = solicitudes || [];
    var items = [];

    usuarios.forEach(function (u) {
      var norm = normalizeEstadoPerfil(u);
      if (ESTADOS_COLA_PERFIL.indexOf(norm) < 0) return;
      items.push({
        tipo: 'perfil',
        id: u.id,
        titulo: u.nombre || u.nombrePerfil || u.correo || u.id,
        subtitulo: u.correo || u.telefono || '',
        estadoNormalizado: norm,
        estadoLegacy: u.estadoRevision || '',
        fecha: u.fechaRegistro || u.actualizadoEn || null
      });
    });

    solicitudes.forEach(function (s) {
      var norm = normalizeEstadoBanner(s);
      if (ESTADOS_COLA_BANNER.indexOf(norm) < 0) return;
      items.push({
        tipo: 'banner',
        id: s.id,
        titulo: s.nombre || s.nombreNegocio || 'Banner',
        subtitulo: (s.slotId || '') + (s.ciudad ? ' · ' + s.ciudad : ''),
        estadoNormalizado: norm,
        estadoLegacy: s.estado || s.estadoSolicitud || '',
        fecha: s.fecha || s.fechaEnvioRevision || s.actualizadoEn || null
      });
    });

    items.sort(function (a, b) {
      var ta = a.fecha && a.fecha.toDate ? a.fecha.toDate().getTime() : (a.fecha ? new Date(a.fecha).getTime() : 0);
      var tb = b.fecha && b.fecha.toDate ? b.fecha.toDate().getTime() : (b.fecha ? new Date(b.fecha).getTime() : 0);
      return tb - ta;
    });

    return items;
  }

  function buildPayloadTransicionBanner(accion, adminEmail, nota) {
    var payload = {
      estado: accion.estadoLegacy,
      estadoRevision: accion.estadoRevision,
      actualizadoEn: new Date(),
      actualizadoPor: adminEmail
    };
    if (nota) payload.notaAdmin = nota;
    if (accion.id === 'confirmar_pago') {
      payload.estadoPago = 'confirmado';
      payload.autorizadoParaPago = true;
    }
    if (accion.id === 'autorizar_pago') {
      payload.autorizadoParaPago = true;
      payload.estadoPago = 'pendiente';
    }
    if (accion.estadoLegacy === 'activo') {
      payload.activo = true;
      payload.aprobado = true;
    }
    if (accion.estadoLegacy === 'rechazado' || accion.estadoLegacy === 'vencido') {
      payload.activo = false;
    }
    return payload;
  }

  function renderAccionesBannerHtml(solicitudId, estadoNormalizado) {
    var acciones = getAccionesPermitidas('banner', estadoNormalizado);
    if (!acciones.length) {
      return '<p class="aviso">Sin transiciones disponibles para este estado.</p>';
    }
    return acciones.map(function (a) {
      return '<button type="button" class="btn btn-cambios" style="margin:4px 4px 4px 0;" onclick="aplicarTransicionSolicitudPublicidad(\'' +
        solicitudId + '\',\'' + a.id + '\')">' + a.label + '</button>';
    }).join('');
  }

  function etiquetaEstadoSchema(estado) {
    var map = {
      enviado_revision: 'Enviado a revisión',
      correccion_solicitada: 'Corrección solicitada',
      autorizado_para_pago: 'Autorizado para pago',
      pago_confirmado: 'Pago confirmado',
      revision_post_pago: 'Revisión post-pago',
      publicado: 'Publicado',
      rechazado: 'Rechazado',
      vencido: 'Vencido'
    };
    return map[estado] || estado;
  }

  global.AdminRevisionCola = {
    MAP_BANNER_LEGACY: MAP_BANNER_LEGACY,
    MAP_PERFIL_LEGACY: MAP_PERFIL_LEGACY,
    ACCIONES_BANNER: ACCIONES_BANNER,
    ACCIONES_PERFIL: ACCIONES_PERFIL,
    normalizeEstadoBanner: normalizeEstadoBanner,
    normalizeEstadoPerfil: normalizeEstadoPerfil,
    getAccionesPermitidas: getAccionesPermitidas,
    puedeTransicionar: puedeTransicionar,
    resolverAccion: resolverAccion,
    buildColaItems: buildColaItems,
    buildPayloadTransicionBanner: buildPayloadTransicionBanner,
    renderAccionesBannerHtml: renderAccionesBannerHtml,
    etiquetaEstadoSchema: etiquetaEstadoSchema
  };
})(typeof window !== 'undefined' ? window : globalThis);
