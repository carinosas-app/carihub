# SPEC-REGISTRO-CUENTA v1.0.0

**Fecha:** 2026-06-11 · **Estado:** DISEÑO INICIAL · **Implementación autorizada:** NO  
**Modo:** Solo análisis, especificación, fixtures, auditoría y documentación. No runtime · no modifica planes/schemas/actas existentes.

> **Principio rector:** Registro/Cuenta es la capa de **IDENTIDAD y ONBOARDING**. Consume FieldEngine (campos), ValidationEngine (gates/valores), Shared/Core (clientes) y Seguridad MVP. **No** renderiza superficies públicas. **No** reimplementa reglas de motores congelados.

**Cierra:** GAP-SPEC-REG (ACTA-CONGELAMIENTO-P0-RUNTIME-FOUNDATION, CAP-11)

---

## 1. Fronteras del módulo

| Módulo | Responsabilidad Registro/Cuenta | Delegado a |
|---|---|---|
| Auth y cuenta | Login, logout, alta, recuperación, sesiones | Firebase Auth + ValidationEngine |
| Wizard perfil | Campos, fotos, componentes UI | FieldEngine |
| Verificación | INE, selfie, email | Storage + Admin + ValidationEngine |
| Estados pre-publicación | Borrador → revisión → activo | config-estados-revision-publicacion |
| Publicación | Trigger snapshotAlPublicar | FieldEngine AM3 → RenderEngine |
| Panel mínimo | DM-01/02 edición | Registro `/registro/editar` |
| Métricas/renovación | DM-03..10 lectura | Dashboard Framework |

**Fuera de alcance:** render público (RenderEngine), cobros (Pagos), campañas banner (Banners), moderación admin completa (Admin).

---

## 2. Tipos de registro

| Tipo | Formulario / Schema | Perfil público |
|---|---|---|
| Visitante | `usuario_visitante` | No |
| Adultos / acompañantes / modelos / masajistas | `adultos` + mapa 462 subcategorías | Sí |
| Independientes | `persona_independiente` | Sí |
| Profesionistas | `profesionista_cedula` | Sí |
| Negocios (hotel, spa, bar…) | `negocio_empresa` | Sí |
| Anunciante | Rol `anunciante` | No (opcional) |

Resolución de formulario: `mapa-registro-categorias.json` → `subcategoriaId` → `formularioId` (FieldEngine).

---

## 3. Flujos principales

### 3.1 Alta de cuenta

```
Visitante → /cuenta/crear → Firebase Auth → usuarios/{uid}
         → sendEmailVerification → estado pendiente_activacion
         → wizard /registro/wizard (FieldEngine)
```

### 3.2 Wizard y envío a revisión

```
guardar_borrador (VE) → perfiles/{perfilId} borrador
enviar_revision (VE) → precondiciones: emailVerificado + campos + docs
                      → enviado_revision → notif admin
```

### 3.3 Verificación documental

```
/registro/verificacion → subir INE frente/reverso + selfie
                      → estados: pendiente → subido → en_revision
                      → admin aprueba/rechaza + observacionesAdmin
```

### 3.4 Publicación

```
Admin aprueba → publicado|activo
             → FieldEngine.snapshotAlPublicar
             → RenderEngine consume snapshot (PrivacyGuard)
```

### 3.5 Edición post-publicación

```
/registro/editar/{perfilId} → cambio camposImportantes
                           → actualizacion_pendiente
                           → snapshot público NO actualiza hasta re-aprobación
```

---

## 4. Bridge usuario ↔ perfil

| Fase | Regla | Colección |
|---|---|---|
| **MVP** | `perfilId = usuarioId` | `perfiles/{perfilId}` + hub `usuarios/{usuarioId}` |
| Futuro | `usuario.perfilIds[]` (1..N) | Multi-perfil, multi-marca anunciante |
| Legacy | Lectura dual durante migración | ACTA-MIGRACION-USUARIOS-PERFILES |

---

## 5. Ciclo de vida (estados)

Fuente única: `config-estados-revision-publicacion-schema.json`.

**Estados perfil:** borrador → enviado_revision → correccion_solicitada → publicado → activo → vencido | suspendido | rechazado | archivado.

**Transiciones críticas:**
- `borrador → enviado_revision`: usuario + gates VE
- `enviado_revision → publicado`: admin (primer mes gratis adultos)
- `enviado_revision → autorizado_para_pago`: admin (negocios)
- `activo → vencido`: sistema (contrato vencido)
- **Nunca** auto-publicar ni auto-activar sin admin/pago

---

## 6. Clasificación de datos

| Nivel | Ejemplos | Público |
|---|---|---|
| Público | alias, geo, fotoPrincipal, WhatsApp | Sí (snapshot) |
| Privado | email, teléfono contacto | No |
| Sensible | INE, selfie, RFC | **Nunca** |
| Administrativo | estadoRevision, observacionesAdmin | Admin only |
| Auditoría | historial_perfil, logsAdmin | Append-only |

PrivacyGuard (RenderEngine) filtra sensible/privado del snapshot.

---

## 7. Dashboard mínimo operativo (frontera)

