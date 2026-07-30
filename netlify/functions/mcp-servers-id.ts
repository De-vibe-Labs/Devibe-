import type { Config, Context } from "@netlify/functions";
import { json, optionsResponse } from "./_shared/http.js";
import { deleteMcpServer, getMcpServer } from "./_shared/mcp-store.js";

export default async (req: Request, context: Context) => {
  if (req.method === "OPTIONS") return optionsResponse(req);
  const id = context.params?.id;
  if (!id) return json({ error: "Missing id" }, 400, req);

  if (req.method === "GET") {
    const server = getMcpServer(id);
    if (!server) return json({ error: "Not found" }, 404, req);
    return json({ server }, 200, req);
  }

  if (req.method === "DELETE") {
    const ok = deleteMcpServer(id);
    if (!ok) return json({ error: "Not found" }, 404, req);
    return json({ ok: true }, 200, req);
  }

  return json({ error: "Method not allowed" }, 405, req);
};

export const config: Config = {
  path: "/api/mcp/servers/:id",
  method: ["GET", "DELETE", "OPTIONS"],
};
