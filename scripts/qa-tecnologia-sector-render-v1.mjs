/**
 * QA Fase 3 — Preview + Ficha sector Tecnología packs A–F
 * node scripts/qa-tecnologia-sector-render-v1.mjs
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
  loadScript('data/registro-tecnologia-sub-deltas.js', ctx);
  loadScript('data/registro-tecnologia-blocks.js', ctx);
  loadScript('carihub-tecnologia-sector-render.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  loadScript('resultados-demo.js', ctx);
  return ctx;
}

const PACK_SAMPLES = {
  A: {
    u: {
      sectorId: 'tecnologia',
      subcategoriaId: 'programador',
      alias: 'Dev Full Stack MTY',
      tecnologiaPerfil: {
        deltaPack: 'A',
        canonSubcategoriaId: 'programador',
        alias: 'Dev Full Stack MTY',
        tagline: 'React y Node.',
        stackTecnologico: ['React', 'Node.js'],
        serviciosDesarrollo: ['Web', 'APIs'],
        modalidadServicioTI: 'hibrido',
        tarifaDesde: '1200',
        horarioDetalle: 'Lun–Vie',
      },
    },
    mustCard: ['res-card--tecnologia-sector', 'res-card--tec-pack-a', 'Dev Full Stack'],
    mustHydrate: ['__tecnologiaPack', 'A', 'Tarifa desde', '$1200'],
    vista: 'pro',
    cardFn: 'cardHTMLServicio',
  },
  E: {
    u: {
      sectorId: 'tecnologia',
      subcategoriaId: 'agencia-de-marketing-digital',
      nombreComercial: 'Agencia Digital Impulso',
      tecnologiaPerfil: {
        deltaPack: 'E',
        canonSubcategoriaId: 'agencia-de-marketing-digital',
        nombreComercial: 'Agencia Digital Impulso',
        tagline: 'Marketing y desarrollo.',
        serviciosEmpresaTI: ['Marketing', 'SEO'],
        especialidadesEmpresaTI: 'PyME',
        direccion: 'Monterrey',
        horarioDetalle: 'Lun–Vie',
      },
    },
    mustCard: ['res-card--tec-pack-e', 'Agencia Digital', 'res-card--negocio'],
    mustHydrate: ['__tecnologiaPack', 'E', 'Servicios desde'],
    vista: 'empresa',
    cardFn: 'cardHTMLNegocio',
  },
};

function run() {
  const ctx = loadStack();
  const TS = ctx.CariHubTecnologiaSectorRender;
  const RL = ctx.CariHubPublicRenderLite;
  const R = ctx.CariHubSectorContractRegistry;

  ok('renderer exportado', !!TS && typeof TS.hydrateDisplayFields === 'function');
  ok('registry demoBuilder tecnologia', R.resolveDemoBuilder('tecnologia') === 'plantillaDemoTecnologia');
  ok('registry nested tecnologia', R.resolveNestedKey('tecnologia') === 'tecnologiaPerfil');
  ok('isTecnologiaNegocio agencia', TS.isTecnologiaNegocioPerfil({ sectorId: 'tecnologia', subcategoriaId: 'agencia-de-marketing-digital', tecnologiaPerfil: { canonSubcategoriaId: 'agencia-de-marketing-digital' } }));

  Object.entries(PACK_SAMPLES).forEach(([pack, sample]) => {
    const u = JSON.parse(JSON.stringify(sample.u));
    const hydrated = TS.hydrateDisplayFields(u);
    ok(pack + ' — isTecnologiaSectorPerfil', TS.isTecnologiaSectorPerfil(u));
    ok(pack + ' — pack nested', hydrated.__tecnologiaPack === pack, hydrated.__tecnologiaPack);
    sample.mustHydrate.forEach((needle) => {
      ok(pack + ' — hydrate ' + needle, JSON.stringify(hydrated).indexOf(needle) >= 0);
    });
    if (sample.vista) ok(pack + ' — vista ' + sample.vista, TS.resolveVistaPerfil(u) === sample.vista);
    const cardHtml = RL[sample.cardFn](u, { categoria: 'Demo' });
    sample.mustCard.forEach((needle) => ok(pack + ' — card ' + needle, cardHtml.indexOf(needle) >= 0));
    ok(pack + ' — card sectorial', cardHtml.indexOf('res-card--tecnologia-sector') >= 0);
  });

  const demos = ctx.CariHubResultadosDemo.plantillaDemoTecnologia(
    { categoria: 'programador', pais: 'México', estado: 'Nuevo León', ciudad: 'Monterrey' },
    { sectorId: 'tecnologia', subcategoriaId: 'programador', componenteResultados: 'ResultCardServicio' }
  );
  ok('plantillaDemoTecnologia genera perfiles', Array.isArray(demos) && demos.length >= 2);
  if (demos && demos[0]) {
    ok('demo nested tecnologiaPerfil', !!demos[0].tecnologiaPerfil);
    ok('demo card sectorial', RL.cardHTMLServicio(demos[0], { categoria: 'Programador' }).indexOf('res-card--tecnologia-sector') >= 0);
  }

  const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
  ok('perfil-publico renderer', perfilHtml.includes('carihub-tecnologia-sector-render.js'));
  ok('resultados.html renderer', fs.readFileSync(path.join(repoRoot, 'public', 'resultados.html'), 'utf8').includes('carihub-tecnologia-sector-render.js'));

  console.log('\n=== QA Tecnologia sector render ===');
  console.log('PASS:', pass.length, 'FAIL:', fail.length);
  if (fail.length) {
    fail.forEach((f) => console.log('  ✗', f.name, f.detail ? '— ' + f.detail : ''));
    process.exit(1);
  }
  pass.forEach((p) => console.log('  ✓', p.name));
  console.log('\nOK —', pass.length + '/' + (pass.length + fail.length));
}

run();
