# PLAN-MAESTRO-BANNERS-PUBLICIDAD v1.0.0

**Fecha:** 2026-06-10 · **Estado:** PLAN DE DISEÑO DOCUMENTAL
**Modo:** Solo análisis y documentación. No runtime · no carpetas · no mover archivos · no Firestore · no deploy · no commit · no modifica capas existentes.

> **Principio rector:** Banners administra **inventario y creativos**. Pagos/Contratos **cobra y congela**; RenderEngine **pinta** el slot publicado; Admin **aprueba/concilia**. Un slot publica solo con `contrato_banner` activo + `pago_confirmado`. **Métricas reales > estimadas.**

Construido sobre los assets reales de publicidad (`seed-configuracion-publicidad.json`, `precios-publicidad.js`, `banner-inventario-rotacion.js`, `config-promociones-banners-schema.json`, `registro-banner*.html`), que **referencia y no modifica**.

---

## 1. Inventario actual relacionado con banners

| Componente | Estado | Archivo |
|---|---|---|
| Inventario + rotación | Diseño/estimación | `public/js/banner-inventario-rotacion.js` |
| Precios | Diseño detallado | `public/js/precios-publicidad.js` + `seed-configuracion-publicidad.json` |
| Promociones + contrato | Schema | `config-promociones-banners-schema.json` |
| Captación | Funnel parcial | `registro-banner.html` (+2 / +paso3) |
| Aprobación | Manual | `admin.html` → `solicitudes_anuncios` |
| **Estadísticas reales** | **No existen** | apariciones son **proyección**, sin tracking de impresiones/clicks/CTR |

### 17 slots reales (pantalla · capacidad · precio mensual imagen MXN)

| Pantalla | Slot | Cap. | $ mensual imagen | Nota |
|---|---|---|---|---|
| Home | home_izquierda | 2 | 1300 | |
| Home | home_derecha | 2 | 1300 | |
| Home | home_inferior | 3 | 850 | |
| Home | home_categorias | 1 | 1000 | exclusivo |
| Home | home_hero_1..5 | 1 c/u | 5000 c/u | exclusivos |
| Resultados | resultados_izquierda | 3 | 500 | |
| Resultados | resultados_centro | 2 | 600 | |
| Resultados | resultados_derecha | 3 | 500 | |
| Resultados | resultados_inferior | 3 | 350 | |
| Perfil | perfil_izquierda | 3 | 500 | |
| Perfil | perfil_centro | 2 | 600 | |
| Perfil | perfil_derecha | 3 | 500 | |
| Perfil | perfil_inferior | 3 | 350 | |

**Apariciones diarias base (estimadas, repartidas entre capacidad):** hero 1200/día · categorias 650 · home izq/der 420 · home inferior 360 · resultados_centro 340 · resultados izq/der 280 · resultados_inferior 220 · perfil_centro 320 · perfil izq/der 260 · perfil_inferior 210.

---

## 2. Inventario futuro

- **Pantallas:** Home · Resultados · Perfil · Landing País/Estado/Ciudad · Landing Categoría/Subcategoría · Landing SEO geo+categoría.
- **Espacios futuros:** slots en landings SEO · in-feed en resultados · por categoría · video doble/triple en hero · espacios nacionales/internacionales.
- **Regla:** nuevos slots se declaran en `configuracion_publicidad` (mismo modelo pantalla/espacio/capacidad/precio); RenderEngine los pinta sin HTML nuevo por categoría.

---

## 3. Modelo de inventario

`pantalla → espacio → slotId → ocupación(capacidad)`.
**Estados de ocupación:** disponible · parcial · completo (`ocupado === capacidadMaxima`).
**Rotación:** cap=1 → exclusivo; cap>1 → rotación entre N activos; hero/categorias siempre exclusivos.
**Apariciones estimadas:** `INVENTARIO_DIARIO_BASE[slot] / capacidad` (día, ×15 quincena, ×30 mes).

---

## 4. Contenidos

