# Acta formal de congelamiento — Registro-Cuenta CariHub

| Campo | Valor |
|---|---|
| **Versión acta** | 1.0.0 |
| **Versión Registro-Cuenta** | `registro-cuenta-2026-06-11` @ **1.0.0** |
| **Fecha congelamiento** | 2026-06-11 |
| **Estado** | **CONGELADO** |
| **Veredicto final** | **PASS** (17/17 validación acta; 20/20 auditoría SPEC) |
| **¿Procede congelamiento?** | **SÍ** (diseño documental) |
| **Modo** | Solo documentación — **sin runtime/Firestore/deploy/commit; no modifica documentos existentes** |

Canónico: [`ACTA-CONGELAMIENTO-REGISTRO-CUENTA.json`](./ACTA-CONGELAMIENTO-REGISTRO-CUENTA.json)

Baseline: [`SPEC-REGISTRO-CUENTA.md`](./SPEC-REGISTRO-CUENTA.md) · [`fixtures-registro-cuenta-golden.json`](./fixtures-registro-cuenta-golden.json) · [`AUDITORIA-SPEC-REGISTRO-CUENTA.md`](./AUDITORIA-SPEC-REGISTRO-CUENTA.md)

---

## Autorización

- **Estado:** APROBADA por product owner / usuario CariHub (2026-06-11).
- **Alcance:** baseline de **diseño** Registro-Cuenta v1.0.0 — referencia **obligatoria** para implementación futura de registro, autenticación, perfiles, negocios, profesionales, anunciantes, verificación, publicación y dashboard mínimo operativo.
- **Runtime:** NO autorizado en este congelamiento.

---

## ¿Capa Registro-Cuenta oficialmente congelada?

**Respuesta global: PARCIALMENTE**

| Ámbito | ¿Congelado? | Detalle |
|---|---|---|
| Diseño/arquitectura documental v1.0.0 | **SÍ** | SPEC + fixtures + políticas = fuente oficial de verdad |
| Runtime / producción / migración ejecución | **NO** | Requiere autorización explícita posterior |

**Justificación:** auditoría PASS 90% sin bloqueantes; SPEC y fixtures completos; dependencias compatibles; pero runtime no autorizado, migración TBD_PRE_RUNTIME, validador script pendiente, recuperación contraseña prod faltante.

---

## Veredicto y métricas

| Métrica | Valor |
|---|---|
| Completitud | ~90% |
| Madurez diseño | ~88% |
| Readiness construcción | ~76% |
| Readiness MVP (capa Registro) | ~70% |
| Readiness producción | ~30% |
| GAP-SPEC-REG | **cerrado** |

---

## Documentos fuente validados

| Documento | Resultado |
|---|---|
| PLAN-MAESTRO-REGISTRO-CUENTA v1.0.0 | PASS |
| SPEC-REGISTRO-CUENTA v1.0.0 | PASS |
| AUDITORIA-SPEC-REGISTRO-CUENTA v1.0.0 | PASS (20/20) |
| fixtures-registro-cuenta-golden.json (RC-01..RC-10) | PASS |
| FieldEngine 1.0.1 | PASS (consumo) |
| ValidationEngine 1.1.0 | PASS (consumo) |
| Seguridad MVP 1.0.0 | PASS |
| Shared/Core 1.0.0 | PASS |
| RenderEngine 1.0.0 | PASS |
| SEO-Landings 1.0.0 | PASS |
| ACTA-P0 Runtime Foundation | PASS (GAP-SPEC-REG cerrado) |
| ACTA-CUENTAS 1.0.0 | PASS (frontera hub vs flujos) |
| ACTA-DASHBOARDS 1.0.0 | PASS (DM-01..10) |
| ACTA-MIGRACION-USUARIOS-PERFILES | PASS (bridge MVP) |
| AUDITORIA-MAESTRA / MATRIZ-MVP / ROADMAP | PASS (coherencia) |

**Bloqueantes documentales:** 0

---

## Alcance congelado

### Registro
- **Usuario:** visitante, adulto, independiente, profesionista, empresa, anunciante
- **Perfil:** acompañantes, modelos, masajistas, independientes, profesionistas (462 subcategorías vía catálogo)
- **Negocio:** hotel, motel, spa, sex shop, restaurante, bar, antro
- **Profesional:** abogado, contador, médico, etc. (cedula)
- **Anunciante:** banners; perfil público opcional

