/**
 * UI compartida — tarjetas de categorías y subcategorías (Home + registro-perfil).
 * Una sola fuente: mismas imágenes, HTML y clases en ambos flujos.
 */
(function (global) {
  'use strict';

  var ICON_GRID = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="2.2" fill="currentColor"/><circle cx="17" cy="7" r="2.2" fill="currentColor"/><circle cx="7" cy="17" r="2.2" fill="currentColor"/><circle cx="17" cy="17" r="2.2" fill="currentColor"/></svg>';
  var ICON_GO = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var SECTOR_DISPLAY_ORDER = [
    'adultos', 'bienestar', 'eventos', 'restaurantes', 'salud', 'profesionales',
    'tecnologia', 'bienes-raices', 'educacion', 'mascotas', 'industria',
    'automotriz', 'hogar', 'comercio', 'transporte'
  ];

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function sectorCardMeta(sectorId) {
    if (global.CariHubSectorCardImages && global.CariHubSectorCardImages.getSectorCardImage) {
      return global.CariHubSectorCardImages.getSectorCardImage(sectorId);
    }
    return null;
  }

  function sectorImageMeta(sectorId) {
    return sectorCardMeta(sectorId) || { src: 'img/home/promo-perfil.jpg' };
  }

  function sectorMobPath(pngPath) {
    var path = String(pngPath || '');
    if (path.indexOf('/sector-cards/') >= 0) return path;
    return path.replace('/sectores/', '/sectores/mob/').replace(/\.png$/i, '.jpg');
  }

  function buildSectorImageHtml(pngPathOrMeta, opts) {
    opts = opts || {};
    var meta = typeof pngPathOrMeta === 'object' && pngPathOrMeta !== null
      ? pngPathOrMeta
      : { src: pngPathOrMeta };
    var pngPath = meta.src;
    var mob = sectorMobPath(pngPath);
    var png = esc(pngPath);
    var mobEsc = esc(mob);
    var extra = opts.id ? ' id="' + esc(opts.id) + '"' : '';
    var priority = opts.priority ? ' fetchpriority="high"' : '';
    return (
      '<img class="rp-sector-card__img"' + extra +
      ' src="' + mobEsc + '" data-fallback="' + png + '" alt="" loading="lazy" decoding="async"' + priority +
      ' onerror="if(this.dataset.fallback){this.src=this.dataset.fallback;this.removeAttribute(\'data-fallback\')}">'
    );
  }

  function buildSectorWatermarkHtml(sectorId) {
    if (global.CariHubSectorCategoryWatermarks && global.CariHubSectorCategoryWatermarks.buildHtml) {
      return global.CariHubSectorCategoryWatermarks.buildHtml(sectorId);
    }
    return '';
  }

  function sortSectors(sectors, opts) {
    opts = opts || {};
    var order = opts.order || SECTOR_DISPLAY_ORDER;
    var orderMap = {};
    order.forEach(function (id, idx) { orderMap[id] = idx; });
    var list = sectors.slice();
    if (opts.excludeAdultos) {
      list = list.filter(function (s) { return s.id !== 'adultos'; });
    }
    return list.sort(function (a, b) {
      var ia = orderMap[a.id];
      var ib = orderMap[b.id];
      if (ia == null && ib == null) return 0;
      if (ia == null) return 1;
      if (ib == null) return -1;
      return ia - ib;
    });
  }

  function subcatCount(sectorId) {
    if (!global.CariHubSectores || !global.CariHubSectores.subcategoriasDeSector) return 0;
    return (global.CariHubSectores.subcategoriasDeSector(sectorId) || []).length;
  }

  function buildSectorCardElement(sector, opts) {
    opts = opts || {};
    var imgMeta = sectorImageMeta(sector.id);
    var metaText = subcatCount(sector.id) + ' subcategorías';
    var titleHtml = opts.titleHtml != null ? opts.titleHtml : esc(sector.nombre);
    var selected = opts.selectedSectorId && String(opts.selectedSectorId) === String(sector.id);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ch-geo-card rp-sector-card rp-sector-card--portrait' + (selected ? ' is-selected' : '');
    btn.setAttribute('data-sector-id', sector.id);
    var thumbStyle = imgMeta.bg ? ' style="background:' + esc(imgMeta.bg) + '"' : '';
    btn.innerHTML =
      '<span class="ch-geo-card__thumb ch-geo-card__thumb--portrait"' + thumbStyle + '>' +
        buildSectorImageHtml(imgMeta) +
      '</span>' +
      '<span class="ch-geo-card__body">' +
        buildSectorWatermarkHtml(sector.id) +
        '<span class="ch-geo-card__text">' +
          '<p class="ch-geo-card__title">' + titleHtml + '</p>' +
          '<p class="ch-geo-card__meta">' + ICON_GRID + esc(metaText) + '</p>' +
        '</span>' +
        '<span class="ch-geo-card__go" aria-hidden="true">' + ICON_GO + '</span>' +
      '</span>';
    if (typeof opts.onClick === 'function') {
      btn.addEventListener('click', function () {
        opts.onClick(sector, btn);
      });
    }
    return btn;
  }

  function renderSectorGrid(container, sectors, opts) {
    opts = opts || {};
    if (!container || !sectors || !sectors.length) return;
    var sorted = sortSectors(sectors, {
      excludeAdultos: !!opts.excludeAdultos,
      order: opts.order
    });
    container.innerHTML = '';
    sorted.forEach(function (sector) {
      var li = document.createElement('li');
      li.appendChild(buildSectorCardElement(sector, {
        selectedSectorId: opts.selectedSectorId,
        titleHtml: opts.titleHtml ? opts.titleHtml(sector) : null,
        onClick: opts.onSectorClick
      }));
      container.appendChild(li);
    });
    if (typeof opts.onRendered === 'function') {
      opts.onRendered(sorted);
    }
  }

  function renderSubcatList(container, items, opts) {
    opts = opts || {};
    if (!container || !items || !items.length || !global.CariHubSectorSubcatPicker) return;
    global.CariHubSectorSubcatPicker.renderList(container, items, {
      sectorId: opts.sectorId,
      selectedId: opts.selectedId || '',
      onSelect: opts.onSelect
    });
    if (opts.extraListClass) {
      container.classList.add(opts.extraListClass);
    }
  }

  global.CariHubSectorCatalogUI = {
    SECTOR_DISPLAY_ORDER: SECTOR_DISPLAY_ORDER,
    ICON_GRID: ICON_GRID,
    ICON_GO: ICON_GO,
    sectorImageMeta: sectorImageMeta,
    buildSectorImageHtml: buildSectorImageHtml,
    sortSectors: sortSectors,
    buildSectorCardElement: buildSectorCardElement,
    renderSectorGrid: renderSectorGrid,
    renderSubcatList: renderSubcatList
  };
})(typeof window !== 'undefined' ? window : globalThis);
