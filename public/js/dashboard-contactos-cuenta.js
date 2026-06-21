/**
 * Métodos de contacto compartidos vs por perfil (TICKET-054).
 * usuarios/{uid}.contactoPublico + perfilesDetalle[perfilId].contactoHeredaCuenta
 */
(function (global) {
  "use strict";

  var cuentaContacto = {};
  var cuentaUid = "";

  var MOCK_CUENTA_CONTACTO = {
    whatsapp: "+52 55 1234 5678",
    whatsappActivo: true,
    telegram: "@usuario_telegram",
    telegramActivo: true,
    instagram: "@usuario_instagram",
    instagramActivo: true,
    telefono: "+52 81 0000 0000",
    llamadaActivo: true,
    mensajeInternoActivo: true,
    mensajeInterno: "Mensajes en Cariñosas",
  };

  function db() {
    if (global.CariHubDB) return global.CariHubDB;
    if (global.firebase && typeof global.firebase.firestore === "function") return global.firebase.firestore();
    return null;
  }

  function auth() {
    if (global.CariHubAuth) return global.CariHubAuth;
    if (global.firebase && typeof global.firebase.auth === "function") return global.firebase.auth();
    return null;
  }

  function isPreviewMode() {
    try {
      return new URLSearchParams(global.location.search).get("preview") === "1";
    } catch (e) {
      return false;
    }
  }

  function clone(obj) {
    return Object.assign({}, obj || {});
  }

  function heredaCuenta(perfilRaw) {
    if (!perfilRaw || perfilRaw.contactoHeredaCuenta === false) return false;
    return true;
  }

  function resolveContactoPublico(cuentaCp, perfilRaw) {
    cuentaCp = cuentaCp || {};
    if (!perfilRaw || heredaCuenta(perfilRaw)) {
      return clone(cuentaCp);
    }
    var override = perfilRaw.contactoPublico || {};
    return Object.assign(clone(cuentaCp), clone(override));
  }

  function initFromHub(hubData, opts) {
    opts = opts || {};
    hubData = hubData || {};
    cuentaUid = opts.cuentaUid || hubData.uid || "";
    if (hubData.contactoPublico && typeof hubData.contactoPublico === "object") {
      cuentaContacto = clone(hubData.contactoPublico);
    } else if (isPreviewMode() && !hubData.contactoPublico) {
      cuentaContacto = clone(MOCK_CUENTA_CONTACTO);
    } else {
      cuentaContacto = {};
    }
    return getCuentaContacto();
  }

  function getCuentaContacto() {
    return clone(cuentaContacto);
  }

  function setCuentaContactoLocal(cp) {
    cuentaContacto = clone(cp);
  }

  function resolveForPerfil(pub) {
    pub = pub || {};
    var raw = pub._raw || pub;
    var hereda = heredaCuenta(raw);
    return {
      hereda: hereda,
      contactoPublico: resolveContactoPublico(cuentaContacto, raw),
      override: clone(raw.contactoPublico || {}),
    };
  }

  function applyToPerfil(pub) {
    if (!pub || pub.tipo !== "perfil") return pub;
    var resolved = resolveForPerfil(pub);
    pub.contactoHeredaCuenta = resolved.hereda;
    pub.contactoPublicoOverride = resolved.override;
    pub.contactoPublico = resolved.contactoPublico;
  }

  async function guardarCuenta(cp) {
    cp = clone(cp);
    setCuentaContactoLocal(cp);
    var user = auth() && auth().currentUser;
    if (!user || isPreviewMode()) return cp;
    var firestore = db();
    if (!firestore) return cp;
    await firestore.collection("usuarios").doc(user.uid).update({
      contactoPublico: cp,
      telefono: cp.whatsapp || cp.telefono || "",
      estadoRevision: "actualizacion_pendiente",
      actualizacionPendiente: true,
    });
    return cp;
  }

  async function guardarPerfilOverride(perfilId, patch) {
    patch = patch || {};
    var user = auth() && auth().currentUser;
    if (!user || !perfilId) return;
    if (isPreviewMode()) return;
    var firestore = db();
    if (!firestore) return;
    var hubRef = firestore.collection("usuarios").doc(user.uid);
    var hubSnap = await hubRef.get();
    if (!hubSnap.exists) return;
    var hub = hubSnap.data() || {};
    var detalle = hub.perfilesDetalle && typeof hub.perfilesDetalle === "object"
      ? Object.assign({}, hub.perfilesDetalle)
      : {};
    var entry = Object.assign({}, detalle[perfilId] || {});
    if (typeof patch.contactoHeredaCuenta === "boolean") {
      entry.contactoHeredaCuenta = patch.contactoHeredaCuenta;
    }
    if (patch.contactoPublico) {
      entry.contactoPublico = clone(patch.contactoPublico);
    }
    detalle[perfilId] = Object.assign({}, entry, {
      estadoRevision: "actualizacion_pendiente",
      actualizacionPendiente: true,
    });
    await hubRef.update({
      perfilesDetalle: detalle,
      estadoRevision: "actualizacion_pendiente",
      actualizacionPendiente: true,
    });
  }

  global.DashContactosCuenta = {
    MOCK_CUENTA_CONTACTO: MOCK_CUENTA_CONTACTO,
    initFromHub: initFromHub,
    getCuentaContacto: getCuentaContacto,
    setCuentaContactoLocal: setCuentaContactoLocal,
    heredaCuenta: heredaCuenta,
    resolveContactoPublico: resolveContactoPublico,
    resolveForPerfil: resolveForPerfil,
    applyToPerfil: applyToPerfil,
    guardarCuenta: guardarCuenta,
    guardarPerfilOverride: guardarPerfilOverride,
  };
})(typeof window !== "undefined" ? window : globalThis);
