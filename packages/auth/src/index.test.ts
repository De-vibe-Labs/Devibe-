import { describe, expect, it, beforeEach } from "vitest";
import {
  hashPassword,
  localLogin,
  localLogout,
  localGetUser,
  localSignup,
  localOAuthLogin,
} from "./local-session.js";
import { AuthError } from "./types.js";

describe("local session auth", () => {
  beforeEach(() => {
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
  });

  it("hashes passwords deterministically", () => {
    expect(hashPassword("secret")).toBe(hashPassword("secret"));
    expect(hashPassword("secret")).not.toBe(hashPassword("other"));
  });

  it("signs up, logs in, and logs out", () => {
    const created = localSignup("builder@devibe.app", "password123", "Builder");
    expect(created.email).toBe("builder@devibe.app");
    expect(localGetUser()?.name).toBe("Builder");

    localLogout();
    expect(localGetUser()).toBeNull();

    const again = localLogin("builder@devibe.app", "password123");
    expect(again.id).toBe(created.id);
  });

  it("rejects bad passwords", () => {
    localSignup("a@b.co", "password123");
    expect(() => localLogin("a@b.co", "wrong")).toThrow(AuthError);
  });

  it("supports local oauth shortcuts", () => {
    const user = localOAuthLogin("github");
    expect(user.provider).toBe("github");
    expect(localGetUser()?.email).toContain("github");
  });
});
