/**
 * QA — Pack persona_acompanante render tarjeta + routing (sin browser).
 * node scripts/qa-persona-acompanante-render.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const root = path.join(repoRoot, 'public', 'js');

const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

function loadScript(relativePath, ctx) {
  const code = fs.readFileSync(path.join(root, relativePath), 'utf8');
  vm.runInContext(code, ctx, { filename: relativePath });
}

function makeCtx() {
  const ctx = {
    console,
    URL,
    document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] },
  };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  return ctx;
}

function extractDemoBlock(html, marker) {
  const re = new RegExp(`/\\* ${marker}[\\s\\S]*?DEMO\\.\\w+=\\{([\\s\\S]*?)\\n\\};`);
  const m = html.match(re);
  return m ? m[0] : '';
}

function lesbiansMostrarFicha(u, visibilityKey, contentVal) {
  if (contentVal == null || String(contentVal).trim() === '') return false;
  if (Array.isArray(contentVal) && !contentVal.length) return false;
  const vis = String(u[visibilityKey] || 'Sí').trim().toLowerCase();
  return vis === 'sí' || vis === 'si' || vis === 'yes' || vis === 'true';
}

function fichaLesbiansRows(u) {
  const rows = [];
  if (lesbiansMostrarFicha(u, 'mostrarAtiendoA', u.atiendoA)) rows.push('atiendoA');
  if (lesbiansMostrarFicha(u, 'mostrarColaboraciones', u.haceColaboraciones)) rows.push('colaboraciones');
  if (lesbiansMostrarFicha(u, 'mostrarColaboraciones', u.haceColaboraciones) && Array.isArray(u.colaboraCon) && u.colaboraCon.length) {
    rows.push('colaboraCon');
  }
  return rows;
}

let ctx;

try {
  ctx = makeCtx();
  loadScript('carihub-viajes-desplazamiento.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  const PR = ctx.CariHubPublicRenderLite;
  ok('load render lite', !!PR && !!PR.cardHTMLAdultos, 'render');

  const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
  ok('DEMO escortGay presente', extractDemoBlock(perfilHtml, 'Escort Gay').includes('subcategoriaId:"escort_gay"'), 'demo gay');
  ok('DEMO escortVip presente', extractDemoBlock(perfilHtml, 'Escort VIP').includes('badgeVip:true'), 'demo vip');
  ok('DEMO trans presente', extractDemoBlock(perfilHtml, 'Trans — schema: trans').includes('identidadGenero') || perfilHtml.includes('DEMO.trans='), 'demo trans');

  const cardBase = {
    tagline: 'Perfil QA render',
    edad: 27,
    precio: '2000',
    ciudad: 'Monterrey',
    modalidades: ['recibe'],
  };

  const escortCard = PR.cardHTMLAdultos({ ...cardBase, subcategoriaId: 'escort' }, {});
  ok('escort tarjeta render', escortCard.includes('Perfil QA render'), 'html');

  const vipCard = PR.cardHTMLAdultos({ ...cardBase, subcategoriaId: 'escort_vip', badgeVip: true }, {});
  ok('vip badge tarjeta', vipCard.includes('res-badge--vip') || vipCard.includes('VIP'), vipCard.slice(0, 120));

  const gayCard = PR.cardHTMLAdultos({ ...cardBase, subcategoriaId: 'escort_gay', badgeLgbt: true }, {});
  ok('gay badge tarjeta', gayCard.includes('res-badge--lgbt') || gayCard.includes('LGBT'), gayCard.slice(0, 120));

  const hwCard = PR.cardHTMLAdultos({
    ...cardBase,
    subcategoriaId: 'hotwife',
    badgeHotwife: true,
    participacionPareja: 'Presente',
    tipoExperiencia: ['Citas'],
  }, {});
  ok('hotwife badge tarjeta', hwCard.includes('res-badge--hotwife') || hwCard.includes('Hotwife'), hwCard.slice(0, 140));
  ok('hotwife no tarjeta C/H pareja', !hwCard.includes('res-card--cuckold-hotwife'), hwCard.slice(0, 80));

  const lesCard = PR.cardHTMLAdultos({
    ...cardBase,
    subcategoriaId: 'lesbians',
    atiendoA: 'Mujeres',
    haceColaboraciones: 'Sí',
    mostrarAtiendoA: 'Sí',
    mostrarColaboraciones: 'Sí',
  }, {});
  ok('lesbians extra atiende a', lesCard.includes('Atiende a: Mujeres'), lesCard);
  ok('lesbians extra colaboraciones', lesCard.includes('Colaboraciones: Sí'), lesCard);

  const lesHidden = PR.cardHTMLAdultos({
    ...cardBase,
    subcategoriaId: 'lesbians',
    atiendoA: 'Mujeres',
    mostrarAtiendoA: 'No',
  }, {});
  ok('lesbians toggle oculta atiendoA', !lesHidden.includes('Atiende a:'), lesHidden);

  const viajesCard = PR.cardHTMLAdultos({
    ...cardBase,
    subcategoriaId: 'escort',
    modalidades: ['recibe', 'viaja'],
    viajesDesplazamiento: { viaja: true, alcanceDesplazamiento: 'toda_ciudad' },
  }, {});
  ok('escort tarjeta viaja', viajesCard.includes('Viaja: Sí') || viajesCard.includes('>Viaja<'), viajesCard);

  const tomCard = PR.cardHTMLAdultos({
    ...cardBase,
    subcategoriaId: 'tom_boy',
    badgeLgbt: true,
    presentacionTom: 'Andrógina',
  }, {});
  ok('tom_boy tarjeta sin crash', tomCard.includes('Perfil QA render'), tomCard.slice(0, 80));

  const chCard = PR.cardHTML({
    subcategoriaId: 'cuckold_hotwife',
    aliasPareja: 'Pareja CH',
    dinamica: 'hotwife',
    badgeHotwife: true,
    tagline: 'Pareja',
    edad: 30,
    precio: '2000',
  }, { componenteResultados: 'ResultCardPareja' });
  ok('routing C/H pareja usa tarjeta C/H', chCard.includes('res-card--cuckold-hotwife'), chCard.slice(0, 100));

  const hwPersonaCard = PR.cardHTML({
    subcategoriaId: 'hotwife',
    badgeHotwife: true,
    tagline: 'Hotwife persona',
    edad: 28,
    precio: '1800',
  }, { componenteResultados: 'ResultCardAdultos' });
  ok('routing hotwife persona adultos', hwPersonaCard.includes('res-card--adult') && !hwPersonaCard.includes('res-card--cuckold-hotwife'), hwPersonaCard.slice(0, 100));

  const lesFicha = {
    subcategoriaId: 'lesbians',
    atiendoA: 'Mujeres',
    haceColaboraciones: 'Sí',
    colaboraCon: ['Mujeres'],
    mostrarAtiendoA: 'Sí',
    mostrarColaboraciones: 'Sí',
  };
  ok('ficha lesbians rows visibles', fichaLesbiansRows(lesFicha).join(',') === 'atiendoA,colaboraciones,colaboraCon', fichaLesbiansRows(lesFicha).join(','));

  const lesFichaOff = { ...lesFicha, mostrarColaboraciones: 'No' };
  ok('ficha lesbians toggle colaboraciones', !fichaLesbiansRows(lesFichaOff).includes('colaboraciones'), fichaLesbiansRows(lesFichaOff).join(','));

  const swCard = PR.cardHTMLParejaSwinger({
    subcategoriaId: 'swinger',
    aliasPareja: 'Pareja Sw',
    objetivosPerfil: ['Conocer parejas'],
    mostrarObjetivosPerfil: 'Sí',
    tagline: 'Swinger',
    edad: 35,
    precio: 'Consultar',
  }, {});
  ok('swinger tarjeta sin mezcla escort', swCard.includes('res-card--pareja') && !swCard.includes('res-card--adult'), swCard.slice(0, 100));
} catch (e) {
  fail.push({ name: 'EXCEPTION', detail: e.stack || e.message });
}

console.log('\n=== QA persona_acompanante (render) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
