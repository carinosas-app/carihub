/**
 * MPS — auditoría campo × etapa pareja_grupo (swinger + cuckold_hotwife).
 * node agent-tools/audit-pareja-contract-pipeline.mjs
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
  if (key === 'parejaGrupoPerfil') return obj.parejaGrupoPerfil;
  if (key === 'swingerPerfil') return obj.swingerPerfil;
  if (key === 'cuckoldHotwifePerfil') return obj.cuckoldHotwifePerfil;
  if (key === 'viajesDesplazamiento') return obj.viajesDesplazamiento;
  return obj[key];
}

function loadStack(ctx) {
  load('carihub-viajes-desplazamiento.js', ctx);
  load('data/registro-adultos-escort-blocks.js', ctx);
  load('data/registro-adultos-pareja-blocks.js', ctx);
  load('data/registro-adultos-lifestyle-blocks.js', ctx);
  load('carihub-registro-public-blocks.js', ctx);
  ctx.CariHubPrivateFieldsLite = { sanitizePrivateForStorage: (p) => ({ ...(p || {}) }) };
  load('registro-perfil-submit.js', ctx);
  load('carihub-public-render-lite.js', ctx);
}

function runAudit(label, userCtx, bloques, vista, renderFn) {
  const RP = ctx.CariHubRegistroPublicBlocks;
  const Submit = ctx.CariHubRegistroPerfilSubmit;
  let mapped = RP.mapToPerfil(
    {
      subcategoriaId: userCtx.subcategoriaId,
      aliasPareja: bloques.aliasPareja || bloques.alias,
      alias: bloques.aliasPareja || bloques.alias,
      ciudad: 'CDMX',
    },
    bloques,
    userCtx
  );
  if (userCtx.subcategoriaId === 'swinger' || String(userCtx.subcategoriaId).includes('swinger')) {
    mapped = RP.applySwingerPerfilFields(mapped, bloques, userCtx);
  } else {
    mapped = RP.applyCuckoldHotwifePerfilFields(mapped, bloques, userCtx);
  }

  const doc = Submit.buildUsuarioDoc(
    'uid_p',
    {
      contexto: userCtx,
      schemaResuelto: { identidad: { arquetipo: 'pareja_grupo', tipoPerfil: 'pareja_grupo' } },
      camposPublicos: {
        aliasPareja: bloques.aliasPareja,
        alias: bloques.aliasPareja,
        bloquesPublicos: bloques,
        ciudad: 'CDMX',
      },
    },
    { correoAcceso: 'p@ex.com', mayorEdadConfirmado: true },
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
  pctx.DEMO = { [vista]: {} };
  pctx.window = pctx;
  vm.runInContext(slice, pctx);
  pctx.aplicarPerfilDesdeRegistro(vista, mapped);
  const iframePreview = pctx.DEMO[vista];

  const card = renderFn(mapped);

  return { mapped, doc, iframePreview, card, html };
}

function previewHas(iframePreview, field) {
  if (hasVal(getPath(iframePreview, field))) return true;
  if (iframePreview.swingerPerfil && hasVal(iframePreview.swingerPerfil[field])) return true;
  if (iframePreview.cuckoldHotwifePerfil && hasVal(iframePreview.cuckoldHotwifePerfil[field])) return true;
  if (field === 'horarioDetalle' && (hasVal(iframePreview.horarioDetalle) || hasVal(iframePreview.horario))) return true;
  return false;
}

function auditFields(label, fields, bloques, userCtx, vista, renderFn) {
  const { mapped, doc, iframePreview, card, html } = runAudit(label, userCtx, bloques, vista, renderFn);
  console.log(`\n=== MPS ${label} ===\n`);
  console.log('field\tblocks\tmap\tsubmit\tpreview\trender\tseverity');
  const gaps = [];
  for (const field of fields) {
    const b = hasVal(getPath(bloques, field));
    const m = hasVal(getPath(mapped, field));
    const s = hasVal(getPath(doc, field));
    const p = previewHas(iframePreview, field);
    const r = html.includes(field) || card.includes(String(getPath(mapped, field) || '').slice(0, 6));
    let severity = 'OK';
    if (!b && !['badgeSwinger', 'badgeCuckold', 'badgeHotwife'].includes(field)) severity = 'Mejora';
    else if (!m) severity = 'Bloqueador';
    else if (!s) severity = 'Importante';
    else if (!p) severity = 'Importante';
    if (severity !== 'OK') gaps.push({ field, severity, b, m, s, p });
    console.log([field, b ? 'Y' : 'N', m ? 'Y' : 'N', s ? 'Y' : 'N', p ? 'Y' : 'N', r ? 'Y' : 'N', severity].join('\t'));
  }
  console.log(`\nGaps (${gaps.length}):`);
  gaps.forEach((g) => console.log(`  [${g.severity}] ${g.field} (b=${g.b} m=${g.m} s=${g.s} p=${g.p})`));
  return gaps;
}

const ctx = makeCtx();
loadStack(ctx);
const RP = ctx.CariHubRegistroPublicBlocks;
const PR = ctx.CariHubPublicRenderLite;

const shell = {
  aliasPareja: 'Pareja Audit',
  alias: 'Pareja Audit',
  configuracionGrupo: 'pareja_hm',
  miembros: [
    { etiquetaPublica: 'Él', generoPresentacion: 'Hombre', edad: 38 },
    { etiquetaPublica: 'Ella', generoPresentacion: 'Mujer', edad: 36 },
  ],
  reglasAcceso: 'Cita previa',
  modalidades: ['recibe', 'viaja'],
  metodosPago: ['Efectivo'],
  horarioDetalle: 'Vie–Dom',
  sobreMi: 'Pareja lifestyle.',
  alcanceDesplazamiento: 'cualquier_ciudad_pais',
  viajesProgramados: 'si',
};

const swingerFields = [
  'aliasPareja', 'configuracionGrupo', 'miembros', 'reglasAcceso', 'modalidades', 'metodosPago', 'horarioDetalle', 'sobreMi',
  'viajesDesplazamiento', 'parejaGrupoPerfil', 'objetivosPerfil', 'objetivoPrincipal', 'intercambioSwinger', 'tipoInteraccion',
  'modalidadInteraccion', 'atiendenA', 'aceptanSolteros', 'haceColaboraciones', 'colaboraCon', 'estiloPareja',
  'aceptanParejasPrincipiantes', 'experienciaEnLifestyle', 'swingerPerfil', 'badgeSwinger',
];

const swingerBloques = RP.finalizeParejaSwingerValues(
  {
    ...shell,
    objetivosPerfil: ['Conocer parejas'],
    intercambioSwinger: 'A convenir',
    tipoInteraccion: ['Intercambio swinger'],
    modalidadInteraccion: ['Discreta'],
    atiendenA: 'Parejas',
    aceptanSolteros: 'A convenir',
    haceColaboraciones: 'No',
    experienciaEnLifestyle: 'Experimentados',
    estiloPareja: ['Discreto'],
    aceptanParejasPrincipiantes: 'Sí',
  },
  { subcategoriaId: 'swinger', arquetipo: 'pareja_grupo' }
);
swingerBloques.viajesDesplazamiento = ctx.CariHubViajesDesplazamiento.buildViajesDesplazamiento(swingerBloques, swingerBloques.modalidades);

const chFields = [
  'aliasPareja', 'configuracionGrupo', 'miembros', 'dinamica', 'dinamicaLabel', 'buscan', 'tipoExperiencia',
  'participacionPareja', 'aceptanSolteros', 'aceptanPrincipiantes', 'experienciaEnLifestyle', 'haceColaboraciones',
  'colaboraCon', 'cuckoldHotwifePerfil', 'badgeCuckold', 'badgeHotwife', 'parejaGrupoPerfil',
];

const chBloques = RP.finalizeCuckoldHotwifeValues(
  {
    ...shell,
    dinamica: 'hotwife',
    buscan: ['Bulls', 'Parejas'],
    tipoExperiencia: ['Encuentros privados'],
    participacionPareja: 'Ella decide',
    aceptanSolteros: 'Sí',
    aceptanPrincipiantes: 'Sí',
    experienciaEnLifestyle: 'Experimentados',
    haceColaboraciones: 'No',
  },
  { subcategoriaId: 'cuckold hotwife', arquetipo: 'pareja_grupo' }
);

auditFields(
  'Swinger (pareja_grupo)',
  swingerFields,
  swingerBloques,
  { subcategoriaId: 'swinger', arquetipo: 'pareja_grupo', subcategoria: 'Swinger' },
  'pareja',
  (u) => PR.cardHTML(u, { categoria: 'Swinger' })
);

auditFields(
  'Cuckold/Hotwife (pareja_grupo)',
  chFields,
  chBloques,
  { subcategoriaId: 'cuckold hotwife', arquetipo: 'pareja_grupo', subcategoria: 'Cuckold / Hotwife', tipoPerfil: 'pareja_grupo' },
  'pareja',
  (u) => PR.cardHTML(u, { categoria: 'Cuckold / Hotwife' })
);
