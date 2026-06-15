# Plan de pruebas — Storage Rules BLK-05 (`blk05-storage-rules-draft.rules`)

> **BORRADOR — NO EJECUTAR EN ESTA FASE — SOLO EMULADOR EN EL FUTURO**
> No deploy, no producción, no Firebase, no Storage real, no Firestore, sin `npm install`.

## 1. Objetivo del plan de pruebas

Validar `allow`/`deny` del borrador de Storage Rules para archivos públicos, privados y sensibles (KYC, comprobantes, banners, documentos admin), garantizando que ningún archivo sensible se exponga públicamente y que la subida valide MIME, tamaño, ownership y estado del perfil/banner contra Firestore.

## 2. Requisitos antes de ejecutar (futuro)

- Emulador de **Storage** activo.
- Emulador de **Firestore** activo (las reglas hacen `firestore.get/exists`).
- Proyecto Firebase **demo** (`demo-*`) — nunca producción.
- Borrador `.rules` revisado manualmente.
- Custom claims simuladas (admin/moderador/soporte/auditor/sistema).
- Fixtures de `perfiles/{perfilId}` y `banners/{bannerId}` sembrados en Firestore (ownerUid + estado).
- Dependencias (futuro): `@firebase/rules-unit-testing`, `firebase`.

## 3. Casos ALLOW

| ID | Actor | Acción | Ruta |
|---|---|---|---|
| SA01 | owner | write | `/perfiles/{id}/pending/fotos/{f}` (imagen ≤8MB, metadata propia) |
| SA02 | owner | create | `/perfiles/{id}/private/kyc/ine-frente/{f}` (imagen/pdf ≤10MB) |
| SA03 | owner | create | `/perfiles/{id}/private/kyc/selfie/{f}` |
| SA04 | owner | create | `/perfiles/{id}/private/pagos/comprobantes/{f}` |
| SA05 | admin | read | `/perfiles/{id}/private/kyc/ine-frente/{f}` |
| SA06 | moderador | read | `/perfiles/{id}/pending/fotos/{f}` |
| SA07 | público | read | `/perfiles/{id}/public/foto-principal/{f}` (perfil activo/visible/publicado) |
| SA08 | anunciante/owner | create | `/banners/{id}/pending/media/{f}` (imagen ≤10MB / video ≤50MB) |
| SA09 | admin | read | `/admin/{exp}/documentos/{f}` |
| SA10 | admin/sistema | write | `/perfiles/{id}/public/galeria/{f}` (promoción a público) |

## 4. Casos DENY

| ID | Actor | Acción | Ruta / Motivo |
|---|---|---|---|
| SD01 | público | read | `/perfiles/{id}/private/kyc/**` (KYC) |
| SD02 | público | read | `/perfiles/{id}/private/pagos/comprobantes/{f}` |
| SD03 | público | read | `/perfiles/{id}/pending/fotos/{f}` (media pendiente) |
| SD04 | owner | write | `/perfiles/{id}/public/**` (owner no publica directo) |
| SD05 | owner | read | `/admin/{exp}/documentos/{f}` (expediente admin) |
| SD06 | usuario B | read | `/perfiles/{idA}/pending/fotos/{f}` (perfil ajeno) |
| SD07 | usuario | create | `/perfiles/{id}/pending/fotos/{f}` con `metadata.ownerUid` ajeno |
| SD08 | usuario | create | cualquier ruta con MIME `image/svg+xml` / `text/html` / `application/javascript` |
| SD09 | usuario | create | archivo mayor al límite de su ruta |
| SD10 | agente IA | read | `/perfiles/{id}/private/kyc/**` |
| SD11 | soporte | write | `/perfiles/{id}/private/kyc/**` (soporte no escribe KYC) |
| SD12 | auditor | write | cualquier ruta (auditor solo lectura) |
| SD13 | owner | update/delete | `/perfiles/{id}/private/kyc/**` (KYC inmutable) |
| SD14 | owner | update | `/perfiles/{id}/private/pagos/comprobantes/{f}` (comprobante validado) |

## 5. Matriz ruta ↔ rol ↔ acción

Leyenda: R=read, W=create/write, U=update, D=delete, `-`=deny.

