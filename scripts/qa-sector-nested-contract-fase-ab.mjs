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
    'data/registro-gastronomia-blocks.js',
    'data/registro-mascotas-sub-deltas.js',
    'data/registro-mascotas-blocks.js',
    'data/registro-hogar-sub-deltas.js',
    'data/registro-hogar-blocks.js',
    'data/registro-salud-sub-deltas.js',
    'data/registro-salud-blocks.js',
    'data/registro-tecnologia-sub-deltas.js',
    'data/registro-tecnologia-blocks.js',
    'data/registro-automotriz-sub-deltas.js',
    'data/registro-automotriz-blocks.js',
    'data/registro-transporte-sub-deltas.js',
    'data/registro-transporte-blocks.js',
    'data/registro-comercio-sub-deltas.js',
    'data/registro-comercio-blocks.js',
    'data/registro-educacion-sub-deltas.js',
    'data/registro-educacion-blocks.js',
    'data/registro-industria-sub-deltas.js',
    'data/registro-industria-blocks.js',
    'data/registro-bienes-raices-sub-deltas.js',
    'data/registro-bienes-raices-blocks.js'
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
ok('PROFILE_NESTED_KEYS incluye mascotasPerfil', /'mascotasPerfil'/.test(pubSrc));
ok('PROFILE_NESTED_KEYS incluye hogarPerfil', /'hogarPerfil'/.test(pubSrc));
ok('PROFILE_NESTED_KEYS incluye saludPerfil', /'saludPerfil'/.test(pubSrc));
ok('PROFILE_NESTED_KEYS incluye tecnologiaPerfil', /'tecnologiaPerfil'/.test(pubSrc));
ok('PROFILE_NESTED_KEYS incluye automotrizPerfil', /'automotrizPerfil'/.test(pubSrc));
ok('PROFILE_NESTED_KEYS incluye transportePerfil', /'transportePerfil'/.test(pubSrc));
ok('PROFILE_NESTED_KEYS incluye comercioPerfil', /'comercioPerfil'/.test(pubSrc));
ok('PROFILE_NESTED_KEYS incluye educacionPerfil', /'educacionPerfil'/.test(pubSrc));
ok('PROFILE_NESTED_KEYS incluye industriaPerfil', /'industriaPerfil'/.test(pubSrc));
ok('PROFILE_NESTED_KEYS incluye bienesRaicesPerfil', /'bienesRaicesPerfil'/.test(pubSrc));
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
ok('registry 14 sectores modernos', Object.keys(Registry.SECTOR_CONTRACTS || {}).length === 14);
ok('registry nested profesionales', Registry.resolveNestedKey('profesionales') === 'profesionalesPerfil');
ok('registry nested mascotas', Registry.resolveNestedKey('mascotas') === 'mascotasPerfil');
ok('registry nested hogar', Registry.resolveNestedKey('hogar') === 'hogarPerfil');
ok('registry nested salud', Registry.resolveNestedKey('salud') === 'saludPerfil');
ok('registry nested tecnologia', Registry.resolveNestedKey('tecnologia') === 'tecnologiaPerfil');
ok('registry nested automotriz', Registry.resolveNestedKey('automotriz') === 'automotrizPerfil');
ok('registry nested transporte', Registry.resolveNestedKey('transporte') === 'transportePerfil');
ok('registry nested comercio', Registry.resolveNestedKey('comercio') === 'comercioPerfil');
ok('registry nested educacion', Registry.resolveNestedKey('educacion') === 'educacionPerfil');
ok('registry nested industria', Registry.resolveNestedKey('industria') === 'industriaPerfil');
ok('registry nested bienes-raices', Registry.resolveNestedKey('bienes-raices') === 'bienesRaicesPerfil');
ok('registry alias gastronomia', Registry.resolveContract('gastronomia').sectorId === 'restaurantes');
ok('registry demoBuilder bienestar', Registry.resolveDemoBuilder('bienestar') === 'plantillaDemoBienestar');
ok('registry demoBuilder mascotas', Registry.resolveDemoBuilder('mascotas') === 'plantillaDemoMascotas');
ok('registry demoBuilder hogar', Registry.resolveDemoBuilder('hogar') === 'plantillaDemoHogar');
ok('registry demoBuilder salud', Registry.resolveDemoBuilder('salud') === 'plantillaDemoSalud');
ok('registry demoBuilder tecnologia', Registry.resolveDemoBuilder('tecnologia') === 'plantillaDemoTecnologia');
ok('registry demoBuilder automotriz', Registry.resolveDemoBuilder('automotriz') === 'plantillaDemoAutomotriz');
ok('registry demoBuilder transporte', Registry.resolveDemoBuilder('transporte') === 'plantillaDemoTransporte');
ok('registry demoBuilder comercio', Registry.resolveDemoBuilder('comercio') === 'plantillaDemoComercio');
ok('registry demoBuilder educacion', Registry.resolveDemoBuilder('educacion') === 'plantillaDemoEducacion');
ok('registry demoBuilder industria', Registry.resolveDemoBuilder('industria') === 'plantillaDemoIndustria');
ok('registry demoBuilder bienes-raices', Registry.resolveDemoBuilder('bienes-raices') === 'plantillaDemoBienesRaices');
ok('registry allModernNestedKeys', (Registry.allModernNestedProfileKeys() || []).length === 14);

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
  },
  {
    key: 'mascotas',
    ctx: { sectorId: 'mascotas', subcategoriaId: 'paseador-de-perros', formularioId: 'persona_independiente' },
    bloques: {
      alias: 'Paseos Demo QA',
      tagline: 'Paseos con reporte',
      deltaPack: 'A',
      canonSubcategoriaId: 'paseador-de-perros',
      serviciosMascotas: ['Paseo'],
      tarifaDesde: '150',
      colaboracionContenido: 'Sí',
      mostrarColaboracionContenidoPublico: 'Sí'
    },
    nestedKey: 'mascotasPerfil'
  },
  {
    key: 'hogar',
    ctx: { sectorId: 'hogar', subcategoriaId: 'plomeros', formularioId: 'persona_independiente' },
    bloques: {
      alias: 'Plomero Demo QA',
      tagline: 'Plomería con garantía',
      deltaPack: 'A',
      canonSubcategoriaId: 'plomeros',
      serviciosHogar: ['Fugas'],
      tarifaDesde: '300',
      colaboracionContenido: 'Sí',
      mostrarColaboracionContenidoPublico: 'Sí'
    },
    nestedKey: 'hogarPerfil'
  },
  {
    key: 'salud',
    ctx: { sectorId: 'salud', subcategoriaId: 'medicos-generales', formularioId: 'profesionista_cedula' },
    bloques: {
      nombreProfesional: 'Dra. Demo QA',
      tagline: 'Medicina general',
      deltaPack: 'A',
      canonSubcategoriaId: 'medicos-generales',
      especialidad: 'Medicina general',
      serviciosProfesionales: ['Consulta'],
      precioConsulta: '800',
      horarioAtencion: 'Lun–Vie',
      segurosAceptados: 'Particular',
      colaboracionContenido: 'Sí',
      mostrarColaboracionContenidoPublico: 'Sí'
    },
    nestedKey: 'saludPerfil'
  },
  {
    key: 'tecnologia',
    ctx: { sectorId: 'tecnologia', subcategoriaId: 'programador', formularioId: 'persona_independiente' },
    bloques: {
      alias: 'Dev Demo QA',
      tagline: 'Desarrollo web',
      deltaPack: 'A',
      canonSubcategoriaId: 'programador',
      stackTecnologico: ['React'],
      serviciosDesarrollo: ['Web'],
      modalidadServicioTI: 'remoto',
      tarifaDesde: '1200',
      colaboracionContenido: 'Sí',
      mostrarColaboracionContenidoPublico: 'Sí'
    },
    nestedKey: 'tecnologiaPerfil'
  },
  {
    key: 'automotriz',
    ctx: { sectorId: 'automotriz', subcategoriaId: 'talleres-mecanicos', formularioId: 'persona_independiente' },
    bloques: {
      alias: 'Taller Demo QA',
      tagline: 'Mecánica general',
      deltaPack: 'A',
      canonSubcategoriaId: 'talleres-mecanicos',
      serviciosMecanica: ['Afinación'],
      modalidadServicioAuto: 'taller_fijo',
      tarifaDesde: '500',
      colaboracionContenido: 'Sí',
      mostrarColaboracionContenidoPublico: 'Sí'
    },
    nestedKey: 'automotrizPerfil'
  },
  {
    key: 'transporte',
    ctx: { sectorId: 'transporte', subcategoriaId: 'chofer-privado', formularioId: 'persona_independiente' },
    bloques: {
      alias: 'Chofer Demo QA',
      tagline: 'Traslados ejecutivos',
      deltaPack: 'A',
      canonSubcategoriaId: 'chofer-privado',
      serviciosTransportePersonas: ['Traslados'],
      modalidadServicioTransporte: 'metropolitana',
      tarifaDesde: '600',
      colaboracionContenido: 'Sí',
      mostrarColaboracionContenidoPublico: 'Sí'
    },
    nestedKey: 'transportePerfil'
  },
  {
    key: 'comercio',
    ctx: { sectorId: 'comercio', subcategoriaId: 'abarrotes', formularioId: 'persona_independiente' },
    bloques: {
      alias: 'Abarrotes Demo QA',
      tagline: 'Surte diario',
      deltaPack: 'A',
      canonSubcategoriaId: 'abarrotes',
      categoriasProducto: ['Abarrotes'],
      modalidadVentaComercio: 'tienda_fisica',
      tarifaDesde: '25',
      colaboracionContenido: 'Sí',
      mostrarColaboracionContenidoPublico: 'Sí'
    },
    nestedKey: 'comercioPerfil'
  },
  {
    key: 'educacion',
    ctx: { sectorId: 'educacion', subcategoriaId: 'maestro-particular', formularioId: 'persona_independiente' },
    bloques: {
      alias: 'Maestro Demo QA',
      tagline: 'Clases personalizadas',
      deltaPack: 'A',
      canonSubcategoriaId: 'maestro-particular',
      serviciosEducacion: ['Clases particulares'],
      modalidadEducacion: 'hibrido',
      tarifaDesde: '350',
      colaboracionContenido: 'Sí',
      mostrarColaboracionContenidoPublico: 'Sí'
    },
    nestedKey: 'educacionPerfil'
  },
  {
    key: 'industria',
    ctx: { sectorId: 'industria', subcategoriaId: 'consultor-empresarial-independiente', formularioId: 'persona_independiente' },
    bloques: {
      alias: 'Consultor Demo QA',
      tagline: 'Optimización de procesos',
      deltaPack: 'A',
      canonSubcategoriaId: 'consultor-empresarial-independiente',
      serviciosIndustriales: ['Consultoría'],
      modalidadServicioIndustrial: 'mixto',
      tarifaDesde: '1200',
      colaboracionContenido: 'Sí',
      mostrarColaboracionContenidoPublico: 'Sí'
    },
    nestedKey: 'industriaPerfil'
  },
  {
    key: 'bienes-raices',
    ctx: { sectorId: 'bienes-raices', subcategoriaId: 'agente-inmobiliario-independiente', formularioId: 'persona_independiente' },
    bloques: {
      alias: 'Agente Demo QA',
      tagline: 'Venta y renta',
      deltaPack: 'A',
      canonSubcategoriaId: 'agente-inmobiliario-independiente',
      serviciosInmobiliarios: ['Asesoría'],
      modalidadOperacionInmobiliaria: 'venta_y_renta',
      tarifaDesde: 'Consultar',
      colaboracionContenido: 'Sí',
      mostrarColaboracionContenidoPublico: 'Sí'
    },
    nestedKey: 'bienesRaicesPerfil'
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
  bienestarHolisticoPerfil: { alias: 'leak' },
  mascotasPerfil: { alias: 'leak' },
  hogarPerfil: { alias: 'leak' }
}, { sectorId: 'profesionales', subcategoriaId: 'abogados', formularioId: 'profesionista_cedula' });

