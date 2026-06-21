/**
 * API bloqueos Messenger (MSG-081).
 */
(function (global) {
  'use strict';

  var COL_CONV = 'conversaciones';
  var cache = {};

  function schema() {
    return global.CariHubMessengerBloqueosSchema;
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
    if (!user || user.isAnonymous) throw new Error('Inicia sesión para gestionar bloqueos.');
    return user;
  }

  function cacheKey(a, b) {
    return String(a || '') + ':' + String(b || '');
  }

  function loadConversacion(conversacionId) {
    var Ms = messengerSchema();
    var firestore = db();
    if (!Ms || !firestore) return Promise.reject(new Error('Conversación no disponible.'));
    return firestore
      .collection(COL_CONV)
      .doc(String(conversacionId))
      .get()
      .then(function (snap) {
        if (!snap.exists) throw new Error('Conversación no encontrada.');
        return Ms.normalizeConversacion(snap);
      });
  }

  function resolveContraparte(conv, cuentaUid) {
    cuentaUid = String(cuentaUid || '');
    if (cuentaUid === conv.cuentaUid) return conv.visitanteUid;
    if (cuentaUid === conv.visitanteUid) return conv.cuentaUid;
    throw new Error('No participas en esta conversación.');
  }

  function bloquear(input) {
    var Bs = schema();
    var firestore = db();
    if (!Bs || !firestore) return Promise.reject(new Error('Bloqueos no disponibles.'));
    var user = requireUser();
    input = input || {};
    var bloqueadoUid = String(input.bloqueadoUid || '');
    var chain = Promise.resolve(input);

    if (!bloqueadoUid && input.conversacionId) {
      chain = loadConversacion(input.conversacionId).then(function (conv) {
        if (user.uid !== conv.cuentaUid && user.uid !== conv.visitanteUid) {
          throw new Error('Sin permiso en esta conversación.');
        }
        return {
          bloqueadoUid: resolveContraparte(conv, user.uid),
          contextoTipo: conv.contextoTipo,
          contextoId: conv.contextoId,
          conversacionId: conv.id,
          motivo: input.motivo
        };
      });
    }

    return chain.then(function (resolved) {
      bloqueadoUid = String(resolved.bloqueadoUid || bloqueadoUid);
      if (!bloqueadoUid || bloqueadoUid === user.uid) {
        throw new Error('No puedes bloquearte a ti mismo.');
      }
      var payload = Bs.buildPayload(
        {
          bloqueadoUid: bloqueadoUid,
          contextoTipo: resolved.contextoTipo || input.contextoTipo,
          contextoId: resolved.contextoId || input.contextoId,
          conversacionId: resolved.conversacionId || input.conversacionId,
          motivo: resolved.motivo || input.motivo,
          iniciadoPor: 'usuario'
        },
        user.uid
      );
      return firestore
        .collection('usuarios')
        .doc(user.uid)
        .collection('bloqueos')
        .doc(bloqueadoUid)
        .set(payload)
        .then(function () {
          cache[cacheKey(user.uid, bloqueadoUid)] = true;
          cache[cacheKey(bloqueadoUid, user.uid)] = false;
          return Bs.normalize(payload, user.uid, bloqueadoUid);
        });
    });
  }

  function desbloquear(bloqueadoUid) {
    var firestore = db();
    var user = requireUser();
    bloqueadoUid = String(bloqueadoUid || '');
    if (!bloqueadoUid) return Promise.reject(new Error('Usuario no válido.'));
    if (!firestore) return Promise.reject(new Error('Firestore no disponible.'));
    return firestore
      .collection('usuarios')
      .doc(user.uid)
      .collection('bloqueos')
      .doc(bloqueadoUid)
      .delete()
      .then(function () {
        delete cache[cacheKey(user.uid, bloqueadoUid)];
        return true;
      });
  }

  function yoBloqueo(uid1, uid2) {
    uid1 = String(uid1 || '');
    uid2 = String(uid2 || '');
    if (!uid1 || !uid2 || uid1 === uid2) return Promise.resolve(false);
    var key = cacheKey(uid1, uid2);
    if (cache[key] === true) return Promise.resolve(true);
    if (cache[key] === false) return Promise.resolve(false);
    var firestore = db();
    if (!firestore) return Promise.resolve(false);
    return firestore
      .collection('usuarios')
      .doc(uid1)
      .collection('bloqueos')
      .doc(uid2)
      .get()
      .then(function (snap) {
        var on = snap.exists;
        cache[key] = on;
        return on;
      })
      .catch(function () {
        return false;
      });
  }

  function bloqueoEntre(uid1, uid2) {
    return yoBloqueo(uid1, uid2).then(function (a) {
      if (a) return true;
      return yoBloqueo(uid2, uid1);
    });
  }

  function asegurarNoBloqueadoEntre(uid1, uid2) {
    return bloqueoEntre(uid1, uid2).then(function (on) {
      if (on) throw new Error('No puedes enviar mensajes: hay un bloqueo activo entre las cuentas.');
      return false;
    });
  }

  function clearCache() {
    cache = {};
  }

  global.CariHubMessengerBloqueos = {
    bloquear: bloquear,
    desbloquear: desbloquear,
    yoBloqueo: yoBloqueo,
    bloqueoEntre: bloqueoEntre,
    asegurarNoBloqueadoEntre: asegurarNoBloqueadoEntre,
    clearCache: clearCache
  };
})(typeof window !== 'undefined' ? window : globalThis);
