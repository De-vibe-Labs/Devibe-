export type AuthProviderId = "github" | "google" | "gitlab" | "bitbucket";

export type AuthBackend = "firebase" | "identity" | "local";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  emailVerified: boolean;
  provider: "email" | AuthProviderId | "local";
  avatarUrl?: string;
}

export interface AuthSettings {
  autoconfirm: boolean;
  disableSignup: boolean;
  providers: Partial<Record<AuthProviderId, boolean>>;
  /** true when Netlify Identity is reachable */
  identityAvailable: boolean;
  /** true when Firebase web config is present */
  firebaseAvailable: boolean;
  /** Active auth backend for this session */
  backend: AuthBackend;
}

export type AuthMode = AuthBackend;

export class AuthError extends Error {
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}