| Ruta | público | owner | admin | moderador | soporte | auditor | sistema | agente_ia |
|---|---|---|---|---|---|---|---|---|
| `/perfiles/{id}/public/**` | R (si perfil público) | R | R/W | R | - | R | W | - |
| `/perfiles/{id}/pending/fotos/**` | - | R/W/D | R/D | R | - | - | - | - |
| `/perfiles/{id}/private/kyc/**` | - | R/W(create) | R | R | R | R | - | - |
| `/perfiles/{id}/private/pagos/**` | - | R/W(create) | R | - | - | R | - | - |
| `/banners/{id}/public/media/**` | R (si banner activo) | R | R/W | R | - | R | W | - |
| `/banners/{id}/pending/media/**` | - | R/W/D | R/D | R | - | - | - | - |
| `/banners/{id}/private/comprobantes/**` | - | R/W(create) | R | - | - | R | - | - |
| `/admin/{exp}/documentos/**` | - | - | R/W | R | R | R | W | - |
| `/admin/{exp}/evidencias/**` | - | - | R/W | R | - | R | W | - |
| `/usuarios/{uid}/legacy/**` | - | R | R | - | - | - | - | - |

## 6. Matriz MIME / tamaño

| Tipo de archivo | MIME permitidos | Tamaño máx |
|---|---|---|
| Foto perfil principal | jpeg, png, webp | 5 MB |
| Galería perfil | jpeg, png, webp | 8 MB |
| INE / selfie | jpeg, png, webp, pdf | 10 MB |
| Comprobante pago | jpeg, png, webp, pdf | 10 MB |
| Banner imagen | jpeg, png, webp | 10 MB |
| Banner video | mp4, webm | 50 MB |
| PDF administrativo | pdf | 15 MB |
| **Negados siempre** | html, js, svg (riesgo), ejecutables, zip, sin MIME | — |

## 7. Matriz de sensibilidad

| Clase | Rutas | Lectura |
|---|---|---|
| Público | `/perfiles/{id}/public/**`, `/banners/{id}/public/**` | cualquiera si el doc Firestore es público |
| Privado owner | `/perfiles/{id}/pending/**` | owner + moderador/admin |
| Sensible KYC | `/perfiles/{id}/private/kyc/**` | owner + admin/moderador/auditor (+soporte limitado) |
| Financiero | `/perfiles/{id}/private/pagos/**`, `/banners/{id}/private/comprobantes/**` | owner + admin/auditor |
| Administrativo | `/admin/{exp}/**` | admin/moderador/soporte/auditor |
| Auditoría | (trazabilidad en Firestore `auditoria`) | admin/auditor |

## 8. Matriz dependencia Firestore

| Regla Storage | Documento Firestore | Campo |
|---|---|---|
| `isProfileOwner(perfilId)` | `perfiles/{perfilId}` | `ownerUid` |
| `perfilEsPublico(perfilId)` | `perfiles/{perfilId}` | `estadoPublicacion`, `visible`, `publicado`, `suspendido`, `eliminado`, `vencido` |
| `isBannerOwner(bannerId)` | `banners/{bannerId}` | `ownerUid` |
| `bannerEsPublico(bannerId)` | `banners/{bannerId}` | `estado` |
| Comprobantes/pagos | `pagos`, `contratos_perfiles` | `usuarioId`, `perfilId` |

## 9. Qué NO cubre

- Escaneo antivirus, moderación automática, procesamiento/optimización de imágenes.
- Signed URLs, CDN/cache.
- Cloud Functions (promoción a público, validación profunda, generación de thumbnails).
- Reglas de `usuarios/{uid}` legacy más allá del path `legacy/**`.
- La migración BLK-01 (solo asume su estado final).

## 10. Cómo se ejecutaría en el futuro

1. `npm i -D @firebase/rules-unit-testing firebase`.
2. `firebase emulators:start --only firestore,storage`.
3. Sembrar fixtures de `perfiles`/`banners` en el emulador Firestore.
4. Escribir/ejecutar pruebas con `initializeTestEnvironment({ storage: { rules }, firestore: { rules } })`.
5. Cubrir cada caso de las secciones 3 y 4; iterar hasta 100% verde.

## 11. Cómo NO ejecutarlo

- Sin emulador Storage **y** Firestore.
- Apuntando a un bucket/proyecto real.
- Copiando el borrador a `storage.rules` o desplegando.
- Antes de ejecutar la migración BLK-01 y configurar custom claims.

## 12. Checklist antes de deploy

- [ ] Borrador `.rules` revisado por seguridad.
- [ ] BLK-01 ejecutada (perfiles/{perfilId} + ownerUid + bridge).
- [ ] Custom claims asignados server-side.
- [ ] Firestore Rules `perfiles/` desplegadas y verdes.
- [ ] Suite Storage en emulador 100% verde (allow/deny).
- [ ] Límites MIME/tamaño confirmados con producto.
- [ ] Definidas Cloud Functions de promoción a público y validación profunda.
- [ ] Definidos signed URLs / CDN si aplican.
- [ ] Autorización runtime del Product Owner.
