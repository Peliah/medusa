"use client"

import * as React from "react"
import { FloppyDiskIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { countRules } from "@/lib/query-engine/tree-utils"
import type { Group, SchemaId } from "@/lib/query-engine/types"
import { useHistoryStore } from "@/store/history-store"

interface SavePresetInputProps {
  schemaId: SchemaId
  tree: Group
}

export function SavePresetInput({ schemaId, tree }: SavePresetInputProps) {
  const savePreset = useHistoryStore((state) => state.savePreset)
  const [name, setName] = React.useState("")
  const canSave = countRules(tree) > 0

  function handleSave(event: React.FormEvent) {
    event.preventDefault()
    if (!canSave) return

    const saved = savePreset(name, schemaId, tree)
    if (saved) setName("")
  }

  return (
    <form onSubmit={handleSave} className="flex gap-2">
      <Input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Preset name"
        disabled={!canSave}
        className="h-8 text-xs"
      />
      <Button
        type="submit"
        size="sm"
        variant="outline"
        disabled={!canSave || name.trim().length === 0}
        className="shrink-0 px-2.5"
      >
        <FloppyDiskIcon className="size-3.5" />
        <span className="sr-only">Save preset</span>
      </Button>
    </form>
  )
}
