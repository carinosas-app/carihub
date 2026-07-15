# Acta de cierre — PP-01 (contrato Registro ↔ mapToPerfil ↔ Perfil público)

| Campo | Valor |
|-------|-------|
| **Versión acta** | 1.0.0 |
| **Dominio** | Paridad Registro ↔ mapToPerfil ↔ Perfil público (443 subcategorías) |
| **Commit verificado** | `cea9c66` (branch `docs/phase-1-product-freeze`) |
| **Fecha de verificación** | 2026-07-14/15 |
| **Estado acta** | **CERRADA** |
| **Veredicto** | **APROBADO CON OBSERVACIONES** (17 gaps QA conocidos, no bloqueadores) |
| **Origen del mandato** | `docs/gpt-knowledge/PRODUCTO-FASE-1-MARKETPLACE.md` § "Orden de trabajo autorizado tras este freeze", punto 2 |

SSOT de detalle técnico (clusters, comandos, gates): [`scripts/qa-paridad-reg-pub/README.md`](./qa-paridad-reg-pub/README.md)

---

## Objeto

Cerrar formalmente PP-01 — el contrato de paridad **Registro → `mapToPerfil` → `buildUsuarioDoc` → slim → hydrate → Perfil público** — como válido para el marketplace de Fase 1, con evidencia objetiva de las 4 gates QA del pipeline `qa-paridad-reg-pub`.

Esta acta **no** autoriza cambios de código, schema, contratos ni scripts QA. Es un cierre **documental** sobre un estado ya verificado en el pipeline existente.

---

## Evidencia verificada (herramientas MCP / shell, sin re-ejecutar tras esta acta)

| Gate | Comando | Resultado |
|------|---------|-----------|
| Fase A — estático | `node scripts/qa-paridad-reg-pub-static.mjs` | **443/443** subcategorías con `resolveConfig`, 0 gaps `SUB_TO_PACK` ↔ schema-index, 5344 `FieldContracts` |
| Fase B — pipeline VM | `node scripts/qa-paridad-reg-pub-vm.mjs` | **426 PASS / 17 FAIL** · Field FAIL: 95 · **Privacy: 0** · **Bloqueadores: 0** |
| Integridad matriz PP-02 | `node scripts/qa-paridad-reg-pub/pp02-matrix-integrity.test.mjs` | **35 casos** · shells **8/8** · sectores **15/15** — PASS |
| Fase C — render strict (matriz) | `node scripts/qa-paridad-reg-pub-render.mjs --matrix --strict` | **35/35 PASS** · Presencia FAIL: 12 (no-bloqueador) · **Privacy DOM: 0** · **Runtime crashes: 0** · **Bloqueadores: 0** |

**Conclusión de evidencia:** los 4 números coinciden exactamente con el estado ya documentado en `scripts/qa-paridad-reg-pub/README.md` (tabla "PP-02 — launch matrix gates"). No hay regresión frente a la última verificación registrada en ese documento.

---

## Clasificación de hallazgos (17 FAIL de `parity.vm`)

Por regla de disciplina operativa, cada hallazgo se clasifica explícitamente. Ninguno es bloqueador de lanzamiento (0 privacy, 0 bloqueadores en las 4 gates).

| Nivel | Cluster | Subs (17 total) | Campos afectados |
|-------|---------|------------------|-------------------|
| **Importante** | Venue private | `antro restaurant bar`, `antro restaurant bar lgbt`, `cabinas glory holes`, `cine xxx`, `club sw`, `hotel motel`, `masajes`, `spa` (8) | `telefonoContacto`, `licenciaOperacion`, `documentos` — se pierden en `map`/`persist`/`hydrate` |
| **Importante** | `CANONICAL_ALIAS` | `edecan`, `modelos` (2) | Alias canónico no resuelto en pipeline mock |
| **Importante** | Retail private | `sex shop` (1) | Campo privado equivalente a venue |
| **Importante** | Automotriz pack D — gap cobertura QA | `instaladores-de-audio-car-multimedia`, `tecnicos-en-a-c-automotriz`, `tecnicos-en-baterias` (3) | Mock sin valor de prueba suficiente (mismo patrón que `refaccionarias`, ya corregido en PP-02) |
| **Importante** | Gastronomía alcohol private | `bares`, `cantinas-vinotecas`, `cervecerias` (3) | `permisoVentaAlcohol` / cadena private |

**Naturaleza del gap:** en los 5 clusters, el pipeline **no expone datos privados indebidamente** (0 privacy violations) — el defecto es que el campo esperado **no sobrevive** el round-trip `map → persist → hydrate` en el harness de prueba, o el mock QA no cubre el valor. Es deuda de **cobertura de contrato QA**, no una fuga de privacidad ni un bloqueador funcional.

**Precedente ya corregido:** `refaccionarias` / `lineasRefacciones` (18→17 FAIL) mediante `SUB_OVERRIDES` en PP-02 — mismo patrón aplicable a los 3 casos del cluster automotriz pendiente.

---

## Decisión de cierre

| Decisión | Valor |
|----------|-------|
| PP-01 (contrato Registro↔mapToPerfil↔Perfil público) | **CERRADO** — válido para Fase 1 Marketplace |
| Los 17 FAIL de `parity.vm` | **Backlog QA registrado** (nivel Importante) — no bloquean cierre ni lanzamiento |
| Ticket de seguimiento relacionado (independiente) | `docs/gpt-knowledge/TICKET-PERFIL-QA-SWINGER-CONTRATO-LEGACY.md` — contrato QA legacy swinger, no mezclar diffs |
| Próximo paso habilitado por este cierre | Directory Mode Phase B (hide/flags) — **requiere autorización explícita aparte**, no incluida en esta acta |

---

## Relación con actas previas

| Acta / documento | Relación |
|---|---|
| `ACTA-CONGELAMIENTO-PRODUCTO-FASE-1.md` | Define el mandato de cerrar PP-01 como paso P0 siguiente al freeze de producto |
| `docs/gpt-knowledge/PRODUCTO-FASE-1-MARKETPLACE.md` | Orden de trabajo autorizado — punto 2 satisfecho por esta acta |
| `scripts/qa-paridad-reg-pub/README.md` | SSOT técnico permanente de clusters, comandos y gates PP-01/PP-02 |
| PP-02 (`e4f1bbc`, `f289241`) | Launch matrix strict que valida el render de las 35 combinaciones frozen; base de la gate C de esta acta |

---

*Acta CERRADA — evidencia verificada por agente, sin cambios de código/schema. Sin merge ni deploy asociados a esta acta.*
