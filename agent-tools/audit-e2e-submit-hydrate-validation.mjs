/**
 * Validación E2E — Submit → Firestore read → Resultados / Perfil Público
 * Confirma si MP-SUBMIT-HYDRATE es necesario (evidencia, no commitear).
 * node agent-tools/audit-e2e-submit-hydrate-validation.mjs
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
function makeCtx(extra) {
  const ctx = {
    console,
    document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] },
    ...(extra || {}),
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
function pct(n, d) {
  return d ? Math.round((n / d) * 100) : 0;
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

/** Campos que aplicarPerfilResultadosEnDemo NO copia (evidencia estática perfil-publico.html L7413+) */
const NOT_MERGED_PERFIL = new Set([
  'dominatrixPerfil', 'estiloDominacion', 'especialidadBdsm', 'experienciaBdsm', 'espacioSesion',
  'equipamiento', 'protocolo', 'limitesSesion', 'dressCodeCliente', 'listaFetiches', 'modalidadSesion',
  'espectaculoPerfil', 'tipoShow', 'precioShow', 'horarioMinimo', 'desplazamientos', 'vestuarioShow',
  'creadorPerfil', 'tiposContenido', 'plataformas', 'precioSuscripcion', 'redesSociales', 'paquetesContenido',
  'retailPerfil', 'categoriasProducto', 'envioDomicilio', 'tiendaOnline', 'nombreComercial',
  'venuePerfil', 'tipoVenue', 'precioEntrada', 'cartelera', 'eventosTematicos', 'politicaParejasSingles',
  'nivelPrivacidad', 'horariosFunciones', 'clasificacion', 'areasVenue', 'dressCode',
  'bienestarPerfil', 'tipoBienestar', 'menuServicios', 'amenidades',
  'hospedajePerfil', 'tipoHospedaje', 'tiposHabitacion', 'tarifaHora', 'tarifaNoche', 'reglasEstancia',
  'estacionamiento', 'privacidadDiscrecion', 'mostrarDireccionExacta',
  'unicornPerfil', 'tipoUnicornio', 'tipoParejaPreferida', 'finalidadEncuentro', 'estadoPerfil',
  'experiencia', 'ambientePreferido', 'estilo', 'serviciosLifestyle', 'badgeUnicorn',
]);

function detectCardRoute(u) {
  const html = Render.cardHTML(u, { categoria: u.categoria || u.categoriaPublica });
  if (html.includes('res-card--unicorn')) return 'cardHTMLUnicorn';
  if (html.includes('res-card--cuckold') || html.includes('res-card--hotwife')) return 'cardHTMLCuckoldHotwife';
  if (html.includes('res-card--pareja-sw')) return 'cardHTMLParejaSwinger';
  if (html.includes('res-card--pareja')) return 'cardHTMLPareja';
  if (html.includes('res-card--stripper')) return 'cardHTMLStripper';
  if (html.includes('res-card--tabledance')) return 'cardHTMLTableDance';
  if (html.includes('res-card--creador')) return 'cardHTMLCreador';
  if (html.includes('res-card--clubsw')) return 'cardHTMLClubSw';
  if (html.includes('res-card--cabinas')) return 'cardHTMLCabinas';
  if (html.includes('res-card--cinexxx')) return 'cardHTMLCineXxx';
  if (html.includes('res-card--antrolgbt')) return 'cardHTMLAntroLgbt';
  if (html.includes('res-card--antro')) return 'cardHTMLAntro';
  if (html.includes('res-card--spa')) return 'cardHTMLSpa';
  if (html.includes('res-card--masajes')) return 'cardHTMLMasajesLocal';
  if (html.includes('res-card--hotelmotel')) return 'cardHTMLHotelMotel';
  if (html.includes('res-card--sexshop')) return 'cardHTMLSexShop';
  if (html.includes('res-card--dominatrix')) return 'cardHTMLDominatrix';
  if (html.includes('res-card--negocio')) return 'cardHTMLNegocio';
  return 'cardHTMLAdultos';
}

