# Admin y dashboards — CariHub

**Última revisión documental:** 2026-07-07

---

## Propósito

**Dashboard rentero:** centro de operación del anunciante (perfiles, banners, mensajes, solicitudes, publicaciones).  
**Admin:** revisión de usuarios, solicitudes publicidad, moderación operativa.

---

## Archivos principales

### Dashboard rentero

| Archivo | Rol |
|---------|-----|
| `public/dashboard-rentero.html` | Shell 3 columnas (base congelada) |
| `public/js/dashboard-rentero-nav.js` | Nav módulos, MOCK, mensajes |
| `public/css/dashboard-rentero-pro.css` | Tema pro |
| `public/js/dashboard-activos-rail.js` | Rail perfiles/banners/lives |
| `public/js/dashboard-solicitudes-negocio.js` | Solicitudes negocio |
| `public/js/dashboard-solicitudes-contenido.js` | Contenido solicitudes |
| `public/js/dashboard-buscar.js` | Módulo buscar |
| `public/js/dashboard-publicaciones.js` | Publicaciones |
| `public/js/dashboard-privacidad-mensajes.js` | Privacidad mensajes |
| `public/js/dashboard-account-capabilities.js` | Capacidades cuenta |
| `public/js/carihub-multi-perfil.js` | Multi-perfil |
| `public/preview/dashboard-rentero-preview.html` | Preview diseño |

### Admin

| Archivo | Rol |
|---------|-----|
| `public/admin.html` | Panel admin (~2400 líneas) |
| `public/js/admin-revision-cola.js` | Cola revisión |
| Admin email | `carinosas.anuncios@gmail.com` (rules + admin.html) |

---

## Flujo funcional

### Dashboard
```
Login Firebase Auth
    → Rail izq.: seleccionar perfil/banner/live activo
    → Nav der.: módulo (Mensajes, Buscar, Publicaciones, etc.)
    → Centro: contenido scoped al contexto rail
    → Mensajes expandido: casi fullscreen, oculta laterales
```

### Admin
```
Login admin email
    → Dashboard contadores
    → Cola usuarios pendientes aprobación
    → Solicitudes publicidad (ESTADOS_SOLICITUD_PUBLICIDAD)
    → Acciones: aprobar, rechazar, autorizar pago
```

---

## Mapa nav vs rail (TICKET-025 / regla congelada)

| Zona | Contenido | No duplicar en nav |
|------|-----------|-------------------|
| Rail — Perfiles | Selector perfil + Nuevo perfil | Ítem "Perfiles" |
| Rail — Banners | Tiles banners contratados | Lista banners redundante |
| Rail — Lives | Lives propios | Nav "En vivos" = feed socios |
| Nav — Mensajes | Inbox del contexto rail | Inbox plano |
| Nav — Mis publicaciones | Admin del perfil activo | Widget "Anuncio activo" es atajo |

## Módulos huérfanos (TICKET-026 — resolución)

| Módulo | Decisión |
|--------|----------|
| `feed-red` | Fusionado en `estados` |
| `directorio` | Eliminado DOM → alias `buscar` |
| `medios-contacto` | Nav nuevo |
| `info-publica` | Nav nuevo |
| `banners` (lista) | Oculto — rail + mensajes por banner |

---

## Dependencias

- `carihub-core.js` (TICKET-001)
- TICKET-003 multi-perfil runtime
- Firestore: usuarios, solicitudes_anuncios, conversaciones
- Messenger modules (MSG-*) — Sprint 1 parcial (PR #60)

---

## Reglas críticas

1. **Shell 3 columnas congelada** — no rediseño total
2. **Mensajes NUNCA mezclados** entre perfiles/banners
3. **usesMockMensajes()** — MOCK solo con `?preview=1` (TICKET-050) — parcial
4. Banner impago → chats bloqueados + CTA renovar
5. Admin no lee chats completos rutinario (globalDoNotTouch backlog)
6. Cuenta hub vs publicador: perfiles publicadores vs perfil principal sin publicar

---

## Estado actual

| Área | Estado |
|------|--------|
| Dashboard UI pro | Operativa con datos reales parciales |
| Mensajes | MOCK + messenger real coexistiendo |
| Multi-perfil | Parcial (`carihub-multi-perfil.js`, TICKET-003 P0) |
| Admin | Operativo revisión usuarios y publicidad |
| Preview dashboard | `dashboard-rentero-preview.html` |

---

## Pendientes

- TICKET-001 core único sin duplicados Firebase
- TICKET-003 multi-perfil completo
- TICKET-050 eliminar MOCK prod
- TICKET-025/026 limpieza nav
- MSG-000..082 messenger MVP
- ADM-* tickets admin moderación

---

## Riesgos

| Nivel | Riesgo |
|-------|--------|
| **Bloqueador** | Mensajes mezclados si multi-perfil incompleto |
| **Importante** | MOCK en prod confunde QA y usuarios |
| **Importante** | Admin monolito 2400 líneas |
| **Importante** | Inicializaciones Firebase duplicadas (TICKET-001) |

---

## Validaciones necesarias

- Cambiar perfil en rail → mensajes filtrados
- Tap banner → solo chats de ese banner
- Admin solo con email autorizado
- `?preview=1` habilita MOCK; prod sin flag no usa MOCK

---

## Pendiente de confirmar

- Lista completa módulos nav en DOM actual vs catálogo nav.js
- Estado messenger real (`DashboardMessenger`) vs MOCK por módulo
- Páginas admin adicionales fuera de `admin.html`
