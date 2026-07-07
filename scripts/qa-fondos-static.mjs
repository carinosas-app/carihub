/**
 * QA fondos — sin browser: verifica hojas CSS, enlaces HTML y reglas en cascada.
 *
 * Valida que páginas clave carguen la cadena adult-pro / sector-pro y que no queden
 * gradientes rosa legacy en `<style>` inline.
 *
 * Uso:
 *   node scripts/qa-fondos-static.mjs
 *
 * Exit 0 si no hay issues; exit 1 si detecta problemas.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(__dirname, '..');
const ROOT = path.join(REPO, 'public');

const PAGES = [
  { id: 'home', file: 'index.html', adult: true },
  { id: 'resultados', file: 'resultados.html', adult: true },
  { id: 'perfil-publico', file: 'perfil-publico.html', adult: true },
  { id: 'registro-perfil', file: 'registro-perfil.html', adult: true },
  { id: 'dashboard-rentero', file: 'dashboard-rentero.html', adult: true },
  { id: 'registro-banner', file: 'registro-banner.html', adult: true },
  { id: 'preview-perfil', file: 'preview/perfil-vista-previa.html', adult: true },
  { id: 'preview-privados', file: 'preview/registro-perfil-datos-privados.html', adult: true },
];

const OLD = [
  /linear-gradient\(180deg,\s*#ffd9e8/i,
  /linear-gradient\(180deg,\s*#fff7fa\s+0%,\s*#ffeef5/i,
  /linear-gradient\(168deg,\s*#fff\s+0%,\s*#ffe8f3/i,
];

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function resolveCssHref(href, baseDir) {
  if (!href || href.startsWith('http')) return null;
  let rel = href.split('?')[0].replace(/\\/g, '/');
  if (/^[a-zA-Z]:\//.test(rel) || rel.startsWith('/')) {
    const norm = path.normalize(rel);
    if (fs.existsSync(norm)) return norm;
    const idx = rel.toLowerCase().indexOf('/public/');
    if (idx >= 0) rel = rel.slice(idx + '/public/'.length);
  }
  if (rel.startsWith('../')) {
    return path.normalize(path.join(ROOT, path.dirname(baseDir), rel));
  }
  return path.normalize(path.join(ROOT, rel.replace(/^\//, '')));
}

function cssLinks(html, baseDir) {
  const links = [...html.matchAll(/<link[^>]+href=["']([^"']+\.css[^"']*)["']/gi)].map((m) => m[1]);
  const resolved = [];
  for (const href of links) {
    const p = resolveCssHref(href, baseDir);
    if (p) resolved.push(p);
  }
  const chain = new Set();
  const queue = [...resolved];
  while (queue.length) {
    const f = queue.shift();
    if (!fs.existsSync(f) || chain.has(f)) continue;
    chain.add(f);
    const css = fs.readFileSync(f, 'utf8').replace(/\\/g, '/');
    for (const m of css.matchAll(/@import\s+url\(["']?([^"')]+)["']?\)/g)) {
      queue.push(path.join(path.dirname(f), m[1]));
    }
  }
  return [...chain];
}

function analyze() {
  const report = { pages: [], issues: [], fixesNeeded: [] };

  for (const p of PAGES) {
    const html = read(p.file);
    const dir = path.dirname(p.file) || '.';
    const sheets = cssLinks(html, dir);
    const entry = {
      id: p.id,
      file: p.file,
      hasPinkSheenLink: /carihub-pink-sheen\.css/i.test(html),
      hasAdultProDirectLink: /carihub-adult-pro-background\.css/i.test(html),
      hasSectorProLink: /carihub-sector-pro-background\.css/i.test(html),
      stylesheetCount: sheets.length,
      loadsAdultPro: false,
      loadsSectorPro: false,
      pinkSheenUsesProVar: false,
      inlineOldPink: [],
    };

    for (const s of sheets) {
      const name = path.basename(s);
      if (name.includes('carihub-adult-pro-background')) entry.loadsAdultPro = true;
      if (name.includes('carihub-sector-pro-background')) entry.loadsSectorPro = true;
      if (name === 'carihub-pink-sheen.css') {
        const css = fs.readFileSync(s, 'utf8');
        if (css.includes('var(--adult-pro-page-bg') && css.includes('@import')) {
          entry.pinkSheenUsesProVar = true;
        }
      }
    }

    const styleBlocks = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]);
    for (const block of styleBlocks) {
      for (const rx of OLD) {
        if (rx.test(block)) entry.inlineOldPink.push(rx.source);
      }
    }

    const proPath = sheets.find((s) => s.includes('carihub-adult-pro-background'));
    entry.adultProReachable = !!proPath || entry.pinkSheenUsesProVar;

    if (p.adult && !entry.adultProReachable) {
      report.issues.push({ page: p.id, type: 'missing-adult-pro-chain' });
    }
    if (p.id === 'registro-banner' && entry.inlineOldPink.length) {
      report.issues.push({ page: p.id, type: 'inline-old-pink-dead-code', detail: entry.inlineOldPink });
      report.fixesNeeded.push('registro-banner-inline-override');
    }
    if (['resultados', 'perfil-publico', 'registro-perfil', 'home'].includes(p.id) && !entry.loadsSectorPro) {
      report.issues.push({ page: p.id, type: 'missing-sector-pro-link' });
    }

    report.pages.push(entry);
  }

  const pink = read('css/carihub-pink-sheen.css');
  const adult = read('css/carihub-adult-pro-background.css');
  report.sourceOfTruth = {
    pinkSheenImportsAdultPro: pink.includes('@import url("carihub-adult-pro-background.css")'),
    adultProDefinesVar: adult.includes('--adult-pro-page-bg:'),
    pinkFondoUsesVar: pink.includes('var(--adult-pro-page-bg'),
    dashboardImportsAdultPro: read('css/dashboard-rentero-pro.css').includes(
      '@import url("carihub-adult-pro-background.css")'
    ),
    duplicateDirectLinksOnPages: report.pages
      .filter((p) => p.hasAdultProDirectLink && p.hasPinkSheenLink)
      .map((p) => p.id),
  };

  const resCss = read('css/resultados.css');
  report.lgbt = {
    hasLgbtBlock: resCss.includes('body[data-subtema="lgbt"]'),
    lgbtUsesRainbow: resCss.includes('--lgbt-warm-red'),
    adultProExcludesLgbt: adult.includes(':not([data-subtema="lgbt"])'),
  };

  console.log(JSON.stringify(report, null, 2));
  return report;
}

const report = analyze();
process.exit(report.issues.length ? 1 : 0);
