# `@devibe/auth`

Netlify Identity client helpers with a **local session fallback** for Vite-only development (Identity does not work with `netlify dev` / brand-new sites without a deploy).

```ts
import { login, signup, getUser, logout, oauthLogin } from "@devibe/auth";

await signup("you@example.com", "password123", "You");
const user = await getUser();
```

On Netlify (Identity enabled), email/password + OAuth use `@netlify/identity`. Locally, credentials are stored in `localStorage` for demo UX only.
