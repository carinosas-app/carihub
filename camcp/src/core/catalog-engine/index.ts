export {
  composeCatalogAudit,
  capabilityForCatalogFacet,
  facetsForAudit,
  validateCatalogAuditInput,
} from './composer.js';
export { loadCatalogConfig, resetCatalogConfigCache, type CatalogConfig } from './config-loader.js';
export {
  buildCatalogStats,
  gateHash,
} from './stats.js';
export {
  resetCatalogFindingSeq,
  buildSsotInvalidFinding,
  dedupeFindingsByPairKey,
} from './findings.js';
export {
  loadSchemaIndex,
  loadAliasDocuments,
  globFilesBounded,
  resolveGlobWalkBase,
} from './loader.js';
export { findPreviousFullRun, shouldSkipExpensiveFacets } from './skip.js';
export {
  CATALOG_AUDIT_INPUT_SCHEMA_VERSION,
  CATALOG_FACET_ORDER,
  CATALOG_HEALTH_SCHEMA_VERSION,
  CATALOG_STATS_SCHEMA_VERSION,
  EXPENSIVE_FACETS,
  type CatalogAuditFacet,
  type CatalogAuditInput,
  type CatalogComposeResult,
  type CatalogEngineContext,
  type CatalogHealthDocument,
  type CatalogStatsDocument,
} from './types.js';
