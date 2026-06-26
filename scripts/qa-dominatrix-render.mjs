/**
 * QA — Render persona_dominatrix tarjeta/ficha + DEMO (3/3).
 * node scripts/qa-dominatrix-render.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const root = path.join(repoRoot, 'public', 'js');

const DOM_3 = ['dominatrix', 'fetiche', 'sado'];

const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

function loadScript(relativePath, ctx) {
  vm.runInContext(fs.readFileSync(path.join(root, relativePath), 'utf8'), ctx, { filename: relativePath });
}

function makeCtx() {
  const ctx = { console, document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] } };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  return ctx;
}

function extractDemoObject(html, demoKey) {
  const re = new RegExp(`DEMO\\.${demoKey}=\\{([\\s\\S]*?)\\n\\};`);
  const m = html.match(re);
  return m ? m[0] : '';
}

function loadRender() {
  const ctx = makeCtx();
  loadScript('data/registro-adultos-dominatrix-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  loadScript('resultados-demo.js', ctx);
  loadScript('carihub-field-engine-lite.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  return ctx;
}

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
const vmCtx = loadRender();
const PR = vmCtx.CariHubPublicRenderLite;
const PB = vmCtx.CariHubRegistroPublicBlocks;

ok('render isDominatrixPerfil export', typeof PR.isDominatrixPerfil === 'function', 'fn');
ok('render cardHTMLDominatrix export', typeof PR.cardHTMLDominatrix === 'function', 'fn');
ok('ficha isDominatrixSubFicha helper', perfilHtml.includes('function isDominatrixSubFicha'), 'helper');
ok('ficha usa subcategoria dominatrix', perfilHtml.includes("isDominatrixSubFicha(u)||u.especialidadBdsm"), 'trigger');

DOM_3.forEach((subId) => {
  const demoBlock = extractDemoObject(perfilHtml, subId);
  ok(`DEMO.${subId} presente`, demoBlock.includes(`subcategoriaId:"${subId}"`), subId);
  ok(`DEMO.${subId} persona_dominatrix`, demoBlock.includes('persona_dominatrix'), 'arquetipo');
  ok(`DEMO.${subId} especialidadBdsm`, demoBlock.includes('especialidadBdsm:') || demoBlock.includes('estiloDominacion:'), 'bdsm');
});

DOM_3.forEach((subId) => {
  const vals = PB.finalizeDominatrixValues({
    estiloDominacion: 'Femdom',
    listaFetiches: ['Bondage'],
    limitesSesion: 'Sin menores',
    equipamiento: ['Bondage / restricciones'],
    protocolo: ['SSC (Safe, Sane, Consensual)'],
    modalidadSesion: 'Presencial',
    serviciosIncluidos: ['Femdom / Maledom'],
    serviciosNoRealizo: ['Menores de edad'],
    modalidades: ['recibe'],
    metodosPago: ['Efectivo'],
    horarioDetalle: 'Con cita',
    nombre: 'QA ' + subId,
    edad: 30,
    tagline: 'Perfil BDSM QA',
    precio: '2,000',
    zona: 'Centro',
    ciudad: 'Monterrey',
  }, { subcategoriaId: subId, arquetipo: 'persona_dominatrix' });
  const u = PB.mapDominatrixToPerfil({ subcategoriaId: subId, categoria: subId }, vals, { subcategoriaId: subId });
  const card = PR.cardHTMLDominatrix(u, { categoria: subId });
  ok(`${subId} tarjeta dominatrix class`, card.includes('res-card--dominatrix'), card.slice(0, 80));
  ok(`${subId} tarjeta isDominatrixPerfil`, PR.isDominatrixPerfil(u), subId);
  ok(`${subId} cardHTML routes dominatrix`, PR.cardHTML(u, { categoria: subId }).includes('res-card--dominatrix'), 'route');
});

ok('CARINOSAS_TIPOS fetiche sado', perfilHtml.includes('"fetiche"') && perfilHtml.includes('"sado"'), 'tipos');
ok('preview alias fetiche sado', perfilHtml.includes('fetiche:"fetiche"') && perfilHtml.includes('sado:"sado"'), 'alias');

console.log('\n=== QA Dominatrix render ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
