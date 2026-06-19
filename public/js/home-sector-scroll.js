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

  function fitScrollItems(root) {
    if (!root) return;
    var viewport = root.querySelector('.home-sector-scroll__viewport');
    if (!viewport) return;
    var maxW = Math.max(24, viewport.clientWidth - 6);
    var baseEm = parseFloat(getComputedStyle(root).fontSize) || 9;
    var scales = [1.02, 0.96, 0.9, 0.84, 0.78, 0.72, 0.66, 0.6, 0.55, 0.5];
    root.querySelectorAll('.home-sector-scroll__item').forEach(function (item) {
      item.style.fontSize = '';
      for (var i = 0; i < scales.length; i++) {
        item.style.fontSize = (baseEm * scales[i]).toFixed(2) + 'px';
        if (item.scrollWidth <= maxW) break;
      }
    });
  }

  function scheduleFitScrollItems(layer) {
    if (!layer) return;
    var root = layer.querySelector('.home-sector-scroll');
    if (!root) return;
    function run() { fitScrollItems(root); }
    run();
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run);
    setTimeout(run, 80);
    setTimeout(run, 450);
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

  /** Etiquetas más cortas solo cuando no caben legibles en el ancho de la tarjeta */
  var ITEM_DISPLAY = {
    'Técnicos en aire acondicionado automotriz': 'Técnicos A/C auto',
    'Artistas de entretenimiento para adultos': 'Artistas adultos',
    'Cosplayers para eventos privados': 'Cosplayers privados',
    'Presentadores para eventos exclusivos': 'Presentadores VIP',
    'Acompañantes para adultos mayores': 'Cuidadores mayores',
    'Administradores de propiedades': 'Admin. inmobiliario',
    'Instaladores de paneles solares': 'Paneles solares',
    'Técnicos en cámaras de seguridad': 'Técnicos CCTV',
    'Distribuidores independientes': 'Distribuidores',
    'Representantes comerciales': 'Representantes',
    'Consultores empresariales': 'Consultores',
    'Reclutadores independientes': 'Reclutadores',
    'Masajistas terapéuticos': 'Masajistas',
    'Terapeutas ocupacionales': 'Terapeutas',
    'Instructores deportivos': 'Instructores',
    'Desarrolladores móviles': 'Devs móviles',
    'Técnicos en computación': 'Técnicos PC',
    'Paseadores especializados': 'Paseadores'
  };

  function displayLabel(nombre) {
    return ITEM_DISPLAY[nombre] || nombre;
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
      item.textContent = displayLabel(nombre);
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
    cerca.innerHTML = '<span>cerca de ti</span>';
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
      scheduleFitScrollItems(layer);
      if (autoplay !== false && layer.classList.contains('is-visible')) {
        runAnimation(layer);
      }
    },
    play: function (layer) {
      runAnimation(layer);
    },
    stop: function (layer) {
      clearLayerTimer(layer);
    },
    fitScrollItems: fitScrollItems,
    scheduleFitScrollItems: scheduleFitScrollItems
  };

  var sectorResizeTimer = null;
  window.addEventListener('resize', function () {
    if (sectorResizeTimer) clearTimeout(sectorResizeTimer);
    sectorResizeTimer = setTimeout(function () {
      document.querySelectorAll('.home-otros-sectores .home-sector-card__layer').forEach(function (layer) {
        scheduleFitScrollItems(layer);
      });
    }, 120);
  });
})();
