import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "../components/SiteNav";
import { useAuth } from "../auth/AuthProvider";
import { apiGet, apiSend } from "../lib/api";
import {
  saveGeneratedProject,
  type GeneratedProject,
} from "../lib/generated-project";

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
  kind?: "text" | "code" | "json" | "file" | "generated";
  streaming?: boolean;
  projectId?: string;
}

interface AiModelOption {
  id: string;
  label: string;
  kind: string;
  role?: string;
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
  "Build a coastal cafe landing page with reservation CTA",
  "Connect GitHub to sync my workspace",
  "Generate a SaaS analytics marketing site with pricing",
  "Create a fitness app splash page optimized for mobile",
];

const FALLBACK_MODELS: AiModelOption[] = [
  { id: "claude-sonnet", label: "Claude Sonnet 4.5", kind: "claude", role: "chat" },
  { id: "claude-opus", label: "Claude Opus 4.6", kind: "claude", role: "chat" },
  { id: "claude-haiku", label: "Claude Haiku 4.5", kind: "claude", role: "chat" },
  { id: "gpt-5-codex", label: "GPT-5 Codex", kind: "codex", role: "codegen" },
  { id: "gpt-5.1-codex", label: "GPT-5.1 Codex", kind: "codex", role: "codegen" },
  { id: "gpt-5.2-codex", label: "GPT-5.2 Codex", kind: "codex", role: "codegen" },
];

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

/** Heuristic: user wants a generated website/app with previews. */
export function isCodegenIntent(text: string): boolean {
  const lower = text.toLowerCase();
  const verbs = /\b(build|generate|create|make|scaffold|design|spin up)\b/;
  const nouns =
    /\b(app|website|web app|landing|page|site|ui|homepage|splash|marketing|dashboard|mobile)\b/;
  if (verbs.test(lower) && nouns.test(lower)) return true;
  if (/\b(preview|dual preview|mobile preview)\b/.test(lower)) return true;
  if (/\bgenerate (the )?app\b/.test(lower)) return true;
  return false;
}

/** User is asking to connect / link GitHub — route them to Firebase login. */
export function isGitHubConnectIntent(text: string): boolean {
  const lower = text.toLowerCase();
  if (/\b(connect|link|authorize|sign\s*in with|login with)\s+github\b/.test(lower)) return true;
  if (/\bgithub\s+(connect|oauth|login|sign\s*in|auth)\b/.test(lower)) return true;
  if (/\b(pair|attach)\s+(my\s+)?github\b/.test(lower)) return true;
  return false;
}

