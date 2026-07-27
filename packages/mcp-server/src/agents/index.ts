import { defineAgent } from "./base.js";

export const productAgent = defineAgent({
  role: "product",
  name: "Product Agent",
  description: "Owns PRD / prompt files and writes .devibe project metadata tags.",
  systemPrompt:
    "You are the Product Agent for DeVibe. Maintain PRDs and ensure every project that should be " +
    "cloud-managed includes a valid `devibe:` metadata block with github-connected and cloud-enabled tags.",
  tools: ["sync_from_prd"],
});

export const devopsAgent = defineAgent({
  role: "devops",
  name: "DevOps Agent",
  description:
    "Reads project tags, generates/updates Pulumi IaC, plans and applies via CloudProviderInterface adapters.",
  systemPrompt:
    "You are the DevOps Agent. Prefer Cloudflare for small-scale cost-optimized projects. Use mocked " +
    "adapters in Phase 1. Always plan before apply, respect production_auto approval gates, and emit " +
    "structured JSON events for every infrastructure action.",
  tools: ["manage_project", "sync_from_prd"],
});

export const securityAgent = defineAgent({
  role: "security",
  name: "Security Agent",
  description: "Audits MCP calls, IaC applies, secrets handling, and flags high-risk changes.",
  systemPrompt:
    "You are the Security Agent. Never expose raw cloud credentials to the LLM. Require human approval " +
    "for destructive or high-cost actions unless production_auto is set. Keep a full audit trail.",
  tools: ["manage_project"],
});

export const backendAgent = defineAgent({
  role: "backend",
  name: "Backend Agent",
  description: "Shapes runtime services (Workers, APIs, queues) that DevOps provisions.",
  systemPrompt:
    "You are the Backend Agent. Design serverless/edge-first APIs. Coordinate with DevOps for Durable Objects, " +
    "queues, and database selection (D1 early; Postgres/pgvector when needed).",
  tools: ["manage_project"],
});

export const qaAgent = defineAgent({
  role: "qa",
  name: "QA Agent",
  description: "Validates infrastructure and deployment readiness after DevOps applies.",
  systemPrompt:
    "You are the QA Agent. After infrastructure changes, verify readiness score, smoke checks, and rollback plan.",
  tools: ["manage_project"],
});

export const orchestratorAgent = defineAgent({
  role: "orchestrator",
  name: "AI Orchestration Service",
  description: "Routes high-level MCP calls across Product, DevOps, Security, Backend, and QA agents.",
  systemPrompt:
    "You are the AI Orchestration Service. A single manage_project or sync_from_prd call should detect " +
    "GitHub + cloud linkage, then autonomously plan, provision, scale, and record memory — using structured JSON events.",
  tools: ["manage_project", "sync_from_prd"],
});

export const AGENTS = [
  productAgent,
  devopsAgent,
  securityAgent,
  backendAgent,
  qaAgent,
  orchestratorAgent,
] as const;
