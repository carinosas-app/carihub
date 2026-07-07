import fs from 'node:fs';
import path from 'node:path';
import { scanQaCatalog } from '../../qa/catalog.js';
import { listGptKnowledgeDocs } from '../contracts/loader.js';
import type { IntelligenceConfig, IntelligenceGraph, GraphEdge, GraphNode } from '../types.js';

export function buildGraph(
  repoRoot: string,
  intelConfig: IntelligenceConfig,
  gitCommit: string | null
): IntelligenceGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodeIds = new Set<string>();

  function addNode(node: GraphNode) {
    if (nodeIds.has(node.id)) return;
    nodeIds.add(node.id);
    nodes.push(node);
  }

  function addEdge(from: string, to: string, relation: GraphEdge['relation']) {
    edges.push({ from, to, relation });
  }

  for (const [domainId, anchors] of Object.entries(intelConfig.domainAnchors)) {
    addNode({ id: `domain:${domainId}`, type: 'domain', label: domainId });
    for (const anchor of anchors) {
      const fileId = `file:${anchor}`;
      const exists = fs.existsSync(path.join(repoRoot, anchor));
      addNode({ id: fileId, type: 'file', label: anchor, meta: { exists } });
      addEdge(`domain:${domainId}`, fileId, 'anchors');
    }
  }

  for (const doc of listGptKnowledgeDocs(repoRoot)) {
    const docId = `doc:${doc.file}`;
    addNode({ id: docId, type: 'doc', label: doc.file });
    addEdge('domain:SHARED_CORE', docId, 'documents');
  }

  const qaCatalog = scanQaCatalog(repoRoot);
  for (const entry of qaCatalog.slice(0, 40)) {
    const scriptId = `qa:${entry.id}`;
    addNode({
      id: scriptId,
      type: 'qa_script',
      label: entry.script,
      meta: { kinds: entry.kinds },
    });
    if (entry.kinds.some((k) => k.startsWith('paridad'))) {
      addEdge('domain:APP_REGISTRO', scriptId, 'qa_pack');
      addEdge('domain:APP_PUBLICA', scriptId, 'qa_pack');
    }
    if (entry.id.includes('fondos')) {
      addEdge('domain:APP_PUBLICA', scriptId, 'qa_pack');
    }
  }

  for (const mod of intelConfig.modules) {
    addNode({
      id: `module:${mod.id}`,
      type: 'qa_script',
      label: mod.label,
      meta: { qaTool: mod.qaTool },
    });
  }

  return {
    gitCommit,
    generatedAt: new Date().toISOString(),
    nodes,
    edges,
    stats: {
      nodes: nodes.length,
      edges: edges.length,
      domains: Object.keys(intelConfig.domainAnchors).length,
    },
  };
}
