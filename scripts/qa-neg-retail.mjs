/**
 * QA — Pack negocio_retail motor/blocks (sex_shop).
 * node scripts/qa-neg-retail.mjs
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
  loadScript('data/registro-adultos-escort-blocks.js', ctx);
  loadScript('data/registro-adultos-creador-blocks.js', ctx);
  loadScript('data/registro-adultos-retail-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  return ctx;
}

function retailCtx(subId) {
  return { subcategoriaId: subId, subcategoria: subId, arquetipo: 'negocio_retail', tipoPerfil: 'negocio', formularioId: 'adultos' };
}

function mergedRetail(vmCtx, subId) {
  const cfg = vmCtx.CariHubRegistroPublicBlocks.resolveConfig(retailCtx(subId), null);
  return vmCtx.CariHubRegistroPublicBlocks.mergedConfig(cfg, retailCtx(subId));
}

function hasField(merged, fieldId) {
  return merged.blocks.some((b) => b.fields.some((f) => f.id === fieldId));
}

function baseValid() {
  return {
    nombreComercial: 'Pleasure Boutique MTY',
    categoriasProducto: ['Lencería', 'Juguetes', 'Lubricantes'],
    precioDesde: '$199 MXN',
    direccion: 'Centro, Monterrey, N.L.',
    envioDomicilio: 'Sí',
    tiendaOnline: 'Sí',
    serviciosIncluidos: ['Venta en tienda física', 'Envío a domicilio'],
    serviciosNoRealizo: ['Venta a menores', 'Productos no certificados'],
    horarioDetalle: 'Lun–Sáb 10:00 AM – 8:00 PM',
    metodosPago: ['Efectivo', 'Tarjeta'],
    rfc: 'PBM123456ABC',
    razonSocial: 'Pleasure Boutique SA de CV',
  };
}

const vmCtx = loadAll();
const PB = vmCtx.CariHubRegistroPublicBlocks;
const viajes = vmCtx.CariHubViajesDesplazamiento;

ok('blocks file loaded', !!vmCtx.CARIHUB_REGISTRO_RETAIL_BLOCKS, 'negocio_retail');
ok('blocks id negocio_retail', vmCtx.CARIHUB_REGISTRO_RETAIL_BLOCKS.id === 'negocio_retail', 'id');
ok('blocks sub sex_shop', vmCtx.CARIHUB_REGISTRO_RETAIL_BLOCKS.subcategoriaIds.includes('sex_shop'), 'sex_shop');

const cfg = PB.resolveConfig(retailCtx('sex_shop'), null);
ok('sex_shop resolveConfig', cfg && cfg.id === 'negocio_retail', cfg && cfg.id);
ok('sex_shop matchesRetail', PB.matchesRetail(retailCtx('sex_shop'), null), 'sex_shop');
ok('sex_shop not matchesEscort', !PB.matchesEscort(retailCtx('sex_shop'), null), 'escort');
ok('sex_shop not matchesCreador', !PB.matchesCreador(retailCtx('sex_shop'), null), 'creador');
ok('sex_shop not matchesEspectaculo', !PB.matchesEspectaculo(retailCtx('sex_shop'), null), 'espectaculo');
ok('sex_shop not matchesDominatrix', !PB.matchesDominatrix(retailCtx('sex_shop'), null), 'dominatrix');

const merged = mergedRetail(vmCtx, 'sex_shop');
ok('merged blocks', merged.blocks.length >= 4, String(merged.blocks.length));
ok('nombreComercial field', hasField(merged, 'nombreComercial'), 'nombreComercial');
ok('categoriasProducto field', hasField(merged, 'categoriasProducto'), 'categoriasProducto');
ok('no modalidades escort', !hasField(merged, 'modalidades'), 'no modalidades');
ok('no realizaTrios escort', !hasField(merged, 'realizaTrios'), 'no escort');
ok('viajes inactivo sex_shop', !viajes.subcategoriaActivaViajes('sex_shop'), 'no viajes v1');

ok('sex shop alias resolves', PB.matchesRetail(retailCtx('sex shop'), null), 'sex shop');
ok('sex shop canonical sex_shop', PB.normalizeRetailSubId('sex shop') === 'sex_shop', 'canonical');

const invalid = PB.validateValues(mergedRetail(vmCtx, 'sex_shop'), Object.assign({}, baseValid(), { categoriasProducto: [] }), retailCtx('sex_shop'));
ok('validate exige categoriasProducto', invalid.length > 0, String(invalid.length));

const valid = PB.validateValues(mergedRetail(vmCtx, 'sex_shop'), baseValid(), retailCtx('sex_shop'));
ok('validate ok payload', valid.length === 0, valid.join('; '));

const registroHtml = fs.readFileSync(path.join(repoRoot, 'public', 'registro-perfil.html'), 'utf8');
ok('registro-perfil script retail blocks', registroHtml.includes('registro-adultos-retail-blocks.js'), 'script tag');

console.log('\n=== QA Neg retail motor/blocks ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
