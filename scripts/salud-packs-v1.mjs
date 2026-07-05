/**
 * MP-SALUD-DELTAS-V1 — packs A–H y mapa subcategoría → pack (50 subs sector salud).
 */
export const PACK_IDS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export const PACK_LABELS = {
  A: "Profesional con cédula",
  B: "Consulta / especialidad",
  C: "Cuidado y rehabilitación",
  D: "Diagnóstico y laboratorio",
  E: "Farmacia y productos médicos",
  F: "Clínica / centro de salud",
  G: "Institución / residencial",
  H: "Salud corporativa / ocupacional",
};

/** Campos nuevos — persona_independiente + negocio_empresa */
export const SALUD_FIELD_REGISTRY = {
  especialidadServicio: {
    id: "especialidadServicio",
    label: "Especialidad o servicio principal",
    tipo: "text",
    maxLength: 120,
    iaCopy: true,
  },
  modalidadConsulta: {
    id: "modalidadConsulta",
    label: "Modalidad de atención clínica",
    tipo: "enum",
    opciones: ["consultorio", "videollamada", "hibrido", "domicilio_paciente"],
  },
  modalidadAtencionProfesional: {
    id: "modalidadAtencionProfesional",
    label: "Modalidad de atención",
    tipo: "enum",
    opciones: ["consultorio", "videollamada", "hibrido"],
  },
  poblacionAtendida: {
    id: "poblacionAtendida",
    label: "Población que atiendes",
    tipo: "checklist",
    iaCopy: true,
  },
  enfoqueTerapeutico: {
    id: "enfoqueTerapeutico",
    label: "Enfoque / abordaje terapéutico",
    tipo: "checklist",
    iaCopy: true,
  },
  serviciosDentales: {
    id: "serviciosDentales",
    label: "Servicios dentales que ofreces",
    tipo: "checklist",
    iaCopy: true,
  },
  equipamientoDental: {
    id: "equipamientoDental",
    label: "Equipamiento disponible",
    tipo: "checklist",
  },
  atencionOdontopediatria: {
    id: "atencionOdontopediatria",
    label: "¿Atiendes niños (odontopediatría)?",
    tipo: "boolean",
  },
  urgenciasDentales: {
    id: "urgenciasDentales",
    label: "¿Atiendes urgencias dentales?",
    tipo: "boolean",
  },
  tipoEstablecimientoDental: {
    id: "tipoEstablecimientoDental",
    label: "Tipo de establecimiento",
    tipo: "enum",
    opciones: ["consultorio_individual", "clinica_dental", "centro_odontologico"],
  },
  idiomasAtencion: {
    id: "idiomasAtencion",
    label: "Idiomas de atención",
    tipo: "text",
    maxLength: 120,
  },
  hospitalAfiliacion: {
    id: "hospitalAfiliacion",
    label: "Hospital(es) de afiliación (opcional)",
    tipo: "text",
    maxLength: 200,
  },
  tiempoRespuestaEmergencia: {
    id: "tiempoRespuestaEmergencia",
    label: "Tiempo de respuesta estimado",
    tipo: "text",
    maxLength: 80,
  },
  modalidadComercialEquipo: {
    id: "modalidadComercialEquipo",
    label: "Modalidad comercial",
    tipo: "enum",
    opciones: ["venta", "renta", "ambas"],
  },
  tamanoEmpresaAtendida: {
    id: "tamanoEmpresaAtendida",
    label: "Tamaño de empresas atendidas",
    tipo: "checklist",
  },
  aseguradorasRepresentadas: {
    id: "aseguradorasRepresentadas",
    label: "Aseguradoras que representas",
    tipo: "text",
    maxLength: 200,
  },
  modalidadAsesoriaSeguros: {
    id: "modalidadAsesoriaSeguros",
    label: "Modalidad de asesoría",
    tipo: "enum",
    opciones: ["consultorio", "videollamada", "hibrido"],
  },
  prescripcionMedicamentos: {
    id: "prescripcionMedicamentos",
    label: "¿Incluye prescripción medicamentosa?",
    tipo: "boolean",
  },
  objetivosNutricion: {
    id: "objetivosNutricion",
    label: "Objetivos que trabajas",
    tipo: "checklist",
  },
  planesAlimenticios: {
    id: "planesAlimenticios",
    label: "Tipos de plan alimenticio",
    tipo: "checklist",
  },
  areasFisioterapia: {
    id: "areasFisioterapia",
    label: "Áreas / enfoques de fisioterapia",
    tipo: "checklist",
  },
  equipamientoFisioterapia: {
    id: "equipamientoFisioterapia",
    label: "Equipamiento disponible",
    tipo: "checklist",
  },
  tecnicasQuiropracticas: {
    id: "tecnicasQuiropracticas",
    label: "Técnicas quiroprácticas",
    tipo: "checklist",
  },
  serviciosOftalmologia: {
    id: "serviciosOftalmologia",
    label: "Servicios oftalmológicos",
    tipo: "checklist",
  },
  ventaLentes: {
    id: "ventaLentes",
    label: "Venta de lentes",
    tipo: "enum",
    opciones: ["consultorio", "tienda_anexa", "no"],
  },
  serviciosAudiologia: {
    id: "serviciosAudiologia",
    label: "Servicios de audiología",
    tipo: "checklist",
  },
  marcasAudifonos: {
    id: "marcasAudifonos",
    label: "Marcas de audífonos (opcional)",
    tipo: "text",
    maxLength: 120,
  },
  serviciosGinecologia: {
    id: "serviciosGinecologia",
    label: "Servicios gineco-obstétricos",
    tipo: "checklist",
  },
  atencionParto: {
    id: "atencionParto",
    label: "Atención de parto",
    tipo: "checklist",
  },
  procedimientosUrologia: {
    id: "procedimientosUrologia",
    label: "Procedimientos urológicos",
    tipo: "checklist",
  },
  edadesAtendidasPediatria: {
    id: "edadesAtendidasPediatria",
    label: "Edades que atiendes",
    tipo: "checklist",
  },
  vacunacionInfantil: {
    id: "vacunacionInfantil",
    label: "¿Aplicas vacunación infantil?",
    tipo: "boolean",
  },
  procedimientosDermatologia: {
    id: "procedimientosDermatologia",
    label: "Procedimientos dermatológicos",
    tipo: "checklist",
  },
  estudiosCardiologia: {
    id: "estudiosCardiologia",
    label: "Estudios cardiológicos",
    tipo: "checklist",
  },
  procedimientosCirugia: {
    id: "procedimientosCirugia",
    label: "Procedimientos quirúrgicos",
    tipo: "checklist",
  },
  procedimientosEsteticos: {
    id: "procedimientosEsteticos",
    label: "Procedimientos estéticos",
    tipo: "checklist",
  },
  cirugiaAmbulatoriaEstetica: {
    id: "cirugiaAmbulatoriaEstetica",
    label: "¿Cirugía ambulatoria en consultorio?",
    tipo: "boolean",
  },
  tratamientosEsteticos: {
    id: "tratamientosEsteticos",
    label: "Tratamientos estéticos",
    tipo: "checklist",
  },
  equipamientoEstetico: {
    id: "equipamientoEstetico",
    label: "Equipamiento estético",
    tipo: "checklist",
  },
  certificacionEnfermeria: {
    id: "certificacionEnfermeria",
    label: "Cédula / certificación de enfermería",
    tipo: "text",
    maxLength: 120,
  },
  turnosEnfermeria: {
    id: "turnosEnfermeria",
    label: "Turnos disponibles",
    tipo: "checklist",
  },
  tipoCuidadoAdultoMayor: {
    id: "tipoCuidadoAdultoMayor",
    label: "Tipo de cuidado",
    tipo: "checklist",
  },
  turnosCuidado: {
    id: "turnosCuidado",
    label: "Turnos de cuidado",
    tipo: "checklist",
  },
  areasRehabilitacion: {
    id: "areasRehabilitacion",
    label: "Áreas de rehabilitación",
    tipo: "checklist",
  },
  poblacionLenguaje: {
    id: "poblacionLenguaje",
    label: "Población atendida",
    tipo: "checklist",
  },
  areasAprendizaje: {
    id: "areasAprendizaje",
    label: "Áreas de aprendizaje",
    tipo: "checklist",
  },
  requiereAyuno: {
    id: "requiereAyuno",
    label: "¿Informas requisitos de ayuno?",
    tipo: "boolean",
  },
  citaPreviaLab: {
    id: "citaPreviaLab",
    label: "¿Requiere cita previa?",
    tipo: "boolean",
  },
  equipamientoImagen: {
    id: "equipamientoImagen",
    label: "Equipamiento de imagen",
    tipo: "checklist",
  },
  productosLaboratorioDental: {
    id: "productosLaboratorioDental",
    label: "Productos del laboratorio",
    tipo: "checklist",
  },
  tipoDonacionSangre: {
    id: "tipoDonacionSangre",
    label: "Tipos de donación",
    tipo: "checklist",
  },
  serviciosFarmacia: {
    id: "serviciosFarmacia",
    label: "Servicios adicionales",
    tipo: "checklist",
  },
  entregaDomicilioFarmacia: {
    id: "entregaDomicilioFarmacia",
    label: "¿Entrega a domicilio?",
    tipo: "boolean",
  },
  especialidadFarmacia: {
    id: "especialidadFarmacia",
    label: "Especialidad de la farmacia",
    tipo: "text",
    maxLength: 120,
  },
  tiposProtesis: {
    id: "tiposProtesis",
    label: "Tipos de prótesis / órtesis",
    tipo: "checklist",
  },
  modalidadOxigeno: {
    id: "modalidadOxigeno",
    label: "Modalidad de oxígeno",
    tipo: "enum",
    opciones: ["venta", "renta", "ambas"],
  },
  especialidadesDisponiblesClinica: {
    id: "especialidadesDisponiblesClinica",
    label: "Especialidades en la clínica",
    tipo: "text",
    maxLength: 300,
  },
  estacionamientoClinica: {
    id: "estacionamientoClinica",
    label: "¿Estacionamiento?",
    tipo: "boolean",
  },
  tiposRehabilitacionCentro: {
    id: "tiposRehabilitacionCentro",
    label: "Tipos de rehabilitación",
    tipo: "checklist",
  },
  serviciosSaludMentalCentro: {
    id: "serviciosSaludMentalCentro",
    label: "Servicios de salud mental",
    tipo: "checklist",
  },
  modalidadCentroSaludMental: {
    id: "modalidadCentroSaludMental",
    label: "Modalidad de atención",
    tipo: "enum",
    opciones: ["consultorio", "videollamada", "hibrido"],
  },
  programasAdicciones: {
    id: "programasAdicciones",
    label: "Programas de adicciones",
    tipo: "checklist",
  },
  internamientoAdicciones: {
    id: "internamientoAdicciones",
    label: "¿Internamiento residencial?",
    tipo: "boolean",
  },
  tratamientosFertilidad: {
    id: "tratamientosFertilidad",
    label: "Tratamientos de fertilidad",
    tipo: "checklist",
  },
  normasIndustriales: {
    id: "normasIndustriales",
    label: "Normas / certificaciones",
    tipo: "checklist",
  },
  camasHospital: {
    id: "camasHospital",
    label: "Número de camas (aprox.)",
    tipo: "text",
    maxLength: 40,
  },
  quirfanosHospital: {
    id: "quirfanosHospital",
    label: "Quirófanos disponibles",
    tipo: "text",
    maxLength: 40,
  },
  tipoResidenciaRetiro: {
    id: "tipoResidenciaRetiro",
    label: "Tipo de residencia",
    tipo: "enum",
    opciones: ["retiro_activo", "asistido", "memoria"],
  },
  nivelAsistenciaResidencia: {
    id: "nivelAsistenciaResidencia",
    label: "Nivel de asistencia",
    tipo: "checklist",
  },
  planesFunerarios: {
    id: "planesFunerarios",
    label: "Planes funerarios",
    tipo: "checklist",
  },
  certificacionesCorporativas: {
    id: "certificacionesCorporativas",
    label: "Certificaciones corporativas",
    tipo: "text",
    maxLength: 200,
  },
  industriasMedicinaTrabajo: {
    id: "industriasMedicinaTrabajo",
    label: "Industrias atendidas",
    tipo: "checklist",
  },
  segurosAceptadosSalud: {
    id: "segurosAceptadosSalud",
    label: "Seguros / prepagos aceptados",
    tipo: "checklist",
    iaCopy: true,
  },
  atencionDomicilioSalud: {
    id: "atencionDomicilioSalud",
    label: "¿Atención a domicilio?",
    tipo: "enum",
    opciones: ["si", "no"],
  },
  serviciosCuidado: {
    id: "serviciosCuidado",
    label: "Servicios de cuidado",
    tipo: "checklist",
    iaCopy: true,
  },
  coberturaDomicilioZona: {
    id: "coberturaDomicilioZona",
    label: "Zona de cobertura a domicilio",
    tipo: "text",
    maxLength: 200,
  },
  estudiosOfrecidos: {
    id: "estudiosOfrecidos",
    label: "Estudios o pruebas ofrecidas",
    tipo: "checklist",
    iaCopy: true,
  },
  tiempoEntregaResultados: {
    id: "tiempoEntregaResultados",
    label: "Tiempo estimado de resultados",
    tipo: "text",
    maxLength: 120,
  },
  tomaMuestrasDomicilio: {
    id: "tomaMuestrasDomicilio",
    label: "¿Toma de muestras a domicilio?",
    tipo: "boolean",
  },
  categoriasFarmacia: {
    id: "categoriasFarmacia",
    label: "Categorías de productos",
    tipo: "checklist",
    iaCopy: true,
  },
  surtidoFarmaceutico: {
    id: "surtidoFarmaceutico",
    label: "Surtido principal",
    tipo: "text",
    maxLength: 200,
  },
  ventaConReceta: {
    id: "ventaConReceta",
    label: "Venta con receta médica",
    tipo: "enum",
    opciones: ["si", "no", "ambas"],
  },
  serviciosClinica: {
    id: "serviciosClinica",
    label: "Servicios de la clínica",
    tipo: "checklist",
    iaCopy: true,
  },
  especialidadesClinica: {
    id: "especialidadesClinica",
    label: "Especialidades disponibles",
    tipo: "tags",
    iaCopy: true,
  },
  urgencias24h: {
    id: "urgencias24h",
    label: "¿Urgencias 24 horas?",
    tipo: "boolean",
  },
  serviciosHospital: {
    id: "serviciosHospital",
    label: "Servicios hospitalarios",
    tipo: "checklist",
    iaCopy: true,
  },
  nivelesAtencion: {
    id: "nivelesAtencion",
    label: "Niveles de atención",
    tipo: "checklist",
  },
  serviciosResidencia: {
    id: "serviciosResidencia",
    label: "Servicios de la residencia",
    tipo: "checklist",
    iaCopy: true,
  },
  capacidadResidentes: {
    id: "capacidadResidentes",
    label: "Capacidad de residentes",
    tipo: "text",
    maxLength: 80,
  },
  serviciosFunerarios: {
    id: "serviciosFunerarios",
    label: "Servicios funerarios",
    tipo: "checklist",
    iaCopy: true,
  },
  serviciosCorporativos: {
    id: "serviciosCorporativos",
    label: "Servicios corporativos",
    tipo: "checklist",
    iaCopy: true,
  },
  coberturaEmpresas: {
    id: "coberturaEmpresas",
    label: "Tipo de empresas / industrias atendidas",
    tipo: "text",
    maxLength: 200,
  },
  modalidadTraslado: {
    id: "modalidadTraslado",
    label: "Modalidad de traslado",
    tipo: "checklist",
  },
  coberturaEmergencias: {
    id: "coberturaEmergencias",
    label: "Cobertura de emergencias",
    tipo: "text",
    maxLength: 200,
  },
  diferenciadorSalud: {
    id: "diferenciadorSalud",
    label: "Tu enfoque / lo que te distingue",
    tipo: "text",
    maxLength: 160,
    iaCopy: true,
  },
  referenciasInterconsulta: {
    id: "referenciasInterconsulta",
    label: "Referencias con otros especialistas",
    tipo: "enum",
    opciones: ["recibo_y_envio", "solo_recibo", "solo_envio", "convenio_clinica", "no"],
  },
  coberturaAtencionSalud: {
    id: "coberturaAtencionSalud",
    label: "Zona donde atiendes",
    tipo: "text",
    maxLength: 120,
    iaCopy: true,
  },
};

