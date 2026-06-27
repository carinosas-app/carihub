/**
 * QA — Pack negocio_bienestar motor/blocks (spa + masajes).
 * node scripts/qa-neg-bienestar.mjs
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
  loadScript('carihub-registro-public-blocks.js', ctx);
  return ctx;
}

function bienestarCtx(subId) {
  return { subcategoriaId: subId, subcategoria: subId, arquetipo: 'negocio_bienestar', tipoPerfil: 'negocio', formularioId: 'adultos' };
}

function mergedBienestar(vmCtx, subId) {
  const cfg = vmCtx.CariHubRegistroPublicBlocks.resolveConfig(bienestarCtx(subId), null);
  return vmCtx.CariHubRegistroPublicBlocks.mergedConfig(cfg, bienestarCtx(subId));
}

function hasField(merged, fieldId) {
  return merged.blocks.some((b) => b.fields.some((f) => f.id === fieldId));
}

function baseValid(subId) {
  const common = {
    nombreComercial: subId === 'spa' ? 'Serenity Spa MTY' : 'Zen Touch Masajes MTY',
    tipoBienestar: subId === 'spa' ? 'Spa / centro de bienestar' : 'Centro de masajes',
    menuServicios: 'Relajante · Deportivo · Pareja',
    precioDesde: subId === 'spa' ? '$890 MXN' : '$650 MXN',
    direccion: 'Valle Oriente, Monterrey, N.L.',
    horarioDetalle: 'Lun–Dom 10:00 AM – 10:00 PM',
    metodosPago: ['Efectivo', 'Tarjeta'],
    reservaciones: 'Sí',
    rfc: 'BIE123456ABC',
    razonSocial: 'Bienestar SA de CV',
    tagline: 'Local verificado',
    serviciosNoRealizo: ['Menores de edad', 'Conducta inapropiada'],
  };
  if (subId === 'spa') {
    common.amenidades = ['Jacuzzi', 'Sauna', 'Cabinas privadas'];
  } else {
    common.serviciosIncluidos = ['Masaje relajante 60 min', 'Masaje en pareja 90 min'];
  }
  return common;
}

const vmCtx = loadAll();
const PB = vmCtx.CariHubRegistroPublicBlocks;
const viajes = vmCtx.CariHubViajesDesplazamiento;
const blocks = vmCtx.CARIHUB_REGISTRO_BIENESTAR_BLOCKS;
const blocksJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'data', 'registro-adultos-bienestar-blocks.js'), 'utf8');

ok('blocks file loaded', !!blocks, 'negocio_bienestar');
ok('blocks id negocio_bienestar', blocks.id === 'negocio_bienestar', 'id');
ok('blocks sub spa', blocks.subcategoriaIds.includes('spa'), 'spa');
ok('blocks sub masajes', blocks.subcategoriaIds.includes('masajes'), 'masajes');
ok('blocks no hotel', !blocks.subcategoriaIds.includes('hotel'), 'no hotel');
ok('blocks no club_sw', !blocks.subcategoriaIds.includes('club_sw'), 'no club_sw');
ok('no modalidades escort field', !blocksJs.includes("id: 'modalidades'"), 'no modalidades');
ok('no edad field', !blocksJs.includes("id: 'edad'"), 'no edad');

['spa', 'masajes'].forEach((subId) => {
  const cfg = PB.resolveConfig(bienestarCtx(subId), null);
  ok(`${subId} resolveConfig`, cfg && cfg.id === 'negocio_bienestar', cfg && cfg.id);
  ok(`${subId} matchesBienestar`, PB.matchesBienestar(bienestarCtx(subId), null), subId);
  ok(`${subId} not matchesRetail`, !PB.matchesRetail(bienestarCtx(subId), null), 'retail');
  ok(`${subId} not matchesVenue`, !PB.matchesVenue(bienestarCtx(subId), null), 'venue');
  ok(`${subId} not matchesEscort`, !PB.matchesEscort(bienestarCtx(subId), null), 'escort');
  ok(`${subId} not matchesCreador`, !PB.matchesCreador(bienestarCtx(subId), null), 'creador');
  const merged = mergedBienestar(vmCtx, subId);
  ok(`${subId} merged bienestarPerfil`, merged.blocks.some((b) => b.id === 'bienestarPerfil'), 'block');
  ok(`${subId} tipoBienestar field`, hasField(merged, 'tipoBienestar'), 'tipoBienestar');
  ok(`${subId} menuServicios field`, hasField(merged, 'menuServicios'), 'menuServicios');
  ok(`${subId} no modalidades escort`, !hasField(merged, 'modalidades'), 'no modalidades');
  const valid = PB.validateValues(merged, baseValid(subId), bienestarCtx(subId));
  ok(`${subId} validate ok payload`, valid.length === 0, valid.join('; '));
});

ok('masajes resolve never escort config', PB.resolveConfig(bienestarCtx('masajes'), null).id === 'negocio_bienestar', 'bienestar');
ok('normalize spa', PB.normalizeBienestarSubId('spa') === 'spa', 'spa');
ok('normalize masajes', PB.normalizeBienestarSubId('masajes') === 'masajes', 'masajes');

ok('viajes inactivo spa', !viajes.subcategoriaActivaViajes('spa'), 'no viajes v1');
ok('viajes inactivo masajes', !viajes.subcategoriaActivaViajes('masajes'), 'no viajes v1');

ok('persona masajes not bienestar', !PB.matchesBienestar({ subcategoriaId: 'masajes', tipoPerfil: 'persona' }, null), 'no persona');

const registroHtml = fs.readFileSync(path.join(repoRoot, 'public', 'registro-perfil.html'), 'utf8');
ok('registro-perfil script bienestar blocks', registroHtml.includes('registro-adultos-bienestar-blocks.js'), 'script tag');

console.log('\n=== QA Neg bienestar motor/blocks ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
