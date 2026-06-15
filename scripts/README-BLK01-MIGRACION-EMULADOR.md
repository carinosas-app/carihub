# BLK-01 — Migración Aditiva (solo Emulador)

> Documentación de `scripts/blk01-migracion-emulador.mjs`. Artefacto de apoyo. **NO ejecutar contra producción.**

## 1. Objetivo
Migrar de forma **aditiva** `usuarios/{uid}` → `perfiles/{perfilId}` y aplicar el **bridge** en el hub `usuarios/{uid}`, **exclusivamente** en el Firestore Emulator. Bridge: `perfilId = usuarioId` (BRIDGE-MIG-01). **No borra legacy** ni toca producción.

## 2. Restricciones
- Solo emulador (`demo-carihub`, host local). Nunca `carihub-app` ni Firebase real.
- No borra ni modifica campos públicos legacy fuera del bridge.
- No toca otras colecciones (pagos, contratos, banners, denuncias, etc.).
- No resuelve favoritos (solo los detecta y reporta).
- No deploy, no commits a git.

## 3. Modo dry-run (por defecto)
Lee `usuarios/`, construye en memoria `perfiles/{perfilId}` y el `hubPatch`, detecta divergencias, usuarios sin perfil, KYC, campos obligatorios faltantes, colisiones (`perfiles/{perfilId}` ya existente), genera slug, calcula batches y operaciones estimadas, y escribe el reporte local. **No escribe en Firestore.**

## 4. Modo commit (fase futura)
Solo con **doble confirmación**: `--commit --confirm-emulator`. Escribe únicamente en el emulador:
- `perfiles/{perfilId}` (si no existe).
- Campos bridge en `usuarios/{uid}`.
No borra legacy, no sobrescribe perfiles existentes (los reporta como colisión y los omite).

## 5. Variables requeridas
```powershell
$env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
$env:GCLOUD_PROJECT="demo-carihub"
```

## 6. Comandos futuros
```powershell
# Dry-run (no escribe)
node scripts/blk01-migracion-emulador.mjs

# Commit en EMULADOR (doble confirmación obligatoria)
node scripts/blk01-migracion-emulador.mjs --commit --confirm-emulator
```

## 7. Salvaguardas anti-producción
1. Aborta sin `FIRESTORE_EMULATOR_HOST`.
2. Aborta si el host no es local (`127.0.0.1`/`localhost`/`[::1]`).
3. Exige `GCLOUD_PROJECT="demo-carihub"`; rechaza cualquier otro.
4. Rechaza explícitamente `carihub-app`.
5. Dry-run por defecto; escritura solo con `--commit`.
6. Commit exige además `--confirm-emulator`.
7. No usa `applicationDefault()` ni credenciales reales (`initializeApp({ projectId })`).
8. Aborta si el emulador no responde, si no hay `usuarios/`, o si está vacío.
9. Aborta si detecta datos no-demo (uid no `demo_*` o email fuera de `@example.test`).

## 8. Qué escribe (solo en commit, solo emulador)
- `perfiles/{perfilId}`: `perfilId, usuarioId, ownerUid, alias, slug, tipoPerfil, arquetipo, sectorId, subcategoriaId, formularioId, geo, descripcion, fotos, estadoPublicacion, estadoPago, fechaVencimiento, tienePerfilPublico, schemaVersion, createdAt, updatedAt, migracion{origen,blk,version,migradoEn,modo}`.
- `usuarios/{uid}` (bridge): `perfil.perfilPrincipalId, perfil.perfilIds (arrayUnion), perfil.migradoBlk01, perfil.migradoEn, perfil.estadoBridge, perfil.schemaVersion`.
- Usuario sin perfil: `perfil.perfilPrincipalId=null, perfil.perfilIds=[], perfil.estadoBridge="sin_perfil", perfil.migradoBlk01=true, perfil.migradoEn, perfil.schemaVersion`.

