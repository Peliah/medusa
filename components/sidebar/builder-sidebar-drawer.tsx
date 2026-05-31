"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { SidebarPanelContent } from "@/components/sidebar/sidebar-panel-content"
import { useUIStore } from "@/store/ui-store"

export function BuilderSidebarDrawer() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen)

  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent
        side="left"
        className="w-[min(100vw,18rem)] gap-0 overflow-hidden p-0"
      >
        <SheetHeader className="shrink-0 border-b border-border px-4 py-3">
          <SheetTitle className="font-heading text-sm">
            Builder sidebar
          </SheetTitle>
        </SheetHeader>
        <div className="builder-panel__body min-h-0 flex-1">
          <SidebarPanelContent onNavigate={() => setSidebarOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
