import { z } from "zod";
import { DevibeProjectSchema } from "@devibe/project-config";
import { defineTool } from "./base.js";
import { manageProject } from "../services/orchestration.js";

const ActionSchema = z.enum([
  "status",
  "plan",
  "apply",
  "scale",
  "destroy",
  "sync-memory",
]);

/**
 * High-level MCP entrypoint: one call is enough for agents to detect
 * GitHub + cloud linkage and run plan / apply / scale / destroy.
 */
export const manageProjectTool = defineTool({
  name: "manage_project",
  title: "Manage Project Infrastructure",
  description:
    "Detect GitHub + cloud linkage from project metadata and autonomously plan, provision, scale, or manage the project runtime via mocked CloudProviderInterface adapters.",
  inputSchema: {
    project: DevibeProjectSchema.describe("Parsed .devibe project metadata"),
    action: ActionSchema.default("status"),
    target: z.enum(["preview", "staging", "production"]).optional(),
    service: z.string().optional().describe("Service name for scale actions"),
    desired: z.number().int().positive().optional(),
    approved: z
      .boolean()
      .optional()
      .describe("Human approval for high-cost or destructive actions"),
  },
  async handler(args, ctx) {
    return manageProject({
      project: args.project,
      action: args.action,
      target: args.target,
      service: args.service,
      desired: args.desired,
      approved: args.approved,
      actor: ctx.actorId,
    });
  },
});
