/**
 * Banners generales (pink/black) + apoyo comunidad LGBT — pool compartido entre pantallas.
 */
(function (global) {
  'use strict';

  var BASE = 'img/home/banners/';

  var LGBT_GENERAL_BANNERS = [
    BASE + 'ad-banner-lgbt-pride-01.png',
    BASE + 'ad-banner-lgbt-pride-02.png'
  ];

  var LGBT_ALT = 'Anúnciate aquí — apoyo a la comunidad LGBT';

  var ALL_GENERAL_POOL = [
    BASE + 'ad-banner-pink-01.png',
    BASE + 'ad-banner-pink-02.png',
    BASE + 'ad-banner-pink-03.png',
    BASE + 'ad-banner-black-01.png',
    BASE + 'ad-banner-black-02.png',
    BASE + 'ad-banner-black-03.png'
  ].concat(LGBT_GENERAL_BANNERS);

  function isGeneralBannerPath(src) {
    return /\/ad-banner-(pink|black|lgbt)-/.test(String(src || ''));
  }

  function slideObjectsHaveGeneral(slides) {
    return (slides || []).some(function (s) {
      return isGeneralBannerPath(s.src || s);
    });
  }

  /** Intercala banners LGBT tras cada slide existente (hasta agotar pool LGBT). */
  function mixGeneralSlidePaths(paths) {
    if (!paths || !paths.length) return LGBT_GENERAL_BANNERS.slice();
    var lgbt = LGBT_GENERAL_BANNERS;
    if (!lgbt.length) return paths.slice();
    var out = [];
    for (var i = 0; i < paths.length; i++) {
      out.push(paths[i]);
      if (i < lgbt.length) out.push(lgbt[i]);
    }
    return out;
  }

  function mixSlideObjects(slides) {
    if (!slides || !slides.length || !slideObjectsHaveGeneral(slides)) return (slides || []).slice();
    var out = [];
    for (var i = 0; i < slides.length; i++) {
      out.push(slides[i]);
      if (i < LGBT_GENERAL_BANNERS.length) {
        out.push({ t: 'img', src: LGBT_GENERAL_BANNERS[i], alt: LGBT_ALT });
      }
    }
    return out;
  }

  function pickGeneralBanner() {
    return ALL_GENERAL_POOL[Math.floor(Math.random() * ALL_GENERAL_POOL.length)];
  }

  function mixedSlideCount(baseCount) {
    return mixGeneralSlidePaths(new Array(Math.max(0, baseCount)).fill('')).length || baseCount;
  }

  global.CariHubBannerGeneral = {
    BASE: BASE,
    LGBT_GENERAL_BANNERS: LGBT_GENERAL_BANNERS,
    LGBT_ALT: LGBT_ALT,
    ALL_GENERAL_POOL: ALL_GENERAL_POOL,
    isGeneralBannerPath: isGeneralBannerPath,
    mixGeneralSlidePaths: mixGeneralSlidePaths,
    mixSlideObjects: mixSlideObjects,
    pickGeneralBanner: pickGeneralBanner,
    mixedSlideCount: mixedSlideCount,
    /** Home: LGBT en índice distinto por slot para no repetir los 3 banners a la vez (rotación sincronizada). */
    HOME: {
      izquierda: [
        BASE + 'ad-banner-pink-01.png',
        BASE + 'ad-banner-black-01.png',
        BASE + 'ad-banner-pink-02.png',
        BASE + 'ad-banner-lgbt-pride-01.png',
        BASE + 'ad-banner-black-02.png'
      ],
      derecha: [
        BASE + 'ad-banner-black-02.png',
        BASE + 'ad-banner-lgbt-pride-02.png',
        BASE + 'ad-banner-pink-03.png',
        BASE + 'ad-banner-black-03.png',
        BASE + 'ad-banner-pink-01.png'
      ],
      inferior: [
        BASE + 'ad-banner-pink-01.png',
        BASE + 'ad-banner-black-01.png',
        BASE + 'ad-banner-pink-02.png',
        BASE + 'ad-banner-black-03.png',
        BASE + 'ad-banner-lgbt-pride-01.png'
      ],
      categorias: mixGeneralSlidePaths([
        BASE + 'ad-banner-pink-01.png',
        BASE + 'ad-banner-pink-02.png',
        BASE + 'ad-banner-pink-03.png'
      ])
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
