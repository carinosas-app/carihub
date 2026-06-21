/**
 * Solicitudes de contenido dashboard — estados y lives en solicitudes_anuncios (TICKET-023).
 * Cumple solicitudCreateValida(): uidAnunciante, correoSolicitante, estado pendiente, fecha, vinculadoEn.
 */
(function (global) {
  "use strict";

  var TIPOS = {
    ESTADO_PERFIL: "dashboard_estado_perfil",
    LIVE_ACTIVO: "dashboard_live_activo",
    LIVE_PROGRAMADO: "dashboard_live_programado",
  };

  function db() {
    if (global.CariHubDB) return global.CariHubDB;
    if (global.firebase && typeof global.firebase.firestore === "function") {
      return global.firebase.firestore();
    }
    return null;
  }

  function storage() {
    if (global.CariHubStorage) return global.CariHubStorage;
    if (global.firebase && typeof global.firebase.storage === "function") {
      return global.firebase.storage();
    }
    return null;
  }

  function auth() {
    if (global.CariHubAuth) return global.CariHubAuth;
    if (global.firebase && typeof global.firebase.auth === "function") {
      return global.firebase.auth();
    }
    return null;
  }

  function ts() {
    return global.firebase &&
      global.firebase.firestore &&
      global.firebase.firestore.FieldValue
      ? global.firebase.firestore.FieldValue.serverTimestamp()
      : new Date();
  }

  function isPreviewMode() {
    try {
      return new URLSearchParams(global.location.search).get("preview") === "1";
    } catch (e) {
      return false;
    }
  }

  function safeName(name) {
    return String(name || "imagen")
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(0, 80);
  }

  function showNotice(elId, message, kind) {
    var el = global.document.getElementById(elId);
    if (!el) return;
    if (!message) {
      el.textContent = "";
      el.classList.add("hidden");
      return;
    }
    el.textContent = message;
    el.className =
      "dash-studio__notice dash-studio__notice--" + (kind === "error" ? "error" : "ok");
    el.classList.remove("hidden");
  }

  async function subirCreativo(solicitudId, file) {
    var st = storage();
    if (!st || !file || !solicitudId) return { path: "", url: "" };
    var ext = (file.name && file.name.split(".").pop()) || "jpg";
    var path =
      "solicitudes_anuncios/" +
      solicitudId +
      "/creativos/" +
      Date.now() +
      "-" +
      safeName(file.name) +
      "." +
      ext;
    var ref = st.ref(path);
    await ref.put(file);
    var url = await ref.getDownloadURL();
    return { path: path, url: url };
  }

  function buildPayload(user, extra) {
    extra = extra || {};
    var email = String(user.email || "").trim().toLowerCase();
    var payload = {
      tipoSolicitud: extra.tipoSolicitud,
      tipoDashboard: extra.tipoDashboard || "",
      uidAnunciante: user.uid,
      correoSolicitante: email,
      estado: "pendiente",
      fecha: ts(),
      vinculadoEn: ts(),
      fechaEnvioRevision: ts(),
      estadoSolicitud: "revision_admin",
      estadoAdmin: "sin_revisar",
      origen: "dashboard-rentero",
      canal: "perfil",
      cuentaUid: extra.cuentaUid || user.uid,
      perfilId: extra.perfilId || "",
      titulo: String(extra.titulo || "Sin título").slice(0, 80),
      nombre: String(extra.titulo || "Sin título").slice(0, 80),
      texto: String(extra.texto || "").slice(0, 500),
      activo: false,
      aprobado: false,
    };
    if (extra.imagenURL) payload.imagenURL = extra.imagenURL;
    if (extra.imagenPath) payload.imagenPath = extra.imagenPath;
    if (extra.programadoPara) payload.programadoPara = extra.programadoPara;
    if (extra.nombrePublico) payload.nombrePublico = extra.nombrePublico;
    if (extra.categoria) payload.categoria = extra.categoria;
    if (extra.ciudad) payload.ciudad = extra.ciudad;
    return payload;
  }

  async function crearSolicitud(extra) {
    var firestore = db();
    var user = auth() && auth().currentUser;
    if (!firestore || !user) throw new Error("Sesión requerida para enviar la solicitud.");
    if (!extra.perfilId) throw new Error("Selecciona un perfil en la columna izquierda.");

    var docRef = firestore.collection("solicitudes_anuncios").doc();
    var payload = buildPayload(user, extra);

    if (extra.file) {
      var up = await subirCreativo(docRef.id, extra.file);
      payload.imagenURL = up.url;
      payload.imagenPath = up.path;
    }

    await docRef.set(payload);
    return { id: docRef.id, imagenURL: payload.imagenURL || "" };
  }

  function runPreview(extra) {
    var hooks = global.DashSolicitudesContenidoPreview;
    if (hooks && typeof hooks.onSolicitud === "function") {
      hooks.onSolicitud(extra);
    }
    return { id: "preview-" + Date.now(), preview: true };
  }

  async function crearEstadoPerfil(opts) {
    opts = opts || {};
    if (isPreviewMode() || !auth() || !auth().currentUser) {
      return runPreview({
        tipoSolicitud: TIPOS.ESTADO_PERFIL,
        tipoDashboard: "estado",
        titulo: opts.titulo,
        imagenURL: opts.imagenURL,
        perfilId: opts.perfilId,
      });
    }
    return crearSolicitud({
      tipoSolicitud: TIPOS.ESTADO_PERFIL,
      tipoDashboard: "estado",
      titulo: opts.titulo,
      perfilId: opts.perfilId,
      cuentaUid: opts.cuentaUid,
      file: opts.file,
      imagenURL: opts.imagenURL,
      nombrePublico: opts.nombrePublico,
      categoria: opts.categoria,
      ciudad: opts.ciudad,
    });
  }

  async function crearLiveActivo(opts) {
    opts = opts || {};
    if (isPreviewMode() || !auth() || !auth().currentUser) {
      return runPreview({
        tipoSolicitud: TIPOS.LIVE_ACTIVO,
        tipoDashboard: "live",
        titulo: opts.titulo,
        perfilId: opts.perfilId,
      });
    }
    return crearSolicitud({
      tipoSolicitud: TIPOS.LIVE_ACTIVO,
      tipoDashboard: "live",
      titulo: opts.titulo,
      perfilId: opts.perfilId,
      cuentaUid: opts.cuentaUid,
      texto: "Transmisión en vivo iniciada desde dashboard.",
    });
  }

  async function crearLiveProgramado(opts) {
    opts = opts || {};
    if (isPreviewMode() || !auth() || !auth().currentUser) {
      return runPreview({
        tipoSolicitud: TIPOS.LIVE_PROGRAMADO,
        tipoDashboard: "live_programado",
        titulo: opts.titulo,
        perfilId: opts.perfilId,
        programadoPara: opts.programadoPara,
      });
    }
    return crearSolicitud({
      tipoSolicitud: TIPOS.LIVE_PROGRAMADO,
      tipoDashboard: "live_programado",
      titulo: opts.titulo,
      perfilId: opts.perfilId,
      cuentaUid: opts.cuentaUid,
      programadoPara: opts.programadoPara,
      texto: "Live programado desde dashboard.",
    });
  }

  function resolvePerfilContext() {
    if (typeof global.getDashboardPublicacionesContext === "function") {
      var ctx = global.getDashboardPublicacionesContext();
      if (ctx && ctx.perfilId) return ctx;
    }
    if (global.DashContext && typeof global.DashContext.get === "function") {
      var dash = global.DashContext.get();
      if (dash && dash.tipo === "perfil" && dash.id) {
        var user = auth() && auth().currentUser;
        return {
          cuentaUid: user ? user.uid : null,
          perfilId: dash.perfilId || dash.id,
        };
      }
    }
    return { cuentaUid: null, perfilId: null };
  }

  global.DashSolicitudesContenido = {
    TIPOS: TIPOS,
    crearEstadoPerfil: crearEstadoPerfil,
    crearLiveActivo: crearLiveActivo,
    crearLiveProgramado: crearLiveProgramado,
    resolvePerfilContext: resolvePerfilContext,
    showNotice: showNotice,
    isPreviewMode: isPreviewMode,
  };
})(typeof window !== "undefined" ? window : globalThis);
