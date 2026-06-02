import { describe, expect, it } from "vitest"

import {
  exportDatasetJson,
  exportQueryJson,
  importFromJson,
} from "@/lib/import"
import { buildRecord, buildRootWithRules } from "@/__tests__/utils/builders"

describe("importFromJson", () => {
  it("imports query payloads", () => {
    const tree = buildRootWithRules([
      { field: "status", operator: "eq", value: "active" },
    ])

    const text = exportQueryJson("agents", tree)
    const result = importFromJson(text)

    expect(result.ok).toBe(true)
    if (result.ok && result.data.kind === "query") {
      expect(result.data.schemaId).toBe("agents")
      expect(result.data.tree.conditions).toHaveLength(1)
    }
  })

  it("imports dataset payloads", () => {
    const text = exportDatasetJson("agents", [buildRecord({ id: "dataset-1" })])
    const result = importFromJson(text)

    expect(result.ok).toBe(true)
    if (result.ok && result.data.kind === "dataset") {
      expect(result.data.records).toHaveLength(1)
    }
  })

  it("infers payload kind from shape", () => {
    const queryResult = importFromJson(
      JSON.stringify({
        schemaId: "agents",
        tree: {
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
        },
      })
    )
    expect(queryResult.ok).toBe(true)

    const datasetResult = importFromJson(
      JSON.stringify({
        schemaId: "agents",
        records: [buildRecord({ id: "shape-1" })],
      })
    )
    expect(datasetResult.ok).toBe(true)
  })

  it("rejects query trees with no rules", () => {
    const result = importFromJson(
      JSON.stringify({
        kind: "query",
        schemaId: "agents",
        tree: { type: "group", logic: "AND", conditions: [] },
      })
    )

    expect(result.ok).toBe(false)
  })

  it("rejects prototype pollution payloads", () => {
    const result = importFromJson('{"__proto__":{"admin":true},"records":[]}')
    expect(result.ok).toBe(false)
  })
})
