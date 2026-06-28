/**
 * Labels UI de subcategorías — IDs legacy internos, copy público Cariñosas.
 */
(function (global) {
  'use strict';

  var UI_LABELS = {
    escort: 'Cariñosas',
    'escort gay': 'Escort Gay',
    'escort vip': 'Cariñosas VIP',
    acompanante: 'Cariñosas'
  };

  var REGISTRO_OCULTAS = { acompanante: true };

  var LEGACY_READ_ALIAS = { acompanante: 'escort' };

  var TEXT_TO_SUB_ID = {
    escort: 'escort',
    'escort gay': 'escort gay',
    'escort vip': 'escort vip',
    acompanante: 'escort',
    acompañante: 'escort',
    cariñosas: 'escort',
    'cariñosas gay': 'escort gay',
    'cariñosas vip': 'escort vip'
  };

  function normalizeSubId(id) {
    return String(id || '').trim().toLowerCase().replace(/_/g, ' ');
  }

  function limpiarTexto(valor) {
    return String(valor || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function resolveSubcategoriaLabel(subId, fallback) {
    var canon = normalizeSubId(subId);
    if (UI_LABELS[canon]) return UI_LABELS[canon];
    return fallback != null ? String(fallback) : (subId || '');
  }

  function resolveVisibleCategoria(valor, subIdOptional) {
    var sid = normalizeSubId(subIdOptional || '');
    if (UI_LABELS[sid]) return UI_LABELS[sid];

    var text = limpiarTexto(valor);
    if (TEXT_TO_SUB_ID[text] && UI_LABELS[TEXT_TO_SUB_ID[text]]) {
      return UI_LABELS[TEXT_TO_SUB_ID[text]];
    }

    var canon = normalizeSubId(valor);
    if (UI_LABELS[canon]) return UI_LABELS[canon];
    if (TEXT_TO_SUB_ID[canon] && UI_LABELS[TEXT_TO_SUB_ID[canon]]) {
      return UI_LABELS[TEXT_TO_SUB_ID[canon]];
    }

    return valor != null ? String(valor).trim() : '';
  }

  function resolveFromAny(valor, subIdOptional) {
    return resolveVisibleCategoria(valor, subIdOptional);
  }

  function ocultaEnRegistro(subId) {
    return !!REGISTRO_OCULTAS[normalizeSubId(subId)];
  }

  function legacyRegistroRedirectId(subId) {
    var canon = normalizeSubId(subId);
    return LEGACY_READ_ALIAS[canon] || canon;
  }

  function resolveLecturaSubcategoriaId(subId) {
    var canon = normalizeSubId(subId);
    return LEGACY_READ_ALIAS[canon] || canon;
  }

  global.CariHubSubcategoriaLabels = {
    UI_LABELS: UI_LABELS,
    resolveSubcategoriaLabel: resolveSubcategoriaLabel,
    resolveVisibleCategoria: resolveVisibleCategoria,
    resolveFromAny: resolveFromAny,
    ocultaEnRegistro: ocultaEnRegistro,
    legacyRegistroRedirectId: legacyRegistroRedirectId,
    resolveLecturaSubcategoriaId: resolveLecturaSubcategoriaId
  };
})(typeof window !== 'undefined' ? window : globalThis);
