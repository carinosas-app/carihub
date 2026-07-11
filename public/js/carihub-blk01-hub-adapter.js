/**
 * BLK-01 Phase 1B-prep — TICKET-003 hub read adapter (W2).
 *
 * Thin read-only wrapper over CariHubMultiPerfil for profile resolver fallback.
 * Does not duplicate TICKET-003 write/migration logic.
 *
 * Script load order (when not using dependency injection in tests):
 *   1. carihub-multi-perfil.js
 *   2. carihub-blk01-hub-adapter.js
 *   3. carihub-profile-resolver.js
 *
 * Optional upstream: carihub-blk01-config.js, carihub-blk01-profile-sanitize.js
 */
(function (global) {
  'use strict';

  var LOAD_ORDER = Object.freeze([
    'carihub-multi-perfil.js',
    'carihub-blk01-hub-adapter.js',
    'carihub-profile-resolver.js'
  ]);

  var REQUIRED_MULTI_PERFIL_METHODS = Object.freeze([
    'expandPerfilesFromHub',
    'hasLegacyFlatPerfil',
    'legacyPerfilId',
    'extractProfilePayload',
    'matchPerfilId'
  ]);

  function assertMultiPerfilContract(multiPerfil) {
    if (!multiPerfil || typeof multiPerfil !== 'object') {
      return { ok: false, missing: REQUIRED_MULTI_PERFIL_METHODS.slice() };
    }
    var missing = [];
    for (var i = 0; i < REQUIRED_MULTI_PERFIL_METHODS.length; i++) {
      var name = REQUIRED_MULTI_PERFIL_METHODS[i];
      if (typeof multiPerfil[name] !== 'function') missing.push(name);
    }
    return { ok: missing.length === 0, missing: missing };
  }

  /**
   * Resolve a profile entry from hub data without collapsing opaque perfilIds.
   *
   * @returns {{ data: object, source: string, reason: string }|null}
   */
  function findProfileInHub(multiPerfil, hubData, perfilId, cuentaUid) {
    var check = assertMultiPerfilContract(multiPerfil);
    if (!check.ok) return null;

    hubData = hubData || {};
    cuentaUid = cuentaUid || hubData.uid || hubData.cuentaUid || '';
    if (!perfilId) return null;

    if (multiPerfil.hasLegacyFlatPerfil(hubData) && !multiPerfil.hasNestedPerfiles(hubData)) {
      var legacyId = multiPerfil.legacyPerfilId(hubData, cuentaUid);
      var legacyBridge = legacyId === perfilId
        || cuentaUid === perfilId
        || legacyId === ('perfil_' + perfilId);
      if (legacyBridge) {
        return {
          data: Object.assign(
            { perfilId: legacyId, usuarioId: cuentaUid, cuentaUid: cuentaUid },
            multiPerfil.extractProfilePayload(hubData)
          ),
          source: 'usuarios_legacy_flat',
          reason: 'read_usuarios_legacy_flat_hit'
        };
      }
    }

    var expanded = multiPerfil.expandPerfilesFromHub(hubData, cuentaUid);
    for (var i = 0; i < expanded.length; i++) {
      var row = expanded[i];
      if (!row || !row._raw) continue;
      if (multiPerfil.matchPerfilId(row, perfilId)) {
        return {
          data: Object.assign({ perfilId: perfilId, usuarioId: cuentaUid, cuentaUid: cuentaUid }, row._raw),
          source: 'usuarios_perfilesDetalle',
          reason: 'read_usuarios_perfiles_detalle_hit'
        };
      }
    }

    return null;
  }

  function create(multiPerfil) {
    return {
      findProfileInHub: function (hubData, perfilId, cuentaUid) {
        return findProfileInHub(multiPerfil, hubData, perfilId, cuentaUid);
      },
      assertContract: function () {
        return assertMultiPerfilContract(multiPerfil);
      }
    };
  }

  function fromGlobal(scope) {
    scope = scope || global;
    return create(scope.CariHubMultiPerfil || null);
  }

  global.CariHubBlk01HubAdapter = {
    LOAD_ORDER: LOAD_ORDER,
    REQUIRED_MULTI_PERFIL_METHODS: REQUIRED_MULTI_PERFIL_METHODS,
    assertMultiPerfilContract: assertMultiPerfilContract,
    findProfileInHub: findProfileInHub,
    create: create,
    fromGlobal: fromGlobal
  };
})(typeof window !== 'undefined' ? window : globalThis);
