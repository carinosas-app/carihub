# Auditoría técnica — SPEC FieldEngine v1.0.0

**Fecha:** 2026-06-09 · **Tipo:** Solo diseño · **Implementación:** no autorizada

JSON: [`AUDITORIA-SPEC-FIELDENGINE.json`](./AUDITORIA-SPEC-FIELDENGINE.json)

---

## Veredicto ejecutivo

| Pregunta | Respuesta |
|----------|-----------|
| ¿Puede congelarse sin cambios? | **No** |
| ¿Requiere ajustes menores? | **Sí** (3 obligatorios, 5 recomendados) |
| ¿Generar acta de congelamiento? | **Sí** — v1.0.0 baseline con addendum pre-implementación |
| ¿Apto como baseline de diseño? | **Sí** — arquitectura sólida con deuda documentada |

---

## 1. Fortalezas del diseño

1. **Separación de motores** clara: FieldEngine resuelve *qué campos*; ValidationEngine *valores y anti-abuso*; RenderEngine *snapshot publicado*.
2. **Alineación catálogo congelado:** arquetipo y `tipoPerfil` desde mapa — coherente con acta Catálogo 1.0.0.
3. **Merge documentado** `base → plantilla → delta` — coincide con `resolucionFieldEngine` en adultos schema.
4. **securityGates** en capa correcta (estado, no Turnstile).
5. **schemaVersion** con política publicar-vs-borrador — compatible con `config-renderizado-dinamico-schema.json`.
6. **10 fixtures** cubren casos críticos incluyendo gates y canonicalId.
7. **Fuera de alcance** explícito evita implementar persistencia prematuramente.

---

## 2. Debilidades del diseño

| # | Debilidad | Severidad |
|---|-----------|-----------|
| D1 | Contradicción `guardar_borrador` vs `estadoSeguridad=restringido` | Alta |
| D2 | `subcategoriaId` obligatorio en JSON / opcional visitante en MD | Media |
| D3 | Fuentes lectura incompletas (categorías sugeridas, renderizado) | Media |
| D4 | Modo `temporal_categoria_sugerida` sin algoritmo detallado | Media |
| D5 | Merge incompleto: `facturacionTipos`, `heredaDe`, `badges` | Media |
| D6 | `resolveHash` sin definición | Baja |
| D7 | Fixtures resumidos, no JSON resuelto ejecutable | Baja |

---

## 3. Riesgos detectados

### Arquitectura (A1–A6)

| ID | Riesgo | Severidad |
|----|--------|-----------|
| **A1** | Gate `guardar_borrador` excluye `restringido` — contradice Seguridad MVP y F10 | **Alta** |
| **A2** | Sin contrato `snapshotAlPublicar` → RenderEngine | **Alta** |
| **A3** | Migración `usuarios/{uid}` monolito no modelada | **Media** |
| **A4** | Modo alternativo (masajes) — re-merge plantilla incompleto | **Media** |
| **A5** | `FORM_IND_NEG` / `empresa_servicios` sin disambiguación | **Media** |
| **A6** | Multi-perfil `perfilIds[]` — cambio categoría mid-draft | **Baja** |

### Dependencias ocultas

- `config-categorias-sugeridas-schema.json`
- `config-renderizado-dinamico-schema.json`
- `config-contratos-carihub-schema.json`
- `config-estados-revision-publicacion-schema.json`
- Módulo `canonicalId` compartido con `validar-schemas-registro.mjs`

### Casos límite no contemplados

- Mapa/schema drift (fila en mapa sin entrada schema)
- `schemaVersion` antigua sin archivo en repo
- `seguridad`/`cuenta` omitidos en context — comportamiento default
- Upgrade visitante + `contratoActivoId`
- Anunciante sin perfil → `solicitud_banner`
- Campos grupo (`fisico`, `geo`) — expansión en wizard
- IA sugiere `modo=alternativo` — quién lo setea

---

## 4. Compatibilidad capas congeladas

| Capa | Estado | Notas |
|------|--------|-------|
| **Catálogo 1.0.0** | ✅ Compatible | 462/462; mapa fuente arquetipo |
| **Cuentas 1.0.0** | ⚠️ Compatible con reservas | Falta `roles[]` en `CuentaContext` para anunciante |
| **Seguridad MVP 1.0.0** | ⚠️ Ajuste AM1 | Corregir gate `restringido` |

---

## 5. Compatibilidad futura

| Módulo | Estado | Gap principal |
|--------|--------|---------------|
| **ValidationEngine** | Buena | Exportar `validationProfile` explícito |
| **RenderEngine** | Parcial | Contrato snapshot (AM5) |
| **Messenger** | Buena | Sin solapamiento |
| **Wizard HTML** | Buena | Falta `wizardSections` / orden pasos |
| **Categorías sugeridas** | Incompleta | Algoritmo temporal (AM4) |
| **Contratos** | Parcial | Visitante + `contratar_plan` |

---

## 6. Migración legacy

| Escenario | Descripción |
|-----------|-------------|
| **M1** | Registro nuevo → `perfiles/{id}` desde día 1 |
| **M2** | `perfilId = usuarioId` durante transición |
| **M3** | Borrador legacy sin `schemaVersion` |
| **M4** | Publicado sin snapshot componentes → RenderEngine necesita backfill o HTML legacy |

**Costo si se ignora:** muy alto — especialmente M3/M4.

---

## 7. Cambios muy costosos post-implementación

1. Redefinir estructura `ResolvedRegistrationSchema.campos[]`
2. Mover todos los securityGates a ValidationEngine
3. Recalcular arquetipo en runtime (violar freeze catálogo)
4. No versionar schema en perfil publicado
5. RenderEngine leyendo catálogo live en lugar de snapshot
6. `canonicalId` duplicado inconsistente con validador
7. Colisión `subcategoriaId` cross-sector sin `sectorId` en API

---

## 8. Ajustes menores recomendados

### Obligatorios (pre-implementación)

| ID | Ajuste |
|----|--------|
| **AM1** | `guardar_borrador` permitido en `restringido` (solo bloquear `enviar_revision`) |
| **AM2** | `subcategoriaId` opcional si `formularioId=usuario_visitante` |
| **AM3** | Añadir fuentes lectura categorías sugeridas + renderizado dinámico |

### Recomendados (addendum v1.0.1)

| ID | Ajuste |
|----|--------|
| AM4 | Algoritmo `temporal_categoria_sugerida` |
| AM5 | Sección `snapshotAlPublicar` |
| AM6 | Merge `facturacionTipos` / prioridad componentes mapa |
| AM7 | Definición `resolveHash` |
| AM8 | `CuentaContext.roles[]` para anunciante |

---

## 9. Recomendaciones

1. **Congelar** FieldEngine **v1.0.0** como baseline (ya aprobado) con addendum AM1–AM3 antes de codificar.
2. **Generar** [`ACTA-CONGELAMIENTO-FIELDENGINE`](./ACTA-CONGELAMIENTO-FIELDENGINE.md).
3. **Siguiente:** SPEC ValidationEngine.
4. **No implementar** hasta cerrar AM1–AM3 en spec v1.0.1 o addendum firmado.
5. **Migración legacy:** acta separada M1–M4 antes de Firestore.

---

*Auditoría de diseño. Sin cambios en producción, Firestore, deploy ni commit.*
