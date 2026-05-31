import type { FieldType } from "@/lib/query-engine/types"
import {
  BracketsCurlyIcon,
  CalendarIcon,
  HashIcon,
  ListBulletsIcon,
  TextAaIcon,
  ToggleLeftIcon,
} from "@phosphor-icons/react"
import type { Icon } from "@phosphor-icons/react"

const fieldTypeIcons: Record<FieldType, Icon> = {
  string: TextAaIcon,
  number: HashIcon,
  enum: ListBulletsIcon,
  boolean: ToggleLeftIcon,
  date: CalendarIcon,
  array: BracketsCurlyIcon,
}

interface FieldTypeIconProps {
  type: FieldType
  className?: string
}

export function FieldTypeIcon({ type, className }: FieldTypeIconProps) {
  const IconComponent = fieldTypeIcons[type]
  return <IconComponent className={className} aria-hidden />
}

export function getFieldTypeLabel(type: FieldType): string {
  switch (type) {
    case "string":
      return "Text"
    case "number":
      return "Number"
    case "enum":
      return "Enum"
    case "boolean":
      return "Boolean"
    case "date":
      return "Date"
    case "array":
      return "Array"
  }
}
