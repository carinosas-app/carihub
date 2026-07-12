/**
 * BLK-05-R1 — ETL / contract alignment tests (no emulator required).
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mapLegacyUsuarioToPerfil,
  isPerfilPublicoPredicate,
  validatePerfilContract,
  esPerfilPublicoLegacy,
  FORBIDDEN_PERFIL_FIELDS,
  isAdminPublishBundle,
  isAdminSuspendBundle,
  validateAdminTransitionBundle,
  adminTransitionTargetsPublicado
} from './lib/blk05-perfiles-contract.mjs';

describe('BLK-05 contract — mapLegacyUsuarioToPerfil', () => {
  test('legacy public monolith maps to canonical publicado + flags', () => {
    const now = Date.now();
    const perfil = mapLegacyUsuarioToPerfil('uid_a', {
      aprobado: true,
      activo: true,
      vencido: false,
      nombre: 'Publico',
      tipoPerfil: 'independiente'
    }, { nowMs: now });
    assert.equal(perfil.perfilId, 'uid_a');
    assert.equal(perfil.ownerUid, 'uid_a');
    assert.equal(perfil.usuarioId, 'uid_a');
    assert.equal(perfil.estadoPublicacion, 'publicado');
    assert.equal(perfil.visible, true);
    assert.equal(perfil.publicado, true);
    assert.equal(perfil.tienePerfilPublico, true);
    assert.equal(perfil.suspendido, false);
    assert.equal(perfil.eliminado, false);
    assert.equal(validatePerfilContract(perfil).length, 0);
    assert.equal(isPerfilPublicoPredicate(perfil, now), true);
    assert.equal(esPerfilPublicoLegacy({ aprobado: true, activo: true, vencido: false }, now), true);
  });

  test('legacy draft maps to borrador', () => {
    const perfil = mapLegacyUsuarioToPerfil('uid_b', {
      aprobado: false,
      activo: false,
      estadoRevision: 'registro_pendiente'
    });
    assert.equal(perfil.estadoPublicacion, 'borrador');
    assert.equal(perfil.visible, false);
    assert.equal(isPerfilPublicoPredicate(perfil), false);
  });

  test('legacy vencido maps to vencido', () => {
    const perfil = mapLegacyUsuarioToPerfil('uid_c', { vencido: true, aprobado: true, activo: true });
    assert.equal(perfil.estadoPublicacion, 'vencido');
    assert.equal(perfil.vencido, true);
    assert.equal(isPerfilPublicoPredicate(perfil), false);
  });

  test('no forbidden fields in mapped perfil', () => {
    const perfil = mapLegacyUsuarioToPerfil('uid_d', {
      aprobado: true,
      activo: true,
      verificacion: { ine: 'x' },
      kyc: { x: 1 },
      nombre: 'X'
    });
    for (const f of FORBIDDEN_PERFIL_FIELDS) {
      assert.ok(!(f in perfil), `forbidden leaked: ${f}`);
    }
  });

  test('ownerUid equals usuarioId', () => {
    const perfil = mapLegacyUsuarioToPerfil('uid_e', { nombre: 'Y' });
    assert.equal(perfil.ownerUid, perfil.usuarioId);
  });
});

describe('BLK-05 contract — validatePerfilContract', () => {
  test('detects forbidden field', () => {
    const issues = validatePerfilContract({
      perfilId: 'p', ownerUid: 'u', usuarioId: 'u',
      estadoPublicacion: 'borrador', visible: false, publicado: false, tienePerfilPublico: false,
      suspendido: false, eliminado: false, vencido: false,
      kyc: {}
    });
    assert.ok(issues.some((i) => i.code === 'forbidden_field'));
  });
});

describe('BLK-05 W1 — admin publish bundle', () => {
  test('adminTransitionTargetsPublicado detects pendiente -> publicado', () => {
    assert.equal(adminTransitionTargetsPublicado('pendiente', 'publicado'), true);
    assert.equal(adminTransitionTargetsPublicado('publicado', 'publicado'), false);
  });

  test('isAdminPublishBundle requires atomic visibility fields', () => {
    assert.equal(isAdminPublishBundle({
      estadoPublicacion: 'publicado', visible: true, publicado: true,
      tienePerfilPublico: true, suspendido: false, vencido: false
    }), true);
    assert.equal(isAdminPublishBundle({
      estadoPublicacion: 'publicado', visible: true, publicado: true,
      tienePerfilPublico: false, suspendido: false, vencido: false
    }), false);
  });

  test('validateAdminTransitionBundle rejects incomplete publish', () => {
    const issues = validateAdminTransitionBundle('pendiente', 'publicado', {
      estadoPublicacion: 'publicado', visible: false, publicado: false,
      tienePerfilPublico: false, suspendido: false, vencido: false
    });
    assert.ok(issues.some((i) => i.code === 'admin_publish_bundle_incomplete'));
  });

  test('validateAdminTransitionBundle accepts complete publish', () => {
    const issues = validateAdminTransitionBundle('pendiente', 'publicado', {
      estadoPublicacion: 'publicado', visible: true, publicado: true,
      tienePerfilPublico: true, suspendido: false, vencido: false
    });
    assert.equal(issues.length, 0);
    assert.equal(isAdminSuspendBundle({
      estadoPublicacion: 'suspendido', visible: false, publicado: false,
      tienePerfilPublico: false, suspendido: true
    }), true);
  });
});
