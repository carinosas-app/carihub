# Sistema visual unificado — Cariñosas / CariHub

**Versión:** 1.0.0 (documento de arquitectura)  
**Fecha:** 2026-06-12  
**Estado:** Estrategia definida · migración progresiva pendiente  
**Referencias canónicas actuales:** `public/preview/perfil-vista-previa.html`, `public/resultados.html`

---

## Resumen ejecutivo

El camino correcto ya está demostrado en **perfil-vista-previa**: no inventar pantallas aisladas, sino **reutilizar componentes, tokens y patrones que ya funcionan**.

`resultados.html` quedó alineado como **pantalla hermana** de Perfil (mismas clases `.wrap`, `.pb`, `.pbrand`, `.pcard`, `.modchip`, `.verok`, mismos CSS globales). El resto del proyecto debe migrar **una pantalla a la vez**, sin tocar CSS global de forma masiva ni reescribir todo de golpe.

**No implementar todas las migraciones ahora.** Este documento define la línea visual futura.

---

## Fuentes de verdad

| Fuente | Rol | Estado |
|--------|-----|--------|
| `perfil-vista-previa.html` | Pantalla funcional de referencia (adulto Cariñosas) | ✅ Canónica |
| `resultados.html` + `resultados.css` | Lista pública alineada a Perfil | ✅ Migrada (v1) |
| `carihub-premium-theme.css` | Tokens globales `--ch-*` | ✅ Base compartida |
| `fonts/fonts.css` | Poppins + Dancing Script self-hosted | ✅ Obligatorio |
| `carihub-pink-sheen.css` + `.js` | Fondo rosa con destellos | ✅ Reutilizable |
| `carihub-nav-quick.css` + `.js` | Cerrar nav, chips rápidos | ✅ Reutilizable |
| `ch-ui.js` | Utilidades UI (`CHUI`, banderas, monedas) | ✅ Reutilizable |
| `perfil.html` | Perfil Firebase legacy | ⚠️ Pendiente migración |
| `index.html` + `home.css` | Home con sistema `home-*` propio | ⚠️ Pendiente migración |
| `home-modals.css` | Modales/drawer del home | ⚠️ Pendiente unificación |

---

## FASE 1 — Inventario de componentes reales

### 1. Contenedores

| Clase actual | Dónde | Comportamiento |
|--------------|-------|----------------|
| `.wrap` | Perfil, Resultados | `max-width` centrado, `margin: 0 auto`, padding horizontal |
| `.wrap.resultados-wrap` | Resultados | Ampliación a **1280px** (Perfil usa 1100px) |
| `.ch-surface` | `carihub-premium-theme.css` | Utilidad tarjeta premium (fondo blanco + borde + sombra) |
| `body[data-tema="adult"]` | Global | Tema adulto Cariñosas, fondo `#FFF7FA` |
| `html/body min-width` | Resultados | Desktop-first: `min-width: 1180px`, `overflow-x: hidden` |

**Variables de layout (usar siempre):**

```css
--ch-bg: #FFF7FA;
--ch-card: #FFFFFF;
--ch-card-border: #FCE4EC;
--ch-separator: #F8DCE8;
--ch-card-radius: 18px;
--ch-card-shadow: 0 2px 12px rgba(255, 79, 162, 0.06);
```

**Evitar:** contenedores `mockup`, `phone-shell`, `max-width: 390–600px` en layout principal, `transform: scale()` en producción (solo preview IDE en `body.fit`).

---

### 2. Navegación

| Clase | Uso |
|-------|-----|
| `.pbrand` | Barra marca + nav + CTA |
| `.pbrand__logo` / `.pbrand__wordmark` | Bloque logo |
| `.pbrand__name` | Wordmark — Dancing Script 34px `#E91E63` (adulto) |
| `.pbrand__tag` | Subtítulo — Poppins 9px `#E91E63` |
| `.pnav` | Nav horizontal flex, `margin-left: auto` |
| `.pnav a` / `.pnav a.on` | Items + estado activo rosa |
| `.pnav__ic` / `.pnav__label` | Icono + texto |
| `.bdg` | Badge contador (Mensajes, Notificaciones) |
| `.pbtn` | CTA principal «Publicar anuncio» — `#FF4081` |
| `.ch-nav-close` | Botón cerrar (nav-quick) |
| `.profile-toolbar` | Barra secundaria Perfil (volver, breadcrumb, acciones) |
| `.toolbar-chip` | Chip de acción (Filtros en Resultados) |

**Resultados:** `.pbrand--resultados` aplanado (sin tarjeta, `border-bottom`).

---

### 3. Banners

