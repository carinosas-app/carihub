import { hasVal, getByPath, firstVal, valuesMatch, jsonContainsPrivatePatterns } from './path-utils.mjs';
import { shouldSkipFieldCheck, getFieldDefFromCfg } from './mock-generator.mjs';

/**
 * @param {object} params
 * @returns {object[]}
 */
export function runParityChecks(params) {
  const {
    fieldContracts,
    mergedCfg,
    regCtx,
    mockBloques,
    mapped,
    slimDoc,
    hydrated,
    nestedProfileKey,
  } = params;

  const results = [];

  for (const fc of fieldContracts) {
    const field = getFieldDefFromCfg(mergedCfg, fc.blockFieldId) || { id: fc.blockFieldId };
    const skipInfo = shouldSkipFieldCheck(field, mockBloques, regCtx, fc);

    if (fc.privacy?.isPrivateField) continue;

    if (skipInfo.skip) {
      results.push(makeResult(fc, 'skip', null, skipInfo.reason, null));
      continue;
    }

    const paths = fc.paths?.mapToPerfilKeys || [fc.blockFieldId];
    if (nestedProfileKey) {
      paths.push(`${nestedProfileKey}.${fc.blockFieldId}`);
    }

    const mockVal = mockBloques[fc.blockFieldId];

    // map
    const mapHit = firstVal(mapped, paths);
    if (!mapHit) {
      results.push(makeResult(fc, 'map', 'fail', 'valor ausente tras mapToPerfil', paths, mockVal, null));
    } else if (hasVal(mockVal) && !valuesMatch(mockVal, mapHit.value)) {
      results.push(makeResult(fc, 'map', 'warn', 'valor transformado en map (derivado)', paths, mockVal, mapHit.value));
    } else {
      results.push(makeResult(fc, 'map', 'pass', null, paths, mockVal, mapHit.value));
    }

    // persist
    const persistPaths = [...paths];
    if (nestedProfileKey) persistPaths.unshift(`${nestedProfileKey}.${fc.blockFieldId}`);
    const persistHit = firstVal(slimDoc, persistPaths);
    const bloquesHit = getByPath(slimDoc, `camposPublicos.bloquesPublicos.${fc.blockFieldId}`);
    if (!persistHit && !hasVal(bloquesHit)) {
      results.push(makeResult(fc, 'persist', 'fail', 'no persistido en slim', persistPaths, mockVal, null));
    } else {
      results.push(makeResult(fc, 'persist', 'pass', null, persistPaths, mockVal, persistHit?.value ?? bloquesHit));
    }

    // hydrate
    const hydrateHit = firstVal(hydrated, paths);
    if (!hydrateHit) {
      results.push(makeResult(fc, 'hydrate', 'fail', 'perdido tras hydrate', paths, mockVal, null));
    } else if (hasVal(mockVal) && !valuesMatch(mockVal, hydrateHit.value)) {
      results.push(makeResult(fc, 'hydrate', 'warn', 'round-trip transformado (derivado)', paths, mockVal, hydrateHit.value));
    } else {
      results.push(makeResult(fc, 'hydrate', 'pass', null, paths, mockVal, hydrateHit.value));
    }
  }

  return results;
}

function makeResult(fc, stage, status, reason, paths, expected, actual) {
  const severity = status === 'fail' ? 'importante' : 'mejora';
  return {
    subcategoriaId: fc.subcategoriaId,
    blockFieldId: fc.blockFieldId,
    stage,
    status: status || 'pass',
    severity: status === 'fail' ? severity : status === 'warn' ? 'mejora' : 'mejora',
    expectedPath: Array.isArray(paths) ? paths.join(' | ') : paths,
    expectedValue: expected,
    actualValue: actual,
    reason,
  };
}

/** Sub-level integrity checks. */
export function runSubIntegrityChecks({ mapped, slimDoc, hydrated, nestedProfileKey }) {
  const results = [];

  const checks = [
    ['__hydratedFromBloques', hydrated?.__hydratedFromBloques === true, '__hydratedFromBloques !== true'],
    ['slim.bloquesPublicos', !!slimDoc?.camposPublicos?.bloquesPublicos, 'camposPublicos.bloquesPublicos ausente'],
    ['slim.sinCamposPrivados', !slimDoc?.camposPrivados, 'camposPrivados en slim'],
    ['mapped.sectorId', hasVal(mapped?.sectorId) || hasVal(hydrated?.sectorId), 'sectorId ausente'],
  ];

  if (nestedProfileKey) {
    checks.push([
      `slim.${nestedProfileKey}`,
      hasVal(slimDoc?.[nestedProfileKey]),
      `nested ${nestedProfileKey} no persistido`,
    ]);
  }

  for (const [name, ok, detail] of checks) {
    results.push({
      kind: 'sub_integrity',
      name,
      status: ok ? 'pass' : 'fail',
      severity: ok ? null : 'bloqueador',
      reason: ok ? null : detail,
    });
  }

  return results;
}

export { hasVal, getByPath, valuesMatch };
