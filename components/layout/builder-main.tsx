"use client"

import { BuilderPreviewPanel } from "@/components/layout/builder-preview-panel"
import { BuilderSidebar } from "@/components/layout/builder-sidebar"
import { QueryBuilderPanel } from "@/components/query-builder/query-builder-panel"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useIsMobile } from "@/hooks/use-mobile"

export function BuilderMain() {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <div className="builder-main-stack">
        <div className="builder-main-stack__builder">
          <QueryBuilderPanel />
        </div>
        <div className="builder-main-stack__preview">
          <BuilderPreviewPanel />
        </div>
      </div>
    )
  }

  return (
    <ResizablePanelGroup
      id="builder-main"
      orientation="horizontal"
      className="builder-main-panels"
      defaultLayout={{ sidebar: 19, builder: 53, preview: 28 }}
    >
      <ResizablePanel
        id="sidebar"
        defaultSize={28}
        minSize="320px"
        maxSize="480px"
        className="min-w-0"
      >
        <BuilderSidebar />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel id="builder" minSize={25} className="min-w-0">
        <QueryBuilderPanel />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel
        id="preview"
        defaultSize={28}
        minSize="320px"
        maxSize="480px"
        className="min-w-0"
      >
        <BuilderPreviewPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
