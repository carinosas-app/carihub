# Auditoría arquitectónica global de CariHub

| Campo | Valor |
|-------|-------|
| **Versión** | 1.0.0 |
| **Fecha** | 2026-06-09 |
| **Alcance** | Todo el repositorio — producción real + corpus de diseño |
| **Modo** | Solo análisis — **sin runtime, sin cambios, sin commit, sin deploy** |

Canónico: [`AUDITORIA-ARQUITECTONICA-GLOBAL-CARIHUB.json`](./AUDITORIA-ARQUITECTONICA-GLOBAL-CARIHUB.json)
Acompañan: [`MAPA-MAESTRO-CARIHUB.md`](./MAPA-MAESTRO-CARIHUB.md) · [`MATRIZ-MODULARIZACION-CARIHUB.md`](./MATRIZ-MODULARIZACION-CARIHUB.md) · [`VEREDICTO-ARQUITECTONICO-FINAL.md`](./VEREDICTO-ARQUITECTONICO-FINAL.md)

**Base de evidencia:** lectura directa de `public/` (11 HTML, 14 JS, 8 CSS), `firestore.rules`, `firebase.json` y corpus `scripts/` (7 actas, 4 SPEC, 4 observaciones, 18 schemas, 3 fixtures golden, 4 validadores). No se asume nada sin archivo que lo respalde.

---

## PARTE 1 — Inventario del sistema actual

### Páginas HTML (producción)

| Ruta | Función hoy | Módulo hoy | Módulo destino | ¿Bien ubicado? | Acción |
|------|-------------|------------|----------------|----------------|--------|
| `index.html` | Home + wizard + cuenta + favoritos + anuncio + 18+ | PÚBLICA (monolito) | PÚBLICA + REGISTRO + DASHBOARD + PAGOS + BANNERS + INTERACCIONES | **No** | Dividir + mover |
| `resultados.html` | Lista perfiles + banners | PÚBLICA | PÚBLICA/Resultados | Sí (lógica no) | Refactorizar query |
| `perfil.html` | Perfil público + banners | PÚBLICA | PÚBLICA/Perfil | Sí | Mantener |
| `admin.html` | Usuarios, denuncias, anuncios, soporte, logs | ADMIN (real) | ADMIN | Sí | Dividir por módulo |
| `registro-banner.html` | Funnel publicidad premium | BANNERS (real) | BANNERS + PAGOS | Sí | Dividir pago/creativo |
| `registro-banner2.html` | Variante funnel | BANNERS | BANNERS | **No** | **Revisar/eliminar** |
| `registro-banner-paso3.html` | Paso aislado funnel | BANNERS | BANNERS | **No** | **Revisar/eliminar** |
| `dashboard-rentero.html` | Prototipo dashboard + 12 temas | DASHBOARD/Theme | DASHBOARD + THEMEENGINE | **No** | Dividir (tokens→Theme) |
| `index-legacy.html` | Backup pre-migración | legacy | — | **No** | **Eliminar/archivar** |
| `404.html` | Error | PÚBLICA | SHARED | Sí | Mantener |
| `preview/adultos-...html` | Preview diseño | preview | — | **No** | Archivar |

### JavaScript

| Archivo | Función | Destino | Acción |
|---------|---------|---------|--------|
| `hero-home.js`, `home-ui.js`, `home-sector-scroll.js`, `adultos-cat-picker.js`, `sector-scroll-data.js` | Núcleo presentación Home | PÚBLICA/home | Mantener |
| `home-vcards.js` | Tarjetas (6 templates) | SHARED/RenderEngine | Refactorizar |
| `home-bridge.js` | Puente UI↔inline | PÚBLICA (temporal) | Legacy temporal |
| `catalogos-carihub.js`, `sectores-carihub.js`, `categoria-iconos.js` | Catálogo/sectores/iconos | **SHARED/Core** | Convertir en Core |
| `modal-carihub.js` | Modal reutilizable (perfil, banner) | **SHARED/Core** | Convertir en Core |
| `precios-publicidad.js`, `banner-inventario-rotacion.js` | Banners | BANNERS | Mantener |
| `paises/estados/ciudades.js` | Geo | **SHARED/Core** | Convertir en Core |
| **Inline `index.html` (~1.330 líneas)** | auth, registro, panel, favoritos, anuncios, visitas | REGISTRO/DASHBOARD/BANNERS/INTERACCIONES | **Dividir + mover** |

