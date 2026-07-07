# Firestore y datos — CariHub

**Última revisión documental:** 2026-07-07

---

## Propósito

Persistencia de perfiles publicadores, solicitudes de publicidad, conversaciones, pagos, configuración de banners activos, publicaciones de perfil y datos de cuenta. Las reglas de seguridad viven en `firestore.rules`; los índices en `firestore.indexes.json`.

---

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `firestore.rules` | Reglas de lectura/escritura |
| `firestore.indexes.json` | Índices compuestos |
| `storage.rules` | Archivos (fotos, verificaciones, banners) |
| `public/js/carihub-core.js` | Init Firebase cliente |
| `public/js/registro-perfil-submit.js` | Escritura perfil en registro |
| `public/js/resultados-registrados.js` | Lectura/normalización perfiles para resultados |
| `public/js/perfil-publico-init.js` | Lectura perfil por `id` |
| `public/js/publicidad-activa.js` | `configuracion_publicidad/banners_activos` |
| `functions/index.js` | `vencerPerfiles` (scheduler) |
| `functions/payments/` | Activación post-pago |

---

## Colecciones (verificadas en `firestore.rules`)

| Colección | Uso |
|-----------|-----|
| `usuarios/{userId}` | Perfil publicador (documento principal hoy) |
| `usuarios/{uid}/favoritos` | Favoritos |
| `usuarios/{uid}/bloqueos` | Bloqueos mensajería |
| `usuarios/{uid}/anuncios_mensajes` | Anuncios canal mensajes |
| `usuarios/{uid}/notificaciones` | Notificaciones |
| `usuarios/{uid}/solicitudes_negocio` | Solicitudes negocio |
| `usuarios/{uid}/privacidad_mensajes` | Preferencias privacidad |
| `solicitudes_anuncios/{id}` | Solicitudes banners, estados, lives, contenido dashboard |
| `denuncias` | Denuncias |
| `soporte_mensajes/{id}/mensajes` | Soporte |
| `estadisticas_visitas` | Analytics visitas |
| `logsAdmin`, `logsSeguridad` | Auditoría |
| `ordenes_pago`, `pagos` | Pagos |
| `anuncios` | Anuncios (legacy/promo) |
| `analytics_eventos` | Eventos analytics |
| `configuracion_publicidad/{doc}/overrides/{id}` | Overrides banners |
| `publicaciones_perfil/{pubId}` | Publicaciones en perfil |
| `conversaciones/{id}/mensajes/{id}` | Mensajería |
| `reportes_mensajeria` | Reportes messenger |

**Diseño futuro (mapa maestro, no verificado en rules actuales):** `perfiles/{perfilId}` como entidad separada del hub de cuenta.

---

## Flujo funcional

### Registro → Firestore

1. Wizard recopila datos en `registro-perfil-wizard.js` (localStorage)
2. `registro-perfil-submit.js` mapea a documento `usuarios/{uid}` o sub-perfil (`perfil_*` IDs vía `carihub-multi-perfil.js`)
3. Fotos → Firebase Storage
4. Campos públicos + privados separados (`carihub-private-fields-lite.js`)

### Perfil público → lectura

1. `perfil-publico-init.js` lee `usuarios/{id}` si `id` no es `demo-*`
2. `resultados-registrados.js` normaliza para tarjetas/listas

### Banners activos

1. Solicitud en `solicitudes_anuncios`
2. Tras pago/aprobación → snapshot en `configuracion_publicidad`
3. `publicidad-activa.js` monta imágenes en slots HTML

### Perfil público gate (rules)

`isPublicProfile()` exige entre otros: `aprobado`, `activo`, no `vencido`, `fechaVencimiento` válida.

---

## Dependencias

- Auth Firebase (uid en reglas `request.auth.uid`)
- Admin hardcoded: email `carinosas.anuncios@gmail.com` en `isAdmin()`
- Slot IDs validados en rules (`slotIdPublicidadValido`) — lista fija de slots `home_*`, `resultados_*`, `perfil_*`, `registro_superior`

---

## Reglas críticas

1. **No leer datos privados de producción** sin autorización (política Firebase MCP)
2. **Slots UI vs rules:** `home_estados` y `home_libe` aparecen en UI (`ch-slot-dock.js`, `registro-banner.html`) pero **no** están en `slotIdPublicidadValido` — inconsistencia documentada
3. **Multi-perfil:** mismo correo/teléfono permitido entre perfiles; validación privada por perfil
4. **Mensajes:** conversaciones scoped por contexto publicación (diseño dashboard-mensajes-vision)

---

## Estado actual

- Rules e índices versionados en repo
- Functions: vencimiento diario de perfiles + módulos payments
- Modelo runtime = documento monolítico en `usuarios` con campos nested por arquetipo (`*Perfil`)

---

## Pendientes

- Migración a `perfiles/{perfilId}` (BLK en roadmap)
- Índices para queries server-side resultados
- Alinear slots `home_estados`/`home_libe` con rules y `slots-catalog.js`
- Entitlements enforcement (`scripts/TICKETS-PLAN-ENTITLEMENTS-ENFORCEMENT.md`) — plan sin runtime completo

---

## Riesgos

| Nivel | Riesgo |
|-------|--------|
| **Bloqueador potencial** | Queries client-side exponen lógica de filtrado y no escalan |
| **Importante** | Contaminación entre arquetipos si `mapToPerfil` rompe contrato |
| **Importante** | Slot mismatch → solicitudes rechazadas o slots huérfanos |

---

## Validaciones necesarias

- `firebase emulators` + pruebas write/read por rol
- Revisión diff rules antes de deploy
- QA submit/hydrate: `audit-e2e-submit-hydrate-validation.mjs`, packs por sector
- Verificar índices cuando se agreguen queries compuestas

---

## Pendiente de confirmar

- Colección `messenger_operadores` — en mapa futuro, no en rules actuales
- Estado real de documentos en producción (solo lectura autorizada)
