export {
  composeProfileAudit,
  capabilityForProfileFacet,
  facetsForProfileAudit,
  validateProfileAuditInput,
  buildSuggestedNext,
} from './composer.js';
export { loadProfileConfig, resetProfileConfigCache, type ProfileConfig } from './config-loader.js';
export { buildProfileHealth } from './health.js';
export {
  resetProfileFindingSeq,
  buildSsotInvalidFinding,
  buildVisualNotImplementedFinding,
  dedupeFindings,
} from './findings.js';
export { resolveScope } from './scope.js';
export {
  PROFILE_AUDIT_INPUT_SCHEMA_VERSION,
  PROFILE_HEALTH_SCHEMA_VERSION,
  PROFILE_FACET_ORDER,
  DELEGATED_FACETS,
  type ProfileAuditFacet,
  type ProfileAuditInput,
  type ProfileComposeResult,
  type ProfileEngineContext,
  type ProfileHealthDocument,
  type DelegationRecord,
} from './types.js';
