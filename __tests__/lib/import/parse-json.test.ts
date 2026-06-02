import { describe, expect, it } from "vitest"

import { IMPORT_MAX_BYTES } from "@/lib/import/constants"
import { hasForbiddenKeys, parseImportJson } from "@/lib/import/parse-json"

describe("parseImportJson", () => {
  it("parses valid JSON objects", () => {
    const result = parseImportJson('{"kind":"query","schemaId":"agents"}')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toEqual({ kind: "query", schemaId: "agents" })
    }
  })

  it("rejects invalid JSON", () => {
    const result = parseImportJson("{not json")
    expect(result).toEqual({
      ok: false,
      issues: [{ path: "$", message: "Invalid JSON" }],
    })
  })

  it("rejects non-object roots", () => {
    expect(parseImportJson("[]").ok).toBe(false)
    expect(parseImportJson('"hello"').ok).toBe(false)
    expect(parseImportJson("null").ok).toBe(false)
  })

  it("rejects oversized payloads", () => {
    const oversized = " ".repeat(IMPORT_MAX_BYTES + 1)
    const result = parseImportJson(oversized)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.issues[0]?.message).toBe("Import file is too large")
    }
  })

  it("rejects forbidden prototype keys", () => {
    const result = parseImportJson('{"__proto__":{"polluted":true}}')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(
        result.issues.some((issue) => issue.message.includes("__proto__"))
      ).toBe(true)
    }
  })
})

describe("hasForbiddenKeys", () => {
  it("finds forbidden keys in nested structures", () => {
    const issues = hasForbiddenKeys({
      tree: {
        conditions: [{ constructor: "bad" }],
      },
    })

    expect(issues).toEqual([
      { path: "$.tree.conditions[0]", message: 'Forbidden key "constructor"' },
    ])
  })
})
