# Tickets técnicos — PlanEntitlements & enforcement de cupos

Generado: 2026-06-23  
Producto: auditoría sostenibilidad **aceptada** — el riesgo real es **no aplicar cupos por plan**.  
JSON estructurado: `scripts/tickets-plan-entitlements-enforcement.json`  
Schema referencia: `scripts/config-plan-entitlements-schema.json`

> **Restricciones de este paquete:** no modifica runtime, no deploy, no issues GitHub. Solo diseño de tickets.

---

## Clasificación usada

| Etiqueta | Significado |
|----------|-------------|
| **bloqueador de sostenibilidad** | Sin esto, un plan Básico puede consumir recursos de Premium/Especial; abuso vía SDK o uploads directos. |
| **importante post-lanzamiento** | UX operativa, admin, cleanup; reduce soporte pero no bloquea el primer cobro. |
| **mejora futura** | Depende de módulos aún en diseño (lives engine completo, packs billing, notificaciones proactivas). |

---

## Mapa de épicas

| Épica | Tickets | Bloqueadores |
|-------|---------|--------------|
| **ENT-E0** PlanEntitlements | ENT-001, 002, 003 | 3 |
| **ENT-E1** Upload enforcement | ENT-010, 011, 012, 013 | 3 |
| **ENT-E2** Dashboard uso | ENT-020, 021 | 0 |
| **ENT-E3** Admin planes | ENT-030, 031, 032 | 1 |
| **ENT-E4** Cleanup / retención | ENT-040, 041, 042, 043 | 1 |
| **ENT-E5** Por categoría | ENT-050, 051, 052, 053 | 2 |

**Total: 21 tickets** · **9 bloqueadores** · **9 post-lanzamiento** · **3 futuro**

> **Política onboarding (producto):** trial = **Destacado 30 días**, nunca Básico. Ver `scripts/POLITICA-ONBOARDING-PLANES.md` y **ENT-054**.

---

## Orden de implementación recomendado

```
ENT-001 → ENT-003 → ENT-002
    ↓
ENT-011 + ENT-012 (paralelo)
    ↓
ENT-050 + ENT-031 + ENT-051
    ↓
ENT-010 + ENT-013 + ENT-042
    ↓
ENT-020 + ENT-030 → ENT-040 + ENT-043 → ENT-053
    ↓
ENT-041 + ENT-052 + ENT-021 (cuando lives/packs en prod)
```

**Dependencias externas críticas:** TICKET-003 (multi-perfil), ECO-010/030 (checkout/webhooks), ECO-040 (`vencerPerfiles`), TICKET-052 (banner impago).

---

## 1. PlanEntitlements

### ENT-001 — Schema límites completos por plan  
**Clasificación:** bloqueador · **P0** · Sin dependencias

Define el contrato canónico en `config_plan_entitlements/global`:

| Dimensión | Campos |
|-----------|--------|
| Media perfil | `fotosMax`, `videosMax`, `storageGbMaxPerfil` |
| Tamaño archivo | `tamanoMaxArchivoMb.foto\|video\|chatImagen\|chatVideo\|pack` |
| Chat | `adjuntosChat.{imagen,video,audio}`, `adjuntosChatMesMax` |
| Estados | `habilitado`, `activosMax`, `publicacionesMesMax`, `duracionHoras`, `retencionDias` |
| Lives | `habilitado`, `activosMax`, `minutosDiaMax`, `minutosMesMax`, `retencionHoras` |
| Packs | `habilitado`, `gbMax`, `archivosMax` |

**Archivos:** `scripts/config-plan-entitlements-schema.json`, extender `config-precios-planes-perfiles-schema.json`  
**Firestore rules:** `config_plan_entitlements/**` write admin; deny write cliente a `usage/*`  
**Riesgo si no:** imposible enforcement uniforme.

---

### ENT-002 — PlanEntitlementsResolver (server-side)  
**Clasificación:** bloqueador · **P0** · Dep: ENT-001, TICKET-003

**Functions:** `resolveEntitlements`, `getUsageSnapshot`, hook `onContratoActivado`  
**Resolución:** plan contrato → límites base → overrides categoría → excepción perfil → add-ons → hardCap  

