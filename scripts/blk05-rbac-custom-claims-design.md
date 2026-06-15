# RBAC / Custom Claims — Diseño Arquitectónico Definitivo (CariHub)

> Documento de referencia arquitectónica de seguridad. Companion estructurado: `scripts/blk05-rbac-custom-claims-matrices.json`.

---

## ⚠️ ENCABEZADO DE SEGURIDAD

```
####  BORRADOR — NO DEPLOY — NO PRODUCCIÓN  ####

- BORRADOR: diseño conceptual, no es configuración productiva.
- NO DEPLOY: no aplicar claims reales, no desplegar rules.
- NO PRODUCCIÓN: no usar contra datos/usuarios reales.
- NO EJECUTAR: no Firebase, no Firestore, no Storage, no emulador, no commits.
- REQUIERE REVISIÓN: arquitectura + seguridad antes de cualquier uso.
- REQUIERE BLK-01: perfiles/{perfilId}, ownerUid y hub usuarios/{uid} aún no existen.
- REQUIERE BLK-05: asignación de claims server-side (Cloud Functions) y deploy de rules.
- REQUIERE CUSTOM CLAIMS: hoy firestore.rules usa email único (legacy), no RBAC.
- REQUIERE 2FA / App Check para funciones de administración de claims.
```

**Metadatos**
- Documento: RBAC / Custom Claims — Diseño Arquitectónico Definitivo
- Versión: 1.0.0 · Fecha: 2026-06-11 · Estado: `BORRADOR_REFERENCIA_NO_EJECUTABLE`
- Parte de: `GAP-RULES-FIRESTORE-ALIGNMENT v1.0.0` (fase 2) / `BLK-05`

**Alineación (lectura, sin modificar)**
- `scripts/blk05-firestore-rules-perfiles-draft.rules`
- `scripts/blk05-storage-rules-draft.rules` · `scripts/blk05-storage-rules-test-plan.md`
- `scripts/blk05-rules-perfiles.test.mjs` · `scripts/blk05-rules-perfiles-test-fixtures.json`
- `scripts/GAP-RULES-FIRESTORE-ALIGNMENT-v1.0.0.json`
- `scripts/config-seguridad-mvp-schema.json` (CONGELADO)
- `scripts/PLAN-CONSTRUCCION-BLK-01-MIGRACION-PERFILID v1.0.0`
- `scripts/MATRIZ-RUTAS-NAV-CANONICA.json`
- `scripts/ACTA-CONGELAMIENTO-SEGURIDAD.json` · `...-REGISTRO-CUENTA` · `...-PAGOS-CONTRATOS` · `...-PANEL-DASHBOARD-v1.1.0`

**Principio rector:** *Default-deny + mínimo privilegio + separación de privilegios.* Los claims son la fuente de verdad del **rol** dentro de las rules; los datos sensibles/financieros nunca son públicos; toda asignación, revocación o elevación deja **traza forense**.

---

# PARTE A — BASE OPERATIVA (Puntos 1–25)

## 1. Modelo conceptual RBAC + Custom Claims
CariHub usa un modelo híbrido:
- **Roles de plataforma** (`super_admin, admin, moderador, soporte, auditor, agente_ia, sistema`) → viven en **Firebase Custom Claims** (`request.auth.token.role`).
- **Roles de negocio** (`visitante, usuario, prestador, negocio, anunciante`) → derivan de **datos** (`usuarios.tipoCuenta`, ownership), **no** de claims.
- **Ownership** (dueño del documento) → relación de dato (`ownerUid`, bridge BLK-01), **no** es un claim.
- **Estado de seguridad** (`normal…bloqueado`) → orthogonal al rol y **prevalece** sobre él.

Las Firestore/Storage Rules son la última frontera: aunque la UI oculte algo, la regla decide.

