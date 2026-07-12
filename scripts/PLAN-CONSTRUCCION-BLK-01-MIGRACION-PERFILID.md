# PLAN-CONSTRUCCION-BLK-01-MIGRACION-PERFILID

| Campo | Valor |
|-------|-------|
| **Versión** | 1.0.0 |
| **Fecha** | 2026-07-10 |
| **Estado** | CONGELADO — Phase 0 (documentación) |
| **Autorización** | BLK-01 Phase 0 — architecture contract formalization only |
| **No autoriza** | Runtime, rules deploy, Cloud Functions prod, migración prod, BLK-04/BLK-05 prod |

## Propósito

Documento canónico que congela contratos, máquina de estados, flags, rollback y matriz de compatibilidad para la migración **usuarios monolito → hub + perfiles/{perfilId}**.

Referencias obligatorias:

- `scripts/ACTA-MIGRACION-USUARIOS-PERFILES.json` (v1.0.0)
- `scripts/config-cuentas-usuario-schema.json`
- `scripts/blk01-migracion-emulador.mjs` + `scripts/README-BLK01-MIGRACION-EMULADOR.md`
- `scripts/blk05-firestore-rules-perfiles-draft.rules` (borrador, no prod)
- Runtime actual: `public/js/carihub-multi-perfil.js`, `public/js/registro-perfil-submit.js`, `public/js/perfil-publico-init.js`, `public/js/resultados-registrados.js`

---

## 0. Evidencia de partida (verificada en repo)

| Hecho | Evidencia |
|-------|-----------|
| Producción = monolito `usuarios/{uid}` | `firestore.rules` → `isPublicProfile()` sobre `usuarios` |
| `perfiles/{perfilId}` **no existe** en rules prod | catch-all deny; borrador solo en `scripts/blk05-*` |
| Multi-perfil TICKET-003 activo en runtime | campos planos `perfilActivoId`, `perfilesVinculados`, `perfilesDetalle` |
| Registro escribe solo hub | `registro-perfil-submit.js` → `appendPerfilToHub`, IDs `perfil_<ts36>_<random>` |
| Perfil público lee `usuarios.doc(id)` | `perfil-publico-init.js:81` |
| Resultados query raíz monolito | `resultados-registrados.js` — no expande `perfilesDetalle` |
| Script migración emulador | solo extrae **raíz** monolito; **no** itera `perfilesDetalle` |
| Bridge documentado | BRIDGE-MIG-01: legacy `perfilId = uid` |

---

## 1. Contrato canónico del hub

### 1.1 Target congelado

Ruta: `usuarios/{uid}` (document id = Firebase Auth uid = `usuarioId` inmutable).

Subobjeto canónico:

```json
{
  "perfil": {
    "perfilPrincipalId": "string|null",
    "perfilIds": ["string"],
    "migradoBlk01": false,
    "schemaVersion": "blk01-hub@1.0.0"
  }
}
```

| Campo | Tipo | Semántica |
|-------|------|-----------|
| `perfilPrincipalId` | string \| null | Perfil público activo principal (puntero SSOT) |
| `perfilIds` | string[] | Todos los perfiles de la cuenta (1..N), sin duplicados |
| `migradoBlk01` | boolean | `true` cuando el bridge BLK-01 aplicó punteros anidados |
| `schemaVersion` | string | Versión del subobjeto `perfil` (semver doc, no Firestore schema enforcement) |

**Campos hub adicionales** (fuera de `perfil.*`, no bloquean BLK-01): `cuenta`, `verificacion`, `mensajeria`, `comercial`, `seguridad`, `preferencias`, `anunciante` — según `config-cuentas-usuario-schema.json`. BLK-01 no los migra; permanecen en hub.

### 1.2 Espejos planos temporales (backward compatibility)

Runtime TICKET-003 y reglas prod (`firestore.rules`) usan campos **planos en raíz**:

