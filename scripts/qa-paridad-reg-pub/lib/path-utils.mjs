/** @param {unknown} v */
export function hasVal(v) {
  if (v == null) return false;
  if (typeof v === 'string') return v.trim() !== '';
  if (typeof v === 'boolean') return true;
  if (typeof v === 'number') return !Number.isNaN(v);
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'object') return Object.keys(v).length > 0;
  return true;
}

/** @param {Record<string, unknown>} obj @param {string} dotPath */
export function getByPath(obj, dotPath) {
  if (!obj || !dotPath) return undefined;
  const parts = dotPath.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[p];
  }
  return cur;
}

/** First path in list with a value. */
export function firstVal(obj, paths) {
  for (const p of paths) {
    const v = getByPath(obj, p);
    if (hasVal(v)) return { path: p, value: v };
  }
  return null;
}

/** Loose equality for QA round-trip (strings trimmed, arrays non-empty). */
export function valuesMatch(expected, actual) {
  if (!hasVal(expected) && !hasVal(actual)) return true;
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) return hasVal(actual);
    if (!expected.length) return true;
    return expected.some((e) =>
      actual.some((a) => String(a).trim() === String(e).trim())
    );
  }
  if (typeof expected === 'boolean') return Boolean(actual) === expected;
  return String(expected).trim() === String(actual).trim();
}

/** Scan serialized output for private patterns. */
export function jsonContainsPrivatePatterns(json, fieldId) {
  const id = String(fieldId || '');
  if (!id) return false;
  const re = new RegExp(`"${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s*:\\s*"[^"]+"`);
  return re.test(json);
}
