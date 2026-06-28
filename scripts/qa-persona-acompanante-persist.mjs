/**
 * QA — Pack persona_acompanante persistencia + preview (sin browser).
 * node scripts/qa-persona-acompanante-persist.mjs
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
  try {
    vm.runInContext(code, ctx, { filename: relativePath });
  } catch (e) {
    throw new Error(relativePath + ': ' + e.message);
  }
}

function makeCtx() {
  const ctx = {
    console,
    URL,
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] },
  };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  return ctx;
}

function loadStack(ctx) {
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

function escortCtx(subId, label) {
  return {
    subcategoriaId: subId,
    subcategoria: label || subId,
    arquetipo: 'persona_acompanante',
    tipoPerfil: 'persona',
    formularioId: 'adultos',
    categoriaPrincipal: 'Adultos',
  };
}

function baseShell() {
  return {
    modalidades: ['recibe'],
    serviciosIncluidos: ['Oral', 'Masaje'],
    serviciosNoRealizo: ['Menores de edad'],
    estatura: '1.65 m',
    peso: '55 kg',
    metodosPago: ['Efectivo'],
    sobreMi: 'Perfil QA persistencia escort.',
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
  out = RP.finalizeEdecanValues(out, ctx);
  out = RP.finalizeModelosValues(out, ctx);
  if (String(out.haceColaboraciones || '').trim() === 'No') delete out.colaboraCon;
  out.viajesDesplazamiento = V.buildViajesDesplazamiento(out, out.modalidades || []);
  if (!out.viajesDesplazamiento.viaja) {
    V.viajesFieldIds().forEach((k) => delete out[k]);
  }
  return out;
}

function buildDraft(alias, bloques, ctx) {
  return {
    contexto: ctx,
    schemaResuelto: {
      identidad: {
        arquetipo: 'persona_acompanante',
        tipoPerfil: 'persona',
        formularioId: 'adultos',
      },
    },
    camposPublicos: {
      alias,
      descripcionCorta: 'Perfil QA',
      precioDesde: '2000',
      pais: 'México',
      estado: 'Nuevo León',
      ciudad: 'Monterrey',
      zona: 'Centro',
      edad: 27,
      bloquesPublicos: bloques,
    },
    contactoPublico: {},
    mensajeContactoPublicidad: '',
  };
}

function simulatePreview(vmCtx, bloques, ctx) {
  const RP = vmCtx.CariHubRegistroPublicBlocks;
  let u = {
    subcategoriaId: ctx.subcategoriaId,
    alias: bloques.alias || 'QA',
    tagline: 'Perfil QA',
    ciudad: 'Monterrey',
  };
  u = RP.mapToPerfil(u, bloques, ctx);
  if (RP.applySwingerPerfilFields) u = RP.applySwingerPerfilFields(u, bloques, ctx);
  if (RP.applyCuckoldHotwifePerfilFields) u = RP.applyCuckoldHotwifePerfilFields(u, bloques, ctx);
  if (RP.applyUnicornPerfilFields) u = RP.applyUnicornPerfilFields(u, bloques, ctx);
  return u;
}

function assertEscortPersonaDoc(doc, label) {
  ok(`${label} tipoPerfil persona`, doc.tipoPerfil === 'persona', doc.tipoPerfil);
  ok(`${label} arquetipo persona_acompanante`, doc.arquetipo === 'persona_acompanante', doc.arquetipo);
  ok(`${label} sin cuckoldHotwifePerfil`, doc.cuckoldHotwifePerfil == null, JSON.stringify(doc.cuckoldHotwifePerfil));
  ok(`${label} sin swingerPerfil`, doc.swingerPerfil == null, JSON.stringify(doc.swingerPerfil));
  ok(`${label} sin unicornPerfil`, doc.unicornPerfil == null, JSON.stringify(doc.unicornPerfil));
  ok(`${label} sin parejaGrupoPerfil`, doc.parejaGrupoPerfil == null, JSON.stringify(doc.parejaGrupoPerfil));
  ok(`${label} sin dinamica pareja`, !doc.dinamica, doc.dinamica || 'vacío');
}

const CASES = [
  {
    key: 'escort',
    ctx: escortCtx('escort'),
    alias: 'Escort QA',
    delta: { realizaTrios: 'Sí', colaboracionContenido: 'No' },
    expect: (doc) => {
      ok('escort realizaTrios', doc.realizaTrios === 'Sí', doc.realizaTrios);
      ok('escort modalidades', Array.isArray(doc.modalidades) && doc.modalidades.includes('recibe'), JSON.stringify(doc.modalidades));
    },
  },
  {
    key: 'escort_vip',
    ctx: escortCtx('escort vip', 'Escort VIP'),
    alias: 'VIP QA',
    delta: {
      nivelPremium: 'VIP · Alto nivel',
      experienciaVip: ['Eventos sociales'],
      distintivosVip: ['Discreción'],
    },
    expect: (doc) => {
      ok('vip nivelPremium', !!doc.nivelPremium, doc.nivelPremium);
      ok('vip badgeVip', doc.badgeVip === true, String(doc.badgeVip));
      ok('vip experienciaVip', Array.isArray(doc.experienciaVip) && doc.experienciaVip.length, JSON.stringify(doc.experienciaVip));
    },
  },
  {
    key: 'escort_gay',
    ctx: escortCtx('escort gay', 'Escort Gay'),
    alias: 'Gay QA',
    delta: { orientacion: 'Gay', rolInteraccion: 'Versátil' },
    expect: (doc) => {
      ok('gay orientacion', doc.orientacion === 'Gay', doc.orientacion);
      ok('gay rolInteraccion', doc.rolInteraccion === 'Versátil', doc.rolInteraccion);
      ok('gay badgeLgbt', doc.badgeLgbt === true, String(doc.badgeLgbt));
    },
  },
  {
    key: 'edecan',
    ctx: escortCtx('edecan'),
    alias: 'Edecan QA',
    delta: {
      eventosDisponibles: true,
      modalidades: ['evento_venue'],
      tiposEvento: ['Evento corporativo'],
      experienciaProfesional: 'Intermedia',
      serviciosProfesionales: ['Atención a invitados'],
      restriccionesProfesionales: ['Servicios íntimos'],
    },
    expect: (doc) => {
      ok('edecan eventosDisponibles', doc.eventosDisponibles === true, String(doc.eventosDisponibles));
      ok('edecan serviciosIncluidos pro', Array.isArray(doc.serviciosIncluidos) && doc.serviciosIncluidos[0] === 'Atención a invitados', JSON.stringify(doc.serviciosIncluidos));
      ok('edecan edecanPerfil', doc.edecanPerfil && Array.isArray(doc.edecanPerfil.tiposEvento), JSON.stringify(doc.edecanPerfil));
    },
  },
  {
    key: 'modelos',
    ctx: escortCtx('modelos'),
    alias: 'Modelo QA',
    delta: {
      portfolioURL: 'https://example.com/portfolio',
      modalidades: ['estudio'],
      tiposModelaje: ['Fotografía'],
      experienciaProfesional: 'Intermedia',
      serviciosProfesionales: ['Sesión fotográfica'],
      restriccionesProfesionales: ['Contenido explícito'],
    },
    expect: (doc) => {
      ok('modelos portfolioURL', doc.portfolioURL === 'https://example.com/portfolio', doc.portfolioURL);
      ok('modelos modelosPerfil', doc.modelosPerfil && Array.isArray(doc.modelosPerfil.tiposModelaje), JSON.stringify(doc.modelosPerfil));
    },
  },
  {
    key: 'gigolo',
    ctx: escortCtx('gigolo'),
    alias: 'Gigolo QA',
    delta: {},
    expect: (doc) => ok('gigolo servicios', String(doc.servicios || '').includes('Oral'), doc.servicios),
  },
  {
    key: 'acompanante',
    ctx: escortCtx('acompanante'),
    alias: 'Acomp QA',
    delta: {},
    expect: (doc) => ok('acompanante modalidades', Array.isArray(doc.modalidades), JSON.stringify(doc.modalidades)),
  },
  {
    key: 'petit',
    ctx: escortCtx('petit'),
    alias: 'Petit QA',
    delta: { estatura: '1.55 m' },
    expect: (doc) => ok('petit estatura', doc.estatura === '1.55 m', doc.estatura),
  },
  {
    key: 'trans',
    ctx: escortCtx('trans'),
    alias: 'Trans QA',
    delta: { identidadGenero: 'Mujer trans' },
    expect: (doc) => ok('trans identidadGenero', doc.identidadGenero === 'Mujer trans', doc.identidadGenero),
  },
  {
    key: 'lesbians',
    ctx: escortCtx('lesbians'),
    alias: 'Lesbians QA',
    delta: {
      orientacion: 'Lesbiana',
      atiendoA: 'Mujeres',
      haceColaboraciones: 'Sí',
      colaboraCon: ['Mujeres'],
      mostrarAtiendoA: 'Sí',
      mostrarColaboraciones: 'Sí',
    },
    expect: (doc) => {
      ok('lesbians atiendoA', doc.atiendoA === 'Mujeres', doc.atiendoA);
      ok('lesbians colaboraCon', Array.isArray(doc.colaboraCon) && doc.colaboraCon[0] === 'Mujeres', JSON.stringify(doc.colaboraCon));
      ok('lesbians badgeLgbt', doc.badgeLgbt === true, String(doc.badgeLgbt));
    },
  },
  {
    key: 'singles',
    ctx: escortCtx('singles'),
    alias: 'Single QA',
    delta: (() => {
      const d = {
        buscanConocer: ['Parejas'],
        tipoCitaPreferida: ['Cena'],
        personalidadPredominante: 'Tranquila',
        estiloPersonal: 'Casual',
        disponibilidadAgenda: ['Entre semana'],
      };
      return d;
    })(),
    shellOverride: { modalidades: undefined, serviciosIncluidos: undefined, serviciosNoRealizo: undefined },
    expect: (doc) => {
      ok('singles buscanConocer', Array.isArray(doc.buscanConocer) && doc.buscanConocer[0] === 'Parejas', JSON.stringify(doc.buscanConocer));
      ok('singles mirror buscan', Array.isArray(doc.buscan) && doc.buscan[0] === 'Parejas', JSON.stringify(doc.buscan));
      ok('singles sin modalidades oblig persist', !Array.isArray(doc.modalidades) || doc.modalidades.length === 0, JSON.stringify(doc.modalidades));
    },
  },
  {
    key: 'femboy',
    ctx: escortCtx('femboy'),
    alias: 'Femboy QA',
    delta: {
      presentacionFemboy: 'Andrógino',
      estiloPredominante: 'Kawaii',
      disponibilidadAgenda: ['Entre semana'],
      disponiblePara: ['Citas'],
    },
    shellOverride: { modalidades: undefined, serviciosIncluidos: undefined, serviciosNoRealizo: undefined },
    expect: (doc) => {
      ok('femboy presentacionFemboy', doc.presentacionFemboy === 'Andrógino', doc.presentacionFemboy);
      ok('femboy identidadGenero mirror', doc.identidadGenero === 'Andrógino', doc.identidadGenero);
      ok('femboy disponiblePara', Array.isArray(doc.disponiblePara) && doc.disponiblePara.includes('Citas'), JSON.stringify(doc.disponiblePara));
      ok('femboy badgeLgbt', doc.badgeLgbt === true, String(doc.badgeLgbt));
    },
  },
  {
    key: 'tom_boy',
    ctx: escortCtx('tom boy', 'Tom Boy'),
    alias: 'Tom Boy QA',
    delta: {
      presentacionTom: 'Andrógina',
      estiloPredominante: 'Urbano',
      personalidad: 'Aventurera',
      pasatiempos: 'Música',
    },
    expect: (doc) => {
      ok('tom_boy presentacionTom', doc.presentacionTom === 'Andrógina', doc.presentacionTom);
      ok('tom_boy personalidad', doc.personalidad === 'Aventurera', doc.personalidad);
      ok('tom_boy badgeLgbt', doc.badgeLgbt === true, String(doc.badgeLgbt));
    },
  },
  {
    key: 'tom_fem',
    ctx: escortCtx('tom fem', 'Tom Fem'),
    alias: 'Tom Fem QA',
    delta: {
      presentacionTom: 'Muy femenina',
      estiloPredominante: 'Glamour',
      personalidad: 'Elegante',
    },
    expect: (doc) => {
      ok('tom_fem estiloPredominante', doc.estiloPredominante === 'Glamour', doc.estiloPredominante);
      ok('tom_fem subcategoriaId preservado', doc.subcategoriaId === 'tom fem', doc.subcategoriaId);
    },
  },
];

let ctx;

try {
  ctx = makeCtx();
  loadStack(ctx);
  const Submit = ctx.CariHubRegistroPerfilSubmit;
  ok('load submit', !!Submit && !!Submit.buildUsuarioDoc, 'submit');

  const priv = { correoAcceso: 'pa@example.com', mayorEdadConfirmado: true };

  for (const c of CASES) {
    const shell = { ...baseShell(), ...(c.shellOverride || {}), ...c.delta, alias: c.alias };
    const bloques = simulateBloques(ctx, shell, c.ctx);
    const doc = Submit.buildUsuarioDoc(`uid_${c.key}`, buildDraft(c.alias, bloques, c.ctx), priv, {}, {});
    assertEscortPersonaDoc(doc, c.key);
    c.expect(doc);

    const preview = simulatePreview(ctx, bloques, c.ctx);
    ok(`${c.key} preview sin cuckoldHotwifePerfil`, !preview.cuckoldHotwifePerfil, 'preview');
    ok(`${c.key} preview subcategoriaId`, preview.subcategoriaId === c.ctx.subcategoriaId, preview.subcategoriaId);
  }

  const viajesCtx = escortCtx('escort');
  const viajesBloques = simulateBloques(ctx, {
    ...baseShell(),
    modalidades: ['recibe', 'viaja'],
    alcanceDesplazamiento: 'toda_ciudad',
    viajesProgramados: 'si',
    gastosTraslado: 'cliente',
    anticipacionViaje: '48h',
  }, viajesCtx);
  const viajesDoc = Submit.buildUsuarioDoc('uid_viajes', buildDraft('Viajes QA', viajesBloques, viajesCtx), priv, {}, {});
  ok('escort viajes nested', viajesDoc.viajesDesplazamiento && viajesDoc.viajesDesplazamiento.viaja === true, JSON.stringify(viajesDoc.viajesDesplazamiento));

  const tomViajes = simulateBloques(ctx, {
    ...baseShell(),
    presentacionTom: 'Masculina',
    modalidades: ['viaja'],
    alcanceDesplazamiento: 'solo_zona',
    viajesProgramados: 'a_convenir',
    gastosTraslado: 'se_acuerda',
    anticipacionViaje: '24h',
  }, escortCtx('tom boy', 'Tom Boy'));
  ok('tom_boy viajes activo', tomViajes.viajesDesplazamiento && tomViajes.viajesDesplazamiento.viaja === true, JSON.stringify(tomViajes.viajesDesplazamiento));

  const previewJs = fs.readFileSync(path.join(root, 'registro-perfil-preview.js'), 'utf8');
  ok('preview no fuerza cuckold_hotwife en escort', !previewJs.includes("subcategoriaId = 'cuckold_hotwife'") || previewJs.includes('isCuckoldHotwifeSubcategoria'), 'guard preview');
} catch (e) {
  fail.push({ name: 'EXCEPTION', detail: e.stack || e.message });
}

console.log('\n=== QA persona_acompanante (persist) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
