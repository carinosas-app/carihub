/**
 * MPS pilot — auditoría campo a campo unicorn (evidencia objetiva, no commitear).
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repo = path.join(__dirname, '..');
const root = path.join(repo, 'public', 'js');

function load(rel, ctx) {
  vm.runInContext(fs.readFileSync(path.join(root, rel), 'utf8'), ctx, { filename: rel });
}
function makeCtx() {
  const ctx = { console, document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] } };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  return ctx;
}
function hasVal(v) {
  if (v == null) return false;
  if (typeof v === 'string') return v.trim() !== '';
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'boolean') return true;
  if (typeof v === 'object') return Object.keys(v).length > 0;
  return true;
}
function extractFn(html, fn, next) {
  const s = html.indexOf(`function ${fn}`);
  const e = html.indexOf(`function ${next}`, s + 1);
  return html.slice(s, e);
}
function getPath(obj, key) {
  if (key === 'viajesDesplazamiento') return obj.viajesDesplazamiento;
  if (key === 'unicornPerfil') return obj.unicornPerfil;
  return obj[key];
}

const BLOCK_FIELDS = [
  'objetivosPerfil', 'mostrarObjetivosPerfil', 'tipoUnicornio', 'buscoConocer', 'tipoParejaPreferida', 'finalidadEncuentro',
  'estadoPerfil', 'haceColaboraciones', 'colaboraCon', 'mostrarColaboraciones', 'experiencia', 'ambientePreferido', 'estilo',
  'idiomas', 'modalidades', 'alcanceDesplazamiento', 'viajesProgramados', 'gastosTraslado', 'anticipacionViaje', 'notasViaje',
  'horarioDetalle', 'serviciosLifestyle', 'metodosPago', 'sobreMi', 'objetivoPrincipal', 'viajesDesplazamiento', 'unicornPerfil',
  'badgeUnicorn', 'buscan',
];

const VIAJE_NESTED = ['alcanceDesplazamiento', 'viajesProgramados', 'gastosTraslado', 'anticipacionViaje', 'notasViaje'];

const ctx = makeCtx();
load('carihub-viajes-desplazamiento.js', ctx);
load('data/registro-adultos-escort-blocks.js', ctx);
load('data/registro-adultos-pareja-blocks.js', ctx);
load('data/registro-adultos-lifestyle-blocks.js', ctx);
load('carihub-registro-public-blocks.js', ctx);
ctx.CariHubPrivateFieldsLite = { sanitizePrivateForStorage: (p) => ({ ...(p || {}) }) };
load('registro-perfil-submit.js', ctx);
load('carihub-public-render-lite.js', ctx);

const RP = ctx.CariHubRegistroPublicBlocks;
const Submit = ctx.CariHubRegistroPerfilSubmit;
const userCtx = {
  subcategoriaId: 'unicorns',
  subcategoria: 'Unicorns',
  arquetipo: 'persona_lifestyle',
  tipoPerfil: 'persona',
  categoriaPrincipal: 'Adultos',
};

const vals = {
  alias: 'Luna U.',
  objetivosPerfil: ['Conocer parejas', 'Viajes'],
  tipoUnicornio: 'Mujer',
  buscoConocer: ['Parejas', 'Mujeres'],
  tipoParejaPreferida: ['Hombre + Mujer'],
  finalidadEncuentro: ['Socializar'],
  estadoPerfil: 'Disponible para encuentros',
  haceColaboraciones: 'No',
  experiencia: 'Intermedio',
  ambientePreferido: ['Hotel'],
  estilo: 'Discreto',
  serviciosLifestyle: ['Citas con parejas'],
  modalidades: ['hotel', 'viaja'],
  alcanceDesplazamiento: 'cualquier_ciudad_pais',
  viajesProgramados: 'si',
  gastosTraslado: 'se_acuerda',
  anticipacionViaje: '48h',
  notasViaje: 'Con aviso',
  horarioDetalle: 'Vie–Dom 20:00–02:00',
  metodosPago: ['Efectivo'],
  sobreMi: 'Unicornio lifestyle.',
  idiomas: 'Español',
  mostrarObjetivosPerfil: 'Sí',
  mostrarColaboraciones: 'Sí',
};

const bloques = RP.finalizeUnicornValues({ ...vals }, userCtx);
bloques.viajesDesplazamiento = ctx.CariHubViajesDesplazamiento.buildViajesDesplazamiento(bloques, bloques.modalidades);

let mapped = RP.mapToPerfil(
  { subcategoriaId: 'unicorns', alias: 'Luna U.', edad: 28, ciudad: 'Monterrey', tagline: 'Tag' },
  bloques,
  userCtx
);
mapped = RP.applyUnicornPerfilFields(mapped, bloques, userCtx);

const doc = Submit.buildUsuarioDoc(
  'uid_u',
  {
    contexto: userCtx,
    schemaResuelto: { identidad: { arquetipo: 'persona_lifestyle', tipoPerfil: 'persona' } },
    camposPublicos: {
      alias: 'Luna U.',
      bloquesPublicos: bloques,
      descripcionCorta: 'Tag',
      precioDesde: '1500',
      ciudad: 'Monterrey',
    },
  },
  { correoAcceso: 'u@ex.com', mayorEdadConfirmado: true },
  {},
  {}
);

const html = fs.readFileSync(path.join(repo, 'public', 'perfil-publico.html'), 'utf8');
const slice = [
  extractFn(html, 'mergeParejaGrupoRegistroFields', 'parejaPieBottomHTML'),
  extractFn(html, 'demoAssetDesdeResultados', 'aplicarPerfilDesdeRegistro'),
  extractFn(html, 'aplicarPerfilDesdeRegistro', 'aplicarPerfilResultadosEnDemo'),
].join('\n');
const pctx = makeCtx();
pctx.DEMO = { unicorn: {} };
pctx.window = pctx;
vm.runInContext(slice, pctx);
pctx.aplicarPerfilDesdeRegistro('unicorn', mapped);
const iframePreview = pctx.DEMO.unicorn;

const card = ctx.CariHubPublicRenderLite.cardHTMLUnicorn(mapped, { categoria: 'Unicorn' });

function previewHas(field) {
  if (VIAJE_NESTED.includes(field)) {
    const vd = iframePreview.viajesDesplazamiento || (iframePreview.unicornPerfil && iframePreview.unicornPerfil.viajesDesplazamiento);
    return vd && hasVal(vd[field]);
  }
  if (field === 'horarioDetalle') return hasVal(iframePreview.horarioDetalle) || hasVal(iframePreview.horario);
  if (hasVal(getPath(iframePreview, field))) return true;
  if (iframePreview.unicornPerfil && hasVal(iframePreview.unicornPerfil[field])) return true;
  return false;
}

function renderRef(field) {
  if (field === 'objetivoPrincipal' || field === 'objetivosPerfil') return card.includes('Conocer') || card.includes(String(mapped.objetivoPrincipal || ''));
  if (field === 'buscoConocer' || field === 'buscan') return card.includes('Busco');
  if (field === 'badgeUnicorn') return card.includes('Unicornio') || card.includes('res-badge--unicorn');
  if (field === 'modalidades' || field === 'viajesDesplazamiento') return card.includes('Viaja') || card.includes('Hotel');
  if (field === 'tipoUnicornio') return html.includes('Tipo de unicornio');
  if (field === 'serviciosLifestyle') return html.includes('Servicios lifestyle');
  if (field === 'estadoPerfil') return html.includes('Busca actualmente');
  if (field === 'tipoParejaPreferida') return html.includes('Tipo de pareja preferida');
  if (field === 'finalidadEncuentro') return html.includes('Finalidad del encuentro');
  if (field === 'metodosPago') return html.includes('Métodos de pago');
  if (field === 'experiencia') return html.includes('"Experiencia"');
  if (field === 'sobreMi') return html.includes('sobreMi') || html.includes('Sobre mí');
  if (VIAJE_NESTED.includes(field)) return hasVal(mapped.viajesDesplazamiento && mapped.viajesDesplazamiento[field]);
  return html.includes(field);
}

const rows = [];
for (const field of BLOCK_FIELDS) {
  const b = hasVal(getPath(bloques, field)) || (field === 'objetivoPrincipal' && hasVal(bloques.objetivoPrincipal));
  const m = hasVal(getPath(mapped, field));
  const s = hasVal(getPath(doc, field));
  const p = previewHas(field);
  const r = renderRef(field);
  let gap = null;
  if (!b) gap = 'blocks';
  else if (!m) gap = 'mapToPerfil';
  else if (!s) gap = 'submit';
  else if (!p) gap = 'preview-iframe';
  rows.push({ field, b, m, s, p, r, gap });
}

console.log('=== MPS Unicorn — contrato campo por campo ===\n');
console.log('field\tblocks\tmap\tsubmit\tpreview\trender\tgap');
for (const row of rows) {
  console.log([
    row.field,
    row.b ? 'Y' : 'N',
    row.m ? 'Y' : 'N',
    row.s ? 'Y' : 'N',
    row.p ? 'Y' : 'N',
    row.r ? 'Y' : 'N',
    row.gap || 'OK',
  ].join('\t'));
}

const previewGaps = rows.filter((r) => r.gap === 'preview-iframe');
const otherGaps = rows.filter((r) => r.gap && r.gap !== 'preview-iframe');
console.log('\n--- Resumen ---');
console.log('Total campos:', rows.length);
console.log('Pipeline OK (hasta submit):', rows.filter((r) => !r.gap || r.gap === 'preview-iframe').length);
console.log('Gaps preview iframe:', previewGaps.length);
previewGaps.forEach((g) => console.log('  preview:', g.field));
console.log('Gaps upstream:', otherGaps.length);
otherGaps.forEach((g) => console.log('  ' + g.gap + ':', g.field));
