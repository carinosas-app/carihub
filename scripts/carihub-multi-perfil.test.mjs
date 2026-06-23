import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcPath = join(__dirname, '../public/js/carihub-multi-perfil.js');

function loadMultiPerfil() {
  const src = readFileSync(srcPath, 'utf8');
  const sandbox = { globalThis: {} };
  sandbox.window = sandbox.globalThis;
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox);
  return sandbox.globalThis.CariHubMultiPerfil;
}

describe('TICKET-003 CariHubMultiPerfil (lectura public/, sin modificar)', () => {
  const MP = loadMultiPerfil();

  it('appendPerfilToHub no sobrescribe perfil existente', () => {
    const existing = {
      uid: 'uid1',
      perfilesVinculados: [{ perfilId: 'p1', nombre: 'Uno' }],
      perfilesDetalle: {
        p1: { perfilId: 'p1', nombre: 'Uno', categoria: 'salud' },
      },
      perfilActivoId: 'p1',
    };
    const patch = MP.appendPerfilToHub(existing, 'p2', { nombre: 'Dos', categoria: 'bienestar' }, {
      cuentaUid: 'uid1',
    });
    assert.equal(patch.perfilesVinculados.length, 2);
    assert.ok(patch.perfilesDetalle.p1);
    assert.ok(patch.perfilesDetalle.p2);
    assert.equal(patch.perfilActivoId, 'p2');
    assert.equal(patch.perfilesDetalle.p1.nombre, 'Uno');
  });

  it('legacy flat migra a nested sin perder datos', () => {
    const legacy = {
      uid: 'uid_legacy',
      perfilId: 'perfil_legacy',
      nombre: 'Legacy Name',
      categoria: 'salud',
    };
    const patch = MP.buildLegacyMigrationPatch(legacy, 'uid_legacy');
    assert.ok(patch);
    assert.equal(patch.perfilActivoId, 'perfil_legacy');
    assert.ok(Array.isArray(patch.perfilesVinculados));
    assert.ok(patch.perfilesDetalle.perfil_legacy);
  });

  it('resolvePerfilActivoId restaura id válido', () => {
    const perfiles = MP.expandPerfilesFromHub({
      uid: 'u1',
      perfilesVinculados: [{ perfilId: 'a' }, { perfilId: 'b' }],
      perfilesDetalle: {
        a: { perfilId: 'a', nombre: 'A' },
        b: { perfilId: 'b', nombre: 'B' },
      },
      perfilActivoId: 'b',
    }, 'u1');
    const id = MP.resolvePerfilActivoId({ perfilActivoId: 'b' }, perfiles);
    assert.equal(id, 'b');
  });

  it('resolvePerfilActivoId fallback si id huérfano', () => {
    const perfiles = MP.expandPerfilesFromHub({
      uid: 'u1',
      perfilesVinculados: [{ perfilId: 'a' }],
      perfilesDetalle: { a: { perfilId: 'a', nombre: 'A' } },
      perfilActivoId: 'missing',
    }, 'u1');
    const id = MP.resolvePerfilActivoId({ perfilActivoId: 'missing' }, perfiles);
    assert.equal(id, 'a');
  });
});
