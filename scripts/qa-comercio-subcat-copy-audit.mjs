/**
 * QA copy-audit — subcategorías Comercio (perfil público DEMO).
 *
 * Uso:
 *   NODE_PATH=../carihub/node_modules node scripts/qa-comercio-subcat-copy-audit.mjs
 *   BASE_URL=http://127.0.0.1:5212 ONLY_SUBS=papelerias,ferreterias node scripts/qa-comercio-subcat-copy-audit.mjs
 *
 * Salida:
 *   .local/qa-comercio-subcat-copy-audit.json
 *   .local/qa-comercio-subcat-copy-audit.md
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
  const blocksPath = path.join(ROOT, 'public', 'js', 'data', 'registro-comercio-blocks.js');
  const src = fs.readFileSync(blocksPath, 'utf8');
  const m = src.match(/var SUB_TO_PACK = \{([\s\S]*?)\n  \};/);
  if (m) {
    const body = m[1];
    const re = /['"]?([a-z0-9-]+)['"]?\s*:\s*['"]([A-D])['"]/g;
    let hit;
    while ((hit = re.exec(body))) SUB_TO_PACK[hit[1]] = hit[2];
  }
} catch (e) {
  console.warn('No se pudo cargar packs comercio:', e && e.message);
}

const SUBS_ALL = Object.keys(SUB_TO_PACK).sort();
const ONLY = String(process.env.ONLY_SUBS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const SUBS = ONLY.length ? SUBS_ALL.filter((s) => ONLY.includes(s)) : SUBS_ALL;

const FAMILY_HINTS = {
  A: {
    expectAny: ['abarro', 'convenien', 'snack', 'bebida', 'surte', 'mini'],
    foreignStrong: ['ferreter', 'plomer', 'medicament', 'calzado', 'zapater', 'mayoreo pedido minimo']
  },
  B: {
    expectAny: ['ropa', 'calzado', 'zapat', 'moda', 'probador', 'dama', 'caballero'],
    foreignStrong: ['ferreter', 'plomer', 'medicament', 'impresion', 'mayoreo']
  },
  C: {
    expectAny: ['ferreter', 'farmac', 'papel', 'medicament', 'herramient', 'impresion', 'util'],
    foreignStrong: ['reiki', 'ayahuasca', 'novia']
  },
  D: {
    expectAny: ['mayoreo', 'distrib', 'ruta', 'pedido', 'flota', 'tiendita'],
    foreignStrong: ['calzado escolar', 'impresiones el mismo dia', 'probadores']
  }
};

/** Contaminación explícita entre subcats del mismo pack. */
const SLUG_FORBIDDEN = {
  abarrotes: ['ferreter', 'medicament', 'calzado', 'zapater', 'impresion'],
  'tiendas-de-conveniencia': ['ferreter', 'medicament', 'calzado escolar', 'mayoreo'],
  zapaterias: ['ropa casual', 'ferreter', 'medicament', 'impresion', 'abarrotes'],
  'tiendas-de-ropa': ['calzado escolar', 'botas de seguridad', 'ferreter', 'medicament', 'impresion'],
  ferreterias: ['medicament', 'farmac', 'impresion', 'calzado', 'ropa casual'],
  'farmacias-de-barrio': ['ferreter', 'plomer', 'impresion', 'calzado', 'torniller'],
  papelerias: ['ferreter', 'plomer', 'medicament', 'farmac', 'calzado', 'herramient'],
  mayoreo: ['zapater', 'impresion', 'probador', 'farmacia del barrio'],
  distribuidoras: ['zapater', 'impresiones', 'probador', 'farmacia del barrio']
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

function heuristicVerdict(subId, pack, blob) {
  const n = norm(blob);
  const hints = FAMILY_HINTS[pack] || { expectAny: [], foreignStrong: [] };
  const issues = [];
  const forbidden = SLUG_FORBIDDEN[subId] || [];

  forbidden.forEach((f) => {
    if (n.includes(norm(f))) issues.push(`slug_forbidden:${f}`);
  });
  hints.foreignStrong.forEach((f) => {
    if (n.includes(norm(f))) issues.push(`pack_foreign:${f}`);
  });

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
    const p = u.comercioPerfil || {};
    const cats = Array.isArray(p.categoriasProducto) ? p.categoriasProducto : [];
    return {
      categoriaQuery: categoria,
      vista: document.body.getAttribute('data-vista'),
      pack: u.__comercioPack || u.deltaPack || null,
      sectorId: u.sectorId || null,
      subcategoriaId: u.subcategoriaId || null,
      nombre: u.nombre || u.alias || u.nombreComercial || null,
      titulo: text('[data-pub-block="titulo"], .idname, .pro-title, h1') || String(u.titulo || u.categoriaPublica || ''),
      tagline: u.tagline || u.frase || '',
      sobre: String(u.sobreMi || u.tagline || '').slice(0, 500),
      categoriasProducto: cats,
      servicios,
      feats,
      faq
    };
  }, subId);
}

function buildBlob(row) {
  return [
    row.titulo,
    row.tagline,
    row.sobre,
    row.nombre,
    ...(row.categoriasProducto || []),
    ...(row.servicios || []),
    ...(row.feats || []),
    ...(row.faq || [])
  ].join(' \n ');
}

async function main() {
  if (!fs.existsSync(EDGE)) {
    console.error('Edge no encontrado:', EDGE);
    process.exit(2);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ executablePath: EDGE, headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1100 } });

  console.log('Subcategorías a auditar:', SUBS.length);
  const rows = [];
  for (const subId of SUBS) {
    const pack = SUB_TO_PACK[subId];
    let row;
    try {
      const extracted = await extractPage(page, subId);
      const blob = buildBlob(extracted);
      const verdict = heuristicVerdict(subId, pack, blob);
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
        categoriasProducto: [],
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

  const jsonPath = path.join(OUT_DIR, 'qa-comercio-subcat-copy-audit.json');
  const mdPath = path.join(OUT_DIR, 'qa-comercio-subcat-copy-audit.md');
  fs.writeFileSync(jsonPath, JSON.stringify({ summary, rows }, null, 2), 'utf8');
  fs.writeFileSync(mdPath, toMarkdown(summary, rows), 'utf8');

  console.log('\n' + JSON.stringify(summary, null, 2));
  console.log('JSON:', jsonPath);
  console.log('MD  :', mdPath);
  process.exit(summary.fail + summary.error > 0 ? 1 : 0);
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
  lines.push('# QA copy-audit — Comercio');
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

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
