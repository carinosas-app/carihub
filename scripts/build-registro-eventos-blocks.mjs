/**
 * Genera public/js/data/registro-eventos-blocks.js desde scripts/eventos-packs-v1.mjs
 * Uso: node scripts/build-registro-eventos-blocks.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  LEGACY_TO_CANON,
  CANON_SUBCATEGORIAS,
  SUB_TO_PACK,
  SUB_DELTAS,
  EVENTOS_FIELD_REGISTRY,
  REGULATED_CANON_SUBS,
  UI_IND_EVENTOS,
  UI_NEG_EVENTOS,
} from './eventos-packs-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outPath = path.join(root, 'public/js/data/registro-eventos-blocks.js');

function humanizeOpt(v) {
  return String(v)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/Dj/g, 'DJ')
    .replace(/Mc/g, 'MC')
    .replace(/Xv/g, 'XV')
    .replace(/Sct/g, 'SCT');
}

function mapTipo(tipo) {
  if (tipo === 'enum') return 'select';
  if (tipo === 'tags') return 'text';
  if (tipo === 'boolean') return 'boolean';
  if (tipo === 'checklist') return 'checklist';
  if (tipo === 'number') return 'text';
  if (tipo === 'textarea') return 'textarea';
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
for (const [id, reg] of Object.entries(EVENTOS_FIELD_REGISTRY)) {
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
  descripcionFormatoFaraFara: { field: 'tipoAgrupacion', values: ['fara_fara'] },
  estiloCeremonia: { field: 'rolPrincipal', values: ['mc', 'mixto'] },
  incluyeGuionCeremonia: { field: 'rolPrincipal', values: ['mc', 'mixto'] },
  rangoEdadPublico: { field: 'rolPrincipal', values: ['animador', 'mixto'] },
  dinamicasOfrecidas: { field: 'rolPrincipal', values: ['animador', 'mixto'] },
  trabajaConMenores: { field: 'rolPrincipal', values: ['animador', 'mixto'] },
  licenciaDron: { field: 'serviciosAudiovisual', includes: 'dron' },
  costoTraslado: { field: 'viajaFueraCiudad', truthy: true },
};

const MENORES_CANON = [
  'animadores-maestros-ceremonia',
  'fotografia-video-eventos',
  'shows-para-eventos',
];

const body = `/**
 * Bloques registro — sector Eventos (20 canon, 12 packs).
 * MP-EVENTOS-DELTAS-V1 Fase 2 — fuente: scripts/eventos-packs-v1.mjs
 */
