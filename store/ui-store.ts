import { create } from "zustand"

type PreviewFormat = "sql" | "mongo" | "graphql"

interface UIStore {
  resultsOpen: boolean
  previewFormat: PreviewFormat
  shortcutsOpen: boolean
  setResultsOpen: (open: boolean) => void
  toggleResults: () => void
  setPreviewFormat: (format: PreviewFormat) => void
  setShortcutsOpen: (open: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  resultsOpen: false,
  previewFormat: "sql",
  shortcutsOpen: false,
  setResultsOpen: (open) => set({ resultsOpen: open }),
  toggleResults: () => set((state) => ({ resultsOpen: !state.resultsOpen })),
  setPreviewFormat: (format) => set({ previewFormat: format }),
  setShortcutsOpen: (open) => set({ shortcutsOpen: open }),
}))
