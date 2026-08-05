import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

const links = [
  { to: "/", label: "AI Agents", end: true },
  { to: "/workspace", label: "IDE" },
  { to: "/pricing", label: "Pricing" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/mcp", label: "MCP Builder" },
  { to: "/dashboard", label: "Cloud" },
  { to: "/security", label: "Security" },
  { to: "/home", label: "About" },
];

export function SiteNav() {
  const { user, logout, loading } = useAuth();

  return (
    <nav className="fixed top-0 z-40 flex h-14 w-full items-center justify-between border-b border-border bg-bg/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-8">
        <NavLink to="/" className="text-[15px] font-semibold tracking-tight text-text">
          Monaco Cloud
        </NavLink>
        <div className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  isActive ? "text-text" : "text-text-muted hover:text-text"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {!loading && user ? (
          <>
            <span className="hidden text-xs text-text-muted sm:inline">
              {user.name ?? user.email}
            </span>
            <button
              type="button"
              className="dv-btn-secondary px-3 py-1.5 text-sm"
              onClick={() => void logout()}
            >
              Sign out
            </button>
          </>
        ) : (
          <NavLink to="/login" className="dv-btn-secondary px-3 py-1.5 text-sm">
            Sign in
          </NavLink>
        )}
        <NavLink to="/" className="dv-btn-primary px-4 py-1.5 text-sm">
          Start building
        </NavLink>
      </div>
    </nav>
  );
}

export function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}
