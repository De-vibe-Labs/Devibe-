import { Check } from "lucide-react"
import { Button, Eyebrow, GlassCard } from "@/components/ui/primitives"
import { cn } from "@/lib/utils"

const tiers = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    cadence: "/month",
    blurb: "Perfect for exploring agent-assisted development.",
    cta: "Start building",
    variant: "outline" as const,
    features: ["3 active projects", "Basic orchestration", "Single-agent processing", "Community support"],
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$49",
    cadence: "/month",
    blurb: "For professional developers and fast-moving startups.",
    cta: "Get Pro",
    variant: "primary" as const,
    features: [
      "Unlimited projects",
      "Advanced multi-agent swarm",
      "Custom CI/CD pipelines",
      "Multi-cloud distribution",
      "Priority agent access",
    ],
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    blurb: "Compliance, security and scale on your own terms.",
    cta: "Contact sales",
    variant: "outline" as const,
    features: ["Self-hosted agent clusters", "SOC 2 compliance suite", "BYO cloud accounts", "Dedicated support team"],
    featured: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Pricing for every scale
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            From weekend projects to enterprise-grade agent clusters.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <GlassCard
              key={tier.id}
              className={cn(
                "relative flex flex-col p-6 sm:p-8",
                tier.featured && "border-primary/60 shadow-2xl shadow-primary/15 lg:-mt-4 lg:pb-12",
              )}
            >
              {tier.featured ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-primary-foreground uppercase">
                  Recommended
                </span>
              ) : null}

              <h3 className="font-display text-lg font-semibold">{tier.name}</h3>
              <p className="mt-4 flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-bold">{tier.price}</span>
                {tier.cadence ? <span className="text-sm text-muted-foreground">{tier.cadence}</span> : null}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tier.blurb}</p>

              <ul className="mt-7 flex flex-1 flex-col gap-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary-soft" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button variant={tier.variant} size="lg" className="mt-8 w-full">
                {tier.cta}
              </Button>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