ok('anti-contam map profesionales sin eventosPerfil', !profMapped.eventosPerfil);
ok('anti-contam map profesionales sin gastronomiaPerfil', !profMapped.gastronomiaPerfil);
ok('anti-contam map profesionales sin bienestarHolisticoPerfil', !profMapped.bienestarHolisticoPerfil);
ok('anti-contam map profesionales sin mascotasPerfil', !profMapped.mascotasPerfil);
ok('anti-contam map profesionales sin hogarPerfil', !profMapped.hogarPerfil);
ok('anti-contam map profesionales conserva profesionalesPerfil', !!profMapped.profesionalesPerfil);

const dirty = {
  nombre: 'Restaurante X',
  sectorId: 'restaurantes',
  gastronomiaPerfil: { nombreComercial: 'Restaurante X', deltaPack: 'A' },
  profesionalesPerfil: { nombreProfesional: 'leak' },
  eventosPerfil: { alias: 'leak' },
  bienestarHolisticoPerfil: { alias: 'leak' },
  mascotasPerfil: { alias: 'leak' },
  hogarPerfil: { alias: 'leak' },
  modalidades: ['recibe']
};
Contract.sanitizePerfil(dirty, { sectorId: 'restaurantes', subcategoriaId: 'restaurantes-tradicional' });
ok('sanitize gastronomia quita profesionalesPerfil', !dirty.profesionalesPerfil);
ok('sanitize gastronomia quita eventosPerfil', !dirty.eventosPerfil);
ok('sanitize gastronomia quita bienestarHolisticoPerfil', !dirty.bienestarHolisticoPerfil);
ok('sanitize gastronomia quita mascotasPerfil', !dirty.mascotasPerfil);
ok('sanitize gastronomia quita hogarPerfil', !dirty.hogarPerfil);
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
