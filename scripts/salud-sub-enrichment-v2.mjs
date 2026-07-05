/**
 * MP-SALUD-ENRICH-V2 — copy clínico, hints y campos por sub (50 subs).
 */
export const REFERENCIAS_INTERCONSULTA = [
  { value: "recibo_y_envio", label: "Recibo y envío referencias" },
  { value: "solo_recibo", label: "Solo recibo referencias" },
  { value: "solo_envio", label: "Solo refiero a especialistas" },
  { value: "convenio_clinica", label: "Convenio con clínica u hospital" },
  { value: "no", label: "No aplica" },
];

const CLINICAL_EXTRA = ["diferenciadorSalud", "referenciasInterconsulta"];
const CUIDADO_EXTRA = ["diferenciadorSalud"];
const LAB_EXTRA = ["diferenciadorSalud"];
const NEGOCIO_SALUD_EXTRA = ["diferenciadorSalud"];

const BASE_AYUDA = {
  diferenciadorSalud: "Ej. Atención empática · Citas el mismo día · Español e inglés",
  referenciasInterconsulta: "Interconsulta con otros especialistas — no es lo mismo que colaboraciones de adultos.",
  modalidadAtencionProfesional: "Consultorio, videollamada o híbrido — nunca hotel, motel ni modalidad escort.",
  modalidadConsulta: "Consultorio, videollamada, híbrido o visita al domicilio del paciente si aplica.",
  serviciosProfesionales: "Consultas y procedimientos — no escribas diagnósticos en texto público.",
  segurosAceptados: "Aseguradoras, prepagos o «solo particular».",
  segurosAceptadosSalud: "Seguros / prepagos que aceptas o «solo particular».",
  precioConsulta: "Honorarios desde — indica si la primera consulta tiene costo distinto.",
  coberturaAtencionSalud: "Ciudad, colonias o zona metropolitana donde atiendes.",
  coberturaDomicilioZona: "Zona donde visitas al paciente a domicilio.",
};

function enrich(blockHint, extra = {}) {
  return {
    blockHint,
    extraFields: extra.extraFields,
    fieldLabels: extra.fieldLabels || {},
    textosAyuda: { ...BASE_AYUDA, ...(extra.textosAyuda || {}) },
    fieldOptions: {
      referenciasInterconsulta: REFERENCIAS_INTERCONSULTA,
      ...(extra.fieldOptions || {}),
    },
  };
}

