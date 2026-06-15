# Acta formal de congelamiento del catálogo CariHub

| Campo | Valor |
|-------|-------|
| **Estado** | CONGELADO |
| **Versión acta** | 1.0.0 |
| **Fecha de congelamiento** | 2026-06-09 |
| **Fecha baseline validación** | 2026-06-10T13:40:30.165Z |
| **Versión catálogo** | `catalogo-2026-06-10` (semver **1.0.0**) |
| **Autorización** | Aprobada por product owner — 2026-06-09 |

Artefacto canónico en máquina: [`ACTA-CONGELAMIENTO-CATALOGO.json`](./ACTA-CONGELAMIENTO-CATALOGO.json)

---

## 1. Objeto del congelamiento

Queda **formalmente congelado** el diseño del catálogo comercial y de registro de CariHub, incluyendo:

- 15 sectores y 462 subcategorías
- Mapa de registro (`mapa-registro-categorias.json`)
- Schemas de registro por formulario
- Meta schema, arquetipos canónicos y equivalencias
- Enriquecimiento de búsqueda (aliases, sinónimos, conflictos críticos)
- Schemas comerciales relacionados (precios, promociones, contratos, estados)

**No incluye** implementación runtime, Firestore, producción ni deploy.

### Dependencias congeladas previamente

| Capa | Estado |
|------|--------|
| **identidadUsuario** | Congelada previamente — ver `config-registro-schema.meta.json` → `identidadUsuario` y `config-cuentas-usuario-schema.json` |
| **RenderEngine** | **No autorizado** — permanece bloqueado |

---

## 2. Métricas finales del baseline

| Métrica | Valor |
|---------|-------|
| Sectores | **15** |
| Subcategorías | **462** |
| Filas mapa | **462** |
| Cobertura schemas | **462 / 462** |
| Duplicados cross-sector (`subcategoriaId`) | **0** |
| Validación | **PASS** |
| Errores | **0** |
| Advertencias | **0** |
| Arquetipos mapa ↔ schema | **Alineados** |
| tipoPerfil mapa ↔ schema | **Alineado** |
| Arquitectura comercial | **16 / 16** checks |
| identidadUsuario | **16 / 16** checks |

### Distribución por formulario

| formularioId | Subcategorías |
|--------------|---------------|
| adultos | 34 |
| persona_independiente | 297 |
| profesionista_cedula | 25 |
| negocio_empresa | 106 |

### Comando de verificación

```bash
node scripts/validar-schemas-registro.mjs
```

Reporte baseline: `scripts/validacion-schemas-report.json`

---

## 3. Archivos baseline

### Catálogo cliente

- `public/js/sectores-carihub.js`
- `public/js/catalogos-carihub.js`

### Mapa y pipeline

- `scripts/mapa-registro-categorias.json`
- `scripts/arquetipos-catalogo.mjs`
- `scripts/integrar-catalogo-expandido.mjs`
- `scripts/generar-schemas-registro.mjs`
- `scripts/clasificar-registro-categorias.mjs`
- `scripts/catalogo-expandido-datos.json`

### Meta y schemas de registro

- `scripts/config-registro-schema.meta.json`
- `scripts/config-registro-adultos-schema.json`
- `scripts/config-registro-independiente-schema.json`
- `scripts/config-registro-profesionista-schema.json`
- `scripts/config-registro-negocio-schema.json`
- `scripts/config-registro-visitante-schema.json`
- `scripts/config-registro-componentes-ui-schema.json`
- `scripts/config-registro-adultos-ejemplos-resueltos.json`

### Búsqueda

- `scripts/busqueda-enriquecimiento.json`

### Comercial (diseño)

- `scripts/config-precios-planes-perfiles-schema.json`
- `scripts/config-promociones-perfiles-schema.json`
- `scripts/config-promociones-banners-schema.json`
- `scripts/config-contratos-carihub-schema.json`
- `scripts/config-estados-revision-publicacion-schema.json`
- `scripts/config-categorias-sugeridas-schema.json`

### Renderizado (solo diseño)

- `scripts/config-renderizado-dinamico-schema.json`

### Validación y evidencia

- `scripts/validar-schemas-registro.mjs`
- `scripts/validacion-schemas-report.json`
- `scripts/validacion-schemas-report-antes.json`
- `scripts/reporte-catalogo-limpieza-antes-despues.json`
- `scripts/reporte-catalogo-expansion-final.json`
- `scripts/auditoria-catalogo-expansion.json`

---

## 4. Versión del catálogo

| Identificador | Valor |
|---------------|-------|
| ID catálogo | `catalogo-2026-06-10` |
| Semver | `1.0.0` |
| versionMeta | `2026-06-10` |
| versionSchema (registro) | `2026-06-10` |
| busqueda-enriquecimiento.version | `2026-06-10` |

---

## 5. Reglas para futuras modificaciones

1. **Autorización explícita** — Ningún cambio sin aprobación del product owner.
2. **Validación obligatoria** — Pipeline integrar → generar-schemas → validar; mínimo PASS o PASS CON ADVERTENCIAS aceptadas.
3. **Incremento de versión** — Todo cambio autorizado incrementa semver y actualiza `versionSchema` / `versionMeta`.
4. **Arquetipos canónicos** — No reintroducir nombres legacy (`adulto_persona`, `negocio_local`, etc.) sin actualizar `arquetiposEquivalencia` y sin autorización.
5. **Mapa como fuente de verdad** — `arquetipo` y `tipoPerfil` se definen en el mapa; generar-schemas los lee, no los recalcula.
6. **Sin producción silenciosa** — Cambios de diseño no implican deploy ni Firestore.
7. **identidadUsuario intacta** — Cambios de catálogo no reabren el diseño de cuentas.
8. **RenderEngine** — Consume catálogo; no lo redefine.
9. **Categorías sugeridas** — Incorporación al catálogo oficial requiere versión MINOR o MAJOR.
10. **Aliases de búsqueda** — PATCH si no cambian IDs ni arquetipos; requiere re-validación PASS.

---

## 6. Procedimiento de versionado y cambios posteriores

### Semver

| Tipo | Cuándo |
|------|--------|
| **MAJOR** | Eliminación/fusión de `subcategoriaId`, cambio de `formularioId`, cambio de `arquetipo` o `tipoPerfil`, renombre de `sectorId` |
| **MINOR** | Nuevas subcategorías/sectores, nuevos arquetipos de plantilla, expansión de búsqueda sin colisión |
| **PATCH** | Aliases, sinónimos, typos en nombre display, documentación |

### Pasos (cambio autorizado)

1. Registrar solicitud (motivo, tipo semver, archivos).
2. Obtener autorización explícita.
3. Aplicar cambios en archivos baseline.
4. Ejecutar pipeline de validación.
5. Incrementar versión y fechas en schemas.
6. Generar reporte; si MAJOR, acta de migración runtime futura.
7. Actualizar `historialVersiones` en el acta JSON.
8. Commit git (fase posterior, fuera de alcance actual).

### Historial

| Semver | Fecha | Evento |
|--------|-------|--------|
| 1.0.0 | 2026-06-09 | **CONGELAMIENTO_INICIAL** — PASS 0/0 |

---

## 7. Restricciones vigentes post-acta

- Sin runtime, Firestore, producción ni deploy
- FieldEngine, ValidationEngine, RenderEngine, Messenger y wizard HTML: **no iniciados**

---

*Documento generado como acta de diseño. No constituye implementación ni migración de datos.*
