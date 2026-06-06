function abrirLegal(tipo){

  const modal = document.getElementById("modalLegal");
  const tit = document.getElementById("legalTitulo");
  const cont = document.getElementById("legalContenido");

  if(!modal || !tit || !cont){
    console.error("Sistema legal no encontrado");
    alert("Sistema legal no encontrado");
    return;
  }

  const textos = {

    terminos:{
      titulo:"📜 Términos y Condiciones",
      contenido:`
<p>
El uso de CariHub implica aceptación total de los términos y condiciones de la plataforma.
</p>

<p>
Solo personas mayores de 18 años pueden utilizar el sitio.
</p>

<p>
Está prohibido:
<br>• contenido ilegal
<br>• fraude
<br>• spam
<br>• menores de edad
<br>• suplantación
<br>• fotos robadas
<br>• actividades ilícitas
</p>

<p>
CariHub podrá eliminar perfiles, anuncios o cuentas sin previo aviso.
</p>
`
    },

    privacidad:{
      titulo:"🔒 Política de Privacidad",
      contenido:`
<p>
CariHub puede almacenar información como:
</p>

<p>
• correo electrónico
<br>• WhatsApp
<br>• verificaciones
<br>• IP
<br>• cookies
<br>• actividad dentro de la plataforma
</p>

<p>
La información privada no será vendida públicamente.
</p>

<p>
Los usuarios aceptan el almacenamiento y procesamiento de datos necesarios para operar la plataforma.
</p>
`
    },

    anuncios:{
      titulo:"📢 Términos de Anuncios y Publicidad",
      contenido:`
<p>
Los pagos de banners, promociones o destacados corresponden únicamente a servicios digitales de visibilidad.
</p>

<p>
CariHub no garantiza resultados comerciales.
</p>

<p>
La plataforma podrá rechazar o eliminar publicidad sin previo aviso.
</p>
`
    },
    uso:{
  titulo:"⚠️ Condiciones de Uso",
  contenido:`
<p>
El sitio es exclusivo para mayores de 18 años.
</p>

<p>
El usuario acepta utilizar la plataforma bajo su propia responsabilidad.
</p>

<p>
Está prohibido:
<br>• contenido ilegal
<br>• fraude
<br>• menores de edad
<br>• trata
<br>• explotación
<br>• spam
<br>• contenido falso
</p>

<p>
CariHub no participa en acuerdos privados, pagos o encuentros entre usuarios.
</p>
`
},

    normas:{
      titulo:"⚠️ Normas de Publicación",
      contenido:`
<p>
Está prohibido publicar:
</p>

<p>
• menores de edad
<br>• contenido falso
<br>• fotos robadas
<br>• spam
<br>• violencia
<br>• fraude
<br>• contenido ilegal
</p>

<p>
CariHub podrá suspender cuentas permanentemente.
</p>
`
    },

    legal:{
      titulo:"⚖️ Aviso Legal",
      contenido:`
<p>
CariHub funciona únicamente como plataforma digital de publicación.
</p>

<p>
CariHub no participa en acuerdos privados entre usuarios.
</p>

<p>
Cada usuario es totalmente responsable de sus acciones, publicaciones y acuerdos externos.
</p>
`
    },

    pagos:{
      titulo:"💳 Pagos y Renovaciones",
      contenido:`
<p>
Los pagos realizados dentro de la plataforma corresponden a servicios digitales.
</p>

<p>
No existen garantías comerciales.
</p>

<p>
Las renovaciones pueden suspenderse por:
</p>

<p>
• incumplimientos
<br>• denuncias
<br>• fraude
<br>• violaciones de normas
</p>
`
    },

    verificacion:{
      titulo:"🛡️ Política de Verificación",
      contenido:`
<p>
Las verificaciones pueden incluir:
</p>

<p>
• INE
<br>• selfie
<br>• validación manual
<br>• revisión administrativa
</p>

<p>
CariHub podrá rechazar verificaciones sin obligación de aprobación.
</p>
`
    },
perfiles:{
  titulo:"👤 Términos y Condiciones de Perfiles",
  contenido:`

<p>
Toda persona que publique un perfil en CariHub declara bajo protesta de decir verdad que:
</p>

<p>
• es mayor de 18 años
<br>• publica voluntariamente
<br>• posee autorización sobre sus imágenes
<br>• la información proporcionada es auténtica
</p>

<p>
CariHub podrá solicitar verificaciones, ocultar perfiles, limitar visibilidad o eliminar contenido sin previo aviso.
</p>

<p>
CariHub no garantiza resultados, contactos, ingresos ni acuerdos entre usuarios.
</p>

`
},
copyright:{
  titulo:"©️ Política de Copyright y Contenido Robado",
  contenido:`

<p>
Está prohibido publicar imágenes robadas, contenido sin autorización o material protegido por derechos de autor.
</p>

<p>
CariHub podrá eliminar contenido, suspender cuentas y colaborar con investigaciones legales si detecta infracciones graves.
</p>

<p>
Los usuarios son totalmente responsables del contenido que publican.
</p>

`
},
antifraude:{
  titulo:"🚨 Política Anti Fraude",
  contenido:`

<p>
CariHub podrá suspender, limitar o eliminar cuentas sospechosas de fraude, engaños, extorsión, spam o actividades ilícitas.
</p>

<p>
Está prohibido:
</p>

<p>
• perfiles falsos
<br>• suplantación
<br>• fraude económico
<br>• engaños
<br>• bots
<br>• spam masivo
</p>

<p>
La plataforma podrá conservar evidencia y colaborar con autoridades si es requerido legalmente.
</p>

`
},
moderacion:{
  titulo:"🧠 Política de Moderación",
  contenido:`

<p>
CariHub podrá revisar manual o automáticamente perfiles, imágenes, anuncios, mensajes y contenido publicado dentro de la plataforma.
</p>

<p>
La plataforma podrá:
</p>

<p>
• ocultar perfiles
<br>• limitar visibilidad
<br>• rechazar publicaciones
<br>• suspender cuentas
<br>• eliminar contenido
</p>

<p>
Las decisiones de moderación podrán realizarse por motivos de seguridad, legalidad, reputación o prevención de abuso.
</p>

`
},
consentimiento:{
  titulo:"✍️ Consentimiento Digital",
  contenido:`

<p>
Toda persona que utilice CariHub acepta digitalmente los términos, políticas y normas de la plataforma.
</p>

<p>
El usuario declara:
</p>

<p>
• ser mayor de edad
<br>• actuar voluntariamente
<br>• comprender el funcionamiento del sitio
<br>• aceptar almacenamiento digital de información
</p>

<p>
El uso continuo de la plataforma constituye aceptación legal y digital de estas condiciones.
</p>

`
},
antifraude:{
  titulo:"🚨 Política Anti Fraude",
  contenido:`

<p>
CariHub prohíbe estrictamente cualquier tipo de fraude dentro de la plataforma.
</p>

<p>
Incluye:
</p>

<p>
• perfiles falsos
<br>• suplantación de identidad
<br>• fraude económico
<br>• engaños
<br>• bots
<br>• spam masivo
</p>

<p>
La plataforma podrá congelar, limitar, ocultar o eliminar cuentas sospechosas sin previo aviso.
</p>

<p>
CariHub podrá colaborar con autoridades en casos graves o actividades posiblemente ilícitas.
</p>

`
},
moderacion:{
  titulo:"🧠 Política de Moderación",
  contenido:`

<p>
CariHub podrá revisar manual o automáticamente perfiles, fotografías, anuncios, mensajes y contenido publicado dentro de la plataforma.
</p>

<p>
La moderación puede incluir:
</p>

<p>
• revisión manual administrativa
<br>• detección de spam
<br>• análisis anti fraude
<br>• verificación de imágenes
<br>• revisión de denuncias
<br>• limitación temporal de perfiles
</p>

<p>
CariHub podrá ocultar, restringir o eliminar contenido que considere riesgoso, engañoso, ilegal o contrario a las normas internas.
</p>

<p>
Las decisiones de moderación podrán aplicarse sin previo aviso para proteger la seguridad de la plataforma.
</p>

`
},
consentimiento:{
  titulo:"✍️ Consentimiento Digital",
  contenido:`

<p>
Al utilizar CariHub y publicar contenido dentro de la plataforma, el usuario declara y acepta voluntariamente:
</p>

<p>
• ser mayor de 18 años
<br>• publicar bajo su propia responsabilidad
<br>• autorizar el uso digital de sus imágenes y contenido dentro de la plataforma
<br>• aceptar revisión administrativa y moderación
<br>• aceptar términos, políticas y normas internas
</p>

<p>
El usuario reconoce que el contenido publicado puede ser visible públicamente en internet.
</p>

<p>
CariHub podrá almacenar evidencia digital relacionada con publicaciones, verificaciones, denuncias o actividad dentro de la plataforma.
</p>

`
},
jurisdiccion:{
  titulo:"⚖️ Jurisdicción Legal",
  contenido:`

<p>
El uso de CariHub se regirá conforme a las leyes aplicables del país y jurisdicción correspondiente donde opere la plataforma.
</p>

<p>
Cualquier conflicto, reclamación o controversia relacionada con el uso del sitio podrá ser atendida conforme a la legislación aplicable y autoridades competentes.
</p>

<p>
El usuario acepta que CariHub funciona únicamente como plataforma digital de publicación y contacto.
</p>

<p>
La utilización del sitio implica aceptación total de las políticas, términos y condiciones legales aquí establecidos.
</p>

`
},
premium:{
  titulo:"📢 Términos para Anuncios Premium, Banners y Destacados",
  contenido:`

<p>
Los servicios de banners, promociones, anuncios premium o perfiles destacados corresponden únicamente a servicios digitales de visibilidad dentro de la plataforma.
</p>

<p>
CariHub no garantiza:
</p>

<p>
• clientes
<br>• contactos
<br>• ventas
<br>• ingresos
<br>• posicionamiento permanente
<br>• resultados comerciales
</p>

<p>
La plataforma podrá rechazar, pausar, limitar o eliminar publicidad que incumpla políticas internas o represente riesgos legales o de seguridad.
</p>

<p>
Los pagos realizados por servicios digitales podrán considerarse no reembolsables una vez iniciado el periodo contratado.
</p>

<p>
CariHub no será responsable por acuerdos, pagos, conflictos o actividades realizadas entre usuarios o terceros fuera de la plataforma.
</p>

`
},
verificacion_avanzada:{
  titulo:"🛡️ Política Avanzada de Verificación",
  contenido:`

<p>
CariHub podrá solicitar procesos de verificación adicionales para validar identidad, autenticidad, consentimiento o legitimidad de perfiles y anunciantes.
</p>

<p>
Las verificaciones podrán incluir:
</p>

<p>
• identificación oficial
<br>• selfie manual
<br>• validación administrativa
<br>• revisión de actividad
<br>• revisión de imágenes
<br>• comprobación de autenticidad
</p>

<p>
La aprobación de verificaciones queda bajo criterio interno de la plataforma.
</p>

<p>
CariHub podrá rechazar verificaciones, solicitar información adicional o limitar funciones del perfil si detecta inconsistencias, riesgos o sospechas de fraude.
</p>

<p>
La verificación no constituye garantía absoluta sobre la conducta futura de los usuarios.
</p>

`
},
contenido_prohibido:{
  titulo:"🚫 Política de Contenido Prohibido",
  contenido:`

<p>
Está estrictamente prohibido publicar, compartir, promocionar o distribuir contenido relacionado con:
</p>

<p>
• menores de edad
<br>• trata o explotación
<br>• violencia ilegal
<br>• contenido no consensuado
<br>• fraude
<br>• extorsión
<br>• spam masivo
<br>• malware
<br>• enlaces maliciosos
<br>• documentos falsos
<br>• actividades criminales
</p>

<p>
CariHub podrá eliminar contenido inmediatamente, bloquear cuentas y conservar evidencia digital cuando detecte posibles incumplimientos.
</p>

<p>
La plataforma podrá colaborar con autoridades competentes cuando sea legalmente requerido.
</p>

`
},
reembolsos:{
  titulo:"💳 Política de Pagos, Renovaciones y Reembolsos",
  contenido:`

<p>
Los pagos realizados dentro de CariHub corresponden exclusivamente a servicios digitales de publicación, visibilidad o promoción dentro de la plataforma.
</p>

<p>
CariHub no garantiza:
</p>

<p>
• resultados comerciales
<br>• contactos
<br>• ingresos
<br>• clientes
<br>• permanencia de perfiles
</p>

<p>
Los pagos podrán considerarse no reembolsables una vez activado o iniciado el servicio digital contratado.
</p>

<p>
CariHub podrá suspender renovaciones, limitar publicaciones o cancelar servicios si detecta:
</p>

<p>
• fraude
<br>• denuncias graves
<br>• incumplimientos
<br>• actividad sospechosa
<br>• violaciones legales o internas
</p>

<p>
Los usuarios aceptan utilizar la plataforma bajo su propia responsabilidad financiera y comercial.
</p>

`
},
responsabilidad:{
  titulo:"⚠️ Limitación de Responsabilidad",
  contenido:`

<p>
CariHub funciona únicamente como plataforma digital de publicación y contacto entre usuarios.
</p>

<p>
CariHub no administra, supervisa ni participa en:
</p>

<p>
• acuerdos privados
<br>• pagos externos
<br>• transferencias
<br>• encuentros
<br>• negociaciones
<br>• actividades realizadas fuera de la plataforma
</p>

<p>
Cada usuario es totalmente responsable de sus acciones, publicaciones, acuerdos y actividades.
</p>

<p>
CariHub no será responsable por:
</p>

<p>
• pérdidas económicas
<br>• fraudes
<br>• daños directos o indirectos
<br>• conflictos entre usuarios
<br>• uso indebido de información
<br>• actividades realizadas fuera del sitio
</p>

<p>
El uso de la plataforma implica aceptación total de estas limitaciones de responsabilidad.
</p>

`
},
seguridad:{
  titulo:"🔐 Política de Seguridad y Evidencia Digital",
  contenido:`

<p>
CariHub podrá almacenar registros técnicos, actividad de cuentas, evidencias digitales, direcciones IP, historiales de acceso, denuncias y registros administrativos para fines de seguridad, moderación y cumplimiento legal.
</p>

<p>
La plataforma podrá utilizar:
</p>

<p>
• registros internos
<br>• sistemas automáticos
<br>• herramientas anti fraude
<br>• moderación manual
<br>• validaciones administrativas
</p>

<p>
CariHub podrá conservar evidencia relacionada con:
</p>

<p>
• denuncias
<br>• actividad sospechosa
<br>• fraude
<br>• contenido prohibido
<br>• incumplimientos legales
</p>

<p>
La información podrá ser utilizada para proteger la seguridad de la plataforma y colaborar con autoridades cuando sea legalmente requerido.
</p>

`
},
antibots:{
  titulo:"🤖 Política Anti Bots y Uso Automatizado",
  contenido:`

<p>
Está prohibido utilizar bots, scrapers, automatizaciones abusivas, herramientas masivas o sistemas automatizados que afecten la estabilidad, seguridad o funcionamiento de CariHub.
</p>

<p>
Incluye:
</p>

<p>
• scraping masivo
<br>• extracción automatizada de perfiles
<br>• spam automatizado
<br>• creación masiva de cuentas
<br>• ataques de tráfico
<br>• automatizaciones maliciosas
</p>

<p>
CariHub podrá limitar tráfico, bloquear accesos, suspender cuentas o restringir conexiones sospechosas automáticamente.
</p>

<p>
La plataforma podrá utilizar herramientas de protección, análisis de tráfico y sistemas anti abuso para proteger la infraestructura.
</p>

`
},
publico:{
  titulo:"🌐 Política de Contenido Público e Indexación",
  contenido:`

<p>
El usuario reconoce y acepta que cierta información publicada dentro de CariHub puede ser visible públicamente en internet.
</p>

<p>
Esto puede incluir:
</p>

<p>
• alias
<br>• fotografías públicas
<br>• ciudad
<br>• categoría
<br>• descripciones
<br>• anuncios
<br>• perfiles destacados
</p>

<p>
Los perfiles públicos podrán ser indexados por motores de búsqueda, sistemas automáticos o tecnologías de internet.
</p>

<p>
CariHub no garantiza eliminación inmediata de contenido previamente indexado por terceros, buscadores o sistemas externos.
</p>

<p>
El usuario acepta publicar contenido bajo su propia responsabilidad y autorización.
</p>

`
},
  };

  if(!textos[tipo]){
    console.error("Sección legal no encontrada:", tipo);
    alert("Sección legal no encontrada");
    return;
  }

  tit.innerText = textos[tipo].titulo;
  cont.innerHTML = textos[tipo].contenido;

  modal.style.display = "flex";
}

function cerrarLegal(){

  const modal = document.getElementById("modalLegal");

  if(modal){
    modal.style.display = "none";
  }

}