function buildDoc(cfg) {
  const userCtx = cfg.ctx;
  const bloques = RP[cfg.finalizeFn]({ ...cfg.vals }, userCtx);
  return Submit.buildUsuarioDoc(
    'uid_e2e',
    {
      contexto: userCtx,
      schemaResuelto: { identidad: { arquetipo: userCtx.arquetipo, tipoPerfil: userCtx.tipoPerfil || 'persona' } },
      camposPublicos: {
        alias: cfg.alias || 'QA E2E',
        edad: cfg.edad || 28,
        bloquesPublicos: bloques,
        descripcionCorta: cfg.tagline || 'Tag E2E',
        precioDesde: cfg.precio || '999',
        pais: 'México',
        estado: 'Nuevo León',
        ciudad: 'Monterrey',
        zona: 'Centro',
      },
    },
    { correoAcceso: 'e2e@ex.com', mayorEdadConfirmado: true },
    { fotoPrincipal: 'https://example.com/f.jpg' },
    {}
  );
}

function readPath(doc) {
  const mock = { id: 'uid_e2e', exists: true, data: () => doc };
  const u = Reg.normalizar(mock);
  FE.enriquecerPerfilPublico(u, { categoria: u.categoria || doc.subcategoria || doc.categoria });
  return u;
}

function perfilFieldAnalysis(doc, uRead, criticalFields) {
  let wouldMerge = 0;
  let blockedMerge = 0;
  let inDocLostByNormalizar = 0;
  const lostOnRead = [];
  const blockedOnPerfil = [];
  for (const [field, nested] of criticalFields) {
    const key = nested || field;
    const inDoc =
      (nested && doc[nested] && hasVal(doc[nested])) ||
      hasVal(doc[field]) ||
      (doc.camposPublicos?.bloquesPublicos && hasVal(doc.camposPublicos.bloquesPublicos[field]));
    const onU = fieldPresent(uRead, field, nested);
    if (inDoc && !onU) {
      inDocLostByNormalizar++;
      lostOnRead.push(key);
    }
    if (onU && !NOT_MERGED_PERFIL.has(field)) wouldMerge++;
    else if (onU && NOT_MERGED_PERFIL.has(field)) blockedMerge++;
    else if (inDoc && NOT_MERGED_PERFIL.has(field)) blockedOnPerfil.push(key);
  }
  FE.enriquecerPerfilPublico(uRead, {
    subcategoriaId: uRead.subcategoriaId,
    categoria: uRead.categoria || uRead.categoriaPublica || doc.categoria,
    sectorId: uRead.sectorId || doc.sectorId,
  });
  return {
    vistaPerfil: uRead.__vista || 'adult',
    inDocLostByNormalizar,
    lostOnRead,
    blockedOnPerfil,
    wouldMerge,
  };
}

function hydratePath(doc, ctxCfg) {
  const bp = doc.camposPublicos && doc.camposPublicos.bloquesPublicos;
  if (!bp) return null;
  const u = RP.mapToPerfil(
    {
      subcategoriaId: doc.subcategoriaId,
      alias: doc.alias || doc.nombre,
      edad: doc.edad,
      ciudad: doc.ciudad,
      estado: doc.estado,
      pais: doc.pais,
      zona: doc.zona,
      categoria: doc.categoria,
      fotoURL: doc.fotoURL,
    },
    bp,
    ctxCfg
  );
  FE.enriquecerPerfilPublico(u, {
    subcategoriaId: doc.subcategoriaId,
    categoria: doc.categoria || doc.subcategoria,
  });
  return u;
}

function fieldPresent(u, field, nested) {
  if (nested && u[nested] && hasVal(u[nested][field])) return true;
  return hasVal(u[field]);
}

