import type { Config, Context } from "@netlify/functions";
import { PRICING_PLANS, REFERRAL_PROGRAM } from "./_shared/billing.js";
import { json, optionsResponse } from "./_shared/http.js";

export default async (req: Request, _context: Context) => {
  if (req.method === "OPTIONS") return optionsResponse(req);
  if (req.method !== "GET") return json({ error: "Method not allowed" }, 405, req);

  return json(
    {
      currency: "usd",
      referral: REFERRAL_PROGRAM,
      plans: PRICING_PLANS.map((p) => ({
        id: p.id,
        name: p.name,
        tagline: p.tagline,
        priceMonthlyUsd: p.priceMonthlyUsd,
        priceYearlyUsd: p.priceYearlyUsd,
        features: p.features,
        highlighted: Boolean(p.highlighted),
        referralEligible: p.referralEligible,
        contactSales: p.id === "enterprise",
      })),
      stripeConfigured: Boolean(
        process.env.STRIPE_SECRET_KEY ||
          (typeof Netlify !== "undefined" ? Netlify.env.get("STRIPE_SECRET_KEY") : undefined),
      ),
    },
    200,
    req,
  );
};

export const config: Config = {
  path: "/api/billing/plans",
  method: ["GET", "OPTIONS"],
};

declare const Netlify: { env: { get(key: string): string | undefined } } | undefined;
