import type {
  CheckEvaluation,
  CompletedCheck,
  EvaluateInput,
  EvaluateResult,
  InvalidatedReason,
  WatchRegistration,
} from './types.js';
import {
  INVALIDATION_REGISTRY_SCHEMA_VERSION,
} from './types.js';
import { matchesCheckPattern, watchAppliesToCheck } from './patterns.js';
import { listAllWatches, registryVersion } from './registry.js';
import { currentWatchFingerprint, snapshotMap, watchResourceKey } from './runtime-state.js';

function storedHash(check: CompletedCheck, key: string): string | undefined {
  return (
    check.ssotHash?.[key] ??
    check.fileHash?.[key] ??
    check.fileHash?.[key.replace(/\\/g, '/')]
  );
}

function storedVersion(check: CompletedCheck, key: string): string | undefined {
  return check.ssotVersions?.[key] ?? check.configVersions?.[key];
}

function compareWatch(
  watch: WatchRegistration,
  check: CompletedCheck,
  repoRoot: string,
  snapshots: ReturnType<typeof snapshotMap>,
  gitContext: EvaluateInput['gitContext']
): CheckEvaluation | null {
  if (!matchesCheckPattern(check.id, watch.completedCheckPattern)) return null;
  if (!watchAppliesToCheck(check, watch.invalidates)) return null;

  if (watch.kind === 'git') {
    if (watch.source === 'git.head') {
      const stored = check.gitCommit ?? null;
      const current = gitContext.commit;
      if (stored != null && current != null && stored !== current) {
        return {
          id: check.id,
          valid: false,
          reason: 'git_head_changed',
          watchId: watch.watchId,
          message: `HEAD ${stored} → ${current}`,
        };
      }
    }
    if (watch.source === 'git.branch') {
      const stored = check.gitBranch ?? null;
      const current = gitContext.branch;
      if (stored != null && current != null && stored !== current) {
        return {
          id: check.id,
          valid: false,
          reason: 'git_branch_changed',
          watchId: watch.watchId,
          message: `branch ${stored} → ${current}`,
        };
      }
    }
    return null;
  }

  const fp = currentWatchFingerprint(repoRoot, watch, snapshots);
  if (!fp) return null;
  const key = fp.key;

  if (watch.kind === 'config') {
    const storedVer = storedVersion(check, key);
    const currentVer = fp.version ?? undefined;
    if (storedVer && currentVer && storedVer !== currentVer) {
      return {
        id: check.id,
        valid: false,
        reason: 'qa_script_version_bump',
        watchId: watch.watchId,
        message: `${key} version ${storedVer} → ${currentVer}`,
      };
    }
    return null;
  }

  const stored = storedHash(check, key);
  const current = fp.hash;

  if (watch.kind === 'ssot') {
    const storedVer = storedVersion(check, key);
    const currentVer = fp.version ?? undefined;
    if (storedVer && currentVer && storedVer !== currentVer) {
      return {
        id: check.id,
        valid: false,
        reason: 'ssot_version_bump',
        watchId: watch.watchId,
        message: `${key} version ${storedVer} → ${currentVer}`,
      };
    }
  }

  if (stored && current && stored !== current) {
    const reason: InvalidatedReason =
      watch.kind === 'ssot' ? 'ssot_hash_mismatch' : 'file_hash_changed';
    return {
      id: check.id,
      valid: false,
      reason,
      watchId: watch.watchId,
      message: `${key} hash changed`,
    };
  }

  return null;
}

function evaluateMetaInvalidation(
  check: CompletedCheck,
  now: Date,
  forceRefresh: boolean,
  regVersion: string
): CheckEvaluation | null {
  if (check.forceRefresh || forceRefresh) {
    return {
      id: check.id,
      valid: false,
      reason: 'operator_refresh',
      message: 'forceRefresh requested',
    };
  }

  if (check.registryVersion && check.registryVersion !== regVersion) {
    return {
      id: check.id,
      valid: false,
      reason: 'registry_rules_bump',
      message: `registry ${check.registryVersion} → ${regVersion}`,
    };
  }

  if (check.schemaVersion && check.schemaVersion !== '2.0.0') {
    return {
      id: check.id,
      valid: false,
      reason: 'schema_upgraded',
      message: `report schema ${check.schemaVersion} → 2.0.0`,
    };
  }

  if (check.completedAt && check.maxAgeMs != null && check.maxAgeMs > 0) {
    const age = now.getTime() - new Date(check.completedAt).getTime();
    if (age > check.maxAgeMs) {
      return {
        id: check.id,
        valid: false,
        reason: 'expired',
        message: `age ${age}ms > maxAgeMs ${check.maxAgeMs}`,
      };
    }
  }

  return null;
}

export function evaluateInvalidation(input: EvaluateInput): EvaluateResult {
  const now = input.now ?? new Date();
  const regVersion = registryVersion();
  const snapshots = snapshotMap(input.currentSnapshots);
  const watches = listAllWatches();
  const checks: CheckEvaluation[] = [];

  for (const check of input.completedChecks) {
    const meta = evaluateMetaInvalidation(
      check,
      now,
      input.forceRefresh ?? false,
      regVersion
    );
    if (meta) {
      checks.push(meta);
      continue;
    }

    let invalidated: CheckEvaluation | null = null;
    for (const watch of watches) {
      const hit = compareWatch(
        watch,
        check,
        input.repoRoot,
        snapshots,
        input.gitContext
      );
      if (hit) {
        if (
          isCatalogCheckProtectedFromGitOnly(check, hit, snapshots, check)
        ) {
          continue;
        }
        invalidated = hit;
        break;
      }
    }

    checks.push(
      invalidated ?? {
        id: check.id,
        valid: true,
        reason: null,
      }
    );
  }

  return {
    schemaVersion: INVALIDATION_REGISTRY_SCHEMA_VERSION,
    registryVersion: regVersion,
    checks,
  };
}

/** IR4: git.head must not invalidate catalog.audit unless schema-index also changed. */
export function isCatalogCheckProtectedFromGitOnly(
  check: CompletedCheck,
  evaluation: CheckEvaluation,
  snapshots: ReturnType<typeof snapshotMap>,
  storedCheck: CompletedCheck
): boolean {
  if (!check.id.startsWith('catalog.audit:')) return false;
  if (evaluation.reason !== 'git_head_changed' && evaluation.reason !== 'git_branch_changed') {
    return false;
  }
  const snap = snapshots.get('registro-schema-index');
  const storedHash = storedCheck.ssotHash?.['registro-schema-index'];
  if (!snap?.contentHash || !storedHash) return true;
  return snap.contentHash === storedHash;
}