function classifyArchetype(report) {
  const readCardOk = report.expectedCard === report.readCard;
  const readFields = pct(report.readFieldsOk, report.criticalFields.length);
  const hydratedFields = pct(report.hydratedFieldsOk, report.criticalFields.length);
  const bloquesInDoc = report.bloquesInDoc;

  if (!bloquesInDoc) return { level: 'Bloqueador', reason: 'bloquesPublicos no persistido' };
  if (readFields === 100 && readCardOk) return { level: 'Diseño intencional', reason: 'lectura actual muestra todos los campos críticos' };
  if (hydratedFields >= 85 && readFields < 50) {
    return {
      level: 'Bloqueador',
      reason: `pérdida funcional en lectura (${readFields}% campos, tarjeta=${report.readCard}); mapToPerfil recupera ${hydratedFields}%`,
    };
  }
  if (hydratedFields >= 85 && readFields < 100) {
    return {
      level: 'Importante',
      reason: `pérdida parcial lectura (${readFields}%); rehidratación recupera ${hydratedFields}%`,
    };
  }
  if (readFields < 30) return { level: 'Bloqueador', reason: `pérdida severa lectura (${readFields}%)` };
  return { level: 'Importante', reason: `pérdida parcial lectura (${readFields}%)` };
}

const CASES = [
  {
    label: 'persona_dominatrix',
    ctx: { subcategoriaId: 'dominatrix', arquetipo: 'persona_dominatrix', categoriaPrincipal: 'Adultos', subcategoria: 'Dominatrix', formularioId: 'adultos' },
    finalizeFn: 'finalizeDominatrixValues',
    expectedCard: 'cardHTMLDominatrix',
    expectedVista: 'dominatrix',
    vals: {
      estiloDominacion: 'Femdom', experienciaBdsm: '5+ años', listaFetiches: ['Bondage'], limitesSesion: 'Sin menores',
      equipamiento: ['Bondage / restricciones'], protocolo: ['SSC'], rolesAtendidos: ['Sumisos'], modalidadSesion: 'Presencial',
      espacioSesion: 'Dungeon', serviciosIncluidos: ['Femdom'], serviciosNoRealizo: ['Menores'], modalidades: ['recibe'],
      metodosPago: ['Efectivo'], horarioDetalle: 'Con cita', sobreMi: 'BDSM QA', idiomas: 'Español',
    },
    criticalFields: [
      ['estiloDominacion'], ['especialidadBdsm'], ['limitesSesion'], ['equipamiento'], ['dominatrixPerfil', 'dominatrixPerfil'],
      ['modalidadSesion'], ['listaFetiches'],
    ],
  },
  {
    label: 'persona_creador',
    ctx: { subcategoriaId: 'contenido', arquetipo: 'persona_creador', categoriaPrincipal: 'Adultos', subcategoria: 'Creador contenido', formularioId: 'adultos' },
    finalizeFn: 'finalizeCreadorValues',
    expectedCard: 'cardHTMLCreador',
    expectedVista: 'creador',
    vals: {
      tiposContenido: ['Videos'], plataformas: ['OnlyFans'], precioSuscripcion: '$299', redesSociales: 'https://onlyfans.com/x',
      serviciosIncluidos: ['Contenido exclusivo'], serviciosNoRealizo: ['Encuentros'], horarioDetalle: 'Diario', metodosPago: ['Pago en línea'],
    },
    criticalFields: [
      ['tiposContenido'], ['plataformas'], ['precioSuscripcion'], ['redesSociales'], ['creadorPerfil', 'creadorPerfil'],
    ],
  },
  {
    label: 'persona_espectaculo',
    ctx: { subcategoriaId: 'stripper', arquetipo: 'persona_espectaculo', categoriaPrincipal: 'Adultos', subcategoria: 'Stripper', formularioId: 'adultos' },
    finalizeFn: 'finalizeEspectaculoValues',
    expectedCard: 'cardHTMLEspectaculo',
    expectedVista: 'stripper',
    vals: {
      tipoShow: ['Shows privados'], precioShow: '$1200', horarioMinimo: '30 minutos', modalidades: ['fiestas'],
      desplazamientos: 'Zona local', serviciosIncluidos: ['Shows'], serviciosNoRealizo: ['Sexuales'],
      horarioDetalle: 'Vie-Dom', metodosPago: ['Efectivo'], anosExperiencia: '3–5 años',
    },
    criticalFields: [
      ['tipoShow'], ['precioShow'], ['horarioMinimo'], ['desplazamientos'], ['espectaculoPerfil', 'espectaculoPerfil'],
    ],
  },
  {
    label: 'negocio_bienestar',
    ctx: { subcategoriaId: 'spa', arquetipo: 'negocio_bienestar', tipoPerfil: 'negocio', categoriaPrincipal: 'Adultos', subcategoria: 'Spa', formularioId: 'adultos' },
    finalizeFn: 'finalizeBienestarValues',
    expectedCard: 'cardHTMLBienestar',
    expectedVista: 'spa',
    alias: 'Zen Spa',
    vals: {
      nombreComercial: 'Zen Spa', tipoBienestar: 'Spa / centro de bienestar', menuServicios: 'Relajante', precioDesde: '$650',
      amenidades: ['Jacuzzi'], direccion: 'Valle', horarioDetalle: '10-22', metodosPago: ['Tarjeta'], rfc: 'X', razonSocial: 'Y',
    },
    criticalFields: [
      ['nombreComercial'], ['menuServicios'], ['amenidades'], ['tipoBienestar'], ['bienestarPerfil', 'bienestarPerfil'],
    ],
  },
  {
    label: 'negocio_hospedaje',
    ctx: { subcategoriaId: 'hotel_motel', arquetipo: 'negocio_hospedaje', tipoPerfil: 'lugar', categoriaPrincipal: 'Adultos', subcategoria: 'Hotel / Motel', formularioId: 'adultos' },
    finalizeFn: 'finalizeHospedajeValues',
    expectedCard: 'cardHTMLHospedaje',
    expectedVista: 'hotelMotel',
    alias: 'Motel QA',
    vals: {
      nombreComercial: 'Motel QA', tipoHospedaje: 'Motel', tiposHabitacion: ['Suite jacuzzi'], tarifaHora: '$450',
      tarifaNoche: '$1200', direccion: 'Providencia', horarioDetalle: '24h', reglasEstancia: ['18+'], metodosPago: ['Efectivo'], rfc: 'X', razonSocial: 'Y',
    },
    criticalFields: [
      ['tarifaHora'], ['tiposHabitacion'], ['tipoHospedaje'], ['hospedajePerfil', 'hospedajePerfil'],
    ],
  },
  {
    label: 'negocio_retail',
    ctx: { subcategoriaId: 'sex_shop', arquetipo: 'negocio_retail', tipoPerfil: 'negocio', categoriaPrincipal: 'Adultos', subcategoria: 'Sex shop', formularioId: 'adultos' },
    finalizeFn: 'finalizeRetailValues',
    expectedCard: 'cardHTMLRetail',
    expectedVista: 'sexShop',
    alias: 'Boutique QA',
    vals: {
      nombreComercial: 'Boutique QA', categoriasProducto: ['Lencería'], precioDesde: '$199', direccion: 'Centro',
      serviciosIncluidos: ['Venta en tienda'], serviciosNoRealizo: ['Menores'], horarioDetalle: '10-20', metodosPago: ['Efectivo'],
      envioDomicilio: 'Sí', tiendaOnline: 'No',
    },
    criticalFields: [
      ['categoriasProducto'], ['envioDomicilio'], ['nombreComercial'], ['retailPerfil', 'retailPerfil'],
    ],
  },
  {
    label: 'negocio_venue',
    ctx: { subcategoriaId: 'club_sw', arquetipo: 'negocio_venue', tipoPerfil: 'lugar', categoriaPrincipal: 'Adultos', subcategoria: 'Club swinger', formularioId: 'adultos' },
    finalizeFn: 'finalizeVenueValues',
    expectedCard: 'cardHTMLClubSw',
    expectedVista: 'clubSw',
    alias: 'Club QA',
    vals: {
      nombreComercial: 'Club QA', tipoVenue: 'Club Swinger / Lifestyle', precioEntrada: '$500', areasVenue: ['Salón'],
      reglasAcceso: ['18+'], direccion: 'Centro', horarioDetalle: 'Vie-Dom', metodosPago: ['Efectivo'], rfc: 'X', razonSocial: 'Y',
      eventosTematicos: 'Noche parejas', politicaParejasSingles: 'Parejas y singles',
    },
    criticalFields: [
      ['eventosTematicos'], ['politicaParejasSingles'], ['precioEntrada'], ['venuePerfil', 'venuePerfil'], ['badgeSwinger'],
    ],
  },
  {
    label: 'pareja_grupo',
    ctx: { subcategoriaId: 'swinger', arquetipo: 'pareja_grupo', tipoPerfil: 'pareja_grupo', categoriaPrincipal: 'Adultos', subcategoria: 'Pareja swinger', formularioId: 'adultos' },
    finalizeFn: 'finalizeParejaSwingerValues',
    expectedCard: 'cardHTMLParejaSwinger',
    expectedVista: 'pareja',
    alias: 'Pareja QA',
    vals: {
      aliasPareja: 'Pareja QA', configuracionGrupo: 'pareja_hm', objetivosPerfil: ['Conocer parejas'],
      intercambioSwinger: 'Sí', modalidades: ['recibe', 'hotel'], horarioDetalle: 'Fines de semana',
      serviciosIncluidos: ['Social'], metodosPago: ['Efectivo'], miembros: [{ alias: 'A', edad: 30 }, { alias: 'B', edad: 28 }],
    },
    criticalFields: [
      ['swingerPerfil', 'swingerPerfil'], ['objetivosPerfil'], ['intercambioSwinger'], ['aliasPareja'], ['miembros'],
    ],
  },
  {
    label: 'persona_lifestyle',
    ctx: { subcategoriaId: 'unicorns', arquetipo: 'persona_lifestyle', categoriaPrincipal: 'Adultos', subcategoria: 'Unicorns', formularioId: 'adultos' },
    finalizeFn: 'finalizeUnicornValues',
    expectedCard: 'cardHTMLUnicorn',
    expectedVista: 'unicorn',
    alias: 'Luna U',
    vals: {
      objetivosPerfil: ['Conocer parejas'], tipoUnicornio: 'Mujer', buscoConocer: ['Parejas'], tipoParejaPreferida: ['H+M'],
      finalidadEncuentro: ['Socializar'], estadoPerfil: 'Disponible', experiencia: 'Intermedio', serviciosLifestyle: ['Citas'],
      modalidades: ['hotel'], horarioDetalle: 'Vie-Dom', metodosPago: ['Efectivo'], sobreMi: 'Unicorn QA',
    },
    criticalFields: [
      ['buscoConocer'], ['tipoUnicornio'], ['objetivosPerfil'], ['unicornPerfil', 'unicornPerfil'], ['serviciosLifestyle'], ['estadoPerfil'],
    ],
  },
];

