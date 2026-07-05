import { chromium } from 'playwright';
let browser;
try { browser = await chromium.launch({ channel: 'chrome' }); }
catch (e) { browser = await chromium.launch({ channel: 'msedge' }); }
const page = await browser.newPage({ viewport: { width: 1040, height: 940 } });
await page.goto('http://localhost:8765/resultados.html?vista=con-resultados&categoria=Cari%C3%B1osas&pais=M%C3%A9xico&estado=Nuevo%20Le%C3%B3n&ciudad=Monterrey', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(2000);
const card = await page.$('.res-card--compact');
if (card) await card.screenshot({ path: 'agent-tools/colab-card.png' });
await browser.close();
console.log('done');
