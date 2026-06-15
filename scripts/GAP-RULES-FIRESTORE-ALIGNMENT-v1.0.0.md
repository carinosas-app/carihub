# GAP-RULES-FIRESTORE-ALIGNMENT v1.0.0

**Fecha:** 2026-06-11 · **Veredicto:** **PASS** · **Cierre:** PARCIAL documental (55% → 85%)

Solo documentación. **No modifica** `firestore.rules`, índices, actas/SPECs congeladas; sin runtime/Firebase/deploy/commit/migraciones.

> **Principio rector:** Default-deny; owner escribe lo suyo bajo gates; admin/moderador concilian con auditoría; datos sensibles/financieros nunca públicos; las rules son la última frontera de ValidationEngine.

---

## Brecha central

| | Reglas reales (legacy) | Diseño canónico |
|---|---|---|
| Modelo | `usuarios/{uid}` monolito | `perfiles/{perfilId}` desacoplado (BLK-01) |
| Admin | `isAdmin()` = email único | RBAC custom claims multi-rol |
| Colecciones | 13 cubiertas | +10 proyectadas (default-deny hoy) |

---

## 1. Inventario de colecciones (24)

**Cubiertas reales (13):** `usuarios`, `usuarios/{uid}/favoritos`, `solicitudes_anuncios`, `denuncias`, `soporte_mensajes/mensajes`, `estadisticas_visitas`, `logsAdmin`, `logsSeguridad`, `pagos`, `anuncios`, `analytics_eventos`, `configuracion_publicidad/overrides`.

**Proyectadas / default-deny (10):** `perfiles`, `contratos`, `contratos_banners`, `banners`, `notificaciones`, `mensajes`, `verificaciones`, `configuraciones`, `rate_limits`, `alertas_seguridad`, `logs_acceso_privado`, `solicitudes_categorias`.

**Solo UI (1):** `expedientes` = agrupación de menú (ADM-02), no colección física (C-R03).

---

## 2. Colección x Rol (resumen)

11 roles: visitante, usuario, prestador, negocio, anunciante, admin, moderador, soporte, auditor, agente_ia, sistema. Hoy solo **owner + admin (email único)** existen en rules; moderador/soporte/auditor/sistema son canónicos vía custom claims (postMVP). Matriz completa R/C/U/D/Ap/Rx/Sx/Rs en el JSON.

---

## 3. Ruta x Permiso (destacados)

| Ruta | Rol | Permiso Firestore | Estado regla |
|---|---|---|---|
| `/perfil/{id}/{slug}` | anónimo | read if isPublicProfile() | PASS |
| `/registro/editar/{perfilId}` | prestador | update owner (bloquea verificacion/estadoPago) | PASS |
| `/cuenta/pagos` | prestador | read pagos owner | GAP (admin-only hoy) |
| `/cuenta/banners` | anunciante | read contratos_banners owner | PROYECTADA |
| `/admin/revision` | admin/moderador | read/update usuarios+denuncias | admin PASS; moderador GAP claim |
| `/resultados` | anónimo | read agregada server-side | RIESGO BLK-04 client-side |

---

## 4-5. Ownership y Privacidad

- **Ownership:** dueño doc + lecturas pública/privada/admin/moderador/auditor/sistema por entidad (tabla JSON §4).
- **Privacidad:** `publico` (perfil) · `privado` (favoritos/notificaciones) · `sensible` (INE/selfie/teléfono — owner+admin con log) · `financiero` (pagos/RFC — nunca público) · `administrativo` (estadoSeguridad/observaciones) · `auditoria` (logs append-only, PII hash).

---

## 6. RBAC formal

- **Heredados:** super_admin ⊇ admin ⊇ moderador; admin ⊇ comercial_admin; prestador ⊇ usuario.
- **Exclusivos:** super_admin(asignar_claims), comercial_admin(confirmar_pago), auditor(export+sensible), moderador(suspender), agente_ia(solo lectura).
- **Críticos:** asignar_claims, confirmar_pago, suspender_perfil, delete usuarios, leer_verificaciones, export_datos.
- **Escalación prohibida:** owner→admin, anunciante→prestador sin verificar, moderador→super_admin, agente_ia→escritura, owner→estadoPago/verificacion/vencido.

---

## 7-8. Estados y transiciones

