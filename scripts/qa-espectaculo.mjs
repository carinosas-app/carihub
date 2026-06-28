/**
 * QA — Pack persona_espectaculo motor/blocks (stripper / tabledance).
 * node scripts/qa-espectaculo.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const root = path.join(repoRoot, 'public', 'js');

const ESP_2 = ['stripper', 'tabledance'];

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
  loadScript('data/registro-adultos-pareja-blocks.js', ctx);
  loadScript('data/registro-adultos-lifestyle-blocks.js', ctx);
  loadScript('data/registro-adultos-dominatrix-blocks.js', ctx);
  loadScript('data/registro-adultos-espectaculo-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  return ctx;
}

function espCtx(subId) {
  return { subcategoriaId: subId, subcategoria: subId, arquetipo: 'persona_espectaculo', tipoPerfil: 'espectaculo', formularioId: 'adultos' };
}

function mergedEsp(vmCtx, subId) {
  const cfg = vmCtx.CariHubRegistroPublicBlocks.resolveConfig(espCtx(subId), null);
  return vmCtx.CariHubRegistroPublicBlocks.mergedConfig(cfg, espCtx(subId));
}

function hasField(merged, fieldId) {
  return merged.blocks.some((b) => b.fields.some((f) => f.id === fieldId));
}

function baseValid(subId) {
  return {
    tipoShow: ['Shows privados', 'Pole dance / barra'],
    precioShow: '$1,200 MXN por canción',
    horarioMinimo: 'Por canción',
    modalidades: ['fiestas', 'clubes'],
    anosExperiencia: '3–5 años',
    venueFijo: subId === 'tabledance' ? 'Antros zona centro' : 'Monterrey y área metropolitana',
    serviciosIncluidos: ['Shows privados', 'Interacción con el público'],
    serviciosNoRealizo: ['Servicios sexuales', 'Menores de edad'],
    horarioDetalle: 'Viernes a domingo',
    metodosPago: ['Efectivo'],
  };
}

const vmCtx = loadAll();
const PB = vmCtx.CariHubRegistroPublicBlocks;
const viajes = vmCtx.CariHubViajesDesplazamiento;

ok('blocks file loaded', !!vmCtx.CARIHUB_REGISTRO_ESPECTACULO_BLOCKS, 'persona_espectaculo');
ok('blocks id persona_espectaculo', vmCtx.CARIHUB_REGISTRO_ESPECTACULO_BLOCKS.id === 'persona_espectaculo', 'id');

ESP_2.forEach((subId) => {
  const cfg = PB.resolveConfig(espCtx(subId), null);
  ok(`${subId} resolveConfig`, cfg && cfg.id === 'persona_espectaculo', cfg && cfg.id);
  ok(`${subId} matchesEspectaculo`, PB.matchesEspectaculo(espCtx(subId), null), subId);
  ok(`${subId} not matchesEscort`, !PB.matchesEscort(espCtx(subId), null), subId);
  ok(`${subId} not matchesDominatrix`, !PB.matchesDominatrix(espCtx(subId), null), subId);
  ok(`${subId} not matchesLifestyle`, !PB.matchesLifestyle(espCtx(subId), null), subId);
  ok(`${subId} not matchesPareja`, !PB.matchesPareja(espCtx(subId), null), subId);
  const merged = mergedEsp(vmCtx, subId);
  ok(`${subId} merged blocks`, merged.blocks.length >= 4, String(merged.blocks.length));
  ok(`${subId} tipoShow field`, hasField(merged, 'tipoShow'), 'tipoShow');
  ok(`${subId} precioShow field`, hasField(merged, 'precioShow'), 'precioShow');
  ok(`${subId} no escort servicios sexuales`, !hasField(merged, 'realizaTrios'), 'no escort');
  if (subId === 'stripper') {
    ok('stripper viajes activo', viajes.subcategoriaActivaViajes(subId), 'stripper viaja');
  } else {
    ok(`${subId} viajes inactivo`, !viajes.subcategoriaActivaViajes(subId), 'no viajes tabledance');
  }
});

ok('table_dance alias resolves', PB.matchesEspectaculo(espCtx('table_dance'), null), 'table_dance');
ok('table_dance canonical tabledance', PB.normalizeEspectaculoSubId('table_dance') === 'tabledance', 'canonical');

const stripperMerged = mergedEsp(vmCtx, 'stripper');
ok('stripper sin desplazamientos oblig', !stripperMerged.obligatorios.includes('desplazamientos'), stripperMerged.obligatorios.join(','));
ok('stripper modalidades oblig', stripperMerged.obligatorios.includes('modalidades'), stripperMerged.obligatorios.join(','));

const tdMerged = mergedEsp(vmCtx, 'tabledance');
ok('tabledance venueFijo oblig merge', tdMerged.obligatorios.includes('venueFijo'), tdMerged.obligatorios.join(','));
ok('tabledance desplazamientos not oblig', !tdMerged.obligatorios.includes('desplazamientos'), tdMerged.obligatorios.join(','));

const invalidTd = PB.validateValues(mergedEsp(vmCtx, 'tabledance'), Object.assign({}, baseValid('tabledance'), { venueFijo: '' }), espCtx('tabledance'));
ok('tabledance validate exige venueFijo', invalidTd.length > 0, String(invalidTd.length));

const validStripper = PB.validateValues(mergedEsp(vmCtx, 'stripper'), baseValid('stripper'), espCtx('stripper'));
ok('stripper validate ok payload', validStripper.length === 0, validStripper.join('; '));

const registroHtml = fs.readFileSync(path.join(repoRoot, 'public', 'registro-perfil.html'), 'utf8');
ok('registro-perfil script espectaculo blocks', registroHtml.includes('registro-adultos-espectaculo-blocks.js'), 'script tag');

console.log('\n=== QA Espectaculo motor/blocks ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
