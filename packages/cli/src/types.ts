export const MONACO_COMMANDS = [
  "login",
  "init",
  "create",
  "deploy",
  "dev",
  "logs",
  "shell",
  "database",
  "secrets",
  "env",
  "ai",
  "mcp",
  "plugins",
  "cloud",
  "k8s",
  "docker",
  "github",
  "rollback",
  "monitor",
  "tunnel",
  "sync",
  "build",
  "release",
  "agents",
  "workspaces",
  "billing",
  "help",
  "version",
  "pair",
] as const;

export type MonacoCommand = (typeof MONACO_COMMANDS)[number];

export interface CliResult {
  ok: boolean;
  command: string;
  message: string;
  data?: unknown;
}

export function parseArgv(argv: string[]): { command: string; args: string[]; flags: Record<string, string | boolean> } {
  const [, , cmd = "help", ...rest] = argv;
  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < rest.length; i++) {
    const token = rest[i]!;
    if (token.startsWith("--")) {
      const key = token.slice(2);
      const next = rest[i + 1];
      if (next && !next.startsWith("-")) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else if (token.startsWith("-") && token.length === 2) {
      flags[token.slice(1)] = true;
    } else {
      args.push(token);
    }
  }
  return { command: cmd, args, flags };
}
