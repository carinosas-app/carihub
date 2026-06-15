# Especificación técnica — FieldEngine

| Campo | Valor |
|-------|-------|
| **Versión spec** | 1.0.1 |
| **Fecha** | 2026-06-09 |
| **Actualización** | 2026-06-09 — AM1–AM3 cerrados |
| **Estado** | Diseño completo (AM1–AM3 aplicados) |
| **Implementación** | **NO autorizada** |

Contrato máquina: [`SPEC-FIELDENGINE.json`](./SPEC-FIELDENGINE.json)  
Fixtures: [`fixtures-fieldengine-golden.json`](./fixtures-fieldengine-golden.json)

---

## 1. Propósito

**FieldEngine** resuelve la definición de campos de registro para una `subcategoriaId` (o `formularioId` visitante), produciendo un **ResolvedRegistrationSchema** consumible por el wizard HTML y borradores en `perfiles/{perfilId}`.

| Hace | No hace |
|------|---------|
| Merge schema → campos, obligatorios, coherencia | Persistir Firestore |
| Exponer metadata `fieldRegistry` | Validar valores (ValidationEngine) |
| Evaluar **securityGates** de estado | Verify Turnstile (ValidationEngine) |
| Referenciar componentes UI | Renderizar (RenderEngine) |

### Dependencias congeladas

| Capa | Versión |
|------|---------|
| Catálogo | `catalogo-2026-06-10` @ 1.0.0 |
| Cuentas | `cuentas-2026-06-10` @ 1.0.0 |
| Seguridad MVP | `seguridad-2026-06-10` @ 1.0.0 |

---

## 2. Fuentes de lectura (solo lectura)

1. `mapa-registro-categorias.json` — `formularioId`, `arquetipo`, `tipoPerfil`, componentes
2. `config-registro-{formularioId}-schema.json` — base, plantillas, subcategorías, deltas
3. `config-registro-schema.meta.json` — convenciones, `canonicalId`, aliases
4. `config-registro-componentes-ui-schema.json` — registry componentes
5. `config-cuentas-usuario-schema.json` — contexto cuenta
6. `config-seguridad-mvp-schema.json` — securityGates
7. `config-categorias-sugeridas-schema.json` — formularios temporales (`temporal_categoria_sugerida`)
8. `config-renderizado-dinamico-schema.json` — componentes UI, `snapshotAlPublicar`
9. `config-contratos-carihub-schema.json` — gates comerciales, upgrade visitante + `contratar_plan`

---

## 3. API

### 3.1 `resolveRegistrationSchema(context)`

**Entrada `FieldEngineContext`:**

```typescript
{
  subcategoriaId?: string;      // condicional — ver flujoVisitante
  formularioId?: string;        // inferido del mapa si omitido; usuario_visitante en registro inicial
  flujoVisitante?: "registro_inicial" | "upgrade_perfil_publico";
  modo?: "default" | "alternativo" | "temporal_categoria_sugerida";
  schemaVersion?: string;       // default "2026-06-10"
  cuenta?: CuentaContext;
  seguridad?: SecurityContext;
}
```

**Regla `subcategoriaId` (AM2):**

| Flujo | `subcategoriaId` |
|-------|------------------|
| `usuario_visitante` + `registro_inicial` | **No enviar** — error `SUBCATEGORIA_NO_PERMITIDA_VISITANTE_INICIAL` si se incluye |
| `usuario_visitante` + `upgrade_perfil_publico` | **Obligatorio** — error `SUBCATEGORIA_REQUERIDA_UPGRADE_VISITANTE` si falta |
| Cualquier otro formulario | **Obligatorio** |

**Salida `ResolvedRegistrationSchema`:**

| Bloque | Contenido |
|--------|-----------|
| `identidad` | subcategoriaId, sectorId, formularioId, arquetipo, tipoPerfil |
| `campos[]` | id, label, tipo, obligatorio, privado, grupo, metadata registry |
| `camposPublicosResultados` | string[] |
| `camposPublicosPerfil` | string[] |
| `camposPrivados` | string[] |
| `obligatorios` | string[] (incluye anidados `geo.ciudad`) |
| `opcionales` | string[] |
| `validaciones` | reglas por campo |
| `coherencia` | global + extra |
| `fotos` | `{ min, max }` |
| `componentes` | `{ resultados, perfil }` |
| `textosAyuda` | Record<campo, string> |
| `verificacion` | tipo + campos INE/cédula |
| `securityGates` | resultado por acción |
| `meta` | schemaVersion, resolveHash, generadoAt |

