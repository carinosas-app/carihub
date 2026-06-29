/**
 * QA Fase 3 — Preview + Ficha sector Eventos (MP-EVENTOS-DELTAS-V1)
 * node scripts/qa-eventos-sector-render-v1.mjs
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
  loadScript('data/registro-eventos-blocks.js', ctx);
  loadScript('data/registro-bienestar-blocks.js', ctx);
  loadScript('data/registro-adultos-bienestar-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  loadScript('resultados-demo.js', ctx);
  loadScript('carihub-field-engine-lite.js', ctx);
  loadScript('carihub-bienestar-sector-render.js', ctx);
  loadScript('carihub-eventos-sector-render.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  return ctx;
}

const CASES = {
  ESPACIOS: {
    sub: 'espacios-para-eventos',
    ctx: { sectorId: 'eventos', subcategoriaId: 'espacios-para-eventos', formularioId: 'negocio_empresa' },
    values: {
      nombreComercial: 'Salón Jardín QA',
      tiposEspacio: ['salon', 'jardin'],
      tiposEventoAceptados: ['bodas', 'xv_anos'],
      capacidadMin: 50,
      capacidadMax: 300,
      estacionamientoCupo: 80,
      cateringPolitica: 'externo_permitido',
      permiteMusicaEnVivo: true,
      permitePirotecnia: false,
      restriccionRuido: '22:00',
      cotizacionDesde: '$25,000',
      unidadCotizacion: 'evento',
      ciudad: 'Guadalajara',
      estado: 'Jalisco',
    },
    mustCard: ['Salón Jardín QA', 'res-card--eventos', 'res-card--ev-venue'],
    mustHydrate: ['Capacidad mínima', 'Catering', 'Estacionamiento'],
    mustNotCard: ['res-card--bienestar', 'Especialidad genérica'],
    vista: 'empresa',
  },
  GRUPOS_FARA: {
    sub: 'grupos-musicales-eventos',
    ctx: { sectorId: 'eventos', subcategoriaId: 'grupos-musicales-eventos', formularioId: 'persona_independiente' },
    values: {
      alias: 'Fara Fara Norte QA',
      tipoAgrupacion: 'fara_fara',
      descripcionFormatoFaraFara: 'Formato tradicional con trompeta y tambora.',
      numeroIntegrantes: 8,
      repertorioPrincipal: 'Regional mexicano',
      duracionSetMinutos: 90,
      incluyeSonidoMusica: true,
      cotizacionDesde: '$18,000',
      unidadCotizacion: 'evento',
    },
    mustCard: ['Fara Fara Norte QA', 'Fara Fara', 'res-card--ev-music'],
    mustHydrate: ['Integrantes', 'Fara Fara', 'Formato Fara Fara'],
    mustBadges: ['Fara Fara'],
    vista: 'pro',
  },
  SHOW_ADULTO: {
    sub: 'shows-para-eventos',
    ctx: { sectorId: 'eventos', subcategoriaId: 'shows-para-eventos', formularioId: 'persona_independiente' },
    values: {
      alias: 'Mago Corporativo QA',
      tipoShow: ['mago'],
      publicoObjetivo: 'adultos',
      contenidoSensible: false,
      duracionShowMinutos: 45,
      numeroArtistas: 1,
      incluyeAudioShow: true,
      cotizacionDesde: '$8,500',
      unidadCotizacion: 'evento',
    },
    mustCard: ['Mago Corporativo QA', 'res-card--ev-show'],
    mustHydrate: ['Duración', 'Artistas'],
    mustNotHydrate: ['Contenido sensible'],
    mustNotBadges: ['Contenido sensible'],
    vista: 'pro',
  },
  SHOW_SENSIBLE: {
    sub: 'shows-para-eventos',
    ctx: { sectorId: 'eventos', subcategoriaId: 'shows-para-eventos', formularioId: 'persona_independiente' },
    values: {
      alias: 'Show Strip QA',
      tipoShow: ['strippers'],
      publicoObjetivo: 'adultos',
      contenidoSensible: true,
      duracionShowMinutos: 30,
      numeroArtistas: 2,
      requiereCamerinoPrivado: true,
      cotizacionDesde: '$12,000',
      unidadCotizacion: 'evento',
    },
    mustCard: ['Show Strip QA', 'res-badge--sensible'],
    mustHydrate: ['Contenido sensible', 'Revisión administrativa'],
    mustBadges: ['Contenido sensible'],
    flags: { sensible: true, requiresAdminReview: true },
    vista: 'pro',
  },
  FOTO_DRON: {
    sub: 'fotografia-video-eventos',
    ctx: { sectorId: 'eventos', subcategoriaId: 'fotografia-video-eventos', formularioId: 'persona_independiente' },
    values: {
      alias: 'Lens Aerial QA',
      serviciosAudiovisual: ['foto', 'dron'],
      especialidadesEvento: ['bodas', 'corporativo'],
      horasCobertura: 8,
      tiempoEntregaDias: 15,
      licenciaDron: true,
      cotizacionDesde: '$15,000',
      unidadCotizacion: 'evento',
    },
    mustCard: ['Lens Aerial QA', 'res-card--ev-creative'],
    mustHydrate: ['Licencia dron', 'Horas de cobertura'],
    vista: 'pro',
  },
  FOOD_TRUCK: {
    sub: 'food-trucks-carritos-eventos',
    ctx: { sectorId: 'eventos', subcategoriaId: 'food-trucks-carritos-eventos', formularioId: 'negocio_empresa' },
    values: {
      nombreComercial: 'Tacos Rodantes QA',
      tipoUnidadFood: 'food_truck',
      cartaPrincipal: 'Tacos, quesadillas y aguas frescas',
      comensalesPorHora: 120,
      requiereAguaLuz: true,
      permisoManipulacionAlimentos: true,
      cotizacionDesde: '$9,500',
      unidadCotizacion: 'evento',
    },
    mustCard: ['Tacos Rodantes QA', 'res-card--ev-food'],
    mustHydrate: ['Comensales', 'Carta', 'Agua'],
    vista: 'empresa',
  },
  PIROTECNIA: {
    sub: 'pirotecnia-efectos-especiales',
    ctx: { sectorId: 'eventos', subcategoriaId: 'pirotecnia-efectos-especiales', formularioId: 'negocio_empresa' },
    values: {
      nombreComercial: 'FX Pirotecnia QA',
      tipoEfectoPirotecnia: ['fuegos_artificiales'],
      ambientePirotecnia: 'exterior',
      distanciaSeguridadMetros: 50,
      licenciaPirotecnia: true,
      jurisdiccionPirotecnia: 'Jalisco',
      polizaSeguroPirotecnia: true,
      disclaimerReguladoEventos: true,
      cotizacionDesde: 'Consultar',
      unidadCotizacion: 'evento',
    },
    mustCard: ['FX Pirotecnia QA', 'res-badge--regulada', 'Regulado'],
    mustHydrate: ['Jurisdicción', 'Distancia de seguridad'],
    mustBadges: ['Servicio regulado', 'Revisión administrativa'],
    flags: { regulada: true, requiresAdminReview: true },
    vista: 'empresa',
  },
  SEGURIDAD: {
    sub: 'seguridad-eventos',
    ctx: { sectorId: 'eventos', subcategoriaId: 'seguridad-eventos', formularioId: 'negocio_empresa' },
    values: {
      nombreComercial: 'Guardia Eventos QA',
      elementosSeguridad: 12,
      controlAcceso: true,
      eventosMasivos: true,
      licenciaSeguridadPrivada: true,
      credencialesSeguridad: true,
      disclaimerReguladoEventos: true,
      cotizacionDesde: '$6,000',
      unidadCotizacion: 'evento',
    },
    mustCard: ['Guardia Eventos QA', 'res-badge--regulada'],
    mustHydrate: ['Elementos de seguridad', 'Control de acceso', 'Licencia de seguridad'],
    mustBadges: ['Servicio regulado'],
    flags: { regulada: true, requiresAdminReview: true },
    vista: 'empresa',
  },
  VALET: {
    sub: 'valet-parking-eventos',
    ctx: { sectorId: 'eventos', subcategoriaId: 'valet-parking-eventos', formularioId: 'negocio_empresa' },
    values: {
      nombreComercial: 'Valet Premium QA',
      vehiculosPorHora: 40,
      elementosValet: 6,
      polizaResponsabilidadValet: true,
      coordinacionConVenue: true,
      cotizacionDesde: '$4,500',
      unidadCotizacion: 'evento',
    },
    mustCard: ['Valet Premium QA', 'res-card--ev-valet'],
    mustHydrate: ['Vehículos que estacionas', 'Póliza', 'Coordina con el venue'],
    vista: 'empresa',
  },
  TRANSPORTE: {
    sub: 'transporte-eventos',
    ctx: { sectorId: 'eventos', subcategoriaId: 'transporte-eventos', formularioId: 'negocio_empresa' },
    values: {
      nombreComercial: 'Shuttle Invitados QA',
      tipoFlotaTransporte: ['sprinter', 'autobus'],
      usoTransporte: ['boda_invitados', 'shuttle'],
      capacidadPasajeros: 45,
      incluyeChofer: true,
      permisoTransporte: true,
      polizaTransporte: true,
      radioServicioKm: 80,
      cotizacionDesde: '$7,800',
      unidadCotizacion: 'evento',
    },
    mustCard: ['Shuttle Invitados QA', 'res-card--ev-transport'],
    mustHydrate: ['Flota', 'Capacidad', 'Chofer', 'Radio de servicio'],
    vista: 'empresa',
  },
};

const ctx = loadStack();
const PB = ctx.CariHubRegistroPublicBlocks;
const PR = ctx.CariHubPublicRenderLite;
const ER = ctx.CariHubEventosSectorRender;
const BR = ctx.CariHubBienestarSectorRender;

ok('eventos render module loaded', !!ER && typeof ER.hydrateDisplayFields === 'function');
ok('cardHTMLEventosSector export', typeof PR.cardHTMLEventosSector === 'function');
ok('isEventosSectorPerfil export', typeof PR.isEventosSectorPerfil === 'function');

function buildPerfil(key) {
  const sample = CASES[key];
  const bloques = Object.assign({}, sample.values);
  return PB.mapEventosSectorToPerfil(
    { subcategoriaId: sample.sub, categoria: sample.sub, sectorId: 'eventos' },
    bloques,
    sample.ctx
  );
}

for (const [key, sample] of Object.entries(CASES)) {
  const u = buildPerfil(key);
  ok(`${key} mapToPerfil eventosPerfil`, !!u.eventosPerfil);
  ok(`${key} mapToPerfil sectorId`, u.sectorId === 'eventos', u.sectorId);
  ok(`${key} isEventosSectorPerfil`, ER.isEventosSectorPerfil(u));

  const hydrated = ER.hydrateDisplayFields(Object.assign({}, u));
  ok(`${key} hydrate __eventosPack`, !!hydrated.__eventosPack);
  ok(`${key} hydrate __eventosDatos`, Array.isArray(hydrated.__eventosDatos) && hydrated.__eventosDatos.length >= 3,
    String(hydrated.__eventosDatos && hydrated.__eventosDatos.length));
  for (const needle of sample.mustHydrate || []) {
    const blob = JSON.stringify(hydrated);
    ok(`${key} hydrate contains ${needle}`, blob.toLowerCase().includes(String(needle).toLowerCase()));
  }
  for (const bad of sample.mustNotHydrate || []) {
    const blob = JSON.stringify(hydrated).toLowerCase();
    ok(`${key} hydrate NOT ${bad}`, !blob.includes(String(bad).toLowerCase()));
  }

  if (sample.vista) {
    ok(`${key} vista ${sample.vista}`, ER.resolveVistaPerfil(u) === sample.vista, ER.resolveVistaPerfil(u));
  }

  if (sample.flags) {
    Object.entries(sample.flags).forEach(([flag, val]) => {
      ok(`${key} flag ${flag}`, u[flag] === val, String(u[flag]));
    });
  }

  if (sample.mustBadges) {
    const badgeText = (hydrated.__eventosBadges || []).map((b) => b.text).join(' ');
    sample.mustBadges.forEach((needle) => {
      ok(`${key} badge ${needle}`, badgeText.includes(needle));
    });
  }
  if (sample.mustNotBadges) {
    const badgeText = (hydrated.__eventosBadges || []).map((b) => b.text).join(' ');
    sample.mustNotBadges.forEach((needle) => {
      ok(`${key} badge NOT ${needle}`, !badgeText.includes(needle));
    });
  }

  const card = PR.cardHTML(u, { categoria: sample.sub });
  for (const needle of sample.mustCard || []) {
    ok(`${key} card contains ${needle}`, card.includes(needle));
  }
  for (const bad of sample.mustNotCard || []) {
    ok(`${key} card NOT ${bad}`, !card.toLowerCase().includes(String(bad).toLowerCase()));
  }
  ok(`${key} card sin script injection`, !card.includes('<script'));
  ok(`${key} card sectorial (no genérico vacío)`, card.includes('modchip') || card.includes('res-card--eventos'));
}

// Regresión Fase 2 blocks
const blocksSrc = fs.readFileSync(path.join(jsRoot, 'data/registro-eventos-blocks.js'), 'utf8');
ok('Fase2 blocks intact', blocksSrc.includes('validateEventosSectorValues') && blocksSrc.includes('buildEventosPerfil'));

// Regresión Bienestar render
const bsU = buildPerfil('ESPACIOS');
ok('eventos NOT bienestar sector', !BR.isBienestarSectorPerfil(bsU));
const reikiCtx = { sectorId: 'bienestar', subcategoriaId: 'reiki', formularioId: 'persona_independiente' };
const reikiU = PB.mapBienestarSectorToPerfil(
  { subcategoriaId: 'reiki', sectorId: 'bienestar' },
  Object.assign({ alias: 'Reiki QA', tarifaDesde: '$500', modalidadesTerapia: ['Energética manual'], duracionSesionMinutos: '60_min' }),
  reikiCtx
);
ok('bienestar still sector', BR.isBienestarSectorPerfil(reikiU));
ok('bienestar NOT eventos', !ER.isEventosSectorPerfil(reikiU));
const reikiCard = PR.cardHTML(reikiU, { categoria: 'reiki' });
ok('bienestar card unchanged', reikiCard.includes('res-card--bienestar-holistico') && !reikiCard.includes('res-card--eventos'));

// Regresión Adultos spa
const spaU = PB.mapBienestarToPerfil(
  { subcategoriaId: 'spa', arquetipo: 'negocio_bienestar' },
  PB.finalizeBienestarValues({ nombreComercial: 'Spa X', menuServicios: 'Masaje' }, { subcategoriaId: 'spa', arquetipo: 'negocio_bienestar' }),
  { subcategoriaId: 'spa', arquetipo: 'negocio_bienestar' }
);
ok('spa NOT eventos sector', !ER.isEventosSectorPerfil(spaU));
ok('spa NOT bienestar holistico card', !PR.cardHTML(spaU, { categoria: 'Spa' }).includes('res-card--eventos'));

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
ok('perfil-publico includes eventos render', perfilHtml.includes('carihub-eventos-sector-render.js'));
ok('perfil-publico eventosPerfil preview', perfilHtml.includes('eventosPerfil'));
ok('perfil-publico applyEventosSectorHydrate', perfilHtml.includes('applyEventosSectorHydrate'));

const regHtml = fs.readFileSync(path.join(repoRoot, 'public', 'registro-perfil.html'), 'utf8');
ok('registro-perfil includes eventos render', regHtml.includes('carihub-eventos-sector-render.js'));

const homeHtml = fs.readFileSync(path.join(repoRoot, 'public', 'index.html'), 'utf8').slice(0, 5000);
ok('Home no tocado (eventos render ausente en index)', !homeHtml.includes('carihub-eventos-sector-render.js'));

const uiApi = ctx.CARIHUB_REGISTRO_EVENTOS_SECTOR_BLOCKS;
[
  'grupos-musicales-para-eventos',
  'food-trucks-y-carritos',
  'seguridad-para-eventos',
  'valet-parking',
].forEach(function (slug) {
  ok('UI slug → canon ' + slug, uiApi.resolveCanonSubId(slug).length > 0, uiApi.resolveCanonSubId(slug));
});

console.log('\n=== QA EVENTOS SECTOR RENDER Fase 3 ===');
console.log('PASS:', pass.length);
console.log('FAIL:', fail.length);
if (fail.length) {
  fail.slice(0, 40).forEach((f) => console.log(' FAIL', f.name, f.detail || ''));
  process.exit(1);
}
console.log('OK — preview/ficha sector Eventos (10 casos mínimos)');
