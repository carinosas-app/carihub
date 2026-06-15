# Acta formal de congelamiento del diseño de cuentas CariHub

| Campo | Valor |
|-------|-------|
| **Estado** | CONGELADO |
| **Versión acta** | 1.0.0 |
| **Fecha de congelamiento** | 2026-06-09 |
| **Versión cuentas** | `cuentas-2026-06-10` (semver **1.0.0**) |
| **Autorización** | Aprobada por product owner — 2026-06-09 |

Artefacto canónico: [`ACTA-CONGELAMIENTO-CUENTAS.json`](./ACTA-CONGELAMIENTO-CUENTAS.json)

---

## 1. Objeto del congelamiento

Queda **formalmente congelado** el diseño de identidad y cuentas de usuario, incluyendo:

- **identidadUsuario** — capa única `usuarioId = Firebase Auth uid`
- **usuarios como hub** — `usuarios/{usuarioId}` sin datos extensos de perfil público
- **perfiles separados** — `perfiles/{perfilId}` con `usuarioId` obligatorio
- **tipoCuentaPrincipal** — campo `tipoCuenta` en hub (visitante \| adulto \| independiente \| profesionista \| empresa)
- **rolesCuenta** — `roles[]` multirol (anunciante, admin, moderador, auditor)
- **visitante → upgrade** — mismo `usuarioId`, sin nuevo Auth user
- **Estados** — cuenta, verificación, mensajería
- **Relaciones FK** — grafo usuarioId / perfilId / anuncianteId / contratoId

**No incluye** runtime, Firestore, producción, deploy ni migración de datos.

### Producción actual (legacy, sin modificar)

| Aspecto | Estado |
|---------|--------|
| Modelo | `usuarios/{uid}` monolito cuenta + perfil |
| Colección `perfiles` | No existe en producción |
| `tipoCuenta` | No existe en producción |

---

## 2. identidadUsuario

| Elemento | Definición congelada |
|----------|---------------------|
| **usuarioId** | Firebase Auth uid — **nunca cambia** |
| **Hub** | `usuarios/{usuarioId}` — identidad, estados, punteros, cache |
| **Perfiles** | `perfiles/{perfilId}` — registro, publicación, snapshot render |
| **Schema detalle** | `config-cuentas-usuario-schema.json` |
| **Meta** | `config-registro-schema.meta.json` → `identidadUsuario` |
| **Validación** | `validateIdentidadUsuario()` — **16 / 16 PASS** |

### Principios congelados

1. Visitante → perfil público = **upgrade**, no registro nuevo.
2. Contratos y pagos siempre referencian **usuarioId**.
3. **admin** es rol, nunca `tipoCuentaPrincipal`.
4. **anunciante** es rol; MVP `anuncianteId = usuarioId`.
5. Messenger futuro exige **estadoMensajeria** en usuarios.

---

## 3. usuarios como hub

**Ruta:** `usuarios/{usuarioId}`

### Campos raíz obligatorios

`usuarioId`, `email`, `tipoCuentaPrincipal` (campo `tipoCuenta`), `estadoCuenta`, `createdAt`, `updatedAt`

### Subobjetos

| Subobjeto | Contenido |
|-----------|-----------|
| `cuenta` | tipoCuenta, estadoCuenta, roles, permisos |
| `perfil` | perfilPrincipalId, perfilIds[], cache categoría/formulario |
| `anunciante` | anuncianteId, solicitudes banner, contrato banner activo |
| `verificacion` | estadoVerificacion, fechas, nivel, motivo rechazo |
| `mensajeria` | estadoMensajeria, puedeEnviar/Recibir, contadores |
| `comercial` | contratoActivoId, plan, periodo, vencimiento, precio congelado |
| `seguridad` | riesgoScore, flags, último login |
| `preferencias` | idioma, notificaciones, geo preferida |

### Subcolecciones

- `favoritos/{perfilId}`
- `notificaciones/{id}`
- `bloqueos/{usuarioBloqueadoId}`
- `conversaciones_meta/{conversacionId}` (futuro)
- `dispositivos/{deviceId}`

---

## 4. perfiles separados

**Ruta:** `perfiles/{perfilId}`

| Regla | Detalle |
|-------|---------|
| FK obligatoria | `usuarioId` → `usuarios/{usuarioId}` |
| Prohibido | Perfil publicado sin `usuarioId` |
| Punteros en hub | `perfilPrincipalId`, `perfilIds[]` |
| Legacy | `perfilId` puede = `usuarioId` durante migración |