| ID | Widget | Ubicación | Clasificación |
|---|---|---|---|
| DM-01 | Editar información | Registro `/registro/editar` | MVP_obligatorio |
| DM-02 | Editar fotografías | Registro `#fotos` | MVP_obligatorio |
| DM-03 | Estado aprobación | Dashboard | MVP_obligatorio |
| DM-04 | Vigencia plan | Dashboard | MVP_obligatorio |
| DM-05 | Pagos realizados | Dashboard | MVP_obligatorio |
| DM-06 | CTA renovación | Dashboard | MVP_obligatorio |
| DM-07 | Estadísticas básicas | Dashboard | MVP_recomendado |
| DM-08 | Estatus verificación | Dashboard | MVP_obligatorio |
| DM-09 | Contacto activo | Dashboard | MVP_obligatorio |
| DM-10 | Observaciones admin | Dashboard | MVP_obligatorio |

Referencia: `ANALISIS-REVISION-MVP-DASHBOARD.json`.

---

## 8. Matrices obligatorias (12)

1. `tipoRegistroCampos` — campos por arquetipo
2. `tipoRegistroDocumentos` — docs requeridos
3. `rolPermisos` — acciones por rol
4. `estadoAcciones` — acciones por estado
5. `flujoEventos` — eventos del ciclo
6. `campoClasificacion` — público/privado/sensible
7. `pantallaRuta` — rutas `/cuenta/*`, `/registro/*`
8. `errorMensaje` — RC-E01..E06
9. `documentoValidacion` — formatos y límites
10. `cambioRevisionRequerida` — camposImportantes
11. `usuarioPerfil` — bridge MVP 1:1
12. `perfilPublicacion` — estado → público/snapshot

---

## 9. Contratos (9)

`Usuario`, `Cuenta`, `Perfil`, `Negocio`, `Profesional`, `Anunciante`, `DocumentoVerificacion`, `EstadoPerfil`, `SnapshotPublicacion`.

Definición completa en `SPEC-REGISTRO-CUENTA.json` → sección `contratos`.

---

## 10. API lógica (contratos, no runtime)

| Operación | Delegación principal |
|---|---|
| `crearCuenta` | Firebase Auth + VE `registro_auth` |
| `login` | Firebase Auth + VE `login` |
| `iniciarWizard` | FieldEngine `resolveRegistrationSchema` |
| `guardarBorrador` | VE + Firestore `perfiles` |
| `enviarRevision` | VE gates |
| `subirDocumento` | VE `subir_verificacion_*` + Storage |
| `editarPerfil` | FieldEngine + VE `editar_perfil` |
| `obtenerEstadoCuenta` | Agregado cuenta + perfil + verificación |

---

## 11. Rutas y SEO

Todas las rutas `/cuenta/*` y `/registro/*` → **noindex,nofollow** (coherente SPEC-SEO-LANDINGS superficiesPrivadas).

---

## 12. Integraciones

| Motor congelado | Consume | No duplica |
|---|---|---|
| Shared/Core | initFirebase, clients, catalog, geo | ✓ |
| FieldEngine | resolveRegistrationSchema, snapshotAlPublicar | ✓ |
| ValidationEngine | acciones registro/perfil/verificación | ✓ |
| RenderEngine | recibe snapshot | rutas privadas |
| Seguridad MVP | Turnstile, rate limits, estadoSeguridad | ✓ |
| Dashboards | estado cuenta; CTA editar → Registro | ✓ |

---

## 13. Riesgos (RC-R01..07 + RC-SPEC-01)

- **RC-R01** Datos sensibles indexables → noindex + Storage protegido
- **RC-R02** Monolito usuarios/{uid} → bridge perfiles/{perfilId}
- **RC-R03** Auth embebido Home → app Registro separada
- **RC-R04** Teléfono/recuperación → SPEC incluye; teléfono V1.1
- **RC-R05** Solapamiento Registro/Dashboard → frontera DM
- **RC-R06** Reimplementar VE/FE → consumir clientes
- **RC-R07** Estados inconsistentes → config-estados única fuente
- **RC-SPEC-01** Migración TBD_PRE_RUNTIME → ACTA-MIGRACION

---

## 14. Criterios de aceptación

- CA-01: Toda acción pasa ValidationEngine
- CA-02: Wizard resuelve schema vía FieldEngine
- CA-03: Docs verificación nunca en snapshot público
- CA-04: `enviar_revision` bloqueado sin email verificado
- CA-05: Edición camposImportantes → actualizacionPendiente
- CA-06: snapshotAlPublicar al aprobar admin
- CA-07: Rutas privadas noindex
- CA-08: Bridge MVP perfilId=usuarioId
- CA-09: Fixtures RC-01..RC-10 PASS
- CA-10: Auditoría PASS sin bloqueantes

---

## 15. Referencias

- `scripts/SPEC-REGISTRO-CUENTA.json` — especificación formal
- `scripts/fixtures-registro-cuenta-golden.json` — golden fixtures RC-01..RC-10
- `scripts/AUDITORIA-SPEC-REGISTRO-CUENTA.json` — auditoría y veredicto
- `scripts/PLAN-MAESTRO-REGISTRO-CUENTA.json` — plan origen
- `scripts/ACTA-MIGRACION-USUARIOS-PERFILES.json` — bridge MVP
