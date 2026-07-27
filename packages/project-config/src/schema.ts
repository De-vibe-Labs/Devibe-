import { z } from "zod";

/** Tags that activate the full GitHub + cloud management loop. */
export const MANAGEMENT_TAGS = [
  "github-connected",
  "cloud-enabled",
  "auto-scale",
] as const;

export type ManagementTag = (typeof MANAGEMENT_TAGS)[number];

export const CloudProviderIdSchema = z.enum([
  "cloudflare",
  "aws",
  "gcp",
  "azure",
]);

export type CloudProviderId = z.infer<typeof CloudProviderIdSchema>;

export const ScalePolicySchema = z.enum([
  "cost-optimized",
  "performance",
  "balanced",
]);

export type ScalePolicy = z.infer<typeof ScalePolicySchema>;

export const GitHubConfigSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  default_branch: z.string().min(1).default("main"),
});

export const CloudConfigSchema = z.object({
  primary: CloudProviderIdSchema,
  adapters: z.array(CloudProviderIdSchema).min(1),
  region_preference: z.union([z.literal("auto"), z.string()]).default("auto"),
  scale_policy: ScalePolicySchema.default("cost-optimized"),
});

export const MemoryConfigSchema = z.object({
  project_id: z.string().uuid(),
});

export const DevibeProjectSchema = z.object({
  version: z.union([z.literal(1), z.literal("1")]).transform(() => 1 as const),
  tags: z.array(z.string()).default([]),
  github: GitHubConfigSchema.optional(),
  cloud: CloudConfigSchema.optional(),
  memory: MemoryConfigSchema.optional(),
  production_auto: z.boolean().default(false),
});

export const ProjectFileSchema = z.object({
  devibe: DevibeProjectSchema,
});

export type DevibeProject = z.infer<typeof DevibeProjectSchema>;
export type ProjectFile = z.infer<typeof ProjectFileSchema>;

export interface LinkageStatus {
  githubConnected: boolean;
  cloudEnabled: boolean;
  autoScale: boolean;
  managementLoopActive: boolean;
  missing: string[];
}

/** True when tags + valid github/cloud config unlock full lifecycle management. */
export function evaluateLinkage(project: DevibeProject): LinkageStatus {
  const tags = new Set(project.tags.map((t) => t.toLowerCase()));
  const githubConnected =
    tags.has("github-connected") && Boolean(project.github?.owner && project.github?.repo);
  const cloudEnabled =
    tags.has("cloud-enabled") &&
    Boolean(project.cloud?.primary && project.cloud.adapters.length > 0);
  const autoScale = tags.has("auto-scale");

  const missing: string[] = [];
  if (!tags.has("github-connected")) missing.push("tag:github-connected");
  else if (!project.github) missing.push("github config");
  if (!tags.has("cloud-enabled")) missing.push("tag:cloud-enabled");
  else if (!project.cloud) missing.push("cloud config");

  return {
    githubConnected,
    cloudEnabled,
    autoScale,
    managementLoopActive: githubConnected && cloudEnabled,
    missing,
  };
}
