/**
 * QA — Cierre pack NEG retail (orquesta motor + persist + render + schema + viajes exclusion).
 * node scripts/qa-neg-retail-cierre.mjs
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const PACK = [
  'validar-schemas-registro.mjs',
  'qa-neg-retail.mjs',
  'qa-neg-retail-persist.mjs',
  'qa-neg-retail-render.mjs',
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

console.log('\n=== NEG retail pack cierre — scripts ===');
for (const script of PACK) {
  const { status } = runScript(script);
  if (status !== 0) fail.push({ name: script, detail: 'exit ' + status });
  else pass.push({ name: script, detail: 'ok' });
}

console.log('\n=== NEG retail pack cierre — invariantes ===');

const blocksJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'data', 'registro-adultos-retail-blocks.js'), 'utf8');
ok('blocks sub sex_shop', blocksJs.includes("'sex_shop'"), 'sex_shop');
ok('nested retailPerfil block id', blocksJs.includes("id: 'retailPerfil'"), 'block');
ok('no viaja modalidad', !blocksJs.includes("'viaja'"), 'no viaja');
ok('no modalidades escort field', !blocksJs.includes("id: 'modalidades'"), 'no modalidades escort');

const registroJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-registro-public-blocks.js'), 'utf8');
ok('buildRetailPerfil', registroJs.includes('buildRetailPerfil'), 'persist');
ok('normalizeRetailSubId', registroJs.includes('normalizeRetailSubId'), 'canonical');
ok('resolveConfig retail before escort', /if \(matchesRetail\(ctx, resolved\)\) return resolveRetailConfig\(\);\s*\n\s*if \(matchesEscort/.test(registroJs), 'order');

const renderJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-public-render-lite.js'), 'utf8');
ok('cardHTMLRetail', renderJs.includes('cardHTMLRetail'), 'render');
ok('isRetailPerfil', renderJs.includes('isRetailPerfil'), 'detect');

const viajesJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-viajes-desplazamiento.js'), 'utf8');
const viajesMatch = viajesJs.match(/VIAJES_SUBCATEGORIAS\s*=\s*\[([\s\S]*?)\];/);
const viajesList = viajesMatch ? viajesMatch[1] : '';
ok('sex_shop no en VIAJES_SUBCATEGORIAS', !viajesList.includes("'sex_shop'") && !viajesList.includes("'sex shop'"), 'no viajes v1');

const schemaJson = fs.readFileSync(path.join(repoRoot, 'scripts', 'config-registro-adultos-schema.json'), 'utf8');
ok('schema sub sex_shop', schemaJson.includes('"subcategoriaId": "sex_shop"'), 'sex_shop id');
ok('schema retailPerfil registry', schemaJson.includes('"retailPerfil"'), 'registry');

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
ok('aplicarPerfilDesdeRegistro retailPerfil', perfilHtml.includes('retailPerfil:'), 'preview');

console.log('\n=== NEG retail pack cierre (meta) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nNEG retail pack cierre OK.');
