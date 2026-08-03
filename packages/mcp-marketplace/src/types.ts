import { z } from "zod";

/** Universal MCP Standard — every server must expose these capability groups. */
export const UniversalMcpCapabilitySchema = z.object({
  authentication: z.boolean(),
  permissions: z.boolean(),
  tools: z.boolean(),
  resources: z.boolean(),
  events: z.boolean(),
  logging: z.boolean(),
  healthChecks: z.boolean(),
  secrets: z.boolean(),
  versioning: z.boolean(),
  metrics: z.boolean(),
  documentation: z.boolean(),
});
export type UniversalMcpCapabilities = z.infer<typeof UniversalMcpCapabilitySchema>;

export const FULL_UNIVERSAL_CAPABILITIES: UniversalMcpCapabilities = {
  authentication: true,
  permissions: true,
  tools: true,
  resources: true,
  events: true,
  logging: true,
  healthChecks: true,
  secrets: true,
  versioning: true,
  metrics: true,
  documentation: true,
};

export const McpMarketplaceCategorySchema = z.enum([
  "data",
  "cloud",
  "devops",
  "ai",
  "comms",
  "payments",
  "security",
  "productivity",
]);
export type McpMarketplaceCategory = z.infer<typeof McpMarketplaceCategorySchema>;

export const McpMarketplaceEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: McpMarketplaceCategorySchema,
  publisher: z.string().default("Monaco Cloud"),
  version: z.string().default("1.0.0"),
  languages: z.array(z.enum(["typescript", "python", "go", "rust", "nodejs"])),
  capabilities: UniversalMcpCapabilitySchema,
  installCommand: z.string(),
  docsUrl: z.string().optional(),
  featured: z.boolean().default(false),
});
export type McpMarketplaceEntry = z.infer<typeof McpMarketplaceEntrySchema>;
