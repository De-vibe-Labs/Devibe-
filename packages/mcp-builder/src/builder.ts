import {
  CreateMcpServerInputSchema,
  type CreateMcpServerInput,
  type McpServerDefinition,
} from "./types.js";
import { resolvePluginTools } from "./plugins/index.js";
import { buildBootstrapTs, buildClientConfig } from "./generate.js";

export function createMcpServerDefinition(
  input: CreateMcpServerInput,
  opts?: { id?: string; now?: string },
): McpServerDefinition {
  const parsed = CreateMcpServerInputSchema.parse(input);
  const now = opts?.now ?? new Date().toISOString();
  const id = opts?.id ?? crypto.randomUUID();
  const tools = resolvePluginTools(parsed.plugins, parsed.cloud);

  const base: McpServerDefinition = {
    id,
    name: parsed.name,
    description: parsed.description,
    transport: parsed.transport,
    plugins: parsed.plugins,
    cloud: parsed.plugins.includes("cloud")
      ? parsed.cloud ?? {
          primary: "cloudflare",
          adapters: ["cloudflare", "aws", "gcp", "azure"],
          mock: true,
        }
      : undefined,
    tools,
    ownerId: parsed.ownerId,
    createdAt: now,
    updatedAt: now,
    clientConfig: {},
    bootstrapTs: "",
  };

  base.clientConfig = buildClientConfig(base.name, base.transport, base.id);
  base.bootstrapTs = buildBootstrapTs(base);
  return base;
}

export function listAvailablePlugins() {
  return [
    {
      id: "cloud" as const,
      name: "Cloud Plugin",
      description:
        "MCS cloud tools — deploy, scale, buckets, functions, logs — backed by Cloudflare/AWS/GCP/Azure adapters.",
      recommended: true,
    },
    {
      id: "supabase" as const,
      name: "Supabase Plugin",
      description: "Data-plane tools: SQL, RLS, storage, vectors (stub tools until Phase 2b).",
      recommended: true,
    },
    {
      id: "docker" as const,
      name: "Docker Plugin",
      description: "Build/run/push container images via MCS docker profile.",
      recommended: false,
    },
    {
      id: "kubernetes" as const,
      name: "Kubernetes Plugin",
      description: "Cluster and workload management via MCS kubernetes profile.",
      recommended: false,
    },
  ];
}
