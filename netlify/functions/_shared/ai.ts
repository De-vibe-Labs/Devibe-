export type AiProvider = "anthropic" | "openai";

export interface AiModel {
  id: string;
  label: string;
  provider: AiProvider;
  /** Netlify AI Gateway / provider model id */
  model: string;
  kind: "claude" | "codex" | "gpt";
  /** Hint for UI: chat planning vs code generation */
  role?: "chat" | "codegen";
}

/** Curated models for Claude Code + Codex coding agents. */
export const AI_MODELS: AiModel[] = [
  {
    id: "claude-sonnet",
    label: "Claude Sonnet 4.5",
    provider: "anthropic",
    model: "claude-sonnet-4-5-20250929",
    kind: "claude",
    role: "chat",
  },
  {
    id: "claude-opus",
    label: "Claude Opus 4.6",
    provider: "anthropic",
    model: "claude-opus-4-6",
    kind: "claude",
    role: "chat",
  },
  {
    id: "claude-haiku",
    label: "Claude Haiku 4.5",
    provider: "anthropic",
    model: "claude-haiku-4-5-20251001",
    kind: "claude",
    role: "chat",
  },
  {
    id: "gpt-5-codex",
    label: "GPT-5 Codex",
    provider: "openai",
    model: "gpt-5-codex",
    kind: "codex",
    role: "codegen",
  },
  {
    id: "gpt-5.1-codex",
    label: "GPT-5.1 Codex",
    provider: "openai",
    model: "gpt-5.1-codex",
    kind: "codex",
    role: "codegen",
  },
  {
    id: "gpt-5.2-codex",
    label: "GPT-5.2 Codex",
    provider: "openai",
    model: "gpt-5.2-codex",
    kind: "codex",
    role: "codegen",
  },
];

export function resolveModel(idOrLabel: string): AiModel {
  const needle = idOrLabel.trim().toLowerCase();
  const found =
    AI_MODELS.find((m) => m.id === needle) ||
    AI_MODELS.find((m) => m.label.toLowerCase() === needle) ||
    AI_MODELS.find((m) => m.model === needle) ||
    AI_MODELS.find((m) => needle.includes("claude") && m.kind === "claude") ||
    AI_MODELS.find((m) => needle.includes("codex") && m.kind === "codex");
  return found ?? AI_MODELS[0];
}

const SYSTEM_PROMPT = `You are DeVibe AI Builder — an AI engineering platform assistant.
Help users design apps, generate PRDs with github-connected / cloud-enabled tags,
plan Supabase dataplane + MCS cloud deploys (Cloudflare-first), and MCP tooling.
When the user wants a website or app UI, tell them you can generate code with dual
desktop + mobile previews in the IDE (Apply to IDE / Generate app).
Be concise, concrete, and prefer actionable next steps.`;

export async function runChat(input: {
  modelId: string;
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
}): Promise<{ text: string; model: AiModel; mock?: boolean; error?: string }> {
  const model = resolveModel(input.modelId);
  const history = input.messages.filter((m) => m.role !== "system");

  try {
    const text = await runRawCompletion({
      model,
      system: SYSTEM_PROMPT,
      messages: history.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
      maxTokens: 2048,
    });
    return { text, model };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      text: mockReply(history.at(-1)?.content ?? "", model),
      model,
      mock: true,
      error: message,
    };
  }
}

export async function runRawCompletion(input: {
  model: AiModel;
  system: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  maxTokens?: number;
}): Promise<string> {
  if (input.model.provider === "anthropic") {
    return callAnthropic(input.model.model, input.system, input.messages, input.maxTokens ?? 2048);
  }
  return callOpenAI(input.model.model, input.system, input.messages, input.maxTokens ?? 2048);
}

async function callAnthropic(
  model: string,
  system: string,
  messages: Array<{ role: string; content: string }>,
  maxTokens: number,
): Promise<string> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const baseURL =
    process.env.ANTHROPIC_BASE_URL ||
    (typeof Netlify !== "undefined"
      ? Netlify.env.get("ANTHROPIC_BASE_URL")
      : undefined);

  const client = new Anthropic(baseURL ? { baseURL } : undefined);

  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system,
    messages: messages.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    })),
  });

  const block = response.content.find((c) => c.type === "text");
  if (!block || block.type !== "text") throw new Error("Empty Anthropic response");
  return block.text;
}

async function callOpenAI(
  model: string,
  system: string,
  messages: Array<{ role: string; content: string }>,
  maxTokens: number,
): Promise<string> {
  const OpenAI = (await import("openai")).default;
  const client = new OpenAI();
  const completion = await client.chat.completions.create({
    model,
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: system },
      ...messages.map((m) => ({
        role: (m.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
        content: m.content,
      })),
    ],
  });
  const text = completion.choices[0]?.message?.content;
  if (!text) throw new Error("Empty OpenAI response");
  return text;
}

function mockReply(prompt: string, model: AiModel): string {
  return [
    `(${model.label} · local fallback)`,
    "",
    `I received: "${prompt.slice(0, 180)}${prompt.length > 180 ? "…" : ""}"`,
    "",
    "AI Gateway keys are not available in this environment yet.",
    "I can still generate a polished responsive app with desktop + mobile previews —",
    "use **Generate app** or ask me to build a website and open the IDE.",
    "",
    "Deploy to Netlify with AI Features enabled for live Claude / Codex generation.",
  ].join("\n");
}

declare const Netlify: { env: { get(key: string): string | undefined } } | undefined;
