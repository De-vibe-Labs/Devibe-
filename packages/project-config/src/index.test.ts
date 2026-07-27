import { describe, expect, it } from "vitest";
import {
  parseProjectYaml,
  parsePrdFrontMatter,
  evaluateLinkage,
  formatLinkageBanner,
} from "../src/index.js";

const SAMPLE = `
devibe:
  version: 1
  tags:
    - github-connected
    - cloud-enabled
    - auto-scale
  github:
    owner: De-vibe-Labs
    repo: genesis-alpha
    default_branch: main
  cloud:
    primary: cloudflare
    adapters: [cloudflare, aws, gcp, azure]
    region_preference: auto
    scale_policy: cost-optimized
  memory:
    project_id: 550e8400-e29b-41d4-a716-446655440000
`;

describe("parseProjectYaml", () => {
  it("parses a tagged project and activates the management loop", () => {
    const { project, linkage } = parseProjectYaml(SAMPLE);
    expect(project.version).toBe(1);
    expect(project.cloud?.primary).toBe("cloudflare");
    expect(linkage.managementLoopActive).toBe(true);
    expect(formatLinkageBanner(linkage)).toMatch(/full lifecycle management/i);
  });

  it("reports missing linkage when tags are absent", () => {
    const { linkage } = parseProjectYaml(`
devibe:
  version: 1
  tags: []
`);
    expect(linkage.managementLoopActive).toBe(false);
    expect(linkage.missing).toContain("tag:github-connected");
    expect(linkage.missing).toContain("tag:cloud-enabled");
  });
});

describe("parsePrdFrontMatter", () => {
  it("reads YAML front-matter fences", () => {
    const md = `---
devibe:
  version: 1
  tags: [github-connected, cloud-enabled]
  github:
    owner: acme
    repo: app
  cloud:
    primary: aws
    adapters: [aws]
  memory:
    project_id: 550e8400-e29b-41d4-a716-446655440000
---

# Product Requirements
Ship the thing.
`;
    const { linkage, source } = parsePrdFrontMatter(md);
    expect(source).toBe("front-matter");
    expect(linkage.managementLoopActive).toBe(true);
  });
});

describe("evaluateLinkage", () => {
  it("requires both github and cloud config when tags are present", () => {
    const status = evaluateLinkage({
      version: 1,
      tags: ["github-connected", "cloud-enabled"],
      production_auto: false,
    });
    expect(status.managementLoopActive).toBe(false);
    expect(status.missing).toEqual(
      expect.arrayContaining(["github config", "cloud config"]),
    );
  });
});
