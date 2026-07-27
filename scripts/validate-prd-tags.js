#!/usr/bin/env node
/**
 * Guard script: validate PRD.md frontmatter and .devibe/project.yaml
 * before scaling or full agent runs (used by `make prd-validate`).
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const REQUIRED_TAGS = ["github-connected", "cloud-enabled"];

async function loadParser() {
  const dist = join(root, "packages/project-config/dist/index.js");
  if (!existsSync(dist)) {
    console.error("Missing @devibe/project-config build. Run: pnpm --filter @devibe/project-config build");
    process.exit(1);
  }
  return import(pathToFileURL(dist).href);
}

function fail(msg) {
  console.error(`✖ ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`✔ ${msg}`);
}

function assertTags(project, label) {
  const tags = new Set((project.tags ?? []).map((t) => String(t).toLowerCase()));
  for (const t of REQUIRED_TAGS) {
    if (!tags.has(t)) fail(`${label}: missing required tag \`${t}\``);
  }
  if (tags.has("auto-scale")) ok(`${label}: auto-scale present`);
  else console.warn(`⚠ ${label}: optional tag \`auto-scale\` not set`);
}

function assertGithubCloud(project, label) {
  if (!project.github?.owner || !project.github?.repo) {
    fail(`${label}: github.owner / github.repo required`);
  } else if (
    String(project.github.owner).includes("{{") ||
    String(project.github.repo).includes("{{")
  ) {
    fail(`${label}: replace GitHub placeholders ({{GITHUB_OWNER}} / {{GITHUB_REPO}})`);
  } else {
    ok(`${label}: github ${project.github.owner}/${project.github.repo}`);
  }

  if (!project.cloud?.primary || !project.cloud?.adapters?.length) {
    fail(`${label}: cloud.primary and cloud.adapters required`);
  } else {
    ok(`${label}: cloud primary=${project.cloud.primary} adapters=[${project.cloud.adapters.join(", ")}]`);
  }
}

function syncCheck(prdProject, yamlProject) {
  const fields = [
    ["github.owner", prdProject.github?.owner, yamlProject.github?.owner],
    ["github.repo", prdProject.github?.repo, yamlProject.github?.repo],
    ["cloud.primary", prdProject.cloud?.primary, yamlProject.cloud?.primary],
    ["memory.project_id", prdProject.memory?.project_id, yamlProject.memory?.project_id],
  ];
  for (const [name, a, b] of fields) {
    if (a !== b) fail(`PRD.md and .devibe/project.yaml disagree on ${name}: ${a} vs ${b}`);
  }
  ok("PRD.md frontmatter ↔ .devibe/project.yaml in sync");
}

async function main() {
  const { parsePrdFrontMatter, parseProjectYaml, formatLinkageBanner, evaluateLinkage } =
    await loadParser();

  const prdPath = join(root, "PRD.md");
  const yamlPath = join(root, ".devibe/project.yaml");

  if (!existsSync(prdPath)) fail(`Missing ${prdPath}`);
  if (!existsSync(yamlPath)) fail(`Missing ${yamlPath}`);

  const prd = parsePrdFrontMatter(readFileSync(prdPath, "utf8"));
  const yaml = parseProjectYaml(readFileSync(yamlPath, "utf8"));

  assertTags(prd.project, "PRD.md");
  assertTags(yaml.project, "project.yaml");
  assertGithubCloud(prd.project, "PRD.md");
  assertGithubCloud(yaml.project, "project.yaml");
  syncCheck(prd.project, yaml.project);

  const linkage = evaluateLinkage(yaml.project);
  console.log(`\n${formatLinkageBanner(linkage)}`);
  if (!linkage.managementLoopActive) {
    fail(`Management loop inactive. Missing: ${linkage.missing.join(", ")}`);
  } else {
    ok("Management loop active — agents may plan / scale / deploy");
  }

  if (process.exitCode) {
    console.error("\nprd-validate failed");
    process.exit(process.exitCode);
  }
  console.log("\nprd-validate passed");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