- **Tipos:** imagen · video · audio (futuro).
- **Multi-espacio:** imagen múltiple · video doble · video triple · múltiples slots por campaña.
- **Multiplicadores:** imagen ×1 · video ×2.
- **Atributos:** duración (video) · peso/optimización · formato responsivo · rotación.
- **Validación:** ValidationEngine + KYC anunciante; creativos revisados antes de publicar.

---

## 5. Campañas

| Tipo | Descripción |
|---|---|
| Simple | 1 slot |
| Múltiple | varios slots/paquete |
| Geográfica | país/estado/ciudad |
| Por categoría/subcategoría | slots filtrados |
| Nacional | cobertura nacional |
| Internacional | futuro |

Campaña = agrupación de N contratos/slots con vigencia común; **precio = suma de slots**.

---

## 6. Estadísticas

- **Actual:** estimadas (apariciones), **sin tracking real**.
- **Futuras:** impresiones reales · clicks · CTR · aperturas · conversiones.
- **Visibles al anunciante:** impresiones/apariciones de SUS banners, clicks, CTR, vigencia restante.
- **Visibles al admin:** ocupación por slot, ingresos por slot/pantalla, CTR global, slots completos/vacíos, anomalías/fraude.
- **Política:** distinguir métrica REAL vs ESTIMADA en UI; impresiones server-side; anti-bot en clicks; sin PII del visitante.
- **Colecciones propuestas:** `estadisticas_banner/{slotId}_{periodo}`, `eventos_banner/{id}` (impresion|click).

---

## 7. Precios

- MXN · IVA incluido · redondeo 50. Factores: semanal `0.35` · quincenal `0.65` · mensual `1`. **Video ×2**.
- **Modo:** automático (base × factor) o manual (precio fijo por periodo).
- **Resolución:** `precioMensualImagenBase(slot) × multiplicadorTipo × factorPeriodo → redondeo 50 (IVA incl.)`.
- **Home:** hero 5000 · izq/der 1300 · categorias 1000 · inferior 850. **Resultados/Perfil:** centro 600 · izq/der 500 · inferior 350.
- **Promociones:** tiempo igual gratis (7→14, 15→30, 30→60, 90→180), pago adelantado obligatorio.
- **Descuentos:** por paquete/campaña (futuro, editable Admin).
- **Reglas futuras editables** desde Admin comercial; **no afectan contratos activos** (congelado).
- **Fuente de verdad:** `configuracion_publicidad/precios_banners` (separado de `config_precios_perfiles`).

---

## 8. Contratos

- **Tipos:** contrato_banner (1 slot) · contrato_campaña (N slots). Colección: `contratos_banners/{id}`.
- **Congelado:** `precioContratado` + `promocionAplicada` fijos durante `diasTotales`.
- **Vigencia/renovación/vencimiento/suspensión/reactivación/cancelación:** gobernados por `PLAN-MAESTRO-PAGOS-CONTRATOS`.
- **Revisión post-pago:** cambios en imagen/mensaje/slot/categoría/ciudad/documentos → `revision_post_pago` (bloquea publicación hasta aprobar).

---

## 9. Ciclo completo

`solicitud → revisión (Admin) → autorizado_para_pago → pago_pendiente → pago_confirmado → contrato_banner → publicación (RenderEngine) → estadísticas → por_vencer → vencimiento → (renovación | oculto)`

- **Ciclo comercial:** cotización (PricingResolver) → solicitud → autorización → contrato.
- **Ciclo financiero:** pago → confirmación → congelado → renovación/vencimiento (ver Pagos/Contratos).

---

## 10. Dashboards

- **Anunciante:** mis banners/campañas, estado y vigencia, apariciones/impresiones, clicks, CTR, comprobantes, renovar.
- **Banners (operación):** ocupación por slot, calendario de vigencias, creativos pendientes.
- **Admin publicidad:** cola `solicitudes_anuncios`, ingresos por slot/pantalla, ocupación global, anomalías/fraude, precios/promos.

> Dashboards solo visualizan; aprobación/conciliación en Admin (ver Dashboards 1.0.0 `publicidad_banners` y PLAN-MAESTRO-DASHBOARDS).

---

## 11. Admin

