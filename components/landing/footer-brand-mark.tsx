"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export function FooterBrandMark() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState(false)
  const [pos, setPos] = React.useState({ x: 50, y: 50 })

  function updatePosition(clientX: number, clientY: number) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return

    setPos({
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <div
      ref={ref}
      className="landing-footer-brand"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => {
        setActive(false)
        setPos({ x: 50, y: 50 })
      }}
      onMouseMove={(event) => updatePosition(event.clientX, event.clientY)}
      aria-hidden
    >
      <p
        className={cn("landing-footer-brand-text", active && "is-active")}
        style={
          {
            "--brand-x": `${pos.x}%`,
            "--brand-y": `${pos.y}%`,
          } as React.CSSProperties
        }
      >
        TOBi
      </p>
    </div>
  )
}
