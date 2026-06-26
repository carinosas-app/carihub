/**
 * QA — A2.2 persistencia submit + preview swinger (sin browser).
 * node scripts/qa-pareja-swinger-persist.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', 'public', 'js');

function loadScript(relativePath, ctx) {
  const code = fs.readFileSync(path.join(root, relativePath), 'utf8');
  try {
    vm.runInContext(code, ctx, { filename: relativePath });
  } catch (e) {
    throw new Error(relativePath + ': ' + e.message);
  }
}

function makeCtx() {
  const ctx = {
    console,
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
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

const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

function loadParejaStack(ctx) {
  loadScript('carihub-viajes-desplazamiento.js', ctx);
  loadScript('data/registro-adultos-escort-blocks.js', ctx);
  loadScript('data/registro-adultos-pareja-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  ctx.CariHubPrivateFieldsLite = {
    sanitizePrivateForStorage: (priv) => ({ ...(priv || {}) }),
  };
  loadScript('registro-perfil-submit.js', ctx);
}

function swingerCtx() {
  return {
    subcategoriaId: 'swinger',
    subcategoria: 'swinger',
    arquetipo: 'pareja_grupo',
    categoriaPrincipal: 'Adultos',
  };
}

function escortCtx() {
  return {
    subcategoriaId: 'escort',
    subcategoria: 'Escort',
    arquetipo: 'persona_acompanante',
    tipoPerfil: 'persona',
  };
}

function baseShell() {
  return {
    aliasPareja: 'Pareja Persist',
    alias: 'Pareja Persist',
    configuracionGrupo: 'pareja_hm',
    miembros: [
      { etiquetaPublica: 'Él', generoPresentacion: 'Hombre', edad: 38 },
      { etiquetaPublica: 'Ella', generoPresentacion: 'Mujer', edad: 36 },
    ],
    reglasAcceso: 'Cita previa',
    modalidades: ['recibe', 'domicilio', 'viaja'],
    metodosPago: ['Efectivo'],
    horarioDetalle: 'Vie–Dom',
    sobreMi: 'Pareja swinger.',
    alcanceDesplazamiento: 'cualquier_ciudad_pais',
    viajesProgramados: 'si',
    gastosTraslado: 'cliente',
    anticipacionViaje: '48h',
  };
}

function swingerDelta() {
  return {
    objetivosPerfil: ['Conocer parejas', 'Eventos'],
    intercambioSwinger: 'A convenir',
    tipoInteraccion: ['Intercambio swinger', 'Tríos'],
    modalidadInteraccion: ['Discreta'],
    atiendenA: 'Parejas',
    aceptanSolteros: 'A convenir',
    haceColaboraciones: 'Sí',
    colaboraCon: ['Parejas'],
    estiloPareja: ['Relajados'],
    aceptanParejasPrincipiantes: 'Sí',
    experienciaEnLifestyle: 'Experimentados',
    mostrarObjetivosPerfil: 'Sí',
    mostrarAtiendenA: 'Sí',
    mostrarColaboraciones: 'Sí',
  };
}

function simulateBloques(vmCtx, values) {
  const RP = vmCtx.CariHubRegistroPublicBlocks;
  const V = vmCtx.CariHubViajesDesplazamiento;
  let out = { ...values };
  out = RP.finalizeParejaSwingerValues(out);
  out = RP.finalizeParejaGrupoValues(out);
  out.viajesDesplazamiento = V.buildViajesDesplazamiento(out, out.modalidades || []);
  if (!out.viajesDesplazamiento.viaja) {
    V.viajesFieldIds().forEach((k) => delete out[k]);
  }
  return out;
}

function buildSwingerDraft(vmCtx, bloques) {
  return {
    contexto: swingerCtx(),
    schemaResuelto: {
      identidad: {
        arquetipo: 'pareja_grupo',
        tipoPerfil: 'pareja_grupo',
        formularioId: 'adultos_pareja',
      },
    },
    camposPublicos: {
      alias: bloques.aliasPareja,
      aliasPareja: bloques.aliasPareja,
      descripcionCorta: 'Tagline swinger',
      precioDesde: '',
      pais: 'México',
      estado: 'CDMX',
      ciudad: 'Ciudad de México',
      zona: 'Roma',
      bloquesPublicos: bloques,
    },
    contactoPublico: {},
    mensajeContactoPublicidad: '',
  };
}

function buildEscortDraft(vmCtx) {
  const bloques = {
    alias: 'Escort QA',
    orientacion: 'Hetero',
    serviciosIncluidos: ['Cena'],
    modalidades: ['recibe'],
    atiendoA: 'Hombres',
    viajesDesplazamiento: vmCtx.CariHubViajesDesplazamiento.buildViajesDesplazamiento({ viaja: 'No' }, ['recibe']),
  };
  return {
    contexto: escortCtx(),
    schemaResuelto: {
      identidad: {
        arquetipo: 'persona_acompanante',
        tipoPerfil: 'persona',
        formularioId: 'adultos_escort',
      },
    },
    camposPublicos: {
      alias: 'Escort QA',
      descripcionCorta: 'Acompañante',
      bloquesPublicos: bloques,
    },
    contactoPublico: {},
  };
}

function simulatePreviewPerfil(vmCtx, bloques, ctx) {
  const RP = vmCtx.CariHubRegistroPublicBlocks;
  let u = { subcategoriaId: ctx.subcategoriaId, alias: bloques.aliasPareja || bloques.alias || '' };
  u = RP.mapToPerfil(u, bloques, ctx);
  if (RP.applySwingerPerfilFields) u = RP.applySwingerPerfilFields(u, bloques);
  return u;
}

const SWINGER_TOP = [
  'objetivosPerfil', 'objetivoPrincipal', 'tipoInteraccion', 'modalidadInteraccion',
  'intercambioSwinger', 'atiendenA', 'aceptanSolteros', 'haceColaboraciones',
  'colaboraCon', 'estiloPareja', 'mostrarObjetivosPerfil', 'mostrarAtiendenA',
  'mostrarColaboraciones', 'swingerPerfil', 'aceptanParejasPrincipiantes', 'experienciaEnLifestyle',
];

let ctx;

try {
  ctx = makeCtx();
  loadParejaStack(ctx);
  const RP = ctx.CariHubRegistroPublicBlocks;
  const Submit = ctx.CariHubRegistroPerfilSubmit;
  const userCtx = swingerCtx();

  ok('load módulos persist', !!(RP && Submit && RP.applySwingerPerfilFields), 'submit + motor');

  const bloques = simulateBloques(ctx, { ...baseShell(), ...swingerDelta() });
  ok('swingerPerfil anidado en bloques', bloques.swingerPerfil && bloques.swingerPerfil.tipoInteraccion.length === 2, JSON.stringify(bloques.swingerPerfil));
  ok('objetivoPrincipal derivado', bloques.objetivoPrincipal === 'Conocer parejas', bloques.objetivoPrincipal);
  ok('viajes en bloques', bloques.viajesDesplazamiento && bloques.viajesDesplazamiento.viaja === true, JSON.stringify(bloques.viajesDesplazamiento));

  const draft = buildSwingerDraft(ctx, bloques);
  const priv = { correoAcceso: 'test@example.com', mayorEdadConfirmado: true };
  const doc = Submit.buildUsuarioDoc('uid_test', draft, priv, {}, {});

  ok('submit tipoPerfil pareja_grupo', doc.tipoPerfil === 'pareja_grupo', doc.tipoPerfil);
  ok('submit parejaGrupoPerfil intacto', doc.parejaGrupoPerfil && doc.parejaGrupoPerfil.configuracionGrupo === 'pareja_hm', JSON.stringify(doc.parejaGrupoPerfil));
  ok('submit parejaGrupo viajes', doc.parejaGrupoPerfil.viajesDesplazamiento && doc.parejaGrupoPerfil.viajesDesplazamiento.viaja === true, JSON.stringify(doc.parejaGrupoPerfil.viajesDesplazamiento));
  ok('submit top-level viajes', doc.viajesDesplazamiento && doc.viajesDesplazamiento.viaja === true, JSON.stringify(doc.viajesDesplazamiento));

  ok('submit swingerPerfil nested', doc.swingerPerfil && doc.swingerPerfil.intercambioSwinger === 'A convenir', JSON.stringify(doc.swingerPerfil));
  ok('submit intercambioSwinger top-level', doc.intercambioSwinger === 'A convenir', doc.intercambioSwinger);
  ok('submit tipoInteraccion top-level', Array.isArray(doc.tipoInteraccion) && doc.tipoInteraccion.length === 2, JSON.stringify(doc.tipoInteraccion));
  ok('submit atiendenA top-level', doc.atiendenA === 'Parejas', doc.atiendenA);
  ok('submit aceptanSolteros top-level', doc.aceptanSolteros === 'A convenir', doc.aceptanSolteros);
  ok('submit colaboraCon top-level', Array.isArray(doc.colaboraCon) && doc.colaboraCon[0] === 'Parejas', JSON.stringify(doc.colaboraCon));
  ok('submit mostrar toggles', doc.mostrarObjetivosPerfil === 'Sí' && doc.mostrarAtiendenA === 'Sí', JSON.stringify({
    mostrarObjetivosPerfil: doc.mostrarObjetivosPerfil,
    mostrarAtiendenA: doc.mostrarAtiendenA,
  }));

  ok('submit todos los campos A2.2', SWINGER_TOP.every((k) => doc[k] != null && doc[k] !== ''), SWINGER_TOP.filter((k) => doc[k] == null || doc[k] === '').join(', '));
  ok('submit aceptanParejasPrincipiantes', doc.aceptanParejasPrincipiantes === 'Sí', doc.aceptanParejasPrincipiantes);
  ok('submit experienciaEnLifestyle', doc.experienciaEnLifestyle === 'Experimentados', doc.experienciaEnLifestyle);

  const preview = simulatePreviewPerfil(ctx, bloques, userCtx);
  ok('preview swingerPerfil', preview.swingerPerfil && preview.swingerPerfil.atiendenA === 'Parejas', JSON.stringify(preview.swingerPerfil));
  ok('preview intercambioSwinger', preview.intercambioSwinger === 'A convenir', preview.intercambioSwinger);
  ok('preview objetivosPerfil', Array.isArray(preview.objetivosPerfil) && preview.objetivosPerfil.length === 2, JSON.stringify(preview.objetivosPerfil));
  ok('preview parejaGrupoPerfil', preview.parejaGrupoPerfil && preview.aliasPareja === 'Pareja Persist', JSON.stringify({
    aliasPareja: preview.aliasPareja,
    configuracionGrupo: preview.configuracionGrupo,
  }));

  const escortDoc = Submit.buildUsuarioDoc('uid_escort', buildEscortDraft(ctx), priv, {}, {});
  ok('escort sin swingerPerfil', escortDoc.swingerPerfil == null, JSON.stringify(escortDoc.swingerPerfil));
  ok('escort sin intercambioSwinger', !escortDoc.intercambioSwinger, escortDoc.intercambioSwinger || 'vacío');
  ok('escort tipoPerfil persona', escortDoc.tipoPerfil === 'persona', escortDoc.tipoPerfil);
  ok('escort atiendoA preservado', escortDoc.atiendoA === 'Hombres', escortDoc.atiendoA);
  ok('escort sin parejaGrupoPerfil', escortDoc.parejaGrupoPerfil == null, 'null');
} catch (e) {
  fail.push({ name: 'exception', detail: e.message });
}

console.log('\n=== QA Pareja Swinger A2.2 Persist ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
