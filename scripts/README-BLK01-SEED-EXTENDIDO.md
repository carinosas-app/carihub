# BLK-01 — Seed Extendido (casos borde) para Emulador

> Documentación de `scripts/blk01-seed-emulador-extendido.json`. Artefacto de referencia. **NO cargar sin autorización y sin adaptar el loader.** No producción.

## 1. Objetivo
Dataset ficticio ampliado para probar la migración aditiva BLK-01 en escenarios realistas antes de producción: múltiples perfiles, negocio/anunciante, KYC aprobado, **colisiones reales** contra `perfiles/`, owner inconsistente, slug duplicado, bridge previo, datos incompletos e idempotencia avanzada.

## 2. Casos cubiertos (30)
Persona activo (1), persona vencido (2), persona pendiente (3), usuario sin perfil (4), KYC en revisión (5), KYC aprobado (6), múltiples perfiles (7), negocio/anunciante (8), perfil preexistente para colisión (9), slug duplicado (10), fotos vacías (11), geo incompleta (12), campos mínimos (13), `actualizacionPendiente=true` (14), favorito válido (15), favorito huérfano (16), favorito a perfil migrado (17), pago vencido (18), pago activo (19), creado sin públicos (20), `perfilIds` poblado (21), `perfilPrincipalId` preexistente (22), `estadoBridge` previo (23), legacy completo (24), legacy incompleto (25), schema antiguo (26), schema actual (27), perfil parcialmente migrado (28), owner correcto (29), owner inconsistente (30). El mapeo exacto caso→documento está en `$meta.casosCubiertos` del JSON.

## 3. Qué valida cada caso (resumen)
- **Estados/pagos (1,2,3,18,19):** mapeo `publicado/vencido/borrador` y `estadoPago`.
- **Sin perfil/sin públicos (4,20):** bridge `estadoBridge=sin_perfil`, sin crear perfil público.
- **KYC (5,6):** que `verificacion` (en revisión y aprobado) **nunca** llegue a campos públicos.
- **Múltiples perfiles + bridge previo (7,21,22,23):** idempotencia de `perfilIds` (`arrayUnion`), respeto de `perfilPrincipalId`/`estadoBridge` existentes.
- **Negocio (8):** `tipoPerfil=negocio`, `arquetipo=anunciante`.
- **Colisión real (9,28):** `perfiles/{perfilId}` preexistente → debe omitirse, no sobrescribirse.
- **Slug duplicado (10):** dos nombres iguales → slugs iguales; detectar riesgo de colisión de slug.
- **Datos incompletos (11,12,13,25):** fotos vacías, geo parcial, mínimos, legacy incompleto → divergencias esperadas.
- **Schema (26,27):** convivencia de `schemaVersion` antiguo/actual.
- **Owner (29,30):** perfil con owner correcto vs `ownerUid` inconsistente (riesgo a detectar).
- **Favoritos (15,16,17):** válido, huérfano y a perfil preexistente.

## 4. Estructura del JSON
- `$meta`: nombre, versión, objetivo, fecha, entorno obligatorio, advertencia, compatibilidad loader, casos cubiertos.
- `usuarios`: map `{uid: data}` (19 usuarios ficticios).
- `favoritos`: array `{ownerUid, perfilId, tipo, createdAt}` (3) → se cargan en `usuarios/{ownerUid}/favoritos/{perfilId}`.
- `perfiles`: map `{perfilId: data}` (4 perfiles **preexistentes**) → para forzar colisiones reales e idempotencia avanzada.
- Timestamps: `{"$timestamp": "<ISO>"}` (el cargador debe convertir a `Timestamp`).

## 5. Qué partes soporta el loader actual
`scripts/blk01-seed-loader.mjs` **hoy** carga únicamente:
- `usuarios` (map) → `usuarios/{uid}`.
- `favoritos` (array) → `usuarios/{ownerUid}/favoritos/{perfilId}`.

