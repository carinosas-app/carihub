/**
 * Métricas y panel de banner en dashboard (TICKET-044).
 * Inicio → centro = resumen campaña; Mensajes → hilos del banner (vía contexto).
 * Sheet secundario: clics, impresiones, renovar, editar.
 */
(function (global) {
  "use strict";

  var MOCK_METRICS = {
    "banner-home-mty": {
      impresiones: 12480,
      clics: 312,
      ctr: 2.5,
      mensajes: 3,
      favoritos: 40,
      visitas: 890,
    },
    "banner-spa": {
      impresiones: 3200,
      clics: 49,
      ctr: 1.5,
      mensajes: 14,
      favoritos: 82,
      visitas: 420,
    },
    "destacado-club": {
      impresiones: 0,
      clics: 0,
      ctr: 0,
      mensajes: 22,
      favoritos: 126,
      visitas: 0,
    },
  };

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function resolve(bannerId) {
    if (!bannerId) return null;
    if (typeof global.getDashboardBannerById === "function") {
      return global.getDashboardBannerById(bannerId);
    }
    if (typeof global.getDashboardBannersForModule === "function") {
      var list = global.getDashboardBannersForModule() || [];
      return list.find(function (b) {
        return b.id === bannerId || b.solicitudId === bannerId;
      }) || null;
    }
    return null;
  }

  function slotLabel(pub) {
    if (!pub) return "Banner contratado";
    var pubAd = pub.publicidad || {};
    var slot = pubAd.espacio || pubAd.pantalla || "";
    if (slot) return slot;
    var quick = pub.quick || {};
    if (quick["Anuncio destacado"]) return quick["Anuncio destacado"];
    if (pub.categoria) return pub.categoria;
    return "Banner contratado";
  }

  function imagenBanner(pub) {
    if (!pub) return "img/home/banners/ad-banner-pink-01.png";
    return (
      (pub.mediaPrincipal && pub.mediaPrincipal.url) ||
      pub.imagen ||
      pub.avatar ||
      (pub._raw && (pub._raw.imagenURL || pub._raw.imagen)) ||
      "img/home/banners/ad-banner-pink-01.png"
    );
  }

  function num(v) {
    var n = Number(v);
    return isFinite(n) ? n : 0;
  }

  function formatNum(n) {
    n = num(n);
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return String(n);
  }

  function metricsFromPub(pub) {
    var m = pub.metricas || {};
    var r = pub.resumen || {};
    var mock = MOCK_METRICS[pub.id] || {};
    var impresiones = num(
      m.impresiones || r.impresiones || m.vistasBanner || r.vistasBanner || mock.impresiones
    );
    var clics = num(
      m.clics ||
        r.clics ||
        m.clicksWhatsApp ||
        r.whatsapp ||
        r.clicksWhatsApp ||
        mock.clics
    );
    var ctr = impresiones > 0 ? ((clics / impresiones) * 100) : num(mock.ctr);
    if (!ctr && mock.ctr) ctr = mock.ctr;
    return {
      impresiones: impresiones,
      clics: clics,
      ctr: Math.round(ctr * 10) / 10,
      mensajes: num(m.mensajes || r.mensajes || mock.mensajes),
      favoritos: num(m.favoritos || r.favoritos || r.corazones || mock.favoritos),
      visitas: num(m.visitas || r.visitas || mock.visitas),
      clicksWhatsApp: num(m.clicksWhatsApp || r.whatsapp || mock.clics),
    };
  }

  function snapshot(pub) {
    pub = pub || {};
    var ep = pub.estadoPublicacion || {};
    var plan = pub.plan || {};
    var accesible = global.DashBannerMensajes
      ? DashBannerMensajes.accesible(pub)
      : true;
    var pago =
      (global.DashBannerMensajes && DashBannerMensajes.estadoPago(pub)) ||
      ep.pago ||
      pub.estadoPago ||
      "—";
    var vence =
      plan.fechaVencimiento ||
      plan.diasRestantes ||
      (pub.quick && pub.quick["Días restantes del plan"]) ||
      "—";
    var id = pub.id || pub.solicitudId || "";
    var renovarUrl =
      global.DashBannerMensajes
        ? DashBannerMensajes.renovarUrl(pub)
        : id
          ? "registro-banner.html?renovar=" + encodeURIComponent(id)
          : "registro-banner.html";
    var editarUrl = id
      ? "registro-banner.html?editar=" + encodeURIComponent(id)
      : "registro-banner.html";
    var etiqueta =
      !accesible && global.DashBannerMensajes
        ? DashBannerMensajes.etiquetaRail(pub)
        : ep.etiqueta || pub.estado || "—";
    var unread = 0;
    if (
      typeof global.unreadConversacionesContexto === "function" &&
      id &&
      accesible
    ) {
      unread = num(global.unreadConversacionesContexto("banner", id));
    }
    return {
      id: id,
      nombre: pub.nombrePublico || pub.nombre || "Banner",
      slot: slotLabel(pub),
      imagen: imagenBanner(pub),
      ubicacion: [pub.ciudad, pub.estado].filter(Boolean).join(", ") || pub.pais || "",
      categoria: pub.categoria || "",
      pago: String(pago),
      vence: String(vence),
      etiqueta: String(etiqueta),
      accesible: accesible,
      bloqueoEtiqueta:
        !accesible && global.DashBannerMensajes
          ? DashBannerMensajes.etiquetaRail(pub)
          : null,
      motivoBloqueo:
        !accesible && global.DashBannerMensajes
          ? DashBannerMensajes.motivo(pub)
          : "",
      renovarUrl: renovarUrl,
      editarUrl: editarUrl,
      metricas: metricsFromPub(pub),
      mensajesUnread: unread,
      ultimaActualizacion:
        plan.ultimaActualizacion ||
        (pub.quick && pub.quick["Última actualización"]) ||
        "—",
      periodo: (pub.publicidad && pub.publicidad.periodo) || plan.nombre || "",
    };
  }

  function metricChip(label, value, sub) {
    return (
      '<li class="dash-banner-metric">' +
      "<span>" +
      esc(label) +
      "</span>" +
      "<b>" +
      esc(value) +
      "</b>" +
      (sub ? "<small>" + esc(sub) + "</small>" : "") +
      "</li>"
    );
  }

  function htmlInicioPanel(pub) {
    var s = snapshot(pub);
    if (!s.id) return "";
    var lockCls = s.accesible ? "" : " dash-banner-hub--locked";
    var statusCls = s.accesible ? "is-ok" : "is-warn";
    return (
      '<div class="dash-banner-hub' +
      lockCls +
      '" data-banner-id="' +
      esc(s.id) +
      '">' +
      '<div class="dash-banner-hub__hero">' +
      '<img class="dash-banner-hub__img" src="' +
      esc(s.imagen) +
      '" alt="" decoding="async">' +
      '<div class="dash-banner-hub__hero-meta">' +
      "<strong>" +
      esc(s.nombre) +
      "</strong>" +
      "<p>" +
      esc(s.slot) +
      "</p>" +
      (s.ubicacion ? "<p class=\"dash-banner-hub__geo\">" + esc(s.ubicacion) + "</p>" : "") +
      '<span class="dash-banner-hub__status ' +
      statusCls +
      '">' +
      esc(s.bloqueoEtiqueta || s.etiqueta) +
      "</span>" +
      "</div></div>" +
      '<ul class="dash-banner-hub__metrics" aria-label="Métricas de campaña">' +
      metricChip("Impresiones", formatNum(s.metricas.impresiones), "últimos 30 d") +
      metricChip("Clics", formatNum(s.metricas.clics), "CTR " + s.metricas.ctr + "%") +
      metricChip(
        "Mensajes",
        String(s.mensajesUnread > 0 ? s.mensajesUnread + " nuevos" : s.metricas.mensajes),
        "por este banner"
      ) +
      metricChip("Vigencia", s.vence, "Pago: " + s.pago) +
      "</ul>" +
      (s.accesible
        ? '<p class="dash-banner-hub__hint">Los chats de este banner son independientes de tus perfiles. Toca <b>Mensajes</b> en la barra o el ícono 📊 en el rail para métricas completas.</p>'
        : '<p class="dash-banner-hub__lock-msg">' +
          esc(s.motivoBloqueo) +
          "</p>") +
      "</div>"
    );
  }

  function htmlSheetBody(pub) {
    var s = snapshot(pub);
    return (
      '<div class="dash-banner-sheet__hero">' +
      '<img src="' +
      esc(s.imagen) +
      '" alt="" decoding="async">' +
      "<div><strong id=\"dashBannerSheetTitle\">" +
      esc(s.nombre) +
      "</strong><p>" +
      esc(s.slot) +
      "</p></div></div>" +
      '<div class="dash-banner-sheet__grid">' +
      metricChip("Impresiones", formatNum(s.metricas.impresiones), "vistas del anuncio") +
      metricChip("Clics totales", formatNum(s.metricas.clics), "CTR " + s.metricas.ctr + "%") +
      metricChip("Clics WhatsApp", formatNum(s.metricas.clicksWhatsApp), "desde banner") +
      metricChip("Mensajes", formatNum(s.metricas.mensajes), s.mensajesUnread + " sin leer") +
      metricChip("Favoritos", formatNum(s.metricas.favoritos), "guardados") +
      metricChip("Visitas perfil", formatNum(s.metricas.visitas), "atribuidas") +
      "</div>" +
      '<dl class="dash-banner-sheet__meta">' +
      "<dt>Estado pago</dt><dd>" +
      esc(s.pago) +
      "</dd>" +
      "<dt>Vigencia</dt><dd>" +
      esc(s.vence) +
      "</dd>" +
      "<dt>Periodo</dt><dd>" +
      esc(s.periodo || "—") +
      "</dd>" +
      "<dt>Última actividad</dt><dd>" +
      esc(s.ultimaActualizacion) +
      "</dd>" +
      "</dl>" +
      (s.accesible
        ? ""
        : '<p class="dash-banner-sheet__warn">' + esc(s.motivoBloqueo) + "</p>") +
      '<div class="dash-banner-sheet__actions">' +
      (s.accesible
        ? '<button type="button" class="btn" data-banner-sheet-action="mensajes">Ver conversaciones</button>'
        : "") +
      '<a class="btn' +
      (s.accesible ? " secondary" : "") +
      '" href="' +
      esc(s.renovarUrl) +
      '">' +
      (s.accesible ? "Renovar campaña" : "Pagar / renovar") +
      "</a>" +
      '<a class="btn secondary" href="' +
      esc(s.editarUrl) +
      '">Editar campaña</a>' +
      "</div>"
    );
  }

  function bindSheetActions(root, bannerId) {
    if (!root) return;
    root.querySelectorAll("[data-banner-sheet-action]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var action = btn.getAttribute("data-banner-sheet-action");
        if (action === "mensajes") {
          if (global.DashContext) {
            DashContext.set({ tipo: "banner", id: bannerId, bannerId: bannerId });
          }
          if (global.DashModuleNav) DashModuleNav.setModule("mensajes");
          closeSheet();
        }
      });
    });
  }

  function openSheet(bannerId) {
    var pub = resolve(bannerId);
    if (!pub) return;
    var sheet = global.document.getElementById("dashBannerMetricsSheet");
    var body = global.document.getElementById("dashBannerSheetBody");
    if (!sheet || !body) return;
    body.innerHTML = htmlSheetBody(pub);
    bindSheetActions(body, bannerId);
    sheet.classList.remove("hidden");
    sheet.setAttribute("aria-hidden", "false");
    global.document.body.classList.add("dash-banner-sheet-open");
  }

  function closeSheet() {
    var sheet = global.document.getElementById("dashBannerMetricsSheet");
    if (!sheet) return;
    sheet.classList.add("hidden");
    sheet.setAttribute("aria-hidden", "true");
    global.document.body.classList.remove("dash-banner-sheet-open");
  }

  function initSheet() {
    var sheet = global.document.getElementById("dashBannerMetricsSheet");
    if (!sheet || sheet.dataset.bound) return;
    sheet.dataset.bound = "1";
    sheet.querySelectorAll("[data-banner-sheet-close]").forEach(function (el) {
      el.addEventListener("click", closeSheet);
    });
    global.document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") closeSheet();
    });
    global.document.addEventListener("carihub:dash-banner-metrics", function (ev) {
      var id = ev.detail && ev.detail.bannerId;
      if (id) openSheet(id);
    });
  }

  global.DashBannerMetrics = {
    resolve: resolve,
    snapshot: snapshot,
    htmlInicioPanel: htmlInicioPanel,
    htmlSheetBody: htmlSheetBody,
    openSheet: openSheet,
    closeSheet: closeSheet,
    initSheet: initSheet,
    formatNum: formatNum,
  };

  if (global.document && global.document.readyState !== "loading") {
    initSheet();
  } else if (global.document) {
    global.document.addEventListener("DOMContentLoaded", initSheet);
  }
})(typeof window !== "undefined" ? window : globalThis);
