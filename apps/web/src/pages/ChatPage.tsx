import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/SiteNav";

type AgentId =
  | "product"
  | "ux"
  | "frontend"
  | "backend"
  | "devops"
  | "security"
  | "qa";

type AgentStatus = "online" | "idle" | "thinking";

interface Agent {
  id: AgentId;
  name: string;
  status: AgentStatus;
}

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  agentId?: AgentId;
  content: string;
  kind?: "text" | "code" | "json" | "file";
  streaming?: boolean;
}

const AGENTS: Agent[] = [
  { id: "product", name: "Product Agent", status: "online" },
  { id: "ux", name: "UX Agent", status: "idle" },
  { id: "frontend", name: "Frontend Agent", status: "idle" },
  { id: "backend", name: "Backend Agent", status: "idle" },
  { id: "devops", name: "DevOps Agent", status: "online" },
  { id: "security", name: "Security Agent", status: "idle" },
  { id: "qa", name: "QA Agent", status: "idle" },
];

const PROJECTS = [
  { id: "1", name: "Genesis-Alpha", active: true },
  { id: "2", name: "EdgeOS Billing", active: false },
  { id: "3", name: "Marketplace v2", active: false },
];

const SUGGESTIONS = [
  "Build a SaaS analytics dashboard with Cloudflare Workers + D1",
  "Paste a PRD and provision multi-cloud adapters",
  "Add Monaco IDE dual preview to my workspace",
  "Generate Pulumi for edge-first deployment",
];

const MODELS = ["GPT-5", "Claude Opus", "Gemini 2.5", "Workers AI"];

function detectTags(text: string): string[] {
  const tags: string[] = [];
  const lower = text.toLowerCase();
  if (lower.includes("github") || lower.includes("prd") || lower.includes("repo")) {
    tags.push("github-connected");
  }
  if (lower.includes("cloud") || lower.includes("deploy") || lower.includes("cloudflare")) {
    tags.push("cloud-enabled");
  }
  if (lower.includes("scale") || lower.includes("auto-scale") || lower.includes("traffic")) {
    tags.push("auto-scale");
  }
  return [...new Set(tags)];
}

