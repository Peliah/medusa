import { describe, expect, it } from "vitest"

import {
  createGroup,
  createRule,
  createRootGroup,
} from "@/lib/query-engine/factory"
import {
  buildGroup,
  buildRootWithRules,
  buildRule,
} from "@/__tests__/utils/builders"

describe("factory", () => {
  it("creates rules with null field, operator, and value", () => {
    const rule = createRule()
    expect(rule.type).toBe("rule")
    expect(rule.id).toBeTruthy()
    expect(rule.field).toBeNull()
    expect(rule.operator).toBeNull()
    expect(rule.value).toBeNull()
  })

  it("creates groups with default AND logic", () => {
    const group = createGroup()
    expect(group.type).toBe("group")
    expect(group.logic).toBe("AND")
    expect(group.conditions).toEqual([])
    expect(group.collapsed).toBe(false)
  })

  it("creates root group", () => {
    const root = createRootGroup()
    expect(root.type).toBe("group")
    expect(root.conditions).toEqual([])
  })
})

describe("buildRule helper", () => {
  it("merges overrides onto a new rule", () => {
    const rule = buildRule({
      field: "codename",
      operator: "eq",
      value: "Viper",
    })

    expect(rule.field).toBe("codename")
    expect(rule.operator).toBe("eq")
    expect(rule.value).toBe("Viper")
  })
})

describe("buildRootWithRules helper", () => {
  it("builds a root group with multiple rules", () => {
    const tree = buildRootWithRules([
      { field: "status", operator: "eq", value: "active" },
      { field: "compromised", operator: "eq", value: false },
    ])

    expect(tree.conditions).toHaveLength(2)
    expect(tree.logic).toBe("AND")
  })
})

describe("buildGroup helper", () => {
  it("builds nested groups", () => {
    const inner = buildGroup([
      buildRule({ field: "status", operator: "eq", value: "active" }),
    ])
    const outer = buildGroup([inner], { logic: "OR" })

    expect(outer.logic).toBe("OR")
    expect(outer.conditions[0].type).toBe("group")
  })
})
