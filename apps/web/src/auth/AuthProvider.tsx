import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AuthError,
  getAuthSettings,
  getUser,
  handleAuthCallback,
  login as authLogin,
  logout as authLogout,
  oauthLogin as authOauthLogin,
  onAuthChange,
  signup as authSignup,
  type AuthProviderId,
  type AuthSettings,
  type AuthUser,
} from "@devibe/auth";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  settings: AuthSettings | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  oauthLogin: (provider: AuthProviderId) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<AuthSettings | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const unsub = onAuthChange((_event, next) => {
      if (!cancelled) setUser(next);
    });

    void (async () => {
      try {
        await handleAuthCallback();
        const [u, s] = await Promise.all([getUser(), getAuthSettings()]);
        if (!cancelled) {
          setUser(u);
          setSettings(s);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof AuthError ? err.message : String(err));
          const s = await getAuthSettings().catch(() => null);
          setSettings(s);
          setUser(await getUser().catch(() => null));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      setUser(await authLogin(email, password));
    } catch (err) {
      const message = err instanceof AuthError ? err.message : String(err);
      setError(message);
      throw err;
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name?: string) => {
    setError(null);
    try {
      setUser(await authSignup(email, password, name));
    } catch (err) {
      const message = err instanceof AuthError ? err.message : String(err);
      setError(message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await authLogout();
    setUser(null);
  }, []);

  const oauthLogin = useCallback(async (provider: AuthProviderId) => {
    setError(null);
    try {
      const result = await authOauthLogin(provider);
      if (result) setUser(result);
    } catch (err) {
      const message = err instanceof AuthError ? err.message : String(err);
      setError(message);
      throw err;
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      settings,
      error,
      login,
      signup,
      logout,
      oauthLogin,
      clearError: () => setError(null),
    }),
    [user, loading, settings, error, login, signup, logout, oauthLogin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
