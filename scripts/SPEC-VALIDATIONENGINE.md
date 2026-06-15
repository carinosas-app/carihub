# Especificación técnica — ValidationEngine

| Campo | Valor |
|-------|-------|
| **Versión spec** | 1.0.0 |
| **Fecha** | 2026-06-09 |
| **Estado** | **CONGELADO** v1.0.0 |
| **Implementación** | **NO autorizada** |
| **Acta** | [`ACTA-CONGELAMIENTO-VALIDATIONENGINE.json`](./ACTA-CONGELAMIENTO-VALIDATIONENGINE.json) |

Contrato máquina: [`SPEC-VALIDATIONENGINE.json`](./SPEC-VALIDATIONENGINE.json)  
Fixtures: [`fixtures-validationengine-golden.json`](./fixtures-validationengine-golden.json)  
Registry EventBus: [`registry-validationengine-eventos.json`](./registry-validationengine-eventos.json)  
Auditoría final: [`AUDITORIA-FINAL-SPEC-VALIDATIONENGINE.md`](./AUDITORIA-FINAL-SPEC-VALIDATIONENGINE.md)

---

## 1. Propósito

**ValidationEngine** es el puente entre las **cinco capas congeladas** y cualquier implementación futura (wizard, dashboards, admin, Messenger, Storage). Valida **acciones** antes de persistencia: Turnstile, Auth, rate limits, valores de campos, estados, permisos dashboard, uploads media; y emite el **EventBus canónico** hacia notificaciones, historial, logs de seguridad e `ia_recomendaciones`.

| Hace | No hace |
|------|---------|
| Autorizar o rechazar acciones | Resolver schema (FieldEngine) |
| Validar valores vs `ResolvedRegistrationSchema` | Renderizar UI (RenderEngine) |
| Verify Turnstile server-side | Escribir Firestore/Storage (ejecutor futuro) |
| Rate limits y gates estado | Stories / en vivo (observación Interacciones v1.2.1) |
| Emitir `EventoCanonico` | Modificar catálogo o precios |

### Dependencias congeladas

| Capa | Versión |
|------|---------|
| Catálogo | `catalogo-2026-06-10` @ 1.0.0 |
| Cuentas | `cuentas-2026-06-10` @ 1.0.0 |
| Seguridad MVP | `seguridad-2026-06-10` @ 1.0.0 |
| FieldEngine | `fieldengine-2026-06-10` @ 1.0.1 |
| Dashboards | `dashboards-2026-06-10` @ 1.0.0 |

**Referencia futura (fuera de alcance):** [`OBSERVACION-ARQUITECTONICA-INTERACCIONES.json`](./OBSERVACION-ARQUITECTONICA-INTERACCIONES.json) v1.2.1

---

## 2. API pública

### 2.1 `validateAction(context)` — pipeline principal

**Entrada `ValidationContext`:**

```typescript
{
  accion: ValidationAction;
  usuarioId: string;
  turnstileToken?: string | null;
  idToken?: string;           // Firebase Auth — acciones autenticadas
  ipHash: string;
  deviceIdHash?: string | null;
  fieldEngineContext?: FieldEngineContext;
  values?: Record<string, unknown>;
  resolvedSchema?: ResolvedRegistrationSchema;  // opcional si FE ya resolvió
  cuenta: CuentaContext;
  seguridad: SecurityContext;
  mensajeria?: MensajeriaContext;
  perfil?: PerfilContext;
  dashboardContext?: "admin" | "shell_cuenta" | "shell_perfil" | "shell_banners";
  media?: MediaUploadDescriptor;  // si upload
  metadata?: Record<string, unknown>;
}
```

**Salida éxito `ValidationResult`:**

```typescript
{
  ok: true;
  accion: string;
  validationId: string;       // uuid — trazabilidad
  gates: SecurityGateResult[];
  fieldErrors: [];            // vacío si ok
  eventoCanonico?: EventoCanonico;
  persistenciaAutorizada: boolean;  // diseño — ejecutor futuro
  meta: { validatedAt: ISO8601; schemaVersion: string };
}
```

**Salida error `ValidationError`:**

```typescript
{
  ok: false;
  codigo: string;   // catálogo §10
  http: number;
  motivo: string;
  detalles?: unknown;
  retry: boolean;
}
```

### 2.2 Funciones auxiliares

| Función | Rol |
|---------|-----|
| `verifyTurnstile` | Cloud Function — secret server-side |
| `validateAuth` | Firebase Auth idToken + emailVerificado |
| `checkRateLimits` | `rate_limits/{bucketId}` diseño TTL |
| `validateFormulario` | Pre-check modo/formulario antes de FieldEngine |
| `validateFieldValues` | Valores vs `ResolvedRegistrationSchema` |
| `validateStates` | Matriz estados cuenta/seguridad/mensajería/publicación/revisión |
| `validateMedia` | MIME, tamaño, extensión, Storage path, peligrosos |
| `evaluateDashboardAction` | RBAC admin + owner checks shell |
| `validateIARecommendation` | Confirmación humana + re-validar acción sugerida |
| `emitEventoCanonico` | Fan-out notificación + historial + logs |

