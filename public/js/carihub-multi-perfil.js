/**
 * TICKET-003 — Runtime multi-perfil en usuarios/{uid}.
 * Helpers compartidos: rail, registro y dashboard.
 */
(function (global) {
  'use strict';

  var HUB_ONLY_KEYS = ['perfilesDetalle', 'perfilesVinculados', 'perfilActivoId'];

  function matchPerfilId(pub, perfilId) {
    if (!pub || !perfilId) return false;
    return pub.id === perfilId || pub.perfilId === perfilId;
  }

  function findPerfil(perfiles, perfilId) {
    if (!perfilId || !Array.isArray(perfiles)) return null;
    for (var i = 0; i < perfiles.length; i++) {
      if (matchPerfilId(perfiles[i], perfilId)) return perfiles[i];
    }
    return null;
  }

  function selectInitialPerfil(perfiles, perfilActivoId, timestampFn) {
    perfiles = perfiles || [];
    if (!perfiles.length) return null;
    var hit = findPerfil(perfiles, perfilActivoId);
    if (hit) return hit;
    timestampFn = timestampFn || function () { return 0; };
    return perfiles.slice().sort(function (a, b) {
      return timestampFn(b) - timestampFn(a);
    })[0];
  }

  function extractProfilePayload(data) {
    data = data || {};
    var out = {};
    Object.keys(data).forEach(function (key) {
      if (HUB_ONLY_KEYS.indexOf(key) >= 0) return;
      out[key] = data[key];
    });
    return out;
  }

  function buildPerfilVinculado(perfilId, doc) {
    doc = doc || {};
    return {
      perfilId: perfilId,
      nombre: doc.nombre || doc.alias || doc.nombrePublico || '',
      categoria: doc.categoria || '',
      fotoThumb: doc.fotoURL || doc.fotoThumb || '',
      activo: doc.activo === true
    };
  }

  function hasNestedPerfiles(hubData) {
    var det = hubData && hubData.perfilesDetalle;
    return !!(det && typeof det === 'object' && Object.keys(det).length > 0);
  }

  function hasLegacyFlatPerfil(hubData) {
    if (!hubData) return false;
    if (hasNestedPerfiles(hubData)) return false;
    return !!(
      hubData.perfilId ||
      hubData.nombre ||
      hubData.alias ||
      hubData.nombrePublico ||
      hubData.categoria
    );
  }

  function legacyPerfilId(hubData, cuentaUid) {
    return (hubData && hubData.perfilId) || ('perfil_' + cuentaUid);
  }

  function ensureLegacyInHub(existingData, cuentaUid, slimLegacyFn) {
    var vinculados = Array.isArray(existingData.perfilesVinculados)
      ? existingData.perfilesVinculados.slice()
      : [];
    var detalle = {};
    var srcDet = existingData.perfilesDetalle;
    if (srcDet && typeof srcDet === 'object') {
      Object.keys(srcDet).forEach(function (id) {
        detalle[id] = srcDet[id];
      });
    }
    if (vinculados.length || Object.keys(detalle).length) {
      return { vinculados: vinculados, detalle: detalle };
    }
    if (!hasLegacyFlatPerfil(existingData)) {
      return { vinculados: vinculados, detalle: detalle };
    }
    var legacyId = legacyPerfilId(existingData, cuentaUid);
    var legacyRaw = Object.assign(
      { perfilId: legacyId, cuentaUid: cuentaUid },
      extractProfilePayload(existingData)
    );
    var legacySlim = typeof slimLegacyFn === 'function'
      ? slimLegacyFn(legacyRaw)
      : legacyRaw;
    vinculados.push(buildPerfilVinculado(legacyId, legacySlim));
    detalle[legacyId] = Object.assign({ perfilId: legacyId, cuentaUid: cuentaUid }, legacySlim);
    return { vinculados: vinculados, detalle: detalle };
  }

  function buildLegacyMigrationPatch(hubData, cuentaUid, slimLegacyFn) {
    if (!hasLegacyFlatPerfil(hubData)) return null;
    var legacyId = legacyPerfilId(hubData, cuentaUid);
    var packed = ensureLegacyInHub(hubData, cuentaUid, slimLegacyFn);
    return {
      perfilesVinculados: packed.vinculados,
      perfilesDetalle: packed.detalle,
      perfilActivoId: hubData.perfilActivoId || legacyId
    };
  }

  function upsertVinculado(vinculados, perfilId, doc) {
    var idx = -1;
    for (var i = 0; i < vinculados.length; i++) {
      if (vinculados[i] && vinculados[i].perfilId === perfilId) {
        idx = i;
        break;
      }
    }
    var entry = buildPerfilVinculado(perfilId, doc);
    if (idx >= 0) vinculados[idx] = entry;
    else vinculados.push(entry);
    return vinculados;
  }

  /**
   * @param {object} existingData hub Firestore
   * @param {string} perfilId
   * @param {object} profileDoc perfil ya slim
   * @param {object} opts { cuentaUid, slimLegacyFn }
   */
  function appendPerfilToHub(existingData, perfilId, profileDoc, opts) {
    opts = opts || {};
    existingData = existingData || {};
    var cuentaUid = opts.cuentaUid || existingData.uid || existingData.cuentaUid || profileDoc.cuentaUid || profileDoc.uid;
    var packed = ensureLegacyInHub(existingData, cuentaUid, opts.slimLegacyFn);
    var vinculados = packed.vinculados;
    var detalle = packed.detalle;
    var slimNew = Object.assign({}, profileDoc || {});

    if (detalle[perfilId]) {
      detalle[perfilId] = Object.assign({}, detalle[perfilId], { perfilId: perfilId, cuentaUid: cuentaUid }, slimNew);
      upsertVinculado(vinculados, perfilId, detalle[perfilId]);
      return {
        perfilesVinculados: vinculados,
        perfilesDetalle: detalle,
        perfilActivoId: perfilId
      };
    }

    vinculados = upsertVinculado(vinculados, perfilId, slimNew);
    detalle[perfilId] = Object.assign({ perfilId: perfilId, cuentaUid: cuentaUid }, slimNew);

    return {
      perfilesVinculados: vinculados,
      perfilesDetalle: detalle,
      perfilActivoId: perfilId
    };
  }

  function iterPerfilIds(hubData) {
    hubData = hubData || {};
    var orden = Array.isArray(hubData.perfilesVinculados)
      ? hubData.perfilesVinculados.map(function (v) { return v && v.perfilId; }).filter(Boolean)
      : [];
    var detalle = hubData.perfilesDetalle;
    var ids = [];
    var seen = {};
    function push(id) {
      if (!id || seen[id]) return;
      seen[id] = true;
      ids.push(id);
    }
    orden.forEach(push);
    if (detalle && typeof detalle === 'object') {
      Object.keys(detalle).forEach(push);
    }
    if (!ids.length && hasLegacyFlatPerfil(hubData)) {
      push(legacyPerfilId(hubData, hubData.uid || hubData.cuentaUid || ''));
    }
    return ids;
  }

  function expandPerfilesFromHub(hubData, cuentaUid) {
    hubData = hubData || {};
    cuentaUid = cuentaUid || hubData.uid || hubData.cuentaUid || '';
    var detalle = hubData.perfilesDetalle;
    var out = [];

    if (detalle && typeof detalle === 'object' && Object.keys(detalle).length) {
      iterPerfilIds(hubData).forEach(function (perfilId) {
        var p = detalle[perfilId];
        if (!p || typeof p !== 'object') return;
        out.push({
          id: perfilId,
          perfilId: perfilId,
          cuentaUid: p.cuentaUid || cuentaUid,
          origen: 'usuarios',
          tipo: 'perfil',
          ownerUid: p.cuentaUid || cuentaUid,
          _raw: Object.assign({ perfilId: perfilId, cuentaUid: cuentaUid }, p)
        });
      });
      return out;
    }

    if (hasLegacyFlatPerfil(hubData)) {
      var legacyId = legacyPerfilId(hubData, cuentaUid);
      out.push({
        id: legacyId,
        perfilId: legacyId,
        cuentaUid: cuentaUid,
        origen: 'usuarios',
        tipo: 'perfil',
        ownerUid: cuentaUid,
        _raw: Object.assign({ perfilId: legacyId, cuentaUid: cuentaUid }, extractProfilePayload(hubData))
      });
    }
    return out;
  }

  function resolvePerfilActivoId(hubData, perfiles, timestampFn) {
    var stored = hubData && hubData.perfilActivoId;
    if (stored && findPerfil(perfiles, stored)) return stored;
    var picked = selectInitialPerfil(perfiles, stored, timestampFn);
    return picked ? (picked.perfilId || picked.id) : null;
  }

  global.CariHubMultiPerfil = {
    HUB_ONLY_KEYS: HUB_ONLY_KEYS,
    matchPerfilId: matchPerfilId,
    findPerfil: findPerfil,
    selectInitialPerfil: selectInitialPerfil,
    extractProfilePayload: extractProfilePayload,
    buildPerfilVinculado: buildPerfilVinculado,
    hasNestedPerfiles: hasNestedPerfiles,
    hasLegacyFlatPerfil: hasLegacyFlatPerfil,
    legacyPerfilId: legacyPerfilId,
    buildLegacyMigrationPatch: buildLegacyMigrationPatch,
    appendPerfilToHub: appendPerfilToHub,
    expandPerfilesFromHub: expandPerfilesFromHub,
    resolvePerfilActivoId: resolvePerfilActivoId,
    iterPerfilIds: iterPerfilIds
  };
})(typeof window !== 'undefined' ? window : globalThis);
