/**
 * QA — Cierre pack NEG hospedaje (orquesta motor + persist + render + schema + viajes exclusion).
 * node scripts/qa-neg-hospedaje-cierre.mjs
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const PACK = [
  'validar-schemas-registro.mjs',
  'qa-neg-hospedaje.mjs',
  'qa-neg-hospedaje-persist.mjs',
  'qa-neg-hospedaje-render.mjs',
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

console.log('\n=== NEG hospedaje pack cierre — scripts ===');
for (const script of PACK) {
  const { status } = runScript(script);
  if (status !== 0) fail.push({ name: script, detail: 'exit ' + status });
  else pass.push({ name: script, detail: 'ok' });
}

console.log('\n=== NEG hospedaje pack cierre — invariantes ===');

const blocksJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'data', 'registro-adultos-hospedaje-blocks.js'), 'utf8');
ok('blocks sub hotel_motel', blocksJs.includes("'hotel_motel'"), 'hotel_motel');
ok('nested hospedajePerfil block id', blocksJs.includes("id: 'hospedajePerfil'"), 'block');
ok('no viaja modalidad', !blocksJs.includes("'viaja'"), 'no viaja');
ok('no modalidades escort field', !blocksJs.includes("id: 'modalidades'"), 'no modalidades escort');
ok('no edad field', !blocksJs.includes("id: 'edad'"), 'no edad');
ok('tipoHospedaje discriminator', blocksJs.includes("id: 'tipoHospedaje'"), 'tipoHospedaje');

const registroJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-registro-public-blocks.js'), 'utf8');
ok('buildHospedajePerfil', registroJs.includes('buildHospedajePerfil'), 'persist');
ok('normalizeHospedajeSubId', registroJs.includes('normalizeHospedajeSubId'), 'canonical');
ok('resolveConfig hospedaje before escort', /if \(matchesHospedaje\(ctx, resolved\)\) return resolveHospedajeConfig\(\);\s*\n\s*if \(matchesEscort/.test(registroJs), 'order');
ok('resolveConfig bienestar before hospedaje', /if \(matchesBienestar\(ctx, resolved\)\) return resolveBienestarConfig\(\);\s*\n\s*if \(matchesHospedaje/.test(registroJs), 'order bienestar');

const renderJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-public-render-lite.js'), 'utf8');
ok('cardHTMLHospedaje', renderJs.includes('cardHTMLHospedaje'), 'render');
ok('isHospedajePerfil', renderJs.includes('isHospedajePerfil'), 'detect');

const viajesJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-viajes-desplazamiento.js'), 'utf8');
const viajesMatch = viajesJs.match(/VIAJES_SUBCATEGORIAS\s*=\s*\[([\s\S]*?)\];/);
const viajesList = viajesMatch ? viajesMatch[1] : '';
ok('hotel_motel no en VIAJES_SUBCATEGORIAS', !viajesList.includes("'hotel_motel'"), 'no viajes v1');
ok('hotel motel no en VIAJES_SUBCATEGORIAS', !viajesList.includes("'hotel motel'"), 'no viajes alias');

const schemaJson = fs.readFileSync(path.join(repoRoot, 'scripts', 'config-registro-adultos-schema.json'), 'utf8');
ok('schema sub hotel_motel', schemaJson.includes('"subcategoriaId": "hotel_motel"'), 'hotel_motel id');
ok('schema hospedajePerfil registry', schemaJson.includes('"hospedajePerfil"'), 'registry');
ok('schema tipoHospedaje registry', schemaJson.includes('"tipoHospedaje"'), 'tipoHospedaje');

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
ok('aplicarPerfilDesdeRegistro hospedajePerfil', perfilHtml.includes('hospedajePerfil:'), 'preview');
ok('DEMO.hotelMotel present', perfilHtml.includes('DEMO.hotelMotel='), 'demo hotelMotel');
ok('DEMO.hotelMotel negocio_hospedaje', /DEMO\.hotelMotel=\{[\s\S]*?negocio_hospedaje/.test(perfilHtml), 'demo arquetipo');

console.log('\n=== NEG hospedaje pack cierre (meta) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nNEG hospedaje pack cierre OK.');
