(function (global) {
  'use strict';

  /**
   * FieldEngine lite — Paso A: resuelve schema por subcategoriaId y configura UI de registro-perfil.
   * Fuente: mapa-registro-categorias.json (índice pregenerado en data/registro-schema-index.js).
   */

  var TEMPORAL_SOLICITUD = {
    formularioId: 'persona_independiente',
    arquetipo: 'persona_servicio_general',
    tipoPerfil: 'persona',
    componenteResultados: 'ResultCardServicio',
    componentePerfil: 'ProfileLayoutServicio',
    modo: 'temporal_categoria_sugerida'
  };

  var UI_BLOCKS = {
    edad: { wrapId: 'wrapEdad', inputId: 'fldEdad' },
    modalidad: { wrapId: 'wrapModalidad', inputId: 'fldModalidad' },
    alias: { inputId: 'fldAlias', defaultLabel: 'Alias / nombre público' },
    descripcion: { inputId: 'fldDescripcion', defaultLabel: 'Descripción corta' },
    precio: { inputId: 'fldPrecio', defaultLabel: 'Precio desde' },
    horario: { inputId: 'fldHorario', defaultLabel: 'Horario público' },
    servicios: { inputId: 'fldServicios', defaultLabel: 'Servicios u ofertas' },
    whatsapp: { inputId: 'fldWhatsapp' },
    telegram: { inputId: 'fldTelegram' }
  };

  /** Perfiles UI derivados de plantillasArquetipo en schemas congelados */
  var UI_BY_ARQUETIPO = {
    persona_acompanante: {
      titulo: 'Perfil personal · acompañante',
      show: ['edad', 'modalidad', 'alias', 'descripcion', 'precio', 'horario', 'servicios', 'whatsapp', 'telegram'],
      labels: {
        alias: 'Alias / nombre público',
        descripcion: 'Frase corta para tu tarjeta',
        precio: 'Precio desde (MXN)',
        servicios: 'Servicios incluidos (resumen)'
      },
      obligatoriosUi: ['alias', 'descripcion', 'precio', 'modalidad', 'edad']
    },
    persona_dominatrix: {
      titulo: 'Perfil personal · dominación',
      show: ['edad', 'modalidad', 'alias', 'descripcion', 'precio', 'horario', 'servicios', 'whatsapp', 'telegram'],
      labels: { alias: 'Alias profesional', servicios: 'Servicios y límites (resumen)' },
      obligatoriosUi: ['alias', 'descripcion', 'precio', 'edad']
    },
    persona_creador: {
      titulo: 'Creador de contenido',
      show: ['alias', 'descripcion', 'precio', 'horario', 'whatsapp', 'telegram'],
      hide: ['edad', 'modalidad', 'servicios'],
      labels: { alias: 'Nombre de creador', descripcion: 'Tipos de contenido (resumen)', precio: 'Precio suscripción / tarifa' },
      obligatoriosUi: ['alias', 'descripcion']
    },
    persona_espectaculo: {
      titulo: 'Espectáculo / show',
      show: ['alias', 'descripcion', 'precio', 'horario', 'servicios', 'whatsapp', 'telegram'],
      hide: ['edad', 'modalidad'],
      labels: { alias: 'Nombre artístico', servicios: 'Tipo de show', precio: 'Precio show / mínimo' },
      obligatoriosUi: ['alias', 'precio', 'horario']
    },
    negocio_retail: {
      titulo: 'Negocio · retail (ej. Sex Shop)',
      show: ['alias', 'descripcion', 'precio', 'horario', 'servicios', 'whatsapp', 'telegram'],
      hide: ['edad', 'modalidad'],
      labels: {
        alias: 'Nombre comercial',
        descripcion: 'Frase del negocio',
        servicios: 'Categorías de productos (resumen)',
        precio: 'Precio desde'
      },
      obligatoriosUi: ['alias', 'descripcion', 'horario', 'servicios']
    },
    negocio_bienestar: {
      titulo: 'Negocio · bienestar (Spa, masajes)',
      show: ['alias', 'descripcion', 'precio', 'horario', 'servicios', 'whatsapp', 'telegram'],
      hide: ['edad', 'modalidad'],
      labels: { alias: 'Nombre comercial', servicios: 'Menú de servicios (resumen)', precio: 'Precio desde' },
      obligatoriosUi: ['alias', 'servicios', 'precio', 'horario']
    },
    negocio_hospedaje: {
      titulo: 'Hospedaje (Hotel / Motel)',
      show: ['alias', 'descripcion', 'precio', 'horario', 'servicios', 'whatsapp', 'telegram'],
      hide: ['edad', 'modalidad'],
      labels: { alias: 'Nombre comercial', servicios: 'Tipos de habitación / amenidades', precio: 'Tarifa desde' },
      obligatoriosUi: ['alias', 'precio', 'horario']
    },
    negocio_venue: {
      titulo: 'Local / antro / venue',
      show: ['alias', 'descripcion', 'precio', 'horario', 'servicios', 'whatsapp', 'telegram'],
      hide: ['edad', 'modalidad'],
      labels: { alias: 'Nombre comercial', servicios: 'Reglas / áreas del local', precio: 'Cover / entrada desde' },
      obligatoriosUi: ['alias', 'precio', 'horario']
    },
    pareja_grupo: {
      titulo: 'Pareja / grupo',
      show: ['alias', 'descripcion', 'precio', 'horario', 'servicios', 'whatsapp', 'telegram'],
      hide: ['edad', 'modalidad'],
      labels: { alias: 'Alias del perfil grupal' },
      obligatoriosUi: ['alias', 'descripcion']
    },
    persona_servicio_general: {
      titulo: 'Perfil público',
      show: ['alias', 'descripcion', 'precio', 'horario', 'servicios', 'whatsapp', 'telegram'],
      hide: ['edad', 'modalidad'],
      labels: {
        alias: 'Nombre público / alias',
        servicios: 'Servicios u ofertas que ofreces',
        precio: 'Tarifa desde',
        descripcion: 'Descripción breve',
        horario: 'Horario público'
      },
      obligatoriosUi: ['alias', 'servicios', 'descripcion', 'precio']
    },
    persona_servicio_hogar: {
      titulo: 'Oficio del hogar (plomero, electricista…)',
      show: ['alias', 'descripcion', 'precio', 'horario', 'servicios', 'whatsapp', 'telegram'],
      hide: ['edad', 'modalidad'],
      labels: { servicios: 'Servicios y materiales (resumen)', precio: 'Tarifa / visita desde' },
      obligatoriosUi: ['alias', 'servicios', 'precio']
    },
    profesionista: {
      titulo: 'Profesionista (cédula / titulación)',
      show: ['alias', 'descripcion', 'precio', 'horario', 'servicios', 'whatsapp', 'telegram'],
      hide: ['edad', 'modalidad'],
      labels: {
        alias: 'Nombre profesional público',
        servicios: 'Especialidad / servicios',
        precio: 'Precio consulta desde',
        descripcion: 'Frase profesional'
      },
      obligatoriosUi: ['alias', 'servicios', 'precio']
    },
    empresa_servicios: {
      titulo: 'Empresa de servicios',
      show: ['alias', 'descripcion', 'precio', 'horario', 'servicios', 'whatsapp', 'telegram'],
      hide: ['edad', 'modalidad'],
      labels: { alias: 'Nombre comercial', servicios: 'Servicios de la empresa' },
      obligatoriosUi: ['alias', 'servicios']
    },
    negocio_inmobiliaria: {
      titulo: 'Inmueble / bienes raíces',
      show: ['alias', 'descripcion', 'precio', 'horario', 'servicios', 'whatsapp', 'telegram'],
      hide: ['edad', 'modalidad'],
      labels: {
        alias: 'Título del anuncio',
        descripcion: 'Descripción de la propiedad',
        precio: 'Renta o precio desde',
        servicios: 'Características (m², recámaras, amenidades)',
        horario: 'Horario para visitas'
      },
      obligatoriosUi: ['alias', 'descripcion', 'precio']
    },
    generico: {
      titulo: 'Registro público',
      show: ['alias', 'descripcion', 'precio', 'horario', 'servicios', 'whatsapp', 'telegram'],
      hide: ['edad', 'modalidad'],
      obligatoriosUi: ['alias', 'descripcion']
    }
  };

  var SECTOR_UI_FALLBACK = {
    salud: 'profesionista',
    profesionales: 'profesionista',
    hogar: 'persona_servicio_hogar',
    automotriz: 'empresa_servicios',
    comercio: 'negocio_retail',
    'bienes-raices': 'negocio_inmobiliaria',
    eventos: 'empresa_servicios',
    transporte: 'empresa_servicios',
    educacion: 'empresa_servicios',
    tecnologia: 'empresa_servicios',
    restaurantes: 'negocio_venue',
    mascotas: 'empresa_servicios',
    industria: 'empresa_servicios',
    bienestar: 'negocio_bienestar'
  };

  var MATRIX_SAMPLES = [
    { id: 'escort', nombre: 'Escort' },
    { id: 'sex shop', nombre: 'Sex Shop' },
    { id: 'spa', nombre: 'Spa (adultos)' },
    { id: 'hotel motel', nombre: 'Hotel / Motel' },
    { id: 'cirugia-plastica-y-estetica', nombre: 'Cirugía plástica y estética' },
    { id: 'medicos-generales', nombre: 'Médicos generales' },
    { id: 'abogados', nombre: 'Abogados' },
    { id: 'plomeros', nombre: 'Plomeros (hogar)' },
    { id: 'restaurante', nombre: 'Restaurante (negocio)' },
    { id: 'solicitud-pendiente', nombre: 'Categoría nueva (pendiente)' }
  ];

  function $(id) {
    return document.getElementById(id);
  }

  function normId(id) {
    return String(id || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function resolveMapaRow(subcategoriaId) {
    var idx = global.CARIHUB_REGISTRO_SCHEMA_INDEX;
    if (!idx || !idx.byId || !subcategoriaId) return null;
    return idx.byId[subcategoriaId] || null;
  }

  function resolveFormularioUi(ctx) {
    ctx = ctx || {};
    var subId = ctx.subcategoriaId || (ctx.subcategoria && ctx.subcategoria.id) || '';
    var uiIdx = global.CARIHUB_REGISTRO_UI_INDEX;
    if (!uiIdx || !uiIdx.bySubcategoriaId || !subId) return null;
    var uiId = uiIdx.bySubcategoriaId[subId];
    if (!uiId || !uiIdx.catalogo || !uiIdx.catalogo[uiId]) return null;
    var cat = uiIdx.catalogo[uiId];
    return {
      formularioUiId: uiId,
      titulo: cat.titulo,
      formularioSchemaId: cat.formularioSchemaId,
      arquetipo: cat.arquetipo,
      sectorCluster: cat.sectorCluster,
      publicoUi: cat.publicoUi || {}
    };
  }

  function arquetipoToUiProfileKey(arquetipo, row) {
    var uiKey = arquetipo || 'generico';
    if (!row) return uiKey;
    if (row.formularioId === 'profesionista_cedula' ||
        arquetipo === 'profesional_salud' ||
        arquetipo === 'profesional_tecnico_legal' ||
        arquetipo === 'profesional_veterinario') {
      return 'profesionista';
    }
    if (row.sectorId === 'bienes-raices' || arquetipo === 'negocio_inmobiliario') {
      return 'negocio_inmobiliaria';
    }
    if (arquetipo === 'persona_servicio_hogar') return 'persona_servicio_hogar';
    if (arquetipo === 'empresa_servicios' || arquetipo === 'negocio_alimentos') {
      return 'empresa_servicios';
    }
    if (arquetipo === 'negocio_retail' || arquetipo === 'negocio_bienestar' ||
        arquetipo === 'negocio_hospedaje' || arquetipo === 'negocio_venue') {
      if (row.formularioId === 'adultos') {
        if (arquetipo === 'negocio_retail') return 'negocio_retail';
        if (arquetipo === 'negocio_bienestar') return 'negocio_bienestar';
        if (arquetipo === 'negocio_hospedaje') return 'negocio_hospedaje';
        return 'negocio_venue';
      }
      return 'empresa_servicios';
    }
    if (arquetipo === 'persona_acompanante' || arquetipo === 'persona_dominatrix') {
      return arquetipo;
    }
    if (arquetipo === 'persona_creador') return 'persona_creador';
    if (arquetipo === 'persona_espectaculo') return 'persona_espectaculo';
    if (arquetipo === 'pareja_grupo') return 'pareja_grupo';
    if (row && row.formularioId === 'negocio_empresa') {
      if (arquetipo === 'negocio_inmobiliario') return 'negocio_inmobiliaria';
      if (arquetipo === 'negocio_comercio') return 'negocio_retail';
      return 'empresa_servicios';
    }
    if (arquetipo === 'persona_servicio_oficio') return 'persona_servicio_hogar';
    if (UI_BY_ARQUETIPO[arquetipo]) return arquetipo;
    return 'persona_servicio_general';
  }

  function buildUiFromExperiencia(experiencia, row) {
    var pub = (experiencia && experiencia.publicoUi) || {};
    var baseKey = arquetipoToUiProfileKey(
      (experiencia && experiencia.arquetipo) || (row && row.arquetipo),
      row
    );
    var base = UI_BY_ARQUETIPO[baseKey] || UI_BY_ARQUETIPO.generico;
    var show = pub.show || base.show || [];
    var hide = pub.hide || base.hide || [];
    var labels = {};
    if (base.labels) {
      Object.keys(base.labels).forEach(function (k) { labels[k] = base.labels[k]; });
    }
    if (pub.labels) {
      Object.keys(pub.labels).forEach(function (k) { labels[k] = pub.labels[k]; });
    }
    return {
      titulo: (experiencia && experiencia.titulo) || base.titulo || 'Registro público',
      formularioUiId: experiencia && experiencia.formularioUiId,
      show: show.slice(),
      hide: hide.slice(),
      labels: labels,
      obligatoriosUi: pub.obligatoriosUi || base.obligatoriosUi || ['alias'],
      obligatoriosExtra: pub.obligatoriosExtra || [],
      notaPublica: pub.nota || pub.notaPublica || ''
    };
  }

  function resolveRegistrationSchema(ctx) {
    ctx = ctx || {};
    var subId = ctx.subcategoriaId || (ctx.subcategoria && ctx.subcategoria.id) || '';
    var pending = ctx.estadoCatalogo === 'pendiente_aprobacion' ||
      subId === 'solicitud-pendiente' ||
      subId === 'solicitud-clasificacion-pendiente';

    if (pending) {
      var pendingUi = buildUiFromExperiencia(null, null);
      return {
        identidad: Object.assign({ subcategoriaId: subId, modo: 'temporal_categoria_sugerida' }, TEMPORAL_SOLICITUD),
        uiProfileKey: 'persona_servicio_general',
        ui: pendingUi,
        formularioUiId: 'ui_ind_general',
        tituloExperiencia: pendingUi.titulo,
        pending: true
      };
    }

    var row = resolveMapaRow(subId);
    var experiencia = resolveFormularioUi(ctx);

    if (!row) {
      var sectorId = ctx.sectorId || (ctx.sector && ctx.sector.id) || '';
      var fbKey = SECTOR_UI_FALLBACK[sectorId] || 'persona_servicio_general';
      var fbUi = buildUiFromExperiencia(experiencia, { arquetipo: fbKey, sectorId: sectorId });
      return {
        identidad: {
          subcategoriaId: subId,
          sectorId: sectorId,
          formularioId: 'persona_independiente',
          arquetipo: fbKey,
          tipoPerfil: 'persona',
          formularioUiId: experiencia ? experiencia.formularioUiId : null
        },
        uiProfileKey: fbKey,
        ui: fbUi,
        formularioUiId: experiencia ? experiencia.formularioUiId : 'ui_ind_general',
        tituloExperiencia: fbUi.titulo,
        experiencia: experiencia,
        pending: false,
        fallback: true
      };
    }

    var uiKey = arquetipoToUiProfileKey(row.arquetipo, row);
    var ui = buildUiFromExperiencia(experiencia, row);

    return {
      identidad: {
        subcategoriaId: row.subcategoriaId,
        subcategoria: row.subcategoria,
        sectorId: row.sectorId,
        formularioId: row.formularioId,
        arquetipo: row.arquetipo,
        tipoPerfil: row.tipoPerfil,
        componenteResultados: row.componenteResultados,
        componentePerfil: row.componentePerfil,
        fotosMin: row.fotos,
        formularioUiId: experiencia ? experiencia.formularioUiId : null
      },
      uiProfileKey: uiKey,
      ui: ui,
      formularioUiId: experiencia ? experiencia.formularioUiId : null,
      tituloExperiencia: ui.titulo,
      experiencia: experiencia,
      row: row,
      pending: false,
      fallback: false
    };
  }

  function setFieldVisible(blockKey, visible, labels) {
    var block = UI_BLOCKS[blockKey];
    if (!block) return;
    if (block.wrapId) {
      var wrap = $(block.wrapId);
      if (wrap) wrap.classList.toggle('rp-hidden', !visible);
    }
    if (block.inputId && labels && labels[blockKey]) {
      var input = $(block.inputId);
      if (input) {
        var lbl = document.querySelector('label[for="' + block.inputId + '"]');
        if (lbl) lbl.textContent = labels[blockKey];
      }
    }
  }

  function applyRegistrationSchemaToScreen(ctx) {
    var resolved = resolveRegistrationSchema(ctx);
    var ui = resolved.ui;
    var show = ui.show || [];
    var hide = ui.hide || [];
    var labels = ui.labels || {};

    Object.keys(UI_BLOCKS).forEach(function (key) {
      var visible = show.indexOf(key) >= 0 && hide.indexOf(key) < 0;
      setFieldVisible(key, visible, labels);
    });

    var notice = $('rpSchemaProfileNotice');
    if (notice) {
      notice.textContent = '';
      notice.classList.add('rp-hidden');
    }

    var faltantes = $('rpSchemaFaltantesNotice');
    if (faltantes) {
      faltantes.innerHTML = '';
      faltantes.classList.add('rp-hidden');
    }

    var uiNotice = $('rpUiFormNotice');
    if (uiNotice) {
      if (ui.notaPublica) {
        uiNotice.textContent = ui.notaPublica;
        uiNotice.classList.remove('rp-hidden');
        uiNotice.removeAttribute('aria-hidden');
      } else {
        uiNotice.textContent = '';
        uiNotice.classList.add('rp-hidden');
        uiNotice.setAttribute('aria-hidden', 'true');
      }
    }

    return resolved;
  }

  function lookupSubcategoriaId(input) {
    var raw = String(input || '').trim();
    if (!raw) return '';
    var id = normId(raw);
    if (resolveMapaRow(id)) return id;
    if (global.CariHubCatalogos && CariHubCatalogos.idCategoria) {
      var catId = CariHubCatalogos.idCategoria(raw);
      if (catId && resolveMapaRow(catId)) return catId;
    }
    var idx = global.CARIHUB_REGISTRO_SCHEMA_INDEX;
    if (idx && idx.byId) {
      var keys = Object.keys(idx.byId);
      for (var i = 0; i < keys.length; i++) {
        var row = idx.byId[keys[i]];
        if (normId(row.subcategoriaId) === id) return row.subcategoriaId;
        if (normId(row.subcategoria) === id) return row.subcategoriaId;
      }
    }
    return id;
  }

  function componenteToVistaPerfil(componente, row) {
    var comp = componente || 'ResultCardGenerico';
    var subId = row && row.subcategoriaId;
    if (comp === 'ResultCardAdultos' || comp === 'ProfileLayoutAdultos') {
      if (subId && global.CariHubResultadosDemo && CariHubResultadosDemo.vistaDeCategoriaLegacy) {
        return CariHubResultadosDemo.vistaDeCategoriaLegacy(subId);
      }
      return 'adult';
    }
    if (comp === 'ResultCardNegocio' || comp === 'ProfileLayoutNegocio') {
      if (subId === 'sex shop') return 'sexShop';
      if (subId === 'masajes') return 'masajesLocal';
      if (subId === 'spa') return 'negocio';
      return 'negocio';
    }
    if (comp === 'ResultCardProfesional' || comp === 'ProfileLayoutProfesional') {
      if (row && (row.arquetipo === 'profesional_salud' || row.formularioId === 'profesionista_cedula')) {
        if (row.arquetipo === 'profesional_tecnico_legal') return 'pro';
        return 'medico';
      }
      return 'pro';
    }
    if (comp === 'ResultCardServicio' || comp === 'ProfileLayoutServicio') {
      if (row && (row.tipoPerfil === 'negocio' || row.formularioId === 'negocio_empresa')) return 'empresa';
      return 'pro';
    }
    return 'adult';
  }

  function resolvePublicPresentation(ctx) {
    ctx = ctx || {};
    var subId = ctx.subcategoriaId || lookupSubcategoriaId(ctx.categoria || ctx.subcategoria || '');
    var reg = resolveRegistrationSchema(Object.assign({}, ctx, { subcategoriaId: subId }));
    var ident = reg.identidad || {};
    var row = reg.row;
    var compRes = ident.componenteResultados || 'ResultCardGenerico';
    var compPer = ident.componentePerfil || 'ProfileLayoutGenerico';
    var vistaPerfil = componenteToVistaPerfil(compPer, row || { subcategoriaId: subId, arquetipo: ident.arquetipo, formularioId: ident.formularioId, tipoPerfil: ident.tipoPerfil });
    return {
      subcategoriaId: subId,
      subcategoria: ident.subcategoria || ctx.subcategoria || '',
      formularioId: ident.formularioId || '',
      arquetipo: ident.arquetipo || '',
      tipoPerfil: ident.tipoPerfil || '',
      componenteResultados: compRes,
      componentePerfil: compPer,
      vistaPerfil: vistaPerfil,
      esAdultoPersona: compRes === 'ResultCardAdultos',
      registro: reg
    };
  }

  function enriquecerPerfilPublico(u, ctx) {
    if (!u) return u;
    var pres = resolvePublicPresentation(ctx || {
      subcategoriaId: u.subcategoriaId,
      categoria: u.categoria || u.categoriaPublica
    });
    u.__componenteResultados = pres.componenteResultados;
    u.__componentePerfil = pres.componentePerfil;
    u.__vista = pres.vistaPerfil;
    if (pres.subcategoriaId) u.subcategoriaId = pres.subcategoriaId;
    if (pres.arquetipo) u.arquetipo = pres.arquetipo;
    if (pres.tipoPerfil && !u.tipoPerfil) u.tipoPerfil = pres.tipoPerfil;
    return u;
  }

  function getSpecOnlyFields(resolved) {
    var row = resolved.row;
    if (!row) {
      if (resolved.pending) return ['validación admin', 'clasificación definitiva'];
      return [];
    }
    var map = {
      persona_acompanante: ['serviciosIncluidos', 'serviciosNoRealizo', 'fisico', 'disponibilidad', 'INE (privado)'],
      negocio_retail: ['direccion', 'categoriasProducto', 'RFC', 'razón social', 'envío / tienda online'],
      negocio_bienestar: ['menuServicios', 'amenidades', 'direccion', 'RFC'],
      negocio_hospedaje: ['tiposHabitacion', 'tarifaNoche', 'amenidades'],
      persona_servicio_general: ['zonaCobertura', 'certificaciones', 'INE (privado)'],
      profesionista: ['cédula profesional', 'especialidad', 'seguros aceptados'],
      negocio_inmobiliaria: ['dirección exacta (privada)', 'escrituras / contrato', 'RFC', 'comprobante de domicilio']
    };
    var key = resolved.uiProfileKey;
    return map[key] || ['campos privados Fase 2', 'verificación'];
  }

  function buildMatrixRow(sampleId) {
    var ctx = sampleId === 'solicitud-pendiente'
      ? { subcategoriaId: 'solicitud-pendiente', estadoCatalogo: 'pendiente_aprobacion' }
      : { subcategoriaId: sampleId };
    var resolved = resolveRegistrationSchema(ctx);
    var ui = resolved.ui;
    var registroActual = 'Formulario único (alias, edad, modalidad, precio, geo, fotos…)';
    var registroPasoA = (ui.show || []).filter(function (k) { return UI_BLOCKS[k]; }).join(', ') +
      (ui.hide && ui.hide.length ? ' · oculta: ' + ui.hide.join(', ') : '');
    var resultados = resolved.identidad.componenteResultados || 'ResultCardGenerico';
    var perfil = resolved.identidad.componentePerfil || 'ProfileLayoutGenerico';
    return {
      id: sampleId,
      nombre: MATRIX_SAMPLES.find(function (s) { return s.id === sampleId; }).nombre,
      formularioId: resolved.identidad.formularioId || '—',
      arquetipo: resolved.identidad.arquetipo || '—',
      registroActual: registroActual,
      registroPasoA: registroPasoA,
      resultadosSpec: resultados,
      perfilSpec: perfil,
      faltantesFase2: getSpecOnlyFields(resolved).join('; ')
    };
  }

  function getComparisonMatrix() {
    return MATRIX_SAMPLES.map(function (s) { return buildMatrixRow(s.id); });
  }

  function validatePublicDraft(ctx, campos) {
    var resolved = resolveRegistrationSchema(ctx);
    var ui = resolved.ui;
    var oblig = ui.obligatoriosUi || ['alias'];
    var missing = [];
    campos = campos || {};
    oblig.forEach(function (key) {
      var wrapEdad = document.getElementById('wrapEdad');
      var wrapMod = document.getElementById('wrapModalidad');
      if (key === 'edad' && wrapEdad && wrapEdad.classList.contains('rp-hidden')) return;
      if (key === 'modalidad' && wrapMod && wrapMod.classList.contains('rp-hidden')) return;
      if (ui.hide && ui.hide.indexOf(key) >= 0) return;
      var block = UI_BLOCKS[key];
      if (!block || !block.inputId) return;
      var val = campos[block.inputId] != null ? String(campos[block.inputId]).trim() : '';
      if (!val) missing.push(block.defaultLabel || key);
    });
    if (!campos.pais || !campos.estado || !campos.ciudad) {
      missing.push('ubicación (país, estado, ciudad)');
    }
    return { ok: missing.length === 0, missing: missing, resolved: resolved };
  }

  global.CariHubFieldEngineLite = {
    resolveRegistrationSchema: resolveRegistrationSchema,
    resolveFormularioUi: resolveFormularioUi,
    buildUiFromExperiencia: buildUiFromExperiencia,
    arquetipoToUiProfileKey: arquetipoToUiProfileKey,
    resolveMapaRow: resolveMapaRow,
    lookupSubcategoriaId: lookupSubcategoriaId,
    resolvePublicPresentation: resolvePublicPresentation,
    componenteToVistaPerfil: componenteToVistaPerfil,
    enriquecerPerfilPublico: enriquecerPerfilPublico,
    applyRegistrationSchemaToScreen: applyRegistrationSchemaToScreen,
    validatePublicDraft: validatePublicDraft,
    getSpecOnlyFields: getSpecOnlyFields,
    getComparisonMatrix: getComparisonMatrix,
    UI_BY_ARQUETIPO: UI_BY_ARQUETIPO
  };
})(typeof window !== 'undefined' ? window : globalThis);
