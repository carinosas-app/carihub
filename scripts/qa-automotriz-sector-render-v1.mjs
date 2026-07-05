/**
 * QA Fase 3 — Preview + Ficha sector Automotriz packs A–F
 * node scripts/qa-automotriz-sector-render-v1.mjs
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
  loadScript('data/registro-automotriz-sub-deltas.js', ctx);
  loadScript('data/registro-automotriz-blocks.js', ctx);
  loadScript('carihub-automotriz-sector-render.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  loadScript('resultados-demo.js', ctx);
  return ctx;
}

const PACK_SAMPLES = {
  A: {
    u: {
      sectorId: 'automotriz',
      subcategoriaId: 'talleres-mecanicos',
      alias: 'Taller Mecánico del Norte',
      automotrizPerfil: {
        deltaPack: 'A',
        canonSubcategoriaId: 'talleres-mecanicos',
        alias: 'Taller Mecánico del Norte',
        tagline: 'Mecánica general.',
        serviciosMecanica: ['Afinación', 'Frenos'],
        modalidadServicioAuto: 'taller_fijo',
        tarifaDesde: '500',
        horarioDetalle: 'Lun–Sáb',
      },
    },
    mustCard: ['res-card--automotriz-sector', 'res-card--auto-pack-a', 'Taller Mecánico'],
    mustHydrate: ['__automotrizPack', 'A', 'Tarifa desde', '$500'],
    vista: 'pro',
    cardFn: 'cardHTMLServicio',
  },
  E: {
    u: {
      sectorId: 'automotriz',
      subcategoriaId: 'agencias-de-autos',
      nombreComercial: 'Autos Seminuevos MTY',
      automotrizPerfil: {
        deltaPack: 'E',
        canonSubcategoriaId: 'agencias-de-autos',
        nombreComercial: 'Autos Seminuevos MTY',
        tagline: 'Seminuevos certificados.',
        serviciosVentaAutos: ['Seminuevos', 'Crédito'],
        tiposVehiculoVenta: ['SUV', 'Sedán'],
        financiamientoDisponible: 'Sí',
        horarioDetalle: 'Lun–Sáb',
      },
    },
    mustCard: ['res-card--auto-pack-e', 'Autos Seminuevos', 'res-card--negocio'],
    mustHydrate: ['__automotrizPack', 'E', 'Servicios desde'],
    vista: 'empresa',
    cardFn: 'cardHTMLNegocio',
  },
};

function run() {
  const ctx = loadStack();
  const AS = ctx.CariHubAutomotrizSectorRender;
  const RL = ctx.CariHubPublicRenderLite;
  const R = ctx.CariHubSectorContractRegistry;

  ok('renderer exportado', !!AS && typeof AS.hydrateDisplayFields === 'function');
  ok('registry demoBuilder automotriz', R.resolveDemoBuilder('automotriz') === 'plantillaDemoAutomotriz');
  ok('registry nested automotriz', R.resolveNestedKey('automotriz') === 'automotrizPerfil');
  ok('isAutomotrizNegocio agencia', AS.isAutomotrizNegocioPerfil({ sectorId: 'automotriz', subcategoriaId: 'agencias-de-autos', automotrizPerfil: { canonSubcategoriaId: 'agencias-de-autos' } }));
  ok('taller NO negocio', !AS.isAutomotrizNegocioPerfil({ sectorId: 'automotriz', subcategoriaId: 'talleres-mecanicos', automotrizPerfil: { canonSubcategoriaId: 'talleres-mecanicos' } }));

  Object.entries(PACK_SAMPLES).forEach(([pack, sample]) => {
    const u = JSON.parse(JSON.stringify(sample.u));
    const hydrated = AS.hydrateDisplayFields(u);
    ok(pack + ' — isAutomotrizSectorPerfil', AS.isAutomotrizSectorPerfil(u));
    ok(pack + ' — pack nested', hydrated.__automotrizPack === pack, hydrated.__automotrizPack);
    sample.mustHydrate.forEach((needle) => {
      ok(pack + ' — hydrate ' + needle, JSON.stringify(hydrated).indexOf(needle) >= 0);
    });
    if (sample.vista) ok(pack + ' — vista ' + sample.vista, AS.resolveVistaPerfil(u) === sample.vista);
    const cardHtml = RL[sample.cardFn](u, { categoria: 'Demo' });
    sample.mustCard.forEach((needle) => ok(pack + ' — card ' + needle, cardHtml.indexOf(needle) >= 0));
    ok(pack + ' — card sectorial', cardHtml.indexOf('res-card--automotriz-sector') >= 0);
  });

  const demos = ctx.CariHubResultadosDemo.plantillaDemoAutomotriz(
    { categoria: 'talleres-mecanicos', pais: 'México', estado: 'Nuevo León', ciudad: 'Monterrey' },
    { sectorId: 'automotriz', subcategoriaId: 'talleres-mecanicos', componenteResultados: 'ResultCardServicio' }
  );
  ok('plantillaDemoAutomotriz genera perfiles', Array.isArray(demos) && demos.length >= 2);
  if (demos && demos[0]) {
    ok('demo nested automotrizPerfil', !!demos[0].automotrizPerfil);
    ok('demo card sectorial', RL.cardHTMLServicio(demos[0], { categoria: 'Talleres' }).indexOf('res-card--automotriz-sector') >= 0);
  }

  const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
  ok('perfil-publico renderer', perfilHtml.includes('carihub-automotriz-sector-render.js'));

  console.log('\n=== QA Automotriz sector render ===');
  console.log('PASS:', pass.length, 'FAIL:', fail.length);
  if (fail.length) {
    fail.forEach((f) => console.log('  ✗', f.name, f.detail ? '— ' + f.detail : ''));
    process.exit(1);
  }
  pass.forEach((p) => console.log('  ✓', p.name));
  console.log('\nOK —', pass.length + '/' + (pass.length + fail.length));
}

run();
