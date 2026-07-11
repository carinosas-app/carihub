/**
 * BLK-01 Phase 1A/1B-prep — Read-only profile resolver scaffold (default inactive).
 *
 * Future read order when flags ON:
 *   perfiles/{perfilId} → usuarios/{uid} fallback (dual-read only)
 *
 * Never writes. Never exposes denylisted / KYC fields.
 * No production consumer integration.
 *
 * Load order (HTML, when not using DI):
 *   1. carihub-multi-perfil.js
 *   2. carihub-blk01-profile-sanitize.js
 *   3. carihub-blk01-hub-adapter.js
 *   4. carihub-blk01-config.js
 *   5. carihub-profile-resolver.js
 */
(function (global) {
  'use strict';

  var REASON = Object.freeze({
    FLAGS_OFF_INACTIVE: 'flags_off_inactive',
    INVALID_PERFIL_ID: 'invalid_perfil_id',
    PERFIL_ID_NORMALIZED: 'perfil_id_normalized',
    OPAQUE_ID_PRESERVED: 'opaque_id_preserved',
    BRIDGE_UID_CANDIDATE: 'bridge_uid_candidate',
    READ_PERFILES_HIT: 'read_perfiles_hit',
    READ_PERFILES_MISS: 'read_perfiles_miss',
    READ_USUARIOS_FALLBACK_HIT: 'read_usuarios_fallback_hit',
    READ_USUARIOS_FALLBACK_MISS: 'read_usuarios_fallback_miss',
    READ_PERFILES_DETALLE_HIT: 'read_usuarios_perfiles_detalle_hit',
    READ_LEGACY_FLAT_HIT: 'read_usuarios_legacy_flat_hit',
    PROFILE_NOT_FOUND: 'profile_not_found',
    DENYLIST_FIELDS_STRIPPED: 'denylist_fields_stripped',
    RESOLVER_ACTIVE: 'resolver_active'
  });

  var DENYLIST_KEYS = [
    'verificacion', 'ineFrente', 'ineReverso', 'selfieVerificacion',
    'nombreReal', 'fechaNacimiento', 'domicilio', 'correoPrivado',
    'telefonoPrivado', 'kyc', 'notasAdmin', 'email',
    'datosFiscales', 'rfc', 'curp', 'clabe', 'cuentaBancaria',
    'comprobanteDomicilio', 'comprobanteFiscal', 'credencialProfesional',
    'password', 'token', 'refreshToken', 'apiKey',
    'perfilesDetalle', 'perfilesVinculados'
  ];

  function getBlk01Config() {
    return global.CariHubBlk01Config || null;
  }

  function resolveFlags(configOverride) {
    var cfg = getBlk01Config();
    if (cfg && typeof cfg.resolveConfig === 'function') {
      return cfg.resolveConfig(configOverride);
    }
    return {
      blk01DualWriteShadow: false,
      blk01DualReadFallback: false,
      blk01PerfilesReadPrimary: false,
      blk01PerfilesWritePrimary: false,
      blk01LegacyDeprecated: false,
      blk01ResultsPerfilesQuery: false,
      blk01MigrationPhase: 'LEGACY_ONLY',
      blk01ReconcileEnabled: false
    };
  }

  function isResolverActive(configOverride) {
    var cfg = getBlk01Config();
    var flags = resolveFlags(configOverride);
    if (cfg && typeof cfg.isProfileResolverReadEnabled === 'function') {
      return cfg.isProfileResolverReadEnabled(flags);
    }
    return flags.blk01DualReadFallback === true || flags.blk01PerfilesReadPrimary === true;
  }

  function allowsFallback(configOverride) {
    var cfg = getBlk01Config();
    var flags = resolveFlags(configOverride);
    if (cfg && typeof cfg.allowsUsuariosFallback === 'function') {
      return cfg.allowsUsuariosFallback(flags);
    }
    return flags.blk01DualReadFallback === true;
  }

  function looksLikeOpaquePerfilId(id) {
    return /^perfil_[a-z0-9]+_[a-z0-9]+$/i.test(id);
  }

  function looksLikeLegacyPerfilUid(id) {
    return /^perfil_[a-zA-Z0-9]{10,}$/.test(id) && !looksLikeOpaquePerfilId(id);
  }

  /**
   * Normalize identifier without collapsing distinct multi-profile opaque IDs.
   * @returns {{ perfilId: string|null, valid: boolean, opaque: boolean, reasons: string[] }}
   */
  function normalizePerfilId(rawId) {
    var reasons = [];
    if (rawId === null || rawId === undefined) {
      return { perfilId: null, valid: false, opaque: false, reasons: [REASON.INVALID_PERFIL_ID] };
    }
    var perfilId = String(rawId).trim();
    if (!perfilId) {
      return { perfilId: null, valid: false, opaque: false, reasons: [REASON.INVALID_PERFIL_ID] };
    }
    reasons.push(REASON.PERFIL_ID_NORMALIZED);
    var opaque = looksLikeOpaquePerfilId(perfilId);
    if (opaque) {
      reasons.push(REASON.OPAQUE_ID_PRESERVED);
    }
    return { perfilId: perfilId, valid: true, opaque: opaque, reasons: reasons };
  }

  /**
   * BRIDGE-MIG-01 candidates — does not merge distinct opaque profile IDs.
   */
  function bridgeUsuarioCandidates(perfilId) {
    var candidates = [];
    var seen = {};
    function push(id) {
      if (!id || seen[id]) return;
      seen[id] = true;
      candidates.push(id);
    }
    push(perfilId);
    if (looksLikeLegacyPerfilUid(perfilId)) {
      push(perfilId.replace(/^perfil_/, ''));
    } else if (perfilId.indexOf('perfil_') !== 0) {
      push('perfil_' + perfilId);
    }
    return candidates;
  }

  function getSanitizer(deps) {
    deps = deps || {};
    if (deps.sanitize && typeof deps.sanitize.sanitizePublicProfileDeep === 'function') {
      return deps.sanitize;
    }
    return global.CariHubBlk01ProfileSanitize || null;
  }

  function getHubAdapter(deps) {
    deps = deps || {};
    if (deps.hubAdapter && typeof deps.hubAdapter.findProfileInHub === 'function') {
      return deps.hubAdapter;
    }
    var Adapter = global.CariHubBlk01HubAdapter;
    if (Adapter && typeof Adapter.fromGlobal === 'function') {
      return Adapter.fromGlobal(global);
    }
    return null;
  }

  function sanitizePublicProfile(data, deps) {
    var San = getSanitizer(deps);
    if (San && typeof San.sanitizePublicProfileDeep === 'function') {
      var deep = San.sanitizePublicProfileDeep(data);
      var reasons = deep.reasons && deep.reasons.length
        ? [REASON.DENYLIST_FIELDS_STRIPPED]
        : [];
      return { profile: deep.profile, strippedFields: deep.strippedFields || [], reasons: reasons };
    }
    return { profile: data || null, strippedFields: [], reasons: [] };
  }

  function emptyResult(base) {
    return Object.assign({
      ok: false,
      active: false,
      found: false,
      perfilId: null,
      normalizedPerfilId: null,
      usuarioId: null,
      source: 'none',
      profile: null,
      reasons: [],
      strippedFields: [],
      flags: resolveFlags(),
      wrote: false,
      error: null
    }, base || {});
  }

  function buildFoundResult(fields) {
    return Object.assign(emptyResult({
      ok: true,
      active: true,
      found: true
    }), fields, { wrote: false });
  }

  function extractFromHubFallback(hubData, perfilId, cuentaUid, deps) {
    var adapter = getHubAdapter(deps);
    if (!adapter) return null;
    var hit = adapter.findProfileInHub(hubData, perfilId, cuentaUid);
    if (!hit) return null;
    return {
      data: hit.data,
      source: hit.source,
      reason: hit.reason === 'read_usuarios_legacy_flat_hit'
        ? REASON.READ_LEGACY_FLAT_HIT
        : REASON.READ_PERFILES_DETALLE_HIT
    };
  }

  function defaultFirestoreDeps() {
    return {
      getPerfilDoc: function () {
        return Promise.resolve({ exists: false, id: null, data: null });
      },
      getUsuarioDoc: function () {
        return Promise.resolve({ exists: false, id: null, data: null });
      }
    };
  }

  function mergeReasons() {
    var out = [];
    var seen = {};
    for (var i = 0; i < arguments.length; i++) {
      var list = arguments[i];
      if (!Array.isArray(list)) continue;
      list.forEach(function (r) {
        if (!r || seen[r]) return;
        seen[r] = true;
        out.push(r);
      });
    }
    return out;
  }

  /**
   * Read-only profile resolution (inactive when BLK-01 read flags are OFF).
   *
   * @param {string} rawPerfilId
   * @param {object} [deps]
   * @param {object} [deps.firestore] — { getPerfilDoc(id), getUsuarioDoc(uid) }
   * @param {object} [deps.hubAdapter] — { findProfileInHub(hub, perfilId, uid) }
   * @param {object} [deps.sanitize] — { sanitizePublicProfileDeep(data) }
   * @param {object} [deps.configOverride] — flag overrides for tests
   * @param {string} [deps.hintUsuarioId] — optional owner uid hint
   * @returns {Promise<object>}
   */
  function resolveProfile(rawPerfilId, deps) {
    deps = deps || {};
    var flags = resolveFlags(deps.configOverride);
    var norm = normalizePerfilId(rawPerfilId);
    var reasons = norm.reasons.slice();

    if (!norm.valid) {
      return Promise.resolve(emptyResult({
        perfilId: rawPerfilId == null ? null : String(rawPerfilId),
        normalizedPerfilId: null,
        reasons: reasons,
        flags: flags,
        error: 'invalid_perfil_id'
      }));
    }

    if (!isResolverActive(deps.configOverride)) {
      reasons.push(REASON.FLAGS_OFF_INACTIVE);
      return Promise.resolve(emptyResult({
        ok: true,
        perfilId: norm.perfilId,
        normalizedPerfilId: norm.perfilId,
        reasons: reasons,
        flags: flags
      }));
    }

    reasons.push(REASON.RESOLVER_ACTIVE);
    var fs = deps.firestore || defaultFirestoreDeps();
    var perfilId = norm.perfilId;
    var canFallback = allowsFallback(deps.configOverride);

    return fs.getPerfilDoc(perfilId).then(function (perfilSnap) {
      if (perfilSnap && perfilSnap.exists && perfilSnap.data) {
        var sanitized = sanitizePublicProfile(perfilSnap.data, deps);
        return buildFoundResult({
          perfilId: perfilId,
          normalizedPerfilId: perfilId,
          usuarioId: perfilSnap.data.usuarioId || perfilSnap.data.ownerUid || deps.hintUsuarioId || null,
          source: 'perfiles',
          profile: sanitized.profile,
          strippedFields: sanitized.strippedFields,
          reasons: mergeReasons(reasons, [REASON.READ_PERFILES_HIT], sanitized.reasons),
          flags: flags
        });
      }

      reasons.push(REASON.READ_PERFILES_MISS);
      if (!canFallback) {
        reasons.push(REASON.PROFILE_NOT_FOUND);
        return emptyResult({
          ok: true,
          active: true,
          perfilId: perfilId,
          normalizedPerfilId: perfilId,
          reasons: reasons,
          flags: flags
        });
      }

      var usuarioIds = bridgeUsuarioCandidates(deps.hintUsuarioId || perfilId);
      if (deps.hintUsuarioId && usuarioIds.indexOf(deps.hintUsuarioId) < 0) {
        usuarioIds.unshift(deps.hintUsuarioId);
      }
      reasons.push(REASON.BRIDGE_UID_CANDIDATE);

      var chain = Promise.resolve(null);
      usuarioIds.forEach(function (uid) {
        chain = chain.then(function (resolved) {
          if (resolved) return resolved;
          return fs.getUsuarioDoc(uid).then(function (usuarioSnap) {
            if (!usuarioSnap || !usuarioSnap.exists || !usuarioSnap.data) {
              return null;
            }
            var hit = extractFromHubFallback(usuarioSnap.data, perfilId, uid, deps);
            if (hit) {
              return {
                usuarioId: uid,
                source: hit.source,
                reason: hit.reason,
                data: hit.data
              };
            }
            return null;
          });
        });
      });

      return chain.then(function (fallbackHit) {
        if (fallbackHit) {
          var fbSanitized = sanitizePublicProfile(fallbackHit.data, deps);
          return buildFoundResult({
            perfilId: perfilId,
            normalizedPerfilId: perfilId,
            usuarioId: fallbackHit.usuarioId,
            source: fallbackHit.source,
            profile: fbSanitized.profile,
            strippedFields: fbSanitized.strippedFields,
            reasons: mergeReasons(
              reasons,
              [REASON.READ_USUARIOS_FALLBACK_HIT, fallbackHit.reason],
              fbSanitized.reasons
            ),
            flags: flags
          });
        }

        reasons.push(REASON.READ_USUARIOS_FALLBACK_MISS);
        reasons.push(REASON.PROFILE_NOT_FOUND);
        return emptyResult({
          ok: true,
          active: true,
          perfilId: perfilId,
          normalizedPerfilId: perfilId,
          reasons: reasons,
          flags: flags
        });
      });
    });
  }

  global.CariHubProfileResolver = {
    REASON: REASON,
    DENYLIST_KEYS: DENYLIST_KEYS,
    normalizePerfilId: normalizePerfilId,
    bridgeUsuarioCandidates: bridgeUsuarioCandidates,
    sanitizePublicProfile: sanitizePublicProfile,
    getHubAdapter: getHubAdapter,
    isResolverActive: isResolverActive,
    resolveProfile: resolveProfile,
    emptyResult: emptyResult
  };
})(typeof window !== 'undefined' ? window : globalThis);