export function ChatPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [models, setModels] = useState<AiModelOption[]>(FALLBACK_MODELS);
  const [model, setModel] = useState(FALLBACK_MODELS[0].id);
  const [agents, setAgents] = useState(AGENTS);
  const [streaming, setStreaming] = useState(false);
  const [detectedTags, setDetectedTags] = useState<string[]>([]);
  const [aiMock, setAiMock] = useState(false);
  const [lastProject, setLastProject] = useState<GeneratedProject | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const empty = messages.length === 0;
  const githubLinked = user?.provider === "github";

  function routeToLogin(intent?: "github" | "auth") {
    navigate("/login", {
      state: {
        from: "/",
        intent: intent === "github" ? "github" : undefined,
      },
    });
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    setDetectedTags(detectTags(input));
  }, [input]);

  useEffect(() => {
    void (async () => {
      try {
        const data = await apiGet<{ models: AiModelOption[] }>("/api/ai/models");
        if (data.models?.length) {
          setModels(data.models);
          setModel((prev) =>
            data.models.some((m) => m.id === prev) ? prev : data.models[0].id,
          );
        }
      } catch {
        /* keep fallbacks */
      }
    })();
  }, []);

  const activityLabel = useMemo(() => {
    const thinking = agents.find((a) => a.status === "thinking");
    if (thinking) return `${thinking.name} is working…`;
    if (streaming) return "Agents collaborating…";
    return "All systems ready";
  }, [agents, streaming]);

  const selectedModel = models.find((m) => m.id === model) ?? models[0];

  function setAgentStatus(id: AgentId, status: AgentStatus) {
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  async function generateApp(prompt: string) {
    setAgentStatus("frontend", "thinking");
    setAgentStatus("ux", "thinking");
    const streamId = `gen-${Date.now()}`;
    setMessages((m) => [
      ...m,
      {
        id: streamId,
        role: "agent",
        agentId: "frontend",
        content: "Running code generator for desktop + mobile previews…",
        streaming: true,
      },
    ]);

    try {
      const data = await apiSend<{
        title: string;
        summary: string;
        entry: string;
        files: GeneratedProject["files"];
        previewHtml: string;
        model: { id: string; label: string };
        mock?: boolean;
      }>("/api/ai/generate", "POST", { prompt, model });

      const project = saveGeneratedProject({
        title: data.title,
        summary: data.summary,
        entry: data.entry,
        files: data.files,
        previewHtml: data.previewHtml,
        prompt,
        modelId: data.model.id,
        modelLabel: data.model.label,
        mock: data.mock,
      });
      setLastProject(project);
      setAiMock(Boolean(data.mock));

      const summary = [
        `Generated **${data.title}** with ${data.files.length} file(s) via ${data.model.label}${data.mock ? " (local generator)" : ""}.`,
        "",
        data.summary,
        "",
        "Desktop + mobile (390px) previews are ready in the IDE.",
        `Entry: ${data.entry}`,
      ].join("\n");

      setMessages((m) =>
        m.map((msg) =>
          msg.id === streamId
            ? {
                ...msg,
                content: summary,
                streaming: false,
                kind: "generated",
                projectId: project.id,
              }
            : msg,
        ),
      );
      setAgentStatus("frontend", "online");
      setAgentStatus("ux", "online");
      return project;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setMessages((m) =>
        m.map((msg) =>
          msg.id === streamId
            ? {
                ...msg,
                content: `Code generation failed: ${message}`,
                streaming: false,
              }
            : msg,
        ),
      );
      setAgentStatus("frontend", "idle");
      setAgentStatus("ux", "idle");
      return null;
    }
  }

  async function sendPrompt(raw: string) {
    const text = raw.trim();
    if (!text || streaming) return;

    // GitHub connect prompts always route through Firebase login / GitHub OAuth.
    if (isGitHubConnectIntent(text)) {
      if (!user || !githubLinked) {
        setMessages((m) => [
          ...m,
          { id: `u-${Date.now()}`, role: "user", content: text },
          {
            id: `auth-${Date.now()}`,
            role: "agent",
            agentId: "product",
            content:
              "GitHub connect requires Firebase sign-in. Redirecting you to login — use Connect GitHub (email / Google also work).",
          },
        ]);
        setInput("");
        window.setTimeout(() => routeToLogin("github"), 600);
        return;
      }
    }

    // Codegen and cloud lifecycle need a signed-in session.
    if ((isCodegenIntent(text) || detectTags(text).includes("github-connected")) && !user) {
      setMessages((m) => [
        ...m,
        { id: `u-${Date.now()}`, role: "user", content: text },
        {
          id: `auth-${Date.now()}`,
          role: "agent",
          agentId: "product",
          content:
            "Sign in with email, Google, or GitHub to generate apps and link repositories. Taking you to login…",
        },
      ]);
      setInput("");
      window.setTimeout(() => routeToLogin(detectTags(text).includes("github-connected") ? "github" : "auth"), 600);
      return;
    }

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
    const wantsCodegen = isCodegenIntent(text);

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

    let reply = "";
    try {
      const history = [...messages, userMsg]
        .filter((m) => m.kind !== "json" && m.kind !== "generated")
        .map((m) => ({
          role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
          content: m.content,
        }));
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ model, messages: history }),
      });
      if (!res.ok) throw new Error(`AI API ${res.status}`);
      const data = (await res.json()) as { reply: string; mock?: boolean };
      reply = data.reply;
      setAiMock(Boolean(data.mock));
    } catch {
      reply = wantsCodegen
        ? `I'll generate a polished responsive app for desktop and mobile previews next. Using the code generator (${selectedModel?.kind === "codex" ? selectedModel.label : "GPT-5.2 Codex"}).`
        : buildAgentReply(text, tags);
      setAiMock(true);
    }

    if (wantsCodegen && !/generate|preview|ide/i.test(reply)) {
      reply +=
        "\n\nHanding off to the Frontend Agent to run the code generator and mount dual previews.";
    }

    const replyChunks = reply.split(/(\s+)/).filter(Boolean);
    let assembled = "";
    for (const chunk of replyChunks) {
      assembled += chunk;
      await wait(8 + Math.random() * 16);
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

    if (wantsCodegen) {
      await generateApp(text);
    }

    if (tags.includes("cloud-enabled") || tags.includes("github-connected")) {
      setAgentStatus("devops", "thinking");
      await wait(400);
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

  function openIde(project?: GeneratedProject | null) {
    if (project) setLastProject(project);
    navigate("/workspace");
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
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <Link to="/" className="text-sm font-semibold tracking-tight">
            DeVibe
          </Link>
          <button
            className="dv-btn-secondary px-2 py-1 text-xs"
            type="button"
            onClick={() => {
              setMessages([]);
              setLastProject(null);
            }}
          >
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
            {lastProject ? (
              <li className="rounded-lg border border-primary/30 bg-primary-soft/40 px-3 py-2 text-sm">
                <button type="button" className="w-full text-left" onClick={() => openIde(lastProject)}>
                  {lastProject.title}
                  <span className="mt-0.5 block text-[10px] text-text-subtle">
                    Generated · open IDE
                  </span>
                </button>
              </li>
            ) : null}
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

        <div className="space-y-2 border-t border-border p-3 text-[11px] text-text-subtle">
          <Link to="/mcp" className="block text-primary hover:underline">
            MCP Server Builder
          </Link>
          <p>
            Claude plans · Codex generates · {aiMock ? "fallback mode" : "live API"}
          </p>
        </div>
      </aside>

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
            {!authLoading && !user ? (
              <button
                type="button"
                className="dv-btn-secondary px-3 py-1.5 text-xs"
                onClick={() => routeToLogin("auth")}
              >
                Sign in
              </button>
            ) : null}
            {user && !githubLinked ? (
              <button
                type="button"
                className="dv-btn-secondary px-3 py-1.5 text-xs"
                onClick={() => routeToLogin("github")}
              >
                Connect GitHub
              </button>
            ) : null}
            {user ? (
              <span className="hidden text-[11px] text-text-subtle sm:inline">
                {user.email}
              </span>
            ) : null}
            <button
              type="button"
              className="dv-btn-secondary px-3 py-1.5 text-xs"
              onClick={() => openIde(lastProject)}
            >
              Open IDE
            </button>
            <Link to="/pricing" className="dv-btn-secondary px-3 py-1.5 text-xs">
              Pricing
            </Link>
            <Link to="/cloud" className="dv-btn-primary px-3 py-1.5 text-xs">
              Deploy
            </Link>
          </div>
        </header>

        {!authLoading && !user ? (
          <div className="border-b border-primary/20 bg-primary-soft/40 px-4 py-2 text-center text-xs text-primary">
            Sign in with email, Google, or GitHub to generate apps and connect repositories.{" "}
            <button type="button" className="underline" onClick={() => routeToLogin("auth")}>
              Continue to login
            </button>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-5">
            {empty ? (
              <EmptyState onPick={(s) => void sendPrompt(s)} />
            ) : (
              messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onApply={() => openIde(lastProject)}
                  canApply={Boolean(lastProject) || msg.kind === "generated"}
                />
              ))
            )}
            <div ref={bottomRef} />
          </div>
        </div>

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
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={3}
                placeholder="Describe an app or website to generate with desktop + mobile previews…"
                className="w-full resize-none border-0 bg-transparent px-4 pt-3 pb-2 text-sm text-text outline-none placeholder:text-text-subtle"
              />
              <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-2">
                <div className="flex items-center gap-2">
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="rounded-lg border border-border bg-surface px-2 py-1 text-xs text-text-muted outline-none"
                  >
                    {models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                        {m.role === "codegen" ? " · codegen" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!input.trim() || streaming}
                    className="dv-btn-secondary px-3 py-1.5 text-xs disabled:opacity-40"
                    onClick={() => void sendPrompt(`Build this app with dual previews: ${input}`)}
                  >
                    Generate app
                  </button>
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
        Codex runs the code generator. Claude plans. You get live desktop and 390px mobile
        previews in the IDE for the best version of the site.
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

function MessageBubble({
  message,
  onApply,
  canApply,
}: {
  message: ChatMessage;
  onApply: () => void;
  canApply: boolean;
}) {
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
        ) : (
          <div className="rounded-2xl rounded-tl-md border border-border bg-surface-card px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap text-text-muted">
            {message.content.replace(/\*\*(.*?)\*\*/g, "$1") || (message.streaming ? " " : "")}
          </div>
        )}

        {!message.streaming && message.kind !== "json" && canApply ? (
          <div className="flex gap-2">
            <button type="button" onClick={onApply} className="dv-btn-secondary px-2.5 py-1 text-[11px]">
              {message.kind === "generated" ? "Open dual preview" : "Apply to IDE"}
            </button>
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

function buildAgentReply(text: string, tags: string[]): string {
  return tags.length > 0
    ? `I parsed your request and detected lifecycle tags: ${tags.join(", ")}.\n\nI'll coordinate Product → DevOps → Security. Ask me to build a website to run the code generator with desktop + mobile previews.`
    : `Got it. I'll turn this into a structured plan.\n\nIdea summary: "${text.slice(0, 140)}${text.length > 140 ? "…" : ""}"\n\nSay "build a … website/app" to generate code with dual previews.`;
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
