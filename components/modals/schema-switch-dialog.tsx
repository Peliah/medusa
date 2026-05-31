"use client"

import * as React from "react"
import { ArrowsLeftRightIcon } from "@phosphor-icons/react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SCHEMA_SWITCH_MESSAGE } from "@/lib/schema-switch-preference"
import { useSchemaSwitchStore } from "@/store/schema-switch-store"

export function SchemaSwitchDialog() {
  const pending = useSchemaSwitchStore((state) => state.pending)
  const cancel = useSchemaSwitchStore((state) => state.cancel)
  const confirm = useSchemaSwitchStore((state) => state.confirm)
  const [dontAskAgain, setDontAskAgain] = React.useState(false)

  function handleOpenChange(open: boolean) {
    if (!open) {
      setDontAskAgain(false)
      cancel()
    }
  }

  function handleConfirm() {
    confirm(dontAskAgain)
    setDontAskAgain(false)
  }

  return (
    <AlertDialog open={pending !== null} onOpenChange={handleOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <ArrowsLeftRightIcon className="text-muted-foreground" />
          </AlertDialogMedia>
          <AlertDialogTitle>Switch schema?</AlertDialogTitle>
          <AlertDialogDescription>
            {SCHEMA_SWITCH_MESSAGE}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex items-center gap-2">
          <Checkbox
            id="schema-switch-skip-confirm"
            checked={dontAskAgain}
            onCheckedChange={(checked) => setDontAskAgain(checked === true)}
          />
          <Label
            htmlFor="schema-switch-skip-confirm"
            className="text-sm font-normal text-muted-foreground"
          >
            Don&apos;t ask again
          </Label>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Switch schema
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
