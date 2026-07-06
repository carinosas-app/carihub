/**
 * Bloques registro — sector Salud. MP-SALUD-DELTAS-V1 packs A–H.
 */
(function (global) {
  'use strict';

  var SUB_TO_PACK = {
    'medicos-generales': 'A', 'especialistas-medicos': 'A', psicologos: 'A',
    'ambulancias-y-traslado-medico': 'A', 'equipo-medico': 'A',
    'examenes-medicos-para-empresas': 'A', 'servicios-medicos-empresariales': 'A',
    'seguros-medicos': 'A', 'gastos-medicos-mayores': 'A',
    'dentistas-y-clinicas-dentales': 'B', psiquiatras: 'B', nutriologos: 'B',
    fisioterapeutas: 'B', quiropracticos: 'B', 'oftalmologia-y-opticas': 'B',
    'audiologia-y-aparatos-auditivos': 'B', 'ginecologia-y-obstetricia': 'B',
    urologia: 'B', pediatria: 'B', dermatologia: 'B', cardiologia: 'B',
    'cirugia-general': 'B', 'cirugia-plastica-y-estetica': 'B', 'medicina-estetica': 'B',
    'enfermeria-a-domicilio': 'C', 'cuidado-de-adultos-mayores': 'C',
    'rehabilitacion-fisica': 'C', 'terapias-de-lenguaje': 'C', 'terapias-de-aprendizaje': 'C',
    'laboratorios-clinicos': 'D', 'estudios-de-diagnostico-e-imagen': 'D',
    'ultrasonidos-y-rayos-x': 'D', 'laboratorios-dentales': 'D', 'bancos-de-sangre': 'D',
    farmacias: 'E', 'farmacias-especializadas': 'E', 'protesis-y-ortesis': 'E', 'oxigeno-medicinal': 'E',
    'clinicas-medicas': 'F', 'centros-de-rehabilitacion': 'F', 'centros-de-salud-mental': 'F',
    'clinicas-de-adicciones': 'F', 'clinicas-de-fertilidad': 'F', 'seguridad-e-higiene-industrial': 'F',
    'hospitales-privados': 'G', 'casas-de-retiro': 'G', 'asilos-y-residencias-asistidas': 'G',
    'servicios-funerarios': 'G', 'salud-ocupacional': 'H', 'medicina-del-trabajo': 'H'
  };

  var MODALIDAD_CLINICA = [
    { value: 'consultorio', label: 'Consultorio / clínica' },
    { value: 'videollamada', label: 'Videollamada / teleconsulta' },
    { value: 'hibrido', label: 'Presencial y en línea' }
  ];

  var MODALIDAD_CON_VISITA = MODALIDAD_CLINICA.concat([
    { value: 'domicilio_paciente', label: 'Visita al domicilio del paciente' }
  ]);

  /** @deprecated use MODALIDAD_CLINICA — kept for compat reads */
  var MODALIDAD = MODALIDAD_CON_VISITA;

  var SI_NO = [{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }];
  var UNIDAD = [
    { value: 'por_consulta', label: 'Por consulta' },
    { value: 'por_hora', label: 'Por hora' },
    { value: 'por_sesion', label: 'Por sesión' },
    { value: 'por_visita_domicilio', label: 'Visita a domicilio' }
  ];

  var REFERENCIAS_INTERCONSULTA = [
    { value: 'recibo_y_envio', label: 'Recibo y envío referencias' },
    { value: 'solo_recibo', label: 'Solo recibo referencias' },
    { value: 'solo_envio', label: 'Solo refiero a especialistas' },
    { value: 'convenio_clinica', label: 'Convenio con clínica u hospital' },
    { value: 'no', label: 'No aplica' }
  ];

  var FIELD_LABELS = {
    diferenciadorSalud: 'Tu enfoque / lo que te distingue',
    referenciasInterconsulta: 'Referencias con otros especialistas',
    coberturaAtencionSalud: 'Zona donde atiendes',
    modalidadTraslado: 'Tipos de ambulancia / traslado',
    serviciosFarmacia: 'Servicios adicionales',
    equipamientoImagen: 'Equipamiento de imagen',
    productosLaboratorioDental: 'Productos del laboratorio dental',
    tipoDonacionSangre: 'Tipos de donación / servicios',
    especialidadFarmacia: 'Especialidad de la farmacia',
    tiposProtesis: 'Tipos de prótesis / órtesis',
    modalidadOxigeno: 'Modalidad comercial',
    especialidadesDisponiblesClinica: 'Especialidades disponibles',
    tiposRehabilitacionCentro: 'Tipos de rehabilitación',
    programasAdicciones: 'Programas de adicciones',
    normasIndustriales: 'Normas / certificaciones',
    camasHospital: 'Número aproximado de camas',
    tipoResidenciaRetiro: 'Tipo de residencia',
    nivelAsistenciaResidencia: 'Nivel de asistencia',
    planesFunerarios: 'Planes funerarios',
    industriasMedicinaTrabajo: 'Industrias atendidas',
    ventaLentes: '¿Vendes lentes en consultorio?',
    marcasAudifonos: 'Marcas de audífonos (opcional)',
    atencionParto: '¿Atiendes parto o cesárea?',
    equipamientoEstetico: 'Equipamiento estético'
  };

  function slugSubId(id) {
    return String(id || '').trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/_/g, '-');
  }

  function resolvePack(subId) { return SUB_TO_PACK[slugSubId(subId)] || 'B'; }

  function getSubDeltaApi() {
    return {
      meta: global.CARIHUB_SALUD_SUB_CANON_META || {},
      deltas: global.CARIHUB_SALUD_SUB_DELTAS || {}
    };
  }

  function resolveCanonSubId(raw) { return slugSubId(raw); }

  function cloneBlocks(blocks) { return JSON.parse(JSON.stringify(blocks || [])); }

  function applyFieldPatch(field, delta) {
    if (!field || !delta) return field;
    var opts = delta.fieldOptions && delta.fieldOptions[field.id];
    if (opts && opts.length && (field.type === 'checklist' || field.type === 'select')) {
      field.options = opts.slice();
    }
    if (delta.fieldLabels && delta.fieldLabels[field.id]) {
      field.label = delta.fieldLabels[field.id];
    }
    if (delta.textosAyuda && delta.textosAyuda[field.id]) {
      var ayuda = delta.textosAyuda[field.id];
      if (field.type === 'checklist' || field.type === 'select' || field.type === 'boolean') {
        field.hint = ayuda;
      } else {
        field.placeholder = ayuda;
      }
    }
    return field;
  }

  function inferFieldFromDelta(fieldId, delta) {
    var label = FIELD_LABELS[fieldId] || fieldId;
    if (fieldId === 'diferenciadorSalud' || fieldId === 'coberturaAtencionSalud' ||
        fieldId === 'marcasAudifonos' || fieldId === 'camasHospital') {
      return { id: fieldId, label: label, type: 'text', placeholder: '' };
    }
    if (fieldId === 'referenciasInterconsulta') {
      var refOpts = (delta && delta.fieldOptions && delta.fieldOptions.referenciasInterconsulta) || REFERENCIAS_INTERCONSULTA;
      return { id: fieldId, label: label, type: 'select', options: refOpts.slice() };
    }
    if (fieldId === 'ventaLentes' || fieldId === 'atencionParto') {
      return { id: fieldId, label: label, type: 'boolean', required: false };
    }
    var opts = delta && delta.fieldOptions && delta.fieldOptions[fieldId];
    if (opts && opts.length) {
      if (typeof opts[0] === 'object' && opts[0].value != null) {
        return { id: fieldId, label: label, type: 'select', options: opts.slice() };
      }
      return { id: fieldId, label: label, type: 'checklist', options: opts.slice() };
    }
    return null;
  }

  function extraFieldTemplate(fieldId) {
    var bool = function (label) {
      return { id: fieldId, label: label, type: 'boolean', required: false };
    };
    var text = function (label, placeholder) {
      return { id: fieldId, label: label, type: 'text', required: false, placeholder: placeholder || '' };
    };
    var checklist = function (label, options) {
      return { id: fieldId, label: label, type: 'checklist', required: false, options: options || [] };
    };
    var select = function (label, options) {
      return { id: fieldId, label: label, type: 'select', required: false, options: options || MODALIDAD_CLINICA };
    };
    var map = {
      modalidadAtencionProfesional: select('Modalidad de atención', MODALIDAD_CLINICA),
      modalidadConsulta: select('Modalidad de atención clínica', MODALIDAD_CLINICA),
      modalidadCentroSaludMental: select('Modalidad de atención', MODALIDAD_CLINICA),
      modalidadAsesoriaSeguros: select('Modalidad de asesoría', MODALIDAD_CLINICA),
      poblacionAtendida: checklist('Población que atiendes', ['Adultos', 'Adolescentes', 'Niños', 'Parejas', 'Familias', 'Adultos mayores']),
      enfoqueTerapeutico: checklist('Enfoque / abordaje terapéutico', ['Cognitivo-conductual', 'Humanista', 'Sistémico / familiar', 'Psicoanálisis', 'Integrativo', 'Otro']),
      serviciosDentales: checklist('Servicios dentales que ofreces', ['Limpieza dental', 'Blanqueamiento', 'Extracciones', 'Endodoncia', 'Ortodoncia', 'Implantes', 'Urgencias dentales', 'Otro']),
      equipamientoDental: checklist('Equipamiento disponible', ['Rayos X digital', 'Panorámica', 'Sedación consciente', 'Láser dental', 'CAD/CAM', 'No aplica']),
      atencionOdontopediatria: bool('¿Atiendes niños (odontopediatría)?'),
      urgenciasDentales: bool('¿Atiendes urgencias dentales?'),
      tipoEstablecimientoDental: select('Tipo de establecimiento', [
        { value: 'consultorio_individual', label: 'Consultorio individual' },
        { value: 'clinica_dental', label: 'Clínica dental' },
        { value: 'centro_odontologico', label: 'Centro odontológico' }
      ]),
      prescripcionMedicamentos: bool('¿Incluye prescripción medicamentosa?'),
      idiomasAtencion: text('Idiomas de atención', 'Ej. Español, inglés'),
      hospitalAfiliacion: text('Hospital(es) de afiliación (opcional)', 'Ej. Hospital Ángeles'),
      tiempoRespuestaEmergencia: text('Tiempo de respuesta estimado', 'Ej. 15–30 min en zona metropolitana'),
      modalidadComercialEquipo: select('Modalidad comercial', [
        { value: 'venta', label: 'Venta' }, { value: 'renta', label: 'Renta' }, { value: 'ambas', label: 'Ambas' }
      ]),
      tamanoEmpresaAtendida: checklist('Tamaño de empresas atendidas', ['PyME', 'Mediana', 'Corporativo', 'Gobierno']),
      aseguradorasRepresentadas: text('Aseguradoras que representas', 'Ej. GNP, AXA, MetLife'),
      objetivosNutricion: checklist('Objetivos que trabajas', ['Pérdida de peso', 'Ganancia muscular', 'Control clínico', 'Deportiva', 'Otro']),
      planesAlimenticios: checklist('Tipos de plan alimenticio', ['Personalizado', 'Por objetivo', 'Menús semanales', 'Otro']),
      areasFisioterapia: checklist('Áreas / enfoques de fisioterapia', ['Columna', 'Rodilla', 'Deportiva', 'Neurológica', 'Postoperatoria', 'Otro']),
      equipamientoFisioterapia: checklist('Equipamiento disponible', ['Electroterapia', 'Ultrasonido', 'Laser', 'Hidroterapia', 'Otro']),
      tecnicasQuiropracticas: checklist('Técnicas quiroprácticas', ['Ajuste manual', 'Instrumentado', 'Deportiva', 'Otro']),
      serviciosOftalmologia: checklist('Servicios oftalmológicos', ['Examen de la vista', 'Graduación', 'Lentes', 'Cirugía refractiva', 'Otro']),
      serviciosAudiologia: checklist('Servicios de audiología', ['Audiometría', 'Adaptación de audífonos', 'Tinnitus', 'Otro']),
      serviciosGinecologia: checklist('Servicios gineco-obstétricos', ['Control prenatal', 'Papanicolaou', 'Planificación familiar', 'Otro']),
      procedimientosUrologia: checklist('Procedimientos urológicos', ['Consulta', 'Cistoscopia', 'Circuncisión', 'Otro']),
      edadesAtendidasPediatria: checklist('Edades que atiendes', ['Recién nacidos', 'Lactantes', 'Preescolares', 'Escolares', 'Adolescentes']),
      vacunacionInfantil: bool('¿Aplicas vacunación infantil?'),
      procedimientosDermatologia: checklist('Procedimientos dermatológicos', ['Consulta', 'Biopsias', 'Laser', 'Acné', 'Otro']),
      estudiosCardiologia: checklist('Estudios cardiológicos', ['Electrocardiograma', 'Ecocardiograma', 'Holter', 'Otro']),
      procedimientosCirugia: checklist('Procedimientos quirúrgicos', ['Consulta preoperatoria', 'Cirugía ambulatoria', 'Otro']),
      procedimientosEsteticos: checklist('Procedimientos estéticos', ['Rinoplastia', 'Abdominoplastia', 'Lipoescultura', 'Mamoplastia', 'Otro']),
      cirugiaAmbulatoriaEstetica: bool('¿Cirugía ambulatoria en consultorio?'),
      tratamientosEsteticos: checklist('Tratamientos estéticos', ['Botox', 'Rellenos', 'Laser', 'Peeling', 'Otro']),
      certificacionEnfermeria: text('Cédula / certificación de enfermería', 'Número o institución'),
      turnosEnfermeria: checklist('Turnos disponibles', ['Diurno', 'Nocturno', '24 horas', 'Por evento']),
      tipoCuidadoAdultoMayor: checklist('Tipo de cuidado', ['Acompañamiento', 'Cuidados básicos', 'Cuidados especializados', 'Respiro familiar']),
      turnosCuidado: checklist('Turnos de cuidado', ['Por horas', 'Medio día', 'Día completo', 'Noche', '24 horas']),
      areasRehabilitacion: checklist('Áreas de rehabilitación', ['Postoperatorio', 'Neurológica', 'Deportiva', 'Geriatría', 'Otro']),
      poblacionLenguaje: checklist('Población atendida', ['Niños', 'Adolescentes', 'Adultos', 'Adultos mayores']),
      areasAprendizaje: checklist('Áreas de aprendizaje', ['Lectoescritura', 'Atención', 'Memoria', 'Integración sensorial', 'Otro']),
      requiereAyuno: bool('¿Informas requisitos de ayuno?'),
      citaPreviaLab: bool('¿Requiere cita previa?'),
      serviciosSaludMentalCentro: checklist('Servicios de salud mental', ['Individual', 'Pareja', 'Familiar', 'Infantil', 'Grupos']),
      tratamientosFertilidad: checklist('Tratamientos de fertilidad', ['FIV', 'Inseminación', 'Preservación de óvulos', 'Otro']),
      entregaDomicilioFarmacia: bool('¿Entrega a domicilio?'),
      internamientoAdicciones: bool('¿Internamiento residencial?'),
      estacionamientoClinica: bool('¿Estacionamiento?'),
      diferenciadorSalud: text('Tu enfoque / lo que te distingue', 'Ej. Atención empática · Citas same-day'),
      referenciasInterconsulta: select('Referencias con otros especialistas', REFERENCIAS_INTERCONSULTA),
      coberturaAtencionSalud: text('Zona donde atiendes', 'Ej. CDMX sur, zona metropolitana'),
      serviciosFarmacia: checklist('Servicios adicionales', ['Entrega a domicilio', 'Inyectables', 'Toma de presión', 'Otro']),
      equipamientoImagen: checklist('Equipamiento de imagen', ['TAC', 'RM', 'Mamografía', 'Densitometría', 'Otro']),
      productosLaboratorioDental: checklist('Productos del laboratorio', ['Coronas', 'Prótesis', 'Ortodoncia', 'Otro']),
      tipoDonacionSangre: checklist('Tipos de donación', ['Sangre total', 'Plaquetas', 'Plasma', 'Otro']),
      especialidadFarmacia: select('Especialidad de la farmacia', [
        { value: 'alto_costo', label: 'Alto costo' },
        { value: 'oncologica', label: 'Oncológica' },
        { value: 'controlados', label: 'Controlados' },
        { value: 'general', label: 'General especializada' }
      ]),
      tiposProtesis: checklist('Tipos de prótesis / órtesis', ['Ortesis', 'Prótesis miembro', 'Prótesis dental', 'Otro']),
      modalidadOxigeno: select('Modalidad comercial', [
        { value: 'venta', label: 'Venta' }, { value: 'renta', label: 'Renta' }, { value: 'recargas', label: 'Recargas' }
      ]),
      especialidadesDisponiblesClinica: text('Especialidades disponibles', 'Ej. Pediatría, Ginecología'),
      tiposRehabilitacionCentro: checklist('Tipos de rehabilitación', ['Física', 'Neurológica', 'Adicciones', 'Otro']),
      programasAdicciones: checklist('Programas de adicciones', ['Ambulatorio', 'Residencial', 'Familiar', 'Otro']),
      normasIndustriales: checklist('Normas / certificaciones', ['NOM-035', 'NOM-030', 'ISO 45001', 'Otro']),
      camasHospital: text('Número aproximado de camas', 'Ej. 50–100'),
      tipoResidenciaRetiro: select('Tipo de residencia', [
        { value: 'independiente', label: 'Vida independiente' },
        { value: 'asistida', label: 'Asistida' },
        { value: 'memoria', label: 'Cuidados de memoria' }
      ]),
      nivelAsistenciaResidencia: select('Nivel de asistencia', [
        { value: 'basico', label: 'Básico' },
        { value: 'medio', label: 'Medio' },
        { value: 'alto', label: 'Alto / especializado' }
      ]),
      planesFunerarios: checklist('Planes funerarios', ['Individual', 'Familiar', 'Empresarial', 'Previsión', 'Otro']),
      industriasMedicinaTrabajo: checklist('Industrias atendidas', ['Manufactura', 'Construcción', 'Minería', 'Logística', 'Otro']),
      ventaLentes: bool('¿Vendes lentes en consultorio?'),
      marcasAudifonos: text('Marcas de audífonos (opcional)', 'Ej. Phonak, Oticon'),
      atencionParto: bool('¿Atiendes parto o cesárea?'),
      equipamientoEstetico: checklist('Equipamiento estético', ['Laser', 'IPL', 'Radiofrecuencia', 'Otro'])
    };
    return map[fieldId] || null;
  }

  function buildExtraField(fieldId, delta, required) {
    var tpl = extraFieldTemplate(fieldId) || inferFieldFromDelta(fieldId, delta);
    if (!tpl) return null;
    var field = JSON.parse(JSON.stringify(tpl));
    field.required = !!required;
    applyFieldPatch(field, delta);
    return field;
  }

  function applySubDeltaToBlocks(blocks, subId) {
    var delta = getSubDeltaApi().deltas[subId];
    if (!delta) return blocks;
    var out = cloneBlocks(blocks);
    var oblSet = {};
    (delta.obligatoriosDelta || []).forEach(function (fid) { oblSet[fid] = true; });
    out.forEach(function (block) {
      if (block.id && block.id.indexOf('pack') >= 0) {
        block.title = delta.blockTitle || block.title;
        if (delta.blockHint) block.hint = delta.blockHint;
      }
      if (delta.hideFields && delta.hideFields.length && block.fields) {
        block.fields = block.fields.filter(function (f) {
          return delta.hideFields.indexOf(f.id) < 0;
        });
      }
      (block.fields || []).forEach(function (field) {
        if (field.id === 'alias' && delta.aliasPlaceholder) field.placeholder = delta.aliasPlaceholder;
        if (field.id === 'nombreProfesional' && delta.aliasPlaceholder) field.placeholder = delta.aliasPlaceholder;
        applyFieldPatch(field, delta);
      });
      if (delta.extraFields && delta.extraFields.length && block.id && block.id.indexOf('pack') >= 0) {
        delta.extraFields.forEach(function (fid) {
          if ((block.fields || []).some(function (f) { return f.id === fid; })) return;
          var extra = buildExtraField(fid, delta, !!oblSet[fid]);
          if (extra) block.fields.push(extra);
        });
      }
    });
    return out;
  }

  function packBlocksA() {
    return [{
      id: 'packA_cedula',
      title: 'Profesional de salud (cédula)',
      hint: 'Datos públicos — cédula se valida en sección privada.',
      fields: [
        { id: 'nombreProfesional', label: 'Nombre profesional público', type: 'text', required: true },
        { id: 'especialidad', label: 'Especialidad', type: 'text', required: true },
        { id: 'subespecialidad', label: 'Subespecialidad (opcional)', type: 'text', required: false },
        {
          id: 'serviciosProfesionales',
          label: 'Servicios que ofrece',
          type: 'checklist',
          required: true,
          options: ['Consulta', 'Seguimiento', 'Procedimiento ambulatorio', 'Segunda opinión', 'Otro']
        },
        {
          id: 'segurosAceptados',
          label: 'Seguros aceptados',
          type: 'text',
          required: true,
          placeholder: 'Ej. GNP, AXA, solo particular'
        },
        { id: 'consultaEnLinea', label: '¿Consulta en línea?', type: 'boolean', required: false },
        {
          id: 'modalidadAtencionProfesional',
          label: 'Modalidad de atención',
          type: 'select',
          required: true,
          options: MODALIDAD_CLINICA
        },
        { id: 'precioConsulta', label: 'Precio consulta desde (MXN)', type: 'text', required: true },
        { id: 'unidadConsulta', label: 'Unidad', type: 'select', required: false, options: UNIDAD },
        { id: 'horarioAtencion', label: 'Horario de atención', type: 'text', required: true },
        {
          id: 'modalidadTraslado',
          label: 'Modalidad de traslado (si aplica)',
          type: 'checklist',
          required: false,
          options: ['Básica', 'Medicalizada', 'UCI móvil', 'Traslado programado', 'Otro']
        },
        { id: 'coberturaEmergencias', label: 'Cobertura / zona de emergencias', type: 'text', required: false }
      ]
    }];
  }

  function personaBaseBlocks() {
    return [{
      id: 'saludBase',
      title: 'Perfil de salud',
      fields: [
        { id: 'alias', label: 'Nombre público', type: 'text', required: true },
        { id: 'tagline', label: 'Frase corta', type: 'text', required: false, maxLength: 100 },
        {
          id: 'certificaciones',
          label: 'Certificaciones / formación',
          type: 'textarea',
          required: true,
          rows: 2,
          placeholder: 'Título, cédula auxiliar o certificaciones relevantes'
        }
      ]
    }, {
      id: 'saludTarifaHorario',
      title: 'Tarifa y horario',
      fields: [
        { id: 'tarifaDesde', label: 'Tarifa desde (MXN)', type: 'text', required: true },
        { id: 'horarioDetalle', label: 'Horario de atención', type: 'text', required: true }
      ]
    }];
  }

  function negocioBaseBlocks() {
    return [{
      id: 'saludNegocioBase',
      title: 'Establecimiento de salud',
      fields: [
        { id: 'nombreComercial', label: 'Nombre comercial', type: 'text', required: true },
        { id: 'tagline', label: 'Frase corta', type: 'text', required: false, maxLength: 100 },
        { id: 'direccion', label: 'Dirección o zona pública', type: 'textarea', required: true, rows: 2 },
        { id: 'horarioDetalle', label: 'Horario', type: 'text', required: true }
      ]
    }];
  }

  function packBlocksB() {
    return [{
      id: 'packB_consulta',
      title: 'Consulta / especialidad',
      fields: [
        { id: 'especialidadServicio', label: 'Especialidad o servicio', type: 'text', required: true },
        { id: 'modalidadConsulta', label: 'Modalidad de atención clínica', type: 'select', required: true, options: MODALIDAD_CLINICA },
        {
          id: 'segurosAceptadosSalud',
          label: 'Seguros / prepagos',
          type: 'checklist',
          required: false,
          options: ['Particular', 'GNP', 'AXA', 'MetLife', 'Moneda', 'Otro']
        },
        { id: 'atencionDomicilioSalud', label: '¿Atención a domicilio?', type: 'select', required: false, options: SI_NO }
      ]
    }];
  }

  function packBlocksC() {
    return [{
      id: 'packC_cuidado',
      title: 'Cuidado y rehabilitación',
      fields: [
        {
          id: 'serviciosCuidado',
          label: 'Servicios',
          type: 'checklist',
          required: true,
          options: ['Curaciones', 'Rehabilitación', 'Cuidado adulto mayor', 'Terapia', 'Otro']
        },
        { id: 'atencionDomicilioSalud', label: '¿Atención a domicilio?', type: 'select', required: true, options: SI_NO },
        { id: 'coberturaDomicilioZona', label: 'Zona de cobertura', type: 'text', required: false }
      ]
    }];
  }

  function packBlocksD() {
    return [{
      id: 'packD_laboratorio',
      title: 'Diagnóstico y laboratorio',
      fields: [
        {
          id: 'estudiosOfrecidos',
          label: 'Estudios ofrecidos',
          type: 'checklist',
          required: true,
          options: ['Química sanguínea', 'Imagen', 'Ultrasonido', 'Rayos X', 'Otro']
        },
        { id: 'tiempoEntregaResultados', label: 'Tiempo de resultados', type: 'text', required: true },
        { id: 'tomaMuestrasDomicilio', label: '¿Toma a domicilio?', type: 'boolean', required: false }
      ]
    }];
  }

  function packBlocksE() {
    return [{
      id: 'packE_farmacia',
      title: 'Farmacia y productos médicos',
      fields: [
        {
          id: 'categoriasFarmacia',
          label: 'Categorías',
          type: 'checklist',
          required: true,
          options: ['Medicamentos', 'Genéricos', 'OTC', 'Material médico', 'Otro']
        },
        { id: 'surtidoFarmaceutico', label: 'Surtido principal', type: 'text', required: true },
        {
          id: 'ventaConReceta',
          label: 'Venta con receta',
          type: 'select',
          required: true,
          options: [{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }, { value: 'ambas', label: 'Ambas' }]
        }
      ]
    }];
  }

  function packBlocksF() {
    return [{
      id: 'packF_clinica',
      title: 'Clínica / centro',
      fields: [
        {
          id: 'serviciosClinica',
          label: 'Servicios',
          type: 'checklist',
          required: true,
          options: ['Consulta externa', 'Urgencias', 'Laboratorio', 'Imagen', 'Cirugía ambulatoria', 'Otro']
        },
        { id: 'especialidadesClinica', label: 'Especialidades', type: 'text', required: true, placeholder: 'Ej. Pediatría, Ginecología' },
        { id: 'urgencias24h', label: '¿Urgencias 24h?', type: 'boolean', required: false }
      ]
    }];
  }

  function packBlocksG(isFunerario) {
    if (isFunerario) {
      return [{
        id: 'packG_funerario',
        title: 'Servicios funerarios',
        fields: [
          {
            id: 'serviciosFunerarios',
            label: 'Servicios',
            type: 'checklist',
            required: true,
            options: ['Velación', 'Cremación', 'Traslado', 'Previsión', 'Otro']
          }
        ]
      }];
    }
    return [{
      id: 'packG_institucion',
      title: 'Institución / residencial',
      fields: [
        {
          id: 'serviciosHospital',
          label: 'Servicios hospitalarios',
          type: 'checklist',
          required: false,
          options: ['Urgencias', 'Hospitalización', 'Cirugía', 'UCI', 'Otro']
        },
        {
          id: 'nivelesAtencion',
          label: 'Nivel de atención',
          type: 'checklist',
          required: false,
          options: ['Primero', 'Segundo', 'Tercer nivel']
        },
        {
          id: 'serviciosResidencia',
          label: 'Servicios residenciales',
          type: 'checklist',
          required: false,
          options: ['Alojamiento', 'Enfermería', 'Rehabilitación', 'Otro']
        },
        { id: 'capacidadResidentes', label: 'Capacidad', type: 'text', required: false }
      ]
    }];
  }

  function packBlocksH() {
    return [{
      id: 'packH_corporativo',
      title: 'Salud corporativa',
      fields: [
        {
          id: 'serviciosCorporativos',
          label: 'Servicios a empresas',
          type: 'checklist',
          required: true,
          options: ['Examen médico', 'NOM-035', 'Campo / planta', 'Capacitación', 'Otro']
        },
        { id: 'coberturaEmpresas', label: 'Industrias / empresas atendidas', type: 'text', required: true }
      ]
    }];
  }

  var PACK_BUILDERS = {
    A: packBlocksA,
    B: packBlocksB,
    C: packBlocksC,
    D: packBlocksD,
    E: packBlocksE,
    F: packBlocksF,
    G: packBlocksG,
    H: packBlocksH
  };

  var PACK_OBLIGATORIOS = {
    A: ['nombreProfesional', 'especialidad', 'serviciosProfesionales', 'segurosAceptados', 'precioConsulta', 'horarioAtencion', 'modalidadAtencionProfesional'],
    B: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'especialidadServicio', 'modalidadConsulta'],
    C: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'serviciosCuidado', 'atencionDomicilioSalud'],
    D: ['alias', 'estudiosOfrecidos', 'tiempoEntregaResultados', 'horarioDetalle'],
    E: ['alias', 'categoriasFarmacia', 'surtidoFarmaceutico', 'horarioDetalle'],
    F: ['nombreComercial', 'serviciosClinica', 'especialidadesClinica', 'direccion', 'horarioDetalle'],
    G: ['nombreComercial', 'direccion', 'horarioDetalle'],
    H: ['alias', 'certificaciones', 'serviciosCorporativos', 'coberturaEmpresas', 'tarifaDesde', 'horarioDetalle']
  };

  function appendPackBlocks(pack, canonId) {
    if (pack === 'G' && canonId === 'servicios-funerarios') return packBlocksG(true);
    var fn = PACK_BUILDERS[pack] || packBlocksB;
    return pack === 'G' ? fn(false) : fn();
  }

  function inferFormularioId(pack, ctx) {
    if (ctx && ctx.formularioId) return ctx.formularioId;
    if (pack === 'A') return 'profesionista_cedula';
    if (pack === 'F' || pack === 'G') return 'negocio_empresa';
    return 'persona_independiente';
  }

  function mergeObligatoriosFromDelta(packOblig, subId) {
    var delta = getSubDeltaApi().deltas[subId];
    var list = (packOblig || []).slice();
    if (!delta || !Array.isArray(delta.obligatoriosDelta)) return list;
    delta.obligatoriosDelta.forEach(function (fid) {
      if (fid === 'geo') return;
      if (list.indexOf(fid) < 0) list.push(fid);
    });
    return list;
  }

  function buildConfig(ctx) {
    ctx = ctx || {};
    var canonId = resolveCanonSubId(ctx.subcategoriaId || ctx.subcategoria || '');
    var pack = resolvePack(canonId);
    var formularioId = inferFormularioId(pack, ctx);
    var blocks;
    if (pack === 'A') {
      blocks = packBlocksA();
    } else if (pack === 'F' || pack === 'G') {
      blocks = negocioBaseBlocks().concat(appendPackBlocks(pack, canonId));
    } else {
      blocks = personaBaseBlocks().concat(appendPackBlocks(pack, canonId));
    }
    blocks = applySubDeltaToBlocks(blocks, canonId);
    return {
      id: 'salud_pack_' + pack.toLowerCase(),
      deltaPack: pack,
      canonSubcategoriaId: canonId,
      sectorId: 'salud',
      formularioId: formularioId,
      uiIds: pack === 'A' ? ['ui_prof_salud'] : (pack === 'F' || pack === 'G' ? ['ui_neg_servicios_local'] : ['ui_ind_salud_auxiliar']),
      fotosMin: pack === 'A' ? 2 : (pack === 'G' ? 3 : 2),
      obligatorios: mergeObligatoriosFromDelta(PACK_OBLIGATORIOS[pack] || PACK_OBLIGATORIOS.B, canonId),
      blocks: blocks,
      nestedProfileKey: 'saludPerfil',
      packFlags: pack === 'A' ? { requiresCedula: true, nivelRevisionAdmin: 'alta' } : {}
    };
  }

  global.CARIHUB_REGISTRO_SALUD_SECTOR_BLOCKS = {
    id: 'salud_sector_packs',
    sectorId: 'salud',
    subToPack: SUB_TO_PACK,
    resolvePack: resolvePack,
    resolveCanonSubId: resolveCanonSubId,
    applySubDeltaToBlocks: applySubDeltaToBlocks,
    buildConfig: buildConfig
  };
})(typeof window !== 'undefined' ? window : globalThis);
