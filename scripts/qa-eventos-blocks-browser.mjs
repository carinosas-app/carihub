/**
 * Smoke browser — MP-EVENTOS Fase 2 blocks en registro-perfil.html
 * Uso: node scripts/qa-eventos-blocks-browser.mjs [baseUrl]
 * Requiere: npx serve public -l 3457
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:3457';

const CASES = [
  { pack: 'VENUE', sub: 'espacios-para-eventos', must: ['tiposEspacio', 'capacidadMin', 'permitePirotecnia'] },
  { pack: 'PROD', sub: 'organizadores-produccion-eventos', must: ['rolProduccion', 'presupuestoMinimoMxn'] },
  { pack: 'CREATIVE', sub: 'decoracion-ambientacion-eventos', must: ['especialidadesDecoracion'] },
  { pack: 'CREATIVE', sub: 'fotografia-video-eventos', must: ['serviciosAudiovisual', 'licenciaDron'] },
  { pack: 'MUSIC', sub: 'djs-eventos', must: ['generosMusicales', 'viajaFueraCiudad'] },
  { pack: 'MUSIC', sub: 'grupos-musicales-eventos', must: ['tipoAgrupacion', 'descripcionFormatoFaraFara'] },
  { pack: 'SHOW', sub: 'animadores-maestros-ceremonia', must: ['rolPrincipal', 'estiloCeremonia'] },
  { pack: 'SHOW', sub: 'shows-para-eventos', must: ['tipoShow', 'contenidoSensible'] },
  { pack: 'FOOD', sub: 'banquetes-catering-eventos', must: ['permisoManipulacionAlimentos', 'comensalesMax'] },
  { pack: 'FOOD', sub: 'food-trucks-carritos-eventos', must: ['tipoUnidadFood', 'requiereAguaLuz'] },
  { pack: 'RENTAL', sub: 'renta-equipo-eventos', must: ['tipoEquipoRenta', 'requerimientosElectricos'] },
  { pack: 'FLORAL', sub: 'florerias-eventos', must: ['productosFlorales'] },
  { pack: 'FX', sub: 'pirotecnia-efectos-especiales', must: ['licenciaPirotecnia', 'disclaimerReguladoEventos'] },
  { pack: 'SECURITY', sub: 'seguridad-eventos', must: ['elementosSeguridad', 'licenciaSeguridadPrivada'] },
  { pack: 'VALET', sub: 'valet-parking-eventos', must: ['polizaResponsabilidadValet'] },
  { pack: 'TRANSPORT', sub: 'transporte-eventos', must: ['permisoTransporte', 'polizaTransporte'] },
];

const LEGACY_CASES = [
  { legacy: 'dj', canon: 'djs-eventos', pack: 'MUSIC' },
  { legacy: 'salon-de-eventos', canon: 'espacios-para-eventos', pack: 'VENUE' },
  { legacy: 'payaso', canon: 'shows-para-eventos', pack: 'SHOW' },
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

async function smokeSub(page, subId, pack, mustHave, label) {
  const result = await page.evaluate(async (args) => {
    const subId = args.subId;
    const pack = args.pack;
    const mustHave = args.mustHave || [];
    const sector = window.CariHubSectores && CariHubSectores.sectorPorId('eventos');
    const subs = window.CariHubSectores ? window.CariHubSectores.subcategoriasDeSector('eventos') : [];
    let sub = null;
    for (let i = 0; i < subs.length; i++) {
      if (subs[i].id === subId) {
        sub = subs[i];
        break;
      }
    }
    const ctxBase = {
      categoriaPrincipal: sector ? sector.nombre : 'Eventos',
      sectorId: 'eventos',
      subcategoria: sub ? sub.nombre : subId,
      subcategoriaId: subId,
    };
    let ctx = ctxBase;
    if (window.CariHubFieldEngineLite && window.CariHubFieldEngineLite.resolveRegistrationSchema) {
      const r = window.CariHubFieldEngineLite.resolveRegistrationSchema(ctxBase);
      const id = r.identidad || {};
      ctx = Object.assign({}, ctxBase, {
        formularioId: id.formularioId || '',
        arquetipo: id.arquetipo || '',
        tipoPerfil: id.tipoPerfil || '',
        formularioUiId: r.formularioUiId || id.formularioUiId || '',
      });
    }

    const PB = window.CariHubRegistroPublicBlocks;
    const API = window.CARIHUB_REGISTRO_EVENTOS_SECTOR_BLOCKS;
    if (!PB || !API) return { ok: false, reason: 'API blocks no cargada' };

    const resolved = window.CariHubFieldEngineLite
      ? window.CariHubFieldEngineLite.resolveRegistrationSchema(ctx)
      : null;
    const cfg = PB.resolveConfig(ctx, resolved);
    if (!cfg) return { ok: false, reason: 'resolveConfig null', ctx: ctx };

    if (cfg.deltaPack !== pack) {
      return { ok: false, reason: 'deltaPack ' + cfg.deltaPack + ' != ' + pack };
    }

    const host = document.getElementById('rpDynamicPublicHost');
    if (!host) return { ok: false, reason: 'host rpDynamicPublicHost missing' };

    document.querySelectorAll('.rp-screen').forEach(function (el) {
      el.classList.toggle('is-active', el.id === 'screen1');
    });
    host.classList.remove('rp-hidden');
    host.setAttribute('aria-hidden', 'false');

    PB.apply(ctx, resolved, null);

    const fieldIds = [];
    host.querySelectorAll('[data-rp-pub-field]').forEach(function (el) {
      fieldIds.push(el.getAttribute('data-rp-pub-field'));
    });
    host.querySelectorAll('[id^="rpPub_"]').forEach(function (el) {
      const id = el.id.replace(/^rpPub_/, '').replace(/_[^_]+$/, '');
      fieldIds.push(id.split('_')[0] === 'rpPub' ? el.id.replace(/^rpPub_/, '') : el.id.replace(/^rpPub_/, ''));
    });
    cfg.blocks.forEach(function (block) {
      block.fields.forEach(function (f) {
        fieldIds.push(f.id);
      });
    });

    const uniq = Array.from(new Set(fieldIds));
    const textBlob = (host.textContent || '').toLowerCase();
    const missingMust = mustHave.filter(function (fid) {
      return uniq.indexOf(fid) < 0 && textBlob.indexOf(fid.toLowerCase()) < 0;
    });

    const genericBad = ['precio desde', 'servicios incluidos'].some(function (g) {
      return textBlob.indexOf(g) >= 0;
    });

    const emptyVals = {};
    cfg.obligatorios.forEach(function (k) {
      emptyVals[k] = '';
    });
    const missingEmpty = PB.validateValues(cfg, emptyVals, ctx);

    return {
      ok: missingMust.length === 0,
      reason: missingMust.length ? 'faltan campos: ' + missingMust.join(', ') : '',
      fieldIds: uniq,
      canonSubcategoriaId: cfg.canonSubcategoriaId,
      missingEmptyCount: missingEmpty.length,
      genericBad: genericBad,
      matchesEventos: PB.matchesEventosSector ? PB.matchesEventosSector(ctx, resolved) : null,
    };
  }, { subId, pack, mustHave });

  if (!result.ok) {
    bad(label || subId, result.reason || JSON.stringify(result));
    return;
  }
  if (result.genericBad) {
    bad((label || subId) + ' genérico', 'texto genérico detectado');
    return;
  }
  ok(label || subId, 'pack=' + pack + ' fields=' + (result.fieldIds || []).length + ' missingEmpty=' + result.missingEmptyCount);
}

async function main() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: 'msedge' });
    const page = await browser.newPage();
    page.on('console', function (msg) {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await page.goto(BASE + '/registro-perfil.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(function () {
      return !!(window.CARIHUB_REGISTRO_EVENTOS_SECTOR_BLOCKS && window.CariHubRegistroPublicBlocks);
    }, { timeout: 30000 });

    const loaded = await page.evaluate(function () {
      return !!(window.CARIHUB_REGISTRO_EVENTOS_SECTOR_BLOCKS && window.CariHubRegistroPublicBlocks && window.CariHubRegistroPublicBlocks.matchesEventosSector);
    });
    if (!loaded) {
      bad('scripts cargados', 'CARIHUB_REGISTRO_EVENTOS_SECTOR_BLOCKS o matchesEventosSector missing');
    } else {
      ok('scripts cargados', 'OK');
    }

    for (const c of CASES) {
      await smokeSub(page, c.sub, c.pack, c.must, c.sub);
    }

    for (const lc of LEGACY_CASES) {
      await smokeSub(page, lc.legacy, lc.pack, [], 'legacy:' + lc.legacy + '→' + lc.canon);
    }

    const bienestarOk = await page.evaluate(function () {
      const ctx = {
        sectorId: 'bienestar',
        subcategoriaId: 'reiki',
        formularioId: 'persona_independiente',
        categoriaPrincipal: 'Bienestar',
      };
      const PB = window.CariHubRegistroPublicBlocks;
      return PB && PB.matchesBienestarSector && PB.matchesBienestarSector(ctx, null);
    });
    if (bienestarOk) ok('regresión Bienestar', 'matchesBienestarSector reiki');
    else bad('regresión Bienestar', 'matchesBienestarSector falló');

    const adultosOk = await page.evaluate(function () {
      const ctx = { sectorId: 'adultos', subcategoriaId: 'escort', formularioId: 'adultos' };
      const PB = window.CariHubRegistroPublicBlocks;
      return PB && !PB.matchesEventosSector(ctx, null);
    });
    if (adultosOk) ok('regresión Adultos', 'eventos no intercepta adultos');
    else bad('regresión Adultos', 'eventos interceptó adultos');
  } catch (e) {
    bad('browser smoke', e.message);
  } finally {
    if (browser) await browser.close();
  }

  console.log('\n=== QA EVENTOS BLOCKS BROWSER ===');
  console.log('PASS:', pass.length);
  console.log('FAIL:', fail.length);
  if (consoleErrors.length) {
    console.log('Console errors:', consoleErrors.slice(0, 5).join(' | '));
  }
  if (fail.length) {
    fail.forEach(function (f) {
      console.log('  FAIL:', f.name, f.detail || '');
    });
    process.exit(1);
  }
  console.log('OK — smoke browser eventos');
}

main();
