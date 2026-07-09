import { spawnSync } from 'node:child_process';
import type { CamcpConfig } from './permissions.js';

export class CommandGuardError extends Error {
  code = 'COMMAND_GUARD';
  constructor(message: string) {
    super(message);
    this.name = 'CommandGuardError';
  }
}

const GLOBAL_DENY_PATTERNS = [
  /\bgit\s+(push|commit|merge(?!-base)|rebase|reset|checkout|clean|stash\s+drop|fetch|pull)\b/i,
  /\bgit\s+worktree\s+(add|remove|prune|move)\b/i,
  /\bfirebase\s+deploy\b/i,
  /\bfirebase\s+use\b/i,
  /\brmdir\b/i,
  /\brm\s+-rf\b/i,
  /\bdel\s+\/f\b/i,
  /\bRemove-Item\b/i,
  /\bInvoke-Expression\b/i,
  /\bcmd\s+\/c\b/i,
  /\bbash\s+-c\b/i,
];

export function assertCommandAllowed(rawCommand: string, config: CamcpConfig): void {
  for (const pattern of GLOBAL_DENY_PATTERNS) {
    if (pattern.test(rawCommand)) {
      throw new CommandGuardError(`Command blocked by policy: ${rawCommand}`);
    }
  }
}

export function assertGitWorktreeArgsAllowed(args: string[]): void {
  if (!args.length || args[0]!.toLowerCase() !== 'list') {
    throw new CommandGuardError(
      `git worktree only allows "list", got: ${args.join(' ') || '(empty)'}`
    );
  }
  for (const arg of args.slice(1)) {
    if (arg !== '--porcelain') {
      throw new CommandGuardError(
        `git worktree list only allows --porcelain as extra arg, got: ${arg}`
      );
    }
  }
}

export function assertGitSubcommandAllowed(
  subcommand: string,
  args: string[],
  config: CamcpConfig
): void {
  const allowed = config.gitAllowedSubcommands.map((s) => s.toLowerCase());
  const sub = subcommand.toLowerCase();
  if (!allowed.includes(sub)) {
    throw new CommandGuardError(
      `Git subcommand not in allowlist: ${subcommand}. Allowed: ${allowed.join(', ')}`
    );
  }
  if (sub === 'worktree') {
    assertGitWorktreeArgsAllowed(args);
  }
}

export interface GitRunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export interface GitRunOptions {
  cwd?: string;
}

export function runGitAllowed(
  repoRoot: string,
  subcommand: string,
  args: string[],
  config: CamcpConfig,
  opts?: GitRunOptions
): GitRunResult {
  assertGitSubcommandAllowed(subcommand, args, config);
  const full = `git ${subcommand} ${args.join(' ')}`.trim();
  assertCommandAllowed(full, config);

  const result = spawnSync('git', [subcommand, ...args], {
    cwd: opts?.cwd ?? repoRoot,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
    shell: false,
  });

  return {
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    exitCode: result.status ?? 1,
  };
}

export function getGitCommitShort(repoRoot: string, config: CamcpConfig): string | null {
  try {
    const r = runGitAllowed(repoRoot, 'rev-parse', ['--short', 'HEAD'], config);
    if (r.exitCode !== 0) return null;
    return r.stdout.trim() || null;
  } catch {
    return null;
  }
}
