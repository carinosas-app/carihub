/**
 * QA — Render negocio_hospedaje tarjeta + preview (hotel_motel).
 * node scripts/qa-neg-hospedaje-render.mjs
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
  loadScript('data/registro-adultos-venue-blocks.js', ctx);
  loadScript('data/registro-adultos-bienestar-blocks.js', ctx);
  loadScript('data/registro-adultos-hospedaje-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  loadScript('resultados-demo.js', ctx);
  loadScript('carihub-field-engine-lite.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  return ctx;
}

function buildPerfil() {
  const PB = vmCtx.CariHubRegistroPublicBlocks;
  const vals = PB.finalizeHospedajeValues({
    nombreComercial: 'Motel Cariñoso GDL',
    tipoHospedaje: 'Motel',
    tiposHabitacion: ['Estándar', 'Suite jacuzzi'],
    tarifaHora: '$450 MXN / hora',
    tarifaNoche: '$1,200 MXN / noche',
    amenidades: ['Jacuzzi en habitación', 'WiFi'],
    reglasEstancia: ['Solo mayores de edad'],
    direccion: 'Providencia, Guadalajara',
    horarioDetalle: 'Abierto 24 horas',
    metodosPago: ['Efectivo'],
    reservaciones: 'Sí',
    rfc: 'HOS123456ABC',
    razonSocial: 'Hospedaje SA de CV',
    tagline: 'Local verificado',
    zona: 'Providencia',
    ciudad: 'Guadalajara',
  }, { subcategoriaId: 'hotel_motel', arquetipo: 'negocio_hospedaje', tipoPerfil: 'lugar' });
  return PB.mapHospedajeToPerfil({ subcategoriaId: 'hotel_motel', categoria: 'Hotel / Motel' }, vals, { subcategoriaId: 'hotel_motel', tipoPerfil: 'lugar' });
}

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
const vmCtx = loadRender();
const PR = vmCtx.CariHubPublicRenderLite;
const FE = vmCtx.CariHubFieldEngineLite;

ok('render isHospedajePerfil export', typeof PR.isHospedajePerfil === 'function', 'fn');
ok('render cardHTMLHospedaje export', typeof PR.cardHTMLHospedaje === 'function', 'fn');
ok('preview alias hotel_motel', perfilHtml.includes('hotel_motel:"hotelMotel"') || perfilHtml.includes('hotel motel":"hotelMotel"'), 'alias');
ok('preview alias hotel', perfilHtml.includes('hotel:"hotelMotel"'), 'alias hotel');

const demoHotel = extractDemoObject(perfilHtml, 'hotelMotel');
ok('DEMO.hotelMotel negocio_hospedaje', demoHotel.includes('negocio_hospedaje'), 'arquetipo');
ok('DEMO.hotelMotel tipoPerfil lugar', demoHotel.includes('tipoPerfil:"lugar"'), 'lugar');
ok('DEMO.hotelMotel sub hotel_motel', demoHotel.includes('subcategoriaId:"hotel_motel"'), 'sub');
ok('DEMO.hotelMotel tarifaHora', demoHotel.includes('tarifaHora:'), 'tarifaHora');
ok('DEMO.hotelMotel no legacy arquetipo hospedaje', !demoHotel.includes('arquetipo:"hospedaje"'), 'no legacy');

ok('aplicarPerfilDesdeRegistro hospedajePerfil', perfilHtml.includes('hospedajePerfil:'), 'preview');

const u = buildPerfil();
const card = PR.cardHTMLHospedaje(u, { categoria: 'Hotel / Motel' });
ok('hotel_motel tarjeta res-card--hospedaje', card.includes('res-card--hospedaje'), card.slice(0, 80));
ok('hotel_motel isHospedajePerfil', PR.isHospedajePerfil(u), 'detect');
ok('hotel_motel isHotelMotelPerfil', PR.isHotelMotelPerfil(u), 'sub');
ok('hotel_motel cardHTML routes hospedaje', PR.cardHTML(u, { categoria: 'Hotel / Motel' }).includes('res-card--hospedaje'), 'route');

const pres = FE.resolvePublicPresentation({ subcategoriaId: 'hotel_motel', categoria: 'Hotel / Motel' });
ok('field-engine vista hotelMotel', pres.vistaPerfil === 'hotelMotel', pres.vistaPerfil);

const presAlias = FE.resolvePublicPresentation({ subcategoriaId: 'hotel motel', categoria: 'Hotel / Motel' });
ok('field-engine alias hotel motel', presAlias.vistaPerfil === 'hotelMotel', presAlias.vistaPerfil);

console.log('\n=== QA Neg hospedaje render ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
