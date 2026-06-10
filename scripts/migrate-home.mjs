import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const MOCKUP = path.join(ROOT, 'tmp/preview/v3/home-html-real-mockup-v4.html');
const OLD_INDEX = path.join(ROOT, 'public/index.html');
const OUT_CSS = path.join(ROOT, 'public/css/home.css');
const OUT_MODAL_CSS = path.join(ROOT, 'public/css/home-modals.css');
const OUT_HERO_JS = path.join(ROOT, 'public/js/hero-home.js');
const OUT_UI_JS = path.join(ROOT, 'public/js/home-ui.js');
const OUT_BRIDGE_JS = path.join(ROOT, 'public/js/home-bridge.js');
const OUT_INDEX = path.join(ROOT, 'public/index.html');
const BACKUP = path.join(ROOT, 'public/index-legacy.html');

const mockup = fs.readFileSync(MOCKUP, 'utf8');
const oldIndex = fs.readFileSync(OLD_INDEX, 'utf8');

function extractBetween(src, start, end) {
  const i = src.indexOf(start);
  const j = src.indexOf(end, i + start.length);
  if (i < 0 || j < 0) throw new Error('Missing marker: ' + start);
  return src.slice(i + start.length, j);
}

// ── CSS from mockup ──
let css = extractBetween(mockup, '<style>\n', '\n</style>');
const cssDropPatterns = [
  /^\.mockup-tag[\s\S]*?(?=\n\.home\{|\n\/\*|\nbody\.)/m,
  /^\.proto-vista-btns[\s\S]*?(?=\n\.home\{|\n\/\*)/m,
  /^\.proto-metrics[\s\S]*?(?=\n\.home\{|\n\/\*)/m,
  /^\/\*[^*]*device[\s\S]*?body\.proto-iphone \.device-shell[\s\S]*?body\.proto-laptop \.home\{[\s\S]*?\n\}/m,
  /^body\.proto-iphone\{[\s\S]*?--iphone-h[\s\S]*?\}/m,
  /^body\.proto-iphone \.device-shell[\s\S]*?body\.proto-laptop \.device-laptop-base[\s\S]*?\}/m,
  /^body\.proto-tablet\{[\s\S]*?body\.proto-tablet-h \.home\{[\s\S]*?\n\}/m,
  /^\.device-laptop-base[\s\S]*?body:not\(\.proto-active\)[\s\S]*?display:contents\}/m,
  /^\/\* ── Pickers mockup[\s\S]*?body\[data-logo-cap="c6"\][\s\S]*?\}/m,
  /^\.legend\{[\s\S]*?\}/m,
];
cssDropPatterns.forEach((re) => { css = css.replace(re, ''); });

css += `

/* ── Producción: sin marco mockup ── */
body{background:#fff;margin:0}
.home{width:100%;max-width:100%;margin:0;box-shadow:none}
body.proto-iphone .home{--page-w:100%;width:100%;max-width:100%;margin:0}
body.proto-tablet .home,body.proto-tablet-h .home{--page-w:100%;width:100%;max-width:820px;margin:0 auto}
body.proto-laptop .home{--page-w:521px;width:100%;max-width:521px;margin:0 auto;box-shadow:0 0 0 1px #d0d0d0,0 16px 40px rgba(0,0,0,.08)}
.visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
`;

// ── Modal CSS from legacy index ──
const legacyCss = extractBetween(oldIndex, '<style>\n', '\n</style>');
const modalCss = legacyCss.replace(/^:root\{[\s\S]*?\}\s*/m, '')
  .replace(/^\.contenedor-portada[\s\S]*?\.hs-busqueda-avanzada\{[\s\S]*?\}\s*/m, '')
  .replace(/^\.home-ad-premium[\s\S]*?@media\(max-width:520px\)\{[\s\S]*?\}\s*/m, '')
  .replace(/^@media\(max-width:600px\)\{[\s\S]*?\}\s*/m, '');

fs.writeFileSync(OUT_CSS, css.trim() + '\n');
fs.writeFileSync(OUT_MODAL_CSS, modalCss.trim() + '\n');

// ── hero-home.js ──
let heroJs = fs.readFileSync(path.join(ROOT, 'tmp/preview/v3/hero-home.js'), 'utf8');
heroJs = heroJs.replace(/assets\/user\//g, 'img/home/');
fs.writeFileSync(OUT_HERO_JS, heroJs);

// ── home-ui.js from mockup inline script ──
let uiJs = extractBetween(mockup, "<script>\n(function () {\n  'use strict';", '\n})();\n</script>');
const uiCut = uiJs.indexOf('\n  var DEVICES = {');
if (uiCut > 0) uiJs = uiJs.slice(0, uiCut);

uiJs = uiJs
  .replace(/var CATEGORIAS = window\.CARIHUB_CATEGORIAS_HOME \|\| \[\];/,
    'var CATEGORIAS = (window.CARIHUB_CATEGORIAS_HOME || []);')
  .replace(
    'closeCatPickerModal(document.getElementById(\'modal-categorias\'));\n  }',
    `closeCatPickerModal(document.getElementById('modal-categorias'));
    if (cat && typeof window.setCategoriaHome === 'function') window.setCategoriaHome(cat.nombre);
  }`
  )
  .replace(/document\.querySelectorAll\('\[data-modal\]'\)\.forEach[\s\S]*?\}\);/,
    `document.querySelectorAll('[data-modal]').forEach(function (el) {
    var id = el.getAttribute('data-modal');
    if (id === 'favoritos' || id === 'registro' || id === 'avanzada') return;
    el.addEventListener('click', function () { openModal(id); });
  });`
  );

