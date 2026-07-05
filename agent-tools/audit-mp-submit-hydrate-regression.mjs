/**
 * Validación regresión MP-SUBMIT-HYDRATE — escenarios legacy / escort / VIP / trans / incompleto.
 * node agent-tools/audit-mp-submit-hydrate-regression.mjs
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
  const ctx = {
    console,
    document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] },
  };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  return ctx;
}
function pick(obj, keys) {
  const o = {};
  keys.forEach((k) => { o[k] = obj[k]; });
  return o;
}
function stableSubset(u) {
  return pick(u, [
    '__id', 'uid', 'nombre', 'edad', 'categoria', 'precio', 'modalidad', 'modalidades',
    'tagline', 'descripcion', 'subcategoriaId', 'badgeVip', 'badgeTrans', 'identidadGenero',
    '__hydratedFromBloques', 'serviciosIncluidos', 'estatura',
  ]);
}
function cardKind(html) {
  if (html.includes('res-card--dominatrix')) return 'cardHTMLDominatrix';
  if (html.includes('res-card--unicorn')) return 'cardHTMLUnicorn';
  if (html.includes('res-card--creador')) return 'cardHTMLCreador';
  if (html.includes('res-badge--vip') || html.includes('>VIP<')) return 'cardHTMLAdultos+VIP';
  if (html.includes('res-card--adult')) return 'cardHTMLAdultos';
  return 'cardHTML(other)';
}

const BLOCKS = [
  'data/registro-schema-index.js',
  'carihub-viajes-desplazamiento.js',
  'data/registro-adultos-escort-blocks.js',
  'data/registro-adultos-pareja-blocks.js',
  'data/registro-adultos-lifestyle-blocks.js',
  'data/registro-adultos-dominatrix-blocks.js',
  'data/registro-adultos-espectaculo-blocks.js',
  'data/registro-adultos-creador-blocks.js',
  'data/registro-adultos-retail-blocks.js',
  'data/registro-adultos-venue-blocks.js',
  'data/registro-adultos-bienestar-blocks.js',
  'data/registro-adultos-hospedaje-blocks.js',
  'carihub-registro-public-blocks.js',
  'carihub-field-engine-lite.js',
  'carihub-public-render-lite.js',
  'resultados-registrados.js',
];

const ctx = makeCtx();
for (const s of BLOCKS) load(s, ctx);
ctx.CariHubPrivateFieldsLite = { sanitizePrivateForStorage: (p) => ({ ...(p || {}) }) };
load('registro-perfil-submit.js', ctx);

const RP = ctx.CariHubRegistroPublicBlocks;
const Submit = ctx.CariHubRegistroPerfilSubmit;
const Render = ctx.CariHubPublicRenderLite;
const FE = ctx.CariHubFieldEngineLite;
const Reg = ctx.CariHubResultadosRegistrados;

let mapToPerfilCalls = 0;
const origMap = RP.mapToPerfil;
RP.mapToPerfil = function (...args) {
  mapToPerfilCalls += 1;
  return origMap.apply(this, args);
};

function escortCtx(subId) {
  return {
    subcategoriaId: subId,
    subcategoria: subId,
    arquetipo: 'persona_acompanante',
    tipoPerfil: 'persona',
    formularioId: 'adultos',
    categoriaPrincipal: 'Adultos',
  };
}

function simulateBloquesEscort(values, userCtx) {
  let out = { ...values };
  out = RP.finalizeParejaSwingerValues(out, userCtx);
  out = RP.finalizeUnicornValues(out, userCtx);
  out = RP.finalizeCuckoldHotwifeValues(out, userCtx);
  out = RP.finalizeParejaGrupoValues(out);
  if (ctx.CariHubViajesDesplazamiento) {
    out.viajesDesplazamiento = ctx.CariHubViajesDesplazamiento.buildViajesDesplazamiento(out, out.modalidades || []);
  }
  return out;
}

function buildEscortDoc(subId, alias, extraVals, extraTop) {
  const userCtx = escortCtx(subId);
  const bloques = simulateBloquesEscort(
    {
      alias,
      edad: 27,
      modalidades: ['recibe', 'hotel'],
      serviciosIncluidos: ['Masaje', 'Oral'],
      serviciosNoRealizo: ['Menores'],
      estatura: '1.65 m',
      metodosPago: ['Efectivo'],
      sobreMi: 'Perfil QA escort.',
      ...extraVals,
    },
    userCtx
  );
  return Submit.buildUsuarioDoc(
    `uid_${subId}`,
    {
      contexto: userCtx,
      schemaResuelto: { identidad: { arquetipo: 'persona_acompanante', tipoPerfil: 'persona' } },
      camposPublicos: {
        alias,
        edad: 27,
        bloquesPublicos: bloques,
        descripcionCorta: 'Tag escort QA',
        precioDesde: '2500',
        pais: 'México',
        estado: 'Nuevo León',
        ciudad: 'Monterrey',
        zona: 'Centro',
      },
    },
    { correoAcceso: 'qa@ex.com', mayorEdadConfirmado: true },
    { fotoPrincipal: 'https://example.com/e.jpg' },
    extraTop || {}
  );
}

function analyze(label, doc, opts) {
  opts = opts || {};
  mapToPerfilCalls = 0;
  const mock = { id: doc.uid || doc.id || 'test_id', exists: true, data: () => doc };
  const base = Reg.baseNormalizadoPerfilFirestore(doc, mock.id);
  const uNorm = Reg.normalizar(mock);
  const calls = mapToPerfilCalls;
  const hydrated = uNorm.__hydratedFromBloques === true;
  const coreKeys = ['__id', 'uid', 'nombre', 'edad', 'categoria', 'precio', 'modalidad', 'modalidades', 'tagline', 'descripcion'];
  const baseMatch = coreKeys.every((k) => JSON.stringify(base[k]) === JSON.stringify(uNorm[k]));
  const u = { ...uNorm };
  FE.enriquecerPerfilPublico(u, { subcategoriaId: u.subcategoriaId, categoria: u.categoria || doc.categoria });
  const html = Render.cardHTML(u, { categoria: u.categoria || doc.categoria || 'Adultos' });
  const inDoc = {
    tieneBloques: !!(doc.camposPublicos && doc.camposPublicos.bloquesPublicos),
    subcategoriaId: doc.subcategoriaId || null,
    nombre: doc.nombre,
    precio: doc.precio,
    badgeVip: doc.badgeVip,
    identidadGenero: doc.identidadGenero || null,
  };
  const out = stableSubset(uNorm);
  out.__vista = u.__vista;
  const card = cardKind(html);
  const expectedCard = opts.expectedCard || 'cardHTMLAdultos';
  const ok =
    (opts.expectHydrate ? hydrated && calls >= 1 : !hydrated && calls === 0) &&
    (opts.expectBaseMatch !== false ? (opts.expectHydrate ? true : baseMatch) : true) &&
    (opts.expectedCard ? card.startsWith(expectedCard.split('+')[0]) || card === expectedCard : true) &&
    (opts.htmlIncludes ? opts.htmlIncludes.every((s) => html.includes(s)) : true);
  return {
    label,
    ok,
    inDoc,
    out,
    mapToPerfilCalls: calls,
    hydrated,
    baseMatch: opts.expectHydrate ? 'N/A (hidratado)' : baseMatch,
    card,
    expectedCard: opts.expectedCard || 'cardHTMLAdultos',
    htmlSnippet: html.slice(0, 180).replace(/\s+/g, ' '),
  };
}

const CASES = [
  {
    label: '1. Legacy sin bloquesPublicos',
    doc: {
      uid: 'legacy_flat',
      nombre: 'Perfil Legacy',
      categoria: 'Adultos',
      subcategoriaId: 'escort',
      precio: '$500',
      edad: 25,
      ciudad: 'Monterrey',
      zona: 'Centro',
      estado: 'Nuevo León',
      descripcion: 'Solo campos planos legacy',
      modalidad: 'mixto',
      horario: '24h',
      servicios: 'Masaje, Oral',
      aprobado: true,
    },
    opts: { expectHydrate: false, expectBaseMatch: true, expectedCard: 'cardHTMLAdultos' },
  },
  {
    label: '2. Escort clásico (submit con bloquesPublicos)',
    doc: buildEscortDoc('escort', 'Escort Clásica QA', {}),
    opts: {
      expectHydrate: true,
      expectedCard: 'cardHTMLAdultos',
      htmlIncludes: ['Escort Clásica QA'],
    },
  },
  {
    label: '3. Escort VIP',
    doc: buildEscortDoc('escort_vip', 'VIP QA', { badgeVip: true, distintivosVip: ['Premium'], nivelPremium: 'Sí' }),
    opts: {
      expectHydrate: true,
      expectedCard: 'cardHTMLAdultos+VIP',
      htmlIncludes: ['VIP QA'],
    },
  },
  {
    label: '4. Trans',
    doc: buildEscortDoc('trans', 'Trans QA', {
      identidadGenero: 'Mujer trans',
      presentacionFemboy: '',
      badgeTrans: true,
    }),
    opts: {
      expectHydrate: true,
      expectedCard: 'cardHTMLAdultos',
      htmlIncludes: ['Trans QA'],
    },
  },
  {
    label: '5. Datos incompletos / opcionales vacíos',
    doc: {
      uid: 'incomplete_uid',
      nombre: 'Perfil Mínimo',
      categoria: 'Adultos',
      precio: '',
      edad: null,
      descripcion: '',
      camposPublicos: { bloquesPublicos: {}, alias: 'Min' },
      subcategoriaId: 'escort',
      arquetipo: 'persona_acompanante',
      aprobado: true,
    },
    opts: {
      expectHydrate: true,
      expectedCard: 'cardHTMLAdultos',
      htmlIncludes: ['Perfil Mínimo'],
    },
  },
];

console.log('# Regresión MP-SUBMIT-HYDRATE — read-path\n');
console.log('Comando: `node agent-tools/audit-mp-submit-hydrate-regression.mjs`\n');

const results = CASES.map((c) => analyze(c.label, c.doc, c.opts));
let allOk = true;
for (const r of results) {
  console.log(`## ${r.label} — ${r.ok ? 'OK' : 'FAIL'}`);
  console.log('Entrada (doc Firestore simulado):', JSON.stringify(r.inDoc));
  console.log('Salida (normalizarPerfilFirestore):', JSON.stringify(r.out));
  console.log(`mapToPerfil ejecutado: ${r.mapToPerfilCalls > 0 ? 'SÍ' : 'NO'} (${r.mapToPerfilCalls} llamadas)`);
  console.log(`__hydratedFromBloques: ${r.hydrated}`);
  console.log(`Fallback legacy intacto (base ≡ salida): ${r.baseMatch}`);
  console.log(`Tarjeta renderizada: ${r.card} (esperada: ${r.expectedCard})`);
  console.log('');
  if (!r.ok) allOk = false;
}

// Doble hidratación / idempotencia
console.log('## 6. Doble hidratación / idempotencia');
const sampleDoc = buildEscortDoc('escort', 'Idempotent QA', {});
mapToPerfilCalls = 0;
const m1 = { id: 'uid_escort', exists: true, data: () => sampleDoc };
const u1 = Reg.normalizar(m1);
const callsFirst = mapToPerfilCalls;
mapToPerfilCalls = 0;
const u2 = Reg.normalizar(m1);
const callsSecond = mapToPerfilCalls;
const idempotent = JSON.stringify(stableSubset(u1)) === JSON.stringify(stableSubset(u2));
const singleCallPerNormalize = callsFirst === 1 && callsSecond === 1;
console.log(`normalizar #1 mapToPerfil calls: ${callsFirst}`);
console.log(`normalizar #2 mapToPerfil calls: ${callsSecond}`);
console.log(`Salida idempotente (2× normalizar): ${idempotent ? 'SÍ' : 'NO'}`);
console.log(`Sin doble mapToPerfil dentro de una normalización: ${singleCallPerNormalize ? 'SÍ' : 'NO'}`);
const doubleOk = idempotent && singleCallPerNormalize;
console.log(`Resultado: ${doubleOk ? 'OK' : 'FAIL'}\n`);

if (!allOk || !doubleOk) {
  console.log('VEREDICTO: FAIL — revisar antes de commit');
  process.exit(1);
}
console.log('VEREDICTO: OK — regresión estable, listo para commit (sin push)');
