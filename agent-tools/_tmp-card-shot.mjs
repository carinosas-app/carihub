import { chromium } from 'playwright';
const tag = process.argv[2] || 'before';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 900, height: 1000 } });
await page.goto('http://127.0.0.1:8765/resultados.html?categoria=Cari%C3%B1osas&vista=con-resultados&preview=1', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3500);
const info = await page.evaluate(() => {
  const card = document.querySelector('#profilesList .res-card');
  const media = card && card.querySelector('.res-card__media');
  const img = media && media.querySelector('img');
  const cr = card && card.getBoundingClientRect();
  const mr = media && media.getBoundingClientRect();
  return {
    cardH: cr ? Math.round(cr.height) : null,
    mediaW: mr ? Math.round(mr.width) : null,
    mediaH: mr ? Math.round(mr.height) : null,
    mediaRatio: mr ? (mr.width / mr.height).toFixed(2) : null
  };
});
console.log(JSON.stringify(info));
await page.screenshot({ path: `agent-tools/res-card-${tag}.png`, fullPage: true });
await browser.close();
