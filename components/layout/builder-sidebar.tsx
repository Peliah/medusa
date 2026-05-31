"use client"

import { SidebarPanelContent } from "@/components/sidebar/sidebar-panel-content"

export function BuilderSidebar() {
  return (
    <aside className="builder-panel border-r border-border bg-card">
      <div className="builder-panel__body">
        <SidebarPanelContent />
      </div>
    </aside>
  )
}
