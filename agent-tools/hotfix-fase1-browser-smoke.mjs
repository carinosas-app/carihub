/**
 * Smoke browser — verifica que registro-perfil-submit.js carga y expone API Fase 1.
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:3457';
const results = [];

function pass(name, detail) {
  results.push({ ok: true, name, detail });
  console.log('PASS', name, detail ? '— ' + detail : '');
}

function fail(name, detail) {
  results.push({ ok: false, name, detail });
  console.error('FAIL', name, detail ? '— ' + detail : '');
}

async function main() {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage();

  try {
    await page.goto(BASE + '/registro-perfil.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
    const api = await page.evaluate(() => {
      const S = window.CariHubRegistroPerfilSubmit;
      if (!S || !S.slimProfileForFirestore || !S.buildUsuarioHubDoc || !S.appendPerfilToHub) {
        return { ok: false, reason: 'API Fase 1 no expuesta' };
      }
      const fat = {
        uid: 'u1',
        nombre: 'Test',
        camposPrivados: { verificacion: { ine: 'data:image/jpeg;base64,QUJD' } },
        schemaResuelto: { ui: { x: 1 } },
        formularioId: 'persona_independiente',
        arquetipo: 'persona_servicio_general',
        subcategoriaId: 'sub',
        sectorId: 'sec',
        verificacion: { ineURL: 'https://example.com/ine.jpg' },
        aprobado: false,
        activo: false,
        vencido: false,
        estadoRevision: 'registro_pendiente',
        estadoPago: 'pendiente_aprobacion',
        actualizacionPendiente: false,
        email: 'a@b.com'
      };
      const hub = S.buildUsuarioHubDoc('u1', 'perfil_1', fat);
      const slim = S.slimProfileForFirestore(fat);
      const json = JSON.stringify(hub);
      return {
        ok: true,
        hubBytes: json.length,
        hasBase64: json.indexOf('data:image/') >= 0,
        hasSchema: !!hub.schemaResuelto,
        hasCamposPrivados: !!hub.camposPrivados,
        detalleKeys: hub.perfilesDetalle ? Object.keys(hub.perfilesDetalle).length : 0
      };
    });

    if (!api.ok) {
      fail('registro-perfil.html carga submit Fase 1', api.reason);
    } else {
      pass('registro-perfil.html carga submit Fase 1', 'hub ' + api.hubBytes + ' bytes');
      if (api.hasBase64) fail('hub sin base64 en browser', 'encontrado data:image/');
      else pass('hub sin base64 en browser');
      if (api.hasSchema) fail('hub sin schemaResuelto', 'presente en raíz');
      else pass('hub sin schemaResuelto en raíz');
      if (api.hasCamposPrivados) fail('hub sin camposPrivados', 'presente en raíz');
      else pass('hub sin camposPrivados en raíz');
      if (api.detalleKeys === 1) pass('perfilesDetalle con 1 entrada');
      else fail('perfilesDetalle', 'keys=' + api.detalleKeys);
      if (api.hubBytes < 900 * 1024) pass('hub < 900 KB en browser', api.hubBytes + ' bytes');
      else fail('hub < 900 KB', api.hubBytes + ' bytes');
    }

    await page.goto(BASE + '/dashboard-rentero.html?preview=1', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1500);
    const dash = await page.evaluate(() => ({
      hasDashContext: !!window.DashContext,
      hasPublicationList: !!document.getElementById('publicationList')
    }));
    if (dash.hasDashContext && dash.hasPublicationList) pass('dashboard preview boot', 'sin regresión shell');
    else fail('dashboard preview boot', JSON.stringify(dash));
  } catch (e) {
    fail('browser smoke', e.message || String(e));
  } finally {
    await browser.close();
  }

  const failed = results.filter((r) => !r.ok);
  console.log('\nBrowser smoke:', results.length - failed.length + '/' + results.length, 'PASS');
  process.exit(failed.length ? 1 : 0);
}

main();
