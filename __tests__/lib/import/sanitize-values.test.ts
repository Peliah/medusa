import { describe, expect, it } from "vitest"

import {
  sanitizeId,
  sanitizeRecordValue,
  sanitizeRuleValue,
  sanitizeString,
} from "@/lib/import/sanitize-values"
import { agentsSchema } from "@/lib/schemas/agents"

const statusField = agentsSchema.fields.find(
  (field) => field.name === "status"
)!
const missionsField = agentsSchema.fields.find(
  (field) => field.name === "missionsCompleted"
)!

describe("sanitizeString", () => {
  it("trims and strips control characters", () => {
    expect(sanitizeString("  hello\u0007 ")).toBe("hello")
  })

  it("rejects empty and non-string values", () => {
    expect(sanitizeString("   ")).toBeNull()
    expect(sanitizeString(42)).toBeNull()
  })
})

describe("sanitizeId", () => {
  it("accepts non-empty ids", () => {
    expect(sanitizeId("ag-001")).toBe("ag-001")
  })
})

describe("sanitizeRuleValue", () => {
  it("accepts valid enum values", () => {
    expect(sanitizeRuleValue("active", statusField, "eq")).toBe("active")
  })

  it("rejects invalid enum values", () => {
    expect(sanitizeRuleValue("unknown", statusField, "eq")).toBeNull()
  })

  it("accepts valid regex patterns", () => {
    expect(sanitizeRuleValue("^night", statusField, "regex")).toBe("^night")
  })

  it("rejects invalid regex patterns", () => {
    expect(sanitizeRuleValue("[", statusField, "regex")).toBeNull()
  })

  it("accepts numeric values", () => {
    expect(sanitizeRuleValue(10, missionsField, "gte")).toBe(10)
  })
})

describe("sanitizeRecordValue", () => {
  it("coerces invalid values to safe defaults", () => {
    expect(sanitizeRecordValue(null, statusField)).toBe("")
    expect(sanitizeRecordValue("active", statusField)).toBe("active")
    expect(sanitizeRecordValue("bad", missionsField)).toBe(0)
  })
})
