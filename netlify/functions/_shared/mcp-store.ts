import type { McpServerDefinition } from "@devibe/mcp-builder";

const g = globalThis as typeof globalThis & {
  __devibeMcpServers?: Map<string, McpServerDefinition>;
};

function store(): Map<string, McpServerDefinition> {
  if (!g.__devibeMcpServers) g.__devibeMcpServers = new Map();
  return g.__devibeMcpServers;
}

export function listMcpServers(ownerId?: string): McpServerDefinition[] {
  const all = [...store().values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (!ownerId) return all;
  return all.filter((s) => !s.ownerId || s.ownerId === ownerId);
}

export function getMcpServer(id: string): McpServerDefinition | undefined {
  return store().get(id);
}

export function saveMcpServer(def: McpServerDefinition): McpServerDefinition {
  store().set(def.id, def);
  return def;
}

export function deleteMcpServer(id: string): boolean {
  return store().delete(id);
}
