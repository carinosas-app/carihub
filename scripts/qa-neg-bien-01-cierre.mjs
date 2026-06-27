/**
 * QA — Gate final NEG-BIEN-01 (spa + masajes + VEN/RET/CRE/ESP/DOM/HARDEN regresión).
 *
 * node scripts/qa-neg-bien-01-cierre.mjs
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const GATE_SCRIPTS = [
  'qa-neg-bienestar-cierre.mjs',
  'qa-neg-ven-01-cierre.mjs',
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

console.log('\n=== NEG-BIEN-01 Gate — ejecución scripts ===');
let gateChecks = 0;

for (const script of GATE_SCRIPTS) {
  const { status, out } = runScript(script);
  gateChecks += parsePassCount(out);
  if (status !== 0) fail.push({ name: script, detail: 'exit ' + status });
  else pass.push({ name: script, detail: 'ok' });
}

console.log('\n=== NEG-BIEN-01 Gate — invariantes ===');

const blocksJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'data', 'registro-adultos-bienestar-blocks.js'), 'utf8');
ok('blocks NEG_BIEN_1 sub spa', blocksJs.includes("'spa'"), 'spa');
ok('blocks NEG_BIEN_1 sub masajes', blocksJs.includes("'masajes'"), 'masajes');
ok('nested bienestarPerfil', blocksJs.includes("id: 'bienestarPerfil'"), 'block');
ok('no persona_acompanante in bundle', !blocksJs.includes('persona_acompanante'), 'excluido');
ok('no modalidades in bundle', !blocksJs.includes("id: 'modalidades'"), 'excluido');

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
ok('DEMO.spa sub spa', perfilHtml.includes('subcategoriaId:"spa"'), 'spa');
ok('DEMO.spa negocio_bienestar', /DEMO\.spa=\{[\s\S]*?arquetipo:"negocio_bienestar"/.test(perfilHtml), 'arquetipo');
ok('DEMO.masajesLocal negocio_bienestar', /DEMO\.masajesLocal=\{[\s\S]*?arquetipo:"negocio_bienestar"/.test(perfilHtml), 'arquetipo');
ok('aplicarPerfilDesdeRegistro bienestarPerfil', perfilHtml.includes('bienestarPerfil:'), 'preview');
ok('preview alias spa', perfilHtml.includes('spa:"spa"'), 'alias');
ok('preview alias masajes', perfilHtml.includes('masajes:"masajesLocal"'), 'alias masajes');

const viajesJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-viajes-desplazamiento.js'), 'utf8');
const viajesMatch = viajesJs.match(/VIAJES_SUBCATEGORIAS\s*=\s*\[([\s\S]*?)\];/);
const viajesList = viajesMatch ? viajesMatch[1] : '';
ok('v1 sin viajes spa', !viajesList.includes("'spa'"), 'excluido');
ok('v1 sin viajes masajes', !viajesList.includes("'masajes'"), 'excluido');

ok('2/2 subs resolve bienestar', blocksJs.includes("subcategoriaIds: ['spa', 'masajes']"), 'spa + masajes');
ok('normalizeBienestarSubId', fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-registro-public-blocks.js'), 'utf8').includes('normalizeBienestarSubId'), 'normalizer');

console.log('\n=== NEG-BIEN-01 Gate (meta) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nNEG-BIEN-01 Gate OK. Checks acumulados (scripts hijos):', gateChecks);
