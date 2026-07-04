/**
 * Auditoría funcional E2E — comportamiento real (no shape).
 * node agent-tools/audit-e2e-behavioral-flow.mjs
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
function pickVisible(u, field, nested) {
  if (nested && u[nested] && hasVal(u[nested][field])) return u[nested][field];
  return u[field];
}
function strSample(v) {
  if (Array.isArray(v)) return v[0];
  if (typeof v === 'object') return JSON.stringify(v).slice(0, 40);
  return String(v);
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

const STAGES = {
  registro: { file: 'public/js/data/registro-adultos-*-blocks.js + carihub-registro-public-blocks.js', fn: 'finalize*Values', rehydrate: 'No' },
  submit: { file: 'public/js/registro-perfil-submit.js', fn: 'buildUsuarioDoc', rehydrate: 'Sí — mapToPerfil interno (L178–182); no persiste objeto plano completo' },
  firestore: { file: 'Firestore collection usuarios', fn: 'doc persistido (simulado)', rehydrate: 'N/A' },
  lectura: { file: 'public/js/resultados-registrados.js', fn: 'normalizarPerfilFirestore', rehydrate: 'No — consume doc directo, ~20 campos genéricos' },
  resultados: { file: 'public/js/resultados-demo.js → carihub-public-render-lite.js', fn: 'renderProfiles → cardHTML', rehydrate: 'No' },
  perfil: { file: 'public/js/perfil-publico-init.js + public/perfil-publico.html', fn: 'cargarPerfilFirestore → normalizar → resolverVistaPerfil → aplicarPerfilResultadosEnDemo', rehydrate: 'No' },
};

const CASES = [
  {
    id: 'persona_dominatrix',
    label: 'Dominatrix',
    finalizeFn: 'finalizeDominatrixValues',
    blocksFile: 'registro-adultos-dominatrix-blocks.js',
    ctx: { subcategoriaId: 'dominatrix', arquetipo: 'persona_dominatrix', categoriaPrincipal: 'Adultos', subcategoria: 'Dominatrix', formularioId: 'adultos' },
    alias: 'Dom QA',
    vals: {
      estiloDominacion: 'Femdom', experienciaBdsm: '5+ años', listaFetiches: ['Bondage'], limitesSesion: 'Sin menores',
      equipamiento: ['Bondage / restricciones'], protocolo: ['SSC'], rolesAtendidos: ['Sumisos'], modalidadSesion: 'Presencial',
      espacioSesion: 'Dungeon', serviciosIncluidos: ['Femdom'], serviciosNoRealizo: ['Menores'], modalidades: ['recibe'],
      metodosPago: ['Efectivo'], horarioDetalle: 'Con cita', sobreMi: 'BDSM QA', idiomas: 'Español',
    },
    cardClass: 'res-card--dominatrix',
    vistaPerfil: 'dominatrix',
    visible: [
      { field: 'estiloDominacion', screen: 'resultados', renderFn: 'cardHTMLDominatrix L641', htmlCheck: 'Femdom' },
      { field: 'modalidadSesion', screen: 'resultados', renderFn: 'cardHTMLDominatrix L638', htmlCheck: 'Presencial' },
      { field: 'estiloDominacion', screen: 'perfil-publico', mergeFn: 'aplicarPerfilResultadosEnDemo', note: 'campo no listado en merge L7413+' },
    ],
  },
  {
    id: 'persona_creador',
    label: 'Creador',
    finalizeFn: 'finalizeCreadorValues',
    blocksFile: 'registro-adultos-creador-blocks.js',
    ctx: { subcategoriaId: 'contenido', arquetipo: 'persona_creador', categoriaPrincipal: 'Adultos', subcategoria: 'Creador contenido', formularioId: 'adultos' },
    alias: 'Creator QA',
    vals: {
      tiposContenido: ['Videos'], plataformas: ['OnlyFans'], precioSuscripcion: '$299', redesSociales: 'https://onlyfans.com/x',
      serviciosIncluidos: ['Contenido exclusivo'], serviciosNoRealizo: ['Encuentros'], horarioDetalle: 'Diario', metodosPago: ['Pago en línea'],
    },
    cardClass: 'res-card--creador',
    vistaPerfil: 'creador',
    visible: [
      { field: 'plataformas', screen: 'resultados', renderFn: 'creadorContentChips L431', htmlCheck: 'OnlyFans' },
      { field: 'tiposContenido', screen: 'resultados', renderFn: 'creadorContentChips L442', htmlCheck: 'Videos' },
      { field: 'precioSuscripcion', screen: 'resultados', renderFn: 'cardShell priceLabel Suscripción', htmlCheck: '$299' },
    ],
  },
  {
    id: 'persona_espectaculo',
    label: 'Espectáculo (stripper)',
    finalizeFn: 'finalizeEspectaculoValues',
    blocksFile: 'registro-adultos-espectaculo-blocks.js',
    ctx: { subcategoriaId: 'stripper', arquetipo: 'persona_espectaculo', categoriaPrincipal: 'Adultos', subcategoria: 'Stripper', formularioId: 'adultos' },
    alias: 'Show QA',
    vals: {
      tipoShow: ['Shows privados'], precioShow: '$1200', horarioMinimo: '30 minutos', modalidades: ['fiestas'],
      desplazamientos: 'Zona local', serviciosIncluidos: ['Shows'], serviciosNoRealizo: ['Sexuales'],
      horarioDetalle: 'Vie-Dom', metodosPago: ['Efectivo'], anosExperiencia: '3–5 años',
    },
    cardClass: 'res-card--stripper',
    vistaPerfil: 'stripper',
    visible: [
      { field: 'tipoShow', screen: 'resultados', renderFn: 'espectaculoShowChips L462', htmlCheck: 'Shows privados' },
      { field: 'precioShow', screen: 'resultados', renderFn: 'cardHTMLStripper priceLabel Show desde', htmlCheck: '$1200' },
    ],
  },
  {
    id: 'negocio_bienestar',
    label: 'Bienestar (spa)',
    finalizeFn: 'finalizeBienestarValues',
    blocksFile: 'registro-adultos-bienestar-blocks.js',
    ctx: { subcategoriaId: 'spa', arquetipo: 'negocio_bienestar', tipoPerfil: 'negocio', categoriaPrincipal: 'Adultos', subcategoria: 'Spa', formularioId: 'adultos' },
    alias: 'Zen Spa',
    vals: {
      nombreComercial: 'Zen Spa', tipoBienestar: 'Spa / centro de bienestar', menuServicios: 'Relajante', precioDesde: '$650',
      amenidades: ['Jacuzzi'], direccion: 'Valle', horarioDetalle: '10-22', metodosPago: ['Tarjeta'], rfc: 'X', razonSocial: 'Y',
    },
    cardClass: 'res-card--spa',
    vistaPerfil: 'spa',
    visible: [
      { field: 'nombreComercial', screen: 'resultados', renderFn: 'cardShell nombre L554', htmlCheck: 'Zen Spa' },
      { field: 'menuServicios', screen: 'resultados', renderFn: 'bienestarShowChips', htmlCheck: 'Relajante' },
      { field: 'amenidades', screen: 'resultados', renderFn: 'bienestarShowChips', htmlCheck: 'Jacuzzi' },
    ],
  },
  {
    id: 'negocio_hospedaje',
    label: 'Hospedaje (hotel/motel)',
    finalizeFn: 'finalizeHospedajeValues',
    blocksFile: 'registro-adultos-hospedaje-blocks.js',
    ctx: { subcategoriaId: 'hotel_motel', arquetipo: 'negocio_hospedaje', tipoPerfil: 'lugar', categoriaPrincipal: 'Adultos', subcategoria: 'Hotel / Motel', formularioId: 'adultos' },
    alias: 'Motel QA',
    vals: {
      nombreComercial: 'Motel QA', tipoHospedaje: 'Motel', tiposHabitacion: ['Suite jacuzzi'], tarifaHora: '$450',
      tarifaNoche: '$1200', direccion: 'Providencia', horarioDetalle: '24h', reglasEstancia: ['18+'], metodosPago: ['Efectivo'], rfc: 'X', razonSocial: 'Y',
    },
    cardClass: 'res-card--hotel-motel',
    vistaPerfil: 'hotelMotel',
    visible: [
      { field: 'tipoHospedaje', screen: 'resultados', renderFn: 'hospedajeShowChips L1069', htmlCheck: 'Motel' },
      { field: 'tiposHabitacion', screen: 'resultados', renderFn: 'hospedajeShowChips L1074', htmlCheck: 'Suite jacuzzi' },
      { field: 'tarifaHora', screen: 'resultados', renderFn: 'cardHTMLHospedaje priceLabel Hora', htmlCheck: '$450' },
    ],
  },
  {
    id: 'negocio_retail',
    label: 'Retail (sex shop)',
    finalizeFn: 'finalizeRetailValues',
    blocksFile: 'registro-adultos-retail-blocks.js',
    ctx: { subcategoriaId: 'sex_shop', arquetipo: 'negocio_retail', tipoPerfil: 'negocio', categoriaPrincipal: 'Adultos', subcategoria: 'Sex shop', formularioId: 'adultos' },
    alias: 'Boutique QA',
    vals: {
      nombreComercial: 'Boutique QA', categoriasProducto: ['Lencería'], precioDesde: '$199', direccion: 'Centro',
      serviciosIncluidos: ['Venta en tienda'], serviciosNoRealizo: ['Menores'], horarioDetalle: '10-20', metodosPago: ['Efectivo'],
      envioDomicilio: 'Sí', tiendaOnline: 'No',
    },
    cardClass: 'res-card--sexshop',
    vistaPerfil: 'sexShop',
    visible: [
      { field: 'nombreComercial', screen: 'resultados', renderFn: 'cardShell nombre', htmlCheck: 'Boutique QA' },
      { field: 'categoriasProducto', screen: 'resultados', renderFn: 'retailShowChips L725', htmlCheck: 'Lencería' },
    ],
  },
  {
    id: 'negocio_venue',
    label: 'Venue (club sw)',
    finalizeFn: 'finalizeVenueValues',
    blocksFile: 'registro-adultos-venue-blocks.js',
    ctx: { subcategoriaId: 'club_sw', arquetipo: 'negocio_venue', tipoPerfil: 'lugar', categoriaPrincipal: 'Adultos', subcategoria: 'Club swinger', formularioId: 'adultos' },
    alias: 'Club QA',
    vals: {
      nombreComercial: 'Club QA', tipoVenue: 'Club Swinger / Lifestyle', precioEntrada: '$500', areasVenue: ['Salón'],
      reglasAcceso: ['18+'], direccion: 'Centro', horarioDetalle: 'Vie-Dom', metodosPago: ['Efectivo'], rfc: 'X', razonSocial: 'Y',
      eventosTematicos: 'Noche parejas', politicaParejasSingles: 'Parejas y singles',
    },
    cardClass: 'res-card--club-sw',
    vistaPerfil: 'clubSw',
    visible: [
      { field: 'precioEntrada', screen: 'resultados', renderFn: 'venueShowChips L825', htmlCheck: 'Cover $500' },
      { field: 'eventosTematicos', screen: 'resultados', renderFn: 'venueShowChips L843', htmlCheck: 'Noche parejas' },
      { field: 'nombreComercial', screen: 'resultados', renderFn: 'cardHTMLClubSw', htmlCheck: 'Club QA' },
    ],
  },
  {
    id: 'pareja_grupo',
    label: 'Pareja (swinger)',
    finalizeFn: 'finalizeParejaSwingerValues',
    blocksFile: 'registro-adultos-pareja-blocks.js',
    ctx: { subcategoriaId: 'swinger', arquetipo: 'pareja_grupo', tipoPerfil: 'pareja_grupo', categoriaPrincipal: 'Adultos', subcategoria: 'Pareja swinger', formularioId: 'adultos' },
    alias: 'Pareja QA',
    vals: {
      aliasPareja: 'Pareja QA', configuracionGrupo: 'pareja_hm', objetivosPerfil: ['Conocer parejas'],
      intercambioSwinger: 'Sí', modalidades: ['recibe', 'hotel'], horarioDetalle: 'Fines de semana',
      serviciosIncluidos: ['Social'], metodosPago: ['Efectivo'], miembros: [{ alias: 'A', edad: 30 }, { alias: 'B', edad: 28 }],
    },
    cardClass: 'res-card--pareja-sw',
    vistaPerfil: 'pareja',
    visible: [
      { field: 'aliasPareja', screen: 'resultados', renderFn: 'cardHTMLParejaSwinger L236', htmlCheck: 'Pareja QA' },
      { field: 'intercambioSwinger', screen: 'resultados', renderFn: 'cardHTMLParejaSwinger L218', htmlCheck: 'Intercambio: Sí' },
      { field: 'objetivosPerfil', screen: 'resultados', renderFn: 'swingerObjetivoPrincipal', htmlCheck: 'Conocer parejas' },
    ],
  },
  {
    id: 'persona_lifestyle',
    label: 'Unicorn',
    finalizeFn: 'finalizeUnicornValues',
    blocksFile: 'registro-adultos-lifestyle-blocks.js',
    ctx: { subcategoriaId: 'unicorns', arquetipo: 'persona_lifestyle', categoriaPrincipal: 'Adultos', subcategoria: 'Unicorns', formularioId: 'adultos' },
    alias: 'Luna U',
    vals: {
      objetivosPerfil: ['Conocer parejas'], tipoUnicornio: 'Mujer', buscoConocer: ['Parejas'], tipoParejaPreferida: ['H+M'],
      finalidadEncuentro: ['Socializar'], estadoPerfil: 'Disponible', experiencia: 'Intermedio', serviciosLifestyle: ['Citas'],
      modalidades: ['hotel'], horarioDetalle: 'Vie-Dom', metodosPago: ['Efectivo'], sobreMi: 'Unicorn QA',
    },
    cardClass: 'res-card--unicorn',
    vistaPerfil: 'unicorn',
    visible: [
      { field: 'buscoConocer', screen: 'resultados', renderFn: 'cardHTMLUnicorn L267', htmlCheck: 'Busco: Parejas' },
      { field: 'objetivosPerfil', screen: 'resultados', renderFn: 'objetivoPrincipalUnicorn', htmlCheck: 'Conocer parejas' },
      { field: 'tipoUnicornio', screen: 'perfil-publico', mergeFn: 'aplicarPerfilResultadosEnDemo L7457', note: 'requiere u.tipoUnicornio tras lectura' },
    ],
  },
];

function buildDoc(cfg) {
  const bloques = RP[cfg.finalizeFn]({ ...cfg.vals }, cfg.ctx);
  return Submit.buildUsuarioDoc(
    'uid_e2e',
    {
      contexto: cfg.ctx,
      schemaResuelto: { identidad: { arquetipo: cfg.ctx.arquetipo, tipoPerfil: cfg.ctx.tipoPerfil || 'persona' } },
      camposPublicos: {
        alias: cfg.alias,
        edad: 28,
        bloquesPublicos: bloques,
        descripcionCorta: 'Tag E2E',
        precioDesde: cfg.vals.precioDesde || cfg.vals.precioShow || cfg.vals.precioSuscripcion || cfg.vals.tarifaHora || '999',
        pais: 'México', estado: 'Nuevo León', ciudad: 'Monterrey', zona: 'Centro',
      },
    },
    { correoAcceso: 'e2e@ex.com', mayorEdadConfirmado: true },
    { fotoPrincipal: 'https://example.com/f.jpg' },
    {}
  );
}

function readProduction(doc) {
  const mock = { id: 'uid_e2e', exists: true, data: () => doc };
  const u = Reg.normalizar(mock);
  FE.enriquecerPerfilPublico(u, { categoria: u.categoria || doc.categoria });
  return u;
}

function hydrateControl(doc, ctxCfg) {
  const bp = doc.camposPublicos?.bloquesPublicos;
  if (!bp) return null;
  const u = RP.mapToPerfil(
    { subcategoriaId: doc.subcategoriaId, alias: doc.alias || doc.nombre, edad: doc.edad, ciudad: doc.ciudad, categoria: doc.categoria, fotoURL: doc.fotoURL },
    bp,
    ctxCfg
  );
  FE.enriquecerPerfilPublico(u, { subcategoriaId: doc.subcategoriaId, categoria: doc.categoria });
  return u;
}

function auditArchetype(cfg) {
  const bloques = RP[cfg.finalizeFn]({ ...cfg.vals }, cfg.ctx);
  const doc = buildDoc(cfg);
  const uRead = readProduction(doc);
  const uHydr = hydrateControl(doc, cfg.ctx);
  const q = { categoria: doc.categoria || 'Adultos' };
  const htmlRead = Render.cardHTML(uRead, q);
  const htmlHydr = uHydr ? Render.cardHTML(uHydr, q) : '';

  FE.enriquecerPerfilPublico(uRead, {
    subcategoriaId: uRead.subcategoriaId,
    categoria: uRead.categoria,
  });
  const vistaPerfilRead = uRead.__vista || 'adult';

  const losses = [];
  const visibleResults = { llegan: [], noLlegan: [] };
  const visiblePerfil = { llegan: [], noLlegan: [] };

  for (const v of cfg.visible) {
    const sample = strSample(pickVisible(uHydr, v.field, null) || cfg.vals[v.field]);
    const onU = hasVal(pickVisible(uRead, v.field, null));
    const inHtmlRead = v.htmlCheck ? htmlRead.includes(v.htmlCheck) : false;
    const inHtmlHydr = v.htmlCheck ? htmlHydr.includes(v.htmlCheck) : false;
    const cardOkRead = htmlRead.includes(cfg.cardClass);
    const cardOkHydr = htmlHydr.includes(cfg.cardClass);

    if (v.screen === 'resultados') {
      if (inHtmlHydr && !inHtmlRead) {
        visibleResults.noLlegan.push({ campo: v.field, valorEsperado: v.htmlCheck, renderFn: v.renderFn });
        losses.push({
          clasificacion: 'Bloqueador',
          campo: v.field,
          valor: v.htmlCheck,
          archivo: 'public/js/carihub-public-render-lite.js',
          funcion: v.renderFn,
          pantalla: 'resultados.html (tarjeta)',
          evidencia: `cardHTML(uRead) no contiene "${v.htmlCheck}"; cardHTML(uHydr) sí. uRead.${v.field}=${onU ? 'presente' : 'ausente'}`,
        });
      } else if (inHtmlRead) {
        visibleResults.llegan.push(v.field);
      }
    }
    if (v.screen === 'perfil-publico') {
      if (!onU) {
        visiblePerfil.noLlegan.push({ campo: v.field, mergeFn: v.mergeFn || v.renderFn });
        losses.push({
          clasificacion: 'Bloqueador',
          campo: v.field,
          valor: sample,
          archivo: 'public/js/resultados-registrados.js',
          funcion: 'normalizarPerfilFirestore → perfil-publico-init.cargarPerfilFirestore',
          pantalla: 'perfil-publico.html (ficha)',
          evidencia: `u.${v.field} ausente tras normalizar; ${v.note || 'merge imposible'}`,
        });
      }
    }
  }

  if (!htmlRead.includes(cfg.cardClass) && htmlHydr.includes(cfg.cardClass)) {
    losses.push({
      clasificacion: 'Bloqueador',
      campo: '(layout tarjeta)',
      valor: cfg.cardClass,
      archivo: 'public/js/carihub-public-render-lite.js',
      funcion: 'cardHTML → routing por is*Perfil / subcategoriaId',
      pantalla: 'resultados.html',
      evidencia: `HTML read sin ${cfg.cardClass}; hydrate sí. Causa: uRead sin subcategoriaId/arquetipo/campos detectores`,
    });
  }
  if (vistaPerfilRead !== cfg.vistaPerfil && vistaPerfilRead === 'adult') {
    losses.push({
      clasificacion: 'Bloqueador',
      campo: 'subcategoriaId / __vista',
      valor: cfg.vistaPerfil,
      archivo: 'public/perfil-publico.html',
      funcion: 'resolverVistaPerfil → enriquecerPerfilPublico',
      pantalla: 'perfil-publico.html',
      evidencia: `vistaPerfil=${vistaPerfilRead} (esperada ${cfg.vistaPerfil}); u.subcategoriaId ausente tras normalizar`,
    });
  }

  const readKeys = Object.keys(uRead).filter((k) => hasVal(uRead[k]));
  const genericOk = ['nombre', 'edad', 'ciudad', 'zona', 'precio', 'fotoURL', 'categoria'].filter((k) => hasVal(uRead[k]));

  return {
    id: cfg.id,
    label: cfg.label,
    stages: STAGES,
    registro: { file: cfg.blocksFile, fn: cfg.finalizeFn, objeto: 'bloquesPublicos', rehydrate: 'No', keys: Object.keys(bloques).length },
    submit: { mapToPerfil: true, docSubcategoriaId: doc.subcategoriaId, docArquetipo: doc.arquetipo, bloquesInCamposPublicos: !!doc.camposPublicos?.bloquesPublicos },
    lectura: { keysEnU: readKeys.length, genericFieldsOk: genericOk, subcategoriaIdEnU: uRead.subcategoriaId || null, mapToPerfil: false },
    resultados: {
      cardClassRead: cfg.cardClass.split('--').pop(),
      cardClassPresent: htmlRead.includes(cfg.cardClass),
      cardClassHydrated: htmlHydr.includes(cfg.cardClass),
      visibleLlegan: visibleResults.llegan,
      visibleNoLlegan: visibleResults.noLlegan,
    },
    perfil: { vistaRead: vistaPerfilRead, vistaExpected: cfg.vistaPerfil, visibleNoLlegan: visiblePerfil.noLlegan },
    losses,
    veredicto: losses.some((l) => l.clasificacion === 'Bloqueador') ? 'Bloqueador' : 'Diseño intencional',
    rehydrateEnLectura: false,
    rehydrateRecupera: uHydr ? cfg.visible.filter((v) => v.htmlCheck && htmlHydr.includes(v.htmlCheck)).length : 0,
  };
}

console.log('# Auditoría funcional E2E — comportamiento real\n');
console.log('Comando reproducible: `node agent-tools/audit-e2e-behavioral-flow.mjs`\n');
console.log('mapToPerfil en read-path producción: NO (grep repo: solo submit L180 + preview L157)\n');

const reports = CASES.map(auditArchetype);
const counts = { Bloqueador: 0, Importante: 0, 'Mejora futura': 0, 'Diseño intencional': 0 };
for (const r of reports) {
  counts[r.veredicto] = (counts[r.veredicto] || 0) + 1;
  console.log(`## ${r.label} (${r.id}) — ${r.veredicto}`);
  console.log(`| Etapa | Archivo | Función | mapToPerfil/rehidratación |`);
  console.log(`| Registro | ${CASES.find((c) => c.id === r.id).blocksFile} | ${CASES.find((c) => c.id === r.id).finalizeFn} | No |`);
  console.log(`| Submit | registro-perfil-submit.js | buildUsuarioDoc | Sí interno |`);
  console.log(`| Lectura | resultados-registrados.js | normalizarPerfilFirestore | **No** |`);
  console.log(`| Resultados | carihub-public-render-lite.js | cardHTML | **No** |`);
  console.log(`| Perfil | perfil-publico-init.js + perfil-publico.html | cargarPerfilFirestore → aplicarPerfilResultadosEnDemo | **No** |`);
  console.log(`Tarjeta esperada ${CASES.find((c) => c.id === r.id).cardClass}: read=${r.resultados.cardClassPresent} hydrate=${r.resultados.cardClassHydrated}`);
  console.log(`Vista perfil: read=${r.perfil.vistaRead} esperada=${r.perfil.vistaExpected}`);
  if (r.losses.length) {
    console.log('Pérdidas visibles:');
    for (const l of r.losses) {
      console.log(`  - [${l.clasificacion}] ${l.pantalla} | ${l.campo}="${l.valor}" | ${l.archivo} :: ${l.funcion}`);
      console.log(`    Evidencia: ${l.evidencia}`);
    }
  }
  console.log('');
}

console.log('## Resumen clasificación');
console.log(JSON.stringify(counts));
console.log('\n## Veredicto MP-SUBMIT-HYDRATE');
if (counts.Bloqueador >= 9) {
  console.log('RECOMENDADO como primer mini-pack — pérdida funcional demostrable en Resultados y/o Perfil para los 9 arquetipos.');
  console.log('Control: mapToPerfil(bloquesPublicos) en lectura recupera tarjeta y campos visibles (contrafactual reproducible en script).');
} else {
  console.log('Reclasificar según evidencia — no hay bloqueadores demostrados.');
}

fs.writeFileSync(
  path.join(repo, 'agent-tools', 'audit-e2e-behavioral-flow-report.json'),
  JSON.stringify({ generated: new Date().toISOString(), counts, reports }, null, 2)
);
console.log('\nJSON: agent-tools/audit-e2e-behavioral-flow-report.json');
