import { agentsSchema } from "@/lib/schemas/agents"
import { citiesSchema } from "@/lib/schemas/cities"
import { incidentsSchema } from "@/lib/schemas/incidents"
import type { Schema, SchemaId } from "@/lib/query-engine/types"

export const schemas: Schema[] = [agentsSchema, citiesSchema, incidentsSchema]

export function getSchema(id: SchemaId): Schema {
  const schema = schemas.find((item) => item.id === id)
  if (!schema) throw new Error(`Unknown schema: ${id}`)
  return schema
}
