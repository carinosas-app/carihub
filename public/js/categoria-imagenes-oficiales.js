/**
 * Imágenes oficiales por subcategoría adulta — fuente única para Home y pickers con foto.
 * Las tarjetas «Explora categorías» y cualquier selector adulto con imagen usan este mapa.
 * Pack fotográfico 2026-07: cat-cards/*-pro.png
 */
(function (global) {
  'use strict';

  var BASE = 'img/home/cat-cards/';

  function pro(file) {
    return BASE + file;
  }

  var OFICIAL = {
    escort: { src: pro('carinosas-pro.png'), pos: 'center center' },
    'escort gay': { src: pro('escort-gay-pro.png'), pos: 'center center' },
    'escort vip': { src: pro('carinosas-vip-pro.png'), pos: 'center center' },
    edecan: { src: pro('edecan-pro.png'), pos: 'center center' },
    stripper: { src: pro('stripper-pro.png'), pos: 'center center' },
    modelos: { src: pro('modelos-pro.png'), pos: 'center center' },
    gigolo: { src: pro('gigolo-pro.png'), pos: 'center center' },
    acompanante: { src: pro('acompanante-pro.png'), pos: 'center center' },
    petit: { src: pro('petit-pro.png'), pos: 'center center' },
    contenido: { src: pro('contenido-pro.png'), pos: 'center center' },
    tabledance: { src: pro('tabledance-pro.png'), pos: 'center center' },
    'sex shop': { src: pro('sexshop-pro.png'), pos: 'center center' },
    spa: { src: pro('spa-pro.png'), pos: 'center center' },
    masajes: { src: pro('masajes-pro.png'), pos: 'center center' },
    'club sw': { src: pro('club-sw-pro.png'), pos: 'center center' },
    'antro restaurant bar': { src: pro('antros-pro.png'), pos: 'center center' },
    'antro restaurant bar lgbt': { src: pro('antro-lgbt-pro.png'), pos: 'center center', fit: 'cover' },
    'hotel motel': { src: pro('hotel-motel-pro.png'), pos: 'center center' },
    'cabinas glory holes': { src: pro('cabinas-pro.png'), pos: 'center center' },
    trans: { src: pro('trans-pro.png'), pos: 'center center' },
    femboy: { src: pro('femboy-pro.png'), pos: 'center center' },
    'parejas swinger': { src: pro('parejas-swinger-pro.png'), pos: 'center center' },
    swinger: { src: pro('swinger-pro.png'), pos: 'center center' },
    unicorns: { src: pro('unicorns-pro.png'), pos: 'center center' },
    'cuckold hotwife': { src: pro('hotwife-pro.png'), pos: 'center center' },
    cuckold: { src: pro('cuckold-pro.png'), pos: 'center center' },
    hotwife: { src: pro('hotwife-pro.png'), pos: 'center center' },
    singles: { src: pro('singles-pro.png'), pos: 'center center' },
    lesbians: { src: pro('lesbians-pro.png'), pos: 'center center' },
    'tom boy': { src: pro('tom-boy-pro.png'), pos: 'center center' },
    'tom fem': { src: pro('tom-fem-pro.png'), pos: 'center center' },
    dotados: { src: pro('dotados-pro.png'), pos: 'center center' },
    fetiche: { src: pro('fetiche-pro.png'), pos: 'center center' },
    sado: { src: pro('sado-pro.png'), pos: 'center center' },
    dominatrix: { src: pro('dominatrix-pro.png'), pos: 'center center' },
    'cine xxx': { src: pro('cine-xxx-pro.png'), pos: 'center center' }
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

  /** Lista de src pro únicos — para composición de rail (hasta 3). */
  function allProSrcs() {
    var seen = {};
    var out = [];
    Object.keys(OFICIAL).forEach(function (k) {
      var src = OFICIAL[k] && OFICIAL[k].src;
      if (!src || seen[src]) return;
      seen[src] = true;
      out.push(src);
    });
    return out;
  }

  global.CARIHUB_CATEGORIA_IMAGENES_OFICIALES = OFICIAL;
  global.CariHubCategoriaImagenes = {
    get: get,
    applyCatVisual: applyCatVisual,
    allProSrcs: allProSrcs,
    queenOfSpades: pro('hotwife-pro.png'),
    parejasSwinger: pro('parejas-swinger-pro.png')
  };
})(typeof window !== 'undefined' ? window : globalThis);
