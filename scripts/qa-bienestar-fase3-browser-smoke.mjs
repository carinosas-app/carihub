/**
 * Smoke visual/browser — MP-BIENESTAR Fase 3 Preview + Ficha
 * Uso: npx serve public -l 3457
 *      node scripts/qa-bienestar-fase3-browser-smoke.mjs
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:3457';
const CACHE = '20260630f3';

const CASES = [
  {
    pack: 'A',
    subId: 'reiki',
    label: 'Reiki',
    values: {
      alias: 'Luna Reiki QA',
      certificaciones: 'Reiki Usui Nivel II',
      tarifaDesde: '$600',
      horarioDetalle: 'Lun–Sáb 10–19h',
      modalidadesTerapia: ['Masaje', 'Energética manual'],
      duracionSesionMinutos: '60_min',
      contraindicacionesGenerales: 'No embarazo avanzado.',
    },
    cardMust: ['Luna Reiki QA', 'res-card--pack-a', 'res-card--bienestar-holistico'],
    cardMustNot: ['disclaimerRegulado', 'tipoExperienciaCeremonial', 'carrito'],
    fichaMust: ['Terapia holística', 'Servicios / enfoque', 'Luna Reiki QA'],
    fichaMustNot: ['Opiniones de clientes', 'carrito', 'e-commerce'],
    vista: 'pro',
  },
  {
    pack: 'B',
    subId: 'yoga',
    label: 'Yoga',
    values: {
      alias: 'Flow Yoga QA',
      certificaciones: 'RYT-200',
      tarifaDesde: '$350',
      horarioDetalle: 'Ma–Do 7–20h',
      tipoPractica: 'Hatha / Vinyasa',
      modalidadClase: 'hibrido',
      nivelesAtendidos: 'todos',
    },
    cardMust: ['Flow Yoga QA', 'res-card--pack-b'],
    cardMustNot: ['disclaimerRegulado', 'modalidadesTerapia'],
    fichaMust: ['Movimiento', 'Flow Yoga QA', 'Hatha'],
    fichaMustNot: ['Ceremonia guiada'],
    vista: 'pro',
  },
  {
    pack: 'C',
    subId: 'centros-holisticos',
    label: 'Centros Holísticos',
    values: {
      alias: 'Centro Om QA',
      certificaciones: 'Espacio holístico',
      tarifaDesde: 'Consultar',
      horarioDetalle: 'Diario 9–21h',
      serviciosCentro: ['Terapias individuales', 'Talleres'],
      capacidadGrupo: '15',
    },
    cardMust: ['Centro Om QA', 'res-card--pack-c'],
    cardMustNot: ['disclaimerRegulado', 'tipoPractica'],
    fichaMust: ['Centro', 'Centro Om QA', 'Terapias individuales'],
    fichaMustNot: ['carrito'],
    vista: 'pro',
  },
  {
    pack: 'D',
    subId: 'productos-naturistas',
    label: 'Productos Naturistas',
    values: {
      alias: 'Natura Viva QA',
      certificaciones: 'Comercio natural',
      tarifaDesde: 'Varios',
      horarioDetalle: 'Lun–Sáb',
      categoriasProductoBienestar: ['Inciensos', 'Aceites'],
      surtidoPrincipal: 'Inciensos artesanales',
      ventaPresencial: 'Sí',
    },
    cardMust: ['Natura Viva QA', 'res-card--pack-d'],
    cardMustNot: ['disclaimerRegulado', 'tipoExperienciaCeremonial'],
    fichaMust: ['Productos naturales', 'Inciensos'],
    fichaMustNot: ['Jurisdicción'],
    vista: 'pro',
  },
  {
    pack: 'D_RETAIL',
    subId: 'venta-de-inciensos',
    label: 'Venta de Inciensos',
    values: {
      nombreComercial: 'Aromas Valle QA',
      categoriasProductoBienestar: ['Inciensos', 'Sahumerios'],
      surtidoPrincipal: 'Resinas e inciensos',
      direccion: 'Centro, Oaxaca',
      horarioDetalle: '10–19h',
    },
    cardMust: ['Aromas Valle QA', 'res-card--pack-d'],
    cardMustNot: ['inmobiliar', 'bienes raíces', 'envío a domicilio', 'carrito'],
    fichaMust: ['Aromas Valle QA', 'Productos naturales', 'Dirección'],
    fichaMustNot: ['Opiniones de clientes', 'inmobiliar', 'data-vista="adult"'],
    vista: 'empresa',
  },
  {
    pack: 'E',
    subId: 'tarot',
    label: 'Tarot',
    values: {
      alias: 'Oráculo Luna QA',
      certificaciones: 'Tarot terapéutico',
      tarifaDesde: '$450',
      horarioDetalle: 'Con cita',
      enfoqueEspiritual: 'Lectura simbólica sin diagnóstico médico.',
      modalidadLectura: 'ambas',
    },
    cardMust: ['Oráculo Luna QA', 'res-card--pack-e'],
    cardMustNot: ['modalidadesTerapia', 'disclaimerRegulado'],
    fichaMust: ['Espiritualidad', 'Oráculo Luna QA'],
    fichaMustNot: ['carrito'],
    vista: 'pro',
  },
  {
    pack: 'F',
    subId: 'coaching-de-vida',
    label: 'Coaching de Vida',
    values: {
      alias: 'Coach Vital QA',
      certificaciones: 'Coaching ontológico',
      tarifaDesde: '$800',
      horarioDetalle: 'Citas',
      areaCoaching: 'Propósito y transiciones',
      modalidadSesionCoaching: 'individual',
    },
    cardMust: ['Coach Vital QA', 'res-card--pack-f'],
    cardMustNot: ['tipoExperienciaCeremonial'],
    fichaMust: ['Coaching', 'Coach Vital QA', 'Propósito'],
    fichaMustNot: ['carrito'],
    vista: 'pro',
  },
  {
    pack: 'G',
    subId: 'retiros-espirituales',
    label: 'Retiros Espirituales',
    values: {
      alias: 'Retiro Sol QA',
      certificaciones: 'Facilitador de retiros',
      tarifaDesde: 'Consultar',
      horarioDetalle: 'Por temporada',
      tipoExperiencia: 'retiro',
      fechasExperiencia: 'Marzo 2026',
      lugarExperiencia: 'Tepoztlán',
      cupoMaximo: '12',
    },
    cardMust: ['Retiro Sol QA', 'res-card--pack-g'],
    cardMustNot: ['disclaimerRegulado'],
    fichaMust: ['Retiro Sol QA', 'Tepoztlán', 'Retiro'],
    fichaMustNot: ['carrito', 'dosis'],
    vista: 'pro',
  },
  {
    pack: 'H',
    subId: 'ceremonias-ayahuasca-rape-plantas-de-poder',
    label: 'Ceremonias Ayahuasca',
    values: {
      alias: 'Centro Ceremonial QA',
      certificaciones: 'Facilitador con experiencia',
      tarifaDesde: 'Consultar contribución',
      horarioDetalle: 'Por calendario',
      disclaimerRegulado: true,
      edadMinimaServicio: '18',
      jurisdiccionDeclarada: 'México — Oaxaca',
      contraindicacionesObligatorias: 'No apto con ciertos medicamentos.',
      tipoExperienciaCeremonial: 'ceremonia_guiada',
      acompanamientoCeremonial: ['Antes', 'Durante', 'Después'],
      requisitosPrevios: 'Ayuno ligero.',
      fechasCeremonia: 'Consultar calendario',
      cupoCeremonia: '8',
      lugarCeremonia: 'Centro de retiro',
    },
    cardMust: ['Centro Ceremonial QA', 'res-card--pack-h', 'res-badge--regulada', 'Ceremonia guiada'],
    cardMustNot: ['carrito', 'e-commerce', 'stock', 'dosis', 'precio por sustancia', 'catálogo comercial'],
    fichaMust: [
      'Centro Ceremonial QA',
      'Aviso legal',
      'Jurisdicción',
      'Contraindicaciones',
      'Requisitos previos',
      'Solicitar información / consultar fechas',
      'Contenido sensible',
      'Experiencia regulada',
    ],
    fichaMustNot: ['Opiniones de clientes', 'carrito', 'e-commerce', 'stock', 'dosis', 'precio por sustancia'],
    vista: 'pro',
  },
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
function includesAny(hay, needles) {
  const low = String(hay || '').toLowerCase();
  return needles.some((n) => low.includes(String(n).toLowerCase()));
}
function includesAll(hay, needles) {
  const low = String(hay || '').toLowerCase();
  return needles.every((n) => low.includes(String(n).toLowerCase()));
}

async function fillField(page, fieldId, value) {
  await page.evaluate(
    ({ fieldId, value }) => {
      const host = document.getElementById('rpDynamicPublicHost');
      if (!host) return;
      const wrap = host.querySelector('[data-rp-pub-field-wrap="' + fieldId + '"]');
      const el =
        document.getElementById('rpPub_' + fieldId) ||
        host.querySelector('[data-rp-pub-field="' + fieldId + '"] input') ||
        host.querySelector('[data-rp-pub-field="' + fieldId + '"] textarea') ||
        host.querySelector('[data-rp-pub-field="' + fieldId + '"] select');
      if (!el) return;
      if (el.type === 'checkbox') {
        el.checked = !!value;
        el.dispatchEvent(new Event('change', { bubbles: true }));
        return;
      }
      if (Array.isArray(value)) {
        const checks = host.querySelectorAll('[data-rp-pub-field="' + fieldId + '"] input[type="checkbox"]');
        checks.forEach((c) => {
          c.checked = value.indexOf(c.value) >= 0;
          c.dispatchEvent(new Event('change', { bubbles: true }));
        });
        return;
      }
      el.value = String(value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    },
    { fieldId, value }
  );
}

async function runCase(page, browser, c) {
  const tag = `${c.pack}/${c.subId}`;

  const setup = await page.evaluate(
    async (args) => {
      const subId = args.subId;
      const sector = window.CariHubSectores && CariHubSectores.sectorPorId('bienestar');
      const subs = window.CariHubSectores ? window.CariHubSectores.subcategoriasDeSector('bienestar') : [];
      let sub = subs.find((s) => s.id === subId);
      if (!sub) return { ok: false, reason: 'sub no encontrada' };

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
        });
      }

      document.querySelectorAll('.rp-screen').forEach((el) => {
        el.classList.toggle('is-active', el.id === 'screen1');
      });
      const host = document.getElementById('rpDynamicPublicHost');
      if (!host) return { ok: false, reason: 'host missing' };
      host.classList.remove('rp-hidden');
      host.setAttribute('aria-hidden', 'false');

      const resolved = window.CariHubFieldEngineLite
        ? window.CariHubFieldEngineLite.resolveRegistrationSchema(ctx)
        : null;
      window.CariHubRegistroPublicBlocks.apply(ctx, resolved, null);

      if (window.CariHubRegistroPerfilPreview && window.CariHubRegistroPerfilPreview.bind) {
        window.CariHubRegistroPerfilPreview.bind({
          getContext: () => ctx,
          getSector: () => sector,
          getSubcategoria: () => sub,
        });
      }

      window.__qaCtx = ctx;
      window.__qaResolved = resolved;
      return { ok: true, ctx, deltaPack: window.CARIHUB_REGISTRO_BIENESTAR_SECTOR_BLOCKS.resolvePack(subId) };
    },
    { subId: c.subId }
  );

  if (!setup.ok) {
    bad(`${tag} setup`, setup.reason);
    return;
  }
  if (setup.deltaPack !== c.pack.replace('_RETAIL', '')) {
    bad(`${tag} pack`, `esperado ${c.pack} got ${setup.deltaPack}`);
    return;
  }

  for (const [k, v] of Object.entries(c.values)) {
    await fillField(page, k, v);
  }
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    if (window.CariHubRegistroPerfilPreview && window.CariHubRegistroPerfilPreview.refresh) {
      window.CariHubRegistroPerfilPreview.refresh();
    }
  });
  await page.waitForTimeout(500);

  const preview = await page.evaluate(() => {
    const mount = document.getElementById('rpPreviewResultadosMount');
    const frame = document.getElementById('rpPreviewPerfilFrame');
    const cardHtml = mount ? mount.innerHTML : '';
    const empty = !cardHtml || cardHtml.includes('rp-preview-empty');
    const payload =
      window.CariHubRegistroPerfilPreview && window.CariHubRegistroPerfilPreview.buildPreviewPayload
        ? window.CariHubRegistroPerfilPreview.buildPreviewPayload()
        : null;
    return {
      cardHtml,
      cardEmpty: empty,
      cardLen: cardHtml.length,
      iframeSrc: frame ? frame.src : '',
      iframeOk: !!(frame && frame.src && /perfil-publico(\.html)?(\?|$)/.test(frame.src)),
      vista: payload ? payload.vista : '',
      perfil: payload ? payload.perfil : null,
    };
  });

  if (preview.cardEmpty || preview.cardLen < 80) {
    bad(`${tag} preview tarjeta`, 'vacía o pantalla blanca');
  } else {
    ok(`${tag} preview tarjeta`, `${preview.cardLen} chars`);
  }

  if (!preview.iframeOk) {
    bad(`${tag} preview iframe`, preview.iframeSrc || 'sin src');
  } else {
    ok(`${tag} preview iframe`, 'perfil-publico');
  }

  if (c.vista && preview.vista !== c.vista) {
    bad(`${tag} preview vista`, `esperada ${c.vista} got ${preview.vista}`);
  } else if (c.vista) {
    ok(`${tag} preview vista`, preview.vista);
  }

  for (const m of c.cardMust) {
    if (preview.cardHtml.includes(m) || includesAny(preview.cardHtml, [m])) ok(`${tag} card tiene ${m}`);
    else bad(`${tag} card falta ${m}`);
  }
  for (const m of c.cardMustNot) {
    if (includesAny(preview.cardHtml, [m])) bad(`${tag} card prohibido ${m}`);
    else ok(`${tag} card sin ${m}`);
  }

  // Ficha pública vía sessionStorage + navegación directa
  if (preview.perfil) {
    const payload = {
      vista: preview.vista || c.vista,
      tema: 'pro',
      perfil: preview.perfil,
      query: { categoria: c.label },
    };
    const fichaUrl =
      `${BASE}/perfil-publico?previewSource=registro&from=registro&vista=${encodeURIComponent(preview.vista || c.vista)}&categoria=${encodeURIComponent(c.label)}&v=${CACHE}`;

    const fichaPage = await browser.newPage();
    fichaPage.on('console', (msg) => {
      if (msg.type() !== 'error') return;
      const t = msg.text();
      if (/firebase|firestore|permission|favicon|404/i.test(t)) return;
      consoleErrors.push(`[${tag}] ${t}`);
    });
    fichaPage.on('pageerror', (err) => {
      if (/firebase|firestore/i.test(err.message)) return;
      consoleErrors.push(`[${tag}] PAGEERROR: ${err.message}`);
    });

    await fichaPage.addInitScript(
      ({ storageKey, payload }) => {
        sessionStorage.setItem(storageKey, JSON.stringify(payload));
      },
      { storageKey: 'carihub_rp_public_preview', payload }
    );

    await fichaPage.goto(fichaUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await fichaPage.waitForFunction(
      () => {
        const w = document.getElementById('wrap');
        return w && w.innerHTML && w.innerHTML.length > 200;
      },
      { timeout: 20000 }
    );
    await fichaPage.waitForTimeout(600);

    const ficha = await fichaPage.evaluate(() => {
      const wrap = document.getElementById('wrap');
      const body = document.body;
      return {
        html: wrap ? wrap.innerHTML : '',
        bodyVista: body ? body.getAttribute('data-vista') : '',
        bodyTema: body ? body.getAttribute('data-tema') : '',
        perfilTipo: body ? body.getAttribute('data-perfil-tipo') : '',
        title: document.title,
      };
    });

    if (!ficha.html || ficha.html.length < 200) {
      bad(`${tag} ficha carga`, 'wrap vacío');
    } else {
      ok(`${tag} ficha carga`, `${ficha.html.length} chars`);
    }

    if (c.vista === 'empresa') {
      if (ficha.bodyVista === 'empresa' || ficha.perfilTipo === 'empresa') ok(`${tag} ficha layout empresa`);
      else bad(`${tag} ficha layout empresa`, `vista=${ficha.bodyVista} tipo=${ficha.perfilTipo}`);
      if (ficha.bodyVista === 'adult' || ficha.bodyTema === 'adult') {
        bad(`${tag} ficha NO adultos negocio`, `vista=${ficha.bodyVista}`);
      } else {
        ok(`${tag} ficha NO adultos negocio`);
      }
    } else if (c.vista === 'pro') {
      if (ficha.bodyVista === 'pro' || ficha.perfilTipo === 'pro') ok(`${tag} ficha layout pro`);
      else bad(`${tag} ficha layout pro`, `vista=${ficha.bodyVista} tipo=${ficha.perfilTipo}`);
    }

    for (const m of c.fichaMust) {
      if (includesAny(ficha.html, [m])) ok(`${tag} ficha tiene ${m}`);
      else bad(`${tag} ficha falta ${m}`);
    }
    for (const m of c.fichaMustNot) {
      if (includesAny(ficha.html, [m])) bad(`${tag} ficha prohibido ${m}`);
      else ok(`${tag} ficha sin ${m}`);
    }
    await fichaPage.close();
  } else {
    bad(`${tag} ficha`, 'sin payload perfil');
  }
}

async function smokeSpaMasajes(regPage, browser) {
  const tag = 'REGRESSION/spa-masajes';
  await regPage.goto(`${BASE}/registro-perfil.html?v=${CACHE}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await regPage.waitForFunction(
    () => window.CariHubRegistroPublicBlocks && window.CariHubPublicRenderLite,
    { timeout: 25000 }
  );

  const spaCheck = await regPage.evaluate(() => {
    const PB = window.CariHubRegistroPublicBlocks;
    const PR = window.CariHubPublicRenderLite;
    const vals = PB.finalizeBienestarValues(
      {
        nombreComercial: 'Spa QA Smoke',
        menuServicios: 'Masaje relajante',
        tarifaDesde: '$890',
        horarioDetalle: 'Lun–Dom',
      },
      { subcategoriaId: 'spa', arquetipo: 'negocio_bienestar', tipoPerfil: 'negocio' }
    );
    const u = PB.mapBienestarToPerfil({ subcategoriaId: 'spa' }, vals, { subcategoriaId: 'spa', arquetipo: 'negocio_bienestar' });
    const card = PR.cardHTML(u, { categoria: 'Spa' });
    const BR = window.CariHubBienestarSectorRender;
    return {
      isAdultosBienestar: PR.isBienestarPerfil(u),
      isSector: BR ? BR.isBienestarSectorPerfil(u) : false,
      cardHasHolistico: card.includes('res-card--bienestar-holistico'),
      cardHasSpa: card.includes('res-card--bienestar') || card.includes('res-card--spa'),
    };
  });

  if (spaCheck.isAdultosBienestar && !spaCheck.isSector) ok(`${tag} spa adultos OK`);
  else bad(`${tag} spa adultos`, JSON.stringify(spaCheck));
  if (spaCheck.cardHasSpa && !spaCheck.cardHasHolistico) ok(`${tag} spa card adultos layout`);
  else bad(`${tag} spa card`, JSON.stringify(spaCheck));
}

async function main() {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage();

  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const t = msg.text();
    if (/firebase|firestore|permission|favicon|404/i.test(t)) return;
    consoleErrors.push(t);
  });
  page.on('pageerror', (err) => {
    if (/firebase|firestore/i.test(err.message)) return;
    consoleErrors.push('PAGEERROR: ' + err.message);
  });

  await page.goto(`${BASE}/registro-perfil.html?v=${CACHE}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(
    () =>
      window.CariHubRegistroPublicBlocks &&
      window.CARIHUB_REGISTRO_BIENESTAR_SECTOR_BLOCKS &&
      window.CariHubBienestarSectorRender &&
      window.CariHubRegistroPerfilPreview,
    { timeout: 30000 }
  );
  ok('APIs Fase 3 precarga', 'blocks+render+preview');

  for (const c of CASES) {
    try {
      await runCase(page, browser, c);
    } catch (e) {
      bad(`${c.pack}/${c.subId} excepción`, e.message);
    }
  }

  await smokeSpaMasajes(page, browser);

  await browser.close();

  const packResults = {};
  for (const c of CASES) {
    const key = c.pack;
    const pFails = fail.filter((f) => f.name.startsWith(`${c.pack}/${c.subId}`));
    packResults[key] = packResults[key] || { preview: 'PASS', ficha: 'PASS' };
    if (pFails.some((f) => f.name.includes('preview') || f.name.includes('card'))) packResults[key].preview = 'FAIL';
    if (pFails.some((f) => f.name.includes('ficha'))) packResults[key].ficha = 'FAIL';
  }

  const hFails = fail.filter((f) => f.name.startsWith('H/') || f.name.includes('Ceremonias'));
  const dRetailFails = fail.filter((f) => f.name.includes('venta-de-inciensos') || f.name.includes('D_RETAIL'));

  console.log('\n=== QA FASE 3 BROWSER SMOKE VISUAL ===');
  console.log('BASE:', BASE);
  console.log('PASS:', pass.length);
  console.log('FAIL:', fail.length);

  console.log('\n--- Preview por pack ---');
  for (const c of CASES) {
    const pFails = fail.filter(
      (f) =>
        f.name.startsWith(`${c.pack}/${c.subId}`) &&
        (f.name.includes('preview') || f.name.includes('card') || f.name.includes('iframe') || f.name.includes('vista'))
    );
    console.log(`${c.pack} (${c.label}): ${pFails.length ? 'FAIL' : 'PASS'}`);
  }

  console.log('\n--- Ficha pública por pack ---');
  for (const c of CASES) {
    const fFails = fail.filter((f) => f.name.startsWith(`${c.pack}/${c.subId}`) && f.name.includes('ficha'));
    console.log(`${c.pack} (${c.label}): ${fFails.length ? 'FAIL' : 'PASS'}`);
  }

  console.log('\n--- Pack H especial ---', hFails.length ? 'FAIL' : 'PASS');
  console.log('--- Retail D especial ---', dRetailFails.length ? 'FAIL' : 'PASS');
  console.log('--- Spa/masajes regresión ---', fail.some((f) => f.name.startsWith('REGRESSION/')) ? 'FAIL' : 'PASS');

  console.log('\n--- Errores consola (filtrados) ---', consoleErrors.length);
  consoleErrors.slice(0, 20).forEach((e) => console.log(' ', e));

  if (fail.length) {
    console.log('\n--- Primeros FAIL ---');
    fail.slice(0, 40).forEach((f) => console.log(' FAIL', f.name, f.detail || ''));
    process.exit(1);
  }
  console.log('\nOK — smoke visual Fase 3 completo');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
