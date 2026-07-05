/**
 * QA — P0-3 filtro unificado categoría/subcategoría + geo.
 * node scripts/qa-perfil-busqueda-filtro.mjs
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

const pass = [];
const fail = [];
function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

const ctx = makeCtx();
load('data/registro-schema-index.js', ctx);
load('carihub-subcategoria-labels.js', ctx);
load('catalogos-carihub.js', ctx);
load('carihub-field-engine-lite.js', ctx);
load('carihub-perfil-busqueda-filtro.js', ctx);
load('resultados-registrados.js', ctx);
load('resultados-demo.js', ctx);

const F = ctx.CariHubPerfilBusquedaFiltro;
const Demo = ctx.CariHubResultadosDemo;
const Reg = ctx.CariHubResultadosRegistrados;

ok('API exportada — perfilCoincideFiltros', typeof F?.perfilCoincideFiltros === 'function', 'API');
ok('API exportada — filtrarPerfiles', typeof F?.filtrarPerfiles === 'function', 'API');
ok('demo delega coincideBusqueda', typeof Demo?.coincideBusqueda === 'function', 'demo');
ok('registrados delega filtrar', typeof Reg?.filtrar === 'function', 'reg');

const perfilCarinosas = {
  categoria: 'Cariñosas',
  pais: 'México',
  estado: 'Nuevo León',
  ciudad: 'Monterrey',
};
const perfilSaludLegacy = {
  categoria: 'Salud',
  categoriaPublica: 'Doctor general',
  subcategoriaId: 'doctor general',
  sectorId: 'salud',
  pais: 'México',
  estado: 'Nuevo León',
  ciudad: 'Monterrey',
};
const perfilSpa = {
  categoria: 'Spa',
  subcategoriaId: 'spa',
  pais: 'México',
  estado: 'Jalisco',
  ciudad: 'Guadalajara',
};
const perfilZona = {
  categoria: 'Cariñosas',
  pais: 'México',
  estado: 'Nuevo León',
  ciudad: 'Monterrey',
  zona: 'Centro',
};

ok('categoría label', F.perfilCoincideFiltros(perfilCarinosas, { categoria: 'Cariñosas', pais: 'México' }), 'Cariñosas');
ok('subcategoriaId salud', F.perfilCoincideFiltros(perfilSaludLegacy, { categoria: 'doctor general', pais: 'México' }), 'doctor general');
ok('legacy categoriaPublica', F.perfilCoincideFiltros(perfilSaludLegacy, { categoria: 'Doctor general', pais: 'México' }), 'Doctor general');
ok('país exacto', F.perfilCoincideFiltros(perfilCarinosas, { categoria: 'Cariñosas', pais: 'México' }), 'México');
ok('país rechaza otro', !F.perfilCoincideFiltros(perfilCarinosas, { categoria: 'Cariñosas', pais: 'Colombia' }), 'Colombia');
ok('estado parcial', F.perfilCoincideFiltros(perfilCarinosas, { categoria: 'Cariñosas', pais: 'México', estado: 'nuevo leon' }), 'nuevo leon');
ok('ciudad parcial', F.perfilCoincideFiltros(perfilCarinosas, { categoria: 'Cariñosas', pais: 'México', estado: 'Nuevo León', ciudad: 'Monter' }), 'Monter');
ok('ciudad+zona', F.perfilCoincideFiltros(perfilZona, { categoria: 'Cariñosas', pais: 'México', estado: 'Nuevo León', ciudad: 'Centro' }), 'Centro');
ok('combo cat+geo', F.perfilCoincideFiltros(perfilCarinosas, {
  categoria: 'Cariñosas',
  pais: 'México',
  estado: 'Nuevo León',
  ciudad: 'Monterrey',
}), 'combo');
ok('sentinel Todas/Todos', F.perfilCoincideFiltros(perfilSpa, { categoria: 'Todas', pais: 'México', estado: 'Todos', ciudad: 'Todas' }), 'sentinel');
ok('anti-fuga subcat', !F.perfilCoincideFiltros(perfilSpa, { categoria: 'doctor general', pais: 'México' }), 'spa vs doctor');

const lista = [perfilCarinosas, perfilSaludLegacy, perfilSpa, perfilZona];
const filtrados = F.filtrarPerfiles(lista, { categoria: 'Cariñosas', pais: 'México', estado: 'Nuevo León' });
ok('filtrarPerfiles cuenta', filtrados.length === 2, String(filtrados.length));

const viaDemo = Demo.coincideBusqueda(perfilSaludLegacy, { categoria: 'doctor general', pais: 'México', estado: 'Nuevo León', ciudad: 'Monterrey' });
ok('demo coincideBusqueda salud', viaDemo, 'demo salud');

const viaReg = Reg.filtrar(lista, { categoria: 'doctor general', pais: 'México' });
ok('registrados filtrar salud', viaReg.length === 1 && viaReg[0].subcategoriaId === 'doctor general', String(viaReg.length));

const mockClub = {
  categoria: 'Antro',
  pais: 'México',
  estado: 'Nuevo León',
  ciudad: 'Monterrey',
};
ok('mock dashboard Antro MTY', F.perfilCoincideFiltros(mockClub, {
  categoria: 'Antro',
  pais: 'México',
  estado: 'Nuevo León',
  ciudad: 'Monterrey',
}), 'mock');

console.log('\n=== QA PERFIL-BUSQUEDA-FILTRO — P0-3 ===\n');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? `— ${p.detail}` : ''));
if (fail.length) {
  console.log('\nFAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log(`\nTodos los checks pasaron (${pass.length})\n`);
