import { createMockAdapter } from "../mock.js";

export const gcpAdapter = createMockAdapter({
  id: "gcp",
  displayName: "Google Cloud",
  defaultRegion: "us-central1",
  capabilities: {
    compute: ["cloud-run", "gke-autopilot"],
    database: ["cloud-sql", "firestore"],
    storage: ["gcs"],
    queues: ["pubsub"],
    ai: ["vertex-ai"],
    frontend: ["cloud-cdn"],
  },
  blueprint: [
    { kind: "compute", name: "cloud-run", monthlyUsd: 16, meta: { runtime: "cloud-run", capacity: 1 } },
    { kind: "database", name: "cloud-sql", monthlyUsd: 22, meta: { engine: "postgres" } },
    { kind: "storage", name: "gcs-artifacts", monthlyUsd: 2.5, meta: { product: "gcs" } },
    { kind: "queue", name: "pubsub-events", monthlyUsd: 1.2, meta: { product: "pubsub" } },
    { kind: "ai", name: "vertex-gateway", monthlyUsd: 12, meta: { product: "vertex-ai" } },
    { kind: "frontend", name: "cloud-cdn", monthlyUsd: 4, meta: { product: "cloud-cdn" } },
  ],
});
