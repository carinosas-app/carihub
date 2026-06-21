/**
 * Perfil público — solo contenido canal perfil (TICKET-048).
 * Nunca leer usuarios/{uid}/anuncios_mensajes ni documentos con canal=mensajes.
 */
(function (global) {
  "use strict";

  var CANAL_PERFIL = "perfil";
  var CANAL_MENSAJES = "mensajes";
  var ESTADOS_PUBLICOS = ["activo", "publicado", "programado"];

  function firestoreDb() {
    if (global.CariHubDB) return global.CariHubDB;
    if (global.firebase && typeof global.firebase.firestore === "function") {
      return global.firebase.firestore();
    }
    return null;
  }

  function unwrap(doc) {
    if (!doc) return {};
    if (doc.data && typeof doc.data === "function") {
      return Object.assign({ id: doc.id }, doc.data());
    }
    return doc;
  }

  function esCanalMensajes(doc) {
    var d = unwrap(doc);
    if (!d) return false;
    if (d.canal === CANAL_MENSAJES) return true;
    if (d._coleccion === "anuncios_mensajes") return true;
    if (d.origenColeccion === "anuncios_mensajes") return true;
    return false;
  }

  function esContenidoCanalPerfil(doc) {
    var d = unwrap(doc);
    if (!d || esCanalMensajes(d)) return false;
    if (d.canal && d.canal !== CANAL_PERFIL) return false;
    return true;
  }

  function filtrarSoloCanalPerfil(items) {
    return (items || []).filter(esContenidoCanalPerfil);
  }

  function assertNoCanalMensajes(items, context) {
    var leaked = (items || []).filter(esCanalMensajes);
    if (leaked.length) {
      console.warn(
        "[PerfilPublicoContenido] canal mensajes bloqueado en render público",
        context || "",
        leaked.length
      );
    }
    return leaked.length === 0;
  }

  function formatFecha(val) {
    if (!val) return "—";
    var d = val;
    if (val && typeof val.toDate === "function") d = val.toDate();
    else if (!(d instanceof Date)) d = new Date(d);
    if (isNaN(d.getTime())) return "—";
    var diff = Date.now() - d.getTime();
    if (diff < 86400000) return "Hoy";
    if (diff < 172800000) return "Ayer";
    return d.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
  }

  function normalizarPublicacion(doc) {
    var d = unwrap(doc);
    return {
      id: d.id || "",
      cuentaUid: d.cuentaUid || "",
      perfilId: d.perfilId || "",
      canal: d.canal || CANAL_PERFIL,
      tipo: d.tipo || "estado",
      titulo: d.titulo || "Sin título",
      estado: d.estado || "borrador",
      imgUrl: d.imgUrl || d.imagenURL || "",
      fecha: formatFecha(d.creadoEn || d.fecha),
      creadoEn: d.creadoEn || null,
      vistas: Number(d.vistas || 0),
      interacciones: Number(d.interacciones || 0),
      origen: "publicaciones_perfil",
    };
  }

  function normalizarSolicitud(doc) {
    var d = unwrap(doc);
    return {
      id: d.id || "",
      cuentaUid: d.cuentaUid || d.uidAnunciante || "",
      perfilId: d.perfilId || "",
      canal: d.canal || CANAL_PERFIL,
      tipo: d.tipoDashboard || d.tipoSolicitud || "estado",
      titulo: d.titulo || d.nombre || "Sin título",
      estado: d.estado || d.estadoSolicitud || "pendiente",
      imgUrl: d.imagenURL || d.imgUrl || "",
      fecha: formatFecha(d.fechaEnvioRevision || d.fecha || d.vinculadoEn),
      creadoEn: d.fecha || d.vinculadoEn || null,
      aprobado: d.aprobado === true || d.activo === true,
      origen: "solicitudes_anuncios",
    };
  }

  function esEstadoPublicoVisible(item) {
    if (!item || !esContenidoCanalPerfil(item)) return false;
    if (item.origen === "solicitudes_anuncios") {
      return item.aprobado || ESTADOS_PUBLICOS.indexOf(String(item.estado || "").toLowerCase()) >= 0;
    }
    return ESTADOS_PUBLICOS.indexOf(String(item.estado || "").toLowerCase()) >= 0;
  }

  async function listarPublicacionesPerfil(cuentaUid, perfilId) {
    if (!cuentaUid || !perfilId) return [];
    var fs = firestoreDb();
    if (!fs) return [];

    try {
      var snap = await fs
        .collection("publicaciones_perfil")
        .where("cuentaUid", "==", cuentaUid)
        .where("perfilId", "==", perfilId)
        .get();
      var rows = snap.docs
        .map(normalizarPublicacion)
        .filter(esContenidoCanalPerfil);
      rows.sort(function (a, b) {
        var ta = a.creadoEn && a.creadoEn.toDate ? a.creadoEn.toDate().getTime() : 0;
        var tb = b.creadoEn && b.creadoEn.toDate ? b.creadoEn.toDate().getTime() : 0;
        return tb - ta;
      });
      assertNoCanalMensajes(rows, "listarPublicacionesPerfil");
      return rows;
    } catch (err) {
      console.warn("[PerfilPublicoContenido] listarPublicacionesPerfil", err);
      return [];
    }
  }

  async function listarSolicitudesPerfilAprobadas(cuentaUid, perfilId) {
    if (!cuentaUid || !perfilId) return [];
    var fs = firestoreDb();
    if (!fs) return [];

    try {
      var snap;
      try {
        snap = await fs
          .collection("solicitudes_anuncios")
          .where("uidAnunciante", "==", cuentaUid)
          .where("perfilId", "==", perfilId)
          .orderBy("fechaEnvioRevision", "desc")
          .limit(24)
          .get();
      } catch (e) {
        snap = await fs
          .collection("solicitudes_anuncios")
          .where("uidAnunciante", "==", cuentaUid)
          .where("perfilId", "==", perfilId)
          .limit(24)
          .get();
      }
      var rows = snap.docs
        .map(normalizarSolicitud)
        .filter(esContenidoCanalPerfil)
        .filter(esEstadoPublicoVisible);
      assertNoCanalMensajes(rows, "listarSolicitudesPerfilAprobadas");
      return rows;
    } catch (err) {
      console.warn("[PerfilPublicoContenido] listarSolicitudesPerfilAprobadas", err);
      return [];
    }
  }

  async function cargarEstadosParaRender(cuentaUid, perfilId) {
    var publicaciones = await listarPublicacionesPerfil(cuentaUid, perfilId);
    var solicitudes = await listarSolicitudesPerfilAprobadas(cuentaUid, perfilId);
    var visibles = filtrarSoloCanalPerfil(publicaciones.concat(solicitudes)).filter(esEstadoPublicoVisible);
    assertNoCanalMensajes(visibles, "cargarEstadosParaRender");
    return {
      publicaciones: publicaciones,
      solicitudes: solicitudes,
      visibles: visibles,
    };
  }

  var api = {
    CANAL_PERFIL: CANAL_PERFIL,
    CANAL_MENSAJES: CANAL_MENSAJES,
    esCanalMensajes: esCanalMensajes,
    esContenidoCanalPerfil: esContenidoCanalPerfil,
    filtrarSoloCanalPerfil: filtrarSoloCanalPerfil,
    assertNoCanalMensajes: assertNoCanalMensajes,
    listarPublicacionesPerfil: listarPublicacionesPerfil,
    listarSolicitudesPerfilAprobadas: listarSolicitudesPerfilAprobadas,
    cargarEstadosParaRender: cargarEstadosParaRender,
    normalizarPublicacion: normalizarPublicacion,
    normalizarSolicitud: normalizarSolicitud,
  };

  global.CariHubPerfilPublicoContenido = api;

  if (global.CariHubPerfilPublico) {
    Object.keys(api).forEach(function (key) {
      global.CariHubPerfilPublico[key] = api[key];
    });
  }
})(typeof window !== "undefined" ? window : globalThis);
