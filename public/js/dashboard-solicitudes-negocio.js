/**
 * Solicitudes de negocio scoped por contexto (TICKET-043).
 * Colección: usuarios/{uid}/solicitudes_negocio
 * Modelo alineado a ANEXO-RED-CONTACTOS-CONEXIONES-NEGOCIO — conexiones tipadas, no amistades.
 */
(function (global) {
  "use strict";

  var TIPOS_ARISTA = {
    colaboracion: { label: "Colaboración", emoji: "🤝" },
    alianza_b2b: { label: "Alianza B2B", emoji: "🏢" },
    patrocinio: { label: "Patrocinio", emoji: "📣" },
    contacto_profesional: { label: "Contacto profesional", emoji: "💼" },
    hospedaje: { label: "Hospedaje / venue", emoji: "🏨" },
    evento: { label: "Evento privado", emoji: "📅" },
    referido: { label: "Referido", emoji: "↗️" },
  };

  var MOCK_SOLICITUDES = [
    {
      id: "sol-v-r1",
      cuentaUid: "preview",
      contextoTipo: "perfil",
      contextoId: "perfil-valentina",
      direccion: "recibida",
      estado: "pendiente",
      tipoArista: "colaboracion",
      tipoEntidadOrigen: "perfil",
      tipoEntidadDestino: "perfil",
      contraparteId: "perfil-luna",
      contraparteNombre: "Luna M.",
      contraparteCategoria: "Escort",
      contraparteCiudad: "Monterrey",
      contraparteEstado: "Nuevo León",
      contraparteImg: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=160&q=80",
      contraparteVerificado: true,
      mensaje: "Quiero colaborar contigo en Monterrey para un evento privado el próximo fin de semana.",
      propuesta: "Evento VIP · 2 noches · comisión 15%",
      leido: false,
      bloqueado: false,
      creadoEn: Date.now() - 3600000,
    },
    {
      id: "sol-v-r2",
      cuentaUid: "preview",
      contextoTipo: "perfil",
      contextoId: "perfil-valentina",
      direccion: "recibida",
      estado: "pendiente",
      tipoArista: "hospedaje",
      tipoEntidadOrigen: "negocio",
      tipoEntidadDestino: "perfil",
      contraparteId: "negocio-hotel-boutique",
      contraparteNombre: "Hotel Boutique San Pedro",
      contraparteCategoria: "Hospedaje",
      contraparteCiudad: "San Pedro",
      contraparteEstado: "Nuevo León",
      contraparteImg: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=160&q=80",
      contraparteVerificado: true,
      mensaje: "Tenemos suites para talento VIP. ¿Te interesa paquete fin de semana con descuento?",
      propuesta: "Suite + desayuno · tarifa preferente",
      leido: false,
      bloqueado: false,
      creadoEn: Date.now() - 7200000,
    },
    {
      id: "sol-v-r3",
      cuentaUid: "preview",
      contextoTipo: "perfil",
      contextoId: "perfil-valentina",
      direccion: "recibida",
      estado: "pendiente",
      tipoArista: "evento",
      tipoEntidadOrigen: "negocio",
      tipoEntidadDestino: "perfil",
      contraparteId: "negocio-club-velvet",
      contraparteNombre: "Club Velvet",
      contraparteCategoria: "Antro",
      contraparteCiudad: "Monterrey",
      contraparteEstado: "Nuevo León",
      contraparteImg: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=160&q=80",
      contraparteVerificado: true,
      mensaje: "Noche especial este viernes — buscamos talento para mesa VIP.",
      propuesta: "Viernes 22:00 · Mesa reservada",
      leido: true,
      bloqueado: false,
      creadoEn: Date.now() - 14400000,
    },
    {
      id: "sol-v-e1",
      cuentaUid: "preview",
      contextoTipo: "perfil",
      contextoId: "perfil-valentina",
      direccion: "enviada",
      estado: "pendiente",
      tipoArista: "alianza_b2b",
      tipoEntidadOrigen: "perfil",
      tipoEntidadDestino: "negocio",
      contraparteId: "negocio-studio-velvet",
      contraparteNombre: "Studio Velvet",
      contraparteCategoria: "Table Dance",
      contraparteCiudad: "Monterrey",
      contraparteEstado: "Nuevo León",
      contraparteImg: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=160&q=80",
      contraparteVerificado: true,
      mensaje: "Propuesta de cross-promo para temporada de verano.",
      propuesta: "Stories cruzados · 2 semanas",
      leido: true,
      bloqueado: false,
      creadoEn: Date.now() - 86400000,
    },
    {
      id: "sol-v-s1",
      cuentaUid: "preview",
      contextoTipo: "perfil",
      contextoId: "perfil-valentina",
      direccion: "recibida",
      estado: "aceptada",
      tipoArista: "contacto_profesional",
      tipoEntidadOrigen: "perfil",
      tipoEntidadDestino: "perfil",
      contraparteId: "perfil-andrea",
      contraparteNombre: "Andrea VIP",
      contraparteCategoria: "Escort VIP",
      contraparteCiudad: "Monterrey",
      contraparteEstado: "Nuevo León",
      contraparteImg: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=160&q=80",
      contraparteVerificado: true,
      mensaje: "Conexión aceptada — coordinemos agenda compartida.",
      propuesta: "Socio activo",
      leido: true,
      bloqueado: false,
      creadoEn: Date.now() - 604800000,
    },
    {
      id: "sol-l-r1",
      cuentaUid: "preview",
      contextoTipo: "perfil",
      contextoId: "perfil-luna",
      direccion: "recibida",
      estado: "pendiente",
      tipoArista: "referido",
      tipoEntidadOrigen: "perfil",
      tipoEntidadDestino: "perfil",
      contraparteId: "perfil-valentina",
      contraparteNombre: "Valentina",
      contraparteCategoria: "Escort VIP",
      contraparteCiudad: "Monterrey",
      contraparteEstado: "Nuevo León",
      contraparteImg: "img/resultados-demo/violeta-1.png",
      contraparteVerificado: true,
      mensaje: "Te refiero clientes de San Pedro cuando estoy fuera de ciudad.",
      propuesta: "Referidos MTY ↔ San Pedro",
      leido: false,
      bloqueado: false,
      creadoEn: Date.now() - 5400000,
    },
    {
      id: "sol-b-r1",
      cuentaUid: "preview",
      contextoTipo: "banner",
      contextoId: "banner-spa",
      direccion: "recibida",
      estado: "pendiente",
      tipoArista: "patrocinio",
      tipoEntidadOrigen: "negocio",
      tipoEntidadDestino: "anunciante",
      contraparteId: "negocio-spa-gdl",
      contraparteNombre: "Spa Aurora GDL",
      contraparteCategoria: "Spa",
      contraparteCiudad: "Guadalajara",
      contraparteEstado: "Jalisco",
      contraparteImg: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=160&q=80",
      contraparteVerificado: false,
      mensaje: "Renovamos campaña spa — ¿extiendes el banner a temporada alta?",
      propuesta: "Renovación 90 días · paquete verano",
      leido: false,
      bloqueado: false,
      creadoEn: Date.now() - 10800000,
    },
    {
      id: "sol-b-r2",
      cuentaUid: "preview",
      contextoTipo: "banner",
      contextoId: "banner-home-mty",
      direccion: "recibida",
      estado: "aceptada",
      tipoArista: "alianza_b2b",
      tipoEntidadOrigen: "negocio",
      tipoEntidadDestino: "anunciante",
      contraparteId: "negocio-hotel-mty",
      contraparteNombre: "Hotel Plaza MTY",
      contraparteCategoria: "Hospedaje",
      contraparteCiudad: "Monterrey",
      contraparteEstado: "Nuevo León",
      contraparteImg: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=160&q=80",
      contraparteVerificado: true,
      mensaje: "Socio activo del banner home — paquetes corporativos.",
      propuesta: "Banner + landing co-branded",
      leido: true,
      bloqueado: false,
      creadoEn: Date.now() - 259200000,
    },
    {
      id: "sol-v-bl1",
      cuentaUid: "preview",
      contextoTipo: "perfil",
      contextoId: "perfil-valentina",
      direccion: "recibida",
      estado: "bloqueada",
      tipoArista: "colaboracion",
      contraparteId: "perfil-spam",
      contraparteNombre: "Perfil no verificado",
      contraparteCategoria: "Escort",
      contraparteCiudad: "CDMX",
      contraparteEstado: "Ciudad de México",
      contraparteImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&q=80",
      contraparteVerificado: false,
      mensaje: "Solicitud bloqueada por política de la cuenta.",
      leido: true,
      bloqueado: true,
      creadoEn: Date.now() - 1209600000,
    },
    {
      id: "sol-v-rej1",
      cuentaUid: "preview",
      contextoTipo: "perfil",
      contextoId: "perfil-valentina",
      direccion: "enviada",
      estado: "rechazada",
      tipoArista: "evento",
      contraparteId: "negocio-antro-cdmx",
      contraparteNombre: "Antro CDMX",
      contraparteCategoria: "Antro",
      contraparteCiudad: "CDMX",
      contraparteEstado: "Ciudad de México",
      contraparteImg: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=160&q=80",
      contraparteVerificado: false,
      mensaje: "Solicitud no aceptada en este momento.",
      leido: true,
      bloqueado: false,
      creadoEn: Date.now() - 432000000,
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

  function aristaMeta(tipo) {
    return TIPOS_ARISTA[tipo] || { label: String(tipo || "Conexión").replace(/_/g, " "), emoji: "🔗" };
  }

  function normalizar(doc) {
    var d = doc.data ? doc.data() : doc;
    d = d || {};
    var meta = aristaMeta(d.tipoArista);
    return {
      id: doc.id || d.id || "",
      cuentaUid: d.cuentaUid || "",
      contextoTipo: d.contextoTipo || "perfil",
      contextoId: d.contextoId || "",
      direccion: d.direccion || "recibida",
      estado: d.estado || "pendiente",
      tipoArista: d.tipoArista || "colaboracion",
      tipoAristaLabel: d.tipoAristaLabel || meta.label,
      tipoAristaEmoji: meta.emoji,
      tipoEntidadOrigen: d.tipoEntidadOrigen || "perfil",
      tipoEntidadDestino: d.tipoEntidadDestino || "perfil",
      contraparteId: d.contraparteId || "",
      contraparteNombre: d.contraparteNombre || d.nombre || "Contacto",
      contraparteCategoria: d.contraparteCategoria || d.categoria || "",
      contraparteCiudad: d.contraparteCiudad || d.ciudad || "",
      contraparteEstado: d.contraparteEstado || d.estadoGeo || "",
      contraparteImg: d.contraparteImg || d.img || "",
      contraparteVerificado: !!d.contraparteVerificado,
      mensaje: d.mensaje || d.texto || "",
      propuesta: d.propuesta || "",
      leido: d.leido === true,
      bloqueado: d.bloqueado === true || d.estado === "bloqueada",
      creadoEn: d.creadoEn || null,
      hora: formatHora(d.creadoEn),
    };
  }

  function filterByContexto(items, filter) {
    if (!filter || !filter.contextoId) return [];
    return (items || []).filter(function (s) {
      return s.contextoTipo === filter.contextoTipo && s.contextoId === filter.contextoId;
    });
  }

  function filtrarTab(tab, items) {
    items = items || [];
    if (tab === "recibidas") {
      return items.filter(function (s) {
        return s.direccion === "recibida" && s.estado === "pendiente";
      });
    }
    if (tab === "enviadas") return items.filter(function (s) { return s.direccion === "enviada"; });
    if (tab === "socios") return items.filter(function (s) { return s.estado === "aceptada"; });
    if (tab === "pendientes") return items.filter(function (s) { return s.estado === "pendiente"; });
    if (tab === "bloqueados") {
      return items.filter(function (s) {
        return s.estado === "bloqueada" || (s.estado === "rechazada" && s.bloqueado);
      });
    }
    return items;
  }

  function stats(items) {
    items = items || [];
    return {
      pendientes: items.filter(function (s) { return s.estado === "pendiente"; }).length,
      recibidasPendientes: items.filter(function (s) {
        return s.direccion === "recibida" && s.estado === "pendiente";
      }).length,
      enviadas: items.filter(function (s) { return s.direccion === "enviada"; }).length,
      socios: items.filter(function (s) { return s.estado === "aceptada"; }).length,
      bloqueados: items.filter(function (s) {
        return s.estado === "bloqueada" || (s.estado === "rechazada" && s.bloqueado);
      }).length,
    };
  }

  function aggregatePendingMaps(items) {
    var perfil = {};
    var banner = {};
    (items || []).forEach(function (s) {
      if (s.estado !== "pendiente" || s.direccion !== "recibida") return;
      var id = s.contextoId;
      if (!id) return;
      if (s.contextoTipo === "banner") banner[id] = (banner[id] || 0) + 1;
      else if (s.contextoTipo === "perfil") perfil[id] = (perfil[id] || 0) + 1;
    });
    return { perfil: perfil, banner: banner };
  }

  function computeMockPendingMaps() {
    return aggregatePendingMaps(MOCK_SOLICITUDES);
  }

  function totalPendingFromMaps(maps) {
    maps = maps || {};
    var total = 0;
    Object.values(maps.perfil || {}).forEach(function (n) { total += Number(n) || 0; });
    Object.values(maps.banner || {}).forEach(function (n) { total += Number(n) || 0; });
    return total;
  }

  function mockList(filter) {
    return filterByContexto(MOCK_SOLICITUDES, filter).map(normalizar);
  }

  async function listar(filter, tab) {
    filter = normalizeFilter(filter);
    if (!filter.contextoId) return { items: [], stats: stats([]) };

    if (isPreviewMode() || !auth() || !auth().currentUser) {
      var mock = mockList(filter);
      var filtered = filtrarTab(tab, mock);
      filtered.sort(function (a, b) {
        var ta = a.creadoEn instanceof Date ? a.creadoEn.getTime() : Number(a.creadoEn) || 0;
        var tb = b.creadoEn instanceof Date ? b.creadoEn.getTime() : Number(b.creadoEn) || 0;
        return tb - ta;
      });
      return { items: filtered, stats: stats(mock), all: mock };
    }

    var user = auth().currentUser;
    var firestore = db();
    if (!firestore || !user) return { items: [], stats: stats([]) };

    try {
      var snap = await firestore
        .collection("usuarios")
        .doc(user.uid)
        .collection("solicitudes_negocio")
        .where("contextoTipo", "==", filter.contextoTipo)
        .where("contextoId", "==", filter.contextoId)
        .orderBy("creadoEn", "desc")
        .limit(64)
        .get();
      var all = snap.docs.map(function (d) {
        return normalizar(Object.assign({ id: d.id }, d.data()));
      });
      var rows = filtrarTab(tab, all);
      return { items: rows, stats: stats(all), all: all };
    } catch (err) {
      console.warn("[DashSolicitudes] listar", err);
      if (isPreviewMode()) {
        var fallback = mockList(filter);
        return {
          items: filtrarTab(tab, fallback),
          stats: stats(fallback),
          all: fallback,
        };
      }
      return { items: [], stats: stats([]), all: [] };
    }
  }

  function findMock(id) {
    return MOCK_SOLICITUDES.find(function (s) { return s.id === id; });
  }

  async function actualizarEstado(id, patch) {
    if (isPreviewMode() || !auth() || !auth().currentUser) {
      var m = findMock(id);
      if (m) Object.assign(m, patch);
      return;
    }
    var user = auth().currentUser;
    var firestore = db();
    if (!firestore || !user || !id) return;
    await firestore
      .collection("usuarios")
      .doc(user.uid)
      .collection("solicitudes_negocio")
      .doc(id)
      .update(Object.assign({}, patch, { actualizadoEn: ts() }));
  }

  async function aceptar(id) {
    await actualizarEstado(id, { estado: "aceptada", leido: true });
  }

  async function rechazar(id) {
    await actualizarEstado(id, { estado: "rechazada", leido: true });
  }

  async function bloquear(id) {
    await actualizarEstado(id, { estado: "bloqueada", bloqueado: true, leido: true });
  }

  async function marcarLeidas(ids) {
    ids = ids || [];
    if (!ids.length) return;
    if (isPreviewMode() || !auth() || !auth().currentUser) {
      ids.forEach(function (id) {
        var m = findMock(id);
        if (m) m.leido = true;
      });
      return;
    }
    var user = auth().currentUser;
    var firestore = db();
    if (!firestore || !user) return;
    var batch = firestore.batch();
    ids.forEach(function (id) {
      var ref = firestore.collection("usuarios").doc(user.uid).collection("solicitudes_negocio").doc(id);
      batch.update(ref, { leido: true, actualizadoEn: ts() });
    });
    await batch.commit();
  }

  async function getAllPendingCountsByContexto(cuentaUid) {
    if (isPreviewMode() || !auth() || !auth().currentUser) {
      return computeMockPendingMaps();
    }
    var user = auth().currentUser;
    cuentaUid = String(cuentaUid || user.uid);
    var firestore = db();
    if (!firestore) return { perfil: {}, banner: {} };
    try {
      var snap = await firestore
        .collection("usuarios")
        .doc(cuentaUid)
        .collection("solicitudes_negocio")
        .where("estado", "==", "pendiente")
        .where("direccion", "==", "recibida")
        .limit(500)
        .get();
      return aggregatePendingMaps(snap.docs.map(function (d) {
        return normalizar(Object.assign({ id: d.id }, d.data()));
      }));
    } catch (err) {
      console.warn("[DashSolicitudes] pending counts", err);
      return isPreviewMode() ? computeMockPendingMaps() : { perfil: {}, banner: {} };
    }
  }

  function subscribePendingRail(cuentaUid, onChange) {
    var firestore = db();
    if (!firestore || typeof onChange !== "function") return function () {};
    var user = auth() && auth().currentUser;
    if (!user && !isPreviewMode()) return function () {};
    cuentaUid = String(cuentaUid || (user && user.uid) || "");

    if (isPreviewMode() || !user) {
      onChange(computeMockPendingMaps());
      return function () {};
    }

    return firestore
      .collection("usuarios")
      .doc(cuentaUid)
      .collection("solicitudes_negocio")
      .where("estado", "==", "pendiente")
      .where("direccion", "==", "recibida")
      .limit(500)
      .onSnapshot(
        function (snap) {
          onChange(aggregatePendingMaps(snap.docs.map(function (d) {
            return normalizar(Object.assign({ id: d.id }, d.data()));
          })));
        },
        function (err) {
          console.warn("[DashSolicitudes] subscribePendingRail", err);
          onChange({ perfil: {}, banner: {} });
        }
      );
  }

  function contextoLabel(filter) {
    filter = normalizeFilter(filter);
    if (!filter.contextoId) return "";
    if (filter.contextoTipo === "banner") return "Banner · " + filter.contextoId;
    if (filter.contextoTipo === "cuenta") return "Cuenta";
    return "Perfil · " + filter.contextoId;
  }

  global.DashSolicitudesNegocio = {
    TIPOS_ARISTA: TIPOS_ARISTA,
    MOCK_SOLICITUDES: MOCK_SOLICITUDES,
    normalizeFilter: normalizeFilter,
    listar: listar,
    filtrarTab: filtrarTab,
    stats: stats,
    aceptar: aceptar,
    rechazar: rechazar,
    bloquear: bloquear,
    marcarLeidas: marcarLeidas,
    computeMockPendingMaps: computeMockPendingMaps,
    getAllPendingCountsByContexto: getAllPendingCountsByContexto,
    subscribePendingRail: subscribePendingRail,
    totalPendingFromMaps: totalPendingFromMaps,
    contextoLabel: contextoLabel,
    aristaMeta: aristaMeta,
    normalizar: normalizar,
  };
})(typeof window !== "undefined" ? window : globalThis);
