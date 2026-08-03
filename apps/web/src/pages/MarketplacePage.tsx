import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listMarketplace, type McpMarketplaceEntry } from "@devibe/mcp-marketplace";
import { SiteNav, Icon } from "../components/SiteNav";

export function MarketplacePage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("");
  const items = useMemo(
    () => listMarketplace({ q: q || undefined, category: category || undefined }),
    [q, category],
  );

  return (
    <div className="min-h-screen bg-bg text-text">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-text-subtle">MCP Marketplace</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Universal MCP connectors</h1>
            <p className="mt-2 max-w-xl text-sm text-text-muted">
              Every server exposes auth, permissions, tools, resources, events, logging, health,
              secrets, versioning, metrics, and docs.
            </p>
          </div>
          <Link to="/mcp" className="dv-btn-primary px-4 py-2 text-sm">
            Open MCP Builder
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <input
            className="dv-input max-w-xs"
            placeholder="Search servers…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="dv-input max-w-[180px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {["data", "cloud", "devops", "ai", "comms", "payments", "productivity"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <MarketplaceCard key={item.id} item={item} />
          ))}
        </div>
      </main>
    </div>
  );
}

function MarketplaceCard({ item }: { item: McpMarketplaceEntry }) {
  return (
    <article className="dv-card flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="font-medium">{item.name}</h2>
          <p className="text-[11px] text-text-subtle">{item.category}</p>
        </div>
        {item.featured ? <span className="dv-tag">featured</span> : null}
      </div>
      <p className="flex-1 text-sm text-text-muted">{item.description}</p>
      <p className="font-mono text-[11px] text-primary">{item.installCommand}</p>
      <div className="flex flex-wrap gap-1">
        {item.languages.map((lang) => (
          <span key={lang} className="rounded bg-surface-elevated px-2 py-0.5 text-[10px] text-text-subtle">
            {lang}
          </span>
        ))}
      </div>
      <button type="button" className="dv-btn-secondary w-full py-2 text-xs">
        <Icon name="download" className="text-sm" /> Install
      </button>
    </article>
  );
}
