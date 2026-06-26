/**
 * QA — Pack persona_creador motor/blocks (contenido).
 * node scripts/qa-creador.mjs
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
  loadScript('data/registro-adultos-dominatrix-blocks.js', ctx);
  loadScript('data/registro-adultos-espectaculo-blocks.js', ctx);
  loadScript('data/registro-adultos-creador-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  return ctx;
}

function creadorCtx(subId) {
  return { subcategoriaId: subId, subcategoria: subId, arquetipo: 'persona_creador', tipoPerfil: 'creador', formularioId: 'adultos' };
}

function mergedCreador(vmCtx, subId) {
  const cfg = vmCtx.CariHubRegistroPublicBlocks.resolveConfig(creadorCtx(subId), null);
  return vmCtx.CariHubRegistroPublicBlocks.mergedConfig(cfg, creadorCtx(subId));
}

function hasField(merged, fieldId) {
  return merged.blocks.some((b) => b.fields.some((f) => f.id === fieldId));
}

function baseValid() {
  return {
    tiposContenido: ['Fotos exclusivas', 'Videos', 'Suscripción mensual'],
    plataformas: ['OnlyFans', 'Telegram VIP'],
    precioSuscripcion: '$299 MXN / mes',
    redesSociales: 'https://onlyfans.com/demo\nhttps://instagram.com/demo',
    serviciosIncluidos: ['Suscripción mensual', 'Contenido exclusivo'],
    serviciosNoRealizo: ['Encuentros presenciales', 'Servicios escort / sexuales'],
    horarioDetalle: 'Publico diario · lives semanales',
    metodosPago: ['Pago en línea', 'Transferencia'],
  };
}

const vmCtx = loadAll();
const PB = vmCtx.CariHubRegistroPublicBlocks;
const viajes = vmCtx.CariHubViajesDesplazamiento;

ok('blocks file loaded', !!vmCtx.CARIHUB_REGISTRO_CREADOR_BLOCKS, 'persona_creador');
ok('blocks id persona_creador', vmCtx.CARIHUB_REGISTRO_CREADOR_BLOCKS.id === 'persona_creador', 'id');
ok('blocks sub contenido', vmCtx.CARIHUB_REGISTRO_CREADOR_BLOCKS.subcategoriaIds.includes('contenido'), 'contenido');

const cfg = PB.resolveConfig(creadorCtx('contenido'), null);
ok('contenido resolveConfig', cfg && cfg.id === 'persona_creador', cfg && cfg.id);
ok('contenido matchesCreador', PB.matchesCreador(creadorCtx('contenido'), null), 'contenido');
ok('contenido not matchesEscort', !PB.matchesEscort(creadorCtx('contenido'), null), 'escort');
ok('contenido not matchesDominatrix', !PB.matchesDominatrix(creadorCtx('contenido'), null), 'dominatrix');
ok('contenido not matchesEspectaculo', !PB.matchesEspectaculo(creadorCtx('contenido'), null), 'espectaculo');
ok('contenido not matchesLifestyle', !PB.matchesLifestyle(creadorCtx('contenido'), null), 'lifestyle');
ok('contenido not matchesPareja', !PB.matchesPareja(creadorCtx('contenido'), null), 'pareja');

const merged = mergedCreador(vmCtx, 'contenido');
ok('merged blocks', merged.blocks.length >= 4, String(merged.blocks.length));
ok('tiposContenido field', hasField(merged, 'tiposContenido'), 'tiposContenido');
ok('plataformas field', hasField(merged, 'plataformas'), 'plataformas');
ok('precioSuscripcion field', hasField(merged, 'precioSuscripcion'), 'precioSuscripcion');
ok('no escort realizaTrios', !hasField(merged, 'realizaTrios'), 'no escort');
ok('no escort modalidades escort', !hasField(merged, 'modalidades'), 'no modalidades escort');
ok('viajes inactivo contenido', !viajes.subcategoriaActivaViajes('contenido'), 'no viajes v1');

ok('creador_contenido alias resolves', PB.matchesCreador(creadorCtx('creador_contenido'), null), 'creador_contenido');
ok('creador_contenido canonical contenido', PB.normalizeCreadorSubId('creador_contenido') === 'contenido', 'canonical');

const invalid = PB.validateValues(mergedCreador(vmCtx, 'contenido'), Object.assign({}, baseValid(), { plataformas: [] }), creadorCtx('contenido'));
ok('validate exige plataformas', invalid.length > 0, String(invalid.length));

const valid = PB.validateValues(mergedCreador(vmCtx, 'contenido'), baseValid(), creadorCtx('contenido'));
ok('validate ok payload', valid.length === 0, valid.join('; '));

const registroHtml = fs.readFileSync(path.join(repoRoot, 'public', 'registro-perfil.html'), 'utf8');
ok('registro-perfil script creador blocks', registroHtml.includes('registro-adultos-creador-blocks.js'), 'script tag');

console.log('\n=== QA Creador motor/blocks ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
