/**
 * Pantalla fullscreen subcategorías — Home «Explora otras categorías».
 * Hero = imagen del sector; grid HTML con tarjeta (imagen + nombre) por subcategoría.
 */
(function (global) {
  'use strict';

  var DEFAULT_HERO_FRACTION = 0.44;

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function $(id) {
    return document.getElementById(id);
  }

  function sectorVisual(sectorId) {
    if (global.CariHubSectorCardImages && global.CariHubSectorCardImages.getSectorCardImage) {
      return global.CariHubSectorCardImages.getSectorCardImage(sectorId);
    }
    return null;
  }

  function heroFraction(cfg) {
    if (cfg && cfg.heroFraction != null) return cfg.heroFraction;
    return DEFAULT_HERO_FRACTION;
  }

  function imageForSubcat(sectorId, catId, index) {
    if (global.CariHubSectorSubcatPicker && global.CariHubSectorSubcatPicker.imageForSubcat) {
      return global.CariHubSectorSubcatPicker.imageForSubcat(sectorId, catId, index);
    }
    return '';
  }

  function tileTone(src, sectorId, catId, index) {
    if (global.CariHubHomeSectorSubcatTones && global.CariHubHomeSectorSubcatTones.toneForImage) {
      return global.CariHubHomeSectorSubcatTones.toneForImage(src, sectorId, catId, index);
    }
    return '#f5f5f5';
  }

  function sectorThemeBg(sectorId, cfg) {
    if (global.CariHubHomeSectorSubcatTones && global.CariHubHomeSectorSubcatTones.sectorThemeBg) {
      return global.CariHubHomeSectorSubcatTones.sectorThemeBg(sectorId, (cfg && cfg.bg) || '#eef2f6');
    }
    return (cfg && cfg.bg) || '#eef2f6';
  }

  function hideSiblingPickers() {
    var classic = $('catPickerClassic');
    var adultos = $('catPickerAdultos');
    if (classic) classic.hidden = true;
    if (adultos) adultos.hidden = true;
  }

  function applyHero(sector) {
    var hero = $('homeSectorSubcatHero');
    var visual = $('homeSectorSubcatHeroVisual');
    var img = $('homeSectorSubcatHeroImg');
    var screen = $('homeSectorSubcatScreen');
    var modal = $('modal-categorias');
    if (!hero || !visual || !img || !sector) return '#eef2f6';

    var cfg = sectorVisual(sector.id) || {};
    var src = cfg.src || '';
    var frac = heroFraction(cfg);
    var bg = sectorThemeBg(sector.id, cfg);
    var fit = cfg.fit || 'contain';
    var pos = cfg.pos || 'center top';

    hero.style.setProperty('--sector-hero-bg', bg);
    visual.style.setProperty('--sector-hero-bg', bg);
    visual.style.setProperty('--hero-fit', fit);
    visual.style.setProperty('--hero-pos', pos);
    visual.style.setProperty('--hero-aspect', '682 / ' + Math.round(1024 * frac));

    if (screen) {
      screen.style.setProperty('--sector-hero-bg', bg);
      screen.style.setProperty('--sector-body-fade', bg);
      screen.style.setProperty('--sector-body-bg', bg);
    }
    if (modal) {
      modal.style.setProperty('--sector-theme-bg', bg);
    }

    if (src) {
      img.src = src;
      img.alt = cfg.alt || sector.nombre || '';
      img.hidden = false;
      img.style.objectFit = fit;
      img.style.objectPosition = pos;
    } else {
      img.removeAttribute('src');
      img.alt = '';
      img.hidden = true;
    }
    return bg;
  }

  function tileHtml(cat, sectorId, index, selectedId) {
    var selected = String(cat.id) === String(selectedId);
    var src = imageForSubcat(sectorId, cat.id, index);
    if (src && (/\/sector-cards\//.test(src) || /\/sectores\//.test(src))) {
      src = '';
    }
    var tone = tileTone(src || (sectorId + ':' + cat.id), sectorId, cat.id, index);
    var imgBlock;
    if (src) {
      imgBlock = '<img class="home-sector-subcat-card__img" src="' + esc(src) + '" alt="" loading="lazy" decoding="async">';
    } else if (global.CariHubHomeSectorSubcatIcons && global.CariHubHomeSectorSubcatIcons.iconHtml) {
      imgBlock = global.CariHubHomeSectorSubcatIcons.iconHtml(sectorId, cat.id, cat.nombre, index);
    } else {
      imgBlock = '<span class="home-sector-subcat-card__img home-sector-subcat-card__img--empty" aria-hidden="true"></span>';
    }

    return (
      '<li role="presentation">' +
        '<button type="button" class="home-sector-subcat-card' + (selected ? ' is-selected' : '') + '" ' +
          'style="--tile-bg:' + esc(tone) + ';" ' +
          'role="option" data-cat-id="' + esc(cat.id) + '" aria-selected="' + (selected ? 'true' : 'false') + '">' +
          '<span class="home-sector-subcat-card__visual">' + imgBlock + '</span>' +
          '<span class="home-sector-subcat-card__label">' + esc(cat.nombre) + '</span>' +
        '</button>' +
      '</li>'
    );
  }

  function renderGrid(listEl, items, sectorId, selectedId, onSelect) {
    if (!listEl) return;
    listEl.innerHTML = items.map(function (cat, index) {
      return tileHtml(cat, sectorId, index, selectedId);
    }).join('');

    listEl.querySelectorAll('.home-sector-subcat-card').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var catId = btn.getAttribute('data-cat-id');
        var cat = items.find(function (c) { return c.id === catId; });
        if (cat && typeof onSelect === 'function') onSelect(cat);
      });
    });
  }

  function render(sector, items, opts) {
    opts = opts || {};
    var screen = $('homeSectorSubcatScreen');
    var grid = $('homeSectorSubcatGrid');
    var hint = $('homeSectorSubcatHint');
    var modal = $('modal-categorias');

    if (!screen || !sector) return false;

    hideSiblingPickers();
    screen.hidden = false;

    if (modal) {
      modal.classList.remove('home-modal--adultos-premium');
      modal.classList.add('home-modal--sector-subcat-premium');
      if (sector.id) modal.setAttribute('data-sector', sector.id);
    }
    if (sector.id) screen.setAttribute('data-sector', sector.id);

    applyHero(sector);

    if (global.CariHubHomeCatPromoRail) {
      var promoRail = screen.querySelector('.home-cat-promo-rail');
      if (promoRail) {
        global.CariHubHomeCatPromoRail.mountRail(promoRail, {
          sectorId: sector.id,
          sectorName: sector.nombre
        });
      }
    }

    if (hint) {
      var n = (items && items.length) || 0;
      hint.textContent = n + ' subcategorías · elige una para continuar';
    }

    renderGrid(grid, items || [], sector.id, opts.selectedId || '', opts.onSelect);
    return true;
  }

  function hide() {
    var screen = $('homeSectorSubcatScreen');
    var classic = $('catPickerClassic');
    var modal = $('modal-categorias');
    if (screen) screen.hidden = true;
    if (classic) classic.hidden = false;
    if (modal) {
      modal.classList.remove('home-modal--sector-subcat-premium');
      modal.removeAttribute('data-sector');
      modal.style.removeProperty('--sector-theme-bg');
    }
  }

  function syncSelection(selectedId) {
    document.querySelectorAll('.home-sector-subcat-card').forEach(function (btn) {
      var on = btn.getAttribute('data-cat-id') === selectedId;
      btn.classList.toggle('is-selected', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
      if (on) btn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }

  global.CariHubHomeSectorSubcatScreen = {
    render: render,
    hide: hide,
    syncSelection: syncSelection,
    applyHero: applyHero
  };
})(typeof window !== 'undefined' ? window : globalThis);
