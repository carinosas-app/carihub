(function () {
  'use strict';

  var IMG_BASE = 'img/adultos-cat/';

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

  function toKey(id) {
    return String(id || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/\//g, '');
  }

  function scenePhoto(catId) {
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

  var SECTOR_POS = ['top center', 'center 22%', 'center 55%', 'top 18%', 'center 40%', 'center 68%'];

  function sectorScenePhoto(sectorImage, index) {
    if (!sectorImage) {
      return '<div class="ap-scene ap-scene--fallback ap-scene--sector" aria-hidden="true"></div>';
    }
    var pos = SECTOR_POS[(index || 0) % SECTOR_POS.length];
    return (
      '<div class="ap-scene ap-scene--photo ap-scene--sector" aria-hidden="true">' +
        '<img class="ap-card__photo" src="' + sectorImage + '" alt="" ' +
        'loading="lazy" decoding="async" style="object-position:' + pos + '">' +
        '<span class="ap-scene__sheen" aria-hidden="true"></span>' +
      '</div>'
    );
  }

  function cardVisual(cat, opts, index) {
    opts = opts || {};
    if (!opts.sectorId || opts.sectorId === 'adultos') {
      return scenePhoto(cat.id);
    }
    return sectorScenePhoto(opts.sectorImage, index);
  }

  function sparksHtml() {
    return (
      '<span class="ap-card__name-sparks" aria-hidden="true">' +
        '<span class="ap-name-spark ap-name-spark--1"></span>' +
        '<span class="ap-name-spark ap-name-spark--2"></span>' +
        '<span class="ap-name-spark ap-name-spark--3"></span>' +
        '<span class="ap-name-spark ap-name-spark--4"></span>' +
        '<span class="ap-name-spark ap-name-spark--5"></span>' +
      '</span>'
    );
  }

  function cardHtml(cat, selectedId, opts, index) {
    var selected = toKey(cat.id) === toKey(selectedId);
    return (
      '<li role="presentation">' +
        '<button type="button" class="ap-card' + (selected ? ' is-selected' : '') + '" ' +
          'role="option" data-cat-id="' + cat.id + '" aria-selected="' + (selected ? 'true' : 'false') + '">' +
          '<span class="ap-card__visual">' + cardVisual(cat, opts, index) + '</span>' +
          '<span class="ap-card__name">' +
            sparksHtml() +
            '<span class="ap-card__name-text">' + cat.nombre + '</span>' +
          '</span>' +
        '</button>' +
      '</li>'
    );
  }

  function renderList(container, items, opts) {
    opts = opts || {};
    if (!container || !items) return;
    container.innerHTML = items.map(function (cat, index) {
      return cardHtml(cat, opts.selectedId, opts, index);
    }).join('');

    container.querySelectorAll('.ap-card').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var catId = btn.getAttribute('data-cat-id');
        var cat = items.find(function (c) { return c.id === catId; });
        if (cat && typeof opts.onSelect === 'function') opts.onSelect(cat);
      });
    });
  }

  window.CariHubAdultosCatPicker = {
    renderList: renderList,
    imageMap: IMAGE_MAP
  };
})();
