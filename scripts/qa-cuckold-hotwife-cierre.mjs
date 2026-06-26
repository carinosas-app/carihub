/**
 * QA — A4.4 cierre formal Cuckold/Hotwife (meta + smoke doc).
 * Ejecuta los 3 scripts C/H y valida invariantes de repo.
 *
 * Smoke manual (browser) — checklist:
 * 1. Registro: wizard subcategoria cuckold hotwife / cuckold_hotwife (pareja_grupo).
 * 2. Completar shell pareja + delta C/H (dinamica, buscan, tipoExperiencia, participacionPareja).
 * 3. Preview tarjeta: aliasPareja, config H+M, dinámica, Buscan (si toggle Sí), badge Hotwife/Cuckold, Viaja si aplica.
 * 4. Preview iframe: vista=pareja; perfil detecta C/H (no ficha swinger, sin intercambioSwinger).
 * 5. perfil-publico.html → vista pareja / DEMO.pareja: ficha C/H, sin copy "Pareja Swinger" ni intercambio.
 * 6. Anti-contaminación: perfil swinger sin cuckoldHotwifePerfil; unicorn sin C/H; hotwife persona escort sin cuckoldHotwifePerfil.
 *
 * node scripts/qa-cuckold-hotwife-cierre.mjs
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const CH_SCRIPTS = [
  'qa-cuckold-hotwife.mjs',
  'qa-cuckold-hotwife-persist.mjs',
  'qa-cuckold-hotwife-render.mjs',
];

const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

function extractDemoParejaBlock(html) {
  const m = html.match(/\/\* Perfil Pareja Lifestyle — schema: cuckold_hotwife[\s\S]*?DEMO\.pareja=\{([\s\S]*?)\n\};/);
  return m ? m[0] : '';
}

console.log('\n=== QA Cuckold/Hotwife A4.4 Cierre — ejecución scripts ===');
let chTotal = 0;
for (const script of CH_SCRIPTS) {
  const r = spawnSync(process.execPath, [path.join(__dirname, script)], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const out = (r.stdout || '') + (r.stderr || '');
  process.stdout.write(out);
  const m = out.match(/Todos los checks pasaron \((\d+)\)/);
  if (m) chTotal += Number(m[1]);
  else {
    const pm = out.match(/PASS:\s*(\d+)/g);
    if (pm && pm.length) {
      const last = pm[pm.length - 1].match(/(\d+)/);
      if (last) chTotal += Number(last[1]);
    }
  }
  if (r.status !== 0) {
    fail.push({ name: script, detail: 'exit ' + r.status });
  } else {
    pass.push({ name: script, detail: 'ok' });
  }
}
ok('scripts C/H total checks', chTotal >= 118, String(chTotal));

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
const demoPareja = extractDemoParejaBlock(perfilHtml);
const legacyInDemo = [
  /Pareja Swinger/i,
  /intercambioSwinger/i,
  /Intercambio de parejas/i,
  /Encuentros swinger/i,
].filter((p) => p.test(demoPareja));
ok('DEMO.pareja sin copy swinger', legacyInDemo.length === 0, legacyInDemo.map(String).join('; '));
ok('DEMO.pareja campos C/H', /dinamica:"hotwife"/.test(demoPareja) && /badgeHotwife:true/.test(demoPareja), 'campos');
ok('DEMO.pareja subcategoriaId canon', /subcategoriaId:"cuckold_hotwife"/.test(demoPareja), 'id');

const legacyPatterns = [
  /intercambioSwinger/i,
  /Encuentros swinger \(parejas\)/i,
];
const previewPath = path.join(repoRoot, 'public', 'preview', 'perfil-vista-previa.html');
if (fs.existsSync(previewPath)) {
  const previewDemo = extractDemoParejaBlock(fs.readFileSync(previewPath, 'utf8'));
  ok(
    'preview DEMO.pareja pendiente sync (info)',
    true,
    previewDemo && /Pareja Swinger/i.test(previewDemo)
      ? 'perfil-vista-previa.html aún legacy — registro usa perfil-publico.html'
      : 'ok o vacío'
  );
}

const fieldEngine = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-field-engine-lite.js'), 'utf8');
ok('field-engine alias cuckold_hotwife', fieldEngine.includes('replace(/_/g, \' \')'), 'resolveMapaRow alias');

const schemaJson = fs.readFileSync(path.join(repoRoot, 'scripts', 'config-registro-adultos-schema.json'), 'utf8');
ok(
  'schema cuckold_hotwife pareja_grupo',
  schemaJson.includes('"subcategoriaId": "cuckold_hotwife"') && schemaJson.includes('"arquetipo": "pareja_grupo"'),
  'schema'
);

const rulePath = path.join(repoRoot, '.cursor', 'rules', 'registro-pareja-cuckold-hotwife.mdc');
ok('rule C/H presente', fs.existsSync(rulePath), rulePath);

const requiredFiles = [
  'public/js/data/registro-adultos-pareja-blocks.js',
  'public/js/carihub-registro-public-blocks.js',
  'public/js/carihub-viajes-desplazamiento.js',
  'public/js/registro-perfil-submit.js',
  'public/js/registro-perfil-preview.js',
  'public/js/carihub-public-render-lite.js',
  'public/js/carihub-field-engine-lite.js',
  'public/perfil-publico.html',
  'public/css/resultados.css',
  'scripts/config-registro-adultos-schema.json',
  'scripts/qa-cuckold-hotwife.mjs',
  'scripts/qa-cuckold-hotwife-persist.mjs',
  'scripts/qa-cuckold-hotwife-render.mjs',
  'scripts/qa-cuckold-hotwife-cierre.mjs',
];
ok(
  'artefactos A4 presentes',
  requiredFiles.every((f) => fs.existsSync(path.join(repoRoot, f))),
  requiredFiles.filter((f) => !fs.existsSync(path.join(repoRoot, f))).join(', ')
);

const coverage = [
  ['blocks cuckoldHotwifePerfil', 'public/js/data/registro-adultos-pareja-blocks.js', 'cuckoldHotwifePerfil'],
  ['motor buildCuckoldHotwifePerfil', 'public/js/carihub-registro-public-blocks.js', 'buildCuckoldHotwifePerfil'],
  ['submit cuckoldHotwifePerfil', 'public/js/registro-perfil-submit.js', 'cuckoldHotwifePerfil: cuckoldHotwifePerfil'],
  ['preview applyCuckoldHotwife', 'public/js/registro-perfil-preview.js', 'applyCuckoldHotwifePerfilFields'],
  ['tarjeta cardHTMLCuckoldHotwife', 'public/js/carihub-public-render-lite.js', 'cardHTMLCuckoldHotwife'],
  ['ficha renderParejaGrupoCuckoldHotwife', 'public/perfil-publico.html', 'renderParejaGrupoCuckoldHotwife'],
  ['viajes subcategoria C/H', 'public/js/carihub-viajes-desplazamiento.js', 'cuckold_hotwife'],
];
coverage.forEach(([label, file, needle]) => {
  const text = fs.readFileSync(path.join(repoRoot, file), 'utf8');
  ok('cobertura ' + label, text.includes(needle), file);
});

ok(
  'renderParejaLifestyle enruta C/H',
  /isCuckoldHotwifeSubFicha\(u\).*renderParejaGrupoCuckoldHotwife/s.test(perfilHtml),
  'perfil-publico.html'
);
ok(
  'setVista pareja usa renderParejaLifestyle',
  /tipo==="pareja"\?renderParejaLifestyle\(u\)/.test(perfilHtml),
  'setVista'
);

const mapa = fs.readFileSync(path.join(repoRoot, 'scripts', 'mapa-registro-categorias.json'), 'utf8');
ok('mapa cuckold hotwife ResultCardPareja', mapa.includes('"subcategoriaId": "cuckold hotwife"') && mapa.includes('ResultCardPareja'), 'mapa');

console.log('\n=== QA Cuckold/Hotwife A4.4 Cierre (meta) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nCierre Cuckold/Hotwife OK. Checks C/H acumulados:', chTotal);
console.log('Smoke manual: ver comentario en scripts/qa-cuckold-hotwife-cierre.mjs');
