import type { McpPluginId, McpToolSpec } from "../types.js";
import { cloudPluginTools } from "./cloud.js";
import type { CloudPluginOptions } from "../types.js";

const STUB_TOOLS: Record<Exclude<McpPluginId, "cloud">, McpToolSpec[]> = {
  supabase: [
    {
      plugin: "supabase",
      name: "run_sql",
      title: "Run SQL",
      description: "Run controlled SQL against the project Supabase database.",
      inputSchema: {
        type: "object",
        properties: {
          sql: { type: "string" },
          mode: { type: "string", enum: ["read", "write"] },
        },
        required: ["sql"],
      },
    },
    {
      plugin: "supabase",
      name: "generate_rls",
      title: "Generate RLS",
      description: "Generate row-level security policies from schema + roles.",
      inputSchema: {
        type: "object",
        properties: {
          table: { type: "string" },
        },
        required: ["table"],
      },
    },
  ],
  docker: [
    {
      plugin: "docker",
      name: "build_image",
      title: "Build image",
      description: "Build a Docker image from a Dockerfile path.",
      inputSchema: {
        type: "object",
        properties: {
          context: { type: "string" },
          tag: { type: "string" },
        },
        required: ["context", "tag"],
      },
    },
  ],
  kubernetes: [
    {
      plugin: "kubernetes",
      name: "deploy_service",
      title: "Deploy service",
      description: "Deploy a Kubernetes Service + Deployment.",
      inputSchema: {
        type: "object",
        properties: {
          namespace: { type: "string" },
          name: { type: "string" },
          image: { type: "string" },
        },
        required: ["name", "image"],
      },
    },
  ],
};

export function resolvePluginTools(
  plugins: McpPluginId[],
  cloud?: CloudPluginOptions,
): McpToolSpec[] {
  const tools: McpToolSpec[] = [];
  for (const plugin of plugins) {
    if (plugin === "cloud") {
      tools.push(
        ...cloudPluginTools(
          cloud ?? {
            primary: "cloudflare",
            adapters: ["cloudflare", "aws", "gcp", "azure"],
            mock: true,
          },
        ),
      );
    } else {
      tools.push(...STUB_TOOLS[plugin]);
    }
  }
  return tools;
}

export { cloudPluginTools };
