/**
 * QA — A2.3 render tarjeta + ficha swinger (sin browser).
 * node scripts/qa-pareja-swinger-render.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import {
  extractAplicarPerfilDesdeRegistroBlock,
  readPerfilPublicoHtml,
  runPreviewRouteB,
} from './qa-preview-iframe-route-b-lib.mjs';

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

function swingerPerfilDemo() {
  return {
    subcategoriaId: 'swinger',
    categoria: 'Swinger',
    tipoPerfil: 'pareja_grupo',
    aliasPareja: 'Pareja Luna',
    nombre: 'Pareja Luna',
    alias: 'Pareja Luna',
    configuracionGrupoLabel: 'Hombre + Mujer',
    ciudad: 'Monterrey',
    zona: 'San Pedro',
    objetivoPrincipal: 'Conocer parejas',
    objetivosPerfil: ['Conocer parejas', 'Eventos'],
    intercambioSwinger: 'A convenir',
    tipoInteraccion: ['Intercambio swinger'],
    modalidadInteraccion: ['Discreta'],
    atiendenA: 'Parejas',
    aceptanSolteros: 'A convenir',
    aceptanParejasPrincipiantes: 'Sí',
    experienciaEnLifestyle: 'Experimentados',
    haceColaboraciones: 'No',
    estiloPareja: ['Discreto'],
    modalidades: ['recibe', 'viaja'],
    viajesDesplazamiento: { viaja: true, alcanceDesplazamiento: 'cualquier_ciudad_pais' },
    miembros: [
      { etiquetaPublica: 'Él', generoPresentacion: 'Hombre', edad: 40 },
      { etiquetaPublica: 'Ella', generoPresentacion: 'Mujer', edad: 38 },
    ],
    miembrosResumen: 'Él 40 años · Ella 38 años',
    sobreMi: 'Pareja relajada y respetuosa.',
    horarioDetalle: 'Vie–Dom 20:00–02:00',
    metodosPago: ['Efectivo', 'Transferencia'],
    reglasAcceso: 'Solo mayores de edad',
    mostrarObjetivosPerfil: 'Sí',
    mostrarAtiendenA: 'Sí',
    precioDesde: '1000',
  };
}

function swingerCtx() {
  return {
    subcategoriaId: 'swinger',
    subcategoria: 'swinger',
    arquetipo: 'pareja_grupo',
    categoriaPrincipal: 'Adultos',
  };
}

function buildSwingerPreviewPayload(RP, V) {
  const ctx = swingerCtx();
  let bloques = {
    aliasPareja: 'Pareja Luna',
    alias: 'Pareja Luna',
    configuracionGrupo: 'pareja_hm',
    miembros: [
      { etiquetaPublica: 'Él', generoPresentacion: 'Hombre', edad: 40 },
      { etiquetaPublica: 'Ella', generoPresentacion: 'Mujer', edad: 38 },
    ],
    reglasAcceso: 'Solo mayores de edad',
    modalidades: ['recibe', 'viaja'],
    metodosPago: ['Efectivo', 'Transferencia'],
    horarioDetalle: 'Vie–Dom 20:00–02:00',
    sobreMi: 'Pareja relajada y respetuosa.',
    alcanceDesplazamiento: 'cualquier_ciudad_pais',
    viajesProgramados: 'si',
    gastosTraslado: 'cliente',
    anticipacionViaje: '48h',
    objetivosPerfil: ['Conocer parejas', 'Eventos'],
    intercambioSwinger: 'A convenir',
    tipoInteraccion: ['Intercambio swinger'],
    modalidadInteraccion: ['Discreta'],
    atiendenA: 'Parejas',
    aceptanSolteros: 'A convenir',
    aceptanParejasPrincipiantes: 'Sí',
    experienciaEnLifestyle: 'Experimentados',
    mostrarObjetivosPerfil: 'Sí',
    mostrarAtiendenA: 'Sí',
  };
  bloques = RP.finalizeParejaSwingerValues(bloques);
  bloques = RP.finalizeParejaGrupoValues(bloques);
  bloques.viajesDesplazamiento = V.buildViajesDesplazamiento(bloques, bloques.modalidades || []);
  let u = {
    subcategoriaId: 'swinger',
    alias: 'Pareja Luna',
    aliasPareja: 'Pareja Luna',
    ciudad: 'Monterrey',
    zona: 'San Pedro',
    pais: 'México',
    estado: 'Nuevo León',
  };
  u = RP.mapToPerfil(u, bloques, ctx);
  if (RP.applySwingerPerfilFields) u = RP.applySwingerPerfilFields(u, bloques, ctx);
  return u;
}

try {
  const ctx = makeCtx();
  loadScript('carihub-viajes-desplazamiento.js', ctx);
  loadScript('data/registro-adultos-pareja-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  loadScript('data/registro-schema-index.js', ctx);
  loadScript('carihub-field-engine-lite.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);

  const R = ctx.CariHubPublicRenderLite;
  const FE = ctx.CariHubFieldEngineLite;
  const u = swingerPerfilDemo();

  ok('load módulos render', !!(R && FE && R.cardHTMLParejaSwinger), 'render + field-engine');

  const pres = FE.resolvePublicPresentation({ subcategoriaId: 'swinger', categoria: 'Swinger' });
  ok('vista pareja swinger', pres.vistaPerfil === 'pareja', pres.vistaPerfil);
  ok('componente ResultCardPareja', pres.componenteResultados === 'ResultCardPareja', pres.componenteResultados);

  FE.enriquecerPerfilPublico(u, { subcategoriaId: 'swinger' });
  ok('enriquecer __vista', u.__vista === 'pareja', u.__vista);

  const card = R.cardHTML(u, { categoria: 'Swinger' });
  ok('tarjeta alias', card.includes('Pareja Luna'), 'nombre');
  ok('tarjeta config', card.includes('Hombre + Mujer'), 'config');
  ok('tarjeta objetivo principal', card.includes('Conocer parejas'), 'objetivo');
  ok('tarjeta atienden a', card.includes('Atienden a: Parejas'), 'atienden');
  ok('tarjeta intercambio', card.includes('Intercambio: A convenir'), 'intercambio');
  ok('tarjeta sin colaboraciones', !/Colaboraciones/i.test(card), 'limpio');
  ok('tarjeta badge swinger', card.includes('res-badge--swinger'), 'badge');
  ok('tarjeta experiencia lifestyle', card.includes('Experimentados'), 'badge exp');
  ok('tarjeta chip viaja', card.includes('Viaja'), 'viaja');

  const bloques = ctx.CariHubRegistroPublicBlocks.buildSwingerPerfil({
    ...u,
    haceColaboraciones: 'Sí',
    colaboraCon: ['Parejas'],
  });
  ok('buildSwingerPerfil campos A2.3b', bloques.aceptanParejasPrincipiantes === 'Sí' && bloques.experienciaEnLifestyle === 'Experimentados', JSON.stringify({
    aceptanParejasPrincipiantes: bloques.aceptanParejasPrincipiantes,
    experienciaEnLifestyle: bloques.experienciaEnLifestyle,
  }));

  const swBlock = ctx.CARIHUB_REGISTRO_PAREJA_BLOCKS.blocks.find((b) => b.id === 'swingerPerfil');
  const ids = swBlock.fields.map((f) => f.id);
  ok('campos registro A2.3b', ids.includes('aceptanParejasPrincipiantes') && ids.includes('experienciaEnLifestyle'), ids.join(', '));

  const perfilHtml = readPerfilPublicoHtml(repoRoot);
  const aplicarBlock = extractAplicarPerfilDesdeRegistroBlock(perfilHtml);
  ok('aplicarPerfilDesdeRegistro intercambioSwinger', /clean\.intercambioSwinger/.test(aplicarBlock), 'campo preview');
  ok('aplicarPerfilDesdeRegistro objetivosPerfil', /clean\.objetivosPerfil/.test(aplicarBlock), 'campo preview');
  ok('aplicarPerfilDesdeRegistro swingerPerfil nested', /clean\.swingerPerfil=Object\.assign/.test(aplicarBlock), 'nested preview');
  ok('aplicarPerfilDesdeRegistro atiendenA', /clean\.atiendenA/.test(aplicarBlock), 'campo preview');
  ok('aplicarPerfilDesdeRegistro aceptanParejasPrincipiantes', /clean\.aceptanParejasPrincipiantes/.test(aplicarBlock), 'campo preview');
  ok('aplicarPerfilDesdeRegistro experienciaEnLifestyle', /clean\.experienciaEnLifestyle/.test(aplicarBlock), 'campo preview');

  const previewU = buildSwingerPreviewPayload(ctx.CariHubRegistroPublicBlocks, ctx.CariHubViajesDesplazamiento);
  const demoPreview = runPreviewRouteB(perfilHtml, 'pareja', previewU);
  ok('preview registro intercambioSwinger', demoPreview.intercambioSwinger === 'A convenir', demoPreview.intercambioSwinger);
  ok('preview registro objetivosPerfil', Array.isArray(demoPreview.objetivosPerfil) && demoPreview.objetivosPerfil.length === 2, JSON.stringify(demoPreview.objetivosPerfil));
  ok('preview registro objetivoPrincipal', demoPreview.objetivoPrincipal === 'Conocer parejas', demoPreview.objetivoPrincipal);
  ok('preview registro atiendenA', demoPreview.atiendenA === 'Parejas', demoPreview.atiendenA);
  ok('preview registro tipoPerfil pareja_grupo', demoPreview.tipoPerfil === 'pareja_grupo', demoPreview.tipoPerfil);
  ok('preview registro subcategoriaId swinger', demoPreview.subcategoriaId === 'swinger', demoPreview.subcategoriaId);
  ok('preview registro aceptanParejasPrincipiantes', demoPreview.aceptanParejasPrincipiantes === 'Sí', demoPreview.aceptanParejasPrincipiantes);
  ok('preview registro experienciaEnLifestyle', demoPreview.experienciaEnLifestyle === 'Experimentados', demoPreview.experienciaEnLifestyle);
  ok('preview registro sin cuckoldHotwifePerfil', demoPreview.cuckoldHotwifePerfil == null, JSON.stringify(demoPreview.cuckoldHotwifePerfil));
  ok('preview registro sin unicornPerfil', demoPreview.unicornPerfil == null, JSON.stringify(demoPreview.unicornPerfil));
  ok('preview registro sin dinamica C/H', !demoPreview.dinamica, String(demoPreview.dinamica));
  ok('preview iframe ruta B intercambioSwinger', demoPreview.intercambioSwinger === 'A convenir', demoPreview.intercambioSwinger);
  ok('preview iframe ruta B objetivosPerfil', Array.isArray(demoPreview.objetivosPerfil) && demoPreview.objetivosPerfil[0] === 'Conocer parejas', JSON.stringify(demoPreview.objetivosPerfil));
  ok('preview iframe ruta B tipoInteraccion', Array.isArray(demoPreview.tipoInteraccion) && demoPreview.tipoInteraccion[0] === 'Intercambio swinger', JSON.stringify(demoPreview.tipoInteraccion));
  ok('preview iframe ruta B modalidadInteraccion', Array.isArray(demoPreview.modalidadInteraccion) && demoPreview.modalidadInteraccion[0] === 'Discreta', JSON.stringify(demoPreview.modalidadInteraccion));
  ok('preview iframe ruta B swingerPerfil nested', demoPreview.swingerPerfil && demoPreview.swingerPerfil.intercambioSwinger === 'A convenir', JSON.stringify(demoPreview.swingerPerfil && demoPreview.swingerPerfil.intercambioSwinger));
  ok('preview iframe ruta B aliasPareja', demoPreview.aliasPareja === 'Pareja Luna', demoPreview.aliasPareja);
  ok('preview iframe ruta B configuracionGrupoLabel', demoPreview.configuracionGrupoLabel === 'Hombre + Mujer', demoPreview.configuracionGrupoLabel);
} catch (e) {
  fail.push({ name: 'exception', detail: e.message });
}

console.log('\n=== QA Pareja Swinger A2.3 Render ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