**Archivos:** `functions/lib/plan-entitlements-resolver.js`, `public/js/plan-entitlements-client.js`  
**Riesgo si no:** validación inconsistente registro / dashboard / chat.

---

### ENT-003 — Documento `usage/current` (contadores autoritativos)  
**Clasificación:** bloqueador · **P0** · Dep: ENT-001

**Firestore:** `perfiles/{perfilId}/usage/current` — **solo Functions escriben**  
**Functions:** `incrementUsage`, `decrementUsage`, `recalculateUsageFromStorage`, reset mensual adjuntos chat  

**Riesgo si no:** usuario Básico sube 50 fotos; egress descontrolado.

---

## 2. Enforcement de upload

### ENT-010 — `preUploadValidate` (cliente)  
**Clasificación:** bloqueador · **P0** · Dep: ENT-002, ENT-003

Antes de `Storage.put`: plan activo, cupo, MIME, tamaño, contexto (`perfil_galeria`, `chat_adjunto`, etc.).

**Archivos a integrar:**
- `public/js/registro-perfil-submit.js`
- `public/index.html`
- `public/js/dashboard-publicaciones.js`
- `public/js/dashboard-solicitudes-contenido.js`
- `public/registro-banner.html`, `registro-banner2.html`
- `public/dashboard-rentero.html`

**Riesgo si no:** solo UX; bypassable sin ENT-011.

---

### ENT-011 — `uploadGate` Cloud Function  
**Clasificación:** bloqueador · **P0** · Dep: ENT-002, ENT-003

**Functions:**
- `uploadGate` (callable) → token firmado + path canónico
- `uploadComplete` → increment usage
- `onObjectFinalized` → rechazar huérfanos

**Riesgo si no:** atacante usa SDK Storage directo — **vector principal de abuso**.

---

### ENT-012 — Storage Rules v2  
**Clasificación:** bloqueador · **P0** · Dep: ENT-011, ENT-003

**Archivos:** `storage.rules`, fusión con `scripts/blk05-storage-rules-draft.rules`  
**Reglas:** owner + token upload; MIME por contexto; MB dinámico desde Firestore; default deny  
**Deploy:** Function primero, Rules después.

**Riesgo si no:** reglas actuales permiten 8 MB × N fotos sin tope de count.

---

### ENT-013 — Inventario puntos de upload  
**Clasificación:** post-lanzamiento · **P1** · Dep: ENT-010, ENT-011

Checklist: `grep storage.ref.*put` en `public/` = 0 sin gate. Banners con cupos separados (PLAN-MAESTRO-BANNERS).

---

## 3. Dashboard de uso

### ENT-020 — Widget uso vs cupos + upgrade CTA  
**Clasificación:** post-lanzamiento · **P1** · Dep: ENT-002, ENT-003, TICKET-011

**UI en dashboard-rentero:** espacio GB, fotos/videos, estados, lives, adjuntos chat; barras 80%/95%; CTA upgrade scoped a `perfilActivoId`.

**Archivos:** `public/js/dashboard-uso-plan.js`, `dashboard-rentero.html`, CSS pro.

**Riesgo si no:** usuario descubre límite al fallar — churn y soporte.

---

### ENT-021 — Notificaciones proximidad límite  
**Clasificación:** mejora futura · **P2** · Dep: ENT-020, ECO-050

Avisos 80/95/100% in-app; máx 1/día/tipo.

---

## 4. Admin de planes

### ENT-030 — Admin UI precios + cupos  
**Clasificación:** post-lanzamiento · **P1** · Dep: ENT-001, ECO-000

Editar precios (precio congelado intacto) y cupos por plan; activar/desactivar beneficios; audit log.

**Functions:** `adminUpdatePlanEntitlements`  
**Archivos:** `public/admin.html`, `public/js/admin-plan-entitlements.js`

---

### ENT-031 — Overrides por categoría/subcategoría  
**Clasificación:** bloqueador · **P0** · Dep: ENT-030, ENT-001

**Firestore:** `config_plan_entitlements/overrides_categoria/{id}`  
**Seed desde:** `auditoria-monetizacion-categorias-462.json` / CSV sostenibilidad  