| Espejo plano (legacy runtime) | Equivalente canónico | Dirección de sync en transición |
|-------------------------------|----------------------|----------------------------------|
| `perfilActivoId` | `perfil.perfilPrincipalId` | **Bidireccional** mientras `LEGACY_ONLY` … `DUAL_READ_FALLBACK` |
| `perfilesVinculados[]` | derivado de `perfilIds` + metadatos rail | **Escritor dual** mantiene ambos; lectura preferir `perfilIds` cuando exista |
| `perfilesDetalle{perfilId}` | payload embebido pre-SSOT | **Solo lectura/fallback** hasta `PERFILES_WRITE_PRIMARY`; no SSOT |

Reglas prod ya validan updates multi-perfil sobre planos (`perfilActivoId`, `perfilesDetalle`, `perfilesVinculados`).

### 1.3 Política de deprecación de espejos

| Fase máquina de estados | Espejos planos |
|-------------------------|----------------|
| `LEGACY_ONLY` | Autoritativos (única fuente) |
| `DUAL_WRITE_SHADOW` | Escritos en paralelo; `perfil.*` = shadow |
| `DUAL_READ_FALLBACK` | Lectura prefer `perfiles/`; fallback planos |
| `PERFILES_READ_PRIMARY` | Planos = cache; escritor mantiene sync |
| `PERFILES_WRITE_PRIMARY` | Escritor deja de actualizar `perfilesDetalle` payloads |
| `LEGACY_DEPRECATED` | Planos eliminados o read-only; semver MAJOR hub |

**Criterio de retiro:** ningún consumidor en matriz §7 lee planos como SSOT + inventario prod confirma `perfil.migradoBlk01=true` en 100% cuentas con perfil + QA dual-read verde.

**Root shim** (`nombre`, `geo`, etc. en raíz para lectores legacy monolito): se depreca en la misma ventana que `perfilesDetalle`, no antes de `PERFILES_READ_PRIMARY`.

---

## 2. Contrato canónico del perfil público

### 2.1 SSOT

**`perfiles/{perfilId}`** es la fuente de verdad pública/operacional del perfil.

- Document key = `perfilId` (opaque string o `uid` en bridge legacy).
- **Slug no es document key.** Campo decorativo para URLs amigables; unicidad best-effort, no garantizada globalmente en MVP.

### 2.2 Owner linkage

| Campo | Obligatorio | Regla |
|-------|-------------|-------|
| `perfilId` | sí | = document id |
| `usuarioId` | sí | = Auth uid del dueño; FK inmutable |
| `ownerUid` | sí | = `usuarioId` (alias explícito para rules BLK-05 / VE) |

Validación: todo `perfiles/{id}` debe tener `usuarioId` presente en `usuarios/{usuarioId}.perfil.perfilIds[]` (reconciliación).

### 2.3 Campos obligatorios (congelados BLK-01)

| Campo | Notas |
|-------|-------|
| `perfilId` | id documento |
| `usuarioId` | FK hub |
| `ownerUid` | = usuarioId |
| `formularioId` | catálogo congelado |
| `sectorId` | categoría |
| `subcategoriaId` | subcategoría |
| `arquetipo` | registro |
| `tipoPerfil` | registro |
| `estadoPublicacion` | ver §2.5 |
| `tienePerfilPublico` | boolean derivado visibilidad |
| `schemaVersion` | ej. `blk01-perfil@1.0.0` |
| `createdAt` | timestamp |
| `updatedAt` | timestamp |

### 2.4 Campos opcionales (públicos/operacionales)

`alias`, `nombre`, `slug`, `geo`, `descripcion`, `fotos`, `estadoPago`, `fechaVencimiento`, `fechaPublicacion`, `componenteResultados`, `componentePerfil`, `migracion` (bloque trazabilidad ETL).

Geo contract (congelado):

```json
{
  "geo": {
    "pais": "string",
    "estado": "string",
    "ciudad": "string",
    "zona": "string|null"
  }
}
```

Category contract: `sectorId` + `subcategoriaId` + `formularioId` + `arquetipo` + `tipoPerfil` deben ser consistentes con catálogo congelado (`ACTA-CONGELAMIENTO-CATALOGO`). Sin validación cruzada en BLK-01 ETL salvo presencia.

