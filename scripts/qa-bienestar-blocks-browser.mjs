/**
 * Smoke browser — MP-BIENESTAR Fase 2 blocks en registro-perfil.html
 * Uso: node scripts/qa-bienestar-blocks-browser.mjs [baseUrl]
 * Requiere: npx serve public -l 3457
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:3457';

const CASES = [
  { pack: 'A', subs: ['reiki', 'masajes-terapeuticos', 'reflexologia'] },
  { pack: 'B', subs: ['yoga', 'breathwork'] },
  { pack: 'C', subs: ['centros-holisticos', 'temazcales'] },
  { pack: 'D', subs: ['productos-naturistas', 'venta-de-inciensos', 'venta-de-aceites-esenciales', 'cosmetica-natural'] },
  { pack: 'E', subs: ['tarot', 'registros-akashicos'] },
  { pack: 'F', subs: ['coaching-de-vida', 'coaching-espiritual'] },
  { pack: 'G', subs: ['retiros-espirituales', 'cacao-ceremonial'] },
  {
    pack: 'H',
    subs: [
      'medicina-ancestral',
      'chamanismo',
      'ceremonias-tradicionales',
      'ceremonias-ayahuasca-rape-plantas-de-poder',
    ],
  },
];

const PACK_MUST_HAVE = {
  A: ['modalidadesTerapia', 'duracionSesionMinutos', 'contraindicacionesGenerales'],
  B: ['tipoPractica', 'modalidadClase', 'nivelesAtendidos'],
  C: ['serviciosCentro', 'capacidadGrupo'],
  D: ['categoriasProductoBienestar', 'surtidoPrincipal'],
  E: ['enfoqueEspiritual', 'modalidadLectura'],
  F: ['areaCoaching', 'modalidadSesionCoaching'],
  G: ['tipoExperiencia', 'fechasExperiencia', 'lugarExperiencia', 'cupoMaximo'],
  H: [
    'disclaimerRegulado',
    'edadMinimaServicio',
    'jurisdiccionDeclarada',
    'contraindicacionesObligatorias',
    'tipoExperienciaCeremonial',
    'fechasCeremonia',
    'lugarCeremonia',
  ],
};

const PACK_MUST_NOT = {
  A: ['tipoExperienciaCeremonial', 'disclaimerRegulado', 'envioDomicilio'],
  B: ['modalidadesTerapia', 'disclaimerRegulado'],
  C: ['categoriasProductoBienestar', 'disclaimerRegulado'],
  D: ['disclaimerRegulado', 'tipoExperienciaCeremonial'],
  E: ['modalidadesTerapia', 'disclaimerRegulado'],
  F: ['tipoExperienciaCeremonial', 'disclaimerRegulado'],
  G: ['disclaimerRegulado', 'envioDomicilio'],
  H: [
    'envioDomicilio',
    'tiendaOnline',
    'catalogoProductos',
    'stockProductos',
    'dosisSustancia',
    'carritoEcommerce',
    'categoriasProductoBienestar',
    'surtidoPrincipal',
  ],
};

const RETAIL_NEGOCIO = ['venta-de-inciensos', 'venta-de-aceites-esenciales'];

const pass = [];
const fail = [];
const consoleErrors = [];

function ok(name, detail) {
  pass.push({ name, detail });
}

function bad(name, detail) {
  fail.push({ name, detail });
}

async function smokeSub(page, subId, pack) {
  const result = await page.evaluate(async (args) => {
    const subId = args.subId;
    const pack = args.pack;
    const sector = window.CariHubSectores && CariHubSectores.sectorPorId('bienestar');
    const subs = window.CariHubSectores ? window.CariHubSectores.subcategoriasDeSector('bienestar') : [];
    let sub = null;
    for (let i = 0; i < subs.length; i++) {
      if (subs[i].id === subId) {
        sub = subs[i];
        break;
      }
    }
    if (!sub) return { ok: false, reason: 'sub no encontrada en catálogo: ' + subId };

    const ctxBase = {
      categoriaPrincipal: sector ? sector.nombre : 'Bienestar',
      sectorId: 'bienestar',
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
        formularioUiId: r.formularioUiId || id.formularioUiId || '',
      });
    }

    const PB = window.CariHubRegistroPublicBlocks;
    const API = window.CARIHUB_REGISTRO_BIENESTAR_SECTOR_BLOCKS;
    if (!PB || !API) return { ok: false, reason: 'API blocks no cargada' };

    const resolved = window.CariHubFieldEngineLite
      ? window.CariHubFieldEngineLite.resolveRegistrationSchema(ctx)
      : null;
    const cfg = PB.resolveConfig(ctx, resolved);
    if (!cfg) return { ok: false, reason: 'resolveConfig null', ctx };

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
      fieldIds.push(el.id.replace(/^rpPub_/, ''));
    });

    const textBlob = (host.textContent || '').toLowerCase();

    const previewOk = !!(window.CariHubRegistroPerfilPreview && window.CariHubRegistroPerfilPreview.bind);
    if (previewOk) {
      try {
        window.CariHubRegistroPerfilPreview.bind({
          getContext: function () {
            return ctx;
          },
          getSector: function () {
            return sector;
          },
          getSubcategoria: function () {
            return sub;
          },
        });
      } catch (e) {
        return { ok: false, reason: 'preview bind error: ' + e.message };
      }
    }

    const emptyVals = {};
    cfg.obligatorios.forEach(function (k) {
      emptyVals[k] = '';
    });
    const missingEmpty = PB.validateValues(cfg, emptyVals, ctx);

    let packHCommercialFail = null;
    if (pack === 'H' && API.validatePackH) {
      const badVals = Object.assign({}, emptyVals, {
        disclaimerRegulado: true,
        edadMinimaServicio: '18',
        jurisdiccionDeclarada: 'MX',
        contraindicacionesObligatorias: 'No embarazo',
        tipoExperienciaCeremonial: 'consulta_fechas',
        acompanamientoCeremonial: ['Antes'],
        requisitosPrevios: 'Ayuno',
        fechasCeremonia: 'Consultar',
        cupoCeremonia: '8',
        lugarCeremonia: 'Centro',
        tarifaDesde: 'venta directa de ayahuasca con envío a domicilio',
        alias: 'Guía',
      });
      const hErr = API.validatePackH(badVals);
      packHCommercialFail = hErr.length > 0;
    }

    return {
      ok: true,
      fieldIds: Array.from(new Set(fieldIds)),
      textBlob: textBlob.slice(0, 4000),
      arquetipo: ctx.arquetipo,
      formularioId: ctx.formularioId,
      cfgId: cfg.id,
      missingEmptyCount: missingEmpty.length,
      previewOk: previewOk,
      packHCommercialFail: packHCommercialFail,
      hasConsultaCopy:
        textBlob.indexOf('consultar') >= 0 ||
        textBlob.indexOf('solicitar') >= 0 ||
        textBlob.indexOf('ceremonial') >= 0,
    };
  }, { subId, pack });

  if (!result.ok) {
    bad(`${pack}/${subId} carga`, result.reason || 'unknown');
    return;
  }

  ok(`${pack}/${subId} carga`, `cfg=${result.cfgId} arq=${result.arquetipo}`);

  if (result.missingEmptyCount > 0) {
    ok(`${pack}/${subId} obligatorios`, `detecta ${result.missingEmptyCount} vacíos`);
  } else {
    bad(`${pack}/${subId} obligatorios`, 'no detectó campos vacíos');
  }

  for (const fid of PACK_MUST_HAVE[pack] || []) {
    if (result.fieldIds.indexOf(fid) >= 0 || result.textBlob.indexOf(fid.toLowerCase()) >= 0) {
      ok(`${pack}/${subId} tiene ${fid}`);
    } else {
      bad(`${pack}/${subId} falta ${fid}`, result.fieldIds.join(','));
    }
  }

  for (const fid of PACK_MUST_NOT[pack] || []) {
    if (result.fieldIds.indexOf(fid) >= 0) {
      bad(`${pack}/${subId} prohibido visible ${fid}`);
    } else {
      ok(`${pack}/${subId} sin ${fid}`);
    }
  }

  if (RETAIL_NEGOCIO.indexOf(subId) >= 0) {
    if (result.formularioId === 'negocio_empresa' && result.arquetipo === 'negocio_comercio') {
      ok(`${pack}/${subId} retail arquetipo`, 'negocio_comercio');
    } else {
      bad(`${pack}/${subId} retail arquetipo`, `${result.formularioId}/${result.arquetipo}`);
    }
    if (result.textBlob.indexOf('inmobiliar') >= 0 || result.textBlob.indexOf('bienes ra') >= 0) {
      bad(`${pack}/${subId} retail sin inmobiliario`, 'texto inmobiliario en UI');
    } else {
      ok(`${pack}/${subId} retail sin inmobiliario`);
    }
    if (result.fieldIds.indexOf('envioDomicilio') >= 0) {
      bad(`${pack}/${subId} retail sin envío`);
    } else {
      ok(`${pack}/${subId} retail sin envío`);
    }
  }

  if (pack === 'H') {
    if (result.packHCommercialFail) ok(`${pack}/${subId} validación texto comercial`);
    else bad(`${pack}/${subId} validación texto comercial`, 'no rechazó frase prohibida');
    if (result.hasConsultaCopy) ok(`${pack}/${subId} copy ceremonial/consulta`);
    else bad(`${pack}/${subId} copy ceremonial/consulta`);
  }

  if (result.previewOk) ok(`${pack}/${subId} preview bind`);
  else bad(`${pack}/${subId} preview bind`);
}

async function main() {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage();
  await page.goto(`${BASE}/registro-perfil.html?v=20260630b2`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => window.CariHubRegistroPublicBlocks && window.CARIHUB_REGISTRO_BIENESTAR_SECTOR_BLOCKS, {
    timeout: 25000,
  });
  const apis = await page.evaluate(() => ({
    blocks: !!window.CARIHUB_REGISTRO_BIENESTAR_SECTOR_BLOCKS,
    public: !!window.CariHubRegistroPublicBlocks,
    fe: !!window.CariHubFieldEngineLite,
  }));
  if (!apis.blocks || !apis.public) {
    bad('APIs precarga', JSON.stringify(apis));
  } else {
    ok('APIs precarga', JSON.stringify(apis));
  }

  page.on('response', (res) => {
    if (res.status() === 404 && res.url().indexOf('favicon') < 0) {
      consoleErrors.push('404 ' + res.url());
    }
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const t = msg.text();
      if (/firebase|firestore|permission|ERR_BLOCKED/i.test(t)) return;
      consoleErrors.push(t);
    }
  });
  page.on('pageerror', (err) => {
    if (/firebase|firestore/i.test(err.message)) return;
    consoleErrors.push('PAGEERROR: ' + err.message);
  });

  for (const group of CASES) {
    for (const subId of group.subs) {
      try {
        await smokeSub(page, subId, group.pack);
      } catch (e) {
        bad(`${group.pack}/${subId} excepción`, e.message);
      }
    }
  }

  await browser.close();

  const packResults = {};
  for (const group of CASES) {
    const pFails = fail.filter((f) => f.name.startsWith(group.pack + '/'));
    packResults[group.pack] = pFails.length === 0 ? 'PASS' : 'FAIL';
  }

  const hFails = fail.filter((f) => f.name.startsWith('H/') || f.name.includes('Pack H'));
  const dRetailFails = fail.filter(
    (f) =>
      f.name.includes('venta-de-inciensos') ||
      f.name.includes('venta-de-aceites') ||
      f.name.includes('retail')
  );

  console.log('\n=== QA BIENESTAR BLOCKS BROWSER ===');
  console.log('BASE:', BASE);
  console.log('PASS:', pass.length);
  console.log('FAIL:', fail.length);
  console.log('\n--- Por pack ---');
  Object.keys(packResults).forEach((p) => console.log(`Pack ${p}: ${packResults[p]}`));
  console.log('\n--- Pack H especial ---', hFails.length === 0 ? 'PASS' : 'FAIL');
  console.log('--- Retail D especial ---', dRetailFails.length === 0 ? 'PASS' : 'FAIL');
  console.log('\n--- Errores consola (filtrados) ---', consoleErrors.length);
  consoleErrors.slice(0, 15).forEach((e) => console.log(' ', e));
  if (fail.length) {
    console.log('\n--- Primeros FAIL ---');
    fail.slice(0, 30).forEach((f) => console.log(' FAIL', f.name, f.detail || ''));
    process.exit(1);
  }
  console.log('\nOK — smoke browser completo');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
