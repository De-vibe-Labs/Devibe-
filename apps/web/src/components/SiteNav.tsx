import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/workspace", label: "Workspace" },
  { to: "/orchestration", label: "Orchestration" },
  { to: "/fleet", label: "Fleet" },
];

export function SiteNav() {
  return (
    <nav className="fixed top-0 z-40 flex h-16 w-full items-center justify-between border-b border-outline-variant/60 bg-surface-container-low/85 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-8">
        <NavLink to="/" className="font-display text-lg font-bold tracking-tight text-primary">
          De Vibe
        </NavLink>
        <div className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  isActive ? "text-primary" : "text-on-surface-variant hover:text-primary"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <NavLink
          to="/workspace"
          className="rounded-lg px-4 py-2 text-sm text-on-surface transition hover:bg-surface-container-high"
        >
          Open builder
        </NavLink>
        <NavLink
          to="/workspace"
          className="rounded-lg bg-primary-container px-5 py-2 text-sm font-bold text-on-primary-container shadow-lg shadow-primary-container/25 transition hover:scale-[0.98]"
        >
          Start free
        </NavLink>
      </div>
    </nav>
  );
}

export function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}
