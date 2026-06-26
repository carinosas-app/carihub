/**
 * QA — A4.2 persistencia submit + preview cuckold/hotwife (sin browser).
 * node scripts/qa-cuckold-hotwife-persist.mjs
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
  loadScript('data/registro-adultos-lifestyle-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  ctx.CariHubPrivateFieldsLite = {
    sanitizePrivateForStorage: (priv) => ({ ...(priv || {}) }),
  };
  loadScript('registro-perfil-submit.js', ctx);
}

function chCtx(id = 'cuckold hotwife') {
  return {
    subcategoriaId: id,
    subcategoria: 'Cuckold / Hotwife',
    arquetipo: 'pareja_grupo',
    tipoPerfil: 'pareja_grupo',
    categoriaPrincipal: 'Adultos',
  };
}

function swingerCtx() {
  return { subcategoriaId: 'swinger', subcategoria: 'Swinger', arquetipo: 'pareja_grupo' };
}

function unicornCtx() {
  return { subcategoriaId: 'unicorns', subcategoria: 'Unicorns', arquetipo: 'persona_lifestyle' };
}

function hotwifePersonaCtx() {
  return { subcategoriaId: 'hotwife', subcategoria: 'Hotwife', arquetipo: 'persona_acompanante' };
}

function baseShell() {
  return {
    aliasPareja: 'Pareja CH Persist',
    alias: 'Pareja CH Persist',
    configuracionGrupo: 'pareja_hm',
    miembros: [
      { etiquetaPublica: 'Él', generoPresentacion: 'Hombre', edad: 42 },
      { etiquetaPublica: 'Ella', generoPresentacion: 'Mujer', edad: 39 },
    ],
    reglasAcceso: 'Cita previa',
    modalidades: ['recibe', 'viaja'],
    metodosPago: ['Efectivo'],
    horarioDetalle: 'Vie–Dom',
    sobreMi: 'Pareja lifestyle C/H.',
    alcanceDesplazamiento: 'toda_ciudad',
    viajesProgramados: 'a_convenir',
    gastosTraslado: 'se_acuerda',
    anticipacionViaje: '48h',
  };
}

function chDelta() {
  return {
    dinamica: 'hotwife',
    buscan: ['Bulls', 'Unicorns'],
    tipoExperiencia: ['Encuentros privados', 'Hotel / motel'],
    participacionPareja: 'Solo observa',
    aceptanSolteros: 'Solo hombres',
    aceptanPrincipiantes: 'A convenir',
    experienciaEnLifestyle: 'Experimentados',
    haceColaboraciones: 'Sí',
    colaboraCon: ['Unicorns'],
    mostrarBuscan: 'Sí',
    mostrarParticipacion: 'Sí',
    mostrarColaboraciones: 'Sí',
  };
}

function simulateBloques(vmCtx, values, ctx) {
  const RP = vmCtx.CariHubRegistroPublicBlocks;
  const V = vmCtx.CariHubViajesDesplazamiento;
  let out = { ...values };
  out = RP.finalizeParejaSwingerValues(out, ctx);
  out = RP.finalizeUnicornValues(out, ctx);
  out = RP.finalizeCuckoldHotwifeValues(out, ctx);
  out = RP.finalizeParejaGrupoValues(out);
  out.viajesDesplazamiento = V.buildViajesDesplazamiento(out, out.modalidades || []);
  if (!out.viajesDesplazamiento.viaja) {
    V.viajesFieldIds().forEach((k) => delete out[k]);
  }
  return out;
}

function buildChDraft(bloques, ctx) {
  return {
    contexto: ctx,
    schemaResuelto: {
      identidad: {
        arquetipo: 'pareja_grupo',
        tipoPerfil: 'pareja_grupo',
        formularioId: 'adultos',
      },
    },
    camposPublicos: {
      alias: bloques.aliasPareja,
      aliasPareja: bloques.aliasPareja,
      descripcionCorta: 'Pareja hotwife discreta',
      precioDesde: '2000',
      pais: 'México',
      estado: 'Nuevo León',
      ciudad: 'Monterrey',
      zona: 'San Pedro',
      bloquesPublicos: bloques,
    },
    contactoPublico: {},
    mensajeContactoPublicidad: '',
  };
}

function simulatePreviewPerfil(vmCtx, bloques, ctx) {
  const RP = vmCtx.CariHubRegistroPublicBlocks;
  let u = {
    subcategoriaId: ctx.subcategoriaId,
    alias: bloques.aliasPareja || bloques.alias || '',
    tagline: 'Pareja hotwife discreta',
    ciudad: 'Monterrey',
  };
  u = RP.mapToPerfil(u, bloques, ctx);
  if (RP.applySwingerPerfilFields) u = RP.applySwingerPerfilFields(u, bloques, ctx);
  if (RP.applyCuckoldHotwifePerfilFields) u = RP.applyCuckoldHotwifePerfilFields(u, bloques, ctx);
  if (RP.applyUnicornPerfilFields) u = RP.applyUnicornPerfilFields(u, bloques, ctx);
  if (RP.isCuckoldHotwifeSubcategoria(ctx)) {
    u.tipoPerfil = 'pareja_grupo';
    u.arquetipo = 'pareja_grupo';
    u.subcategoriaId = 'cuckold_hotwife';
    delete u.swingerPerfil;
    delete u.unicornPerfil;
    if (u.aliasPareja) {
      u.nombre = u.aliasPareja;
      u.alias = u.aliasPareja;
    }
  }
  return u;
}

const CH_TOP = [
  'cuckoldHotwifePerfil', 'dinamica', 'dinamicaLabel', 'buscan', 'tipoExperiencia',
  'participacionPareja', 'aceptanSolteros', 'aceptanPrincipiantes', 'experienciaEnLifestyle',
  'haceColaboraciones', 'colaboraCon', 'mostrarBuscan', 'mostrarParticipacion',
  'mostrarColaboraciones', 'badgeHotwife', 'tipoPerfil', 'arquetipo', 'subcategoriaId',
  'parejaGrupoPerfil', 'viajesDesplazamiento',
];

let ctx;

try {
  ctx = makeCtx();
  loadParejaStack(ctx);
  const RP = ctx.CariHubRegistroPublicBlocks;
  const Submit = ctx.CariHubRegistroPublicBlocks && ctx.CariHubRegistroPerfilSubmit;
  const userCtx = chCtx();

  ok('load módulos persist', !!(RP && Submit && RP.applyCuckoldHotwifePerfilFields), 'submit + motor');

  const bloques = simulateBloques(ctx, { ...baseShell(), ...chDelta() }, userCtx);
  ok('cuckoldHotwifePerfil anidado en bloques', bloques.cuckoldHotwifePerfil && bloques.cuckoldHotwifePerfil.dinamica === 'hotwife', JSON.stringify(bloques.cuckoldHotwifePerfil));
  ok('dinamicaLabel en bloques', bloques.dinamicaLabel === 'Hotwife', bloques.dinamicaLabel);
  ok('viajes en bloques', bloques.viajesDesplazamiento && bloques.viajesDesplazamiento.viaja === true, JSON.stringify(bloques.viajesDesplazamiento));
  ok('bloques sin swingerPerfil', !bloques.swingerPerfil, 'no swinger');
  ok('bloques sin unicornPerfil', !bloques.unicornPerfil, 'no unicorn');

  const draft = buildChDraft(bloques, userCtx);
  const priv = { correoAcceso: 'ch@example.com', mayorEdadConfirmado: true };
  const doc = Submit.buildUsuarioDoc('uid_ch', draft, priv, {}, {});

  ok('submit subcategoriaId canon', doc.subcategoriaId === 'cuckold_hotwife', doc.subcategoriaId);
  ok('submit tipoPerfil pareja_grupo', doc.tipoPerfil === 'pareja_grupo', doc.tipoPerfil);
  ok('submit arquetipo pareja_grupo', doc.arquetipo === 'pareja_grupo', doc.arquetipo);
  ok('submit cuckoldHotwifePerfil nested', doc.cuckoldHotwifePerfil && doc.cuckoldHotwifePerfil.dinamica === 'hotwife', JSON.stringify(doc.cuckoldHotwifePerfil));
  ok('submit dinamica top-level', doc.dinamica === 'hotwife', doc.dinamica);
  ok('submit dinamicaLabel top-level', doc.dinamicaLabel === 'Hotwife', doc.dinamicaLabel);
  ok('submit buscan top-level', Array.isArray(doc.buscan) && doc.buscan[0] === 'Bulls', JSON.stringify(doc.buscan));
  ok('submit tipoExperiencia top-level', Array.isArray(doc.tipoExperiencia) && doc.tipoExperiencia.length === 2, JSON.stringify(doc.tipoExperiencia));
  ok('submit participacionPareja top-level', doc.participacionPareja === 'Solo observa', doc.participacionPareja);
  ok('submit aceptanPrincipiantes top-level', doc.aceptanPrincipiantes === 'A convenir', doc.aceptanPrincipiantes);
  ok('submit badgeHotwife', doc.badgeHotwife === true, String(doc.badgeHotwife));
  ok('submit badgeCuckold hotwife only', doc.badgeCuckold !== true, String(doc.badgeCuckold));
  ok('submit sin swingerPerfil', doc.swingerPerfil == null, JSON.stringify(doc.swingerPerfil));
  ok('submit sin unicornPerfil', doc.unicornPerfil == null, JSON.stringify(doc.unicornPerfil));
  ok('submit sin intercambioSwinger', !doc.intercambioSwinger, doc.intercambioSwinger || 'vacío');
  ok('submit parejaGrupoPerfil intacto', doc.parejaGrupoPerfil && doc.parejaGrupoPerfil.configuracionGrupo === 'pareja_hm', JSON.stringify(doc.parejaGrupoPerfil));
  ok('submit top-level viajes', doc.viajesDesplazamiento && doc.viajesDesplazamiento.viaja === true, JSON.stringify(doc.viajesDesplazamiento));

  ok(
    'submit campos A4.2 top-level',
    CH_TOP.every((k) => {
      const v = doc[k];
      if (v == null) return false;
      if (typeof v === 'string') return v !== '';
      if (typeof v === 'boolean') return k.indexOf('badge') < 0 || v === true || k === 'badgeCuckold';
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === 'object') return Object.keys(v).length > 0;
      return true;
    }),
    CH_TOP.filter((k) => {
      const v = doc[k];
      if (v == null) return true;
      if (typeof v === 'string') return v === '';
      if (Array.isArray(v)) return !v.length;
      if (typeof v === 'object') return !Object.keys(v).length;
      if (typeof v === 'boolean' && k === 'badgeCuckold') return false;
      return false;
    }).join(', ')
  );

  const docAmbos = Submit.buildUsuarioDoc('uid_ch2', buildChDraft(
    simulateBloques(ctx, { ...baseShell(), ...chDelta(), dinamica: 'ambos' }, chCtx('cuckold_hotwife')),
    chCtx('cuckold_hotwife')
  ), priv, {}, {});
  ok('badge ambos persist', docAmbos.badgeHotwife === true && docAmbos.badgeCuckold === true, JSON.stringify({
    badgeHotwife: docAmbos.badgeHotwife,
    badgeCuckold: docAmbos.badgeCuckold,
  }));

  const preview = simulatePreviewPerfil(ctx, bloques, userCtx);
  ok('preview cuckoldHotwifePerfil', preview.cuckoldHotwifePerfil && preview.cuckoldHotwifePerfil.buscan.length === 2, JSON.stringify(preview.cuckoldHotwifePerfil));
  ok('preview subcategoriaId canon', preview.subcategoriaId === 'cuckold_hotwife', preview.subcategoriaId);
  ok('preview dinamica', preview.dinamica === 'hotwife', preview.dinamica);
  ok('preview buscan', Array.isArray(preview.buscan) && preview.buscan.indexOf('Bulls') >= 0, JSON.stringify(preview.buscan));
  ok('preview sin swingerPerfil', !preview.swingerPerfil, 'no swinger');
  ok('preview sin unicornPerfil', !preview.unicornPerfil, 'no unicorn');
  ok('preview badgeHotwife', preview.badgeHotwife === true, String(preview.badgeHotwife));
  ok('preview nested mirrors', preview.cuckoldHotwifePerfil.participacionPareja === preview.participacionPareja, 'mirror');

  const swDoc = Submit.buildUsuarioDoc('uid_sw', {
    contexto: swingerCtx(),
    schemaResuelto: { identidad: { arquetipo: 'pareja_grupo', tipoPerfil: 'pareja_grupo' } },
    camposPublicos: {
      alias: 'Pareja Sw',
      aliasPareja: 'Pareja Sw',
      bloquesPublicos: simulateBloques(ctx, {
        ...baseShell(),
        objetivosPerfil: ['Conocer parejas'],
        intercambioSwinger: 'A convenir',
        tipoInteraccion: ['Intercambio swinger'],
        modalidadInteraccion: ['Discreta'],
        atiendenA: 'Parejas',
        haceColaboraciones: 'No',
      }, swingerCtx()),
    },
  }, priv, {}, {});
  ok('swinger sin cuckoldHotwifePerfil', swDoc.cuckoldHotwifePerfil == null, JSON.stringify(swDoc.cuckoldHotwifePerfil));
  ok('swinger con swingerPerfil', swDoc.swingerPerfil && swDoc.swingerPerfil.intercambioSwinger === 'A convenir', 'ok');

  const uniDoc = Submit.buildUsuarioDoc('uid_uni', {
    contexto: unicornCtx(),
    schemaResuelto: { identidad: { arquetipo: 'persona_lifestyle', tipoPerfil: 'persona' } },
    camposPublicos: {
      alias: 'Luna',
      bloquesPublicos: RP.finalizeUnicornValues({
        objetivosPerfil: ['Conocer parejas'],
        tipoUnicornio: 'Mujer',
        buscoConocer: ['Parejas'],
        haceColaboraciones: 'No',
        estadoPerfil: 'Disponible',
        modalidades: ['hotel'],
        metodosPago: ['Efectivo'],
      }, unicornCtx()),
    },
  }, priv, {}, {});
  ok('unicorn sin cuckoldHotwifePerfil', uniDoc.cuckoldHotwifePerfil == null, JSON.stringify(uniDoc.cuckoldHotwifePerfil));

  const hwPersonaBloques = {
    alias: 'Hotwife Solo',
    participacionPareja: 'Participa activamente',
    tipoPublico: 'Singles',
    disponibilidadAgenda: ['Entre semana'],
    tipoExperiencia: ['Encuentros privados'],
    sobreMi: 'Hotwife individual.',
    modalidades: ['recibe'],
    metodosPago: ['Efectivo'],
    serviciosIncluidos: ['Cita'],
    estatura: '1.65',
    peso: '58',
  };
  const hwDoc = Submit.buildUsuarioDoc('uid_hw', {
    contexto: hotwifePersonaCtx(),
    schemaResuelto: { identidad: { arquetipo: 'persona_acompanante', tipoPerfil: 'persona' } },
    camposPublicos: {
      alias: 'Hotwife Solo',
      bloquesPublicos: hwPersonaBloques,
    },
  }, priv, {}, {});
  ok('hotwife persona sin cuckoldHotwifePerfil', hwDoc.cuckoldHotwifePerfil == null, JSON.stringify(hwDoc.cuckoldHotwifePerfil));
  ok('hotwife persona tipoPerfil persona', hwDoc.tipoPerfil === 'persona', hwDoc.tipoPerfil);
  ok('hotwife persona participacion preservada', hwDoc.participacionPareja === 'Participa activamente', hwDoc.participacionPareja);

  const submitJs = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'registro-perfil-submit.js'), 'utf8');
  ok('submit cuckoldHotwifePerfil builder', submitJs.includes('cuckoldHotwifePerfil: cuckoldHotwifePerfil'), 'submit.js');

  const previewJs = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'registro-perfil-preview.js'), 'utf8');
  ok('preview applyCuckoldHotwifePerfilFields', previewJs.includes('applyCuckoldHotwifePerfilFields'), 'preview.js');
  ok('preview vista pareja no unicorn', !previewJs.includes("vistaPerfil = 'cuckold_hotwife'"), 'vista pareja');
  ok('preview canonical subcategoriaId', previewJs.includes("u.subcategoriaId = 'cuckold_hotwife'"), 'canon');
} catch (e) {
  fail.push({ name: 'exception', detail: e.message + (e.stack ? '\n' + e.stack.split('\n')[1] : '') });
}

console.log('\n=== QA Cuckold/Hotwife A4.2 Persist ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
