export type AiProvider = "anthropic" | "openai";

export interface AiModel {
  id: string;
  label: string;
  provider: AiProvider;
  /** Netlify AI Gateway / provider model id */
  model: string;
  kind: "claude" | "codex" | "gpt";
}

/** Curated models for Claude Code + Codex coding agents. */
export const AI_MODELS: AiModel[] = [
  {
    id: "claude-sonnet",
    label: "Claude Sonnet 4.5",
    provider: "anthropic",
    model: "claude-sonnet-4-5-20250929",
    kind: "claude",
  },
  {
    id: "claude-opus",
    label: "Claude Opus 4.6",
    provider: "anthropic",
    model: "claude-opus-4-6",
    kind: "claude",
  },
  {
    id: "claude-haiku",
    label: "Claude Haiku 4.5",
    provider: "anthropic",
    model: "claude-haiku-4-5-20251001",
    kind: "claude",
  },
  {
    id: "gpt-5-codex",
    label: "GPT-5 Codex",
    provider: "openai",
    model: "gpt-5-codex",
    kind: "codex",
  },
  {
    id: "gpt-5.1-codex",
    label: "GPT-5.1 Codex",
    provider: "openai",
    model: "gpt-5.1-codex",
    kind: "codex",
  },
  {
    id: "gpt-5.2-codex",
    label: "GPT-5.2 Codex",
    provider: "openai",
    model: "gpt-5.2-codex",
    kind: "codex",
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
Be concise, concrete, and prefer actionable next steps.`;

export async function runChat(input: {
  modelId: string;
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
}): Promise<{ text: string; model: AiModel; mock?: boolean; error?: string }> {
  const model = resolveModel(input.modelId);
  const history = input.messages.filter((m) => m.role !== "system");

  try {
    if (model.provider === "anthropic") {
      const text = await callAnthropic(model.model, history);
      return { text, model };
    }
    const text = await callOpenAI(model.model, history);
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

async function callAnthropic(
  model: string,
  messages: Array<{ role: string; content: string }>,
): Promise<string> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const baseURL =
    process.env.ANTHROPIC_BASE_URL ||
    (typeof Netlify !== "undefined"
      ? Netlify.env.get("ANTHROPIC_BASE_URL")
      : undefined);

  const client = new Anthropic(
    baseURL ? { baseURL } : undefined,
  );

  const response = await client.messages.create({
    model,
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
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
  messages: Array<{ role: string; content: string }>,
): Promise<string> {
  const OpenAI = (await import("openai")).default;
  const client = new OpenAI();
  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
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
    "Deploy to Netlify with AI Features enabled, or set provider API keys for local calls.",
    "",
    "Meanwhile I can still help you structure a PRD with `github-connected` + `cloud-enabled`,",
    "scaffold a Supabase dataplane, and register an MCP server with the Cloud plugin from /mcp.",
  ].join("\n");
}

declare const Netlify: { env: { get(key: string): string | undefined } } | undefined;
