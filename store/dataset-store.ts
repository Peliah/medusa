import { create } from "zustand"

import type { DataRecord } from "@/lib/data/types"
import type { SchemaId } from "@/lib/query-engine/types"

interface DatasetStore {
  imported: Partial<Record<SchemaId, DataRecord[]>>
  setImported: (schemaId: SchemaId, records: DataRecord[]) => void
  clearImported: (schemaId?: SchemaId) => void
  hasImported: (schemaId: SchemaId) => boolean
}

export const useDatasetStore = create<DatasetStore>((set, get) => ({
  imported: {},

  setImported: (schemaId, records) => {
    set((state) => ({
      imported: {
        ...state.imported,
        [schemaId]: records,
      },
    }))
  },

  clearImported: (schemaId) => {
    if (!schemaId) {
      set({ imported: {} })
      return
    }

    set((state) => {
      const next = { ...state.imported }
      delete next[schemaId]
      return { imported: next }
    })
  },

  hasImported: (schemaId) => {
    const records = get().imported[schemaId]
    return Array.isArray(records) && records.length > 0
  },
}))
