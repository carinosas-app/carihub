/**
 * Schema privacidad_mensajes v1 (MSG-020).
 * Firestore: usuarios/{cuentaUid}/privacidad_mensajes/config
 */
(function (global) {
  'use strict';

  var SCHEMA_VERSION = 'v1';
  var DOC_ID = 'config';

  var VISIBILIDAD_PRESENCIA = ['oculto', 'visible_contactos', 'visible_todos'];
  var CONFIRMACION_VISTO = ['oculto', 'visible'];
  var DISPONIBILIDAD_NEGOCIO = ['oculto', 'horario_negocio', 'preguntar'];
  var AUDIENCIA = ['todos', 'registrados', 'contactos', 'favoritos', 'nadie'];
  var UBICACION_MODO = ['oculta', 'preguntar', 'una_vez', 'temporizada', 'en_vivo_hasta_detener'];

  var AUDIENCIA_RANK = {
    todos: 0,
    registrados: 1,
    contactos: 2,
    favoritos: 3,
    nadie: 4
  };

  var AUDIENCIA_LABELS = {
    todos: 'Todos',
    registrados: 'Solo usuarios registrados',
    contactos: 'Solo contactos / socios',
    favoritos: 'Solo favoritos',
    nadie: 'Nadie'
  };

  /** Campos audiencia MSG-075 — quién puede mensaje/llamar/archivos/estados/lives */
  var POLITICAS_CONTACTO = [
    { id: 'mensajesDe', label: 'Mensajes internos', grupo: 'contacto' },
    { id: 'llamadasDe', label: 'Llamadas de voz', grupo: 'contacto' },
    { id: 'videollamadasDe', label: 'Videollamadas', grupo: 'contacto' },
    { id: 'archivosDe', label: 'Archivos y documentos', grupo: 'contacto' },
    { id: 'estadosDe', label: 'Estados / stories', grupo: 'contacto' },
    { id: 'livesDe', label: 'Lives y promos', grupo: 'contacto' }
  ];

  var DEFAULTS = {
    schemaVersion: SCHEMA_VERSION,
    presencia: {
      estadoEnLinea: 'oculto',
      ultimaConexion: 'oculto',
      confirmacionVisto: 'oculto'
    },
    disponibilidad: 'oculto',
    mensajesDe: 'nadie',
    llamadasDe: 'nadie',
    videollamadasDe: 'nadie',
    archivosDe: 'nadie',
    estadosDe: 'nadie',
    livesDe: 'nadie',
    ubicacionPolitica: {
      compartirCon: 'nadie',
      modoDefault: 'preguntar',
      permitirEnVivo: false
    }
  };

  function isEnum(val, list) {
    return list.indexOf(String(val || '')) !== -1;
  }

  function pickEnum(val, list, fallback) {
    return isEnum(val, list) ? String(val) : fallback;
  }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function mergeWithDefaults(raw) {
    raw = raw || {};
    var presencia = raw.presencia || {};
    var ubic = raw.ubicacionPolitica || {};
    return {
      schemaVersion: SCHEMA_VERSION,
      presencia: {
        estadoEnLinea: pickEnum(presencia.estadoEnLinea, VISIBILIDAD_PRESENCIA, DEFAULTS.presencia.estadoEnLinea),
        ultimaConexion: pickEnum(presencia.ultimaConexion, VISIBILIDAD_PRESENCIA, DEFAULTS.presencia.ultimaConexion),
        confirmacionVisto: pickEnum(presencia.confirmacionVisto, CONFIRMACION_VISTO, DEFAULTS.presencia.confirmacionVisto)
      },
      disponibilidad: pickEnum(raw.disponibilidad, DISPONIBILIDAD_NEGOCIO, DEFAULTS.disponibilidad),
      mensajesDe: pickEnum(raw.mensajesDe, AUDIENCIA, DEFAULTS.mensajesDe),
      llamadasDe: pickEnum(raw.llamadasDe, AUDIENCIA, DEFAULTS.llamadasDe),
      videollamadasDe: pickEnum(raw.videollamadasDe, AUDIENCIA, DEFAULTS.videollamadasDe),
      archivosDe: pickEnum(raw.archivosDe, AUDIENCIA, DEFAULTS.archivosDe),
      estadosDe: pickEnum(raw.estadosDe, AUDIENCIA, DEFAULTS.estadosDe),
      livesDe: pickEnum(raw.livesDe, AUDIENCIA, DEFAULTS.livesDe),
      ubicacionPolitica: {
        compartirCon: pickEnum(ubic.compartirCon, AUDIENCIA, DEFAULTS.ubicacionPolitica.compartirCon),
        modoDefault: pickEnum(ubic.modoDefault, UBICACION_MODO, DEFAULTS.ubicacionPolitica.modoDefault),
        permitirEnVivo: ubic.permitirEnVivo === true,
        duracionMaxMinutos:
          typeof ubic.duracionMaxMinutos === 'number' && ubic.duracionMaxMinutos >= 1 && ubic.duracionMaxMinutos <= 1440
            ? Math.floor(ubic.duracionMaxMinutos)
            : undefined
      }
    };
  }

  function normalize(snapOrData, cuentaUid) {
    var data = snapOrData;
    if (snapOrData && typeof snapOrData.data === 'function') {
      if (!snapOrData.exists) return mergeWithDefaults({});
      data = snapOrData.data();
    }
    var merged = mergeWithDefaults(data);
    merged.cuentaUid = String(cuentaUid || data && data.cuentaUid || '');
    if (data && data.creadoEn) merged.creadoEn = data.creadoEn;
    if (data && data.actualizadoEn) merged.actualizadoEn = data.actualizadoEn;
    return merged;
  }

  function ts() {
    return global.firebase && global.firebase.firestore && global.firebase.firestore.FieldValue
      ? global.firebase.firestore.FieldValue.serverTimestamp()
      : new Date();
  }

  function buildPayload(patch, cuentaUid, isCreate) {
    patch = patch || {};
    var merged = mergeWithDefaults(Object.assign({}, patch, { cuentaUid: cuentaUid }));
    var payload = {
      schemaVersion: SCHEMA_VERSION,
      cuentaUid: String(cuentaUid || ''),
      presencia: merged.presencia,
      disponibilidad: merged.disponibilidad,
      mensajesDe: merged.mensajesDe,
      llamadasDe: merged.llamadasDe,
      videollamadasDe: merged.videollamadasDe,
      archivosDe: merged.archivosDe,
      estadosDe: merged.estadosDe,
      livesDe: merged.livesDe,
      ubicacionPolitica: merged.ubicacionPolitica,
      actualizadoEn: ts()
    };
    if (merged.ubicacionPolitica.duracionMaxMinutos != null) {
      payload.ubicacionPolitica.duracionMaxMinutos = merged.ubicacionPolitica.duracionMaxMinutos;
    }
    if (isCreate) payload.creadoEn = ts();
    return payload;
  }

  /**
   * Evalúa si una audiencia permite al actor (MSG-077 ampliará contexto contacto/favorito).
   * actor: { registrado, esContacto, esFavorito }
   */
  function isAudienciaPermitida(politica, actor) {
    actor = actor || {};
    var p = pickEnum(politica, AUDIENCIA, 'nadie');
    if (p === 'nadie') return false;
    if (p === 'todos') return true;
    if (p === 'registrados') return !!actor.registrado;
    if (p === 'contactos') return !!actor.registrado && !!actor.esContacto;
    if (p === 'favoritos') return !!actor.registrado && !!actor.esFavorito;
    return false;
  }

  function muestraConfirmacionVisto(config) {
    config = mergeWithDefaults(config);
    return config.presencia.confirmacionVisto === 'visible';
  }

  function muestraPresencia(config, campo) {
    config = mergeWithDefaults(config);
    campo = campo === 'ultimaConexion' ? 'ultimaConexion' : 'estadoEnLinea';
    var v = config.presencia[campo];
    return v !== 'oculto';
  }

  function labelAudiencia(val) {
    return AUDIENCIA_LABELS[pickEnum(val, AUDIENCIA, 'nadie')] || pickEnum(val, AUDIENCIA, 'nadie');
  }

  /**
   * Evalúa política de un campo (mensajesDe, llamadasDe, …) o ubicacionPolitica.compartirCon.
   */
  function permiteAccion(config, accionId, actor) {
    config = mergeWithDefaults(config);
    actor = actor || {};
    var politica;
    if (accionId === 'ubicacionCompartir' || accionId === 'ubicacionPolitica.compartirCon') {
      politica = config.ubicacionPolitica && config.ubicacionPolitica.compartirCon;
    } else {
      politica = config[accionId];
    }
    return isAudienciaPermitida(politica, actor);
  }

  function resumenPoliticas(config) {
    config = mergeWithDefaults(config);
    var rows = POLITICAS_CONTACTO.map(function (p) {
      return {
        id: p.id,
        label: p.label,
        grupo: p.grupo,
        valor: config[p.id],
        labelValor: labelAudiencia(config[p.id])
      };
    });
    rows.push({
      id: 'ubicacionPolitica.compartirCon',
      label: 'Compartir ubicación',
      grupo: 'ubicacion',
      valor: config.ubicacionPolitica.compartirCon,
      labelValor: labelAudiencia(config.ubicacionPolitica.compartirCon)
    });
    return rows;
  }

  function audienciaMasRestrictiva(a, b) {
    var ra = AUDIENCIA_RANK[pickEnum(a, AUDIENCIA, 'nadie')];
    var rb = AUDIENCIA_RANK[pickEnum(b, AUDIENCIA, 'nadie')];
    return ra >= rb ? pickEnum(a, AUDIENCIA, 'nadie') : pickEnum(b, AUDIENCIA, 'nadie');
  }

  global.CariHubMessengerPrivacidadSchema = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    DOC_ID: DOC_ID,
    VISIBILIDAD_PRESENCIA: VISIBILIDAD_PRESENCIA,
    CONFIRMACION_VISTO: CONFIRMACION_VISTO,
    DISPONIBILIDAD_NEGOCIO: DISPONIBILIDAD_NEGOCIO,
    AUDIENCIA: AUDIENCIA,
    AUDIENCIA_LABELS: clone(AUDIENCIA_LABELS),
    POLITICAS_CONTACTO: POLITICAS_CONTACTO.slice(),
    UBICACION_MODO: UBICACION_MODO,
    DEFAULTS: clone(DEFAULTS),
    mergeWithDefaults: mergeWithDefaults,
    normalize: normalize,
    buildPayload: buildPayload,
    labelAudiencia: labelAudiencia,
    isAudienciaPermitida: isAudienciaPermitida,
    permiteAccion: permiteAccion,
    resumenPoliticas: resumenPoliticas,
    muestraConfirmacionVisto: muestraConfirmacionVisto,
    muestraPresencia: muestraPresencia,
    audienciaMasRestrictiva: audienciaMasRestrictiva,
    collectionPath: function (cuentaUid) {
      return 'usuarios/' + String(cuentaUid || '') + '/privacidad_mensajes';
    },
    docPath: function (cuentaUid) {
      return global.CariHubMessengerPrivacidadSchema.collectionPath(cuentaUid) + '/' + DOC_ID;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
