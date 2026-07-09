import type { ExplainResult, WatchRegistration } from './types.js';
import { matchesCheckPattern } from './patterns.js';
import { listAllWatches } from './registry.js';
import { watchResourceKey } from './runtime-state.js';

function toStep(watch: WatchRegistration & { facadeId: string }) {
  return {
    watchId: watch.watchId,
    facadeId: watch.facadeId,
    kind: watch.kind,
    resourceKey: watchResourceKey(watch),
    invalidates: watch.invalidates,
    completedCheckPattern: watch.completedCheckPattern,
  };
}

export function explainInvalidation(checkId: string): ExplainResult {
  const matchedWatches = listAllWatches().filter((w) =>
    matchesCheckPattern(checkId, w.completedCheckPattern)
  );

  const steps = matchedWatches.map(toStep);
  const dependencyChain = steps.map(
    (s) => `${s.watchId} (${s.kind}:${s.resourceKey}) → invalidates [${s.invalidates.join(', ')}]`
  );

  return {
    checkId,
    matchedWatches: steps,
    dependencyChain,
  };
}
