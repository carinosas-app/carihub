/** Países visibles en el geo picker (excluye lista legal/compliance). */
const PAISES_EXCLUIDOS = new Set([
  'Arabia Saudita', 'Irán', 'Irak', 'Kuwait', 'Catar', 'Emiratos Árabes Unidos', 'Omán', 'Yemen',
  'Afganistán', 'Pakistán', 'Bangladés', 'Malasia', 'Indonesia', 'Brunéi',
  'Sudán', 'Somalia', 'Libia',
  'India', 'Turquía', 'Singapur', 'Tailandia', 'Filipinas', 'Corea del Sur'
]);

function filtrarPaises(lista) {
  return lista.filter(function (p) { return !PAISES_EXCLUIDOS.has(p); });
}

const PAISES_PRINCIPALES = filtrarPaises([
  'México', 'Estados Unidos', 'Colombia', 'Canadá', 'España',
  'Perú', 'Chile', 'Argentina', 'Uruguay', 'Brasil', 'Reino Unido', 'Australia', 'Francia'
]);

const TODOS_LOS_PAISES = filtrarPaises([
  'Afganistán', 'Albania', 'Alemania', 'Andorra', 'Angola', 'Argelia', 'Argentina',
  'Armenia', 'Australia', 'Austria', 'Azerbaiyán', 'Bahamas', 'Baréin', 'Bélgica',
  'Belice', 'Benín', 'Bielorrusia', 'Bolivia', 'Bosnia y Herzegovina', 'Botsuana', 'Brasil',
  'Bulgaria', 'Burkina Faso', 'Burundi', 'Bután', 'Cabo Verde', 'Camboya', 'Camerún',
  'Canadá', 'Chad', 'Chile', 'China', 'Chipre', 'Colombia', 'Comoras', 'Corea del Norte',
  'Costa de Marfil', 'Costa Rica', 'Croacia', 'Cuba', 'Dinamarca', 'Dominica',
  'Ecuador', 'Egipto', 'El Salvador', 'Eritrea', 'Eslovaquia',
  'Eslovenia', 'España', 'Estados Unidos', 'Estonia', 'Esuatini', 'Etiopía', 'Fiji',
  'Finlandia', 'Francia', 'Gabón', 'Gambia', 'Georgia', 'Ghana', 'Granada', 'Grecia', 'Guatemala',
  'Guinea', 'Guinea-Bisáu', 'Guinea Ecuatorial', 'Guyana', 'Haití', 'Honduras', 'Hungría',
  'Irlanda', 'Islandia', 'Israel', 'Italia', 'Jamaica', 'Japón',
  'Jordania', 'Kazajistán', 'Kenia', 'Kirguistán', 'Kiribati', 'Laos', 'Lesoto',
  'Letonia', 'Líbano', 'Liberia', 'Liechtenstein', 'Lituania', 'Luxemburgo',
  'Madagascar', 'Malaui', 'Maldivas', 'Malí', 'Malta', 'Marruecos', 'Mauricio',
  'Mauritania', 'México', 'Micronesia', 'Moldavia', 'Mónaco', 'Mongolia', 'Montenegro',
  'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Nicaragua', 'Níger', 'Nigeria',
  'Noruega', 'Nueva Zelanda', 'Países Bajos', 'Palaos', 'Panamá',
  'Papúa Nueva Guinea', 'Paraguay', 'Perú', 'Polonia', 'Portugal', 'Reino Unido',
  'República Centroafricana', 'República Checa', 'República Democrática del Congo',
  'República del Congo', 'República Dominicana', 'Ruanda', 'Rumanía', 'Rusia', 'Samoa',
  'San Cristóbal y Nieves', 'San Marino', 'San Vicente y las Granadinas', 'Santa Lucía',
  'Santo Tomé y Príncipe', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leona',
  'Siria', 'Sri Lanka', 'Sudáfrica', 'Sudán del Sur', 'Suecia', 'Suiza',
  'Surinam', 'Tanzania', 'Tayikistán', 'Timor Oriental', 'Togo', 'Tonga',
  'Trinidad y Tobago', 'Túnez', 'Turkmenistán', 'Tuvalu', 'Ucrania', 'Uganda',
  'Uruguay', 'Uzbekistán', 'Vanuatu', 'Vaticano', 'Venezuela', 'Vietnam', 'Yibuti',
  'Zambia', 'Zimbabue'
]);
