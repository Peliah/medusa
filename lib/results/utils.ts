import { format, parseISO } from "date-fns"

import type { DataRecord } from "@/lib/data/types"
import type { SchemaField } from "@/lib/query-engine/types"

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) return ""
  const text = Array.isArray(value) ? value.join("; ") : String(value)
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

export function exportRecordsToCsv(
  records: DataRecord[],
  fields: SchemaField[],
  filename: string
): void {
  const headers = fields.map((field) => field.label)
  const rows = records.map((record) =>
    fields.map((field) => escapeCsvValue(record[field.name])).join(",")
  )

  const csv = [headers.join(","), ...rows].join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function formatCellValue(value: unknown, field: SchemaField): string {
  if (value === null || value === undefined) return "—"

  if (field.type === "boolean") {
    return value === true ? "true" : "false"
  }

  if (field.type === "date" && typeof value === "string") {
    try {
      return format(parseISO(value), "MMM d, yyyy")
    } catch {
      return value
    }
  }

  if (field.type === "number" && typeof value === "number") {
    return value.toLocaleString()
  }

  if (Array.isArray(value)) {
    return value.join(", ")
  }

  return String(value)
}

export type SortDirection = "asc" | "desc"

export function sortRecords(
  records: DataRecord[],
  field: SchemaField,
  direction: SortDirection
): DataRecord[] {
  const sorted = [...records].sort((left, right) => {
    const a = left[field.name]
    const b = right[field.name]

    if (a === b) return 0
    if (a === null || a === undefined) return 1
    if (b === null || b === undefined) return -1

    if (field.type === "number") {
      return Number(a) - Number(b)
    }

    if (field.type === "date") {
      return String(a).localeCompare(String(b))
    }

    if (field.type === "boolean") {
      return Number(a) - Number(b)
    }

    return String(a).localeCompare(String(b))
  })

  return direction === "asc" ? sorted : sorted.reverse()
}