export function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState(MODELS[0]);
  const [agents, setAgents] = useState(AGENTS);
  const [streaming, setStreaming] = useState(false);
  const [detectedTags, setDetectedTags] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const empty = messages.length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    setDetectedTags(detectTags(input));
  }, [input]);

  const activityLabel = useMemo(() => {
    const thinking = agents.find((a) => a.status === "thinking");
    if (thinking) return `${thinking.name} is working…`;
    if (streaming) return "Agents collaborating…";
    return "All systems ready";
  }, [agents, streaming]);

  function setAgentStatus(id: AgentId, status: AgentStatus) {
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  async function sendPrompt(raw: string) {
    const text = raw.trim();
    if (!text || streaming) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setStreaming(true);
    setAgentStatus("product", "thinking");

    const tags = detectTags(text);
    const streamId = `a-${Date.now()}`;
    setMessages((m) => [
      ...m,
      {
        id: streamId,
        role: "agent",
        agentId: "product",
        content: "",
        streaming: true,
      },
    ]);

    const replyChunks = buildAgentReply(text, tags);
    let assembled = "";
    for (const chunk of replyChunks) {
      assembled += chunk;
      await wait(28 + Math.random() * 40);
      const snapshot = assembled;
      setMessages((m) =>
        m.map((msg) =>
          msg.id === streamId ? { ...msg, content: snapshot, streaming: true } : msg,
        ),
      );
    }

    setMessages((m) =>
      m.map((msg) => (msg.id === streamId ? { ...msg, streaming: false } : msg)),
    );
    setAgentStatus("product", "online");

    if (tags.includes("cloud-enabled") || tags.includes("github-connected")) {
      setAgentStatus("devops", "thinking");
      await wait(500);
      setMessages((m) => [
        ...m,
        {
          id: `devops-${Date.now()}`,
          role: "agent",
          agentId: "devops",
          kind: "json",
          content: JSON.stringify(
            {
              event: "manage_project.plan",
              tags,
              primary: "cloudflare",
              adapters: ["cloudflare", "aws", "gcp", "azure"],
              banner: "Cloud + GitHub linked — full lifecycle management available.",
            },
            null,
            2,
          ),
        },
      ]);
      setAgentStatus("devops", "online");
    }

    setStreaming(false);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void sendPrompt(input);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendPrompt(input);
    }
  }

  return (
    <div className="flex h-screen bg-bg text-text">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <Link to="/" className="text-sm font-semibold tracking-tight">
            DeVibe
          </Link>
          <button className="dv-btn-secondary px-2 py-1 text-xs" type="button">
            <Icon name="add" className="text-sm" />
            New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <p className="mb-2 px-2 text-[10px] font-medium uppercase tracking-widest text-text-subtle">
            Projects
          </p>
          <ul className="mb-6 space-y-1">
            {PROJECTS.map((p) => (
              <li
                key={p.id}
                className={`rounded-lg px-3 py-2 text-sm ${
                  p.active
                    ? "bg-primary-soft text-text"
                    : "text-text-muted hover:bg-surface-elevated"
                }`}
              >
                {p.name}
              </li>
            ))}
          </ul>

          <p className="mb-2 px-2 text-[10px] font-medium uppercase tracking-widest text-text-subtle">
            Agents
          </p>
          <ul className="space-y-1">
            {agents.map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-text-muted"
              >
                <StatusDot status={a.status} />
                <span className="truncate">{a.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border p-3 text-[11px] text-text-subtle">
          MCP · manage_project ready
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-medium">Genesis-Alpha</p>
              <p className="flex items-center gap-2 text-[11px] text-text-muted">
                <span className="inline-flex h-1.5 w-1.5 animate-pulse-soft rounded-full bg-primary" />
                {activityLabel}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/workspace" className="dv-btn-secondary px-3 py-1.5 text-xs">
              Open IDE
            </Link>
            <Link to="/cloud" className="dv-btn-primary px-3 py-1.5 text-xs">
              Deploy
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-5">
            {empty ? (
              <EmptyState onPick={(s) => void sendPrompt(s)} />
            ) : (
              messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Prompt composer */}
        <div className="border-t border-border bg-surface/80 px-4 py-4 backdrop-blur">
          <form onSubmit={onSubmit} className="mx-auto max-w-3xl">
            {detectedTags.length > 0 ? (
              <div className="mb-2 flex flex-wrap gap-2">
                {detectedTags.map((tag) => (
                  <span key={tag} className="dv-tag">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="dv-card overflow-hidden focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(124,58,237,0.2)]">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={3}
                placeholder="Describe your product idea or paste a PRD…"
                className="w-full resize-none border-0 bg-transparent px-4 pt-3 pb-2 text-sm text-text outline-none placeholder:text-text-subtle"
              />
              <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-2">
                <div className="flex items-center gap-2">
                  <button type="button" className="dv-btn-secondary px-2 py-1 text-xs" title="Attach">
                    <Icon name="attach_file" className="text-base" />
                  </button>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="rounded-lg border border-border bg-surface px-2 py-1 text-xs text-text-muted outline-none"
                  >
                    {MODELS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden text-[11px] text-text-subtle sm:inline">
                    Enter to send · Shift+Enter newline
                  </span>
                  <button
                    type="submit"
                    disabled={!input.trim() || streaming}
                    className="dv-btn-primary px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Icon name="send" className="text-sm" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  return (
    <div className="animate-fade-up py-16 text-center">
      <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary shadow-[0_0_30px_rgba(124,58,237,0.35)]">
        <Icon name="auto_awesome" />
      </div>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">What should we build?</h1>
      <p className="mx-auto mb-8 max-w-md text-sm text-text-muted">
        Multi-agent creation from a single prompt. Tag a PRD with{" "}
        <code className="font-mono text-xs text-primary">github-connected</code> and{" "}
        <code className="font-mono text-xs text-primary">cloud-enabled</code> to unlock full
        lifecycle management.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="dv-card px-4 py-3 text-left text-sm text-text-muted transition hover:border-border-strong hover:text-text"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end animate-fade-up">
        <div className="max-w-[85%] rounded-2xl rounded-br-md border border-border bg-surface-elevated px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  }

  const agent = AGENTS.find((a) => a.id === message.agentId) ?? AGENTS[0];

  return (
    <div className="flex gap-3 animate-fade-up">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
        {agent.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-border bg-surface-card px-2 py-0.5 text-[11px] font-medium">
            {agent.name}
          </span>
          {message.streaming ? (
            <span className="flex gap-1">
              <span className="stream-dot h-1 w-1 rounded-full bg-primary" />
              <span className="stream-dot h-1 w-1 rounded-full bg-primary" />
              <span className="stream-dot h-1 w-1 rounded-full bg-primary" />
            </span>
          ) : null}
        </div>

        {message.kind === "json" ? (
          <pre className="overflow-x-auto rounded-xl border border-border bg-surface p-3 font-mono text-[11px] text-accent">
            {message.content}
          </pre>
        ) : message.kind === "code" ? (
          <pre className="overflow-x-auto rounded-xl border border-border bg-surface p-3 font-mono text-[12px]">
            {message.content}
          </pre>
        ) : (
          <div className="rounded-2xl rounded-tl-md border border-border bg-surface-card px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap text-text-muted">
            {message.content || (message.streaming ? " " : "")}
          </div>
        )}

        {!message.streaming && message.kind !== "json" ? (
          <div className="flex gap-2">
            <Link to="/workspace" className="dv-btn-secondary px-2.5 py-1 text-[11px]">
              Apply to IDE
            </Link>
            <Link to="/cloud" className="dv-btn-secondary px-2.5 py-1 text-[11px]">
              Open cloud plan
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: AgentStatus }) {
  const color =
    status === "online"
      ? "bg-success"
      : status === "thinking"
        ? "bg-primary animate-pulse-soft"
        : "bg-text-subtle";
  return <span className={`h-1.5 w-1.5 rounded-full ${color}`} />;
}

function buildAgentReply(text: string, tags: string[]): string[] {
  const base =
    tags.length > 0
      ? `I parsed your request and detected lifecycle tags: ${tags.join(", ")}.\n\nI'll coordinate Product → DevOps → Security. Next I'll draft a PRD block and a Cloudflare-first plan you can apply from the Cloud screen.`
      : `Got it. I'll turn this into a structured plan with PRD metadata, architecture, and agent tasks.\n\nIdea summary: "${text.slice(0, 140)}${text.length > 140 ? "…" : ""}"\n\nReply with more constraints, or open the IDE when you're ready to generate code.`;
  return base.split(/(\s+)/).filter(Boolean);
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