### CSS

| Archivo | Destino | Acción / nota |
|---------|---------|---------------|
| `home.css` (~3.483) | PÚBLICA/home | Refactorizar (incluye reglas `proto-*` muertas) |
| `home-vcards.css` | SHARED/RenderEngine | Refactorizar |
| `home-modals.css` | Mover con modales legacy | **`--rosa` indefinido (Bugbot)** |
| `home-sector-scroll.css`, `home-adultos-cat-picker.css` | PÚBLICA/home | Mantener |
| `modal-carihub.css`, `banners-publicidad.css` | SHARED/Core | Convertir en Core |

### Configuración global y reglas

- `firebase.json`: hosting + functions; `ignore` ya excluye `index-legacy.html`, `preview/`, backups.
- `firestore.rules`: **RBAC por email único** (`carinosas.anuncios@gmail.com`). Colecciones definidas: `usuarios`, `usuarios/{uid}/favoritos`, `solicitudes_anuncios`, `denuncias` (create:false), `soporte_mensajes`, `estadisticas_visitas`, `logsAdmin`, `logsSeguridad`, `pagos`, `anuncios`, `analytics_eventos`, `configuracion_publicidad`. **No existen** las colecciones Messenger (`conversaciones`, `reportes_mensajeria`, …) → confirma runtime Messenger no implementado.
- **`firebaseConfig` duplicado en 5 páginas** (index, resultados, perfil, admin, registro-banner) — deuda de mantenibilidad.

### Assets

| Carpeta | Archivos | Módulo |
|---------|----------|--------|
| `img/home/` | 60 | Home + Banners |
| `img/adultos-cat/` | 63 | Home |
| `img/menu-icons/` | 12 | Home |
| **Videos** | **0** | `resultados.html` marca `data-res-ad-type=video` pero usa `<img>` — sin archivos de video reales |

### Corpus de diseño (`scripts/`)

7 actas congelamiento · 1 acta migración (`APROBADA_DISENO`) · 4 SPEC · 4 observaciones · 18 config schemas · fixtures golden (FieldEngine 11, Messenger 30, VE 24) · validadores (registro 462/462, FieldEngine 19/19, VE 25/25, Messenger 21/21).

---

## PARTE 2 — Mapa actual del ecosistema

| App | Estado | Realidad | Deuda |
|-----|--------|----------|-------|
| **PÚBLICA** | Parcial + mezclada | index/resultados/perfil; index mezcla 5 módulos | Monolito |
| **REGISTRO** | Mezclada | Wizard en index; 5 schemas FieldEngine en diseño | INE en bundle público |
| **DASHBOARD** | Parcial + mezclada | Panel en index; `dashboard-rentero` prototipo; SPEC congelado | Sin shell real |
| **ADMIN** | **Parcial real** | `admin.html` funcional | RBAC email único, cap 150 |
| **MESSENGER** | Congelada (diseño) | SPEC 1.0.0 + 30 fixtures; **0 runtime** | Sin rules ni código |
| **PAGOS** | Pendiente + mezclada | Stripe/MP en index; schema contratos | Pagos en home |
| **BANNERS** | **Parcial real** | `registro-banner` + precios + inventario | Duplicados banner2/paso3 |
| **INTERACCIONES** | Observación + mezclada | Favoritos en index; OBSERVACION 1.2.1 | Favoritos + anonymous en home |
| **SEO** | Observación | OBSERVACION 1.0.0; sin landings | Sin canonical/OG/schema |
| **THEMEENGINE** | Observación | OBSERVACION 1.3.0; tokens en dashboard-rentero/vcards | Tokens dispersos |
| **AGENTES** | Futura | Hook `data-agente-context`; IA en diseño | Sin runtime/LLM |
| **SHARED/CORE** | Parcial disperso | modal-carihub, catálogos, geo existen | `firebaseConfig` x5 |

