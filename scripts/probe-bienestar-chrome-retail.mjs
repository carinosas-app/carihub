import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
function load(ctx, rel) { vm.runInContext(fs.readFileSync(path.join(publicDir, rel), "utf8"), ctx, { filename: rel }); }
const document = { body: { attrs: {}, setAttribute(k,v){this.attrs[k]=v;}, getAttribute(k){return this.attrs[k];} }, dispatchEvent(){}, createElement(){return {style:{},setAttribute(){},appendChild(){}};}, querySelector(){return null;}, getElementById(){return null;} };
const window = { document, CustomEvent: function(){}, console }; window.window = window; window.globalThis = window;
const ctx = vm.createContext(window);
["js/data/registro-schema-index.js","js/carihub-field-engine-lite.js","js/data/registro-sector-contract-registry.js","js/carihub-bienestar-sector-render.js","js/carihub-resultados-sector.js","js/resultados-demo.js"].forEach(r => load(ctx, r));
const cases = [
  { cat: "yoga", expectVista: "pro", expectName: /yoga/i, forbid: /hotel motel|tiposHabitacion/i },
  { cat: "turismo-espiritual", expectVista: "pro", expectName: /retiro|camino|sierra/i, forbid: /tiposHabitacion|tarifaNoche/i },
  { cat: "venta-de-inciensos", expectVista: "empresa", expectName: /humos|sahumer/i, forbid: /hotel|motel|reiki/i },
  { cat: "venta-de-aceites-esenciales", expectVista: "empresa", expectName: /esencia|aroma|aceite/i, forbid: /hotel|motel|reiki/i },
  { cat: "velas-esotericas", expectVista: "empresa", expectName: /vela|cera|luz/i, forbid: /hotel|motel|reiki/i },
  { cat: "spa", expectSector: "adultos" }
];
const report = { ok: true, cases: [] };
for (const c of cases) {
  const sector = window.CariHubResultadosSector.sectorDeCategoria(c.cat);
  const pres = window.CariHubFieldEngineLite.resolvePublicPresentation({ categoria: c.cat, subcategoriaId: window.CariHubFieldEngineLite.lookupSubcategoriaId(c.cat) });
  if (c.expectSector) {
    const pass = sector === c.expectSector; if (!pass) report.ok = false;
    report.cases.push({ cat: c.cat, pass, sector }); continue;
  }
  const list = window.CariHubResultadosDemo.plantillaDemoBienestar({ categoria: c.cat }, pres);
  const u = list[0];
  const blob = JSON.stringify(u);
  const pass = sector === "bienestar" && pres.vistaPerfil === c.expectVista && u && u.__vista === c.expectVista && c.expectName.test(u.nombre || "") && !c.forbid.test(blob) && !/Hidrosoluciones|plomer/i.test(blob);
  if (!pass) report.ok = false;
  report.cases.push({ cat: c.cat, pass, sector, vistaPres: pres.vistaPerfil, vistaU: u && u.__vista, nombre: u && u.nombre, pack: u && u.deltaPack });
}
console.log(JSON.stringify(report, null, 2));
process.exit(report.ok ? 0 : 1);
