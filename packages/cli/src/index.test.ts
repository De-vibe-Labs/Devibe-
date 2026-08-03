import { describe, expect, it } from "vitest";
import { runMonacoCli } from "./cli.js";
import { MONACO_COMMANDS } from "./types.js";

describe("monaco cli", () => {
  it("exposes the required command surface", () => {
    for (const cmd of [
      "login",
      "deploy",
      "mcp",
      "k8s",
      "github",
      "agents",
      "pair",
    ]) {
      expect(MONACO_COMMANDS).toContain(cmd);
    }
  });

  it("lists marketplace via monaco mcp list", async () => {
    const res = await runMonacoCli(["node", "monaco", "mcp", "list"]);
    expect(res.ok).toBe(true);
    expect(res.message).toContain("supabase");
  });

  it("creates pairing QR without credentials", async () => {
    const res = await runMonacoCli([
      "node",
      "monaco",
      "pair",
      "--project",
      "p1",
      "--workspace",
      "w1",
    ]);
    expect(res.ok).toBe(true);
    expect(res.message).toContain("monaco-cloud://pair");
    expect(res.message.toLowerCase()).not.toContain("password=");
  });
});