| Clase | Uso |
|-------|-----|
| `.pb` | Fila superior flex, `gap: 14px`, `flex-wrap: nowrap` |
| `.pb--center` | Slot central `flex: 1.55` |
| `.pb__imgbanner` | Banner imagen estática |
| `.pb-slot` | Slot con rotación (Perfil) |
| `.pb-slot--bottom` | Banner inferior ancho |
| `.res-bottom` | CTA inferior Resultados (derivado de bottom slot) |

**Reglas de imagen:**

- `object-fit: cover`
- `object-position: center` (hero/perfil: `center top`)
- `min-height: 158px` (adulto superior)
- `border-radius: 16–20px`
- `overflow: hidden` en contenedor

**Assets Resultados:** `banners/resultados/resultados1.webp`, `resultados-centro-1.png`, `resultados2.webp`

---

### 4. Cards / bloques

| Clase | Uso |
|-------|-----|
| `.pcard` | Card base blanca — radio 18px, borde `#FCE4EC`, sombra suave |
| `.pcard.res-card` | Card horizontal Resultados (430px foto + info) |
| `.gal` / `.gal__main` | Galería Perfil — `aspect-ratio: 3/4`, foto principal |
| `.gal__count` | Overlay contador fotos |
| `.sobre-card` | Bloque «Sobre mí» |
| `.act-card` / `.live-card` | Actividad / live |
| `.pubstrip` / `.pubcard` | Strip publicación perfil propio |

**Espaciado entre cards:** `gap: 14–16px` en columnas/listas.

---

### 5. Botones

| Clase | Tipo | Estilo |
|-------|------|--------|
| `.pbtn` | Primario CTA | `#FF4081`, radius 5–999px, sombra |
| `.res-ver` / `.pbtn.res-ver` | «Ver perfil» | Primario, posición absoluta card |
| `.toolbar-chip` | Secundario / filtro | Pill blanco-rosa, borde suave |
| `.res-chip` | Filtro activable | Pill; activo `#E91E63` |
| `.res-bottom__btn` | CTA banner inferior | Magenta, uppercase |
| `.live-card__btn` | Acción secundaria Perfil | Outline suave |

**Home (pendiente unificar):** `.home-btn`, `.home-btn--advanced` — mapear a sistema `ch-btn-*`.

---

### 6. Badges / chips

| Clase | Uso |
|-------|-----|
| `.verok` | Badge «Verificada» — fondo `#FCEEF5`, texto `#E91E63` |
| `.verok--hero` / `.verok--green` | Variantes hero / verde |
| `.modchip` + `.mc-pink/.mc-purple/.mc-orange` | Modalidades Recibe/Hotel/Domicilio |
| `.bdg` | Contador nav |
| `.res-chip.is-active` | Filtro activo |
| `.vchip` | Chip secundario Perfil |
| `.ntag` | Tags negocio |
| `.res-nueva` | Etiqueta NUEVA en foto |

---

### 7. Tipografía

| Rol | Fuente | Tamaño típico | Color |
|-----|--------|---------------|-------|
| Marca Cariñosas | Dancing Script 700 | 34–46px | `#E91E63` |
| UI / cuerpo | Poppins | 13–16px | `#23202b` / `#212121` |
| Título página | Poppins 700 | 30px | `#23202b` |
| Subtítulo contexto | Poppins 600 | 14px | `#7b7280` |
| Nombre perfil (card) | Poppins 700 | 36px | `#23202b` |
| Precio | Poppins 700 | 30px | `#E91E63` |
| Tagline | Poppins 600 | 14px | `#5d5566` |

**Regla:** fuentes locales en `public/fonts/fonts.css`. No depender de Google Fonts en producción.

**Regla Cursor:** `.cursor/rules/tipografia-carihub.mdc`

**Legacy a eliminar gradualmente:** Arial/Montserrat sueltos en `perfil.html`, `home-modals.css`.

---

### 8. Imágenes

| Patrón | Regla |
|--------|-------|
| Foto principal card | `width/height` fijos + `object-fit: cover` |
| Galería Perfil | `aspect-ratio: 3/4` + `position: absolute; inset: 0` |
| Miniaturas | `aspect-ratio: 1/1`, `border-radius: 10px` |
| Placeholder | `.ch-foto-ph` (SVG en Perfil) |
| Overlay fotos | `.gal__count` — `rgba(0,0,0,.6)` |
| Banderas | `CHUI.chFlag()` → `.ch-flag` |

**Nunca:** estirar imágenes, usar solo `width` sin altura contenedor, recortar banners con altura insuficiente.

---

### 9. Secciones informativas

