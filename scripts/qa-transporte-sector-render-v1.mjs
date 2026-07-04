/**
 * QA Fase 3 — Preview + Ficha sector Transporte packs A–F
 * node scripts/qa-transporte-sector-render-v1.mjs
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
  loadScript('data/registro-transporte-sub-deltas.js', ctx);
  loadScript('data/registro-transporte-blocks.js', ctx);
  loadScript('carihub-transporte-sector-render.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  loadScript('resultados-demo.js', ctx);
  return ctx;
}

const PACK_SAMPLES = {
  A: {
    u: {
      sectorId: 'transporte',
      subcategoriaId: 'chofer-privado',
      alias: 'Chofer Privado MTY',
      transportePerfil: {
        deltaPack: 'A',
        canonSubcategoriaId: 'chofer-privado',
        alias: 'Chofer Privado MTY',
        tagline: 'Traslados ejecutivos.',
        serviciosTransportePersonas: ['Traslados', 'Ejecutivo'],
        modalidadServicioTransporte: 'metropolitana',
        tarifaDesde: '600',
        horarioDetalle: 'Lun–Dom',
      },
    },
    mustCard: ['res-card--transporte-sector', 'res-card--trans-pack-a', 'Chofer Privado'],
    mustHydrate: ['__transportePack', 'A', 'Tarifa desde', '$600'],
    vista: 'pro',
    cardFn: 'cardHTMLServicio',
  },
  E: {
    u: {
      sectorId: 'transporte',
      subcategoriaId: 'empresa-de-mensajeria',
      nombreComercial: 'Mensajería Rápida del Norte',
      transportePerfil: {
        deltaPack: 'E',
        canonSubcategoriaId: 'empresa-de-mensajeria',
        nombreComercial: 'Mensajería Rápida del Norte',
        tagline: 'Paquetería y última milla.',
        serviciosEmpresaTransporte: ['Mensajería', 'Paquetería'],
        flotaAproximada: '25 unidades',
        horarioDetalle: 'Lun–Sáb',
      },
    },
    mustCard: ['res-card--trans-pack-e', 'Mensajería Rápida', 'res-card--negocio'],
    mustHydrate: ['__transportePack', 'E', 'Servicios desde'],
    vista: 'empresa',
    cardFn: 'cardHTMLNegocio',
  },
};

function run() {
  const ctx = loadStack();
  const TR = ctx.CariHubTransporteSectorRender;
  const RL = ctx.CariHubPublicRenderLite;
  const R = ctx.CariHubSectorContractRegistry;

  ok('renderer exportado', !!TR && typeof TR.hydrateDisplayFields === 'function');
  ok('registry demoBuilder transporte', R.resolveDemoBuilder('transporte') === 'plantillaDemoTransporte');
  ok('registry nested transporte', R.resolveNestedKey('transporte') === 'transportePerfil');
  ok('isTransporteNegocio empresa', TR.isTransporteNegocioPerfil({ sectorId: 'transporte', subcategoriaId: 'empresa-de-mensajeria', transportePerfil: { canonSubcategoriaId: 'empresa-de-mensajeria' } }));
  ok('chofer NO negocio', !TR.isTransporteNegocioPerfil({ sectorId: 'transporte', subcategoriaId: 'chofer-privado', transportePerfil: { canonSubcategoriaId: 'chofer-privado' } }));

  Object.entries(PACK_SAMPLES).forEach(([pack, sample]) => {
    const u = JSON.parse(JSON.stringify(sample.u));
    const hydrated = TR.hydrateDisplayFields(u);
    ok(pack + ' — isTransporteSectorPerfil', TR.isTransporteSectorPerfil(u));
    ok(pack + ' — pack nested', hydrated.__transportePack === pack, hydrated.__transportePack);
    sample.mustHydrate.forEach((needle) => {
      ok(pack + ' — hydrate ' + needle, JSON.stringify(hydrated).indexOf(needle) >= 0);
    });
    if (sample.vista) ok(pack + ' — vista ' + sample.vista, TR.resolveVistaPerfil(u) === sample.vista);
    const cardHtml = RL[sample.cardFn](u, { categoria: 'Demo' });
    sample.mustCard.forEach((needle) => ok(pack + ' — card ' + needle, cardHtml.indexOf(needle) >= 0));
    ok(pack + ' — card sectorial', cardHtml.indexOf('res-card--transporte-sector') >= 0);
  });

  const demos = ctx.CariHubResultadosDemo.plantillaDemoTransporte(
    { categoria: 'chofer-privado', pais: 'México', estado: 'Nuevo León', ciudad: 'Monterrey' },
    { sectorId: 'transporte', subcategoriaId: 'chofer-privado', componenteResultados: 'ResultCardServicio' }
  );
  ok('plantillaDemoTransporte genera perfiles', Array.isArray(demos) && demos.length >= 2);
  if (demos && demos[0]) {
    ok('demo nested transportePerfil', !!demos[0].transportePerfil);
    ok('demo card sectorial', RL.cardHTMLServicio(demos[0], { categoria: 'Chofer privado' }).indexOf('res-card--transporte-sector') >= 0);
  }

  const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
  ok('perfil-publico renderer', perfilHtml.includes('carihub-transporte-sector-render.js'));

  console.log('\n=== QA Transporte sector render ===');
  console.log('PASS:', pass.length, 'FAIL:', fail.length);
  if (fail.length) {
    fail.forEach((f) => console.log('  ✗', f.name, f.detail ? '— ' + f.detail : ''));
    process.exit(1);
  }
  pass.forEach((p) => console.log('  ✓', p.name));
  console.log('\nOK —', pass.length + '/' + (pass.length + fail.length));
}

run();
