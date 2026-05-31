import * as React from "react"

const LG_BREAKPOINT = 1024
const BELOW_LG_QUERY = `(max-width: ${LG_BREAKPOINT - 1}px)`

function subscribe(onStoreChange: () => void) {
  const mql = window.matchMedia(BELOW_LG_QUERY)
  mql.addEventListener("change", onStoreChange)
  return () => mql.removeEventListener("change", onStoreChange)
}

function getSnapshot() {
  return window.matchMedia(BELOW_LG_QUERY).matches
}

function getServerSnapshot() {
  return false
}

export function useIsBelowLg() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
