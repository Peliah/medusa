import { describe, expect, it } from "vitest"

import {
  countGroups,
  countRules,
  findCondition,
  findGroup,
  findParentGroup,
  getMaxDepth,
  isGroup,
  isRule,
} from "@/lib/query-engine/tree-utils"
import {
  buildGroup,
  buildNestedTree,
  buildRootWithRules,
  buildRule,
} from "@/__tests__/utils/builders"

describe("tree-utils", () => {
  const tree = buildNestedTree()

  it("identifies rule and group nodes", () => {
    const rule = buildRule()
    const group = buildGroup()

    expect(isRule(rule)).toBe(true)
    expect(isGroup(rule)).toBe(false)
    expect(isGroup(group)).toBe(true)
    expect(isRule(group)).toBe(false)
  })

  it("counts rules and groups recursively", () => {
    expect(countRules(tree)).toBe(2)
    expect(countGroups(tree)).toBe(1)
  })

  it("calculates max nesting depth", () => {
    expect(getMaxDepth(tree)).toBe(1)
    expect(
      getMaxDepth(
        buildRootWithRules([
          { field: "status", operator: "eq", value: "active" },
        ])
      )
    ).toBe(0)
  })

  it("finds groups by id", () => {
    const inner = tree.conditions[1]
    expect(isGroup(inner)).toBe(true)
    if (!isGroup(inner)) return

    expect(findGroup(tree, inner.id)?.id).toBe(inner.id)
    expect(findGroup(tree, "missing")).toBeNull()
  })

  it("finds conditions by id", () => {
    const rule = tree.conditions[0]
    expect(findCondition(tree, rule.id)?.id).toBe(rule.id)
    expect(findCondition(tree, tree.id)?.id).toBe(tree.id)
  })

  it("finds parent group for nested conditions", () => {
    const inner = tree.conditions[1]
    if (!isGroup(inner)) return

    const nestedRule = inner.conditions[0]
    expect(findParentGroup(tree, nestedRule.id)?.id).toBe(inner.id)
    expect(findParentGroup(tree, tree.conditions[0].id)?.id).toBe(tree.id)
  })
})
