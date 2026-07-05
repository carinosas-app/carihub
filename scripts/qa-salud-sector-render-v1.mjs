/**
 * QA Fase 3 — Preview + Ficha sector Salud packs A–H
 * node scripts/qa-salud-sector-render-v1.mjs
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
  loadScript('data/registro-salud-sub-deltas.js', ctx);
  loadScript('data/registro-salud-blocks.js', ctx);
  loadScript('carihub-salud-sector-render.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  loadScript('resultados-demo.js', ctx);
  return ctx;
}

const PACK_SAMPLES = {
  A: {
    u: {
      sectorId: 'salud',
      subcategoriaId: 'medicos-generales',
      nombreProfesional: 'Dra. Ana Lucía Méndez',
      cedulaVerificada: true,
      saludPerfil: {
        deltaPack: 'A',
        canonSubcategoriaId: 'medicos-generales',
        nombreProfesional: 'Dra. Ana Lucía Méndez',
        tagline: 'Medicina general y seguimiento.',
        especialidad: 'Medicina general',
        serviciosProfesionales: ['Consulta general', 'Control crónico'],
        segurosAceptados: 'GNP · Particular',
        consultaEnLinea: true,
        precioConsulta: '800',
        horarioAtencion: 'Lun–Vie 9:00–19:00',
      },
    },
    mustCard: ['res-card--salud-sector', 'res-card--sal-pack-a', 'Dra. Ana'],
    mustHydrate: ['__saludPack', 'A', 'Consulta desde', '$800'],
    vista: 'pro',
    cardFn: 'cardHTMLProfesional',
  },
  B: {
    u: {
      sectorId: 'salud',
      subcategoriaId: 'dermatologia',
      alias: 'Dr. García · Dermatología',
      saludPerfil: {
        deltaPack: 'B',
        canonSubcategoriaId: 'dermatologia',
        alias: 'Dr. García · Dermatología',
        tagline: 'Dermatología clínica.',
        especialidadServicio: 'Dermatología',
        modalidadConsulta: 'hibrido',
        tarifaDesde: '950',
        horarioDetalle: 'Mar–Sáb',
      },
    },
    mustCard: ['res-card--sal-pack-b', 'Dermatología'],
    mustHydrate: ['__saludPack', 'B', 'Tarifa desde', '$950'],
    vista: 'pro',
    cardFn: 'cardHTMLServicio',
  },
  F: {
    u: {
      sectorId: 'salud',
      subcategoriaId: 'clinicas-medicas',
      nombreComercial: 'Clínica Integral Sur',
      saludPerfil: {
        deltaPack: 'F',
        canonSubcategoriaId: 'clinicas-medicas',
        nombreComercial: 'Clínica Integral Sur',
        tagline: 'Consulta externa y urgencias.',
        serviciosClinica: ['Consulta externa', 'Urgencias'],
        especialidadesClinica: 'Medicina general',
        urgencias24h: true,
        direccion: 'Monterrey',
        horarioDetalle: '24 horas',
      },
    },
    mustCard: ['res-card--sal-pack-f', 'Clínica Integral', 'res-card--negocio'],
    mustHydrate: ['__saludPack', 'F', 'Servicios desde'],
    vista: 'empresa',
    cardFn: 'cardHTMLNegocio',
  },
  G: {
    u: {
      sectorId: 'salud',
      subcategoriaId: 'hospitales-privados',
      nombreComercial: 'Hospital Privado Las Palmas',
      saludPerfil: {
        deltaPack: 'G',
        canonSubcategoriaId: 'hospitales-privados',
        nombreComercial: 'Hospital Privado Las Palmas',
        tagline: 'Hospitalización y urgencias.',
        serviciosHospital: ['Urgencias', 'Hospitalización'],
        nivelesAtencion: ['Tercer nivel'],
        urgencias24h: true,
        direccion: 'Monterrey',
      },
    },
    mustCard: ['res-card--sal-pack-g', 'Hospital Privado'],
    mustHydrate: ['__saludPack', 'G'],
    vista: 'empresa',
    cardFn: 'cardHTMLNegocio',
  },
};

function run() {
  const ctx = loadStack();
  const SS = ctx.CariHubSaludSectorRender;
  const RL = ctx.CariHubPublicRenderLite;
  const R = ctx.CariHubSectorContractRegistry;

  ok('renderer exportado', !!SS && typeof SS.hydrateDisplayFields === 'function');
  ok('registry demoBuilder salud', R.resolveDemoBuilder('salud') === 'plantillaDemoSalud');
  ok('registry nested salud', R.resolveNestedKey('salud') === 'saludPerfil');
  ok('isSaludCedula pack A', SS.isSaludCedulaPerfil({ sectorId: 'salud', subcategoriaId: 'medicos-generales', saludPerfil: { canonSubcategoriaId: 'medicos-generales' } }));
  ok('isSaludNegocio pack F', SS.isSaludNegocioPerfil({ sectorId: 'salud', subcategoriaId: 'clinicas-medicas', saludPerfil: { canonSubcategoriaId: 'clinicas-medicas' } }));

  Object.entries(PACK_SAMPLES).forEach(([pack, sample]) => {
    const u = JSON.parse(JSON.stringify(sample.u));
    const hydrated = SS.hydrateDisplayFields(u);
    ok(pack + ' — isSaludSectorPerfil', SS.isSaludSectorPerfil(u));
    ok(pack + ' — pack nested', hydrated.__saludPack === pack, hydrated.__saludPack);
    sample.mustHydrate.forEach((needle) => {
      const blob = JSON.stringify(hydrated);
      ok(pack + ' — hydrate contiene ' + needle, blob.indexOf(needle) >= 0);
    });
    if (sample.vista) {
      ok(pack + ' — vista ' + sample.vista, SS.resolveVistaPerfil(u) === sample.vista);
    }
    const cardHtml = RL[sample.cardFn](u, { categoria: 'Demo' });
    sample.mustCard.forEach((needle) => {
      ok(pack + ' — card contiene ' + needle, cardHtml.indexOf(needle) >= 0);
    });
    ok(pack + ' — card sectorial', cardHtml.indexOf('res-card--salud-sector') >= 0);
  });

  const demoQ = { categoria: 'medicos-generales', pais: 'México', estado: 'Nuevo León', ciudad: 'Monterrey' };
  const demos = ctx.CariHubResultadosDemo.plantillaDemoSalud(demoQ, {
    sectorId: 'salud',
    subcategoriaId: 'medicos-generales',
    componenteResultados: 'ResultCardProfesional',
  });
  ok('plantillaDemoSalud genera perfiles', Array.isArray(demos) && demos.length >= 2, String(demos && demos.length));
  if (demos && demos[0]) {
    ok('demo nested saludPerfil', !!demos[0].saludPerfil && demos[0].saludPerfil.deltaPack);
    const demoCard = RL.cardHTMLProfesional(demos[0], { categoria: 'Médicos generales' });
    ok('demo card sectorial', demoCard.indexOf('res-card--salud-sector') >= 0);
    ok('demo sectorId salud', demos[0].sectorId === 'salud');
    ok('demo pack A cedula', demos[0].saludPerfil.deltaPack === 'A');
  }

  const demoClinica = ctx.CariHubResultadosDemo.plantillaDemoSalud(
    { categoria: 'clinicas-medicas', pais: 'México', estado: 'Nuevo León', ciudad: 'Monterrey' },
    { sectorId: 'salud', subcategoriaId: 'clinicas-medicas', componenteResultados: 'ResultCardNegocio' }
  );
  if (demoClinica && demoClinica[0]) {
    const negCard = RL.cardHTMLNegocio(demoClinica[0], { categoria: 'Clínicas médicas' });
    ok('demo clinica card negocio sectorial', negCard.indexOf('res-card--salud-sector') >= 0);
    ok('demo clinica pack F', demoClinica[0].saludPerfil.deltaPack === 'F');
  }

  const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
  ok('perfil-publico incluye renderer', perfilHtml.includes('carihub-salud-sector-render.js'));
  ok('perfil-publico applySaludSectorHydrate', perfilHtml.includes('applySaludSectorHydrate'));
  ok('perfil-publico saludBadgesHTML', perfilHtml.includes('saludBadgesHTML'));

  const resultadosHtml = fs.readFileSync(path.join(repoRoot, 'public', 'resultados.html'), 'utf8');
  ok('resultados.html incluye renderer', resultadosHtml.includes('carihub-salud-sector-render.js'));

  const registroHtml = fs.readFileSync(path.join(repoRoot, 'public', 'registro-perfil.html'), 'utf8');
  ok('registro-perfil.html incluye renderer', registroHtml.includes('carihub-salud-sector-render.js'));

  console.log('\n=== QA Salud sector render ===');
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
