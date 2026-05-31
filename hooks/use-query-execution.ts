"use client"

import { useExecutionStore } from "@/store/execution-store"

export function useQueryExecution() {
  const status = useExecutionStore((state) => state.status)
  const matches = useExecutionStore((state) => state.matches)
  const lastRunAt = useExecutionStore((state) => state.lastRunAt)
  const execute = useExecutionStore((state) => state.execute)
  const reset = useExecutionStore((state) => state.reset)

  return {
    status,
    matches,
    matchCount: matches.length,
    lastRunAt,
    isLoading: status === "loading",
    isIdle: status === "idle",
    hasResults: status === "success",
    execute,
    reset,
  }
}
