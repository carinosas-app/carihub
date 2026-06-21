/**
 * Modal reportar conversación / mensaje (MSG-080).
 */
(function (global) {
  'use strict';

  var mounted = false;

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function schema() {
    return global.CariHubMessengerReportesSchema;
  }

  function ensureModal() {
    if (mounted || !global.document) return;
    var Rs = schema();
    if (!Rs) return;
    var motivoOpts = Rs.MOTIVOS
      .map(function (m) {
        return '<option value="' + esc(m) + '">' + esc(Rs.MOTIVO_LABELS[m] || m) + '</option>';
      })
      .join('');
    var wrap = global.document.createElement('div');
    wrap.id = 'chReportModal';
    wrap.className = 'ch-report-modal';
    wrap.hidden = true;
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-labelledby', 'chReportModalTitle');
    wrap.innerHTML =
      '<div class="ch-report-modal__backdrop" data-ch-report-close></div>' +
      '<div class="ch-report-modal__panel">' +
      '<button type="button" class="ch-report-modal__close" data-ch-report-close aria-label="Cerrar">&times;</button>' +
      '<h3 class="ch-report-modal__title" id="chReportModalTitle">Reportar en Messenger</h3>' +
      '<p class="ch-report-modal__lead" id="chReportModalLead"></p>' +
      '<label class="ch-report-modal__field">' +
      '<span>Tipo de reporte</span>' +
      '<select id="chReportTipo">' +
      '<option value="reportar_conversacion">Reportar conversación</option>' +
      '<option value="reportar_mensaje">Reportar último mensaje recibido</option>' +
      '</select></label>' +
      '<label class="ch-report-modal__field">' +
      '<span>Motivo</span>' +
      '<select id="chReportMotivo">' +
      motivoOpts +
      '</select></label>' +
      '<label class="ch-report-modal__field">' +
      '<span>Detalle (opcional)</span>' +
      '<textarea id="chReportDetalle" rows="3" maxlength="2000" placeholder="Describe brevemente el problema…"></textarea>' +
      '</label>' +
      '<p class="ch-report-modal__hint">El equipo revisará el hilo en el contexto de esta publicación. No compartas datos privados aquí.</p>' +
      '<div class="ch-report-modal__actions">' +
      '<button type="button" class="btn btn-enviar" id="chReportEnviar">Enviar reporte</button>' +
      '<button type="button" class="btn btn-atras" data-ch-report-close>Cancelar</button>' +
      '</div></div>';
    global.document.body.appendChild(wrap);
    mounted = true;
  }

  function closeModal() {
    var modal = global.document.getElementById('chReportModal');
    if (!modal) return;
    modal.hidden = true;
    if (!global.document.querySelector('.home-modal.is-open')) {
      global.document.body.style.overflow = '';
    }
  }

  function abrir(opts) {
    opts = opts || {};
    ensureModal();
    var modal = global.document.getElementById('chReportModal');
    if (!modal || !global.CariHubMessengerReportes) {
      return Promise.reject(new Error('Reportes no disponibles.'));
    }
    var lead = global.document.getElementById('chReportModalLead');
    var tipoSel = global.document.getElementById('chReportTipo');
    var motivoSel = global.document.getElementById('chReportMotivo');
    var detalleEl = global.document.getElementById('chReportDetalle');
    var enviarBtn = global.document.getElementById('chReportEnviar');
    if (!tipoSel || !motivoSel || !enviarBtn) {
      return Promise.reject(new Error('Modal de reporte incompleto.'));
    }

    var conversacionId = String(opts.conversacionId || '');
    if (!conversacionId) return Promise.reject(new Error('No hay conversación activa.'));

    if (lead) {
      lead.textContent = opts.lead ||
        ('Reporte sobre ' + (opts.contraparteNombre || 'este contacto') + ' en contexto ' + (opts.contextoId || 'perfil') + '.');
    }
    tipoSel.value = opts.tipoDefault === 'reportar_mensaje' ? 'reportar_mensaje' : 'reportar_conversacion';
    if (opts.soloConversacion) {
      tipoSel.value = 'reportar_conversacion';
      tipoSel.disabled = true;
    } else {
      tipoSel.disabled = false;
    }
    motivoSel.value = 'contenido_inapropiado';
    if (detalleEl) detalleEl.value = '';

    modal.hidden = false;
    global.document.body.style.overflow = 'hidden';

    modal.querySelectorAll('[data-ch-report-close]').forEach(function (el) {
      el.onclick = closeModal;
    });

    return new Promise(function (resolve, reject) {
      enviarBtn.onclick = function () {
        enviarBtn.disabled = true;
        enviarBtn.textContent = 'Enviando…';
        global.CariHubMessengerReportes.crearReporte({
          tipo: tipoSel.value,
          conversacionId: conversacionId,
          mensajeId: opts.mensajeId || undefined,
          motivo: motivoSel.value,
          detalle: detalleEl ? detalleEl.value : ''
        })
          .then(function (result) {
            closeModal();
            enviarBtn.disabled = false;
            enviarBtn.textContent = 'Enviar reporte';
            resolve(result);
          })
          .catch(function (err) {
            enviarBtn.disabled = false;
            enviarBtn.textContent = 'Enviar reporte';
            if (global.alert) global.alert((err && err.message) || 'No se pudo enviar el reporte.');
            reject(err);
          });
      };
    });
  }

  global.CariHubMessengerReportesUI = {
    abrir: abrir,
    close: closeModal
  };
})(typeof window !== 'undefined' ? window : globalThis);
