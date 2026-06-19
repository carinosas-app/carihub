(function (global) {
  'use strict';

  var ICON_GO = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var PREFIX = 'img/registro-subcats/';

  var SALUD_IMAGES = [
    PREFIX + 'salud/salud-01-consulta-medica.png',
    PREFIX + 'salud/salud-02-clinica.png',
    PREFIX + 'salud/salud-03-farmacia.png',
    PREFIX + 'salud/salud-04-dental.png',
    PREFIX + 'salud/salud-05-laboratorio.png',
    PREFIX + 'salud/salud-06-rehabilitacion.png',
    PREFIX + 'salud/salud-07-salud-mental.png',
    PREFIX + 'salud/salud-08-nutricion.png',
    PREFIX + 'salud/salud-09-pediatria.png',
    PREFIX + 'salud/salud-10-optica.png',
    PREFIX + 'salud/salud-11-emergencias.png',
    PREFIX + 'salud/salud-12-cuidado-adultos.png'
  ];

  var PROF_IMAGES = [
    PREFIX + 'profesionales/prof-01-abogados.png',
    PREFIX + 'profesionales/prof-02-contadores.png',
    PREFIX + 'profesionales/prof-03-arquitectos.png',
    PREFIX + 'profesionales/prof-04-consultoria.png',
    PREFIX + 'profesionales/prof-05-marketing.png',
    PREFIX + 'profesionales/prof-06-notaria.png',
    PREFIX + 'profesionales/prof-07-ingenieria.png',
    PREFIX + 'profesionales/prof-08-recursos-humanos.png',
    PREFIX + 'profesionales/prof-09-seguros.png',
    PREFIX + 'profesionales/prof-10-diseno.png',
    PREFIX + 'profesionales/prof-11-comercio-exterior.png',
    PREFIX + 'profesionales/prof-12-ambiental.png'
  ];

  var INMO_IMAGES = [
    PREFIX + 'bienes-raices/inmo-01-casa-venta.png',
    PREFIX + 'bienes-raices/inmo-02-casa-renta.png',
    PREFIX + 'bienes-raices/inmo-03-departamento.png',
    PREFIX + 'bienes-raices/inmo-04-terreno.png',
    PREFIX + 'bienes-raices/inmo-05-local-comercial.png',
    PREFIX + 'bienes-raices/inmo-06-oficina.png',
    PREFIX + 'bienes-raices/inmo-07-bodega.png',
    PREFIX + 'bienes-raices/inmo-08-desarrollo.png',
    PREFIX + 'bienes-raices/inmo-09-administracion.png'
  ];

  var TRANS_IMAGES = [
    PREFIX + 'transporte/trans-01-mudanza.png',
    PREFIX + 'transporte/trans-02-flete.png',
    PREFIX + 'transporte/trans-03-mensajeria.png',
    PREFIX + 'transporte/trans-04-paqueteria.png',
    PREFIX + 'transporte/trans-05-escolar.png',
    PREFIX + 'transporte/trans-06-camioneta.png',
    PREFIX + 'transporte/trans-07-almacenaje.png',
    PREFIX + 'transporte/trans-08-logistica.png'
  ];

  var EVT_IMAGES = [
    PREFIX + 'eventos/evt-01-salon.png',
    PREFIX + 'eventos/evt-02-animador.png',
    PREFIX + 'eventos/evt-03-dj.png',
    PREFIX + 'eventos/evt-04-banda.png',
    PREFIX + 'eventos/evt-05-catering.png',
    PREFIX + 'eventos/evt-06-mobiliario.png',
    PREFIX + 'eventos/evt-07-decoracion.png',
    PREFIX + 'eventos/evt-08-fotografia.png',
    PREFIX + 'eventos/evt-09-boda.png',
    PREFIX + 'eventos/evt-10-pinata.png'
  ];

  var COM_IMAGES = [
    PREFIX + 'comercio/com-01-abarrotes.png',
    PREFIX + 'comercio/com-02-zapateria.png',
    PREFIX + 'comercio/com-03-ropa.png',
    PREFIX + 'comercio/com-04-ferreteria.png',
    PREFIX + 'comercio/com-05-mayoreo.png',
    PREFIX + 'comercio/com-06-conveniencia.png',
    PREFIX + 'comercio/com-07-papeleria.png',
    PREFIX + 'comercio/com-08-distribuidora.png',
    PREFIX + 'comercio/com-09-farmacia-barrio.png'
  ];

  var HOG_IMAGES = [
    PREFIX + 'hogar/hog-01-plomero.png',
    PREFIX + 'hogar/hog-02-electricista.png',
    PREFIX + 'hogar/hog-03-pintor.png',
    PREFIX + 'hogar/hog-04-albanil.png',
    PREFIX + 'hogar/hog-05-carpintero.png',
    PREFIX + 'hogar/hog-06-herrero.png',
    PREFIX + 'hogar/hog-07-jardineria.png',
    PREFIX + 'hogar/hog-08-fumigacion.png',
    PREFIX + 'hogar/hog-09-limpieza.png',
    PREFIX + 'hogar/hog-10-mantenimiento.png'
  ];

  var AUTO_IMAGES = [
    PREFIX + 'automotriz/auto-01-taller.png',
    PREFIX + 'automotriz/auto-02-llantas.png',
    PREFIX + 'automotriz/auto-03-lote.png',
    PREFIX + 'automotriz/auto-04-agencia.png',
    PREFIX + 'automotriz/auto-05-refacciones.png',
    PREFIX + 'automotriz/auto-06-pintura.png',
    PREFIX + 'automotriz/auto-07-lavado.png',
    PREFIX + 'automotriz/auto-08-grua.png'
  ];

  var BIEN_IMAGES = [
    PREFIX + 'bienestar/bien-01-yoga.png',
    PREFIX + 'bienestar/bien-02-temazcal.png',
    PREFIX + 'bienestar/bien-03-reiki.png',
    PREFIX + 'bienestar/bien-04-acupuntura.png',
    PREFIX + 'bienestar/bien-05-herbolaria.png',
    PREFIX + 'bienestar/bien-06-masaje.png',
    PREFIX + 'bienestar/bien-07-retiro.png',
    PREFIX + 'bienestar/bien-08-aromaterapia.png',
    PREFIX + 'bienestar/bien-09-cristales.png',
    PREFIX + 'bienestar/bien-10-meditacion.png'
  ];

  var IND_IMAGES = [
    PREFIX + 'industria/ind-01-manufactura.png',
    PREFIX + 'industria/ind-02-maquinaria.png',
    PREFIX + 'industria/ind-03-mantenimiento.png',
    PREFIX + 'industria/ind-04-soldadura.png',
    PREFIX + 'industria/ind-05-empaque.png',
    PREFIX + 'industria/ind-06-corporativo.png',
    PREFIX + 'industria/ind-07-outsourcing.png',
    PREFIX + 'industria/ind-08-limpieza.png'
  ];

  var SECTOR_PNG = {
    adultos: 'img/home/sectores/sector-01-adultos.png',
    bienestar: 'img/home/sectores/sector-02-bienestar.png',
    salud: 'img/home/sectores/sector-03-salud.png',
    profesionales: 'img/home/sectores/sector-04-profesionales.png',
    automotriz: 'img/home/sectores/sector-05-automotriz.png',
    hogar: 'img/home/sectores/sector-06-hogar.png',
    comercio: 'img/home/sectores/sector-07-comercio.png',
    'bienes-raices': 'img/home/sectores/sector-08-bienes-raices.png',
    eventos: 'img/home/sectores/sector-09-eventos.png',
    transporte: 'img/home/sectores/sector-10-transporte.png',
    educacion: 'img/home/sectores/sector-11-educacion.png',
    tecnologia: 'img/home/sectores/sector-12-tecnologia.png',
    restaurantes: 'img/home/sectores/sector-13-restaurantes.png',
    mascotas: 'img/home/sectores/sector-14-mascotas.png',
    industria: 'img/home/sectores/sector-15-industria.png'
  };

  var SECTOR_EXCLUSIVE_POOL = {
    salud: SALUD_IMAGES,
    profesionales: PROF_IMAGES,
    'bienes-raices': INMO_IMAGES,
    transporte: TRANS_IMAGES,
    eventos: EVT_IMAGES,
    comercio: COM_IMAGES,
    hogar: HOG_IMAGES,
    automotriz: AUTO_IMAGES,
    bienestar: BIEN_IMAGES,
    industria: IND_IMAGES,
    tecnologia: [
      'img/home/sectores/sector-12-tecnologia.png',
      'img/home/hero-negocios-grid-noche.png',
      'img/registro-subcats/profesionales/prof-10-diseno.png',
      'img/registro-subcats/profesionales/prof-04-consultoria.png'
    ],
    mascotas: [
      'img/home/sectores/sector-14-mascotas.png'
    ],
    educacion: [
      'img/home/sectores/sector-11-educacion.png',
      'img/registro-subcats/profesionales/prof-04-consultoria.png',
      'img/home/hero-calle-negocios-dia.png'
    ],
    restaurantes: [
      'img/home/sectores/sector-13-restaurantes.png',
      'img/home/hero-antro-restaurante.png'
    ]
  };

  var SALUD_KEYWORD_RULES = [
    { re: /dental|dent|ortodon|laboratorios-dentales/, img: 3 },
    { re: /farmaci|oxigeno-medicinal/, img: 2 },
    { re: /laboratorio|diagnostico|imagen|ultrasonido|rayos|banco-de-sangre|equipo-medico|protesis|ortesis/, img: 4 },
    { re: /psicolog|psiquiatr|salud-mental|adiccion|lenguaje|aprendizaje/, img: 6 },
    { re: /nutriolog|nutric/, img: 7 },
    { re: /fisioter|quiropr|rehabilit|terapia/, img: 5 },
    { re: /pediatr|pediatria/, img: 8 },
    { re: /oftalmolog|optica|audiolog|auditivo/, img: 9 },
    { re: /ambulanc|traslado-medico|emergenc/, img: 10 },
    { re: /adultos-mayores|retiro|asilo|residencias-asistidas|enfermeria-a-domicilio|cuidado-de-adultos/, img: 11 },
    { re: /hospital|clinica|cirugia|fertilidad|funerari|medicina-estetica/, img: 1 },
    { re: /medico|doctor|especialista|ginecolog|urolog|dermatolog|cardiolog|ocupacional|seguro|gastos-medicos/, img: 0 }
  ];

  var PROF_KEYWORD_RULES = [
    { re: /abogad|juridic|despacho-juridico|perito/, img: 0 },
    { re: /contad|contable|fiscal|auditoria|financier|patrimonial|inversion/, img: 1 },
    { re: /arquitect|interiores|diseno-industrial|diseno-grafico|diseno-web|branding|fotografia|video|creativ/, img: 9 },
    { re: /ingenier|topograf|avaluo|certificacion|normativ|calidad|proteccion-civil/, img: 6 },
    { re: /notari|corredur|gestoria|tramite/, img: 5 },
    { re: /marketing|publicidad|agencia|relaciones-publicas|investigacion-de-mercados/, img: 4 },
    { re: /consultor|coaching|desarrollo-organizacional|franquicia|negocio/, img: 3 },
    { re: /recursos-humanos|reclutamiento|seleccion|estudios-socioeconomicos|capacitacion-empresarial/, img: 7 },
    { re: /seguro|agente-de-seguros/, img: 8 },
    { re: /comercio-internacional|importacion|exportacion|logistica-empresarial/, img: 10 },
    { re: /ambiental|responsabilidad-social/, img: 11 },
    { re: /traduccion|interpretacion/, img: 3 }
  ];

  var INMO_KEYWORD_RULES = [
    { re: /venta-de-casas/, img: 0 },
    { re: /renta-de-casas/, img: 1 },
    { re: /departamento/, img: 2 },
    { re: /terrenos/, img: 3 },
    { re: /locales-comerciales/, img: 4 },
    { re: /oficinas/, img: 5 },
    { re: /bodegas/, img: 6 },
    { re: /desarrollos/, img: 7 },
    { re: /administracion/, img: 8 }
  ];

  var TRANS_KEYWORD_RULES = [
    { re: /mudanzas/, img: 0 },
    { re: /fletes/, img: 1 },
    { re: /mensajeria/, img: 2 },
    { re: /paqueteria/, img: 3 },
    { re: /escolar/, img: 4 },
    { re: /camionetas/, img: 5 },
    { re: /almacenaje/, img: 6 },
    { re: /logistica/, img: 7 }
  ];

  var EVT_KEYWORD_RULES = [
    { re: /salones-de-eventos/, img: 0 },
    { re: /animadores/, img: 1 },
    { re: /djs/, img: 2 },
    { re: /grupos-musicales/, img: 3 },
    { re: /catering/, img: 4 },
    { re: /mobiliario/, img: 5 },
    { re: /decoracion/, img: 6 },
    { re: /fotografia-de-eventos/, img: 7 },
    { re: /organizacion-de-bodas|bodas/, img: 8 },
    { re: /pinatas|festejos/, img: 9 }
  ];

  var COM_KEYWORD_RULES = [
    { re: /abarrotes/, img: 0 },
    { re: /zapaterias/, img: 1 },
    { re: /ropa/, img: 2 },
    { re: /ferreterias/, img: 3 },
    { re: /mayoreo/, img: 4 },
    { re: /conveniencia/, img: 5 },
    { re: /papelerias/, img: 6 },
    { re: /distribuidoras/, img: 7 },
    { re: /farmacias-de-barrio/, img: 8 }
  ];

  var HOG_KEYWORD_RULES = [
    { re: /plomeros/, img: 0 },
    { re: /electricistas/, img: 1 },
    { re: /pintores/, img: 2 },
    { re: /albaniles/, img: 3 },
    { re: /carpinteros/, img: 4 },
    { re: /herreros/, img: 5 },
    { re: /jardineria/, img: 6 },
    { re: /fumigacion/, img: 7 },
    { re: /limpieza-del-hogar/, img: 8 },
    { re: /mantenimiento-general/, img: 9 }
  ];

  var AUTO_KEYWORD_RULES = [
    { re: /talleres-mecanicos/, img: 0 },
    { re: /vulcanizadoras/, img: 1 },
    { re: /lotes-de-autos/, img: 2 },
    { re: /agencias-de-autos/, img: 3 },
    { re: /refaccionarias/, img: 4 },
    { re: /hojalateria|pintura/, img: 5 },
    { re: /lavado-de-autos/, img: 6 },
    { re: /gruas|auxilio-vial/, img: 7 }
  ];

  var BIEN_KEYWORD_RULES = [
    { re: /temazcal/, img: 1 },
    { re: /yoga|pilates/, img: 0 },
    { re: /meditacion|breathwork/, img: 9 },
    { re: /reiki|energet|biomagnetismo|limpi/, img: 2 },
    { re: /acupuntura|medicina-tradicional-china|ayurveda/, img: 3 },
    { re: /herbol|herbolaria|naturista|naturalista|suplementos|incienso|aceites-esenciales|productos-natur/, img: 4 },
    { re: /masaje/, img: 5 },
    { re: /retiro|turismo-espiritual|chamanismo|ceremonias|ancestral/, img: 6 },
    { re: /aromaterapia|sonoterapia/, img: 7 },
    { re: /tarot|astrolog|numerolog|runas|esoter|cristalo|feng-shui|holistic|sanacion|centro/, img: 8 },
    { re: /coaching|desarrollo-personal|crecimiento-personal/, img: 0 }
  ];

  var IND_KEYWORD_RULES = [
    { re: /manufactura/, img: 0 },
    { re: /maquinaria/, img: 1 },
    { re: /mantenimiento-industrial/, img: 2 },
    { re: /soldadura/, img: 3 },
    { re: /empaques|embalaje/, img: 4 },
    { re: /servicios-corporativos/, img: 5 },
    { re: /outsourcing/, img: 6 },
    { re: /limpieza-industrial/, img: 7 }
  ];

  var SECTOR_KEYWORD_RULES = {
    salud: SALUD_KEYWORD_RULES,
    profesionales: PROF_KEYWORD_RULES,
    'bienes-raices': INMO_KEYWORD_RULES,
    transporte: TRANS_KEYWORD_RULES,
    eventos: EVT_KEYWORD_RULES,
    comercio: COM_KEYWORD_RULES,
    hogar: HOG_KEYWORD_RULES,
    automotriz: AUTO_KEYWORD_RULES,
    bienestar: BIEN_KEYWORD_RULES,
    industria: IND_KEYWORD_RULES
  };

  var POS_VARIANTS = [
    'center', 'top center', 'center 25%', 'center 40%',
    'top 20%', 'center 60%', 'left center', 'right center'
  ];

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function mobPath(src) {
    if (/registro-subcats\//.test(src)) return src;
    return String(src).replace('/sectores/', '/sectores/mob/').replace(/\.png$/i, '.jpg');
  }

  function hashStr(s) {
    var h = 0;
    var i;
    s = String(s || '');
    for (i = 0; i < s.length; i++) {
      h = ((h << 5) - h) + s.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }

  function imageFromRules(subcatId, pool, rules) {
    var id = String(subcatId || '').toLowerCase();
    var i;
    for (i = 0; i < rules.length; i++) {
      if (rules[i].re.test(id)) {
        return pool[rules[i].img % pool.length];
      }
    }
    return null;
  }

  function buildImagePool(sectorId) {
    if (SECTOR_EXCLUSIVE_POOL[sectorId]) {
      return SECTOR_EXCLUSIVE_POOL[sectorId].slice();
    }
    var pool = [];
    if (SECTOR_PNG[sectorId]) pool.push(SECTOR_PNG[sectorId]);
    return pool.length ? pool : [SECTOR_PNG.salud];
  }

  function imageForSubcat(sectorId, subcatId, index) {
    var pool = buildImagePool(sectorId);
    var rules = SECTOR_KEYWORD_RULES[sectorId];
    var mapped = rules ? imageFromRules(subcatId, pool, rules) : null;
    if (mapped) return mapped;
    var h = hashStr(sectorId + ':' + subcatId);
    return pool[(h + ((index || 0) * 11)) % pool.length];
  }

  function pickSrc(path) {
    if (global.matchMedia && global.matchMedia('(max-width: 768px)').matches) {
      return mobPath(path);
    }
    return path;
  }

  function thumbHtml(src, subcatId) {
    var png = esc(src);
    var pos = POS_VARIANTS[hashStr(subcatId) % POS_VARIANTS.length];
    return (
      '<img class="rp-sector-card__img" src="' + esc(pickSrc(src)) + '" data-fallback="' + png + '" alt="" ' +
      'loading="lazy" decoding="async" style="object-position:' + pos + '" ' +
      'onerror="if(this.dataset.fallback){this.src=this.dataset.fallback;this.removeAttribute(\'data-fallback\')}">'
    );
  }

  function cardHtml(cat, selectedId, sectorId, index) {
    var selected = String(cat.id) === String(selectedId);
    var img = imageForSubcat(sectorId, cat.id, index);
    return (
      '<li role="presentation">' +
        '<button type="button" class="ch-geo-card rp-subcat-card' + (selected ? ' is-selected' : '') + '" ' +
          'role="option" data-cat-id="' + esc(cat.id) + '" aria-selected="' + (selected ? 'true' : 'false') + '">' +
          '<span class="ch-geo-card__thumb">' + thumbHtml(img, cat.id) + '</span>' +
          '<span class="ch-geo-card__body">' +
            '<span class="ch-geo-card__text">' +
              '<p class="ch-geo-card__title">' + esc(cat.nombre) + '</p>' +
            '</span>' +
            '<span class="ch-geo-card__go" aria-hidden="true">' + ICON_GO + '</span>' +
          '</span>' +
        '</button>' +
      '</li>'
    );
  }

  function layoutClass() {
    return 'rp-subcat-geo-list rp-subcat-geo-list--scroll';
  }

  function renderList(container, items, opts) {
    opts = opts || {};
    if (!container || !items || !items.length) return;
    var sectorId = opts.sectorId || 'salud';
    container.className = layoutClass();
    container.innerHTML = items.map(function (cat, index) {
      return cardHtml(cat, opts.selectedId, sectorId, index);
    }).join('');

    container.querySelectorAll('.rp-subcat-card').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var catId = btn.getAttribute('data-cat-id');
        var cat = items.find(function (c) { return c.id === catId; });
        if (cat && typeof opts.onSelect === 'function') opts.onSelect(cat);
      });
    });
  }

  global.CariHubSectorSubcatPicker = {
    renderList: renderList,
    imageForSubcat: imageForSubcat,
    layoutClass: layoutClass
  };
})(typeof window !== 'undefined' ? window : globalThis);
