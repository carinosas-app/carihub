/**
 * Imágenes oficiales de preview — Estados y LIBE (slots renta vacíos).
 * Delega en CariHubMediaPlaceholders (fuente única).
 */
(function (global) {
  'use strict';

  var PH = global.CariHubMediaPlaceholders;

  function url(kind) {
    if (PH && PH.url) return PH.url(kind);
    return kind === 'libe' || kind === 'live'
      ? 'assets/placeholders/live-placeholder.webp'
      : 'assets/placeholders/estado-placeholder.webp';
  }

  global.CariHubSlotPreviewImages = {
    estados: url('estados'),
    libe: url('libe'),
    get: url
  };
})(typeof window !== 'undefined' ? window : globalThis);
