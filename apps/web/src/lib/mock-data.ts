/**
 * Typed mock fixtures for the DeVibe web surface.
 *
 * These mirror the shapes we expect from `@devibe/cloud-providers` adapters and
 * the MCP server so screens can be swapped onto live data without refactoring.
 */

export type Health = "healthy" | "degraded" | "critical"
export type AgentState = "active" | "idle" | "thinking" | "blocked"
export type ProviderId = "cloudflare" | "aws" | "gcp" | "azure"

/* ----------------------------------------------------------------- Fleet */

export interface FleetService {
  id: string
  category: string
  provider: string
  health: Health
  metricLabel: string
  metricValue: string
  utilization: number
  note: string
}

export const fleetServices: FleetService[] = [
  {
    id: "edge",
    category: "Network",
    provider: "Cloudflare",
    health: "degraded",
    metricLabel: "Edge load",
    metricValue: "92%",
    utilization: 92,
    note: "Scaling instances in us-east-1",
  },
  {
    id: "storage",
    category: "Storage",
    provider: "GCP Artifacts",
    health: "healthy",
    metricLabel: "Availability",
    metricValue: "99.99%",
    utilization: 99,
    note: "Buckets optimized by AI orchestrator",
  },
  {
    id: "compute",
    category: "Compute",
    provider: "AWS Lambda",
    health: "healthy",
    metricLabel: "Execution cost",
    metricValue: "-$42.10/hr",
    utilization: 34,
    note: "Spot instances active (region: global)",
  },
]

export interface ReadinessCheck {
  id: string
  label: string
  value: string
  tone: "success" | "warning" | "danger"
}

export const readiness = {
  score: 88,
  checks: [
    { id: "tests", label: "Unit tests", value: "100%", tone: "success" },
    { id: "patches", label: "Security patches", value: "Lacking (2)", tone: "warning" },
    { id: "budget", label: "Cost guardrails", value: "Within budget", tone: "success" },
  ] satisfies ReadinessCheck[],
}

export const edgeMetrics = [
  { id: "london", label: "Latency: London", value: "14ms" },
  { id: "tokyo", label: "Traffic: Tokyo", value: "8.4 GB/s" },
  { id: "iad", label: "Requests: Ashburn", value: "1.2M/min" },
]

/* ---------------------------------------------------------------- Agents */

export interface Agent {
  id: string
  name: string
  role: string
  icon: "database" | "shield" | "users" | "gauge" | "plus" | "coins" | "sparkles" | "code" | "rocket"
  state: AgentState
  statusLine: string
  metric: string
}

export const agents: Agent[] = [
  {
    id: "data",
    name: "Data Agent",
    role: "Schemas & migrations",
    icon: "database",
    state: "active",
    statusLine: "Indexing",
    metric: "142 queries",
  },
  {
    id: "security",
    name: "Security Agent",
    role: "Scanning & IAM",
    icon: "shield",
    state: "active",
    statusLine: "Locked",
    metric: "0 criticals",
  },
  {
    id: "ux",
    name: "UX Agent",
    role: "Flows & a11y",
    icon: "users",
    state: "idle",
    statusLine: "Standby",
    metric: "6 flows",
  },
  {
    id: "perf",
    name: "Perf Agent",
    role: "Budgets & vitals",
    icon: "gauge",
    state: "thinking",
    statusLine: "Profiling",
    metric: "LCP 1.1s",
  },
  {
    id: "qa",
    name: "QA Agent",
    role: "Tests & regressions",
    icon: "plus",
    state: "active",
    statusLine: "Green",
    metric: "4% flake",
  },
  {
    id: "cost",
    name: "Cost Agent",
    role: "Spend guardrails",
    icon: "coins",
    state: "active",
    statusLine: "Saving",
    metric: "+$1.2k/q",
  },
  {
    id: "orchestrator",
    name: "Orchestrator",
    role: "Swarm coordination",
    icon: "sparkles",
    state: "thinking",
    statusLine: "Thinking",
    metric: "12 events/min",
  },
]

/* ------------------------------------------------------ Autonomous actions */

export interface AutonomousAction {
  id: string
  time: string
  source: string
  tone: "primary" | "danger" | "success" | "accent"
  body: string
}

