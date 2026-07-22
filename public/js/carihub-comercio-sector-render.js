/**
 * Render Preview + Ficha — sector Comercio packs A–D (MP-COMERCIO-DELTAS-V1 Fase 3).
 * Fuente: scripts/comercio-packs-v1.mjs + comercio-sub-deltas-v1.mjs
 * Regenerar: node scripts/build-carihub-comercio-sector-render.mjs
 */
(function (global) {
  'use strict';

  var PREVIEW_FICHA = {
  "abarrotes": {
    "chips": [
      "categoriasProducto",
      "serviciosComercio",
      "modalidadVentaComercio"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadVentaComercio",
      "entregaDomicilio"
    ],
    "rows": [
      "categoriasProducto",
      "serviciosComercio",
      "modalidadVentaComercio",
      "formasPagoComercio",
      "entregaDomicilio",
      "diferenciadorComercio",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "entregaDomicilio",
      "formasPagoComercio",
      "coberturaGeografica"
    ]
  },
  "zapaterias": {
    "chips": [
      "categoriasProducto",
      "generosModa",
      "modalidadVentaComercio"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadVentaComercio"
    ],
    "rows": [
      "categoriasProducto",
      "generosModa",
      "modalidadVentaComercio",
      "marcasComercializadas",
      "serviciosComercio",
      "formasPagoComercio",
      "diferenciadorComercio",
      "coberturaGeografica"
    ],
    "faq": [
      "formasPagoComercio",
      "coberturaGeografica"
    ]
  },
  "tiendas-de-ropa": {
    "chips": [
      "categoriasProducto",
      "generosModa",
      "modalidadVentaComercio"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadVentaComercio"
    ],
    "rows": [
      "categoriasProducto",
      "generosModa",
      "modalidadVentaComercio",
      "marcasComercializadas",
      "serviciosComercio",
      "formasPagoComercio",
      "diferenciadorComercio",
      "coberturaGeografica"
    ],
    "faq": [
      "formasPagoComercio",
      "coberturaGeografica"
    ]
  },
  "farmacias-de-barrio": {
    "chips": [
      "categoriasProducto",
      "serviciosComercio",
      "modalidadVentaComercio"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadVentaComercio",
      "entregaDomicilio"
    ],
    "rows": [
      "categoriasProducto",
      "serviciosComercio",
      "modalidadVentaComercio",
      "formasPagoComercio",
      "entregaDomicilio",
      "marcasComercializadas",
      "diferenciadorComercio",
      "coberturaGeografica"
    ],
    "faq": [
      "entregaDomicilio",
      "formasPagoComercio",
      "coberturaGeografica"
    ]
  },
  "papelerias": {
    "chips": [
      "categoriasProducto",
      "serviciosComercio",
      "modalidadVentaComercio"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadVentaComercio",
      "entregaDomicilio"
    ],
    "rows": [
      "categoriasProducto",
      "serviciosComercio",
      "modalidadVentaComercio",
      "formasPagoComercio",
      "entregaDomicilio",
      "diferenciadorComercio",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "entregaDomicilio",
      "formasPagoComercio",
      "coberturaGeografica"
    ]
  },
  "ferreterias": {
    "chips": [
      "categoriasProducto",
      "serviciosComercio",
      "modalidadVentaComercio"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadVentaComercio",
      "entregaDomicilio"
    ],
    "rows": [
      "categoriasProducto",
      "serviciosComercio",
      "modalidadVentaComercio",
      "formasPagoComercio",
      "entregaDomicilio",
      "marcasComercializadas",
      "diferenciadorComercio",
      "coberturaGeografica"
    ],
    "faq": [
      "entregaDomicilio",
      "formasPagoComercio",
      "coberturaGeografica"
    ]
  },
  "distribuidoras": {
    "chips": [
      "serviciosEmpresaComercio",
      "especialidadesEmpresaComercio",
      "tiposClientesComercio"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadVentaComercio",
      "flotaEntrega"
    ],
    "rows": [
      "serviciosEmpresaComercio",
      "especialidadesEmpresaComercio",
      "tiposClientesComercio",
      "flotaEntrega",
      "modalidadVentaComercio",
      "formasPagoComercio",
      "diferenciadorComercio",
      "colaboracionesComerciales"
    ],
    "faq": [
      "formasPagoComercio",
      "colaboracionesComerciales",
      "flotaEntrega"
    ]
  },
  "mayoreo": {
    "chips": [
      "serviciosMayoreo",
      "volumenMinimoPedido",
      "tiposClientesComercio"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadVentaComercio",
      "entregaDomicilio"
    ],
    "rows": [
      "serviciosMayoreo",
      "volumenMinimoPedido",
      "tiposClientesComercio",
      "modalidadVentaComercio",
      "formasPagoComercio",
      "entregaDomicilio",
      "diferenciadorComercio",
      "coberturaGeografica"
    ],
    "faq": [
      "entregaDomicilio",
      "formasPagoComercio",
      "coberturaGeografica"
    ]
  },
  "tiendas-de-conveniencia": {
    "chips": [
      "categoriasProducto",
      "serviciosComercio",
      "modalidadVentaComercio"
    ],
    "stats": [
      "tarifaDesde",
      "modalidadVentaComercio",
      "entregaDomicilio"
    ],
    "rows": [
      "categoriasProducto",
      "serviciosComercio",
      "modalidadVentaComercio",
      "formasPagoComercio",
      "entregaDomicilio",
      "diferenciadorComercio",
      "coberturaGeografica",
      "colaboracionesComerciales"
    ],
    "faq": [
      "entregaDomicilio",
      "formasPagoComercio",
      "coberturaGeografica"
    ]
  }
};

  var FIELD_LABELS = {
  "modalidadVentaComercio": "Modalidad de venta",
  "categoriasProducto": "Categorías de producto",
  "serviciosComercio": "Servicios comerciales",
  "formasPagoComercio": "Formas de pago",
  "entregaDomicilio": "Entrega a domicilio",
  "generosModa": "Géneros / público",
  "marcasComercializadas": "Marcas que manejas",
  "serviciosMayoreo": "Servicios de mayoreo",
  "volumenMinimoPedido": "Pedido mínimo (mayoreo)",
  "tiposClientesComercio": "Tipos de clientes",
  "serviciosEmpresaComercio": "Servicios de la empresa",
  "especialidadesEmpresaComercio": "Especialidades",
  "flotaEntrega": "Entrega / flota",
  "diferenciadorComercio": "Tu sello comercial",
  "coberturaGeografica": "Zona de cobertura",
  "colaboracionesComerciales": "¿Colaboras con proveedores, marcas o negocios?",
  "tiposColaboracionComercial": "Tipo de colaboraciones"
};

  var FIELD_TYPES = {
  "modalidadVentaComercio": "enum",
  "categoriasProducto": "checklist",
  "serviciosComercio": "checklist",
  "formasPagoComercio": "checklist",
  "entregaDomicilio": "enum",
  "generosModa": "checklist",
  "marcasComercializadas": "checklist",
  "serviciosMayoreo": "checklist",
  "volumenMinimoPedido": "text",
  "tiposClientesComercio": "checklist",
  "serviciosEmpresaComercio": "checklist",
  "especialidadesEmpresaComercio": "text",
  "flotaEntrega": "text",
  "diferenciadorComercio": "text",
  "coberturaGeografica": "text",
  "colaboracionesComerciales": "enum",
  "tiposColaboracionComercial": "checklist"
};

  var CANON_BLOCK_TITLES = {
  "abarrotes": "Abarrotes",
  "zapaterias": "Zapaterías",
  "tiendas-de-ropa": "Tiendas de ropa",
  "farmacias-de-barrio": "Farmacias de barrio",
  "papelerias": "Papelerías",
  "ferreterias": "Ferreterías",
  "distribuidoras": "Distribuidoras",
  "mayoreo": "Mayoreo",
  "tiendas-de-conveniencia": "Tiendas de conveniencia"
};

  var NEGOCIO_CANON = [
  "distribuidoras"
];

  var PACK_TITLES = {
  "A": "Abastos y conveniencia",
  "B": "Moda y calzado",
  "C": "Retail especializado",
  "D": "Mayoreo y distribución"
};

  var SUB_TO_PACK = {
  "abarrotes": "A",
  "tiendas-de-conveniencia": "A",
  "zapaterias": "B",
  "tiendas-de-ropa": "B",
  "farmacias-de-barrio": "C",
  "papelerias": "C",
  "ferreterias": "C",
  "mayoreo": "D",
  "distribuidoras": "D"
};

  var ENUM_LABELS = {
  "modalidadVentaComercio": {
    "tienda_fisica": "Tienda Fisica",
    "online": "Online",
    "ambos": "Ambos",
    "delivery": "Delivery"
  },
  "entregaDomicilio": {
    "si": "Si",
    "no": "No",
    "solo_zona": "Solo Zona",
    "convenir": "Convenir"
  },
  "colaboracionesComerciales": {
    "si_activo": "Si Activo",
    "ocasional": "Ocasional",
    "convenir": "Convenir",
    "no": "No"
  }
};

  var CARD_PACK_CLASS_PREFIX = 'res-card--com-pack-';

  var CARD_SECTOR_CLASS = 'res-card--comercio-sector';

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
    return (u && u.comercioPerfil) ? u.comercioPerfil : {};
  }

  function packFrom(u) {
    u = u || {};
    var p = perfilNested(u);
    return txt(u.deltaPack || p.deltaPack || SUB_TO_PACK[resolveCanonSubId(u)]).toUpperCase();
  }

  function isComercioSectorPerfil(u) {
    if (!u) return false;
    if (String(u.sectorId || '') === 'comercio' && (u.comercioPerfil || u.deltaPack)) return true;
    if (u.comercioPerfil && resolveCanonSubId(u)) return true;
    return false;
  }

  function isComercioNegocioPerfil(u) {
    return NEGOCIO_CANON.indexOf(resolveCanonSubId(u)) >= 0;
  }

  function resolveVistaPerfil(u) {
    if (!isComercioSectorPerfil(u)) return null;
    return isComercioNegocioPerfil(u) ? 'empresa' : 'pro';
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
    if (fieldId === 'tarifaDesde') return formatMoney(val);
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
    var pack = packFrom({ comercioPerfil: p });
    var items = [];
    (pf.chips || []).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) items.push(val);
    });
    var listFields = {
      A: ['categoriasProducto', 'serviciosComercio'],
      B: ['categoriasProducto', 'generosModa', 'marcasComercializadas'],
      C: ['categoriasProducto', 'serviciosComercio'],
      D: ['serviciosMayoreo', 'tiposClientesComercio', 'serviciosEmpresaComercio']
    };
    (listFields[pack] || []).forEach(function (fid) {
      formatFieldValue(fid, p[fid]).split(' · ').forEach(function (x) {
        if (x && items.indexOf(x) < 0) items.push(x);
      });
    });
    if (p.modalidadVentaComercio) {
      var mod = formatEnumValue('modalidadVentaComercio', p.modalidadVentaComercio);
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
    if (p.horarioDetalle) pushRow(rows, '🕐', 'Horario', p.horarioDetalle, 'horario');
    else if (u.horario) pushRow(rows, '🕐', 'Horario', u.horario, 'horario');
    if (p.certificaciones) pushRow(rows, '🎖️', 'Certificaciones', p.certificaciones);
    if (p.diferenciadorComercio) pushRow(rows, '🏪', 'Tu sello', p.diferenciadorComercio);
    var loc = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); }).join(', ');
    if (loc) pushRow(rows, '📍', 'Ubicación', loc);
    if (p.direccion) pushRow(rows, '🏢', 'Dirección', p.direccion);
    if (p.coberturaGeografica) pushRow(rows, '🗺️', 'Cobertura', p.coberturaGeografica);
    if (p.flotaEntrega) pushRow(rows, '🚚', 'Entrega / flota', p.flotaEntrega);
    return rows;
  }

  function buildBadges(u, canonId) {
    u = u || {};
    var p = perfilNested(u);
    var badges = [];
    if (p.entregaDomicilio === 'si' || p.entregaDomicilio === 'solo_zona') {
      badges.push({ cls: 'res-badge--urgencias', text: 'Entrega a domicilio' });
    }
    if (p.modalidadVentaComercio === 'delivery') {
      badges.push({ cls: 'res-badge--urgencias', text: 'Delivery' });
    }
    if (p.colaboracionesComerciales && txt(p.colaboracionesComerciales) && p.colaboracionesComerciales !== 'no') {
      badges.push({ cls: 'res-badge--colab', text: 'Colabora con otros' });
    }
    if (txt(p.certificaciones)) {
      badges.push({ cls: 'res-badge--cert', text: 'Certificado' });
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
        ['Comercio', 'Especialidad'],
        ['Consultar', 'Precio'],
        ['Verificado', 'En plataforma'],
        ['Surtido', 'Sujeto a disponibilidad'],
      ];
      var f = fillers[stats.length];
      if (f) stats.push(f);
    }
    return stats.slice(0, 4);
  }

  function buildFeats(pack) {
    if (pack === 'A') {
      return ['Abastos y conveniencia', 'Categorías visibles', 'Modalidad de venta', 'Perfil verificable'];
    }
    if (pack === 'B') {
      return ['Moda y calzado', 'Géneros declarados', 'Marcas visibles', 'Perfil verificable'];
    }
    if (pack === 'C') {
      return ['Retail especializado', 'Productos visibles', 'Formas de pago', 'Perfil verificable'];
    }
    return ['Mayoreo y distribución', 'Clientes declarados', 'Cobertura visible', 'Perfil verificable en CariHub'];
  }

  function packFaq(canonId, p) {
    p = p || {};
    var faqs = [];
    function pushFaq(q, a) {
      if (!q || !a) return;
      faqs.push({ q: q, a: String(a) });
    }
    function fallbackAnswer(fid) {
      if (fid === 'entregaDomicilio') return 'Depende de la zona: confirma por WhatsApp o el contacto publicado si hay entrega, solo zona o solo tienda.';
      if (fid === 'formasPagoComercio') return 'Aceptamos las formas de pago listadas en el perfil. Si necesitas factura u otra opción, pregunta antes de comprar.';
      if (fid === 'coberturaGeografica') return 'Atendemos la cobertura publicada. Fuera de esa zona, consulta disponibilidad y costo.';
      if (fid === 'horarioDetalle') return 'Revisa el horario publicado; puede variar en días festivos.';
      if (fid === 'volumenMinimoPedido') return 'El pedido mínimo de mayoreo está indicado en el perfil; escríbenos para cotizar.';
      return 'Escríbenos por el contacto publicado y te confirmamos detalles al momento.';
    }
    var pf = previewFields(canonId);
    (pf.faq || []).forEach(function (fid) {
      var label = fieldLabel(fid);
      var val = formatFieldValue(fid, p[fid]);
      pushFaq('¿' + label + '?', val || fallbackAnswer(fid));
    });
    if (faqs.length < 2) {
      pushFaq('¿Hacen entrega a domicilio?', formatFieldValue('entregaDomicilio', p.entregaDomicilio) || fallbackAnswer('entregaDomicilio'));
      pushFaq('¿Cuáles son las formas de pago?', formatFieldValue('formasPagoComercio', p.formasPagoComercio) || fallbackAnswer('formasPagoComercio'));
    }
    if (faqs.length < 3) {
      pushFaq('¿Cuál es el horario?', p.horarioDetalle || 'Consulta el horario publicado en el perfil.');
    }
    if (faqs.length < 4) {
      pushFaq('¿Cuál es la cobertura?', formatFieldValue('coberturaGeografica', p.coberturaGeografica) || fallbackAnswer('coberturaGeografica'));
    }
    return faqs.slice(0, 6);
  }

  function resolvePrecioPublico(p, u) {
    p = p || {};
    u = u || {};
    if (txt(u.precio)) return u.precio;
    if (p.tarifaDesde) return formatMoney(p.tarifaDesde);
    return '';
  }

  function resolvePriceLabel(u) {
    if (isComercioNegocioPerfil(u)) return 'Servicios desde';
    return 'Precio desde';
  }

  function buildSobreMi(canonId, p, u) {
    if (txt(u.sobreMi)) return u.sobreMi;
    if (txt(u.sobreNosotros)) return u.sobreNosotros;
    if (txt(p.tagline)) return p.tagline;
    if (txt(u.tagline)) return u.tagline;
    if (p.diferenciadorComercio) return p.diferenciadorComercio;
    if (p.categoriasProducto && p.categoriasProducto[0]) return p.categoriasProducto[0];
    if (p.serviciosEmpresaComercio && p.serviciosEmpresaComercio[0]) return p.serviciosEmpresaComercio[0];
    if (p.serviciosComercio && p.serviciosComercio[0]) return p.serviciosComercio[0];
    if (p.serviciosMayoreo && p.serviciosMayoreo[0]) return p.serviciosMayoreo[0];
    return CANON_BLOCK_TITLES[canonId] || PACK_TITLES[packFrom(u)] || 'Comercio local en tu zona.';
  }

  function hydrateDisplayFields(u) {
    u = u || {};
    if (!isComercioSectorPerfil(u)) return u;
    var p = perfilNested(u);
    var canonId = resolveCanonSubId(u);
    var pack = packFrom(u);
    u.__comercioCanon = canonId;
    u.__comercioPack = pack;
    u.sectorId = u.sectorId || 'comercio';
    u.titulo = u.categoriaPublica || u.categoria || CANON_BLOCK_TITLES[canonId] || p.blockTitle || PACK_TITLES[pack] || 'Comercio local';
    u.especialidad = u.especialidad || (p.categoriasProducto && p.categoriasProducto[0]) || (p.serviciosComercio && p.serviciosComercio[0]) || (p.serviciosMayoreo && p.serviciosMayoreo[0]) || u.titulo;
    u.servicios = u.servicios || u.titulo;
    u.tagline = u.tagline || p.tagline || '';
    u.sobreMi = buildSobreMi(canonId, p, u);
    u.sobreNosotros = u.sobreNosotros || u.sobreMi;
    u.precio = resolvePrecioPublico(p, u);
    u.horario = u.horario || p.horarioDetalle || '';
    if (isComercioNegocioPerfil(u)) {
      u.nombre = u.nombreComercial || p.nombreComercial || u.nombre || '';
      u.nombreComercial = u.nombreComercial || p.nombreComercial || u.nombre;
    } else {
      u.nombre = u.alias || p.alias || u.nombre || '';
      u.alias = p.alias || u.alias || u.nombre;
    }
    u.serviciosIncluidos = buildServiciosList(canonId, p);
    u.atencion = u.atencion || (p.modalidadVentaComercio ? formatEnumValue('modalidadVentaComercio', p.modalidadVentaComercio) : 'Consultar modalidad');
    u.modalidadVentaComercio = u.modalidadVentaComercio || p.modalidadVentaComercio || '';
    u.diferenciadorComercio = u.diferenciadorComercio || p.diferenciadorComercio || '';
    var locParts = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); });
    u.zonaCobertura = u.zonaCobertura || txt(p.coberturaGeografica) || locParts.join(', ') || txt(p.direccion) || '';
    u.cobertura = Array.isArray(u.cobertura) && u.cobertura.length ? u.cobertura : locParts.filter(Boolean);
    if (txt(p.certificaciones) && !Array.isArray(u.certificaciones)) {
      u.certificaciones = [[txt(p.certificaciones), 'Formación / registro']];
    }
    u.__comercioDatos = buildDatosRows(canonId, p, u);
    u.__comercioBadges = buildBadges(u, canonId);
    u.__comercioPriceLabel = resolvePriceLabel(u);
    u.rating = u.rating != null ? u.rating : '—';
    u.opiniones = u.opiniones != null ? u.opiniones : 0;
    u.reviews = Array.isArray(u.reviews) ? u.reviews : [];
    u.faq = Array.isArray(u.faq) && u.faq.length ? u.faq : packFaq(canonId, p);
    u.noIncluidos = Array.isArray(u.noIncluidos) && u.noIncluidos.length
      ? u.noIncluidos
      : ['Productos fuera de catálogo publicado', 'Servicios no declarados', 'Entrega fuera de zona salvo indicación'];
    u.stats = Array.isArray(u.stats) && u.stats.length ? u.stats : buildStats(canonId, p);
    u.feats = Array.isArray(u.feats) && u.feats.length ? u.feats : buildFeats(pack);
    u.metodosPago = Array.isArray(u.metodosPago) && u.metodosPago.length ? u.metodosPago : (Array.isArray(p.formasPagoComercio) && p.formasPagoComercio.length ? p.formasPagoComercio : ['Consultar']);
    u.tiempoRespuesta = u.tiempoRespuesta || (p.entregaDomicilio === 'si' ? 'Entrega a domicilio' : 'Consultar disponibilidad');
    u.urgencias = u.urgencias || (p.entregaDomicilio === 'si' || p.modalidadVentaComercio === 'delivery' ? 'Entrega disponible' : 'Consultar disponibilidad');
    return u;
  }

  function cardMetaChips(u) {
    u = hydrateDisplayFields(Object.assign({}, u));
    var p = perfilNested(u);
    var canonId = u.__comercioCanon;
    var pf = previewFields(canonId);
    var chips = [];
    (pf.chips || []).slice(0, 3).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) chips.push(val.split(' · ')[0].slice(0, 28));
    });
    if (p.modalidadVentaComercio) {
      chips.push(formatEnumValue('modalidadVentaComercio', p.modalidadVentaComercio).slice(0, 28));
    }
    if (p.entregaDomicilio === 'si' || p.entregaDomicilio === 'solo_zona') chips.push('Entrega a domicilio');
    else if (p.modalidadVentaComercio === 'delivery') chips.push('Delivery');
    return chips.filter(function (x, i, a) { return x && a.indexOf(x) === i; }).slice(0, 4);
  }

  global.CariHubComercioSectorRender = {
    PACK_TITLES: PACK_TITLES,
    CARD_PACK_CLASS_PREFIX: CARD_PACK_CLASS_PREFIX,
    CARD_SECTOR_CLASS: CARD_SECTOR_CLASS,
    isComercioSectorPerfil: isComercioSectorPerfil,
    isComercioNegocioPerfil: isComercioNegocioPerfil,
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
