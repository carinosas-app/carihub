(function () {
  'use strict';

  var IMG_BASE = 'assets/adultos-user/';

  /* Fotos y tarjetas de referencia del ZIP del usuario */
  var IMAGE_MAP = {
    escort: { src: 'img-01.jpg', pos: 'top center' },
    'escort-gay': { src: 'img-05.jpg', pos: 'center 20%' },
    'escort-vip': { src: 'img-02.jpg', pos: 'top center' },
    edecan: { src: 'img-15.jpg', pos: 'top center' },
    stripper: { src: 'img-22.jpg', pos: 'top center' },
    modelos: { src: 'img-15.jpg', pos: 'center 15%' },
    gigolo: { src: 'img-22.jpg', pos: 'top center' },
    acompanante: { src: 'img-18.jpg', pos: 'center 30%' },
    petit: { src: 'img-02.jpg', pos: 'top center' },
    contenido: { src: 'img-06.jpg', pos: 'center 35%' },
    tabledance: { src: 'img-06.jpg', pos: 'center 35%' },
    'sex-shop': { src: 'img-24.jpg', pos: 'top center' },
    spa: { src: 'img-11.jpg', pos: 'center 40%' },
    masajes: { src: 'img-11.jpg', pos: 'center 55%' },
    'club-sw': { src: 'img-30.jpg', pos: 'top center' },
    'antro-restaurant-bar': { src: 'img-28.jpg', pos: 'top center' },
    'antro-restaurant-bar-lgbt': { src: 'img-29.jpg', pos: 'top center' },
    'hotel-motel': { src: 'img-23.jpg', pos: 'top center' },
    'cabinas-glory-holes': { src: 'img-08.jpg', pos: 'center 45%' },
    trans: { src: 'img-27.jpg', pos: 'top center' },
    femboy: { src: 'img-18.jpg', pos: 'center 35%' },
    swinger: { src: 'img-26.jpg', pos: 'top center' },
    unicorns: { src: 'img-17.jpg', pos: 'top center' },
    'cuckold-hotwife': { src: 'img-31.jpg', pos: 'top center' },
    singles: { src: 'img-22.jpg', pos: 'top center' },
    hotwife: { src: 'img-31.jpg', pos: 'center 30%' },
    lesbians: { src: 'img-18.jpg', pos: 'center 25%' },
    'tom-boy': { src: 'img-19.jpg', pos: 'center 30%' },
    'tom-fem': { src: 'img-18.jpg', pos: 'top center' },
    dotados: { src: 'img-22.jpg', pos: 'top center' },
    fetiche: { src: 'img-08.jpg', pos: 'center 50%' },
    sado: { src: 'img-08.jpg', pos: 'center 60%' },
    dominatrix: { src: 'img-01.jpg', pos: 'center 35%' },
    'cine-xxx': { src: 'img-10.jpg', pos: 'center 30%' }
  };

  var CATS = [
    { id: 'escort', nombre: 'Escort' },
    { id: 'escort gay', nombre: 'Escort Gay' },
    { id: 'escort vip', nombre: 'Escort VIP' },
    { id: 'edecan', nombre: 'Edecán' },
    { id: 'stripper', nombre: 'Stripper' },
    { id: 'modelos', nombre: 'Modelos' },
    { id: 'gigolo', nombre: 'Gigoló' },
    { id: 'acompanante', nombre: 'Acompañante' },
    { id: 'petit', nombre: 'Petit' },
    { id: 'contenido', nombre: 'Contenido' },
    { id: 'tabledance', nombre: 'Tabledance' },
    { id: 'sex shop', nombre: 'Sex Shop' },
    { id: 'spa', nombre: 'Spa' },
    { id: 'masajes', nombre: 'Masajes' },
    { id: 'club sw', nombre: 'Club SW' },
    { id: 'antro restaurant bar', nombre: 'Antro / Restaurant Bar' },
    { id: 'antro restaurant bar lgbt', nombre: 'Antro / Restaurant Bar LGBT' },
    { id: 'hotel motel', nombre: 'Hotel / Motel' },
    { id: 'cabinas glory holes', nombre: 'Cabinas / Glory Holes' },
    { id: 'trans', nombre: 'Trans' },
    { id: 'femboy', nombre: 'Femboy' },
    { id: 'swinger', nombre: 'Swinger' },
    { id: 'unicorns', nombre: 'Unicorns' },
    { id: 'cuckold hotwife', nombre: 'Cuckold / Hotwife' },
    { id: 'singles', nombre: 'Singles' },
    { id: 'hotwife', nombre: 'Hotwife' },
    { id: 'lesbians', nombre: 'Lesbians' },
    { id: 'tom boy', nombre: 'Tom Boy' },
    { id: 'tom fem', nombre: 'Tom Fem' },
    { id: 'dotados', nombre: 'Dotados' },
    { id: 'fetiche', nombre: 'Fetiche' },
    { id: 'sado', nombre: 'Sado' },
    { id: 'dominatrix', nombre: 'Dominatrix' },
    { id: 'cine xxx', nombre: 'Cine XXX' }
  ];

  function toKey(id) {
    return String(id || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/\//g, '');
  }

  function scenePhoto(catId, nombre) {
    var key = toKey(catId);
    var meta = IMAGE_MAP[key];
    if (!meta) return '<div class="ap-scene ap-scene--fallback" aria-hidden="true"></div>';
    var pos = meta.pos || 'center';
    return (
      '<div class="ap-scene ap-scene--photo" aria-hidden="true">' +
        '<img class="ap-card__photo" src="' + IMG_BASE + meta.src + '" alt="" ' +
        'loading="lazy" decoding="async" style="object-position:' + pos + '">' +
        '<span class="ap-scene__sheen" aria-hidden="true"></span>' +
      '</div>'
    );
  }

  function renderGrid(container) {
    if (!container) return;
    container.innerHTML = CATS.map(function (cat) {
      return (
        '<article class="ap-card" data-cat="' + toKey(cat.id) + '">' +
          '<div class="ap-card__visual">' + scenePhoto(cat.id, cat.nombre) + '</div>' +
          '<span class="ap-card__name">' +
            '<span class="ap-card__name-sparks" aria-hidden="true">' +
              '<span class="ap-name-spark ap-name-spark--1"></span>' +
              '<span class="ap-name-spark ap-name-spark--2"></span>' +
              '<span class="ap-name-spark ap-name-spark--3"></span>' +
              '<span class="ap-name-spark ap-name-spark--4"></span>' +
              '<span class="ap-name-spark ap-name-spark--5"></span>' +
            '</span>' +
            '<span class="ap-card__name-text">' + cat.nombre + '</span>' +
          '</span>' +
        '</article>'
      );
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderGrid(document.getElementById('apGrid'));
  });

  window.AdultosMicroEscenas = {
    renderGrid: renderGrid,
    categories: CATS,
    imageMap: IMAGE_MAP
  };
})();
