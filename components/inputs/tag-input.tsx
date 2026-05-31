"use client"

import * as React from "react"
import { XIcon } from "@phosphor-icons/react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type { ValueInputProps } from "@/components/inputs/types"
import { isStringArray } from "@/lib/query-engine/value-utils"
import { cn } from "@/lib/utils"

interface TagInputProps extends ValueInputProps {
  options?: string[]
  placeholder?: string
}

export function TagInput({
  value,
  onChange,
  options,
  invalid = false,
  placeholder = "Add value…",
  className,
}: TagInputProps) {
  const [draft, setDraft] = React.useState("")
  const tags = isStringArray(value) ? value : []
  const datalistId = React.useId()

  function addTag(raw: string) {
    const next = raw.trim()
    if (!next || tags.includes(next)) return
    if (options && !options.includes(next)) return
    onChange([...tags, next])
    setDraft("")
  }

  function removeTag(tag: string) {
    onChange(tags.filter((item) => item !== tag))
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      addTag(draft)
    }

    if (event.key === "Backspace" && draft === "" && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  return (
    <div
      className={cn(
        "flex min-h-8 min-w-0 flex-1 flex-wrap items-center gap-1 rounded-lg border border-input bg-background px-2 py-1",
        invalid && "border-destructive",
        className
      )}
    >
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="h-5 gap-1 px-1.5 text-[10px] font-normal"
        >
          {tag}
          <button
            type="button"
            className="rounded-sm opacity-60 hover:opacity-100"
            onClick={() => removeTag(tag)}
            aria-label={`Remove ${tag}`}
          >
            <XIcon className="size-2.5" />
          </button>
        </Badge>
      ))}
      <Input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(draft)}
        list={options ? datalistId : undefined}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="h-6 min-w-16 flex-1 border-0 bg-transparent px-0 text-xs shadow-none focus-visible:ring-0"
        aria-label="Tag value"
        aria-invalid={invalid}
      />
      {options ? (
        <datalist id={datalistId}>
          {options.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      ) : null}
    </div>
  )
}
