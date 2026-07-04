/**
 * Auditoría de consolidación — sectores cerrados: Adultos, Eventos, Bienestar, Gastronomía, Profesionales
 * Solo lectura; no modifica código.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import vm from 'vm';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const JS = path.join(ROOT, 'public', 'js');

function loadScript(relPath) {
  const full = path.join(JS, relPath);
  const code = fs.readFileSync(full, 'utf8');
  const sandbox = {
    window: {},
    global: {},
    document: { getElementById: () => null, querySelector: () => null },
    console,
    setTimeout, clearTimeout, setInterval, clearInterval,
    FileReader: function () {}, File: function () {},
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    navigator: { userAgent: 'audit' },
    location: { href: '', search: '', hash: '' },
    history: { pushState: () => {}, replaceState: () => {} },
    performance: { now: () => Date.now() },
    MutationObserver: function () { this.observe = () => {}; this.disconnect = () => {}; },
    IntersectionObserver: function () { this.observe = () => {}; this.disconnect = () => {}; },
    ResizeObserver: function () { this.observe = () => {}; this.disconnect = () => {}; },
    CustomEvent: function (t, d) { return { type: t, detail: d && d.detail }; },
    Event: function (t) { return { type: t }; },
    requestAnimationFrame: (fn) => setTimeout(fn, 0),
    cancelAnimationFrame: clearTimeout,
    structuredClone: (v) => JSON.parse(JSON.stringify(v)),
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    TextEncoder, TextDecoder,
    Map, Set, WeakMap, WeakSet, Promise, Symbol, Proxy, Reflect,
    Array, Object, String, Number, Boolean, Date, Math, JSON, parseInt, parseFloat, isNaN, isFinite,
    Error, TypeError, RangeError, RegExp, Intl
  };
  sandbox.window = sandbox;
  sandbox.global = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: full });
  return sandbox;
}

function grepFile(rel, pattern) {
  const txt = fs.readFileSync(path.join(JS, rel), 'utf8');
  return pattern.test(txt);
}

function countSubsInDeltas(rel) {
  const full = path.join(JS, rel);
  if (!fs.existsSync(full)) return { exists: false, count: 0 };
  const txt = fs.readFileSync(full, 'utf8');
  const matches = txt.match(/subcategoriaId\s*:\s*['"][^'"]+['"]/g) || [];
  return { exists: true, count: matches.length };
}

const SECTORS = {
  adultos: {
    label: 'Adultos',
    blocks: null,
    deltas: null,
    nestedKey: 'arquetipo-specific (escortPerfil, parejaPerfil…)',
    sectorRender: null,
    demoPipeline: 'DEMO_POR_COMPONENTE + armarPerfil',
    componente: 'ResultCardAdultos / Pareja / etc.'
  },
  eventos: {
    label: 'Eventos',
    blocks: 'data/registro-eventos-blocks.js',
    deltas: 'data/registro-eventos-sub-deltas.js',
    nestedKey: 'eventosPerfil',
    sectorRender: 'carihub-eventos-sector-render.js',
    demoPipeline: 'DEMO_POR_COMPONENTE',
    componente: 'ResultCardNegocio (sector branch)'
  },
  bienestar: {
    label: 'Bienestar',
    blocks: 'data/registro-bienestar-blocks.js',
    deltas: 'data/registro-bienestar-sub-deltas.js',
    nestedKey: 'bienestarHolisticoPerfil',
    sectorRender: 'carihub-bienestar-sector-render.js',
    demoPipeline: 'plantillaDemoBienestar',
    componente: 'ResultCardNegocio (sector branch)'
  },
  gastronomia: {
    label: 'Gastronomía',
    blocks: 'data/registro-gastronomia-blocks.js',
    deltas: 'data/registro-gastronomia-sub-deltas.js',
    nestedKey: 'gastronomiaPerfil',
    sectorRender: null,
    demoPipeline: 'DEMO_POR_COMPONENTE',
    componente: 'ResultCardNegocio (generic cardHTMLNegocio)'
  },
  profesionales: {
    label: 'Profesionales',
    blocks: 'data/registro-profesionales-blocks.js',
    deltas: 'data/registro-profesionales-sub-deltas.js',
    nestedKey: 'profesionalesPerfil',
    sectorRender: null,
    demoPipeline: 'plantillaDemoProfesionales',
    componente: 'ResultCardProfesional'
  }
};

// Cross-sector blocks policy (static check)
const policySrc = fs.existsSync(path.join(JS, 'data/registro-sector-policy-runtime.js'))
  ? fs.readFileSync(path.join(JS, 'data/registro-sector-policy-runtime.js'), 'utf8')
  : '';
const hasColabPolicy = /CARIHUB_COLABORACION_CONTENIDO_POLICY/.test(policySrc);

const PROFILE_NESTED_KEYS = [
  'dominatrixPerfil', 'espectaculoPerfil', 'creadorPerfil', 'retailPerfil', 'venuePerfil',
  'bienestarPerfil', 'eventosPerfil', 'gastronomiaPerfil', 'saludPerfil', 'hospedajePerfil',
  'swingerPerfil', 'unicornPerfil', 'cuckoldHotwifePerfil', 'parejaGrupoPerfil'
];

const ALL_SECTOR_NESTED = [
  'bienestarHolisticoPerfil', 'eventosPerfil', 'gastronomiaPerfil', 'profesionalesPerfil',
  'saludPerfil', 'tecnologiaPerfil', 'automotrizPerfil', 'transportePerfil', 'comercioPerfil',
  'hogarPerfil', 'mascotasPerfil', 'bienesRaicesPerfil', 'educacionPerfil', 'industriaPerfil'
];

const missingFromClear = ALL_SECTOR_NESTED.filter(k => !PROFILE_NESTED_KEYS.includes(k));

const pubBlocksSrc = fs.readFileSync(path.join(JS, 'carihub-registro-public-blocks.js'), 'utf8');

function hasMapper(sector) {
  const patterns = {
    eventos: /function mapEventosSectorToPerfil/,
    bienestar: /function mapBienestarSectorToPerfil/,
    gastronomia: /function mapGastronomiaSectorToPerfil/,
    profesionales: /function mapProfesionalesSectorToPerfil/
  };
  return patterns[sector] ? patterns[sector].test(pubBlocksSrc) : null;
}

function hasFinalize(sector) {
  const patterns = {
    eventos: /function finalizeEventosSectorValues/,
    bienestar: /function finalizeBienestarSectorValues/,
    gastronomia: /function finalizeGastronomiaSectorValues/,
    profesionales: /function finalizeProfesionalesSectorValues/
  };
  return patterns[sector] ? patterns[sector].test(pubBlocksSrc) : null;
}

function mapsColaboracion(sector) {
  const fn = {
    eventos: /function mapEventosSectorToPerfil[\s\S]*?return u;\s*}/,
    bienestar: /function mapBienestarSectorToPerfil[\s\S]*?return u;\s*}/,
    gastronomia: /function mapGastronomiaSectorToPerfil[\s\S]*?return u;\s*}/,
    profesionales: /function mapProfesionalesSectorToPerfil[\s\S]*?return u;\s*}/,
  }[sector];
  if (!fn) return null;
  const m = pubBlocksSrc.match(fn);
  return m ? /colaboracionContenido/.test(m[0]) : false;
}

function hasNestedInBlocks(blocksPath, nestedKey) {
  if (!blocksPath) return null;
  const full = path.join(JS, blocksPath);
  if (!fs.existsSync(full)) return false;
  const txt = fs.readFileSync(full, 'utf8');
  return txt.includes(`nestedProfileKey: '${nestedKey}'`) ||
    txt.includes(`nestedProfileKey: "${nestedKey}"`) ||
    txt.includes(`NESTED_PROFILE_KEY = '${nestedKey}'`);
}

const cardContractSrc = fs.readFileSync(path.join(JS, 'carihub-resultados-card-contract.js'), 'utf8');
const demoSrc = fs.readFileSync(path.join(JS, 'resultados-demo.js'), 'utf8');
const renderLiteSrc = fs.readFileSync(path.join(JS, 'carihub-public-render-lite.js'), 'utf8');

const sectorReport = {};
for (const [id, cfg] of Object.entries(SECTORS)) {
  const deltas = cfg.deltas ? countSubsInDeltas(cfg.deltas) : { exists: false, count: 0 };
  sectorReport[id] = {
    label: cfg.label,
    blocksFile: cfg.blocks || 'N/A (arquetipos adultos)',
    deltasFile: cfg.deltas || 'N/A',
    deltaSubCount: deltas.count,
    nestedProfileKey: cfg.nestedKey,
    nestedKeyInBlocks: cfg.blocks ? hasNestedInBlocks(cfg.blocks, cfg.nestedKey) : 'arquetipo',
    sectorRenderFile: cfg.sectorRender,
    sectorRenderExists: cfg.sectorRender ? fs.existsSync(path.join(JS, cfg.sectorRender)) : false,
    mapToPerfil: hasMapper(id),
    finalizeValues: hasFinalize(id),
    mapsColaboracionEnMapper: mapsColaboracion(id),
    demoPipeline: cfg.demoPipeline,
    hasDedicatedDemo: id === 'bienestar' ? /plantillaDemoBienestar/.test(demoSrc)
      : id === 'profesionales' ? /plantillaDemoProfesionales/.test(demoSrc)
      : id === 'eventos' ? /plantillaDemoEventos/.test(demoSrc)
      : id === 'gastronomia' ? /plantillaDemoGastronomia/.test(demoSrc)
      : /DEMO_POR_COMPONENTE/.test(demoSrc),
    cardContractNestedGuard: id === 'profesionales' ? /NESTED_SOLO_PROFESIONALES/.test(cardContractSrc)
      : id === 'bienestar' ? /NESTED_SOLO_BIENESTAR/.test(cardContractSrc)
      : id === 'eventos' ? /NESTED_SOLO_EVENTOS/.test(cardContractSrc)
      : id === 'gastronomia' ? /NESTED_SOLO_GASTRONOMIA/.test(cardContractSrc)
      : 'adultos-native',
    renderRoute: id === 'bienestar' ? /cardHTMLBienestarSector/.test(renderLiteSrc)
      : id === 'eventos' ? /cardHTMLEventosSector/.test(renderLiteSrc)
      : id === 'profesionales' ? /cardHTMLProfesional/.test(renderLiteSrc)
      : id === 'gastronomia' ? /cardHTMLNegocio/.test(renderLiteSrc)
      : 'cardHTML* adultos'
  };
}

// Cross-sector blocks policy (append via mergedConfig)
const appendCrossInMerged = /appendCrossSectorBlocks/.test(pubBlocksSrc);

// Private screen: registro-perfil.html
const registroHtml = fs.readFileSync(path.join(ROOT, 'public', 'registro-perfil.html'), 'utf8');
const twoScreenModel = {
  publicHost: /rpDynamicPublicHost/.test(registroHtml),
  privateStep: /Datos privados/.test(registroHtml),
  privateScript: /carihub-private-fields-lite/.test(registroHtml)
};

// Duplicate build*SectorPerfil count
const buildFns = (pubBlocksSrc.match(/function build\w+SectorPerfil/g) || []).length;
const mapFns = (pubBlocksSrc.match(/function map\w+SectorToPerfil/g) || []).length;
const finalizeFns = (pubBlocksSrc.match(/function finalize\w+SectorValues/g) || []).length;

const report = {
  generatedAt: new Date().toISOString(),
  scope: 'Consolidación global — 5 sectores de referencia',
  twoScreenModel,
  crossSector: {
    colabPolicyLoaded: hasColabPolicy,
    appendCrossSectorBlocksInMergedConfig: appendCrossInMerged,
    mergedConfigAlwaysUsedForRender: /renderBlocks\(host, mergedConfig/.test(pubBlocksSrc)
  },
  antiContamination: {
    profileNestedKeysCount: PROFILE_NESTED_KEYS.length,
    sectorNestedKeysMissingFromClear: missingFromClear,
    cardContractNestedGuards: {
      profesionales: /NESTED_SOLO_PROFESIONALES/.test(cardContractSrc),
      bienestar: /NESTED_SOLO_BIENESTAR/.test(cardContractSrc),
      eventos: /NESTED_SOLO_EVENTOS/.test(cardContractSrc),
      gastronomia: /NESTED_SOLO_GASTRONOMIA/.test(cardContractSrc)
    }
  },
  duplicationMetrics: {
    buildSectorPerfilFunctions: buildFns,
    mapSectorToPerfilFunctions: mapFns,
    finalizeSectorValuesFunctions: finalizeFns,
    sectorRenderModules: fs.readdirSync(JS).filter(f => /carihub-.*-sector-render\.js$/.test(f))
  },
  sectors: sectorReport
};

const outPath = path.join(ROOT, 'agent-tools', 'audit-consolidacion-registro-global-report.json');
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
console.error('\nReport written:', outPath);
