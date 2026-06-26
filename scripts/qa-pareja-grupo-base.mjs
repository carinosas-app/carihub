/**
 * QA — shell base pareja_grupo (sin browser).
 * node scripts/qa-pareja-grupo-base.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', 'public', 'js');

function loadScript(relativePath, ctx) {
  const code = fs.readFileSync(path.join(root, relativePath), 'utf8');
  try {
    vm.runInContext(code, ctx, { filename: relativePath });
  } catch (e) {
    throw new Error(relativePath + ': ' + e.message);
  }
}

function makeCtx() {
  const ctx = {
    console,
    document: {
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
    },
  };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  return ctx;
}

const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

function loadAll() {
  const ctx = makeCtx();
  loadScript('carihub-viajes-desplazamiento.js', ctx);
  loadScript('data/registro-adultos-pareja-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  loadScript('carihub-field-engine-lite.js', ctx);
  return ctx;
}

function swingerCtx() {
  return { subcategoriaId: 'swinger', subcategoria: 'swinger', arquetipo: 'pareja_grupo' };
}

function shellOnlyCtx() {
  return { subcategoriaId: 'cuckold', subcategoria: 'Cuckold', arquetipo: 'pareja_grupo' };
}

function baseMembers() {
  return [
    { etiquetaPublica: 'Él', generoPresentacion: 'Hombre', edad: 38 },
    { etiquetaPublica: 'Ella', generoPresentacion: 'Mujer', franjaEdad: '25-34' },
  ];
}

function baseValues(extra = {}) {
  return {
    aliasPareja: 'Pareja QA',
    alias: 'Pareja QA',
    configuracionGrupo: 'pareja_hm',
    miembros: baseMembers(),
    reglasAcceso: 'Solo mayores de edad · cita previa',
    modalidades: ['recibe'],
    metodosPago: ['Efectivo'],
    horarioDetalle: 'Vie–Dom 20:00–02:00',
    sobreMi: 'Pareja abierta y respetuosa.',
    ...extra,
  };
}

function simulateCollect(vmCtx, values) {
  const V = vmCtx.CariHubViajesDesplazamiento;
  const RP = vmCtx.CariHubRegistroPublicBlocks;
  let out = { ...values };
  out = RP.finalizeParejaGrupoValues(out);
  out.viajesDesplazamiento = V.buildViajesDesplazamiento(out, out.modalidades || []);
  if (!out.viajesDesplazamiento.viaja) {
    V.viajesFieldIds().forEach((k) => delete out[k]);
  }
  if (out.haceColaboraciones !== 'Sí') delete out.colaboraCon;
  return out;
}

let ctx;

try {
  ctx = loadAll();
  const RP = ctx.CariHubRegistroPublicBlocks;
  const CFG = ctx.CARIHUB_REGISTRO_PAREJA_BLOCKS;
  const userCtx = swingerCtx();
  const shellCtx = shellOnlyCtx();

  ok('load módulos', !!(CFG && RP), 'pareja blocks + motor');
  ok('matchesPareja por arquetipo', RP.matchesPareja(shellCtx, null) === true, 'cuckold shell');

  const merged = RP.mergedConfig(CFG, userCtx);
  const baseBlock = merged.blocks.find((b) => b.id === 'parejaGrupoBase');
  ok('bloque parejaGrupoBase', !!baseBlock, baseBlock ? baseBlock.fields.map((f) => f.id).join(', ') : '');

  const baseFieldIds = baseBlock.fields.map((f) => f.id);
  ok('campos shell base', ['configuracionGrupo', 'miembros', 'reglasAcceso'].every((id) => baseFieldIds.includes(id)), baseFieldIds.join(', '));

  ok('swinger sin tipoPareja delta', !merged.blocks.find((b) => b.id === 'swingerPerfil')?.fields.some((f) => f.id === 'tipoPareja'), 'tipoPareja movido a base');

  ok('metodosPago en blocks', merged.blocks.some((b) => b.id === 'metodosPago'), 'bloque pago');

  ok('fotosMin pareja', RP.getFotosMin(userCtx) === 4, String(RP.getFotosMin(userCtx)));

  ok('UI pareja_grupo oculta servicios', ctx.CariHubFieldEngineLite.UI_BY_ARQUETIPO.pareja_grupo.hide.includes('servicios'), 'hide servicios');

  const privSource = fs.readFileSync(path.join(root, 'carihub-private-fields-lite.js'), 'utf8');
  ok('consentimientoDual privado pareja', /pareja_grupo:[\s\S]*consentimientoDual/.test(privSource), 'spec pareja_grupo');

  const vals = baseValues();
  const missOk = RP.validateValues(CFG, vals, shellCtx);
  ok('validación shell mínima ok', missOk.length === 0, missOk.join('; '));

  const missAlias = RP.validateValues(CFG, { ...vals, aliasPareja: '', alias: '' }, shellCtx);
  ok('alias obligatorio', missAlias.some((m) => /alias/i.test(m)), missAlias.join('; '));

  const missAliasShort = RP.validateValues(CFG, { ...vals, aliasPareja: 'AB', alias: 'AB' }, shellCtx);
  ok('alias mínimo 3 caracteres', missAliasShort.some((m) => /mínimo 3/i.test(m)), missAliasShort.join('; '));

  const missReglas = RP.validateValues(CFG, {
    ...vals,
    reglasAcceso: 'x'.repeat(501),
  }, shellCtx);
  ok('reglasAcceso máximo 500', missReglas.some((m) => /máximo 500/i.test(m)), missReglas.join('; '));

  const missMaxPareja = RP.validateValues(CFG, {
    ...vals,
    miembros: [
      baseMembers()[0],
      baseMembers()[1],
      { etiquetaPublica: 'Extra', generoPresentacion: 'Hombre', edad: 30 },
    ],
  }, shellCtx);
  ok('máximo 2 integrantes pareja', missMaxPareja.some((m) => /máximo 2/i.test(m)), missMaxPareja.join('; '));

  const missConfig = RP.validateValues(CFG, { ...vals, configuracionGrupo: '' }, shellCtx);
  ok('configuración obligatoria', missConfig.some((m) => /configuraci/i.test(m)), missConfig.join('; '));

  const missMembers = RP.validateValues(CFG, { ...vals, miembros: [baseMembers()[0]] }, shellCtx);
  ok('mínimo 2 integrantes pareja', missMembers.some((m) => /integrante/i.test(m)), missMembers.join('; '));

  const missGrupo = RP.validateValues(CFG, {
    ...vals,
    configuracionGrupo: 'grupo',
    miembros: baseMembers(),
  }, shellCtx);
  ok('mínimo 3 si grupo', missGrupo.some((m) => /integrante/i.test(m)), missGrupo.join('; '));

  const missAge = RP.validateValues(CFG, {
    ...vals,
    miembros: [{ etiquetaPublica: 'A', generoPresentacion: 'Hombre' }, { etiquetaPublica: 'B', generoPresentacion: 'Mujer' }],
  }, shellCtx);
  ok('edad/franja obligatoria', missAge.some((m) => /edad/i.test(m)), missAge.join('; '));

  const missPago = RP.validateValues(CFG, { ...vals, metodosPago: [] }, shellCtx);
  ok('métodos de pago obligatorios', missPago.some((m) => /pago/i.test(m)), missPago.join('; '));

  const collected = simulateCollect(ctx, vals);
  ok('parejaGrupoPerfil generado', collected.parejaGrupoPerfil && collected.parejaGrupoPerfil.configuracionGrupo === 'pareja_hm', JSON.stringify(collected.parejaGrupoPerfil));

  ok('alias espejo legacy', collected.alias === 'Pareja QA' && collected.aliasPareja === 'Pareja QA', JSON.stringify({ alias: collected.alias, aliasPareja: collected.aliasPareja }));

  ok('tipoPareja legacy desde config', collected.tipoPareja === 'Hombre + Mujer', collected.tipoPareja);

  ok('miembrosResumen', collected.miembrosResumen.includes('Él') && collected.miembrosResumen.includes('Ella'), collected.miembrosResumen);

  ok('tipoPerfil pareja_grupo', collected.tipoPerfil === 'pareja_grupo', collected.tipoPerfil);

  const perf = RP.mapToPerfil({ subcategoriaId: 'swinger' }, collected, userCtx);
  ok('mapToPerfil shell', perf.aliasPareja === 'Pareja QA' && perf.configuracionGrupo === 'pareja_hm', JSON.stringify({
    aliasPareja: perf.aliasPareja,
    configuracionGrupo: perf.configuracionGrupo,
  }));
  ok('mapToPerfil miembros', Array.isArray(perf.miembros) && perf.miembros.length === 2, String(perf.miembros?.length));
  ok('mapToPerfil reglasAcceso', perf.reglasAcceso === vals.reglasAcceso, perf.reglasAcceso);

  const card = ctx.CariHubPublicRenderLite.cardHTMLPareja({
    ...perf,
    subcategoriaId: 'cuckold',
    subcategoria: 'Cuckold',
    tagline: 'Pareja abierta',
    precio: 'Consultar',
    modalidades: ['recibe'],
    miembrosResumen: collected.miembrosResumen,
  }, {});
  ok('tarjeta aliasPareja', card.includes('Pareja QA'), 'nombre tarjeta');
  ok('tarjeta chip config', card.includes('Hombre + Mujer'), 'config chip');
  ok('tarjeta miembros resumen', card.includes('Él') && card.includes('Ella'), 'integrantes');
  ok('tarjeta clase pareja', card.includes('res-card--pareja'), 'css');
} catch (e) {
  fail.push({ name: 'exception', detail: e.message + (e.stack ? '\n' + e.stack.split('\n')[1] : '') });
}

console.log('\n=== QA Pareja Grupo Base (A1) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
