(function () {
  'use strict';

  /*
   * Catálogo canónico home — 34 categorías (orden del dictado).
   * Escort · Escort Gay · Escort VIP · Edecán · Stripper · Modelos · Gigoló ·
   * Acompañante · Petit · Contenido · Tabledance · Sex Shop · Spa · Masajes ·
   * Club SW · Antro / Restaurant Bar · Antro / Restaurant Bar LGBT ·
   * Hotel / Motel · Cabinas / Glory Holes · Trans · Femboy · Swinger ·
   * Unicorns · Cuckold / Hotwife · Singles · Hotwife · Lesbians ·
   * Tom Boy · Tom Fem · Dotados · Fetiche · Sado · Dominatrix · Cine XXX
   */
  var CATEGORIAS = [
    { id: 'escort', nombre: 'Escort', emoji: '💃' },
    { id: 'escort gay', nombre: 'Escort Gay', emoji: '🏳️‍🌈' },
    { id: 'escort vip', nombre: 'Escort VIP', emoji: '👑' },
    { id: 'edecan', nombre: 'Edecán', emoji: '✨' },
    { id: 'stripper', nombre: 'Stripper', emoji: '🔥' },
    { id: 'modelos', nombre: 'Modelos', emoji: '📸' },
    { id: 'gigolo', nombre: 'Gigoló', emoji: '🤵' },
    { id: 'acompanante', nombre: 'Acompañante', emoji: '🌹' },
    { id: 'petit', nombre: 'Petit', emoji: '🎀' },
    { id: 'contenido', nombre: 'Contenido', emoji: '🎬' },
    { id: 'tabledance', nombre: 'Tabledance', emoji: '🍸' },
    { id: 'sex shop', nombre: 'Sex Shop', emoji: '🛍️' },
    { id: 'spa', nombre: 'Spa', emoji: '🧖' },
    { id: 'masajes', nombre: 'Masajes', emoji: '💆' },
    { id: 'club sw', nombre: 'Club SW', emoji: '🍍' },
    { id: 'antro restaurant bar', nombre: 'Antro / Restaurant Bar', nombreCorto: 'Antro / Bar', emoji: '🍾' },
    { id: 'antro restaurant bar lgbt', nombre: 'Antro / Restaurant Bar LGBT', nombreCorto: 'Antro LGBT', emoji: '🌈' },
    { id: 'hotel motel', nombre: 'Hotel / Motel', nombreCorto: 'Hotel', emoji: '🏩' },
    { id: 'cabinas glory holes', nombre: 'Cabinas / Glory Holes', nombreCorto: 'Cabinas', emoji: '🚪' },
    { id: 'trans', nombre: 'Trans', emoji: '⚧️' },
    { id: 'femboy', nombre: 'Femboy', emoji: '🌸' },
    { id: 'swinger', nombre: 'Swinger', emoji: '🍍' },
    { id: 'unicorns', nombre: 'Unicorns', emoji: '🦄' },
    { id: 'cuckold hotwife', nombre: 'Cuckold / Hotwife', nombreCorto: 'Cuckold', emoji: '🔥' },
    { id: 'singles', nombre: 'Singles', emoji: '💫' },
    { id: 'hotwife', nombre: 'Hotwife', emoji: '🔥' },
    { id: 'lesbians', nombre: 'Lesbians', emoji: '👩‍❤️‍👩' },
    { id: 'tom boy', nombre: 'Tom Boy', emoji: '🧢' },
    { id: 'tom fem', nombre: 'Tom Fem', emoji: '💄' },
    { id: 'dotados', nombre: 'Dotados', emoji: '🍆' },
    { id: 'fetiche', nombre: 'Fetiche', emoji: '🖤' },
    { id: 'sado', nombre: 'Sado', emoji: '⛓️' },
    { id: 'dominatrix', nombre: 'Dominatrix', emoji: '🖤' },
    { id: 'cine xxx', nombre: 'Cine XXX', emoji: '🎥' }
  ];

  window.CARIHUB_CATEGORIAS_HOME = CATEGORIAS;
  window.CARIHUB_CATEGORIAS_COUNT = CATEGORIAS.length;
})();
