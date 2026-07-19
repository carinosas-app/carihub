/**
 * Directory Mode (Fase 1 marketplace) — B0/B1/B2
 * When ON (default): hide Future Architecture social surfaces
 * (dashboard + Home / Perfil público / Registro).
 * QA override (?futureSocial=1 / ?directoryMode=0) ONLY on local/dev hosts — never production.
 * Does NOT delete code, rules, or Functions.
 */
(function (global) {
  "use strict";

  var EVENT = "carihub:directory-mode-change";
  var FASE1_SSOT_STYLE_ID = "directory-mode-fase1-ssot";

  /** Modules blocked while Directory Mode is active (B1 dashboard). */
  var SOCIAL_MODULES = {
    mensajes: true,
    estados: true,
    lives: true,
    "transmitir-live": true,
    "anuncios-mensajes": true,
    "anunciar-mensajes": true,
    "privacidad-mensajes": true,
    "feed-red": true,
    publicaciones: true,
  };

  /**
   * Single Source of Truth — hide public Estados/LIBE (States & Lives) placeholders
   * while Directory Mode is ON. Preserves FA code for later activation (?futureSocial=1 on QA hosts only).
   * Center «Anúnciate aquí» banner expands to full rail width.
   */
  var FASE1_ESTADOS_LIBE_CSS =
    "html.directory-mode .ch-slot-dock--home," +
    "html.directory-mode .ch-slot-dock--hero," +
    "html.directory-mode .home-cat-promo-rail__slot--side," +
    "html.directory-mode [data-directory-hide=\"estados-libe-docks\"]," +
    "html.directory-mode .res-midband__slot--estados," +
    "html.directory-mode .res-midband__slot--libe," +
    "html.directory-mode .ch-slot-dock__item--fase1-hidden{" +
    "display:none!important;visibility:hidden!important;pointer-events:none!important;" +
    "width:0!important;min-width:0!important;max-width:0!important;height:0!important;" +
    "min-height:0!important;max-height:0!important;margin:0!important;padding:0!important;" +
    "border:0!important;overflow:hidden!important;flex:0 0 0!important;}" +
    "html.directory-mode .home-cat-promo-rail{" +
    "gap:0!important;justify-content:center!important;}" +
    "html.directory-mode .home-cat-promo-rail__slot--center{" +
    "flex:1 1 auto!important;width:100%!important;max-width:100%!important;min-width:0!important;}" +
    "html.directory-mode .res-midband{min-height:auto!important;height:auto!important;gap:0!important;}" +
    "html.directory-mode .res-midband__center{flex:1 1 auto!important;width:100%!important;max-width:100%!important;}";

  function ensureFase1EstadosLibeStyles() {
    var doc = global.document;
    if (!doc) return;
    var existing = doc.getElementById(FASE1_SSOT_STYLE_ID);
    if (existing) return;
    var style = doc.createElement("style");
    style.id = FASE1_SSOT_STYLE_ID;
    style.setAttribute("data-carihub-ssot", "fase1-hide-estados-libe");
    style.textContent = FASE1_ESTADOS_LIBE_CSS;
    (doc.head || doc.documentElement).appendChild(style);
  }

  /**
   * Query override is QA-only. Public production hostnames must ignore it (P0).
   */
  function isQaOverrideHostAllowed() {
    try {
      var h = String((global.location && global.location.hostname) || "").toLowerCase();
      var proto = String((global.location && global.location.protocol) || "").toLowerCase();
      /* file:// (local open) — QA only; empty host on https production must NOT unlock */
      if (!h) return proto === "file:";
      if (h === "localhost" || h === "127.0.0.1" || h === "[::1]") return true;
      if (h === "0.0.0.0") return true;
      if (h.endsWith(".localhost")) return true;
      if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
      if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
      var p = new URLSearchParams(global.location.search);
      /* Existing dashboard hub preview gate — admin/QA only */
      if (p.get("preview") === "1" && (p.get("hub") === "1" || p.get("cuenta") === "hub")) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  /**
   * Memoize QA override for the lifetime of this document.
   * DashContext.syncUrl / pretty-URL rewrites may drop ?futureSocial after first paint;
   * production hosts never enter this path (isQaOverrideHostAllowed === false).
   */
  var qaOverrideMemo = undefined;

  function readQueryOverride() {
    if (!isQaOverrideHostAllowed()) {
      qaOverrideMemo = null;
      return null;
    }
    if (qaOverrideMemo !== undefined) return qaOverrideMemo;
    try {
      var p = new URLSearchParams(global.location.search);
      if (p.get("futureSocial") === "1") {
        qaOverrideMemo = false;
        return qaOverrideMemo;
      }
      if (p.get("directoryMode") === "0") {
        qaOverrideMemo = false;
        return qaOverrideMemo;
      }
      if (p.get("directoryMode") === "1") {
        qaOverrideMemo = true;
        return qaOverrideMemo;
      }
      if (p.get("futureSocial") === "0") {
        qaOverrideMemo = true;
        return qaOverrideMemo;
      }
    } catch (e) {
      /* ignore */
    }
    qaOverrideMemo = null;
    return null;
  }

  /**
   * Directory Mode ON = social Future Architecture hidden (marketplace launch default).
   */
  function isDirectoryMode() {
    var q = readQueryOverride();
    if (q !== null) return q;
    return true;
  }

  function isFutureSocialEnabled() {
    return !isDirectoryMode();
  }

  /** B2: internal messaging / inbox / msg contact (inverse of Directory Mode). */
  function allowInternalMessaging() {
    return !isDirectoryMode();
  }

  function isSocialModule(moduleId) {
    return !!SOCIAL_MODULES[String(moduleId || "")];
  }

  /** Sync html/body classes early (FOUC) — safe before body exists. */
  function syncRootClasses() {
    var on = isDirectoryMode();
    var root = global.document && global.document.documentElement;
    if (root) {
      root.classList.toggle("directory-mode", on);
      root.classList.toggle("future-social-enabled", !on);
    }
    ensureFase1EstadosLibeStyles();
    return on;
  }

  /** Defensive: neutralize leftover FA dock anchors if any were painted before CSS. */
  function neutralizeEstadosLibeControls(on) {
    var doc = global.document;
    if (!doc || !on) return;
    var sels = [
      ".ch-slot-dock--home a",
      ".ch-slot-dock--hero a",
      ".home-cat-promo-rail__slot--side a",
      "[data-directory-hide=\"estados-libe-docks\"] a",
      ".res-midband__slot--estados a",
      ".res-midband__slot--libe a",
      "a[data-ch-slot$=\"_estados\"]",
      "a[data-ch-slot$=\"_libe\"]",
    ];
    doc.querySelectorAll(sels.join(",")).forEach(function (a) {
      a.setAttribute("tabindex", "-1");
      a.setAttribute("aria-hidden", "true");
      a.setAttribute("hidden", "");
      a.style.pointerEvents = "none";
      try {
        a.removeAttribute("href");
      } catch (e) {
        /* ignore */
      }
    });
  }

  function applyUI() {
    var on = syncRootClasses();
    var body = global.document && global.document.body;
    var shell = global.document && global.document.querySelector(".dashboard-shell");
    if (body) {
      body.classList.toggle("directory-mode", on);
      body.classList.toggle("future-social-enabled", !on);
    }
    if (shell) {
      shell.classList.toggle("directory-mode", on);
      shell.classList.toggle("future-social-enabled", !on);
    }

    if (global.document) {
      global.document.querySelectorAll('[data-fase1-hide="social"]').forEach(function (el) {
        el.classList.toggle("hidden", on);
        if (el.tagName === "BUTTON" || el.tagName === "A") {
          if (on) el.setAttribute("aria-hidden", "true");
          else el.removeAttribute("aria-hidden");
          if (on && (el.tagName === "BUTTON" || el.getAttribute("role") === "button")) {
            el.setAttribute("tabindex", "-1");
          } else if (el.tagName === "BUTTON") {
            el.removeAttribute("tabindex");
          }
        }
        if (on) {
          el.querySelectorAll('input[type="checkbox"]').forEach(function (inp) {
            inp.checked = false;
          });
          if (el.tagName === "INPUT" && el.type === "checkbox") el.checked = false;
        }
      });
      neutralizeEstadosLibeControls(on);
    }

    var hubText = global.document && global.document.querySelector(".dash-hub-notice__text");
    if (hubText) {
      hubText.textContent = on
        ? "Favoritos y avisos sin publicar perfil ni banner."
        : "Mensajes, favoritos y avisos sin publicar perfil ni banner.";
    }

    try {
      global.document.dispatchEvent(
        new CustomEvent(EVENT, {
          detail: { directoryMode: on, futureSocialEnabled: !on },
        })
      );
    } catch (e) {
      /* ignore */
    }
  }

  function bootPublic() {
    syncRootClasses();
    if (!global.document) return;
    if (global.document.readyState === "loading") {
      global.document.addEventListener("DOMContentLoaded", function () {
        applyUI();
      });
    } else {
      applyUI();
    }
  }

  syncRootClasses();
  bootPublic();

  global.CarihubDirectoryMode = {
    EVENT: EVENT,
    SOCIAL_MODULES: SOCIAL_MODULES,
    isDirectoryMode: isDirectoryMode,
    isFutureSocialEnabled: isFutureSocialEnabled,
    allowInternalMessaging: allowInternalMessaging,
    isSocialModule: isSocialModule,
    isQaOverrideHostAllowed: isQaOverrideHostAllowed,
    syncRootClasses: syncRootClasses,
    applyUI: applyUI,
    ensureFase1EstadosLibeStyles: ensureFase1EstadosLibeStyles,
  };
})(typeof window !== "undefined" ? window : globalThis);
