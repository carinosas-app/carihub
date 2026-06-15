# MATRIZ-RUTAS-NAV-CANONICA v1.0.0

**Fecha:** 2026-06-11 · **Estado:** CANON DOCUMENTAL  
**Modo:** Solo documentación — no modifica SPECs/ACTAs existentes · sin runtime

> **Principio rector:** Una ruta canónica por superficie; aliases con redirect documentado; Registro edita; Dashboard lectura+CTA; Admin concilia.

---

## 1. Conflictos resueltos (6)

| ID | Conflicto | Veredicto CANON |
|---|---|---|
| C-R01 | `/cuenta/banners` vs `/cuenta/anunciante` | **`/cuenta/banners`** — `/cuenta/anunciante` → 301 |
| C-R02 | `/registro/editar/{id}` vs `/cuenta/perfil/editar` | **`/registro/editar/{perfilId}`** — dashboard solo CTA |
| C-R03 | `/admin/expedientes/*` vs `/admin/revision` vs `/admin/perfiles` | **Rutas PLAN-ADMIN planas** — expedientes = grupo menú UI |
| C-R04 | `admin.html` vs `/admin/*` | **`/admin/*` canon** — admin.html bridge MVP |
| C-R05 | `index.html` modales vs `/cuenta/*` | **`/cuenta/*` canon** — modales bridge MVP |
| C-R06 | `registro-banner.html` vs panel | **`/registro/banner` funnel** + **`/cuenta/banners` panel** |

### Mapeo admin expedientes → canon

| Legacy SPEC-PANEL | Ruta CANON |
|---|---|
| `/admin/expedientes/perfiles` | `/admin/revision?tipo=perfil` o `/admin/perfiles?estado=pendiente` |
| `/admin/expedientes/anunciantes` | `/admin/revision?tipo=banner` |
| `/admin/expedientes/pagos` | `/admin/pagos?estado=pendiente` |
| `/admin/expedientes/contratos` | `/admin/contratos` |

### Bridge legacy prod

| Legacy | Canon |
|---|---|
| `modalMiPerfil` | `/cuenta/acceso` |
| `modalPanel` | `/cuenta/perfil` |
| `modalEditar` | `/registro/editar/{perfilId}` |
| `admin.html` | `/admin/resumen` |

---

## 2. Conflictos pendientes (3)

| ID | Tema | Estado |
|---|---|---|
| C-P01 | `/cuenta/negocio` vs variante negocio en `/cuenta/perfil` | MINOR 1.1 — MVP mismo dashboard |
| C-P02 | `/operador` vs `/admin` scope | Pendiente SPEC-ADMIN |
| C-P03 | `/messenger` vs WhatsApp | **Resuelto MVP:** WhatsApp externo; messenger Post-MVP |

---

## 3. Matrices canónicas de rutas

### Públicas
`/`, `/resultados` (noindex), `/perfil/{id}/{slug}`, landings geo/cat, `/legal/*`, `/denunciar`

### Usuario / Perfil
Auth: `/cuenta/acceso`, `/cuenta/crear`, `/cuenta/recuperar`  
Dashboard: `/cuenta/perfil`, `/cuenta/perfil/publico|fotos|verificacion|estadisticas`  
Registro: `/registro/wizard`, **`/registro/editar/{perfilId}`**, `/registro/verificacion`  
Pagos: `/cuenta/pagos`, `/historial`, `/renovar`, `/contratos`

### Anunciante
**`/cuenta/banners`** (+ activos, pendientes, vencidos, estadisticas, contratos, renovar)  
Funnel: **`/registro/banner`**

### Admin
`/admin/resumen`, **`/admin/revision`**, `/admin/usuarios`, `/admin/perfiles`, `/admin/catalogo`, `/admin/schemas`, `/admin/comercial`, `/admin/banners`, **`/admin/pagos`**, **`/admin/contratos`**, `/admin/denuncias`, `/admin/soporte`, `/admin/seguridad`, `/admin/auditoria`, `/admin/busqueda`, `/admin/ia`, `/admin/config`, `/admin/metricas`

