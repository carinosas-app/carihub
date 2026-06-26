/**
 * QA — Persistencia persona_espectaculo / espectaculoPerfil.
 * node scripts/qa-espectaculo-persist.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const root = path.join(repoRoot, 'public', 'js');

const ESP_2 = ['stripper', 'tabledance'];

const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

function loadScript(relativePath, ctx) {
  vm.runInContext(fs.readFileSync(path.join(root, relativePath), 'utf8'), ctx, { filename: relativePath });
}

function makeCtx() {
  const ctx = {
    console,
    URL,
    document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] },
  };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  return ctx;
}

function loadAll() {
  const ctx = makeCtx();
  loadScript('carihub-viajes-desplazamiento.js', ctx);
  loadScript('data/registro-adultos-espectaculo-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  return ctx;
}

function espCtx(subId) {
  return { subcategoriaId: subId, arquetipo: 'persona_espectaculo', formularioId: 'adultos' };
}

function payload(subId) {
  return {
    tipoShow: ['Shows privados', 'Despedidas de soltero(a)'],
    precioShow: '$1,200 MXN por canción',
    horarioMinimo: 'Por canción',
    modalidades: ['fiestas', 'despedidas', 'clubes'],
    desplazamientos: 'Sí (costo extra según ubicación)',
    anosExperiencia: '5+ años',
    venueFijo: subId === 'tabledance' ? 'Antros zona centro' : 'Monterrey y área metropolitana',
    serviciosIncluidos: ['Shows privados', 'Interacción con el público'],
    serviciosNoRealizo: ['Servicios sexuales', 'Menores de edad'],
    horarioDetalle: 'Viernes a domingo',
    metodosPago: ['Efectivo', 'Transferencia'],
    sobreMi: 'Shows profesionales con discreción.',
  };
}

const vmCtx = loadAll();
const PB = vmCtx.CariHubRegistroPublicBlocks;

ESP_2.forEach((subId) => {
  const ctx = espCtx(subId);
  const vals = PB.finalizeEspectaculoValues(Object.assign({}, payload(subId)), ctx);
  ok(`${subId} espectaculoPerfil nested`, vals.espectaculoPerfil && Array.isArray(vals.espectaculoPerfil.tipoShow), JSON.stringify(vals.espectaculoPerfil && vals.espectaculoPerfil.tipoShow));
  ok(`${subId} sin dominatrixPerfil`, !vals.dominatrixPerfil, 'clean');
  ok(`${subId} sin swingerPerfil`, !vals.swingerPerfil, 'clean');
  const u = PB.mapEspectaculoToPerfil({ subcategoriaId: subId, nombre: 'QA ESP' }, vals, ctx);
  ok(`${subId} map tipoShow mirror`, !!u.tipoShow && u.tipoShow.includes('Shows privados'), u.tipoShow);
  ok(`${subId} map tipoServicio mirror`, u.tipoServicio === u.tipoShow, u.tipoServicio);
  ok(`${subId} map precio mirrors`, u.precio === u.precioShow && u.precioDesde === u.precioShow, u.precio);
  ok(`${subId} map noRealiza mirror`, Array.isArray(u.noRealiza) && u.noRealiza.includes('Servicios sexuales'), (u.noRealiza || []).join(','));
  ok(`${subId} arquetipo persona_espectaculo`, u.arquetipo === 'persona_espectaculo', u.arquetipo);
  ok(`${subId} nested preserved`, u.espectaculoPerfil && u.espectaculoPerfil.horarioDetalle === 'Viernes a domingo', 'nested');
  ok(`${subId} subcategoriaId canon`, u.subcategoriaId === subId, u.subcategoriaId);
});

const aliasCtx = espCtx('table_dance');
const aliasVals = PB.finalizeEspectaculoValues(Object.assign({}, payload('tabledance')), aliasCtx);
const aliasU = PB.mapEspectaculoToPerfil({ subcategoriaId: 'table_dance' }, aliasVals, aliasCtx);
ok('table_dance persist as tabledance', aliasU.subcategoriaId === 'tabledance', aliasU.subcategoriaId);

const routeEarly = PB.mapToPerfil(
  { subcategoriaId: 'stripper' },
  Object.assign({}, payload('stripper'), { swingerPerfil: { intercambioSwinger: 'Sí' } }),
  espCtx('stripper')
);
ok('mapToPerfil route espectaculo early', routeEarly.arquetipo === 'persona_espectaculo' && !routeEarly.swingerPerfil, 'anti swinger');

ok('escort not espectaculo pipeline', !PB.isEspectaculoSubcategoria({ subcategoriaId: 'escort' }), 'escort');

console.log('\n=== QA Espectaculo persist ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
