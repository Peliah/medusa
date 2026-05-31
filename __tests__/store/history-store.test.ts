import { beforeEach, describe, expect, it } from "vitest"

import { countRules } from "@/lib/query-engine/tree-utils"
import { buildRootWithRules } from "@/__tests__/utils/builders"
import { resetAllStores } from "@/__tests__/utils/store"
import { useHistoryStore } from "@/store/history-store"
import { useQueryStore } from "@/store/query-store"

describe("history-store", () => {
  beforeEach(() => {
    resetAllStores()
  })

  it("records query runs with labels", () => {
    const tree = buildRootWithRules([
      { field: "status", operator: "eq", value: "active" },
    ])

    useHistoryStore.getState().recordRun("agents", tree)

    const { history } = useHistoryStore.getState()
    expect(history).toHaveLength(1)
    expect(history[0]?.label).toBe("Agents · 1 rule")
    expect(history[0]?.schemaId).toBe("agents")
  })

  it("restores history entries into the query store", () => {
    const tree = buildRootWithRules([
      { field: "codename", operator: "eq", value: "Echo" },
    ])

    useHistoryStore.getState().recordRun("agents", tree)
    useQueryStore.getState().clearTree()

    const entryId = useHistoryStore.getState().history[0]?.id
    useHistoryStore.getState().restoreHistory(entryId!)

    expect(countRules(useQueryStore.getState().tree)).toBe(1)
    expect(useQueryStore.getState().schemaId).toBe("agents")
  })

  it("clears history", () => {
    const tree = buildRootWithRules([
      { field: "status", operator: "eq", value: "active" },
    ])
    useHistoryStore.getState().recordRun("agents", tree)
    useHistoryStore.getState().clearHistory()

    expect(useHistoryStore.getState().history).toHaveLength(0)
  })

  it("saves, loads, and deletes presets", () => {
    const tree = buildRootWithRules([
      { field: "status", operator: "eq", value: "active" },
    ])

    const saved = useHistoryStore
      .getState()
      .savePreset("  Active agents  ", "agents", tree)
    expect(saved).toBe(true)
    expect(useHistoryStore.getState().presets[0]?.name).toBe("Active agents")

    useQueryStore.getState().clearTree()
    const presetId = useHistoryStore.getState().presets[0]?.id
    useHistoryStore.getState().loadPreset(presetId!)

    expect(countRules(useQueryStore.getState().tree)).toBe(1)

    useHistoryStore.getState().deletePreset(presetId!)
    expect(useHistoryStore.getState().presets).toHaveLength(0)
  })

  it("rejects empty preset names", () => {
    const tree = buildRootWithRules([
      { field: "status", operator: "eq", value: "active" },
    ])

    expect(useHistoryStore.getState().savePreset("   ", "agents", tree)).toBe(
      false
    )
    expect(useHistoryStore.getState().presets).toHaveLength(0)
  })
})
