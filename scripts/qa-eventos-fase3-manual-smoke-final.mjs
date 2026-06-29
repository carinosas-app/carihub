/**
 * Smoke visual manual final — MP-EVENTOS Fase 3 (pre-commit)
 * node scripts/qa-eventos-fase3-manual-smoke-final.mjs [baseUrl]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:3457';
const CACHE = '20260627e3';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const shotsDir = path.join(root, 'agent-tools', 'eventos-fase3-manual-failures');

const visual = [];
const consoleErrors = [];
const consoleCritical = [];

function record(caseId, area, pass, detail) {
  visual.push({ caseId, area, pass: pass ? 'PASS' : 'FAIL', detail: detail || '' });
  const tag = pass ? 'PASS' : 'FAIL';
  console.log(`[${tag}] ${caseId} / ${area}${detail ? ' — ' + detail : ''}`);
}

function includesAny(hay, needles) {
  const low = String(hay || '').toLowerCase();
  return needles.every((n) => low.includes(String(n).toLowerCase()));
}

function includesSome(hay, needles) {
  const low = String(hay || '').toLowerCase();
  return needles.some((n) => low.includes(String(n).toLowerCase()));
}

function excludesAll(hay, needles) {
  const low = String(hay || '').toLowerCase();
  return !needles.some((n) => low.includes(String(n).toLowerCase()));
}

const CASES = [
  {
    id: '1-ESPACIOS',
    subId: 'espacios-para-eventos',
    canonId: 'espacios-para-eventos',
    label: 'Espacios para Eventos',
    values: {
      nombreComercial: 'Salón Visual Final QA',
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
    },
    cardMust: ['Salón Visual Final QA', 'res-card--eventos'],
    cardMustSome: ['salón', 'jardín', 'salon', 'jardin'],
    fichaMustSome: ['capacidad', 'estacionamiento', 'catering', 'música', 'pirotecnia', 'ruido'],
    blocksMust: ['capacidadMin', 'tiposEspacio', 'cateringPolitica'],
    vista: 'empresa',
  },
  {
    id: '2-FARA-FARA',
    subId: 'grupos-musicales-para-eventos',
    canonId: 'grupos-musicales-eventos',
    label: 'Grupos Musicales Fara Fara',
    values: {
      alias: 'Fara Fara Visual QA',
      tipoAgrupacion: 'fara_fara',
      descripcionFormatoFaraFara: 'Trompeta y tambora tradicional.',
      numeroIntegrantes: 8,
      repertorioPrincipal: 'Regional mexicano',
      duracionSetMinutos: 90,
      incluyeSonidoMusica: true,
      cotizacionDesde: '$18,000',
      unidadCotizacion: 'evento',
    },
    cardMust: ['Fara Fara Visual QA', 'Fara Fara'],
    fichaMustSome: ['integrantes', 'repertorio', 'sonido', 'fara fara', 'formato fara fara', 'duración'],
    blocksMust: ['tipoAgrupacion', 'descripcionFormatoFaraFara'],
    vista: 'pro',
  },
  {
    id: '3-SHOW-ADULTO',
    subId: 'shows-para-eventos',
    canonId: 'shows-para-eventos',
    label: 'Shows adulto no sensible',
    values: {
      alias: 'Mago Adulto Visual QA',
      tipoShow: ['mago'],
      publicoObjetivo: 'adultos',
      contenidoSensible: false,
      duracionShowMinutos: 45,
      numeroArtistas: 1,
      cotizacionDesde: '$8,500',
      unidadCotizacion: 'evento',
    },
    cardMust: ['Mago Adulto Visual QA'],
    cardMustNot: ['contenido sensible', 'res-badge--sensible'],
    fichaMustNot: ['contenido sensible', 'stripper', 'desnudo'],
    fichaMustSome: ['público', 'duración', 'artistas'],
    blocksMust: ['tipoShow', 'publicoObjetivo'],
    vista: 'pro',
  },
  {
    id: '4-SHOW-SENSIBLE',
    subId: 'shows-para-eventos',
    canonId: 'shows-para-eventos',
    label: 'Shows stripper sensible',
    values: {
      alias: 'Strip Visual QA',
      tipoShow: ['strippers'],
      publicoObjetivo: 'adultos',
      contenidoSensible: true,
      disclaimerReguladoEventos: true,
      duracionShowMinutos: 30,
      numeroArtistas: 2,
      cotizacionDesde: '$12,000',
      unidadCotizacion: 'evento',
    },
    cardMust: ['Strip Visual QA', 'res-badge--sensible'],
    fichaMustSome: ['contenido sensible', 'revisión administrativa', 'aviso regulado'],
    blocksMust: ['contenidoSensible', 'tipoShow'],
    vista: 'pro',
  },
  {
    id: '5-FOTO-DRON',
    subId: 'fotografia-y-video-para-eventos',
    canonId: 'fotografia-video-eventos',
    label: 'Fotografía Video dron',
    values: {
      alias: 'Lens Dron Visual QA',
      serviciosAudiovisual: ['foto', 'dron'],
      especialidadesEvento: ['bodas', 'corporativo'],
      horasCobertura: 8,
      tiempoEntregaDias: 15,
      licenciaDron: true,
      cotizacionDesde: '$15,000',
      unidadCotizacion: 'evento',
    },
    cardMust: ['Lens Dron Visual QA'],
    fichaMustSome: ['licencia dron', 'horas de cobertura', 'foto', 'dron'],
    blocksMust: ['serviciosAudiovisual', 'licenciaDron'],
    vista: 'pro',
  },
  {
    id: '6-FOOD-TRUCK',
    subId: 'food-trucks-y-carritos',
    canonId: 'food-trucks-carritos-eventos',
    label: 'Food Trucks',
    values: {
      nombreComercial: 'Tacos Visual QA',
      tipoUnidadFood: 'food_truck',
      cartaPrincipal: 'Tacos y quesadillas',
      comensalesPorHora: 120,
      requiereAguaLuz: true,
      permisoManipulacionAlimentos: true,
      cotizacionDesde: '$9,500',
      unidadCotizacion: 'evento',
    },
    cardMust: ['Tacos Visual QA'],
    fichaMustSome: ['comensales', 'carta', 'agua', 'luz', 'food truck', 'unidad'],
    blocksMust: ['tipoUnidadFood', 'comensalesPorHora'],
    vista: 'empresa',
  },
  {
    id: '7-PIROTECNIA',
    subId: 'pirotecnia-y-efectos-especiales',
    canonId: 'pirotecnia-efectos-especiales',
    label: 'Pirotecnia',
    values: {
      nombreComercial: 'FX Visual QA',
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
    cardMust: ['FX Visual QA', 'res-badge--regulada'],
    fichaMustSome: ['jurisdicción', 'aviso regulado', 'servicio regulado', 'distancia', 'seguridad'],
    blocksMust: ['tipoEfectoPirotecnia', 'jurisdiccionPirotecnia'],
    vista: 'empresa',
  },
  {
    id: '8-SEGURIDAD',
    subId: 'seguridad-para-eventos',
    canonId: 'seguridad-eventos',
    label: 'Seguridad',
    values: {
      nombreComercial: 'Guardia Visual QA',
      elementosSeguridad: 12,
      controlAcceso: true,
      eventosMasivos: true,
      licenciaSeguridadPrivada: true,
      credencialesSeguridad: true,
      disclaimerReguladoEventos: true,
      cotizacionDesde: '$6,000',
      unidadCotizacion: 'evento',
    },
    cardMust: ['Guardia Visual QA', 'res-badge--regulada'],
    fichaMustSome: ['elementos de seguridad', 'control de acceso', 'licencia', 'servicio regulado'],
    blocksMust: ['elementosSeguridad', 'licenciaSeguridadPrivada'],
    vista: 'empresa',
  },
  {
    id: '9-VALET',
    subId: 'valet-parking',
    canonId: 'valet-parking-eventos',
    label: 'Valet Parking',
    values: {
      nombreComercial: 'Valet Visual QA',
      vehiculosPorHora: 40,
      elementosValet: 6,
      polizaResponsabilidadValet: true,
      coordinacionConVenue: true,
      cotizacionDesde: '$4,500',
      unidadCotizacion: 'evento',
    },
    cardMust: ['Valet Visual QA'],
    fichaMustSome: ['vehículos', 'elementos', 'póliza', 'valet'],
    blocksMust: ['vehiculosPorHora', 'polizaResponsabilidadValet'],
    vista: 'empresa',
  },
  {
    id: '10-TRANSPORTE',
    subId: 'transporte-para-eventos',
    canonId: 'transporte-eventos',
    label: 'Transporte',
    values: {
      nombreComercial: 'Shuttle Visual QA',
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
    cardMust: ['Shuttle Visual QA'],
    fichaMustSome: ['flota', 'capacidad', 'chofer', 'permiso', 'radio'],
    blocksMust: ['tipoFlotaTransporte', 'capacidadPasajeros'],
    vista: 'empresa',
  },
];

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
        host.querySelectorAll('[data-rp-pub-field="' + fieldId + '"] input[type="checkbox"]').forEach((c) => {
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

async function maybeShot(page, caseId, area, pass) {
  if (pass) return;
  fs.mkdirSync(shotsDir, { recursive: true });
  const file = path.join(shotsDir, `${caseId}-${area}.png`.replace(/[^\w.-]/g, '_'));
  await page.screenshot({ path: file, fullPage: true }).catch(() => {});
  return file;
}

async function runCase(page, browser, c) {
  const setup = await page.evaluate(
    (args) => {
      const canonId = args.canonId;
      const displayId = args.subId;
      const sector = window.CariHubSectores && CariHubSectores.sectorPorId('eventos');
      const subs = window.CariHubSectores ? window.CariHubSectores.subcategoriasDeSector('eventos') : [];
      const api = window.CARIHUB_REGISTRO_EVENTOS_SECTOR_BLOCKS;
      let sub = subs.find((s) => s.id === displayId);
      if (!sub && api) sub = subs.find((s) => api.resolveCanonSubId(s.id) === canonId);
      if (!sub) return { ok: false, reason: 'sub no encontrada ' + displayId };

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

      const blob = document.getElementById('rpDynamicPublicHost')?.innerHTML || '';
      const blocksOk = (args.blocksMust || []).every((fid) => blob.indexOf('data-rp-pub-field="' + fid + '"') >= 0 || blob.indexOf('rpPub_' + fid) >= 0);
      return {
        ok: true,
        blocksOk,
        blocksMissing: (args.blocksMust || []).filter((fid) => blob.indexOf('data-rp-pub-field="' + fid + '"') < 0 && blob.indexOf('rpPub_' + fid) < 0),
        deltaPack: api ? api.resolvePack(canonId) : '',
      };
    },
    { subId: c.subId, canonId: c.canonId, blocksMust: c.blocksMust }
  );

  if (!setup.ok) {
    record(c.id, 'registro-setup', false, setup.reason);
    return;
  }
  record(c.id, 'registro-blocks', setup.blocksOk, setup.blocksMissing?.join(', '));

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
    if (window.CariHubRegistroPerfilPreview?.refresh) window.CariHubRegistroPerfilPreview.refresh();
  });
  await page.waitForTimeout(500);

  const preview = await page.evaluate(() => {
    const mount = document.getElementById('rpPreviewResultadosMount');
    const payload = window.CariHubRegistroPerfilPreview?.buildPreviewPayload?.();
    return {
      cardHtml: mount ? mount.innerHTML : '',
      cardLen: mount ? mount.innerHTML.length : 0,
      vista: payload?.vista || '',
      perfil: payload?.perfil || null,
    };
  });

  const cardOk =
    preview.cardLen > 80 &&
    (c.cardMust || []).every((m) => preview.cardHtml.includes(m)) &&
    (!c.cardMustSome || includesSome(preview.cardHtml, c.cardMustSome)) &&
    (!c.cardMustNot || excludesAll(preview.cardHtml, c.cardMustNot));
  record(c.id, 'preview-tarjeta', cardOk, `${preview.cardLen} chars vista=${preview.vista}`);
  if (!cardOk) await maybeShot(page, c.id, 'preview-tarjeta', false);

  if (c.vista && preview.vista !== c.vista) {
    record(c.id, 'preview-vista', false, `esperada ${c.vista} got ${preview.vista}`);
  } else {
    record(c.id, 'preview-vista', true, preview.vista);
  }

  if (!preview.perfil) {
    record(c.id, 'ficha-publica', false, 'sin payload');
    return;
  }

  const payload = {
    vista: preview.vista || c.vista,
    tema: 'pro',
    perfil: preview.perfil,
    query: { categoria: c.label },
  };
  const fichaPage = await browser.newPage();
  trackConsole(fichaPage, c.id);

  await fichaPage.addInitScript(
    ({ storageKey, payload }) => {
      sessionStorage.setItem(storageKey, JSON.stringify(payload));
    },
    { storageKey: 'carihub_rp_public_preview', payload }
  );

  const fichaUrl = `${BASE}/perfil-publico?previewSource=registro&from=registro&vista=${encodeURIComponent(payload.vista)}&v=${CACHE}`;
  await fichaPage.goto(fichaUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await fichaPage.waitForFunction(
    () => {
      const w = document.getElementById('wrap');
      return w && w.innerHTML && w.innerHTML.length > 200;
    },
    { timeout: 20000 }
  );
  await fichaPage.waitForTimeout(600);

  const ficha = await fichaPage.evaluate(() => ({
    html: document.getElementById('wrap')?.innerHTML || '',
    bodyVista: document.body.getAttribute('data-vista') || '',
    genericOnly:
      !document.querySelector('.dlist') &&
      (document.getElementById('wrap')?.innerHTML || '').toLowerCase().includes('zona de cobertura') &&
      !(document.getElementById('wrap')?.innerHTML || '').includes('Servicios para tu evento'),
  }));

  const fichaOk =
    ficha.html.length > 200 &&
    (!c.fichaMustSome || includesSome(ficha.html, c.fichaMustSome)) &&
    (!c.fichaMustNot || excludesAll(ficha.html, c.fichaMustNot)) &&
    !ficha.genericOnly;
  record(c.id, 'ficha-publica', fichaOk, `${ficha.html.length} chars layout=${ficha.bodyVista}`);
  if (!fichaOk) await maybeShot(fichaPage, c.id, 'ficha-publica', false);

  await fichaPage.close();
}

function trackConsole(page, tag) {
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const t = msg.text();
    if (/firebase|firestore|permission|favicon|404|Unexpected token/i.test(t)) return;
    consoleErrors.push(`[${tag}] ${t}`);
    if (!/net::ERR/i.test(t)) consoleCritical.push(`[${tag}] ${t}`);
  });
  page.on('pageerror', (err) => {
    if (/firebase|firestore/i.test(err.message)) return;
    consoleCritical.push(`[${tag}] PAGE: ${err.message}`);
  });
}

async function smokeRegressions(browser) {
  const page = await browser.newPage();
  trackConsole(page, 'REGRESSION');

  const r = await page.evaluate(async () => {
    const PB = window.CariHubRegistroPublicBlocks;
    const PR = window.CariHubPublicRenderLite;
    const BR = window.CariHubBienestarSectorRender;
    const ER = window.CariHubEventosSectorRender;

    const spaVals = PB.finalizeBienestarValues(
      { nombreComercial: 'Spa Reg', menuServicios: 'Masaje', tarifaDesde: '$890' },
      { subcategoriaId: 'spa', arquetipo: 'negocio_bienestar' }
    );
    const spaU = PB.mapBienestarToPerfil({ subcategoriaId: 'spa' }, spaVals, { subcategoriaId: 'spa', arquetipo: 'negocio_bienestar' });
    const spaCard = PR.cardHTML(spaU, { categoria: 'Spa' });

    const reikiU = PB.mapBienestarSectorToPerfil(
      { subcategoriaId: 'reiki', sectorId: 'bienestar' },
      { alias: 'Reiki Reg', tarifaDesde: '$500', modalidadesTerapia: ['Energética manual'], duracionSesionMinutos: '60_min' },
      { sectorId: 'bienestar', subcategoriaId: 'reiki', formularioId: 'persona_independiente' }
    );
    const reikiCard = PR.cardHTML(reikiU, { categoria: 'reiki' });

    const subs = window.CariHubSectores?.subcategoriasDeSector('eventos') || [];

    return {
      adultos: PR.isBienestarPerfil(spaU) && !ER.isEventosSectorPerfil(spaU) && spaCard.includes('res-card--bienestar') && !spaCard.includes('res-card--eventos'),
      bienestar: BR.isBienestarSectorPerfil(reikiU) && reikiCard.includes('res-card--bienestar-holistico'),
      homeEventosCount: subs.length,
    };
  }).catch(() => null);

  await page.goto(`${BASE}/index.html?v=${CACHE}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
  const home = await page.evaluate(() => ({
    title: document.title,
    hasEventosRender: !!document.querySelector('script[src*="carihub-eventos-sector-render"]'),
    sectorCount: (window.CariHubSectores?.subcategoriasDeSector('eventos') || []).length,
  }));

  record('REG-adultos', 'card-spa', !!r?.adultos, JSON.stringify(r));
  record('REG-bienestar', 'card-reiki', !!r?.bienestar, '');
  record('REG-home', 'eventos-20-subs', home.sectorCount === 20 && !home.hasEventosRender, `subs=${home.sectorCount}`);

  await page.close();

  const geoPage = await browser.newPage();
  trackConsole(geoPage, 'GEO');
  await geoPage.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await geoPage.waitForFunction(() => typeof window.openHomeGeoPicker === 'function', { timeout: 20000 }).catch(() => {});
  const geo = await geoPage.evaluate(async () => {
    document.getElementById('modalAntiBot')?.remove();
    await new Promise((r) => setTimeout(r, 300));
    document.getElementById('fieldPais')?.click();
    await new Promise((r) => setTimeout(r, 500));
    const modal = document.getElementById('chGeoModal');
    return {
      open: modal?.classList.contains('is-open'),
      premium: modal?.classList.contains('ch-geo-modal--home'),
      glass: !!document.querySelector('.ch-geo-card--glass'),
    };
  });
  record('REG-geo-f1', 'home-geo-picker', geo.open && geo.premium && geo.glass, JSON.stringify(geo));
  await geoPage.close();

  const phPage = await browser.newPage();
  trackConsole(phPage, 'PH');
  await phPage.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await phPage.waitForTimeout(1200);
  const ph = await phPage.evaluate(() => {
    const est = document.querySelector('#homeMidEstados img');
    const live = document.querySelector('#homeMidLibe img');
    return {
      phApi: !!(window.CariHubMediaPlaceholders && CariHubMediaPlaceholders.url),
      est: est?.getAttribute('src') || '',
      live: live?.getAttribute('src') || '',
    };
  });
  record(
    'REG-placeholders',
    'home-estado-live',
    ph.phApi && ph.est.includes('estado-placeholder') && ph.live.includes('live-placeholder'),
    ph.est + ' | ' + ph.live
  );
  await phPage.close();
}

async function main() {
  fs.mkdirSync(shotsDir, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage();
  trackConsole(page, 'MAIN');

  await page.goto(`${BASE}/registro-perfil.html?v=${CACHE}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(
    () =>
      window.CariHubRegistroPublicBlocks &&
      window.CARIHUB_REGISTRO_EVENTOS_SECTOR_BLOCKS &&
      window.CariHubEventosSectorRender &&
      window.CariHubRegistroPerfilPreview,
    { timeout: 30000 }
  );

  for (const c of CASES) {
    try {
      await runCase(page, browser, c);
    } catch (e) {
      record(c.id, 'excepcion', false, e.message);
    }
  }

  await smokeRegressions(browser);
  await browser.close();

  const fails = visual.filter((v) => v.pass === 'FAIL');
  const shots = fs.existsSync(shotsDir) ? fs.readdirSync(shotsDir).filter((f) => f.endsWith('.png')) : [];

  console.log('\n=== RESUMEN VISUAL MANUAL FASE 3 ===');
  console.log('Total checks:', visual.length);
  console.log('PASS:', visual.filter((v) => v.pass === 'PASS').length);
  console.log('FAIL:', fails.length);
  if (fails.length) {
    fails.forEach((f) => console.log(`  FAIL ${f.caseId} / ${f.area}: ${f.detail}`));
  }
  if (shots.length) console.log('Capturas fallo:', shots.map((s) => path.join('agent-tools/eventos-fase3-manual-failures', s)).join(', '));
  else console.log('Capturas: ninguna (sin fallos visuales)');

  console.log('\nErrores consola (filtrados):', consoleErrors.length ? consoleErrors.slice(0, 15).join('\n  ') : 'ninguno');
  console.log('Errores críticos nuevos:', consoleCritical.length ? consoleCritical.join('\n  ') : 'ninguno');

  process.exit(fails.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