## 2. Catálogo de roles
| Rol | ¿Claim? | Crítico | Descripción |
|---|---|---|---|
| `super_admin` | sí | ✔ | Control total; único que asigna/revoca claims y gestiona admins |
| `admin` | sí | ✔ | Aprobación, suspensión, pagos, configuración de scope |
| `moderador` | sí | – | Revisión de contenido/perfiles/denuncias; estados de moderación |
| `soporte` | sí | – | Atención a usuarios; lectura limitada; sin KYC completo ni pagos |
| `auditor` | sí | ✔ | Lectura de trazabilidad/logs; **sin edición**; acceso sensible deja log |
| `agente_ia` | sí | – | Lectura de métricas; **nunca escribe** |
| `sistema` | sí | ✔ | Service account / Cloud Functions; estados, ledger, logs |
| `visitante/usuario/prestador/negocio/anunciante` | **no** | – | Derivados de datos/ownership |

## 3. Schema canónico del custom claim
```jsonc
{
  "role": "admin",            // rol único de plataforma (MVP)
  "roles": ["..."],           // OPCIONAL multi-rol (post-MVP; evitar en MVP)
  "claimsVersion": 1,          // invalida tokens de esquemas viejos
  "assignedBy": "<uid>",      // solo super_admin para roles críticos
  "assignedAt": 0,             // epoch ms
  "expiresAt": null,           // elevación temporal (sección 30)
  "scopeRegion": null,         // reservado multi-país (no MVP)
  "scopeOrg": null,            // reservado multi-empresa (no MVP)
  "mfa": false,                // 2FA verificado (futuro)
  "deviceTrust": 0             // confianza de dispositivo (futuro)
}
```
**Límite duro:** los custom claims caben en ~1000 bytes. **No** contienen PII, secretos, ni datos volátiles (`riesgoScore`, `estadoSeguridad`).

## 4. Jerarquía y herencia de roles
Declarada explícitamente en rules (no transitiva libre):
- `isAdmin()` = `super_admin` OR `admin`
- `isModerator()` = `moderador` OR `isAdmin()`
- `isSupport()` = `soporte` OR `isAdmin()`
- `isAuditor()` = `auditor` OR `isAdmin()`
- `sistema` y `agente_ia` **no** heredan capacidades humanas.

> ⚠️ **Deuda SoD:** que `isAuditor()` incluya `isAdmin()` es comodidad MVP pero rompe la independencia del auditor. En post-MVP el `auditor` debe ser **exclusivo** sin herencia admin (ver §28/§33).

## 5. Mapa rol → permisos (capacidades)
Ver `matrizRolPermisos` en el JSON companion. Resumen:
- `owner`: edita lo suyo (gated), nunca aprueba/publica/cobra.
- `admin`: aprueba/rechaza/suspende/restaura, opera pagos, configura scope.
- `moderador`: revisa y modera contenido; **sin** pagos/RBAC/config global.
- `soporte`: lectura limitada; **sin** KYC completo ni pagos.
- `auditor`: lee todo + trazabilidad; **sin** edición.
- `agente_ia`: lee métricas agregadas; **sin** escritura.
- `sistema`: escribe estados/ledger/logs server-side.
- `super_admin`: además, **único** que asigna/revoca claims.

## 6. Mapa claim → rule helper
Alineado con `blk05-firestore-rules-perfiles-draft.rules`:
`hasRole(role)`, `hasAnyRole(roles)`, `isAdmin()`, `isModerator()`, `isSupport()`, `isAuditor()`, `isAgenteIA()`, `isSystem()`, `isOwner(uid)`, `isProfileOwner(perfilId)`, `bridgeOwnerValido(perfilId)`, `isPublicProfile()`.

## 7. Roles de negocio vs. plataforma
- **Negocio**: capacidad de cara al producto (publicar perfil, contratar banner). Derivan del tipo de cuenta y del estado de publicación. No requieren claim.
- **Plataforma**: capacidad operativa interna (moderar, cobrar, auditar). **Siempre** vía claim server-side.

## 8. Owner / ownership
Ownership **no** es un claim: es `perfiles/{perfilId}.ownerUid == request.auth.uid` o el **bridge BLK-01** (`usuarios/{uid}.perfil.perfilPrincipalId`/`perfilIds`). No operativo hasta BLK-01.

## 9. Rol `sistema` / service account
Cloud Functions/backends con claim de servicio. Escriben ledger de pagos, estados automáticos (vencimientos), logs y reconciliación de claims. Ningún humano debe firmar como `sistema`.

