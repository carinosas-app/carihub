/**
 * QA — MP-RESTAURANTES-GASTRONOMIA-BEBIDAS-V1 Fase 2 blocks (sin browser).
 * node scripts/qa-gastronomia-blocks-v1.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import {
  CANON_SUBCATEGORIAS,
  SUB_TO_PACK,
  LEGACY_TO_CANON,
  SUB_DELTAS,
  GENERIC_ONLY_FORBIDDEN,
  PACK_IDS,
  MIN_DELTA_FIELD_COUNT,
  GASTRONOMIA_NESTED_PROFILE_KEY,
} from './gastronomia-packs-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

const ctx = vm.createContext({ window: {}, globalThis: {} });
ctx.window = ctx;
const blocksCode = fs.readFileSync(path.join(root, 'public/js/data/registro-gastronomia-blocks.js'), 'utf8');
vm.runInContext(blocksCode, ctx, { filename: 'registro-gastronomia-blocks.js' });
const api = ctx.window.CARIHUB_REGISTRO_GASTRONOMIA_SECTOR_BLOCKS;

ok('API expuesta', !!api && typeof api.buildConfig === 'function');
ok('legacyToCanon 25', Object.keys(api.legacyToCanon || {}).length === 25);
ok('canon 24', (api.canonSubcategorias || []).length === 24);
ok('nested key buildGastronomiaPerfil', typeof api.buildGastronomiaPerfil === 'function');

const packsSeen = new Set();
const fieldCounts = [];

CANON_SUBCATEGORIAS.forEach(function (c) {
  const canonId = c.subcategoriaId;
  const cfg = api.buildConfig({
    sectorId: 'restaurantes',
    subcategoriaId: canonId,
    formularioId: c.formularioId,
  });
  const pack = cfg.deltaPack;
  packsSeen.add(pack);
  ok('pack ' + canonId + ' → ' + SUB_TO_PACK[canonId], pack === SUB_TO_PACK[canonId], pack);
  ok('canon id cfg ' + canonId, cfg.canonSubcategoriaId === canonId);
  ok('sector restaurantes ' + canonId, cfg.sectorId === 'restaurantes');
  ok('blocks ' + canonId, Array.isArray(cfg.blocks) && cfg.blocks.length >= 2, String(cfg.blocks.length));
  ok('blockTitle delta ' + canonId, cfg.blocks.some(function (b) { return b.title === c.blockTitle; }));

  const blob = JSON.stringify(cfg.blocks);
  api.genericForbiddenIds.forEach(function (fid) {
    ok('no genérico ' + fid + ' (' + canonId + ')', blob.indexOf('"id":"' + fid + '"') < 0, fid);
  });

  const delta = SUB_DELTAS[canonId];
  ok('schema delta min ' + canonId, (delta.deltaFields || []).length >= MIN_DELTA_FIELD_COUNT, String(delta.deltaFields.length));

  const fieldIds = [];
  cfg.blocks.forEach(function (block) {
    block.fields.forEach(function (field) {
      fieldIds.push(field.id);
    });
  });
  fieldCounts.push({ canonId, count: fieldIds.length, pack });
  ok('≥15 campos blocks ' + canonId, fieldIds.length >= 15, String(fieldIds.length));

  (delta.obligatoriosDelta || []).forEach(function (key) {
    if (key === 'geo') return;
    ok('obligatorio schema ' + canonId + ':' + key, cfg.obligatorios.indexOf(key) >= 0, key);
  });
});

Object.keys(LEGACY_TO_CANON).forEach(function (legacyId) {
  const canon = api.resolveCanonSubId(legacyId);
  ok('legacy → canon ' + legacyId, canon === LEGACY_TO_CANON[legacyId], canon);
  const form = CANON_SUBCATEGORIAS.find(function (c) { return c.subcategoriaId === canon; }).formularioId;
  const cfg = api.buildConfig({ sectorId: 'restaurantes', subcategoriaId: legacyId, formularioId: form });
  ok('legacy buildConfig ' + legacyId, cfg && cfg.canonSubcategoriaId === canon);
});

PACK_IDS.forEach(function (p) {
  ok('pack cubierto ' + p, packsSeen.has(p), [...packsSeen].join(','));
});

const barCfg = api.buildConfig({ sectorId: 'restaurantes', subcategoriaId: 'bares', formularioId: 'negocio_empresa' });
ok('bares permisoVentaAlcohol', JSON.stringify(barCfg.blocks).indexOf('permisoVentaAlcohol') >= 0);
ok('bares restauranteBarGastronomico', JSON.stringify(barCfg.blocks).indexOf('restauranteBarGastronomico') >= 0);

const darkCfg = api.buildConfig({ sectorId: 'restaurantes', subcategoriaId: 'dark-kitchen', formularioId: 'negocio_empresa' });
ok('dark kitchen privada', JSON.stringify(darkCfg.blocks).indexOf('direccionOperacionPrivada') >= 0);

const truckCfg = api.buildConfig({ sectorId: 'restaurantes', subcategoriaId: 'food-trucks-gastronomia', formularioId: 'negocio_empresa' });
ok('food truck eventos campo', JSON.stringify(truckCfg.blocks).indexOf('aceptaEventosPrivados') >= 0);

const barErr = api.validateGastronomiaSectorValues({
  ventaAlcohol: true,
  permisoVentaAlcohol: false,
  politicaMenoresAlcohol: '',
  disclaimerReguladoGastronomia: false,
}, { sectorId: 'restaurantes', subcategoriaId: 'bares' });
ok('validatePackBAR detecta', barErr.length >= 2, barErr.join('; '));

const darkErr = api.validateGastronomiaSectorValues({
  modeloOperacion: 'dark_kitchen',
  direccionOperacionPrivada: '',
  mostrarSoloZonaPublica: false,
  permisoManipulacionAlimentos: true,
}, { sectorId: 'restaurantes', subcategoriaId: 'dark-kitchen' });
ok('validatePackDELIVERY dark', darkErr.length >= 1, darkErr.join('; '));

const foodErr = api.validateGastronomiaSectorValues({
  permisoManipulacionAlimentos: false,
}, { sectorId: 'restaurantes', subcategoriaId: 'taquerias' });
ok('validatePackFOOD permiso', foodErr.some(function (m) { return /manipulaci/i.test(m); }));

const perfil = api.buildGastronomiaPerfil({ alias: 'Chef Test', precioDesdeMx: '1500', unidadCotizacion: 'evento' }, 'chef-cocinero-domicilio', 'PRO_SERVICE');
ok('gastronomiaPerfil nested', perfil.canonSubcategoriaId === 'chef-cocinero-domicilio' && perfil.deltaPack === 'PRO_SERVICE');
ok('nested key constant', GASTRONOMIA_NESTED_PROFILE_KEY === 'gastronomiaPerfil');

const legacyBar = api.buildConfig({ sectorId: 'restaurantes', subcategoriaId: 'restaurante-bar', formularioId: 'negocio_empresa' });
ok('restaurante-bar → bares', legacyBar.canonSubcategoriaId === 'bares');

const menuUrlBad = api.validateGastronomiaSectorValues(
  { menuUrl: 'javascript:alert(1)', permisoManipulacionAlimentos: true },
  { sectorId: 'restaurantes', subcategoriaId: 'taquerias' }
);
ok('menuUrl bloquea javascript:', menuUrlBad.some(function (m) { return /URL de menú/i.test(m); }));

const menuUrlOk = api.validateGastronomiaSectorValues(
  { menuUrl: 'https://ejemplo.com/menu.pdf', permisoManipulacionAlimentos: true },
  { sectorId: 'restaurantes', subcategoriaId: 'taquerias' }
);
ok('menuUrl acepta https', !menuUrlOk.some(function (m) { return /URL de menú/i.test(m); }));

const perfilPriv = api.buildGastronomiaPerfil(
  { direccionOperacionPrivada: 'CALLE_SECRETA', permisoVentaAlcohol: true, modeloOperacion: 'dark_kitchen' },
  'dark-kitchen',
  'DELIVERY'
);
const pub = api.sanitizeGastronomiaPerfilForPublic(perfilPriv);
ok('preview strip direccion privada', !pub.direccionOperacionPrivada && !pub.permisoVentaAlcohol);
ok('preview strip mantiene zona publica', pub.modeloOperacion === 'dark_kitchen');

const tradCfg = api.buildConfig({ sectorId: 'restaurantes', subcategoriaId: 'restaurantes-tradicional', formularioId: 'negocio_empresa' });
ok('menuUrl en tradicional', JSON.stringify(tradCfg.blocks).indexOf('menuUrl') >= 0);
ok('nivelRuido en tradicional', JSON.stringify(tradCfg.blocks).indexOf('nivelRuido') >= 0);

const motorPath = path.join(root, 'public/js/carihub-registro-public-blocks.js');
const motorSrc = fs.readFileSync(motorPath, 'utf8');
ok('PROFILE_NESTED_KEYS gastronomiaPerfil', motorSrc.indexOf("'gastronomiaPerfil'") >= 0);
ok('matchesGastronomiaSector wired', motorSrc.indexOf('matchesGastronomiaSector') >= 0);
ok('resolveConfig gastronomia', motorSrc.indexOf('resolveGastronomiaSectorConfig') >= 0);
ok('registro-perfil script tag', fs.readFileSync(path.join(root, 'public/registro-perfil.html'), 'utf8').indexOf('registro-gastronomia-blocks.js') >= 0);

ok('eventos no match restaurantes', !motorSrc.includes("sectorId === 'restaurantes'") || motorSrc.indexOf('matchesGastronomiaSector') >= 0);

fieldCounts.sort(function (a, b) { return b.count - a.count; });
console.log('\n--- Conteo campos blocks (top 5) ---');
fieldCounts.slice(0, 5).forEach(function (r) { console.log(r.canonId, r.count, r.pack); });
console.log('--- mínimo ---', fieldCounts[fieldCounts.length - 1].canonId, fieldCounts[fieldCounts.length - 1].count);

console.log('\n=== QA MP-GASTRONOMIA BLOCKS Fase 2 ===');
console.log('PASS:', pass.length);
console.log('FAIL:', fail.length);
if (fail.length) {
  fail.slice(0, 30).forEach(function (f) {
    console.log('  FAIL:', f.name, f.detail || '');
  });
  process.exit(1);
}
console.log('OK — 24 canon + legacy + validadores gastronomía');
