import type { FacadeManifest, RegisterAck, WatchRegistration } from './types.js';
import { getFacadeRegistration } from './registry.js';

function validateWatch(w: WatchRegistration): string[] {
  const errors: string[] = [];
  if (!w.watchId) errors.push('missing watchId');
  if (!w.completedCheckPattern) errors.push('missing completedCheckPattern');
  if (!w.invalidates?.length) errors.push('missing invalidates[]');

  switch (w.kind) {
    case 'ssot':
      if (!w.ssotId) errors.push(`${w.watchId}: ssot kind requires ssotId`);
      break;
    case 'file':
      if (!w.path) errors.push(`${w.watchId}: file kind requires path`);
      break;
    case 'glob':
      if (!w.pathGlob) errors.push(`${w.watchId}: glob kind requires pathGlob`);
      break;
    case 'config':
      if (!w.path || !w.versionField) errors.push(`${w.watchId}: config requires path+versionField`);
      break;
    case 'git':
      if (!w.source) errors.push(`${w.watchId}: git kind requires source`);
      break;
    default:
      errors.push(`${w.watchId}: unknown kind`);
  }
  return errors;
}

export function registerFacadeManifest(manifest: FacadeManifest): RegisterAck {
  if (!manifest.facadeId) {
    throw new Error('register: facadeId required');
  }
  if (!Array.isArray(manifest.registrations)) {
    throw new Error('register: registrations[] required');
  }

  const errors: string[] = [];
  for (const w of manifest.registrations) {
    errors.push(...validateWatch(w));
  }
  if (errors.length) {
    throw new Error(`register: invalid manifest — ${errors.join('; ')}`);
  }

  const known = getFacadeRegistration(manifest.facadeId);
  if (!known) {
    throw new Error(`register: unknown facadeId ${manifest.facadeId} — update invalidation-registry.json`);
  }

  return {
    ack: true,
    facadeId: manifest.facadeId,
    watchCount: manifest.registrations.length,
  };
}
