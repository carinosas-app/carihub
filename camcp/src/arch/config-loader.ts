import fs from 'node:fs';
import path from 'node:path';
import { getCamcpRoot } from '../config/load-config.js';

export interface ArchToolConfig {
  priority?: string;
  ssot?: string[];
  reuses?: string[];
  optional?: boolean;
  actaGlob?: string;
  rulesGlob?: string;
  camcpFrozenPaths?: string[];
  patterns?: string[];
  defaultScope?: string[];
}

export interface ArchConfig {
  version: string;
  tools: Record<string, ArchToolConfig>;
}

export function loadArchConfig(): ArchConfig {
  const configPath = path.join(getCamcpRoot(), 'config', 'arch.config.json');
  return JSON.parse(fs.readFileSync(configPath, 'utf8')) as ArchConfig;
}
