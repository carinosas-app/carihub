/**
 * QA — Render persona_espectaculo tarjeta/ficha + DEMO (2/2).
 * node scripts/qa-espectaculo-render.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const root = path.join(repoRoot, 'public', 'js');

const ESP_2 = [
  { subId: 'stripper', demoKey: 'stripper', cardClass: 'res-card--stripper' },
  { subId: 'tabledance', demoKey: 'tableDance', cardClass: 'res-card--tabledance' },
];

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
  loadScript('data/registro-adultos-espectaculo-blocks.js', ctx);
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

ok('render isEspectaculoPerfil export', typeof PR.isEspectaculoPerfil === 'function', 'fn');
ok('render cardHTMLEspectaculo export', typeof PR.cardHTMLEspectaculo === 'function', 'fn');
ok('render stripper/tabledance ficha', perfilHtml.includes('function stripperFichaFilas') && perfilHtml.includes('function tableDanceFichaFilas'), 'ficha');
ok('preview alias stripper tabledance', perfilHtml.includes('stripper:"stripper"') && perfilHtml.includes('tabledance:"tableDance"'), 'alias');

ESP_2.forEach(({ subId, demoKey, cardClass }) => {
  const demoBlock = extractDemoObject(perfilHtml, demoKey);
  ok(`DEMO.${demoKey} persona_espectaculo`, demoBlock.includes('persona_espectaculo'), demoKey);
  ok(`DEMO.${demoKey} tipoShow`, demoBlock.includes('tipoShow:'), 'tipoShow');
  if (subId === 'tabledance') {
    ok(`DEMO.${demoKey} subcategoriaId tabledance`, demoBlock.includes('subcategoriaId:"tabledance"'), 'tabledance id');
  }
});

ESP_2.forEach(({ subId, cardClass }) => {
  const vals = PB.finalizeEspectaculoValues({
    tipoShow: ['Shows privados'],
    precioShow: '$800 MXN',
    horarioMinimo: 'Por canción',
    modalidades: ['clubes'],
    desplazamientos: subId === 'stripper' ? 'Zona local / área metropolitana' : '',
    venueFijo: subId === 'tabledance' ? 'Antro centro' : 'Monterrey',
    serviciosIncluidos: ['Shows privados'],
    serviciosNoRealizo: ['Servicios sexuales'],
    horarioDetalle: 'Fines de semana',
    metodosPago: ['Efectivo'],
    nombre: 'QA ' + subId,
    tagline: 'Show QA',
    precio: '800',
    zona: 'Centro',
    ciudad: 'Monterrey',
  }, { subcategoriaId: subId, arquetipo: 'persona_espectaculo' });
  const u = PB.mapEspectaculoToPerfil({ subcategoriaId: subId, categoria: subId }, vals, { subcategoriaId: subId });
  const card = PR.cardHTMLEspectaculo(u, { categoria: subId });
  ok(`${subId} tarjeta ${cardClass}`, card.includes(cardClass), card.slice(0, 80));
  ok(`${subId} isEspectaculoPerfil`, PR.isEspectaculoPerfil(u), subId);
  ok(`${subId} cardHTML routes espectaculo`, PR.cardHTML(u, { categoria: subId }).includes(cardClass), 'route');
  if (subId === 'stripper') ok(`${subId} isStripperPerfil`, PR.isStripperPerfil(u), subId);
  if (subId === 'tabledance') ok(`${subId} isTableDancePerfil`, PR.isTableDancePerfil(u), subId);
});

ok('field-engine tabledance vista', perfilHtml.includes('tabledance:"tableDance"'), 'vista');

console.log('\n=== QA Espectaculo render ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
