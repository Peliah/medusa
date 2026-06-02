import type { DataRecord } from "@/lib/data/types"
import type { Group, SchemaId } from "@/lib/query-engine/types"

export interface ImportIssue {
  path: string
  message: string
}

export type ImportResult<T> =
  | { ok: true; data: T }
  | { ok: false; issues: ImportIssue[] }

export interface QueryImportData {
  kind: "query"
  schemaId: SchemaId
  tree: Group
}

export interface DatasetImportData {
  kind: "dataset"
  schemaId: SchemaId
  records: DataRecord[]
}

export type ImportData = QueryImportData | DatasetImportData
