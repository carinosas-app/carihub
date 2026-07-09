import fs from 'node:fs';
import path from 'node:path';
import { assertReadPathAllowed } from '../../policy/path-guard.js';
import { extractJsExportJson, hashFileUtf8, hashJsonCanonical } from './hash.js';
import { getPlugin } from './registry.js';
import type {
  ContractIssue,
  ContractSnapshotEntry,
  SsotDefinition,
} from './types.js';

function issue(
  code: string,
  severity: ContractIssue['severity'],
  message: string,
  extra?: Partial<ContractIssue>
): ContractIssue {
  return { code, severity, message, ...extra };
}

function readVersion(parsed: unknown, versionField: string | null): string | null {
  if (!versionField || !parsed || typeof parsed !== 'object') return null;
  const value = (parsed as Record<string, unknown>)[versionField];
  return typeof value === 'string' ? value : value != null ? String(value) : null;
}

function missingRequiredFields(parsed: unknown, fields: string[]): string[] {
  if (!fields.length) return [];
  if (!parsed || typeof parsed !== 'object') return fields.slice();
  const obj = parsed as Record<string, unknown>;
  return fields.filter((f) => !(f in obj) || obj[f] === undefined || obj[f] === null);
}

function versionSupported(version: string | null, supported: string[]): boolean {
  if (!supported.length || supported.includes('*')) return true;
  if (!version) return false;
  return supported.includes(version);
}

export function validateMirrorPair(
  repoRoot: string,
  ssot: SsotDefinition,
  jsonParsed: unknown
): { mirrorValid: boolean; issues: ContractIssue[] } {
  if (!ssot.mirror) return { mirrorValid: true, issues: [] };

  const mirrorAbs = path.resolve(repoRoot, ssot.mirror.path);
  assertReadPathAllowed(repoRoot, mirrorAbs);

  if (!fs.existsSync(mirrorAbs)) {
    return {
      mirrorValid: false,
      issues: [
        issue('CONTRACT.MIRROR.MISSING', 'error', `Mirror file missing: ${ssot.mirror.path}`, {
          ssotId: ssot.ssotId,
          path: ssot.mirror.path,
        }),
      ],
    };
  }

  const source = fs.readFileSync(mirrorAbs, 'utf8');
  const extracted = extractJsExportJson(source, ssot.mirror.exportPrefix);
  if (!extracted.ok) {
    return {
      mirrorValid: false,
      issues: [
        issue('CONTRACT.MIRROR.MALFORMED', 'error', extracted.error, {
          ssotId: ssot.ssotId,
          path: ssot.mirror.path,
        }),
      ],
    };
  }

  const jsonHash = hashJsonCanonical(jsonParsed);
  const mirrorHash = hashJsonCanonical(extracted.data);
  if (jsonHash !== mirrorHash) {
    return {
      mirrorValid: false,
      issues: [
        issue('CONTRACT.MIRROR.MISMATCH', 'error', 'JSON SSOT and JS mirror content differ', {
          ssotId: ssot.ssotId,
          path: ssot.mirror.path,
        }),
      ],
    };
  }

  return { mirrorValid: true, issues: [] };
}

export interface ValidateSsotResult {
  snapshot: ContractSnapshotEntry | null;
  parsed: unknown;
  issues: ContractIssue[];
}

export function validateSsot(
  repoRoot: string,
  facadeId: string,
  ssot: SsotDefinition
): ValidateSsotResult {
  const issues: ContractIssue[] = [];
  const absPath = path.resolve(repoRoot, ssot.path);
  assertReadPathAllowed(repoRoot, absPath);

  if (!fs.existsSync(absPath)) {
    issues.push(
      issue('CONTRACT.SSOT.MISSING', 'error', `SSOT file missing: ${ssot.path}`, {
        ssotId: ssot.ssotId,
        path: ssot.path,
      })
    );
    return { snapshot: null, parsed: null, issues };
  }

  const { hash, byteSize } = hashFileUtf8(absPath);
  let parsed: unknown = null;

  if (ssot.kind === 'json') {
    try {
      parsed = JSON.parse(fs.readFileSync(absPath, 'utf8')) as unknown;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      issues.push(
        issue('CATALOG.SSOT.INVALID', 'error', `Malformed JSON SSOT: ${msg}`, {
          ssotId: ssot.ssotId,
          path: ssot.path,
        })
      );
      return { snapshot: null, parsed: null, issues };
    }

    const missing = missingRequiredFields(parsed, ssot.requiredFields);
    for (const field of missing) {
      issues.push(
        issue('CONTRACT.SSOT.REQUIRED_FIELD', 'error', `Missing required field: ${field}`, {
          ssotId: ssot.ssotId,
          path: ssot.path,
          field,
        })
      );
    }

    const version = readVersion(parsed, ssot.versionField);
    if (!versionSupported(version, ssot.supportedVersions)) {
      issues.push(
        issue('CONTRACT.VERSION.UNSUPPORTED', 'error', `Unsupported version: ${version ?? 'null'}`, {
          ssotId: ssot.ssotId,
          path: ssot.path,
          field: ssot.versionField ?? undefined,
        })
      );
    }
  }

  const version =
    ssot.kind === 'json' ? readVersion(parsed, ssot.versionField) : null;

  const snapshot: ContractSnapshotEntry = {
    ssotId: ssot.ssotId,
    path: ssot.path.replace(/\\/g, '/'),
    versionField: version,
    version,
    contentHash: hash,
    byteSize,
  };

  const plugin = getPlugin(ssot.plugin);
  if (plugin && ssot.kind === 'json' && parsed !== null) {
    const domainIssues = plugin.validateDomain({
      repoRoot,
      facadeId,
      ssot,
      parsed,
      snapshot,
    });
    issues.push(...domainIssues);
  }

  return { snapshot, parsed, issues };
}

export function facadeInvalidCode(facadeId: string): string {
  if (facadeId.startsWith('catalog.')) return 'CATALOG.SSOT.INVALID';
  if (facadeId.startsWith('profile.')) return 'PARITY.SSOT.INVALID';
  if (facadeId.startsWith('arch.')) return 'ARCH.SSOT.INVALID';
  return 'CONTRACT.SSOT.INVALID';
}