**Partes mezcladas:** `index.html` = Home + Registro + Dashboard + Pagos + Banners + Interacciones; tokens visuales dispersos; `home-vcards` acoplado a Home en vez de RenderEngine.

**Deuda técnica principal:**
1. Monolito `index.html` no separable.
2. **`resultados.html` descarga TODO el universo de perfiles y filtra en cliente** — no escala.
3. RBAC admin por email hardcoded.
4. 5 copias de `firebaseConfig`.
5. Catálogo producción (34) ≠ diseño (462).
6. Migración `usuarios→perfiles` pendiente bloquea Messenger/Dashboards/Theme.

---

## PARTE 4 — Evaluación técnica por módulo

| Módulo | Prio | Riesgo | Datos sens. | Auth | Admin | Separar | Lazy | ¿En Home? | Rendim. | SEO | Escalab. | dep VE | dep Msg | dep Render | dep Theme |
|--------|------|--------|-------------|------|-------|---------|------|-----------|---------|-----|----------|--------|---------|------------|-----------|
| Home | P0 | Alto | Baja* | Opc | No | Sí | Resto | Núcleo | Alto | Alto | Alta | Ind | No | Alta | Media |
| Resultados | P1 | Alto | Baja | No | No | No | No | No | **Crít** | Alto | **Crít** | No | No | Alta | Media |
| Perfil | P1 | Medio | Media | No | No | No | No | No | Medio | **Alto** | Ok | No | Fut | Alta | Alta |
| Registro/Wizard | P1 | Alto | **Alta** | Sí | No | Sí | Sí | No | Medio | No | Media | **Alta** | No | Media | Baja |
| Dashboard | P1 | Medio | Alta | Sí | No | Sí | Sí | No | Medio | No | Alta | Alta | Alta | Media | Media |
| Admin | P1 | **Alto** | **Alta** | Sí | **Sí** | Sí | Sí | **Nunca** | Int | No | Baja | Alta | Alta | Baja | Baja |
| Messenger | P2 | Alto | **Alta** | Sí | Parc | Sí | Sí | No | RT | No | Alta | **Crít** | — | Baja | Baja |
| Pagos | P2 | **Alto** | **Alta** | Sí | Parc | Sí | Sí | **Nunca** | Bajo | No | Media | Media | No | Baja | Baja |
| Banners | P2 | Medio | Baja | Anun | Parc | Sí | Sí | Solo render | Medio | Bajo | Media | Media | No | Media | Media |
| Interacciones | P3 | Medio | Media | Sí | Parc | Sí | Sí | No | Alto | Medio | Alta | Alta | Alta | Media | Media |
| ThemeEngine | P4 | Medio | Baja | Sí | Parc | Sí | Sí | No | Medio | Bajo | Media | Media | No | **Crít** | ES |
| SEO | P2 | Bajo | Ninguna | No | No | Islas | No | Ligero | + | ES | **Alta** | No | No | Alta | Baja |
| Agentes | P5 | Alto | Alta | Sí | Parc | Transv | Sí | No | LLM | Ind | Media | Alta | Alta | Baja | Baja |
| SHARED/CORE | P0 | Alto si no | n/a | n/a | No | Sí | Núcleo | Mín | Clave | Ind | Habilita | Contiene | — | Contiene | Contiene |

\* Home baja sensibilidad **solo si** se extrae el registro/INE.

---

## PARTE 6 — Análisis específico de Home

