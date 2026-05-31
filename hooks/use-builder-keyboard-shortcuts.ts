"use client"

import * as React from "react"

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

interface UseBuilderKeyboardShortcutsOptions {
  onRunQuery: () => void
  onOpenShortcuts: () => void
  canRunQuery: boolean
}

export function useBuilderKeyboardShortcuts({
  onRunQuery,
  onOpenShortcuts,
  canRunQuery,
}: UseBuilderKeyboardShortcutsOptions) {
  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) return

      if (
        event.key === "?" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        event.preventDefault()
        onOpenShortcuts()
        return
      }

      if (isTypingTarget(event.target)) return

      const modifier = event.metaKey || event.ctrlKey
      if (!modifier) return

      if (event.key === "Enter" && canRunQuery) {
        event.preventDefault()
        onRunQuery()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [canRunQuery, onOpenShortcuts, onRunQuery])
}
