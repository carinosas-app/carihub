/**
 * QA — Persistencia negocio_venue / venuePerfil (cabinas).
 * node scripts/qa-neg-venue-cabinas-persist.mjs
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
  return { subcategoriaId: subId, arquetipo: 'negocio_venue', tipoPerfil: 'lugar', formularioId: 'adultos' };
}

function payload() {
  return {
    nombreComercial: 'Cabinas Discretas MTY',
    tipoVenue: 'Cabinas privadas / Glory holes',
    precioEntrada: '$400 MXN / 30 min',
    nivelPrivacidad: 'Alta — acceso individual y discreto',
    areasVenue: ['Cabinas privadas', 'Glory holes', 'Regaderas'],
    reglasAcceso: ['Solo mayores de edad', 'Identificación obligatoria'],
    direccion: 'Valle Oriente, Monterrey',
    horarioDetalle: 'Abierto 24 horas',
    metodosPago: ['Efectivo', 'Tarjeta'],
    reservaciones: 'Sí',
    rfc: 'CAB123456ABC',
    razonSocial: 'Cabinas Discretas SA de CV',
    tagline: 'Privacidad y limpieza',
    telefonoContacto: '8180000000',
    licenciaOperacion: 'LIC-2026-CAB',
    notasInternas: 'QA persist cabinas',
    sobreMi: 'Local verificado.',
  };
}

const vmCtx = loadAll();
const PB = vmCtx.CariHubRegistroPublicBlocks;
const subId = 'cabinas';
const ctx = venueCtx(subId);
const vals = PB.finalizeVenueValues(Object.assign({}, payload()), ctx);

ok('venuePerfil nested', vals.venuePerfil && vals.venuePerfil.tipoVenue, vals.venuePerfil && vals.venuePerfil.tipoVenue);
ok('venuePerfil nivelPrivacidad', vals.venuePerfil && vals.venuePerfil.nivelPrivacidad, 'nivelPrivacidad');
ok('sin retailPerfil', !vals.retailPerfil, 'clean');
ok('sin hospedajePerfil', !vals.hospedajePerfil, 'clean');
ok('sin swingerPerfil', !vals.swingerPerfil, 'clean');
ok('sin parejaGrupoPerfil', !vals.parejaGrupoPerfil, 'clean');
ok('sin cuckoldHotwifePerfil', !vals.cuckoldHotwifePerfil, 'clean');
ok('sin unicornPerfil', !vals.unicornPerfil, 'clean');
ok('sin modalidades escort', !vals.modalidades, 'clean');
ok('sin edad', !vals.edad, 'clean');
ok('sin viaja', !vals.viaja, 'clean');

const u = PB.mapVenueToPerfil({ subcategoriaId: subId, nombre: 'QA Cabinas' }, vals, ctx);
ok('map nombreComercial', u.nombre === payload().nombreComercial, u.nombre);
ok('map precioEntrada', u.precio === u.precioEntrada, u.precio);
ok('arquetipo negocio_venue', u.arquetipo === 'negocio_venue', u.arquetipo);
ok('tipoPerfil lugar', u.tipoPerfil === 'lugar', u.tipoPerfil);
ok('subcategoriaId canon cabinas', u.subcategoriaId === 'cabinas', u.subcategoriaId);
ok('sin badgeSwinger', !u.badgeSwinger, 'no swinger badge');
ok('sin badgeLgbt', !u.badgeLgbt, 'no lgbt badge');
ok('nested preserved nivelPrivacidad', u.venuePerfil && u.venuePerfil.nivelPrivacidad, 'nested');
ok('top-level nivelPrivacidad', u.nivelPrivacidad, u.nivelPrivacidad);

const aliasCtx = venueCtx('cabinas glory holes');
const aliasVals = PB.finalizeVenueValues(Object.assign({}, payload()), aliasCtx);
const aliasU = PB.mapVenueToPerfil({ subcategoriaId: 'cabinas glory holes' }, aliasVals, aliasCtx);
ok('alias persist as cabinas', aliasU.subcategoriaId === 'cabinas', aliasU.subcategoriaId);

const routeEarly = PB.mapToPerfil(
  { subcategoriaId: subId },
  Object.assign({}, payload(), {
    retailPerfil: { categoriasProducto: ['x'] },
    swingerPerfil: { objetivosPerfil: ['x'] },
    parejaGrupoPerfil: { configuracionGrupo: 'x' },
    modalidades: ['recibe'],
    edad: 25,
    viaja: true,
  }),
  venueCtx(subId)
);
ok(
  'mapToPerfil route venue early',
  routeEarly.arquetipo === 'negocio_venue'
    && !routeEarly.retailPerfil
    && !routeEarly.swingerPerfil
    && !routeEarly.parejaGrupoPerfil
    && !routeEarly.modalidades
    && !routeEarly.edad
    && !routeEarly.viaja,
  'anti contamination'
);

console.log('\n=== QA Neg venue cabinas persist ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
