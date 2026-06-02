import { parseImportJson } from "@/lib/import/parse-json"
import type { ImportData, ImportResult } from "@/lib/import/types"
import { parseDatasetImport } from "@/lib/import/validate-dataset"
import { normalizeQueryTree } from "@/lib/import/validate-query-tree"
import { countRules } from "@/lib/query-engine/tree-utils"
import type { SchemaId } from "@/lib/query-engine/types"
import { getSchema } from "@/lib/schemas"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function importFromJson(
  text: string,
  fallbackSchemaId?: SchemaId
): ImportResult<ImportData> {
  const parsed = parseImportJson(text)
  if (!parsed.ok) return parsed

  const payload = parsed.data
  if (!isRecord(payload)) {
    return {
      ok: false,
      issues: [{ path: "$", message: "Root value must be a JSON object" }],
    }
  }

  const kind =
    payload.kind ??
    (Array.isArray(payload.records)
      ? "dataset"
      : payload.tree !== undefined
        ? "query"
        : null)

  if (kind === "dataset" || (kind === null && Array.isArray(payload.records))) {
    const dataset = parseDatasetImport(payload, fallbackSchemaId)
    if (!dataset.ok) return dataset
    return {
      ok: true,
      data: {
        kind: "dataset",
        schemaId: dataset.data.schemaId,
        records: dataset.data.records,
      },
    }
  }

  if (kind === "query" || payload.tree !== undefined) {
    const schemaId =
      typeof payload.schemaId === "string"
        ? (payload.schemaId as SchemaId)
        : fallbackSchemaId

    if (!schemaId || !["agents", "cities", "incidents"].includes(schemaId)) {
      return {
        ok: false,
        issues: [
          {
            path: "$.schemaId",
            message: "schemaId must be agents, cities, or incidents",
          },
        ],
      }
    }

    const schema = getSchema(schemaId)
    const treeResult = normalizeQueryTree(payload.tree, schema)
    if (!treeResult.ok) return treeResult

    if (countRules(treeResult.data) === 0) {
      return {
        ok: false,
        issues: [
          {
            path: "$.tree",
            message: "Query tree must contain at least one rule",
          },
        ],
      }
    }

    return {
      ok: true,
      data: {
        kind: "query",
        schemaId,
        tree: treeResult.data,
      },
    }
  }

  return {
    ok: false,
    issues: [
      {
        path: "$",
        message:
          'Payload must include "tree" for queries or "records" for datasets',
      },
    ],
  }
}

export function exportQueryJson(schemaId: SchemaId, tree: unknown): string {
  return JSON.stringify(
    {
      kind: "query",
      schemaId,
      tree,
    },
    null,
    2
  )
}

export function exportDatasetJson(
  schemaId: SchemaId,
  records: unknown[]
): string {
  return JSON.stringify(
    {
      kind: "dataset",
      schemaId,
      records,
    },
    null,
    2
  )
}