export const SUB_TO_PACK = {
  "medicos-generales": "A",
  "especialistas-medicos": "A",
  psicologos: "A",
  "ambulancias-y-traslado-medico": "A",
  "equipo-medico": "A",
  "examenes-medicos-para-empresas": "A",
  "servicios-medicos-empresariales": "A",
  "seguros-medicos": "A",
  "gastos-medicos-mayores": "A",
  "dentistas-y-clinicas-dentales": "B",
  psiquiatras: "B",
  nutriologos: "B",
  fisioterapeutas: "B",
  quiropracticos: "B",
  "oftalmologia-y-opticas": "B",
  "audiologia-y-aparatos-auditivos": "B",
  "ginecologia-y-obstetricia": "B",
  urologia: "B",
  pediatria: "B",
  dermatologia: "B",
  cardiologia: "B",
  "cirugia-general": "B",
  "cirugia-plastica-y-estetica": "B",
  "medicina-estetica": "B",
  "enfermeria-a-domicilio": "C",
  "cuidado-de-adultos-mayores": "C",
  "rehabilitacion-fisica": "C",
  "terapias-de-lenguaje": "C",
  "terapias-de-aprendizaje": "C",
  "laboratorios-clinicos": "D",
  "estudios-de-diagnostico-e-imagen": "D",
  "ultrasonidos-y-rayos-x": "D",
  "laboratorios-dentales": "D",
  "bancos-de-sangre": "D",
  farmacias: "E",
  "farmacias-especializadas": "E",
  "protesis-y-ortesis": "E",
  "oxigeno-medicinal": "E",
  "clinicas-medicas": "F",
  "centros-de-rehabilitacion": "F",
  "centros-de-salud-mental": "F",
  "clinicas-de-adicciones": "F",
  "clinicas-de-fertilidad": "F",
  "seguridad-e-higiene-industrial": "F",
  "hospitales-privados": "G",
  "casas-de-retiro": "G",
  "asilos-y-residencias-asistidas": "G",
  "servicios-funerarios": "G",
  "salud-ocupacional": "H",
  "medicina-del-trabajo": "H",
};

