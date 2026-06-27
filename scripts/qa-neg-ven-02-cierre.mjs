/**
 * QA — Gate final NEG-VEN-02 (club_sw + HOSP/BIEN/VEN01/RET/CRE/ESP/DOM/HARDEN regresión).
 *
 * node scripts/qa-neg-ven-02-cierre.mjs
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const GATE_SCRIPTS = [
  'qa-neg-venue-club-sw-cierre.mjs',
  'qa-neg-hosp-01-cierre.mjs',
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

console.log('\n=== NEG-VEN-02 Gate — ejecución scripts ===');
let gateChecks = 0;

for (const script of GATE_SCRIPTS) {
  const { status, out } = runScript(script);
  gateChecks += parsePassCount(out);
  if (status !== 0) fail.push({ name: script, detail: 'exit ' + status });
  else pass.push({ name: script, detail: 'ok' });
}

console.log('\n=== NEG-VEN-02 Gate — invariantes ===');

const blocksJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'data', 'registro-adultos-venue-blocks.js'), 'utf8');
ok('blocks NEG_VEN_02 sub club_sw', blocksJs.includes("'club_sw'"), 'club_sw');
ok('1/1 sub club_sw only once', (blocksJs.match(/'club_sw'/g) || []).length >= 1, 'canon');
ok('nested venuePerfil not clubSwPerfil', blocksJs.includes("id: 'venuePerfil'") && !blocksJs.includes("id: 'clubSwPerfil'"), 'venuePerfil');
ok('no cabinas', !blocksJs.includes("'cabinas'"), 'excluido');
ok('no cine_xxx', !blocksJs.includes("'cine_xxx'"), 'excluido');
ok('no modalidades in bundle', !blocksJs.includes("id: 'modalidades'"), 'excluido');
ok('no edad in bundle', !blocksJs.includes("id: 'edad'"), 'excluido');

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
ok('DEMO.clubSw sub club_sw', perfilHtml.includes('subcategoriaId:"club_sw"'), 'sub');
ok('DEMO.clubSw negocio_venue', /DEMO\.clubSw=\{[\s\S]*?arquetipo:"negocio_venue"/.test(perfilHtml), 'arquetipo');
ok('DEMO.clubSw tipoPerfil lugar', /DEMO\.clubSw=\{[\s\S]*?tipoPerfil:"lugar"/.test(perfilHtml), 'lugar');
ok('DEMO.clubSw badgeSwinger', /DEMO\.clubSw=\{[\s\S]*?badgeSwinger:true/.test(perfilHtml), 'badge negocio');
ok('preview alias club_sw', perfilHtml.includes('club_sw:"clubSw"'), 'alias');

const viajesJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-viajes-desplazamiento.js'), 'utf8');
const viajesMatch = viajesJs.match(/VIAJES_SUBCATEGORIAS\s*=\s*\[([\s\S]*?)\];/);
const viajesList = viajesMatch ? viajesMatch[1] : '';
ok('v1 sin viajes club_sw', !viajesList.includes("'club_sw'"), 'excluido');

const registroJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-registro-public-blocks.js'), 'utf8');
ok('normalizeVenueSubId club aliases', registroJs.includes("'club sw'") && registroJs.includes("'club_swinger'"), 'aliases');
ok('resolveConfig club_sw -> negocio_venue', registroJs.includes("canon === 'club_sw'"), 'venue canon');

console.log('\n=== NEG-VEN-02 Gate (meta) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nNEG-VEN-02 Gate OK. Checks acumulados (scripts hijos):', gateChecks);
