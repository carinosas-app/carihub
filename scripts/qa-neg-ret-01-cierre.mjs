/**
 * QA — Gate final NEG-RET-01 (sex_shop + CRE/ESP/DOM/HARDEN regresión).
 *
 * node scripts/qa-neg-ret-01-cierre.mjs
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const GATE_SCRIPTS = [
  'qa-neg-retail-cierre.mjs',
  'qa-cre-01-cierre.mjs',
  'qa-esp-01-cierre.mjs',
  'qa-dom-01-cierre.mjs',
  'qa-harden-01-cierre.mjs',
];

const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

function runScript(scriptName) {
  const r = spawnSync(process.execPath, [path.join(__dirname, scriptName)], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const out = (r.stdout || '') + (r.stderr || '');
  process.stdout.write(out);
  return { status: r.status, out };
}

function parsePassCount(out) {
  let total = 0;
  (out.match(/Todos los checks pasaron \((\d+)\)/g) || []).forEach((line) => {
    const m = line.match(/\((\d+)\)/);
    if (m) total += Number(m[1]);
  });
  (out.match(/PASS:\s*(\d+)/g) || []).forEach((line) => {
    total += Number(line.replace(/PASS:\s*/, ''));
  });
  return total;
}

console.log('\n=== NEG-RET-01 Gate — ejecución scripts ===');
let gateChecks = 0;

for (const script of GATE_SCRIPTS) {
  const { status, out } = runScript(script);
  gateChecks += parsePassCount(out);
  if (status !== 0) fail.push({ name: script, detail: 'exit ' + status });
  else pass.push({ name: script, detail: 'ok' });
}

console.log('\n=== NEG-RET-01 Gate — invariantes ===');

const blocksJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'data', 'registro-adultos-retail-blocks.js'), 'utf8');
ok('blocks NEG_RET_1 sub sex_shop', blocksJs.includes("'sex_shop'"), 'sex_shop');
ok('nested retailPerfil', blocksJs.includes("id: 'retailPerfil'"), 'block');

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
ok('DEMO.sexShop sub sex_shop', perfilHtml.includes('subcategoriaId:"sex_shop"'), 'sex_shop');
ok('DEMO.sexShop negocio_retail', perfilHtml.includes('arquetipo:"negocio_retail"'), 'arquetipo');
ok('aplicarPerfilDesdeRegistro retailPerfil', perfilHtml.includes('retailPerfil:'), 'preview');
ok('preview alias sex_shop', perfilHtml.includes('sex_shop:"sexShop"'), 'alias');

const viajesJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-viajes-desplazamiento.js'), 'utf8');
const viajesMatch = viajesJs.match(/VIAJES_SUBCATEGORIAS\s*=\s*\[([\s\S]*?)\];/);
const viajesList = viajesMatch ? viajesMatch[1] : '';
ok('v1 sin viajes sex_shop', !viajesList.includes("'sex_shop'"), 'excluido');

ok('1/1 sub resolve retail', blocksJs.includes("subcategoriaIds: ['sex_shop']"), 'sex_shop only');
ok('normalize sex shop to sex_shop', fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-registro-public-blocks.js'), 'utf8').includes('normalizeRetailSubId'), 'normalizer');

console.log('\n=== NEG-RET-01 Gate (meta) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nNEG-RET-01 Gate OK. Checks acumulados (scripts hijos):', gateChecks);
