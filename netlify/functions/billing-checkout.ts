import type { Config, Context } from "@netlify/functions";
import {
  applyReferralDiscount,
  generateReferralCode,
  getPlan,
  validateReferralCodeFormat,
  type BillingInterval,
} from "./_shared/billing.js";
import { json, optionsResponse } from "./_shared/http.js";

function env(key: string): string | undefined {
  return (
    process.env[key] ||
    (typeof Netlify !== "undefined" ? Netlify.env.get(key) : undefined)
  );
}

export default async (req: Request, _context: Context) => {
  if (req.method === "OPTIONS") return optionsResponse(req);
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, req);

  let body: {
    planId?: string;
    interval?: BillingInterval;
    referralCode?: string;
    customerEmail?: string;
    userId?: string;
    successUrl?: string;
    cancelUrl?: string;
  };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400, req);
  }

  const plan = getPlan(body.planId ?? "");
  if (!plan) return json({ error: "Unknown plan" }, 400, req);
  if (plan.id === "free") {
    return json({ ok: true, planId: "free", message: "Already on Free — no checkout required." }, 200, req);
  }
  if (plan.id === "enterprise") {
    return json(
      { ok: true, contactSales: true, message: "Contact sales for Enterprise." },
      200,
      req,
    );
  }

  const interval: BillingInterval = body.interval === "year" ? "year" : "month";
  const listPrice = interval === "year" ? plan.priceYearlyUsd : plan.priceMonthlyUsd;
  const priced = applyReferralDiscount(listPrice, body.referralCode);
  if (body.referralCode && !validateReferralCodeFormat(body.referralCode)) {
    return json({ error: "Invalid referral code format" }, 400, req);
  }

  const origin = req.headers.get("Origin") || env("URL") || "http://localhost:5173";
  const successUrl = body.successUrl || `${origin}/pricing?checkout=success`;
  const cancelUrl = body.cancelUrl || `${origin}/pricing?checkout=cancel`;
  const stripeKey = env("STRIPE_SECRET_KEY");
  const priceId =
    interval === "year" ? plan.stripePriceYearly : plan.stripePriceMonthly;

  if (stripeKey && priceId) {
    try {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(stripeKey);
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: body.customerEmail,
        line_items: [{ price: priceId, quantity: 1 }],
        allow_promotion_codes: true,
        metadata: {
          planId: plan.id,
          referralCode: body.referralCode?.toUpperCase() ?? "",
          userId: body.userId ?? "",
        },
        subscription_data: {
          metadata: {
            planId: plan.id,
            referralCode: body.referralCode?.toUpperCase() ?? "",
          },
        },
      });
      return json(
        {
          ok: true,
          mock: false,
          checkoutUrl: session.url,
          sessionId: session.id,
          planId: plan.id,
          interval,
          listPriceUsd: listPrice,
          ...priced,
        },
        200,
        req,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return json({ error: message, mockFallback: true }, 502, req);
    }
  }

  // Local / unset Stripe — mock checkout so pricing UX still works
  const mockId = `cs_test_mock_${plan.id}_${Date.now()}`;
  return json(
    {
      ok: true,
      mock: true,
      checkoutUrl: `${successUrl}${successUrl.includes("?") ? "&" : "?"}session_id=${mockId}`,
      sessionId: mockId,
      planId: plan.id,
      interval,
      listPriceUsd: listPrice,
      ...priced,
      message:
        "Stripe keys not configured — mock checkout. Set STRIPE_SECRET_KEY + price IDs for live billing.",
      referrerHint: body.userId
        ? generateReferralCode(body.userId)
        : generateReferralCode("anonymous"),
    },
    200,
    req,
  );
};

export const config: Config = {
  path: "/api/billing/checkout",
  method: ["POST", "OPTIONS"],
};

declare const Netlify: { env: { get(key: string): string | undefined } } | undefined;
