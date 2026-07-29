import { z } from "zod";

export const McpPluginIdSchema = z.enum(["cloud", "supabase", "docker", "kubernetes"]);
export type McpPluginId = z.infer<typeof McpPluginIdSchema>;

export const McpTransportSchema = z.enum(["stdio", "http"]);
export type McpTransport = z.infer<typeof McpTransportSchema>;

export const CloudPluginOptionsSchema = z.object({
  primary: z.enum(["cloudflare", "aws", "gcp", "azure"]).default("cloudflare"),
  adapters: z
    .array(z.enum(["cloudflare", "aws", "gcp", "azure"]))
    .default(["cloudflare", "aws", "gcp", "azure"]),
  mock: z.boolean().default(true),
});
export type CloudPluginOptions = z.infer<typeof CloudPluginOptionsSchema>;

export const CreateMcpServerInputSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9][a-z0-9-_]*$/i, "Name must be alphanumeric with - or _"),
  description: z.string().max(280).optional(),
  transport: McpTransportSchema.default("stdio"),
  plugins: z.array(McpPluginIdSchema).min(1),
  cloud: CloudPluginOptionsSchema.optional(),
  ownerId: z.string().optional(),
});
export type CreateMcpServerInput = z.infer<typeof CreateMcpServerInputSchema>;

export interface McpToolSpec {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  plugin: McpPluginId;
}

export interface McpServerDefinition {
  id: string;
  name: string;
  description?: string;
  transport: McpTransport;
  plugins: McpPluginId[];
  cloud?: CloudPluginOptions;
  tools: McpToolSpec[];
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
  /** Generated Cursor / Claude Code MCP client snippet */
  clientConfig: Record<string, unknown>;
  /** Generated TypeScript bootstrap */
  bootstrapTs: string;
}