(function (global) {
  'use strict';

  var LEGACY_TO_CANON = ${JSON.stringify(LEGACY_TO_CANON, null, 2)};

  var CANON_META = ${JSON.stringify(canonMeta, null, 2)};

  var SUB_TO_PACK = ${JSON.stringify(SUB_TO_PACK, null, 2)};

  var SUB_DELTAS = ${JSON.stringify(subDeltasLite, null, 2)};

  var CANON_IDS = ${JSON.stringify(CANON_SUBCATEGORIAS.map((c) => c.subcategoriaId), null, 2)};

  var REGULATED_CANON = ${JSON.stringify([...REGULATED_CANON_SUBS], null, 2)};

  var UI_IND_EVENTOS = ${JSON.stringify(UI_IND_EVENTOS)};
  var UI_NEG_EVENTOS = ${JSON.stringify(UI_NEG_EVENTOS)};

  var FIELD_REGISTRY = ${JSON.stringify(fieldEntries, null, 2)};

  var SHOW_WHEN_OVERRIDES = ${JSON.stringify(SHOW_WHEN_OVERRIDES, null, 2)};

  var MENORES_CANON = ${JSON.stringify(MENORES_CANON, null, 2)};

  var MENORES_COPY = 'Protección de imagen de menores: no solicites ni publiques datos personales de niños. Evita fotos identificables sin autorización documentada.';

  var GENERIC_FORBIDDEN_IDS = ['descripcion', 'horario', 'ubicacion', 'precioDesde', 'serviciosIncluidos'];

  var FOOD_PACK_CANON = ['banquetes-catering-eventos', 'food-trucks-carritos-eventos', 'pasteles-reposteria-eventos'];

  function slugSubId(id) {
    return String(id || '').trim().toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/_/g, '-');
  }

  function resolveCanonSubId(raw) {
    var key = slugSubId(raw);
    if (!key) return '';
    if (CANON_META[key]) return key;
    return LEGACY_TO_CANON[key] || '';
  }

  function resolvePack(canonId) {
    return SUB_TO_PACK[canonId] || '';
  }

  function showWhenForField(fieldId) {
    return SHOW_WHEN_OVERRIDES[fieldId] || null;
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
    var sw = showWhenForField(fieldId);
    if (sw) field.showWhen = sw;
    return field;
  }

  function personaIdentityBlock() {
    return {
      id: 'eventosPersonaIdentidad',
      title: 'Tu perfil de servicios para eventos',
      hint: 'Nombre público y cómo cotizas — sin formulario genérico de descripción/horario.',
      fields: [
        { id: 'alias', label: 'Nombre público', type: 'text', required: true, placeholder: 'Ej. DJ Luna · Producción Nova' },
        { id: 'tagline', label: 'Frase que vende tu servicio', type: 'text', required: false, maxLength: 120 },
        {
          id: 'unidadCotizacion',
          label: 'Cotizas por',
          type: 'select',
          required: true,
          options: [
            { value: 'evento', label: 'Evento' },
            { value: 'hora', label: 'Hora' },
            { value: 'dia', label: 'Día' },
            { value: 'persona', label: 'Persona' },
            { value: 'km', label: 'Km' },
            { value: 'proyecto', label: 'Proyecto' },
          ],
        },
        { id: 'cotizacionDesde', label: 'Cotización desde (MXN)', type: 'text', required: true, placeholder: 'Ej. $8,000' },
      ],
    };
  }

  function negocioIdentityBlock() {
    return {
      id: 'eventosNegocioIdentidad',
      title: 'Tu negocio de eventos',
      fields: [
        { id: 'nombreComercial', label: 'Nombre comercial', type: 'text', required: true },
        { id: 'tagline', label: 'Frase que vende tu servicio', type: 'text', required: false, maxLength: 120 },
        {
          id: 'unidadCotizacion',
          label: 'Cotizas por',
          type: 'select',
          required: true,
          options: [
            { value: 'evento', label: 'Evento' },
            { value: 'hora', label: 'Hora' },
            { value: 'dia', label: 'Día' },
            { value: 'persona', label: 'Persona' },
            { value: 'km', label: 'Km' },
            { value: 'proyecto', label: 'Proyecto' },
          ],
        },
        { id: 'cotizacionDesde', label: 'Cotización desde (MXN)', type: 'text', required: true, placeholder: 'Ej. $15,000' },
      ],
    };
  }

  function menoresHintBlock(canonId) {
    if (MENORES_CANON.indexOf(canonId) < 0) return null;
    return {
      id: 'eventosMenoresProteccion',
      title: 'Protección de menores',
      hint: MENORES_COPY,
      fields: [
        {
          id: 'avisoProteccionMenoresEventos',
          label: 'Confirmo que no solicitaré datos personales de menores ni publicaré imágenes identificables sin autorización',
          type: 'boolean',
          required: canonId === 'animadores-maestros-ceremonia',
        },
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
      var f = fieldFromRegistry(fid, !!oblSet[fid], canonId);
      if (f) fields.push(f);
    });
    if (canonId === 'pirotecnia-efectos-especiales' || canonId === 'seguridad-eventos') {
      var disc = fieldFromRegistry('disclaimerReguladoEventos', true, canonId);
      if (disc && fields.every(function (x) { return x.id !== disc.id; })) fields.push(disc);
    }
    if (canonId === 'shows-para-eventos') {
      var discShow = fieldFromRegistry('disclaimerReguladoEventos', false, canonId);
      if (discShow && fields.every(function (x) { return x.id !== discShow.id; })) fields.push(discShow);
    }
    return {
      id: 'eventosDelta_' + canonId,
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
    var menores = menoresHintBlock(canonId);
    if (menores) blocks.push(menores);
    var obligatorios = negocio
      ? ['nombreComercial', 'unidadCotizacion', 'cotizacionDesde']
      : ['alias', 'unidadCotizacion', 'cotizacionDesde'];
    (SUB_DELTAS[canonId].obligatoriosDelta || []).forEach(function (fid) {
      if (fid === 'geo') return;
      if (obligatorios.indexOf(fid) < 0) obligatorios.push(fid);
    });
    if (canonId === 'animadores-maestros-ceremonia') {
      obligatorios.push('avisoProteccionMenoresEventos');
    }
    var packFlags = {};
    if (REGULATED_CANON.indexOf(canonId) >= 0) {
      packFlags.regulada = true;
      packFlags.requiresAdminReview = true;
    }
    if (canonId === 'shows-para-eventos') {
      packFlags.sensibleCondicional = true;
    }
    return {
      id: 'eventos_pack_' + pack.toLowerCase(),
      deltaPack: pack,
      canonSubcategoriaId: canonId,
      sectorId: 'eventos',
      formularioId: negocio ? 'negocio_empresa' : 'persona_independiente',
      uiIds: negocio ? [UI_NEG_EVENTOS] : [UI_IND_EVENTOS],
      fotosMin: pack === 'FX' || pack === 'SECURITY' ? 3 : 2,
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

  function validateCapacidadVenue(values) {
    var min = parseInt(values.capacidadMin, 10);
    var max = parseInt(values.capacidadMax, 10);
    if (isNaN(min) || isNaN(max)) return [];
    if (min > max) return ['La capacidad mínima no puede ser mayor que la máxima.'];
    return [];
  }

  function validatePackFX(values) {
    var errors = [];
    var tipos = values.tipoEfectoPirotecnia;
    if (Array.isArray(tipos) && tipos.length) {
      if (!isTruthy(values.licenciaPirotecnia)) errors.push('Licencia o permiso de pirotecnia obligatorio.');
      if (!String(values.jurisdiccionPirotecnia || '').trim()) errors.push('Jurisdicción de pirotecnia obligatoria.');
      if (!isTruthy(values.polizaSeguroPirotecnia)) errors.push('Póliza de seguro pirotecnia obligatoria.');
      if (!isTruthy(values.disclaimerReguladoEventos)) errors.push('Debes aceptar avisos legales (pirotecnia).');
    }
    return errors;
  }

  function validatePackSECURITY(values) {
    var errors = [];
    if (!isTruthy(values.licenciaSeguridadPrivada)) errors.push('Licencia de seguridad privada obligatoria.');
    var n = parseInt(values.elementosSeguridad, 10);
    if (isNaN(n) || n < 1) errors.push('Número de elementos de seguridad obligatorio.');
    if (!isTruthy(values.disclaimerReguladoEventos)) errors.push('Debes aceptar avisos legales (seguridad).');
    return errors;
  }

  function validatePackSHOW(values) {
    var errors = [];
    var stripper = checklistIncludes(values, 'tipoShow', 'strippers');
    var sensible = isTruthy(values.contenidoSensible);
    if (stripper && !sensible) errors.push('Si incluyes strippers debes marcar contenido sensible.');
    if (stripper && !isTruthy(values.disclaimerReguladoEventos)) {
      errors.push('Disclaimer obligatorio para shows con strippers.');
    }
    if (sensible && !isTruthy(values.disclaimerReguladoEventos)) {
      errors.push('Disclaimer obligatorio para contenido sensible.');
    }
    // publicoObjetivo=adultos no implica desnudo — sin error automático
    return errors;
  }

  function validatePackFOOD(values, canonId) {
    var errors = [];
    if (FOOD_PACK_CANON.indexOf(canonId) >= 0) {
      if (!isTruthy(values.permisoManipulacionAlimentos)) {
        errors.push('Permiso de manipulación de alimentos obligatorio.');
      }
    }
    if (canonId === 'banquetes-catering-eventos') {
      if (!Array.isArray(values.dietasEspeciales) || !values.dietasEspeciales.length) {
        errors.push('Indica dietas especiales o alergias que puedes cubrir.');
      }
      var max = parseInt(values.comensalesMax, 10);
      if (isNaN(max) || max < 1) errors.push('Capacidad de comensales obligatoria.');
    }
    return errors;
  }

  function validatePackVALET(values) {
    var errors = [];
    if (!isTruthy(values.polizaResponsabilidadValet)) {
      errors.push('Póliza de responsabilidad civil valet recomendada/obligatoria.');
    }
    var cap = parseInt(values.vehiculosPorHora, 10);
    if (isNaN(cap) || cap < 1) errors.push('Capacidad de vehículos por hora obligatoria.');
    return errors;
  }

  function validatePackTRANSPORT(values) {
    var errors = [];
    if (!isTruthy(values.permisoTransporte)) errors.push('Permiso de transporte obligatorio.');
    if (!isTruthy(values.polizaTransporte)) errors.push('Póliza de transporte obligatoria.');
    var cap = parseInt(values.capacidadPasajeros, 10);
    if (isNaN(cap) || cap < 1) errors.push('Capacidad de pasajeros obligatoria.');
    return errors;
  }

  function validateCondicionales(values, canonId) {
    var errors = [];
    if (canonId === 'grupos-musicales-eventos' && String(values.tipoAgrupacion || '') === 'fara_fara') {
      if (!String(values.descripcionFormatoFaraFara || '').trim()) errors.push('Describe tu formato Fara Fara.');
    }
    if (canonId === 'animadores-maestros-ceremonia') {
      var rol = String(values.rolPrincipal || '');
      if (rol === 'mc' || rol === 'mixto') {
        if (!Array.isArray(values.estiloCeremonia) || !values.estiloCeremonia.length) {
          errors.push('Estilo de ceremonia obligatorio para MC.');
        }
      }
      if (rol === 'animador' || rol === 'mixto') {
        if (!Array.isArray(values.rangoEdadPublico) || !values.rangoEdadPublico.length) {
          errors.push('Rango de edad del público obligatorio para animador.');
        }
        if (!Array.isArray(values.dinamicasOfrecidas) || !values.dinamicasOfrecidas.length) {
          errors.push('Dinámicas ofrecidas obligatorias para animador.');
        }
      }
    }
    if (canonId === 'fotografia-video-eventos') {
      if (checklistIncludes(values, 'serviciosAudiovisual', 'dron') && !isTruthy(values.licenciaDron)) {
        errors.push('Licencia de dron obligatoria si ofreces dron.');
      }
      if (checklistIncludes(values, 'especialidadesEvento', 'infantil')) {
        if (!isTruthy(values.avisoProteccionMenoresEventos)) {
          errors.push('Confirma protección de imagen de menores (foto/video infantil).');
        }
      }
    }
    if (canonId === 'shows-para-eventos') {
      if (String(values.publicoObjetivo || '') === 'infantil' && !isTruthy(values.avisoProteccionMenoresEventos)) {
        errors.push('Confirma protección de imagen de menores (show infantil).');
      }
    }
    var viajaCanon = ['djs-eventos', 'grupos-musicales-eventos', 'shows-para-eventos'];
    if (viajaCanon.indexOf(canonId) >= 0 && isTruthy(values.viajaFueraCiudad)) {
      if (!String(values.costoTraslado || '').trim()) errors.push('Costo de traslado obligatorio si viajas fuera de ciudad.');
    }
    return errors;
  }

  function validateEventosSectorValues(values, ctx) {
    values = values || {};
    ctx = ctx || {};
    var canonId = resolveCanonSubId(ctx.subcategoriaId || ctx.subcategoria || values.subcategoriaId || '');
    if (!canonId) return ['Subcategoría de eventos no reconocida.'];
    var pack = resolvePack(canonId);
    var errors = [];
    errors = errors.concat(validateCapacidadVenue(values));
    errors = errors.concat(validateCondicionales(values, canonId));
    if (pack === 'FX') errors = errors.concat(validatePackFX(values));
    if (pack === 'SECURITY') errors = errors.concat(validatePackSECURITY(values));
    if (pack === 'SHOW' && canonId === 'shows-para-eventos') errors = errors.concat(validatePackSHOW(values));
    if (pack === 'FOOD') errors = errors.concat(validatePackFOOD(values, canonId));
    if (pack === 'VALET') errors = errors.concat(validatePackVALET(values));
    if (pack === 'TRANSPORT') errors = errors.concat(validatePackTRANSPORT(values));
    return errors;
  }

  function applyEventosFlags(values, canonId) {
    values = values || {};
    if (REGULATED_CANON.indexOf(canonId) >= 0) {
      values.regulada = true;
      values.requiresAdminReview = true;
    }
    if (canonId === 'shows-para-eventos') {
      var stripper = checklistIncludes(values, 'tipoShow', 'strippers');
      var sensible = isTruthy(values.contenidoSensible);
      if (stripper || sensible) {
        values.sensible = true;
        values.requiresAdminReview = true;
        values.nivelRevisionAdmin = 'alta';
      }
    }
    if (checklistIncludes(values, 'especialidadesEvento', 'infantil') || isTruthy(values.trabajaConMenores)) {
      values.restriccionImagenMenores = true;
    }
    return values;
  }

  function copyFieldValue(values, key) {
    var val = values[key];
    if (Array.isArray(val)) return val.slice();
    if (val === true || val === false) return val;
    return val != null ? val : '';
  }

  function buildEventosPerfil(values, canonId, pack) {
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
      cotizacionDesde: values.cotizacionDesde || '',
      avisoProteccionMenoresEventos: values.avisoProteccionMenoresEventos === true,
      sensible: values.sensible === true,
      regulada: values.regulada === true,
      requiresAdminReview: values.requiresAdminReview === true,
      restriccionImagenMenores: values.restriccionImagenMenores === true,
    };
    (delta && delta.deltaFields ? delta.deltaFields : []).forEach(function (fid) {
      perfil[fid] = copyFieldValue(values, fid);
    });
    if (values.disclaimerReguladoEventos != null) {
      perfil.disclaimerReguladoEventos = values.disclaimerReguladoEventos === true;
    }
    return perfil;
  }

  global.CARIHUB_REGISTRO_EVENTOS_SECTOR_BLOCKS = {
    id: 'eventos_sector_packs',
    sectorId: 'eventos',
    legacyToCanon: LEGACY_TO_CANON,
    canonSubcategorias: CANON_IDS.slice(),
    subToPack: SUB_TO_PACK,
    resolveCanonSubId: resolveCanonSubId,
    resolvePack: resolvePack,
    buildConfig: buildConfig,
    buildEventosPerfil: buildEventosPerfil,
    validateEventosSectorValues: validateEventosSectorValues,
    applyEventosFlags: applyEventosFlags,
    genericForbiddenIds: GENERIC_FORBIDDEN_IDS.slice(),
  };
})(typeof window !== 'undefined' ? window : globalThis);
`;

fs.writeFileSync(outPath, body, 'utf8');
console.log('Wrote', outPath, '(' + body.length + ' bytes)');
