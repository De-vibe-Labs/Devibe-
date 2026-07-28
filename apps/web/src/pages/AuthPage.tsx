import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "../components/SiteNav";

type AuthView = "login" | "signup" | "oauth" | "welcome";

export function AuthPage({ initial = "login" }: { initial?: AuthView }) {
  const [view, setView] = useState<AuthView>(initial);
  const navigate = useNavigate();

  return (
    <div className="orb-bg grain flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-[420px] animate-fade-up">
        <Link to="/" className="mb-8 block text-center text-lg font-semibold tracking-tight">
          DeVibe
        </Link>

        {view === "login" ? (
          <AuthCard
            title="Welcome back"
            footer={
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => setView("signup")}
                >
                  Sign up
                </button>
              </>
            }
            onOAuth={() => setView("oauth")}
            onSubmit={() => setView("welcome")}
          >
            <Field label="Email" type="email" autoComplete="email" />
            <Field label="Password" type="password" autoComplete="current-password" />
            <button type="submit" className="dv-btn-primary mt-2 w-full py-2.5 text-sm">
              Continue
            </button>
          </AuthCard>
        ) : null}

        {view === "signup" ? (
          <AuthCard
            title="Create your account"
            footer={
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => setView("login")}
                >
                  Sign in
                </button>
              </>
            }
            onOAuth={() => setView("oauth")}
            onSubmit={() => setView("welcome")}
          >
            <Field label="Name" type="text" autoComplete="name" />
            <Field label="Email" type="email" autoComplete="email" />
            <Field label="Password" type="password" autoComplete="new-password" />
            <Field label="Confirm password" type="password" autoComplete="new-password" />
            <label className="flex items-start gap-2 text-xs text-text-muted">
              <input type="checkbox" className="mt-0.5 accent-primary" required />
              I agree to the Terms and Privacy Policy
            </label>
            <button type="submit" className="dv-btn-primary mt-2 w-full py-2.5 text-sm">
              Create account
            </button>
          </AuthCard>
        ) : null}

        {view === "oauth" ? (
          <div className="dv-card space-y-5 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
              <Icon name="check_circle" />
            </div>
            <h1 className="text-xl font-semibold">GitHub connected</h1>
            <p className="text-sm text-text-muted">Cloud credentials ready for agent lifecycle management.</p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="dv-tag">github-connected</span>
              <span className="dv-tag">cloud-enabled</span>
              <span className="dv-tag">auto-scale</span>
            </div>
            <button
              type="button"
              className="dv-btn-primary w-full py-2.5 text-sm"
              onClick={() => setView("welcome")}
            >
              Continue to workspace
            </button>
          </div>
        ) : null}

        {view === "welcome" ? (
          <div className="dv-card space-y-5 p-6">
            <h1 className="text-center text-xl font-semibold">
              Your first project is one prompt away
            </h1>
            <textarea
              className="dv-input min-h-28"
              placeholder="Describe what you want to build…"
              defaultValue=""
            />
            <button
              type="button"
              className="dv-btn-primary w-full py-2.5 text-sm"
              onClick={() => navigate("/chat")}
            >
              Build with DeVibe
            </button>
          </div>
        ) : null}

        <p className="mt-6 text-center text-[11px] text-text-subtle">
          Secured with encrypted vault credentials. Agents never see raw cloud keys.
        </p>
      </div>
    </div>
  );
}

function AuthCard({
  title,
  children,
  footer,
  onOAuth,
  onSubmit,
}: {
  title: string;
  children: ReactNode;
  footer: ReactNode;
  onOAuth: () => void;
  onSubmit: () => void;
}) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <div className="dv-card p-6">
      <h1 className="mb-5 text-center text-xl font-semibold tracking-tight">{title}</h1>
      <form className="space-y-3" onSubmit={handleSubmit}>
        {children}
      </form>
      <div className="my-4 flex items-center gap-3 text-[11px] text-text-subtle">
        <div className="h-px flex-1 bg-border" />
        or
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="space-y-2">
        <button type="button" className="dv-btn-secondary w-full py-2.5 text-sm" onClick={onOAuth}>
          <Icon name="code" className="text-base" />
          Continue with GitHub
        </button>
        <button type="button" className="dv-btn-secondary w-full py-2.5 text-sm" onClick={onOAuth}>
          <Icon name="language" className="text-base" />
          Continue with Google
        </button>
      </div>
      <p className="mt-5 text-center text-xs text-text-muted">{footer}</p>
    </div>
  );
}

function Field({
  label,
  type,
  autoComplete,
}: {
  label: string;
  type: string;
  autoComplete?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs text-text-muted">{label}</span>
      <input className="dv-input" type={type} autoComplete={autoComplete} required />
    </label>
  );
}
