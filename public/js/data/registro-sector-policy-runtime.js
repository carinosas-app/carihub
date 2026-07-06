/** Runtime — política cross-sector (browser). MP-REGISTRO-CROSS-SECTOR-POLICY-V1 */
(function (global) {
  'use strict';
  global.CARIHUB_REGISTRO_GALLERY_HINTS = {
    adultos: 'Foto principal y galería — muestra tu mejor imagen profesional.',
    salud: 'Foto principal (rostro o consultorio) y 1–2 fotos de espacio o credenciales visibles.',
    profesionales: 'Foto profesional y opcionalmente oficina, equipo o material de trabajo.',
    bienestar: 'Foto del espacio, sesión o práctica — ambiente acogedor y profesional.',
    eventos: 'Fotos de eventos reales, montaje o portfolio — mínimo 2 del servicio.',
    restaurantes: 'Platillos, local y ambiente — lo que verá quien busca dónde comer.',
    tecnologia: 'Foto profesional y opcional captura de proyectos o workspace (sin datos sensibles).',
    'bienes-raices': 'Fachada, interiores y plano — ayuda a quien busca propiedad.',
    automotriz: 'Vehículo, taller o servicio — fotos claras del trabajo que ofreces.',
    transporte: 'Unidades, flota o servicio — identifica tu operación.',
    educacion: 'Aula, materiales o certificaciones visibles — genera confianza.',
    hogar: 'Trabajo realizado o herramientas — muestra oficio concreto.',
    industria: 'Planta, equipo o proyectos industriales.',
    mascotas: 'Mascotas atendidas, instalaciones o equipo.',
    comercio: 'Productos, vitrina o servicio comercial.',
    generico: 'Foto principal y extras que muestren tu servicio o negocio.'
  };
  global.CARIHUB_SECTOR_PRIVATE_EXTRAS = {
    tecnologia: ['certificacionesTI', 'portfolioPrivado'],
    eventos: ['polizaResponsabilidadCivil'],
    restaurantes: ['licenciaOperacion'],
    industria: ['licenciaOperacion']
  };

  /** Bloque universal: colaboración para contenido en redes (todas las subcategorías). */
  global.CARIHUB_COLABORACION_CONTENIDO_POLICY = {
    block: {
      id: 'colaboracionContenidoCrossSector',
      title: 'Redes sociales',
      hint: 'Indica si colaboras para crear contenido (fotos, videos, reels o promos) con otros perfiles, marcas o negocios.',
      fields: [
        {
          id: 'colaboracionContenido',
          label: '¿Haces colaboraciones para contenido en redes sociales?',
          type: 'select',
          required: false,
          options: ['Sí', 'No', 'Bajo acuerdo previo']
        },
        {
          id: 'mostrarColaboracionContenidoPublico',
          label: '¿Mostrar en resultados y perfil público?',
          type: 'select',
          required: false,
          defaultValue: 'Sí',
          options: ['Sí', 'No'],
          showWhen: { field: 'colaboracionContenido', values: ['Sí', 'Bajo acuerdo previo'] }
        }
      ]
    },
    appendToBlocks: function (blocks) {
      blocks = blocks || [];
      var hasField = false;
      blocks.forEach(function (b) {
        (b.fields || []).forEach(function (f) {
          if (f.id === 'colaboracionContenido') hasField = true;
        });
      });
      if (hasField) return blocks;
      var blk = JSON.parse(JSON.stringify(global.CARIHUB_COLABORACION_CONTENIDO_POLICY.block));
      return blocks.concat([blk]);
    },
    esPublica: function (u) {
      if (!u) return false;
      var val = String(u.colaboracionContenido || '').trim();
      if (!val || val === 'No') return false;
      var vis = u.mostrarColaboracionContenidoPublico;
      if (vis != null && String(vis).trim() !== '' && String(vis).trim() !== 'Sí') return false;
      return true;
    },
    etiquetaTarjeta: function (u) {
      var val = String((u && u.colaboracionContenido) || '').trim();
      if (val === 'Bajo acuerdo previo') return 'Colabora en redes · a convenir';
      return 'Colabora en redes';
    },
    etiquetaValor: function (valor) {
      var val = String(valor || '').trim();
      if (val === 'Sí') return 'Sí, colaboro para contenido';
      if (val === 'Bajo acuerdo previo') return 'A convenir';
      if (val === 'No') return 'No colaboro';
      return val;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
