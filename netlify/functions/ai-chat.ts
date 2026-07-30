import type { Config, Context } from "@netlify/functions";
import { runChat } from "./_shared/ai.js";
import { json, optionsResponse } from "./_shared/http.js";

export default async (req: Request, _context: Context) => {
  if (req.method === "OPTIONS") return optionsResponse(req);
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, req);

  let body: {
    model?: string;
    messages?: Array<{ role: "user" | "assistant" | "system"; content: string }>;
    prompt?: string;
  };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400, req);
  }

  const messages =
    body.messages ??
    (body.prompt ? [{ role: "user" as const, content: body.prompt }] : []);

  if (!messages.length) {
    return json({ error: "messages or prompt required" }, 400, req);
  }

  const result = await runChat({
    modelId: body.model ?? "claude-sonnet",
    messages,
  });

  return json(
    {
      reply: result.text,
      model: result.model,
      mock: result.mock ?? false,
      error: result.error,
    },
    200,
    req,
  );
};

export const config: Config = {
  path: "/api/ai/chat",
  method: ["POST", "OPTIONS"],
};
