/**
 * Banner impago/vencido — bloqueo de conversaciones (TICKET-052).
 * Regla: sin pago/vigencia/activo → sin acceso a chats de ese banner.
 */
(function (global) {
  "use strict";

  function normalizarPago(val) {
    return String(val || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function bannerDesdeId(bannerId) {
    if (!bannerId) return null;
    if (typeof global.getDashboardBannerById === "function") {
      return global.getDashboardBannerById(bannerId);
    }
    if (typeof global.getDashboardBannersForModule === "function") {
      var list = global.getDashboardBannersForModule() || [];
      return (
        list.find(function (b) {
          return b.id === bannerId || b.solicitudId === bannerId;
        }) || null
      );
    }
    return null;
  }

  function estadoPagoBanner(pub) {
    if (!pub) return "";
    var ep = pub.estadoPublicacion || {};
    if (ep.pago) return ep.pago;
    if (pub.pago) return pub.pago;
    var raw = pub._raw || pub;
    if (raw.estadoPago) return raw.estadoPago;
    if (pub.plan && pub.plan.diasRestantes) return pub.plan.diasRestantes;
    if (pub.quick && pub.quick["Días restantes del plan"]) return pub.quick["Días restantes del plan"];
    return "";
  }

  function pagoIndicaBloqueo(pagoNorm) {
    if (!pagoNorm) return false;
    return (
      pagoNorm.indexOf("por pagar") >= 0 ||
      pagoNorm.indexOf("pendiente de pago") >= 0 ||
      pagoNorm === "pendiente" ||
      pagoNorm.indexOf("impago") >= 0 ||
      pagoNorm.indexOf("vencido") >= 0 ||
      pagoNorm.indexOf("cancelado") >= 0 ||
      pagoNorm.indexOf("sin pagar") >= 0
    );
  }

  function bannerMensajesAccesible(pub) {
    if (!pub) return false;
    var ep = pub.estadoPublicacion || {};
    if (ep.vencido === true) return false;

    var raw = pub._raw || pub;
    var estadoWorkflow = String(raw.estadoSolicitud || raw.estadoAdmin || "").toLowerCase();
    if (
      estadoWorkflow === "vencido" ||
      estadoWorkflow === "cancelado" ||
      estadoWorkflow === "rechazado"
    ) {
      return false;
    }

    var estadoRaw = String((raw && raw.estado) || pub.estado || "").toLowerCase();
    if (estadoRaw === "vencido") return false;

    var pago = normalizarPago(estadoPagoBanner(pub));
    if (pagoIndicaBloqueo(pago)) return false;

    if (pub.activo === false && !ep.publicoActivo) return false;
    if (ep.publicoActivo === true) return true;
    if (pub.activo === true) return true;

    if (
      estadoRaw === "activo" ||
      estadoRaw === "aprobado" ||
      estadoRaw === "publicado"
    ) {
      return true;
    }

    return false;
  }

  function motivoBloqueoBanner(pub) {
    if (!pub) return "Banner no encontrado.";
    var ep = pub.estadoPublicacion || {};
    var pago = estadoPagoBanner(pub);
    var pagoNorm = normalizarPago(pago);
    var raw = pub._raw || pub;
    var estadoWorkflow = String(raw.estadoSolicitud || "").toLowerCase();

    if (ep.vencido || String(pub.estado || "").toLowerCase() === "vencido") {
      return "Este banner venció. Renueva para recuperar las conversaciones de este anuncio.";
    }
    if (estadoWorkflow === "vencido" || estadoWorkflow === "cancelado") {
      return "Campaña no vigente. Renueva o contrata de nuevo para ver los chats de este banner.";
    }
    if (pagoNorm.indexOf("por pagar") >= 0 || pagoNorm.indexOf("pendiente") >= 0) {
      return "Banner pendiente de pago. Completa el pago para desbloquear los chats de este anuncio.";
    }
    if (!ep.publicoActivo && pub.activo !== true) {
      return "Banner no activo. Espera aprobación administrativa o renueva la campaña.";
    }
    return "Banner no vigente. Renueva para acceder a las conversaciones de este anuncio.";
  }

  function etiquetaRailBanner(pub) {
    if (bannerMensajesAccesible(pub)) return null;
    var pagoNorm = normalizarPago(estadoPagoBanner(pub));
    if (pagoNorm.indexOf("por pagar") >= 0 || pagoNorm.indexOf("pendiente") >= 0) return "Impago";
    if (pub.estadoPublicacion && pub.estadoPublicacion.vencido) return "Vencido";
    if (String(pub.estado || "").toLowerCase() === "vencido") return "Vencido";
    return "Bloqueado";
  }

  function renovarBannerUrl(pub) {
    var id = (pub && (pub.solicitudId || pub.id)) || "";
    return id
      ? "registro-banner.html?renovar=" + encodeURIComponent(id)
      : "registro-banner.html";
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

  function snapshot(pub) {
    pub = pub || {};
    var accesible = bannerMensajesAccesible(pub);
    return {
      id: pub.id || pub.solicitudId || "",
      nombre: pub.nombrePublico || pub.nombre || "Banner",
      imagen: imagenBanner(pub),
      slot:
        (pub.publicidad && (pub.publicidad.espacio || pub.publicidad.pantalla)) ||
        pub.categoria ||
        "",
      accesible: accesible,
      etiqueta: etiquetaRailBanner(pub) || "Bloqueado",
      motivo: motivoBloqueoBanner(pub),
      pago: String(estadoPagoBanner(pub) || "—"),
      renovarUrl: renovarBannerUrl(pub),
    };
  }

  function isContextoBloqueado(filter) {
    if (!filter || filter.contextoTipo !== "banner" || !filter.contextoId) return false;
    var pub = bannerDesdeId(filter.contextoId);
    if (!pub) return false;
    return !bannerMensajesAccesible(pub);
  }

  function filterUnreadBannerMap(bannerMap) {
    bannerMap = bannerMap || {};
    var out = {};
    Object.keys(bannerMap).forEach(function (id) {
      var pub = bannerDesdeId(id);
      if (pub && !bannerMensajesAccesible(pub)) return;
      out[id] = bannerMap[id];
    });
    return out;
  }

  global.DashBannerMensajes = {
    accesible: bannerMensajesAccesible,
    motivo: motivoBloqueoBanner,
    etiquetaRail: etiquetaRailBanner,
    renovarUrl: renovarBannerUrl,
    resolve: bannerDesdeId,
    estadoPago: estadoPagoBanner,
    snapshot: snapshot,
    isContextoBloqueado: isContextoBloqueado,
    filterUnreadBannerMap: filterUnreadBannerMap,
  };
})(typeof window !== "undefined" ? window : globalThis);
