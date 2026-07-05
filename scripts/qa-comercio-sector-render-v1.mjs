/**
 * QA Fase 3 — Preview + Ficha sector Comercio packs A–D
 * node scripts/qa-comercio-sector-render-v1.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const jsRoot = path.join(repoRoot, 'public', 'js');

const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

function loadScript(relativePath, ctx) {
  vm.runInContext(fs.readFileSync(path.join(jsRoot, relativePath), 'utf8'), ctx, { filename: relativePath });
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

function loadStack() {
  const ctx = makeCtx();
  loadScript('data/registro-schema-index.js', ctx);
  loadScript('data/registro-sector-contract-registry.js', ctx);
  loadScript('data/registro-comercio-sub-deltas.js', ctx);
  loadScript('data/registro-comercio-blocks.js', ctx);
  loadScript('carihub-comercio-sector-render.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  loadScript('resultados-demo.js', ctx);
  return ctx;
}

const PACK_SAMPLES = {
  A: {
    u: {
      sectorId: 'comercio',
      subcategoriaId: 'abarrotes',
      alias: 'Abarrotes La Esquina',
      comercioPerfil: {
        deltaPack: 'A',
        canonSubcategoriaId: 'abarrotes',
        alias: 'Abarrotes La Esquina',
        tagline: 'Surte diario.',
        categoriasProducto: ['Abarrotes', 'Bebidas'],
        modalidadVentaComercio: 'tienda_fisica',
        tarifaDesde: '25',
        horarioDetalle: 'Lun–Dom',
      },
    },
    mustCard: ['res-card--comercio-sector', 'res-card--com-pack-a', 'Abarrotes La'],
    mustHydrate: ['__comercioPack', 'A', 'Precio desde', '$25'],
    vista: 'pro',
    cardFn: 'cardHTMLNegocio',
  },
  D: {
    u: {
      sectorId: 'comercio',
      subcategoriaId: 'distribuidoras',
      nombreComercial: 'Distribuidora Norte SA',
      comercioPerfil: {
        deltaPack: 'D',
        canonSubcategoriaId: 'distribuidoras',
        nombreComercial: 'Distribuidora Norte SA',
        tagline: 'Distribución regional.',
        serviciosEmpresaComercio: ['Distribución', 'Rutas'],
        flotaEntrega: '12 unidades',
        horarioDetalle: 'Lun–Vie',
      },
    },
    mustCard: ['res-card--com-pack-d', 'Distribuidora Norte', 'res-card--negocio'],
    mustHydrate: ['__comercioPack', 'D', 'Servicios desde'],
    vista: 'empresa',
    cardFn: 'cardHTMLNegocio',
  },
};

function run() {
  const ctx = loadStack();
  const CR = ctx.CariHubComercioSectorRender;
  const RL = ctx.CariHubPublicRenderLite;
  const R = ctx.CariHubSectorContractRegistry;

  ok('renderer exportado', !!CR && typeof CR.hydrateDisplayFields === 'function');
  ok('registry demoBuilder comercio', R.resolveDemoBuilder('comercio') === 'plantillaDemoComercio');
  ok('registry nested comercio', R.resolveNestedKey('comercio') === 'comercioPerfil');
  ok('isComercioNegocio distribuidora', CR.isComercioNegocioPerfil({ sectorId: 'comercio', subcategoriaId: 'distribuidoras', comercioPerfil: { canonSubcategoriaId: 'distribuidoras' } }));
  ok('abarrotes NO negocio pack', !CR.isComercioNegocioPerfil({ sectorId: 'comercio', subcategoriaId: 'abarrotes', comercioPerfil: { canonSubcategoriaId: 'abarrotes' } }));

  Object.entries(PACK_SAMPLES).forEach(([pack, sample]) => {
    const u = JSON.parse(JSON.stringify(sample.u));
    const hydrated = CR.hydrateDisplayFields(u);
    ok(pack + ' — isComercioSectorPerfil', CR.isComercioSectorPerfil(u));
    ok(pack + ' — pack nested', hydrated.__comercioPack === pack, hydrated.__comercioPack);
    sample.mustHydrate.forEach((needle) => {
      ok(pack + ' — hydrate ' + needle, JSON.stringify(hydrated).indexOf(needle) >= 0);
    });
    if (sample.vista) ok(pack + ' — vista ' + sample.vista, CR.resolveVistaPerfil(u) === sample.vista);
    const cardHtml = RL[sample.cardFn](u, { categoria: 'Demo' });
    sample.mustCard.forEach((needle) => ok(pack + ' — card ' + needle, cardHtml.indexOf(needle) >= 0));
    ok(pack + ' — card sectorial', cardHtml.indexOf('res-card--comercio-sector') >= 0);
  });

  const demos = ctx.CariHubResultadosDemo.plantillaDemoComercio(
    { categoria: 'abarrotes', pais: 'México', estado: 'Nuevo León', ciudad: 'Monterrey' },
    { sectorId: 'comercio', subcategoriaId: 'abarrotes', componenteResultados: 'ResultCardNegocio' }
  );
  ok('plantillaDemoComercio genera perfiles', Array.isArray(demos) && demos.length >= 2);
  if (demos && demos[0]) {
    ok('demo nested comercioPerfil', !!demos[0].comercioPerfil);
    ok('demo card sectorial', RL.cardHTMLNegocio(demos[0], { categoria: 'Abarrotes' }).indexOf('res-card--comercio-sector') >= 0);
  }

  const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
  ok('perfil-publico renderer', perfilHtml.includes('carihub-comercio-sector-render.js'));

  console.log('\n=== QA Comercio sector render ===');
  console.log('PASS:', pass.length, 'FAIL:', fail.length);
  if (fail.length) {
    fail.forEach((f) => console.log('  ✗', f.name, f.detail ? '— ' + f.detail : ''));
    process.exit(1);
  }
  pass.forEach((p) => console.log('  ✓', p.name));
  console.log('\nOK —', pass.length + '/' + (pass.length + fail.length));
}

run();
