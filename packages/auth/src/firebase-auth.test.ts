import { describe, expect, it } from "vitest";
import { isFirebaseConfigured, resolveFirebaseConfig } from "./firebase-auth.js";

describe("firebase config resolution", () => {
  it("returns null when required keys are missing", () => {
    expect(resolveFirebaseConfig({})).toBeNull();
    expect(isFirebaseConfigured({})).toBe(false);
  });

  it("accepts VITE_ prefixed env vars", () => {
    const config = resolveFirebaseConfig({
      VITE_FIREBASE_API_KEY: "key",
      VITE_FIREBASE_AUTH_DOMAIN: "app.firebaseapp.com",
      VITE_FIREBASE_PROJECT_ID: "app",
      VITE_FIREBASE_APP_ID: "1:2:web:3",
    });
    expect(config).toEqual({
      apiKey: "key",
      authDomain: "app.firebaseapp.com",
      projectId: "app",
      appId: "1:2:web:3",
      messagingSenderId: undefined,
      storageBucket: undefined,
    });
  });

  it("accepts bare FIREBASE_* env vars", () => {
    const config = resolveFirebaseConfig({
      FIREBASE_API_KEY: "key",
      FIREBASE_AUTH_DOMAIN: "app.firebaseapp.com",
      FIREBASE_PROJECT_ID: "app",
      FIREBASE_APP_ID: "1:2:web:3",
      FIREBASE_MESSAGING_SENDER_ID: "123",
      FIREBASE_STORAGE_BUCKET: "app.appspot.com",
    });
    expect(config?.messagingSenderId).toBe("123");
    expect(config?.storageBucket).toBe("app.appspot.com");
  });
});
