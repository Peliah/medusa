import { describe, expect, it } from "vitest"

import { IMPORT_MAX_TREE_DEPTH } from "@/lib/import/constants"
import { normalizeQueryTree } from "@/lib/import/validate-query-tree"
import { agentsSchema } from "@/lib/schemas/agents"

function buildValidTree() {
  return {
    type: "group",
    logic: "AND",
    conditions: [
      {
        type: "rule",
        field: "status",
        operator: "eq",
        value: "active",
      },
    ],
  }
}

describe("normalizeQueryTree", () => {
  it("accepts valid query trees and assigns new ids", () => {
    const result = normalizeQueryTree(buildValidTree(), agentsSchema)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.type).toBe("group")
      expect(result.data.id).toBeTruthy()
      expect(result.data.conditions[0]?.type).toBe("rule")
      expect(result.data.conditions[0]?.id).toBeTruthy()
    }
  })

  it("rejects invalid operators for a field", () => {
    const result = normalizeQueryTree(
      {
        type: "group",
        logic: "AND",
        conditions: [
          {
            type: "rule",
            field: "status",
            operator: "gt",
            value: "active",
          },
        ],
      },
      agentsSchema
    )

    expect(result.ok).toBe(false)
  })

  it("rejects excessive nesting depth", () => {
    let nested: Record<string, unknown> = buildValidTree()
    for (let depth = 0; depth <= IMPORT_MAX_TREE_DEPTH; depth += 1) {
      nested = {
        type: "group",
        logic: "AND",
        conditions: [nested],
      }
    }

    const result = normalizeQueryTree(nested, agentsSchema)
    expect(result.ok).toBe(false)
  })

  it("rejects malformed condition types", () => {
    const result = normalizeQueryTree(
      {
        type: "group",
        logic: "AND",
        conditions: [{ type: "unknown" }],
      },
      agentsSchema
    )

    expect(result.ok).toBe(false)
  })
})
