/**
 * Messenger visitante — crear conversación scoped desde perfil público / home (TICKET-041).
 */
(function (global) {
  'use strict';

  var COL_CONV = 'conversaciones';

  var DEMO_CONTEXT_MAP = {
    'demo-violeta': { cuentaUid: 'preview', contextoId: 'perfil-valentina' },
    'demo-valentina': { cuentaUid: 'preview', contextoId: 'perfil-valentina' },
    'demo-mariana': { cuentaUid: 'preview', contextoId: 'perfil-luna' },
    'demo-sofia': { cuentaUid: 'preview', contextoId: 'perfil-luna' },
    'demo-camila': { cuentaUid: 'preview', contextoId: 'perfil-spa' },
    'mock-valentina': { cuentaUid: 'preview', contextoId: 'perfil-valentina' },
    'mock-luna': { cuentaUid: 'preview', contextoId: 'perfil-luna' },
    'mock-spa': { cuentaUid: 'preview', contextoId: 'perfil-spa' },
    'mock-andrea': { cuentaUid: 'preview', contextoId: 'perfil-valentina' },
    'perfil-valentina': { cuentaUid: 'preview', contextoId: 'perfil-valentina' },
    'perfil-luna': { cuentaUid: 'preview', contextoId: 'perfil-luna' },
    'perfil-spa': { cuentaUid: 'preview', contextoId: 'perfil-spa' }
  };

  function schema() {
    return global.CariHubMessengerSchema;
  }

  function db() {
    if (global.CariHubDB) return global.CariHubDB;
    if (global.firebase && typeof global.firebase.firestore === 'function') return global.firebase.firestore();
    return null;
  }

  function auth() {
    if (global.auth && global.auth.currentUser) return global.auth;
    if (global.CariHubAuth) return global.CariHubAuth;
    if (global.firebase && typeof global.firebase.auth === 'function') return global.firebase.auth();
    return null;
  }

  function authUser() {
    var a = auth();
    return a && a.currentUser ? a.currentUser : null;
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
    if (!s) throw new Error('[HomeMessenger] Falta carihub-messenger-schema.js');
    return s;
  }

  function requireVisitante() {
    var user = authUser();
    if (!user || user.isAnonymous) throw new Error('Inicia sesión para enviar mensajes.');
    return user;
  }

  function demoNombre(perfilRef) {
    if (global.CariHubResultadosDemo && CariHubResultadosDemo.perfilPorId) {
      var demo = CariHubResultadosDemo.perfilPorId(perfilRef, {});
      if (demo && demo.nombre) return demo.nombre;
    }
    return perfilRef.replace(/^demo-|^mock-|^perfil-/i, '').replace(/-/g, ' ');
  }

  function mapDemoContext(perfilRef) {
    var key = String(perfilRef || '').trim();
    var mapped = DEMO_CONTEXT_MAP[key];
    if (mapped) {
      return {
        cuentaUid: mapped.cuentaUid,
        contextoTipo: 'perfil',
        contextoId: mapped.contextoId,
        nombre: demoNombre(key),
        demo: true
      };
    }
    if (/^perfil-/i.test(key)) {
      return {
        cuentaUid: 'preview',
        contextoTipo: 'perfil',
        contextoId: key,
        nombre: demoNombre(key),
        demo: true
      };
    }
    return null;
  }

  function mensajeInternoActivo(data) {
    if (!data) return true;
    var c = data.contactoPublico || data.contactosPublicos || {};
    if (c.mensajeInternoActivo === false) return false;
    return c.mensajeInternoActivo === true || data.mensajeInternoActivo === true;
  }

  function resolverDesdeUsuarioDoc(perfilRef, data) {
    data = data || {};
    var cuentaUid = String(data.uid || perfilRef);
    var perfilId = String(data.perfilId || perfilRef);
    var detalle = data.perfilesDetalle;

    if (detalle && typeof detalle === 'object' && Object.keys(detalle).length) {
      if (detalle[perfilRef]) {
        perfilId = perfilRef;
      } else if (data.perfilActivoId && detalle[data.perfilActivoId]) {
        perfilId = data.perfilActivoId;
      } else {
        perfilId = Object.keys(detalle)[0] || perfilId;
      }
      cuentaUid = String(data.uid || perfilRef);
    }

    var nombre = String(data.nombre || '').trim();
    if (detalle && detalle[perfilId]) {
      var p = detalle[perfilId];
      nombre = String(p.nombre || p.nombrePublico || nombre).trim() || nombre;
    }

    return {
      cuentaUid: cuentaUid,
      contextoTipo: 'perfil',
      contextoId: perfilId,
      nombre: nombre || perfilId,
      anuncianteAlias: nombre || perfilId,
      mensajeInternoActivo: mensajeInternoActivo(data)
    };
  }

  function resolverContextoDestino(perfilRef, opts) {
    opts = opts || {};
    perfilRef = String(perfilRef || '').trim();
    if (!perfilRef) return Promise.resolve(null);

    var demoCtx = mapDemoContext(perfilRef);
    if (demoCtx) {
      demoCtx.mensajeInternoActivo = true;
      return Promise.resolve(demoCtx);
    }

    if (opts.perfilId) {
      var overrideId = String(opts.perfilId).trim();
      if (overrideId) {
        return resolverContextoDestino(overrideId, {}).then(function (ctx) {
          if (!ctx) return null;
          if (opts.cuentaUid) ctx.cuentaUid = String(opts.cuentaUid);
          return ctx;
        });
      }
    }

    var firestore = db();
    if (!firestore || /^demo-/i.test(perfilRef)) {
      return Promise.resolve({
        cuentaUid: perfilRef,
        contextoTipo: 'perfil',
        contextoId: perfilRef,
        nombre: demoNombre(perfilRef),
        mensajeInternoActivo: true,
        demo: /^demo-/i.test(perfilRef)
      });
    }

    return firestore.collection('usuarios').doc(perfilRef).get()
      .then(function (doc) {
        if (doc.exists) {
          return resolverDesdeUsuarioDoc(perfilRef, doc.data());
        }
        return mapDemoContext(perfilRef) || {
          cuentaUid: perfilRef,
          contextoTipo: 'perfil',
          contextoId: perfilRef,
          nombre: perfilRef,
          mensajeInternoActivo: true
        };
      })
      .catch(function () {
        return mapDemoContext(perfilRef) || {
          cuentaUid: perfilRef,
          contextoTipo: 'perfil',
          contextoId: perfilRef,
          nombre: perfilRef,
          mensajeInternoActivo: true
        };
      });
  }

  function isPreviewContexto(ctx) {
    return !!(ctx && (ctx.demo || ctx.cuentaUid === 'preview'));
  }

  function createConversacionVisitante(ctx, user) {
    var s = requireSchema();
    var firestore = db();
    if (!firestore) return Promise.reject(new Error('Firestore no disponible'));

    var input = {
      cuentaUid: ctx.cuentaUid,
      visitanteUid: user.uid,
      contextoTipo: ctx.contextoTipo || 'perfil',
      contextoId: ctx.contextoId,
      anuncianteAlias: ctx.anuncianteAlias || ctx.nombre || 'Anunciante',
      visitanteAlias: user.displayName || 'Contacto',
      visitanteAvatar: user.photoURL || ''
    };

    return s.buildConversationId(input).then(function (convId) {
      var payload = s.buildConversacionPayload(input);
      return firestore.collection(COL_CONV).doc(convId).set(payload, { merge: true }).then(function () {
        return firestore.collection(COL_CONV).doc(convId).get().then(function (snap) {
          return s.normalizeConversacion(snap);
        });
      });
    });
  }

  function bloqueos() {
    return global.CariHubMessengerBloqueos;
  }

  function assertNoBloqueo(conv) {
    var B = bloqueos();
    if (!B || !B.asegurarNoBloqueadoEntre || !conv) return Promise.resolve();
    return B.asegurarNoBloqueadoEntre(conv.cuentaUid, conv.visitanteUid);
  }

  function enforcement() {
    return global.CariHubMessengerPrivacidadEnforcement;
  }

  function sendMensajeVisitante(conversacionId, texto, conv) {
    var s = requireSchema();
    var firestore = db();
    var user = requireVisitante();
    if (!firestore) return Promise.reject(new Error('Firestore no disponible'));
    texto = String(texto || '').trim();
    var Enf = enforcement();
    if (Enf && Enf.assertTextoSinDatosPrivados) {
      Enf.assertTextoSinDatosPrivados(texto);
    }

    var convRef = firestore.collection(COL_CONV).doc(String(conversacionId));
    return convRef.get().then(function (convSnap) {
      if (!convSnap.exists) throw new Error('Conversación no encontrada');
      var data = conv || s.normalizeConversacion(convSnap);
      if (user.uid !== data.cuentaUid && user.uid !== data.visitanteUid) {
        throw new Error('Sin permiso en esta conversación');
      }
      var policyChain = Promise.resolve();
      if (Enf && Enf.assertMensajePermitido && user.uid !== data.cuentaUid) {
        policyChain = Enf.assertMensajePermitido({
          emisorUid: user.uid,
          receptorUid: data.cuentaUid,
          contextoTipo: data.contextoTipo,
          contextoId: data.contextoId,
          cuentaUid: data.cuentaUid
        });
      }
      return policyChain.then(function () {
        return assertNoBloqueo(data);
      }).then(function () {
        var receptorUid = user.uid === data.cuentaUid ? data.visitanteUid : data.cuentaUid;
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

  function privacidadSchema() {
    return global.CariHubMessengerPrivacidadSchema;
  }

  function loadPrivacidadVisitante(uid) {
    if (global.DashboardMessenger && DashboardMessenger.loadPrivacidadMensajes) {
      return DashboardMessenger.loadPrivacidadMensajes(uid);
    }
    var Ps = privacidadSchema();
    return Promise.resolve(Ps ? Ps.mergeWithDefaults({}) : null);
  }

  /**
   * Marca leída como visitante. «Visto» solo si confirmacionVisto del visitante es visible (MSG-073).
   */
  function markReadVisitante(conversacionId) {
    var s = requireSchema();
    var firestore = db();
    var user = requireVisitante();
    if (!firestore || !conversacionId) return Promise.resolve();
    var visitanteUid = user.uid;
    var convRef = firestore.collection(COL_CONV).doc(String(conversacionId));
    return convRef.get().then(function (convSnap) {
      if (!convSnap.exists) return;
      return loadPrivacidadVisitante(visitanteUid).then(function (priv) {
        var Ps = privacidadSchema();
        var emitVisto = Ps && Ps.muestraConfirmacionVisto(priv);
        return convRef
          .collection('mensajes')
          .orderBy('createdAt', 'asc')
          .limit(200)
          .get()
          .then(function (snap) {
            var batch = firestore.batch();
            snap.docs.forEach(function (doc) {
              var m = s.normalizeMensaje(doc, conversacionId);
              if (
                emitVisto &&
                m.emisorUid !== visitanteUid &&
                m.estadoEntrega !== 'visto' &&
                (m.estadoEntrega === 'enviado' || m.estadoEntrega === 'entregado')
              ) {
                batch.update(doc.ref, { estadoEntrega: 'visto', leidoEn: ts() });
              }
            });
            batch.update(convRef, { ['unreadByUid.' + visitanteUid]: 0 });
            return batch.commit();
          });
      });
    }).catch(function (err) {
      console.warn('[HomeMessenger] markReadVisitante:', err);
    });
  }

  function enviarDesdePerfil(perfilRef, texto, opts) {
    opts = opts || {};
    texto = String(texto || '').trim();
    if (!texto) return Promise.reject(new Error('Escribe un mensaje antes de enviar.'));

    var user = requireVisitante();

    return resolverContextoDestino(perfilRef, opts).then(function (ctx) {
      if (!ctx || !ctx.contextoId) {
        throw new Error('No se identificó el perfil destino.');
      }
      if (ctx.mensajeInternoActivo === false) {
        throw new Error('Este perfil no acepta mensajes internos por ahora.');
      }
      if (user.uid === ctx.cuentaUid) {
        throw new Error('No puedes enviarte mensajes a tu propio perfil publicado.');
      }

      var Enf = enforcement();
      if (Enf && Enf.assertTextoSinDatosPrivados) {
        Enf.assertTextoSinDatosPrivados(texto);
      }

      var policyChain = Promise.resolve();
      if (Enf && Enf.assertMensajePermitido && !isPreviewContexto(ctx)) {
        policyChain = Enf.assertMensajePermitido({
          emisorUid: user.uid,
          receptorUid: ctx.cuentaUid,
          contextoTipo: ctx.contextoTipo || 'perfil',
          contextoId: ctx.contextoId,
          cuentaUid: ctx.cuentaUid
        });
      }

      return policyChain.then(function () {
        if (isPreviewContexto(ctx)) {
          return {
            preview: true,
            conversacionId: 'preview-conv-' + ctx.contextoId,
            contextoTipo: ctx.contextoTipo,
            contextoId: ctx.contextoId,
            cuentaUid: ctx.cuentaUid,
            nombre: ctx.nombre
          };
        }
        return assertNoBloqueo({
          cuentaUid: ctx.cuentaUid,
          visitanteUid: user.uid
        }).then(function () {
          return createConversacionVisitante(ctx, user).then(function (conv) {
            return sendMensajeVisitante(conv.id, texto, conv).then(function (sent) {
              return Object.assign({}, sent, {
                contextoTipo: ctx.contextoTipo,
                contextoId: ctx.contextoId,
                cuentaUid: ctx.cuentaUid,
                nombre: ctx.nombre
              });
            });
          });
        });
      });
    });
  }

  function formatMensajeTime(val) {
    if (!val) return '';
    var d = val;
    if (val && typeof val.toDate === 'function') d = val.toDate();
    else if (!(d instanceof Date)) d = new Date(d);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
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

  function toUiConversacionVisitante(conv) {
    var anunciante = (conv.participantes || []).find(function (p) {
      return p.uid === conv.cuentaUid || p.rol === 'anunciante';
    });
    var visitanteUid = conv.visitanteUid || '';
    var unread =
      conv.unreadByUid && visitanteUid ? Number(conv.unreadByUid[visitanteUid] || 0) : 0;
    return {
      id: conv.id,
      conversacionId: conv.id,
      nombre: (anunciante && anunciante.alias) || conv.contextoId || 'Anunciante',
      ultimo: conv.ultimoMensaje || '',
      hora: formatRelative(conv.updatedAt),
      unread: unread > 0 ? unread : 0,
      contextoTipo: conv.contextoTipo,
      contextoId: conv.contextoId,
      cuentaUid: conv.cuentaUid || '',
      visitanteUid: visitanteUid
    };
  }

  function listConversacionesVisitante(opts) {
    var s = requireSchema();
    var firestore = db();
    var user = requireVisitante();
    if (!firestore) return Promise.resolve([]);
    opts = opts || {};
    var limit = Number(opts.limit || 50);
    return firestore
      .collection(COL_CONV)
      .where('visitanteUid', '==', user.uid)
      .orderBy('updatedAt', 'desc')
      .limit(limit)
      .get()
      .then(function (snap) {
        return snap.docs.map(function (doc) {
          return s.normalizeConversacion(doc);
        });
      })
      .catch(function (err) {
        console.warn('[HomeMessenger] listConversacionesVisitante:', err);
        return [];
      });
  }

  function listConversacionesVisitanteUi(opts) {
    return listConversacionesVisitante(opts).then(function (rows) {
      return rows.map(toUiConversacionVisitante);
    });
  }

  function listMensajesVisitante(conversacionId, opts) {
    var s = requireSchema();
    var firestore = db();
    if (!firestore || !conversacionId) return Promise.resolve([]);
    requireVisitante();
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
        console.warn('[HomeMessenger] listMensajesVisitante:', err);
        return [];
      });
  }

  function mensajeToUiBubbleVisitante(msg, visitanteUid) {
    var from = msg.emisorUid === visitanteUid ? 'me' : 'them';
    var Enf = enforcement();
    var text =
      Enf && Enf.sanitizarTextoParaUi ? Enf.sanitizarTextoParaUi(msg.texto) : msg.texto;
    return {
      from: from,
      text: text,
      time: formatMensajeTime(msg.createdAt)
    };
  }

  function listMensajesVisitanteUi(conversacionId, opts) {
    var user = requireVisitante();
    return listMensajesVisitante(conversacionId, opts).then(function (rows) {
      return rows.map(function (m) {
        return mensajeToUiBubbleVisitante(m, user.uid);
      });
    });
  }

  function subscribeMensajesVisitante(conversacionId, onChange) {
    var s = requireSchema();
    var firestore = db();
    if (!firestore || !conversacionId || typeof onChange !== 'function') return function () {};
    var user = requireVisitante();
    return firestore
      .collection(COL_CONV)
      .doc(String(conversacionId))
      .collection('mensajes')
      .orderBy('createdAt', 'asc')
      .limit(200)
      .onSnapshot(
        function (snap) {
          var rows = snap.docs.map(function (doc) {
            return mensajeToUiBubbleVisitante(s.normalizeMensaje(doc, conversacionId), user.uid);
          });
          onChange(rows);
        },
        function (err) {
          console.warn('[HomeMessenger] subscribeMensajesVisitante:', err);
          onChange([]);
        }
      );
  }

  global.CariHubHomeMessenger = {
    resolverContextoDestino: resolverContextoDestino,
    enviarDesdePerfil: enviarDesdePerfil,
    sendMensajeVisitante: sendMensajeVisitante,
    markReadVisitante: markReadVisitante,
    listConversacionesVisitante: listConversacionesVisitante,
    listConversacionesVisitanteUi: listConversacionesVisitanteUi,
    listMensajesVisitante: listMensajesVisitante,
    listMensajesVisitanteUi: listMensajesVisitanteUi,
    subscribeMensajesVisitante: subscribeMensajesVisitante,
    mensajeToUiBubbleVisitante: mensajeToUiBubbleVisitante,
    DEMO_CONTEXT_MAP: DEMO_CONTEXT_MAP
  };
})(typeof window !== 'undefined' ? window : globalThis);
