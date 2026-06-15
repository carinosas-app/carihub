# Auditoría técnica final — Messenger v1.0.0

| Campo | Valor |
|-------|-------|
| **Fecha** | 2026-06-09 |
| **Revalidación post OB-MSG** | 2026-06-09 |
| **Veredicto** | **Diseño consistente — listo revisión congelamiento PO** |
| **OB-MSG-1–8** | **CERRADOS** |
| **¿Congelar sin cambios?** | **No** (histórico) |
| **¿Listo revisión PO?** | **Sí** |
| **Congelamiento** | **APROBADO PO 2026-06-09** |
| **Acta estado** | `CONGELADO` |

Canónico: [`AUDITORIA-FINAL-SPEC-MESSENGER.json`](./AUDITORIA-FINAL-SPEC-MESSENGER.json)

Validador estructural: **21/21 PASS** (post OB-MSG) — **no sustituye** aprobación PO.

---

## 1. Compatibilidad con capas congeladas

| Capa | Estado | Resumen |
|------|--------|---------|
| **Catálogo 1.0.0** | Compatible | Ámbitos admin por subcategoría; falta lista enumerable solicitud obligatoria |
| **Cuentas 1.0.0** | Compatible con reserva | `estadoMensajeria`/bloqueos OK; `spamScore` no en schema mensajeria cuentas; migración monolito **alto riesgo** |
| **Seguridad MVP 1.0.0** | Compatible con gaps | Rate limits y umbrales alineados; límite 5 conv/día solo en SPEC; `telefonoVerificado` no en VE validateStates |
| **FieldEngine 1.0.1** | Sin dependencia | Config mensajería perfil no en FieldEngine |
| **Dashboards 1.0.0** | Compatible con extensión | Dominios `mensajes`/`historial_mensajes` existen; eventos solicitud_* y admin `mensajeria.*` **no** en acta congelada |
| **ValidationEngine 1.0.0** | Compatible + MINOR | 3 acciones VE vs 20 SPEC; registry placeholders; propuesta MINOR correcta |

---

## 2. Dependencias ocultas (10)

Críticas: **migración usuarios→perfiles**, **VE 1.1.0**, **índices Firestore**, **realtime**, **algoritmo conversacionId**.

También: PATCH documental Dashboards, Storage adjuntos, `reportes_mensajeria` vs `denuncias`, evaluación controles admin, timezone automatizaciones.

---

## 3. Contradicciones internas (resueltas OB-MSG)

| ID | Problema | Resolución |
|----|----------|------------|
| CON-MSG-01 | `solicitud_aceptada` vs `activa` | **OB-MSG-1** — aceptar→`activa` |
| CON-MSG-02 | `archivada` global vs meta | **OB-MSG-2** — meta canónica |
| CON-MSG-03 | `conversacion_iniciar` siempre solicitud | **OB-MSG-3** — bifurcación directa\|solicitud |
| CON-MSG-04 | doble fuente preferencias | **OB-MSG-2** — `conversaciones_meta` canónica |
| CON-MSG-06 | `admin_automatizaciones_suspendir` | **OB-MSG-5** — en catálogo VE |
| CON-MSG-09 | fanOut incompleto | **OB-MSG-4** — registry v1.0.1 (24 entradas) |

---

## 4. Casos límite no contemplados (muestra)

Cuenta eliminada con chats activos · `solo_lectura` receptor · mismo par dos perfiles · cooldown re-solicitud · bloqueo con solicitud pendiente · controles admin geo vs conversación activa · purge 90d vs investigación · anunciante sin perfil público.

---

## 5. Riesgos implementación futura

| Nivel | Ejemplo |
|-------|---------|
| Crítico | Runtime sin VE 1.1.0 — EventBus roto |
| Alto | Índices queries bandeja; doble modelo meta; cron automatizaciones duplicados |
| Medio | Latencia pipeline IA; costo evaluación controles admin |

---

## 6. Riesgos migración

| Entidad | Riesgo |
|---------|--------|
| `usuarios/{uid}` | **Alto** — monolito vs hub |
| `perfiles/{perfilId}` | **Alto** — botón perfil legacy |
| `conversaciones_meta` | **Medio** — crear al registrar |
| Participantes denormalizados | **Medio** — alias desactualizado |

---

## 7. Revisión fixtures M01–M30

**Bien cubiertos:** envío OK, verificación email/tel, solicitud adultos, aceptar/rechazar, spam, reporte, eliminar ventana, automatización, admin ámbito, operador empresa, IA borrador.

**Añadidos M25–M30:** inicio directa empresa · bloqueo · reportar mensaje · restringida respuesta · eliminar con reporte pendiente · `conversacionId` determinístico.

**Corregidos:** M16 fanOut con notificación; M07 coherente con OB-MSG-1 (`activa`).

**Huecos menores (AM-MSG):** pipeline IA rechazo detallado · precedencia controles admin en fixture dedicado.

---

## 8. Costoso descubrir post-runtime (mitigado documentalmente)

`conversacionId` y duplicados → **OB-MSG-6**. Modelo archivada → **OB-MSG-2**. Pendiente runtime: unificar reportes · ventana 15 min enforcement · precedencia controles admin · grupos N.

---

## Fortalezas

Arquitectura app separada · IA-Seguridad articulada · solicitud conversación adultos · eliminación + investigación · automatizaciones con anti-spam · control admin 11 ámbitos · 24 fixtures · propuesta VE sin tocar capa congelada.

---

## Debilidades (post OB-MSG — residual)

Migración usuarios→perfiles · VE 1.1.0 requerido para runtime · PATCH Dashboards 1.1.0 recomendado · índices/realtime no especificados · algunos AM-MSG abiertos.

---

## Ajustes obligatorios (OB-MSG) — CERRADOS

| ID | Estado | Contenido |
|----|--------|-----------|
| **OB-MSG-1** | CERRADO | Estados normalizados; aceptar→`activa`; `archivada` solo meta |
| **OB-MSG-2** | CERRADO | `conversaciones_meta` canónica |
| **OB-MSG-3** | CERRADO | Bifurcación directa\|solicitud + fanOut variantes |
| **OB-MSG-4** | CERRADO | Registry fanOut v1.0.1 — 24 entradas |
| **OB-MSG-5** | CERRADO | `admin_automatizaciones_suspendir` en catálogo VE |
| **OB-MSG-6** | CERRADO | Algoritmo `conversacionId` sha256 + política trío |
| **OB-MSG-7** | CERRADO | `ANEXO-MESSENGER-INTEGRACION-DASHBOARDS.json` |
| **OB-MSG-8** | CERRADO | `telefonoVerificado` gate; `spamScore` canónico; VE-MINOR-05/06/07 |

---

## Ajustes recomendados (AM-MSG)

Fixtures M25–M30 · cooldown re-solicitud · clarificar M11 spamScore · límite conv/día · archivar en investigación · M16 fanOut · IA sugerir como acción VE o exclusión · matriz reportes vs denuncias · actualizar acta.

---

## Veredicto congelamiento

| Pregunta | Respuesta |
|----------|-----------|
| ¿OB-MSG cerrados? | **Sí** |
| ¿Listo revisión PO? | **Sí** |
| ¿Congelamiento aprobado? | **Sí** — 2026-06-09 |
| Acta estado | **`CONGELADO`** |

**ValidationEngine 1.0.0 no modificado** — cambios en `PROPUESTA-ACTA-MINOR-VALIDATIONENGINE-MESSENGER.json` (VE-MINOR-05/06/07).

---

*Auditoría de diseño — no autoriza congelamiento ni runtime.*
