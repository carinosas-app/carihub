/**
 * QA — Gate final NEG-VEN-03 (cabinas + cine_xxx + regresiones).
 *
 * node scripts/qa-neg-ven-03-cierre.mjs
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const GATE_SCRIPTS = [
  'qa-neg-venue-cabinas-cine-cierre.mjs',
  'qa-neg-ven-02-cierre.mjs',
  'qa-neg-hosp-01-cierre.mjs',
  'qa-neg-bien-01-cierre.mjs',
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

console.log('\n=== NEG-VEN-03 Gate — ejecución scripts ===');
let gateChecks = 0;

for (const script of GATE_SCRIPTS) {
  const { status, out } = runScript(script);
  gateChecks += parsePassCount(out);
  if (status !== 0) fail.push({ name: script, detail: 'exit ' + status });
  else pass.push({ name: script, detail: 'ok' });
}

console.log('\n=== NEG-VEN-03 Gate — invariantes ===');

const blocksJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'data', 'registro-adultos-venue-blocks.js'), 'utf8');
ok('blocks NEG_VEN_03 sub cabinas', blocksJs.includes("'cabinas'"), 'cabinas');
ok('blocks NEG_VEN_03 sub cine_xxx', blocksJs.includes("'cine_xxx'"), 'cine_xxx');
ok('2/2 subs resolve negocio_venue', blocksJs.includes("'cabinas'") && blocksJs.includes("'cine_xxx'"), 'cabinas + cine_xxx');
ok('nested venuePerfil not cabinasPerfil', blocksJs.includes("id: 'venuePerfil'") && !blocksJs.includes("id: 'cabinasPerfil'"), 'venuePerfil');
ok('no cineXxxPerfil', !blocksJs.includes("id: 'cineXxxPerfil'"), 'no cineXxxPerfil');
ok('no modalidades in bundle', !blocksJs.includes("id: 'modalidades'"), 'excluido');
ok('no edad in bundle', !blocksJs.includes("id: 'edad'"), 'excluido');

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
ok('DEMO.cabinas sub cabinas', perfilHtml.includes('subcategoriaId:"cabinas"'), 'sub');
ok('DEMO.cabinas negocio_venue', /DEMO\.cabinas=\{[\s\S]*?arquetipo:"negocio_venue"/.test(perfilHtml), 'arquetipo');
ok('DEMO.cabinas tipoPerfil lugar', /DEMO\.cabinas=\{[\s\S]*?tipoPerfil:"lugar"/.test(perfilHtml), 'lugar');
ok('DEMO.cineXxx sub cine_xxx', perfilHtml.includes('subcategoriaId:"cine_xxx"'), 'sub cine');
ok('DEMO.cineXxx negocio_venue', /DEMO\.cineXxx=\{[\s\S]*?arquetipo:"negocio_venue"/.test(perfilHtml), 'arquetipo cine');
ok('preview alias cabinas', perfilHtml.includes('"cabinas glory holes":"cabinas"'), 'alias cabinas');
ok('preview alias cine_xxx', perfilHtml.includes('cine_xxx:"cineXxx"'), 'alias cine');

const viajesJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-viajes-desplazamiento.js'), 'utf8');
const viajesMatch = viajesJs.match(/VIAJES_SUBCATEGORIAS\s*=\s*\[([\s\S]*?)\];/);
const viajesList = viajesMatch ? viajesMatch[1] : '';
ok('v1 sin viajes cabinas', !viajesList.includes("'cabinas'"), 'excluido');
ok('v1 sin viajes cine_xxx', !viajesList.includes("'cine_xxx'"), 'excluido');

const registroJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-registro-public-blocks.js'), 'utf8');
ok('normalizeVenueSubId cabinas aliases', registroJs.includes("'cabinas glory holes'"), 'aliases cabinas');
ok('normalizeVenueSubId cine aliases', registroJs.includes("'cine adulto'"), 'aliases cine');
ok('resolveConfig cabinas -> negocio_venue', registroJs.includes("canon === 'cabinas'"), 'venue canon');
ok('resolveConfig cine_xxx -> negocio_venue', registroJs.includes("canon === 'cine_xxx'"), 'venue canon cine');

console.log('\n=== NEG-VEN-03 Gate (meta) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nNEG-VEN-03 Gate OK. Checks acumulados (scripts hijos):', gateChecks);
