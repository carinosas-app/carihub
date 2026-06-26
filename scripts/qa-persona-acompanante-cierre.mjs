/**
 * QA — Cierre pack persona_acompanante + regresiones obligatorias.
 *
 * Smoke manual (browser):
 * 1. Registro — wizard por subcategoría escort/lifestyle persona (hotwife, lesbians, singles, femboy, tom boy/fem, shell escort).
 * 2. Preview tarjeta — badges VIP/LGBT/Hotwife, extras lesbians, chip Viaja donde aplique.
 * 3. Preview iframe — persona individual, subcategoriaId preservado; hotwife persona ≠ pareja cuckold_hotwife.
 * 4. perfil-publico.html — DEMO escortGay, escortVip, trans.
 * 5. Anti-contaminación — hotwife persona sin cuckoldHotwifePerfil; lesbians sin swingerPerfil.
 *
 * node scripts/qa-persona-acompanante-cierre.mjs
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const PACK_SCRIPTS = [
  'qa-persona-acompanante.mjs',
  'qa-persona-acompanante-persist.mjs',
  'qa-persona-acompanante-render.mjs',
];

const REGRESSION_SCRIPTS = [
  'validar-schemas-registro.mjs',
  'qa-viajes-desplazamiento.mjs',
  'qa-dotados.mjs',
  'qa-unicorn-cierre.mjs',
  'qa-pareja-grupo-base.mjs',
  'qa-cuckold-hotwife-cierre.mjs',
];

const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

function runScript(scriptName) {
  const scriptPath = path.join(__dirname, scriptName);
  const r = spawnSync(process.execPath, [scriptPath], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const out = (r.stdout || '') + (r.stderr || '');
  process.stdout.write(out);
  return { status: r.status, out };
}

console.log('\n=== QA persona_acompanante — pack ===');
let packChecks = 0;
for (const script of PACK_SCRIPTS) {
  const { status, out } = runScript(script);
  const m = out.match(/PASS:\s*(\d+)/g);
  if (m) packChecks += m.reduce((acc, line) => acc + Number(line.replace(/PASS:\s*/, '')), 0);
  if (status !== 0) fail.push({ name: script, detail: 'exit ' + status });
  else pass.push({ name: script, detail: 'ok' });
}
ok('pack checks acumulados', packChecks >= 120, String(packChecks));

console.log('\n=== QA persona_acompanante — regresiones ===');
for (const script of REGRESSION_SCRIPTS) {
  const { status, out } = runScript(script);
  if (status !== 0) {
    fail.push({ name: 'regression ' + script, detail: 'exit ' + status });
  } else {
    pass.push({ name: 'regression ' + script, detail: 'ok' });
  }
  if (script === 'validar-schemas-registro.mjs') {
    ok('schema totalErrores 0', /Errores:\s*0/.test(out) || /"totalErrores":\s*0/.test(out), out.split('\n').find((l) => /Errores:/.test(l)) || '');
  }
}

const required = [
  'public/js/data/registro-adultos-escort-blocks.js',
  'public/js/carihub-registro-public-blocks.js',
  'public/js/registro-perfil-submit.js',
  'public/js/carihub-public-render-lite.js',
  ...PACK_SCRIPTS.map((s) => 'scripts/' + s),
];
ok(
  'artefactos pack presentes',
  required.every((f) => fs.existsSync(path.join(repoRoot, f))),
  required.filter((f) => !fs.existsSync(path.join(repoRoot, f))).join(', ')
);

console.log('\n=== QA persona_acompanante Cierre (meta) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nCierre persona_acompanante OK. Checks pack acumulados:', packChecks);
console.log('Smoke manual: ver comentario en scripts/qa-persona-acompanante-cierre.mjs');
