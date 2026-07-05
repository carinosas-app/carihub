/**
 * QA Fase 3 — Preview + Ficha sector Educación packs A–E
 * node scripts/qa-educacion-sector-render-v1.mjs
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
  loadScript('data/registro-educacion-sub-deltas.js', ctx);
  loadScript('data/registro-educacion-blocks.js', ctx);
  loadScript('carihub-educacion-sector-render.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  loadScript('resultados-demo.js', ctx);
  return ctx;
}

const PACK_SAMPLES = {
  A: {
    u: {
      sectorId: 'educacion',
      subcategoriaId: 'maestro-particular',
      alias: 'Maestro Particular MTY',
      educacionPerfil: {
        deltaPack: 'A',
        canonSubcategoriaId: 'maestro-particular',
        alias: 'Maestro Particular MTY',
        tagline: 'Clases personalizadas.',
        serviciosEducacion: ['Clases particulares'],
        materiasEducativas: ['Matemáticas'],
        modalidadEducacion: 'hibrido',
        tarifaDesde: '350',
        horarioDetalle: 'Lun–Sáb',
      },
    },
    mustCard: ['res-card--educacion-sector', 'res-card--edu-pack-a', 'Maestro Particular'],
    mustHydrate: ['__educacionPack', 'A', 'Tarifa desde', '$350'],
    vista: 'pro',
    cardFn: 'cardHTMLServicio',
  },
  B: {
    u: {
      sectorId: 'educacion',
      subcategoriaId: 'psicopedagogo',
      nombreProfesional: 'Lic. Ana Psicopedagoga',
      requiresCedula: true,
      educacionPerfil: {
        deltaPack: 'B',
        canonSubcategoriaId: 'psicopedagogo',
        nombreProfesional: 'Lic. Ana Psicopedagoga',
        tagline: 'Evaluación psicopedagógica.',
        serviciosProfesionalesEducacion: ['Evaluación'],
        especialidadEducativa: 'Psicopedagogía',
        precioConsulta: '600',
        horarioAtencion: 'Lun–Vie',
      },
    },
    mustCard: ['res-card--edu-pack-b', 'Lic. Ana', 'res-card--profesional'],
    mustHydrate: ['__educacionPack', 'B', 'Consulta desde', '$600'],
    vista: 'pro',
    cardFn: 'cardHTMLServicio',
  },
  D: {
    u: {
      sectorId: 'educacion',
      subcategoriaId: 'centro-de-capacitacion',
      nombreComercial: 'Centro de Capacitación Pro',
      educacionPerfil: {
        deltaPack: 'D',
        canonSubcategoriaId: 'centro-de-capacitacion',
        nombreComercial: 'Centro de Capacitación Pro',
        tagline: 'Cursos técnicos.',
        serviciosEmpresaEducacion: ['Capacitación'],
        nivelesEducativos: ['Técnico'],
        horarioDetalle: 'Lun–Vie',
      },
    },
    mustCard: ['res-card--edu-pack-d', 'Centro de Capacitación', 'res-card--negocio'],
    mustHydrate: ['__educacionPack', 'D', 'Servicios desde'],
    vista: 'empresa',
    cardFn: 'cardHTMLNegocio',
  },
};

function run() {
  const ctx = loadStack();
  const ES = ctx.CariHubEducacionSectorRender;
  const RL = ctx.CariHubPublicRenderLite;
  const R = ctx.CariHubSectorContractRegistry;

  ok('renderer exportado', !!ES && typeof ES.hydrateDisplayFields === 'function');
  ok('registry demoBuilder educacion', R.resolveDemoBuilder('educacion') === 'plantillaDemoEducacion');
  ok('registry nested educacion', R.resolveNestedKey('educacion') === 'educacionPerfil');
  ok('isEducacionCedula psicopedagogo', ES.isEducacionCedulaPerfil({ sectorId: 'educacion', subcategoriaId: 'psicopedagogo', educacionPerfil: { canonSubcategoriaId: 'psicopedagogo' } }));
  ok('isEducacionNegocio centro', ES.isEducacionNegocioPerfil({ sectorId: 'educacion', subcategoriaId: 'centro-de-capacitacion', educacionPerfil: { canonSubcategoriaId: 'centro-de-capacitacion' } }));
  ok('maestro NO negocio', !ES.isEducacionNegocioPerfil({ sectorId: 'educacion', subcategoriaId: 'maestro-particular', educacionPerfil: { canonSubcategoriaId: 'maestro-particular' } }));

  Object.entries(PACK_SAMPLES).forEach(([pack, sample]) => {
    const u = JSON.parse(JSON.stringify(sample.u));
    const hydrated = ES.hydrateDisplayFields(u);
    ok(pack + ' — isEducacionSectorPerfil', ES.isEducacionSectorPerfil(u));
    ok(pack + ' — pack nested', hydrated.__educacionPack === pack, hydrated.__educacionPack);
    sample.mustHydrate.forEach((needle) => {
      ok(pack + ' — hydrate ' + needle, JSON.stringify(hydrated).indexOf(needle) >= 0);
    });
    if (sample.vista) ok(pack + ' — vista ' + sample.vista, ES.resolveVistaPerfil(u) === sample.vista);
    const cardHtml = RL[sample.cardFn](u, { categoria: 'Demo' });
    sample.mustCard.forEach((needle) => ok(pack + ' — card ' + needle, cardHtml.indexOf(needle) >= 0));
    ok(pack + ' — card sectorial', cardHtml.indexOf('res-card--educacion-sector') >= 0);
  });

  const demos = ctx.CariHubResultadosDemo.plantillaDemoEducacion(
    { categoria: 'maestro-particular', pais: 'México', estado: 'Nuevo León', ciudad: 'Monterrey' },
    { sectorId: 'educacion', subcategoriaId: 'maestro-particular', componenteResultados: 'ResultCardServicio' }
  );
  ok('plantillaDemoEducacion genera perfiles', Array.isArray(demos) && demos.length >= 1);
  if (demos && demos[0]) {
    ok('demo nested educacionPerfil', !!demos[0].educacionPerfil);
    ok('demo card sectorial', RL.cardHTMLServicio(demos[0], { categoria: 'Maestro particular' }).indexOf('res-card--educacion-sector') >= 0);
  }

  const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
  ok('perfil-publico renderer', perfilHtml.includes('carihub-educacion-sector-render.js'));

  console.log('\n=== QA Educación sector render ===');
  console.log('PASS:', pass.length, 'FAIL:', fail.length);
  if (fail.length) {
    fail.forEach((f) => console.log('  ✗', f.name, f.detail ? '— ' + f.detail : ''));
    process.exit(1);
  }
  pass.forEach((p) => console.log('  ✓', p.name));
  console.log('\nOK —', pass.length + '/' + (pass.length + fail.length));
}

run();
