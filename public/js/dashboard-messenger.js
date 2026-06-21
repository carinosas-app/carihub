/**
 * API dashboard Messenger v1 — consultas scoped por publicación (TICKET-030).
 * Depende de carihub-messenger-schema.js + carihub-core.js
 */
(function (global) {
  'use strict';

  var COL_CONV = 'conversaciones';
  var privacidadCache = {};

  function privacidadSchema() {
    return global.CariHubMessengerPrivacidadSchema;
  }

  function clearPrivacidadCache(uid) {
    if (uid) delete privacidadCache[String(uid)];
    else privacidadCache = {};
  }

  function getPrivacidadCached(uid) {
    return privacidadCache[String(uid || '')] || null;
  }

  function loadPrivacidadMensajes(uid) {
    uid = String(uid || '');
    if (!uid) {
      var Ps = privacidadSchema();
      return Promise.resolve(Ps ? Ps.mergeWithDefaults({}) : null);
    }
    if (privacidadCache[uid]) return Promise.resolve(privacidadCache[uid]);
    var Ps = privacidadSchema();
    if (!Ps) return Promise.resolve(null);
    var firestore = db();
    if (!firestore) {
      var fallback = Ps.mergeWithDefaults({});
      privacidadCache[uid] = fallback;
      return Promise.resolve(fallback);
    }
    return firestore
      .collection('usuarios')
      .doc(uid)
      .collection('privacidad_mensajes')
      .doc(Ps.DOC_ID)
      .get()
      .then(function (snap) {
        var cfg = Ps.normalize(snap, uid);
        privacidadCache[uid] = cfg;
        return cfg;
      })
      .catch(function (err) {
        console.warn('[DashboardMessenger] loadPrivacidadMensajes:', err);
        var def = Ps.mergeWithDefaults({ cuentaUid: uid });
        privacidadCache[uid] = def;
        return def;
      });
  }

  function schema() {
    return global.CariHubMessengerSchema;
  }

  function db() {
    if (global.CariHubDB) return global.CariHubDB;
    if (global.firebase && typeof global.firebase.firestore === 'function') return global.firebase.firestore();
    return null;
  }

  function auth() {
    if (global.CariHubAuth) return global.CariHubAuth;
    if (global.firebase && typeof global.firebase.auth === 'function') return global.firebase.auth();
    return null;
  }

  function ts() {
    return global.firebase && global.firebase.firestore && global.firebase.firestore.FieldValue
      ? global.firebase.firestore.FieldValue.serverTimestamp()
      : new Date();
  }

  function inc(n) {
    return global.firebase && global.firebase.firestore && global.firebase.firestore.FieldValue
      ? global.firebase.firestore.FieldValue.increment(n)
      : n;
  }

  function requireSchema() {
    var s = schema();
    if (!s) throw new Error('[DashboardMessenger] Falta carihub-messenger-schema.js');
    return s;
  }

  function requireUser() {
    var user = auth() && auth().currentUser;
    if (!user) throw new Error('[DashboardMessenger] Sesión requerida');
    return user;
  }

  function normalizeFilter(filter) {
    filter = filter || {};
    var contextoTipo = filter.contextoTipo === 'banner' ? 'banner' : 'perfil';
    var contextoId = String(filter.contextoId || filter.id || '');
    return {
      cuentaUid: String(filter.cuentaUid || ''),
      contextoTipo: contextoTipo,
      contextoId: contextoId
    };
  }

  function isBannerContextBlocked(filter) {
    filter = normalizeFilter(filter);
    if (filter.contextoTipo !== 'banner' || !filter.contextoId) return false;
    if (!global.DashBannerMensajes || !global.DashBannerMensajes.isContextoBloqueado) return false;
    return global.DashBannerMensajes.isContextoBloqueado(filter);
  }

  function toUiConversacion(conv) {
    var visitante = (conv.participantes || []).find(function (p) {
      return p.uid === conv.visitanteUid || p.rol === 'visitante';
    });
    var unread = conv.unreadByUid && conv.cuentaUid ? Number(conv.unreadByUid[conv.cuentaUid] || 0) : 0;
    return {
      id: conv.id,
      conversacionId: conv.id,
      contextoTipo: conv.contextoTipo,
      contextoId: conv.contextoId,
      nombre: (visitante && visitante.alias) || 'Contacto',
      avatar: (visitante && visitante.avatarUrl) || '',
      ultimo: conv.ultimoMensaje || '',
      hora: formatRelative(conv.updatedAt),
      unread: unread > 0 ? unread : 0,
      visitanteUid: conv.visitanteUid || '',
      cuentaUid: conv.cuentaUid || ''
    };
  }

  function formatMensajeTime(val) {
    if (!val) return '';
    var d = val;
    if (val && typeof val.toDate === 'function') d = val.toDate();
    else if (!(d instanceof Date)) d = new Date(d);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  }

  function getCuentaUid() {
    var user = auth() && auth().currentUser;
    return user ? user.uid : '';
  }

  /**
   * Crea o reutiliza conversación scoped (cuentaUid + contexto + visitante).
   */
  function createConversacion(input) {
    var s = requireSchema();
    var firestore = db();
    if (!firestore) return Promise.reject(new Error('Firestore no disponible'));
    requireUser();
    input = input || {};
    return s.buildConversationId(input).then(function (convId) {
      var payload = s.buildConversacionPayload(input);
      return firestore
        .collection(COL_CONV)
        .doc(convId)
        .set(payload, { merge: true })
        .then(function () {
          return firestore.collection(COL_CONV).doc(convId).get();
        })
        .then(function (snap) {
          return s.normalizeConversacion(snap);
        });
    });
  }

  function subscribeMensajes(conversacionId, onChange) {
    var s = requireSchema();
    var firestore = db();
    if (!firestore || !conversacionId || typeof onChange !== 'function') return function () {};
    requireUser();
    return firestore
      .collection(COL_CONV)
      .doc(String(conversacionId))
      .collection('mensajes')
      .orderBy('createdAt', 'asc')
      .limit(200)
      .onSnapshot(
        function (snap) {
          var rows = snap.docs.map(function (doc) {
            return s.normalizeMensaje(doc, conversacionId);
          });
          onChange(rows);
        },
        function (err) {
          console.warn('[DashboardMessenger] subscribeMensajes:', err);
          onChange([]);
        }
      );
  }

  function enforcement() {
    return global.CariHubMessengerPrivacidadEnforcement;
  }

  function bloqueos() {
    return global.CariHubMessengerBloqueos;
  }

  function assertNoBloqueo(conv) {
    var B = bloqueos();
    if (!B || !B.asegurarNoBloqueadoEntre || !conv) return Promise.resolve();
    return B.asegurarNoBloqueadoEntre(conv.cuentaUid, conv.visitanteUid);
  }

  function textoUiMensaje(texto) {
    var Enf = enforcement();
    if (Enf && Enf.sanitizarTextoParaUi) return Enf.sanitizarTextoParaUi(texto);
    return texto;
  }

  function mensajeToUiBubble(msg, cuentaUid, opts) {
    opts = opts || {};
    var from = msg.emisorUid === cuentaUid ? 'me' : 'them';
    var status = '';
    if (from === 'me') {
      var otroUid = opts.otroUid || '';
      var priv = opts.privacidadOtro || getPrivacidadCached(otroUid);
      var Ps = privacidadSchema();
      var muestraVisto =
        msg.estadoEntrega === 'visto' &&
        Ps &&
        priv &&
        Ps.muestraConfirmacionVisto(priv);
      if (muestraVisto) status = 'Visto';
    }
    return {
      from: from,
      text: textoUiMensaje(msg.texto),
      time: formatMensajeTime(msg.createdAt),
      status: status
    };
  }

  function listMensajesUi(conversacionId, opts) {
    opts = opts || {};
    var cuentaUid = getCuentaUid();
    var otroUid = opts.otroUid || '';
    return loadPrivacidadMensajes(otroUid).then(function (priv) {
      return listMensajes(conversacionId, opts).then(function (rows) {
        return rows.map(function (m) {
          return mensajeToUiBubble(m, cuentaUid, { otroUid: otroUid, privacidadOtro: priv });
        });
      });
    });
  }

  function formatRelative(val) {
    if (!val) return '';
    var d = val;
    if (val && typeof val.toDate === 'function') d = val.toDate();
    else if (!(d instanceof Date)) d = new Date(d);
    if (isNaN(d.getTime())) return '';
    var diff = Date.now() - d.getTime();
    if (diff < 86400000) {
      return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    }
    if (diff < 604800000) {
      return d.toLocaleDateString('es-MX', { weekday: 'short' });
    }
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  }

  /**
   * Lista conversaciones del anunciante filtradas por contexto de publicación.
   * @param {{ cuentaUid?, contextoTipo, contextoId }} filter
   */
  function listConversaciones(filter) {
    var s = requireSchema();
    var firestore = db();
    if (!firestore) return Promise.resolve([]);
    filter = normalizeFilter(filter);
    if (isBannerContextBlocked(filter)) return Promise.resolve([]);
    var user = requireUser();
    var cuentaUid = filter.cuentaUid || user.uid;
    if (!s.validateContexto(filter.contextoTipo, filter.contextoId)) {
      return Promise.resolve([]);
    }
    return firestore
      .collection(COL_CONV)
      .where('cuentaUid', '==', cuentaUid)
      .where('contextoTipo', '==', filter.contextoTipo)
      .where('contextoId', '==', filter.contextoId)
      .orderBy('updatedAt', 'desc')
      .limit(100)
      .get()
      .then(function (snap) {
        return snap.docs.map(function (doc) {
          return s.normalizeConversacion(doc);
        });
      })
      .catch(function (err) {
        console.warn('[DashboardMessenger] listConversaciones:', err);
        return [];
      });
  }

  function listConversacionesUi(filter) {
    return listConversaciones(filter).then(function (rows) {
      return rows.map(toUiConversacion);
    });
  }

  function listMensajes(conversacionId, opts) {
    var s = requireSchema();
    var firestore = db();
    if (!firestore || !conversacionId) return Promise.resolve([]);
    requireUser();
    opts = opts || {};
    var limit = Number(opts.limit || 100);
    return firestore
      .collection(COL_CONV)
      .doc(String(conversacionId))
      .collection('mensajes')
      .orderBy('createdAt', 'asc')
      .limit(limit)
      .get()
      .then(function (snap) {
        return snap.docs.map(function (doc) {
          return s.normalizeMensaje(doc, conversacionId);
        });
      })
      .catch(function (err) {
        console.warn('[DashboardMessenger] listMensajes:', err);
        return [];
      });
  }

  /**
   * Envía mensaje y actualiza preview/unread en la conversación (batch).
   */
  function sendMensaje(conversacionId, texto) {
    var s = requireSchema();
    var firestore = db();
    if (!firestore) return Promise.reject(new Error('Firestore no disponible'));
    var user = requireUser();
    texto = String(texto || '').trim();
    var Enf = enforcement();
    if (Enf && Enf.assertTextoSinDatosPrivados) {
      Enf.assertTextoSinDatosPrivados(texto);
    }
    var convRef = firestore.collection(COL_CONV).doc(String(conversacionId));
    return convRef.get().then(function (convSnap) {
      if (!convSnap.exists) throw new Error('Conversación no encontrada');
      var conv = s.normalizeConversacion(convSnap);
      if (
        isBannerContextBlocked({
          contextoTipo: conv.contextoTipo,
          contextoId: conv.contextoId
        })
      ) {
        throw new Error('Conversaciones bloqueadas: banner no vigente o impago.');
      }
      if (user.uid !== conv.cuentaUid && user.uid !== conv.visitanteUid) {
        throw new Error('Sin permiso en esta conversación');
      }
      var policyChain = Promise.resolve();
      if (Enf && Enf.assertMensajePermitido && user.uid !== conv.cuentaUid) {
        policyChain = Enf.assertMensajePermitido({
          emisorUid: user.uid,
          receptorUid: conv.cuentaUid,
          contextoTipo: conv.contextoTipo,
          contextoId: conv.contextoId,
          cuentaUid: conv.cuentaUid
        });
      }
      return policyChain.then(function () {
        return assertNoBloqueo(conv);
      }).then(function () {
        var receptorUid = user.uid === conv.cuentaUid ? conv.visitanteUid : conv.cuentaUid;
        var msgRef = convRef.collection('mensajes').doc();
        var msgPayload = s.buildMensajePayload({
          conversacionId: conversacionId,
          emisorUid: user.uid,
          texto: texto
        });
        var unreadPatch = {};
        unreadPatch['unreadByUid.' + receptorUid] = inc(1);
        var batch = firestore.batch();
        batch.set(msgRef, msgPayload);
        batch.update(convRef, Object.assign({}, unreadPatch, {
          ultimoMensaje: s.trimPreview(texto),
          updatedAt: ts()
        }));
        return batch.commit().then(function () {
          return { mensajeId: msgRef.id, conversacionId: conversacionId };
        });
      });
    });
  }

  /**
   * Marca conversación leída. Solo emite «Visto» si confirmacionVisto del lector es visible (MSG-073).
   */
  function markRead(conversacionId, cuentaUid) {
    var firestore = db();
    if (!firestore || !conversacionId) return Promise.resolve();
    var user = requireUser();
    cuentaUid = String(cuentaUid || user.uid);
    if (user.uid !== cuentaUid) return Promise.resolve();
    var convRef = firestore.collection(COL_CONV).doc(String(conversacionId));
    return convRef.get().then(function (convSnap) {
      if (!convSnap.exists) return;
      var conv = requireSchema().normalizeConversacion(convSnap);
      return loadPrivacidadMensajes(cuentaUid).then(function (priv) {
        var Ps = privacidadSchema();
        var emitVisto = Ps && Ps.muestraConfirmacionVisto(priv);
        return listMensajes(conversacionId).then(function (rows) {
          var batch = firestore.batch();
          if (emitVisto) {
            rows.forEach(function (m) {
              if (
                m.emisorUid !== cuentaUid &&
                m.estadoEntrega !== 'visto' &&
                (m.estadoEntrega === 'enviado' || m.estadoEntrega === 'entregado')
              ) {
                var msgRef = convRef.collection('mensajes').doc(m.id);
                batch.update(msgRef, { estadoEntrega: 'visto', leidoEn: ts() });
              }
            });
          }
          batch.update(convRef, { ['unreadByUid.' + cuentaUid]: 0 });
          return batch.commit();
        });
      });
    }).catch(function (err) {
      console.warn('[DashboardMessenger] markRead:', err);
    });
  }

  function aggregateUnreadMaps(snap, cuentaUid) {
    var perfil = {};
    var banner = {};
    var s = requireSchema();
    snap.docs.forEach(function (doc) {
      var conv = s.normalizeConversacion(doc);
      var n = Number((conv.unreadByUid && conv.unreadByUid[cuentaUid]) || 0);
      if (n <= 0) return;
      if (
        conv.contextoTipo === 'banner' &&
        isBannerContextBlocked({
          contextoTipo: conv.contextoTipo,
          contextoId: conv.contextoId
        })
      ) {
        return;
      }
      var map = conv.contextoTipo === 'banner' ? banner : perfil;
      map[conv.contextoId] = (map[conv.contextoId] || 0) + n;
    });
    return { perfil: perfil, banner: banner };
  }

  /**
   * Badges rail: unread por contextoId (perfil|banner).
   * @returns Promise<Record<string, number>>
   */
  function getUnreadCountsByContexto(cuentaUid, contextoTipo) {
    return getAllUnreadCountsByContexto(cuentaUid).then(function (all) {
      return contextoTipo === 'banner' ? all.banner : all.perfil;
    });
  }

  /**
   * Totales unread agrupados { perfil: { id: n }, banner: { id: n } }.
   */
  function getAllUnreadCountsByContexto(cuentaUid) {
    var firestore = db();
    if (!firestore) return Promise.resolve({ perfil: {}, banner: {} });
    var user = requireUser();
    cuentaUid = String(cuentaUid || user.uid);
    return firestore
      .collection(COL_CONV)
      .where('cuentaUid', '==', cuentaUid)
      .limit(500)
      .get()
      .then(function (snap) {
        return aggregateUnreadMaps(snap, cuentaUid);
      })
      .catch(function (err) {
        console.warn('[DashboardMessenger] getAllUnreadCountsByContexto:', err);
        return { perfil: {}, banner: {} };
      });
  }

  /**
   * Tiempo real — actualiza badges del rail al llegar mensajes en cualquier contexto.
   */
  function subscribeUnreadRail(cuentaUid, onChange) {
    var firestore = db();
    if (!firestore || typeof onChange !== 'function') return function () {};
    var user = requireUser();
    cuentaUid = String(cuentaUid || user.uid);
    return firestore
      .collection(COL_CONV)
      .where('cuentaUid', '==', cuentaUid)
      .limit(500)
      .onSnapshot(
        function (snap) {
          onChange(aggregateUnreadMaps(snap, cuentaUid));
        },
        function (err) {
          console.warn('[DashboardMessenger] subscribeUnreadRail:', err);
          onChange({ perfil: {}, banner: {} });
        }
      );
  }

  function subscribeConversaciones(filter, onChange) {
    var s = requireSchema();
    var firestore = db();
    if (!firestore || typeof onChange !== 'function') return function () {};
    var user = requireUser();
    filter = normalizeFilter(filter);
    if (isBannerContextBlocked(filter)) {
      onChange([]);
      return function () {};
    }
    var cuentaUid = filter.cuentaUid || user.uid;
    if (!s.validateContexto(filter.contextoTipo, filter.contextoId)) {
      onChange([]);
      return function () {};
    }
    return firestore
      .collection(COL_CONV)
      .where('cuentaUid', '==', cuentaUid)
      .where('contextoTipo', '==', filter.contextoTipo)
      .where('contextoId', '==', filter.contextoId)
      .orderBy('updatedAt', 'desc')
      .limit(100)
      .onSnapshot(
        function (snap) {
          var rows = snap.docs.map(function (doc) {
            return s.normalizeConversacion(doc);
          });
          onChange(rows);
        },
        function (err) {
          console.warn('[DashboardMessenger] subscribeConversaciones:', err);
          onChange([]);
        }
      );
  }

  global.DashboardMessenger = {
    listConversaciones: listConversaciones,
    listConversacionesUi: listConversacionesUi,
    listMensajes: listMensajes,
    listMensajesUi: listMensajesUi,
    createConversacion: createConversacion,
    sendMensaje: sendMensaje,
    markRead: markRead,
    loadPrivacidadMensajes: loadPrivacidadMensajes,
    getPrivacidadCached: getPrivacidadCached,
    clearPrivacidadCache: clearPrivacidadCache,
    getUnreadCountsByContexto: getUnreadCountsByContexto,
    getAllUnreadCountsByContexto: getAllUnreadCountsByContexto,
    subscribeUnreadRail: subscribeUnreadRail,
    subscribeConversaciones: subscribeConversaciones,
    subscribeMensajes: subscribeMensajes,
    toUiConversacion: toUiConversacion,
    mensajeToUiBubble: mensajeToUiBubble
  };
})(typeof window !== 'undefined' ? window : globalThis);