### 2.5 Estado de publicación

**Campo canónico en `perfiles/`:** `estadoPublicacion`.

Mapeo desde legacy monolito (congelado, alineado a `blk01-migracion-emulador.mjs`):

| Condición legacy (`usuarios/{uid}`) | `estadoPublicacion` |
|-------------------------------------|---------------------|
| `vencido === true` | `vencido` |
| `aprobado && activo` | `publicado` (+ `visible/publicado/tienePerfilPublico=true`) |
| `estadoRevision === 'actualizacion_pendiente'` | `pendiente` |
| `estadoRevision === 'registro_pendiente'` | `borrador` |
| otro / ausente | `borrador` |

**BLK-05-R0 freeze:** canonical write enum = `borrador|pendiente|publicado|suspendido|vencido|eliminado`. Read alias `activo` → `publicado` (deprecated). See `scripts/BLK-05-R0-PERFILES-RULES-CONTRACT-FREEZE.md`.

`tienePerfilPublico = true` iff equivalente legacy `aprobado && activo && !vencido && fechaVencimiento vigente`.

Equivalencia rules `isPublicProfile()` legacy → objetivo (BLK-05-R0):

```
legacy:  aprobado && activo && !vencido && fechaVencimiento vigente
objetivo: tienePerfilPublico && visible && publicado && estadoPublicacion in ['publicado','activo']
          && !suspendido && !eliminado && !vencido && forbiddenFieldsAbsent
```

### 2.6 Denylist — campos que NUNCA se copian a `perfiles/`

Congelado (extensión de `CAMPOS_SENSIBLES` en emulador):

```
verificacion, ineFrente, ineReverso, selfieVerificacion,
nombreReal, fechaNacimiento, domicilio, correoPrivado,
telefonoPrivado, kyc, notasAdmin, email,
datosFiscales, rfc, curp, clabe, cuentaBancaria,
comprobanteDomicilio, comprobanteFiscal, credencialProfesional,
password, token, refreshToken, apiKey,
perfilesDetalle (mapa completo), perfilesVinculados (array hub)
```

KYC y verificación permanecen **solo** en `usuarios/{uid}.verificacion` (hub).

Escaneo obligatorio pre-commit migración: cualquier clave denylist en documento `perfiles/` → **ABORT** (`sensible_en_perfil_publico`).

---

## 3. Estrategia de IDs

| Regla | ID | Congelado |
|-------|-----|-----------|
| **BRIDGE-MIG-01** | Monolito legacy → `perfilId = uid` | sí |
| Multi-perfil existente | `perfil_<ts36>_<random>` opacos | **no reasignar** |
| Perfiles nuevos post-TICKET-003 | mismo generador opaco | continúa |
| Slug | decorativo; colisión → sufijo `-2`, `-3` o fallback a `perfilId` | no es key |
| Favoritos path | `usuarios/{uid}/favoritos/{perfilId}` | sin cambio de path |

**Colisión `perfiles/{perfilId}` ya existente:** omitir escritura, reportar en `colisiones`, no sobrescribir (política emulador). Resolución manual o flag `--force-overwrite` solo con autorización explícita Phase 2+.

**Legacy ID variants:** runtime acepta `perfil_<uid>` o `uid` como equivalentes bridge; migración normaliza a `perfilId = uid` para monolito puro.

---

## 4. Fuente de verdad en transición y atomicidad

### 4.1 Principio

Los writes secuenciales desde cliente **no son atómicos**. Un fallo intermedio produce hub sin perfil o perfil huérfano.

### 4.2 Autoridad por fase

| Fase | Lectura SSOT | Escritura SSOT | Secundario |
|------|--------------|----------------|------------|
| `LEGACY_ONLY` | `usuarios` planos | `usuarios` planos | — |
| `DUAL_WRITE_SHADOW` | `usuarios` | `usuarios` + shadow `perfil.*` / `perfiles/` | shadow no authoritative |
| `DUAL_READ_FALLBACK` | `perfiles` → fallback `usuarios` | `usuarios` (+ dual-write perfil) | `perfiles` catch-up |
| `PERFILES_READ_PRIMARY` | `perfiles` | dual-write ambos | planos = cache |
| `PERFILES_WRITE_PRIMARY` | `perfiles` | `perfiles` + hub punteros | sync planos mínimo |
| `LEGACY_DEPRECATED` | `perfiles` | `perfiles` + hub | planos frozen |

