import { nanoid } from "nanoid"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import { countRules } from "@/lib/query-engine/tree-utils"
import type { Group, SchemaId } from "@/lib/query-engine/types"
import { getSchema } from "@/lib/schemas"
import { useQueryStore } from "@/store/query-store"

const HISTORY_LIMIT = 20
const PRESET_LIMIT = 50

export interface HistoryEntry {
  id: string
  schemaId: SchemaId
  tree: Group
  label: string
  ranAt: string
}

export interface SavedPreset {
  id: string
  name: string
  schemaId: SchemaId
  tree: Group
  savedAt: string
}

interface HistoryStore {
  history: HistoryEntry[]
  presets: SavedPreset[]
  recordRun: (schemaId: SchemaId, tree: Group) => void
  restoreHistory: (id: string) => void
  clearHistory: () => void
  savePreset: (name: string, schemaId: SchemaId, tree: Group) => boolean
  loadPreset: (id: string) => void
  deletePreset: (id: string) => void
}

function buildHistoryLabel(schemaId: SchemaId, tree: Group) {
  const schema = getSchema(schemaId)
  const rules = countRules(tree)
  return `${schema.name} · ${rules} rule${rules === 1 ? "" : "s"}`
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      history: [],
      presets: [],

      recordRun: (schemaId, tree) => {
        const entry: HistoryEntry = {
          id: nanoid(),
          schemaId,
          tree: structuredClone(tree),
          label: buildHistoryLabel(schemaId, tree),
          ranAt: new Date().toISOString(),
        }

        set((state) => ({
          history: [entry, ...state.history].slice(0, HISTORY_LIMIT),
        }))
      },

      restoreHistory: (id) => {
        const entry = get().history.find((item) => item.id === id)
        if (!entry) return

        useQueryStore
          .getState()
          .loadQuery(entry.schemaId, structuredClone(entry.tree))
      },

      clearHistory: () => set({ history: [] }),

      savePreset: (name, schemaId, tree) => {
        const trimmed = name.trim()
        if (!trimmed) return false

        const preset: SavedPreset = {
          id: nanoid(),
          name: trimmed,
          schemaId,
          tree: structuredClone(tree),
          savedAt: new Date().toISOString(),
        }

        set((state) => ({
          presets: [preset, ...state.presets].slice(0, PRESET_LIMIT),
        }))

        return true
      },

      loadPreset: (id) => {
        const preset = get().presets.find((item) => item.id === id)
        if (!preset) return

        useQueryStore
          .getState()
          .loadQuery(preset.schemaId, structuredClone(preset.tree))
      },

      deletePreset: (id) => {
        set((state) => ({
          presets: state.presets.filter((item) => item.id !== id),
        }))
      },
    }),
    {
      name: "medusa-history",
      partialize: (state) => ({
        history: state.history,
        presets: state.presets,
      }),
    }
  )
)
