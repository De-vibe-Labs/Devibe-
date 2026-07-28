import { FileText, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/primitives"
import type { ChatMessage as ChatMessageType } from "@/lib/mock-data"

export function ChatMessage({ message }: { message: ChatMessageType }) {
  if (message.author === "user") {
    return (
      <li className="flex justify-end">
        <div className="max-w-[42rem] rounded-2xl rounded-br-sm border border-primary/35 bg-primary/15 px-4 py-3">
          <p className="text-sm leading-relaxed text-foreground text-pretty">{message.body}</p>
          <time className="mt-1.5 block text-right font-mono text-[10px] text-muted-foreground">
            {message.timestamp}
          </time>
        </div>
      </li>
    )
  }

  return (
    <li className="flex gap-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/15">
        <Sparkles className="size-4 text-primary-soft" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-sm font-semibold">{message.agentName}</span>
          <span className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
            {message.agentRole}
          </span>
          <time className="ml-auto font-mono text-[10px] text-muted-foreground">{message.timestamp}</time>
        </div>

        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">{message.body}</p>

        {message.code ? (
          <figure className="mt-3 overflow-hidden rounded-xl border border-border bg-deep">
            <figcaption className="flex items-center gap-2 border-b border-border bg-surface-2/60 px-3 py-2">
              <FileText className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted-foreground">
                {message.code.filename}
              </span>
              <Badge tone="neutral" className="shrink-0 px-2 py-0 font-mono text-[10px]">
                {message.code.language}
              </Badge>
            </figcaption>
            <pre className="overflow-x-auto p-3.5">
              <code className="font-mono text-[11px] leading-relaxed text-foreground/85">{message.code.content}</code>
            </pre>
          </figure>
        ) : null}

        {message.artifacts?.length ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {message.artifacts.map((artifact) => (
              <li key={artifact}>
                <Badge tone="accent" className="font-mono text-[10px]">
                  {artifact}
                </Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  )
}
