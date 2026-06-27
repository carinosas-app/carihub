/**
 * QA — Persistencia negocio_venue / venuePerfil.
 * node scripts/qa-neg-venue-persist.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const root = path.join(repoRoot, 'public', 'js');

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
  loadScript('data/registro-adultos-retail-blocks.js', ctx);
  loadScript('data/registro-adultos-venue-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  return ctx;
}

function venueCtx(subId) {
  return { subcategoriaId: subId, arquetipo: 'negocio_venue', formularioId: 'adultos' };
}

function payload(subId) {
  return {
    nombreComercial: subId === 'antro_lgbt' ? 'Rainbow Club MTY' : 'Nocturna MTY',
    tipoVenue: subId === 'antro_lgbt' ? 'Antro LGBT+' : 'Antro / Discoteca',
    precioEntrada: '$350 MXN',
    cartelera: 'DJ internacional viernes',
    dressCode: 'Elegante casual',
    areasVenue: ['Pista principal', 'Mesas VIP'],
    reglasAcceso: ['Solo mayores de edad', 'Cover en puerta'],
    direccion: 'Centro, Monterrey',
    horarioDetalle: 'Vie–Dom 10:00 PM – 4:00 AM',
    metodosPago: ['Efectivo', 'Tarjeta'],
    reservaciones: 'Sí',
    rfc: 'ANT123456ABC',
    razonSocial: 'Nocturna SA de CV',
    tagline: 'Vida nocturna premium',
    sobreMi: 'Antro icónico en el centro.',
  };
}

const vmCtx = loadAll();
const PB = vmCtx.CariHubRegistroPublicBlocks;

function testSub(subId) {
  const ctx = venueCtx(subId);
  const vals = PB.finalizeVenueValues(Object.assign({}, payload(subId)), ctx);
  ok(`${subId} venuePerfil nested`, vals.venuePerfil && vals.venuePerfil.tipoVenue, vals.venuePerfil && vals.venuePerfil.tipoVenue);
  ok(`${subId} sin retailPerfil`, !vals.retailPerfil, 'clean');
  ok(`${subId} sin creadorPerfil`, !vals.creadorPerfil, 'clean');
  ok(`${subId} sin modalidades escort`, !vals.modalidades, 'clean');

  const u = PB.mapVenueToPerfil({ subcategoriaId: subId, nombre: 'QA Venue' }, vals, ctx);
  ok(`${subId} map nombreComercial`, u.nombre === payload(subId).nombreComercial, u.nombre);
  ok(`${subId} map precioEntrada`, u.precio === u.precioEntrada, u.precio);
  ok(`${subId} arquetipo negocio_venue`, u.arquetipo === 'negocio_venue', u.arquetipo);
  ok(`${subId} tipoPerfil lugar`, u.tipoPerfil === 'lugar', u.tipoPerfil);
  ok(`${subId} nested preserved`, u.venuePerfil && u.venuePerfil.cartelera, 'nested');
  ok(`${subId} subcategoriaId canon`, u.subcategoriaId === subId, u.subcategoriaId);
  if (subId === 'antro_lgbt') {
    ok(`${subId} badgeLgbt true`, u.badgeLgbt === true, String(u.badgeLgbt));
  } else {
    ok(`${subId} sin badgeLgbt`, !u.badgeLgbt, 'no lgbt badge');
  }
}

testSub('antro');
testSub('antro_lgbt');

const aliasCtx = venueCtx('antro restaurant bar lgbt');
const aliasVals = PB.finalizeVenueValues(Object.assign({}, payload('antro_lgbt')), aliasCtx);
const aliasU = PB.mapVenueToPerfil({ subcategoriaId: 'antro restaurant bar lgbt' }, aliasVals, aliasCtx);
ok('alias persist as antro_lgbt', aliasU.subcategoriaId === 'antro_lgbt', aliasU.subcategoriaId);

const routeEarly = PB.mapToPerfil(
  { subcategoriaId: 'antro' },
  Object.assign({}, payload('antro'), { retailPerfil: { categoriasProducto: ['x'] }, modalidades: ['recibe'] }),
  venueCtx('antro')
);
ok('mapToPerfil route venue early', routeEarly.arquetipo === 'negocio_venue' && !routeEarly.retailPerfil && !routeEarly.modalidades, 'anti contamination');

ok('retail not venue pipeline', !PB.isVenueSubcategoria({ subcategoriaId: 'sex_shop' }), 'sex_shop');

console.log('\n=== QA Neg venue persist ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
