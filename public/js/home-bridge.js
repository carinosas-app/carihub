(function () {
  'use strict';

  var homeGeoPicker = null;

  function readHiddenGeo(id) {
    var el = document.getElementById(id);
    return el ? String(el.textContent || '').trim() : '';
  }

  function syncHomeGeoGlobals(values) {
    values = values || {};
    if (typeof paisSeleccionado !== 'undefined') paisSeleccionado = values.pais || '';
    if (typeof estadoSeleccionado !== 'undefined') estadoSeleccionado = values.estado || '';
    if (typeof ciudadSeleccionada !== 'undefined') ciudadSeleccionada = values.ciudad || '';

    if (typeof mostrarTextoSeleccionado === 'function' && typeof limpiarTextoSeleccionado === 'function') {
      if (values.pais) mostrarTextoSeleccionado('textoPais', values.pais);
      else limpiarTextoSeleccionado('textoPais');
      if (values.estado) mostrarTextoSeleccionado('textoEstado', values.estado);
      else limpiarTextoSeleccionado('textoEstado');
      if (values.ciudad) mostrarTextoSeleccionado('textoCiudad', values.ciudad);
      else limpiarTextoSeleccionado('textoCiudad');
    }
  }

  function initHomeGeoPicker() {
    window.syncHomeGeoFromPicker = syncHomeGeoGlobals;
    if (homeGeoPicker) {
      homeGeoPicker.onChange = syncHomeGeoGlobals;
      return homeGeoPicker;
    }
    if (window.__homeGeoPicker) {
      homeGeoPicker = window.__homeGeoPicker;
      homeGeoPicker.onChange = syncHomeGeoGlobals;
    } else if (window.CariHubGeoPicker && typeof CariHubGeoPicker.bootHome === 'function') {
      homeGeoPicker = window.CariHubGeoPicker.bootHome(syncHomeGeoGlobals);
    }
    if (!homeGeoPicker) return homeGeoPicker;
    homeGeoPicker.setValues({
      pais: readHiddenGeo('textoPais'),
      estado: readHiddenGeo('textoEstado'),
      ciudad: readHiddenGeo('textoCiudad')
    });
    window.__homeGeoPicker = homeGeoPicker;
    window.openHomeGeoPicker = function (tipo) {
      if (homeGeoPicker) homeGeoPicker.open(tipo);
    };
    return homeGeoPicker;
  }

  window.openHomeGeoPicker = function (tipo) {
    var picker = initHomeGeoPicker();
    if (picker) picker.open(tipo);
  };

  window.homeGeoClick = function (tipo, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (typeof window.openHomeGeoPicker === 'function') {
      window.openHomeGeoPicker(tipo);
      return;
    }
    if (typeof window.abrirSelector === 'function') {
      window.abrirSelector(tipo);
    }
  };

  function bindHomeGeoFields() {
    initHomeGeoPicker();
    document.querySelectorAll('[data-home-geo-trigger]').forEach(function (el) {
      if (el.dataset.bridgeGeoBound === '1') return;
      el.dataset.bridgeGeoBound = '1';
      var tipo = el.getAttribute('data-home-geo-trigger');
      if (!tipo) return;
      el.addEventListener('click', function (e) {
        window.homeGeoClick(tipo, e);
      });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          window.homeGeoClick(tipo, e);
        }
      });
    });
  }

  window.syncHomeGeoPickerFromGlobals = function () {
    var picker = initHomeGeoPicker();
    if (!picker) return;
    picker.setValues({
      pais: readHiddenGeo('textoPais'),
      estado: readHiddenGeo('textoEstado'),
      ciudad: readHiddenGeo('textoCiudad')
    });
  };

  function syncFieldLabels() {
    var map = [
      ['textoCategoria', 'fieldCategoriaLabel', 'fieldCategoria'],
      ['textoPais', 'fieldPaisLabel', 'fieldPais'],
      ['textoEstado', 'fieldEstadoLabel', 'fieldEstado'],
      ['textoCiudad', 'fieldCiudadLabel', 'fieldCiudad']
    ];
    map.forEach(function (row) {
      var src = document.getElementById(row[0]);
      var label = document.getElementById(row[1]);
      var field = document.getElementById(row[2]);
      if (!src || !label) return;
      if (src.textContent) {
        label.textContent = src.textContent;
        if (field) field.classList.add('is-selected');
      }
    });
  }

  window.ensureUbicacionHome = function () {
    if (typeof openHomeGeoPicker === 'function') {
      var pais = readHiddenGeo('textoPais');
      var estado = readHiddenGeo('textoEstado');
      var ciudad = readHiddenGeo('textoCiudad');
      if (!pais) {
        openHomeGeoPicker('pais');
        return false;
      }
      if (!estado) {
        openHomeGeoPicker('estado');
        return false;
      }
      if (!ciudad) {
        openHomeGeoPicker('ciudad');
        return false;
      }
      return true;
    }
    if (typeof abrirSelector !== 'function') return true;
    var pais = document.getElementById('textoPais');
    var estado = document.getElementById('textoEstado');
    var ciudad = document.getElementById('textoCiudad');
    if (!pais || !(pais.textContent || '').trim()) {
      abrirSelector('pais');
      return false;
    }
    if (!estado || !(estado.textContent || '').trim()) {
      abrirSelector('estado');
      return false;
    }
    if (!ciudad || !(ciudad.textContent || '').trim()) {
      abrirSelector('ciudad');
      return false;
    }
    return true;
  };

  window.setCategoriaHome = function (nombre) {
    categoriaSeleccionada = nombre;
    if (typeof mostrarTextoSeleccionado === 'function') {
      mostrarTextoSeleccionado('textoCategoria', nombre);
    }
    var label = document.getElementById('fieldCategoriaLabel');
    if (label) label.textContent = nombre;
    var field = document.getElementById('fieldCategoria');
    if (field) field.classList.add('is-selected');
  };

  function patchLimpiarTextoSeleccionado() {
    if (window.__homeBridgeLimpiarPatched) return;
    var _limpiar = window.limpiarTextoSeleccionado;
    if (typeof _limpiar !== 'function') return;
    var defaults = {
      textoCategoria: 'Categoría',
      textoPais: 'País',
      textoEstado: 'Estado',
      textoCiudad: 'Ciudad'
    };
    var labelMap = {
      textoCategoria: 'fieldCategoriaLabel',
      textoPais: 'fieldPaisLabel',
      textoEstado: 'fieldEstadoLabel',
      textoCiudad: 'fieldCiudadLabel'
    };
    var fieldMap = {
      textoCategoria: 'fieldCategoria',
      textoPais: 'fieldPais',
      textoEstado: 'fieldEstado',
      textoCiudad: 'fieldCiudad'
    };
    window.limpiarTextoSeleccionado = function (id) {
      _limpiar(id);
      var field = document.getElementById(fieldMap[id]);
      if (field) field.classList.remove('is-selected');
      var label = document.getElementById(labelMap[id]);
      if (label && defaults[id]) label.textContent = defaults[id];
    };
    window.__homeBridgeLimpiarPatched = true;
  }

  function patchMostrarTextoSeleccionado() {
    if (window.__homeBridgeMostrarPatched) return;
    var _mostrar = window.mostrarTextoSeleccionado;
    if (typeof _mostrar !== 'function') return;
    window.mostrarTextoSeleccionado = function (id, valor) {
      _mostrar(id, valor);
      var map = {
        textoCategoria: 'fieldCategoriaLabel',
        textoPais: 'fieldPaisLabel',
        textoEstado: 'fieldEstadoLabel',
        textoCiudad: 'fieldCiudadLabel'
      };
      var fieldMap = {
        textoCategoria: 'fieldCategoria',
        textoPais: 'fieldPais',
        textoEstado: 'fieldEstado',
        textoCiudad: 'fieldCiudad'
      };
      var label = document.getElementById(map[id]);
      if (label) label.textContent = valor;
      var field = document.getElementById(fieldMap[id]);
      if (field) field.classList.add('is-selected');
    };
    window.__homeBridgeMostrarPatched = true;
  }

  function bindFieldClick(el, tipo) {
    if (!el || el.dataset.bridgeBound) return;
    el.dataset.bridgeBound = '1';
    function open(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (typeof abrirSelector === 'function') abrirSelector(tipo);
    }
    el.addEventListener('click', open);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(e); }
    });
  }

  function bindHomeBridge() {
    if (window.__homeBridgeBound) return;
    window.__homeBridgeBound = true;

    patchLimpiarTextoSeleccionado();
    patchMostrarTextoSeleccionado();

    if (window.CATALOGO_CATEGORIAS_CARIHUB) {
      window.CATEGORIAS_BUSCADOR = CATALOGO_CATEGORIAS_CARIHUB.map(function (c) { return c.nombre; });
      window.CARIHUB_CATEGORIAS_HOME = CATALOGO_CATEGORIAS_CARIHUB.map(function (c) {
        return { id: c.id, nombre: c.nombre, emoji: c.emoji };
      });
    }
    syncFieldLabels();
    bindHomeGeoFields();

    var menuBtn = document.querySelector('.home-header__btn[aria-label="Menú"]');
    if (menuBtn && !menuBtn.dataset.bridgeBound) {
      menuBtn.dataset.bridgeBound = '1';
      menuBtn.addEventListener('click', function () { abrirMenu(); });
    }

    var favBtn = document.querySelector('.home-header__btn[aria-label="Favoritos"]');
    if (favBtn && !favBtn.dataset.bridgeBound) {
      favBtn.dataset.bridgeBound = '1';
      favBtn.removeAttribute('data-modal');
      favBtn.addEventListener('click', function () { abrirFavoritos(); });
    }

    var btnBuscar = document.querySelector('.home-btn--buscar-ahora');
    if (btnBuscar && !btnBuscar.dataset.bridgeBound) {
      btnBuscar.dataset.bridgeBound = '1';
      btnBuscar.addEventListener('click', function () { buscarPerfilesFiltrados(); });
    }

    var btnCerca = document.getElementById('btnCerca');
    if (btnCerca && !btnCerca.dataset.bridgeBound) {
      btnCerca.dataset.bridgeBound = '1';
      btnCerca.addEventListener('click', function () { detectarUbicacion(); });
    }

    document.querySelectorAll('[data-modal="registro"], .home-btn--register').forEach(function (el) {
      if (el.dataset.bridgeBound) return;
      el.dataset.bridgeBound = '1';
      el.removeAttribute('data-modal');
      el.addEventListener('click', function (e) { e.preventDefault(); abrirRegistro(); });
    });

    document.querySelectorAll('[data-modal="avanzada"], .home-btn--advanced').forEach(function (el) {
      if (el.dataset.bridgeBound) return;
      el.dataset.bridgeBound = '1';
      el.removeAttribute('data-modal');
      el.addEventListener('click', function (e) { e.preventDefault(); abrirBusquedaAvanzada(); });
    });

    document.querySelectorAll('[data-modal="favoritos"]').forEach(function (el) {
      if (el.dataset.bridgeBound) return;
      el.dataset.bridgeBound = '1';
      el.removeAttribute('data-modal');
      el.addEventListener('click', function (e) { e.preventDefault(); abrirFavoritos(); });
    });

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindHomeBridge);
  } else {
    bindHomeBridge();
  }
})();
