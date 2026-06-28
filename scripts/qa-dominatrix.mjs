/**
 * QA — Pack persona_dominatrix motor/blocks (dominatrix / fetiche / sado).
 * node scripts/qa-dominatrix.mjs
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
  const code = fs.readFileSync(path.join(root, relativePath), 'utf8');
  vm.runInContext(code, ctx, { filename: relativePath });
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
  loadScript('data/registro-adultos-escort-blocks.js', ctx);
  loadScript('data/registro-adultos-pareja-blocks.js', ctx);
  loadScript('data/registro-adultos-lifestyle-blocks.js', ctx);
  loadScript('data/registro-adultos-dominatrix-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  return ctx;
}

function domCtx(subId) {
  return { subcategoriaId: subId, subcategoria: subId, arquetipo: 'persona_dominatrix', tipoPerfil: 'persona', formularioId: 'adultos' };
}

function mergedDom(vmCtx, subId) {
  const cfg = vmCtx.CariHubRegistroPublicBlocks.resolveConfig(domCtx(subId), null);
  return vmCtx.CariHubRegistroPublicBlocks.mergedConfig(cfg, domCtx(subId));
}

function hasField(merged, fieldId) {
  return merged.blocks.some((b) => b.fields.some((f) => f.id === fieldId));
}

function baseValid(subId) {
  return {
    estiloDominacion: 'Femdom',
    experienciaBdsm: '3–5 años',
    listaFetiches: ['Bondage', 'Roleplay'],
    limitesSesion: 'Sin menores · Sin sangre',
    equipamiento: ['Bondage / restricciones'],
    protocolo: ['SSC (Safe, Sane, Consensual)'],
    rolesAtendidos: ['Sumisos'],
    modalidadSesion: 'Presencial',
    espacioSesion: 'Dungeon / espacio propio',
    serviciosIncluidos: ['Femdom / Maledom', 'Bondage y restricción'],
    serviciosNoRealizo: ['Menores de edad'],
    modalidades: ['recibe'],
    metodosPago: ['Efectivo'],
    horarioDetalle: 'Con cita previa',
  };
}

const vmCtx = loadAll();
const PB = vmCtx.CariHubRegistroPublicBlocks;
const viajes = vmCtx.CariHubViajesDesplazamiento;

ok('blocks file loaded', !!vmCtx.CARIHUB_REGISTRO_DOMINATRIX_BLOCKS, 'persona_dominatrix');
ok('blocks id persona_dominatrix', vmCtx.CARIHUB_REGISTRO_DOMINATRIX_BLOCKS.id === 'persona_dominatrix', 'id');

DOM_3.forEach((subId) => {
  const cfg = PB.resolveConfig(domCtx(subId), null);
  ok(`${subId} resolveConfig`, cfg && cfg.id === 'persona_dominatrix', cfg && cfg.id);
  ok(`${subId} matchesDominatrix`, PB.matchesDominatrix(domCtx(subId), null), subId);
  ok(`${subId} not matchesEscort`, !PB.matchesEscort(domCtx(subId), null), subId);
  ok(`${subId} not matchesLifestyle`, !PB.matchesLifestyle(domCtx(subId), null), subId);
  ok(`${subId} not matchesPareja`, !PB.matchesPareja(domCtx(subId), null), subId);
  const merged = mergedDom(vmCtx, subId);
  ok(`${subId} merged blocks`, merged.blocks.length >= 4, String(merged.blocks.length));
  ok(`${subId} estiloDominacion field`, hasField(merged, 'estiloDominacion'), 'estilo');
  ok(`${subId} limitesSesion field`, hasField(merged, 'limitesSesion'), 'limites');
  ok(`${subId} servicios BDSM block`, hasField(merged, 'serviciosIncluidos'), 'servicios');
  ok(`${subId} no singlesPerfil`, !hasField(merged, 'buscanConocer'), 'no singles');
  ok(`${subId} no unicorn objetivos`, !hasField(merged, 'objetivosPerfil'), 'no unicorn');
  ok(`${subId} viajes activo`, viajes.subcategoriaActivaViajes(subId), 'viaja module');
  const modField = merged.blocks.flatMap((b) => b.fields).find((f) => f.id === 'modalidades');
  const modOpts = modField && modField.options ? modField.options.filter((opt) => {
    if (typeof opt === 'object' && opt.onlySubcategoriasViajes) {
      return viajes.subcategoriaActivaViajes(subId);
    }
    return true;
  }).map((o) => (typeof o === 'string' ? o : o.value)) : [];
  ok(`${subId} modalidades con viaja`, modOpts.includes('viaja'), modOpts.join(','));
  ok(`${subId} subcampos viajes`, merged.blocks.some((b) => b.fields.some((f) => f.id === 'alcanceDesplazamiento' && f.showWhenViaja)), 'alcance');
});

const feticheMerged = mergedDom(vmCtx, 'fetiche');
ok('fetiche listaFetiches oblig merge', feticheMerged.obligatorios.includes('listaFetiches'), feticheMerged.obligatorios.join(','));

const sadoMerged = mergedDom(vmCtx, 'sado');
ok('sado protocolo en blocks', hasField(sadoMerged, 'protocolo'), 'protocolo');

const invalidFetiche = PB.validateValues(mergedDom(vmCtx, 'fetiche'), Object.assign({}, baseValid('fetiche'), { listaFetiches: [] }), domCtx('fetiche'));
ok('fetiche validate exige listaFetiches', invalidFetiche.length > 0, String(invalidFetiche.length));

const validFetiche = PB.validateValues(mergedDom(vmCtx, 'fetiche'), baseValid('fetiche'), domCtx('fetiche'));
ok('fetiche validate ok payload', validFetiche.length === 0, validFetiche.join('; '));

const registroHtml = fs.readFileSync(path.join(repoRoot, 'public', 'registro-perfil.html'), 'utf8');
ok('registro-perfil script dominatrix blocks', registroHtml.includes('registro-adultos-dominatrix-blocks.js'), 'script tag');

console.log('\n=== QA Dominatrix motor/blocks ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
