/**
 * Cuenta hub vs publicadora — permisos dashboard (TICKET-053).
 * Flags: isHubAccount, canPublishProfile, canRentBanner, canPublishLive
 */
(function (global) {
  "use strict";

  var EVENT = "carihub:dash-capabilities-change";
  var caps = {
    isHubAccount: false,
    canPublishProfile: true,
    canRentBanner: true,
    canPublishLive: true,
  };

  function normalize(input) {
    input = input || {};
    return {
      isHubAccount: !!input.isHubAccount,
      canPublishProfile: !!input.canPublishProfile,
      canRentBanner: !!input.canRentBanner,
      canPublishLive: !!input.canPublishLive,
    };
  }

  function isPreviewHub() {
    try {
      var p = new URLSearchParams(global.location.search);
      return p.get("preview") === "1" && (p.get("hub") === "1" || p.get("cuenta") === "hub");
    } catch (e) {
      return false;
    }
  }

  function deriveFromSnapshot(snapshot) {
    snapshot = snapshot || {};
    var hubData = snapshot.hubData || {};
    var explicit = hubData.capabilities || hubData.dashboardCapabilities || null;
    if (explicit && typeof explicit === "object") {
      return normalize({
        isHubAccount: explicit.isHubAccount,
        canPublishProfile: explicit.canPublishProfile,
        canRentBanner: explicit.canRentBanner,
        canPublishLive: explicit.canPublishLive,
      });
    }

    if (isPreviewHub()) {
      return normalize({
        isHubAccount: true,
        canPublishProfile: false,
        canRentBanner: false,
        canPublishLive: false,
      });
    }

    var tipo = String(hubData.tipoCuenta || "").toLowerCase();
    var roles = Array.isArray(hubData.roles) ? hubData.roles : [];
    var perfilCount = Number(snapshot.perfilCount || 0);
    var bannerCount = Number(snapshot.bannerCount || 0);
    var explicitHub = hubData.isHubAccount === true || hubData.cuentaHub === true;

    var isVisitante = tipo === "visitante" || tipo === "usuario_visitante";
    var isHub =
      explicitHub ||
      (isVisitante && perfilCount === 0 && bannerCount === 0 && !roles.includes("anunciante"));

    if (isHub) {
      return normalize({
        isHubAccount: true,
        canPublishProfile: false,
        canRentBanner: false,
        canPublishLive: false,
      });
    }

    var canPublish =
      perfilCount > 0 ||
      roles.includes("publicador") ||
      roles.includes("independiente") ||
      (tipo && tipo !== "visitante" && tipo !== "usuario_visitante");
    var canBanner =
      bannerCount > 0 || roles.includes("anunciante") || hubData.canRentBanner === true;

    return normalize({
      isHubAccount: false,
      canPublishProfile: canPublish,
      canRentBanner: canBanner,
      canPublishLive: canPublish,
    });
  }

  function capKeyToFlag(key) {
    if (key === "publish") return "canPublishProfile";
    if (key === "banner") return "canRentBanner";
    if (key === "live") return "canPublishLive";
    if (key === "hub") return "isHubAccount";
    return key;
  }

  function can(key) {
    var flag = capKeyToFlag(key);
    return !!caps[flag];
  }

  function get() {
    return Object.assign({}, caps);
  }

  function set(next) {
    caps = normalize(next);
    global.document.dispatchEvent(new CustomEvent(EVENT, { detail: get() }));
    return get();
  }

  function sync(snapshot) {
    return set(deriveFromSnapshot(snapshot));
  }

  function applyUI() {
    var shell = global.document.querySelector(".dashboard-shell");
    var body = global.document.body;
    if (shell) shell.classList.toggle("dash-account--hub", caps.isHubAccount);
    if (body) body.classList.toggle("dash-account--hub", caps.isHubAccount);

    global.document.querySelectorAll("[data-dash-cap]").forEach(function (el) {
      var key = el.getAttribute("data-dash-cap");
      var flag = capKeyToFlag(key);
      var visible = !!caps[flag];
      el.classList.toggle("hidden", !visible);
      if (el.tagName === "BUTTON" || el.tagName === "A") {
        el.toggleAttribute("disabled", !visible);
      }
    });

    var hubNotice = global.document.getElementById("dashHubAccountNotice");
    if (hubNotice) hubNotice.classList.toggle("hidden", !caps.isHubAccount);

    var pickerLabel = global.document.getElementById("dashPerfilesRailLabel");
    if (pickerLabel) {
      pickerLabel.textContent = caps.isHubAccount ? "Tu cuenta" : "Tus perfiles";
    }
  }

  function isPublisherModule(moduleId) {
    return (
      moduleId === "anunciar" ||
      moduleId === "anunciar-mensajes" ||
      moduleId === "anuncios-mensajes" ||
      moduleId === "publicaciones" ||
      moduleId === "transmitir-live" ||
      moduleId === "vista-perfil" ||
      moduleId === "info-publica" ||
      moduleId === "estadisticas" ||
      moduleId === "tarjeta"
    );
  }

  function canOpenModule(moduleId, opts) {
    opts = opts || {};
    if (moduleId === "mensajes" && opts.msgScope === "banner") {
      return can("banner");
    }
    if (isPublisherModule(moduleId)) {
      return can("publish");
    }
    return true;
  }

  global.DashAccountCapabilities = {
    EVENT: EVENT,
    get: get,
    set: set,
    sync: sync,
    can: can,
    applyUI: applyUI,
    canOpenModule: canOpenModule,
    isPublisherModule: isPublisherModule,
    deriveFromSnapshot: deriveFromSnapshot,
  };
})(typeof window !== "undefined" ? window : globalThis);
