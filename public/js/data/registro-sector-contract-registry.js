/**
 * CariHub — Registry declarativo de contrato por sector moderno.
 * Fuente única de metadata: nested key, componente resultados, demo builder, sanitize.
 * Los map/build/finalize por sector siguen en carihub-registro-public-blocks.js.
 */
(function (global) {
  'use strict';

  var SECTOR_CONTRACTS = {
    profesionales: {
      sectorId: 'profesionales',
      nestedProfileKey: 'profesionalesPerfil',
      componenteResultados: 'ResultCardProfesional',
      demoBuilder: 'plantillaDemoProfesionales',
      sanitizeNestedKeys: [
        'profesionalesPerfil', 'deltaPack', 'canonSubcategoriaId', 'blockTitle', 'requiresCedula'
      ],
      sectorAliases: []
    },
    bienestar: {
      sectorId: 'bienestar',
      nestedProfileKey: 'bienestarHolisticoPerfil',
      componenteResultados: 'ResultCardNegocio',
      demoBuilder: 'plantillaDemoBienestar',
      excludeAdultoPersona: true,
      sanitizeNestedKeys: [
        'bienestarHolisticoPerfil', 'bienestarPerfil', 'deltaPack', 'canonSubcategoriaId', 'blockTitle'
      ],
      sectorAliases: []
    },
    eventos: {
      sectorId: 'eventos',
      nestedProfileKey: 'eventosPerfil',
      componenteResultados: 'ResultCardNegocio',
      demoBuilder: 'plantillaDemoEventos',
      sanitizeNestedKeys: [
        'eventosPerfil', 'deltaPack', 'canonSubcategoriaId', 'blockTitle',
        'cotizacionDesde', 'unidadCotizacion'
      ],
      sectorAliases: []
    },
    restaurantes: {
      sectorId: 'restaurantes',
      nestedProfileKey: 'gastronomiaPerfil',
      componenteResultados: 'ResultCardNegocio',
      demoBuilder: 'plantillaDemoGastronomia',
      sanitizeNestedKeys: [
        'gastronomiaPerfil', 'deltaPack', 'canonSubcategoriaId', 'blockTitle',
        'precioDesdeMx', 'precioPromedioMx'
      ],
      sectorAliases: ['gastronomia']
    },
    mascotas: {
      sectorId: 'mascotas',
      nestedProfileKey: 'mascotasPerfil',
      componenteResultados: 'ResultCardServicio',
      demoBuilder: 'plantillaDemoMascotas',
      sanitizeNestedKeys: [
        'mascotasPerfil', 'deltaPack', 'canonSubcategoriaId', 'blockTitle',
        'tarifaDesde', 'precioConsulta'
      ],
      sectorAliases: []
    },
    hogar: {
      sectorId: 'hogar',
      nestedProfileKey: 'hogarPerfil',
      componenteResultados: 'ResultCardServicio',
      demoBuilder: 'plantillaDemoHogar',
      sanitizeNestedKeys: [
        'hogarPerfil', 'deltaPack', 'canonSubcategoriaId', 'blockTitle',
        'tarifaDesde'
      ],
      sectorAliases: []
    },
    salud: {
      sectorId: 'salud',
      nestedProfileKey: 'saludPerfil',
      componenteResultados: 'ResultCardServicio',
      demoBuilder: 'plantillaDemoSalud',
      sanitizeNestedKeys: [
        'saludPerfil', 'deltaPack', 'canonSubcategoriaId', 'blockTitle',
        'precioConsulta', 'tarifaDesde', 'requiresCedula'
      ],
      sectorAliases: []
    },
    tecnologia: {
      sectorId: 'tecnologia',
      nestedProfileKey: 'tecnologiaPerfil',
      componenteResultados: 'ResultCardServicio',
      demoBuilder: 'plantillaDemoTecnologia',
      sanitizeNestedKeys: [
        'tecnologiaPerfil', 'deltaPack', 'canonSubcategoriaId', 'blockTitle',
        'tarifaDesde'
      ],
      sectorAliases: []
    },
    automotriz: {
      sectorId: 'automotriz',
      nestedProfileKey: 'automotrizPerfil',
      componenteResultados: 'ResultCardServicio',
      demoBuilder: 'plantillaDemoAutomotriz',
      sanitizeNestedKeys: [
        'automotrizPerfil', 'deltaPack', 'canonSubcategoriaId', 'blockTitle',
        'tarifaDesde'
      ],
      sectorAliases: []
    },
    transporte: {
      sectorId: 'transporte',
      nestedProfileKey: 'transportePerfil',
      componenteResultados: 'ResultCardServicio',
      demoBuilder: 'plantillaDemoTransporte',
      sanitizeNestedKeys: [
        'transportePerfil', 'deltaPack', 'canonSubcategoriaId', 'blockTitle',
        'tarifaDesde'
      ],
      sectorAliases: []
    },
    comercio: {
      sectorId: 'comercio',
      nestedProfileKey: 'comercioPerfil',
      componenteResultados: 'ResultCardNegocio',
      demoBuilder: 'plantillaDemoComercio',
      sanitizeNestedKeys: [
        'comercioPerfil', 'deltaPack', 'canonSubcategoriaId', 'blockTitle',
        'tarifaDesde'
      ],
      sectorAliases: []
    },
    educacion: {
      sectorId: 'educacion',
      nestedProfileKey: 'educacionPerfil',
      componenteResultados: 'ResultCardServicio',
      demoBuilder: 'plantillaDemoEducacion',
      sanitizeNestedKeys: [
        'educacionPerfil', 'deltaPack', 'canonSubcategoriaId', 'blockTitle',
        'tarifaDesde', 'precioConsulta', 'requiresCedula'
      ],
      sectorAliases: []
    },
    industria: {
      sectorId: 'industria',
      nestedProfileKey: 'industriaPerfil',
      componenteResultados: 'ResultCardServicio',
      demoBuilder: 'plantillaDemoIndustria',
      sanitizeNestedKeys: [
        'industriaPerfil', 'deltaPack', 'canonSubcategoriaId', 'blockTitle',
        'tarifaDesde', 'precioConsulta', 'requiresCedula'
      ],
      sectorAliases: []
    },
    'bienes-raices': {
      sectorId: 'bienes-raices',
      nestedProfileKey: 'bienesRaicesPerfil',
      componenteResultados: 'ResultCardServicio',
      demoBuilder: 'plantillaDemoBienesRaices',
      sanitizeNestedKeys: [
        'bienesRaicesPerfil', 'deltaPack', 'canonSubcategoriaId', 'blockTitle',
        'tarifaDesde', 'rangoPrecioInmobiliario'
      ],
      sectorAliases: []
    }
  };

  function resolveContract(sectorId) {
    var sid = String(sectorId || '').trim();
    if (!sid) return null;
    if (SECTOR_CONTRACTS[sid]) return SECTOR_CONTRACTS[sid];
    var ids = Object.keys(SECTOR_CONTRACTS);
    for (var i = 0; i < ids.length; i++) {
      var contract = SECTOR_CONTRACTS[ids[i]];
      if (contract.sectorAliases && contract.sectorAliases.indexOf(sid) >= 0) return contract;
    }
    return null;
  }

  function resolveNestedKey(sectorId) {
    var contract = resolveContract(sectorId);
    return contract ? contract.nestedProfileKey : null;
  }

  function resolveSectorId(mappedBloques, ctx) {
    mappedBloques = mappedBloques || {};
    ctx = ctx || {};
    return String(mappedBloques.sectorId || ctx.sectorId || '').trim();
  }

  function pickNestedPayload(mappedBloques, ctx) {
    var sectorId = resolveSectorId(mappedBloques, ctx);
    var nestedKey = resolveNestedKey(sectorId);
    if (!nestedKey) return {};
    var nested = mappedBloques[nestedKey];
    if (!nested || typeof nested !== 'object') return {};
    var out = {};
    out[nestedKey] = Object.assign({}, nested);
    return out;
  }

  function buildNestedDocFields(sectorNestedPayload) {
    sectorNestedPayload = sectorNestedPayload || {};
    var fields = {};
    var seen = {};
    Object.keys(SECTOR_CONTRACTS).forEach(function (id) {
      var key = SECTOR_CONTRACTS[id].nestedProfileKey;
      if (seen[key]) return;
      seen[key] = true;
      fields[key] = sectorNestedPayload[key] ? Object.assign({}, sectorNestedPayload[key]) : null;
    });
    return fields;
  }

  function isSectorPerfil(contract, pres, u) {
    if (!contract) return false;
    pres = pres || {};
    u = u || {};
    var sid = contract.sectorId;
    if (pres.sectorId === sid) {
      if (contract.excludeAdultoPersona && pres.esAdultoPersona) return false;
      return true;
    }
    if (Array.isArray(contract.sectorAliases)) {
      for (var i = 0; i < contract.sectorAliases.length; i++) {
        if (pres.sectorId === contract.sectorAliases[i]) return true;
      }
    }
    if (u.sectorId === sid || (contract.sectorAliases || []).indexOf(u.sectorId) >= 0) {
      var nestedKey = contract.nestedProfileKey;
      if (u[nestedKey]) return true;
    }
    return false;
  }

  function sanitizeForeignNested(u, pres) {
    if (!u) return u;
    Object.keys(SECTOR_CONTRACTS).forEach(function (id) {
      var contract = SECTOR_CONTRACTS[id];
      if (isSectorPerfil(contract, pres, u)) return;
      (contract.sanitizeNestedKeys || []).forEach(function (key) {
        if (Object.prototype.hasOwnProperty.call(u, key)) delete u[key];
      });
    });
    return u;
  }

  function resolveColaboracionFromBloques(mappedBloques, bloques) {
    mappedBloques = mappedBloques || {};
    bloques = bloques || {};
    var colab = mappedBloques.colaboracionContenido || bloques.colaboracionContenido || '';
    var mostrar = mappedBloques.mostrarColaboracionContenidoPublico ||
      bloques.mostrarColaboracionContenidoPublico || '';
    if (!colab) {
      Object.keys(SECTOR_CONTRACTS).forEach(function (id) {
        if (colab) return;
        var key = SECTOR_CONTRACTS[id].nestedProfileKey;
        var nested = bloques[key];
        if (nested && nested.colaboracionContenido) {
          colab = nested.colaboracionContenido;
          mostrar = nested.mostrarColaboracionContenidoPublico || mostrar;
        }
      });
    }
    return {
      colaboracionContenido: colab,
      mostrarColaboracionContenidoPublico: mostrar
    };
  }

  function allModernNestedProfileKeys() {
    var keys = [];
    var seen = {};
    Object.keys(SECTOR_CONTRACTS).forEach(function (id) {
      var key = SECTOR_CONTRACTS[id].nestedProfileKey;
      if (!seen[key]) {
        seen[key] = true;
        keys.push(key);
      }
    });
    return keys;
  }

  function resolveDemoBuilder(sectorId) {
    var contract = resolveContract(sectorId);
    return contract && contract.demoBuilder ? contract.demoBuilder : null;
  }

  function isModernSector(sectorId) {
    return !!resolveContract(sectorId);
  }

  global.CariHubSectorContractRegistry = {
    SECTOR_CONTRACTS: SECTOR_CONTRACTS,
    resolveContract: resolveContract,
    resolveNestedKey: resolveNestedKey,
    resolveSectorId: resolveSectorId,
    pickNestedPayload: pickNestedPayload,
    buildNestedDocFields: buildNestedDocFields,
    isSectorPerfil: isSectorPerfil,
    sanitizeForeignNested: sanitizeForeignNested,
    resolveColaboracionFromBloques: resolveColaboracionFromBloques,
    allModernNestedProfileKeys: allModernNestedProfileKeys,
    resolveDemoBuilder: resolveDemoBuilder,
    isModernSector: isModernSector
  };
})(typeof window !== 'undefined' ? window : this);
