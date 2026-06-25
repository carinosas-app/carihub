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

  function normalizeSubId(id) {
    return String(id || '').trim().toLowerCase().replace(/_/g, ' ');
  }

  function getSubcategoriaOverride(cfg, ctx) {
    if (!cfg || !cfg.subcategoriaOverrides) return null;
    var subId = normalizeSubId((ctx && ctx.subcategoriaId) || (ctx && ctx.subcategoria) || '');
    return cfg.subcategoriaOverrides[subId] || null;
  }

  function mergedConfig(cfg, ctx) {
    var over = getSubcategoriaOverride(cfg, ctx);
    var subId = normalizeSubId((ctx && ctx.subcategoriaId) || (ctx && ctx.subcategoria) || '');
    function fieldVisible(field) {
      if (!field.onlySubcategorias || !field.onlySubcategorias.length) return true;
      return field.onlySubcategorias.some(function (s) {
        return normalizeSubId(s) === subId;
      });
    }
    var baseBlocks = cfg.blocks.map(function (block) {
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
    });
    if (!over) {
      return {
        id: cfg.id,
        formularioId: cfg.formularioId,
        uiIds: cfg.uiIds,
        subcategoriaIds: cfg.subcategoriaIds,
        subcategoriaOverrides: cfg.subcategoriaOverrides,
        obligatorios: (cfg.obligatorios || []).slice(),
        blocks: baseBlocks
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
      fotosMin: over.fotosMin || null
    };
    (over.obligatoriosExtra || []).forEach(function (key) {
      if (out.obligatorios.indexOf(key) < 0) out.obligatorios.push(key);
    });
    return out;
  }

  function getFotosMin(ctx) {
    var cfg = resolveEscortConfig();
    if (!cfg || !matchesEscort(ctx || {}, null)) return null;
    var merged = mergedConfig(cfg, ctx || {});
    return merged.fotosMin || null;
  }

  function applyBadges(u, ctx) {
    var cfg = resolveEscortConfig();
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

  function matchesEscort(ctx, resolved) {
    var cfg = resolveEscortConfig();
    if (!cfg) return false;
    ctx = ctx || {};
    var subId = String(ctx.subcategoriaId || '').trim().toLowerCase();
    if (cfg.subcategoriaIds.indexOf(subId) >= 0) return true;
    var ident = resolved && resolved.identidad ? resolved.identidad : {};
    if (ident.formularioId === cfg.formularioId && ident.arquetipo === cfg.id) return true;
    if (resolved && cfg.uiIds.indexOf(resolved.formularioUiId || '') >= 0) return true;
    return false;
  }

  function resolveConfig(ctx, resolved) {
    if (matchesEscort(ctx, resolved)) return resolveEscortConfig();
    return null;
  }

  function fieldDomId(fieldId) {
    return 'rpPub_' + fieldId;
  }

  function renderChecklist(field, values) {
    values = values || {};
    var selected = values[field.id];
    if (!Array.isArray(selected)) selected = [];
    var selMap = {};
    selected.forEach(function (v) { selMap[String(v)] = true; });
    var opts = field.options || [];
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

  function renderField(field, values) {
    values = values || {};
    var val = values[field.id] != null ? values[field.id] : '';
    var req = field.required ? ' <span class="rp-req">*</span>' : '';
    var wrap = '<div class="rp-field rp-pub-field" data-rp-pub-field-wrap="' + esc(field.id) + '">';
    if (field.type === 'checklist') {
      wrap += '<span class="rp-pub-field-label">' + esc(field.label) + req + '</span>' + renderChecklist(field, values);
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

  function renderBlocks(host, cfg, values) {
    if (!host || !cfg) {
      if (host) host.innerHTML = '';
      return;
    }
    var html = '';
    cfg.blocks.forEach(function (block) {
      html += '<div class="rp-card rp-pub-block" data-rp-pub-block="' + esc(block.id) + '">';
      html += '<h2 class="rp-card__title">' + esc(block.title) + '</h2>';
      if (block.hint) html += '<p class="rp-contact-hint">' + esc(block.hint) + '</p>';
      block.fields.forEach(function (field) {
        html += renderField(field, values);
      });
      html += '</div>';
    });
    host.innerHTML = html;
    host.classList.remove('rp-hidden');
    host.removeAttribute('aria-hidden');
    bindNivelServicioHelp();
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

  function collectValues(cfg) {
    if (!cfg) return {};
    var values = {};
    cfg.blocks.forEach(function (block) {
      block.fields.forEach(function (field) {
        if (field.type === 'checklist') {
          values[field.id] = readChecklist(field.id);
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
    return values;
  }

  function validateValues(cfg, values, ctx) {
    var missing = [];
    if (!cfg) return missing;
    cfg = mergedConfig(cfg, ctx);
    (cfg.obligatorios || []).forEach(function (key) {
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
      } else if (!String(val || '').trim()) {
        missing.push(labelForField(cfg, key));
      }
    });
    cfg.blocks.forEach(function (block) {
      block.fields.forEach(function (field) {
        if (!field.required) return;
        var val = values[field.id];
        var empty = field.type === 'boolean'
          ? !isTruthyFieldValue(val)
          : field.type === 'url'
            ? !isValidUrl(val)
            : (Array.isArray(val) ? !val.length : !String(val || '').trim());
        if (empty && missing.indexOf(field.label) < 0) missing.push(field.label);
      });
    });
    return missing;
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
    savedValues = savedValues || {};
    renderBlocks(host, mergedConfig(cfg, ctx), savedValues);
    syncLegacyFields(cfg, true);
    return cfg;
  }

  function collectForPreview(ctx) {
    var cfg = resolveEscortConfig();
    if (!$('rpDynamicPublicHost') || $('rpDynamicPublicHost').classList.contains('rp-hidden')) return null;
    return collectValues(mergedConfig(cfg, ctx || {}));
  }

  function mapToPerfil(u, bloques, ctx) {
    if (!bloques) return u;
    u = u || {};
    if (bloques.orientacion) u.orientacion = bloques.orientacion;
    if (bloques.idiomas) u.idiomas = bloques.idiomas;
    if (bloques.nivelServicio) u.nivelServicio = bloques.nivelServicio;
    if (bloques.nivelPremium) u.nivelPremium = bloques.nivelPremium;
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
        return m;
      }).join(' · ');
    }
    if (bloques.horarioDetalle) {
      u.horario = bloques.horarioDetalle;
      u.horarioDetalle = bloques.horarioDetalle;
    }
    return applyBadges(u, ctx);
  }

  function collect(ctx, resolved) {
    var cfg = resolveConfig(ctx, resolved);
    if (!cfg) return null;
    return collectValues(mergedConfig(cfg, ctx));
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
    bindChange: bindChange
  };
})(typeof window !== 'undefined' ? window : globalThis);
