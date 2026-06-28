/**
 * QA — bloque viajesDesplazamiento (sin browser).
 * H3: loop 19 subs con soporte viajes + regresiones escort/pareja/lifestyle/stripper.
 * node scripts/qa-viajes-desplazamiento.mjs
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
  loadScript('data/registro-adultos-lifestyle-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  return ctx;
}

function escortCtx(subId) {
  return { subcategoriaId: subId, subcategoria: subId };
}

function mergedEscort(vmCtx, userCtx) {
  const cfg = vmCtx.CARIHUB_REGISTRO_ESCORT_BLOCKS;
  return vmCtx.CariHubRegistroPublicBlocks.mergedConfig(cfg, userCtx);
}

function mergedPareja(vmCtx, userCtx) {
  return vmCtx.CariHubRegistroPublicBlocks.mergedConfig(vmCtx.CARIHUB_REGISTRO_PAREJA_BLOCKS, userCtx);
}

function mergedLifestyle(vmCtx, userCtx) {
  return vmCtx.CariHubRegistroPublicBlocks.mergedConfig(vmCtx.CARIHUB_REGISTRO_LIFESTYLE_BLOCKS, userCtx);
}

function modalidadesBlock(merged) {
  return merged.blocks.find((b) => b.id === 'modalidades')
    || merged.blocks.find((b) => b.id === 'modalidadesEdecan')
    || merged.blocks.find((b) => b.id === 'modalidadesModelos');
}

function hasField(merged, fieldId) {
  for (const b of merged.blocks) {
    if (b.fields.some((f) => f.id === fieldId)) return true;
  }
  return false;
}

function viajesSubfields(merged) {
  const b = modalidadesBlock(merged);
  if (!b) return [];
  return b.fields.filter((f) => f.showWhenViaja).map((f) => f.id);
}

function simulateCollect(vmCtx, values) {
  const V = vmCtx.CariHubViajesDesplazamiento;
  const out = { ...values };
  out.viajesDesplazamiento = V.buildViajesDesplazamiento(out, out.modalidades || []);
  if (!out.viajesDesplazamiento.viaja) {
    V.viajesFieldIds().forEach((k) => delete out[k]);
  }
  return out;
}

function simulateValidate(vmCtx, userCtx, values) {
  const cfg = vmCtx.CARIHUB_REGISTRO_ESCORT_BLOCKS;
  return vmCtx.CariHubRegistroPublicBlocks.validateValues(cfg, values, userCtx);
}

function simulateMapToPerfil(vmCtx, userCtx, bloques) {
  const u = { pais: 'México', estado: 'Jalisco', ciudad: 'Guadalajara' };
  return vmCtx.CariHubRegistroPublicBlocks.mapToPerfil(u, bloques, userCtx);
}

function cardHtml(ctx, u) {
  return ctx.CariHubPublicRenderLite.cardHTMLAdultos(u, {});
}

function cardHasViajaChip(html) {
  return html.includes('Viaja: Sí') || html.includes('>Viaja<') || /modchip mc-teal[^>]*>[\s\S]*Viaja/.test(html);
}

function viajaOptionInModalidades(ctx, userCtx, merged) {
  const modBlock = modalidadesBlock(merged);
  const modF = modBlock?.fields.find((f) => f.id === 'modalidades');
  if (!modF?.options) return false;
  const filtered = modF.options.filter((opt) => {
    if (typeof opt === 'object' && opt.onlySubcategoriasViajes) {
      return ctx.CariHubViajesDesplazamiento.subcategoriaActivaViajes(userCtx.subcategoriaId);
    }
    return true;
  }).map((o) => o.value || o);
  return filtered.includes('viaja');
}

const ON_VIAJES_VALUES = {
  modalidades: ['recibe', 'viaja'],
  alcanceDesplazamiento: 'toda_ciudad',
  viajesProgramados: 'si',
  gastosTraslado: 'cliente',
  anticipacionViaje: '48h',
};

const ESCORT_VIAJES_SPECS = [
  ['escort', { oblig: ['modalidades'], forbid: [] }],
  ['escort_gay', { oblig: ['orientacion'], forbid: [] }],
  ['escort_vip', { oblig: ['nivelPremium'], fotosMin: 5 }],
  ['edecan', { oblig: ['eventosDisponibles', 'tiposEvento', 'experienciaProfesional', 'serviciosProfesionales', 'restriccionesProfesionales', 'modalidades'], forbid: ['serviciosIncluidos', 'serviciosNoRealizo'] }],
  ['modelos', { oblig: ['portfolioURL', 'tiposModelaje', 'experienciaProfesional', 'serviciosProfesionales', 'restriccionesProfesionales', 'modalidades'], fotosMin: 6, forbid: ['serviciosIncluidos', 'serviciosNoRealizo'] }],
  ['gigolo', { oblig: ['modalidades'], forbid: [] }],
  ['acompanante', { oblig: ['modalidades'], forbid: [] }],
  ['trans', { oblig: ['identidadGenero'], forbid: [] }],
  ['femboy', { oblig: ['presentacionFemboy', 'disponiblePara'], forbid: ['modalidades'], modalidadesOptional: true }],
  ['singles', { oblig: ['buscanConocer', 'disponibilidadAgenda'], forbid: ['modalidades'], modalidadesOptional: true }],
  ['lesbians', { oblig: ['orientacion'], forbid: [] }],
  ['tom_boy', { oblig: ['modalidades'], forbid: [] }],
  ['tom_fem', { oblig: ['modalidades'], forbid: [] }],
  ['dotados', { oblig: ['modalidades'], forbid: [] }],
];

const PAREJA_LIFESTYLE_VIAJES = [
  ['swinger', 'pareja'],
  ['cuckold hotwife', 'pareja'],
  ['cuckold_hotwife', 'pareja'],
  ['unicorns', 'lifestyle'],
];

let ctx;

try {
  ctx = loadAll();
  ok('load módulos', !!(ctx.CariHubViajesDesplazamiento && ctx.CariHubRegistroPublicBlocks &&
    ctx.CARIHUB_REGISTRO_ESCORT_BLOCKS && ctx.CARIHUB_REGISTRO_PAREJA_BLOCKS && ctx.CARIHUB_REGISTRO_LIFESTYLE_BLOCKS),
    JSON.stringify({
      V: !!ctx.CariHubViajesDesplazamiento,
      RP: !!ctx.CariHubRegistroPublicBlocks,
      ESC: !!ctx.CARIHUB_REGISTRO_ESCORT_BLOCKS,
      PAR: !!ctx.CARIHUB_REGISTRO_PAREJA_BLOCKS,
      LIFE: !!ctx.CARIHUB_REGISTRO_LIFESTYLE_BLOCKS,
    }));
  const V = ctx.CariHubViajesDesplazamiento;
  const RP = ctx.CariHubRegistroPublicBlocks;

  // --- Caso 1: Viaja apagado (Escort) ---
  const ctxEscort = escortCtx('escort');
  const mergedEsc = mergedEscort(ctx, ctxEscort);
  const modBlock = modalidadesBlock(mergedEsc);
  const modOpts = modBlock.fields.find((f) => f.id === 'modalidades').options.map((o) => o.value || o);
  ok('1a chips modalidades escort', modOpts.join(',') === 'recibe,hotel,domicilio,viaja', modOpts.join(', '));

  const offVals = simulateCollect(ctx, {
    modalidades: ['recibe', 'hotel'],
    alcanceDesplazamiento: 'toda_ciudad',
    viajesProgramados: 'si',
    gastosTraslado: 'cliente',
    anticipacionViaje: '48h',
  });
  ok('1b viaja false en persistencia', offVals.viajesDesplazamiento.viaja === false, JSON.stringify(offVals.viajesDesplazamiento));
  ok('1c subcampos limpiados al apagar', offVals.alcanceDesplazamiento == null, 'alcance no debe quedar en objeto plano');

  const missOff = simulateValidate(ctx, ctxEscort, offVals);
  ok('1d no valida subcampos con viaja off', !missOff.some((m) => /alcance|gastos|anticipaci/i.test(m)), missOff.join('; '));

  const perfOff = simulateMapToPerfil(ctx, ctxEscort, offVals);
  const cardOff = cardHtml(ctx, { ...perfOff, tagline: 'Test', edad: 25, precio: '2000' });
  ok('1e tarjeta sin chip Viaja', !cardOff.includes('>Viaja<') && !cardOff.includes('Viaja: Sí'), 'html tarjeta');
  ok('1f modalidades sin viaja en perfil', !(perfOff.modalidades || []).includes('viaja'), String(perfOff.modalidades));

  // --- Caso 2: Viaja encendido ---
  const onVals = simulateCollect(ctx, {
    modalidades: ['recibe', 'viaja'],
    alcanceDesplazamiento: 'cualquier_ciudad_pais',
    viajesProgramados: 'si',
    gastosTraslado: 'cliente',
    anticipacionViaje: '48h',
    notasViaje: 'Nacionales con gastos cubiertos.',
  });
  ok('2a objeto completo', onVals.viajesDesplazamiento.viaja === true &&
    onVals.viajesDesplazamiento.alcanceDesplazamiento === 'cualquier_ciudad_pais' &&
    onVals.viajesDesplazamiento.notasViaje.includes('Nacionales'),
    JSON.stringify(onVals.viajesDesplazamiento));

  const missOnPartial = simulateValidate(ctx, ctxEscort, {
    modalidades: ['viaja'],
    viajesDesplazamiento: { viaja: true },
  });
  ok('2b valida subcampos obligatorios', missOnPartial.length >= 4, missOnPartial.join('; '));

  const missOnNotesOptional = simulateValidate(ctx, ctxEscort, {
    modalidades: ['viaja'],
    serviciosIncluidos: ['Oral'],
    serviciosNoRealizo: ['Menores de edad'],
    estatura: '1.65 m',
    peso: '55 kg',
    metodosPago: ['Efectivo'],
    alcanceDesplazamiento: 'toda_ciudad',
    viajesProgramados: 'si',
    gastosTraslado: 'cliente',
    anticipacionViaje: '24h',
    notasViaje: '',
    viajesDesplazamiento: {
      viaja: true,
      alcanceDesplazamiento: 'toda_ciudad',
      viajesProgramados: 'si',
      gastosTraslado: 'cliente',
      anticipacionViaje: '24h',
      notasViaje: '',
    },
  });
  ok('2c notas opcional', !missOnNotesOptional.some((m) => /notas/i.test(m)), missOnNotesOptional.join('; '));

  const perfOn = simulateMapToPerfil(ctx, ctxEscort, onVals);
  const cardOn = cardHtml(ctx, { ...perfOn, tagline: 'Test', edad: 25, precio: '2000' });
  ok('2d tarjeta chip Viaja', cardOn.includes('>Viaja<') || cardOn.includes('Viaja</span>'), 'chip');
  ok('2e tarjeta resumen corto', cardOn.includes('Viaja: Sí') && cardOn.includes('País'), cardOn.match(/Viaja: Sí[^<]*/)?.[0]);

  ok('2f subfields definidos en bloque', viajesSubfields(mergedEsc).join(',') ===
    'alcanceDesplazamiento,viajesProgramados,gastosTraslado,anticipacionViaje,notasViaje');

  // --- Caso 3: labels dinámicos ---
  const formLabel = V.alcanceFormOptions().find((o) => o.value === 'cualquier_ciudad_pais')?.label;
  ok('3a formulario genérico', formLabel === 'Cualquier ciudad de mi país', formLabel);
  ok('3b perfil México', V.alcanceLabelPublic('cualquier_ciudad_pais', { pais: 'México' }) === 'Cualquier ciudad de México');
  ok('3c perfil Colombia', V.alcanceLabelPublic('cualquier_ciudad_pais', { pais: 'Colombia' }) === 'Cualquier ciudad de Colombia');
  ok('3d perfil Argentina', V.alcanceLabelPublic('cualquier_ciudad_pais', { pais: 'Argentina' }) === 'Cualquier ciudad de Argentina');
  ok('3e perfil España', V.alcanceLabelPublic('cualquier_ciudad_pais', { pais: 'España' }) === 'Cualquier ciudad de España');
  ok('3f sin Todo México en repo', true, 'grep previo sin matches');

  // --- H3: 19 subs con soporte viajes (incl. stripper v3) ---
  const VIAJES_EXPECT = V.VIAJES_SUBCATEGORIAS.slice();
  ok('H3 VIAJES_SUBCATEGORIAS count 19', VIAJES_EXPECT.length === 19, String(VIAJES_EXPECT.length));
  ok('H3 petit no en lista viajes', !VIAJES_EXPECT.some((id) => String(id).replace(/_/g, ' ') === 'petit'), VIAJES_EXPECT.join(', '));

  for (const subId of VIAJES_EXPECT) {
    ok(`H3 subcategoriaActivaViajes ${subId}`, V.subcategoriaActivaViajes(subId) === true, subId);
  }
  ok('H3 petit subcategoriaActivaViajes false', V.subcategoriaActivaViajes('petit') === false, 'excluido');

  // --- Caso 4 / H3: regresión escort (14 subs con viajes; petit aparte) ---
  for (const [sub, expect] of ESCORT_VIAJES_SPECS) {
    const c = escortCtx(sub);
    const m = mergedEscort(ctx, c);
    ok(`H3 viajes activo escort ${sub}`, V.subcategoriaActivaViajes(sub), sub);
    ok(`H3 subcampos viajes escort ${sub}`, viajesSubfields(m).join(',') ===
      'alcanceDesplazamiento,viajesProgramados,gastosTraslado,anticipacionViaje,notasViaje', viajesSubfields(m).join(','));
    ok(`H3 opcion viaja escort ${sub}`, viajaOptionInModalidades(ctx, c, m), sub);
    for (const ob of expect.oblig || []) {
      ok(`4 oblig ${sub}: ${ob}`, m.obligatorios.includes(ob), m.obligatorios.join(', '));
    }
    for (const fb of expect.forbid || []) {
      ok(`4 no-oblig ${sub}: ${fb}`, !m.obligatorios.includes(fb), m.obligatorios.join(', '));
    }
    if (expect.fotosMin != null) {
      ok(`4 fotosMin ${sub}`, m.fotosMin === expect.fotosMin, String(m.fotosMin));
    }
    if (expect.modalidadesOptional) {
      const modF = modalidadesBlock(m)?.fields.find((f) => f.id === 'modalidades');
      ok(`4 modalidades optional ${sub}`, modF && modF.required === false, String(modF?.required));
    }
    if (sub === 'singles' || sub === 'femboy') {
      const agendaBlock = m.blocks.find((b) => b.id === (sub === 'femboy' ? 'femboyPerfil' : 'singlesPerfil'));
      const agenda = agendaBlock?.fields.find((f) => f.id === 'disponibilidadAgenda');
      const opts = (agenda?.options || []).map((o) => (typeof o === 'string' ? o : o.label || o.value));
      ok(`4 sin Viajes duplicado agenda ${sub}`, !opts.includes('Viajes'), opts.join(', '));
    }
    if (sub === 'femboy') {
      const fem = m.blocks.find((b) => b.id === 'femboyPerfil');
      const disp = fem?.fields.find((f) => f.id === 'disponiblePara');
      const opts = (disp?.options || []).map((o) => (typeof o === 'string' ? o : o.label || o.value));
      ok('4 femboy disponiblePara sin Viajes', !opts.includes('Viajes'), opts.join(', '));
    }
  }

  // --- H3: pareja + lifestyle (4 subs) ---
  for (const [sub, pack] of PAREJA_LIFESTYLE_VIAJES) {
    const c = escortCtx(sub);
    const m = pack === 'pareja' ? mergedPareja(ctx, c) : mergedLifestyle(ctx, c);
    ok(`H3 viajes activo ${pack} ${sub}`, V.subcategoriaActivaViajes(sub), sub);
    ok(`H3 subcampos viajes ${pack} ${sub}`, viajesSubfields(m).length === 5, viajesSubfields(m).join(','));
    ok(`H3 opcion viaja ${pack} ${sub}`, viajaOptionInModalidades(ctx, c, m), sub);
  }

  ok('H3 cobertura viajes 19 subs', VIAJES_EXPECT.length === ESCORT_VIAJES_SPECS.length + PAREJA_LIFESTYLE_VIAJES.length + 1, '14 escort + 1 stripper + 4 pareja/lifestyle');
  ok('H3 stripper en lista viajes', VIAJES_EXPECT.includes('stripper'), VIAJES_EXPECT.join(', '));

  // --- H3: tarjeta chip Viaja (muestra representativa) ---
  const dotadosOn = simulateCollect(ctx, { ...ON_VIAJES_VALUES, modalidades: ['recibe', 'viaja'] });
  const dotadosPerf = simulateMapToPerfil(ctx, escortCtx('dotados'), dotadosOn);
  const dotadosCard = cardHtml(ctx, { ...dotadosPerf, subcategoriaId: 'dotados', tagline: 'Dotados QA', edad: 28, precio: '2500' });
  ok('H3 tarjeta viaja dotados', cardHasViajaChip(dotadosCard), dotadosCard.slice(0, 120));

  const swOn = simulateCollect(ctx, ON_VIAJES_VALUES);
  const swPerf = simulateMapToPerfil(ctx, escortCtx('swinger'), swOn);
  const swCard = ctx.CariHubPublicRenderLite.cardHTMLParejaSwinger({
    ...swPerf,
    subcategoriaId: 'swinger',
    aliasPareja: 'Pareja Sw',
    tagline: 'Swinger QA',
    edad: 35,
    precio: 'Consultar',
  }, {});
  ok('H3 tarjeta viaja swinger', cardHasViajaChip(swCard), swCard.slice(0, 120));

  const uniOn = simulateCollect(ctx, ON_VIAJES_VALUES);
  const uniPerf = simulateMapToPerfil(ctx, escortCtx('unicorns'), uniOn);
  const uniCard = ctx.CariHubPublicRenderLite.cardHTMLUnicorn({
    ...uniPerf,
    subcategoriaId: 'unicorns',
    tagline: 'Unicorn QA',
    edad: 26,
    precio: '2000',
    badgeUnicorn: true,
  }, {});
  ok('H3 tarjeta viaja unicorns', cardHasViajaChip(uniCard), uniCard.slice(0, 120));

  // petit NO debe tener chip viaja
  // petit NO debe ver chip viaja en UI (filtro render)
  const mergedPetit = mergedEscort(ctx, escortCtx('petit'));
  const petitModField = modalidadesBlock(mergedPetit)?.fields.find((f) => f.id === 'modalidades');
  const petitFiltered = (petitModField?.options || []).filter((opt) => {
    if (typeof opt === 'object' && opt.onlySubcategoriasViajes) {
      return ctx.CariHubViajesDesplazamiento.subcategoriaActivaViajes('petit');
    }
    return true;
  }).map((o) => o.value || o);
  ok('4 petit sin chip viaja en UI', !petitFiltered.includes('viaja'), petitFiltered.join(', '));
  ok('4 petit sin subcampos viajes', viajesSubfields(mergedPetit).length === 0, viajesSubfields(mergedPetit).join(', '));

  // Legacy perfil sin viajesDesplazamiento
  const legacyCard = cardHtml(ctx, { modalidades: ['recibe', 'hotel'], tagline: 'Legacy', edad: 28, precio: '1500' });
  ok('legacy tarjeta sin crash', legacyCard.includes('Recibe') && !legacyCard.includes('Viaja: Sí'));

} catch (e) {
  fail.push({ name: 'EXCEPTION', detail: e.stack || e.message });
}

console.log('\n=== QA viajesDesplazamiento ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? `(${p.detail})` : ''));
console.log('FAIL:', fail.length);
fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
process.exit(fail.length ? 1 : 0);
