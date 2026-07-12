import type { CamcpConfig } from '../policy/permissions.js';
import { runProfileAudit } from '../profile-audit/runner.js';
import type { ProfileAuditInput } from '../core/profile-parity-engine/types.js';

export function profileAudit(repoRoot: string, config: CamcpConfig, input: ProfileAuditInput = {}) {
  return runProfileAudit(repoRoot, config, input);
}

export type { ProfileAuditInput };