**Riesgo si no:** 25 subs rojas auditoría siguen vendibles en tier inferior.

---

### ENT-032 — Excepciones por perfil  
**Clasificación:** post-lanzamiento · **P1** · Dep: ENT-030

Cupos extra temporales con expiración, motivo, techo hardCap; visible en dashboard.

---

## 5. Cleanup / retención

### ENT-040 — Job estados vencidos  
**Clasificación:** post-lanzamiento · **P1** · Dep: ENT-001, ENT-003

Scheduler 6h: purge estados + media Storage; decrement `estadosActivos`; respetar `retencionDias` por plan.

---

### ENT-041 — Job lives vencidos  
**Clasificación:** mejora futura · **P2** · Dep: ENT-040, StoriesLivesEngine

Purge grabaciones post `retencionHoras`; actualizar `livesMinutosMes`.

---

### ENT-042 — Archivos huérfanos Storage  
**Clasificación:** bloqueador · **P0** · Dep: ENT-011, ENT-003

Weekly scan: pending >24h sin `uploadComplete`; objetos sin `media_registry`; dry-run admin.

**Riesgo si no:** bucket crece silenciosamente; costo storage sin ingreso.

---

### ENT-043 — Retención media perfiles vencidos (N días)  
**Clasificación:** post-lanzamiento · **P1** · Dep: ENT-042, ECO-040, `vencerPerfiles`

Grace 30d configurable → soft hide → delete media pública; KYC preservado; coordinar TICKET-052 banner impago.

**Storage rules:** deny read public post-purge.

---

## 6. Enforcement por categoría/subcategoría

### ENT-050 — Matriz categoría (plan mínimo + delta)  
**Clasificación:** bloqueador · **P0** · Dep: ENT-002, ENT-031

| Grupo | Regla |
|-------|--------|
| **Adultos alto consumo** (24 subs) | `planMinimoRequerido: vip` |
| **Generadores contenido** (`persona_creador`) | vip + packs |
| **Eventos** | premium+ lives; venues vip |
| **Producción audiovisual** | vip + storage/video extendido |
| **restaurante-bar** | vip mínimo |
| **Premium/Especial auditoría** | checkout ≥ plan recomendado |

**Functions:** `assertPlanMinimoForSubcategoria` en uploadGate + resolver.

---

### ENT-051 — Gate checkout plan mínimo  
**Clasificación:** bloqueador · **P0** · Dep: ENT-050, ECO-010

**Archivos:** `public/js/carihub-publicacion-pagos.js`, `functions/payments/`  
UI oculta tiers inferiores; server rechaza orden inválida.

**Riesgo si no:** escort checkout $249 básico — abuso desde día 1.

---

### ENT-052 — Enforcement packs / venta digital  
**Clasificación:** mejora futura · **P2** · Dep: ENT-050, ENT-011, PremiumContentGate

Storage `perfiles/{id}/packs/**`; read solo compradores; vip + creadores.

---

### ENT-053 — Playbook QA alto riesgo  
**Clasificación:** post-lanzamiento · **P1** · Dep: ENT-050, ENT-051, ENT-010

Fixtures golden + checklist top 20 auditoría (`contenido`, `escort`, `creador-de-contenido-digital`, `restaurante-bar`, etc.).

---

## Resumen por clasificación

### Bloqueadores de sostenibilidad (9)

| Ticket | Título |
|--------|--------|
| ENT-001 | Schema PlanEntitlements |
| ENT-002 | Resolver server-side |
| ENT-003 | usage/current authoritative |
| ENT-011 | uploadGate Function |
| ENT-012 | Storage Rules v2 |
| ENT-031 | Admin overrides categoría |
| ENT-042 | Cleanup huérfanos |
| ENT-050 | Matriz categoría |
| ENT-051 | Gate checkout plan mínimo |

### Importante post-lanzamiento (8)

ENT-010, ENT-013, ENT-020, ENT-030, ENT-032, ENT-040, ENT-043, ENT-053

### Mejora futura (3)

ENT-021, ENT-041, ENT-052

