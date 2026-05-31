import { describe, expect, it } from "vitest"

import {
  createEmptyNumberRange,
  getDefaultValueForOperator,
  isDateRange,
  isNumberRange,
  isStringArray,
  parseIsoDate,
  toIsoDateString,
} from "@/lib/query-engine/value-utils"
import { testSchema } from "@/__tests__/utils/builders"

describe("value-utils", () => {
  it("detects range and array value shapes", () => {
    expect(isNumberRange({ min: 1, max: 5 })).toBe(true)
    expect(isDateRange({ start: "2026-01-01", end: "2026-02-01" })).toBe(true)
    expect(isStringArray(["active"])).toBe(true)
    expect(isStringArray("active")).toBe(false)
  })

  it("returns defaults based on operator and field type", () => {
    const numberField = testSchema.fields.find(
      (field) => field.name === "missionsCompleted"
    )!
    const enumField = testSchema.fields.find(
      (field) => field.name === "status"
    )!
    const booleanField = testSchema.fields.find(
      (field) => field.name === "compromised"
    )!

    expect(getDefaultValueForOperator(numberField, "between")).toEqual(
      createEmptyNumberRange()
    )
    expect(getDefaultValueForOperator(enumField, "in")).toEqual([])
    expect(getDefaultValueForOperator(booleanField, "eq")).toBe(false)
    expect(getDefaultValueForOperator(enumField, "is_null")).toBeNull()
  })

  it("parses and formats ISO dates", () => {
    expect(parseIsoDate("2026-05-28")?.getFullYear()).toBe(2026)
    expect(parseIsoDate("invalid")).toBeUndefined()
    expect(toIsoDateString(new Date("2026-05-28T15:00:00"))).toBe("2026-05-28")
  })
})
