import { jsonContainsPrivatePatterns, hasVal, getByPath } from './path-utils.mjs';

const ROOT_STRIP_DEFAULT = [
  'datosPrivados', 'verificacion', 'camposPrivados', 'camposPublicos',
  'schemaResuelto', 'email', 'telefono',
];

const NESTED_STRIP_DEFAULT = [
  'nombreReal', 'fechaNacimiento', 'domicilioPrivado', 'correoPrivado', 'telefonoPrivado',
  'rfc', 'razonSocial', 'cedulaNumero', 'cedulaProfesion', 'cedulaProfesional', 'cedulaComprobante',
  'ineFrente', 'ineReverso', 'selfieVerificacion', 'notasInternas', 'notasRevisionAdmin',
];

/**
 * @param {object} params
 * @returns {object[]}
 */
export function runPrivacyChecks(params) {
  const { fieldContracts, slimDoc, hydrated, guard, nestedProfileKey } = params;
  const results = [];
  const serialized = JSON.stringify(hydrated || {});

  for (const rootKey of ROOT_STRIP_DEFAULT) {
    if (hasVal(hydrated?.[rootKey])) {
      results.push(fail('privacy', rootKey, 'root', `ROOT_STRIP "${rootKey}" visible post-Guard`, hydrated[rootKey]));
    }
  }

  for (const fc of fieldContracts) {
    if (!fc.privacy?.mustNeverAppearInPublic) continue;

    const fieldId = fc.blockFieldId;
    const paths = [fieldId];
    if (nestedProfileKey) paths.push(`${nestedProfileKey}.${fieldId}`);

    for (const p of paths) {
      const v = getByPath(hydrated, p);
      if (hasVal(v)) {
        results.push(fail('privacy', fieldId, 'bloqueador', `${fieldId} visible en hydrate (${p})`, v));
      }
    }

    const slimNested = nestedProfileKey ? getByPath(slimDoc, `${nestedProfileKey}.${fieldId}`) : undefined;
    const slimRoot = slimDoc?.[fieldId];
    if (hasVal(slimNested) || (hasVal(slimRoot) && !fc.paths?.bloquesKey)) {
      results.push(fail('privacy', fieldId, 'importante', `${fieldId} persistido en slim doc`, slimNested ?? slimRoot));
    }

    if (jsonContainsPrivatePatterns(serialized, fieldId)) {
      results.push(fail('privacy', fieldId, 'bloqueador', `${fieldId} en JSON serializado`, null));
    }
  }

  for (const nestedKey of guard?.NESTED_STRIP || NESTED_STRIP_DEFAULT) {
    if (!nestedProfileKey) continue;
    const v = getByPath(hydrated, `${nestedProfileKey}.${nestedKey}`);
    if (hasVal(v)) {
      results.push(fail('privacy', nestedKey, 'bloqueador', `NESTED_STRIP ${nestedProfileKey}.${nestedKey}`, v));
    }
  }

  if (results.length === 0) {
    results.push({ stage: 'privacy', status: 'pass', blockFieldId: '*', reason: 'sin violaciones' });
  }

  return results;
}

function fail(stage, blockFieldId, severity, reason, actualValue) {
  return {
    subcategoriaId: null,
    blockFieldId,
    stage,
    status: 'fail',
    severity,
    expectedPath: null,
    expectedValue: null,
    actualValue,
    reason,
  };
}
