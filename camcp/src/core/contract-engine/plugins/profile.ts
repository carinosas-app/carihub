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

export const profilePlugin: ContractDomainPlugin = {
  pluginId: 'profile',
  validateDomain(ctx: DomainValidationContext): ContractIssue[] {
    const issues: ContractIssue[] = [];

    if (ctx.ssot.ssotId === 'registro-schema-index') {
      const data = ctx.parsed as Record<string, unknown>;
      const byId = data.byId as Record<string, unknown> | undefined;
      if (!byId) return issues;

      let missingArquetipo = 0;
      for (const entry of Object.values(byId)) {
        if (!entry || typeof entry !== 'object') continue;
        const row = entry as Record<string, unknown>;
        if (!row.arquetipo || !row.componentePerfil) missingArquetipo += 1;
      }
      if (missingArquetipo > 0) {
        issues.push(
          warn(
            'PARITY.SCHEMA.MISSING_ARQUETIPO',
            `${missingArquetipo} schema-index entries missing arquetipo/componentePerfil`,
            ctx
          )
        );
      }
    }

    if (ctx.ssot.ssotId === 'perfil-publico') {
      if (ctx.snapshot.byteSize != null && ctx.snapshot.byteSize < 1000) {
        issues.push(
          warn('PARITY.RENDER.SUSPICIOUS_SIZE', 'perfil-publico.html unusually small', ctx)
        );
      }
    }

    return issues;
  },
};
