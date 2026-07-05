/**
 * MP-GASTRONOMIA-ENRICH-V2 — copy y hints por sub (24 canon).
 */
const BASE_AYUDA = {
  tipoCocinaPrincipal: "Mexicana, mariscos, italiana, fusión — sé específico.",
  precioPromedioMx: "Ticket promedio por persona — orientativo.",
  permisoManipulacionAlimentos: "Declara si cuentas con permiso vigente.",
  colaboracionesComerciales: "¿Colaboras con otros negocios, chefs o marcas?",
  diferenciadorProfesional: "Ej. Ingredientes locales · Horno de leña · Menú degustación",
  ventaAlcohol: "Si vendes alcohol, declara permisos y política de menores.",
};

function enrich(blockHint, extra = {}) {
  return {
    blockHint,
    fieldLabels: extra.fieldLabels || {},
    textosAyuda: { ...BASE_AYUDA, ...(extra.textosAyuda || {}) },
    extraFields: extra.extraFields,
  };
}

/** @type {Record<string, object>} */
export const SUB_ENRICHMENT_V2 = {
  "restaurantes-tradicional": enrich(
    "Restaurante con mesa — cocina, capacidad, reservaciones y precio promedio.",
    { fieldLabels: { tipoCocinaPrincipal: "Tipo de cocina principal" } }
  ),
  marisquerias: enrich(
    "Marisquería — especialidad del mar, capacidad y horario de cocina.",
    { fieldLabels: { tipoCocinaPrincipal: "Especialidad de mariscos" } }
  ),
  "cocina-economica": enrich(
    "Comida corrida accesible — menú del día, precio y horario.",
    { fieldLabels: { menuDelDia: "¿Ofreces menú del día?" } }
  ),
  taquerias: enrich(
    "Taquería — tipo de servicio, para llevar y tiempo de preparación.",
    { fieldLabels: { tipoServicioRapido: "Modalidad de servicio" } }
  ),
  hamburgueserias: enrich(
    "Hamburguesería — smash, combos y delivery propio.",
    { fieldLabels: { combosPromociones: "Combos o promociones destacadas" } }
  ),
  pizzerias: enrich(
    "Pizzería — horno, delivery y opciones dietéticas.",
    { fieldLabels: { tipoServicioRapido: "Servicio: mostrador, delivery o ambos" } }
  ),
  "polleryas-alitas": enrich(
    "Pollería y alitas — estilo, combos y capacidad.",
    { fieldLabels: { tipoCocinaPrincipal: "Especialidad de pollo / alitas" } }
  ),
  "sushi-cocina-asiatica": enrich(
    "Sushi y cocina asiática — especialidad, barra y delivery.",
    { fieldLabels: { tipoCocinaPrincipal: "Especialidad asiática" } }
  ),
  "carnes-asadas-parrilla": enrich(
    "Parrilla y cortes — asador, terraza y precio promedio.",
    { fieldLabels: { tipoCocinaPrincipal: "Estilo de parrilla / cortes" } }
  ),
  cafeterias: enrich(
    "Cafetería — café de especialidad, repostería y ambiente.",
    { fieldLabels: { tipoBebidaPrincipal: "Bebidas principales" } }
  ),
  panaderias: enrich(
    "Panadería — productos horneados, pedidos y horario de horneado.",
    { fieldLabels: { productosHorneados: "Productos horneados principales" } }
  ),
  "pastelerias-reposteria": enrich(
    "Pastelería — pasteles personalizados, entrega y opciones dietéticas.",
    { fieldLabels: { pedidosPersonalizados: "¿Aceptas pedidos personalizados?" } }
  ),
  "neverias-heladerias": enrich(
    "Nevería — sabores, producción diaria y mostrador.",
    { fieldLabels: { productosHorneados: "Productos fríos principales" } }
  ),
  juguerias: enrich(
    "Juguería — jugos, licuados y smoothies.",
    { fieldLabels: { tipoBebidaPrincipal: "Bebidas que preparas" } }
  ),
  "food-trucks-gastronomia": enrich(
    "Food truck recurrente — ubicaciones, eventos privados y menú.",
    { fieldLabels: { ubicacionesRecurrentes: "Zonas donde operas" } }
  ),
  "comida-a-domicilio": enrich(
    "Comida preparada a domicilio — menú, zona de entrega y pedido mínimo.",
    {
      fieldLabels: {
        tipoCocinaDomicilio: "Tipo de cocina que preparas",
        zonaEntregaDomicilio: "Zona de entrega",
      },
    }
  ),
  "dark-kitchen": enrich(
    "Dark kitchen — solo delivery; dirección privada y apps de pedido.",
    {
      fieldLabels: { modeloOperacion: "Modelo de operación" },
      textosAyuda: { mostrarSoloZonaPublica: "No publiques dirección exacta del local." },
    }
  ),
  bares: enrich(
    "Bar gastronómico — comida, coctelería y permiso de alcohol.",
    { fieldLabels: { ventaAlcohol: "¿Vendes bebidas alcohólicas?" } }
  ),
  cervecerias: enrich(
    "Cervecería — estilos propios, taproom y comida.",
    { fieldLabels: { estilosCerveza: "Estilos de cerveza" } }
  ),
  "cantinas-vinotecas": enrich(
    "Cantina o vinoteca — vinos, botanas y permisos.",
    { fieldLabels: { ventaAlcohol: "Venta de alcohol y vinos" } }
  ),
  "buffet-comedor": enrich(
    "Buffet o comedor por peso — capacidad, horarios y tipo de comida.",
    { fieldLabels: { tipoBuffet: "Modalidad de buffet / comedor" } }
  ),
  "chef-cocinero-domicilio": enrich(
    "Chef a domicilio — experiencias, menú degustación y zona de servicio.",
    {
      fieldLabels: {
        tipoExperienciaChef: "Experiencias que ofreces",
        comensalesMaxChef: "Comensales máximos por servicio",
      },
    }
  ),
  "bartender-servicio": enrich(
    "Bartender móvil — barra, cocteles y eventos privados.",
    { fieldLabels: { serviciosBarraMovil: "Servicios de barra móvil" } }
  ),
  "distribuidoras-alimentos-bebidas": enrich(
    "Distribución B2B — categorías, cobertura y pedido mínimo.",
    {
      fieldLabels: {
        categoriasDistribucion: "Categorías que distribuyes",
        coberturaDistribucion: "Zona de cobertura",
      },
      textosAyuda: { disclaimerReguladoGastronomia: "Mayoreo B2B — cumple normativa aplicable." },
    }
  ),
};

export function mergeEnrichmentV2(baseProfile, subId) {
  const enrichData = SUB_ENRICHMENT_V2[subId];
  if (!enrichData) return baseProfile;
  const out = { ...baseProfile };
  if (enrichData.blockHint) out.blockHint = enrichData.blockHint;
  if (enrichData.fieldLabels) {
    out.fieldLabels = { ...(out.fieldLabels || {}), ...enrichData.fieldLabels };
  }
  out.textosAyuda = { ...(out.textosAyuda || {}), ...(enrichData.textosAyuda || {}) };
  if (enrichData.extraFields) {
    out.extraFields = [...new Set([...(out.extraFields || []), ...enrichData.extraFields])];
  }
  return out;
}
