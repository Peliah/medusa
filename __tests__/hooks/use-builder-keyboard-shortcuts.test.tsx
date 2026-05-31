import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { buildRootWithRules } from "@/__tests__/utils/builders"
import { resetAllStores } from "@/__tests__/utils/store"
import { useBuilderKeyboardShortcuts } from "@/hooks/use-builder-keyboard-shortcuts"
import { isTreeRunnable } from "@/lib/query-engine/validator"
import { getSchema } from "@/lib/schemas"
import { useQueryStore } from "@/store/query-store"
import { useUIStore } from "@/store/ui-store"

describe("useBuilderKeyboardShortcuts", () => {
  const onRunQuery = vi.fn()
  const onOpenShortcuts = vi.fn()

  beforeEach(() => {
    resetAllStores()
    onRunQuery.mockClear()
    onOpenShortcuts.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function mount(canRunQuery = true) {
    renderHook(() =>
      useBuilderKeyboardShortcuts({
        onRunQuery,
        onOpenShortcuts,
        canRunQuery,
      })
    )
  }

  it("runs query on Ctrl+Enter when valid", () => {
    const tree = buildRootWithRules([
      { field: "status", operator: "eq", value: "active" },
    ])
    useQueryStore.setState({ tree, rootId: tree.id, past: [], future: [] })

    mount(isTreeRunnable(tree, getSchema("agents")))

    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", ctrlKey: true })
    )

    expect(onRunQuery).toHaveBeenCalledTimes(1)
  })

  it("opens shortcuts modal on ?", () => {
    mount(false)

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "?" }))

    expect(onOpenShortcuts).toHaveBeenCalledTimes(1)
  })

  it("undoes tree edits on Ctrl+Z", () => {
    mount(false)

    act(() => {
      useQueryStore.getState().addRule(useQueryStore.getState().rootId)
    })

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "z", ctrlKey: true })
      )
    })

    expect(useQueryStore.getState().tree.conditions).toHaveLength(0)
  })

  it("duplicates a focused rule on Ctrl+D", () => {
    mount(false)

    act(() => {
      const tree = buildRootWithRules([
        { field: "status", operator: "eq", value: "active" },
      ])
      useQueryStore.setState({ tree, rootId: tree.id, past: [], future: [] })
      useUIStore.getState().setFocusedConditionId(tree.conditions[0]!.id)
    })

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "d", ctrlKey: true })
      )
    })

    expect(useQueryStore.getState().tree.conditions).toHaveLength(2)
  })
})
