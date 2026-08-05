import { describe, expect, it } from "vitest";
import {
  applyReferralDiscount,
  generateReferralCode,
  getPlan,
  PRICING_PLANS,
  validateReferralCodeFormat,
} from "./billing.ts";

describe("billing plans", () => {
  it("includes free and pro", () => {
    expect(getPlan("free")?.priceMonthlyUsd).toBe(0);
    expect(getPlan("pro")?.highlighted).toBe(true);
    expect(PRICING_PLANS.length).toBeGreaterThanOrEqual(3);
  });
});

describe("referral model", () => {
  it("generates MC codes", () => {
    const code = generateReferralCode("user-123");
    expect(validateReferralCodeFormat(code)).toBe(true);
  });

  it("applies referee discount", () => {
    const code = generateReferralCode("referrer");
    const result = applyReferralDiscount(29, code);
    expect(result.referralApplied).toBe(true);
    expect(result.discountUsd).toBeGreaterThan(0);
    expect(result.amountUsd).toBeLessThan(29);
  });
});
