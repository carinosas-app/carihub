/**
 * Imágenes oficiales de preview — Estados y LIBE (referencia: perfil-publico.html).
 */
(function (global) {
  'use strict';

  global.CariHubSlotPreviewImages = {
    estados: 'img/estado-publicado-libe.png',
    libe: 'img/live-en-vivo-libe.png',
    get: function (kind) {
      return kind === 'libe' ? this.libe : this.estados;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
