/**
 * QA — A4.3 render tarjeta + ficha + DEMO cuckold/hotwife (sin browser).
 * node scripts/qa-cuckold-hotwife-render.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', 'public', 'js');
const repoRoot = path.join(__dirname, '..');

function loadScript(relativePath, ctx) {
  const code = fs.readFileSync(path.join(root, relativePath), 'utf8');
  vm.runInContext(code, ctx, { filename: relativePath });
}

function makeCtx() {
  const ctx = {
    console,
    document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] },
  };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  return ctx;
}

const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

function chPerfilDemo() {
  return {
    subcategoriaId: 'cuckold_hotwife',
    categoria: 'Cuckold / Hotwife',
    categoriaPublica: 'Cuckold / Hotwife',
    tipoPerfil: 'pareja_grupo',
    arquetipo: 'pareja_grupo',
    aliasPareja: 'Pareja CH Render',
    nombre: 'Pareja CH Render',
    alias: 'Pareja CH Render',
    configuracionGrupoLabel: 'Hombre + Mujer',
    ciudad: 'Monterrey',
    zona: 'San Pedro',
    precio: '2000',
    precioDesde: '2000',
    dinamica: 'hotwife',
    dinamicaLabel: 'Hotwife',
    buscan: ['Bulls', 'Unicorns'],
    mostrarBuscan: 'Sí',
    tipoExperiencia: ['Encuentros privados', 'Hotel / motel'],
    participacionPareja: 'Solo observa',
    mostrarParticipacion: 'Sí',
    aceptanSolteros: 'Solo hombres',
    aceptanPrincipiantes: 'A convenir',
    experienciaEnLifestyle: 'Experimentados',
    haceColaboraciones: 'Sí',
    colaboraCon: ['Unicorns'],
    mostrarColaboraciones: 'Sí',
    badgeHotwife: true,
    badgeCuckold: false,
    modalidades: ['recibe', 'viaja'],
    viajesDesplazamiento: { viaja: true, alcanceDesplazamiento: 'toda_ciudad' },
    miembros: [
      { etiquetaPublica: 'Él', generoPresentacion: 'Hombre', edad: 42 },
      { etiquetaPublica: 'Ella', generoPresentacion: 'Mujer', edad: 39 },
    ],
    miembrosResumen: 'Él 42 años · Ella 39 años',
    reglasAcceso: 'Cita previa',
    horarioDetalle: 'Vie–Dom 20:00–02:00',
    metodosPago: ['Efectivo', 'Transferencia'],
    sobreMi: 'Pareja hotwife discreta.',
  };
}

function lesbiansMostrarFicha(u, visibilityKey, contentVal) {
  if (!contentVal) return false;
  if (u[visibilityKey] != null && String(u[visibilityKey]).trim() !== '') return String(u[visibilityKey]).trim() === 'Sí';
  return true;
}

function simulateChFichaVisibility(u) {
  const rows = [];
  if (lesbiansMostrarFicha(u, 'mostrarBuscan', u.buscan) && Array.isArray(u.buscan) && u.buscan.length) rows.push('buscan');
  if (lesbiansMostrarFicha(u, 'mostrarParticipacion', u.participacionPareja) && u.participacionPareja) rows.push('participacion');
  if (lesbiansMostrarFicha(u, 'mostrarColaboraciones', u.haceColaboraciones) && u.haceColaboraciones) rows.push('colaboraciones');
  if (lesbiansMostrarFicha(u, 'mostrarColaboraciones', u.haceColaboraciones) && Array.isArray(u.colaboraCon) && u.colaboraCon.length) rows.push('colaboraCon');
  return rows;
}

function extractDemoParejaBlock(html) {
  const m = html.match(/\/\* Perfil Pareja Lifestyle — schema: cuckold_hotwife[\s\S]*?DEMO\.pareja=\{([\s\S]*?)\n\};/);
  return m ? m[0] : '';
}

try {
  const ctx = makeCtx();
  loadScript('carihub-viajes-desplazamiento.js', ctx);
  loadScript('data/registro-adultos-pareja-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  loadScript('data/registro-schema-index.js', ctx);
  loadScript('resultados-demo.js', ctx);
  loadScript('carihub-field-engine-lite.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);

  const R = ctx.CariHubPublicRenderLite;
  const FE = ctx.CariHubFieldEngineLite;
  const u = chPerfilDemo();

  ok('load módulos render', !!(R && FE && R.cardHTMLCuckoldHotwife), 'render + field-engine');

  const pres = FE.resolvePublicPresentation({ subcategoriaId: 'cuckold_hotwife', categoria: 'Cuckold / Hotwife' });
  ok('vista pareja C/H', pres.vistaPerfil === 'pareja', pres.vistaPerfil);
  ok('componente ResultCardPareja', pres.componenteResultados === 'ResultCardPareja', pres.componenteResultados);

  FE.enriquecerPerfilPublico(u, { subcategoriaId: 'cuckold_hotwife' });
  ok('enriquecer __vista', u.__vista === 'pareja', u.__vista);

  const card = R.cardHTML(u, { categoria: 'Cuckold / Hotwife' });
  ok('tarjeta aliasPareja', card.includes('Pareja CH Render'), 'nombre');
  ok('tarjeta config H+M', card.includes('Hombre + Mujer'), 'config');
  ok('tarjeta dinámica Hotwife', card.includes('Hotwife'), 'dinamica');
  ok('tarjeta buscan', card.includes('Buscan: Bulls'), 'buscan');
  ok('tarjeta precio', card.includes('2000') || card.includes('2,000'), 'precio');
  ok('tarjeta ciudad', card.includes('Monterrey'), 'ciudad');
  ok('tarjeta badge hotwife', card.includes('res-badge--hotwife'), 'badge hw');
  ok('tarjeta sin badge cuckold hotwife only', !card.includes('res-badge--cuckold">Cuckold'), 'no cuckold badge');
  ok('tarjeta chip viaja', card.includes('Viaja'), 'viaja');
  ok('tarjeta sin intercambio swinger', !/Intercambio:/i.test(card), 'no swinger');
  ok('tarjeta sin swinger badge', !card.includes('res-badge--swinger'), 'no swinger badge');
  ok('tarjeta clase C/H', card.includes('res-card--cuckold-hotwife'), 'css');

  const cardDirect = R.cardHTMLCuckoldHotwife(u, { categoria: 'Cuckold / Hotwife' });
  ok('cardHTMLCuckoldHotwife directo', cardDirect.includes('res-card--cuckold-hotwife'), 'direct');

  const uAmbos = { ...chPerfilDemo(), dinamica: 'ambos', dinamicaLabel: 'Ambos / pareja flexible', badgeHotwife: true, badgeCuckold: true };
  const cardAmbos = R.cardHTMLCuckoldHotwife(uAmbos, {});
  ok('badge ambos tarjeta', cardAmbos.includes('res-badge--hotwife') && cardAmbos.includes('res-badge--cuckold'), 'badges');

  const uNoBuscan = { ...chPerfilDemo(), mostrarBuscan: 'No' };
  const cardNoBuscan = R.cardHTMLCuckoldHotwife(uNoBuscan, {});
  ok('toggle buscan tarjeta off', !/Buscan:/i.test(cardNoBuscan), cardNoBuscan);

  ok('toggle buscan ficha on', simulateChFichaVisibility(u).includes('buscan'), 'on');
  ok('toggle participacion ficha on', simulateChFichaVisibility(u).includes('participacion'), 'on');
  ok('toggle colaboraciones ficha on', simulateChFichaVisibility(u).includes('colaboraciones'), 'on');
  const uNoPart = { ...chPerfilDemo(), mostrarParticipacion: 'No' };
  ok('toggle participacion ficha off', !simulateChFichaVisibility(uNoPart).includes('participacion'), 'off');

  const sw = {
    subcategoriaId: 'swinger',
    aliasPareja: 'Pareja Sw',
    intercambioSwinger: 'A convenir',
    objetivosPerfil: ['Conocer parejas'],
  };
  const swCard = R.cardHTML(sw, { categoria: 'Swinger' });
  ok('swinger sin tarjeta C/H', !swCard.includes('res-card--cuckold-hotwife'), swCard);

  const uni = { subcategoriaId: 'unicorns', nombre: 'Luna', badgeUnicorn: true };
  const uniCard = R.cardHTML(uni, { categoria: 'Unicorn' });
  ok('unicorn sin tarjeta C/H', !uniCard.includes('res-card--cuckold-hotwife'), uniCard);

  const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
  const demoBlock = extractDemoParejaBlock(perfilHtml);
  ok('DEMO pareja subcategoriaId', /subcategoriaId:"cuckold_hotwife"/.test(demoBlock), 'id');
  ok('DEMO pareja arquetipo', /arquetipo:"pareja_grupo"/.test(demoBlock), 'arquetipo');
  ok('DEMO sin copy swinger', !/Pareja Swinger/i.test(demoBlock) && !/intercambioSwinger/i.test(demoBlock), 'copy');
  ok('DEMO sin intercambio parejas', !/Intercambio de parejas/i.test(demoBlock), 'legacy');
  ok('DEMO campos C/H', /dinamica:"hotwife"/.test(demoBlock) && /buscan:\["Bulls"/.test(demoBlock), 'campos');
  ok('DEMO badgeHotwife', /badgeHotwife:true/.test(demoBlock), 'badge');

  const fichaRows = [
    'renderParejaGrupoCuckoldHotwife',
    'cuckoldHotwifeFichaHTML',
    'isCuckoldHotwifeSubFicha',
    'pcard--cuckold-hotwife-ficha',
    'Participación de la pareja',
    'Colaboran con',
    'Tipo de experiencia',
  ];
  ok(
    'ficha C/H en perfil-publico',
    fichaRows.every((row) => perfilHtml.includes(row)),
    fichaRows.filter((row) => !perfilHtml.includes(row)).join(', ')
  );

  ok('setVista usa renderParejaLifestyle', /tipo==="pareja"\?renderParejaLifestyle\(u\)/.test(perfilHtml), 'setVista');

  const renderJs = fs.readFileSync(path.join(root, 'carihub-public-render-lite.js'), 'utf8');
  ok('cardHTML route C/H', renderJs.includes('isCuckoldHotwifePerfil(u)') && renderJs.includes('cardHTMLCuckoldHotwife'), 'route');
  ok(
    'cardHTMLPareja C/H before swinger',
    renderJs.indexOf('if (isCuckoldHotwifePerfil(u))') < renderJs.indexOf('if (isSwingerPerfil(u))'),
    'order'
  );

  const css = fs.readFileSync(path.join(repoRoot, 'public', 'css', 'resultados.css'), 'utf8');
  ok('css badge cuckold', css.includes('res-badge--cuckold'), 'css');
} catch (e) {
  fail.push({ name: 'exception', detail: e.message + (e.stack ? '\n' + e.stack.split('\n')[1] : '') });
}

console.log('\n=== QA Cuckold/Hotwife A4.3 Render ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
