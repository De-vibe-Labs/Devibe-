import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { ArrowUp, Paperclip, Sparkles } from "lucide-react"
import { ChatMessage } from "@/components/builder/chat-message"
import { Badge, StatusDot } from "@/components/ui/primitives"
import { chatThread, suggestedPrompts, type ChatMessage as ChatMessageType } from "@/lib/mock-data"

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessageType[]>(chatThread)
  const [draft, setDraft] = useState("")
  const [thinking, setThinking] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages.length, thinking])

  function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return

    const now = new Date()
    const timestamp = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

    setMessages((prev) => [...prev, { id: `u-${now.getTime()}`, author: "user", body: trimmed, timestamp }])
    setDraft("")
    setThinking(true)

    // Simulated orchestrator hand-off. Replace with a streamed agent response.
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          author: "agent",
          agentName: "Orchestrator",
          agentRole: "Swarm coordination",
          body: `Queued "${trimmed}". Fanning out to the product and DevOps agents; I will open a PR rather than applying changes directly to production.`,
          timestamp,
        },
      ])
      setThinking(false)
    }, 900)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) return
    // Enter may be confirming a CJK IME composition rather than submitting.
    if (event.nativeEvent.isComposing || event.keyCode === 229) return
    event.preventDefault()
    send(draft)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <Sparkles className="size-4 text-primary-soft" />
          <h1 className="font-display text-base font-semibold">AI builder</h1>
          <Badge tone="primary" className="font-mono text-[10px]">
            genesis-alpha
          </Badge>
        </div>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground uppercase">
          <StatusDot tone="success" pulse />
          7 agents online
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <ul className="mx-auto flex max-w-4xl flex-col gap-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {thinking ? (
            <li className="flex items-center gap-3 text-muted-foreground">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/15">
                <Sparkles className="size-4 animate-pulse text-primary-soft" />
              </span>
              <span className="font-mono text-xs">Orchestrator is routing your request...</span>
            </li>
          ) : null}
        </ul>
        <div ref={endRef} />
      </div>

      <div className="border-t border-border bg-surface-1/80 px-4 py-4 backdrop-blur-xl sm:px-6">
        <div className="mx-auto max-w-4xl">
          <ul className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt) => (
              <li key={prompt}>
                <button
                  type="button"
                  onClick={() => send(prompt)}
                  className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {prompt}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex items-end gap-2 rounded-2xl border border-border bg-surface-2 p-2 focus-within:border-primary/50">
            <button
              type="button"
              aria-label="Attach a file"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-3 hover:text-foreground"
            >
              <Paperclip className="size-4" />
            </button>

            <label className="min-w-0 flex-1">
              <span className="sr-only">Describe what you want to build</span>
              <textarea
                rows={1}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe what you want to build..."
                className="max-h-40 w-full resize-none bg-transparent py-2 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </label>

            <button
              type="button"
              onClick={() => send(draft)}
              disabled={!draft.trim()}
              aria-label="Send message"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:bg-primary/90 disabled:opacity-40"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
