"use client"

import * as React from "react"
import { FloppyDiskIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { countRules } from "@/lib/query-engine/tree-utils"
import type { Group, SchemaId } from "@/lib/query-engine/types"
import { useHistoryStore } from "@/store/history-store"
import { useUIStore } from "@/store/ui-store"

interface SavePresetInputProps {
  schemaId: SchemaId
  tree: Group
}

export function SavePresetInput({ schemaId, tree }: SavePresetInputProps) {
  const savePreset = useHistoryStore((state) => state.savePreset)
  const savePresetFocusNonce = useUIStore((state) => state.savePresetFocusNonce)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [name, setName] = React.useState("")
  const canSave = countRules(tree) > 0

  React.useEffect(() => {
    if (savePresetFocusNonce === 0) return
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [savePresetFocusNonce])

  function handleSave(event: React.FormEvent) {
    event.preventDefault()
    if (!canSave) return

    const saved = savePreset(name, schemaId, tree)
    if (saved) setName("")
  }

  return (
    <form onSubmit={handleSave} className="flex gap-2">
      <Input
        ref={inputRef}
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Preset name"
        disabled={!canSave}
        className="h-8 text-xs"
        aria-label="Preset name"
      />
      <Button
        type="submit"
        size="sm"
        variant="outline"
        disabled={!canSave || name.trim().length === 0}
        className="shrink-0 px-2.5"
        title="Save preset (Ctrl+S)"
      >
        <FloppyDiskIcon className="size-3.5" />
        <span className="sr-only">Save preset</span>
      </Button>
    </form>
  )
}
