/**
 * QA — Pack negocio_hospedaje motor/blocks (hotel_motel v1).
 * node scripts/qa-neg-hospedaje.mjs
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
  loadScript('data/registro-adultos-bienestar-blocks.js', ctx);
  loadScript('data/registro-adultos-hospedaje-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  return ctx;
}

function hospedajeCtx(subId) {
  return { subcategoriaId: subId, subcategoria: subId, arquetipo: 'negocio_hospedaje', tipoPerfil: 'lugar', formularioId: 'adultos' };
}

function mergedHospedaje(vmCtx, subId) {
  const cfg = vmCtx.CariHubRegistroPublicBlocks.resolveConfig(hospedajeCtx(subId), null);
  return vmCtx.CariHubRegistroPublicBlocks.mergedConfig(cfg, hospedajeCtx(subId));
}

function hasField(merged, fieldId) {
  return merged.blocks.some((b) => b.fields.some((f) => f.id === fieldId));
}

function baseValid() {
  return {
    nombreComercial: 'Motel Cariñoso GDL',
    tipoHospedaje: 'Motel',
    tiposHabitacion: ['Estándar', 'Suite jacuzzi'],
    tarifaHora: '$450 MXN / hora',
    tarifaNoche: '$1,200 MXN / noche',
    direccion: 'Providencia, Guadalajara, Jal.',
    horarioDetalle: 'Abierto 24 horas',
    reglasEstancia: ['Solo mayores de edad', 'Identificación obligatoria'],
    metodosPago: ['Efectivo', 'Tarjeta'],
    reservaciones: 'Sí',
    rfc: 'HOS123456ABC',
    razonSocial: 'Hospedaje SA de CV',
    tagline: 'Local verificado',
    amenidades: ['Jacuzzi en habitación', 'WiFi'],
  };
}

const vmCtx = loadAll();
const PB = vmCtx.CariHubRegistroPublicBlocks;
const viajes = vmCtx.CariHubViajesDesplazamiento;
const blocks = vmCtx.CARIHUB_REGISTRO_HOSPEDAJE_BLOCKS;
const blocksJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'data', 'registro-adultos-hospedaje-blocks.js'), 'utf8');

ok('blocks file loaded', !!blocks, 'negocio_hospedaje');
ok('blocks id negocio_hospedaje', blocks.id === 'negocio_hospedaje', 'id');
ok('blocks sub hotel_motel', blocks.subcategoriaIds.includes('hotel_motel'), 'hotel_motel');
ok('blocks 1/1 sub only', blocks.subcategoriaIds.length === 1, String(blocks.subcategoriaIds.length));
ok('no modalidades escort field', !blocksJs.includes("id: 'modalidades'"), 'no modalidades');
ok('no edad field', !blocksJs.includes("id: 'edad'"), 'no edad');
ok('no viaja field', !blocksJs.includes("id: 'viaja'"), 'no viaja');

const subId = 'hotel_motel';
const cfg = PB.resolveConfig(hospedajeCtx(subId), null);
ok('hotel_motel resolveConfig', cfg && cfg.id === 'negocio_hospedaje', cfg && cfg.id);
ok('hotel_motel matchesHospedaje', PB.matchesHospedaje(hospedajeCtx(subId), null), subId);
ok('hotel_motel not matchesRetail', !PB.matchesRetail(hospedajeCtx(subId), null), 'retail');
ok('hotel_motel not matchesVenue', !PB.matchesVenue(hospedajeCtx(subId), null), 'venue');
ok('hotel_motel not matchesBienestar', !PB.matchesBienestar(hospedajeCtx(subId), null), 'bienestar');
ok('hotel_motel not matchesEscort', !PB.matchesEscort(hospedajeCtx(subId), null), 'escort');
ok('hotel_motel not matchesCreador', !PB.matchesCreador(hospedajeCtx(subId), null), 'creador');

const merged = mergedHospedaje(vmCtx, subId);
ok('merged hospedajePerfil', merged.blocks.some((b) => b.id === 'hospedajePerfil'), 'block');
ok('tipoHospedaje field', hasField(merged, 'tipoHospedaje'), 'tipoHospedaje');
ok('tiposHabitacion field', hasField(merged, 'tiposHabitacion'), 'tiposHabitacion');
ok('tarifaHora field', hasField(merged, 'tarifaHora'), 'tarifaHora');
ok('no modalidades escort', !hasField(merged, 'modalidades'), 'no modalidades');
const valid = PB.validateValues(merged, baseValid(), hospedajeCtx(subId));
ok('validate ok payload', valid.length === 0, valid.join('; '));

ok('normalize hotel motel alias', PB.normalizeHospedajeSubId('hotel motel') === 'hotel_motel', 'hotel motel');
ok('normalize hotel', PB.normalizeHospedajeSubId('hotel') === 'hotel_motel', 'hotel');
ok('normalize motel', PB.normalizeHospedajeSubId('motel') === 'hotel_motel', 'motel');
ok('normalize hotel / motel', PB.normalizeHospedajeSubId('hotel / motel') === 'hotel_motel', 'slash alias');

ok('viajes inactivo hotel_motel', !viajes.subcategoriaActivaViajes('hotel_motel'), 'no viajes v1');
ok('viajes inactivo hotel motel alias', !viajes.subcategoriaActivaViajes('hotel motel'), 'no viajes alias');

ok('persona hotel not hospedaje', !PB.matchesHospedaje({ subcategoriaId: 'hotel_motel', tipoPerfil: 'persona' }, null), 'no persona');

const registroHtml = fs.readFileSync(path.join(repoRoot, 'public', 'registro-perfil.html'), 'utf8');
ok('registro-perfil script hospedaje blocks', registroHtml.includes('registro-adultos-hospedaje-blocks.js'), 'script tag');

console.log('\n=== QA Neg hospedaje motor/blocks ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
