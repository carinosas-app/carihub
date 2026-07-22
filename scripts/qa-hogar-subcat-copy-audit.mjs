/**
 * QA copy-audit — subcategorías Hogar (perfil público DEMO).
 *
 * Uso:
 *   NODE_PATH=../carihub/node_modules node scripts/qa-hogar-subcat-copy-audit.mjs
 *   BASE_URL=http://127.0.0.1:5212 ONLY_SUBS=jardineria,cerrajeros node scripts/qa-hogar-subcat-copy-audit.mjs
 *
 * Salida:
 *   .local/qa-hogar-subcat-copy-audit.json
 *   .local/qa-hogar-subcat-copy-audit.md
 */
import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, '.local');
const BASE = (process.env.BASE_URL || 'http://127.0.0.1:5212').replace(/\/$/, '');
const EDGE =
  process.env.EDGE_PATH ||
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

let SUB_TO_PACK = {};
try {
  const blocksPath = path.join(ROOT, 'public', 'js', 'data', 'registro-hogar-blocks.js');
  const src = fs.readFileSync(blocksPath, 'utf8');
  const m = src.match(/var SUB_TO_PACK = \{([\s\S]*?)\n  \};/);
  if (m) {
    const body = m[1];
    const re = /['"]?([a-z0-9-]+)['"]?\s*:\s*['"]([A-D])['"]/g;
    let hit;
    while ((hit = re.exec(body))) SUB_TO_PACK[hit[1]] = hit[2];
  }
} catch (e) {
  console.warn('No se pudo cargar packs hogar:', e && e.message);
}

const SUBS_ALL = Object.keys(SUB_TO_PACK).sort();
const ONLY = String(process.env.ONLY_SUBS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const SUBS = ONLY.length ? SUBS_ALL.filter((s) => ONLY.includes(s)) : SUBS_ALL;

const FAMILY_HINTS = {
  A: {
    expectAny: ['plomer', 'fuga', 'destape', 'albanil', 'muro', 'impermeabil', 'azotea', 'obra'],
    foreignStrong: ['jardinera verde', 'domotica smart', 'camaras seguras', 'cerrajeria 24']
  },
  B: {
    expectAny: ['electric', 'tablero', 'hvac', 'minisplit', 'solar', 'panel', 'camara', 'cctv', 'domotic', 'smart'],
    foreignStrong: ['plomeria express', 'jardinera verde', 'pintura profesional', 'herreria y estructuras']
  },
  C: {
    expectAny: ['carpinter', 'closet', 'mueble', 'herrer', 'porton', 'piso', 'laminado', 'cerraj', 'chapa'],
    foreignStrong: ['plomeria express', 'clima & hvac', 'fumigacion total', 'paneles solares']
  },
  D: {
    expectAny: ['pintura', 'jardin', 'poda', 'fumig', 'plaga', 'limpieza', 'mantenimiento'],
    foreignStrong: ['plomeria express', 'electricista pro', 'camaras seguras', 'carpinteria a medida']
  }
};

const SLUG_FORBIDDEN = {
  plomeros: ['jardinera verde', 'pintura profesional', 'electricista pro', 'cerrajeria 24'],
  albaniles: ['plomeria express', 'jardinera verde', 'domotica', 'fumigacion total'],
  impermeabilizadores: ['plomeria express', 'jardinera verde', 'electricista pro', 'lavado express'],
  electricistas: ['plomeria express', 'jardinera verde', 'pintura profesional', 'fumigacion'],
  'tecnicos-en-clima-hvac': ['plomeria express', 'jardinera verde', 'cerrajeria 24', 'paneles solares'],
  'instaladores-de-paneles-solares': ['plomeria express', 'jardineria verde', 'fumigacion', 'cerrajeria'],
  'tecnicos-en-camaras-de-seguridad': ['plomeria express', 'pintura profesional', 'jardineria', 'albanileria'],
  'domotica-casa-inteligente': ['plomeria express', 'fumigacion', 'jardinera verde', 'herreria'],
  carpinteros: ['plomeria express', 'electricista pro', 'jardineria verde', 'fumigacion'],
  herreros: ['plomeria express', 'jardinera verde', 'pintura profesional', 'limpieza express'],
  'instaladores-de-pisos': ['plomeria express', 'electricista pro', 'jardineria verde', 'camaras'],
  cerrajeros: ['plomeria express', 'pintura profesional', 'jardineria verde', 'hvac'],
  pintores: ['plomeria express', 'jardineria verde', 'electricista pro', 'cerrajeria 24'],
  jardineria: ['plomeria express', 'pintura profesional', 'electricista pro', 'albanileria'],
  fumigacion: ['plomeria express', 'pintura profesional', 'jardineria verde', 'carpinteria'],
  'limpieza-del-hogar': ['plomeria express', 'electricista pro', 'jardineria verde', 'herreria'],
  'mantenimiento-general': ['jardinera verde', 'camaras seguras', 'domotica smart', 'paneles solares']
};

const EXPECTED_NAME = {
  plomeros: 'plomeria express',
  albaniles: 'albanileria del norte',
  impermeabilizadores: 'impermeabilizaciones norte',
  electricistas: 'electricista pro',
  'tecnicos-en-clima-hvac': 'clima & hvac',
  'instaladores-de-paneles-solares': 'solar paneles',
  'tecnicos-en-camaras-de-seguridad': 'camaras seguras',
  'domotica-casa-inteligente': 'domotica smart',
  carpinteros: 'carpinteria a medida',
  herreros: 'herreria y estructuras',
  'instaladores-de-pisos': 'pisos & acabados',
  cerrajeros: 'cerrajeria 24',
  pintores: 'pintura profesional',
  jardineria: 'jardineria verde',
  fumigacion: 'fumigacion total',
  'limpieza-del-hogar': 'limpieza express',
  'mantenimiento-general': 'mantenimiento integral'
};

function norm(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function uniqTokens(text, limit = 40) {
  const stop = new Set(
    'de la el los las un una y o en a para con por del al se que es su sus lo le les al'.split(' ')
  );
  const counts = new Map();
  String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9áéíóúñü\s-]/gi, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !stop.has(w))
    .forEach((w) => counts.set(w, (counts.get(w) || 0) + 1));
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w, n]) => (n > 1 ? `${w}(${n})` : w));
}

