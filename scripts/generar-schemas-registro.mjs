/**
 * Genera schemas JSON de diseño para registros no-adultos y precios/planes.
 * Solo artefactos de diseño — no modifica producción.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  sectorArquetipoIndependiente,
  sectorArquetipoNegocio,
  sectorArquetipoProfesionista,
} from "./arquetipos-catalogo.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mapa = JSON.parse(fs.readFileSync(path.join(root, "scripts/mapa-registro-categorias.json"), "utf8"));

const FORM_IND = "Formulario Persona Independiente";
const FORM_IND_NEG = "Formulario Independiente o Negocio";
const FORM_PROF = "Formulario Profesionista";
const FORM_NEG = "Formulario Negocio";

function rows(form) {
  return mapa.matrix.filter((r) => r.formulario === form);
}

const schemaIndependiente = {
  $schema: "./config-registro-schema.meta.json",
  versionSchema: "2026-06-10",
  version: "2026-06-10",
  formularioId: "persona_independiente",
  nombre: "Registro Persona Independiente",
  descripcion:
    "Schema registry para registro dinámico Persona Independiente. FieldEngine: merge(base, plantillaArquetipo, deltaSubcategoria). Alineado con config-registro-adultos-schema.json.",
  alineacionAdultos: {
    comparteFieldRegistry: ["geo", "fotoPrincipal", "galeria", "tagline", "sobreMi", "metodosPago", "contactoPublico", "telefonoContacto", "whatsappPrivado", "ineFrente", "ineReverso", "selfieVerificacion", "rfc", "razonSocial"],
    mismasColeccionesFirestore: true,
    mismosComponentesBase: { resultados: "ResultCardServicio", perfil: "ProfileLayoutServicio" },
  },
  meta: {
    fieldRegistry: {
      alias: { id: "alias", label: "Alias o nombre visible", tipo: "text", maxLength: 50, tonoPublico: "profesional" },
      nombreComercial: { id: "nombreComercial", label: "Nombre comercial (opcional)", tipo: "text", maxLength: 80 },
      tagline: { id: "tagline", label: "Frase corta", tipo: "textarea", maxLength: 100, iaCopy: true },
      geo: { id: "geo", label: "Ubicación base", tipo: "geo", campos: ["pais", "estado", "ciudad", "zona"] },
      zonaCobertura: { id: "zonaCobertura", label: "Zona de cobertura", tipo: "tags", iaCopy: true },
      oficioServicio: { id: "oficioServicio", label: "Oficio / servicio principal", tipo: "text", maxLength: 120 },
      serviciosOfrecidos: { id: "serviciosOfrecidos", label: "Servicios ofrecidos", tipo: "checklist", iaCopy: true },
      experiencia: { id: "experiencia", label: "Experiencia", tipo: "richtext", iaCopy: true },
      anosExperiencia: { id: "anosExperiencia", label: "Años de experiencia", tipo: "number", min: 0, max: 60 },
      tarifaDesde: { id: "tarifaDesde", label: "Tarifa desde (MXN)", tipo: "currency" },
      unidadTarifa: { id: "unidadTarifa", label: "Unidad de cobro", tipo: "enum", opciones: ["por_hora", "por_servicio", "por_visita", "por_m2", "por_proyecto", "cotizacion"] },
      disponibilidad: { id: "disponibilidad", label: "Disponibilidad", tipo: "enum", opciones: ["inmediata", "con_cita", "fines_de_semana", "urgencias_24h"] },
      horarioDetalle: { id: "horarioDetalle", label: "Horario de atención", tipo: "schedule" },
      atencionDomicilio: { id: "atencionDomicilio", label: "Atención a domicilio", tipo: "boolean" },
      materialesIncluidos: { id: "materialesIncluidos", label: "Materiales incluidos", tipo: "tags" },
      certificaciones: { id: "certificaciones", label: "Certificaciones (no cédula)", tipo: "tags" },
      fotoPrincipal: { id: "fotoPrincipal", label: "Foto principal", tipo: "image" },
      galeria: { id: "galeria", label: "Fotos de trabajos realizados", tipo: "image[]" },
      sobreMi: { id: "sobreMi", label: "Sobre mí / presentación", tipo: "richtext", iaCopy: true },
      metodosPago: { id: "metodosPago", label: "Métodos de pago", tipo: "checkboxGroup", opciones: ["efectivo", "transferencia", "tarjeta", "credito"] },
      contactoPublico: { id: "contactoPublico", label: "Contacto visible", tipo: "group", campos: ["whatsapp", "telegram", "mensajeInterno", "llamada"] },
      portfolioURL: { id: "portfolioURL", label: "Portafolio / redes", tipo: "url" },
      deseoFacturar: { id: "deseoFacturar", label: "Deseo facturar", tipo: "boolean", privado: true },
      telefonoPrivado: { id: "telefonoPrivado", label: "Teléfono privado", tipo: "phone", privado: true },
      whatsappPrivado: { id: "whatsappPrivado", label: "WhatsApp real", tipo: "phone", privado: true },
      ineFrente: { id: "ineFrente", label: "INE frente", tipo: "file", privado: true },
      ineReverso: { id: "ineReverso", label: "INE reverso", tipo: "file", privado: true },
      selfieVerificacion: { id: "selfieVerificacion", label: "Selfie verificación CariHub", tipo: "file", privado: true },
      rfc: { id: "rfc", label: "RFC", tipo: "rfc", privado: true },
      razonSocial: { id: "razonSocial", label: "Razón social", tipo: "text", privado: true },
      codigoPostalFiscal: { id: "codigoPostalFiscal", label: "C.P. fiscal", tipo: "text", privado: true },
      emailFacturacion: { id: "emailFacturacion", label: "Email facturación", tipo: "email", privado: true },
      regimenFiscal: { id: "regimenFiscal", label: "Régimen fiscal", tipo: "select", privado: true },
      usoCFDI: { id: "usoCFDI", label: "Uso CFDI", tipo: "select", privado: true },
      terminosAceptados: { id: "terminosAceptados", label: "Términos aceptados", tipo: "boolean", privado: true },
      mayorEdadConfirmado: { id: "mayorEdadConfirmado", label: "Mayor de edad confirmado", tipo: "boolean", privado: true },
    },
    base: {
      camposPublicosResultados: ["subcategoriaId", "alias", "tagline", "geo", "oficioServicio", "tarifaDesde", "fotoPrincipal", "galeria"],
      camposPublicosPerfil: ["subcategoriaId", "alias", "tagline", "geo", "oficioServicio", "serviciosOfrecidos", "experiencia", "anosExperiencia", "tarifaDesde", "unidadTarifa", "zonaCobertura", "disponibilidad", "horarioDetalle", "atencionDomicilio", "fotoPrincipal", "galeria", "sobreMi", "metodosPago", "contactoPublico"],
      camposPrivados: ["telefonoPrivado", "whatsappPrivado", "deseoFacturar", "terminosAceptados", "mayorEdadConfirmado"],
      obligatorios: ["alias", "geo.pais", "geo.estado", "geo.ciudad", "geo.zona", "oficioServicio", "tarifaDesde", "fotoPrincipal", "galeria", "tagline", "telefonoPrivado", "ineFrente", "ineReverso", "selfieVerificacion", "terminosAceptados", "mayorEdadConfirmado"],
      opcionales: ["nombreComercial", "portfolioURL", "certificaciones", "materialesIncluidos", "anosExperiencia", "atencionDomicilio"],
      fotosMin: 3,
      fotosMax: 12,
      fotosMaxPorPlan: { basico: 3, destacado: 6, premium: 10, vip: 12 },
      noPublicos: ["telefonoPrivado", "whatsappPrivado", "ineFrente", "ineReverso", "selfieVerificacion", "rfc", "razonSocial", "codigoPostalFiscal", "emailFacturacion", "regimenFiscal", "usoCFDI", "facturacion"],
      verificacionTipo: "persona_estandar",
      facturacionTipo: "cfdi_opcional",
      nivelRevisionAdmin: "baja",
    },
    verificacionTipos: {
      persona_estandar: {
        campos: ["ineFrente", "ineReverso", "selfieVerificacion"],
        obligatorios: ["ineFrente", "ineReverso", "selfieVerificacion"],
        validacionAdmin: "manual",
        notas: "INE + selfie. No se publican.",
      },
      persona_o_microempresa: {
        campos: ["ineFrente", "ineReverso", "selfieVerificacion", "rfc"],
        obligatorios: ["ineFrente", "selfieVerificacion"],
        validacionAdmin: "manual",
        notas: "Para arquetipo empresa_servicios (consultores/coaches ambiguos). RFC opcional hasta facturar.",
      },
    },
    facturacionTipos: {
      cfdi_opcional: {
        cuando: "deseoFacturar === true",
        camposRequeridos: ["rfc", "razonSocial", "codigoPostalFiscal", "emailFacturacion", "regimenFiscal", "usoCFDI"],
        camposOpcionales: ["nombreComercial"],
        notas: "Facturación opcional para independientes.",
      },
    },
    coherenciaGlobal: [
      { id: "GEO_COMPLETA", si: "true", requiere: ["geo.ciudad", "geo.zona"], severidad: "error" },
      { id: "TARIFA_POSITIVA", si: "tarifaDesde <= 0", severidad: "error", mensaje: "La tarifa debe ser mayor a cero." },
      { id: "FOTOS_MIN", si: "true", requiere: ["galeria.count >= fotosMin"], severidad: "error" },
      { id: "FOTOS_MAX_PLAN", si: "true", requiere: ["galeria.count <= fotosMaxPlan"], severidad: "error" },
      { id: "COBERTURA_MOVIL", si: "atencionDomicilio == true", requiere: ["zonaCobertura"], severidad: "error" },
      { id: "FACTURACION_COMPLETA", si: "deseoFacturar == true", requiere: ["rfc", "razonSocial", "codigoPostalFiscal"], severidad: "error" },
      { id: "TAGLINE_LONGITUD", si: "tagline.length > 100", severidad: "advertencia", mensaje: "Acorta la frase para resultados." },
    ],
    componentesUI: {
      ResultCardServicio: "Tarjeta: foto trabajo + alias + oficio + tarifa desde + zona",
      ProfileLayoutServicio: "Perfil: galería trabajos + experiencia + cobertura + horario + contacto",
      ResultCardServicioMovil: "Tarjeta con badge 'A domicilio' + cobertura",
      ProfileLayoutServicioMovil: "Perfil móvil con mapa de cobertura",
    },
    firestoreRecomendado: {
      colecciones: {
        config_registro_independiente: "Un doc por subcategoriaId (opcional; puede usarse schema único)",
        perfiles: "Documento raíz por perfilId",
        "perfiles/{id}/borradores": "Autosave wizard",
        ia_logs: "Sugerencias IA auditables",
        solicitudes_verificacion: "Cola admin",
      },
      documentoPerfil: {
        raiz: ["usuarioId", "formularioId", "subcategoriaId", "sectorId", "arquetipo", "tipoPerfil", "planId", "estadoPublicacion", "estadoVerificacion"],
        publico: "Campos visibles en web",
        privado: "Nunca en lectura pública",
        verificacion: "INE, selfie, estado revisión",
        facturacion: "null o objeto si deseoFacturar",
        meta: ["versionSchema", "borradorCompletoPct", "iaUltimaRevision"],
      },
    },
  },
  plantillasArquetipo: {
    persona_servicio_general: {
      tipoPerfil: "persona",
      componentes: { resultados: "ResultCardServicio", perfil: "ProfileLayoutServicio" },
      camposPublicosResultados: ["disponibilidad"],
      camposPublicosPerfil: ["certificaciones"],
      camposPrivados: ["whatsappPrivado", "ineFrente", "ineReverso", "selfieVerificacion"],
      obligatoriosExtra: ["serviciosOfrecidos", "zonaCobertura"],
      opcionalesExtra: ["unidadTarifa"],
      fotosMin: 3,
      fotosMax: 12,
      verificacionTipo: "persona_estandar",
      keywordsIA: ["independiente", "servicio", "oficio", "técnico", "a domicilio", "profesional independiente"],
      textosAyuda: {
        tagline: "Ej: 'Plomero certificado con 10 años de experiencia en zona norte'.",
        experiencia: "Describe trabajos realizados, garantías y tiempos de respuesta.",
        zonaCobertura: "Colonias, municipios o radio de servicio.",
        galeria: "Sube fotos reales de trabajos terminados (sin datos personales de clientes).",
      },
    },
    persona_servicio_oficio: {
      heredaDe: "persona_servicio_general",
      tipoPerfil: "persona",
      componentes: { resultados: "ResultCardServicio", perfil: "ProfileLayoutServicio" },
      obligatoriosExtra: ["atencionDomicilio", "materialesIncluidos"],
      opcionalesExtra: ["anosExperiencia"],
      fotosMin: 3,
      fotosMax: 10,
      keywordsIA: ["plomero", "electricista", "albañil", "herrero", "pintor", "cerrajero", "hvac", "paneles solares"],
      textosAyuda: { materialesIncluidos: "Indica si incluyes refacciones básicas o solo mano de obra." },
    },
    persona_servicio_movil: {
      heredaDe: "persona_servicio_general",
      tipoPerfil: "persona",
      componentes: { resultados: "ResultCardServicioMovil", perfil: "ProfileLayoutServicioMovil" },
      obligatoriosExtra: ["atencionDomicilio", "zonaCobertura", "disponibilidad"],
      fotosMin: 2,
      fotosMax: 8,
      keywordsIA: ["a domicilio", "móvil", "urgencias", "grúa", "mecánico", "chofer", "mensajería"],
    },
    persona_servicio_bienestar: {
      heredaDe: "persona_servicio_general",
      tipoPerfil: "persona",
      componentes: { resultados: "ResultCardServicio", perfil: "ProfileLayoutServicio" },
      camposPublicosPerfil: ["certificaciones", "horarioDetalle"],
      obligatoriosExtra: ["certificaciones", "horarioDetalle"],
      fotosMin: 2,
      fotosMax: 8,
      keywordsIA: ["reiki", "tarot", "masajes", "terapia", "coach", "meditación", "holístico"],
      textosAyuda: { certificaciones: "Cursos, diplomas o certificaciones (no sustituyen cédula profesional)." },
    },
    persona_servicio_profesional: {
      heredaDe: "persona_servicio_general",
      tipoPerfil: "persona",
      obligatoriosExtra: ["portfolioURL", "anosExperiencia"],
      fotosMin: 3,
      fotosMax: 15,
      keywordsIA: ["instructor", "tutor", "consultor", "diseño", "marketing", "capacitación"],
    },
    persona_servicio_salud_auxiliar: {
      heredaDe: "persona_servicio_general",
      tipoPerfil: "persona",
      obligatoriosExtra: ["certificaciones", "horarioDetalle"],
      fotosMin: 2,
      fotosMax: 6,
      keywordsIA: ["enfermería", "cuidado", "rehabilitación", "auxiliar", "domicilio"],
      textosAyuda: { certificaciones: "Certificaciones de salud; si eres profesional titulado usa formulario Profesionista." },
    },
    empresa_servicios: {
      tipoPerfil: "persona",
      componentes: { resultados: "ResultCardServicio", perfil: "ProfileLayoutServicio" },
      camposPublicosPerfil: ["portfolioURL", "serviciosOfrecidos"],
      camposPrivados: ["ineFrente", "ineReverso", "selfieVerificacion", "rfc"],
      obligatoriosExtra: ["portfolioURL", "serviciosOfrecidos"],
      opcionalesExtra: ["rfc", "razonSocial"],
      fotosMin: 3,
      fotosMax: 12,
      verificacionTipo: "persona_o_microempresa",
      keywordsIA: ["consultor", "coach", "diseño", "marketing", "freelance", "microempresa"],
      textosAyuda: { portfolioURL: "Casos de éxito, portafolio o sitio web." },
    },
  },
  subcategorias: [],
};

const schemaProfesionista = {
  $schema: "./config-registro-schema.meta.json",
  versionSchema: "2026-06-10",
  version: "2026-06-10",
  formularioId: "profesionista_cedula",
  nombre: "Registro Profesionista con Cédula",
  descripcion: "Schema registry para profesionistas regulados con cédula profesional. Validación manual admin obligatoria.",
  alineacionAdultos: {
    comparteFieldRegistry: ["geo", "fotoPrincipal", "galeria", "tagline", "sobreMi", "metodosPago", "contactoPublico", "ineFrente", "ineReverso", "selfieVerificacion"],
    diferenciasClave: ["cedulaProfesional obligatoria", "sin galeria trabajos como foco principal", "nivelRevisionAdmin alta"],
  },
  meta: {
    fieldRegistry: {
      nombreProfesional: { id: "nombreProfesional", label: "Nombre profesional público", tipo: "text", maxLength: 80 },
      tagline: { id: "tagline", label: "Frase corta", tipo: "textarea", maxLength: 100, iaCopy: true },
      profesion: { id: "profesion", label: "Profesión", tipo: "text", maxLength: 80 },
      especialidad: { id: "especialidad", label: "Especialidad", tipo: "text", maxLength: 120, iaCopy: false },
      subespecialidad: { id: "subespecialidad", label: "Subespecialidad", tipo: "text", maxLength: 120 },
      geo: { id: "geo", label: "Ubicación de consulta", tipo: "geo", campos: ["pais", "estado", "ciudad", "zona"] },
      consultorioDireccion: { id: "consultorioDireccion", label: "Dirección consultorio (opcional pública)", tipo: "address", mapa: false },
      precioConsulta: { id: "precioConsulta", label: "Precio consulta desde (MXN)", tipo: "currency" },
      unidadConsulta: { id: "unidadConsulta", label: "Unidad", tipo: "enum", opciones: ["por_consulta", "por_hora", "por_sesion", "por_visita_domicilio"] },
      consultaEnLinea: { id: "consultaEnLinea", label: "Consulta en línea", tipo: "boolean" },
      horarioAtencion: { id: "horarioAtencion", label: "Horario de atención", tipo: "schedule" },
      idiomas: { id: "idiomas", label: "Idiomas", tipo: "tags" },
      segurosAceptados: { id: "segurosAceptados", label: "Seguros aceptados", tipo: "tags" },
      fotoPrincipal: { id: "fotoPrincipal", label: "Foto profesional", tipo: "image" },
      galeria: { id: "galeria", label: "Galería consultorio / credenciales visibles", tipo: "image[]" },
      sobreMi: { id: "sobreMi", label: "Presentación profesional", tipo: "richtext", iaCopy: true },
      serviciosProfesionales: { id: "serviciosProfesionales", label: "Servicios que ofrece", tipo: "checklist", iaCopy: true },
      metodosPago: { id: "metodosPago", label: "Métodos de pago", tipo: "checkboxGroup", opciones: ["efectivo", "transferencia", "tarjeta", "seguro"] },
      contactoPublico: { id: "contactoPublico", label: "Contacto visible", tipo: "group", campos: ["whatsapp", "mensajeInterno", "llamada", "sitioWeb"] },
      cedulaNumero: { id: "cedulaNumero", label: "Número de cédula profesional", tipo: "text", privado: true, maxLength: 30 },
      cedulaProfesion: { id: "cedulaProfesion", label: "Profesión según cédula", tipo: "text", privado: true },
      cedulaEspecialidad: { id: "cedulaEspecialidad", label: "Especialidad según cédula", tipo: "text", privado: true },
      cedulaInstitucion: { id: "cedulaInstitucion", label: "Institución que expide", tipo: "text", privado: true },
      cedulaAnio: { id: "cedulaAnio", label: "Año de titulación", tipo: "number", privado: true, min: 1950, max: 2030 },
      cedulaComprobante: { id: "cedulaComprobante", label: "Comprobante / captura cédula", tipo: "file", privado: true },
      cedulaEstado: { id: "cedulaEstado", label: "Estado de la república (cédula)", tipo: "text", privado: true },
      telefonoPrivado: { id: "telefonoPrivado", label: "Teléfono privado", tipo: "phone", privado: true },
      ineFrente: { id: "ineFrente", label: "INE frente", tipo: "file", privado: true },
      ineReverso: { id: "ineReverso", label: "INE reverso", tipo: "file", privado: true },
      selfieVerificacion: { id: "selfieVerificacion", label: "Selfie verificación", tipo: "file", privado: true },
      deseoFacturar: { id: "deseoFacturar", label: "Deseo facturar", tipo: "boolean", privado: true },
      rfc: { id: "rfc", label: "RFC", tipo: "rfc", privado: true },
      razonSocial: { id: "razonSocial", label: "Razón social", tipo: "text", privado: true },
      codigoPostalFiscal: { id: "codigoPostalFiscal", label: "C.P. fiscal", tipo: "text", privado: true },
      emailFacturacion: { id: "emailFacturacion", label: "Email facturación", tipo: "email", privado: true },
      regimenFiscal: { id: "regimenFiscal", label: "Régimen fiscal", tipo: "select", privado: true },
      usoCFDI: { id: "usoCFDI", label: "Uso CFDI", tipo: "select", privado: true },
      terminosAceptados: { id: "terminosAceptados", label: "Términos aceptados", tipo: "boolean", privado: true },
    },
    base: {
      camposPublicosResultados: ["subcategoriaId", "nombreProfesional", "profesion", "especialidad", "tagline", "geo", "precioConsulta", "fotoPrincipal"],
      camposPublicosPerfil: ["subcategoriaId", "nombreProfesional", "profesion", "especialidad", "subespecialidad", "tagline", "geo", "consultorioDireccion", "precioConsulta", "unidadConsulta", "consultaEnLinea", "horarioAtencion", "idiomas", "segurosAceptados", "fotoPrincipal", "galeria", "sobreMi", "serviciosProfesionales", "metodosPago", "contactoPublico"],
      camposPrivados: ["cedulaNumero", "cedulaProfesion", "cedulaEspecialidad", "cedulaInstitucion", "cedulaAnio", "cedulaComprobante", "cedulaEstado", "telefonoPrivado", "ineFrente", "ineReverso", "selfieVerificacion", "deseoFacturar", "terminosAceptados"],
      obligatorios: ["nombreProfesional", "profesion", "especialidad", "geo.pais", "geo.estado", "geo.ciudad", "geo.zona", "precioConsulta", "fotoPrincipal", "tagline", "cedulaNumero", "cedulaProfesion", "cedulaInstitucion", "cedulaAnio", "cedulaComprobante", "ineFrente", "ineReverso", "selfieVerificacion", "telefonoPrivado", "terminosAceptados"],
      opcionales: ["subespecialidad", "consultorioDireccion", "consultaEnLinea", "segurosAceptados", "galeria", "idiomas"],
      fotosMin: 2,
      fotosMax: 8,
      fotosMaxPorPlan: { basico: 2, destacado: 4, premium: 6, vip: 8 },
      noPublicos: ["cedulaNumero", "cedulaProfesion", "cedulaEspecialidad", "cedulaInstitucion", "cedulaAnio", "cedulaComprobante", "cedulaEstado", "telefonoPrivado", "ineFrente", "ineReverso", "selfieVerificacion", "rfc", "razonSocial", "facturacion"],
      verificacionTipo: "profesionista_cedula",
      facturacionTipo: "cfdi_opcional",
      nivelRevisionAdmin: "alta",
      validacionCedula: {
        modo: "manual_admin",
        futuroApiColegio: "opcional_fase_2",
        camposCotejo: ["cedulaNumero", "cedulaProfesion", "cedulaEspecialidad", "cedulaInstitucion", "cedulaAnio", "nombreProfesional"],
      },
    },
    verificacionTipos: {
      profesionista_cedula: {
        campos: ["cedulaNumero", "cedulaComprobante", "ineFrente", "ineReverso", "selfieVerificacion"],
        obligatorios: ["cedulaNumero", "cedulaComprobante", "ineFrente", "ineReverso", "selfieVerificacion"],
        validacionAdmin: "manual_obligatoria",
        pasosAdmin: ["cotejar número cédula", "verificar profesión y especialidad", "validar comprobante", "cotejar INE con selfie", "aprobar o rechazar con nota"],
        notas: "La cédula nunca se muestra públicamente. Badge 'Verificado' solo tras aprobación admin.",
      },
    },
    facturacionTipos: {
      cfdi_opcional: {
        cuando: "deseoFacturar === true",
        camposRequeridos: ["rfc", "razonSocial", "codigoPostalFiscal", "emailFacturacion", "regimenFiscal", "usoCFDI"],
        notas: "Común en consultorios y despachos.",
      },
    },
    coherenciaGlobal: [
      { id: "CEDULA_COMPLETA", si: "true", requiere: ["cedulaNumero", "cedulaProfesion", "cedulaInstitucion", "cedulaAnio", "cedulaComprobante"], severidad: "error" },
      { id: "ESPECIALIDAD_COHERENTE", si: "especialidad != cedulaEspecialidad && cedulaEspecialidad", severidad: "advertencia", mensaje: "La especialidad pública difiere de la cédula; admin revisará." },
      { id: "PRECIO_CONSULTA", si: "precioConsulta <= 0", severidad: "error" },
      { id: "FOTOS_MIN", si: "true", requiere: ["fotoPrincipal"], severidad: "error" },
      { id: "CONSULTA_ONLINE", si: "consultaEnLinea == true", requiere: ["contactoPublico.sitioWeb || contactoPublico.mensajeInterno"], severidad: "advertencia" },
      { id: "FACTURACION_COMPLETA", si: "deseoFacturar == true", requiere: ["rfc", "razonSocial"], severidad: "error" },
    ],
    componentesUI: {
      ResultCardProfesional: "Tarjeta: foto + nombre + especialidad + precio consulta + badge verificado",
      ProfileLayoutProfesional: "Perfil: credenciales resumen + horario + servicios + contacto (sin cédula)",
    },
    firestoreRecomendado: {
      colecciones: {
        config_registro_profesionista: "Schema por subcategoriaId",
        solicitudes_verificacion: "Cola prioritaria admin",
        perfiles: "verificacion.cedulaEstado: pendiente|aprobada|rechazada",
      },
      documentoPerfil: {
        raiz: ["usuarioId", "formularioId", "subcategoriaId", "sectorId", "arquetipo", "planId"],
        verificacion: { cedulaEstado: "pendiente", cedulaRevisadaPor: null, cedulaNotaAdmin: null },
      },
    },
  },
  plantillasArquetipo: {
    profesional_salud: {
      tipoPerfil: "persona",
      componentes: { resultados: "ResultCardProfesional", perfil: "ProfileLayoutProfesional" },
      camposPublicosPerfil: ["segurosAceptados", "consultaEnLinea"],
      obligatoriosExtra: ["serviciosProfesionales", "horarioAtencion"],
      fotosMin: 2,
      fotosMax: 6,
      keywordsIA: ["médico", "dentista", "especialista", "consulta", "clínica", "salud"],
    },
    profesional_salud_mental: {
      heredaDe: "profesional_salud",
      obligatoriosExtra: ["consultaEnLinea"],
      keywordsIA: ["psicólogo", "psiquiatra", "terapia", "salud mental"],
      textosAyuda: { sobreMi: "Tono profesional y empático. No incluyas diagnósticos." },
    },
    profesional_tecnico_legal: {
      tipoPerfil: "persona",
      componentes: { resultados: "ResultCardProfesional", perfil: "ProfileLayoutProfesional" },
      obligatoriosExtra: ["serviciosProfesionales"],
      opcionalesExtra: ["consultorioDireccion"],
      fotosMin: 1,
      fotosMax: 4,
      keywordsIA: ["abogado", "contador", "arquitecto", "ingeniero", "notario", "despacho"],
    },
    profesional_veterinario: {
      tipoPerfil: "persona",
      componentes: { resultados: "ResultCardProfesional", perfil: "ProfileLayoutProfesional" },
      obligatoriosExtra: ["serviciosProfesionales", "horarioAtencion"],
      fotosMin: 2,
      fotosMax: 6,
      keywordsIA: ["veterinario", "mascotas", "consulta animal", "clínica veterinaria"],
    },
  },
  subcategorias: [],
};

const schemaNegocio = {
  $schema: "./config-registro-schema.meta.json",
  versionSchema: "2026-06-10",
  version: "2026-06-10",
  formularioId: "negocio_empresa",
  nombre: "Registro Negocio o Empresa",
  descripcion: "Schema registry para establecimientos comerciales y empresas de servicio. Alineado con arquetipos negocio_* de Adultos.",
  alineacionAdultos: {
    reutilizaArquetipos: ["negocio_retail", "negocio_bienestar", "negocio_hospedaje", "negocio_venue"],
    comparteFieldRegistry: ["nombreComercial", "direccion", "geo", "horarioDetalle", "menuServicios", "rfc", "razonSocial", "licenciaOperacion"],
  },
  meta: {
    fieldRegistry: {
      nombreComercial: { id: "nombreComercial", label: "Nombre comercial", tipo: "text", maxLength: 100 },
      razonSocial: { id: "razonSocial", label: "Razón social", tipo: "text", maxLength: 150, privado: true },
      tagline: { id: "tagline", label: "Frase corta", tipo: "textarea", maxLength: 120, iaCopy: true },
      geo: { id: "geo", label: "Ubicación pública", tipo: "geo", campos: ["pais", "estado", "ciudad", "zona"] },
      ubicacionPublica: { id: "ubicacionPublica", label: "Referencia pública (sin número exacto)", tipo: "text", maxLength: 120 },
      direccion: { id: "direccion", label: "Dirección completa", tipo: "address", mapa: true, privado: false },
      mapa: { id: "mapa", label: "Ubicación en mapa", tipo: "mapPin" },
      horarioDetalle: { id: "horarioDetalle", label: "Horario", tipo: "schedule" },
      menuServicios: { id: "menuServicios", label: "Servicios / menú", tipo: "serviceMenu", iaCopy: true },
      catalogoProductos: { id: "catalogoProductos", label: "Catálogo de productos", tipo: "productList", iaCopy: true },
      precioDesde: { id: "precioDesde", label: "Precio desde (MXN)", tipo: "currency" },
      amenidades: { id: "amenidades", label: "Amenidades", tipo: "tags" },
      fotoPrincipal: { id: "fotoPrincipal", label: "Foto fachada / principal", tipo: "image" },
      galeria: { id: "galeria", label: "Fotos del local o productos", tipo: "image[]" },
      sobreMi: { id: "sobreMi", label: "Descripción del negocio", tipo: "richtext", iaCopy: true },
      responsable: { id: "responsable", label: "Responsable / representante", tipo: "text", privado: true, maxLength: 80 },
      telefonoPrivado: { id: "telefonoPrivado", label: "Teléfono privado gerencia", tipo: "phone", privado: true },
      contactoPublico: { id: "contactoPublico", label: "Contacto público", tipo: "group", campos: ["whatsapp", "telefono", "sitioWeb", "mensajeInterno"] },
      metodosPago: { id: "metodosPago", label: "Métodos de pago", tipo: "checkboxGroup", opciones: ["efectivo", "transferencia", "tarjeta", "credito"] },
      estacionamiento: { id: "estacionamiento", label: "Estacionamiento", tipo: "boolean" },
      accesibilidad: { id: "accesibilidad", label: "Accesibilidad", tipo: "boolean" },
      deseoFacturar: { id: "deseoFacturar", label: "Deseo facturar", tipo: "boolean", privado: true },
      rfc: { id: "rfc", label: "RFC", tipo: "rfc", privado: true },
      licenciaOperacion: { id: "licenciaOperacion", label: "Licencia / permiso de operación", tipo: "file", privado: true },
      ineRepresentante: { id: "ineRepresentante", label: "INE representante legal", tipo: "file", privado: true },
      codigoPostalFiscal: { id: "codigoPostalFiscal", label: "C.P. fiscal", tipo: "text", privado: true },
      emailFacturacion: { id: "emailFacturacion", label: "Email facturación", tipo: "email", privado: true },
      regimenFiscal: { id: "regimenFiscal", label: "Régimen fiscal", tipo: "select", privado: true },
      usoCFDI: { id: "usoCFDI", label: "Uso CFDI", tipo: "select", privado: true },
      terminosAceptados: { id: "terminosAceptados", label: "Términos aceptados", tipo: "boolean", privado: true },
    },
    base: {
      camposPublicosResultados: ["subcategoriaId", "nombreComercial", "tagline", "geo", "ubicacionPublica", "precioDesde", "horarioDetalle", "fotoPrincipal", "galeria"],
      camposPublicosPerfil: ["subcategoriaId", "nombreComercial", "tagline", "geo", "ubicacionPublica", "direccion", "mapa", "horarioDetalle", "menuServicios", "catalogoProductos", "precioDesde", "amenidades", "fotoPrincipal", "galeria", "sobreMi", "metodosPago", "contactoPublico", "estacionamiento", "accesibilidad"],
      camposPrivados: ["razonSocial", "responsable", "telefonoPrivado", "rfc", "licenciaOperacion", "ineRepresentante", "deseoFacturar", "terminosAceptados"],
      obligatorios: ["nombreComercial", "geo.pais", "geo.estado", "geo.ciudad", "geo.zona", "direccion", "mapa", "horarioDetalle", "fotoPrincipal", "galeria", "tagline", "responsable", "telefonoPrivado", "terminosAceptados"],
      opcionales: ["razonSocial", "ubicacionPublica", "amenidades", "estacionamiento", "accesibilidad", "catalogoProductos"],
      fotosMin: 5,
      fotosMax: 20,
      fotosMaxPorPlan: { basico: 5, destacado: 10, premium: 15, vip: 20 },
      noPublicos: ["razonSocial", "responsable", "telefonoPrivado", "rfc", "licenciaOperacion", "ineRepresentante", "codigoPostalFiscal", "emailFacturacion", "regimenFiscal", "usoCFDI", "facturacion"],
      verificacionTipo: "negocio_estandar",
      facturacionTipo: "cfdi_si_factura",
      nivelRevisionAdmin: "media",
    },
    verificacionTipos: {
      negocio_estandar: {
        campos: ["rfc", "razonSocial", "licenciaOperacion", "ineRepresentante", "responsable"],
        obligatorios: ["responsable", "telefonoPrivado", "ineRepresentante"],
        obligatoriosSiFactura: ["rfc", "razonSocial"],
        obligatoriosSiRegulado: ["licenciaOperacion"],
        validacionAdmin: "manual",
        notas: "RFC y licencia según giro. Dirección pública en mapa; teléfono gerencia privado.",
      },
    },
    facturacionTipos: {
      cfdi_si_factura: {
        cuando: "deseoFacturar === true",
        camposRequeridos: ["rfc", "razonSocial", "codigoPostalFiscal", "emailFacturacion", "regimenFiscal", "usoCFDI"],
        notas: "Razón social obligatoria si factura.",
      },
    },
    coherenciaGlobal: [
      { id: "MAPA_REQUERIDO", si: "true", requiere: ["direccion", "mapa"], severidad: "error" },
      { id: "MENU_O_CATALOGO", si: "true", requiere: ["menuServicios || catalogoProductos"], severidad: "error" },
      { id: "FOTOS_MIN", si: "true", requiere: ["galeria.count >= fotosMin"], severidad: "error" },
      { id: "RFC_SI_FACTURA", si: "deseoFacturar == true", requiere: ["rfc", "razonSocial"], severidad: "error" },
      { id: "LICENCIA_REGULADOS", si: "subcategoriaRegulada == true", requiere: ["licenciaOperacion"], severidad: "error" },
      { id: "UBICACION_PUBLICA", si: "!direccion.publica", requiere: ["ubicacionPublica"], severidad: "advertencia" },
    ],
    componentesUI: {
      ResultCardNegocio: "Tarjeta: fachada + nombre + horario + precio desde",
      ProfileLayoutNegocio: "Perfil: mapa + galería local + menú/catálogo",
      ProfileLayoutVenue: "Perfil venue: reglas + áreas + cartelera",
      ProfileLayoutHospedaje: "Perfil hospedaje: habitaciones + tarifas",
    },
    firestoreRecomendado: {
      colecciones: { config_registro_negocio: "Schema por subcategoriaId", perfiles: "publico.direccion parcial + mapa" },
      documentoPerfil: {
        raiz: ["usuarioId", "formularioId", "subcategoriaId", "sectorId", "arquetipo", "planId"],
        publico: "nombreComercial, mapa, horario, menú — nunca RFC completo",
        privado: "responsable, teléfono gerencia, documentos fiscales",
      },
    },
  },
  plantillasArquetipo: {
    negocio_servicios_local: {
      tipoPerfil: "negocio",
      componentes: { resultados: "ResultCardNegocio", perfil: "ProfileLayoutNegocio" },
      obligatoriosExtra: ["menuServicios", "precioDesde"],
      fotosMin: 5,
      fotosMax: 15,
      keywordsIA: ["negocio", "local", "servicios", "empresa", "taller"],
    },
    negocio_comercio: {
      heredaDe: "negocio_servicios_local",
      obligatoriosExtra: ["catalogoProductos"],
      opcionalesExtra: ["menuServicios"],
      fotosMin: 5,
      fotosMax: 20,
      keywordsIA: ["tienda", "comercio", "retail", "productos", "mayoreo"],
    },
    negocio_institucion: {
      heredaDe: "negocio_servicios_local",
      obligatoriosExtra: ["licenciaOperacion", "amenidades"],
      fotosMin: 6,
      fotosMax: 20,
      verificacionTipo: "negocio_estandar",
      keywordsIA: ["clínica", "hospital", "laboratorio", "farmacia", "consultorio"],
    },
    negocio_alimentos: {
      heredaDe: "negocio_servicios_local",
      obligatoriosExtra: ["menuServicios", "licenciaOperacion"],
      fotosMin: 6,
      fotosMax: 18,
      keywordsIA: ["restaurante", "cafetería", "comida", "bar", "antro"],
    },
    negocio_hospedaje: {
      tipoPerfil: "lugar",
      componentes: { resultados: "ResultCardNegocio", perfil: "ProfileLayoutHospedaje" },
      camposPublicosPerfil: ["amenidades"],
      obligatoriosExtra: ["amenidades", "precioDesde"],
      fotosMin: 8,
      fotosMax: 25,
      keywordsIA: ["hotel", "motel", "hospedaje", "habitación", "suite"],
    },
    negocio_venue: {
      tipoPerfil: "lugar",
      componentes: { resultados: "ResultCardNegocio", perfil: "ProfileLayoutVenue" },
      obligatoriosExtra: ["precioDesde"],
      fotosMin: 6,
      fotosMax: 20,
      keywordsIA: ["eventos", "salón", "club", "bar", "espectáculo"],
    },
    negocio_inmobiliario: {
      heredaDe: "negocio_servicios_local",
      obligatoriosExtra: ["catalogoProductos"],
      fotosMin: 5,
      fotosMax: 30,
      keywordsIA: ["inmobiliaria", "bienes raíces", "casas", "renta", "terrenos"],
    },
  },
  subcategorias: [],
};

// Populate subcategorias
for (const r of rows(FORM_IND)) {
  const arq = r.arquetipo || sectorArquetipoIndependiente(r.sectorId, r.subcategoriaId);
  schemaIndependiente.subcategorias.push({
    subcategoriaId: r.subcategoriaId,
    nombre: r.subcategoria,
    sectorId: r.sectorId,
    arquetipo: arq,
    tipoPerfil: r.tipoPerfil || "persona",
    heredaDe: `plantillasArquetipo.${arq}`,
    delta: deltaIndependiente(r),
    keywordsIA: keywordsFromNombre(r.subcategoria, r.sectorId),
  });
}
for (const r of rows(FORM_IND_NEG)) {
  schemaIndependiente.subcategorias.push({
    subcategoriaId: r.subcategoriaId,
    nombre: r.subcategoria,
    sectorId: r.sectorId,
    arquetipo: r.arquetipo || "empresa_servicios",
    tipoPerfil: r.tipoPerfil || "persona",
    heredaDe: "plantillasArquetipo.empresa_servicios",
    delta: { notas: "AMBIGUO: independiente vs micro-empresa; IA puede sugerir RFC si factura." },
    keywordsIA: ["consultor", "coach", "diseño", "marketing"],
  });
}
for (const r of rows(FORM_PROF)) {
  const arq = r.arquetipo || sectorArquetipoProfesionista(r.sectorId, r.subcategoria);
  schemaProfesionista.subcategorias.push({
    subcategoriaId: r.subcategoriaId,
    nombre: r.subcategoria,
    sectorId: r.sectorId,
    arquetipo: arq,
    tipoPerfil: r.tipoPerfil || "persona",
    heredaDe: `plantillasArquetipo.${arq}`,
    delta: deltaProfesionista(r),
    keywordsIA: keywordsFromNombre(r.subcategoria, r.sectorId),
  });
}
for (const r of rows(FORM_NEG)) {
  const arq = r.arquetipo || sectorArquetipoNegocio(r.sectorId, r.subcategoria);
  schemaNegocio.subcategorias.push({
    subcategoriaId: r.subcategoriaId,
    nombre: r.subcategoria,
    sectorId: r.sectorId,
    arquetipo: arq,
    tipoPerfil: r.tipoPerfil || (arq.includes("hospedaje") || arq.includes("venue") ? "lugar" : "negocio"),
    heredaDe: `plantillasArquetipo.${arq}`,
    delta: deltaNegocio(r),
    keywordsIA: keywordsFromNombre(r.subcategoria, r.sectorId),
  });
}

function keywordsFromNombre(nombre, sectorId) {
  return [nombre.toLowerCase(), sectorId.replace(/-/g, " ")];
}

function deltaIndependiente(r) {
  const id = r.subcategoriaId;
  const d = {};
  if (id.includes("domicilio") || r.sectorId === "transporte") {
    d.obligatoriosExtra = ["atencionDomicilio", "zonaCobertura"];
    d.fotosMin = 2;
  }
  if (["cerrajeros", "plomeros", "electricistas"].some((k) => id.includes(k))) {
    d.disponibilidad = { opcionesExtra: ["urgencias_24h"] };
  }
  if (id.includes("paneles-solares") || id.includes("clima")) {
    d.obligatoriosExtra = ["certificaciones"];
  }
  return d;
}

function deltaProfesionista(r) {
  const n = r.subcategoria.toLowerCase();
  if (n.includes("psicolog") || n.includes("psiquiatr")) return { coherenciaExtra: [{ id: "SALUD_MENTAL", requiere: ["consultaEnLinea"], severidad: "advertencia" }] };
  if (n.includes("dentista") || n.includes("ciruj")) return { obligatoriosExtra: ["galeria"] };
  return {};
}

function deltaNegocio(r) {
  const n = r.subcategoria.toLowerCase();
  if (n.includes("farmacia") || n.includes("hospital") || n.includes("clinica")) {
    return { subcategoriaRegulada: true, obligatoriosExtra: ["licenciaOperacion"] };
  }
  if (n.includes("restaurante") || n.includes("antro") || n.includes("bar")) {
    return { subcategoriaRegulada: true, obligatoriosExtra: ["licenciaOperacion", "menuServicios"] };
  }
  return {};
}

const schemaPrecios = {
  $schema: "./config-registro-schema.meta.json",
  versionSchema: "2026-06-10",
  version: "2026-06-10",
  formularioId: "config_precios_planes_perfiles",
  nombre: "Configuración de precios y planes de perfiles",
  descripcion: "Schema de precios publicación/visibilidad de perfiles CariHub. Paralelo a configuracion_publicidad para banners. Nunca auto-aplica cambios.",
  moneda: "MXN",
  ivaIncluido: true,
  redondeo: 50,
  planes: {
    basico: {
      id: "basico",
      nombre: "Básico",
      orden: 1,
      descripcion: "Presencia estándar en resultados",
      visibilidad: { prioridadResultados: 1, badge: null, destacadoHome: false },
      limites: { fotosMax: 3, galeriaMax: 3, actualizacionesMes: 2 },
      activo: true,
    },
    destacado: {
      id: "destacado",
      nombre: "Destacado",
      orden: 2,
      descripcion: "Mayor visibilidad en resultados y badge",
      visibilidad: { prioridadResultados: 2, badge: "destacado", destacadoHome: false },
      limites: { fotosMax: 6, galeriaMax: 6, actualizacionesMes: 4 },
      activo: true,
    },
    premium: {
      id: "premium",
      nombre: "Premium",
      orden: 3,
      descripcion: "Alta visibilidad + badge premium",
      visibilidad: { prioridadResultados: 3, badge: "premium", destacadoHome: true },
      limites: { fotosMax: 10, galeriaMax: 10, actualizacionesMes: 8 },
      activo: true,
    },
    vip: {
      id: "vip",
      nombre: "VIP",
      orden: 4,
      descripcion: "Máxima visibilidad y soporte prioritario",
      visibilidad: { prioridadResultados: 4, badge: "vip", destacadoHome: true, soportePrioritario: true },
      limites: { fotosMax: 15, galeriaMax: 15, actualizacionesMes: 999 },
      activo: true,
    },
  },
  factoresPeriodo: {
    semanal: 0.35,
    quincenal: 0.65,
    mensual: 1,
  },
  periodosComercialesFuturos: {
    anual: { factor: 10, activo: false, nota: "Reservado; no forma parte de periodosComerciales MVP (semanal|quincenal|mensual)" },
  },
  preciosBase: {
    global: {
      basico: 299,
      destacado: 599,
      premium: 999,
      vip: 1499,
    },
    porFormulario: {
      adultos: { basico: 499, destacado: 899, premium: 1299, vip: 1999 },
      persona_independiente: { basico: 249, destacado: 499, premium: 799, vip: 1199 },
      profesionista_cedula: { basico: 399, destacado: 699, premium: 1099, vip: 1599 },
      negocio_empresa: { basico: 599, destacado: 999, premium: 1499, vip: 2499 },
    },
  },
  resolucionPrecio: {
    algoritmo: [
      "1. Iniciar con preciosBase.global[plan]",
      "2. Si existe preciosBase.porFormulario[formularioId][plan] → usar",
      "3. Aplicar override más específico: subcategoriaId > sectorId > formularioId > estado > pais > global",
      "4. Si override.modoPrecio === 'manual' → usar override.precioMensualBase",
      "5. Si override.modoPrecio === 'automatico' → base × override.factores",
      "6. Aplicar factorPeriodo (semanal/quincenal/mensual/anual)",
      "7. Redondear según redondeo (50 MXN)",
      "8. IVA ya incluido si ivaIncluido === true",
    ],
    especificidadOverride: ["subcategoriaId", "sectorId", "formularioId", "ciudad", "estado", "pais", "global"],
  },
  overrides: {
    descripcion: "Subcolección Firestore config_precios_perfiles/overrides/{overrideId}",
    campos: {
      activo: "boolean",
      planId: "basico|destacado|premium|vip",
      scope: { formularioId: "opcional", sectorId: "opcional", subcategoriaId: "opcional", pais: "opcional", estado: "opcional", ciudad: "opcional" },
      modoPrecio: "automatico|manual",
      precioMensualBase: "number",
      factoresAutomaticos: { semanal: 0.35, quincenal: 0.65, mensual: 1 },
      manual: { semanal: 0, quincenal: 0, mensual: 0, anual: 0 },
      notaAdmin: "string",
      actualizadoPor: "admin uid",
      actualizadoEn: "timestamp",
    },
    ejemplos: [
      {
        id: "adultos-cdmx-premium",
        activo: true,
        planId: "premium",
        scope: { formularioId: "adultos", ciudad: "Ciudad de México" },
        modoPrecio: "manual",
        precioMensualBase: 1599,
      },
      {
        id: "salud-global-destacado",
        activo: true,
        planId: "destacado",
        scope: { sectorId: "salud" },
        modoPrecio: "automatico",
        precioMensualBase: 799,
        factoresAutomaticos: { semanal: 0.35, quincenal: 0.65, mensual: 1 },
      },
    ],
  },
  historialCambios: {
    coleccion: "config_precios_perfiles_historial/{id}",
    campos: ["tipo", "antes", "despues", "autor", "timestamp", "motivo"],
    notas: "Escrito solo por admin humano o CI; IA Arquitecto solo lee.",
  },
  firestoreRecomendado: {
    documento: "config_precios_perfiles/planes_perfiles",
    subcolecciones: ["overrides", "historial"],
    lecturaPublica: "solo precio final cotizado en wizard (no overrides internos)",
    escritura: "admin solamente",
  },
  coherenciaPrecios: [
    { id: "PLAN_INACTIVO", si: "plan.activo === false", severidad: "error", mensaje: "No ofrecer plan inactivo en wizard." },
    { id: "PRECIO_CERO", si: "precioMensualBase <= 0", severidad: "error" },
    { id: "OVERRIDE_HUERFANO", si: "override.scope.subcategoriaId not in catalogo", severidad: "advertencia" },
    { id: "BASICO_MAYOR_PREMIUM", si: "precio.basico >= precio.premium", severidad: "error", mensaje: "Jerarquía de planes inconsistente." },
  ],
  alineacionBanners: {
    mismaMoneda: true,
    mismoRedondeo: 50,
    mismosFactoresPeriodo: true,
    coleccionParalela: "configuracion_publicidad vs config_precios_perfiles",
  },
  iaArquitecto: {
    puedeRecomendar: true,
    puedeModificar: false,
    tools: ["audit_precios_perfiles", "comparar_override_jerarquia", "detectar_precios_inconsistentes"],
  },
};

// Write files
const out = (name, obj) => {
  const p = path.join(root, "scripts", name);
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), "utf8");
  console.log("Written", p, "subcategorias:", obj.subcategorias?.length ?? "n/a");
};

out("config-registro-independiente-schema.json", schemaIndependiente);
out("config-registro-profesionista-schema.json", schemaProfesionista);
out("config-registro-negocio-schema.json", schemaNegocio);
// No sobrescribir precios si ya incluye arquitectura comercial extendida
const preciosPath = path.join(root, "scripts", "config-precios-planes-perfiles-schema.json");
if (fs.existsSync(preciosPath)) {
  const existing = JSON.parse(fs.readFileSync(preciosPath, "utf8"));
  if (existing.politicaPrecioCongelado || existing.separacionObligatoria) {
    console.log("Skip precios — conservar schema comercial existente");
  } else {
    out("config-precios-planes-perfiles-schema.json", schemaPrecios);
  }
} else {
  out("config-precios-planes-perfiles-schema.json", schemaPrecios);
}

console.log("Done. Independiente:", schemaIndependiente.subcategorias.length, "Profesionista:", schemaProfesionista.subcategorias.length, "Negocio:", schemaNegocio.subcategorias.length);
