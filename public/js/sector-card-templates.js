/**
 * Plantillas HTML para tarjetas de sector (escalan con container queries).
 */
(function (global) {
  'use strict';

  var BASE = 'img/home/sector-cards/';

  var TRANSPORTE_ITEMS = [
    { label: 'Mudanzas', icon: '🚚' },
    { label: 'Fletes', icon: '📍' },
    { label: 'Mensajería', icon: '🛵' },
    { label: 'Paquetería', icon: '📦' },
    { label: 'Transp. escolar', icon: '🚐', full: 'Transporte Escolar' },
    { label: 'Renta camionetas', icon: '🛻', full: 'Renta de Camionetas' },
    { label: 'Logística local', icon: '👷', full: 'Logística Local' },
    { label: 'Almacenaje', icon: '🗄️' }
  ];

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function buildTransporte(sector) {
    var root = el('div', 'hsc-transporte');

    var hero = el('div', 'hsc-transporte__hero');
    var heroText = el('div', 'hsc-transporte__hero-text');
    heroText.appendChild(el('h3', 'hsc-transporte__title', 'Transporte, Logística y Mensajería'));
    heroText.appendChild(el('p', 'hsc-transporte__cta', 'Toca para ver todas'));
    hero.appendChild(heroText);

    var truck = el('div', 'hsc-transporte__truck');
    truck.setAttribute('aria-hidden', 'true');
    var truckImg = document.createElement('img');
    truckImg.className = 'hsc-transporte__truck-img';
    truckImg.src = BASE + 'transporte.png';
    truckImg.alt = '';
    truckImg.decoding = 'async';
    truck.appendChild(truckImg);
    hero.appendChild(truck);
    root.appendChild(hero);

    var grid = el('div', 'hsc-transporte__grid');
    TRANSPORTE_ITEMS.forEach(function (item) {
      var cell = el('div', 'hsc-transporte__cell');
      cell.appendChild(el('span', 'hsc-transporte__ico', item.icon));
      cell.appendChild(el('span', 'hsc-transporte__label', item.label));
      if (item.full) cell.setAttribute('title', item.full);
      grid.appendChild(cell);
    });
    root.appendChild(grid);

    root.setAttribute('aria-label', (sector && sector.nombre) || 'Transporte, Logística y Mensajería');
    return root;
  }

  var BUILDERS = {
    transporte: buildTransporte
  };

  function build(templateId, sector) {
    var fn = BUILDERS[String(templateId || '')];
    return fn ? fn(sector) : null;
  }

  global.CariHubSectorCardTemplates = {
    build: build,
    BUILDERS: BUILDERS
  };
})(typeof window !== 'undefined' ? window : globalThis);
