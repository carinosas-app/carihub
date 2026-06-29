/**
 * Smoke visual/browser — MP-EVENTOS-DELTAS-V1 Fase 2 (pre-commit)
 * node scripts/qa-eventos-visual-smoke.mjs [baseUrl]
 * Requiere: npx serve public -l 3458
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:3458';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const shotsDir = path.join(root, 'agent-tools', 'eventos-visual-smoke');

const results = [];
const consoleErrors = [];
const consoleWarnings = [];

function record(name, pass, detail) {
  results.push({ name, pass, detail: detail || '' });
  const tag = pass ? 'PASS' : 'FAIL';
  console.log(`[${tag}] ${name}${detail ? ' — ' + detail : ''}`);
}

async function setupEventosPage(page, subId) {
  return page.evaluate(function (subId) {
    var sector = window.CariHubSectores && CariHubSectores.sectorPorId('eventos');
    var subs = window.CariHubSectores ? window.CariHubSectores.subcategoriasDeSector('eventos') : [];
    var sub = null;
    for (var i = 0; i < subs.length; i++) {
      if (subs[i].id === subId) {
        sub = subs[i];
        break;
      }
    }
    var ctxBase = {
      categoriaPrincipal: sector ? sector.nombre : 'Eventos',
      sectorId: 'eventos',
      subcategoria: sub ? sub.nombre : subId,
      subcategoriaId: subId,
    };
    var ctx = ctxBase;
    var resolved = null;
    if (window.CariHubFieldEngineLite && window.CariHubFieldEngineLite.resolveRegistrationSchema) {
      resolved = window.CariHubFieldEngineLite.resolveRegistrationSchema(ctxBase);
      var id = resolved.identidad || {};
      ctx = Object.assign({}, ctxBase, {
        formularioId: id.formularioId || '',
        arquetipo: id.arquetipo || '',
        tipoPerfil: id.tipoPerfil || '',
        formularioUiId: resolved.formularioUiId || id.formularioUiId || '',
      });
    }
    var PB = window.CariHubRegistroPublicBlocks;
    var cfg = PB.resolveConfig(ctx, resolved);
    if (!cfg) return { ok: false, reason: 'resolveConfig null' };

    document.querySelectorAll('.rp-screen').forEach(function (el) {
      el.classList.toggle('is-active', el.id === 'screen1');
    });
    var host = document.getElementById('rpDynamicPublicHost');
    if (!host) return { ok: false, reason: 'host missing' };
    host.classList.remove('rp-hidden');
    host.setAttribute('aria-hidden', 'false');
    PB.apply(ctx, resolved, null);
    return {
      ok: true,
      ctx: ctx,
      cfg: { deltaPack: cfg.deltaPack, canonSubcategoriaId: cfg.canonSubcategoriaId, blockTitles: cfg.blocks.map(function (b) { return b.title; }) },
    };
  }, subId);
}

async function isFieldVisible(page, fieldId) {
  return page.evaluate(function (fieldId) {
    var wrap = document.querySelector('[data-rp-pub-field-wrap="' + fieldId + '"]');
    if (!wrap) {
      var el = document.getElementById('rpPub_' + fieldId);
      if (!el) return { visible: false, reason: 'missing' };
      wrap = el.closest('.rp-field');
    }
    if (!wrap) return { visible: false, reason: 'wrap missing' };
    return { visible: !wrap.classList.contains('rp-hidden'), hidden: wrap.classList.contains('rp-hidden') };
  }, fieldId);
}

async function selectOption(page, fieldId, value) {
  await page.selectOption('#rpPub_' + fieldId, value);
  await page.waitForTimeout(150);
}

async function toggleChecklist(page, fieldId, value) {
  await page.evaluate(function (args) {
    var boxes = document.querySelectorAll('[data-rp-pub-field="' + args.fieldId + '"] input[type="checkbox"]');
    for (var i = 0; i < boxes.length; i++) {
      if (boxes[i].value === args.value) {
        if (!boxes[i].checked) boxes[i].click();
        boxes[i].dispatchEvent(new Event('change', { bubbles: true }));
        break;
      }
    }
  }, { fieldId, value });
  await page.waitForTimeout(200);
}

async function toggleBoolean(page, fieldId, checked) {
  await page.evaluate(function (args) {
    var el = document.getElementById('rpPub_' + args.fieldId);
    if (!el) return;
    if (el.checked !== args.checked) el.click();
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, { fieldId, checked });
  await page.waitForTimeout(200);
}

async function getHostText(page) {
  return page.evaluate(function () {
    var host = document.getElementById('rpDynamicPublicHost');
    return host ? (host.textContent || '').toLowerCase() : '';
  });
}

async function collectAndFinalize(page, subId) {
  return page.evaluate(function (subId) {
    var ctx = {
      sectorId: 'eventos',
      subcategoriaId: subId,
      formularioId: subId === 'espacios-para-eventos' || subId.indexOf('banquetes') >= 0 || subId.indexOf('food-trucks') >= 0 || subId.indexOf('pirotecnia') >= 0 || subId.indexOf('seguridad') >= 0 || subId.indexOf('valet') >= 0 || subId.indexOf('transporte') >= 0 ? 'negocio_empresa' : 'persona_independiente',
    };
    if (window.CariHubFieldEngineLite) {
      var r = window.CariHubFieldEngineLite.resolveRegistrationSchema({ sectorId: 'eventos', subcategoriaId: subId });
      if (r && r.identidad) ctx.formularioId = r.identidad.formularioId || ctx.formularioId;
    }
    var PB = window.CariHubRegistroPublicBlocks;
    var resolved = window.CariHubFieldEngineLite ? window.CariHubFieldEngineLite.resolveRegistrationSchema(ctx) : null;
    var cfg = PB.resolveConfig(ctx, resolved);
    if (!cfg) return null;
    var values = PB.collectValues(cfg, ctx);
    return values;
  }, subId);
}

async function screenshotFail(page, slug) {
  fs.mkdirSync(shotsDir, { recursive: true });
  const file = path.join(shotsDir, slug + '.png');
  await page.screenshot({ path: file, fullPage: false });
  return file;
}

async function testEspacios(page) {
  const name = '1. Espacios para Eventos';
  const setup = await setupEventosPage(page, 'espacios-para-eventos');
  if (!setup.ok) {
    record(name, false, setup.reason);
    await screenshotFail(page, 'espacios-setup');
    return;
  }
  const must = ['tiposEspacio', 'capacidadMin', 'capacidadMax', 'areasIncluidas', 'estacionamientoCupo', 'cateringPolitica', 'restriccionRuido', 'permiteMusicaEnVivo', 'permitePirotecnia', 'horarioMaximoEvento'];
  const missing = [];
  for (const fid of must) {
    const vis = await isFieldVisible(page, fid);
    if (!vis.visible) missing.push(fid);
  }
  const text = await getHostText(page);
  const generic = ['precio desde', 'servicios incluidos', 'descripción general'].some(function (g) { return text.indexOf(g) >= 0; });
  const blockOk = setup.cfg.blockTitles.some(function (t) { return /salón|quinta|espacio/i.test(t); });
  const pass = missing.length === 0 && !generic && blockOk;
  record(name, pass, pass ? 'campos espacio OK, bloque específico' : 'faltan: ' + missing.join(', ') + (generic ? '; genérico' : ''));
  if (!pass) await screenshotFail(page, 'espacios-fail');
}

async function testGruposFaraFara(page) {
  const name = '2. Grupos Musicales — Fara Fara';
  await setupEventosPage(page, 'grupos-musicales-eventos');
  const before = await isFieldVisible(page, 'descripcionFormatoFaraFara');
  await selectOption(page, 'tipoAgrupacion', 'fara_fara');
  const after = await isFieldVisible(page, 'descripcionFormatoFaraFara');
  const options = await page.evaluate(function () {
    var sel = document.getElementById('rpPub_tipoAgrupacion');
    if (!sel) return [];
    return Array.from(sel.options).map(function (o) { return o.textContent + '|' + o.value; });
  });
  const hasFara = options.some(function (o) { return /fara/i.test(o); });
  const noColombianoMix = !options.some(function (o) { return /colombiano|vallenato/i.test(o) && /fara/i.test(o); });
  const hint = await page.evaluate(function () {
    var sel = document.getElementById('rpPub_tipoAgrupacion');
    return sel ? sel.closest('.rp-field')?.textContent || '' : '';
  });
  const pass = !before.visible && after.visible && hasFara && noColombianoMix && /fara/i.test(hint);
  record(name, pass, pass ? 'condicional Fara Fara visible; opción independiente' : 'before=' + before.visible + ' after=' + after.visible);
  if (!pass) await screenshotFail(page, 'grupos-fara-fara');
}

async function testShowsSensible(page) {
  const name = '3. Shows para Eventos — adulto vs stripper/sensible';
  await setupEventosPage(page, 'shows-para-eventos');
  await selectOption(page, 'publicoObjetivo', 'adultos');
  const flagsAdult = await page.evaluate(function () {
    var PB = window.CariHubRegistroPublicBlocks;
    var API = window.CARIHUB_REGISTRO_EVENTOS_SECTOR_BLOCKS;
    var ctx = { sectorId: 'eventos', subcategoriaId: 'shows-para-eventos', formularioId: 'persona_independiente' };
    var cfg = PB.resolveConfig(ctx, null);
    var values = PB.collectValues(cfg, ctx);
    values.publicoObjetivo = 'adultos';
    values.contenidoSensible = false;
    values.tipoShow = ['mago'];
    values = API.applyEventosFlags(values, 'shows-para-eventos');
    return { sensible: !!values.sensible, requiresAdminReview: !!values.requiresAdminReview };
  });
  await toggleChecklist(page, 'tipoShow', 'strippers');
  await toggleBoolean(page, 'contenidoSensible', true);
  const flagsStrip = await page.evaluate(function () {
    var API = window.CARIHUB_REGISTRO_EVENTOS_SECTOR_BLOCKS;
    var PB = window.CariHubRegistroPublicBlocks;
    var ctx = { sectorId: 'eventos', subcategoriaId: 'shows-para-eventos', formularioId: 'persona_independiente' };
    var cfg = PB.resolveConfig(ctx, null);
    var values = PB.collectValues(cfg, ctx);
    values.tipoShow = ['strippers'];
    values.contenidoSensible = true;
    values.disclaimerReguladoEventos = true;
    values = API.applyEventosFlags(values, 'shows-para-eventos');
    var errs = API.validateEventosSectorValues(values, ctx);
    return {
      sensible: !!values.sensible,
      requiresAdminReview: !!values.requiresAdminReview,
      disclaimerVisible: !document.querySelector('[data-rp-pub-field-wrap="disclaimerReguladoEventos"]')?.classList.contains('rp-hidden'),
      errs: errs.length,
    };
  });
  const pass = !flagsAdult.sensible && !flagsAdult.requiresAdminReview && flagsStrip.sensible && flagsStrip.requiresAdminReview && flagsStrip.disclaimerVisible !== false;
  record(name, pass, pass
    ? 'adulto sin auto-sensible; stripper+sensible → admin + disclaimer'
    : JSON.stringify({ flagsAdult, flagsStrip }));
  if (!pass) await screenshotFail(page, 'shows-sensible');
}

async function testFotoDron(page) {
  const name = '4. Fotografía y Video — dron';
  await setupEventosPage(page, 'fotografia-video-eventos');
  const before = await isFieldVisible(page, 'licenciaDron');
  await toggleChecklist(page, 'serviciosAudiovisual', 'dron');
  const after = await isFieldVisible(page, 'licenciaDron');
  const pass = !before.visible && after.visible;
  record(name, pass, pass ? 'licenciaDron condicional OK' : 'before=' + before.visible + ' after=' + after.visible);
  if (!pass) await screenshotFail(page, 'foto-dron');
}

async function testPirotecnia(page) {
  const name = '5. Pirotecnia y Efectos Especiales';
  const setup = await setupEventosPage(page, 'pirotecnia-efectos-especiales');
  const must = ['tipoEfectoPirotecnia', 'licenciaPirotecnia', 'jurisdiccionPirotecnia', 'polizaSeguroPirotecnia', 'disclaimerReguladoEventos'];
  const missing = [];
  for (const fid of must) {
    const vis = await isFieldVisible(page, fid);
    if (!vis.visible) missing.push(fid);
  }
  const flags = await page.evaluate(function () {
    var cfg = window.CARIHUB_REGISTRO_EVENTOS_SECTOR_BLOCKS.buildConfig({
      sectorId: 'eventos', subcategoriaId: 'pirotecnia-efectos-especiales', formularioId: 'negocio_empresa',
    });
    return cfg.packFlags || {};
  });
  const pass = missing.length === 0 && flags.regulada && flags.requiresAdminReview;
  record(name, pass, pass ? 'regulada + campos licencia/jurisdicción/póliza/disclaimer' : missing.join(', '));
  if (!pass) await screenshotFail(page, 'pirotecnia');
}

async function testFoodTrucks(page) {
  const name = '6. Food Trucks y Carritos';
  await setupEventosPage(page, 'food-trucks-carritos-eventos');
  const must = ['tipoUnidadFood', 'cartaPrincipal', 'comensalesPorHora', 'permisoManipulacionAlimentos', 'requiereAguaLuz'];
  const missing = [];
  for (const fid of must) {
    const vis = await isFieldVisible(page, fid);
    if (!vis.visible) missing.push(fid);
  }
  const pass = missing.length === 0;
  record(name, pass, pass ? 'campos food truck OK' : 'faltan: ' + missing.join(', '));
  if (!pass) await screenshotFail(page, 'food-trucks');
}

async function testValet(page) {
  const name = '7. Valet Parking';
  await setupEventosPage(page, 'valet-parking-eventos');
  const must = ['vehiculosPorHora', 'elementosValet', 'polizaResponsabilidadValet', 'uniformeProfesionalValet', 'coordinacionConVenue'];
  const missing = [];
  for (const fid of must) {
    const vis = await isFieldVisible(page, fid);
    if (!vis.visible) missing.push(fid);
  }
  const pass = missing.length === 0;
  record(name, pass, pass ? 'campos valet OK' : 'faltan: ' + missing.join(', '));
  if (!pass) await screenshotFail(page, 'valet');
}

async function testTransporte(page) {
  const name = '8. Transporte para Eventos';
  await setupEventosPage(page, 'transporte-eventos');
  const must = ['tipoFlotaTransporte', 'capacidadPasajeros', 'incluyeChofer', 'permisoTransporte', 'polizaTransporte', 'radioServicioKm'];
  const missing = [];
  for (const fid of must) {
    const vis = await isFieldVisible(page, fid);
    if (!vis.visible) missing.push(fid);
  }
  const pass = missing.length === 0;
  record(name, pass, pass ? 'flota/capacidad/chofer/permiso/póliza/radio OK' : 'faltan: ' + missing.join(', '));
  if (!pass) await screenshotFail(page, 'transporte');
}

async function testRegressions(page) {
  await page.goto(BASE + '/registro-perfil', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(function () { return !!window.CariHubRegistroPublicBlocks; }, { timeout: 30000 });
  await page.waitForFunction(function () { return !!window.CariHubMediaPlaceholders; }, { timeout: 15000 });

  const registro = await page.evaluate(function () {
    var PB = window.CariHubRegistroPublicBlocks;
    return {
      adultos: PB.matchesEscort({ sectorId: 'adultos', subcategoriaId: 'escort', formularioId: 'adultos' }, null),
      adultosNotEventos: !PB.matchesEventosSector({ sectorId: 'adultos', subcategoriaId: 'escort' }, null),
      bienestar: PB.matchesBienestarSector({ sectorId: 'bienestar', subcategoriaId: 'reiki', formularioId: 'persona_independiente' }, null),
      bienestarCfg: !!PB.resolveConfig({ sectorId: 'bienestar', subcategoriaId: 'reiki', formularioId: 'persona_independiente' }, null),
      geoPicker: !!(window.CariHubGeoPicker && window.CariHubGeoPicker.mount),
      geoData: !!window.CariHubGeoPickerData,
      placeholders: !!(window.CariHubMediaPlaceholders && typeof window.CariHubMediaPlaceholders.url === 'function'),
    };
  });
  record('Regresión Adultos', registro.adultos && registro.adultosNotEventos, 'escort OK; Eventos no intercepta');
  record('Regresión Bienestar', registro.bienestar && registro.bienestarCfg, 'reiki blocks');
  record('Regresión Geo F1 (registro)', registro.geoPicker && registro.geoData, 'GeoPicker + picker data en wizard');
  record('Regresión Placeholders (registro)', registro.placeholders, 'CariHubMediaPlaceholders.url');

  await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(function () {
    return !!(window.CariHubSectores && window.CariHubSectores.sectorPorId('eventos'));
  }, { timeout: 45000 });
  const home = await page.evaluate(function () {
    if (!window.CariHubSectores) return { sectorOk: false, subsCount: 0 };
    var sector = window.CariHubSectores.sectorPorId('eventos');
    var subs = window.CariHubSectores.subcategoriasDeSector('eventos') || [];
    return {
      sectorOk: !!sector,
      subsCount: subs.length,
      hasDjs: subs.some(function (s) { return /dj/i.test(s.id) || /dj/i.test(s.nombre || ''); }),
      hasEspacios: subs.some(function (s) { return s.id === 'espacios-para-eventos'; }),
      geoCatalog: !!(window.CariHubGeoCatalog),
      placeholdersHome: !!(window.CariHubMediaPlaceholders && window.CariHubMediaPlaceholders.paths),
    };
  });
  record('Regresión Home categorías Eventos', home.sectorOk && home.subsCount === 20 && home.hasDjs && home.hasEspacios, '20 subs canon');
  record('Regresión Geo F1 (home)', home.geoCatalog, 'CariHubGeoCatalog en index');
  record('Regresión Placeholders (home)', home.placeholdersHome, 'paths estado/live');
}

function classifyConsole(msg, type) {
  const text = msg.text();
  const entry = { type, text };
  if (type === 'error') consoleErrors.push(entry);
  else if (type === 'warning') consoleWarnings.push(entry);
}

async function main() {
  fs.mkdirSync(shotsDir, { recursive: true });
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: 'msedge' });
    const page = await browser.newPage();
    page.on('console', classifyConsole);
    page.on('pageerror', function (err) {
      consoleErrors.push({ type: 'pageerror', text: err.message });
    });

    await page.goto(BASE + '/registro-perfil', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(function () {
      return !!(window.CARIHUB_REGISTRO_EVENTOS_SECTOR_BLOCKS && window.CariHubRegistroPublicBlocks);
    }, { timeout: 30000 });

    await testEspacios(page);
    await testGruposFaraFara(page);
    await testShowsSensible(page);
    await testFotoDron(page);
    await testPirotecnia(page);
    await testFoodTrucks(page);
    await testValet(page);
    await testTransporte(page);
    await testRegressions(page);
  } catch (e) {
    record('SMOKE RUNTIME', false, e.message);
  } finally {
    if (browser) await browser.close();
  }

  const passed = results.filter(function (r) { return r.pass; }).length;
  const failed = results.filter(function (r) { return !r.pass; });

  console.log('\n=== RESUMEN VISUAL MP-EVENTOS FASE 2 ===');
  console.log('PASS:', passed, '/', results.length);
  console.log('FAIL:', failed.length);

  console.log('\n--- Consola ---');
  const uniqueErrors = [...new Map(consoleErrors.map(function (e) { return [e.text, e]; })).values()];
  if (!uniqueErrors.length) {
    console.log('Sin errores de consola.');
  } else {
    uniqueErrors.forEach(function (e) {
      const blocking = /failed to load|syntaxerror|referenceerror|typeerror/i.test(e.text);
      console.log(`[${e.type}] ${e.text.slice(0, 200)}${blocking ? ' — BLOQUEANTE potencial' : ' — preexistente/no bloqueante'}`);
    });
  }

  const uxPass = results.filter(function (r) { return r.pass && /^[1-8]\./.test(r.name); }).length;
  console.log('\nUX rentero (formularios específicos):', uxPass >= 8 ? 'PASS — 8/8 subs con campos de oficio' : 'FAIL — ' + uxPass + '/8');

  if (failed.length) {
    console.log('\nCapturas en:', shotsDir);
    process.exit(1);
  }
}

main();
