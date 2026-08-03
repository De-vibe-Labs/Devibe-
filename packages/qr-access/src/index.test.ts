import { describe, expect, it } from "vitest";
import {
  assertNoCredentialsInQr,
  createPairingPayload,
  decodePairingQr,
  encodePairingQr,
  verifyPairingPayload,
} from "./pairing.js";

describe("qr pairing", () => {
  const secret = "test-signing-secret-not-for-prod";

  it("creates signed QR without credentials", () => {
    const payload = createPairingPayload({
      projectId: "proj_1",
      workspaceId: "ws_1",
      purpose: "workspace_pairing",
      signingSecret: secret,
    });
    const qr = encodePairingQr(payload);
    assertNoCredentialsInQr(qr);
    expect(qr.startsWith("monaco-cloud://pair?d=")).toBe(true);
    expect(qr.toLowerCase()).not.toContain("password");
    expect(verifyPairingPayload(payload, secret).ok).toBe(true);
  });

  it("rejects tampered signatures", () => {
    const payload = createPairingPayload({
      projectId: "proj_1",
      workspaceId: "ws_1",
      purpose: "login",
      signingSecret: secret,
    });
    payload.signature = "deadbeef";
    expect(verifyPairingPayload(payload, secret).ok).toBe(false);
  });

  it("round-trips encode/decode", () => {
    const payload = createPairingPayload({
      projectId: "proj_1",
      workspaceId: "ws_1",
      purpose: "device_pairing",
      signingSecret: secret,
    });
    const again = decodePairingQr(encodePairingQr(payload));
    expect(again.projectId).toBe("proj_1");
    expect(again.encryptedSessionToken).toBe(payload.encryptedSessionToken);
  });
});
