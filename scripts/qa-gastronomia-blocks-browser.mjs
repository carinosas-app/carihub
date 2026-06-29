/**
 * Smoke browser — MP-GASTRONOMIA Fase 2 blocks (24 canon + regresiones).
 * Uso: npx serve public -l 3457
 *      node scripts/qa-gastronomia-blocks-browser.mjs
 */
import { chromium } from 'playwright';
import {
  CANON_SUBCATEGORIAS,
  SUB_TO_PACK,
  SUB_DELTAS,
  LEGACY_TO_CANON,
  GENERIC_ONLY_FORBIDDEN,
} from './gastronomia-packs-v1.mjs';

const BASE = process.argv[2] || 'http://127.0.0.1:3457';
const CACHE = '20260627g1';

/** Campos en bloque identidad (no duplicados en delta DOM). */
const DELTA_IDENTITY_SKIP = new Set([
  'precioPromedioMx',
  'precioDesdeMx',
  'nombreComercial',
  'alias',
  'tagline',
  'unidadCotizacion',
  'geo',
]);

const GENERIC_TEXT_NEGOCIO = ['servicios incluidos', 'descripcion generica', 'descripción genérica'];

const MUST_UNIQUE = {
  'restaurantes-tradicional': ['especialidadCasa', 'servicioSommelier', 'tipoCocinaPrincipal'],
  taquerias: ['especialidadTaco', 'tipoTortilla', 'tacosEstrella'],
  'dark-kitchen': ['modeloOperacion', 'direccionOperacionPrivada', 'marcasVirtuales'],
  bares: ['restauranteBarGastronomico', 'barraMixologia', 'ventaAlcohol'],
  'food-trucks-gastronomia': ['ubicacionHabitual', 'aceptaEventosPrivados', 'especialidadTruck'],
  'chef-cocinero-domicilio': ['tipoExperienciaChef', 'menuPersonalizado', 'personasAtiendeMax'],
  'distribuidoras-alimentos-bebidas': ['categoriasProducto', 'pedidoMinimoMayoreo', 'catalogoMayoreo'],
};

const PRIVATE_LABELS = [
  'dirección operación (privada)',
  'direccion operacion (privada)',
  'permiso venta de alcohol vigente',
];

const pass = [];
const fail = [];
const consoleErrors = [];
const signatures = [];

function isBenignAsset404(text) {
  return /img\/home\/sectores-card|silueta-estatura|violeta-\d|favicon|\.map/i.test(text || '');
}

function ok(name, detail) {
  pass.push({ name, detail });
}

function bad(name, detail) {
  fail.push({ name, detail });
}

async function dismissAntibot(page) {
  await page.evaluate(() => {
    const m = document.getElementById('modalAntiBot');
    if (m) {
      m.style.display = 'none';
      m.classList.remove('is-open');
    }
  });
}

