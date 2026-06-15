# Propuesta de alcance — Especificación técnica FieldEngine

**Estado:** Propuesta de diseño — **no implementar** hasta aprobación explícita de este documento.

**Prerrequisitos cumplidos:** Catálogo `1.0.0` congelado · Cuentas `1.0.0` congeladas · RenderEngine sin autorización.

---

## 1. Propósito del documento

Definir el contrato de diseño de **FieldEngine**: motor que, dado un contexto de registro (`subcategoriaId`, `formularioId`, opcionalmente `modo`), produce la **definición resuelta de campos** para wizard de registro y borradores en `perfiles/{perfilId}` — sin tocar Firestore ni producción.

FieldEngine es el **primer motor** del roadmap post-congelamiento porque conecta catálogo congelado con formularios dinámicos y respeta la separación hub/perfiles.

---

## 2. Objetivos (in scope)

| # | Objetivo |
|---|----------|
| O1 | Resolver campos públicos/privados/obligatorios/opcionales para una `subcategoriaId` |
| O2 | Aplicar merge: `meta.base` → `plantillasArquetipo[arquetipo]` → `subcategorias[].delta` |
| O3 | Exponer metadata de cada campo desde `fieldRegistry` |
| O4 | Devolver reglas de coherencia, validaciones, fotosMin/Max, componentes UI |
| O5 | Respetar `schemaVersion` del catálogo vs snapshot en perfil publicado |
| O6 | Distinguir contexto **perfil** (datos registro) vs **cuenta** (solo gates: estadoCuenta, estadoVerificacion) |
| O7 | Soportar `modoRegistroAlternativo` documentado (ej. masajes → persona_acompanante) como variante explícita |

---

## 3. Fuera de alcance (explicit exclusions)

- Persistencia Firestore / lectura-escritura runtime
- ValidationEngine (validación de valores enviados — documento separado)
- RenderEngine (render público resultados/perfil)
- UI HTML del wizard
- Messenger, favoritos runtime, admin UI
- Migración legacy `usuarios/{uid}` → `perfiles/{id}`
- Modificación del catálogo o diseño de cuentas congelados

---

## 4. Entradas congeladas (solo lectura)

| Fuente | Uso |
|--------|-----|
| `mapa-registro-categorias.json` | `arquetipo`, `tipoPerfil`, `formularioId`, `componenteResultados/Perfil` por fila |
| `config-registro-{formularioId}-schema.json` | Plantillas, subcategorías, deltas, fieldRegistry |
| `config-registro-schema.meta.json` | Convenciones, campos sistema, aliases subcategoriaId |
| `config-registro-componentes-ui-schema.json` | Registry de componentes (referencia, no render) |
| `config-cuentas-usuario-schema.json` | Gates de cuenta (estados permitidos para registrar/enviar) |

---

## 5. API propuesta (diseño)

### 5.1 Resolución principal

```
resolveRegistrationSchema(context) → ResolvedRegistrationSchema
```

**Context:**

| Campo | Tipo | Obligatorio | Notas |
|-------|------|-------------|-------|
| `subcategoriaId` | string | sí | Canonicalizado con `canonicalId()` |
| `formularioId` | string | no* | Si omitido, inferir del mapa |
| `modo` | enum | no | `default` \| `alternativo` \| `temporal_categoria_sugerida` |
| `schemaVersion` | string | no | Default: versión catálogo congelada |
| `cuenta` | object | no | `{ estadoCuenta, estadoVerificacion, tipoCuentaPrincipal }` para gates |

\*Si `formularioId` contradice el mapa → error de diseño documentado.

### 5.2 Salida `ResolvedRegistrationSchema`

| Bloque | Contenido |
|--------|-----------|
| `identidad` | subcategoriaId, sectorId, formularioId, arquetipo, tipoPerfil, schemaVersion |
| `campos` | Lista resuelta con id, label, tipo, obligatorio, visible, grupo, metadata |
| `camposPublicosResultados` | string[] |
| `camposPublicosPerfil` | string[] |
| `camposPrivados` | string[] |
| `obligatorios` | string[] |
| `opcionales` | string[] |
| `validaciones` | reglas por campo |
| `coherencia` | reglas globales + `coherenciaExtra` del delta |
| `fotos` | `{ min, max }` |
| `componentes` | `{ resultados, perfil }` |
| `textosAyuda` | map campo → string |
| `gatesCuenta` | estados requeridos para habilitar envío (diseño) |

