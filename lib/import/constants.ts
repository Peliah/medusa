export const IMPORT_MAX_BYTES = 1_000_000
export const IMPORT_MAX_RECORDS = 500
export const IMPORT_MAX_TREE_DEPTH = 10
export const IMPORT_MAX_TREE_NODES = 200
export const IMPORT_MAX_STRING_LENGTH = 500
export const IMPORT_MAX_ARRAY_LENGTH = 50
export const IMPORT_MAX_ID_LENGTH = 128

export const FORBIDDEN_OBJECT_KEYS = new Set([
  "__proto__",
  "constructor",
  "prototype",
])

export const SCHEMA_IDS = ["agents", "cities", "incidents"] as const
