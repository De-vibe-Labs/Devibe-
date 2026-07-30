export type AuthProviderId = "github" | "google" | "gitlab" | "bitbucket";

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
  /** true when Netlify Identity is reachable; false uses local session store */
  identityAvailable: boolean;
}

export type AuthMode = "identity" | "local";

export class AuthError extends Error {
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}
