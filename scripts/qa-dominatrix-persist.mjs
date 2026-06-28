/**
 * QA — Persistencia persona_dominatrix / dominatrixPerfil.
 * node scripts/qa-dominatrix-persist.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const root = path.join(repoRoot, 'public', 'js');

const DOM_3 = ['dominatrix', 'fetiche', 'sado'];

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
  loadScript('data/registro-adultos-dominatrix-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  return ctx;
}

function domCtx(subId) {
  return { subcategoriaId: subId, arquetipo: 'persona_dominatrix', formularioId: 'adultos' };
}

function payload(subId) {
  return {
    estiloDominacion: 'Femdom',
    experienciaBdsm: '5+ años',
    listaFetiches: ['Bondage', 'Impact play'],
    limitesSesion: 'Sin menores',
    equipamiento: ['Bondage / restricciones', 'Impact play (flogger, paddle)'],
    protocolo: ['SSC (Safe, Sane, Consensual)', 'Aftercare incluido'],
    rolesAtendidos: ['Sumisos', 'Switches'],
    modalidadSesion: 'Presencial',
    espacioSesion: 'Dungeon / espacio propio',
    serviciosIncluidos: ['Femdom / Maledom', 'Impact play'],
    serviciosNoRealizo: ['Menores de edad', 'Servicios sexuales convencionales'],
    modalidades: ['recibe', 'hotel'],
    metodosPago: ['Efectivo'],
    horarioDetalle: 'Lun–Sáb con cita',
    sobreMi: 'Sesiones BDSM consensuadas.',
    idiomas: 'Español',
  };
}

const vmCtx = loadAll();
const PB = vmCtx.CariHubRegistroPublicBlocks;

DOM_3.forEach((subId) => {
  const ctx = domCtx(subId);
  const vals = PB.finalizeDominatrixValues(Object.assign({}, payload(subId)), ctx);
  ok(`${subId} dominatrixPerfil nested`, vals.dominatrixPerfil && vals.dominatrixPerfil.estiloDominacion === 'Femdom', JSON.stringify(vals.dominatrixPerfil && vals.dominatrixPerfil.estiloDominacion));
  ok(`${subId} sin swingerPerfil`, !vals.swingerPerfil, 'clean');
  ok(`${subId} sin unicornPerfil`, !vals.unicornPerfil, 'clean');
  ok(`${subId} sin cuckoldHotwifePerfil`, !vals.cuckoldHotwifePerfil, 'clean');
  const u = PB.mapDominatrixToPerfil({ subcategoriaId: subId, nombre: 'QA DOM' }, vals, ctx);
  ok(`${subId} map especialidadBdsm mirror`, !!u.especialidadBdsm && u.especialidadBdsm.includes('Femdom'), u.especialidadBdsm);
  ok(`${subId} map estiloDominacion`, u.estiloDominacion === 'Femdom', u.estiloDominacion);
  ok(`${subId} map noRealiza mirror`, Array.isArray(u.noRealiza) && u.noRealiza.includes('Menores de edad'), (u.noRealiza || []).join(','));
  ok(`${subId} arquetipo persona_dominatrix`, u.arquetipo === 'persona_dominatrix', u.arquetipo);
  ok(`${subId} nested preserved`, u.dominatrixPerfil && u.dominatrixPerfil.limitesSesion === 'Sin menores', 'nested');
});

const viajaRaw = Object.assign({}, payload('dominatrix'), {
  modalidades: ['recibe', 'viaja'],
  alcanceDesplazamiento: 'toda_ciudad',
  viajesProgramados: 'si',
  gastosTraslado: 'cliente',
  anticipacionViaje: '48h',
});
viajaRaw.viajesDesplazamiento = vmCtx.CariHubViajesDesplazamiento.buildViajesDesplazamiento(viajaRaw, viajaRaw.modalidades);
const viajaFinal = PB.finalizeDominatrixValues(Object.assign({}, viajaRaw), domCtx('dominatrix'));
ok('dominatrix viajes nested', viajaFinal.dominatrixPerfil && viajaFinal.dominatrixPerfil.viajesDesplazamiento &&
  viajaFinal.dominatrixPerfil.viajesDesplazamiento.viaja === true, 'viajesDesplazamiento');
const viajaU = PB.mapDominatrixToPerfil({ subcategoriaId: 'dominatrix', nombre: 'QA DOM V' }, viajaFinal, domCtx('dominatrix'));
ok('dominatrix map viajesDesplazamiento', viajaU.viajesDesplazamiento && viajaU.viajesDesplazamiento.viaja === true, JSON.stringify(viajaU.viajesDesplazamiento));
ok('dominatrix map modalidad viaja', (viajaU.modalidades || []).includes('viaja'), (viajaU.modalidades || []).join(','));

const escortPolluted = PB.mapToPerfil(
  { subcategoriaId: 'dominatrix' },
  Object.assign({}, payload('dominatrix'), { swingerPerfil: { intercambioSwinger: 'Sí' } }),
  domCtx('dominatrix')
);
ok('mapToPerfil route dominatrix early', escortPolluted.arquetipo === 'persona_dominatrix' && !escortPolluted.swingerPerfil, 'anti swinger');

ok('escort not dominatrix pipeline', !PB.isDominatrixSubcategoria({ subcategoriaId: 'escort' }), 'escort');

console.log('\n=== QA Dominatrix persist ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
