(function () {
  'use strict';

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
    function open() {
      if (typeof abrirSelector === 'function') abrirSelector(tipo);
    }
    el.addEventListener('click', open);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
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

    bindFieldClick(document.getElementById('fieldPais'), 'pais');
    bindFieldClick(document.getElementById('fieldEstado'), 'estado');
    bindFieldClick(document.getElementById('fieldCiudad'), 'ciudad');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindHomeBridge);
  } else {
    bindHomeBridge();
  }
})();
