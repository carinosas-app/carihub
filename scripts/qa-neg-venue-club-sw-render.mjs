/**
 * QA — Render negocio_venue tarjeta + preview (club_sw).
 * node scripts/qa-neg-venue-club-sw-render.mjs
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
    nombreComercial: 'Club Eros Lifestyle',
    tipoVenue: 'Club Swinger / Lifestyle',
    precioEntrada: '$600 MXN',
    eventosTematicos: 'Noche lifestyle viernes',
    politicaParejasSingles: 'Parejas y singles con reservación',
    dressCode: 'Elegante casual',
    areasVenue: ['Salón principal', 'Bar premium', 'Lockers'],
    reglasAcceso: ['Solo mayores de edad'],
    direccion: 'Valle Oriente, Monterrey',
    horarioDetalle: 'Jue–Dom 9:00 PM – 3:00 AM',
    metodosPago: ['Efectivo'],
    reservaciones: 'Sí',
    rfc: 'CLB123456ABC',
    razonSocial: 'Club Eros SA de CV',
    tagline: 'Ambiente lifestyle',
    zona: 'Valle Oriente',
    ciudad: 'Monterrey',
  }, { subcategoriaId: subId, arquetipo: 'negocio_venue', tipoPerfil: 'lugar' });
  return PB.mapVenueToPerfil({ subcategoriaId: subId, categoria: 'Club Swinger' }, vals, { subcategoriaId: subId, tipoPerfil: 'lugar' });
}

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
const vmCtx = loadRender();
const PR = vmCtx.CariHubPublicRenderLite;
const FE = vmCtx.CariHubFieldEngineLite;

ok('render isClubSwPerfil export', typeof PR.isClubSwPerfil === 'function', 'fn');
ok('render cardHTMLClubSw export', typeof PR.cardHTMLClubSw === 'function', 'fn');
ok('preview clubSw ficha', perfilHtml.includes('function clubSwFichaFilas'), 'ficha');
ok('preview alias club_sw', perfilHtml.includes('club_sw:"clubSw"'), 'alias');
ok('preview alias club sw', perfilHtml.includes('"club sw":"clubSw"'), 'alias space');

const demoClub = extractDemoObject(perfilHtml, 'clubSw');
ok('DEMO.clubSw negocio_venue', demoClub.includes('negocio_venue'), 'arquetipo');
ok('DEMO.clubSw tipoPerfil lugar', demoClub.includes('tipoPerfil:"lugar"'), 'lugar');
ok('DEMO.clubSw sub club_sw', demoClub.includes('subcategoriaId:"club_sw"'), 'sub');
ok('DEMO.clubSw badgeSwinger', demoClub.includes('badgeSwinger:true'), 'badge');
ok('DEMO.clubSw eventosTematicos', demoClub.includes('eventosTematicos:'), 'eventos');
ok('DEMO.clubSw no legacy arquetipo venue', !demoClub.includes('arquetipo:"venue"'), 'no legacy');
ok('DEMO.clubSw no club_swinger sub', !demoClub.includes('subcategoriaId:"club_swinger"'), 'no legacy sub');

ok('aplicarPerfilDesdeRegistro eventosTematicos', perfilHtml.includes('eventosTematicos:'), 'preview');

const u = buildPerfil('club_sw');
const card = PR.cardHTMLClubSw(u, { categoria: 'Club Swinger' });
ok('club_sw tarjeta res-card--club-sw', card.includes('res-card--club-sw'), card.slice(0, 80));
ok('club_sw isClubSwPerfil', PR.isClubSwPerfil(u), 'detect');
ok('club_sw isVenuePerfil', PR.isVenuePerfil(u), 'venue family');
ok('club_sw badge Swinger tarjeta', card.includes('res-badge--swinger'), 'swinger badge');
ok('club_sw cardHTML routes clubSw', PR.cardHTML(u, { categoria: 'Club Swinger' }).includes('res-card--club-sw'), 'route');

const pres = FE.resolvePublicPresentation({ subcategoriaId: 'club_sw', categoria: 'Club Swinger' });
ok('field-engine vista clubSw', pres.vistaPerfil === 'clubSw', pres.vistaPerfil);

const presAlias = FE.resolvePublicPresentation({ subcategoriaId: 'club sw', categoria: 'Club Swinger' });
ok('field-engine alias club sw', presAlias.vistaPerfil === 'clubSw', presAlias.vistaPerfil);

console.log('\n=== QA Neg venue club_sw render ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
