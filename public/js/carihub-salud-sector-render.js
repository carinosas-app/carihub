/**
 * Render Preview + Ficha — sector Salud packs A–H (MP-SALUD-DELTAS-V1 Fase 3).
 * Fuente: scripts/salud-packs-v1.mjs + salud-sub-deltas-v1.mjs
 * Regenerar: node scripts/build-carihub-salud-sector-render.mjs
 */
(function (global) {
  'use strict';

  var PREVIEW_FICHA = {
  "medicos-generales": {
    "chips": [
      "especialidad",
      "subespecialidad",
      "serviciosProfesionales"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "especialidad",
      "subespecialidad",
      "serviciosProfesionales",
      "segurosAceptados",
      "consultaEnLinea",
      "precioConsulta",
      "unidadConsulta",
      "horarioAtencion",
      "modalidadAtencionProfesional",
      "idiomasAtencion",
      "diferenciadorSalud",
      "referenciasInterconsulta",
      "coberturaAtencionSalud"
    ],
    "faq": [
      "segurosAceptados",
      "consultaEnLinea",
      "coberturaAtencionSalud"
    ]
  },
  "especialistas-medicos": {
    "chips": [
      "especialidad",
      "subespecialidad",
      "serviciosProfesionales"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "especialidad",
      "subespecialidad",
      "serviciosProfesionales",
      "segurosAceptados",
      "consultaEnLinea",
      "precioConsulta",
      "unidadConsulta",
      "horarioAtencion",
      "modalidadAtencionProfesional",
      "hospitalAfiliacion",
      "idiomasAtencion",
      "diferenciadorSalud",
      "referenciasInterconsulta",
      "coberturaAtencionSalud"
    ],
    "faq": [
      "segurosAceptados",
      "consultaEnLinea",
      "coberturaAtencionSalud"
    ]
  },
  "dentistas-y-clinicas-dentales": {
    "chips": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadConsulta"
    ],
    "rows": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud",
      "atencionDomicilioSalud",
      "serviciosDentales",
      "equipamientoDental",
      "atencionOdontopediatria",
      "urgenciasDentales",
      "tipoEstablecimientoDental",
      "diferenciadorSalud",
      "referenciasInterconsulta",
      "coberturaAtencionSalud"
    ],
    "faq": [
      "segurosAceptadosSalud",
      "coberturaAtencionSalud"
    ]
  },
  "psicologos": {
    "chips": [
      "especialidad",
      "subespecialidad",
      "serviciosProfesionales"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "especialidad",
      "subespecialidad",
      "serviciosProfesionales",
      "segurosAceptados",
      "consultaEnLinea",
      "precioConsulta",
      "unidadConsulta",
      "horarioAtencion",
      "modalidadAtencionProfesional",
      "poblacionAtendida",
      "enfoqueTerapeutico",
      "diferenciadorSalud",
      "referenciasInterconsulta",
      "coberturaAtencionSalud"
    ],
    "faq": [
      "segurosAceptados",
      "consultaEnLinea",
      "coberturaAtencionSalud"
    ]
  },
  "psiquiatras": {
    "chips": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadConsulta"
    ],
    "rows": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud",
      "atencionDomicilioSalud",
      "poblacionAtendida",
      "prescripcionMedicamentos",
      "diferenciadorSalud",
      "referenciasInterconsulta"
    ],
    "faq": [
      "segurosAceptadosSalud"
    ]
  },
  "nutriologos": {
    "chips": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadConsulta"
    ],
    "rows": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud",
      "atencionDomicilioSalud",
      "objetivosNutricion",
      "planesAlimenticios",
      "diferenciadorSalud",
      "referenciasInterconsulta",
      "coberturaAtencionSalud"
    ],
    "faq": [
      "segurosAceptadosSalud",
      "coberturaAtencionSalud"
    ]
  },
  "fisioterapeutas": {
    "chips": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadConsulta"
    ],
    "rows": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud",
      "atencionDomicilioSalud",
      "areasFisioterapia",
      "equipamientoFisioterapia",
      "diferenciadorSalud",
      "referenciasInterconsulta",
      "coberturaAtencionSalud"
    ],
    "faq": [
      "segurosAceptadosSalud",
      "coberturaAtencionSalud"
    ]
  },
  "quiropracticos": {
    "chips": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadConsulta"
    ],
    "rows": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud",
      "atencionDomicilioSalud",
      "tecnicasQuiropracticas",
      "diferenciadorSalud",
      "referenciasInterconsulta"
    ],
    "faq": [
      "segurosAceptadosSalud"
    ]
  },
  "oftalmologia-y-opticas": {
    "chips": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadConsulta"
    ],
    "rows": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud",
      "atencionDomicilioSalud",
      "serviciosOftalmologia",
      "ventaLentes",
      "diferenciadorSalud",
      "referenciasInterconsulta"
    ],
    "faq": [
      "segurosAceptadosSalud"
    ]
  },
  "audiologia-y-aparatos-auditivos": {
    "chips": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadConsulta"
    ],
    "rows": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud",
      "atencionDomicilioSalud",
      "serviciosAudiologia",
      "marcasAudifonos",
      "diferenciadorSalud",
      "referenciasInterconsulta"
    ],
    "faq": [
      "segurosAceptadosSalud"
    ]
  },
  "ginecologia-y-obstetricia": {
    "chips": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadConsulta"
    ],
    "rows": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud",
      "atencionDomicilioSalud",
      "serviciosGinecologia",
      "atencionParto",
      "diferenciadorSalud",
      "referenciasInterconsulta"
    ],
    "faq": [
      "segurosAceptadosSalud"
    ]
  },
  "urologia": {
    "chips": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadConsulta"
    ],
    "rows": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud",
      "atencionDomicilioSalud",
      "procedimientosUrologia",
      "diferenciadorSalud",
      "referenciasInterconsulta"
    ],
    "faq": [
      "segurosAceptadosSalud"
    ]
  },
  "pediatria": {
    "chips": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadConsulta"
    ],
    "rows": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud",
      "atencionDomicilioSalud",
      "edadesAtendidasPediatria",
      "vacunacionInfantil",
      "diferenciadorSalud",
      "referenciasInterconsulta"
    ],
    "faq": [
      "segurosAceptadosSalud"
    ]
  },
  "dermatologia": {
    "chips": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadConsulta"
    ],
    "rows": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud",
      "atencionDomicilioSalud",
      "procedimientosDermatologia",
      "diferenciadorSalud",
      "referenciasInterconsulta"
    ],
    "faq": [
      "segurosAceptadosSalud"
    ]
  },
  "cardiologia": {
    "chips": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadConsulta"
    ],
    "rows": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud",
      "atencionDomicilioSalud",
      "estudiosCardiologia",
      "diferenciadorSalud",
      "referenciasInterconsulta"
    ],
    "faq": [
      "segurosAceptadosSalud"
    ]
  },
  "cirugia-general": {
    "chips": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadConsulta"
    ],
    "rows": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud",
      "atencionDomicilioSalud",
      "procedimientosCirugia",
      "diferenciadorSalud",
      "referenciasInterconsulta"
    ],
    "faq": [
      "segurosAceptadosSalud"
    ]
  },
  "cirugia-plastica-y-estetica": {
    "chips": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadConsulta"
    ],
    "rows": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud",
      "atencionDomicilioSalud",
      "procedimientosEsteticos",
      "cirugiaAmbulatoriaEstetica",
      "diferenciadorSalud",
      "referenciasInterconsulta"
    ],
    "faq": [
      "segurosAceptadosSalud"
    ]
  },
  "medicina-estetica": {
    "chips": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadConsulta"
    ],
    "rows": [
      "especialidadServicio",
      "modalidadConsulta",
      "segurosAceptadosSalud",
      "atencionDomicilioSalud",
      "tratamientosEsteticos",
      "equipamientoEstetico",
      "diferenciadorSalud",
      "referenciasInterconsulta"
    ],
    "faq": [
      "segurosAceptadosSalud"
    ]
  },
  "clinicas-medicas": {
    "chips": [
      "serviciosClinica",
      "especialidadesClinica",
      "urgencias24h"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "serviciosClinica",
      "especialidadesClinica",
      "urgencias24h",
      "especialidadesDisponiblesClinica",
      "estacionamientoClinica",
      "diferenciadorSalud"
    ],
    "faq": [
      "urgencias24h"
    ]
  },
  "hospitales-privados": {
    "chips": [
      "serviciosHospital",
      "nivelesAtencion",
      "serviciosResidencia"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "serviciosHospital",
      "nivelesAtencion",
      "serviciosResidencia",
      "serviciosFunerarios",
      "capacidadResidentes",
      "camasHospital",
      "quirfanosHospital",
      "diferenciadorSalud"
    ],
    "faq": []
  },
  "laboratorios-clinicos": {
    "chips": [
      "estudiosOfrecidos",
      "tiempoEntregaResultados",
      "tomaMuestrasDomicilio"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "estudiosOfrecidos",
      "tiempoEntregaResultados",
      "tomaMuestrasDomicilio",
      "requiereAyuno",
      "citaPreviaLab",
      "diferenciadorSalud"
    ],
    "faq": []
  },
  "estudios-de-diagnostico-e-imagen": {
    "chips": [
      "estudiosOfrecidos",
      "tiempoEntregaResultados",
      "tomaMuestrasDomicilio"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "estudiosOfrecidos",
      "tiempoEntregaResultados",
      "tomaMuestrasDomicilio",
      "equipamientoImagen",
      "citaPreviaLab",
      "diferenciadorSalud"
    ],
    "faq": []
  },
  "ultrasonidos-y-rayos-x": {
    "chips": [
      "estudiosOfrecidos",
      "tiempoEntregaResultados",
      "tomaMuestrasDomicilio"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "estudiosOfrecidos",
      "tiempoEntregaResultados",
      "tomaMuestrasDomicilio",
      "diferenciadorSalud"
    ],
    "faq": []
  },
  "ambulancias-y-traslado-medico": {
    "chips": [
      "modalidadTraslado",
      "coberturaEmergencias",
      "serviciosProfesionales"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "modalidadTraslado",
      "coberturaEmergencias",
      "serviciosProfesionales",
      "horarioAtencion",
      "precioConsulta",
      "tiempoRespuestaEmergencia",
      "diferenciadorSalud"
    ],
    "faq": []
  },
  "enfermeria-a-domicilio": {
    "chips": [
      "serviciosCuidado",
      "atencionDomicilioSalud",
      "coberturaDomicilioZona"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "serviciosCuidado",
      "atencionDomicilioSalud",
      "coberturaDomicilioZona",
      "certificacionEnfermeria",
      "turnosEnfermeria",
      "diferenciadorSalud"
    ],
    "faq": []
  },
  "cuidado-de-adultos-mayores": {
    "chips": [
      "serviciosCuidado",
      "atencionDomicilioSalud",
      "coberturaDomicilioZona"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "serviciosCuidado",
      "atencionDomicilioSalud",
      "coberturaDomicilioZona",
      "tipoCuidadoAdultoMayor",
      "turnosCuidado",
      "diferenciadorSalud"
    ],
    "faq": []
  },
  "rehabilitacion-fisica": {
    "chips": [
      "serviciosCuidado",
      "atencionDomicilioSalud",
      "coberturaDomicilioZona"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "serviciosCuidado",
      "atencionDomicilioSalud",
      "coberturaDomicilioZona",
      "areasRehabilitacion",
      "diferenciadorSalud"
    ],
    "faq": []
  },
  "terapias-de-lenguaje": {
    "chips": [
      "serviciosCuidado",
      "atencionDomicilioSalud",
      "coberturaDomicilioZona"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "serviciosCuidado",
      "atencionDomicilioSalud",
      "coberturaDomicilioZona",
      "poblacionLenguaje",
      "diferenciadorSalud"
    ],
    "faq": []
  },
  "terapias-de-aprendizaje": {
    "chips": [
      "serviciosCuidado",
      "atencionDomicilioSalud",
      "coberturaDomicilioZona"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "serviciosCuidado",
      "atencionDomicilioSalud",
      "coberturaDomicilioZona",
      "areasAprendizaje",
      "diferenciadorSalud"
    ],
    "faq": []
  },
  "centros-de-rehabilitacion": {
    "chips": [
      "serviciosClinica",
      "especialidadesClinica",
      "urgencias24h"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "serviciosClinica",
      "especialidadesClinica",
      "urgencias24h",
      "tiposRehabilitacionCentro",
      "diferenciadorSalud"
    ],
    "faq": [
      "urgencias24h"
    ]
  },
  "centros-de-salud-mental": {
    "chips": [
      "serviciosClinica",
      "especialidadesClinica",
      "urgencias24h"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "serviciosClinica",
      "especialidadesClinica",
      "urgencias24h",
      "serviciosSaludMentalCentro",
      "modalidadCentroSaludMental",
      "diferenciadorSalud"
    ],
    "faq": [
      "urgencias24h"
    ]
  },
  "clinicas-de-adicciones": {
    "chips": [
      "serviciosClinica",
      "especialidadesClinica",
      "urgencias24h"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "serviciosClinica",
      "especialidadesClinica",
      "urgencias24h",
      "programasAdicciones",
      "internamientoAdicciones",
      "diferenciadorSalud"
    ],
    "faq": [
      "urgencias24h"
    ]
  },
  "clinicas-de-fertilidad": {
    "chips": [
      "serviciosClinica",
      "especialidadesClinica",
      "urgencias24h"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "serviciosClinica",
      "especialidadesClinica",
      "urgencias24h",
      "tratamientosFertilidad",
      "diferenciadorSalud"
    ],
    "faq": [
      "urgencias24h"
    ]
  },
  "bancos-de-sangre": {
    "chips": [
      "estudiosOfrecidos",
      "tiempoEntregaResultados",
      "tomaMuestrasDomicilio"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "estudiosOfrecidos",
      "tiempoEntregaResultados",
      "tomaMuestrasDomicilio",
      "tipoDonacionSangre",
      "diferenciadorSalud"
    ],
    "faq": []
  },
  "farmacias": {
    "chips": [
      "categoriasFarmacia",
      "surtidoFarmaceutico",
      "ventaConReceta"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "categoriasFarmacia",
      "surtidoFarmaceutico",
      "ventaConReceta",
      "serviciosFarmacia",
      "entregaDomicilioFarmacia",
      "diferenciadorSalud"
    ],
    "faq": []
  },
  "farmacias-especializadas": {
    "chips": [
      "categoriasFarmacia",
      "surtidoFarmaceutico",
      "ventaConReceta"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "categoriasFarmacia",
      "surtidoFarmaceutico",
      "ventaConReceta",
      "especialidadFarmacia",
      "diferenciadorSalud"
    ],
    "faq": []
  },
  "equipo-medico": {
    "chips": [
      "especialidad",
      "subespecialidad",
      "serviciosProfesionales"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "especialidad",
      "subespecialidad",
      "serviciosProfesionales",
      "segurosAceptados",
      "consultaEnLinea",
      "precioConsulta",
      "unidadConsulta",
      "horarioAtencion",
      "modalidadComercialEquipo",
      "diferenciadorSalud"
    ],
    "faq": [
      "segurosAceptados",
      "consultaEnLinea"
    ]
  },
  "protesis-y-ortesis": {
    "chips": [
      "categoriasFarmacia",
      "surtidoFarmaceutico",
      "ventaConReceta"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "categoriasFarmacia",
      "surtidoFarmaceutico",
      "ventaConReceta",
      "tiposProtesis",
      "diferenciadorSalud"
    ],
    "faq": []
  },
  "oxigeno-medicinal": {
    "chips": [
      "categoriasFarmacia",
      "surtidoFarmaceutico",
      "ventaConReceta"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "categoriasFarmacia",
      "surtidoFarmaceutico",
      "ventaConReceta",
      "modalidadOxigeno",
      "diferenciadorSalud"
    ],
    "faq": []
  },
  "laboratorios-dentales": {
    "chips": [
      "estudiosOfrecidos",
      "tiempoEntregaResultados",
      "tomaMuestrasDomicilio"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "estudiosOfrecidos",
      "tiempoEntregaResultados",
      "tomaMuestrasDomicilio",
      "productosLaboratorioDental",
      "diferenciadorSalud"
    ],
    "faq": []
  },
  "salud-ocupacional": {
    "chips": [
      "serviciosCorporativos",
      "coberturaEmpresas",
      "certificacionesCorporativas"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "serviciosCorporativos",
      "coberturaEmpresas",
      "certificacionesCorporativas",
      "diferenciadorSalud"
    ],
    "faq": []
  },
  "medicina-del-trabajo": {
    "chips": [
      "serviciosCorporativos",
      "coberturaEmpresas",
      "industriasMedicinaTrabajo"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "serviciosCorporativos",
      "coberturaEmpresas",
      "industriasMedicinaTrabajo",
      "diferenciadorSalud"
    ],
    "faq": []
  },
  "seguridad-e-higiene-industrial": {
    "chips": [
      "serviciosClinica",
      "especialidadesClinica",
      "urgencias24h"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "serviciosClinica",
      "especialidadesClinica",
      "urgencias24h",
      "normasIndustriales",
      "diferenciadorSalud"
    ],
    "faq": [
      "urgencias24h"
    ]
  },
  "examenes-medicos-para-empresas": {
    "chips": [
      "especialidad",
      "subespecialidad",
      "serviciosProfesionales"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "especialidad",
      "subespecialidad",
      "serviciosProfesionales",
      "segurosAceptados",
      "consultaEnLinea",
      "precioConsulta",
      "unidadConsulta",
      "horarioAtencion",
      "modalidadAtencionProfesional",
      "tamanoEmpresaAtendida",
      "diferenciadorSalud",
      "referenciasInterconsulta"
    ],
    "faq": [
      "segurosAceptados",
      "consultaEnLinea"
    ]
  },
  "servicios-medicos-empresariales": {
    "chips": [
      "especialidad",
      "subespecialidad",
      "serviciosProfesionales"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde",
      "modalidadAtencionProfesional"
    ],
    "rows": [
      "especialidad",
      "subespecialidad",
      "serviciosProfesionales",
      "segurosAceptados",
      "consultaEnLinea",
      "precioConsulta",
      "unidadConsulta",
      "horarioAtencion",
      "modalidadAtencionProfesional",
      "tamanoEmpresaAtendida",
      "diferenciadorSalud",
      "referenciasInterconsulta"
    ],
    "faq": [
      "segurosAceptados",
      "consultaEnLinea"
    ]
  },
  "seguros-medicos": {
    "chips": [
      "especialidad",
      "subespecialidad",
      "serviciosProfesionales"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "especialidad",
      "subespecialidad",
      "serviciosProfesionales",
      "segurosAceptados",
      "consultaEnLinea",
      "precioConsulta",
      "unidadConsulta",
      "horarioAtencion",
      "aseguradorasRepresentadas",
      "modalidadAsesoriaSeguros",
      "diferenciadorSalud"
    ],
    "faq": [
      "segurosAceptados",
      "consultaEnLinea"
    ]
  },
  "gastos-medicos-mayores": {
    "chips": [
      "especialidad",
      "subespecialidad",
      "serviciosProfesionales"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "especialidad",
      "subespecialidad",
      "serviciosProfesionales",
      "segurosAceptados",
      "consultaEnLinea",
      "precioConsulta",
      "unidadConsulta",
      "horarioAtencion",
      "aseguradorasRepresentadas",
      "diferenciadorSalud"
    ],
    "faq": [
      "segurosAceptados",
      "consultaEnLinea"
    ]
  },
  "servicios-funerarios": {
    "chips": [
      "serviciosFunerarios",
      "horarioDetalle",
      "planesFunerarios"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "serviciosFunerarios",
      "horarioDetalle",
      "planesFunerarios",
      "diferenciadorSalud"
    ],
    "faq": []
  },
  "casas-de-retiro": {
    "chips": [
      "serviciosHospital",
      "nivelesAtencion",
      "serviciosResidencia"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "serviciosHospital",
      "nivelesAtencion",
      "serviciosResidencia",
      "serviciosFunerarios",
      "capacidadResidentes",
      "tipoResidenciaRetiro",
      "diferenciadorSalud"
    ],
    "faq": []
  },
  "asilos-y-residencias-asistidas": {
    "chips": [
      "serviciosHospital",
      "nivelesAtencion",
      "serviciosResidencia"
    ],
    "stats": [
      "precioConsulta",
      "tarifaDesde"
    ],
    "rows": [
      "serviciosHospital",
      "nivelesAtencion",
      "serviciosResidencia",
      "serviciosFunerarios",
      "capacidadResidentes",
      "nivelAsistenciaResidencia",
      "diferenciadorSalud"
    ],
    "faq": []
  }
};

  var FIELD_LABELS = {
  "especialidadServicio": "Especialidad o servicio principal",
  "modalidadConsulta": "Modalidad de atención clínica",
  "modalidadAtencionProfesional": "Modalidad de atención",
  "poblacionAtendida": "Población que atiendes",
  "enfoqueTerapeutico": "Enfoque / abordaje terapéutico",
  "serviciosDentales": "Servicios dentales que ofreces",
  "equipamientoDental": "Equipamiento disponible",
  "atencionOdontopediatria": "¿Atiendes niños (odontopediatría)?",
  "urgenciasDentales": "¿Atiendes urgencias dentales?",
  "tipoEstablecimientoDental": "Tipo de establecimiento",
  "idiomasAtencion": "Idiomas de atención",
  "hospitalAfiliacion": "Hospital(es) de afiliación (opcional)",
  "tiempoRespuestaEmergencia": "Tiempo de respuesta estimado",
  "modalidadComercialEquipo": "Modalidad comercial",
  "tamanoEmpresaAtendida": "Tamaño de empresas atendidas",
  "aseguradorasRepresentadas": "Aseguradoras que representas",
  "modalidadAsesoriaSeguros": "Modalidad de asesoría",
  "prescripcionMedicamentos": "¿Incluye prescripción medicamentosa?",
  "objetivosNutricion": "Objetivos que trabajas",
  "planesAlimenticios": "Tipos de plan alimenticio",
  "areasFisioterapia": "Áreas / enfoques de fisioterapia",
  "equipamientoFisioterapia": "Equipamiento disponible",
  "tecnicasQuiropracticas": "Técnicas quiroprácticas",
  "serviciosOftalmologia": "Servicios oftalmológicos",
  "ventaLentes": "Venta de lentes",
  "serviciosAudiologia": "Servicios de audiología",
  "marcasAudifonos": "Marcas de audífonos (opcional)",
  "serviciosGinecologia": "Servicios gineco-obstétricos",
  "atencionParto": "Atención de parto",
  "procedimientosUrologia": "Procedimientos urológicos",
  "edadesAtendidasPediatria": "Edades que atiendes",
  "vacunacionInfantil": "¿Aplicas vacunación infantil?",
  "procedimientosDermatologia": "Procedimientos dermatológicos",
  "estudiosCardiologia": "Estudios cardiológicos",
  "procedimientosCirugia": "Procedimientos quirúrgicos",
  "procedimientosEsteticos": "Procedimientos estéticos",
  "cirugiaAmbulatoriaEstetica": "¿Cirugía ambulatoria en consultorio?",
  "tratamientosEsteticos": "Tratamientos estéticos",
  "equipamientoEstetico": "Equipamiento estético",
  "certificacionEnfermeria": "Cédula / certificación de enfermería",
  "turnosEnfermeria": "Turnos disponibles",
  "tipoCuidadoAdultoMayor": "Tipo de cuidado",
  "turnosCuidado": "Turnos de cuidado",
  "areasRehabilitacion": "Áreas de rehabilitación",
  "poblacionLenguaje": "Población atendida",
  "areasAprendizaje": "Áreas de aprendizaje",
  "requiereAyuno": "¿Informas requisitos de ayuno?",
  "citaPreviaLab": "¿Requiere cita previa?",
  "equipamientoImagen": "Equipamiento de imagen",
  "productosLaboratorioDental": "Productos del laboratorio",
  "tipoDonacionSangre": "Tipos de donación",
  "serviciosFarmacia": "Servicios adicionales",
  "entregaDomicilioFarmacia": "¿Entrega a domicilio?",
  "especialidadFarmacia": "Especialidad de la farmacia",
  "tiposProtesis": "Tipos de prótesis / órtesis",
  "modalidadOxigeno": "Modalidad de oxígeno",
  "especialidadesDisponiblesClinica": "Especialidades en la clínica",
  "estacionamientoClinica": "¿Estacionamiento?",
  "tiposRehabilitacionCentro": "Tipos de rehabilitación",
  "serviciosSaludMentalCentro": "Servicios de salud mental",
  "modalidadCentroSaludMental": "Modalidad de atención",
  "programasAdicciones": "Programas de adicciones",
  "internamientoAdicciones": "¿Internamiento residencial?",
  "tratamientosFertilidad": "Tratamientos de fertilidad",
  "normasIndustriales": "Normas / certificaciones",
  "camasHospital": "Número de camas (aprox.)",
  "quirfanosHospital": "Quirófanos disponibles",
  "tipoResidenciaRetiro": "Tipo de residencia",
  "nivelAsistenciaResidencia": "Nivel de asistencia",
  "planesFunerarios": "Planes funerarios",
  "certificacionesCorporativas": "Certificaciones corporativas",
  "industriasMedicinaTrabajo": "Industrias atendidas",
  "segurosAceptadosSalud": "Seguros / prepagos aceptados",
  "atencionDomicilioSalud": "¿Atención a domicilio?",
  "serviciosCuidado": "Servicios de cuidado",
  "coberturaDomicilioZona": "Zona de cobertura a domicilio",
  "estudiosOfrecidos": "Estudios o pruebas ofrecidas",
  "tiempoEntregaResultados": "Tiempo estimado de resultados",
  "tomaMuestrasDomicilio": "¿Toma de muestras a domicilio?",
  "categoriasFarmacia": "Categorías de productos",
  "surtidoFarmaceutico": "Surtido principal",
  "ventaConReceta": "Venta con receta médica",
  "serviciosClinica": "Servicios de la clínica",
  "especialidadesClinica": "Especialidades disponibles",
  "urgencias24h": "¿Urgencias 24 horas?",
  "serviciosHospital": "Servicios hospitalarios",
  "nivelesAtencion": "Niveles de atención",
  "serviciosResidencia": "Servicios de la residencia",
  "capacidadResidentes": "Capacidad de residentes",
  "serviciosFunerarios": "Servicios funerarios",
  "serviciosCorporativos": "Servicios corporativos",
  "coberturaEmpresas": "Tipo de empresas / industrias atendidas",
  "modalidadTraslado": "Modalidad de traslado",
  "coberturaEmergencias": "Cobertura de emergencias",
  "diferenciadorSalud": "Tu enfoque / lo que te distingue",
  "referenciasInterconsulta": "Referencias con otros especialistas",
  "coberturaAtencionSalud": "Zona donde atiendes"
};

  var FIELD_TYPES = {
  "especialidadServicio": "text",
  "modalidadConsulta": "enum",
  "modalidadAtencionProfesional": "enum",
  "poblacionAtendida": "checklist",
  "enfoqueTerapeutico": "checklist",
  "serviciosDentales": "checklist",
  "equipamientoDental": "checklist",
  "atencionOdontopediatria": "boolean",
  "urgenciasDentales": "boolean",
  "tipoEstablecimientoDental": "enum",
  "idiomasAtencion": "text",
  "hospitalAfiliacion": "text",
  "tiempoRespuestaEmergencia": "text",
  "modalidadComercialEquipo": "enum",
  "tamanoEmpresaAtendida": "checklist",
  "aseguradorasRepresentadas": "text",
  "modalidadAsesoriaSeguros": "enum",
  "prescripcionMedicamentos": "boolean",
  "objetivosNutricion": "checklist",
  "planesAlimenticios": "checklist",
  "areasFisioterapia": "checklist",
  "equipamientoFisioterapia": "checklist",
  "tecnicasQuiropracticas": "checklist",
  "serviciosOftalmologia": "checklist",
  "ventaLentes": "enum",
  "serviciosAudiologia": "checklist",
  "marcasAudifonos": "text",
  "serviciosGinecologia": "checklist",
  "atencionParto": "checklist",
  "procedimientosUrologia": "checklist",
  "edadesAtendidasPediatria": "checklist",
  "vacunacionInfantil": "boolean",
  "procedimientosDermatologia": "checklist",
  "estudiosCardiologia": "checklist",
  "procedimientosCirugia": "checklist",
  "procedimientosEsteticos": "checklist",
  "cirugiaAmbulatoriaEstetica": "boolean",
  "tratamientosEsteticos": "checklist",
  "equipamientoEstetico": "checklist",
  "certificacionEnfermeria": "text",
  "turnosEnfermeria": "checklist",
  "tipoCuidadoAdultoMayor": "checklist",
  "turnosCuidado": "checklist",
  "areasRehabilitacion": "checklist",
  "poblacionLenguaje": "checklist",
  "areasAprendizaje": "checklist",
  "requiereAyuno": "boolean",
  "citaPreviaLab": "boolean",
  "equipamientoImagen": "checklist",
  "productosLaboratorioDental": "checklist",
  "tipoDonacionSangre": "checklist",
  "serviciosFarmacia": "checklist",
  "entregaDomicilioFarmacia": "boolean",
  "especialidadFarmacia": "text",
  "tiposProtesis": "checklist",
  "modalidadOxigeno": "enum",
  "especialidadesDisponiblesClinica": "text",
  "estacionamientoClinica": "boolean",
  "tiposRehabilitacionCentro": "checklist",
  "serviciosSaludMentalCentro": "checklist",
  "modalidadCentroSaludMental": "enum",
  "programasAdicciones": "checklist",
  "internamientoAdicciones": "boolean",
  "tratamientosFertilidad": "checklist",
  "normasIndustriales": "checklist",
  "camasHospital": "text",
  "quirfanosHospital": "text",
  "tipoResidenciaRetiro": "enum",
  "nivelAsistenciaResidencia": "checklist",
  "planesFunerarios": "checklist",
  "certificacionesCorporativas": "text",
  "industriasMedicinaTrabajo": "checklist",
  "segurosAceptadosSalud": "checklist",
  "atencionDomicilioSalud": "enum",
  "serviciosCuidado": "checklist",
  "coberturaDomicilioZona": "text",
  "estudiosOfrecidos": "checklist",
  "tiempoEntregaResultados": "text",
  "tomaMuestrasDomicilio": "boolean",
  "categoriasFarmacia": "checklist",
  "surtidoFarmaceutico": "text",
  "ventaConReceta": "enum",
  "serviciosClinica": "checklist",
  "especialidadesClinica": "tags",
  "urgencias24h": "boolean",
  "serviciosHospital": "checklist",
  "nivelesAtencion": "checklist",
  "serviciosResidencia": "checklist",
  "capacidadResidentes": "text",
  "serviciosFunerarios": "checklist",
  "serviciosCorporativos": "checklist",
  "coberturaEmpresas": "text",
  "modalidadTraslado": "checklist",
  "coberturaEmergencias": "text",
  "diferenciadorSalud": "text",
  "referenciasInterconsulta": "enum",
  "coberturaAtencionSalud": "text"
};

  var CANON_BLOCK_TITLES = {
  "medicos-generales": "Medicina general",
  "especialistas-medicos": "Especialista médico",
  "dentistas-y-clinicas-dentales": "Odontología / clínica dental",
  "psicologos": "Psicología clínica",
  "psiquiatras": "Psiquiatría",
  "nutriologos": "Nutrición clínica",
  "fisioterapeutas": "Fisioterapia / rehabilitación",
  "quiropracticos": "Quiropráctica",
  "oftalmologia-y-opticas": "Oftalmología / óptica",
  "audiologia-y-aparatos-auditivos": "Audiología",
  "ginecologia-y-obstetricia": "Ginecología y obstetricia",
  "urologia": "Urología",
  "pediatria": "Pediatría",
  "dermatologia": "Dermatología",
  "cardiologia": "Cardiología",
  "cirugia-general": "Cirugía general",
  "cirugia-plastica-y-estetica": "Cirugía plástica y estética",
  "medicina-estetica": "Medicina estética",
  "clinicas-medicas": "Clínica médica",
  "hospitales-privados": "Hospital privado",
  "laboratorios-clinicos": "Laboratorio clínico",
  "estudios-de-diagnostico-e-imagen": "Diagnóstico por imagen",
  "ultrasonidos-y-rayos-x": "Ultrasonido y rayos X",
  "ambulancias-y-traslado-medico": "Ambulancias y traslado médico",
  "enfermeria-a-domicilio": "Enfermería a domicilio",
  "cuidado-de-adultos-mayores": "Cuidado de adultos mayores",
  "rehabilitacion-fisica": "Rehabilitación física",
  "terapias-de-lenguaje": "Terapia de lenguaje",
  "terapias-de-aprendizaje": "Terapia de aprendizaje",
  "centros-de-rehabilitacion": "Centro de rehabilitación",
  "centros-de-salud-mental": "Centro de salud mental",
  "clinicas-de-adicciones": "Clínica de adicciones",
  "clinicas-de-fertilidad": "Clínica de fertilidad",
  "bancos-de-sangre": "Banco de sangre",
  "farmacias": "Farmacia",
  "farmacias-especializadas": "Farmacia especializada",
  "equipo-medico": "Equipo médico / instrumental",
  "protesis-y-ortesis": "Prótesis y órtesis",
  "oxigeno-medicinal": "Oxígeno medicinal",
  "laboratorios-dentales": "Laboratorio dental",
  "salud-ocupacional": "Salud ocupacional",
  "medicina-del-trabajo": "Medicina del trabajo",
  "seguridad-e-higiene-industrial": "Seguridad e higiene industrial",
  "examenes-medicos-para-empresas": "Exámenes médicos empresariales",
  "servicios-medicos-empresariales": "Servicios médicos empresariales",
  "seguros-medicos": "Seguros médicos / agente",
  "gastos-medicos-mayores": "Gastos médicos mayores",
  "servicios-funerarios": "Servicios funerarios",
  "casas-de-retiro": "Casa de retiro",
  "asilos-y-residencias-asistidas": "Asilo / residencia asistida"
};

  var NEGOCIO_CANON = [
  "clinicas-medicas",
  "centros-de-rehabilitacion",
  "centros-de-salud-mental",
  "clinicas-de-adicciones",
  "clinicas-de-fertilidad",
  "seguridad-e-higiene-industrial",
  "hospitales-privados",
  "casas-de-retiro",
  "asilos-y-residencias-asistidas",
  "servicios-funerarios"
];

  var CEDULA_CANON = [
  "medicos-generales",
  "especialistas-medicos",
  "psicologos",
  "ambulancias-y-traslado-medico",
  "equipo-medico",
  "examenes-medicos-para-empresas",
  "servicios-medicos-empresariales",
  "seguros-medicos",
  "gastos-medicos-mayores"
];

  var PACK_TITLES = {
  "A": "Profesional con cédula",
  "B": "Consulta / especialidad",
  "C": "Cuidado y rehabilitación",
  "D": "Diagnóstico y laboratorio",
  "E": "Farmacia y productos médicos",
  "F": "Clínica / centro de salud",
  "G": "Institución / residencial",
  "H": "Salud corporativa / ocupacional"
};

  var SUB_TO_PACK = {
  "medicos-generales": "A",
  "especialistas-medicos": "A",
  "psicologos": "A",
  "ambulancias-y-traslado-medico": "A",
  "equipo-medico": "A",
  "examenes-medicos-para-empresas": "A",
  "servicios-medicos-empresariales": "A",
  "seguros-medicos": "A",
  "gastos-medicos-mayores": "A",
  "dentistas-y-clinicas-dentales": "B",
  "psiquiatras": "B",
  "nutriologos": "B",
  "fisioterapeutas": "B",
  "quiropracticos": "B",
  "oftalmologia-y-opticas": "B",
  "audiologia-y-aparatos-auditivos": "B",
  "ginecologia-y-obstetricia": "B",
  "urologia": "B",
  "pediatria": "B",
  "dermatologia": "B",
  "cardiologia": "B",
  "cirugia-general": "B",
  "cirugia-plastica-y-estetica": "B",
  "medicina-estetica": "B",
  "enfermeria-a-domicilio": "C",
  "cuidado-de-adultos-mayores": "C",
  "rehabilitacion-fisica": "C",
  "terapias-de-lenguaje": "C",
  "terapias-de-aprendizaje": "C",
  "laboratorios-clinicos": "D",
  "estudios-de-diagnostico-e-imagen": "D",
  "ultrasonidos-y-rayos-x": "D",
  "laboratorios-dentales": "D",
  "bancos-de-sangre": "D",
  "farmacias": "E",
  "farmacias-especializadas": "E",
  "protesis-y-ortesis": "E",
  "oxigeno-medicinal": "E",
  "clinicas-medicas": "F",
  "centros-de-rehabilitacion": "F",
  "centros-de-salud-mental": "F",
  "clinicas-de-adicciones": "F",
  "clinicas-de-fertilidad": "F",
  "seguridad-e-higiene-industrial": "F",
  "hospitales-privados": "G",
  "casas-de-retiro": "G",
  "asilos-y-residencias-asistidas": "G",
  "servicios-funerarios": "G",
  "salud-ocupacional": "H",
  "medicina-del-trabajo": "H"
};

  var ENUM_LABELS = {
  "modalidadConsulta": {
    "consultorio": "Consultorio",
    "videollamada": "Videollamada",
    "hibrido": "Hibrido",
    "domicilio_paciente": "Domicilio Paciente"
  },
  "modalidadAtencionProfesional": {
    "consultorio": "Consultorio",
    "videollamada": "Videollamada",
    "hibrido": "Hibrido"
  },
  "tipoEstablecimientoDental": {
    "consultorio_individual": "Consultorio Individual",
    "clinica_dental": "Clinica Dental",
    "centro_odontologico": "Centro Odontologico"
  },
  "modalidadComercialEquipo": {
    "venta": "Venta",
    "renta": "Renta",
    "ambas": "Ambas"
  },
  "modalidadAsesoriaSeguros": {
    "consultorio": "Consultorio",
    "videollamada": "Videollamada",
    "hibrido": "Hibrido"
  },
  "ventaLentes": {
    "consultorio": "Consultorio",
    "tienda_anexa": "Tienda Anexa",
    "no": "No"
  },
  "modalidadOxigeno": {
    "venta": "Venta",
    "renta": "Renta",
    "ambas": "Ambas"
  },
  "modalidadCentroSaludMental": {
    "consultorio": "Consultorio",
    "videollamada": "Videollamada",
    "hibrido": "Hibrido"
  },
  "tipoResidenciaRetiro": {
    "retiro_activo": "Retiro Activo",
    "asistido": "Asistido",
    "memoria": "Memoria"
  },
  "atencionDomicilioSalud": {
    "si": "Si",
    "no": "No"
  },
  "ventaConReceta": {
    "si": "Si",
    "no": "No",
    "ambas": "Ambas"
  },
  "referenciasInterconsulta": {
    "recibo_y_envio": "Recibo Y Envio",
    "solo_recibo": "Solo Recibo",
    "solo_envio": "Solo Envio",
    "convenio_clinica": "Convenio Clinica",
    "no": "No"
  }
};

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
    return (u && u.saludPerfil) ? u.saludPerfil : {};
  }

  function packFrom(u) {
    u = u || {};
    var p = perfilNested(u);
    return txt(u.deltaPack || p.deltaPack || SUB_TO_PACK[resolveCanonSubId(u)]).toUpperCase();
  }

  function isSaludSectorPerfil(u) {
    if (!u) return false;
    if (String(u.sectorId || '') === 'salud' && (u.saludPerfil || u.deltaPack)) return true;
    if (u.saludPerfil && resolveCanonSubId(u)) return true;
    return false;
  }

  function isSaludNegocioPerfil(u) {
    return NEGOCIO_CANON.indexOf(resolveCanonSubId(u)) >= 0;
  }

  function isSaludCedulaPerfil(u) {
    return CEDULA_CANON.indexOf(resolveCanonSubId(u)) >= 0;
  }

  function resolveVistaPerfil(u) {
    if (!isSaludSectorPerfil(u)) return null;
    return isSaludNegocioPerfil(u) ? 'empresa' : 'pro';
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
    if (fieldId === 'precioConsulta' || fieldId === 'tarifaDesde') return formatMoney(val);
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
    var pack = packFrom({ saludPerfil: p });
    var items = [];
    (pf.chips || []).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) items.push(val);
    });
    var listFields = {
      A: ['serviciosProfesionales', 'especialidad'],
      B: ['especialidadServicio', 'serviciosProfesionales'],
      C: ['serviciosCuidado'],
      D: ['estudiosOfrecidos'],
      E: ['categoriasFarmacia', 'surtidoFarmaceutico'],
      F: ['serviciosClinica', 'especialidadesClinica'],
      G: ['serviciosHospital', 'serviciosResidencia', 'serviciosFunerarios'],
      H: ['serviciosCorporativos']
    };
    (listFields[pack] || []).forEach(function (fid) {
      formatFieldValue(fid, p[fid]).split(' · ').forEach(function (x) {
        if (x && items.indexOf(x) < 0) items.push(x);
      });
    });
    if (p.modalidadConsulta) {
      var mod = formatEnumValue('modalidadConsulta', p.modalidadConsulta);
      if (mod && items.indexOf(mod) < 0) items.push(mod);
    }
    if (p.modalidadAtencionProfesional) {
      var mod2 = formatEnumValue('modalidadAtencionProfesional', p.modalidadAtencionProfesional);
      if (mod2 && items.indexOf(mod2) < 0) items.push(mod2);
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
    if (p.horarioAtencion) pushRow(rows, '🕐', 'Horario', p.horarioAtencion, 'horario');
    else if (p.horarioDetalle) pushRow(rows, '🕐', 'Horario', p.horarioDetalle, 'horario');
    else if (u.horario) pushRow(rows, '🕐', 'Horario', u.horario, 'horario');
    if (p.certificaciones) pushRow(rows, '🎖️', 'Certificaciones', p.certificaciones);
    if (p.diferenciadorSalud) pushRow(rows, '🩺', 'Tu sello', p.diferenciadorSalud);
    var loc = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); }).join(', ');
    if (loc) pushRow(rows, '📍', 'Ubicación', loc);
    if (p.direccion) pushRow(rows, '🏥', 'Dirección', p.direccion);
    if (p.coberturaAtencionSalud) pushRow(rows, '🗺️', 'Cobertura', p.coberturaAtencionSalud);
    else if (p.coberturaDomicilioZona) pushRow(rows, '🗺️', 'Cobertura domicilio', p.coberturaDomicilioZona);
    else if (p.coberturaEmpresas) pushRow(rows, '🗺️', 'Cobertura empresas', p.coberturaEmpresas);
    return rows;
  }

  function buildBadges(u, canonId) {
    u = u || {};
    var p = perfilNested(u);
    var badges = [];
    if (isSaludCedulaPerfil(u) && (u.cedulaVerificada === true || u.requiresCedula === true)) {
      badges.push({ cls: 'res-badge--cedula', text: 'Cédula verificada' });
    }
    if (p.urgencias24h === true) {
      badges.push({ cls: 'res-badge--urgencias', text: 'Urgencias 24 h' });
    }
    if (p.consultaEnLinea === true) {
      badges.push({ cls: 'res-badge--online', text: 'Consulta en línea' });
    }
    if (txt(p.segurosAceptados) && p.segurosAceptados !== 'solo_particular') {
      badges.push({ cls: 'res-badge--seguros', text: 'Acepta seguros' });
    }
    if (Array.isArray(p.segurosAceptadosSalud) && p.segurosAceptadosSalud.length) {
      badges.push({ cls: 'res-badge--seguros', text: 'Acepta seguros' });
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
        ['Salud', 'Especialidad'],
        ['Consultar', 'Tarifa'],
        ['Verificado', 'En plataforma'],
        ['Cita', 'Sujeta a disponibilidad'],
      ];
      var f = fillers[stats.length];
      if (f) stats.push(f);
    }
    return stats.slice(0, 4);
  }

  function buildFeats(pack) {
    if (pack === 'A') {
      return ['Consulta con cédula', 'Seguros declarados', 'Modalidad visible', 'Horario publicado'];
    }
    if (pack === 'B') {
      return ['Especialidad clara', 'Modalidad de consulta', 'Certificaciones visibles', 'Perfil verificable'];
    }
    if (pack === 'C') {
      return ['Cuidado a domicilio', 'Servicios declarados', 'Cobertura geográfica', 'Perfil verificable'];
    }
    if (pack === 'D') {
      return ['Estudios ofrecidos', 'Tiempos de entrega', 'Toma a domicilio', 'Ubicación clara'];
    }
    if (pack === 'E') {
      return ['Surtido farmacéutico', 'Venta con receta', 'Horario publicado', 'Ubicación clara'];
    }
    if (pack === 'F' || pack === 'G') {
      return ['Servicios del centro', 'Especialidades visibles', 'Urgencias declaradas', 'Perfil verificable'];
    }
    return ['Salud ocupacional', 'Cobertura empresas', 'Certificaciones', 'Perfil verificable en CariHub'];
  }

  function packFaq(canonId) {
    var pf = previewFields(canonId);
    if (pf.faq && pf.faq.length) {
      return pf.faq.map(function (fid) { return '¿' + fieldLabel(fid) + '?'; });
    }
    return ['¿Aceptan mi seguro?', '¿Cuál es la tarifa?', '¿Atienden urgencias?', '¿Cuál es la cobertura?'];
  }

  function resolvePrecioPublico(p, u) {
    p = p || {};
    u = u || {};
    if (txt(u.precio)) return u.precio;
    if (p.precioConsulta) return formatMoney(p.precioConsulta);
    if (p.tarifaDesde) return formatMoney(p.tarifaDesde);
    return '';
  }

  function resolvePriceLabel(u) {
    if (isSaludCedulaPerfil(u)) return 'Consulta desde';
    if (isSaludNegocioPerfil(u)) return 'Servicios desde';
    return 'Tarifa desde';
  }

  function buildSobreMi(canonId, p, u) {
    if (txt(u.sobreMi)) return u.sobreMi;
    if (txt(u.sobreNosotros)) return u.sobreNosotros;
    if (txt(p.tagline)) return p.tagline;
    if (txt(u.tagline)) return u.tagline;
    if (p.diferenciadorSalud) return p.diferenciadorSalud;
    if (p.especialidad) return p.especialidad;
    if (p.especialidadServicio) return p.especialidadServicio;
    return CANON_BLOCK_TITLES[canonId] || PACK_TITLES[packFrom(u)] || 'Servicios de salud en tu zona.';
  }

  function hydrateDisplayFields(u) {
    u = u || {};
    if (!isSaludSectorPerfil(u)) return u;
    var p = perfilNested(u);
    var canonId = resolveCanonSubId(u);
    var pack = packFrom(u);
    u.__saludCanon = canonId;
    u.__saludPack = pack;
    u.sectorId = u.sectorId || 'salud';
    u.titulo = u.titulo || p.blockTitle || CANON_BLOCK_TITLES[canonId] || PACK_TITLES[pack] || 'Servicios de salud';
    u.especialidad = u.especialidad || p.especialidad || p.especialidadServicio || p.especialidadesClinica || u.titulo;
    u.servicios = u.servicios || u.titulo;
    u.tagline = u.tagline || p.tagline || '';
    u.sobreMi = buildSobreMi(canonId, p, u);
    u.sobreNosotros = u.sobreNosotros || u.sobreMi;
    u.precio = resolvePrecioPublico(p, u);
    u.horario = u.horario || p.horarioAtencion || p.horarioDetalle || '';
    if (isSaludCedulaPerfil(u)) {
      u.nombre = u.nombreProfesional || p.nombreProfesional || u.nombre || '';
      u.nombreProfesional = u.nombreProfesional || p.nombreProfesional || u.nombre;
      u.alias = u.nombre;
    } else if (isSaludNegocioPerfil(u)) {
      u.nombre = u.nombreComercial || p.nombreComercial || u.nombre || '';
      u.nombreComercial = u.nombreComercial || p.nombreComercial || u.nombre;
    } else {
      u.nombre = u.alias || p.alias || u.nombre || '';
      u.alias = p.alias || u.alias || u.nombre;
    }
    u.serviciosIncluidos = buildServiciosList(canonId, p);
    u.atencion = u.atencion || (p.modalidadConsulta ? formatEnumValue('modalidadConsulta', p.modalidadConsulta)
      : (p.modalidadAtencionProfesional ? formatEnumValue('modalidadAtencionProfesional', p.modalidadAtencionProfesional) : 'Consultar modalidad'));
    var locParts = [u.zona, u.ciudad, u.estado].filter(function (x) { return txt(x); });
    u.zonaCobertura = u.zonaCobertura || txt(p.coberturaAtencionSalud) || txt(p.coberturaDomicilioZona) || txt(p.coberturaEmpresas) || locParts.join(', ') || txt(p.direccion) || '';
    u.cobertura = Array.isArray(u.cobertura) && u.cobertura.length ? u.cobertura : locParts.filter(Boolean);
    if (txt(p.certificaciones) && !Array.isArray(u.certificaciones)) {
      u.certificaciones = [[txt(p.certificaciones), 'Formación / registro']];
    }
    u.__saludDatos = buildDatosRows(canonId, p, u);
    u.__saludBadges = buildBadges(u, canonId);
    u.__saludPriceLabel = resolvePriceLabel(u);
    u.rating = u.rating != null ? u.rating : '—';
    u.opiniones = u.opiniones != null ? u.opiniones : 0;
    u.reviews = Array.isArray(u.reviews) ? u.reviews : [];
    u.faq = Array.isArray(u.faq) && u.faq.length ? u.faq : packFaq(canonId);
    u.noIncluidos = Array.isArray(u.noIncluidos) && u.noIncluidos.length
      ? u.noIncluidos
      : ['Medicamentos no declarados', 'Procedimientos fuera del alcance publicado', 'Urgencias no cubiertas salvo indicación'];
    u.stats = Array.isArray(u.stats) && u.stats.length ? u.stats : buildStats(canonId, p);
    u.feats = Array.isArray(u.feats) && u.feats.length ? u.feats : buildFeats(pack);
    u.metodosPago = Array.isArray(u.metodosPago) && u.metodosPago.length ? u.metodosPago : ['Consultar'];
    u.urgencias = u.urgencias || (p.urgencias24h === true ? 'Urgencias 24 h' : 'Consultar disponibilidad');
    if (isSaludCedulaPerfil(u)) u.cedulaVerificada = u.cedulaVerificada !== false;
    return u;
  }

  function cardMetaChips(u) {
    u = hydrateDisplayFields(Object.assign({}, u));
    var p = perfilNested(u);
    var canonId = u.__saludCanon;
    var pf = previewFields(canonId);
    var chips = [];
    (pf.chips || []).slice(0, 3).forEach(function (fid) {
      var val = formatFieldValue(fid, p[fid]);
      if (val) chips.push(val.split(' · ')[0].slice(0, 28));
    });
    if (p.modalidadConsulta) {
      chips.push(formatEnumValue('modalidadConsulta', p.modalidadConsulta).slice(0, 28));
    }
    if (p.consultaEnLinea === true) chips.push('Consulta en línea');
    if (p.urgencias24h === true) chips.push('Urgencias 24 h');
    return chips.filter(function (x, i, a) { return x && a.indexOf(x) === i; }).slice(0, 4);
  }

  global.CariHubSaludSectorRender = {
    PACK_TITLES: PACK_TITLES,
    isSaludSectorPerfil: isSaludSectorPerfil,
    isSaludNegocioPerfil: isSaludNegocioPerfil,
    isSaludCedulaPerfil: isSaludCedulaPerfil,
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
