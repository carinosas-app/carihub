/**
 * Modo Personalizar pantalla — colores, tipografías y fondos (sin cambiar textos).
 */
(function (global) {
  var STORAGE_KEY = "carihub_rp_visual_theme";
  var active = false;
  var selectedKey = "accent";
  var theme = loadTheme();

  var LABELS = {
    "page-bg": "Fondo de página",
    "card-bg": "Fondo de tarjetas",
    heading: "Títulos y nombre",
    "body-text": "Texto descriptivo",
    accent: "Precio y acentos",
    "dashboard-bg": "Fondo del dashboard",
  };

  function loadTheme() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* noop */ }
    return {
      perfil: {
        pageBg: "#FFF7FA",
        cardBg: "#FFFFFF",
        headingColor: "#23202b",
        bodyColor: "#7b7280",
        accentColor: "#ec2d7a",
        headingScale: 100,
        fontFamily: "Poppins",
        sheen: "pink",
      },
      dashboard: {
        pageBg: "",
        sheen: "pink",
      },
    };
  }

  function saveTheme() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    } catch (e) { /* noop */ }
  }

  function getFrame() {
    return document.getElementById("dashPerfilPreviewFrame");
  }

  function postToFrame(msg) {
    var frame = getFrame();
    if (!frame || !frame.contentWindow) return;
    try {
      frame.contentWindow.postMessage(msg, "*");
    } catch (e) { /* noop */ }
  }

  function applyAll() {
    postToFrame({ type: "carihub-apply-visual-theme", theme: theme.perfil });
    postToFrame({ type: "carihub-personalize-mode", active: active });
    if (theme.dashboard.pageBg) {
      document.body.style.background = theme.dashboard.pageBg;
    } else {
      document.body.style.background = "";
    }
    document.body.classList.toggle("dash-sheen-gold", theme.dashboard.sheen === "gold");
    document.body.classList.toggle("dash-sheen-pink", theme.dashboard.sheen === "pink");
    saveTheme();
  }

  function syncPanelFields() {
    var p = theme.perfil;
    var map = {
      pzPageBg: p.pageBg,
      pzCardBg: p.cardBg,
      pzHeading: p.headingColor,
      pzBody: p.bodyColor,
      pzAccent: p.accentColor,
      pzHeadingScale: p.headingScale,
      pzFont: p.fontFamily,
      pzSheen: p.sheen,
      pzDashBg: theme.dashboard.pageBg || "#FFF5F8",
      pzDashSheen: theme.dashboard.sheen,
    };
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.value = map[id];
    });
    var sel = document.getElementById("pzSelectedLabel");
    if (sel) sel.textContent = LABELS[selectedKey] || selectedKey;
  }

  function bindPanel() {
    var panel = document.getElementById("dashPersonalizePanel");
    if (!panel) return;

    panel.querySelectorAll("[data-pz-field]").forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.getAttribute("data-pz-field");
        var val = input.value;
        if (field === "headingScale") val = Number(val) || 100;
        if (field.indexOf("dashboard.") === 0) {
          theme.dashboard[field.slice(10)] = val;
        } else {
          theme.perfil[field] = val;
        }
        applyAll();
      });
    });

    panel.querySelectorAll("[data-pz-pick]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        selectedKey = btn.getAttribute("data-pz-pick");
        syncPanelFields();
      });
    });
  }

  function setActive(on) {
    active = !!on;
    document.body.classList.toggle("dash-personalize-active", active);
    var btn = document.getElementById("btnPersonalizarPantalla");
    if (btn) {
      btn.classList.toggle("on", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    }
    var panel = document.getElementById("dashPersonalizePanel");
    if (panel) panel.classList.toggle("hidden", !active);
    applyAll();
  }

  function toggle() {
    setActive(!active);
  }

  function init() {
    bindPanel();
    applyAll();
    syncPanelFields();

    var btn = document.getElementById("btnPersonalizarPantalla");
    if (btn) btn.addEventListener("click", toggle);

    window.addEventListener("message", function (ev) {
      if (!ev.data || ev.data.type !== "carihub-personalize-pick") return;
      selectedKey = ev.data.key || selectedKey;
      syncPanelFields();
      var panel = document.getElementById("dashPersonalizePanel");
      if (panel) panel.classList.remove("hidden");
    });

    var frame = getFrame();
    if (frame) {
      frame.addEventListener("load", function () {
        applyAll();
      });
    }
  }

  global.DashPersonalize = { init: init, applyAll: applyAll, toggle: toggle, setActive: setActive };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
