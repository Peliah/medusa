"use client"

import * as React from "react"
import { CaretUpDownIcon, CheckIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import type { ValueInputProps } from "@/components/inputs/types"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface EnumSelectProps extends ValueInputProps {
  options: string[]
}

export function EnumSelect({
  value,
  onChange,
  options,
  invalid = false,
  className,
}: EnumSelectProps) {
  const [open, setOpen] = React.useState(false)
  const selected = typeof value === "string" ? value : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid}
          className={cn(
            "h-8 flex-1 justify-between px-2.5 text-xs font-normal",
            invalid && "border-destructive aria-invalid:border-destructive",
            className
          )}
        >
          <span className="truncate">
            {selected ?? (
              <span className="text-muted-foreground">Select value…</span>
            )}
          </span>
          <CaretUpDownIcon className="size-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search values…" className="h-9" />
          <CommandList>
            <CommandEmpty>No values found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => {
                    onChange(option)
                    setOpen(false)
                  }}
                  className="text-xs"
                >
                  <span className="flex-1 truncate">{option}</span>
                  <CheckIcon
                    className={cn(
                      "size-3.5",
                      selected === option ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
