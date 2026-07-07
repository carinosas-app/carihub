import { slugSubId } from './slug.mjs';

const TOGGLE_PUBLIC_RE = /^mostrar.+Publico$/i;

/** Hand-tuned mocks for smoke / gold subs (aligned with qa-mp-submit-hydrate). */
const SUB_OVERRIDES = {
  'medicos-generales': {
    nombreProfesional: 'Dra. QA B',
    tagline: 'Medicina general',
    especialidad: 'Medicina general',
    precioConsulta: '800',
    colaboracionContenido: 'Sí',
    mostrarColaboracionContenidoPublico: 'Sí',
    cedulaProfesional: '9999999',
  },
  dominatrix: {
    estiloDominacion: 'Femdom',
    listaFetiches: ['Bondage'],
    limitesSesion: 'Sin menores',
    equipamiento: ['Bondage / restricciones'],
    modalidadSesion: 'Presencial',
    serviciosIncluidos: ['Femdom'],
    serviciosNoRealizo: ['Menores'],
    modalidades: ['recibe'],
    metodosPago: ['Efectivo'],
    horarioDetalle: 'Con cita',
    sobreMi: 'BDSM QA',
    mostrarFetichesPublico: 'Sí',
    mostrarEquipamientoPublico: 'Sí',
  },
  unicorns: {
    objetivosPerfil: ['Conocer parejas'],
    tipoUnicornio: 'Mujer',
    buscoConocer: ['Parejas'],
    finalidadEncuentro: ['Socializar'],
    estadoPerfil: 'Disponible',
    serviciosLifestyle: ['Citas'],
    modalidades: ['hotel'],
    horarioDetalle: 'Vie-Dom',
    metodosPago: ['Efectivo'],
    sobreMi: 'Unicorn QA',
    mostrarObjetivosPerfil: 'Sí',
    mostrarColaboraciones: 'Sí',
  },
  abogados: {
    nombreProfesional: 'Lic. QA Abogado',
    especialidadProfesional: 'Derecho familiar',
    serviciosProfesionales: ['Consulta legal'],
    modalidadAtencionProfesional: 'hibrido',
    precioConsulta: '1200',
    horarioAtencion: 'Lun-Vie 9-18',
    anosExperienciaProfesional: '10',
    tagline: 'Asesoría jurídica QA',
  },
  pizzerias: {
    nombreComercial: 'Pizzeria QA Test',
    tagline: 'Pizza artesanal QA',
    precioPromedioMx: '250',
    horarioAtencionComercial: 'Lun-Dom 12-22',
    pizzasEstrella: 'Hawaiana Suprema',
    deliveryPropio: 'si',
    permisoManipulacionAlimentos: 'si_vigente',
    tipoCocinaPrincipal: 'italiana',
    horarioCocina: '12:00-23:00',
  },
};

function isTruthy(val) {
  if (val === true) return true;
  if (Array.isArray(val)) return val.length > 0;
  const s = String(val || '').trim().toLowerCase();
  return s === 'sí' || s === 'si' || s === 'yes' || s === 'true' || s === '1';
}

function fieldMatchesShowWhen(field, values) {
  if (!field?.showWhen) return true;
  const sw = field.showWhen;
  const depVal = values[sw.field];
  if (sw.truthy) return isTruthy(depVal);
  if (sw.includes != null) {
    if (!Array.isArray(depVal)) return false;
    const needle = String(sw.includes);
    return depVal.some((x) => String(x) === needle);
  }
  const allowed = sw.values || [];
  return allowed.includes(String(depVal || '').trim());
}

function modalidadesIncluyeViaja(values) {
  const m = values?.modalidades;
  if (!Array.isArray(m)) return false;
  return m.includes('viaja');
}

export function isFieldVisible(field, values, regCtx) {
  if (field.onlySubcategorias?.length) {
    const sub = slugSubId(regCtx.subcategoriaId);
    const allowed = field.onlySubcategorias.map(slugSubId);
    if (!allowed.includes(sub)) return false;
  }
  if (field.excludeSubcategorias?.length) {
    const sub = slugSubId(regCtx.subcategoriaId);
    const excluded = field.excludeSubcategorias.map(slugSubId);
    if (excluded.includes(sub)) return false;
  }
  if (field.showWhenViaja && !modalidadesIncluyeViaja(values)) return false;
  if (field.showWhen && !fieldMatchesShowWhen(field, values)) return false;
  return true;
}

