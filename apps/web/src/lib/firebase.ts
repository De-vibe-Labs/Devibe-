import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { setFirebaseConfigOverride, type FirebaseWebConfig } from "@devibe/auth";

/**
 * DeVibe Firebase web app config (public client keys).
 * Override with VITE_FIREBASE_* env vars in other environments if needed.
 */
export const firebaseConfig: FirebaseWebConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "AIzaSyCd6Izpi6FTF4WGXr23PJx7vqvTsbjzuHg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "de-vibe-8aca0.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "de-vibe-8aca0",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "de-vibe-8aca0.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "730481361820",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "1:730481361820:web:41d1eee698f16763457e59",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? "G-CCEKFY1HVK",
};

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;

/** Register config with @devibe/auth and initialize the Firebase app. */
export function initFirebase(): FirebaseApp {
  setFirebaseConfigOverride(firebaseConfig);
  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseApp(): FirebaseApp {
  return app ?? initFirebase();
}

/** Analytics only in the browser when the environment supports it. */
export async function initFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (analytics) return analytics;
  const supported = await isSupported().catch(() => false);
  if (!supported) return null;
  analytics = getAnalytics(getFirebaseApp());
  return analytics;
}
