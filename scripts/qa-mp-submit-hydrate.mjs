/**
 * QA — MP-SUBMIT-HYDRATE read-path (normalizarPerfilFirestore + cardHTML + vista).
 * node scripts/qa-mp-submit-hydrate.mjs
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
function hasVal(v) {
  if (v == null) return false;
  if (typeof v === 'string') return v.trim() !== '';
  if (typeof v === 'boolean') return true;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'object') return Object.keys(v).length > 0;
  return true;
}

const pass = [];
const fail = [];
function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
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
  'data/registro-sector-contract-registry.js',
  'carihub-public-render-lite.js',
  'carihub-public-privacy-guard.js',
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

function buildDoc(cfg) {
  const bloques = RP[cfg.finalizeFn]({ ...cfg.vals }, cfg.ctx);
  return Submit.buildUsuarioDoc(
    'uid_hydrate_qa',
    {
      contexto: cfg.ctx,
      schemaResuelto: { identidad: { arquetipo: cfg.ctx.arquetipo, tipoPerfil: cfg.ctx.tipoPerfil || 'persona' } },
      camposPublicos: {
        alias: cfg.alias || 'QA Hydrate',
        edad: cfg.edad || 28,
        bloquesPublicos: bloques,
        descripcionCorta: cfg.tagline || 'Tag QA',
        precioDesde: cfg.precio || '999',
        pais: 'México', estado: 'Nuevo León', ciudad: 'Monterrey', zona: 'Centro',
      },
    },
    { correoAcceso: 'qa@ex.com', mayorEdadConfirmado: true },
    { fotoPrincipal: 'https://example.com/f.jpg' },
    {}
  );
}

function readPath(doc) {
  const mock = { id: 'uid_hydrate_qa', exists: true, data: () => doc };
  const u = Reg.normalizar(mock);
  FE.enriquecerPerfilPublico(u, {
    subcategoriaId: u.subcategoriaId,
    categoria: u.categoria || doc.categoria,
    sectorId: doc.sectorId,
  });
  let vista = u.__vista || '';
  if (u.subcategoriaId) {
    const sid = String(u.subcategoriaId).trim().toLowerCase().replace(/_/g, ' ');
    if (sid === 'dominatrix' || sid === 'fetiche' || sid === 'sado') vista = 'dominatrix';
    else if (sid === 'unicorns' || sid === 'unicorn') vista = 'unicorn';
  }
  u.__vistaResolved = vista;
  return u;
}

const CASES = [
  {
    id: 'persona_dominatrix',
    finalizeFn: 'finalizeDominatrixValues',
    ctx: { subcategoriaId: 'dominatrix', arquetipo: 'persona_dominatrix', categoriaPrincipal: 'Adultos', subcategoria: 'Dominatrix', formularioId: 'adultos' },
    cardClass: 'res-card--dominatrix',
    vista: 'dominatrix',
    vals: {
      estiloDominacion: 'Femdom', listaFetiches: ['Bondage'], limitesSesion: 'Sin menores',
      equipamiento: ['Bondage / restricciones'], modalidadSesion: 'Presencial',
      serviciosIncluidos: ['Femdom'], serviciosNoRealizo: ['Menores'], modalidades: ['recibe'],
      metodosPago: ['Efectivo'], horarioDetalle: 'Con cita', sobreMi: 'BDSM QA',
    },
    htmlChecks: ['Femdom', 'Presencial'],
    fieldChecks: ['estiloDominacion', 'modalidadSesion'],
  },
  {
    id: 'persona_creador',
    finalizeFn: 'finalizeCreadorValues',
    ctx: { subcategoriaId: 'contenido', arquetipo: 'persona_creador', categoriaPrincipal: 'Adultos', subcategoria: 'Creador contenido', formularioId: 'adultos' },
    cardClass: 'res-card--creador',
    vista: 'creador',
    vals: {
      tiposContenido: ['Videos'], plataformas: ['OnlyFans'], precioSuscripcion: '$299',
      serviciosIncluidos: ['Contenido exclusivo'], serviciosNoRealizo: ['Encuentros'], horarioDetalle: 'Diario', metodosPago: ['Pago en línea'],
    },
    htmlChecks: ['OnlyFans', 'Videos'],
    fieldChecks: ['plataformas', 'tiposContenido'],
  },
  {
    id: 'persona_espectaculo',
    finalizeFn: 'finalizeEspectaculoValues',
    ctx: { subcategoriaId: 'stripper', arquetipo: 'persona_espectaculo', categoriaPrincipal: 'Adultos', subcategoria: 'Stripper', formularioId: 'adultos' },
    cardClass: 'res-card--stripper',
    vista: 'stripper',
    vals: {
      tipoShow: ['Shows privados'], precioShow: '$1200', horarioMinimo: '30 minutos', modalidades: ['fiestas'],
      desplazamientos: 'Zona local', serviciosIncluidos: ['Shows'], serviciosNoRealizo: ['Sexuales'],
      horarioDetalle: 'Vie-Dom', metodosPago: ['Efectivo'],
    },
    htmlChecks: ['Shows privados'],
    fieldChecks: ['tipoShow', 'precioShow'],
  },
  {
    id: 'negocio_bienestar',
    finalizeFn: 'finalizeBienestarValues',
    ctx: { subcategoriaId: 'spa', arquetipo: 'negocio_bienestar', tipoPerfil: 'negocio', categoriaPrincipal: 'Adultos', subcategoria: 'Spa', formularioId: 'adultos' },
    cardClass: 'res-card--spa',
    vista: 'spa',
    alias: 'Zen Spa',
    vals: {
      nombreComercial: 'Zen Spa', tipoBienestar: 'Spa / centro de bienestar', menuServicios: 'Relajante', precioDesde: '$650',
      amenidades: ['Jacuzzi'], direccion: 'Valle', horarioDetalle: '10-22', metodosPago: ['Tarjeta'], rfc: 'X', razonSocial: 'Y',
    },
    htmlChecks: ['Relajante', 'Jacuzzi'],
    fieldChecks: ['menuServicios', 'amenidades'],
  },
  {
    id: 'negocio_hospedaje',
    finalizeFn: 'finalizeHospedajeValues',
    ctx: { subcategoriaId: 'hotel_motel', arquetipo: 'negocio_hospedaje', tipoPerfil: 'lugar', categoriaPrincipal: 'Adultos', subcategoria: 'Hotel / Motel', formularioId: 'adultos' },
    cardClass: 'res-card--hotel-motel',
    vista: 'hotelMotel',
    alias: 'Motel QA',
    vals: {
      nombreComercial: 'Motel QA', tipoHospedaje: 'Motel', tiposHabitacion: ['Suite jacuzzi'], tarifaHora: '$450',
      tarifaNoche: '$1200', direccion: 'Providencia', horarioDetalle: '24h', reglasEstancia: ['18+'], metodosPago: ['Efectivo'], rfc: 'X', razonSocial: 'Y',
    },
    htmlChecks: ['Suite jacuzzi', 'Motel'],
    fieldChecks: ['tiposHabitacion', 'tipoHospedaje'],
  },
  {
    id: 'negocio_retail',
    finalizeFn: 'finalizeRetailValues',
    ctx: { subcategoriaId: 'sex_shop', arquetipo: 'negocio_retail', tipoPerfil: 'negocio', categoriaPrincipal: 'Adultos', subcategoria: 'Sex shop', formularioId: 'adultos' },
    cardClass: 'res-card--sexshop',
    vista: 'sexShop',
    alias: 'Boutique QA',
    vals: {
      nombreComercial: 'Boutique QA', categoriasProducto: ['Lencería'], precioDesde: '$199', direccion: 'Centro',
      serviciosIncluidos: ['Venta en tienda'], serviciosNoRealizo: ['Menores'], horarioDetalle: '10-20', metodosPago: ['Efectivo'],
      envioDomicilio: 'Sí', tiendaOnline: 'No',
    },
    htmlChecks: ['Lencería'],
    fieldChecks: ['categoriasProducto', 'nombreComercial'],
  },
  {
    id: 'negocio_venue',
    finalizeFn: 'finalizeVenueValues',
    ctx: { subcategoriaId: 'club_sw', arquetipo: 'negocio_venue', tipoPerfil: 'lugar', categoriaPrincipal: 'Adultos', subcategoria: 'Club swinger', formularioId: 'adultos' },
    cardClass: 'res-card--club-sw',
    vista: 'clubSw',
    alias: 'Club QA',
    vals: {
      nombreComercial: 'Club QA', tipoVenue: 'Club Swinger / Lifestyle', precioEntrada: '$500', areasVenue: ['Salón'],
      reglasAcceso: ['18+'], direccion: 'Centro', horarioDetalle: 'Vie-Dom', metodosPago: ['Efectivo'], rfc: 'X', razonSocial: 'Y',
      eventosTematicos: 'Noche parejas', politicaParejasSingles: 'Parejas y singles',
    },
    htmlChecks: ['Cover $500', 'Noche parejas'],
    fieldChecks: ['precioEntrada', 'eventosTematicos'],
  },
  {
    id: 'pareja_grupo',
    finalizeFn: 'finalizeParejaSwingerValues',
    ctx: { subcategoriaId: 'swinger', arquetipo: 'pareja_grupo', tipoPerfil: 'pareja_grupo', categoriaPrincipal: 'Adultos', subcategoria: 'Pareja swinger', formularioId: 'adultos' },
    cardClass: 'res-card--swinger',
    vista: 'pareja',
    alias: 'Pareja QA',
    vals: {
      aliasPareja: 'Pareja QA', configuracionGrupo: 'pareja_hm', objetivosPerfil: ['Conocer parejas'],
      intercambioSwinger: 'Sí', modalidades: ['recibe', 'hotel'], horarioDetalle: 'Fines de semana',
      serviciosIncluidos: ['Social'], metodosPago: ['Efectivo'], miembros: [{ alias: 'A', edad: 30 }, { alias: 'B', edad: 28 }],
    },
    htmlChecks: ['Intercambio: Sí', 'Conocer parejas'],
    fieldChecks: ['intercambioSwinger', 'objetivosPerfil', 'aliasPareja'],
  },
  {
    id: 'persona_lifestyle',
    finalizeFn: 'finalizeUnicornValues',
    ctx: { subcategoriaId: 'unicorns', arquetipo: 'persona_lifestyle', categoriaPrincipal: 'Adultos', subcategoria: 'Unicorns', formularioId: 'adultos' },
    cardClass: 'res-card--unicorn',
    vista: 'unicorn',
    alias: 'Luna U',
    vals: {
      objetivosPerfil: ['Conocer parejas'], tipoUnicornio: 'Mujer', buscoConocer: ['Parejas'],
      finalidadEncuentro: ['Socializar'], estadoPerfil: 'Disponible', serviciosLifestyle: ['Citas'],
      modalidades: ['hotel'], horarioDetalle: 'Vie-Dom', metodosPago: ['Efectivo'], sobreMi: 'Unicorn QA',
    },
    htmlChecks: ['Busco: Parejas', 'Conocer parejas'],
    fieldChecks: ['buscoConocer', 'objetivosPerfil', 'tipoUnicornio'],
  },
];

console.log('\n=== QA MP-SUBMIT-HYDRATE — read-path ===\n');

ok('hydratePerfilFromFirestoreDoc exportado', typeof Reg.hydratePerfilFromFirestoreDoc === 'function', 'API');
ok('enriquecerMetadataFirestore exportado', typeof Reg.enriquecerMetadataFirestore === 'function', 'API');
ok('mapToPerfil disponible en VM', typeof RP.mapToPerfil === 'function', 'blocks');

for (const cfg of CASES) {
  const doc = buildDoc(cfg);
  const slim = Submit.slimProfileForFirestore(doc);
  ok(`${cfg.id} slim conserva bloquesPublicos`, !!slim.camposPublicos?.bloquesPublicos, 'camposPublicos.bloquesPublicos');
  ok(`${cfg.id} slim sin camposPrivados`, !slim.camposPrivados, 'camposPrivados');
  const u = readPath(slim);
  const html = Render.cardHTML(u, { categoria: u.categoria || doc.categoria });
  ok(`${cfg.id} subcategoriaId en u`, u.subcategoriaId === doc.subcategoriaId, u.subcategoriaId);
  ok(`${cfg.id} hidratado desde bloques`, u.__hydratedFromBloques === true, '__hydratedFromBloques');
  ok(`${cfg.id} vista perfil`, u.__vistaResolved === cfg.vista, `${u.__vistaResolved} vs ${cfg.vista}`);
  ok(`${cfg.id} tarjeta especializada`, html.includes(cfg.cardClass), cfg.cardClass);
  for (const f of cfg.fieldChecks) {
    ok(`${cfg.id} campo u.${f}`, hasVal(u[f]), String(u[f]));
  }
  for (const h of cfg.htmlChecks) {
    ok(`${cfg.id} HTML contiene "${h}"`, html.includes(h), h);
  }
}

// Legacy sin bloquesPublicos
const legacyDoc = {
  uid: 'legacy_uid',
  nombre: 'Perfil Legacy',
  categoria: 'Adultos',
  precio: '$500',
  edad: 25,
  ciudad: 'Monterrey',
  descripcion: 'Solo campos planos legacy',
  aprobado: true,
};
const legacyMock = { id: 'legacy_uid', exists: true, data: () => legacyDoc };
const uLegacy = Reg.normalizar(legacyMock);
ok('legacy sin bloquesPublicos — nombre', uLegacy.nombre === 'Perfil Legacy', uLegacy.nombre);
ok('legacy sin bloquesPublicos — precio', uLegacy.precio === '$500', uLegacy.precio);
ok('legacy sin bloquesPublicos — sin estiloDominacion', !hasVal(uLegacy.estiloDominacion), 'ok');
ok('legacy sin bloquesPublicos — sin __hydratedFromBloques', !uLegacy.__hydratedFromBloques, String(uLegacy.__hydratedFromBloques));

// Legacy sector salud — nested saludPerfil sin bloquesPublicos (RES-P0-01)
const saludLegacyDoc = {
  uid: 'salud_legacy_uid',
  nombre: 'Dr. Legacy QA',
  categoria: 'Doctor General',
  subcategoriaId: 'doctor general',
  arquetipo: 'profesional_salud',
  sectorId: 'salud',
  tipoPerfil: 'persona',
  precio: '$800',
  ciudad: 'Monterrey',
  estado: 'Nuevo León',
  pais: 'México',
  descripcion: 'Consulta general sin bloques',
  saludPerfil: {
    especialidad: 'Medicina general',
    precioConsulta: '$800',
    cedulaProfesional: '1234567',
  },
  aprobado: true,
};
const uSaludLegacy = Reg.normalizar({ id: 'salud_legacy_uid', exists: true, data: () => saludLegacyDoc });
ok('salud legacy — sectorId', uSaludLegacy.sectorId === 'salud', uSaludLegacy.sectorId);
ok('salud legacy — subcategoriaId', !!uSaludLegacy.subcategoriaId, uSaludLegacy.subcategoriaId);
ok('salud legacy — saludPerfil nested', hasVal(uSaludLegacy.saludPerfil), 'saludPerfil');
ok('salud legacy — especialidad nested', uSaludLegacy.saludPerfil?.especialidad === 'Medicina general', uSaludLegacy.saludPerfil?.especialidad);
ok('salud legacy — sin __hydratedFromBloques', !uSaludLegacy.__hydratedFromBloques, String(uSaludLegacy.__hydratedFromBloques));
ok('salud legacy — componente resultados', uSaludLegacy.__componenteResultados === 'ResultCardServicio', uSaludLegacy.__componenteResultados);

// Fallback sin mapToPerfil
const ctxNoBlocks = makeCtx();
load('resultados-registrados.js', ctxNoBlocks);
const docWithBloques = buildDoc(CASES[0]);
const baseOnly = ctxNoBlocks.CariHubResultadosRegistrados.baseNormalizadoPerfilFirestore(docWithBloques, 'x');
const fb = ctxNoBlocks.CariHubResultadosRegistrados.hydratePerfilFromFirestoreDoc(docWithBloques, baseOnly);
ok('fallback sin mapToPerfil devuelve base', !hasVal(fb.estiloDominacion) && fb.nombre === baseOnly.nombre, 'sin blocks lib');

const rrJs = fs.readFileSync(path.join(root, 'resultados-registrados.js'), 'utf8');
ok('resultados-registrados invoca hydrate', rrJs.includes('hydratePerfilFromFirestoreDoc'), 'hydrate');
ok('resultados-registrados exporta enriquecerMetadataFirestore', rrJs.includes('enriquecerMetadataFirestore'), 'metadata');
ok('resultados-registrados usa mapToPerfil', rrJs.includes('mapToPerfil'), 'mapToPerfil');

const resHtml = fs.readFileSync(path.join(repo, 'public', 'resultados.html'), 'utf8');
const perfHtml = fs.readFileSync(path.join(repo, 'public', 'perfil-publico.html'), 'utf8');
ok('resultados.html carga registro-public-blocks', resHtml.includes('carihub-registro-public-blocks.js'), 'script');
ok('perfil-publico.html carga registro-public-blocks', perfHtml.includes('carihub-registro-public-blocks.js'), 'script');

console.log('\n=== Resumen ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log(`\nTodos los checks pasaron (${pass.length})`);
