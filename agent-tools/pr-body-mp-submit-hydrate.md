## Summary

- Hidrata `normalizarPerfilFirestore` en el read-path compartido usando `mapToPerfil(camposPublicos.bloquesPublicos, ctx)` cuando los scripts de bloques están cargados.
- Carga `carihub-registro-public-blocks.js` (y dependencias) en `resultados.html` y `perfil-publico.html` para activar la hidratación en producción.
- Perfil público: perfiles con `__hydratedFromBloques` usan `aplicarPerfilDesdeRegistro` + flags de perfil registrado (no preview).
- QA dedicado del pack: `scripts/qa-mp-submit-hydrate.mjs` (83 checks, 9 arquetipos nested + legacy + fallback).

Sin cambios en submit (`buildUsuarioDoc`), Firestore rules, Firebase deploy ni schema de persistencia.

## Test plan

- [ ] `node scripts/qa-mp-submit-hydrate.mjs`
- [ ] `node scripts/qa-harden-01-cierre.mjs`
- [ ] `node scripts/validar-schemas-registro.mjs`
