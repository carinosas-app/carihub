/**
 * Viajes / desplazamiento — labels, persistencia y render público compartido.
 */
(function (global) {
  'use strict';

  var VIAJES_SUBCATEGORIAS = [
    'escort', 'escort gay', 'escort vip', 'trans', 'femboy', 'tom boy', 'tom fem',
    'gigolo', 'dotados', 'lesbians', 'hotwife', 'singles', 'acompanante', 'edecan', 'modelos',
    'swinger'
  ];

  var ALCANCE = {
    solo_zona: { form: 'Solo mi zona', resumen: 'Zona' },
    toda_ciudad: { form: 'Toda mi ciudad', resumen: 'Ciudad' },
    todo_estado: { form: 'Todo mi estado / provincia / departamento', resumen: 'Estado' },
    cualquier_ciudad_pais: { form: 'Cualquier ciudad de mi país', resumen: 'País', paisDynamic: true },
    otro_pais: { form: 'Otro país', resumen: 'Otro país' },
    internacional: { form: 'Internacional / varios países', resumen: 'Internacional' }
  };

  var VIAJES_PROGRAMADOS = {
    si: 'Sí',
    no: 'No',
    a_convenir: 'A convenir'
  };

  var GASTOS_TRASLADO = {
    cliente: 'El cliente',
    anunciante: 'El anunciante',
    se_acuerda: 'Se acuerda'
  };

  var ANTICIPACION = {
    mismo_dia: 'Mismo día',
    '24h': '24 horas antes',
    '48h': '48 horas antes',
    '1_semana': 'Una semana antes',
    a_convenir: 'A convenir'
  };

  function normalizeSubId(id) {
    return String(id || '').trim().toLowerCase().replace(/_/g, ' ');
  }

  function subcategoriaActivaViajes(subId) {
    return VIAJES_SUBCATEGORIAS.indexOf(normalizeSubId(subId)) >= 0;
  }

  function alcanceFormOptions() {
    return Object.keys(ALCANCE).map(function (key) {
      return { value: key, label: ALCANCE[key].form };
    });
  }

  function alcanceLabelPublic(alcance, geo) {
    geo = geo || {};
    switch (alcance) {
      case 'solo_zona':
        return 'Solo mi zona';
      case 'toda_ciudad':
        return geo.ciudad ? ('Toda ' + geo.ciudad) : 'Toda mi ciudad';
      case 'todo_estado':
        return geo.estado ? ('Todo ' + geo.estado) : 'Todo mi estado';
      case 'cualquier_ciudad_pais': {
        var pais = String(geo.pais || '').trim();
        return pais ? ('Cualquier ciudad de ' + pais) : 'Cualquier ciudad de mi país';
      }
      case 'otro_pais':
        return 'Otro país';
      case 'internacional':
        return 'Internacional / varios países';
      default:
        return '';
    }
  }

  function alcanceResumenCorto(alcance) {
    var def = ALCANCE[alcance];
    return def ? def.resumen : '';
  }

  function labelFromMap(map, key) {
    return map[key] || key || '';
  }

  function normalizeViajesDesplazamiento(raw, modalidades) {
    var mods = Array.isArray(modalidades) ? modalidades : [];
    var viajaChip = mods.indexOf('viaja') >= 0;
    if (!raw || typeof raw !== 'object') {
      return viajaChip ? { viaja: true } : { viaja: false };
    }
    var viaja = raw.viaja === true || viajaChip;
    if (!viaja) return { viaja: false };
    return {
      viaja: true,
      alcanceDesplazamiento: String(raw.alcanceDesplazamiento || '').trim(),
      viajesProgramados: String(raw.viajesProgramados || '').trim(),
      gastosTraslado: String(raw.gastosTraslado || '').trim(),
      anticipacionViaje: String(raw.anticipacionViaje || '').trim(),
      notasViaje: String(raw.notasViaje || '').trim()
    };
  }

  function buildViajesDesplazamiento(values, modalidades) {
    var mods = Array.isArray(modalidades) ? modalidades : [];
    if (mods.indexOf('viaja') < 0) return { viaja: false };
    return {
      viaja: true,
      alcanceDesplazamiento: String(values.alcanceDesplazamiento || '').trim(),
      viajesProgramados: String(values.viajesProgramados || '').trim(),
      gastosTraslado: String(values.gastosTraslado || '').trim(),
      anticipacionViaje: String(values.anticipacionViaje || '').trim(),
      notasViaje: String(values.notasViaje || '').trim()
    };
  }

  function viajesFieldIds() {
    return ['alcanceDesplazamiento', 'viajesProgramados', 'gastosTraslado', 'anticipacionViaje', 'notasViaje'];
  }

  function cardViajesSummary(u) {
    var v = u && u.viajesDesplazamiento;
    if (!v || v.viaja !== true) return '';
    var alcance = alcanceResumenCorto(v.alcanceDesplazamiento);
    if (!alcance && v.alcanceDesplazamiento) {
      alcance = alcanceLabelPublic(v.alcanceDesplazamiento, u);
    }
    return alcance ? ('Viaja: Sí · ' + alcance) : 'Viaja: Sí';
  }

  global.CariHubViajesDesplazamiento = {
    VIAJES_SUBCATEGORIAS: VIAJES_SUBCATEGORIAS,
    ALCANCE: ALCANCE,
    VIAJES_PROGRAMADOS: VIAJES_PROGRAMADOS,
    GASTOS_TRASLADO: GASTOS_TRASLADO,
    ANTICIPACION: ANTICIPACION,
    normalizeSubId: normalizeSubId,
    subcategoriaActivaViajes: subcategoriaActivaViajes,
    alcanceFormOptions: alcanceFormOptions,
    alcanceLabelPublic: alcanceLabelPublic,
    alcanceResumenCorto: alcanceResumenCorto,
    labelFromMap: labelFromMap,
    normalizeViajesDesplazamiento: normalizeViajesDesplazamiento,
    buildViajesDesplazamiento: buildViajesDesplazamiento,
    viajesFieldIds: viajesFieldIds,
    cardViajesSummary: cardViajesSummary,
    viajesProgramadosLabel: function (k) { return labelFromMap(VIAJES_PROGRAMADOS, k); },
    gastosTrasladoLabel: function (k) { return labelFromMap(GASTOS_TRASLADO, k); },
    anticipacionLabel: function (k) { return labelFromMap(ANTICIPACION, k); }
  };
})(typeof window !== 'undefined' ? window : globalThis);
