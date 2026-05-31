import { create } from "zustand"

import { getRecords } from "@/lib/data"
import type { DataRecord } from "@/lib/data/types"
import { executeQuery } from "@/lib/query-engine/evaluator"
import type { Group, SchemaId } from "@/lib/query-engine/types"
import { getSchema } from "@/lib/schemas"

const EXECUTION_DELAY_MS = 600

export type ExecutionStatus = "idle" | "loading" | "success" | "error"

interface ExecutionStore {
  status: ExecutionStatus
  matches: DataRecord[]
  lastRunAt: number | null
  execute: (schemaId: SchemaId, tree: Group) => Promise<void>
  reset: () => void
}

export const useExecutionStore = create<ExecutionStore>((set) => ({
  status: "idle",
  matches: [],
  lastRunAt: null,

  execute: async (schemaId, tree) => {
    set({ status: "loading", matches: [] })

    await new Promise((resolve) => {
      window.setTimeout(resolve, EXECUTION_DELAY_MS)
    })

    try {
      const schema = getSchema(schemaId)
      const records = getRecords(schemaId)
      const matches = executeQuery(records, tree, schema)

      set({
        status: "success",
        matches,
        lastRunAt: Date.now(),
      })
    } catch {
      set({
        status: "error",
        matches: [],
        lastRunAt: Date.now(),
      })
    }
  },

  reset: () => {
    set({ status: "idle", matches: [], lastRunAt: null })
  },
}))
