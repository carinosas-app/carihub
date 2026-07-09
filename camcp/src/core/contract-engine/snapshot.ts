import { REPORT_SCHEMA_VERSION, SSOT_SNAPSHOT_POLICY } from '../../reports/constants.js';
import type { SsotSnapshotDocument } from '../../reports/schema.js';
import type { ContractGateResult } from './types.js';

export function buildSsotSnapshotDocument(
  gate: ContractGateResult,
  gitCommit: string | null
): SsotSnapshotDocument {
  return {
    schemaVersion: REPORT_SCHEMA_VERSION,
    capturedAt: new Date().toISOString(),
    gitCommit,
    snapshots: gate.snapshots.map((s) => ({
      ssotId: s.ssotId,
      path: s.path,
      versionField: s.version ?? s.versionField ?? null,
      contentHash: s.contentHash,
      byteSize: s.byteSize,
    })),
    policy: SSOT_SNAPSHOT_POLICY,
  };
}

export function gateBlocksDomainEngine(gate: ContractGateResult): boolean {
  return !gate.ssotValid;
}
