import {
  getUser as identityGetUser,
  login as identityLogin,
  logout as identityLogout,
  signup as identitySignup,
  oauthLogin as identityOauthLogin,
  handleAuthCallback as identityHandleAuthCallback,
  onAuthChange as identityOnAuthChange,
  getSettings as identityGetSettings,
  AUTH_EVENTS,
  AuthError as IdentityAuthError,
  MissingIdentityError,
  type User as IdentityUser,
} from "@netlify/identity";
import type { AuthProviderId, AuthSettings, AuthUser } from "./types.js";
import { AuthError } from "./types.js";
import {
  localGetUser,
  localLogin,
  localLogout,
  localOAuthLogin,
  localSignup,
} from "./local-session.js";

export { AUTH_EVENTS };

let preferredMode: "auto" | "identity" | "local" = "auto";
let cachedIdentityAvailable: boolean | null = null;

function mapUser(raw: IdentityUser | null | undefined): AuthUser | null {
  if (!raw?.email) return null;
  const provider = (raw.provider ?? "email") as AuthUser["provider"];
  return {
    id: raw.id,
    email: raw.email,
    name: raw.name,
    emailVerified: Boolean(raw.confirmedAt),
    provider: provider === "email" ? "email" : provider,
    avatarUrl: raw.pictureUrl,
  };
}

function wrapIdentityError(err: unknown): never {
  if (err instanceof IdentityAuthError) {
    throw new AuthError(err.message, err.status ?? 400);
  }
  if (err instanceof AuthError) throw err;
  throw new AuthError(err instanceof Error ? err.message : String(err));
}

export function setAuthMode(mode: "auto" | "identity" | "local"): void {
  preferredMode = mode;
  cachedIdentityAvailable = null;
}

export async function probeIdentity(): Promise<boolean> {
  if (preferredMode === "local") {
    cachedIdentityAvailable = false;
    return false;
  }
  if (preferredMode === "identity") {
    cachedIdentityAvailable = true;
    return true;
  }
  if (cachedIdentityAvailable !== null) return cachedIdentityAvailable;
  try {
    await identityGetSettings();
    cachedIdentityAvailable = true;
  } catch (err) {
    if (err instanceof MissingIdentityError || err instanceof IdentityAuthError) {
      cachedIdentityAvailable = false;
    } else {
      cachedIdentityAvailable = false;
    }
  }
  return cachedIdentityAvailable;
}

export async function getAuthSettings(): Promise<AuthSettings> {
  const available = await probeIdentity();
  if (!available) {
    return {
      autoconfirm: true,
      disableSignup: false,
      providers: { github: true, google: true },
      identityAvailable: false,
    };
  }
  try {
    const settings = await identityGetSettings();
    return {
      autoconfirm: Boolean(settings.autoconfirm),
      disableSignup: Boolean(settings.disableSignup),
      providers: settings.providers as AuthSettings["providers"],
      identityAvailable: true,
    };
  } catch {
    return {
      autoconfirm: true,
      disableSignup: false,
      providers: { github: true, google: true },
      identityAvailable: false,
    };
  }
}

export async function getUser(): Promise<AuthUser | null> {
  if (!(await probeIdentity())) return localGetUser();
  try {
    return mapUser(await identityGetUser());
  } catch {
    return localGetUser();
  }
}

export async function login(email: string, password: string): Promise<AuthUser> {
  if (!(await probeIdentity())) return localLogin(email, password);
  try {
    const user = mapUser(await identityLogin(email, password));
    if (!user) throw new AuthError("Login failed.", 401);
    return user;
  } catch (err) {
    wrapIdentityError(err);
  }
}

export async function signup(
  email: string,
  password: string,
  name?: string,
): Promise<AuthUser> {
  if (!(await probeIdentity())) return localSignup(email, password, name);
  try {
    const user = mapUser(
      await identitySignup(email, password, name ? { full_name: name } : undefined),
    );
    if (!user) throw new AuthError("Signup failed.", 400);
    return user;
  } catch (err) {
    wrapIdentityError(err);
  }
}

export async function logout(): Promise<void> {
  if (!(await probeIdentity())) {
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
  if (!(await probeIdentity())) {
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
  if (!(await probeIdentity())) return null;
  try {
    const result = await identityHandleAuthCallback();
    if (!result) return null;
    return {
      type: result.type,
      user: mapUser(result.user ?? null),
    };
  } catch (err) {
    wrapIdentityError(err);
  }
}

export function onAuthChange(
  listener: (event: string, user: AuthUser | null) => void,
): () => void {
  let unsub: (() => void) | undefined;
  void (async () => {
    if (!(await probeIdentity())) return;
    unsub = identityOnAuthChange((event, user) => {
      listener(String(event), mapUser(user));
    });
  })();
  return () => unsub?.();
}
