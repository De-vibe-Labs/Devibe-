import { CheckCircle2, DollarSign, ShieldAlert, Wand2 } from "lucide-react"
import { Button, Card, Eyebrow } from "@/components/ui/primitives"
import { readiness } from "@/lib/mock-data"

const checkIcons = {
  tests: CheckCircle2,
  patches: ShieldAlert,
  budget: DollarSign,
} as const

const toneClass = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
} as const

const RADIUS = 52
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function ReadinessScore() {
  const offset = CIRCUMFERENCE * (1 - readiness.score / 100)

  return (
    <Card className="flex flex-col p-5 sm:p-6">
      <Eyebrow>Readiness score</Eyebrow>

      <div className="mt-4 flex justify-center">
        <div className="relative">
          <svg viewBox="0 0 128 128" className="size-40" role="img" aria-label={`Readiness score ${readiness.score} out of 100`}>
            <circle cx="64" cy="64" r={RADIUS} fill="none" stroke="#27272a" strokeWidth="9" />
            <circle
              cx="64"
              cy="64"
              r={RADIUS}
              fill="none"
              stroke="#ccbeff"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              transform="rotate(-90 64 64)"
              className="drop-shadow-[0_0_10px_rgba(204,190,255,0.45)]"
            />
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-4xl font-bold tabular-nums">{readiness.score}</span>
            <span className="font-mono text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>
      </div>

      <ul className="mt-5 flex flex-col gap-2">
        {readiness.checks.map((check) => {
          const Icon = checkIcons[check.id as keyof typeof checkIcons] ?? CheckCircle2
          return (
            <li
              key={check.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface-2/70 px-3.5 py-3"
            >
              <Icon className={`size-4 shrink-0 ${toneClass[check.tone]}`} />
              <span className="min-w-0 flex-1 truncate text-sm">{check.label}</span>
              <span className={`shrink-0 font-mono text-xs ${toneClass[check.tone]}`}>{check.value}</span>
            </li>
          )
        })}
      </ul>

      <Button variant="secondary" className="mt-4 w-full">
        <Wand2 className="size-4" />
        Initiate auto-fix
      </Button>
    </Card>
  )
}
