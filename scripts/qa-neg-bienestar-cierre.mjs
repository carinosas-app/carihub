/**
 * QA — Cierre pack NEG bienestar (orquesta motor + persist + render + schema + viajes exclusion).
 * node scripts/qa-neg-bienestar-cierre.mjs
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const PACK = [
  'validar-schemas-registro.mjs',
  'qa-neg-bienestar.mjs',
  'qa-neg-bienestar-persist.mjs',
  'qa-neg-bienestar-render.mjs',
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

console.log('\n=== NEG bienestar pack cierre — scripts ===');
for (const script of PACK) {
  const { status } = runScript(script);
  if (status !== 0) fail.push({ name: script, detail: 'exit ' + status });
  else pass.push({ name: script, detail: 'ok' });
}

console.log('\n=== NEG bienestar pack cierre — invariantes ===');

const blocksJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'data', 'registro-adultos-bienestar-blocks.js'), 'utf8');
ok('blocks sub spa', blocksJs.includes("'spa'"), 'spa');
ok('blocks sub masajes', blocksJs.includes("'masajes'"), 'masajes');
ok('nested bienestarPerfil block id', blocksJs.includes("id: 'bienestarPerfil'"), 'block');
ok('no viaja modalidad', !blocksJs.includes("'viaja'"), 'no viaja');
ok('no modalidades escort field', !blocksJs.includes("id: 'modalidades'"), 'no modalidades escort');
ok('no edad field', !blocksJs.includes("id: 'edad'"), 'no edad');
ok('no hotel in bundle', !blocksJs.includes("'hotel'"), 'no hotel');
ok('no club_sw in bundle', !blocksJs.includes("'club_sw'"), 'no club_sw');

const registroJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-registro-public-blocks.js'), 'utf8');
ok('buildBienestarPerfil', registroJs.includes('buildBienestarPerfil'), 'persist');
ok('normalizeBienestarSubId', registroJs.includes('normalizeBienestarSubId'), 'canonical');
ok('resolveConfig bienestar before escort', /if \(matchesBienestar\(ctx, resolved\)\) return resolveBienestarConfig\(\);\s*\n\s*if \(matchesEscort/.test(registroJs), 'order');
ok('resolveConfig venue before bienestar', /if \(matchesVenue\(ctx, resolved\)\) return resolveVenueConfig\(\);\s*\n\s*if \(matchesBienestar/.test(registroJs), 'order venue');

const renderJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-public-render-lite.js'), 'utf8');
ok('cardHTMLBienestar', renderJs.includes('cardHTMLBienestar'), 'render');
ok('isBienestarPerfil', renderJs.includes('isBienestarPerfil'), 'detect');

const viajesJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-viajes-desplazamiento.js'), 'utf8');
const viajesMatch = viajesJs.match(/VIAJES_SUBCATEGORIAS\s*=\s*\[([\s\S]*?)\];/);
const viajesList = viajesMatch ? viajesMatch[1] : '';
ok('spa no en VIAJES_SUBCATEGORIAS', !viajesList.includes("'spa'"), 'no viajes v1');
ok('masajes no en VIAJES_SUBCATEGORIAS', !viajesList.includes("'masajes'"), 'no viajes v1');

const schemaJson = fs.readFileSync(path.join(repoRoot, 'scripts', 'config-registro-adultos-schema.json'), 'utf8');
ok('schema sub spa', schemaJson.includes('"subcategoriaId": "spa"'), 'spa id');
ok('schema sub masajes', schemaJson.includes('"subcategoriaId": "masajes"'), 'masajes id');
ok('schema bienestarPerfil registry', schemaJson.includes('"bienestarPerfil"'), 'registry');
ok('schema tipoBienestar registry', schemaJson.includes('"tipoBienestar"'), 'tipoBienestar');
ok('masajes sin modoRegistroAlternativo activo', !schemaJson.includes('"modoRegistroAlternativo": "persona_acompanante"'), 'neutralizado');

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
ok('aplicarPerfilDesdeRegistro bienestarPerfil', perfilHtml.includes('bienestarPerfil:'), 'preview');
ok('DEMO.spa present', perfilHtml.includes('DEMO.spa='), 'demo spa');
ok('DEMO.masajesLocal negocio_bienestar', /DEMO\.masajesLocal=\{[\s\S]*?negocio_bienestar/.test(perfilHtml), 'demo masajes');

console.log('\n=== NEG bienestar pack cierre (meta) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nNEG bienestar pack cierre OK.');
