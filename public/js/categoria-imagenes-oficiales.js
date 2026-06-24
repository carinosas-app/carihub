/**
 * Imágenes oficiales por subcategoría (congeladas hasta nuevo aviso).
 * Queen of Spades → hotwife / cuckold · Neon Swingers → parejas swinger.
 */
(function (global) {
  'use strict';

  var BASE = 'img/home/cat-cards/';
  var QUEEN_OF_SPADES = BASE + 'queen-of-spades.png';
  var PAREJAS_SWINGER = BASE + 'parejas-swinger.png';

  var OFICIAL = {
    hotwife: { src: QUEEN_OF_SPADES, pos: 'center center', fit: 'contain', bg: '#ffffff' },
    'cuckold hotwife': { src: QUEEN_OF_SPADES, pos: 'center center', fit: 'contain', bg: '#ffffff' },
    cuckold: { src: QUEEN_OF_SPADES, pos: 'center center', fit: 'contain', bg: '#ffffff' },
    'parejas swinger': { src: PAREJAS_SWINGER, pos: 'center center', fit: 'cover' },
    swinger: { src: PAREJAS_SWINGER, pos: 'center center', fit: 'cover' }
  };

  function norm(id) {
    var key = String(id || '').toLowerCase().trim();
    if (global.CariHubCatalogos && CariHubCatalogos.normalizarCategoria) {
      key = CariHubCatalogos.normalizarCategoria(key);
    }
    return key;
  }

  function get(id) {
    return OFICIAL[norm(id)] || null;
  }

  function applyCatVisual(vis, id) {
    if (!vis) return vis;
    var img = get(id);
    if (!img) return vis;
    vis.photo = img.src;
    if (img.pos) vis.photoPos = img.pos;
    if (img.fit) vis.photoFit = img.fit;
    if (img.bg) vis.photoBg = img.bg;
    return vis;
  }

  global.CARIHUB_CATEGORIA_IMAGENES_OFICIALES = OFICIAL;
  global.CariHubCategoriaImagenes = {
    get: get,
    applyCatVisual: applyCatVisual,
    queenOfSpades: QUEEN_OF_SPADES,
    parejasSwinger: PAREJAS_SWINGER
  };
})(typeof window !== 'undefined' ? window : globalThis);
