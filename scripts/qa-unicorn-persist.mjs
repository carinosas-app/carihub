/**
 * QA — A3.2 persistencia submit + preview unicorn (sin browser).
 * node scripts/qa-unicorn-persist.mjs
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

function loadUnicornStack(ctx) {
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

function unicornCtx() {
  return {
    subcategoriaId: 'unicorns',
    subcategoria: 'Unicorns',
    arquetipo: 'persona_lifestyle',
    tipoPerfil: 'persona',
    categoriaPrincipal: 'Adultos',
  };
}

function swingerCtx() {
  return {
    subcategoriaId: 'swinger',
    subcategoria: 'Swinger',
    arquetipo: 'pareja_grupo',
  };
}

function baseUnicorn() {
  return {
    alias: 'Luna U.',
    objetivosPerfil: ['Conocer parejas', 'Viajes'],
    tipoUnicornio: 'Mujer',
    buscoConocer: ['Parejas', 'Mujeres'],
    tipoParejaPreferida: ['Hombre + Mujer'],
    finalidadEncuentro: ['Socializar', 'Citas'],
    estadoPerfil: 'Disponible para encuentros',
    haceColaboraciones: 'Sí',
    colaboraCon: ['Parejas Swinger', 'Hotwife'],
    experiencia: 'Intermedio',
    ambientePreferido: ['Hotel', 'Evento'],
    estilo: 'Discreto',
    serviciosLifestyle: ['Citas con parejas', 'Viajes compartidos'],
    modalidades: ['hotel', 'viaja'],
    metodosPago: ['Efectivo', 'Transferencia'],
    horarioDetalle: 'Vie–Dom 20:00–02:00',
    sobreMi: 'Unicornio lifestyle discreta.',
    idiomas: 'Español, Inglés',
    alcanceDesplazamiento: 'cualquier_ciudad_pais',
    viajesProgramados: 'si',
    gastosTraslado: 'se_acuerda',
    anticipacionViaje: '48h',
    mostrarObjetivosPerfil: 'Sí',
    mostrarColaboraciones: 'Sí',
  };
}

function simulateBloques(vmCtx, values, ctx) {
  const RP = vmCtx.CariHubRegistroPublicBlocks;
  const V = vmCtx.CariHubViajesDesplazamiento;
  let out = { ...values };
  out = RP.finalizeUnicornValues(out, ctx);
  out.viajesDesplazamiento = V.buildViajesDesplazamiento(out, out.modalidades || []);
  if (!out.viajesDesplazamiento.viaja) {
    V.viajesFieldIds().forEach((k) => delete out[k]);
  }
  return out;
}

function buildUnicornDraft(bloques) {
  return {
    contexto: unicornCtx(),
    schemaResuelto: {
      identidad: {
        arquetipo: 'persona_lifestyle',
        tipoPerfil: 'persona',
        formularioId: 'adultos',
      },
    },
    camposPublicos: {
      alias: bloques.alias,
      edad: '28',
      descripcionCorta: 'Unicornio lifestyle discreta',
      precioDesde: '1500',
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

function simulatePreviewPerfil(vmCtx, bloques, ctx) {
  const RP = vmCtx.CariHubRegistroPublicBlocks;
  let u = {
    subcategoriaId: ctx.subcategoriaId,
    alias: bloques.alias || '',
    edad: '28',
    tagline: 'Unicornio lifestyle discreta',
    ciudad: 'Ciudad de México',
  };
  u = RP.mapToPerfil(u, bloques, ctx);
  if (RP.applyUnicornPerfilFields) u = RP.applyUnicornPerfilFields(u, bloques, ctx);
  return u;
}

const UNICORN_TOP = [
  'objetivosPerfil', 'objetivoPrincipal', 'tipoUnicornio', 'buscoConocer', 'estadoPerfil',
  'haceColaboraciones', 'colaboraCon', 'experiencia', 'ambientePreferido', 'estilo',
  'serviciosLifestyle', 'modalidades', 'viajesDesplazamiento', 'metodosPago',
  'mostrarObjetivosPerfil', 'mostrarColaboraciones', 'unicornPerfil', 'badgeUnicorn',
  'tipoPerfil', 'arquetipo', 'horario', 'sobreMi', 'idiomas',
];

let ctx;

try {
  ctx = makeCtx();
  loadUnicornStack(ctx);
  const RP = ctx.CariHubRegistroPublicBlocks;
  const Submit = ctx.CariHubRegistroPerfilSubmit;
  const userCtx = unicornCtx();

  ok('load módulos persist', !!(RP && Submit && RP.applyUnicornPerfilFields), 'submit + motor');

  const bloques = simulateBloques(ctx, baseUnicorn(), userCtx);
  ok('unicornPerfil anidado en bloques', bloques.unicornPerfil && bloques.unicornPerfil.tipoUnicornio === 'Mujer', JSON.stringify(bloques.unicornPerfil));
  ok('objetivoPrincipal derivado', bloques.objetivoPrincipal === 'Conocer parejas', bloques.objetivoPrincipal);
  ok('viajes en bloques', bloques.viajesDesplazamiento && bloques.viajesDesplazamiento.viaja === true, JSON.stringify(bloques.viajesDesplazamiento));
  ok('bloques sin swingerPerfil', !bloques.swingerPerfil, 'no swinger');

  const draft = buildUnicornDraft(bloques);
  const priv = { correoAcceso: 'unicorn@example.com', mayorEdadConfirmado: true };
  const doc = Submit.buildUsuarioDoc('uid_unicorn', draft, priv, {}, {});

  ok('submit tipoPerfil persona', doc.tipoPerfil === 'persona', doc.tipoPerfil);
  ok('submit arquetipo persona_lifestyle', doc.arquetipo === 'persona_lifestyle', doc.arquetipo);
  ok('submit badgeUnicorn', doc.badgeUnicorn === true, String(doc.badgeUnicorn));
  ok('submit unicornPerfil nested', doc.unicornPerfil && doc.unicornPerfil.tipoUnicornio === 'Mujer', JSON.stringify(doc.unicornPerfil));
  ok('submit unicornPerfil tagline', doc.unicornPerfil.tagline === 'Unicornio lifestyle discreta', doc.unicornPerfil.tagline);
  ok('submit unicornPerfil viajes', doc.unicornPerfil.viajesDesplazamiento && doc.unicornPerfil.viajesDesplazamiento.viaja === true, JSON.stringify(doc.unicornPerfil.viajesDesplazamiento));
  ok('submit top-level viajes', doc.viajesDesplazamiento && doc.viajesDesplazamiento.viaja === true, JSON.stringify(doc.viajesDesplazamiento));
  ok('submit tipoUnicornio top-level', doc.tipoUnicornio === 'Mujer', doc.tipoUnicornio);
  ok('submit estadoPerfil top-level', doc.estadoPerfil === 'Disponible para encuentros', doc.estadoPerfil);
  ok('submit buscoConocer top-level', Array.isArray(doc.buscoConocer) && doc.buscoConocer.length === 2, JSON.stringify(doc.buscoConocer));
  ok('submit buscan alias', Array.isArray(doc.buscan) && doc.buscan[0] === 'Parejas', JSON.stringify(doc.buscan));
  ok('submit experiencia top-level', doc.experiencia === 'Intermedio', doc.experiencia);
  ok('submit serviciosLifestyle top-level', Array.isArray(doc.serviciosLifestyle) && doc.serviciosLifestyle.length === 2, JSON.stringify(doc.serviciosLifestyle));
  ok('submit sin swingerPerfil', doc.swingerPerfil == null, JSON.stringify(doc.swingerPerfil));
  ok('submit sin intercambioSwinger', !doc.intercambioSwinger, doc.intercambioSwinger || 'vacío');
  ok('submit sin parejaGrupoPerfil', doc.parejaGrupoPerfil == null, 'null');

  ok(
    'submit todos los campos A3.2',
    UNICORN_TOP.every((k) => {
      const v = doc[k];
      if (v == null) return false;
      if (typeof v === 'string') return v !== '';
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === 'object') return Object.keys(v).length > 0;
      if (typeof v === 'boolean') return v === true;
      return true;
    }),
    UNICORN_TOP.filter((k) => {
      const v = doc[k];
      if (v == null) return true;
      if (typeof v === 'string') return v === '';
      if (Array.isArray(v)) return !v.length;
      if (typeof v === 'object') return !Object.keys(v).length;
      if (typeof v === 'boolean') return v !== true;
      return false;
    }).join(', ')
  );

  const preview = simulatePreviewPerfil(ctx, bloques, userCtx);
  ok('preview unicornPerfil', preview.unicornPerfil && preview.unicornPerfil.estadoPerfil === 'Disponible para encuentros', JSON.stringify(preview.unicornPerfil));
  ok('preview tipoUnicornio', preview.tipoUnicornio === 'Mujer', preview.tipoUnicornio);
  ok('preview objetivosPerfil', Array.isArray(preview.objetivosPerfil) && preview.objetivosPerfil.length === 2, JSON.stringify(preview.objetivosPerfil));
  ok('preview modalidades', Array.isArray(preview.modalidades) && preview.modalidades.indexOf('viaja') >= 0, JSON.stringify(preview.modalidades));
  ok('preview horarioDetalle', preview.horarioDetalle === 'Vie–Dom 20:00–02:00', preview.horarioDetalle);
  ok('preview idiomas', preview.idiomas === 'Español, Inglés', preview.idiomas);
  ok('preview sin swingerPerfil', !preview.swingerPerfil, 'no swinger');
  ok('preview badgeUnicorn', preview.badgeUnicorn === true, String(preview.badgeUnicorn));

  const swingerBloques = RP.finalizeParejaSwingerValues({
    objetivosPerfil: ['Conocer parejas'],
    intercambioSwinger: 'A convenir',
    tipoInteraccion: ['Intercambio swinger'],
    modalidadInteraccion: ['Discreta'],
    atiendenA: 'Parejas',
    haceColaboraciones: 'Sí',
    colaboraCon: ['Parejas'],
    modalidades: ['recibe'],
    metodosPago: ['Efectivo'],
  }, swingerCtx());
  const swDoc = Submit.buildUsuarioDoc('uid_sw', {
    contexto: swingerCtx(),
    schemaResuelto: { identidad: { arquetipo: 'pareja_grupo', tipoPerfil: 'pareja_grupo' } },
    camposPublicos: {
      alias: 'Pareja',
      aliasPareja: 'Pareja',
      bloquesPublicos: swingerBloques,
    },
  }, priv, {}, {});
  ok('swinger sin unicornPerfil', swDoc.unicornPerfil == null, JSON.stringify(swDoc.unicornPerfil));
  ok('swinger con swingerPerfil', swDoc.swingerPerfil && swDoc.swingerPerfil.intercambioSwinger === 'A convenir', 'ok');
} catch (e) {
  fail.push({ name: 'exception', detail: e.message });
}

console.log('\n=== QA Unicorn A3.2 Persist ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