### 3.2 Funciones auxiliares

| Función | Uso |
|---------|-----|
| `canonicalId(id)` | Normalizar `sex shop` → `sex_shop` |
| `resolveMapaRow(subcategoriaId)` | Fila mapa |
| `resolveFormularioId(subcategoriaId)` | Lookup formulario |
| `evaluateSecurityGates(context, accion)` | Gates sin Turnstile |

---

## 4. Algoritmo de resolución y merge

### Rama visitante

```
Si formularioId=usuario_visitante y flujoVisitante=registro_inicial:
  → meta.base de config-registro-visitante-schema.json
  → securityGates (sin enviar_revision)
  → fin

Si flujoVisitante=upgrade_perfil_publico:
  → subcategoriaId obligatorio → rama estándar merge
  → condición contrato vigente (config-contratos-carihub-schema.json)
```

### Rama temporal (categoría sugerida)

```
modo=temporal_categoria_sugerida
  → formularioTemporal de mapa o config-categorias-sugeridas-schema.json
  → camposMinimos del temporal + formularioIdBase como referencia plantillas
  → flags: TEMPORAL, usaCategoriaSugerida
```

### Rama estándar (merge)

```
canonicalId(subcategoriaId)
  → fila mapa (formularioId, arquetipo, tipoPerfil, componentes)
  → schema[formularioId]
  → subcategorias.find(canonicalId)
  → si modo=alternativo: arquetipo ← delta.modoRegistroAlternativo
  → plantilla ← plantillasArquetipo[arquetipo]
  → merged ← merge(meta.base, plantilla, sub.delta)
  → campos ← resolveFieldRegistry(merged lists)
  → coherencia ← global + delta.coherenciaExtra
  → securityGates ← evaluateSecurityGates(context)
  → ResolvedRegistrationSchema
```

### Reglas de merge

| Propiedad | Regla |
|-----------|-------|
| Arrays (campos, obligatorios) | Unión ordenada: base → plantilla → delta |
| `obligatoriosExtra` | Añade a obligatorios |
| `fotosMin` | `max(base, plantilla, delta)` |
| `fotosMax` | `min` si delta define |
| `labels`, `textosAyuda` | Override por clave |
| Campos anidados | `geo.pais` como obligatorio individual |

---

## 5. Security gates (Seguridad MVP 1.0.0)

FieldEngine **evalúa estados**; ValidationEngine aplica Turnstile y rate limits.

| Acción | Condiciones |
|--------|-------------|
| `abrir_wizard` | `estadoCuenta=activa`, `estadoSeguridad≠bloqueado` |
| `guardar_borrador` | `estadoCuenta=activa`, `estadoSeguridad ∈ {normal, observacion, **restringido**}` — alineado Seguridad MVP (`solo borrador`) |
| `enviar_revision` | `emailVerificado=true`, `estadoSeguridad ∈ {normal, observacion}`, `estadoCuenta=activa` — **denegado** en `restringido` |
| `contratar_plan` | `emailVerificado=true`, `estadoSeguridad=normal` |
| `solicitud_banner` | `emailVerificado=true`, `estadoSeguridad ∈ {normal, observacion}` |
| `categoria_sugerida` | `emailVerificado=true`, `estadoSeguridad ∉ {bloqueado, suspendido}` |

**Errores gate:** `GATE_SEGURIDAD_DENEGADO` con `motivo` (`EMAIL_NO_VERIFICADO`, `ESTADO_SEGURIDAD_RESTRINGIDO`, etc.).

---

## 6. Política schemaVersion

| Contexto | Versión usada |
|----------|---------------|
| Catálogo vigente | `2026-06-10` |
| Perfil publicado | Conserva `schemaVersion` al publicar |
| Borrador nuevo | Catálogo vigente |
| Borrador existente | Conserva versión del borrador |
| Migración | Fase posterior — fuera de FieldEngine MVP |

---

## 7. Casos especiales

### Visitante (`usuario_visitante`) — AM2

| Fase | Comportamiento |
|------|----------------|
| **Registro inicial** | Sin `subcategoriaId`. Solo `meta.base` visitante. `fotos: {min:0,max:0}`. `enviar_revision` no aplica. |
| **Upgrade perfil público** | `WizardCrearPerfilDesdeVisitante`: usuario elige categoría/subcategoría → `subcategoriaId` obligatorio → rama merge estándar. Requiere contrato vigente según `config-registro-visitante-schema.json`. |

