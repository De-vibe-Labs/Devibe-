import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/primitives"

export function ComingSoon({
  title,
  description,
  icon: Icon,
  bullets,
}: {
  title: string
  description: string
  icon: LucideIcon
  bullets: string[]
}) {
  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      </header>

      <Card className="flex max-w-2xl flex-col items-start gap-5 p-6 sm:p-8">
        <span className="flex size-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary-soft">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-lg font-semibold">On the roadmap</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            This surface isn&apos;t wired up yet. Here&apos;s what it will cover.
          </p>
        </div>
        <ul className="flex flex-col gap-2.5">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
              <span className="leading-relaxed">{bullet}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
