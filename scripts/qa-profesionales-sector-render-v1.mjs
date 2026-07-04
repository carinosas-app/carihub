/**
 * QA Fase 3 — Preview + Ficha sector Profesionales packs A–H
 * node scripts/qa-profesionales-sector-render-v1.mjs
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
  loadScript('carihub-profesionales-sector-render.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  loadScript('resultados-demo.js', ctx);
  return ctx;
}

const PACK_SAMPLES = {
  A: {
    u: {
      sectorId: 'profesionales',
      subcategoriaId: 'abogados',
      nombreProfesional: 'Lic. Ana Torres',
      cedulaVerificada: true,
      profesionalesPerfil: {
        deltaPack: 'A',
        canonSubcategoriaId: 'abogados',
        tagline: 'Derecho familiar y sucesiones.',
        especialidadProfesional: 'Derecho familiar',
        serviciosProfesionales: ['Consulta', 'Asesoría'],
        modalidadAtencionProfesional: 'hibrido',
        precioConsulta: '1200',
        horarioAtencion: 'Lun–Vie 9:00–18:00',
        areasDerecho: ['Familiar', 'Civil'],
      },
    },
    mustCard: ['res-card--profesionales-sector', 'res-card--prof-pack-a', 'Lic. Ana Torres', 'Cédula verificada'],
    mustHydrate: ['__profesionalesPack', 'A', 'Consulta desde', '$1200'],
    vista: 'pro',
  },
  B: {
    u: {
      sectorId: 'profesionales',
      subcategoriaId: 'despachos-juridicos',
      alias: 'Despacho Vega & Asoc.',
      profesionalesPerfil: {
        deltaPack: 'B',
        canonSubcategoriaId: 'despachos-juridicos',
        tagline: 'Litigio mercantil y laboral.',
        serviciosDespacho: ['Litigio', 'Contratos'],
        areasPracticaDespacho: ['Mercantil', 'Laboral'],
        tamanoEquipoDespacho: 'mediano_6_15',
        modalidadAtencionProfesional: 'consultorio',
        tarifaDesde: '2500',
        horarioDetalle: 'Lun–Vie 8:00–19:00',
      },
    },
    mustCard: ['res-card--prof-pack-b', 'Despacho Vega'],
    mustHydrate: ['Despacho', 'Tarifa desde'],
    vista: 'pro',
  },
  H: {
    u: {
      sectorId: 'profesionales',
      subcategoriaId: 'consultoria-empresarial',
      nombreComercial: 'Consultoría Integral del Norte',
      profesionalesPerfil: {
        deltaPack: 'H',
        canonSubcategoriaId: 'consultoria-empresarial',
        tagline: 'Estrategia y operaciones para PyME.',
        serviciosEmpresariales: ['Estrategia', 'Operaciones'],
        especialidadesEmpresa: 'Manufactura · Retail',
        tamanoEmpresaAtendida: ['PyME', 'Mediana'],
        tarifaDesde: 'Consultar',
        horarioDetalle: 'Lun–Vie 8:00–18:00',
      },
    },
    mustCard: ['res-card--prof-pack-h', 'Consultoría Integral'],
    mustHydrate: ['__profesionalesPack', 'H', 'Servicios desde'],
    vista: 'empresa',
  },
};

function run() {
  const ctx = loadStack();
  const PS = ctx.CariHubProfesionalesSectorRender;
  const RL = ctx.CariHubPublicRenderLite;
  const R = ctx.CariHubSectorContractRegistry;

  ok('renderer exportado', !!PS && typeof PS.hydrateDisplayFields === 'function');
  ok('registry demoBuilder profesionales', R.resolveDemoBuilder('profesionales') === 'plantillaDemoProfesionales');

  Object.entries(PACK_SAMPLES).forEach(([pack, sample]) => {
    const u = JSON.parse(JSON.stringify(sample.u));
    const hydrated = PS.hydrateDisplayFields(u);
    ok(pack + ' — isProfesionalesSectorPerfil', PS.isProfesionalesSectorPerfil(u));
    ok(pack + ' — pack nested', hydrated.__profesionalesPack === pack, hydrated.__profesionalesPack);
    sample.mustHydrate.forEach((needle) => {
      const blob = JSON.stringify(hydrated);
      ok(pack + ' — hydrate contiene ' + needle, blob.indexOf(needle) >= 0);
    });
    if (sample.vista) {
      ok(pack + ' — vista ' + sample.vista, PS.resolveVistaPerfil(u) === sample.vista);
    }
    const cardHtml = RL.cardHTMLProfesional(u, { categoria: 'Demo' });
    sample.mustCard.forEach((needle) => {
      ok(pack + ' — card contiene ' + needle, cardHtml.indexOf(needle) >= 0);
    });
  });

  const demoQ = { categoria: 'abogados', pais: 'México', estado: 'Nuevo León', ciudad: 'Monterrey' };
  const demos = ctx.CariHubResultadosDemo.plantillaDemoProfesionales(demoQ, {
    sectorId: 'profesionales',
    subcategoriaId: 'abogados',
    componenteResultados: 'ResultCardProfesional',
  });
  ok('plantillaDemoProfesionales genera perfiles', Array.isArray(demos) && demos.length >= 2, String(demos && demos.length));
  if (demos && demos[0]) {
    ok('demo nested profesionalesPerfil', !!demos[0].profesionalesPerfil && demos[0].profesionalesPerfil.deltaPack);
    const demoCard = RL.cardHTMLProfesional(demos[0], { categoria: 'Abogados' });
    ok('demo card sectorial', demoCard.indexOf('res-card--profesionales-sector') >= 0);
  }

  const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
  ok('perfil-publico incluye renderer', perfilHtml.includes('carihub-profesionales-sector-render.js'));

  console.log('\n=== QA Profesionales sector render ===');
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