## 6. Qué partes requieren adaptar el loader
⚠️ El bloque **`perfiles`** (perfiles preexistentes) **NO** es soportado por el loader actual. Sin esa carga **no** se pueden ejercitar las colisiones reales (casos 9, 28, 29, 30). Adaptación requerida (siguiente paso, sin ejecutar aún):
- Que el loader lea `seed.perfiles` y escriba `perfiles/{perfilId}` (solo emulador, mismas guardas anti-producción, dry-run por defecto).
- Mantener la guardia anti-datos-reales (uid `demo_*`, email `@example.test`).

## 7. Cómo se cargaría en el futuro
```powershell
$env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
$env:GCLOUD_PROJECT="demo-carihub"
# (tras adaptar el loader para aceptar este archivo y el bloque perfiles)
node scripts/blk01-seed-loader.mjs            # dry-run
node scripts/blk01-seed-loader.mjs --commit   # carga al emulador
```
> El loader actual apunta a `blk01-seed-emulador.json`; aceptar el archivo extendido y el bloque `perfiles` es parte de la adaptación del paso 6.

## 8. Qué scripts se usarían después
`blk01-inventario.mjs` → `blk01-migracion-emulador.mjs` (dry-run y `--commit --confirm-emulator`) → `blk01-validacion-postcommit-emulador.mjs`.

## 9. Qué riesgos cubre
Colisiones reales, owner inconsistente, slug duplicado, múltiples perfiles, bridge previo, datos incompletos, KYC aprobado/expuesto, pagos activos/vencidos, favoritos huérfanos.

## 10. Qué NO cubre
- Volumen masivo (es un set de casos, no de carga/performance).
- Reglas Firestore/Storage reales y custom claims (BLK-05).
- Pagos/contratos/banners como colecciones propias (no se migran en BLK-01).
- Resolución de favoritos huérfanos (fase posterior).
- Lectura dual en frontend.

## 11. Restricciones anti-producción
- Solo `demo-carihub` + emulador local; nunca `carihub-app` ni Firebase real.
- Datos 100% ficticios (`@example.test`, `demo_*`, URLs `*.example.test`); sin PII/INE/RFC/selfie/teléfonos/correos reales.
- No deploy, no commits, no cargar sin autorización.

## 12. Orden recomendado de prueba
1. Adaptar loader para el seed extendido (incl. bloque `perfiles`).
2. Dry-run loader extendido.
3. Commit loader extendido (emulador).
4. Inventario.
5. Dry-run migración.
6. Commit migración.
7. Validación post-commit.
8. Prueba de idempotencia (re-commit).
9. Validación final.

## 13. Riesgos de colisiones
`perfiles/{perfilId}` preexistente (9,28): el migrador debe **omitir** y reportar `colisiones`, nunca sobrescribir. Validar que el conteo de colisiones = perfiles preexistentes que también existen como usuario.

## 14. Riesgos de owner inconsistente
Caso 30 (`ownerUid != perfilId/usuarioId`): el validador debe **señalarlo como advertencia/riesgo**. En producción, un owner inconsistente puede romper `isProfileOwner` (BLK-05) → revisar antes de migrar datos reales.

## 15. Riesgos de múltiples perfiles
Caso 7: el bridge debe preservar `perfilIds` existentes y agregar sin duplicar (`arrayUnion`). Verificar que `perfilPrincipalId` previo no se pierda y que no se dupliquen ids.

## 16. Riesgos de slug duplicado
Casos 10 (`demo_slug_dup_a`/`_b`, mismo nombre): generan el mismo slug. Como `perfilId=uid` (único), no hay colisión de id, pero el **slug** sí colisiona → en producción la URL canónica `/perfil/{perfilId}/{slug}` debe desambiguar por `perfilId`; documentar política de unicidad de slug para SEO.

## 17. Qué NO hacer en producción
- No cargar este seed en `carihub-app` ni en Firestore real.
- No ejecutar migración con escritura fuera del emulador.
- No usar estos datos como reales.

---

> Cada ejecución requiere autorización explícita del PO. Este README y el seed no ejecutan nada.
