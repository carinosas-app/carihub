import { findTextMatches } from './dom-extractor.mjs';
import { classifyRenderSeverity } from './severity.mjs';

/**
 * @param {object} params
 * @returns {object[]}
 */
export function runRenderPrivacyChecks(params) {
  const { dom, fieldContracts, mapEntry, subcategoriaId } = params;
  const results = [];

  const patterns = new Set(mapEntry?.privatePatterns || []);
  for (const fc of fieldContracts || []) {
    if (!fc.privacy?.mustNeverAppearInPublic) continue;
    patterns.add(String(fc.blockFieldId));
    if (fc.blockFieldId?.toLowerCase().includes('cedula')) {
      patterns.add('9999999');
    }
  }

  for (const pattern of patterns) {
    const p = String(pattern || '').trim();
    if (!p || p.length < 4) continue;
    const hits = findTextMatches(dom, [p]);
    if (hits.count > 0) {
      results.push({
        subcategoriaId,
        blockFieldId: p,
        check: 'absence',
        status: 'fail',
        severity: 'bloqueador',
        reason: `dato privado "${p}" visible en DOM`,
        matches: hits.matches,
      });
    }
  }

  if (results.length === 0) {
    results.push({
      subcategoriaId,
      blockFieldId: '*',
      check: 'absence',
      status: 'pass',
      severity: null,
      reason: 'sin privados visibles',
    });
  }

  return results;
}

export { classifyRenderSeverity };
