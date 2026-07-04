/**
 * Render Preview + Ficha — sector Transporte packs A–F (MP-TRANSPORTE-DELTAS-V1 Fase 3).
 * Fuente: scripts/transporte-packs-v1.mjs + transporte-sub-deltas-v1.mjs
 * Regenerar: node scripts/build-carihub-transporte-sector-render.mjs
 */
(function (global) {
  'use strict';

  var PREVIEW_FICHA = {
  "chofer-privado": {
    "chips": [
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTransporte",
      "tiempoRespuestaTransporte"
    ],
    "rows": [
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte",
      "tiposClientesTransporte",
      "tiempoRespuestaTransporte",
      "permisosLicencias",
      "diferenciadorTransporte",
      "coberturaGeografica"
    ],
    "faq": [
      "permisosLicencias",
      "coberturaGeografica",
      "tiempoRespuestaTransporte"
    ]
  },
  "conductor-ejecutivo": {
    "chips": [
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTransporte",
      "tiempoRespuestaTransporte"
    ],
    "rows": [
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte",
      "tiposClientesTransporte",
      "tiempoRespuestaTransporte",
      "permisosLicencias",
      "diferenciadorTransporte",
      "coberturaGeografica"
    ],
    "faq": [
      "permisosLicencias",
      "coberturaGeografica",
      "tiempoRespuestaTransporte"
    ]
  },
  "mensajero": {
    "chips": [
      "serviciosMensajeria",
      "tiposEnvio",
      "tipoVehiculoMensajeria"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTransporte",
      "tiempoRespuestaTransporte"
    ],
    "rows": [
      "serviciosMensajeria",
      "tiposEnvio",
      "tipoVehiculoMensajeria",
      "modalidadServicioTransporte",
      "tiempoRespuestaTransporte",
      "diferenciadorTransporte",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "coberturaGeografica",
      "tiempoRespuestaTransporte",
      "colaboracionesComerciales"
    ]
  },
  "repartidor-local": {
    "chips": [
      "serviciosMensajeria",
      "tiposEnvio",
      "tipoVehiculoMensajeria"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTransporte",
      "tiempoRespuestaTransporte"
    ],
    "rows": [
      "serviciosMensajeria",
      "tiposEnvio",
      "tipoVehiculoMensajeria",
      "modalidadServicioTransporte",
      "tiempoRespuestaTransporte",
      "diferenciadorTransporte",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "coberturaGeografica",
      "tiempoRespuestaTransporte",
      "colaboracionesComerciales"
    ]
  },
  "flete-ligero": {
    "chips": [
      "serviciosFleteMudanza",
      "capacidadCarga",
      "modalidadServicioTransporte"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTransporte",
      "tiempoRespuestaTransporte"
    ],
    "rows": [
      "serviciosFleteMudanza",
      "capacidadCarga",
      "modalidadServicioTransporte",
      "tiposMercancia",
      "incluyePersonalCarga",
      "tiempoRespuestaTransporte",
      "diferenciadorTransporte",
      "coberturaGeografica"
    ],
    "faq": [
      "coberturaGeografica",
      "tiempoRespuestaTransporte"
    ]
  },
  "mudanzas-pequenas": {
    "chips": [
      "serviciosFleteMudanza",
      "capacidadCarga",
      "incluyePersonalCarga"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTransporte",
      "tiempoRespuestaTransporte"
    ],
    "rows": [
      "serviciosFleteMudanza",
      "capacidadCarga",
      "incluyePersonalCarga",
      "modalidadServicioTransporte",
      "tiposMercancia",
      "tiempoRespuestaTransporte",
      "diferenciadorTransporte",
      "coberturaGeografica"
    ],
    "faq": [
      "coberturaGeografica",
      "tiempoRespuestaTransporte"
    ]
  },
  "operador-de-carga": {
    "chips": [
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTransporte"
    ],
    "rows": [
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte",
      "capacidadCarga",
      "coberturaRutas",
      "permisosLicencias",
      "diferenciadorTransporte",
      "coberturaGeografica"
    ],
    "faq": [
      "permisosLicencias",
      "coberturaGeografica",
      "coberturaRutas"
    ]
  },
  "motomensajero": {
    "chips": [
      "serviciosMensajeria",
      "tiposEnvio",
      "tipoVehiculoMensajeria"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTransporte",
      "tiempoRespuestaTransporte"
    ],
    "rows": [
      "serviciosMensajeria",
      "tiposEnvio",
      "tipoVehiculoMensajeria",
      "modalidadServicioTransporte",
      "tiempoRespuestaTransporte",
      "diferenciadorTransporte",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "coberturaGeografica",
      "tiempoRespuestaTransporte",
      "colaboracionesComerciales"
    ]
  },
  "courier-independiente": {
    "chips": [
      "serviciosMensajeria",
      "tiposEnvio",
      "tipoVehiculoMensajeria"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTransporte",
      "tiempoRespuestaTransporte"
    ],
    "rows": [
      "serviciosMensajeria",
      "tiposEnvio",
      "tipoVehiculoMensajeria",
      "modalidadServicioTransporte",
      "tiempoRespuestaTransporte",
      "diferenciadorTransporte",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "coberturaGeografica",
      "tiempoRespuestaTransporte",
      "colaboracionesComerciales"
    ]
  },
  "empresa-de-mensajeria": {
    "chips": [
      "serviciosEmpresaTransporte",
      "especialidadesEmpresaTransporte",
      "flotaAproximada"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTransporte",
      "flotaAproximada"
    ],
    "rows": [
      "serviciosEmpresaTransporte",
      "especialidadesEmpresaTransporte",
      "flotaAproximada",
      "tamanoClienteTransporte",
      "modalidadServicioTransporte",
      "diferenciadorTransporte",
      "colaboracionesComerciales",
      "tiposColaboracionComercial"
    ],
    "faq": [
      "colaboracionesComerciales"
    ]
  },
  "empresa-de-paqueteria": {
    "chips": [
      "serviciosEmpresaTransporte",
      "especialidadesEmpresaTransporte",
      "flotaAproximada"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTransporte",
      "flotaAproximada"
    ],
    "rows": [
      "serviciosEmpresaTransporte",
      "especialidadesEmpresaTransporte",
      "flotaAproximada",
      "tamanoClienteTransporte",
      "modalidadServicioTransporte",
      "diferenciadorTransporte",
      "colaboracionesComerciales",
      "tiposColaboracionComercial"
    ],
    "faq": [
      "colaboracionesComerciales"
    ]
  },
  "empresa-de-logistica": {
    "chips": [
      "serviciosEmpresaTransporte",
      "especialidadesEmpresaTransporte",
      "flotaAproximada"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTransporte",
      "flotaAproximada"
    ],
    "rows": [
      "serviciosEmpresaTransporte",
      "especialidadesEmpresaTransporte",
      "flotaAproximada",
      "tamanoClienteTransporte",
      "modalidadServicioTransporte",
      "diferenciadorTransporte",
      "colaboracionesComerciales",
      "tiposColaboracionComercial"
    ],
    "faq": [
      "colaboracionesComerciales"
    ]
  },
  "transporte-de-carga": {
    "chips": [
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTransporte"
    ],
    "rows": [
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte",
      "capacidadCarga",
      "coberturaRutas",
      "permisosLicencias",
      "diferenciadorTransporte",
      "coberturaGeografica"
    ],
    "faq": [
      "permisosLicencias",
      "coberturaGeografica",
      "coberturaRutas"
    ]
  },
  "transporte-refrigerado": {
    "chips": [
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTransporte"
    ],
    "rows": [
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte",
      "capacidadCarga",
      "coberturaRutas",
      "permisosLicencias",
      "diferenciadorTransporte",
      "coberturaGeografica"
    ],
    "faq": [
      "permisosLicencias",
      "coberturaGeografica",
      "coberturaRutas"
    ]
  },
  "mudanzas": {
    "chips": [
      "serviciosFleteMudanza",
      "flotaAproximada",
      "incluyePersonalCarga"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTransporte",
      "flotaAproximada"
    ],
    "rows": [
      "serviciosFleteMudanza",
      "flotaAproximada",
      "incluyePersonalCarga",
      "modalidadServicioTransporte",
      "capacidadCarga",
      "especialidadesEmpresaTransporte",
      "diferenciadorTransporte",
      "colaboracionesComerciales"
    ],
    "faq": [
      "colaboracionesComerciales"
    ]
  },
  "transporte-ejecutivo": {
    "chips": [
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTransporte",
      "tiempoRespuestaTransporte"
    ],
    "rows": [
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte",
      "tiposClientesTransporte",
      "tiempoRespuestaTransporte",
      "permisosLicencias",
      "diferenciadorTransporte",
      "coberturaGeografica"
    ],
    "faq": [
      "permisosLicencias",
      "coberturaGeografica",
      "tiempoRespuestaTransporte"
    ]
  },
  "transporte-turistico": {
    "chips": [
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTransporte",
      "tiempoRespuestaTransporte"
    ],
    "rows": [
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte",
      "tiposClientesTransporte",
      "tiempoRespuestaTransporte",
      "permisosLicencias",
      "diferenciadorTransporte",
      "coberturaGeografica"
    ],
    "faq": [
      "permisosLicencias",
      "coberturaGeografica",
      "tiempoRespuestaTransporte"
    ]
  },
  "transporte-escolar": {
    "chips": [
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTransporte",
      "tiempoRespuestaTransporte"
    ],
    "rows": [
      "serviciosTransportePersonas",
      "tipoVehiculoPasajeros",
      "modalidadServicioTransporte",
      "tiposClientesTransporte",
      "tiempoRespuestaTransporte",
      "permisosLicencias",
      "diferenciadorTransporte",
      "coberturaGeografica"
    ],
    "faq": [
      "permisosLicencias",
      "coberturaGeografica",
      "tiempoRespuestaTransporte"
    ]
  },
  "almacenes-y-bodegas": {
    "chips": [
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTransporte"
    ],
    "rows": [
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte",
      "capacidadCarga",
      "coberturaRutas",
      "permisosLicencias",
      "diferenciadorTransporte",
      "coberturaGeografica"
    ],
    "faq": [
      "permisosLicencias",
      "coberturaGeografica",
      "coberturaRutas"
    ]
  },
  "distribucion-de-mercancias": {
    "chips": [
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTransporte"
    ],
    "rows": [
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte",
      "capacidadCarga",
      "coberturaRutas",
      "permisosLicencias",
      "diferenciadorTransporte",
      "coberturaGeografica"
    ],
    "faq": [
      "permisosLicencias",
      "coberturaGeografica",
      "coberturaRutas"
    ]
  },
  "ultima-milla": {
    "chips": [
      "serviciosMensajeria",
      "tiposEnvio",
      "tipoVehiculoMensajeria"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTransporte",
      "tiempoRespuestaTransporte"
    ],
    "rows": [
      "serviciosMensajeria",
      "tiposEnvio",
      "tipoVehiculoMensajeria",
      "modalidadServicioTransporte",
      "tiempoRespuestaTransporte",
      "diferenciadorTransporte",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "coberturaGeografica",
      "tiempoRespuestaTransporte",
      "colaboracionesComerciales"
    ]
  },
  "logistica-internacional": {
    "chips": [
      "serviciosEspecialidadTransporte",
      "modalidadServicioTransporte",
      "coberturaInternacional"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTransporte"
    ],
    "rows": [
      "serviciosEspecialidadTransporte",
      "modalidadServicioTransporte",
      "coberturaInternacional",
      "tiposVehiculoRenta",
      "capacidadCarga",
      "permisosLicencias",
      "diferenciadorTransporte",
      "coberturaGeografica"
    ],
    "faq": [
      "permisosLicencias",
      "coberturaGeografica",
      "coberturaInternacional"
    ]
  },
  "renta-de-camionetas": {
    "chips": [
      "tiposVehiculoRenta",
      "serviciosEspecialidadTransporte",
      "flotaAproximada"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTransporte",
      "flotaAproximada"
    ],
    "rows": [
      "tiposVehiculoRenta",
      "serviciosEspecialidadTransporte",
      "flotaAproximada",
      "modalidadServicioTransporte",
      "diferenciadorTransporte",
      "colaboracionesComerciales",
      "tiposColaboracionComercial"
    ],
    "faq": [
      "colaboracionesComerciales"
    ]
  },
  "logistica-local": {
    "chips": [
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadServicioTransporte"
    ],
    "rows": [
      "serviciosLogistica",
      "tiposCarga",
      "modalidadServicioTransporte",
      "capacidadCarga",
      "coberturaRutas",
      "permisosLicencias",
      "diferenciadorTransporte",
      "coberturaGeografica"
    ],
    "faq": [
      "permisosLicencias",
      "coberturaGeografica",
      "coberturaRutas"
    ]
  }
};

  var FIELD_LABELS = {
  "modalidadServicioTransporte": "Modalidad de servicio",
  "serviciosTransportePersonas": "Servicios de transporte de personas",
  "tipoVehiculoPasajeros": "Tipo de vehículo",
  "tiposClientesTransporte": "Tipos de clientes",
  "serviciosMensajeria": "Servicios de mensajería",
  "tiposEnvio": "Tipos de envío",
  "tipoVehiculoMensajeria": "Vehículo para envíos",
  "serviciosFleteMudanza": "Servicios de flete / mudanza",
  "capacidadCarga": "Capacidad de carga",
  "tiposMercancia": "Tipos de mercancía",
  "incluyePersonalCarga": "¿Incluye personal de carga?",
  "serviciosLogistica": "Servicios logísticos",
  "tiposCarga": "Tipos de carga",
  "coberturaRutas": "Rutas / corredores",
  "serviciosEmpresaTransporte": "Servicios de la empresa",
  "especialidadesEmpresaTransporte": "Especialidades",
  "tamanoClienteTransporte": "Tamaño de clientes",
  "flotaAproximada": "Flota aproximada",
  "serviciosEspecialidadTransporte": "Servicios especializados",
  "coberturaInternacional": "Cobertura internacional",
  "tiposVehiculoRenta": "Vehículos en renta",
  "permisosLicencias": "Permisos / licencias",
  "tiempoRespuestaTransporte": "Tiempo de respuesta",
  "diferenciadorTransporte": "Tu sello en transporte",
  "coberturaGeografica": "Zona de cobertura",
  "colaboracionesComerciales": "¿Colaboras con empresas, flotillas o plataformas?",
  "tiposColaboracionComercial": "Tipo de colaboraciones"
};

  var FIELD_TYPES = {
  "modalidadServicioTransporte": "enum",
  "serviciosTransportePersonas": "checklist",
  "tipoVehiculoPasajeros": "checklist",
  "tiposClientesTransporte": "checklist",
  "serviciosMensajeria": "checklist",
  "tiposEnvio": "checklist",
  "tipoVehiculoMensajeria": "checklist",
  "serviciosFleteMudanza": "checklist",
  "capacidadCarga": "text",
  "tiposMercancia": "checklist",
  "incluyePersonalCarga": "enum",
  "serviciosLogistica": "checklist",
  "tiposCarga": "checklist",
  "coberturaRutas": "text",
  "serviciosEmpresaTransporte": "checklist",
  "especialidadesEmpresaTransporte": "text",
  "tamanoClienteTransporte": "checklist",
  "flotaAproximada": "text",
  "serviciosEspecialidadTransporte": "checklist",
  "coberturaInternacional": "text",
  "tiposVehiculoRenta": "checklist",
  "permisosLicencias": "text",
  "tiempoRespuestaTransporte": "enum",
  "diferenciadorTransporte": "text",
  "coberturaGeografica": "text",
  "colaboracionesComerciales": "enum",
  "tiposColaboracionComercial": "checklist"
};

  var CANON_BLOCK_TITLES = {
  "chofer-privado": "Chofer privado",
  "conductor-ejecutivo": "Conductor ejecutivo",
  "mensajero": "Mensajero",
  "repartidor-local": "Repartidor local",
  "flete-ligero": "Flete ligero",
  "mudanzas-pequenas": "Mudanzas pequeñas",
  "operador-de-carga": "Operador de carga",
  "motomensajero": "Motomensajero",
  "courier-independiente": "Courier independiente",
  "empresa-de-mensajeria": "Empresa de mensajería",
  "empresa-de-paqueteria": "Empresa de paquetería",
  "empresa-de-logistica": "Empresa de logística",
  "transporte-de-carga": "Transporte de carga",
  "transporte-refrigerado": "Transporte refrigerado",
  "mudanzas": "Mudanzas",
  "transporte-ejecutivo": "Transporte ejecutivo",
  "transporte-turistico": "Transporte turístico",
  "transporte-escolar": "Transporte escolar",
  "almacenes-y-bodegas": "Almacenes y bodegas",
  "distribucion-de-mercancias": "Distribución de mercancías",
  "ultima-milla": "Última milla",
  "logistica-internacional": "Logística internacional",
  "renta-de-camionetas": "Renta de camionetas",
  "logistica-local": "Logística local"
};

  var NEGOCIO_CANON = [
  "mudanzas-pequenas",
  "mudanzas",
  "empresa-de-mensajeria",
  "empresa-de-paqueteria",
  "empresa-de-logistica",
  "renta-de-camionetas"
];

  var PACK_TITLES = {
  "A": "Transporte de personas",
  "B": "Mensajería y última milla",
  "C": "Fletes y mudanzas",
  "D": "Carga y logística operativa",
  "E": "Empresa de transporte",
  "F": "Especialidades"
};

  var SUB_TO_PACK = {
  "chofer-privado": "A",
  "conductor-ejecutivo": "A",
  "transporte-ejecutivo": "A",
  "transporte-turistico": "A",
  "transporte-escolar": "A",
  "mensajero": "B",
  "repartidor-local": "B",
  "motomensajero": "B",
  "courier-independiente": "B",
  "ultima-milla": "B",
  "flete-ligero": "C",
  "mudanzas-pequenas": "C",
  "mudanzas": "C",
  "operador-de-carga": "D",
  "transporte-de-carga": "D",
  "transporte-refrigerado": "D",
  "almacenes-y-bodegas": "D",
  "distribucion-de-mercancias": "D",
  "logistica-local": "D",
  "empresa-de-mensajeria": "E",
  "empresa-de-paqueteria": "E",
  "empresa-de-logistica": "E",
  "logistica-internacional": "F",
  "renta-de-camionetas": "F"
};

  var ENUM_LABELS = {
  "modalidadServicioTransporte": {
    "local_ciudad": "Local Ciudad",
    "metropolitana": "Metropolitana",
    "regional": "Regional",
    "nacional": "Nacional",
    "internacional": "Internacional",
    "bajo_demanda": "Bajo Demanda"
  },
  "incluyePersonalCarga": {
    "si": "Si",
    "no": "No",
    "opcional": "Opcional",
    "convenir": "Convenir"
  },
  "tiempoRespuestaTransporte": {
    "inmediato_30min": "Inmediato 30 min",
    "1h": "1h",
    "2h": "2h",
    "mismo_dia": "Mismo Dia",
    "programado": "Programado"
  },
  "colaboracionesComerciales": {
    "si_activo": "Si Activo",
    "ocasional": "Ocasional",
    "convenir": "Convenir",
    "no": "No"
  }
};

  var CARD_PACK_CLASS_PREFIX = 'res-card--trans-pack-';

  var CARD_SECTOR_CLASS = 'res-card--transporte-sector';

  function txt(v) {
    return String(v == null ? '' : v).trim();
  }

  function slugSubId(id) {
    return String(id || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/_/g, '-');
  }

  function resolveCanonSubId(u) {
    u = u || {};
    var p = perfilNested(u);
    var raw = txt(u.canonSubcategoriaId) || txt(p.canonSubcategoriaId) || txt(u.subcategoriaId);
    var key = slugSubId(raw);
    if (CANON_BLOCK_TITLES[key]) return key;
    if (SUB_TO_PACK[key]) return key;
    return '';
  }

  function perfilNested(u) {
    return (u && u.transportePerfil) ? u.transportePerfil : {};
  }

  function packFrom(u) {
    u = u || {};
    var p = perfilNested(u);
    return txt(u.deltaPack || p.deltaPack || SUB_TO_PACK[resolveCanonSubId(u)]).toUpperCase();
  }

  function isTransporteSectorPerfil(u) {
    if (!u) return false;
    if (String(u.sectorId || '') === 'transporte' && (u.transportePerfil || u.deltaPack)) return true;
    if (u.transportePerfil && resolveCanonSubId(u)) return true;
    return false;
  }

  function isTransporteNegocioPerfil(u) {
    return NEGOCIO_CANON.indexOf(resolveCanonSubId(u)) >= 0;
  }

  function resolveVistaPerfil(u) {
    if (!isTransporteSectorPerfil(u)) return null;
    return isTransporteNegocioPerfil(u) ? 'empresa' : 'pro';
  }

  function joinList(arr) {
    if (!Array.isArray(arr)) return txt(arr);
    return arr.filter(function (x) { return txt(x); }).map(function (x) { return formatEnumValue('', x); }).join(' · ');
  }

  function formatEnumValue(fieldId, val) {
    var k = txt(val);
    if (!k) return '';
    var map = ENUM_LABELS[fieldId];
    if (map && map[k]) return map[k];
    return humanize(k);
  }

  function humanize(v) {
    return String(v).replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function formatMoney(val) {
    var n = txt(val).replace(/[^\d.,]/g, '');
    if (!n) return txt(val);
    return txt(val).indexOf('$') === 0 ? txt(val) : ('$' + n);
  }

  function formatFieldValue(fieldId, val) {
    if (val === true) return 'Sí';
    if (val === false) return 'No';
    if (val == null) return '';
    var tipo = FIELD_TYPES[fieldId] || 'text';
    if (tipo === 'boolean') return val === true || val === 'true' || val === 1 ? 'Sí' : (val === false || val === 'false' ? 'No' : txt(val));
    if (tipo === 'checklist' || Array.isArray(val)) return joinList(val);
    if (tipo === 'enum' || tipo === 'select') return formatEnumValue(fieldId, val);
    if (fieldId === 'tarifaDesde') return formatMoney(val);
    if (tipo === 'number') return txt(val);
    return txt(val);
  }

  function fieldLabel(fieldId) {
    return FIELD_LABELS[fieldId] || humanize(fieldId);
  }

  function previewFields(canonId) {
    return PREVIEW_FICHA[canonId] || {};
  }

  function pushRow(rows, icon, label, value, block) {
    value = txt(value);
    if (!value) return;
    rows.push([icon, label, value, block || '']);
  }

  function buildServiciosList(canonId, p) {
    p = p || {};
    var pf = previewFields(canonId);
    var pack = packFrom({ transportePerfil: p });
    var items = [];
    (pf.chips || []).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) items.push(val);
    });
    var listFields = {
      A: ['serviciosTransportePersonas', 'tipoVehiculoPasajeros'],
      B: ['serviciosMensajeria', 'tiposEnvio'],
      C: ['serviciosFleteMudanza', 'tiposMercancia'],
      D: ['serviciosLogistica', 'tiposCarga'],
      E: ['serviciosEmpresaTransporte', 'especialidadesEmpresaTransporte'],
      F: ['serviciosEspecialidadTransporte', 'tiposVehiculoRenta']
    };
    (listFields[pack] || []).forEach(function (fid) {
      formatFieldValue(fid, p[fid]).split(' · ').forEach(function (x) {
        if (x && items.indexOf(x) < 0) items.push(x);
      });
    });
    if (p.modalidadServicioTransporte) {
      var mod = formatEnumValue('modalidadServicioTransporte', p.modalidadServicioTransporte);
      if (mod && items.indexOf(mod) < 0) items.push(mod);
    }
    return items.filter(function (x) { return txt(x); }).slice(0, 8);
  }

  function buildDatosRows(canonId, p, u) {
    p = p || {};
    u = u || {};
    var rows = [];
    var pf = previewFields(canonId);
    var seen = {};
    function addField(fid, icon) {
      if (seen[fid]) return;
      seen[fid] = true;
      var val = formatFieldValue(fid, p[fid]);
      if (!val) return;
      pushRow(rows, icon || '📋', fieldLabel(fid), val);
    }
    (pf.stats || []).forEach(function (fid) { addField(fid, '📊'); });
    (pf.rows || []).forEach(function (fid) { addField(fid, '✨'); });
    (pf.faq || []).slice(0, 2).forEach(function (fid) { addField(fid, 'ℹ️'); });
    if (p.horarioDetalle) pushRow(rows, '🕐', 'Horario', p.horarioDetalle, 'horario');
    else if (u.horario) pushRow(rows, '🕐', 'Horario', u.horario, 'horario');
    if (p.certificaciones) pushRow(rows, '🎖️', 'Certificaciones', p.certificaciones);
    if (p.diferenciadorTransporte) pushRow(rows, '🚚', 'Tu sello', p.diferenciadorTransporte);
    var loc = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); }).join(', ');
    if (loc) pushRow(rows, '📍', 'Ubicación', loc);
    if (p.direccion) pushRow(rows, '🏢', 'Dirección', p.direccion);
    if (p.coberturaGeografica) pushRow(rows, '🗺️', 'Cobertura', p.coberturaGeografica);
    if (p.coberturaRutas) pushRow(rows, '🛣️', 'Rutas', p.coberturaRutas);
    return rows;
  }

  function buildBadges(u, canonId) {
    u = u || {};
    var p = perfilNested(u);
    var badges = [];
    if (p.tiempoRespuestaTransporte === 'inmediato_30min') {
      badges.push({ cls: 'res-badge--urgencias', text: '30 min respuesta' });
    } else if (p.tiempoRespuestaTransporte === '1h') {
      badges.push({ cls: 'res-badge--urgencias', text: '1 h respuesta' });
    } else if (p.tiempoRespuestaTransporte === 'mismo_dia') {
      badges.push({ cls: 'res-badge--urgencias', text: 'Mismo día' });
    }
    if (p.colaboracionesComerciales && txt(p.colaboracionesComerciales) && p.colaboracionesComerciales !== 'no') {
      badges.push({ cls: 'res-badge--colab', text: 'Colabora con otros' });
    }
    if (txt(p.permisosLicencias)) {
      badges.push({ cls: 'res-badge--cert', text: 'Permisos declarados' });
    }
    if (txt(p.certificaciones)) {
      badges.push({ cls: 'res-badge--cert', text: 'Certificado' });
    }
    return badges;
  }

  function buildStats(canonId, p) {
    p = p || {};
    var pf = previewFields(canonId);
    var stats = [];
    (pf.stats || []).slice(0, 4).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) stats.push([val, fieldLabel(fid)]);
    });
    while (stats.length < 4) {
      var fillers = [
        ['Transporte', 'Especialidad'],
        ['Consultar', 'Tarifa'],
        ['Verificado', 'En plataforma'],
        ['Servicio', 'Sujeto a disponibilidad'],
      ];
      var f = fillers[stats.length];
      if (f) stats.push(f);
    }
    return stats.slice(0, 4);
  }

  function buildFeats(pack) {
    if (pack === 'A') {
      return ['Transporte de personas', 'Vehículos declarados', 'Modalidad visible', 'Perfil verificable'];
    }
    if (pack === 'B') {
      return ['Mensajería y envíos', 'Tipos de envío', 'Modalidad declarada', 'Perfil verificable'];
    }
    if (pack === 'C') {
      return ['Fletes y mudanzas', 'Capacidad declarada', 'Cobertura clara', 'Perfil verificable'];
    }
    if (pack === 'D') {
      return ['Carga y logística', 'Rutas declaradas', 'Modalidad visible', 'Perfil verificable'];
    }
    if (pack === 'E') {
      return ['Empresa de transporte', 'Flota declarada', 'Cobertura visible', 'Perfil verificable'];
    }
    return ['Especialidades', 'Cobertura internacional', 'Modalidad visible', 'Perfil verificable en CariHub'];
  }

  function packFaq(canonId) {
    var pf = previewFields(canonId);
    if (pf.faq && pf.faq.length) {
      return pf.faq.map(function (fid) { return '¿' + fieldLabel(fid) + '?'; });
    }
    return ['¿Incluyen garantía?', '¿Cuál es la tarifa?', '¿Atienden urgencias?', '¿Cuál es la cobertura?'];
  }

  function resolvePrecioPublico(p, u) {
    p = p || {};
    u = u || {};
    if (txt(u.precio)) return u.precio;
    if (p.tarifaDesde) return formatMoney(p.tarifaDesde);
    return '';
  }

  function resolvePriceLabel(u) {
    if (isTransporteNegocioPerfil(u)) return 'Servicios desde';
    return 'Tarifa desde';
  }

  function buildSobreMi(canonId, p, u) {
    if (txt(u.sobreMi)) return u.sobreMi;
    if (txt(u.sobreNosotros)) return u.sobreNosotros;
    if (txt(p.tagline)) return p.tagline;
    if (txt(u.tagline)) return u.tagline;
    if (p.diferenciadorTransporte) return p.diferenciadorTransporte;
    if (p.serviciosTransportePersonas && p.serviciosTransportePersonas[0]) return p.serviciosTransportePersonas[0];
    if (p.serviciosEmpresaTransporte && p.serviciosEmpresaTransporte[0]) return p.serviciosEmpresaTransporte[0];
    if (p.serviciosMensajeria && p.serviciosMensajeria[0]) return p.serviciosMensajeria[0];
    return CANON_BLOCK_TITLES[canonId] || PACK_TITLES[packFrom(u)] || 'Servicios de transporte en tu zona.';
  }

  function hydrateDisplayFields(u) {
    u = u || {};
    if (!isTransporteSectorPerfil(u)) return u;
    var p = perfilNested(u);
    var canonId = resolveCanonSubId(u);
    var pack = packFrom(u);
    u.__transporteCanon = canonId;
    u.__transportePack = pack;
    u.sectorId = u.sectorId || 'transporte';
    u.titulo = u.titulo || p.blockTitle || CANON_BLOCK_TITLES[canonId] || PACK_TITLES[pack] || 'Servicios de transporte';
    u.especialidad = u.especialidad || (p.serviciosTransportePersonas && p.serviciosTransportePersonas[0]) || (p.serviciosMensajeria && p.serviciosMensajeria[0]) || (p.serviciosFleteMudanza && p.serviciosFleteMudanza[0]) || u.titulo;
    u.servicios = u.servicios || u.titulo;
    u.tagline = u.tagline || p.tagline || '';
    u.sobreMi = buildSobreMi(canonId, p, u);
    u.sobreNosotros = u.sobreNosotros || u.sobreMi;
    u.precio = resolvePrecioPublico(p, u);
    u.horario = u.horario || p.horarioDetalle || '';
    if (isTransporteNegocioPerfil(u)) {
      u.nombre = u.nombreComercial || p.nombreComercial || u.nombre || '';
      u.nombreComercial = u.nombreComercial || p.nombreComercial || u.nombre;
    } else {
      u.nombre = u.alias || p.alias || u.nombre || '';
      u.alias = p.alias || u.alias || u.nombre;
    }
    u.serviciosIncluidos = buildServiciosList(canonId, p);
    u.atencion = u.atencion || (p.modalidadServicioTransporte ? formatEnumValue('modalidadServicioTransporte', p.modalidadServicioTransporte) : 'Consultar modalidad');
    u.modalidadServicioTransporte = u.modalidadServicioTransporte || p.modalidadServicioTransporte || '';
    u.diferenciadorTransporte = u.diferenciadorTransporte || p.diferenciadorTransporte || '';
    var locParts = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); });
    u.zonaCobertura = u.zonaCobertura || txt(p.coberturaGeografica) || txt(p.coberturaRutas) || locParts.join(', ') || txt(p.direccion) || '';
    u.cobertura = Array.isArray(u.cobertura) && u.cobertura.length ? u.cobertura : locParts.filter(Boolean);
    if (txt(p.certificaciones) && !Array.isArray(u.certificaciones)) {
      u.certificaciones = [[txt(p.certificaciones), 'Formación / registro']];
    }
    u.__transporteDatos = buildDatosRows(canonId, p, u);
    u.__transporteBadges = buildBadges(u, canonId);
    u.__transportePriceLabel = resolvePriceLabel(u);
    u.rating = u.rating != null ? u.rating : '—';
    u.opiniones = u.opiniones != null ? u.opiniones : 0;
    u.reviews = Array.isArray(u.reviews) ? u.reviews : [];
    u.faq = Array.isArray(u.faq) && u.faq.length ? u.faq : packFaq(canonId);
    u.noIncluidos = Array.isArray(u.noIncluidos) && u.noIncluidos.length
      ? u.noIncluidos
      : ['Servicios fuera del alcance publicado', 'Carga no declarada', 'Rutas no cubiertas salvo indicación'];
    u.stats = Array.isArray(u.stats) && u.stats.length ? u.stats : buildStats(canonId, p);
    u.feats = Array.isArray(u.feats) && u.feats.length ? u.feats : buildFeats(pack);
    u.metodosPago = Array.isArray(u.metodosPago) && u.metodosPago.length ? u.metodosPago : ['Consultar'];
    u.tiempoRespuesta = u.tiempoRespuesta || formatEnumValue('tiempoRespuestaTransporte', p.tiempoRespuestaTransporte) || 'Consultar disponibilidad';
    u.urgencias = u.urgencias || (p.tiempoRespuestaTransporte === 'inmediato_30min' || p.tiempoRespuestaTransporte === '1h' ? formatEnumValue('tiempoRespuestaTransporte', p.tiempoRespuestaTransporte) : 'Consultar disponibilidad');
    return u;
  }

  function cardMetaChips(u) {
    u = hydrateDisplayFields(Object.assign({}, u));
    var p = perfilNested(u);
    var canonId = u.__transporteCanon;
    var pf = previewFields(canonId);
    var chips = [];
    (pf.chips || []).slice(0, 3).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) chips.push(val.split(' · ')[0].slice(0, 28));
    });
    if (p.modalidadServicioTransporte) {
      chips.push(formatEnumValue('modalidadServicioTransporte', p.modalidadServicioTransporte).slice(0, 28));
    }
    if (p.tiempoRespuestaTransporte === 'inmediato_30min') chips.push('30 min respuesta');
    else if (p.tiempoRespuestaTransporte === '1h') chips.push('1 h respuesta');
    else if (p.tiempoRespuestaTransporte === 'mismo_dia') chips.push('Mismo día');
    if (txt(p.permisosLicencias)) chips.push('Permisos declarados');
    return chips.filter(function (x, i, a) { return x && a.indexOf(x) === i; }).slice(0, 4);
  }

  global.CariHubTransporteSectorRender = {
    PACK_TITLES: PACK_TITLES,
    CARD_PACK_CLASS_PREFIX: CARD_PACK_CLASS_PREFIX,
    CARD_SECTOR_CLASS: CARD_SECTOR_CLASS,
    isTransporteSectorPerfil: isTransporteSectorPerfil,
    isTransporteNegocioPerfil: isTransporteNegocioPerfil,
    resolveVistaPerfil: resolveVistaPerfil,
    resolveCanonSubId: resolveCanonSubId,
    packFrom: packFrom,
    hydrateDisplayFields: hydrateDisplayFields,
    cardMetaChips: cardMetaChips,
    buildServiciosList: buildServiciosList,
    buildDatosRows: buildDatosRows,
    buildBadges: buildBadges,
    formatFieldValue: formatFieldValue,
    fieldLabel: fieldLabel,
  };
})(typeof window !== 'undefined' ? window : globalThis);
