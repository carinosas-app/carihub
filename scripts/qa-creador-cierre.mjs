/**
 * QA — Cierre pack CRE creador (orquesta motor + persist + render + schema + viajes exclusion).
 * node scripts/qa-creador-cierre.mjs
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const PACK = [
  'validar-schemas-registro.mjs',
  'qa-creador.mjs',
  'qa-creador-persist.mjs',
  'qa-creador-render.mjs',
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

console.log('\n=== CRE creador pack cierre — scripts ===');
for (const script of PACK) {
  const { status } = runScript(script);
  if (status !== 0) fail.push({ name: script, detail: 'exit ' + status });
  else pass.push({ name: script, detail: 'ok' });
}

console.log('\n=== CRE creador pack cierre — invariantes ===');

const blocksJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'data', 'registro-adultos-creador-blocks.js'), 'utf8');
ok('blocks sub contenido', blocksJs.includes("'contenido'"), 'contenido');
ok('nested creadorPerfil block id', blocksJs.includes("id: 'creadorPerfil'"), 'block');
ok('no viaja modalidad', !blocksJs.includes("'viaja'"), 'no viaja');
ok('no escort modalidades field', !blocksJs.includes("id: 'modalidades'"), 'no modalidades escort');

const registroJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-registro-public-blocks.js'), 'utf8');
ok('buildCreadorPerfil', registroJs.includes('buildCreadorPerfil'), 'persist');
ok('normalizeCreadorSubId', registroJs.includes('normalizeCreadorSubId'), 'canonical');
ok('resolveConfig creador before escort', /if \(matchesCreador\(ctx, resolved\)\) return resolveCreadorConfig\(\);\s*\n\s*if \(matchesEscort/.test(registroJs), 'order');

const renderJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-public-render-lite.js'), 'utf8');
ok('cardHTMLCreador', renderJs.includes('cardHTMLCreador'), 'render');
ok('isCreadorPerfil', renderJs.includes('isCreadorPerfil'), 'detect');

const fieldJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-field-engine-lite.js'), 'utf8');
ok('field-engine ProfileLayoutCreador', fieldJs.includes("comp === 'ResultCardCreador'"), 'vista');

const viajesJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-viajes-desplazamiento.js'), 'utf8');
const viajesMatch = viajesJs.match(/VIAJES_SUBCATEGORIAS\s*=\s*\[([\s\S]*?)\];/);
const viajesList = viajesMatch ? viajesMatch[1] : '';
ok('contenido no en VIAJES_SUBCATEGORIAS', !viajesList.includes("'contenido'"), 'no viajes v1');

const schemaJson = fs.readFileSync(path.join(repoRoot, 'scripts', 'config-registro-adultos-schema.json'), 'utf8');
ok('schema sub contenido', schemaJson.includes('"subcategoriaId": "contenido"'), 'contenido id');
ok('schema creadorPerfil registry', schemaJson.includes('"creadorPerfil"'), 'registry');

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
ok('aplicarPerfilDesdeRegistro creadorPerfil', perfilHtml.includes('creadorPerfil:'), 'preview');

console.log('\n=== CRE creador pack cierre (meta) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nCRE creador pack cierre OK.');
