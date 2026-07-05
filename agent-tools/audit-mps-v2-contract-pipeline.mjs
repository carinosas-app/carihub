/**
 * MPS v2 — auditoría campo×etapa para arquetipos restantes (evidencia, no commitear).
 * node agent-tools/audit-mps-v2-contract-pipeline.mjs
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
  const ctx = { console, document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] } };
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
function extractFn(html, fn, next) {
  const s = html.indexOf(`function ${fn}`);
  const e = html.indexOf(`function ${next}`, s + 1);
  return html.slice(s, e);
}

const BLOCK_SCRIPTS = [
  'carihub-viajes-desplazamiento.js',
  'data/registro-adultos-dominatrix-blocks.js',
  'data/registro-adultos-espectaculo-blocks.js',
  'data/registro-adultos-creador-blocks.js',
  'data/registro-adultos-retail-blocks.js',
  'data/registro-adultos-venue-blocks.js',
  'data/registro-adultos-bienestar-blocks.js',
  'data/registro-adultos-hospedaje-blocks.js',
  'carihub-registro-public-blocks.js',
];

const ctx = makeCtx();
for (const s of BLOCK_SCRIPTS) load(s, ctx);
ctx.CariHubPrivateFieldsLite = { sanitizePrivateForStorage: (p) => ({ ...(p || {}) }) };
load('registro-perfil-submit.js', ctx);
load('carihub-public-render-lite.js', ctx);

const RP = ctx.CariHubRegistroPublicBlocks;
const Submit = ctx.CariHubRegistroPerfilSubmit;

const html = fs.readFileSync(path.join(repo, 'public', 'perfil-publico.html'), 'utf8');
const previewSlice = [
  extractFn(html, 'mergeParejaGrupoRegistroFields', 'parejaPieBottomHTML'),
  extractFn(html, 'demoAssetDesdeResultados', 'aplicarPerfilDesdeRegistro'),
  extractFn(html, 'aplicarPerfilDesdeRegistro', 'aplicarPerfilResultadosEnDemo'),
].join('\n');

function getPath(obj, key, nestedKey) {
  if (!obj) return undefined;
  if (key === 'noRealiza') return obj.noRealiza || obj.serviciosNoRealizo;
  if (key === 'horarioDetalle') return obj.horarioDetalle || obj.horario;
  if (key === 'especialidadBdsm') return obj.especialidadBdsm;
  if (nestedKey && obj[nestedKey] && obj[nestedKey][key] != null) return obj[nestedKey][key];
  return obj[key];
}

function submitHas(doc, mapped, field, nestedKey) {
  if (hasVal(getPath(mapped, field, nestedKey))) return true;
  const bp = doc.camposPublicos && doc.camposPublicos.bloquesPublicos;
  if (bp && hasVal(getPath(bp, field, nestedKey))) return true;
  if (nestedKey && bp && bp[nestedKey] && hasVal(bp[nestedKey][field])) return true;
  if (hasVal(getPath(doc, field, nestedKey))) return true;
  if (field === 'horarioDetalle' && hasVal(doc.horario)) return true;
  return false;
}

function previewHas(iframe, field, nestedKey) {
  if (field === 'horarioDetalle') return hasVal(iframe.horarioDetalle) || hasVal(iframe.horario);
  if (field === 'badgeSwinger' && iframe.badgeSwinger === true) return true;
  if (field === 'badgeLgbt' && iframe.badgeLgbt === true) return true;
  if (hasVal(getPath(iframe, field, nestedKey))) return true;
  if (nestedKey && iframe[nestedKey] && hasVal(iframe[nestedKey][field])) return true;
  return false;
}

function runAudit(cfg) {
  const userCtx = cfg.ctx;
  const bloques = RP[cfg.finalizeFn]({ ...cfg.vals }, userCtx);
  let mapped = RP.mapToPerfil(
    { subcategoriaId: userCtx.subcategoriaId, alias: cfg.alias || 'QA', edad: cfg.edad || 30, ciudad: 'Monterrey', tagline: 'Tag QA' },
    bloques,
    userCtx
  );
  const doc = Submit.buildUsuarioDoc(
    'uid_mps',
    {
      contexto: userCtx,
      schemaResuelto: { identidad: { arquetipo: userCtx.arquetipo, tipoPerfil: userCtx.tipoPerfil || 'persona' } },
      camposPublicos: {
        alias: cfg.alias || 'QA',
        bloquesPublicos: bloques,
        descripcionCorta: 'Tag QA',
        precioDesde: cfg.vals.precioDesde || cfg.vals.precioShow || cfg.vals.precioEntrada || '999',
        ciudad: 'Monterrey',
      },
    },
    { correoAcceso: 'mps@ex.com', mayorEdadConfirmado: true, rfc: cfg.vals.rfc, razonSocial: cfg.vals.razonSocial },
    {},
    {}
  );

  const pctx = makeCtx();
  pctx.DEMO = { [cfg.vista]: {} };
  pctx.window = pctx;
  vm.runInContext(previewSlice, pctx);
  pctx.aplicarPerfilDesdeRegistro(cfg.vista, mapped);
  const iframe = pctx.DEMO[cfg.vista];

  const rows = [];
  for (const field of cfg.fields) {
    const b = hasVal(getPath(bloques, field, cfg.nestedKey));
    const m = hasVal(getPath(mapped, field, cfg.nestedKey));
    const s = submitHas(doc, mapped, field, cfg.nestedKey);
    const p = previewHas(iframe, field, cfg.nestedKey);
    let gap = null;
    if (!b && !cfg.optional?.includes(field)) gap = 'blocks';
    else if (!m) gap = 'mapToPerfil';
    else if (!s && !cfg.private?.includes(field)) gap = 'submit';
    else if (!p && !cfg.private?.includes(field)) gap = 'preview-iframe';
    rows.push({ field, b, m, s, p, gap });
  }
  return { label: cfg.label, rows, nestedKey: cfg.nestedKey };
}

const DOM_VALS = {
  estiloDominacion: 'Femdom',
  experienciaBdsm: '5+ años',
  listaFetiches: ['Bondage', 'Impact play'],
  limitesSesion: 'Sin menores',
  equipamiento: ['Bondage / restricciones'],
  protocolo: ['SSC (Safe, Sane, Consensual)'],
  rolesAtendidos: ['Sumisos'],
  modalidadSesion: 'Presencial',
  espacioSesion: 'Dungeon / espacio propio',
  dressCodeCliente: 'A convenir',
  serviciosIncluidos: ['Femdom / Maledom'],
  serviciosNoRealizo: ['Menores de edad'],
  modalidades: ['recibe', 'hotel'],
  metodosPago: ['Efectivo'],
  horarioDetalle: 'Lun–Sáb con cita',
  sobreMi: 'Sesiones BDSM.',
  idiomas: 'Español',
  mostrarEquipamientoPublico: 'Sí',
  mostrarFetichesPublico: 'Sí',
};

const ESP_VALS = {
  tipoShow: ['Shows privados', 'Pole dance / barra'],
  precioShow: '$1,200 MXN',
  horarioMinimo: '30 minutos',
  anosExperiencia: '3–5 años',
  vestuarioShow: ['Lencería / outfit temático'],
  eventosDisponibles: 'Sí',
  venueFijo: 'Zona centro',
  requisitosLugar: 'Espacio privado',
  modalidades: ['fiestas', 'hoteles'],
  desplazamientos: 'Zona local / área metropolitana',
  serviciosIncluidos: ['Shows privados'],
  serviciosNoRealizo: ['Servicios sexuales'],
  horarioDetalle: 'Vie–Dom noche',
  metodosPago: ['Efectivo'],
  sobreMi: 'Show profesional.',
};

const CRE_VALS = {
  tiposContenido: ['Fotos exclusivas', 'Videos'],
  plataformas: ['OnlyFans', 'Telegram VIP'],
  precioSuscripcion: '$299 MXN / mes',
  contenidoPersonalizado: 'A convenir',
  paquetesContenido: ['Suscripción mensual'],
  colaboracionesCreador: 'No',
  redesSociales: 'https://onlyfans.com/qa',
  mostrarPlataformasPublico: 'Sí',
  serviciosIncluidos: ['Contenido exclusivo'],
  serviciosNoRealizo: ['Encuentros presenciales'],
  horarioDetalle: 'Publico diario',
  metodosPago: ['Pago en línea'],
  sobreMi: 'Creadora QA.',
  idiomas: 'Español',
};

const RET_VALS = {
  nombreComercial: 'Pleasure Boutique',
  categoriasProducto: ['Lencería', 'Juguetes'],
  precioDesde: '$199 MXN',
  envioDomicilio: 'Sí',
  tiendaOnline: 'No',
  direccion: 'Centro, Monterrey',
  zonaPublica: 'Centro',
  serviciosIncluidos: ['Venta en tienda física'],
  serviciosNoRealizo: ['Venta a menores'],
  horarioDetalle: 'Lun–Sáb 10–20',
  metodosPago: ['Efectivo', 'Tarjeta'],
  sobreMi: 'Tienda QA.',
  rfc: 'RET123456ABC',
  razonSocial: 'Retail SA',
};

function venueVals(subId) {
  const base = {
    nombreComercial: 'Nocturna MTY',
    tipoVenue: 'Antro / Discoteca',
    precioEntrada: '$350 MXN',
    cartelera: 'DJ viernes',
    dressCode: 'Elegante casual',
    areasVenue: ['Pista principal', 'Mesas VIP'],
    reglasAcceso: ['Solo mayores de edad'],
    direccion: 'Centro, Monterrey',
    horarioDetalle: 'Vie–Dom 10 PM – 4 AM',
    metodosPago: ['Efectivo'],
    reservaciones: 'Sí',
    rfc: 'VEN123456ABC',
    razonSocial: 'Venue SA',
    tagline: 'Vida nocturna',
    sobreMi: 'Venue QA.',
  };
  if (subId === 'club_sw') {
    return Object.assign({}, base, {
      tipoVenue: 'Club Swinger / Lifestyle',
      eventosTematicos: 'Noche temática parejas',
      politicaParejasSingles: 'Parejas y singles selectos',
      cartelera: '',
      dressCode: '',
    });
  }
  if (subId === 'cabinas') {
    return Object.assign({}, base, {
      tipoVenue: 'Cabinas privadas / Glory holes',
      nivelPrivacidad: 'Alta discreción',
      cartelera: '',
      dressCode: '',
    });
  }
  if (subId === 'cine_xxx') {
    return Object.assign({}, base, {
      tipoVenue: 'Cine para adultos / Sala XXX',
      cartelera: 'Estreno semanal',
      horariosFunciones: 'Funciones cada hora',
      clasificacion: 'Solo adultos (+18)',
      dressCode: '',
    });
  }
  if (subId === 'antro_lgbt') {
    return Object.assign({}, base, { tipoVenue: 'Antro LGBT+' });
  }
  return base;
}

const BIEN_VALS = {
  spa: {
    nombreComercial: 'Zen Spa',
    tipoBienestar: 'Spa / centro de bienestar',
    menuServicios: 'Relajante · Pareja',
    precioDesde: '$650 MXN',
    amenidades: ['Jacuzzi', 'Sauna'],
    direccion: 'Valle Oriente',
    horarioDetalle: 'Lun–Dom 10–22',
    metodosPago: ['Tarjeta'],
    serviciosIncluidos: ['Masaje relajante'],
    serviciosNoRealizo: ['Menores de edad'],
    rfc: 'BIE123456ABC',
    razonSocial: 'Spa SA',
    sobreMi: 'Spa QA.',
  },
  masajes: {
    nombreComercial: 'Masajes MTY',
    tipoBienestar: 'Centro de masajes',
    menuServicios: 'Relajante 60 min',
    precioDesde: '$500 MXN',
    amenidades: ['Cabinas privadas'],
    direccion: 'Centro',
    horarioDetalle: 'Lun–Sáb',
    metodosPago: ['Efectivo'],
    serviciosIncluidos: ['Masaje relajante 60 min'],
    serviciosNoRealizo: ['Menores de edad'],
    rfc: 'MAS123456ABC',
    razonSocial: 'Masajes SA',
    sobreMi: 'Centro QA.',
  },
};

const HOSP_VALS = {
  nombreComercial: 'Motel Cariñoso',
  tipoHospedaje: 'Motel',
  tiposHabitacion: ['Estándar', 'Suite jacuzzi'],
  tarifaHora: '$450 MXN / hora',
  tarifaNoche: '$1,200 MXN',
  direccion: 'Providencia',
  horarioDetalle: '24 horas',
  reglasEstancia: ['Solo mayores de edad'],
  metodosPago: ['Efectivo'],
  amenidades: ['Jacuzzi en habitación'],
  estacionamiento: 'Cochera privada',
  privacidadDiscrecion: ['Entrada discreta'],
  mostrarDireccionExacta: 'No',
  rfc: 'HOS123456ABC',
  razonSocial: 'Hospedaje SA',
  sobreMi: 'Motel QA.',
};

const CONFIGS = [
  {
    label: 'persona_dominatrix / dominatrix',
    nestedKey: 'dominatrixPerfil',
    finalizeFn: 'finalizeDominatrixValues',
    vista: 'dominatrix',
    ctx: { subcategoriaId: 'dominatrix', arquetipo: 'persona_dominatrix', formularioId: 'adultos' },
    vals: DOM_VALS,
    fields: [
      'estiloDominacion', 'experienciaBdsm', 'listaFetiches', 'limitesSesion', 'equipamiento', 'protocolo',
      'rolesAtendidos', 'modalidadSesion', 'espacioSesion', 'dressCodeCliente', 'serviciosIncluidos',
      'serviciosNoRealizo', 'modalidades', 'metodosPago', 'horarioDetalle', 'sobreMi', 'idiomas',
      'especialidadBdsm', 'dominatrixPerfil',
    ],
    optional: ['listaFetiches', 'experienciaBdsm', 'dressCodeCliente'],
    private: ['mostrarEquipamientoPublico', 'mostrarFetichesPublico'],
  },
  {
    label: 'persona_espectaculo / stripper',
    nestedKey: 'espectaculoPerfil',
    finalizeFn: 'finalizeEspectaculoValues',
    vista: 'stripper',
    ctx: { subcategoriaId: 'stripper', arquetipo: 'persona_espectaculo', formularioId: 'adultos' },
    vals: ESP_VALS,
    fields: [
      'tipoShow', 'precioShow', 'horarioMinimo', 'anosExperiencia', 'vestuarioShow', 'eventosDisponibles',
      'venueFijo', 'requisitosLugar', 'modalidades', 'desplazamientos', 'serviciosIncluidos',
      'serviciosNoRealizo', 'horarioDetalle', 'metodosPago', 'sobreMi', 'espectaculoPerfil',
    ],
    optional: ['vestuarioShow', 'requisitosLugar', 'anosExperiencia'],
  },
  {
    label: 'persona_espectaculo / tabledance',
    nestedKey: 'espectaculoPerfil',
    finalizeFn: 'finalizeEspectaculoValues',
    vista: 'tableDance',
    ctx: { subcategoriaId: 'tabledance', arquetipo: 'persona_espectaculo', formularioId: 'adultos' },
    vals: Object.assign({}, ESP_VALS, { desplazamientos: '' }),
    fields: ['tipoShow', 'precioShow', 'horarioMinimo', 'venueFijo', 'modalidades', 'serviciosIncluidos', 'horarioDetalle', 'espectaculoPerfil'],
    optional: ['desplazamientos'],
  },
  {
    label: 'persona_creador / contenido',
    nestedKey: 'creadorPerfil',
    finalizeFn: 'finalizeCreadorValues',
    vista: 'creador',
    ctx: { subcategoriaId: 'contenido', arquetipo: 'persona_creador', formularioId: 'adultos' },
    vals: CRE_VALS,
    fields: [
      'tiposContenido', 'plataformas', 'precioSuscripcion', 'contenidoPersonalizado', 'paquetesContenido',
      'colaboracionesCreador', 'redesSociales', 'serviciosIncluidos', 'serviciosNoRealizo',
      'horarioDetalle', 'metodosPago', 'sobreMi', 'creadorPerfil',
    ],
    optional: ['contenidoPersonalizado', 'paquetesContenido', 'colaboracionesCreador'],
  },
  {
    label: 'negocio_retail / sex_shop',
    nestedKey: 'retailPerfil',
    finalizeFn: 'finalizeRetailValues',
    vista: 'sexShop',
    ctx: { subcategoriaId: 'sex_shop', arquetipo: 'negocio_retail', tipoPerfil: 'negocio', formularioId: 'adultos' },
    vals: RET_VALS,
    alias: RET_VALS.nombreComercial,
    fields: [
      'nombreComercial', 'categoriasProducto', 'precioDesde', 'envioDomicilio', 'tiendaOnline',
      'direccion', 'serviciosIncluidos', 'serviciosNoRealizo', 'horarioDetalle', 'metodosPago', 'retailPerfil',
    ],
    private: ['rfc', 'razonSocial'],
  },
  {
    label: 'negocio_bienestar / spa',
    nestedKey: 'bienestarPerfil',
    finalizeFn: 'finalizeBienestarValues',
    vista: 'spa',
    ctx: { subcategoriaId: 'spa', arquetipo: 'negocio_bienestar', tipoPerfil: 'negocio', formularioId: 'adultos' },
    vals: BIEN_VALS.spa,
    alias: BIEN_VALS.spa.nombreComercial,
    fields: ['nombreComercial', 'tipoBienestar', 'menuServicios', 'precioDesde', 'amenidades', 'direccion', 'horarioDetalle', 'metodosPago', 'bienestarPerfil'],
    private: ['rfc', 'razonSocial'],
  },
  {
    label: 'negocio_bienestar / masajes',
    nestedKey: 'bienestarPerfil',
    finalizeFn: 'finalizeBienestarValues',
    vista: 'masajesLocal',
    ctx: { subcategoriaId: 'masajes', arquetipo: 'negocio_bienestar', tipoPerfil: 'negocio', formularioId: 'adultos' },
    vals: BIEN_VALS.masajes,
    alias: BIEN_VALS.masajes.nombreComercial,
    fields: ['nombreComercial', 'tipoBienestar', 'menuServicios', 'serviciosIncluidos', 'serviciosNoRealizo', 'horarioDetalle', 'bienestarPerfil'],
    private: ['rfc', 'razonSocial'],
  },
  {
    label: 'negocio_hospedaje / hotel_motel',
    nestedKey: 'hospedajePerfil',
    finalizeFn: 'finalizeHospedajeValues',
    vista: 'hotelMotel',
    ctx: { subcategoriaId: 'hotel_motel', arquetipo: 'negocio_hospedaje', tipoPerfil: 'lugar', formularioId: 'adultos' },
    vals: HOSP_VALS,
    alias: HOSP_VALS.nombreComercial,
    fields: [
      'nombreComercial', 'tipoHospedaje', 'tiposHabitacion', 'tarifaHora', 'tarifaNoche', 'direccion',
      'reglasEstancia', 'amenidades', 'estacionamiento', 'privacidadDiscrecion', 'mostrarDireccionExacta',
      'horarioDetalle', 'metodosPago', 'hospedajePerfil',
    ],
    optional: ['tarifaNoche', 'amenidades', 'estacionamiento'],
    private: ['rfc', 'razonSocial'],
  },
];

const VENUE_SUBS = [
  { subId: 'antro', vista: 'antro', badge: null },
  { subId: 'antro_lgbt', vista: 'antroLgbt', badge: 'badgeLgbt' },
  { subId: 'club_sw', vista: 'clubSw', badge: 'badgeSwinger' },
  { subId: 'cabinas', vista: 'cabinas', badge: null },
  { subId: 'cine_xxx', vista: 'cineXxx', badge: null },
];

for (const vs of VENUE_SUBS) {
  const v = venueVals(vs.subId);
  const fields = [
    'nombreComercial', 'tipoVenue', 'precioEntrada', 'areasVenue', 'reglasAcceso', 'direccion',
    'horarioDetalle', 'metodosPago', 'venuePerfil',
  ];
  if (vs.subId === 'club_sw') fields.push('eventosTematicos', 'politicaParejasSingles', 'badgeSwinger');
  if (vs.subId === 'cabinas') fields.push('nivelPrivacidad');
  if (vs.subId === 'cine_xxx') fields.push('cartelera', 'horariosFunciones', 'clasificacion');
  if (vs.subId === 'antro' || vs.subId === 'antro_lgbt') fields.push('cartelera', 'dressCode');
  if (vs.subId === 'antro_lgbt') fields.push('badgeLgbt');
  CONFIGS.push({
    label: `negocio_venue / ${vs.subId}`,
    nestedKey: 'venuePerfil',
    finalizeFn: 'finalizeVenueValues',
    vista: vs.vista,
    ctx: { subcategoriaId: vs.subId, arquetipo: 'negocio_venue', tipoPerfil: 'lugar', formularioId: 'adultos' },
    vals: v,
    alias: v.nombreComercial,
    fields,
    optional: vs.subId === 'club_sw' || vs.subId === 'cabinas' ? ['cartelera', 'dressCode'] : [],
    private: ['rfc', 'razonSocial'],
  });
}

const results = CONFIGS.map(runAudit);

console.log('=== MPS v2 — contratos campo × etapa ===\n');
const summary = [];

for (const r of results) {
  const previewGaps = r.rows.filter((x) => x.gap === 'preview-iframe');
  const submitGaps = r.rows.filter((x) => x.gap === 'submit');
  const upstream = r.rows.filter((x) => x.gap && x.gap !== 'preview-iframe' && x.gap !== 'submit');
  console.log(`--- ${r.label} ---`);
  console.log('field\tblocks\tmap\tsubmit\tpreview\tgap');
  for (const row of r.rows) {
    console.log([row.field, row.b ? 'Y' : 'N', row.m ? 'Y' : 'N', row.s ? 'Y' : 'N', row.p ? 'Y' : 'N', row.gap || 'OK'].join('\t'));
  }
  console.log(`OK pipeline: ${r.rows.filter((x) => !x.gap).length}/${r.rows.length} | preview gaps: ${previewGaps.length} | submit gaps: ${submitGaps.length} | upstream: ${upstream.length}\n`);
  summary.push({ label: r.label, previewGaps, submitGaps, upstream, total: r.rows.length });
}

console.log('=== RESUMEN v2 ===');
for (const s of summary) {
  if (s.previewGaps.length || s.submitGaps.length || s.upstream.length) {
    console.log(s.label);
    s.previewGaps.forEach((g) => console.log('  preview:', g.field));
    s.submitGaps.forEach((g) => console.log('  submit:', g.field));
    s.upstream.forEach((g) => console.log('  ' + g.gap + ':', g.field));
  }
}