function heuristicVerdict(subId, pack, blob, extracted) {
  const n = norm(blob);
  const hints = FAMILY_HINTS[pack] || { expectAny: [], foreignStrong: [] };
  const issues = [];
  const forbidden = SLUG_FORBIDDEN[subId] || [];

  forbidden.forEach((f) => {
    if (f === 'tabs plomeria') return;
    if (n.includes(norm(f))) issues.push(`slug_forbidden:${f}`);
  });
  hints.foreignStrong.forEach((f) => {
    if (n.includes(norm(f))) issues.push(`pack_foreign:${f}`);
  });

  if (extracted && extracted.hasLegacyPlomeriaTabs) {
    issues.push('legacy_plomeria_tabs');
  }

  const expectName = EXPECTED_NAME[subId];
  if (expectName && extracted && extracted.nombre && !norm(extracted.nombre).includes(norm(expectName))) {
    issues.push(`wrong_demo_name:expected~${expectName}`);
  }

  const hasExpect = (hints.expectAny || []).some((e) => n.includes(norm(e)));
  const slugBits = subId.split('-').filter((x) => x.length > 3);
  const slugInCopy = slugBits.some((b) => n.includes(norm(b)));

  let status = 'OK';
  if (issues.length) status = 'FAIL';
  else if (!hasExpect && !slugInCopy) status = 'REVIEW';

  return { status, issues, hasExpect, slugInCopy };
}

async function extractPage(page, subId) {
  const url = `${BASE}/perfil-publico.html?categoria=${encodeURIComponent(subId)}&from=resultados`;
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      lastErr = null;
      break;
    } catch (e) {
      lastErr = e;
      const msg = String(e && e.message ? e.message : e);
      if (!/ERR_CONNECTION_REFUSED|Timeout|net::ERR_/i.test(msg) || attempt === 3) throw e;
      await page.waitForTimeout(800 * attempt);
    }
  }
  if (lastErr) throw lastErr;
  await page.waitForTimeout(2200);

  return page.evaluate((categoria) => {
    const text = (sel) => {
      const el = document.querySelector(sel);
      return el ? String(el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim() : '';
    };
    const u = window.__perfilActual || {};
    const faq = Array.isArray(u.faq)
      ? u.faq.map((x) => (typeof x === 'string' ? x : x && (x.q || x.pregunta || '') + ' ' + (x.a || x.respuesta || ''))).filter(Boolean)
      : [];
    const feats = Array.isArray(u.feats) ? u.feats.slice(0, 12) : [];
    const servicios = Array.isArray(u.serviciosIncluidos) ? u.serviciosIncluidos.slice(0, 12) : [];
    const p = u.hogarPerfil || {};
    const tabsText = text('.tabs');
    const hasLegacyPlomeriaTabs =
      /plomer/i.test(tabsText) && (/servicio/i.test(tabsText) || /mantenimiento/i.test(tabsText));
    return {
      categoriaQuery: categoria,
      vista: document.body.getAttribute('data-vista'),
      pack: u.__hogarPack || u.deltaPack || null,
      sectorId: u.sectorId || null,
      subcategoriaId: u.subcategoriaId || null,
      nombre: u.nombre || u.alias || null,
      titulo: text('[data-pub-block="titulo"], .idname, .pro-title, h1') || String(u.titulo || u.categoriaPublica || ''),
      tagline: u.tagline || u.frase || '',
      sobre: String(u.sobreMi || u.tagline || '').slice(0, 500),
      servicios,
      feats,
      faq,
      tabsText,
      hasLegacyPlomeriaTabs,
      nestedKeys: Object.keys(p).slice(0, 20)
    };
  }, subId);
}

