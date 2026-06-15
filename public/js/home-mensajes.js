/**
 * Mensajes internos desde home — modal, intención y cola local (pre-messenger).
 */
(function (global) {
  'use strict';

  var STORAGE_INTENT = 'chMensajesIntencion';
  var STORAGE_OUTBOX = 'chMensajesOutbox';

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

  function leerOutbox() {
    try {
      var raw = global.localStorage.getItem(STORAGE_OUTBOX);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function guardarOutbox(list) {
    try {
      global.localStorage.setItem(STORAGE_OUTBOX, JSON.stringify(list));
    } catch (e) { /* opcional */ }
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

  function renderAcciones(registrado, perfil) {
    var actions = global.document.getElementById('modalMensajesActions');
    if (!actions) return;

    if (registrado) {
      actions.innerHTML =
        '<button type="button" class="btn btn-enviar" id="modalMensajesEnviar">Enviar mensaje</button>' +
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
        body.innerHTML = '<p>Tu mensaje se guardará en cola hasta activar el messenger completo. Solo personas con cuenta verificada pueden escribir.</p>';
      } else {
        body.innerHTML =
          '<p>Al crear tu cuenta podrás comunicarte por mensajes internos con perfiles dentro de Cariñosas, sin salir de la plataforma.</p>' +
          '<p><strong>Los visitantes sin registro no pueden enviar mensajes.</strong></p>';
      }
    }

    if (compose) compose.hidden = false;
    if (textarea) {
      textarea.value = opts.texto || mensajePredeterminado(perfil.nombre);
      textarea.disabled = !registrado && !perfil.id;
    }

    renderAcciones(registrado, perfil);
  }

  function textoMensaje() {
    var el = global.document.getElementById('modalMensajesTexto');
    return el ? String(el.value || '').trim() : '';
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

    var user = authUser();
    var item = {
      perfilDestino: perfil.id,
      perfilNombre: perfil.nombre || perfil.id,
      texto: texto,
      deUid: user ? user.uid : '',
      ts: Date.now(),
      estado: 'pendiente_messenger'
    };

    var outbox = leerOutbox();
    outbox.unshift(item);
    guardarOutbox(outbox.slice(0, 50));
    limpiarIntencion();

    var body = global.document.getElementById('modalMensajesBody');
    if (body) {
      body.innerHTML =
        '<p><strong>Mensaje guardado.</strong></p>' +
        '<p>Tu mensaje para <strong>' + escHtml(perfil.nombre || perfil.id) + '</strong> quedó en cola. ' +
        'Te avisaremos cuando el messenger esté activo en producción.</p>';
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

  function irALogin(perfil) {
    guardarIntencion({
      perfil: perfil.id || '',
      nombre: perfil.nombre || '',
      texto: textoMensaje() || mensajePredeterminado(perfil.nombre),
      ts: Date.now(),
      reanudar: true
    });
    cerrarModalMensajes();
    if (typeof global.abrirMiPerfil === 'function') {
      global.abrirMiPerfil();
      return;
    }
    if (typeof global.abrirRegistro === 'function') global.abrirRegistro();
  }

  function irARegistro(perfil) {
    guardarIntencion({
      perfil: perfil.id || '',
      nombre: perfil.nombre || '',
      texto: textoMensaje() || mensajePredeterminado(perfil.nombre),
      ts: Date.now(),
      reanudar: true
    });
    cerrarModalMensajes();
    if (typeof global.abrirRegistro === 'function') {
      global.abrirRegistro();
      global.setTimeout(function () {
        global.alert('Crea tu cuenta o inicia sesión para enviar el mensaje a ' + (perfil.nombre || 'el perfil') + '.');
      }, 700);
    }
  }

  function abrir(opts) {
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
    params = params || new URLSearchParams(global.location.search);
    var perfil = params.get('perfil') || '';
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
    var auth = global.auth || global.CariHubAuth;
    if (!auth || typeof auth.onAuthStateChanged !== 'function') return;
    auth.onAuthStateChanged(function (user) {
      reanudarSiHayIntencion(user);
    });
  }

  global.CariHubHomeMensajes = {
    abrir: abrir,
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