### 5.3 Funciones auxiliares (diseño)

| Función | Propósito |
|---------|-----------|
| `resolveFormularioId(subcategoriaId)` | Lookup en mapa |
| `resolveArquetipo(subcategoriaId)` | Desde mapa (no recalcular) |
| `mergePlantillaDelta(plantilla, delta)` | Algoritmo merge arrays/override |
| `resolveFieldDescriptor(fieldId, registry)` | Metadata UI/tipo |
| `canonicalId(id)` | Misma lógica que validador |

---

## 6. Algoritmo de merge (sección obligatoria del spec)

Documentar paso a paso (ya esbozado en `config-registro-adultos-schema.json` → `resolucionFieldEngine`):

1. Cargar schema por `formularioId`.
2. Localizar entrada en `subcategorias[]` por `canonicalId(subcategoriaId)`.
3. Cargar `plantillasArquetipo[arquetipo]`.
4. Aplicar `delta` (merge de arrays, override numéricos fotosMin/Max).
5. Resolver cada campo contra `fieldRegistry`.
6. Aplicar `coherencia` global + `coherenciaExtra`.
7. Aplicar gates de cuenta si `context.cuenta` presente.
8. Emitir `ResolvedRegistrationSchema` + hash de versión para trazabilidad.

---

## 7. Casos límite a documentar (golden fixtures)

Mínimo **8 casos** con entrada/salida esperada en JSON:

| # | subcategoriaId | formularioId | Nota |
|---|----------------|--------------|------|
| 1 | escort | adultos | persona_acompanante baseline |
| 2 | contadores | profesionista_cedula | profesional_tecnico_legal |
| 3 | contador-publico | profesionista_cedula | conflicto resuelto, industria |
| 4 | sex_shop | adultos | negocio_retail; id con espacio |
| 5 | masajes | adultos | modo alternativo persona_acompanante |
| 6 | restaurante | negocio_empresa | negocio_alimentos |
| 7 | agente-inmobiliario-independiente | persona_independiente | override mapa |
| 8 | visitante (sin sub) | usuario_visitante | solo gates cuenta, sin delta catálogo |

Archivo propuesto: `scripts/fixtures-fieldengine-golden.json` (crear en fase spec, no runtime).

---

## 8. Relación con cuentas congeladas

| Responsabilidad | Motor |
|-----------------|-------|
| Qué campos tiene el formulario | FieldEngine |
| Si el usuario puede enviar a revisión | Gate `estadoCuenta` + ValidationEngine futuro |
| Dónde se guardan valores | `perfiles/{perfilId}` (diseño) — FieldEngine no persiste |
| usuarioId en formulario | **No** es campo de registro público; vive en perfil como FK |

---

## 9. Relación con catálogo congelado

- FieldEngine **consume** catálogo `1.0.0`; no lo modifica.
- `schemaVersion` en perfil publicado puede ser anterior; spec debe definir política:
  - **Recomendación:** perfil conserva `schemaVersion` al publicar; nuevos registros usan versión actual; migración de borradores = fase posterior.

---

## 10. Entregables de la especificación (cuando se redacte)

1. **SPEC-FIELDENGINE.md** — documento técnico completo
2. **SPEC-FIELDENGINE.json** — contrato máquina (tipos, errores)
3. **fixtures-fieldengine-golden.json** — 8+ casos
4. **Diagrama de flujo** resolveRegistrationSchema
5. **Tabla de errores** (SUBCATEGORIA_NO_ENCONTRADA, FORMULARIO_MAPA_MISMATCH, etc.)
6. **Checklist de aceptación** para autorizar implementación local

---

## 11. Criterios de aceptación del documento de spec

- [ ] API y tipos definidos sin ambigüedad
- [ ] Algoritmo merge reproducible desde schemas congelados
- [ ] 8 golden fixtures con salida esperada
- [ ] Gates cuenta documentados sin mezclar con campos perfil
- [ ] Política schemaVersion definida
- [ ] Sin referencias a RenderEngine como dependencia
- [ ] Revisión product owner antes de implementar

---

## 12. Orden roadmap post-spec

```
SPEC FieldEngine (aprobar) → implementación FieldEngine local (autorizar aparte)
  → SPEC ValidationEngine → implementación ValidationEngine
  → [RenderEngine cuando autorices]
  → Wizard HTML
```

---

*Propuesta de alcance. No autoriza implementación.*
