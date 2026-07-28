import { Link, NavLink } from "react-router-dom"
import {
  Bot,
  Code2,
  HelpCircle,
  Home,
  LayoutGrid,
  Rocket,
  Settings,
  Store,
  Workflow,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/projects", label: "Projects", icon: LayoutGrid },
  { href: "/orchestration", label: "Orchestration", icon: Workflow },
  { href: "/builder", label: "Agents", icon: Bot },
  { href: "/ide", label: "Code", icon: Code2 },
  { href: "/dashboard/deployments", label: "Deployments", icon: Rocket },
  { href: "/dashboard/marketplace", label: "Marketplace", icon: Store },
]

const footerNav = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/support", label: "Support", icon: HelpCircle },
]

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto border-r border-border bg-surface-1 p-4">
      <div className="shrink-0 px-2">
        <Link to="/" className="font-display text-lg font-bold tracking-tight">
          De<span className="text-primary-soft">Vibe</span>
        </Link>
        <p className="mt-0.5 text-xs text-muted-foreground">AI Cloud Orchestrator</p>
      </div>

      <nav aria-label="Primary" className="flex shrink-0 flex-col gap-1">
        {nav.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
              )
            }
          >
            <item.icon className="size-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="relative mt-auto shrink-0 overflow-hidden rounded-xl bg-primary p-4 text-primary-foreground">
        <Zap className="absolute -right-2 -bottom-3 size-16 opacity-20" aria-hidden="true" />
        <p className="relative text-sm font-semibold">Upgrade to Pro</p>
        <p className="relative mt-1 text-xs leading-relaxed opacity-90">
          Unlock multi-region orchestration and AI auto-scaling.
        </p>
      </div>

      <div className="flex shrink-0 flex-col gap-1 border-t border-border pt-3">
        {footerNav.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-surface-2 hover:text-foreground",
                isActive ? "text-foreground" : "text-muted-foreground",
              )
            }
          >
            <item.icon className="size-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  )
}
