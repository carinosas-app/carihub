/**
 * Iconos modernos para tiles de subcategorías (Home — Explora otras categorías).
 * Prioridad: PNG registro-subcats → SVG temático → fallback sector.
 */
(function (global) {
  'use strict';

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function wrapSvg(body, gradId, stops) {
    var defs = stops
      ? '<defs><linearGradient id="' + gradId + '" x1="12" y1="4" x2="36" y2="40" gradientUnits="userSpaceOnUse">' +
        stops.map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"/>'; }).join('') +
        '</linearGradient></defs>'
      : '';
    return (
      '<svg class="home-sector-subcat-tile__icon-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      defs + body + '</svg>'
    );
  }

  var GRAD = [['0%', '#ffb8dc'], ['100%', '#e91e63']];
  var GRAD_TEAL = [['0%', '#7ee8d8'], ['100%', '#0d9488']];
  var GRAD_GREEN = [['0%', '#a7f3d0'], ['100%', '#059669']];
  var GRAD_BLUE = [['0%', '#93c5fd'], ['100%', '#2563eb']];
  var GRAD_AMBER = [['0%', '#fcd34d'], ['100%', '#d97706']];
  var GRAD_VIOLET = [['0%', '#c4b5fd'], ['100%', '#7c3aed']];
  var GRAD_ROSE = [['0%', '#fda4af'], ['100%', '#e11d48']];

  function pawSvg(gid) {
    return wrapSvg(
      '<ellipse cx="24" cy="28" rx="9" ry="8" fill="url(#' + gid + ')"/>' +
      '<circle cx="15" cy="18" r="4.2" fill="url(#' + gid + ')"/>' +
      '<circle cx="24" cy="14.5" r="4.5" fill="url(#' + gid + ')"/>' +
      '<circle cx="33" cy="18" r="4.2" fill="url(#' + gid + ')"/>' +
      '<circle cx="19" cy="11" r="3.2" fill="url(#' + gid + ')" opacity=".85"/>' +
      '<circle cx="29" cy="11" r="3.2" fill="url(#' + gid + ')" opacity=".85"/>',
      gid, GRAD_GREEN
    );
  }

  function vetSvg(gid) {
    return wrapSvg(
      '<rect x="12" y="14" width="24" height="22" rx="5" fill="url(#' + gid + ')"/>' +
      '<path d="M24 18v14M17 25h14" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/>' +
      '<ellipse cx="24" cy="36" rx="7" ry="3" fill="url(#' + gid + ')" opacity=".35"/>',
      gid, GRAD_GREEN
    );
  }

  function groomSvg(gid) {
    return wrapSvg(
      '<circle cx="20" cy="22" r="8" fill="url(#' + gid + ')"/>' +
      '<path d="M28 14l8 8-4 4-8-8 4-4z" fill="url(#' + gid + ')" opacity=".9"/>' +
      '<path d="M14 32c2-4 6-6 10-6s8 2 10 6" stroke="url(#' + gid + ')" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
      gid, GRAD_AMBER
    );
  }

  function shopSvg(gid) {
    return wrapSvg(
      '<path d="M10 18l4-8h20l4 8v18a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V18z" fill="url(#' + gid + ')"/>' +
      '<path d="M10 18h28" stroke="#fff" stroke-width="1.5" opacity=".6"/>' +
      '<circle cx="20" cy="28" r="3" fill="#fff" opacity=".85"/>' +
      '<circle cx="28" cy="28" r="3" fill="#fff" opacity=".85"/>',
      gid, GRAD_ROSE
    );
  }

  function trainSvg(gid) {
    return wrapSvg(
      '<circle cx="24" cy="20" r="7" fill="url(#' + gid + ')"/>' +
      '<path d="M18 30h12l-2 6h-8l-2-6z" fill="url(#' + gid + ')" opacity=".88"/>' +
      '<path d="M16 26h16" stroke="url(#' + gid + ')" stroke-width="2" stroke-linecap="round"/>',
      gid, GRAD_BLUE
    );
  }

  function houseSvg(gid) {
    return wrapSvg(
      '<path d="M24 10L8 24h4v14h24V24h4L24 10z" fill="url(#' + gid + ')"/>' +
      '<rect x="20" y="26" width="8" height="12" rx="1" fill="#fff" opacity=".75"/>',
      gid, GRAD_TEAL
    );
  }

  function leafSvg(gid) {
    return wrapSvg(
      '<path d="M24 38C14 32 10 22 14 12c10 2 18 10 20 20 2 10-2 18-10 6z" fill="url(#' + gid + ')"/>' +
      '<path d="M24 38V22" stroke="#fff" stroke-width="1.5" opacity=".5" stroke-linecap="round"/>',
      gid, GRAD_GREEN
    );
  }

  function bookSvg(gid) {
    return wrapSvg(
      '<path d="M10 12h13v26H12a2 2 0 0 1-2-2V12z" fill="url(#' + gid + ')"/>' +
      '<path d="M38 12H25v26h11a2 2 0 0 0 2-2V12z" fill="url(#' + gid + ')" opacity=".88"/>' +
      '<path d="M25 12v26" stroke="#fff" stroke-width="1.2" opacity=".5"/>',
      gid, GRAD_BLUE
    );
  }

  function chipSvg(gid) {
    return wrapSvg(
      '<rect x="10" y="14" width="28" height="20" rx="4" fill="url(#' + gid + ')"/>' +
      '<rect x="14" y="18" width="8" height="3" rx="1" fill="#fff" opacity=".9"/>' +
      '<rect x="14" y="24" width="14" height="2" rx="1" fill="#fff" opacity=".65"/>' +
      '<rect x="14" y="28" width="10" height="2" rx="1" fill="#fff" opacity=".65"/>' +
      '<circle cx="34" cy="18" r="2" fill="#fff" opacity=".8"/>',
      gid, GRAD
    );
  }

  function foodSvg(gid) {
    return wrapSvg(
      '<path d="M14 32V18a4 4 0 0 1 8 0v14" stroke="url(#' + gid + ')" stroke-width="3" stroke-linecap="round" fill="none"/>' +
      '<path d="M18 32V16" stroke="url(#' + gid + ')" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path d="M28 32c0-6 4-10 8-14v16H28z" fill="url(#' + gid + ')"/>',
      gid, GRAD_AMBER
    );
  }

  function truckSvg(gid) {
    return wrapSvg(
      '<rect x="8" y="20" width="22" height="14" rx="2" fill="url(#' + gid + ')"/>' +
      '<path d="M30 24h8l4 6v4H30V24z" fill="url(#' + gid + ')" opacity=".9"/>' +
      '<circle cx="16" cy="36" r="3.5" fill="#334155"/><circle cx="16" cy="36" r="1.5" fill="#e2e8f0"/>' +
      '<circle cx="36" cy="36" r="3.5" fill="#334155"/><circle cx="36" cy="36" r="1.5" fill="#e2e8f0"/>',
      gid, GRAD_TEAL
    );
  }

  function sparkSvg(gid) {
    return wrapSvg(
      '<path d="M24 8l2.5 9.5L36 20l-9.5 2.5L24 32l-2.5-9.5L12 20l9.5-2.5L24 8z" fill="url(#' + gid + ')"/>',
      gid, GRAD
    );
  }

  function lotusSvg(gid) {
    return wrapSvg(
      '<ellipse cx="24" cy="28" rx="10" ry="6" fill="url(#' + gid + ')"/>' +
      '<ellipse cx="17" cy="22" rx="6" ry="10" fill="url(#' + gid + ')" opacity=".85" transform="rotate(-25 17 22)"/>' +
      '<ellipse cx="31" cy="22" rx="6" ry="10" fill="url(#' + gid + ')" opacity=".85" transform="rotate(25 31 22)"/>' +
      '<ellipse cx="24" cy="18" rx="5" ry="9" fill="url(#' + gid + ')"/>',
      gid, GRAD_VIOLET
    );
  }

  function matchKey(id, nombre) {
    return (String(id || '') + ' ' + String(nombre || '')).toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  var RULES = [
    { re: /veterinar|clinica.*veterin|consulta.*veterin/, svg: function (g) { return vetSvg(g || 'gv1'); } },
    { re: /peluqueria.*canin|grooming|estetica.*canin/, svg: function (g) { return groomSvg(g || 'gg1'); } },
    { re: /pet.?shop|tienda.*mascot/, svg: function (g) { return shopSvg(g || 'gs1'); } },
    { re: /adiestramiento|entrenamiento.*canin/, svg: function (g) { return trainSvg(g || 'gt1'); } },
    { re: /pension|guarderia.*mascot|hotel.*mascot/, svg: function (g) { return houseSvg(g || 'gh1'); } },
    { re: /crematorio|funeraria.*mascot/, svg: function (g) { return leafSvg(g || 'gl1'); } },
    { re: /veterinar|clinica|pet-shop|peluqueria-canina|crematorio|mascot/, svg: function (g) { return pawSvg(g || 'gp1'); } },
    { re: /adiestramiento|pension|guarderia/, svg: function (g) { return pawSvg(g || 'gp2'); } },
    { re: /yoga|pilates|meditacion|reiki|masaje|temazcal|aromaterapia|holistic|espiritual|bienestar/, svg: function (g) { return lotusSvg(g || 'gy1'); } },
    { re: /escuela|universidad|curso|clase|idioma|capacitacion|preparatoria|taller|educacion/, svg: function (g) { return bookSvg(g || 'gb1'); } },
    { re: /software|soporte|computadora|redes|web|marketing-digital|ciber|equipo-de-computo|digital|tecnolog/, svg: function (g) { return chipSvg(g || 'gc1'); } },
    { re: /restaurante|cafe|food|comida|panader|taquer|marisquer|bar|antro|vida-nocturna/, svg: function (g) { return foodSvg(g || 'gf1'); } },
    { re: /mudanza|flete|mensajeria|paqueteria|transporte|camioneta|logistica|almacenaje/, svg: function (g) { return truckSvg(g || 'gt2'); } }
  ];

  function svgFor(sectorId, catId, catNombre) {
    var key = matchKey(catId, catNombre);
    var i;
    for (i = 0; i < RULES.length; i++) {
      if (RULES[i].re.test(key)) return RULES[i].svg('g' + i);
    }
    if (sectorId === 'mascotas') return pawSvg('gp0');
    if (sectorId === 'bienestar') return lotusSvg('gy0');
    if (sectorId === 'educacion') return bookSvg('gb0');
    if (sectorId === 'tecnologia') return chipSvg('gc0');
    if (sectorId === 'restaurantes') return foodSvg('gf0');
    if (sectorId === 'transporte') return truckSvg('gt0');
    return sparkSvg('gs0');
  }

  function thumbFromPicker(sectorId, catId, index) {
    if (!global.CariHubSectorSubcatPicker || !global.CariHubSectorSubcatPicker.imageForSubcat) return '';
    var src = global.CariHubSectorSubcatPicker.imageForSubcat(sectorId, catId, index);
    if (!src || /\/sector-cards\//.test(src) || /\/sectores\//.test(src)) return '';
    return src;
  }

  function iconHtml(sectorId, catId, catNombre, index) {
    var thumb = thumbFromPicker(sectorId, catId, index);
    if (thumb) {
      return (
        '<span class="home-sector-subcat-tile__media home-sector-subcat-tile__media--photo">' +
          '<img src="' + esc(thumb) + '" alt="" loading="lazy" decoding="async">' +
        '</span>'
      );
    }
    return (
      '<span class="home-sector-subcat-tile__media home-sector-subcat-tile__media--svg">' +
        svgFor(sectorId, catId, catNombre) +
      '</span>'
    );
  }

  global.CariHubHomeSectorSubcatIcons = {
    iconHtml: iconHtml,
    svgFor: svgFor
  };
})(typeof window !== 'undefined' ? window : globalThis);