const uiFooter = `
  function applyViewportClass() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    document.body.classList.remove('proto-iphone', 'proto-tablet', 'proto-tablet-h', 'proto-laptop');
    if (w >= 1100) document.body.classList.add('proto-laptop');
    else if (w >= 820 && w > h) document.body.classList.add('proto-tablet-h');
    else if (w >= 600) document.body.classList.add('proto-tablet');
    else document.body.classList.add('proto-iphone');
    rebuildHeroCopyLayers();
    resetHeroTimer();
    mountLowerSparkles();
  }

  function mountLowerSparkles() {
    var root = document.querySelector('.home-page-lower-sparkles');
    if (!root) return;
    root.innerHTML = '';
    if (!document.body.classList.contains('proto-iphone')) return;
    var lower = [
      ['flash','12%','8%','38px','-24px','.2s','3.1s','6px'],['glow','28%','14%','-34px','28px','1.1s','5.4s','7px'],
      ['chrome','46%','10%','42px','-30px','.6s','4.5s','6px'],['star','64%','16%','-40px','-26px','1.8s','4.8s','9px'],
      ['flash','82%','12%','36px','32px','2.4s','3.3s','5px'],['glow','18%','22%','44px','-34px','3.2s','5.9s','7px'],
      ['chrome','36%','26%','-38px','36px','.9s','4.2s','6px'],['star','54%','20%','48px','-22px','2.1s','5.1s','8px'],
      ['flash','72%','28%','-46px','-28px','3.8s','3.6s','5px'],['glow','90%','24%','34px','30px','1.4s','6.1s','7px'],
      ['chrome','8%','34%','-42px','24px','4.2s','4.7s','6px'],['star','24%','38%','40px','-38px','2.7s','4.9s','9px'],
      ['flash','42%','32%','-36px','-32px','.4s','3.4s','5px'],['glow','58%','40%','46px','26px','3.5s','5.6s','7px'],
      ['chrome','76%','36%','-44px','-20px','1.7s','4.4s','6px'],['star','92%','42%','32px','-42px','2.9s','5.2s','8px'],
      ['flash','16%','48%','-50px','18px','4.6s','3.2s','5px'],['glow','34%','52%','38px','-28px','1.2s','6s','7px'],
      ['chrome','52%','46%','-34px','34px','3.1s','4.6s','6px'],['star','68%','54%','42px','-24px','2.2s','4.7s','9px'],
      ['flash','86%','50%','-40px','-30px','.8s','3.5s','5px'],['glow','48%','30%','-28px','40px','5s','5.8s','8px'],
      ['flash','6%','44%','30px','22px','2.5s','3.8s','6px'],['star','38%','56%','-32px','28px','3.7s','4.3s','10px'],
      ['chrome','62%','60%','36px','-36px','1.9s','5.3s','7px'],['glow','22%','62%','44px','30px','4.1s','5.7s','8px'],
      ['flash','78%','66%','-36px','26px','2.8s','3.9s','6px'],['star','50%','70%','40px','-32px','1.5s','4.6s','9px']
    ];
    lower.forEach(function (row) {
      var el = document.createElement('span');
      el.className = 'home-hero__spark home-hero__spark--' + row[0];
      el.setAttribute('style', '--x:' + row[1] + ';--y:' + row[2] + ';--dx:' + row[3] + ';--dy:' + row[4] + ';--d:' + row[5] + ';--dur:' + row[6] + ';--sz:' + row[7]);
      root.appendChild(el);
    });
  }

  document.body.setAttribute('data-logo-sil', 's1');
  var logoSil = document.getElementById('logoSilhouette');
  if (logoSil) logoSil.removeAttribute('hidden');

  applyViewportClass();
  window.addEventListener('resize', applyViewportClass);

  buildCatPicker();
  initHeroCarousel();
  initCategorySlots();
  startCategoryRotation();
  startAdRotation();
`;

