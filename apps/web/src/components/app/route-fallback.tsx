import { Loader2 } from "lucide-react"

export function RouteFallback({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <Loader2 className="size-5 animate-spin text-primary-soft" aria-hidden="true" />
      <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">{label}</p>
    </div>
  )
}
