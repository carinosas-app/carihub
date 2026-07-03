/**
 * CariHub — Contrato de datos públicos en tarjeta de resultados.
 * Define qué campos van por componenteResultados y elimina contaminación
 * cruzada (ej. modalidades adultas en restaurantes).
 */
(function (global) {
  'use strict';

  /**
   * Campos permitidos en la tarjeta por tipo de componente.
   * Fuente: carihub-public-render-lite.js (cardShell + cardHTML*).
   */
  var CARD_CONTRACT = {
    ResultCardAdultos: {
      label: 'Persona adultos (escort, masajista independiente…)',
      campos: [
        'nombre / alias', 'edad', 'precio', 'tagline / descripción',
        'modalidades (recibe · hotel · domicilio)', 'disponibilidad',
        'ubicación (ciudad · zona)', 'categoría', 'verificada', 'badges (VIP · LGBT · respuesta rápida)',
        'colaboración contenido redes (si aplica y visible)'
      ],
      ocultar: ['horario negocio', 'cédula', 'zonaCobertura servicio', 'nombreComercial']
    },
    ResultCardPareja: {
      label: 'Pareja / swinger / hotwife',
      campos: [
        'alias pareja', 'configuración', 'precio', 'tagline',
        'modalidades', 'ubicación', 'categoría', 'badges pareja'
      ],
      ocultar: ['horario negocio', 'cédula profesional']
    },
    ResultCardDominatrix: {
      label: 'Dominatrix / BDSM',
      campos: [
        'nombre', 'edad', 'precio', 'tagline', 'modalidades',
        'estilo / especialidad BDSM', 'ubicación', 'categoría'
      ],
      ocultar: ['horario restaurante', 'cédula médica']
    },
    ResultCardEspectaculo: {
      label: 'Stripper / table dance / espectáculo',
      campos: ['nombre artístico', 'precio', 'tagline', 'modalidades evento', 'ubicación', 'categoría']
    },
    ResultCardCreador: {
      label: 'Creador de contenido',
      campos: ['alias', 'precio / suscripción', 'tagline', 'plataformas', 'ubicación', 'categoría']
    },
    ResultCardNegocio: {
      label: 'Negocio local (restaurante, spa, sex shop, hotel…)',
      campos: [
        'nombre comercial', 'precio / menú desde', 'tagline / servicios',
        'horario', 'ubicación', 'categoría', 'verificado',
        'colaboración contenido redes (si aplica y visible)'
      ],
      ocultar: ['modalidades adultas', 'edad', 'serviciosIncluidos escort', 'cédula']
    },
    ResultCardServicio: {
      label: 'Servicio independiente (plomero, mecánico, paseador…)',
      campos: [
        'nombre', 'precio / tarifa', 'tagline / servicio',
        'especialidad o cobertura', 'horario', 'ubicación', 'categoría', 'verificado',
        'colaboración contenido redes (si aplica y visible)'
      ],
      ocultar: ['modalidades recibe/hotel/domicilio', 'edad', 'nombreComercial']
    },
    ResultCardProfesional: {
      label: 'Profesionista con cédula (médico, abogado, contador…)',
      campos: [
        'nombre', 'consulta desde', 'especialidad', 'tagline',
        'horario', 'ubicación', 'categoría', 'cédula verificada',
        'colaboración contenido redes (si aplica y visible)'
      ],
      ocultar: ['modalidades adultas', 'horario negocio genérico sin cédula']
    },
    ResultCardUnicorn: {
      label: 'Unicornio lifestyle',
      campos: ['alias', 'precio', 'tagline', 'modalidades', 'ubicación', 'categoría', 'badges']
    }
  };

  /** Campos que solo aplican a perfiles adultos/pareja — se eliminan en otros componentes. */
  var CAMPOS_SOLO_ADULTOS = [
    'modalidades', 'serviciosIncluidos', 'serviciosNoRealizo', 'fisico',
    'modalidadSesion', 'estiloDominacion', 'especialidadBdsm'
  ];

  function registryApi() {
    return global.CariHubSectorContractRegistry || null;
  }

  function isModernSectorPerfil(pres, u, contract) {
    var R = registryApi();
    if (R && R.isSectorPerfil) return R.isSectorPerfil(contract, pres, u);
    return false;
  }

  function resolvePres(u, ctx) {
    if (global.CariHubFieldEngineLite && CariHubFieldEngineLite.resolvePublicPresentation) {
      return CariHubFieldEngineLite.resolvePublicPresentation(ctx || {
        subcategoriaId: u && u.subcategoriaId,
        categoria: (u && (u.categoria || u.categoriaPublica)) || ''
      });
    }
    return { componenteResultados: 'ResultCardAdultos', esAdultoPersona: true };
  }

  function esComponenteAdulto(comp) {
    return comp === 'ResultCardAdultos' ||
      comp === 'ResultCardPareja' ||
      comp === 'ResultCardDominatrix' ||
      comp === 'ResultCardEspectaculo' ||
      comp === 'ResultCardCreador' ||
      comp === 'ResultCardUnicorn';
  }

  function esPerfilProfesionalesSector(pres, u) {
    var R = registryApi();
    if (R) return isModernSectorPerfil(pres, u, R.SECTOR_CONTRACTS.profesionales);
    if (pres && pres.sectorId === 'profesionales') return true;
    if (u && u.sectorId === 'profesionales' && u.profesionalesPerfil) return true;
    return false;
  }

  function esPerfilBienestarSector(pres, u) {
    var R = registryApi();
    if (R) return isModernSectorPerfil(pres, u, R.SECTOR_CONTRACTS.bienestar);
    if (pres && pres.sectorId === 'bienestar' && !pres.esAdultoPersona) return true;
    if (u && u.sectorId === 'bienestar' && u.bienestarHolisticoPerfil) return true;
    return false;
  }

  function esPerfilEventosSector(pres, u) {
    var R = registryApi();
    if (R) return isModernSectorPerfil(pres, u, R.SECTOR_CONTRACTS.eventos);
    if (pres && pres.sectorId === 'eventos') return true;
    if (u && u.sectorId === 'eventos' && u.eventosPerfil) return true;
    return false;
  }

  function esPerfilGastronomiaSector(pres, u) {
    var R = registryApi();
    if (R) return isModernSectorPerfil(pres, u, R.SECTOR_CONTRACTS.restaurantes);
    if (pres && (pres.sectorId === 'restaurantes' || pres.sectorId === 'gastronomia')) return true;
    if (u && (u.sectorId === 'restaurantes' || u.sectorId === 'gastronomia') && u.gastronomiaPerfil) return true;
    return false;
  }

  function isAnyModernSectorPerfil(pres, u) {
    return esPerfilProfesionalesSector(pres, u) ||
      esPerfilBienestarSector(pres, u) ||
      esPerfilEventosSector(pres, u) ||
      esPerfilGastronomiaSector(pres, u);
  }

  /** Elimina campos que no corresponden al componente de la tarjeta. */
  function sanitizePerfil(u, ctx) {
    if (!u) return u;
    var pres = resolvePres(u, ctx);
    var comp = pres.componenteResultados || 'ResultCardAdultos';
    u.__componenteResultados = comp;

    var R = registryApi();
    if (R && R.sanitizeForeignNested) {
      R.sanitizeForeignNested(u, pres);
    }

    if (!esComponenteAdulto(comp) || isAnyModernSectorPerfil(pres, u)) {
      CAMPOS_SOLO_ADULTOS.forEach(function (k) {
        if (Object.prototype.hasOwnProperty.call(u, k)) delete u[k];
      });
      if (u.edad != null && comp !== 'ResultCardProfesional') {
        /* edad solo en adultos; profesionales usan nombre sin edad en tarjeta */
        if (comp !== 'ResultCardServicio') delete u.edad;
      }
      if (comp === 'ResultCardProfesional' || comp === 'ResultCardServicio') {
        delete u.edad;
      }
      if (comp === 'ResultCardNegocio' && !u.nombreComercial && u.nombre) {
        u.nombreComercial = u.nombre;
      }
    }

    if (comp === 'ResultCardProfesional' || comp === 'ResultCardServicio' || comp === 'ResultCardNegocio') {
      delete u.modalidades;
    }

    return u;
  }

  function contratoDe(comp) {
    return CARD_CONTRACT[comp] || CARD_CONTRACT.ResultCardAdultos;
  }

  global.CariHubResultadosCardContract = {
    CARD_CONTRACT: CARD_CONTRACT,
    sanitizePerfil: sanitizePerfil,
    contratoDe: contratoDe,
    esComponenteAdulto: esComponenteAdulto
  };
})(typeof window !== 'undefined' ? window : this);
