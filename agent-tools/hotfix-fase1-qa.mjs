/**
 * HOTFIX Fase 1 — QA estático + smoke HTTP local (sin browser).
 * node agent-tools/hotfix-fase1-qa.mjs
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const pub = path.join(root, 'public');
const base = process.env.QA_BASE || 'http://127.0.0.1:3457';

const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

function read(rel) {
  return fs.readFileSync(path.join(pub, rel), 'utf8');
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

// ── Assets ──
ok('asset estado webp', fs.existsSync(path.join(pub, 'assets/placeholders/estado-placeholder.webp')));
ok('asset live webp', fs.existsSync(path.join(pub, 'assets/placeholders/live-placeholder.webp')));

// ── Sin libe legacy en fuentes clave ──
const noLibe = [
  'js/ch-slot-dock.js',
  'js/banner-resultados-laterales.js',
  'js/banner-sin-resultados.js',
  'js/carihub-media-placeholders.js',
  'index.html',
  'resultados.html',
  'registro-perfil.html'
];
noLibe.forEach((f) => {
  const s = read(f);
  ok('no libe png: ' + f, !/estado-publicado-libe|live-en-vivo-libe/.test(s));
});

ok('preview usa CariHubMediaPlaceholders', /CariHubMediaPlaceholders\.url/.test(read('preview/perfil-vista-previa.html')));

// ── CSS scoped (no global .ch-media-ph en ch-slot-dock) ──
const dockCss = read('css/ch-slot-dock.css');
ok('ch-slot-dock sin .ch-media-ph global', !/^\.ch-media-ph/m.test(dockCss));
ok('carihub-media-placeholders.css existe', fs.existsSync(path.join(pub, 'css/carihub-media-placeholders.css')));

// ── index enlaces CSS modal ──
const indexHtml = read('index.html');
ok('index carga home-sector-subcat.css', /home-sector-subcat\.css/.test(indexHtml));
ok('index carga carihub-media-placeholders.css', /carihub-media-placeholders\.css/.test(indexHtml));

// ── ch-slot-dock mock con ch-media-ph ──
ok('ch-slot-dock mock class ph', /ch-media-ph--/.test(read('js/ch-slot-dock.js')));

// ── HTTP smoke ──
const pages = [
  '/',
  '/resultados',
  '/registro-perfil',
  '/assets/placeholders/estado-placeholder.webp',
  '/assets/placeholders/live-placeholder.webp'
];

for (const p of pages) {
  try {
    const { status, body } = await fetchText(base + p);
    ok('HTTP ' + p, status === 200, 'status=' + status);
    if (p === '/' || p.endsWith('index.html')) {
      ok('index HTML incluye placeholders script', /carihub-media-placeholders\.js/.test(body));
      ok('index HTML incluye home-sector-subcat.css', /home-sector-subcat\.css/.test(body));
    }
    if (p === '/resultados' || p.endsWith('resultados.html')) {
      ok('resultados CSS ph', /carihub-media-placeholders\.css/.test(body));
    }
  } catch (e) {
    ok('HTTP ' + p, false, String(e.message || e));
  }
}

console.log('\n=== HOTFIX QA ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '(' + p.detail + ')' : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, f.detail ? '(' + f.detail + ')' : ''));
  process.exit(1);
}
console.log('\nALL PASS');
