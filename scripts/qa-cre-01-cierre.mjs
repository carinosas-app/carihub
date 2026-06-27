/**
 * QA — Gate final CRE-01 (contenido + ESP-01 + DOM-01 + HARDEN-01 regresión).
 *
 * node scripts/qa-cre-01-cierre.mjs
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const GATE_SCRIPTS = [
  'qa-creador-cierre.mjs',
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

console.log('\n=== CRE-01 Gate — ejecución scripts ===');
let gateChecks = 0;

for (const script of GATE_SCRIPTS) {
  const { status, out } = runScript(script);
  gateChecks += parsePassCount(out);
  if (status !== 0) fail.push({ name: script, detail: 'exit ' + status });
  else pass.push({ name: script, detail: 'ok' });
}

console.log('\n=== CRE-01 Gate — invariantes ===');

const blocksJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'data', 'registro-adultos-creador-blocks.js'), 'utf8');
ok('blocks CRE_1 sub contenido', blocksJs.includes("'contenido'"), 'contenido');
ok('nested creadorPerfil', blocksJs.includes("id: 'creadorPerfil'"), 'block');

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
ok('DEMO.creador sub contenido', perfilHtml.includes('subcategoriaId:"contenido"'), 'contenido');
ok('DEMO.creador tipoPerfil creador', perfilHtml.includes('tipoPerfil:"creador"'), 'tipoPerfil');
ok('aplicarPerfilDesdeRegistro creadorPerfil', perfilHtml.includes('creadorPerfil:'), 'preview');
ok('preview alias contenido', perfilHtml.includes('contenido:"creador"'), 'alias');

const viajesJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-viajes-desplazamiento.js'), 'utf8');
const viajesMatch = viajesJs.match(/VIAJES_SUBCATEGORIAS\s*=\s*\[([\s\S]*?)\];/);
const viajesList = viajesMatch ? viajesMatch[1] : '';
ok('v1 sin viajes contenido', !viajesList.includes("'contenido'"), 'excluido');

ok('1/1 sub resolve creador', blocksJs.includes("subcategoriaIds: ['contenido']"), 'contenido only');

console.log('\n=== CRE-01 Gate (meta) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nCRE-01 Gate OK. Checks acumulados (scripts hijos):', gateChecks);
