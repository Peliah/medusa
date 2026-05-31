"use client"

import { BuilderPreviewPanel } from "@/components/preview/builder-preview-panel"
import { BuilderSidebar } from "@/components/layout/builder-sidebar"
import { QueryBuilderPanel } from "@/components/query-builder/query-builder-panel"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useIsBelowLg } from "@/hooks/use-is-below-lg"

export function BuilderMain() {
  const isCompact = useIsBelowLg()

  if (isCompact) {
    return (
      <div className="builder-main-layout">
        <div className="builder-main-layout__builder">
          <QueryBuilderPanel />
        </div>
        <div className="builder-main-layout__preview">
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
        defaultSize={19}
        minSize={"320px"}
        maxSize={"480px"}
        className="min-w-0"
      >
        <BuilderSidebar />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel
        id="builder"
        defaultSize={53}
        minSize={30}
        className="min-w-0"
      >
        <QueryBuilderPanel />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel
        id="preview"
        defaultSize={28}
        minSize={"320px"}
        maxSize={"480px"}
        className="min-w-0"
      >
        <BuilderPreviewPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
