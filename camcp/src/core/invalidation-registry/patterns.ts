import type { CompletedCheck } from './types.js';

/** Parse check id into toolId and facet (e.g. profile.audit:parity). */
export function parseCheckId(checkId: string): { toolId: string; facet: string | null } {
  const colon = checkId.indexOf(':');
  if (colon < 0) return { toolId: checkId, facet: null };
  return {
    toolId: checkId.slice(0, colon),
    facet: checkId.slice(colon + 1) || null,
  };
}

export function checkFacet(check: CompletedCheck): string | null {
  if (check.facet != null) return check.facet;
  return parseCheckId(check.id).facet;
}

export function matchesCheckPattern(checkId: string, pattern: string): boolean {
  const alternatives = pattern.split('|').map((s) => s.trim()).filter(Boolean);
  return alternatives.some((alt) => matchOnePattern(checkId, alt));
}

function matchOnePattern(checkId: string, pattern: string): boolean {
  if (pattern.endsWith(':*')) {
    const prefix = pattern.slice(0, -1);
    return checkId === prefix.slice(0, -1) || checkId.startsWith(prefix);
  }

  const brace = pattern.match(/^(.+):\{([^}]+)\}$/);
  if (brace) {
    const prefix = `${brace[1]}:`;
    const facets = brace[2].split(',').map((s) => s.trim());
    if (!checkId.startsWith(prefix)) return false;
    const facet = checkId.slice(prefix.length);
    return facets.includes(facet);
  }

  return checkId === pattern;
}

export function watchAppliesToCheck(
  check: CompletedCheck,
  invalidates: string[]
): boolean {
  const facet = checkFacet(check);
  if (invalidates.includes('*')) return true;
  if (!facet) return false;
  return invalidates.includes(facet);
}