### 4.3 Orden dual-write (cuando aplique)

1. **Crear/actualizar** `perfiles/{perfilId}` (payload completo).
2. **Actualizar** `usuarios/{uid}.perfil.*` punteros (`perfilIds`, `perfilPrincipalId`, `migradoBlk01`).
3. **Sync espejos** planos (`perfilActivoId`, `perfilesVinculados`, `perfilesDetalle[perfilId]` slim) si fase lo requiere.

Si paso 1 falla → abort; no tocar hub punteros.  
Si paso 1 OK y paso 2 falla → **estado inconsistente**; reconciliación obligatoria.

### 4.4 Evaluación mecanismos de write

| Mecanismo | Uso | Veredicto |
|-----------|-----|-----------|
| **Firestore batch** | ETL migración offline (≤500 ops); perfil + hub mismo uid | **Recomendado migración batch** — evidencia: `blk01-migracion-emulador.mjs` ya usa batches |
| **Firestore transaction** | Dual-write runtime 2 doc mismo uid | Viable solo si ≤ doc size; riesgo con `perfilesDetalle` grande |
| **Cloud Function** | Dual-write registro/dashboard; validación denylist server-side | **Recomendado runtime dual-write** — menor superficie cliente, idempotencia, denylist enforced |
| **Job reconciliación** | Parcial failures, huérfanos, drift hub↔perfiles | **Obligatorio** complemento; no sustituto del write atómico |

**Recomendación congelada (menor opción segura):**

- **Migración ETL:** batch Firestore por cuenta (`set perfiles/{id}` + `update usuarios/perfil.*`) — extender script emulador, no cliente.
- **Runtime post-Phase 1:** Cloud Function `blk01SyncPerfilWrite` (nombre reservado) con batch interno; cliente invoca CF, no writes secuenciales directos a ambas colecciones.
- **Reconciliación:** script/job `blk01-reconcile.mjs` (Phase 1+) idempotente, emulador primero.

### 4.5 Idempotencia

- Migración: re-run con mismo `perfilId` → skip si `perfiles/{id}` existe y `migracion.version` ≥ actual; hub patch con `merge`.
- Runtime: CF keyed por `perfilId` + `updatedAt` / hash payload; rechazar downgrade stale.

### 4.6 Prevención huérfanos

| Riesgo | Mitigación |
|--------|------------|
| `perfiles/{id}` sin `usuarioId` en hub | Pre-write: assert hub existe; post-write: reconciliación |
| hub `perfilIds` sin doc perfil | Reconciliación quita stale o recrea desde `perfilesDetalle` |
| perfil sin owner | Rules BLK-05 draft: deny create sin `ownerUid`; CF valida |

---

## 5. Máquina de estados

Flag maestro: `blk01MigrationPhase` (ver §8). Valores = estados.

### 5.1 LEGACY_ONLY

| Atributo | Valor |
|----------|-------|
| **Flags** | todos OFF excepto implícito legacy |
| **Autoridad** | `usuarios` planos |
| **Readers** | todo runtime actual |
| **Writers** | registro, admin, rules monolito |
| **Entrada** | estado inicial prod |
| **Salida** | PO autoriza Phase 1 emulador + shadow OFF→ON en beta |
| **Rollback** | N/A (baseline) |

### 5.2 DUAL_WRITE_SHADOW

| Atributo | Valor |
|----------|-------|
| **Flags** | `blk01DualWriteShadow=true` |
| **Autoridad lectura** | `usuarios` |
| **Autoridad escritura** | `usuarios`; shadow async/batch a `perfil.*` + `perfiles/` |
| **Readers** | sin cambio |
| **Writers** | ETL emulador; opcional CF shadow prod (default OFF prod) |
| **Entrada** | ETL emulador verde + inventario |
| **Salida** | shadow coverage ≥ umbral PO (ej. 99% cuentas con perfil) |
| **Rollback** | flag OFF; ignorar `perfil.*`/`perfiles/` en lectura |

