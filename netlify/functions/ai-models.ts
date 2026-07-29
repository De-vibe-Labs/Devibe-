import type { Config, Context } from "@netlify/functions";
import { AI_MODELS } from "./_shared/ai.js";
import { json, optionsResponse } from "./_shared/http.js";

export default async (req: Request, _context: Context) => {
  if (req.method === "OPTIONS") return optionsResponse(req);
  if (req.method !== "GET") return json({ error: "Method not allowed" }, 405, req);
  return json({ models: AI_MODELS }, 200, req);
};

export const config: Config = {
  path: "/api/ai/models",
  method: ["GET", "OPTIONS"],
};
