/**
 * Local demo — runs sync_from_prd → manage_project(apply) against mocked adapters.
 * Usage: pnpm --filter @devibe/mcp-server exec tsx src/demo.ts
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parseProjectYaml } from "@devibe/project-config";
import { resetMockCloudStore } from "@devibe/cloud-providers";
import {
  manageProject,
  syncFromPrd,
  resetOrchestrationMemory,
} from "./services/orchestration.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../../examples/genesis-alpha");

async function main(): Promise<void> {
  resetMockCloudStore();
  resetOrchestrationMemory();

  const yaml = await readFile(join(root, ".devibe/project.yaml"), "utf8");
  const { project } = parseProjectYaml(yaml);

  const synced = await syncFromPrd({
    project,
    autoManage: true,
    manageAction: "plan",
    actor: "demo",
  });
  console.log("=== sync_from_prd ===");
  console.log(JSON.stringify({ banner: synced.banner, ok: synced.ok }, null, 2));

  const applied = await manageProject({
    project,
    action: "apply",
    approved: true,
    actor: "demo",
  });
  console.log("=== manage_project(apply) ===");
  console.log(
    JSON.stringify(
      {
        ok: applied.ok,
        banner: applied.banner,
        resources: applied.resources?.map((r) => ({
          name: r.name,
          kind: r.kind,
          provider: r.provider,
          status: r.status,
        })),
        events: applied.events.map((e) => `${e.agent}:${e.type}`),
      },
      null,
      2,
    ),
  );

  const scaled = await manageProject({
    project,
    action: "scale",
    service: "edge-worker",
    desired: 4,
    target: "production",
    actor: "demo",
  });
  console.log("=== manage_project(scale) ===");
  console.log(JSON.stringify(scaled.scale, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
