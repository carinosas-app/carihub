/**
 * QA Cuckold/Hotwife — motor blocks/validación/finalize/mapToPerfil (A4.1).
 * node scripts/qa-cuckold-hotwife.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', 'public', 'js');

function loadScript(relativePath, ctx) {
  const code = fs.readFileSync(path.join(root, relativePath), 'utf8');
  vm.runInContext(code, ctx, { filename: relativePath });
}

function makeCtx() {
  const ctx = {
    console,
    document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] },
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

function chCtx(id = 'cuckold hotwife') {
  return { subcategoriaId: id, subcategoria: 'Cuckold / Hotwife', arquetipo: 'pareja_grupo' };
}

function swingerCtx() {
  return { subcategoriaId: 'swinger', subcategoria: 'Swinger', arquetipo: 'pareja_grupo' };
}

function unicornCtx() {
  return { subcategoriaId: 'unicorns', subcategoria: 'Unicorns' };
}

function baseShell() {
  return {
    aliasPareja: 'Pareja CH QA',
    alias: 'Pareja CH QA',
    configuracionGrupo: 'pareja_hm',
    miembros: [
      { etiquetaPublica: 'Él', generoPresentacion: 'Hombre', edad: 40 },
      { etiquetaPublica: 'Ella', generoPresentacion: 'Mujer', edad: 38 },
    ],
    metodosPago: ['Efectivo'],
    modalidades: ['hotel'],
  };
}

function chDelta() {
  return {
    dinamica: 'hotwife',
    buscan: ['Bulls', 'Unicorns'],
    tipoExperiencia: ['Encuentros privados', 'Hotel / motel'],
    participacionPareja: 'Solo observa',
    haceColaboraciones: 'No',
  };
}

function simulateCollect(RP, V, values, ctx) {
  let out = Object.assign({}, values);
  out = RP.finalizeParejaSwingerValues(out, ctx);
  out = RP.finalizeUnicornValues(out, ctx);
  out = RP.finalizeCuckoldHotwifeValues(out, ctx);
  out = RP.finalizeParejaGrupoValues(out);
  out.viajesDesplazamiento = V.buildViajesDesplazamiento(out, out.modalidades || []);
  if (!out.viajesDesplazamiento.viaja) {
    V.viajesFieldIds().forEach((k) => delete out[k]);
  }
  return out;
}

let ctx;
try {
  ctx = makeCtx();
  loadScript('carihub-viajes-desplazamiento.js', ctx);
  loadScript('data/registro-adultos-escort-blocks.js', ctx);
  loadScript('data/registro-adultos-pareja-blocks.js', ctx);
  loadScript('data/registro-adultos-lifestyle-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);

  const RP = ctx.CariHubRegistroPublicBlocks;
  const V = ctx.CariHubViajesDesplazamiento;
  const CFG = ctx.CARIHUB_REGISTRO_PAREJA_BLOCKS;
  const userCtx = chCtx();
  const swingCtx = swingerCtx();
  const uniCtx = unicornCtx();

  ok('load módulos', !!(CFG && RP), 'pareja blocks');

  ok('resolveConfig C/H', RP.resolveConfig(userCtx, null) === CFG, 'cfg pareja');
  ok('matchesPareja', RP.matchesPareja(userCtx, null), 'match pareja');
  ok('isCuckoldHotwifeSubcategoria', RP.isCuckoldHotwifeSubcategoria(userCtx), 'sub id espacio');
  ok('isCuckoldHotwifeSubcategoria underscore', RP.isCuckoldHotwifeSubcategoria(chCtx('cuckold_hotwife')), 'sub id _');
  ok('no matchesLifestyle', !RP.matchesLifestyle(userCtx, null), 'not lifestyle');
  ok('viajes cuckold hotwife', V.subcategoriaActivaViajes('cuckold hotwife'), 'viajes activo');
  ok('viajes cuckold_hotwife', V.subcategoriaActivaViajes('cuckold_hotwife'), 'viajes id canon');

  const merged = RP.mergedConfig(CFG, userCtx);
  const block = merged.blocks.find((b) => b.id === 'cuckoldHotwifePerfil');
  ok('bloque cuckoldHotwifePerfil', !!block, block ? block.fields.length + ' campos' : '');

  const ids = block.fields.map((f) => f.id);
  ok(
    'campos clave',
    [
      'dinamica', 'buscan', 'mostrarBuscan', 'tipoExperiencia', 'participacionPareja',
      'mostrarParticipacion', 'aceptanSolteros', 'aceptanPrincipiantes',
      'experienciaEnLifestyle', 'haceColaboraciones', 'colaboraCon', 'mostrarColaboraciones',
    ].every((id) => ids.includes(id)),
    ids.join(', ')
  );

  const dinField = block.fields.find((f) => f.id === 'dinamica');
  ok(
    'dinamica opciones',
    dinField.options.length === 3
      && dinField.options.some((o) => o.value === 'ambos' && /flexible/i.test(o.label)),
    JSON.stringify(dinField.options)
  );

  const buscanField = block.fields.find((f) => f.id === 'buscan');
  ok('buscan incluye Bulls', buscanField.options.includes('Bulls'), buscanField.options.slice(0, 3).join(', '));

  const colab = block.fields.find((f) => f.id === 'colaboraCon');
  ok('colaboraCon solo Sí', colab.showWhen.values.join(',') === 'Sí', JSON.stringify(colab.showWhen));

  ok('swingerPerfil oculto en C/H', !merged.blocks.some((b) => b.id === 'swingerPerfil'), 'no swinger block');

  const full = { ...baseShell(), ...chDelta() };
  const miss = RP.validateValues(CFG, full, userCtx);
  ok('validación ok completa', miss.length === 0, miss.join('; '));

  const missDin = RP.validateValues(CFG, { ...full, dinamica: '' }, userCtx);
  ok('dinamica obligatoria', missDin.some((m) => /dinámica/i.test(m)), missDin.join('; '));

  const missBuscan = RP.validateValues(CFG, { ...full, buscan: [] }, userCtx);
  ok('buscan obligatorio', missBuscan.some((m) => /buscan/i.test(m)), missBuscan.join('; '));

  const missTipo = RP.validateValues(CFG, { ...full, tipoExperiencia: [] }, userCtx);
  ok('tipoExperiencia obligatorio', missTipo.some((m) => /experiencia/i.test(m)), missTipo.join('; '));

  const missPart = RP.validateValues(CFG, { ...full, participacionPareja: '' }, userCtx);
  ok('participacionPareja obligatoria', missPart.some((m) => /participación/i.test(m)), missPart.join('; '));

  const missColab = RP.validateValues(CFG, {
    ...full,
    haceColaboraciones: 'Sí',
  }, userCtx);
  ok('colaboraCon obligatorio si Sí', missColab.some((m) => /colabor/i.test(m)), missColab.join('; '));

  const finalized = RP.finalizeCuckoldHotwifeValues({ ...full }, userCtx);
  ok('finalize cuckoldHotwifePerfil', finalized.cuckoldHotwifePerfil && finalized.cuckoldHotwifePerfil.dinamica === 'hotwife', JSON.stringify(finalized.cuckoldHotwifePerfil));
  ok('finalize dinamicaLabel', finalized.cuckoldHotwifePerfil.dinamicaLabel === 'Hotwife', finalized.cuckoldHotwifePerfil.dinamicaLabel);
  ok('finalize sin swingerPerfil', !finalized.swingerPerfil, 'no swinger');
  ok('finalize sin unicornPerfil', !finalized.unicornPerfil, 'no unicorn');
  ok('mostrarBuscan default', finalized.mostrarBuscan === 'Sí', finalized.mostrarBuscan);

  const collected = simulateCollect(RP, V, full, userCtx);
  ok('collect nested', collected.cuckoldHotwifePerfil && collected.parejaGrupoPerfil, 'nested + shell');
  ok('collect tipoPerfil', collected.tipoPerfil === 'pareja_grupo', collected.tipoPerfil);

  const chFromSwinger = RP.finalizeCuckoldHotwifeValues({ ...full }, swingCtx);
  ok('anti-contam C/H finalize en ctx swinger', !chFromSwinger.cuckoldHotwifePerfil, 'bloqueado');

  const swFromCh = RP.finalizeParejaSwingerValues({
    ...full,
    intercambioSwinger: 'Sí',
    tipoInteraccion: ['Intercambio swinger'],
    modalidadInteraccion: ['Discreta'],
    atiendenA: 'Parejas',
    objetivosPerfil: ['Conocer parejas'],
    haceColaboraciones: 'No',
  }, userCtx);
  ok('anti-contam swinger finalize en ctx C/H', !swFromCh.swingerPerfil, 'bloqueado');

  const uniFromCh = RP.finalizeUnicornValues({
    objetivosPerfil: ['Conocer parejas'],
    tipoUnicornio: 'Mujer',
    buscoConocer: ['Parejas'],
    haceColaboraciones: 'No',
    estadoPerfil: 'Disponible',
    modalidades: ['hotel'],
    metodosPago: ['Efectivo'],
  }, userCtx);
  ok('anti-contam unicorn finalize en ctx C/H', !uniFromCh.unicornPerfil, 'bloqueado');

  const swFinal = RP.finalizeParejaSwingerValues({
    ...baseShell(),
    objetivosPerfil: ['Conocer parejas'],
    intercambioSwinger: 'A convenir',
    tipoInteraccion: ['Intercambio swinger'],
    modalidadInteraccion: ['Discreta'],
    atiendenA: 'Parejas',
    haceColaboraciones: 'No',
  }, swingCtx);
  ok('swinger finalize sin cuckoldHotwifePerfil', !swFinal.cuckoldHotwifePerfil, 'no C/H');

  const uniFinal = RP.finalizeUnicornValues({
    objetivosPerfil: ['Conocer parejas'],
    tipoUnicornio: 'Mujer',
    buscoConocer: ['Parejas'],
    haceColaboraciones: 'No',
    estadoPerfil: 'Disponible',
    modalidades: ['hotel'],
    metodosPago: ['Efectivo'],
  }, uniCtx);
  ok('unicorn finalize sin cuckoldHotwifePerfil', !uniFinal.cuckoldHotwifePerfil, 'no C/H');

  ok('shouldApplyCuckoldHotwifePipeline ctx', RP.shouldApplyCuckoldHotwifePipeline(userCtx, {}), 'ctx C/H');
  ok('shouldApplyCuckoldHotwifePipeline swinger ctx', !RP.shouldApplyCuckoldHotwifePipeline(swingCtx, full), 'no swinger ctx');
  ok('hasCuckoldHotwifeDelta dinamica', RP.hasCuckoldHotwifeDelta({ dinamica: 'cuckold' }), 'delta dinamica');
  ok('hasCuckoldHotwifeDelta hotwife persona no', !RP.hasCuckoldHotwifeDelta({ participacionPareja: 'Solo observa' }), 'no false positive');

  const perf = RP.mapToPerfil({ subcategoriaId: 'cuckold hotwife' }, collected, userCtx);
  ok('mapToPerfil dinamica', perf.dinamica === 'hotwife' && perf.dinamicaLabel === 'Hotwife', JSON.stringify({ dinamica: perf.dinamica, dinamicaLabel: perf.dinamicaLabel }));
  ok('mapToPerfil buscan', Array.isArray(perf.buscan) && perf.buscan[0] === 'Bulls', JSON.stringify(perf.buscan));
  ok('mapToPerfil nested', perf.cuckoldHotwifePerfil && perf.cuckoldHotwifePerfil.participacionPareja === 'Solo observa', 'nested');
  ok('mapToPerfil badgeHotwife', perf.badgeHotwife === true, String(perf.badgeHotwife));
  ok('mapToPerfil sin swingerPerfil', !perf.swingerPerfil, 'no swinger');
  ok('mapToPerfil sin unicornPerfil', !perf.unicornPerfil, 'no unicorn');
  ok('mapToPerfil shell alias', perf.aliasPareja === 'Pareja CH QA', perf.aliasPareja);

  const perfAmbos = RP.mapToPerfil(
    { subcategoriaId: 'cuckold_hotwife' },
    RP.finalizeCuckoldHotwifeValues({ ...full, dinamica: 'ambos' }, userCtx),
    chCtx('cuckold_hotwife')
  );
  ok('badge ambos', perfAmbos.badgeHotwife === true && perfAmbos.badgeCuckold === true, JSON.stringify({
    badgeHotwife: perfAmbos.badgeHotwife,
    badgeCuckold: perfAmbos.badgeCuckold,
  }));
} catch (e) {
  fail.push({ name: 'exception', detail: e.message + (e.stack ? '\n' + e.stack.split('\n')[1] : '') });
}

console.log('\n=== QA Cuckold/Hotwife (A4.1) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
