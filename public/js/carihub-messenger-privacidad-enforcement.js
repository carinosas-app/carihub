/**
 * Enforcement privacidad messenger (MSG-077).
 * Evalúa mensajesDe, bloquea tel/email en texto y sanitiza burbujas UI.
 */
(function (global) {
  'use strict';

  var RE_EMAIL = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
  var RE_PHONE_CHUNK = /(?:\+?\d[\d\s().\-]{6,}\d)/g;

  function privSchema() {
    return global.CariHubMessengerPrivacidadSchema;
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

  function authUser() {
    var a = auth();
    return a && a.currentUser ? a.currentUser : null;
  }

  function cuentaRealUid() {
    var user = authUser();
    return user && !user.isAnonymous ? user.uid : '';
  }

  function digitCount(text) {
    return String(text || '').replace(/\D/g, '').length;
  }

  function detectarDatosPrivados(texto) {
    texto = String(texto || '');
    var email = RE_EMAIL.test(texto);
    var phone = false;
    var match;
    RE_PHONE_CHUNK.lastIndex = 0;
    while ((match = RE_PHONE_CHUNK.exec(texto)) !== null) {
      if (digitCount(match[0]) >= 8) {
        phone = true;
        break;
      }
    }
    if (!phone && digitCount(texto) >= 10 && /\d/.test(texto)) {
      phone = true;
    }
    return { email: email, phone: phone, bloqueado: email || phone };
  }

  function assertTextoSinDatosPrivados(texto) {
    var d = detectarDatosPrivados(texto);
    if (d.bloqueado) {
      throw new Error('Por seguridad no puedes compartir teléfonos ni correos en el chat interno.');
    }
  }

  function sanitizarTextoParaUi(texto) {
    texto = String(texto || '');
    texto = texto.replace(RE_EMAIL, '[correo oculto]');
    texto = texto.replace(RE_PHONE_CHUNK, function (chunk) {
      return digitCount(chunk) >= 8 ? '[teléfono oculto]' : chunk;
    });
    return texto;
  }

  function esRespuestaAnunciante(emisorUid, opts) {
    opts = opts || {};
    if (opts.omitirPoliticaEntrada) return true;
    if (opts.cuentaUid && emisorUid === String(opts.cuentaUid)) return true;
    return false;
  }

  function loadPoliticaReceptor(receptorUid) {
    receptorUid = String(receptorUid || '');
    if (global.DashboardMessenger && global.DashboardMessenger.loadPrivacidadMensajes) {
      return global.DashboardMessenger.loadPrivacidadMensajes(receptorUid);
    }
    var Ps = privSchema();
    var firestore = db();
    if (!Ps) return Promise.resolve(null);
    if (!firestore || !receptorUid) {
      return Promise.resolve(Ps.mergeWithDefaults({ cuentaUid: receptorUid }));
    }
    return firestore
      .collection('usuarios')
      .doc(receptorUid)
      .collection('privacidad_mensajes')
      .doc(Ps.DOC_ID)
      .get()
      .then(function (snap) {
        return Ps.normalize(snap, receptorUid);
      })
      .catch(function (err) {
        console.warn('[MessengerEnforcement] loadPoliticaReceptor:', err);
        return Ps.mergeWithDefaults({ cuentaUid: receptorUid });
      });
  }

  function esFavoritoDe(emisorUid, contextoId) {
    contextoId = String(contextoId || '');
    emisorUid = String(emisorUid || '');
    if (!emisorUid || !contextoId) return Promise.resolve(false);
    if (global.CariHubFavoritos && global.CariHubFavoritos.esFavorito) {
      return Promise.resolve(global.CariHubFavoritos.esFavorito(contextoId)).catch(function () {
        return false;
      });
    }
    var firestore = db();
    if (!firestore) return Promise.resolve(false);
    return firestore
      .collection('usuarios')
      .doc(emisorUid)
      .collection('favoritos')
      .doc(contextoId)
      .get()
      .then(function (snap) {
        return snap.exists;
      })
      .catch(function () {
        return false;
      });
  }

  function esContactoAceptado(receptorUid, emisorUid, contextoTipo, contextoId) {
    receptorUid = String(receptorUid || '');
    emisorUid = String(emisorUid || '');
    contextoTipo = contextoTipo === 'banner' ? 'banner' : 'perfil';
    contextoId = String(contextoId || '');
    if (!receptorUid || !emisorUid || !contextoId) return Promise.resolve(false);
    var firestore = db();
    if (!firestore) return Promise.resolve(false);
    return firestore
      .collection('usuarios')
      .doc(receptorUid)
      .collection('solicitudes_negocio')
      .where('contraparteCuentaUid', '==', emisorUid)
      .limit(24)
      .get()
      .then(function (snap) {
        return snap.docs.some(function (doc) {
          var data = doc.data() || {};
          return (
            data.estado === 'aceptada' &&
            String(data.contextoTipo || 'perfil') === contextoTipo &&
            String(data.contextoId || '') === contextoId
          );
        });
      })
      .catch(function (err) {
        console.warn('[MessengerEnforcement] esContactoAceptado:', err);
        return false;
      });
  }

  function resolveActorContext(emisorUid, receptorUid, ctx) {
    ctx = ctx || {};
    var user = authUser();
    var registrado = !!(user && !user.isAnonymous && user.uid === String(emisorUid || ''));
    if (!registrado) {
      return Promise.resolve({ registrado: false, esFavorito: false, esContacto: false });
    }
    return esFavoritoDe(emisorUid, ctx.contextoId).then(function (fav) {
      return esContactoAceptado(receptorUid, emisorUid, ctx.contextoTipo, ctx.contextoId).then(function (contacto) {
        return { registrado: true, esFavorito: fav, esContacto: contacto };
      });
    });
  }

  function evaluarMensajePermitido(opts) {
    opts = opts || {};
    var emisorUid = String(opts.emisorUid || '');
    var receptorUid = String(opts.receptorUid || '');
    var Ps = privSchema();
    if (!Ps || !receptorUid || !emisorUid) {
      return Promise.resolve({ permitido: true, razon: 'sin_schema' });
    }
    if (esRespuestaAnunciante(emisorUid, opts)) {
      return Promise.resolve({ permitido: true, razon: 'respuesta_anunciante' });
    }
    return loadPoliticaReceptor(receptorUid).then(function (cfg) {
      return resolveActorContext(emisorUid, receptorUid, {
        contextoTipo: opts.contextoTipo,
        contextoId: opts.contextoId
      }).then(function (actor) {
        var permitido = Ps.permiteAccion(cfg, 'mensajesDe', actor);
        return {
          permitido: permitido,
          razon: permitido ? 'ok' : 'politica_mensajesDe',
          politica: cfg && cfg.mensajesDe,
          actor: actor
        };
      });
    });
  }

  function assertMensajePermitido(opts) {
    return evaluarMensajePermitido(opts).then(function (result) {
      if (!result.permitido) {
        throw new Error('Este perfil no acepta mensajes internos de tu cuenta en este momento.');
      }
      return result;
    });
  }

  function precargarMensajeInterno(perfil) {
    perfil = perfil || {};
    if (global.CariHubPerfilContactos && global.CariHubPerfilContactos.esDemo(perfil)) {
      perfil.__mensajePrivacidadOk = true;
      return Promise.resolve(true);
    }
    var cuentaUid = String(perfil.uid || perfil.cuentaUid || '').trim();
    var contextoId = String(perfil.__id || perfil.perfilId || perfil.uid || '').trim();
    if (!cuentaUid) {
      perfil.__mensajePrivacidadOk = false;
      return Promise.resolve(false);
    }
    var user = authUser();
    if (!user || user.isAnonymous) {
      return loadPoliticaReceptor(cuentaUid).then(function (cfg) {
        var Ps = privSchema();
        var ok = Ps && Ps.isAudienciaPermitida(cfg && cfg.mensajesDe, { registrado: false });
        perfil.__mensajePrivacidadOk = ok;
        return ok;
      });
    }
    return evaluarMensajePermitido({
      emisorUid: user.uid,
      receptorUid: cuentaUid,
      contextoTipo: 'perfil',
      contextoId: contextoId,
      cuentaUid: cuentaUid
    }).then(function (r) {
      perfil.__mensajePrivacidadOk = r.permitido;
      return r.permitido;
    });
  }

  global.CariHubMessengerPrivacidadEnforcement = {
    detectarDatosPrivados: detectarDatosPrivados,
    assertTextoSinDatosPrivados: assertTextoSinDatosPrivados,
    sanitizarTextoParaUi: sanitizarTextoParaUi,
    loadPoliticaReceptor: loadPoliticaReceptor,
    resolveActorContext: resolveActorContext,
    evaluarMensajePermitido: evaluarMensajePermitido,
    assertMensajePermitido: assertMensajePermitido,
    precargarMensajeInterno: precargarMensajeInterno
  };
})(typeof window !== 'undefined' ? window : globalThis);
