/**
 * QA — Cierre pack NEG venue (orquesta motor + persist + render + schema + viajes exclusion).
 * node scripts/qa-neg-venue-cierre.mjs
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const PACK = [
  'validar-schemas-registro.mjs',
  'qa-neg-venue.mjs',
  'qa-neg-venue-persist.mjs',
  'qa-neg-venue-render.mjs',
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

console.log('\n=== NEG venue pack cierre — scripts ===');
for (const script of PACK) {
  const { status } = runScript(script);
  if (status !== 0) fail.push({ name: script, detail: 'exit ' + status });
  else pass.push({ name: script, detail: 'ok' });
}

console.log('\n=== NEG venue pack cierre — invariantes ===');

const blocksJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'data', 'registro-adultos-venue-blocks.js'), 'utf8');
ok('blocks sub antro', blocksJs.includes("'antro'"), 'antro');
ok('blocks sub antro_lgbt', blocksJs.includes("'antro_lgbt'"), 'antro_lgbt');
ok('nested venuePerfil block id', blocksJs.includes("id: 'venuePerfil'"), 'block');
ok('no viaja modalidad', !blocksJs.includes("'viaja'"), 'no viaja');
ok('no modalidades escort field', !blocksJs.includes("id: 'modalidades'"), 'no modalidades escort');
ok('no club_sw in bundle', !blocksJs.includes("'club_sw'"), 'no club_sw');

const registroJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-registro-public-blocks.js'), 'utf8');
ok('buildVenuePerfil', registroJs.includes('buildVenuePerfil'), 'persist');
ok('normalizeVenueSubId', registroJs.includes('normalizeVenueSubId'), 'canonical');
ok('resolveConfig venue before bienestar', /if \(matchesVenue\(ctx, resolved\)\) return resolveVenueConfig\(\);\s*\n\s*if \(matchesBienestar/.test(registroJs), 'order');

const renderJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-public-render-lite.js'), 'utf8');
ok('cardHTMLVenue', renderJs.includes('cardHTMLVenue'), 'render');
ok('isVenuePerfil', renderJs.includes('isVenuePerfil'), 'detect');

const viajesJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-viajes-desplazamiento.js'), 'utf8');
const viajesMatch = viajesJs.match(/VIAJES_SUBCATEGORIAS\s*=\s*\[([\s\S]*?)\];/);
const viajesList = viajesMatch ? viajesMatch[1] : '';
ok('antro no en VIAJES_SUBCATEGORIAS', !viajesList.includes("'antro'"), 'no viajes v1');
ok('antro_lgbt no en VIAJES_SUBCATEGORIAS', !viajesList.includes("'antro_lgbt'"), 'no viajes v1');

const schemaJson = fs.readFileSync(path.join(repoRoot, 'scripts', 'config-registro-adultos-schema.json'), 'utf8');
ok('schema sub antro', schemaJson.includes('"subcategoriaId": "antro"'), 'antro id');
ok('schema sub antro_lgbt', schemaJson.includes('"subcategoriaId": "antro_lgbt"'), 'antro_lgbt id');
ok('schema venuePerfil registry', schemaJson.includes('"venuePerfil"'), 'registry');
ok('schema tipoVenue registry', schemaJson.includes('"tipoVenue"'), 'tipoVenue');

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
ok('aplicarPerfilDesdeRegistro venuePerfil', perfilHtml.includes('venuePerfil:'), 'preview');

console.log('\n=== NEG venue pack cierre (meta) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nNEG venue pack cierre OK.');
