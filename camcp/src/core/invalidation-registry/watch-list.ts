import type { WatchedResource } from './types.js';
import { listAllWatches } from './registry.js';
import { watchResourceKey } from './runtime-state.js';

export function watchList(): WatchedResource[] {
  return listAllWatches().map((w) => ({
    watchId: w.watchId,
    facadeId: w.facadeId,
    kind: w.kind,
    resourceKey: watchResourceKey(w),
    invalidates: w.invalidates,
    completedCheckPattern: w.completedCheckPattern,
  }));
}
