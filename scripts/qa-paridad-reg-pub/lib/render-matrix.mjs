import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { slugSubId } from './slug.mjs';
import { REPO } from './vm-pipeline-context.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const LAYOUT_SHELLS = [
  'ProfileLayoutAdultos',
  'ProfileLayoutEspectaculo',
  'ProfileLayoutCreador',
  'ProfileLayoutNegocio',
  'ProfileLayoutVenue',
  'ProfileLayoutPareja',
  'ProfileLayoutServicio',
  'ProfileLayoutProfesional',
];

const SECTOR_RENDER_MODULES = {
  adultos: null,
  restaurantes: 'public/js/carihub-gastronomia-sector-render.js',
  automotriz: 'public/js/carihub-automotriz-sector-render.js',
  'bienes-raices': 'public/js/carihub-bienes-raices-sector-render.js',
  bienestar: 'public/js/carihub-bienestar-sector-render.js',
  comercio: 'public/js/carihub-comercio-sector-render.js',
  educacion: 'public/js/carihub-educacion-sector-render.js',
  eventos: 'public/js/carihub-eventos-sector-render.js',
  hogar: 'public/js/carihub-hogar-sector-render.js',
  industria: 'public/js/carihub-industria-sector-render.js',
  mascotas: 'public/js/carihub-mascotas-sector-render.js',
  profesionales: 'public/js/carihub-profesionales-sector-render.js',
  salud: 'public/js/carihub-salud-sector-render.js',
  tecnologia: 'public/js/carihub-tecnologia-sector-render.js',
  transporte: 'public/js/carihub-transporte-sector-render.js',
};

const VISTA_BY_SUB = {
  'medicos-generales': { vista: 'medico', dataVista: 'medico', tema: 'pro', dataPerfilTipo: 'medico' },
  abogados: { vista: 'pro', dataVista: 'pro', tema: 'pro', dataPerfilTipo: 'pro' },
  psicopedagogo: { vista: 'medico', dataVista: 'medico', tema: 'pro', dataPerfilTipo: 'medico' },
  'contador-publico': { vista: 'pro', dataVista: 'pro', tema: 'pro', dataPerfilTipo: 'pro' },
  'medico-veterinario': { vista: 'medico', dataVista: 'medico', tema: 'pro', dataPerfilTipo: 'medico' },
  escort: { vista: 'escort', dataVista: 'adult', tema: 'adult', dataPerfilTipo: 'escort' },
  'escort gay': { vista: 'escortGay', dataVista: 'adult', tema: 'adult', dataPerfilTipo: 'escortGay' },
  dominatrix: { vista: 'dominatrix', dataVista: 'adult', tema: 'adult', dataPerfilTipo: 'dominatrix' },
  unicorns: { vista: 'unicorn', dataVista: 'adult', tema: 'adult', dataPerfilTipo: 'unicorn' },
  edecan: { vista: 'edecan', dataVista: 'adult', tema: 'adult', dataPerfilTipo: 'edecan' },
  stripper: { vista: 'stripper', dataVista: 'adult', tema: 'adult', dataPerfilTipo: 'stripper' },
  contenido: { vista: 'creador', dataVista: 'adult', tema: 'adult', dataPerfilTipo: 'creador' },
  swinger: { vista: 'pareja', dataVista: 'adult', tema: 'adult', dataPerfilTipo: 'pareja' },
  'club sw': { vista: 'clubSw', dataVista: 'adult', tema: 'adult', dataPerfilTipo: 'clubSw' },
  'antro restaurant bar lgbt': { vista: 'antroLgbt', dataVista: 'adult', tema: 'adult', dataPerfilTipo: 'antroLgbt' },
  'cabinas glory holes': { vista: 'cabinas', dataVista: 'adult', tema: 'adult', dataPerfilTipo: 'cabinas' },
  'sex shop': { vista: 'sexShop', dataVista: 'adult', tema: 'adult', dataPerfilTipo: 'sexShop' },
  spa: { vista: 'spa', dataVista: 'adult', tema: 'adult', dataPerfilTipo: 'spa' },
  pizzerias: { vista: 'empresa', dataVista: 'empresa', tema: 'empresa', dataPerfilTipo: 'empresa' },
  bares: { vista: 'empresa', dataVista: 'empresa', tema: 'empresa', dataPerfilTipo: 'empresa' },
  abarrotes: { vista: 'pro', dataVista: 'pro', tema: 'pro', dataPerfilTipo: 'pro' },
  'chef-cocinero-domicilio': { vista: 'pro', dataVista: 'pro', tema: 'pro', dataPerfilTipo: 'pro' },
  refaccionarias: { vista: 'pro', dataVista: 'pro', tema: 'pro', dataPerfilTipo: 'pro' },
  'talleres-mecanicos': { vista: 'pro', dataVista: 'pro', tema: 'pro', dataPerfilTipo: 'pro' },
  plomeros: { vista: 'pro', dataVista: 'pro', tema: 'pro', dataPerfilTipo: 'pro' },
  'terapias-holisticas': { vista: 'pro', dataVista: 'pro', tema: 'pro', dataPerfilTipo: 'pro' },
  'editor-de-video': { vista: 'pro', dataVista: 'pro', tema: 'pro', dataPerfilTipo: 'pro' },
  inmobiliaria: { vista: 'empresa', dataVista: 'empresa', tema: 'empresa', dataPerfilTipo: 'empresa' },
  'agente-inmobiliario-independiente': { vista: 'pro', dataVista: 'pro', tema: 'pro', dataPerfilTipo: 'pro' },
  'dentistas-y-clinicas-dentales': { vista: 'pro', dataVista: 'pro', tema: 'pro', dataPerfilTipo: 'pro' },
  'fotografia-video-eventos': { vista: 'pro', dataVista: 'pro', tema: 'pro', dataPerfilTipo: 'pro' },
  'banquetes-catering-eventos': { vista: 'empresa', dataVista: 'empresa', tema: 'empresa', dataPerfilTipo: 'empresa' },
  'chofer-privado': { vista: 'pro', dataVista: 'pro', tema: 'pro', dataPerfilTipo: 'pro' },
  'despachos-juridicos': { vista: 'pro', dataVista: 'pro', tema: 'pro', dataPerfilTipo: 'pro' },
  groomer: { vista: 'pro', dataVista: 'pro', tema: 'pro', dataPerfilTipo: 'pro' },
};

