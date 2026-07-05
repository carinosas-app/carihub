/**
 * QA Fase 3 — Preview + Ficha sector Gastronomía packs
 * node scripts/qa-gastronomia-sector-render-v1.mjs
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
  loadScript('carihub-gastronomia-sector-render.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  loadScript('resultados-demo.js', ctx);
  return ctx;
}

const PACK_SAMPLES = {
  LOCAL_DINE: {
    sub: 'restaurantes-tradicional',
    u: {
      sectorId: 'restaurantes',
      subcategoriaId: 'restaurantes-tradicional',
      nombreComercial: 'La Cocina Demo',
      gastronomiaPerfil: {
        deltaPack: 'LOCAL_DINE',
        canonSubcategoriaId: 'restaurantes-tradicional',
        tagline: 'Cocina regional con terraza.',
        tipoCocinaPrincipal: ['mexicana', 'regional'],
        capacidadComensales: 80,
        servicioMesa: true,
        aceptaReservaciones: true,
        precioPromedioMx: 180,
        especialidadCasa: 'Cabrito al pastor',
        ventaAlcohol: true,
        permisoManipulacionAlimentos: true,
        horarioAtencionComercial: 'Mar–Dom 13:00–23:00',
      },
    },
    mustCard: ['res-card--gastronomia', 'res-card--gast-local-dine', 'La Cocina Demo', 'Cabrito'],
    mustHydrate: ['__gastronomiaPack', 'LOCAL_DINE', 'Precio promedio', '$180'],
    mustNotCard: ['res-card--bienestar', 'res-card--eventos-sector'],
  },
  BAR_BEBIDAS: {
    sub: 'bares',
    u: {
      sectorId: 'restaurantes',
      subcategoriaId: 'bares',
      nombreComercial: 'Bar Demo',
      gastronomiaPerfil: {
        deltaPack: 'BAR_BEBIDAS',
        canonSubcategoriaId: 'bares',
        tagline: 'Coctelería de autor.',
        ventaAlcohol: true,
        cartaCocteles: true,
        precioPromedioMx: 150,
        permisoManipulacionAlimentos: true,
      },
    },
    mustCard: ['res-card--gast-bar-bebidas', 'Venta de alcohol'],
    mustHydrate: ['__gastronomiaReguladaNotice', 'bebidas alcohólicas'],
    mustNotCard: ['res-card--bienestar-holistico'],
  },
  PRO_SERVICE: {
    sub: 'chef-cocinero-domicilio',
    u: {
      sectorId: 'restaurantes',
      subcategoriaId: 'chef-cocinero-domicilio',
      alias: 'Chef Demo',
      gastronomiaPerfil: {
        deltaPack: 'PRO_SERVICE',
        canonSubcategoriaId: 'chef-cocinero-domicilio',
        tagline: 'Cenas privadas a domicilio.',
        cotizacionDesde: '2200',
        unidadCotizacion: 'evento',
        experienciaChef: '10 años',
      },
    },
    mustCard: ['res-card--gastronomia', 'Chef Demo'],
    mustHydrate: ['__gastronomiaPack', 'PRO_SERVICE', 'Cotización'],
    vista: 'pro',
  },
};

function run() {
  const ctx = loadStack();
  const GS = ctx.CariHubGastronomiaSectorRender;
  const RL = ctx.CariHubPublicRenderLite;
  const R = ctx.CariHubSectorContractRegistry;

  ok('renderer exportado', !!GS && typeof GS.hydrateDisplayFields === 'function');
  ok('registry demoBuilder gastronomia', R.resolveDemoBuilder('restaurantes') === 'plantillaDemoGastronomia');

  Object.entries(PACK_SAMPLES).forEach(([pack, sample]) => {
    const u = JSON.parse(JSON.stringify(sample.u));
    const hydrated = GS.hydrateDisplayFields(u);
    ok(pack + ' — isGastronomiaSectorPerfil', GS.isGastronomiaSectorPerfil(u));
    ok(pack + ' — pack nested', hydrated.__gastronomiaPack === pack, hydrated.__gastronomiaPack);
    sample.mustHydrate.forEach((needle) => {
      const blob = JSON.stringify(hydrated);
      ok(pack + ' — hydrate contiene ' + needle, blob.indexOf(needle) >= 0);
    });
    if (sample.vista) {
      ok(pack + ' — vista ' + sample.vista, GS.resolveVistaPerfil(u) === sample.vista);
    }
    const cardHtml = RL.cardHTMLNegocio(u, { categoria: 'Demo' });
    sample.mustCard.forEach((needle) => {
      ok(pack + ' — card contiene ' + needle, cardHtml.indexOf(needle) >= 0);
    });
    (sample.mustNotCard || []).forEach((needle) => {
      ok(pack + ' — card NO contiene ' + needle, cardHtml.indexOf(needle) < 0);
    });
  });

  const demoQ = { categoria: 'restaurantes-tradicional', pais: 'México', estado: 'Nuevo León', ciudad: 'Monterrey' };
  const demos = ctx.CariHubResultadosDemo.plantillaDemoGastronomia(demoQ, {
    sectorId: 'restaurantes',
    subcategoriaId: 'restaurantes-tradicional',
    componenteResultados: 'ResultCardNegocio',
  });
  ok('plantillaDemoGastronomia genera perfiles', Array.isArray(demos) && demos.length >= 2, String(demos && demos.length));
  if (demos && demos[0]) {
    ok('demo nested gastronomiaPerfil', !!demos[0].gastronomiaPerfil && demos[0].gastronomiaPerfil.deltaPack);
    ok('demo NO usa solo campos genericos', !demos[0].horario || demos[0].gastronomiaPerfil);
  }

  console.log('\n=== QA Gastronomía sector render ===');
  console.log('PASS:', pass.length);
  console.log('FAIL:', fail.length);
  if (fail.length) {
    fail.forEach((f) => console.log('  ✗', f.name, f.detail ? '— ' + f.detail : ''));
    process.exit(1);
  }
  pass.forEach((p) => console.log('  ✓', p.name));
  console.log('\nOK —', pass.length + '/' + (pass.length + fail.length));
}

run();