### Cuenta
Login, logout, recuperación, cambio contraseña, verificación email, sesiones, bloqueo, reactivación.

### Perfil
Creación wizard, edición, publicación vía snapshot, renovación delegada (Pagos), suspensión, archivado, eliminación lógica.

### Verificación
Correo, INE frente/reverso, selfie, cédula profesional (condicional), revisión admin, observacionesAdmin.

### Dashboard mínimo (frontera)
- **Registro:** DM-01 editar info, DM-02 editar fotos
- **Dashboard:** DM-03..10 lectura (estado, vigencia, pagos, renovación, verificación, contacto, observaciones)

### Reglas congeladas clave
- Consume FieldEngine / ValidationEngine / Shared/Core — no reimplementa
- Documentos verificación **nunca** en snapshot (PrivacyGuard)
- `enviar_revision` bloqueado sin email verificado
- Nunca auto-publicar ni auto-activar
- Rutas `/cuenta` `/registro` **noindex,nofollow**
- Bridge MVP: `perfilId = usuarioId`

---

## Alcance NO congelado

- Runtime, Firestore, deploy
- Migración ejecución (TBD_PRE_RUNTIME)
- Teléfono OTP, RFC, domicilio fiscal
- Multi-perfil operativo 1:N
- Validador `validar-spec-registro-cuenta.mjs`
- Eliminación física, dispositivos confianza

---

## Dependencias congeladas

| Dependencia | Versión | Rol | Contradicciones |
|---|---|---|---|
| Shared/Core | 1.0.0 | clients, catalog, geo | ninguna |
| FieldEngine | 1.0.1 | schema, snapshotAlPublicar | ninguna |
| ValidationEngine | 1.1.0 | gates acciones | ninguna |
| RenderEngine | 1.0.0 | snapshot público, PrivacyGuard | ninguna |
| Seguridad MVP | 1.0.0 | Turnstile, rate limits | ninguna |
| Dashboards | 1.0.0 | DM-03..10 lectura | ninguna |
| SEO-Landings | 1.0.0 | rutas privadas noindex | ninguna |
| ACTA-CUENTAS | 1.0.0 | hub identidad (CU ≠ flujos RC) | ninguna |
| Catálogo | 1.0.0 | 462 subcategorías | ninguna |

---

## Contratos congelados (9)

| Contrato | v | Madurez | Estabilidad | Extensibilidad futura |
|---|---|---|---|---|
| Usuario | 1.0.0 | alta | congelada diseño | perfilIds[], wallet puntero |
| Cuenta | 1.0.0 | alta | congelada diseño | OTP, MFA |
| Perfil | 1.0.0 | alta | congelada diseño | premium flags, campos FE |
| Negocio | 1.0.0 | alta | congelada diseño | multi-sucursal |
| Profesional | 1.0.0 | alta | congelada diseño | KYC ampliado |
| Anunciante | 1.0.0 | alta | congelada diseño | multi-marca |
| DocumentoVerificacion | 1.0.0 | alta | congelada diseño | nuevos tipos vía ADR |
| EstadoPerfil | 1.0.0 | alta | congelada diseño | schema estados versionado |
| SnapshotPublicacion | 1.0.0 | alta | congelada diseño | version++, i18n slug |

---

## Matrices congeladas (12)

`tipoRegistroCampos`, `tipoRegistroDocumentos`, `rolPermisos`, `estadoAcciones`, `flujoEventos`, `campoClasificacion`, `pantallaRuta`, `errorMensaje`, `documentoValidacion`, `cambioRevisionRequerida`, `usuarioPerfil`, `perfilPublicacion`

### Matrices analíticas (acta)

- **Evolución futura:** contratos extensibles; Economía Social, Propinas, Premium, Messenger, IA, MultiPerfil vía extensión sin reconstrucción
- **Ownership:** propietario/admin/sistema por entidad; lectura/escritura/aprobación/suspensión
- **Privacidad:** público/privado/sensible/legal/auditoría; PrivacyGuard PASS
- **Revisión admin:** perfil/negocio/profesional requieren revisión; anunciante deriva Banners
- **Publicación:** ciclo completo borrador→activo→vencido; transiciones válidas/inválidas