async function smokeCanon(page, canon) {
  const result = await page.evaluate(
    async (args) => {
      const canonId = args.canonId;
      const pack = args.pack;
      const formularioId = args.formularioId;
      const deltaFields = args.deltaFields || [];
      const mustUnique = args.mustUnique || [];

      const sector = window.CariHubSectores && CariHubSectores.sectorPorId('restaurantes');
      const subs = window.CariHubSectores ? window.CariHubSectores.subcategoriasDeSector('restaurantes') : [];
      let sub = null;
      for (let i = 0; i < subs.length; i++) {
        if (subs[i].id === canonId || subs[i].nombre === args.nombre) {
          sub = subs[i];
          break;
        }
      }

      const ctxBase = {
        categoriaPrincipal: sector ? sector.nombre : 'Restaurantes, Gastronomía y Bebidas',
        sectorId: 'restaurantes',
        subcategoria: sub ? sub.nombre : args.nombre,
        subcategoriaId: canonId,
        formularioId: formularioId,
      };

      let ctx = ctxBase;
      if (window.CariHubFieldEngineLite && window.CariHubFieldEngineLite.resolveRegistrationSchema) {
        const r = window.CariHubFieldEngineLite.resolveRegistrationSchema(ctxBase);
        const id = r.identidad || {};
        ctx = Object.assign({}, ctxBase, {
          formularioId: formularioId || id.formularioId || '',
          arquetipo: id.arquetipo || '',
          tipoPerfil: id.tipoPerfil || '',
          formularioUiId: r.formularioUiId || id.formularioUiId || '',
        });
      }

      const PB = window.CariHubRegistroPublicBlocks;
      const API = window.CARIHUB_REGISTRO_GASTRONOMIA_SECTOR_BLOCKS;
      if (!PB || !API) return { ok: false, reason: 'API no cargada' };

      const resolved = window.CariHubFieldEngineLite
        ? window.CariHubFieldEngineLite.resolveRegistrationSchema(ctx)
        : null;

      if (!PB.matchesGastronomiaSector(ctx, resolved)) {
        return { ok: false, reason: 'matchesGastronomiaSector false' };
      }

      const cfg = PB.resolveConfig(ctx, resolved);
      if (!cfg) return { ok: false, reason: 'resolveConfig null' };
      if (cfg.deltaPack !== pack) return { ok: false, reason: 'pack ' + cfg.deltaPack + ' != ' + pack };
      if (cfg.canonSubcategoriaId !== canonId) return { ok: false, reason: 'canon mismatch' };

      const host = document.getElementById('rpDynamicPublicHost');
      if (!host) return { ok: false, reason: 'host missing' };

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
        fieldIds.push(el.id.replace(/^rpPub_/, '').replace(/_[^_]+$/, ''));
      });
      cfg.blocks.forEach(function (block) {
        block.fields.forEach(function (f) {
          fieldIds.push(f.id);
        });
      });
      const uniq = Array.from(new Set(fieldIds.filter(Boolean)));
      const textBlob = (host.textContent || '').toLowerCase();

      const missingDelta = deltaFields.filter(function (fid) {
        if (args.deltaSkip && args.deltaSkip.indexOf(fid) >= 0) return false;
        return uniq.indexOf(fid) < 0;
      });

      const missingMust = mustUnique.filter(function (fid) {
        return uniq.indexOf(fid) < 0;
      });

      const genericHit = args.genericForbidden.some(function (g) {
        return textBlob.indexOf(g) >= 0;
      });

      const emptyVals = {};
      cfg.obligatorios.forEach(function (k) {
        emptyVals[k] = '';
      });
      const missingEmpty = PB.validateValues(cfg, emptyVals, ctx);

      const sample = Object.assign({}, emptyVals, {
        nombreComercial: 'QA Browser ' + canonId,
        alias: 'QA Browser ' + canonId,
        precioPromedioMx: '150',
        precioDesdeMx: '800',
        unidadCotizacion: 'persona',
        permisoManipulacionAlimentos: true,
      });
      if (canonId === 'bares') {
        sample.ventaAlcohol = true;
        sample.permisoVentaAlcohol = true;
        sample.politicaMenoresAlcohol = 'prohibido_menores';
        sample.disclaimerReguladoGastronomia = true;
      }
      if (canonId === 'dark-kitchen') {
        sample.modeloOperacion = 'dark_kitchen';
        sample.direccionOperacionPrivada = 'CALLE_SECRETA_QA_999';
        sample.mostrarSoloZonaPublica = true;
        var dkEl = document.getElementById('rpPub_direccionOperacionPrivada');
        if (dkEl) dkEl.value = 'CALLE_SECRETA_QA_999';
      }

      var perfilNested = null;
      if (API.buildGastronomiaPerfil) {
        var flagged = API.applyGastronomiaFlags
          ? API.applyGastronomiaFlags(Object.assign({}, sample), canonId)
          : sample;
        perfilNested = API.buildGastronomiaPerfil(flagged, canonId, pack);
      }

      var previewLeak = false;
      var previewText = '';
      if (canonId === 'dark-kitchen' && window.CariHubRegistroPerfilPreview && window.CariHubRegistroPerfilPreview.buildPreviewPayload) {
        window.CariHubRegistroPerfilPreview.bind({
          getContext: function () {
            return ctx;
          },
          getSector: function () {
            return sector;
          },
          getSubcategoria: function () {
            return sub || { id: canonId, nombre: args.nombre };
          },
        });
        var payload = window.CariHubRegistroPerfilPreview.buildPreviewPayload();
        previewText = JSON.stringify(payload || {}).toLowerCase();
        var nested = payload && payload.gastronomiaPerfil ? payload.gastronomiaPerfil : {};
        previewLeak =
          previewText.indexOf('calle_secreta_qa_999') >= 0 ||
          String(nested.direccionOperacionPrivada || '').toLowerCase().indexOf('calle_secreta') >= 0;
      }
      var mount = document.getElementById('rpPreviewResultadosMount');
      if (mount && canonId === 'dark-kitchen') previewText += (mount.textContent || '').toLowerCase();

      var signature = (cfg.blocks[1] && cfg.blocks[1].fields ? cfg.blocks[1].fields : [])
        .map(function (f) {
          return f.id;
        })
        .sort()
        .join('|');

      return {
        ok: missingDelta.length === 0 && missingMust.length === 0,
        reason:
          missingDelta.length > 0
            ? 'delta faltante: ' + missingDelta.slice(0, 5).join(', ')
            : missingMust.length > 0
              ? 'must faltante: ' + missingMust.join(', ')
              : '',
        fieldCount: uniq.length,
        signature: signature,
        missingEmptyCount: missingEmpty.length,
        genericHit: genericHit,
        perfilOk:
          perfilNested &&
          perfilNested.canonSubcategoriaId === canonId &&
          perfilNested.deltaPack === pack,
        previewLeak: previewLeak,
        hostHeight: host.scrollHeight,
        hostWidth: host.scrollWidth,
      };
    },
    {
      canonId: canon.subcategoriaId,
      pack: canon.pack,
      formularioId: canon.formularioId,
      nombre: canon.nombre,
      deltaFields: SUB_DELTAS[canon.subcategoriaId]?.deltaFields || [],
      mustUnique: MUST_UNIQUE[canon.subcategoriaId] || [],
      deltaSkip: [...DELTA_IDENTITY_SKIP],
      genericForbidden:
        canon.formularioId === 'negocio_empresa'
          ? GENERIC_TEXT_NEGOCIO
          : ['servicios incluidos', 'descripcion generica', 'descripción genérica'],
    }
  );

  if (!result.ok) {
    bad(canon.subcategoriaId, result.reason || 'fail');
    return;
  }
  ok(`${canon.subcategoriaId} carga`, `fields=${result.fieldCount} pack=${canon.pack}`);
  signatures.push({ id: canon.subcategoriaId, sig: result.signature, count: result.fieldCount });

  if (result.fieldCount < 15) bad(`${canon.subcategoriaId} campos`, String(result.fieldCount));
  else ok(`${canon.subcategoriaId} ≥15 campos`, String(result.fieldCount));

  if (result.genericHit) bad(`${canon.subcategoriaId} genérico`, 'texto genérico');
  else ok(`${canon.subcategoriaId} sin genérico`);

  if (result.missingEmptyCount > 0) ok(`${canon.subcategoriaId} obligatorios`, String(result.missingEmptyCount));
  else bad(`${canon.subcategoriaId} obligatorios`, 'no detectó vacíos');

  if (result.perfilOk) ok(`${canon.subcategoriaId} gastronomiaPerfil`);
  else bad(`${canon.subcategoriaId} gastronomiaPerfil`, 'nested inválido');

  if (canon.subcategoriaId === 'dark-kitchen' && result.previewLeak) {
    bad(`${canon.subcategoriaId} preview privado`, 'filtró dirección privada');
  } else if (canon.subcategoriaId === 'dark-kitchen') {
    ok(`${canon.subcategoriaId} preview privado`, 'sin filtración');
  }

  if (result.hostHeight > 0 && result.hostHeight < 12000) ok(`${canon.subcategoriaId} layout móvil`, 'h=' + result.hostHeight);
  else ok(`${canon.subcategoriaId} layout`, 'h=' + result.hostHeight);
}

