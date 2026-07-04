/**
 * QA Fase 3 — Preview + Ficha sector Industria packs A–E
 * node scripts/qa-industria-sector-render-v1.mjs
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
  loadScript('data/registro-industria-sub-deltas.js', ctx);
  loadScript('data/registro-industria-blocks.js', ctx);
  loadScript('carihub-industria-sector-render.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  loadScript('resultados-demo.js', ctx);
  return ctx;
}

const PACK_SAMPLES = {
  A: {
    u: {
      sectorId: 'industria',
      subcategoriaId: 'consultor-empresarial-independiente',
      alias: 'Consultor Lean MTY',
      industriaPerfil: {
        deltaPack: 'A',
        canonSubcategoriaId: 'consultor-empresarial-independiente',
        alias: 'Consultor Lean MTY',
        tagline: 'Optimización de procesos.',
        serviciosIndustriales: ['Consultoría'],
        sectoresIndustriales: ['Manufactura'],
        modalidadServicioIndustrial: 'mixto',
        tarifaDesde: '1200',
        horarioDetalle: 'Lun–Vie',
      },
    },
    mustCard: ['res-card--industria-sector', 'res-card--ind-pack-a', 'Consultor Lean'],
    mustHydrate: ['__industriaPack', 'A', 'Tarifa desde', '$1200'],
    vista: 'pro',
    cardFn: 'cardHTMLServicio',
  },
  B: {
    u: {
      sectorId: 'industria',
      subcategoriaId: 'ingeniero-industrial',
      nombreProfesional: 'Ing. Carlos Procesos',
      requiresCedula: true,
      industriaPerfil: {
        deltaPack: 'B',
        canonSubcategoriaId: 'ingeniero-industrial',
        nombreProfesional: 'Ing. Carlos Procesos',
        tagline: 'Layout y balanceo de líneas.',
        serviciosProfesionalesIndustrial: ['Layout'],
        especialidadIndustrial: 'Ingeniería industrial',
        precioConsulta: '1800',
        horarioAtencion: 'Lun–Vie',
      },
    },
    mustCard: ['res-card--ind-pack-b', 'Ing. Carlos', 'res-card--profesional'],
    mustHydrate: ['__industriaPack', 'B', 'Consulta desde', '$1800'],
    vista: 'pro',
    cardFn: 'cardHTMLServicio',
  },
  D: {
    u: {
      sectorId: 'industria',
      subcategoriaId: 'mantenimiento-industrial',
      nombreComercial: 'Mantenimiento Industrial Pro',
      industriaPerfil: {
        deltaPack: 'D',
        canonSubcategoriaId: 'mantenimiento-industrial',
        nombreComercial: 'Mantenimiento Industrial Pro',
        tagline: 'Preventivo y correctivo.',
        serviciosEmpresaIndustrial: ['Mantenimiento'],
        procesosIndustriales: ['Mecánica'],
        horarioDetalle: '24 h',
      },
    },
    mustCard: ['res-card--ind-pack-d', 'Mantenimiento Industrial', 'res-card--negocio'],
    mustHydrate: ['__industriaPack', 'D', 'Servicios desde'],
    vista: 'empresa',
    cardFn: 'cardHTMLNegocio',
  },
};

function run() {
  const ctx = loadStack();
  const IS = ctx.CariHubIndustriaSectorRender;
  const RL = ctx.CariHubPublicRenderLite;
  const R = ctx.CariHubSectorContractRegistry;

  ok('renderer exportado', !!IS && typeof IS.hydrateDisplayFields === 'function');
  ok('registry demoBuilder industria', R.resolveDemoBuilder('industria') === 'plantillaDemoIndustria');
  ok('registry nested industria', R.resolveNestedKey('industria') === 'industriaPerfil');
  ok('isIndustriaCedula ingeniero', IS.isIndustriaCedulaPerfil({ sectorId: 'industria', subcategoriaId: 'ingeniero-industrial', industriaPerfil: { canonSubcategoriaId: 'ingeniero-industrial' } }));
  ok('isIndustriaNegocio mantenimiento', IS.isIndustriaNegocioPerfil({ sectorId: 'industria', subcategoriaId: 'mantenimiento-industrial', industriaPerfil: { canonSubcategoriaId: 'mantenimiento-industrial' } }));
  ok('consultor NO negocio', !IS.isIndustriaNegocioPerfil({ sectorId: 'industria', subcategoriaId: 'consultor-empresarial-independiente', industriaPerfil: { canonSubcategoriaId: 'consultor-empresarial-independiente' } }));

  Object.entries(PACK_SAMPLES).forEach(([pack, sample]) => {
    const u = JSON.parse(JSON.stringify(sample.u));
    const hydrated = IS.hydrateDisplayFields(u);
    ok(pack + ' — isIndustriaSectorPerfil', IS.isIndustriaSectorPerfil(u));
    ok(pack + ' — pack nested', hydrated.__industriaPack === pack, hydrated.__industriaPack);
    sample.mustHydrate.forEach((needle) => {
      ok(pack + ' — hydrate ' + needle, JSON.stringify(hydrated).indexOf(needle) >= 0);
    });
    if (sample.vista) ok(pack + ' — vista ' + sample.vista, IS.resolveVistaPerfil(u) === sample.vista);
    const cardHtml = RL[sample.cardFn](u, { categoria: 'Demo' });
    sample.mustCard.forEach((needle) => ok(pack + ' — card ' + needle, cardHtml.indexOf(needle) >= 0));
    ok(pack + ' — card sectorial', cardHtml.indexOf('res-card--industria-sector') >= 0);
  });

  const demos = ctx.CariHubResultadosDemo.plantillaDemoIndustria(
    { categoria: 'consultor-empresarial-independiente', pais: 'México', estado: 'Nuevo León', ciudad: 'Monterrey' },
    { sectorId: 'industria', subcategoriaId: 'consultor-empresarial-independiente', componenteResultados: 'ResultCardServicio' }
  );
  ok('plantillaDemoIndustria genera perfiles', Array.isArray(demos) && demos.length >= 1);
  if (demos && demos[0]) {
    ok('demo nested industriaPerfil', !!demos[0].industriaPerfil);
    ok('demo card sectorial', RL.cardHTMLServicio(demos[0], { categoria: 'Consultor empresarial' }).indexOf('res-card--industria-sector') >= 0);
  }

  const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
  ok('perfil-publico renderer', perfilHtml.includes('carihub-industria-sector-render.js'));

  console.log('\n=== QA Industria sector render ===');
  console.log('PASS:', pass.length, 'FAIL:', fail.length);
  if (fail.length) {
    fail.forEach((f) => console.log('  ✗', f.name, f.detail ? '— ' + f.detail : ''));
    process.exit(1);
  }
  pass.forEach((p) => console.log('  ✓', p.name));
  console.log('\nOK —', pass.length + '/' + (pass.length + fail.length));
}

run();
