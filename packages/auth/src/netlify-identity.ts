import {
  getUser as identitySdkGetUser,
  login as identitySdkLogin,
  logout as identitySdkLogout,
  signup as identitySdkSignup,
  oauthLogin as identitySdkOauthLogin,
  handleAuthCallback as identitySdkHandleAuthCallback,
  onAuthChange as identitySdkOnAuthChange,
  getSettings as identitySdkGetSettings,
  AUTH_EVENTS,
  AuthError as IdentityAuthError,
  MissingIdentityError,
  type User as IdentityUser,
} from "@netlify/identity";
import type { AuthProviderId, AuthSettings, AuthUser } from "./types.js";
import { AuthError } from "./types.js";

export { AUTH_EVENTS };

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

/** Reset the Netlify Identity availability cache (tests / mode switches). */
export function resetIdentityProbeCache(): void {
  cachedIdentityAvailable = null;
}

export async function probeNetlifyIdentity(): Promise<boolean> {
  if (cachedIdentityAvailable !== null) return cachedIdentityAvailable;
  try {
    await identitySdkGetSettings();
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

export async function identityGetAuthSettings(): Promise<AuthSettings> {
  const available = await probeNetlifyIdentity();
  if (!available) {
    return {
      autoconfirm: true,
      disableSignup: false,
      providers: { github: true, google: true },
      identityAvailable: false,
      firebaseAvailable: false,
      backend: "local",
    };
  }
  try {
    const settings = await identitySdkGetSettings();
    return {
      autoconfirm: Boolean(settings.autoconfirm),
      disableSignup: Boolean(settings.disableSignup),
      providers: settings.providers as AuthSettings["providers"],
      identityAvailable: true,
      firebaseAvailable: false,
      backend: "identity",
    };
  } catch {
    return {
      autoconfirm: true,
      disableSignup: false,
      providers: { github: true, google: true },
      identityAvailable: false,
      firebaseAvailable: false,
      backend: "local",
    };
  }
}

export async function identityGetUser(): Promise<AuthUser | null> {
  try {
    return mapUser(await identitySdkGetUser());
  } catch {
    return null;
  }
}

export async function identityLogin(email: string, password: string): Promise<AuthUser> {
  try {
    const user = mapUser(await identitySdkLogin(email, password));
    if (!user) throw new AuthError("Login failed.", 401);
    return user;
  } catch (err) {
    wrapIdentityError(err);
  }
}

export async function identitySignup(
  email: string,
  password: string,
  name?: string,
): Promise<AuthUser> {
  try {
    const user = mapUser(
      await identitySdkSignup(email, password, name ? { full_name: name } : undefined),
    );
    if (!user) throw new AuthError("Signup failed.", 400);
    return user;
  } catch (err) {
    wrapIdentityError(err);
  }
}

export async function identityLogout(): Promise<void> {
  await identitySdkLogout();
}

export function identityOauthLogin(provider: AuthProviderId): void {
  identitySdkOauthLogin(provider);
}

export async function identityHandleAuthCallback(): Promise<{
  type: string;
  user: AuthUser | null;
} | null> {
  try {
    const result = await identitySdkHandleAuthCallback();
    if (!result) return null;
    return {
      type: result.type,
      user: mapUser(result.user ?? null),
    };
  } catch (err) {
    wrapIdentityError(err);
  }
}

export function identityOnAuthChange(
  listener: (event: string, user: AuthUser | null) => void,
): () => void {
  return identitySdkOnAuthChange((event, user) => {
    listener(String(event), mapUser(user));
  });
}
