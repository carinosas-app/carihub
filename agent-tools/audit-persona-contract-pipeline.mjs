/**
 * MPS — auditoría persona_acompanante (escort + acompañante).
 * node agent-tools/audit-persona-contract-pipeline.mjs
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

function auditSub(label, subId, fields, vals, vista) {
  const ctx = makeCtx();
  load('carihub-viajes-desplazamiento.js', ctx);
  load('data/registro-adultos-escort-blocks.js', ctx);
  load('data/registro-adultos-pareja-blocks.js', ctx);
  load('data/registro-adultos-lifestyle-blocks.js', ctx);
  load('carihub-registro-public-blocks.js', ctx);
  ctx.CariHubPrivateFieldsLite = { sanitizePrivateForStorage: (p) => ({ ...(p || {}) }) };
  load('registro-perfil-submit.js', ctx);
  load('carihub-public-render-lite.js', ctx);

  const userCtx = {
    subcategoriaId: subId,
    subcategoria: label,
    arquetipo: 'persona_acompanante',
    tipoPerfil: 'persona',
    categoriaPrincipal: 'Adultos',
  };
  const RP = ctx.CariHubRegistroPublicBlocks;
  const Submit = ctx.CariHubRegistroPerfilSubmit;
  const PR = ctx.CariHubPublicRenderLite;

  const cfg = RP.resolveConfig(userCtx, null);
  const bloques = { ...vals };
  if (RP.finalizeEscortValues) RP.finalizeEscortValues(bloques, userCtx);

  let mapped = RP.mapToPerfil(
    { subcategoriaId: subId, alias: 'QA Persona', edad: 25, ciudad: 'CDMX', tagline: 'Tag' },
    bloques,
    userCtx
  );

  const doc = Submit.buildUsuarioDoc(
    'uid_e',
    {
      contexto: userCtx,
      schemaResuelto: { identidad: { arquetipo: 'persona_acompanante', tipoPerfil: 'persona' } },
      camposPublicos: { alias: 'QA Persona', bloquesPublicos: bloques, ciudad: 'CDMX', precioDesde: '1500' },
    },
    { correoAcceso: 'e@ex.com', mayorEdadConfirmado: true },
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
  const card = PR.cardHTML(mapped, { categoria: label });

  console.log(`\n=== MPS ${label} (${subId}) ===\n`);
  console.log('field\tblocks\tmap\tsubmit\tpreview\trender\tseverity');
  const gaps = [];
  for (const field of fields) {
    const b = hasVal(bloques[field]);
    const m = hasVal(mapped[field]);
    const s = hasVal(doc[field]);
    const p = hasVal(iframePreview[field]) || (field === 'serviciosIncluidos' && hasVal(iframePreview.serviciosIncluidos));
    const r = card.length > 50;
    let severity = 'OK';
    if (!m && b) severity = 'Bloqueador';
    else if (!s && m) severity = 'Importante';
    else if (!p && s) severity = 'Importante';
    if (severity !== 'OK') gaps.push({ field, severity });
    console.log([field, b ? 'Y' : 'N', m ? 'Y' : 'N', s ? 'Y' : 'N', p ? 'Y' : 'N', r ? 'Y' : 'N', severity].join('\t'));
  }
  console.log(`Gaps: ${gaps.length}`);
  gaps.forEach((g) => console.log(`  [${g.severity}] ${g.field}`));
}

const shell = {
  modalidades: ['recibe', 'hotel'],
  serviciosIncluidos: ['Oral', 'Masaje'],
  noRealiza: ['Menores'],
  estatura: '1.65 m',
  peso: '55 kg',
  metodosPago: ['Efectivo'],
  horarioDetalle: 'Lun–Sáb 10:00–22:00',
  sobreMi: 'Perfil escort QA.',
  idiomas: 'Español',
  orientacion: 'Heterosexual',
};

const fields = [
  'modalidades', 'serviciosIncluidos', 'noRealiza', 'estatura', 'peso', 'metodosPago',
  'horarioDetalle', 'sobreMi', 'idiomas', 'orientacion', 'viajesDesplazamiento',
];

auditSub('Escort', 'escort', fields, shell, 'adult');
auditSub('Acompañante', 'acompanante', fields, shell, 'acompanante');
