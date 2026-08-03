/**
 * Browser-safe Monaco Cloud QR pairing (Web Crypto).
 * Mirrors @devibe/qr-access — never embeds credentials.
 */

export interface BrowserQrPayload {
  encryptedSessionToken: string;
  projectId: string;
  workspaceId: string;
  deviceRegistrationRequest: string;
  expiry: string;
  signature: string;
  purpose: string;
  v: 1;
}

function b64url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (const b of arr) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await importKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return b64url(sig);
}

function canonical(p: Omit<BrowserQrPayload, "signature">): string {
  return [p.v, p.purpose, p.projectId, p.workspaceId, p.deviceRegistrationRequest, p.encryptedSessionToken, p.expiry].join("|");
}

export async function createBrowserPairing(input: {
  projectId: string;
  workspaceId: string;
  purpose: string;
  signingSecret: string;
  ttlSeconds?: number;
}): Promise<{ payload: BrowserQrPayload; qr: string }> {
  const expiry = new Date(Date.now() + (input.ttlSeconds ?? 300) * 1000).toISOString();
  const nonce = b64url(crypto.getRandomValues(new Uint8Array(16)));
  const deviceRegistrationRequest = b64url(new TextEncoder().encode(JSON.stringify({ nonce, ts: Date.now() })));
  const seed = b64url(crypto.getRandomValues(new Uint8Array(32)));
  const encryptedSessionToken = await hmac(input.signingSecret, `sess:${seed}`);
  const unsigned: Omit<BrowserQrPayload, "signature"> = {
    v: 1,
    purpose: input.purpose,
    projectId: input.projectId,
    workspaceId: input.workspaceId,
    deviceRegistrationRequest,
    encryptedSessionToken,
    expiry,
  };
  const signature = await hmac(input.signingSecret, canonical(unsigned));
  const payload: BrowserQrPayload = { ...unsigned, signature };
  const json = JSON.stringify(payload);
  const qr = `monaco-cloud://pair?d=${b64url(new TextEncoder().encode(json))}`;
  const lower = qr.toLowerCase();
  if (["password=", "api_key=", "secret=", "private_key"].some((b) => lower.includes(b))) {
    throw new Error("QR payload must never contain credentials");
  }
  return { payload, qr };
}
