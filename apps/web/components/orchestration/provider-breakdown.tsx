import { Badge, Eyebrow, Meter, StatusDot } from "@/components/ui/primitives"
import { providers, type Health } from "@/lib/mock-data"

const healthTone: Record<Health, "success" | "warning" | "danger"> = {
  healthy: "success",
  degraded: "warning",
  critical: "danger",
}

export function ProviderBreakdown() {
  return (
    <div>
      <Eyebrow>Provider mix</Eyebrow>
      <ul className="mt-3 flex flex-col gap-2">
        {providers.map((provider) => (
          <li key={provider.id} className="rounded-xl border border-border bg-surface-2/70 p-3.5">
            <div className="flex items-center gap-2">
              <StatusDot tone={healthTone[provider.health]} pulse={provider.health !== "healthy"} />
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">{provider.name}</span>
              {provider.primary ? (
                <Badge tone="primary" className="shrink-0 px-2 py-0 text-[10px]">
                  primary
                </Badge>
              ) : null}
            </div>

            <p className="mt-1 truncate text-xs text-muted-foreground">{provider.role}</p>

            <Meter
              value={provider.share}
              tone={provider.primary ? "primary" : "accent"}
              label={`${provider.name} share of workload`}
              className="mt-3"
            />

            <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-2 font-mono text-[10px] text-muted-foreground">
              <span>{provider.share}% of traffic</span>
              <span>{provider.monthlyCost}/mo</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