export const autonomousActions: AutonomousAction[] = [
  {
    id: "a1",
    time: "14:22:04",
    source: "ORCHESTRATOR",
    tone: "primary",
    body: "Detected latency spike in eu-west-3. Provisioning 4 edge clusters on Cloudflare Workers to offload 20% traffic.",
  },
  {
    id: "a2",
    time: "14:21:58",
    source: "SECURITY",
    tone: "danger",
    body: 'Identified suspicious login pattern from 182.xx.xx.xx. Rotating IAM session tokens for project "Genesis-Alpha".',
  },
  {
    id: "a3",
    time: "14:21:30",
    source: "COST GUARD",
    tone: "success",
    body: "AWS On-Demand instances swapped for Spot instances in us-west-1. Estimated savings: +$182.40/day.",
  },
  {
    id: "a4",
    time: "14:20:12",
    source: "DEVOPS",
    tone: "accent",
    body: "Automated rollback successful for commit #fe45a1. Reason: performance regression detected in staging.",
  },
  {
    id: "a5",
    time: "14:19:47",
    source: "DATA",
    tone: "primary",
    body: "Added composite index on orders(user_id, created_at). Query p95 improved from 340ms to 28ms.",
  },
]

/* -------------------------------------------------------------- Providers */

export interface Provider {
  id: ProviderId
  name: string
  role: string
  health: Health
  region: string
  latency: string
  monthlyCost: string
  share: number
  primary: boolean
}

export const providers: Provider[] = [
  {
    id: "cloudflare",
    name: "Cloudflare",
    role: "Workers · D1 · R2",
    health: "healthy",
    region: "Global edge · 310 PoPs",
    latency: "14ms p99",
    monthlyCost: "$284",
    share: 62,
    primary: true,
  },
  {
    id: "aws",
    name: "AWS",
    role: "Lambda · RDS · S3",
    health: "healthy",
    region: "us-east-1 · eu-west-3",
    latency: "48ms p99",
    monthlyCost: "$1,412",
    share: 24,
    primary: false,
  },
  {
    id: "gcp",
    name: "Google Cloud",
    role: "Cloud Run · Artifacts",
    health: "healthy",
    region: "europe-west4",
    latency: "61ms p99",
    monthlyCost: "$396",
    share: 9,
    primary: false,
  },
  {
    id: "azure",
    name: "Azure",
    role: "Container Apps",
    health: "degraded",
    region: "westeurope",
    latency: "88ms p99",
    monthlyCost: "$118",
    share: 5,
    primary: false,
  },
]

export interface DistributionOption {
  id: string
  title: string
  stack: string
  description: string
  recommended: boolean
  scaleLabel: string
}

export const distributionOptions: DistributionOption[] = [
  {
    id: "edge-first",
    title: "Edge-first",
    stack: "Cloudflare Workers + D1 + R2",
    description: "Lowest latency and cost for small-to-mid scale. Zero cold starts at the edge.",
    recommended: true,
    scaleLabel: "Small scale",
  },
  {
    id: "serverless",
    title: "Serverless multi-cloud",
    stack: "Lambda + Cloud Run + Workers",
    description: "Spread stateless workloads across providers with automatic failover routing.",
    recommended: false,
    scaleLabel: "Mid scale",
  },
  {
    id: "kubernetes",
    title: "Kubernetes",
    stack: "EKS + GKE Autopilot",
    description: "Full control for stateful services, service meshes and long-running jobs.",
    recommended: false,
    scaleLabel: "Large scale",
  },
  {
    id: "hybrid",
    title: "Hybrid / BYO accounts",
    stack: "Your cloud accounts",
    description: "DeVibe orchestrates infrastructure inside your own accounts and billing.",
    recommended: false,
    scaleLabel: "Enterprise",
  },
]

export interface LiveResource {
  id: string
  name: string
  kind: string
  provider: string
  usageLabel: string
  usage: number
  agentManaged: boolean
}

export const liveResources: LiveResource[] = [
  {
    id: "r1",
    name: "genesis-api",
    kind: "Worker",
    provider: "Cloudflare",
    usageLabel: "12.4M req / 20M",
    usage: 62,
    agentManaged: true,
  },
  {
    id: "r2",
    name: "genesis-primary",
    kind: "D1 database",
    provider: "Cloudflare",
    usageLabel: "3.1 GB / 5 GB",
    usage: 62,
    agentManaged: true,
  },
  {
    id: "r3",
    name: "genesis-assets",
    kind: "R2 bucket",
    provider: "Cloudflare",
    usageLabel: "84 GB / 250 GB",
    usage: 34,
    agentManaged: true,
  },
  {
    id: "r4",
    name: "billing-webhooks",
    kind: "Lambda",
    provider: "AWS",
    usageLabel: "402k inv / 1M",
    usage: 40,
    agentManaged: false,
  },
  {
    id: "r5",
    name: "vector-index",
    kind: "Cloud Run",
    provider: "GCP",
    usageLabel: "18 vCPU-hr / 40",
    usage: 45,
    agentManaged: true,
  },
]

