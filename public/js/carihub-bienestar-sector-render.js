/**
 * Render Preview + Ficha — sector Bienestar packs A–H (MP-BIENESTAR-DELTAS-V1 Fase 3).
 * No confundir con negocio_bienestar Adultos (spa/masajes).
 */
(function (global) {
  'use strict';

  var PACK_TITLES = {
    A: 'Terapia holística',
    B: 'Movimiento / mente-cuerpo',
    C: 'Centro / espacio holístico',
    D: 'Productos naturales',
    E: 'Espiritualidad / lectura',
    F: 'Coaching / desarrollo personal',
    G: 'Retiros / experiencias',
    H: 'Experiencia ceremonial regulada'
  };

  var DURACION_LABELS = {
    '30_min': '30 min',
    '45_min': '45 min',
    '60_min': '60 min',
    '90_min': '90 min',
    '120_min': '120 min',
    variable: 'Variable'
  };

  var MODALIDAD_CLASE_LABELS = {
    presencial: 'Presencial',
    online: 'En línea',
    hibrido: 'Híbrido'
  };

  var MODALIDAD_LECTURA_LABELS = {
    presencial: 'Presencial',
    online: 'En línea',
    ambas: 'Ambas'
  };

  var MODALIDAD_COACHING_LABELS = {
    individual: 'Individual',
    grupal: 'Grupal',
    mixta: 'Mixta'
  };

  var TIPO_EXPERIENCIA_LABELS = {
    retiro: 'Retiro',
    ceremonia: 'Ceremonia guiada',
    taller: 'Taller',
    inmersion: 'Inmersión',
    consulta_fechas: 'Consultar fechas / solicitar información'
  };

  var TIPO_CEREMONIAL_LABELS = {
    ceremonia_guiada: 'Ceremonia guiada',
    centro_retiro: 'Centro de retiro',
    experiencia_ceremonial: 'Experiencia ceremonial',
    facilitador_guia: 'Facilitador / guía',
    consulta_fechas: 'Solicitar información / consultar fechas'
  };

  var PACK_H_FORBIDDEN_DISPLAY = [
    'catalogoProductos', 'envioDomicilio', 'tiendaOnline', 'stockProductos',
    'dosisSustancia', 'precioPorSustancia', 'carritoEcommerce', 'carrito',
    'ventaPresencial', 'surtidoPrincipal', 'categoriasProductoBienestar'
  ];

  function txt(v) {
    return String(v == null ? '' : v).trim();
  }

  function packFrom(u) {
    u = u || {};
    return txt(u.deltaPack || (u.bienestarHolisticoPerfil && u.bienestarHolisticoPerfil.deltaPack)).toUpperCase();
  }

  function perfilNested(u) {
    return (u && u.bienestarHolisticoPerfil) ? u.bienestarHolisticoPerfil : {};
  }

  function isAdultosBienestar(u) {
    if (!u) return false;
    if (u.arquetipo === 'negocio_bienestar') return true;
    var sid = txt(u.subcategoriaId).toLowerCase().replace(/_/g, '-');
    if (sid === 'spa' || sid === 'masajes') return true;
    if (u.bienestarPerfil && !u.bienestarHolisticoPerfil) return true;
    return false;
  }

  function isBienestarSectorPerfil(u) {
    if (!u || isAdultosBienestar(u)) return false;
    if (u.sectorId === 'bienestar' && (u.bienestarHolisticoPerfil || packFrom(u))) return true;
    if (u.bienestarHolisticoPerfil && packFrom(u)) return true;
    return false;
  }

  function isBienestarRetailNegocio(u) {
    if (!isBienestarSectorPerfil(u)) return false;
    if (packFrom(u) === 'D') {
      var p = perfilNested(u);
      if (p.nombreComercial || u.nombreComercial || u.tipoPerfil === 'negocio') return true;
    }
    if (u.arquetipo === 'negocio_comercio' || u.arquetipo === 'negocio_retail_bienestar') return true;
    return false;
  }

  function resolveVistaPerfil(u) {
    if (!isBienestarSectorPerfil(u)) {
      /* Sector bienestar + comercio sin nested aún (preview temprana). */
      if (u && u.sectorId === 'bienestar' && (u.arquetipo === 'negocio_comercio' || u.tipoPerfil === 'negocio')) {
        return 'empresa';
      }
      return null;
    }
    if (isBienestarRetailNegocio(u)) return 'empresa';
    return 'pro';
  }

  function joinList(arr) {
    if (!Array.isArray(arr)) return txt(arr);
    return arr.filter(function (x) { return txt(x); }).join(' · ');
  }

  function labelMap(map, key) {
    var k = txt(key);
    return map[k] || k;
  }

  function pushRow(rows, icon, label, value, block) {
    value = txt(value);
    if (!value) return;
    rows.push([icon, label, value, block || '']);
  }

  function buildServiciosList(pack, p) {
    p = p || {};
    var items = [];
    if (pack === 'A') {
      if (Array.isArray(p.modalidadesTerapia)) items = items.concat(p.modalidadesTerapia);
      if (p.duracionSesionMinutos) items.push('Sesión ' + labelMap(DURACION_LABELS, p.duracionSesionMinutos));
      if (p.atencionDomicilio === 'Sí') items.push('Atención a domicilio');
    } else if (pack === 'B') {
      if (p.tipoPractica) items.push(p.tipoPractica);
      if (p.modalidadClase) items.push(labelMap(MODALIDAD_CLASE_LABELS, p.modalidadClase));
      if (p.nivelesAtendidos) items.push('Nivel: ' + p.nivelesAtendidos);
    } else if (pack === 'C') {
      if (Array.isArray(p.serviciosCentro)) items = items.concat(p.serviciosCentro);
      if (p.capacidadGrupo) items.push('Capacidad: ' + p.capacidadGrupo + ' personas');
    } else if (pack === 'D') {
      if (Array.isArray(p.categoriasProductoBienestar)) items = items.concat(p.categoriasProductoBienestar);
      if (p.surtidoPrincipal) items.push(p.surtidoPrincipal);
      if (p.ventaPresencial === 'Sí') items.push('Venta presencial en punto fijo');
    } else if (pack === 'E') {
      if (p.enfoqueEspiritual) items.push(p.enfoqueEspiritual.split(/\n/)[0].slice(0, 120));
      if (p.modalidadLectura) items.push(labelMap(MODALIDAD_LECTURA_LABELS, p.modalidadLectura));
    } else if (pack === 'F') {
      if (p.areaCoaching) items.push(p.areaCoaching);
      if (p.modalidadSesionCoaching) items.push(labelMap(MODALIDAD_COACHING_LABELS, p.modalidadSesionCoaching));
    } else if (pack === 'G') {
      if (p.tipoExperiencia) items.push(labelMap(TIPO_EXPERIENCIA_LABELS, p.tipoExperiencia));
      if (p.duracionExperiencia) items.push(p.duracionExperiencia);
      if (p.fechasExperiencia) items.push('Fechas: ' + p.fechasExperiencia);
      if (p.lugarExperiencia) items.push('Lugar: ' + p.lugarExperiencia);
      if (p.cupoMaximo) items.push('Cupo: ' + p.cupoMaximo);
    } else if (pack === 'H') {
      if (p.tipoExperienciaCeremonial) items.push(labelMap(TIPO_CEREMONIAL_LABELS, p.tipoExperienciaCeremonial));
      if (Array.isArray(p.acompanamientoCeremonial) && p.acompanamientoCeremonial.length) {
        items.push('Acompañamiento: ' + joinList(p.acompanamientoCeremonial));
      }
      if (p.requisitosPrevios) items.push('Requisitos: ' + p.requisitosPrevios.split(/\n/)[0].slice(0, 100));
      if (p.fechasCeremonia) items.push('Fechas: ' + p.fechasCeremonia);
      if (p.cupoCeremonia) items.push('Cupo: ' + p.cupoCeremonia);
      if (p.lugarCeremonia) items.push('Lugar: ' + p.lugarCeremonia);
    }
    return items.filter(function (x) { return txt(x); });
  }

  function buildDatosRows(pack, p, u) {
    p = p || {};
    u = u || {};
    var rows = [];
    pushRow(rows, '🎓', 'Certificaciones', p.certificaciones || u.certificaciones);
    pushRow(rows, '🕐', 'Horario', p.horarioDetalle || u.horario || u.horarioDetalle, 'horario');
    pushRow(rows, '📍', 'Ubicación', [u.zona, u.ciudad, u.estado].filter(Boolean).join(', ') || p.direccion || p.lugarCeremonia || p.lugarExperiencia);

    if (pack === 'A') {
      pushRow(rows, '⏱', 'Duración típica', labelMap(DURACION_LABELS, p.duracionSesionMinutos));
      pushRow(rows, '⚠️', 'Contraindicaciones', p.contraindicacionesGenerales);
      pushRow(rows, '🏠', 'Atención a domicilio', p.atencionDomicilio);
    } else if (pack === 'B') {
      pushRow(rows, '🧘', 'Estilo / linaje', p.tipoPractica);
      pushRow(rows, '📡', 'Modalidad', labelMap(MODALIDAD_CLASE_LABELS, p.modalidadClase));
      pushRow(rows, '📊', 'Niveles', p.nivelesAtendidos);
    } else if (pack === 'C') {
      pushRow(rows, '👥', 'Capacidad', p.capacidadGrupo ? p.capacidadGrupo + ' personas' : '');
    } else if (pack === 'D' && p.nombreComercial) {
      pushRow(rows, '🏪', 'Nombre comercial', p.nombreComercial);
      pushRow(rows, '📍', 'Dirección', p.direccion);
      pushRow(rows, '📦', 'Surtido', p.surtidoPrincipal);
    } else if (pack === 'D') {
      pushRow(rows, '🛍️', 'Surtido', p.surtidoPrincipal);
      pushRow(rows, '🏪', 'Venta presencial', p.ventaPresencial);
    } else if (pack === 'E') {
      pushRow(rows, '🔮', 'Modalidad', labelMap(MODALIDAD_LECTURA_LABELS, p.modalidadLectura));
    } else if (pack === 'F') {
      pushRow(rows, '🎯', 'Áreas', p.areaCoaching);
      pushRow(rows, '👥', 'Modalidad sesión', labelMap(MODALIDAD_COACHING_LABELS, p.modalidadSesionCoaching));
    } else if (pack === 'G') {
      pushRow(rows, '🌿', 'Experiencia', labelMap(TIPO_EXPERIENCIA_LABELS, p.tipoExperiencia));
      pushRow(rows, '📅', 'Fechas', p.fechasExperiencia);
      pushRow(rows, '📍', 'Lugar', p.lugarExperiencia);
      pushRow(rows, '👥', 'Cupo', p.cupoMaximo);
    } else if (pack === 'H') {
      pushRow(rows, '🕯️', 'Experiencia', labelMap(TIPO_CEREMONIAL_LABELS, p.tipoExperienciaCeremonial));
      pushRow(rows, '🌍', 'Jurisdicción', p.jurisdiccionDeclarada);
      pushRow(rows, '⚠️', 'Contraindicaciones', p.contraindicacionesObligatorias);
      pushRow(rows, '📋', 'Requisitos previos', p.requisitosPrevios);
      pushRow(rows, '📅', 'Fechas / calendario', p.fechasCeremonia);
      pushRow(rows, '👥', 'Cupo', p.cupoCeremonia);
      pushRow(rows, '📍', 'Lugar', p.lugarCeremonia);
      pushRow(rows, '🔞', 'Edad mínima', p.edadMinimaServicio ? p.edadMinimaServicio + ' años' : '18 años');
    }
    return rows;
  }

  function buildBadges(u, pack) {
    var badges = [];
    if (pack === 'H' || u.sensible) badges.push({ cls: 'res-badge--sensible', text: 'Contenido sensible' });
    if (pack === 'H' || u.regulada) badges.push({ cls: 'res-badge--regulada', text: 'Experiencia regulada' });
    if (pack === 'H' || u.requiresAdminReview) badges.push({ cls: 'res-badge--review', text: 'Revisión administrativa' });
    if (pack === 'H') badges.push({ cls: 'res-badge--ceremonial', text: 'Solo experiencia ceremonial' });
    return badges;
  }

  function buildSobreMi(pack, p, u) {
    if (txt(u.sobreMi)) return u.sobreMi;
    if (txt(u.descripcion)) return u.descripcion;
    if (pack === 'E' && p.enfoqueEspiritual) return p.enfoqueEspiritual;
    if (pack === 'H') {
      return 'Experiencia ceremonial guiada. Consulta fechas y cupo. No incluye venta ni comercialización de sustancias.';
    }
    if (p.tagline) return p.tagline;
    if (p.certificaciones) return 'Practitioner holístico con formación certificada. Información orientativa; no sustituye atención médica.';
    return '';
  }

  function buildStats(pack, p) {
    if (pack === 'H') {
      return [
        ['18+', 'Edad mínima'],
        ['Ceremonial', 'Solo experiencia guiada'],
        ['Consulta', 'Fechas y cupo'],
        ['Legal', 'Sin venta de sustancias']
      ];
    }
    if (pack === 'D') {
      return [
        ['Presencial', 'Punto fijo'],
        ['Natural', 'Productos holísticos'],
        ['Local', 'Sin e-commerce'],
        ['Info', 'Consultar surtido']
      ];
    }
    return [
      ['Holístico', 'Enfoque integral'],
      ['Certificado', 'Formación declarada'],
      ['Presencial', 'Consultar modalidad'],
      ['Info', 'Sin claims médicos']
    ];
  }

  function buildFeats(pack, u) {
    var feats = ['Información orientativa', 'Practitioner verificado en plataforma'];
    if (pack === 'H') {
      feats.push('Solo ceremonia / retiro / consulta');
      feats.push('Sin venta de sustancias');
    } else if (pack === 'D') {
      feats.push('Venta presencial');
      feats.push('Sin catálogo de sustancias reguladas');
    } else {
      feats.push('Agenda sujeta a disponibilidad');
    }
    if (u.regulada || pack === 'H') feats.push('Contenido regulado');
    return feats;
  }

  function packFaq(pack) {
    if (pack === 'H') {
      return [
        { q: '¿Cómo solicito información o fechas?', a: 'Escríbenos por WhatsApp o el contacto publicado con tu ciudad y la ceremonia de interés. Te respondemos con disponibilidad, requisitos y el siguiente paso.' },
        { q: '¿Cuáles son los requisitos previos?', a: 'Edad legal, cuestionario de salud y, cuando aplique, entrevista previa. Cada facilitador indica preparación, ayuno o restricciones específicas.' },
        { q: '¿Qué contraindicaciones debo considerar?', a: 'Condiciones médicas, medicamentos y embarazo pueden ser contraindicación. Decláralos con honestidad; si hay duda, consulta a tu médico antes de participar.' },
        { q: '¿Se venden sustancias o productos?', a: 'No. Este perfil informa sobre facilitación y logística del encuentro. No comercializamos sustancias controladas ni las enviamos a domicilio.' }
      ];
    }
    if (pack === 'D') {
      return [
        { q: '¿Dónde está ubicada la tienda?', a: 'La dirección y zona aparecen en la ficha y el mapa. Si necesitas referencias o horarios de visita, escríbenos por el contacto publicado.' },
        { q: '¿Qué productos manejan?', a: 'El surtido depende del negocio (velas, inciensos, aceites, etc.). Consulta la lista de productos en el perfil o pregunta disponibilidad por WhatsApp.' },
        { q: '¿Hay venta en línea?', a: 'Algunos locales ofrecen envío o pedido a distancia; otros solo venta presencial. Confírmalo en la ficha o al contactar al vendedor.' },
        { q: '¿Cuál es el horario?', a: 'El horario publicado en la ficha es orientativo. Para visitas o entregas el mismo día, confirma por el medio de contacto.' }
      ];
    }
    return [
      { q: '¿Cuál es la modalidad de atención?', a: 'Según la práctica: presencial en el espacio indicado y/o en línea cuando el formato lo permite. Lo aclaramos al agendar.' },
      { q: '¿Cuánto dura una sesión?', a: 'Depende del servicio (suele ir de 45 a 90 minutos). La duración exacta aparece en la ficha o te la confirmamos al contactarte.' },
      { q: '¿Emiten comprobante?', a: 'Sí, cuando el profesional lo ofrece. Indica al agendar si necesitas recibo o factura.' },
      { q: '¿Hay contraindicaciones?', a: 'Algunas prácticas no son aptas en embarazo, lesiones o condiciones médicas. Compártelas al contactar; si hay duda, consulta a tu médico.' }
    ];
  }

  function hydrateDisplayFields(u) {
    u = u || {};
    if (!isBienestarSectorPerfil(u)) return u;
    var p = perfilNested(u);
    var pack = packFrom(u);
    u.__bienestarPack = pack;
    u.sectorId = u.sectorId || 'bienestar';
    u.titulo = u.titulo || PACK_TITLES[pack] || 'Bienestar holístico';
    if (p.blockTitle) u.titulo = p.blockTitle;
    u.especialidad = u.especialidad || u.titulo;
    u.servicios = u.servicios || u.titulo;
    u.tagline = u.tagline || p.tagline || u.frase || '';
    u.sobreMi = buildSobreMi(pack, p, u);
    u.precio = u.precio || p.tarifaDesde || u.tarifaDesde || '';
    u.horario = u.horario || p.horarioDetalle || u.horarioDetalle || '';
    u.serviciosIncluidos = buildServiciosList(pack, p);
    u.atencion = u.atencion || (pack === 'D' ? 'Venta presencial' : 'Presencial / consultar');
    var locParts = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); });
    u.zonaCobertura = u.zonaCobertura || locParts.join(', ') || txt(p.direccion) || txt(p.lugarCeremonia) || txt(p.lugarExperiencia);
    u.cobertura = Array.isArray(u.cobertura) && u.cobertura.length ? u.cobertura : locParts.filter(Boolean);
    var certRaw = typeof u.certificaciones === 'string' ? u.certificaciones : p.certificaciones;
    if (txt(certRaw) && !Array.isArray(u.certificaciones)) {
      u.certificaciones = [[txt(certRaw), 'Formación holística']];
    }
    u.__bienestarDatos = buildDatosRows(pack, p, u);
    u.__bienestarBadges = buildBadges(u, pack);
    u.__bienestarPackHNotice = pack === 'H'
      ? 'Aviso legal: solo experiencia ceremonial guiada. Prohibida venta, envío o comercialización de sustancias. Información orientativa; no sustituye atención médica.'
      : '';
    u.__bienestarPackHCta = pack === 'H' ? 'Solicitar información / consultar fechas' : '';
    u.__bienestarPriceLabel = pack === 'H' ? 'Contribución' : (pack === 'D' ? 'Desde' : 'Tarifa desde');
    u.rating = u.rating != null ? u.rating : '—';
    u.opiniones = u.opiniones != null ? u.opiniones : 0;
    u.reviews = Array.isArray(u.reviews) ? u.reviews : [];
    u.faq = (Array.isArray(u.faq) && u.faq.length && u.faq.every(function (item) {
      return item && typeof item === 'object' && (item.q || item.pregunta) && (item.a || item.respuesta);
    }))
      ? u.faq
      : packFaq(pack);
    u.noIncluidos = Array.isArray(u.noIncluidos) && u.noIncluidos.length
      ? u.noIncluidos
      : (pack === 'H'
        ? ['Venta de sustancias', 'Envío a domicilio', 'Ventas en línea', 'Tarifa por unidad de sustancia', 'Inventario comercial']
        : ['Diagnóstico médico', 'Prescripción clínica', 'Promesas de curación']);
    u.stats = Array.isArray(u.stats) && u.stats.length ? u.stats : buildStats(pack, p);
    u.feats = Array.isArray(u.feats) && u.feats.length ? u.feats : buildFeats(pack, u);
    u.metodosPago = Array.isArray(u.metodosPago) && u.metodosPago.length ? u.metodosPago : ['Consultar'];
    u.tiempoRespuesta = u.tiempoRespuesta || 'Consultar disponibilidad';
    u.urgencias = u.urgencias || (pack === 'H' ? 'Consultar fechas' : 'Agenda sujeta a disponibilidad');
    if (pack === 'H') {
      u.envioDomicilio = false;
      u.tiendaOnline = false;
      PACK_H_FORBIDDEN_DISPLAY.forEach(function (key) {
        if (Object.prototype.hasOwnProperty.call(u, key)) delete u[key];
      });
    }
    return u;
  }

  function cardMetaChips(u) {
    u = hydrateDisplayFields(Object.assign({}, u));
    var pack = u.__bienestarPack;
    var p = perfilNested(u);
    var chips = [];
    if (pack === 'A' && Array.isArray(p.modalidadesTerapia) && p.modalidadesTerapia[0]) {
      chips.push(p.modalidadesTerapia[0]);
    } else if (pack === 'B' && p.tipoPractica) {
      chips.push(p.tipoPractica);
    } else if (pack === 'C' && Array.isArray(p.serviciosCentro) && p.serviciosCentro[0]) {
      chips.push(p.serviciosCentro[0]);
    } else if (pack === 'D' && p.surtidoPrincipal) {
      chips.push(p.surtidoPrincipal.slice(0, 28));
    } else if (pack === 'E' && p.modalidadLectura) {
      chips.push(labelMap(MODALIDAD_LECTURA_LABELS, p.modalidadLectura));
    } else if (pack === 'F' && p.areaCoaching) {
      chips.push(p.areaCoaching.slice(0, 28));
    } else if (pack === 'G' && p.tipoExperiencia) {
      chips.push(labelMap(TIPO_EXPERIENCIA_LABELS, p.tipoExperiencia));
    } else if (pack === 'H') {
      chips.push('Ceremonia guiada');
      chips.push('Consultar fechas');
    }
    if (u.horario || p.horarioDetalle) chips.push((u.horario || p.horarioDetalle).slice(0, 24));
    return chips;
  }

  function packHtmlSafeContainsForbidden(html) {
    var h = String(html || '').toLowerCase();
    return /\b(carrito|e-?commerce|stock|dosis|precio por sustancia|cat[aá]logo comercial)\b/i.test(h);
  }

  global.CariHubBienestarSectorRender = {
    PACK_TITLES: PACK_TITLES,
    isAdultosBienestar: isAdultosBienestar,
    isBienestarSectorPerfil: isBienestarSectorPerfil,
    isBienestarRetailNegocio: isBienestarRetailNegocio,
    resolveVistaPerfil: resolveVistaPerfil,
    packFrom: packFrom,
    buildServiciosList: buildServiciosList,
    buildDatosRows: buildDatosRows,
    hydrateDisplayFields: hydrateDisplayFields,
    cardMetaChips: cardMetaChips,
    packHtmlSafeContainsForbidden: packHtmlSafeContainsForbidden
  };
})(typeof window !== 'undefined' ? window : globalThis);
