/**
 * QA Fase 3 — Preview + Ficha sector Mascotas packs A–E
 * node scripts/qa-mascotas-sector-render-v1.mjs
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
  loadScript('carihub-mascotas-sector-render.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  loadScript('resultados-demo.js', ctx);
  return ctx;
}

const PACK_SAMPLES = {
  A: {
    u: {
      sectorId: 'mascotas',
      subcategoriaId: 'paseador-de-perros',
      alias: 'Paseos Caninos MTY',
      mascotasPerfil: {
        deltaPack: 'A',
        canonSubcategoriaId: 'paseador-de-perros',
        tagline: 'Paseos diarios con reporte fotográfico.',
        serviciosMascotas: ['Paseo', 'Socialización'],
        especiesAtendidas: ['perros'],
        modalidadServicioMascotas: 'domicilio',
        tarifaDesde: '150',
        tiempoRespuestaMascotas: 'mismo_dia',
        coberturaGeografica: 'Monterrey centro',
      },
    },
    mustCard: ['res-card--mascotas-sector', 'res-card--masc-pack-a', 'Paseos Caninos'],
    mustHydrate: ['__mascotasPack', 'A', 'Tarifa desde', '$150'],
    cardFn: 'cardHTMLServicio',
    vista: 'pro',
  },
  B: {
    u: {
      sectorId: 'mascotas',
      subcategoriaId: 'entrenador-canino',
      alias: 'Adiestramiento Alfa',
      mascotasPerfil: {
        deltaPack: 'B',
        canonSubcategoriaId: 'entrenador-canino',
        tagline: 'Obediencia básica y corrección conductual.',
        serviciosMascotas: ['Obediencia básica'],
        especiesAtendidas: ['perros'],
        modalidadServicioMascotas: 'ambos',
        tarifaDesde: '450',
      },
    },
    mustCard: ['res-card--masc-pack-b', 'Adiestramiento Alfa'],
    mustHydrate: ['__mascotasPack', 'B', 'Tarifa desde'],
    cardFn: 'cardHTMLServicio',
    vista: 'pro',
  },
  C: {
    u: {
      sectorId: 'mascotas',
      subcategoriaId: 'groomer',
      alias: 'Groom & Style Pets',
      mascotasPerfil: {
        deltaPack: 'C',
        canonSubcategoriaId: 'groomer',
        tagline: 'Baño, corte y spa.',
        serviciosMascotas: ['Baño', 'Corte'],
        especiesAtendidas: ['perros', 'gatos'],
        modalidadServicioMascotas: 'instalaciones',
        tarifaDesde: '320',
      },
    },
    mustCard: ['res-card--masc-pack-c', 'Groom'],
    mustHydrate: ['__mascotasPack', 'C'],
    cardFn: 'cardHTMLServicio',
    vista: 'pro',
  },
  D: {
    u: {
      sectorId: 'mascotas',
      subcategoriaId: 'medico-veterinario',
      nombreProfesional: 'Dra. Vet. Laura Soto',
      cedulaVerificada: true,
      mascotasPerfil: {
        deltaPack: 'D',
        canonSubcategoriaId: 'medico-veterinario',
        tagline: 'Medicina general y vacunación.',
        especialidadVeterinaria: 'Medicina general',
        serviciosVeterinarios: ['Consulta', 'Vacunación'],
        especiesAtendidas: ['perros', 'gatos'],
        modalidadServicioMascotas: 'consultorio',
        precioConsulta: '550',
        emergenciasMascotas: 'si_horario',
      },
    },
    mustCard: ['res-card--masc-pack-d', 'Laura Soto', 'Cédula verificada'],
    mustHydrate: ['__mascotasPack', 'D', 'Consulta desde', '$550'],
    cardFn: 'cardHTMLProfesional',
    vista: 'pro',
  },
  E: {
    u: {
      sectorId: 'mascotas',
      subcategoriaId: 'clinica-veterinaria',
      nombreComercial: 'Clínica Veterinaria del Valle',
      mascotasPerfil: {
        deltaPack: 'D',
        canonSubcategoriaId: 'clinica-veterinaria',
        tagline: 'Hospitalización y cirugía.',
        serviciosEmpresaMascotas: ['Consulta', 'Cirugía', 'Hospitalización'],
        especialidadesEmpresaMascotas: 'Medicina interna',
        capacidadInstalacion: '12 camas',
        emergenciasMascotas: 'si_24h',
        modalidadServicioMascotas: 'clinica',
        tarifaDesde: 'Consultar',
      },
    },
    mustCard: ['res-card--masc-pack-d', 'Clínica Veterinaria', 'res-card--negocio'],
    mustHydrate: ['__mascotasPack', 'D', 'Servicios desde'],
    cardFn: 'cardHTMLNegocio',
    vista: 'empresa',
  },
};

function run() {
  const ctx = loadStack();
  const MS = ctx.CariHubMascotasSectorRender;
  const RL = ctx.CariHubPublicRenderLite;
  const R = ctx.CariHubSectorContractRegistry;

  ok('renderer exportado', !!MS && typeof MS.hydrateDisplayFields === 'function');
  ok('registry demoBuilder mascotas', R.resolveDemoBuilder('mascotas') === 'plantillaDemoMascotas');
  ok('registry nested mascotas', R.resolveNestedKey('mascotas') === 'mascotasPerfil');

  Object.entries(PACK_SAMPLES).forEach(([pack, sample]) => {
    const u = JSON.parse(JSON.stringify(sample.u));
    const hydrated = MS.hydrateDisplayFields(u);
    ok(pack + ' — isMascotasSectorPerfil', MS.isMascotasSectorPerfil(u));
    ok(pack + ' — pack nested', !!hydrated.__mascotasPack, hydrated.__mascotasPack);
    sample.mustHydrate.forEach((needle) => {
      const blob = JSON.stringify(hydrated);
      ok(pack + ' — hydrate contiene ' + needle, blob.indexOf(needle) >= 0);
    });
    if (sample.vista) {
      ok(pack + ' — vista ' + sample.vista, MS.resolveVistaPerfil(u) === sample.vista);
    }
    const cardFn = RL[sample.cardFn];
    const cardHtml = cardFn(u, { categoria: 'Demo' });
    sample.mustCard.forEach((needle) => {
      ok(pack + ' — card contiene ' + needle, cardHtml.indexOf(needle) >= 0);
    });
  });

  const demoQ = { categoria: 'paseador-de-perros', pais: 'México', estado: 'Nuevo León', ciudad: 'Monterrey' };
  const demos = ctx.CariHubResultadosDemo.plantillaDemoMascotas(demoQ, {
    sectorId: 'mascotas',
    subcategoriaId: 'paseador-de-perros',
    componenteResultados: 'ResultCardServicio',
  });
  ok('plantillaDemoMascotas genera perfiles', Array.isArray(demos) && demos.length >= 2, String(demos && demos.length));
  if (demos && demos[0]) {
    ok('demo nested mascotasPerfil', !!demos[0].mascotasPerfil && demos[0].mascotasPerfil.deltaPack);
    const demoCard = RL.cardHTMLServicio(demos[0], { categoria: 'Paseador de perros' });
    ok('demo card sectorial', demoCard.indexOf('res-card--mascotas-sector') >= 0);
    ok('demo sectorId mascotas', demos[0].sectorId === 'mascotas');
  }

  const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
  ok('perfil-publico incluye renderer', perfilHtml.includes('carihub-mascotas-sector-render.js'));
  ok('perfil-publico applyMascotasSectorHydrate', perfilHtml.includes('applyMascotasSectorHydrate'));
  ok('perfil-publico mascotasBadgesHTML', perfilHtml.includes('mascotasBadgesHTML'));

  const resultadosHtml = fs.readFileSync(path.join(repoRoot, 'public', 'resultados.html'), 'utf8');
  ok('resultados.html incluye renderer', resultadosHtml.includes('carihub-mascotas-sector-render.js'));

  console.log('\n=== QA Mascotas sector render ===');
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
