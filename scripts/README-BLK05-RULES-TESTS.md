# README — Suite de pruebas BLK-05 (reglas `perfiles/`)

> **BORRADOR — NO EJECUTAR EN ESTA FASE — SOLO EMULADOR EN EL FUTURO**
> No deploy, no producción, no Firebase, no Firestore, no `npm install` todavía.

## Propósito

Validar `allow`/`deny` del borrador de reglas Firestore para la futura colección `perfiles/{perfilId}` y sus subcolecciones, antes de cualquier despliegue. Es la red de seguridad de la fase 2 de `GAP-RULES-FIRESTORE-ALIGNMENT v1.0.0` / BLK-05.

## Archivos

- `blk05-rules-perfiles.test.mjs` — suite (`node:test` + `@firebase/rules-unit-testing`).
- `blk05-rules-perfiles-test-fixtures.json` — usuarios, perfiles, roles, claims, estados, transiciones, listas de campos, `casosAllow`/`casosDeny`, subcolecciones y notas de uso.
- `blk05-firestore-rules-perfiles-draft.rules` — reglas que se prueban (la suite **carga este borrador, nunca `firestore.rules` real**).

## Alcance

- Cubre la colección `perfiles/{perfilId}`, subcolecciones (`verificaciones`, `media`, `estadisticas`, `auditoria`) y, de forma vinculada, `pagos`, `contratos_perfiles`, `contratos_banners`.
- Solo lógica de reglas (allow/deny). No prueba UI, ni RenderEngine, ni rendimiento.

## Restricciones (esta fase)

- No ejecutar pruebas, no iniciar emulador, no instalar dependencias.
- No tocar Firebase/Firestore/producción, no deploy, no commit.
- No modificar `firestore.rules` real ni archivos existentes.
- Solo se han creado archivos nuevos listos para revisión.

## Dependencias npm requeridas (para el futuro)

```bash
npm i -D @firebase/rules-unit-testing firebase
```

Requiere Node con soporte de `node:test` (Node 18+).

## Cómo correr en emulador (en el futuro, tras autorización)

```bash
firebase emulators:start --only firestore
# en otra terminal:
$env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"   # PowerShell
node --test scripts/blk05-rules-perfiles.test.mjs
```

La suite **aborta** si `FIRESTORE_EMULATOR_HOST` no está definido (guarda anti-producción).

## Cómo NO correrlo

- No ejecutar sin emulador ni apuntando a un proyecto real.
- No copiar el `.rules` borrador a `firestore.rules` ni desplegar.
- No usar credenciales de producción ni `applicationDefault()` contra la nube.

## Advertencias de producción

El borrador de reglas asume el modelo **desacoplado** `usuarios` + `perfiles`. En producción el modelo sigue siendo el **monolito** `usuarios/{uid}`. Correr o desplegar esto antes de BLK-01 rompería el runtime.

## Relación con BLK-01

Las pruebas asumen `perfiles/{perfilId}` con `ownerUid`, y el **bridge** `usuarios/{uid}.perfil.perfilPrincipalId` / `perfilIds[]`. Esos datos no existen hasta ejecutar la migración BLK-01 (fases 1-3). Los fixtures siembran ese estado en el emulador con `withSecurityRulesDisabled`.

## Relación con BLK-05

Esta suite es el criterio de aceptación de seguridad para desplegar las reglas `perfiles/` (BLK-05). El deploy real solo procede si la suite pasa en emulador.

## Relación con custom claims

Los roles `admin`, `super_admin`, `moderador`, `soporte`, `auditor`, `agente_ia`, `sistema` se simulan como custom claims (`authenticatedContext(uid, { role })`). En runtime dependen de asignación server-side de claims (pendiente, BLK-05).

## Relación con Storage Rules

Los binarios (INE, selfie, fotos) se gobiernan con **Storage Rules**, fuera de esta suite. `media` aquí solo prueba metadatos.

## Qué pruebas cubre

1. Lectura pública (solo activo/visible/publicado).
2. Lectura owner (uid==ownerUid o bridge BLK-01).
3. Lectura por rol (admin/moderador/soporte/auditor/agente IA/sistema).
4. Creación de perfil (gates de estado y campos prohibidos).
5. Actualización owner (whitelist pública; bloqueo de protegidos).
6. Actualización admin/moderador (transiciones válidas/ inválidas + trazabilidad).
7. Delete (físico prohibido; soft-delete por estado).
8. Subcolección `verificaciones`.
9. Subcolección `media`.
10. Subcolección `estadisticas`.
11. Subcolección `auditoria` (append-only).
12. Colecciones relacionadas (`pagos`, `contratos_perfiles`, `contratos_banners`).
13. Campos protegidos (privados/financieros).
14. Edición cruzada.
15. Intentos de bypass.

## Qué pruebas NO cubre

- Storage Rules (binarios).
- Índices Firestore (rendimiento de queries).
- Asignación real de custom claims.
- Migración BLK-01 (solo asume su estado final vía fixtures).
- Reglas de `usuarios/{uid}` legacy.

## Siguiente paso recomendado

1. Revisión manual del borrador `.rules` + esta suite.
2. Ejecutar la migración BLK-01 en emulador (con `blk01-inventario.mjs` / `blk01-dryrun-migracion.mjs`).
3. Correr esta suite en emulador y ajustar reglas hasta 100% verde.
4. Diseñar Storage Rules + asignación de custom claims.
5. Recién entonces, plan de deploy (BLK-05) con autorización del PO.
