import crypto from 'node:crypto';
import fs from 'node:fs';

export function sha256Utf8(content: string): string {
  return `sha256:${crypto.createHash('sha256').update(content, 'utf8').digest('hex')}`;
}

export function hashFileUtf8(filePath: string): { hash: string; byteSize: number } {
  const buf = fs.readFileSync(filePath);
  return {
    hash: `sha256:${crypto.createHash('sha256').update(buf).digest('hex')}`,
    byteSize: buf.byteLength,
  };
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(obj).sort()) {
      out[key] = sortKeysDeep(obj[key]);
    }
    return out;
  }
  return value;
}

/** Canonical JSON hash for mirror parity checks. */
export function hashJsonCanonical(value: unknown): string {
  return sha256Utf8(JSON.stringify(sortKeysDeep(value)));
}

export function extractJsExportJson(
  source: string,
  exportPrefix: string
): { ok: true; data: unknown } | { ok: false; error: string } {
  const idx = source.indexOf(exportPrefix);
  if (idx < 0) {
    return { ok: false, error: `Missing export prefix: ${exportPrefix}` };
  }
  const tail = source.slice(idx + exportPrefix.length).trim();
  const start = tail.indexOf('{');
  if (start < 0) {
    return { ok: false, error: 'No JSON object after export prefix' };
  }
  let depth = 0;
  let end = -1;
  for (let i = start; i < tail.length; i += 1) {
    const ch = tail[i];
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end < 0) {
    return { ok: false, error: 'Unbalanced JSON object in JS mirror' };
  }
  try {
    return { ok: true, data: JSON.parse(tail.slice(start, end)) as unknown };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
