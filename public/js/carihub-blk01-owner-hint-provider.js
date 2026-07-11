/**
 * BLK-01 Phase 1C-c — Untrusted owner-hint advisory cache (sessionStorage only).
 *
 * Supplies hintUsuarioId candidates for CariHubProfileResolver.
 * Does NOT verify ownership, call Firestore, or call the resolver.
 *
 * Load before perfil-publico-init.js when BLK-01 stack is present.
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'carihub_blk01_owner_hint_v1';
  var VERSION = 1;
  var TTL_MS = 1800000;
  var MAX_ENTRIES = 20;

  var POLLUTION_KEYS = { __proto__: true, constructor: true, prototype: true };
  var OPAQUE_PERFIL_RE = /^perfil_[a-z0-9]+_[a-z0-9]+$/i;

  function nowMs() {
    return Date.now();
  }

  function isNonEmptyString(v) {
    return typeof v === 'string' && v.trim().length > 0;
  }

  function normalizePerfilId(raw) {
    if (!isNonEmptyString(raw)) return null;
    return String(raw).trim();
  }

  function looksLikeOpaquePerfilId(id) {
    return OPAQUE_PERFIL_RE.test(id);
  }

  function isValidUsuarioIdHint(raw) {
    if (!isNonEmptyString(raw)) return false;
    var id = String(raw).trim();
    if (!id || id.length > 128) return false;
    if (looksLikeOpaquePerfilId(id)) return false;
    if (/[\s<>"]/.test(id)) return false;
    return true;
  }

  function getSessionStorage() {
    try {
      if (global.sessionStorage && typeof global.sessionStorage.getItem === 'function') {
        return global.sessionStorage;
      }
    } catch (e) { /* unavailable */ }
    return null;
  }

  function safeParse(raw) {
    if (!isNonEmptyString(raw)) return null;
    try {
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function isSafeKey(key) {
    return isNonEmptyString(key) && !POLLUTION_KEYS[key];
  }

  function emptyStore() {
    return { version: VERSION, entries: {} };
  }

  function readStore() {
    var ss = getSessionStorage();
    if (!ss) return emptyStore();
    var parsed = safeParse(ss.getItem(STORAGE_KEY));
    if (!parsed) {
      try { ss.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
      return emptyStore();
    }
    if (parsed.version !== VERSION) {
      try { ss.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
      return emptyStore();
    }
    if (!parsed.entries || typeof parsed.entries !== 'object' || Array.isArray(parsed.entries)) {
      try { ss.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
      return emptyStore();
    }
    return parsed;
  }

  function writeStore(store) {
    var ss = getSessionStorage();
    if (!ss) return false;
    try {
      ss.setItem(STORAGE_KEY, JSON.stringify(store));
      return true;
    } catch (e) {
      return false;
    }
  }

  function purgeExpiredEntries(entries, ts) {
    ts = ts == null ? nowMs() : ts;
    var out = {};
    Object.keys(entries || {}).forEach(function (perfilId) {
      if (!isSafeKey(perfilId)) return;
      var row = entries[perfilId];
      if (!row || typeof row !== 'object') return;
      if (!isValidUsuarioIdHint(row.usuarioId)) return;
      if (typeof row.expiresAt !== 'number' || row.expiresAt <= ts) return;
      out[perfilId] = {
        usuarioId: String(row.usuarioId).trim(),
        storedAt: typeof row.storedAt === 'number' ? row.storedAt : ts,
        expiresAt: row.expiresAt
      };
    });
    return out;
  }

  function enforceLRU(entries) {
    var keys = Object.keys(entries || {});
    if (keys.length <= MAX_ENTRIES) return entries;
    keys.sort(function (a, b) {
      var sa = entries[a].storedAt || 0;
      var sb = entries[b].storedAt || 0;
      return sa - sb;
    });
    var out = {};
    var drop = keys.length - MAX_ENTRIES;
    for (var i = drop; i < keys.length; i++) {
      out[keys[i]] = entries[keys[i]];
    }
    return out;
  }

  function loadEntries() {
    var store = readStore();
    store.entries = purgeExpiredEntries(store.entries);
    return store;
  }

  function persistEntries(entries) {
    var store = { version: VERSION, entries: enforceLRU(purgeExpiredEntries(entries)) };
    return writeStore(store);
  }

  function getOwnerHint(perfilId, opts) {
    opts = opts || {};
    perfilId = normalizePerfilId(perfilId);
    if (!perfilId) return null;

    var store = loadEntries();
    var row = store.entries[perfilId];
    if (!row || !isValidUsuarioIdHint(row.usuarioId)) return null;
    if (typeof row.expiresAt !== 'number' || row.expiresAt <= nowMs()) {
      delete store.entries[perfilId];
      persistEntries(store.entries);
      return null;
    }
    return String(row.usuarioId).trim();
  }

  function deriveOwnerHint(perfilId, opts) {
    opts = opts || {};
    perfilId = normalizePerfilId(perfilId);
    if (!perfilId) return null;

    if (opts.explicitHint != null && isValidUsuarioIdHint(opts.explicitHint)) {
      return String(opts.explicitHint).trim();
    }

    return getOwnerHint(perfilId, opts);
  }

  function setOwnerHint(perfilId, usuarioId, opts) {
    opts = opts || {};
    perfilId = normalizePerfilId(perfilId);
    if (!perfilId || !isValidUsuarioIdHint(usuarioId)) return false;

    var ts = nowMs();
    var store = loadEntries();
    store.entries[perfilId] = {
      usuarioId: String(usuarioId).trim(),
      storedAt: ts,
      expiresAt: ts + TTL_MS
    };
    return persistEntries(store.entries);
  }

  function clearOwnerHint(perfilId) {
    perfilId = normalizePerfilId(perfilId);
    if (!perfilId) return false;
    var store = loadEntries();
    if (!store.entries[perfilId]) return true;
    delete store.entries[perfilId];
    return persistEntries(store.entries);
  }

  function clearAll() {
    var ss = getSessionStorage();
    if (!ss) return false;
    try {
      ss.removeItem(STORAGE_KEY);
      return true;
    } catch (e) {
      return false;
    }
  }

  global.CariHubOwnerHintProvider = {
    STORAGE_KEY: STORAGE_KEY,
    VERSION: VERSION,
    TTL_MS: TTL_MS,
    MAX_ENTRIES: MAX_ENTRIES,
    deriveOwnerHint: deriveOwnerHint,
    getOwnerHint: getOwnerHint,
    setOwnerHint: setOwnerHint,
    clearOwnerHint: clearOwnerHint,
    clearAll: clearAll
  };
})(typeof window !== 'undefined' ? window : globalThis);
