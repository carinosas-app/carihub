/**
 * ch-ui.js — Componentes visuales reutilizables de CariHub / Cariñosas.
 * 100% HTML/CSS/SVG (sin archivos de imagen para los elementos decorativos).
 *
 * Expone window.CHUI con:
 *   - Helpers: slug, safe, hash, norm
 *   - Theme engine: esAdulto, temaDe, aplicarTema
 *   - Banderas ONDEANDO por país (chFlag)
 *   - Escudos GIRATORIOS sobre su propio eje (chShield)
 *   - Placeholders de foto en SVG cuando no hay imagen real (chFotoPlaceholder)
 *   - Silueta corporal SVG para el bloque "Sobre mí" (chSilueta)
 *
 * Inyecta sus propios estilos/animaciones, así cualquier página que cargue este
 * archivo obtiene banderas ondeando y escudos girando sin CSS extra.
 */
(function () {
  "use strict";

  /* ----------------------------- Helpers ----------------------------- */
  function chSlug(n) {
    return String(n || "")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function chSafe(t) {
    return String(t == null ? "" : t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function chHash(str) {
    let h = 2166136261;
    const s = String(str || "");
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function chNorm(t) {
    return String(t || "").trim().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  /* --------------------------- Theme engine --------------------------- */
  // Palabras clave que marcan una categoría como "adulto".
  const ADULTO_KEYS = [
    "escort", "acompan", "masaj", "webcam", "sexo", "erotic", "table",
    "vip", "gigolo", "sugar", "fetiche", "dominacion", "trans", "travesti",
    "swinger", "striptease", "fantasia"
  ];

  function esAdulto(cat) {
    const c = chNorm(cat);
    if (!c) return false;
    return ADULTO_KEYS.some(function (k) { return c.indexOf(k) !== -1; });
  }

  function temaDe(cat) {
    return esAdulto(cat) ? "adult" : "pro";
  }

  // Detecta si la cuenta es una EMPRESA/negocio (no por categoría sino por tipo de registro).
  function esEmpresa(u) {
    u = u || {};
    if (u.esEmpresa === true || u.empresa === true) return true;
    var t = chNorm(u.tipoCuenta || u.tipoPerfil || u.tipoRegistro || u.cuentaTipo || u.tipo || u.rol || "");
    return t.indexOf("empres") !== -1 || t.indexOf("negoc") !== -1;
  }

  // Tipo de perfil para elegir la plantilla: 'adult' | 'empresa' | 'pro'.
  function tipoPerfil(u) {
    u = u || {};
    if (esAdulto(u.categoria)) return "adult";
    if (esEmpresa(u)) return "empresa";
    return "pro";
  }

  function aplicarTema(cat, el) {
    (el || document.body).setAttribute("data-tema", temaDe(cat));
    return temaDe(cat);
  }

  // Aplica el data-tema según el documento completo (considera empresa).
  function aplicarTipo(u, el) {
    var t = tipoPerfil(u);
    (el || document.body).setAttribute("data-tema", t);
    return t;
  }

  /* ----------------------------- Banderas ----------------------------- */
  const EMOJI = {
    "México": "🇲🇽", "Estados Unidos": "🇺🇸", "Colombia": "🇨🇴", "Canadá": "🇨🇦",
    "España": "🇪🇸", "Perú": "🇵🇪", "Chile": "🇨🇱", "Argentina": "🇦🇷",
    "Brasil": "🇧🇷", "Reino Unido": "🇬🇧", "Australia": "🇦🇺", "Francia": "🇫🇷"
  };

  // Banderas SVG estilizadas (viewBox 0 0 60 40), personalizadas por país.
  const FLAG_SVG = {
    "México": '<rect width="20" height="40" fill="#006847"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#ce1126"/><circle cx="30" cy="20" r="4.3" fill="none" stroke="#7c5326" stroke-width="1.4"/><circle cx="30" cy="20" r="1.5" fill="#7c5326"/>',
    "Estados Unidos": '<rect width="60" height="40" fill="#fff"/><g fill="#b22234"><rect width="60" height="3.1"/><rect y="6.2" width="60" height="3.1"/><rect y="12.3" width="60" height="3.1"/><rect y="18.4" width="60" height="3.1"/><rect y="24.6" width="60" height="3.1"/><rect y="30.7" width="60" height="3.1"/><rect y="36.9" width="60" height="3.1"/></g><rect width="26" height="21.5" fill="#3c3b6e"/><g fill="#fff"><circle cx="5" cy="4" r="1"/><circle cx="11" cy="4" r="1"/><circle cx="17" cy="4" r="1"/><circle cx="23" cy="4" r="1"/><circle cx="8" cy="8" r="1"/><circle cx="14" cy="8" r="1"/><circle cx="20" cy="8" r="1"/><circle cx="5" cy="12" r="1"/><circle cx="11" cy="12" r="1"/><circle cx="17" cy="12" r="1"/><circle cx="23" cy="12" r="1"/></g>',
    "Colombia": '<rect width="60" height="20" fill="#fcd116"/><rect y="20" width="60" height="10" fill="#003893"/><rect y="30" width="60" height="10" fill="#ce1126"/>',
    "Canadá": '<rect width="15" height="40" fill="#d52b1e"/><rect x="15" width="30" height="40" fill="#fff"/><rect x="45" width="15" height="40" fill="#d52b1e"/><path d="M30 9 l1.6 4.4 4.4-1 -2.4 3.8 3.8 1.2 -3.8 1.2 1.2 4.2 -3.5-2.4 -1.3 3.6 -1.3-3.6 -3.5 2.4 1.2-4.2 -3.8-1.2 3.8-1.2 -2.4-3.8 4.4 1z" fill="#d52b1e"/>',
    "España": '<rect width="60" height="40" fill="#c60b1e"/><rect y="10" width="60" height="20" fill="#ffc400"/><circle cx="18" cy="20" r="3" fill="none" stroke="#c60b1e" stroke-width="1.2"/>',
    "Perú": '<rect width="20" height="40" fill="#d91023"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#d91023"/>',
    "Chile": '<rect width="60" height="20" fill="#fff"/><rect y="20" width="60" height="20" fill="#d52b1e"/><rect width="24" height="20" fill="#0039a6"/><path d="M12 5 l1.5 4.2 4.4 0 -3.6 2.6 1.4 4.2 -3.7-2.6 -3.7 2.6 1.4-4.2 -3.6-2.6 4.4 0z" fill="#fff"/>',
    "Argentina": '<rect width="60" height="13.3" fill="#74acdf"/><rect y="13.3" width="60" height="13.3" fill="#fff"/><rect y="26.6" width="60" height="13.4" fill="#74acdf"/><circle cx="30" cy="20" r="3.4" fill="#f6b40e"/>',
    "Brasil": '<rect width="60" height="40" fill="#009b3a"/><path d="M30 4 L54 20 L30 36 L6 20 Z" fill="#fedf00"/><circle cx="30" cy="20" r="7.5" fill="#002776"/>',
    "Reino Unido": '<rect width="60" height="40" fill="#012169"/><path d="M0 0 L60 40 M60 0 L0 40" stroke="#fff" stroke-width="8"/><path d="M0 0 L60 40 M60 0 L0 40" stroke="#c8102e" stroke-width="3.5"/><rect x="25" width="10" height="40" fill="#fff"/><rect y="15" width="60" height="10" fill="#fff"/><rect x="27" width="6" height="40" fill="#c8102e"/><rect y="17" width="60" height="6" fill="#c8102e"/>',
    "Australia": '<rect width="60" height="40" fill="#012169"/><path d="M0 0 L30 20 M30 0 L0 20" stroke="#fff" stroke-width="4"/><rect x="12.5" width="5" height="20" fill="#fff"/><rect y="7.5" width="30" height="5" fill="#fff"/><rect x="13.5" width="3" height="20" fill="#c8102e"/><rect y="8.5" width="30" height="3" fill="#c8102e"/><circle cx="44" cy="28" r="1.6" fill="#fff"/><circle cx="50" cy="18" r="1.4" fill="#fff"/><circle cx="52" cy="30" r="1.4" fill="#fff"/>',
    "Francia": '<rect width="20" height="40" fill="#0055a4"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#ef4135"/>'
  };

  function chFlag(pais) {
    var inner = FLAG_SVG[pais];
    var body = inner
      ? '<svg viewBox="0 0 60 40" preserveAspectRatio="none" class="ch-flag-svg" aria-hidden="true">' + inner + '</svg>'
      : '<span class="ch-flag-emoji">' + (EMOJI[pais] || "🌍") + '</span>';
    var d = (chHash(pais) % 22) / 10;
    return '<span class="ch-flag" title="' + chSafe(pais) + '">' +
      '<span class="ch-flag__pole" aria-hidden="true"></span>' +
      '<span class="ch-flag__cloth" style="animation-delay:-' + d + 's">' + body + '</span>' +
      '</span>';
  }

  /* ------------------------------ Escudos ----------------------------- */
  const PAL = [
    { mid: "#b23a6e", dark: "#7a2b53" },
    { mid: "#2f5fa0", dark: "#173a6b" },
    { mid: "#4a2c8f", dark: "#2e1a5c" },
    { mid: "#1c7a6c", dark: "#0f5147" },
    { mid: "#b8455a", dark: "#7d2738" },
    { mid: "#cf4d8c", dark: "#9b2a66" }
  ];

  var _seq = 0;

  function chAbrev(nombre) {
    var palabras = String(nombre || "")
      .replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, " ")
      .trim().split(/\s+/).filter(Boolean)
      .filter(function (w) { return !/^(de|del|la|las|los|y|el)$/i.test(w); });
    var abbr;
    if (palabras.length >= 2) abbr = palabras[0][0] + palabras[1][0];
    else if (palabras.length === 1) abbr = palabras[0].slice(0, 3);
    else abbr = String(nombre || "?").slice(0, 2);
    return chSafe(abbr.toUpperCase());
  }

  function chShield(nombre) {
    var h = chHash(chSlug(nombre) + "-escudo");
    var p = PAL[h % PAL.length];
    var id = "chesc" + (++_seq);
    var abbr = chAbrev(nombre);
    var fs = abbr.length >= 3 ? 12 : 15;
    var delay = (h % 40) / 10;
    return '<svg class="ch-shield" viewBox="0 0 40 48" style="animation-delay:-' + delay + 's" aria-hidden="true">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + p.mid + '"/><stop offset="1" stop-color="' + p.dark + '"/></linearGradient></defs>' +
      '<path d="M6 5 H34 V24 C34 36 26 43 20 45 C14 43 6 36 6 24 Z" fill="url(#' + id + ')" stroke="#ffffff" stroke-width="2.4"/>' +
      '<path d="M9 8 H31 V24 C31 34 25 39.5 20 41.5 C15 39.5 9 34 9 24 Z" fill="none" stroke="#ffd87a" stroke-width="1.1" opacity=".85"/>' +
      '<polygon points="20,2 21.6,5.4 25.2,5.4 22.3,7.7 23.4,11.2 20,9.1 16.6,11.2 17.7,7.7 14.8,5.4 18.4,5.4" fill="#ffd87a"/>' +
      '<text x="20" y="27" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="' + fs + '" font-weight="900" fill="#ffffff">' + abbr + '</text>' +
      '</svg>';
  }

  /* ------------------------ Placeholder de foto ----------------------- */
  const FOTO_PAL = [
    { c1: "#ffd36e", c2: "#ff6f9c" }, { c1: "#c2a3ff", c2: "#6a3fb5" },
    { c1: "#7ff0d2", c2: "#1f9e8f" }, { c1: "#ffc39a", c2: "#ff5d73" },
    { c1: "#ffe0ec", c2: "#ff8fc0" }, { c1: "#8ed7ff", c2: "#3a7bd5" }
  ];

  function chFotoPlaceholder(seed, label) {
    var h = chHash(chSlug(seed) || "x");
    var p = FOTO_PAL[h % FOTO_PAL.length];
    var id = "chfoto" + (++_seq);
    var ini = String(label || seed || "?").trim().slice(0, 1).toUpperCase();
    return '<svg class="ch-foto-ph" viewBox="0 0 100 130" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + p.c1 + '"/><stop offset="1" stop-color="' + p.c2 + '"/></linearGradient></defs>' +
      '<rect width="100" height="130" fill="url(#' + id + ')"/>' +
      '<circle cx="50" cy="50" r="22" fill="rgba(255,255,255,.35)"/>' +
      '<path d="M18 130 C18 96 32 82 50 82 C68 82 82 96 82 130 Z" fill="rgba(255,255,255,.32)"/>' +
      '<text x="50" y="60" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="26" font-weight="900" fill="rgba(255,255,255,.92)">' + chSafe(ini) + '</text>' +
      '</svg>';
  }

  /* -------------------------- Silueta corporal ------------------------ */
  function chSilueta() {
    return '<svg class="ch-silueta" viewBox="0 0 90 220" aria-hidden="true">' +
      '<defs><linearGradient id="chsil" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#ff8ec4"/><stop offset="1" stop-color="#ec2d7a"/></linearGradient></defs>' +
      '<circle cx="45" cy="20" r="13" fill="url(#chsil)"/>' +
      '<path d="M45 33 C36 33 33 40 34 48 L31 95 C30 104 38 106 39 96 L43 70 L43 120 ' +
      'C43 150 40 175 38 200 C37 212 49 212 50 200 L52 150 L54 200 C55 212 67 212 66 200 ' +
      'C64 175 61 150 61 120 L61 70 L65 96 C66 106 74 104 73 95 L70 48 C71 40 68 33 59 33 ' +
      'C56 40 48 40 45 33 Z" fill="url(#chsil)"/>' +
      '</svg>';
  }

  /* ----------------------- Mapa estilizado (SVG) ---------------------- */
  function chMapa(centro) {
    var h = chHash(chSlug(centro) || "zona");
    var id = "chmap" + (++_seq);
    var cx = 120 + (h % 30) - 15;
    var cy = 90 + ((h >> 4) % 24) - 12;
    return '<svg class="ch-mapa" viewBox="0 0 240 170" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<defs><radialGradient id="' + id + '" cx="50%" cy="45%" r="60%">' +
      '<stop offset="0" stop-color="#dbeafe"/><stop offset="1" stop-color="#eef2f7"/></radialGradient></defs>' +
      '<rect width="240" height="170" fill="url(#' + id + ')"/>' +
      '<g stroke="#cfd8e3" stroke-width="2" fill="none">' +
      '<path d="M0 40 H240 M0 90 H240 M0 130 H240 M60 0 V170 M130 0 V170 M190 0 V170"/></g>' +
      '<path d="M-5 70 C40 60 70 95 120 88 C170 80 200 110 245 100 L245 170 L-5 170 Z" fill="#cfe8d6" opacity=".7"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="46" fill="rgba(37,99,235,.16)" stroke="rgba(37,99,235,.5)" stroke-width="2"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="6" fill="#2563eb"/>' +
      '<path d="M' + cx + ' ' + (cy - 22) + ' c-8 0 -14 6 -14 14 c0 10 14 22 14 22 c0 0 14 -12 14 -22 c0 -8 -6 -14 -14 -14 z" fill="#ec2d7a" stroke="#fff" stroke-width="1.5" opacity=".95"/>' +
      '</svg>';
  }

  /* --------------------- Moneda de donación (SVG) --------------------- */
  // Moneda dorada con estrella, brillo que recorre y chispas titilando.
  function chCoin(opts) {
    opts = opts || {};
    var id = "chcoin" + (++_seq);
    var cls = "ch-coin" + (opts.size === "lg" ? " ch-coin--lg" : (opts.size === "sm" ? " ch-coin--sm" : ""));
    var sello = opts.tipo === "diamante"
      ? '<path d="M20 11 L27 18 L20 30 L13 18 Z" fill="#fff7d6"/><path d="M13 18 H27 M20 11 L20 30" stroke="#e6a417" stroke-width=".8" opacity=".5"/>'
      : '<polygon points="20,9 22.8,16.6 30.6,16.6 24.3,21.3 26.7,29 20,24.3 13.3,29 15.7,21.3 9.4,16.6 17.2,16.6" fill="#fff7d6"/>';
    return '<span class="' + cls + '" aria-hidden="true">' +
      '<span class="ch-coin__disc">' +
      '<svg viewBox="0 0 40 40"><defs><radialGradient id="' + id + '" cx="38%" cy="32%" r="78%">' +
      '<stop offset="0" stop-color="#fff7c8"/><stop offset="45%" stop-color="#ffd34d"/><stop offset="100%" stop-color="#e0980f"/></radialGradient></defs>' +
      '<circle cx="20" cy="20" r="17" fill="url(#' + id + ')" stroke="#c9871a" stroke-width="2"/>' +
      '<circle cx="20" cy="20" r="12.5" fill="none" stroke="#fff2b0" stroke-width="1.2" opacity=".7"/>' +
      sello + '</svg>' +
      '<span class="ch-coin__shine"></span></span>' +
      '<span class="ch-coin__sp ch-coin__sp--1"></span>' +
      '<span class="ch-coin__sp ch-coin__sp--2"></span>' +
      '<span class="ch-coin__sp ch-coin__sp--3"></span>' +
      '</span>';
  }

  /* ------------------------- Estilos inyectados ----------------------- */
  function injectStyle() {
    if (document.getElementById("ch-ui-style")) return;
    var css = [
      /* Bandera ondeando */
      ".ch-flag{position:relative;display:inline-block;width:46px;height:32px;perspective:220px;vertical-align:middle}",
      ".ch-flag__pole{position:absolute;left:-3px;top:-3px;width:3px;height:42px;border-radius:2px;background:linear-gradient(180deg,#c9962f,#7c5a16);box-shadow:0 1px 2px rgba(0,0,0,.3)}",
      ".ch-flag__pole::before{content:'';position:absolute;left:-1px;top:-3px;width:5px;height:5px;border-radius:50%;background:#ffd87a}",
      ".ch-flag__cloth{position:absolute;inset:0;border-radius:0 4px 4px 0;overflow:hidden;transform-origin:left center;transform-style:preserve-3d;box-shadow:2px 3px 7px rgba(0,0,0,.22);animation:ch-wave 2.8s ease-in-out infinite}",
      ".ch-flag__cloth::after{content:'';position:absolute;inset:0;background:linear-gradient(100deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.35) 22%,rgba(0,0,0,.10) 46%,rgba(255,255,255,.30) 70%,rgba(0,0,0,.08) 100%);background-size:200% 100%;animation:ch-flag-shine 2.8s ease-in-out infinite;pointer-events:none}",
      ".ch-flag-svg{width:100%;height:100%;display:block}",
      ".ch-flag-emoji{display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:24px;background:#fff}",
      "@keyframes ch-wave{0%,100%{transform:rotateY(0) skewY(0)}25%{transform:rotateY(-9deg) skewY(1.6deg)}50%{transform:rotateY(0) skewY(0)}75%{transform:rotateY(9deg) skewY(-1.6deg)}}",
      "@keyframes ch-flag-shine{0%,100%{background-position:0 0}50%{background-position:100% 0}}",
      /* Escudo giratorio */
      ".ch-shield{display:inline-block;width:30px;height:36px;vertical-align:middle;filter:drop-shadow(0 1px 3px rgba(0,0,0,.25));transform-origin:center center;transform-style:preserve-3d;animation:ch-shield-spin 5.5s linear infinite}",
      "@keyframes ch-shield-spin{from{transform:perspective(260px) rotateY(0)}to{transform:perspective(260px) rotateY(360deg)}}",
      /* Placeholder y silueta */
      ".ch-foto-ph{width:100%;height:100%;display:block}",
      ".ch-silueta{width:100%;height:100%;display:block}",
      ".ch-mapa{width:100%;height:100%;display:block}",
      /* Moneda de donación */
      ".ch-coin{position:relative;display:inline-block;width:30px;height:30px;vertical-align:middle}",
      ".ch-coin--sm{width:22px;height:22px}",
      ".ch-coin--lg{width:46px;height:46px}",
      ".ch-coin__disc{position:absolute;inset:0;border-radius:50%;overflow:hidden;filter:drop-shadow(0 2px 4px rgba(176,120,10,.5))}",
      ".ch-coin__disc svg{width:100%;height:100%;display:block;animation:ch-coin-pulse 2.2s ease-in-out infinite}",
      ".ch-coin__shine{position:absolute;top:-25%;left:-45%;width:32%;height:150%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.9),transparent);transform:skewX(-18deg);animation:ch-coin-shine 2.6s ease-in-out infinite}",
      ".ch-coin__sp{position:absolute;width:5px;height:5px;border-radius:50%;background:radial-gradient(circle,#fff 0%,rgba(255,255,255,0) 70%);opacity:0;animation:ch-spark 1.8s ease-in-out infinite}",
      ".ch-coin__sp--1{top:-3px;right:-1px;animation-delay:0s}",
      ".ch-coin__sp--2{bottom:-2px;left:0;animation-delay:.6s}",
      ".ch-coin__sp--3{top:40%;right:-4px;animation-delay:1.1s}",
      "@keyframes ch-coin-shine{0%{left:-45%}55%,100%{left:120%}}",
      "@keyframes ch-coin-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}",
      "@keyframes ch-spark{0%,100%{opacity:0;transform:scale(.3)}50%{opacity:1;transform:scale(1.25)}}",
      /* Accesibilidad */
      "@media (prefers-reduced-motion: reduce){.ch-flag__cloth,.ch-flag__cloth::after,.ch-shield,.ch-coin__disc svg,.ch-coin__shine,.ch-coin__sp{animation:none !important}}"
    ].join("\n");
    var st = document.createElement("style");
    st.id = "ch-ui-style";
    st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  }

  if (typeof document !== "undefined") {
    injectStyle();
  }

  window.CHUI = {
    chSlug: chSlug, chSafe: chSafe, chHash: chHash, chNorm: chNorm,
    esAdulto: esAdulto, esEmpresa: esEmpresa, temaDe: temaDe, tipoPerfil: tipoPerfil,
    aplicarTema: aplicarTema, aplicarTipo: aplicarTipo,
    chFlag: chFlag, chShield: chShield,
    chFotoPlaceholder: chFotoPlaceholder, chSilueta: chSilueta, chMapa: chMapa,
    chCoin: chCoin
  };
})();
