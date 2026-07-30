import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "../components/SiteNav";
import { useAuth } from "../auth/AuthProvider";
import type { AuthProviderId } from "@devibe/auth";

type AuthView = "login" | "signup" | "oauth" | "welcome";

export function AuthPage({ initial = "login" }: { initial?: AuthView }) {
  const [view, setView] = useState<AuthView>(initial);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, signup, oauthLogin, error, settings, clearError } = useAuth();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  useEffect(() => {
    if (user && view !== "welcome" && view !== "oauth") {
      setView("welcome");
    }
  }, [user, view]);

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFormError(null);
    clearError();
    try {
      await login(email, password);
      setView("welcome");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function onSignup(e: FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setFormError("Passwords do not match.");
      return;
    }
    setBusy(true);
    setFormError(null);
    clearError();
    try {
      await signup(email, password, name);
      setView("welcome");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function onOAuth(provider: AuthProviderId) {
    setBusy(true);
    setFormError(null);
    clearError();
    try {
      await oauthLogin(provider);
      setView("oauth");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  const displayError = formError || error;
  const identityNote = settings && !settings.identityAvailable
    ? "Local demo auth (Netlify Identity activates after deploy)."
    : null;

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
                  onClick={() => {
                    setView("signup");
                    setFormError(null);
                  }}
                >
                  Sign up
                </button>
              </>
            }
            onOAuth={onOAuth}
            busy={busy}
            error={displayError}
            note={identityNote}
          >
            <form className="space-y-3" onSubmit={onLogin}>
              <Field
                label="Email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={setEmail}
              />
              <Field
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={setPassword}
              />
              <button
                type="submit"
                disabled={busy}
                className="dv-btn-primary mt-2 w-full py-2.5 text-sm disabled:opacity-50"
              >
                {busy ? "Signing in…" : "Continue"}
              </button>
            </form>
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
                  onClick={() => {
                    setView("login");
                    setFormError(null);
                  }}
                >
                  Sign in
                </button>
              </>
            }
            onOAuth={onOAuth}
            busy={busy}
            error={displayError}
            note={identityNote}
          >
            <form className="space-y-3" onSubmit={onSignup}>
              <Field label="Name" type="text" autoComplete="name" value={name} onChange={setName} />
              <Field
                label="Email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={setEmail}
              />
              <Field
                label="Password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={setPassword}
              />
              <Field
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={setConfirm}
              />
              <label className="flex items-start gap-2 text-xs text-text-muted">
                <input type="checkbox" className="mt-0.5 accent-primary" required />
                I agree to the Terms and Privacy Policy
              </label>
              <button
                type="submit"
                disabled={busy || settings?.disableSignup}
                className="dv-btn-primary mt-2 w-full py-2.5 text-sm disabled:opacity-50"
              >
                {busy ? "Creating…" : "Create account"}
              </button>
            </form>
          </AuthCard>
        ) : null}

        {view === "oauth" ? (
          <div className="dv-card space-y-5 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
              <Icon name="check_circle" />
            </div>
            <h1 className="text-xl font-semibold">Connected</h1>
            <p className="text-sm text-text-muted">
              {user?.email ?? "OAuth"} ready for agent lifecycle management.
            </p>
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
              {user ? `Welcome, ${user.name ?? user.email}` : "Your first project is one prompt away"}
            </h1>
            <p className="text-center text-sm text-text-muted">
              Use Claude or Codex in AI Builder, or compose an MCP server with the Cloud plugin.
            </p>
            <div className="grid gap-2">
              <button
                type="button"
                className="dv-btn-primary w-full py-2.5 text-sm"
                onClick={() => navigate(from.startsWith("/") ? from : "/")}
              >
                Open AI Builder
              </button>
              <button
                type="button"
                className="dv-btn-secondary w-full py-2.5 text-sm"
                onClick={() => navigate("/mcp")}
              >
                MCP Server Builder
              </button>
            </div>
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
  busy,
  error,
  note,
}: {
  title: string;
  children: ReactNode;
  footer: ReactNode;
  onOAuth: (provider: AuthProviderId) => void;
  busy: boolean;
  error: string | null;
  note: string | null;
}) {
  return (
    <div className="dv-card p-6">
      <h1 className="mb-5 text-center text-xl font-semibold tracking-tight">{title}</h1>
      {note ? <p className="mb-3 text-center text-[11px] text-text-subtle">{note}</p> : null}
      {error ? (
        <p className="mb-3 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">
          {error}
        </p>
      ) : null}
      {children}
      <div className="my-4 flex items-center gap-3 text-[11px] text-text-subtle">
        <div className="h-px flex-1 bg-border" />
        or
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="space-y-2">
        <button
          type="button"
          disabled={busy}
          className="dv-btn-secondary w-full py-2.5 text-sm disabled:opacity-50"
          onClick={() => onOAuth("github")}
        >
          <Icon name="code" className="text-base" />
          Continue with GitHub
        </button>
        <button
          type="button"
          disabled={busy}
          className="dv-btn-secondary w-full py-2.5 text-sm disabled:opacity-50"
          onClick={() => onOAuth("google")}
        >
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
  value,
  onChange,
}: {
  label: string;
  type: string;
  autoComplete?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs text-text-muted">{label}</span>
      <input
        className="dv-input"
        type={type}
        autoComplete={autoComplete}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
