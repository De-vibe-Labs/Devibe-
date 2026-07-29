import type { CloudPluginOptions, McpToolSpec } from "../types.js";

/** MCS-aligned cloud tools exposed by the cloud plugin. */
export function cloudPluginTools(options: CloudPluginOptions): McpToolSpec[] {
  const adapters = options.adapters.join(", ");
  const common = {
    plugin: "cloud" as const,
  };

  return [
    {
      ...common,
      name: "deploy_application",
      title: "Deploy application",
      description: `Deploy or update an application via MCS cloud adapters (${adapters}). Primary: ${options.primary}.`,
      inputSchema: {
        type: "object",
        properties: {
          projectId: { type: "string" },
          name: { type: "string" },
          environment: { type: "string", enum: ["preview", "staging", "production"] },
          approved: { type: "boolean" },
        },
        required: ["projectId", "name"],
      },
    },
    {
      ...common,
      name: "create_database",
      title: "Create database",
      description: "Provision managed database on the selected cloud adapter (prefer Supabase dataplane when attached).",
      inputSchema: {
        type: "object",
        properties: {
          projectId: { type: "string" },
          engine: { type: "string", enum: ["postgres", "d1", "sqlite"] },
        },
        required: ["projectId"],
      },
    },
    {
      ...common,
      name: "create_bucket",
      title: "Create bucket",
      description: "Create object storage bucket (R2 / S3 / GCS / Azure Blob via adapter).",
      inputSchema: {
        type: "object",
        properties: {
          projectId: { type: "string" },
          name: { type: "string" },
        },
        required: ["projectId", "name"],
      },
    },
    {
      ...common,
      name: "create_function",
      title: "Create function",
      description: "Create serverless / edge function on the primary adapter.",
      inputSchema: {
        type: "object",
        properties: {
          projectId: { type: "string" },
          name: { type: "string" },
          runtime: { type: "string" },
        },
        required: ["projectId", "name"],
      },
    },
    {
      ...common,
      name: "scale_service",
      title: "Scale service",
      description: "Scale a named service using CloudProviderInterface.scale.",
      inputSchema: {
        type: "object",
        properties: {
          projectId: { type: "string" },
          service: { type: "string" },
          desired: { type: "number" },
          environment: { type: "string", enum: ["preview", "staging", "production"] },
        },
        required: ["projectId", "service", "desired"],
      },
    },
    {
      ...common,
      name: "restart_service",
      title: "Restart service",
      description: "Restart / recycle a service deployment.",
      inputSchema: {
        type: "object",
        properties: {
          projectId: { type: "string" },
          service: { type: "string" },
        },
        required: ["projectId", "service"],
      },
    },
    {
      ...common,
      name: "rollback",
      title: "Rollback",
      description: "Roll back to a previous application revision.",
      inputSchema: {
        type: "object",
        properties: {
          projectId: { type: "string" },
          revision: { type: "string" },
          approved: { type: "boolean" },
        },
        required: ["projectId"],
      },
    },
    {
      ...common,
      name: "destroy",
      title: "Destroy resources",
      description: "Tear down project resources for the adapter (approval required).",
      inputSchema: {
        type: "object",
        properties: {
          projectId: { type: "string" },
          approved: { type: "boolean" },
        },
        required: ["projectId"],
      },
    },
    {
      ...common,
      name: "get_logs",
      title: "Get logs",
      description: "Fetch recent logs for a service.",
      inputSchema: {
        type: "object",
        properties: {
          projectId: { type: "string" },
          service: { type: "string" },
          limit: { type: "number" },
        },
        required: ["projectId"],
      },
    },
    {
      ...common,
      name: "get_metrics",
      title: "Get metrics",
      description: "Fetch metrics snapshot for a service.",
      inputSchema: {
        type: "object",
        properties: {
          projectId: { type: "string" },
          service: { type: "string" },
        },
        required: ["projectId"],
      },
    },
    {
      ...common,
      name: "list_regions",
      title: "List regions",
      description: "List regions / placements for the primary adapter.",
      inputSchema: {
        type: "object",
        properties: {
          adapterId: { type: "string" },
        },
      },
    },
    {
      ...common,
      name: "list_clusters",
      title: "List clusters",
      description: "List clusters when the adapter manages them (empty for pure serverless).",
      inputSchema: {
        type: "object",
        properties: {
          projectId: { type: "string" },
        },
      },
    },
    {
      ...common,
      name: "list_namespaces",
      title: "List namespaces",
      description: "List namespaces when applicable.",
      inputSchema: {
        type: "object",
        properties: {
          clusterId: { type: "string" },
        },
      },
    },
    {
      ...common,
      name: "manage_project",
      title: "Manage project",
      description: "DeVibe orchestration façade (status | plan | apply | scale | destroy | sync-memory).",
      inputSchema: {
        type: "object",
        properties: {
          action: {
            type: "string",
            enum: ["status", "plan", "apply", "scale", "destroy", "sync-memory"],
          },
          projectId: { type: "string" },
          approved: { type: "boolean" },
        },
        required: ["action"],
      },
    },
  ];
}