fs.writeFileSync(OUT_UI_JS, `(function () {\n  'use strict';\n${uiJs.trim()}\n${uiFooter}\n})();\n`);

// ── home-bridge.js ──
fs.writeFileSync(OUT_BRIDGE_JS, `(function () {
  'use strict';

  function syncFieldLabels() {
    var map = [
      ['textoCategoria', 'fieldCategoriaLabel', 'fieldCategoria'],
      ['textoPais', 'fieldPaisLabel', 'fieldPais'],
      ['textoEstado', 'fieldEstadoLabel', 'fieldEstado'],
      ['textoCiudad', 'fieldCiudadLabel', 'fieldCiudad']
    ];
    map.forEach(function (row) {
      var src = document.getElementById(row[0]);
      var label = document.getElementById(row[1]);
      var field = document.getElementById(row[2]);
      if (!src || !label) return;
      if (src.textContent) {
        label.textContent = src.textContent;
        if (field) field.classList.add('is-selected');
      }
    });
  }

  window.setCategoriaHome = function (nombre) {
    categoriaSeleccionada = nombre;
    if (typeof mostrarTextoSeleccionado === 'function') {
      mostrarTextoSeleccionado('textoCategoria', nombre);
    }
    var label = document.getElementById('fieldCategoriaLabel');
    if (label) label.textContent = nombre;
    var field = document.getElementById('fieldCategoria');
    if (field) field.classList.add('is-selected');
  };

  var _mostrar = window.mostrarTextoSeleccionado;
  if (typeof _mostrar === 'function') {
    window.mostrarTextoSeleccionado = function (id, valor) {
      _mostrar(id, valor);
      var map = {
        textoCategoria: 'fieldCategoriaLabel',
        textoPais: 'fieldPaisLabel',
        textoEstado: 'fieldEstadoLabel',
        textoCiudad: 'fieldCiudadLabel'
      };
      var fieldMap = {
        textoCategoria: 'fieldCategoria',
        textoPais: 'fieldPais',
        textoEstado: 'fieldEstado',
        textoCiudad: 'fieldCiudad'
      };
      var label = document.getElementById(map[id]);
      if (label) label.textContent = valor;
      var field = document.getElementById(fieldMap[id]);
      if (field) field.classList.add('is-selected');
    };
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (window.CATALOGO_CATEGORIAS_CARIHUB) {
      window.CATEGORIAS_BUSCADOR = CATALOGO_CATEGORIAS_CARIHUB.map(function (c) { return c.nombre; });
      window.CARIHUB_CATEGORIAS_HOME = CATALOGO_CATEGORIAS_CARIHUB.map(function (c) {
        return { id: c.id, nombre: c.nombre, emoji: c.emoji };
      });
    }
    syncFieldLabels();

    var menuBtn = document.querySelector('.home-header__btn[aria-label="Menú"]');
    if (menuBtn) menuBtn.addEventListener('click', function () { abrirMenu(); });

    var favBtn = document.querySelector('.home-header__btn[aria-label="Favoritos"]');
    if (favBtn) {
      favBtn.removeAttribute('data-modal');
      favBtn.addEventListener('click', function () { abrirFavoritos(); });
    }

    var btnBuscar = document.querySelector('.home-btn--buscar-ahora');
    if (btnBuscar) btnBuscar.addEventListener('click', function () { buscarPerfilesFiltrados(); });

    var btnCerca = document.getElementById('btnCerca');
    if (btnCerca) btnCerca.addEventListener('click', function () { detectarUbicacion(); });

    document.querySelectorAll('.home-zona-pill').forEach(function (pill) {
      var ciudad = pill.textContent.trim();
      pill.style.cursor = 'pointer';
      pill.addEventListener('click', function () { buscarCiudadRapida(ciudad); });
    });

    var btnZonas = document.querySelector('.home-zonas__more');
    if (btnZonas) btnZonas.addEventListener('click', function () { abrirSelector('ciudad'); });

    document.querySelectorAll('[data-modal="registro"]').forEach(function (el) {
      el.removeAttribute('data-modal');
      el.addEventListener('click', function () { abrirRegistro(); });
    });

    document.querySelectorAll('[data-modal="avanzada"]').forEach(function (el) {
      el.removeAttribute('data-modal');
      el.addEventListener('click', function () { abrirBusquedaAvanzada(); });
    });

    var fieldPais = document.getElementById('fieldPais');
    if (fieldPais) fieldPais.addEventListener('click', function () { abrirSelector('pais'); });
    var fieldEstado = document.getElementById('fieldEstado');
    if (fieldEstado) fieldEstado.addEventListener('click', function () { abrirSelector('estado'); });
    var fieldCiudad = document.getElementById('fieldCiudad');
    if (fieldCiudad) fieldCiudad.addEventListener('click', function () { abrirSelector('ciudad'); });

    document.querySelectorAll('.home-cat-card').forEach(function (btn) {
      btn.addEventListener('dblclick', function () {
        var label = btn.getAttribute('aria-label') || '';
        var m = label.match(/Encuentra\\s+(.+?)\\s+cerca/i);
        if (m && m[1]) buscarCategoriaRapida(m[1]);
      });
    });
  });
})();\n`);

