/* Encuadre de banners — SOLO admin / panel anunciante. No usar en home público. */
(function () {
  'use strict';

  var STORAGE_KEY = 'carihub_frame_pan_v1';
  var DRAG_THRESHOLD = 5;
  var activeFrame = null;
  var drag = null;
  var suppressClick = false;

  function loadAll() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function saveAll(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function frameId(frame) {
    return frame.getAttribute('data-frame-slot') || frame.getAttribute('data-frame-id') || '';
  }

  function isEditable(frame) {
    if (frame.getAttribute('data-frame-editable') === 'false') return false;
    if (frame.getAttribute('data-frame-rented') === 'true') {
      return frame.getAttribute('data-frame-owner') === 'true';
    }
    return true;
  }

  function emitActive(active, frame) {
    document.dispatchEvent(new CustomEvent('carihub:framepan', {
      detail: { active: active, frame: frame || null }
    }));
  }

  function applyPan(img, x, y) {
    img.style.setProperty('--pan-x', x + 'px');
    img.style.setProperty('--pan-y', y + 'px');
  }

  function readPan(img) {
    var x = parseFloat(img.style.getPropertyValue('--pan-x')) || 0;
    var y = parseFloat(img.style.getPropertyValue('--pan-y')) || 0;
    return { x: x, y: y };
  }

  function clampPan(frame, img, x, y) {
    var fw = frame.clientWidth;
    var fh = frame.clientHeight;
    var iw = img.offsetWidth;
    var ih = img.offsetHeight;
    var maxX = Math.max(0, (iw - fw) / 2);
    var maxY = Math.max(0, (ih - fh) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y))
    };
  }

  function persist(frame, img) {
    var id = frameId(frame);
    if (!id) return;
    var pan = readPan(img);
    var all = loadAll();
    all[id] = pan;
    saveAll(all);
  }

  function restore(frame, img) {
    var id = frameId(frame);
    if (!id) return;
    var all = loadAll();
    if (!all[id]) return;
    applyPan(img, all[id].x, all[id].y);
  }

  function ensureHints(frame) {
    if (frame.querySelector('.ch-frame-pan__hints')) return;
    var hints = document.createElement('div');
    hints.className = 'ch-frame-pan__hints';
    hints.setAttribute('aria-hidden', 'true');
    hints.innerHTML =
      '<span class="ch-frame-pan__arrow ch-frame-pan__arrow--up" aria-hidden="true"></span>' +
      '<span class="ch-frame-pan__arrow ch-frame-pan__arrow--right" aria-hidden="true"></span>' +
      '<span class="ch-frame-pan__arrow ch-frame-pan__arrow--down" aria-hidden="true"></span>' +
      '<span class="ch-frame-pan__arrow ch-frame-pan__arrow--left" aria-hidden="true"></span>';
    frame.appendChild(hints);
  }

  function deactivate() {
    if (!activeFrame) return;
    var img = activeFrame.querySelector('.ch-frame-pan__img, img');
    if (img) persist(activeFrame, img);
    activeFrame.classList.remove('is-pan-active');
    activeFrame.removeAttribute('aria-grabbed');
    var prev = activeFrame;
    activeFrame = null;
    emitActive(false, prev);
  }

  function activate(frame) {
    if (!isEditable(frame)) return;
    deactivate();
    activeFrame = frame;
    ensureHints(frame);
    frame.classList.add('is-pan-active');
    frame.setAttribute('aria-grabbed', 'true');
    emitActive(true, frame);
  }

  function toggleFrame(frame) {
    if (!isEditable(frame)) return;
    if (activeFrame === frame) {
      deactivate();
      return;
    }
    activate(frame);
  }

  function onPointerDown(e) {
    if (!activeFrame || !isFrameTarget(activeFrame, e.target)) return;
    var img = activeFrame.querySelector('.ch-frame-pan__img, img');
    if (!img) return;
    e.preventDefault();
    var pan = readPan(img);
    drag = {
      frame: activeFrame,
      img: img,
      startX: e.clientX,
      startY: e.clientY,
      baseX: pan.x,
      baseY: pan.y,
      moved: false
    };
    try { activeFrame.setPointerCapture(e.pointerId); } catch (err) {}
  }

  function onPointerMove(e) {
    if (!drag) return;
    var dx = e.clientX - drag.startX;
    var dy = e.clientY - drag.startY;
    if (!drag.moved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
      drag.moved = true;
    }
    if (!drag.moved) return;
    drag.frame.classList.add('is-pan-dragging');
    var next = clampPan(drag.frame, drag.img, drag.baseX + dx, drag.baseY + dy);
    applyPan(drag.img, next.x, next.y);
  }

  function onPointerUp(e) {
    if (!drag) return;
    if (drag.moved) suppressClick = true;
    drag.frame.classList.remove('is-pan-dragging');
    persist(drag.frame, drag.img);
    try { drag.frame.releasePointerCapture(e.pointerId); } catch (err) {}
    drag = null;
  }

  function isFrameTarget(frame, target) {
    if (!frame || !target) return false;
    if (target === frame) return true;
    var img = frame.querySelector('.ch-frame-pan__img, img');
    return target === img || (img && img.contains(target));
  }

  function onFrameClick(e) {
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    var frame = e.target.closest('[data-frame-pan]');
    if (!frame || !isFrameTarget(frame, e.target)) return;
    if (!isEditable(frame)) return;
    e.preventDefault();
    e.stopPropagation();
    toggleFrame(frame);
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') deactivate();
  }

  function prepareImg(img) {
    if (!img || img.dataset.panReady) return;
    img.dataset.panReady = '1';
    img.draggable = false;
    img.classList.add('ch-frame-pan__img');
  }

  function initFrame(frame) {
    if (!frame || frame.dataset.panInit) return;
    frame.dataset.panInit = '1';
    ensureHints(frame);
    var img = frame.querySelector('img');
    if (!img) return;
    prepareImg(img);
    function tryRestore() {
      restore(frame, img);
    }
    if (img.complete) tryRestore();
    else img.addEventListener('load', tryRestore, { once: true });
  }

  function scan(root) {
    (root || document).querySelectorAll('[data-frame-pan]').forEach(initFrame);
  }

  function boot() {
    scan(document);
    document.addEventListener('click', onFrameClick, true);
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerUp);
    document.addEventListener('keydown', onKeyDown);
  }

  window.CarihubFramePan = {
    scan: scan,
    deactivate: deactivate,
    isEditable: isEditable,
    isActive: function () { return !!activeFrame; }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
