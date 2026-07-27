import { z } from "zod";
import {
  DevibeProjectSchema,
  parsePrdFrontMatter,
  parseProjectYaml,
} from "@devibe/project-config";
import { defineTool } from "./base.js";
import { syncFromPrd } from "../services/orchestration.js";

/**
 * Parse a tagged PRD / prompt / project.yaml and optionally kick off management.
 */
export const syncFromPrdTool = defineTool({
  name: "sync_from_prd",
  title: "Sync From PRD",
  description:
    "Parse a tagged PRD, .prompt file, or project.yaml content. When github-connected + cloud-enabled tags are valid, unlocks full lifecycle management and can auto-run manage_project.",
  inputSchema: {
    content: z
      .string()
      .optional()
      .describe("Raw PRD markdown, .prompt, or YAML text containing a devibe block"),
    project: DevibeProjectSchema.optional().describe(
      "Already-parsed project metadata (skips content parsing)",
    ),
    format: z.enum(["auto", "yaml", "front-matter"]).default("auto"),
    auto_manage: z.boolean().default(true),
    manage_action: z
      .enum(["status", "plan", "apply", "scale", "destroy", "sync-memory"])
      .default("plan"),
    approved: z.boolean().optional(),
  },
  async handler(args, ctx) {
    let project = args.project;
    if (!project) {
      if (!args.content) {
        throw new Error("Provide either `content` or `project`");
      }
      if (args.format === "yaml") {
        project = parseProjectYaml(args.content).project;
      } else if (args.format === "front-matter") {
        project = parsePrdFrontMatter(args.content).project;
      } else {
        try {
          project = parseProjectYaml(args.content).project;
        } catch {
          project = parsePrdFrontMatter(args.content).project;
        }
      }
    }

    return syncFromPrd({
      project,
      autoManage: args.auto_manage,
      manageAction: args.manage_action,
      approved: args.approved,
      actor: ctx.actorId,
    });
  },
});
