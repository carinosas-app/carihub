(function (global) {
  'use strict';

  function $(id) {
    return document.getElementById(id);
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function resolveEscortConfig() {
    return global.CARIHUB_REGISTRO_ESCORT_BLOCKS || null;
  }

  function resolveParejaConfig() {
    return global.CARIHUB_REGISTRO_PAREJA_BLOCKS || null;
  }

  function resolveLifestyleConfig() {
    return global.CARIHUB_REGISTRO_LIFESTYLE_BLOCKS || null;
  }

  function resolveDominatrixConfig() {
    return global.CARIHUB_REGISTRO_DOMINATRIX_BLOCKS || null;
  }

  function resolveEspectaculoConfig() {
    return global.CARIHUB_REGISTRO_ESPECTACULO_BLOCKS || null;
  }

  function resolveCreadorConfig() {
    return global.CARIHUB_REGISTRO_CREADOR_BLOCKS || null;
  }

  function resolveRetailConfig() {
    return global.CARIHUB_REGISTRO_RETAIL_BLOCKS || null;
  }

  function resolveVenueConfig() {
    return global.CARIHUB_REGISTRO_VENUE_BLOCKS || null;
  }

  function resolveBienestarConfig() {
    return global.CARIHUB_REGISTRO_BIENESTAR_BLOCKS || null;
  }

  function resolveHospedajeConfig() {
    return global.CARIHUB_REGISTRO_HOSPEDAJE_BLOCKS || null;
  }

  function normalizeCreadorSubId(raw) {
    var subId = normalizeSubId(raw);
    if (subId === 'contenido' || subId === 'creador contenido') return 'contenido';
    return '';
  }

  function normalizeEscortSubId(raw) {
    var subId = normalizeSubId(raw);
    if (!subId) return '';
    if (subId === 'escort gay') return 'escort gay';
    if (subId === 'escort vip') return 'escort vip';
    if (subId === 'tom boy' || subId === 'tom fem') return subId;
    return subId;
  }

  function normalizeRetailSubId(raw) {
    var subId = normalizeSubId(raw);
    if (subId === 'sex shop') return 'sex_shop';
    return '';
  }

  function normalizeVenueSubId(raw) {
    var subId = normalizeSubId(raw);
    if (subId === 'antro restaurant bar lgbt' || subId === 'antro lgbt') return 'antro_lgbt';
    if (subId === 'antro restaurant bar' || subId === 'antro') return 'antro';
    if (subId === 'club sw' || subId === 'club_sw' || subId === 'club swinger' || subId === 'club_swinger') return 'club_sw';
    if (subId === 'cabinas glory holes' || subId === 'cabinas / glory holes' || subId === 'cabinas') return 'cabinas';
    if (subId === 'cine xxx' || subId === 'cine adulto' || subId === 'cine_xxx') return 'cine_xxx';
    return '';
  }

  function normalizeBienestarSubId(raw) {
    var subId = normalizeSubId(raw);
    if (subId === 'spa') return 'spa';
    if (subId === 'masajes') return 'masajes';
    return '';
  }

  function normalizeHospedajeSubId(raw) {
    var subId = normalizeSubId(raw);
    if (subId === 'hotel motel' || subId === 'hotel / motel' || subId === 'hotel_motel') return 'hotel_motel';
    if (subId === 'hotel' || subId === 'motel') return 'hotel_motel';
    return '';
  }

  function normalizeEspectaculoSubId(raw) {
    var subId = normalizeSubId(raw);
    if (subId === 'table dance' || subId === 'tabledance') return 'tabledance';
    if (subId === 'stripper') return 'stripper';
    return '';
  }

  function isEdecanSubcategoria(ctx) {
    return normalizeSubId((ctx && ctx.subcategoriaId) || (ctx && ctx.subcategoria) || '') === 'edecan';
  }

  function isModelosSubcategoria(ctx) {
    return normalizeSubId((ctx && ctx.subcategoriaId) || (ctx && ctx.subcategoria) || '') === 'modelos';
  }

  var MODALIDAD_EDECAN_LABELS = {
    evento_venue: 'Eventos / venue acordado',
    activaciones: 'Activaciones',
    expos: 'Expos',
    imagen_marca: 'Imagen de marca',
    viaja: 'Viaja a eventos'
  };

  var MODALIDAD_MODELOS_LABELS = {
    estudio: 'Sesión en estudio',
    locacion: 'Locación acordada',
    pasarela: 'Pasarela / evento',
    produccion: 'Campaña / producción',
    viaja: 'Viaja a producción/evento'
  };

  function buildEdecanPerfil(values) {
    values = values || {};
    return {
      tiposEvento: Array.isArray(values.tiposEvento) ? values.tiposEvento.slice() : [],
      experienciaProfesional: values.experienciaProfesional || '',
      serviciosProfesionales: Array.isArray(values.serviciosProfesionales) ? values.serviciosProfesionales.slice() : [],
      restriccionesProfesionales: Array.isArray(values.restriccionesProfesionales) ? values.restriccionesProfesionales.slice() : [],
      eventosDisponibles: values.eventosDisponibles,
      modalidades: Array.isArray(values.modalidades) ? values.modalidades.slice() : [],
      viajesDesplazamiento: values.viajesDesplazamiento || null
    };
  }

  function buildModelosPerfil(values) {
    values = values || {};
    return {
      tiposModelaje: Array.isArray(values.tiposModelaje) ? values.tiposModelaje.slice() : [],
      experienciaProfesional: values.experienciaProfesional || '',
      serviciosProfesionales: Array.isArray(values.serviciosProfesionales) ? values.serviciosProfesionales.slice() : [],
      restriccionesProfesionales: Array.isArray(values.restriccionesProfesionales) ? values.restriccionesProfesionales.slice() : [],
      portfolioURL: values.portfolioURL || '',
      modalidades: Array.isArray(values.modalidades) ? values.modalidades.slice() : [],
      viajesDesplazamiento: values.viajesDesplazamiento || null
    };
  }

  function modalidadProfLabel(m, labels) {
    return labels[m] || m;
  }

  function finalizeEdecanValues(values, ctx) {
    if (!values || !isEdecanSubcategoria(ctx || {})) return values;
    clearProfileContractState(values, ['edecanPerfil'], ['modalidades', 'viaja']);
    values.subcategoriaId = 'edecan';
    values.edecanPerfil = buildEdecanPerfil(values);
    return values;
  }

  function finalizeModelosValues(values, ctx) {
    if (!values || !isModelosSubcategoria(ctx || {})) return values;
    clearProfileContractState(values, ['modelosPerfil'], ['modalidades', 'viaja']);
    values.subcategoriaId = 'modelos';
    values.modelosPerfil = buildModelosPerfil(values);
    return values;
  }

  function mapProfesionalCommonFields(u, bloques, labelMap) {
    if (bloques.idiomas) u.idiomas = bloques.idiomas;
    if (bloques.estatura) u.estatura = bloques.estatura;
    if (bloques.peso) u.peso = bloques.peso;
    if (bloques.complexion) u.complexion = bloques.complexion;
    if (bloques.cabello) u.cabello = bloques.cabello;
    if (bloques.ojos) u.ojos = bloques.ojos;
    if (bloques.tatuajes) u.tatuajes = bloques.tatuajes;
    if (bloques.piercings) u.piercings = bloques.piercings;
    if (bloques.sobreMi) u.sobreMi = bloques.sobreMi;
    if (Array.isArray(bloques.metodosPago) && bloques.metodosPago.length) {
      u.metodosPago = bloques.metodosPago.slice();
    }
    if (bloques.horarioDetalle) {
      u.horario = bloques.horarioDetalle;
      u.horarioDetalle = bloques.horarioDetalle;
    }
    if (Array.isArray(bloques.modalidades) && bloques.modalidades.length) {
      u.modalidades = bloques.modalidades.slice();
      u.modalidadFicha = bloques.modalidades.map(function (m) {
        return modalidadProfLabel(m, labelMap);
      }).join(' · ');
    }
    if (bloques.viajesDesplazamiento) {
      u.viajesDesplazamiento = bloques.viajesDesplazamiento;
    } else if (viajesApi()) {
      u.viajesDesplazamiento = viajesApi().buildViajesDesplazamiento(bloques, bloques.modalidades);
    }
    return u;
  }

  function mapEdecanToPerfil(u, bloques, ctx) {
    u = u || {};
    ctx = ctx || {};
    var perfil = bloques.edecanPerfil || buildEdecanPerfil(bloques);
    u.subcategoriaId = 'edecan';
    u.edecanPerfil = Object.assign({}, perfil);
    if (isTruthyFieldValue(bloques.eventosDisponibles)) u.eventosDisponibles = true;
    if (perfil.experienciaProfesional) u.experienciaProfesional = perfil.experienciaProfesional;
    if (Array.isArray(perfil.tiposEvento) && perfil.tiposEvento.length) {
      u.tiposEvento = perfil.tiposEvento.slice();
    }
    if (Array.isArray(perfil.serviciosProfesionales) && perfil.serviciosProfesionales.length) {
      u.serviciosIncluidos = perfil.serviciosProfesionales.slice();
    }
    if (Array.isArray(perfil.restriccionesProfesionales) && perfil.restriccionesProfesionales.length) {
      u.noRealiza = perfil.restriccionesProfesionales.slice();
    }
    u = mapProfesionalCommonFields(u, bloques, MODALIDAD_EDECAN_LABELS);
    return applyBadges(u, ctx);
  }

  function mapModelosToPerfil(u, bloques, ctx) {
    u = u || {};
    ctx = ctx || {};
    var perfil = bloques.modelosPerfil || buildModelosPerfil(bloques);
    u.subcategoriaId = 'modelos';
    u.modelosPerfil = Object.assign({}, perfil);
    if (bloques.portfolioURL) u.portfolioURL = normalizeUrl(bloques.portfolioURL);
    if (perfil.experienciaProfesional) u.experienciaProfesional = perfil.experienciaProfesional;
    if (Array.isArray(perfil.tiposModelaje) && perfil.tiposModelaje.length) {
      u.tiposModelaje = perfil.tiposModelaje.slice();
    }
    if (Array.isArray(perfil.serviciosProfesionales) && perfil.serviciosProfesionales.length) {
      u.serviciosIncluidos = perfil.serviciosProfesionales.slice();
    }
    if (Array.isArray(perfil.restriccionesProfesionales) && perfil.restriccionesProfesionales.length) {
      u.noRealiza = perfil.restriccionesProfesionales.slice();
    }
    u = mapProfesionalCommonFields(u, bloques, MODALIDAD_MODELOS_LABELS);
    return applyBadges(u, ctx);
  }

  function validateProfesionalDeltaValues(cfg, values, missing) {
    var tipos = values.tiposEvento || values.tiposModelaje;
    if (!Array.isArray(tipos) || !tipos.length) {
      pushMissing(missing, labelForField(cfg, values.tiposEvento != null ? 'tiposEvento' : 'tiposModelaje') || 'Tipos');
    }
    if (!String(values.experienciaProfesional || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'experienciaProfesional') || 'Experiencia profesional');
    }
    var svc = values.serviciosProfesionales;
    if (!Array.isArray(svc) || !svc.length) {
      pushMissing(missing, labelForField(cfg, 'serviciosProfesionales') || 'Servicios profesionales');
    }
    var restr = values.restriccionesProfesionales;
    if (!Array.isArray(restr) || !restr.length) {
      pushMissing(missing, labelForField(cfg, 'restriccionesProfesionales') || 'Restricciones profesionales');
    }
    var mods = values.modalidades;
    if (!Array.isArray(mods) || !mods.length) {
      pushMissing(missing, labelForField(cfg, 'modalidades') || 'Modalidades');
    }
  }

  function normalizeParejaSubId(raw) {
    var subId = normalizeSubId(raw);
    if (subId === 'parejas swinger' || subId === 'swinger') return 'swinger';
    if (subId === 'cuckold hotwife' || subId === 'cuckold_hotwife') return 'cuckold hotwife';
    return '';
  }

  function normalizeLifestyleSubId(raw) {
    var subId = normalizeSubId(raw);
    if (subId === 'unicorn' || subId === 'unicorns') return 'unicorns';
    return '';
  }

  function normalizeDominatrixSubId(raw) {
    var subId = normalizeSubId(raw);
    if (subId === 'dominatrix' || subId === 'fetiche' || subId === 'sado') return subId;
    return '';
  }

  function normalizeSubId(id) {
    return String(id || '').trim().toLowerCase().replace(/_/g, ' ');
  }

  function cfgIncludesSubcategoria(cfg, raw, normalizer) {
    if (!cfg || !Array.isArray(cfg.subcategoriaIds)) return false;
    var fn = typeof normalizer === 'function' ? normalizer : normalizeSubId;
    var canon = fn(raw);
    if (!canon) return false;
    for (var i = 0; i < cfg.subcategoriaIds.length; i++) {
      if (fn(cfg.subcategoriaIds[i]) === canon) return true;
    }
    return false;
  }

  function getSubcategoriaOverride(cfg, ctx) {
    if (!cfg || !cfg.subcategoriaOverrides) return null;
    var raw = (ctx && ctx.subcategoriaId) || (ctx && ctx.subcategoria) || '';
    var subId = normalizeSubId(raw);
    if (cfg.id === 'persona_espectaculo') {
      var canonEsp = normalizeEspectaculoSubId(raw);
      if (canonEsp && cfg.subcategoriaOverrides[canonEsp]) return cfg.subcategoriaOverrides[canonEsp];
    }
    if (cfg.id === 'negocio_venue') {
      var canonVen = normalizeVenueSubId(raw);
      if (canonVen && cfg.subcategoriaOverrides[canonVen]) return cfg.subcategoriaOverrides[canonVen];
    }
    return cfg.subcategoriaOverrides[subId] || null;
  }

  function mergedConfig(cfg, ctx) {
    var over = getSubcategoriaOverride(cfg, ctx);
    var rawSub = (ctx && ctx.subcategoriaId) || (ctx && ctx.subcategoria) || '';
    var subId = normalizeSubId(rawSub);
    if (cfg && cfg.id === 'persona_espectaculo') {
      var canonEspSub = normalizeEspectaculoSubId(rawSub);
      if (canonEspSub) subId = canonEspSub;
    }
    if (cfg && cfg.id === 'negocio_venue') {
      var canonVenSub = normalizeVenueSubId(rawSub);
      if (canonVenSub) subId = canonVenSub;
    }
    function subcategoriaTokenMatches(token) {
      if (cfg && cfg.id === 'negocio_venue') {
        return normalizeVenueSubId(token) === subId;
      }
      return normalizeSubId(token) === subId;
    }
    function fieldVisible(field) {
      if (field.excludeSubcategorias && field.excludeSubcategorias.length) {
        if (field.excludeSubcategorias.some(subcategoriaTokenMatches)) return false;
      }
      if (field.showWhenViaja && !subcategoriaViajesActiva(ctx)) return false;
      if (!field.onlySubcategorias || !field.onlySubcategorias.length) return true;
      return field.onlySubcategorias.some(subcategoriaTokenMatches);
    }
    function blockVisible(block) {
      if (block.excludeSubcategorias && block.excludeSubcategorias.length) {
        if (block.excludeSubcategorias.some(subcategoriaTokenMatches)) return false;
      }
      if (!block.onlySubcategorias || !block.onlySubcategorias.length) return true;
      return block.onlySubcategorias.some(subcategoriaTokenMatches);
    }
    var baseBlocks = cfg.blocks.filter(blockVisible).map(function (block) {
      return {
        id: block.id,
        title: block.title,
        hint: block.hint,
        fields: block.fields.filter(fieldVisible).map(function (field) {
          var patch = over && over.fieldPatches ? over.fieldPatches[field.id] : null;
          var hint = over && over.fieldHints ? over.fieldHints[field.id] : null;
          var f = Object.assign({}, field);
          if (patch) Object.assign(f, patch);
          if (hint) f.hint = hint;
          return f;
        })
      };
    }).filter(function (block) {
      return block.fields.length > 0;
    });
    if (!over) {
      return {
        id: cfg.id,
        formularioId: cfg.formularioId,
        uiIds: cfg.uiIds,
        subcategoriaIds: cfg.subcategoriaIds,
        subcategoriaOverrides: cfg.subcategoriaOverrides,
        obligatorios: (cfg.obligatorios || []).slice(),
        blocks: baseBlocks,
        validaciones: []
      };
    }
    var out = {
      id: cfg.id,
      formularioId: cfg.formularioId,
      uiIds: cfg.uiIds,
      subcategoriaIds: cfg.subcategoriaIds,
      subcategoriaOverrides: cfg.subcategoriaOverrides,
      obligatorios: (cfg.obligatorios || []).slice(),
      blocks: baseBlocks,
      fotosMin: over.fotosMin || null,
      validaciones: (over.validaciones || []).slice()
    };
    (over.obligatoriosExtra || []).forEach(function (key) {
      if (out.obligatorios.indexOf(key) < 0) out.obligatorios.push(key);
    });
    (over.obligatoriosRemove || []).forEach(function (key) {
      var idx = out.obligatorios.indexOf(key);
      if (idx >= 0) out.obligatorios.splice(idx, 1);
    });
    return out;
  }

  function getFotosMin(ctx) {
    var cfg = resolveConfig(ctx || {}, null);
    if (!cfg) return null;
    var merged = mergedConfig(cfg, ctx || {});
    return merged.fotosMin || cfg.fotosMin || null;
  }

  function applyBadges(u, ctx) {
    ctx = ctx || { subcategoriaId: u && u.subcategoriaId };
    if (matchesLifestyle(ctx, null)) {
      var subLife = normalizeSubId(ctx.subcategoriaId || (u && u.subcategoriaId) || '');
      if (subLife === 'unicorns') u.badgeUnicorn = true;
      return u;
    }
    var cfg = resolveEscortConfig();
    if (!cfg || !matchesEscort(ctx, null)) return u;
    var over = getSubcategoriaOverride(cfg, ctx || { subcategoriaId: u && u.subcategoriaId });
    if (!over || !over.badges) return u;
    if (over.badges.indexOf('lgbt') >= 0) u.badgeLgbt = true;
    if (over.badges.indexOf('vip') >= 0) u.badgeVip = true;
    if (over.badges.indexOf('trans') >= 0) u.badgeTrans = true;
    return u;
  }

  var NIVEL_SERVICIO_AYUDA = {
    'Básico': 'Trato estándar: servicios esenciales de tu listado base.',
    'Completo': 'Experiencia amplia: incluye la mayoría de servicios que marques.',
    'Premium': 'Experiencia VIP: máxima atención, detalle y extras acordados.'
  };

  var DISPONIBILIDAD_LABELS = {
    disponible: 'Disponible',
    ocupada: 'Ocupada',
    con_cita: 'Con cita previa'
  };

  function categoriaTamañoDesdeCm(val) {
    var s = String(val || '').trim().replace(',', '.');
    var m = s.match(/(\d+(?:\.\d+)?)/);
    if (!m) return '';
    var n = parseFloat(m[1]);
    if (!isFinite(n) || n <= 0) return '';
    if (n < 16) return 'Promedio';
    if (n < 20) return 'Por encima del promedio';
    return 'Dotado';
  }

  function mapDotadosFields(u, bloques) {
    if (bloques.longitudCm) {
      u.longitudCm = String(bloques.longitudCm).trim();
      u.categoriaTamaño = categoriaTamañoDesdeCm(bloques.longitudCm);
    }
    var dotadosKeys = [
      'mostrarLongitudPublico',
      'atencionHombres', 'mostrarAtencionHombresPublico',
      'atencionMujeres', 'mostrarAtencionMujeresPublico',
      'atencionParejas', 'mostrarAtencionParejasPublico',
      'atencionTrans', 'mostrarAtencionTransPublico',
      'mostrarRealizaTriosPublico', 'mostrarColaboracionContenidoPublico'
    ];
    dotadosKeys.forEach(function (key) {
      if (bloques[key]) u[key] = bloques[key];
    });
    return u;
  }

  function matchesEscort(ctx, resolved) {
    var cfg = resolveEscortConfig();
    if (!cfg) return false;
    ctx = ctx || {};
    if (cfgIncludesSubcategoria(cfg, ctx.subcategoriaId || ctx.subcategoria || '', normalizeEscortSubId)) return true;
    if (ctx.arquetipo === cfg.id) return true;
    var ident = resolved && resolved.identidad ? resolved.identidad : {};
    if (ident.formularioId === cfg.formularioId && ident.arquetipo === cfg.id) return true;
    if (resolved && cfg.uiIds.indexOf(resolved.formularioUiId || '') >= 0) return true;
    return false;
  }

  function matchesPareja(ctx, resolved) {
    var cfg = resolveParejaConfig();
    if (!cfg) return false;
    ctx = ctx || {};
    if (cfgIncludesSubcategoria(cfg, ctx.subcategoriaId || ctx.subcategoria || '', normalizeParejaSubId)) return true;
    if (ctx.arquetipo === cfg.id) return true;
    var ident = resolved && resolved.identidad ? resolved.identidad : {};
    if (ident.formularioId === cfg.formularioId && ident.arquetipo === cfg.id) return true;
    if (ident.arquetipo === cfg.id) return true;
    if (resolved && cfg.uiIds.indexOf(resolved.formularioUiId || '') >= 0) return true;
    return false;
  }

  function matchesLifestyle(ctx, resolved) {
    var cfg = resolveLifestyleConfig();
    if (!cfg) return false;
    ctx = ctx || {};
    if (cfgIncludesSubcategoria(cfg, ctx.subcategoriaId || ctx.subcategoria || '', normalizeLifestyleSubId)) return true;
    if (ctx.arquetipo === cfg.id) return true;
    var ident = resolved && resolved.identidad ? resolved.identidad : {};
    if (ident.formularioId === cfg.formularioId && ident.arquetipo === cfg.id) return true;
    if (resolved && cfg.uiIds.indexOf(resolved.formularioUiId || '') >= 0) return true;
    return false;
  }

  function matchesDominatrix(ctx, resolved) {
    var cfg = resolveDominatrixConfig();
    if (!cfg) return false;
    ctx = ctx || {};
    if (cfgIncludesSubcategoria(cfg, ctx.subcategoriaId || ctx.subcategoria || '', normalizeDominatrixSubId)) return true;
    if (ctx.arquetipo === cfg.id) return true;
    var ident = resolved && resolved.identidad ? resolved.identidad : {};
    if (ident.formularioId === cfg.formularioId && ident.arquetipo === cfg.id) return true;
    if (resolved && cfg.uiIds.indexOf(resolved.formularioUiId || '') >= 0) return true;
    return false;
  }

  function matchesEspectaculo(ctx, resolved) {
    var cfg = resolveEspectaculoConfig();
    if (!cfg) return false;
    ctx = ctx || {};
    var canon = normalizeEspectaculoSubId((ctx && ctx.subcategoriaId) || (ctx && ctx.subcategoria) || '');
    if (canon && cfg.subcategoriaIds.indexOf(canon) >= 0) return true;
    if (ctx.arquetipo === cfg.id) return true;
    var ident = resolved && resolved.identidad ? resolved.identidad : {};
    if (ident.formularioId === cfg.formularioId && ident.arquetipo === cfg.id) return true;
    if (resolved && cfg.uiIds.indexOf(resolved.formularioUiId || '') >= 0) return true;
    return false;
  }

  function matchesCreador(ctx, resolved) {
    var cfg = resolveCreadorConfig();
    if (!cfg) return false;
    ctx = ctx || {};
    var canon = normalizeCreadorSubId((ctx && ctx.subcategoriaId) || (ctx && ctx.subcategoria) || '');
    if (canon === 'contenido') return true;
    if (ctx.arquetipo === cfg.id) return true;
    var ident = resolved && resolved.identidad ? resolved.identidad : {};
    if (ident.formularioId === cfg.formularioId && ident.arquetipo === cfg.id) return true;
    if (resolved && cfg.uiIds.indexOf(resolved.formularioUiId || '') >= 0) return true;
    return false;
  }

  function matchesRetail(ctx, resolved) {
    var cfg = resolveRetailConfig();
    if (!cfg) return false;
    ctx = ctx || {};
    var canon = normalizeRetailSubId((ctx && ctx.subcategoriaId) || (ctx && ctx.subcategoria) || '');
    if (canon === 'sex_shop') return true;
    if (ctx.arquetipo === cfg.id) return true;
    var ident = resolved && resolved.identidad ? resolved.identidad : {};
    if (ident.formularioId === cfg.formularioId && ident.arquetipo === cfg.id) return true;
    if (resolved && cfg.uiIds.indexOf(resolved.formularioUiId || '') >= 0) return true;
    return false;
  }

  function matchesVenue(ctx, resolved) {
    var cfg = resolveVenueConfig();
    if (!cfg) return false;
    ctx = ctx || {};
    var raw = String((ctx.subcategoriaId) || (ctx.subcategoria) || '').trim().toLowerCase();
    if (cfg.subcategoriaIds.indexOf(raw) >= 0) return true;
    var canon = normalizeVenueSubId((ctx.subcategoriaId) || (ctx.subcategoria) || '');
    if (canon === 'antro' || canon === 'antro_lgbt' || canon === 'club_sw' || canon === 'cabinas' || canon === 'cine_xxx') return true;
    return false;
  }

  function matchesBienestar(ctx, resolved) {
    var cfg = resolveBienestarConfig();
    if (!cfg) return false;
    ctx = ctx || {};
    if (String(ctx.tipoPerfil || '').trim().toLowerCase() === 'persona') return false;
    var raw = String((ctx.subcategoriaId) || (ctx.subcategoria) || '').trim().toLowerCase();
    if (cfg.subcategoriaIds.indexOf(raw) >= 0) return true;
    var canon = normalizeBienestarSubId((ctx.subcategoriaId) || (ctx.subcategoria) || '');
    if (canon === 'spa' || canon === 'masajes') return true;
    if (ctx.arquetipo === cfg.id) return true;
    var ident = resolved && resolved.identidad ? resolved.identidad : {};
    if (ident.formularioId === cfg.formularioId && ident.arquetipo === cfg.id) return true;
    if (resolved && cfg.uiIds.indexOf(resolved.formularioUiId || '') >= 0) return true;
    return false;
  }

  function matchesHospedaje(ctx, resolved) {
    var cfg = resolveHospedajeConfig();
    if (!cfg) return false;
    ctx = ctx || {};
    if (String(ctx.tipoPerfil || '').trim().toLowerCase() === 'persona') return false;
    var raw = String((ctx.subcategoriaId) || (ctx.subcategoria) || '').trim().toLowerCase();
    if (cfg.subcategoriaIds.indexOf(raw) >= 0) return true;
    var canon = normalizeHospedajeSubId((ctx.subcategoriaId) || (ctx.subcategoria) || '');
    if (canon === 'hotel_motel') return true;
    if (ctx.arquetipo === cfg.id) return true;
    var ident = resolved && resolved.identidad ? resolved.identidad : {};
    if (ident.formularioId === cfg.formularioId && ident.arquetipo === cfg.id) return true;
    if (resolved && cfg.uiIds.indexOf(resolved.formularioUiId || '') >= 0) return true;
    return false;
  }

  function resolveConfig(ctx, resolved) {
    if (matchesDominatrix(ctx, resolved)) return resolveDominatrixConfig();
    if (matchesEspectaculo(ctx, resolved)) return resolveEspectaculoConfig();
    if (matchesCreador(ctx, resolved)) return resolveCreadorConfig();
    if (matchesRetail(ctx, resolved)) return resolveRetailConfig();
    if (matchesVenue(ctx, resolved)) return resolveVenueConfig();
    if (matchesBienestar(ctx, resolved)) return resolveBienestarConfig();
    if (matchesHospedaje(ctx, resolved)) return resolveHospedajeConfig();
    if (matchesEscort(ctx, resolved)) return resolveEscortConfig();
    if (matchesLifestyle(ctx, resolved)) return resolveLifestyleConfig();
    if (matchesPareja(ctx, resolved)) return resolveParejaConfig();
    return null;
  }

  function fieldDomId(fieldId) {
    return 'rpPub_' + fieldId;
  }

  function viajesApi() {
    return global.CariHubViajesDesplazamiento || null;
  }

  function subIdFromCtx(ctx) {
    return normalizeSubId((ctx && ctx.subcategoriaId) || (ctx && ctx.subcategoria) || '');
  }

  function subcategoriaViajesActiva(ctx) {
    var api = viajesApi();
    return api ? api.subcategoriaActivaViajes(subIdFromCtx(ctx)) : false;
  }

  function filterChecklistOptions(field, ctx) {
    var active = subcategoriaViajesActiva(ctx);
    return (field.options || []).filter(function (opt) {
      if (typeof opt === 'object' && opt.onlySubcategoriasViajes) return active;
      return true;
    });
  }

  function modalidadesIncluyeViaja(values) {
    var mods = values && values.modalidades;
    return Array.isArray(mods) && mods.indexOf('viaja') >= 0;
  }

  function isViajesSubfield(field) {
    return !!(field && field.showWhenViaja);
  }

  function fieldMatchesShowWhen(field, values) {
    if (!field || !field.showWhen) return true;
    values = values || {};
    var depVal = values[field.showWhen.field];
    var allowed = field.showWhen.values || [];
    var current = String(depVal || '').trim();
    return allowed.indexOf(current) >= 0;
  }

  function isConditionalSubfield(field) {
    return isViajesSubfield(field) || !!(field && field.showWhen);
  }

  function isFieldHiddenByCondition(field, values) {
    if (isViajesSubfield(field)) return !modalidadesIncluyeViaja(values);
    if (field.showWhen) return !fieldMatchesShowWhen(field, values);
    return false;
  }

  function fieldValueWithDefault(field, values) {
    values = values || {};
    var val = values[field.id];
    if ((val == null || String(val).trim() === '') && field.defaultValue) {
      return field.defaultValue;
    }
    return val != null ? val : '';
  }

  function renderChecklist(field, values, ctx) {
    values = values || {};
    var selected = values[field.id];
    if (!Array.isArray(selected)) selected = [];
    var selMap = {};
    selected.forEach(function (v) { selMap[String(v)] = true; });
    var opts = filterChecklistOptions(field, ctx);
    var html = '<div class="rp-pub-checklist" data-rp-pub-field="' + esc(field.id) + '">';
    opts.forEach(function (opt) {
      var val = typeof opt === 'string' ? opt : opt.value;
      var label = typeof opt === 'string' ? opt : opt.label;
      var id = fieldDomId(field.id) + '_' + String(val).replace(/[^a-z0-9]+/gi, '_');
      html += '<label class="rp-pub-check"><input type="checkbox" id="' + esc(id) + '" value="' + esc(val) + '"' +
        (selMap[val] ? ' checked' : '') + '> ' + esc(label) + '</label>';
    });
    html += '</div>';
    return html;
  }

  function isTruthyFieldValue(val) {
    if (val === true || val === 1) return true;
    if (val === false || val === 0 || val == null) return false;
    var s = String(val).trim().toLowerCase();
    return s === 'true' || s === '1' || s === 'si' || s === 'sí';
  }

  function isValidUrl(val) {
    var s = String(val || '').trim();
    if (!s) return false;
    try {
      var u = new URL(/^https?:\/\//i.test(s) ? s : 'https://' + s);
      return !!u.hostname && u.hostname.indexOf('.') >= 0;
    } catch (e) {
      return false;
    }
  }

  function normalizeUrl(val) {
    var s = String(val || '').trim();
    if (!s) return '';
    return /^https?:\/\//i.test(s) ? s : 'https://' + s;
  }

  function parseEstaturaMetros(val) {
    var s = String(val || '').trim().toLowerCase().replace(',', '.');
    if (!s) return null;
    var m = s.match(/(\d+(?:\.\d+)?)/);
    if (!m) return null;
    var n = parseFloat(m[1]);
    if (!isFinite(n) || n <= 0) return null;
    if (n > 3) n = n / 100;
    return n;
  }

  function pushMissing(missing, label) {
    if (!label || missing.indexOf(label) >= 0) return;
    missing.push(label);
  }

  var CONFIGURACION_GRUPO_LABELS = {
    pareja_hm: 'Hombre + Mujer',
    pareja_mm: 'Mujer + Mujer',
    pareja_hh: 'Hombre + Hombre',
    grupo: 'Grupo (3 o más integrantes)',
    otra: 'Otra configuración'
  };

  function configuracionGrupoLabel(value) {
    return CONFIGURACION_GRUPO_LABELS[String(value || '').trim()] || String(value || '').trim();
  }

  function normalizeMemberRow(row, index) {
    row = row || {};
    var edadRaw = row.edad != null ? String(row.edad).trim() : '';
    var edadNum = edadRaw ? parseInt(edadRaw, 10) : null;
    return {
      id: row.id || ('m' + (index + 1)),
      etiquetaPublica: String(row.etiquetaPublica || '').trim(),
      generoPresentacion: String(row.generoPresentacion || '').trim(),
      edad: isFinite(edadNum) ? edadNum : null,
      franjaEdad: String(row.franjaEdad || '').trim(),
      orden: index + 1
    };
  }

  function buildMiembrosResumen(miembros) {
    if (!Array.isArray(miembros) || !miembros.length) return '';
    return miembros.map(function (m) {
      var parts = [];
      if (m.etiquetaPublica) parts.push(m.etiquetaPublica);
      if (m.edad != null && isFinite(m.edad)) parts.push(m.edad + ' años');
      else if (m.franjaEdad) parts.push(m.franjaEdad);
      return parts.join(' ').trim();
    }).filter(Boolean).join(' · ');
  }

  function memberRowHasAge(member) {
    if (!member) return false;
    if (member.edad != null && isFinite(member.edad) && member.edad >= 18) return true;
    return !!String(member.franjaEdad || '').trim();
  }

  function renderMemberField(mf, member, rowIndex) {
    var val = member[mf.id] != null ? member[mf.id] : '';
    var req = mf.required ? ' <span class="rp-req">*</span>' : '';
    var fid = fieldDomId('miembros_' + rowIndex + '_' + mf.id);
    if (mf.type === 'select') {
      var html = '<label for="' + fid + '">' + esc(mf.label) + req + '</label><select id="' + fid + '" data-member-field="' + esc(mf.id) + '">';
      html += '<option value="">Selecciona…</option>';
      (mf.options || []).forEach(function (opt) {
        var oval = typeof opt === 'string' ? opt : opt.value;
        var olabel = typeof opt === 'string' ? opt : opt.label;
        html += '<option value="' + esc(oval) + '"' + (String(val) === String(oval) ? ' selected' : '') + '>' + esc(olabel) + '</option>';
      });
      html += '</select>';
      return html;
    }
    if (mf.type === 'number') {
      return '<label for="' + fid + '">' + esc(mf.label) + req + '</label>' +
        '<input type="number" id="' + fid + '" data-member-field="' + esc(mf.id) + '" value="' +
        esc(val != null ? val : '') + '" min="' + esc(mf.min != null ? mf.min : 18) + '"' +
        (mf.max != null ? ' max="' + esc(mf.max) + '"' : '') +
        ' placeholder="' + esc(mf.placeholder || '') + '">';
    }
    return '<label for="' + fid + '">' + esc(mf.label) + req + '</label>' +
      '<input type="text" id="' + fid + '" data-member-field="' + esc(mf.id) + '" value="' +
      esc(val != null ? val : '') + '" placeholder="' + esc(mf.placeholder || '') + '">';
  }

  function renderMemberList(field, values) {
    values = values || {};
    var members = Array.isArray(values[field.id]) ? values[field.id] : [];
    var minRows = field.minMembers || 2;
    while (members.length < minRows) members.push({});
    var html = '<div class="rp-pub-member-list" data-rp-pub-field="' + esc(field.id) + '" data-rp-member-min="' + minRows + '"' +
      (field.minMembersGrupo ? ' data-rp-member-min-grupo="' + field.minMembersGrupo + '"' : '') + '>';
    html += '<span class="rp-pub-field-label">' + esc(field.label) + (field.required ? ' <span class="rp-req">*</span>' : '') + '</span>';
    members.forEach(function (member, idx) {
      html += '<div class="rp-pub-member-row" data-member-index="' + idx + '">';
      html += '<div class="rp-pub-member-row__head"><strong>Integrante ' + (idx + 1) + '</strong>';
      if (idx >= minRows) {
        html += '<button type="button" class="rp-pub-member-remove" data-rp-member-remove="1">Quitar</button>';
      }
      html += '</div><div class="rp-pub-member-row__grid">';
      (field.memberFields || []).forEach(function (mf) {
        html += '<div class="rp-field rp-pub-member-field">' + renderMemberField(mf, member, idx) + '</div>';
      });
      html += '</div></div>';
    });
    html += '<button type="button" class="rp-btn rp-btn--ghost rp-pub-member-add" data-rp-member-add="1">+ Agregar integrante</button>';
    html += '</div>';
    return html;
  }

  function readMemberList(fieldId) {
    var host = document.querySelector('[data-rp-pub-field="' + fieldId + '"]');
    if (!host) return [];
    var rows = host.querySelectorAll('.rp-pub-member-row');
    var out = [];
    rows.forEach(function (row, index) {
      var member = { id: 'm' + (index + 1) };
      row.querySelectorAll('[data-member-field]').forEach(function (el) {
        var key = el.getAttribute('data-member-field');
        if (!key) return;
        if (el.type === 'number') {
          var n = parseInt(String(el.value || '').trim(), 10);
          member[key] = isFinite(n) ? n : null;
        } else {
          member[key] = String(el.value || '').trim();
        }
      });
      out.push(normalizeMemberRow(member, index));
    });
    return out;
  }

  function bindMemberListControls(host) {
    if (!host) return;
    host.querySelectorAll('[data-rp-member-add]').forEach(function (btn) {
      if (btn.dataset.rpMemberBound === '1') return;
      btn.dataset.rpMemberBound = '1';
      btn.addEventListener('click', function () {
        var list = btn.closest('[data-rp-pub-field="miembros"]');
        if (!list) return;
        var cfg = resolveParejaConfig();
        var fieldDef = null;
        if (cfg) {
          cfg.blocks.forEach(function (block) {
            block.fields.forEach(function (f) {
              if (f.id === 'miembros') fieldDef = f;
            });
          });
        }
        var idx = list.querySelectorAll('.rp-pub-member-row').length;
        var row = document.createElement('div');
        row.className = 'rp-pub-member-row';
        row.setAttribute('data-member-index', String(idx));
        var minRows = parseInt(list.getAttribute('data-rp-member-min') || '2', 10);
        var head = '<div class="rp-pub-member-row__head"><strong>Integrante ' + (idx + 1) + '</strong>';
        if (idx >= minRows) head += '<button type="button" class="rp-pub-member-remove" data-rp-member-remove="1">Quitar</button>';
        head += '</div><div class="rp-pub-member-row__grid">';
        var grid = '';
        (fieldDef && fieldDef.memberFields ? fieldDef.memberFields : []).forEach(function (mf) {
          grid += '<div class="rp-field rp-pub-member-field">' + renderMemberField(mf, {}, idx) + '</div>';
        });
        row.innerHTML = head + grid + '</div>';
        list.insertBefore(row, btn);
        bindMemberListControls(list);
      });
    });
    host.querySelectorAll('[data-rp-member-remove]').forEach(function (btn) {
      if (btn.dataset.rpMemberBound === '1') return;
      btn.dataset.rpMemberBound = '1';
      btn.addEventListener('click', function () {
        var row = btn.closest('.rp-pub-member-row');
        if (row) row.remove();
      });
    });
  }

  function renderField(field, values, ctx) {
    values = values || {};
    var val = fieldValueWithDefault(field, values);
    var req = field.required ? ' <span class="rp-req">*</span>' : '';
    var conditionalSub = isConditionalSubfield(field);
    var hidden = isFieldHiddenByCondition(field, values);
    var wrap = '<div class="rp-field rp-pub-field' +
      (conditionalSub ? ' rp-conditional-subfield' : '') +
      (hidden ? ' rp-hidden' : '') +
      '" data-rp-pub-field-wrap="' + esc(field.id) + '"' +
      (isViajesSubfield(field) ? ' data-rp-viajes-sub="1"' : '') +
      (field.showWhen ? ' data-rp-show-when-field="' + esc(field.showWhen.field) + '"' : '') +
      (hidden ? ' aria-hidden="true"' : '') + '>';
    if (field.type === 'checklist') {
      wrap += '<span class="rp-pub-field-label">' + esc(field.label) + req + '</span>' + renderChecklist(field, values, ctx);
    } else if (field.type === 'memberList') {
      wrap += renderMemberList(field, values);
    } else if (field.type === 'select') {
      var selectCls = field.id === 'nivelServicio' ? ' rp-nivel-servicio-select' : '';
      wrap += '<label for="' + fieldDomId(field.id) + '">' + esc(field.label) + req + '</label><select id="' + fieldDomId(field.id) + '" class="' + selectCls + '">';
      wrap += '<option value="">Selecciona…</option>';
      (field.options || []).forEach(function (opt) {
        var oval = typeof opt === 'string' ? opt : opt.value;
        var olabel = typeof opt === 'string' ? opt : opt.label;
        wrap += '<option value="' + esc(oval) + '"' + (String(val) === String(oval) ? ' selected' : '') + '>' + esc(olabel) + '</option>';
      });
      wrap += '</select>';
      if (field.id === 'nivelServicio') {
        wrap += '<p class="rp-nivel-servicio-help" id="rpPub_nivelServicio_help" role="note">' +
          'Elige un nivel para ver qué significa para quien visita tu perfil.</p>';
      }
      if (field.hint) {
        wrap += '<p class="rp-contact-hint rp-pub-field-hint">' + esc(field.hint) + '</p>';
      }
    } else if (field.type === 'textarea') {
      wrap += '<label for="' + fieldDomId(field.id) + '">' + esc(field.label) + req + '</label>' +
        '<textarea id="' + fieldDomId(field.id) + '" rows="' + (field.rows || 3) + '" placeholder="' + esc(field.placeholder || '') + '">' + esc(val) + '</textarea>';
    } else if (field.type === 'boolean') {
      var checked = isTruthyFieldValue(val);
      wrap += '<label class="rp-pub-check rp-pub-bool" for="' + fieldDomId(field.id) + '">' +
        '<input type="checkbox" id="' + fieldDomId(field.id) + '"' + (checked ? ' checked' : '') + '> ' +
        esc(field.label) + req + '</label>';
      if (field.hint) {
        wrap += '<p class="rp-contact-hint rp-pub-field-hint">' + esc(field.hint) + '</p>';
      }
    } else if (field.type === 'url') {
      wrap += '<label for="' + fieldDomId(field.id) + '">' + esc(field.label) + req + '</label>' +
        '<input type="url" id="' + fieldDomId(field.id) + '" value="' + esc(val) + '" placeholder="' + esc(field.placeholder || 'https://') + '" inputmode="url" autocomplete="url">';
      if (field.hint) {
        wrap += '<p class="rp-contact-hint rp-pub-field-hint">' + esc(field.hint) + '</p>';
      }
    } else {
      wrap += '<label for="' + fieldDomId(field.id) + '">' + esc(field.label) + req + '</label>' +
        '<input type="text" id="' + fieldDomId(field.id) + '" value="' + esc(val) + '" placeholder="' + esc(field.placeholder || '') + '">';
    }
    if (field.hint && field.type !== 'select' && field.type !== 'checklist' && field.type !== 'boolean' && field.type !== 'url') {
      wrap += '<p class="rp-contact-hint rp-pub-field-hint">' + esc(field.hint) + '</p>';
    }
    wrap += '</div>';
    return wrap;
  }

  function renderBlocks(host, cfg, values, ctx) {
    if (!host || !cfg) {
      if (host) host.innerHTML = '';
      return;
    }
    var html = '';
    cfg.blocks.forEach(function (block) {
      if (!block.fields.length) return;
      html += '<div class="rp-card rp-pub-block" data-rp-pub-block="' + esc(block.id) + '">';
      html += '<h2 class="rp-card__title">' + esc(block.title) + '</h2>';
      if (block.hint) html += '<p class="rp-contact-hint">' + esc(block.hint) + '</p>';
      var subformOpen = false;
      block.fields.forEach(function (field) {
        if (field.showWhenViaja && !subformOpen && subcategoriaViajesActiva(ctx)) {
          html += '<div class="rp-viajes-subform" data-rp-viajes-subform="1">';
          subformOpen = true;
        }
        html += renderField(field, values, ctx);
      });
      if (subformOpen) html += '</div>';
      html += '</div>';
    });
    host.innerHTML = html;
    host.classList.remove('rp-hidden');
    host.removeAttribute('aria-hidden');
    bindNivelServicioHelp();
    bindViajaToggle();
    bindConditionalFieldToggles();
    bindMemberListControls(host);
    syncConditionalSubfieldsVisibility();
  }

  function readSelectValue(fieldId) {
    var el = $(fieldDomId(fieldId));
    return el ? String(el.value || '').trim() : '';
  }

  function collectCurrentConditionalValues() {
    return {
      modalidades: readChecklist('modalidades'),
      haceColaboraciones: readSelectValue('haceColaboraciones')
    };
  }

  function clearColaboraConValues() {
    document.querySelectorAll('[data-rp-pub-field="colaboraCon"] input[type="checkbox"]').forEach(function (cb) {
      cb.checked = false;
    });
  }

  function syncConditionalSubfieldsVisibility() {
    syncViajesSubformVisibility();
    var hace = readSelectValue('haceColaboraciones');
    var showColabora = hace === 'Sí' || hace === 'A convenir';
    document.querySelectorAll('[data-rp-show-when-field="haceColaboraciones"]').forEach(function (el) {
      el.classList.toggle('rp-hidden', !showColabora);
      if (showColabora) el.removeAttribute('aria-hidden');
      else el.setAttribute('aria-hidden', 'true');
    });
    if (!showColabora) clearColaboraConValues();
  }

  function bindConditionalFieldToggles() {
    var sel = $(fieldDomId('haceColaboraciones'));
    if (sel && sel.dataset.rpColabBound !== '1') {
      sel.dataset.rpColabBound = '1';
      sel.addEventListener('change', syncConditionalSubfieldsVisibility);
    }
  }

  function clearViajesSubfieldValues() {
    var api = viajesApi();
    var ids = api ? api.viajesFieldIds() : [
      'alcanceDesplazamiento', 'viajesProgramados', 'gastosTraslado', 'anticipacionViaje', 'notasViaje'
    ];
    ids.forEach(function (id) {
      var el = $(fieldDomId(id));
      if (el) el.value = '';
    });
  }

  function syncViajesSubformVisibility() {
    var viaja = modalidadesIncluyeViaja({ modalidades: readChecklist('modalidades') });
    document.querySelectorAll('[data-rp-viajes-subform="1"]').forEach(function (el) {
      el.classList.toggle('rp-hidden', !viaja);
      if (viaja) el.removeAttribute('aria-hidden');
      else el.setAttribute('aria-hidden', 'true');
    });
    document.querySelectorAll('[data-rp-viajes-sub="1"]').forEach(function (el) {
      el.classList.toggle('rp-hidden', !viaja);
      if (viaja) el.removeAttribute('aria-hidden');
      else el.setAttribute('aria-hidden', 'true');
    });
    if (!viaja) clearViajesSubfieldValues();
  }

  function bindViajaToggle() {
    var list = document.querySelector('[data-rp-pub-field="modalidades"]');
    if (!list || list.dataset.rpViajaBound === '1') return;
    list.dataset.rpViajaBound = '1';
    list.addEventListener('change', function (ev) {
      if (!ev.target || ev.target.type !== 'checkbox') return;
      syncViajesSubformVisibility();
    });
  }

  function bindNivelServicioHelp() {
    var sel = $(fieldDomId('nivelServicio'));
    var help = $('rpPub_nivelServicio_help');
    if (!sel || !help) return;
    function sync() {
      var v = sel.value;
      help.textContent = NIVEL_SERVICIO_AYUDA[v] || 'Elige un nivel para ver qué significa para quien visita tu perfil.';
      help.classList.toggle('rp-nivel-servicio-help--premium', v === 'Premium');
      sel.classList.toggle('rp-nivel-servicio-select--premium', v === 'Premium');
    }
    if (sel.dataset.rpNivelHelpBound !== '1') {
      sel.dataset.rpNivelHelpBound = '1';
      sel.addEventListener('change', sync);
    }
    sync();
  }

  function syncLegacyFields(cfg, active) {
    var wrapMod = $('wrapModalidad');
    var wrapHor = $('wrapHorario');
    var wrapSvc = $('wrapServicios');
    if (wrapMod) wrapMod.classList.toggle('rp-hidden', !!active);
    if (wrapHor) wrapHor.classList.toggle('rp-hidden', !!active);
    if (wrapSvc) wrapSvc.classList.toggle('rp-hidden', !!active);
    if (active && wrapHor && $('fldHorarioDetalle')) {
      /* horario legacy hidden; dynamic field used */
    }
  }

  function readChecklist(fieldId) {
    var out = [];
    document.querySelectorAll('[data-rp-pub-field="' + fieldId + '"] input[type="checkbox"]').forEach(function (cb) {
      if (cb.checked) out.push(cb.value);
    });
    return out;
  }

  function finalizeLesbiansValues(values) {
    if (!values) return values;
    if (!String(values.mostrarAtiendoA || '').trim()) values.mostrarAtiendoA = 'Sí';
    if (!String(values.mostrarColaboraciones || '').trim()) values.mostrarColaboraciones = 'Sí';
    var hace = String(values.haceColaboraciones || '').trim();
    if (hace === 'No') delete values.colaboraCon;
    return values;
  }

  function finalizeParejaGrupoValues(values) {
    if (!values || (!values.configuracionGrupo && !Array.isArray(values.miembros))) return values;
    var aliasEl = $('fldAlias');
    var alias = aliasEl ? String(aliasEl.value || '').trim() : String(values.aliasPareja || values.alias || '').trim();
    if (alias) {
      values.aliasPareja = alias;
      values.alias = alias;
    }
    if (values.configuracionGrupo) {
      values.configuracionGrupoLabel = configuracionGrupoLabel(values.configuracionGrupo);
      values.tipoPareja = values.configuracionGrupoLabel;
    }
    if (Array.isArray(values.miembros)) {
      values.miembros = values.miembros.map(function (m, i) {
        return normalizeMemberRow(m, i);
      }).filter(function (m) {
        return m.etiquetaPublica || m.generoPresentacion || m.edad || m.franjaEdad;
      });
      values.miembrosResumen = buildMiembrosResumen(values.miembros);
      values.miembrosEdad = values.miembrosResumen;
    }
    values.parejaGrupoPerfil = {
      aliasPareja: values.aliasPareja || alias || '',
      configuracionGrupo: values.configuracionGrupo || '',
      configuracionGrupoLabel: values.configuracionGrupoLabel || configuracionGrupoLabel(values.configuracionGrupo),
      miembros: values.miembros || [],
      reglasAcceso: values.reglasAcceso || '',
      sobreMi: values.sobreMi || '',
      horarioDetalle: values.horarioDetalle || '',
      modalidades: values.modalidades || [],
      viajesDesplazamiento: values.viajesDesplazamiento || null,
      metodosPago: values.metodosPago || []
    };
    values.tipoPerfil = 'pareja_grupo';
    return values;
  }

  function buildObjetivoPrincipal(objetivos) {
    if (!Array.isArray(objetivos) || !objetivos.length) return '';
    if (objetivos.indexOf('Todo lo anterior') >= 0) return 'Todo lo anterior';
    return String(objetivos[0] || '').trim();
  }

  function isSwingerSubcategoria(ctx) {
    return normalizeParejaSubId((ctx && ctx.subcategoriaId) || (ctx && ctx.subcategoria) || '') === 'swinger';
  }

  function isUnicornSubcategoria(ctx) {
    return normalizeLifestyleSubId((ctx && ctx.subcategoriaId) || (ctx && ctx.subcategoria) || '') === 'unicorns';
  }

  function isCuckoldHotwifeSubcategoria(ctx) {
    return normalizeParejaSubId((ctx && ctx.subcategoriaId) || (ctx && ctx.subcategoria) || '') === 'cuckold hotwife';
  }

  function isDominatrixSubcategoria(ctx) {
    return !!normalizeDominatrixSubId((ctx && ctx.subcategoriaId) || (ctx && ctx.subcategoria) || '');
  }

  function isEspectaculoSubcategoria(ctx) {
    return !!normalizeEspectaculoSubId((ctx && ctx.subcategoriaId) || (ctx && ctx.subcategoria) || '');
  }

  function isCreadorSubcategoria(ctx) {
    ctx = ctx || {};
    if (ctx.arquetipo === 'persona_creador') return true;
    return normalizeCreadorSubId((ctx.subcategoriaId) || (ctx.subcategoria) || '') === 'contenido';
  }

  function isRetailSubcategoria(ctx) {
    ctx = ctx || {};
    if (ctx.arquetipo === 'negocio_retail') return true;
    return normalizeRetailSubId((ctx.subcategoriaId) || (ctx.subcategoria) || '') === 'sex_shop';
  }

  function isVenueSubcategoria(ctx) {
    ctx = ctx || {};
    if (String(ctx.tipoPerfil || '').trim().toLowerCase() === 'persona') return false;
    if (String(ctx.tipoPerfil || '').trim().toLowerCase() === 'pareja_grupo') return false;
    if (ctx.arquetipo === 'negocio_venue') return true;
    var raw = String(ctx.subcategoriaId || ctx.subcategoria || '').trim().toLowerCase();
    if (raw === 'antro' || raw === 'antro_lgbt' || raw === 'club_sw' || raw === 'cabinas' || raw === 'cine_xxx') return true;
    var canon = normalizeVenueSubId((ctx.subcategoriaId) || (ctx.subcategoria) || '');
    return canon === 'antro' || canon === 'antro_lgbt' || canon === 'club_sw' || canon === 'cabinas' || canon === 'cine_xxx';
  }

  function isBienestarSubcategoria(ctx) {
    ctx = ctx || {};
    if (String(ctx.tipoPerfil || '').trim().toLowerCase() === 'persona') return false;
    if (ctx.arquetipo === 'negocio_bienestar') return true;
    var raw = String(ctx.subcategoriaId || ctx.subcategoria || '').trim().toLowerCase();
    if (raw === 'spa' || raw === 'masajes') return true;
    var canon = normalizeBienestarSubId((ctx.subcategoriaId) || (ctx.subcategoria) || '');
    return canon === 'spa' || canon === 'masajes';
  }

  function isHospedajeSubcategoria(ctx) {
    ctx = ctx || {};
    if (String(ctx.tipoPerfil || '').trim().toLowerCase() === 'persona') return false;
    if (ctx.arquetipo === 'negocio_hospedaje') return true;
    var raw = String(ctx.subcategoriaId || ctx.subcategoria || '').trim().toLowerCase();
    if (raw === 'hotel_motel') return true;
    var canon = normalizeHospedajeSubId((ctx.subcategoriaId) || (ctx.subcategoria) || '');
    return canon === 'hotel_motel';
  }

  var PROFILE_NESTED_KEYS = [
    'dominatrixPerfil',
    'espectaculoPerfil',
    'creadorPerfil',
    'retailPerfil',
    'venuePerfil',
    'bienestarPerfil',
    'hospedajePerfil',
    'swingerPerfil',
    'unicornPerfil',
    'cuckoldHotwifePerfil',
    'parejaGrupoPerfil'
  ];

  var PROFILE_INCOMPATIBLE_KEYS = ['modalidades', 'edad', 'viaja'];

  function clearProfileContractState(target, keepNested, keepFields) {
    if (!target) return target;
    var keepNestedMap = {};
    var keepFieldsMap = {};
    (keepNested || []).forEach(function (k) { keepNestedMap[k] = true; });
    (keepFields || []).forEach(function (k) { keepFieldsMap[k] = true; });
    PROFILE_NESTED_KEYS.forEach(function (key) {
      if (!keepNestedMap[key]) delete target[key];
    });
    PROFILE_INCOMPATIBLE_KEYS.forEach(function (key) {
      if (!keepFieldsMap[key]) delete target[key];
    });
    return target;
  }

  var MODALIDADES_SHOW_LABELS = {
    fiestas: 'Fiestas privadas',
    despedidas: 'Despedidas',
    hoteles: 'Hoteles / suites',
    clubes: 'Clubes / antros',
    eventos_vip: 'Eventos VIP',
    eventos_privados: 'Eventos privados'
  };

  function buildTipoShowMirror(list) {
    if (!Array.isArray(list) || !list.length) return '';
    return list.join(' · ');
  }

  function buildDisponibleParaMirror(mods) {
    if (!Array.isArray(mods) || !mods.length) return [];
    return mods.map(function (m) {
      return MODALIDADES_SHOW_LABELS[m] || m;
    });
  }

  function buildEspectaculoPerfil(values) {
    values = values || {};
    return {
      tipoShow: Array.isArray(values.tipoShow) ? values.tipoShow.slice() : [],
      precioShow: values.precioShow || '',
      horarioMinimo: values.horarioMinimo || '',
      anosExperiencia: values.anosExperiencia || '',
      vestuarioShow: Array.isArray(values.vestuarioShow) ? values.vestuarioShow.slice() : [],
      eventosDisponibles: values.eventosDisponibles || '',
      venueFijo: values.venueFijo || '',
      requisitosLugar: values.requisitosLugar || '',
      modalidades: Array.isArray(values.modalidades) ? values.modalidades.slice() : [],
      viajesDesplazamiento: values.viajesDesplazamiento || null,
      serviciosIncluidos: Array.isArray(values.serviciosIncluidos) ? values.serviciosIncluidos.slice() : [],
      serviciosNoRealizo: Array.isArray(values.serviciosNoRealizo) ? values.serviciosNoRealizo.slice() : [],
      horarioDetalle: values.horarioDetalle || '',
      metodosPago: Array.isArray(values.metodosPago) ? values.metodosPago.slice() : [],
      sobreMi: values.sobreMi || '',
      disponibilidad: values.disponibilidad || ''
    };
  }

  function finalizeEspectaculoValues(values, ctx) {
    if (!values || !isEspectaculoSubcategoria(ctx || {})) return values;
    var esp = buildEspectaculoPerfil(values);
    clearProfileContractState(values, ['espectaculoPerfil'], ['modalidades']);
    values.espectaculoPerfil = esp;
    return values;
  }

  function mapEspectaculoToPerfil(u, bloques, ctx) {
    u = u || {};
    ctx = ctx || {};
    var canon = normalizeEspectaculoSubId((ctx && ctx.subcategoriaId) || u.subcategoriaId || '');
    var esp = bloques.espectaculoPerfil || buildEspectaculoPerfil(bloques);
    clearProfileContractState(u, ['espectaculoPerfil'], ['modalidades']);
    u.espectaculoPerfil = Object.assign({}, esp);
    u.arquetipo = 'persona_espectaculo';
    u.tipoPerfil = 'espectaculo';
    u.subcategoriaId = canon || u.subcategoriaId;
    if (Array.isArray(esp.tipoShow) && esp.tipoShow.length) {
      u.tipoShow = buildTipoShowMirror(esp.tipoShow);
      u.tipoServicio = u.tipoShow;
    }
    if (esp.precioShow) {
      u.precioShow = esp.precioShow;
      u.precio = esp.precioShow;
      u.precioDesde = esp.precioShow;
    }
    if (esp.horarioMinimo) {
      u.horarioMinimo = esp.horarioMinimo;
      u.tiempoMinimo = esp.horarioMinimo;
    }
    if (esp.anosExperiencia) u.anosExperiencia = esp.anosExperiencia;
    if (Array.isArray(esp.vestuarioShow) && esp.vestuarioShow.length) {
      u.vestuarioShow = esp.vestuarioShow.slice();
    }
    if (esp.eventosDisponibles) u.eventosDisponibles = esp.eventosDisponibles;
    if (esp.venueFijo) {
      u.venueFijo = esp.venueFijo;
      u.ubicacionFicha = esp.venueFijo;
    }
    if (esp.requisitosLugar) u.requisitosLugar = esp.requisitosLugar;
    if (Array.isArray(esp.modalidades) && esp.modalidades.length) {
      u.modalidades = esp.modalidades.slice();
      u.disponiblePara = buildDisponibleParaMirror(esp.modalidades);
      if (esp.modalidades.indexOf('viaja') >= 0) {
        u.disponiblePara.push('Viaja a eventos');
      }
    }
    if (esp.viajesDesplazamiento) u.viajesDesplazamiento = esp.viajesDesplazamiento;
    else if (viajesApi()) {
      u.viajesDesplazamiento = viajesApi().buildViajesDesplazamiento(esp, esp.modalidades);
    }
    if (Array.isArray(esp.serviciosIncluidos) && esp.serviciosIncluidos.length) {
      u.serviciosIncluidos = esp.serviciosIncluidos.slice();
    }
    if (Array.isArray(esp.serviciosNoRealizo) && esp.serviciosNoRealizo.length) {
      u.noRealiza = esp.serviciosNoRealizo.slice();
    }
    if (Array.isArray(esp.metodosPago) && esp.metodosPago.length) {
      u.metodosPago = esp.metodosPago.slice();
    }
    if (esp.horarioDetalle) {
      u.horarioDetalle = esp.horarioDetalle;
      u.horario = esp.horarioDetalle;
    }
    if (esp.sobreMi) {
      u.sobreMi = esp.sobreMi;
      u.sobreNosotros = esp.sobreMi;
    }
    if (esp.disponibilidad) {
      u.disponibilidad = DISPONIBILIDAD_LABELS[esp.disponibilidad] || esp.disponibilidad;
    }
    return u;
  }

  function validateEspectaculoDeltaValues(cfg, values, missing, ctx) {
    ctx = ctx || {};
    var canon = normalizeEspectaculoSubId((ctx && ctx.subcategoriaId) || values.subcategoriaId || '');
    var tipoShow = values.tipoShow;
    if (!Array.isArray(tipoShow) || !tipoShow.length) {
      pushMissing(missing, labelForField(cfg, 'tipoShow') || 'Tipo de show');
    }
    if (!String(values.precioShow || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'precioShow') || 'Precio show / desde');
    }
    if (!String(values.horarioMinimo || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'horarioMinimo') || 'Duración mínima del show');
    }
    var mods = values.modalidades;
    if (!Array.isArray(mods) || !mods.length) {
      pushMissing(missing, labelForField(cfg, 'modalidades') || 'Disponible para');
    }
    if (canon === 'stripper') {
      if (!String(values.anosExperiencia || '').trim()) {
        pushMissing(missing, labelForField(cfg, 'anosExperiencia') || 'Experiencia');
      }
    }
    if (canon === 'tabledance' && !String(values.venueFijo || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'venueFijo') || 'Venue / zona de trabajo');
    }
    var svc = values.serviciosIncluidos;
    if (!Array.isArray(svc) || !svc.length) {
      pushMissing(missing, labelForField(cfg, 'serviciosIncluidos') || 'Servicios incluidos en el show');
    }
    var noSvc = values.serviciosNoRealizo;
    if (!Array.isArray(noSvc) || !noSvc.length) {
      pushMissing(missing, labelForField(cfg, 'serviciosNoRealizo') || 'No incluido / reglas');
    }
  }

  function buildTiposContenidoMirror(list) {
    if (!Array.isArray(list) || !list.length) return '';
    return list.join(' · ');
  }

  function buildCreadorPerfil(values) {
    values = values || {};
    return {
      tiposContenido: Array.isArray(values.tiposContenido) ? values.tiposContenido.slice() : [],
      plataformas: Array.isArray(values.plataformas) ? values.plataformas.slice() : [],
      precioSuscripcion: values.precioSuscripcion || '',
      contenidoPersonalizado: values.contenidoPersonalizado || '',
      paquetesContenido: Array.isArray(values.paquetesContenido) ? values.paquetesContenido.slice() : [],
      colaboracionesCreador: values.colaboracionesCreador || '',
      redesSociales: values.redesSociales || '',
      mostrarPlataformasPublico: values.mostrarPlataformasPublico || '',
      serviciosIncluidos: Array.isArray(values.serviciosIncluidos) ? values.serviciosIncluidos.slice() : [],
      serviciosNoRealizo: Array.isArray(values.serviciosNoRealizo) ? values.serviciosNoRealizo.slice() : [],
      horarioDetalle: values.horarioDetalle || '',
      metodosPago: Array.isArray(values.metodosPago) ? values.metodosPago.slice() : [],
      sobreMi: values.sobreMi || '',
      idiomas: values.idiomas || '',
      disponibilidad: values.disponibilidad || ''
    };
  }

  function finalizeCreadorValues(values, ctx) {
    if (!values || !isCreadorSubcategoria(ctx || {})) return values;
    var cre = buildCreadorPerfil(values);
    clearProfileContractState(values, ['creadorPerfil']);
    values.creadorPerfil = cre;
    return values;
  }

  function mapCreadorToPerfil(u, bloques, ctx) {
    u = u || {};
    ctx = ctx || {};
    var canon = normalizeCreadorSubId((ctx && ctx.subcategoriaId) || u.subcategoriaId || '') || 'contenido';
    var cre = bloques.creadorPerfil || buildCreadorPerfil(bloques);
    clearProfileContractState(u, ['creadorPerfil']);
    u.creadorPerfil = Object.assign({}, cre);
    u.arquetipo = 'persona_creador';
    u.tipoPerfil = 'creador';
    u.subcategoriaId = canon;
    if (Array.isArray(cre.tiposContenido) && cre.tiposContenido.length) {
      u.tiposContenido = cre.tiposContenido.slice();
      u.tipoServicio = buildTiposContenidoMirror(cre.tiposContenido);
    }
    if (Array.isArray(cre.plataformas) && cre.plataformas.length) {
      u.plataformas = cre.plataformas.slice();
    }
    if (cre.precioSuscripcion) {
      u.precioSuscripcion = cre.precioSuscripcion;
      u.precio = cre.precioSuscripcion;
      u.precioDesde = cre.precioSuscripcion;
    }
    if (cre.contenidoPersonalizado) u.contenidoPersonalizado = cre.contenidoPersonalizado;
    if (Array.isArray(cre.paquetesContenido) && cre.paquetesContenido.length) {
      u.paquetesContenido = cre.paquetesContenido.slice();
    }
    if (cre.colaboracionesCreador) u.colaboracionesCreador = cre.colaboracionesCreador;
    if (cre.redesSociales) u.redesSociales = cre.redesSociales;
    if (Array.isArray(cre.serviciosIncluidos) && cre.serviciosIncluidos.length) {
      u.serviciosIncluidos = cre.serviciosIncluidos.slice();
    }
    if (Array.isArray(cre.serviciosNoRealizo) && cre.serviciosNoRealizo.length) {
      u.noRealiza = cre.serviciosNoRealizo.slice();
      u.politicaPerfil = cre.serviciosNoRealizo.slice(0, 3).join(' · ');
    }
    if (Array.isArray(cre.metodosPago) && cre.metodosPago.length) {
      u.metodosPago = cre.metodosPago.slice();
    }
    if (cre.horarioDetalle) {
      u.horarioDetalle = cre.horarioDetalle;
      u.horario = cre.horarioDetalle;
      u.tiempoMinimo = cre.horarioDetalle;
    }
    if (cre.sobreMi) u.sobreMi = cre.sobreMi;
    if (cre.idiomas) u.idiomas = cre.idiomas;
    if (cre.disponibilidad) {
      u.disponibilidad = DISPONIBILIDAD_LABELS[cre.disponibilidad] || cre.disponibilidad;
    }
    return u;
  }

  function validateCreadorDeltaValues(cfg, values, missing) {
    var tipos = values.tiposContenido;
    if (!Array.isArray(tipos) || !tipos.length) {
      pushMissing(missing, labelForField(cfg, 'tiposContenido') || 'Tipos de contenido');
    }
    var plats = values.plataformas;
    if (!Array.isArray(plats) || !plats.length) {
      pushMissing(missing, labelForField(cfg, 'plataformas') || 'Plataformas');
    }
    if (!String(values.precioSuscripcion || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'precioSuscripcion') || 'Precio suscripción / desde');
    }
    if (!String(values.redesSociales || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'redesSociales') || 'Enlaces públicos');
    }
    var svc = values.serviciosIncluidos;
    if (!Array.isArray(svc) || !svc.length) {
      pushMissing(missing, labelForField(cfg, 'serviciosIncluidos') || 'Qué incluye tu suscripción / contenido');
    }
    var noSvc = values.serviciosNoRealizo;
    if (!Array.isArray(noSvc) || !noSvc.length) {
      pushMissing(missing, labelForField(cfg, 'serviciosNoRealizo') || 'No incluido / reglas');
    }
    if (!String(values.horarioDetalle || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'horarioDetalle') || 'Frecuencia / actualizaciones');
    }
    var pagos = values.metodosPago;
    if (!Array.isArray(pagos) || !pagos.length) {
      pushMissing(missing, labelForField(cfg, 'metodosPago') || 'Métodos de pago');
    }
  }

  function retailFlagFromSelect(val) {
    var s = String(val || '').trim().toLowerCase();
    return s === 'sí' || s === 'si' || s === 'yes' || val === true;
  }

  function buildCategoriasProductoMirror(list) {
    if (!Array.isArray(list) || !list.length) return '';
    return list.join(', ');
  }

  function buildRetailPerfil(values) {
    values = values || {};
    return {
      nombreComercial: values.nombreComercial || '',
      categoriasProducto: Array.isArray(values.categoriasProducto) ? values.categoriasProducto.slice() : [],
      precioDesde: values.precioDesde || '',
      envioDomicilio: retailFlagFromSelect(values.envioDomicilio),
      tiendaOnline: retailFlagFromSelect(values.tiendaOnline),
      direccion: values.direccion || '',
      zonaPublica: values.zonaPublica || '',
      serviciosIncluidos: Array.isArray(values.serviciosIncluidos) ? values.serviciosIncluidos.slice() : [],
      serviciosNoRealizo: Array.isArray(values.serviciosNoRealizo) ? values.serviciosNoRealizo.slice() : [],
      horarioDetalle: values.horarioDetalle || '',
      metodosPago: Array.isArray(values.metodosPago) ? values.metodosPago.slice() : [],
      sobreMi: values.sobreMi || '',
      disponibilidad: values.disponibilidad || '',
      rfc: values.rfc || '',
      razonSocial: values.razonSocial || '',
      licenciaOperacion: values.licenciaOperacion || ''
    };
  }

  function finalizeRetailValues(values, ctx) {
    if (!values || !isRetailSubcategoria(ctx || {})) return values;
    var ret = buildRetailPerfil(values);
    clearProfileContractState(values, ['retailPerfil']);
    values.retailPerfil = ret;
    return values;
  }

  function mapRetailToPerfil(u, bloques, ctx) {
    u = u || {};
    ctx = ctx || {};
    var canon = normalizeRetailSubId((ctx && ctx.subcategoriaId) || u.subcategoriaId || '') || 'sex_shop';
    var ret = bloques.retailPerfil || buildRetailPerfil(bloques);
    clearProfileContractState(u, ['retailPerfil']);
    u.retailPerfil = Object.assign({}, ret);
    u.arquetipo = 'negocio_retail';
    u.tipoPerfil = 'negocio';
    u.subcategoriaId = canon;
    if (ret.nombreComercial) {
      u.nombreComercial = ret.nombreComercial;
      u.nombre = ret.nombreComercial;
      u.alias = ret.nombreComercial;
    }
    if (Array.isArray(ret.categoriasProducto) && ret.categoriasProducto.length) {
      u.categoriasProducto = buildCategoriasProductoMirror(ret.categoriasProducto);
      u.tipoServicio = 'Tienda · ' + ret.categoriasProducto.slice(0, 2).join(' · ');
    }
    if (ret.precioDesde) {
      u.precioDesde = ret.precioDesde;
      u.precio = ret.precioDesde;
    }
    u.envioDomicilio = ret.envioDomicilio === true;
    u.tiendaOnline = ret.tiendaOnline === true;
    if (ret.direccion) {
      u.direccion = ret.direccion;
      u.ubicacionFicha = ret.zonaPublica || ret.direccion;
    } else if (ret.zonaPublica) {
      u.ubicacionFicha = ret.zonaPublica;
    }
    if (Array.isArray(ret.serviciosIncluidos) && ret.serviciosIncluidos.length) {
      u.serviciosIncluidos = ret.serviciosIncluidos.slice();
    }
    if (Array.isArray(ret.serviciosNoRealizo) && ret.serviciosNoRealizo.length) {
      u.noRealiza = ret.serviciosNoRealizo.slice();
    }
    if (Array.isArray(ret.metodosPago) && ret.metodosPago.length) {
      u.metodosPago = ret.metodosPago.slice();
    }
    if (ret.horarioDetalle) {
      u.horarioDetalle = ret.horarioDetalle;
      u.horario = ret.horarioDetalle;
    }
    if (ret.sobreMi) {
      u.sobreMi = ret.sobreMi;
      u.sobreNosotros = ret.sobreMi;
      u.perfilNosotros = ret.sobreMi;
    }
    if (ret.disponibilidad) {
      u.disponibilidad = DISPONIBILIDAD_LABELS[ret.disponibilidad] || ret.disponibilidad;
    }
    u.disponiblePara = 'Venta al público';
    return u;
  }

  function validateRetailDeltaValues(cfg, values, missing) {
    if (!String(values.nombreComercial || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'nombreComercial') || 'Nombre comercial');
    }
    var cats = values.categoriasProducto;
    if (!Array.isArray(cats) || !cats.length) {
      pushMissing(missing, labelForField(cfg, 'categoriasProducto') || 'Categorías de productos');
    }
    if (!String(values.direccion || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'direccion') || 'Dirección o zona pública');
    }
    if (!String(values.precioDesde || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'precioDesde') || 'Precio / compra mínima desde');
    }
    if (!String(values.horarioDetalle || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'horarioDetalle') || 'Horario');
    }
    var svc = values.serviciosIncluidos;
    if (!Array.isArray(svc) || !svc.length) {
      pushMissing(missing, labelForField(cfg, 'serviciosIncluidos') || 'Qué ofrece la tienda');
    }
    var noSvc = values.serviciosNoRealizo;
    if (!Array.isArray(noSvc) || !noSvc.length) {
      pushMissing(missing, labelForField(cfg, 'serviciosNoRealizo') || 'Políticas / no incluye');
    }
    var pagos = values.metodosPago;
    if (!Array.isArray(pagos) || !pagos.length) {
      pushMissing(missing, labelForField(cfg, 'metodosPago') || 'Métodos de pago');
    }
    if (!String(values.rfc || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'rfc') || 'RFC');
    }
    if (!String(values.razonSocial || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'razonSocial') || 'Razón social');
    }
  }

  function venueFlagFromSelect(val) {
    var s = String(val || '').trim().toLowerCase();
    return s === 'sí' || s === 'si' || s === 'yes' || val === true;
  }

  function buildReglasAccesoMirror(list) {
    if (!Array.isArray(list) || !list.length) return '';
    return list.join(' · ');
  }

  function inferVenueSubId(values, ctx) {
    var canon = normalizeVenueSubId((ctx && ctx.subcategoriaId) || (values && values.subcategoriaId) || '');
    if (canon) return canon;
    var tipo = String((values && values.tipoVenue) || '').toLowerCase();
    if (tipo.indexOf('cabina') >= 0 || tipo.indexOf('glory') >= 0) return 'cabinas';
    if (tipo.indexOf('cine') >= 0 || tipo.indexOf('sala xxx') >= 0) return 'cine_xxx';
    if (tipo.indexOf('lgbt') >= 0) return 'antro_lgbt';
    if (tipo.indexOf('club') >= 0 || tipo.indexOf('lifestyle') >= 0 || tipo.indexOf('swinger') >= 0) return 'club_sw';
    return 'antro';
  }

  function buildVenuePerfil(values) {
    values = values || {};
    return {
      nombreComercial: values.nombreComercial || '',
      tipoVenue: values.tipoVenue || '',
      tagline: values.tagline || '',
      precioEntrada: values.precioEntrada || '',
      cartelera: values.cartelera || '',
      eventosTematicos: values.eventosTematicos || '',
      politicaParejasSingles: values.politicaParejasSingles || '',
      horariosFunciones: values.horariosFunciones || '',
      clasificacion: values.clasificacion || '',
      nivelPrivacidad: values.nivelPrivacidad || '',
      dressCode: values.dressCode || '',
      areasVenue: Array.isArray(values.areasVenue) ? values.areasVenue.slice() : [],
      reservaciones: venueFlagFromSelect(values.reservaciones),
      reglasAcceso: Array.isArray(values.reglasAcceso) ? values.reglasAcceso.slice() : [],
      direccion: values.direccion || '',
      zonaPublica: values.zonaPublica || '',
      horarioDetalle: values.horarioDetalle || '',
      metodosPago: Array.isArray(values.metodosPago) ? values.metodosPago.slice() : [],
      sobreMi: values.sobreMi || '',
      disponibilidad: values.disponibilidad || '',
      rfc: values.rfc || '',
      razonSocial: values.razonSocial || '',
      telefonoContacto: values.telefonoContacto || '',
      licenciaOperacion: values.licenciaOperacion || '',
      documentos: values.documentos || '',
      notasInternas: values.notasInternas || ''
    };
  }

  function finalizeVenueValues(values, ctx) {
    if (!values || !isVenueSubcategoria(ctx || {})) return values;
    delete values.retailPerfil;
    delete values.bienestarPerfil;
    delete values.hospedajePerfil;
    delete values.creadorPerfil;
    delete values.espectaculoPerfil;
    delete values.dominatrixPerfil;
    delete values.swingerPerfil;
    delete values.unicornPerfil;
    delete values.cuckoldHotwifePerfil;
    delete values.parejaGrupoPerfil;
    delete values.modalidades;
    delete values.edad;
    delete values.viaja;
    values.venuePerfil = buildVenuePerfil(values);
    return values;
  }

  function mapVenueToPerfil(u, bloques, ctx) {
    u = u || {};
    ctx = ctx || {};
    var canon = inferVenueSubId(bloques, ctx);
    var ven = bloques.venuePerfil || buildVenuePerfil(bloques);
    delete u.retailPerfil;
    delete u.bienestarPerfil;
    delete u.hospedajePerfil;
    delete u.creadorPerfil;
    delete u.espectaculoPerfil;
    delete u.dominatrixPerfil;
    delete u.swingerPerfil;
    delete u.unicornPerfil;
    delete u.cuckoldHotwifePerfil;
    delete u.parejaGrupoPerfil;
    delete u.modalidades;
    delete u.edad;
    delete u.viaja;
    u.venuePerfil = Object.assign({}, ven);
    u.arquetipo = 'negocio_venue';
    u.tipoPerfil = 'lugar';
    u.subcategoriaId = canon;
    if (canon === 'antro_lgbt') {
      u.badgeLgbt = true;
      delete u.badgeSwinger;
    } else if (canon === 'club_sw') {
      u.badgeSwinger = true;
      delete u.badgeLgbt;
    } else {
      delete u.badgeLgbt;
      delete u.badgeSwinger;
    }
    if (ven.nombreComercial) {
      u.nombreComercial = ven.nombreComercial;
      u.nombre = ven.nombreComercial;
      u.alias = ven.nombreComercial;
    }
    if (ven.tipoVenue) {
      u.tipoVenue = ven.tipoVenue;
      u.tipoServicio = ven.tipoVenue;
      u.tipoNegocio = ven.tipoVenue;
    }
    if (ven.tagline) {
      u.tagline = ven.tagline;
      u.descripcion = ven.tagline;
    }
    if (ven.precioEntrada) {
      u.precioEntrada = ven.precioEntrada;
      u.precio = ven.precioEntrada;
    }
    if (ven.cartelera) u.cartelera = ven.cartelera;
    if (ven.eventosTematicos) {
      u.eventosTematicos = ven.eventosTematicos;
      if (!u.cartelera) u.cartelera = ven.eventosTematicos;
    }
    if (ven.politicaParejasSingles) {
      u.politicaParejasSingles = ven.politicaParejasSingles;
      u.politicaParejas = ven.politicaParejasSingles;
      u.disponiblePara = ven.politicaParejasSingles;
    }
    if (ven.nivelPrivacidad) u.nivelPrivacidad = ven.nivelPrivacidad;
    if (ven.horariosFunciones) {
      u.horariosFunciones = ven.horariosFunciones;
      if (!u.horario && !u.horarioDetalle) u.horario = ven.horariosFunciones;
    }
    if (ven.clasificacion) u.clasificacion = ven.clasificacion;
    if (ven.dressCode) u.dressCode = ven.dressCode;
    if (Array.isArray(ven.areasVenue) && ven.areasVenue.length) {
      u.areasVenue = ven.areasVenue.slice();
      u.perfilTags = ven.areasVenue.slice();
      u.serviciosIncluidos = ven.areasVenue.slice();
    }
    if (Array.isArray(ven.reglasAcceso) && ven.reglasAcceso.length) {
      u.reglasAcceso = buildReglasAccesoMirror(ven.reglasAcceso);
      u.noRealiza = ven.reglasAcceso.slice();
    }
    u.reservaciones = ven.reservaciones === true;
    if (ven.direccion) {
      u.direccion = ven.direccion;
      u.ubicacionFicha = ven.zonaPublica || ven.direccion;
    } else if (ven.zonaPublica) {
      u.ubicacionFicha = ven.zonaPublica;
    }
    if (Array.isArray(ven.metodosPago) && ven.metodosPago.length) {
      u.metodosPago = ven.metodosPago.slice();
    }
    if (ven.horarioDetalle) {
      u.horarioDetalle = ven.horarioDetalle;
      u.horario = ven.horarioDetalle;
    }
    if (ven.sobreMi) {
      u.sobreMi = ven.sobreMi;
      u.sobreNosotros = ven.sobreMi;
      u.perfilNosotros = ven.sobreMi;
    }
    if (ven.disponibilidad) {
      u.disponibilidad = DISPONIBILIDAD_LABELS[ven.disponibilidad] || ven.disponibilidad;
    }
    return u;
  }

  function validateVenueDeltaValues(cfg, values, missing, ctx) {
    ctx = ctx || {};
    var subId = inferVenueSubId(values, ctx);
    if (!String(values.nombreComercial || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'nombreComercial') || 'Nombre comercial');
    }
    if (!String(values.tipoVenue || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'tipoVenue') || 'Tipo de venue');
    }
    if (!String(values.precioEntrada || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'precioEntrada') || 'Cover / precio de entrada');
    }
    if (subId === 'club_sw') {
      if (!String(values.eventosTematicos || '').trim()) {
        pushMissing(missing, labelForField(cfg, 'eventosTematicos') || 'Eventos temáticos');
      }
      if (!String(values.politicaParejasSingles || '').trim()) {
        pushMissing(missing, labelForField(cfg, 'politicaParejasSingles') || 'Política parejas / singles');
      }
    } else if (subId === 'cabinas') {
      if (!String(values.nivelPrivacidad || '').trim()) {
        pushMissing(missing, labelForField(cfg, 'nivelPrivacidad') || 'Nivel de privacidad');
      }
    } else if (subId === 'cine_xxx') {
      if (!String(values.cartelera || '').trim()) {
        pushMissing(missing, labelForField(cfg, 'cartelera') || 'Cartelera / funciones');
      }
      if (!String(values.horariosFunciones || '').trim()) {
        pushMissing(missing, labelForField(cfg, 'horariosFunciones') || 'Horarios de funciones');
      }
      if (!String(values.clasificacion || '').trim()) {
        pushMissing(missing, labelForField(cfg, 'clasificacion') || 'Clasificación / aviso');
      }
    } else if (subId === 'antro' || subId === 'antro_lgbt') {
      if (!String(values.cartelera || '').trim()) {
        pushMissing(missing, labelForField(cfg, 'cartelera') || 'Cartelera / eventos');
      }
    }
    if (subId === 'antro' || subId === 'antro_lgbt' || subId === 'club_sw') {
      if (!String(values.dressCode || '').trim()) {
        pushMissing(missing, labelForField(cfg, 'dressCode') || 'Dress code');
      }
    }
    var areas = values.areasVenue;
    if (!Array.isArray(areas) || !areas.length) {
      pushMissing(missing, labelForField(cfg, 'areasVenue') || 'Áreas del local');
    }
    var reglas = values.reglasAcceso;
    if (!Array.isArray(reglas) || !reglas.length) {
      pushMissing(missing, labelForField(cfg, 'reglasAcceso') || 'Reglas de acceso');
    }
    if (!String(values.direccion || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'direccion') || 'Dirección o zona pública');
    }
    if (!String(values.horarioDetalle || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'horarioDetalle') || 'Horario');
    }
    var pagos = values.metodosPago;
    if (!Array.isArray(pagos) || !pagos.length) {
      pushMissing(missing, labelForField(cfg, 'metodosPago') || 'Métodos de pago');
    }
    if (!String(values.rfc || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'rfc') || 'RFC');
    }
    if (!String(values.razonSocial || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'razonSocial') || 'Razón social');
    }
  }

  function bienestarFlagFromSelect(val) {
    var s = String(val || '').trim().toLowerCase();
    return s === 'sí' || s === 'si' || s === 'yes' || val === true;
  }

  function inferBienestarSubId(values, ctx) {
    var canon = normalizeBienestarSubId((ctx && ctx.subcategoriaId) || (values && values.subcategoriaId) || '');
    if (canon) return canon;
    var tipo = String((values && values.tipoBienestar) || '').toLowerCase();
    if (tipo.indexOf('masajes') >= 0) return 'masajes';
    return 'spa';
  }

  function buildBienestarPerfil(values) {
    values = values || {};
    return {
      nombreComercial: values.nombreComercial || '',
      tipoBienestar: values.tipoBienestar || '',
      tagline: values.tagline || '',
      menuServicios: values.menuServicios || '',
      precioDesde: values.precioDesde || '',
      amenidades: Array.isArray(values.amenidades) ? values.amenidades.slice() : [],
      reservaciones: bienestarFlagFromSelect(values.reservaciones),
      direccion: values.direccion || '',
      zonaPublica: values.zonaPublica || '',
      serviciosIncluidos: Array.isArray(values.serviciosIncluidos) ? values.serviciosIncluidos.slice() : [],
      serviciosNoRealizo: Array.isArray(values.serviciosNoRealizo) ? values.serviciosNoRealizo.slice() : [],
      horarioDetalle: values.horarioDetalle || '',
      metodosPago: Array.isArray(values.metodosPago) ? values.metodosPago.slice() : [],
      sobreMi: values.sobreMi || '',
      disponibilidad: values.disponibilidad || '',
      rfc: values.rfc || '',
      razonSocial: values.razonSocial || '',
      telefonoContacto: values.telefonoContacto || '',
      licenciaOperacion: values.licenciaOperacion || '',
      documentos: values.documentos || '',
      notasInternas: values.notasInternas || ''
    };
  }

  function finalizeBienestarValues(values, ctx) {
    if (!values || !isBienestarSubcategoria(ctx || {})) return values;
    var bien = buildBienestarPerfil(values);
    clearProfileContractState(values, ['bienestarPerfil']);
    values.bienestarPerfil = bien;
    return values;
  }

  function mapBienestarToPerfil(u, bloques, ctx) {
    u = u || {};
    ctx = ctx || {};
    var canon = inferBienestarSubId(bloques, ctx);
    var bien = bloques.bienestarPerfil || buildBienestarPerfil(bloques);
    clearProfileContractState(u, ['bienestarPerfil']);
    u.bienestarPerfil = Object.assign({}, bien);
    u.arquetipo = 'negocio_bienestar';
    u.tipoPerfil = 'negocio';
    u.subcategoriaId = canon;
    if (bien.nombreComercial) {
      u.nombreComercial = bien.nombreComercial;
      u.nombre = bien.nombreComercial;
      u.alias = bien.nombreComercial;
    }
    if (bien.tagline) {
      u.tagline = bien.tagline;
      u.frase = bien.tagline;
    }
    if (bien.menuServicios) u.menuServicios = bien.menuServicios;
    if (bien.precioDesde) {
      u.precioDesde = bien.precioDesde;
      u.precio = bien.precioDesde;
    }
    if (bien.tipoBienestar) u.tipoBienestar = bien.tipoBienestar;
    if (Array.isArray(bien.amenidades) && bien.amenidades.length) {
      u.amenidades = bien.amenidades.slice();
    }
    u.reservaciones = bien.reservaciones === true;
    if (bien.direccion) {
      u.direccion = bien.direccion;
      u.ubicacionFicha = bien.zonaPublica || bien.direccion;
    } else if (bien.zonaPublica) {
      u.ubicacionFicha = bien.zonaPublica;
    }
    if (Array.isArray(bien.serviciosIncluidos) && bien.serviciosIncluidos.length) {
      u.serviciosIncluidos = bien.serviciosIncluidos.slice();
    }
    if (Array.isArray(bien.serviciosNoRealizo) && bien.serviciosNoRealizo.length) {
      u.noRealiza = bien.serviciosNoRealizo.slice();
    }
    if (Array.isArray(bien.metodosPago) && bien.metodosPago.length) {
      u.metodosPago = bien.metodosPago.slice();
    }
    if (bien.horarioDetalle) {
      u.horarioDetalle = bien.horarioDetalle;
      u.horario = bien.horarioDetalle;
    }
    if (bien.sobreMi) {
      u.sobreMi = bien.sobreMi;
      u.sobreNosotros = bien.sobreMi;
      u.perfilNosotros = bien.sobreMi;
    }
    if (bien.disponibilidad) {
      u.disponibilidad = DISPONIBILIDAD_LABELS[bien.disponibilidad] || bien.disponibilidad;
    }
    return u;
  }

  function validateBienestarDeltaValues(cfg, values, missing, ctx) {
    ctx = ctx || {};
    var subId = inferBienestarSubId(values, ctx);
    if (!String(values.nombreComercial || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'nombreComercial') || 'Nombre comercial');
    }
    if (!String(values.tipoBienestar || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'tipoBienestar') || 'Tipo de negocio');
    }
    if (!String(values.menuServicios || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'menuServicios') || 'Menú de servicios');
    }
    if (!String(values.precioDesde || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'precioDesde') || 'Precio desde');
    }
    if (!String(values.direccion || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'direccion') || 'Dirección o zona pública');
    }
    if (!String(values.horarioDetalle || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'horarioDetalle') || 'Horario');
    }
    var pagos = values.metodosPago;
    if (!Array.isArray(pagos) || !pagos.length) {
      pushMissing(missing, labelForField(cfg, 'metodosPago') || 'Métodos de pago');
    }
    if (subId === 'spa') {
      var am = values.amenidades;
      if (!Array.isArray(am) || !am.length) {
        pushMissing(missing, labelForField(cfg, 'amenidades') || 'Amenidades');
      }
    }
    if (subId === 'masajes') {
      var svc = values.serviciosIncluidos;
      if (!Array.isArray(svc) || !svc.length) {
        pushMissing(missing, labelForField(cfg, 'serviciosIncluidos') || 'Servicios incluidos');
      }
      var noSvc = values.serviciosNoRealizo;
      if (!Array.isArray(noSvc) || !noSvc.length) {
        pushMissing(missing, labelForField(cfg, 'serviciosNoRealizo') || 'No incluye / reglas');
      }
    }
    if (!String(values.rfc || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'rfc') || 'RFC');
    }
    if (!String(values.razonSocial || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'razonSocial') || 'Razón social');
    }
  }

  function hospedajeFlagFromSelect(val) {
    var s = String(val || '').trim().toLowerCase();
    return s === 'sí' || s === 'si' || s === 'yes' || val === true;
  }

  function inferHospedajeSubId(values, ctx) {
    var canon = normalizeHospedajeSubId((ctx && ctx.subcategoriaId) || (values && values.subcategoriaId) || '');
    if (canon) return canon;
    return 'hotel_motel';
  }

  function buildTiposHabitacionMirror(list) {
    if (!Array.isArray(list) || !list.length) return '';
    return list.join(' · ');
  }

  function buildHospedajePerfil(values) {
    values = values || {};
    return {
      nombreComercial: values.nombreComercial || '',
      tipoHospedaje: values.tipoHospedaje || '',
      tagline: values.tagline || '',
      tiposHabitacion: Array.isArray(values.tiposHabitacion) ? values.tiposHabitacion.slice() : [],
      tarifaHora: values.tarifaHora || '',
      tarifaNoche: values.tarifaNoche || '',
      reservaciones: hospedajeFlagFromSelect(values.reservaciones),
      direccion: values.direccion || '',
      zonaPublica: values.zonaPublica || '',
      mostrarDireccionExacta: hospedajeFlagFromSelect(values.mostrarDireccionExacta),
      amenidades: Array.isArray(values.amenidades) ? values.amenidades.slice() : [],
      estacionamiento: values.estacionamiento || '',
      privacidadDiscrecion: Array.isArray(values.privacidadDiscrecion) ? values.privacidadDiscrecion.slice() : [],
      reglasEstancia: Array.isArray(values.reglasEstancia) ? values.reglasEstancia.slice() : [],
      horarioDetalle: values.horarioDetalle || '',
      metodosPago: Array.isArray(values.metodosPago) ? values.metodosPago.slice() : [],
      sobreMi: values.sobreMi || '',
      disponibilidad: values.disponibilidad || '',
      rfc: values.rfc || '',
      razonSocial: values.razonSocial || '',
      telefonoContacto: values.telefonoContacto || '',
      licenciaOperacion: values.licenciaOperacion || '',
      documentos: values.documentos || '',
      notasInternas: values.notasInternas || ''
    };
  }

  function finalizeHospedajeValues(values, ctx) {
    if (!values || !isHospedajeSubcategoria(ctx || {})) return values;
    var hosp = buildHospedajePerfil(values);
    clearProfileContractState(values, ['hospedajePerfil']);
    values.hospedajePerfil = hosp;
    return values;
  }

  function mapHospedajeToPerfil(u, bloques, ctx) {
    u = u || {};
    ctx = ctx || {};
    var canon = inferHospedajeSubId(bloques, ctx);
    var hosp = bloques.hospedajePerfil || buildHospedajePerfil(bloques);
    clearProfileContractState(u, ['hospedajePerfil']);
    u.hospedajePerfil = Object.assign({}, hosp);
    u.arquetipo = 'negocio_hospedaje';
    u.tipoPerfil = 'lugar';
    u.subcategoriaId = canon;
    if (hosp.nombreComercial) {
      u.nombreComercial = hosp.nombreComercial;
      u.nombre = hosp.nombreComercial;
      u.alias = hosp.nombreComercial;
    }
    if (hosp.tagline) {
      u.tagline = hosp.tagline;
      u.frase = hosp.tagline;
      u.descripcion = hosp.tagline;
    }
    if (hosp.tipoHospedaje) u.tipoHospedaje = hosp.tipoHospedaje;
    if (Array.isArray(hosp.tiposHabitacion) && hosp.tiposHabitacion.length) {
      u.tiposHabitacion = hosp.tiposHabitacion.slice();
      u.perfilTags = hosp.tiposHabitacion.slice();
    }
    if (hosp.tarifaHora) {
      u.tarifaHora = hosp.tarifaHora;
      u.precio = hosp.tarifaHora;
    }
    if (hosp.tarifaNoche) u.tarifaNoche = hosp.tarifaNoche;
    u.reservaciones = hosp.reservaciones === true;
    if (hosp.direccion) {
      u.direccion = hosp.direccion;
      u.ubicacionFicha = hosp.zonaPublica || hosp.direccion;
    } else if (hosp.zonaPublica) {
      u.ubicacionFicha = hosp.zonaPublica;
    }
    u.mostrarDireccionExacta = hosp.mostrarDireccionExacta === true;
    if (Array.isArray(hosp.amenidades) && hosp.amenidades.length) {
      u.amenidades = hosp.amenidades.slice();
    }
    if (hosp.estacionamiento) u.estacionamiento = hosp.estacionamiento;
    if (Array.isArray(hosp.privacidadDiscrecion) && hosp.privacidadDiscrecion.length) {
      u.privacidadDiscrecion = hosp.privacidadDiscrecion.slice();
    }
    if (Array.isArray(hosp.reglasEstancia) && hosp.reglasEstancia.length) {
      u.reglasEstancia = hosp.reglasEstancia.slice();
      u.noRealiza = hosp.reglasEstancia.slice();
    }
    if (Array.isArray(hosp.metodosPago) && hosp.metodosPago.length) {
      u.metodosPago = hosp.metodosPago.slice();
    }
    if (hosp.horarioDetalle) {
      u.horarioDetalle = hosp.horarioDetalle;
      u.horario = hosp.horarioDetalle;
    }
    if (hosp.sobreMi) {
      u.sobreMi = hosp.sobreMi;
      u.sobreNosotros = hosp.sobreMi;
      u.perfilNosotros = hosp.sobreMi;
    }
    if (hosp.disponibilidad) {
      u.disponibilidad = DISPONIBILIDAD_LABELS[hosp.disponibilidad] || hosp.disponibilidad;
    }
    return u;
  }

  function validateHospedajeDeltaValues(cfg, values, missing, ctx) {
    ctx = ctx || {};
    if (!String(values.nombreComercial || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'nombreComercial') || 'Nombre comercial');
    }
    if (!String(values.tipoHospedaje || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'tipoHospedaje') || 'Tipo de hospedaje');
    }
    var habitaciones = values.tiposHabitacion;
    if (!Array.isArray(habitaciones) || !habitaciones.length) {
      pushMissing(missing, labelForField(cfg, 'tiposHabitacion') || 'Tipos de habitación');
    }
    if (!String(values.tarifaHora || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'tarifaHora') || 'Tarifa por hora');
    }
    if (!String(values.direccion || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'direccion') || 'Dirección o zona pública');
    }
    if (!String(values.horarioDetalle || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'horarioDetalle') || 'Horario');
    }
    var reglas = values.reglasEstancia;
    if (!Array.isArray(reglas) || !reglas.length) {
      pushMissing(missing, labelForField(cfg, 'reglasEstancia') || 'Reglas de estancia');
    }
    var pagos = values.metodosPago;
    if (!Array.isArray(pagos) || !pagos.length) {
      pushMissing(missing, labelForField(cfg, 'metodosPago') || 'Métodos de pago');
    }
    if (!String(values.rfc || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'rfc') || 'RFC');
    }
    if (!String(values.razonSocial || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'razonSocial') || 'Razón social');
    }
  }

  function joinTagsList(list) {
    if (!Array.isArray(list) || !list.length) return '';
    return list.join(' · ');
  }

  function buildEspecialidadBdsmMirror(estilo, fetiches, subId) {
    var parts = [];
    if (estilo) parts.push(String(estilo).trim());
    if (Array.isArray(fetiches) && fetiches.length &&
        (subId === 'fetiche' || subId === 'sado' || subId === 'dominatrix')) {
      parts.push(fetiches.slice(0, 4).join(' · '));
    }
    return parts.filter(Boolean).join(' · ');
  }

  function buildDominatrixPerfil(values) {
    values = values || {};
    return {
      estiloDominacion: values.estiloDominacion || '',
      experienciaBdsm: values.experienciaBdsm || '',
      listaFetiches: Array.isArray(values.listaFetiches) ? values.listaFetiches.slice() : [],
      limitesSesion: values.limitesSesion || '',
      equipamiento: Array.isArray(values.equipamiento) ? values.equipamiento.slice() : [],
      protocolo: Array.isArray(values.protocolo) ? values.protocolo.slice() : [],
      rolesAtendidos: Array.isArray(values.rolesAtendidos) ? values.rolesAtendidos.slice() : [],
      modalidadSesion: values.modalidadSesion || '',
      espacioSesion: values.espacioSesion || '',
      dressCodeCliente: values.dressCodeCliente || '',
      mostrarEquipamientoPublico: values.mostrarEquipamientoPublico || 'Sí',
      mostrarFetichesPublico: values.mostrarFetichesPublico || 'Sí',
      serviciosIncluidos: Array.isArray(values.serviciosIncluidos) ? values.serviciosIncluidos.slice() : [],
      serviciosNoRealizo: Array.isArray(values.serviciosNoRealizo) ? values.serviciosNoRealizo.slice() : [],
      modalidades: Array.isArray(values.modalidades) ? values.modalidades.slice() : [],
      metodosPago: Array.isArray(values.metodosPago) ? values.metodosPago.slice() : [],
      horarioDetalle: values.horarioDetalle || '',
      sobreMi: values.sobreMi || '',
      idiomas: values.idiomas || '',
      disponibilidad: values.disponibilidad || ''
    };
  }

  function finalizeDominatrixValues(values, ctx) {
    if (!values || !isDominatrixSubcategoria(ctx || {})) return values;
    var dom = buildDominatrixPerfil(values);
    clearProfileContractState(values, ['dominatrixPerfil'], ['modalidades']);
    values.dominatrixPerfil = dom;
    return values;
  }

  function mapDominatrixToPerfil(u, bloques, ctx) {
    u = u || {};
    ctx = ctx || {};
    var subId = normalizeDominatrixSubId((ctx && ctx.subcategoriaId) || (ctx && ctx.subcategoria) || '') || subIdFromCtx(ctx);
    var dom = bloques.dominatrixPerfil || buildDominatrixPerfil(bloques);
    clearProfileContractState(u, ['dominatrixPerfil'], ['modalidades']);
    u.dominatrixPerfil = Object.assign({}, dom);
    u.arquetipo = 'persona_dominatrix';
    u.tipoPerfil = 'persona';
    u.subcategoriaId = subId || u.subcategoriaId;
    if (dom.estiloDominacion) u.estiloDominacion = dom.estiloDominacion;
    u.especialidadBdsm = buildEspecialidadBdsmMirror(dom.estiloDominacion, dom.listaFetiches, subId);
    if (dom.experienciaBdsm) u.experienciaBdsm = dom.experienciaBdsm;
    if (dom.limitesSesion) u.limitesSesion = dom.limitesSesion;
    if (dom.espacioSesion) u.espacioSesion = dom.espacioSesion;
    if (dom.modalidadSesion) u.modalidadSesion = dom.modalidadSesion;
    if (dom.dressCodeCliente) u.dressCodeCliente = dom.dressCodeCliente;
    if (Array.isArray(dom.rolesAtendidos) && dom.rolesAtendidos.length) {
      u.rolesAtendidos = dom.rolesAtendidos.slice();
    }
    if (String(dom.mostrarFetichesPublico || 'Sí') !== 'No' &&
        Array.isArray(dom.listaFetiches) && dom.listaFetiches.length) {
      u.listaFetiches = dom.listaFetiches.slice();
    }
    if (String(dom.mostrarEquipamientoPublico || 'Sí') !== 'No' &&
        Array.isArray(dom.equipamiento) && dom.equipamiento.length) {
      u.equipamiento = joinTagsList(dom.equipamiento);
    }
    if (Array.isArray(dom.protocolo) && dom.protocolo.length) {
      u.protocolo = joinTagsList(dom.protocolo);
    }
    if (Array.isArray(dom.serviciosIncluidos) && dom.serviciosIncluidos.length) {
      u.serviciosIncluidos = dom.serviciosIncluidos.slice();
    }
    if (Array.isArray(dom.serviciosNoRealizo) && dom.serviciosNoRealizo.length) {
      u.noRealiza = dom.serviciosNoRealizo.slice();
    }
    if (Array.isArray(dom.metodosPago) && dom.metodosPago.length) {
      u.metodosPago = dom.metodosPago.slice();
    }
    if (Array.isArray(dom.modalidades) && dom.modalidades.length) {
      u.modalidades = dom.modalidades.slice();
      u.modalidadFicha = dom.modalidades.map(function (m) {
        if (m === 'recibe') return 'Recibe';
        if (m === 'hotel') return 'Hotel';
        return m;
      }).join(' · ');
    }
    if (dom.horarioDetalle) {
      u.horarioDetalle = dom.horarioDetalle;
      u.horario = dom.horarioDetalle;
    }
    if (dom.sobreMi) u.sobreMi = dom.sobreMi;
    if (dom.idiomas) u.idiomas = dom.idiomas;
    if (dom.disponibilidad) {
      u.disponibilidad = DISPONIBILIDAD_LABELS[dom.disponibilidad] || dom.disponibilidad;
    }
    return u;
  }

  function validateDominatrixDeltaValues(cfg, values, missing) {
    if (!String(values.estiloDominacion || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'estiloDominacion') || 'Estilo (pro/dom)');
    }
    if (!String(values.limitesSesion || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'limitesSesion') || 'Límites y reglas de sesión');
    }
    var equip = values.equipamiento;
    if (!Array.isArray(equip) || !equip.length) {
      pushMissing(missing, labelForField(cfg, 'equipamiento') || 'Equipamiento');
    }
    if (!String(values.modalidadSesion || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'modalidadSesion') || 'Modalidad de sesión');
    }
    var mods = values.modalidades;
    if (!Array.isArray(mods) || !mods.length) {
      pushMissing(missing, labelForField(cfg, 'modalidades') || 'Modalidades presenciales');
    }
    var subId = subIdFromCtx({ subcategoriaId: values.subcategoriaId });
    if (subId === 'fetiche' || subId === 'sado') {
      var fet = values.listaFetiches;
      if (!Array.isArray(fet) || !fet.length) {
        pushMissing(missing, labelForField(cfg, 'listaFetiches') || 'Fetiches ofrecidos');
      }
    }
    if (subId === 'sado') {
      var prot = values.protocolo;
      if (!Array.isArray(prot) || !prot.length) {
        pushMissing(missing, labelForField(cfg, 'protocolo') || 'Protocolo de seguridad');
      }
      if (!String(values.experienciaBdsm || '').trim()) {
        pushMissing(missing, labelForField(cfg, 'experienciaBdsm') || 'Experiencia BDSM');
      }
    }
  }

  function dinamicaCuckoldHotwifeLabel(value) {
    var map = {
      cuckold: 'Cuckold',
      hotwife: 'Hotwife',
      ambos: 'Ambos / pareja flexible'
    };
    return map[String(value || '').trim()] || String(value || '').trim();
  }

  function buildCuckoldHotwifePerfil(values) {
    values = values || {};
    var din = String(values.dinamica || '').trim();
    return {
      dinamica: din,
      dinamicaLabel: values.dinamicaLabel || dinamicaCuckoldHotwifeLabel(din),
      buscan: Array.isArray(values.buscan) ? values.buscan.slice() : [],
      tipoExperiencia: Array.isArray(values.tipoExperiencia) ? values.tipoExperiencia.slice() : [],
      participacionPareja: values.participacionPareja || '',
      aceptanSolteros: values.aceptanSolteros || '',
      aceptanPrincipiantes: values.aceptanPrincipiantes || '',
      experienciaEnLifestyle: values.experienciaEnLifestyle || '',
      haceColaboraciones: values.haceColaboraciones || '',
      colaboraCon: Array.isArray(values.colaboraCon) ? values.colaboraCon.slice() : [],
      mostrarBuscan: values.mostrarBuscan || 'Sí',
      mostrarParticipacion: values.mostrarParticipacion || 'Sí',
      mostrarColaboraciones: values.mostrarColaboraciones || 'Sí'
    };
  }

  function hasCuckoldHotwifeDelta(values) {
    if (!values) return false;
    if (values.cuckoldHotwifePerfil) return true;
    var din = String(values.dinamica || '').trim();
    return din === 'cuckold' || din === 'hotwife' || din === 'ambos';
  }

  function shouldApplyCuckoldHotwifePipeline(ctx, values) {
    if (ctx && isSwingerSubcategoria(ctx)) return false;
    if (ctx && isUnicornSubcategoria(ctx)) return false;
    if (ctx) return isCuckoldHotwifeSubcategoria(ctx);
    return hasCuckoldHotwifeDelta(values);
  }

  function buildSwingerPerfil(values) {
    values = values || {};
    return {
      objetivosPerfil: Array.isArray(values.objetivosPerfil) ? values.objetivosPerfil.slice() : [],
      objetivoPrincipal: values.objetivoPrincipal || buildObjetivoPrincipal(values.objetivosPerfil),
      intercambioSwinger: values.intercambioSwinger || '',
      tipoInteraccion: Array.isArray(values.tipoInteraccion) ? values.tipoInteraccion.slice() : [],
      modalidadInteraccion: Array.isArray(values.modalidadInteraccion) ? values.modalidadInteraccion.slice() : [],
      atiendenA: values.atiendenA || '',
      aceptanSolteros: values.aceptanSolteros || '',
      haceColaboraciones: values.haceColaboraciones || '',
      colaboraCon: Array.isArray(values.colaboraCon) ? values.colaboraCon.slice() : [],
      estiloPareja: Array.isArray(values.estiloPareja) ? values.estiloPareja.slice() : [],
      aceptanParejasPrincipiantes: values.aceptanParejasPrincipiantes || '',
      experienciaEnLifestyle: values.experienciaEnLifestyle || '',
      mostrarObjetivosPerfil: values.mostrarObjetivosPerfil || 'Sí',
      mostrarAtiendenA: values.mostrarAtiendenA || 'Sí',
      mostrarColaboraciones: values.mostrarColaboraciones || 'Sí'
    };
  }

  var buildDeltaSwinger = buildSwingerPerfil;

  function hasSwingerDelta(values) {
    if (!values) return false;
    if (values.swingerPerfil) return true;
    if (values.intercambioSwinger) return true;
    if (Array.isArray(values.tipoInteraccion) && values.tipoInteraccion.length) return true;
    if (Array.isArray(values.modalidadInteraccion) && values.modalidadInteraccion.length) return true;
    if (values.atiendenA) return true;
    if (values.aceptanSolteros) return true;
    if (values.aceptanParejasPrincipiantes) return true;
    if (values.experienciaEnLifestyle) return true;
    if (Array.isArray(values.estiloPareja) && values.estiloPareja.length) return true;
    return false;
  }

  function buildUnicornPerfil(values) {
    values = values || {};
    return {
      objetivosPerfil: Array.isArray(values.objetivosPerfil) ? values.objetivosPerfil.slice() : [],
      objetivoPrincipal: values.objetivoPrincipal || buildObjetivoPrincipal(values.objetivosPerfil),
      tipoUnicornio: values.tipoUnicornio || '',
      buscoConocer: Array.isArray(values.buscoConocer) ? values.buscoConocer.slice() : [],
      tipoParejaPreferida: Array.isArray(values.tipoParejaPreferida) ? values.tipoParejaPreferida.slice() : [],
      finalidadEncuentro: Array.isArray(values.finalidadEncuentro) ? values.finalidadEncuentro.slice() : [],
      estadoPerfil: values.estadoPerfil || '',
      haceColaboraciones: values.haceColaboraciones || '',
      colaboraCon: Array.isArray(values.colaboraCon) ? values.colaboraCon.slice() : [],
      experiencia: values.experiencia || '',
      ambientePreferido: Array.isArray(values.ambientePreferido) ? values.ambientePreferido.slice() : [],
      estilo: values.estilo || '',
      serviciosLifestyle: Array.isArray(values.serviciosLifestyle) ? values.serviciosLifestyle.slice() : [],
      mostrarObjetivosPerfil: values.mostrarObjetivosPerfil || 'Sí',
      mostrarColaboraciones: values.mostrarColaboraciones || 'Sí',
      modalidades: Array.isArray(values.modalidades) ? values.modalidades.slice() : [],
      viajesDesplazamiento: values.viajesDesplazamiento || null,
      horarioDetalle: values.horarioDetalle || '',
      metodosPago: Array.isArray(values.metodosPago) ? values.metodosPago.slice() : [],
      sobreMi: values.sobreMi || '',
      idiomas: values.idiomas || ''
    };
  }

  function hasUnicornDelta(values) {
    if (!values) return false;
    if (values.unicornPerfil) return true;
    if (values.tipoUnicornio) return true;
    if (values.estadoPerfil) return true;
    if (Array.isArray(values.buscoConocer) && values.buscoConocer.length) return true;
    if (Array.isArray(values.tipoParejaPreferida) && values.tipoParejaPreferida.length) return true;
    if (Array.isArray(values.finalidadEncuentro) && values.finalidadEncuentro.length) return true;
    if (values.experiencia) return true;
    if (Array.isArray(values.ambientePreferido) && values.ambientePreferido.length) return true;
    if (values.estilo) return true;
    if (Array.isArray(values.serviciosLifestyle) && values.serviciosLifestyle.length) return true;
    return false;
  }

  function shouldApplySwingerPipeline(ctx, values) {
    if (ctx && isUnicornSubcategoria(ctx)) return false;
    if (ctx && isCuckoldHotwifeSubcategoria(ctx)) return false;
    if (ctx) return isSwingerSubcategoria(ctx);
    return hasSwingerDelta(values);
  }

  function shouldApplyUnicornPipeline(ctx, values) {
    if (ctx && isSwingerSubcategoria(ctx)) return false;
    if (ctx && isCuckoldHotwifeSubcategoria(ctx)) return false;
    if (ctx) return isUnicornSubcategoria(ctx);
    return hasUnicornDelta(values);
  }

  function applyCuckoldHotwifePerfilFields(u, bloques, ctx) {
    if (!u || !bloques) return u;
    if (!shouldApplyCuckoldHotwifePipeline(ctx, bloques)) return u;
    var ch = bloques.cuckoldHotwifePerfil;
    if (!ch && hasCuckoldHotwifeDelta(bloques)) ch = buildCuckoldHotwifePerfil(bloques);
    if (!ch || !hasCuckoldHotwifeDelta(ch)) return u;
    clearProfileContractState(u, ['cuckoldHotwifePerfil', 'parejaGrupoPerfil'], ['modalidades', 'viaja']);
    u.cuckoldHotwifePerfil = Object.assign({}, ch);
    u.subcategoriaId = 'cuckold hotwife';
    u.arquetipo = 'pareja_grupo';
    if (ch.dinamica) {
      u.dinamica = ch.dinamica;
      u.dinamicaLabel = ch.dinamicaLabel || dinamicaCuckoldHotwifeLabel(ch.dinamica);
    }
    if (Array.isArray(ch.buscan) && ch.buscan.length) u.buscan = ch.buscan.slice();
    if (Array.isArray(ch.tipoExperiencia) && ch.tipoExperiencia.length) {
      u.tipoExperiencia = ch.tipoExperiencia.slice();
    }
    if (ch.participacionPareja) u.participacionPareja = ch.participacionPareja;
    if (ch.aceptanSolteros) u.aceptanSolteros = ch.aceptanSolteros;
    if (ch.aceptanPrincipiantes) u.aceptanPrincipiantes = ch.aceptanPrincipiantes;
    if (ch.experienciaEnLifestyle) u.experienciaEnLifestyle = ch.experienciaEnLifestyle;
    if (ch.haceColaboraciones) u.haceColaboraciones = ch.haceColaboraciones;
    if (Array.isArray(ch.colaboraCon) && ch.colaboraCon.length) u.colaboraCon = ch.colaboraCon.slice();
    if (ch.mostrarBuscan) u.mostrarBuscan = ch.mostrarBuscan;
    if (ch.mostrarParticipacion) u.mostrarParticipacion = ch.mostrarParticipacion;
    if (ch.mostrarColaboraciones) u.mostrarColaboraciones = ch.mostrarColaboraciones;
    u.tipoPerfil = 'pareja_grupo';
    if (ch.dinamica === 'hotwife' || ch.dinamica === 'ambos') u.badgeHotwife = true;
    if (ch.dinamica === 'cuckold' || ch.dinamica === 'ambos') u.badgeCuckold = true;
    return u;
  }

  function applySwingerPerfilFields(u, bloques, ctx) {
    if (!u || !bloques) return u;
    if (!shouldApplySwingerPipeline(ctx, bloques)) return u;
    var sw = bloques.swingerPerfil;
    if (!sw && hasSwingerDelta(bloques)) sw = buildSwingerPerfil(bloques);
    if (!sw || !hasSwingerDelta(sw)) return u;
    clearProfileContractState(u, ['swingerPerfil', 'parejaGrupoPerfil'], ['modalidades', 'viaja']);
    u.swingerPerfil = Object.assign({}, sw);
    u.subcategoriaId = 'swinger';
    u.arquetipo = 'pareja_grupo';
    u.tipoPerfil = 'pareja_grupo';
    if (Array.isArray(sw.objetivosPerfil) && sw.objetivosPerfil.length) {
      u.objetivosPerfil = sw.objetivosPerfil.slice();
      u.objetivoPrincipal = sw.objetivoPrincipal || buildObjetivoPrincipal(sw.objetivosPerfil);
    }
    if (sw.intercambioSwinger) u.intercambioSwinger = sw.intercambioSwinger;
    if (Array.isArray(sw.tipoInteraccion) && sw.tipoInteraccion.length) {
      u.tipoInteraccion = sw.tipoInteraccion.slice();
    }
    if (Array.isArray(sw.modalidadInteraccion) && sw.modalidadInteraccion.length) {
      u.modalidadInteraccion = sw.modalidadInteraccion.slice();
    }
    if (sw.atiendenA) u.atiendenA = sw.atiendenA;
    if (sw.aceptanSolteros) u.aceptanSolteros = sw.aceptanSolteros;
    if (sw.haceColaboraciones) u.haceColaboraciones = sw.haceColaboraciones;
    if (Array.isArray(sw.colaboraCon) && sw.colaboraCon.length) u.colaboraCon = sw.colaboraCon.slice();
    if (Array.isArray(sw.estiloPareja) && sw.estiloPareja.length) u.estiloPareja = sw.estiloPareja.slice();
    if (sw.aceptanParejasPrincipiantes) u.aceptanParejasPrincipiantes = sw.aceptanParejasPrincipiantes;
    if (sw.experienciaEnLifestyle) u.experienciaEnLifestyle = sw.experienciaEnLifestyle;
    if (sw.mostrarObjetivosPerfil) u.mostrarObjetivosPerfil = sw.mostrarObjetivosPerfil;
    if (sw.mostrarAtiendenA) u.mostrarAtiendenA = sw.mostrarAtiendenA;
    if (sw.mostrarColaboraciones) u.mostrarColaboraciones = sw.mostrarColaboraciones;
    return u;
  }

  function applyUnicornPerfilFields(u, bloques, ctx) {
    if (!u || !bloques) return u;
    if (!shouldApplyUnicornPipeline(ctx, bloques)) return u;
    var un = bloques.unicornPerfil;
    if (!un && (hasUnicornDelta(bloques) || (ctx && isUnicornSubcategoria(ctx)))) {
      un = buildUnicornPerfil(bloques);
    }
    if (!un) return u;
    clearProfileContractState(u, ['unicornPerfil'], ['modalidades', 'viaja']);
    if (Array.isArray(un.objetivosPerfil) && un.objetivosPerfil.length) {
      u.objetivosPerfil = un.objetivosPerfil.slice();
      u.objetivoPrincipal = un.objetivoPrincipal || buildObjetivoPrincipal(un.objetivosPerfil);
    }
    if (un.mostrarObjetivosPerfil) u.mostrarObjetivosPerfil = un.mostrarObjetivosPerfil;
    if (un.tipoUnicornio) u.tipoUnicornio = un.tipoUnicornio;
    if (Array.isArray(un.buscoConocer) && un.buscoConocer.length) {
      u.buscoConocer = un.buscoConocer.slice();
      u.buscan = un.buscoConocer.slice();
    }
    if (Array.isArray(un.tipoParejaPreferida) && un.tipoParejaPreferida.length) {
      u.tipoParejaPreferida = un.tipoParejaPreferida.slice();
    }
    if (Array.isArray(un.finalidadEncuentro) && un.finalidadEncuentro.length) {
      u.finalidadEncuentro = un.finalidadEncuentro.slice();
    }
    if (un.estadoPerfil) u.estadoPerfil = un.estadoPerfil;
    if (un.haceColaboraciones) u.haceColaboraciones = un.haceColaboraciones;
    if (Array.isArray(un.colaboraCon) && un.colaboraCon.length) u.colaboraCon = un.colaboraCon.slice();
    if (un.mostrarColaboraciones) u.mostrarColaboraciones = un.mostrarColaboraciones;
    if (un.experiencia) u.experiencia = un.experiencia;
    if (Array.isArray(un.ambientePreferido) && un.ambientePreferido.length) {
      u.ambientePreferido = un.ambientePreferido.slice();
    }
    if (un.estilo) u.estilo = un.estilo;
    if (Array.isArray(un.serviciosLifestyle) && un.serviciosLifestyle.length) {
      u.serviciosLifestyle = un.serviciosLifestyle.slice();
      u.serviciosIncluidos = un.serviciosLifestyle.slice();
    }
    if (Array.isArray(un.modalidades) && un.modalidades.length) {
      u.modalidades = un.modalidades.slice();
      u.modalidadFicha = un.modalidades.map(function (m) {
        if (m === 'recibe') return 'Recibe';
        if (m === 'hotel') return 'Hotel';
        if (m === 'domicilio') return 'Domicilio';
        if (m === 'viaja') return 'Viaja';
        return m;
      }).join(' · ');
    }
    if (un.viajesDesplazamiento) {
      u.viajesDesplazamiento = Object.assign({}, un.viajesDesplazamiento);
    } else if (viajesApi()) {
      u.viajesDesplazamiento = viajesApi().buildViajesDesplazamiento(bloques, bloques.modalidades);
    }
    if (Array.isArray(un.metodosPago) && un.metodosPago.length) {
      u.metodosPago = un.metodosPago.slice();
    }
    if (un.horarioDetalle) {
      u.horarioDetalle = un.horarioDetalle;
      u.horario = un.horarioDetalle;
    }
    if (un.sobreMi) u.sobreMi = un.sobreMi;
    if (un.idiomas) u.idiomas = un.idiomas;
    u.tipoPerfil = 'persona';
    u.arquetipo = (ctx && ctx.arquetipo) || 'persona_lifestyle';
    u.subcategoriaId = 'unicorns';
    u.badgeUnicorn = true;
    u.unicornPerfil = Object.assign({}, un, {
      modalidades: u.modalidades || un.modalidades || [],
      viajesDesplazamiento: u.viajesDesplazamiento || un.viajesDesplazamiento || null,
      metodosPago: u.metodosPago || un.metodosPago || [],
      horarioDetalle: u.horarioDetalle || un.horarioDetalle || '',
      sobreMi: u.sobreMi || un.sobreMi || '',
      idiomas: u.idiomas || un.idiomas || ''
    });
    return u;
  }

  function finalizeParejaSwingerValues(values, ctx) {
    if (!values) return values;
    if (!shouldApplySwingerPipeline(ctx, values)) return values;
    if (!String(values.mostrarAtiendenA || '').trim()) values.mostrarAtiendenA = 'Sí';
    if (!String(values.mostrarColaboraciones || '').trim()) values.mostrarColaboraciones = 'Sí';
    if (!String(values.mostrarObjetivosPerfil || '').trim()) values.mostrarObjetivosPerfil = 'Sí';
    var hace = String(values.haceColaboraciones || '').trim();
    if (hace === 'No') delete values.colaboraCon;
    if (Array.isArray(values.objetivosPerfil)) {
      values.objetivoPrincipal = buildObjetivoPrincipal(values.objetivosPerfil);
    }
    clearProfileContractState(values, ['swingerPerfil', 'parejaGrupoPerfil'], ['modalidades', 'viaja']);
    values.subcategoriaId = 'swinger';
    values.swingerPerfil = buildSwingerPerfil(values);
    delete values.deltaSwinger;
    return values;
  }

  function finalizeUnicornValues(values, ctx) {
    if (!values) return values;
    if (!shouldApplyUnicornPipeline(ctx, values)) return values;
    if (!String(values.mostrarObjetivosPerfil || '').trim()) values.mostrarObjetivosPerfil = 'Sí';
    if (!String(values.mostrarColaboraciones || '').trim()) values.mostrarColaboraciones = 'Sí';
    var hace = String(values.haceColaboraciones || '').trim();
    if (hace !== 'Sí') delete values.colaboraCon;
    if (Array.isArray(values.objetivosPerfil)) {
      values.objetivoPrincipal = buildObjetivoPrincipal(values.objetivosPerfil);
    }
    clearProfileContractState(values, ['unicornPerfil'], ['modalidades', 'viaja']);
    values.subcategoriaId = 'unicorns';
    values.unicornPerfil = buildUnicornPerfil(values);
    return values;
  }

  function finalizeCuckoldHotwifeValues(values, ctx) {
    if (!values) return values;
    if (!shouldApplyCuckoldHotwifePipeline(ctx, values)) return values;
    if (!String(values.mostrarBuscan || '').trim()) values.mostrarBuscan = 'Sí';
    if (!String(values.mostrarParticipacion || '').trim()) values.mostrarParticipacion = 'Sí';
    if (!String(values.mostrarColaboraciones || '').trim()) values.mostrarColaboraciones = 'Sí';
    var hace = String(values.haceColaboraciones || '').trim();
    if (hace !== 'Sí') delete values.colaboraCon;
    if (values.dinamica) {
      values.dinamicaLabel = dinamicaCuckoldHotwifeLabel(values.dinamica);
    }
    clearProfileContractState(values, ['cuckoldHotwifePerfil', 'parejaGrupoPerfil'], ['modalidades', 'viaja']);
    values.subcategoriaId = 'cuckold hotwife';
    values.cuckoldHotwifePerfil = buildCuckoldHotwifePerfil(values);
    return values;
  }

  function finalizeViajesValues(values) {
    var api = viajesApi();
    if (!api) return values;
    values.viajesDesplazamiento = api.buildViajesDesplazamiento(values, values.modalidades);
    if (!values.viajesDesplazamiento.viaja) {
      api.viajesFieldIds().forEach(function (key) {
        delete values[key];
      });
    }
    return values;
  }

  function collectValues(cfg, ctx) {
    if (!cfg) return {};
    ctx = ctx || {};
    var values = {};
    cfg.blocks.forEach(function (block) {
      block.fields.forEach(function (field) {
        if (field.type === 'checklist') {
          values[field.id] = readChecklist(field.id);
          return;
        }
        if (field.type === 'memberList') {
          values[field.id] = readMemberList(field.id);
          return;
        }
        if (field.type === 'boolean') {
          var cb = $(fieldDomId(field.id));
          values[field.id] = cb ? cb.checked === true : false;
          return;
        }
        var el = $(fieldDomId(field.id));
        values[field.id] = el ? String(el.value || '').trim() : '';
      });
    });
    values = finalizeViajesValues(values);
    values = finalizeEdecanValues(values, ctx);
    values = finalizeModelosValues(values, ctx);
    values = finalizeLesbiansValues(values);
    values = finalizeParejaSwingerValues(values, ctx);
    values = finalizeUnicornValues(values, ctx);
    values = finalizeCuckoldHotwifeValues(values, ctx);
    values = finalizeDominatrixValues(values, ctx);
    values = finalizeEspectaculoValues(values, ctx);
    values = finalizeCreadorValues(values, ctx);
    values = finalizeRetailValues(values, ctx);
    values = finalizeVenueValues(values, ctx);
    values = finalizeBienestarValues(values, ctx);
    values = finalizeHospedajeValues(values, ctx);
    values = finalizeParejaGrupoValues(values);
    return values;
  }

  function validateValues(cfg, values, ctx) {
    var missing = [];
    if (!cfg) return missing;
    cfg = mergedConfig(cfg, ctx);
    var viajaActivo = modalidadesIncluyeViaja(values);
    (cfg.obligatorios || []).forEach(function (key) {
      if (!viajaActivo && viajesApi() && viajesApi().viajesFieldIds().indexOf(key) >= 0) return;
      var val = values[key];
      var fieldType = fieldTypeForKey(cfg, key);
      if (fieldType === 'boolean') {
        if (!isTruthyFieldValue(val)) missing.push(labelForField(cfg, key));
        return;
      }
      if (fieldType === 'url') {
        if (!isValidUrl(val)) missing.push(labelForField(cfg, key));
        return;
      }
      if (Array.isArray(val)) {
        if (!val.length) missing.push(labelForField(cfg, key));
      } else if (fieldType === 'memberList') {
        if (!Array.isArray(val) || !val.length) missing.push(labelForField(cfg, key));
      } else if (!String(val || '').trim()) {
        missing.push(labelForField(cfg, key));
      }
    });
    cfg.blocks.forEach(function (block) {
      block.fields.forEach(function (field) {
        if (!field.required) return;
        if (isFieldHiddenByCondition(field, values)) return;
        var val = values[field.id];
        var empty = field.type === 'boolean'
          ? !isTruthyFieldValue(val)
          : field.type === 'url'
            ? !isValidUrl(val)
            : field.type === 'memberList'
              ? (!Array.isArray(val) || !val.filter(function (m) {
                return String(m.etiquetaPublica || '').trim() && String(m.generoPresentacion || '').trim();
              }).length)
            : (Array.isArray(val) ? !val.length : !String(val || '').trim());
        if (empty && missing.indexOf(field.label) < 0) missing.push(field.label);
      });
    });
    (cfg.validaciones || []).forEach(function (rule) {
      if (!rule || !rule.campo) return;
      var val = values[rule.campo];
      if (rule.max != null) {
        var meters = parseEstaturaMetros(val);
        if (meters == null || meters > rule.max) {
          pushMissing(missing, rule.mensaje || labelForField(cfg, rule.campo));
        }
      }
      if (rule.min != null) {
        var minMeters = parseEstaturaMetros(val);
        if (minMeters == null || minMeters < rule.min) {
          pushMissing(missing, rule.mensaje || labelForField(cfg, rule.campo));
        }
      }
    });
    if (String(values.haceColaboraciones || '').trim() === 'Sí') {
      var colabora = values.colaboraCon;
      if (!Array.isArray(colabora) || !colabora.length) {
        pushMissing(missing, labelForField(cfg, 'colaboraCon') || 'Busco colaborar con');
      }
    }
    if (cfg.id === 'pareja_grupo') {
      validateParejaGrupoValues(cfg, values, missing);
    }
    if (isSwingerSubcategoria(ctx)) {
      validateSwingerDeltaValues(cfg, values, missing);
    }
    if (isUnicornSubcategoria(ctx)) {
      validateUnicornDeltaValues(cfg, values, missing);
    }
    if (isCuckoldHotwifeSubcategoria(ctx)) {
      validateCuckoldHotwifeDeltaValues(cfg, values, missing);
    }
    if (isDominatrixSubcategoria(ctx)) {
      validateDominatrixDeltaValues(cfg, values, missing);
    }
    if (isEspectaculoSubcategoria(ctx)) {
      validateEspectaculoDeltaValues(cfg, values, missing, ctx);
    }
    if (isCreadorSubcategoria(ctx)) {
      validateCreadorDeltaValues(cfg, values, missing);
    }
    if (isRetailSubcategoria(ctx)) {
      validateRetailDeltaValues(cfg, values, missing);
    }
    if (isVenueSubcategoria(ctx)) {
      validateVenueDeltaValues(cfg, values, missing, ctx);
    }
    if (isBienestarSubcategoria(ctx)) {
      validateBienestarDeltaValues(cfg, values, missing, ctx);
    }
    if (isHospedajeSubcategoria(ctx)) {
      validateHospedajeDeltaValues(cfg, values, missing, ctx);
    }
    if (isEdecanSubcategoria(ctx) || isModelosSubcategoria(ctx)) {
      validateProfesionalDeltaValues(cfg, values, missing);
    }
    return missing;
  }

  function validateCuckoldHotwifeDeltaValues(cfg, values, missing) {
    if (!String(values.dinamica || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'dinamica') || 'Dinámica');
    }
    var buscan = values.buscan;
    if (!Array.isArray(buscan) || !buscan.length) {
      pushMissing(missing, labelForField(cfg, 'buscan') || 'Buscan');
    }
    var tipoExp = values.tipoExperiencia;
    if (!Array.isArray(tipoExp) || !tipoExp.length) {
      pushMissing(missing, labelForField(cfg, 'tipoExperiencia') || 'Tipo de experiencia');
    }
    if (!String(values.participacionPareja || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'participacionPareja') || 'Participación de la pareja');
    }
    if (String(values.haceColaboraciones || '').trim() === 'Sí') {
      var colabora = values.colaboraCon;
      if (!Array.isArray(colabora) || !colabora.length) {
        pushMissing(missing, labelForField(cfg, 'colaboraCon') || 'Colaboran con');
      }
    }
  }

  function validateUnicornDeltaValues(cfg, values, missing) {
    var objetivos = values.objetivosPerfil;
    if (!Array.isArray(objetivos) || !objetivos.length) {
      pushMissing(missing, labelForField(cfg, 'objetivosPerfil') || 'Objetivo del perfil');
    }
    if (!String(values.tipoUnicornio || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'tipoUnicornio') || 'Tipo de unicornio');
    }
    var busco = values.buscoConocer;
    if (!Array.isArray(busco) || !busco.length) {
      pushMissing(missing, labelForField(cfg, 'buscoConocer') || 'Busco conocer');
    }
    if (!String(values.estadoPerfil || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'estadoPerfil') || '¿Qué buscas actualmente?');
    }
    if (!String(values.haceColaboraciones || '').trim()) {
      pushMissing(missing, labelForField(cfg, 'haceColaboraciones') || 'Disponibilidad para colaboraciones');
    }
  }

  function validateSwingerDeltaValues(cfg, values, missing) {
    var hace = String(values.haceColaboraciones || '').trim();
    if (hace === 'Sí') {
      var colabora = values.colaboraCon;
      if (!Array.isArray(colabora) || !colabora.length) {
        pushMissing(missing, labelForField(cfg, 'colaboraCon') || 'Colaboran con');
      }
    }
  }

  function validateParejaGrupoValues(cfg, values, missing) {
    var aliasEl = $('fldAlias');
    var alias = aliasEl ? String(aliasEl.value || '').trim() : String(values.aliasPareja || values.alias || '').trim();
    if (!alias) {
      pushMissing(missing, 'Alias de la pareja / grupo');
    } else if (alias.length < 3) {
      pushMissing(missing, 'Alias de la pareja / grupo (mínimo 3 caracteres)');
    }

    var reglas = String(values.reglasAcceso || '').trim();
    if (reglas.length > 500) {
      pushMissing(missing, 'Reglas de acceso (máximo 500 caracteres)');
    }

    var config = String(values.configuracionGrupo || '').trim();
    var minMembers = 2;
    var minGrupo = 3;
    var maxMembers = 2;
    var maxGrupo = 8;
    cfg.blocks.forEach(function (block) {
      block.fields.forEach(function (field) {
        if (field.id === 'miembros') {
          if (field.minMembers) minMembers = field.minMembers;
          if (field.minMembersGrupo) minGrupo = field.minMembersGrupo;
          if (field.maxMembers) maxMembers = field.maxMembers;
          if (field.maxMembersGrupo) maxGrupo = field.maxMembersGrupo;
        }
      });
    });
    if (config === 'grupo') {
      minMembers = minGrupo;
      maxMembers = maxGrupo;
    }

    var members = Array.isArray(values.miembros) ? values.miembros : [];
    var validMembers = members.filter(function (m) {
      return String(m.etiquetaPublica || '').trim() && String(m.generoPresentacion || '').trim();
    });
    if (validMembers.length < minMembers) {
      pushMissing(missing, 'Integrantes (mínimo ' + minMembers + ')');
    }
    if (validMembers.length > maxMembers) {
      pushMissing(missing, 'Integrantes (máximo ' + maxMembers + ')');
    }
    validMembers.forEach(function (m, i) {
      if (!memberRowHasAge(m)) {
        pushMissing(missing, 'Edad o franja de integrante ' + (i + 1) + ' (mayor de 18)');
      } else if (m.edad != null && isFinite(m.edad) && m.edad < 18) {
        pushMissing(missing, 'Edad de integrante ' + (i + 1) + ' (mayor de 18)');
      }
    });
  }

  function labelForField(cfg, key) {
    var found = '';
    cfg.blocks.forEach(function (block) {
      block.fields.forEach(function (field) {
        if (field.id === key) found = field.label;
      });
    });
    return found || key;
  }

  function fieldTypeForKey(cfg, key) {
    var found = '';
    cfg.blocks.forEach(function (block) {
      block.fields.forEach(function (field) {
        if (field.id === key) found = field.type;
      });
    });
    return found;
  }

  function flattenViajesSaved(savedValues) {
    if (!savedValues || typeof savedValues !== 'object') return savedValues || {};
    var out = Object.assign({}, savedValues);
    var v = savedValues.viajesDesplazamiento;
    if (v && typeof v === 'object') {
      var api = viajesApi();
      var ids = api ? api.viajesFieldIds() : [];
      ids.forEach(function (key) {
        if (v[key] != null && out[key] == null) out[key] = v[key];
      });
      if (v.viaja === true && Array.isArray(out.modalidades) && out.modalidades.indexOf('viaja') < 0) {
        out.modalidades = out.modalidades.concat(['viaja']);
      }
    }
    return out;
  }

  function apply(ctx, resolved, savedValues) {
    var host = $('rpDynamicPublicHost');
    if (!host) return null;
    var cfg = resolveConfig(ctx, resolved);
    if (!cfg) {
      host.innerHTML = '';
      host.classList.add('rp-hidden');
      host.setAttribute('aria-hidden', 'true');
      syncLegacyFields(null, false);
      return null;
    }
    savedValues = flattenViajesSaved(savedValues || {});
    renderBlocks(host, mergedConfig(cfg, ctx), savedValues, ctx);
    syncLegacyFields(cfg, true);
    return cfg;
  }

  function collectForPreview(ctx) {
    var cfg = resolveConfig(ctx || {}, null);
    if (!cfg || !$('rpDynamicPublicHost') || $('rpDynamicPublicHost').classList.contains('rp-hidden')) return null;
    return collectValues(mergedConfig(cfg, ctx || {}), ctx || {});
  }

  function mapToPerfil(u, bloques, ctx) {
    if (!bloques) return u;
    u = u || {};
    var parejaCanon = normalizeParejaSubId((ctx && ctx.subcategoriaId) || (ctx && ctx.subcategoria) || u.subcategoriaId || '');
    var lifestyleCanon = normalizeLifestyleSubId((ctx && ctx.subcategoriaId) || (ctx && ctx.subcategoria) || u.subcategoriaId || '');
    if (parejaCanon) u.subcategoriaId = parejaCanon;
    if (lifestyleCanon) u.subcategoriaId = lifestyleCanon;
    if (isDominatrixSubcategoria(ctx)) {
      return mapDominatrixToPerfil(u, bloques, ctx);
    }
    if (isEspectaculoSubcategoria(ctx)) {
      return mapEspectaculoToPerfil(u, bloques, ctx);
    }
    if (isCreadorSubcategoria(ctx)) {
      return mapCreadorToPerfil(u, bloques, ctx);
    }
    if (isRetailSubcategoria(ctx)) {
      return mapRetailToPerfil(u, bloques, ctx);
    }
    if (isVenueSubcategoria(ctx)) {
      return mapVenueToPerfil(u, bloques, ctx);
    }
    if (isBienestarSubcategoria(ctx)) {
      return mapBienestarToPerfil(u, bloques, ctx);
    }
    if (isHospedajeSubcategoria(ctx)) {
      return mapHospedajeToPerfil(u, bloques, ctx);
    }
    if (isEdecanSubcategoria(ctx)) {
      return mapEdecanToPerfil(u, bloques, ctx);
    }
    if (isModelosSubcategoria(ctx)) {
      return mapModelosToPerfil(u, bloques, ctx);
    }
    if (bloques.orientacion) u.orientacion = bloques.orientacion;
    if (bloques.identidadGenero) u.identidadGenero = bloques.identidadGenero;
    if (bloques.presentacionFemboy) {
      u.presentacionFemboy = bloques.presentacionFemboy;
      u.identidadGenero = bloques.presentacionFemboy;
    }
    if (bloques.presentacionTom) {
      u.presentacionTom = bloques.presentacionTom;
      u.identidadGenero = bloques.presentacionTom;
    }
    if (bloques.estiloPredominante) u.estiloPredominante = bloques.estiloPredominante;
    if (Array.isArray(bloques.disponiblePara) && bloques.disponiblePara.length) {
      u.disponiblePara = bloques.disponiblePara.slice();
    }
    if (bloques.largoCabello) u.largoCabello = bloques.largoCabello;
    if (bloques.tonoPiel) u.tonoPiel = bloques.tonoPiel;
    if (bloques.videoPresentacion) u.videoPresentacion = normalizeUrl(bloques.videoPresentacion);
    if (bloques.promociones) u.promociones = bloques.promociones;
    if (Array.isArray(bloques.buscanConocer) && bloques.buscanConocer.length) {
      u.buscanConocer = bloques.buscanConocer.slice();
      u.buscan = bloques.buscanConocer.slice();
    }
    if (Array.isArray(bloques.tipoCitaPreferida) && bloques.tipoCitaPreferida.length) {
      u.tipoCitaPreferida = bloques.tipoCitaPreferida.slice();
    }
    if (bloques.personalidadPredominante) u.personalidadPredominante = bloques.personalidadPredominante;
    if (bloques.estiloPersonal) u.estiloPersonal = bloques.estiloPersonal;
    if (Array.isArray(bloques.dinamicasParticipa) && bloques.dinamicasParticipa.length) {
      u.dinamicasParticipa = bloques.dinamicasParticipa.slice();
    }
    if (bloques.colaboracionContenido) u.colaboracionContenido = bloques.colaboracionContenido;
    if (bloques.realizaTrios) u.realizaTrios = bloques.realizaTrios;
    if (Array.isArray(bloques.tiposTrios) && bloques.tiposTrios.length) {
      u.tiposTrios = bloques.tiposTrios.slice();
    }
    if (bloques.rolInteraccion) u.rolInteraccion = bloques.rolInteraccion;
    if (Array.isArray(bloques.buscan) && bloques.buscan.length) u.buscan = bloques.buscan.slice();
    if (Array.isArray(bloques.disponibilidadAgenda) && bloques.disponibilidadAgenda.length) {
      u.disponibilidadAgenda = bloques.disponibilidadAgenda.slice();
    }
    if (bloques.personalidad) u.personalidad = bloques.personalidad;
    if (bloques.pasatiempos) u.pasatiempos = bloques.pasatiempos;
    if (bloques.idiomas) u.idiomas = bloques.idiomas;
    if (bloques.nivelServicio) u.nivelServicio = bloques.nivelServicio;
    if (bloques.nivelPremium) u.nivelPremium = bloques.nivelPremium;
    if (Array.isArray(bloques.experienciaVip) && bloques.experienciaVip.length) {
      u.experienciaVip = bloques.experienciaVip.slice();
    }
    if (Array.isArray(bloques.distintivosVip) && bloques.distintivosVip.length) {
      u.distintivosVip = bloques.distintivosVip.slice();
    }
    u = mapDotadosFields(u, bloques);
    if (bloques.atiendoA) u.atiendoA = bloques.atiendoA;
    if (bloques.mostrarAtiendoA) u.mostrarAtiendoA = bloques.mostrarAtiendoA;
    if (bloques.haceColaboraciones) u.haceColaboraciones = bloques.haceColaboraciones;
    if (Array.isArray(bloques.colaboraCon) && bloques.colaboraCon.length) {
      u.colaboraCon = bloques.colaboraCon.slice();
    }
    if (bloques.mostrarColaboraciones) u.mostrarColaboraciones = bloques.mostrarColaboraciones;
    if (bloques.estiloLesbian) u.estiloLesbian = bloques.estiloLesbian;
    u = applySwingerPerfilFields(u, bloques, ctx);
    u = applyCuckoldHotwifePerfilFields(u, bloques, ctx);
    if (bloques.configuracionGrupo) {
      u.configuracionGrupo = bloques.configuracionGrupo;
      u.configuracionGrupoLabel = bloques.configuracionGrupoLabel || configuracionGrupoLabel(bloques.configuracionGrupo);
      u.tipoPareja = u.configuracionGrupoLabel;
    } else if (bloques.tipoPareja) u.tipoPareja = bloques.tipoPareja;
    if (bloques.aliasPareja) {
      u.aliasPareja = bloques.aliasPareja;
      u.alias = bloques.aliasPareja;
      u.nombre = bloques.aliasPareja;
    }
    if (Array.isArray(bloques.miembros) && bloques.miembros.length) {
      u.miembros = bloques.miembros.slice();
      u.miembrosResumen = bloques.miembrosResumen || buildMiembrosResumen(bloques.miembros);
      u.miembrosEdad = u.miembrosResumen;
    }
    if (bloques.reglasAcceso) u.reglasAcceso = bloques.reglasAcceso;
    if (bloques.parejaGrupoPerfil) u.parejaGrupoPerfil = Object.assign({}, bloques.parejaGrupoPerfil);
    if (bloques.tipoPerfil === 'pareja_grupo' || (ctx && matchesPareja(ctx, null))) {
      u.tipoPerfil = 'pareja_grupo';
    }
    if (bloques.tipoPareja && !bloques.configuracionGrupo) u.tipoPareja = bloques.tipoPareja;
    if (!u.mostrarAtiendoA) u.mostrarAtiendoA = 'Sí';
    if (!u.mostrarColaboraciones) u.mostrarColaboraciones = 'Sí';
    if (!u.mostrarAtiendenA) u.mostrarAtiendenA = 'Sí';
    if (!u.mostrarObjetivosPerfil) u.mostrarObjetivosPerfil = 'Sí';
    if (isTruthyFieldValue(bloques.eventosDisponibles)) u.eventosDisponibles = true;
    if (bloques.portfolioURL) u.portfolioURL = normalizeUrl(bloques.portfolioURL);
    if (bloques.disponibilidad) {
      u.disponibilidad = DISPONIBILIDAD_LABELS[bloques.disponibilidad] || bloques.disponibilidad;
    }
    if (bloques.estatura) u.estatura = bloques.estatura;
    if (bloques.peso) u.peso = bloques.peso;
    if (bloques.complexion) u.complexion = bloques.complexion;
    if (bloques.cabello) u.cabello = bloques.cabello;
    if (bloques.ojos) u.ojos = bloques.ojos;
    if (bloques.tatuajes) u.tatuajes = bloques.tatuajes;
    if (bloques.piercings) u.piercings = bloques.piercings;
    if (bloques.sobreMi) {
      u.sobreMi = bloques.sobreMi;
    }
    if (Array.isArray(bloques.serviciosIncluidos) && bloques.serviciosIncluidos.length) {
      u.serviciosIncluidos = bloques.serviciosIncluidos.slice();
    }
    if (Array.isArray(bloques.serviciosNoRealizo) && bloques.serviciosNoRealizo.length) {
      u.noRealiza = bloques.serviciosNoRealizo.slice();
    }
    if (Array.isArray(bloques.metodosPago) && bloques.metodosPago.length) {
      u.metodosPago = bloques.metodosPago.slice();
    }
    if (Array.isArray(bloques.modalidades) && bloques.modalidades.length) {
      u.modalidades = bloques.modalidades.slice();
      u.modalidadFicha = bloques.modalidades.map(function (m) {
        if (m === 'recibe') return 'Recibe';
        if (m === 'hotel') return 'Hotel';
        if (m === 'domicilio') return 'Domicilio';
        if (m === 'viaja') return 'Viaja';
        return m;
      }).join(' · ');
    }
    if (bloques.viajesDesplazamiento) {
      u.viajesDesplazamiento = bloques.viajesDesplazamiento;
    } else if (viajesApi()) {
      u.viajesDesplazamiento = viajesApi().buildViajesDesplazamiento(bloques, bloques.modalidades);
    }
    if (bloques.horarioDetalle) {
      u.horario = bloques.horarioDetalle;
      u.horarioDetalle = bloques.horarioDetalle;
    }
    u = applyUnicornPerfilFields(u, bloques, ctx);
    return applyBadges(u, ctx);
  }

  function collect(ctx, resolved) {
    var cfg = resolveConfig(ctx, resolved);
    if (!cfg) return null;
    return collectValues(mergedConfig(cfg, ctx), ctx);
  }

  function getFieldLabels(ctx, resolved) {
    var cfg = resolveConfig(ctx, resolved);
    if (!cfg) return {};
    var over = getSubcategoriaOverride(cfg, ctx);
    return (over && over.labels) ? Object.assign({}, over.labels) : {};
  }

  function getAliasLabel(ctx, resolved) {
    return getFieldLabels(ctx, resolved).alias || '';
  }

  function applyFieldLabels(ctx, resolved) {
    var labels = getFieldLabels(ctx, resolved);
    if (labels.alias) {
      var aliasLbl = document.querySelector('label[for="fldAlias"]');
      if (aliasLbl) aliasLbl.textContent = labels.alias;
    }
  }

  function bindChange(onChange) {
    var host = $('rpDynamicPublicHost');
    if (!host || host.dataset.rpPubBound === '1') return;
    host.dataset.rpPubBound = '1';
    host.addEventListener('input', function () {
      if (onChange) onChange();
    });
    host.addEventListener('change', function () {
      if (onChange) onChange();
    });
  }

  global.CariHubRegistroPublicBlocks = {
    resolveConfig: resolveConfig,
    matchesEscort: matchesEscort,
    matchesPareja: matchesPareja,
    matchesLifestyle: matchesLifestyle,
    matchesDominatrix: matchesDominatrix,
    matchesEspectaculo: matchesEspectaculo,
    matchesCreador: matchesCreador,
    matchesRetail: matchesRetail,
    matchesVenue: matchesVenue,
    matchesBienestar: matchesBienestar,
    matchesHospedaje: matchesHospedaje,
    apply: apply,
    collectValues: collectValues,
    validateValues: validateValues,
    collect: collect,
    collectForPreview: collectForPreview,
    mapToPerfil: mapToPerfil,
    getFotosMin: getFotosMin,
    mergedConfig: mergedConfig,
    getFieldLabels: getFieldLabels,
    getAliasLabel: getAliasLabel,
    applyFieldLabels: applyFieldLabels,
    bindChange: bindChange,
    configuracionGrupoLabel: configuracionGrupoLabel,
    buildMiembrosResumen: buildMiembrosResumen,
    normalizeMemberRow: normalizeMemberRow,
    finalizeParejaGrupoValues: finalizeParejaGrupoValues,
    finalizeParejaSwingerValues: finalizeParejaSwingerValues,
    finalizeUnicornValues: finalizeUnicornValues,
    finalizeCuckoldHotwifeValues: finalizeCuckoldHotwifeValues,
    finalizeEdecanValues: finalizeEdecanValues,
    finalizeModelosValues: finalizeModelosValues,
    mapEdecanToPerfil: mapEdecanToPerfil,
    mapModelosToPerfil: mapModelosToPerfil,
    finalizeDominatrixValues: finalizeDominatrixValues,
    buildDominatrixPerfil: buildDominatrixPerfil,
    mapDominatrixToPerfil: mapDominatrixToPerfil,
    finalizeEspectaculoValues: finalizeEspectaculoValues,
    buildEspectaculoPerfil: buildEspectaculoPerfil,
    mapEspectaculoToPerfil: mapEspectaculoToPerfil,
    normalizeEspectaculoSubId: normalizeEspectaculoSubId,
    finalizeCreadorValues: finalizeCreadorValues,
    buildCreadorPerfil: buildCreadorPerfil,
    mapCreadorToPerfil: mapCreadorToPerfil,
    normalizeCreadorSubId: normalizeCreadorSubId,
    finalizeRetailValues: finalizeRetailValues,
    buildRetailPerfil: buildRetailPerfil,
    mapRetailToPerfil: mapRetailToPerfil,
    normalizeRetailSubId: normalizeRetailSubId,
    normalizeEscortSubId: normalizeEscortSubId,
    normalizeParejaSubId: normalizeParejaSubId,
    normalizeLifestyleSubId: normalizeLifestyleSubId,
    normalizeDominatrixSubId: normalizeDominatrixSubId,
    finalizeVenueValues: finalizeVenueValues,
    buildVenuePerfil: buildVenuePerfil,
    mapVenueToPerfil: mapVenueToPerfil,
    normalizeVenueSubId: normalizeVenueSubId,
    inferVenueSubId: inferVenueSubId,
    finalizeBienestarValues: finalizeBienestarValues,
    buildBienestarPerfil: buildBienestarPerfil,
    mapBienestarToPerfil: mapBienestarToPerfil,
    normalizeBienestarSubId: normalizeBienestarSubId,
    isBienestarSubcategoria: isBienestarSubcategoria,
    finalizeHospedajeValues: finalizeHospedajeValues,
    buildHospedajePerfil: buildHospedajePerfil,
    mapHospedajeToPerfil: mapHospedajeToPerfil,
    normalizeHospedajeSubId: normalizeHospedajeSubId,
    isHospedajeSubcategoria: isHospedajeSubcategoria,
    buildSwingerPerfil: buildSwingerPerfil,
    buildUnicornPerfil: buildUnicornPerfil,
    buildCuckoldHotwifePerfil: buildCuckoldHotwifePerfil,
    buildDeltaSwinger: buildDeltaSwinger,
    buildObjetivoPrincipal: buildObjetivoPrincipal,
    hasSwingerDelta: hasSwingerDelta,
    hasUnicornDelta: hasUnicornDelta,
    hasCuckoldHotwifeDelta: hasCuckoldHotwifeDelta,
    isSwingerSubcategoria: isSwingerSubcategoria,
    isUnicornSubcategoria: isUnicornSubcategoria,
    isCuckoldHotwifeSubcategoria: isCuckoldHotwifeSubcategoria,
    isDominatrixSubcategoria: isDominatrixSubcategoria,
    isEspectaculoSubcategoria: isEspectaculoSubcategoria,
    isCreadorSubcategoria: isCreadorSubcategoria,
    isRetailSubcategoria: isRetailSubcategoria,
    isVenueSubcategoria: isVenueSubcategoria,
    shouldApplySwingerPipeline: shouldApplySwingerPipeline,
    shouldApplyUnicornPipeline: shouldApplyUnicornPipeline,
    shouldApplyCuckoldHotwifePipeline: shouldApplyCuckoldHotwifePipeline,
    applySwingerPerfilFields: applySwingerPerfilFields,
    applyUnicornPerfilFields: applyUnicornPerfilFields,
    applyCuckoldHotwifePerfilFields: applyCuckoldHotwifePerfilFields,
    dinamicaCuckoldHotwifeLabel: dinamicaCuckoldHotwifeLabel
  };
})(typeof window !== 'undefined' ? window : globalThis);
