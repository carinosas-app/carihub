/**
 * QA — Pack negocio_venue motor/blocks (club_sw / NEG-VEN-02).
 * node scripts/qa-neg-venue-club-sw.mjs
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

function baseValidClub() {
  return {
    nombreComercial: 'Club Eros Lifestyle',
    tipoVenue: 'Club Swinger / Lifestyle',
    precioEntrada: '$600 MXN',
    eventosTematicos: 'Noche lifestyle viernes · Fiesta temática sábado',
    politicaParejasSingles: 'Parejas y singles bienvenidos con previa reservación',
    dressCode: 'Elegante casual',
    areasVenue: ['Salón principal', 'Bar premium', 'Lockers'],
    reglasAcceso: ['Solo mayores de edad', 'Moderación en puerta'],
    direccion: 'Valle Oriente, Monterrey, N.L.',
    horarioDetalle: 'Jue–Dom 9:00 PM – 3:00 AM',
    metodosPago: ['Efectivo', 'Tarjeta'],
    reservaciones: 'Sí',
    rfc: 'CLB123456ABC',
    razonSocial: 'Club Eros SA de CV',
    tagline: 'Ambiente elegante lifestyle',
  };
}

const vmCtx = loadAll();
const PB = vmCtx.CariHubRegistroPublicBlocks;
const viajes = vmCtx.CariHubViajesDesplazamiento;
const blocks = vmCtx.CARIHUB_REGISTRO_VENUE_BLOCKS;
const blocksJs = fs.readFileSync(path.join(root, 'data', 'registro-adultos-venue-blocks.js'), 'utf8');

ok('blocks file loaded', !!blocks, 'negocio_venue');
ok('blocks sub club_sw', blocks.subcategoriaIds.includes('club_sw'), 'club_sw');
ok('1/1 sub club_sw in bundle', blocks.subcategoriaIds.filter((s) => s === 'club_sw').length === 1, 'canon');
ok('no cabinas', !blocks.subcategoriaIds.includes('cabinas'), 'no cabinas');
ok('no cine_xxx', !blocks.subcategoriaIds.includes('cine_xxx'), 'no cine_xxx');
ok('no modalidades escort field', !blocksJs.includes("id: 'modalidades'"), 'no modalidades');
ok('no edad field', !blocksJs.includes("id: 'edad'"), 'no edad');
ok('no viaja field', !blocksJs.includes("id: 'viaja'"), 'no viaja');

const subId = 'club_sw';
const cfg = PB.resolveConfig(venueCtx(subId), null);
ok('club_sw resolveConfig negocio_venue', cfg && cfg.id === 'negocio_venue', cfg && cfg.id);
ok('club_sw matchesVenue', PB.matchesVenue(venueCtx(subId), null), subId);
ok('club_sw isVenueSubcategoria', PB.isVenueSubcategoria(venueCtx(subId)), 'venue');
ok('club_sw not matchesRetail', !PB.matchesRetail(venueCtx(subId), null), 'retail');
ok('club_sw not matchesEscort', !PB.matchesEscort(venueCtx(subId), null), 'escort');
ok('club_sw not isSwingerSubcategoria', !PB.isSwingerSubcategoria(venueCtx(subId)), 'no pareja pipeline');

const merged = mergedVenue(vmCtx, subId);
ok('merged venuePerfil block', merged.blocks.some((b) => b.id === 'venuePerfil'), 'block');
ok('eventosTematicos field', hasField(merged, 'eventosTematicos'), 'eventosTematicos');
ok('politicaParejasSingles field', hasField(merged, 'politicaParejasSingles'), 'politicaParejasSingles');
ok('no cartelera for club_sw', !hasField(merged, 'cartelera'), 'no cartelera');
ok('no modalidades escort merged', !hasField(merged, 'modalidades'), 'no modalidades');

const valid = PB.validateValues(merged, baseValidClub(), venueCtx(subId));
ok('validate ok payload', valid.length === 0, valid.join('; '));

['club sw', 'club_swinger', 'club swinger'].forEach((alias) => {
  ok(`alias ${alias} normalize`, PB.normalizeVenueSubId(alias) === 'club_sw', alias);
  ok(`alias ${alias} matchesVenue`, PB.matchesVenue(venueCtx(alias), null), alias);
});

ok('viajes inactivo club_sw', !viajes.subcategoriaActivaViajes('club_sw'), 'no viajes v1');
ok('viajes inactivo club sw alias', !viajes.subcategoriaActivaViajes('club sw'), 'no viajes alias');

console.log('\n=== QA Neg venue club_sw motor/blocks ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
