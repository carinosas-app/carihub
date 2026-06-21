/**
 * Strip horizontal — anuncios canal mensajes (TICKET-047).
 * Datos vía DashAnunciosMensajes (canal independiente del perfil público).
 */
(function (global) {
  "use strict";

  var selectedAnuncioId = null;
  var lastFilterKey = "";

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function filterKey(filter) {
    return (filter && filter.contextoTipo) + ":" + (filter && filter.contextoId);
  }

  function paintDetail(anuncio) {
    var detail = global.document.getElementById("chatMsgAnunciosDetail");
    if (!detail) return;
    if (!anuncio) {
      detail.classList.add("hidden");
      detail.textContent = "";
      return;
    }
    detail.classList.remove("hidden");
    detail.innerHTML =
      "<strong>" +
      esc(anuncio.titulo) +
      "</strong>" +
      (anuncio.subtitulo ? " · " + esc(anuncio.subtitulo) : "") +
      (anuncio.conversacionId
        ? ' <button type="button" class="chat-msg-anuncios-strip__link" data-strip-open-conv="' +
          esc(anuncio.conversacionId) +
          '">Abrir chat</button>'
        : "");
  }

  function renderStripItems(anuncios, opts) {
    var strip = global.document.getElementById("chatMsgAnunciosStrip");
    var scroll = global.document.getElementById("chatMsgAnunciosStripScroll");
    if (!strip || !scroll) return;

    if (!anuncios.length) {
      strip.hidden = true;
      scroll.innerHTML = "";
      paintDetail(null);
      selectedAnuncioId = null;
      return;
    }

    strip.hidden = false;
    scroll.innerHTML = anuncios
      .map(function (a) {
        var sel = selectedAnuncioId === a.id ? " is-selected" : "";
        return (
          '<button type="button" class="chat-msg-anuncio-chip' +
          sel +
          '" role="listitem" data-anuncio-id="' +
          esc(a.id) +
          '"' +
          (a.conversacionId ? ' data-conversacion-id="' + esc(a.conversacionId) + '"' : "") +
          ' aria-pressed="' +
          (selectedAnuncioId === a.id ? "true" : "false") +
          '">' +
          '<span class="chat-msg-anuncio-chip__ring">' +
          '<img class="chat-msg-anuncio-chip__img" src="' +
          esc(a.img) +
          '" alt="">' +
          "</span>" +
          '<span class="chat-msg-anuncio-chip__label">' +
          esc(a.titulo) +
          "</span></button>"
        );
      })
      .join("");

    scroll.querySelectorAll(".chat-msg-anuncio-chip").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.dataset.anuncioId;
        var anuncio = anuncios.find(function (x) {
          return x.id === id;
        });
        scroll.querySelectorAll(".chat-msg-anuncio-chip.is-selected").forEach(function (el) {
          el.classList.remove("is-selected");
          el.setAttribute("aria-pressed", "false");
        });
        selectedAnuncioId = id;
        btn.classList.add("is-selected");
        btn.setAttribute("aria-pressed", "true");
        paintDetail(anuncio);
      });
    });

    var detail = global.document.getElementById("chatMsgAnunciosDetail");
    detail?.querySelectorAll("[data-strip-open-conv]").forEach(function (link) {
      link.addEventListener("click", function () {
        if (opts && typeof opts.onOpenConversacion === "function") {
          opts.onOpenConversacion(link.dataset.stripOpenConv);
        }
      });
    });
  }

  async function render(filter, opts) {
    opts = opts || {};
    var key = filterKey(filter);
    if (key !== lastFilterKey) {
      selectedAnuncioId = null;
      lastFilterKey = key;
    }
    var anuncios = [];
    if (global.DashAnunciosMensajes) {
      anuncios = await DashAnunciosMensajes.listarActivos(filter || {});
    }
    renderStripItems(anuncios, opts);
  }

  function clear() {
    var strip = global.document.getElementById("chatMsgAnunciosStrip");
    var scroll = global.document.getElementById("chatMsgAnunciosStripScroll");
    if (strip) strip.hidden = true;
    if (scroll) scroll.innerHTML = "";
    paintDetail(null);
    selectedAnuncioId = null;
    lastFilterKey = "";
  }

  global.DashMensajesStrip = {
    render: render,
    clear: clear,
  };
})(typeof window !== "undefined" ? window : globalThis);
