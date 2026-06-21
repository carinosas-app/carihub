/**
 * API reportes messenger (MSG-080).
 */
(function (global) {
  'use strict';

  var COL_CONV = 'conversaciones';

  function schema() {
    return global.CariHubMessengerReportesSchema;
  }

  function messengerSchema() {
    return global.CariHubMessengerSchema;
  }

  function db() {
    if (global.CariHubDB) return global.CariHubDB;
    if (global.firebase && typeof global.firebase.firestore === 'function') return global.firebase.firestore();
    return null;
  }

  function auth() {
    if (global.CariHubAuth) return global.CariHubAuth;
    if (global.auth) return global.auth;
    if (global.firebase && typeof global.firebase.auth === 'function') return global.firebase.auth();
    return null;
  }

  function requireUser() {
    var user = auth() && auth().currentUser;
    if (!user || user.isAnonymous) throw new Error('Inicia sesión para enviar un reporte.');
    return user;
  }

  function resolveReportadoId(conv, reportanteId) {
    reportanteId = String(reportanteId || '');
    if (reportanteId === conv.cuentaUid) return conv.visitanteUid;
    if (reportanteId === conv.visitanteUid) return conv.cuentaUid;
    throw new Error('No participas en esta conversación.');
  }

  function loadConversacion(conversacionId) {
    var Ms = messengerSchema();
    var firestore = db();
    if (!Ms || !firestore || !conversacionId) {
      return Promise.reject(new Error('Conversación no disponible.'));
    }
    return firestore
      .collection(COL_CONV)
      .doc(String(conversacionId))
      .get()
      .then(function (snap) {
        if (!snap.exists) throw new Error('Conversación no encontrada.');
        return Ms.normalizeConversacion(snap);
      });
  }

  function ultimoMensajeContraparte(conversacionId, reportadoId) {
    var Ms = messengerSchema();
    var firestore = db();
    if (!Ms || !firestore) return Promise.resolve('');
    reportadoId = String(reportadoId || '');
    return firestore
      .collection(COL_CONV)
      .doc(String(conversacionId))
      .collection('mensajes')
      .orderBy('createdAt', 'desc')
      .limit(24)
      .get()
      .then(function (snap) {
        var doc = snap.docs.find(function (d) {
          var m = Ms.normalizeMensaje(d, conversacionId);
          return m.emisorUid === reportadoId;
        });
        return doc ? doc.id : '';
      })
      .catch(function () {
        return '';
      });
  }

  /**
   * @param {{ tipo, conversacionId, motivo, detalle?, mensajeId? }} input
   */
  function crearReporte(input) {
    var Rs = schema();
    if (!Rs) return Promise.reject(new Error('Schema de reportes no disponible.'));
    var firestore = db();
    if (!firestore) return Promise.reject(new Error('Firestore no disponible.'));
    var user = requireUser();
    input = input || {};
    var tipo = String(input.tipo || 'reportar_conversacion');
    var conversacionId = String(input.conversacionId || '');
    if (!conversacionId) return Promise.reject(new Error('Selecciona una conversación.'));

    return loadConversacion(conversacionId).then(function (conv) {
      if (user.uid !== conv.cuentaUid && user.uid !== conv.visitanteUid) {
        throw new Error('Sin permiso en esta conversación.');
      }
      var reportadoId = resolveReportadoId(conv, user.uid);
      var chain = Promise.resolve(input.mensajeId || '');
      if (tipo === 'reportar_mensaje' && !input.mensajeId) {
        chain = ultimoMensajeContraparte(conversacionId, reportadoId);
      }
      return chain.then(function (mensajeId) {
        if (tipo === 'reportar_mensaje' && !mensajeId) {
          throw new Error('No hay mensaje de la contraparte para reportar.');
        }
        var payload = Rs.buildPayload(
          {
            tipo: tipo,
            reportadoId: reportadoId,
            conversacionId: conversacionId,
            mensajeId: tipo === 'reportar_mensaje' ? mensajeId : undefined,
            contextoTipo: conv.contextoTipo,
            contextoId: conv.contextoId,
            cuentaUid: conv.cuentaUid,
            motivo: input.motivo,
            detalle: input.detalle
          },
          user.uid
        );
        var ref = firestore.collection(Rs.COLLECTION).doc();
        return ref.set(payload).then(function () {
          return Rs.normalize(Object.assign({}, payload, { id: ref.id }), ref.id);
        });
      });
    });
  }

  global.CariHubMessengerReportes = {
    crearReporte: crearReporte,
    loadConversacion: loadConversacion,
    ultimoMensajeContraparte: ultimoMensajeContraparte
  };
})(typeof window !== 'undefined' ? window : globalThis);
