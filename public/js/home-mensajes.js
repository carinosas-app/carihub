/**
 * Mensajes internos desde home — modal, intención y Messenger Firestore (MSG-040 / MSG-056).
 */
(function (global) {
  'use strict';

  var STORAGE_INTENT = 'chMensajesIntencion';
  var threadUnsub = null;
  var activeConversacion = null;

  function authUser() {
    if (global.auth && global.auth.currentUser) return global.auth.currentUser;
    if (global.CariHubAuth && CariHubAuth.currentUser) return CariHubAuth.currentUser;
    if (global.firebase && firebase.auth) return firebase.auth().currentUser;
    return null;
  }

  function puedeEnviar() {
    if (typeof global.usuarioCuentaAutenticada === 'function') {
      return global.usuarioCuentaAutenticada();
    }
    var user = authUser();
    return !!(user && !user.isAnonymous);
  }

  function escHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function guardarIntencion(data) {
    try {
      global.sessionStorage.setItem(STORAGE_INTENT, JSON.stringify(data));
    } catch (e) { /* opcional */ }
  }

  function leerIntencion() {
    try {
      var raw = global.sessionStorage.getItem(STORAGE_INTENT);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function limpiarIntencion() {
    try { global.sessionStorage.removeItem(STORAGE_INTENT); } catch (e) { /* noop */ }
  }

  function mensajePredeterminado(nombre) {
    var n = nombre || 'tu perfil';
    return 'Hola ' + n + ', vi tu perfil en Cariñosas y me gustaría contactarte por mensaje interno.';
  }

  function resolverPerfilDemo(id) {
    if (global.CariHubResultadosDemo && CariHubResultadosDemo.perfilPorId) {
      return CariHubResultadosDemo.perfilPorId(id, {});
    }
    return null;
  }

  function resolverPerfilDestino(id) {
    id = String(id || '').trim();
    if (!id) return Promise.resolve({ id: '', nombre: '' });

    if (global.CariHubHomeMessenger && CariHubHomeMessenger.resolverContextoDestino) {
      return CariHubHomeMessenger.resolverContextoDestino(id).then(function (ctx) {
        if (!ctx) {
          return { id: id, nombre: id };
        }
        return {
          id: id,
          nombre: ctx.nombre || id,
          cuentaUid: ctx.cuentaUid,
          contextoTipo: ctx.contextoTipo,
          contextoId: ctx.contextoId,
          demo: ctx.demo
        };
      });
    }

    var demo = resolverPerfilDemo(id);
    if (demo && demo.nombre) {
      return Promise.resolve({ id: id, nombre: demo.nombre, demo: true });
    }

    var db = global.CariHubDB || (global.firebase && firebase.firestore && firebase.firestore());
    if (!db || /^demo-/i.test(id)) {
      return Promise.resolve({ id: id, nombre: id.replace(/^demo-/i, '').replace(/-/g, ' ') || id });
    }

    return db.collection('usuarios').doc(id).get()
      .then(function (doc) {
        if (doc.exists) {
          var d = doc.data() || {};
          return { id: id, nombre: d.nombre || id };
        }
        return { id: id, nombre: id };
      })
      .catch(function () {
        return { id: id, nombre: id };
      });
  }

  function cerrarModalMensajes() {
    if (threadUnsub) {
      threadUnsub();
      threadUnsub = null;
    }
    activeConversacion = null;
    var modal = global.document.getElementById('modal-mensajes');
    if (!modal) return;
    modal.classList.remove('is-open');
    if (!global.document.querySelector('.home-modal.is-open')) {
      global.document.body.style.overflow = '';
    }
  }

  function estadoActual(opts) {
    opts = opts || {};
    if (opts.registrado != null) return opts.registrado;
    if (global.document.body.getAttribute('data-mock-usuario') === 'registrado') return true;
    return puedeEnviar();
  }

  function ocultarCompose() {
    var compose = global.document.getElementById('modalMensajesCompose');
    if (compose) compose.hidden = true;
  }

  function mostrarCompose() {
    var compose = global.document.getElementById('modalMensajesCompose');
    if (compose) compose.hidden = false;
  }

  function renderInboxAcciones() {
    var actions = global.document.getElementById('modalMensajesActions');
    if (!actions) return;
    actions.innerHTML =
      '<button type="button" class="btn btn-atras" id="modalMensajesCerrarInbox">Cerrar</button>';
    var cerrar = global.document.getElementById('modalMensajesCerrarInbox');
    if (cerrar) cerrar.addEventListener('click', cerrarModalMensajes);
  }

  function renderInbox() {
    var title = global.document.getElementById('modal-mensajes-title');
    var lead = global.document.getElementById('modalMensajesLead');
    var body = global.document.getElementById('modalMensajesBody');
    ocultarCompose();

    if (title) title.textContent = 'Mis mensajes';
    if (lead) lead.textContent = 'Conversaciones separadas por perfil o anuncio publicado.';
    if (body) {
      body.innerHTML =
        '<div class="home-mensajes-inbox" id="homeMensajesInboxList">' +
        '<p class="home-mensajes-hint">Cargando conversaciones…</p></div>';
    }
    renderInboxAcciones();

    if (!global.CariHubHomeMessenger || !CariHubHomeMessenger.listConversacionesVisitanteUi) {
      var list = global.document.getElementById('homeMensajesInboxList');
      if (list) list.innerHTML = '<p>No hay conversaciones todavía.</p>';
      return;
    }

    CariHubHomeMessenger.listConversacionesVisitanteUi().then(function (rows) {
      var list = global.document.getElementById('homeMensajesInboxList');
      if (!list) return;
      if (!rows.length) {
        list.innerHTML =
          '<p><b>No tienes conversaciones todavía.</b></p>' +
          '<p class="home-mensajes-hint">Contacta un perfil con el botón de mensaje interno para iniciar un hilo.</p>';
        return;
      }
      list.innerHTML = rows
        .map(function (row) {
          var badge =
            row.unread > 0
              ? '<span class="home-mensajes-inbox__badge">' + row.unread + '</span>'
              : '';
          return (
            '<button type="button" class="home-mensajes-inbox__row" data-conv-id="' +
            escHtml(row.id) +
            '">' +
            '<span class="home-mensajes-inbox__top">' +
            '<strong>' +
            escHtml(row.nombre) +
            '</strong>' +
            '<span class="home-mensajes-inbox__hora">' +
            escHtml(row.hora) +
            '</span>' +
            badge +
            '</span>' +
            '<span class="home-mensajes-inbox__ctx">' +
            escHtml(row.contextoId || '') +
            '</span>' +
            '<span class="home-mensajes-inbox__preview">' +
            escHtml(row.ultimo || 'Sin mensajes') +
            '</span>' +
            '</button>'
          );
        })
        .join('');

      list.querySelectorAll('[data-conv-id]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var id = btn.getAttribute('data-conv-id');
          var row = rows.find(function (r) {
            return r.id === id;
          });
          if (row) abrirHilo(row);
        });
      });
    });
  }

  function aplicarEstadoBloqueoVisitante(conv) {
    if (!conv || !global.CariHubMessengerBloqueos || !puedeEnviar()) return;
    var user = authUser();
    if (!user) return;
    var otro = conv.cuentaUid;
    CariHubMessengerBloqueos.bloqueoEntre(user.uid, otro).then(function (bloqueado) {
      var textarea = global.document.getElementById('modalMensajesTexto');
      var enviar = global.document.getElementById('modalMensajesThreadEnviar');
      if (textarea) textarea.disabled = bloqueado;
      if (enviar) enviar.disabled = bloqueado;
      var blockBtn = global.document.getElementById('modalMensajesThreadBloquear');
      if (blockBtn) {
        CariHubMessengerBloqueos.yoBloqueo(user.uid, otro).then(function (yo) {
          blockBtn.textContent = yo ? 'Desbloquear' : 'Bloquear';
        });
      }
    });
  }

  function toggleBloqueoVisitante(conv) {
    conv = conv || activeConversacion;
    if (!conv || !conv.id) return;
    if (!puedeEnviar()) {
      global.alert('Inicia sesión para bloquear usuarios.');
      return;
    }
    if (!global.CariHubMessengerBloqueos) return;
    var user = authUser();
    var otro = conv.cuentaUid;
    CariHubMessengerBloqueos.yoBloqueo(user.uid, otro).then(function (yo) {
      if (yo) {
        if (!global.confirm('¿Desbloquear a ' + (conv.nombre || 'este anunciante') + '?')) return;
        return CariHubMessengerBloqueos.desbloquear(otro).then(function () {
          global.alert('Usuario desbloqueado.');
          aplicarEstadoBloqueoVisitante(conv);
        });
      }
      if (
        !global.confirm(
          '¿Bloquear a ' +
            (conv.nombre || 'este anunciante') +
            '? No podrán enviarte mensajes en Messenger.'
        )
      ) {
        return;
      }
      return CariHubMessengerBloqueos.bloquear({ conversacionId: conv.id }).then(function () {
        global.alert('Usuario bloqueado.');
        aplicarEstadoBloqueoVisitante(conv);
      });
    }).catch(function (err) {
      global.alert((err && err.message) || 'No se pudo completar la acción.');
    });
  }

  function abrirReporteVisitante(conv) {
    conv = conv || activeConversacion;
    if (!conv || !conv.id) return;
    if (!puedeEnviar()) {
      global.alert('Inicia sesión para enviar un reporte.');
      return;
    }
    if (!global.CariHubMessengerReportesUI || !CariHubMessengerReportesUI.abrir) {
      global.alert('Reportes no disponibles.');
      return;
    }
    CariHubMessengerReportesUI.abrir({
      conversacionId: conv.id,
      contraparteNombre: conv.nombre || 'anunciante',
      contextoId: conv.contextoId || ''
    }).then(function () {
      global.alert('Reporte enviado. Revisaremos este hilo en el contexto del perfil.');
    }).catch(function () { /* alert en UI */ });
  }

  function renderThreadAcciones(conv) {
    var actions = global.document.getElementById('modalMensajesActions');
    if (!actions) return;
    actions.innerHTML =
      '<button type="button" class="btn btn-enviar" id="modalMensajesThreadEnviar">Enviar</button>' +
      '<button type="button" class="btn btn-continuar" id="modalMensajesThreadReportar">Reportar</button>' +
      '<button type="button" class="btn btn-continuar" id="modalMensajesThreadBloquear">Bloquear</button>' +
      '<button type="button" class="btn btn-atras" id="modalMensajesThreadVolver">Volver</button>';
    var volver = global.document.getElementById('modalMensajesThreadVolver');
    if (volver) {
      volver.addEventListener('click', function () {
        if (threadUnsub) {
          threadUnsub();
          threadUnsub = null;
        }
        renderInbox();
      });
    }
    var enviar = global.document.getElementById('modalMensajesThreadEnviar');
    if (enviar) {
      enviar.addEventListener('click', function () {
        enviarEnHilo(conv);
      });
    }
    var reportar = global.document.getElementById('modalMensajesThreadReportar');
    if (reportar) {
      reportar.addEventListener('click', function () {
        abrirReporteVisitante(conv);
      });
    }
    var bloquear = global.document.getElementById('modalMensajesThreadBloquear');
    if (bloquear) {
      bloquear.addEventListener('click', function () {
        toggleBloqueoVisitante(conv);
      });
    }
    aplicarEstadoBloqueoVisitante(conv);
  }

  function pintarBurbujas(rows) {
    var thread = global.document.getElementById('homeMensajesThread');
    if (!thread) return;
    if (!rows.length) {
      thread.innerHTML = '<p class="home-mensajes-hint">Sin mensajes en este hilo.</p>';
      return;
    }
    thread.innerHTML = rows
      .map(function (b) {
        return (
          '<div class="home-mensajes-bubble home-mensajes-bubble--' +
          escHtml(b.from) +
          '">' +
          '<p>' +
          escHtml(b.text) +
          '</p>' +
          '<time>' +
          escHtml(b.time) +
          '</time>' +
          '</div>'
        );
      })
      .join('');
    thread.scrollTop = thread.scrollHeight;
  }

  function abrirHilo(conv) {
    conv = conv || activeConversacion;
    if (!conv || !conv.id) return;
    activeConversacion = conv;

    if (threadUnsub) {
      threadUnsub();
      threadUnsub = null;
    }

    var title = global.document.getElementById('modal-mensajes-title');
    var lead = global.document.getElementById('modalMensajesLead');
    var body = global.document.getElementById('modalMensajesBody');
    ocultarCompose();
    mostrarCompose();

    if (title) title.textContent = conv.nombre || 'Conversación';
    if (lead) {
      lead.textContent =
        'Contexto: ' + (conv.contextoId || conv.contextoTipo || 'perfil');
    }
    if (body) {
      body.innerHTML =
        '<div class="home-mensajes-thread" id="homeMensajesThread">' +
        '<p class="home-mensajes-hint">Cargando mensajes…</p></div>';
    }

    var textarea = global.document.getElementById('modalMensajesTexto');
    if (textarea) {
      textarea.value = '';
      textarea.placeholder = 'Escribe tu respuesta…';
      textarea.disabled = false;
    }

    renderThreadAcciones(conv);

    if (global.CariHubHomeMessenger && CariHubHomeMessenger.markReadVisitante) {
      CariHubHomeMessenger.markReadVisitante(conv.id);
    }

    if (global.CariHubHomeMessenger && CariHubHomeMessenger.subscribeMensajesVisitante) {
      threadUnsub = CariHubHomeMessenger.subscribeMensajesVisitante(conv.id, pintarBurbujas);
      return;
    }

    if (global.CariHubHomeMessenger && CariHubHomeMessenger.listMensajesVisitanteUi) {
      CariHubHomeMessenger.listMensajesVisitanteUi(conv.id).then(pintarBurbujas);
    }
  }

  function enviarEnHilo(conv) {
    conv = conv || activeConversacion;
    if (!conv || !conv.id) return;
    var texto = textoMensaje();
    if (!texto) {
      global.alert('Escribe un mensaje antes de enviar.');
      return;
    }
    if (!puedeEnviar()) {
      global.alert('Inicia sesión para enviar mensajes.');
      return;
    }
    var btn = global.document.getElementById('modalMensajesThreadEnviar');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Enviando…';
    }
    if (!global.CariHubHomeMessenger || !CariHubHomeMessenger.sendMensajeVisitante) {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Enviar';
      }
      global.alert('Messenger no disponible.');
      return;
    }
    CariHubHomeMessenger.sendMensajeVisitante(conv.id, texto)
      .then(function () {
        var textarea = global.document.getElementById('modalMensajesTexto');
        if (textarea) textarea.value = '';
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Enviar';
        }
      })
      .catch(function (err) {
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Enviar';
        }
        global.alert((err && err.message) || 'No se pudo enviar el mensaje.');
      });
  }

  function directoryBlocksMessaging() {
    return !!(global.CarihubDirectoryMode && global.CarihubDirectoryMode.isDirectoryMode());
  }

  function abrirInbox() {
    if (directoryBlocksMessaging()) return;
    var modal = global.document.getElementById('modal-mensajes');
    if (!modal) return;
    if (!puedeEnviar()) {
      abrir({});
      return;
    }
    renderInbox();
    modal.classList.add('is-open');
    global.document.body.style.overflow = 'hidden';
  }

  function renderAcciones(registrado, perfil) {
    var actions = global.document.getElementById('modalMensajesActions');
    if (!actions) return;

    if (registrado) {
      actions.innerHTML =
        '<button type="button" class="btn btn-enviar" id="modalMensajesEnviar">Enviar mensaje</button>' +
        '<button type="button" class="btn btn-continuar" id="modalMensajesMisChats">Mis conversaciones</button>' +
        '<button type="button" class="btn btn-atras" id="modalMensajesCancelar">Cancelar</button>';
    } else {
      actions.innerHTML =
        '<button type="button" class="btn btn-enviar" id="modalMensajesLogin">Iniciar sesión para enviar</button>' +
        '<button type="button" class="btn btn-continuar" id="modalMensajesRegistro">Crear cuenta gratis</button>' +
        '<button type="button" class="btn btn-atras" id="modalMensajesCancelar">Cancelar</button>';
    }

    var cancelar = global.document.getElementById('modalMensajesCancelar');
    if (cancelar) cancelar.addEventListener('click', cerrarModalMensajes);

    var enviar = global.document.getElementById('modalMensajesEnviar');
    if (enviar) {
      enviar.addEventListener('click', function () {
        enviarMensaje(perfil);
      });
    }

    var misChats = global.document.getElementById('modalMensajesMisChats');
    if (misChats) {
      misChats.addEventListener('click', function () {
        renderInbox();
      });
    }

    var login = global.document.getElementById('modalMensajesLogin');
    if (login) {
      login.addEventListener('click', function () {
        irALogin(perfil);
      });
    }

    var registro = global.document.getElementById('modalMensajesRegistro');
    if (registro) {
      registro.addEventListener('click', function () {
        irARegistro(perfil);
      });
    }
  }

  function renderModal(perfil, opts) {
    opts = opts || {};
    perfil = perfil || { id: '', nombre: '' };
    var registrado = estadoActual(opts);

    var lead = global.document.getElementById('modalMensajesLead');
    var body = global.document.getElementById('modalMensajesBody');
    var compose = global.document.getElementById('modalMensajesCompose');
    var textarea = global.document.getElementById('modalMensajesTexto');
    var title = global.document.getElementById('modal-mensajes-title');

    if (title) {
      title.textContent = perfil.nombre
        ? ('Mensaje a ' + perfil.nombre)
        : 'Comunícate por mensajes internos';
    }

    if (lead) {
      lead.textContent = perfil.nombre
        ? ('Escribe a ' + perfil.nombre + ' de forma privada dentro de Cariñosas.')
        : (registrado
          ? 'Ya puedes enviar mensajes internos.'
          : 'Regístrate para contactar por mensajes internos.');
    }

    if (body) {
      if (registrado) {
        body.innerHTML = '<p>Tu mensaje llegará al anunciante en el contexto de <strong>este perfil</strong>. Cada perfil publicado mantiene conversaciones separadas.</p>';
      } else {
        body.innerHTML =
          '<p>Al crear tu cuenta podrás comunicarte por mensajes internos con perfiles dentro de Cariñosas, sin salir de la plataforma.</p>' +
          '<p><strong>Los visitantes sin registro no pueden enviar mensajes.</strong></p>';
      }
    }

    if (compose) compose.hidden = false;
    if (textarea) {
      textarea.value = opts.texto || mensajePredeterminado(perfil.nombre);
      textarea.placeholder = 'Escribe tu mensaje…';
      textarea.disabled = !registrado && !perfil.id;
    }

    renderAcciones(registrado, perfil);
  }

  function textoMensaje() {
    var el = global.document.getElementById('modalMensajesTexto');
    return el ? String(el.value || '').trim() : '';
  }

  function mostrarEnvioOk(perfil, result) {
    var body = global.document.getElementById('modalMensajesBody');
    if (body) {
      var ctxNote = result && result.contextoId
        ? ' Contexto: <span class="muted">' + escHtml(result.contextoId) + '</span>.'
        : '';
      body.innerHTML =
        '<p><strong>Mensaje enviado.</strong></p>' +
        '<p>Tu mensaje para <strong>' + escHtml(perfil.nombre || perfil.id) + '</strong> fue entregado.' + ctxNote + '</p>';
    }

    var compose = global.document.getElementById('modalMensajesCompose');
    if (compose) compose.hidden = true;

    var actions = global.document.getElementById('modalMensajesActions');
    if (actions) {
      actions.innerHTML = '<button type="button" class="btn btn-continuar" id="modalMensajesOk">Entendido</button>';
      var ok = global.document.getElementById('modalMensajesOk');
      if (ok) ok.addEventListener('click', cerrarModalMensajes);
    }
  }

  function enviarMensaje(perfil) {
    perfil = perfil || {};
    var texto = textoMensaje();
    if (!texto) {
      global.alert('Escribe un mensaje antes de enviar.');
      return;
    }
    if (!perfil.id) {
      global.alert('No se identificó el perfil destino.');
      return;
    }
    if (!puedeEnviar()) {
      irALogin(perfil);
      return;
    }

    var enviarBtn = global.document.getElementById('modalMensajesEnviar');
    if (enviarBtn) {
      enviarBtn.disabled = true;
      enviarBtn.textContent = 'Enviando…';
    }

    function onError(err) {
      if (enviarBtn) {
        enviarBtn.disabled = false;
        enviarBtn.textContent = 'Enviar mensaje';
      }
      global.alert((err && err.message) || 'No se pudo enviar el mensaje.');
    }

    if (global.CariHubHomeMessenger && CariHubHomeMessenger.enviarDesdePerfil) {
      global.CariHubHomeMessenger.enviarDesdePerfil(perfil.id, texto, {
        perfilId: perfil.contextoId,
        cuentaUid: perfil.cuentaUid
      })
        .then(function (result) {
          limpiarIntencion();
          mostrarEnvioOk(perfil, result);
        })
        .catch(onError);
      return;
    }

    onError(new Error('Messenger no disponible. Recarga la página o intenta más tarde.'));
  }

  function irALogin(perfil) {
    guardarIntencion({
      perfil: perfil.id || '',
      nombre: perfil.nombre || '',
      texto: textoMensaje() || mensajePredeterminado(perfil.nombre),
      ts: Date.now(),
      reanudar: true
    });
    if (global.CariHubHomeIntenciones && CariHubHomeIntenciones.marcarReanudar) {
      CariHubHomeIntenciones.marcarReanudar('mensajes');
    }
    cerrarModalMensajes();
    if (typeof global.abrirMiPerfil === 'function') {
      global.abrirMiPerfil();
      return;
    }
    if (typeof global.abrirCuentaPersonal === 'function') {
      global.abrirCuentaPersonal();
    }
  }

  function irARegistro(perfil) {
    guardarIntencion({
      perfil: perfil.id || '',
      nombre: perfil.nombre || '',
      texto: textoMensaje() || mensajePredeterminado(perfil.nombre),
      ts: Date.now(),
      reanudar: true
    });
    if (global.CariHubHomeIntenciones && CariHubHomeIntenciones.marcarReanudar) {
      CariHubHomeIntenciones.marcarReanudar('mensajes');
    }
    cerrarModalMensajes();
    if (typeof global.abrirCuentaPersonal === 'function') {
      global.abrirCuentaPersonal();
      return;
    }
    if (typeof global.abrirMiPerfil === 'function') {
      global.abrirMiPerfil();
    }
  }

  function abrir(opts) {
    if (directoryBlocksMessaging()) return;
    opts = opts || {};
    var modal = global.document.getElementById('modal-mensajes');
    if (!modal) return;

    var perfilId = String(opts.perfil || '').trim();
    resolverPerfilDestino(perfilId).then(function (perfil) {
      renderModal(perfil, {
        registrado: opts.registrado,
        texto: opts.texto || (leerIntencion() && leerIntencion().texto) || ''
      });
      modal.classList.add('is-open');
      global.document.body.style.overflow = 'hidden';
      var textarea = global.document.getElementById('modalMensajesTexto');
      if (textarea) textarea.focus();
    });
  }

  function abrirDesdeQuery(params) {
    if (directoryBlocksMessaging()) return;
    params = params || new URLSearchParams(global.location.search);
    var perfil = params.get('perfil') || '';
    var convId = params.get('conv') || '';
    if (!perfil && convId && puedeEnviar() && global.CariHubHomeMessenger) {
      abrirInbox();
      CariHubHomeMessenger.listConversacionesVisitanteUi().then(function (rows) {
        var row = rows.find(function (r) {
          return r.id === convId;
        });
        if (row) abrirHilo(row);
      });
      return;
    }
    if (!perfil && puedeEnviar()) {
      abrirInbox();
      return;
    }
    var intent = leerIntencion();
    abrir({
      perfil: perfil || (intent && intent.perfil) || '',
      texto: intent && intent.texto
    });
  }

  function reanudarSiHayIntencion(user) {
    if (!user || user.isAnonymous) return;
    var intent = leerIntencion();
    if (!intent || !intent.perfil) return;
    if (Date.now() - (intent.ts || 0) > 30 * 60 * 1000) {
      limpiarIntencion();
      return;
    }
    var params = new URLSearchParams(global.location.search);
    if (!intent.reanudar && params.get('abrir') !== 'mensajes') return;
    global.setTimeout(function () {
      abrir({ perfil: intent.perfil, texto: intent.texto });
    }, 500);
  }

  function bindAuth() {
    if (global.CariHubHomeIntenciones) return;
    var auth = global.auth || global.CariHubAuth;
    if (!auth || typeof auth.onAuthStateChanged !== 'function') return;
    auth.onAuthStateChanged(function (user) {
      reanudarSiHayIntencion(user);
    });
  }

  global.CariHubHomeMensajes = {
    abrir: abrir,
    abrirInbox: abrirInbox,
    abrirHilo: abrirHilo,
    abrirDesdeQuery: abrirDesdeQuery,
    render: abrir,
    enviarMensaje: enviarMensaje,
    resolverPerfilDestino: resolverPerfilDestino,
    puedeEnviar: puedeEnviar
  };

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', bindAuth);
  } else {
    bindAuth();
  }
})(typeof window !== 'undefined' ? window : globalThis);
