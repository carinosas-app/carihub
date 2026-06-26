/**
 * Imágenes oficiales por subcategoría adulta — fuente única para Home y pickers con foto.
 * Las tarjetas «Explora categorías» y cualquier selector adulto con imagen usan este mapa.
 */
(function (global) {
  'use strict';

  var OFICIAL = {
    escort: { src: 'img/home/cat-cards/escort.png', pos: 'center center' },
    'escort gay': { src: 'img/home/hero-escort-gay.png', pos: 'center center' },
    'escort vip': { src: 'img/home/hero-carinosa-motel-spa-runway.png', pos: 'center center' },
    edecan: { src: 'img/home/hero-carinosa-motel-spa-runway.png', pos: 'center center' },
    stripper: { src: 'img/home/cat-cards/stripper.png', pos: 'center center' },
    modelos: { src: 'img/home/cat-cards/modelos.png', pos: 'center center' },
    gigolo: { src: 'img/home/cat-cards/stripper.png', pos: 'center center' },
    acompanante: { src: 'img/home/motel-spa-model.jpg', pos: 'center center' },
    petit: { src: 'img/home/cat-cards/petit.png', pos: 'center center' },
    contenido: { src: 'img/home/cat-cards/creadora-contenido.png', pos: 'center center' },
    tabledance: { src: 'img/home/cat-cards/tabledance.png', pos: 'center center' },
    'sex shop': { src: 'img/home/sexshop.jpg', pos: 'center center' },
    spa: { src: 'img/home/cat-cards/spa.png', pos: 'center center' },
    masajes: { src: 'img/home/cat-cards/spa.png', pos: 'center center' },
    'club sw': { src: 'img/home/lounge-swinger.jpg', pos: 'center center' },
    'antro restaurant bar': { src: 'img/home/cat-cards/antros.png', pos: 'center center' },
    'antro restaurant bar lgbt': { src: 'img/home/cat-cards/antro-lgbt.png', pos: 'center center', fit: 'cover' },
    'hotel motel': { src: 'img/home/motel-noche.jpg', pos: 'center center' },
    'cabinas glory holes': { src: 'img/home/cat-cards/cabinas-glory-holes.png', pos: 'center center' },
    trans: { src: 'img/home/cat-cards/trans.png', pos: 'center center' },
    femboy: { src: 'img/home/cat-cards/femboy.png', pos: 'center center' },
    'parejas swinger': { src: 'img/home/cat-cards/parejas-swinger.png', pos: 'center center', fit: 'contain', bg: '#121018' },
    swinger: { src: 'img/home/cat-cards/parejas-swinger.png', pos: 'center center', fit: 'contain', bg: '#121018' },
    unicorns: { src: 'img/home/lounge-swinger.jpg', pos: 'center center' },
    'cuckold hotwife': { src: 'img/home/cat-cards/queen-of-spades.png', pos: 'center center', fit: 'contain', bg: '#ffffff' },
    cuckold: { src: 'img/home/cat-cards/queen-of-spades.png', pos: 'center center', fit: 'contain', bg: '#ffffff' },
    singles: { src: 'img/home/nightclub.jpg', pos: 'center center' },
    lesbians: { src: 'img/home/cat-cards/lesbians.png', pos: 'center center' },
    'tom boy': { src: 'img/home/escort-gay.jpg', pos: 'center center' },
    'tom fem': { src: 'img/home/cat-cards/tom-fem.png', pos: 'center center' },
    dotados: { src: 'img/home/cat-cards/stripper.png', pos: 'center center' },
    fetiche: { src: 'img/home/cat-cards/dominatrix.png', pos: 'center center', fit: 'contain', bg: '#ffffff' },
    sado: { src: 'img/home/cat-cards/dominatrix.png', pos: 'center center', fit: 'contain', bg: '#ffffff' },
    dominatrix: { src: 'img/home/cat-cards/dominatrix.png', pos: 'center center', fit: 'contain', bg: '#ffffff' },
    'cine xxx': { src: 'img/home/cat-cards/cine-xxx.png', pos: 'center center' }
  };

  function norm(id) {
    var key = String(id || '').toLowerCase().trim();
    if (global.CariHubCatalogos && CariHubCatalogos.normalizarCategoria) {
      key = CariHubCatalogos.normalizarCategoria(key);
    }
    return key;
  }

  function get(id) {
    var key = norm(id);
    if (OFICIAL[key]) return OFICIAL[key];
    var hyphen = key.replace(/\s+/g, '-');
    if (OFICIAL[hyphen]) return OFICIAL[hyphen];
    return null;
  }

  function applyCatVisual(vis, id) {
    if (!vis) return vis;
    var img = get(id);
    if (!img) return vis;
    vis.photo = img.src;
    if (img.pos) vis.photoPos = img.pos;
    if (img.fit) vis.photoFit = img.fit;
    if (img.bg) vis.photoBg = img.bg;
    if (img.scale) vis.photoScale = img.scale;
    return vis;
  }

  global.CARIHUB_CATEGORIA_IMAGENES_OFICIALES = OFICIAL;
  global.CariHubCategoriaImagenes = {
    get: get,
    applyCatVisual: applyCatVisual,
    queenOfSpades: 'img/home/cat-cards/queen-of-spades.png',
    parejasSwinger: 'img/home/cat-cards/parejas-swinger.png'
  };
})(typeof window !== 'undefined' ? window : globalThis);
