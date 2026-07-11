/**
 * BLK-01 Phase 1B-prep — recursive public profile sanitization (W3).
 *
 * Removes private/KYC/fiscal fields at any nesting depth without mutating input.
 */
(function (global) {
  'use strict';

  var DENYLIST_KEYS = [
    'verificacion', 'ineFrente', 'ineReverso', 'selfieVerificacion',
    'nombreReal', 'fechaNacimiento', 'domicilio', 'correoPrivado',
    'telefonoPrivado', 'kyc', 'notasAdmin', 'email',
    'datosFiscales', 'rfc', 'curp', 'clabe', 'cuentaBancaria',
    'comprobanteDomicilio', 'comprobanteFiscal', 'credencialProfesional',
    'password', 'token', 'refreshToken', 'apiKey',
    'perfilesDetalle', 'perfilesVinculados', 'perfilActivoId'
  ];

  var HUB_ONLY_KEYS = ['perfilesDetalle', 'perfilesVinculados', 'perfilActivoId'];

  var SENSITIVE_CONTAINER_KEYS = [
    'verificacion', 'kyc', 'datosFiscales'
  ];

  var PROTOTYPE_POLLUTION_KEYS = ['__proto__', 'constructor', 'prototype'];

  var DENYLIST_SET = {};
  var HUB_ONLY_SET = {};
  var SENSITIVE_CONTAINER_SET = {};
  var POLLUTION_SET = {};

  function buildSet(arr, target) {
    for (var i = 0; i < arr.length; i++) target[arr[i]] = true;
  }

  buildSet(DENYLIST_KEYS, DENYLIST_SET);
  buildSet(HUB_ONLY_KEYS, HUB_ONLY_SET);
  buildSet(SENSITIVE_CONTAINER_KEYS, SENSITIVE_CONTAINER_SET);
  buildSet(PROTOTYPE_POLLUTION_KEYS, POLLUTION_SET);

  function isForbiddenKey(key) {
    return !!(DENYLIST_SET[key] || HUB_ONLY_SET[key] || POLLUTION_SET[key]);
  }

  function joinPath(base, key) {
    if (!base) return String(key);
    if (/^\[\d+\]$/.test(String(key))) return base + key;
    return base + '.' + key;
  }

  function sanitizeValue(value, path, stripped, seen) {
    if (value === null || value === undefined) return value;
    var t = typeof value;
    if (t === 'string' || t === 'number' || t === 'boolean') return value;
    if (t !== 'object') return value;

    if (seen.has(value)) {
      stripped.push(joinPath(path, '[circular]'));
      return null;
    }
    seen.add(value);

    if (Array.isArray(value)) {
      var arrOut = [];
      for (var i = 0; i < value.length; i++) {
        arrOut.push(sanitizeValue(value[i], joinPath(path, '[' + i + ']'), stripped, seen));
      }
      return arrOut;
    }

    var out = {};
    Object.keys(value).forEach(function (key) {
      if (isForbiddenKey(key) || SENSITIVE_CONTAINER_SET[key]) {
        stripped.push(joinPath(path, key));
        return;
      }
      out[key] = sanitizeValue(value[key], joinPath(path, key), stripped, seen);
    });
    return out;
  }

  /**
   * Deep-clone sanitize — never mutates input.
   *
   * @returns {{ profile: object|null, strippedFields: string[], reasons: string[] }}
   */
  function sanitizePublicProfileDeep(data) {
    if (data === null || data === undefined) {
      return { profile: null, strippedFields: [], reasons: [] };
    }
    var stripped = [];
    var profile = sanitizeValue(data, '', stripped, new WeakSet());
    var reasons = stripped.length ? ['denylist_fields_stripped'] : [];
    return { profile: profile, strippedFields: stripped, reasons: reasons };
  }

  global.CariHubBlk01ProfileSanitize = {
    DENYLIST_KEYS: DENYLIST_KEYS,
    HUB_ONLY_KEYS: HUB_ONLY_KEYS,
    SENSITIVE_CONTAINER_KEYS: SENSITIVE_CONTAINER_KEYS,
    PROTOTYPE_POLLUTION_KEYS: PROTOTYPE_POLLUTION_KEYS,
    isForbiddenKey: isForbiddenKey,
    sanitizePublicProfileDeep: sanitizePublicProfileDeep
  };
})(typeof window !== 'undefined' ? window : globalThis);
