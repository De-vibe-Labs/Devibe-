# DeVibe — agent & infra shortcuts
# Prefer these targets so humans and agents share one entrypoint.

PNPM ?= pnpm
NODE ?= node

.PHONY: help install build test demo prd-validate agents-run agents-apply \
	deploy-cloudflare scale-status dev db-migrate typecheck clean \
	web-dev web-build

help:
	@echo "DeVibe targets:"
	@echo "  make install           Install workspace deps"
	@echo "  make build             Build foundation packages"
	@echo "  make test              Build + test"
	@echo "  make prd-validate      Validate PRD.md ↔ .devibe/project.yaml tags"
	@echo "  make agents-run        Validate tags then run mocked plan via MCP orchestration"
	@echo "  make agents-apply      Validate tags then mocked apply (requires APPROVED=1)"
	@echo "  make deploy-cloudflare Alias of agents-apply (Cloudflare primary, mocked Phase 1)"
	@echo "  make scale-status      manage_project status after validate"
	@echo "  make demo              End-to-end mocked demo script"
	@echo "  make web-dev           Vite web app (apps/web)"
	@echo "  make web-build         Build Vite web app"
	@echo "  make dev               MCP server watch mode"
	@echo "  make db-migrate        Placeholder for future Drizzle / D1 migrations"
	@echo "  make typecheck         Typecheck packages"
	@echo "  make clean             Remove dist outputs"

install:
	$(PNPM) install

build:
	$(PNPM) run build

test:
	$(PNPM) test

typecheck:
	$(PNPM) run typecheck

clean:
	$(PNPM) run clean

prd-validate: build
	$(NODE) scripts/validate-prd-tags.js

# Full agent lifecycle entry: tags must pass before planning.
agents-run: prd-validate
	$(PNPM) --filter @devibe/mcp-server exec tsx src/scripts/agents-run.ts --action plan

# Destructive / provisioning path — set APPROVED=1 to pass the mock approval gate.
agents-apply: prd-validate
ifndef APPROVED
	$(error Set APPROVED=1 to allow mocked apply / deploy)
endif
	$(PNPM) --filter @devibe/mcp-server exec tsx src/scripts/agents-run.ts --action apply --approved

deploy-cloudflare: agents-apply

scale-status: prd-validate
	$(PNPM) --filter @devibe/mcp-server exec tsx src/scripts/agents-run.ts --action status

demo: prd-validate
	$(PNPM) run demo

dev:
	$(PNPM) run dev:mcp

web-dev:
	$(PNPM) --filter @devibe/web dev

web-build:
	$(PNPM) --filter @devibe/web build

# Phase 1 placeholder — D1 / Postgres migrations land with apps/api.
db-migrate:
	@echo "db-migrate: no migrations yet (Phase 1 foundation SDK)."
	@echo "Add Drizzle/D1 migrations under apps/api or packages/database when apps land."
