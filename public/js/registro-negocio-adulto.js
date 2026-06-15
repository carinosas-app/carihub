/**
 * Registro de negocios / locales — categorías adultas Cariñosas.
 * Una plantilla de formulario; la ficha varía por arquetipo.
 */
(function (global) {
  'use strict';

  var MAP = {
    spa: {
      arquetipo: 'bienestar',
      tipoPerfil: 'negocio',
      subcategoriaId: 'spa',
      tipoNegocio: 'Centro de bienestar',
      svcTitulo: 'Servicios del menú',
      noTitulo: 'No incluye'
    },
    masajes: {
      arquetipo: 'bienestar',
      tipoPerfil: 'negocio',
      subcategoriaId: 'masajes',
      tipoNegocio: 'Centro de masajes',
      svcTitulo: 'Servicios del menú',
      noTitulo: 'No incluye'
    },
    'sex shop': {
      arquetipo: 'retail',
      tipoPerfil: 'negocio',
      subcategoriaId: 'sex_shop',
      tipoNegocio: 'Tienda especializada',
      svcTitulo: 'Categorías de productos',
      noTitulo: 'Políticas'
    },
    swinger: {
      arquetipo: 'venue',
      tipoPerfil: 'lugar',
      subcategoriaId: 'club_sw',
      tipoNegocio: 'Club lifestyle',
      svcTitulo: 'Áreas del local',
      noTitulo: 'Reglas del local'
    },
    'hotel / motel': {
      arquetipo: 'hospedaje',
      tipoPerfil: 'lugar',
      subcategoriaId: 'hotel_motel',
      tipoNegocio: 'Hospedaje por horas',
      svcTitulo: 'Tipos de habitación',
      noTitulo: 'No permite'
    },
    'antro / bar': {
      arquetipo: 'venue',
      tipoPerfil: 'lugar',
      subcategoriaId: 'antro',
      tipoNegocio: 'Antro / Bar',
      svcTitulo: 'Áreas del local',
      noTitulo: 'Reglas del local'
    }
  };

  var ALIASES = {
    spa: 'spa',
    'sex shop': 'sex shop',
    swinger: 'swinger',
    'hotel / motel': 'hotel / motel',
    'antro / bar': 'antro / bar',
    masajes: 'masajes'
  };

  /** Etiqueta pública en perfil/resultados — nunca “Entretenimiento para adultos”. */
  var ETIQUETAS = {
    spa: 'Spa',
    masajes: 'Masajes',
    'sex shop': 'Sex shop',
    swinger: 'Club Swinger',
    'hotel / motel': 'Hotel',
    'antro / bar': 'Antro / Bar'
  };

  function norm(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/[🍍🦄🔥]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function claveCategoria(categoria) {
    var n = norm(categoria);
    if (ALIASES[n]) return ALIASES[n];
    if (n.indexOf('sex shop') !== -1 || n === 'sexshop') return 'sex shop';
    if (n.indexOf('swinger') !== -1 || n.indexOf('club sw') !== -1) return 'swinger';
    if (n.indexOf('hotel') !== -1 || n.indexOf('motel') !== -1) return 'hotel / motel';
    if (n.indexOf('antro') !== -1 || n.indexOf('bar') !== -1) return 'antro / bar';
    if (n.indexOf('spa') !== -1) return 'spa';
    if (n.indexOf('masaje') !== -1) return 'masajes';
    return null;
  }

  function meta(categoria) {
    var k = claveCategoria(categoria);
    return k ? MAP[k] : null;
  }

  function esNegocio(categoria) {
    return !!meta(categoria);
  }

  function categoriaEtiqueta(categoria, perfil) {
    if (perfil && perfil.categoriaPublica) {
      return String(perfil.categoriaPublica).trim();
    }
    var k = claveCategoria(categoria);
    if (k === 'hotel / motel' && perfil) {
      var tn = norm(perfil.tipoNegocio || '');
      var nom = norm(perfil.nombreComercial || perfil.nombre || '');
      if (tn.indexOf('motel') !== -1 || nom.indexOf('motel') !== -1) return 'Motel';
      if (tn.indexOf('hotel') !== -1) return 'Hotel';
    }
    if (k && ETIQUETAS[k]) return ETIQUETAS[k];
    return String(categoria || '')
      .replace(/[🍍🦄🔥]/g, '')
      .trim() || 'Negocio';
  }

  function esNegocioPerfil(u) {
    if (!u) return false;
    if (u.tipoCuenta === 'negocio') return true;
    if (u.tipoPerfil === 'negocio' || u.tipoPerfil === 'lugar') return true;
    return !!meta(u.categoria);
  }

  function el(id) {
    return document.getElementById(id);
  }

  function show(id, on) {
    var node = el(id);
    if (node) node.hidden = !on;
  }

  function setPlaceholder(id, text) {
    var node = el(id);
    if (node) node.placeholder = text;
  }

  function lineasTexto(id) {
    var v = (el(id) && el(id).value) || '';
    return v
      .split(/\r?\n/)
      .map(function (s) { return s.trim(); })
      .filter(Boolean);
  }

  function listaComas(id) {
    var v = (el(id) && el(id).value) || '';
    return v
      .split(/[,;]/)
      .map(function (s) { return s.trim(); })
      .filter(Boolean);
  }

  function renderExtra(arquetipo) {
    var box = el('regNegocioExtra');
    if (!box) return;
    var html = '';
    if (arquetipo === 'hospedaje') {
      html =
        '<input id="tiposHabitacion" placeholder="Tipos de habitación (ej. Suite estándar, Suite jacuzzi)">' +
        '<input id="tarifaHora" placeholder="Tarifa por hora (ej. $450 MXN)">' +
        '<input id="tarifaNoche" placeholder="Tarifa por noche (opcional)">';
    } else if (arquetipo === 'retail') {
      html =
        '<input id="categoriasProducto" placeholder="Categorías de productos (ej. Lencería, Juguetes)">' +
        '<div class="modalidad-checks">' +
        '<label><input type="checkbox" id="envioDomicilio"> Envío a domicilio</label>' +
        '<label><input type="checkbox" id="tiendaOnline"> Tienda en línea</label>' +
        '</div>';
    } else if (arquetipo === 'venue') {
      html =
        '<input id="precioEntrada" placeholder="Precio de entrada / cover (ej. $600 MXN)">' +
        '<input id="dressCode" placeholder="Dress code (ej. Elegante casual)">' +
        '<input id="reglasAcceso" placeholder="Reglas de acceso">' +
        '<input id="areasVenue" placeholder="Áreas del local (salón, bar, privados…)">' +
        '<input id="politicaParejas" placeholder="Política parejas / singles (opcional)">';
    } else {
      html = '<p class="reg-ayuda">Completa servicios, amenidades y horario de tu local.</p>';
    }
    box.innerHTML = html;
  }

  function aplicarUI(categoria) {
    var m = meta(categoria);
    var neg = !!m;
    show('regPersonaS1', !neg);
    show('regNegocioS1', neg);
    show('regPersonaS2', !neg);
    show('regNegocioS2', neg);
    show('regNegocioS3', neg);

    var h1 = document.querySelector('#step1 h2');
    var h2 = document.querySelector('#step2 h2');
    var h3 = document.querySelector('#step3 h2');
    if (h1) h1.textContent = neg ? 'Datos del negocio' : 'Datos básicos';
    if (h2) h2.textContent = neg ? 'Información del local' : 'Información de tu página';
    if (h3) h3.textContent = neg ? 'Verificación del negocio' : 'Verificación y consentimiento';

    setPlaceholder('nombre', neg ? 'Nombre comercial del local' : 'Nombre o alias');
    setPlaceholder('descripcionCompleta', neg ? 'Sobre nosotros — descripción del negocio' : 'Sobre mí — descripción completa de tu perfil');
    setPlaceholder('precio', neg ? 'Precio desde o entrada (ej. 800)' : 'Precio desde (ej. 2,000 MXN)');

    var disp = el('disponibilidad');
    if (disp && neg) {
      if (!disp.querySelector('option[value="Abierto ahora"]')) {
        var opt = document.createElement('option');
        opt.value = 'Abierto ahora';
        opt.textContent = 'Abierto ahora';
        disp.insertBefore(opt, disp.firstChild);
      }
      disp.value = 'Abierto ahora';
    }

    if (neg && el('tipoNegocio') && m.tipoNegocio) {
      if (!el('tipoNegocio').value.trim()) el('tipoNegocio').value = m.tipoNegocio;
    }

    if (neg) renderExtra(m.arquetipo);
  }

  function validarPaso1() {
    var campos = ['nombre', 'email', 'password', 'telefono', 'pais', 'estado', 'ciudad', 'categoria', 'tagline', 'precio'];
    var i;
    for (i = 0; i < campos.length; i++) {
      if (!el(campos[i]) || !el(campos[i]).value.trim()) {
        alert('Completa todos los datos.');
        return false;
      }
    }
    if (el('tagline').value.trim().length > 80) {
      alert('La frase corta máximo 80 caracteres.');
      return false;
    }
    if (el('password').value.length < 6) {
      alert('La contraseña debe tener mínimo 6 caracteres.');
      return false;
    }
    if (el('tipoNegocio') && !el('tipoNegocio').value.trim()) {
      alert('Indica el tipo de negocio.');
      return false;
    }
    return true;
  }

  function validarPaso1Persona() {
    if (!el('edad') || !el('edad').value.trim()) {
      alert('Completa todos los datos.');
      return false;
    }
    var edad = parseInt(el('edad').value, 10);
    if (isNaN(edad) || edad < 18) {
      alert('La edad debe ser 18 años o más.');
      return false;
    }
    return true;
  }

  function validarPaso2() {
    if (!el('descripcionCompleta') || !el('descripcionCompleta').value.trim()) {
      alert('Completa la descripción del negocio.');
      return false;
    }
    if (!el('horario') || !el('horario').value.trim()) {
      alert('Indica el horario de atención.');
      return false;
    }
    if (!el('zona') || !el('zona').value.trim()) {
      alert('Indica la zona o referencia.');
      return false;
    }
    if (!el('direccion') || !el('direccion').value.trim()) {
      alert('La dirección del local es obligatoria.');
      return false;
    }
    if (lineasTexto('serviciosIncluidos').length === 0) {
      alert('Agrega al menos un servicio o producto (uno por línea).');
      return false;
    }
    var m = meta(el('categoria').value);
    if (!m) return true;
    if (m.arquetipo === 'hospedaje') {
      if (!el('tiposHabitacion') || !el('tiposHabitacion').value.trim()) {
        alert('Indica los tipos de habitación.');
        return false;
      }
      if (!el('tarifaHora') || !el('tarifaHora').value.trim()) {
        alert('Indica la tarifa por hora.');
        return false;
      }
    }
    if (m.arquetipo === 'retail') {
      if (!el('categoriasProducto') || !el('categoriasProducto').value.trim()) {
        alert('Indica las categorías de productos.');
        return false;
      }
    }
    if (m.arquetipo === 'venue') {
      if (!el('reglasAcceso') || !el('reglasAcceso').value.trim()) {
        alert('Indica las reglas de acceso del local.');
        return false;
      }
    }
    return true;
  }

  function armarPayload() {
    var cat = el('categoria').value.trim();
    var m = meta(cat);
    if (!m) return {};

    var servicios = lineasTexto('serviciosIncluidos');
    var noLista = lineasTexto('noRealiza');
    var amen = listaComas('amenidades');
    var nombre = el('nombre').value.trim();

    var out = {
      tipoCuenta: 'negocio',
      tipoPerfil: m.tipoPerfil,
      arquetipo: m.arquetipo,
      subcategoriaId: m.subcategoriaId,
      categoria: cat,
      categoriaPublica: categoriaEtiqueta(cat, {
        tipoNegocio: (el('tipoNegocio') && el('tipoNegocio').value.trim()) || m.tipoNegocio,
        nombreComercial: nombre
      }),
      nombreComercial: nombre,
      alias: nombre,
      tipoNegocio: (el('tipoNegocio') && el('tipoNegocio').value.trim()) || m.tipoNegocio,
      tagline: el('tagline').value.trim(),
      descripcion: el('tagline').value.trim(),
      descripcionCompleta: el('descripcionCompleta').value.trim(),
      sobreNosotros: el('descripcionCompleta').value.trim(),
      direccion: el('direccion').value.trim(),
      zona: el('zona').value.trim(),
      horario: el('horario').value.trim(),
      horarioDetalle: el('horario').value.trim(),
      precio: el('precio').value.trim(),
      precioDesde: el('precio').value.trim(),
      disponibilidad: el('disponibilidad').value.trim(),
      serviciosIncluidos: servicios,
      servicios: servicios.join(', '),
      noRealiza: noLista,
      amenidades: amen,
      svcTitulo: m.svcTitulo,
      noTitulo: m.noTitulo,
      geo: {
        pais: el('pais').value.trim(),
        estado: el('estado').value.trim(),
        ciudad: el('ciudad').value.trim(),
        zona: el('zona').value.trim()
      }
    };

    if (m.arquetipo === 'bienestar') {
      out.menuServicios = servicios;
    }
    if (m.arquetipo === 'hospedaje') {
      out.tiposHabitacion = el('tiposHabitacion') ? el('tiposHabitacion').value.trim() : '';
      out.tarifaHora = el('tarifaHora') ? el('tarifaHora').value.trim() : '';
      out.tarifaNoche = el('tarifaNoche') ? el('tarifaNoche').value.trim() : '';
    }
    if (m.arquetipo === 'retail') {
      out.categoriasProducto = el('categoriasProducto') ? el('categoriasProducto').value.trim() : '';
      out.envioDomicilio = !!(el('envioDomicilio') && el('envioDomicilio').checked);
      out.tiendaOnline = !!(el('tiendaOnline') && el('tiendaOnline').checked);
    }
    if (m.arquetipo === 'venue') {
      out.precioEntrada = el('precioEntrada') ? el('precioEntrada').value.trim() : '';
      out.dressCode = el('dressCode') ? el('dressCode').value.trim() : '';
      out.reglasAcceso = el('reglasAcceso') ? el('reglasAcceso').value.trim() : '';
      out.areasVenue = el('areasVenue') ? el('areasVenue').value.trim() : '';
      out.politicaParejas = el('politicaParejas') ? el('politicaParejas').value.trim() : '';
    }

    if (el('razonSocial') && el('razonSocial').value.trim()) {
      out.razonSocial = el('razonSocial').value.trim();
    }
    if (el('rfc') && el('rfc').value.trim()) {
      out.rfc = el('rfc').value.trim();
    }

    return out;
  }

  function aplicarEdicion(u) {
    var neg = esNegocioPerfil(u);
    show('editPersona', !neg);
    show('editNegocio', neg);
    if (!neg) return;

    if (el('editTipoNegocio')) el('editTipoNegocio').value = u.tipoNegocio || '';
    if (el('editDireccion')) el('editDireccion').value = u.direccion || '';
    if (el('editSobreNosotros')) el('editSobreNosotros').value = u.sobreNosotros || u.descripcionCompleta || '';
    if (el('editServiciosLista')) {
      el('editServiciosLista').value = (u.serviciosIncluidos || []).join('\n');
    }
    if (el('editNoRealiza')) {
      el('editNoRealiza').value = (u.noRealiza || []).join('\n');
    }
    if (el('editAmenidades')) {
      el('editAmenidades').value = (u.amenidades || []).join(', ');
    }
  }

  function validarEdicion() {
    if (!el('editTagline') || !el('editTagline').value.trim()) {
      alert('Escribe la frase corta para resultados.');
      return false;
    }
    if (el('editDireccion') && !el('editDireccion').value.trim()) {
      alert('La dirección es obligatoria.');
      return false;
    }
    if (el('editServiciosLista') && lineasTexto('editServiciosLista').length === 0) {
      alert('Agrega al menos un servicio o producto.');
      return false;
    }
    return true;
  }

  function armarPayloadEdicion() {
    var servicios = lineasTexto('editServiciosLista');
    var tag = el('editTagline').value.trim();
    return {
      tagline: tag,
      descripcion: tag,
      precio: el('editPrecio').value.trim(),
      precioDesde: el('editPrecio').value.trim(),
      disponibilidad: el('editDisponibilidad').value.trim(),
      horario: el('editHorario').value.trim(),
      horarioDetalle: el('editHorario').value.trim(),
      zona: el('editZona').value.trim(),
      direccion: el('editDireccion') ? el('editDireccion').value.trim() : '',
      tipoNegocio: el('editTipoNegocio') ? el('editTipoNegocio').value.trim() : '',
      sobreNosotros: el('editSobreNosotros') ? el('editSobreNosotros').value.trim() : '',
      descripcionCompleta: el('editSobreNosotros') ? el('editSobreNosotros').value.trim() : '',
      serviciosIncluidos: servicios,
      servicios: servicios.join(', '),
      noRealiza: lineasTexto('editNoRealiza'),
      amenidades: listaComas('editAmenidades')
    };
  }

  function amenidadChipsHTML(u) {
    var list = u.amenidades || [];
    if (!list.length) return '';
    return list.map(function (a) {
      return '<span class="modchip">✨ ' + String(a).replace(/</g, '&lt;') + '</span>';
    }).join('');
  }

  global.RegistroNegocioAdulto = {
    MAP: MAP,
    ETIQUETAS: ETIQUETAS,
    meta: meta,
    esNegocio: esNegocio,
    esNegocioPerfil: esNegocioPerfil,
    categoriaEtiqueta: categoriaEtiqueta,
    aplicarUI: aplicarUI,
    validarPaso1: validarPaso1,
    validarPaso1Persona: validarPaso1Persona,
    validarPaso2: validarPaso2,
    armarPayload: armarPayload,
    aplicarEdicion: aplicarEdicion,
    validarEdicion: validarEdicion,
    armarPayloadEdicion: armarPayloadEdicion,
    amenidadChipsHTML: amenidadChipsHTML
  };
})(typeof window !== 'undefined' ? window : this);
