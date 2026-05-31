const STORAGE_KEY = "medusa:schema-switch-skip-confirm"

export const SCHEMA_SWITCH_MESSAGE =
  "Switching schema will clear your current query."

export function getSkipSchemaSwitchConfirm(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(STORAGE_KEY) === "true"
}

export function setSkipSchemaSwitchConfirm(skip: boolean): void {
  localStorage.setItem(STORAGE_KEY, String(skip))
}
