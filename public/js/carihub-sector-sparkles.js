/**
 * Destellos de 4 puntas — color del sector activo (no adultos).
 */
(function (global) {
  'use strict';

  var POSITIONS = [
    [6, 14], [14, 72], [28, 32], [38, 58], [52, 18],
    [62, 78], [74, 42], [84, 24], [22, 48], [48, 66],
    [88, 52], [12, 38], [56, 44], [70, 12], [32, 8],
    [46, 92], [8, 62], [94, 38], [18, 26], [78, 68]
  ];

  var SECTOR_SPARK = {
    salud: '#1976d2',
    profesionales: '#37474f',
    'bienes-raices': '#6d4c41',
    transporte: '#0288d1',
    educacion: '#5c6bc0',
    tecnologia: '#3949ab',
    mascotas: '#43a047',
    restaurantes: '#f4511e',
    bienestar: '#7cb342',
    eventos: '#ff8f00',
    comercio: '#00897b',
    hogar: '#e64a19',
    automotriz: '#1976d2',
    industria: '#455a64'
  };

  var LGBT_SPARK = ['#ef3b3b', '#ff8a1e', '#ffd21e', '#29b563', '#2b7fe0', '#8f39c9'];

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function sparkColor(sectorId) {
    if (sectorId === 'lgbt') return LGBT_SPARK[0];
    return SECTOR_SPARK[sectorId] || '#e91e63';
  }

  function buildHtml(sectorId, opts) {
    opts = opts || {};
    var positions = opts.positions || POSITIONS;
    var html = '';
    positions.forEach(function (p, i) {
      var color;
      if (sectorId === 'lgbt') {
        color = LGBT_SPARK[i % LGBT_SPARK.length];
      } else {
        color = opts.color || sparkColor(sectorId);
      }
      var size = 5 + (i % 4);
      html +=
        '<span class="ch-sector-spark" style="' +
          '--ss-x:' + p[0] + '%;--ss-y:' + p[1] + '%;' +
          '--ss-size:' + size + 'px;--ss-color:' + esc(color) + ';' +
          '--ss-delay:' + (i * 0.35) + 's;--ss-dur:' + (2.8 + (i % 5) * 0.4) + 's' +
        '"></span>';
    });
    return html;
  }

  function ensureLayer(container, sectorId, opts) {
    if (!container) return null;
    opts = opts || {};
    var layer = container.querySelector('.ch-sector-sparkles');
    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'ch-sector-sparkles';
      layer.setAttribute('aria-hidden', 'true');
      container.insertBefore(layer, container.firstChild);
    }
    if (sectorId === 'adultos') {
      layer.innerHTML = '';
      layer.hidden = true;
      return layer;
    }
    layer.hidden = false;
    layer.innerHTML = buildHtml(sectorId, opts);
    return layer;
  }

  function syncBody(sectorId) {
    var page = document.body;
    if (!page) return;
    if (!sectorId || sectorId === 'adultos' || sectorId === 'lgbt') {
      page.style.removeProperty('--ch-sector-spark-color');
      return;
    }
    if (page.getAttribute('data-subtema') === 'lgbt') {
      page.style.removeProperty('--ch-sector-spark-color');
      return;
    }
    /* Resultados: el color viene de --res-accent vía carihub-page-sector-sparkles.css */
    if (page.hasAttribute('data-sector') && page.getAttribute('data-sector') !== 'adultos') {
      return;
    }
    page.style.setProperty('--ch-sector-spark-color', sparkColor(sectorId));
  }

  global.CariHubSectorSparkles = {
    sparkColor: sparkColor,
    buildHtml: buildHtml,
    ensureLayer: ensureLayer,
    syncBody: syncBody
  };
})(typeof window !== 'undefined' ? window : globalThis);
