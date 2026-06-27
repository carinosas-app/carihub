/**
 * QA — Render negocio_retail tarjeta/ficha + DEMO (1/1 sex_shop).
 * node scripts/qa-neg-retail-render.mjs
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
  const ctx = { console, document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] } };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  return ctx;
}

function extractDemoObject(html, demoKey) {
  const re = new RegExp(`DEMO\\.${demoKey}=\\{([\\s\\S]*?)\\n\\};`);
  const m = html.match(re);
  return m ? m[0] : '';
}

function loadRender() {
  const ctx = makeCtx();
  loadScript('data/registro-schema-index.js', ctx);
  loadScript('data/registro-adultos-retail-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  loadScript('resultados-demo.js', ctx);
  loadScript('carihub-field-engine-lite.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  return ctx;
}

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
const vmCtx = loadRender();
const PR = vmCtx.CariHubPublicRenderLite;
const PB = vmCtx.CariHubRegistroPublicBlocks;
const FE = vmCtx.CariHubFieldEngineLite;

ok('render isRetailPerfil export', typeof PR.isRetailPerfil === 'function', 'fn');
ok('render cardHTMLRetail export', typeof PR.cardHTMLRetail === 'function', 'fn');
ok('preview sexShop ficha', perfilHtml.includes('function sexShopFichaFilas'), 'ficha');
ok('preview alias sex_shop sexShop', perfilHtml.includes('sex_shop:"sexShop"') && perfilHtml.includes('"sex shop":"sexShop"'), 'alias');

const demoBlock = extractDemoObject(perfilHtml, 'sexShop');
ok('DEMO.sexShop negocio_retail', demoBlock.includes('negocio_retail'), 'arquetipo');
ok('DEMO.sexShop subcategoriaId sex_shop', demoBlock.includes('subcategoriaId:"sex_shop"'), 'sex_shop id');
ok('DEMO.sexShop nombreComercial', demoBlock.includes('nombreComercial:'), 'nombreComercial');
ok('DEMO.sexShop categoriasProducto', demoBlock.includes('categoriasProducto:'), 'categoriasProducto');
ok('DEMO.sexShop sin arquetipo retail legacy', !demoBlock.includes('arquetipo:"retail"'), 'no legacy retail');

const vals = PB.finalizeRetailValues({
  nombreComercial: 'QA Sex Shop',
  categoriasProducto: ['Lencería', 'Juguetes'],
  precioDesde: '$199 MXN',
  direccion: 'Centro, Monterrey',
  envioDomicilio: 'Sí',
  tiendaOnline: 'Sí',
  serviciosIncluidos: ['Venta en tienda física'],
  serviciosNoRealizo: ['Venta a menores'],
  horarioDetalle: 'Lun–Sáb 10:00 AM – 8:00 PM',
  metodosPago: ['Efectivo'],
  rfc: 'PBM123456ABC',
  razonSocial: 'QA SA de CV',
  tagline: 'Tienda QA',
  zona: 'Centro',
  ciudad: 'Monterrey',
}, { subcategoriaId: 'sex_shop', arquetipo: 'negocio_retail' });

const u = PB.mapRetailToPerfil({ subcategoriaId: 'sex_shop', categoria: 'Sex Shop' }, vals, { subcategoriaId: 'sex_shop' });
const card = PR.cardHTMLRetail(u, { categoria: 'Sex Shop' });
ok('sex_shop tarjeta res-card--sexshop', card.includes('res-card--sexshop'), card.slice(0, 80));
ok('sex_shop isRetailPerfil', PR.isRetailPerfil(u), 'sex_shop');
ok('sex_shop isSexShopPerfil', PR.isSexShopPerfil(u), 'sex_shop');
ok('sex_shop cardHTML routes retail', PR.cardHTML(u, { categoria: 'Sex Shop' }).includes('res-card--retail'), 'route');

const pres = FE.resolvePublicPresentation({ subcategoriaId: 'sex_shop', categoria: 'Sex Shop' });
ok('field-engine vista sexShop', pres.vistaPerfil === 'sexShop', pres.vistaPerfil);
ok('field-engine ResultCardNegocio', pres.componenteResultados === 'ResultCardNegocio', pres.componenteResultados);

console.log('\n=== QA Neg retail render ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
