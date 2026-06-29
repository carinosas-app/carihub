/**
 * QA — MP-EVENTOS-DELTAS-V1 Fase 2 blocks (sin browser).
 * node scripts/qa-eventos-blocks-v1.mjs
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
} from './eventos-packs-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

const ctx = vm.createContext({ window: {}, globalThis: {} });
ctx.window = ctx;
const blocksCode = fs.readFileSync(path.join(root, 'public/js/data/registro-eventos-blocks.js'), 'utf8');
vm.runInContext(blocksCode, ctx, { filename: 'registro-eventos-blocks.js' });
const api = ctx.window.CARIHUB_REGISTRO_EVENTOS_SECTOR_BLOCKS;

ok('API expuesta', !!api && typeof api.buildConfig === 'function');
ok('legacyToCanon 37', Object.keys(api.legacyToCanon || {}).length === 37);
ok('canon 20', (api.canonSubcategorias || []).length === 20);

const packsSeen = new Set();
const genericBlob = [];

CANON_SUBCATEGORIAS.forEach(function (c) {
  const canonId = c.subcategoriaId;
  const cfg = api.buildConfig({
    sectorId: 'eventos',
    subcategoriaId: canonId,
    formularioId: c.formularioId,
  });
  const pack = cfg.deltaPack;
  packsSeen.add(pack);
  ok('pack ' + canonId + ' → ' + SUB_TO_PACK[canonId], pack === SUB_TO_PACK[canonId], pack);
  ok('canon id cfg ' + canonId, cfg.canonSubcategoriaId === canonId);
  ok('blocks ' + canonId, Array.isArray(cfg.blocks) && cfg.blocks.length >= 2, String(cfg.blocks.length));
  ok('blockTitle delta ' + canonId, cfg.blocks.some(function (b) { return b.title === c.blockTitle; }));

  const blob = JSON.stringify(cfg.blocks);
  genericBlob.push(blob);
  api.genericForbiddenIds.forEach(function (fid) {
    ok('no genérico ' + fid + ' (' + canonId + ')', blob.indexOf('"id":"' + fid + '"') < 0, fid);
  });

  const delta = SUB_DELTAS[canonId];
  (delta.obligatoriosDelta || []).forEach(function (key) {
    if (key === 'geo') return;
    ok('obligatorio schema ' + canonId + ':' + key, cfg.obligatorios.indexOf(key) >= 0, key);
  });

  const fieldIds = [];
  cfg.blocks.forEach(function (block) {
    block.fields.forEach(function (field) {
      fieldIds.push(field.id);
    });
  });
  const specific = (delta.deltaFields || []).filter(function (f) {
    return GENERIC_ONLY_FORBIDDEN.indexOf(f) < 0;
  });
  ok('≥5 campos oficio ' + canonId, specific.length >= 5, String(fieldIds.length));
});

Object.keys(LEGACY_TO_CANON).forEach(function (legacyId) {
  const canon = api.resolveCanonSubId(legacyId);
  ok('legacy → canon ' + legacyId, canon === LEGACY_TO_CANON[legacyId], canon);
  const cfg = api.buildConfig({
    sectorId: 'eventos',
    subcategoriaId: legacyId,
    formularioId: CANON_SUBCATEGORIAS.find(function (c) { return c.subcategoriaId === canon; }).formularioId,
  });
  ok('legacy buildConfig ' + legacyId, cfg && cfg.canonSubcategoriaId === canon);
  ok('legacy flag ' + legacyId, cfg.legacyResolvedFrom === legacyId || cfg.legacyResolvedFrom === legacyId.replace(/_/g, '-'));
});

[
  'VENUE', 'PROD', 'CREATIVE', 'MUSIC', 'SHOW', 'FOOD', 'RENTAL', 'FLORAL', 'FX', 'SECURITY', 'VALET', 'TRANSPORT',
].forEach(function (p) {
  ok('pack cubierto ' + p, packsSeen.has(p), [...packsSeen].join(','));
});

const faraCfg = api.buildConfig({ sectorId: 'eventos', subcategoriaId: 'grupos-musicales-eventos', formularioId: 'persona_independiente' });
const faraBlob = JSON.stringify(faraCfg.blocks);
ok('Fara Fara field', faraBlob.indexOf('descripcionFormatoFaraFara') >= 0);
ok('Fara Fara showWhen', faraBlob.indexOf('fara_fara') >= 0);

const animCfg = api.buildConfig({ sectorId: 'eventos', subcategoriaId: 'animadores-maestros-ceremonia', formularioId: 'persona_independiente' });
const animBlob = JSON.stringify(animCfg.blocks);
ok('MC estiloCeremonia', animBlob.indexOf('estiloCeremonia') >= 0);
ok('Animador dinamicas', animBlob.indexOf('dinamicasOfrecidas') >= 0);

const showCfg = api.buildConfig({ sectorId: 'eventos', subcategoriaId: 'shows-para-eventos', formularioId: 'persona_independiente' });
ok('show contenidoSensible', JSON.stringify(showCfg.blocks).indexOf('contenidoSensible') >= 0);

const fotoCfg = api.buildConfig({ sectorId: 'eventos', subcategoriaId: 'fotografia-video-eventos', formularioId: 'persona_independiente' });
ok('foto licenciaDron', JSON.stringify(fotoCfg.blocks).indexOf('licenciaDron') >= 0);

const fxCfg = api.buildConfig({ sectorId: 'eventos', subcategoriaId: 'pirotecnia-efectos-especiales', formularioId: 'negocio_empresa' });
ok('FX flags', fxCfg.packFlags.regulada && fxCfg.packFlags.requiresAdminReview);

const fxErr = api.validateEventosSectorValues({
  tipoEfectoPirotecnia: ['fuegos_artificiales'],
  licenciaPirotecnia: false,
  jurisdiccionPirotecnia: '',
  polizaSeguroPirotecnia: false,
  disclaimerReguladoEventos: false,
}, { sectorId: 'eventos', subcategoriaId: 'pirotecnia-efectos-especiales' });
ok('validatePackFX detecta', fxErr.length >= 3, fxErr.join('; '));

const secErr = api.validateEventosSectorValues({
  licenciaSeguridadPrivada: false,
  elementosSeguridad: '',
  disclaimerReguladoEventos: false,
}, { sectorId: 'eventos', subcategoriaId: 'seguridad-eventos' });
ok('validatePackSECURITY detecta', secErr.length >= 2);

const showErr = api.validateEventosSectorValues({
  tipoShow: ['strippers'],
  contenidoSensible: false,
  disclaimerReguladoEventos: false,
  publicoObjetivo: 'adultos',
}, { sectorId: 'eventos', subcategoriaId: 'shows-para-eventos' });
ok('validatePackSHOW stripper', showErr.length >= 2);

const foodErr = api.validateEventosSectorValues({
  permisoManipulacionAlimentos: false,
  comensalesMax: 100,
  dietasEspeciales: ['vegetariano'],
}, { sectorId: 'eventos', subcategoriaId: 'banquetes-catering-eventos' });
ok('validatePackFOOD permiso', foodErr.some(function (m) { return /manipulaci/i.test(m); }));

const perfil = api.buildEventosPerfil({ alias: 'DJ Test', tipoAgrupacion: 'banda', unidadCotizacion: 'evento' }, 'grupos-musicales-eventos', 'MUSIC');
ok('eventosPerfil nested', perfil.canonSubcategoriaId === 'grupos-musicales-eventos' && perfil.deltaPack === 'MUSIC');

const motorPath = path.join(root, 'public/js/carihub-registro-public-blocks.js');
const motorSrc = fs.readFileSync(motorPath, 'utf8');
ok('PROFILE_NESTED_KEYS eventosPerfil', motorSrc.indexOf("'eventosPerfil'") >= 0);
ok('matchesEventosSector wired', motorSrc.indexOf('matchesEventosSector') >= 0);
ok('resolveConfig eventos', motorSrc.indexOf('resolveEventosSectorConfig') >= 0);
ok('registro-perfil script tag', fs.readFileSync(path.join(root, 'public/registro-perfil.html'), 'utf8').indexOf('registro-eventos-blocks.js') >= 0);

console.log('\n=== QA MP-EVENTOS BLOCKS Fase 2 ===');
console.log('PASS:', pass.length);
console.log('FAIL:', fail.length);
if (fail.length) {
  fail.slice(0, 30).forEach(function (f) {
    console.log('  FAIL:', f.name, f.detail || '');
  });
  process.exit(1);
}
console.log('OK — 20 canon + legacy + validadores');
