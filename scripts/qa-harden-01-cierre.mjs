/**
 * QA — Gate final HARDEN-01 (consolidación persona_acompanante + regresiones).
 *
 * node scripts/qa-harden-01-cierre.mjs
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

const GATE_SCRIPTS = [
  'validar-schemas-registro.mjs',
  'qa-persona-acompanante-cierre.mjs',
  'qa-pareja-swinger-cierre.mjs',
  'qa-cuckold-hotwife-cierre.mjs',
  'qa-unicorn-cierre.mjs',
  'qa-viajes-desplazamiento.mjs',
  'qa-pareja-grupo-base.mjs',
];

const PERSONA_ACOMPANANTE_15 = [
  'escort', 'escort_gay', 'escort_vip', 'edecan', 'modelos', 'gigolo', 'acompanante',
  'petit', 'trans', 'femboy', 'singles', 'lesbians', 'tom_boy', 'tom_fem', 'dotados',
];

const pass = [];
const fail = [];

function extractDemoObject(html, demoKey) {
  const re = new RegExp(`DEMO\\.${demoKey}=\\{([\\s\\S]*?)\\n\\};`);
  const m = html.match(re);
  return m ? m[0] : '';
}

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

function runScript(scriptName) {
  const scriptPath = path.join(__dirname, scriptName);
  const r = spawnSync(process.execPath, [scriptPath], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const out = (r.stdout || '') + (r.stderr || '');
  process.stdout.write(out);
  return { status: r.status, out };
}

function parsePassCount(out) {
  let total = 0;
  const todos = out.match(/Todos los checks pasaron \((\d+)\)/g);
  if (todos) {
    todos.forEach((line) => {
      const m = line.match(/\((\d+)\)/);
      if (m) total += Number(m[1]);
    });
  }
  const passLines = out.match(/PASS:\s*(\d+)/g);
  if (passLines) {
    passLines.forEach((line) => {
      total += Number(line.replace(/PASS:\s*/, ''));
    });
  }
  return total;
}

console.log('\n=== HARDEN-01 Gate — ejecución scripts ===');
let gateChecks = 0;

for (const script of GATE_SCRIPTS) {
  const { status, out } = runScript(script);
  gateChecks += parsePassCount(out);
  if (status !== 0) {
    fail.push({ name: script, detail: 'exit ' + status });
  } else {
    pass.push({ name: script, detail: 'ok' });
  }
  if (script === 'validar-schemas-registro.mjs') {
    ok('schema 0 errores', /Errores:\s*0/.test(out), out.split('\n').find((l) => /Errores:/.test(l)) || '');
    ok('schema 0 advertencias', /Advertencias:\s*0/.test(out), out.split('\n').find((l) => /Advertencias:/.test(l)) || '');
  }
}

console.log('\n=== HARDEN-01 Gate — invariantes ===');

const mapa = JSON.parse(fs.readFileSync(path.join(repoRoot, 'scripts', 'mapa-registro-categorias.json'), 'utf8'));
const adultos = (mapa.matrix || []).filter((row) => row.sectorId === 'adultos');
ok('mapa total 461', mapa.total === 461, String(mapa.total));
ok('adultos 33 subcategorías', adultos.length === 33, String(adultos.length));
ok('hotwife no subcategoría pública', !adultos.some((r) => r.subcategoriaId === 'hotwife'), 'sin hotwife id');
ok(
  'hotwife ausente en schema adultos',
  !/"subcategoriaId":\s*"hotwife"/.test(fs.readFileSync(path.join(repoRoot, 'scripts', 'config-registro-adultos-schema.json'), 'utf8')),
  'schema'
);

const schemaJson = fs.readFileSync(path.join(repoRoot, 'scripts', 'config-registro-adultos-schema.json'), 'utf8');
ok(
  'cuckold_hotwife dinámica hotwife',
  schemaJson.includes('"subcategoriaId": "cuckold_hotwife"') &&
    schemaJson.includes('"dinamicaOpciones": ["cuckold", "hotwife", "ambos"]'),
  'dinamicaOpciones'
);
ok(
  'mapa cuckold_hotwife presente',
  adultos.some((r) => r.subcategoriaId === 'cuckold_hotwife' || r.subcategoriaId === 'cuckold hotwife'),
  'mapa C/H'
);

ok(
  'qa-pareja-swinger-cierre.mjs existe',
  fs.existsSync(path.join(__dirname, 'qa-pareja-swinger-cierre.mjs')),
  'scripts/qa-pareja-swinger-cierre.mjs'
);

const renderJs = fs.readFileSync(path.join(__dirname, 'qa-persona-acompanante-render.mjs'), 'utf8');
ok(
  'render QA 15/15 subs declaradas',
  renderJs.includes('PERSONA_ACOMPANANTE_15') &&
    PERSONA_ACOMPANANTE_15.every((id) => renderJs.includes(`'${id}'`)),
  PERSONA_ACOMPANANTE_15.join(', ')
);
ok('render QA assert H2 15/15', renderJs.includes('H2 cobertura tarjeta 15/15 subs'), 'H2 assert');

const viajesJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'carihub-viajes-desplazamiento.js'), 'utf8');
const viajesMatch = viajesJs.match(/VIAJES_SUBCATEGORIAS\s*=\s*\[([\s\S]*?)\];/);
const viajesIds = viajesMatch
  ? viajesMatch[1].match(/'[^']+'/g).map((s) => s.replace(/'/g, ''))
  : [];
ok('viajes 18 subs en runtime', viajesIds.length === 18, String(viajesIds.length));
ok('viajes QA H3 count 18', fs.readFileSync(path.join(__dirname, 'qa-viajes-desplazamiento.mjs'), 'utf8').includes('H3 VIAJES_SUBCATEGORIAS count 18'), 'H3');

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
const demoEdecan = extractDemoObject(perfilHtml, 'edecan');
const demoModelos = extractDemoObject(perfilHtml, 'modelos');
const demoDotados = extractDemoObject(perfilHtml, 'dotados');
const demoFemboy = extractDemoObject(perfilHtml, 'femboy');
const demoSingles = extractDemoObject(perfilHtml, 'singles');
const demoGigolo = extractDemoObject(perfilHtml, 'gigolo');
const demoLesbians = extractDemoObject(perfilHtml, 'lesbians');
const demoTomBoy = extractDemoObject(perfilHtml, 'tomBoy');
const demoTomFem = extractDemoObject(perfilHtml, 'tomFem');

ok('H6 DEMO.edecan presente', demoEdecan.includes('subcategoriaId:"edecan"'), 'edecan');
ok('H6 DEMO.modelos presente', demoModelos.includes('subcategoriaId:"modelos"'), 'modelos');
ok('H6 DEMO.dotados presente', demoDotados.includes('subcategoriaId:"dotados"'), 'dotados');
ok('H6 DEMO.femboy presente', demoFemboy.includes('subcategoriaId:"femboy"'), 'femboy');
ok('H6 DEMO.singles presente', demoSingles.includes('subcategoriaId:"singles"'), 'singles');
ok('H7 DEMO.gigolo presente', demoGigolo.includes('subcategoriaId:"gigolo"'), 'gigolo');
ok('H7 DEMO.lesbians presente', demoLesbians.includes('subcategoriaId:"lesbians"'), 'lesbians');
ok('H7 DEMO.tomBoy presente', demoTomBoy.includes('subcategoriaId:"tom_boy"'), 'tomBoy');
ok('H7 DEMO.tomFem presente', demoTomFem.includes('subcategoriaId:"tom_fem"'), 'tomFem');
ok('H6 DEMO edecan eventosDisponibles', demoEdecan.includes('eventosDisponibles:true'), 'eventos');
ok('H6 DEMO modelos portfolioURL', demoModelos.includes('portfolioURL:'), 'portfolio');
ok('H6 DEMO dotados longitudCm', demoDotados.includes('longitudCm:'), 'longitud');
ok('H6 DEMO femboy presentacionFemboy', demoFemboy.includes('presentacionFemboy:'), 'femboy');
ok(
  'H6 DEMO singles sin modalidades escort',
  demoSingles.length > 0 && !demoSingles.includes('modalidades:') && !demoSingles.includes('modalidadFicha:'),
  'sin modalidades'
);
ok('H7 DEMO lesbians toggles', demoLesbians.includes('mostrarAtiendoA:"Sí"') && demoLesbians.includes('mostrarColaboraciones:"Sí"'), 'toggles');
ok('H7 DEMO tomBoy presentacion', demoTomBoy.includes('presentacionTom:') && demoTomBoy.includes('estiloPredominante:'), 'tomBoy');
ok('H7 DEMO tomFem presentacion', demoTomFem.includes('presentacionTom:') && demoTomFem.includes('estiloPredominante:'), 'tomFem');

const resultadosDemoJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'resultados-demo.js'), 'utf8');
ok('H7 routing demo gigolo -> adult', /gigolo:\s*'adult'/.test(resultadosDemoJs), 'gigolo');
ok('H7 routing demo femboy -> femboy', /femboy:\s*'femboy'/.test(resultadosDemoJs), 'femboy');
ok('H7 routing demo singles -> singles', /singles:\s*'singles'/.test(resultadosDemoJs), 'singles');
ok('H7 routing demo lesbians -> adult', /lesbians:\s*'adult'/.test(resultadosDemoJs), 'lesbians');

console.log('\n=== HARDEN-01 Gate (meta) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nHARDEN-01 Gate OK. Checks acumulados (scripts hijos):', gateChecks);
console.log('Invariantes meta:', pass.length - GATE_SCRIPTS.length);