export interface McpTool {
  id: string
  name: string
  status: string
  state: "running" | "idle" | "pending"
}

export const mcpTools: McpTool[] = [
  { id: "tf", name: "Terraform Cloud", status: "Executing: plan", state: "running" },
  { id: "k8s", name: "K8s Scaler", status: "Idle: optimization", state: "idle" },
  { id: "hook", name: "Deploy Hook", status: "Pending approval", state: "pending" },
]

/* ---------------------------------------------------------------- Projects */

export interface Project {
  id: string
  name: string
  slug: string
  summary: string
  health: Health
  activeAgents: number
  lastDeploy: string
  provider: string
}

export const projects: Project[] = [
  {
    id: "p1",
    name: "Genesis Alpha",
    slug: "genesis-alpha",
    summary: "Multi-tenant SaaS control plane",
    health: "healthy",
    activeAgents: 5,
    lastDeploy: "4m ago",
    provider: "Cloudflare",
  },
  {
    id: "p2",
    name: "Helio Payments",
    slug: "helio-payments",
    summary: "Stripe-backed billing service",
    health: "degraded",
    activeAgents: 3,
    lastDeploy: "1h ago",
    provider: "AWS",
  },
  {
    id: "p3",
    name: "Atlas Docs",
    slug: "atlas-docs",
    summary: "Static docs + search index",
    health: "healthy",
    activeAgents: 1,
    lastDeploy: "yesterday",
    provider: "Cloudflare",
  },
]

/* ------------------------------------------------------------------ Chat */

export interface ChatMessage {
  id: string
  author: "user" | "agent"
  agentName?: string
  agentRole?: string
  body: string
  timestamp: string
  code?: { filename: string; language: string; content: string }
  artifacts?: string[]
}

export const chatThread: ChatMessage[] = [
  {
    id: "m1",
    author: "user",
    body: "Build a multi-tenant SaaS control plane with org-scoped RBAC, usage metering and a Stripe-backed billing page. Ship it to the edge.",
    timestamp: "14:02",
  },
  {
    id: "m2",
    author: "agent",
    agentName: "Product Agent",
    agentRole: "Specs & scope",
    body: "Parsed the brief into 3 epics and 14 stories. I flagged one ambiguity: metering can be per-seat or per-request. I defaulted to per-request with a seat cap, since you mentioned usage. PRD is written to `PRD.md` and tagged for the orchestrator.",
    timestamp: "14:02",
    artifacts: ["PRD.md", "prompts/features/control-plane.md"],
  },
  {
    id: "m3",
    author: "agent",
    agentName: "Data Agent",
    agentRole: "Schemas & migrations",
    body: "Derived the schema from the PRD. Organizations own users through a join table so a user can belong to many orgs with different roles. Row-level scoping is enforced on every query by `orgId`.",
    timestamp: "14:03",
    code: {
      filename: "packages/database/schema.ts",
      language: "typescript",
      content: `export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  plan: text("plan", { enum: ["free", "pro", "enterprise"] })
    .notNull()
    .default("free"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
})

export const memberships = sqliteTable("memberships", {
  orgId: text("org_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  role: text("role", { enum: ["owner", "admin", "member"] }).notNull(),
})`,
    },
  },
  {
    id: "m4",
    author: "agent",
    agentName: "DevOps Agent",
    agentRole: "Infra & deploys",
    body: "Generated Pulumi stacks for the edge-first topology: one Worker per region, D1 for the primary store, R2 for exports. Cost projection is $284/mo at your current traffic. I opened a PR rather than applying — the plan touches production routing.",
    timestamp: "14:04",
    artifacts: ["infra/pulumi/cloudflare/index.ts", "PR #482"],
  },
  {
    id: "m5",
    author: "user",
    body: "Approve the PR, but keep Azure out of the routing table for now.",
    timestamp: "14:06",
  },
]

export const suggestedPrompts = [
  "Turn this Figma file into a typed component library",
  "Add org-scoped RBAC to my existing Next.js app",
  "Audit my AWS bill and move cold paths to the edge",
  "Write integration tests for the checkout flow",
]

