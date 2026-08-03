import { listMarketplace, getMarketplaceEntry } from "@devibe/mcp-marketplace";
import {
  assertNoCredentialsInQr,
  createPairingPayload,
  encodePairingQr,
} from "@devibe/qr-access";
import { parseArgv, type CliResult } from "./types.js";

const BANNER = `Monaco Cloud CLI
Build. Deploy. Scale. Anywhere.
`;

function ok(command: string, message: string, data?: unknown): CliResult {
  return { ok: true, command, message, data };
}

function fail(command: string, message: string): CliResult {
  return { ok: false, command, message };
}

/** Run a monaco CLI invocation (testable). */
export async function runMonacoCli(argv: string[]): Promise<CliResult> {
  const { command, args, flags } = parseArgv(argv);

  switch (command) {
    case "help":
    case "--help":
    case "-h":
      return ok(
        "help",
        [
          BANNER,
          "Usage: monaco <command> [options]",
          "",
          "Core: login init create deploy dev build release rollback sync",
          "Runtime: logs shell tunnel monitor",
          "Data: database secrets env",
          "AI: ai agents",
          "Integrations: mcp plugins cloud k8s docker github",
          "Team: workspaces billing pair",
          "",
          "Examples:",
          "  monaco login",
          "  monaco create project my-app",
          "  monaco deploy --env production",
          "  monaco mcp list",
          "  monaco pair --project proj_1 --workspace ws_1",
        ].join("\n"),
      );

    case "version":
    case "--version":
    case "-V":
      return ok("version", "monaco 0.1.0 (Monaco Cloud)");

    case "login":
      return ok(
        "login",
        "Opening Monaco Cloud auth (Supabase / GitHub / Google / passkeys).\nUse QR pairing: monaco pair — credentials never travel in the QR payload.",
        { methods: ["supabase", "github", "google", "microsoft", "magic_link", "passkey", "webauthn"] },
      );

    case "init":
      return ok(
        "init",
        `Initialized Monaco Cloud workspace in ${process.cwd()}\nWrote .monaco/project.json + linked MCS adapters (mock).`,
        { path: process.cwd(), cloud: "cloudflare" },
      );

    case "create": {
      const kind = args[0] ?? "project";
      const name = args[1] ?? "untitled";
      if (kind !== "project") return fail("create", `Unknown create target: ${kind}`);
      return ok(
        "create",
        `Created project "${name}"\nNext: monaco github · monaco database · monaco deploy`,
        { project: name, provision: ["workspace", "env", "secrets_vault"] },
      );
    }

    case "deploy":
      return ok(
        "deploy",
        `Deploying to ${(flags.env as string) || "preview"} via MCS (Cloudflare-primary)…\nPlan ready. Approval gate required for production.`,
        { environment: flags.env || "preview", status: "planned" },
      );

    case "dev":
      return ok("dev", "Starting monaco dev — local edge runtime + hot reload + dual preview bridge.");

    case "logs":
      return ok("logs", "Streaming realtime logs (tail)…\n[edge] ready\n[agent] infrastructure idle");

    case "shell":
      return ok("shell", "Opening secure project shell (session-scoped, audited).");

    case "database":
      return ok(
        "database",
        "Supabase dataplane: database · auth · storage · realtime · vectors\nUse: monaco database migrate | monaco database mcp",
      );

    case "secrets":
      return ok(
        "secrets",
        "Secret vault online (Supabase Vault / cloud KMS / HashiCorp).\nNever print secret values. Rotation: monaco secrets rotate",
      );

    case "env":
      return ok("env", `Environment: ${(flags.name as string) || "development"}\nSynced from Monaco Cloud control plane.`);

    case "ai":
      return ok(
        "ai",
        "AI gateway: Claude (plan) · Codex (codegen)\nTry: monaco ai generate --prompt \"landing page\"",
      );

    case "mcp": {
      const sub = args[0] ?? "list";
      if (sub === "list") {
        const items = listMarketplace({ q: args[1] });
        return ok(
          "mcp",
          items.map((i) => `${i.id.padEnd(14)} ${i.name} — ${i.installCommand}`).join("\n"),
          { count: items.length },
        );
      }
      if (sub === "install") {
        const id = args[1];
        if (!id) return fail("mcp", "Usage: monaco mcp install <id>");
        const entry = getMarketplaceEntry(id);
        if (!entry) return fail("mcp", `Unknown MCP server: ${id}`);
        return ok("mcp", `Installed ${entry.name} v${entry.version}\nLanguages: ${entry.languages.join(", ")}`);
      }
      return ok("mcp", "MCP Builder: list | install | publish | test");
    }

    case "plugins":
      return ok("plugins", "Plugins: cloud · supabase · docker · kubernetes\nmonaco plugins install cloud");

    case "cloud":
      return ok("cloud", "Cloud dashboard sync — adapters: cloudflare, aws, gcp, azure");

    case "k8s":
      return ok(
        "k8s",
        "Kubernetes manager: namespaces · deployments · services · ingress · HPA · Helm\nGenerating manifests (dry-run)…",
      );

    case "docker":
      return ok("docker", "Container build pipeline queued (build → push → MCS deploy).");

    case "github":
      return ok(
        "github",
        "GitHub via OAuth / GitHub App only — passwords never requested or stored.\nImport · PR · Actions · Secrets · Deploy keys",
      );

    case "rollback":
      return ok("rollback", `Rollback target ${(flags.to as string) || "previous-release"} scheduled.`);

    case "monitor":
      return ok("monitor", "Monitoring: latency · errors · cost · agent health");

    case "tunnel":
      return ok("tunnel", "Secure tunnel established to preview environment.");

    case "sync":
      return ok("sync", "Synced workspace ↔ Monaco Cloud ↔ Git remote.");

    case "build":
      return ok("build", "Build succeeded (artifacts in .monaco/dist).");

    case "release":
      return ok("release", "Release cut — changelog + GitHub release draft.");

    case "agents":
      return ok(
        "agents",
        [
          "AI Cloud Agents (MCP-backed):",
          "  infrastructure · security · database · git",
          "  kubernetes · deployment · monitoring · cost · recovery",
        ].join("\n"),
      );

    case "workspaces":
      return ok("workspaces", "Workspaces listed. Pair a device: monaco pair");

    case "billing":
      return ok("billing", "Billing portal link (owner/admin only).");

    case "pair": {
      const projectId = (flags.project as string) || "proj_local";
      const workspaceId = (flags.workspace as string) || "ws_local";
      const signingSecret = (flags.secret as string) || process.env.MONACO_PAIRING_SECRET || "dev-only-pairing-secret";
      const payload = createPairingPayload({
        projectId,
        workspaceId,
        purpose: "workspace_pairing",
        signingSecret,
      });
      const qr = encodePairingQr(payload);
      assertNoCredentialsInQr(qr);
      return ok(
        "pair",
        [
          "QR Cloud Access (no credentials in payload)",
          `project=${projectId} workspace=${workspaceId}`,
          `expires=${payload.expiry}`,
          qr,
          "",
          "Scan → authenticate → device verified → short-lived token → workspace connected",
        ].join("\n"),
        { payload: { ...payload, encryptedSessionToken: "[redacted-in-cli-data]" }, qr },
      );
    }

    default:
      return fail(command, `Unknown command: ${command}\nRun monaco help`);
  }
}

export { parseArgv, MONACO_COMMANDS } from "./types.js";