| Componente | Clase actual | Pantalla |
|------------|--------------|----------|
| Franja verificados | `.res-trust` | Resultados |
| Bloque confianza Perfil | `.trust` (grid 4 cols) | Perfil |
| CTA inferior | `.pb-slot--bottom`, `.res-bottom` | Ambas |
| Tagline / descripción | `.quote` | Perfil, Resultados |
| Estatus disponibilidad | `.feat-line`, `.idloc.av` | Ambas |
| Mensaje vacío | — | **No usar** en Resultados demo; definir `.ch-empty-state` |
| Loader Perfil legacy | `.loader-card` | `perfil.html` — reemplazar por `.ch-loading-state` |

---

### 10. Formularios (estado actual — pendiente unificación)

| Origen | Clases / patrón | Estado |
|--------|-----------------|--------|
| `index.html` | Inputs inline, modales `home-modal` | Legacy, Montserrat |
| `home-modals.css` | `.menu`, formularios registro | Drawer móvil-first |
| Perfil vista previa | Campos dentro de cards `.pcard` | Parcial |
| `registro-banner.html` | Por auditar | Pendiente |

**Objetivo futuro:** tokens + clases `ch-form`, `ch-field`, `ch-input` (ver Fase 2).

---

### 11. Modales / mini-pantallas (estado actual)

| Origen | Clases | Notas |
|--------|--------|-------|
| Home | `.home-modal`, `.menu` (drawer) | Sistema propio, 430px max |
| Perfil vista previa | `.grat-modal` | Modal gratificación |
| Nav quick | `.ch-quickbar` | Chips centrales |
| Preview tooling | `.switcher`, `body.fit` | **No es producción** |

---

## FASE 2 — Componentes candidatos (`ch-*`)

Prefijo **`ch-`** (CariHub) para el sistema extraído. Mapeo desde clases actuales:

### A) Layout

| Candidato `ch-*` | Origen actual | Notas |
|------------------|---------------|-------|
| `ch-page` | `body[data-tema]` | Shell de página con tema |
| `ch-wrap` | `.wrap` | Contenedor centrado; variantes `--narrow` (1100) / `--wide` (1280) |
| `ch-section` | secciones `.res-head`, bloques sueltos | Espaciado vertical estándar |
| `ch-grid` | `.playout`, `.pgrid` | Grid 2 cols |
| `ch-stack` | `.col`, `.res-lista` | Flex column con gap |

### B) Navegación

| Candidato | Origen |
|-----------|--------|
| `ch-brand-header` | `.pbrand` |
| `ch-nav` | `.pnav` |
| `ch-nav-item` / `ch-nav-item--active` | `.pnav a` / `.on` |
| `ch-nav-badge` | `.bdg` |
| `ch-primary-action` | `.pbtn` |

### C) Cards

| Candidato | Origen |
|-----------|--------|
| `ch-card` | `.pcard` / `.ch-surface` |
| `ch-profile-card` | layout Perfil `.playout` |
| `ch-result-card` | `.pcard.res-card` |
| `ch-dashboard-card` | Por definir en dashboards |
| `ch-info-card` | `.res-trust`, bloques informativos |

### D) Banners

| Candidato | Origen |
|-----------|--------|
| `ch-banner-row` | `.pb` |
| `ch-banner-card` | `.pb__imgbanner` |
| `ch-banner-center` | `.pb--center` |
| `ch-bottom-cta` | `.pb-slot--bottom`, `.res-bottom` |

### E) Botones

| Candidato | Origen |
|-----------|--------|
| `ch-btn` | base |
| `ch-btn-primary` | `.pbtn` |
| `ch-btn-secondary` | `.toolbar-chip` |
| `ch-btn-ghost` | `.profile-toolbar .toolbar-action` |
| `ch-btn-danger` | por definir |
| `ch-btn-small` | chips compactos |

### F) Badges / chips

| Candidato | Origen |
|-----------|--------|
| `ch-badge` | base |
| `ch-badge-verified` | `.verok` |
| `ch-badge-count` | `.bdg` |
| `ch-chip` | `.res-chip`, `.vchip` |
| `ch-chip-active` | `.is-active`, `.on` |
| `ch-chip-pink/purple/orange` | `.modchip.mc-*` |

### G) Formularios (futuro)

`ch-form`, `ch-field`, `ch-label`, `ch-input`, `ch-select`, `ch-textarea`, `ch-checkbox`, `ch-upload-card`, `ch-form-stepper`

### H) Feedback (futuro)

`ch-alert`, `ch-alert-success/warning/error`, `ch-empty-state`, `ch-loading-state`

