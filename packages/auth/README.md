# `@devibe/auth`

Auth helpers with three backends (auto-selected):

1. **Firebase** — when `VITE_FIREBASE_*` (or `FIREBASE_*`) web config is set. Google Sign-In + email/password.
2. **Netlify Identity** — when Identity is reachable on a deployed Netlify site.
3. **Local session** — Vite-only demo store in `localStorage` (no Identity / Firebase).

```ts
import { login, signup, getUser, logout, oauthLogin } from "@devibe/auth";

await signup("you@example.com", "password123", "You");
await oauthLogin("google"); // Firebase Google popup when configured
const user = await getUser();
```

## Firebase Google Sign-In

Create a Firebase project → Authentication → enable **Google** and **Email/Password**.
Add your web app and copy the config into `apps/web/.env` (or the monorepo root `.env`):

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
# optional
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MEASUREMENT_ID=
```

`apps/web` also calls `setFirebaseConfigOverride()` from `src/lib/firebase.ts` (DeVibe Firebase project defaults + Analytics).

Authorized domains in Firebase Console must include `localhost` and your production host. Enable the **Google** provider under Authentication → Sign-in method.

Force a backend with `setAuthMode("firebase" | "identity" | "local" | "auto")`.
