import type { ConflictRiskLevel } from '../git-context-engine/types.js';
import type { HandoffCompletedCheck, HandoffInput, OverflowRiskLevel } from './types.js';
import type { HandoffBriefGit } from './types.js';
import { loadHandoffConfig } from './config-loader.js';

function normalizeAction(action: string): string {
  return action.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function buildForbiddenActions(
  input: HandoffInput,
  completedChecks: HandoffCompletedCheck[],
  git: HandoffBriefGit,
  overflowRisk: OverflowRiskLevel,
  opts: {
    frozenModuleTouched?: boolean;
    conflictRisk?: ConflictRiskLevel;
    staleWorktrees?: boolean;
  } = {}
): string[] {
  const cfg = loadHandoffConfig();
  const merged = new Set<string>(cfg.forbiddenActionDefaults.map(normalizeAction));

  for (const a of input.forbiddenActions ?? []) {
    merged.add(normalizeAction(a));
  }

  const catalogValid = completedChecks.some(
    (c) => c.toolId === 'catalog.audit' && c.valid
  );
  if (catalogValid) {
    merged.add('re-audit full catalog');
  }

  if (opts.frozenModuleTouched) {
    merged.add('modify frozen module without authorization');
  }

  if (overflowRisk === 'critical') {
    merged.add('load full evidence bundle inline');
  }

  if (git.dirty && git.pr.checksSummary && git.pr.checksSummary.fail > 0) {
    merged.add('merge until ci green');
  }

  if (opts.conflictRisk === 'high') {
    merged.add('commit in parallel worktrees on same branch');
  }

  if (opts.staleWorktrees) {
    merged.add('continue work in stale worktree without sync');
  }

  return [...merged];
}
