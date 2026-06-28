/**
 * Avisos UI CariHub — modal informativo reutilizable (sin alert() nativo).
 */
(function (global) {
  'use strict';

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function bindOnce(el, event, fn) {
    if (!el || el.dataset.chUiBound === '1') return;
    el.dataset.chUiBound = '1';
    el.addEventListener(event, fn);
  }

  function ensureModal() {
    var modal = document.getElementById('rpValModal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'rp-val-modal rp-hidden';
    modal.id = 'chUiInfoModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML =
      '<div class="rp-val-modal__backdrop" id="chUiInfoModalBackdrop"></div>' +
      '<div class="rp-val-modal__panel">' +
        '<p class="rp-val-modal__icon" aria-hidden="true">ℹ️</p>' +
        '<h3 class="rp-val-modal__title" id="chUiInfoModalTitle">Aviso</h3>' +
        '<p class="rp-val-modal__hint" id="chUiInfoModalMessage"></p>' +
        '<ul class="rp-val-modal__list rp-hidden" id="chUiInfoModalList"></ul>' +
        '<button type="button" class="rp-btn rp-btn--primary" id="chUiInfoModalOk">Entendido</button>' +
      '</div>';
    document.body.appendChild(modal);
    bindOnce(document.getElementById('chUiInfoModalOk'), 'click', hideInfoModal);
    bindOnce(document.getElementById('chUiInfoModalBackdrop'), 'click', hideInfoModal);
    return modal;
  }

  function hideInfoModal() {
    var ids = ['rpValModal', 'chUiInfoModal'];
    ids.forEach(function (id) {
      var m = document.getElementById(id);
      if (m) m.classList.add('rp-hidden');
    });
  }

  /**
   * @param {string|{title?:string,message?:string,items?:string[],okLabel?:string}} opts
   */
  function showInfoModal(opts) {
    var title = 'Aviso';
    var message = '';
    var items = [];
    var okLabel = 'Entendido';
    if (typeof opts === 'string') {
      message = opts;
    } else if (opts) {
      title = opts.title || title;
      message = opts.message || '';
      items = Array.isArray(opts.items) ? opts.items : [];
      okLabel = opts.okLabel || okLabel;
    }
    var modal = document.getElementById('rpValModal') || ensureModal();
    var isRp = modal.id === 'rpValModal';
    var titleEl = document.getElementById(isRp ? 'rpValModalTitle' : 'chUiInfoModalTitle');
    var hintEl = document.getElementById(isRp ? 'rpValModalHint' : 'chUiInfoModalMessage');
    var listEl = document.getElementById(isRp ? 'rpValModalList' : 'chUiInfoModalList');
    var okBtn = document.getElementById(isRp ? 'rpValModalOk' : 'chUiInfoModalOk');
    if (titleEl) titleEl.textContent = title;
    if (hintEl) {
      hintEl.textContent = message;
      hintEl.style.display = message ? '' : 'none';
    }
    if (listEl) {
      if (items.length) {
        listEl.innerHTML = items.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join('');
        listEl.classList.remove('rp-hidden');
      } else {
        listEl.innerHTML = '';
        listEl.classList.add('rp-hidden');
      }
    }
    if (okBtn) okBtn.textContent = okLabel;
    modal.classList.remove('rp-hidden');
  }

  global.CariHubUiNotices = {
    showInfoModal: showInfoModal,
    hideInfoModal: hideInfoModal
  };
})(typeof window !== 'undefined' ? window : globalThis);
