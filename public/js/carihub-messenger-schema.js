/**
 * Messenger v1 — esquema Firestore (TICKET-030).
 * Inbox NUNCA plano: key lógica (cuentaUid, contextoTipo, contextoId).
 *
 * Colecciones:
 *   conversaciones/{convId}
 *   conversaciones/{convId}/mensajes/{msgId}
 */
(function (global) {
  'use strict';

  var SCHEMA_VERSION = 'v1';
  var CONTEXTOS = ['perfil', 'banner'];
  var MAX_TEXTO = 4000;
  var MAX_PREVIEW = 240;

  function dbFieldValue() {
    return global.firebase &&
      global.firebase.firestore &&
      global.firebase.firestore.FieldValue
      ? global.firebase.firestore.FieldValue.serverTimestamp()
      : new Date();
  }

  function trimPreview(text) {
    text = String(text || '').replace(/\s+/g, ' ').trim();
    if (text.length <= MAX_PREVIEW) return text;
    return text.slice(0, MAX_PREVIEW - 1) + '…';
  }

  function sortUidPair(a, b) {
    a = String(a || '');
    b = String(b || '');
    return a < b ? [a, b] : [b, a];
  }

  function bytesToBase64Url(bytes) {
    var binary = '';
    bytes.forEach(function (b) {
      binary += String.fromCharCode(b);
    });
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function fallbackConversationId(params) {
    var slug = [
      params.cuentaUid,
      params.contextoTipo,
      params.contextoId,
      params.visitanteUid,
      SCHEMA_VERSION
    ]
      .map(function (part) {
        return encodeURIComponent(String(part || ''));
      })
      .join('__')
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    return ('conv_' + slug).slice(0, 120);
  }

  /**
   * ID determinístico por trío publicación + visitante (anunciante cuentaUid).
   */
  function buildConversationId(params) {
    params = params || {};
    var cuentaUid = String(params.cuentaUid || '');
    var visitanteUid = String(params.visitanteUid || '');
    var contextoTipo = params.contextoTipo === 'banner' ? 'banner' : 'perfil';
    var contextoId = String(params.contextoId || '');
    if (!cuentaUid || !visitanteUid || !contextoId) {
      return fallbackConversationId({
        cuentaUid: cuentaUid,
        visitanteUid: visitanteUid,
        contextoTipo: contextoTipo,
        contextoId: contextoId
      });
    }
    var pair = sortUidPair(cuentaUid, visitanteUid);
    var material = pair[0] + '|' + pair[1] + '|' + contextoTipo + '|' + contextoId + '|' + SCHEMA_VERSION;
    if (global.crypto && global.crypto.subtle && typeof TextEncoder !== 'undefined') {
      return global.crypto.subtle
        .digest('SHA-256', new TextEncoder().encode(material))
        .then(function (buf) {
          return bytesToBase64Url(new Uint8Array(buf)).slice(0, 40);
        })
        .catch(function () {
          return fallbackConversationId({
            cuentaUid: cuentaUid,
            visitanteUid: visitanteUid,
            contextoTipo: contextoTipo,
            contextoId: contextoId
          });
        });
    }
    return Promise.resolve(
      fallbackConversationId({
        cuentaUid: cuentaUid,
        visitanteUid: visitanteUid,
        contextoTipo: contextoTipo,
        contextoId: contextoId
      })
    );
  }

  function buildConversationIdSync(params) {
    params = params || {};
    return fallbackConversationId({
      cuentaUid: params.cuentaUid,
      visitanteUid: params.visitanteUid,
      contextoTipo: params.contextoTipo === 'banner' ? 'banner' : 'perfil',
      contextoId: params.contextoId
    });
  }

  function normalizeParticipante(raw) {
    raw = raw || {};
    return {
      uid: String(raw.uid || ''),
      rol: raw.rol === 'anunciante' ? 'anunciante' : 'visitante',
      alias: String(raw.alias || raw.nombre || 'Contacto'),
      avatarUrl: String(raw.avatarUrl || raw.avatar || '')
    };
  }

  function normalizeConversacion(doc) {
    var data = doc && doc.data ? doc.data() : doc || {};
    var id = (doc && doc.id) || data.conversacionId || data.id || '';
    var ultimo = data.ultimoMensaje;
    if (ultimo && typeof ultimo === 'object') {
      ultimo = ultimo.preview || ultimo.texto || '';
    }
    return {
      id: id,
      conversacionId: id,
      cuentaUid: String(data.cuentaUid || ''),
      contextoTipo: data.contextoTipo === 'banner' ? 'banner' : 'perfil',
      contextoId: String(data.contextoId || ''),
      visitanteUid: String(data.visitanteUid || ''),
      participantes: Array.isArray(data.participantes)
        ? data.participantes.map(normalizeParticipante)
        : [],
      ultimoMensaje: String(ultimo || ''),
      unreadByUid: data.unreadByUid && typeof data.unreadByUid === 'object' ? data.unreadByUid : {},
      estadoConversacion: String(data.estadoConversacion || 'activa'),
      creadoEn: data.creadoEn || null,
      updatedAt: data.updatedAt || null
    };
  }

  function normalizeMensaje(doc, conversacionId) {
    var data = doc && doc.data ? doc.data() : doc || {};
    var id = (doc && doc.id) || data.mensajeId || data.id || '';
    return {
      id: id,
      mensajeId: id,
      conversacionId: String(data.conversacionId || conversacionId || ''),
      emisorUid: String(data.emisorUid || ''),
      texto: String(data.texto || ''),
      tipo: String(data.tipo || 'texto'),
      estadoEntrega: String(data.estadoEntrega || 'enviado'),
      createdAt: data.createdAt || null,
      leidoEn: data.leidoEn || null
    };
  }

  function validateContexto(contextoTipo, contextoId) {
    if (CONTEXTOS.indexOf(contextoTipo) === -1) return false;
    contextoId = String(contextoId || '');
    return contextoId.length > 0 && contextoId.length <= 120;
  }

  function buildConversacionPayload(input) {
    input = input || {};
    var cuentaUid = String(input.cuentaUid || '');
    var visitanteUid = String(input.visitanteUid || '');
    var contextoTipo = input.contextoTipo === 'banner' ? 'banner' : 'perfil';
    var contextoId = String(input.contextoId || '');
    if (!cuentaUid || !visitanteUid || !validateContexto(contextoTipo, contextoId)) {
      throw new Error('[Messenger schema] conversacion inválida');
    }
    var participantes = Array.isArray(input.participantes) ? input.participantes.map(normalizeParticipante) : [];
    if (!participantes.length) {
      participantes.push(
        normalizeParticipante({
          uid: cuentaUid,
          rol: 'anunciante',
          alias: input.anuncianteAlias || 'Anunciante'
        }),
        normalizeParticipante({
          uid: visitanteUid,
          rol: 'visitante',
          alias: input.visitanteAlias || 'Contacto',
          avatarUrl: input.visitanteAvatar || ''
        })
      );
    }
    var unreadByUid = input.unreadByUid && typeof input.unreadByUid === 'object' ? input.unreadByUid : {};
    if (!Object.prototype.hasOwnProperty.call(unreadByUid, cuentaUid)) unreadByUid[cuentaUid] = 0;
    if (!Object.prototype.hasOwnProperty.call(unreadByUid, visitanteUid)) unreadByUid[visitanteUid] = 0;
    return {
      cuentaUid: cuentaUid,
      contextoTipo: contextoTipo,
      contextoId: contextoId,
      visitanteUid: visitanteUid,
      participantes: participantes,
      ultimoMensaje: String(input.ultimoMensaje || ''),
      unreadByUid: unreadByUid,
      estadoConversacion: String(input.estadoConversacion || 'activa'),
      schemaVersion: SCHEMA_VERSION,
      creadoEn: input.creadoEn || dbFieldValue(),
      updatedAt: input.updatedAt || dbFieldValue()
    };
  }

  function buildMensajePayload(input) {
    input = input || {};
    var texto = String(input.texto || '').trim();
    if (!texto || texto.length > MAX_TEXTO) {
      throw new Error('[Messenger schema] mensaje inválido');
    }
    var emisorUid = String(input.emisorUid || '');
    if (!emisorUid) throw new Error('[Messenger schema] emisorUid requerido');
    return {
      conversacionId: String(input.conversacionId || ''),
      emisorUid: emisorUid,
      texto: texto,
      tipo: String(input.tipo || 'texto'),
      estadoEntrega: 'enviado',
      schemaVersion: SCHEMA_VERSION,
      createdAt: input.createdAt || dbFieldValue()
    };
  }

  global.CariHubMessengerSchema = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    CONTEXTOS: CONTEXTOS,
    MAX_TEXTO: MAX_TEXTO,
    buildConversationId: buildConversationId,
    buildConversationIdSync: buildConversationIdSync,
    normalizeConversacion: normalizeConversacion,
    normalizeMensaje: normalizeMensaje,
    normalizeParticipante: normalizeParticipante,
    validateContexto: validateContexto,
    buildConversacionPayload: buildConversacionPayload,
    buildMensajePayload: buildMensajePayload,
    trimPreview: trimPreview
  };
})(typeof window !== 'undefined' ? window : globalThis);
