# `@devibe/auth`

Auth helpers with three backends (auto-selected):

1. **Firebase** — when configured. **Email/password**, **Google**, and **GitHub** Sign-In.
2. **Netlify Identity** — when Identity is reachable on a deployed Netlify site.
3. **Local session** — Vite-only demo store in `localStorage`.

```ts
import { login, signup, getUser, logout, oauthLogin } from "@devibe/auth";

await signup("you@example.com", "password123", "You");
await oauthLogin("github"); // Firebase GitHub popup when configured
await oauthLogin("google");
const user = await getUser();
```

## Firebase setup

In Firebase Console → Authentication → Sign-in method, enable:

- Email/Password
- Google
- GitHub (add Client ID / Secret from GitHub OAuth App)

Authorized domains must include `localhost` and your production host.

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

`apps/web` registers config via `src/lib/firebase.ts` (`setFirebaseConfigOverride`).

Chat routes to `/login?intent=github` (or navigation state) when the user is prompted to connect GitHub.

Force a backend with `setAuthMode("firebase" | "identity" | "local" | "auto")`.
