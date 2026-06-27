/**
 * QA — Gate final NEG-VEN-01 (antro + antro_lgbt + RET/CRE/ESP/DOM/HARDEN regresión).
 *
 * node scripts/qa-neg-ven-01-cierre.mjs
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const GATE_SCRIPTS = [
  'qa-neg-venue-cierre.mjs',
  'qa-neg-ret-01-cierre.mjs',
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
    maxBuffer: 64 * 1024 * 1024,
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

console.log('\n=== NEG-VEN-01 Gate — ejecución scripts ===');
let gateChecks = 0;

for (const script of GATE_SCRIPTS) {
  const { status, out } = runScript(script);
  gateChecks += parsePassCount(out);
  if (status !== 0) fail.push({ name: script, detail: 'exit ' + status });
  else pass.push({ name: script, detail: 'ok' });
}

console.log('\n=== NEG-VEN-01 Gate — invariantes ===');

const blocksJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'data', 'registro-adultos-venue-blocks.js'), 'utf8');
ok('blocks NEG_VEN_1 sub antro', blocksJs.includes("'antro'"), 'antro');
ok('blocks NEG_VEN_1 sub antro_lgbt', blocksJs.includes("'antro_lgbt'"), 'antro_lgbt');
ok('nested venuePerfil', blocksJs.includes("id: 'venuePerfil'"), 'block');
ok('no club_sw in bundle', !blocksJs.includes("'club_sw'"), 'excluido');

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
ok('DEMO.antro sub antro', perfilHtml.includes('subcategoriaId:"antro"'), 'antro');
ok('DEMO.antro negocio_venue', /DEMO\.antro=\{[\s\S]*?arquetipo:"negocio_venue"/.test(perfilHtml), 'arquetipo');
ok('DEMO.antroLgbt sub antro_lgbt', perfilHtml.includes('subcategoriaId:"antro_lgbt"'), 'antro_lgbt');
ok('DEMO.antroLgbt badgeLgbt', /DEMO\.antroLgbt=\{[\s\S]*?badgeLgbt:true/.test(perfilHtml), 'badge');
ok('aplicarPerfilDesdeRegistro venuePerfil', perfilHtml.includes('venuePerfil:'), 'preview');
ok('preview alias antro', perfilHtml.includes('"antro restaurant bar":"antro"'), 'alias');
ok('preview alias antro_lgbt', perfilHtml.includes('"antro restaurant bar lgbt":"antroLgbt"'), 'alias lgbt');

const viajesJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-viajes-desplazamiento.js'), 'utf8');
const viajesMatch = viajesJs.match(/VIAJES_SUBCATEGORIAS\s*=\s*\[([\s\S]*?)\];/);
const viajesList = viajesMatch ? viajesMatch[1] : '';
ok('v1 sin viajes antro', !viajesList.includes("'antro'"), 'excluido');
ok('v1 sin viajes antro_lgbt', !viajesList.includes("'antro_lgbt'"), 'excluido');

ok('2/2 subs resolve venue', blocksJs.includes("subcategoriaIds: ['antro', 'antro_lgbt']"), 'antro + antro_lgbt');
ok('normalize antro restaurant bar', fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-registro-public-blocks.js'), 'utf8').includes('normalizeVenueSubId'), 'normalizer');

console.log('\n=== NEG-VEN-01 Gate (meta) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nNEG-VEN-01 Gate OK. Checks acumulados (scripts hijos):', gateChecks);