## 10. Rol `agente_ia`
Lectura controlada de métricas/analítica agregada. **Nunca** escritura directa en rules. Sin acceso a privado/financiero/KYC.

## 11. `super_admin` vs `admin`
`super_admin` añade sobre `admin`: gestión de claims (alta/baja/elevación), configuración global y bootstrap. Es el único punto de asignación de privilegios (concentración deliberada compensada con auditoría + 2FA + SoD del auditor).

## 12. `moderador`: alcance
Revisión y moderación: aprobar/rechazar/suspender perfiles y media, gestionar denuncias. **Excluido** de pagos, RBAC y configuración global.

## 13. `soporte`: alcance
Atención al usuario: lectura limitada de cuenta/perfil, mensajes de soporte. **Sin** KYC completo, **sin** pagos, **sin** estados críticos.

## 14. `auditor`: alcance
Lectura de `logsAdmin`, `logsSeguridad`, `logs_acceso_privado`, `claims_audit` y vistas read-only de cualquier módulo. **No edita.** Cada acceso a dato sensible genera `logs_acceso_privado`.

## 15. Estados de seguridad de cuenta (orthogonal a rol)
`normal | observacion | restringido | suspendido | bloqueado` (de `config-seguridad-mvp-schema.json`). Prevalecen sobre el rol: un usuario `bloqueado` no opera aunque tenga claim.

## 16. Fuente de verdad del rol
El **claim** es autoritativo para seguridad en rules. `usuarios/{uid}.roles` es **espejo** legible para UI/auditoría, **nunca** autoritativo. Divergencia ⇒ alerta.

## 17. Propagación del claim (latencia)
Cambiar un claim **no** actualiza tokens activos al instante: el ID token caduca en ~1h o se fuerza `getIdToken(true)` / re-login. Bajas críticas requieren `revokeRefreshTokens` (§70).

## 18. Tamaño y límites del claim
~1000 bytes. Por eso `role` es un string corto, no un objeto de permisos. Permisos granulares viven en rules + datos.

## 19. Versionado del claim
`claimsVersion` permite invalidar esquemas viejos: rules pueden exigir versión mínima; tokens con versión inferior se tratan como sin rol (default-deny).

## 20. Bootstrap inicial
El **primer** `super_admin` se crea por proceso seguro fuera de banda (script administrativo manual con credenciales de proyecto), nunca desde UI pública. A partir de ahí, todo es vía Assignment Function.

## 21. Asignación de claims
Solo `super_admin`, vía `assignPlatformRole` (Cloud Function, §74), con 2FA + App Check. Valida catálogo, SoD, exclusión mutua y límite de bytes.

## 22. Validación de claims
Doble: (a) **servidor** (`validateClaims`, §77) reconcilia claim vs doc; (b) **rules** ignoran roles desconocidos y aplican default-deny.

## 23. Sincronización claim ↔ doc
`syncClaims` (§78) mantiene `usuarios.roles` como espejo del claim autoritativo, on-write y programado.

## 24. Errores / fallback
Sin claim válido ⇒ tratado como `usuario`/`visitante` (default-deny en superficies privilegiadas). Claim corrupto/obsoleto ⇒ default-deny + alerta.

## 25. Roadmap RBAC
- **MVP**: claims básicos `admin`, owner por datos; rules legacy → migrar a borrador blk05 tras BLK-01.
- **Post-MVP**: `moderador/soporte/auditor/sistema` reales, 2FA admin, RBAC multi-admin completo (ya marcado postMVP en `config-seguridad`).
- **Escala**: multi-tenant (`scopeOrg/scopeRegion`), elevación temporal, franquicias.

---

# PARTE B — AMPLIACIÓN ARQUITECTÓNICA (Puntos 26–100)

## 26. Matriz Claim ↔ Dashboard
Ver `matriz26_ClaimDashboard` (JSON). `super_admin` es el único con **ADM-RBAC/claims**; `admin` sin RBAC; `moderador` sin pagos/RBAC; `soporte` solo soporte/cuenta limitada; `auditor` read-only de todo; `agente_ia` solo CX-IA métricas; `sistema` sin UI.

