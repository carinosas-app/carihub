/**
 * Anuncios canal mensajes — set independiente del canal perfil (TICKET-048).
 * Colección: usuarios/{uid}/anuncios_mensajes
 * No importar en perfil-publico.html — usar CariHubPerfilPublicoContenido.
 */
(function (global) {
  "use strict";

  var CANAL = "mensajes";

  var MOCK_ANUNCIOS_CANAL_MENSAJES = [
    {
      id: "msg-am-v1",
      cuentaUid: "preview",
      canal: CANAL,
      contextoTipo: "perfil",
      contextoId: "perfil-valentina",
      titulo: "Consultas VIP",
      subtitulo: "Responde en menos de 2 h",
      imgUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
      conversacionId: "c1",
      activo: true,
    },
    {
      id: "msg-am-v2",
      cuentaUid: "preview",
      canal: CANAL,
      contextoTipo: "perfil",
      contextoId: "perfil-valentina",
      titulo: "Evento viernes",
      subtitulo: "Cupos limitados · escríbeme aquí",
      imgUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=120&q=80",
      conversacionId: "c2",
      activo: true,
    },
    {
      id: "msg-am-v3",
      cuentaUid: "preview",
      canal: CANAL,
      contextoTipo: "perfil",
      contextoId: "perfil-valentina",
      titulo: "Promo noche",
      subtitulo: "Solo visible en Mensajes",
      imgUrl: "https://images.unsplash.com/photo-1512310604669-443f26c35f52?auto=format&fit=crop&w=120&q=80",
      conversacionId: null,
      activo: true,
    },
    {
      id: "msg-am-l1",
      cuentaUid: "preview",
      canal: CANAL,
      contextoTipo: "perfil",
      contextoId: "perfil-luna",
      titulo: "Colaboración MTY",
      subtitulo: "Solicitudes abiertas",
      imgUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=120&q=80",
      conversacionId: "c3",
      activo: true,
    },
    {
      id: "msg-am-b1",
      cuentaUid: "preview",
      canal: CANAL,
      contextoTipo: "banner",
      contextoId: "banner-spa",
      titulo: "Campaña spa",
      subtitulo: "Contactos del banner home",
      imgUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=120&q=80",
      conversacionId: "c4",
      activo: true,
    },
    {
      id: "msg-am-b2",
      cuentaUid: "preview",
      canal: CANAL,
      contextoTipo: "banner",
      contextoId: "banner-spa",
      titulo: "Temporada verano",
      subtitulo: "Promo Guadalajara",
      imgUrl: "https://images.unsplash.com/photo-1515378790541-4067a0a55503?auto=format&fit=crop&w=120&q=80",
      conversacionId: "c5",
      activo: true,
    },
    {
      id: "msg-am-b3",
      cuentaUid: "preview",
      canal: CANAL,
      contextoTipo: "banner",
      contextoId: "banner-home-mty",
      titulo: "Home MTY",
      subtitulo: "Consultas por banner home",
      imgUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=120&q=80",
      conversacionId: "c6",
      activo: true,
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

  function ts() {
    return global.firebase && global.firebase.firestore && global.firebase.firestore.FieldValue
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

  function normalizar(doc) {
    var d = doc.data ? doc.data() : doc;
    d = d || {};
    return {
      id: doc.id || d.id || "",
      cuentaUid: d.cuentaUid || "",
      canal: d.canal || CANAL,
      contextoTipo: d.contextoTipo || "perfil",
      contextoId: d.contextoId || "",
      titulo: d.titulo || d.nombre || "Anuncio",
      subtitulo: d.subtitulo || d.descripcion || "",
      imgUrl: d.imgUrl || d.img || "",
      img: d.imgUrl || d.img || "",
      conversacionId: d.conversacionId || null,
      activo: d.activo !== false,
      creadoEn: d.creadoEn || null,
      fecha: formatFecha(d.creadoEn),
    };
  }

  function toStripItem(item) {
    var n = normalizar(item);
    return {
      id: n.id,
      contextoTipo: n.contextoTipo,
      contextoId: n.contextoId,
      titulo: n.titulo,
      subtitulo: n.subtitulo,
      img: n.imgUrl,
      conversacionId: n.conversacionId,
      activo: n.activo,
    };
  }

  function filterByContexto(items, filter) {
    if (!filter || !filter.contextoId) return [];
    return (items || []).filter(function (a) {
      return (
        a.activo !== false &&
        a.canal === CANAL &&
        a.contextoTipo === filter.contextoTipo &&
        a.contextoId === filter.contextoId
      );
    });
  }

  function mockList(filter) {
    return filterByContexto(MOCK_ANUNCIOS_CANAL_MENSAJES, filter).map(normalizar);
  }

  function mockListAll(filter) {
    if (!filter || !filter.contextoId) return MOCK_ANUNCIOS_CANAL_MENSAJES.map(normalizar);
    return mockList(filter);
  }

  async function listarActivos(filter) {
    if (
      filter &&
      filter.contextoTipo === "banner" &&
      global.DashBannerMensajes &&
      global.DashBannerMensajes.isContextoBloqueado(filter)
    ) {
      return [];
    }
    var items = await listar(filter, { soloActivos: true });
    return items.map(toStripItem);
  }

  async function listar(filter, opts) {
    opts = opts || {};
    if (!filter || !filter.contextoId) return [];

    if (isPreviewMode() || !auth() || !auth().currentUser) {
      var mock = mockList(filter);
      return opts.soloActivos ? mock.filter(function (x) { return x.activo; }) : mock;
    }

    var user = auth().currentUser;
    var firestore = db();
    if (!firestore || !user) return [];

    try {
      var q = firestore
        .collection("usuarios")
        .doc(user.uid)
        .collection("anuncios_mensajes")
        .where("contextoTipo", "==", filter.contextoTipo)
        .where("contextoId", "==", filter.contextoId);
      if (opts.soloActivos !== false) {
        q = q.where("activo", "==", true);
      }
      var snap = await q.limit(24).get();
      var rows = snap.docs.map(function (d) {
        return normalizar(Object.assign({ id: d.id }, d.data()));
      });
      rows.sort(function (a, b) {
        var ta = a.creadoEn && a.creadoEn.toDate ? a.creadoEn.toDate().getTime() : 0;
        var tb = b.creadoEn && b.creadoEn.toDate ? b.creadoEn.toDate().getTime() : 0;
        return tb - ta;
      });
      return rows;
    } catch (err) {
      console.warn("[DashAnunciosMensajes] listar", err);
      return [];
    }
  }

  async function listarAdmin(filter) {
    if (isPreviewMode() || !auth() || !auth().currentUser) {
      return mockListAll(filter);
    }
    return listar(filter, { soloActivos: false });
  }

  async function crear(payload) {
    if (!payload || !payload.contextoId || !payload.contextoTipo) return null;

    if (isPreviewMode() || !auth() || !auth().currentUser) {
      var id = "msg-am-" + Date.now();
      var row = normalizar(
        Object.assign({}, payload, {
          id: id,
          canal: CANAL,
          cuentaUid: "preview",
          activo: true,
          creadoEn: new Date(),
        })
      );
      MOCK_ANUNCIOS_CANAL_MENSAJES.unshift(row);
      return id;
    }

    var user = auth().currentUser;
    var firestore = db();
    if (!firestore || !user) return null;

    var doc = {
      cuentaUid: user.uid,
      canal: CANAL,
      contextoTipo: payload.contextoTipo,
      contextoId: payload.contextoId,
      titulo: String(payload.titulo || "Sin título").slice(0, 80),
      subtitulo: String(payload.subtitulo || "").slice(0, 120),
      imgUrl: payload.imgUrl || "",
      conversacionId: payload.conversacionId || null,
      activo: true,
      creadoEn: ts(),
      actualizadoEn: ts(),
    };

    var ref = await firestore.collection("usuarios").doc(user.uid).collection("anuncios_mensajes").add(doc);
    return ref.id;
  }

  async function desactivar(anuncioId) {
    if (!anuncioId) return false;

    if (isPreviewMode() || !auth() || !auth().currentUser) {
      var item = MOCK_ANUNCIOS_CANAL_MENSAJES.find(function (x) {
        return x.id === anuncioId;
      });
      if (item) item.activo = false;
      return true;
    }

    var user = auth().currentUser;
    var firestore = db();
    if (!firestore || !user) return false;

    try {
      await firestore
        .collection("usuarios")
        .doc(user.uid)
        .collection("anuncios_mensajes")
        .doc(anuncioId)
        .update({
          activo: false,
          actualizadoEn: ts(),
        });
      return true;
    } catch (err) {
      console.warn("[DashAnunciosMensajes] desactivar", err);
      return false;
    }
  }

  global.DashAnunciosMensajes = {
    CANAL: CANAL,
    listar: listar,
    listarActivos: listarActivos,
    listarAdmin: listarAdmin,
    crear: crear,
    desactivar: desactivar,
    normalizar: normalizar,
    toStripItem: toStripItem,
    formatFecha: formatFecha,
    MOCK_ANUNCIOS_CANAL_MENSAJES: MOCK_ANUNCIOS_CANAL_MENSAJES,
  };
})(typeof window !== "undefined" ? window : globalThis);
