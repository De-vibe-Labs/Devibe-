import { useEffect, useState } from "react";
import { SiteNav, Icon } from "../components/SiteNav";
import { createBrowserPairing } from "../lib/qr-pairing";

const ROLES = [
  "owner",
  "admin",
  "developer",
  "maintainer",
  "guest",
  "viewer",
  "custom",
] as const;

const PERMISSIONS = [
  "repositories",
  "deployments",
  "secrets",
  "databases",
  "storage",
  "billing",
  "agents",
  "plugins",
  "logs",
  "monitoring",
] as const;

export function SecurityCenterPage() {
  const [purpose, setPurpose] = useState("workspace_pairing");
  const [qr, setQr] = useState<string>("Generating secure QR…");
  const [expiry, setExpiry] = useState("");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { payload, qr: code } = await createBrowserPairing({
        projectId: "proj_monaco",
        workspaceId: "ws_primary",
        purpose,
        signingSecret: "web-demo-pairing-secret",
      });
      if (!cancelled) {
        setQr(code);
        setExpiry(payload.expiry);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [purpose]);

  return (
    <div className="min-h-screen bg-bg text-text">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-text-subtle">Security Center</p>
        <h1 className="mt-2 text-3xl font-semibold">Trust, access, and recovery</h1>
        <p className="mt-2 max-w-2xl text-sm text-text-muted">
          Sessions, devices, API/SSH keys, QR pairings, vault refs, and audit — credentials never
          appear in QR payloads or logs.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="dv-card space-y-4 p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Icon name="qr_code_2" /> QR Developer Access
            </h2>
            <select
              className="dv-input"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            >
              <option value="workspace_pairing">Workspace pairing</option>
              <option value="device_pairing">Device pairing</option>
              <option value="login">Instant secure login</option>
              <option value="mobile_companion">Mobile companion</option>
              <option value="terminal_pairing">Terminal pairing</option>
            </select>
            <div className="rounded-xl border border-border bg-surface p-4 font-mono text-[10px] break-all text-text-muted">
              {qr}
            </div>
            <p className="text-[11px] text-text-subtle">Expires {expiry || "—"}</p>
            <ul className="space-y-1 text-xs text-text-muted">
              <li>encryptedSessionToken · projectId · workspaceId</li>
              <li>deviceRegistrationRequest · expiry · signature</li>
              <li className="text-success">No passwords / API keys / private keys in QR</li>
            </ul>
          </section>

          <section className="dv-card space-y-4 p-5">
            <h2 className="text-sm font-semibold">Project access control</h2>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((role) => (
                <span key={role} className="dv-tag">
                  {role}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PERMISSIONS.map((p) => (
                <label key={p} className="flex items-center gap-2 text-xs text-text-muted">
                  <input type="checkbox" defaultChecked className="accent-primary" readOnly />
                  {p}
                </label>
              ))}
            </div>
          </section>

          <section className="dv-card space-y-3 p-5">
            <h2 className="text-sm font-semibold">Active trust surface</h2>
            <ul className="space-y-2 text-xs text-text-muted">
              {[
                "Active sessions",
                "Trusted devices",
                "API keys",
                "SSH keys",
                "QR pairings",
                "Repository access",
                "Cloud permissions",
                "MCP permissions",
                "Secret vault",
                "Audit logs",
                "Threat detection",
                "Suspicious logins",
              ].map((row) => (
                <li key={row} className="flex justify-between border-b border-border/60 py-1.5">
                  <span>{row}</span>
                  <span className="text-success">monitored</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="dv-card space-y-3 p-5">
            <h2 className="text-sm font-semibold">Secure login methods</h2>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                "Supabase Auth",
                "GitHub OAuth",
                "Google OAuth",
                "Microsoft OAuth",
                "Magic Links",
                "Passkeys",
                "WebAuthn",
                "Hardware Keys",
                "2FA",
                "Recovery Codes",
              ].map((m) => (
                <span key={m} className="rounded-full border border-border px-2.5 py-1 text-text-muted">
                  {m}
                </span>
              ))}
            </div>
            <p className="text-xs text-text-muted">
              Recovery: encrypted package · emergency codes · recovery QR · offline backup · secret
              rotation · session revocation
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
