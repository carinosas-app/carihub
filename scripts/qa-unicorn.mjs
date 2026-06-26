/**
 * QA Unicorn — motor blocks/validación/mapToPerfil/tarjeta (A3.1 + cierre A3.4).
 * node scripts/qa-unicorn.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
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

function loadAll() {
  const ctx = makeCtx();
  loadScript('carihub-viajes-desplazamiento.js', ctx);
  loadScript('data/registro-adultos-escort-blocks.js', ctx);
  loadScript('data/registro-adultos-pareja-blocks.js', ctx);
  loadScript('data/registro-adultos-lifestyle-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  loadScript('data/registro-schema-index.js', ctx);
  loadScript('resultados-demo.js', ctx);
  loadScript('carihub-field-engine-lite.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  return ctx;
}

function unicornCtx() {
  return { subcategoriaId: 'unicorns', subcategoria: 'Unicorns' };
}

function swingerCtx() {
  return { subcategoriaId: 'swinger', subcategoria: 'Swinger' };
}

function baseVals() {
  return {
    objetivosPerfil: ['Conocer parejas'],
    tipoUnicornio: 'Mujer',
    buscoConocer: ['Parejas'],
    haceColaboraciones: 'No',
    estadoPerfil: 'Solo conocer parejas',
    modalidades: ['hotel'],
    metodosPago: ['Efectivo'],
  };
}

function swingerSharedVals() {
  return {
    objetivosPerfil: ['Conocer parejas'],
    haceColaboraciones: 'Sí',
    colaboraCon: ['Parejas'],
    intercambioSwinger: 'A convenir',
    tipoInteraccion: ['Intercambio swinger'],
    modalidadInteraccion: ['Discreta'],
    atiendenA: 'Parejas',
    modalidades: ['recibe'],
    metodosPago: ['Efectivo'],
  };
}

let ctx;
try {
  ctx = loadAll();
  const RP = ctx.CariHubRegistroPublicBlocks;
  const V = ctx.CariHubViajesDesplazamiento;
  const userCtx = unicornCtx();
  const swingCtx = swingerCtx();

  ok('load módulos', !!(ctx.CARIHUB_REGISTRO_LIFESTYLE_BLOCKS && RP), 'lifestyle blocks');

  ok('resolveConfig unicorns', RP.resolveConfig(userCtx, null) === ctx.CARIHUB_REGISTRO_LIFESTYLE_BLOCKS, 'cfg lifestyle');
  ok('matchesLifestyle', RP.matchesLifestyle(userCtx, null), 'match');
  ok('no matchesEscort', !RP.matchesEscort(userCtx, null), 'not escort');
  ok('no matchesPareja', !RP.matchesPareja(userCtx, null), 'not pareja');
  ok('viajes unicorns', V.subcategoriaActivaViajes('unicorns'), 'viajes activo');

  const merged = RP.mergedConfig(ctx.CARIHUB_REGISTRO_LIFESTYLE_BLOCKS, userCtx);
  const block = merged.blocks.find((b) => b.id === 'unicornPerfil');
  ok('bloque unicornPerfil', !!block, block ? block.fields.length + ' campos' : '');

  const ids = block.fields.map((f) => f.id);
  ok(
    'campos clave',
    [
      'objetivosPerfil', 'mostrarObjetivosPerfil', 'tipoUnicornio', 'buscoConocer',
      'tipoParejaPreferida', 'finalidadEncuentro', 'estadoPerfil', 'haceColaboraciones',
      'colaboraCon', 'mostrarColaboraciones', 'experiencia', 'ambientePreferido', 'estilo',
    ].every((id) => ids.includes(id)),
    ids.join(', ')
  );

  const colab = block.fields.find((f) => f.id === 'colaboraCon');
  ok('colaboraCon solo Sí', colab.showWhen.values.join(',') === 'Sí', JSON.stringify(colab.showWhen));

  ok('fotosMin 3', RP.getFotosMin(userCtx) === 3, String(RP.getFotosMin(userCtx)));

  const miss = RP.validateValues(ctx.CARIHUB_REGISTRO_LIFESTYLE_BLOCKS, baseVals(), userCtx);
  ok('validación ok', miss.length === 0, miss.join('; '));

  const missColab = RP.validateValues(ctx.CARIHUB_REGISTRO_LIFESTYLE_BLOCKS, {
    ...baseVals(),
    haceColaboraciones: 'Sí',
  }, userCtx);
  ok('colaboraCon obligatorio si Sí', missColab.some((m) => /colabor/i.test(m)), missColab.join('; '));

  const finalized = RP.finalizeUnicornValues({ ...baseVals() }, userCtx);
  ok('finalize unicornPerfil', finalized.unicornPerfil && finalized.unicornPerfil.tipoUnicornio === 'Mujer', JSON.stringify(finalized.unicornPerfil));
  ok('finalize objetivoPrincipal', finalized.objetivoPrincipal === 'Conocer parejas', finalized.objetivoPrincipal);
  ok('finalize sin swingerPerfil', !finalized.swingerPerfil, 'no swinger');

  const unicornOnlyShared = RP.finalizeUnicornValues({
    objetivosPerfil: ['Conocer parejas'],
    tipoUnicornio: 'Hombre',
    buscoConocer: ['Parejas', 'Mujeres'],
    haceColaboraciones: 'No',
    estadoPerfil: 'Disponible para encuentros',
    modalidades: ['hotel'],
    metodosPago: ['Efectivo'],
  }, userCtx);
  ok('anti-contam unicorn no swingerPerfil', !unicornOnlyShared.swingerPerfil, 'limpio');

  const swingerFromUnicornCtx = RP.finalizeParejaSwingerValues({
    ...baseVals(),
    intercambioSwinger: 'A convenir',
    tipoInteraccion: ['Intercambio swinger'],
    modalidadInteraccion: ['Discreta'],
    atiendenA: 'Parejas',
  }, userCtx);
  ok('anti-contam swinger finalize en ctx unicorn', !swingerFromUnicornCtx.swingerPerfil, 'bloqueado');

  const unicornFromSwingerCtx = RP.finalizeUnicornValues({ ...baseVals() }, swingCtx);
  ok('anti-contam unicorn finalize en ctx swinger', !unicornFromSwingerCtx.unicornPerfil, 'bloqueado');

  const swingerFinal = RP.finalizeParejaSwingerValues({ ...swingerSharedVals() }, swingCtx);
  ok('swinger finalize ok', swingerFinal.swingerPerfil && swingerFinal.swingerPerfil.intercambioSwinger === 'A convenir', 'swingerPerfil');
  ok('swinger finalize sin unicornPerfil', !swingerFinal.unicornPerfil, 'no unicorn');

  const perf = RP.mapToPerfil({ subcategoriaId: 'unicorns', edad: 28, ciudad: 'CDMX' }, finalized, userCtx);
  ok(
    'mapToPerfil campos clave',
    perf.tipoUnicornio === 'Mujer'
      && perf.estadoPerfil
      && perf.badgeUnicorn === true
      && Array.isArray(perf.objetivosPerfil)
      && perf.objetivoPrincipal === 'Conocer parejas'
      && perf.mostrarObjetivosPerfil === 'Sí',
    JSON.stringify({
      tipoUnicornio: perf.tipoUnicornio,
      objetivosPerfil: perf.objetivosPerfil,
      objetivoPrincipal: perf.objetivoPrincipal,
      badgeUnicorn: perf.badgeUnicorn,
    })
  );
  ok('mapToPerfil sin swingerPerfil', !perf.swingerPerfil, 'no swinger');
  ok('mapToPerfil unicornPerfil nested', perf.unicornPerfil && perf.unicornPerfil.tipoUnicornio === 'Mujer', 'nested');
  ok('buscan alias', Array.isArray(perf.buscan) && perf.buscan[0] === 'Parejas', JSON.stringify(perf.buscan));

  const swPerf = RP.mapToPerfil(
    { subcategoriaId: 'swinger' },
    swingerFinal,
    swingCtx
  );
  ok('mapToPerfil swinger sin unicornPerfil', !swPerf.unicornPerfil, 'no unicorn');
  ok('mapToPerfil swinger con swingerPerfil', !!swPerf.swingerPerfil, 'swinger ok');

  const card = ctx.CariHubPublicRenderLite.cardHTMLUnicorn({
    ...perf,
    nombre: 'Luna U.',
    edad: 28,
    tagline: 'Unicornio discreta',
    precio: '1500',
    ciudad: 'CDMX',
    modalidades: ['viaja'],
    viajesDesplazamiento: { viaja: true, alcanceDesplazamiento: 'toda_ciudad' },
    objetivosPerfil: ['Conocer parejas'],
    mostrarObjetivosPerfil: 'Sí',
  }, {});
  ok('tarjeta compacta', card.includes('res-card--unicorn') && card.includes('Unicornio') && card.includes('Busco:'), 'html');
  ok('tarjeta sin saturar modalidades', !card.includes('>Recibe<') && !card.includes('>Hotel<'), 'solo viaja si aplica');
  ok('tarjeta chip viaja', card.includes('>Viaja<'), 'viaja chip');

  const cardHidden = ctx.CariHubPublicRenderLite.cardHTMLUnicorn({
    ...perf,
    nombre: 'Test',
    tagline: 'Test',
    mostrarObjetivosPerfil: 'No',
    objetivosPerfil: ['Conocer parejas'],
    buscoConocer: ['Parejas'],
  }, {});
  ok('objetivo oculto', !cardHidden.includes('Conocer parejas') || cardHidden.includes('Busco:'), 'visibilidad objetivos');

  const FE = ctx.CariHubFieldEngineLite;
  const pres = FE.resolvePublicPresentation({ subcategoriaId: 'unicorns', categoria: 'Unicorn' });
  ok('cierre vista unicorn', pres.vistaPerfil === 'unicorn', pres.vistaPerfil);
  ok('cierre ResultCardUnicorn', pres.componenteResultados === 'ResultCardUnicorn', pres.componenteResultados);
  ok('cierre tipoPerfil persona', pres.tipoPerfil === 'persona', pres.tipoPerfil);

  const blockIds = merged.blocks.map((b) => b.id);
  ok(
    'blocks operativos lifestyle',
    ['serviciosLifestyle', 'horarios', 'sobreMi', 'perfilDetalle', 'modalidades', 'metodosPago'].every((id) => blockIds.includes(id)),
    blockIds.join(', ')
  );

  const fullVals = {
    ...baseVals(),
    buscoConocer: ['Parejas', 'Mujeres'],
    tipoParejaPreferida: ['Hombre + Mujer'],
    finalidadEncuentro: ['Socializar'],
    experiencia: 'Intermedio',
    ambientePreferido: ['Hotel'],
    estilo: 'Discreto',
    serviciosLifestyle: ['Citas con parejas'],
    modalidades: ['hotel', 'viaja'],
    alcanceDesplazamiento: 'cualquier_ciudad_pais',
    viajesProgramados: 'si',
    gastosTraslado: 'se_acuerda',
    anticipacionViaje: '48h',
    horarioDetalle: 'Vie–Dom 20:00–02:00',
    sobreMi: 'Unicornio lifestyle.',
    idiomas: 'Español',
  };
  let fullFinal = RP.finalizeUnicornValues(fullVals, userCtx);
  fullFinal.viajesDesplazamiento = V.buildViajesDesplazamiento(fullFinal, fullFinal.modalidades || []);
  const fullPerf = RP.mapToPerfil({ subcategoriaId: 'unicorns', edad: 28, ciudad: 'Monterrey' }, fullFinal, userCtx);
  ok('mapToPerfil serviciosLifestyle', Array.isArray(fullPerf.serviciosLifestyle) && fullPerf.serviciosLifestyle.length === 1, JSON.stringify(fullPerf.serviciosLifestyle));
  ok('mapToPerfil horarioDetalle', fullPerf.horarioDetalle === 'Vie–Dom 20:00–02:00', fullPerf.horarioDetalle);
  ok('mapToPerfil idiomas', fullPerf.idiomas === 'Español', fullPerf.idiomas);
  ok('mapToPerfil sobreMi', fullPerf.sobreMi === 'Unicornio lifestyle.', fullPerf.sobreMi);
  ok('mapToPerfil viajes nested', fullPerf.unicornPerfil && fullPerf.unicornPerfil.viajesDesplazamiento && fullPerf.unicornPerfil.viajesDesplazamiento.viaja === true, 'viaja');

  const built = RP.buildUnicornPerfil(fullFinal);
  ok(
    'buildUnicornPerfil shape A3.4',
    built.tipoUnicornio === 'Mujer'
      && Array.isArray(built.modalidades)
      && built.horarioDetalle === 'Vie–Dom 20:00–02:00'
      && built.sobreMi === 'Unicornio lifestyle.'
      && built.idiomas === 'Español',
    JSON.stringify({ modalidades: built.modalidades, horarioDetalle: built.horarioDetalle })
  );

  const cardPipe = ctx.CariHubPublicRenderLite.cardHTML({
    ...fullPerf,
    nombre: 'Luna U.',
    edad: 28,
    precio: '1500',
    ciudad: 'Monterrey',
    badgeUnicorn: true,
  }, { categoria: 'Unicorn' });
  ok('cardHTML pipeline unicorn', cardPipe.includes('res-card--unicorn') && cardPipe.includes('Busco:'), 'cardHTML');

  const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
  ok('ficha tipo unicornio', perfilHtml.includes('Tipo de unicornio'), 'row');
  ok('ficha busca actualmente', perfilHtml.includes('Busca actualmente'), 'row');
  ok('ficha busco conocer unicorn', perfilHtml.includes('isUnicornSubFicha(u)&&Array.isArray(u.buscoConocer)'), 'guard');

  const previewJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'registro-perfil-preview.js'), 'utf8');
  ok('preview vista unicorn source', previewJs.includes("vistaPerfil = 'unicorn'"), 'preview.js');
  ok('preview strip swingerPerfil', previewJs.includes('delete u.swingerPerfil'), 'anti-contam');
} catch (e) {
  fail.push({ name: 'exception', detail: e.message });
}

console.log('\n=== QA Unicorn A3.4 Cierre (motor) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