---

## Bridge usuario → perfil

| Fase | Regla |
|---|---|
| **MVP congelado** | `perfilId = usuarioId` (1:1) |
| Futuro | `usuario.perfilIds[]` (1:N) — requiere ADR |
| Legacy | Lectura dual durante migración ACTA-MIGRACION |
| Fixture | RC-09 |

---

## Readiness de construcción

| Dimensión | Antes SPEC | Después acta |
|---|---|---|
| Documental | ~55% | ~90% |
| Arquitectura diseño | ~55% | ~88% |
| Contratos | ~50% | ~92% |
| Validación (fixtures) | ~40% | ~85% |
| Seguridad integración | ~53% | ~80% |
| Publicación | ~60% | ~88% |
| Dashboard frontera | ~53% | ~75% |
| Integración motores | ~70% | ~86% |

**Agregados:** construcción ~76% · MVP Registro ~70% · producción ~30%

---

## Impacto ACTA-P0 (recálculo documental)

| Métrica | Antes | Después |
|---|---|---|
| CAP-11 Registro-Cuenta | 55% (PLAN+schemas) | ~90% (CONGELADO_DISENO) |
| GAP-SPEC-REG | abierto | **cerrado** |
| % global P0 construcción | 72% | ~78% |
| Bloqueadores | incluye GAP-SPEC-REG | GAP-SPEC-REG removido; BLK-01 migración persiste |

*Nota: ACTA-P0 no modificada; recálculo declarado en esta acta.*

---

## Riesgos

### Aceptados (con mitigación congelada)
- Bridge MVP 1:1 → perfilIds[] futuro
- Sin teléfono OTP MVP → email + Turnstile + V1.1
- Legacy monolito → lectura dual ACTA-MIGRACION

### Abiertos
- Migración TBD_PRE_RUNTIME (BLK-01)
- Validador script (RC-AM-02)
- Recuperación contraseña prod
- Firestore rules (BLK-05)
- Multi-perfil operativo (ADR futuro)

### Clasificación
- **Alto:** privacidad (RC-R01), monolito (RC-R02), auth Home (RC-R03), fraude verificación
- **Crítico (construcción):** BLK-01 migración sin runtime

---

## Gobernanza de cambios

| Tipo | Ejemplos |
|---|---|
| **Sin ADR** | Fixtures, validador script, clarificaciones PATCH |
| **Requiere ADR** | Multi-perfil 1:N, OTP obligatorio, eliminación física |
| **Requiere SPEC** | Wallet/cripto registro, KYC internacional |
| **Requiere Acta** | SPEC-REGISTRO-CUENTA 1.1+ / 2.0+, cambio bridge MVP |

---

## Compatibilidad futuro ecosistema

Registro-Cuenta soporta **sin reconstrucción arquitectónica:** Economía Social, Propinas, Wallet, Cripto, Premium, Stories, Lives, Red Contactos, Messenger, IA, Marketplace, i18n, multi-moneda/país/idioma — vía extensión de contratos, roles y punteros `usuarioId`/`perfilId`.

---

## Recomendación siguiente capa

1. **SPEC-PAGOS-CONTRATOS** — GAP-SPEC-PAY (MVP-COBRAR)
2. **Runtime migración bridge perfilId** — BLK-01 (RD-01)
3. **validar-spec-registro-cuenta.mjs** — RC-AM-02
4. **SPEC-PANEL-DASHBOARD-MINIMO** — GAP-PANEL-DASH

---

## Referencias

- [`ACTA-CONGELAMIENTO-REGISTRO-CUENTA.json`](./ACTA-CONGELAMIENTO-REGISTRO-CUENTA.json)
- [`SPEC-REGISTRO-CUENTA.json`](./SPEC-REGISTRO-CUENTA.json)
- [`AUDITORIA-SPEC-REGISTRO-CUENTA.json`](./AUDITORIA-SPEC-REGISTRO-CUENTA.json)
- [`fixtures-registro-cuenta-golden.json`](./fixtures-registro-cuenta-golden.json)
- [`PLAN-MAESTRO-REGISTRO-CUENTA.json`](./PLAN-MAESTRO-REGISTRO-CUENTA.json)
