import { beforeEach, describe, expect, it } from "vitest"

import {
  countRules,
  findGroup,
  isGroup,
  isRule,
} from "@/lib/query-engine/tree-utils"
import {
  buildGroup,
  buildRootWithRules,
  buildRule,
} from "@/__tests__/utils/builders"
import { resetQueryStore, resetUIStore } from "@/__tests__/utils/store"
import { useQueryStore } from "@/store/query-store"
import { useUIStore } from "@/store/ui-store"

describe("query-store", () => {
  beforeEach(() => {
    resetQueryStore()
    resetUIStore()
  })

  it("adds rules and groups to a parent group", () => {
    const { rootId, addRule, addGroup } = useQueryStore.getState()
    addRule(rootId)
    addGroup(rootId)

    const tree = useQueryStore.getState().tree
    expect(tree.conditions).toHaveLength(2)
    expect(isRule(tree.conditions[0])).toBe(true)
    expect(isGroup(tree.conditions[1])).toBe(true)
  })

  it("updates rules and resets operator when field changes", () => {
    const { rootId, addRule, updateRule } = useQueryStore.getState()
    addRule(rootId)

    const rule = useQueryStore.getState().tree.conditions[0]
    if (!isRule(rule)) throw new Error("expected rule")

    updateRule(rule.id, {
      field: "status",
      operator: "eq",
      value: "active",
    })

    updateRule(rule.id, { field: "codename" })

    const updated = useQueryStore.getState().tree.conditions[0]
    if (!isRule(updated)) throw new Error("expected rule")

    expect(updated.field).toBe("codename")
    expect(updated.operator).toBeNull()
    expect(updated.value).toBeNull()
  })

  it("removes nested conditions but protects the root group", () => {
    const { rootId, addGroup, addRule, removeCondition } =
      useQueryStore.getState()

    addGroup(rootId)
    const nestedId = useQueryStore.getState().tree.conditions[0]?.id
    if (!nestedId) throw new Error("expected nested group")

    addRule(nestedId)
    const ruleId = findGroup(useQueryStore.getState().tree, nestedId)
      ?.conditions[0]?.id
    if (!ruleId) throw new Error("expected nested rule")

    removeCondition(rootId)
    expect(useQueryStore.getState().tree.conditions).toHaveLength(1)

    useUIStore.getState().setFocusedConditionId(ruleId)
    removeCondition(ruleId)

    const nested = findGroup(useQueryStore.getState().tree, nestedId)
    expect(nested?.conditions).toHaveLength(0)
    expect(useUIStore.getState().focusedConditionId).toBeNull()
  })

  it("supports undo and redo", () => {
    const { rootId, addRule, undo, redo } = useQueryStore.getState()

    addRule(rootId)
    expect(countRules(useQueryStore.getState().tree)).toBe(1)

    undo()
    expect(countRules(useQueryStore.getState().tree)).toBe(0)

    redo()
    expect(countRules(useQueryStore.getState().tree)).toBe(1)
  })

  it("reorders conditions within a group", () => {
    const tree = buildRootWithRules([
      { field: "status", operator: "eq", value: "active" },
      { field: "codename", operator: "eq", value: "Viper" },
    ])
    useQueryStore.setState({ tree, rootId: tree.id, past: [], future: [] })

    const { reorderCondition } = useQueryStore.getState()
    reorderCondition(tree.id, 0, 1)

    const first = useQueryStore.getState().tree.conditions[0]
    expect(isRule(first) && first.field).toBe("codename")
  })

  it("moves conditions across groups", () => {
    const inner = buildGroup([
      buildRule({ field: "status", operator: "eq", value: "active" }),
    ])
    const tree = buildGroup([
      buildRule({ field: "codename", operator: "eq", value: "Viper" }),
      inner,
    ])

    useQueryStore.setState({ tree, rootId: tree.id, past: [], future: [] })

    const ruleToMove = tree.conditions[0]
    useQueryStore.getState().moveCondition(ruleToMove.id, inner.id, 0)

    const updatedInner = useQueryStore.getState().tree.conditions[0]
    if (!isGroup(updatedInner)) throw new Error("expected group")

    expect(updatedInner.conditions).toHaveLength(2)
    expect(useQueryStore.getState().tree.conditions).toHaveLength(1)
  })

  it("duplicates and wraps rules", () => {
    const { rootId, addRule, duplicateRule, wrapRuleInGroup } =
      useQueryStore.getState()
    addRule(rootId)

    const rule = useQueryStore.getState().tree.conditions[0]
    const duplicateId = duplicateRule(rule.id)
    expect(duplicateId).toBeTruthy()
    expect(useQueryStore.getState().tree.conditions).toHaveLength(2)

    const wrapId = wrapRuleInGroup(rule.id)
    expect(wrapId).toBeTruthy()
    expect(isGroup(useQueryStore.getState().tree.conditions[0])).toBe(true)
  })

  it("collapses groups and toggles collapse state", () => {
    const tree = buildRootWithRules([
      { field: "status", operator: "eq", value: "active" },
    ])
    useQueryStore.setState({ tree, rootId: tree.id, past: [], future: [] })

    useQueryStore.getState().collapseGroup(tree.id)
    expect(useQueryStore.getState().tree.collapsed).toBe(true)

    useQueryStore.getState().toggleGroupCollapse(tree.id)
    expect(useQueryStore.getState().tree.collapsed).toBe(false)
  })

  it("resets tree when schema changes or tree is cleared", () => {
    const { rootId, addRule, setSchema, clearTree } = useQueryStore.getState()

    addRule(rootId)
    setSchema("cities")

    expect(useQueryStore.getState().schemaId).toBe("cities")
    expect(countRules(useQueryStore.getState().tree)).toBe(0)
    expect(useQueryStore.getState().past).toHaveLength(0)

    addRule(useQueryStore.getState().rootId)
    clearTree()
    expect(countRules(useQueryStore.getState().tree)).toBe(0)
  })

  it("loads a saved query tree", () => {
    const saved = buildRootWithRules([
      { field: "status", operator: "eq", value: "inactive" },
    ])

    useQueryStore.getState().loadQuery("incidents", saved)

    expect(useQueryStore.getState().schemaId).toBe("incidents")
    expect(findGroup(useQueryStore.getState().tree, saved.id)).toBeTruthy()
    expect(countRules(useQueryStore.getState().tree)).toBe(1)
  })
})
