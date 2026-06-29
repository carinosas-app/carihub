/**
 * Genera public/js/data/registro-gastronomia-blocks.js desde scripts/gastronomia-packs-v1.mjs
 * Uso: node scripts/build-registro-gastronomia-blocks.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  LEGACY_TO_CANON,
  SECTOR_UI_SLUG_TO_CANON,
  CANON_SUBCATEGORIAS,
  SUB_TO_PACK,
  SUB_DELTAS,
  GASTRONOMIA_FIELD_REGISTRY,
  REGULATED_CANON_SUBS,
  UI_IND_GASTRONOMIA,
  UI_NEG_GASTRONOMIA,
  PACK_IDS,
} from './gastronomia-packs-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outPath = path.join(root, 'public/js/data/registro-gastronomia-blocks.js');

function humanizeOpt(v) {
  return String(v)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/Mx/g, 'MX')
    .replace(/B2b/g, 'B2B');
}

function mapTipo(tipo) {
  if (tipo === 'enum') return 'select';
  if (tipo === 'tags') return 'text';
  if (tipo === 'boolean') return 'boolean';
  if (tipo === 'checklist') return 'checklist';
  if (tipo === 'number') return 'text';
  if (tipo === 'textarea') return 'textarea';
  if (tipo === 'url') return 'text';
  return 'text';
}

const canonMeta = Object.fromEntries(
  CANON_SUBCATEGORIAS.map((c) => [
    c.subcategoriaId,
    {
      pack: c.pack,
      blockTitle: c.blockTitle,
      formularioId: c.formularioId,
      nombre: c.nombre,
    },
  ])
);

const subDeltasLite = Object.fromEntries(
  Object.entries(SUB_DELTAS).map(([k, v]) => [
    k,
    {
      deltaFields: v.deltaFields,
      obligatoriosDelta: v.obligatoriosDelta,
      textosAyuda: v.textosAyuda || {},
    },
  ])
);

const fieldEntries = {};
for (const [id, reg] of Object.entries(GASTRONOMIA_FIELD_REGISTRY)) {
  const opts = reg.opciones || [];
  fieldEntries[id] = {
    id,
    label: reg.label,
    type: mapTipo(reg.tipo),
    options: opts.map((o) => ({ value: o, label: humanizeOpt(o) })),
    hint: reg.hint || '',
    maxLength: reg.maxLength,
    rows: reg.tipo === 'textarea' ? 3 : undefined,
  };
}

const SHOW_WHEN_OVERRIDES = {
  permisoVentaAlcohol: { field: 'ventaAlcohol', truthy: true },
  politicaMenoresAlcohol: { field: 'ventaAlcohol', truthy: true },
  direccionOperacionPrivada: { field: 'modeloOperacion', values: ['dark_kitchen', 'cloud_kitchen'] },
  mostrarSoloZonaPublica: { field: 'modeloOperacion', values: ['dark_kitchen', 'cloud_kitchen'] },
  eventosPrivadosTruck: { field: 'aceptaEventosPrivados', truthy: true },
  disclaimerReguladoGastronomia: { field: 'ventaAlcohol', truthy: true },
};

const BAR_CANON = ['bares', 'cervecerias', 'cantinas-vinotecas'];

const FOOD_NEGOCIO_PACKS = PACK_IDS.filter((p) => p !== 'PRO_SERVICE');

const PRIVATE_FIELD_IDS = Object.entries(GASTRONOMIA_FIELD_REGISTRY)
  .filter(([, reg]) => reg.privado === true)
  .map(([id]) => id);

const canonCount = CANON_SUBCATEGORIAS.length;
const packCount = PACK_IDS.length;

const body = `/**
 * Bloques registro — sector Restaurantes/Gastronomía (${canonCount} canon, ${packCount} packs).
 * MP-RESTAURANTES-GASTRONOMIA-BEBIDAS-V1 — fuente: scripts/gastronomia-packs-v1.mjs
 */
