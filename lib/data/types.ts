import type { SchemaId } from "@/lib/query-engine/types"

export type DataRecord = Record<
  string,
  string | number | boolean | null | string[]
>

export interface Dataset {
  schemaId: SchemaId
  records: DataRecord[]
}