export const PACK_A_PROFESIONISTA_SUBS = new Set(
  Object.entries(SUB_TO_PACK)
    .filter(([, p]) => p === "A")
    .map(([id]) => id)
);

export const PACK_F_NEGOCIO_SUBS = new Set(
  Object.entries(SUB_TO_PACK)
    .filter(([, p]) => p === "F")
    .map(([id]) => id)
);

export const PACK_G_NEGOCIO_SUBS = new Set(
  Object.entries(SUB_TO_PACK)
    .filter(([, p]) => p === "G")
    .map(([id]) => id)
);

export function packPlantillaKey(pack) {
  return `salud_pack_${pack.toLowerCase()}`;
}

export function formularioIdForSub(subId, pack) {
  if (PACK_A_PROFESIONISTA_SUBS.has(subId)) return "profesionista_cedula";
  if (PACK_F_NEGOCIO_SUBS.has(subId) || PACK_G_NEGOCIO_SUBS.has(subId)) return "negocio_empresa";
  return "persona_independiente";
}

export function buildPackPlantillas() {
  const p = {};
  p.salud_pack_a = {
    heredaDe: "profesional_salud",
    deltaPack: "A",
    formularioId: "profesionista_cedula",
    camposPublicosPerfil: ["especialidad", "serviciosProfesionales", "segurosAceptados", "consultaEnLinea"],
    obligatoriosExtra: ["especialidad", "serviciosProfesionales", "horarioAtencion", "precioConsulta", "segurosAceptados"],
    keywordsIA: ["médico", "cédula", "consulta", "especialidad"],
    textosAyuda: {
      especialidad: "Debe coincidir con tu cédula o ser coherente — admin puede revisar.",
      serviciosProfesionales: "Consultas, procedimientos u otros servicios que ofreces.",
    },
  };
  p.salud_pack_b = {
    heredaDe: "persona_servicio_salud_auxiliar",
    deltaPack: "B",
    camposPublicosPerfil: ["especialidadServicio", "modalidadConsulta", "segurosAceptadosSalud"],
    obligatoriosExtra: ["especialidadServicio", "modalidadConsulta", "tarifaDesde", "horarioDetalle", "certificaciones"],
    keywordsIA: ["consulta", "especialidad", "salud"],
  };
  p.salud_pack_c = {
    heredaDe: "persona_servicio_salud_auxiliar",
    deltaPack: "C",
    camposPublicosPerfil: ["serviciosCuidado", "atencionDomicilioSalud", "coberturaDomicilioZona"],
    obligatoriosExtra: ["serviciosCuidado", "atencionDomicilioSalud", "certificaciones", "horarioDetalle", "tarifaDesde"],
    keywordsIA: ["cuidado", "domicilio", "rehabilitación"],
  };
  p.salud_pack_d = {
    heredaDe: "persona_servicio_salud_auxiliar",
    deltaPack: "D",
    camposPublicosPerfil: ["estudiosOfrecidos", "tiempoEntregaResultados", "tomaMuestrasDomicilio"],
    obligatoriosExtra: ["estudiosOfrecidos", "tiempoEntregaResultados", "horarioDetalle", "geo"],
    keywordsIA: ["laboratorio", "diagnóstico", "estudios"],
  };
  p.salud_pack_e = {
    heredaDe: "persona_servicio_salud_auxiliar",
    deltaPack: "E",
    camposPublicosPerfil: ["categoriasFarmacia", "surtidoFarmaceutico", "ventaConReceta"],
    obligatoriosExtra: ["categoriasFarmacia", "surtidoFarmaceutico", "horarioDetalle", "geo"],
    keywordsIA: ["farmacia", "productos médicos", "surtido"],
  };
  p.salud_pack_f = {
    heredaDe: "negocio_servicios_local",
    deltaPack: "F",
    formularioId: "negocio_empresa",
    camposPublicosPerfil: ["serviciosClinica", "especialidadesClinica", "urgencias24h"],
    obligatoriosExtra: ["nombreComercial", "serviciosClinica", "especialidadesClinica", "direccion", "horarioDetalle", "geo"],
    keywordsIA: ["clínica", "centro de salud", "consultorio"],
  };
  p.salud_pack_g = {
    heredaDe: "negocio_institucion",
    deltaPack: "G",
    formularioId: "negocio_empresa",
    camposPublicosPerfil: ["serviciosHospital", "nivelesAtencion", "serviciosResidencia", "serviciosFunerarios"],
    obligatoriosExtra: ["nombreComercial", "serviciosClinica", "direccion", "horarioDetalle", "geo"],
    keywordsIA: ["hospital", "residencia", "institución"],
  };
  p.salud_pack_h = {
    heredaDe: "persona_servicio_salud_auxiliar",
    deltaPack: "H",
    camposPublicosPerfil: ["serviciosCorporativos", "coberturaEmpresas"],
    obligatoriosExtra: ["serviciosCorporativos", "coberturaEmpresas", "certificaciones", "horarioDetalle", "tarifaDesde"],
    keywordsIA: ["salud ocupacional", "empresas", "corporativo"],
  };
  return p;
}

export function arquetipoForPack(pack, subId) {
  if (PACK_A_PROFESIONISTA_SUBS.has(subId)) return "profesional_salud";
  if (PACK_G_NEGOCIO_SUBS.has(subId)) return "negocio_institucion";
  if (PACK_F_NEGOCIO_SUBS.has(subId)) return "negocio_servicios_local";
  if (pack === "B" || pack === "C" || pack === "D" || pack === "E" || pack === "H") return packPlantillaKey(pack);
  return packPlantillaKey(pack);
}
