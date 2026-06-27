/**
 * QA — Persistencia negocio_bienestar / bienestarPerfil.
 * node scripts/qa-neg-bienestar-persist.mjs
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
  loadScript('carihub-registro-public-blocks.js', ctx);
  return ctx;
}

function bienestarCtx(subId) {
  return { subcategoriaId: subId, arquetipo: 'negocio_bienestar', tipoPerfil: 'negocio', formularioId: 'adultos' };
}

function payload(subId) {
  const base = {
    nombreComercial: subId === 'spa' ? 'Serenity Spa MTY' : 'Zen Touch Masajes MTY',
    tipoBienestar: subId === 'spa' ? 'Spa / centro de bienestar' : 'Centro de masajes',
    menuServicios: 'Relajante · Deportivo · Pareja',
    precioDesde: subId === 'spa' ? '$890 MXN' : '$650 MXN',
    direccion: 'Valle Oriente, Monterrey',
    horarioDetalle: 'Lun–Dom 10:00 AM – 10:00 PM',
    metodosPago: ['Efectivo', 'Tarjeta'],
    reservaciones: 'Sí',
    rfc: 'BIE123456ABC',
    razonSocial: 'Bienestar SA de CV',
    tagline: 'Local verificado',
    serviciosNoRealizo: ['Menores de edad', 'Conducta inapropiada'],
    telefonoContacto: '8180000000',
    licenciaOperacion: 'LIC-2026-001',
    documentos: 'RFC + licencia',
    notasInternas: 'QA persist',
    sobreMi: 'Local de bienestar verificado.',
  };
  if (subId === 'spa') {
    base.amenidades = ['Jacuzzi', 'Sauna', 'Cabinas privadas'];
    base.serviciosIncluidos = ['Masaje relajante', 'Circuito hidroterapia'];
  } else {
    base.amenidades = ['Cabinas privadas', 'Aromaterapia'];
    base.serviciosIncluidos = ['Masaje relajante 60 min', 'Masaje en pareja 90 min'];
  }
  return base;
}

const vmCtx = loadAll();
const PB = vmCtx.CariHubRegistroPublicBlocks;

function testSub(subId) {
  const ctx = bienestarCtx(subId);
  const vals = PB.finalizeBienestarValues(Object.assign({}, payload(subId)), ctx);
  ok(`${subId} bienestarPerfil nested`, vals.bienestarPerfil && vals.bienestarPerfil.tipoBienestar, vals.bienestarPerfil && vals.bienestarPerfil.tipoBienestar);
  ok(`${subId} sin retailPerfil`, !vals.retailPerfil, 'clean');
  ok(`${subId} sin venuePerfil`, !vals.venuePerfil, 'clean');
  ok(`${subId} sin creadorPerfil`, !vals.creadorPerfil, 'clean');
  ok(`${subId} sin modalidades escort`, !vals.modalidades, 'clean');
  ok(`${subId} sin edad`, !vals.edad, 'clean');

  const u = PB.mapBienestarToPerfil({ subcategoriaId: subId, nombre: 'QA Bienestar' }, vals, ctx);
  ok(`${subId} map nombreComercial`, u.nombre === payload(subId).nombreComercial, u.nombre);
  ok(`${subId} map precioDesde`, u.precio === u.precioDesde, u.precio);
  ok(`${subId} arquetipo negocio_bienestar`, u.arquetipo === 'negocio_bienestar', u.arquetipo);
  ok(`${subId} tipoPerfil negocio`, u.tipoPerfil === 'negocio', u.tipoPerfil);
  ok(`${subId} nested preserved`, u.bienestarPerfil && u.bienestarPerfil.menuServicios, 'nested');
  ok(`${subId} subcategoriaId canon`, u.subcategoriaId === subId, u.subcategoriaId);
  ok(`${subId} menuServicios top`, !!u.menuServicios, u.menuServicios);
}

testSub('spa');
testSub('masajes');

const routeEarly = PB.mapToPerfil(
  { subcategoriaId: 'masajes' },
  Object.assign({}, payload('masajes'), { retailPerfil: { categoriasProducto: ['x'] }, venuePerfil: { tipoVenue: 'x' }, modalidades: ['recibe'], edad: 25 }),
  bienestarCtx('masajes')
);
ok('mapToPerfil route bienestar early', routeEarly.arquetipo === 'negocio_bienestar' && !routeEarly.retailPerfil && !routeEarly.venuePerfil && !routeEarly.modalidades && !routeEarly.edad, 'anti contamination');

ok('hotel not bienestar pipeline', !PB.isBienestarSubcategoria({ subcategoriaId: 'hotel' }), 'hotel');
ok('retail not bienestar pipeline', !PB.isBienestarSubcategoria({ subcategoriaId: 'sex_shop' }), 'sex_shop');
ok('persona masajes not bienestar', !PB.isBienestarSubcategoria({ subcategoriaId: 'masajes', tipoPerfil: 'persona' }), 'persona');

console.log('\n=== QA Neg bienestar persist ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