## 9. Qué NO escribe
- No copia KYC ni datos sensibles al perfil (`verificacion, ine*, selfie, nombreReal, fechaNacimiento, domicilio, correoPrivado, telefonoPrivado, kyc, notasAdmin, email`). Los reporta como `camposOmitidosPorPrivacidad`.
- No borra ni altera campos públicos legacy fuera del bridge.
- No sobrescribe `perfiles/{perfilId}` existentes.

## 10. Colecciones que toca
- `perfiles/` (crea) y `usuarios/` (solo bridge `perfil.*`).

## 11. Colecciones que NO toca
- `favoritos` (solo lectura para detección), `pagos`, `contratos`, `contratos_banners`, `banners`, `denuncias`, logs, y cualquier otra.

## 12. Cómo interpretar el reporte
`scripts/_blk01-migracion-emulador-report.json` incluye: `modo, projectId, emulatorHost, usuariosProcesados, perfilesSimulados, perfilesCreados, usuariosParchados, usuariosSinPerfil, perfilesOmitidos, divergencias, advertencias, colisiones, kycDetectado, camposOmitidosPorPrivacidad, slugsGenerados, favoritosHuerfanos, batches, operacionesEstimadas, operacionesEjecutadas, errores, veredicto`.

## 13. Cómo validar después (post-commit en emulador)
- Existe `perfiles/`.
- Perfiles creados = esperados; usuarios parchados = esperados.
- Todo perfil tiene `ownerUid` y `usuarioId`.
- Todo usuario con perfil tiene `perfil.perfilPrincipalId`.
- Usuarios sin perfil correctamente marcados (`estadoBridge="sin_perfil"`).
- Cero KYC/sensible en perfiles públicos.
- Reporte sin errores críticos.
- Re-ejecutar `blk01-inventario.mjs` y verificar coherencia.

## 14. Qué hacer si hay colisiones
`perfiles/{perfilId}` ya existe → el script lo **omite** y lo lista en `colisiones`. No sobrescribe por defecto. Revisar manualmente; un flag de sobrescritura quedaría para una fase futura **explícitamente documentada y autorizada**.

## 15. Qué hacer si hay divergencias
Revisar `divergencias` (p. ej. `campo_obligatorio_faltante` en usuarios sin perfil es esperado). Si aparece `sensible_en_perfil_publico`, **detenerse**: indica fuga de datos sensibles y debe corregirse antes de commit.

## 16. Qué hacer con favoritos huérfanos
Solo se **detectan y reportan** (`favoritosHuerfanos`). No se modifican ni borran. Su resolución corresponde a una **fase posterior** dedicada.

## 17. Qué NO hacer en producción
- No ejecutar contra `carihub-app` ni Firebase real.
- No correr `--commit` fuera del emulador.
- No desplegar reglas ni asignar claims reales como parte de este script.
- No borrar legacy.

## 18. Siguiente paso después de dry-run
Revisar el reporte; si `veredicto=DRY_RUN_OK`, sin `sensible_en_perfil_publico` y colisiones entendidas → solicitar autorización para commit en emulador.

## 19. Siguiente paso después de commit en emulador
Ejecutar las validaciones del punto 13 (incluida re-corrida de inventario) y emitir un cierre de la fase de escritura en emulador.

## 20. Checklist antes de producción
- [ ] Dry-run + commit en emulador verdes, validaciones del punto 13 OK.
- [ ] Dataset representativo (volumen y casos borde) probado.
- [ ] Reglas `blk05` (Firestore + Storage) validadas en emulador.
- [ ] Custom claims reales asignados/validados (BLK-05).
- [ ] Backup productivo restaurable verificado.
- [ ] Plan rollback ensayado; criterios de aborto definidos.
- [ ] Lectura dual (perfiles con fallback usuarios) implementada en el frontend.
- [ ] Go/No-Go productivo firmado por el PO.

> Cada ejecución requiere autorización explícita del PO. Este README no ejecuta nada.
