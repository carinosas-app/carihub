/**
 * QA Fase 3 — Preview + Ficha sector Bienes raíces packs A–E
 * node scripts/qa-bienes-raices-sector-render-v1.mjs
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
  loadScript('data/registro-bienes-raices-sub-deltas.js', ctx);
  loadScript('data/registro-bienes-raices-blocks.js', ctx);
  loadScript('carihub-bienes-raices-sector-render.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  loadScript('resultados-demo.js', ctx);
  return ctx;
}

const PACK_SAMPLES = {
  A: {
    u: {
      sectorId: 'bienes-raices',
      subcategoriaId: 'agente-inmobiliario-independiente',
      alias: 'Agente Inmobiliario MTY',
      bienesRaicesPerfil: {
        deltaPack: 'A',
        canonSubcategoriaId: 'agente-inmobiliario-independiente',
        alias: 'Agente Inmobiliario MTY',
        tagline: 'Venta y renta residencial.',
        serviciosInmobiliarios: ['Asesoría'],
        tiposInmuebleInmobiliario: ['Casas'],
        modalidadOperacionInmobiliaria: 'venta_y_renta',
        tarifaDesde: 'Consultar',
        horarioDetalle: 'Lun–Sáb',
      },
    },
    mustCard: ['res-card--bienes-raices-sector', 'res-card--inmo-pack-a', 'Agente Inmobiliario'],
    mustHydrate: ['__bienesRaicesPack', 'A', 'Tarifa desde'],
    vista: 'pro',
    cardFn: 'cardHTMLServicio',
  },
  C: {
    u: {
      sectorId: 'bienes-raices',
      subcategoriaId: 'venta-de-casas',
      nombreComercial: 'Casas Residenciales MTY',
      bienesRaicesPerfil: {
        deltaPack: 'C',
        canonSubcategoriaId: 'venta-de-casas',
        nombreComercial: 'Casas Residenciales MTY',
        tagline: 'Venta de casas premium.',
        operacionInmobiliaria: 'venta',
        tiposInmuebleInmobiliario: ['Casas'],
        rangoPrecioInmobiliario: '$2.5M – $8M',
        horarioDetalle: 'Lun–Sáb',
      },
    },
    mustCard: ['res-card--inmo-pack-c', 'Casas Residenciales', 'res-card--negocio'],
    mustHydrate: ['__bienesRaicesPack', 'C', 'Venta desde'],
    vista: 'empresa',
    cardFn: 'cardHTMLNegocio',
  },
  D: {
    u: {
      sectorId: 'bienes-raices',
      subcategoriaId: 'renta-de-departamentos',
      nombreComercial: 'Renta Departamentos Centro',
      bienesRaicesPerfil: {
        deltaPack: 'D',
        canonSubcategoriaId: 'renta-de-departamentos',
        nombreComercial: 'Renta Departamentos Centro',
        tagline: 'Departamentos amueblados.',
        operacionInmobiliaria: 'renta',
        tiposInmuebleInmobiliario: ['Departamentos'],
        rangoPrecioInmobiliario: '$12,000 – $25,000/mes',
        horarioDetalle: 'Lun–Vie',
      },
    },
    mustCard: ['res-card--inmo-pack-d', 'Renta Departamentos', 'res-card--negocio'],
    mustHydrate: ['__bienesRaicesPack', 'D', 'Renta desde'],
    vista: 'empresa',
    cardFn: 'cardHTMLNegocio',
  },
};

function run() {
  const ctx = loadStack();
  const BR = ctx.CariHubBienesRaicesSectorRender;
  const RL = ctx.CariHubPublicRenderLite;
  const R = ctx.CariHubSectorContractRegistry;

  ok('renderer exportado', !!BR && typeof BR.hydrateDisplayFields === 'function');
  ok('registry demoBuilder bienes-raices', R.resolveDemoBuilder('bienes-raices') === 'plantillaDemoBienesRaices');
  ok('registry nested bienes-raices', R.resolveNestedKey('bienes-raices') === 'bienesRaicesPerfil');
  ok('isBienesRaicesNegocio venta casas', BR.isBienesRaicesNegocioPerfil({ sectorId: 'bienes-raices', subcategoriaId: 'venta-de-casas', bienesRaicesPerfil: { canonSubcategoriaId: 'venta-de-casas' } }));
  ok('isBienesRaicesNegocio renta deptos', BR.isBienesRaicesNegocioPerfil({ sectorId: 'bienes-raices', subcategoriaId: 'renta-de-departamentos', bienesRaicesPerfil: { canonSubcategoriaId: 'renta-de-departamentos' } }));
  ok('agente NO negocio', !BR.isBienesRaicesNegocioPerfil({ sectorId: 'bienes-raices', subcategoriaId: 'agente-inmobiliario-independiente', bienesRaicesPerfil: { canonSubcategoriaId: 'agente-inmobiliario-independiente' } }));

  Object.entries(PACK_SAMPLES).forEach(([pack, sample]) => {
    const u = JSON.parse(JSON.stringify(sample.u));
    const hydrated = BR.hydrateDisplayFields(u);
    ok(pack + ' — isBienesRaicesSectorPerfil', BR.isBienesRaicesSectorPerfil(u));
    ok(pack + ' — pack nested', hydrated.__bienesRaicesPack === pack, hydrated.__bienesRaicesPack);
    sample.mustHydrate.forEach((needle) => {
      ok(pack + ' — hydrate ' + needle, JSON.stringify(hydrated).indexOf(needle) >= 0);
    });
    if (sample.vista) ok(pack + ' — vista ' + sample.vista, BR.resolveVistaPerfil(u) === sample.vista);
    const cardHtml = RL[sample.cardFn](u, { categoria: 'Demo' });
    sample.mustCard.forEach((needle) => ok(pack + ' — card ' + needle, cardHtml.indexOf(needle) >= 0));
    ok(pack + ' — card sectorial', cardHtml.indexOf('res-card--bienes-raices-sector') >= 0);
  });

  const demos = ctx.CariHubResultadosDemo.plantillaDemoBienesRaices(
    { categoria: 'agente-inmobiliario-independiente', pais: 'México', estado: 'Nuevo León', ciudad: 'Monterrey' },
    { sectorId: 'bienes-raices', subcategoriaId: 'agente-inmobiliario-independiente', componenteResultados: 'ResultCardServicio' }
  );
  ok('plantillaDemoBienesRaices genera perfiles', Array.isArray(demos) && demos.length >= 1);
  if (demos && demos[0]) {
    ok('demo nested bienesRaicesPerfil', !!demos[0].bienesRaicesPerfil);
    ok('demo card sectorial', RL.cardHTMLServicio(demos[0], { categoria: 'Agente inmobiliario' }).indexOf('res-card--bienes-raices-sector') >= 0);
  }

  const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
  ok('perfil-publico renderer', perfilHtml.includes('carihub-bienes-raices-sector-render.js'));

  console.log('\n=== QA Bienes raíces sector render ===');
  console.log('PASS:', pass.length, 'FAIL:', fail.length);
  if (fail.length) {
    fail.forEach((f) => console.log('  ✗', f.name, f.detail ? '— ' + f.detail : ''));
    process.exit(1);
  }
  pass.forEach((p) => console.log('  ✓', p.name));
  console.log('\nOK —', pass.length + '/' + (pass.length + fail.length));
}

run();
