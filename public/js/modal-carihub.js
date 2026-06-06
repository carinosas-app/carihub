(function(){
  const ICONOS = {
    error: "❌",
    advertencia: "⚠️",
    info: "ℹ️",
    informacion: "ℹ️",
    confirmacion: "❓"
  };

  const SVG_EXITO_CARINOSAS = `
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="carihubExitoRosa" x1="10" y1="8" x2="54" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#ff7abd"/>
          <stop offset="0.48" stop-color="#ff3d9b"/>
          <stop offset="1" stop-color="#c91567"/>
        </linearGradient>
      </defs>
      <path fill="url(#carihubExitoRosa)" d="M32 55.5S9.5 43.1 9.5 25.1c0-7.7 5.5-13.4 12.7-13.4 4.2 0 7.7 2 9.8 5.2 2.1-3.2 5.6-5.2 9.8-5.2 7.2 0 12.7 5.7 12.7 13.4 0 18-22.5 30.4-22.5 30.4Z"/>
      <path fill="#fff" d="M31.9 21.1c-2.9 0-5.2 2.3-5.2 5.1 0 2.6 1.9 4.7 4.3 5.1-4.8.5-8.5 4.5-8.5 9.5v2.4h3.7v-2.4c0-3.2 2.5-5.8 5.7-5.8s5.7 2.6 5.7 5.8v2.4h3.7v-2.4c0-5-3.7-9-8.5-9.5 2.5-.4 4.4-2.5 4.4-5.1 0-2.8-2.3-5.1-5.3-5.1Z"/>
      <path fill="none" stroke="#fff" stroke-linecap="round" stroke-width="3.2" d="M24.5 47.1c3.9 2.5 10.8 2.6 14.9 0"/>
    </svg>
  `;

  function cerrarModal(overlay, resolver, valor){
    if(overlay._carihubManejarTecla){
      document.removeEventListener("keydown", overlay._carihubManejarTecla);
    }
    document.body.classList.remove("carihub-modal-abierto");
    overlay.remove();
    resolver(valor);
  }

  function crearModalCariHub(opciones){
    const config = opciones || {};
    const tipo = config.tipo || "info";

    return new Promise((resolver) => {
      const overlay = document.createElement("div");
      overlay.className = "carihub-modal-overlay";

      const modal = document.createElement("div");
      modal.className = "carihub-modal carihub-modal-" + tipo;
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");

      const icono = document.createElement("div");
      icono.className = "carihub-modal-icono";
      if(tipo === "exito"){
        icono.innerHTML = SVG_EXITO_CARINOSAS;
      } else {
        icono.textContent = ICONOS[tipo] || ICONOS.info;
      }

      const titulo = document.createElement("h2");
      titulo.className = "carihub-modal-titulo";
      titulo.textContent = config.titulo || "CariHub";

      const mensaje = document.createElement("p");
      mensaje.className = "carihub-modal-mensaje";
      mensaje.textContent = config.mensaje || "";

      modal.appendChild(icono);
      modal.appendChild(titulo);
      modal.appendChild(mensaje);

      if(config.detalle){
        const detalle = document.createElement("pre");
        detalle.className = "carihub-modal-detalle";
        detalle.textContent = config.detalle;
        modal.appendChild(detalle);
      }

      if(config.modo === "texto"){
        const campo = document.createElement("textarea");
        campo.className = "carihub-modal-textarea";
        campo.placeholder = config.placeholder || "";
        campo.rows = 4;
        modal.appendChild(campo);
      }

      const acciones = document.createElement("div");
      acciones.className = "carihub-modal-acciones";

      if(config.modo === "confirmar" || config.modo === "texto"){
        const cancelar = document.createElement("button");
        cancelar.type = "button";
        cancelar.className = "carihub-modal-btn carihub-modal-btn-secundario";
        cancelar.textContent = config.textoCancelar || "Cancelar";
        cancelar.addEventListener("click", () => cerrarModal(overlay, resolver, config.modo === "texto" ? null : false));
        acciones.appendChild(cancelar);
      }

      const aceptar = document.createElement("button");
      aceptar.type = "button";
      aceptar.className = "carihub-modal-btn carihub-modal-btn-principal";
      aceptar.textContent = config.textoConfirmar || config.textoBoton || "Aceptar";
      aceptar.addEventListener("click", () => {
        if(config.modo === "texto"){
          const campo = modal.querySelector(".carihub-modal-textarea");
          const valor = campo.value.trim();
          if(config.requerido && !valor){
            campo.classList.add("carihub-modal-campo-error");
            campo.focus();
            return;
          }
          cerrarModal(overlay, resolver, valor || null);
          return;
        }

        cerrarModal(overlay, resolver, config.modo === "confirmar" ? true : undefined);
      });
      acciones.appendChild(aceptar);

      modal.appendChild(acciones);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
      document.body.classList.add("carihub-modal-abierto");

      const focoInicial = modal.querySelector(".carihub-modal-textarea") || aceptar;
      focoInicial.focus();

      function manejarTecla(evento){
        if(evento.key !== "Escape") return;
        if(config.modo === "confirmar" || config.modo === "texto"){
          cerrarModal(overlay, resolver, config.modo === "texto" ? null : false);
        } else {
          cerrarModal(overlay, resolver, undefined);
        }
      }

      overlay._carihubManejarTecla = manejarTecla;
      document.addEventListener("keydown", manejarTecla);
    });
  }

  window.mostrarModalCariHub = function(opciones){
    return crearModalCariHub({
      tipo: opciones?.tipo || "info",
      titulo: opciones?.titulo || "CariHub",
      mensaje: opciones?.mensaje || "",
      detalle: opciones?.detalle || "",
      textoBoton: opciones?.textoBoton || "Aceptar"
    });
  };

  window.confirmarModalCariHub = function(opciones){
    return crearModalCariHub({
      modo: "confirmar",
      tipo: opciones?.tipo || "confirmacion",
      titulo: opciones?.titulo || "Confirmar",
      mensaje: opciones?.mensaje || "",
      detalle: opciones?.detalle || "",
      textoConfirmar: opciones?.textoConfirmar || "Confirmar",
      textoCancelar: opciones?.textoCancelar || "Cancelar"
    });
  };

  window.pedirTextoModalCariHub = function(opciones){
    return crearModalCariHub({
      modo: "texto",
      tipo: opciones?.tipo || "info",
      titulo: opciones?.titulo || "CariHub",
      mensaje: opciones?.mensaje || "",
      placeholder: opciones?.placeholder || "",
      requerido: opciones?.requerido === true,
      textoConfirmar: opciones?.textoConfirmar || "Aceptar",
      textoCancelar: opciones?.textoCancelar || "Cancelar"
    });
  };
})();
