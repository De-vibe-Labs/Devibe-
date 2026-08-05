import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SiteNav, Icon } from "../components/SiteNav";
import { useAuth } from "../auth/AuthProvider";
import { apiGet, apiSend } from "../lib/api";

interface Plan {
  id: string;
  name: string;
  tagline: string;
  priceMonthlyUsd: number;
  priceYearlyUsd: number;
  features: string[];
  highlighted?: boolean;
  referralEligible: boolean;
  contactSales?: boolean;
}

export function PricingPage() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [referral, setReferral] = useState<{
    code: string;
    shareUrl: string;
    program: { refereeDiscountPercent: number; referrerCreditPercent: number };
  } | null>(null);
  const [refInput, setRefInput] = useState(params.get("ref") ?? "");
  const [interval, setInterval] = useState<"month" | "year">("month");
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const checkout = params.get("checkout");

  useEffect(() => {
    void (async () => {
      try {
        const data = await apiGet<{
          plans: Plan[];
          referral: { refereeDiscountPercent: number; referrerCreditPercent: number };
        }>("/api/billing/plans");
        setPlans(data.plans);
      } catch (err) {
        setMessage(err instanceof Error ? err.message : String(err));
      }
    })();
  }, []);

  useEffect(() => {
    void (async () => {
      const q = user?.id ? `?userId=${encodeURIComponent(user.id)}` : "";
      try {
        const data = await apiGet<{
          code: string;
          shareUrl: string;
          program: { refereeDiscountPercent: number; referrerCreditPercent: number };
        }>(`/api/billing/referral${q}`);
        setReferral(data);
      } catch {
        /* optional */
      }
    })();
  }, [user?.id]);

  useEffect(() => {
    if (checkout === "success") setMessage("Checkout complete — welcome aboard.");
    if (checkout === "cancel") setMessage("Checkout canceled.");
  }, [checkout]);

  const banner = useMemo(() => {
    if (!referral) return null;
    return `Refer friends: they save ${referral.program.refereeDiscountPercent}% · you earn ${referral.program.referrerCreditPercent}% credit.`;
  }, [referral]);

  async function startCheckout(planId: string) {
    setBusy(planId);
    setMessage(null);
    try {
      const data = await apiSend<{
        checkoutUrl?: string;
        contactSales?: boolean;
        message?: string;
        mock?: boolean;
        discountUsd?: number;
      }>("/api/billing/checkout", "POST", {
        planId,
        interval,
        referralCode: refInput || undefined,
        customerEmail: user?.email,
        userId: user?.id,
      });
      if (data.contactSales) {
        setMessage(data.message ?? "Contact sales for Enterprise.");
        return;
      }
      if (data.checkoutUrl) {
        if (data.mock) {
          setMessage(
            `Mock checkout${data.discountUsd ? ` (−$${data.discountUsd} referral)` : ""}. Redirecting…`,
          );
        }
        window.location.href = data.checkoutUrl;
        return;
      }
      setMessage(data.message ?? "No checkout URL returned.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-text-subtle">Pricing</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Simple plans. Referral rewards.</h1>
        <p className="mt-2 max-w-2xl text-sm text-text-muted">
          Stripe-powered subscriptions for Monaco Cloud. Share your referral code — friends get a
          discount, you earn account credit.
        </p>

        {banner ? <p className="mt-4 text-sm text-primary">{banner}</p> : null}
        {message ? (
          <p className="mt-3 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-muted">
            {message}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg border border-border p-1 text-xs">
            <button
              type="button"
              className={`rounded-md px-3 py-1.5 ${interval === "month" ? "bg-primary-soft text-primary" : "text-text-muted"}`}
              onClick={() => setInterval("month")}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`rounded-md px-3 py-1.5 ${interval === "year" ? "bg-primary-soft text-primary" : "text-text-muted"}`}
              onClick={() => setInterval("year")}
            >
              Yearly
            </button>
          </div>
          <input
            className="dv-input max-w-[200px] text-sm"
            placeholder="Referral code"
            value={refInput}
            onChange={(e) => setRefInput(e.target.value.toUpperCase())}
          />
          {referral ? (
            <button
              type="button"
              className="dv-btn-secondary px-3 py-2 text-xs"
              onClick={() => {
                void navigator.clipboard?.writeText(referral.shareUrl);
                setMessage(`Copied share link · code ${referral.code}`);
              }}
            >
              <Icon name="share" className="text-sm" /> Share {referral.code}
            </button>
          ) : null}
          {!user ? (
            <Link
              to="/login"
              state={{ from: "/pricing" }}
              className="text-xs text-primary hover:underline"
            >
              Sign in to track referrals
            </Link>
          ) : null}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => {
            const price =
              plan.id === "enterprise"
                ? "Custom"
                : interval === "year"
                  ? `$${plan.priceYearlyUsd}/yr`
                  : `$${plan.priceMonthlyUsd}/mo`;
            return (
              <article
                key={plan.id}
                className={`dv-card flex flex-col p-5 ${plan.highlighted ? "border-primary/50 shadow-[0_0_0_1px_rgba(124,58,237,0.35)]" : ""}`}
              >
                <h2 className="text-lg font-semibold">{plan.name}</h2>
                <p className="mt-1 text-xs text-text-subtle">{plan.tagline}</p>
                <p className="mt-4 text-2xl font-semibold">{price}</p>
                <ul className="mt-4 flex-1 space-y-2 text-xs text-text-muted">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Icon name="check" className="text-sm text-success" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  disabled={busy === plan.id || plan.id === "free"}
                  className={`mt-5 w-full py-2.5 text-sm ${
                    plan.highlighted ? "dv-btn-primary" : "dv-btn-secondary"
                  } disabled:opacity-40`}
                  onClick={() => void startCheckout(plan.id)}
                >
                  {plan.id === "free"
                    ? "Current starter"
                    : plan.contactSales
                      ? "Contact sales"
                      : busy === plan.id
                        ? "Starting…"
                        : "Choose plan"}
                </button>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
