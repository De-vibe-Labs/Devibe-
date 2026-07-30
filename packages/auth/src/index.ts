export type { AuthUser, AuthSettings, AuthProviderId, AuthMode } from "./types.js";
export { AuthError } from "./types.js";
export {
  AUTH_EVENTS,
  setAuthMode,
  probeIdentity,
  getAuthSettings,
  getUser,
  login,
  signup,
  logout,
  oauthLogin,
  handleAuthCallback,
  onAuthChange,
} from "./netlify-identity.js";
export {
  localGetUser,
  localLogin,
  localSignup,
  localLogout,
  localOAuthLogin,
  hashPassword,
} from "./local-session.js";
