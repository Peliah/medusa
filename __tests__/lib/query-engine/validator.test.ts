import { describe, expect, it } from "vitest"

import {
  getRuleValidationMessage,
  isTreeRunnable,
  validateTree,
} from "@/lib/query-engine/validator"
import {
  buildGroup,
  buildRootWithRules,
  buildRule,
  testSchema,
} from "@/__tests__/utils/builders"

describe("validator", () => {
  it("requires field and operator", () => {
    expect(getRuleValidationMessage(buildRule(), testSchema)).toBe(
      "Select a field"
    )
    expect(
      getRuleValidationMessage(
        buildRule({ field: "codename", operator: null }),
        testSchema
      )
    ).toBe("Select an operator")
  })

  it("validates string values", () => {
    expect(
      getRuleValidationMessage(
        buildRule({ field: "codename", operator: "eq", value: "" }),
        testSchema
      )
    ).toBe("Enter a value for Codename")

    expect(
      getRuleValidationMessage(
        buildRule({ field: "codename", operator: "eq", value: "Viper" }),
        testSchema
      )
    ).toBeNull()
  })

  it("validates regex patterns", () => {
    expect(
      getRuleValidationMessage(
        buildRule({ field: "codename", operator: "regex", value: "[" }),
        testSchema
      )
    ).toBe("Enter a valid regex pattern")

    expect(
      getRuleValidationMessage(
        buildRule({ field: "codename", operator: "regex", value: "^V" }),
        testSchema
      )
    ).toBeNull()
  })

  it("validates number ranges", () => {
    expect(
      getRuleValidationMessage(
        buildRule({
          field: "missionsCompleted",
          operator: "between",
          value: { min: 10, max: 5 },
        }),
        testSchema
      )
    ).toBe("Minimum must be less than or equal to maximum")

    expect(
      getRuleValidationMessage(
        buildRule({
          field: "missionsCompleted",
          operator: "between",
          value: { min: 5, max: 20 },
        }),
        testSchema
      )
    ).toBeNull()
  })

  it("validates enum in lists", () => {
    expect(
      getRuleValidationMessage(
        buildRule({
          field: "status",
          operator: "in",
          value: [],
        }),
        testSchema
      )
    ).toBe("Add at least one value for Status")

    expect(
      getRuleValidationMessage(
        buildRule({
          field: "status",
          operator: "in",
          value: ["active", "inactive"],
        }),
        testSchema
      )
    ).toBeNull()
  })

  it("accepts valueless operators", () => {
    expect(
      getRuleValidationMessage(
        buildRule({ field: "codename", operator: "is_null", value: null }),
        testSchema
      )
    ).toBeNull()
  })

  it("validates trees recursively", () => {
    const valid = buildRootWithRules([
      { field: "status", operator: "eq", value: "active" },
    ])
    expect(validateTree(valid, testSchema).valid).toBe(true)
    expect(isTreeRunnable(valid, testSchema)).toBe(true)

    const invalidNested = buildGroup([
      buildRule({ field: "status", operator: "eq", value: "active" }),
      buildGroup([buildRule({ field: "codename", operator: "eq", value: "" })]),
    ])
    expect(validateTree(invalidNested, testSchema).valid).toBe(false)

    expect(validateTree(buildRootWithRules([]), testSchema).valid).toBe(false)
  })
})
