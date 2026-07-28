import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/chat", label: "AI Builder" },
  { to: "/workspace", label: "IDE" },
  { to: "/cloud", label: "Cloud" },
  { to: "/design-prompts", label: "Figma Prompts" },
];

export function SiteNav() {
  return (
    <nav className="fixed top-0 z-40 flex h-14 w-full items-center justify-between border-b border-border bg-bg/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-8">
        <NavLink to="/" className="text-[15px] font-semibold tracking-tight text-text">
          DeVibe
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
        <NavLink to="/login" className="dv-btn-secondary px-3 py-1.5 text-sm">
          Sign in
        </NavLink>
        <NavLink to="/chat" className="dv-btn-primary px-4 py-1.5 text-sm">
          Start building
        </NavLink>
      </div>
    </nav>
  );
}

export function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}