### 5.3 DUAL_READ_FALLBACK

| Atributo | Valor |
|----------|-------|
| **Flags** | `blk01DualWriteShadow=true`, `blk01DualReadFallback=true` |
| **Autoridad lectura** | `perfiles` primero → fallback `usuarios`/`perfilesDetalle` |
| **Autoridad escritura** | `usuarios` + dual-write |
| **Readers** | perfil público, resultados, favoritos (opt-in por flag) |
| **Writers** | sin cambio + sync |
| **Entrada** | `perfiles/` poblado emulador representativo |
| **Salida** | QA dual-read PASS todos módulos §7 |
| **Rollback** | `blk01DualReadFallback=false` |

### 5.4 PERFILES_READ_PRIMARY

| Atributo | Valor |
|----------|-------|
| **Flags** | + `blk01PerfilesReadPrimary=true` |
| **Autoridad lectura** | `perfiles` (fallback solo telemetría) |
| **Autoridad escritura** | dual-write |
| **Readers** | todos módulos públicos |
| **Writers** | registro vía CF dual-write |
| **Entrada** | dual-read estable 7d beta |
| **Salida** | PO cutover escritura |
| **Rollback** | read flag OFF → dual-read |

### 5.5 PERFILES_WRITE_PRIMARY

| Atributo | Valor |
|----------|-------|
| **Flags** | + `blk01PerfilesWritePrimary=true` |
| **Autoridad lectura** | `perfiles` |
| **Autoridad escritura** | `perfiles` + hub punteros; planos slim cache |
| **Readers** | `perfiles` |
| **Writers** | CF; rules BLK-05 parcial |
| **Entrada** | rules emulador PASS + backup prod |
| **Salida** | zero fallback hits 30d |
| **Rollback** | write flag OFF; reactivar dual-write usuarios |

### 5.6 LEGACY_DEPRECATED

| Atributo | Valor |
|----------|-------|
| **Flags** | `blk01LegacyDeprecated=true`; dual flags OFF |
| **Autoridad** | `perfiles` + hub |
| **Readers/Writers** | solo `perfiles`/hub |
| **Entrada** | migración 100% + rules prod perfiles |
| **Salida** | semver MAJOR; eliminación campos planos |
| **Rollback** | **costoso** — restaurar backup; no hot rollback |

---

## 6. Contrato de migración

### 6.1 Alcance ETL

1. **Monolito legacy:** usuario con datos perfil en raíz, sin `perfilesDetalle` → `perfiles/{uid}` + hub bridge.
2. **Multi-perfil `perfilesDetalle`:** **una extracción por entrada** → `perfiles/{perfilId}` cada key; hub `perfilIds[]` = union; `perfilPrincipalId` = `perfilActivoId` o legacy uid.
3. **Sin perfil público:** hub `perfil.perfilPrincipalId=null`, `perfilIds=[]`, `migradoBlk01=true`, `estadoBridge=sin_perfil`.

### 6.2 Gap script actual (bloqueador Phase 1)

`blk01-migracion-emulador.mjs` **solo procesa raíz monolito**. Extracción multi-perfil **no implementada** — requisito Phase 1 antes de prod.

### 6.3 Idempotencia / re-run

- Documento destino existe → skip (colisión).
- Hub ya tiene `perfil.migradoBlk01=true` → patch idempotente (arrayUnion perfilIds).
- Reporte JSON obligatorio cada run.

### 6.4 Conflictos

| Tipo | Resolución |
|------|------------|
| Colisión doc id | skip + manual |
| Divergencia campo obligatorio | reportar; no commit prod |
| perfilId en detalle ≠ key | key map gana; reportar |
| Dos entradas mismo perfilId | merge con timestamp más reciente; reportar |

### 6.5 Backup / export

