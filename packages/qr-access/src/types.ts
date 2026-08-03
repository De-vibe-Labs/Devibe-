export type PairingPurpose =
  | "login"
  | "onboarding"
  | "mobile_companion"
  | "workspace_pairing"
  | "terminal_pairing"
  | "device_pairing"
  | "desktop_pairing";

export interface QrPairingPayload {
  /** Opaque encrypted session handle — never a password or API key */
  encryptedSessionToken: string;
  projectId: string;
  workspaceId: string;
  deviceRegistrationRequest: string;
  /** ISO-8601 expiry */
  expiry: string;
  /** HMAC / signature over canonical fields */
  signature: string;
  purpose: PairingPurpose;
  v: 1;
}

export interface CreatePairingInput {
  projectId: string;
  workspaceId: string;
  purpose: PairingPurpose;
  /** Signing secret from vault — never embedded in QR */
  signingSecret: string;
  /** TTL seconds (default 300) */
  ttlSeconds?: number;
  sessionSeed?: string;
}

export interface VerifyPairingResult {
  ok: boolean;
  reason?: string;
  payload?: QrPairingPayload;
  /** Short-lived access token issued after verify — caller stores server-side */
  accessToken?: string;
}

export type ProjectRole =
  | "owner"
  | "admin"
  | "developer"
  | "maintainer"
  | "guest"
  | "viewer"
  | "custom";

export const PROJECT_PERMISSIONS = [
  "repositories",
  "deployments",
  "secrets",
  "databases",
  "storage",
  "billing",
  "agents",
  "plugins",
  "logs",
  "monitoring",
] as const;

export type ProjectPermission = (typeof PROJECT_PERMISSIONS)[number];
