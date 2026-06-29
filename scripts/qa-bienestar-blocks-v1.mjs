/**
 * QA — MP-BIENESTAR-DELTAS-V1 Fase 2 blocks (sin browser).
 * node scripts/qa-bienestar-blocks-v1.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { SUB_TO_PACK, PACK_H_SUBS } from './bienestar-packs-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

const ctx = vm.createContext({ window: {}, globalThis: {} });
ctx.window = ctx;
const code = fs.readFileSync(path.join(root, 'public/js/data/registro-bienestar-blocks.js'), 'utf8');
vm.runInContext(code, ctx, { filename: 'registro-bienestar-blocks.js' });
const api = ctx.window.CARIHUB_REGISTRO_BIENESTAR_SECTOR_BLOCKS;

ok('API expuesta', !!api && typeof api.buildConfig === 'function');

const packsSeen = new Set();
Object.keys(SUB_TO_PACK).forEach(function (subId) {
  var cfg = api.buildConfig({ sectorId: 'bienestar', subcategoriaId: subId, formularioId: 'persona_independiente' });
  var pack = cfg.deltaPack;
  packsSeen.add(pack);
  ok('pack ' + subId + ' → ' + SUB_TO_PACK[subId], pack === SUB_TO_PACK[subId], pack);
  ok('obligatorios ' + subId, Array.isArray(cfg.obligatorios) && cfg.obligatorios.length > 0);
  ok('blocks ' + subId, Array.isArray(cfg.blocks) && cfg.blocks.length > 0);
  cfg.obligatorios.forEach(function (key) {
    var found = false;
    cfg.blocks.forEach(function (block) {
      block.fields.forEach(function (field) {
        if (field.id === key) found = true;
      });
    });
    ok('campo obligatorio ' + pack + ':' + key + ' (' + subId + ')', found, key);
  });
});

['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach(function (p) {
  ok('pack cubierto ' + p, packsSeen.has(p), [...packsSeen].join(','));
});

var retailCfg = api.buildConfig({
  sectorId: 'bienestar',
  subcategoriaId: 'venta-de-inciensos',
  formularioId: 'negocio_empresa',
});
ok('retail negocio D', retailCfg.deltaPack === 'D' && retailCfg.negocioRetail === true);
ok('retail sin envio field', !JSON.stringify(retailCfg.blocks).includes('envioDomicilio'));

PACK_H_SUBS.forEach(function (subId) {
  var cfg = api.buildConfig({ sectorId: 'bienestar', subcategoriaId: subId, formularioId: 'persona_independiente' });
  ok('pack H flags ' + subId, cfg.packFlags.sensible && cfg.packFlags.regulada && cfg.packFlags.requiresAdminReview);
  ok('pack H disclaimer field ' + subId, cfg.obligatorios.indexOf('disclaimerRegulado') >= 0);
  var blob = JSON.stringify(cfg.blocks);
  api.packHProhibitedFieldIds.forEach(function (fid) {
    ok('pack H no render ' + fid + ' (' + subId + ')', blob.indexOf('"id":"' + fid + '"') < 0, fid);
  });
});

var hErrorsGood = api.validatePackH({
  disclaimerRegulado: true,
  edadMinimaServicio: '18',
  jurisdiccionDeclarada: 'MX-Oaxaca',
  contraindicacionesObligatorias: 'No apto embarazo',
  tipoExperienciaCeremonial: 'consulta_fechas',
  acompanamientoCeremonial: ['Antes'],
  requisitosPrevios: 'Ayuno',
  fechasCeremonia: 'Consultar',
  cupoCeremonia: '8',
  lugarCeremonia: 'Centro',
  tarifaDesde: 'Consultar contribución',
  alias: 'Guía ceremonial'
});
ok('validatePackH OK sample', hErrorsGood.length === 0, hErrorsGood.join('; '));

var hErrorsBad = api.validatePackH({
  disclaimerRegulado: false,
  edadMinimaServicio: '16',
  tarifaDesde: 'venta directa de ayahuasca con envío',
  catalogoProductos: 'x'
});
ok('validatePackH detecta violaciones', hErrorsBad.length >= 3, String(hErrorsBad.length));

var commercial = api.scanPackHCommercialText({ tagline: 'envío a domicilio de rapé' });
ok('scanPackHCommercialText', commercial.length >= 1);

console.log('\n=== QA MP-BIENESTAR BLOCKS Fase 2 ===');
console.log('PASS:', pass.length);
console.log('FAIL:', fail.length);
if (fail.length) {
  fail.slice(0, 25).forEach(function (f) {
    console.log('  FAIL:', f.name, f.detail || '');
  });
  process.exit(1);
}
console.log('OK — packs A–H blocks');
