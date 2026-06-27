/**
 * QA — Render negocio_venue tarjeta + preview (cine_xxx).
 * node scripts/qa-neg-venue-cine-xxx-render.mjs
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
    nombreComercial: 'Cine Privé MTY',
    tipoVenue: 'Cine para adultos',
    precioEntrada: '$150 MXN',
    cartelera: 'Estrenos semanales · Maratón viernes',
    horariosFunciones: 'Lun–Vie 12:00–10:00 PM · Sáb–Dom 11:00 AM–12:00 AM',
    clasificacion: 'Solo mayores de 18 años',
    areasVenue: ['Sala principal', 'Cabinas privadas'],
    reglasAcceso: ['Solo mayores de edad'],
    direccion: 'Centro, Monterrey',
    horarioDetalle: 'Lun–Dom 12:00 PM – 12:00 AM',
    metodosPago: ['Efectivo'],
    rfc: 'CIN123456ABC',
    razonSocial: 'Cine Privé SA de CV',
    tagline: 'Cartelera actualizada',
    zona: 'Centro',
    ciudad: 'Monterrey',
  }, { subcategoriaId: subId, arquetipo: 'negocio_venue', tipoPerfil: 'lugar' });
  return PB.mapVenueToPerfil({ subcategoriaId: subId, categoria: 'Cine XXX' }, vals, { subcategoriaId: subId, tipoPerfil: 'lugar' });
}

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
const vmCtx = loadRender();
const PR = vmCtx.CariHubPublicRenderLite;
const FE = vmCtx.CariHubFieldEngineLite;

ok('render isCineXxxPerfil export', typeof PR.isCineXxxPerfil === 'function', 'fn');
ok('render cardHTMLCineXxx export', typeof PR.cardHTMLCineXxx === 'function', 'fn');
ok('preview cineXxx ficha', perfilHtml.includes('function cineXxxFichaFilas'), 'ficha');
ok('preview alias cine_xxx', perfilHtml.includes('cine_xxx:"cineXxx"'), 'alias');
ok('preview alias cine xxx', perfilHtml.includes('"cine xxx":"cineXxx"'), 'alias space');
ok('preview alias cine adulto', perfilHtml.includes('"cine adulto":"cineXxx"'), 'alias adulto');

const demoCine = extractDemoObject(perfilHtml, 'cineXxx');
ok('DEMO.cineXxx negocio_venue', demoCine.includes('negocio_venue'), 'arquetipo');
ok('DEMO.cineXxx tipoPerfil lugar', demoCine.includes('tipoPerfil:"lugar"'), 'lugar');
ok('DEMO.cineXxx sub cine_xxx', demoCine.includes('subcategoriaId:"cine_xxx"'), 'sub');
ok('DEMO.cineXxx cartelera', demoCine.includes('cartelera:'), 'cartelera');
ok('DEMO.cineXxx horariosFunciones', demoCine.includes('horariosFunciones:'), 'horariosFunciones');
ok('DEMO.cineXxx clasificacion', demoCine.includes('clasificacion:'), 'clasificacion');
ok('DEMO.cineXxx no legacy arquetipo venue', !demoCine.includes('arquetipo:"venue"'), 'no legacy');

ok('aplicarPerfilDesdeRegistro horariosFunciones', perfilHtml.includes('horariosFunciones:'), 'preview');
ok('aplicarPerfilDesdeRegistro clasificacion', perfilHtml.includes('clasificacion:'), 'preview');

const u = buildPerfil('cine_xxx');
const card = PR.cardHTMLCineXxx(u, { categoria: 'Cine XXX' });
ok('cine_xxx tarjeta res-card--cine-xxx', card.includes('res-card--cine-xxx'), card.slice(0, 80));
ok('cine_xxx isCineXxxPerfil', PR.isCineXxxPerfil(u), 'detect');
ok('cine_xxx isVenuePerfil', PR.isVenuePerfil(u), 'venue family');
ok('cine_xxx cardHTML routes cineXxx', PR.cardHTML(u, { categoria: 'Cine XXX' }).includes('res-card--cine-xxx'), 'route');

const pres = FE.resolvePublicPresentation({ subcategoriaId: 'cine_xxx', categoria: 'Cine XXX' });
ok('field-engine vista cineXxx', pres.vistaPerfil === 'cineXxx', pres.vistaPerfil);

const presAlias = FE.resolvePublicPresentation({ subcategoriaId: 'cine adulto', categoria: 'Cine XXX' });
ok('field-engine alias cine adulto', presAlias.vistaPerfil === 'cineXxx', presAlias.vistaPerfil);

console.log('\n=== QA Neg venue cine_xxx render ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
