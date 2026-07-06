/**
 * Render Preview + Ficha — sector Mascotas packs A–E (MP-MASCOTAS-DELTAS-V1 Fase 3).
 * Fuente: scripts/mascotas-packs-v1.mjs + mascotas-sub-deltas-v1.mjs
 * Regenerar: node scripts/build-carihub-mascotas-sector-render.mjs
 */
(function (global) {
  'use strict';

  var PREVIEW_FICHA = {
  "paseador-de-perros": {
    "chips": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas"
    ],
    "stats": [
      "tarifaDesde",
      "precioConsulta",
      "modalidadServicioMascotas"
    ],
    "rows": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas",
      "capacidadInstalacion",
      "tamanoMascotasAtendidas",
      "tiempoRespuestaMascotas",
      "diferenciadorMascotas",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "coberturaGeografica",
      "colaboracionesComerciales"
    ]
  },
  "entrenador-canino": {
    "chips": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas"
    ],
    "stats": [
      "tarifaDesde",
      "precioConsulta",
      "modalidadServicioMascotas"
    ],
    "rows": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas",
      "tamanoMascotasAtendidas",
      "tiempoRespuestaMascotas",
      "diferenciadorMascotas",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "coberturaGeografica",
      "colaboracionesComerciales"
    ]
  },
  "cuidador-de-mascotas": {
    "chips": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas"
    ],
    "stats": [
      "tarifaDesde",
      "precioConsulta",
      "modalidadServicioMascotas"
    ],
    "rows": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas",
      "capacidadInstalacion",
      "tamanoMascotasAtendidas",
      "tiempoRespuestaMascotas",
      "diferenciadorMascotas",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "coberturaGeografica",
      "colaboracionesComerciales"
    ]
  },
  "groomer": {
    "chips": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas"
    ],
    "stats": [
      "tarifaDesde",
      "precioConsulta",
      "modalidadServicioMascotas"
    ],
    "rows": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas",
      "tamanoMascotasAtendidas",
      "tiempoRespuestaMascotas",
      "diferenciadorMascotas",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "coberturaGeografica",
      "colaboracionesComerciales"
    ]
  },
  "fotografo-de-mascotas": {
    "chips": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas"
    ],
    "stats": [
      "tarifaDesde",
      "precioConsulta",
      "modalidadServicioMascotas"
    ],
    "rows": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas",
      "tamanoMascotasAtendidas",
      "tiempoRespuestaMascotas",
      "diferenciadorMascotas",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "coberturaGeografica",
      "colaboracionesComerciales"
    ]
  },
  "adiestrador": {
    "chips": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas"
    ],
    "stats": [
      "tarifaDesde",
      "precioConsulta",
      "modalidadServicioMascotas"
    ],
    "rows": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas",
      "tamanoMascotasAtendidas",
      "tiempoRespuestaMascotas",
      "diferenciadorMascotas",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "coberturaGeografica",
      "colaboracionesComerciales"
    ]
  },
  "rescatista-independiente": {
    "chips": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas"
    ],
    "stats": [
      "tarifaDesde",
      "precioConsulta",
      "modalidadServicioMascotas"
    ],
    "rows": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas",
      "tamanoMascotasAtendidas",
      "tiempoRespuestaMascotas",
      "diferenciadorMascotas",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "coberturaGeografica",
      "colaboracionesComerciales"
    ]
  },
  "medico-veterinario": {
    "chips": [
      "serviciosVeterinarios",
      "serviciosEmpresaMascotas",
      "especiesAtendidas"
    ],
    "stats": [
      "tarifaDesde",
      "precioConsulta",
      "modalidadServicioMascotas"
    ],
    "rows": [
      "serviciosVeterinarios",
      "serviciosEmpresaMascotas",
      "especiesAtendidas",
      "emergenciasMascotas",
      "especialidadVeterinaria",
      "especialidadesVeterinarias",
      "modalidadServicioMascotas",
      "tiempoRespuestaMascotas",
      "diferenciadorMascotas"
    ],
    "faq": [
      "emergenciasMascotas"
    ]
  },
  "veterinario-especialista": {
    "chips": [
      "serviciosVeterinarios",
      "serviciosEmpresaMascotas",
      "especiesAtendidas"
    ],
    "stats": [
      "tarifaDesde",
      "precioConsulta",
      "modalidadServicioMascotas"
    ],
    "rows": [
      "serviciosVeterinarios",
      "serviciosEmpresaMascotas",
      "especiesAtendidas",
      "emergenciasMascotas",
      "especialidadVeterinaria",
      "especialidadesVeterinarias",
      "modalidadServicioMascotas",
      "tiempoRespuestaMascotas",
      "diferenciadorMascotas"
    ],
    "faq": [
      "emergenciasMascotas"
    ]
  },
  "cirujano-veterinario": {
    "chips": [
      "serviciosVeterinarios",
      "serviciosEmpresaMascotas",
      "especiesAtendidas"
    ],
    "stats": [
      "tarifaDesde",
      "precioConsulta",
      "modalidadServicioMascotas"
    ],
    "rows": [
      "serviciosVeterinarios",
      "serviciosEmpresaMascotas",
      "especiesAtendidas",
      "emergenciasMascotas",
      "especialidadVeterinaria",
      "especialidadesVeterinarias",
      "modalidadServicioMascotas",
      "tiempoRespuestaMascotas",
      "diferenciadorMascotas"
    ],
    "faq": [
      "emergenciasMascotas"
    ]
  },
  "clinica-veterinaria": {
    "chips": [
      "serviciosVeterinarios",
      "serviciosEmpresaMascotas",
      "especiesAtendidas"
    ],
    "stats": [
      "tarifaDesde",
      "precioConsulta",
      "modalidadServicioMascotas"
    ],
    "rows": [
      "serviciosVeterinarios",
      "serviciosEmpresaMascotas",
      "especiesAtendidas",
      "emergenciasMascotas",
      "especialidadesEmpresaMascotas",
      "modalidadServicioMascotas",
      "capacidadInstalacion",
      "diferenciadorMascotas",
      "coberturaGeografica"
    ],
    "faq": [
      "emergenciasMascotas",
      "coberturaGeografica"
    ]
  },
  "hospital-veterinario": {
    "chips": [
      "serviciosVeterinarios",
      "serviciosEmpresaMascotas",
      "especiesAtendidas"
    ],
    "stats": [
      "tarifaDesde",
      "precioConsulta",
      "modalidadServicioMascotas"
    ],
    "rows": [
      "serviciosVeterinarios",
      "serviciosEmpresaMascotas",
      "especiesAtendidas",
      "emergenciasMascotas",
      "especialidadesEmpresaMascotas",
      "modalidadServicioMascotas",
      "capacidadInstalacion",
      "diferenciadorMascotas",
      "coberturaGeografica"
    ],
    "faq": [
      "emergenciasMascotas",
      "coberturaGeografica"
    ]
  },
  "estetica-canina": {
    "chips": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas"
    ],
    "stats": [
      "tarifaDesde",
      "precioConsulta",
      "modalidadServicioMascotas"
    ],
    "rows": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas",
      "serviciosEmpresaMascotas",
      "especialidadesEmpresaMascotas",
      "emergenciasMascotas",
      "capacidadInstalacion",
      "diferenciadorMascotas",
      "coberturaGeografica"
    ],
    "faq": [
      "emergenciasMascotas",
      "coberturaGeografica"
    ]
  },
  "guarderia-para-mascotas": {
    "chips": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas"
    ],
    "stats": [
      "tarifaDesde",
      "precioConsulta",
      "modalidadServicioMascotas"
    ],
    "rows": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas",
      "capacidadInstalacion",
      "tamanoMascotasAtendidas",
      "tiempoRespuestaMascotas",
      "diferenciadorMascotas",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "coberturaGeografica",
      "colaboracionesComerciales"
    ]
  },
  "hotel-para-mascotas": {
    "chips": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas"
    ],
    "stats": [
      "tarifaDesde",
      "precioConsulta",
      "modalidadServicioMascotas"
    ],
    "rows": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas",
      "capacidadInstalacion",
      "tamanoMascotasAtendidas",
      "tiempoRespuestaMascotas",
      "diferenciadorMascotas",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "coberturaGeografica",
      "colaboracionesComerciales"
    ]
  },
  "tienda-de-mascotas": {
    "chips": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas"
    ],
    "stats": [
      "tarifaDesde",
      "precioConsulta",
      "modalidadServicioMascotas"
    ],
    "rows": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas",
      "tamanoMascotasAtendidas",
      "tiempoRespuestaMascotas",
      "diferenciadorMascotas",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "coberturaGeografica",
      "colaboracionesComerciales"
    ]
  },
  "criadero-autorizado": {
    "chips": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas"
    ],
    "stats": [
      "tarifaDesde",
      "precioConsulta",
      "modalidadServicioMascotas"
    ],
    "rows": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas",
      "tamanoMascotasAtendidas",
      "tiempoRespuestaMascotas",
      "diferenciadorMascotas",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "coberturaGeografica",
      "colaboracionesComerciales"
    ]
  },
  "centro-de-entrenamiento-canino": {
    "chips": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas"
    ],
    "stats": [
      "tarifaDesde",
      "precioConsulta",
      "modalidadServicioMascotas"
    ],
    "rows": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas",
      "serviciosEmpresaMascotas",
      "especialidadesEmpresaMascotas",
      "emergenciasMascotas",
      "capacidadInstalacion",
      "diferenciadorMascotas",
      "coberturaGeografica"
    ],
    "faq": [
      "emergenciasMascotas",
      "coberturaGeografica"
    ]
  },
  "farmacia-veterinaria": {
    "chips": [
      "serviciosVeterinarios",
      "serviciosEmpresaMascotas",
      "especiesAtendidas"
    ],
    "stats": [
      "tarifaDesde",
      "precioConsulta",
      "modalidadServicioMascotas"
    ],
    "rows": [
      "serviciosVeterinarios",
      "serviciosEmpresaMascotas",
      "especiesAtendidas",
      "emergenciasMascotas",
      "especialidadVeterinaria",
      "especialidadesVeterinarias",
      "modalidadServicioMascotas",
      "tiempoRespuestaMascotas",
      "diferenciadorMascotas"
    ],
    "faq": [
      "emergenciasMascotas"
    ]
  },
  "servicio-funerario-para-mascotas": {
    "chips": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas"
    ],
    "stats": [
      "tarifaDesde",
      "precioConsulta",
      "modalidadServicioMascotas"
    ],
    "rows": [
      "serviciosMascotas",
      "especiesAtendidas",
      "modalidadServicioMascotas",
      "tamanoMascotasAtendidas",
      "tiempoRespuestaMascotas",
      "diferenciadorMascotas",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "coberturaGeografica",
      "colaboracionesComerciales"
    ]
  }
};

  var FIELD_LABELS = {
  "modalidadServicioMascotas": "Modalidad de servicio",
  "serviciosMascotas": "Servicios para mascotas",
  "especiesAtendidas": "Especies que atiendes",
  "tamanoMascotasAtendidas": "Tamaños de mascota",
  "especialidadVeterinaria": "Especialidad veterinaria",
  "serviciosVeterinarios": "Servicios veterinarios",
  "especialidadesVeterinarias": "Especialidades veterinarias",
  "emergenciasMascotas": "¿Atiendes emergencias?",
  "serviciosEmpresaMascotas": "Servicios del establecimiento",
  "especialidadesEmpresaMascotas": "Especialidades",
  "capacidadInstalacion": "Capacidad / cupo",
  "tiempoRespuestaMascotas": "Tiempo de respuesta",
  "diferenciadorMascotas": "Tu sello con mascotas",
  "coberturaGeografica": "Zona de cobertura",
  "colaboracionesComerciales": "¿Colaboras con veterinarios, refugios o tiendas?",
  "tiposColaboracionComercial": "Tipo de colaboraciones"
};

  var FIELD_TYPES = {
  "modalidadServicioMascotas": "enum",
  "serviciosMascotas": "checklist",
  "especiesAtendidas": "checklist",
  "tamanoMascotasAtendidas": "checklist",
  "especialidadVeterinaria": "text",
  "serviciosVeterinarios": "checklist",
  "especialidadesVeterinarias": "checklist",
  "emergenciasMascotas": "enum",
  "serviciosEmpresaMascotas": "checklist",
  "especialidadesEmpresaMascotas": "text",
  "capacidadInstalacion": "text",
  "tiempoRespuestaMascotas": "enum",
  "diferenciadorMascotas": "text",
  "coberturaGeografica": "text",
  "colaboracionesComerciales": "enum",
  "tiposColaboracionComercial": "checklist"
};

  var CANON_BLOCK_TITLES = {
  "paseador-de-perros": "Paseador de perros",
  "entrenador-canino": "Entrenador canino",
  "cuidador-de-mascotas": "Cuidador de mascotas",
  "groomer": "Groomer",
  "fotografo-de-mascotas": "Fotógrafo de mascotas",
  "adiestrador": "Adiestrador",
  "rescatista-independiente": "Rescatista independiente",
  "medico-veterinario": "Médico veterinario",
  "veterinario-especialista": "Veterinario especialista",
  "cirujano-veterinario": "Cirujano veterinario",
  "clinica-veterinaria": "Clínica veterinaria",
  "hospital-veterinario": "Hospital veterinario",
  "estetica-canina": "Estética canina",
  "guarderia-para-mascotas": "Guardería para mascotas",
  "hotel-para-mascotas": "Hotel para mascotas",
  "tienda-de-mascotas": "Tienda de mascotas",
  "criadero-autorizado": "Criadero autorizado",
  "centro-de-entrenamiento-canino": "Centro de entrenamiento canino",
  "farmacia-veterinaria": "Farmacia veterinaria",
  "servicio-funerario-para-mascotas": "Servicio funerario para mascotas"
};

  var NEGOCIO_CANON = [
  "clinica-veterinaria",
  "hospital-veterinario",
  "estetica-canina",
  "centro-de-entrenamiento-canino"
];

  var CEDULA_CANON = [
  "medico-veterinario",
  "veterinario-especialista",
  "cirujano-veterinario",
  "farmacia-veterinaria"
];

  var PACK_TITLES = {
  "A": "Cuidado y hospedaje",
  "B": "Entrenamiento canino",
  "C": "Estética y fotografía",
  "D": "Veterinaria y salud",
  "E": "Retail, cría y servicios"
};

  var SUB_TO_PACK = {
  "paseador-de-perros": "A",
  "cuidador-de-mascotas": "A",
  "guarderia-para-mascotas": "A",
  "hotel-para-mascotas": "A",
  "entrenador-canino": "B",
  "adiestrador": "B",
  "centro-de-entrenamiento-canino": "B",
  "groomer": "C",
  "estetica-canina": "C",
  "fotografo-de-mascotas": "C",
  "medico-veterinario": "D",
  "veterinario-especialista": "D",
  "cirujano-veterinario": "D",
  "clinica-veterinaria": "D",
  "hospital-veterinario": "D",
  "farmacia-veterinaria": "D",
  "tienda-de-mascotas": "E",
  "criadero-autorizado": "E",
  "rescatista-independiente": "E",
  "servicio-funerario-para-mascotas": "E"
};

  var ENUM_LABELS = {
  "modalidadServicioMascotas": {
    "domicilio": "Domicilio",
    "consultorio": "Consultorio",
    "clinica": "Clinica",
    "instalaciones": "Instalaciones",
    "online": "Online",
    "ambos": "Ambos"
  },
  "emergenciasMascotas": {
    "si_24h": "Si 24 h",
    "si_horario": "Si Horario",
    "no": "No",
    "derivacion": "Derivacion"
  },
  "tiempoRespuestaMascotas": {
    "inmediato": "Inmediato",
    "mismo_dia": "Mismo Dia",
    "24_48h": "24 48h",
    "por_cita": "Por Cita"
  },
  "colaboracionesComerciales": {
    "si_activo": "Si Activo",
    "ocasional": "Ocasional",
    "convenir": "Convenir",
    "no": "No"
  }
};

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
    return (u && u.mascotasPerfil) ? u.mascotasPerfil : {};
  }

  function packFrom(u) {
    u = u || {};
    var p = perfilNested(u);
    return txt(u.deltaPack || p.deltaPack || SUB_TO_PACK[resolveCanonSubId(u)]).toUpperCase();
  }

  function isMascotasSectorPerfil(u) {
    if (!u) return false;
    if (String(u.sectorId || '') === 'mascotas' && (u.mascotasPerfil || u.deltaPack)) return true;
    if (u.mascotasPerfil && resolveCanonSubId(u)) return true;
    return false;
  }

  function isMascotasNegocioPerfil(u) {
    return NEGOCIO_CANON.indexOf(resolveCanonSubId(u)) >= 0;
  }

  function isMascotasCedulaPerfil(u) {
    return CEDULA_CANON.indexOf(resolveCanonSubId(u)) >= 0;
  }

  function resolveVistaPerfil(u) {
    if (!isMascotasSectorPerfil(u)) return null;
    return isMascotasNegocioPerfil(u) ? 'empresa' : 'pro';
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
    if (fieldId === 'precioConsulta' || fieldId === 'tarifaDesde') return formatMoney(val);
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
    var pack = packFrom({ mascotasPerfil: p });
    var items = [];
    (pf.chips || []).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) items.push(val);
    });
    if (pack === 'D' && p.serviciosVeterinarios) {
      formatFieldValue('serviciosVeterinarios', p.serviciosVeterinarios).split(' · ').forEach(function (x) {
        if (x && items.indexOf(x) < 0) items.push(x);
      });
    }
    if (p.especiesAtendidas) {
      var esp = formatFieldValue('especiesAtendidas', p.especiesAtendidas);
      if (esp && items.indexOf(esp) < 0) items.push(esp);
    }
    if (p.modalidadServicioMascotas) {
      var mod = formatEnumValue('modalidadServicioMascotas', p.modalidadServicioMascotas);
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
    if (p.horarioAtencion) pushRow(rows, '🕐', 'Horario', p.horarioAtencion, 'horario');
    else if (p.horarioDetalle) pushRow(rows, '🕐', 'Horario', p.horarioDetalle, 'horario');
    else if (u.horario) pushRow(rows, '🕐', 'Horario', u.horario, 'horario');
    if (p.certificaciones) pushRow(rows, '🎖️', 'Certificaciones', p.certificaciones);
    if (p.diferenciadorMascotas) pushRow(rows, '🐾', 'Tu sello', p.diferenciadorMascotas);
    var loc = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); }).join(', ');
    if (loc) pushRow(rows, '📍', 'Ubicación', loc);
    if (p.coberturaGeografica) pushRow(rows, '🗺️', 'Cobertura', p.coberturaGeografica);
    if (p.direccion) pushRow(rows, '🏠', 'Dirección', p.direccion);
    return rows;
  }

  function buildBadges(u, canonId) {
    u = u || {};
    var p = perfilNested(u);
    var pack = packFrom(u);
    var badges = [];
    if (isMascotasCedulaPerfil(u) && (u.cedulaVerificada === true || u.requiresCedula === true)) {
      badges.push({ cls: 'res-badge--cedula', text: 'Cédula verificada' });
    }
    if (p.emergenciasMascotas === 'si_24h') {
      badges.push({ cls: 'res-badge--urgencias', text: 'Emergencias 24 h' });
    }
    if (p.colaboracionesComerciales && txt(p.colaboracionesComerciales) && p.colaboracionesComerciales !== 'no') {
      badges.push({ cls: 'res-badge--colab', text: 'Colabora con otros' });
    }
    if (pack === 'A' && p.capacidadInstalacion) {
      badges.push({ cls: 'res-badge--cupo', text: 'Cupo disponible' });
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
        ['Mascotas', 'Especialidad'],
        ['Consultar', 'Tarifa'],
        ['Verificado', 'En plataforma'],
        ['Cita', 'Sujeta a disponibilidad'],
      ];
      var f = fillers[stats.length];
      if (f) stats.push(f);
    }
    return stats.slice(0, 4);
  }

  function buildFeats(pack) {
    if (pack === 'D') {
      return ['Salud animal', 'Especies declaradas', 'Emergencias visibles', 'Perfil verificable'];
    }
    if (pack === 'A') {
      return ['Cuidado responsable', 'Especies y tamaños', 'Cobertura clara', 'Tiempos de respuesta'];
    }
    return ['Servicios para mascotas', 'Modalidad declarada', 'Cobertura geográfica', 'Perfil verificable en CariHub'];
  }

  function packFaq(canonId) {
    var pf = previewFields(canonId);
    if (pf.faq && pf.faq.length) {
      return pf.faq.map(function (fid) { return '¿' + fieldLabel(fid) + '?'; });
    }
    return ['¿Atienden mi especie?', '¿Cuál es la tarifa?', '¿Tienen emergencias?', '¿Cuál es la cobertura?'];
  }

  function resolvePrecioPublico(p, u) {
    p = p || {};
    u = u || {};
    if (txt(u.precio)) return u.precio;
    if (p.precioConsulta) return formatMoney(p.precioConsulta);
    if (p.tarifaDesde) return formatMoney(p.tarifaDesde);
    return '';
  }

  function resolvePriceLabel(pack, u) {
    if (isMascotasCedulaPerfil(u)) return 'Consulta desde';
    if (isMascotasNegocioPerfil(u)) return 'Servicios desde';
    return 'Tarifa desde';
  }

  function buildSobreMi(canonId, p, u) {
    if (txt(u.sobreMi)) return u.sobreMi;
    if (txt(u.sobreNosotros)) return u.sobreNosotros;
    if (txt(p.tagline)) return p.tagline;
    if (txt(u.tagline)) return u.tagline;
    if (p.diferenciadorMascotas) return p.diferenciadorMascotas;
    if (p.especialidadVeterinaria) return p.especialidadVeterinaria;
    return CANON_BLOCK_TITLES[canonId] || PACK_TITLES[packFrom(u)] || 'Servicios para mascotas en tu zona.';
  }

  function hydrateDisplayFields(u) {
    u = u || {};
    if (!isMascotasSectorPerfil(u)) return u;
    var p = perfilNested(u);
    var canonId = resolveCanonSubId(u);
    var pack = packFrom(u);
    u.__mascotasCanon = canonId;
    u.__mascotasPack = pack;
    u.sectorId = u.sectorId || 'mascotas';
    u.titulo = u.titulo || p.blockTitle || CANON_BLOCK_TITLES[canonId] || PACK_TITLES[pack] || 'Servicios para mascotas';
    u.especialidad = u.especialidad || p.especialidadVeterinaria || p.especialidadesEmpresaMascotas || u.titulo;
    u.servicios = u.servicios || u.titulo;
    u.tagline = u.tagline || p.tagline || '';
    u.sobreMi = buildSobreMi(canonId, p, u);
    u.sobreNosotros = u.sobreNosotros || u.sobreMi;
    u.precio = resolvePrecioPublico(p, u);
    u.horario = u.horario || p.horarioAtencion || p.horarioDetalle || '';
    if (isMascotasCedulaPerfil(u)) {
      u.nombre = u.nombreProfesional || p.nombreProfesional || u.nombre || '';
      u.nombreProfesional = u.nombreProfesional || p.nombreProfesional || u.nombre;
    } else if (isMascotasNegocioPerfil(u)) {
      u.nombre = u.nombreComercial || p.nombreComercial || u.nombre || '';
      u.nombreComercial = u.nombreComercial || p.nombreComercial || u.nombre;
    } else {
      u.nombre = u.alias || p.alias || u.nombre || '';
      u.alias = p.alias || u.alias || u.nombre;
    }
    u.serviciosIncluidos = buildServiciosList(canonId, p);
    u.atencion = u.atencion || (p.modalidadServicioMascotas ? formatEnumValue('modalidadServicioMascotas', p.modalidadServicioMascotas) : 'Consultar modalidad');
    var locParts = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); });
    u.zonaCobertura = u.zonaCobertura || txt(p.coberturaGeografica) || locParts.join(', ') || txt(p.direccion) || '';
    u.cobertura = Array.isArray(u.cobertura) && u.cobertura.length ? u.cobertura : locParts.filter(Boolean);
    if (txt(p.certificaciones) && !Array.isArray(u.certificaciones)) {
      u.certificaciones = [[txt(p.certificaciones), 'Formación / registro']];
    }
    u.__mascotasDatos = buildDatosRows(canonId, p, u);
    u.__mascotasBadges = buildBadges(u, canonId);
    u.__mascotasPriceLabel = resolvePriceLabel(pack, u);
    u.rating = u.rating != null ? u.rating : '—';
    u.opiniones = u.opiniones != null ? u.opiniones : 0;
    u.reviews = Array.isArray(u.reviews) ? u.reviews : [];
    u.faq = Array.isArray(u.faq) && u.faq.length ? u.faq : packFaq(canonId);
    u.noIncluidos = Array.isArray(u.noIncluidos) && u.noIncluidos.length
      ? u.noIncluidos
      : ['Medicamentos sin receta no declarados', 'Servicios fuera del alcance publicado', 'Emergencias no cubiertas salvo indicación'];
    u.stats = Array.isArray(u.stats) && u.stats.length ? u.stats : buildStats(canonId, p);
    u.feats = Array.isArray(u.feats) && u.feats.length ? u.feats : buildFeats(pack);
    u.metodosPago = Array.isArray(u.metodosPago) && u.metodosPago.length ? u.metodosPago : ['Consultar'];
    u.tiempoRespuesta = u.tiempoRespuesta || formatEnumValue('tiempoRespuestaMascotas', p.tiempoRespuestaMascotas) || 'Consultar disponibilidad';
    u.urgencias = u.urgencias || (p.emergenciasMascotas === 'si_24h' ? 'Emergencias 24 h' : 'Consultar disponibilidad');
    if (isMascotasCedulaPerfil(u)) u.cedulaVerificada = u.cedulaVerificada !== false;
    return u;
  }

  function cardMetaChips(u) {
    u = hydrateDisplayFields(Object.assign({}, u));
    var p = perfilNested(u);
    var canonId = u.__mascotasCanon;
    var pf = previewFields(canonId);
    var chips = [];
    (pf.chips || []).slice(0, 3).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) chips.push(val.split(' · ')[0].slice(0, 28));
    });
    if (p.especiesAtendidas) {
      chips.push(formatFieldValue('especiesAtendidas', p.especiesAtendidas).split(' · ')[0].slice(0, 28));
    }
    if (p.modalidadServicioMascotas) {
      chips.push(formatEnumValue('modalidadServicioMascotas', p.modalidadServicioMascotas).slice(0, 28));
    }
    if (p.emergenciasMascotas === 'si_24h') chips.push('Emergencias 24 h');
    return chips.filter(function (x, i, a) { return x && a.indexOf(x) === i; }).slice(0, 4);
  }

  global.CariHubMascotasSectorRender = {
    PACK_TITLES: PACK_TITLES,
    isMascotasSectorPerfil: isMascotasSectorPerfil,
    isMascotasNegocioPerfil: isMascotasNegocioPerfil,
    isMascotasCedulaPerfil: isMascotasCedulaPerfil,
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
