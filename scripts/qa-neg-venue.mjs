/**
 * QA — Pack negocio_venue motor/blocks (antro + antro_lgbt).
 * node scripts/qa-neg-venue.mjs
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
  loadScript('data/registro-adultos-venue-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  return ctx;
}

function venueCtx(subId) {
  return { subcategoriaId: subId, subcategoria: subId, arquetipo: 'negocio_venue', tipoPerfil: 'lugar', formularioId: 'adultos' };
}

function mergedVenue(vmCtx, subId) {
  const cfg = vmCtx.CariHubRegistroPublicBlocks.resolveConfig(venueCtx(subId), null);
  return vmCtx.CariHubRegistroPublicBlocks.mergedConfig(cfg, venueCtx(subId));
}

function hasField(merged, fieldId) {
  return merged.blocks.some((b) => b.fields.some((f) => f.id === fieldId));
}

function baseValid(subId) {
  return {
    nombreComercial: subId === 'antro_lgbt' ? 'Rainbow Club MTY' : 'Nocturna MTY',
    tipoVenue: subId === 'antro_lgbt' ? 'Antro LGBT+' : 'Antro / Discoteca',
    precioEntrada: '$350 MXN',
    cartelera: 'DJ viernes · Noche retro sábado',
    dressCode: 'Elegante casual',
    areasVenue: ['Pista principal', 'Mesas VIP', 'Bar premium'],
    reglasAcceso: ['Solo mayores de edad', 'Identificación obligatoria'],
    direccion: 'Centro, Monterrey, N.L.',
    horarioDetalle: 'Vie–Dom 10:00 PM – 4:00 AM',
    metodosPago: ['Efectivo', 'Tarjeta'],
    reservaciones: 'Sí',
    rfc: 'ANT123456ABC',
    razonSocial: 'Nocturna SA de CV',
    tagline: 'Vida nocturna premium',
  };
}

const vmCtx = loadAll();
const PB = vmCtx.CariHubRegistroPublicBlocks;
const viajes = vmCtx.CariHubViajesDesplazamiento;
const blocks = vmCtx.CARIHUB_REGISTRO_VENUE_BLOCKS;

ok('blocks file loaded', !!blocks, 'negocio_venue');
ok('blocks id negocio_venue', blocks.id === 'negocio_venue', 'id');
ok('blocks sub antro', blocks.subcategoriaIds.includes('antro'), 'antro');
ok('blocks sub antro_lgbt', blocks.subcategoriaIds.includes('antro_lgbt'), 'antro_lgbt');
ok('blocks no cabinas', !blocks.subcategoriaIds.includes('cabinas'), 'no cabinas');
ok('blocks no cine_xxx', !blocks.subcategoriaIds.includes('cine_xxx'), 'no cine_xxx');

['antro', 'antro_lgbt'].forEach((subId) => {
  const cfg = PB.resolveConfig(venueCtx(subId), null);
  ok(`${subId} resolveConfig`, cfg && cfg.id === 'negocio_venue', cfg && cfg.id);
  ok(`${subId} matchesVenue`, PB.matchesVenue(venueCtx(subId), null), subId);
  ok(`${subId} not matchesRetail`, !PB.matchesRetail(venueCtx(subId), null), 'retail');
  ok(`${subId} not matchesEscort`, !PB.matchesEscort(venueCtx(subId), null), 'escort');
  ok(`${subId} not matchesCreador`, !PB.matchesCreador(venueCtx(subId), null), 'creador');
  const merged = mergedVenue(vmCtx, subId);
  ok(`${subId} merged venuePerfil`, merged.blocks.some((b) => b.id === 'venuePerfil'), 'block');
  ok(`${subId} tipoVenue field`, hasField(merged, 'tipoVenue'), 'tipoVenue');
  ok(`${subId} no modalidades escort`, !hasField(merged, 'modalidades'), 'no modalidades');
  const valid = PB.validateValues(merged, baseValid(subId), venueCtx(subId));
  ok(`${subId} validate ok payload`, valid.length === 0, valid.join('; '));
});

ok('antro restaurant bar alias resolves', PB.matchesVenue(venueCtx('antro restaurant bar'), null), 'alias');
ok('antro restaurant bar lgbt alias resolves', PB.matchesVenue(venueCtx('antro restaurant bar lgbt'), null), 'alias');
ok('normalize antro restaurant bar', PB.normalizeVenueSubId('antro restaurant bar') === 'antro', 'antro');
ok('normalize antro restaurant bar lgbt', PB.normalizeVenueSubId('antro restaurant bar lgbt') === 'antro_lgbt', 'antro_lgbt');

ok('viajes inactivo antro', !viajes.subcategoriaActivaViajes('antro'), 'no viajes v1');
ok('viajes inactivo antro_lgbt', !viajes.subcategoriaActivaViajes('antro_lgbt'), 'no viajes v1');

const registroHtml = fs.readFileSync(path.join(repoRoot, 'public', 'registro-perfil.html'), 'utf8');
ok('registro-perfil script venue blocks', registroHtml.includes('registro-adultos-venue-blocks.js'), 'script tag');

console.log('\n=== QA Neg venue motor/blocks ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
