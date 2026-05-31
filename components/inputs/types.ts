import type { RuleValue } from "@/lib/query-engine/types"

export interface ValueInputProps {
  value: RuleValue
  onChange: (value: RuleValue) => void
  invalid?: boolean
  className?: string
}
