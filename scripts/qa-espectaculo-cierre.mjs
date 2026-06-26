/**
 * QA — Cierre pack ESP (orquesta motor + persist + render + schema + viajes exclusion).
 * node scripts/qa-espectaculo-cierre.mjs
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const PACK = [
  'validar-schemas-registro.mjs',
  'qa-espectaculo.mjs',
  'qa-espectaculo-persist.mjs',
  'qa-espectaculo-render.mjs',
];

const ESP_2 = ['stripper', 'tabledance'];

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

console.log('\n=== ESP pack cierre — scripts ===');
for (const script of PACK) {
  const { status } = runScript(script);
  if (status !== 0) fail.push({ name: script, detail: 'exit ' + status });
  else pass.push({ name: script, detail: 'ok' });
}

console.log('\n=== ESP pack cierre — invariantes ===');

const blocksJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'data', 'registro-adultos-espectaculo-blocks.js'), 'utf8');
ok('blocks ESP_2 declaradas', ESP_2.every((id) => blocksJs.includes(`'${id}'`)), ESP_2.join(', '));
ok('nested espectaculoPerfil block id', blocksJs.includes("id: 'espectaculoPerfil'"), 'block');
ok('no viaja modalidad', !blocksJs.includes("'viaja'"), 'no viaja');

const registroJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-registro-public-blocks.js'), 'utf8');
ok('buildEspectaculoPerfil', registroJs.includes('buildEspectaculoPerfil'), 'persist');
ok('normalizeEspectaculoSubId', registroJs.includes('normalizeEspectaculoSubId'), 'canonical');

const renderJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-public-render-lite.js'), 'utf8');
ok('cardHTMLEspectaculo', renderJs.includes('cardHTMLEspectaculo'), 'render');
ok('cardHTMLStripper', renderJs.includes('cardHTMLStripper'), 'stripper');
ok('cardHTMLTableDance', renderJs.includes('cardHTMLTableDance'), 'tabledance');

const viajesJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-viajes-desplazamiento.js'), 'utf8');
const viajesMatch = viajesJs.match(/VIAJES_SUBCATEGORIAS\s*=\s*\[([\s\S]*?)\];/);
const viajesList = viajesMatch ? viajesMatch[1] : '';
ESP_2.forEach((subId) => {
  ok(`${subId} no en VIAJES_SUBCATEGORIAS`, !viajesList.includes(`'${subId}'`), 'no viajes v1');
});

const schemaJson = fs.readFileSync(path.join(repoRoot, 'scripts', 'config-registro-adultos-schema.json'), 'utf8');
ok('schema sub tabledance', schemaJson.includes('"subcategoriaId": "tabledance"'), 'tabledance id');
ok('schema espectaculoPerfil registry', schemaJson.includes('"espectaculoPerfil"'), 'registry');

console.log('\n=== ESP pack cierre (meta) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nESP pack cierre OK.');
