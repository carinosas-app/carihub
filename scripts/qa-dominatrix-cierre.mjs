/**
 * QA — Cierre pack persona_dominatrix + regresiones schema/viajes.
 * node scripts/qa-dominatrix-cierre.mjs
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const PACK_SCRIPTS = [
  'qa-dominatrix.mjs',
  'qa-dominatrix-persist.mjs',
  'qa-dominatrix-render.mjs',
];

const REGRESSION_SCRIPTS = ['validar-schemas-registro.mjs'];

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

console.log('\n=== QA Dominatrix — pack ===');
let packChecks = 0;
for (const script of PACK_SCRIPTS) {
  const { status, out } = runScript(script);
  const m = out.match(/Todos los checks pasaron \((\d+)\)/);
  if (m) packChecks += Number(m[1]);
  const pm = out.match(/PASS:\s*(\d+)/);
  if (pm && !m) packChecks += Number(pm[1]);
  if (status !== 0) fail.push({ name: script, detail: 'exit ' + status });
  else pass.push({ name: script, detail: 'ok' });
}
ok('pack checks acumulados', packChecks >= 40, String(packChecks));

console.log('\n=== QA Dominatrix — regresiones ===');
for (const script of REGRESSION_SCRIPTS) {
  const { status, out } = runScript(script);
  if (status !== 0) fail.push({ name: 'regression ' + script, detail: 'exit ' + status });
  else pass.push({ name: 'regression ' + script, detail: 'ok' });
  if (script === 'validar-schemas-registro.mjs') {
    ok('schema 0 errores', /Errores:\s*0/.test(out), out.split('\n').find((l) => /Errores:/.test(l)) || '');
    ok('schema 0 advertencias', /Advertencias:\s*0/.test(out), out.split('\n').find((l) => /Advertencias:/.test(l)) || '');
  }
}

console.log('\n=== QA Dominatrix — invariantes ===');
ok('blocks file exists', fs.existsSync(path.join(repoRoot, 'public', 'js', 'data', 'registro-adultos-dominatrix-blocks.js')), 'blocks');
const viajesJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-viajes-desplazamiento.js'), 'utf8');
const viajesMatch = viajesJs.match(/VIAJES_SUBCATEGORIAS\s*=\s*\[([\s\S]*?)\];/);
const viajesList = viajesMatch ? viajesMatch[1] : '';
DOM_3.forEach((subId) => {
  ok(`${subId} no en VIAJES_SUBCATEGORIAS`, !viajesList.includes(`'${subId}'`), 'no viajes v1');
});

const registroHtml = fs.readFileSync(path.join(repoRoot, 'public', 'registro-perfil.html'), 'utf8');
ok('resolver matchesDominatrix wired', fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-registro-public-blocks.js'), 'utf8').includes('matchesDominatrix'), 'resolver');
ok('registro-perfil loads dominatrix blocks', registroHtml.includes('registro-adultos-dominatrix-blocks.js'), 'script');

console.log('\n=== QA Dominatrix cierre (meta) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nDominatrix cierre OK. Pack checks:', packChecks);
