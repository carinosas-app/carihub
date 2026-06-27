/**
 * QA — Persistencia negocio_hospedaje / hospedajePerfil.
 * node scripts/qa-neg-hospedaje-persist.mjs
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
  loadScript('data/registro-adultos-bienestar-blocks.js', ctx);
  loadScript('data/registro-adultos-hospedaje-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  return ctx;
}

function hospedajeCtx(subId) {
  return { subcategoriaId: subId, arquetipo: 'negocio_hospedaje', tipoPerfil: 'lugar', formularioId: 'adultos' };
}

function payload() {
  return {
    nombreComercial: 'Motel Cariñoso GDL',
    tipoHospedaje: 'Motel',
    tiposHabitacion: ['Estándar', 'Suite jacuzzi', 'Habitación por horas'],
    tarifaHora: '$450 MXN / hora',
    tarifaNoche: '$1,200 MXN / noche',
    direccion: 'Providencia, Guadalajara',
    horarioDetalle: 'Abierto 24 horas',
    reglasEstancia: ['Solo mayores de edad', 'No menores'],
    metodosPago: ['Efectivo', 'Tarjeta'],
    reservaciones: 'Sí',
    rfc: 'HOS123456ABC',
    razonSocial: 'Hospedaje SA de CV',
    tagline: 'Local verificado',
    amenidades: ['Jacuzzi en habitación', 'WiFi'],
    estacionamiento: 'Cochera privada',
    privacidadDiscrecion: ['Entrada discreta', 'Acceso 24 horas'],
    telefonoContacto: '3330000000',
    licenciaOperacion: 'LIC-2026-HOS',
    documentos: 'RFC + licencia',
    notasInternas: 'QA persist',
    sobreMi: 'Motel verificado con habitaciones temáticas.',
  };
}

const vmCtx = loadAll();
const PB = vmCtx.CariHubRegistroPublicBlocks;
const subId = 'hotel_motel';
const ctx = hospedajeCtx(subId);
const vals = PB.finalizeHospedajeValues(Object.assign({}, payload()), ctx);

ok('hospedajePerfil nested', vals.hospedajePerfil && vals.hospedajePerfil.tipoHospedaje, vals.hospedajePerfil && vals.hospedajePerfil.tipoHospedaje);
ok('sin retailPerfil', !vals.retailPerfil, 'clean');
ok('sin venuePerfil', !vals.venuePerfil, 'clean');
ok('sin bienestarPerfil', !vals.bienestarPerfil, 'clean');
ok('sin creadorPerfil', !vals.creadorPerfil, 'clean');
ok('sin modalidades escort', !vals.modalidades, 'clean');
ok('sin edad', !vals.edad, 'clean');
ok('sin viaja', !vals.viaja, 'clean');

const u = PB.mapHospedajeToPerfil({ subcategoriaId: subId, nombre: 'QA Hospedaje' }, vals, ctx);
ok('map nombreComercial', u.nombre === payload().nombreComercial, u.nombre);
ok('map tarifaHora precio', u.precio === u.tarifaHora, u.precio);
ok('arquetipo negocio_hospedaje', u.arquetipo === 'negocio_hospedaje', u.arquetipo);
ok('tipoPerfil lugar', u.tipoPerfil === 'lugar', u.tipoPerfil);
ok('nested preserved', u.hospedajePerfil && u.hospedajePerfil.tarifaNoche, 'nested');
ok('subcategoriaId canon', u.subcategoriaId === subId, u.subcategoriaId);
ok('tiposHabitacion top', Array.isArray(u.tiposHabitacion) && u.tiposHabitacion.length, String(u.tiposHabitacion && u.tiposHabitacion.length));

const routeEarly = PB.mapToPerfil(
  { subcategoriaId: subId },
  Object.assign({}, payload(), {
    retailPerfil: { categoriasProducto: ['x'] },
    venuePerfil: { tipoVenue: 'x' },
    bienestarPerfil: { tipoBienestar: 'x' },
    modalidades: ['recibe'],
    edad: 25,
    viaja: true,
  }),
  hospedajeCtx(subId)
);
ok('mapToPerfil route hospedaje early', routeEarly.arquetipo === 'negocio_hospedaje' && !routeEarly.retailPerfil && !routeEarly.venuePerfil && !routeEarly.bienestarPerfil && !routeEarly.modalidades && !routeEarly.edad && !routeEarly.viaja, 'anti contamination');

ok('spa not hospedaje pipeline', !PB.isHospedajeSubcategoria({ subcategoriaId: 'spa' }), 'spa');
ok('retail not hospedaje pipeline', !PB.isHospedajeSubcategoria({ subcategoriaId: 'sex_shop' }), 'sex_shop');
ok('persona hotel not hospedaje', !PB.isHospedajeSubcategoria({ subcategoriaId: 'hotel_motel', tipoPerfil: 'persona' }), 'persona');

console.log('\n=== QA Neg hospedaje persist ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
