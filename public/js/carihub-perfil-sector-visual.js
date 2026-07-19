/**
 * Perfil público — tema / fondo por sector + subcategoría.
 * Reutiliza CariHubResultadosSector (misma SSOT que resultados).
 */
(function (global) {
  'use strict';

  function categoriaDePerfil(u, q) {
    u = u || {};
    q = q || {};
    return (
      u.subcategoriaId ||
      u.categoriaPublica ||
      u.categoria ||
      u.subcategoria ||
      q.categoria ||
      q.subcategoria ||
      ''
    );
  }

  function sincronizar(u, q) {
    var RS = global.CariHubResultadosSector;
    if (!RS || !RS.aplicarTemaSector) return '';
    u = u || {};
    q = q || {};
    var cat = categoriaDePerfil(u, q);
    var sectorHint = u.sectorId || u.arquetipo || q.sector || '';
    /* Preferir categoría (subcat) para LGBT/subtemas; sectorHint si no hay cat. */
    var input = cat || sectorHint || '';
    if (!input) return '';
    return RS.aplicarTemaSector(input);
  }

  global.CariHubPerfilSectorVisual = {
    categoriaDePerfil: categoriaDePerfil,
    sincronizar: sincronizar
  };
})(typeof window !== 'undefined' ? window : globalThis);
