/**
 * Checked-in Cloudflare Pulumi starter — mirror of renderCloudflarePulumiModule().
 * Phase 1: DeVibe applies via mocked CloudProviderInterface adapters.
 * Promote with `pulumi up` when leaving mock mode.
 */
import * as pulumi from "@pulumi/pulumi";
import * as cloudflare from "@pulumi/cloudflare";

const config = new pulumi.Config();
const accountId = config.require("accountId");
const projectName = config.get("projectName") ?? "genesis-alpha";

const db = new cloudflare.D1Database("devibe-d1", {
  accountId,
  name: `${projectName}-d1`,
});

const bucket = new cloudflare.R2Bucket("devibe-r2", {
  accountId,
  name: `${projectName}-artifacts`,
});

const queue = new cloudflare.Queue("devibe-agent-events", {
  accountId,
  name: `${projectName}-agent-events`,
});

const worker = new cloudflare.WorkersScript("devibe-worker", {
  accountId,
  name: `${projectName}-edge`,
  content: `
    export default {
      async fetch() {
        return Response.json({ ok: true, project: "${projectName}" });
      }
    }
  `,
  module: true,
});

const pages = new cloudflare.PagesProject("devibe-pages", {
  accountId,
  name: `${projectName}-web`,
  productionBranch: "main",
});

export const d1DatabaseId = db.id;
export const r2BucketName = bucket.name;
export const queueId = queue.id;
export const workerName = worker.name;
export const pagesName = pages.name;
