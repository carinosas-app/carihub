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
