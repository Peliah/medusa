import { create } from "zustand"

type PreviewFormat = "sql" | "mongo" | "graphql"

interface UIStore {
  resultsOpen: boolean
  previewFormat: PreviewFormat
  shortcutsOpen: boolean
  sidebarOpen: boolean
  presetsSectionOpen: boolean
  focusedConditionId: string | null
  savePresetFocusNonce: number
  setResultsOpen: (open: boolean) => void
  toggleResults: () => void
  setPreviewFormat: (format: PreviewFormat) => void
  setShortcutsOpen: (open: boolean) => void
  setSidebarOpen: (open: boolean) => void
  setPresetsSectionOpen: (open: boolean) => void
  setFocusedConditionId: (id: string | null) => void
  requestSavePresetFocus: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  resultsOpen: false,
  previewFormat: "sql",
  shortcutsOpen: false,
  sidebarOpen: false,
  presetsSectionOpen: true,
  focusedConditionId: null,
  savePresetFocusNonce: 0,
  setResultsOpen: (open) => set({ resultsOpen: open }),
  toggleResults: () => set((state) => ({ resultsOpen: !state.resultsOpen })),
  setPreviewFormat: (format) => set({ previewFormat: format }),
  setShortcutsOpen: (open) => set({ shortcutsOpen: open }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setPresetsSectionOpen: (open) => set({ presetsSectionOpen: open }),
  setFocusedConditionId: (id) => set({ focusedConditionId: id }),
  requestSavePresetFocus: () =>
    set((state) => ({
      presetsSectionOpen: true,
      savePresetFocusNonce: state.savePresetFocusNonce + 1,
    })),
}))
