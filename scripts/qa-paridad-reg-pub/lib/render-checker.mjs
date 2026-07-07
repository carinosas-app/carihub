import { getByPath, hasVal, valuesMatch } from './path-utils.mjs';
import { findTextMatches } from './dom-extractor.mjs';
import { classifyRenderSeverity } from './severity.mjs';
import { shouldSkipFieldCheck, getFieldDefFromCfg } from './mock-generator.mjs';

function needlesForField(fieldId, hydrated, finalized, mapEntry) {
  const aliases = mapEntry?.aliases?.[fieldId] || [];
  const fromMock = finalized?.[fieldId];
  const fromHydrated = hydrated?.[fieldId];
  const nestedKey = mapEntry?.nestedProfileKey;
  const nestedVal = nestedKey ? getByPath(hydrated, `${nestedKey}.${fieldId}`) : undefined;

  const needles = new Set();
  for (const v of [fromMock, fromHydrated, nestedVal, ...aliases]) {
    if (Array.isArray(v)) {
      v.forEach((x) => needles.add(String(x)));
    } else if (hasVal(v)) {
      needles.add(String(v));
    }
  }
  return [...needles].filter((n) => n.length >= 2);
}

function sectionForField(fieldId, mapEntry) {
  for (const [name, sec] of Object.entries(mapEntry?.sections || {})) {
    if ((sec.fieldIds || []).includes(fieldId)) return name;
  }
  return null;
}

/**
 * @returns {object[]}
 */
export function runRenderChecks(params) {
  const {
    fieldContracts,
    mergedCfg,
    regCtx,
    hydrated,
    finalized,
    dom,
    sectionTexts,
    mapEntry,
    subcategoriaId,
  } = params;

  const results = [];
  const smokeSet = new Set(mapEntry?.smokeFields || []);

  for (const fc of fieldContracts || []) {
    if (smokeSet.size && !smokeSet.has(fc.blockFieldId)) {
      continue;
    }
    const field = getFieldDefFromCfg(mergedCfg, fc.blockFieldId) || { id: fc.blockFieldId };
    const skipInfo = shouldSkipFieldCheck(field, finalized || {}, regCtx, fc);

    if (fc.privacy?.isPrivateField) continue;

    if (skipInfo.skip || !fc.render?.expectedInPerfilPublico) {
      results.push({
        subcategoriaId,
        blockFieldId: fc.blockFieldId,
        check: 'presence',
        status: 'skip',
        severity: null,
        reason: skipInfo.reason || 'no esperado en perfil',
      });
      continue;
    }

    const needles = needlesForField(fc.blockFieldId, hydrated, finalized, mapEntry);
    if (!needles.length) {
      results.push({
        subcategoriaId,
        blockFieldId: fc.blockFieldId,
        check: 'presence',
        status: 'skip',
        severity: null,
        reason: 'sin valor mock para buscar',
      });
      continue;
    }

    const match = findTextMatches(dom, needles, sectionTexts);
    const expectedSection = sectionForField(fc.blockFieldId, mapEntry);

    if (match.count === 0) {
      results.push({
        subcategoriaId,
        blockFieldId: fc.blockFieldId,
        check: 'presence',
        status: 'fail',
        severity: classifyRenderSeverity(fc, 'presence'),
        expectedText: needles[0],
        expectedSection,
        reason: 'valor/label no visible en DOM',
      });
      continue;
    }

    results.push({
      subcategoriaId,
      blockFieldId: fc.blockFieldId,
      check: 'presence',
      status: 'pass',
      severity: null,
      expectedText: needles[0],
      expectedSection,
      matchCount: match.count,
    });

    if (match.count > 1) {
      results.push({
        subcategoriaId,
        blockFieldId: fc.blockFieldId,
        check: 'duplicate',
        status: 'warn',
        severity: classifyRenderSeverity(fc, 'duplicate'),
        reason: `texto duplicado ${match.count} veces visible`,
        matchCount: match.count,
      });
    }

    if (expectedSection) {
      const inSec = match.inSections[expectedSection] || 0;
      const wrongSecs = Object.entries(match.inSections).filter(
        ([k, c]) => k !== expectedSection && c > 0
      );
      if (inSec === 0 && match.count > 0) {
        results.push({
          subcategoriaId,
          blockFieldId: fc.blockFieldId,
          check: 'location',
          status: 'warn',
          severity: classifyRenderSeverity(fc, 'location'),
          expectedSection,
          reason: `presente en DOM pero no en sección "${expectedSection}"`,
          wrongSections: wrongSecs.map(([k]) => k),
        });
      } else if (wrongSecs.length) {
        results.push({
          subcategoriaId,
          blockFieldId: fc.blockFieldId,
          check: 'location',
          status: 'warn',
          severity: 'importante',
          expectedSection,
          reason: `también visible fuera de sección esperada`,
          wrongSections: wrongSecs.map(([k]) => k),
        });
      } else {
        results.push({
          subcategoriaId,
          blockFieldId: fc.blockFieldId,
          check: 'location',
          status: 'pass',
          severity: null,
          expectedSection,
        });
      }
    }
  }

  return results;
}

export { valuesMatch, hasVal };
