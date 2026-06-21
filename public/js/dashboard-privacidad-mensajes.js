/**
 * Dashboard — Privacidad de Mensajes (MSG-070).
 * Firestore: usuarios/{cuentaUid}/privacidad_mensajes/config
 */
(function (global) {
  'use strict';

  var cached = null;
  var bound = false;

  var AUD_LABELS = {
    todos: 'Todos',
    registrados: 'Solo usuarios registrados',
    contactos: 'Solo contactos / socios',
    favoritos: 'Solo favoritos',
    nadie: 'Nadie',
  };

  var AUD_HELP =
    'Todos: cualquier visitante. Registrados: cuenta con sesión. Contactos: socios aceptados. Favoritos: quien te guardó. Nadie: bloqueado hasta que cambies la política.';

  var DISP_LABELS = {
    oculto: 'Oculto',
    horario_negocio: 'Mostrar horario de negocio',
    preguntar: 'Preguntar al contactar',
  };

  var UBIC_MOD_LABELS = {
    oculta: 'No compartir',
    preguntar: 'Preguntar siempre',
    una_vez: 'Una vez (confirmación)',
    temporizada: 'Por tiempo limitado',
    en_vivo_hasta_detener: 'En vivo hasta detener',
  };

  function schema() {
    return global.CariHubMessengerPrivacidadSchema;
  }

  function db() {
    if (global.CariHubDB) return global.CariHubDB;
    if (global.firebase && typeof global.firebase.firestore === 'function') return global.firebase.firestore();
    return null;
  }

  function auth() {
    if (global.CariHubAuth) return global.CariHubAuth;
    if (global.firebase && typeof global.firebase.auth === 'function') return global.firebase.auth();
    return null;
  }

  function isPreviewMode() {
    try {
      return new URLSearchParams(global.location.search).get('preview') === '1';
    } catch (e) {
      return false;
    }
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getCached() {
    return cached ? Object.assign({}, cached) : null;
  }

  function load(cuentaUid) {
    var s = schema();
    if (!s) return Promise.reject(new Error('[DashPrivacidadMensajes] Falta schema'));
    if (!cuentaUid) {
      cached = s.mergeWithDefaults({});
      return Promise.resolve(cached);
    }
    var firestore = db();
    if (!firestore) {
      cached = s.mergeWithDefaults({});
      return Promise.resolve(cached);
    }
    return firestore
      .collection('usuarios')
      .doc(cuentaUid)
      .collection('privacidad_mensajes')
      .doc(s.DOC_ID)
      .get()
      .then(function (snap) {
        cached = s.normalize(snap, cuentaUid);
        return cached;
      })
      .catch(function (err) {
        console.warn('[DashPrivacidadMensajes] load:', err);
        cached = s.mergeWithDefaults({ cuentaUid: cuentaUid });
        return cached;
      });
  }

  function save(patch, cuentaUid) {
    var s = schema();
    if (!s) return Promise.reject(new Error('[DashPrivacidadMensajes] Falta schema'));
    var user = auth() && auth().currentUser;
    if (!user || !cuentaUid) {
      if (isPreviewMode()) {
        cached = s.mergeWithDefaults(Object.assign({}, cached || {}, patch));
        return Promise.resolve(cached);
      }
      return Promise.reject(new Error('Inicia sesión para guardar'));
    }
    if (user.uid !== cuentaUid) return Promise.reject(new Error('Cuenta no válida'));
    var firestore = db();
    if (!firestore) return Promise.reject(new Error('Firestore no disponible'));
    var ref = firestore
      .collection('usuarios')
      .doc(cuentaUid)
      .collection('privacidad_mensajes')
      .doc(s.DOC_ID);
    return ref.get().then(function (snap) {
      var isCreate = !snap.exists;
      var payload = s.buildPayload(patch, cuentaUid, isCreate);
      return ref.set(payload, { merge: !isCreate }).then(function () {
        cached = s.normalize(Object.assign({}, payload, { cuentaUid: cuentaUid }), cuentaUid);
        if (global.DashboardMessenger && global.DashboardMessenger.clearPrivacidadCache) {
          global.DashboardMessenger.clearPrivacidadCache(cuentaUid);
        }
        return cached;
      });
    });
  }

  function selectOptions(enumList, labels, current) {
    return enumList
      .map(function (val) {
        return (
          '<option value="' +
          esc(val) +
          '"' +
          (val === current ? ' selected' : '') +
          '>' +
          esc(labels[val] || val) +
          '</option>'
        );
      })
      .join('');
  }

  function renderResumenAudiencias(root, cfg) {
    if (!root || !schema()) return;
    var Ps = schema();
    cfg = Ps.mergeWithDefaults(cfg);
    var rows = Ps.resumenPoliticas(cfg);
    var chips = rows
      .map(function (r) {
        var cls = r.valor === 'nadie' ? ' dash-priv-msg__chip--locked' : '';
        return (
          '<span class="dash-priv-msg__chip' +
          cls +
          '"><span class="dash-priv-msg__chip-label">' +
          esc(r.label) +
          '</span><b>' +
          esc(r.labelValor) +
          '</b></span>'
        );
      })
      .join('');
    root.innerHTML =
      '<div class="dash-priv-msg__resumen">' +
      '<p class="dash-priv-msg__resumen-title">Resumen actual</p>' +
      '<div class="dash-priv-msg__chips">' +
      chips +
      '</div>' +
      '<p class="dash-priv-msg__legend">' +
      esc(AUD_HELP) +
      '</p></div>';
  }

  function refreshResumenFromForm() {
    var resumen = document.getElementById('dashPrivMsgResumen');
    var form = document.getElementById('dashPrivMsgForm');
    if (!resumen || !form || !schema()) return;
    var patch = readForm(form);
    var merged = schema().mergeWithDefaults(Object.assign({}, getCachedLocal() || {}, patch));
    renderResumenAudiencias(resumen, merged);
  }

  function getCachedLocal() {
    return cached;
  }

  function presenciaChecked(val) {
    return val && val !== 'oculto';
  }

  function renderForm(root, cfg) {
    if (!root || !schema()) return;
    var s = schema();
    cfg = s.mergeWithDefaults(cfg);
    var pres = cfg.presencia || {};
    var ubic = cfg.ubicacionPolitica || {};

    root.innerHTML =
      '<section class="dash-priv-msg__section">' +
      '<h3 class="dash-priv-msg__title">Lecturas y presencia</h3>' +
      '<p class="dash-priv-msg__intro">Por defecto todo oculto. No mostramos «en línea» ni última conexión en la UI pública (política Cariñosas).</p>' +
      rowToggle(
        'Confirmación «Visto»',
        'Si está desactivado, el otro no ve hora de lectura ni confirmación de visto.',
        'presencia.confirmacionVisto',
        pres.confirmacionVisto === 'visible'
      ) +
      rowToggle(
        'Estado en línea',
        'Reservado: si activas, solo contactos verían actividad (no se muestra en MVP público).',
        'presencia.estadoEnLinea',
        presenciaChecked(pres.estadoEnLinea)
      ) +
      rowToggle(
        'Última conexión',
        'Reservado: oculto por defecto; no exponer última vez conectado.',
        'presencia.ultimaConexion',
        presenciaChecked(pres.ultimaConexion)
      ) +
      rowSelect(
        'Disponibilidad de negocio',
        'Horario o texto de negocio — no es presencia en línea.',
        'disponibilidad',
        selectOptions(s.DISPONIBILIDAD_NEGOCIO, DISP_LABELS, cfg.disponibilidad)
      ) +
      '</section>' +
      '<section class="dash-priv-msg__section">' +
      '<h3 class="dash-priv-msg__title">Quién puede contactarte</h3>' +
      '<p class="dash-priv-msg__intro">Opt-in explícito: por defecto nadie puede mensaje, llamar ni compartir archivos hasta que lo permitas.</p>' +
      rowSelect('Mensajes internos', 'Quién puede iniciar conversación en Messenger.', 'mensajesDe', selectOptions(s.AUDIENCIA, AUD_LABELS, cfg.mensajesDe)) +
      rowSelect('Llamadas de voz', 'Llamadas desde Messenger.', 'llamadasDe', selectOptions(s.AUDIENCIA, AUD_LABELS, cfg.llamadasDe)) +
      rowSelect('Videollamadas', 'Video desde Messenger.', 'videollamadasDe', selectOptions(s.AUDIENCIA, AUD_LABELS, cfg.videollamadasDe)) +
      rowSelect('Archivos y documentos', 'Adjuntos en el chat.', 'archivosDe', selectOptions(s.AUDIENCIA, AUD_LABELS, cfg.archivosDe)) +
      rowSelect('Estados / stories', 'Estados visibles en contexto messenger.', 'estadosDe', selectOptions(s.AUDIENCIA, AUD_LABELS, cfg.estadosDe)) +
      rowSelect('Lives y promos', 'Invitaciones o avisos de live (promo, no presencia).', 'livesDe', selectOptions(s.AUDIENCIA, AUD_LABELS, cfg.livesDe)) +
      '</section>' +
      '<section class="dash-priv-msg__section">' +
      '<h3 class="dash-priv-msg__title">Ubicación</h3>' +
      '<p class="dash-priv-msg__intro">Nunca se comparte ubicación automáticamente; siempre requiere confirmación explícita.</p>' +
      rowSelect(
        'Compartir ubicación con',
        'Quién puede recibir ubicación si tú confirmas.',
        'ubicacionPolitica.compartirCon',
        selectOptions(s.AUDIENCIA, AUD_LABELS, ubic.compartirCon)
      ) +
      rowSelect(
        'Modo por defecto',
        'Qué ocurre al intentar compartir ubicación.',
        'ubicacionPolitica.modoDefault',
        selectOptions(s.UBICACION_MODO, UBIC_MOD_LABELS, ubic.modoDefault)
      ) +
      rowToggle(
        'Permitir ubicación en vivo',
        'Compartir ubicación en tiempo real hasta que detengas (requiere confirmación cada sesión).',
        'ubicacionPolitica.permitirEnVivo',
        ubic.permitirEnVivo === true
      ) +
      '</section>';
  }

  function rowToggle(title, desc, field, checked) {
    return (
      '<div class="dash-priv-msg__row">' +
      '<div class="dash-priv-msg__label">' +
      '<b>' +
      esc(title) +
      '</b>' +
      (desc ? '<p>' + esc(desc) + '</p>' : '') +
      '</div>' +
      '<label class="switch" title="' +
      esc(title) +
      '">' +
      '<input type="checkbox" data-field="' +
      esc(field) +
      '"' +
      (checked ? ' checked' : '') +
      '>' +
      '<span></span></label></div>'
    );
  }

  function rowSelect(title, desc, field, optionsHtml) {
    return (
      '<div class="dash-priv-msg__row dash-priv-msg__row--select">' +
      '<div class="dash-priv-msg__label">' +
      '<b>' +
      esc(title) +
      '</b>' +
      (desc ? '<p>' + esc(desc) + '</p>' : '') +
      '</div>' +
      '<select class="dash-priv-msg__select" data-field="' +
      esc(field) +
      '">' +
      optionsHtml +
      '</select></div>'
    );
  }

  function setNested(obj, path, val) {
    var key = path[0];
    if (path.length === 1) {
      obj[key] = val;
      return;
    }
    if (!obj[key] || typeof obj[key] !== 'object') obj[key] = {};
    setNested(obj[key], path.slice(1), val);
  }

  function readForm(root) {
    var patch = {};
    if (!root) return patch;
    root.querySelectorAll('[data-field]').forEach(function (el) {
      var path = el.getAttribute('data-field').split('.');
      var val;
      if (el.type === 'checkbox') {
        if (path[0] === 'ubicacionPolitica' && path[1] === 'permitirEnVivo') {
          val = el.checked;
        } else if (path[0] === 'presencia' && path[1] === 'confirmacionVisto') {
          val = el.checked ? 'visible' : 'oculto';
        } else if (path[0] === 'presencia') {
          val = el.checked ? 'visible_contactos' : 'oculto';
        } else {
          val = el.checked;
        }
      } else {
        val = el.value;
      }
      setNested(patch, path, val);
    });
    return patch;
  }

  function bindFormOnce() {
    if (bound) return;
    var btn = document.getElementById('btnGuardarPrivacidadMensajes');
    var root = document.getElementById('dashPrivMsgForm');
    if (!btn || !root) return;
    bound = true;
    root.addEventListener('change', function (e) {
      if (e.target && e.target.matches('[data-field]')) refreshResumenFromForm();
    });
    btn.addEventListener('click', function () {
      var user = auth() && auth().currentUser;
      var uid = user ? user.uid : '';
      if (!uid && !isPreviewMode()) {
        global.alert('Inicia sesión para guardar tus preferencias.');
        return;
      }
      btn.disabled = true;
      var patch = readForm(root);
      save(patch, uid)
        .then(function (cfg) {
          cached = cfg;
          refreshResumenFromForm();
          if (global.DashboardMessenger && global.DashboardMessenger.clearPrivacidadCache) {
            DashboardMessenger.clearPrivacidadCache(uid);
          }
          if (global.alert) global.alert('Privacidad de mensajes guardada.');
        })
        .catch(function (err) {
          console.warn('[DashPrivacidadMensajes] save:', err);
          if (global.alert) global.alert('No se pudo guardar. Intenta de nuevo.');
        })
        .finally(function () {
          btn.disabled = false;
        });
    });
  }

  function refreshUI() {
    var root = document.getElementById('dashPrivMsgForm');
    var hint = document.getElementById('dashPrivMsgHint');
    var btn = document.getElementById('btnGuardarPrivacidadMensajes');
    if (!root) return Promise.resolve();
    var user = auth() && auth().currentUser;
    if (hint) {
      if (!user && isPreviewMode()) {
        hint.textContent =
          'Modo preview: puedes revisar opciones. Inicia sesión para guardar en tu cuenta.';
      } else if (!user) {
        hint.textContent = 'Inicia sesión para guardar preferencias de privacidad en Messenger.';
      } else {
        hint.textContent =
          'Estas reglas aplican a tu cuenta. Los mensajes siguen separados por perfil o banner activo.';
      }
    }
    if (btn) btn.disabled = !user && !isPreviewMode();
    root.innerHTML = '<p class="dash-hint dash-hint--compact">Cargando preferencias…</p>';
    return load(user ? user.uid : '').then(function (cfg) {
      cached = cfg;
      var resumen = document.getElementById('dashPrivMsgResumen');
      if (resumen) renderResumenAudiencias(resumen, cfg);
      renderForm(root, cfg);
      bindFormOnce();
      if (global.lucide && typeof global.lucide.createIcons === 'function') {
        global.lucide.createIcons();
      }
    });
  }

  global.DashPrivacidadMensajes = {
    load: load,
    save: save,
    getCached: getCachedLocal,
    refreshUI: refreshUI,
    readForm: readForm,
    renderForm: renderForm,
    renderResumenAudiencias: renderResumenAudiencias,
    permiteAccion: function (accionId, actor, cfg) {
      var Ps = schema();
      if (!Ps) return false;
      return Ps.permiteAccion(cfg || cached || {}, accionId, actor);
    },
  };
  global.refreshDashPrivacidadMensajes = refreshUI;
})(typeof window !== 'undefined' ? window : globalThis);
