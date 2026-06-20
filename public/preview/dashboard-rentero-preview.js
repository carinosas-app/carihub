(function () {
  'use strict';
  if (window.lucide) lucide.createIcons();

  var btnMenu = document.getElementById('btnMenu');
  var sideL = document.getElementById('sideL');
  var overlay = document.getElementById('overlay');

  function closeSidebar() {
    if (sideL) sideL.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
  }

  if (btnMenu && sideL) {
    btnMenu.addEventListener('click', function () {
      var open = sideL.classList.toggle('open');
      if (overlay) overlay.classList.toggle('show', open);
    });
  }
  if (overlay) overlay.addEventListener('click', closeSidebar);
})();
