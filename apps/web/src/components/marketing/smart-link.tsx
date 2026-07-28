import type { ReactNode } from "react"
import { Link } from "react-router-dom"

/**
 * Marketing pages mix in-page anchors (#features), real routes (/dashboard) and
 * placeholder links (#). Anchors and placeholders stay plain <a> so the browser
 * handles scrolling; everything else goes through the router.
 */
export function SmartLink({
  href,
  className,
  onClick,
  children,
}: {
  href: string
  className?: string
  onClick?: () => void
  children: ReactNode
}) {
  if (href.startsWith("#")) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    )
  }

  return (
    <Link to={href} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}
