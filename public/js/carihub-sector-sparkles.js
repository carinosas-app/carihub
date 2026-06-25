/**
 * Destellos de 4 puntas — color del sector activo (no adultos).
 */
(function (global) {
  'use strict';

  var POSITIONS = [
    [6, 14], [14, 72], [28, 32], [38, 58], [52, 18],
    [62, 78], [74, 42], [84, 24], [22, 48], [48, 66],
    [88, 52], [12, 38], [56, 44], [70, 12]
  ];

  var SECTOR_SPARK = {
    salud: '#1976d2',
    profesionales: '#455a64',
    'bienes-raices': '#7b1fa2',
    transporte: '#0288d1',
    educacion: '#00897b',
    tecnologia: '#1565c0',
    mascotas: '#558b2f',
    restaurantes: '#e65100',
    bienestar: '#689f38',
    eventos: '#c2185b',
    comercio: '#6a1b9a',
    hogar: '#ef6c00',
    automotriz: '#37474f',
    industria: '#5d4037'
  };

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function sparkColor(sectorId) {
    return SECTOR_SPARK[sectorId] || '#e91e63';
  }

  function buildHtml(sectorId, opts) {
    opts = opts || {};
    var positions = opts.positions || POSITIONS;
    var color = opts.color || sparkColor(sectorId);
    var html = '';
    positions.forEach(function (p, i) {
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
    if (!sectorId || sectorId === 'adultos') {
      page.style.removeProperty('--ch-sector-spark-color');
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