## 27. Matriz Claim ↔ Acción Crítica
Ver `matriz27_ClaimAccionCritica`. Toda acción crítica deja log. Asignar/revocar/elevar claims y configuración global ⇒ `super_admin` + doble control recomendado.

## 28. Separación de Privilegios (SoD)
- Quien crea/edita (owner) **no** aprueba.
- Quien aprueba pagos (admin) **no** concilia auditoría (auditor).
- Quien asigna claims (super_admin) deja traza que el auditor revisa.
- `sistema` ejecuta; humanos autorizan. **Acción correctiva post-MVP:** `auditor` exclusivo sin herencia admin.

## 29. Principio de Mínimo Privilegio
Cada rol recibe **solo** lo de su función. `soporte` sin pagos/KYC completo; `moderador` sin pagos/RBAC; `agente_ia` sin escritura; `auditor` sin edición.

## 30. Elevación Temporal de Privilegios
Claim con `expiresAt` (+`scope` acotado). Rules ignoran el claim si `now > expiresAt`; `syncClaims` lo revoca al expirar. Autoriza `super_admin`; log con motivo, ventana y aprobador en `claims_audit`.

## 31. Revocación de Emergencia
`revokePlatformRole(emergencia=true)` (§75): quita el claim, ejecuta `revokeRefreshTokens` inmediato, marca `alertas_seguridad: critical`. No bloqueante por doble control en emergencia.

## 32. Rotación de Roles
Reasignaciones periódicas o por cambio de responsabilidad: baja del rol anterior + alta del nuevo, ambas auditadas; tokens revocados para forzar el nuevo contexto.

## 33. Roles Mutuamente Excluyentes
`auditor` ⊕ `{admin, moderador, soporte}`; `agente_ia` ⊕ cualquier rol humano de escritura; `sistema` ⊕ cualquier rol humano. La Assignment Function rechaza combinaciones excluyentes.

## 34. Roles Delegados
Delegación temporal acotada (ausencias) vía elevación temporal con `scope` y `expiresAt`. El delegado nunca excede el alcance del delegante.

## 35. Roles Regionales (futuros)
`admin` + `scopeRegion` = operador regional; ve solo su jurisdicción. Inerte en MVP (`scopeRegion=null`).

## 36. Auditoría de Asignación de Claims
Cada `assignPlatformRole` ⇒ `claims_audit` (append-only) + `logsAdmin`: `targetUid, rolAntes, rolDespues, actorUid, motivo, expiresAt, ipHash, uaHash, createdAt`.

## 37. Auditoría de Revocación de Claims
Cada revocación ⇒ `claims_audit` + `logsAdmin` (+ `alertas_seguridad` si emergencia). Incluye motivo y resultado de `revokeRefreshTokens`.

## 38. Auditoría de Elevación Temporal
Registro de ventana de elevación (inicio/fin), scope, aprobador y revocación efectiva al expirar.

## 39. Auditoría de Accesos Sensibles
Toda lectura/export de KYC, comprobantes, datos personales ⇒ `logs_acceso_privado` (`actorUid, targetUid, campo, motivo, createdAt`). Aplica también al `auditor`.

## 40. Auditoría de Acciones Administrativas
Aprobación/rechazo/suspensión/pagos/config ⇒ `logsAdmin` con `diffHash`. Coincide con `config-seguridad-mvp-schema.logsAuditoria`.

## 41. Retención de Logs RBAC
`claims_audit` y `logs_acceso_privado`: **≥730 días**; `logsAdmin`: 365; `logsSeguridad`: 180. PII solo en hash.

## 42. Evidencia Forense
Logs **append-only**, inmutables para humanos (solo `sistema` crea), `diffHash` de cambios, exports firmados por `super_admin` que a su vez dejan `logs_acceso_privado`.

## 43. Dashboard Admin ↔ Claims
`admin` accede a revisión, pagos, auditoría (R), seguridad (scope) y perfiles. **No** ve ADM-RBAC/claims (exclusivo de `super_admin`).

## 44. Dashboard Moderador ↔ Claims
`moderador` accede a revisión, perfiles (revisión), denuncias y media (revisión). Sin pagos, RBAC ni config global.