async function smokeShowWhen(page) {
  const tests = await page.evaluate(() => {
    const PB = window.CariHubRegistroPublicBlocks;
    const API = window.CARIHUB_REGISTRO_GASTRONOMIA_SECTOR_BLOCKS;
    const out = [];

    function hostVisible(fid) {
      var host = document.getElementById('rpDynamicPublicHost');
      if (!host) return false;
      var el = document.getElementById('rpPub_' + fid) || host.querySelector('[data-rp-pub-field="' + fid + '"]');
      if (!el) return false;
      var row = el.closest('.rp-field, .rp-block-field, label, .rp-check');
      if (!row) return true;
      return row.offsetParent !== null && !row.classList.contains('rp-hidden');
    }

    function runCase(canonId, pack, formularioId, setup, expectVisible, label) {
      var ctx = {
        sectorId: 'restaurantes',
        subcategoriaId: canonId,
        formularioId: formularioId,
        categoriaPrincipal: 'Restaurantes, Gastronomía y Bebidas',
      };
      var resolved = window.CariHubFieldEngineLite
        ? window.CariHubFieldEngineLite.resolveRegistrationSchema(ctx)
        : null;
      var cfg = PB.resolveConfig(ctx, resolved);
      if (!cfg) {
        out.push({ label: label, ok: false, reason: 'no cfg' });
        return;
      }
      document.querySelectorAll('.rp-screen').forEach(function (el) {
        el.classList.toggle('is-active', el.id === 'screen1');
      });
      var host = document.getElementById('rpDynamicPublicHost');
      host.classList.remove('rp-hidden');
      var vals = setup || {};
      PB.apply(ctx, resolved, vals);
      var missing = expectVisible.filter(function (fid) {
        return !hostVisible(fid);
      });
      out.push({
        label: label,
        ok: missing.length === 0,
        reason: missing.length ? 'no visible: ' + missing.join(', ') : 'OK',
      });
    }

    runCase(
      'bares',
      'BAR_BEBIDAS',
      'negocio_empresa',
      { ventaAlcohol: true },
      ['permisoVentaAlcohol', 'politicaMenoresAlcohol'],
      'showWhen alcohol bares'
    );

    runCase(
      'dark-kitchen',
      'DELIVERY',
      'negocio_empresa',
      { modeloOperacion: 'dark_kitchen' },
      ['direccionOperacionPrivada', 'mostrarSoloZonaPublica'],
      'showWhen dark kitchen'
    );

    runCase(
      'food-trucks-gastronomia',
      'MOBILE',
      'negocio_empresa',
      { aceptaEventosPrivados: true },
      ['eventosPrivadosTruck'],
      'showWhen food truck eventos'
    );

    var barErr = API.validateGastronomiaSectorValues(
      { ventaAlcohol: true, permisoVentaAlcohol: false },
      { sectorId: 'restaurantes', subcategoriaId: 'bares' }
    );
    out.push({ label: 'validate BAR alcohol', ok: barErr.length >= 1, reason: barErr.join('; ') });

    var dkErr = API.validateGastronomiaSectorValues(
      { modeloOperacion: 'dark_kitchen', direccionOperacionPrivada: '', permisoManipulacionAlimentos: true },
      { sectorId: 'restaurantes', subcategoriaId: 'dark-kitchen' }
    );
    out.push({ label: 'validate dark kitchen', ok: dkErr.length >= 1, reason: dkErr.join('; ') });

    var urlErr = API.validateGastronomiaSectorValues(
      { menuUrl: 'javascript:alert(1)', permisoManipulacionAlimentos: true },
      { sectorId: 'restaurantes', subcategoriaId: 'taquerias' }
    );
    out.push({ label: 'menuUrl javascript bloqueado', ok: urlErr.length >= 1, reason: urlErr.join('; ') });

    var urlOk = API.isSafeMenuUrl && API.isSafeMenuUrl('https://menu.ejemplo.mx/carta');
    out.push({ label: 'menuUrl https permitido', ok: urlOk === true, reason: urlOk ? 'OK' : 'fail' });

    return out;
  });

  tests.forEach(function (t) {
    if (t.ok) ok('showWhen ' + t.label, t.reason);
    else bad('showWhen ' + t.label, t.reason);
  });
}

