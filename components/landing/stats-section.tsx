"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

const stats = [
  { value: 3, suffix: "", label: "Schemas" },
  { value: 414, suffix: "", label: "Mock records" },
  { value: 30, suffix: "+", label: "Operators" },
  { value: 3, suffix: "", label: "Output formats" },
]

function useCountUp(target: number, active: boolean, duration = 1200) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return

    let start: number | null = null
    let frame: number

    function step(timestamp: number) {
      if (start === null) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, active, duration])

  return count
}

function StatItem({
  value,
  suffix,
  label,
  active,
}: {
  value: number
  suffix: string
  label: string
  active: boolean
}) {
  const count = useCountUp(value, active)

  return (
    <div className="text-center">
      <p className="font-heading text-3xl font-semibold tabular-nums sm:text-4xl">
        {count}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

export function StatsSection() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className={cn(
            "grid grid-cols-2 gap-8 rounded-2xl border bg-card px-6 py-10 sm:grid-cols-4 sm:gap-4",
            active && "animate-in fade-in duration-700"
          )}
        >
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} active={active} />
          ))}
        </div>
      </div>
    </section>
  )
}
