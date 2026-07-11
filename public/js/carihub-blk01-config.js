/**
 * BLK-01 — Shared feature-flag contract (default OFF, production-safe).
 *
 * Frozen names: scripts/PLAN-CONSTRUCCION-BLK-01-MIGRACION-PERFILID.md §8
 *
 * Globals (unambiguous):
 *   window.CariHubBlk01Config         — exported configuration API (this module)
 *   window.CariHubBlk01RuntimeConfig  — optional runtime flag overrides (plain object)
 *   window.__CARIHUB_FLAGS__          — optional alias override (Phase 0 contract)
 *
 * Precedence: resolveConfig(override) > __CARIHUB_FLAGS__ > CariHubBlk01RuntimeConfig > defaults
 * Only known blk01* flag keys are read from override sources; API methods are never flags.
 */
(function (global) {
  'use strict';

  var MIGRATION_PHASES = [
    'LEGACY_ONLY',
    'DUAL_WRITE_SHADOW',
    'DUAL_READ_FALLBACK',
    'PERFILES_READ_PRIMARY',
    'PERFILES_WRITE_PRIMARY',
    'LEGACY_DEPRECATED'
  ];

  var DEFAULTS = Object.freeze({
    blk01DualWriteShadow: false,
    blk01DualReadFallback: false,
    blk01PerfilesReadPrimary: false,
    blk01PerfilesWritePrimary: false,
    blk01LegacyDeprecated: false,
    blk01ResultsPerfilesQuery: false,
    blk01MigrationPhase: 'LEGACY_ONLY',
    blk01ReconcileEnabled: false
  });

  var RUNTIME_FLAG_KEYS = Object.keys(DEFAULTS);

  function parseBool(value, fallback) {
    if (value === true || value === false) return value;
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;
    return fallback;
  }

  function normalizeMigrationPhase(phase) {
    var normalized = String(phase || DEFAULTS.blk01MigrationPhase).trim().toUpperCase();
    return MIGRATION_PHASES.indexOf(normalized) >= 0 ? normalized : DEFAULTS.blk01MigrationPhase;
  }

  /** Extract only frozen blk01 flag keys; ignore API keys accidentally placed on override objects. */
  function pickRuntimeFlags(source) {
    var out = {};
    if (!source || typeof source !== 'object') return out;
    for (var i = 0; i < RUNTIME_FLAG_KEYS.length; i++) {
      var key = RUNTIME_FLAG_KEYS[i];
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        out[key] = source[key];
      }
    }
    return out;
  }

  function readSource(override) {
    if (override && typeof override === 'object') {
      return pickRuntimeFlags(override);
    }
    if (global.__CARIHUB_FLAGS__ && typeof global.__CARIHUB_FLAGS__ === 'object') {
      return pickRuntimeFlags(global.__CARIHUB_FLAGS__);
    }
    if (global.CariHubBlk01RuntimeConfig && typeof global.CariHubBlk01RuntimeConfig === 'object') {
      return pickRuntimeFlags(global.CariHubBlk01RuntimeConfig);
    }
    return {};
  }

  function resolveConfig(override) {
    var source = readSource(override);
    return {
      blk01DualWriteShadow: parseBool(source.blk01DualWriteShadow, DEFAULTS.blk01DualWriteShadow),
      blk01DualReadFallback: parseBool(source.blk01DualReadFallback, DEFAULTS.blk01DualReadFallback),
      blk01PerfilesReadPrimary: parseBool(source.blk01PerfilesReadPrimary, DEFAULTS.blk01PerfilesReadPrimary),
      blk01PerfilesWritePrimary: parseBool(source.blk01PerfilesWritePrimary, DEFAULTS.blk01PerfilesWritePrimary),
      blk01LegacyDeprecated: parseBool(source.blk01LegacyDeprecated, DEFAULTS.blk01LegacyDeprecated),
      blk01ResultsPerfilesQuery: parseBool(source.blk01ResultsPerfilesQuery, DEFAULTS.blk01ResultsPerfilesQuery),
      blk01MigrationPhase: normalizeMigrationPhase(source.blk01MigrationPhase),
      blk01ReconcileEnabled: parseBool(source.blk01ReconcileEnabled, DEFAULTS.blk01ReconcileEnabled)
    };
  }

  /** Profile read resolver is active only when a read-phase flag is ON. */
  function isProfileResolverReadEnabled(config) {
    config = config || resolveConfig();
    return config.blk01DualReadFallback === true || config.blk01PerfilesReadPrimary === true;
  }

  function allowsUsuariosFallback(config) {
    config = config || resolveConfig();
    return config.blk01DualReadFallback === true;
  }

  global.CariHubBlk01Config = {
    MIGRATION_PHASES: MIGRATION_PHASES,
    DEFAULTS: DEFAULTS,
    RUNTIME_FLAG_KEYS: RUNTIME_FLAG_KEYS,
    parseBool: parseBool,
    normalizeMigrationPhase: normalizeMigrationPhase,
    pickRuntimeFlags: pickRuntimeFlags,
    resolveConfig: resolveConfig,
    isProfileResolverReadEnabled: isProfileResolverReadEnabled,
    allowsUsuariosFallback: allowsUsuariosFallback
  };
})(typeof window !== 'undefined' ? window : globalThis);
