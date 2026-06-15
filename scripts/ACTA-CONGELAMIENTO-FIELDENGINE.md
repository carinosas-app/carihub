# Acta formal de congelamiento — FieldEngine

| Campo | Valor |
|-------|-------|
| **Estado** | **CONGELADO** |
| **Versión** | `fieldengine-2026-06-10` · semver **1.0.1** |
| **Fecha** | 2026-06-09 |
| **Implementación runtime** | **NO autorizada** |

Canónico: [`ACTA-CONGELAMIENTO-FIELDENGINE.json`](./ACTA-CONGELAMIENTO-FIELDENGINE.json)  
Auditoría: [`AUDITORIA-SPEC-FIELDENGINE.md`](./AUDITORIA-SPEC-FIELDENGINE.md)  
Reporte cierre AM: [`REPORTE-SPEC-FIELDENGINE-v1.0.1.md`](./REPORTE-SPEC-FIELDENGINE-v1.0.1.md)

---

## Baseline aprobado

- [`SPEC-FIELDENGINE.md`](./SPEC-FIELDENGINE.md)
- [`SPEC-FIELDENGINE.json`](./SPEC-FIELDENGINE.json)
- [`fixtures-fieldengine-golden.json`](./fixtures-fieldengine-golden.json)

## Cuatro capas congeladas

| Capa | Versión |
|------|---------|
| Catálogo | 1.0.0 |
| Cuentas | 1.0.0 |
| Seguridad MVP | 1.0.0 |
| **FieldEngine** | **1.0.1** |

---

## Ajustes obligatorios — cerrados (v1.0.1)

| ID | Ajuste | Estado |
|----|--------|--------|
| AM1 | `guardar_borrador` en `estadoSeguridad=restringido` | ✅ Cerrado |
| AM2 | `subcategoriaId` opcional visitante inicial; obligatorio en upgrade | ✅ Cerrado |
| AM3 | Fuentes: categorías sugeridas, renderizado, contratos, snapshot | ✅ Cerrado |

---

## Restricciones vigentes

Sin runtime · Sin Firestore · Sin producción · Sin deploy · Sin commit

---

## Historial

| Semver | Evento |
|--------|--------|
| 1.0.0 | CONGELAMIENTO_INICIAL — spec + auditoría |
| 1.0.1 | PATCH_AM1_AM3 — cierre ajustes obligatorios pre-implementación |
