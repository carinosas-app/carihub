(function () {
  'use strict';

  var DATA = window.CARIHUB_SECTOR_SCROLL_ITEMS || {};
  var timers = new WeakMap();

  function itemsFor(sector) {
    return DATA[sector.id] || [];
  }

  function durationMs(count) {
    var scroll = Math.max(3600, count * 480);
    return 300 + scroll + 600;
  }

  function clearLayerTimer(layer) {
    var t = timers.get(layer);
    if (t) {
      clearTimeout(t.scroll);
      timers.delete(layer);
    }
  }

  function startScroll(track, viewport) {
    if (!viewport) return;

    track.classList.remove('is-scrolling');
    track.style.removeProperty('--scroll-dist');
    track.style.removeProperty('--scroll-dur');

    var spacer = track.querySelector('.home-sector-scroll__spacer');
    if (spacer) {
      spacer.style.height = Math.max(12, Math.round(viewport.clientHeight * 0.55)) + 'px';
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var vh = viewport.clientHeight;
        var th = track.scrollHeight;
        var dist = Math.max(0, th - vh);
        var count = track.querySelectorAll('.home-sector-scroll__item').length;
        var dur = Math.max(3.6, count * 0.48);
        track.style.setProperty('--scroll-dist', dist + 'px');
        track.style.setProperty('--scroll-dur', dur + 's');
        void track.offsetWidth;
        track.classList.add('is-scrolling');
      });
    });
  }

  function runAnimation(layer) {
    clearLayerTimer(layer);
    if (!layer.classList.contains('is-visible')) return;

    var root = layer.querySelector('.home-sector-scroll');
    if (!root) return;

    var track = root.querySelector('.home-sector-scroll__track');
    var viewport = root.querySelector('.home-sector-scroll__viewport');
    if (!track || !viewport) return;

    track.classList.remove('is-scrolling');

    var state = {
      scroll: setTimeout(function () {
        if (!layer.classList.contains('is-visible')) return;
        startScroll(track, viewport);
      }, 180)
    };

    timers.set(layer, state);
  }

  function build(sector) {
    var items = itemsFor(sector);
    var root = document.createElement('div');
    root.className = 'home-sector-scroll';
    root.setAttribute('aria-hidden', 'true');

    var top = document.createElement('div');
    top.className = 'home-sector-scroll__top';
    var lead = document.createElement('span');
    lead.className = 'home-sector-scroll__lead';
    lead.textContent = 'Encuentra';
    top.appendChild(lead);

    var viewport = document.createElement('div');
    viewport.className = 'home-sector-scroll__viewport';
    var track = document.createElement('div');
    track.className = 'home-sector-scroll__track';
    items.forEach(function (nombre) {
      var item = document.createElement('span');
      item.className = 'home-sector-scroll__item';
      item.textContent = nombre;
      track.appendChild(item);
    });
    var spacer = document.createElement('span');
    spacer.className = 'home-sector-scroll__spacer';
    spacer.setAttribute('aria-hidden', 'true');
    track.appendChild(spacer);
    viewport.appendChild(track);

    var foot = document.createElement('div');
    foot.className = 'home-sector-scroll__foot';
    var cerca = document.createElement('span');
    cerca.className = 'home-sector-scroll__cerca';
    cerca.innerHTML = '<svg class="home-sector-scroll__pin" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>Cerca de ti';
    foot.appendChild(cerca);

    root.appendChild(top);
    root.appendChild(viewport);
    root.appendChild(foot);
    return root;
  }

  window.CariHubSectorScroll = {
    itemsFor: itemsFor,
    durationMs: function (sector) {
      return durationMs(itemsFor(sector).length);
    },
    mount: function (layer, sector, autoplay) {
      clearLayerTimer(layer);
      layer.innerHTML = '';
      layer.dataset.sectorId = sector.id;
      layer.appendChild(build(sector));
      if (autoplay !== false && layer.classList.contains('is-visible')) {
        runAnimation(layer);
      }
    },
    play: function (layer) {
      runAnimation(layer);
    },
    stop: function (layer) {
      clearLayerTimer(layer);
    }
  };
})();
