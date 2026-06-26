/**
 * QA — Render persona_creador tarjeta/ficha + DEMO (1/1).
 * node scripts/qa-creador-render.mjs
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
  loadScript('data/registro-schema-index.js', ctx);
  loadScript('data/registro-adultos-creador-blocks.js', ctx);
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
const FE = vmCtx.CariHubFieldEngineLite;

ok('render isCreadorPerfil export', typeof PR.isCreadorPerfil === 'function', 'fn');
ok('render cardHTMLCreador export', typeof PR.cardHTMLCreador === 'function', 'fn');
ok('preview creador ficha', perfilHtml.includes('function creadorFichaFilas'), 'ficha');
ok('preview alias contenido creador', perfilHtml.includes('contenido:"creador"') && perfilHtml.includes('creador_contenido:"creador"'), 'alias');

const demoBlock = extractDemoObject(perfilHtml, 'creador');
ok('DEMO.creador persona_creador', demoBlock.includes('persona_creador'), 'arquetipo');
ok('DEMO.creador subcategoriaId contenido', demoBlock.includes('subcategoriaId:"contenido"'), 'contenido id');
ok('DEMO.creador tipoPerfil creador', demoBlock.includes('tipoPerfil:"creador"'), 'tipoPerfil');
ok('DEMO.creador plataformas', demoBlock.includes('plataformas:'), 'plataformas');
ok('DEMO.creador tiposContenido', demoBlock.includes('tiposContenido:'), 'tiposContenido');
ok('DEMO.creador sin modalidades escort', !demoBlock.includes('modalidades:["recibe"]'), 'no escort modalidades');

const vals = PB.finalizeCreadorValues({
  tiposContenido: ['Fotos exclusivas', 'Videos'],
  plataformas: ['OnlyFans'],
  precioSuscripcion: '$299 MXN / mes',
  redesSociales: 'https://onlyfans.com/demo',
  serviciosIncluidos: ['Suscripción mensual'],
  serviciosNoRealizo: ['Encuentros presenciales'],
  horarioDetalle: 'Publico diario',
  metodosPago: ['Pago en línea'],
  nombre: 'QA Creador',
  tagline: 'Contenido QA',
  zona: 'Digital',
  ciudad: 'Monterrey',
}, { subcategoriaId: 'contenido', arquetipo: 'persona_creador' });

const u = PB.mapCreadorToPerfil({ subcategoriaId: 'contenido', categoria: 'Creadora' }, vals, { subcategoriaId: 'contenido' });
const card = PR.cardHTMLCreador(u, { categoria: 'Creadora' });
ok('contenido tarjeta res-card--creador', card.includes('res-card--creador'), card.slice(0, 80));
ok('contenido isCreadorPerfil', PR.isCreadorPerfil(u), 'contenido');
ok('contenido cardHTML routes creador', PR.cardHTML(u, { categoria: 'Creadora' }).includes('res-card--creador'), 'route');
ok('contenido card suscripcion label', card.includes('Suscripción desde'), 'price label');

const pres = FE.resolvePublicPresentation({ subcategoriaId: 'contenido', categoria: 'Creadora' });
ok('field-engine vista creador', pres.vistaPerfil === 'creador', pres.vistaPerfil);
ok('field-engine ResultCardCreador', pres.componenteResultados === 'ResultCardCreador', pres.componenteResultados);

console.log('\n=== QA Creador render ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
