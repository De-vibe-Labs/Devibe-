import { readFile } from "node:fs/promises";
import { parse as parseYaml } from "yaml";
import {
  ProjectFileSchema,
  type DevibeProject,
  type ProjectFile,
  evaluateLinkage,
  type LinkageStatus,
} from "./schema.js";

export interface ParseResult {
  project: DevibeProject;
  linkage: LinkageStatus;
  source: "yaml" | "front-matter";
}

function unwrap(raw: unknown): unknown {
  if (raw && typeof raw === "object" && "devibe" in (raw as object)) {
    return raw;
  }
  return { devibe: raw };
}

/** Parse a `.devibe/project.yaml` (or equivalent) document. */
export function parseProjectYaml(content: string): ParseResult {
  const raw = parseYaml(content);
  const file = ProjectFileSchema.parse(unwrap(raw)) as ProjectFile;
  return {
    project: file.devibe,
    linkage: evaluateLinkage(file.devibe),
    source: "yaml",
  };
}

/**
 * Extract a `devibe:` block from PRD markdown / `.prompt` front-matter.
 * Supports YAML front-matter between --- fences, or an indented `devibe:` section.
 */
export function parsePrdFrontMatter(content: string): ParseResult {
  const fence = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (fence) {
    const result = parseProjectYaml(fence[1]);
    return { ...result, source: "front-matter" };
  }

  // Fallback: find a top-level `devibe:` YAML subtree until blank line or EOF.
  const idx = content.search(/^devibe:\s*$/m);
  if (idx === -1) {
    throw new Error(
      "No devibe front-matter found. Add YAML between --- fences or a top-level `devibe:` block.",
    );
  }
  const slice = content.slice(idx);
  const end = slice.search(/\n\s*\n/);
  const yamlBlock = end === -1 ? slice : slice.slice(0, end);
  const result = parseProjectYaml(yamlBlock);
  return { ...result, source: "front-matter" };
}

export async function loadProjectYaml(path: string): Promise<ParseResult> {
  const content = await readFile(path, "utf8");
  return parseProjectYaml(content);
}

export function formatLinkageBanner(linkage: LinkageStatus): string {
  if (linkage.managementLoopActive) {
    return "Cloud + GitHub linked — full lifecycle management available.";
  }
  return `Lifecycle management incomplete. Missing: ${linkage.missing.join(", ") || "unknown"}`;
}
