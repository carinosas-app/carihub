import type { ContractGateResult, RunContractGateInput } from './types.js';
import { CONTRACT_ENGINE_VERSION, CONTRACT_GATE_SCHEMA_VERSION } from './types.js';
import { listSsotsForFacade } from './registry.js';
import { validateMirrorPair, validateSsot } from './validate.js';

export function runContractGate(input: RunContractGateInput): ContractGateResult {
  const facet = input.facet ?? null;
  const ssots = listSsotsForFacade(input.facadeId, input.ssotIds);
  const errors: ContractGateResult['errors'] = [];
  const warnings: ContractGateResult['warnings'] = [];
  const snapshots: ContractGateResult['snapshots'] = [];
  let mirrorValid = true;

  for (const ssot of ssots) {
    const result = validateSsot(input.repoRoot, input.facadeId, ssot);
    for (const item of result.issues) {
      if (item.severity === 'error') errors.push(item);
      else warnings.push(item);
    }

    if (result.snapshot) snapshots.push(result.snapshot);

    if (ssot.mirror && result.parsed !== null && result.issues.every((i) => i.severity !== 'error')) {
      const mirror = validateMirrorPair(input.repoRoot, ssot, result.parsed);
      if (!mirror.mirrorValid) mirrorValid = false;
      for (const item of mirror.issues) {
        if (item.severity === 'error') errors.push(item);
        else warnings.push(item);
      }
    }
  }

  if (ssots.length === 0) {
    warnings.push({
      code: 'CONTRACT.SSOT.NONE',
      severity: 'warning',
      message: `No SSOT entries registered for facade ${input.facadeId}`,
    });
  }

  const ssotValid = errors.length === 0;
  const blockedFacets: string[] = [];
  if (!ssotValid && facet) blockedFacets.push(facet);

  return {
    schemaVersion: CONTRACT_GATE_SCHEMA_VERSION,
    engineVersion: CONTRACT_ENGINE_VERSION,
    facadeId: input.facadeId,
    facet,
    ssotValid,
    mirrorValid: mirrorValid && ssotValid,
    snapshots,
    errors,
    warnings,
    blockedFacets,
  };
}
