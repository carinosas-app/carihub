/**
 * QA — Render negocio_bienestar tarjeta + preview (2/2 spa + masajes).
 * node scripts/qa-neg-bienestar-render.mjs
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
  loadScript('data/registro-adultos-retail-blocks.js', ctx);
  loadScript('data/registro-adultos-venue-blocks.js', ctx);
  loadScript('data/registro-adultos-bienestar-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  loadScript('resultados-demo.js', ctx);
  loadScript('carihub-field-engine-lite.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  return ctx;
}

function buildPerfil(subId) {
  const PB = vmCtx.CariHubRegistroPublicBlocks;
  const vals = PB.finalizeBienestarValues({
    nombreComercial: subId === 'spa' ? 'Serenity Spa MTY' : 'Zen Touch Masajes MTY',
    tipoBienestar: subId === 'spa' ? 'Spa / centro de bienestar' : 'Centro de masajes',
    menuServicios: 'Relajante · Deportivo · Pareja',
    precioDesde: subId === 'spa' ? '$890 MXN' : '$650 MXN',
    amenidades: subId === 'spa' ? ['Jacuzzi', 'Sauna'] : ['Cabinas privadas'],
    serviciosIncluidos: ['Masaje relajante 60 min'],
    serviciosNoRealizo: ['Menores de edad'],
    direccion: 'Valle Oriente, Monterrey',
    horarioDetalle: 'Lun–Dom 10:00 AM – 10:00 PM',
    metodosPago: ['Efectivo'],
    reservaciones: 'Sí',
    rfc: 'BIE123456ABC',
    razonSocial: 'Bienestar SA de CV',
    tagline: 'Local verificado',
    zona: 'Valle Oriente',
    ciudad: 'Monterrey',
  }, { subcategoriaId: subId, arquetipo: 'negocio_bienestar', tipoPerfil: 'negocio' });
  return PB.mapBienestarToPerfil({ subcategoriaId: subId, categoria: subId === 'spa' ? 'Spa' : 'Masajes' }, vals, { subcategoriaId: subId, tipoPerfil: 'negocio' });
}

const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
const vmCtx = loadRender();
const PR = vmCtx.CariHubPublicRenderLite;
const FE = vmCtx.CariHubFieldEngineLite;

ok('render isBienestarPerfil export', typeof PR.isBienestarPerfil === 'function', 'fn');
ok('render cardHTMLBienestar export', typeof PR.cardHTMLBienestar === 'function', 'fn');
ok('preview alias spa', perfilHtml.includes('spa:"spa"'), 'alias spa');
ok('preview alias masajes', perfilHtml.includes('masajes:"masajesLocal"'), 'alias masajes');

const demoSpa = extractDemoObject(perfilHtml, 'spa');
ok('DEMO.spa negocio_bienestar', demoSpa.includes('negocio_bienestar'), 'arquetipo');
ok('DEMO.spa tipoPerfil negocio', demoSpa.includes('tipoPerfil:"negocio"'), 'negocio');
ok('DEMO.spa menuServicios', demoSpa.includes('menuServicios:'), 'menuServicios');

const demoMasajes = extractDemoObject(perfilHtml, 'masajesLocal');
ok('DEMO.masajesLocal negocio_bienestar', demoMasajes.includes('negocio_bienestar'), 'arquetipo');
ok('DEMO.masajesLocal no legacy bienestar arquetipo', !demoMasajes.includes('arquetipo:"bienestar"'), 'no legacy');
ok('DEMO.masajesLocal tipoPerfil negocio', demoMasajes.includes('tipoPerfil:"negocio"'), 'negocio');

ok('aplicarPerfilDesdeRegistro bienestarPerfil', perfilHtml.includes('bienestarPerfil:'), 'preview');

const uSpa = buildPerfil('spa');
const cardSpa = PR.cardHTMLBienestar(uSpa, { categoria: 'Spa' });
ok('spa tarjeta res-card--bienestar', cardSpa.includes('res-card--bienestar'), cardSpa.slice(0, 80));
ok('spa isBienestarPerfil', PR.isBienestarPerfil(uSpa), 'spa');
ok('spa isSpaPerfil', PR.isSpaPerfil(uSpa), 'spa');
ok('spa cardHTML routes bienestar', PR.cardHTML(uSpa, { categoria: 'Spa' }).includes('res-card--bienestar'), 'route');

const uMasajes = buildPerfil('masajes');
const cardMasajes = PR.cardHTMLBienestar(uMasajes, { categoria: 'Masajes' });
ok('masajes tarjeta res-card--masajes-local', cardMasajes.includes('res-card--masajes-local'), cardMasajes.slice(0, 80));
ok('masajes isMasajesLocalPerfil', PR.isMasajesLocalPerfil(uMasajes), 'masajes');
ok('masajes cardHTML routes bienestar', PR.cardHTML(uMasajes, { categoria: 'Masajes' }).includes('res-card--bienestar'), 'route');

const presSpa = FE.resolvePublicPresentation({ subcategoriaId: 'spa', categoria: 'Spa' });
ok('field-engine vista spa', presSpa.vistaPerfil === 'spa', presSpa.vistaPerfil);

const presMasajes = FE.resolvePublicPresentation({ subcategoriaId: 'masajes', categoria: 'Masajes' });
ok('field-engine vista masajesLocal', presMasajes.vistaPerfil === 'masajesLocal', presMasajes.vistaPerfil);

console.log('\n=== QA Neg bienestar render ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