function buildBlob(row) {
  return [
    row.titulo,
    row.tagline,
    row.sobre,
    row.nombre,
    ...(row.servicios || []),
    ...(row.feats || []),
    ...(row.faq || [])
  ].join(' ');
}

function verdictLine(row) {
  const s = row.status || '?';
  if (s === 'OK') return 'OK   ';
  if (s === 'REVIEW') return 'REV  ';
  if (s === 'FAIL') return 'FAIL ';
  return 'ERR  ';
}

function toMarkdown(summary, rows) {
  const lines = [];
  lines.push('# QA copy-audit — Hogar');
  lines.push('');
  lines.push(`Generado: ${summary.generatedAt}`);
  lines.push(`Base: ${summary.baseUrl}`);
  lines.push(`Total: ${summary.total} · OK ${summary.ok} · REVIEW ${summary.review} · FAIL ${summary.fail} · ERROR ${summary.error}`);
  lines.push('');
  lines.push('## Fallos / a revisar');
  lines.push('');
  rows
    .filter((r) => r.status !== 'OK')
    .forEach((r) => {
      lines.push(`### ${r.status} — \`${r.subcategoria}\` (mapa ${r.packMap})`);
      lines.push(`- Título: ${r.titulo || '—'}`);
      lines.push(`- Nombre demo: ${r.nombre || '—'}`);
      lines.push(`- Issues: ${(r.issues || []).join(', ') || '—'}`);
      lines.push(`- Tokens: ${(r.tokens || []).slice(0, 16).join(', ')}`);
      lines.push('');
    });
  lines.push('## Todas');
  lines.push('');
  lines.push('| Status | Subcategoría | Pack | Nombre | Tokens top |');
  lines.push('|--------|--------------|------|--------|------------|');
  rows.forEach((r) => {
    const nom = String(r.nombre || '').replace(/\|/g, '/').slice(0, 40);
    const tok = (r.tokens || []).slice(0, 8).join(', ').replace(/\|/g, '/');
    lines.push(`| ${r.status} | ${r.subcategoria} | ${r.packMap} | ${nom} | ${tok} |`);
  });
  lines.push('');
  return lines.join('\n');
}

async function main() {
  if (!SUBS.length) {
    console.error('Sin subcategorías Hogar para auditar.');
    process.exit(2);
  }
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    executablePath: EDGE,
    headless: true
  });
  const page = await browser.newPage();
  const rows = [];

  for (const subId of SUBS) {
    const pack = SUB_TO_PACK[subId] || '?';
    let row;
    try {
      const extracted = await extractPage(page, subId);
      const blob = buildBlob(extracted);
      const verdict = heuristicVerdict(subId, pack, blob, extracted);
      row = {
        subcategoria: subId,
        packMap: pack,
        ok: verdict.status === 'OK',
        status: verdict.status,
        issues: verdict.issues,
        tokens: uniqTokens(blob, 28),
        ...extracted
      };
    } catch (e) {
      row = {
        subcategoria: subId,
        packMap: pack,
        ok: false,
        status: 'ERROR',
        issues: [String(e && e.message ? e.message : e)],
        tokens: [],
        titulo: '',
        sobre: '',
        servicios: [],
        faq: []
      };
    }
    rows.push(row);
    console.log(`${verdictLine(row)}  ${subId}`);
  }

  try {
    await Promise.race([
      browser.close(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('browser.close timeout')), 8000))
    ]);
  } catch (e) {
    console.warn('browser.close:', e && e.message ? e.message : e);
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE,
    total: rows.length,
    ok: rows.filter((r) => r.status === 'OK').length,
    review: rows.filter((r) => r.status === 'REVIEW').length,
    fail: rows.filter((r) => r.status === 'FAIL').length,
    error: rows.filter((r) => r.status === 'ERROR').length
  };

  const jsonPath = path.join(OUT_DIR, 'qa-hogar-subcat-copy-audit.json');
  const mdPath = path.join(OUT_DIR, 'qa-hogar-subcat-copy-audit.md');
  fs.writeFileSync(jsonPath, JSON.stringify({ summary, rows }, null, 2), 'utf8');
  fs.writeFileSync(mdPath, toMarkdown(summary, rows), 'utf8');

  console.log('\n' + JSON.stringify(summary, null, 2));
  console.log('JSON:', jsonPath);
  console.log('MD  :', mdPath);
  process.exit(summary.fail + summary.error > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
