# Reporte cierre AM1–AM3 — FieldEngine v1.0.1

| Campo | Valor |
|-------|-------|
| **Fecha** | 2026-06-09 |
| **Versión** | 1.0.0 → **1.0.1** |
| **Validación** | **PASS** (19/19) |
| **Runtime / Firestore / deploy / commit** | No aplicado |

Canónico: [`REPORTE-SPEC-FIELDENGINE-v1.0.1.json`](./REPORTE-SPEC-FIELDENGINE-v1.0.1.json)  
Validador: [`validar-spec-fieldengine.mjs`](./validar-spec-fieldengine.mjs)

---

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `SPEC-FIELDENGINE.json` | v1.0.1, AM1 gates, AM2 contexto visitante, AM3 fuentes/snapshot/temporal |
| `SPEC-FIELDENGINE.md` | Documentación alineada con JSON |
| `fixtures-fieldengine-golden.json` | F08, F10 actualizados; F11 nuevo |
| `ACTA-CONGELAMIENTO-FIELDENGINE.json` | v1.0.1, AM1–AM3 cerrados |
| `ACTA-CONGELAMIENTO-FIELDENGINE.md` | Tabla versión y AM cerrados |
| `AUDITORIA-SPEC-FIELDENGINE.json` | `resolucionV101`, estados AM cerrados |

## Archivos creados

| Archivo | Propósito |
|---------|-----------|
| `validar-spec-fieldengine.mjs` | Auditoría consistencia diseño |
| `validacion-spec-fieldengine-report.json` | Salida PASS 19/19 |
| `REPORTE-SPEC-FIELDENGINE-v1.0.1.json` / `.md` | Este reporte |

---

## Cambios aplicados

### AM1 — `guardar_borrador` en restringido

- Gate: `estadoSeguridad in normal,observacion,restringido`
- `enviar_revision` sigue excluyendo `restringido`
- Alineado con Seguridad MVP (`solo borrador; no enviar revisión`) y fixture **F10**

### AM2 — `subcategoriaId` condicional visitante

| Flujo | `subcategoriaId` |
|-------|------------------|
| Registro inicial (`flujoVisitante=registro_inicial`) | No enviar |
| Upgrade perfil público (`upgrade_perfil_publico`) | Obligatorio |

- **F08**: visitante sin subcategoría
- **F11**: upgrade sin subcategoría → `SUBCATEGORIA_REQUERIDA_UPGRADE_VISITANTE`

### AM3 — Fuentes y snapshot

Fuentes añadidas a `fuentesLectura`:

1. `config-categorias-sugeridas-schema.json`
2. `config-renderizado-dinamico-schema.json`
3. `config-contratos-carihub-schema.json`

Secciones nuevas: `algoritmoResolucion` (rama temporal), `snapshotAlPublicar` con mapeo a RenderEngine.

---

## Fixtures actualizados

| ID | Estado |
|----|--------|
| F01–F07, F09 | Sin cambio |
| F08 | `flujoVisitante: registro_inicial` |
| F10 | Nota AM1; `motivoEnviarRevision` |
| F11 | **Nuevo** — error upgrade sin subcategoría |

**Total: 11 fixtures** (v1.0.1)

---

## Estado final SPEC v1.0.1

- **Estado:** `DISENO_COMPLETO_AM1_AM3`
- **Implementación:** NO autorizada
- **Dependencias congeladas:** Catálogo, Cuentas, Seguridad MVP @ 1.0.0
- **API:** `resolveRegistrationSchema(context) → ResolvedRegistrationSchema`

---

## Riesgos y advertencias

| ID | Nivel | Descripción |
|----|-------|-------------|
| W1 | Bajo | AM4–AM8 recomendados pendientes |
| W2 | Medio | Fixtures resumidos; faltan JSON completos F01/F08 para codificar |
| W3 | Medio | Gap legacy `usuarios/{uid}` vs `perfiles/{perfilId}` sin resolver |
| W4 | Bajo | `SPEC-FIELDENGINE-ALCANCE.md` aún en v1.0.0 |
| W5 | Bajo | Sin fixture `temporal_categoria_sugerida` (AM4 recomendado) |

---

## ¿Puede congelarse v1.0.1?

**Sí.** AM1–AM3 cerrados, validación PASS, artefactos alineados.

## ¿Actualizar acta de congelamiento?

**Sí — ya aplicado.** `ACTA-CONGELAMIENTO-FIELDENGINE` actualizada a **v1.0.1** con evento `PATCH_AM1_AM3`.

---

## No autorizado (confirmado)

Runtime · ValidationEngine · RenderEngine · Firestore · Producción · Deploy · Commit · Auditoría dashboards
