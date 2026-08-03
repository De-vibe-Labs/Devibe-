import {
  FULL_UNIVERSAL_CAPABILITIES,
  type McpMarketplaceEntry,
} from "./types.js";

function entry(
  partial: Omit<McpMarketplaceEntry, "capabilities" | "publisher" | "version" | "featured"> &
    Partial<Pick<McpMarketplaceEntry, "capabilities" | "publisher" | "version" | "featured">>,
): McpMarketplaceEntry {
  return {
    publisher: "Monaco Cloud",
    version: "1.0.0",
    featured: false,
    capabilities: FULL_UNIVERSAL_CAPABILITIES,
    ...partial,
  };
}

/** Seed catalog of supported MCP servers for Monaco Cloud Marketplace. */
export const MCP_MARKETPLACE_CATALOG: McpMarketplaceEntry[] = [
  entry({
    id: "supabase",
    name: "Supabase",
    description: "Postgres, Auth, Storage, Realtime, Edge Functions, vectors.",
    category: "data",
    languages: ["typescript", "python"],
    installCommand: "monaco mcp install supabase",
    featured: true,
  }),
  entry({
    id: "github",
    name: "GitHub",
    description: "Repos, PRs, Actions, Issues via GitHub App / fine-grained PAT.",
    category: "devops",
    languages: ["typescript", "go"],
    installCommand: "monaco mcp install github",
    featured: true,
  }),
  entry({
    id: "cloudflare",
    name: "Cloudflare",
    description: "Workers, Pages, R2, DNS, edge runtime (MCS primary).",
    category: "cloud",
    languages: ["typescript"],
    installCommand: "monaco mcp install cloudflare",
    featured: true,
  }),
  entry({
    id: "google-cloud",
    name: "Google Cloud",
    description: "GCP compute, GKE, Cloud SQL via MCS adapter.",
    category: "cloud",
    languages: ["typescript", "python", "go"],
    installCommand: "monaco mcp install google-cloud",
  }),
  entry({
    id: "aws",
    name: "AWS",
    description: "ECS, EKS, Lambda, S3 via MCS adapter.",
    category: "cloud",
    languages: ["typescript", "python", "go"],
    installCommand: "monaco mcp install aws",
  }),
  entry({
    id: "azure",
    name: "Azure",
    description: "AKS, Functions, Blob via MCS adapter.",
    category: "cloud",
    languages: ["typescript", "python"],
    installCommand: "monaco mcp install azure",
  }),
  entry({
    id: "kubernetes",
    name: "Kubernetes",
    description: "Namespaces, Deployments, Ingress, Helm, HPA.",
    category: "devops",
    languages: ["typescript", "go", "rust"],
    installCommand: "monaco mcp install kubernetes",
    featured: true,
  }),
  entry({
    id: "docker",
    name: "Docker",
    description: "Image build, compose, registry push.",
    category: "devops",
    languages: ["typescript", "python", "go"],
    installCommand: "monaco mcp install docker",
  }),
  entry({
    id: "stripe",
    name: "Stripe",
    description: "Billing, subscriptions, webhooks.",
    category: "payments",
    languages: ["typescript", "python", "nodejs"],
    installCommand: "monaco mcp install stripe",
  }),
  entry({
    id: "slack",
    name: "Slack",
    description: "Channels, alerts, agent notifications.",
    category: "comms",
    languages: ["typescript", "python"],
    installCommand: "monaco mcp install slack",
  }),
  entry({
    id: "discord",
    name: "Discord",
    description: "Community bots and ops alerts.",
    category: "comms",
    languages: ["typescript", "python"],
    installCommand: "monaco mcp install discord",
  }),
  entry({
    id: "linear",
    name: "Linear",
    description: "Issues, cycles, project sync.",
    category: "productivity",
    languages: ["typescript"],
    installCommand: "monaco mcp install linear",
  }),
  entry({
    id: "openai",
    name: "OpenAI",
    description: "Codex / GPT models for codegen agents.",
    category: "ai",
    languages: ["typescript", "python"],
    installCommand: "monaco mcp install openai",
    featured: true,
  }),
  entry({
    id: "anthropic",
    name: "Anthropic",
    description: "Claude models for product and security agents.",
    category: "ai",
    languages: ["typescript", "python"],
    installCommand: "monaco mcp install anthropic",
    featured: true,
  }),
  entry({
    id: "redis",
    name: "Redis",
    description: "Cache, queues, session store.",
    category: "data",
    languages: ["typescript", "python", "go"],
    installCommand: "monaco mcp install redis",
  }),
  entry({
    id: "postgres",
    name: "Postgres",
    description: "Managed SQL via MCS / Supabase dataplane.",
    category: "data",
    languages: ["typescript", "python", "go", "rust"],
    installCommand: "monaco mcp install postgres",
  }),
  entry({
    id: "mongodb",
    name: "MongoDB",
    description: "Document store connector.",
    category: "data",
    languages: ["typescript", "python", "nodejs"],
    installCommand: "monaco mcp install mongodb",
  }),
  entry({
    id: "pinecone",
    name: "Pinecone",
    description: "Vector search for agent memory.",
    category: "ai",
    languages: ["typescript", "python"],
    installCommand: "monaco mcp install pinecone",
  }),
  entry({
    id: "qdrant",
    name: "Qdrant",
    description: "Open vector database.",
    category: "ai",
    languages: ["typescript", "python", "rust"],
    installCommand: "monaco mcp install qdrant",
  }),
  entry({
    id: "resend",
    name: "Resend",
    description: "Transactional email.",
    category: "comms",
    languages: ["typescript", "nodejs"],
    installCommand: "monaco mcp install resend",
  }),
  entry({
    id: "twilio",
    name: "Twilio",
    description: "SMS, voice, Verify.",
    category: "comms",
    languages: ["typescript", "python"],
    installCommand: "monaco mcp install twilio",
  }),
  entry({
    id: "vercel",
    name: "Vercel",
    description: "Frontend deploy target via MCS.",
    category: "cloud",
    languages: ["typescript"],
    installCommand: "monaco mcp install vercel",
  }),
  entry({
    id: "terraform",
    name: "Terraform",
    description: "IaC plan/apply alongside Pulumi templates.",
    category: "devops",
    languages: ["typescript", "go"],
    installCommand: "monaco mcp install terraform",
  }),
];

export function listMarketplace(filter?: {
  category?: string;
  q?: string;
}): McpMarketplaceEntry[] {
  let items = MCP_MARKETPLACE_CATALOG;
  if (filter?.category) {
    items = items.filter((i) => i.category === filter.category);
  }
  if (filter?.q) {
    const q = filter.q.toLowerCase();
    items = items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.id.includes(q) ||
        i.description.toLowerCase().includes(q),
    );
  }
  return items;
}

export function getMarketplaceEntry(id: string): McpMarketplaceEntry | undefined {
  return MCP_MARKETPLACE_CATALOG.find((i) => i.id === id);
}
