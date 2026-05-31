"use client"

import { BuilderPreviewPanel } from "@/components/layout/builder-preview-panel"
import { BuilderSidebar } from "@/components/layout/builder-sidebar"
import { QueryBuilderPanel } from "@/components/query-builder/query-builder-panel"

export function BuilderMain() {
  return (
    <div className="builder-main-layout">
      <div className="builder-main-layout__sidebar">
        <BuilderSidebar />
      </div>

      <div className="builder-main-layout__builder">
        <QueryBuilderPanel />
      </div>

      <div className="builder-main-layout__preview">
        <BuilderPreviewPanel />
      </div>
    </div>
  )
}
