/**
 * QA — A3.4 cierre formal Unicorn (meta + smoke doc).
 * Ejecuta los 3 scripts unicorn y valida invariantes de repo.
 *
 * Smoke manual (browser) — checklist:
 * 1. Registro: abrir registro-perfil.html?subcategoria=unicorns (o flujo wizard unicorns).
 * 2. Completar bloques lifestyle (objetivos, tipoUnicornio, buscoConocer, modalidades, viajes si viaja).
 * 3. Preview tarjeta: badge 🦄, edad, objetivo, Busco, precio, ciudad, chip Viaja si aplica.
 * 4. Preview iframe: URL con vista=unicorn; ficha persona (Luna U.), sin copy pareja buscando unicornio.
 * 5. perfil-publico.html?vista=unicorn o setVista('unicorn'): DEMO persona_lifestyle, ficha con campos lifestyle.
 * 6. Cambiar a swinger en QA local: confirmar que no aparece unicornPerfil ni badge unicorn en tarjeta swinger.
 *
 * node scripts/qa-unicorn-cierre.mjs
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const UNICORN_SCRIPTS = [
  'qa-unicorn.mjs',
  'qa-unicorn-persist.mjs',
  'qa-unicorn-render.mjs',
];

const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

function grepNoLegacy(filePath, patterns) {
  const text = fs.readFileSync(filePath, 'utf8');
  return patterns.filter((p) => p.test(text));
}

console.log('\n=== QA Unicorn A3.4 Cierre — ejecución scripts ===');
let unicornTotal = 0;
for (const script of UNICORN_SCRIPTS) {
  const r = spawnSync(process.execPath, [path.join(__dirname, script)], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const out = (r.stdout || '') + (r.stderr || '');
  process.stdout.write(out);
  const m = out.match(/PASS:\s*(\d+)/);
  if (m) unicornTotal += Number(m[1]);
  if (r.status !== 0) {
    fail.push({ name: script, detail: 'exit ' + r.status });
  } else {
    pass.push({ name: script, detail: 'ok' });
  }
}
ok('unicorn scripts total checks', unicornTotal >= 90, String(unicornTotal));

const legacyPatterns = [
  /pareja estable buscando unicornio/i,
  /Buscan su unicornio ideal/i,
  /Pareja Unicorn/i,
  /Valentina & Marco/i,
];
const publicTargets = [
  path.join(repoRoot, 'public', 'perfil-publico.html'),
  path.join(repoRoot, 'public', 'preview', 'perfil-vista-previa.html'),
];
publicTargets.forEach((file) => {
  const hits = grepNoLegacy(file, legacyPatterns);
  ok('sin copy legacy ' + path.basename(file), hits.length === 0, hits.join('; '));
});

const indexJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'data', 'registro-schema-index.js'), 'utf8');
ok('schema-index ResultCardUnicorn', indexJs.includes('ResultCardUnicorn'), 'index');

const requiredFiles = [
  'public/js/data/registro-adultos-lifestyle-blocks.js',
  'public/js/registro-perfil-submit.js',
  'public/js/registro-perfil-preview.js',
  'public/js/carihub-public-render-lite.js',
  'scripts/qa-unicorn.mjs',
  'scripts/qa-unicorn-persist.mjs',
  'scripts/qa-unicorn-render.mjs',
];
ok(
  'artefactos A3 presentes',
  requiredFiles.every((f) => fs.existsSync(path.join(repoRoot, f))),
  requiredFiles.filter((f) => !fs.existsSync(path.join(repoRoot, f))).join(', ')
);

console.log('\n=== QA Unicorn A3.4 Cierre (meta) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nCierre Unicorn OK. Checks unicorn acumulados:', unicornTotal);
console.log('Smoke manual: ver comentario en scripts/qa-unicorn-cierre.mjs');