## 45. Dashboard Soporte ↔ Claims
`soporte` accede a mensajes de soporte y vista limitada de cuenta de usuario. Sin KYC completo, pagos ni estados críticos.

## 46. Dashboard Auditor ↔ Claims
`auditor` accede a ADM-04 auditoría, logs y vistas read-only. Cada acceso sensible loguea. Sin botones de escritura.

## 47. Dashboard Sistema ↔ Claims
`sistema` no tiene dashboard humano; opera headless (Cloud Functions/jobs).

## 48. Claim ↔ Colección Firestore
Ver `matriz48_ClaimColeccionFirestore` (alineada con GAP-RULES y el borrador de rules). Cubre `perfiles`, subcolecciones, `usuarios` hub, `pagos`, `contratos(_banners)`, `banners`, `denuncias`, logs, `alertas_seguridad`, `claims_audit`.

## 49. Claim ↔ Documento
Acceso a documento = rol (claim) **∩** ownership (dato) **∩** estado. Ejemplo: owner lee su `perfil` privado; admin lo lee siempre; visitante solo si `isPublicProfile()`.

## 50. Claim ↔ Campo Sensible
Ver `matriz50_CamposSensibles`: `público / privadoOwner / kyc / financiero / admin`. Whitelist pública estricta; el resto nunca se expone a `visitante`.

## 51. Claim ↔ Estado
Las transiciones de `estadoPublicacion` (`borrador→pendiente→…→eliminado`) solo las hacen `admin/moderador` vía `isValidStatusTransition`; el owner nunca cambia estados administrativos. `sistema` aplica `vencido`.

## 52. Claim ↔ Ownership
La mayoría de capacidades de owner **no** requieren claim (son dato). Los roles de plataforma operan **sin** ser owner, pero siempre con log y gates.

## 53. Claim ↔ Subcolección
`verificaciones` (owner crea, admin/moderador resuelven, auditor lee con log), `media` (owner sube pendiente, admin aprueba, público ve solo aprobada), `estadisticas` (owner/admin/auditor leen; escribe sistema), `auditoria` (append-only sistema; auditor/admin leen).

## 54. Claim ↔ Ruta Storage
Ver `matriz54_ClaimStorage` (alineada con `blk05-storage-rules-draft.rules`). Público solo `/public/*` aprobado; `/private/*` y `/admin/*` por rol; `/usuarios/{uid}/legacy` solo lectura (bridge).

## 55. Claim ↔ Tipo de Archivo
Imágenes `jpeg/png/webp`; video banners `mp4/webm`; documentos `pdf`. Se **niegan** `HTML/JS/SVG-riesgoso/ejecutables/ZIP/MIME inválido`. Límites por ruta (5–50 MB).

## 56. Claim ↔ KYC
KYC (`ineFrente/ineReverso/selfie/kyc`): lee owner, admin, moderador y auditor (con log); `soporte` limitado; `agente_ia` **nunca**. **Jamás** bajo `/public/`.

## 57. Claim ↔ Comprobantes
Comprobantes de pago/banner: lee owner (propio), admin, auditor. No editables tras validación; público sin acceso.

## 58. Claim ↔ Evidencias
Evidencias/expedientes admin (`/admin/{expedienteId}/…`): admin/moderador/soporte autorizado/auditor leen; owner y público **no**. Escritura admin/sistema.

## 59. Flujo Alta de Admin
`super_admin` inicia → verificar identidad + 2FA → `assignPlatformRole(role=admin)` → escribir `usuarios.roles` + `claims_audit` + `logsAdmin` → notificar + forzar re-login.

## 60. Flujo Baja de Admin
`super_admin` (o emergencia) → `revokePlatformRole` → `revokeRefreshTokens` → espejar `usuarios.roles` → `claims_audit` + `alertas_seguridad`.

## 61. Flujo Alta de Moderador
`super_admin`/`admin` inicia → `assignPlatformRole(role=moderador)` scope revisión → log + re-login.

## 62. Flujo Baja de Moderador
Revocar claim → revoke tokens → log.

