/** Pricing plans + referral model for Monaco Cloud / DeVibe. */

export type BillingInterval = "month" | "year";

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  priceMonthlyUsd: number;
  priceYearlyUsd: number;
  /** Stripe Price IDs (optional — mock checkout when missing) */
  stripePriceMonthly?: string;
  stripePriceYearly?: string;
  features: string[];
  highlighted?: boolean;
  referralEligible: boolean;
}

export interface ReferralProgram {
  /** Referrer earns this % of first paid invoice as account credit */
  referrerCreditPercent: number;
  /** Referee gets this % off first invoice */
  refereeDiscountPercent: number;
  /** Max discount USD on first invoice */
  maxDiscountUsd: number;
  /** Code prefix for generated referrals */
  codePrefix: string;
}

export const REFERRAL_PROGRAM: ReferralProgram = {
  referrerCreditPercent: 20,
  refereeDiscountPercent: 20,
  maxDiscountUsd: 40,
  codePrefix: "MC",
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Explore Monaco Cloud",
    priceMonthlyUsd: 0,
    priceYearlyUsd: 0,
    features: [
      "AI Builder chat (rate limited)",
      "Local / preview deploys",
      "1 workspace",
      "Community MCP plugins",
    ],
    referralEligible: false,
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For indie builders",
    priceMonthlyUsd: 29,
    priceYearlyUsd: 290,
    stripePriceMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    stripePriceYearly: process.env.STRIPE_PRICE_PRO_YEARLY,
    features: [
      "Claude + Codex codegen",
      "Desktop + mobile dual preview",
      "Firebase auth + GitHub connect",
      "Unlimited workspaces (personal)",
      "MCP Marketplace installs",
      "Referral rewards",
    ],
    highlighted: true,
    referralEligible: true,
  },
  {
    id: "team",
    name: "Team",
    tagline: "For product squads",
    priceMonthlyUsd: 99,
    priceYearlyUsd: 990,
    stripePriceMonthly: process.env.STRIPE_PRICE_TEAM_MONTHLY,
    stripePriceYearly: process.env.STRIPE_PRICE_TEAM_YEARLY,
    features: [
      "Everything in Pro",
      "Shared team workspaces",
      "RBAC + security center",
      "Priority agent queue",
      "Stripe billing seats",
      "Referral team pool",
    ],
    referralEligible: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Scale anywhere",
    priceMonthlyUsd: 0,
    priceYearlyUsd: 0,
    features: [
      "Custom MCS adapters",
      "SSO / passkeys / hardware keys",
      "Dedicated support",
      "Custom referral terms",
      "SLA + audit exports",
    ],
    referralEligible: false,
  },
];

export function getPlan(id: string): PricingPlan | undefined {
  return PRICING_PLANS.find((p) => p.id === id);
}

export function generateReferralCode(userId: string): string {
  const hash = [...userId].reduce((acc, ch) => (acc * 33 + ch.charCodeAt(0)) >>> 0, 5381);
  return `${REFERRAL_PROGRAM.codePrefix}${hash.toString(36).toUpperCase().slice(0, 8)}`;
}

export function validateReferralCodeFormat(code: string): boolean {
  return /^MC[A-Z0-9]{4,12}$/i.test(code.trim());
}

export function applyReferralDiscount(
  amountUsd: number,
  referralCode?: string | null,
): { amountUsd: number; discountUsd: number; referralApplied: boolean } {
  if (!referralCode || !validateReferralCodeFormat(referralCode)) {
    return { amountUsd, discountUsd: 0, referralApplied: false };
  }
  const raw = (amountUsd * REFERRAL_PROGRAM.refereeDiscountPercent) / 100;
  const discountUsd = Math.min(raw, REFERRAL_PROGRAM.maxDiscountUsd);
  return {
    amountUsd: Math.max(0, Number((amountUsd - discountUsd).toFixed(2))),
    discountUsd: Number(discountUsd.toFixed(2)),
    referralApplied: true,
  };
}
