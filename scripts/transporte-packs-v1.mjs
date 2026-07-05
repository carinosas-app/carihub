/**
 * MP-TRANSPORTE-DELTAS-V1 — packs A–F y mapa subcategoría → pack (24 subs sector transporte).
 */
export const PACK_IDS = ["A", "B", "C", "D", "E", "F"];

export const PACK_LABELS = {
  A: "Transporte de personas",
  B: "Mensajería y última milla",
  C: "Fletes y mudanzas",
  D: "Carga y logística operativa",
  E: "Empresa de transporte",
  F: "Especialidades",
};

export const TRANSPORTE_FIELD_REGISTRY = {
  modalidadServicioTransporte: {
    id: "modalidadServicioTransporte",
    label: "Modalidad de servicio",
    tipo: "enum",
    opciones: ["local_ciudad", "metropolitana", "regional", "nacional", "internacional", "bajo_demanda"],
  },
  serviciosTransportePersonas: {
    id: "serviciosTransportePersonas",
    label: "Servicios de transporte de personas",
    tipo: "checklist",
    iaCopy: true,
  },
  tipoVehiculoPasajeros: {
    id: "tipoVehiculoPasajeros",
    label: "Tipo de vehículo",
    tipo: "checklist",
  },
  tiposClientesTransporte: {
    id: "tiposClientesTransporte",
    label: "Tipos de clientes",
    tipo: "checklist",
  },
  serviciosMensajeria: {
    id: "serviciosMensajeria",
    label: "Servicios de mensajería",
    tipo: "checklist",
    iaCopy: true,
  },
  tiposEnvio: {
    id: "tiposEnvio",
    label: "Tipos de envío",
    tipo: "checklist",
  },
  tipoVehiculoMensajeria: {
    id: "tipoVehiculoMensajeria",
    label: "Vehículo para envíos",
    tipo: "checklist",
  },
  serviciosFleteMudanza: {
    id: "serviciosFleteMudanza",
    label: "Servicios de flete / mudanza",
    tipo: "checklist",
    iaCopy: true,
  },
  capacidadCarga: {
    id: "capacidadCarga",
    label: "Capacidad de carga",
    tipo: "text",
    maxLength: 80,
  },
  tiposMercancia: {
    id: "tiposMercancia",
    label: "Tipos de mercancía",
    tipo: "checklist",
  },
  incluyePersonalCarga: {
    id: "incluyePersonalCarga",
    label: "¿Incluye personal de carga?",
    tipo: "enum",
    opciones: ["si", "no", "opcional", "convenir"],
  },
  serviciosLogistica: {
    id: "serviciosLogistica",
    label: "Servicios logísticos",
    tipo: "checklist",
    iaCopy: true,
  },
  tiposCarga: {
    id: "tiposCarga",
    label: "Tipos de carga",
    tipo: "checklist",
  },
  coberturaRutas: {
    id: "coberturaRutas",
    label: "Rutas / corredores",
    tipo: "text",
    maxLength: 120,
  },
  serviciosEmpresaTransporte: {
    id: "serviciosEmpresaTransporte",
    label: "Servicios de la empresa",
    tipo: "checklist",
    iaCopy: true,
  },
  especialidadesEmpresaTransporte: {
    id: "especialidadesEmpresaTransporte",
    label: "Especialidades",
    tipo: "text",
    maxLength: 200,
  },
  tamanoClienteTransporte: {
    id: "tamanoClienteTransporte",
    label: "Tamaño de clientes",
    tipo: "checklist",
  },
  flotaAproximada: {
    id: "flotaAproximada",
    label: "Flota aproximada",
    tipo: "text",
    maxLength: 80,
  },
  serviciosEspecialidadTransporte: {
    id: "serviciosEspecialidadTransporte",
    label: "Servicios especializados",
    tipo: "checklist",
    iaCopy: true,
  },
  coberturaInternacional: {
    id: "coberturaInternacional",
    label: "Cobertura internacional",
    tipo: "text",
    maxLength: 120,
  },
  tiposVehiculoRenta: {
    id: "tiposVehiculoRenta",
    label: "Vehículos en renta",
    tipo: "checklist",
  },
  permisosLicencias: {
    id: "permisosLicencias",
    label: "Permisos / licencias",
    tipo: "text",
    maxLength: 160,
  },
  tiempoRespuestaTransporte: {
    id: "tiempoRespuestaTransporte",
    label: "Tiempo de respuesta",
    tipo: "enum",
    opciones: ["inmediato_30min", "1h", "2h", "mismo_dia", "programado"],
  },
  diferenciadorTransporte: {
    id: "diferenciadorTransporte",
    label: "Tu sello en transporte",
    tipo: "text",
    maxLength: 160,
    iaCopy: true,
  },
  coberturaGeografica: {
    id: "coberturaGeografica",
    label: "Zona de cobertura",
    tipo: "text",
    maxLength: 120,
    iaCopy: true,
  },
  colaboracionesComerciales: {
    id: "colaboracionesComerciales",
    label: "¿Colaboras con empresas, flotillas o plataformas?",
    tipo: "enum",
    opciones: ["si_activo", "ocasional", "convenir", "no"],
  },
  tiposColaboracionComercial: {
    id: "tiposColaboracionComercial",
    label: "Tipo de colaboraciones",
    tipo: "checklist",
  },
};

export const SUB_TO_PACK = {
  "chofer-privado": "A",
  "conductor-ejecutivo": "A",
  "transporte-ejecutivo": "A",
  "transporte-turistico": "A",
  "transporte-escolar": "A",
  mensajero: "B",
  "repartidor-local": "B",
  motomensajero: "B",
  "courier-independiente": "B",
  "ultima-milla": "B",
  "flete-ligero": "C",
  "mudanzas-pequenas": "C",
  mudanzas: "C",
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
  "renta-de-camionetas": "F",
};

export const PACK_NEGOCIO_SUBS = new Set([
  "mudanzas-pequenas",
  "mudanzas",
  "empresa-de-mensajeria",
  "empresa-de-paqueteria",
  "empresa-de-logistica",
  "renta-de-camionetas",
]);

export function packPlantillaKey(pack) {
  return `transporte_pack_${pack.toLowerCase()}`;
}

export function formularioIdForSub(subId) {
  if (PACK_NEGOCIO_SUBS.has(subId)) return "negocio_empresa";
  return "persona_independiente";
}
