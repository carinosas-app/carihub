(function (global) {
  'use strict';

  /** Keys raíz — nunca en objeto público hidratado. */
  var ROOT_STRIP = [
    'datosPrivados',
    'verificacion',
    'camposPrivados',
    'camposPublicos',
    'schemaResuelto',
    'email',
    'telefono'
  ];

  /** Keys sensibles en nested *Perfil (1 nivel). */
  var NESTED_STRIP = [
    'nombreReal',
    'fechaNacimiento',
    'domicilioPrivado',
    'correoPrivado',
    'telefonoPrivado',
    'rfc',
    'razonSocial',
    'cedulaNumero',
    'cedulaProfesion',
    'cedulaProfesional',
    'cedulaComprobante',
    'ineFrente',
    'ineReverso',
    'selfieVerificacion',
    'notasInternas',
    'notasRevisionAdmin'
  ];

  var VERIFICACION_URL_SUFFIX = /URL$/i;

  function stripNestedPerfilObject(nested) {
    if (!nested || typeof nested !== 'object' || Array.isArray(nested)) return nested;
    var out = Object.assign({}, nested);
    NESTED_STRIP.forEach(function (key) {
      delete out[key];
    });
    Object.keys(out).forEach(function (key) {
      if (VERIFICACION_URL_SUFFIX.test(key)) delete out[key];
    });
    return out;
  }

  /**
   * Elimina datos privados del perfil normalizado para render público.
   * @param {Object} u — perfil hidratado
   * @param {Object} [rawDoc] — doc Firestore original (reservado)
   */
  function sanitizePerfilPublico(u, rawDoc) {
    if (!u || typeof u !== 'object') return u;
    var out = Object.assign({}, u);
    ROOT_STRIP.forEach(function (key) {
      delete out[key];
    });
    Object.keys(out).forEach(function (key) {
      if (!/Perfil$/i.test(key)) return;
      var val = out[key];
      if (!val || typeof val !== 'object' || Array.isArray(val)) return;
      out[key] = stripNestedPerfilObject(val);
    });
    return out;
  }

  global.CariHubPublicPrivacyGuard = {
    sanitizePerfilPublico: sanitizePerfilPublico,
    ROOT_STRIP: ROOT_STRIP.slice(),
    NESTED_STRIP: NESTED_STRIP.slice()
  };
})(typeof window !== 'undefined' ? window : globalThis);
