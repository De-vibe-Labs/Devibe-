import { useState } from "react"
import { ExternalLink, Monitor, RotateCw, Smartphone, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

function PreviewArtwork({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-3 overflow-hidden bg-deep px-4 text-center">
      <div
        aria-hidden="true"
        className="absolute size-48 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.35),transparent_65%)]"
      />
      <span
        className={cn(
          "relative flex items-center justify-center rounded-full bg-primary-soft text-deep",
          compact ? "size-9" : "size-14",
        )}
      >
        <Sparkles className={compact ? "size-4" : "size-6"} />
      </span>
      <p className={cn("relative font-display font-semibold", compact ? "text-xs" : "text-lg")}>
        {compact ? "Genesis" : "Genesis Alpha"}
      </p>
      {compact ? (
        <span className="relative h-1 w-20 rounded-full bg-primary-soft/70" />
      ) : (
        <p className="relative max-w-[16rem] text-xs leading-relaxed text-muted-foreground">
          The orchestrator is online and processing data flows.
        </p>
      )}
    </div>
  )
}

export function PreviewPanels() {
  const [mobile, setMobile] = useState(true)

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto border-l border-border bg-surface-1 p-3">
      {/* Desktop preview */}
      <section className="flex min-h-0 flex-col">
        <div className="flex items-center justify-between pb-2">
          <h2 className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">Desktop preview</h2>
          <button
            type="button"
            aria-label="Open desktop preview in a new tab"
            className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <ExternalLink className="size-3.5" />
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-surface-2">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-danger/70" />
              <span className="size-2.5 rounded-full bg-warning/70" />
              <span className="size-2.5 rounded-full bg-success/70" />
            </span>
            <span className="min-w-0 flex-1 truncate rounded-md bg-deep px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
              devibe.app/preview/genesis-alpha
            </span>
            <RotateCw className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="h-56">
            <PreviewArtwork />
          </div>
        </div>
      </section>

      {/* Mobile preview */}
      <section className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between pb-2">
          <h2 className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
            Mobile responsive
          </h2>
          <div role="group" aria-label="Preview device" className="flex items-center gap-0.5 rounded-md bg-surface-2 p-0.5">
            <button
              type="button"
              onClick={() => setMobile(true)}
              aria-pressed={mobile}
              aria-label="Phone preview"
              className={cn(
                "flex size-6 items-center justify-center rounded transition-colors",
                mobile ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Smartphone className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setMobile(false)}
              aria-pressed={!mobile}
              aria-label="Tablet preview"
              className={cn(
                "flex size-6 items-center justify-center rounded transition-colors",
                !mobile ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Monitor className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 items-start justify-center">
          <div
            className={cn(
              "overflow-hidden border-4 border-surface-3 bg-deep shadow-2xl transition-all",
              mobile ? "h-72 w-40 rounded-[1.75rem]" : "h-72 w-60 rounded-xl",
            )}
          >
            <div className="flex items-center justify-between px-3 pt-2 pb-1 font-mono text-[8px] text-muted-foreground">
              <span>9:41</span>
              <span>DeVibe</span>
            </div>
            <div className="h-[calc(100%-1.25rem)]">
              <PreviewArtwork compact />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
