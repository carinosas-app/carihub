/**
 * QA — Render negocio_venue tarjeta + preview (2/2 antro + antro_lgbt).
 * node scripts/qa-neg-venue-render.mjs
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
  loadScript('carihub-registro-public-blocks.js', ctx);
  loadScript('resultados-demo.js', ctx);
  loadScript('carihub-field-engine-lite.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  return ctx;
}

function buildPerfil(subId) {
  const PB = vmCtx.CariHubRegistroPublicBlocks;
  const vals = PB.finalizeVenueValues({
    nombreComercial: subId === 'antro_lgbt' ? 'Rainbow Club MTY' : 'Nocturna MTY',
    tipoVenue: subId === 'antro_lgbt' ? 'Antro LGBT+' : 'Antro / Discoteca',
    precioEntrada: '$350 MXN',
    cartelera: 'DJ viernes',
    dressCode: 'Elegante casual',
    areasVenue: ['Pista principal', 'Mesas VIP'],
    reglasAcceso: ['Solo mayores de edad'],
    direccion: 'Centro, Monterrey',
    horarioDetalle: 'Vie–Dom 10:00 PM – 4:00 AM',
    metodosPago: ['Efectivo'],
    reservaciones: 'Sí',
    rfc: 'ANT123456ABC',
    razonSocial: 'Nocturna SA de CV',
    tagline: 'Vida nocturna',
    zona: 'Centro',
    ciudad: 'Monterrey',
  }, { subcategoriaId: subId, arquetipo: 'negocio_venue' });
  return PB.mapVenueToPerfil({ subcategoriaId: subId, categoria: subId === 'antro_lgbt' ? 'Antro LGBT+' : 'Antro' }, vals, { subcategoriaId: subId });
}

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
const vmCtx = loadRender();
const PR = vmCtx.CariHubPublicRenderLite;
const FE = vmCtx.CariHubFieldEngineLite;

ok('render isVenuePerfil export', typeof PR.isVenuePerfil === 'function', 'fn');
ok('render cardHTMLVenue export', typeof PR.cardHTMLVenue === 'function', 'fn');
ok('preview antro ficha', perfilHtml.includes('function antroFichaFilas'), 'ficha');
ok('preview antroLgbt ficha', perfilHtml.includes('function antroLgbtFichaFilas'), 'ficha lgbt');
ok('preview alias antro', perfilHtml.includes('antro:"antro"') && perfilHtml.includes('"antro restaurant bar":"antro"'), 'alias');
ok('preview alias antroLgbt', perfilHtml.includes('antro_lgbt:"antroLgbt"') && perfilHtml.includes('"antro restaurant bar lgbt":"antroLgbt"'), 'alias lgbt');

const demoAntro = extractDemoObject(perfilHtml, 'antro');
ok('DEMO.antro negocio_venue', demoAntro.includes('negocio_venue'), 'arquetipo');
ok('DEMO.antro tipoPerfil lugar', demoAntro.includes('tipoPerfil:"lugar"'), 'lugar');
ok('DEMO.antro sin arquetipo venue legacy', !demoAntro.includes('arquetipo:"venue"'), 'no legacy');
ok('DEMO.antro precioEntrada', demoAntro.includes('precioEntrada:'), 'precioEntrada');

const demoLgbt = extractDemoObject(perfilHtml, 'antroLgbt');
ok('DEMO.antroLgbt negocio_venue', demoLgbt.includes('negocio_venue'), 'arquetipo');
ok('DEMO.antroLgbt badgeLgbt', demoLgbt.includes('badgeLgbt:true'), 'badge');

const uAntro = buildPerfil('antro');
const cardAntro = PR.cardHTMLVenue(uAntro, { categoria: 'Antro' });
ok('antro tarjeta res-card--venue', cardAntro.includes('res-card--venue'), cardAntro.slice(0, 80));
ok('antro isVenuePerfil', PR.isVenuePerfil(uAntro), 'antro');
ok('antro sin badge LGBT tarjeta', !cardAntro.includes('res-badge--lgbt'), 'no lgbt badge');
ok('antro cardHTML routes venue', PR.cardHTML(uAntro, { categoria: 'Antro' }).includes('res-card--venue'), 'route');

const uLgbt = buildPerfil('antro_lgbt');
const cardLgbt = PR.cardHTMLVenue(uLgbt, { categoria: 'Antro LGBT+' });
ok('antro_lgbt tarjeta res-card--antro-lgbt', cardLgbt.includes('res-card--antro-lgbt'), cardLgbt.slice(0, 80));
ok('antro_lgbt isAntroLgbtPerfil', PR.isAntroLgbtPerfil(uLgbt), 'antro_lgbt');
ok('antro_lgbt badge LGBT tarjeta', cardLgbt.includes('res-badge--lgbt'), 'lgbt badge');

const presAntro = FE.resolvePublicPresentation({ subcategoriaId: 'antro', categoria: 'Antro / Restaurant Bar' });
ok('field-engine vista antro', presAntro.vistaPerfil === 'antro', presAntro.vistaPerfil);

const presLgbt = FE.resolvePublicPresentation({ subcategoriaId: 'antro_lgbt', categoria: 'Antro / Restaurant Bar LGBT' });
ok('field-engine vista antroLgbt', presLgbt.vistaPerfil === 'antroLgbt', presLgbt.vistaPerfil);

console.log('\n=== QA Neg venue render ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