Pre-migración prod: export Firestore `usuarios` (+ subcolecciones favoritos) restaurable verificado. Retención mínima 90 días. **Sin backup verificado → abort.**

### 6.6 Criterios de abort

- Host no emulador (prod guard)
- `sensible_en_perfil_publico` en dry-run
- Colisiones no resueltas > umbral PO
- Dataset no-demo en emulador sin autorización
- KYC leakage scan FAIL

### 6.7 KYC leakage scan

Post-build perfil: assert ninguna clave denylist §2.6; assert `email` ausente; scan recursivo objetos `verificacion`, `kyc`. Script: extensión de `divergenciasPerfil()` existente.

### 6.8 Reconciliation report

Artefacto: `_blk01-migracion-emulador-report.json` + `blk01-inventario.mjs` post-run.

Campos mínimos: `usuariosProcesados`, `perfilesCreados`, `perfilesOmitidos`, `colisiones`, `kycDetectado`, `favoritosHuerfanos`, `divergencias`, `veredicto`.

---

## 7. Matriz de compatibilidad cross-módulo

| Módulo | ID actual | ID target | Fallback transición | Riesgo | Owner step |
|--------|-----------|-----------|---------------------|--------|------------|
| **Registration** | escribe `usuarios/{uid}` planos | `perfiles/{perfilId}` + hub `perfil.*` | dual-write CF | **Alto** — source split | Phase 1: CF + flags; mantener planos hasta `PERFILES_WRITE_PRIMARY` |
| **Public Profile** | `usuarios.doc(id)` | `perfiles.doc(perfilId)` | dual-read | **Alto** — URLs `?id=uid` bridge | Phase 1: `perfil-publico-init.js` dual-read |
| **Results** | query `usuarios` aprobado/activo | query `perfiles` `tienePerfilPublico` | merge in-memory hub detalle | **Crítico** — multi-perfil invisible hoy | Phase 1: nueva query + expand `perfilIds`; flag `blk01ResultsPerfilesQuery` |
| **Favorites** | `favoritos/{perfilId}` → lookup `usuarios.doc(perfilId)` | lookup `perfiles.doc(perfilId)` | dual-read | **Medio** — bridge uid OK | Phase 1: dual-read lookup |
| **Dashboard** | hub planos + `perfilActivoId` | hub `perfil.*` + `perfiles/` | lee planos si no migrado | **Medio** | Phase 2: rail sync `perfil.perfilPrincipalId` |
| **Admin** | `usuarios` monolito | join hub + `perfiles` | vista dual | **Medio** | Phase 2 admin panel |
| **Payments** | `usuarioId` | sin cambio FK | N/A | **Bajo** BLK-01 | cache `estadoPago` en perfil |
| **Messaging** | diseño `perfilContextoId` | `perfiles/{perfilId}` | no prod aún | **Alto** futuro | Post BLK-01; no blocker migración datos |
| **SEO** | URL `perfil.html?id=uid` | canonical slug opcional | bridge mantiene id | **Medio** | 301 solo al salir bridge (TBD producto) |
| **Storage** | paths mezclados uid | `perfiles/{perfilId}/...` | alias lectura | **Alto** | Inventario VAC-03; fase separada |
| **Security** | rules monolito | rules perfiles draft | legacy until cutover | **Crítico** | BLK-05 after BLK-01 emulador green |

---

## 8. Feature flags (congelados)

Todos **default OFF** en prod. Config vía remote config / env / `window.__CARIHUB_FLAGS__` (implementación Phase 1).

| Flag | Default | Owner | Fase activación |
|------|---------|-------|-----------------|
| `blk01DualWriteShadow` | OFF | Platform | DUAL_WRITE_SHADOW |
| `blk01DualReadFallback` | OFF | Public surfaces | DUAL_READ_FALLBACK |
| `blk01PerfilesReadPrimary` | OFF | Public surfaces | PERFILES_READ_PRIMARY |
| `blk01PerfilesWritePrimary` | OFF | Registration/CF | PERFILES_WRITE_PRIMARY |
| `blk01LegacyDeprecated` | OFF | Platform | LEGACY_DEPRECATED |
| `blk01ResultsPerfilesQuery` | OFF | Search/Results | DUAL_READ_FALLBACK |
| `blk01MigrationPhase` | `LEGACY_ONLY` | Platform | enum string — master |
| `blk01ReconcileEnabled` | OFF | Ops | post ETL |