function mockForFieldType(field) {
  const id = field.id || 'field';
  const type = field.type || 'text';

  if (TOGGLE_PUBLIC_RE.test(id)) return 'Sí';

  switch (type) {
    case 'checklist':
    case 'multiselect':
      if (field.options?.length) {
        const first = field.options[0];
        return [typeof first === 'object' ? (first.value || first.label || first) : first];
      }
      return ['Opción A'];
    case 'boolean':
      return true;
    case 'number':
      return '42';
    case 'url':
      return 'https://example.com/qa';
    case 'memberList':
      return [{ etiquetaPublica: 'M1', generoPresentacion: 'Hombre' }];
    case 'select':
    case 'radio':
      if (field.options?.length) {
        const opt = field.options[0];
        return typeof opt === 'object' ? (opt.value || opt.label || 'Sí') : opt;
      }
      return 'Sí';
    default:
      return `QA_${id}`;
  }
}

/** Inject known private-field test values. */
function injectPrivateTestValues(values, fieldId) {
  const id = String(fieldId || '');
  if (/cedula/i.test(id)) return '9999999';
  if (/ineFrente|ineReverso|selfie/i.test(id)) return 'https://example.com/private.jpg';
  if (/rfc/i.test(id)) return 'XAXX010101000';
  if (/nombreReal/i.test(id)) return 'Nombre Real QA';
  if (/fechaNacimiento/i.test(id)) return '1990-01-01';
  return `PRIV_${id}`;
}

/**
 * @param {object} mergedCfg
 * @param {object} regCtx
 * @param {object[]} fieldContracts
 */
export function buildMockBloques(mergedCfg, regCtx, fieldContracts = []) {
  const subSlug = slugSubId(regCtx.subcategoriaId);
  const overrides = SUB_OVERRIDES[subSlug] || {};
  const values = { ...overrides };

  if (mergedCfg?.deltaPack) values.deltaPack = mergedCfg.deltaPack;
  if (regCtx.subcategoriaId) values.canonSubcategoriaId = regCtx.subcategoriaId;

  const blocks = mergedCfg?.blocks || [];
  for (const block of blocks) {
    for (const field of block.fields || []) {
      if (!field?.id) continue;
      if (values[field.id] != null && values[field.id] !== '') continue;

      if (field.privacy === 'private' || /cedula|privado|ine|selfie|rfc|nombreReal/i.test(field.id)) {
        values[field.id] = injectPrivateTestValues(values, field.id);
        continue;
      }

      values[field.id] = field.defaultValue != null ? field.defaultValue : mockForFieldType(field);
    }
  }

  for (const fc of fieldContracts) {
    if (fc.privacy?.isPrivateField && values[fc.blockFieldId] == null) {
      values[fc.blockFieldId] = injectPrivateTestValues(values, fc.blockFieldId);
    }
  }

  return values;
}

export function shouldSkipFieldCheck(field, values, regCtx, fieldContract) {
  if (fieldContract?.privacy?.isTogglePublic) {
    return { skip: true, reason: 'toggle mostrar*Publico' };
  }
  if (fieldContract?.privacy?.isPrivateField) {
    return { skip: false, reason: null };
  }
  if (!isFieldVisible(field, values, regCtx)) {
    return { skip: true, reason: 'showWhen / onlySubcategorias oculto' };
  }
  if (fieldContract && fieldContract.render && fieldContract.render.expectedInPerfilPublico === false) {
    return { skip: true, reason: 'no esperado en perfil público' };
  }
  return { skip: false, reason: null };
}

export function getFieldDefFromCfg(mergedCfg, fieldId) {
  for (const block of mergedCfg?.blocks || []) {
    for (const field of block.fields || []) {
      if (field.id === fieldId) return field;
    }
  }
  return null;
}
