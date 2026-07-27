import type { ScalePolicy } from "@devibe/project-config";

export interface PulumiModuleInput {
  projectName: string;
  projectId: string;
  scalePolicy: ScalePolicy;
  accountIdPlaceholder?: string;
}

/**
 * Returns TypeScript source the DevOps Agent would write for a minimal
 * Cloudflare Pulumi stack (Workers + D1 + R2 + Queue + Pages).
 * This is a template string for agent generation — not executed here.
 */
export function renderCloudflarePulumiModule(input: PulumiModuleInput): string {
  const account = input.accountIdPlaceholder ?? "CLOUDFLARE_ACCOUNT_ID";
  const safeName = input.projectName.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase();

  return `/**
 * DeVibe-generated Pulumi module — Cloudflare small-scale starter
 * project: ${input.projectName}
 * project_id: ${input.projectId}
 * scale_policy: ${input.scalePolicy}
 *
 * Generated for agent-managed IaC. Phase 1 applies are mocked;
 * use \`pulumi up\` with real credentials when promoting out of mock mode.
 */
import * as pulumi from "@pulumi/pulumi";
import * as cloudflare from "@pulumi/cloudflare";

const config = new pulumi.Config();
const accountId = config.get("accountId") ?? "${account}";
const projectName = "${safeName}";

// D1 database for project state / memory
const db = new cloudflare.D1Database("devibe-d1", {
  accountId,
  name: \`\${projectName}-d1\`,
});

// R2 for artifacts, embeddings dumps, generated code
const bucket = new cloudflare.R2Bucket("devibe-r2", {
  accountId,
  name: \`\${projectName}-artifacts\`,
});

// Queue for agent-to-agent JSON events
const queue = new cloudflare.Queue("devibe-agent-events", {
  accountId,
  name: \`\${projectName}-agent-events\`,
});

// Edge worker (orchestration entry)
const worker = new cloudflare.WorkersScript("devibe-worker", {
  accountId,
  name: \`\${projectName}-edge\`,
  content: \`
    export default {
      async fetch(request, env) {
        return new Response(JSON.stringify({
          ok: true,
          project: "\${projectName}",
          projectId: "${input.projectId}",
          scalePolicy: "${input.scalePolicy}",
        }), { headers: { "content-type": "application/json" } });
      }
    }
  \`,
  module: true,
});

// Pages project for the Next.js / frontend app
const pages = new cloudflare.PagesProject("devibe-pages", {
  accountId,
  name: \`\${projectName}-web\`,
  productionBranch: "main",
});

export const d1DatabaseId = db.id;
export const r2BucketName = bucket.name;
export const queueId = queue.id;
export const workerName = worker.name;
export const pagesName = pages.name;
export const mockNote = "Phase 1: DeVibe manage_project applies this plan via mocked adapters.";
`;
}

export function listTemplateIds(): string[] {
  return ["pulumi-cloudflare-small-scale"];
}
