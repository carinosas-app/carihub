/**
 * QA — Render negocio_venue tarjeta + preview (cabinas).
 * node scripts/qa-neg-venue-cabinas-render.mjs
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
    nombreComercial: 'Cabinas Discretas MTY',
    tipoVenue: 'Cabinas privadas / Glory holes',
    precioEntrada: '$400 MXN / 30 min',
    nivelPrivacidad: 'Alta — acceso individual y discreto',
    areasVenue: ['Cabinas privadas', 'Glory holes', 'Regaderas'],
    reglasAcceso: ['Solo mayores de edad'],
    direccion: 'Valle Oriente, Monterrey',
    horarioDetalle: 'Abierto 24 horas',
    metodosPago: ['Efectivo'],
    reservaciones: 'Sí',
    rfc: 'CAB123456ABC',
    razonSocial: 'Cabinas Discretas SA de CV',
    tagline: 'Privacidad y limpieza',
    zona: 'Valle Oriente',
    ciudad: 'Monterrey',
  }, { subcategoriaId: subId, arquetipo: 'negocio_venue', tipoPerfil: 'lugar' });
  return PB.mapVenueToPerfil({ subcategoriaId: subId, categoria: 'Cabinas' }, vals, { subcategoriaId: subId, tipoPerfil: 'lugar' });
}

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
const vmCtx = loadRender();
const PR = vmCtx.CariHubPublicRenderLite;
const FE = vmCtx.CariHubFieldEngineLite;

ok('render isCabinasPerfil export', typeof PR.isCabinasPerfil === 'function', 'fn');
ok('render cardHTMLCabinas export', typeof PR.cardHTMLCabinas === 'function', 'fn');
ok('preview cabinas ficha', perfilHtml.includes('function cabinasFichaFilas'), 'ficha');
ok('preview alias cabinas', perfilHtml.includes('cabinas:"cabinas"'), 'alias');
ok('preview alias cabinas glory holes', perfilHtml.includes('"cabinas glory holes":"cabinas"'), 'alias glory');

const demoCab = extractDemoObject(perfilHtml, 'cabinas');
ok('DEMO.cabinas negocio_venue', demoCab.includes('negocio_venue'), 'arquetipo');
ok('DEMO.cabinas tipoPerfil lugar', demoCab.includes('tipoPerfil:"lugar"'), 'lugar');
ok('DEMO.cabinas sub cabinas', demoCab.includes('subcategoriaId:"cabinas"'), 'sub');
ok('DEMO.cabinas nivelPrivacidad', demoCab.includes('nivelPrivacidad:'), 'nivelPrivacidad');
ok('DEMO.cabinas no legacy arquetipo venue', !demoCab.includes('arquetipo:"venue"'), 'no legacy');
ok('DEMO.cabinas no badgeSwinger', !demoCab.includes('badgeSwinger:true'), 'no swinger badge');

ok('aplicarPerfilDesdeRegistro nivelPrivacidad', perfilHtml.includes('nivelPrivacidad:'), 'preview');

const u = buildPerfil('cabinas');
const card = PR.cardHTMLCabinas(u, { categoria: 'Cabinas' });
ok('cabinas tarjeta res-card--cabinas', card.includes('res-card--cabinas'), card.slice(0, 80));
ok('cabinas isCabinasPerfil', PR.isCabinasPerfil(u), 'detect');
ok('cabinas isVenuePerfil', PR.isVenuePerfil(u), 'venue family');
ok('cabinas cardHTML routes cabinas', PR.cardHTML(u, { categoria: 'Cabinas' }).includes('res-card--cabinas'), 'route');
ok('cabinas card no swinger badge', !PR.cardHTML(u, { categoria: 'Cabinas' }).includes('res-badge--swinger'), 'no swinger');

const pres = FE.resolvePublicPresentation({ subcategoriaId: 'cabinas', categoria: 'Cabinas' });
ok('field-engine vista cabinas', pres.vistaPerfil === 'cabinas', pres.vistaPerfil);

const presAlias = FE.resolvePublicPresentation({ subcategoriaId: 'cabinas glory holes', categoria: 'Cabinas' });
ok('field-engine alias cabinas glory holes', presAlias.vistaPerfil === 'cabinas', presAlias.vistaPerfil);

console.log('\n=== QA Neg venue cabinas render ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
