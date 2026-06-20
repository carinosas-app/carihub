import fs from 'fs';

const newBody = `<body class="dash-pro">
<div class="pro-scale-viewport" id="proScaleViewport">
<div class="pro-canvas" id="proCanvas">

<header class="pro-hdr">
  <div class="pro-hdr__logo"><i>♥</i> Cariñosas</div>
  <label class="pro-hdr__search">
    <span aria-hidden="true">🔍</span>
    <input type="search" placeholder="Buscar negocios, servicios, categorías…" disabled>
  </label>
  <div class="pro-hdr__actions">
    <button class="pro-ic" type="button" id="btnDashNotificaciones" aria-label="Notificaciones">🔔<span class="badge" id="dashNotifBadge">3</span></button>
    <button class="pro-ic" type="button" id="btnDashMensajes" aria-label="Mensajes">💬<span class="badge">12</span></button>
    <button class="pro-btn-pub" type="button" onclick="location.href='registro-perfil.html'">+ Nueva publicación</button>
    <div class="pro-hdr__user">
      <img id="avatarImage" src="" alt="Perfil activo">
      <div>
        <b id="sideName">Valentina</b>
        <small id="sideAccountStatus">Cuenta verificada</small>
      </div>
      <button class="menu-btn" id="dashMenuBtn" type="button" aria-label="Menú">☰</button>
    </div>
  </div>
</header>

<div class="dash-aviso dash-aviso--ok hidden" id="dashAvisoEntrada" role="status" aria-live="polite"></div>

<main class="pro-body dashboard-rentero">

  <aside class="pro-left dashboard-col dashboard-left">
    <button class="pro-nav on" type="button"><span class="ic">🏠</span> Inicio</button>
    <button class="pro-nav" type="button" onclick="location.href='resultados.html'"><span class="ic">📋</span> Directorio</button>
    <button class="pro-nav" type="button" id="btnNavMensajes"><span class="ic">💬</span> Mensajes <span class="nb">12</span></button>
    <button class="pro-nav" type="button"><span class="ic">🔔</span> Notificaciones <span class="nb">8</span></button>
    <button class="pro-nav" type="button"><span class="ic">📢</span> Mis publicaciones</button>
    <button class="pro-nav" type="button"><span class="ic">🛎️</span> Mis servicios</button>
    <button class="pro-nav" type="button"><span class="ic">📈</span> Estadísticas</button>
    <button class="pro-nav" type="button"><span class="ic">❤️</span> Favoritos</button>
    <button class="pro-nav" type="button"><span class="ic">🔖</span> Guardados</button>
    <div class="pro-sep"></div>
    <div class="pro-nav-label">Categorías</div>
    <button class="pro-nav" type="button" style="font-size:11px;padding:6px 10px"><span class="ic">🚗</span> Automotriz</button>
    <button class="pro-nav" type="button" style="font-size:11px;padding:6px 10px"><span class="ic">💆</span> Belleza y Salud</button>
    <button class="pro-nav" type="button" style="font-size:11px;padding:6px 10px"><span class="ic">🎭</span> Entretenimiento</button>

    <div class="pro-pub-block panel glass">
      <div class="section-title">
        <div><h3>Mis publicaciones</h3><p>Selecciona una para administrar</p></div>
      </div>
      <div class="publication-list" id="publicationList"></div>
    </div>

    <div class="action-stack" style="margin-top:8px">
      <button class="btn" type="button" onclick="location.href='registro-perfil.html'">+ Nuevo perfil</button>
      <button class="btn secondary" type="button" onclick="location.href='registro-banner.html'">+ Nuevo banner</button>
    </div>

    <div class="pro-premium">
      <b>⭐ Plan Premium</b>
      <p>Destaca tu perfil y obtén más visitas en resultados.</p>
      <button class="btn" type="button">Mejora tu plan</button>
    </div>
  </aside>

  <section class="pro-main dashboard-col dashboard-center">
    <div class="pro-quick">
      <div class="pro-quick-item" onclick="location.href='registro-perfil.html'"><div class="qi">👤</div><span>Mi Perfil</span></div>
      <div class="pro-quick-item" onclick="location.href='registro-banner.html'"><div class="qi">🖼️</div><span>Mi Banner</span></div>
      <div class="pro-quick-item"><div class="qi">📞</div><span>Contacto</span></div>
      <div class="pro-quick-item"><div class="qi">📊</div><span>Estadísticas</span></div>
      <div class="pro-quick-item"><div class="qi">🤝</div><span>Mi Red</span></div>
      <div class="pro-quick-item" onclick="document.getElementById('dashMenuPanel').classList.toggle('hidden')"><div class="qi">⚙️</div><span>Config</span></div>
    </div>

    <section class="panel glass dash-center-toolbar">
      <div>
        <h2 id="centerPubTitle">Vista previa de tu perfil</h2>
        <p id="centerPubSubtitle">Así te ven en el directorio</p>
      </div>
      <div class="dash-toolbar-actions">
        <button class="btn secondary" type="button" id="btnDashVerGrande">Ver en grande</button>
      </div>
    </section>

    <section class="dash-profile-preview-wrap" id="dashPreviewWrap">
      <iframe id="dashPerfilPreviewFrame" title="Vista previa del perfil público" loading="lazy"></iframe>
    </section>

    <section class="thumb-grid" id="thumbGrid" aria-label="Galería"></section>

    <section class="panel glass">
      <div class="section-title"><div><h2>Actividad de tu red</h2><p>Estados y lives</p></div></div>
      <div class="pro-stories" id="dashMisEstados"></div>
      <div class="action-stack" style="margin-top:8px">
        <button class="btn secondary" type="button" id="btnPublicarEstado">Publicar estado</button>
        <button class="btn secondary" type="button" id="btnIniciarLive">Iniciar live</button>
      </div>
    </section>

    <section class="panel glass">
      <div class="pro-tabs">
        <button class="pro-tab on" type="button">Todas</button>
        <button class="pro-tab" type="button">Estados</button>
        <button class="pro-tab" type="button">Lives</button>
        <button class="pro-tab" type="button">Solicitudes</button>
      </div>
      <div class="dash-geo-search" id="dashGeoSearch">
        <button type="button" class="dash-geo-btn" data-geo="categoria">Cat. <span id="dashGeoCat">Todas</span></button>
        <button type="button" class="dash-geo-btn" data-geo="pais">País <span id="dashGeoPais">México</span></button>
        <button type="button" class="dash-geo-btn" data-geo="estado">Edo. <span id="dashGeoEstado">Nuevo León</span></button>
        <button type="button" class="dash-geo-btn" data-geo="ciudad">Cd. <span id="dashGeoCiudad">Monterrey</span></button>
        <button type="button" class="btn" id="btnBuscarRed">Buscar</button>
      </div>
      <div class="dash-feed-list" id="dashRedFeed"></div>
    </section>
  </section>

  <aside class="pro-right dashboard-col dashboard-right">
    <div class="stat-grid">
      <div class="stat"><small>Vistas</small><b id="metricCorazones">248</b></div>
      <div class="stat"><small>Contactos</small><b id="metricWhatsapp">112</b></div>
      <div class="stat"><small>Favoritos</small><b>128</b></div>
      <div class="stat"><small>Mensajes</small><b id="metricMensajes">36</b></div>
    </div>
    <button class="btn" type="button" style="width:100%;margin-bottom:10px" onclick="document.getElementById('btnDashVerGrande').click()">Ver mi perfil público</button>

    <section class="panel glass">
      <div class="section-title">
        <div><h2>Editar perfil</h2><p>Información pública</p></div>
        <button class="btn secondary" type="button" id="btnEditarInfoPublica">✏️</button>
      </div>
      <div class="edit-tabs">
        <button class="edit-tab on" type="button">Información</button>
        <button class="edit-tab" type="button">Servicios</button>
        <button class="edit-tab" type="button">Galería</button>
        <button class="edit-tab" type="button">Reseñas</button>
      </div>
      <div class="info-grid" id="infoGrid"></div>
    </section>

    <section class="panel glass">
      <div class="section-title">
        <div><h2>Métodos de contacto</h2><p>Visibles en tu perfil</p></div>
        <button class="btn secondary" type="button" id="btnGuardarContactos">Guardar</button>
      </div>
      <div class="contacts contacts--stack" id="contactsGrid"></div>
    </section>

    <div class="dash-menu-panel hidden" id="dashMenuPanel" aria-label="Menú de cuenta">
      <button type="button" data-menu="config">⚙️ Configuración de cuenta</button>
      <button type="button" data-menu="apariencia">🎨 Apariencia del perfil</button>
      <button type="button" data-menu="notificaciones">🔔 Notificaciones</button>
      <button type="button" data-menu="privacidad">🔒 Privacidad y seguridad</button>
      <button type="button" data-menu="pagos">💳 Pagos y planes</button>
      <button type="button" data-menu="red">🤝 Red y solicitudes</button>
      <button type="button" data-menu="editar">✏️ Editar perfil</button>
      <button type="button" data-menu="ver-publico">👁 Ver perfil público</button>
      <button type="button" data-menu="soporte">💬 Ayuda y soporte</button>
      <button type="button" data-menu="cerrar">🚪 Cerrar sesión</button>
    </div>
    <div class="theme-picker" id="themePicker" aria-hidden="true">
      <button class="theme-option active" type="button" data-theme="">Oscuro pro</button>
    </div>

    <section class="panel glass">
      <div class="section-title"><div><h2>Resumen</h2></div></div>
      <div class="quick-summary" id="quickSummary"></div>
    </section>

    <section class="panel glass">
      <div class="section-title"><div><h2>Seguridad</h2></div></div>
      <div class="security-list">
        <div class="security-line">✅ Cuenta con acceso seguro</div>
        <div class="security-line">🛡️ Cambios sujetos a revisión</div>
        <div class="security-line">🔒 Datos privados protegidos</div>
      </div>
    </section>

    <section class="panel glass">
      <div class="section-title">
        <div><h2>Estado de revisión</h2><p id="reviewStatus">Activo y aprobado</p></div>
      </div>
      <button class="btn secondary" type="button" id="btnContactarSoporte" style="width:100%">Contactar soporte</button>
    </section>
  </aside>

  <nav class="pro-mob-nav" aria-label="Navegación móvil">
    <button class="on" type="button"><span class="ic">🏠</span>Inicio</button>
    <button type="button" onclick="location.href='resultados.html'"><span class="ic">🔍</span>Buscar</button>
    <button class="fab" type="button" onclick="location.href='registro-perfil.html'">+</button>
    <button type="button" id="btnNavMensajes2"><span class="ic">💬</span>Msgs</button>
    <button type="button" onclick="document.getElementById('dashMenuPanel').classList.toggle('hidden')"><span class="ic">👤</span>Perfil</button>
  </nav>

</main>
</div>
</div>

`;

const p = 'c:/Users/ilser/carihub/public/dashboard-rentero.html';
let html = fs.readFileSync(p, 'utf8');
html = html.replace(/<body[\s\S]*?(?=\n  <script src="https:\/\/www.gstatic.com)/, newBody);
html = html.replace(
  '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
  '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3, user-scalable=yes">'
);
fs.writeFileSync(p, html);
console.log('body replaced');