// ── Main HTML from mockup ──
let mainHtml = extractBetween(mockup, '<main class="home"', '</main>');
mainHtml = '<main class="home" id="homeApp" data-tema="escort"' + mainHtml;

mainHtml = mainHtml
  .replace(/assets\/user\//g, 'img/home/')
  .replace(/\.\.\/shared\/logo-carinosas-marca\.png/g, 'img/home/logo-carinosas-marca.png')
  .replace(
    '<div class="home-field home-surface-pastel" role="button" tabindex="0">\n        <svg class="home-field__svg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9"',
    '<div class="home-field home-surface-pastel" id="fieldPais" role="button" tabindex="0">\n        <svg class="home-field__svg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9"'
  )
  .replace(
    '<span class="home-field__label">Elegir País</span>',
    '<span class="home-field__label" id="fieldPaisLabel">Elegir País</span>'
  )
  .replace(
    '<div class="home-field home-surface-pastel" role="button" tabindex="0">\n        <svg class="home-field__svg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 20l4-8 4 5 4-9 6 12"',
    '<div class="home-field home-surface-pastel" id="fieldEstado" role="button" tabindex="0">\n        <svg class="home-field__svg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 20l4-8 4 5 4-9 6 12"'
  )
  .replace(
    '<span class="home-field__label">Elegir Estado</span>',
    '<span class="home-field__label" id="fieldEstadoLabel">Elegir Estado</span>'
  )
  .replace(
    '<div class="home-field home-surface-pastel" role="button" tabindex="0">\n        <svg class="home-field__svg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s-7-5.4-7-11a7 7 0 1 1 14 0c0 5.6-7 11-7 11z"',
    '<div class="home-field home-surface-pastel" id="fieldCiudad" role="button" tabindex="0">\n        <svg class="home-field__svg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s-7-5.4-7-11a7 7 0 1 1 14 0c0 5.6-7 11-7 11z"'
  )
  .replace(
    '<span class="home-field__label">Elegir Ciudad</span>',
    '<span class="home-field__label" id="fieldCiudadLabel">Elegir Ciudad</span>'
  );

// ── Mockup modals ──
const mockupModals = extractBetween(mockup, '<!-- Modales trust + registro -->', '<aside id="carihub-agente"');

// ── Legacy modals + app script ──
const legacyModalsAndRest = extractBetween(oldIndex, '<div class="menu" id="menu">', '<script>\nfunction abrirMenu');
const legacyAppScript = 'function abrirMenu' + extractBetween(oldIndex, '<script>\nfunction abrirMenu', '</script>\n\n</body>');

const indexHtml = `<!DOCTYPE html>
<html lang="es" data-tema="escort">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cariñosas — Acompañantes independientes cerca de ti</title>
<meta name="description" content="Encuentra acompañantes cariñosas cerca de ti. Perfiles reales, verificados y actualizados.">
<link href="https://fonts.googleapis.com/css2?family=Allura&family=Great+Vibes&family=Italianno&family=Montserrat:wght@500;600;700;800;900&family=Pinyon+Script&family=Sacramento&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/home.css">
<link rel="stylesheet" href="css/home-modals.css">
<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-storage-compat.js"></script>
<script src="paises.js"></script>
<script src="estados.js"></script>
<script src="ciudades.js"></script>
<script src="js/catalogos-carihub.js"></script>
<script>
const firebaseConfig = {
  apiKey: "AIzaSyBl4LNLtPqbyIxfTfONAqxi4rOG4XF_vkI",
  authDomain: "carinosas-app.firebaseapp.com",
  projectId: "carinosas-app",
  storageBucket: "carinosas-app.firebasestorage.app",
  messagingSenderId: "267078845023",
  appId: "1:267078845023:web:a82e626d9f0ca28858d1ea"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

const WHATSAPP_ADMIN = "528112304664";
const LINK_STRIPE = "https://buy.stripe.com/eVq8wR5Wr9GccXUbmbcAo00";
const LINK_MERCADO_PAGO = "https://mpago.la/1KQ3iuP";

const ETIQUETAS_ESTADO_SOLICITUD_PUBLICIDAD = {
  pendiente: "Pendiente",
  en_revision: "En revisión",
  requiere_correccion: "Requiere corrección",
  autorizado_pago: "Autorizado pago",
  activo: "Activo",
  rechazado: "Rechazado",
  vencido: "Vencido"
};

let UID_PANEL = null;
let UID_EDITANDO = null;
let visitasTotales = 0;
let visitasHoy = 0;
let usuariosOnline = 0;
let categoriaSeleccionada = "";
let paisSeleccionado = "";
let estadoSeleccionado = "";
let ciudadSeleccionada = "";
let selectorActual = "";

const CATEGORIAS_BUSCADOR = [
  "Escort","Spa","Swinger 🍍","Contenido","Trans","Sex shop","Acompañante","Gigolo",
  "Madura","Dotados","Petit","Unicorns 🦄","Hotwife 🔥","Singles","Fetiche","Sado","VIP","Otro"
];
</script>
</head>
<body data-page="home">

<span id="textoCategoria" class="visually-hidden" aria-hidden="true"></span>
<span id="textoPais" class="visually-hidden" aria-hidden="true"></span>
<span id="textoEstado" class="visually-hidden" aria-hidden="true"></span>
<span id="textoCiudad" class="visually-hidden" aria-hidden="true"></span>

${mainHtml}

${mockupModals}

<div class="menu" id="menu">
${legacyModalsAndRest.trim()}
</div>

<script>
${legacyAppScript.trim()}
</script>
<script src="js/hero-home.js"></script>
<script src="js/home-ui.js"></script>
<script src="js/home-bridge.js"></script>
</body>
</html>
`;

if (!fs.existsSync(BACKUP)) {
  fs.copyFileSync(OLD_INDEX, BACKUP);
}
fs.writeFileSync(OUT_INDEX, indexHtml);

console.log('Migration complete:');
console.log('  backup:', BACKUP);
console.log('  css:', OUT_CSS, '(' + fs.statSync(OUT_CSS).size + ' bytes)');
console.log('  index:', OUT_INDEX, '(' + fs.statSync(OUT_INDEX).size + ' bytes)');
