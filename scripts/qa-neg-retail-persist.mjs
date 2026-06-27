/**
 * QA — Persistencia negocio_retail / retailPerfil.
 * node scripts/qa-neg-retail-persist.mjs
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
  loadScript('carihub-registro-public-blocks.js', ctx);
  return ctx;
}

function retailCtx(subId) {
  return { subcategoriaId: subId, arquetipo: 'negocio_retail', formularioId: 'adultos' };
}

function payload() {
  return {
    nombreComercial: 'Pleasure Boutique MTY',
    categoriasProducto: ['Lencería', 'Juguetes'],
    precioDesde: '$199 MXN',
    direccion: 'Centro, Monterrey',
    envioDomicilio: 'Sí',
    tiendaOnline: 'Sí',
    serviciosIncluidos: ['Venta en tienda física', 'Envío a domicilio'],
    serviciosNoRealizo: ['Venta a menores'],
    horarioDetalle: 'Lun–Sáb 10:00 AM – 8:00 PM',
    metodosPago: ['Efectivo', 'Tarjeta'],
    rfc: 'PBM123456ABC',
    razonSocial: 'Pleasure Boutique SA de CV',
    sobreMi: 'Tienda física y en línea con catálogo curado.',
  };
}

const vmCtx = loadAll();
const PB = vmCtx.CariHubRegistroPublicBlocks;
const ctx = retailCtx('sex_shop');

const vals = PB.finalizeRetailValues(Object.assign({}, payload()), ctx);
ok('retailPerfil nested', vals.retailPerfil && Array.isArray(vals.retailPerfil.categoriasProducto), JSON.stringify(vals.retailPerfil && vals.retailPerfil.categoriasProducto));
ok('sin creadorPerfil', !vals.creadorPerfil, 'clean');
ok('sin espectaculoPerfil', !vals.espectaculoPerfil, 'clean');
ok('sin dominatrixPerfil', !vals.dominatrixPerfil, 'clean');
ok('sin modalidades escort', !vals.modalidades, 'clean');

const u = PB.mapRetailToPerfil({ subcategoriaId: 'sex_shop', nombre: 'QA Retail' }, vals, ctx);
ok('map nombreComercial mirror', u.nombre === 'Pleasure Boutique MTY', u.nombre);
ok('map categoriasProducto mirror', String(u.categoriasProducto).includes('Lencería'), u.categoriasProducto);
ok('map precio mirrors', u.precio === u.precioDesde, u.precio);
ok('map envioDomicilio bool', u.envioDomicilio === true, String(u.envioDomicilio));
ok('map tiendaOnline bool', u.tiendaOnline === true, String(u.tiendaOnline));
ok('arquetipo negocio_retail', u.arquetipo === 'negocio_retail', u.arquetipo);
ok('tipoPerfil negocio', u.tipoPerfil === 'negocio', u.tipoPerfil);
ok('nested preserved', u.retailPerfil && u.retailPerfil.horarioDetalle === 'Lun–Sáb 10:00 AM – 8:00 PM', 'nested');
ok('subcategoriaId canon sex_shop', u.subcategoriaId === 'sex_shop', u.subcategoriaId);
ok('sin modalidades', !u.modalidades, 'no modalidades');

const aliasCtx = retailCtx('sex shop');
const aliasVals = PB.finalizeRetailValues(Object.assign({}, payload()), aliasCtx);
const aliasU = PB.mapRetailToPerfil({ subcategoriaId: 'sex shop' }, aliasVals, aliasCtx);
ok('sex shop persist as sex_shop', aliasU.subcategoriaId === 'sex_shop', aliasU.subcategoriaId);

const routeEarly = PB.mapToPerfil(
  { subcategoriaId: 'sex_shop' },
  Object.assign({}, payload(), { creadorPerfil: { tiposContenido: ['x'] }, modalidades: ['recibe'] }),
  retailCtx('sex_shop')
);
ok('mapToPerfil route retail early', routeEarly.arquetipo === 'negocio_retail' && !routeEarly.creadorPerfil && !routeEarly.modalidades, 'anti contamination');

ok('escort not retail pipeline', !PB.isRetailSubcategoria({ subcategoriaId: 'escort' }), 'escort');

console.log('\n=== QA Neg retail persist ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
