/**
 * Toggle show/hide password — patrón CariHub (🙈 oculta / 🐵 visible).
 */
(function (global) {
  'use strict';

  function bindPasswordToggleBtn(btn) {
    if (!btn || btn.dataset.passwordToggleBound === '1') return;
    btn.dataset.passwordToggleBound = '1';
    var inputId = btn.getAttribute('data-toggle-for');
    var input = inputId ? document.getElementById(inputId) : null;
    if (!input) return;
    btn.addEventListener('click', function () {
      var visible = input.type === 'text';
      input.type = visible ? 'password' : 'text';
      var label = visible ? 'Mostrar contraseña' : 'Ocultar contraseña';
      btn.textContent = visible ? '🙈' : '🐵';
      btn.title = label;
      btn.setAttribute('aria-label', label);
    });
  }

  function initPasswordToggle(root) {
    var scope = root || document;
    scope.querySelectorAll('.password-toggle-btn[data-toggle-for]').forEach(bindPasswordToggleBtn);
  }

  global.CariHubPasswordToggle = {
    init: initPasswordToggle,
    bind: bindPasswordToggleBtn
  };

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', function () {
      initPasswordToggle(global.document);
    });
  } else {
    initPasswordToggle(global.document);
  }
})(typeof window !== 'undefined' ? window : globalThis);
