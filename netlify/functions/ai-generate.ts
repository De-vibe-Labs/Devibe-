import type { Config, Context } from "@netlify/functions";
import { runGenerateApp } from "./_shared/generate.js";
import { json, optionsResponse } from "./_shared/http.js";

export default async (req: Request, _context: Context) => {
  if (req.method === "OPTIONS") return optionsResponse(req);
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, req);

  let body: {
    prompt?: string;
    model?: string;
    refine?: string;
  };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400, req);
  }

  const prompt = body.prompt?.trim();
  if (!prompt) return json({ error: "prompt required" }, 400, req);

  const result = await runGenerateApp({
    prompt,
    modelId: body.model,
    refine: body.refine,
  });

  return json(
    {
      title: result.title,
      summary: result.summary,
      entry: result.entry,
      files: result.files,
      previewHtml: result.previewHtml,
      model: result.model,
      mock: result.mock ?? false,
      error: result.error,
    },
    200,
    req,
  );
};

export const config: Config = {
  path: "/api/ai/generate",
  method: ["POST", "OPTIONS"],
};
