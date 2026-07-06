/**
 * Filtro unificado categoría/subcategoría + geo — resultados, Firestore y dashboard.
 * RES-P0-03: una sola lógica para coincideBusqueda / filtrarPerfiles / filtrarMock.
 */
(function (global) {
  'use strict';

  var SENTINEL_CAT = ['todas', 'todos', 'todas las categorias', 'todas las ciudades', 'todos los estados'];
  var SENTINEL_ESTADO = ['todos', 'todos los estados'];
  var SENTINEL_CIUDAD = ['todas', 'todas las ciudades'];

  function normTxt(t) {
    if (global.CHUI && global.CHUI.chNorm) return global.CHUI.chNorm(t);
    return String(t || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function campoCoincide(valorPerfil, valorBusqueda, opts) {
    opts = opts || {};
    var b = normTxt(valorBusqueda);
    if (!b) return true;
    var p = normTxt(valorPerfil);
    if (!p) return !!opts.opcional;
    if (p === b) return true;
    if (opts.parcial) return p.indexOf(b) !== -1 || b.indexOf(p) !== -1;
    return false;
  }

  function idCategoria(valor) {
    if (global.CariHubCatalogos && global.CariHubCatalogos.idCategoria) {
      return global.CariHubCatalogos.idCategoria(valor);
    }
    return normTxt(valor);
  }

  function resolverSubcategoriaId(input) {
    if (global.CariHubFieldEngineLite && global.CariHubFieldEngineLite.lookupSubcategoriaId) {
      return global.CariHubFieldEngineLite.lookupSubcategoriaId(input) || '';
    }
    return normTxt(input);
  }

  function esSentinel(valor, lista) {
    var v = normTxt(valor);
    if (!v) return true;
    for (var i = 0; i < lista.length; i++) {
      if (v === lista[i]) return true;
    }
    return false;
  }

  function filtroCategoriaActivo(filtros) {
    filtros = filtros || {};
    var sub = String(filtros.subcategoriaId || filtros.subcategoria || '').trim();
    if (sub) return true;
    var cat = String(filtros.categoria || '').trim();
    return !!cat && !esSentinel(cat, SENTINEL_CAT);
  }

  function perfilCoincideCategoriaSub(perfil, filtros) {
    if (!filtroCategoriaActivo(filtros)) return true;

    var perfilCat = perfil.categoria || perfil.categoriaPublica || '';
    var perfilSubRaw = perfil.subcategoriaId || perfil.subcategoria || perfilCat;
    var perfilSubId = resolverSubcategoriaId(perfilSubRaw);
    var queryRaw = filtros.subcategoriaId || filtros.subcategoria || filtros.categoria || '';
    var querySubId = resolverSubcategoriaId(queryRaw);

    if (querySubId && perfilSubId && normTxt(perfilSubId) === normTxt(querySubId)) return true;

    var catId = idCategoria(perfilCat);
    var qId = idCategoria(queryRaw);
    if (qId && catId && normTxt(catId) === normTxt(qId)) return true;

    return campoCoincide(perfilCat, filtros.categoria, { parcial: true })
      || campoCoincide(perfil.categoriaPublica, filtros.categoria, { parcial: true })
      || campoCoincide(perfil.subcategoria, filtros.categoria, { parcial: true })
      || campoCoincide(perfilSubId, querySubId, { parcial: true });
  }

  function perfilCoincideFiltros(perfil, filtros) {
    if (!perfil || !filtros) return false;

    if (!perfilCoincideCategoriaSub(perfil, filtros)) return false;

    var pais = String(filtros.pais || '').trim();
    if (pais && !campoCoincide(perfil.pais, pais)) return false;

    var estado = String(filtros.estado || '').trim();
    if (estado && !esSentinel(estado, SENTINEL_ESTADO)) {
      if (!campoCoincide(perfil.estado, estado, { parcial: true })) return false;
    }

    var ciudad = String(filtros.ciudad || '').trim();
    if (ciudad && !esSentinel(ciudad, SENTINEL_CIUDAD)) {
      var perfilCiudadZona = [perfil.ciudad, perfil.zona].filter(Boolean).join(' ');
      if (!campoCoincide(perfilCiudadZona, ciudad, { parcial: true })) return false;
    }

    return true;
  }

  function filtrarPerfiles(items, filtros) {
    items = items || [];
    filtros = filtros || {};
    return items.filter(function (p) {
      return perfilCoincideFiltros(p, filtros);
    });
  }

  global.CariHubPerfilBusquedaFiltro = {
    normTxt: normTxt,
    campoCoincide: campoCoincide,
    idCategoria: idCategoria,
    resolverSubcategoriaId: resolverSubcategoriaId,
    perfilCoincideFiltros: perfilCoincideFiltros,
    filtrarPerfiles: filtrarPerfiles
  };
})(typeof window !== 'undefined' ? window : globalThis);
