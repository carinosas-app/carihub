# BLK-05-R0 — Perfiles Firestore Rules Contract Freeze

**Version:** 1.0.0  
**Baseline:** `origin/main` @ `bcfc3b17a3c4457781de1c45b633af9f93ce5f37`  
**Status:** FROZEN — emulator validation only; **NO production deploy**

Companion implementation: `scripts/lib/blk05-perfiles-contract.mjs`  
Rules draft: `scripts/blk05-firestore-rules-perfiles-draft.rules`  
Production candidate (test-only merge): `scripts/blk05-firestore-rules-production-candidate.rules`

---

## 1. Canonical `estadoPublicacion`

### Write enum (persist only these)

| Estado | Meaning |
|--------|---------|
| `borrador` | Draft, not submitted |
| `pendiente` | Submitted, awaiting admin review |
| `publicado` | Approved and publicly visible (when flags match) |
| `suspendido` | Admin suspended (was public) |
| `vencido` | Payment/subscription expired |
| `eliminado` | Soft-deleted (terminal) |

### Compatibility aliases (read-only — never write new docs)

| Alias | Maps to | Deprecation |
|-------|---------|-------------|
| `activo` | `publicado` | Remove after migration reconcile reports zero `activo` docs |
| `aprobado` | `pendiente` | Pre-publication legacy draft state |
| `correccion_solicitada` | `pendiente` | Merge into pendiente on next ETL |
| `actualizacion_pendiente` | `pendiente` | Legacy revision queue |

**Rule:** ETL (`blk01-migracion-emulador.mjs`) and all new writes emit **canonical** values only.

---

## 2. Public predicate — `isPerfilPublico()`

Exact Firestore/JS predicate (all conditions AND):

```
perfilForbiddenFieldsAbsent()
&& suspendido != true
&& eliminado != true
&& vencido != true
&& (fechaVencimiento absent OR null OR > request.time)
&& visible == true
&& publicado == true
&& tienePerfilPublico == true
&& (estadoPublicacion == 'publicado' OR estadoPublicacion == 'activo')
```

### Legacy semantic equivalence

Preserves production `usuarios` gate:

```
aprobado == true && activo == true && vencido != true && fechaVencimiento valid
```

ETL sets when legacy public: `estadoPublicacion='publicado'`, `visible=true`, `publicado=true`, `tienePerfilPublico=true`, `suspendido/eliminado/vencido=false`.

### Forbidden-field gate

If **any** forbidden field key exists on the document, **anonymous read is denied** (even if visibility flags are true). Owner and Phase-1 admin may still read for remediation.

---

## 3. Ownership contract

### Canonical anchors (required, immutable on update)

| Field | Rule |
|-------|------|
| `perfilId` | = document ID |
| `ownerUid` | = Auth uid of owner |
| `usuarioId` | = same as `ownerUid` |
| Equality | `ownerUid == usuarioId` always |

### `isPerfilOwner(perfilId)` precedence

1. **Direct:** `resource.data.ownerUid == request.auth.uid` (no `get()`)
2. **Bridge (transitional, one `get()` on hub):** only if direct match fails
   - **Nested (BLK-01 ETL):** `usuarios/{auth.uid}.perfil.perfilPrincipalId == perfilId` OR `perfilId in perfil.perfilIds[]`
   - **Flat (TICKET-003):** `perfilId in perfilesDetalle` AND (`perfilActivoId == perfilId` OR entry exists in `perfilesDetalle`)
3. **`perfilesVinculados` alone:** **NEVER** sufficient — must corroborate via `perfilesDetalle` or nested pointers

Bridge removal criteria: PO declares hub migration complete + reconcile shows 100% direct `ownerUid` ownership paths.

---

## 4. Forbidden-field denylist

Rules cannot redact. These keys MUST NOT exist on `perfiles/{perfilId}`:

`verificacion`, `ine`, `ineFrente`, `ineReverso`, `selfie`, `selfieVerificacion`, `documentos`, `documentosPrivados`, `documentosInternos`, `curp`, `rfc`, `fiscal`, `datosFiscales`, `cuentaBancaria`, `clabe`, `payment`, `pagos`, `contratos`, `tokens`, `secrets`, `token`, `refreshToken`, `apiKey`, `password`, `perfilesDetalle`, `perfilesVinculados`, plus KYC/fiscal/admin fields in contract module.

KYC remains on `usuarios/{uid}.verificacion` only.

---

## 5. Admin transition — Phase 1 deployable

### Phase 1 roles (rules)

| Role | Read | Write |
|------|------|-------|
| Legacy email admin | ✅ | ✅ status transitions |
| Custom claim `admin` / `super_admin` | ✅ | ✅ status transitions |
| Owner | ✅ own | ✅ public fields + `borrador↔pendiente` |
| Moderator / soporte / auditor / agente_ia / sistema | ❌ | ❌ |

Future RBAC roles: defined in `blk05-rbac-custom-claims-design.md` — enable in Phase 2 after claims CF.

### Owner transitions

- `borrador` → `pendiente`
- `pendiente` → `borrador`

### Admin transitions

- `borrador` → `pendiente`
- `pendiente` → `publicado` (must atomically set `estadoPublicacion='publicado'`, `visible`, `publicado`, `tienePerfilPublico` true; `suspendido` and `vencido` false — **enforced in rules via `perfilAdminPublishBundleValido()`**, BLK-05 W1)
- `pendiente` → `borrador`
- `publicado` → `suspendido`
- `suspendido` → `publicado`
- `vencido` → `publicado`
- any non-`eliminado` → `eliminado`
- `eliminado` → * (terminal — deny)

**Unresolved product decision (TBD-PD):** Owner `pendiente` → `borrador` after admin review started — allowed in Phase 1; confirm with PO.

### W1 — Admin publish bundle (closed in emulator rules)

When admin transitions **to** `publicado` (`pendiente`, `suspendido`, or `vencido` → `publicado`), rules require atomic bundle:

```
estadoPublicacion == 'publicado'
&& visible == true && publicado == true && tienePerfilPublico == true
&& suspendido == false && vencido == false
```

When admin transitions **to** `suspendido`, rules require:

```
estadoPublicacion == 'suspendido'
&& visible == false && publicado == false && tienePerfilPublico == false
&& suspendido == true
```

SSOT mirror: `scripts/lib/blk05-perfiles-contract.mjs` (`isAdminPublishBundle`, `validateAdminTransitionBundle`).

**Pre-deploy note:** W1 is closed in emulator/candidate rules only until `firestore.rules` deploy is authorized.

---

## 6. Rollback

| Action | Effect |
|--------|--------|
| Redeploy pre-BLK-05 `firestore.rules` | `perfiles/` denied by catch-all; `usuarios` unchanged |
| BLK-01 flags OFF | Legacy read path only |
| Data | Orphan `perfiles/` docs acceptable; no delete required for rollback |

Baseline hash: recorded in `scripts/blk05-rollback-manifest.json` at R1 completion.

---

## 7. Related documents

- `scripts/PLAN-CONSTRUCCION-BLK-01-MIGRACION-PERFILID.md` §2.5 (updated reference)
- `scripts/GAP-RULES-FIRESTORE-ALIGNMENT-v1.0.0.md`
- `scripts/README-BLK05-RULES-TESTS.md`