### I) Modales (futuro)

`ch-modal`, `ch-modal-panel`, `ch-drawer`, `ch-overlay`, `ch-confirm-box`

**Estrategia de extracción:** no renombrar todo de golpe. Fase 1: documentar alias `ch-*` ↔ clase actual. Fase 2: extraer CSS de `perfil-vista-previa` inline a `public/css/ch-components.css`. Fase 3: alias deprecados gradualmente.

---

## FASE 3 — Mapa de pantallas a migrar

| # | Pantalla | Archivo(s) probable(s) | Estado visual | Prioridad |
|---|----------|------------------------|---------------|-----------|
| 1 | Home | `index.html`, `home.css`, `home-modals.css` | Sistema `home-*` separado | P1 |
| 2 | Resultados | `resultados.html`, `resultados.css` | ✅ Alineado a Perfil | P1 |
| 3 | Perfil público | `perfil.html` | Legacy 930px, Firebase, Arial | P1 |
| 4 | Vista previa perfil | `perfil-vista-previa.html` | ✅ Referencia (CSS inline) | P1 — extraer CSS |
| 5 | Favoritos | Por crear / enlazar | No existe | P1 |
| 6 | Mensajes | Por crear | No existe | P1 |
| 7 | Notificaciones | Por crear | No existe | P1 |
| 8 | Dashboard perfil | Spec / futuro | No implementado | P3 |
| 9 | Dashboard anunciante/banner | `registro-banner.html` | Parcial | P3 |
| 10 | Dashboard rentero | Por definir | No existe | P3 |
| 11 | Registro perfil | `index.html` modales | Mezclado con Home | P2 |
| 12 | Registro banner | `registro-banner.html` | Por auditar | P2 |
| 13 | Registro rentero | Por definir | No existe | P2 |
| 14 | Verificación/KYC | Por definir | No existe | P2 |
| 15 | Admin | Plan maestro | No implementado | P4 |
| 16 | Pagos | Spec | No implementado | P3 |
| 17 | Renovaciones | Spec | No implementado | P3 |
| 18 | Denuncias | Por definir | No existe | P4 |
| 19 | Soporte | Por definir | No existe | P4 |
| 20 | Configuración | Por definir | No existe | P4 |
| 21 | Recuperación cuenta | Por definir | No existe | P2 |
| 22 | Términos y privacidad | Por definir | No existe | P4 |
| 23 | Modales | `home-modals.css`, inline | Fragmentado | P5 |
| 24 | Alertas | Inline / `alert()` | Sin sistema | P5 |
| 25 | Estados vacíos | — | Sin sistema | P5 |
| 26 | Pantallas de carga | `.loader-card` legacy | Parcial | P5 |
| 27 | Pantallas futuras | — | Deben usar `ch-*` desde día 1 | — |

---

## FASE 4 — Reglas de migración

1. **Buscar primero** si el componente ya existe en Perfil o Resultados.
2. **Reutilizar** la clase actual si cubre el caso.
3. **Extraer** si está acoplado a una sola pantalla (p. ej. CSS inline de vista-previa → `ch-components.css`).
4. **Crear nuevo** solo si no existe, usando tokens `--ch-*` y prefijo `ch-`.
5. **Prohibido** duplicar estilos sueltos (mismo botón rosa en 3 archivos).
6. **CSS inline** solo temporal y documentado; destino siempre archivo compartido.
7. **Una pantalla por PR/commit lógico** — no migraciones masivas.
8. **CSS global** (`carihub-premium-theme.css`, `home.css`): cambiar solo con revisión de impacto explícita.
9. **Desktop primero** en pantallas públicas; responsive después de validar ≥1280px.
10. **Demo/local primero** — sin depender de Firebase para validar layout.

### Checklist por pantalla migrada

- [ ] Usa `fonts/fonts.css` (Poppins + Dancing Script)
- [ ] Usa `carihub-premium-theme.css` (tokens `--ch-*`)
- [ ] Header con patrón `.pbrand` / futuro `ch-brand-header`
- [ ] Cards con `.pcard` o variante documentada
- [ ] Sin contenedor mockup / phone frame
- [ ] Sin `transform: scale()` en producción
- [ ] Validado en navegador maximizado ≥1280px
- [ ] No rompe Perfil ni Resultados ya migrados

---

## FASE 5 — Prioridad de migración

### Prioridad 1 — Públicas visibles
Home → Resultados ✅ → Perfil público → Vista previa (extraer CSS) → Favoritos → Mensajes → Notificaciones

### Prioridad 2 — Conversión y registro
Registro perfil → Registro banner → Registro rentero → KYC → Recuperación cuenta

