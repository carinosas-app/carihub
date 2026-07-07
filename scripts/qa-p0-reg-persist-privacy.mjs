/**
 * QA P0-REG — persistencia bloquesPublicos, nested sectoriales, PrivacyGuard, blocks cargados.
 * node scripts/qa-p0-reg-persist-privacy.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repo = path.join(__dirname, '..');
const root = path.join(repo, 'public', 'js');

const pass = [];
const fail = [];
function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

function load(rel, ctx) {
  vm.runInContext(fs.readFileSync(path.join(root, rel), 'utf8'), ctx, { filename: rel });
}

function makeCtx() {
  const ctx = {
    console,
    document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] },
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    Blob: function () {},
    Date, Math, JSON, Object, Array, String, Number, Boolean, RegExp, Promise, Error,
    parseInt, parseFloat, setTimeout, clearTimeout
  };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  return ctx;
}

function loadPublicBlocks(ctx) {
  const files = [
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
    'data/registro-bienestar-blocks.js',
    'data/registro-eventos-blocks.js',
    'data/registro-gastronomia-blocks.js',
    'data/registro-salud-blocks.js',
    'data/registro-profesionales-blocks.js',
    'data/registro-hogar-blocks.js',
    'data/registro-comercio-blocks.js',
    'data/registro-automotriz-blocks.js',
    'data/registro-transporte-blocks.js',
    'data/registro-tecnologia-blocks.js',
    'data/registro-educacion-blocks.js',
    'data/registro-industria-blocks.js',
    'data/registro-mascotas-blocks.js',
    'data/registro-bienes-raices-blocks.js',
    'carihub-registro-public-blocks.js',
    'carihub-field-engine-lite.js',
    'data/registro-sector-contract-registry.js',
    'carihub-public-privacy-guard.js',
    'resultados-registrados.js'
  ];
  files.forEach((f) => load(f, ctx));
}

const ctx = makeCtx();
ctx.CariHubPrivateFieldsLite = { sanitizePrivateForStorage: (p) => ({ ...(p || {}) }) };
loadPublicBlocks(ctx);
load('registro-perfil-submit.js', ctx);

const RP = ctx.CariHubRegistroPublicBlocks;
const Submit = ctx.CariHubRegistroPerfilSubmit;
const Reg = ctx.CariHubResultadosRegistrados;
const Guard = ctx.CariHubPublicPrivacyGuard;

ok('pickPersistedNestedProfiles exportado', typeof RP.pickPersistedNestedProfiles === 'function');
ok('PROFILE_NESTED_KEYS exportado', Array.isArray(RP.PROFILE_NESTED_KEYS) && RP.PROFILE_NESTED_KEYS.length >= 20);
ok('PrivacyGuard exportado', typeof Guard.sanitizePerfilPublico === 'function');

// --- Bloque A: persistencia slim ---
const saludCtx = { sectorId: 'salud', subcategoriaId: 'medicos-generales', formularioId: 'profesionista_cedula' };
const saludBloques = {
  nombreProfesional: 'Dra. QA P0',
  tagline: 'Medicina general',
  deltaPack: 'A',
  canonSubcategoriaId: 'medicos-generales',
  especialidad: 'Medicina general',
  precioConsulta: '800',
  colaboracionContenido: 'Sí',
  mostrarColaboracionContenidoPublico: 'Sí'
};
const saludDoc = Submit.buildUsuarioDoc('uid_p0', {
  camposPublicos: {
    bloquesPublicos: saludBloques,
    alias: 'Dra. QA P0',
    pais: 'MX', estado: 'NL', ciudad: 'Monterrey'
  },
  contexto: saludCtx,
  schemaResuelto: { identidad: { arquetipo: '', tipoPerfil: '' } },
  contactoPublico: {}
}, { correoAcceso: 'priv@test.com', telefonoPrivado: '8112345678', mayorEdadConfirmado: true }, {}, {});

const saludSlim = Submit.slimProfileForFirestore(saludDoc);
ok('A1 slim conserva bloquesPublicos', !!saludSlim.camposPublicos?.bloquesPublicos);
ok('A3 slim sin camposPrivados', !saludSlim.camposPrivados);
ok('A4 saludPerfil persistido', !!saludSlim.saludPerfil?.especialidad, saludSlim.saludPerfil?.especialidad);

const dataUrlDoc = Submit.buildUsuarioDoc('uid_dataurl', {
  camposPublicos: {
    bloquesPublicos: { ...saludBloques, fotoExtra: 'data:image/png;base64,abc' },
    alias: 'Test'
  },
  contexto: saludCtx,
  schemaResuelto: { identidad: {} },
  contactoPublico: {}
}, { correoAcceso: 'a@b.com', mayorEdadConfirmado: true }, {}, {});
const dataUrlSlim = Submit.slimProfileForFirestore(dataUrlDoc);
const bloquesSlim = dataUrlSlim.camposPublicos?.bloquesPublicos || {};
ok('A2 snapshot sin data URLs', !bloquesSlim.fotoExtra, JSON.stringify(bloquesSlim));

// Dominatrix
const domDoc = Submit.buildUsuarioDoc('uid_dom', {
  camposPublicos: {
    bloquesPublicos: RP.finalizeDominatrixValues({
      estiloDominacion: 'Sensual',
      deltaPack: 'A',
      canonSubcategoriaId: 'dominatrix'
    }, { subcategoriaId: 'dominatrix', arquetipo: 'persona_dominatrix' }),
    alias: 'Dom QA',
    descripcionCorta: 'Tag'
  },
  contexto: { subcategoriaId: 'dominatrix', arquetipo: 'persona_dominatrix', categoriaPrincipal: 'Adultos' },
  schemaResuelto: { identidad: { arquetipo: 'persona_dominatrix', tipoPerfil: 'persona' } },
  contactoPublico: {}
}, { correoAcceso: 'd@b.com', mayorEdadConfirmado: true }, {}, {});
ok('A6 dominatrixPerfil persistido', !!Submit.slimProfileForFirestore(domDoc).dominatrixPerfil);

// C/H anti-contaminación
const chDoc = Submit.buildUsuarioDoc('uid_ch', {
  camposPublicos: {
    bloquesPublicos: RP.finalizeCuckoldHotwifeValues({
      deltaPack: 'A',
      dinamica: 'hotwife',
      aliasPareja: 'Pareja CH'
    }, { subcategoriaId: 'cuckold_hotwife', arquetipo: 'pareja_grupo' }),
    alias: 'Pareja CH'
  },
  contexto: { subcategoriaId: 'cuckold_hotwife', arquetipo: 'pareja_grupo' },
  schemaResuelto: { identidad: { arquetipo: 'pareja_grupo', tipoPerfil: 'pareja_grupo' } },
  contactoPublico: {}
}, { correoAcceso: 'ch@b.com', mayorEdadConfirmado: true }, {}, {});
const chSlim = Submit.slimProfileForFirestore(chDoc);
ok('A7 C/H swingerPerfil null', chSlim.swingerPerfil == null && chSlim.unicornPerfil == null);

// --- Bloque B: hydrate ---
const mockSalud = { id: 'uid_p0', exists: true, data: () => saludSlim };
const uSalud = Reg.normalizar(mockSalud);
ok('B1 hidratado desde bloques', uSalud.__hydratedFromBloques === true);
ok('B2 salud nested visible', !!uSalud.saludPerfil?.especialidad, uSalud.saludPerfil?.especialidad);
ok('B3 round-trip especialidad', uSalud.saludPerfil?.especialidad === saludSlim.saludPerfil?.especialidad);

const legacyDoc = { uid: 'legacy', nombre: 'Legacy', precio: '$500', aprobado: true };
const uLegacy = Reg.normalizar({ id: 'legacy', exists: true, data: () => legacyDoc });
ok('A8 legacy sin __hydratedFromBloques', !uLegacy.__hydratedFromBloques);
ok('A8 legacy nombre', uLegacy.nombre === 'Legacy');

// --- Bloque C: scripts en registro-perfil.html ---
const regHtml = fs.readFileSync(path.join(repo, 'public', 'registro-perfil.html'), 'utf8');
const SECTOR_SCRIPTS = [
  'registro-salud-blocks.js',
  'registro-profesionales-blocks.js',
  'registro-hogar-blocks.js',
  'registro-comercio-blocks.js',
  'registro-automotriz-blocks.js',
  'registro-transporte-blocks.js',
  'registro-tecnologia-blocks.js',
  'registro-educacion-blocks.js',
  'registro-industria-blocks.js',
  'registro-mascotas-blocks.js',
  'registro-bienes-raices-blocks.js'
];
SECTOR_SCRIPTS.forEach((s) => ok(`C1 registro-perfil incluye ${s}`, regHtml.includes(s)));

const SECTOR_RESOLVE = [
  { sectorId: 'salud', subcategoriaId: 'medicos-generales' },
  { sectorId: 'profesionales', subcategoriaId: 'abogados' },
  { sectorId: 'hogar', subcategoriaId: 'plomeros' },
  { sectorId: 'comercio', subcategoriaId: 'abarrotes' },
  { sectorId: 'automotriz', subcategoriaId: 'talleres-mecanicos' },
  { sectorId: 'transporte', subcategoriaId: 'chofer-privado' },
  { sectorId: 'tecnologia', subcategoriaId: 'programador' },
  { sectorId: 'educacion', subcategoriaId: 'maestro-particular' },
  { sectorId: 'industria', subcategoriaId: 'soldadura-industrial' },
  { sectorId: 'mascotas', subcategoriaId: 'paseador-de-perros' },
  { sectorId: 'bienes-raices', subcategoriaId: 'agente-inmobiliario-independiente' }
];
SECTOR_RESOLVE.forEach((c) => {
  const cfg = RP.resolveConfig(c);
  ok(`C2 resolveConfig ${c.sectorId}`, !!cfg, c.subcategoriaId);
});

// --- Bloque D: PrivacyGuard ---
const privDoc = {
  uid: 'priv_uid',
  nombre: 'Priv Test',
  email: 'secret@test.com',
  telefono: '8111111111',
  datosPrivados: { domicilio: 'Calle 1' },
  verificacion: { ineFrenteURL: 'https://secret/ine.jpg', nombreReal: 'Real Name' },
  contactoPublico: { whatsapp: '5218000000000' },
  saludPerfil: {
    especialidad: 'General',
    cedulaProfesional: '9999999'
  },
  camposPublicos: { bloquesPublicos: saludBloques },
  sectorId: 'salud',
  subcategoriaId: 'medicos-generales',
  aprobado: true
};
const uPriv = Reg.normalizar({ id: 'priv_uid', exists: true, data: () => privDoc });
ok('D1 sin datosPrivados', !uPriv.datosPrivados);
ok('D2 sin verificacion', !uPriv.verificacion);
ok('D3 sin email/telefono', !uPriv.email && !uPriv.telefono);
ok('D4 contactoPublico whatsapp', uPriv.contactoPublico?.whatsapp === '5218000000000');
ok('D5 sin cedulaProfesional nested', !uPriv.saludPerfil?.cedulaProfesional);
const serialized = JSON.stringify(uPriv);
ok('D6 JSON sin rfc/razonSocial/ineFrente', !/ineFrente|"rfc"|razonSocial/.test(serialized));

// perfil-publico carga guard
const perfHtml = fs.readFileSync(path.join(repo, 'public', 'perfil-publico.html'), 'utf8');
ok('perfil-publico carga privacy-guard', perfHtml.includes('carihub-public-privacy-guard.js'));

console.log('\n=== QA P0-REG persist-privacy ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log(`\nTodos los checks pasaron (${pass.length})`);