const DEFAULT_FORBIDDEN = ['.banner-slot', '.pb-slot', '[hidden]', '.switcher'];
const PRO_SECTIONS = {
  identidad: { selectors: ['.idhead', '.idsub', '.col', '.gal'], fieldIds: [] },
  servicios: { selectors: ['.precio-big', '.dlist', '.svc', '.pcard'], fieldIds: [] },
};
const ADULT_SECTIONS = {
  perfil: { selectors: ['.playout', '.playout__derstack', '.pcard', '.dlist', '.gal'], fieldIds: [] },
  servicios: { selectors: ['.playout__derstack', '.pcard', '.dlist'], fieldIds: [] },
};

let _cached = null;

export function loadRenderMatrix() {
  if (_cached) return _cached;
  const raw = readFileSync(path.join(__dirname, 'render-matrix.json'), 'utf8');
  _cached = JSON.parse(raw);
  return _cached;
}

export function getMatrixCases() {
  return loadRenderMatrix().cases.slice();
}

export function getMatrixSubIds() {
  return getMatrixCases().map((c) => c.subcategoriaId);
}

export const MATRIX_SUBS = getMatrixSubIds();

export function resolveVistaConfig(subcategoriaId) {
  const slug = slugSubId(subcategoriaId);
  const key = Object.keys(VISTA_BY_SUB).find((k) => slugSubId(k) === slug);
  if (!key) {
    return { vista: 'pro', dataVista: 'pro', tema: 'pro', dataPerfilTipo: 'pro' };
  }
  return VISTA_BY_SUB[key];
}

export function buildRenderMapEntryFromCase(matrixCase, schemaEntry) {
  const slug = slugSubId(matrixCase.subcategoriaId);
  const vistaCfg = resolveVistaConfig(matrixCase.subcategoriaId);
  const isAdult = matrixCase.sectorId === 'adultos';
  const smokeNeedles = [`PP02 ${matrixCase.matrixId}`, 'Monterrey'];
  if (matrixCase.subcategoriaId === 'medicos-generales') smokeNeedles.push('Dra. QA B', 'Medicina general');
  if (matrixCase.subcategoriaId === 'dominatrix') smokeNeedles.push('Femdom', 'BDSM QA');
  if (matrixCase.subcategoriaId === 'unicorns') smokeNeedles.push('Unicorn QA', 'Conocer parejas');
  if (matrixCase.subcategoriaId === 'abogados') smokeNeedles.push('Lic. QA Abogado');
  if (matrixCase.subcategoriaId === 'pizzerias') smokeNeedles.push('Pizzeria QA Test');

  const entry = {
    matrixId: matrixCase.matrixId,
    vista: vistaCfg.vista,
    dataVista: vistaCfg.dataVista,
    dataPerfilTipo: vistaCfg.dataPerfilTipo,
    tema: vistaCfg.tema,
    categoria: schemaEntry?.subcategoria || matrixCase.subcategoriaId,
    smokeNeedles,
    smokeFields: matrixCase.publicFields.slice(0, 6),
    scopeSelector: isAdult ? '.playout' : '#wrap',
    forbiddenSelectors: DEFAULT_FORBIDDEN.slice(),
    sections: isAdult ? ADULT_SECTIONS : PRO_SECTIONS,
    privatePatterns: (matrixCase.privacyExclusions || []).slice(),
    privacyExclusions: (matrixCase.privacyExclusions || []).slice(),
    renderModule: matrixCase.renderModule,
    layoutShell: matrixCase.layoutShell,
    arquetipo: matrixCase.arquetipo,
    sectorId: matrixCase.sectorId,
    branches: matrixCase.branches || [],
  };

  if (matrixCase.nestedProfileKey) entry.nestedProfileKey = matrixCase.nestedProfileKey;
  if (matrixCase.canonicalAliases) entry.canonicalAliases = matrixCase.canonicalAliases;

  return { slug, entry };
}

