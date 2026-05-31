import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { buildRootWithRules } from "@/__tests__/utils/builders"
import { resetExecutionStore } from "@/__tests__/utils/store"
import { useExecutionStore } from "@/store/execution-store"

describe("execution-store", () => {
  beforeEach(() => {
    resetExecutionStore()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("executes queries after a loading delay", async () => {
    const tree = buildRootWithRules([
      { field: "status", operator: "eq", value: "active" },
    ])

    const promise = useExecutionStore.getState().execute("agents", tree)
    expect(useExecutionStore.getState().status).toBe("loading")

    await vi.advanceTimersByTimeAsync(600)
    await promise

    const state = useExecutionStore.getState()
    expect(state.status).toBe("success")
    expect(state.matches.length).toBeGreaterThan(0)
    expect(state.lastRunAt).not.toBeNull()
  })

  it("resets execution state", async () => {
    const tree = buildRootWithRules([
      { field: "status", operator: "eq", value: "active" },
    ])

    const promise = useExecutionStore.getState().execute("agents", tree)
    await vi.advanceTimersByTimeAsync(600)
    await promise

    useExecutionStore.getState().reset()

    expect(useExecutionStore.getState()).toMatchObject({
      status: "idle",
      matches: [],
      lastRunAt: null,
    })
  })
})
