/**
 * QA browser smoke — MP-REGISTRO-ADULTOS-V4 (6 subs).
 * node scripts/qa-adultos-v4-smoke.mjs [baseUrl]
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:3457';
const pass = [];
const fail = [];

function ok(name, detail) {
  pass.push({ name, detail });
  console.log('PASS', name, detail ? '— ' + detail : '');
}

function bad(name, detail) {
  fail.push({ name, detail });
  console.error('FAIL', name, detail ? '— ' + detail : '');
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const SUBS = [
  { id: 'stripper', search: 'Stripper', expectLabel: 'Stripper', viajaLabel: 'Viaja a eventos', blockTitle: 'Modalidad de atención' },
  { id: 'escort gay', search: 'Escort Gay', expectLabel: 'Escort Gay', viajaLabel: 'Viaja' },
  { id: 'tabledance', search: 'Tabledance', expectLabel: 'Tabledance', noViaja: true, hintNeedle: 'table dance' },
  { id: 'fetiche', search: 'Fetiche', expectLabel: 'Fetiche', viajaLabel: 'Viaja' },
  { id: 'sado', search: 'Sado', expectLabel: 'Sado', viajaLabel: 'Viaja' },
  { id: 'dominatrix', search: 'Dominatrix', expectLabel: 'Dominatrix', viajaLabel: 'Viaja' },
];

async function openSubForm(page, spec) {
  await page.goto(`${BASE}/registro-perfil.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(
    () =>
      window.CARIHUB_SECTORES &&
      window.CARIHUB_SECTORES.length &&
      window.CariHubSectores &&
      window.CariHubRegistroPublicBlocks &&
      document.querySelector('#rpCatSearch'),
    { timeout: 90000 }
  );
  await page.waitForTimeout(800);
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
  await page.waitForSelector('#rpDynamicPublicHost .rp-pub-block', { timeout: 20000 });
  await page.waitForTimeout(600);
}

async function blockSnapshot(page) {
  return page.evaluate(() => {
    const blocks = Array.from(document.querySelectorAll('#rpDynamicPublicHost .rp-pub-block'));
    return blocks.map((b) => ({
      title: (b.querySelector('.rp-card__title') || {}).textContent || '',
      hint: (b.querySelector('.rp-contact-hint') || {}).textContent || '',
      labels: Array.from(b.querySelectorAll('[data-rp-pub-field="modalidades"] label')).map((l) => l.textContent.trim()),
    }));
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage();

  try {
    for (const sub of SUBS) {
      try {
        await openSubForm(page, sub);
      } catch (e) {
        bad(sub.id + ' registro abre', e.message || String(e));
        continue;
      }
      ok(sub.id + ' registro abre', sub.search);

      if (sub.expectLabel === 'Escort Gay') {
        const label = await page.evaluate((sid) => window.CariHubSubcategoriaLabels.resolveSubcategoriaLabel(sid), sub.id);
        if (label === sub.expectLabel) ok(sub.id + ' label UI', label);
        else bad(sub.id + ' label UI', 'got ' + label);
      }

      const blocks = await blockSnapshot(page);
      const modBlock = blocks.find((b) => /modalidad|contexto del show/i.test(b.title));
      if (modBlock) ok(sub.id + ' bloque modalidad', modBlock.title);
      else bad(sub.id + ' bloque modalidad', 'no encontrado');

      if (sub.blockTitle && modBlock && modBlock.title.includes(sub.blockTitle)) {
        ok(sub.id + ' titulo bloque', sub.blockTitle);
      } else if (sub.blockTitle) {
        bad(sub.id + ' titulo bloque', modBlock ? modBlock.title : 'sin bloque');
      }

      if (sub.hintNeedle && modBlock && modBlock.hint.toLowerCase().includes(sub.hintNeedle)) {
        ok(sub.id + ' hint table dance', 'ok');
      } else if (sub.hintNeedle) {
        bad(sub.id + ' hint table dance', modBlock ? modBlock.hint : 'sin hint');
      }

      if (sub.noViaja) {
        const hasViaja = modBlock && modBlock.labels.some((l) => /viaja/i.test(l));
        if (!hasViaja) ok(sub.id + ' sin viaja', 'ok');
        else bad(sub.id + ' sin viaja', modBlock.labels.join(', '));
      }

      if (sub.viajaLabel) {
        const hasViaja = modBlock && modBlock.labels.some((l) => l.includes(sub.viajaLabel));
        if (hasViaja) ok(sub.id + ' opcion viaja', sub.viajaLabel);
        else bad(sub.id + ' opcion viaja', (modBlock && modBlock.labels.join(', ')) || 'sin labels');

        const viajaFields = await page.evaluate(() => {
          const cb = document.querySelector('[data-rp-pub-field="modalidades"] input[value="viaja"]');
          if (cb) {
            cb.checked = true;
            cb.dispatchEvent(new Event('change', { bubbles: true }));
          }
          const ids = ['alcanceDesplazamiento', 'viajesProgramados', 'gastosTraslado', 'anticipacionViaje', 'notasViaje'];
          return ids.map((id) => {
            const wrap = document.querySelector('[data-rp-pub-field-wrap="' + id + '"]');
            const lab = wrap && (wrap.querySelector('label') || wrap.querySelector('.rp-pub-field-label'));
            return {
              id,
              label: lab ? lab.textContent.trim() : '',
              present: !!wrap,
              visible: !!(wrap && !wrap.classList.contains('rp-hidden')),
            };
          });
        });
        const present = viajaFields.filter((f) => f.present);
        const visible = viajaFields.filter((f) => f.visible);
        if (present.length === 5) ok(sub.id + ' subcampos viaja en DOM', present.map((f) => f.label).join(' · '));
        else bad(sub.id + ' subcampos viaja en DOM', JSON.stringify(viajaFields));
        if (visible.length === 5) ok(sub.id + ' subcampos viaja visibles', visible.map((f) => f.label).join(' · '));
        else bad(sub.id + ' subcampos viaja visibles', visible.map((f) => f.id).join(', ') || 'ninguno');
      }
    }

    await page.goto(`${BASE}/perfil-publico.html?vista=escortGay`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForFunction(() => window.CariHubSubcategoriaLabels && window.CariHubSubcategoriaLabels.resolveVisibleCategoria, { timeout: 30000 });
    const fichaCat = await page.evaluate(() =>
      window.CariHubSubcategoriaLabels.resolveVisibleCategoria('Escort Gay', 'escort gay')
    );
    if (fichaCat === 'Escort Gay') ok('ficha escort gay label', fichaCat);
    else bad('ficha escort gay label', String(fichaCat));
  } catch (e) {
    bad('browser smoke exception', e.message || String(e));
  } finally {
    await browser.close();
  }

  console.log('\n=== QA Adultos V4 browser smoke ===');
  console.log('PASS:', pass.length);
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.error('  ✗', f.name, '—', f.detail));
  process.exit(fail.length ? 1 : 0);
}

main();
