/**
 * Navegación dinámica — columna central del dashboard rentero.
 * Solo cambia el módulo visible; no navega a otras páginas.
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
    banners: { title: "Banners y destacados", subtitle: "Tus banners rentados y anuncios destacados" },
    estados: { title: "Anuncios", subtitle: "Tus anuncios y los de tu red de socios" },
    anunciar: { title: "Anunciar", subtitle: "Crea y publica tu anuncio con imagen y filtros" },
    lives: { title: "En vivos", subtitle: "Socios y amistades transmitiendo en vivo ahora" },
    "transmitir-live": { title: "Transmitir en vivo", subtitle: "Transmisión en la columna central · laterales siguen activas" },
    "medios-contacto": { title: "Medios de contacto", subtitle: "WhatsApp, teléfono, redes y mensaje interno" },
    tarjeta: { title: "Vista previa de resultados", subtitle: "Así aparece tu tarjeta en la pantalla de resultados" },
    "vista-perfil": { title: "Vista previa de perfil", subtitle: "Así se ve tu perfil publicado en Cariñosas" },
    configuracion: { title: "Configuración", subtitle: "Cuenta, apariencia, privacidad y pagos" },
    soporte: { title: "Soporte", subtitle: "Ayuda y contacto con administración" },
  };

  const MOCK_CONVERSACIONES = [
    { id: "c1", nombre: "Carlos M.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80", ultimo: "¿Tienes disponibilidad el viernes?", hora: "14:32", unread: 2 },
    { id: "c2", nombre: "Studio Velvet", avatar: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=80&q=80", ultimo: "Te enviamos la cotización del evento", hora: "Ayer", unread: 0 },
    { id: "c3", nombre: "Luna M.", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&q=80", ultimo: "Gracias por aceptar la solicitud 🤝", hora: "Lun", unread: 1 },
  ];

  const MOCK_MENSAJES = [
    { from: "them", text: "Hola Valentina, vi tu perfil en resultados.", time: "14:20" },
    { from: "me", text: "¡Hola! Gracias por escribir. ¿En qué puedo ayudarte?", time: "14:22" },
    { from: "them", text: "¿Tienes disponibilidad el viernes en la tarde?", time: "14:32" },
  ];

  const MOCK_SOLICITUDES = {
    recibidas: [
      { nombre: "Luna M.", categoria: "Escort", ciudad: "Monterrey", img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&q=80", tipo: "recibida" },
      { nombre: "Hotel Boutique", categoria: "Hospedaje", ciudad: "San Pedro", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80&q=80", tipo: "recibida" },
    ],
    enviadas: [
      { nombre: "Studio Velvet", categoria: "Table Dance", ciudad: "Monterrey", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=80&q=80", tipo: "enviada" },
    ],
    socios: [
      { nombre: "Andrea VIP", categoria: "Escort VIP", ciudad: "Monterrey", img: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=80&q=80", tipo: "socio" },
    ],
  };

  const MOCK_DIRECTORIO = [
    { nombre: "Club Velvet", categoria: "Antro", pais: "México", estado: "Nuevo León", ciudad: "Monterrey", verificado: true, img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=120&q=80" },
    { nombre: "Night Antro MTY", categoria: "Antro", pais: "México", estado: "Nuevo León", ciudad: "Monterrey", verificado: false, img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=120&q=80" },
    { nombre: "Andrea VIP", categoria: "Escort VIP", pais: "México", estado: "Nuevo León", ciudad: "Monterrey", verificado: true, img: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=120&q=80" },
    { nombre: "Luna M.", categoria: "Escort", pais: "México", estado: "Nuevo León", ciudad: "San Pedro", verificado: true, img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=120&q=80" },
    { nombre: "Studio Velvet", categoria: "Table Dance", pais: "México", estado: "Nuevo León", ciudad: "San Pedro", verificado: true, img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=120&q=80" },
    { nombre: "Spa Aurora", categoria: "Spa", pais: "México", estado: "Jalisco", ciudad: "Guadalajara", verificado: true, img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=120&q=80" },
    { nombre: "Club Velvet CDMX", categoria: "Antro", pais: "México", estado: "Ciudad de México", ciudad: "CDMX", verificado: false, img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=120&q=80" },
    { nombre: "Valentina", categoria: "Escort VIP", pais: "México", estado: "Nuevo León", ciudad: "Monterrey", verificado: true, img: "https://images.unsplash.com/photo-1512310604669-443f26c35f52?w=120&q=80" },
  ];

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
      categoria: "Escort VIP",
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
      categoria: "Escort VIP",
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
      categoria: "Escort VIP",
      ciudad: "Monterrey",
      hora: "En vivo ahora",
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

  const MOCK_AVISOS = [
    { tipo: "negocio", titulo: "Nueva solicitud de Luna M.", texto: "Quiere colaborar contigo en Monterrey.", hora: "Hace 1 h" },
    { tipo: "pago", titulo: "Renovación en 18 días", texto: "Tu plan VIP vence pronto.", hora: "Hoy" },
    { tipo: "revision", titulo: "Perfil aprobado", texto: "Tu última actualización ya está visible.", hora: "Ayer" },
    { tipo: "mensaje", titulo: "12 mensajes sin leer", texto: "Tienes conversaciones pendientes.", hora: "Ahora" },
    { tipo: "live", titulo: "Andrea VIP está en vivo", texto: "Una socia inició transmisión.", hora: "Hace 20 min" },
  ];

  const MOCK_FAVORITOS = [
    { nombre: "Studio Velvet", categoria: "Table Dance", ciudad: "San Pedro", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=120&q=80" },
    { nombre: "Spa Aurora", categoria: "Spa", ciudad: "Guadalajara", img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=120&q=80" },
  ];

  const MOCK_LIVES_SOCIOS = [
    { nombre: "Andrea VIP", categoria: "Escort VIP", ciudad: "Monterrey", viewers: 124, img: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80", avatar: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=80&q=80" },
    { nombre: "Studio Velvet", categoria: "Table Dance", ciudad: "San Pedro", viewers: 89, img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=80", avatar: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=80&q=80" },
    { nombre: "Luna M.", categoria: "Escort", ciudad: "Monterrey", viewers: 56, img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&q=80" },
  ];

  let activeModule = "inicio";
  let activeConversacion = MOCK_CONVERSACIONES[0].id;

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setModule(id) {
    if (!MODULES[id]) return;
    activeModule = id;
    document.querySelectorAll(".dash-module").forEach(function (el) {
      el.classList.toggle("is-active", el.dataset.module === id);
    });
    document.querySelectorAll("[data-module-nav]").forEach(function (btn) {
      btn.classList.toggle("on", btn.dataset.moduleNav === id);
    });
    if (global.lucide && typeof global.lucide.createIcons === "function") {
      global.lucide.createIcons();
    }
    const meta = MODULES[id];
    const titleEl = document.getElementById("dashModuleTitle");
    const subEl = document.getElementById("dashModuleSubtitle");
    if (titleEl) titleEl.textContent = meta.title;
    if (subEl) subEl.textContent = meta.subtitle;
    const center = document.querySelector(".pro-main");
    if (center) center.scrollTop = 0;
    if (id === "buscar") renderBuscar();
    if (id === "lives") renderLivesSocios();
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
    let items = MOCK_DIRECTORIO.slice();
    if (f.categoria && f.categoria !== "Todas") {
      items = items.filter(function (d) {
        return d.categoria.toLowerCase() === f.categoria.toLowerCase();
      });
    }
    if (f.pais) {
      items = items.filter(function (d) {
        return d.pais === f.pais;
      });
    }
    if (f.estado && f.estado !== "Todos") {
      items = items.filter(function (d) {
        return d.estado === f.estado;
      });
    }
    if (f.ciudad && f.ciudad !== "Todas") {
      items = items.filter(function (d) {
        return d.ciudad === f.ciudad;
      });
    }
    return items;
  }

  function renderTarjetasBuscar(cont, items, f) {
    if (!cont) return;
    const hint = document.getElementById("dashBuscarHint");
    const partes = [];
    if (f.categoria && f.categoria !== "Todas") partes.push(f.categoria);
    if (f.pais) partes.push(f.pais);
    if (f.estado && f.estado !== "Todos") partes.push(f.estado);
    if (f.ciudad && f.ciudad !== "Todas") partes.push(f.ciudad);
    if (hint) {
      hint.textContent = items.length
        ? items.length + " resultado(s) · " + partes.join(" · ")
        : "Sin resultados para " + (partes.join(" · ") || "estos filtros") + ".";
    }
    cont.innerHTML = items.length
      ? items
          .map(function (d) {
            return (
              '<article class="dir-card">' +
              '<img src="' +
              esc(d.img) +
              '" alt="">' +
              "<div><b>" +
              esc(d.nombre) +
              (d.verificado ? ' <span class="dir-verified">✓</span>' : "") +
              "</b><p>" +
              esc(d.categoria) +
              " · " +
              esc(d.ciudad) +
              ", " +
              esc(d.estado) +
              '</p><div class="dir-card__actions">' +
              '<button type="button" class="btn secondary">Ver perfil</button>' +
              '<button type="button" class="btn secondary" data-goto-module="mensajes">Mensaje</button>' +
              "</div></div></article>"
            );
          })
          .join("")
      : '<p class="dash-empty">No hay resultados con esos filtros. Prueba otra categoría o ubicación.</p>';
    cont.querySelectorAll("[data-goto-module]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setModule(btn.dataset.gotoModule);
      });
    });
  }

  function renderBuscar(force) {
    const cont = document.getElementById("buscarResults");
    const hint = document.getElementById("dashBuscarHint");
    if (!cont) return;
    if (!force && !global._buscarEjecutado) {
      cont.innerHTML = "";
      if (hint) hint.textContent = "Elige categoría y ubicación, luego presiona Buscar.";
      return;
    }
    const f = leerFiltrosBuscar();
    if (global.geoRedFiltros) {
      global.geoRedFiltros.categoria = f.categoria;
      global.geoRedFiltros.pais = f.pais;
      global.geoRedFiltros.estado = f.estado;
      global.geoRedFiltros.ciudad = f.ciudad;
    }
    renderTarjetasBuscar(cont, filtrarDirectorio(f), f);
  }

  function renderDirectorio() {
    global._buscarEjecutado = true;
    renderBuscar(true);
  }

  function renderFeedPosts(filter) {
    const list = document.getElementById("dashFeedPosts");
    if (!list) return;
    const posts = MOCK_FEED_POSTS.filter(function (p) {
      if (!filter || filter === "todos") return true;
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

  function renderMensajes() {
    const list = document.getElementById("chatConvList");
    const thread = document.getElementById("chatThread");
    const header = document.getElementById("chatThreadHeader");
    if (!list || !thread) return;
    list.innerHTML = MOCK_CONVERSACIONES.map(function (c) {
      return (
        '<button type="button" class="chat-conv' +
        (c.id === activeConversacion ? " on" : "") +
        '" data-chat-id="' +
        esc(c.id) +
        '">' +
        '<img src="' +
        esc(c.avatar) +
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
    }).join("");
    const conv = MOCK_CONVERSACIONES.find(function (c) {
      return c.id === activeConversacion;
    });
    if (header && conv) {
      header.innerHTML =
        '<img src="' +
        esc(conv.avatar) +
        '" alt=""><div><b>' +
        esc(conv.nombre) +
        "</b><small>En línea recientemente</small></div>";
    }
    thread.innerHTML = MOCK_MENSAJES.map(function (m) {
      return (
        '<div class="chat-bubble chat-bubble--' +
        m.from +
        '"><p>' +
        esc(m.text) +
        '</p><time>' +
        esc(m.time) +
        "</time></div>"
      );
    }).join("");
    list.querySelectorAll("[data-chat-id]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeConversacion = btn.dataset.chatId;
        renderMensajes();
      });
    });
  }

  function renderSolicitudes(tab) {
    const cont = document.getElementById("solicitudesList");
    if (!cont) return;
    const key = tab || "recibidas";
    const items = MOCK_SOLICITUDES[key] || [];
    cont.innerHTML = items.length
      ? items
          .map(function (s) {
            return (
              '<article class="sol-card">' +
              '<img src="' +
              esc(s.img) +
              '" alt="">' +
              "<div><b>" +
              esc(s.nombre) +
              "</b><p>" +
              esc(s.categoria) +
              " · " +
              esc(s.ciudad) +
              '</p><div class="sol-card__actions">' +
              (key === "recibidas"
                ? '<button type="button" class="btn">Aceptar</button><button type="button" class="btn secondary">Rechazar</button>'
                : "") +
              '<button type="button" class="btn secondary">Ver perfil</button>' +
              '<button type="button" class="btn secondary" data-goto-module="mensajes">Mensaje</button>' +
              "</div></div></article>"
            );
          })
          .join("")
      : '<p class="dash-empty">No hay solicitudes en esta sección.</p>';
    cont.querySelectorAll("[data-goto-module]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setModule(btn.dataset.gotoModule);
      });
    });
  }

  function renderPublicacionesAdmin() {
    const cont = document.getElementById("pubAdminList");
    if (!cont) return;
    cont.innerHTML = MOCK_PUBLICACIONES.map(function (p) {
      return (
        '<article class="pub-admin-card">' +
        '<div class="pub-admin-card__thumb">📷</div>' +
        "<div><b>" +
        esc(p.titulo) +
        '</b><p><span class="badge ' +
        (p.estado === "activo" ? "ok" : p.estado === "programado" ? "warn" : "off") +
        '">' +
        esc(p.estado) +
        "</span> · " +
        esc(p.tipo) +
        " · " +
        esc(p.fecha) +
        "</p><p>" +
        esc(p.vistas) +
        " vistas · " +
        esc(p.interacciones) +
        ' interacciones</p><div class="pub-admin-card__actions">' +
        '<button type="button" class="btn secondary">Editar</button>' +
        '<button type="button" class="btn secondary">Eliminar</button>' +
        '<button type="button" class="btn secondary">Renovar</button>' +
        "</div></div></article>"
      );
    }).join("");
  }

  function renderEstadosSocios() {
    const list = document.getElementById("estadosSociosFeed");
    if (!list) return;
    const posts = MOCK_FEED_POSTS.filter(function (p) {
      return p.tipo === "Estado" || p.tipo === "Promoción";
    });
    list.innerHTML = posts
      .map(function (p) {
        return (
          '<article class="feed-post">' +
          '<header class="feed-post__head"><img src="' +
          esc(p.avatar) +
          '" alt=""><div><b>' +
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
          '</p><div class="feed-post__media"><img src="' +
          esc(p.img) +
          '" alt=""></div>' +
          '<div class="feed-post__actions"><button type="button">👍</button><button type="button">💬</button><button type="button">↗</button></div></article>'
        );
      })
      .join("");
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
        '" alt=""><span class="live-card__badge">🔴 EN VIVO · ' +
        esc(l.viewers) +
        "</span></div>" +
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
    list.innerHTML = MOCK_AVISOS.map(function (a) {
      return (
        '<article class="aviso-card aviso-card--' +
        esc(a.tipo) +
        '"><span class="aviso-card__icon">' +
        (a.tipo === "negocio" ? "🤝" : a.tipo === "pago" ? "💳" : a.tipo === "live" ? "📡" : a.tipo === "mensaje" ? "💬" : "✅") +
        '</span><div><b>' +
        esc(a.titulo) +
        "</b><p>" +
        esc(a.texto) +
        '</p><small>' +
        esc(a.hora) +
        "</small></div></article>"
      );
    }).join("");
  }

  function renderFavoritos() {
    const list = document.getElementById("favoritosList");
    if (!list) return;
    list.innerHTML = MOCK_FAVORITOS.map(function (f) {
      return (
        '<article class="dir-card"><img src="' +
        esc(f.img) +
        '" alt=""><div><b>' +
        esc(f.nombre) +
        "</b><p>" +
        esc(f.categoria) +
        " · " +
        esc(f.ciudad) +
        '</p><div class="dir-card__actions"><button type="button" class="btn secondary">Ver perfil</button><button type="button" class="btn secondary">Quitar</button></div></div></article>'
      );
    }).join("");
  }

  function renderBanners() {
    const cont = document.getElementById("bannersList");
    if (!cont) return;
    cont.innerHTML = MOCK_BANNERS.map(function (b) {
      return (
        '<article class="banner-admin-card">' +
        "<div><b>" +
        esc(b.nombre) +
        "</b><p>" +
        esc(b.slot || b.ubicacion || "") +
        "</p><p>Vence: " +
        esc(b.vence) +
        " · Pago: " +
        esc(b.pago) +
        '</p><span class="badge ' +
        (b.activo === true || b.estado === "activo" ? "ok" : "warn") +
        '">' +
        esc(b.activo === true || b.estado === "activo" ? "activo" : (b.estado || "pendiente")) +
        '</span></div><div class="banner-admin-card__actions">' +
        '<button type="button" class="btn secondary">Renovar</button>' +
        '<button type="button" class="btn">Contratar nuevo</button>' +
        "</div></article>"
      );
    }).join("");
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
        setModule(mod);
      });
    });

    bindTabs("[data-feed-tabs]", function (tab) {
      renderFeedPosts(tab);
    });
    bindTabs("[data-sol-tabs]", function (tab) {
      renderSolicitudes(tab);
    });
    bindTabs("[data-pub-tabs]", function () {});

    document.getElementById("chatPlusBtn")?.addEventListener("click", function () {
      document.getElementById("chatPlusMenu")?.classList.toggle("hidden");
    });

    document.getElementById("dashBuscarForm")?.addEventListener("submit", function (e) {
      e.preventDefault();
      global._buscarEjecutado = true;
      renderBuscar(true);
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
    renderBanners();
    setModule(activeModule);
  }

  global.DashModuleNav = {
    init,
    setModule,
    getActive: function () {
      return activeModule;
    },
    renderEstadosSocios,
    renderLivesSocios,
    renderAvisos,
    renderFavoritos,
    renderMensajes,
    renderSolicitudes,
    renderBuscar,
    renderDirectorio,
    MOCK_BANNERS,
    MOCK_FEED_POSTS,
    MOCK_CONVERSACIONES,
    MOCK_SOLICITUDES,
    MOCK_AVISOS,
    MOCK_DIRECTORIO,
    MOCK_FAVORITOS,
    MOCK_LIVES_SOCIOS,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