### Modo alternativo (ej. masajes)

`modo=alternativo` → arquetipo efectivo `persona_acompanante` según `delta.modoRegistroAlternativo` en adultos.

### Categoría sugerida temporal — AM3

`modo=temporal_categoria_sugerida` → fuente `config-categorias-sugeridas-schema.json` (`formulariosTemporales`); `camposMinimos` del temporal; `formularioIdBase` como referencia de plantillas; flags `TEMPORAL`, `usaCategoriaSugerida`.

### Snapshot al publicar — AM3

Subconjunto de `ResolvedRegistrationSchema` persistido en `perfiles/{perfilId}` al publicar. Contrato con RenderEngine definido en `config-renderizado-dinamico-schema.json` → `snapshotAlPublicar`. FieldEngine expone mapeo en SPEC JSON; no persiste. Gate `contratar_plan` referencia `config-contratos-carihub-schema.json`.

### Canonical ID con espacios

`sex shop` → `sex_shop` — misma lógica que validador.

---

## 8. Códigos de error

| Código | Cuándo |
|--------|--------|
| `SUBCATEGORIA_NO_ENCONTRADA` | No en mapa ni schemas |
| `FORMULARIO_MAPA_MISMATCH` | context.formularioId ≠ mapa |
| `ARQUETIPO_PLANTILLA_FALTANTE` | plantilla no definida |
| `SCHEMA_VERSION_NO_SOPORTADA` | versión distinta sin soporte |
| `MODO_ALTERNATIVO_NO_DEFINIDO` | modo alternativo sin delta |
| `GATE_SEGURIDAD_DENEGADO` | securityGates falla |
| `SUBCATEGORIA_REQUERIDA_UPGRADE_VISITANTE` | upgrade sin `subcategoriaId` |
| `SUBCATEGORIA_NO_PERMITIDA_VISITANTE_INICIAL` | registro visitante con `subcategoriaId` |

---

## 9. Golden fixtures (11 casos)

Ver [`fixtures-fieldengine-golden.json`](./fixtures-fieldengine-golden.json):

| ID | Caso |
|----|------|
| F01 | escort / adultos — baseline |
| F02 | contadores / profesionista |
| F03 | contador-publico / industria |
| F04 | sex shop (espacio) / negocio_retail |
| F05 | masajes modo alternativo |
| F06 | restaurante / negocio_alimentos |
| F07 | agente inmobiliario independiente |
| F08 | visitante sin subcategoría |
| F09 | email no verificado → gate denegado |
| F10 | estado restringido → borrador permitido, enviar_revision denegado |
| F11 | visitante upgrade sin subcategoría → error |

---

## 10. Relación con otros motores

```
Catálogo 1.0.0 ──► FieldEngine ──► ResolvedRegistrationSchema
                        ▲
Cuentas 1.0.0 ──────────┤ CuentaContext
Seguridad 1.0.0 ────────┘ SecurityContext + gates
                        │
                        ▼
              ValidationEngine (valores + Turnstile + rate limits)
                        │
                        ▼
              Wizard HTML (futuro, no autorizado)
```

| Módulo | Relación |
|--------|----------|
| ValidationEngine | Recibe schema resuelto; valida valores y anti-abuso |
| RenderEngine | Usa snapshot publicado; no depende de FieldEngine en runtime lectura |
| Messenger | No aplica a registro; gates separados |
| Admin | No modifica resolución; revisa perfiles resueltos |
| IA Arquitecto | Dry-run resolve para impacto cambios catálogo |

---

## 11. Criterios de aceptación (spec)

- [x] API y tipos definidos
- [x] Algoritmo merge documentado
- [x] 11 golden fixtures
- [x] securityGates alineados Seguridad MVP
- [x] Política schemaVersion
- [x] Sin dependencia RenderEngine
- [ ] Aprobación product owner spec
- [ ] Autorización implementación local (separada)

---

## 12. Fuera de alcance

Runtime, Firestore, deploy, wizard HTML, ValidationEngine implementación, RenderEngine, migración legacy.

---

*Especificación de diseño v1.0.1 — AM1–AM3 cerrados; no autoriza implementación runtime.*