---

## Functions necesarias (consolidado)

| Function | Ticket | Tipo |
|----------|--------|------|
| `resolveEntitlements` | ENT-002 | callable |
| `getUsageSnapshot` | ENT-002 | callable |
| `incrementUsage` / `decrementUsage` | ENT-003 | internal |
| `recalculateUsageFromStorage` | ENT-003 | scheduled |
| `uploadGate` | ENT-011 | callable |
| `uploadComplete` | ENT-011 | callable |
| `onObjectFinalized` | ENT-011 | Storage trigger |
| `adminUpdatePlanEntitlements` | ENT-030 | callable |
| `importOverridesFromAuditoria` | ENT-031 | callable one-shot |
| `purgeEstadosVencidos` | ENT-040 | scheduled |
| `purgeLivesVencidos` | ENT-041 | scheduled |
| `scanOrphanStorage` | ENT-042 | scheduled |
| `purgePerfilVencidoMedia` | ENT-043 | scheduled |
| `validateCheckoutPlan` | ENT-051 | payments hook |
| `assertPlanMinimoForSubcategoria` | ENT-050 | lib |

Extiende existente: `vencerPerfiles` (`functions/index.js`) → ENT-043.

---

## Firestore / Storage rules necesarias

### Firestore

```
config_plan_entitlements/global          → read auth; write admin
config_plan_entitlements/overrides_*     → read auth; write admin
config_plan_entitlements/excepciones_*   → read admin+owner scope; write admin
perfiles/{perfilId}/usage/current        → read owner|admin; write FALSE (Functions only)
perfiles/{perfilId}/estados/*            → write gated por plan + moderación
perfiles/{perfilId}/packs/*              → read purchase gate (futuro ENT-052)
```

Helpers compartidos con `firestore.rules` y Storage: `isProfileOwner`, `perfilActivo`, `planNoVencido`.

### Storage (rutas canónicas post-gate)

```
perfiles/{perfilId}/public/{fileId}      — fotos/videos perfil
perfiles/{perfilId}/chat/{convId}/{fileId} — adjuntos mensajes
perfiles/{perfilId}/estados/{estadoId}/* — media temporal
perfiles/{perfilId}/lives/{liveId}/*     — grabaciones
perfiles/{perfilId}/packs/{packId}/*     — venta digital (vip)
verificaciones/{uid}/**                  — KYC (reglas actuales)
```

---

## Riesgos globales si no se implementa

1. **Bypass SDK:** sin ENT-011 + ENT-012, cualquier usuario autenticado sube sin tope de count.
2. **Conteo cliente:** sin ENT-003, rules no pueden saber cuántas fotos ya existen.
3. **Tier incorrecto:** sin ENT-050/051, 25 categorías rojas de auditoría compran plan inferior.
4. **Storage creep:** sin ENT-042/043, media zombie de perfiles vencidos sigue sirviendo egress.
5. **Costo viral:** perfil “Básico” con adjuntos chat + 15 fotos → escenario auditoría 8× vistas; margen spreadsheet OK, factura Firebase no.

---

## Estimación global (equipo 1-2 devs)

| Fase | Tickets | Semanas aprox. |
|------|---------|----------------|
| Bloqueadores MVP enforcement | ENT-001–003, 011–012, 050–051, 031, 042 | 6–10 |
| Post-launch UX + admin + cleanup | ENT-010, 013, 020, 030, 032, 040, 043, 053 | 4–6 |
| Futuro lives/packs/notifs | ENT-021, 041, 052 | 3–5 (cuando módulos existan) |

---

## Próximo paso sugerido (cuando autorices implementación)

1. Aprobar schema `config-plan-entitlements-schema.json` como baseline.  
2. Implementar ENT-001 → ENT-003 → ENT-002 en Functions (emulador).  
3. Paralelo ENT-011 + ENT-012 antes de abrir adjuntos chat en producción.  
4. ENT-051 en checkout antes de campaña adultos/creadores.

Para crear issues GitHub: usar `scripts/tickets-plan-entitlements-enforcement.json` con `scripts/create-github-issues.mjs` **solo cuando lo autorices**.
