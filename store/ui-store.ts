import { create } from "zustand"

type PreviewFormat = "sql" | "mongo" | "graphql"

interface UIStore {
  resultsOpen: boolean
  previewFormat: PreviewFormat
  shortcutsOpen: boolean
  sidebarOpen: boolean
  setResultsOpen: (open: boolean) => void
  toggleResults: () => void
  setPreviewFormat: (format: PreviewFormat) => void
  setShortcutsOpen: (open: boolean) => void
  setSidebarOpen: (open: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  resultsOpen: false,
  previewFormat: "sql",
  shortcutsOpen: false,
  sidebarOpen: false,
  setResultsOpen: (open) => set({ resultsOpen: open }),
  toggleResults: () => set((state) => ({ resultsOpen: !state.resultsOpen })),
  setPreviewFormat: (format) => set({ previewFormat: format }),
  setShortcutsOpen: (open) => set({ shortcutsOpen: open }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
