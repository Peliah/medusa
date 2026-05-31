import { describe, expect, it } from "vitest"

import { formatCellValue, sortRecords } from "@/lib/results/utils"
import { buildRecord, testSchema } from "@/__tests__/utils/builders"

describe("results utils", () => {
  const records = [
    buildRecord({ id: "1", missionsCompleted: 42, status: "active" }),
    buildRecord({ id: "2", missionsCompleted: 5, status: "inactive" }),
    buildRecord({ id: "3", missionsCompleted: 18, status: "active" }),
  ]

  it("formats cell values by field type", () => {
    const booleanField = testSchema.fields.find(
      (field) => field.name === "compromised"
    )!
    const dateField = testSchema.fields.find(
      (field) => field.name === "lastSeen"
    )!
    const numberField = testSchema.fields.find(
      (field) => field.name === "missionsCompleted"
    )!

    expect(formatCellValue(true, booleanField)).toBe("true")
    expect(formatCellValue("2026-05-28", dateField)).toContain("2026")
    expect(formatCellValue(1000, numberField)).toBe("1,000")
    expect(formatCellValue(null, booleanField)).toBe("—")
  })

  it("sorts records ascending and descending", () => {
    const numberField = testSchema.fields.find(
      (field) => field.name === "missionsCompleted"
    )!

    expect(
      sortRecords(records, numberField, "asc").map((record) => record.id)
    ).toEqual(["2", "3", "1"])

    expect(
      sortRecords(records, numberField, "desc").map((record) => record.id)
    ).toEqual(["1", "3", "2"])
  })
})