- **Acciones:** revisión, aprobación, rechazo (motivo), autorizar para pago, confirmar pago, suspensión, reactivación, modificación manual de creativo/slot, auditoría, modificar precios/promos.
- **Doble confirmación:** suspender banner activo público · cancelar campaña con reembolso · modificar slot de contrato activo.
- **Auditoría obligatoria:** aprobar/rechazar · confirmar pago · acceso a KYC · modificar precios.
- **Aprobación superior:** reembolso · excepción de precio · override de inventario (publicar sobre capacidad).

---

## 12. Automatizaciones

Publicación automática (pago confirmado + revisión OK) · vencimiento automático · renovación automática (futuro) · recordatorios pre-vencimiento · alertas (slot completo, creativo caído, anomalía CTR).
**Regla:** vencimiento oculta (no borra); rotación recalculada al activar/vencer; jobs idempotentes con log.

---

## 13. Integraciones

Shared/Core (tokens/helpers/config) · ValidationEngine (creativos/estados) · FieldEngine (datos anunciante/creativo) · RenderEngine (pinta slot desde snapshot) · Dashboards (visualización) · Admin (revisión/conciliación) · Pagos/Contratos (cobro/contrato congelado) · App Pública (expone slots, carga liviana/lazy) · SEO (creativos no indexables; vencido oculto) · ThemeEngine (estilo del contenedor) · Agentes IA (iaComercial recomienda, solo lectura).

---

## 14. Matrices

### Pantalla → banner → slot → capacidad
| Pantalla | Slots | Capacidad total | Exclusivos |
|---|---|---|---|
| Home | 9 | 13 (izq2+der2+inf3+cat1+hero1×5) | categorias, hero_1..5 |
| Resultados | 4 | 11 (izq3+centro2+der3+inf3) | — |
| Perfil | 4 | 11 (izq3+centro2+der3+inf3) | — |

### Campaña → pago → contrato → publicación
- **Simple:** 1 solicitud → 1 pago → 1 contrato → 1 slot publicado.
- **Múltiple/campaña:** 1 solicitud → 1 pago (suma) → N contratos → N slots.
- **Geográfica:** slots filtrados por país/estado/ciudad.
- **Publica si:** contrato activo + pago_confirmado + (sin cambios post-pago o revisión post-pago aprobada).

### Estado → transición
`solicitud → {en_revision, rechazado}` · `en_revision → {autorizado_para_pago, rechazado, correccion}` · `autorizado_para_pago → pago_pendiente` · `pago_pendiente → {pago_confirmado, vencido}` · `pago_confirmado → {publicado, revision_post_pago}` · `publicado → {por_vencer, suspendido}` · `por_vencer → {renovado, vencido}` · `vencido → {renovado, oculto}` · `suspendido → {publicado, cancelado}`.

### Permisos
crear solicitud = anunciante · revisar/aprobar/rechazar = super_admin/moderador/comercial_admin · confirmar pago = super_admin/comercial_admin · suspender/reactivar = super_admin/admin/moderador · modificar precios = super_admin/comercial_admin · ver stats propias = anunciante dueño · ver stats globales = super_admin/comercial_admin/auditor.

### Estadísticas
impresión = incremento server-side al pintar (anti-bot) · click = evento validado (dedup por sesión) · CTR = clicks/impresiones · anunciante ve impresiones/clicks/CTR/vigencia · admin ve además ingresos/ocupación/anomalías.

### Precios → vigencias
hero mensual imagen 5000 (video 10000) · home izq/der 1300 · categorias 1000 · home inferior 850 · centro 600 · izq/der 500 · inferior 350 · semanal ×0.35 · quincenal ×0.65 · promo "tiempo igual gratis" duplica `diasTotales`.

---

## 15. Módulos internos y rutas

**Módulos:** InventoryManager · RotationEngine · CreativeStore · CampaignBuilder · AdImpressionTracker · AdStatsReporter · AdPricingResolver · AdReviewQueue.

**Rutas anunciante:** `/cuenta/banners`, `/cuenta/banners/nuevo`, `/cuenta/banners/:id/stats`, `/cuenta/banners/renovar`.
**Captación:** `/anunciar`. **Admin:** `/admin/publicidad`, `/admin/publicidad/solicitudes`, `/admin/publicidad/inventario`, `/admin/publicidad/precios`.

