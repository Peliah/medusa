"use client"

import * as React from "react"
import { toast } from "sonner"

import { countRules } from "@/lib/query-engine/tree-utils"
import type { SchemaId } from "@/lib/query-engine/types"
import { useQueryStore } from "@/store/query-store"

const SCHEMA_SWITCH_MESSAGE = "Switching schema will clear your current query."

interface SwitchSchemaOptions {
  onConfirmed?: () => void
}

export function useSchemaSwitch() {
  const tree = useQueryStore((state) => state.tree)
  const schemaId = useQueryStore((state) => state.schemaId)
  const setSchema = useQueryStore((state) => state.setSchema)

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

      if (countRules(tree) > 0) {
        toast.warning(SCHEMA_SWITCH_MESSAGE, {
          action: {
            label: "Switch",
            onClick: finish,
          },
        })
        return
      }

      finish()
    },
    [schemaId, setSchema, tree]
  )

  return { schemaId, switchSchema }
}
