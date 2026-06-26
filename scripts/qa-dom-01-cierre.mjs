/**
 * QA — Gate final DOM-01 (persona_dominatrix 3 subs + HARDEN-01 regresión).
 *
 * node scripts/qa-dom-01-cierre.mjs
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const GATE_SCRIPTS = [
  'validar-schemas-registro.mjs',
  'qa-dominatrix-cierre.mjs',
  'qa-harden-01-cierre.mjs',
];

const DOM_3 = ['dominatrix', 'fetiche', 'sado'];

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

console.log('\n=== DOM-01 Gate — ejecución scripts ===');
let gateChecks = 0;

for (const script of GATE_SCRIPTS) {
  const { status, out } = runScript(script);
  gateChecks += parsePassCount(out);
  if (status !== 0) fail.push({ name: script, detail: 'exit ' + status });
  else pass.push({ name: script, detail: 'ok' });
  if (script === 'validar-schemas-registro.mjs') {
    ok('schema 0 errores', /Errores:\s*0/.test(out), out.split('\n').find((l) => /Errores:/.test(l)) || '');
    ok('schema 0 advertencias', /Advertencias:\s*0/.test(out), out.split('\n').find((l) => /Advertencias:/.test(l)) || '');
  }
}

console.log('\n=== DOM-01 Gate — invariantes ===');

const blocksJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'data', 'registro-adultos-dominatrix-blocks.js'), 'utf8');
ok('blocks DOM_3 declaradas', DOM_3.every((id) => blocksJs.includes(`'${id}'`)), DOM_3.join(', '));
ok('nested dominatrixPerfil block id', blocksJs.includes("id: 'dominatrixPerfil'"), 'block');
ok('resolver matchesDominatrix', fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-registro-public-blocks.js'), 'utf8').includes('buildDominatrixPerfil'), 'persist');
ok('render cardHTMLDominatrix', fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-public-render-lite.js'), 'utf8').includes('cardHTMLDominatrix'), 'render');

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
DOM_3.forEach((key) => {
  ok(`DEMO.${key} presente`, perfilHtml.includes(`DEMO.${key}=`), key);
});

const viajesJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-viajes-desplazamiento.js'), 'utf8');
const viajesMatch = viajesJs.match(/VIAJES_SUBCATEGORIAS\s*=\s*\[([\s\S]*?)\];/);
const viajesList = viajesMatch ? viajesMatch[1] : '';
DOM_3.forEach((subId) => {
  ok(`v1 sin viajes ${subId}`, !viajesList.includes(`'${subId}'`), 'excluido');
});

console.log('\n=== DOM-01 Gate (meta) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nDOM-01 Gate OK. Checks acumulados (scripts hijos):', gateChecks);
