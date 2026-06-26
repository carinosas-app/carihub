/**
 * QA cierre — delta Dotados (persona_acompanante).
 * node scripts/qa-dotados.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', 'public', 'js');

function makeCtx() {
  const ctx = {
    console,
    document: {
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
    },
  };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  return ctx;
}

function loadScript(relativePath, ctx) {
  const code = fs.readFileSync(path.join(root, relativePath), 'utf8');
  vm.runInContext(code, ctx, { filename: relativePath });
}

function loadAll() {
  const ctx = makeCtx();
  loadScript('carihub-viajes-desplazamiento.js', ctx);
  loadScript('data/registro-adultos-escort-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  return ctx;
}

const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

function escortCtx(subId) {
  return { subcategoriaId: subId, subcategoria: subId };
}

function mergedEscort(vmCtx, userCtx) {
  const cfg = vmCtx.CARIHUB_REGISTRO_ESCORT_BLOCKS;
  return vmCtx.CariHubRegistroPublicBlocks.mergedConfig(cfg, userCtx);
}

function blockById(merged, id) {
  return merged.blocks.find((b) => b.id === id);
}

function fieldIds(block) {
  return (block && block.fields) ? block.fields.map((f) => f.id) : [];
}

try {
  const ctx = loadAll();
  ok('load módulos', !!(ctx.CariHubRegistroPublicBlocks && ctx.CARIHUB_REGISTRO_ESCORT_BLOCKS));

  const dotCtx = escortCtx('dotados');
  const merged = mergedEscort(ctx, dotCtx);

  const perfil = blockById(merged, 'dotadosPerfil');
  const pref = blockById(merged, 'dotadosPreferencias');
  ok('bloque dotadosPerfil existe', !!perfil);
  ok('bloque dotadosPreferencias existe', !!pref);

  const perfilFields = fieldIds(perfil);
  ok('longitudCm en dotadosPerfil', perfilFields.includes('longitudCm'));
  ok('mostrarLongitudPublico en dotadosPerfil', perfilFields.includes('mostrarLongitudPublico'));
  ok('atencion hombres/mujeres/parejas/trans', [
    'atencionHombres', 'mostrarAtencionHombresPublico',
    'atencionMujeres', 'mostrarAtencionMujeresPublico',
    'atencionParejas', 'mostrarAtencionParejasPublico',
    'atencionTrans', 'mostrarAtencionTransPublico'
  ].every((id) => perfilFields.includes(id)));

  const prefFields = fieldIds(pref);
  ok('tríos y colaboración en preferencias', prefFields.includes('realizaTrios') && prefFields.includes('colaboracionContenido'));
  ok('toggles visibilidad tríos/colaboración', prefFields.includes('mostrarRealizaTriosPublico') && prefFields.includes('mostrarColaboracionContenidoPublico'));

  ok('hereda obligatorios escort base', merged.obligatorios.includes('modalidades') && merged.obligatorios.includes('serviciosIncluidos'));
  ok('viajes activo en dotados', ctx.CariHubViajesDesplazamiento.subcategoriaActivaViajes('dotados'));

  const modBlock = blockById(merged, 'modalidades');
  const viajaOpt = (modBlock?.fields.find((f) => f.id === 'modalidades')?.options || [])
    .some((o) => (o.value || o) === 'viaja');
  ok('chip Viaja disponible', viajaOpt);

  const bloques = {
    longitudCm: '18',
    mostrarLongitudPublico: 'Sí',
    atencionHombres: 'Sí',
    mostrarAtencionHombresPublico: 'Sí',
    atencionMujeres: 'No',
    mostrarAtencionMujeresPublico: 'No',
    realizaTrios: 'Bajo acuerdo previo',
    mostrarRealizaTriosPublico: 'Sí',
    modalidades: ['recibe', 'viaja'],
    alcanceDesplazamiento: 'toda_ciudad',
    viajesProgramados: 'si',
    gastosTraslado: 'cliente',
    anticipacionViaje: '48h',
  };
  bloques.viajesDesplazamiento = ctx.CariHubViajesDesplazamiento.buildViajesDesplazamiento(bloques, bloques.modalidades);

  const u = ctx.CariHubRegistroPublicBlocks.mapToPerfil({}, bloques, dotCtx);
  ok('mapToPerfil longitudCm', u.longitudCm === '18');
  ok('mapToPerfil categoriaTamaño 18cm', u.categoriaTamaño === 'Por encima del promedio');
  ok('mapToPerfil atencionHombres', u.atencionHombres === 'Sí');
  ok('mapToPerfil viajes.viaja', u.viajesDesplazamiento?.viaja === true);
  ok('badge LGBT no forzado dotados', u.badgeLgbt !== true);

  const u15 = ctx.CariHubRegistroPublicBlocks.mapToPerfil({}, { longitudCm: '15' }, dotCtx);
  ok('categoriaTamaño <16 Promedio', u15.categoriaTamaño === 'Promedio');
  const u21 = ctx.CariHubRegistroPublicBlocks.mapToPerfil({}, { longitudCm: '21' }, dotCtx);
  ok('categoriaTamaño >=20 Dotado', u21.categoriaTamaño === 'Dotado');

  const card = ctx.CariHubPublicRenderLite.cardHTMLAdultos({
    subcategoriaId: 'dotados',
    longitudCm: '20',
    mostrarLongitudPublico: 'Sí',
    categoriaTamaño: 'Dotado',
    tagline: 'Perfil discreto',
    edad: 28,
    precio: '2500',
    modalidades: ['recibe'],
  }, {});
  ok('tarjeta NO expone longitud cm', !card.includes('20 cm') && !card.includes('Longitud'));
  ok('tarjeta NO expone categoriaTamaño', !card.includes('Dotado') || card.includes('Dotados'));
  ok('tarjeta renderiza sin crash', card.includes('Perfil discreto'));

  const cardViaja = ctx.CariHubPublicRenderLite.cardHTMLAdultos({
    subcategoriaId: 'dotados',
    modalidades: ['recibe', 'viaja'],
    viajesDesplazamiento: { viaja: true, alcanceDesplazamiento: 'toda_ciudad' },
    tagline: 'Test',
    edad: 30,
    precio: '2000',
  }, {});
  ok('tarjeta viajes resumen dotados', cardViaja.includes('Viaja: Sí'));

  ok('regresión escort intacta', mergedEscort(ctx, escortCtx('escort')).obligatorios.includes('modalidades'));
  ok('regresión lesbians intacta', mergedEscort(ctx, escortCtx('lesbians')).obligatorios.includes('atiendoA'));
} catch (e) {
  fail.push({ name: 'EXCEPTION', detail: e.stack || e.message });
}

console.log('\n=== QA cierre Dotados ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? `(${p.detail})` : ''));
console.log('FAIL:', fail.length);
fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
process.exit(fail.length ? 1 : 0);
