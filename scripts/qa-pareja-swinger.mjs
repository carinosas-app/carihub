/**
 * QA — delta pareja swinger A2.1 (sin browser).
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

function baseShell() {
  return {
    aliasPareja: 'Pareja Demo',
    alias: 'Pareja Demo',
    configuracionGrupo: 'pareja_hm',
    miembros: [
      { etiquetaPublica: 'Él', generoPresentacion: 'Hombre', edad: 38 },
      { etiquetaPublica: 'Ella', generoPresentacion: 'Mujer', edad: 36 },
    ],
    metodosPago: ['Efectivo'],
  };
}

function swingerDelta() {
  return {
    objetivosPerfil: ['Conocer parejas'],
    intercambioSwinger: 'A convenir',
    tipoInteraccion: ['Intercambio swinger'],
    modalidadInteraccion: ['Discreta'],
    atiendenA: 'Parejas',
    haceColaboraciones: 'No',
    modalidades: ['recibe'],
  };
}

function simulateCollect(vmCtx, values) {
  const V = vmCtx.CariHubViajesDesplazamiento;
  const RP = vmCtx.CariHubRegistroPublicBlocks;
  let out = Object.assign({}, values);
  out = RP.finalizeParejaSwingerValues(out);
  out = RP.finalizeParejaGrupoValues(out);
  out.viajesDesplazamiento = V.buildViajesDesplazamiento(out, out.modalidades || []);
  if (!out.viajesDesplazamiento.viaja) {
    V.viajesFieldIds().forEach((k) => delete out[k]);
  }
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

  const merged = mergedPareja(ctx, userCtx);
  const swBlock = merged.blocks.find((b) => b.id === 'swingerPerfil');
  const fieldIds = swBlock.fields.map((f) => f.id);

  ok('campos A2 swinger', [
    'objetivosPerfil', 'intercambioSwinger', 'tipoInteraccion', 'modalidadInteraccion',
    'atiendenA', 'haceColaboraciones', 'colaboraCon', 'estiloPareja',
    'mostrarObjetivosPerfil', 'mostrarAtiendenA', 'mostrarColaboraciones',
  ].every((id) => fieldIds.includes(id)), fieldIds.join(', '));

  ok('sin tipoPareja en delta', !fieldIds.includes('tipoPareja'), 'shell A1');

  const colabField = swBlock.fields.find((f) => f.id === 'colaboraCon');
  ok('colaboraCon visible Sí o A convenir', colabField.showWhen.values.join(',') === 'Sí,A convenir', JSON.stringify(colabField.showWhen));

  ok('aceptanSolteros opcional', swBlock.fields.find((f) => f.id === 'aceptanSolteros')?.required === false, 'no required');

  const oblig = merged.obligatorios || [];
  ok('obligatorios delta', [
    'objetivosPerfil', 'intercambioSwinger', 'tipoInteraccion', 'modalidadInteraccion', 'atiendenA', 'haceColaboraciones',
  ].every((k) => oblig.includes(k)), oblig.join(', '));
  ok('aceptanSolteros no obligatorio', !oblig.includes('aceptanSolteros'), oblig.join(', '));

  const baseVals = { ...baseShell(), ...swingerDelta() };
  const missBase = simulateValidate(ctx, userCtx, baseVals);
  ok('validación mínima ok', missBase.length === 0, missBase.join('; '));

  const missInter = simulateValidate(ctx, userCtx, { ...baseVals, intercambioSwinger: '' });
  ok('intercambioSwinger obligatorio', missInter.some((m) => /intercambio/i.test(m)), missInter.join('; '));

  const missMod = simulateValidate(ctx, userCtx, { ...baseVals, modalidadInteraccion: [] });
  ok('modalidadInteraccion obligatorio', missMod.some((m) => /modalidad/i.test(m)), missMod.join('; '));

  const missColab = simulateValidate(ctx, userCtx, {
    ...baseVals,
    haceColaboraciones: 'Sí',
    colaboraCon: [],
  });
  ok('colaboraCon obligatorio si Sí', missColab.some((m) => /colaboran con/i.test(m)), missColab.join('; '));

  const okConvenir = simulateValidate(ctx, userCtx, {
    ...baseVals,
    haceColaboraciones: 'A convenir',
    colaboraCon: [],
  });
  ok('colaboraCon opcional si A convenir', okConvenir.length === 0, okConvenir.join('; '));

  const colabSi = simulateCollect(ctx, {
    ...baseVals,
    haceColaboraciones: 'Sí',
    colaboraCon: ['Parejas', 'Unicorns'],
  });
  ok('swingerPerfil generado', colabSi.swingerPerfil && colabSi.swingerPerfil.intercambioSwinger === 'A convenir', JSON.stringify(colabSi.swingerPerfil));
  ok('objetivoPrincipal', colabSi.objetivoPrincipal === 'Conocer parejas', colabSi.objetivoPrincipal);

  const colabNo = simulateCollect(ctx, {
    ...baseVals,
    haceColaboraciones: 'No',
    colaboraCon: ['Parejas'],
  });
  ok('colaboraCon limpiado si No', colabNo.colaboraCon == null, JSON.stringify(colabNo.colaboraCon));

  const colabConvenir = simulateCollect(ctx, {
    ...baseVals,
    haceColaboraciones: 'A convenir',
    colaboraCon: ['Escorts'],
  });
  ok('colaboraCon persistido si A convenir', Array.isArray(colabConvenir.colaboraCon) && colabConvenir.colaboraCon.length === 1, JSON.stringify(colabConvenir.colaboraCon));

  const perf = simulateMapToPerfil(ctx, userCtx, colabSi);
  ok('mapToPerfil delta', perf.intercambioSwinger === 'A convenir' && perf.modalidadInteraccion?.[0] === 'Discreta', JSON.stringify({
    intercambioSwinger: perf.intercambioSwinger,
    modalidadInteraccion: perf.modalidadInteraccion,
  }));
  ok('mapToPerfil swingerPerfil nested', perf.swingerPerfil && perf.swingerPerfil.atiendenA === 'Parejas', JSON.stringify(perf.swingerPerfil));
  ok('sin deltaSwinger legacy', perf.deltaSwinger == null, 'solo swingerPerfil');

  ok('shell + swinger compat', colabSi.parejaGrupoPerfil && colabSi.tipoPareja === 'Hombre + Mujer', 'ok');
} catch (e) {
  fail.push({ name: 'exception', detail: e.message });
}

console.log('\n=== QA Pareja Swinger A2.1 ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
