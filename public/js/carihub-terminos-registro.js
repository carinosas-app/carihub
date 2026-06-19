(function (global) {
  'use strict';

  var TERMINOS_COMPLETOS =
    'TÉRMINOS, CONDICIONES, PRIVACIDAD Y NORMas DE CARIHUB / CARIÑOSAS\n\n' +
    'Última actualización: junio 2026. Al registrarte aceptas este documento completo.\n\n' +
    '1. NATURALEZA DEL SERVICIO\n' +
    'CariHub y Cariñosas son plataformas digitales de directorio, publicación de perfiles y contacto entre adultos. ' +
    'No somos agencia, empleador, intermediario de servicios personales, organizador de encuentros ni parte de acuerdos ' +
    'entre usuarios. Cada anunciante o perfil publicado es responsable de su información, imágenes, edad declarada, ' +
    'autorizaciones legales y contenido.\n\n' +
    '2. MAYORÍA DE EDAD Y VERACIDAD\n' +
    'El acceso y registro están reservados exclusivamente a personas mayores de 18 años. Declaras bajo tu responsabilidad ' +
    'que la información privada (nombre personal, fecha de nacimiento, identificación, domicilio y documentos) es veraz ' +
    'y corresponde a la persona titular del perfil o al representante legal autorizado. El alias o nombre público puede ' +
    'ser distinto del nombre legal cuando la ley lo permita; la verificación administrativa cotejará identidad con INE, ' +
    'cédula profesional u otros documentos exigidos según categoría.\n\n' +
    '3. PERFILES PERSONALES, PROFESIONALES Y NEGOCIOS\n' +
    'Según subcategoría podrás publicar como persona independiente, profesionista con cédula, negocio o entretenimiento ' +
    'para adultos. Debes cumplir la normativa aplicable a tu giro. Profesionistas de salud, derecho, contabilidad u otros ' +
    'oficios regulados deben contar con título, cédula o permiso vigente cuando corresponda. Negocios deben acreditar ' +
    'representante legal, RFC, licencias o permisos de operación cuando el giro lo exija.\n\n' +
    '4. DATOS PÚBLICOS VS PRIVADOS\n' +
    'Los datos públicos (alias, fotos, descripción, tarifas, horarios, zona, contacto visible) se muestran en directorio ' +
    'y resultados. Los datos privados (nombre personal, domicilio, correos y teléfonos privados, documentos de identidad, ' +
    'selfie de verificación, comprobante de domicilio, datos fiscales) solo los utiliza administración para validación, ' +
    'seguridad, facturación y soporte; no se publican salvo obligación legal.\n\n' +
    '5. POLÍTICA DE PRIVACIDAD\n' +
    'Recopilamos datos necesarios para operar: alias, correo, teléfono, ubicación declarada, imágenes, mensajes de contacto, ' +
    'datos de verificación y metadatos de uso. Usamos esta información para registro, revisión manual, publicación tras ' +
    'aprobación, seguridad, prevención de fraude, soporte, estadísticas agregadas y cumplimiento legal. No vendemos datos ' +
    'personales. El titular acepta que los datos públicos de su perfil sean visibles dentro de la plataforma.\n\n' +
    '6. CONDICIONES DE USO\n' +
    'Usarás la plataforma bajo tu exclusiva responsabilidad. Queda prohibido publicar contenido falso, robado, de menores, ' +
    'obtenido sin consentimiento, ilegal, que implique trata, coerción, explotación, fraude, suplantación o actividades ' +
    'prohibidas por ley. CariHub no participa en conversaciones privadas, pagos entre usuarios ni encuentros fuera del sitio.\n\n' +
    '7. NORMas DE PUBLICACIÓN E IMÁGENES\n' +
    'Solo puedes subir fotos y textos de los que tengas derechos o autorización expresa. No se permiten imágenes engañosas, ' +
    'perfiles duplicados fraudulentos ni publicidad de servicios ilegales. La plataforma puede solicitar evidencias adicionales.\n\n' +
    '8. REVISIÓN MANUAL Y PERIODO DE PRUEBA\n' +
    'Toda solicitud de registro pasa por revisión administrativa antes de publicarse. Si se aprueba, podrás recibir un ' +
    'periodo promocional de publicación (por ejemplo, primer mes gratis), sujeto a políticas vigentes. La plataforma puede ' +
    'rechazar, suspender o eliminar perfiles que incumplan estas reglas o representen riesgo, sin reembolso de servicios ' +
    'digitales ya consumidos salvo disposición legal en contrario.\n\n' +
    '9. FACTURACIÓN CFDI\n' +
    'Si solicitas factura, proporcionarás RFC, razón social o nombre fiscal, domicilio fiscal y demás datos requeridos por ' +
    'la legislación mexicana. La emisión de CFDI podrá realizarse tras aprobación del servicio y confirmación de pago cuando aplique.\n\n' +
    '10. LIMITACIÓN DE RESPONSABILIDAD\n' +
    'CariHub funciona como medio de publicación y contacto. No garantiza resultados comerciales, disponibilidad permanente ' +
    'ni veracidad de datos declarados por terceros. Cualquier acuerdo, pago o relación entre usuarios ocurre bajo responsabilidad ' +
    'exclusiva de las partes.\n\n' +
    '11. MODIFICACIONES\n' +
    'Podemos actualizar estos términos. El uso continuado tras cambios implica aceptación de la versión publicada.\n\n' +
    'Al marcar «Acepto» confirmas que leíste este documento, que eres mayor de edad, que tus datos son veraces y que ' +
    'autorizas la revisión de tu solicitud antes de publicarse.';

  function openTerminosModal(onAccept) {
    var modal = document.getElementById('rpTerminosModal');
    if (!modal) return;
    var body = document.getElementById('rpTerminosModalBody');
    if (body) body.textContent = TERMINOS_COMPLETOS;
    var chk = document.getElementById('rpTerminosModalCheck');
    var btn = document.getElementById('rpTerminosModalAccept');
    if (chk) chk.checked = false;
    if (btn) btn.disabled = true;
    modal._onAccept = typeof onAccept === 'function' ? onAccept : null;
    modal.classList.remove('rp-hidden');
  }

  function closeTerminosModal() {
    var modal = document.getElementById('rpTerminosModal');
    if (modal) modal.classList.add('rp-hidden');
  }

  function bindTerminosModal() {
    var modal = document.getElementById('rpTerminosModal');
    if (!modal || modal.dataset.rpBound === '1') return;
    modal.dataset.rpBound = '1';
    var backdrop = document.getElementById('rpTerminosModalBackdrop');
    var closeBtn = document.getElementById('rpTerminosModalClose');
    var chk = document.getElementById('rpTerminosModalCheck');
    var btn = document.getElementById('rpTerminosModalAccept');
    if (backdrop) backdrop.addEventListener('click', closeTerminosModal);
    if (closeBtn) closeBtn.addEventListener('click', closeTerminosModal);
    if (chk && btn) {
      chk.addEventListener('change', function () {
        btn.disabled = !chk.checked;
      });
      btn.addEventListener('click', function () {
        if (!chk || !chk.checked) return;
        if (modal._onAccept) modal._onAccept();
        closeTerminosModal();
      });
    }
  }

  global.CariHubTerminosRegistro = {
    TERMINOS_COMPLETOS: TERMINOS_COMPLETOS,
    openTerminosModal: openTerminosModal,
    closeTerminosModal: closeTerminosModal,
    bindTerminosModal: bindTerminosModal
  };
})(typeof window !== 'undefined' ? window : globalThis);
