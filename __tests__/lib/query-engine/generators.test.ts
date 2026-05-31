import { describe, expect, it } from "vitest"

import { generateGraphQL } from "@/lib/query-engine/generators/graphql"
import { generateMongo } from "@/lib/query-engine/generators/mongo"
import { generateSQL } from "@/lib/query-engine/generators/sql"
import {
  buildGroup,
  buildNestedTree,
  buildRootWithRules,
  buildRule,
  testSchema,
} from "@/__tests__/utils/builders"

describe("generateSQL", () => {
  it("returns placeholder when tree has no valid rules", () => {
    expect(generateSQL(buildRootWithRules([]), testSchema)).toContain(
      "Add valid conditions"
    )
  })

  it("generates a simple WHERE clause", () => {
    const tree = buildRootWithRules([
      { field: "status", operator: "eq", value: "active" },
    ])

    expect(generateSQL(tree, testSchema)).toBe(
      "SELECT *\nFROM agents\nWHERE status = 'active'"
    )
  })

  it("joins nested AND/OR groups with indentation", () => {
    const sql = generateSQL(buildNestedTree(), testSchema)

    expect(sql).toContain("FROM agents")
    expect(sql).toContain("WHERE (compromised = FALSE")
    expect(sql).toContain("AND status = 'active'")
  })

  it("escapes SQL string literals", () => {
    const tree = buildRootWithRules([
      { field: "codename", operator: "eq", value: "O'Brien" },
    ])

    expect(generateSQL(tree, testSchema)).toContain("'O''Brien'")
  })

  it("generates operator-specific SQL", () => {
    expect(
      generateSQL(
        buildRootWithRules([
          { field: "codename", operator: "contains", value: "night" },
        ]),
        testSchema
      )
    ).toContain("codename LIKE '%night%'")

    expect(
      generateSQL(
        buildRootWithRules([
          {
            field: "missionsCompleted",
            operator: "between",
            value: { min: 1, max: 10 },
          },
        ]),
        testSchema
      )
    ).toContain("missionsCompleted BETWEEN 1 AND 10")

    expect(
      generateSQL(
        buildRootWithRules([
          { field: "status", operator: "in", value: ["active", "inactive"] },
        ]),
        testSchema
      )
    ).toContain("status IN ('active', 'inactive')")

    expect(
      generateSQL(
        buildRootWithRules([
          { field: "codename", operator: "is_null", value: null },
        ]),
        testSchema
      )
    ).toContain("codename IS NULL")
  })
})

describe("generateMongo", () => {
  it("returns placeholder when tree has no valid rules", () => {
    expect(generateMongo(buildRootWithRules([]), testSchema)).toContain(
      "_comment"
    )
  })

  it("generates nested filters", () => {
    const output = generateMongo(buildNestedTree(), testSchema)
    const parsed = JSON.parse(output) as Record<string, unknown>

    expect(parsed).toEqual({
      $and: [{ compromised: false }, { status: "active" }],
    })
  })

  it("generates OR groups", () => {
    const tree = buildGroup(
      [
        buildRule({ field: "status", operator: "eq", value: "active" }),
        buildRule({ field: "status", operator: "eq", value: "inactive" }),
      ],
      { logic: "OR" }
    )

    const parsed = JSON.parse(generateMongo(tree, testSchema)) as Record<
      string,
      unknown
    >
    expect(parsed).toEqual({
      $or: [{ status: "active" }, { status: "inactive" }],
    })
  })

  it("generates comparison and membership operators", () => {
    const parsed = JSON.parse(
      generateMongo(
        buildRootWithRules([
          { field: "missionsCompleted", operator: "gte", value: 10 },
          { field: "status", operator: "not_in", value: ["retired"] },
        ]),
        testSchema
      )
    ) as Record<string, unknown>

    expect(parsed).toEqual({
      $and: [
        { missionsCompleted: { $gte: 10 } },
        { status: { $nin: ["retired"] } },
      ],
    })
  })
})

describe("generateGraphQL", () => {
  it("returns placeholder query when tree has no valid rules", () => {
    expect(generateGraphQL(buildRootWithRules([]), testSchema)).toContain(
      "Add valid conditions"
    )
  })

  it("generates a where clause with nested logic", () => {
    const output = generateGraphQL(buildNestedTree(), testSchema)

    expect(output).toContain("query FilterAgents")
    expect(output).toContain("agents(where: {")
    expect(output).toContain("_and: [{")
    expect(output).toContain("compromised: {")
    expect(output).toContain('_eq: "false"')
    expect(output).toContain("status: {")
    expect(output).toContain('_eq: "active"')
  })

  it("generates OR filters", () => {
    const tree = buildRootWithRules(
      [
        { field: "status", operator: "eq", value: "active" },
        { field: "status", operator: "eq", value: "inactive" },
      ],
      "OR"
    )

    expect(generateGraphQL(tree, testSchema)).toContain("_or: [{")
  })
})
