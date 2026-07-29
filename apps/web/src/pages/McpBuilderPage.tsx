import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  createMcpServerDefinition,
  listAvailablePlugins,
  type McpPluginId,
  type McpServerDefinition,
} from "@devibe/mcp-builder";
import { Icon, SiteNav } from "../components/SiteNav";
import { useAuth } from "../auth/AuthProvider";
import { apiGet, apiSend } from "../lib/api";

type PluginMeta = {
  id: McpPluginId;
  name: string;
  description: string;
  recommended: boolean;
};

export function McpBuilderPage() {
  const { user } = useAuth();
  const catalog = useMemo(() => listAvailablePlugins(), []);
  const [plugins, setPlugins] = useState<McpPluginId[]>(["cloud"]);
  const [name, setName] = useState("fleet-cloud");
  const [description, setDescription] = useState(
    "MCS cloud tools for DeVibe agents (Cloudflare-primary).",
  );
  const [transport, setTransport] = useState<"stdio" | "http">("stdio");
  const [primary, setPrimary] = useState<"cloudflare" | "aws" | "gcp" | "azure">("cloudflare");
  const [servers, setServers] = useState<McpServerDefinition[]>([]);
  const [selected, setSelected] = useState<McpServerDefinition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<"config" | "bootstrap" | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await apiGet<{ servers: McpServerDefinition[] }>(
        `/api/mcp/servers${user ? `?ownerId=${encodeURIComponent(user.id)}` : ""}`,
      );
      setServers(data.servers);
    } catch {
      // API may be unavailable in plain Vite without Netlify plugin — keep client-only defs
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  function togglePlugin(id: McpPluginId) {
    setPlugins((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((p) => p !== id);
      }
      return [...prev, id];
    });
  }

  async function onCreate() {
    setBusy(true);
    setError(null);
    try {
      const payload = {
        name,
        description,
        transport,
        plugins,
        ownerId: user?.id,
        cloud: plugins.includes("cloud")
          ? {
              primary,
              adapters: ["cloudflare", "aws", "gcp", "azure"] as Array<
                "cloudflare" | "aws" | "gcp" | "azure"
              >,
              mock: true,
            }
          : undefined,
      };

      let def: McpServerDefinition;
      try {
        const res = await apiSend<{ server: McpServerDefinition }>(
          "/api/mcp/servers",
          "POST",
          payload,
        );
        def = res.server;
      } catch {
        def = createMcpServerDefinition(payload);
      }

      setSelected(def);
      setServers((prev) => [def, ...prev.filter((s) => s.id !== def.id)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function copy(text: string, kind: "config" | "bootstrap") {
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <SiteNav />
      <main className="mx-auto grid max-w-6xl gap-8 px-6 pt-24 pb-16 lg:grid-cols-[1fr_1.1fr]">
        <section className="space-y-6 animate-fade-up">
          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-text-subtle">
              MCP Server Builder
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">Compose agent tooling</h1>
            <p className="mt-2 max-w-md text-sm text-text-muted">
              Install plugins, generate Cursor / Claude Code MCP configs, and ship cloud adapters
              behind one MCS tool surface.
            </p>
          </div>

          <div className="dv-card space-y-4 p-5">
            <label className="block space-y-1.5">
              <span className="text-xs text-text-muted">Server name</span>
              <input
                className="dv-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="fleet-cloud"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs text-text-muted">Description</span>
              <textarea
                className="dv-input min-h-20"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-xs text-text-muted">Transport</span>
                <select
                  className="dv-input"
                  value={transport}
                  onChange={(e) => setTransport(e.target.value as "stdio" | "http")}
                >
                  <option value="stdio">stdio (local)</option>
                  <option value="http">HTTP (hosted)</option>
                </select>
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs text-text-muted">Cloud primary</span>
                <select
                  className="dv-input"
                  value={primary}
                  disabled={!plugins.includes("cloud")}
                  onChange={(e) =>
                    setPrimary(e.target.value as "cloudflare" | "aws" | "gcp" | "azure")
                  }
                >
                  <option value="cloudflare">Cloudflare</option>
                  <option value="aws">AWS</option>
                  <option value="gcp">GCP</option>
                  <option value="azure">Azure</option>
                </select>
              </label>
            </div>

            <div>
              <p className="mb-2 text-xs text-text-muted">Plugins</p>
              <ul className="space-y-2">
                {(catalog as PluginMeta[]).map((p) => {
                  const on = plugins.includes(p.id);
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => togglePlugin(p.id)}
                        className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                          on
                            ? "border-primary bg-primary-soft"
                            : "border-border bg-surface hover:border-border-strong"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">{p.name}</span>
                          {p.id === "cloud" ? (
                            <span className="dv-tag">recommended</span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs text-text-muted">{p.description}</p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {error ? (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {error}
              </p>
            ) : null}

            <button
              type="button"
              disabled={busy}
              onClick={() => void onCreate()}
              className="dv-btn-primary w-full py-2.5 text-sm disabled:opacity-50"
            >
              {busy ? "Building…" : "Build MCP server"}
            </button>
          </div>
        </section>

        <section className="space-y-4 animate-fade-up">
          {selected ? (
            <div className="dv-card space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{selected.name}</h2>
                  <p className="text-xs text-text-muted">
                    {selected.tools.length} tools · {selected.plugins.join(", ")}
                  </p>
                </div>
                <Link to="/chat" className="dv-btn-secondary px-3 py-1.5 text-xs">
                  Test in AI Builder
                </Link>
              </div>

              <div>
                <p className="mb-2 text-[11px] uppercase tracking-widest text-text-subtle">
                  Tools
                </p>
                <div className="flex flex-wrap gap-2">
                  {selected.tools.map((t) => (
                    <span key={t.name} className="dv-tag font-mono">
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-widest text-text-subtle">
                    Client config
                  </p>
                  <button
                    type="button"
                    className="dv-btn-secondary px-2 py-1 text-[11px]"
                    onClick={() =>
                      void copy(JSON.stringify(selected.clientConfig, null, 2), "config")
                    }
                  >
                    {copied === "config" ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="max-h-48 overflow-auto rounded-xl border border-border bg-surface p-3 font-mono text-[11px] text-accent">
                  {JSON.stringify(selected.clientConfig, null, 2)}
                </pre>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-widest text-text-subtle">
                    Bootstrap (TypeScript)
                  </p>
                  <button
                    type="button"
                    className="dv-btn-secondary px-2 py-1 text-[11px]"
                    onClick={() => void copy(selected.bootstrapTs, "bootstrap")}
                  >
                    {copied === "bootstrap" ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="max-h-56 overflow-auto rounded-xl border border-border bg-surface p-3 font-mono text-[11px]">
                  {selected.bootstrapTs}
                </pre>
              </div>
            </div>
          ) : (
            <div className="dv-card flex min-h-64 flex-col items-center justify-center p-8 text-center">
              <Icon name="extension" className="mb-3 text-3xl text-primary" />
              <p className="text-sm text-text-muted">
                Enable the <strong className="text-text">Cloud plugin</strong> and build a server to
                preview MCS tools and client config.
              </p>
            </div>
          )}

          {servers.length > 0 ? (
            <div className="dv-card p-4">
              <p className="mb-3 text-[11px] uppercase tracking-widest text-text-subtle">
                Your servers
              </p>
              <ul className="space-y-2">
                {servers.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(s)}
                      className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-left text-sm hover:border-border-strong"
                    >
                      <span>{s.name}</span>
                      <span className="text-[11px] text-text-subtle">
                        {s.plugins.join(" · ")}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
