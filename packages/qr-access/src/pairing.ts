import { createHmac, randomBytes, createHash, timingSafeEqual } from "node:crypto";
import type {
  CreatePairingInput,
  QrPairingPayload,
  VerifyPairingResult,
} from "./types.js";

function b64url(buf: Buffer | string): string {
  const b = typeof buf === "string" ? Buffer.from(buf, "utf8") : buf;
  return b
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromB64url(s: string): Buffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const normalized = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(normalized, "base64");
}

function canonical(payload: Omit<QrPairingPayload, "signature">): string {
  return [
    payload.v,
    payload.purpose,
    payload.projectId,
    payload.workspaceId,
    payload.deviceRegistrationRequest,
    payload.encryptedSessionToken,
    payload.expiry,
  ].join("|");
}

function sign(secret: string, data: string): string {
  return b64url(createHmac("sha256", secret).update(data).digest());
}

/**
 * Create a QR pairing payload.
 * NEVER put passwords, API keys, refresh tokens, or SSH private keys here.
 */
export function createPairingPayload(input: CreatePairingInput): QrPairingPayload {
  const ttl = input.ttlSeconds ?? 300;
  const expiry = new Date(Date.now() + ttl * 1000).toISOString();
  const deviceRegistrationRequest = b64url(
    JSON.stringify({
      nonce: randomBytes(16).toString("hex"),
      ts: Date.now(),
    }),
  );
  const seed = input.sessionSeed ?? randomBytes(32).toString("hex");
  // Encrypted session token = opaque ciphertext stand-in (AES envelope in production vault).
  // Here we store only a keyed digest of the seed — the seed itself stays off-QR.
  const encryptedSessionToken = b64url(
    createHmac("sha256", input.signingSecret).update(`sess:${seed}`).digest(),
  );

  const unsigned: Omit<QrPairingPayload, "signature"> = {
    v: 1,
    purpose: input.purpose,
    projectId: input.projectId,
    workspaceId: input.workspaceId,
    deviceRegistrationRequest,
    encryptedSessionToken,
    expiry,
  };

  return {
    ...unsigned,
    signature: sign(input.signingSecret, canonical(unsigned)),
  };
}

/** Serialize for QR / deep-link (compact JSON). */
export function encodePairingQr(payload: QrPairingPayload): string {
  return `monaco-cloud://pair?d=${b64url(JSON.stringify(payload))}`;
}

export function decodePairingQr(qr: string): QrPairingPayload {
  const match = qr.match(/[?&]d=([^&]+)/);
  if (!match?.[1]) throw new Error("Invalid Monaco Cloud pairing QR");
  const json = fromB64url(match[1]).toString("utf8");
  return JSON.parse(json) as QrPairingPayload;
}

export function verifyPairingPayload(
  payload: QrPairingPayload,
  signingSecret: string,
): VerifyPairingResult {
  if (payload.v !== 1) return { ok: false, reason: "unsupported_version" };
  if (Date.parse(payload.expiry) < Date.now()) return { ok: false, reason: "expired" };

  const unsigned: Omit<QrPairingPayload, "signature"> = {
    v: payload.v,
    purpose: payload.purpose,
    projectId: payload.projectId,
    workspaceId: payload.workspaceId,
    deviceRegistrationRequest: payload.deviceRegistrationRequest,
    encryptedSessionToken: payload.encryptedSessionToken,
    expiry: payload.expiry,
  };
  const expected = sign(signingSecret, canonical(unsigned));
  const a = Buffer.from(expected);
  const b = Buffer.from(payload.signature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, reason: "bad_signature" };
  }

  const accessToken = b64url(
    createHash("sha256")
      .update(`${payload.encryptedSessionToken}:${payload.deviceRegistrationRequest}:${Date.now()}`)
      .digest(),
  );

  return { ok: true, payload, accessToken };
}

/** Guard: ensure a QR string does not embed common secret patterns. */
export function assertNoCredentialsInQr(qr: string): void {
  const lower = qr.toLowerCase();
  const banned = ["password=", "api_key=", "apikey=", "secret=", "private_key", "begin rsa"];
  for (const b of banned) {
    if (lower.includes(b)) {
      throw new Error("QR payload must never contain credentials");
    }
  }
}
