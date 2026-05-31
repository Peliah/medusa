import { describe, expect, it } from "vitest"

import {
  getOperatorsForType,
  operatorLabels,
  operatorNeedsValue,
} from "@/lib/query-engine/operators"

describe("operators", () => {
  it("exposes labels for every operator", () => {
    expect(operatorLabels.eq).toBe("Equals")
    expect(operatorLabels.regex).toBe("Matches regex")
    expect(operatorLabels.in).toBe("In")
  })

  it("returns operators per field type", () => {
    expect(getOperatorsForType("string")).toContain("contains")
    expect(getOperatorsForType("number")).toContain("between")
    expect(getOperatorsForType("enum")).toContain("in")
    expect(getOperatorsForType("boolean")).not.toContain("neq")
    expect(getOperatorsForType("date")).toContain("is_today")
    expect(getOperatorsForType("array")).toContain("not_in")
  })

  it("marks valueless operators correctly", () => {
    expect(operatorNeedsValue("is_null")).toBe(false)
    expect(operatorNeedsValue("is_today")).toBe(false)
    expect(operatorNeedsValue("eq")).toBe(true)
    expect(operatorNeedsValue("between")).toBe(true)
    expect(operatorNeedsValue(null)).toBe(false)
  })
})
