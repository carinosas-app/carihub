/**
 * QA — Persistencia persona_creador / creadorPerfil.
 * node scripts/qa-creador-persist.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const root = path.join(repoRoot, 'public', 'js');

const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

function loadScript(relativePath, ctx) {
  vm.runInContext(fs.readFileSync(path.join(root, relativePath), 'utf8'), ctx, { filename: relativePath });
}

function makeCtx() {
  const ctx = {
    console,
    URL,
    document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] },
  };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  return ctx;
}

function loadAll() {
  const ctx = makeCtx();
  loadScript('carihub-viajes-desplazamiento.js', ctx);
  loadScript('data/registro-adultos-creador-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  return ctx;
}

function creadorCtx(subId) {
  return { subcategoriaId: subId, arquetipo: 'persona_creador', formularioId: 'adultos' };
}

function payload() {
  return {
    tiposContenido: ['Fotos exclusivas', 'Videos', 'Suscripción mensual'],
    plataformas: ['OnlyFans', 'Telegram VIP'],
    precioSuscripcion: '$299 MXN / mes',
    redesSociales: 'https://onlyfans.com/demo',
    serviciosIncluidos: ['Suscripción mensual', 'Contenido exclusivo'],
    serviciosNoRealizo: ['Encuentros presenciales', 'Servicios escort / sexuales'],
    horarioDetalle: 'Publico diario · lives semanales',
    metodosPago: ['Pago en línea', 'Transferencia'],
    sobreMi: 'Creadora verificada con contenido exclusivo.',
  };
}

const vmCtx = loadAll();
const PB = vmCtx.CariHubRegistroPublicBlocks;
const ctx = creadorCtx('contenido');

const vals = PB.finalizeCreadorValues(Object.assign({}, payload()), ctx);
ok('creadorPerfil nested', vals.creadorPerfil && Array.isArray(vals.creadorPerfil.tiposContenido), JSON.stringify(vals.creadorPerfil && vals.creadorPerfil.tiposContenido));
ok('sin dominatrixPerfil', !vals.dominatrixPerfil, 'clean');
ok('sin espectaculoPerfil', !vals.espectaculoPerfil, 'clean');
ok('sin swingerPerfil', !vals.swingerPerfil, 'clean');

const u = PB.mapCreadorToPerfil({ subcategoriaId: 'contenido', nombre: 'QA Creador' }, vals, ctx);
ok('map tipoServicio mirror', !!u.tipoServicio && u.tipoServicio.includes('Fotos exclusivas'), u.tipoServicio);
ok('map precio mirrors', u.precio === u.precioSuscripcion && u.precioDesde === u.precioSuscripcion, u.precio);
ok('map plataformas', Array.isArray(u.plataformas) && u.plataformas.includes('OnlyFans'), (u.plataformas || []).join(','));
ok('map noRealiza mirror', Array.isArray(u.noRealiza) && u.noRealiza.includes('Encuentros presenciales'), (u.noRealiza || []).join(','));
ok('arquetipo persona_creador', u.arquetipo === 'persona_creador', u.arquetipo);
ok('tipoPerfil creador', u.tipoPerfil === 'creador', u.tipoPerfil);
ok('nested preserved', u.creadorPerfil && u.creadorPerfil.horarioDetalle === 'Publico diario · lives semanales', 'nested');
ok('subcategoriaId canon contenido', u.subcategoriaId === 'contenido', u.subcategoriaId);
ok('sin modalidades escort', !u.modalidades, 'no modalidades');

const aliasCtx = creadorCtx('creador_contenido');
const aliasVals = PB.finalizeCreadorValues(Object.assign({}, payload()), aliasCtx);
const aliasU = PB.mapCreadorToPerfil({ subcategoriaId: 'creador_contenido' }, aliasVals, aliasCtx);
ok('creador_contenido persist as contenido', aliasU.subcategoriaId === 'contenido', aliasU.subcategoriaId);

const routeEarly = PB.mapToPerfil(
  { subcategoriaId: 'contenido' },
  Object.assign({}, payload(), { espectaculoPerfil: { tipoShow: ['x'] }, dominatrixPerfil: { estiloDominacion: 'x' } }),
  creadorCtx('contenido')
);
ok('mapToPerfil route creador early', routeEarly.arquetipo === 'persona_creador' && !routeEarly.espectaculoPerfil && !routeEarly.dominatrixPerfil, 'anti contamination');

ok('escort not creador pipeline', !PB.isCreadorSubcategoria({ subcategoriaId: 'escort' }), 'escort');

console.log('\n=== QA Creador persist ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
