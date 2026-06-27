/**
 * QA — Persistencia negocio_venue / venuePerfil (club_sw).
 * node scripts/qa-neg-venue-club-sw-persist.mjs
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
    nombreComercial: 'Club Eros Lifestyle',
    tipoVenue: 'Club Swinger / Lifestyle',
    precioEntrada: '$600 MXN',
    eventosTematicos: 'Noche lifestyle viernes',
    politicaParejasSingles: 'Parejas y singles con reservación',
    dressCode: 'Elegante casual',
    areasVenue: ['Salón principal', 'Bar premium', 'Lockers'],
    reglasAcceso: ['Solo mayores de edad', 'Moderación en puerta'],
    direccion: 'Valle Oriente, Monterrey',
    horarioDetalle: 'Jue–Dom 9:00 PM – 3:00 AM',
    metodosPago: ['Efectivo', 'Tarjeta'],
    reservaciones: 'Sí',
    rfc: 'CLB123456ABC',
    razonSocial: 'Club Eros SA de CV',
    tagline: 'Ambiente lifestyle',
    documentos: 'Licencia + RFC',
    telefonoContacto: '8180000000',
    licenciaOperacion: 'LIC-2026-CLB',
    notasInternas: 'QA persist club_sw',
    sobreMi: 'Club lifestyle verificado.',
  };
}

const vmCtx = loadAll();
const PB = vmCtx.CariHubRegistroPublicBlocks;
const subId = 'club_sw';
const ctx = venueCtx(subId);
const vals = PB.finalizeVenueValues(Object.assign({}, payload()), ctx);

ok('venuePerfil nested', vals.venuePerfil && vals.venuePerfil.tipoVenue, vals.venuePerfil && vals.venuePerfil.tipoVenue);
ok('venuePerfil eventosTematicos', vals.venuePerfil && vals.venuePerfil.eventosTematicos, 'eventos');
ok('venuePerfil politicaParejasSingles', vals.venuePerfil && vals.venuePerfil.politicaParejasSingles, 'politica');
ok('sin retailPerfil', !vals.retailPerfil, 'clean');
ok('sin hospedajePerfil', !vals.hospedajePerfil, 'clean');
ok('sin swingerPerfil', !vals.swingerPerfil, 'clean');
ok('sin parejaGrupoPerfil', !vals.parejaGrupoPerfil, 'clean');
ok('sin cuckoldHotwifePerfil', !vals.cuckoldHotwifePerfil, 'clean');
ok('sin unicornPerfil', !vals.unicornPerfil, 'clean');
ok('sin modalidades escort', !vals.modalidades, 'clean');
ok('sin edad', !vals.edad, 'clean');
ok('sin viaja', !vals.viaja, 'clean');

const u = PB.mapVenueToPerfil({ subcategoriaId: subId, nombre: 'QA Club SW' }, vals, ctx);
ok('map nombreComercial', u.nombre === payload().nombreComercial, u.nombre);
ok('map precioEntrada', u.precio === u.precioEntrada, u.precio);
ok('arquetipo negocio_venue', u.arquetipo === 'negocio_venue', u.arquetipo);
ok('tipoPerfil lugar', u.tipoPerfil === 'lugar', u.tipoPerfil);
ok('subcategoriaId canon club_sw', u.subcategoriaId === 'club_sw', u.subcategoriaId);
ok('badgeSwinger true', u.badgeSwinger === true, String(u.badgeSwinger));
ok('sin badgeLgbt', !u.badgeLgbt, 'no lgbt');
ok('nested preserved eventosTematicos', u.venuePerfil && u.venuePerfil.eventosTematicos, 'nested');
ok('top-level eventosTematicos', u.eventosTematicos, u.eventosTematicos);
ok('top-level politicaParejasSingles', u.politicaParejasSingles, u.politicaParejasSingles);

const aliasCtx = venueCtx('club sw');
const aliasVals = PB.finalizeVenueValues(Object.assign({}, payload()), aliasCtx);
const aliasU = PB.mapVenueToPerfil({ subcategoriaId: 'club sw' }, aliasVals, aliasCtx);
ok('alias persist as club_sw', aliasU.subcategoriaId === 'club_sw', aliasU.subcategoriaId);

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

ok('swinger persona not venue', !PB.isVenueSubcategoria({ subcategoriaId: 'swinger' }), 'swinger');
ok('pareja_grupo not venue', !PB.isVenueSubcategoria({ subcategoriaId: 'club_sw', tipoPerfil: 'pareja_grupo' }), 'pareja_grupo');

console.log('\n=== QA Neg venue club_sw persist ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
