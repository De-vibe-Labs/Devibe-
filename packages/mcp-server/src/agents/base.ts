export type AgentRole =
  | "product"
  | "devops"
  | "security"
  | "backend"
  | "qa"
  | "orchestrator";

export interface AgentDefinition {
  role: AgentRole;
  name: string;
  description: string;
  systemPrompt: string;
  tools: string[];
}

export function defineAgent(def: AgentDefinition): AgentDefinition {
  return def;
}
