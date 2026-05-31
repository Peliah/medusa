import { describe, expect, it } from "vitest"

import {
  calculateComplexity,
  getComplexityDotCount,
} from "@/lib/query-engine/complexity"
import { buildNestedTree, buildRootWithRules } from "@/__tests__/utils/builders"

describe("complexity", () => {
  it("returns empty label for trees with no rules", () => {
    const result = calculateComplexity(buildRootWithRules([]))
    expect(result.label).toBe("Empty")
    expect(result.level).toBe("low")
    expect(getComplexityDotCount(result.score, 0)).toBe(0)
  })

  it("scores rules, groups, and depth", () => {
    const tree = buildNestedTree()
    const result = calculateComplexity(tree)

    // 2 rules + 1 group*2 + depth 1*3 = 7
    expect(result.score).toBe(7)
    expect(result.level).toBe("medium")
    expect(result.label).toBe("Moderate")
    expect(getComplexityDotCount(result.score, 2)).toBe(3)
  })

  it("maps high scores to extreme complexity", () => {
    const rules = Array.from({ length: 18 }, (_, index) => ({
      field: "status",
      operator: "eq" as const,
      value: `active-${index}`,
    }))
    const tree = buildRootWithRules(rules)
    const result = calculateComplexity(tree)

    expect(result.level).toBe("extreme")
    expect(getComplexityDotCount(result.score, 18)).toBe(5)
  })
})