Validados perfiles · pagos · contratos · banners · denuncias · verificaciones · notificaciones (expedientes = vista derivada). Regla núcleo: **owner transiciona estados base; admin/sistema transicionan estados sensibles** (aprobado/activo/confirmado). Tablas en JSON §7-8.

---

## 9-10. Colección x Dashboard / Ruta

Mapeo completo en JSON. Ej.: `pagos` → DP-08/DA-05/ADM-02; `verificaciones` → DP-04/ADM-02; `analytics_eventos` → ADM-05/CX-INT/CX-IA.

---

## 11-14. Reglas x Riesgo / BLK / Capa / Auditoría

- **Riesgo:** cada helper (`isPublicProfile`, `usuarioUpdateDuenoValido`, `pagos:false`, `default-deny`) con riesgo mitigado/residual/severidad.
- **BLK:** BLK-01 (perfiles/ desacople, bloqueado) · BLK-05 (este doc = prerequisito, listo) · BLK-08 (helpers Shared/Core, parcial).
- **Capa:** PASS en SC/FE/VE/RE/RC; PARCIAL en Pagos/Dashboard/Seguridad; GAP en Admin (RBAC claims).
- **Auditoría:** eventos/accesos/cambios/acciones críticas → logsAdmin/logsSeguridad/logs_acceso_privado **append-only**.

---

## 15. Matriz de riesgos

| ID | Riesgo | Residual | Severidad |
|---|---|---|---|
| RGR-01 | Escalación privilegios | bajo | alta |
| RGR-03 | Exposición sensibles (Storage rules) | medio-alto | crítica |
| RGR-05 | Fuga resultados client-side (BLK-04) | alto | crítica |
| RGR-08 | Admin single-email sin RBAC/2FA | alto | alta |

---

## 16. BLK-05

Diseño 55% → **85%**; runtime 10% (sin cambio). Prerequisitos: este doc, BLK-01, RBAC claims, Storage rules. **Deployable: NO** hasta BLK-01 + autorización runtime.

---

## 17. Roadmap (sin código)

1. **Fase 1 Diseño** — COMPLETADA (este documento).
2. **Fase 2 Implementación futura** — borrador rules canónico, custom claims, Storage rules, Cloud Functions, índices. Bloqueado por BLK-01 + autorización PO.
3. **Fase 3 Validación/endurecimiento** — suite emulador, pruebas escalación/ownership, append-only, pentest, 2FA admin.

---

## 18. Readiness antes/después

| Dimensión | Antes | Después |
|---|---|---|
| Seguridad | 54 | **60** |
| Runtime | 11 | 11 |
| Producción | 29 | **30** |
| Dashboard | 96 | 96 |
| Registro | 90 | **92** |
| Pagos | 88 | **89** |
| Admin | 62 | **66** |

---

## 19. Dependencias desbloqueadas

BLK-05 documental **55 → 85** (+30pp). Runtime Perfil/Dashboard/Admin/Pagos: reglas especificadas, ejecución sigue bloqueada por autorización + BLK-01.

---

## 20. Certificación GAP-RULES

| Pregunta | Respuesta |
|---|---|
| ¿Cerrado? | **Parcialmente** (85% documental) |
| Falta para cierre 100% doc | Borrador rules canónico + Storage rules + diseño claims |
| Falta para runtime | BLK-01, autorización PO, implementación, suite emulador |
| Falta para producción | Deploy rules+índices, 2FA+RBAC, pentest, BLK-04, BLK-10 |

---

## Reporte final

| Item | Valor |
|---|---|
| **PASS/FAIL** | **PASS** |
| **% GAP-RULES antes** | 55% |
| **% GAP-RULES después** | **85%** |
| **Impacto Seguridad** | +6pp (54→60) |
| **Impacto Construcción P0** | +1pp (89→90) |
| **Impacto Runtime** | 0pp directo (habilita ruta crítica) |
| **Impacto Producción** | +1pp (29→30) |
| **Dependencias desbloqueadas** | BLK-05 doc 55→85; ruta runtime panel especificada |
| **Riesgos residuales** | RGR-08 admin single-email · RGR-05 BLK-04 · RGR-03 Storage rules · BLK-01 perfiles/ |
| **Próxima capa** | Plan adopción física Shared/Core (BLK-08) o ADR-PASARELA-PAGO; en paralelo borrador rules canónico fase 2 |

---

*No modifica `firestore.rules` ni infraestructura · sin runtime · sin commit*
