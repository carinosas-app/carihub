import type { HandoffBriefDocument } from './types.js';

export function renderContinuationBriefMd(brief: HandoffBriefDocument): string {
  const lines: string[] = [
    '# CAMCP Continuation Brief v1',
    '',
    '## Task',
    `- **Title:** ${brief.task.title}`,
    `- **Status:** ${brief.task.status}`,
  ];

  if (brief.task.objective) {
    lines.push(`- **Objective:** ${brief.task.objective}`);
  }

  lines.push('', '## Git');
  lines.push(
    `- **Branch:** ${brief.git.branch} @ ${brief.git.commit}${brief.git.dirty ? ' (dirty)' : ''}`
  );
  if (brief.git.worktree) {
    lines.push(
      `- **Worktree:** ${brief.git.worktree.id}${brief.git.worktree.isPrimary ? ' (primary)' : ' (non-primary)'}`
    );
  }
  lines.push(
    `- **PR:** ${brief.git.pr.number != null ? `#${brief.git.pr.number}` : 'none'}`
  );

  lines.push('', '## Do NOT');
  for (const action of brief.forbiddenActions.slice(0, 12)) {
    lines.push(`- ${action}`);
  }

  lines.push('', `## Open findings (max ${brief.openFindings.length})`);
  if (!brief.openFindings.length) {
    lines.push('_None._');
  } else {
    brief.openFindings.forEach((f, i) => {
      const subj = f.subject?.subcategoriaId ?? f.subject?.sectorId ?? '';
      lines.push(
        `${i + 1}. [${f.severity}] ${f.code}${subj ? ` — ${subj}` : ''} — ${f.toolId}`
      );
    });
  }

  lines.push('', '## Evidence (read first)');
  for (const ref of brief.evidenceRefs.slice(0, 10)) {
    lines.push(`- ${ref.path}`);
  }

  lines.push('', '## Valid completed checks');
  const valid = brief.completedChecks.filter((c) => c.valid);
  if (!valid.length) {
    lines.push('_None valid._');
  } else {
    for (const c of valid.slice(0, 8)) {
      lines.push(`- ${c.toolId}${c.facet ? `:${c.facet}` : ''} @ ${c.runId}`);
    }
  }

  lines.push('', '## Suggested next tools');
  brief.suggestedToolChain.forEach((t, i) => {
    lines.push(`${i + 1}. ${t}`);
  });

  lines.push('', '## Context');
  lines.push(
    `- Overflow risk: ${brief.contextMetrics.overflowRisk} (${Math.round(brief.contextMetrics.utilizationRatio * 100)}% of budget)`
  );
  if (brief.supersedes) {
    lines.push(`- Supersedes: ${brief.supersedes.briefId}`);
  }

  const md = lines.join('\n');
  const lineCount = md.split('\n').length;
  if (lineCount > 80) {
    return md.split('\n').slice(0, 80).join('\n') + '\n\n_(truncated to 80 lines)_\n';
  }
  return md + '\n';
}
