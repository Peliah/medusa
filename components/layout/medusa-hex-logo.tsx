"use client"

import { cn } from "@/lib/utils"

export function MedusaHexLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("size-6 shrink-0 text-primary", className)}
    >
      <path
        d="M12 3.5 19.062 7.75v8.5L12 20.5 4.938 16.25v-8.5L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 8.25 15.5 10.25v4L12 16.25 8.5 14.25v-4L12 8.25Z"
        fill="currentColor"
        fillOpacity="0.35"
      />
    </svg>
  )
}
