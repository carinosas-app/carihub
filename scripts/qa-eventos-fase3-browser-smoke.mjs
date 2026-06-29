/**
 * Smoke visual/browser — MP-EVENTOS Fase 3 Preview + Ficha
 * Uso: npx serve public -l 3457
 *      node scripts/qa-eventos-fase3-browser-smoke.mjs
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:3457';
const CACHE = '20260627e3';

const CASES = [
  {
    pack: 'VENUE',
    subId: 'espacios-para-eventos',
    label: 'Espacios para Eventos',
    values: {
      nombreComercial: 'Salón Jardín Browser QA',
      tiposEspacio: ['salon', 'jardin'],
      tiposEventoAceptados: ['bodas', 'xv_anos'],
      capacidadMin: 50,
      capacidadMax: 300,
      estacionamientoCupo: 80,
      cateringPolitica: 'externo_permitido',
      permiteMusicaEnVivo: true,
      permitePirotecnia: false,
      cotizacionDesde: '$25,000',
      unidadCotizacion: 'evento',
    },
    cardMust: ['Salón Jardín Browser QA', 'res-card--eventos', 'res-card--ev-venue'],
    cardMustNot: ['res-card--bienestar-holistico'],
    fichaMust: ['Salón Jardín Browser QA', 'Capacidad mínima', 'Servicios para tu evento'],
    fichaMustNot: ['Opiniones de clientes', 'data-vista="adult"'],
    vista: 'empresa',
  },
  {
    pack: 'MUSIC',
    subId: 'grupos-musicales-eventos',
    label: 'Grupos Musicales',
    values: {
      alias: 'Fara Fara Browser QA',
      tipoAgrupacion: 'fara_fara',
      descripcionFormatoFaraFara: 'Formato tradicional con trompeta y tambora.',
      numeroIntegrantes: 8,
      repertorioPrincipal: 'Regional mexicano',
      duracionSetMinutos: 90,
      incluyeSonidoMusica: true,
      cotizacionDesde: '$18,000',
      unidadCotizacion: 'evento',
    },
    cardMust: ['Fara Fara Browser QA', 'Fara Fara', 'res-card--ev-music'],
    fichaMust: ['Fara Fara Browser QA', 'Formato Fara Fara', 'Integrantes'],
    vista: 'pro',
  },
  {
    pack: 'SHOW',
    subId: 'shows-para-eventos',
    label: 'Shows adulto',
    values: {
      alias: 'Mago Browser QA',
      tipoShow: ['mago'],
      publicoObjetivo: 'adultos',
      contenidoSensible: false,
      duracionShowMinutos: 45,
      numeroArtistas: 1,
      cotizacionDesde: '$8,500',
      unidadCotizacion: 'evento',
    },
    cardMust: ['Mago Browser QA', 'res-card--ev-show'],
    cardMustNot: ['Contenido sensible'],
    fichaMust: ['Mago Browser QA', 'Duración del show', 'Artistas'],
    fichaMustNot: ['Contenido sensible'],
    vista: 'pro',
  },
  {
    pack: 'SHOW_SENS',
    subId: 'shows-para-eventos',
    label: 'Shows stripper',
    values: {
      alias: 'Strip Show Browser QA',
      tipoShow: ['strippers'],
      publicoObjetivo: 'adultos',
      contenidoSensible: true,
      disclaimerReguladoEventos: true,
      duracionShowMinutos: 30,
      numeroArtistas: 2,
      cotizacionDesde: '$12,000',
      unidadCotizacion: 'evento',
    },
    cardMust: ['Strip Show Browser QA', 'res-badge--sensible'],
    fichaMust: ['Strip Show Browser QA', 'Contenido sensible', 'Aviso regulado'],
    vista: 'pro',
  },
  {
    pack: 'CREATIVE',
    subId: 'fotografia-video-eventos',
    label: 'Fotografía y Video',
    values: {
      alias: 'Lens Aerial Browser QA',
      serviciosAudiovisual: ['foto', 'dron'],
      especialidadesEvento: ['bodas', 'corporativo'],
      horasCobertura: 8,
      tiempoEntregaDias: 15,
      licenciaDron: true,
      cotizacionDesde: '$15,000',
      unidadCotizacion: 'evento',
    },
    cardMust: ['Lens Aerial Browser QA', 'res-card--ev-creative'],
    fichaMust: ['Lens Aerial Browser QA', 'Licencia dron', 'Horas de cobertura'],
    vista: 'pro',
  },
  {
    pack: 'FOOD',
    subId: 'food-trucks-carritos-eventos',
    label: 'Food Trucks',
    values: {
      nombreComercial: 'Tacos Rodantes Browser QA',
      tipoUnidadFood: 'food_truck',
      cartaPrincipal: 'Tacos, quesadillas y aguas frescas',
      comensalesPorHora: 120,
      requiereAguaLuz: true,
      permisoManipulacionAlimentos: true,
      cotizacionDesde: '$9,500',
      unidadCotizacion: 'evento',
    },
    cardMust: ['Tacos Rodantes Browser QA', 'res-card--ev-food'],
    fichaMust: ['Tacos Rodantes Browser QA', 'Comensales que atiendes', 'Tacos, quesadillas'],
    vista: 'empresa',
  },
  {
    pack: 'FX',
    subId: 'pirotecnia-efectos-especiales',
    label: 'Pirotecnia',
    values: {
      nombreComercial: 'FX Pirotecnia Browser QA',
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
    cardMust: ['FX Pirotecnia Browser QA', 'res-badge--regulada'],
    fichaMust: ['FX Pirotecnia Browser QA', 'Jurisdicción', 'Aviso regulado', 'Servicio regulado'],
    vista: 'empresa',
  },
  {
    pack: 'SECURITY',
    subId: 'seguridad-eventos',
    label: 'Seguridad',
    values: {
      nombreComercial: 'Guardia Eventos Browser QA',
      elementosSeguridad: 12,
      controlAcceso: true,
      eventosMasivos: true,
      licenciaSeguridadPrivada: true,
      credencialesSeguridad: true,
      disclaimerReguladoEventos: true,
      cotizacionDesde: '$6,000',
      unidadCotizacion: 'evento',
    },
    cardMust: ['Guardia Eventos Browser QA', 'res-badge--regulada'],
    fichaMust: ['Guardia Eventos Browser QA', 'Elementos de seguridad', 'Control de acceso'],
    vista: 'empresa',
  },
  {
    pack: 'VALET',
    subId: 'valet-parking-eventos',
    label: 'Valet Parking',
    values: {
      nombreComercial: 'Valet Premium Browser QA',
      vehiculosPorHora: 40,
      elementosValet: 6,
      polizaResponsabilidadValet: true,
      coordinacionConVenue: true,
      cotizacionDesde: '$4,500',
      unidadCotizacion: 'evento',
    },
    cardMust: ['Valet Premium Browser QA', 'res-card--ev-valet'],
    fichaMust: ['Valet Premium Browser QA', 'Vehículos que estacionas', 'Póliza de responsabilidad'],
    vista: 'empresa',
  },
  {
    pack: 'TRANSPORT',
    subId: 'transporte-eventos',
    label: 'Transporte',
    values: {
      nombreComercial: 'Shuttle Invitados Browser QA',
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
    cardMust: ['Shuttle Invitados Browser QA', 'res-card--ev-transport'],
    fichaMust: ['Shuttle Invitados Browser QA', 'Capacidad por unidad', 'Incluye chofer'],
    vista: 'empresa',
  },
];

const pass = [];
const fail = [];
const consoleErrors = [];

function ok(name, detail) {
  pass.push({ name, detail });
}
function bad(name, detail) {
  fail.push({ name, detail });
}
function includesAny(hay, needles) {
  const low = String(hay || '').toLowerCase();
  return needles.some((n) => low.includes(String(n).toLowerCase()));
}

async function fillField(page, fieldId, value) {
  await page.evaluate(
    ({ fieldId, value }) => {
      const host = document.getElementById('rpDynamicPublicHost');
      if (!host) return;
      const el =
        document.getElementById('rpPub_' + fieldId) ||
        host.querySelector('[data-rp-pub-field="' + fieldId + '"] input') ||
        host.querySelector('[data-rp-pub-field="' + fieldId + '"] textarea') ||
        host.querySelector('[data-rp-pub-field="' + fieldId + '"] select');
      if (!el) return;
      if (el.type === 'checkbox') {
        el.checked = !!value;
        el.dispatchEvent(new Event('change', { bubbles: true }));
        return;
      }
      if (Array.isArray(value)) {
        const checks = host.querySelectorAll('[data-rp-pub-field="' + fieldId + '"] input[type="checkbox"]');
        checks.forEach((c) => {
          c.checked = value.indexOf(c.value) >= 0;
          c.dispatchEvent(new Event('change', { bubbles: true }));
        });
        return;
      }
      el.value = String(value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    },
    { fieldId, value }
  );
}

async function runCase(page, browser, c) {
  const tag = `${c.pack}/${c.subId}`;

  const setup = await page.evaluate(
    async (args) => {
      const canonId = args.subId;
      const sector = window.CariHubSectores && CariHubSectores.sectorPorId('eventos');
      const subs = window.CariHubSectores ? window.CariHubSectores.subcategoriasDeSector('eventos') : [];
      const api = window.CARIHUB_REGISTRO_EVENTOS_SECTOR_BLOCKS;
      let sub = subs.find((s) => s.id === canonId);
      if (!sub && api) {
        sub = subs.find((s) => api.resolveCanonSubId(s.id) === canonId);
      }
      if (!sub) return { ok: false, reason: 'sub no encontrada: ' + canonId };

      const ctxBase = {
        categoriaPrincipal: sector ? sector.nombre : 'Eventos',
        sectorId: 'eventos',
        subcategoria: sub.nombre,
        subcategoriaId: sub.id,
      };
      let ctx = ctxBase;
      if (window.CariHubFieldEngineLite && window.CariHubFieldEngineLite.resolveRegistrationSchema) {
        const r = window.CariHubFieldEngineLite.resolveRegistrationSchema(ctxBase);
        const id = r.identidad || {};
        ctx = Object.assign({}, ctxBase, {
          formularioId: id.formularioId || '',
          arquetipo: id.arquetipo || '',
          tipoPerfil: id.tipoPerfil || '',
        });
      }

      document.querySelectorAll('.rp-screen').forEach((el) => {
        el.classList.toggle('is-active', el.id === 'screen1');
      });
      const host = document.getElementById('rpDynamicPublicHost');
      if (!host) return { ok: false, reason: 'host missing' };
      host.classList.remove('rp-hidden');
      host.setAttribute('aria-hidden', 'false');

      const resolved = window.CariHubFieldEngineLite
        ? window.CariHubFieldEngineLite.resolveRegistrationSchema(ctx)
        : null;
      window.CariHubRegistroPublicBlocks.apply(ctx, resolved, null);

      if (window.CariHubRegistroPerfilPreview && window.CariHubRegistroPerfilPreview.bind) {
        window.CariHubRegistroPerfilPreview.bind({
          getContext: () => ctx,
          getSector: () => sector,
          getSubcategoria: () => sub,
        });
      }

      window.__qaCtx = ctx;
      return {
        ok: true,
        subId: sub.id,
        deltaPack: api ? api.resolvePack(canonId) : '',
      };
    },
    { subId: c.subId }
  );

  if (!setup.ok) {
    bad(`${tag} setup`, setup.reason);
    return;
  }
  if (setup.deltaPack !== c.pack.replace('_SENS', '')) {
    bad(`${tag} pack`, `esperado ${c.pack} got ${setup.deltaPack}`);
    return;
  }

  const publicName = c.values.alias || c.values.nombreComercial || '';
  if (publicName) {
    await page.evaluate((name) => {
      const el = document.getElementById('fldAlias');
      if (el) {
        el.value = name;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, publicName);
  }

  for (const [k, v] of Object.entries(c.values)) {
    await fillField(page, k, v);
  }
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    if (window.CariHubRegistroPerfilPreview && window.CariHubRegistroPerfilPreview.refresh) {
      window.CariHubRegistroPerfilPreview.refresh();
    }
  });
  await page.waitForTimeout(500);

  const preview = await page.evaluate(() => {
    const mount = document.getElementById('rpPreviewResultadosMount');
    const frame = document.getElementById('rpPreviewPerfilFrame');
    const cardHtml = mount ? mount.innerHTML : '';
    const payload =
      window.CariHubRegistroPerfilPreview && window.CariHubRegistroPerfilPreview.buildPreviewPayload
        ? window.CariHubRegistroPerfilPreview.buildPreviewPayload()
        : null;
    return {
      cardHtml,
      cardEmpty: !cardHtml || cardHtml.includes('rp-preview-empty'),
      cardLen: cardHtml.length,
      iframeSrc: frame ? frame.src : '',
      iframeOk: !!(frame && frame.src && /perfil-publico(\.html)?(\?|$)/.test(frame.src)),
      vista: payload ? payload.vista : '',
      perfil: payload ? payload.perfil : null,
    };
  });

  if (preview.cardEmpty || preview.cardLen < 80) bad(`${tag} preview tarjeta`, 'vacía');
  else ok(`${tag} preview tarjeta`, `${preview.cardLen} chars`);

  if (!preview.iframeOk) bad(`${tag} preview iframe`, preview.iframeSrc || 'sin src');
  else ok(`${tag} preview iframe`, 'perfil-publico');

  if (c.vista && preview.vista !== c.vista) bad(`${tag} preview vista`, `esperada ${c.vista} got ${preview.vista}`);
  else if (c.vista) ok(`${tag} preview vista`, preview.vista);

  for (const m of c.cardMust || []) {
    if (preview.cardHtml.includes(m) || includesAny(preview.cardHtml, [m])) ok(`${tag} card tiene ${m}`);
    else bad(`${tag} card falta ${m}`);
  }
  for (const m of c.cardMustNot || []) {
    if (includesAny(preview.cardHtml, [m])) bad(`${tag} card prohibido ${m}`);
    else ok(`${tag} card sin ${m}`);
  }

  if (preview.perfil) {
    const payload = {
      vista: preview.vista || c.vista,
      tema: 'pro',
      perfil: preview.perfil,
      query: { categoria: c.label },
    };
    const fichaUrl =
      `${BASE}/perfil-publico?previewSource=registro&from=registro&vista=${encodeURIComponent(preview.vista || c.vista)}&categoria=${encodeURIComponent(c.label)}&v=${CACHE}`;

    const fichaPage = await browser.newPage();
    fichaPage.on('console', (msg) => {
      if (msg.type() !== 'error') return;
      const t = msg.text();
      if (/firebase|firestore|permission|favicon|404/i.test(t)) return;
      consoleErrors.push(`[${tag}] ${t}`);
    });

    await fichaPage.addInitScript(
      ({ storageKey, payload }) => {
        sessionStorage.setItem(storageKey, JSON.stringify(payload));
      },
      { storageKey: 'carihub_rp_public_preview', payload }
    );

    await fichaPage.goto(fichaUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await fichaPage.waitForFunction(
      () => {
        const w = document.getElementById('wrap');
        return w && w.innerHTML && w.innerHTML.length > 200;
      },
      { timeout: 20000 }
    );
    await fichaPage.waitForTimeout(600);

    const ficha = await fichaPage.evaluate(() => {
      const wrap = document.getElementById('wrap');
      const body = document.body;
      return {
        html: wrap ? wrap.innerHTML : '',
        bodyVista: body ? body.getAttribute('data-vista') : '',
        bodyTema: body ? body.getAttribute('data-tema') : '',
      };
    });

    if (!ficha.html || ficha.html.length < 200) bad(`${tag} ficha carga`, 'wrap vacío');
    else ok(`${tag} ficha carga`, `${ficha.html.length} chars`);

    if (c.vista === 'empresa') {
      if (ficha.bodyVista === 'empresa') ok(`${tag} ficha layout empresa`);
      else bad(`${tag} ficha layout empresa`, ficha.bodyVista);
      if (ficha.bodyVista === 'adult' || ficha.bodyTema === 'adult') bad(`${tag} ficha NO adultos`);
      else ok(`${tag} ficha NO adultos`);
    } else if (c.vista === 'pro') {
      if (ficha.bodyVista === 'pro') ok(`${tag} ficha layout pro`);
      else bad(`${tag} ficha layout pro`, ficha.bodyVista);
    }

    for (const m of c.fichaMust || []) {
      if (includesAny(ficha.html, [m])) ok(`${tag} ficha tiene ${m}`);
      else bad(`${tag} ficha falta ${m}`);
    }
    for (const m of c.fichaMustNot || []) {
      if (includesAny(ficha.html, [m])) bad(`${tag} ficha prohibido ${m}`);
      else ok(`${tag} ficha sin ${m}`);
    }
    await fichaPage.close();
  } else {
    bad(`${tag} ficha`, 'sin payload perfil');
  }
}

async function smokeRegressions(page) {
  const tag = 'REGRESSION';

  const checks = await page.evaluate(() => {
    const PB = window.CariHubRegistroPublicBlocks;
    const PR = window.CariHubPublicRenderLite;
    const BR = window.CariHubBienestarSectorRender;
    const ER = window.CariHubEventosSectorRender;
    const EV = window.CARIHUB_REGISTRO_EVENTOS_SECTOR_BLOCKS;

    const spaVals = PB.finalizeBienestarValues(
      { nombreComercial: 'Spa Smoke', menuServicios: 'Masaje', tarifaDesde: '$890' },
      { subcategoriaId: 'spa', arquetipo: 'negocio_bienestar' }
    );
    const spaU = PB.mapBienestarToPerfil({ subcategoriaId: 'spa' }, spaVals, { subcategoriaId: 'spa', arquetipo: 'negocio_bienestar' });
    const spaCard = PR.cardHTML(spaU, { categoria: 'Spa' });

    const reikiU = PB.mapBienestarSectorToPerfil(
      { subcategoriaId: 'reiki', sectorId: 'bienestar' },
      { alias: 'Reiki Smoke', tarifaDesde: '$500', modalidadesTerapia: ['Energética manual'], duracionSesionMinutos: '60_min' },
      { sectorId: 'bienestar', subcategoriaId: 'reiki', formularioId: 'persona_independiente' }
    );
    const reikiCard = PR.cardHTML(reikiU, { categoria: 'reiki' });

    const evU = PB.mapEventosSectorToPerfil(
      { subcategoriaId: 'djs-eventos', sectorId: 'eventos' },
      { alias: 'DJ Smoke', generosMusicales: ['reggaeton'], especialidadesDj: ['bodas'], cotizacionDesde: '$5,000', unidadCotizacion: 'evento' },
      { sectorId: 'eventos', subcategoriaId: 'djs-eventos', formularioId: 'persona_independiente' }
    );
    const evCard = PR.cardHTML(evU, { categoria: 'djs-eventos' });

    const fxErr = EV.validateEventosSectorValues(
      { tipoEfectoPirotecnia: ['fuegos_artificiales'], licenciaPirotecnia: false },
      { sectorId: 'eventos', subcategoriaId: 'pirotecnia-efectos-especiales' }
    );

    return {
      spaNotEventos: !ER.isEventosSectorPerfil(spaU),
      spaCardOk: spaCard.includes('res-card--bienestar') && !spaCard.includes('res-card--eventos'),
      reikiOk: BR.isBienestarSectorPerfil(reikiU) && reikiCard.includes('res-card--bienestar-holistico'),
      reikiNotEventos: !ER.isEventosSectorPerfil(reikiU),
      eventosOk: ER.isEventosSectorPerfil(evU) && evCard.includes('res-card--eventos'),
      eventosNotBienestar: !reikiCard.includes('res-card--eventos'),
      fase2Validate: fxErr.length >= 2,
    };
  });

  if (checks.spaNotEventos && checks.spaCardOk) ok(`${tag}/adultos-spa`, 'OK');
  else bad(`${tag}/adultos-spa`, JSON.stringify(checks));

  if (checks.reikiOk && checks.reikiNotEventos) ok(`${tag}/bienestar-render`, 'OK');
  else bad(`${tag}/bienestar-render`, JSON.stringify(checks));

  if (checks.eventosOk) ok(`${tag}/eventos-render`, 'OK');
  else bad(`${tag}/eventos-render`, JSON.stringify(checks));

  if (checks.fase2Validate) ok(`${tag}/fase2-blocks`, 'validate FX OK');
  else bad(`${tag}/fase2-blocks`, JSON.stringify(checks));
}

async function smokeHomeGeo(browser) {
  const tag = 'REGRESSION/home-geo';
  const page = await browser.newPage();
  await page.goto(`${BASE}/index.html?v=${CACHE}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
  const home = await page.evaluate(() => ({
    hasEventosRender: !!document.querySelector('script[src*="carihub-eventos-sector-render"]'),
    title: document.title,
  }));
  if (!home.hasEventosRender) ok(`${tag} home sin eventos render`, home.title);
  else bad(`${tag} home sin eventos render`, 'script encontrado');
  await page.close();
}

async function main() {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage();

  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const t = msg.text();
    if (/firebase|firestore|permission|favicon|404|Unexpected token/i.test(t)) return;
    consoleErrors.push(t);
  });

  await page.goto(`${BASE}/registro-perfil.html?v=${CACHE}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(
    () =>
      window.CariHubRegistroPublicBlocks &&
      window.CARIHUB_REGISTRO_EVENTOS_SECTOR_BLOCKS &&
      window.CariHubEventosSectorRender &&
      window.CariHubRegistroPerfilPreview,
    { timeout: 30000 }
  );
  ok('APIs Fase 3 precarga', 'eventos blocks+render+preview');

  for (const c of CASES) {
    try {
      await runCase(page, browser, c);
    } catch (e) {
      bad(`${c.pack}/${c.subId} excepción`, e.message);
    }
  }

  await smokeRegressions(page);
  await smokeHomeGeo(browser);
  await browser.close();

  console.log('\n=== QA EVENTOS FASE 3 BROWSER SMOKE ===');
  console.log('PASS:', pass.length);
  console.log('FAIL:', fail.length);
  if (consoleErrors.length) {
    console.log('Console errors (filtered):', consoleErrors.slice(0, 8).join(' | '));
  }
  if (fail.length) {
    fail.slice(0, 30).forEach((f) => console.log(' FAIL', f.name, f.detail || ''));
    process.exit(1);
  }
  console.log('OK — 10 casos Eventos preview+ficha + regresiones');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
