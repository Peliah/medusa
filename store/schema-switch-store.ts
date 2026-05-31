import { create } from "zustand"

import { setSkipSchemaSwitchConfirm } from "@/lib/schema-switch-preference"
import type { SchemaId } from "@/lib/query-engine/types"
import { useQueryStore } from "@/store/query-store"

interface PendingSchemaSwitch {
  nextId: SchemaId
  onConfirmed?: () => void
}

interface SchemaSwitchStore {
  pending: PendingSchemaSwitch | null
  open: (nextId: SchemaId, onConfirmed?: () => void) => void
  cancel: () => void
  confirm: (dontAskAgain: boolean) => void
}

export const useSchemaSwitchStore = create<SchemaSwitchStore>((set, get) => ({
  pending: null,

  open: (nextId, onConfirmed) => {
    set({ pending: { nextId, onConfirmed } })
  },

  cancel: () => {
    set({ pending: null })
  },

  confirm: (dontAskAgain) => {
    const { pending } = get()
    if (!pending) return

    if (dontAskAgain) {
      setSkipSchemaSwitchConfirm(true)
    }

    useQueryStore.getState().setSchema(pending.nextId)
    pending.onConfirmed?.()
    set({ pending: null })
  },
}))
