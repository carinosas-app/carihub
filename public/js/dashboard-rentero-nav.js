/**
 * Navegación dinámica — columna central del dashboard rentero.
 * Solo cambia el módulo visible; no navega a otras páginas.
 * Mapa nav vs rail: .cursor/rules/dashboard-mensajes-vision.mdc (TICKET-025, TICKET-026)
 */
(function (global) {
  const MODULES = {
    buscar: { title: "Buscar", subtitle: "Encuentra perfiles y negocios por categoría y ubicación" },
    inicio: { title: "Inicio", subtitle: "Vista previa de tu perfil y actividad reciente" },
    mensajes: { title: "Mensajes", subtitle: "Conversaciones con clientes y socios" },
    solicitudes: { title: "Solicitudes de negocio", subtitle: "Recibidas, enviadas y socios" },
    avisos: { title: "Avisos", subtitle: "Alertas de negocio, pagos y revisiones" },
    favoritos: { title: "Favoritos", subtitle: "Perfiles y negocios que guardaste" },
    estadisticas: { title: "Estadísticas", subtitle: "Vistas, contactos, favoritos y mensajes de tu perfil" },
    banners: { title: "Banners", subtitle: "Tus banners contratados, estado de pago y renovación" },
    estados: { title: "Red de socios", subtitle: "Tus anuncios y el feed de estados, lives y promos de socios" },
    "feed-red": { title: "Red de socios", subtitle: "Feed de actividad de tu red (ver módulo Anuncios / estados)" },
    publicaciones: { title: "Mis publicaciones", subtitle: "Anuncios, lives, promociones y eventos del perfil seleccionado" },
    anunciar: { title: "Anunciar", subtitle: "Canal perfil — visible en tu perfil público y resultados" },
    "anuncios-mensajes": {
      title: "Anuncios en mensajes",
      subtitle: "Promos solo visibles en el strip de Mensajes (no en perfil público)",
    },
    "anunciar-mensajes": {
      title: "Publicar en mensajes",
      subtitle: "Canal mensajes — solo strip de Mensajes, no perfil público",
    },
    lives: { title: "En vivos", subtitle: "Transmisiones promocionales de socios y amistades" },
    "transmitir-live": { title: "Transmitir en vivo", subtitle: "Transmisión en la columna central · laterales siguen activas" },
    "medios-contacto": { title: "Medios de contacto", subtitle: "WhatsApp, teléfono, redes y mensaje interno" },
    "info-publica": { title: "Información pública", subtitle: "Campos visibles en el directorio del perfil seleccionado" },
    tarjeta: { title: "Vista previa de resultados", subtitle: "Así aparece tu tarjeta en la pantalla de resultados" },
    "vista-perfil": { title: "Vista previa de perfil", subtitle: "Así se ve tu perfil publicado en Cariñosas" },
    "privacidad-mensajes": {
      title: "Privacidad de Mensajes",
      subtitle: "Lecturas, contacto, archivos y ubicación en Messenger",
    },
    configuracion: { title: "Configuración", subtitle: "Cuenta, apariencia, privacidad y pagos" },
    soporte: { title: "Soporte", subtitle: "Ayuda y contacto con administración" },
  };

  const MOCK_CONVERSACIONES = [
    { id: "c1", contextoTipo: "perfil", contextoId: "perfil-valentina", nombre: "Carlos M.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80", ultimo: "¿Tienes disponibilidad el viernes?", hora: "14:32", unread: 2 },
    { id: "c2", contextoTipo: "perfil", contextoId: "perfil-valentina", nombre: "Studio Velvet", avatar: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=80&q=80", ultimo: "Te enviamos la cotización del evento", hora: "Ayer", unread: 0 },
    { id: "c3", contextoTipo: "perfil", contextoId: "perfil-luna", nombre: "Luna M.", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&q=80", ultimo: "Gracias por aceptar la solicitud 🤝", hora: "Lun", unread: 1 },
    { id: "c4", contextoTipo: "banner", contextoId: "banner-spa", nombre: "Roberto H.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80", ultimo: "Vi tu banner, ¿sigue disponible?", hora: "11:05", unread: 1 },
    { id: "c5", contextoTipo: "banner", contextoId: "banner-spa", nombre: "María G.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80", ultimo: "Consulta por campaña en Guadalajara", hora: "Mar", unread: 0 },
    { id: "c6", contextoTipo: "banner", contextoId: "banner-home-mty", nombre: "Ana P.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80", ultimo: "Consulta por el banner home", hora: "10:20", unread: 1 },
  ];

  const MOCK_MENSAJES_BY_CONV = {
    c1: [
      { from: "them", text: "Hola Valentina, vi tu perfil en resultados.", time: "14:20" },
      { from: "me", text: "¡Hola! Gracias por escribir. ¿En qué puedo ayudarte?", time: "14:22" },
      { from: "them", text: "¿Tienes disponibilidad el viernes en la tarde?", time: "14:32" },
    ],
    c2: [
      { from: "them", text: "Hola, te compartimos la cotización del evento.", time: "Ayer 18:10" },
      { from: "me", text: "Recibido, lo reviso y te confirmo.", time: "Ayer 18:40" },
    ],
    c3: [
      { from: "them", text: "Gracias por aceptar la solicitud 🤝", time: "Lun 09:15" },
      { from: "me", text: "Con gusto, escríbeme cuando quieras coordinar.", time: "Lun 09:22" },
    ],
    c4: [
      { from: "them", text: "Vi tu banner en home, ¿sigue disponible?", time: "11:05" },
      { from: "me", text: "Sí, escríbeme por aquí y te paso detalles.", time: "11:18" },
    ],
    c5: [
      { from: "them", text: "Consulta por el destacado en resultados.", time: "Mar 16:40" },
    ],
    c6: [
      { from: "them", text: "Vi tu banner en home, ¿tienes disponibilidad?", time: "10:20" },
      { from: "me", text: "Sí, escríbeme los detalles.", time: "10:25" },
    ],
  };

  function getAvisosContextFilter() {
    if (global.DashContext && typeof DashContext.toMensajesFilter === "function") {
      var f = DashContext.toMensajesFilter();
      if (f && f.contextoId) return f;
    }
    if (
      global.DashAccountCapabilities &&
      global.DashAccountCapabilities.get &&
      DashAccountCapabilities.get().isHubAccount
    ) {
      var uid = "preview";
      try {
        if (global.firebase && global.firebase.auth && global.firebase.auth().currentUser) {
          uid = global.firebase.auth().currentUser.uid;
        }
      } catch (e) { /* ignore */ }
      return { contextoTipo: "cuenta", contextoId: uid };
    }
    return { contextoTipo: "perfil", contextoId: "perfil-valentina" };
  }

  function estadoLabel(estado) {
    var map = {
      pendiente: "Pendiente",
      aceptada: "Socio activo",
      rechazada: "Rechazada",
      bloqueada: "Bloqueada",
    };
    return map[estado] || estado;
  }

  function paintSolStats(stats, filter) {
    var el = document.getElementById("dashSolStats");
    var hint = document.getElementById("dashSolContextHint");
    if (hint && global.DashSolicitudesNegocio) {
      hint.textContent =
        "Solicitudes de " +
        DashSolicitudesNegocio.contextoLabel(filter) +
        " — conexiones tipadas (colaboración, alianza, patrocinio). No es red de amigos.";
    }
    if (!el || !stats) return;
    el.innerHTML =
      '<span class="dash-sol-stat is-hot"><b>' +
      stats.recibidasPendientes +
      "</b> por revisar</span>" +
      '<span class="dash-sol-stat"><b>' +
      stats.socios +
      "</b> socios</span>" +
      '<span class="dash-sol-stat"><b>' +
      stats.enviadas +
      "</b> enviadas</span>" +
      '<span class="dash-sol-stat"><b>' +
      stats.bloqueados +
      "</b> bloqueados</span>";
  }

  function solCardHtml(s, tab) {
    var unread = !s.leido && s.estado === "pendiente";
    var cls = ["sol-card"];
    if (unread) cls.push("is-unread");
    if (s.estado === "aceptada") cls.push("is-accepted");
    if (s.estado === "bloqueada" || s.bloqueado) cls.push("is-blocked");
    var check =
      tab === "recibidas"
        ? '<label class="sol-card__check"><input type="checkbox" class="dash-sol-pick" data-sol-id="' +
          esc(s.id) +
          '" aria-label="Seleccionar"></label>'
        : "";
    return (
      '<article class="' +
      cls.join(" ") +
      '" data-sol-id="' +
      esc(s.id) +
      '">' +
      check +
      '<div class="sol-card__ava">' +
      '<img src="' +
      esc(s.contraparteImg) +
      '" alt="" loading="lazy" decoding="async">' +
      (s.contraparteVerificado ? '<span class="sol-card__ok" aria-hidden="true">✓</span>' : "") +
      "</div>" +
      '<div class="sol-card__body">' +
      '<div class="sol-card__row"><b>' +
      esc(s.contraparteNombre) +
      "</b>" +
      '<span class="sol-card__tag">' +
      esc(s.contraparteCategoria) +
      "</span>" +
      '<span class="sol-card__tag sol-card__tag--arista">' +
      esc(s.tipoAristaEmoji + " " + s.tipoAristaLabel) +
      "</span>" +
      '<span class="sol-card__tag sol-card__tag--estado sol-card__tag--' +
      esc(s.estado) +
      '">' +
      esc(estadoLabel(s.estado)) +
      "</span></div>" +
      '<p class="sol-card__meta">' +
      esc([s.contraparteCiudad, s.contraparteEstado].filter(Boolean).join(" · ")) +
      "</p>" +
      (s.mensaje ? '<p class="sol-card__msg">' + esc(s.mensaje) + "</p>" : "") +
      (s.propuesta
        ? '<p class="sol-card__prop"><b>Propuesta:</b> ' + esc(s.propuesta) + "</p>"
        : "") +
      '<p class="sol-card__time">' +
      esc(s.hora) +
      (s.direccion === "enviada" ? " · Enviada" : " · Recibida") +
      "</p>" +
      '<div class="sol-card__actions">' +
      (tab === "recibidas" && s.estado === "pendiente"
        ? '<button type="button" class="btn" data-sol-action="aceptar" data-sol-id="' +
          esc(s.id) +
          '">Aceptar</button>' +
          '<button type="button" class="btn secondary" data-sol-action="rechazar" data-sol-id="' +
          esc(s.id) +
          '">Rechazar</button>' +
          '<button type="button" class="btn secondary" data-sol-action="bloquear" data-sol-id="' +
          esc(s.id) +
          '">Bloquear</button>'
        : "") +
      '<button type="button" class="btn secondary" data-goto-module="buscar">Ver en directorio</button>' +
      '<button type="button" class="btn secondary" data-goto-module="mensajes">Mensaje interno</button>' +
      "</div></div></article>"
    );
  }

  function bindSolicitudesActions(cont, tab) {
    if (!cont) return;
    var bulk = document.getElementById("dashSolBulk");
    if (bulk) bulk.classList.toggle("hidden", tab !== "recibidas");

    cont.querySelectorAll("[data-goto-module]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setModule(btn.dataset.gotoModule);
      });
    });

    cont.querySelectorAll("[data-sol-action]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-sol-id");
        var action = btn.getAttribute("data-sol-action");
        if (!id || !global.DashSolicitudesNegocio) return;
        btn.disabled = true;
        var p =
          action === "aceptar"
            ? DashSolicitudesNegocio.aceptar(id)
            : action === "rechazar"
              ? DashSolicitudesNegocio.rechazar(id)
              : DashSolicitudesNegocio.bloquear(id);
        p.then(function () {
          if (typeof global.refreshDashSolicitudesRail === "function") global.refreshDashSolicitudesRail();
          renderSolicitudes(activeSolTab);
        }).catch(function () {
          btn.disabled = false;
        });
      });
    });

    var selectAll = document.getElementById("dashSolSelectAll");
    if (selectAll && !selectAll.dataset.bound) {
      selectAll.dataset.bound = "1";
      selectAll.addEventListener("change", function () {
        cont.querySelectorAll(".dash-sol-pick").forEach(function (cb) {
          cb.checked = selectAll.checked;
        });
      });
    }

    var bulkAcc = document.getElementById("dashSolBulkAccept");
    var bulkRej = document.getElementById("dashSolBulkReject");
    if (bulkAcc && !bulkAcc.dataset.bound) {
      bulkAcc.dataset.bound = "1";
      bulkAcc.addEventListener("click", function () {
        var ids = [];
        cont.querySelectorAll(".dash-sol-pick:checked").forEach(function (cb) {
          if (cb.dataset.solId) ids.push(cb.dataset.solId);
        });
        if (!ids.length) return;
        Promise.all(ids.map(function (id) { return DashSolicitudesNegocio.aceptar(id); })).then(function () {
          if (typeof global.refreshDashSolicitudesRail === "function") global.refreshDashSolicitudesRail();
          renderSolicitudes(activeSolTab);
        });
      });
    }
    if (bulkRej && !bulkRej.dataset.bound) {
      bulkRej.dataset.bound = "1";
      bulkRej.addEventListener("click", function () {
        var ids = [];
        cont.querySelectorAll(".dash-sol-pick:checked").forEach(function (cb) {
          if (cb.dataset.solId) ids.push(cb.dataset.solId);
        });
        if (!ids.length) return;
        Promise.all(ids.map(function (id) { return DashSolicitudesNegocio.rechazar(id); })).then(function () {
          if (typeof global.refreshDashSolicitudesRail === "function") global.refreshDashSolicitudesRail();
          renderSolicitudes(activeSolTab);
        });
      });
    }
  }

  let activeSolTab = "recibidas";
  let buscarPage = 1;

  const MOCK_DIRECTORIO = [];

  const MOCK_PUBLICACIONES = [
    { titulo: "Disponible hoy en Monterrey", tipo: "estado", estado: "activo", fecha: "Hoy", vistas: 124, interacciones: 18 },
    { titulo: "Sesión en vivo · Q&A", tipo: "live", estado: "finalizado", fecha: "Ayer", vistas: 890, interacciones: 56 },
    { titulo: "Promo fin de semana", tipo: "promocion", estado: "programado", fecha: "Vie 20:00", vistas: 0, interacciones: 0 },
  ];

  const MOCK_BANNERS = [
    {
      id: "banner-home-lateral",
      nombre: "Banner Home lateral",
      slot: "Home · lateral derecho",
      categoria: "Cariñosas VIP",
      pais: "México",
      estado: "Nuevo León",
      ciudad: "Monterrey",
      img: "img/home/banners/ad-banner-pink-01.png",
      activo: true,
      vence: "18/07/2026",
      pago: "Pagado",
    },
    {
      id: "banner-resultados-top",
      nombre: "Destacado resultados",
      slot: "Resultados · superior",
      categoria: "Cariñosas VIP",
      pais: "México",
      estado: "Nuevo León",
      ciudad: "Monterrey",
      img: "img/home/banners/ad-banner-pink-02.png",
      activo: false,
      vence: "Pendiente",
      pago: "Por pagar",
    },
  ];

  const MOCK_FEED_POSTS = [
    {
      tipo: "Estado",
      nombre: "Studio Velvet",
      categoria: "Table Dance",
      ciudad: "San Pedro",
      hora: "Hace 3 h",
      texto: "Noche especial este viernes con DJ invitado y promoción 2x1 en copas.",
      img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=80",
      avatar: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=80&q=80",
      donar: false,
    },
    {
      tipo: "Live",
      nombre: "Andrea VIP",
      categoria: "Cariñosas VIP",
      ciudad: "Monterrey",
      hora: "Live promocional",
      texto: "Transmisión en vivo · Promoción fin de semana. Pregúntame lo que quieras.",
      img: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80",
      avatar: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=80&q=80",
      donar: true,
    },
    {
      tipo: "Promoción",
      nombre: "Spa Aurora",
      categoria: "Spa",
      ciudad: "Guadalajara",
      hora: "Ayer",
      texto: "Paquete relajación 20% de descuento solo esta semana. Reserva por WhatsApp.",
      img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80",
      avatar: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=80&q=80",
      donar: false,
    },
  ];

  function getSolicitudesContextFilter() {
    if (global.DashContext && typeof DashContext.toMensajesFilter === "function") {
      var f = DashContext.toMensajesFilter();
      if (f && f.contextoId) return f;
    }
    if (
      global.DashAccountCapabilities &&
      global.DashAccountCapabilities.get &&
      DashAccountCapabilities.get().isHubAccount
    ) {
      var uid = "preview";
      try {
        if (global.firebase && global.firebase.auth && global.firebase.auth().currentUser) {
          uid = global.firebase.auth().currentUser.uid;
        }
      } catch (e) { /* ignore */ }
      return { contextoTipo: "cuenta", contextoId: uid };
    }
    return { contextoTipo: "perfil", contextoId: "perfil-valentina" };
  }

  function avisoCardHtml(a) {
    var icon = global.DashAvisos ? DashAvisos.iconForTipo(a.tipo) : "✅";
    var unreadCls = a.leido ? "" : " aviso-card--unread";
    return (
      '<article class="aviso-card aviso-card--' +
      esc(a.tipo) +
      unreadCls +
      '" data-aviso-id="' +
      esc(a.id) +
      '"><span class="aviso-card__icon">' +
      icon +
      '</span><div><b>' +
      esc(a.titulo) +
      "</b><p>" +
      esc(a.texto) +
      '</p><small>' +
      esc(a.hora) +
      "</small></div></article>"
    );
  }

  const MOCK_LIVES_SOCIOS = [
    { nombre: "Andrea VIP", categoria: "Cariñosas VIP", ciudad: "Monterrey", viewers: 124, img: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80", avatar: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=80&q=80" },
    { nombre: "Studio Velvet", categoria: "Table Dance", ciudad: "San Pedro", viewers: 89, img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=80", avatar: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=80&q=80" },
    { nombre: "Luna M.", categoria: "Cariñosas", ciudad: "Monterrey", viewers: 56, img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&q=80" },
  ];

  let activeModule = "inicio";
  let activeConversacion = null;
  let activeConversacionUi = null;
  let activePubTab = "estados";
  let activeFeedTab = "todos";
  let activeMensajesScope = "perfil";

  function deriveMensajesScope() {
    if (global.DashContext) {
      var c = DashContext.get();
      if (c && c.tipo === "banner") return "banner";
    }
    return "perfil";
  }

  function getMensajesContextFilter() {
    if (global.DashContext && typeof DashContext.toMensajesFilter === "function") {
      return DashContext.toMensajesFilter();
    }
    return { contextoTipo: "perfil", contextoId: "perfil-valentina" };
  }

  function filterConversacionesPorContexto(conversaciones, filter) {
    if (!filter || !filter.contextoId) return [];
    return (conversaciones || []).filter(function (c) {
      return c.contextoTipo === filter.contextoTipo && c.contextoId === filter.contextoId;
    });
  }

  function ensureActiveConversacion(conversaciones) {
    if (!conversaciones.length) {
      activeConversacion = null;
      return;
    }
    if (!conversaciones.some(function (c) { return c.id === activeConversacion; })) {
      activeConversacion = conversaciones[0].id;
    }
  }

  function syncMensajesFromContext() {
    activeMensajesScope = deriveMensajesScope();
  }

  function mensajesContextLabel(filter) {
    if (!filter || !filter.contextoId) return "Selecciona un perfil o banner en la columna izquierda";
    if (filter.contextoTipo === "banner") {
      var banners = getBannersForContext();
      var banner = banners.find(function (b) { return b.id === filter.contextoId; });
      var label = "Conversaciones del banner · " + (banner && (banner.nombrePublico || banner.nombre) || filter.contextoId);
      if (global.DashBannerMensajes && DashBannerMensajes.isContextoBloqueado(filter)) {
        var tag = banner && DashBannerMensajes.etiquetaRail(banner);
        label += " · " + (tag || "Bloqueado");
      }
      return label;
    }
    var perfiles = global.getDashboardPerfilesForModule ? global.getDashboardPerfilesForModule() : [];
    var perfil = (perfiles || []).find(function (p) { return p.id === filter.contextoId || p.perfilId === filter.contextoId; });
    return "Conversaciones del perfil · " + (perfil && (perfil.nombrePublico || perfil.nombre) || filter.contextoId);
  }

  function syncNavActiveState(moduleId) {
    document.querySelectorAll("[data-module-nav]").forEach(function (btn) {
      var mod = btn.dataset.moduleNav;
      var scope = btn.dataset.msgScope || "";
      var on = false;
      if (moduleId === "mensajes") {
        if (scope === "banner") on = activeMensajesScope === "banner";
        else if (mod === "mensajes") on = activeMensajesScope !== "banner";
      } else {
        on = mod === moduleId;
      }
      btn.classList.toggle("on", on);
    });
  }

  function applyModuleTitles(id) {
    const titleEl = document.getElementById("dashModuleTitle");
    const subEl = document.getElementById("dashModuleSubtitle");
    if (!titleEl || !subEl) return;
    if (id === "mensajes" && activeMensajesScope === "banner") {
      titleEl.textContent = "Mensajes del banner";
      subEl.textContent =
        "Chats de quien escribió por tu banner — elige banner en la columna izquierda";
      return;
    }
    const meta = MODULES[id];
    if (!meta) return;
    titleEl.textContent = meta.title;
    subEl.textContent = meta.subtitle;
  }

  function denyPublisherModule(message) {
    if (global.alert) {
      global.alert(message || "Tu cuenta de acceso no incluye publicación. Crea un perfil publicador para usar este módulo.");
    }
  }

  function openBannerMensajes() {
    if (global.DashAccountCapabilities && !DashAccountCapabilities.can("banner")) {
      denyPublisherModule("Tu cuenta de acceso no incluye banners. Contrata un banner para ver mensajes por anuncio.");
      return;
    }
    if (typeof global.ensureDashBannerContext === "function") {
      var ok = global.ensureDashBannerContext();
      if (!ok) {
        if (global.alert) global.alert("Contrata o selecciona un banner en la columna izquierda.");
        return;
      }
    }
    activeMensajesScope = "banner";
    setModule("mensajes");
  }

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setModule(id) {
    if (id === "feed-red" || id === "directorio") {
      if (id === "directorio") {
        global._buscarEjecutado = true;
        id = "buscar";
      } else {
        id = "estados";
      }
    }
    if (!MODULES[id]) return;
    if (
      global.DashAccountCapabilities &&
      !DashAccountCapabilities.canOpenModule(id, {
        msgScope: id === "mensajes" ? activeMensajesScope : undefined,
      })
    ) {
      denyPublisherModule();
      if (activeModule !== "inicio") setModule("inicio");
      return;
    }
    activeModule = id;
    if (id === "mensajes") {
      activeMensajesScope = deriveMensajesScope();
      renderMensajes();
    } else {
      teardownMensajesSubs();
      if (mensajesExpanded) setMensajesExpanded(false);
      if (global.DashMensajesStrip) global.DashMensajesStrip.clear();
    }
    document.querySelectorAll(".dash-module").forEach(function (el) {
      el.classList.toggle("is-active", el.dataset.module === id);
    });
    syncNavActiveState(id);
    if (global.lucide && typeof global.lucide.createIcons === "function") {
      global.lucide.createIcons();
    }
    applyModuleTitles(id);
    const center = document.querySelector(".pro-main");
    if (center) center.scrollTop = 0;
    if (id === "buscar") renderBuscar();
    if (id === "lives") renderLivesSocios();
    if (id === "favoritos") renderFavoritos();
    if (id === "publicaciones") renderPublicacionesAdmin(activePubTab);
    if (id === "anuncios-mensajes") renderAnunciosMensajesAdmin();
    if (id === "estados") renderFeedPosts(activeFeedTab);
    if (id === "info-publica" && typeof global.refreshDashInfoPublica === "function") {
      global.refreshDashInfoPublica();
    }
    if (id === "medios-contacto" && typeof global.refreshDashMediosContacto === "function") {
      global.refreshDashMediosContacto();
    }
    if (id === "privacidad-mensajes" && typeof global.refreshDashPrivacidadMensajes === "function") {
      global.refreshDashPrivacidadMensajes();
    }
    if (id === "avisos") renderAvisos();
    if (id === "banners") renderBanners();
    if (id === "solicitudes") renderSolicitudes(activeSolTab);
    if (id === "vista-perfil" && typeof global.refrescarVistaPerfilModulo === "function") {
      global.refrescarVistaPerfilModulo();
    }
    document.dispatchEvent(new CustomEvent("dash:module-change", { detail: { module: id } }));
  }

  function leerFiltrosBuscar() {
    const cat = document.getElementById("dashFiltroCategoria");
    const pais = document.getElementById("dashFiltroPais");
    const estado = document.getElementById("dashFiltroEstado");
    const ciudad = document.getElementById("dashFiltroCiudad");
    return {
      categoria: cat ? cat.value : "Todas",
      pais: pais ? pais.value : "México",
      estado: estado ? estado.value : "Todos",
      ciudad: ciudad ? ciudad.value : "Todas",
    };
  }

  function filtrarDirectorio(f) {
    if (global.DashBuscar && global.DashBuscar.MOCK_DIRECTORIO) {
      return global.DashBuscar.MOCK_DIRECTORIO.filter(function (d) {
        if (f.categoria && f.categoria !== "Todas" && d.categoria.toLowerCase() !== f.categoria.toLowerCase()) return false;
        if (f.pais && d.pais !== f.pais) return false;
        if (f.estado && f.estado !== "Todos" && d.estado !== f.estado) return false;
        if (f.ciudad && f.ciudad !== "Todas" && d.ciudad !== f.ciudad) return false;
        return true;
      });
    }
    return [];
  }

  function renderTarjetasBuscar(cont, items, f, meta) {
    if (!cont) return;
    meta = meta || {};
    const hint = document.getElementById("dashBuscarHint");
    const pagEl = document.getElementById("dashBuscarPagination");
    const partes = [];
    if (f.categoria && f.categoria !== "Todas") partes.push(f.categoria);
    if (f.pais) partes.push(f.pais);
    if (f.estado && f.estado !== "Todos") partes.push(f.estado);
    if (f.ciudad && f.ciudad !== "Todas") partes.push(f.ciudad);
    if (hint) {
      if (meta.loading) {
        hint.textContent = "Buscando en el directorio público…";
      } else if (meta.error) {
        hint.textContent = "No se pudo cargar el directorio. Mostrando datos de demo.";
      } else if (meta.total > 0) {
        hint.textContent =
          meta.total +
          " resultado(s) · página " +
          meta.page +
          " de " +
          meta.pages +
          (meta.source === "mock" ? " · preview" : "") +
          (partes.length ? " · " + partes.join(" · ") : "");
      } else {
        hint.textContent = "Sin resultados para " + (partes.join(" · ") || "estos filtros") + ".";
      }
    }
    if (pagEl) {
      if (!meta.loading && meta.total > 0) {
        pagEl.classList.remove("hidden");
        pagEl.innerHTML =
          '<button type="button" class="btn secondary btn--sm" data-buscar-page="prev"' +
          (meta.hasPrev ? "" : " disabled") +
          ">Anterior</button>" +
          '<span class="dash-buscar-pagination__info">Página ' +
          meta.page +
          " / " +
          meta.pages +
          "</span>" +
          '<button type="button" class="btn secondary btn--sm" data-buscar-page="next"' +
          (meta.hasNext ? "" : " disabled") +
          ">Siguiente</button>";
        pagEl.querySelectorAll("[data-buscar-page]").forEach(function (btn) {
          btn.addEventListener("click", function () {
            if (btn.disabled) return;
            var dir = btn.getAttribute("data-buscar-page");
            if (dir === "prev" && meta.hasPrev) buscarPage = Math.max(1, meta.page - 1);
            if (dir === "next" && meta.hasNext) buscarPage = meta.page + 1;
            renderBuscar(true, false);
          });
        });
      } else {
        pagEl.classList.add("hidden");
        pagEl.innerHTML = "";
      }
    }
    cont.innerHTML = items.length
      ? items
          .map(function (d) {
            var url = d.url || "perfil-publico.html?id=" + encodeURIComponent(d.id || "");
            return (
              '<article class="dir-card" data-perfil-id="' +
              esc(d.id || d.perfilId || "") +
              '">' +
              '<img src="' +
              esc(d.img || d.fotoURL || "") +
              '" alt="" loading="lazy" decoding="async">' +
              "<div><b>" +
              esc(d.nombre) +
              (d.verificado ? ' <span class="dir-verified">✓</span>' : "") +
              "</b><p>" +
              esc(d.categoria) +
              " · " +
              esc(d.ciudad) +
              ", " +
              esc(d.estado) +
              "</p>" +
              (d.tagline ? "<p class=\"dir-card__tag\">" + esc(d.tagline) + "</p>" : "") +
              (d.precio ? "<p class=\"dir-card__price\">Desde " + esc(d.precio) + "</p>" : "") +
              '<div class="dir-card__actions">' +
              '<a class="btn secondary" href="' +
              esc(url) +
              '" target="_blank" rel="noopener">Ver perfil</a>' +
              '<button type="button" class="btn secondary" data-buscar-solicitud="' +
              esc(d.id || "") +
              '">Solicitud</button>' +
              '<button type="button" class="btn secondary" data-goto-module="mensajes">Mensaje</button>' +
              "</div></div></article>"
            );
          })
          .join("")
      : meta.loading
        ? '<p class="dash-hint dash-hint--compact">Cargando resultados…</p>'
        : '<p class="dash-empty">No hay resultados con esos filtros. Prueba otra categoría o ubicación.</p>';
    cont.querySelectorAll("[data-goto-module]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setModule(btn.dataset.gotoModule);
      });
    });
    cont.querySelectorAll("[data-buscar-solicitud]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setModule("solicitudes");
      });
    });
  }

  function renderBuscar(force, resetPage) {
    const cont = document.getElementById("buscarResults");
    const hint = document.getElementById("dashBuscarHint");
    if (!cont) return;
    if (!force && !global._buscarEjecutado) {
      cont.innerHTML = "";
      if (hint) hint.textContent = "Elige categoría y ubicación, luego presiona Buscar.";
      var pagIdle = document.getElementById("dashBuscarPagination");
      if (pagIdle) {
        pagIdle.classList.add("hidden");
        pagIdle.innerHTML = "";
      }
      return;
    }
    const f = leerFiltrosBuscar();
    if (global.geoRedFiltros) {
      global.geoRedFiltros.categoria = f.categoria;
      global.geoRedFiltros.pais = f.pais;
      global.geoRedFiltros.estado = f.estado;
      global.geoRedFiltros.ciudad = f.ciudad;
    }
    if (!global.DashBuscar) {
      renderTarjetasBuscar(cont, filtrarDirectorio(f), f, { page: 1, pages: 1, total: 0, source: "mock" });
      return;
    }
    if (resetPage) buscarPage = 1;
    renderTarjetasBuscar(cont, [], f, { loading: true, page: buscarPage, pages: 1, total: 0 });
    DashBuscar.buscar(f, { page: buscarPage, force: force }).then(function (res) {
      res = res || {};
      buscarPage = res.page || 1;
      renderTarjetasBuscar(cont, res.items || [], f, {
        page: res.page,
        pages: res.pages,
        total: res.total,
        hasPrev: res.hasPrev,
        hasNext: res.hasNext,
        source: res.source,
      });
    }).catch(function () {
      renderTarjetasBuscar(cont, filtrarDirectorio(f), f, {
        page: 1,
        pages: 1,
        total: 0,
        error: true,
        source: "mock",
      });
    });
  }

  function renderDirectorio() {
    global._buscarEjecutado = true;
    setModule("buscar");
  }

  function renderFeedPosts(filter) {
    if (filter) activeFeedTab = filter;
    const list = document.getElementById("estadosSociosFeed");
    if (!list) return;
    const posts = MOCK_FEED_POSTS.filter(function (p) {
      if (!filter || filter === "todos") return true;
      if (filter === "estado") return p.tipo === "Estado";
      if (filter === "live") return p.tipo === "Live";
      if (filter === "promoción" || filter === "promocion") return p.tipo === "Promoción";
      if (filter === "evento") return p.tipo === "Evento";
      if (filter === "servicio") return p.tipo === "Servicio";
      return p.tipo.toLowerCase() === filter;
    });
    list.innerHTML = posts
      .map(function (p) {
        const actions =
          '<div class="feed-post__actions">' +
          '<button type="button">👍 Me gusta</button>' +
          '<button type="button">💬 Comentar</button>' +
          '<button type="button">↗ Compartir</button>' +
          '<button type="button">🔖 Guardar</button>' +
          (p.donar ? '<button type="button" class="accent">🎁 Donar</button>' : "") +
          "</div>";
        return (
          '<article class="feed-post" data-feed-tipo="' +
          esc(p.tipo.toLowerCase()) +
          '">' +
          '<header class="feed-post__head">' +
          '<img src="' +
          esc(p.avatar) +
          '" alt="">' +
          "<div><b>" +
          esc(p.nombre) +
          "</b><span>" +
          esc(p.categoria) +
          " · " +
          esc(p.ciudad) +
          " · " +
          esc(p.hora) +
          '</span></div><span class="feed-post__tag">' +
          esc(p.tipo) +
          "</span></header>" +
          '<p class="feed-post__text">' +
          esc(p.texto) +
          "</p>" +
          '<div class="feed-post__media"><img src="' +
          esc(p.img) +
          '" alt=""></div>' +
          actions +
          "</article>"
        );
      })
      .join("");
  }

  let mensajesConvUnsub = null;
  let mensajesThreadUnsub = null;
  let mensajesExpanded = false;

  function setMensajesExpanded(on) {
    mensajesExpanded = !!on;
    const shell = document.querySelector(".dashboard-shell");
    if (shell) {
      shell.classList.toggle("mensajes-expanded", mensajesExpanded);
      if (mensajesExpanded) shell.classList.remove("center-expanded");
    }
    document.documentElement.classList.toggle("dash-mensajes-expanded", mensajesExpanded);

    const btnAmp = document.getElementById("btnAmpliarMensajes");
    const btnRestore = document.getElementById("btnRestaurarMensajes");
    const btnCol = document.getElementById("btnVerColumnas");
    const btnAmpVista = document.getElementById("btnAmpliarVista");
    if (btnAmp) {
      btnAmp.classList.toggle("hidden", mensajesExpanded);
      btnAmp.setAttribute("aria-pressed", mensajesExpanded ? "true" : "false");
    }
    if (btnRestore) {
      btnRestore.classList.toggle("hidden", !mensajesExpanded);
      btnRestore.setAttribute("aria-pressed", mensajesExpanded ? "true" : "false");
    }
    if (btnCol && btnAmpVista) {
      if (mensajesExpanded && activeModule === "mensajes") {
        btnCol.classList.remove("hidden");
        btnAmpVista.classList.add("hidden");
      } else if (!shell || !shell.classList.contains("center-expanded")) {
        btnCol.classList.add("hidden");
        btnAmpVista.classList.remove("hidden");
      }
    }
    window.dispatchEvent(new Event("resize"));
  }

  function initMensajesExpand() {
    document.getElementById("btnAmpliarMensajes")?.addEventListener("click", function () {
      if (activeModule !== "mensajes") setModule("mensajes");
      setMensajesExpanded(true);
    });
    document.getElementById("btnRestaurarMensajes")?.addEventListener("click", function () {
      setMensajesExpanded(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || !mensajesExpanded) return;
      setMensajesExpanded(false);
    });
  }
  let composerBound = false;

  /** Demo sin cuenta: solo `?preview=1`. Cuenta real → siempre Firestore vía DashboardMessenger. */
  function usesMockMensajes() {
    const user = global.CariHubAuth && global.CariHubAuth.currentUser;
    if (user) return false;
    return new URLSearchParams(global.location.search).get("preview") === "1";
  }

  function getBannersForContext() {
    if (typeof global.getDashboardBannersForModule === "function") {
      return global.getDashboardBannersForModule() || [];
    }
    return usesMockMensajes() ? MOCK_BANNERS : [];
  }

  function teardownMensajesSubs() {
    if (mensajesConvUnsub) {
      mensajesConvUnsub();
      mensajesConvUnsub = null;
    }
    if (mensajesThreadUnsub) {
      mensajesThreadUnsub();
      mensajesThreadUnsub = null;
    }
  }

  function getChatComposerEls() {
    return {
      input: document.getElementById("chatInput"),
      sendBtn: document.getElementById("chatSendBtn"),
    };
  }

  function setComposerEnabled(on) {
    const els = getChatComposerEls();
    if (els.input) els.input.disabled = !on;
    if (els.sendBtn) els.sendBtn.disabled = !on;
  }

  function bindChatComposerOnce() {
    if (composerBound) return;
    const els = getChatComposerEls();
    if (!els.sendBtn || !els.input) return;
    composerBound = true;
    const send = function () {
      if (usesMockMensajes() || !global.DashboardMessenger) return;
      var filter = getMensajesContextFilter();
      if (isBannerMensajesBloqueado(filter)) return;
      const texto = String(els.input.value || "").trim();
      if (!texto || !activeConversacion) return;
      els.sendBtn.disabled = true;
      DashboardMessenger.sendMensaje(activeConversacion, texto)
        .then(function () {
          els.input.value = "";
          if (typeof global.refreshDashUnreadRail === "function") global.refreshDashUnreadRail();
        })
        .catch(function (err) {
          console.warn("[Mensajes] send:", err);
          if (global.alert) global.alert("No se pudo enviar el mensaje.");
        })
        .finally(function () {
          setComposerEnabled(true);
        });
    };
    els.sendBtn.addEventListener("click", send);
    els.input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        send();
      }
    });
  }

  function paintConversacionesList(conversaciones) {
    clearChatBannerLock();
    const list = document.getElementById("chatConvList");
    if (!list) return;
    list.innerHTML = conversaciones
      .map(function (c) {
        return (
          '<button type="button" class="chat-conv' +
          (c.id === activeConversacion ? " on" : "") +
          '" data-chat-id="' +
          esc(c.id) +
          '">' +
          '<img src="' +
          esc(c.avatar || "") +
          '" alt="">' +
          '<div class="chat-conv__body"><b>' +
          esc(c.nombre) +
          "</b><p>" +
          esc(c.ultimo) +
          '</p></div><span class="chat-conv__meta">' +
          esc(c.hora) +
          (c.unread ? '<span class="chat-conv__badge">' + c.unread + "</span>" : "") +
          "</span></button>"
        );
      })
      .join("");
    list.querySelectorAll("[data-chat-id]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeConversacion = btn.dataset.chatId;
        activeConversacionUi = conversaciones.find(function (c) {
          return c.id === activeConversacion;
        });
        renderMensajes();
      });
    });
  }

  function subscribeMensajesThread(conv, cuentaUid) {
    if (mensajesThreadUnsub) {
      mensajesThreadUnsub();
      mensajesThreadUnsub = null;
    }
    if (!activeConversacion || !global.DashboardMessenger) return;
    activeConversacionUi = conv || activeConversacionUi;
    var otroUid = otroUidFromUiConv(conv, cuentaUid);
    if (otroUid) DashboardMessenger.loadPrivacidadMensajes(otroUid);
    mensajesThreadUnsub = DashboardMessenger.subscribeMensajes(activeConversacion, function (rows) {
      if (activeModule !== "mensajes") return;
      var priv = DashboardMessenger.getPrivacidadCached(otroUid);
      const bubbles = rows.map(function (m) {
        return DashboardMessenger.mensajeToUiBubble(m, cuentaUid, {
          otroUid: otroUid,
          privacidadOtro: priv,
        });
      });
      paintThreadMessages(bubbles);
      var user = global.CariHubAuth && global.CariHubAuth.currentUser;
      if (user) aplicarEstadoBloqueoChat(conv, user.uid);
    });
    DashboardMessenger.markRead(activeConversacion, cuentaUid).then(function () {
      if (typeof global.refreshDashUnreadRail === "function") global.refreshDashUnreadRail();
    });
  }

  function abrirReporteChat() {
    if (usesMockMensajes()) {
      global.alert("Modo preview: el reporte se envía con tu cuenta real en producción.");
      return;
    }
    if (!activeConversacion) {
      global.alert("Selecciona una conversación para reportar.");
      return;
    }
    if (!global.CariHubMessengerReportesUI || !CariHubMessengerReportesUI.abrir) {
      global.alert("Reportes no disponibles.");
      return;
    }
    var conv = activeConversacionUi || {};
    document.getElementById("chatPlusMenu")?.classList.add("hidden");
    CariHubMessengerReportesUI.abrir({
      conversacionId: activeConversacion,
      contraparteNombre: conv.nombre || "contacto",
      contextoId: conv.contextoId || "",
    }).then(function () {
      global.alert("Reporte enviado. Nuestro equipo lo revisará en este contexto.");
    }).catch(function () { /* alert ya mostrado */ });
  }

  function aplicarEstadoBloqueoChat(conv, cuentaUid) {
    if (!conv || !global.CariHubMessengerBloqueos) {
      setComposerEnabled(!!activeConversacion);
      return;
    }
    var otroUid = otroUidFromUiConv(conv, cuentaUid);
    if (!otroUid) {
      setComposerEnabled(!!activeConversacion);
      return;
    }
    CariHubMessengerBloqueos.bloqueoEntre(cuentaUid, otroUid).then(function (bloqueado) {
      setComposerEnabled(!bloqueado && !!activeConversacion);
      var blockBtn = document.getElementById("chatBlockBtn");
      if (blockBtn) {
        return CariHubMessengerBloqueos.yoBloqueo(cuentaUid, otroUid).then(function (yo) {
          blockBtn.textContent = yo ? "✓ Desbloquear" : "🚫 Bloquear";
        });
      }
      if (bloqueado) {
        var thread = document.getElementById("chatThread");
        if (thread && !thread.querySelector(".chat-bloqueo-hint")) {
          thread.insertAdjacentHTML(
            "beforeend",
            '<p class="dash-hint dash-hint--compact chat-bloqueo-hint">Hay un bloqueo activo en este hilo. No se pueden enviar más mensajes.</p>'
          );
        }
      }
    });
  }

  function abrirBloqueoChat() {
    if (usesMockMensajes()) {
      global.alert("Modo preview: el bloqueo se gestiona con tu cuenta real en producción.");
      return;
    }
    if (!activeConversacion || !global.CariHubMessengerBloqueos) {
      global.alert("Selecciona una conversación.");
      return;
    }
    var user = global.CariHubAuth && global.CariHubAuth.currentUser;
    if (!user) return;
    var conv = activeConversacionUi || {};
    var otroUid = otroUidFromUiConv(conv, user.uid);
    if (!otroUid) return;
    document.getElementById("chatPlusMenu")?.classList.add("hidden");

    CariHubMessengerBloqueos.yoBloqueo(user.uid, otroUid).then(function (yo) {
      if (yo) {
        if (!global.confirm("¿Desbloquear a " + (conv.nombre || "este contacto") + "?")) return;
        return CariHubMessengerBloqueos.desbloquear(otroUid).then(function () {
          global.alert("Usuario desbloqueado.");
          aplicarEstadoBloqueoChat(conv, user.uid);
        });
      }
      if (
        !global.confirm(
          "¿Bloquear a " +
            (conv.nombre || "este contacto") +
            "? No podrán enviarte mensajes en Messenger."
        )
      ) {
        return;
      }
      return CariHubMessengerBloqueos.bloquear({ conversacionId: activeConversacion }).then(function () {
        global.alert("Usuario bloqueado.");
        aplicarEstadoBloqueoChat(conv, user.uid);
      });
    }).catch(function (err) {
      global.alert((err && err.message) || "No se pudo completar la acción.");
    });
  }

  function paintThreadHeader(conv) {
    const header = document.getElementById("chatThreadHeader");
    if (!header || !conv) return;
    header.innerHTML =
      '<img src="' +
      esc(conv.avatar || "") +
      '" alt=""><div><b>' +
      esc(conv.nombre) +
      "</b><small>" +
      esc(conv.ultimo) +
      "</small></div>";
  }

  function paintThreadMessages(mensajes) {
    const thread = document.getElementById("chatThread");
    if (!thread) return;
    thread.innerHTML = mensajes.length
      ? mensajes
          .map(function (m) {
            return (
              '<div class="chat-bubble chat-bubble--' +
              m.from +
              '"><p>' +
              esc(m.text) +
              '</p><div class="chat-bubble__meta">' +
              '<time>' +
              esc(m.time) +
              "</time>" +
              (m.status ? '<span class="chat-bubble__status">' + esc(m.status) + "</span>" : "") +
              "</div></div>"
            );
          })
          .join("")
      : '<p class="dash-empty">Sin mensajes en este hilo.</p>';
  }

  function otroUidFromUiConv(conv, cuentaUid) {
    if (!conv) return "";
    if (conv.visitanteUid && conv.visitanteUid !== cuentaUid) return conv.visitanteUid;
    if (conv.cuentaUid && conv.cuentaUid !== cuentaUid) return conv.cuentaUid;
    return conv.visitanteUid || "";
  }

  function isBannerMensajesBloqueado(filter) {
    if (!filter || filter.contextoTipo !== "banner" || !filter.contextoId) return false;
    if (!global.DashBannerMensajes) return false;
    var banner = DashBannerMensajes.resolve(filter.contextoId);
    return banner ? !DashBannerMensajes.accesible(banner) : false;
  }

  function setChatBannerLockVisible(on) {
    var layout = document.getElementById("chatLayout");
    var lock = document.getElementById("chatBannerLock");
    if (layout) layout.classList.toggle("chat-layout--locked", !!on);
    if (lock) lock.classList.toggle("hidden", !on);
  }

  function paintMensajesBannerBloqueado(filter) {
    teardownMensajesSubs();
    setComposerEnabled(false);
    if (global.DashMensajesStrip) global.DashMensajesStrip.clear();

    var banner = global.DashBannerMensajes ? DashBannerMensajes.resolve(filter.contextoId) : null;
    var snap = global.DashBannerMensajes && banner ? DashBannerMensajes.snapshot(banner) : null;
    var motivo = snap ? snap.motivo : global.DashBannerMensajes
      ? DashBannerMensajes.motivo(banner)
      : "Banner no vigente.";
    var nombre = snap ? snap.nombre : (banner && (banner.nombrePublico || banner.nombre)) || filter.contextoId || "Banner";
    var pago = snap ? snap.pago : global.DashBannerMensajes && banner ? DashBannerMensajes.estadoPago(banner) : "";
    var etiqueta = snap ? snap.etiqueta : "Bloqueado";

    setChatBannerLockVisible(true);

    var thumbEl = document.getElementById("chatBannerLockThumb");
    var badgeEl = document.getElementById("chatBannerLockBadge");
    var textEl = document.getElementById("chatBannerLockText");
    var metaEl = document.getElementById("chatBannerLockMeta");
    var renovarEl = document.getElementById("chatBannerLockRenovar");
    if (thumbEl && snap && snap.imagen) {
      thumbEl.src = snap.imagen;
      thumbEl.hidden = false;
    } else if (thumbEl) thumbEl.hidden = true;
    if (badgeEl) badgeEl.textContent = etiqueta;
    if (textEl) textEl.textContent = motivo;
    if (metaEl) {
      metaEl.textContent =
        nombre + (pago ? " · Pago: " + pago : "") + (snap && snap.slot ? " · " + snap.slot : "");
    }
    if (renovarEl && snap) {
      renovarEl.href = snap.renovarUrl;
      renovarEl.textContent =
        etiqueta === "Impago" || (pago && String(pago).toLowerCase().indexOf("pag") >= 0)
          ? "Pagar / renovar banner"
          : "Renovar campaña";
    } else if (renovarEl && global.DashBannerMensajes && banner) {
      renovarEl.href = DashBannerMensajes.renovarUrl(banner);
    }

    var list = document.getElementById("chatConvList");
    var thread = document.getElementById("chatThread");
    var header = document.getElementById("chatThreadHeader");
    if (list) list.innerHTML = "";
    if (header) {
      header.innerHTML =
        "<div><b>" + esc(nombre) + "</b><small>Chats bloqueados · " + esc(etiqueta) + "</small></div>";
    }
    if (thread) thread.innerHTML = "";
  }

  function clearChatBannerLock() {
    setChatBannerLockVisible(false);
  }

  function paintMensajesEmpty(filter, message) {
    clearChatBannerLock();
    const list = document.getElementById("chatConvList");
    const thread = document.getElementById("chatThread");
    const header = document.getElementById("chatThreadHeader");
    const label = mensajesContextLabel(filter);
    if (list) {
      list.innerHTML =
        '<p class="dash-empty">' + esc(label) + ". " + esc(message || "Sin conversaciones en este contexto.") + "</p>";
    }
    if (header) {
      header.innerHTML = "<div><b>Mensajes</b><small>" + esc(label) + "</small></div>";
    }
    if (thread) {
      thread.innerHTML =
        '<p class="dash-empty">' +
        esc(message || "Elige otro perfil o banner en la columna izquierda, o espera nuevos contactos.") +
        "</p>";
    }
    setComposerEnabled(false);
  }

  function renderMensajesMock(filter) {
    if (isBannerMensajesBloqueado(filter)) {
      paintMensajesBannerBloqueado(filter);
      return;
    }
    const conversaciones = filterConversacionesPorContexto(MOCK_CONVERSACIONES, filter);
    ensureActiveConversacion(conversaciones);
    if (!conversaciones.length) {
      paintMensajesEmpty(filter);
      return;
    }
    paintConversacionesList(conversaciones);
    const conv = conversaciones.find(function (c) {
      return c.id === activeConversacion;
    });
    activeConversacionUi = conv;
    paintThreadHeader(conv);
    paintThreadMessages(MOCK_MENSAJES_BY_CONV[activeConversacion] || []);
    setComposerEnabled(false);
  }

  function startMensajesRealtime(filter, cuentaUid) {
    teardownMensajesSubs();
    if (!global.DashboardMessenger || usesMockMensajes()) return;
    mensajesConvUnsub = DashboardMessenger.subscribeConversaciones(filter, function (rows) {
      if (activeModule !== "mensajes") return;
      const ui = rows.map(function (r) {
        return DashboardMessenger.toUiConversacion(r);
      });
      if (!ui.length) {
        activeConversacionUi = null;
        paintMensajesEmpty(filter);
        return;
      }
      ensureActiveConversacion(ui);
      paintConversacionesList(ui);
      const conv = ui.find(function (c) {
        return c.id === activeConversacion;
      });
      activeConversacionUi = conv;
      paintThreadHeader(conv);
      subscribeMensajesThread(conv, cuentaUid);
    });
  }

  async function renderMensajes() {
    const list = document.getElementById("chatConvList");
    const thread = document.getElementById("chatThread");
    if (!list || !thread) return;
    bindChatComposerOnce();
    syncMensajesFromContext();
    const filter = getMensajesContextFilter();
    const subEl = document.getElementById("dashModuleSubtitle");
    if (subEl && activeModule === "mensajes") {
      subEl.textContent = mensajesContextLabel(filter);
    }
    if (global.DashMensajesStrip) {
      if (isBannerMensajesBloqueado(filter)) {
        global.DashMensajesStrip.clear();
      } else {
        global.DashMensajesStrip.render(filter, {
          onOpenConversacion: function (convId) {
            activeConversacion = convId;
            if (activeModule === "mensajes") renderMensajes();
          },
        });
      }
    }

    if (isBannerMensajesBloqueado(filter)) {
      teardownMensajesSubs();
      paintMensajesBannerBloqueado(filter);
      return;
    }

    if (usesMockMensajes()) {
      teardownMensajesSubs();
      renderMensajesMock(filter);
      return;
    }

    const user = global.CariHubAuth && global.CariHubAuth.currentUser;
    if (!user || !global.DashboardMessenger) {
      teardownMensajesSubs();
      paintMensajesEmpty(
        filter,
        "Inicia sesión para ver tus conversaciones reales. Usa ?preview=1 para demo sin cuenta."
      );
      return;
    }

    if (!filter.contextoId) {
      teardownMensajesSubs();
      clearChatBannerLock();
      paintMensajesEmpty(filter, "Selecciona un perfil o banner en la columna izquierda.");
      return;
    }

    clearChatBannerLock();
    list.innerHTML = '<p class="dash-hint dash-hint--compact">Cargando conversaciones…</p>';
    setComposerEnabled(false);

    try {
      const conversaciones = await DashboardMessenger.listConversacionesUi(filter);
      if (!conversaciones.length) {
        teardownMensajesSubs();
        paintMensajesEmpty(filter);
        return;
      }
      ensureActiveConversacion(conversaciones);
      paintConversacionesList(conversaciones);
      const conv = conversaciones.find(function (c) {
        return c.id === activeConversacion;
      });
      activeConversacionUi = conv;
      paintThreadHeader(conv);
      var otroUid = otroUidFromUiConv(conv, user.uid);
      await DashboardMessenger.loadPrivacidadMensajes(otroUid);
      const mensajes = await DashboardMessenger.listMensajesUi(activeConversacion, { otroUid: otroUid });
      paintThreadMessages(mensajes);
      await DashboardMessenger.markRead(activeConversacion, user.uid);
      if (typeof global.refreshDashUnreadRail === "function") global.refreshDashUnreadRail();
      aplicarEstadoBloqueoChat(conv, user.uid);
      setComposerEnabled(true);
      startMensajesRealtime(filter, user.uid);
    } catch (e) {
      console.warn("[Mensajes] render:", e);
      paintMensajesEmpty(filter, "No se pudieron cargar las conversaciones.");
    }
  }

  function renderSolicitudes(tab) {
    const cont = document.getElementById("solicitudesList");
    if (!cont) return;
    activeSolTab = tab || activeSolTab || "recibidas";
    if (!global.DashSolicitudesNegocio) {
      cont.innerHTML = '<p class="dash-hint dash-hint--compact">Módulo de solicitudes no disponible.</p>';
      return;
    }
    var filter = getSolicitudesContextFilter();
    if (!filter.contextoId) {
      cont.innerHTML =
        '<div class="sol-empty"><b>Selecciona un perfil o banner</b><p>Usa la columna izquierda para ver solicitudes de ese contexto.</p></div>';
      paintSolStats({ pendientes: 0, recibidasPendientes: 0, enviadas: 0, socios: 0, bloqueados: 0 }, filter);
      return;
    }
    cont.innerHTML = '<p class="dash-hint dash-hint--compact">Cargando solicitudes…</p>';
    DashSolicitudesNegocio.listar(filter, activeSolTab).then(function (res) {
      res = res || { items: [], stats: {} };
      paintSolStats(res.stats, filter);
      if (!res.items.length) {
        var emptyMsg = {
          recibidas: "No tienes solicitudes entrantes pendientes en este contexto.",
          enviadas: "No has enviado solicitudes desde este perfil o banner.",
          socios: "Aún no tienes socios de negocio aquí. Acepta una solicitud recibida.",
          pendientes: "Sin solicitudes pendientes en este contexto.",
          bloqueados: "No hay contactos bloqueados en esta sección.",
        };
        cont.innerHTML =
          '<div class="sol-empty"><b>Sin resultados</b><p>' +
          esc(emptyMsg[activeSolTab] || "Sin solicitudes.") +
          "</p><button type=\"button\" class=\"btn secondary\" data-goto-module=\"buscar\">Buscar perfiles</button></div>";
        bindSolicitudesActions(cont, activeSolTab);
        return;
      }
      cont.innerHTML = res.items.map(function (s) { return solCardHtml(s, activeSolTab); }).join("");
      bindSolicitudesActions(cont, activeSolTab);
    }).catch(function () {
      cont.innerHTML = '<p class="dash-hint dash-hint--compact">No se pudieron cargar las solicitudes.</p>';
    });
  }

  function mockPublicacionesItems() {
    return MOCK_PUBLICACIONES.map(function (p, i) {
      return {
        id: "mock-pub-" + i,
        titulo: p.titulo,
        tipo: p.tipo,
        estado: p.estado,
        fecha: p.fecha,
        vistas: p.vistas,
        interacciones: p.interacciones,
        imgUrl: ""
      };
    });
  }

  function resolvePublicacionesContext() {
    if (typeof global.getDashboardPublicacionesContext === "function") {
      return global.getDashboardPublicacionesContext();
    }
    return { cuentaUid: null, perfilId: null };
  }

  function resolveAnunciosMensajesContext() {
    if (typeof global.getDashboardAnunciosMensajesContext === "function") {
      return global.getDashboardAnunciosMensajesContext();
    }
    if (global.DashContext) {
      return global.DashContext.toMensajesFilter(global.DashContext.get());
    }
    return { contextoTipo: "perfil", contextoId: null, cuentaUid: null };
  }

  async function renderAnunciosMensajesAdmin() {
    const cont = document.getElementById("anunciosMensajesAdminList");
    if (!cont) return;

    const preview = new URLSearchParams(global.location.search).get("preview") === "1";
    const ctx = resolveAnunciosMensajesContext();
    const user = global.CariHubAuth && global.CariHubAuth.currentUser;

    if (!ctx.contextoId) {
      cont.innerHTML =
        '<p class="dash-hint dash-hint--compact">Selecciona un perfil o banner en la columna izquierda para gestionar sus anuncios en Mensajes.</p>';
      return;
    }

    cont.innerHTML = '<p class="dash-hint dash-hint--compact">Cargando anuncios en mensajes…</p>';

    let items = [];
    try {
      if (global.DashAnunciosMensajes && (user || preview)) {
        items = await DashAnunciosMensajes.listarAdmin({
          contextoTipo: ctx.contextoTipo,
          contextoId: ctx.contextoId,
        });
      }
    } catch (e) {
      cont.innerHTML = '<p class="dash-hint dash-hint--compact">No se pudieron cargar los anuncios.</p>';
      return;
    }

    const activos = items.filter(function (a) {
      return a.activo;
    });
    const ctxLabel =
      ctx.contextoTipo === "banner"
        ? "banner " + ctx.contextoId
        : "perfil " + ctx.contextoId;

    if (!activos.length) {
      cont.innerHTML =
        '<div class="dash-hint dash-hint--compact"><p>Sin anuncios activos en Mensajes para este ' +
        esc(ctxLabel) +
        '.</p><p><button type="button" class="btn secondary" data-goto-module="anunciar-mensajes">Publicar en mensajes</button></p></div>';
      cont.querySelectorAll("[data-goto-module]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          setModule(btn.dataset.gotoModule);
        });
      });
      return;
    }

    cont.innerHTML = activos
      .map(function (a) {
        const thumb = a.imgUrl
          ? '<img class="pub-admin-card__thumb-img" src="' + esc(a.imgUrl) + '" alt="">'
          : '<div class="pub-admin-card__thumb">💬</div>';
        return (
          '<article class="pub-admin-card" data-msg-anuncio-id="' +
          esc(a.id) +
          '">' +
          thumb +
          "<div><b>" +
          esc(a.titulo) +
          "</b><p><span class=\"badge ok\">Canal mensajes</span> · " +
          esc(a.fecha) +
          "</p><p>" +
          esc(a.subtitulo || "Sin descripción") +
          '</p><div class="pub-admin-card__actions">' +
          '<button type="button" class="btn secondary" data-goto-module="mensajes">Ver en Mensajes</button>' +
          '<button type="button" class="btn secondary" data-msg-anuncio-off="' +
          esc(a.id) +
          '">Quitar</button>' +
          "</div></div></article>"
        );
      })
      .join("");

    cont.querySelectorAll("[data-goto-module]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setModule(btn.dataset.gotoModule);
      });
    });
    cont.querySelectorAll("[data-msg-anuncio-off]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const aid = btn.getAttribute("data-msg-anuncio-off");
        if (!aid || !global.DashAnunciosMensajes) return;
        DashAnunciosMensajes.desactivar(aid).then(function () {
          renderAnunciosMensajesAdmin();
          if (typeof global.refrescarAnunciosMensajes === "function") {
            global.refrescarAnunciosMensajes();
          }
        });
      });
    });
  }

  async function renderPublicacionesAdmin(tab) {
    if (tab) activePubTab = tab;
    const cont = document.getElementById("pubAdminList");
    if (!cont) return;

    const preview = new URLSearchParams(global.location.search).get("preview") === "1";
    const ctx = resolvePublicacionesContext();
    const user = global.CariHubAuth && global.CariHubAuth.currentUser;

    if (!ctx.perfilId) {
      cont.innerHTML =
        '<p class="dash-hint dash-hint--compact">Selecciona un perfil en la columna izquierda para ver sus publicaciones.</p>';
      return;
    }

    cont.innerHTML = '<p class="dash-hint dash-hint--compact">Cargando publicaciones…</p>';

    let items = [];
    try {
      if (global.DashPublicaciones && user && ctx.cuentaUid && ctx.perfilId) {
        items = await DashPublicaciones.listar(ctx.cuentaUid, ctx.perfilId);
      } else if (preview) {
        items = mockPublicacionesItems();
      }
    } catch (e) {
      cont.innerHTML = '<p class="dash-hint dash-hint--compact">No se pudieron cargar las publicaciones.</p>';
      return;
    }

    const filtered = global.DashPublicaciones
      ? DashPublicaciones.filtrarTab(activePubTab, items)
      : items;

    if (!filtered.length) {
      const hint = global.DashPublicaciones
        ? DashPublicaciones.emptyCopy(activePubTab)
        : "Sin publicaciones en esta sección.";
      cont.innerHTML =
        '<div class="dash-hint dash-hint--compact"><p>' +
        esc(hint) +
        '</p><p><button type="button" class="btn secondary" data-goto-module="anunciar">Anunciar</button></p></div>';
      cont.querySelectorAll("[data-goto-module]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          setModule(btn.dataset.gotoModule);
        });
      });
      return;
    }

    cont.innerHTML = filtered
      .map(function (p) {
        const badgeCls = p.estado === "activo" ? "ok" : p.estado === "programado" ? "warn" : "off";
        const thumb = p.imgUrl
          ? '<img class="pub-admin-card__thumb-img" src="' + esc(p.imgUrl) + '" alt="">'
          : '<div class="pub-admin-card__thumb">📷</div>';
        return (
          '<article class="pub-admin-card" data-pub-id="' +
          esc(p.id) +
          '">' +
          thumb +
          "<div><b>" +
          esc(p.titulo) +
          '</b><p><span class="badge ' +
          badgeCls +
          '">' +
          esc(p.estado) +
          "</span> · " +
          esc(p.tipo) +
          " · " +
          esc(p.fecha) +
          "</p><p>" +
          esc(String(p.vistas)) +
          " vistas · " +
          esc(String(p.interacciones)) +
          ' interacciones</p><div class="pub-admin-card__actions">' +
          '<button type="button" class="btn secondary" data-goto-module="anunciar">Editar</button>' +
          '<button type="button" class="btn secondary" data-pub-finalizar="' +
          esc(p.id) +
          '">Finalizar</button>' +
          '<button type="button" class="btn secondary" data-goto-module="transmitir-live">Renovar</button>' +
          "</div></div></article>"
        );
      })
      .join("");

    cont.querySelectorAll("[data-goto-module]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setModule(btn.dataset.gotoModule);
      });
    });
    cont.querySelectorAll("[data-pub-finalizar]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const pubId = btn.getAttribute("data-pub-finalizar");
        if (!pubId || pubId.indexOf("mock-") === 0 || !global.DashPublicaciones) return;
        DashPublicaciones.marcarFinalizada(pubId).then(function () {
          renderPublicacionesAdmin(activePubTab);
          if (typeof global.refrescarPublicacionesDashboard === "function") {
            global.refrescarPublicacionesDashboard();
          }
        });
      });
    });
  }

  function renderEstadosSocios() {
    renderFeedPosts(activeFeedTab || "todos");
  }

  function renderLivesSocios() {
    const list = document.getElementById("livesSociosFeed");
    const empty = document.getElementById("livesSociosEmpty");
    const badge = document.getElementById("navLiveBadge");
    if (!list) return;
    if (!MOCK_LIVES_SOCIOS.length) {
      list.innerHTML = "";
      if (empty) empty.classList.remove("hidden");
      if (badge) badge.textContent = "0";
      return;
    }
    if (empty) empty.classList.add("hidden");
    if (badge) badge.textContent = String(MOCK_LIVES_SOCIOS.length);
    list.innerHTML = MOCK_LIVES_SOCIOS.map(function (l) {
      return (
        '<article class="live-card">' +
        '<div class="live-card__media"><img src="' +
        esc(l.img) +
        '" alt=""><span class="live-card__badge">LIVE · Promo</span></div>' +
        '<div class="live-card__body"><img src="' +
        esc(l.avatar) +
        '" alt=""><div><b>' +
        esc(l.nombre) +
        "</b><p>" +
        esc(l.categoria) +
        " · " +
        esc(l.ciudad) +
        '</p></div><button type="button" class="btn secondary">Ver live</button></div></article>'
      );
    }).join("");
  }

  function renderAvisos() {
    const list = document.getElementById("avisosList");
    if (!list) return;
    if (!global.DashAvisos) {
      list.innerHTML = '<p class="dash-hint dash-hint--compact">Módulo de avisos no disponible.</p>';
      return;
    }
    var filter = getAvisosContextFilter();
    if (!filter.contextoId) {
      list.innerHTML = '<p class="dash-hint dash-hint--compact">Selecciona un perfil o banner en la columna izquierda.</p>';
      return;
    }
    list.innerHTML = '<p class="dash-hint dash-hint--compact">Cargando avisos…</p>';
    DashAvisos.listar(filter).then(function (items) {
      if (!items.length) {
        list.innerHTML =
          '<p class="dash-hint dash-hint--compact">Sin avisos para este ' +
          (filter.contextoTipo === "banner" ? "banner" : filter.contextoTipo === "cuenta" ? "cuenta" : "perfil") +
          ".</p>";
        return;
      }
      list.innerHTML = items.map(avisoCardHtml).join("");
      list.querySelectorAll(".aviso-card[data-aviso-id]").forEach(function (card) {
        card.addEventListener("click", function () {
          var id = card.getAttribute("data-aviso-id");
          if (!id || card.classList.contains("is-read")) return;
          DashAvisos.marcarLeido(id).then(function () {
            card.classList.remove("aviso-card--unread");
            card.classList.add("is-read");
            if (typeof global.refreshDashAvisosRail === "function") global.refreshDashAvisosRail();
          });
        });
      });
    }).catch(function () {
      list.innerHTML = '<p class="dash-hint dash-hint--compact">No se pudieron cargar los avisos.</p>';
    });
  }

  async function renderFavoritos() {
    const list = document.getElementById("favoritosList");
    if (!list) return;

    if (!global.CariHubFavoritos) {
      list.innerHTML = '<p class="dash-hint dash-hint--compact">Módulo de favoritos no disponible.</p>';
      return;
    }

    if (!CariHubFavoritos.cuentaReal()) {
      list.innerHTML =
        '<p class="dash-hint dash-hint--compact">Inicia sesión para ver tus favoritos. ' +
        '<a href="index.html?abrir=login&amp;intencion=favoritos">Entrar</a></p>';
      return;
    }

    list.innerHTML = '<p class="dash-hint dash-hint--compact">Cargando favoritos…</p>';

    try {
      const items = await CariHubFavoritos.listarFavoritos();
      if (!items.length) {
        list.innerHTML =
          '<div class="dash-hint dash-hint--compact">' +
          "<p><b>No tienes favoritos todavía.</b></p>" +
          "<p>Presiona el corazón en un perfil para guardarlo aquí.</p>" +
          '<p><a href="resultados.html">Explorar perfiles</a></p></div>';
        return;
      }

      list.innerHTML = items
        .map(function (f) {
          const img = f.fotoURL || "img/home/banners/ad-banner-pink-02.png";
          const perfilHref = "perfil-publico.html?id=" + encodeURIComponent(f.perfilId);
          const geo = [f.ciudad, f.estado].filter(Boolean).join(", ") || f.ciudad || "—";
          return (
            '<article class="dir-card" data-fav-id="' +
            esc(f.perfilId) +
            '"><img src="' +
            esc(img) +
            '" alt=""><div><b>' +
            esc(f.nombre || "Perfil") +
            "</b><p>" +
            esc(f.categoria || "Perfil") +
            " · " +
            esc(geo) +
            '</p><div class="dir-card__actions"><a class="btn secondary" href="' +
            esc(perfilHref) +
            '">Ver perfil</a><button type="button" class="btn secondary" data-quitar-fav="' +
            esc(f.perfilId) +
            '">Quitar</button></div></div></article>'
          );
        })
        .join("");

      list.querySelectorAll("[data-quitar-fav]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          const pid = btn.getAttribute("data-quitar-fav");
          if (!pid || !global.CariHubFavoritos) return;
          CariHubFavoritos.eliminarFavorito(pid).then(function () {
            renderFavoritos();
          });
        });
      });
    } catch (e) {
      list.innerHTML = '<p class="dash-hint dash-hint--compact">No se pudieron cargar favoritos.</p>';
    }
  }

  function renderBanners() {
    const cont = document.getElementById("bannersList");
    if (!cont) return;
    const items =
      typeof global.getDashboardBannersForModule === "function"
        ? global.getDashboardBannersForModule()
        : [];
    if (!items.length) {
      cont.innerHTML =
        '<p class="dash-hint dash-hint--compact">Sin banners contratados. ' +
        '<a href="registro-banner.html">Renta un banner</a></p>';
      return;
    }
    cont.innerHTML = items.map(function (b) {
      const accesible = global.DashBannerMensajes ? DashBannerMensajes.accesible(b) : true;
      const activo = b.estadoPublicacion && b.estadoPublicacion.publicoActivo;
      const slot = (b.publicidad && (b.publicidad.espacio || b.publicidad.pantalla)) || "";
      const vence = (b.plan && b.plan.fechaVencimiento) || (b.plan && b.plan.diasRestantes) || "—";
      const pago = (global.DashBannerMensajes && DashBannerMensajes.estadoPago(b)) ||
        (b.estadoPublicacion && b.estadoPublicacion.pago) || "—";
      const etiqueta = (b.estadoPublicacion && b.estadoPublicacion.etiqueta) || "pendiente";
      const bloqueo = !accesible && global.DashBannerMensajes ? DashBannerMensajes.etiquetaRail(b) : null;
      const renovarUrl = global.DashBannerMensajes ? DashBannerMensajes.renovarUrl(b) : "registro-banner.html";
      return (
        '<article class="banner-admin-card' +
        (!accesible ? " banner-admin-card--locked" : "") +
        '">' +
        "<div><b>" +
        esc(b.nombrePublico || b.nombre || "Banner") +
        "</b><p>" +
        esc(slot) +
        "</p><p>Vence: " +
        esc(String(vence)) +
        " · Pago: " +
        esc(String(pago)) +
        '</p><span class="badge ' +
        (activo && accesible ? "ok" : "warn") +
        '">' +
        esc(bloqueo || etiqueta) +
        '</span></div><div class="banner-admin-card__actions">' +
        (accesible
          ? '<button type="button" class="btn secondary" data-goto-module="mensajes">Mensajes</button>'
          : "") +
        '<a class="btn' +
        (accesible ? " secondary" : "") +
        '" href="' +
        esc(renovarUrl) +
        '">' +
        (accesible ? "Renovar" : "Pagar / renovar") +
        "</a>" +
        '<a class="btn secondary" href="registro-banner.html">Contratar nuevo</a>' +
        "</div></article>"
      );
    }).join("");
    cont.querySelectorAll("[data-goto-module]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setModule(btn.dataset.gotoModule);
      });
    });
  }

  function bindTabs(selector, onSelect) {
    document.querySelectorAll(selector).forEach(function (group) {
      group.querySelectorAll("[data-tab]").forEach(function (tab) {
        tab.addEventListener("click", function () {
          group.querySelectorAll("[data-tab]").forEach(function (t) {
            t.classList.remove("on");
          });
          tab.classList.add("on");
          if (onSelect) onSelect(tab.dataset.tab, group);
        });
      });
    });
  }

  function init() {
    if (global.lucide && typeof global.lucide.createIcons === "function") {
      global.lucide.createIcons();
    }
    document.querySelectorAll("[data-module-nav]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const mod = btn.dataset.moduleNav;
        if (mod === "cerrar-sesion") {
          document.dispatchEvent(new CustomEvent("dash:logout-request"));
          return;
        }
        if (mod === "mensajes" && btn.dataset.msgScope === "banner") {
          if (global.DashAccountCapabilities && !DashAccountCapabilities.can("banner")) {
            denyPublisherModule("Tu cuenta de acceso no incluye banners.");
            return;
          }
          openBannerMensajes();
          return;
        }
        if (mod === "mensajes") {
          activeMensajesScope = deriveMensajesScope();
        }
        setModule(mod);
      });
    });

    bindTabs("[data-feed-tabs]", function (tab) {
      renderFeedPosts(tab);
    });
    bindTabs("[data-sol-tabs]", function (tab) {
      renderSolicitudes(tab);
    });
    bindTabs("[data-pub-tabs]", function (tab) {
      renderPublicacionesAdmin(tab);
    });

    document.getElementById("chatPlusBtn")?.addEventListener("click", function () {
      document.getElementById("chatPlusMenu")?.classList.toggle("hidden");
    });
    document.getElementById("chatReportBtn")?.addEventListener("click", function () {
      abrirReporteChat();
    });
    document.getElementById("chatBlockBtn")?.addEventListener("click", function () {
      abrirBloqueoChat();
    });

    document.getElementById("dashBuscarForm")?.addEventListener("submit", function (e) {
      e.preventDefault();
      global._buscarEjecutado = true;
      renderBuscar(true, true);
    });

    document.querySelectorAll("[data-quick-module]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setModule(btn.dataset.quickModule);
      });
    });

    document.querySelectorAll("[data-goto-module]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setModule(btn.dataset.gotoModule);
      });
    });

    renderMensajes();
    renderSolicitudes("recibidas");
    renderEstadosSocios();
    renderLivesSocios();
    renderAvisos();
    renderFavoritos();
    renderPublicacionesAdmin(activePubTab);
    initMensajesExpand();
    setModule(activeModule);
  }

  global.DashModuleNav = {
    init,
    setModule,
    openBannerMensajes,
    syncMensajesFromContext,
    teardownMensajesSubs,
    getActive: function () {
      return activeModule;
    },
    renderEstadosSocios,
    renderLivesSocios,
    renderAvisos,
    getAvisosContextFilter,
    renderFavoritos,
    renderMensajes,
    renderSolicitudes,
    getSolicitudesContextFilter,
    renderBuscar,
    renderDirectorio,
    renderPublicacionesAdmin,
    renderAnunciosMensajesAdmin,
    setMensajesExpanded,
    isMensajesExpanded: function () {
      return mensajesExpanded;
    },
    usesMockMensajes: usesMockMensajes,
    MOCK_PUBLICACIONES,
    MOCK_BANNERS,
    MOCK_FEED_POSTS,
    MOCK_CONVERSACIONES,
    MOCK_DIRECTORIO,
    MOCK_LIVES_SOCIOS,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
