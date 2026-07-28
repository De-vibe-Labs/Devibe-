import { useEffect } from "react"

const SITE_NAME = "DeVibe"

/**
 * Replaces the Next.js `metadata` export: sets the document title and
 * description for the active route and restores them on unmount.
 */
export function useDocumentMeta(title: string, description?: string) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title === SITE_NAME ? title : `${title} · ${SITE_NAME}`

    const tag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previousDescription = tag?.content

    if (tag && description) {
      tag.content = description
    }

    return () => {
      document.title = previousTitle
      if (tag && previousDescription !== undefined) {
        tag.content = previousDescription
      }
    }
  }, [title, description])
}
