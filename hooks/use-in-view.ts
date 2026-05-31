"use client"

import * as React from "react"

export function useInView<T extends HTMLElement>(
  options?: IntersectionObserverInit
) {
  const ref = React.useRef<T>(null)
  const [inView, setInView] = React.useState(false)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, ...options }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [options])

  return { ref, inView }
}
