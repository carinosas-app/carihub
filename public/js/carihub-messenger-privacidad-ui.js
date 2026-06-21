/**
 * UI messenger — sin presencia / en línea (TICKET-049).
 * No muestra estado de conexión del anunciante; solo horario/disponibilidad de negocio neutra.
 */
(function (global) {
  'use strict';

  var PRESENCE_RE =
    /(en\s*l[ií]nea|conectad[oa]?|activo\s*ahora|disponible\s*ahora|activa\s*en\s*l[ií]nea|última\s*conexi[oó]n|ultima\s*conexion|en\s*curso|online\s*now|last\s*seen)/i;

  var DEFAULT_DISP = 'Consultar disponibilidad';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function isPresenceLike(text) {
    return PRESENCE_RE.test(String(text || '').trim());
  }

  function sanitizeDisponibilidad(text) {
    var t = String(text || '').trim();
    if (!t || isPresenceLike(t)) return DEFAULT_DISP;
    return t;
  }

  function disponibilidadCard(u) {
    u = u || {};
    var raw = u.disponibilidad || u.estatus || u.horario || '';
    var txt = sanitizeDisponibilidad(raw);
    return { clase: 'neutral', txt: txt, busy: /ocup|cerr/i.test(String(raw)) };
  }

  function livePromoLabel() {
    return 'LIVE · Promo';
  }

  function sanitizeLiveHora(text) {
    var t = String(text || '').trim();
    if (!t || isPresenceLike(t)) return 'Promo programada';
    return t;
  }

  function idlocHorarioHtml(text) {
    return '<span class="idloc__horario">' + esc(sanitizeDisponibilidad(text)) + '</span>';
  }

  global.CariHubMessengerPrivacidadUi = {
    PRESENCE_RE: PRESENCE_RE,
    DEFAULT_DISP: DEFAULT_DISP,
    isPresenceLike: isPresenceLike,
    sanitizeDisponibilidad: sanitizeDisponibilidad,
    disponibilidadCard: disponibilidadCard,
    livePromoLabel: livePromoLabel,
    sanitizeLiveHora: sanitizeLiveHora,
    idlocHorarioHtml: idlocHorarioHtml,
    esc: esc
  };
})(typeof window !== 'undefined' ? window : globalThis);
