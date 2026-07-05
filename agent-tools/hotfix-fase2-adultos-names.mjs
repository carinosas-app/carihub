/**
 * QA Fase 2 — nombres visibles en modal Adultos tras lazy-load.
 * node agent-tools/hotfix-fase2-adultos-names.mjs
 */
import { chromium } from 'playwright';

const base = process.env.QA_BASE || 'http://127.0.0.1:3457';

async function main() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(() => {
    try { localStorage.setItem('carihub_acceso_ok', '1'); } catch (e) {}
    const m = document.getElementById('modalAntiBot');
    if (m) m.style.display = 'none';
  });
  await page.waitForSelector('#fieldCategoria', { timeout: 15000 });
  await page.evaluate(() => document.querySelector('#fieldCategoria').click());
  await page.waitForSelector('#modal-categorias.is-open', { timeout: 15000 });
  await page.waitForTimeout(3500);

  const probe = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#catPickerListAdultos .ap-card')).slice(0, 16);
    return cards.map((card) => {
      const text = card.querySelector('.ap-card__name-text');
      const visual = card.querySelector('.ap-card__visual');
      const wm = card.querySelector('.rp-sector-watermark');
      const photo = card.querySelector('.ap-card__photo');
      const textCs = text ? getComputedStyle(text) : null;
      const wmCs = wm ? getComputedStyle(wm) : null;
      const textRect = text ? text.getBoundingClientRect() : null;
      const visualRect = visual ? visual.getBoundingClientRect() : null;
      const name = text ? text.textContent.trim() : '';
      const textVisible =
        !!text &&
        name.length > 0 &&
        text.offsetWidth > 8 &&
        text.offsetHeight > 8 &&
        parseInt(textCs.zIndex, 10) >= 2;
      const visualContained =
        !!visual &&
        !!photo &&
        visual.offsetWidth > 0 &&
        visual.offsetHeight >= photo.offsetHeight - 2;
      const wmScoped = wmCs && wmCs.position === 'absolute' && parseFloat(wmCs.width) > 0;
      const overlap =
        textRect &&
        visualRect &&
        visualRect.right > textRect.left + 6;
      return {
        name,
        textVisible,
        wmScoped,
        visualContained,
        overlap,
        textZ: textCs ? textCs.zIndex : null,
        wmW: wmCs ? wmCs.width : null
      };
    });
  });

  const withNames = probe.filter((p) => p.name);
  const allTextVisible = withNames.length >= 8 && withNames.every((p) => p.textVisible);
  const allWmScoped = withNames.every((p) => p.wmScoped);
  const noOverlap = withNames.every((p) => !p.overlap);
  const allVisualOk = withNames.every((p) => p.visualContained);

  console.log('=== FASE 2 — Adultos nombres ===');
  console.log('Cards probadas:', probe.length, '| con nombre:', withNames.length);
  console.log('Nombres visibles (z>=2):', allTextVisible ? 'PASS' : 'FAIL');
  console.log('Watermarks acotados (absolute):', allWmScoped ? 'PASS' : 'FAIL');
  console.log('Imagen no invade zona texto:', noOverlap ? 'PASS' : 'FAIL');
  console.log('Thumb contenido en visual:', allVisualOk ? 'PASS' : 'FAIL');
  if (!allTextVisible || !allWmScoped || !noOverlap || !allVisualOk) {
    probe.filter((p) => !p.textVisible || !p.wmScoped || p.overlap || !p.visualContained).slice(0, 5).forEach((p) => {
      console.log(' FAIL sample:', JSON.stringify(p));
    });
  }

  await browser.close();
  process.exit(allTextVisible && allWmScoped && noOverlap && allVisualOk ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
