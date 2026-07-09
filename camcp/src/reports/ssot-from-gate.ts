import type { ContractGateResult } from '../core/contract-engine/types.js';
import { buildSsotSnapshotDocument } from '../core/contract-engine/snapshot.js';
import type { SsotSnapshotDocument } from './schema.js';

/** Bridge Reports Engine v2 ← Contract Engine gate output. */
export function ssotSnapshotFromGate(
  gate: ContractGateResult,
  gitCommit: string | null
): SsotSnapshotDocument {
  return buildSsotSnapshotDocument(gate, gitCommit);
}

export { gateBlocksDomainEngine } from '../core/contract-engine/snapshot.js';