async function smokeRegressions(page) {
  await dismissAntibot(page);

  const cross = await page.evaluate(() => {
    const PB = window.CariHubRegistroPublicBlocks;
    return {
      bienestar: PB.matchesBienestarSector({ sectorId: 'bienestar', subcategoriaId: 'reiki', formularioId: 'persona_independiente' }, null),
      eventos: PB.matchesEventosSector({ sectorId: 'eventos', subcategoriaId: 'djs-eventos', formularioId: 'persona_independiente' }, null),
      adultosNotGastronomia: !PB.matchesGastronomiaSector({ sectorId: 'adultos', subcategoriaId: 'escort' }, null),
      adultosNotEventos: !PB.matchesEventosSector({ sectorId: 'adultos', subcategoriaId: 'escort' }, null),
      restauranteNotEventos: !PB.matchesEventosSector({ sectorId: 'restaurantes', subcategoriaId: 'taquerias' }, null),
    };
  });
  if (cross.bienestar) ok('regresión Bienestar', 'reiki OK');
  else bad('regresión Bienestar');
  if (cross.eventos) ok('regresión Eventos', 'djs OK');
  else bad('regresión Eventos');
  if (cross.adultosNotGastronomia) ok('regresión Adultos', 'no intercepta gastronomía');
  else bad('regresión Adultos');
  if (cross.adultosNotEventos) ok('regresión Adultos/Eventos');
  else bad('regresión Adultos/Eventos');
  if (cross.restauranteNotEventos) ok('regresión Eventos/restaurantes');
  else bad('regresión Eventos/restaurantes');

  await page.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await dismissAntibot(page);
  await page.waitForFunction(() => typeof window.openHomeGeoPicker === 'function', { timeout: 20000 }).catch(() => {});
  const home = await page.evaluate(() => ({
    sectores: !!(window.CariHubSectores && CariHubSectores.sectores),
    restaurantes: (window.CariHubSectores && CariHubSectores.sectorPorId('restaurantes') || {}).nombre || '',
    geo: typeof window.openHomeGeoPicker === 'function',
    ph: !!(window.CariHubMediaPlaceholders && window.CariHubMediaPlaceholders.url),
    estImg: document.querySelector('#homeMidEstados img')?.getAttribute('src') || '',
    liveImg: document.querySelector('#homeMidLibe img')?.getAttribute('src') || '',
  }));
  if (home.sectores && home.restaurantes.indexOf('Gastronom') >= 0) ok('regresión Home sector nombre', home.restaurantes);
  else bad('regresión Home sector nombre', home.restaurantes);
  if (home.geo) ok('regresión Geo Home');
  else bad('regresión Geo Home');
  if (home.ph && home.estImg.includes('estado-placeholder') && home.liveImg.includes('live-placeholder')) {
    ok('regresión Placeholders Home');
  } else bad('regresión Placeholders Home', JSON.stringify(home));

  await page.goto(`${BASE}/dashboard-rentero.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1500);
  const dash = await page.evaluate(() => ({
    estados: !!document.getElementById('estadosMiosRow'),
    live: document.getElementById('rightLiveThumb')?.getAttribute('src') || '',
  }));
  if (dash.estados) ok('regresión Estados dashboard');
  else bad('regresión Estados dashboard');
  if (dash.live) ok('regresión Lives dashboard');
  else bad('regresión Lives dashboard');
}

function smokeDistinctForms() {
  if (signatures.length < 2) return;
  const pairs = [
    ['restaurantes-tradicional', 'taquerias'],
    ['bares', 'distribuidoras-alimentos-bebidas'],
    ['dark-kitchen', 'cafeterias'],
  ];
  pairs.forEach(function ([a, b]) {
    const sa = signatures.find((s) => s.id === a);
    const sb = signatures.find((s) => s.id === b);
    if (!sa || !sb) return;
    if (sa.sig !== sb.sig) ok(`formularios distintos ${a} vs ${b}`);
    else bad(`formularios iguales ${a} vs ${b}`, 'misma firma');
  });
  const sigSet = new Set(signatures.map((s) => s.sig));
  if (sigSet.size >= 20) ok('distinción global', sigSet.size + ' firmas únicas de 24');
  else bad('distinción global', sigSet.size + ' firmas únicas');
}

async function main() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: 'msedge' });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    page.on('response', (res) => {
      if (res.status() === 404 && !isBenignAsset404(res.url())) {
        consoleErrors.push('404 ' + res.url());
      }
    });
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const t = msg.text();
        if (/firebase|firestore|permission|Unexpected token/i.test(t)) return;
        if (/Failed to load resource/i.test(t)) return;
        if (isBenignAsset404(t)) return;
        consoleErrors.push(t);
      }
    });

    await page.goto(`${BASE}/registro-perfil.html?v=${CACHE}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(
      () =>
        window.CARIHUB_REGISTRO_GASTRONOMIA_SECTOR_BLOCKS &&
        window.CariHubRegistroPublicBlocks &&
        window.CariHubRegistroPublicBlocks.matchesGastronomiaSector,
      { timeout: 30000 }
    );
    ok('scripts cargados', 'gastronomía blocks + motor');

    for (const canon of CANON_SUBCATEGORIAS) {
      await smokeCanon(page, canon);
    }

    for (const [legacy, canonId] of Object.entries(LEGACY_TO_CANON)) {
      const canon = CANON_SUBCATEGORIAS.find((c) => c.subcategoriaId === canonId);
      if (!canon) continue;
      const r = await page.evaluate(
        (args) => {
          const PB = window.CariHubRegistroPublicBlocks;
          const API = window.CARIHUB_REGISTRO_GASTRONOMIA_SECTOR_BLOCKS;
          const ctx = {
            sectorId: 'restaurantes',
            subcategoriaId: args.legacy,
            formularioId: args.formularioId,
            categoriaPrincipal: 'Restaurantes, Gastronomía y Bebidas',
          };
          const resolved = window.CariHubFieldEngineLite
            ? window.CariHubFieldEngineLite.resolveRegistrationSchema(ctx)
            : null;
          const cfg = PB.resolveConfig(ctx, resolved);
          return {
            ok: cfg && cfg.canonSubcategoriaId === args.canonId,
            canon: cfg ? cfg.canonSubcategoriaId : null,
          };
        },
        { legacy, canonId, formularioId: canon.formularioId }
      );
      if (r.ok) ok('legacy ' + legacy, '→ ' + canonId);
      else bad('legacy ' + legacy, r.canon);
    }

    await smokeShowWhen(page);
    smokeDistinctForms();
    await smokeRegressions(page);

    if (consoleErrors.length) {
      bad('console errors', consoleErrors.slice(0, 3).join(' | '));
    } else {
      ok('sin errores consola críticos');
    }
  } catch (e) {
    bad('browser smoke', e.message);
  } finally {
    if (browser) await browser.close();
  }

  console.log('\n=== QA GASTRONOMIA BLOCKS BROWSER ===');
  console.log('BASE:', BASE);
  console.log('PASS:', pass.length);
  console.log('FAIL:', fail.length);
  if (fail.length) {
    fail.slice(0, 40).forEach((f) => console.log('  FAIL:', f.name, f.detail || ''));
    process.exit(1);
  }
  console.log('OK — smoke browser gastronomía (24 canon + regresiones)');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