/** @type {Record<string, object>} */
export const SUB_ENRICHMENT_V2 = {
  "medicos-generales": enrich(
    "Tu perfil de medicina general — cuéntanos qué consultas resuelves y a quién atiendes.",
    {
      extraFields: [...CLINICAL_EXTRA, "coberturaAtencionSalud", "idiomasAtencion"],
      fieldLabels: {
        especialidad: "Especialidad principal (coherente con cédula)",
        serviciosProfesionales: "¿Qué servicios ofreces en consulta?",
        segurosAceptados: "¿Qué seguros o prepagos aceptas?",
      },
    }
  ),
  "especialistas-medicos": enrich(
    "Especialista médico — destaca tu subespecialidad, hospital de afiliación y servicios.",
    {
      extraFields: [...CLINICAL_EXTRA, "coberturaAtencionSalud"],
      fieldLabels: {
        subespecialidad: "Subespecialidad (si aplica)",
        serviciosProfesionales: "Procedimientos y consultas que ofreces",
        hospitalAfiliacion: "Hospital(es) donde practicas o admites",
      },
    }
  ),
  psicologos: enrich(
    "Psicología clínica — población, enfoque terapéutico y modalidad sin confundir con otros servicios.",
    {
      extraFields: [...CLINICAL_EXTRA, "coberturaAtencionSalud"],
      fieldLabels: {
        poblacionAtendida: "¿A quién atiendes?",
        enfoqueTerapeutico: "¿Qué enfoques terapéuticos usas?",
        serviciosProfesionales: "Tipos de terapia o evaluación",
      },
      textosAyuda: {
        serviciosProfesionales: "No incluyas diagnósticos ni historias clínicas en texto público.",
      },
    }
  ),
  "ambulancias-y-traslado-medico": enrich(
    "Traslado médico y urgencias — tipo de unidad, cobertura y tiempo de respuesta.",
    {
      extraFields: [...NEGOCIO_SALUD_EXTRA],
      fieldLabels: {
        modalidadTraslado: "Tipos de ambulancia / traslado",
        coberturaEmergencias: "Zona de cobertura de emergencias",
        tiempoRespuestaEmergencia: "Tiempo de respuesta estimado",
      },
    }
  ),
  "equipo-medico": enrich(
    "Equipo e instrumental médico — venta, renta o mantenimiento.",
    {
      extraFields: NEGOCIO_SALUD_EXTRA,
      fieldLabels: {
        serviciosProfesionales: "Servicios comerciales del equipo",
        modalidadComercialEquipo: "¿Vendes, rentas o ambos?",
      },
    }
  ),
  "examenes-medicos-para-empresas": enrich(
    "Exámenes médicos para empresas — paquetes, industrias y cobertura.",
    {
      extraFields: [...CLINICAL_EXTRA, "tamanoEmpresaAtendida"],
      fieldLabels: { serviciosProfesionales: "Exámenes y paquetes empresariales" },
    }
  ),
  "servicios-medicos-empresariales": enrich(
    "Servicios médicos en planta o campamentos — qué incluye tu propuesta corporativa.",
    {
      extraFields: [...CLINICAL_EXTRA, "tamanoEmpresaAtendida"],
      fieldLabels: { serviciosProfesionales: "Servicios médicos empresariales" },
    }
  ),
  "seguros-medicos": enrich(
    "Asesoría en seguros médicos — cotización y renovación sin prometer aprobación.",
    {
      extraFields: NEGOCIO_SALUD_EXTRA,
      fieldLabels: {
        aseguradorasRepresentadas: "Aseguradoras con las que trabajas",
        serviciosProfesionales: "Servicios de asesoría GMM",
      },
      textosAyuda: { serviciosProfesionales: "No prometas aprobación automática de pólizas." },
    }
  ),
  "gastos-medicos-mayores": enrich(
    "Gastos médicos mayores — planes individual, familiar o empresarial.",
    {
      extraFields: NEGOCIO_SALUD_EXTRA,
      fieldLabels: { aseguradorasRepresentadas: "Aseguradoras que representas" },
    }
  ),
  "dentistas-y-clinicas-dentales": enrich(
    "Odontología — servicios, equipamiento y si atiendes urgencias o niños.",
    {
      extraFields: [...CLINICAL_EXTRA, "coberturaAtencionSalud"],
      fieldLabels: {
        serviciosDentales: "¿Qué procedimientos dentales realizas?",
        equipamientoDental: "Equipamiento en tu consultorio",
        tipoEstablecimientoDental: "Tipo de consultorio o clínica",
      },
    }
  ),
  psiquiatras: enrich(
    "Psiquiatría — población atendida, modalidad y si incluye prescripción.",
    {
      extraFields: CLINICAL_EXTRA,
      fieldLabels: {
        especialidadServicio: "Servicios psiquiátricos",
        poblacionAtendida: "Edades o grupos que atiendes",
        prescripcionMedicamentos: "¿Tu práctica incluye prescripción?",
      },
    }
  ),
  nutriologos: enrich(
    "Nutrición clínica — objetivos, planes alimenticios y modalidad presencial o en línea.",
    {
      extraFields: [...CLINICAL_EXTRA, "coberturaAtencionSalud"],
      fieldLabels: {
        objetivosNutricion: "Objetivos nutricionales que trabajas",
        planesAlimenticios: "Tipos de plan que elaboras",
      },
    }
  ),
  fisioterapeutas: enrich(
    "Fisioterapia — áreas del cuerpo, equipamiento y rehabilitación.",
    {
      extraFields: [...CLINICAL_EXTRA, "coberturaAtencionSalud"],
      fieldLabels: {
        areasFisioterapia: "Áreas o enfoques de fisioterapia",
        equipamientoFisioterapia: "Equipamiento disponible",
      },
    }
  ),
  quiropracticos: enrich(
    "Quiropráctica — técnicas y modalidad de atención.",
    {
      extraFields: CLINICAL_EXTRA,
      fieldLabels: { tecnicasQuiropracticas: "Técnicas quiroprácticas que usas" },
    }
  ),
  "oftalmologia-y-opticas": enrich(
    "Oftalmología y óptica — estudios, lentes y cirugía si aplica.",
    {
      extraFields: CLINICAL_EXTRA,
      fieldLabels: {
        serviciosOftalmologia: "Servicios oftalmológicos",
        ventaLentes: "¿Vendes lentes en consultorio?",
      },
    }
  ),
  "audiologia-y-aparatos-auditivos": enrich(
    "Audiología — pruebas, adaptación de audífonos y marcas.",
    {
      extraFields: CLINICAL_EXTRA,
      fieldLabels: {
        serviciosAudiologia: "Servicios de audiología",
        marcasAudifonos: "Marcas de audífonos (opcional)",
      },
    }
  ),
  "ginecologia-y-obstetricia": enrich(
    "Ginecología y obstetricia — control prenatal, procedimientos y parto.",
    {
      extraFields: CLINICAL_EXTRA,
      fieldLabels: {
        serviciosGinecologia: "Servicios gineco-obstétricos",
        atencionParto: "¿Atiendes parto o cesárea?",
      },
    }
  ),
  urologia: enrich(
    "Urología — consulta y procedimientos urológicos.",
    {
      extraFields: CLINICAL_EXTRA,
      fieldLabels: { procedimientosUrologia: "Procedimientos que realizas" },
    }
  ),
  pediatria: enrich(
    "Pediatría — edades atendidas y vacunación infantil.",
    {
      extraFields: CLINICAL_EXTRA,
      fieldLabels: {
        edadesAtendidasPediatria: "Edades de niños que atiendes",
        vacunacionInfantil: "¿Aplicas vacunación infantil?",
      },
    }
  ),
  dermatologia: enrich(
    "Dermatología — procedimientos dermatológicos y estéticos médicos.",
    {
      extraFields: CLINICAL_EXTRA,
      fieldLabels: { procedimientosDermatologia: "Procedimientos dermatológicos" },
    }
  ),
  cardiologia: enrich(
    "Cardiología — estudios cardíacos disponibles en consulta.",
    {
      extraFields: CLINICAL_EXTRA,
      fieldLabels: { estudiosCardiologia: "Estudios cardiológicos que ofreces" },
    }
  ),
  "cirugia-general": enrich(
    "Cirugía general — procedimientos ambulatorios y hospitalarios.",
    {
      extraFields: CLINICAL_EXTRA,
      fieldLabels: { procedimientosCirugia: "Procedimientos quirúrgicos" },
    }
  ),
  "cirugia-plastica-y-estetica": enrich(
    "Cirugía plástica — procedimientos estéticos y cirugía ambulatoria.",
    {
      extraFields: CLINICAL_EXTRA,
      fieldLabels: {
        procedimientosEsteticos: "Procedimientos estéticos quirúrgicos",
        cirugiaAmbulatoriaEstetica: "¿Cirugía ambulatoria en consultorio?",
      },
    }
  ),
  "medicina-estetica": enrich(
    "Medicina estética — tratamientos no quirúrgicos y equipamiento.",
    {
      extraFields: CLINICAL_EXTRA,
      fieldLabels: {
        tratamientosEsteticos: "Tratamientos estéticos",
        equipamientoEstetico: "Equipamiento (laser, etc.)",
      },
    }
  ),
  "enfermeria-a-domicilio": enrich(
    "Enfermería a domicilio — turnos, certificación y servicios de cuidado.",
    {
      extraFields: [...CUIDADO_EXTRA, "coberturaDomicilioZona"],
      fieldLabels: {
        certificacionEnfermeria: "Cédula o certificación de enfermería",
        turnosEnfermeria: "Turnos que ofreces",
        serviciosCuidado: "Servicios de enfermería a domicilio",
      },
    }
  ),
  "cuidado-de-adultos-mayores": enrich(
    "Cuidado de adultos mayores — tipo de cuidado y turnos.",
    {
      extraFields: [...CUIDADO_EXTRA, "coberturaDomicilioZona"],
      fieldLabels: {
        tipoCuidadoAdultoMayor: "Tipo de cuidado",
        turnosCuidado: "Turnos disponibles",
        serviciosCuidado: "Servicios de cuidado",
      },
    }
  ),
  "rehabilitacion-fisica": enrich(
    "Rehabilitación física — áreas de rehabilitación y modalidad.",
    {
      extraFields: [...CUIDADO_EXTRA, "coberturaDomicilioZona"],
      fieldLabels: {
        areasRehabilitacion: "Áreas de rehabilitación",
        serviciosCuidado: "Servicios de rehabilitación",
      },
    }
  ),
  "terapias-de-lenguaje": enrich(
    "Terapia de lenguaje — población y servicios.",
    {
      extraFields: CUIDADO_EXTRA,
      fieldLabels: {
        poblacionLenguaje: "Población que atiendes",
        serviciosCuidado: "Servicios de terapia de lenguaje",
      },
    }
  ),
  "terapias-de-aprendizaje": enrich(
    "Terapia de aprendizaje — áreas cognitivas y edades.",
    {
      extraFields: CUIDADO_EXTRA,
      fieldLabels: {
        areasAprendizaje: "Áreas de aprendizaje",
        serviciosCuidado: "Servicios de apoyo escolar",
      },
    }
  ),
  "laboratorios-clinicos": enrich(
    "Laboratorio clínico — estudios, ayuno, cita previa y toma a domicilio.",
    {
      extraFields: [...LAB_EXTRA, "tomaMuestrasDomicilio"],
      fieldLabels: {
        estudiosOfrecidos: "Estudios y pruebas que procesas",
        tiempoEntregaResultados: "Tiempo de entrega de resultados",
        requiereAyuno: "¿Informas requisitos de ayuno?",
      },
    }
  ),
  "estudios-de-diagnostico-e-imagen": enrich(
    "Diagnóstico por imagen — equipamiento y estudios disponibles.",
    {
      extraFields: LAB_EXTRA,
      fieldLabels: {
        estudiosOfrecidos: "Estudios de imagen",
        equipamientoImagen: "Equipamiento (TAC, RM, etc.)",
      },
    }
  ),
  "ultrasonidos-y-rayos-x": enrich(
    "Ultrasonido y rayos X — estudios disponibles y tiempos.",
    {
      extraFields: LAB_EXTRA,
      fieldLabels: { estudiosOfrecidos: "Estudios de ultrasonido y rayos X" },
    }
  ),
  "laboratorios-dentales": enrich(
    "Laboratorio dental — prótesis y productos que elaboras.",
    {
      extraFields: LAB_EXTRA,
      fieldLabels: { productosLaboratorioDental: "Productos del laboratorio dental" },
    }
  ),
  "bancos-de-sangre": enrich(
    "Banco de sangre — tipos de donación y servicios.",
    {
      extraFields: LAB_EXTRA,
      fieldLabels: { tipoDonacionSangre: "Tipos de donación / servicios" },
    }
  ),
  farmacias: enrich(
    "Farmacia — surtido, servicios adicionales y entrega a domicilio.",
    {
      extraFields: NEGOCIO_SALUD_EXTRA,
      fieldLabels: {
        categoriasFarmacia: "Categorías de productos",
        serviciosFarmacia: "Servicios adicionales",
        entregaDomicilioFarmacia: "¿Entrega a domicilio?",
      },
    }
  ),
  "farmacias-especializadas": enrich(
    "Farmacia especializada — alto costo, oncología o controlados.",
    {
      extraFields: NEGOCIO_SALUD_EXTRA,
      fieldLabels: { especialidadFarmacia: "Especialidad de la farmacia" },
    }
  ),
  "protesis-y-ortesis": enrich(
    "Prótesis y órtesis — tipos de productos y adaptación.",
    {
      extraFields: NEGOCIO_SALUD_EXTRA,
      fieldLabels: { tiposProtesis: "Tipos de prótesis / órtesis" },
    }
  ),
  "oxigeno-medicinal": enrich(
    "Oxígeno medicinal — venta, renta o recargas.",
    {
      extraFields: NEGOCIO_SALUD_EXTRA,
      fieldLabels: { modalidadOxigeno: "Modalidad comercial" },
    }
  ),
  "clinicas-medicas": enrich(
    "Clínica médica — servicios, especialidades y urgencias.",
    {
      extraFields: NEGOCIO_SALUD_EXTRA,
      fieldLabels: {
        serviciosClinica: "Servicios de la clínica",
        especialidadesDisponiblesClinica: "Especialidades disponibles",
        urgencias24h: "¿Urgencias 24 horas?",
      },
    }
  ),
  "centros-de-rehabilitacion": enrich(
    "Centro de rehabilitación — tipos de rehab y programas.",
    {
      extraFields: NEGOCIO_SALUD_EXTRA,
      fieldLabels: { tiposRehabilitacionCentro: "Tipos de rehabilitación" },
    }
  ),
  "centros-de-salud-mental": enrich(
    "Centro de salud mental — servicios individuales, familiares y grupales.",
    {
      extraFields: NEGOCIO_SALUD_EXTRA,
      fieldLabels: {
        serviciosSaludMentalCentro: "Servicios de salud mental",
        modalidadCentroSaludMental: "Modalidad de atención",
      },
    }
  ),
  "clinicas-de-adicciones": enrich(
    "Clínica de adicciones — programas ambulatorios o residenciales.",
    {
      extraFields: NEGOCIO_SALUD_EXTRA,
      fieldLabels: {
        programasAdicciones: "Programas de adicciones",
        internamientoAdicciones: "¿Internamiento residencial?",
      },
    }
  ),
  "clinicas-de-fertilidad": enrich(
    "Clínica de fertilidad — tratamientos de reproducción asistida.",
    {
      extraFields: NEGOCIO_SALUD_EXTRA,
      fieldLabels: { tratamientosFertilidad: "Tratamientos de fertilidad" },
    }
  ),
  "seguridad-e-higiene-industrial": enrich(
    "Seguridad e higiene industrial — normas y servicios en planta.",
    {
      extraFields: NEGOCIO_SALUD_EXTRA,
      fieldLabels: { normasIndustriales: "Normas / certificaciones" },
    }
  ),
  "hospitales-privados": enrich(
    "Hospital privado — servicios, camas, quirófanos y nivel de atención.",
    {
      extraFields: NEGOCIO_SALUD_EXTRA,
      fieldLabels: {
        serviciosHospital: "Servicios hospitalarios",
        camasHospital: "Número aproximado de camas",
        nivelesAtencion: "Nivel de atención",
      },
    }
  ),
  "casas-de-retiro": enrich(
    "Casa de retiro — servicios, capacidad y tipo de residencia.",
    {
      extraFields: NEGOCIO_SALUD_EXTRA,
      fieldLabels: {
        serviciosResidencia: "Servicios para residentes",
        tipoResidenciaRetiro: "Tipo de residencia",
      },
    }
  ),
  "asilos-y-residencias-asistidas": enrich(
    "Residencia asistida — nivel de asistencia y servicios.",
    {
      extraFields: NEGOCIO_SALUD_EXTRA,
      fieldLabels: {
        nivelAsistenciaResidencia: "Nivel de asistencia",
        serviciosResidencia: "Servicios de la residencia",
      },
    }
  ),
  "servicios-funerarios": enrich(
    "Servicios funerarios — planes, velación y traslados.",
    {
      extraFields: NEGOCIO_SALUD_EXTRA,
      fieldLabels: {
        serviciosFunerarios: "Servicios funerarios",
        planesFunerarios: "Planes disponibles",
      },
    }
  ),
  "salud-ocupacional": enrich(
    "Salud ocupacional — exámenes, NOM-035 y cobertura empresarial.",
    {
      extraFields: NEGOCIO_SALUD_EXTRA,
      fieldLabels: {
        serviciosCorporativos: "Servicios de salud ocupacional",
        coberturaEmpresas: "Industrias o empresas atendidas",
      },
    }
  ),
  "medicina-del-trabajo": enrich(
    "Medicina del trabajo — atención en planta y urgencias laborales.",
    {
      extraFields: NEGOCIO_SALUD_EXTRA,
      fieldLabels: {
        serviciosCorporativos: "Servicios de medicina del trabajo",
        industriasMedicinaTrabajo: "Industrias atendidas",
      },
    }
  ),
};

export function mergeEnrichmentV2(baseProfile, subId) {
  const enrichData = SUB_ENRICHMENT_V2[subId];
  if (!enrichData) return baseProfile;
  const out = { ...baseProfile };
  if (enrichData.blockHint) out.blockHint = enrichData.blockHint;
  if (enrichData.fieldLabels) out.fieldLabels = { ...(out.fieldLabels || {}), ...enrichData.fieldLabels };
  const ayuda = { ...(out.textosAyuda || {}), ...(enrichData.textosAyuda || {}) };
  out.textosAyuda = ayuda;
  if (enrichData.fieldOptions) {
    out.fieldOptions = { ...(out.fieldOptions || {}), ...enrichData.fieldOptions };
  }
  if (enrichData.extraFields) {
    out.extraFields = [...new Set([...(out.extraFields || []), ...enrichData.extraFields])];
  }
  return out;
}
