export type {
  AuthUser,
  AuthSettings,
  AuthProviderId,
  AuthMode,
  AuthBackend,
} from "./types.js";
export { AuthError } from "./types.js";
export type { PreferredAuthMode, ResolvedAuthBackend } from "./auth-client.js";
export {
  AUTH_EVENTS,
  setAuthMode,
  resolveAuthBackend,
  probeIdentity,
  getAuthSettings,
  getUser,
  login,
  signup,
  logout,
  oauthLogin,
  handleAuthCallback,
  onAuthChange,
} from "./auth-client.js";
export {
  localGetUser,
  localLogin,
  localSignup,
  localLogout,
  localOAuthLogin,
  hashPassword,
} from "./local-session.js";
export {
  isFirebaseConfigured,
  resolveFirebaseConfig,
  mapFirebaseUser,
  setFirebaseConfigOverride,
  firebaseOAuthLogin,
  firebaseGithubLogin,
  type FirebaseWebConfig,
} from "./firebase-auth.js";
