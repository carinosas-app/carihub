/**
 * QA mínima — delta pareja swinger (sin browser).
 * node scripts/qa-pareja-swinger.mjs
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
  loadScript('data/registro-adultos-escort-blocks.js', ctx);
  loadScript('data/registro-adultos-pareja-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  return ctx;
}

function swingerCtx() {
  return { subcategoriaId: 'swinger', subcategoria: 'swinger' };
}

function mergedPareja(vmCtx, userCtx) {
  const cfg = vmCtx.CARIHUB_REGISTRO_PAREJA_BLOCKS;
  return vmCtx.CariHubRegistroPublicBlocks.mergedConfig(cfg, userCtx);
}

function simulateCollect(vmCtx, values) {
  const V = vmCtx.CariHubViajesDesplazamiento;
  const out = { ...values };
  out.viajesDesplazamiento = V.buildViajesDesplazamiento(out, out.modalidades || []);
  if (!out.viajesDesplazamiento.viaja) {
    V.viajesFieldIds().forEach((k) => delete out[k]);
  }
  if (out.haceColaboraciones !== 'Sí') delete out.colaboraCon;
  if (!out.mostrarAtiendenA) out.mostrarAtiendenA = 'Sí';
  if (!out.mostrarColaboraciones) out.mostrarColaboraciones = 'Sí';
  if (!out.mostrarObjetivosPerfil) out.mostrarObjetivosPerfil = 'Sí';
  return out;
}

function simulateValidate(vmCtx, userCtx, values) {
  const cfg = vmCtx.CARIHUB_REGISTRO_PAREJA_BLOCKS;
  return vmCtx.CariHubRegistroPublicBlocks.validateValues(cfg, values, userCtx);
}

function simulateMapToPerfil(vmCtx, userCtx, bloques) {
  const u = { subcategoriaId: 'swinger', pais: 'México', ciudad: 'CDMX' };
  return vmCtx.CariHubRegistroPublicBlocks.mapToPerfil(u, bloques, userCtx);
}

let ctx;

try {
  ctx = loadAll();
  const RP = ctx.CariHubRegistroPublicBlocks;
  const V = ctx.CariHubViajesDesplazamiento;
  const userCtx = swingerCtx();

  ok('load módulos', !!(ctx.CARIHUB_REGISTRO_PAREJA_BLOCKS && RP && V), 'pareja blocks + motor');

  ok('resolveConfig swinger', RP.resolveConfig(userCtx, null) === ctx.CARIHUB_REGISTRO_PAREJA_BLOCKS, 'cfg pareja');
  ok('matchesPareja', RP.matchesPareja(userCtx, null) === true, 'match');
  ok('matchesEscort false', RP.matchesEscort(userCtx, null) === false, 'no escort');

  ok('viajes activo swinger', V.subcategoriaActivaViajes('swinger') === true, 'swinger en viajes');

  const merged = mergedPareja(ctx, userCtx);
  const swBlock = merged.blocks.find((b) => b.id === 'swingerPerfil');
  ok('bloque swingerPerfil', !!swBlock, swBlock ? swBlock.fields.length + ' campos' : '');

  const fieldIds = swBlock.fields.map((f) => f.id);
  ok('campos obligatorios swinger', [
    'objetivosPerfil', 'tipoInteraccion', 'tipoPareja', 'atiendenA',
    'aceptanSolteros', 'haceColaboraciones', 'colaboraCon'
  ].every((id) => fieldIds.includes(id)), fieldIds.join(', '));

  const colabField = swBlock.fields.find((f) => f.id === 'colaboraCon');
  ok('colaboraCon solo si Sí', colabField.showWhen.values.join(',') === 'Sí', JSON.stringify(colabField.showWhen));

  ok('fotosMin pareja', RP.getFotosMin(userCtx) === 4, String(RP.getFotosMin(userCtx)));

  const baseVals = {
    objetivosPerfil: ['Conocer otras parejas'],
    tipoInteraccion: ['Intercambio de parejas'],
    tipoPareja: 'Hombre + Mujer',
    atiendenA: 'Parejas',
    aceptanSolteros: 'No',
    haceColaboraciones: 'No',
    modalidades: ['recibe'],
  };
  const missBase = simulateValidate(ctx, userCtx, baseVals);
  ok('validación mínima ok', missBase.length === 0, missBase.join('; '));

  const missReq = simulateValidate(ctx, userCtx, { modalidades: ['recibe'] });
  ok('faltan obligatorios', missReq.length >= 5, missReq.join('; '));

  const colabSi = simulateCollect(ctx, {
    ...baseVals,
    haceColaboraciones: 'Sí',
    colaboraCon: ['Parejas', 'Escorts'],
  });
  ok('colaboraCon persistido si Sí', Array.isArray(colabSi.colaboraCon) && colabSi.colaboraCon.length === 2, JSON.stringify(colabSi.colaboraCon));

  const colabNo = simulateCollect(ctx, {
    ...baseVals,
    haceColaboraciones: 'No',
    colaboraCon: ['Parejas'],
  });
  ok('colaboraCon limpiado si No', colabNo.colaboraCon == null, JSON.stringify(colabNo));

  const viajaOn = simulateCollect(ctx, {
    ...baseVals,
    modalidades: ['viaja'],
    alcanceDesplazamiento: 'toda_ciudad',
    viajesProgramados: 'si',
    gastosTraslado: 'se_acuerda',
    anticipacionViaje: '48h',
  });
  ok('viajes swinger on', viajaOn.viajesDesplazamiento.viaja === true, JSON.stringify(viajaOn.viajesDesplazamiento));

  const perf = simulateMapToPerfil(ctx, userCtx, colabSi);
  ok('mapToPerfil campos', perf.atiendenA === 'Parejas' && perf.tipoPareja === 'Hombre + Mujer', JSON.stringify({
    atiendenA: perf.atiendenA,
    tipoPareja: perf.tipoPareja,
  }));

  const cardOn = ctx.CariHubPublicRenderLite.cardHTMLPareja({
    ...perf,
    nombre: 'Pareja Demo',
    tagline: 'Pareja abierta y respetuosa',
    precio: 'Consultar',
    modalidades: ['recibe', 'viaja'],
    viajesDesplazamiento: viajaOn.viajesDesplazamiento,
    haceColaboraciones: 'Sí',
    mostrarColaboraciones: 'Sí',
    mostrarAtiendenA: 'Sí',
    mostrarObjetivosPerfil: 'Sí',
    objetivosPerfil: ['Conocer otras parejas'],
  }, {});
  ok('tarjeta pareja render', cardOn.includes('res-card--pareja') && cardOn.includes('Atienden a'), 'html');
  ok('tarjeta chip Viaja', cardOn.includes('>Viaja<'), 'chip viaja');

  const cardHidden = ctx.CariHubPublicRenderLite.cardHTMLPareja({
    ...perf,
    nombre: 'Pareja Demo',
    tagline: 'Test',
    mostrarAtiendenA: 'No',
    mostrarColaboraciones: 'No',
    mostrarObjetivosPerfil: 'No',
    atiendenA: 'Todos',
    haceColaboraciones: 'Sí',
    objetivosPerfil: ['Conocer otras parejas'],
  }, {});
  ok('visibilidad oculta tarjeta', !cardHidden.includes('Atienden a') && !cardHidden.includes('Objetivos:'), 'sin líneas públicas');
} catch (e) {
  fail.push({ name: 'exception', detail: e.message });
}

console.log('\n=== QA Pareja Swinger ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
