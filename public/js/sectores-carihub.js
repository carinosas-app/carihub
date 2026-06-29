(function () {
  'use strict';

  function slug(texto) {
    return String(texto || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function subs(nombres) {
    return nombres.map(function (nombre) {
      if (nombre && typeof nombre === 'object' && nombre.id && nombre.nombre) {
        return { id: nombre.id, nombre: nombre.nombre };
      }
      return { id: slug(nombre), nombre: nombre };
    });
  }

  var BIENESTAR = subs([
    'Temazcales',
    'Centros Holísticos',
    'Centros de Bienestar',
    'Centros de Meditación',
    'Centros de Yoga',
    'Centros de Sanación',
    'Retiros Espirituales',
    'Turismo Espiritual',
    'Medicina Ancestral',
    'Chamanismo',
    'Ceremonias Tradicionales',
    'Terapias Holísticas',
    'Reiki',
    'Biomagnetismo',
    'Acupuntura',
    'Aromaterapia',
    'Sonoterapia',
    'Terapias Energéticas',
    'Terapias Alternativas',
    'Medicina Natural',
    'Naturopatía',
    'Herbolaria',
    'Ayurveda',
    'Medicina Tradicional China',
    'Flores de Bach',
    'Homeopatía',
    'Masajes Holísticos',
    'Masajes Relajantes',
    'Masajes Terapéuticos',
    'Yoga',
    'Pilates',
    'Meditación',
    'Breathwork',
    'Coaching de Vida',
    'Coaching Espiritual',
    'Desarrollo Personal',
    'Crecimiento Personal',
    'Tarot',
    'Astrología',
    'Numerología',
    'Lectura de Cartas',
    'Lectura de Runas',
    'Feng Shui',
    'Limpias Energéticas',
    'Cristaloterapia',
    'Tiendas Esotéricas',
    'Productos Holísticos',
    'Productos Naturistas',
    'Suplementos Naturales',
    'Herbolarios',
    'Naturistas',
    { id: 'ceremonias-ayahuasca-rape-plantas-de-poder', nombre: 'Ceremonias de Ayahuasca, Rapé y Plantas de Poder' },
    'Cacao Ceremonial',
    'Reflexología',
    'Registros Akáshicos',
    'Cosmética Natural',
    'Velas Esotéricas',
    'Sahumerios',
    'Venta de Inciensos',
    'Venta de Aceites Esenciales'
  ]);

  var SALUD = subs([
    'Médicos Generales',
    'Especialistas Médicos',
    'Dentistas y Clínicas Dentales',
    'Psicólogos',
    'Psiquiatras',
    'Nutriólogos',
    'Fisioterapeutas',
    'Quiroprácticos',
    'Oftalmología y Ópticas',
    'Audiología y Aparatos Auditivos',
    'Ginecología y Obstetricia',
    'Urología',
    'Pediatría',
    'Dermatología',
    'Cardiología',
    'Cirugía General',
    'Cirugía Plástica y Estética',
    'Medicina Estética',
    'Clínicas Médicas',
    'Hospitales Privados',
    'Laboratorios Clínicos',
    'Estudios de Diagnóstico e Imagen',
    'Ultrasonidos y Rayos X',
    'Ambulancias y Traslado Médico',
    'Enfermería a Domicilio',
    'Cuidado de Adultos Mayores',
    'Rehabilitación Física',
    'Terapias de Lenguaje',
    'Terapias de Aprendizaje',
    'Centros de Rehabilitación',
    'Centros de Salud Mental',
    'Clínicas de Adicciones',
    'Clínicas de Fertilidad',
    'Bancos de Sangre',
    'Farmacias',
    'Farmacias Especializadas',
    'Equipo Médico',
    'Prótesis y Ortesis',
    'Oxígeno Medicinal',
    'Laboratorios Dentales',
    'Salud Ocupacional',
    'Medicina del Trabajo',
    'Seguridad e Higiene Industrial',
    'Exámenes Médicos para Empresas',
    'Servicios Médicos Empresariales',
    'Seguros Médicos',
    'Gastos Médicos Mayores',
    'Servicios Funerarios',
    'Casas de Retiro',
    'Asilos y Residencias Asistidas'
  ]);

  var PROFESIONALES = subs([
    'Abogados',
    'Despachos Jurídicos',
    'Contadores',
    'Despachos Contables',
    'Asesoría Fiscal',
    'Auditoría',
    'Notarías',
    'Corredurías Públicas',
    'Gestoría y Trámites',
    'Arquitectos',
    'Despachos de Arquitectura',
    'Ingenieros',
    'Despachos de Ingeniería',
    'Topografía',
    'Avalúos',
    'Peritos',
    'Consultoría Empresarial',
    'Consultoría Financiera',
    'Consultoría de Negocios',
    'Recursos Humanos',
    'Reclutamiento y Selección',
    'Estudios Socioeconómicos',
    'Capacitación Empresarial',
    'Coaching Ejecutivo',
    'Traducción e Interpretación',
    'Marketing y Publicidad',
    'Agencias de Marketing',
    'Diseño Gráfico',
    'Diseño Industrial',
    'Diseño de Interiores',
    'Branding e Identidad Corporativa',
    'Fotografía Profesional',
    'Producción de Video',
    'Relaciones Públicas',
    'Investigación de Mercados',
    'Desarrollo Organizacional',
    'Franquicias',
    'Seguros',
    'Agentes de Seguros',
    'Asesoría Patrimonial',
    'Asesoría en Inversiones',
    'Comercio Internacional',
    'Importación y Exportación',
    'Logística Empresarial',
    'Certificaciones y Normatividad',
    'Seguridad e Higiene',
    'Protección Civil Empresarial',
    'Gestión de Calidad',
    'Consultoría Ambiental',
    'Responsabilidad Social Empresarial'
  ]);

  var SECTORES = [
    {
      id: 'adultos',
      emoji: '🔥',
      nombre: 'Adultos y Entretenimiento para Adultos',
      fuente: 'catalogo-adultos',
      panelClass: 'home-field__sector-panel--adultos',
      bgWords: ['Spa', 'Motel', 'Cariñosas', 'Antro']
    },
    {
      id: 'bienestar',
      emoji: '🌿',
      nombre: 'Bienestar, Espiritualidad y Terapias Alternativas',
      subcategorias: BIENESTAR,
      panelClass: 'home-field__sector-panel--bienestar',
      bgWords: ['Temazcal', 'Ayahuasca', 'Reiki', 'Yoga']
    },
    {
      id: 'salud',
      emoji: '🏥',
      nombre: 'Salud y Bienestar',
      subcategorias: SALUD,
      panelClass: 'home-field__sector-panel--salud',
      bgWords: ['Dentista', 'Psicólogo', 'Cirujano', 'Médico']
    },
    {
      id: 'profesionales',
      emoji: '⚖️',
      nombre: 'Servicios Profesionales',
      subcategorias: PROFESIONALES,
      panelClass: 'home-field__sector-panel--prof',
      bgWords: ['Abogado', 'Contador', 'Arquitecto', 'Notaría']
    },
    {
      id: 'automotriz',
      emoji: '🚗',
      nombre: 'Vehículos y Servicios Automotrices',
      subcategorias: subs([
        'Talleres Mecánicos',
        'Vulcanizadoras',
        'Lotes de Autos',
        'Agencias de Autos',
        'Refaccionarias',
        'Hojalatería y Pintura',
        'Lavado de Autos',
        'Grúas y Auxilio Vial'
      ]),
      panelClass: 'home-field__sector-panel--auto',
      bgWords: ['Mecánico', 'Llantas', 'Refacciones', 'Grúa']
    },
    {
      id: 'hogar',
      emoji: '🏠',
      nombre: 'Hogar, Construcción y Mantenimiento',
      subcategorias: subs([
        'Plomeros',
        'Electricistas',
        'Pintores',
        'Albañiles',
        'Carpinteros',
        'Herreros',
        'Jardinería',
        'Fumigación',
        'Limpieza del Hogar',
        'Mantenimiento General'
      ]),
      panelClass: 'home-field__sector-panel--hogar',
      bgWords: ['Plomero', 'Pintor', 'Electricista', 'Albañil']
    },
    {
      id: 'comercio',
      emoji: '🛒',
      nombre: 'Comercio, Tiendas y Distribución',
      subcategorias: subs([
        'Abarrotes',
        'Zapaterías',
        'Tiendas de Ropa',
        'Farmacias de Barrio',
        'Papelerías',
        'Ferreterías',
        'Distribuidoras',
        'Mayoreo',
        'Tiendas de Conveniencia'
      ]),
      panelClass: 'home-field__sector-panel--comercio',
      bgWords: ['Abarrotes', 'Zapatería', 'Mayoreo', 'Tienda']
    },
    {
      id: 'bienes-raices',
      emoji: '🏘️',
      nombre: 'Bienes Raíces',
      subcategorias: subs([
        'Venta de Casas',
        'Renta de Casas',
        'Venta de Departamentos',
        'Renta de Departamentos',
        'Terrenos',
        'Locales Comerciales',
        'Oficinas',
        'Bodegas Industriales',
        'Desarrollos Inmobiliarios',
        'Administración de Propiedades'
      ]),
      panelClass: 'home-field__sector-panel--bienes',
      bgWords: ['Renta', 'Venta', 'Departamento', 'Casa']
    },
    {
      id: 'eventos',
      emoji: '🎉',
      nombre: 'Eventos, Espectáculos y Fiestas',
      subcategorias: subs([
        'Espacios para Eventos',
        'Organizadores y Producción de Eventos',
        'Decoración y Ambientación',
        'Fotografía y Video para Eventos',
        'DJ\'s para Eventos',
        'Grupos Musicales para Eventos',
        'Animadores y Maestros de Ceremonia',
        'Shows para Eventos',
        'Banquetes y Catering',
        'Renta de Mobiliario',
        'Renta de Equipo (Audio, Iluminación, Escenarios)',
        'Food Trucks y Carritos',
        'Pasteles y Repostería para Eventos',
        'Invitaciones y Papelería',
        'Florerías para Eventos',
        'Pirotecnia y Efectos Especiales',
        'Seguridad para Eventos',
        'Valet Parking',
        'Transporte para Eventos',
        'Renta de Vestuario y Disfraces',
      ]),
      panelClass: 'home-field__sector-panel--eventos',
      bgWords: ['Salón', 'DJ', 'Boda', 'Fiesta']
    },
    {
      id: 'transporte',
      emoji: '🚚',
      nombre: 'Transporte, Logística y Mensajería',
      subcategorias: subs([
        'Mudanzas',
        'Fletes',
        'Mensajería',
        'Paquetería',
        'Transporte Escolar',
        'Renta de Camionetas',
        'Logística Local',
        'Almacenaje'
      ]),
      panelClass: 'home-field__sector-panel--transporte',
      bgWords: ['Mudanza', 'Flete', 'Mensajería', 'Paquetería']
    },
    {
      id: 'educacion',
      emoji: '🎓',
      nombre: 'Educación y Capacitación',
      subcategorias: subs([
        'Escuelas',
        'Universidades',
        'Cursos en Línea',
        'Clases Particulares',
        'Idiomas',
        'Capacitación Técnica',
        'Preparatoria',
        'Guarderías',
        'Talleres Creativos'
      ]),
      panelClass: 'home-field__sector-panel--edu',
      bgWords: ['Cursos', 'Escuela', 'Idiomas', 'Taller']
    },
    {
      id: 'tecnologia',
      emoji: '💻',
      nombre: 'Tecnología y Servicios Digitales',
      subcategorias: subs([
        'Desarrollo de Software',
        'Soporte TI',
        'Reparación de Computadoras',
        'Redes y Telecomunicaciones',
        'Diseño Web',
        'Marketing Digital',
        'Ciberseguridad',
        'Venta de Equipo de Cómputo'
      ]),
      panelClass: 'home-field__sector-panel--tech',
      bgWords: ['Software', 'Soporte TI', 'Redes', 'Web']
    },
    {
      id: 'restaurantes',
      emoji: '🍔',
      nombre: 'Restaurantes, Gastronomía y Bebidas',
      subcategorias: subs([
        'Restaurantes Tradicional',
        'Marisquerías',
        'Cocina Económica',
        'Taquerías',
        'Hamburgueserías',
        'Pizzerías',
        'Pollerías y Alitas',
        'Sushi y Cocina Asiática',
        'Carnes Asadas y Parrilla',
        'Cafeterías',
        'Panaderías',
        'Pastelerías y Repostería',
        'Neverías y Heladerías',
        'Juguerías',
        'Food Trucks Gastronomía',
        'Comida a Domicilio',
        'Dark Kitchen',
        'Bares',
        'Cervecerías',
        'Cantinas y Vinotecas',
        'Buffet y Comedor',
        'Chef y Cocinero a Domicilio',
        'Bartender a Domicilio',
        'Distribuidoras Alimentos y Bebidas',
      ]),
      panelClass: 'home-field__sector-panel--restaurantes',
      bgWords: ['Restaurante', 'Bar', 'Café', 'Antro']
    },
    {
      id: 'mascotas',
      emoji: '🐾',
      nombre: 'Mascotas y Servicios Veterinarios',
      subcategorias: subs([
        'Veterinarias',
        'Clínicas Veterinarias',
        'Peluquería Canina',
        'Pet Shop',
        'Adiestramiento',
        'Pensiones para Mascotas',
        'Guardería de Mascotas',
        'Crematorio de Mascotas'
      ]),
      panelClass: 'home-field__sector-panel--mascotas',
      bgWords: ['Veterinaria', 'Pet Shop', 'Mascotas', 'Adiestramiento']
    },
    {
      id: 'industria',
      emoji: '🏭',
      nombre: 'Industria y Servicios Empresariales',
      subcategorias: subs([
        'Manufactura',
        'Maquinaria Industrial',
        'Mantenimiento Industrial',
        'Soldadura Industrial',
        'Empaques y Embalaje',
        'Servicios Corporativos',
        'Outsourcing',
        'Limpieza Industrial'
      ]),
      panelClass: 'home-field__sector-panel--industria',
      bgWords: ['Industria', 'Maquinaria', 'Planta', 'Corporativo']
    }
  ];

  function sectorPorId(id) {
    return SECTORES.find(function (s) { return s.id === id; }) || null;
  }

  function subcategoriasDeSector(sectorId) {
    var sector = sectorPorId(sectorId);
    if (!sector) return [];
    if (sector.fuente === 'catalogo-adultos' && window.CATALOGO_CATEGORIAS_CARIHUB) {
      return window.CATALOGO_CATEGORIAS_CARIHUB.filter(function (c) {
        return !window.CariHubSubcategoriaLabels || !CariHubSubcategoriaLabels.ocultaEnRegistro(c.id);
      }).map(function (c) {
        return { id: c.id, nombre: c.nombre, emoji: c.emoji };
      });
    }
    return sector.subcategorias || [];
  }

  window.CARIHUB_SECTORES = SECTORES;
  window.CariHubSectores = {
    sectores: function () { return SECTORES.map(function (s) { return Object.assign({}, s); }); },
    sectorPorId: sectorPorId,
    subcategoriasDeSector: subcategoriasDeSector,
    slug: slug
  };
})();
