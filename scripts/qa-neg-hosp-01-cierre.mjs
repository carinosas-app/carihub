/**
 * QA — Gate final NEG-HOSP-01 (hotel_motel + BIEN/VEN/RET/CRE/ESP/DOM/HARDEN regresión).
 *
 * node scripts/qa-neg-hosp-01-cierre.mjs
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const GATE_SCRIPTS = [
  'qa-neg-hospedaje-cierre.mjs',
  'qa-neg-bien-01-cierre.mjs',
  'qa-neg-ven-01-cierre.mjs',
  'qa-neg-ret-01-cierre.mjs',
  'qa-cre-01-cierre.mjs',
  'qa-esp-01-cierre.mjs',
  'qa-dom-01-cierre.mjs',
  'qa-harden-01-cierre.mjs',
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
    maxBuffer: 64 * 1024 * 1024,
  });
  const out = (r.stdout || '') + (r.stderr || '');
  process.stdout.write(out);
  return { status: r.status, out };
}

function parsePassCount(out) {
  let total = 0;
  (out.match(/Todos los checks pasaron \((\d+)\)/g) || []).forEach((line) => {
    const m = line.match(/\((\d+)\)/);
    if (m) total += Number(m[1]);
  });
  (out.match(/PASS:\s*(\d+)/g) || []).forEach((line) => {
    total += Number(line.replace(/PASS:\s*/, ''));
  });
  return total;
}

console.log('\n=== NEG-HOSP-01 Gate — ejecución scripts ===');
let gateChecks = 0;

for (const script of GATE_SCRIPTS) {
  const { status, out } = runScript(script);
  gateChecks += parsePassCount(out);
  if (status !== 0) fail.push({ name: script, detail: 'exit ' + status });
  else pass.push({ name: script, detail: 'ok' });
}

console.log('\n=== NEG-HOSP-01 Gate — invariantes ===');

const blocksJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'data', 'registro-adultos-hospedaje-blocks.js'), 'utf8');
ok('blocks NEG_HOSP_1 sub hotel_motel', blocksJs.includes("'hotel_motel'"), 'hotel_motel');
ok('blocks 1/1 sub only', /subcategoriaIds:\s*\['hotel_motel'\]/.test(blocksJs), '1/1');
ok('nested hospedajePerfil', blocksJs.includes("id: 'hospedajePerfil'"), 'block');
ok('no modalidades in bundle', !blocksJs.includes("id: 'modalidades'"), 'excluido');
ok('no edad in bundle', !blocksJs.includes("id: 'edad'"), 'excluido');
ok('tipoHospedaje discriminator', blocksJs.includes("id: 'tipoHospedaje'"), 'tipoHospedaje');

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
ok('DEMO.hotelMotel sub hotel_motel', perfilHtml.includes('subcategoriaId:"hotel_motel"'), 'sub');
ok('DEMO.hotelMotel negocio_hospedaje', /DEMO\.hotelMotel=\{[\s\S]*?arquetipo:"negocio_hospedaje"/.test(perfilHtml), 'arquetipo');
ok('DEMO.hotelMotel tipoPerfil lugar', /DEMO\.hotelMotel=\{[\s\S]*?tipoPerfil:"lugar"/.test(perfilHtml), 'lugar');
ok('aplicarPerfilDesdeRegistro hospedajePerfil', perfilHtml.includes('hospedajePerfil:'), 'preview');
ok('preview alias hotel_motel', perfilHtml.includes('hotel_motel:"hotelMotel"') || perfilHtml.includes('hotel motel":"hotelMotel"'), 'alias');

const viajesJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-viajes-desplazamiento.js'), 'utf8');
const viajesMatch = viajesJs.match(/VIAJES_SUBCATEGORIAS\s*=\s*\[([\s\S]*?)\];/);
const viajesList = viajesMatch ? viajesMatch[1] : '';
ok('v1 sin viajes hotel_motel', !viajesList.includes("'hotel_motel'"), 'excluido');

ok('normalizeHospedajeSubId', fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-registro-public-blocks.js'), 'utf8').includes('normalizeHospedajeSubId'), 'normalizer');

const registroJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-registro-public-blocks.js'), 'utf8');
ok('resolver order hospedaje before escort', /if \(matchesHospedaje\(ctx, resolved\)\) return resolveHospedajeConfig\(\);\s*\n\s*if \(matchesEscort/.test(registroJs), 'order');

console.log('\n=== NEG-HOSP-01 Gate (meta) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nNEG-HOSP-01 Gate OK. Checks acumulados (scripts hijos):', gateChecks);
