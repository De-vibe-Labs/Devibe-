import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/** Resets scroll position on navigation, matching the behaviour of a document request. */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
