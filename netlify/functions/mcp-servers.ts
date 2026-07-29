import type { Config, Context } from "@netlify/functions";
import {
  createMcpServerDefinition,
  listAvailablePlugins,
  CreateMcpServerInputSchema,
} from "@devibe/mcp-builder";
import { json, optionsResponse } from "./_shared/http.js";
import { listMcpServers, saveMcpServer } from "./_shared/mcp-store.js";

export default async (req: Request, _context: Context) => {
  if (req.method === "OPTIONS") return optionsResponse(req);

  if (req.method === "GET") {
    const url = new URL(req.url);
    if (url.searchParams.get("meta") === "plugins") {
      return json({ plugins: listAvailablePlugins() }, 200, req);
    }
    const ownerId = url.searchParams.get("ownerId") ?? undefined;
    return json({ servers: listMcpServers(ownerId) }, 200, req);
  }

  if (req.method === "POST") {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400, req);
    }
    const parsed = CreateMcpServerInputSchema.safeParse(body);
    if (!parsed.success) {
      return json({ error: parsed.error.flatten() }, 400, req);
    }
    const def = createMcpServerDefinition(parsed.data);
    saveMcpServer(def);
    return json({ server: def }, 201, req);
  }

  return json({ error: "Method not allowed" }, 405, req);
};

export const config: Config = {
  path: "/api/mcp/servers",
  method: ["GET", "POST", "OPTIONS"],
};
