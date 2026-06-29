/**
 * QA Fase 3 — Preview + Ficha sector Bienestar packs A–H
 * node scripts/qa-bienestar-sector-render-v1.mjs
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
  loadScript('data/registro-bienestar-blocks.js', ctx);
  loadScript('data/registro-adultos-bienestar-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  loadScript('resultados-demo.js', ctx);
  loadScript('carihub-field-engine-lite.js', ctx);
  loadScript('carihub-bienestar-sector-render.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  return ctx;
}

const PACK_SAMPLES = {
  A: {
    sub: 'reiki',
    ctx: { sectorId: 'bienestar', subcategoriaId: 'reiki', formularioId: 'persona_independiente' },
    values: {
      alias: 'Luna Reiki',
      certificaciones: 'Certificación Usui Reiki Nivel II',
      tarifaDesde: '$600',
      horarioDetalle: 'Lun–Sáb 10–19h',
      modalidadesTerapia: ['Masaje', 'Energética manual'],
      duracionSesionMinutos: '60_min',
      contraindicacionesGenerales: 'No embarazo avanzado.',
    },
    mustCard: ['res-card--bienestar-holistico', 'res-card--pack-a', 'Luna Reiki'],
    mustHydrate: ['modalidadesTerapia', 'Terapia holística'],
    mustNotCard: ['res-card--pack-h', 'carrito'],
  },
  B: {
    sub: 'yoga',
    ctx: { sectorId: 'bienestar', subcategoriaId: 'yoga', formularioId: 'persona_independiente' },
    values: {
      alias: 'Flow Yoga MX',
      certificaciones: 'RYT-200',
      tarifaDesde: '$350',
      horarioDetalle: 'Ma–Do 7–20h',
      tipoPractica: 'Hatha / Vinyasa',
      modalidadClase: 'hibrido',
      nivelesAtendidos: 'todos',
    },
    mustCard: ['res-card--pack-b', 'Flow Yoga'],
    mustHydrate: ['Hatha', 'Movimiento'],
    mustNotCard: ['disclaimerRegulado'],
  },
  C: {
    sub: 'centros-holisticos',
    ctx: { sectorId: 'bienestar', subcategoriaId: 'centros-holisticos', formularioId: 'persona_independiente' },
    values: {
      alias: 'Centro Om',
      certificaciones: 'Espacio holístico certificado',
      tarifaDesde: 'Consultar',
      horarioDetalle: 'Diario 9–21h',
      serviciosCentro: ['Terapias individuales', 'Talleres'],
      capacidadGrupo: '15',
    },
    mustCard: ['res-card--pack-c', 'Centro Om'],
    mustHydrate: ['Terapias individuales', 'Centro'],
  },
  D: {
    sub: 'productos-naturistas',
    ctx: { sectorId: 'bienestar', subcategoriaId: 'productos-naturistas', formularioId: 'persona_independiente' },
    values: {
      alias: 'Natura Viva',
      certificaciones: 'Comercio natural',
      tarifaDesde: 'Varios',
      horarioDetalle: 'Lun–Sáb',
      categoriasProductoBienestar: ['Inciensos', 'Aceites'],
      surtidoPrincipal: 'Inciensos artesanales',
      ventaPresencial: 'Sí',
    },
    mustCard: ['res-card--pack-d', 'Natura Viva'],
    mustHydrate: ['Inciensos', 'Productos naturales'],
    mustNotCard: ['e-commerce', 'carrito'],
  },
  D_RETAIL: {
    sub: 'venta-de-inciensos',
    ctx: { sectorId: 'bienestar', subcategoriaId: 'venta-de-inciensos', formularioId: 'negocio_empresa' },
    values: {
      nombreComercial: 'Aromas del Valle',
      categoriasProductoBienestar: ['Inciensos', 'Sahumerios'],
      surtidoPrincipal: 'Resinas e inciensos',
      direccion: 'Centro, Oaxaca',
      horarioDetalle: '10–19h',
    },
    mustCard: ['Aromas del Valle', 'res-card--pack-d'],
    mustHydrate: ['Aromas del Valle', 'Productos naturales'],
    vista: 'empresa',
    mustNotCard: ['envío', 'carrito'],
  },
  E: {
    sub: 'tarot',
    ctx: { sectorId: 'bienestar', subcategoriaId: 'tarot', formularioId: 'persona_independiente' },
    values: {
      alias: 'Oráculo Luna',
      certificaciones: 'Tarot terapéutico',
      tarifaDesde: '$450',
      horarioDetalle: 'Con cita',
      enfoqueEspiritual: 'Lectura simbólica sin diagnóstico médico.',
      modalidadLectura: 'ambas',
    },
    mustCard: ['res-card--pack-e', 'Oráculo'],
    mustHydrate: ['Espiritualidad', 'simbólica'],
  },
  F: {
    sub: 'coaching-de-vida',
    ctx: { sectorId: 'bienestar', subcategoriaId: 'coaching-de-vida', formularioId: 'persona_independiente' },
    values: {
      alias: 'Coach Vital',
      certificaciones: 'Coaching ontológico',
      tarifaDesde: '$800',
      horarioDetalle: 'Citas',
      areaCoaching: 'Propósito y transiciones',
      modalidadSesionCoaching: 'individual',
    },
    mustCard: ['res-card--pack-f', 'Coach Vital'],
    mustHydrate: ['Coaching', 'Propósito'],
  },
  G: {
    sub: 'retiros-espirituales',
    ctx: { sectorId: 'bienestar', subcategoriaId: 'retiros-espirituales', formularioId: 'persona_independiente' },
    values: {
      alias: 'Retiro Sol',
      certificaciones: 'Facilitador de retiros',
      tarifaDesde: 'Consultar',
      horarioDetalle: 'Por temporada',
      tipoExperiencia: 'retiro',
      fechasExperiencia: 'Marzo 2026',
      lugarExperiencia: 'Tepoztlán',
      cupoMaximo: '12',
    },
    mustCard: ['res-card--pack-g', 'Retiro Sol'],
    mustHydrate: ['Retiro', 'Tepoztlán'],
  },
  H: {
    sub: 'ceremonias-ayahuasca-rape-plantas-de-poder',
    ctx: { sectorId: 'bienestar', subcategoriaId: 'ceremonias-ayahuasca-rape-plantas-de-poder', formularioId: 'persona_independiente' },
    values: {
      alias: 'Centro Ceremonial',
      certificaciones: 'Facilitador con experiencia',
      tarifaDesde: 'Consultar contribución',
      horarioDetalle: 'Por calendario',
      disclaimerRegulado: true,
      edadMinimaServicio: '18',
      jurisdiccionDeclarada: 'México — Oaxaca',
      contraindicacionesObligatorias: 'No apto con ciertos medicamentos.',
      tipoExperienciaCeremonial: 'ceremonia_guiada',
      acompanamientoCeremonial: ['Antes', 'Durante', 'Después'],
      requisitosPrevios: 'Ayuno ligero.',
      fechasCeremonia: 'Consultar calendario',
      cupoCeremonia: '8',
      lugarCeremonia: 'Centro de retiro',
    },
    mustCard: ['res-card--pack-h', 'res-badge--regulada', 'Ceremonia guiada'],
    mustHydrate: ['Jurisdicción', 'Contribución', 'Solicitar información'],
    mustNotCard: ['carrito', 'e-commerce', 'stock', 'dosis', 'precio por sustancia', 'catálogo comercial'],
    mustNotHydrate: ['envioDomicilio', 'tiendaOnline'],
  },
};

const ctx = loadStack();
const PB = ctx.CariHubRegistroPublicBlocks;
const PR = ctx.CariHubPublicRenderLite;
const BR = ctx.CariHubBienestarSectorRender;

ok('render module loaded', !!BR && typeof BR.hydrateDisplayFields === 'function');
ok('cardHTMLBienestarSector export', typeof PR.cardHTMLBienestarSector === 'function');
ok('isBienestarSectorPerfil export', typeof PR.isBienestarSectorPerfil === 'function');

function buildPerfil(sampleKey) {
  const sample = PACK_SAMPLES[sampleKey];
  const cfg = ctx.CARIHUB_REGISTRO_BIENESTAR_SECTOR_BLOCKS.buildConfig(sample.ctx);
  const bloques = Object.assign({ deltaPack: cfg.deltaPack }, sample.values);
  return PB.mapBienestarSectorToPerfil(
    { subcategoriaId: sample.sub, categoria: sample.sub, sectorId: 'bienestar' },
    bloques,
    sample.ctx
  );
}

for (const [key, sample] of Object.entries(PACK_SAMPLES)) {
  const u = buildPerfil(key);
  ok(`${key} mapToPerfil bienestarHolisticoPerfil`, !!u.bienestarHolisticoPerfil);
  ok(`${key} mapToPerfil sectorId`, u.sectorId === 'bienestar', u.sectorId);
  ok(`${key} isBienestarSectorPerfil`, BR.isBienestarSectorPerfil(u));
  ok(`${key} NOT adultos bienestar`, !BR.isAdultosBienestar(u));

  const hydrated = BR.hydrateDisplayFields(Object.assign({}, u));
  ok(`${key} hydrate __bienestarPack`, !!hydrated.__bienestarPack);
  for (const needle of sample.mustHydrate || []) {
    const blob = JSON.stringify(hydrated);
    ok(`${key} hydrate contains ${needle}`, blob.toLowerCase().includes(String(needle).toLowerCase()));
  }
  for (const bad of sample.mustNotHydrate || []) {
    ok(`${key} hydrate sin ${bad}`, hydrated[bad] == null || hydrated[bad] === false);
  }

  if (sample.vista) {
    ok(`${key} vista ${sample.vista}`, BR.resolveVistaPerfil(u) === sample.vista, BR.resolveVistaPerfil(u));
  } else if (key !== 'D_RETAIL') {
    ok(`${key} vista pro`, BR.resolveVistaPerfil(u) === 'pro', BR.resolveVistaPerfil(u));
  }

  const card = PR.cardHTML(u, { categoria: sample.sub });
  for (const needle of sample.mustCard || []) {
    ok(`${key} card contains ${needle}`, card.includes(needle));
  }
  for (const bad of sample.mustNotCard || []) {
    ok(`${key} card NOT ${bad}`, !card.toLowerCase().includes(String(bad).toLowerCase()));
  }
  ok(`${key} card sin innerHTML user`, !card.includes('<script'));
}

// Pack H — validatePackH still blocks commercial language
const packHApi = ctx.CARIHUB_REGISTRO_BIENESTAR_SECTOR_BLOCKS;
const badH = {
  disclaimerRegulado: true,
  edadMinimaServicio: '18',
  jurisdiccionDeclarada: 'MX',
  contraindicacionesObligatorias: 'x',
  tarifaDesde: 'comprar ayahuasca por gramo',
};
ok('Pack H validate rejects commercial', packHApi.validatePackH(badH).length > 0);

// Spa adultos regression — must NOT route to sector render
const spaU = PB.mapBienestarToPerfil(
  { subcategoriaId: 'spa', arquetipo: 'negocio_bienestar' },
  PB.finalizeBienestarValues({ nombreComercial: 'Spa X', menuServicios: 'Masaje' }, { subcategoriaId: 'spa', arquetipo: 'negocio_bienestar' }),
  { subcategoriaId: 'spa', arquetipo: 'negocio_bienestar' }
);
ok('spa NOT bienestar sector', !BR.isBienestarSectorPerfil(spaU));
ok('spa still isBienestarPerfil', PR.isBienestarPerfil(spaU));
const spaCard = PR.cardHTML(spaU, { categoria: 'Spa' });
ok('spa card res-card--bienestar adultos', spaCard.includes('res-card--bienestar') && !spaCard.includes('res-card--bienestar-holistico'));

// Persistencia nested
const hU = buildPerfil('H');
ok('Pack H flags persist', hU.sensible === true && hU.regulada === true && hU.requiresAdminReview === true);

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
ok('perfil-publico includes render module', perfilHtml.includes('carihub-bienestar-sector-render.js'));
ok('perfil-publico bienestarHolisticoPerfil preview', perfilHtml.includes('bienestarHolisticoPerfil'));
ok('perfil-publico applyBienestarSectorHydrate', perfilHtml.includes('applyBienestarSectorHydrate'));

const regHtml = fs.readFileSync(path.join(repoRoot, 'public', 'registro-perfil.html'), 'utf8');
ok('registro-perfil includes render module', regHtml.includes('carihub-bienestar-sector-render.js'));

console.log('\n=== QA BIENESTAR SECTOR RENDER Fase 3 ===');
console.log('PASS:', pass.length);
console.log('FAIL:', fail.length);
if (fail.length) {
  fail.slice(0, 40).forEach((f) => console.log(' FAIL', f.name, f.detail || ''));
  process.exit(1);
}
console.log('OK — preview/ficha sector Bienestar packs A–H');
