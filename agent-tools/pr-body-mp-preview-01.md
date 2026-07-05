## Summary

- Cierra gap de preview iframe ruta B (`aplicarPerfilDesdeRegistro`) para `persona_lifestyle` / unicorns.
- Copia 9 campos lifestyle en el guard unicorn: `tipoUnicornio`, `tipoParejaPreferida`, `finalidadEncuentro`, `estadoPerfil`, `experiencia`, `ambientePreferido`, `estilo`, `serviciosLifestyle`, `unicornPerfil` (nested→plano).
- QA ampliado: `scripts/qa-unicorn-render.mjs` con asserts runtime ruta B (+18 checks).

Sin cambios en submit, Firestore, rules Firebase, `resultados-registrados.js` ni deploy.

Evidencia pre-merge: `node agent-tools/audit-unicorn-contract-pipeline.mjs` → Gaps preview iframe: **0** (antes 9).

## Test plan

- [ ] `node scripts/qa-unicorn-render.mjs`
- [ ] `node scripts/qa-unicorn-persist.mjs`
- [ ] `node scripts/qa-harden-01-cierre.mjs`
- [ ] `node scripts/validar-schemas-registro.mjs`