---

## 16. Riesgos

| ID | Nivel | Riesgo | Mitigación |
|---|---|---|---|
| BP-R01 | crítico | Estadísticas estimadas, no reales | AdImpressionTracker server-side + etiquetar estimado vs real |
| BP-R02 | alto | Overbooking del slot | InventoryManager con bloqueo por capacidad + override con aprobación superior |
| BP-R03 | alto | Publicar sin contrato/pago | gate: contrato activo + pago_confirmado |
| BP-R04 | alto | Doble fuente de precios (seed/JS/Firestore) | `configuracion_publicidad` única fuente; JS solo fallback |
| BP-R05 | medio | Cambio de precio afecta campañas activas | precio/promoción congelados |
| BP-R06 | medio | Banners pesados dañan CWV de Home | lazy load, peso máximo, optimización, snapshot |
| BP-R07 | medio | Click fraud / impresiones infladas | anti-bot, dedup por sesión, server-side |
| BP-R08 | medio | Creativo inapropiado | revisión obligatoria + revision_post_pago + moderación |
| BP-R09 | bajo | Aprobación manual no escala | AdReviewQueue con SLA + publicación automática |

---

## 17. Dependencias

- **Congeladas:** Shared/Core 1.0.0 · RenderEngine 1.0.0 · ValidationEngine 1.1.0 · FieldEngine 1.0.1 · Dashboards 1.0.0.
- **Planes:** PLAN-MAESTRO-PAGOS-CONTRATOS · PLAN-MAESTRO-ADMIN · PLAN-MAESTRO-DASHBOARDS.
- **Schemas de diseño:** `config-promociones-banners-schema.json`, `seed-configuracion-publicidad.json`.
- **Precondiciones:** AdImpressionTracker (stats reales) · RenderEngine pintando slots · rules para `configuracion_publicidad`/`contratos_banners`/`estadisticas_banner` · migración usuarios→anunciante.

---

## 18. Estructura ideal futura (lógica; sin crear carpetas)

Captación `/anunciar` + gestión en `/cuenta/banners` + consola `/admin/publicidad`. Núcleo: InventoryManager, RotationEngine, CreativeStore, AdImpressionTracker, AdStatsReporter, AdPricingResolver, AdReviewQueue. Separación estricta: **inventario/creativos** (este módulo) ⟂ **cobro/contrato** (Pagos) ⟂ **pintado** (RenderEngine) ⟂ **visualización** (Dashboards).

---

## 19. Orden recomendado de implementación

1. **P0** — Unificar precios en `configuracion_publicidad` (JS solo fallback) + AdPricingResolver → cierra BP-R04.
2. **P0** — InventoryManager (capacidad/ocupación) + gate de publicación (contrato+pago) → cierra BP-R02/R03.
3. **P1** — AdReviewQueue (migrar `solicitudes_anuncios`) + revisión/revision_post_pago → cierra BP-R08/R09.
4. **P1** — AdImpressionTracker + AdStatsReporter (impresiones/clicks/CTR reales, anti-fraude) → cierra BP-R01/R07.
5. **P1** — RotationEngine + RenderEngine pintando slots con lazy/optimización → cierra BP-R06.
6. **P2** — CampaignBuilder (multi-slot/geo) + promociones/descuentos.
7. **P3** — Slots en landings SEO + video doble/triple + internacional.

---

## 20. Procedencia

**Sí procede** `PLAN-MAESTRO-BANNERS-PUBLICIDAD.md/json` — entregados. El inventario ya está parcialmente implementado (17 slots, precios, rotación, captación) pero disperso y sin estadísticas reales ni gate de publicación formal; este plan unifica inventario, creativos, estadísticas y su frontera con Pagos/RenderEngine/Admin.

**Siguientes pasos sugeridos:** `SPEC-BANNERS` (si se autoriza congelar) · `ADR-METRICAS-PUBLICIDAD` (real vs estimado) · integración con `SPEC-PAGOS-CONTRATOS`.

> No modifica capas congeladas ni los schemas/seed de publicidad existentes (solo los referencia). Sin cambios en producción/Firestore/deploy/commit.