No reutilizar flags BLK-10/Turnstile. Naming prefix obligatorio: `blk01*`.

---

## 9. Rollback

### 9.1 Fase documentación (Phase 0)

- **Acción:** revertir commit doc o archivar versión.
- **Impacto:** cero runtime.
- **Riesgo:** ninguno.

### 9.2 Shadow writes

- **Acción:** `blk01DualWriteShadow=false`.
- **Datos:** `perfiles/` y `perfil.*` ignorados; legacy intacto.
- **Riesgo:** bajo; datos shadow orphaned aceptables.

### 9.3 Dual-read

- **Acción:** `blk01DualReadFallback=false` (+ read primary OFF).
- **Datos:** sin mutación.
- **Riesgo:** bajo.

### 9.4 Migration batch (emulador/prod)

- **Emulador:** reset dataset / re-seed.
- **Prod:** restore backup Firestore punto pre-migración; **no** delete selectivo sin runbook.
- **Riesgo:** medio-alto prod.

### 9.5 Rules activation (BLK-05)

- **Acción:** redeploy rules monolito previas (versionadas).
- **Precondición:** lectura aún dual o legacy.
- **Riesgo:** alto si perfiles-only readers activos.

### 9.6 Production cutover

- **Acción:** flags → LEGACY_ONLY equivalent; restore backup; redeploy rules+hosting previos.
- **Ventana:** maintenance acordada.
- **Riesgo:** alto SEO/downtime; ensayar en emulador.

---

## 10. Decision gate

### 10.1 Problema (evidencia)

- Monolito mezcla cuenta+KYC+perfil → bloquea Messenger, VE Storage, multi-perfil SSOT, rules `perfiles/`.
- Multi-perfil TICKET-003 ya escribe `perfilesDetalle` pero resultados/perfil público ignoran entradas secundarias.
- Colección `perfiles/` ausente prod → favoritos pueden referenciar ids sin documento destino.

### 10.2 Impacto beta / lanzamiento

- **Sin migración:** multi-perfil parcialmente roto en resultados/favoritos.
- **Con migración gradual:** bridge `perfilId=uid` preserva URLs beta existentes.
- **Cutover rules:** ventana coordinada; no big-bang sin dual-read.

### 10.3 Reuse

- Scripts emulador BLK-01 existentes (extender, no reescribir).
- `carihub-multi-perfil.js` helpers → sync planos.
- Borrador rules BLK-05 referencia este plan.

### 10.4 Costos

| Dimensión | Estimación |
|-----------|------------|
| Implementación Phase 1 | Medio — dual-read 4 surfaces + ETL multi-perfil + CF |
| Mantenimiento | Medio — dual period 1-3 meses |
| Ops | Backup + reconcile jobs |

### 10.5 Riesgos

| Área | Nivel | Nota |
|------|-------|------|
| Producción / datos | Alto | partial writes, colisiones |
| Seguridad / KYC | Crítico | denylist enforcement |
| SEO | Medio | bridge OK; slug later |
| Monetización | Medio | `estadoPago`/vencimiento sync |

### 10.6 Rollback

Viable hasta `PERFILES_WRITE_PRIMARY`; costoso en `LEGACY_DEPRECATED`.

### 10.7 Riesgo residual

- Storage paths no migrados en BLK-01.
- Messenger no implementado.
- Visitante-only / anunciante sin perfil (VAC-07).
- Dos sistemas notificaciones (VAC-08).

---

## 11. Contradicciones descubiertas (no resueltas silenciosamente)

