"use client"

import * as React from "react"

import { getSkipSchemaSwitchConfirm } from "@/lib/schema-switch-preference"
import { countRules } from "@/lib/query-engine/tree-utils"
import type { SchemaId } from "@/lib/query-engine/types"
import { useQueryStore } from "@/store/query-store"
import { useSchemaSwitchStore } from "@/store/schema-switch-store"

interface SwitchSchemaOptions {
  onConfirmed?: () => void
}

export function useSchemaSwitch() {
  const tree = useQueryStore((state) => state.tree)
  const schemaId = useQueryStore((state) => state.schemaId)
  const setSchema = useQueryStore((state) => state.setSchema)
  const openSchemaSwitchDialog = useSchemaSwitchStore((state) => state.open)

  const switchSchema = React.useCallback(
    (nextId: SchemaId, options?: SwitchSchemaOptions) => {
      const finish = () => {
        setSchema(nextId)
        options?.onConfirmed?.()
      }

      if (nextId === schemaId) {
        options?.onConfirmed?.()
        return
      }

      if (countRules(tree) === 0 || getSkipSchemaSwitchConfirm()) {
        finish()
        return
      }

      openSchemaSwitchDialog(nextId, options?.onConfirmed)
    },
    [openSchemaSwitchDialog, schemaId, setSchema, tree]
  )

  return { schemaId, switchSchema }
}
