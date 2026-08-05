import type { Config, Context } from "@netlify/functions";
import {
  generateReferralCode,
  REFERRAL_PROGRAM,
  validateReferralCodeFormat,
} from "./_shared/billing.js";
import { json, optionsResponse } from "./_shared/http.js";

/** In-memory referral ledger for demo / local (replace with Supabase in Phase 2b). */
const REFERRALS = new Map<
  string,
  { code: string; ownerUserId: string; uses: number; creditUsd: number }
>();

export default async (req: Request, _context: Context) => {
  if (req.method === "OPTIONS") return optionsResponse(req);

  if (req.method === "GET") {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || "anonymous";
    const code = generateReferralCode(userId);
    if (!REFERRALS.has(code)) {
      REFERRALS.set(code, { code, ownerUserId: userId, uses: 0, creditUsd: 0 });
    }
    const row = REFERRALS.get(code)!;
    return json(
      {
        code: row.code,
        program: REFERRAL_PROGRAM,
        uses: row.uses,
        creditUsd: row.creditUsd,
        shareUrl: `${url.origin}/pricing?ref=${row.code}`,
      },
      200,
      req,
    );
  }

  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, req);

  let body: { action?: string; code?: string; userId?: string; invoiceUsd?: number };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400, req);
  }

  if (body.action === "validate") {
    const code = (body.code ?? "").toUpperCase();
    if (!validateReferralCodeFormat(code)) {
      return json({ valid: false, reason: "format" }, 200, req);
    }
    // Accept any well-formed code in demo; live systems check ownership ledger
    return json(
      {
        valid: true,
        code,
        discountPercent: REFERRAL_PROGRAM.refereeDiscountPercent,
        maxDiscountUsd: REFERRAL_PROGRAM.maxDiscountUsd,
      },
      200,
      req,
    );
  }

  if (body.action === "redeem") {
    const code = (body.code ?? "").toUpperCase();
    if (!validateReferralCodeFormat(code)) {
      return json({ error: "Invalid referral code" }, 400, req);
    }
    const invoice = Number(body.invoiceUsd ?? 0);
    const credit =
      Math.min(
        (invoice * REFERRAL_PROGRAM.referrerCreditPercent) / 100,
        REFERRAL_PROGRAM.maxDiscountUsd,
      );
    const existing = REFERRALS.get(code) ?? {
      code,
      ownerUserId: "unknown",
      uses: 0,
      creditUsd: 0,
    };
    existing.uses += 1;
    existing.creditUsd = Number((existing.creditUsd + credit).toFixed(2));
    REFERRALS.set(code, existing);
    return json({ ok: true, referral: existing, creditedUsd: credit }, 200, req);
  }

  return json({ error: "Unknown action. Use validate | redeem" }, 400, req);
};

export const config: Config = {
  path: "/api/billing/referral",
  method: ["GET", "POST", "OPTIONS"],
};
