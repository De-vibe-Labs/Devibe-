import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./firebase-auth.js", () => ({
  isFirebaseConfigured: vi.fn(() => false),
  firebaseGetUser: vi.fn(async () => null),
  firebaseLogin: vi.fn(),
  firebaseSignup: vi.fn(),
  firebaseLogout: vi.fn(),
  firebaseGoogleLogin: vi.fn(),
  firebaseHandleRedirectResult: vi.fn(async () => null),
  firebaseOnAuthChange: vi.fn(() => () => undefined),
  firebaseSupportsProvider: (provider: string) => provider === "google",
}));

vi.mock("./netlify-identity.js", () => ({
  AUTH_EVENTS: {},
  resetIdentityProbeCache: vi.fn(),
  probeNetlifyIdentity: vi.fn(async () => false),
  identityGetAuthSettings: vi.fn(async () => ({
    autoconfirm: true,
    disableSignup: false,
    providers: { github: true, google: true },
    identityAvailable: false,
    firebaseAvailable: false,
    backend: "local" as const,
  })),
  identityGetUser: vi.fn(async () => null),
  identityLogin: vi.fn(),
  identitySignup: vi.fn(),
  identityLogout: vi.fn(),
  identityOauthLogin: vi.fn(),
  identityHandleAuthCallback: vi.fn(async () => null),
  identityOnAuthChange: vi.fn(() => () => undefined),
}));

import { getAuthSettings, oauthLogin, resolveAuthBackend, setAuthMode } from "./auth-client.js";
import * as firebase from "./firebase-auth.js";
import { localOAuthLogin, localLogout } from "./local-session.js";

describe("auth-client backend resolution", () => {
  beforeEach(() => {
    setAuthMode("auto");
    vi.mocked(firebase.isFirebaseConfigured).mockReturnValue(false);
    const mem = new Map<string, string>();
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (k: string) => mem.get(k) ?? null,
        setItem: (k: string, v: string) => {
          mem.set(k, v);
        },
        removeItem: (k: string) => {
          mem.delete(k);
        },
      },
    });
    localLogout();
  });

  it("falls back to local when Firebase and Identity are unavailable", async () => {
    expect(await resolveAuthBackend()).toBe("local");
    const settings = await getAuthSettings();
    expect(settings.backend).toBe("local");
    expect(settings.firebaseAvailable).toBe(false);
  });

  it("prefers Firebase when configured in auto mode", async () => {
    vi.mocked(firebase.isFirebaseConfigured).mockReturnValue(true);
    expect(await resolveAuthBackend()).toBe("firebase");
    const settings = await getAuthSettings();
    expect(settings.backend).toBe("firebase");
    expect(settings.providers.google).toBe(true);
  });

  it("routes Google OAuth to Firebase when active", async () => {
    vi.mocked(firebase.isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(firebase.firebaseGoogleLogin).mockResolvedValue({
      id: "uid-1",
      email: "builder@gmail.com",
      emailVerified: true,
      provider: "google",
      name: "Builder",
    });
    const user = await oauthLogin("google");
    expect(user?.email).toBe("builder@gmail.com");
    expect(firebase.firebaseGoogleLogin).toHaveBeenCalledOnce();
  });

  it("keeps local Google OAuth when Firebase is off", async () => {
    const user = await oauthLogin("google");
    expect(user?.provider).toBe("google");
    expect(localOAuthLogin).toBeTypeOf("function");
  });
});
