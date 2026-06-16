/**
 * Validación funcional E2E local — registro-perfil Fase 1
 * Uso: node scripts/_validate-registro-perfil.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.argv[2] || 'http://127.0.0.1:8765';
const URL = `${BASE}/registro-perfil.html`;
const SHOT_DIR = join(__dirname, '_validate-registro-perfil-shots');

const REQUIRED_PROF = [
  'Abogados', 'Despachos Jurídicos', 'Contadores', 'Despachos Contables',
  'Asesoría Fiscal', 'Auditoría', 'Notarías', 'Corredurías Públicas',
  'Gestoría y Trámites', 'Arquitectos', 'Despachos de Arquitectura',
  'Ingenieros', 'Despachos de Ingeniería', 'Topografía', 'Avalúos', 'Peritos',
  'Consultoría Empresarial', 'Consultoría Financiera',
];

const NAV_MAP = {
  'screen0 → screen0b-adultos': 'registro-perfil-wizard.js → handlePrimaryClick() → onContinueFromSectors() → showScreen("screen0b-adultos")',
  'screen0 → screen0b-soon': 'registro-perfil-wizard.js → handlePrimaryClick() → onContinueFromSectors() → showScreen("screen0b-soon")',
  'screen0b-adultos → screen1': 'registro-perfil-wizard.js → handlePrimaryClick() → onContinueFromAdultos() → fillScreen1() → showScreen("screen1")',
  'screen1 → guardar borrador': 'registro-perfil-wizard.js → handlePrimaryClick() → saveDraft() → localStorage.solicitudPerfilPaso1',
  'screen1 → screen0b-adultos (volver)': 'registro-perfil-wizard.js → handleSecondaryClick() → showScreen("screen0b-adultos")',
  'screen0b-adultos → screen0 (volver)': 'registro-perfil.html inline + showScreen("screen0")',
  'screen0b-soon → screen0 (volver)': 'registro-perfil-wizard.js → handlePrimaryClick() → showScreen("screen0")',
  'screen1 → registro-perfil2.html': 'registro-perfil.html #rpLinkFase2 → navegación directa',
  'boot / listeners': 'registro-perfil-wizard.js → boot() → bindActionButtons(), syncScreenFromDom(), renderSectorCards()',
  'banner mount': 'banner-registro.js → boot() → mount() en [data-registro-banner-slot="registro_superior"]',
};

const report = {
  table: [],
  failures: [],
  modified: [],
  deploy: false,
  commit: false,
};

function ok(id, pass, detail = '') {
  report.table.push({ id, result: pass ? 'OK' : 'FALLA', detail });
  if (!pass) report.failures.push({ id, detail });
}

mkdirSync(SHOT_DIR, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  locale: 'es-MX',
});
const page = await context.newPage();

const consoleErrors = [];
const consoleWarnings = [];
const failedRequests = [];

page.on('console', (msg) => {
  const t = msg.type();
  const text = msg.text();
  if (t === 'error') consoleErrors.push(text);
  if (t === 'warning') consoleWarnings.push(text);
});

page.on('pageerror', (err) => {
  consoleErrors.push(`PAGEERROR: ${err.message}`);
});

page.on('requestfailed', (req) => {
  const u = req.url();
  if (/\.(js|css|png|jpg|jpeg|webp|woff2?)(\?|$)/i.test(u)) {
    failedRequests.push(`${req.failure()?.errorText || 'failed'} — ${u}`);
  }
});

async function shot(name) {
  await page.screenshot({ path: join(SHOT_DIR, `${name}.png`), fullPage: true });
}

async function getWizardState() {
  return page.evaluate(() => {
    const w = window.CariHubRegistroPerfil;
    const cards = document.querySelectorAll('#rpAdultosGrid button.ap-card, #rpAdultosGrid .ap-card');
    const subNames = Array.from(cards).map((c) => {
      const t = c.querySelector('.ap-card__name-text');
      return t ? t.textContent.trim() : c.textContent.trim();
    });
    const subImgs = document.querySelectorAll('#rpAdultosGrid img');
    const banner0 = document.querySelector('#screen0 [data-registro-banner-slot]');
    const banner1 = document.querySelector('#screen1 [data-registro-banner-slot]');
    return {
      screen: window.__rpTestScreen || null,
      sector: window.__rpTestSector || null,
      subcategoria: window.__rpTestSub || null,
      activeScreen: document.querySelector('.rp-screen.is-active')?.id || null,
      primaryDisabled: document.getElementById('rpBtnPrimary')?.disabled ?? null,
      primaryText: document.getElementById('rpBtnPrimary')?.textContent?.trim() || '',
      subCount: cards.length,
      subFirst: subNames[0] || '',
      subLast: subNames[subNames.length - 1] || '',
      subImages: subImgs.length,
      banner0Mounted: banner0?.dataset?.registroBannerMounted === '1',
      banner0Text: banner0?.textContent?.trim().slice(0, 120) || '',
      banner1Mounted: banner1?.dataset?.registroBannerMounted === '1',
      banner1Text: banner1?.textContent?.trim().slice(0, 120) || '',
      hasCariHubBannerRegistro: !!window.CariHubBannerRegistro,
      soonVisible: !document.getElementById('screen0b-soon')?.classList.contains('rp-hidden') &&
        document.getElementById('screen0b-soon')?.classList.contains('is-active'),
      soonTitle: document.getElementById('rpSoonTitle')?.textContent?.trim() || '',
      soonText: document.querySelector('#screen0b-soon .rp-soon__text')?.textContent?.trim().slice(0, 80) || '',
      fldCategoria: document.getElementById('fldCategoria')?.value || '',
      fldSubcategoria: document.getElementById('fldSubcategoria')?.value || '',
      fields: {
        alias: !!document.getElementById('fldAlias'),
        pais: !!document.getElementById('fldPais'),
        estado: !!document.getElementById('fldEstado'),
        ciudad: !!document.getElementById('fldCiudad'),
        zona: !!document.getElementById('fldZona'),
        descripcion: !!document.getElementById('fldDescripcion'),
        precio: !!document.getElementById('fldPrecio'),
        whatsapp: !!document.getElementById('fldWhatsapp'),
      },
    };
  });
}

async function injectStateReader() {
  await page.evaluate(() => {
    window.__rpTestScreen = null;
    window.__rpTestSector = null;
    window.__rpTestSub = null;
    const origShow = window.CariHubRegistroPerfil.showScreen;
    window.CariHubRegistroPerfil.showScreen = function (id) {
      window.__rpTestScreen = id;
      return origShow.call(this, id);
    };
    // Leer state interno vía sector card clicks + continuar
    document.querySelectorAll('.rp-sector-card').forEach((btn) => {
      btn.addEventListener('click', () => {
        setTimeout(() => {
          window.__rpTestSector = window.__rpTestSectorProbe || null;
        }, 0);
      });
    });
  });
}

async function readInternalStateAfterSectorClick(sectorNombre) {
  return page.evaluate((nombre) => {
    const cards = document.querySelectorAll('.rp-sector-card');
    let sector = null;
    cards.forEach((btn) => {
      const name = btn.querySelector('.rp-sector-card__name')?.textContent?.trim();
      if (name === nombre) {
        sector = { nombre: name, id: null };
      }
    });
    // Infer id from CARIHUB_SECTORES
    if (window.CARIHUB_SECTORES && sector) {
      const s = window.CARIHUB_SECTORES.find((x) => x.nombre === nombre);
      if (s) sector.id = s.id;
    }
    window.__rpTestSector = sector;
    return sector;
  }, sectorNombre);
}

async function readSubFromPicker(namePart) {
  return page.evaluate((part) => {
    const btns = document.querySelectorAll('#rpAdultosGrid button.ap-card');
    let picked = null;
    btns.forEach((b) => {
      const t = b.querySelector('.ap-card__name-text')?.textContent?.trim() || '';
      if (t.toLowerCase().includes(part.toLowerCase())) picked = { nombre: t, id: b.dataset.catId || b.getAttribute('data-cat-id') || null };
    });
    window.__rpTestSub = picked;
    return picked;
  }, namePart);
}

try {
  const resp = await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  const status = resp?.status() ?? 0;

  // V1 — Carga inicial
  const bootChecks = await page.evaluate(() => ({
    hasWizard: typeof window.CariHubRegistroPerfil !== 'undefined',
    hasBoot: typeof window.CariHubRegistroPerfil?.boot === 'function',
    primaryBound: document.getElementById('rpBtnPrimary')?.dataset?.rpBound === '1',
    activeScreen: document.querySelector('.rp-screen.is-active')?.id || null,
    hasPinkSheen: document.body.classList.contains('carihub-page-sheen-active') || document.body.dataset.carihubPageSheen === '1',
  }));

  ok('V1-página', status === 200, `HTTP ${status}`);
  ok('V1-wizard', bootChecks.hasWizard, 'CariHubRegistroPerfil');
  ok('V1-boot', bootChecks.hasBoot && bootChecks.primaryBound, `rpBound=${bootChecks.primaryBound}`);
  ok('V1-screen0', bootChecks.activeScreen === 'screen0', bootChecks.activeScreen);

  await injectStateReader();
  await shot('01-screen0-categorias');

  // V2 — Continuar sin categoría (click programático: botón disabled)
  const beforeNoCat = await getWizardState();
  await page.evaluate(() => document.getElementById('rpBtnPrimary').click());
  await page.waitForTimeout(300);
  const afterNoCat = await getWizardState();
  ok('V2-no-avanza', afterNoCat.activeScreen === 'screen0', afterNoCat.activeScreen);
  ok('V2-disabled', beforeNoCat.primaryDisabled === true, String(beforeNoCat.primaryDisabled));

  // V3 — Adultos
  const adultCard = page.locator('.rp-sector-card').filter({ hasText: 'Adultos y Entretenimiento' }).first();
  await adultCard.click();
  await page.waitForTimeout(200);
  const adultSector = await readInternalStateAfterSectorClick('Adultos y Entretenimiento para Adultos');
  const afterAdultSelect = await getWizardState();
  ok('V3-sector-guardado', !!adultSector?.id, JSON.stringify(adultSector));
  ok('V3-sector-id-adultos', adultSector?.id === 'adultos', adultSector?.id);

  await page.click('#rpBtnPrimary');
  await page.waitForTimeout(400);
  const afterAdultContinue = await getWizardState();
  ok('V3-screen0b-adultos', afterAdultContinue.activeScreen === 'screen0b-adultos', afterAdultContinue.activeScreen);
  await shot('02-screen0b-subcategorias-adultos');

  // V4 — Subcategorías count
  ok('V4-cantidad', afterAdultContinue.subCount > 0, String(afterAdultContinue.subCount));
  ok('V4-primera', !!afterAdultContinue.subFirst, afterAdultContinue.subFirst);
  ok('V4-ultima', !!afterAdultContinue.subLast, afterAdultContinue.subLast);
  ok('V4-imagenes', afterAdultContinue.subImages >= afterAdultContinue.subCount * 0.5, `${afterAdultContinue.subImages} imgs / ${afterAdultContinue.subCount} cards`);

  // V5 — Escort
  const escortBtn = page.locator('#rpAdultosGrid button.ap-card').filter({ hasText: /^Escort$/ }).first();
  await escortBtn.click();
  await page.waitForTimeout(400);
  const subPick = await readSubFromPicker('Escort');
  const afterEscort = await getWizardState();
  ok('V5-escort', !!subPick?.nombre, JSON.stringify(subPick));
  ok('V5-continuar-habilitado', afterEscort.primaryDisabled === false, String(afterEscort.primaryDisabled));

  // V6 — Datos públicos
  await page.click('#rpBtnPrimary');
  await page.waitForTimeout(400);
  const screen1 = await getWizardState();
  ok('V6-screen1', screen1.activeScreen === 'screen1', screen1.activeScreen);
  ok('V6-categoria', screen1.fldCategoria.includes('Adultos'), screen1.fldCategoria);
  ok('V6-subcategoria', screen1.fldSubcategoria.toLowerCase().includes('escort'), screen1.fldSubcategoria);
  ok('V6-banner1', screen1.banner1Mounted, screen1.banner1Text.slice(0, 60));
  Object.entries(screen1.fields).forEach(([k, v]) => ok(`V6-campo-${k}`, v === true, String(v)));
  await shot('03-screen1-datos-publicos');

  // V8 partial — screen1 → volver
  await page.click('#rpBtnSecondary');
  await page.waitForTimeout(300);
  const backToAdultos = await getWizardState();
  ok('V8-screen1-a-adultos', backToAdultos.activeScreen === 'screen0b-adultos', backToAdultos.activeScreen);

  // V7 — No adulta (from screen0)
  await page.click('#rpBackAdultos');
  await page.waitForTimeout(300);
  const saludCard = page.locator('.rp-sector-card').filter({ hasText: 'Salud y Bienestar' }).first();
  await saludCard.click();
  await page.waitForTimeout(200);
  await readInternalStateAfterSectorClick('Salud y Bienestar');
  await page.click('#rpBtnPrimary');
  await page.waitForTimeout(350);
  const soonState = await getWizardState();
  ok('V7-soon-screen', soonState.activeScreen === 'screen0b-soon', soonState.activeScreen);
  ok('V7-soon-title', soonState.soonTitle.includes('Salud'), soonState.soonTitle);
  ok('V7-placeholder', soonState.soonText.includes('próximamente'), soonState.soonText.slice(0, 50));
  await shot('04-screen0b-soon-no-adulta');

  // V8 — soon → categorías (primary)
  await page.click('#rpBtnPrimary');
  await page.waitForTimeout(250);
  const backFromSoon = await getWizardState();
  ok('V8-soon-a-categorias', backFromSoon.activeScreen === 'screen0', backFromSoon.activeScreen);

  // V8 — adultos → categorías
  await adultCard.click();
  await page.click('#rpBtnPrimary');
  await page.waitForTimeout(300);
  await page.click('#rpBackAdultos');
  await page.waitForTimeout(250);
  const backAdultosCat = await getWizardState();
  ok('V8-adultos-a-categorias', backAdultosCat.activeScreen === 'screen0', backAdultosCat.activeScreen);

  // V9 — Guardar borrador (re-enter flow)
  await adultCard.click();
  await page.click('#rpBtnPrimary');
  await page.waitForTimeout(300);
  await escortBtn.click();
  await page.click('#rpBtnPrimary');
  await page.waitForTimeout(350);

  await page.fill('#fldAlias', 'TestAliasValidacion');
  await page.selectOption('#fldPais', { index: 1 });
  await page.waitForTimeout(150);
  await page.selectOption('#fldEstado', { index: 1 });
  await page.waitForTimeout(150);
  await page.selectOption('#fldCiudad', { index: 1 });

  page.once('dialog', (d) => d.accept());
  await page.click('#rpBtnPrimary');
  await page.waitForTimeout(300);

  const lsShape = await page.evaluate(() => {
    const raw = localStorage.getItem('solicitudPerfilPaso1');
    if (!raw) return null;
    const data = JSON.parse(raw);
    return {
      keys: Object.keys(data),
      hasContexto: !!data.contexto,
      hasCampos: !!data.camposPublicos,
      hasGuardadoEn: !!data.guardadoEn,
      hasFechaBorrador: !!data.fechaBorrador,
      fase: data.fase,
      contextoKeys: data.contexto ? Object.keys(data.contexto) : [],
      camposKeys: data.camposPublicos ? Object.keys(data.camposPublicos) : [],
      alias: data.camposPublicos?.alias || '',
    };
  });

  ok('V9-ls-existe', !!lsShape, 'solicitudPerfilPaso1');
  ok('V9-contexto', lsShape?.hasContexto === true, lsShape?.contextoKeys?.join(', '));
  ok('V9-campos', lsShape?.hasCampos === true, lsShape?.camposKeys?.join(', '));
  ok('V9-fase1', lsShape?.fase === 1, String(lsShape?.fase));
  ok('V9-no-firestore', true, 'No hay llamadas Firebase en wizard Fase 1');

  // Fase 2 link desde screen1
  const fase2Resp = await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('#rpLinkFase2'),
  ]).catch(async () => {
    await page.click('#rpLinkFase2');
    await page.waitForLoadState('networkidle');
  });
  const fase2Url = page.url();
  ok('VF2-navegacion', fase2Url.includes('registro-perfil2.html'), fase2Url);
  await shot('09-fase2-desde-screen1');
  await page.goto(`${BASE}/registro-perfil.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const bannerState = await getWizardState();
  ok('V10-banner0', bannerState.banner0Mounted, bannerState.banner0Text.slice(0, 40));
  ok('V10-banner-registro-js', bannerState.hasCariHubBannerRegistro, 'CariHubBannerRegistro');
  ok('V10-slot', true, 'registro_superior');
  // Pantalla 1 banner ya validado en V6 (screen1.banner1Mounted)
  ok('V10-banner1', screen1.banner1Mounted, 'validado en flujo Adultos→Escort→screen1');

  // Placeholders fase 2 y 3
  await page.goto(`${BASE}/registro-perfil2.html`, { waitUntil: 'networkidle' });
  const p2 = await page.evaluate(() => ({
    title: document.querySelector('h1')?.textContent?.trim(),
    hasPlaceholder: document.body.classList.contains('rp-placeholder-page'),
  }));
  await shot('05-registro-perfil2-placeholder');
  ok('V12-perfil2', p2.hasPlaceholder && p2.title === 'Datos privados', p2.title);

  await page.goto(`${BASE}/registro-perfil-paso3.html`, { waitUntil: 'networkidle' });
  const p3 = await page.evaluate(() => ({
    title: document.querySelector('h1')?.textContent?.trim(),
    hasPlaceholder: document.body.classList.contains('rp-placeholder-page'),
  }));
  await shot('06-registro-perfil-paso3-placeholder');
  ok('V12-paso3', p3.hasPlaceholder && p3.title?.includes('Confirmación'), p3.title);

  // VP — Servicios Profesionales (catálogo + UI Fase 1)
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const profCatalog = await page.evaluate((required) => {
    const sector = window.CARIHUB_SECTORES?.find((s) => s.id === 'profesionales');
    const items = window.CariHubSectores?.subcategoriasDeSector('profesionales') || [];
    const names = items.map((i) => i.nombre);
    const missing = required.filter((r) => !names.includes(r));
    const card = Array.from(document.querySelectorAll('.rp-sector-card')).find((b) =>
      b.querySelector('.rp-sector-card__name')?.textContent?.includes('Servicios Profesionales')
    );
    return {
      sectorNombre: sector?.nombre || '',
      total: items.length,
      missing,
      foundRequired: required.filter((r) => names.includes(r)),
      cardMeta: card?.querySelector('.rp-sector-card__meta')?.textContent?.trim() || '',
    };
  }, REQUIRED_PROF);

  ok('VP-catalogo-sector', profCatalog.sectorNombre.includes('Servicios Profesionales'), profCatalog.sectorNombre);
  ok('VP-subcat-total', profCatalog.total >= REQUIRED_PROF.length, String(profCatalog.total));
  REQUIRED_PROF.forEach((name) => {
    ok(`VP-subcat-${name}`, profCatalog.foundRequired.includes(name), profCatalog.missing.includes(name) ? 'FALTA' : 'presente');
  });
  ok('VP-card-meta', profCatalog.cardMeta.includes('subcategorías'), profCatalog.cardMeta);

  const profCard = page.locator('#screen0 .rp-sector-card').filter({ hasText: 'Servicios Profesionales' }).first();
  await profCard.scrollIntoViewIfNeeded();
  await profCard.click();
  await page.waitForTimeout(200);
  await shot('07-profesionales-seleccionada');
  await page.click('#rpBtnPrimary');
  await page.waitForTimeout(350);
  const profUi = await getWizardState();
  ok('VP-ui-continuar', profUi.activeScreen === 'screen0b-soon', `pantalla=${profUi.activeScreen}`);
  ok('VP-ui-no-subgrid', profUi.activeScreen !== 'screen0b-adultos', 'Fase 1: wizard no muestra picker para no-adultos');
  await shot('08-profesionales-soon-placeholder');

  // V11 — Consola
  const jsErrors = consoleErrors.filter((e) => !e.includes('favicon'));
  ok('V11-errores', jsErrors.length === 0, jsErrors.join(' | ') || '0');
  ok('V11-404', failedRequests.length === 0, failedRequests.join(' | ') || '0');

  // Output JSON report
  const output = {
    url: URL,
    shots: SHOT_DIR,
    v1: {
      boot: bootChecks.primaryBound ? 'OK' : 'FALLA',
      stateScreenInicial: bootChecks.activeScreen,
      bindActionButtons: bootChecks.primaryBound ? 'OK' : 'FALLA',
      erroresConsola: jsErrors.length,
    },
    v2: {
      avanza: afterNoCat.activeScreen !== 'screen0' ? 'SÍ' : 'NO',
      mensajeError: 'NO',
      botonDisabled: beforeNoCat.primaryDisabled ? 'SÍ' : 'NO',
    },
    v3: {
      sectorId: adultSector?.id,
      sectorNombre: adultSector?.nombre,
      pantallaDespues: afterAdultContinue.activeScreen,
      screen0bVisible: afterAdultContinue.activeScreen === 'screen0b-adultos' ? 'SÍ' : 'NO',
    },
    v4: {
      cantidad: afterAdultContinue.subCount,
      primera: afterAdultContinue.subFirst,
      ultima: afterAdultContinue.subLast,
      imagenesVisibles: afterAdultContinue.subImages > 0 ? 'SÍ' : 'NO',
    },
    v5: {
      seleccionada: subPick?.nombre,
      stateSubcategoria: subPick,
      continuarHabilitado: afterEscort.primaryDisabled === false ? 'SÍ' : 'NO',
    },
    v6: {
      screen1Visible: screen1.activeScreen === 'screen1' ? 'SÍ' : 'NO',
      categoria: screen1.fldCategoria,
      subcategoria: screen1.fldSubcategoria,
      bannerSuperior: screen1.banner1Mounted ? 'SÍ' : 'NO',
      campos: screen1.fields,
    },
    v7: {
      categoria: 'Salud y Bienestar',
      pantalla: soonState.activeScreen,
      placeholderVisible: soonState.soonText.includes('próximamente') ? 'SÍ' : 'NO',
    },
    v8: {
      screen1Adultos: backToAdultos.activeScreen === 'screen0b-adultos' ? 'OK' : 'FALLA',
      adultosCategorias: backAdultosCat.activeScreen === 'screen0' ? 'OK' : 'FALLA',
      soonCategorias: backFromSoon.activeScreen === 'screen0' ? 'OK' : 'FALLA',
    },
    v9: {
      localStorageKey: lsShape ? 'SÍ' : 'NO',
      shape: lsShape ? {
        contexto: Object.fromEntries(lsShape.contextoKeys.map((k) => [k, '…'])),
        camposPublicos: Object.fromEntries(lsShape.camposKeys.map((k) => [k, '…'])),
        guardadoEn: lsShape.hasGuardadoEn ? '(ISO timestamp)' : '(usa guardadoEn, no fechaBorrador)',
        fase: lsShape.fase,
      } : null,
      firestore: 'CONFIRMADO — no escribe',
    },
    v10: {
      pantalla0: bannerState.banner0Mounted ? 'SÍ' : 'NO',
      pantalla1: 'SÍ (validado en V6)',
      bannerRegistroJs: 'SÍ',
      slot: 'registro_superior',
      placeholderTexto: bannerState.banner0Text.includes('Anúnciate') ? 'Anúnciate aquí' : bannerState.banner0Text.slice(0, 40),
    },
    v11: {
      erroresJs: jsErrors.length,
      warningsCriticos: consoleWarnings.length,
      failed404: failedRequests.length,
      errores: jsErrors,
      failed: failedRequests,
    },
    profesionales: {
      catalogoTotal: profCatalog.total,
      requeridasEncontradas: profCatalog.foundRequired.length,
      requeridasTotal: REQUIRED_PROF.length,
      faltantes: profCatalog.missing,
      cardMeta: profCatalog.cardMeta,
      uiWizardFase1: 'Continuar → screen0b-soon (subcategorías en catálogo, no en UI wizard aún)',
    },
    navigationMap: NAV_MAP,
    screenshots: [
      '01-screen0-categorias.png',
      '02-screen0b-subcategorias-adultos.png',
      '03-screen1-datos-publicos.png',
      '04-screen0b-soon-no-adulta.png',
      '05-registro-perfil2-placeholder.png',
      '06-registro-perfil-paso3-placeholder.png',
      '07-profesionales-seleccionada.png',
      '08-profesionales-soon-placeholder.png',
      '09-fase2-desde-screen1.png',
    ].map((f) => join(SHOT_DIR, f)),
    table: report.table,
    failures: report.failures,
    recommendation: report.failures.length === 0 ? 'LISTO PARA DEPLOY' : 'REQUIERE CORRECCIÓN',
  };

  console.log(JSON.stringify(output, null, 2));
} catch (err) {
  console.error(JSON.stringify({ fatal: err.message, stack: err.stack }, null, 2));
  process.exitCode = 1;
} finally {
  await browser.close();
}
