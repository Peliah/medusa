"use client"

import { Kbd, KbdGroup } from "@/components/ui/kbd"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const shortcuts = [
  { keys: ["Ctrl", "Enter"], action: "Run query" },
  { keys: ["Ctrl", "Z"], action: "Undo" },
  { keys: ["Ctrl", "Shift", "Z"], action: "Redo" },
  { keys: ["Ctrl", "S"], action: "Save preset" },
  { keys: ["?"], action: "Show keyboard shortcuts" },
  { keys: ["Ctrl", "D"], action: "Duplicate focused rule" },
  { keys: ["Ctrl", "G"], action: "Wrap focused rule in group" },
  { keys: ["Escape"], action: "Collapse focused group" },
] as const

interface KeyboardShortcutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KeyboardShortcutModal({
  open,
  onOpenChange,
}: KeyboardShortcutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Keyboard shortcuts</DialogTitle>
          <DialogDescription>
            Global builder shortcuts. Click a rule or group to focus it before
            using duplicate, wrap, or collapse shortcuts.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[min(60vh,24rem)] overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2 font-medium">Shortcut</th>
                <th className="pb-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {shortcuts.map((shortcut) => (
                <tr
                  key={shortcut.action}
                  className="border-b border-border/60 last:border-0"
                >
                  <td className="py-2.5">
                    <KbdGroup>
                      {shortcut.keys.map((key, index) => (
                        <Kbd key={`${shortcut.action}-${key}-${index}`}>
                          {key}
                        </Kbd>
                      ))}
                    </KbdGroup>
                  </td>
                  <td className="py-2.5 text-muted-foreground">
                    {shortcut.action}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
