import type { AuthProviderId, AuthSettings, AuthUser } from "./types.js";
import { AuthError } from "./types.js";
import {
  firebaseGetUser,
  firebaseOAuthLogin,
  firebaseHandleRedirectResult,
  firebaseLogin,
  firebaseLogout,
  firebaseOnAuthChange,
  firebaseSignup,
  isFirebaseConfigured,
} from "./firebase-auth.js";
import {
  identityGetAuthSettings,
  identityGetUser,
  identityHandleAuthCallback,
  identityLogin,
  identityLogout,
  identityOauthLogin,
  identityOnAuthChange,
  identitySignup,
  probeNetlifyIdentity,
  resetIdentityProbeCache,
  AUTH_EVENTS,
} from "./netlify-identity.js";
import {
  localGetUser,
  localLogin,
  localLogout,
  localOAuthLogin,
  localSignup,
} from "./local-session.js";

export { AUTH_EVENTS };

export type PreferredAuthMode = "auto" | "firebase" | "identity" | "local";

let preferredMode: PreferredAuthMode = "auto";

export function setAuthMode(mode: PreferredAuthMode): void {
  preferredMode = mode;
  resetIdentityProbeCache();
}

export type ResolvedAuthBackend = "firebase" | "identity" | "local";

export async function resolveAuthBackend(): Promise<ResolvedAuthBackend> {
  if (preferredMode === "local") return "local";
  if (preferredMode === "firebase") {
    if (!isFirebaseConfigured()) {
      throw new AuthError("Firebase auth mode selected but Firebase env is not configured.", 503);
    }
    return "firebase";
  }
  if (preferredMode === "identity") return "identity";

  // auto: Firebase (when configured) → Netlify Identity → local
  if (isFirebaseConfigured()) return "firebase";
  if (await probeNetlifyIdentity()) return "identity";
  return "local";
}

export async function probeIdentity(): Promise<boolean> {
  const backend = await resolveAuthBackend();
  return backend === "identity";
}

export async function getAuthSettings(): Promise<AuthSettings> {
  const backend = await resolveAuthBackend();
  if (backend === "firebase") {
    return {
      autoconfirm: true,
      disableSignup: false,
      providers: { google: true, github: true },
      identityAvailable: false,
      firebaseAvailable: true,
      backend: "firebase",
    };
  }
  if (backend === "local") {
    return {
      autoconfirm: true,
      disableSignup: false,
      providers: { github: true, google: true },
      identityAvailable: false,
      firebaseAvailable: false,
      backend: "local",
    };
  }
  const settings = await identityGetAuthSettings();
  return { ...settings, firebaseAvailable: false, backend: "identity" };
}

export async function getUser(): Promise<AuthUser | null> {
  const backend = await resolveAuthBackend();
  if (backend === "firebase") return firebaseGetUser();
  if (backend === "local") return localGetUser();
  try {
    return await identityGetUser();
  } catch {
    return localGetUser();
  }
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const backend = await resolveAuthBackend();
  if (backend === "firebase") return firebaseLogin(email, password);
  if (backend === "local") return localLogin(email, password);
  return identityLogin(email, password);
}

export async function signup(
  email: string,
  password: string,
  name?: string,
): Promise<AuthUser> {
  const backend = await resolveAuthBackend();
  if (backend === "firebase") return firebaseSignup(email, password, name);
  if (backend === "local") return localSignup(email, password, name);
  return identitySignup(email, password, name);
}

export async function logout(): Promise<void> {
  const backend = await resolveAuthBackend();
  if (backend === "firebase") {
    await firebaseLogout();
    return;
  }
  if (backend === "local") {
    localLogout();
    return;
  }
  try {
    await identityLogout();
  } catch {
    localLogout();
  }
}

export async function oauthLogin(provider: AuthProviderId): Promise<AuthUser | void> {
  const backend = await resolveAuthBackend();
  if (backend === "firebase") {
    if (provider !== "google" && provider !== "github") {
      throw new AuthError(
        `Provider ${provider} is not available with Firebase. Use email, Google, or GitHub.`,
        400,
      );
    }
    return firebaseOAuthLogin(provider);
  }
  if (backend === "local") {
    if (provider === "github" || provider === "google") {
      return localOAuthLogin(provider);
    }
    throw new AuthError(`Provider ${provider} is not available in local mode.`, 400);
  }
  identityOauthLogin(provider);
}

export async function handleAuthCallback(): Promise<{
  type: string;
  user: AuthUser | null;
} | null> {
  const backend = await resolveAuthBackend();
  if (backend === "firebase") {
    const user = await firebaseHandleRedirectResult();
    if (!user) return null;
    return { type: "oauth", user };
  }
  if (backend === "local") return null;
  return identityHandleAuthCallback();
}

export function onAuthChange(
  listener: (event: string, user: AuthUser | null) => void,
): () => void {
  let unsub: (() => void) | undefined;
  let cancelled = false;

  void (async () => {
    const backend = await resolveAuthBackend();
    if (cancelled) return;
    if (backend === "firebase") {
      unsub = firebaseOnAuthChange((user) => {
        listener("firebase", user);
      });
      return;
    }
    if (backend === "local") return;
    unsub = identityOnAuthChange((event, user) => {
      listener(event, user);
    });
  })();

  return () => {
    cancelled = true;
    unsub?.();
  };
}