## 63. Flujo Alta de Soporte
`super_admin`/`admin` inicia → `assignPlatformRole(role=soporte)` (sin KYC completo/pagos) → log + re-login.

## 64. Flujo Baja de Soporte
Revocar claim → revoke tokens → log.

## 65. Flujo Alta de Auditor
`super_admin` inicia (exclusivo; sin herencia admin en post-MVP) → `assignPlatformRole(role=auditor)` read-only → log + re-login.

## 66. Flujo Baja de Auditor
Revocar claim → revoke tokens → log.

## 67. Requisitos 2FA
Obligatorio: `super_admin`, `admin`, `auditor`. Recomendado: `moderador`, `soporte`. Fase post-MVP (en `config-seguridad`, 2FA admin es postMVP).

## 68. Política de Contraseñas
Firebase Auth; mínimo 12 caracteres / passphrase; sin rotación por tiempo (sí por incidente); recuperación con `sendPasswordResetEmail` + Turnstile previo.

## 69. Gestión de Sesiones
ID token ~1h; refresh con rotación; cierre por inactividad recomendado para admin; limitar concurrencia de dispositivos admin (futuro).

## 70. Revocación Global de Tokens
`admin.auth().revokeRefreshTokens(uid)` ante baja/compromiso; rules validan `auth_time` vs `tokensValidAfterTime`.

## 71. Refresh Tokens
Cambios de claim requieren `getIdToken(true)` o re-login para propagar (latencia hasta ~1h; ver §17). Bajas críticas no esperan: revocan.

## 72. Dispositivos Confiables
`deviceTrust 0–100` (de `dispositivoConfianza` en `config-seguridad`). Dispositivo nuevo en rol crítico ⇒ MFA adicional/bloqueo.

## 73. Bloqueo por Riesgo
`estadoSeguridad`/`riesgoScore` pueden bloquear login y operación aunque el claim sea válido. El estado de seguridad **prevalece** sobre el rol.

## 74. Claims Assignment Function
`assignPlatformRole(targetUid, role, expiresAt?, scope?, motivo)` — guard: caller `super_admin` + 2FA + App Check. Efecto: `setCustomUserClaims` + `usuarios.roles` + `claims_audit` + `logsAdmin`. Valida catálogo, SoD, exclusión mutua, bytes.

## 75. Claims Revocation Function
`revokePlatformRole(targetUid, motivo, emergencia?)` — guard: `super_admin`. Efecto: `setCustomUserClaims(role:null)` + `revokeRefreshTokens` + `claims_audit` + `alertas_seguridad`.

## 76. Claims Audit Function
`auditClaims(filtros)` — guard: `super_admin`/`auditor`. Lee `claims_audit`/`logsAdmin`; export firmado deja `logs_acceso_privado`.

## 77. Claims Validation Function
`validateClaims(uid?)` — guard: `sistema`/`super_admin`. Compara claim vs `usuarios.roles`; reporta corruptos/huérfanos/obsoletos; alerta divergencias (§87–89).

## 78. Claims Sync Function
`syncClaims(uid?)` — guard: `sistema`. Reconcilia doc↔claim (claim autoritativo); corrige espejo; programado + on-write.

## 79. Compatibilidad Multiempresa
`scopeOrg` acota dashboards/colecciones a una organización; rules compararían `scopeOrg` con `doc.orgId`. **Reservado, inerte en MVP.**

## 80. Compatibilidad Multipaís
`scopeRegion` acota datos por país/región (SEO/legal por jurisdicción). **Reservado, inerte en MVP.**

## 81. Compatibilidad Multiadmin
Ya resuelta por claims: varios `admin` simultáneos (a diferencia del legacy email único). `super_admin` gestiona el conjunto.

## 82. Operadores Regionales
`admin` + `scopeRegion`: ve solo su región. Requiere multi-tenant (post-MVP).

## 83. Franquicias
`scopeOrg` = franquicia; SoD entre franquicia y plataforma central. Post-MVP.

## 84. Delegaciones
Elevación temporal acotada por scope (§30) para cubrir ausencias sin baja del titular.

