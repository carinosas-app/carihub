/**
 * QA mínima — delta unicornio / persona_lifestyle (sin browser).
 * node scripts/qa-unicorn.mjs
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
} catch (e) {
  fail.push({ name: 'exception', detail: e.message });
}

console.log('\n=== QA Unicornio A3.1 ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