export const collaborationTrace = [
  { id: "c1", agent: "Orchestrator", body: "Fan-out: security + cost review on PR #482.", tone: "primary" as const },
  { id: "c2", agent: "Security Agent", body: "No public buckets. IAM least-privilege holds.", tone: "success" as const },
  { id: "c3", agent: "Cost Agent", body: "Azure removal saves $118/mo. Approving.", tone: "accent" as const },
]

/* ------------------------------------------------------------------- IDE */

export interface FileNode {
  id: string
  name: string
  kind: "file" | "folder"
  gitStatus?: "M" | "A" | "U" | "D"
  language?: string
  children?: FileNode[]
  content?: string
}

export const fileTree: FileNode[] = [
  {
    id: "devibe",
    name: ".devibe",
    kind: "folder",
    children: [
      {
        id: "config",
        name: "config.yaml",
        kind: "file",
        gitStatus: "M",
        language: "yaml",
        content: `# DeVibe project configuration
name: genesis-alpha
scale: small

github:
  connected: true
  repo: de-vibe-labs/genesis-alpha
  branch: main

cloud:
  primary: cloudflare
  adapters:
    - cloudflare
    - aws
    - gcp
  autoScale: true

agents:
  - product
  - ux
  - frontend
  - backend
  - devops
  - security
  - qa
`,
      },
    ],
  },
  {
    id: "src",
    name: "src",
    kind: "folder",
    children: [
      {
        id: "index",
        name: "index.tsx",
        kind: "file",
        gitStatus: "A",
        language: "typescript",
        content: `import { createRoot } from "react-dom/client"
import { App } from "./app"

const container = document.getElementById("root")

if (!container) {
  throw new Error("Root container missing in index.html")
}

createRoot(container).render(<App />)
`,
      },
      {
        id: "components",
        name: "components",
        kind: "folder",
        children: [
          {
            id: "agentorb",
            name: "AgentOrb.tsx",
            kind: "file",
            gitStatus: "U",
            language: "typescript",
            content: `import { useState } from "react"
import { motion } from "framer-motion"

export const AgentOrb = ({ active }: { active: boolean }) => {
  const [pulsing, setPulsing] = useState(false)

  return (
    <motion.div
      animate={{
        scale: active ? 1.2 : 1,
        boxShadow: active ? "0 0 20px #7C3AED" : "none",
      }}
      onHoverStart={() => setPulsing(true)}
      onHoverEnd={() => setPulsing(false)}
      data-pulsing={pulsing}
      className="w-12 h-12 rounded-full bg-primary"
    />
  )
}

// DeVibe AI: Added sophisticated glow transition
`,
          },
        ],
      },
    ],
  },
  {
    id: "package",
    name: "package.json",
    kind: "file",
    language: "json",
    content: `{
  "name": "genesis-alpha",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "deploy": "wrangler deploy"
  },
  "dependencies": {
    "framer-motion": "^11.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
`,
  },
  {
    id: "readme",
    name: "README.md",
    kind: "file",
    language: "markdown",
    content: `# Genesis Alpha

Multi-tenant SaaS control plane, orchestrated by DeVibe agents.

## Stack

- Cloudflare Workers (edge compute)
- D1 (primary datastore)
- R2 (exports and assets)

## Agent notes

The DevOps Agent owns \`infra/pulumi\`. Do not hand-edit generated stacks —
update \`.devibe/config.yaml\` and let the orchestrator regenerate them.
`,
  },
]

export interface AgentSuggestion {
  id: string
  agent: string
  file: string
  summary: string
  before: string
  after: string
}

export const agentSuggestions: AgentSuggestion[] = [
  {
    id: "s1",
    agent: "Frontend Agent",
    file: "src/components/AgentOrb.tsx",
    summary: "Respect reduced-motion preferences on the orb transition",
    before: `animate={{
  scale: active ? 1.2 : 1,
}}`,
    after: `animate={{
  scale: prefersReducedMotion ? 1 : active ? 1.2 : 1,
}}`,
  },
  {
    id: "s2",
    agent: "QA Agent",
    file: "src/components/AgentOrb.tsx",
    summary: "Add an accessible label so the orb state is announced",
    before: `className="w-12 h-12 rounded-full bg-primary"`,
    after: `role="status"
aria-label={active ? "Agent active" : "Agent idle"}
className="w-12 h-12 rounded-full bg-primary"`,
  },
]
