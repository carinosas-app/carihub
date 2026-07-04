/**
 * MP-SALUD-DELTAS-V2 — campos extra, ocultos y opciones por subcategoría (50 subs).
 * Fuente: scripts/salud-sub-deltas-v1.mjs → registro-salud-blocks.js
 */
import { mergeHideAdultLeaks } from "./registro-cross-sector-policy.mjs";
import { mergeEnrichmentV2 } from "./salud-sub-enrichment-v2.mjs";

export const MODALIDAD_CLINICA = [
  { value: "consultorio", label: "Consultorio / clínica" },
  { value: "videollamada", label: "Videollamada / teleconsulta" },
  { value: "hibrido", label: "Presencial y en línea" },
];

export const MODALIDAD_CON_VISITA = [
  ...MODALIDAD_CLINICA,
  { value: "domicilio_paciente", label: "Visita al domicilio del paciente" },
];

const A_BASE = {
  extraFields: ["modalidadAtencionProfesional"],
  hideFields: mergeHideAdultLeaks(["consultaEnLinea"]),
  obligatoriosExtra: ["modalidadAtencionProfesional"],
  fieldOptions: { modalidadAtencionProfesional: MODALIDAD_CLINICA },
};

const B_CLINICA = {
  fieldOptions: { modalidadConsulta: MODALIDAD_CLINICA },
};

const B_VISITA = {
  fieldOptions: { modalidadConsulta: MODALIDAD_CON_VISITA },
};