### Campos obligatorios del perfil

`usuarioId`, `perfilId`, `formularioId`, `sectorId`, `subcategoriaId`, `arquetipo`, `tipoPerfil`, `estadoRevision`, `tienePerfilPublico`, `schemaVersion`, `componenteResultados`, `componentePerfil`, `createdAt`, `updatedAt`

---

## 5. tipoCuentaPrincipal

Campo en schema: `usuarios.tipoCuenta` (documentado como **tipoCuentaPrincipal** en actas).

| Valor | formularioId |
|-------|--------------|
| visitante | usuario_visitante |
| adulto | adultos |
| independiente | persona_independiente |
| profesionista | profesionista_cedula |
| empresa | negocio_empresa |

**No son tipoCuentaPrincipal:** `anunciante`, `admin` — son **roles** en `roles[]`.

---

## 6. rolesCuenta

**Campo:** `usuarios.roles[]`

| Rol | Uso |
|-----|-----|
| anunciante | Banners y contratos publicidad |
| admin | Panel administración |
| moderador | Futuro |
| auditor | Futuro |

**Multirol:** visitante + `roles:['anunciante']` sin perfil público es válido.

**Regla admin:** `admin ∈ roles[]` — prohibido `tipoCuentaPrincipal = admin`.

---

## 7. visitante → upgrade

| Regla | Valor |
|-------|-------|
| Mismo usuarioId | Sí |
| Nuevo Auth user | **No** |
| Schema wizard | `config-registro-visitante-schema.json` |

### Transiciones congeladas

| De | A | Acción |
|----|---|--------|
| visitante | adulto / independiente / profesionista / empresa | Crear `perfiles/{id}` + actualizar tipoCuentaPrincipal |
| visitante | anunciante | `roles += anunciante` (puede sin perfil) |
| cualquiera | anunciante | `roles += anunciante` sin cambiar tipoCuentaPrincipal |

### Se conserva en upgrade

Favoritos, notificaciones, contratos, pagos, solicitudes categoría/anuncios, denuncias, preferencias, mensajes futuros.

---

## 8. Estados

### estadoCuenta

`activa` \| `suspendida` \| `eliminada` \| `pendiente_activacion`

### estadoVerificacion

`sin_enviar` \| `enviada` \| `en_revision` \| `aprobada` \| `rechazada` \| `vencida`

Niveles: `cuenta_basica`, `persona_estandar`, `profesional_cedula`, `negocio`

### estadoMensajeria

`habilitada` \| `restringida` \| `suspendida` \| `solo_lectura`

> Diseño congelado; Messenger **no implementado**.

---

## 9. Relaciones permitidas

```
usuarioId ──► perfiles, contratos, pagos, solicitudes, denuncias, favoritos, bloqueos, mensajes
perfilId  ──► favoritos, denuncias, contratos (opc.), mensajes (contexto)
anuncianteId ──► banners, solicitudes_anuncios (MVP = usuarioId)
contratoId ──► pagos, renovaciones, cache comercial en usuario
```

Queries preferidas sobre arrays grandes: solicitudes por `usuarioId`, banners por `anuncianteId`, conversaciones en subcolección.

---

## 10. Archivos baseline

- `scripts/config-cuentas-usuario-schema.json`
- `scripts/config-registro-schema.meta.json` (sección `identidadUsuario`)
- `scripts/config-registro-visitante-schema.json`
- `scripts/config-contratos-carihub-schema.json`
- `scripts/config-promociones-banners-schema.json`
- `scripts/config-estados-revision-publicacion-schema.json`
- `scripts/validar-schemas-registro.mjs`
- `scripts/validacion-schemas-report.json`

---

## 11. Reglas de modificación futura

1. Autorización explícita del product owner.
2. Re-validar `identidadUsuario` (16/16 PASS mínimo).
3. Incrementar semver `cuentas-x.y.z`.
4. `usuarioId` inmutable; upgrade sin nuevo Auth.
5. No re-monolitizar perfil en `usuarios/{uid}` sin acta MAJOR.
6. `admin` permanece rol, no tipoCuentaPrincipal.
7. Sin cambios Firestore silenciosos.
8. Cambios de cuentas no reabren catálogo sin autorización cruzada.

---

## 12. Historial

| Semver | Fecha | Evento |
|--------|-------|--------|
| 1.0.0 | 2026-06-09 | **CONGELAMIENTO_INICIAL** |

---

*Acta de diseño. No constituye implementación ni migración.*
