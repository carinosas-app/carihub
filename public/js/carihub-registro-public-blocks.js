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
      if (field.excludeSubcategorias && field.excludeSubcategorias.length) {
        if (field.excludeSubcategorias.some(function (s) {
          return normalizeSubId(s) === subId;
        })) return false;
      }
      if (field.showWhenViaja && !subcategoriaViajesActiva(ctx)) return false;
      if (!field.onlySubcategorias || !field.onlySubcategorias.length) return true;
      return field.onlySubcategorias.some(function (s) {
        return normalizeSubId(s) === subId;
      });
    }
    function blockVisible(block) {
      if (block.excludeSubcategorias && block.excludeSubcategorias.length) {
        if (block.excludeSubcategorias.some(function (s) {
          return normalizeSubId(s) === subId;
        })) return false;
      }
      if (!block.onlySubcategorias || !block.onlySubcategorias.length) return true;
      return block.onlySubcategorias.some(function (s) {
        return normalizeSubId(s) === subId;
      });
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
    if (over.badges.indexOf('hotwife') >= 0) u.badgeHotwife = true;
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
    var subId = String(ctx.subcategoriaId || '').trim().toLowerCase();
    if (cfg.subcategoriaIds.indexOf(subId) >= 0) return true;
    var ident = resolved && resolved.identidad ? resolved.identidad : {};
    if (ident.formularioId === cfg.formularioId && ident.arquetipo === cfg.id) return true;
    if (resolved && cfg.uiIds.indexOf(resolved.formularioUiId || '') >= 0) return true;
    return false;
  }

  function matchesPareja(ctx, resolved) {
    var cfg = resolveParejaConfig();
    if (!cfg) return false;
    ctx = ctx || {};
    var subId = String(ctx.subcategoriaId || '').trim().toLowerCase();
    if (cfg.subcategoriaIds.indexOf(subId) >= 0) return true;
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
    var subId = String(ctx.subcategoriaId || '').trim().toLowerCase();
    if (cfg.subcategoriaIds.indexOf(subId) >= 0) return true;
    var ident = resolved && resolved.identidad ? resolved.identidad : {};
    if (ident.formularioId === cfg.formularioId && ident.arquetipo === cfg.id) return true;
    if (resolved && cfg.uiIds.indexOf(resolved.formularioUiId || '') >= 0) return true;
    return false;
  }

  function resolveConfig(ctx, resolved) {
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
    var subId = subIdFromCtx(ctx);
    return subId === 'swinger' || subId === 'parejas swinger';
  }

  function buildDeltaSwinger(values) {
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
      mostrarObjetivosPerfil: values.mostrarObjetivosPerfil || 'Sí',
      mostrarAtiendenA: values.mostrarAtiendenA || 'Sí',
      mostrarColaboraciones: values.mostrarColaboraciones || 'Sí'
    };
  }

  function finalizeParejaSwingerValues(values) {
    if (!values) return values;
    if (!String(values.mostrarAtiendenA || '').trim()) values.mostrarAtiendenA = 'Sí';
    if (!String(values.mostrarColaboraciones || '').trim()) values.mostrarColaboraciones = 'Sí';
    if (!String(values.mostrarObjetivosPerfil || '').trim()) values.mostrarObjetivosPerfil = 'Sí';
    var hace = String(values.haceColaboraciones || '').trim();
    if (hace === 'No') delete values.colaboraCon;
    if (Array.isArray(values.objetivosPerfil)) {
      values.objetivoPrincipal = buildObjetivoPrincipal(values.objetivosPerfil);
    }
    if (values.intercambioSwinger || (Array.isArray(values.objetivosPerfil) && values.objetivosPerfil.length)) {
      values.deltaSwinger = buildDeltaSwinger(values);
    }
    return values;
  }

  function finalizeUnicornValues(values) {
    if (!values) return values;
    if (!String(values.mostrarObjetivosPerfil || '').trim()) values.mostrarObjetivosPerfil = 'Sí';
    if (!String(values.mostrarColaboraciones || '').trim()) values.mostrarColaboraciones = 'Sí';
    var hace = String(values.haceColaboraciones || '').trim();
    if (hace !== 'Sí') delete values.colaboraCon;
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

  function collectValues(cfg) {
    if (!cfg) return {};
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
    return finalizeParejaGrupoValues(finalizeUnicornValues(finalizeParejaSwingerValues(finalizeLesbiansValues(finalizeViajesValues(values)))));
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
    return missing;
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
    return collectValues(mergedConfig(cfg, ctx || {}));
  }

  function mapToPerfil(u, bloques, ctx) {
    if (!bloques) return u;
    u = u || {};
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
    if (bloques.esBisexual) u.esBisexual = bloques.esBisexual;
    if (bloques.realizaGangBang) u.realizaGangBang = bloques.realizaGangBang;
    if (Array.isArray(bloques.buscan) && bloques.buscan.length) u.buscan = bloques.buscan.slice();
    else if (bloques.buscan) u.buscan = bloques.buscan;
    if (bloques.tipoPublico) {
      u.tipoPublico = bloques.tipoPublico;
      u.buscan = bloques.tipoPublico;
    }
    if (bloques.participacionPareja) u.participacionPareja = bloques.participacionPareja;
    if (Array.isArray(bloques.disponibilidadAgenda) && bloques.disponibilidadAgenda.length) {
      u.disponibilidadAgenda = bloques.disponibilidadAgenda.slice();
    }
    if (Array.isArray(bloques.tipoExperiencia) && bloques.tipoExperiencia.length) {
      u.tipoExperiencia = bloques.tipoExperiencia.slice();
    }
    if (bloques.loQueBuscaConocer) u.loQueBuscaConocer = bloques.loQueBuscaConocer;
    if (bloques.aficiones) u.aficiones = bloques.aficiones;
    if (bloques.estiloVida) u.estiloVida = bloques.estiloVida;
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
    if (Array.isArray(bloques.objetivosPerfil) && bloques.objetivosPerfil.length) {
      u.objetivosPerfil = bloques.objetivosPerfil.slice();
      u.objetivoPrincipal = bloques.objetivoPrincipal || buildObjetivoPrincipal(bloques.objetivosPerfil);
    }
    if (bloques.intercambioSwinger) u.intercambioSwinger = bloques.intercambioSwinger;
    if (Array.isArray(bloques.modalidadInteraccion) && bloques.modalidadInteraccion.length) {
      u.modalidadInteraccion = bloques.modalidadInteraccion.slice();
    }
    if (Array.isArray(bloques.estiloPareja) && bloques.estiloPareja.length) {
      u.estiloPareja = bloques.estiloPareja.slice();
    }
    if (bloques.deltaSwinger) u.deltaSwinger = Object.assign({}, bloques.deltaSwinger);
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
    if (Array.isArray(bloques.tipoInteraccion) && bloques.tipoInteraccion.length) {
      u.tipoInteraccion = bloques.tipoInteraccion.slice();
    }
    if (bloques.tipoPareja && !bloques.configuracionGrupo) u.tipoPareja = bloques.tipoPareja;
    if (bloques.atiendenA) u.atiendenA = bloques.atiendenA;
    if (bloques.mostrarAtiendenA) u.mostrarAtiendenA = bloques.mostrarAtiendenA;
    if (bloques.aceptanSolteros) u.aceptanSolteros = bloques.aceptanSolteros;
    if (bloques.mostrarObjetivosPerfil) u.mostrarObjetivosPerfil = bloques.mostrarObjetivosPerfil;
    if (bloques.tipoUnicornio) u.tipoUnicornio = bloques.tipoUnicornio;
    if (Array.isArray(bloques.buscoConocer) && bloques.buscoConocer.length) {
      u.buscoConocer = bloques.buscoConocer.slice();
      u.buscan = bloques.buscoConocer.slice();
    }
    if (Array.isArray(bloques.tipoParejaPreferida) && bloques.tipoParejaPreferida.length) {
      u.tipoParejaPreferida = bloques.tipoParejaPreferida.slice();
    }
    if (Array.isArray(bloques.finalidadEncuentro) && bloques.finalidadEncuentro.length) {
      u.finalidadEncuentro = bloques.finalidadEncuentro.slice();
    }
    if (bloques.estadoPerfil) u.estadoPerfil = bloques.estadoPerfil;
    if (bloques.experiencia) u.experiencia = bloques.experiencia;
    if (Array.isArray(bloques.ambientePreferido) && bloques.ambientePreferido.length) {
      u.ambientePreferido = bloques.ambientePreferido.slice();
    }
    if (bloques.estilo) u.estilo = bloques.estilo;
    if (Array.isArray(bloques.serviciosLifestyle) && bloques.serviciosLifestyle.length) {
      u.serviciosLifestyle = bloques.serviciosLifestyle.slice();
      u.serviciosIncluidos = bloques.serviciosLifestyle.slice();
    }
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
    matchesPareja: matchesPareja,
    matchesLifestyle: matchesLifestyle,
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
    buildDeltaSwinger: buildDeltaSwinger,
    buildObjetivoPrincipal: buildObjetivoPrincipal
  };
})(typeof window !== 'undefined' ? window : globalThis);
