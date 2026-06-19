(function (global) {
  'use strict';

  var PASSWORD_FIELDS = ['contrasenaAcceso', 'confirmarContrasenaAcceso'];
  var PASSWORD_MIN_LENGTH = 8;
  var PASSWORD_REQUIREMENT_MSG =
    'Mínimo 8 caracteres, una letra, un número y un carácter especial (!@#$%&*._-).';

  var SUPPORTED_FORMS = {
    adultos: true,
    persona_independiente: true,
    profesionista_cedula: true,
    negocio_empresa: true
  };

  var IDENTITY_FIELDS = ['nombrePersonal', 'fechaNacimiento', 'domicilioPrivado', 'comprobanteDomicilio'];
  var ADMIN_META_FIELDS = [
    'correoContactoAdmin', 'tipoResponsable', 'relacionPerfil',
    'medioContactoAdmin', 'horarioContactoAdmin', 'notasRevisionAdmin'
  ];
  var CONTACT_PHONE_FIELDS = ['telefonoContacto', 'telefonoPrivado', 'whatsappPrivado'];
  var ACCESS_FIELDS = ['correoAcceso'].concat(PASSWORD_FIELDS);
  var CUENTA_FIELD_ORDER = [
    'responsable',
    'nombrePersonal',
    'fechaNacimiento',
    'domicilioPrivado',
    'comprobanteDomicilio',
    'telefonoContacto',
    'telefonoPrivado',
    'whatsappPrivado',
    'correoContactoAdmin',
    'tipoResponsable',
    'relacionPerfil',
    'medioContactoAdmin',
    'horarioContactoAdmin',
    'notasRevisionAdmin',
    'correoAcceso',
    'contrasenaAcceso',
    'confirmarContrasenaAcceso'
  ];
  var CUENTA_BLOCK_FIELDS = mergeUnique(
    IDENTITY_FIELDS,
    CONTACT_PHONE_FIELDS,
    ADMIN_META_FIELDS,
    ACCESS_FIELDS,
    ['responsable']
  );
  var CONSENT_FIELDS = [
    'mayorEdadConfirmado', 'aceptoCrearCuenta', 'fotosPropioContenido', 'publicacionVoluntaria',
    'terminosAceptados', 'aceptoCondicionesUso', 'aceptoPoliticaPrivacidad',
    'autorizoRevisionManual', 'validacionDerechosImagenes', 'validacionContenidoLegal',
    'consentimientoDual'
  ];

  var FORM_BASE = {
    adultos: mergeUnique(
      ['telefonoContacto'],
      ADMIN_META_FIELDS,
      ['correoAcceso', 'contrasenaAcceso', 'confirmarContrasenaAcceso'],
      ['deseoFacturar'],
      CONSENT_FIELDS.filter(function (c) { return c !== 'consentimientoDual'; })
    ),
    persona_independiente: mergeUnique(
      ['telefonoPrivado', 'whatsappPrivado'],
      ADMIN_META_FIELDS,
      ['correoAcceso', 'contrasenaAcceso', 'confirmarContrasenaAcceso'],
      ['deseoFacturar'],
      CONSENT_FIELDS.filter(function (c) { return c !== 'consentimientoDual'; })
    ),
    profesionista_cedula: mergeUnique(
      ['cedulaNumero', 'cedulaProfesion', 'cedulaEspecialidad', 'cedulaInstitucion',
        'cedulaAnio', 'cedulaComprobante', 'cedulaEstado'],
      IDENTITY_FIELDS,
      ['telefonoPrivado'],
      ADMIN_META_FIELDS,
      ['correoAcceso', 'contrasenaAcceso', 'confirmarContrasenaAcceso'],
      ['ineFrente', 'ineReverso', 'selfieVerificacion'],
      ['deseoFacturar'],
      CONSENT_FIELDS.filter(function (c) { return c !== 'consentimientoDual' && c !== 'mayorEdadConfirmado'; })
    ),
    negocio_empresa: mergeUnique(
      ['responsable', 'telefonoPrivado'],
      ADMIN_META_FIELDS,
      ['correoAcceso', 'contrasenaAcceso', 'confirmarContrasenaAcceso'],
      ['ineRepresentante', 'rfc', 'razonSocial', 'licenciaOperacion', 'deseoFacturar'],
      CONSENT_FIELDS.filter(function (c) {
        return c !== 'consentimientoDual' && c !== 'mayorEdadConfirmado';
      })
    )
  };

  var ARQUETIPO_EXTRA = {
    adultos: {
      persona_acompanante: mergeUnique(IDENTITY_FIELDS, ['whatsappPrivado', 'ineFrente', 'ineReverso', 'selfieVerificacion']),
      persona_dominatrix: mergeUnique(IDENTITY_FIELDS, ['whatsappPrivado', 'ineFrente', 'ineReverso', 'selfieVerificacion']),
      persona_creador: mergeUnique(IDENTITY_FIELDS, ['ineFrente', 'selfieVerificacion']),
      persona_espectaculo: mergeUnique(IDENTITY_FIELDS, ['ineFrente', 'selfieVerificacion']),
      pareja_grupo: mergeUnique(IDENTITY_FIELDS, ['consentimientoDual', 'ineFrente', 'selfieVerificacion', 'whatsappPrivado']),
      negocio_retail: mergeUnique(IDENTITY_FIELDS, ['rfc', 'razonSocial', 'licenciaOperacion']),
      negocio_bienestar: mergeUnique(IDENTITY_FIELDS, ['rfc', 'razonSocial', 'licenciaOperacion']),
      negocio_hospedaje: mergeUnique(IDENTITY_FIELDS, ['rfc', 'razonSocial', 'licenciaOperacion']),
      negocio_venue: mergeUnique(IDENTITY_FIELDS, ['rfc', 'razonSocial', 'licenciaOperacion'])
    },
    persona_independiente: {
      persona_servicio_general: mergeUnique(IDENTITY_FIELDS, ['ineFrente', 'ineReverso', 'selfieVerificacion']),
      persona_servicio_oficio: mergeUnique(IDENTITY_FIELDS, ['ineFrente', 'ineReverso', 'selfieVerificacion']),
      persona_servicio_movil: mergeUnique(IDENTITY_FIELDS, ['ineFrente', 'ineReverso', 'selfieVerificacion']),
      persona_servicio_profesional: mergeUnique(IDENTITY_FIELDS, ['ineFrente', 'ineReverso', 'selfieVerificacion']),
      persona_servicio_bienestar: mergeUnique(IDENTITY_FIELDS, ['ineFrente', 'ineReverso', 'selfieVerificacion']),
      persona_bienestar_individual: mergeUnique(IDENTITY_FIELDS, ['ineFrente', 'ineReverso', 'selfieVerificacion']),
      empresa_servicios: mergeUnique(IDENTITY_FIELDS, ['ineFrente', 'ineReverso', 'selfieVerificacion', 'rfc'])
    }
  };

  var CFDI_FIELDS = [
    'nombreFiscal', 'rfc', 'razonSocial', 'domicilioFiscal', 'codigoPostalFiscal',
    'emailFacturacion', 'regimenFiscal', 'usoCFDI'
  ];
  var CFDI_EXTRA_FIELDS = [
    'nombreFiscal', 'domicilioFiscal', 'codigoPostalFiscal', 'emailFacturacion', 'regimenFiscal', 'usoCFDI'
  ];
  var CFDI_FORMS = {
    adultos: true,
    persona_independiente: true,
    profesionista_cedula: true,
    negocio_empresa: true
  };

  var PROFESIONISTA_OPTIONAL = ['cedulaEspecialidad', 'cedulaEstado', 'notasRevisionAdmin'];

  var BLOQUE_TITLES = {
    legal: 'Qué recabamos en tu categoría',
    cuenta: 'Datos privados y acceso a tu cuenta',
    cedula: 'Cédula profesional',
    representante: 'Representante legal',
    verificacion: 'Verificación de identidad',
    fiscal: 'Datos fiscales',
    consentimientos: 'Confirmaciones legales'
  };

  var BLOQUE_ORDER = {
    adultos: ['legal', 'cuenta', 'verificacion', 'fiscal', 'consentimientos'],
    persona_independiente: ['legal', 'cuenta', 'verificacion', 'fiscal', 'consentimientos'],
    profesionista_cedula: ['legal', 'cedula', 'cuenta', 'verificacion', 'fiscal', 'consentimientos'],
    negocio_empresa: ['legal', 'cuenta', 'representante', 'fiscal', 'consentimientos']
  };

  var FORM_LABEL_OVERRIDES = {
    negocio_empresa: { telefonoPrivado: 'Teléfono privado gerencia' }
  };

  var SELECT_OPTIONS = {
    tipoResponsable: [
      { v: '', l: 'Selecciona una opción' },
      { v: 'persona-fisica', l: 'Persona física' },
      { v: 'negocio', l: 'Negocio' },
      { v: 'empresa', l: 'Empresa' },
      { v: 'agencia', l: 'Agencia' },
      { v: 'representante-autorizado', l: 'Representante autorizado' },
      { v: 'otro', l: 'Otro' }
    ],
    relacionPerfil: [
      { v: '', l: 'Selecciona una opción' },
      { v: 'propietario', l: 'Soy titular del perfil' },
      { v: 'representante', l: 'Soy representante autorizado' },
      { v: 'empleado', l: 'Soy empleado autorizado' },
      { v: 'agencia', l: 'Soy agencia / gestor' },
      { v: 'otro', l: 'Otro' }
    ],
    medioContactoAdmin: [
      { v: '', l: 'Selecciona una opción' },
      { v: 'whatsapp', l: 'WhatsApp' },
      { v: 'correo', l: 'Correo electrónico' },
      { v: 'llamada', l: 'Llamada telefónica' }
    ],
    horarioContactoAdmin: [
      { v: '', l: 'Selecciona una opción' },
      { v: 'manana', l: 'Mañana' },
      { v: 'tarde', l: 'Tarde' },
      { v: 'noche', l: 'Noche' },
      { v: 'cualquier', l: 'Cualquier horario' }
    ]
  };

  var FIELD_META = {
    nombrePersonal: {
      label: 'Nombre personal completo', tipo: 'text', bloque: 'cuenta',
      placeholder: 'Como aparece en tu INE (no se publica)', obligatorio: true, maxLength: 80
    },
    fechaNacimiento: {
      label: 'Fecha de nacimiento', tipo: 'date', bloque: 'cuenta', obligatorio: true
    },
    domicilioPrivado: {
      label: 'Domicilio privado', tipo: 'textarea', bloque: 'cuenta',
      placeholder: 'Calle, número, colonia, ciudad, estado y referencias', obligatorio: true
    },
    comprobanteDomicilio: {
      label: 'Comprobante de domicilio', tipo: 'file', bloque: 'cuenta',
      accept: 'image/*,.pdf', obligatorio: true
    },
    telefonoContacto: {
      label: 'Teléfono de contacto', tipo: 'tel', bloque: 'cuenta',
      placeholder: '10–15 dígitos', obligatorio: true
    },
    telefonoPrivado: {
      label: 'Teléfono privado', tipo: 'tel', bloque: 'cuenta',
      placeholder: '10–15 dígitos', obligatorio: true
    },
    whatsappPrivado: {
      label: 'WhatsApp privado', tipo: 'tel', bloque: 'cuenta',
      placeholder: 'Número real (no se publica)', obligatorio: false
    },
    correoContactoAdmin: {
      label: 'Correo privado del titular', tipo: 'email', bloque: 'cuenta',
      placeholder: 'Solo administración (distinto al de acceso si quieres)', obligatorio: true
    },
    tipoResponsable: {
      label: 'Tipo de titular / responsable', tipo: 'select', bloque: 'cuenta', obligatorio: true
    },
    relacionPerfil: {
      label: 'Relación con este perfil', tipo: 'select', bloque: 'cuenta', obligatorio: true
    },
    medioContactoAdmin: {
      label: 'Medio preferido de contacto administrativo', tipo: 'select', bloque: 'cuenta', obligatorio: true
    },
    horarioContactoAdmin: {
      label: 'Horario preferido de contacto', tipo: 'select', bloque: 'cuenta', obligatorio: true
    },
    notasRevisionAdmin: {
      label: 'Notas privadas para revisión', tipo: 'textarea', bloque: 'cuenta',
      placeholder: 'Información adicional que solo verá el administrador', obligatorio: false
    },
    correoAcceso: {
      label: 'Correo de acceso a tu cuenta', tipo: 'email', bloque: 'cuenta',
      placeholder: 'Para iniciar sesión', obligatorio: true
    },
    contrasenaAcceso: {
      label: 'Contraseña de acceso', tipo: 'password', bloque: 'cuenta',
      placeholder: 'Mínimo 8 caracteres seguros', obligatorio: true
    },
    confirmarContrasenaAcceso: {
      label: 'Confirmar contraseña', tipo: 'password', bloque: 'cuenta',
      placeholder: 'Repite tu contraseña', obligatorio: true
    },
    cedulaNumero: {
      label: 'Número de cédula profesional', tipo: 'text', bloque: 'cedula',
      placeholder: 'Como aparece en tu cédula', obligatorio: true, maxLength: 30
    },
    cedulaProfesion: { label: 'Profesión según cédula', tipo: 'text', bloque: 'cedula', obligatorio: true },
    cedulaEspecialidad: { label: 'Especialidad según cédula', tipo: 'text', bloque: 'cedula', obligatorio: false },
    cedulaInstitucion: { label: 'Institución que expide', tipo: 'text', bloque: 'cedula', obligatorio: true },
    cedulaAnio: {
      label: 'Año de titulación', tipo: 'number', bloque: 'cedula',
      obligatorio: true, min: 1950, max: 2030
    },
    cedulaComprobante: {
      label: 'Comprobante / captura de cédula', tipo: 'file', bloque: 'cedula',
      accept: 'image/*,.pdf', obligatorio: true
    },
    cedulaEstado: { label: 'Estado de la república (cédula)', tipo: 'text', bloque: 'cedula', obligatorio: false },
    ineFrente: {
      label: 'INE — frente', tipo: 'file', bloque: 'verificacion',
      accept: 'image/*,.pdf', obligatorio: true
    },
    ineReverso: {
      label: 'INE — reverso', tipo: 'file', bloque: 'verificacion',
      accept: 'image/*,.pdf', obligatorio: true
    },
    selfieVerificacion: {
      label: 'Selfie con leyenda CariHub + fecha', tipo: 'file', bloque: 'verificacion',
      accept: 'image/*', obligatorio: true
    },
    licenciaOperacion: {
      label: 'Licencia o permiso de operación', tipo: 'file', bloque: 'fiscal',
      accept: 'image/*,.pdf', obligatorio: false
    },
    responsable: {
      label: 'Responsable / representante legal', tipo: 'text', bloque: 'cuenta',
      placeholder: 'Nombre completo como en identificación', obligatorio: true, maxLength: 80
    },
    ineRepresentante: {
      label: 'INE del representante legal', tipo: 'file', bloque: 'representante',
      accept: 'image/*,.pdf', obligatorio: true
    },
    nombreFiscal: {
      label: 'Nombre fiscal (persona física)', tipo: 'text', bloque: 'fiscal',
      placeholder: 'Nombre completo para CFDI', obligatorio: false
    },
    rfc: { label: 'RFC', tipo: 'text', bloque: 'fiscal', placeholder: 'XAXX010101000', obligatorio: false },
    razonSocial: { label: 'Razón social', tipo: 'text', bloque: 'fiscal', obligatorio: false },
    domicilioFiscal: {
      label: 'Domicilio fiscal', tipo: 'text', bloque: 'fiscal',
      placeholder: 'Calle, número, colonia, ciudad', obligatorio: false
    },
    codigoPostalFiscal: {
      label: 'Código postal fiscal', tipo: 'text', bloque: 'fiscal',
      placeholder: '5 dígitos', obligatorio: false, maxLength: 5
    },
    emailFacturacion: { label: 'Correo para facturación', tipo: 'email', bloque: 'fiscal', obligatorio: false },
    regimenFiscal: { label: 'Régimen fiscal', tipo: 'text', bloque: 'fiscal', obligatorio: false },
    usoCFDI: { label: 'Uso de CFDI', tipo: 'text', bloque: 'fiscal', obligatorio: false },
    deseoFacturar: {
      label: 'Deseo facturar (CFDI)', tipo: 'boolean', bloque: 'fiscal', obligatorio: false
    },
    mayorEdadConfirmado: {
      label: 'Confirmo ser mayor de 18 años', tipo: 'boolean', bloque: 'consentimientos', obligatorio: true
    },
    aceptoCrearCuenta: {
      label: 'Acepto crear mi cuenta en la plataforma', tipo: 'boolean',
      bloque: 'consentimientos', obligatorio: true
    },
    fotosPropioContenido: {
      label: 'Confirmo que las fotos y datos publicados son míos o tengo autorización', tipo: 'boolean',
      bloque: 'consentimientos', obligatorio: true
    },
    publicacionVoluntaria: {
      label: 'Confirmo que publico mi perfil por voluntad propia', tipo: 'boolean',
      bloque: 'consentimientos', obligatorio: true
    },
    terminosAceptados: {
      label: 'términos y condiciones, aviso de privacidad y normas de publicación', tipo: 'terminos_link',
      bloque: 'consentimientos', obligatorio: true
    },
    aceptoCondicionesUso: {
      label: 'Acepto condiciones de uso de la plataforma', tipo: 'boolean',
      bloque: 'consentimientos', obligatorio: true
    },
    aceptoPoliticaPrivacidad: {
      label: 'Acepto política de privacidad', tipo: 'boolean',
      bloque: 'consentimientos', obligatorio: true
    },
    autorizoRevisionManual: {
      label: 'Autorizo la revisión manual de mi información antes de publicarse', tipo: 'boolean',
      bloque: 'consentimientos', obligatorio: true
    },
    validacionDerechosImagenes: {
      label: 'Confirmo que tengo derechos sobre las imágenes enviadas', tipo: 'boolean',
      bloque: 'consentimientos', obligatorio: true
    },
    validacionContenidoLegal: {
      label: 'Confirmo que no subiré contenido ilegal o engañoso', tipo: 'boolean',
      bloque: 'consentimientos', obligatorio: true
    },
    consentimientoDual: {
      label: 'Ambos miembros consienten este perfil', tipo: 'boolean', bloque: 'consentimientos', obligatorio: true
    }
  };

  var ADULTOS_NEGOCIO_ARQUETIPOS = {
    negocio_retail: true, negocio_bienestar: true, negocio_hospedaje: true, negocio_venue: true
  };
  var NEGOCIO_REGULADO_ARQUETIPOS = { negocio_alimentos: true, negocio_institucion: true };

  function mergeUnique() {
    var seen = {};
    var out = [];
    for (var i = 0; i < arguments.length; i++) {
      var arr = arguments[i];
      if (!arr) continue;
      for (var j = 0; j < arr.length; j++) {
        var x = arr[j];
        if (!seen[x]) { seen[x] = true; out.push(x); }
      }
    }
    return out;
  }

  function $(id) { return document.getElementById(id); }
  function fieldId(campo) { return 'priv_' + campo; }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  function isCfdiConditional(formularioId, campo) {
    if (CFDI_EXTRA_FIELDS.indexOf(campo) >= 0) return !!CFDI_FORMS[formularioId];
    if (formularioId === 'negocio_empresa') return false;
    return CFDI_FIELDS.indexOf(campo) >= 0 && !!CFDI_FORMS[formularioId];
  }

  function cfdiFieldsToMerge(formularioId) {
    if (formularioId === 'negocio_empresa') return CFDI_EXTRA_FIELDS;
    return CFDI_FIELDS;
  }

  function fieldBloque(campo, meta, formularioId) {
    if (CUENTA_BLOCK_FIELDS.indexOf(campo) >= 0) return 'cuenta';
    if (CFDI_EXTRA_FIELDS.indexOf(campo) >= 0 && CFDI_FORMS[formularioId]) return 'fiscal';
    return meta.bloque || 'otros';
  }

  function isFieldRequired(spec, campo) {
    var meta = FIELD_META[campo];
    if (!meta) return false;
    if (spec.formularioId === 'profesionista_cedula' && PROFESIONISTA_OPTIONAL.indexOf(campo) >= 0) return false;
    if (campo === 'nombrePersonal' && spec.formularioId === 'negocio_empresa') return false;
    if (campo === 'consentimientoDual' && spec.arquetipo !== 'pareja_grupo') return false;
    if (campo === 'mayorEdadConfirmado' &&
      (spec.formularioId === 'profesionista_cedula' || spec.formularioId === 'negocio_empresa')) {
      return false;
    }
    if (spec.formularioId === 'negocio_empresa') {
      if (campo === 'responsable' || campo === 'telefonoPrivado' || campo === 'correoAcceso' ||
          PASSWORD_FIELDS.indexOf(campo) >= 0 || campo === 'ineRepresentante' ||
          ADMIN_META_FIELDS.indexOf(campo) >= 0) return true;
      if (IDENTITY_FIELDS.indexOf(campo) >= 0) return true;
      if (CONSENT_FIELDS.indexOf(campo) >= 0 && campo !== 'consentimientoDual' && campo !== 'mayorEdadConfirmado') {
        return spec.fieldIds.indexOf(campo) >= 0;
      }
      if (campo === 'licenciaOperacion' && NEGOCIO_REGULADO_ARQUETIPOS[spec.arquetipo]) return true;
      return false;
    }
    if (spec.formularioId === 'adultos' && ADULTOS_NEGOCIO_ARQUETIPOS[spec.arquetipo]) {
      if (campo === 'rfc' || campo === 'razonSocial' || campo === 'licenciaOperacion') return true;
    }
    if (campo === 'ineReverso' && spec.arquetipo === 'persona_creador') return false;
    if (campo === 'whatsappPrivado') {
      return spec.arquetipo === 'persona_acompanante' || spec.arquetipo === 'persona_dominatrix' ||
        spec.arquetipo === 'pareja_grupo';
    }
    if (CFDI_FIELDS.indexOf(campo) >= 0 && campo !== 'nombreFiscal') return false;
    if (meta.obligatorio === false) return false;
    return spec.fieldIds.indexOf(campo) >= 0;
  }

  function resolvePrivateSpec(ctx) {
    ctx = ctx || {};
    var engine = global.CariHubFieldEngineLite;
    var reg = engine && engine.resolveRegistrationSchema
      ? engine.resolveRegistrationSchema(ctx) : { identidad: {} };
    var ident = reg.identidad || {};
    var formularioId = ident.formularioId || '';
    var arquetipo = ident.arquetipo || '';

    if (!SUPPORTED_FORMS[formularioId]) {
      return {
        supported: false,
        formularioId: formularioId,
        arquetipo: arquetipo,
        subcategoria: ident.subcategoria || ctx.subcategoria || '',
        subcategoriaId: ident.subcategoriaId || ctx.subcategoriaId || ''
      };
    }

    var base = FORM_BASE[formularioId] || [];
    var extrasMap = ARQUETIPO_EXTRA[formularioId] || {};
    var extras = extrasMap[arquetipo];
    if (!extras && formularioId === 'persona_independiente') {
      extras = extrasMap.persona_servicio_general || [];
    }
    if (!extras) extras = [];
    if (formularioId === 'negocio_empresa') {
      extras = mergeUnique(extras, IDENTITY_FIELDS);
    }
    var fieldIds = mergeUnique(base, extras);
    if (CFDI_FORMS[formularioId] && fieldIds.indexOf('deseoFacturar') >= 0) {
      fieldIds = mergeUnique(fieldIds, cfdiFieldsToMerge(formularioId));
    }

    var spec = {
      supported: true,
      formularioId: formularioId,
      arquetipo: arquetipo,
      subcategoria: ident.subcategoria || ctx.subcategoria || '',
      subcategoriaId: ident.subcategoriaId || ctx.subcategoriaId || '',
      fieldIds: fieldIds,
      bloqueOrder: BLOQUE_ORDER[formularioId] || BLOQUE_ORDER.persona_independiente
    };

    spec.fields = fieldIds.map(function (id) {
      var meta = FIELD_META[id] || { label: id, tipo: 'text', bloque: 'otros' };
      var label = meta.label;
      var overrides = FORM_LABEL_OVERRIDES[formularioId];
      if (overrides && overrides[id]) label = overrides[id];
      return {
        id: id,
        label: label,
        tipo: meta.tipo,
        bloque: fieldBloque(id, meta, formularioId),
        obligatorio: isFieldRequired(spec, id),
        condicionalFactura: isCfdiConditional(formularioId, id)
      };
    });

    return spec;
  }

  function groupByBloque(spec) {
    var groups = {};
    spec.fields.forEach(function (f) {
      if (!groups[f.bloque]) groups[f.bloque] = [];
      groups[f.bloque].push(f);
    });
    if (groups.cuenta) groups.cuenta = sortCuentaFields(groups.cuenta);
    return groups;
  }

  function sortCuentaFields(fields) {
    var rank = {};
    CUENTA_FIELD_ORDER.forEach(function (id, i) { rank[id] = i; });
    return fields.slice().sort(function (a, b) {
      var ra = rank[a.id] != null ? rank[a.id] : 900;
      var rb = rank[b.id] != null ? rank[b.id] : 900;
      return ra - rb;
    });
  }

  function renderSelectHtml(id, field, options) {
    var req = field.obligatorio ? ' <span class="rp-req-inline">*</span>' : '';
    var condClass = field.condicionalFactura ? ' rp-private-field--cfdi' : '';
    var opts = (options || []).map(function (o) {
      return '<option value="' + esc(o.v) + '">' + esc(o.l) + '</option>';
    }).join('');
    return (
      '<div class="rp-field' + condClass + '" data-campo="' + esc(field.id) + '">' +
      '<label for="' + id + '">' + esc(field.label) + req + '</label>' +
      '<select id="' + id + '" name="' + id + '">' + opts + '</select></div>'
    );
  }

  function renderFieldHtml(field, spec) {
    var id = fieldId(field.id);
    var req = field.obligatorio ? ' <span class="rp-req-inline">*</span>' : '';
    var condClass = field.condicionalFactura ? ' rp-private-field--cfdi' : '';

    if (field.tipo === 'terminos_link') {
      return (
        '<div class="rp-field rp-private-check rp-private-check--terminos' + condClass + '" data-campo="' + esc(field.id) + '">' +
        '<label class="rp-private-check__label rp-private-check__label--terminos">' +
        '<input type="checkbox" id="' + id + '" name="' + id + '">' +
        '<span><button type="button" class="rp-terminos-link-btn" data-terminos-trigger="' + id + '">Acepto</button> ' +
        esc(field.label) + req + '</span></label></div>'
      );
    }

    if (field.tipo === 'boolean') {
      return (
        '<div class="rp-field rp-private-check' + condClass + '" data-campo="' + esc(field.id) + '">' +
        '<label class="rp-private-check__label">' +
        '<input type="checkbox" id="' + id + '" name="' + id + '">' +
        '<span>' + esc(field.label) + req + '</span></label></div>'
      );
    }

    if (field.tipo === 'file') {
      var metaFile = FIELD_META[field.id] || {};
      return (
        '<div class="rp-field' + condClass + '" data-campo="' + esc(field.id) + '">' +
        '<label for="' + id + '_btn">' + esc(field.label) + req + '</label>' +
        '<input type="file" id="' + id + '" class="rp-hidden" accept="' + esc(metaFile.accept || 'image/*,.pdf') + '">' +
        '<button type="button" class="rp-btn rp-btn--ghost rp-private-file-btn" id="' + id + '_btn" data-input="' + id + '" style="width:100%">' +
        'Subir archivo</button></div>'
      );
    }

    if (field.tipo === 'select') {
      return renderSelectHtml(id, field, SELECT_OPTIONS[field.id]);
    }

    if (field.tipo === 'textarea') {
      var metaTa = FIELD_META[field.id] || {};
      return (
        '<div class="rp-field' + condClass + '" data-campo="' + esc(field.id) + '">' +
        '<label for="' + id + '">' + esc(field.label) + req + '</label>' +
        '<textarea id="' + id + '" name="' + id + '" rows="3" placeholder="' + esc(metaTa.placeholder || '') + '"></textarea></div>'
      );
    }

    if (field.tipo === 'number') {
      var metaNum = FIELD_META[field.id] || {};
      var minAttr = metaNum.min != null ? ' min="' + metaNum.min + '"' : '';
      var maxAttr = metaNum.max != null ? ' max="' + metaNum.max + '"' : '';
      return (
        '<div class="rp-field' + condClass + '" data-campo="' + esc(field.id) + '">' +
        '<label for="' + id + '">' + esc(field.label) + req + '</label>' +
        '<input type="number" id="' + id + '" name="' + id + '"' + minAttr + maxAttr +
        ' inputmode="numeric"></div>'
      );
    }

    if (field.tipo === 'date') {
      return (
        '<div class="rp-field' + condClass + '" data-campo="' + esc(field.id) + '">' +
        '<label for="' + id + '">' + esc(field.label) + req + '</label>' +
        '<input type="date" id="' + id + '" name="' + id + '" max="' + esc(getMaxBirthDate()) + '"></div>'
      );
    }

    if (field.tipo === 'password') {
      var metaPass = FIELD_META[field.id] || {};
      var hintId = id + '_hint';
      var initialHint = field.id === 'contrasenaAcceso'
        ? PASSWORD_REQUIREMENT_MSG : 'Confirma tu contraseña.';
      return (
        '<div class="rp-field' + condClass + '" data-campo="' + esc(field.id) + '">' +
        '<label for="' + id + '">' + esc(field.label) + req + '</label>' +
        '<span class="rp-password-toggle-wrap">' +
        '<input type="password" id="' + id + '" name="' + id + '" autocomplete="new-password"' +
        ' placeholder="' + esc(metaPass.placeholder || '') + '">' +
        '<button type="button" class="rp-password-toggle-btn" data-toggle-for="' + id + '" ' +
        'title="Mostrar contraseña" aria-label="Mostrar contraseña">🙈</button></span>' +
        '<p class="rp-password-hint rp-password-hint--muted" id="' + hintId + '" aria-live="polite">' +
        esc(initialHint) + '</p></div>'
      );
    }

    var metaInput = FIELD_META[field.id] || {};
    var inputType = field.tipo === 'email' ? 'email' : (field.tipo === 'tel' ? 'tel' : 'text');
    var inputMode = field.tipo === 'tel' ? ' inputmode="numeric"' : '';
    var maxLen = metaInput.maxLength ? ' maxlength="' + metaInput.maxLength + '"' : '';
    return (
      '<div class="rp-field' + condClass + '" data-campo="' + esc(field.id) + '">' +
      '<label for="' + id + '">' + esc(field.label) + req + '</label>' +
      '<input type="' + inputType + '" id="' + id + '" name="' + id + '"' +
      inputMode + maxLen +
      ' placeholder="' + esc(metaInput.placeholder || '') + '"></div>'
    );
  }

  function getMaxBirthDate() {
    var d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().slice(0, 10);
  }

  function nombrePersonalValido(valor) {
    var limpio = String(valor || '').trim();
    if (limpio.length < 5) return false;
    if (limpio.split(/\s+/).length < 2) return false;
    if (/^\d+$/.test(limpio)) return false;
    return true;
  }

  function edadDesdeFecha(fechaStr) {
    if (!fechaStr) return 0;
    var n = new Date(fechaStr);
    if (isNaN(n.getTime())) return 0;
    var hoy = new Date();
    var edad = hoy.getFullYear() - n.getFullYear();
    var m = hoy.getMonth() - n.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < n.getDate())) edad--;
    return edad;
  }

  function telefonoValido(valor) {
    var digits = String(valor || '').replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15;
  }

  function correoValido(valor) {
    var v = String(valor || '').trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function formatFieldError(label, msg) {
    return label + ' (' + msg + ')';
  }

  function bindFileField(input, btn) {
    if (!input || !btn || btn.dataset.rpPrivBound === '1') return;
    btn.dataset.rpPrivBound = '1';
    btn.addEventListener('click', function () { input.click(); });
    input.addEventListener('change', function () {
      var f = input.files && input.files[0];
      if (!f) return;
      btn.textContent = 'Archivo: ' + f.name;
      btn.classList.add('has-file');
      if (global.CariHubRegistroPerfilWizardCompress) {
        global.CariHubRegistroPerfilWizardCompress(f, 1200, 0.75, function (dataUrl) {
          btn.dataset.preview = dataUrl;
        });
      }
    });
  }

  function validarPasswordSegura(password) {
    return String(password || '').length >= PASSWORD_MIN_LENGTH
      && /[A-Za-z]/.test(password)
      && /[0-9]/.test(password)
      && /[!@#$%&*._-]/.test(password);
  }

  function setPasswordHint(el, text, tone) {
    if (!el) return;
    el.textContent = text;
    el.classList.remove('rp-password-hint--ok', 'rp-password-hint--err', 'rp-password-hint--muted');
    if (tone) el.classList.add('rp-password-hint--' + tone);
  }

  function syncPasswordAccessHints() {
    var passEl = $(fieldId('contrasenaAcceso'));
    var confEl = $(fieldId('confirmarContrasenaAcceso'));
    var passHint = $(fieldId('contrasenaAcceso') + '_hint');
    var confHint = $(fieldId('confirmarContrasenaAcceso') + '_hint');
    var pass = passEl ? passEl.value : '';
    var conf = confEl ? confEl.value : '';
    if (passHint) {
      if (!pass) setPasswordHint(passHint, PASSWORD_REQUIREMENT_MSG, 'muted');
      else if (validarPasswordSegura(pass)) setPasswordHint(passHint, 'Contraseña segura.', 'ok');
      else setPasswordHint(passHint, PASSWORD_REQUIREMENT_MSG, 'err');
    }
    if (confHint) {
      if (!conf) setPasswordHint(confHint, 'Confirma tu contraseña.', 'muted');
      else if (pass && pass === conf) setPasswordHint(confHint, 'Las contraseñas coinciden.', 'ok');
      else setPasswordHint(confHint, 'Las contraseñas no coinciden.', 'err');
    }
  }

  function bindPasswordToggleBtn(btn) {
    if (!btn || btn.dataset.rpBound === '1') return;
    btn.dataset.rpBound = '1';
    var inputId = btn.getAttribute('data-toggle-for');
    var input = $(inputId);
    if (!input) return;
    btn.addEventListener('click', function () {
      var visible = input.type === 'text';
      input.type = visible ? 'password' : 'text';
      var label = visible ? 'Mostrar contraseña' : 'Ocultar contraseña';
      btn.textContent = visible ? '🙈' : '🐵';
      btn.title = label;
      btn.setAttribute('aria-label', label);
    });
  }

  function bindTerminosTriggers(host) {
    if (!host) return;
    host.querySelectorAll('[data-terminos-trigger]').forEach(function (btn) {
      if (btn.dataset.rpBound === '1') return;
      btn.dataset.rpBound = '1';
      btn.addEventListener('click', function (ev) {
        ev.preventDefault();
        var targetId = btn.getAttribute('data-terminos-trigger');
        var chk = $(targetId);
        if (global.CariHubTerminosRegistro && CariHubTerminosRegistro.openTerminosModal) {
          CariHubTerminosRegistro.openTerminosModal(function () {
            if (chk) chk.checked = true;
          });
        }
      });
    });
  }

  function bindPasswordAccessFields(host) {
    if (!host) return;
    host.querySelectorAll('.rp-password-toggle-btn').forEach(bindPasswordToggleBtn);
    var passEl = $(fieldId('contrasenaAcceso'));
    var confEl = $(fieldId('confirmarContrasenaAcceso'));
    [passEl, confEl].forEach(function (el) {
      if (!el || el.dataset.rpPassListen === '1') return;
      el.dataset.rpPassListen = '1';
      el.addEventListener('input', syncPasswordAccessHints);
    });
    syncPasswordAccessHints();
  }

  function syncCfdiVisibility(host) {
    if (!host) return;
    var toggle = $(fieldId('deseoFacturar'));
    var cfdiFields = host.querySelectorAll('.rp-private-field--cfdi');
    var show = toggle && toggle.checked;
    cfdiFields.forEach(function (el) {
      el.classList.toggle('rp-hidden', !show);
    });
  }

  function bindPrivateForm(host, spec) {
    if (!host) return;
    host.querySelectorAll('.rp-private-file-btn').forEach(function (btn) {
      bindFileField($(btn.getAttribute('data-input')), btn);
    });
    var facturaToggle = $(fieldId('deseoFacturar'));
    if (facturaToggle) {
      facturaToggle.addEventListener('change', function () { syncCfdiVisibility(host); });
      syncCfdiVisibility(host);
    }
    bindPasswordAccessFields(host);
    bindTerminosTriggers(host);
  }

  function renderPrivateForm(host, ctx, saved) {
    host = host || $('rpPrivateDynamicHost');
    if (!host) return null;
    var spec = resolvePrivateSpec(ctx);
    saved = saved || {};

    if (!spec.supported) {
      host.innerHTML =
        '<div class="rp-card"><h2 class="rp-card__title">Datos privados</h2>' +
        '<p class="rp-notice">El formulario completo de verificación para <strong>' +
        esc(spec.formularioId || 'esta categoría') +
        '</strong> estará disponible pronto.</p></div>';
      return spec;
    }

    var groups = groupByBloque(spec);
    var html = '';
    spec.bloqueOrder.forEach(function (bloqueId) {
      if (bloqueId === 'legal') return;
      var fields = groups[bloqueId];
      if (!fields || !fields.length) return;
      html += '<div class="rp-card rp-private-block" data-bloque="' + esc(bloqueId) + '">';
      html += '<h2 class="rp-card__title">' + esc(BLOQUE_TITLES[bloqueId] || bloqueId) + '</h2>';
      if (bloqueId === 'cuenta') {
        html += '<p class="rp-notice rp-notice--cuenta">Tu <strong>alias público</strong> puede ser distinto. ' +
          'Con estos datos validamos tu identidad, te contactamos si hace falta y creamos tu acceso. ' +
          'Nada de esto se publica en tu perfil.</p>';
      }
      if (bloqueId === 'representante') {
        html += '<p class="rp-notice">Documento del representante legal para validación interna.</p>';
      }
      var accessDivider = false;
      fields.forEach(function (field) {
        if (bloqueId === 'cuenta' && field.id === 'correoAcceso' && !accessDivider) {
          html += '<p class="rp-private-subsection">Acceso a tu cuenta</p>';
          html += '<p class="rp-notice rp-notice--acceso">Entrarás con tu <strong>correo</strong> ' +
            'o tu <strong>teléfono</strong> y esta contraseña.</p>';
          accessDivider = true;
        }
        html += renderFieldHtml(field, spec);
      });
      html += '</div>';
    });

    host.innerHTML = html;
    bindPrivateForm(host, spec);
    restorePrivateValues(saved);
    if (global.CariHubTerminosRegistro && CariHubTerminosRegistro.bindTerminosModal) {
      CariHubTerminosRegistro.bindTerminosModal();
    }
    return spec;
  }

  function restorePrivateValues(saved) {
    if (!saved || typeof saved !== 'object') return;
    if (saved.correoPrivado && !saved.correoAcceso) saved.correoAcceso = saved.correoPrivado;
    Object.keys(saved).forEach(function (key) {
      if (PASSWORD_FIELDS.indexOf(key) >= 0) return;
      if (key === 'facturacion' && saved.facturacion && typeof saved.facturacion === 'object') {
        Object.keys(saved.facturacion).forEach(function (fk) { setFieldValue(fk, saved.facturacion[fk]); });
        return;
      }
      if (key === 'verificacion' && saved.verificacion && typeof saved.verificacion === 'object') {
        Object.keys(saved.verificacion).forEach(function (vk) { setFilePreview(vk, saved.verificacion[vk]); });
        return;
      }
      setFieldValue(key, saved[key]);
    });
    syncCfdiVisibility($('rpPrivateDynamicHost'));
  }

  function setFieldValue(campo, val) {
    var el = $(fieldId(campo));
    if (!el) return;
    if (el.type === 'checkbox') { el.checked = !!val; return; }
    if (el.type === 'file') { setFilePreview(campo, val); return; }
    el.value = val == null ? '' : String(val);
  }

  function setFilePreview(campo, dataUrl) {
    if (!dataUrl || typeof dataUrl !== 'string') return;
    var btn = $(fieldId(campo) + '_btn');
    if (btn) {
      btn.dataset.preview = dataUrl;
      btn.textContent = 'Archivo cargado';
      btn.classList.add('has-file');
    }
  }

  function collectPrivateFormData(includePasswords) {
    var spec = resolvePrivateSpec(
      global.CariHubRegistroPerfil && global.CariHubRegistroPerfil.getContext
        ? global.CariHubRegistroPerfil.getContext() : {}
    );
    if (!spec.supported) return {};

    var out = { verificacion: {}, facturacion: null, administracion: {} };
    var deseoFacturar = false;

    spec.fieldIds.forEach(function (campo) {
      var el = $(fieldId(campo));
      if (!el) return;
      var meta = FIELD_META[campo] || {};

      if (meta.tipo === 'boolean' || meta.tipo === 'terminos_link') {
        out[campo] = !!el.checked;
        if (campo === 'deseoFacturar') deseoFacturar = out[campo];
        return;
      }

      if (meta.tipo === 'file') {
        var btn = $(fieldId(campo) + '_btn');
        var preview = btn && btn.dataset.preview;
        if (preview) out.verificacion[campo] = preview;
        return;
      }

      var val = el.value != null ? String(el.value).trim() : '';
      if (PASSWORD_FIELDS.indexOf(campo) >= 0) {
        if (includePasswords) out[campo] = val;
        return;
      }
      if (ADMIN_META_FIELDS.indexOf(campo) >= 0) {
        out.administracion[campo] = val;
        out[campo] = val;
        return;
      }
      if (spec.formularioId === 'negocio_empresa' && (campo === 'rfc' || campo === 'razonSocial')) {
        out[campo] = val;
        return;
      }
      if (CFDI_FIELDS.indexOf(campo) >= 0) {
        if (!out._fiscal) out._fiscal = {};
        out._fiscal[campo] = val;
      } else {
        out[campo] = val;
      }
    });

    if (deseoFacturar && out._fiscal) out.facturacion = Object.assign({}, out._fiscal);
    if (deseoFacturar && spec.formularioId === 'negocio_empresa') {
      out.facturacion = out.facturacion || {};
      if (out.rfc) out.facturacion.rfc = out.rfc;
      if (out.razonSocial) out.facturacion.razonSocial = out.razonSocial;
    }
    delete out._fiscal;
    if (!Object.keys(out.verificacion).length) delete out.verificacion;
    if (!Object.keys(out.administracion).length) delete out.administracion;
    return out;
  }

  function sanitizePrivateForStorage(data) {
    data = data || {};
    var copy = Object.assign({}, data);
    PASSWORD_FIELDS.forEach(function (key) { delete copy[key]; });
    return copy;
  }

  function validatePasswordFields(data, missing) {
    var pass = data.contrasenaAcceso || '';
    var confirm = data.confirmarContrasenaAcceso || '';
    if (!validarPasswordSegura(pass)) missing.push(PASSWORD_REQUIREMENT_MSG);
    if (!confirm) missing.push(FIELD_META.confirmarContrasenaAcceso.label);
    else if (pass && pass !== confirm) missing.push('Las contraseñas no coinciden');
  }

  function validatePrivateForm(ctx) {
    var spec = resolvePrivateSpec(ctx);
    if (!spec.supported) return { ok: true, missing: [], spec: spec };

    var missing = [];
    var data = collectPrivateFormData(true);

    if (data.nombrePersonal && !nombrePersonalValido(data.nombrePersonal)) {
      missing.push('Nombre personal completo (nombre y apellido)');
    }
    if (data.responsable && !nombrePersonalValido(data.responsable)) {
      missing.push('Responsable / representante legal (nombre y apellido)');
    }
    if (data.fechaNacimiento && edadDesdeFecha(data.fechaNacimiento) < 18) {
      missing.push('Fecha de nacimiento (debes ser mayor de 18 años)');
    }

    spec.fields.forEach(function (field) {
      if (PASSWORD_FIELDS.indexOf(field.id) >= 0) return;
      if (!field.obligatorio) return;
      if (field.condicionalFactura && !data.deseoFacturar) return;
      if (field.id === 'consentimientoDual' && spec.arquetipo !== 'pareja_grupo') return;

      if (field.tipo === 'boolean' || field.tipo === 'terminos_link') {
        if (!data[field.id]) missing.push(field.label);
        return;
      }
      if (field.tipo === 'file') {
        if (!data.verificacion || !data.verificacion[field.id]) missing.push(field.label);
        return;
      }
      var val = data[field.id];
      if (field.condicionalFactura && data.deseoFacturar && data.facturacion) {
        val = data.facturacion[field.id];
      }
      if (!val) {
        missing.push(field.label);
        return;
      }
      if (field.tipo === 'tel' || CONTACT_PHONE_FIELDS.indexOf(field.id) >= 0) {
        if (!telefonoValido(val)) {
          missing.push(formatFieldError(field.label, '10–15 dígitos'));
        }
      }
      if (field.tipo === 'email' || field.id === 'emailFacturacion') {
        if (!correoValido(val)) {
          missing.push(formatFieldError(field.label, 'correo válido'));
        }
      }
    });

    validatePasswordFields(data, missing);

    if (data.deseoFacturar && CFDI_FORMS[spec.formularioId]) {
      var reqCfdi = ['rfc', 'razonSocial', 'domicilioFiscal', 'codigoPostalFiscal', 'nombreFiscal'];
      reqCfdi.forEach(function (campo) {
        var v = spec.formularioId === 'negocio_empresa'
          ? ((data.facturacion && data.facturacion[campo]) || data[campo])
          : (data.facturacion && data.facturacion[campo]);
        if (!v && FIELD_META[campo]) missing.push(FIELD_META[campo].label);
      });
      var emailFac = data.facturacion && data.facturacion.emailFacturacion;
      if (emailFac && !correoValido(emailFac)) {
        missing.push(formatFieldError(FIELD_META.emailFacturacion.label, 'correo válido'));
      }
    }

    return { ok: missing.length === 0, missing: missing, spec: spec, data: data };
  }

  global.CariHubPrivateFieldsLite = {
    resolvePrivateSpec: resolvePrivateSpec,
    renderPrivateForm: renderPrivateForm,
    collectPrivateFormData: collectPrivateFormData,
    sanitizePrivateForStorage: sanitizePrivateForStorage,
    validatePrivateForm: validatePrivateForm,
    validarPasswordSegura: validarPasswordSegura,
    telefonoValido: telefonoValido,
    correoValido: correoValido,
    restorePrivateValues: restorePrivateValues,
    nombrePersonalValido: nombrePersonalValido,
    edadDesdeFecha: edadDesdeFecha,
    FIELD_META: FIELD_META,
    PASSWORD_MIN_LENGTH: PASSWORD_MIN_LENGTH
  };
})(typeof window !== 'undefined' ? window : globalThis);
