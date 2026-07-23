/**
 * QA copy-audit — subcategorías Bienestar / espiritualidad (perfil público DEMO).
 *
 * Extrae escritura visible por subcategoría para que el agente (o Owner) revise
 * si el vocabulario corresponde al slug (anti-contaminación entre demos).
 *
 * Uso:
 *   NODE_PATH=../carihub/node_modules node scripts/qa-bienestar-subcat-copy-audit.mjs
 *   BASE_URL=http://127.0.0.1:5212 node scripts/qa-bienestar-subcat-copy-audit.mjs
 *
 * Salida:
 *   .local/qa-bienestar-subcat-copy-audit.json
 *   .local/qa-bienestar-subcat-copy-audit.md
 */
import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, '.local');
const BASE = (process.env.BASE_URL || 'http://127.0.0.1:5212').replace(/\/$/, '');
const EDGE =
  process.env.EDGE_PATH ||
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

let SUB_TO_PACK = {};
try {
  const packsUrl = pathToFileURL(path.join(ROOT, 'scripts', 'bienestar-packs-v1.mjs')).href;
  const packs = await import(packsUrl);
  SUB_TO_PACK = { ...(packs.SUB_TO_PACK || {}) };
} catch (e) {
  console.warn('No se pudo cargar bienestar-packs-v1.mjs:', e && e.message);
  /* fallback: parsear registro-bienestar-blocks.js */
  try {
    const blocksPath = path.join(ROOT, 'public', 'js', 'data', 'registro-bienestar-blocks.js');
    const src = fs.readFileSync(blocksPath, 'utf8');
    const m = src.match(/var SUB_TO_PACK = \{([\s\S]*?)\n  \};/);
    if (m) {
      const body = m[1];
      const re = /['"]?([a-z0-9-]+)['"]?\s*:\s*['"]([A-H])['"]/g;
      let hit;
      while ((hit = re.exec(body))) SUB_TO_PACK[hit[1]] = hit[2];
    }
  } catch (e2) {
    console.warn('Fallback blocks falló:', e2 && e2.message);
  }
}

/** Alias cortos útiles en URLs de QA (si existen en main). */
const EXTRA_SUBS = {
  'velas-aromaticas': 'D',
  'ceremonias-ayahuasca': 'H',
  'venta-de-velas': 'D',
  'venta-de-aceites': 'D'
};
Object.assign(SUB_TO_PACK, EXTRA_SUBS);

const SUBS_ALL = Object.keys(SUB_TO_PACK).sort();
const ONLY = String(process.env.ONLY_SUBS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const SUBS = ONLY.length ? SUBS_ALL.filter((s) => ONLY.includes(s)) : SUBS_ALL;

/** Tokens fuertes por familia — heurística (no 100%). */
const FAMILY_HINTS = {
  A: {
    expectAny: ['reiki', 'acupunt', 'biomagnet', 'aromaterap', 'masaje', 'holíst', 'holist', 'naturop', 'homeopat', 'reflexolog', 'limpia', 'terapia', 'aguja', 'meridian'],
    foreignStrong: ['plomer', 'hidrául', 'hidraul', 'factura para reembolso de seguro', 'videaconsulta']
  },
  B: {
    expectAny: ['yoga', 'pilates', 'meditaci', 'breath', 'hatha', 'vinyasa', 'ayurved', 'sonoter'],
    foreignStrong: ['reiki usui', 'plomer', 'ayahuasca', 'vela arom']
  },
  C: {
    expectAny: ['temazcal', 'centro', 'holíst', 'holist', 'sanaci', 'meditaci', 'yoga', 'ceremon'],
    foreignStrong: ['plomer', 'reiki usui', 'tienda', 'venta de inciens']
  },
  D: {
    expectAny: ['vela', 'inciens', 'aceite', 'herbol', 'naturist', 'esotér', 'esoter', 'surtido', 'tienda', 'sahumer', 'cosmét', 'cosmet', 'producto'],
    foreignStrong: ['reiki usui', 'plomer', 'ayahuasca', 'temazcal', 'agendar cita']
  },
  E: {
    expectAny: ['tarot', 'astrolog', 'numerolog', 'carta', 'runa', 'feng', 'cristal', 'akásh', 'akash', 'lectura'],
    foreignStrong: ['reiki usui', 'plomer', 'vela arom', 'yoga alliance']
  },
  F: {
    expectAny: ['coach', 'desarrollo', 'crecimiento', 'sesión', 'sesion', 'meta', 'acompañ'],
    foreignStrong: ['reiki usui', 'plomer', 'ayahuasca', 'inciens']
  },
  G: {
    expectAny: ['retiro', 'turismo', 'espiritual', 'cacao', 'experiencia', 'inmersi'],
    foreignStrong: ['reiki usui', 'plomer', 'plomería', 'factura']
  },
  H: {
    expectAny: ['ceremon', 'ayahuasca', 'chaman', 'ancestral', 'facilit', 'integraci', 'contraindic'],
    foreignStrong: ['reiki usui', 'plomer', 'vela arom', 'tienda online', 'envío a domicilio', 'envio a domicilio']
  }
};

/** Contaminación explícita: slug → palabras que NO deberían aparecer. */
const SLUG_FORBIDDEN = {
  acupuntura: ['reiki', 'usui'],
  biomagnetismo: ['reiki usui', 'vela'],
  aromaterapia: ['reiki usui', 'ayahuasca'],
  yoga: ['reiki usui', 'plomer', 'ayahuasca'],
  pilates: ['reiki usui'],
  tarot: ['reiki usui', 'plomer'],
  'velas-aromaticas': ['reiki', 'plomer', 'ayahuasca'],
  'velas-esotericas': ['reiki', 'plomer'],
  'venta-de-inciensos': ['reiki', 'plomer'],
  'venta-de-aceites-esenciales': ['reiki', 'plomer'],
  reiki: ['plomer', 'ayahuasca', 'acupuntura con agujas'],
  'ceremonias-ayahuasca-rape-plantas-de-poder': ['reiki usui', 'plomer', 'vela aromática'],
  'ceremonias-ayahuasca': ['reiki usui', 'plomer'],
  'coaching-de-vida': ['reiki usui', 'plomer'],
  temazcales: ['reiki usui', 'plomer']
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
  else if (!hasExpect && slugInCopy) status = 'OK';

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
    const allCards = [...document.querySelectorAll('.pcard, .pcard__h, .feat-line, .faq-item, [data-pub-block]')]
      .map((el) => String(el.innerText || '').replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .slice(0, 80);

    const u = window.__perfilActual || {};
    const faq = Array.isArray(u.faq)
      ? u.faq.map((x) => (typeof x === 'string' ? x : x && (x.q || x.pregunta) || '')).filter(Boolean)
      : [];
    const feats = Array.isArray(u.feats) ? u.feats.slice(0, 12) : [];
    const servicios = Array.isArray(u.serviciosIncluidos) ? u.serviciosIncluidos.slice(0, 12) : [];
    const certs = Array.isArray(u.certificaciones)
      ? u.certificaciones.map((c) => (Array.isArray(c) ? c.join(' · ') : String(c))).slice(0, 8)
      : typeof u.certificaciones === 'string'
        ? [u.certificaciones]
        : [];

    const titulo =
      text('[data-pub-block="titulo"], .idname, .pro-title, h1') ||
      String(u.titulo || u.especialidad || u.categoriaPublica || '');
    const sobre =
      text('[data-pub-block="descripcion"], .sobre-card__desc, .idsub') ||
      String(u.sobreMi || u.tagline || u.frase || '');

    const wrapText = text('#wrap') || '';
    return {
      categoriaQuery: categoria,
      vista: document.body.getAttribute('data-vista'),
      pack: u.__bienestarPack || u.deltaPack || null,
      sectorId: u.sectorId || null,
      subcategoriaId: u.subcategoriaId || null,
      nombre: u.nombre || u.alias || u.nombreComercial || null,
      titulo,
      tagline: u.tagline || u.frase || '',
      sobre: sobre.slice(0, 500),
      certificaciones: certs,
      servicios,
      feats,
      faq,
      wrapSnippet: wrapText.slice(0, 1200),
      cardSnippets: allCards.slice(0, 25)
    };
  }, subId);
}

function buildBlob(row) {
  /* Solo escritura de ficha — no #wrap completo (trae listados/nav y da falsos positivos). */
  return [
    row.titulo,
    row.tagline,
    row.sobre,
    row.nombre,
    ...(row.certificaciones || []),
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
        certificaciones: [],
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
    try {
      browser.close().catch(() => {});
    } catch (_) {
      /* ignore */
    }
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

  const jsonPath = path.join(OUT_DIR, 'qa-bienestar-subcat-copy-audit.json');
  const mdPath = path.join(OUT_DIR, 'qa-bienestar-subcat-copy-audit.md');
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
  lines.push('# QA copy-audit — Bienestar / espiritualidad');
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
      lines.push(`- Certs: ${(r.certificaciones || []).join(' | ') || '—'}`);
      lines.push('');
    });
  lines.push('## Todas');
  lines.push('');
  lines.push('| Status | Subcategoría | Pack | Título | Tokens top |');
  lines.push('|--------|--------------|------|--------|------------|');
  rows.forEach((r) => {
    const tit = String(r.titulo || '').replace(/\|/g, '/').slice(0, 40);
    const tok = (r.tokens || []).slice(0, 8).join(', ').replace(/\|/g, '/');
    lines.push(`| ${r.status} | ${r.subcategoria} | ${r.packMap} | ${tit} | ${tok} |`);
  });
  lines.push('');
  return lines.join('\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
