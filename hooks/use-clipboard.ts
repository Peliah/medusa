"use client"

import * as React from "react"

export function useClipboard(resetMs = 1500) {
  const [copied, setCopied] = React.useState(false)
  const timeoutRef = React.useRef<number | null>(null)

  const copy = React.useCallback(
    async (text: string) => {
      if (!text) return false

      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)

        if (timeoutRef.current !== null) {
          window.clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = window.setTimeout(() => {
          setCopied(false)
          timeoutRef.current = null
        }, resetMs)

        return true
      } catch {
        setCopied(false)
        return false
      }
    },
    [resetMs]
  )

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return { copied, copy }
}
