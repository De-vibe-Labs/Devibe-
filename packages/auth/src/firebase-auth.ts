import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  type Auth,
  type AuthProvider,
  type User as FirebaseUser,
} from "firebase/auth";
import type { AuthProviderId, AuthUser } from "./types.js";
import { AuthError } from "./types.js";

export interface FirebaseWebConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  messagingSenderId?: string;
  storageBucket?: string;
  /** Optional Google Analytics measurement id (G-…) */
  measurementId?: string;
}

type EnvLike = Record<string, string | undefined>;

function readEnv(): EnvLike {
  const fromProcess =
    typeof process !== "undefined" && process.env
      ? (process.env as EnvLike)
      : {};
  const fromImportMeta = (() => {
    try {
      // Vite injects import.meta.env in the browser bundle.
      const meta = import.meta as ImportMeta & { env?: EnvLike };
      return meta.env ?? {};
    } catch {
      return {};
    }
  })();
  return { ...fromProcess, ...fromImportMeta };
}

function envValue(env: EnvLike, key: string): string | undefined {
  const viteKey = key.startsWith("VITE_") ? key : `VITE_${key}`;
  const bareKey = key.startsWith("VITE_") ? key.slice("VITE_".length) : key;
  return env[viteKey] || env[key] || env[bareKey] || undefined;
}

/** Resolve Firebase web config from Vite / process env. */
export function resolveFirebaseConfig(env: EnvLike = readEnv()): FirebaseWebConfig | null {
  const apiKey = envValue(env, "FIREBASE_API_KEY");
  const authDomain = envValue(env, "FIREBASE_AUTH_DOMAIN");
  const projectId = envValue(env, "FIREBASE_PROJECT_ID");
  const appId = envValue(env, "FIREBASE_APP_ID");
  if (!apiKey || !authDomain || !projectId || !appId) return null;
  return {
    apiKey,
    authDomain,
    projectId,
    appId,
    messagingSenderId: envValue(env, "FIREBASE_MESSAGING_SENDER_ID"),
    storageBucket: envValue(env, "FIREBASE_STORAGE_BUCKET"),
    measurementId: envValue(env, "FIREBASE_MEASUREMENT_ID"),
  };
}

export function isFirebaseConfigured(env: EnvLike = readEnv()): boolean {
  if (configOverride !== undefined) return configOverride !== null;
  return resolveFirebaseConfig(env) !== null;
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;
let githubProvider: GithubAuthProvider | null = null;
/** Test / DI override */
let configOverride: FirebaseWebConfig | null | undefined;

export function setFirebaseConfigOverride(config: FirebaseWebConfig | null | undefined): void {
  configOverride = config;
  app = null;
  auth = null;
  googleProvider = null;
  githubProvider = null;
}

function getConfig(): FirebaseWebConfig | null {
  if (configOverride !== undefined) return configOverride;
  return resolveFirebaseConfig();
}

export function getFirebaseAuth(): Auth | null {
  const config = getConfig();
  if (!config) return null;
  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp(config);
  }
  if (!auth) {
    auth = getAuth(app);
  }
  return auth;
}

function getGoogleProvider(): GoogleAuthProvider {
  if (!googleProvider) {
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });
    googleProvider.addScope("email");
    googleProvider.addScope("profile");
  }
  return googleProvider;
}

function getGithubProvider(): GithubAuthProvider {
  if (!githubProvider) {
    githubProvider = new GithubAuthProvider();
    githubProvider.addScope("read:user");
    githubProvider.addScope("user:email");
    githubProvider.addScope("repo");
  }
  return githubProvider;
}

function providerFor(id: "google" | "github"): AuthProvider {
  return id === "github" ? getGithubProvider() : getGoogleProvider();
}

export async function firebaseOAuthLogin(provider: "google" | "github"): Promise<AuthUser> {
  const a = getFirebaseAuth();
  if (!a) throw new AuthError("Firebase is not configured.", 503);
  const authProvider = providerFor(provider);
  const label = provider === "github" ? "GitHub" : "Google";
  try {
    const cred = await signInWithPopup(a, authProvider);
    const user = mapFirebaseUser(cred.user);
    if (!user) throw new AuthError(`${label} sign-in failed.`, 401);
    return user;
  } catch (err) {
    const code =
      typeof err === "object" && err && "code" in err
        ? String((err as { code: unknown }).code)
        : "";
    if (
      code.includes("popup-blocked") ||
      code.includes("popup-closed-by-user") ||
      code.includes("operation-not-supported")
    ) {
      if (code.includes("popup-closed-by-user")) {
        throw new AuthError(`${label} sign-in was cancelled.`, 400);
      }
      await signInWithRedirect(a, authProvider);
      throw new AuthError(`Redirecting to ${label} sign-in…`, 302);
    }
    wrapFirebaseError(err);
  }
}

