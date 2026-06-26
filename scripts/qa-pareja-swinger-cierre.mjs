/**
 * QA — H4 cierre formal Pareja Swinger (meta + smoke doc).
 * Ejecuta motor + persist + render swinger y valida invariantes de repo.
 *
 * Smoke manual (browser) — checklist:
 * 1. Registro: wizard subcategoria swinger (pareja_grupo + delta swingerPerfil).
 * 2. Completar shell pareja + delta swinger (objetivos, intercambioSwinger, tipoInteraccion).
 * 3. Preview tarjeta: aliasPareja, config H+M, intercambio, badge swinger, Viaja si aplica.
 * 4. Preview iframe: vista=pareja; ficha swinger con intercambioSwinger (no ficha C/H).
 * 5. perfil-publico.html → renderParejaGrupoSwinger en ficha pareja swinger.
 * 6. Anti-contaminación: escort sin swingerPerfil; unicorn/C/H sin intercambioSwinger top-level en escort.
 *
 * node scripts/qa-pareja-swinger-cierre.mjs
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const SWINGER_SCRIPTS = [
  'qa-pareja-swinger.mjs',
  'qa-pareja-swinger-persist.mjs',
  'qa-pareja-swinger-render.mjs',
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

console.log('\n=== QA Pareja Swinger H4 Cierre — ejecución scripts ===');
let swingerTotal = 0;
for (const script of SWINGER_SCRIPTS) {
  const r = spawnSync(process.execPath, [path.join(__dirname, script)], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const out = (r.stdout || '') + (r.stderr || '');
  process.stdout.write(out);
  const m = out.match(/Todos los checks pasaron \((\d+)\)/);
  if (m) swingerTotal += Number(m[1]);
  else {
    const pm = out.match(/PASS:\s*(\d+)/g);
    if (pm && pm.length) {
      const last = pm[pm.length - 1].match(/(\d+)/);
      if (last) swingerTotal += Number(last[1]);
    }
  }
  if (r.status !== 0) {
    fail.push({ name: script, detail: 'exit ' + r.status });
  } else {
    pass.push({ name: script, detail: 'ok' });
  }
}
ok('scripts swinger total checks', swingerTotal >= 55, String(swingerTotal));

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
const demoPareja = extractDemoParejaBlock(perfilHtml);
ok('DEMO.pareja reservado C/H', /subcategoriaId:"cuckold_hotwife"/.test(demoPareja), 'id');
ok('DEMO.pareja sin intercambioSwinger', !/intercambioSwinger/.test(demoPareja), 'no swinger copy en DEMO C/H');

const legacyInDemo = [/Pareja Swinger/i, /intercambioSwinger/i].filter((p) => p.test(demoPareja));
ok('DEMO.pareja sin campos swinger', legacyInDemo.length === 0, legacyInDemo.map(String).join('; '));

ok(
  'ficha renderParejaGrupoSwinger',
  perfilHtml.includes('function renderParejaGrupoSwinger') && perfilHtml.includes('function swingerFichaHTML'),
  'perfil-publico.html'
);
ok(
  'renderParejaLifestyle enruta swinger',
  /isSwingerSubFicha\(u\).*renderParejaGrupoSwinger/s.test(perfilHtml),
  'perfil-publico.html'
);

const schemaJson = fs.readFileSync(path.join(repoRoot, 'scripts', 'config-registro-adultos-schema.json'), 'utf8');
ok(
  'schema swinger pareja_grupo',
  schemaJson.includes('"subcategoriaId": "swinger"') && schemaJson.includes('"arquetipo": "pareja_grupo"'),
  'schema'
);

const mapa = fs.readFileSync(path.join(repoRoot, 'scripts', 'mapa-registro-categorias.json'), 'utf8');
ok('mapa swinger ResultCardPareja', mapa.includes('"subcategoriaId": "swinger"') && mapa.includes('ResultCardPareja'), 'mapa');
ok('mapa swinger ProfileLayoutPareja', mapa.includes('"subcategoriaId": "swinger"') && mapa.includes('ProfileLayoutPareja'), 'mapa');

const rulePath = path.join(repoRoot, '.cursor', 'rules', 'registro-pareja-swinger-pendiente.mdc');
ok('rule swinger presente', fs.existsSync(rulePath), rulePath);

const requiredFiles = [
  'public/js/data/registro-adultos-pareja-blocks.js',
  'public/js/carihub-registro-public-blocks.js',
  'public/js/carihub-viajes-desplazamiento.js',
  'public/js/registro-perfil-submit.js',
  'public/js/registro-perfil-preview.js',
  'public/js/carihub-public-render-lite.js',
  'public/js/carihub-field-engine-lite.js',
  'public/perfil-publico.html',
  'scripts/config-registro-adultos-schema.json',
  'scripts/qa-pareja-swinger.mjs',
  'scripts/qa-pareja-swinger-persist.mjs',
  'scripts/qa-pareja-swinger-render.mjs',
  'scripts/qa-pareja-swinger-cierre.mjs',
];
ok(
  'artefactos swinger presentes',
  requiredFiles.every((f) => fs.existsSync(path.join(repoRoot, f))),
  requiredFiles.filter((f) => !fs.existsSync(path.join(repoRoot, f))).join(', ')
);

const coverage = [
  ['blocks swingerPerfil', 'public/js/data/registro-adultos-pareja-blocks.js', 'swingerPerfil'],
  ['motor buildSwingerPerfil', 'public/js/carihub-registro-public-blocks.js', 'buildSwingerPerfil'],
  ['submit swingerPerfil', 'public/js/registro-perfil-submit.js', 'swingerPerfil: swingerPerfil'],
  ['preview applySwinger', 'public/js/registro-perfil-preview.js', 'applySwingerPerfilFields'],
  ['tarjeta cardHTMLParejaSwinger', 'public/js/carihub-public-render-lite.js', 'cardHTMLParejaSwinger'],
  ['ficha renderParejaGrupoSwinger', 'public/perfil-publico.html', 'renderParejaGrupoSwinger'],
  ['viajes subcategoria swinger', 'public/js/carihub-viajes-desplazamiento.js', "'swinger'"],
];
coverage.forEach(([label, file, needle]) => {
  const text = fs.readFileSync(path.join(repoRoot, file), 'utf8');
  ok('cobertura ' + label, text.includes(needle), file);
});

const parejaBlocks = fs.readFileSync(path.join(repoRoot, 'public/js/data/registro-adultos-pareja-blocks.js'), 'utf8');
ok('swingerPerfil solo sub swinger', /onlySubcategorias:\s*\['swinger'\]/.test(parejaBlocks), 'pareja-blocks');
ok('cuckoldHotwifePerfil separado', parejaBlocks.includes('cuckoldHotwifePerfil'), 'pareja-blocks');

const lifestyleBlocks = fs.readFileSync(path.join(repoRoot, 'public/js/data/registro-adultos-lifestyle-blocks.js'), 'utf8');
ok('lifestyle sin swingerPerfil', !lifestyleBlocks.includes('swingerPerfil'), 'lifestyle-blocks');
ok('lifestyle sin cuckoldHotwifePerfil', !lifestyleBlocks.includes('cuckoldHotwifePerfil'), 'lifestyle-blocks');

const escortBlocks = fs.readFileSync(path.join(repoRoot, 'public/js/data/registro-adultos-escort-blocks.js'), 'utf8');
ok('escort sin swingerPerfil block', !escortBlocks.includes('swingerPerfil'), 'escort-blocks');
ok('escort sin unicornPerfil block', !escortBlocks.includes('unicornPerfil'), 'escort-blocks');
ok('escort incluye dotados', escortBlocks.includes("'dotados'"), 'escort-blocks');

const motor = fs.readFileSync(path.join(repoRoot, 'public/js/carihub-registro-public-blocks.js'), 'utf8');
ok('finalizeParejaSwingerValues separado', motor.includes('finalizeParejaSwingerValues'), 'motor');
ok('finalizeUnicornValues separado', motor.includes('finalizeUnicornValues'), 'motor');
ok('finalizeCuckoldHotwife separado', motor.includes('finalizeCuckoldHotwifeValues'), 'motor');

console.log('\n=== QA Pareja Swinger H4 Cierre (meta) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nCierre Pareja Swinger OK. Checks swinger acumulados:', swingerTotal);
console.log('Smoke manual: ver comentario en scripts/qa-pareja-swinger-cierre.mjs');
