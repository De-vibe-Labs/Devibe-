import { createMockAdapter } from "../mock.js";

export const azureAdapter = createMockAdapter({
  id: "azure",
  displayName: "Azure",
  defaultRegion: "eastus",
  capabilities: {
    compute: ["functions", "container-apps", "aks"],
    database: ["cosmos-db", "flexible-postgres"],
    storage: ["blob-storage"],
    queues: ["service-bus", "event-grid"],
    ai: ["azure-openai"],
    frontend: ["static-web-apps", "front-door"],
  },
  blueprint: [
    { kind: "compute", name: "functions", monthlyUsd: 15, meta: { runtime: "functions", capacity: 1 } },
    { kind: "database", name: "flexible-postgres", monthlyUsd: 24, meta: { engine: "postgres" } },
    { kind: "storage", name: "blob-artifacts", monthlyUsd: 2.8, meta: { product: "blob" } },
    { kind: "queue", name: "service-bus", monthlyUsd: 1.5, meta: { product: "service-bus" } },
    { kind: "ai", name: "azure-openai", monthlyUsd: 14, meta: { product: "azure-openai" } },
    { kind: "frontend", name: "static-web-apps", monthlyUsd: 3, meta: { product: "swa" } },
  ],
});
