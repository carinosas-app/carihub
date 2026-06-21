/**
 * Schema bloqueos Messenger v1 (MSG-022).
 * Firestore: usuarios/{cuentaUid}/bloqueos/{bloqueadoUid}
 */
(function (global) {
  'use strict';

  var SCHEMA_VERSION = 'v1';
  var INICIADO_POR = ['usuario', 'admin', 'sistema'];
  var CONTEXTOS = ['perfil', 'banner', 'cuenta'];

  function ts() {
    return global.firebase && global.firebase.firestore && global.firebase.firestore.FieldValue
      ? global.firebase.firestore.FieldValue.serverTimestamp()
      : new Date();
  }

  function pickEnum(val, list, fallback) {
    return list.indexOf(String(val || '')) !== -1 ? String(val) : fallback;
  }

  function normalize(docOrData, cuentaUid, bloqueadoUid) {
    var data = docOrData;
    if (docOrData && typeof docOrData.data === 'function') {
      if (!docOrData.exists) return null;
      bloqueadoUid = docOrData.id;
      data = docOrData.data();
    }
    data = data || {};
    return {
      id: String(bloqueadoUid || data.bloqueadoUid || ''),
      bloqueadoUid: String(bloqueadoUid || data.bloqueadoUid || ''),
      cuentaUid: String(cuentaUid || data.cuentaUid || ''),
      schemaVersion: SCHEMA_VERSION,
      contextoTipo: pickEnum(data.contextoTipo, CONTEXTOS, ''),
      contextoId: String(data.contextoId || ''),
      conversacionId: String(data.conversacionId || ''),
      iniciadoPor: pickEnum(data.iniciadoPor, INICIADO_POR, 'usuario'),
      motivo: String(data.motivo || ''),
      creadoEn: data.creadoEn || null,
      actualizadoEn: data.actualizadoEn || null
    };
  }

  function buildPayload(input, cuentaUid) {
    input = input || {};
    cuentaUid = String(cuentaUid || input.cuentaUid || '');
    var bloqueadoUid = String(input.bloqueadoUid || '');
    if (!cuentaUid || !bloqueadoUid || cuentaUid === bloqueadoUid) {
      throw new Error('[Bloqueos] cuentaUid y bloqueadoUid inválidos');
    }
    var payload = {
      schemaVersion: SCHEMA_VERSION,
      cuentaUid: cuentaUid,
      bloqueadoUid: bloqueadoUid,
      iniciadoPor: pickEnum(input.iniciadoPor, INICIADO_POR, 'usuario'),
      creadoEn: ts(),
      actualizadoEn: ts()
    };
    if (input.contextoTipo) payload.contextoTipo = pickEnum(input.contextoTipo, CONTEXTOS, 'cuenta');
    if (input.contextoId) payload.contextoId = String(input.contextoId).slice(0, 120);
    if (input.conversacionId) payload.conversacionId = String(input.conversacionId).slice(0, 128);
    if (input.motivo) payload.motivo = String(input.motivo).slice(0, 500);
    return payload;
  }

  global.CariHubMessengerBloqueosSchema = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    INICIADO_POR: INICIADO_POR.slice(),
    CONTEXTOS: CONTEXTOS.slice(),
    normalize: normalize,
    buildPayload: buildPayload,
    collectionPath: function (cuentaUid) {
      return 'usuarios/' + String(cuentaUid || '') + '/bloqueos';
    },
    docPath: function (cuentaUid, bloqueadoUid) {
      return global.CariHubMessengerBloqueosSchema.collectionPath(cuentaUid) + '/' + String(bloqueadoUid || '');
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
