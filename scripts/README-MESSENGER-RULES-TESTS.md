# Messenger — pruebas de reglas Firestore (TICKET-031)

Suite contra **solo el emulador**. Carga `firestore.rules` de producción (no borradores).

## Requisitos

- Node 18+
- Firebase CLI (`firebase emulators:exec` o emulador ya en marcha)
- Dependencias en la raíz del repo:

```powershell
npm install
```

## Ejecutar

**Opción A — emulador + tests en un comando:**

```powershell
npm run test:rules:messenger:emu
```

**Opción B — emulador manual:**

```powershell
firebase emulators:start --only firestore
$env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
npm run test:rules:messenger
```

Si `FIRESTORE_EMULATOR_HOST` no está definido, la suite aborta (no toca producción).

## Archivos

| Archivo | Rol |
|---------|-----|
| `scripts/messenger-rules.test.mjs` | Casos `node:test` |
| `scripts/messenger-rules-test-fixtures.json` | UIDs y payloads válidos |
| `firestore.rules` | Reglas bajo prueba |
| `scripts/config-messenger-rules-tests-schema.json` | Índice de cobertura |

## Casos cubiertos

1. Visitante crea conversación scoped (`conversacionCreateValida`)
2. Anunciante y visitante participantes **leen**
3. Intruso **no** lee ni escribe mensajes
4. Intruso **no** crea conversación suplantando otro `visitanteUid`
5. Admin lee conversación
6. Participante envía mensaje (`mensajeCreateValido`)
7. Participante actualiza `ultimoMensaje` / `unreadByUid` / `updatedAt`

## Ampliar

Añade fixtures en `messenger-rules-test-fixtures.json` y tests en `messenger-rules.test.mjs`. Mantén payloads alineados con `carihub-messenger-schema.js` y las helpers en `firestore.rules`.
