/**
 * QA — Pack negocio_venue motor/blocks (cine_xxx / NEG-VEN-03).
 * node scripts/qa-neg-venue-cine-xxx.mjs
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

function baseValidCine() {
  return {
    nombreComercial: 'Cine Privé MTY',
    tipoVenue: 'Cine para adultos',
    precioEntrada: '$150 MXN',
    cartelera: 'Estrenos semanales · Maratón viernes',
    horariosFunciones: 'Lun–Vie 12:00–10:00 PM · Sáb–Dom 11:00 AM–12:00 AM',
    clasificacion: 'Solo mayores de 18 años',
    areasVenue: ['Sala principal', 'Cabinas privadas', 'Lobby discreto'],
    reglasAcceso: ['Solo mayores de edad', 'Identificación obligatoria'],
    direccion: 'Centro, Monterrey, N.L.',
    horarioDetalle: 'Lun–Dom 12:00 PM – 12:00 AM',
    metodosPago: ['Efectivo', 'Tarjeta'],
    rfc: 'CIN123456ABC',
    razonSocial: 'Cine Privé SA de CV',
    tagline: 'Cartelera actualizada',
  };
}

const vmCtx = loadAll();
const PB = vmCtx.CariHubRegistroPublicBlocks;
const viajes = vmCtx.CariHubViajesDesplazamiento;
const blocks = vmCtx.CARIHUB_REGISTRO_VENUE_BLOCKS;
const blocksJs = fs.readFileSync(path.join(root, 'data', 'registro-adultos-venue-blocks.js'), 'utf8');

ok('blocks file loaded', !!blocks, 'negocio_venue');
ok('blocks sub cine_xxx', blocks.subcategoriaIds.includes('cine_xxx'), 'cine_xxx');
ok('1/1 sub cine_xxx in bundle', blocks.subcategoriaIds.filter((s) => s === 'cine_xxx').length === 1, 'canon');
ok('no modalidades escort field', !blocksJs.includes("id: 'modalidades'"), 'no modalidades');
ok('no edad field', !blocksJs.includes("id: 'edad'"), 'no edad');
ok('no viaja field', !blocksJs.includes("id: 'viaja'"), 'no viaja');
ok('no cineXxxPerfil nested', !blocksJs.includes("id: 'cineXxxPerfil'"), 'venuePerfil only');

const subId = 'cine_xxx';
const cfg = PB.resolveConfig(venueCtx(subId), null);
ok('cine_xxx resolveConfig negocio_venue', cfg && cfg.id === 'negocio_venue', cfg && cfg.id);
ok('cine_xxx matchesVenue', PB.matchesVenue(venueCtx(subId), null), subId);
ok('cine_xxx isVenueSubcategoria', PB.isVenueSubcategoria(venueCtx(subId)), 'venue');
ok('cine_xxx not matchesRetail', !PB.matchesRetail(venueCtx(subId), null), 'retail');
ok('cine_xxx not matchesEscort', !PB.matchesEscort(venueCtx(subId), null), 'escort');
ok('cine_xxx not isSwingerSubcategoria', !PB.isSwingerSubcategoria(venueCtx(subId)), 'no pareja pipeline');

const merged = mergedVenue(vmCtx, subId);
ok('merged venuePerfil block', merged.blocks.some((b) => b.id === 'venuePerfil'), 'block');
ok('cartelera field', hasField(merged, 'cartelera'), 'cartelera');
ok('horariosFunciones field', hasField(merged, 'horariosFunciones'), 'horariosFunciones');
ok('clasificacion field', hasField(merged, 'clasificacion'), 'clasificacion');
ok('no dressCode for cine_xxx', !hasField(merged, 'dressCode'), 'no dressCode');
ok('no eventosTematicos for cine_xxx', !hasField(merged, 'eventosTematicos'), 'no eventosTematicos');
ok('no politicaParejasSingles for cine_xxx', !hasField(merged, 'politicaParejasSingles'), 'no politica');
ok('no modalidades escort merged', !hasField(merged, 'modalidades'), 'no modalidades');

const valid = PB.validateValues(merged, baseValidCine(), venueCtx(subId));
ok('validate ok payload', valid.length === 0, valid.join('; '));

['cine_xxx', 'cine xxx', 'cine adulto'].forEach((alias) => {
  ok(`alias ${alias} normalize`, PB.normalizeVenueSubId(alias) === 'cine_xxx', alias);
  ok(`alias ${alias} matchesVenue`, PB.matchesVenue(venueCtx(alias), null), alias);
});

ok('viajes inactivo cine_xxx', !viajes.subcategoriaActivaViajes('cine_xxx'), 'no viajes v1');
ok('viajes inactivo cine xxx alias', !viajes.subcategoriaActivaViajes('cine xxx'), 'no viajes alias');

console.log('\n=== QA Neg venue cine_xxx motor/blocks ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
