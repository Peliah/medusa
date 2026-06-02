import { IMPORT_MAX_RECORDS, SCHEMA_IDS } from "@/lib/import/constants"
import { sanitizeId, sanitizeRecordValue } from "@/lib/import/sanitize-values"
import type { ImportIssue, ImportResult } from "@/lib/import/types"
import type { DataRecord } from "@/lib/data/types"
import type { SchemaId } from "@/lib/query-engine/types"
import { getSchema } from "@/lib/schemas"

function isSchemaId(value: unknown): value is SchemaId {
  return typeof value === "string" && SCHEMA_IDS.includes(value as SchemaId)
}

function issue(path: string, message: string): ImportIssue {
  return { path, message }
}

export function parseDatasetImport(
  raw: unknown,
  fallbackSchemaId?: SchemaId
): ImportResult<{ schemaId: SchemaId; records: DataRecord[] }> {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return {
      ok: false,
      issues: [issue("$", "Dataset payload must be an object")],
    }
  }

  const payload = raw as Record<string, unknown>
  const schemaId = isSchemaId(payload.schemaId)
    ? payload.schemaId
    : fallbackSchemaId

  if (!schemaId) {
    return {
      ok: false,
      issues: [
        issue("$.schemaId", "schemaId must be agents, cities, or incidents"),
      ],
    }
  }

  const recordsRaw = payload.records
  if (!Array.isArray(recordsRaw)) {
    return {
      ok: false,
      issues: [issue("$.records", "records must be an array")],
    }
  }

  if (recordsRaw.length === 0) {
    return {
      ok: false,
      issues: [issue("$.records", "records must not be empty")],
    }
  }

  if (recordsRaw.length > IMPORT_MAX_RECORDS) {
    return {
      ok: false,
      issues: [
        issue("$.records", `Maximum of ${IMPORT_MAX_RECORDS} records exceeded`),
      ],
    }
  }

  const schema = getSchema(schemaId)
  const allowedFields = new Set(schema.fields.map((field) => field.name))
  const records: DataRecord[] = []
  const issues: ImportIssue[] = []
  const seenIds = new Set<string>()

  recordsRaw.forEach((recordRaw, index) => {
    const path = `$.records[${index}]`

    if (
      typeof recordRaw !== "object" ||
      recordRaw === null ||
      Array.isArray(recordRaw)
    ) {
      issues.push(issue(path, "Record must be an object"))
      return
    }

    const recordObj = recordRaw as Record<string, unknown>
    for (const key of Object.keys(recordObj)) {
      if (key !== "id" && !allowedFields.has(key)) {
        issues.push(issue(path, `Unknown field "${key}"`))
      }
    }

    const id = sanitizeId(recordObj.id)
    if (!id) {
      issues.push(issue(`${path}.id`, "Record id must be a non-empty string"))
      return
    }

    if (seenIds.has(id)) {
      issues.push(issue(`${path}.id`, `Duplicate record id "${id}"`))
      return
    }
    seenIds.add(id)

    const record: DataRecord = { id }
    for (const field of schema.fields) {
      record[field.name] = sanitizeRecordValue(recordObj[field.name], field)
    }

    records.push(record)
  })

  if (issues.length > 0) {
    return { ok: false, issues }
  }

  return { ok: true, data: { schemaId, records } }
}
