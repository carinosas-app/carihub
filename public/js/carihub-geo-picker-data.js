/**
 * Metadatos visuales geo picker — banderas, estados MX y ciudades representativas.
 */
(function (global) {
  'use strict';

  var FLAGS = {
    'México': '🇲🇽',
    'Estados Unidos': '🇺🇸',
    'Colombia': '🇨🇴',
    'Canadá': '🇨🇦',
    'España': '🇪🇸',
    'Perú': '🇵🇪',
    'Chile': '🇨🇱',
    'Argentina': '🇦🇷',
    'Brasil': '🇧🇷',
    'Reino Unido': '🇬🇧',
    'Australia': '🇦🇺',
    'Francia': '🇫🇷',
    'Alemania': '🇩🇪',
    'Italia': '🇮🇹',
    'Portugal': '🇵🇹',
    'Venezuela': '🇻🇪',
    'Ecuador': '🇪🇨',
    'Uruguay': '🇺🇾',
    'Paraguay': '🇵🇾',
    'Bolivia': '🇧🇴',
    'Panamá': '🇵🇦',
    'Costa Rica': '🇨🇷',
    'Guatemala': '🇬🇹',
    'Cuba': '🇨🇺',
    'República Dominicana': '🇩🇴',
    'Puerto Rico': '🇵🇷'
  };

  var FLAG_ISO = {
    'México': 'mx',
    'Estados Unidos': 'us',
    'Colombia': 'co',
    'Canadá': 'ca',
    'España': 'es',
    'Perú': 'pe',
    'Chile': 'cl',
    'Argentina': 'ar',
    'Brasil': 'br',
    'Reino Unido': 'gb',
    'Australia': 'au',
    'Francia': 'fr',
    'Alemania': 'de',
    'Italia': 'it',
    'Portugal': 'pt',
    'Venezuela': 've',
    'Ecuador': 'ec',
    'Uruguay': 'uy',
    'Paraguay': 'py',
    'Bolivia': 'bo',
    'Panamá': 'pa',
    'Costa Rica': 'cr',
    'Guatemala': 'gt',
    'Cuba': 'cu',
    'República Dominicana': 'do',
    'Puerto Rico': 'pr',
    'Afganistán': 'af', 'Albania': 'al', 'Andorra': 'ad', 'Angola': 'ao',
    'Arabia Saudita': 'sa', 'Argelia': 'dz', 'Armenia': 'am', 'Austria': 'at',
    'Azerbaiyán': 'az', 'Bahamas': 'bs', 'Bangladés': 'bd', 'Baréin': 'bh',
    'Bélgica': 'be', 'Belice': 'bz', 'Benín': 'bj', 'Bielorrusia': 'by',
    'Bosnia y Herzegovina': 'ba', 'Botsuana': 'bw', 'Brunéi': 'bn', 'Bulgaria': 'bg',
    'Burkina Faso': 'bf', 'Burundi': 'bi', 'Bután': 'bt', 'Cabo Verde': 'cv',
    'Camboya': 'kh', 'Camerún': 'cm', 'Catar': 'qa', 'Chad': 'td', 'China': 'cn',
    'Chipre': 'cy', 'Comoras': 'km', 'Corea del Norte': 'kp', 'Corea del Sur': 'kr',
    'Costa de Marfil': 'ci', 'Croacia': 'hr', 'Dinamarca': 'dk', 'Dominica': 'dm',
    'Egipto': 'eg', 'El Salvador': 'sv', 'Emiratos Árabes Unidos': 'ae', 'Eritrea': 'er',
    'Eslovaquia': 'sk', 'Eslovenia': 'si', 'Estonia': 'ee', 'Esuatini': 'sz',
    'Etiopía': 'et', 'Fiji': 'fj', 'Filipinas': 'ph', 'Finlandia': 'fi', 'Gabón': 'ga',
    'Gambia': 'gm', 'Georgia': 'ge', 'Ghana': 'gh', 'Granada': 'gd', 'Grecia': 'gr',
    'Guinea': 'gn', 'Guinea-Bisáu': 'gw', 'Guinea Ecuatorial': 'gq', 'Guyana': 'gy',
    'Haití': 'ht', 'Honduras': 'hn', 'Hungría': 'hu', 'India': 'in', 'Indonesia': 'id',
    'Irak': 'iq', 'Irán': 'ir', 'Irlanda': 'ie', 'Islandia': 'is', 'Israel': 'il',
    'Jamaica': 'jm', 'Japón': 'jp', 'Jordania': 'jo', 'Kazajistán': 'kz', 'Kenia': 'ke',
    'Kirguistán': 'kg', 'Kiribati': 'ki', 'Kuwait': 'kw', 'Laos': 'la', 'Lesoto': 'ls',
    'Letonia': 'lv', 'Líbano': 'lb', 'Liberia': 'lr', 'Libia': 'ly', 'Liechtenstein': 'li',
    'Lituania': 'lt', 'Luxemburgo': 'lu', 'Madagascar': 'mg', 'Malasia': 'my',
    'Malaui': 'mw', 'Maldivas': 'mv', 'Malí': 'ml', 'Malta': 'mt', 'Marruecos': 'ma',
    'Mauricio': 'mu', 'Mauritania': 'mr', 'Micronesia': 'fm', 'Moldavia': 'md',
    'Mónaco': 'mc', 'Mongolia': 'mn', 'Montenegro': 'me', 'Mozambique': 'mz',
    'Myanmar': 'mm', 'Namibia': 'na', 'Nauru': 'nr', 'Nepal': 'np', 'Nicaragua': 'ni',
    'Níger': 'ne', 'Nigeria': 'ng', 'Noruega': 'no', 'Nueva Zelanda': 'nz', 'Omán': 'om',
    'Países Bajos': 'nl', 'Pakistán': 'pk', 'Palaos': 'pw',
    'Papúa Nueva Guinea': 'pg', 'Polonia': 'pl',
    'República Centroafricana': 'cf', 'República Checa': 'cz',
    'República Democrática del Congo': 'cd', 'República del Congo': 'cg',
    'Ruanda': 'rw', 'Rumanía': 'ro', 'Rusia': 'ru', 'Samoa': 'ws',
    'San Cristóbal y Nieves': 'kn', 'San Marino': 'sm',
    'San Vicente y las Granadinas': 'vc', 'Santa Lucía': 'lc',
    'Santo Tomé y Príncipe': 'st', 'Senegal': 'sn', 'Serbia': 'rs', 'Seychelles': 'sc',
    'Sierra Leona': 'sl', 'Singapur': 'sg', 'Siria': 'sy', 'Somalia': 'so',
    'Sri Lanka': 'lk', 'Sudáfrica': 'za', 'Sudán': 'sd', 'Sudán del Sur': 'ss',
    'Suecia': 'se', 'Suiza': 'ch', 'Surinam': 'sr', 'Tailandia': 'th', 'Tanzania': 'tz',
    'Tayikistán': 'tj', 'Timor Oriental': 'tl', 'Togo': 'tg', 'Tonga': 'to',
    'Trinidad y Tobago': 'tt', 'Túnez': 'tn', 'Turkmenistán': 'tm', 'Turquía': 'tr',
    'Tuvalu': 'tv', 'Ucrania': 'ua', 'Uganda': 'ug', 'Uzbekistán': 'uz',
    'Vanuatu': 'vu', 'Vaticano': 'va', 'Vietnam': 'vn', 'Yemen': 'ye', 'Yibuti': 'dj',
    'Zambia': 'zm', 'Zimbabue': 'zw'
  };

  var LOCAL_FLAG_FILES = {
    ar: 'img/flags/ar.svg', au: 'img/flags/au.svg', bo: 'img/flags/bo.svg',
    br: 'img/flags/br.svg', ca: 'img/flags/ca.svg', cl: 'img/flags/cl.svg',
    co: 'img/flags/co.svg', cr: 'img/flags/cr.svg', cu: 'img/flags/cu.svg',
    de: 'img/flags/de.svg', do: 'img/flags/do.svg', ec: 'img/flags/ec.svg',
    es: 'img/flags/es.svg', fr: 'img/flags/fr.svg', gb: 'img/flags/gb.svg',
    gt: 'img/flags/gt.svg', it: 'img/flags/it.svg', mx: 'img/flags/mx.png',
    pa: 'img/flags/pa.svg', pe: 'img/flags/pe.svg', pr: 'img/flags/pr.svg',
    pt: 'img/flags/pt.svg', py: 'img/flags/py.svg', us: 'img/flags/us.svg',
    uy: 'img/flags/uy.svg', ve: 'img/flags/ve.svg'
  };

  var POPULAR_PERFILES = {
    'México': 15000,
    'Estados Unidos': 8000,
    'Colombia': 4000,
    'Canadá': 2500,
    'España': 3200,
    'Perú': 1800,
    'Chile': 1600,
    'Argentina': 2100,
    'Brasil': 2900
  };

  var STATE_PERFILES = {
    'Nuevo León': 3200,
    'CDMX': 8500,
    'Ciudad de México': 8500,
    'Jalisco': 2800,
    'Baja California': 1900,
    'Puebla': 1200
  };

  var CITY_PERFILES = {
    'Monterrey': 1200,
    'San Nicolás': 680,
    'Apodaca': 540,
    'Guadalupe': 490,
    'Escobedo': 420,
    'García': 380,
    'Juárez': 350
  };

  var STATE_CAPITAL = {
    'Aguascalientes': 'Aguascalientes',
    'Baja California': 'Mexicali',
    'Baja California Sur': 'La Paz',
    'Campeche': 'Campeche',
    'Chiapas': 'Tuxtla Gutiérrez',
    'Chihuahua': 'Chihuahua',
    'CDMX': 'Ciudad de México',
    'Ciudad de México': 'Ciudad de México',
    'Coahuila': 'Saltillo',
    'Colima': 'Colima',
    'Durango': 'Durango',
    'Estado de México': 'Toluca',
    'Guanajuato': 'León',
    'Guerrero': 'Chilpancingo',
    'Hidalgo': 'Pachuca',
    'Jalisco': 'Guadalajara',
    'Michoacán': 'Morelia',
    'Morelos': 'Cuernavaca',
    'Nayarit': 'Tepic',
    'Nuevo León': 'Monterrey',
    'Oaxaca': 'Oaxaca',
    'Puebla': 'Puebla',
    'Querétaro': 'Querétaro',
    'Quintana Roo': 'Cancún',
    'San Luis Potosí': 'San Luis Potosí',
    'Sinaloa': 'Culiacán',
    'Sonora': 'Hermosillo',
    'Tabasco': 'Villahermosa',
    'Tamaulipas': 'Ciudad Victoria',
    'Tlaxcala': 'Tlaxcala',
    'Veracruz': 'Xalapa',
    'Yucatán': 'Mérida',
    'Zacatecas': 'Zacatecas',
    'Texas': 'Austin',
    'California': 'Sacramento',
    'Florida': 'Tallahassee',
    'New York': 'Albany'
  };

  var IMAGES = global.CariHubGeoImages || null;

  var DISPLAY_NAMES = {
    'CDMX': 'Ciudad de México'
  };

  function hashName(name) {
    var n = 0;
    var s = String(name || '');
    for (var i = 0; i < s.length; i++) n += s.charCodeAt(i);
    return n;
  }

  function displayName(name) {
    return DISPLAY_NAMES[name] || name;
  }

  function flagFor(name) {
    return FLAGS[name] || '🌎';
  }

  function flagImageUrl(name) {
    if (IMAGES && IMAGES.flagImage) {
      var localNamed = IMAGES.flagImage(name);
      if (localNamed) return localNamed;
    }
    var iso = FLAG_ISO[name];
    if (!iso) return '';
    if (LOCAL_FLAG_FILES[iso]) return LOCAL_FLAG_FILES[iso];
    return 'https://flagcdn.com/w80/' + iso + '.png';
  }

  function formatPerfiles(n, plus) {
    n = Math.max(0, Math.round(n));
    var txt = n.toLocaleString('es-MX');
    if (plus) return '+' + txt + ' perfiles';
    return txt + ' perfiles';
  }

  function stubPerfiles(name, seed) {
    seed = seed || 0;
    if (STATE_PERFILES[name]) return STATE_PERFILES[name];
    if (CITY_PERFILES[name]) return CITY_PERFILES[name];
    if (POPULAR_PERFILES[name]) return POPULAR_PERFILES[name];
    return 800 + ((hashName(name) + seed) % 38) * 95;
  }

  var COUNTRY_DIVISION_COUNTS = {
    'México': 32,
    'Estados Unidos': 50,
    'Colombia': 32,
    'Canadá': 13,
    'España': 17
  };

  function divisionCount(pais, fallback) {
    if (COUNTRY_DIVISION_COUNTS[pais] != null) return COUNTRY_DIVISION_COUNTS[pais];
    return fallback;
  }

  function divisionWord(pais) {
    if (pais === 'Colombia') return 'departamentos';
    if (pais === 'Canadá') return 'provincias';
    if (pais === 'España') return 'comunidades';
    return 'estados';
  }

  function imageFor(tipo, name, pais) {
    if (tipo === 'pais') {
      var flagImg = flagImageUrl(name);
      if (flagImg) return flagImg;
      return '';
    }
    if (tipo === 'estado' && IMAGES && IMAGES.stateImage) {
      return IMAGES.stateImage(pais || '', name);
    }
    if (tipo === 'ciudad' && IMAGES && IMAGES.cityImage) {
      return IMAGES.cityImage(pais || '', name);
    }
    return 'img/home/promo-perfil.jpg';
  }

  function thumbClassFor(tipo, name) {
    if (tipo === 'pais' && flagImageUrl(name)) return 'ch-geo-card__thumb--flag-real';
    return '';
  }

  function capitalFor(estado) {
    return STATE_CAPITAL[estado] || estado;
  }

  global.CariHubGeoPickerData = {
    flagFor: flagFor,
    flagImageUrl: flagImageUrl,
    thumbClassFor: thumbClassFor,
    formatPerfiles: formatPerfiles,
    stubPerfiles: stubPerfiles,
    divisionWord: divisionWord,
    imageFor: imageFor,
    capitalFor: capitalFor,
    divisionCount: divisionCount,
    displayName: displayName,
    POPULAR_PERFILES: POPULAR_PERFILES
  };
})(typeof window !== 'undefined' ? window : globalThis);