## 85. Riesgos de Escalación Horizontal
Acceso a datos de otro owner/tenant del mismo nivel. Mitigación: ownership + `scopeOrg/scopeRegion` + `isProfileOwner` + default-deny. **Residual alto** hasta multi-tenant.

## 86. Riesgos de Escalación Vertical
Rol bajo obtiene capacidades de rol alto. Mitigación: claims server-side only, rules no confían en docs, asignación solo `super_admin`, SoD. **Residual medio** (proteger la Assignment Function es clave).

## 87. Claims Corruptos
Valor fuera de catálogo. Mitigación: `validateClaims` + rules ignoran roles desconocidos (default-deny). Residual bajo.

## 88. Claims Huérfanos
Claim sin doc espejo o usuario eliminado con claim activo. Mitigación: `syncClaims` + on-delete revoke + alerta. Residual medio.

## 89. Claims Obsoletos
`claimsVersion` vieja / token no refrescado. Mitigación: `claimsVersion` + `revokeRefreshTokens` + re-login. Residual medio (latencia 1h).

## 90. Riesgos de Bypass RBAC
Lectura/escritura directa por SDK saltando la UI. Mitigación: **las rules son la frontera real** + App Check + server-side para acciones críticas. **Residual alto** hasta desplegar el borrador blk05 (hoy rules legacy con email único).

## 91. Readiness RBAC
Antes ~10% → **diseño ~70%**. Diseño completo; faltan claims reales y rules desplegadas.

## 92. Readiness Firestore Rules
Borrador (`blk05-firestore-rules-perfiles-draft.rules`) ~60%; bloqueado por BLK-01, claims reales, emulador.

## 93. Readiness Storage Rules
Borrador (`blk05-storage-rules-draft.rules`) ~55%; bloqueado por BLK-01, claims, emulador, Cloud Functions.

## 94. Readiness Dashboard Admin
SPEC congelado (ACTA-PANEL-DASHBOARD v1.1.0) ~70%; bloqueado por RBAC runtime y BLK-01.

## 95. Readiness Seguridad
`config-seguridad` CONGELADO; RBAC multi-admin postMVP ~65%; bloqueado por claims, 2FA admin, deploy de rules.

## 96. Dependencias BLK-01
`perfiles/{perfilId}` + `ownerUid` + hub bridge: `isProfileOwner`/`bridgeOwnerValido` **no operan** sin BLK-01.

## 97. Dependencias BLK-05
Asignación de claims server-side + deploy de rules. Sin esto, RBAC es **solo diseño**.

## 98. Dependencias Dashboard
ADM-RBAC/claims UI (solo `super_admin`) y dashboards por rol dependen de claims propagados.

## 99. Checklist Preproducción
- [ ] BLK-01 ejecutado y validado (perfiles/ownerUid/hub).
- [ ] Assignment/Revocation/Validation/Sync Functions implementadas y protegidas (`super_admin` + 2FA + App Check).
- [ ] Primer `super_admin` por bootstrap fuera de banda.
- [ ] Rules Firestore + Storage validadas en emulador (suite verde).
- [ ] `claims_audit` + `logs_acceso_privado` activos, retención ≥730d.
- [ ] SoD verificada: `auditor` sin herencia admin (post-MVP); exclusiones mutuas aplicadas.
- [ ] `revokeRefreshTokens` probado (baja/emergencia).
- [ ] 2FA obligatorio para `super_admin/admin/auditor`.
- [ ] Plan de revocación de emergencia documentado y ensayado.
- [ ] Divergencia claim↔doc = alerta crítica monitoreada.
- [ ] Revisión manual de seguridad firmada por `super_admin`.

## 100. Veredicto PASS/FAIL
- **Documental:** ✅ **PASS** — referencia arquitectónica RBAC/Custom Claims completa (100 puntos).
- **Runtime:** ❌ **FAIL (esperado)** — no ejecutable: requiere BLK-01 + BLK-05 + Cloud Functions + emulador + deploy.
- **Producción:** ❌ **FAIL (esperado)** — no autorizado; checklist de preproducción pendiente.

> **Resumen:** Diseño listo para revisión manual. Implementación bloqueada por dependencias declaradas. **NO ejecutar.**
