# `@devibe/cli` — Monaco Cloud CLI

Binary: **`monaco`**

```bash
pnpm --filter @devibe/cli build
node packages/cli/dist/bin.js help
# after link:
monaco login
monaco create project my-app
monaco deploy
monaco mcp list
monaco pair --project proj_1 --workspace ws_1
```

QR pairing never embeds credentials — see `@devibe/qr-access`.
