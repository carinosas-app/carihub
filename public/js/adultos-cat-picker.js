(function () {
  'use strict';

  function toKey(id) {
    return String(id || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/\//g, '');
  }

  function catImageMeta(catId) {
    if (window.CariHubCategoriaImagenes && CariHubCategoriaImagenes.get) {
      return CariHubCategoriaImagenes.get(catId);
    }
    return null;
  }

  function scenePhoto(catId) {
    var meta = catImageMeta(catId);
    if (!meta || !meta.src) {
      return '<div class="ap-scene ap-scene--fallback" aria-hidden="true"></div>';
    }
    var pos = meta.pos || 'center';
    var fit = meta.fit || 'cover';
    var bgStyle = meta.bg ? 'background-color:' + meta.bg + ';' : '';
    return (
      '<div class="ap-scene ap-scene--photo" aria-hidden="true"' +
        (bgStyle ? ' style="' + bgStyle + '"' : '') + '>' +
        '<img class="ap-card__photo" src="' + meta.src + '" alt="" ' +
        'loading="lazy" decoding="async" style="object-position:' + pos + ';object-fit:' + fit + '">' +
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

  function watermarkForCat(catId) {
    var meta = catImageMeta(catId);
    if (!meta || !meta.src) return '';
    if (window.CariHubSectorCategoryWatermarks && CariHubSectorCategoryWatermarks.buildFromSrc) {
      return CariHubSectorCategoryWatermarks.buildFromSrc(meta.src, {
        pos: meta.pos || 'center center',
        opacity: 0.18,
        subcat: true
      });
    }
    return '';
  }

  function cardHtml(cat, selectedId, opts, index) {
    var selected = toKey(cat.id) === toKey(selectedId);
    return (
      '<li role="presentation">' +
        '<button type="button" class="ap-card' + (selected ? ' is-selected' : '') + '" ' +
          'role="option" data-cat-id="' + cat.id + '" aria-selected="' + (selected ? 'true' : 'false') + '">' +
          '<span class="ap-card__visual">' + cardVisual(cat, opts, index) + '</span>' +
          '<span class="ap-card__name">' +
            watermarkForCat(cat.id) +
            sparksHtml() +
            '<span class="ap-card__name-text">' + cat.nombre + '</span>' +
          '</span>' +
        '</button>' +
      '</li>'
    );
  }

  function renderList(container, items, opts) {
    if (!container) return;
    opts = opts || {};
    container.innerHTML = (items || []).map(function (cat, i) {
      return cardHtml(cat, opts.selectedId, opts, i);
    }).join('');
    container.querySelectorAll('.ap-card').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-cat-id');
        var cat = (items || []).find(function (c) { return c.id === id; });
        if (cat && typeof opts.onSelect === 'function') opts.onSelect(cat);
      });
    });
  }

  window.CariHubAdultosCatPicker = {
    renderList: renderList,
    scenePhoto: scenePhoto,
    cardVisual: cardVisual
  };
})();
