/**
 * Smoke visual local — MP-REGISTRO-SUBCATEGORIA-V3 (headless + screenshots on fail)
 * node agent-tools/mp-registro-visual-smoke.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.argv[2] || 'http://127.0.0.1:3457';
const OUT = path.join(__dirname, 'mp-visual-screenshots');

const SUBS = [
  { key: 'escort', search: 'Cariñosas', expectLabel: 'Cariñosas', pro: false, viaja: true },
  { key: 'escort_vip', search: 'Cariñosas VIP', expectLabel: 'Cariñosas VIP', pro: false, viaja: true },
  { key: 'escort_gay', search: 'Cariñosas gay', expectLabel: 'Cariñosas gay', pro: false, viaja: true },
  { key: 'edecan', search: 'Edecán', expectLabel: 'Edecán', pro: true, viaja: true },
  { key: 'modelos', search: 'Modelos', expectLabel: 'Modelos', pro: true, viaja: true },
  { key: 'stripper', search: 'Stripper', expectLabel: 'Stripper', pro: false, viaja: true, espectaculo: true },
];

const SEXUAL_LABELS = [
  'Orientación sexual',
  'Nivel de servicios',
  'Tríos',
  'Gang bang',
  'Colaboración para contenido',
  'Servicios incluidos',
  'Servicios no realizo',
];

const PRO_LABELS = [
  'Tipos de evento',
  'Tipos de modelaje',
  'Experiencia profesional',
  'Servicios profesionales',
  'Restricciones profesionales',
];

const results = [];

function record(sub, check, ok, detail) {
  results.push({ sub, check, ok, detail });
  const tag = ok ? 'PASS' : 'FAIL';
  console.log(`[${tag}] ${sub} · ${check}${detail ? ' — ' + detail : ''}`);
}

async function shot(page, name) {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  const p = path.join(OUT, name);
  await page.screenshot({ path: p, fullPage: true });
  return p;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function openSubForm(page, spec) {
  await page.goto(`${BASE}/registro-perfil.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(
    () =>
      window.CARIHUB_SECTORES &&
      window.CARIHUB_SECTORES.length &&
      window.CariHubSectores &&
      window.CariHubRegistroPerfil &&
      document.querySelector('#rpCatSearch'),
    { timeout: 90000 }
  );
  await page.waitForTimeout(1500);

  const search = page.locator('#rpCatSearch');
  await search.click();
  await search.fill('');
  await search.fill(spec.search);
  await page.keyboard.press('Enter');

  await page.waitForSelector('#rpCatSearchPanel:not(.rp-hidden)', { timeout: 15000 });
  const hit = page.locator('.rp-cat0-search-hit').filter({
    has: page.getByRole('paragraph').filter({ hasText: new RegExp(`^${escapeRegex(spec.expectLabel)}$`) }),
  });
  await hit.first().waitFor({ state: 'visible', timeout: 10000 });
  await hit.first().click();

  await page.waitForSelector('#screen1.is-active', { timeout: 20000 });
  await page.waitForSelector('#rpDynamicPublicHost', { timeout: 20000 });
  await page.waitForTimeout(900);
}

async function testGeoModal(page, subKey) {
  await page.evaluate(() => {
    const pais = document.getElementById('rpFieldPais');
    const estado = document.getElementById('rpFieldEstado');
    const ciudad = document.getElementById('rpFieldCiudad');
    [pais, estado, ciudad].forEach((el) => {
      if (!el) return;
      el.classList.remove('is-selected');
      const label = document.getElementById(el.id + 'Label');
      if (label) {
        label.textContent = el.id.indexOf('Pais') >= 0 ? 'País' : el.id.indexOf('Estado') >= 0 ? 'Estado' : 'Ciudad';
      }
    });
    ['fldPais', 'fldEstado', 'fldCiudad'].forEach((id) => {
      const h = document.getElementById(id);
      if (h) h.value = '';
    });
  });

  let alertFired = false;
  const onDialog = (dialog) => {
    alertFired = true;
    dialog.dismiss().catch(() => {});
  };
  page.once('dialog', onDialog);

  const estadoField = page.locator('#rpFieldEstado');
  await estadoField.waitFor({ state: 'visible', timeout: 8000 });
  await estadoField.click();
  await page.waitForTimeout(600);

  const modal = page.locator('#chUiInfoModal');
  const modalVisible = await modal.isVisible().catch(() => false);
  const title = modalVisible ? await page.locator('#chUiInfoModalTitle').innerText().catch(() => '') : '';
  const msg = modalVisible ? await page.locator('#chUiInfoModalMessage').innerText().catch(() => '') : '';

  if (modalVisible) {
    if (subKey === 'escort') await shot(page, 'geo-modal-escort.png');
    await page.locator('#chUiInfoModalOk').click().catch(() => {});
  }

  record(
    subKey,
    'geo modal (no alert)',
    !alertFired && modalVisible,
    alertFired ? 'alert nativo' : `${title} / ${msg}`
  );
  record(subKey, 'geo copy país→estado', modalVisible && /pa[ií]s/i.test(msg), msg);
}

async function collectFormAudit(page) {
  return page.evaluate(
    ({ sexual, pro }) => {
      const host = document.getElementById('rpDynamicPublicHost');
      const clone = host ? host.cloneNode(true) : null;
      if (clone) {
        clone.querySelectorAll('.rp-field__hint, .rp-block__hint, [class*="hint"]').forEach((el) => el.remove());
      }
      const text = clone ? clone.innerText : '';
      const labels = Array.from(
        document.querySelectorAll(
          '#rpDynamicPublicHost label, #rpDynamicPublicHost h3, #rpDynamicPublicHost legend, #rpDynamicPublicHost .rp-block__title'
        )
      )
        .map((el) => (el.textContent || '').trim())
        .filter(Boolean);
      const foundSexual = sexual.filter((l) => labels.some((x) => x.indexOf(l) >= 0) || text.indexOf(l) >= 0);
      const foundPro = pro.filter((l) => labels.some((x) => x.indexOf(l) >= 0) || text.indexOf(l) >= 0);
      const escortHits = (text.match(/\bEscort\b/gi) || []).length;
      const shellEscort = (document.getElementById('screen1')?.innerText.match(/\bEscort\b/gi) || []).length;
      const hasDesplazamientos = /desplazamientos/i.test(text) && !/viajesDesplazamiento/i.test(text);
      const hasViajaMod = /Viaja a eventos|Viaja a producción|viaja/i.test(text);
      const hasViajesModule = /Alcance del desplazamiento|Viajes programados|Gastos de traslado|Anticipación/i.test(text);
      return {
        foundSexual,
        foundPro,
        escortHits,
        shellEscort,
        hasDesplazamientos,
        hasViajaMod,
        hasViajesModule,
        sample: text.slice(0, 1200),
      };
    },
    { sexual: SEXUAL_LABELS, pro: PRO_LABELS }
  );
}

async function fillMinimalAndPreview(page, spec) {
  async function safeFill(sel, val) {
    const el = page.locator(sel);
    if (!(await el.count())) return;
    if (await el.first().isVisible().catch(() => false)) await el.first().fill(val);
  }

  const alias = `QA Perfil ${spec.expectLabel}`;
  await safeFill('#fldAlias', alias);
  await safeFill('#fldDescripcion', 'Perfil de prueba visual MP-REGISTRO v3');
  await safeFill('#fldPrecio', '2000');
  await safeFill('#fldEdad', '25');

  if (spec.pro) {
    const expSelect = page.locator('#rpPub_experienciaProfesional');
    if (await expSelect.count()) {
      await expSelect.first().selectOption({ index: 1 }).catch(() => {});
    }
  }

  await page.evaluate(() => {
    if (window.CariHubRegistroPerfilPreview && CariHubRegistroPerfilPreview.refresh) {
      CariHubRegistroPerfilPreview.refresh();
    }
  });
  await page.waitForTimeout(1200);

  return page.evaluate((expectLabel) => {
    const payload =
      window.CariHubRegistroPerfilPreview && CariHubRegistroPerfilPreview.buildPreviewPayload
        ? CariHubRegistroPerfilPreview.buildPreviewPayload()
        : null;
    const cardMount = document.getElementById('rpPreviewResultadosMount');
    const cardText = cardMount ? cardMount.innerText : '';
    const iframe = document.getElementById('rpPreviewPerfilFrame');
    const iframeSrc = iframe ? iframe.getAttribute('src') || '' : '';
    const cat = payload && payload.perfil ? payload.perfil.categoria || payload.perfil.categoriaPublica || '' : '';
    const alias = payload && payload.perfil ? payload.perfil.alias || payload.perfil.nombre || '' : '';
    const escortInCard = /\bEscort\b/i.test(cardText);
    const escortInCat = /\bEscort\b/i.test(cat);
    return { payload, cardText: cardText.slice(0, 500), iframeSrc, cat, alias, escortInCard, escortInCat };
  }, spec.expectLabel);
}

async function testFichaPreview(page, spec) {
  const frame = page.frameLocator('#rpPreviewPerfilFrame');
  await page.waitForTimeout(2500);
  const hasFrame = await page.locator('#rpPreviewPerfilFrame').count();
  if (!hasFrame) return { ok: false, detail: 'sin iframe preview' };

  const bodyText = await frame.locator('body').innerText({ timeout: 15000 }).catch(() => '');
  const escort = /\bEscort\b/i.test(bodyText);
  const proRows = ['Experiencia profesional', 'Tipos de evento', 'Tipos de modelaje', 'Servicios profesionales'];
  const proFound = proRows.filter((r) => bodyText.indexOf(r) >= 0);
  const aliasOk = bodyText.indexOf('QA Perfil') >= 0;

  if (spec.pro) {
    return {
      ok: proFound.length >= 2 && !escort && aliasOk,
      detail: `pro=${proFound.join(',')}; escort=${escort}; alias=${aliasOk}`,
    };
  }
  return {
    ok: !escort && aliasOk,
    detail: escort ? 'Escort en ficha iframe' : aliasOk ? 'sin Escort, alias OK' : 'alias no visible',
  };
}

async function main() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: 'msedge' });
  } catch {
    browser = await chromium.launch({ headless: true });
  }
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  for (const spec of SUBS) {
    try {
      await openSubForm(page, spec);

      const uiText = await page.evaluate(() => {
        const screen = document.getElementById('screen1');
        if (!screen) return '';
        const clone = screen.cloneNode(true);
        clone.querySelectorAll('.rp-field__hint, .rp-block__hint, [class*="hint"]').forEach((el) => el.remove());
        return clone.innerText;
      });
      record(
        spec.key,
        'sin Escort en form shell',
        !/\bEscort\b/i.test(uiText),
        uiText.match(/\bEscort\b/gi)?.join(', ') || 'ok'
      );

      await testGeoModal(page, spec.key);

      const audit = await collectFormAudit(page);
      record(
        spec.key,
        'sin Escort en bloques dinámicos',
        audit.escortHits === 0,
        audit.escortHits ? `${audit.escortHits} hits` : 'ok'
      );

      if (spec.pro) {
        record(spec.key, 'sin campos sexuales', audit.foundSexual.length === 0, audit.foundSexual.join(', ') || 'ok');
        record(spec.key, 'campos pro visibles', audit.foundPro.length >= 2, audit.foundPro.join(', ') || 'faltan');
      } else if (spec.espectaculo) {
        record(
          spec.key,
          'sin desplazamientos legacy',
          !audit.hasDesplazamientos,
          audit.hasDesplazamientos ? 'desplazamientos visible' : 'ok'
        );
        record(spec.key, 'modalidad Viaja', audit.hasViajaMod, audit.sample.slice(0, 80));
      } else {
        record(
          spec.key,
          'campos sexuales escort OK',
          audit.foundSexual.length >= 1 || spec.key.includes('gay'),
          audit.foundSexual.join(', ') || 'orientación/servicios'
        );
      }

      const preview = await fillMinimalAndPreview(page, spec);
      const catOk =
        !preview.escortInCat &&
        (preview.cat.indexOf('Cari') >= 0 ||
          preview.cat.indexOf(spec.expectLabel) >= 0 ||
          spec.pro ||
          spec.espectaculo);
      record(spec.key, 'preview label correcto', catOk, preview.cat || 'vacío');
      record(spec.key, 'tarjeta sin Escort', !preview.escortInCard, preview.cardText.slice(0, 120));
      record(
        spec.key,
        'preview alias en payload',
        preview.alias.indexOf('QA Perfil') >= 0,
        preview.alias || 'vacío'
      );

      const ficha = await testFichaPreview(page, spec);
      record(spec.key, 'ficha iframe pública', ficha.ok, ficha.detail);
      if (!ficha.ok) await shot(page, `${spec.key}-ficha-fail.png`);

      if (spec.espectaculo) {
        const viajaCb = page.getByLabel(/Viaja a eventos/i);
        if (await viajaCb.count()) {
          await viajaCb.check().catch(() => {});
          await page.waitForTimeout(700);
          const audit2 = await collectFormAudit(page);
          record(
            spec.key,
            'módulo Viaja completo',
            audit2.hasViajesModule,
            audit2.hasViajesModule ? 'campos viajes visibles' : 'faltan subcampos'
          );
          if (!audit2.hasViajesModule) await shot(page, 'stripper-viaja-fail.png');
        } else {
          record(spec.key, 'checkbox Viaja a eventos', false, 'no encontrado');
          await shot(page, 'stripper-viaja-missing.png');
        }
      }
    } catch (e) {
      record(spec.key, 'exception', false, e.message || String(e));
      await shot(page, `${spec.key}-error.png`);
    }
  }

  await browser.close();
  const failed = results.filter((r) => !r.ok);
  console.log('\n=== RESUMEN ===');
  console.log('PASS:', results.filter((r) => r.ok).length, '/', results.length);
  if (failed.length) {
    console.log('FAIL:', failed.length);
    failed.forEach((f) => console.log(' -', f.sub, f.check, f.detail));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
