/**
 * CariHub — placeholders centralizados para espacios vacíos de Estado y Live.
 * Fuente única: no hardcodear rutas por pantalla.
 */
(function (global) {
  'use strict';

  var PATHS = {
    estado: 'assets/placeholders/estado-placeholder.webp',
    live: 'assets/placeholders/live-placeholder.webp'
  };

  var ALT = {
    estado: 'Estado — comparte lo que estás haciendo',
    live: 'En vivo — conecta con tu audiencia'
  };

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function normalizeKind(kind) {
    var k = String(kind || '').toLowerCase();
    if (k === 'libe' || k === 'live' || k === 'lives' || k === 'en-vivo' || k === 'envivo') return 'live';
    if (k === 'estados' || k === 'estado' || k === 'story' || k === 'status') return 'estado';
    return k === 'live' ? 'live' : 'estado';
  }

  function url(kind) {
    return PATHS[normalizeKind(kind)] || PATHS.estado;
  }

  function defaultAlt(kind) {
    return ALT[normalizeKind(kind)] || ALT.estado;
  }

  function imgTag(kind, alt, extraClass) {
    var cls = 'ch-media-ph' + (extraClass ? ' ' + extraClass : '');
    return (
      '<img class="' + esc(cls) + '" src="' + esc(url(kind)) + '" alt="' + esc(alt || defaultAlt(kind)) + '" decoding="async" loading="lazy">'
    );
  }

  function imgAttrs(kind, alt) {
    return {
      src: url(kind),
      alt: alt || defaultAlt(kind),
      className: 'ch-media-ph'
    };
  }

  /** Slot orgánico: ¿hay media real de estado? */
  function hasEstadoMedia(u) {
    if (!u) return false;
    if (u.actividadImg || u.estadoImg || u.estadoMediaUrl) return true;
    if (u.actividadPosts && u.actividadPosts.length && u.actividadPosts[0] && u.actividadPosts[0].img) return true;
    return false;
  }

  /** Slot orgánico: ¿hay live activo o media real? */
  function hasLiveMedia(u) {
    if (!u) return false;
    if (u.liveImg || u.liveThumb || u.liveMediaUrl) return true;
    if (u.liveActivo === true || u.liveEnVivo === true) return true;
    return false;
  }

  function estadoThumbHtml(u, alt) {
    if (hasEstadoMedia(u)) {
      var src = u.actividadImg || u.estadoImg || u.estadoMediaUrl ||
        (u.actividadPosts && u.actividadPosts[0] && u.actividadPosts[0].img) || '';
      if (src) {
        return '<img class="ch-media-ph ch-media-ph--real" src="' + esc(src) + '" alt="' + esc(alt || defaultAlt('estado')) + '" decoding="async" loading="lazy">';
      }
    }
    return imgTag('estado', alt, 'ch-media-ph--estado');
  }

  function liveThumbHtml(u, alt) {
    if (hasLiveMedia(u)) {
      var src = u.liveImg || u.liveThumb || u.liveMediaUrl || '';
      if (src) {
        return '<img class="ch-media-ph ch-media-ph--real" src="' + esc(src) + '" alt="' + esc(alt || defaultAlt('live')) + '" decoding="async" loading="lazy">';
      }
    }
    return imgTag('live', alt, 'ch-media-ph--live');
  }

  global.CariHubMediaPlaceholders = {
    paths: PATHS,
    url: url,
    get: url,
    alt: defaultAlt,
    imgTag: imgTag,
    imgAttrs: imgAttrs,
    hasEstadoMedia: hasEstadoMedia,
    hasLiveMedia: hasLiveMedia,
    estadoThumbHtml: estadoThumbHtml,
    liveThumbHtml: liveThumbHtml,
    normalizeKind: normalizeKind
  };
})(typeof window !== 'undefined' ? window : globalThis);
