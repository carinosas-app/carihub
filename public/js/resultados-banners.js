/**
 * Rotación de banners superiores — Resultados (3 slots × N slides)
 */
(function (global) {
  'use strict';

  var PB_ROTATE_MS = [4800, 6200, 5400];
  var PB_ROTATE_DELAY = [0, 1400, 2800];
  var timers = [];

  function goPbSlide(stage, nextIdx) {
    if (!stage) return 0;
    var slides = stage.querySelectorAll('.pb-slot__slide');
    var dots = stage.querySelectorAll('.pb-slot__dot');
    if (!slides.length) return 0;
    var idx = ((nextIdx % slides.length) + slides.length) % slides.length;
    slides.forEach(function (sl, i) {
      var on = i === idx;
      sl.classList.toggle('is-active', on);
      sl.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-on', i === idx);
    });
    return idx;
  }

  function stopRotation() {
    timers.forEach(function (t) {
      clearInterval(t);
      clearTimeout(t);
    });
    timers = [];
  }

  function startRotation() {
    stopRotation();
    var stages = document.querySelectorAll('.resultados-wrap [data-pb-stage]');
    stages.forEach(function (stage, slot) {
      var slides = stage.querySelectorAll('.pb-slot__slide');
      if (slides.length < 2) return;
      var state = { idx: 0 };
      var every = PB_ROTATE_MS[slot] || 5200;
      var wait = PB_ROTATE_DELAY[slot] || 0;
      var kick = setTimeout(function () {
        state.idx = goPbSlide(stage, state.idx + 1);
        var loop = setInterval(function () {
          state.idx = goPbSlide(stage, state.idx + 1);
        }, every);
        timers.push(loop);
      }, wait);
      timers.push(kick);
    });
  }

  function boot() {
    startRotation();
  }

  global.CariHubResultadosBanners = {
    start: startRotation,
    stop: stopRotation
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  global.addEventListener('load', startRotation);
})(typeof window !== 'undefined' ? window : globalThis);
