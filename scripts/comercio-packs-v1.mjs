/**
 * MP-COMERCIO-DELTAS-V1 — packs A–D y mapa subcategoría → pack (9 subs sector comercio).
 */
export const PACK_IDS = ["A", "B", "C", "D"];

export const PACK_LABELS = {
  A: "Abastos y conveniencia",
  B: "Moda y calzado",
  C: "Retail especializado",
  D: "Mayoreo y distribución",
};

export const COMERCIO_FIELD_REGISTRY = {
  modalidadVentaComercio: {
    id: "modalidadVentaComercio",
    label: "Modalidad de venta",
    tipo: "enum",
    opciones: ["tienda_fisica", "online", "ambos", "delivery"],
  },
  categoriasProducto: {
    id: "categoriasProducto",
    label: "Categorías de producto",
    tipo: "checklist",
    iaCopy: true,
  },
  serviciosComercio: {
    id: "serviciosComercio",
    label: "Servicios comerciales",
    tipo: "checklist",
    iaCopy: true,
  },
  formasPagoComercio: {
    id: "formasPagoComercio",
    label: "Formas de pago",
    tipo: "checklist",
  },
  entregaDomicilio: {
    id: "entregaDomicilio",
    label: "Entrega a domicilio",
    tipo: "enum",
    opciones: ["si", "no", "solo_zona", "convenir"],
  },
  generosModa: {
    id: "generosModa",
    label: "Géneros / público",
    tipo: "checklist",
  },
  marcasComercializadas: {
    id: "marcasComercializadas",
    label: "Marcas que manejas",
    tipo: "checklist",
  },
  serviciosMayoreo: {
    id: "serviciosMayoreo",
    label: "Servicios de mayoreo",
    tipo: "checklist",
    iaCopy: true,
  },
  volumenMinimoPedido: {
    id: "volumenMinimoPedido",
    label: "Pedido mínimo (mayoreo)",
    tipo: "text",
    maxLength: 80,
  },
  tiposClientesComercio: {
    id: "tiposClientesComercio",
    label: "Tipos de clientes",
    tipo: "checklist",
  },
  serviciosEmpresaComercio: {
    id: "serviciosEmpresaComercio",
    label: "Servicios de la empresa",
    tipo: "checklist",
    iaCopy: true,
  },
  especialidadesEmpresaComercio: {
    id: "especialidadesEmpresaComercio",
    label: "Especialidades",
    tipo: "text",
    maxLength: 200,
  },
  flotaEntrega: {
    id: "flotaEntrega",
    label: "Entrega / flota",
    tipo: "text",
    maxLength: 80,
  },
  diferenciadorComercio: {
    id: "diferenciadorComercio",
    label: "Tu sello comercial",
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
    label: "¿Colaboras con proveedores, marcas o negocios?",
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
  abarrotes: "A",
  "tiendas-de-conveniencia": "A",
  zapaterias: "B",
  "tiendas-de-ropa": "B",
  "farmacias-de-barrio": "C",
  papelerias: "C",
  ferreterias: "C",
  mayoreo: "D",
  distribuidoras: "D",
};

export const PACK_NEGOCIO_SUBS = new Set(["distribuidoras"]);

export function packPlantillaKey(pack) {
  return `comercio_pack_${pack.toLowerCase()}`;
}

export function formularioIdForSub(subId) {
  if (PACK_NEGOCIO_SUBS.has(subId)) return "negocio_empresa";
  return "persona_independiente";
}
