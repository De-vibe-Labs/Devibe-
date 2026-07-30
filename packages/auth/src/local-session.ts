import type { AuthUser } from "./types.js";
import { AuthError } from "./types.js";

const STORAGE_KEY = "devibe.auth.session.v1";

interface LocalRecord {
  id: string;
  email: string;
  name?: string;
  passwordHash: string;
}

interface LocalStore {
  users: LocalRecord[];
  sessionUserId: string | null;
}

function storage(): Storage | null {
  try {
    if (typeof globalThis.localStorage === "undefined") return null;
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function readStore(): LocalStore {
  const raw = storage()?.getItem(STORAGE_KEY);
  if (!raw) return { users: [], sessionUserId: null };
  try {
    return JSON.parse(raw) as LocalStore;
  } catch {
    return { users: [], sessionUserId: null };
  }
}

function writeStore(store: LocalStore): void {
  storage()?.setItem(STORAGE_KEY, JSON.stringify(store));
}

/** Cheap non-crypto hash for local-only demo credentials (never use in production). */
export function hashPassword(password: string): string {
  let h = 2166136261;
  for (let i = 0; i < password.length; i++) {
    h ^= password.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `local:${(h >>> 0).toString(16)}`;
}

function toUser(record: LocalRecord): AuthUser {
  return {
    id: record.id,
    email: record.email,
    name: record.name,
    emailVerified: true,
    provider: "local",
  };
}

export function localGetUser(): AuthUser | null {
  const store = readStore();
  if (!store.sessionUserId) return null;
  const record = store.users.find((u) => u.id === store.sessionUserId);
  return record ? toUser(record) : null;
}

export function localLogin(email: string, password: string): AuthUser {
  const store = readStore();
  const normalized = email.trim().toLowerCase();
  const record = store.users.find((u) => u.email === normalized);
  if (!record || record.passwordHash !== hashPassword(password)) {
    throw new AuthError("Invalid email or password.", 401);
  }
  store.sessionUserId = record.id;
  writeStore(store);
  return toUser(record);
}

export function localSignup(email: string, password: string, name?: string): AuthUser {
  const store = readStore();
  const normalized = email.trim().toLowerCase();
  if (store.users.some((u) => u.email === normalized)) {
    throw new AuthError("An account with this email already exists.", 409);
  }
  if (password.length < 8) {
    throw new AuthError("Password must be at least 8 characters.", 400);
  }
  const record: LocalRecord = {
    id: crypto.randomUUID(),
    email: normalized,
    name: name?.trim() || undefined,
    passwordHash: hashPassword(password),
  };
  store.users.push(record);
  store.sessionUserId = record.id;
  writeStore(store);
  return toUser(record);
}

export function localLogout(): void {
  const store = readStore();
  store.sessionUserId = null;
  writeStore(store);
}

export function localOAuthLogin(provider: "github" | "google"): AuthUser {
  const store = readStore();
  const email = `${provider}-user@local.devibe.app`;
  let record = store.users.find((u) => u.email === email);
  if (!record) {
    record = {
      id: crypto.randomUUID(),
      email,
      name: provider === "github" ? "GitHub Builder" : "Google Builder",
      passwordHash: hashPassword(`oauth:${provider}`),
    };
    store.users.push(record);
  }
  store.sessionUserId = record.id;
  writeStore(store);
  return { ...toUser(record), provider };
}