| Categoría | Elementos |
|-----------|-----------|
| **Debe quedarse** | Hero, buscador geo, CTA→resultados, grids cat/sector, trust pills, slots (solo render), menú legal+18+ |
| **Debe salir** | Wizard+INE, login/panel/editar, pagos Stripe/MP, favoritos CRUD, formulario anuncio, `estadisticas_visitas` |
| **Nunca en Home** | Firebase Storage, verificación INE/selfie, lógica admin, LLM/agentes, editor ThemeEngine |
| **Lazy-load** | Registro, Cuenta, Anuncios, Favoritos, Firebase Auth/Firestore on-demand |
| **Microcomponente** | ResultCard/Vcard (→RenderEngine), selector geo, trust pill, ad slot, modal (→modal-carihub) |
| **Migrar a otras apps** | Modales registro/cuenta/anuncio/favoritos/legal a sus rutas |
| **Simplificar** | Un solo sistema de modales, menú sin duplicados, 2 fuentes, catálogo único |
| **Optimizar** | Defer Firebase, preload mínimo, lazy imágenes, borrar CSS `proto-*` muerto |
| **Agregar** | Social proof verificados, enlaces SEO ciudad/sector, OG+canonical+JSON-LD, footer, geo real |
| **Eliminar** | `index-legacy` del deploy, auth anónima automática, `plantillaCardPerfil` si muerto, doble modal favoritos |

---

## PARTE 7 — Detalle funcional por módulo (nivel de preparación)

| App | Preparación | Pantallas principales | Colecciones clave | Falta para construir |
|-----|-------------|------------------------|-------------------|----------------------|
| **PÚBLICA** | Parcial | Home, Resultados, Perfil | `usuarios`, `perfiles` (fut) | Query server-side, RenderEngine, SEO head |
| **REGISTRO** | Parcial (diseño maduro) | Registro perfil/negocio/anunciante, Wizard, Verificaciones | `usuarios/perfiles`, storage `verificaciones` | Runtime FieldEngine/VE, migración |
| **DASHBOARD** | Parcial (SPEC congelado) | Perfil, Negocio, Anunciante, Empresa, Operador | `notificaciones`, `historial_actividad`, `ia_recomendaciones`, `pagos` | Router shell, runtime, PATCH 1.1.0 |
| **MESSENGER** | **Futura** (diseño, 0 runtime) | Conversaciones, Chat, Solicitudes, Reportes | `conversaciones`, `reportes_mensajeria`, `messenger_*` | TODO + rules + migración |
| **ADMIN** | Parcial real | Moderación, Seguridad, Pagos, Revisiones, IA | `usuarios`, `denuncias`, `solicitudes_anuncios`, `soporte_mensajes`, `logsAdmin` | RBAC real, escalar, 8 módulos |
| **PAGOS** | Inmaduro | Contratos, Renovaciones, Facturación, Cobros | `pagos`, `contratos_*` (diseño) | Pasarela server, contratos runtime |
| **BANNERS** | Parcial real | Espacios, Campañas, Creativos, Estadísticas | `solicitudes_anuncios`, `configuracion_publicidad`, `anuncios` | Consolidar funnel, métricas reales |
| **INTERACCIONES** | Futura (observación) | Stories, Lives, Seguidores, Comentarios, Reacciones | favoritos (origen) + diseño futuro | SPEC + runtime Messenger |
| **THEMEENGINE** | Inmaduro (obs. amplia) | Temas, Widgets, Plantillas, Editor | `themeSnapshot` (fut) | RenderEngine SPEC + SPEC Theme |
| **SEO** | Inmaduro (observación) | Landings país/estado/ciudad/categoría | `usuarios/perfiles`, Catálogo | Motor landings, head SEO |
| **AGENTES** | Futura | Asistente cuenta/admin/messenger | `ia_recomendaciones`, `ia_arquitecto_informes` | Core estable, autorización LLM |
| **SHARED/CORE** | Parcial disperso | Firebase, VE, FieldEngine, catálogos, geo, modal, tokens | transversal | Módulo core único, config único, design tokens |

---

Las **Partes 3, 5, 8 y 9** (Plano Maestro Futuro, Matriz de reorganización, Recomendación final y Veredicto con calificaciones) se entregan en los documentos acompañantes: `MAPA-MAESTRO-CARIHUB`, `MATRIZ-MODULARIZACION-CARIHUB` y `VEREDICTO-ARQUITECTONICO-FINAL`.

---

*Auditoría documental — no modifica código, Firestore, producción ni capas congeladas.*
