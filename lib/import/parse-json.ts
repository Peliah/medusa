import { IMPORT_MAX_BYTES, FORBIDDEN_OBJECT_KEYS } from "@/lib/import/constants"
import type { ImportIssue, ImportResult } from "@/lib/import/types"

function issue(path: string, message: string): ImportIssue {
  return { path, message }
}

export function hasForbiddenKeys(value: unknown, path = "$"): ImportIssue[] {
  if (value === null || typeof value !== "object") return []

  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      hasForbiddenKeys(item, `${path}[${index}]`)
    )
  }

  const issues: ImportIssue[] = []
  for (const key of Object.keys(value)) {
    if (FORBIDDEN_OBJECT_KEYS.has(key)) {
      issues.push(issue(path, `Forbidden key "${key}"`))
      continue
    }
    issues.push(
      ...hasForbiddenKeys(
        (value as Record<string, unknown>)[key],
        `${path}.${key}`
      )
    )
  }
  return issues
}

export function parseImportJson(text: string): ImportResult<unknown> {
  if (text.length > IMPORT_MAX_BYTES) {
    return {
      ok: false,
      issues: [issue("$", "Import file is too large")],
    }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return {
      ok: false,
      issues: [issue("$", "Invalid JSON")],
    }
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {
      ok: false,
      issues: [issue("$", "Root value must be a JSON object")],
    }
  }

  const forbidden = hasForbiddenKeys(parsed)
  if (forbidden.length > 0) {
    return { ok: false, issues: forbidden }
  }

  return { ok: true, data: parsed }
}
