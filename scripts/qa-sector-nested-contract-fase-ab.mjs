/**
 * QA Fase A+B — contrato nested sectorial + colaboración cross-sector.
 * node scripts/qa-sector-nested-contract-fase-ab.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const js = path.join(root, 'public', 'js');
const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

function load(rel, ctx) {
  vm.runInContext(fs.readFileSync(path.join(js, rel), 'utf8'), ctx, { filename: rel });
}

function makeCtx() {
  const ctx = {
    console,
    document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] },
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    Blob: function () {},
    Date, Math, JSON, Object, Array, String, Number, Boolean, RegExp, Promise, Error, parseInt, parseFloat,
    setTimeout, clearTimeout
  };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  return ctx;
}

function loadPublicBlocks(ctx) {
  const dataFiles = [
    'data/registro-sector-policy-runtime.js',
    'data/registro-profesionales-sub-deltas.js',
    'data/registro-profesionales-blocks.js',
    'data/registro-bienestar-sub-deltas.js',
    'data/registro-bienestar-blocks.js',
    'data/registro-eventos-blocks.js',
    'data/registro-gastronomia-blocks.js'
  ];
  dataFiles.forEach((f) => {
    const p = path.join(js, f);
    if (fs.existsSync(p)) load(f, ctx);
  });
  load('carihub-registro-public-blocks.js', ctx);
}

const pubSrc = fs.readFileSync(path.join(js, 'carihub-registro-public-blocks.js'), 'utf8');
ok('PROFILE_NESTED_KEYS incluye bienestarHolisticoPerfil', /bienestarHolisticoPerfil/.test(pubSrc));
ok('PROFILE_NESTED_KEYS incluye profesionalesPerfil', /profesionalesPerfil/.test(pubSrc));
ok('PROFILE_NESTED_KEYS incluye eventosPerfil', /'eventosPerfil'/.test(pubSrc));
ok('PROFILE_NESTED_KEYS incluye gastronomiaPerfil', /'gastronomiaPerfil'/.test(pubSrc));
ok('applyCrossSectorPublicFields definido', /function applyCrossSectorPublicFields/.test(pubSrc));

const cardSrc = fs.readFileSync(path.join(js, 'carihub-resultados-card-contract.js'), 'utf8');
ok('card-contract usa registryApi', /function registryApi/.test(cardSrc));
ok('card-contract sanitizeForeignNested', /sanitizeForeignNested/.test(cardSrc));

const submitSrc = fs.readFileSync(path.join(js, 'registro-perfil-submit.js'), 'utf8');
ok('registryApi en submit', /function registryApi/.test(submitSrc));
ok('buildSectorNestedDocFields en submit', /function buildSectorNestedDocFields/.test(submitSrc));

const registryPath = path.join(js, 'data/registro-sector-contract-registry.js');
ok('registry file existe', fs.existsSync(registryPath));

const ctx = makeCtx();
ctx.CariHubPrivateFieldsLite = { sanitizePrivateForStorage: (p) => p || {} };
load('data/registro-sector-contract-registry.js', ctx);
loadPublicBlocks(ctx);
load('carihub-field-engine-lite.js', ctx);
load('registro-perfil-submit.js', ctx);
load('carihub-resultados-card-contract.js', ctx);

const PB = ctx.CariHubRegistroPublicBlocks;
const Submit = ctx.CariHubRegistroPerfilSubmit;
const Contract = ctx.CariHubResultadosCardContract;
const Registry = ctx.CariHubSectorContractRegistry;

ok('CariHubSectorContractRegistry cargado', !!Registry && !!Registry.SECTOR_CONTRACTS);
ok('registry 4 sectores modernos', Object.keys(Registry.SECTOR_CONTRACTS || {}).length === 4);
ok('registry nested profesionales', Registry.resolveNestedKey('profesionales') === 'profesionalesPerfil');
ok('registry alias gastronomia', Registry.resolveContract('gastronomia').sectorId === 'restaurantes');
ok('registry demoBuilder bienestar', Registry.resolveDemoBuilder('bienestar') === 'plantillaDemoBienestar');
ok('registry allModernNestedKeys', (Registry.allModernNestedProfileKeys() || []).length === 4);

ok('CariHubRegistroPublicBlocks cargado', !!PB && !!PB.mapToPerfil);
ok('CariHubRegistroPerfilSubmit cargado', !!Submit && !!Submit.buildUsuarioDoc);
ok('CariHubResultadosCardContract cargado', !!Contract && !!Contract.sanitizePerfil);

const SECTOR_CASES = [
  {
    key: 'profesionales',
    ctx: { sectorId: 'profesionales', subcategoriaId: 'abogados', formularioId: 'profesionista_cedula' },
    bloques: {
      nombreProfesional: 'Lic. Demo QA',
      tagline: 'Asesoría legal',
      deltaPack: 'A',
      canonSubcategoriaId: 'abogados',
      colaboracionContenido: 'Sí',
      mostrarColaboracionContenidoPublico: 'Sí'
    },
    nestedKey: 'profesionalesPerfil'
  },
  {
    key: 'bienestar',
    ctx: { sectorId: 'bienestar', subcategoriaId: 'reiki', formularioId: 'persona_independiente' },
    bloques: {
      alias: 'Luna Reiki QA',
      tagline: 'Sesiones de reiki',
      deltaPack: 'A',
      canonSubcategoriaId: 'reiki',
      tarifaDesde: '600',
      colaboracionContenido: 'Bajo acuerdo previo',
      mostrarColaboracionContenidoPublico: 'Sí'
    },
    nestedKey: 'bienestarHolisticoPerfil'
  },
  {
    key: 'eventos',
    ctx: { sectorId: 'eventos', subcategoriaId: 'djs-eventos', formularioId: 'persona_independiente' },
    bloques: {
      alias: 'DJ Demo QA',
      tagline: 'Música para eventos',
      deltaPack: 'A',
      canonSubcategoriaId: 'djs-eventos',
      cotizacionDesde: '3500',
      colaboracionContenido: 'Sí',
      mostrarColaboracionContenidoPublico: 'No'
    },
    nestedKey: 'eventosPerfil'
  },
  {
    key: 'gastronomia',
    ctx: { sectorId: 'restaurantes', subcategoriaId: 'restaurantes-tradicional', formularioId: 'negocio_empresa' },
    bloques: {
      nombreComercial: 'Restaurante QA',
      tagline: 'Cocina de autor',
      deltaPack: 'A',
      canonSubcategoriaId: 'restaurantes-tradicional',
      precioDesdeMx: '180',
      colaboracionContenido: 'No'
    },
    nestedKey: 'gastronomiaPerfil'
  }
];

for (const sample of SECTOR_CASES) {
  const mapped = PB.mapToPerfil({}, sample.bloques, sample.ctx);
  ok(`${sample.key} mapToPerfil nested`, !!mapped[sample.nestedKey], sample.nestedKey);
  ok(`${sample.key} mapToPerfil sectorId`, !!mapped.sectorId, mapped.sectorId);
  ok(`${sample.key} colaboracionContenido`, mapped.colaboracionContenido === sample.bloques.colaboracionContenido, mapped.colaboracionContenido);

  const doc = Submit.buildUsuarioDoc('uid-test', {
    camposPublicos: {
      bloquesPublicos: sample.bloques,
      alias: sample.bloques.alias || sample.bloques.nombreProfesional || sample.bloques.nombreComercial || 'QA',
      pais: 'MX', estado: 'NL', ciudad: 'Monterrey', zona: 'Centro'
    },
    contexto: sample.ctx,
    schemaResuelto: { identidad: { formularioId: sample.ctx.formularioId, arquetipo: '', tipoPerfil: '' } },
    contactoPublico: {},
    mensajeContactoPublicidad: ''
  }, { correoAcceso: 'qa@test.com', contrasenaAcceso: 'Test1234!', mayorEdadConfirmado: true }, {}, {});

  ok(`${sample.key} submit nested`, !!doc[sample.nestedKey], sample.nestedKey);
  ok(`${sample.key} submit sectorId`, doc.sectorId === mapped.sectorId, doc.sectorId);
  ok(`${sample.key} submit colaboracion`, doc.colaboracionContenido === sample.bloques.colaboracionContenido, doc.colaboracionContenido);
  const nestedFields = Registry.buildNestedDocFields(Registry.pickNestedPayload(mapped, sample.ctx));
  const foreignKeys = Registry.allModernNestedProfileKeys().filter((k) => k !== sample.nestedKey);
  ok(`${sample.key} doc null nested ajeno`, foreignKeys.every((k) => nestedFields[k] === null));
}

const profMapped = PB.mapToPerfil({}, {
  nombreProfesional: 'Lic. Cross',
  deltaPack: 'A',
  profesionalesPerfil: { deltaPack: 'A', nombreProfesional: 'Lic. Cross' },
  eventosPerfil: { alias: 'leak' },
  gastronomiaPerfil: { nombreComercial: 'leak' },
  bienestarHolisticoPerfil: { alias: 'leak' }
}, { sectorId: 'profesionales', subcategoriaId: 'abogados', formularioId: 'profesionista_cedula' });

ok('anti-contam map profesionales sin eventosPerfil', !profMapped.eventosPerfil);
ok('anti-contam map profesionales sin gastronomiaPerfil', !profMapped.gastronomiaPerfil);
ok('anti-contam map profesionales sin bienestarHolisticoPerfil', !profMapped.bienestarHolisticoPerfil);
ok('anti-contam map profesionales conserva profesionalesPerfil', !!profMapped.profesionalesPerfil);

const dirty = {
  nombre: 'Restaurante X',
  sectorId: 'restaurantes',
  gastronomiaPerfil: { nombreComercial: 'Restaurante X', deltaPack: 'A' },
  profesionalesPerfil: { nombreProfesional: 'leak' },
  eventosPerfil: { alias: 'leak' },
  bienestarHolisticoPerfil: { alias: 'leak' },
  modalidades: ['recibe']
};
Contract.sanitizePerfil(dirty, { sectorId: 'restaurantes', subcategoriaId: 'restaurantes-tradicional' });
ok('sanitize gastronomia quita profesionalesPerfil', !dirty.profesionalesPerfil);
ok('sanitize gastronomia quita eventosPerfil', !dirty.eventosPerfil);
ok('sanitize gastronomia quita bienestarHolisticoPerfil', !dirty.bienestarHolisticoPerfil);
ok('sanitize gastronomia conserva gastronomiaPerfil', !!dirty.gastronomiaPerfil);
ok('sanitize gastronomia quita modalidades adultas', !dirty.modalidades);

console.log('\n=== QA Fase A+B+C sector contract registry ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? `— ${p.detail}` : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nOK — Fase A+B+C contract registry');