(function (global) {
  'use strict';

  var LEGACY_TO_CANON = ${JSON.stringify(LEGACY_TO_CANON, null, 2)};

  var SECTOR_UI_SLUG_TO_CANON = ${JSON.stringify(SECTOR_UI_SLUG_TO_CANON, null, 2)};

  var CANON_META = ${JSON.stringify(canonMeta, null, 2)};

  var SUB_TO_PACK = ${JSON.stringify(SUB_TO_PACK, null, 2)};

  var SUB_DELTAS = ${JSON.stringify(subDeltasLite, null, 2)};

  var CANON_IDS = ${JSON.stringify(CANON_SUBCATEGORIAS.map((c) => c.subcategoriaId), null, 2)};

  var REGULATED_CANON = ${JSON.stringify([...REGULATED_CANON_SUBS], null, 2)};

  var UI_IND_GASTRONOMIA = ${JSON.stringify(UI_IND_GASTRONOMIA)};
  var UI_NEG_GASTRONOMIA = ${JSON.stringify(UI_NEG_GASTRONOMIA)};

  var FIELD_REGISTRY = ${JSON.stringify(fieldEntries, null, 2)};

  var SHOW_WHEN_OVERRIDES = ${JSON.stringify(SHOW_WHEN_OVERRIDES, null, 2)};

  var BAR_CANON = ${JSON.stringify(BAR_CANON, null, 2)};

  var FOOD_NEGOCIO_PACKS = ${JSON.stringify(FOOD_NEGOCIO_PACKS, null, 2)};

  var GENERIC_FORBIDDEN_IDS = ['descripcion', 'horario', 'ubicacion', 'precioDesde', 'serviciosIncluidos'];

  var GASTRONOMIA_PRIVATE_FIELD_IDS = ${JSON.stringify(PRIVATE_FIELD_IDS, null, 2)};

  var NESTED_PROFILE_KEY = 'gastronomiaPerfil';

  function slugSubId(id) {
    return String(id || '').trim().toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/_/g, '-');
  }

  function resolveCanonSubId(raw) {
    var key = slugSubId(raw);
    if (!key) return '';
    if (CANON_META[key]) return key;
    return LEGACY_TO_CANON[key] || SECTOR_UI_SLUG_TO_CANON[key] || '';
  }

  function resolvePack(canonId) {
    return SUB_TO_PACK[canonId] || '';
  }

  function showWhenForField(fieldId, canonId) {
    var sw = SHOW_WHEN_OVERRIDES[fieldId] || null;
    if (fieldId === 'disclaimerReguladoGastronomia' && BAR_CANON.indexOf(canonId) < 0) {
      return null;
    }
    return sw;
  }

  function fieldFromRegistry(fieldId, required, canonId) {
    var reg = FIELD_REGISTRY[fieldId];
    if (!reg) return null;
    var field = {
      id: reg.id,
      label: reg.label,
      type: reg.type,
      required: !!required,
    };
    if (reg.hint) field.placeholder = reg.hint;
    if (reg.maxLength) field.maxLength = reg.maxLength;
    if (reg.rows) field.rows = reg.rows;
    if (reg.options && reg.options.length) field.options = reg.options.slice();
    var delta = SUB_DELTAS[canonId];
    if (delta && delta.textosAyuda && delta.textosAyuda[fieldId]) {
      field.placeholder = delta.textosAyuda[fieldId];
    }
    var sw = showWhenForField(fieldId, canonId);
    if (sw) field.showWhen = sw;
    return field;
  }

  function personaIdentityBlock() {
    return {
      id: 'gastronomiaPersonaIdentidad',
      title: 'Tu servicio gastronómico',
      hint: 'Nombre público, cotización y precio — sin formulario genérico de descripción/horario.',
      fields: [
        { id: 'alias', label: 'Nombre público', type: 'text', required: true, placeholder: 'Ej. Chef Ana · Cocina a domicilio' },
        { id: 'tagline', label: 'Frase que vende tu servicio', type: 'text', required: false, maxLength: 120 },
        {
          id: 'unidadCotizacion',
          label: 'Cotizas por',
          type: 'select',
          required: true,
          options: [
            { value: 'hora', label: 'Hora' },
            { value: 'persona', label: 'Persona' },
            { value: 'evento', label: 'Evento' },
            { value: 'kg', label: 'Kg' },
            { value: 'plato', label: 'Plato' },
            { value: 'orden', label: 'Orden' },
          ],
        },
        { id: 'precioDesdeMx', label: 'Precio desde (MXN)', type: 'text', required: true, placeholder: 'Ej. $800' },
      ],
    };
  }

  function negocioIdentityBlock() {
    return {
      id: 'gastronomiaNegocioIdentidad',
      title: 'Tu negocio gastronómico',
      fields: [
        { id: 'nombreComercial', label: 'Nombre comercial', type: 'text', required: true },
        { id: 'tagline', label: 'Frase que vende tu servicio', type: 'text', required: false, maxLength: 120 },
        { id: 'precioPromedioMx', label: 'Precio promedio por persona (MXN)', type: 'text', required: true, placeholder: 'Ej. $250' },
      ],
    };
  }

  function buildDeltaBlock(canonId) {
    var meta = CANON_META[canonId];
    var delta = SUB_DELTAS[canonId];
    if (!meta || !delta) return null;
    var oblSet = {};
    (delta.obligatoriosDelta || []).forEach(function (fid) {
      if (fid === 'geo') return;
      oblSet[fid] = true;
    });
    var fields = [];
    (delta.deltaFields || []).forEach(function (fid) {
      if (GENERIC_FORBIDDEN_IDS.indexOf(fid) >= 0) return;
      if (fid === 'precioPromedioMx' || fid === 'precioDesdeMx') return;
      var f = fieldFromRegistry(fid, !!oblSet[fid], canonId);
      if (f) fields.push(f);
    });
    if (BAR_CANON.indexOf(canonId) >= 0) {
      var discBar = fieldFromRegistry('disclaimerReguladoGastronomia', false, canonId);
      if (discBar && fields.every(function (x) { return x.id !== discBar.id; })) fields.push(discBar);
    }
    if (canonId === 'distribuidoras-alimentos-bebidas') {
      var discDist = fieldFromRegistry('disclaimerReguladoGastronomia', true, canonId);
      if (discDist && fields.every(function (x) { return x.id !== discDist.id; })) fields.push(discDist);
    }
    return {
      id: 'gastronomiaDelta_' + canonId,
      title: meta.blockTitle,
      hint: meta.nombre,
      fields: fields,
    };
  }

  function buildConfig(ctx) {
    ctx = ctx || {};
    var canonId = resolveCanonSubId(ctx.subcategoriaId || ctx.subcategoria || '');
    var meta = CANON_META[canonId];
    if (!meta) return null;
    var pack = meta.pack;
    var negocio = String(ctx.formularioId || meta.formularioId || '') === 'negocio_empresa';
    var blocks = negocio ? [negocioIdentityBlock()] : [personaIdentityBlock()];
    var deltaBlock = buildDeltaBlock(canonId);
    if (deltaBlock) blocks.push(deltaBlock);
    var obligatorios = negocio
      ? ['nombreComercial', 'precioPromedioMx']
      : ['alias', 'unidadCotizacion', 'precioDesdeMx'];
    (SUB_DELTAS[canonId].obligatoriosDelta || []).forEach(function (fid) {
      if (fid === 'geo') return;
      if (obligatorios.indexOf(fid) < 0) obligatorios.push(fid);
    });
    var packFlags = {};
    if (REGULATED_CANON.indexOf(canonId) >= 0) {
      packFlags.regulada = true;
      packFlags.requiresAdminReview = true;
    }
    if (canonId === 'dark-kitchen') {
      packFlags.privacidadDireccion = true;
    }
    return {
      id: 'gastronomia_pack_' + pack.toLowerCase(),
      deltaPack: pack,
      canonSubcategoriaId: canonId,
      sectorId: 'restaurantes',
      nestedProfileKey: NESTED_PROFILE_KEY,
      formularioId: negocio ? 'negocio_empresa' : 'persona_independiente',
      uiIds: negocio ? [UI_NEG_GASTRONOMIA] : [UI_IND_GASTRONOMIA],
      fotosMin: negocio ? 3 : 2,
      obligatorios: obligatorios,
      blocks: blocks,
      packFlags: packFlags,
      legacyResolvedFrom: slugSubId(ctx.subcategoriaId || ctx.subcategoria || '') !== canonId
        ? slugSubId(ctx.subcategoriaId || ctx.subcategoria || '')
        : '',
    };
  }

  function checklistIncludes(values, fieldId, item) {
    var list = values[fieldId];
    if (!Array.isArray(list)) return false;
    return list.some(function (v) { return String(v) === String(item); });
  }

  function isTruthy(val) {
    if (val === true || val === 1) return true;
    var s = String(val == null ? '' : val).trim().toLowerCase();
    return s === 'true' || s === '1' || s === 'si' || s === 'sí';
  }

  function isNegocioCtx(ctx, canonId) {
    ctx = ctx || {};
    if (ctx.formularioId) return String(ctx.formularioId) === 'negocio_empresa';
    var meta = CANON_META[canonId];
    return meta && String(meta.formularioId) === 'negocio_empresa';
  }

  function validateAlcoholMenores(values) {
    var errors = [];
    if (!isTruthy(values.ventaAlcohol)) return errors;
    if (!isTruthy(values.permisoVentaAlcohol)) {
      errors.push('Declara permiso de alcohol o desactiva venta de alcohol.');
    }
    if (!String(values.politicaMenoresAlcohol || '').trim()) {
      errors.push('Indica política de menores en área de alcohol.');
    }
    return errors;
  }

  function validatePackBAR(values, canonId) {
    var errors = [];
    if (!isTruthy(values.ventaAlcohol)) return errors;
    errors = errors.concat(validateAlcoholMenores(values));
    if (!isTruthy(values.disclaimerReguladoGastronomia)) {
      errors.push('Debes aceptar avisos legales (alcohol/bar).');
    }
    return errors;
  }

  function validatePackDELIVERY(values, canonId) {
    var errors = [];
    if (canonId !== 'dark-kitchen') return errors;
    var modelo = String(values.modeloOperacion || '');
    if (modelo !== 'dark_kitchen' && modelo !== 'cloud_kitchen') return errors;
    if (!String(values.direccionOperacionPrivada || '').trim()) {
      errors.push('Dirección de operación privada obligatoria para dark/cloud kitchen.');
    }
    if (!isTruthy(values.mostrarSoloZonaPublica)) {
      errors.push('Confirma mostrar solo zona pública (sin calle exacta).');
    }
    return errors;
  }

  function validatePackFOOD(values, ctx, canonId, pack) {
    var errors = [];
    if (!isNegocioCtx(ctx, canonId)) return errors;
    if (FOOD_NEGOCIO_PACKS.indexOf(pack) < 0) return errors;
    if (!isTruthy(values.permisoManipulacionAlimentos)) {
      errors.push('Permiso de manipulación de alimentos obligatorio.');
    }
    return errors;
  }

  function validateCondicionales(values, canonId) {
    var errors = [];
    if (canonId === 'distribuidoras-alimentos-bebidas') {
      if (checklistIncludes(values, 'categoriasProducto', 'bebidas') && !isTruthy(values.permisoVentaAlcohol)) {
        errors.push('Permiso de venta de alcohol obligatorio si distribuyes bebidas.');
      }
    }
    if (canonId === 'bartender-servicio') {
      if (isTruthy(values.servicioAlcoholCliente) && !isTruthy(values.permisoVentaAlcohol)) {
        errors.push('Permiso de alcohol recomendado si el cliente provee alcohol.');
      }
    }
    return errors;
  }

  function isSafeMenuUrl(raw) {
    var s = String(raw || '').trim();
    if (!s) return true;
    var lower = s.toLowerCase();
    if (/^javascript:/.test(lower) || /^data:/.test(lower) || /^vbscript:/.test(lower)) return false;
    if (/^https:\\/\\//i.test(s)) return true;
    if (/^\\/[a-z0-9/_\\-.]*$/i.test(s)) return true;
    return false;
  }

  function validateSecureUrls(values) {
    var errors = [];
    if (values.menuUrl && !isSafeMenuUrl(values.menuUrl)) {
      errors.push('URL de menú no permitida — usa https:// o ruta interna.');
    }
    return errors;
  }

  function validateGastronomiaSectorValues(values, ctx) {
    values = values || {};
    ctx = ctx || {};
    var canonId = resolveCanonSubId(ctx.subcategoriaId || ctx.subcategoria || values.subcategoriaId || '');
    if (!canonId) return ['Subcategoría de gastronomía no reconocida.'];
    var pack = resolvePack(canonId);
    var errors = [];
    errors = errors.concat(validateCondicionales(values, canonId));
    errors = errors.concat(validateSecureUrls(values));
    if (BAR_CANON.indexOf(canonId) >= 0) {
      errors = errors.concat(validatePackBAR(values, canonId));
    } else if (isTruthy(values.ventaAlcohol)) {
      errors = errors.concat(validateAlcoholMenores(values));
    }
    if (pack === 'DELIVERY') {
      errors = errors.concat(validatePackDELIVERY(values, canonId));
    }
    errors = errors.concat(validatePackFOOD(values, ctx, canonId, pack));
    if (canonId === 'distribuidoras-alimentos-bebidas' && !isTruthy(values.disclaimerReguladoGastronomia)) {
      errors.push('Debes aceptar avisos legales (distribución regulada).');
    }
    return errors;
  }

  function applyGastronomiaFlags(values, canonId) {
    values = values || {};
    if (REGULATED_CANON.indexOf(canonId) >= 0) {
      values.regulada = true;
      values.requiresAdminReview = true;
    }
    if (canonId === 'dark-kitchen') {
      values.privacidadDireccion = true;
      if (String(values.modeloOperacion || '') === 'dark_kitchen' || String(values.modeloOperacion || '') === 'cloud_kitchen') {
        values.requiresAdminReview = true;
      }
    }
    if (BAR_CANON.indexOf(canonId) >= 0 || canonId === 'distribuidoras-alimentos-bebidas') {
      values.declarativaAlcohol = true;
    }
    if (isTruthy(values.ventaAlcohol) && !isTruthy(values.permisoVentaAlcohol)) {
      values.requiresAdminReview = true;
    }
    if (String(values.politicaMenoresAlcohol || '') === 'prohibido_menores') {
      values.cumpleMenores = true;
    }
    if (BAR_CANON.indexOf(canonId) >= 0 && isTruthy(values.ventaAlcohol) && isTruthy(values.disclaimerReguladoGastronomia)) {
      values.disclaimerAceptado = true;
    }
    return values;
  }

  function copyFieldValue(values, key) {
    var val = values[key];
    if (Array.isArray(val)) return val.slice();
    if (val === true || val === false) return val;
    return val != null ? val : '';
  }

  function buildGastronomiaPerfil(values, canonId, pack) {
    values = values || {};
    canonId = canonId || resolveCanonSubId(values.subcategoriaId || '');
    pack = pack || resolvePack(canonId);
    var delta = SUB_DELTAS[canonId];
    var perfil = {
      deltaPack: pack,
      canonSubcategoriaId: canonId,
      alias: values.alias || '',
      nombreComercial: values.nombreComercial || '',
      tagline: values.tagline || '',
      unidadCotizacion: values.unidadCotizacion || '',
      precioDesdeMx: values.precioDesdeMx != null ? values.precioDesdeMx : '',
      precioPromedioMx: values.precioPromedioMx != null ? values.precioPromedioMx : '',
      regulada: values.regulada === true,
      requiresAdminReview: values.requiresAdminReview === true,
      privacidadDireccion: values.privacidadDireccion === true,
      declarativaAlcohol: values.declarativaAlcohol === true,
      cumpleMenores: values.cumpleMenores === true,
      disclaimerAceptado: values.disclaimerAceptado === true,
    };
    (delta && delta.deltaFields ? delta.deltaFields : []).forEach(function (fid) {
      perfil[fid] = copyFieldValue(values, fid);
    });
    if (values.disclaimerReguladoGastronomia != null) {
      perfil.disclaimerReguladoGastronomia = values.disclaimerReguladoGastronomia === true;
    }
    return perfil;
  }

  function sanitizeGastronomiaPerfilForPublic(perfil) {
    var out = Object.assign({}, perfil || {});
    GASTRONOMIA_PRIVATE_FIELD_IDS.forEach(function (k) {
      delete out[k];
    });
    return out;
  }

  global.CARIHUB_REGISTRO_GASTRONOMIA_SECTOR_BLOCKS = {
    id: 'gastronomia_sector_packs',
    sectorId: 'restaurantes',
    nestedProfileKey: NESTED_PROFILE_KEY,
    legacyToCanon: LEGACY_TO_CANON,
    canonSubcategorias: CANON_IDS.slice(),
    subToPack: SUB_TO_PACK,
    resolveCanonSubId: resolveCanonSubId,
    resolvePack: resolvePack,
    buildConfig: buildConfig,
    buildGastronomiaPerfil: buildGastronomiaPerfil,
    sanitizeGastronomiaPerfilForPublic: sanitizeGastronomiaPerfilForPublic,
    validateGastronomiaSectorValues: validateGastronomiaSectorValues,
    applyGastronomiaFlags: applyGastronomiaFlags,
    isSafeMenuUrl: isSafeMenuUrl,
    genericForbiddenIds: GENERIC_FORBIDDEN_IDS.slice(),
    privateFieldIds: GASTRONOMIA_PRIVATE_FIELD_IDS.slice(),
  };
})(typeof window !== 'undefined' ? window : globalThis);
`;

fs.writeFileSync(outPath, body, 'utf8');
console.log('Wrote', outPath, '(' + body.length + ' bytes)');
