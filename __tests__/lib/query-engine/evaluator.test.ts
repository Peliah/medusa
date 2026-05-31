import { afterEach, describe, expect, it, vi } from "vitest"

import { executeQuery, filterRecords } from "@/lib/query-engine/evaluator"
import {
  buildRecord,
  buildRootWithRules,
  testSchema,
} from "@/__tests__/utils/builders"

const records = [
  buildRecord({
    id: "1",
    codename: "Nightshade",
    status: "active",
    compromised: false,
    missionsCompleted: 42,
    clearanceLevel: "LEVEL_5",
  }),
  buildRecord({
    id: "2",
    codename: "Viper",
    status: "inactive",
    compromised: true,
    missionsCompleted: 10,
    clearanceLevel: "LEVEL_3",
  }),
  buildRecord({
    id: "3",
    codename: "Echo",
    status: "active",
    compromised: false,
    missionsCompleted: 5,
    clearanceLevel: "LEVEL_2",
  }),
]

describe("evaluator", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("filters with AND logic", () => {
    const tree = buildRootWithRules([
      { field: "status", operator: "eq", value: "active" },
      { field: "compromised", operator: "eq", value: false },
    ])

    const matches = filterRecords(records, tree, testSchema)
    expect(matches.map((record) => record.id)).toEqual(["1", "3"])
  })

  it("filters with OR logic", () => {
    const tree = buildRootWithRules(
      [
        { field: "status", operator: "eq", value: "inactive" },
        { field: "codename", operator: "eq", value: "Echo" },
      ],
      "OR"
    )

    const matches = executeQuery(records, tree, testSchema)
    expect(matches.map((record) => record.id)).toEqual(["2", "3"])
  })

  it("supports comparison and string operators", () => {
    const tree = buildRootWithRules([
      { field: "missionsCompleted", operator: "gte", value: 10 },
      { field: "codename", operator: "contains", value: "ip" },
    ])

    const matches = filterRecords(records, tree, testSchema)
    expect(matches.map((record) => record.id)).toEqual(["2"])
  })

  it("supports enum in and not_in", () => {
    const inTree = buildRootWithRules([
      {
        field: "clearanceLevel",
        operator: "in",
        value: ["LEVEL_5", "LEVEL_2"],
      },
    ])
    expect(filterRecords(records, inTree, testSchema)).toHaveLength(2)

    const notInTree = buildRootWithRules([
      {
        field: "status",
        operator: "not_in",
        value: ["inactive"],
      },
    ])
    expect(filterRecords(records, notInTree, testSchema)).toHaveLength(2)
  })

  it("supports null checks", () => {
    const withNull = [
      ...records,
      buildRecord({ id: "4", codename: null as unknown as string }),
    ]

    const tree = buildRootWithRules([
      { field: "codename", operator: "is_not_null", value: null },
    ])

    expect(filterRecords(withNull, tree, testSchema)).toHaveLength(3)
  })

  it("supports regex matching", () => {
    const tree = buildRootWithRules([
      { field: "codename", operator: "regex", value: "^V" },
    ])

    expect(filterRecords(records, tree, testSchema)).toHaveLength(1)
    expect(filterRecords(records, tree, testSchema)[0].codename).toBe("Viper")
  })

  it("supports number between", () => {
    const tree = buildRootWithRules([
      {
        field: "missionsCompleted",
        operator: "between",
        value: { min: 10, max: 40 },
      },
    ])

    expect(filterRecords(records, tree, testSchema).map((r) => r.id)).toEqual([
      "2",
    ])
  })

  it("supports date between", () => {
    const tree = buildRootWithRules([
      {
        field: "lastSeen",
        operator: "between",
        value: { start: "2026-05-01", end: "2026-05-31" },
      },
    ])

    expect(filterRecords(records, tree, testSchema)).toHaveLength(3)
  })

  it("matches is_today against the current date", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-05-28T12:00:00"))

    const datedRecords = [
      buildRecord({ id: "1", lastSeen: "2026-05-28" }),
      buildRecord({ id: "2", lastSeen: "2026-05-20" }),
      buildRecord({ id: "3", lastSeen: "2026-05-01" }),
    ]

    const tree = buildRootWithRules([
      { field: "lastSeen", operator: "is_today", value: null },
    ])

    expect(
      filterRecords(datedRecords, tree, testSchema).map((r) => r.id)
    ).toEqual(["1"])
  })
})