/** Perfil por subcategoriaId — se fusiona sobre el pack base en mergeDelta */
export const SUB_EXTRA_PROFILES = {
  "medicos-generales": {
    ...A_BASE,
    blockTitle: "Medicina general",
    aliasPlaceholder: "Ej. Dra. Ana Pérez · Medicina general",
    fieldOptions: {
      ...A_BASE.fieldOptions,
      serviciosProfesionales: [
        "Consulta general",
        "Control de enfermedades crónicas",
        "Certificados médicos",
        "Vacunación",
        "Medicina preventiva",
        "Otro",
      ],
    },
    extraFields: [...A_BASE.extraFields, "idiomasAtencion"],
  },
  "especialistas-medicos": {
    ...A_BASE,
    blockTitle: "Especialista médico",
    aliasPlaceholder: "Ej. Dr. Luis · Cardiología",
    textosAyuda: { subespecialidad: "Subespecialidad si aplica (ej. cardiología intervencionista)." },
    extraFields: [...A_BASE.extraFields, "hospitalAfiliacion", "idiomasAtencion"],
  },
  psicologos: {
    ...A_BASE,
    blockTitle: "Psicología clínica",
    aliasPlaceholder: "Ej. Mtra. Sofía · Psicología clínica",
    extraFields: ["modalidadAtencionProfesional", "poblacionAtendida", "enfoqueTerapeutico"],
    hideFields: ["consultaEnLinea", "modalidadTraslado", "coberturaEmergencias"],
    obligatoriosExtra: ["modalidadAtencionProfesional", "poblacionAtendida", "enfoqueTerapeutico"],
    fieldOptions: {
      modalidadAtencionProfesional: MODALIDAD_CLINICA,
      serviciosProfesionales: [
        "Terapia individual",
        "Terapia de pareja",
        "Terapia familiar",
        "Terapia infantil",
        "Evaluación psicológica",
        "Orientación vocacional",
        "Otro",
      ],
      poblacionAtendida: ["Adultos", "Adolescentes", "Niños", "Parejas", "Familias", "Adultos mayores"],
      enfoqueTerapeutico: [
        "Cognitivo-conductual",
        "Humanista",
        "Sistémico / familiar",
        "Psicoanálisis",
        "Gestalt",
        "Integrativo",
        "Otro",
      ],
    },
    textosAyuda: {
      serviciosProfesionales: "No incluyas diagnósticos en texto público.",
      modalidadAtencionProfesional: "Indica si atiendes en consultorio, por videollamada o ambos.",
      enfoqueTerapeutico: "Abordajes terapéuticos que ofreces.",
    },
  },
  "ambulancias-y-traslado-medico": {
    blockTitle: "Ambulancias y traslado médico",
    aliasPlaceholder: "Ej. Ambulancias Médicas Norte",
    hideFields: ["consultaEnLinea", "subespecialidad"],
    extraFields: ["modalidadTraslado", "coberturaEmergencias", "tiempoRespuestaEmergencia"],
    obligatoriosExtra: ["modalidadTraslado", "coberturaEmergencias", "tiempoRespuestaEmergencia"],
    fieldOptions: {
      modalidadTraslado: ["Básica", "Medicalizada", "UCI móvil", "Traslado programado", "Neonatal", "Otro"],
      serviciosProfesionales: ["Traslado urgente", "Traslado programado", "Eventos", "Empresas", "Otro"],
    },
  },
  "equipo-medico": {
    blockTitle: "Equipo médico / instrumental",
    aliasPlaceholder: "Ej. Equipos Médicos MX",
    hideFields: ["consultaEnLinea", "subespecialidad"],
    extraFields: ["modalidadComercialEquipo"],
    fieldOptions: {
      serviciosProfesionales: ["Venta", "Renta", "Mantenimiento", "Capacitación de uso", "Instalación", "Otro"],
      modalidadComercialEquipo: ["Venta", "Renta", "Ambas"],
    },
  },
  "examenes-medicos-para-empresas": {
    blockTitle: "Exámenes médicos empresariales",
    ...A_BASE,
    extraFields: [...A_BASE.extraFields, "tamanoEmpresaAtendida"],
    fieldOptions: {
      ...A_BASE.fieldOptions,
      serviciosProfesionales: [
        "Examen médico de ingreso",
        "Examen médico periódico",
        "Espirometría",
        "Audiometría",
        "Electrocardiograma",
        "Paquete ejecutivo",
        "Otro",
      ],
    },
  },
  "servicios-medicos-empresariales": {
    ...A_BASE,
    blockTitle: "Servicios médicos empresariales",
    extraFields: [...A_BASE.extraFields, "tamanoEmpresaAtendida"],
    fieldOptions: {
      ...A_BASE.fieldOptions,
      serviciosProfesionales: ["Consultorio en planta", "Urgencias laborales", "Campamentos", "Capacitación", "Otro"],
    },
  },
  "seguros-medicos": {
    blockTitle: "Seguros médicos / agente",
    aliasPlaceholder: "Ej. Asesoría GMM · Ana Torres",
    hideFields: ["consultaEnLinea", "subespecialidad"],
    extraFields: ["aseguradorasRepresentadas", "modalidadAsesoriaSeguros"],
    obligatoriosExtra: ["aseguradorasRepresentadas", "modalidadAsesoriaSeguros"],
    fieldOptions: {
      serviciosProfesionales: ["Cotización", "Renovación", "Comparativa de planes", "Asesoría familiar", "Otro"],
      modalidadAsesoriaSeguros: MODALIDAD_CLINICA,
    },
    textosAyuda: { serviciosProfesionales: "Planes y coberturas — no promesas de aprobación." },
  },
  "gastos-medicos-mayores": {
    blockTitle: "Gastos médicos mayores",
    aliasPlaceholder: "Ej. Asesor GMM · Plan familiar",
    hideFields: ["consultaEnLinea", "subespecialidad"],
    extraFields: ["aseguradorasRepresentadas"],
    obligatoriosExtra: ["aseguradorasRepresentadas"],
    fieldOptions: {
      serviciosProfesionales: ["Individual", "Familiar", "Empresarial", "Comparativa", "Otro"],
    },
  },
  "dentistas-y-clinicas-dentales": {
    ...B_CLINICA,
    blockTitle: "Odontología / clínica dental",
    aliasPlaceholder: "Ej. Clínica Dental Sonrisa · Ortodoncia",
    extraFields: [
      "serviciosDentales",
      "equipamientoDental",
      "atencionOdontopediatria",
      "urgenciasDentales",
      "tipoEstablecimientoDental",
    ],
    obligatoriosExtra: ["serviciosDentales", "tipoEstablecimientoDental"],
    fieldOptions: {
      modalidadConsulta: MODALIDAD_CLINICA,
      especialidadServicio: [
        "Odontología general",
        "Ortodoncia",
        "Endodoncia",
        "Implantes",
        "Estética dental",
        "Periodoncia",
        "Odontopediatría",
        "Cirugía maxilofacial",
        "Otro",
      ],
      serviciosDentales: [
        "Limpieza dental",
        "Blanqueamiento",
        "Extracciones",
        "Endodoncia",
        "Ortodoncia (brackets)",
        "Invisalign / alineadores",
        "Implantes",
        "Coronas y puentes",
        "Carillas",
        "Urgencias dentales",
        "Odontopediatría",
        "Otro",
      ],
      equipamientoDental: [
        "Rayos X digital",
        "Panorámica",
        "Sedación consciente",
        "Láser dental",
        "CAD/CAM",
        "Escáner intraoral",
        "No aplica / consulta básica",
      ],
      tipoEstablecimientoDental: ["Consultorio individual", "Clínica dental", "Centro odontológico"],
      segurosAceptadosSalud: ["Particular", "GNP Dental", "MetLife", "AXA", "Moneda", "Seguro escolar", "Otro"],
    },
    textosAyuda: {
      serviciosDentales: "Marca los procedimientos que sí ofreces; ayuda a filtrar búsquedas.",
      equipamientoDental: "Equipamiento disponible en tu consultorio o clínica.",
      urgenciasDentales: "¿Atiendes urgencias dentales (dolor, fracturas, infecciones)?",
    },
  },
  psiquiatras: {
    ...B_CLINICA,
    blockTitle: "Psiquiatría",
    aliasPlaceholder: "Ej. Dr. Martínez · Psiquiatría",
    extraFields: ["poblacionAtendida", "prescripcionMedicamentos"],
    obligatoriosExtra: ["poblacionAtendida"],
    fieldOptions: {
      modalidadConsulta: MODALIDAD_CLINICA,
      especialidadServicio: [
        "Consulta psiquiátrica",
        "Seguimiento",
        "Psicoterapia de apoyo",
        "Adultos",
        "Adolescentes",
        "Otro",
      ],
      poblacionAtendida: ["Adultos", "Adolescentes", "Adultos mayores"],
      serviciosProfesionales: undefined,
    },
    textosAyuda: {
      especialidadServicio: "Si tienes cédula médica de psiquiatría, también puedes usar formulario Profesionista.",
      prescripcionMedicamentos: "Indica si tu práctica incluye prescripción medicamentosa.",
    },
  },
  nutriologos: {
    ...B_VISITA,
    blockTitle: "Nutrición clínica",
    aliasPlaceholder: "Ej. Lic. Carla · Nutrición clínica",
    extraFields: ["objetivosNutricion", "planesAlimenticios"],
    obligatoriosExtra: ["objetivosNutricion"],
    fieldOptions: {
      modalidadConsulta: MODALIDAD_CON_VISITA,
      especialidadServicio: ["Consulta nutricional", "Plan alimenticio", "Nutrición deportiva", "Clínica", "Pediátrica", "Otro"],
      objetivosNutricion: ["Pérdida de peso", "Ganancia muscular", "Control clínico", "Deportiva", "Vegetariana/vegana", "Otro"],
      planesAlimenticios: ["Personalizado", "Por objetivo", "Por patología", "Menús semanales", "Otro"],
    },
  },
  fisioterapeutas: {
    ...B_VISITA,
    blockTitle: "Fisioterapia / rehabilitación",
    extraFields: ["areasFisioterapia", "equipamientoFisioterapia"],
    obligatoriosExtra: ["areasFisioterapia"],
    fieldOptions: {
      modalidadConsulta: MODALIDAD_CON_VISITA,
      especialidadServicio: ["Rehabilitación", "Deportiva", "Neurológica", "Postoperatoria", "Geriatría", "Otro"],
      areasFisioterapia: ["Columna", "Rodilla", "Hombro", "Neurológica", "Deportiva", "Postoperatoria", "Otro"],
      equipamientoFisioterapia: ["Electroterapia", "Ultrasonido", "Laser", "Hidroterapia", "Pilates clínico", "Otro"],
    },
  },
  quiropracticos: {
    ...B_VISITA,
    blockTitle: "Quiropráctica",
    extraFields: ["tecnicasQuiropracticas"],
    fieldOptions: {
      modalidadConsulta: MODALIDAD_CON_VISITA,
      tecnicasQuiropracticas: ["Ajuste manual", "Instrumentado", "Deportiva", "Pediátrica", "Otro"],
    },
  },
  "oftalmologia-y-opticas": {
    ...B_CLINICA,
    blockTitle: "Oftalmología / óptica",
    extraFields: ["serviciosOftalmologia", "ventaLentes"],
    obligatoriosExtra: ["serviciosOftalmologia"],
    fieldOptions: {
      modalidadConsulta: MODALIDAD_CLINICA,
      especialidadServicio: ["Consulta oftalmológica", "Optometría", "Cirugía refractiva", "Oftalmopediatría", "Otro"],
      serviciosOftalmologia: ["Examen de la vista", "Graduación", "Lentes", "Lentes de contacto", "Cirugía LASIK", "Otro"],
      ventaLentes: ["Sí, en consultorio", "Sí, tienda anexa", "No, solo consulta"],
    },
  },
  "audiologia-y-aparatos-auditivos": {
    ...B_CLINICA,
    blockTitle: "Audiología",
    extraFields: ["serviciosAudiologia", "marcasAudifonos"],
    obligatoriosExtra: ["serviciosAudiologia"],
    fieldOptions: {
      modalidadConsulta: MODALIDAD_CLINICA,
      serviciosAudiologia: ["Audiometría", "Adaptación de audífonos", "Implante coclear (info)", "Tinnitus", "Otro"],
    },
  },
  "ginecologia-y-obstetricia": {
    ...B_CLINICA,
    blockTitle: "Ginecología y obstetricia",
    extraFields: ["serviciosGinecologia", "atencionParto"],
    obligatoriosExtra: ["serviciosGinecologia"],
    fieldOptions: {
      modalidadConsulta: MODALIDAD_CLINICA,
      serviciosGinecologia: ["Control prenatal", "Papanicolaou", "Ultrasonido obstétrico", "Planificación familiar", "Menopausia", "Otro"],
      atencionParto: ["Parto", "Cesárea", "No aplica"],
    },
  },
  urologia: {
    ...B_CLINICA,
    blockTitle: "Urología",
    extraFields: ["procedimientosUrologia"],
    fieldOptions: {
      modalidadConsulta: MODALIDAD_CLINICA,
      procedimientosUrologia: ["Consulta", "Cistoscopia", "Circuncisión", "Litotricia", "Otro"],
    },
  },
  pediatria: {
    ...B_CLINICA,
    blockTitle: "Pediatría",
    extraFields: ["edadesAtendidasPediatria", "vacunacionInfantil"],
    obligatoriosExtra: ["edadesAtendidasPediatria"],
    fieldOptions: {
      modalidadConsulta: MODALIDAD_CLINICA,
      edadesAtendidasPediatria: ["Recién nacidos", "Lactantes", "Preescolares", "Escolares", "Adolescentes"],
    },
  },
  dermatologia: {
    ...B_CLINICA,
    blockTitle: "Dermatología",
    extraFields: ["procedimientosDermatologia"],
    obligatoriosExtra: ["procedimientosDermatologia"],
    fieldOptions: {
      modalidadConsulta: MODALIDAD_CLINICA,
      procedimientosDermatologia: ["Consulta", "Biopsias", "Crioterapia", "Laser", "Acné", "Manchas", "Otro"],
    },
  },
  cardiologia: {
    ...B_CLINICA,
    blockTitle: "Cardiología",
    extraFields: ["estudiosCardiologia"],
    obligatoriosExtra: ["estudiosCardiologia"],
    fieldOptions: {
      modalidadConsulta: MODALIDAD_CLINICA,
      estudiosCardiologia: ["Electrocardiograma", "Ecocardiograma", "Holter", "Prueba de esfuerzo", "Otro"],
    },
  },
  "cirugia-general": {
    ...B_CLINICA,
    blockTitle: "Cirugía general",
    extraFields: ["procedimientosCirugia"],
    fieldOptions: {
      modalidadConsulta: MODALIDAD_CLINICA,
      procedimientosCirugia: ["Consulta preoperatoria", "Cirugía ambulatoria", "Hernias", "Vesícula", "Otro"],
    },
  },
  "cirugia-plastica-y-estetica": {
    ...B_CLINICA,
    blockTitle: "Cirugía plástica y estética",
    extraFields: ["procedimientosEsteticos", "cirugiaAmbulatoriaEstetica"],
    obligatoriosExtra: ["procedimientosEsteticos"],
    fieldOptions: {
      modalidadConsulta: MODALIDAD_CLINICA,
      procedimientosEsteticos: ["Rinoplastia", "Abdominoplastia", "Lipoescultura", "Mamoplastia", "Blefaroplastia", "Otro"],
    },
  },
  "medicina-estetica": {
    ...B_CLINICA,
    blockTitle: "Medicina estética",
    extraFields: ["tratamientosEsteticos", "equipamientoEstetico"],
    obligatoriosExtra: ["tratamientosEsteticos"],
    fieldOptions: {
      modalidadConsulta: MODALIDAD_CLINICA,
      tratamientosEsteticos: ["Botox", "Rellenos", "Laser", "Peeling", "Mesoterapia", "Otro"],
    },
  },
  "enfermeria-a-domicilio": {
    blockTitle: "Enfermería a domicilio",
    aliasPlaceholder: "Ej. Enfermería Domicilio CDMX",
    extraFields: ["certificacionEnfermeria", "turnosEnfermeria"],
    obligatoriosExtra: ["certificacionEnfermeria", "turnosEnfermeria"],
    fieldOptions: {
      serviciosCuidado: ["Curaciones", "Aplicación de medicamentos", "Toma de signos", "Cuidados paliativos", "Sondas / accesos", "Otro"],
      turnosEnfermeria: ["Diurno", "Nocturno", "24 horas", "Por evento"],
    },
  },
  "cuidado-de-adultos-mayores": {
    blockTitle: "Cuidado de adultos mayores",
    extraFields: ["tipoCuidadoAdultoMayor", "turnosCuidado"],
    obligatoriosExtra: ["tipoCuidadoAdultoMayor"],
    fieldOptions: {
      serviciosCuidado: ["Compañía", "Higiene personal", "Movilización", "Administración de medicamentos", "Turno nocturno", "Otro"],
      tipoCuidadoAdultoMayor: ["Acompañamiento", "Cuidados básicos", "Cuidados especializados", "Respiro familiar"],
      turnosCuidado: ["Por horas", "Medio día", "Día completo", "Noche", "24 horas"],
    },
  },
  "rehabilitacion-fisica": {
    blockTitle: "Rehabilitación física",
    extraFields: ["areasRehabilitacion"],
    fieldOptions: {
      serviciosCuidado: ["Terapia física", "Ejercicio terapéutico", "Electroterapia", "Hidroterapia", "Otro"],
      areasRehabilitacion: ["Postoperatorio", "Neurológica", "Deportiva", "Geriatría", "Otro"],
    },
  },
  "terapias-de-lenguaje": {
    blockTitle: "Terapia de lenguaje",
    extraFields: ["poblacionLenguaje"],
    obligatoriosExtra: ["poblacionLenguaje"],
    fieldOptions: {
      serviciosCuidado: ["Lenguaje infantil", "Deglución", "Voz", "Neurológica", "Audición", "Otro"],
      poblacionLenguaje: ["Niños", "Adolescentes", "Adultos", "Adultos mayores"],
    },
  },
  "terapias-de-aprendizaje": {
    blockTitle: "Terapia de aprendizaje",
    extraFields: ["areasAprendizaje"],
    obligatoriosExtra: ["areasAprendizaje"],
    fieldOptions: {
      serviciosCuidado: ["Dislexia", "TDAH apoyo", "Integración sensorial", "Habilidades de estudio", "Otro"],
      areasAprendizaje: ["Lectoescritura", "Atención", "Memoria", "Integración sensorial", "Otro"],
    },
  },
  "laboratorios-clinicos": {
    blockTitle: "Laboratorio clínico",
    extraFields: ["requiereAyuno", "citaPreviaLab"],
    fieldOptions: {
      estudiosOfrecidos: ["Química sanguínea", "Hemograma", "Uroanálisis", "Perfil lipídico", "Hormonas", "COVID/PCR", "Otro"],
    },
  },
  "estudios-de-diagnostico-e-imagen": {
    blockTitle: "Diagnóstico por imagen",
    extraFields: ["equipamientoImagen", "citaPreviaLab"],
    fieldOptions: {
      estudiosOfrecidos: ["Rayos X", "Ultrasonido", "Tomografía", "Resonancia magnética", "Mamografía", "Densitometría", "Otro"],
    },
  },
  "ultrasonidos-y-rayos-x": {
    blockTitle: "Ultrasonido y rayos X",
    fieldOptions: {
      estudiosOfrecidos: ["Ultrasonido", "Rayos X", "Doppler", "Ecocardiograma", "Otro"],
    },
  },
  "laboratorios-dentales": {
    blockTitle: "Laboratorio dental",
    extraFields: ["productosLaboratorioDental"],
    fieldOptions: {
      estudiosOfrecidos: ["Prótesis fija", "Prótesis removible", "Coronas", "Ortodoncia (aparatos)", "Otro"],
    },
  },
  "bancos-de-sangre": {
    blockTitle: "Banco de sangre",
    extraFields: ["tipoDonacionSangre"],
    fieldOptions: {
      estudiosOfrecidos: ["Donación", "Tipificación", "Plasma", "Plaquetas", "Otro"],
    },
  },
  farmacias: {
    blockTitle: "Farmacia",
    extraFields: ["serviciosFarmacia", "entregaDomicilioFarmacia"],
    fieldOptions: {
      categoriasFarmacia: ["Medicamentos", "Genéricos", "OTC", "Dermocosmética", "Material de curación", "Otro"],
      serviciosFarmacia: ["Surtido completo", "Entrega a domicilio", "Inyectables", "Toma de presión", "Otro"],
    },
  },
  "farmacias-especializadas": {
    blockTitle: "Farmacia especializada",
    extraFields: ["especialidadFarmacia"],
    fieldOptions: {
      categoriasFarmacia: ["Alto costo", "Oncología", "Controlados (con receta)", "Biologics", "Otro"],
    },
  },
  "protesis-y-ortesis": {
    blockTitle: "Prótesis y órtesis",
    extraFields: ["tiposProtesis"],
    fieldOptions: {
      categoriasFarmacia: ["Prótesis", "Órtesis", "Ayudas técnicas", "Plantillas", "Otro"],
    },
  },
  "oxigeno-medicinal": {
    blockTitle: "Oxígeno medicinal",
    extraFields: ["modalidadOxigeno"],
    fieldOptions: {
      categoriasFarmacia: ["Tanques", "Concentradores", "Renta", "Recargas", "Otro"],
      modalidadOxigeno: ["Venta", "Renta", "Ambas"],
    },
  },
  "clinicas-medicas": {
    blockTitle: "Clínica médica",
    extraFields: ["especialidadesDisponiblesClinica", "estacionamientoClinica"],
    fieldOptions: {
      serviciosClinica: ["Consulta externa", "Urgencias", "Hospitalización corta", "Laboratorio", "Imagen", "Cirugía ambulatoria", "Otro"],
    },
  },
  "centros-de-rehabilitacion": {
    blockTitle: "Centro de rehabilitación",
    extraFields: ["tiposRehabilitacionCentro"],
    fieldOptions: {
      serviciosClinica: ["Física", "Adicciones", "Neurológica", "Deportiva", "Ocupacional", "Otro"],
    },
  },
  "centros-de-salud-mental": {
    blockTitle: "Centro de salud mental",
    extraFields: ["serviciosSaludMentalCentro", "modalidadCentroSaludMental"],
    obligatoriosExtra: ["serviciosSaludMentalCentro", "modalidadCentroSaludMental"],
    fieldOptions: {
      serviciosClinica: ["Psicoterapia individual", "Psicoterapia grupal", "Psiquiatría", "Internamiento ambulatorio", "Otro"],
      serviciosSaludMentalCentro: ["Individual", "Pareja", "Familiar", "Infantil", "Adolescentes", "Grupos"],
      modalidadCentroSaludMental: MODALIDAD_CLINICA,
    },
  },
  "clinicas-de-adicciones": {
    blockTitle: "Clínica de adicciones",
    extraFields: ["programasAdicciones", "internamientoAdicciones"],
    fieldOptions: {
      serviciosClinica: ["Desintoxicación", "Residencial", "Ambulatorio", "Familiares", "Otro"],
    },
  },
  "clinicas-de-fertilidad": {
    blockTitle: "Clínica de fertilidad",
    extraFields: ["tratamientosFertilidad"],
    obligatoriosExtra: ["tratamientosFertilidad"],
    fieldOptions: {
      serviciosClinica: ["Consulta", "FIV", "Inseminación", "Preservación", "Otro"],
      tratamientosFertilidad: ["FIV", "ICSI", "Inseminación", "Ovodonación", "Preservación de óvulos", "Otro"],
    },
  },
  "seguridad-e-higiene-industrial": {
    blockTitle: "Seguridad e higiene industrial",
    extraFields: ["normasIndustriales"],
    fieldOptions: {
      serviciosClinica: ["Evaluación de riesgos", "Capacitación", "Monitoreo ambiental", "NOM-035", "Otro"],
    },
  },
  "hospitales-privados": {
    blockTitle: "Hospital privado",
    extraFields: ["camasHospital", "quirfanosHospital"],
    fieldOptions: {
      serviciosHospital: ["Urgencias", "Hospitalización", "Cirugía", "UCI", "Parto", "Neonatología", "Otro"],
      nivelesAtencion: ["Primer nivel", "Segundo nivel", "Tercer nivel"],
    },
  },
  "casas-de-retiro": {
    blockTitle: "Casa de retiro",
    extraFields: ["tipoResidenciaRetiro"],
    fieldOptions: {
      serviciosResidencia: ["Alojamiento", "Alimentación", "Enfermería", "Actividades recreativas", "Otro"],
    },
  },
  "asilos-y-residencias-asistidas": {
    blockTitle: "Asilo / residencia asistida",
    extraFields: ["nivelAsistenciaResidencia"],
    fieldOptions: {
      serviciosResidencia: ["Cuidado 24h", "Asistencia médica", "Rehabilitación", "Memoria / Alzheimer", "Otro"],
      nivelAsistenciaResidencia: ["Independiente", "Asistido", "Memoria", "Cuidados paliativos"],
    },
  },
  "servicios-funerarios": {
    blockTitle: "Servicios funerarios",
    extraFields: ["planesFunerarios"],
    fieldOptions: {
      serviciosFunerarios: ["Velación", "Cremación", "Traslado", "Previsión funeraria", "Embalsamamiento", "Otro"],
    },
  },
  "salud-ocupacional": {
    blockTitle: "Salud ocupacional",
    extraFields: ["certificacionesCorporativas"],
    fieldOptions: {
      serviciosCorporativos: ["Examen preocupacional", "Examen periódico", "Programa NOM-035", "Campo / planta", "Capacitación", "Otro"],
    },
  },
  "medicina-del-trabajo": {
    blockTitle: "Medicina del trabajo",
    extraFields: ["industriasMedicinaTrabajo"],
    fieldOptions: {
      serviciosCorporativos: ["Atención en planta", "Urgencias laborales", "Ergonomía", "Toxicología", "Otro"],
    },
  },
};

for (const subId of Object.keys(SUB_EXTRA_PROFILES)) {
  SUB_EXTRA_PROFILES[subId] = mergeEnrichmentV2(SUB_EXTRA_PROFILES[subId], subId);
  SUB_EXTRA_PROFILES[subId].hideFields = mergeHideAdultLeaks(SUB_EXTRA_PROFILES[subId].hideFields || []);
}
