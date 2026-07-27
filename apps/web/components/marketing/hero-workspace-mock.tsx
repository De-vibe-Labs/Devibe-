import { Circle, Play, Rocket, Sparkles } from "lucide-react"
import { StatusDot } from "@/components/ui/primitives"

const codeLines: { indent: number; tokens: { text: string; className: string }[] }[] = [
  {
    indent: 0,
    tokens: [
      { text: "export const ", className: "text-[#c084fc]" },
      { text: "AgentOrb", className: "text-[#7dd3fc]" },
      { text: " = ({ active }) => {", className: "text-muted-foreground" },
    ],
  },
  {
    indent: 1,
    tokens: [
      { text: "return", className: "text-[#c084fc]" },
      { text: " (", className: "text-muted-foreground" },
    ],
  },
  {
    indent: 2,
    tokens: [
      { text: "<motion.div", className: "text-[#7dd3fc]" },
      { text: " animate", className: "text-[#fbbf24]" },
      { text: "={{", className: "text-muted-foreground" },
    ],
  },
  {
    indent: 3,
    tokens: [
      { text: "scale", className: "text-[#fbbf24]" },
      { text: ": active ? ", className: "text-muted-foreground" },
      { text: "1.2", className: "text-[#86efac]" },
      { text: " : ", className: "text-muted-foreground" },
      { text: "1", className: "text-[#86efac]" },
      { text: ",", className: "text-muted-foreground" },
    ],
  },
  {
    indent: 3,
    tokens: [
      { text: "boxShadow", className: "text-[#fbbf24]" },
      { text: ": ", className: "text-muted-foreground" },
      { text: '"0 0 20px #7C3AED"', className: "text-[#86efac]" },
    ],
  },
  {
    indent: 2,
    tokens: [{ text: "}}", className: "text-muted-foreground" }],
  },
  {
    indent: 2,
    tokens: [
      { text: "className", className: "text-[#fbbf24]" },
      { text: "=", className: "text-muted-foreground" },
      { text: '"size-12 rounded-full bg-primary"', className: "text-[#86efac]" },
    ],
  },
  {
    indent: 2,
    tokens: [{ text: "/>", className: "text-[#7dd3fc]" }],
  },
]

export function HeroWorkspaceMock() {
  return (
    <div className="glass overflow-hidden rounded-2xl shadow-2xl shadow-black/60">
      {/* Window chrome */}
      <div className="flex items-center justify-between gap-4 border-b border-border bg-surface-2/70 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <div aria-hidden="true" className="flex items-center gap-1.5">
            <Circle className="size-2.5 fill-[#ff5f57] text-[#ff5f57]" />
            <Circle className="size-2.5 fill-[#febc2e] text-[#febc2e]" />
            <Circle className="size-2.5 fill-[#28c840] text-[#28c840]" />
          </div>
          <span className="truncate font-mono text-xs text-muted-foreground">devibe.app/genesis-alpha</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-md border border-primary/40 bg-primary/15 px-2 py-1 font-mono text-[10px] text-primary-soft sm:inline-flex">
            <Sparkles className="size-2.5" />
            3 agents working
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-surface-3 px-2 py-1 font-mono text-[10px] text-muted-foreground">
            <Play className="size-2.5" />
            Run
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 font-mono text-[10px] font-medium text-primary-foreground">
            <Rocket className="size-2.5" />
            Deploy
          </span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,0.85fr)]">
        {/* Chat column */}
        <div className="flex min-h-72 flex-col gap-3 border-border p-4 lg:border-r">
          <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">Agent thread</p>

          <div className="ml-auto max-w-[85%] rounded-xl rounded-br-sm border border-border bg-surface-3 px-3 py-2 text-xs leading-relaxed">
            Build a multi-tenant control plane with RBAC and usage metering.
          </div>

          <div className="max-w-[92%] space-y-2 rounded-xl rounded-bl-sm border border-primary/25 bg-primary/10 px-3 py-2">
            <div className="flex items-center gap-1.5">
              <StatusDot tone="primary" pulse />
              <span className="font-mono text-[10px] font-medium text-primary-soft">PRODUCT AGENT</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Parsed into 3 epics, 14 stories. Wrote <span className="font-mono text-foreground">PRD.md</span> and tagged
              it for the orchestrator.
            </p>
          </div>

          <div className="max-w-[92%] space-y-2 rounded-xl rounded-bl-sm border border-border bg-surface-2 px-3 py-2">
            <div className="flex items-center gap-1.5">
              <StatusDot tone="accent" pulse />
              <span className="font-mono text-[10px] font-medium text-accent">DEVOPS AGENT</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Generated Pulumi stacks for edge-first topology. Opened PR #482
              <span className="ml-1 inline-block h-3 w-1 translate-y-0.5 animate-caret bg-accent align-middle" />
            </p>
          </div>

          <div className="mt-auto flex items-center gap-2 rounded-lg border border-border bg-input px-3 py-2">
            <span className="flex-1 truncate text-xs text-muted-foreground">Describe your product idea…</span>
            <span className="font-mono text-[10px] text-muted-foreground">⌘↵</span>
          </div>
        </div>

        {/* Editor column */}
        <div className="flex min-h-72 flex-col border-border bg-deep/60 lg:border-r">
          <div className="flex items-center gap-1 border-b border-border px-3 py-2">
            <span className="rounded-t-md border-b-2 border-primary bg-surface-2 px-2.5 py-1 font-mono text-[10px] text-foreground">
              AgentOrb.tsx
            </span>
            <span className="px-2.5 py-1 font-mono text-[10px] text-muted-foreground">config.yaml</span>
          </div>
          <div className="flex-1 overflow-hidden p-3">
            <pre className="font-mono text-[10px] leading-[1.7] sm:text-[11px]">
              <code>
                {codeLines.map((line, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="w-4 shrink-0 text-right text-muted-foreground/40 select-none">{i + 1}</span>
                    <span style={{ paddingLeft: `${line.indent * 0.75}rem` }}>
                      {line.tokens.map((token, j) => (
                        <span key={j} className={token.className}>
                          {token.text}
                        </span>
                      ))}
                    </span>
                  </div>
                ))}
                <div className="flex gap-3">
                  <span className="w-4 shrink-0 text-right text-muted-foreground/40 select-none">9</span>
                  <span className="rounded-sm border-l-2 border-primary bg-primary/10 pl-2 text-primary-soft italic">
                    // DeVibe AI: added glow transition
                  </span>
                </div>
              </code>
            </pre>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-1.5 font-mono text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <StatusDot tone="success" />
              Synced to GitHub
            </span>
            <span className="hidden sm:inline">TypeScript JSX · Ln 9</span>
          </div>
        </div>

        {/* Preview column */}
        <div className="flex min-h-72 flex-col gap-3 p-4">
          <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">Live preview</p>
          <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-border bg-deep/60 p-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary shadow-[0_0_28px_rgba(124,58,237,0.75)]">
              <Sparkles className="size-6 text-primary-foreground" />
            </div>
            <p className="text-center text-xs font-medium">Genesis Alpha</p>
            <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
              Orchestrator online, processing data flows.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-border bg-surface-2 px-2.5 py-2">
              <p className="font-mono text-[9px] text-muted-foreground">LATENCY</p>
              <p className="font-mono text-xs text-accent">14ms</p>
            </div>
            <div className="rounded-lg border border-border bg-surface-2 px-2.5 py-2">
              <p className="font-mono text-[9px] text-muted-foreground">READY</p>
              <p className="font-mono text-xs text-success">88/100</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
