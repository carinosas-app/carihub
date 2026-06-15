/**
 * Botones rápidos (Registrarse, Categoría, País, Estado, Ciudad) + cerrar (×).
 * En perfil: barra profile-toolbar entre header y galería.
 */
(function (global) {
  var QUICK = [
    { icon: "user", label: "Registrarse", abrir: "registro" },
    { icon: "briefcase", label: "Categoría", abrir: "categoria" },
    { icon: "globe", label: "País", abrir: "pais" },
    { icon: "pin", label: "Estado", abrir: "estado" },
    { icon: "pin", label: "Ciudad", abrir: "ciudad" }
  ];

  function isPreviewPath() {
    return (window.location.pathname || "").indexOf("/preview/") >= 0;
  }

  function indexHref(abrir) {
    var base = isPreviewPath() ? "../index.html" : "index.html";
    return abrir ? base + "?abrir=" + encodeURIComponent(abrir) : base;
  }

  function resultadosHref() {
    return isPreviewPath() ? "../resultados.html" : "resultados.html";
  }

  function resultadosHrefFromQuery(q) {
    q = q || {};
    var base = resultadosHref();
    var params = new URLSearchParams();
    if (q.categoria) params.set("categoria", q.categoria);
    if (q.pais) params.set("pais", q.pais);
    if (q.estado) params.set("estado", q.estado);
    if (q.ciudad) params.set("ciudad", q.ciudad);
    if (q.vista === "con-resultados" || q.vista === "con-resultados-4" || q.vista === "sin-resultados") {
      params.set("vista", q.vista);
    } else if (q.resVista === "con-resultados" || q.resVista === "con-resultados-4" || q.resVista === "sin-resultados") {
      params.set("vista", q.resVista);
    }
    var qs = params.toString();
    return qs ? base + "?" + qs : base;
  }

  function perfilQueryFromPage() {
    if (global.CariHubPerfilPublico && CariHubPerfilPublico.queryPerfilPublico) {
      return CariHubPerfilPublico.queryPerfilPublico();
    }
    try {
      var p = new URL(global.location.href).searchParams;
      return {
        categoria: p.get("categoria") || "",
        pais: p.get("pais") || "",
        estado: p.get("estado") || "",
        ciudad: p.get("ciudad") || "",
        vista: p.get("vista") || "",
        resVista: p.get("resVista") || ""
      };
    } catch (e) {
      return { categoria: "", pais: "", estado: "", ciudad: "", vista: "", resVista: "" };
    }
  }

  function closeHref(context) {
    if (context === "resultados") return indexHref();
    if (context === "perfil") return resultadosHrefFromQuery(perfilQueryFromPage());
    return indexHref();
  }

  function closeButtonHTML(context, extraClass) {
    var cls = "ch-nav-close" + (extraClass ? " " + extraClass : "");
    var href = closeHref(context || "perfil");
    var label = context === "resultados" ? "Volver al inicio" : "Volver a resultados";
    return (
      '<a class="' + cls + '" href="' + href + '" aria-label="' + label + '" title="' + label + '">×</a>'
    );
  }

  function quickHref(abrir) {
    return indexHref(abrir);
  }

  function quickItemsHTML(opts) {
    opts = opts || {};
    var itemCls = opts.itemClass || "pcrumb__quick-btn";
    var icCls = opts.iconClass || "pcrumb__quick-ic";
    var labelCls = opts.labelClass || "pcrumb__quick-label";
    return QUICK.map(function (q) {
      return (
        '<a class="' + itemCls + '" href="' + quickHref(q.abrir) + '">' +
        '<span class="' + icCls + '">' + (opts.renderIcon ? opts.renderIcon(q.icon) : "") + "</span>" +
        '<span class="' + labelCls + '">' + q.label + "</span></a>"
      );
    }).join("");
  }

  function quickBarHTML(opts) {
    opts = opts || {};
    var backHref = opts.backHref || indexHref();
    var backLabel = opts.backLabel || "Volver al inicio";
    var backArrow = opts.backArrow || "←";
    return (
      '<div class="ch-quickbar">' +
      '<a class="ch-quickbar__back" href="' + backHref + '">' + backArrow + " " + backLabel + "</a>" +
      '<div class="ch-quickbar__center">' +
      quickItemsHTML({
        itemClass: "ch-quickbar__btn",
        iconClass: "ch-quickbar__ic",
        labelClass: "ch-quickbar__label",
        renderIcon: opts.renderIcon || renderEmojiIcon
      }) +
      "</div>" +
      '<div class="ch-quickbar__end"></div>' +
      "</div>"
    );
  }

  function injectResultadosQuickBar() {
    var brandbar = document.querySelector(".brandbar");
    if (!brandbar || document.getElementById("chQuickbar")) return;
    var bar = document.createElement("div");
    bar.id = "chQuickbar";
    bar.innerHTML = quickBarHTML({
      backHref: indexHref(),
      backLabel: "Volver al inicio",
      renderIcon: renderEmojiIcon
    });
    brandbar.insertAdjacentElement("afterend", bar);
    if (!brandbar.querySelector(".ch-nav-close")) {
      brandbar.classList.add("brandbar--with-close");
      brandbar.insertAdjacentHTML("afterbegin", closeButtonHTML("resultados"));
    }
  }

  function renderEmojiIcon(name) {
    var m = {
      user: "👤",
      briefcase: "📂",
      globe: "🌎",
      pin: "📍"
    };
    return '<span aria-hidden="true">' + (m[name] || "•") + "</span>";
  }

  global.CariHubNavQuick = {
    QUICK: QUICK,
    indexHref: indexHref,
    resultadosHref: resultadosHref,
    resultadosHrefFromQuery: resultadosHrefFromQuery,
    closeHref: closeHref,
    closeButtonHTML: closeButtonHTML,
    quickItemsHTML: quickItemsHTML,
    quickBarHTML: quickBarHTML,
    injectResultadosQuickBar: injectResultadosQuickBar
  };
})(typeof window !== "undefined" ? window : globalThis);
