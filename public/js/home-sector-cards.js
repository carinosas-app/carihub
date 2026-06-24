/**
 * Tarjetas de sector con imagen completa (reemplaza scroll «Encuentra… cerca de ti»).
 */
(function (global) {
  'use strict';

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function cfgFor(sector) {
    var imgs = global.CariHubSectorCardImages;
    if (!imgs || !imgs.getSectorCardImage) return null;
    return imgs.getSectorCardImage(sector && sector.id);
  }

  function build(sector) {
    var cfg = cfgFor(sector);
    var root = document.createElement('div');
    root.className = 'home-sector-card-visual';
    root.setAttribute('aria-hidden', 'true');

    if (cfg && cfg.type === 'template' && global.CariHubSectorCardTemplates) {
      var composed = global.CariHubSectorCardTemplates.build(cfg.template, sector);
      if (composed) {
        root.classList.add('home-sector-card-visual--composed');
        root.appendChild(composed);
        return root;
      }
    }

    if (cfg && cfg.src) {
      if (cfg.bg) root.style.background = cfg.bg;
      if (cfg.fit === 'contain') root.classList.add('home-sector-card-visual--contain');
      var img = document.createElement('img');
      img.className = 'home-sector-card-visual__img';
      img.src = cfg.src;
      img.alt = cfg.alt || (sector && sector.nombre) || 'Sector';
      img.decoding = 'async';
      img.loading = 'lazy';
      if (cfg.fit) img.style.objectFit = cfg.fit;
      if (cfg.pos) img.style.objectPosition = cfg.pos;
      root.appendChild(img);
      return root;
    }

    root.classList.add('home-sector-card-visual--fallback');
    var name = document.createElement('span');
    name.className = 'home-sector-card-visual__fallback-name';
    name.textContent = (sector && sector.nombre) || 'Sector';
    root.appendChild(name);
    if (sector && sector.emoji) {
      var em = document.createElement('span');
      em.className = 'home-sector-card-visual__fallback-emoji';
      em.textContent = sector.emoji;
      em.setAttribute('aria-hidden', 'true');
      root.insertBefore(em, name);
    }
    return root;
  }

  global.CariHubSectorCards = {
    cfgFor: cfgFor,
    build: build,
    mount: function (layer, sector) {
      if (!layer) return false;
      layer.innerHTML = '';
      layer.dataset.sectorId = sector && sector.id ? sector.id : '';
      layer.appendChild(build(sector));
      return true;
    },
    usesImageCards: function () {
      return !!(global.CariHubSectorCardImages && global.CariHubSectorCardImages.SECTOR_CARD_IMAGES);
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
