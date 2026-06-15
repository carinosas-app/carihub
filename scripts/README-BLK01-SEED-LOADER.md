# BLK-01 — Cargador de Seed para Emulador

> Documentación de `scripts/blk01-seed-loader.mjs`. Artefacto de apoyo. **NO ejecutar contra producción.**

## Propósito
Cargar `scripts/blk01-seed-emulador.json` **exclusivamente** en el **Firestore Emulator**, para luego validar `blk01-inventario.mjs` (solo lectura) y `blk01-dryrun-migracion.mjs` (sin escritura). Convierte los marcadores `{"$timestamp": "<ISO8601>"}` del seed a Firestore `Timestamp` y genera un reporte local de carga.

## Alcance / restricciones
- Solo escribe en el **emulador**; nunca en Firebase/Firestore real.
- **Nunca** usa el proyecto `carihub-app`.
- No hace deploy, no toca Storage, no usa credenciales reales.
- Modo por defecto = **DRY-RUN** (no escribe). Para cargar se exige el flag `--commit`.

## Salvaguardas anti-producción (todas deben cumplirse para escribir)
1. `FIRESTORE_EMULATOR_HOST` definido — si falta, **aborta**.
2. El host debe ser **local** (`127.0.0.1` / `localhost`) — si no, **aborta**.
3. `GCLOUD_PROJECT` debe ser exactamente **`demo-carihub`** — si no, **aborta**.
4. `carihub-app` se **rechaza explícitamente**.
5. Modo por defecto **DRY-RUN**; escritura real solo con `--commit`.
6. No usa `applicationDefault()` ni claves de servicio; `initializeApp({ projectId })` apunta al emulador vía `FIRESTORE_EMULATOR_HOST`.

## Dependencias
- `firebase-admin@13` (ya instalado en la raíz: `node_modules/firebase-admin`). No requiere instalar nada más.

## Prerequisitos
- Firestore Emulator **ya corriendo** (autorización pendiente):
  ```powershell
  firebase emulators:start --only firestore --project demo-carihub
  ```

## Uso futuro (cuando el PO lo autorice)
```powershell
# Variables de entorno seguras
$env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
$env:GCLOUD_PROJECT="demo-carihub"

# 1) Validación + simulación SIN escribir (por defecto):
node scripts/blk01-seed-loader.mjs

# 2) Carga real al EMULADOR (requiere flag explícito):
node scripts/blk01-seed-loader.mjs --commit
```

## Validación previa del seed
Antes de cargar, el cargador valida:
- `seed.usuarios` no vacío; cada `uid` coincide con la clave del documento.
- `seed.favoritos` no vacío; cada favorito tiene `ownerUid` y `perfilId`.
- Cobertura informativa: existe al menos un favorito **válido** y uno **huérfano**.

Si la validación falla, **aborta** y escribe el reporte con los problemas detectados.

## Conversión de timestamps
Los valores `{"$timestamp": "2027-01-01T00:00:00.000Z"}` se convierten recursivamente a `Timestamp.fromDate(new Date(iso))`. Un ISO inválido aborta la carga. Esto es necesario para que `esPerfilPublicoLegacy()` evalúe `fechaVencimiento instanceof Timestamp` correctamente.

## Estructura de escritura en el emulador
- `usuarios/{uid}` ← cada entrada de `seed.usuarios`.
- `usuarios/{ownerUid}/favoritos/{perfilId}` ← cada entrada de `seed.favoritos` (el id del doc favorito **es** el `perfilId`, consistente con `collectionGroup('favoritos')` que lee el inventario).

## Reporte local
Genera `scripts/_blk01-seed-load-report.json` con: modo (`DRY_RUN`/`COMMIT`), entorno, validación, cobertura, conteo de escrituras y timestamps convertidos. **Solo local; nunca toca Firestore real.**

## Cómo NO ejecutarlo
- No correr sin `FIRESTORE_EMULATOR_HOST` (aborta por diseño).
- No correr con `GCLOUD_PROJECT=carihub-app` (rechazado).
- No correr con `--commit` contra un host no local.
- No ejecutar antes de que el emulador esté iniciado y autorizado.

## Relación con otros artefactos
- Seed: `scripts/blk01-seed-emulador.json` (ficticio/anonimizado).
- Consumidores: `blk01-inventario.mjs`, `blk01-dryrun-migracion.mjs`.
- Plan: `PLAN-CONSTRUCCION-BLK-01-MIGRACION-PERFILID v1.0.0`.

## Secuencia recomendada (tras autorizar el emulador)
1. `firebase emulators:start --only firestore --project demo-carihub`
2. `node scripts/blk01-seed-loader.mjs` (dry-run) → revisar `_blk01-seed-load-report.json`
3. `node scripts/blk01-seed-loader.mjs --commit` (carga al emulador)
4. `node scripts/blk01-inventario.mjs` (solo lectura)
5. `node scripts/blk01-dryrun-migracion.mjs` (sin escritura)

> Cada paso requiere autorización explícita del PO. Este README no ejecuta nada.
