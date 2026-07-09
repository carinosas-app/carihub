import type { ContractDomainPlugin, ContractIssue, DomainValidationContext } from '../types.js';

function warn(code: string, message: string, ctx: DomainValidationContext): ContractIssue {
  return {
    code,
    severity: 'warning',
    message,
    ssotId: ctx.ssot.ssotId,
    path: ctx.ssot.path,
  };
}

function error(code: string, message: string, ctx: DomainValidationContext): ContractIssue {
  return {
    code,
    severity: 'error',
    message,
    ssotId: ctx.ssot.ssotId,
    path: ctx.ssot.path,
  };
}

export const catalogPlugin: ContractDomainPlugin = {
  pluginId: 'catalog',
  validateDomain(ctx: DomainValidationContext): ContractIssue[] {
    const issues: ContractIssue[] = [];
    const data = ctx.parsed as Record<string, unknown>;
    const byId = data.byId;
    const total = data.total;

    if (!byId || typeof byId !== 'object') {
      issues.push(error('CATALOG.SSOT.INVALID', 'byId must be an object', ctx));
      return issues;
    }

    const count = Object.keys(byId as Record<string, unknown>).length;
    if (typeof total === 'number' && total !== count) {
      issues.push(
        warn(
          'CATALOG.TAXONOMY.TOTAL_MISMATCH',
          `total=${total} but byId has ${count} entries`,
          ctx
        )
      );
    }

    for (const [key, entry] of Object.entries(byId as Record<string, unknown>).slice(0, 5000)) {
      if (!entry || typeof entry !== 'object') {
        issues.push(error('CATALOG.SSOT.INVALID', `byId[${key}] is not an object`, ctx));
        continue;
      }
      const row = entry as Record<string, unknown>;
      if (!row.subcategoriaId || !row.sectorId) {
        issues.push(
          warn(
            'CATALOG.ENTRY.INCOMPLETE',
            `Entry ${key} missing subcategoriaId or sectorId`,
            ctx
          )
        );
      }
    }

    return issues;
  },
};