console.log('=== Validación E2E — Submit → Lectura → Resultados / Perfil ===\n');
console.log('mapToPerfil en lectura producción:', 'NO (solo normalizarPerfilFirestore)');
console.log('bloquesPublicos en doc submit:', 'SÍ (camposPublicos.bloquesPublicos)\n');

const summary = [];

for (const cfg of CASES) {
  const doc = buildDoc(cfg);
  const uRead = readPath(doc);
  const uHydr = hydratePath(doc, cfg.ctx);

  let readFieldsOk = 0;
  let hydrFieldsOk = 0;
  for (const [field, nested] of cfg.criticalFields) {
    if (fieldPresent(uRead, field, nested)) readFieldsOk++;
    if (uHydr && fieldPresent(uHydr, field, nested)) hydrFieldsOk++;
  }

  const readCard = detectCardRoute(uRead);
  const hydrCard = uHydr ? detectCardRoute(uHydr) : '—';

  let perfilMergeOk = 0;
  for (const [field] of cfg.criticalFields) {
    const inDocTop = hasVal(doc[field]);
    const wouldMerge = !NOT_MERGED_PERFIL.has(field) && inDocTop;
    const inRead = fieldPresent(uRead, field);
    if (wouldMerge && inRead) perfilMergeOk++;
    if (!NOT_MERGED_PERFIL.has(field) && inDocTop && inRead) perfilMergeOk++;
  }
  // perfil path: fields available on uRead after normalizar (what aplicarPerfilResultadosEnDemo could merge)
  let perfilVisibleOk = 0;
  for (const [field, nested] of cfg.criticalFields) {
    const fromRead = fieldPresent(uRead, field, nested);
    const mergedByResultados = !NOT_MERGED_PERFIL.has(field) && fromRead;
    const inTopDoc = hasVal(doc[field]) || (nested && doc[nested]);
    const wouldShowIfHydrated = uHydr && fieldPresent(uHydr, field, nested);
    if (mergedByResultados || (NOT_MERGED_PERFIL.has(field) && wouldShowIfHydrated && fromRead)) perfilVisibleOk++;
    else if (NOT_MERGED_PERFIL.has(field) && inTopDoc && !fromRead && wouldShowIfHydrated) perfilVisibleOk += 0;
  }

  const report = {
    label: cfg.label,
    expectedCard: cfg.expectedCard,
    readCard,
    hydrCard,
    criticalFields: cfg.criticalFields,
    readFieldsOk,
    hydratedFieldsOk: hydrFieldsOk,
    bloquesInDoc: !!(doc.camposPublicos && doc.camposPublicos.bloquesPublicos),
    mapOnReadExists: false,
    docTopNested: cfg.criticalFields.map(([f, n]) => n && hasVal(doc[n]) ? `${n}:Y` : hasVal(doc[f]) ? `${f}:top` : `${f||n}:N`).join(', '),
    vistaRead: uRead.__vista || '—',
    vistaExpected: cfg.expectedVista,
  };
  report.classification = classifyArchetype(report);

  console.log(`--- ${cfg.label} ---`);
  console.log(`Firestore doc: subcategoriaId=${doc.subcategoriaId} arquetipo=${doc.arquetipo}`);
  console.log(`Top-level nested en doc: ${report.docTopNested}`);
  console.log(`Lectura (normalizar): tarjeta=${readCard} vista=${report.vistaRead} campos=${readFieldsOk}/${cfg.criticalFields.length}`);
  console.log(`Rehidratación (mapToPerfil bloques): tarjeta=${hydrCard} campos=${hydrFieldsOk}/${cfg.criticalFields.length}`);
  const perfil = perfilFieldAnalysis(doc, { ...uRead }, cfg.criticalFields);
  console.log(`Perfil público (Firestore): vista=${perfil.vistaPerfil} (esperada=${cfg.expectedVista}) | campos en doc no llegan a u: ${perfil.inDocLostByNormalizar} | bloqueados por merge: ${perfil.blockedOnPerfil.length}`);
  if (perfil.lostOnRead.length) console.log(`  Perdidos en normalizar: ${perfil.lostOnRead.join(', ')}`);
  if (perfil.blockedOnPerfil.length) console.log(`  En doc pero aplicarPerfilResultadosEnDemo no copia: ${perfil.blockedOnPerfil.join(', ')}`);
  console.log(`Clasificación: ${report.classification.level} — ${report.classification.reason}`);
  console.log('');
  report.perfil = perfil;
  summary.push(report);
}

console.log('=== RESUMEN CLASIFICACIÓN ===');
const counts = { Bloqueador: 0, Importante: 0, 'Diseño intencional': 0, 'Mejora futura': 0 };
for (const s of summary) {
  counts[s.classification.level] = (counts[s.classification.level] || 0) + 1;
  console.log(`${s.label}: ${s.classification.level} | read ${s.readFieldsOk}/${s.criticalFields.length} | hydrate ${s.hydratedFieldsOk}/${s.criticalFields.length} | card read=${s.readCard}`);
}
console.log('\nTotales:', JSON.stringify(counts));
console.log('\nConclusión pack: MP-SUBMIT-HYDRATE',
  counts.Bloqueador || counts.Importante ? 'RECOMENDADO (pérdida funcional en lectura)' : 'NO necesario (diseño intencional)');
