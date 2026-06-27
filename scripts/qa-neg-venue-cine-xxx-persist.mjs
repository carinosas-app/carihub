/**
 * QA — Persistencia negocio_venue / venuePerfil (cine_xxx).
 * node scripts/qa-neg-venue-cine-xxx-persist.mjs
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
    nombreComercial: 'Cine Privé MTY',
    tipoVenue: 'Cine para adultos',
    precioEntrada: '$150 MXN',
    cartelera: 'Estrenos semanales · Maratón viernes',
    horariosFunciones: 'Lun–Vie 12:00–10:00 PM · Sáb–Dom 11:00 AM–12:00 AM',
    clasificacion: 'Solo mayores de 18 años',
    areasVenue: ['Sala principal', 'Cabinas privadas', 'Lobby discreto'],
    reglasAcceso: ['Solo mayores de edad', 'Identificación obligatoria'],
    direccion: 'Centro, Monterrey',
    horarioDetalle: 'Lun–Dom 12:00 PM – 12:00 AM',
    metodosPago: ['Efectivo', 'Tarjeta'],
    rfc: 'CIN123456ABC',
    razonSocial: 'Cine Privé SA de CV',
    tagline: 'Cartelera actualizada',
    telefonoContacto: '8180000000',
    licenciaOperacion: 'LIC-2026-CIN',
    notasInternas: 'QA persist cine_xxx',
    sobreMi: 'Cine verificado.',
  };
}

const vmCtx = loadAll();
const PB = vmCtx.CariHubRegistroPublicBlocks;
const subId = 'cine_xxx';
const ctx = venueCtx(subId);
const vals = PB.finalizeVenueValues(Object.assign({}, payload()), ctx);

ok('venuePerfil nested', vals.venuePerfil && vals.venuePerfil.tipoVenue, vals.venuePerfil && vals.venuePerfil.tipoVenue);
ok('venuePerfil cartelera', vals.venuePerfil && vals.venuePerfil.cartelera, 'cartelera');
ok('venuePerfil horariosFunciones', vals.venuePerfil && vals.venuePerfil.horariosFunciones, 'horariosFunciones');
ok('venuePerfil clasificacion', vals.venuePerfil && vals.venuePerfil.clasificacion, 'clasificacion');
ok('sin retailPerfil', !vals.retailPerfil, 'clean');
ok('sin swingerPerfil', !vals.swingerPerfil, 'clean');
ok('sin parejaGrupoPerfil', !vals.parejaGrupoPerfil, 'clean');
ok('sin modalidades escort', !vals.modalidades, 'clean');
ok('sin edad', !vals.edad, 'clean');
ok('sin viaja', !vals.viaja, 'clean');

const u = PB.mapVenueToPerfil({ subcategoriaId: subId, nombre: 'QA Cine XXX' }, vals, ctx);
ok('map nombreComercial', u.nombre === payload().nombreComercial, u.nombre);
ok('arquetipo negocio_venue', u.arquetipo === 'negocio_venue', u.arquetipo);
ok('tipoPerfil lugar', u.tipoPerfil === 'lugar', u.tipoPerfil);
ok('subcategoriaId canon cine_xxx', u.subcategoriaId === 'cine_xxx', u.subcategoriaId);
ok('sin badgeSwinger', !u.badgeSwinger, 'no swinger badge');
ok('sin badgeLgbt', !u.badgeLgbt, 'no lgbt badge');
ok('top-level cartelera', u.cartelera, u.cartelera);
ok('top-level horariosFunciones', u.horariosFunciones, u.horariosFunciones);
ok('top-level clasificacion', u.clasificacion, u.clasificacion);

const aliasCtx = venueCtx('cine xxx');
const aliasVals = PB.finalizeVenueValues(Object.assign({}, payload()), aliasCtx);
const aliasU = PB.mapVenueToPerfil({ subcategoriaId: 'cine xxx' }, aliasVals, aliasCtx);
ok('alias persist as cine_xxx', aliasU.subcategoriaId === 'cine_xxx', aliasU.subcategoriaId);

console.log('\n=== QA Neg venue cine_xxx persist ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
