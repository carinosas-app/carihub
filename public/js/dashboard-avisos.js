/**
 * Avisos / notificaciones scoped por contexto perfil/banner (TICKET-042).
 * Colección: usuarios/{uid}/notificaciones
 */
(function (global) {
  "use strict";

  var MOCK_NOTIFICACIONES = [
    {
      id: "av-v1",
      contextoTipo: "perfil",
      contextoId: "perfil-valentina",
      tipo: "negocio",
      titulo: "Nueva solicitud de Luna M.",
      texto: "Quiere colaborar contigo en Monterrey.",
      leido: false,
      creadoEn: Date.now() - 3600000,
    },
    {
      id: "av-v2",
      contextoTipo: "perfil",
      contextoId: "perfil-valentina",
      tipo: "pago",
      titulo: "Renovación en 18 días",
      texto: "Tu plan VIP vence pronto.",
      leido: false,
      creadoEn: Date.now() - 7200000,
    },
    {
      id: "av-v3",
      contextoTipo: "perfil",
      contextoId: "perfil-valentina",
      tipo: "revision",
      titulo: "Perfil aprobado",
      texto: "Tu última actualización ya está visible.",
      leido: true,
      creadoEn: Date.now() - 86400000,
    },
    {
      id: "av-l1",
      contextoTipo: "perfil",
      contextoId: "perfil-luna",
      tipo: "mensaje",
      titulo: "3 mensajes sin leer",
      texto: "Tienes conversaciones pendientes en este perfil.",
      leido: false,
      creadoEn: Date.now() - 1800000,
    },
    {
      id: "av-b1",
      contextoTipo: "banner",
      contextoId: "banner-spa",
      tipo: "pago",
      titulo: "Banner impago",
      texto: "Renueva tu banner Spa Aurora para desbloquear chats.",
      leido: false,
      creadoEn: Date.now() - 5400000,
    },
    {
      id: "av-b2",
      contextoTipo: "banner",
      contextoId: "banner-home-mty",
      tipo: "negocio",
      titulo: "Nuevo contacto por banner",
      texto: "Ana P. escribió por tu banner home Monterrey.",
      leido: false,
      creadoEn: Date.now() - 900000,
    },
    {
      id: "av-hub1",
      contextoTipo: "cuenta",
      contextoId: "preview",
      tipo: "revision",
      titulo: "Bienvenida a tu cuenta",
      texto: "Mensajes, favoritos y avisos sin publicar perfil.",
      leido: false,
      creadoEn: Date.now() - 600000,
    },
  ];

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

  function normalizeFilter(filter) {
    filter = filter || {};
    var contextoTipo = filter.contextoTipo === "banner"
      ? "banner"
      : (filter.contextoTipo === "cuenta" ? "cuenta" : "perfil");
    return {
      contextoTipo: contextoTipo,
      contextoId: String(filter.contextoId || filter.id || ""),
    };
  }

  function formatHora(val) {
    if (!val) return "";
    var d = val;
    if (val && typeof val.toDate === "function") d = val.toDate();
    else if (!(d instanceof Date)) d = new Date(d);
    if (isNaN(d.getTime())) return "";
    var diff = Date.now() - d.getTime();
    if (diff < 60000) return "Ahora";
    if (diff < 3600000) return "Hace " + Math.floor(diff / 60000) + " min";
    if (diff < 86400000) return "Hoy";
    if (diff < 172800000) return "Ayer";
    return d.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
  }

  function normalizar(doc) {
    var d = doc.data ? doc.data() : doc;
    d = d || {};
    return {
      id: doc.id || d.id || "",
      contextoTipo: d.contextoTipo || "perfil",
      contextoId: d.contextoId || "",
      tipo: d.tipo || d.dominio || "negocio",
      titulo: d.titulo || d.title || "Aviso",
      texto: d.texto || d.body || d.mensaje || "",
      leido: d.leido === true || d.leida === true,
      creadoEn: d.creadoEn || d.createdAt || null,
      hora: formatHora(d.creadoEn || d.createdAt),
    };
  }

  function filterByContexto(items, filter) {
    if (!filter || !filter.contextoId) return [];
    return (items || []).filter(function (n) {
      return n.contextoTipo === filter.contextoTipo && n.contextoId === filter.contextoId;
    });
  }

  function mockList(filter) {
    return filterByContexto(MOCK_NOTIFICACIONES, filter).map(normalizar);
  }

  function aggregateUnreadMaps(items) {
    var perfil = {};
    var banner = {};
    (items || []).forEach(function (n) {
      if (n.leido) return;
      var id = n.contextoId;
      if (!id) return;
      if (n.contextoTipo === "banner") banner[id] = (banner[id] || 0) + 1;
      else if (n.contextoTipo === "perfil") perfil[id] = (perfil[id] || 0) + 1;
    });
    return { perfil: perfil, banner: banner };
  }

  function computeMockUnreadMaps() {
    return aggregateUnreadMaps(MOCK_NOTIFICACIONES);
  }

  function totalUnreadFromMaps(maps) {
    maps = maps || {};
    var total = 0;
    Object.values(maps.perfil || {}).forEach(function (n) { total += Number(n) || 0; });
    Object.values(maps.banner || {}).forEach(function (n) { total += Number(n) || 0; });
    return total;
  }

  async function listar(filter) {
    filter = normalizeFilter(filter);
    if (!filter.contextoId) return [];

    if (isPreviewMode() || !auth() || !auth().currentUser) {
      return mockList(filter).sort(function (a, b) {
        var ta = a.creadoEn instanceof Date ? a.creadoEn.getTime() : Number(a.creadoEn) || 0;
        var tb = b.creadoEn instanceof Date ? b.creadoEn.getTime() : Number(b.creadoEn) || 0;
        return tb - ta;
      });
    }

    var user = auth().currentUser;
    var firestore = db();
    if (!firestore || !user) return [];

    try {
      var snap = await firestore
        .collection("usuarios")
        .doc(user.uid)
        .collection("notificaciones")
        .where("contextoTipo", "==", filter.contextoTipo)
        .where("contextoId", "==", filter.contextoId)
        .orderBy("creadoEn", "desc")
        .limit(48)
        .get();
      return snap.docs.map(function (d) {
        return normalizar(Object.assign({ id: d.id }, d.data()));
      });
    } catch (err) {
      console.warn("[DashAvisos] listar", err);
      return isPreviewMode() ? mockList(filter) : [];
    }
  }

  async function marcarLeido(notificacionId) {
    if (!notificacionId) return;
    if (isPreviewMode() || !auth() || !auth().currentUser) {
      MOCK_NOTIFICACIONES.forEach(function (n) {
        if (n.id === notificacionId) n.leido = true;
      });
      return;
    }
    var user = auth().currentUser;
    var firestore = db();
    if (!firestore || !user) return;
    try {
      await firestore
        .collection("usuarios")
        .doc(user.uid)
        .collection("notificaciones")
        .doc(notificacionId)
        .update({ leido: true });
    } catch (err) {
      console.warn("[DashAvisos] marcarLeido", err);
    }
  }

  async function getAllUnreadCountsByContexto(cuentaUid) {
    if (isPreviewMode() || !auth() || !auth().currentUser) {
      return computeMockUnreadMaps();
    }
    var user = auth().currentUser;
    cuentaUid = String(cuentaUid || user.uid);
    var firestore = db();
    if (!firestore) return { perfil: {}, banner: {} };
    try {
      var snap = await firestore
        .collection("usuarios")
        .doc(cuentaUid)
        .collection("notificaciones")
        .where("leido", "==", false)
        .limit(500)
        .get();
      return aggregateUnreadMaps(snap.docs.map(function (d) {
        return normalizar(Object.assign({ id: d.id }, d.data()));
      }));
    } catch (err) {
      console.warn("[DashAvisos] getAllUnreadCountsByContexto", err);
      return isPreviewMode() ? computeMockUnreadMaps() : { perfil: {}, banner: {} };
    }
  }

  function subscribeUnreadRail(cuentaUid, onChange) {
    var firestore = db();
    if (!firestore || typeof onChange !== "function") return function () {};
    var user = auth() && auth().currentUser;
    if (!user && !isPreviewMode()) return function () {};
    cuentaUid = String(cuentaUid || (user && user.uid) || "");

    if (isPreviewMode() || !user) {
      onChange(computeMockUnreadMaps());
      return function () {};
    }

    return firestore
      .collection("usuarios")
      .doc(cuentaUid)
      .collection("notificaciones")
      .where("leido", "==", false)
      .limit(500)
      .onSnapshot(
        function (snap) {
          onChange(aggregateUnreadMaps(snap.docs.map(function (d) {
            return normalizar(Object.assign({ id: d.id }, d.data()));
          })));
        },
        function (err) {
          console.warn("[DashAvisos] subscribeUnreadRail", err);
          onChange({ perfil: {}, banner: {} });
        }
      );
  }

  function iconForTipo(tipo) {
    if (tipo === "negocio") return "🤝";
    if (tipo === "pago") return "💳";
    if (tipo === "live") return "📡";
    if (tipo === "mensaje") return "💬";
    return "✅";
  }

  global.DashAvisos = {
    MOCK_NOTIFICACIONES: MOCK_NOTIFICACIONES,
    listar: listar,
    marcarLeido: marcarLeido,
    normalizeFilter: normalizeFilter,
    computeMockUnreadMaps: computeMockUnreadMaps,
    getAllUnreadCountsByContexto: getAllUnreadCountsByContexto,
    subscribeUnreadRail: subscribeUnreadRail,
    totalUnreadFromMaps: totalUnreadFromMaps,
    iconForTipo: iconForTipo,
    normalizar: normalizar,
  };
})(typeof window !== "undefined" ? window : globalThis);
