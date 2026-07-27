import { Code2, Lightbulb, TrendingUp, Workflow } from "lucide-react"
import { Eyebrow } from "@/components/ui/primitives"

const steps = [
  {
    n: "01",
    title: "Idea",
    icon: Lightbulb,
    tone: "text-primary-soft",
    ring: "shadow-primary/15",
    body: "Describe your vision in plain English. DeVibe resolves the ambiguity and asks only what matters.",
  },
  {
    n: "02",
    title: "PRD + design",
    icon: Workflow,
    tone: "text-accent",
    ring: "shadow-accent/15",
    body: "System Designer agents draft infrastructure topology and schema diagrams for your review.",
  },
  {
    n: "03",
    title: "Code + test",
    icon: Code2,
    tone: "text-primary-soft",
    ring: "shadow-primary/15",
    body: "Engineering agents write typed, tested code across the stack and review each other's PRs.",
  },
  {
    n: "04",
    title: "Deploy + scale",
    icon: TrendingUp,
    tone: "text-success",
    ring: "shadow-success/15",
    body: "Ship to edge clusters worldwide with automated health monitoring and cost guardrails.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border bg-deep px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Workflow</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            From idea to scale in minutes
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            The shortest path between a concept and a global product.
          </p>
        </div>

        <ol className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connector */}
          <div
            aria-hidden="true"
            className="absolute top-8 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-border-strong to-transparent lg:block"
          />

          {steps.map((step) => (
            <li key={step.n} className="relative flex flex-col items-center gap-5 text-center">
              <div
                className={`flex size-16 items-center justify-center rounded-2xl border border-border bg-surface-2 shadow-lg ${step.ring} ${step.tone}`}
              >
                <step.icon className="size-7" />
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">{step.n}</p>
                <h3 className="mt-1.5 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
