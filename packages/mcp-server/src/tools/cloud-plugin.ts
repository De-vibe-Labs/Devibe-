import { z } from "zod";
import { getAdapter } from "@devibe/cloud-providers";
import type { CloudProviderId, DevibeProject } from "@devibe/project-config";
import { defineTool } from "./base.js";
import { manageProject } from "../services/orchestration.js";

function defaultProject(projectId: string, primary: CloudProviderId): DevibeProject {
  return {
    version: 1,
    tags: ["github-connected", "cloud-enabled", "auto-scale"],
    github: { owner: "De-vibe-Labs", repo: "Devibe-", default_branch: "main" },
    cloud: {
      primary,
      adapters: ["cloudflare", "aws", "gcp", "azure"],
      region_preference: "auto",
      scale_policy: "cost-optimized",
    },
    memory: { project_id: projectId },
    production_auto: false,
  };
}

export function createCloudPluginTools(primary: CloudProviderId = "cloudflare") {
  return [
    defineTool({
      name: "deploy_application",
      title: "Deploy application",
      description: "Deploy via primary cloud adapter (plan+apply under the hood).",
      inputSchema: {
        projectId: z.string().min(1),
        name: z.string().min(1),
        environment: z.enum(["preview", "staging", "production"]).default("production"),
        approved: z.boolean().optional(),
      },
      async handler(args, ctx) {
        const project = defaultProject(args.projectId, primary);
        const plan = await manageProject({
          project,
          action: "plan",
          target: args.environment,
          actor: ctx.actorId,
        });
        if (!args.approved) {
          return { status: "planned", requiresApproval: true, service: args.name, plan };
        }
        return manageProject({
          project,
          action: "apply",
          target: args.environment,
          approved: true,
          actor: ctx.actorId,
        });
      },
    }),
    defineTool({
      name: "scale_service",
      title: "Scale service",
      description: "Scale a named service on the primary adapter.",
      inputSchema: {
        projectId: z.string().min(1),
        service: z.string().min(1),
        desired: z.number().positive(),
        environment: z.enum(["preview", "staging", "production"]).default("production"),
      },
      async handler(args, ctx) {
        return manageProject({
          project: defaultProject(args.projectId, primary),
          action: "scale",
          service: args.service,
          desired: args.desired,
          target: args.environment,
          actor: ctx.actorId,
        });
      },
    }),
    defineTool({
      name: "destroy",
      title: "Destroy resources",
      description: "Destroy project cloud resources (approval required).",
      inputSchema: {
        projectId: z.string().min(1),
        approved: z.boolean().optional(),
      },
      async handler(args, ctx) {
        return manageProject({
          project: defaultProject(args.projectId, primary),
          action: "destroy",
          approved: args.approved,
          actor: ctx.actorId,
        });
      },
    }),
    defineTool({
      name: "list_regions",
      title: "List regions",
      description: "List regions for an adapter.",
      inputSchema: {
        adapterId: z.enum(["cloudflare", "aws", "gcp", "azure"]).optional(),
      },
      async handler(args) {
        const adapter = getAdapter(args.adapterId ?? primary);
        return {
          adapterId: adapter.id,
          displayName: adapter.displayName,
          regions:
            adapter.id === "cloudflare"
              ? ["auto", "wnam", "enam", "weur", "apac"]
              : ["us-east-1", "eu-west-1"],
          capabilities: adapter.capabilities,
        };
      },
    }),
    defineTool({
      name: "get_logs",
      title: "Get logs",
      description: "Fetch recent mock logs for a service.",
      inputSchema: {
        projectId: z.string().min(1),
        service: z.string().optional(),
        limit: z.number().int().positive().max(100).default(20),
      },
      async handler(args) {
        return {
          projectId: args.projectId,
          service: args.service ?? "api",
          mock: true,
          lines: Array.from({ length: Math.min(args.limit, 5) }, (_, i) => ({
            at: new Date(Date.now() - i * 1000).toISOString(),
            level: "info",
            message: `[${primary}] healthy · request ok`,
          })),
        };
      },
    }),
  ] as const;
}
