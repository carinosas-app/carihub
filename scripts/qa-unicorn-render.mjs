/**
 * QA — A3.4 render tarjeta + routing + ficha DEMO unicorn (sin browser).
 * node scripts/qa-unicorn-render.mjs
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

function unicornPerfilDemo() {
  return {
    subcategoriaId: 'unicorns',
    categoria: 'Unicorn',
    categoriaPublica: 'Unicorn',
    tipoPerfil: 'persona',
    arquetipo: 'persona_lifestyle',
    badgeUnicorn: true,
    nombre: 'Luna U.',
    alias: 'Luna U.',
    edad: 28,
    ciudad: 'Monterrey',
    zona: 'San Pedro',
    precio: '1500',
    precioDesde: '1500',
    objetivoPrincipal: 'Conocer parejas',
    objetivosPerfil: ['Conocer parejas', 'Viajes compartidos'],
    tipoUnicornio: 'Mujer',
    buscoConocer: ['Parejas', 'Mujeres'],
    buscan: ['Parejas', 'Mujeres'],
    estadoPerfil: 'Disponible para encuentros',
    haceColaboraciones: 'Sí',
    colaboraCon: ['Parejas Swinger'],
    mostrarColaboraciones: 'Sí',
    mostrarObjetivosPerfil: 'Sí',
    experiencia: 'Intermedio',
    ambientePreferido: ['Hotel'],
    estilo: 'Discreto',
    serviciosLifestyle: ['Citas con parejas', 'Viajes compartidos'],
    modalidades: ['hotel', 'viaja'],
    viajesDesplazamiento: { viaja: true, alcanceDesplazamiento: 'cualquier_ciudad_pais' },
    horarioDetalle: 'Vie–Dom 20:00–02:00',
    metodosPago: ['Efectivo', 'Transferencia'],
    idiomas: 'Español, Inglés',
    sobreMi: 'Unicornio lifestyle discreta.',
  };
}

function extractDemoUnicornBlock(html) {
  const m = html.match(/\/\* Unicorn — schema:[\s\S]*?DEMO\.unicorn=\{([\s\S]*?)\n\};/);
  return m ? m[0] : '';
}

function extractFunctionBlock(html, fnName, nextFnName) {
  const start = html.indexOf(`function ${fnName}`);
  const end = html.indexOf(`function ${nextFnName}`, start + 1);
  if (start < 0 || end < 0 || end <= start) return '';
  return html.slice(start, end);
}

function extractAplicarPerfilDesdeRegistroBlock(html) {
  return [
    extractFunctionBlock(html, 'mergeParejaGrupoRegistroFields', 'parejaPieBottomHTML'),
    extractFunctionBlock(html, 'demoAssetDesdeResultados', 'aplicarPerfilDesdeRegistro'),
    extractFunctionBlock(html, 'aplicarPerfilDesdeRegistro', 'aplicarPerfilResultadosEnDemo'),
  ].join('\n');
}

function loadAplicarPerfilDesdeRegistro(html) {
  const slice = extractAplicarPerfilDesdeRegistroBlock(html);
  const ctx = makeCtx();
  ctx.DEMO = { unicorn: { nombre: 'Demo base', alias: 'Demo base' } };
  ctx.window = ctx;
  vm.runInContext(slice, ctx);
  return ctx;
}

function buildUnicornPreviewPayload(RP, ctx) {
  const userCtx = {
    subcategoriaId: 'unicorns',
    subcategoria: 'Unicorns',
    arquetipo: 'persona_lifestyle',
    tipoPerfil: 'persona',
    categoriaPrincipal: 'Adultos',
  };
  const bloques = RP.finalizeUnicornValues({
    alias: 'Luna U.',
    objetivosPerfil: ['Conocer parejas', 'Viajes'],
    tipoUnicornio: 'Mujer',
    buscoConocer: ['Parejas', 'Mujeres'],
    tipoParejaPreferida: ['Hombre + Mujer'],
    finalidadEncuentro: ['Socializar'],
    estadoPerfil: 'Disponible para encuentros',
    experiencia: 'Intermedio',
    ambientePreferido: ['Hotel'],
    estilo: 'Discreto',
    serviciosLifestyle: ['Citas con parejas'],
    haceColaboraciones: 'No',
    modalidades: ['hotel'],
    metodosPago: ['Efectivo'],
    mostrarObjetivosPerfil: 'Sí',
  }, userCtx);
  let u = {
    subcategoriaId: 'unicorns',
    subcategoria: 'Unicorns',
    arquetipo: 'persona_lifestyle',
    tipoPerfil: 'persona',
    categoriaPublica: 'Unicorn',
    alias: 'Luna U.',
    edad: '28',
    ciudad: 'Monterrey',
  };
  u = RP.mapToPerfil(u, bloques, userCtx);
  if (RP.applyUnicornPerfilFields) u = RP.applyUnicornPerfilFields(u, bloques, userCtx);
  u.swingerPerfil = { intercambioSwinger: 'contaminación swinger' };
  u.cuckoldHotwifePerfil = { dinamica: 'contaminación c/h' };
  return u;
}

try {
  const ctx = makeCtx();
  loadScript('carihub-viajes-desplazamiento.js', ctx);
  loadScript('data/registro-adultos-escort-blocks.js', ctx);
  loadScript('data/registro-adultos-pareja-blocks.js', ctx);
  loadScript('data/registro-adultos-lifestyle-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  loadScript('data/registro-schema-index.js', ctx);
  loadScript('resultados-demo.js', ctx);
  loadScript('carihub-field-engine-lite.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);

  const R = ctx.CariHubPublicRenderLite;
  const FE = ctx.CariHubFieldEngineLite;
  const u = unicornPerfilDemo();

  ok('load módulos render', !!(R && FE && R.cardHTMLUnicorn), 'render + field-engine');

  const pres = FE.resolvePublicPresentation({ subcategoriaId: 'unicorns', categoria: 'Unicorn' });
  ok('vista unicorn', pres.vistaPerfil === 'unicorn', pres.vistaPerfil);
  ok('componente ResultCardUnicorn', pres.componenteResultados === 'ResultCardUnicorn', pres.componenteResultados);
  ok('componente ProfileLayoutAdultos', pres.componentePerfil === 'ProfileLayoutAdultos', pres.componentePerfil);
  ok('tipoPerfil persona schema', pres.tipoPerfil === 'persona', pres.tipoPerfil);
  ok('arquetipo persona_lifestyle', pres.arquetipo === 'persona_lifestyle', pres.arquetipo);

  FE.enriquecerPerfilPublico(u, { subcategoriaId: 'unicorns' });
  ok('enriquecer __vista', u.__vista === 'unicorn', u.__vista);
  ok('enriquecer __componenteResultados', u.__componenteResultados === 'ResultCardUnicorn', u.__componenteResultados);

  const card = R.cardHTML(u, { categoria: 'Unicorn' });
  ok('tarjeta alias', card.includes('Luna U.'), 'nombre');
  ok('tarjeta edad', card.includes('28 años'), 'edad');
  ok('tarjeta objetivo principal', card.includes('Conocer parejas'), 'objetivo');
  ok('tarjeta busco conocer', card.includes('Busco: Parejas'), 'busco');
  ok('tarjeta precio', card.includes('1500') || card.includes('1,500'), 'precio');
  ok('tarjeta ciudad', card.includes('Monterrey'), 'ciudad');
  ok('tarjeta badge unicorn', card.includes('res-badge--unicorn') && card.includes('Unicornio'), 'badge');
  ok('tarjeta chip viaja', card.includes('Viaja'), 'viaja');
  ok('tarjeta sin colaboraciones', !/Colaboraciones/i.test(card), 'limpio');
  ok('tarjeta clase unicorn', card.includes('res-card--unicorn'), 'css');

  const cardDirect = R.cardHTMLUnicorn(u, { categoria: 'Unicorn' });
  ok('cardHTMLUnicorn directo', cardDirect.includes('res-card--unicorn'), 'direct');

  const bloques = ctx.CariHubRegistroPublicBlocks.buildUnicornPerfil({
    ...u,
    tipoParejaPreferida: ['Hombre + Mujer'],
    finalidadEncuentro: ['Socializar'],
  });
  ok('buildUnicornPerfil campos A3.3', bloques.tipoUnicornio === 'Mujer' && bloques.estadoPerfil === 'Disponible para encuentros', JSON.stringify({
    tipoUnicornio: bloques.tipoUnicornio,
    estadoPerfil: bloques.estadoPerfil,
  }));

  const lifestyleBlock = ctx.CARIHUB_REGISTRO_LIFESTYLE_BLOCKS.blocks.find((b) => b.id === 'unicornPerfil');
  const svcBlock = ctx.CARIHUB_REGISTRO_LIFESTYLE_BLOCKS.blocks.find((b) => b.id === 'serviciosLifestyle');
  const ids = lifestyleBlock ? lifestyleBlock.fields.map((f) => f.id) : [];
  const svcIds = svcBlock ? svcBlock.fields.map((f) => f.id) : [];
  ok('campos registro lifestyle', ids.includes('tipoUnicornio') && svcIds.includes('serviciosLifestyle'), ids.join(', ') + ' | ' + svcIds.join(', '));

  const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
  const demoBlock = extractDemoUnicornBlock(perfilHtml);
  ok('DEMO.unicorn persona', /tipoPerfil:"persona"/.test(demoBlock), 'tipoPerfil');
  ok('DEMO.unicorn arquetipo', /arquetipo:"persona_lifestyle"/.test(demoBlock), 'arquetipo');
  ok('DEMO sin pareja buscando', !/pareja estable buscando unicornio/i.test(demoBlock), 'copy legacy');
  ok('DEMO campos lifestyle', /tipoUnicornio:"Mujer"/.test(demoBlock) && /buscoConocer:\["Parejas"/.test(demoBlock), 'campos');
  ok('ficha serviciosLifestyle', perfilHtml.includes('Servicios lifestyle'), 'ficha row');
  ok('schema ResultCardUnicorn registrado', perfilHtml.includes('ResultCardUnicorn') || fs.readFileSync(path.join(repoRoot, 'scripts', 'config-registro-adultos-schema.json'), 'utf8').includes('"ResultCardUnicorn"'), 'validator');

  const previewHtml = fs.readFileSync(path.join(repoRoot, 'public', 'preview', 'perfil-vista-previa.html'), 'utf8');
  ok('preview DEMO persona', /DEMO\.unicorn[\s\S]*tipoPerfil:"persona"/.test(previewHtml), 'vista-previa');
  ok('packs sin pareja buscando', !/Buscan su unicornio ideal/i.test(perfilHtml), 'CARINOSAS_PACKS');

  const fichaRows = [
    'Tipo de unicornio',
    'Objetivo del perfil',
    'Busco conocer',
    'Tipo de pareja preferida',
    'Finalidad del encuentro',
    'Busca actualmente',
    'Experiencia',
    'Ambiente preferido',
    'Servicios lifestyle',
    'Métodos de pago',
  ];
  ok(
    'ficha filas unicorn A3.4',
    fichaRows.every((row) => perfilHtml.includes(row)),
    fichaRows.filter((row) => !perfilHtml.includes(row)).join(', ')
  );

  const previewJs = fs.readFileSync(path.join(repoRoot, 'public', 'js', 'registro-perfil-preview.js'), 'utf8');
  ok('preview iframe vista param', previewJs.includes("params.set('vista', data.vista)"), 'iframe src');
  ok('preview perfilIframeSrc unicorn', previewJs.includes("vistaPerfil = 'unicorn'"), 'vista unicorn');

  const mapa = fs.readFileSync(path.join(repoRoot, 'scripts', 'mapa-registro-categorias.json'), 'utf8');
  ok('mapa unicorns persona_lifestyle', mapa.includes('"subcategoriaId": "unicorns"') && mapa.includes('"arquetipo": "persona_lifestyle"'), 'mapa');

  const aplicarBlock = extractAplicarPerfilDesdeRegistroBlock(perfilHtml);
  ok('aplicarPerfilDesdeRegistro buscoConocer', /buscoConocer:/.test(aplicarBlock), 'campo preview');
  ok('aplicarPerfilDesdeRegistro objetivosPerfil', /objetivosPerfil:/.test(aplicarBlock), 'campo preview');
  ok('aplicarPerfilDesdeRegistro objetivoPrincipal', /objetivoPrincipal:/.test(aplicarBlock), 'campo preview');
  ok('aplicarPerfilDesdeRegistro badgeUnicorn', /badgeUnicorn:/.test(aplicarBlock), 'campo preview');
  ok('aplicarPerfilDesdeRegistro buscan prioriza buscoConocer', /buscan:Array\.isArray\(u\.buscoConocer\)/.test(aplicarBlock), 'fallback buscan');
  ok('aplicarPerfilDesdeRegistro anti-contam unicorn', /delete clean\.swingerPerfil/.test(aplicarBlock) && /delete clean\.cuckoldHotwifePerfil/.test(aplicarBlock), 'strip nested');
  ok('aplicarPerfilDesdeRegistro tipoUnicornio', /clean\.tipoUnicornio/.test(aplicarBlock), 'campo preview');
  ok('aplicarPerfilDesdeRegistro tipoParejaPreferida', /clean\.tipoParejaPreferida/.test(aplicarBlock), 'campo preview');
  ok('aplicarPerfilDesdeRegistro finalidadEncuentro', /clean\.finalidadEncuentro/.test(aplicarBlock), 'campo preview');
  ok('aplicarPerfilDesdeRegistro estadoPerfil', /clean\.estadoPerfil/.test(aplicarBlock), 'campo preview');
  ok('aplicarPerfilDesdeRegistro experiencia', /clean\.experiencia/.test(aplicarBlock), 'campo preview');
  ok('aplicarPerfilDesdeRegistro ambientePreferido', /clean\.ambientePreferido/.test(aplicarBlock), 'campo preview');
  ok('aplicarPerfilDesdeRegistro estilo', /clean\.estilo/.test(aplicarBlock), 'campo preview');
  ok('aplicarPerfilDesdeRegistro serviciosLifestyle', /clean\.serviciosLifestyle/.test(aplicarBlock), 'campo preview');
  ok('aplicarPerfilDesdeRegistro unicornPerfil nested', /clean\.unicornPerfil=Object\.assign/.test(aplicarBlock), 'nested preview');

  const previewCtx = loadAplicarPerfilDesdeRegistro(perfilHtml);
  const previewU = buildUnicornPreviewPayload(ctx.CariHubRegistroPublicBlocks, ctx);
  previewCtx.aplicarPerfilDesdeRegistro('unicorn', previewU);
  const demoPreview = previewCtx.DEMO.unicorn;
  ok('preview registro buscoConocer', Array.isArray(demoPreview.buscoConocer) && demoPreview.buscoConocer.length === 2, JSON.stringify(demoPreview.buscoConocer));
  ok('preview registro objetivosPerfil', Array.isArray(demoPreview.objetivosPerfil) && demoPreview.objetivosPerfil.length === 2, JSON.stringify(demoPreview.objetivosPerfil));
  ok('preview registro objetivoPrincipal', demoPreview.objetivoPrincipal === 'Conocer parejas', demoPreview.objetivoPrincipal);
  ok('preview registro badgeUnicorn', demoPreview.badgeUnicorn === true, String(demoPreview.badgeUnicorn));
  ok('preview registro buscan alias', Array.isArray(demoPreview.buscan) && demoPreview.buscan[0] === 'Parejas', JSON.stringify(demoPreview.buscan));
  ok('preview registro sin swingerPerfil', demoPreview.swingerPerfil == null, JSON.stringify(demoPreview.swingerPerfil));
  ok('preview registro sin cuckoldHotwifePerfil', demoPreview.cuckoldHotwifePerfil == null, JSON.stringify(demoPreview.cuckoldHotwifePerfil));
  ok('preview registro arquetipo lifestyle', demoPreview.arquetipo === 'persona_lifestyle', demoPreview.arquetipo);
  ok('preview registro tipoPerfil persona', demoPreview.tipoPerfil === 'persona', demoPreview.tipoPerfil);
  ok('preview iframe ruta B tipoUnicornio', demoPreview.tipoUnicornio === 'Mujer', demoPreview.tipoUnicornio);
  ok('preview iframe ruta B tipoParejaPreferida', Array.isArray(demoPreview.tipoParejaPreferida) && demoPreview.tipoParejaPreferida[0] === 'Hombre + Mujer', JSON.stringify(demoPreview.tipoParejaPreferida));
  ok('preview iframe ruta B finalidadEncuentro', Array.isArray(demoPreview.finalidadEncuentro) && demoPreview.finalidadEncuentro[0] === 'Socializar', JSON.stringify(demoPreview.finalidadEncuentro));
  ok('preview iframe ruta B estadoPerfil', demoPreview.estadoPerfil === 'Disponible para encuentros', demoPreview.estadoPerfil);
  ok('preview iframe ruta B experiencia', demoPreview.experiencia === 'Intermedio', demoPreview.experiencia);
  ok('preview iframe ruta B ambientePreferido', Array.isArray(demoPreview.ambientePreferido) && demoPreview.ambientePreferido[0] === 'Hotel', JSON.stringify(demoPreview.ambientePreferido));
  ok('preview iframe ruta B estilo', demoPreview.estilo === 'Discreto', demoPreview.estilo);
  ok('preview iframe ruta B serviciosLifestyle', Array.isArray(demoPreview.serviciosLifestyle) && demoPreview.serviciosLifestyle[0] === 'Citas con parejas', JSON.stringify(demoPreview.serviciosLifestyle));
  ok('preview iframe ruta B unicornPerfil nested', demoPreview.unicornPerfil && demoPreview.unicornPerfil.tipoUnicornio === 'Mujer', JSON.stringify(demoPreview.unicornPerfil && demoPreview.unicornPerfil.tipoUnicornio));
} catch (e) {
  fail.push({ name: 'exception', detail: e.message });
}

console.log('\n=== QA Unicorn A3.4 Render ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
