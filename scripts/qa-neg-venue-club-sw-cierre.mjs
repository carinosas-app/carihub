/**
 * QA — Cierre pack NEG venue club_sw (orquesta motor + persist + render + schema + viajes exclusion).
 * node scripts/qa-neg-venue-club-sw-cierre.mjs
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const PACK = [
  'validar-schemas-registro.mjs',
  'qa-neg-venue-club-sw.mjs',
  'qa-neg-venue-club-sw-persist.mjs',
  'qa-neg-venue-club-sw-render.mjs',
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

console.log('\n=== NEG venue club_sw pack cierre — scripts ===');
for (const script of PACK) {
  const { status } = runScript(script);
  if (status !== 0) fail.push({ name: script, detail: 'exit ' + status });
  else pass.push({ name: script, detail: 'ok' });
}

console.log('\n=== NEG venue club_sw pack cierre — invariantes ===');

const blocksJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'data', 'registro-adultos-venue-blocks.js'), 'utf8');
ok('blocks sub club_sw', blocksJs.includes("'club_sw'"), 'club_sw');
ok('nested venuePerfil block id', blocksJs.includes("id: 'venuePerfil'"), 'block');
ok('eventosTematicos field', blocksJs.includes("id: 'eventosTematicos'"), 'eventosTematicos');
ok('politicaParejasSingles field', blocksJs.includes("id: 'politicaParejasSingles'"), 'politica');
ok('club_sw still in bundle post VEN-03', blocksJs.includes("'club_sw'"), 'club_sw');
ok('no viaja modalidad', !blocksJs.includes("'viaja'"), 'no viaja');
ok('no modalidades escort field', !blocksJs.includes("id: 'modalidades'"), 'no modalidades escort');
ok('no clubSwPerfil nested', !blocksJs.includes("id: 'clubSwPerfil'"), 'no clubSwPerfil');

const registroJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-registro-public-blocks.js'), 'utf8');
ok('buildVenuePerfil', registroJs.includes('buildVenuePerfil'), 'persist');
ok('normalizeVenueSubId club aliases', registroJs.includes("'club sw'") && registroJs.includes("'club_sw'"), 'aliases');
ok('inferVenueSubId export', registroJs.includes('inferVenueSubId: inferVenueSubId'), 'export');
ok('badgeSwinger on club_sw map', /canon === 'club_sw'[\s\S]*?u\.badgeSwinger = true/.test(registroJs), 'badge negocio');
ok('isSwingerSubcategoria excludes club_sw', registroJs.includes("normalizeParejaSubId") && registroJs.includes("=== 'swinger'"), 'no pareja pipeline');

const renderJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-public-render-lite.js'), 'utf8');
ok('cardHTMLClubSw', renderJs.includes('cardHTMLClubSw'), 'render');
ok('isClubSwPerfil', renderJs.includes('isClubSwPerfil'), 'detect');

const fieldJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-field-engine-lite.js'), 'utf8');
ok('field-engine clubSw route', fieldJs.includes("return 'clubSw'"), 'vista clubSw');

const viajesJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-viajes-desplazamiento.js'), 'utf8');
const viajesMatch = viajesJs.match(/VIAJES_SUBCATEGORIAS\s*=\s*\[([\s\S]*?)\];/);
const viajesList = viajesMatch ? viajesMatch[1] : '';
ok('club_sw no en VIAJES_SUBCATEGORIAS', !viajesList.includes("'club_sw'"), 'no viajes v1');

const schemaJson = fs.readFileSync(path.join(repoRoot, 'scripts', 'config-registro-adultos-schema.json'), 'utf8');
ok('schema sub club_sw', schemaJson.includes('"subcategoriaId": "club_sw"'), 'club_sw id');
ok('schema venuePerfil registry', schemaJson.includes('"venuePerfil"'), 'registry');
ok('schema eventosTematicos registry', schemaJson.includes('"eventosTematicos"'), 'eventosTematicos');

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
ok('DEMO.clubSw present', perfilHtml.includes('DEMO.clubSw='), 'demo clubSw');
ok('DEMO.clubSw negocio_venue', /DEMO\.clubSw=\{[\s\S]*?arquetipo:"negocio_venue"/.test(perfilHtml), 'arquetipo');
ok('aplicarPerfilDesdeRegistro venuePerfil', perfilHtml.includes('venuePerfil:'), 'preview');

console.log('\n=== NEG venue club_sw pack cierre (meta) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nNEG venue club_sw pack cierre OK.');
