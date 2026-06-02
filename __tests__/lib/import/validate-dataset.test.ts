import { describe, expect, it } from "vitest"

import { parseDatasetImport } from "@/lib/import/validate-dataset"
import { buildRecord } from "@/__tests__/utils/builders"

describe("parseDatasetImport", () => {
  it("accepts valid dataset payloads", () => {
    const record = buildRecord({ id: "import-1" })
    const result = parseDatasetImport({
      kind: "dataset",
      schemaId: "agents",
      records: [record],
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.schemaId).toBe("agents")
      expect(result.data.records).toHaveLength(1)
      expect(result.data.records[0]?.id).toBe("import-1")
    }
  })

  it("uses fallback schema id when omitted", () => {
    const result = parseDatasetImport(
      { records: [buildRecord({ id: "import-2" })] },
      "agents"
    )

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.schemaId).toBe("agents")
    }
  })

  it("rejects duplicate record ids", () => {
    const record = buildRecord({ id: "dup-1" })
    const result = parseDatasetImport({
      schemaId: "agents",
      records: [record, record],
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(
        result.issues.some((issue) => issue.message.includes("Duplicate"))
      ).toBe(true)
    }
  })

  it("rejects unknown fields", () => {
    const result = parseDatasetImport({
      schemaId: "agents",
      records: [{ id: "bad-1", unknownField: "x" }],
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(
        result.issues.some((issue) => issue.message.includes("Unknown field"))
      ).toBe(true)
    }
  })

  it("rejects empty record arrays", () => {
    const result = parseDatasetImport({
      schemaId: "agents",
      records: [],
    })

    expect(result.ok).toBe(false)
  })
})
