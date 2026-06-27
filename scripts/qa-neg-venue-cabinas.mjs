/**
 * QA — Pack negocio_venue motor/blocks (cabinas / NEG-VEN-03).
 * node scripts/qa-neg-venue-cabinas.mjs
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

function baseValidCabinas() {
  return {
    nombreComercial: 'Cabinas Discretas MTY',
    tipoVenue: 'Cabinas privadas / Glory holes',
    precioEntrada: '$400 MXN / 30 min',
    nivelPrivacidad: 'Alta — acceso individual y discreto',
    areasVenue: ['Cabinas privadas', 'Glory holes', 'Regaderas'],
    reglasAcceso: ['Solo mayores de edad', 'Identificación obligatoria'],
    direccion: 'Valle Oriente, Monterrey, N.L.',
    horarioDetalle: 'Abierto 24 horas',
    metodosPago: ['Efectivo', 'Tarjeta'],
    reservaciones: 'Sí',
    rfc: 'CAB123456ABC',
    razonSocial: 'Cabinas Discretas SA de CV',
    tagline: 'Privacidad y limpieza',
  };
}

const vmCtx = loadAll();
const PB = vmCtx.CariHubRegistroPublicBlocks;
const viajes = vmCtx.CariHubViajesDesplazamiento;
const blocks = vmCtx.CARIHUB_REGISTRO_VENUE_BLOCKS;
const blocksJs = fs.readFileSync(path.join(root, 'data', 'registro-adultos-venue-blocks.js'), 'utf8');

ok('blocks file loaded', !!blocks, 'negocio_venue');
ok('blocks sub cabinas', blocks.subcategoriaIds.includes('cabinas'), 'cabinas');
ok('1/1 sub cabinas in bundle', blocks.subcategoriaIds.filter((s) => s === 'cabinas').length === 1, 'canon');
ok('no modalidades escort field', !blocksJs.includes("id: 'modalidades'"), 'no modalidades');
ok('no edad field', !blocksJs.includes("id: 'edad'"), 'no edad');
ok('no viaja field', !blocksJs.includes("id: 'viaja'"), 'no viaja');
ok('no cabinasPerfil nested', !blocksJs.includes("id: 'cabinasPerfil'"), 'venuePerfil only');

const subId = 'cabinas';
const cfg = PB.resolveConfig(venueCtx(subId), null);
ok('cabinas resolveConfig negocio_venue', cfg && cfg.id === 'negocio_venue', cfg && cfg.id);
ok('cabinas matchesVenue', PB.matchesVenue(venueCtx(subId), null), subId);
ok('cabinas isVenueSubcategoria', PB.isVenueSubcategoria(venueCtx(subId)), 'venue');
ok('cabinas not matchesRetail', !PB.matchesRetail(venueCtx(subId), null), 'retail');
ok('cabinas not matchesEscort', !PB.matchesEscort(venueCtx(subId), null), 'escort');
ok('cabinas not isSwingerSubcategoria', !PB.isSwingerSubcategoria(venueCtx(subId)), 'no pareja pipeline');

const merged = mergedVenue(vmCtx, subId);
ok('merged venuePerfil block', merged.blocks.some((b) => b.id === 'venuePerfil'), 'block');
ok('nivelPrivacidad field', hasField(merged, 'nivelPrivacidad'), 'nivelPrivacidad');
ok('no cartelera for cabinas', !hasField(merged, 'cartelera'), 'no cartelera');
ok('no dressCode for cabinas', !hasField(merged, 'dressCode'), 'no dressCode');
ok('no eventosTematicos for cabinas', !hasField(merged, 'eventosTematicos'), 'no eventosTematicos');
ok('no politicaParejasSingles for cabinas', !hasField(merged, 'politicaParejasSingles'), 'no politica');
ok('no modalidades escort merged', !hasField(merged, 'modalidades'), 'no modalidades');

const valid = PB.validateValues(merged, baseValidCabinas(), venueCtx(subId));
ok('validate ok payload', valid.length === 0, valid.join('; '));

['cabinas', 'cabinas glory holes', 'cabinas / glory holes'].forEach((alias) => {
  ok(`alias ${alias} normalize`, PB.normalizeVenueSubId(alias) === 'cabinas', alias);
  ok(`alias ${alias} matchesVenue`, PB.matchesVenue(venueCtx(alias), null), alias);
});

ok('viajes inactivo cabinas', !viajes.subcategoriaActivaViajes('cabinas'), 'no viajes v1');
ok('viajes inactivo cabinas glory holes alias', !viajes.subcategoriaActivaViajes('cabinas glory holes'), 'no viajes alias');

console.log('\n=== QA Neg venue cabinas motor/blocks ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
