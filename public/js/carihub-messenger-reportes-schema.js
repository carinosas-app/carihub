/**
 * Schema reportes_mensajeria v1 (MSG-021 / MSG-080).
 * Firestore: reportes_mensajeria/{reporteId}
 */
(function (global) {
  'use strict';

  var SCHEMA_VERSION = 'v1';
  var COLLECTION = 'reportes_mensajeria';

  var TIPOS = ['reportar_usuario', 'reportar_conversacion', 'reportar_mensaje'];
  var ESTADOS = ['pendiente', 'en_revision', 'resuelto', 'rechazado'];
  var MOTIVOS = [
    'acoso',
    'contenido_inapropiado',
    'spam',
    'fraude',
    'suplantacion',
    'menor_edad',
    'extorsion',
    'phishing',
    'otro'
  ];

  var MOTIVO_LABELS = {
    acoso: 'Acoso o amenazas',
    contenido_inapropiado: 'Contenido inapropiado',
    spam: 'Spam o publicidad',
    fraude: 'Fraude o estafa',
    suplantacion: 'Suplantación de identidad',
    menor_edad: 'Menor de edad',
    extorsion: 'Extorsión',
    phishing: 'Phishing o enlaces peligrosos',
    otro: 'Otro'
  };

  var TIPO_LABELS = {
    reportar_usuario: 'Reportar usuario',
    reportar_conversacion: 'Reportar conversación',
    reportar_mensaje: 'Reportar mensaje'
  };

  function isEnum(val, list) {
    return list.indexOf(String(val || '')) !== -1;
  }

  function pickEnum(val, list, fallback) {
    return isEnum(val, list) ? String(val) : fallback;
  }

  function ts() {
    return global.firebase && global.firebase.firestore && global.firebase.firestore.FieldValue
      ? global.firebase.firestore.FieldValue.serverTimestamp()
      : new Date();
  }

  function normalize(docOrData, id) {
    var data = docOrData;
    if (docOrData && typeof docOrData.data === 'function') {
      if (!docOrData.exists) return null;
      id = docOrData.id;
      data = docOrData.data();
    }
    data = data || {};
    return {
      id: String(id || data.id || ''),
      schemaVersion: pickEnum(data.schemaVersion, [SCHEMA_VERSION], SCHEMA_VERSION),
      reportanteId: String(data.reportanteId || ''),
      reportadoId: String(data.reportadoId || ''),
      tipo: pickEnum(data.tipo, TIPOS, 'reportar_conversacion'),
      conversacionId: String(data.conversacionId || ''),
      mensajeId: data.mensajeId ? String(data.mensajeId) : '',
      contextoTipo: data.contextoTipo === 'banner' ? 'banner' : 'perfil',
      contextoId: String(data.contextoId || ''),
      cuentaUid: String(data.cuentaUid || ''),
      motivo: pickEnum(data.motivo, MOTIVOS, 'otro'),
      motivoLabel: MOTIVO_LABELS[pickEnum(data.motivo, MOTIVOS, 'otro')] || data.motivo,
      detalle: String(data.detalle || ''),
      estado: pickEnum(data.estado, ESTADOS, 'pendiente'),
      creadoEn: data.creadoEn || null,
      actualizadoEn: data.actualizadoEn || null
    };
  }

  function buildPayload(input, reportanteId) {
    input = input || {};
    reportanteId = String(reportanteId || input.reportanteId || '');
    var tipo = pickEnum(input.tipo, TIPOS, 'reportar_conversacion');
    var payload = {
      schemaVersion: SCHEMA_VERSION,
      reportanteId: reportanteId,
      reportadoId: String(input.reportadoId || ''),
      tipo: tipo,
      conversacionId: String(input.conversacionId || ''),
      contextoTipo: input.contextoTipo === 'banner' ? 'banner' : 'perfil',
      contextoId: String(input.contextoId || ''),
      cuentaUid: String(input.cuentaUid || ''),
      motivo: pickEnum(input.motivo, MOTIVOS, 'otro'),
      estado: 'pendiente',
      creadoEn: ts(),
      actualizadoEn: ts()
    };
    if (input.detalle) payload.detalle = String(input.detalle).trim().slice(0, 2000);
    if (tipo === 'reportar_mensaje' && input.mensajeId) {
      payload.mensajeId = String(input.mensajeId);
    }
    if (input.senalIAId) payload.senalIAId = String(input.senalIAId);
    if (input.evidenciaRef) payload.evidenciaRef = String(input.evidenciaRef);
    return payload;
  }

  global.CariHubMessengerReportesSchema = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    COLLECTION: COLLECTION,
    TIPOS: TIPOS.slice(),
    ESTADOS: ESTADOS.slice(),
    MOTIVOS: MOTIVOS.slice(),
    MOTIVO_LABELS: Object.assign({}, MOTIVO_LABELS),
    TIPO_LABELS: Object.assign({}, TIPO_LABELS),
    normalize: normalize,
    buildPayload: buildPayload,
    labelMotivo: function (m) {
      return MOTIVO_LABELS[pickEnum(m, MOTIVOS, 'otro')] || m;
    },
    labelTipo: function (t) {
      return TIPO_LABELS[pickEnum(t, TIPOS, 'reportar_conversacion')] || t;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
