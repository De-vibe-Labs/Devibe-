import { createMockAdapter } from "../mock.js";

/** Cloudflare-native small-scale stack (Workers, D1, R2, Queues, Pages, Workers AI). */
export const cloudflareAdapter = createMockAdapter({
  id: "cloudflare",
  displayName: "Cloudflare",
  defaultRegion: "global-edge",
  capabilities: {
    compute: ["workers", "durable-objects", "workflows"],
    database: ["d1", "durable-objects-storage"],
    storage: ["r2"],
    queues: ["queues", "durable-object-alarms"],
    ai: ["workers-ai", "ai-gateway", "vectorize"],
    frontend: ["pages", "workers-sites"],
  },
  blueprint: [
    {
      kind: "compute",
      name: "edge-worker",
      monthlyUsd: 5,
      meta: { runtime: "workers", durableObjects: true, capacity: 1 },
    },
    {
      kind: "database",
      name: "d1",
      monthlyUsd: 0,
      meta: { engine: "sqlite", product: "d1" },
    },
    {
      kind: "storage",
      name: "r2-artifacts",
      monthlyUsd: 1,
      meta: { product: "r2", egress: "zero" },
    },
    {
      kind: "queue",
      name: "agent-events",
      monthlyUsd: 0.5,
      meta: { product: "queues" },
    },
    {
      kind: "ai",
      name: "ai-gateway",
      monthlyUsd: 2,
      meta: { product: "ai-gateway", routes: ["openai", "anthropic", "gemini", "bedrock"] },
    },
    {
      kind: "frontend",
      name: "pages",
      monthlyUsd: 0,
      meta: { product: "pages" },
    },
  ],
});
