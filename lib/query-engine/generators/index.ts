import { generateGraphQL } from "@/lib/query-engine/generators/graphql"
import { generateMongo } from "@/lib/query-engine/generators/mongo"
import { generateSQL } from "@/lib/query-engine/generators/sql"
import type { Group, Schema } from "@/lib/query-engine/types"

export { generateGraphQL, generateMongo, generateSQL }

export type PreviewFormat = "sql" | "mongo" | "graphql"

export function generatePreview(
  format: PreviewFormat,
  group: Group,
  schema: Schema
): string {
  switch (format) {
    case "sql":
      return generateSQL(group, schema)
    case "mongo":
      return generateMongo(group, schema)
    case "graphql":
      return generateGraphQL(group, schema)
  }
}

export function getPreviewFileExtension(format: PreviewFormat): string {
  switch (format) {
    case "sql":
      return "sql"
    case "mongo":
      return "json"
    case "graphql":
      return "graphql"
  }
}

export function getPreviewMimeType(format: PreviewFormat): string {
  switch (format) {
    case "sql":
      return "text/sql"
    case "mongo":
      return "application/json"
    case "graphql":
      return "application/graphql"
  }
}
