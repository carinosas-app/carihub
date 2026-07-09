export { evaluateInvalidation, isCatalogCheckProtectedFromGitOnly } from './evaluate.js';
export { explainInvalidation } from './explain.js';
export { registerFacadeManifest } from './register.js';
export { watchList } from './watch-list.js';
export {
  loadInvalidationRegistryConfig,
  listAllWatches,
  listFacadeRegistrations,
  getFacadeRegistration,
  registryVersion,
  resetInvalidationRegistryCache,
} from './registry.js';
export { matchesCheckPattern, parseCheckId } from './patterns.js';
export { snapshotMap, currentWatchFingerprint, hashGlobFiles } from './runtime-state.js';
export type {
  InvalidatedReason,
  CompletedCheck,
  CheckEvaluation,
  EvaluateInput,
  EvaluateResult,
  ExplainResult,
  FacadeManifest,
  RegisterAck,
  WatchedResource,
  WatchRegistration,
  GitContext,
  SnapshotRef,
} from './types.js';
export { INVALIDATION_REGISTRY_SCHEMA_VERSION } from './types.js';