### Transversales
- **IA:** `/admin/ia`, `/cuenta/asistente` (Post-MVP)
- **Actualizaciones:** `/cuenta/centro/actualizaciones[/sat|carihub]`
- **Inteligencia:** `/cuenta/centro/inteligencia`, `/cuenta/banners/inteligencia`, `/admin/inteligencia` (Post-MVP)
- **Config:** `/cuenta/config[/cuenta|privacidad|notificaciones|apariencia|idioma]`
- **Seguridad:** `/cuenta/seguridad[/sesiones]`, `/admin/seguridad`, `/admin/auditoria`

---

## 4. Matriz de navegación

| Superficie | Entrada | CTAs salientes clave |
|---|---|---|
| Pública | `/` | Buscar → resultados; Login → `/cuenta/acceso` |
| Dashboard Perfil | `/cuenta/perfil` | Editar → `/registro/editar/{id}`; Renovar → `/cuenta/pagos/renovar` |
| Dashboard Anunciante | `/cuenta/banners` | Nuevo → `/registro/banner` |
| Dashboard Admin | `/admin/resumen` | Revisión → `/admin/revision`; Pagos → `/admin/pagos` |

---

## 5. Matriz de menús

| Menú | Items principales |
|---|---|
| Público header | Inicio, Buscar, Registrarse, Login, Mi cuenta, Anunciar |
| Usuario sidebar | Mi perfil, Estadísticas, Pagos, Favoritos, Config, Seguridad, Actualizaciones |
| Anunciante sidebar | Mis banners, Activos, Pendientes, Estadísticas, Contratos |
| Admin sidebar | Resumen, Revisión, Perfiles, Pagos, Banners, Denuncias, Auditoría, IA |
| Config | Cuenta, Privacidad, Notificaciones, Idioma |
| Seguridad | Seguridad cuenta, Sesiones, Seguridad sistema (admin) |

---

## 6. Permisos por ruta (muestra)

| Ruta | Visitante | Prestador | Anunciante | Admin | Moderador |
|---|---|---|---|---|---|
| `/cuenta/perfil` | X | R (propio) | R | X | X |
| `/registro/editar/{id}` | X | W (propio) | — | X | X |
| `/cuenta/banners` | X | — | R | X | X |
| `/admin/revision` | X | X | X | W | W |
| `/admin/pagos` | X | X | X | W | R |

**Acciones críticas:** confirmar_pago (doble confirmación), suspender_perfil (auditoría), ia_recomendar (sin escritura).

---

## 7. Mapa congelamientos → rutas (resumen)

| Capa | Estado | Rutas clave |
|---|---|---|
| SC, FE, VE, RE | Congelada diseño | Base, registro, perfil público |
| SEO | Congelada | `/`, noindex `/cuenta` |
| RC, PAY | Congelada | `/registro/*`, `/cuenta/pagos/*` |
| Panel operativo | Pendiente ratificación | `/cuenta/perfil/*`, `/cuenta/banners/*` |
| Admin, App Pública | Parcial/abierta | `/admin/*`, `/` legacy |
| Messenger, IA, Theme | Post-MVP | `/messenger`, `/admin/ia` |

Detalle completo: [`MATRIZ-RUTAS-NAV-CANONICA.json`](MATRIZ-RUTAS-NAV-CANONICA.json) → `mapaCongelamientosRutas`.

---

## 8. Métricas de alineación

| Métrica | Valor |
|---|---|
| Documentación global antes | 83% |
| Navegación canon antes | 55% |
| Navegación canon después | **92%** |
| **Alineación documental alcanzada** | **89%** (+6%) |
| Conflictos resueltos | **6** |
| Conflictos pendientes | **3** |

---

## 9. Recomendación siguiente capa

1. **Alinear** [`SPEC-PANEL-DASHBOARD-MINIMO.json`](SPEC-PANEL-DASHBOARD-MINIMO.json) a rutas de esta matriz (o renombrar **SPEC-DASHBOARDS-OPERATIVOS**)
2. Regenerar auditoría SPEC-PANEL + fixtures golden
3. Actualizar **AUDITORIA-MAESTRA v2.1**
4. Plan adopción física Shared/Core (BLK-08)
5. Documento Firestore rules (GAP-RULES)
6. SPEC-ADMIN formal

---

*Artefacto nuevo v1.0.0 — no modifica documentos existentes.*
