import type { ContractDomainPlugin, ContractIssue, DomainValidationContext } from '../types.js';

function error(code: string, message: string, ctx: DomainValidationContext): ContractIssue {
  return {
    code,
    severity: 'error',
    message,
    ssotId: ctx.ssot.ssotId,
    path: ctx.ssot.path,
  };
}

export const archPlugin: ContractDomainPlugin = {
  pluginId: 'arch',
  validateDomain(ctx: DomainValidationContext): ContractIssue[] {
    const issues: ContractIssue[] = [];
    const data = ctx.parsed as Record<string, unknown>;

    if (ctx.ssot.ssotId === 'mapa-maestro') {
      if (!data.mapaActual || typeof data.mapaActual !== 'object') {
        issues.push(error('ARCH.SSOT.INVALID', 'mapa-maestro missing mapaActual', ctx));
      }
    }

    if (ctx.ssot.ssotId === 'intelligence-config') {
      if (!data.domainAnchors || typeof data.domainAnchors !== 'object') {
        issues.push(error('ARCH.SSOT.INVALID', 'intelligence.config missing domainAnchors', ctx));
      }
      if (!Array.isArray(data.modules)) {
        issues.push(error('ARCH.SSOT.INVALID', 'intelligence.config missing modules[]', ctx));
      }
    }

    if (ctx.ssot.ssotId === 'arch-config') {
      if (!data.tools || typeof data.tools !== 'object') {
        issues.push(error('ARCH.SSOT.INVALID', 'arch.config missing tools map', ctx));
      }
    }

    return issues;
  },
};
