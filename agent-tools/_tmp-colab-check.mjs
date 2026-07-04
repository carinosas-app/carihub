import { chromium } from 'playwright';
let browser;
try { browser = await chromium.launch({ channel: 'chrome' }); }
catch (e) { browser = await chromium.launch({ channel: 'msedge' }); }
const page = await browser.newPage({ viewport: { width: 1040, height: 940 } });
const url = 'http://localhost:8765/resultados.html?vista=con-resultados&categoria=Cari%C3%B1osas&pais=M%C3%A9xico&estado=Nuevo%20Le%C3%B3n&ciudad=Monterrey';
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(2000);
const out = await page.evaluate(() => {
  const cards = [...document.querySelectorAll('.res-card--compact')];
  const info = cards.slice(0, 3).map((c) => {
    const colab = c.querySelector('.res-card__colab');
    return {
      name: (c.querySelector('.res-card__name') || {}).textContent || '',
      hasColabRow: !!colab,
      colabText: colab ? colab.textContent.replace(/\s+/g, ' ').trim() : null,
    };
  });
  // also inspect demo data
  let demoSample = null;
  try {
    if (window.CariHubResultadosDemo && window.CariHubResultadosDemo.componer) {
      const list = window.CariHubResultadosDemo.componer({ categoria: 'Cariñosas', pais: 'México', estado: 'Nuevo León', ciudad: 'Monterrey' });
      const u = list && list[0];
      demoSample = u ? { nombre: u.nombre, colaboracionContenido: u.colaboracionContenido, mostrar: u.mostrarColaboracionContenidoPublico, comp: u.__componenteResultados } : 'sin-lista';
    }
  } catch (e) { demoSample = 'err:' + e.message; }
  return { rlVer: (document.querySelector('script[src*="carihub-public-render-lite"]')||{}).src, cards: info, demoSample };
});
console.log(JSON.stringify(out, null, 2));
await browser.close();
