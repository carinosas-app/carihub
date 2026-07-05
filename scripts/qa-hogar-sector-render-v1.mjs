/**
 * QA Fase 3 — Preview + Ficha sector Hogar packs A–D
 * node scripts/qa-hogar-sector-render-v1.mjs
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
  loadScript('carihub-hogar-sector-render.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  loadScript('resultados-demo.js', ctx);
  return ctx;
}

const PACK_SAMPLES = {
  A: {
    u: {
      sectorId: 'hogar',
      subcategoriaId: 'plomeros',
      alias: 'Plomería Express MTY',
      hogarPerfil: {
        deltaPack: 'A',
        canonSubcategoriaId: 'plomeros',
        tagline: 'Plomería residencial con garantía.',
        serviciosHogar: ['Fugas', 'Instalaciones'],
        modalidadServicioHogar: 'domicilio',
        tarifaDesde: '300',
        tiempoRespuestaHogar: 'mismo_dia',
        garantiaServicioHogar: '30 días',
        coberturaGeografica: 'Monterrey',
      },
    },
    mustCard: ['res-card--hogar-sector', 'res-card--hog-pack-a', 'Plomería Express'],
    mustHydrate: ['__hogarPack', 'A', 'Tarifa desde', '$300'],
    vista: 'pro',
  },
  B: {
    u: {
      sectorId: 'hogar',
      subcategoriaId: 'electricistas',
      alias: 'Electricista Pro MTY',
      hogarPerfil: {
        deltaPack: 'B',
        canonSubcategoriaId: 'electricistas',
        tagline: 'Instalaciones eléctricas residenciales.',
        serviciosHogar: ['Instalación', 'Reparación'],
        especialidadesHogar: ['Residencial'],
        modalidadServicioHogar: 'domicilio',
        tarifaDesde: '350',
      },
    },
    mustCard: ['res-card--hog-pack-b', 'Electricista Pro'],
    mustHydrate: ['__hogarPack', 'B', 'Tarifa desde'],
    vista: 'pro',
  },
  C: {
    u: {
      sectorId: 'hogar',
      subcategoriaId: 'carpinteros',
      alias: 'Carpintería a Medida',
      hogarPerfil: {
        deltaPack: 'C',
        canonSubcategoriaId: 'carpinteros',
        tagline: 'Muebles y closets a medida.',
        serviciosHogar: ['Closets', 'Muebles'],
        tiposTrabajoHogar: ['A medida'],
        materialesIncluidos: 'convenir',
        modalidadServicioHogar: 'ambos',
        tarifaDesde: '800',
      },
    },
    mustCard: ['res-card--hog-pack-c', 'Carpintería'],
    mustHydrate: ['__hogarPack', 'C'],
    vista: 'pro',
  },
  D: {
    u: {
      sectorId: 'hogar',
      subcategoriaId: 'pintores',
      alias: 'Pintura Profesional MTY',
      hogarPerfil: {
        deltaPack: 'D',
        canonSubcategoriaId: 'pintores',
        tagline: 'Interiores y exteriores.',
        serviciosHogar: ['Interiores', 'Exteriores'],
        modalidadServicioHogar: 'domicilio',
        tarifaDesde: '280',
        coberturaGeografica: 'Monterrey',
      },
    },
    mustCard: ['res-card--hog-pack-d', 'Pintura Profesional'],
    mustHydrate: ['__hogarPack', 'D', '$280'],
    vista: 'pro',
  },
};

function run() {
  const ctx = loadStack();
  const HS = ctx.CariHubHogarSectorRender;
  const RL = ctx.CariHubPublicRenderLite;
  const R = ctx.CariHubSectorContractRegistry;

  ok('renderer exportado', !!HS && typeof HS.hydrateDisplayFields === 'function');
  ok('registry demoBuilder hogar', R.resolveDemoBuilder('hogar') === 'plantillaDemoHogar');
  ok('registry nested hogar', R.resolveNestedKey('hogar') === 'hogarPerfil');

  Object.entries(PACK_SAMPLES).forEach(([pack, sample]) => {
    const u = JSON.parse(JSON.stringify(sample.u));
    const hydrated = HS.hydrateDisplayFields(u);
    ok(pack + ' — isHogarSectorPerfil', HS.isHogarSectorPerfil(u));
    ok(pack + ' — pack nested', hydrated.__hogarPack === pack, hydrated.__hogarPack);
    sample.mustHydrate.forEach((needle) => {
      const blob = JSON.stringify(hydrated);
      ok(pack + ' — hydrate contiene ' + needle, blob.indexOf(needle) >= 0);
    });
    if (sample.vista) {
      ok(pack + ' — vista ' + sample.vista, HS.resolveVistaPerfil(u) === sample.vista);
    }
    const cardHtml = RL.cardHTMLServicio(u, { categoria: 'Demo' });
    sample.mustCard.forEach((needle) => {
      ok(pack + ' — card contiene ' + needle, cardHtml.indexOf(needle) >= 0);
    });
    ok(pack + ' — card NO genérica sola', cardHtml.indexOf('res-card--hogar-sector') >= 0);
  });

  const demoQ = { categoria: 'plomeros', pais: 'México', estado: 'Nuevo León', ciudad: 'Monterrey' };
  const demos = ctx.CariHubResultadosDemo.plantillaDemoHogar(demoQ, {
    sectorId: 'hogar',
    subcategoriaId: 'plomeros',
    componenteResultados: 'ResultCardServicio',
  });
  ok('plantillaDemoHogar genera perfiles', Array.isArray(demos) && demos.length >= 2, String(demos && demos.length));
  if (demos && demos[0]) {
    ok('demo nested hogarPerfil', !!demos[0].hogarPerfil && demos[0].hogarPerfil.deltaPack);
    const demoCard = RL.cardHTMLServicio(demos[0], { categoria: 'Plomeros' });
    ok('demo card sectorial', demoCard.indexOf('res-card--hogar-sector') >= 0);
    ok('demo sectorId hogar', demos[0].sectorId === 'hogar');
    ok('demo NO usa card genérica sin hogar', demoCard.indexOf('res-card--servicio res-card--hogar') >= 0);
  }

  const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
  ok('perfil-publico incluye renderer', perfilHtml.includes('carihub-hogar-sector-render.js'));
  ok('perfil-publico applyHogarSectorHydrate', perfilHtml.includes('applyHogarSectorHydrate'));
  ok('perfil-publico hogarBadgesHTML', perfilHtml.includes('hogarBadgesHTML'));

  const resultadosHtml = fs.readFileSync(path.join(repoRoot, 'public', 'resultados.html'), 'utf8');
  ok('resultados.html incluye renderer', resultadosHtml.includes('carihub-hogar-sector-render.js'));

  console.log('\n=== QA Hogar sector render ===');
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