### Prioridad 3 — Dashboards y economía
Dashboard perfil → Dashboard anunciante → Dashboard rentero → Pagos → Renovaciones

### Prioridad 4 — Operación
Admin → Denuncias → Soporte → Configuración → Términos y privacidad

### Prioridad 5 — Microinteracciones
Modales → Alertas → Empty states → Loading → Tooltips → Confirmaciones

---

## FASE 6 — Reglas de consistencia visual

### Paleta Cariñosas (adulto)

| Token | Valor | Uso |
|-------|-------|-----|
| Fondo página | `#FFF7FA` | `--ch-bg` |
| Card | `#FFFFFF` | `--ch-card` |
| Borde card | `#FCE4EC` | `--ch-card-border` |
| Separador | `#F8DCE8` | `--ch-separator` |
| Acento principal | `#E91E63` / `#ec2d7a` | Marca, links, activos |
| Botón primario | `#FF4081` | CTAs |
| Verificado | `#FCEEF5` + `#E91E63` | Badge |
| Disponible | `#22c55e` | Estatus |
| Ocupado | `#f59e0b` | Estatus |

### Layout desktop

| Pantalla | Ancho contenedor |
|----------|------------------|
| Perfil | 1100px (`.wrap`) |
| Resultados | 1280px (`.resultados-wrap`) |
| Futuro estándar | `ch-wrap--narrow` 1100 / `ch-wrap--wide` 1280 |

### Advertencias críticas

1. **No usar** `tmp/preview/*/resultados-html-mockup.html` ni iframes 414px como referencia de desktop.
2. **No usar** `body.fit` + `scale()` fuera del tooling de vista previa del IDE.
3. **No aceptar** Arial/Montserrat como tipografía final en pantallas Cariñosas.
4. **No crear** pantallas con CSS aislado que no importe al menos `carihub-premium-theme.css` + `fonts.css`.
5. **No mostrar** estados vacíos en Resultados demo (Violeta, Mariana, Sofía siempre visibles).

---

## Criterios de aceptación visual

### Resultados (actual)

- [x] Pantalla hermana de Perfil — mismas clases base
- [x] Orden: banners → header → título → filtros → 3 cards → paginación → franja → CTA inferior
- [x] Cards horizontales 430×300px, `object-fit: cover`
- [x] Demo Violeta / Mariana / Sofía sin Firebase
- [x] Sin mensaje «No encontramos perfiles»
- [x] Desktop ≥1280px sin scroll horizontal

### Cualquier pantalla nueva o migrada

- [ ] Se ve parte del mismo producto que Perfil/Resultados
- [ ] Usa tokens `--ch-*` y tipografía oficial
- [ ] Reutiliza al menos header + card + botón del sistema
- [ ] No introduce variables de color duplicadas
- [ ] Documentada en este archivo si aporta componente nuevo

---

## Hoja de ruta técnica (sin ejecutar ahora)

```
Fase A (actual)     Documentación + Resultados alineado
Fase B (siguiente)  Extraer CSS inline de perfil-vista-previa → ch-components.css
Fase C              Migrar perfil.html público a vista-previa patterns
Fase D              Unificar Home (home-* → ch-* gradual)
Fase E              Formularios + modales unificados
Fase F              Dashboards y admin
```

---

## Archivos del sistema visual (estado actual)

| Archivo | Rol en el sistema |
|---------|-------------------|
| `public/fonts/fonts.css` | Tipografía obligatoria |
| `public/css/carihub-premium-theme.css` | Tokens `--ch-*`, `.ch-surface` |
| `public/css/carihub-pink-sheen.css` | Fondo animado |
| `public/css/carihub-nav-quick.css` | Nav rápido, `.ch-nav-close` |
| `public/css/resultados.css` | Extensión Resultados (patrones Perfil copiados) |
| `public/preview/perfil-vista-previa.html` | **Biblioteca visual de referencia** (inline CSS) |
| `public/js/ch-ui.js` | Utilidades compartidas |
| `public/js/resultados-demo.js` | Demo canónico lista |
| `.cursor/rules/tipografia-carihub.mdc` | Regla tipografía Cursor |

**Próximo archivo a crear (cuando se autorice migración):** `public/css/ch-components.css` — extracción controlada desde vista-previa.

---

## Control de cambios

| Versión | Fecha | Cambio |
|---------|-------|--------|
| 1.0.0 | 2026-06-12 | Documento inicial. Inventario Perfil + Resultados. Mapa migración. Resultados v1 alineado. |

---

*Las demás pantallas se migrarán después, una por una, para evitar romper el proyecto.*
