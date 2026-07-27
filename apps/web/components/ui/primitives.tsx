import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ Button */

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "contrast"
type ButtonSize = "sm" | "md" | "lg"

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 focus-visible:ring-primary",
  secondary: "bg-surface-3 text-foreground border border-border hover:bg-surface-3/70 hover:border-border-strong",
  ghost: "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
  outline: "border border-border text-foreground hover:border-border-strong hover:bg-surface-2",
  contrast: "bg-foreground text-deep hover:bg-foreground/85",
}

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-xs",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-12 gap-2 px-6 text-base",
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({ className, variant = "primary", size = "md", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg font-medium whitespace-nowrap transition-all",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------- Card */

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-border bg-card", className)} {...props} />
}

export function GlassCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass rounded-2xl", className)} {...props} />
}

/* ------------------------------------------------------------------- Badge */

type BadgeTone = "neutral" | "primary" | "accent" | "success" | "warning" | "danger"

const badgeTones: Record<BadgeTone, string> = {
  neutral: "border-border bg-surface-2 text-muted-foreground",
  primary: "border-primary/40 bg-primary/15 text-primary-soft",
  accent: "border-accent/40 bg-accent/10 text-accent",
  success: "border-success/40 bg-success/10 text-success",
  warning: "border-warning/40 bg-warning/10 text-warning",
  danger: "border-danger/40 bg-danger/10 text-danger",
}

export function Badge({
  tone = "neutral",
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        badgeTones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

/* -------------------------------------------------------------- StatusDot */

type StatusTone = "success" | "warning" | "danger" | "primary" | "accent" | "idle"

const dotTones: Record<StatusTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  primary: "bg-primary",
  accent: "bg-accent",
  idle: "bg-muted-foreground",
}

export function StatusDot({
  tone = "success",
  pulse = false,
  className,
}: {
  tone?: StatusTone
  pulse?: boolean
  className?: string
}) {
  return (
    <span aria-hidden="true" className={cn("relative inline-flex size-2 shrink-0", className)}>
      {pulse ? <span className={cn("absolute inset-0 animate-ping rounded-full opacity-60", dotTones[tone])} /> : null}
      <span className={cn("relative size-2 rounded-full", dotTones[tone])} />
    </span>
  )
}

/* ------------------------------------------------------------------- Meter */

export function Meter({
  value,
  tone = "accent",
  label,
  className,
}: {
  value: number
  tone?: StatusTone
  label?: string
  className?: string
}) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      role="meter"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-3", className)}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-700", dotTones[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

/* --------------------------------------------------------------- SectionEyebrow */

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-xs tracking-[0.22em] text-muted-foreground uppercase", className)}>{children}</p>
  )
}
