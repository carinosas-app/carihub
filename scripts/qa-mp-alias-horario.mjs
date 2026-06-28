/**
 * QA — MP-ALIAS-HORARIO submit contract (horarioDetalle ↔ horario).
 * node scripts/qa-mp-alias-horario.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', 'public', 'js');

const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

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

function loadStack(ctx) {
  loadScript('carihub-viajes-desplazamiento.js', ctx);
  [
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
  ].forEach((rel) => loadScript(rel, ctx));
  ctx.CariHubPrivateFieldsLite = {
    sanitizePrivateForStorage: (priv) => ({ ...(priv || {}) }),
  };
  loadScript('registro-perfil-submit.js', ctx);
}

const HORARIO_QA = 'QA-HORARIO-ALIAS-MP';

const CASES = [
  {
    key: 'unicorn',
    finalize: (v, c, RP) => {
      let out = RP.finalizeUnicornValues(v, c);
      out.viajesDesplazamiento = ctx.CariHubViajesDesplazamiento.buildViajesDesplazamiento(out, out.modalidades || []);
      return out;
    },
    ctx: { subcategoriaId: 'unicorns', arquetipo: 'persona_lifestyle', tipoPerfil: 'persona', categoriaPrincipal: 'Adultos' },
    schema: { arquetipo: 'persona_lifestyle', tipoPerfil: 'persona' },
    extra: {
      objetivosPerfil: ['Conocer parejas'],
      tipoUnicornio: 'Mujer',
      buscoConocer: ['Parejas'],
      estadoPerfil: 'Disponible',
      modalidades: ['hotel'],
      metodosPago: ['Efectivo'],
      sobreMi: 'x',
    },
  },
  {
    key: 'pareja',
    finalize: (v, c, RP) => RP.finalizeParejaSwingerValues(RP.finalizeParejaGrupoValues(v), c),
    ctx: { subcategoriaId: 'pareja_sw', arquetipo: 'pareja_grupo', tipoPerfil: 'pareja_grupo', categoriaPrincipal: 'Adultos' },
    schema: { arquetipo: 'pareja_grupo', tipoPerfil: 'pareja_grupo' },
    extra: {
      configuracionGrupo: 'hm',
      miembros: [{ etiquetaPublica: 'A', generoPresentacion: 'H', edad: 30 }],
      objetivosPerfil: ['Conocer parejas'],
      intercambioSwinger: 'A convenir',
      modalidades: ['recibe'],
      metodosPago: ['Efectivo'],
      sobreMi: 'x',
    },
  },
  {
    key: 'persona_acompanante',
    finalize: (v, c, RP) => {
      let out = RP.finalizeParejaGrupoValues(v);
      out = RP.finalizeUnicornValues(out, c);
      out = RP.finalizeCuckoldHotwifeValues(out, c);
      return RP.finalizeParejaSwingerValues(out, c);
    },
    ctx: {
      subcategoriaId: 'escort',
      arquetipo: 'persona_acompanante',
      tipoPerfil: 'persona',
      formularioId: 'adultos',
      categoriaPrincipal: 'Adultos',
    },
    schema: { arquetipo: 'persona_acompanante', tipoPerfil: 'persona' },
    extra: {
      modalidades: ['recibe'],
      serviciosIncluidos: ['Oral'],
      serviciosNoRealizo: ['Menores de edad'],
      metodosPago: ['Efectivo'],
      sobreMi: 'x',
      realizaTrios: 'No',
    },
  },
  {
    key: 'dominatrix',
    finalize: (v, c, RP) => RP.finalizeDominatrixValues(v, c),
    ctx: { subcategoriaId: 'dominatrix', arquetipo: 'persona_dominatrix', tipoPerfil: 'persona', categoriaPrincipal: 'Adultos' },
    schema: { arquetipo: 'persona_dominatrix', tipoPerfil: 'persona' },
    extra: {
      estiloDominacion: 'Femdom',
      limitesSesion: 'x',
      equipamiento: ['Bondage / restricciones'],
      modalidadSesion: 'Presencial',
      modalidades: ['recibe'],
      serviciosIncluidos: ['Femdom / Maledom'],
      serviciosNoRealizo: ['Menores de edad'],
      metodosPago: ['Efectivo'],
      sobreMi: 'x',
    },
  },
  {
    key: 'negocio_venue',
    finalize: (v, c, RP) => RP.finalizeVenueValues(v, c),
    ctx: { subcategoriaId: 'club_sw', arquetipo: 'negocio_venue', tipoPerfil: 'lugar', categoriaPrincipal: 'Adultos' },
    schema: { arquetipo: 'negocio_venue', tipoPerfil: 'lugar' },
    extra: {
      nombreComercial: 'Club QA',
      tipoVenue: 'Club swinger',
      precioEntrada: '500',
      metodosPago: ['Efectivo'],
      sobreMi: 'x',
    },
  },
  {
    key: 'bienestar',
    finalize: (v, c, RP) => RP.finalizeBienestarValues(v, c),
    ctx: { subcategoriaId: 'spa', arquetipo: 'negocio_bienestar', tipoPerfil: 'negocio', categoriaPrincipal: 'Adultos' },
    schema: { arquetipo: 'negocio_bienestar', tipoPerfil: 'negocio' },
    extra: {
      nombreComercial: 'Spa QA',
      tipoBienestar: 'Spa / centro de bienestar',
      menuServicios: 'Masajes',
      precioDesde: '800',
      direccion: 'MTY',
      metodosPago: ['Efectivo'],
      sobreMi: 'x',
    },
  },
  {
    key: 'hospedaje',
    finalize: (v, c, RP) => RP.finalizeHospedajeValues(v, c),
    ctx: { subcategoriaId: 'hotel', arquetipo: 'negocio_hospedaje', tipoPerfil: 'negocio', categoriaPrincipal: 'Adultos' },
    schema: { arquetipo: 'negocio_hospedaje', tipoPerfil: 'negocio' },
    extra: {
      nombreComercial: 'Hotel QA',
      tipoHospedaje: 'Hotel',
      precioDesde: '1200',
      direccion: 'MTY',
      metodosPago: ['Tarjeta'],
      sobreMi: 'x',
    },
  },
  {
    key: 'retail',
    finalize: (v, c, RP) => RP.finalizeRetailValues(v, c),
    ctx: { subcategoriaId: 'sex_shop', arquetipo: 'negocio_retail', tipoPerfil: 'negocio', categoriaPrincipal: 'Adultos' },
    schema: { arquetipo: 'negocio_retail', tipoPerfil: 'negocio' },
    extra: {
      nombreComercial: 'Shop QA',
      categoriasProducto: 'Juguetes',
      precioDesde: '200',
      direccion: 'MTY',
      metodosPago: ['Efectivo'],
      sobreMi: 'x',
    },
  },
  {
    key: 'espectaculo',
    finalize: (v, c, RP) => RP.finalizeEspectaculoValues(v, c),
    ctx: { subcategoriaId: 'stripper', arquetipo: 'persona_espectaculo', tipoPerfil: 'persona', categoriaPrincipal: 'Adultos' },
    schema: { arquetipo: 'persona_espectaculo', tipoPerfil: 'persona' },
    extra: {
      nombreArtistico: 'Star QA',
      tipoShow: 'Strip',
      horarioMinimo: 'Por canción',
      modalidades: ['recibe'],
      metodosPago: ['Efectivo'],
      sobreMi: 'x',
    },
  },
  {
    key: 'creador',
    finalize: (v, c, RP) => RP.finalizeCreadorValues(v, c),
    ctx: { subcategoriaId: 'onlyfans', arquetipo: 'persona_creador', tipoPerfil: 'persona', categoriaPrincipal: 'Adultos' },
    schema: { arquetipo: 'persona_creador', tipoPerfil: 'persona' },
    extra: {
      aliasCreador: 'Creator QA',
      plataformas: ['OnlyFans'],
      tipoContenido: ['Fotos'],
      metodosPago: ['Transferencia'],
      sobreMi: 'x',
    },
  },
];

function buildDraft(bloques, userCtx, schema) {
  return {
    contexto: userCtx,
    schemaResuelto: { identidad: schema },
    camposPublicos: {
      alias: 'QA',
      descripcionCorta: 'tag',
      precioDesde: '100',
      bloquesPublicos: bloques,
    },
    contactoPublico: {},
  };
}

const ctx = makeCtx();
loadStack(ctx);
const RP = ctx.CariHubRegistroPublicBlocks;
const Submit = ctx.CariHubRegistroPerfilSubmit;

ok('load submit + blocks', !!(RP && Submit && Submit.buildUsuarioDoc), 'modules');

const submitJs = fs.readFileSync(path.join(root, 'registro-perfil-submit.js'), 'utf8');
ok('submit horario fallback horarioDetalle', submitJs.includes('mappedBloques.horarioDetalle || cp.horarioPublico'), 'horario line');
ok('submit persist horarioDetalle top-level', submitJs.includes('horarioDetalle: mappedBloques.horarioDetalle || mappedBloques.horario'), 'horarioDetalle line');

for (const c of CASES) {
  const bloques = c.finalize({ ...c.extra, horarioDetalle: HORARIO_QA }, c.ctx, RP);
  const doc = Submit.buildUsuarioDoc(
    'uid_alias_qa',
    buildDraft(bloques, c.ctx, c.schema),
    { correoAcceso: 'qa@ex.com', mayorEdadConfirmado: true },
    {},
    {}
  );

  ok(`${c.key} submit horario`, doc.horario === HORARIO_QA, doc.horario || '(vacío)');
  ok(`${c.key} submit horarioDetalle`, doc.horarioDetalle === HORARIO_QA, doc.horarioDetalle || '(vacío)');
  ok(`${c.key} alias simétrico`, doc.horario === doc.horarioDetalle, `${doc.horario} vs ${doc.horarioDetalle}`);
}

const legacyDoc = Submit.buildUsuarioDoc(
  'uid_legacy',
  {
    contexto: { subcategoriaId: 'escort', arquetipo: 'persona_acompanante', tipoPerfil: 'persona', categoriaPrincipal: 'Adultos' },
    schemaResuelto: { identidad: { arquetipo: 'persona_acompanante', tipoPerfil: 'persona' } },
    camposPublicos: {
      alias: 'Legacy',
      horarioPublico: 'Legacy horario publico',
      bloquesPublicos: {
        modalidades: ['recibe'],
        serviciosIncluidos: ['Oral'],
        serviciosNoRealizo: ['Menores de edad'],
        metodosPago: ['Efectivo'],
        sobreMi: 'x',
        realizaTrios: 'No',
      },
    },
  },
  { correoAcceso: 'legacy@ex.com', mayorEdadConfirmado: true },
  {},
  {}
);
ok('legacy horarioPublico fallback', legacyDoc.horario === 'Legacy horario publico', legacyDoc.horario);
ok('legacy horarioDetalle sin bloques alias', legacyDoc.horarioDetalle === '', legacyDoc.horarioDetalle || '(vacío)');
ok('legacy doc sigue usable', legacyDoc.horario !== '' && legacyDoc.alias === 'Legacy', legacyDoc.horario);

console.log('\n=== QA MP-ALIAS-HORARIO ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
