/**
 * QA — Cierre pack NEG venue cabinas + cine_xxx (NEG-VEN-03).
 * node scripts/qa-neg-venue-cabinas-cine-cierre.mjs
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const PACK = [
  'validar-schemas-registro.mjs',
  'qa-neg-venue-cabinas.mjs',
  'qa-neg-venue-cine-xxx.mjs',
  'qa-neg-venue-cabinas-persist.mjs',
  'qa-neg-venue-cine-xxx-persist.mjs',
  'qa-neg-venue-cabinas-render.mjs',
  'qa-neg-venue-cine-xxx-render.mjs',
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

console.log('\n=== NEG venue cabinas+cine pack cierre — scripts ===');
for (const script of PACK) {
  const { status } = runScript(script);
  if (status !== 0) fail.push({ name: script, detail: 'exit ' + status });
  else pass.push({ name: script, detail: 'ok' });
}

console.log('\n=== NEG venue cabinas+cine pack cierre — invariantes ===');

const blocksJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'data', 'registro-adultos-venue-blocks.js'), 'utf8');
ok('blocks sub cabinas', blocksJs.includes("'cabinas'"), 'cabinas');
ok('blocks sub cine_xxx', blocksJs.includes("'cine_xxx'"), 'cine_xxx');
ok('2/2 subs in bundle', blocksJs.includes("'cabinas'") && blocksJs.includes("'cine_xxx'"), 'cabinas + cine_xxx');
ok('nested venuePerfil block id', blocksJs.includes("id: 'venuePerfil'"), 'block');
ok('nivelPrivacidad field', blocksJs.includes("id: 'nivelPrivacidad'"), 'nivelPrivacidad');
ok('horariosFunciones field', blocksJs.includes("id: 'horariosFunciones'"), 'horariosFunciones');
ok('clasificacion field', blocksJs.includes("id: 'clasificacion'"), 'clasificacion');
ok('no cabinasPerfil nested', !blocksJs.includes("id: 'cabinasPerfil'"), 'no cabinasPerfil');
ok('no cineXxxPerfil nested', !blocksJs.includes("id: 'cineXxxPerfil'"), 'no cineXxxPerfil');
ok('no viaja modalidad', !blocksJs.includes("'viaja'"), 'no viaja');
ok('no modalidades escort field', !blocksJs.includes("id: 'modalidades'"), 'no modalidades escort');

const registroJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-registro-public-blocks.js'), 'utf8');
ok('buildVenuePerfil', registroJs.includes('buildVenuePerfil'), 'persist');
ok('normalizeVenueSubId cabinas aliases', registroJs.includes("'cabinas glory holes'"), 'cabinas aliases');
ok('normalizeVenueSubId cine aliases', registroJs.includes("'cine adulto'"), 'cine aliases');
ok('inferVenueSubId export', registroJs.includes('inferVenueSubId: inferVenueSubId'), 'export');

const renderJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-public-render-lite.js'), 'utf8');
ok('cardHTMLCabinas', renderJs.includes('cardHTMLCabinas'), 'render cabinas');
ok('cardHTMLCineXxx', renderJs.includes('cardHTMLCineXxx'), 'render cine');
ok('isCabinasPerfil', renderJs.includes('isCabinasPerfil'), 'detect cabinas');
ok('isCineXxxPerfil', renderJs.includes('isCineXxxPerfil'), 'detect cine');

const fieldJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-field-engine-lite.js'), 'utf8');
ok('field-engine cabinas route', fieldJs.includes("return 'cabinas'"), 'vista cabinas');
ok('field-engine cineXxx route', fieldJs.includes("return 'cineXxx'"), 'vista cineXxx');

const viajesJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-viajes-desplazamiento.js'), 'utf8');
const viajesMatch = viajesJs.match(/VIAJES_SUBCATEGORIAS\s*=\s*\[([\s\S]*?)\];/);
const viajesList = viajesMatch ? viajesMatch[1] : '';
ok('cabinas no en VIAJES_SUBCATEGORIAS', !viajesList.includes("'cabinas'"), 'no viajes v1');
ok('cine_xxx no en VIAJES_SUBCATEGORIAS', !viajesList.includes("'cine_xxx'"), 'no viajes v1');

const schemaJson = fs.readFileSync(path.join(repoRoot, 'scripts', 'config-registro-adultos-schema.json'), 'utf8');
ok('schema sub cabinas', schemaJson.includes('"subcategoriaId": "cabinas"'), 'cabinas id');
ok('schema sub cine_xxx', schemaJson.includes('"subcategoriaId": "cine_xxx"'), 'cine_xxx id');
ok('schema nivelPrivacidad registry', schemaJson.includes('"nivelPrivacidad"'), 'registry');
ok('schema horariosFunciones registry', schemaJson.includes('"horariosFunciones"'), 'registry');
ok('schema clasificacion registry', schemaJson.includes('"clasificacion"'), 'registry');

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
ok('DEMO.cabinas present', perfilHtml.includes('DEMO.cabinas='), 'demo cabinas');
ok('DEMO.cineXxx present', perfilHtml.includes('DEMO.cineXxx='), 'demo cineXxx');
ok('DEMO.cabinas negocio_venue', /DEMO\.cabinas=\{[\s\S]*?arquetipo:"negocio_venue"/.test(perfilHtml), 'cabinas arquetipo');
ok('DEMO.cineXxx negocio_venue', /DEMO\.cineXxx=\{[\s\S]*?arquetipo:"negocio_venue"/.test(perfilHtml), 'cine arquetipo');
ok('aplicarPerfilDesdeRegistro venuePerfil', perfilHtml.includes('venuePerfil:'), 'preview');

console.log('\n=== NEG venue cabinas+cine pack cierre (meta) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nNEG venue cabinas+cine pack cierre OK.');