/** @deprecated Prefer firebaseOAuthLogin("google") */
export async function firebaseGoogleLogin(): Promise<AuthUser> {
  return firebaseOAuthLogin("google");
}

export async function firebaseGithubLogin(): Promise<AuthUser> {
  return firebaseOAuthLogin("github");
}

export function mapFirebaseUser(user: FirebaseUser | null | undefined): AuthUser | null {
  if (!user?.email) return null;
  const ids = user.providerData.map((p) => p.providerId);
  const provider: AuthUser["provider"] = ids.includes("github.com")
    ? "github"
    : ids.includes("google.com")
      ? "google"
      : "email";
  return {
    id: user.uid,
    email: user.email,
    name: user.displayName ?? undefined,
    emailVerified: user.emailVerified,
    provider,
    avatarUrl: user.photoURL ?? undefined,
  };
}

function wrapFirebaseError(err: unknown): never {
  if (err instanceof AuthError) throw err;
  const code =
    typeof err === "object" && err && "code" in err
      ? String((err as { code: unknown }).code)
      : "";
  const message =
    err instanceof Error ? err.message : typeof err === "string" ? err : "Firebase auth failed.";
  const status =
    code.includes("user-not-found") ||
    code.includes("wrong-password") ||
    code.includes("invalid-credential")
      ? 401
      : code.includes("email-already-in-use")
        ? 409
        : code.includes("popup-closed")
          ? 400
          : 400;
  throw new AuthError(message.replace(/^Firebase:\s*/i, "").replace(/\s*\(.*\)$/, ""), status);
}

export async function firebaseGetUser(): Promise<AuthUser | null> {
  const a = getFirebaseAuth();
  if (!a) return null;
  // Wait for first auth state resolution so redirects / persistence settle.
  if (!a.currentUser) {
    await new Promise<void>((resolve) => {
      const unsub = onAuthStateChanged(a, () => {
        unsub();
        resolve();
      });
    });
  }
  return mapFirebaseUser(a.currentUser);
}

export async function firebaseLogin(email: string, password: string): Promise<AuthUser> {
  const a = getFirebaseAuth();
  if (!a) throw new AuthError("Firebase is not configured.", 503);
  try {
    const cred = await signInWithEmailAndPassword(a, email.trim(), password);
    const user = mapFirebaseUser(cred.user);
    if (!user) throw new AuthError("Login failed.", 401);
    return user;
  } catch (err) {
    wrapFirebaseError(err);
  }
}

export async function firebaseSignup(
  email: string,
  password: string,
  name?: string,
): Promise<AuthUser> {
  const a = getFirebaseAuth();
  if (!a) throw new AuthError("Firebase is not configured.", 503);
  try {
    const cred = await createUserWithEmailAndPassword(a, email.trim(), password);
    if (name?.trim()) {
      await updateProfile(cred.user, { displayName: name.trim() });
    }
    const user = mapFirebaseUser(cred.user);
    if (!user) throw new AuthError("Signup failed.", 400);
    return name?.trim() ? { ...user, name: name.trim() } : user;
  } catch (err) {
    wrapFirebaseError(err);
  }
}

export async function firebaseLogout(): Promise<void> {
  const a = getFirebaseAuth();
  if (!a) return;
  await signOut(a);
}

export async function firebaseHandleRedirectResult(): Promise<AuthUser | null> {
  const a = getFirebaseAuth();
  if (!a) return null;
  try {
    const result = await getRedirectResult(a);
    return mapFirebaseUser(result?.user ?? null);
  } catch (err) {
    wrapFirebaseError(err);
  }
}

export function firebaseOnAuthChange(
  listener: (user: AuthUser | null) => void,
): () => void {
  const a = getFirebaseAuth();
  if (!a) return () => undefined;
  return onAuthStateChanged(a, (user) => {
    listener(mapFirebaseUser(user));
  });
}

export function firebaseSupportsProvider(provider: AuthProviderId): boolean {
  return provider === "google" || provider === "github";
}
