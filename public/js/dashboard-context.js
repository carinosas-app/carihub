/**
 * Contexto global del dashboard rentero — publicación activa (perfil/banner).
 * Evento: carihub:dash-context-change
 */
(function (global) {
  'use strict';

  var EVENT = 'carihub:dash-context-change';
  var STORAGE_KEY = 'carihub_dash_context';

  var emptyCtx = {
    tipo: 'perfil',
    id: null,
    perfilId: null,
    bannerId: null,
    solicitudId: null
  };

  var ctx = Object.assign({}, emptyCtx);

  function normalize(input) {
    input = input || {};
    var tipo = input.tipo === 'banner' ? 'banner' : (input.tipo === 'live' ? 'live' : 'perfil');
    var id = input.id || (tipo === 'banner' ? input.bannerId : input.perfilId) || null;
    return {
      tipo: tipo,
      id: id,
      perfilId: tipo === 'perfil' ? (input.perfilId || id) : (input.perfilId || null),
      bannerId: tipo === 'banner' ? (input.bannerId || id) : (input.bannerId || null),
      solicitudId: input.solicitudId || null
    };
  }

  function sameContext(a, b) {
    return a && b && a.tipo === b.tipo && a.id === b.id;
  }

  function readQueryContext() {
    try {
      var p = new URLSearchParams(global.location.search);
      var perfilId = p.get('perfilId');
      var bannerId = p.get('bannerId');
      if (perfilId) {
        return normalize({ tipo: 'perfil', id: perfilId, perfilId: perfilId });
      }
      if (bannerId) {
        return normalize({ tipo: 'banner', id: bannerId, bannerId: bannerId });
      }
    } catch (e) { /* ignore */ }
    return null;
  }

  function syncUrl(current) {
    try {
      var p = new URLSearchParams(global.location.search);
      p.delete('perfilId');
      p.delete('bannerId');
      if (current.tipo === 'perfil' && current.perfilId) {
        p.set('perfilId', current.perfilId);
      } else if (current.tipo === 'banner' && current.bannerId) {
        p.set('bannerId', current.bannerId);
      }
      var qs = p.toString();
      var url = global.location.pathname + (qs ? '?' + qs : '') + (global.location.hash || '');
      global.history.replaceState(null, '', url);
    } catch (e) { /* ignore */ }
  }

  function persist(current) {
    try {
      global.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch (e) { /* ignore */ }
  }

  function restore() {
    try {
      var raw = global.sessionStorage.getItem(STORAGE_KEY);
      if (raw) return normalize(JSON.parse(raw));
    } catch (e) { /* ignore */ }
    return null;
  }

  function emit(previous) {
    global.document.dispatchEvent(new CustomEvent(EVENT, {
      detail: {
        context: get(),
        previous: previous
      }
    }));
  }

  function get() {
    return Object.assign({}, ctx);
  }

  function set(input, opts) {
    opts = opts || {};
    var next = normalize(input);
    if (!next.id) return get();
    var prev = get();
    if (!opts.force && sameContext(prev, next)) return prev;
    ctx = next;
    if (opts.persist !== false) persist(ctx);
    if (opts.syncUrl !== false) syncUrl(ctx);
    emit(prev);
    return get();
  }

  function init(seed, opts) {
    opts = opts || {};
    var fromQuery = readQueryContext();
    var fromStorage = restore();
    var preferSeed = opts.preferSeed === true;
    var base = fromQuery
      || (preferSeed && seed && seed.id ? seed : null)
      || (!preferSeed && fromStorage)
      || (preferSeed && fromStorage)
      || seed
      || null;
    if (base && base.id) {
      ctx = normalize(base);
      persist(ctx);
      if (fromQuery) syncUrl(ctx);
    } else if (seed && seed.id) {
      ctx = normalize(seed);
      persist(ctx);
    }
    return get();
  }

  function clear() {
    try {
      global.sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) { /* ignore */ }
    ctx = Object.assign({}, emptyCtx);
  }

  global.DashContext = {
    EVENT: EVENT,
    init: init,
    get: get,
    set: set,
    clear: clear,
    readQuery: readQueryContext,
    restore: restore,
    syncUrl: function () { syncUrl(ctx); },
    /** Filtro mensajes: { contextoTipo, contextoId } desde contexto rail */
    toMensajesFilter: function (input) {
      var c = normalize(input || ctx);
      if (!c.id) return { contextoTipo: 'perfil', contextoId: null };
      return {
        contextoTipo: c.tipo === 'banner' ? 'banner' : 'perfil',
        contextoId: c.tipo === 'banner' ? (c.bannerId || c.id) : (c.perfilId || c.id)
      };
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
