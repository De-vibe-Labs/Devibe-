import { Database, Globe, LayoutGrid, Network, Sparkles } from "lucide-react"

/**
 * Node positions are declared once so the SVG edges and the HTML node overlays
 * stay in sync. Values are percentages of the canvas box.
 */
const nodes = {
  users: { x: 10, y: 42, label: "Global users", icon: Globe, tone: "neutral" as const },
  euWest: { x: 32, y: 18, label: "eu-west-1", icon: Network, tone: "accent" as const },
  apSouth: { x: 32, y: 66, label: "ap-south-1", icon: Network, tone: "accent" as const },
  gateway: { x: 56, y: 42, label: "AI gateway", icon: Sparkles, tone: "primary" as const },
  clusters: { x: 80, y: 18, label: "Clusters", icon: LayoutGrid, tone: "neutral" as const },
  database: { x: 80, y: 56, label: "Serverless DB", icon: Database, tone: "neutral" as const },
}

const edges: Array<{ from: keyof typeof nodes; to: keyof typeof nodes; tone: "accent" | "primary" }> = [
  { from: "users", to: "euWest", tone: "accent" },
  { from: "users", to: "apSouth", tone: "accent" },
  { from: "euWest", to: "gateway", tone: "accent" },
  { from: "apSouth", to: "gateway", tone: "accent" },
  { from: "gateway", to: "clusters", tone: "primary" },
  { from: "gateway", to: "database", tone: "primary" },
]

const strokes = { accent: "#00dce5", primary: "#7c3aed" }

const toneStyles = {
  neutral: "border-border-strong bg-surface-2 text-muted-foreground",
  accent: "border-accent/60 bg-accent/10 text-accent",
  primary: "border-primary bg-primary/20 text-primary-soft shadow-[0_0_28px_rgba(124,58,237,0.55)]",
}

export function TopologyCanvas() {
  return (
    <div className="relative min-h-[26rem] flex-1 overflow-hidden rounded-2xl border border-border bg-deep">
      {/* Grid backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #1c1c22 1px, transparent 1px), linear-gradient(to bottom, #1c1c22 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Edges */}
      <svg
        className="absolute inset-0 size-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        role="img"
        aria-label="Traffic flows from global users through the eu-west-1 and ap-south-1 edge regions into the DeVibe AI gateway, which routes to compute clusters and a serverless database."
      >
        {edges.map((edge) => {
          const a = nodes[edge.from]
          const b = nodes[edge.to]
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={strokes[edge.tone]}
              strokeOpacity="0.55"
              strokeWidth="0.28"
              strokeDasharray="1.4 1.6"
              vectorEffect="non-scaling-stroke"
              className="animate-dash"
            />
          )
        })}
      </svg>

      {/* Nodes */}
      {Object.entries(nodes).map(([key, node]) => (
        <div
          key={key}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          <span
            className={`flex size-12 items-center justify-center rounded-xl border ${toneStyles[node.tone]} ${
              node.tone === "primary" ? "rounded-full" : ""
            }`}
          >
            <node.icon className="size-5" />
          </span>
          <span className="font-mono text-[10px] tracking-wider whitespace-nowrap text-muted-foreground uppercase">
            {node.label}
          </span>
        </div>
      ))}
    </div>
  )
}
