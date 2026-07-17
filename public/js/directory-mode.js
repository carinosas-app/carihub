/**
 * Directory Mode (Fase 1 marketplace) — B0/B1
 * When ON (default): hide Future Architecture social surfaces in dashboard.
 * QA override (?futureSocial=1 / ?directoryMode=0) ONLY on local/dev hosts — never production.
 * Does NOT delete code, rules, or Functions.
 */
(function (global) {
  "use strict";

  var EVENT = "carihub:directory-mode-change";

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

  function isSocialModule(moduleId) {
    return !!SOCIAL_MODULES[String(moduleId || "")];
  }

  function applyUI() {
    var on = isDirectoryMode();
    var root = global.document.documentElement;
    var body = global.document.body;
    var shell = global.document.querySelector(".dashboard-shell");
    if (root) {
      root.classList.toggle("directory-mode", on);
      root.classList.toggle("future-social-enabled", !on);
    }
    if (body) {
      body.classList.toggle("directory-mode", on);
      body.classList.toggle("future-social-enabled", !on);
    }
    if (shell) {
      shell.classList.toggle("directory-mode", on);
      shell.classList.toggle("future-social-enabled", !on);
    }

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
    });

    var hubText = global.document.querySelector(".dash-hub-notice__text");
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

  global.CarihubDirectoryMode = {
    EVENT: EVENT,
    SOCIAL_MODULES: SOCIAL_MODULES,
    isDirectoryMode: isDirectoryMode,
    isFutureSocialEnabled: isFutureSocialEnabled,
    isSocialModule: isSocialModule,
    isQaOverrideHostAllowed: isQaOverrideHostAllowed,
    applyUI: applyUI,
  };
})(typeof window !== "undefined" ? window : globalThis);