---

## 3. Algoritmo de validación (orden estricto)

1. `validateFormulario` — modo y contexto coherente  
2. `evaluateDashboardAction` — permisos shell/admin  
3. `validateAuth` — token Firebase si acción autenticada  
4. `verifyTurnstile` — si acción lo requiere (Seguridad MVP)  
5. `checkRateLimits` — dimensiones ip/usuario/email/dispositivo/perfil  
6. `validateStates` — seis estados + emailVerificado  
7. `FieldEngine.resolveRegistrationSchema` — si perfil/visitante y schema no provisto  
8. `FieldEngine.evaluateSecurityGates` — delegar gates 1.0.1  
9. `validateFieldValues` — tipos, obligatorios, coherencia, fotos min/max  
10. `validateMedia` — si acción incluye upload  
11. Reglas específicas acción (banner, denuncia, IA, renovar)  
12. Construir `fanOutPlan` desde [`registry-validationengine-eventos.json`](./registry-validationengine-eventos.json)  
13. `emitEventoCanonico` — ejecutar cada ítem (multi-destino)  
14. Retornar `ValidationResult` con `fanOutPlan` y `validationId`

### Reglas Auth / Turnstile (OB-VE1)

| Tipo acción | Auth paso 3 | Turnstile paso 4 |
|-------------|-------------|------------------|
| Anónimas (registro, login, denuncia…) | Omitir | Si aplica |
| Autenticadas (borrador, revisión, admin…) | **Obligatorio** | Solo si política extra (ej. crear banner) |

**Fallo temprano:** cualquier paso falla → `ValidationError` **sin** emitir evento.

---

## 4. Validación de formularios

| Modo / flujo | `formularioId` | `subcategoriaId` | Turnstile | Notas |
|--------------|----------------|------------------|-----------|-------|
| Registro perfil estándar | inferido mapa | **Obligatorio** | No en borrador | FieldEngine merge |
| `usuario_visitante` registro inicial | `usuario_visitante` | **Prohibido** | Sí | Fixture V07 |
| Upgrade visitante → perfil | `usuario_visitante` | **Obligatorio** | No | Contrato vigente; V08 si falta |
| `temporal_categoria_sugerida` | temporal | según mapa | Sí | Rate limit `categoria_sugerida` |
| Banner / anunciante | — | sector en payload | Sí crear | `solicitudes_anuncios` schema |
| Dashboard actions | — | — | No | RBAC + owner |

---

## 5. Validación de estados

| Campo | Valores |
|-------|---------|
| `estadoCuenta` | activa · suspendida · eliminada · pendiente_activacion |
| `estadoVerificacion` | sin_enviar · enviada · en_revision · aprobada · rechazada · vencida |
| `estadoSeguridad` | normal · observacion · restringido · suspendido · bloqueado |
| `estadoMensajeria` | habilitada · restringida · suspendida · solo_lectura |
| `estadoPublicacion` | borrador · publicado · activo · despublicado · vencido |
| `estadoRevision` | registro_pendiente · actualizacion_pendiente · aprobada · rechazada · sin_estado |

### Matriz acción × estado (resumen)

