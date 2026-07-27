/**
 * CLI used by Makefile `agents-run` / `agents-apply` / `scale-status`.
 * Reads root .devibe/project.yaml and invokes the orchestration loop.
 */
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseProjectYaml } from "@devibe/project-config";
import { resetMockCloudStore } from "@devibe/cloud-providers";
import {
  manageProject,
  type ManageAction,
  resetOrchestrationMemory,
} from "../services/orchestration.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../../../");

function arg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

function has(flag: string): boolean {
  return process.argv.includes(flag);
}

async function main(): Promise<void> {
  resetMockCloudStore();
  resetOrchestrationMemory();

  const action = (arg("--action") ?? "plan") as ManageAction;
  const approved = has("--approved");

  const yaml = await readFile(join(root, ".devibe/project.yaml"), "utf8");
  const { project, linkage } = parseProjectYaml(yaml);

  const result = await manageProject({
    project,
    action,
    approved,
    actor: "makefile-agents-run",
  });

  console.log(
    JSON.stringify(
      {
        banner: result.banner,
        linkage,
        ok: result.ok,
        action: result.action,
        error: result.error,
        planId: result.plan?.planId,
        applyId: result.apply?.applyId,
        resourceCount: result.resources?.length,
        events: result.events.map((e) => `${e.agent}:${e.type}`),
        iacPreviewChars: result.iacPreview?.length ?? 0,
      },
      null,
      2,
    ),
  );

  if (!result.ok) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