export function loadRenderMap() {
  return JSON.parse(readFileSync(path.join(__dirname, 'render-map.json'), 'utf8'));
}

/**
 * @param {object} index schema-index
 * @param {object} [renderMap] optional override
 */
export function validateRenderMatrixIntegrity(index, renderMap = null) {
  const matrix = loadRenderMatrix();
  const map = renderMap || loadRenderMap();
  const errors = [];
  const warnings = [];

  if (matrix.caseCount !== 35) {
    errors.push(`caseCount must be 35, got ${matrix.caseCount}`);
  }
  if (matrix.cases.length !== 35) {
    errors.push(`cases.length must be 35, got ${matrix.cases.length}`);
  }

  const matrixIds = new Set();
  const subIds = new Set();
  const shells = new Set();
  const sectors = new Set();

  for (const c of matrix.cases) {
    if (matrixIds.has(c.matrixId)) {
      errors.push(`duplicate matrixId: ${c.matrixId}`);
    }
    matrixIds.add(c.matrixId);

    const slug = slugSubId(c.subcategoriaId);
    if (subIds.has(slug)) {
      errors.push(`duplicate subcategoria slug: ${slug}`);
    }
    subIds.add(slug);

    const schemaEntry = index.byId?.[c.subcategoriaId];
    if (!schemaEntry) {
      errors.push(`schema-index missing sub: ${c.subcategoriaId}`);
    } else {
      if (schemaEntry.componentePerfil !== c.layoutShell) {
        errors.push(`${c.matrixId}: layoutShell drift (${c.layoutShell} vs ${schemaEntry.componentePerfil})`);
      }
      if (schemaEntry.sectorId !== c.sectorId) {
        errors.push(`${c.matrixId}: sectorId drift (${c.sectorId} vs ${schemaEntry.sectorId})`);
      }
      if (schemaEntry.arquetipo !== c.arquetipo) {
        errors.push(`${c.matrixId}: arquetipo drift (${c.arquetipo} vs ${schemaEntry.arquetipo})`);
      }
    }

    shells.add(c.layoutShell);
    sectors.add(c.sectorId);

    const expectedModule = SECTOR_RENDER_MODULES[c.sectorId];
    if (c.sectorId !== 'adultos') {
      if (!expectedModule) {
        errors.push(`unknown sector module map: ${c.sectorId}`);
      } else if (!existsSync(path.join(REPO, expectedModule.replace(/\//g, path.sep)))) {
        errors.push(`render module file missing: ${expectedModule}`);
      }
      if (c.renderModule !== expectedModule) {
        warnings.push(`${c.matrixId}: renderModule label differs from sectorAssetMap (${c.renderModule})`);
      }
    }

    if (!map[slug]) {
      errors.push(`render-map missing entry for slug: ${slug} (${c.subcategoriaId})`);
    } else {
      const me = map[slug];
      if (me.matrixId && me.matrixId !== c.matrixId) {
        errors.push(`render-map matrixId mismatch for ${slug}: ${me.matrixId} vs ${c.matrixId}`);
      }
      for (const priv of c.privacyExclusions || []) {
        if (priv.length >= 4 && !(me.privatePatterns || []).includes(priv)) {
          warnings.push(`${c.matrixId}: privatePatterns missing ${priv}`);
        }
      }
      for (const fieldId of me.smokeFields || []) {
        if ((c.privacyExclusions || []).includes(fieldId)) {
          errors.push(`${c.matrixId}: smokeFields asserts private/admin field ${fieldId}`);
        }
      }
    }
  }

  for (const shell of LAYOUT_SHELLS) {
    if (!shells.has(shell)) {
      errors.push(`layout shell without representative: ${shell}`);
    }
  }

  for (const sector of Object.keys(SECTOR_RENDER_MODULES)) {
    if (!sectors.has(sector)) {
      errors.push(`sector without direct matrix coverage: ${sector}`);
    }
  }

  const mapKeys = Object.keys(map).filter((k) => map[k]?.matrixId);
  if (mapKeys.length !== 35) {
    errors.push(`render-map matrix entries: expected 35, got ${mapKeys.length}`);
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    coverage: {
      shells: `${shells.size}/${LAYOUT_SHELLS.length}`,
      sectors: `${sectors.size}/${Object.keys(SECTOR_RENDER_MODULES).length}`,
      cases: matrix.cases.length,
    },
  };
}

export { LAYOUT_SHELLS, SECTOR_RENDER_MODULES, VISTA_BY_SUB };