| Acción | Requisitos clave |
|--------|------------------|
| `guardar_borrador` | cuenta activa; seguridad normal/observacion/**restringido** (AM1) |
| `enviar_revision` | email verificado; seguridad normal/observacion |
| `crear_solicitud_banner` | email verificado; rol anunciante |
| `mensaje_enviar` | mensajería habilitada — hook futuro Messenger (V18) |
| Cualquiera | `bloqueado` / `suspendido` → denegado salvo excepciones admin |

---

## 6. Validación de seguridad

### Turnstile (server-side)

Acciones con Turnstile: login, registro, recuperación, reenvío email, registro visitante, crear banner, categoría sugerida, denuncia, contacto público.

**No** Turnstile: `guardar_borrador`, `enviar_revision` (usuario autenticado + rate limit edición).

### Firebase Auth

- `idToken` válido y `usuarioId` coincide con contexto  
- `emailVerificado` mirror `usuarios.seguridad` — gate revisión y comercial  

### Rate limits

Referencia: `config-seguridad-mvp-schema.json` → `antiSpam.limitesPorAccion`  
Almacenamiento diseño: `rate_limits/{bucketId}` con TTL.

### Owner checks

`perfil.usuarioId === context.usuarioId` para borrador, revisión, uploads, favoritos.

### RBAC admin

- Fase 1: email allowlist  
- Fase 2: custom claims  
- Reauth: delete usuario, cambio precio, export masivo  

---

## 7. Validación de campos

Entrada: `ResolvedRegistrationSchema` (FieldEngine) + `values`.

| Regla | Detalle |
|-------|---------|
| Obligatorios | Incluye anidados `geo.ciudad` |
| Tipos | email, text, number, boolean, geo, file, checklist |
| Coherencia | Reglas `si/entonces` del schema |
| Fotos | count entre `fotos.min` y `fotos.max` |
| Privacidad | `camposPrivados` no en payload público |
| Sanitización | HTML en textos públicos |
| Longitudes | `maxLength` del fieldRegistry |

---

## 8. Validación de archivos / media

| Tipo | MIME | Máx. bytes | Path diseño |
|------|------|------------|-------------|
| Foto perfil | jpeg, png, webp | 5 MB | `perfiles/{perfilId}/fotos/` |
| Video perfil | mp4, webm | 50 MB | `perfiles/{perfilId}/videos/` |
| Banner imagen | jpeg, png, webp, gif | 8 MB | `solicitudes_anuncios/{id}/creativos/` |
| Banner video | mp4, webm | 100 MB | idem |
| INE frente/reverso | jpeg, png | 10 MB | `perfiles/{perfilId}/verificacion/ine_*` |
| Selfie verificación | jpeg, png | 8 MB | `.../verificacion/selfie/` |
| Comprobante | jpeg, png, pdf | 10 MB | `pagos|contratos_perfiles/.../comprobantes/` |

**Rechazo:** ejecutables, scripts, doble extensión, path traversal, MIME/extension mismatch.

**Fuera de alcance:** media Stories / en vivo — observación Interacciones v1.2.1.

---

## 9. Validación de acciones

| Acción | Resumen |
|--------|---------|
| `guardar_borrador` | Gates + campos + owner |
| `enviar_revision` | + email verificado + historial + notif admin |
| `editar_perfil` | Alias borrador si revisión pendiente |
| `actualizar_perfil_publicado` | Campos públicos limitados |
| `renovar_contrato` | Contrato perfil/banner + historial renovaciones |
| `crear_solicitud_banner` / `editar_banner` | Turnstile crear; owner solicitud |
| `categoria_sugerida` | Modo temporal + Turnstile |
| `ia_aceptar_recomendacion` | Confirmación humana + re-validateAction |

---

## 10. EventBus canónico (OB-VE2–4)

Un **`fanOutPlan[]`** post-validación exitosa alimenta cada destino. Registry: [`registry-validationengine-eventos.json`](./registry-validationengine-eventos.json) (39 acciones).

**`enviar_revision`** — 3 ítems: `historial_perfil.enviado_revision` + `historial_actividad_cuenta.perfil_enviado_revision` + notificación **admin** `verificaciones.verificacion_recibida` → `cola_revision` / `notificaciones_admin` (Dashboards §14). **Sin** notificación al usuario.

Destinos:

| Destino | Cuándo |
|---------|--------|
| **Notificaciones** | `emitirNotificacion=true` → `usuarios/{id}/notificaciones/` |
| **Historial** | `emitirHistorial=true` → dominio (perfil, banners, cuenta, IA…) |
| **logsSeguridad** | login, rate_limit, denuncia, admin, acceso_privado |
| **ia_recomendaciones** | aceptar/rechazar recomendación |

Campos: `eventoId`, `usuarioId`, `dominio`, `tipoEvento`, `entidadTipo/Id`, `actorId`, `accionOrigen`, `validationId`, `metadata`, `createdAt`, prioridad.

Referencia dominios: **SPEC-DASHBOARDS** §14 notificaciones, §15 historial.

---

## 11. Errores y códigos (OB-VE5)

### Gates vs estados

| Código | Origen | Cuándo |
|--------|--------|--------|
| `GATE_SEGURIDAD_DENEGADO` | FieldEngine `evaluateSecurityGates` | Acción vs política schema (paso 8) |
| `ESTADO_SEGURIDAD_DENEGADO` | `validateStates` | `estadoSeguridad` fuera de matriz (paso 6) |
| `ESTADO_CUENTA_INVALIDO` | `validateStates` / `validateAuth` | Cuenta no activa o Auth disabled |
| `EMAIL_NO_VERIFICADO` | `validateStates` / `validateAuth` | Seguridad MVP restricciones sin verificar |

Catálogo completo: JSON § `errores` y `guiaErrores`.

---

## 12. Golden fixtures

18 casos en [`fixtures-validationengine-golden.json`](./fixtures-validationengine-golden.json): borrador restringido (V01), revisión ok/denegada (V02–V03), Turnstile/rate limit (V05–V06), visitante/upgrade (V07–V08), banner, owner, media, IA, admin, renovar, coherencia, mensajería futura.

---

## 13. Fuera de alcance v1.0.0

- Runtime Cloud Functions / Callable  
- Cambios Firestore rules  
- Persistencia post-validación  
- Stories, comentarios, en vivo, seguidores  
- Messenger runtime  
- RenderEngine implementación  
- Migración `usuarios` monolito → `perfiles/{perfilId}`  

---

## 14. Congelamiento

| Veredicto | Detalle |
|-----------|---------|
| **Congelamiento** | **APROBADO** — 2026-06-09 |
| **OB-VE1–5** | **Cerrados** |
| **Acta** | [`ACTA-CONGELAMIENTO-VALIDATIONENGINE.json`](./ACTA-CONGELAMIENTO-VALIDATIONENGINE.json) — **CONGELADO** |

---

*Solo diseño y documentación — sin runtime, Firestore, producción, deploy ni commit.*
