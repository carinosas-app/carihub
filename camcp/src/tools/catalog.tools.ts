import type { CamcpConfig } from '../policy/permissions.js';
import { runCatalogAudit } from '../catalog-audit/runner.js';
import type { CatalogAuditInput } from '../core/catalog-engine/types.js';

export function catalogAudit(repoRoot: string, config: CamcpConfig, input: CatalogAuditInput = {}) {
  return runCatalogAudit(repoRoot, config, input);
}

export type { CatalogAuditInput };