| # | Tema | Fuente A | Fuente B | Resolución congelada Phase 0 |
|---|------|----------|----------|------------------------------|
| C1 | Campo estado perfil | ACTA + schema: `estadoRevision` obligatorio | Emulador + README: `estadoPublicacion` | **`estadoPublicacion` canónico en `perfiles/`**; escribir alias `estadoRevision` = mismo valor durante dual-write; deprecar alias en `LEGACY_DEPRECATED` |
| C2 | Obligatorios perfil | ACTA: incluye `componenteResultados`, `componentePerfil` | Emulador: no los escribe | **Opcionales Phase 1**; obligatorios cuando RenderEngine runtime active |
| C3 | Hub punteros | ACTA/schema: nested `perfil.*` | Runtime TICKET-003: planos `perfilActivoId` | **Nested canónico**; planos espejo hasta §1.3 |
| C4 | Alcance migración | TICKET-003 multi-perfil prod | Script emulador: solo raíz | **Phase 1 debe extender ETL**; estado actual = gap bloqueador |
| C5 | `ownerUid` | Emulador lo escribe | ACTA no lista explícito | **Obligatorio** (= usuarioId) para BLK-05 rules |
| C6 | `tienePerfilPublico` hub vs perfil | Schema: cache en hub.perfil | Emulador: solo en perfil doc | **Fuente en `perfiles/`**; hub.perfil.tienePerfilPublico = cache opcional Phase 2+ |
| C7 | Referencia plan | blk05 draft cita `PLAN-CONSTRUCCION-BLK-01` v1.0.0 | Archivo no existía | **Satisfecho** con este documento |
| C8 | Fase schema migracionDesdeLegacy | config: fase2 `perfiles/{uid}` | BRIDGE + multi-perfil opaque ids | fase2 aplica solo monolito; multi usa ids existentes en detalle |

---

## 12. Decisiones producto no resueltas (TBD — requieren PO)

| ID | Tema | Opciones |
|----|------|----------|
| PD-01 | Fecha salida bridge BRIDGE-MIG-01 | indefinido / trigger multi-perfil masivo |
| PD-02 | Política slug canonical URL + 301 | slug vs perfilId en URL pública |
| PD-03 | Umbral colisiones aceptables migración prod | 0 vs N manual |
| PD-04 | `--force-overwrite` en ETL | permitir o prohibir |
| PD-05 | Storage cutover | misma ventana BLK-01 vs fase BLK-01b |
| PD-06 | Visitante sin perfil en inventario | migrar hub-only sin `perfiles/` |
| PD-07 | Big-bang vs incremental prod | PO + ops |

---

## 13. Límite recomendado Phase 1 (no autorizado hasta explicit GO)

**In scope Phase 1 (cuando autorice PO):**

1. Extender `blk01-migracion-emulador.mjs` → extracción `perfilesDetalle` + tests emulador.
2. Implementar flags §8 (default OFF) sin activar en prod.
3. Dual-read en: `perfil-publico-init.js`, `carihub-favoritos.js`, `resultados-registrados.js` (behind flags).
4. CF scaffold `blk01SyncPerfilWrite` (emulador only).
5. Script `blk01-reconcile.mjs` dry-run.
6. QA pack emulador: seed extendido + postcommit validation.

**Out of scope Phase 1:**

- Deploy rules prod (BLK-05).
- Migración prod batch.
- Storage path migration.
- Deprecación campos planos.
- Messenger runtime.
- Custom claims prod.

---

## 14. Confirmación Phase 0

| Check | Estado |
|-------|--------|
| Documento creado | `scripts/PLAN-CONSTRUCCION-BLK-01-MIGRACION-PERFILID.md` |
| Runtime modificado | **NO** |
| Firestore Rules modificado | **NO** |
| Cloud Functions modificado | **NO** |
| Documentos `perfiles/` en prod | **NO** |
| Commits / PR / deploy | **NO** |
| BLK-04 / BLK-05 prod | **NO iniciado** |
| Phase 1 implementation | **NO autorizada** — esperar GO explícito |

---

## Changelog

| Versión | Fecha | Nota |
|---------|-------|------|
| 1.0.0 | 2026-07-10 | Phase 0 — contratos congelados, contradicciones documentadas |
